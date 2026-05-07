/**
 * /api/check — answer-kind dispatcher.
 *
 * Validates a submission, persists an attempt row, awards points on a
 * correct answer, and returns a kind-specific verdict envelope.
 *
 * Routing by `answer_kind`:
 *   numeric|fraction|exact -> lib/answer-check.ts
 *   mcq                    -> lib/check-mcq.ts
 *   freeform               -> lib/grade-freeform.ts (provider-agnostic)
 *   code                   -> lib/runner.ts (Piston) — every test must pass
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { createHash } from "crypto";
import { requireAnonId } from "@/lib/anon";
import {
  getLocalCachedGrade,
  getLocalQuestionById,
  recordLocalAttempt,
  setLocalCachedGrade,
} from "@/lib/local-dev";
import {
  ensureAnonUser,
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { checkAnswer, type NumericAnswerKind } from "@/lib/answer-check";
import { checkMcq } from "@/lib/check-mcq";
import {
  configuredGraderProvider,
  gradeFreeform,
  type GraderProvider,
} from "@/lib/grade-freeform";
import { runCode } from "@/lib/runner";
import type {
  CodeMeta,
  FreeformMeta,
  McqMeta,
  Topic,
} from "@/content/question-types";

const POINTS_BY_DIFFICULTY = [0, 5, 10, 20, 35, 60];

const Body = z.object({
  questionId: z.string().uuid(),
  /** For mcq the submission is the option id; for code it is the source. */
  submittedAnswer: z.string().min(1).max(20000),
  hintLevelsUsed: z.number().int().min(0).max(3).default(0),
});

type Verdict = {
  correct: boolean;
  attemptId: string;
  errorSignature: string;
  /** Optional kind-specific extras the UI may render. */
  feedback?: string;
  provider?: GraderProvider;
  results?: unknown;
  runner?: "piston" | "mock";
};

interface QuestionForGrading {
  id: string;
  topic: Topic;
  difficulty: number;
  answer_kind: string;
  answer_value: string | null;
  answer_tolerance: number | null;
  answer_meta: unknown;
  prompt_md: string;
  title: string;
  /** Only populated for the legacy track-aware award_correct fallback. */
  track?: string | null;
}

function hashAnswer(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

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
    return NextResponse.json({ error: "missing_session" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return await handleLocalDev(anonId, payload);
  }

  return await handleSupabase(anonId, payload);
}

// ---------------------------------------------------------------------------
// Supabase path
// ---------------------------------------------------------------------------

async function handleSupabase(
  anonId: string,
  payload: z.infer<typeof Body>
): Promise<Response> {
  const sb = getSupabaseAdmin();
  await ensureAnonUser(anonId);

  const { data: question, error: qErr } = await sb
    .from("questions")
    .select(
      "id, slug, track, topic, title, prompt_md, answer_kind, answer_value, answer_tolerance, answer_meta, difficulty"
    )
    .eq("id", payload.questionId)
    .single();

  if (qErr || !question) {
    return NextResponse.json({ error: "question_not_found" }, { status: 404 });
  }

  const q: QuestionForGrading = {
    id: question.id as string,
    topic: question.topic as Topic,
    difficulty: (question.difficulty as number) ?? 1,
    answer_kind: question.answer_kind as string,
    answer_value: (question.answer_value as string | null) ?? null,
    answer_tolerance: (question.answer_tolerance as number | null) ?? null,
    answer_meta: question.answer_meta,
    prompt_md: question.prompt_md as string,
    title: question.title as string,
    track: (question.track as string | null) ?? null,
  };

  const verdict = await evaluate(q, payload.submittedAnswer);

  const { data: attempt, error: aErr } = await sb
    .from("attempts")
    .insert({
      anon_user_id: anonId,
      question_id: q.id,
      submitted_answer: payload.submittedAnswer,
      is_correct: verdict.correct,
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

  // Cache freeform grades so identical resubmissions stay free.
  if (q.answer_kind === "freeform" && verdict.feedback && verdict.provider) {
    const hash = hashAnswer(payload.submittedAnswer);
    await sb
      .from("grade_cache")
      .upsert(
        {
          question_id: q.id,
          answer_hash: hash,
          passed: verdict.correct,
          feedback: verdict.feedback,
          provider: verdict.provider,
        },
        { onConflict: "question_id,answer_hash" }
      );
  }

  if (verdict.correct) {
    const points = pointsFor(q.difficulty, payload.hintLevelsUsed);
    // Try the v2 RPC first; if it's not deployed yet, fall back to the legacy
    // award_correct so installations still on 0001_init.sql keep working.
    const { error: rpcErr } = await sb.rpc("award_correct_v2", {
      p_anon: anonId,
      p_points: points,
      p_topic: q.topic,
    });
    if (rpcErr) {
      const { error: legacyErr } = await sb.rpc("award_correct", {
        p_anon: anonId,
        p_points: points,
        p_track: q.track ?? "researcher",
      });
      if (legacyErr) {
        console.warn(
          "award_correct fallback failed",
          legacyErr.message,
          "(v2 err:",
          rpcErr.message,
          ")"
        );
      }
    }
  }

  return NextResponse.json({
    correct: verdict.correct,
    attemptId: attempt.id as string,
    errorSignature: verdict.errorSignature,
    feedback: verdict.feedback,
    provider: verdict.provider,
    results: verdict.results,
    runner: verdict.runner,
  } satisfies Verdict);
}

// ---------------------------------------------------------------------------
// Local-dev path
// ---------------------------------------------------------------------------

async function handleLocalDev(
  anonId: string,
  payload: z.infer<typeof Body>
): Promise<Response> {
  const question = getLocalQuestionById(payload.questionId);
  if (!question) {
    return NextResponse.json({ error: "question_not_found" }, { status: 404 });
  }

  const q: QuestionForGrading = {
    id: question.id,
    topic: question.topic,
    difficulty: question.difficulty,
    answer_kind: question.answer_kind,
    answer_value: question.answer_value,
    answer_tolerance: question.answer_tolerance ?? null,
    answer_meta: question.answer_meta ?? null,
    prompt_md: question.prompt_md,
    title: question.title,
  };

  // Freeform grade cache (in-memory in local mode).
  if (q.answer_kind === "freeform") {
    const hash = hashAnswer(payload.submittedAnswer);
    const cached = getLocalCachedGrade(q.id, hash);
    if (cached) {
      const local = recordLocalAttempt({
        anonId,
        questionId: payload.questionId,
        submittedAnswer: payload.submittedAnswer,
        hintLevelsUsed: payload.hintLevelsUsed,
        precomputedCorrect: cached.passed,
        precomputedErrorSignature: `freeform:${hash.slice(0, 16)}`,
      });
      if (!local) {
        return NextResponse.json({ error: "question_not_found" }, { status: 404 });
      }
      return NextResponse.json({
        correct: cached.passed,
        attemptId: local.attempt.id,
        errorSignature: local.result.errorSignature,
        feedback: cached.feedback,
        provider: cached.provider as GraderProvider,
      } satisfies Verdict);
    }
  }

  const verdict = await evaluate(q, payload.submittedAnswer);

  const local = recordLocalAttempt({
    anonId,
    questionId: payload.questionId,
    submittedAnswer: payload.submittedAnswer,
    hintLevelsUsed: payload.hintLevelsUsed,
    precomputedCorrect: verdict.correct,
    precomputedErrorSignature: verdict.errorSignature,
  });

  if (!local) {
    return NextResponse.json({ error: "question_not_found" }, { status: 404 });
  }

  if (q.answer_kind === "freeform" && verdict.feedback && verdict.provider) {
    setLocalCachedGrade(q.id, hashAnswer(payload.submittedAnswer), {
      passed: verdict.correct,
      feedback: verdict.feedback,
      provider: verdict.provider,
    });
  }

  return NextResponse.json({
    correct: verdict.correct,
    attemptId: local.attempt.id,
    errorSignature: local.result.errorSignature,
    feedback: verdict.feedback,
    provider: verdict.provider,
    results: verdict.results,
    runner: verdict.runner,
  } satisfies Verdict);
}

// ---------------------------------------------------------------------------
// Kind-specific evaluation
// ---------------------------------------------------------------------------

async function evaluate(
  q: QuestionForGrading,
  submitted: string
): Promise<Omit<Verdict, "attemptId">> {
  const kind = q.answer_kind;

  if (kind === "numeric" || kind === "fraction" || kind === "exact") {
    const r = checkAnswer(
      {
        answer_kind: kind as NumericAnswerKind,
        answer_value: q.answer_value ?? "",
        answer_tolerance: q.answer_tolerance,
      },
      submitted
    );
    return { correct: r.correct, errorSignature: r.errorSignature };
  }

  if (kind === "mcq") {
    const meta = (q.answer_meta as McqMeta | null) ?? { options: [] };
    const r = checkMcq(
      { answer_value: q.answer_value ?? "", answer_meta: meta },
      submitted
    );
    return { correct: r.correct, errorSignature: r.errorSignature };
  }

  if (kind === "freeform") {
    const meta = (q.answer_meta as FreeformMeta | null) ?? { rubric: [] };
    const provider = configuredGraderProvider();
    const result = await gradeFreeform({
      questionTitle: q.title,
      questionPromptMd: q.prompt_md,
      rubric: meta.rubric ?? [],
      reference: meta.reference_solution_md ?? null,
      answer: submitted,
      minWords: meta.min_words,
      providerOverride: provider,
    });
    const sig = `freeform:${createHash("sha256")
      .update(submitted)
      .digest("hex")
      .slice(0, 16)}`;
    return {
      correct: result.passed,
      errorSignature: sig,
      feedback: result.feedback,
      provider: result.provider,
    };
  }

  if (kind === "code") {
    const meta = q.answer_meta as CodeMeta | null;
    if (!meta) {
      return { correct: false, errorSignature: "code:no_meta" };
    }
    const useMock = !process.env.CODE_RUNNER_URL;
    const result = await runCode({ meta, source: submitted, useMock });
    return {
      correct: result.passed,
      errorSignature: `code:${result.results.length}-${result.results.filter((r) => r.passed).length}`,
      results: result.results,
      runner: result.runner,
      feedback: result.message,
    };
  }

  return { correct: false, errorSignature: `unknown_kind:${kind}` };
}

function pointsFor(difficulty: number, hintLevelsUsed: number): number {
  const base =
    POINTS_BY_DIFFICULTY[Math.min(difficulty, POINTS_BY_DIFFICULTY.length - 1)] ??
    5;
  return Math.max(1, base - hintLevelsUsed * Math.ceil(base / 4));
}
