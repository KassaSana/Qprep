import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAnonId } from "@/lib/anon";
import {
  bumpLocalNudgeUsage,
  generateLocalNudge,
  getLocalAttemptById,
  getLocalCachedHint,
  getLocalDailyNudgeLimit,
  getLocalQuestionById,
  setLocalCachedHint,
} from "@/lib/local-dev";
import {
  ensureAnonUser,
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import {
  generateNudge,
  isAnthropicConfigured,
  type NudgeLevel,
} from "@/lib/anthropic";

const DAILY_NUDGE_LIMIT = 30;

const Body = z.object({
  attemptId: z.string().uuid(),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
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
    return NextResponse.json({ error: "missing_session" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    const usageCount = bumpLocalNudgeUsage(anonId);
    const dailyLimit = getLocalDailyNudgeLimit();
    if (usageCount > dailyLimit) {
      return NextResponse.json(
        {
          error: "rate_limited",
          message: `Daily nudge limit reached (${dailyLimit}).`,
        },
        { status: 429 }
      );
    }

    const attempt = getLocalAttemptById(anonId, payload.attemptId);
    if (!attempt) {
      return NextResponse.json({ error: "attempt_not_found" }, { status: 404 });
    }
    if (attempt.is_correct) {
      return NextResponse.json(
        { error: "already_correct", message: "No hints needed - you got it." },
        { status: 400 }
      );
    }

    const question = getLocalQuestionById(attempt.question_id);
    if (!question) {
      return NextResponse.json({ error: "question_missing" }, { status: 500 });
    }

    const errorSignature = `${attempt.submitted_answer.trim().toLowerCase()}|L${payload.level}`;
    const cached = getLocalCachedHint(question.id, errorSignature, payload.level);
    if (cached) {
      return NextResponse.json({
        hint: cached,
        cached: true,
        level: payload.level,
      });
    }

    const hint =
      isAnthropicConfigured()
        ? await generateNudge({
            level: payload.level as NudgeLevel,
            questionTitle: question.title,
            questionPromptMd: question.prompt_md,
            submittedAnswer: attempt.submitted_answer,
            canonicalAnswer: question.answer_value,
          })
        : generateLocalNudge({
            level: payload.level as NudgeLevel,
            questionId: question.id,
            questionTitle: question.title,
            questionPromptMd: question.prompt_md,
            submittedAnswer: attempt.submitted_answer,
            canonicalAnswer: question.answer_value,
          });

    setLocalCachedHint(question.id, errorSignature, payload.level, hint);
    return NextResponse.json({
      hint,
      cached: false,
      level: payload.level,
    });
  }

  const sb = getSupabaseAdmin();
  await ensureAnonUser(anonId);

  // Rate limit before any expensive work.
  const { data: usageCount, error: usageErr } = await sb.rpc(
    "bump_nudge_usage",
    { p_anon: anonId }
  );
  if (usageErr) {
    return NextResponse.json(
      { error: "usage_check_failed", details: usageErr.message },
      { status: 500 }
    );
  }
  if ((usageCount as number) > DAILY_NUDGE_LIMIT) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message: `Daily nudge limit reached (${DAILY_NUDGE_LIMIT}). Come back tomorrow or upgrade to keep practising.`,
      },
      { status: 429 }
    );
  }

  // Fetch the attempt and its question. RLS-safe because we run with the
  // service role and gate by anonId ourselves.
  const { data: attempt, error: aErr } = await sb
    .from("attempts")
    .select(
      `id, anon_user_id, submitted_answer, is_correct,
       question:questions(id, title, prompt_md, answer_value)`
    )
    .eq("id", payload.attemptId)
    .single();

  if (aErr || !attempt) {
    return NextResponse.json({ error: "attempt_not_found" }, { status: 404 });
  }
  if (attempt.anon_user_id !== anonId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (attempt.is_correct) {
    return NextResponse.json(
      { error: "already_correct", message: "No hints needed — you got it." },
      { status: 400 }
    );
  }

  const question = Array.isArray(attempt.question)
    ? attempt.question[0]
    : attempt.question;
  if (!question) {
    return NextResponse.json({ error: "question_missing" }, { status: 500 });
  }

  // Build a stable error signature scoped to (question, normalized_wrong_answer, level).
  const errorSignature = `${(attempt.submitted_answer as string).trim().toLowerCase()}|L${payload.level}`;

  const { data: cached } = await sb
    .from("hints_cache")
    .select("hint_text")
    .eq("question_id", question.id)
    .eq("error_signature", errorSignature)
    .eq("level", payload.level)
    .maybeSingle();

  if (cached?.hint_text) {
    return NextResponse.json({
      hint: cached.hint_text as string,
      cached: true,
      level: payload.level,
    });
  }

  let hint: string;
  try {
    hint = await generateNudge({
      level: payload.level as NudgeLevel,
      questionTitle: question.title as string,
      questionPromptMd: question.prompt_md as string,
      submittedAnswer: attempt.submitted_answer as string,
      canonicalAnswer: question.answer_value as string,
    });
  } catch (err) {
    console.error("generateNudge failed", err);
    return NextResponse.json(
      { error: "model_call_failed", details: (err as Error).message },
      { status: 502 }
    );
  }

  if (!hint) {
    return NextResponse.json(
      { error: "empty_hint" },
      { status: 502 }
    );
  }

  // Store it for next time.
  await sb.from("hints_cache").insert({
    question_id: question.id,
    error_signature: errorSignature,
    level: payload.level,
    hint_text: hint,
  });

  return NextResponse.json({
    hint,
    cached: false,
    level: payload.level,
  });
}
