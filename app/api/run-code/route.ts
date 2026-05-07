/**
 * /api/run-code — execute a code submission against the question's test
 * cases without recording an attempt.
 *
 * The CodeAnswerForm "Run" button hits this endpoint to give the user
 * fast feedback while iterating. "Submit" still goes through /api/check
 * so it gets logged uniformly with every other answer kind.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAnonId } from "@/lib/anon";
import { getLocalQuestionById } from "@/lib/local-dev";
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { runCode } from "@/lib/runner";
import type { CodeMeta } from "@/content/question-types";

const Body = z.object({
  questionId: z.string().uuid(),
  source: z.string().min(1).max(20000),
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

  try {
    await requireAnonId();
  } catch {
    return NextResponse.json({ error: "missing_session" }, { status: 401 });
  }

  let meta: CodeMeta | null = null;
  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin();
    const { data: row, error } = await sb
      .from("questions")
      .select("answer_kind, answer_meta")
      .eq("id", payload.questionId)
      .single();
    if (error || !row) {
      return NextResponse.json({ error: "question_not_found" }, { status: 404 });
    }
    if (row.answer_kind !== "code" || !row.answer_meta) {
      return NextResponse.json(
        { error: "wrong_kind", details: `answer_kind is ${row.answer_kind}` },
        { status: 400 }
      );
    }
    meta = row.answer_meta as CodeMeta;
  } else {
    const q = getLocalQuestionById(payload.questionId);
    if (!q) {
      return NextResponse.json({ error: "question_not_found" }, { status: 404 });
    }
    if (q.answer_kind !== "code" || !q.answer_meta) {
      return NextResponse.json(
        { error: "wrong_kind", details: `answer_kind is ${q.answer_kind}` },
        { status: 400 }
      );
    }
    meta = q.answer_meta as CodeMeta;
  }

  const useMock = !process.env.CODE_RUNNER_URL;
  const result = await runCode({ meta, source: payload.source, useMock });

  return NextResponse.json(result);
}
