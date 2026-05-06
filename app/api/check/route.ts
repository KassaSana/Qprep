import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAnonId } from "@/lib/anon";
import { recordLocalAttempt } from "@/lib/local-dev";
import {
  ensureAnonUser,
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { checkAnswer, type AnswerKind } from "@/lib/answer-check";

const POINTS_BY_DIFFICULTY = [0, 5, 10, 20, 35, 60];

const Body = z.object({
  questionId: z.string().uuid(),
  submittedAnswer: z.string().min(1).max(200),
  hintLevelsUsed: z.number().int().min(0).max(3).default(0),
});

export async function POST(req: Request) {
  let payload: z.infer<typeof Body>;
  try {
    payload = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json(
      { error: "invalid_request", details: (err as Error).message },
      { status: 400 }
    );
  }

  let anonId: string;
  try {
    anonId = await requireAnonId();
  } catch {
    return NextResponse.json(
      { error: "missing_session" },
      { status: 401 }
    );
  }

  if (!isSupabaseConfigured()) {
    const local = recordLocalAttempt({
      anonId,
      questionId: payload.questionId,
      submittedAnswer: payload.submittedAnswer,
      hintLevelsUsed: payload.hintLevelsUsed,
    });

    if (!local) {
      return NextResponse.json({ error: "question_not_found" }, { status: 404 });
    }

    return NextResponse.json({
      correct: local.result.correct,
      attemptId: local.attempt.id,
      errorSignature: local.result.errorSignature,
    });
  }

  const sb = getSupabaseAdmin();
  await ensureAnonUser(anonId);

  const { data: question, error: qErr } = await sb
    .from("questions")
    .select("id, slug, answer_kind, answer_value, answer_tolerance, difficulty")
    .eq("id", payload.questionId)
    .single();

  if (qErr || !question) {
    return NextResponse.json({ error: "question_not_found" }, { status: 404 });
  }

  const result = checkAnswer(
    {
      answer_kind: question.answer_kind as AnswerKind,
      answer_value: question.answer_value as string,
      answer_tolerance: question.answer_tolerance as number | null,
    },
    payload.submittedAnswer
  );

  const { data: attempt, error: aErr } = await sb
    .from("attempts")
    .insert({
      anon_user_id: anonId,
      question_id: question.id,
      submitted_answer: payload.submittedAnswer,
      is_correct: result.correct,
      hint_levels_used: payload.hintLevelsUsed,
    })
    .select("id")
    .single();

  if (aErr || !attempt) {
    return NextResponse.json(
      { error: "attempt_log_failed", details: aErr?.message },
      { status: 500 }
    );
  }

  if (result.correct) {
    const difficulty = (question.difficulty as number) ?? 1;
    const basePoints =
      POINTS_BY_DIFFICULTY[Math.min(difficulty, POINTS_BY_DIFFICULTY.length - 1)] ?? 5;
    // Hints reduce reward but never to zero.
    const points = Math.max(1, basePoints - payload.hintLevelsUsed * Math.ceil(basePoints / 4));
    const { error: rpcErr } = await sb.rpc("award_correct", {
      p_anon: anonId,
      p_points: points,
    });
    if (rpcErr) {
      console.warn("award_correct rpc failed", rpcErr.message);
    }
  }

  return NextResponse.json({
    correct: result.correct,
    attemptId: attempt.id as string,
    errorSignature: result.errorSignature,
  });
}
