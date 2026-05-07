/**
 * MCQ (multiple-choice) answer validation.
 *
 * The submitted answer is the `id` of a chosen option. We compare against
 * the canonical `answer_value` (which is the id of the correct option, per
 * the v2 schema) — and as a defense against drift between `answer_value`
 * and `answer_meta.options[].correct`, we also confirm the chosen option
 * carries `correct: true`.
 *
 * Returns the same `CheckResult` shape as `lib/answer-check.ts` so the
 * dispatcher and the hint cache key off the same fields uniformly.
 */

import type { McqMeta, McqOption } from "@/content/question-types";
import type { CheckResult } from "@/lib/answer-check";

export interface McqAnswerSpec {
  answer_value: string;
  answer_meta: McqMeta;
}

function normalizeId(s: string): string {
  return (s ?? "").trim().toLowerCase();
}

export function checkMcq(spec: McqAnswerSpec, submitted: string): CheckResult {
  const submittedId = normalizeId(submitted);
  const targetId = normalizeId(spec.answer_value);

  const options: McqOption[] = spec.answer_meta?.options ?? [];
  const chosen = options.find((o) => normalizeId(o.id) === submittedId);

  const matchesCanonical = submittedId === targetId;
  const optionMarkedCorrect = !!chosen?.correct;

  const correct = matchesCanonical && optionMarkedCorrect;

  return {
    correct,
    normalized: submittedId || null,
    errorSignature: `mcq:${submittedId || "empty"}`,
  };
}

export function findMcqOption(
  meta: McqMeta,
  optionId: string
): McqOption | undefined {
  const id = normalizeId(optionId);
  return meta.options.find((o) => normalizeId(o.id) === id);
}
