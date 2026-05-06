/**
 * Answer validation for QPrep.
 *
 * Three "kinds" of answers are supported on a Question row:
 *
 *   numeric  -> answer_value parses as a float, compared with answer_tolerance
 *   fraction -> answer_value is "p/q" (or any of the numeric forms below);
 *               the user's answer is normalized to a float and compared with
 *               tolerance. This lets "3/8", "0.375", and "37.5%" all match.
 *   exact    -> case-insensitive, whitespace-collapsed string compare
 *
 * Returns a small `error_signature` string for incorrect attempts. The
 * signature is what we hash by in `hints_cache`, so equivalent wrong answers
 * (e.g. "1/4" vs "0.25") share a cached hint.
 */

export type AnswerKind = "numeric" | "fraction" | "exact";

export interface QuestionAnswerSpec {
  answer_kind: AnswerKind;
  answer_value: string;
  answer_tolerance: number | null;
}

export interface CheckResult {
  correct: boolean;
  /** Stable string used as a cache key for hints. */
  errorSignature: string;
  /** Float form of the user's answer, when one could be parsed. */
  normalized: number | string | null;
}

const DEFAULT_TOLERANCE = 1e-3;

/** Strip whitespace, lowercase, collapse internal spaces. */
function normalizeString(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Try to interpret `raw` as a real number. Accepts:
 *   - decimals: "0.375", "-2.5"
 *   - integers: "7"
 *   - fractions: "3/8", "-1/4"
 *   - mixed:    "1 1/2"
 *   - percent:  "37.5%"
 *
 * Returns null if it can't be parsed.
 */
export function parseNumeric(raw: string): number | null {
  if (raw == null) return null;
  let s = raw.trim();
  if (!s) return null;

  let percent = false;
  if (s.endsWith("%")) {
    percent = true;
    s = s.slice(0, -1).trim();
  }

  // mixed number: "1 1/2"
  const mixed = s.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    const whole = parseInt(mixed[1], 10);
    const num = parseInt(mixed[2], 10);
    const den = parseInt(mixed[3], 10);
    if (den === 0) return null;
    const sign = whole < 0 ? -1 : 1;
    const v = Math.abs(whole) + num / den;
    return (sign * v) / (percent ? 100 : 1);
  }

  // simple fraction: "3/8"
  const frac = s.match(/^(-?\d+)\/(-?\d+)$/);
  if (frac) {
    const num = parseInt(frac[1], 10);
    const den = parseInt(frac[2], 10);
    if (den === 0) return null;
    const v = num / den;
    return percent ? v / 100 : v;
  }

  // decimal / integer
  if (/^-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?$/.test(s)) {
    const v = parseFloat(s);
    if (Number.isFinite(v)) return percent ? v / 100 : v;
  }

  return null;
}

function tolerance(spec: QuestionAnswerSpec): number {
  if (spec.answer_tolerance != null && spec.answer_tolerance >= 0) {
    return spec.answer_tolerance;
  }
  return DEFAULT_TOLERANCE;
}

/**
 * Run validation. Always returns a CheckResult — never throws on bad input;
 * a malformed user answer simply yields `correct: false`.
 */
export function checkAnswer(
  spec: QuestionAnswerSpec,
  submitted: string
): CheckResult {
  const trimmed = (submitted ?? "").trim();

  if (spec.answer_kind === "exact") {
    const u = normalizeString(trimmed);
    const t = normalizeString(spec.answer_value);
    return {
      correct: u === t,
      normalized: u,
      errorSignature: `exact:${u}`,
    };
  }

  // numeric or fraction — both go through parseNumeric on both sides.
  const target = parseNumeric(spec.answer_value);
  const value = parseNumeric(trimmed);

  if (target == null) {
    // Bad question data: refuse to mark anything correct, but still produce
    // a deterministic error signature so the hint cache works.
    return {
      correct: false,
      normalized: value,
      errorSignature: `unparseable_target:${normalizeString(trimmed)}`,
    };
  }
  if (value == null) {
    return {
      correct: false,
      normalized: null,
      errorSignature: `unparseable:${normalizeString(trimmed)}`,
    };
  }

  const tol = tolerance(spec);
  const correct = Math.abs(value - target) <= tol;
  // Round the normalized value to a stable bucket so "0.3334" and "0.33340"
  // produce the same signature.
  const bucket = Math.round(value * 1e6) / 1e6;
  return {
    correct,
    normalized: value,
    errorSignature: `num:${bucket}`,
  };
}
