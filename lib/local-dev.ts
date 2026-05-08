/**
 * Local-dev fallback for the entire app.
 *
 * When `.env.local` still has placeholder values, the app boots in this
 * mode: questions come from the topic-keyed seed bundle, attempts and
 * profile updates live in process memory, and the freeform/code paths
 * use the keyword grader and a mock Piston runner respectively.
 *
 * This module's surface mirrors the Supabase paths so the API routes and
 * pages can branch on `isSupabaseConfigured()` and otherwise call the
 * same shapes.
 */

import type {
  PlaylistDef,
  SeedQuestion,
  TargetRole,
  Topic,
} from "@/content/question-types";
import { inferTargetRolesFromTopic } from "@/content/question-types";
import { ALL_SEED_QUESTIONS } from "@/content/seed";
import { PLAYLISTS } from "@/content/playlists";
import { checkAnswer } from "@/lib/answer-check";
import { checkMcq } from "@/lib/check-mcq";
import { scrubAnswer, type NudgeInput } from "@/lib/anthropic";

export interface LocalQuestion extends Omit<SeedQuestion, "answer_value"> {
  id: string;
  /**
   * Stored as `string | null` to match the v2 schema (code/freeform may
   * not have an answer_value). For numeric/fraction/exact/mcq it's still
   * a string and matches the original SeedQuestion field exactly.
   */
  answer_value: string | null;
}

interface LocalAttempt {
  id: string;
  anon_user_id: string;
  question_id: string;
  submitted_answer: string;
  is_correct: boolean;
  hint_levels_used: number;
  created_at: string;
}

interface LocalProfile {
  streak_count: number;
  total_points: number;
  /** Per-topic XP-style level. Replaces the v1 per-track levels. */
  topic_levels: Partial<Record<Topic, number>>;
  last_correct_at: string | null;
}

interface CachedHint {
  hint_text: string;
}

interface CachedGrade {
  passed: boolean;
  feedback: string;
  provider: string;
}

const POINTS_BY_DIFFICULTY = [0, 5, 10, 20, 35, 60];
const DAILY_NUDGE_LIMIT = 30;

const localQuestions: LocalQuestion[] = ALL_SEED_QUESTIONS.map((q, idx) => ({
  ...q,
  id: `00000000-0000-4000-8000-${String(idx + 1).padStart(12, "0")}`,
  answer_value: (q as { answer_value?: string | null }).answer_value ?? null,
  target_roles:
    (q as { target_roles?: TargetRole[] }).target_roles ??
    inferTargetRolesFromTopic(q.topic),
}));

const attemptsByUser = new Map<string, LocalAttempt[]>();
const profilesByUser = new Map<string, LocalProfile>();
const hintsCache = new Map<string, CachedHint>();
const gradeCache = new Map<string, CachedGrade>();
const usageByUserDay = new Map<string, number>();

function defaultProfile(): LocalProfile {
  return {
    streak_count: 0,
    total_points: 0,
    topic_levels: {},
    last_correct_at: null,
  };
}

function todayKey(anonId: string): string {
  return `${anonId}:${new Date().toISOString().slice(0, 10)}`;
}

function levelFromPoints(totalPoints: number): number {
  return 1 + Math.floor(totalPoints / 100);
}

function awardLocalCorrect(
  anonId: string,
  topic: Topic,
  difficulty: number,
  hintLevelsUsed: number
): LocalProfile {
  const profile = profilesByUser.get(anonId) ?? defaultProfile();
  const basePoints =
    POINTS_BY_DIFFICULTY[Math.min(difficulty, POINTS_BY_DIFFICULTY.length - 1)] ?? 5;
  const awarded = Math.max(
    1,
    basePoints - hintLevelsUsed * Math.ceil(basePoints / 4)
  );
  const now = new Date();

  const last = profile.last_correct_at ? new Date(profile.last_correct_at) : null;
  const withinStreakWindow =
    !!last && now.getTime() - last.getTime() <= 36 * 60 * 60 * 1000;

  profile.total_points += awarded;
  profile.streak_count = withinStreakWindow ? profile.streak_count + 1 : 1;
  profile.last_correct_at = now.toISOString();
  const nextLevel = levelFromPoints(profile.total_points);
  const current = profile.topic_levels[topic] ?? 1;
  profile.topic_levels[topic] = Math.max(current, nextLevel);

  profilesByUser.set(anonId, profile);
  return profile;
}

function ensureProfile(anonId: string): LocalProfile {
  const existing = profilesByUser.get(anonId);
  if (existing) return existing;
  const fresh = defaultProfile();
  profilesByUser.set(anonId, fresh);
  return fresh;
}

// ---------------------------------------------------------------------------
// Question lookups
// ---------------------------------------------------------------------------

export function getAllLocalQuestions(): LocalQuestion[] {
  return localQuestions;
}

export function getLocalQuestionsForTopic(topic: Topic): LocalQuestion[] {
  return localQuestions.filter((q) => q.topic === topic);
}

export function getLocalQuestionBySlug(slug: string): LocalQuestion | undefined {
  return localQuestions.find((q) => q.slug === slug);
}

export function getLocalQuestionById(id: string): LocalQuestion | undefined {
  return localQuestions.find((q) => q.id === id);
}

export function getLocalQuestionByAnyKey(
  key: string
): LocalQuestion | undefined {
  return getLocalQuestionById(key) ?? getLocalQuestionBySlug(key);
}

// ---------------------------------------------------------------------------
// Profile + attempts
// ---------------------------------------------------------------------------

export function getLocalProfile(anonId: string | null): LocalProfile {
  if (!anonId) return defaultProfile();
  return ensureProfile(anonId);
}

export function getLocalAttemptsForUser(anonId: string | null): LocalAttempt[] {
  if (!anonId) return [];
  return [...(attemptsByUser.get(anonId) ?? [])].sort((a, b) =>
    b.created_at.localeCompare(a.created_at)
  );
}

export function getLocalAttemptsForQuestion(
  anonId: string | null,
  questionId: string
): LocalAttempt[] {
  return getLocalAttemptsForUser(anonId).filter(
    (a) => a.question_id === questionId
  );
}

export function getLocalAttemptById(
  anonId: string,
  attemptId: string
): LocalAttempt | undefined {
  return (attemptsByUser.get(anonId) ?? []).find((a) => a.id === attemptId);
}

interface RecordLocalAttemptInput {
  anonId: string;
  questionId: string;
  submittedAnswer: string;
  hintLevelsUsed: number;
  /** Override correctness — used for freeform/code where the kind-specific
   *  evaluator already produced a verdict before we hit this writer. */
  precomputedCorrect?: boolean;
  precomputedErrorSignature?: string;
}

export function recordLocalAttempt(input: RecordLocalAttemptInput) {
  const question = getLocalQuestionById(input.questionId);
  if (!question) return null;

  ensureProfile(input.anonId);

  let correct: boolean;
  let errorSignature: string;

  if (typeof input.precomputedCorrect === "boolean") {
    correct = input.precomputedCorrect;
    errorSignature =
      input.precomputedErrorSignature ??
      `${question.answer_kind}:${input.submittedAnswer.trim().toLowerCase()}`;
  } else if (question.answer_kind === "mcq") {
    const meta =
      question.answer_meta && "options" in question.answer_meta
        ? question.answer_meta
        : { options: [] };
    const r = checkMcq(
      {
        answer_value: question.answer_value ?? "",
        answer_meta: meta,
      },
      input.submittedAnswer
    );
    correct = r.correct;
    errorSignature = r.errorSignature;
  } else if (
    question.answer_kind === "numeric" ||
    question.answer_kind === "fraction" ||
    question.answer_kind === "exact"
  ) {
    const r = checkAnswer(
      {
        answer_kind: question.answer_kind,
        answer_value: question.answer_value ?? "",
        answer_tolerance: question.answer_tolerance ?? null,
      },
      input.submittedAnswer
    );
    correct = r.correct;
    errorSignature = r.errorSignature;
  } else {
    // freeform / code without a precomputed verdict: refuse to mark correct.
    correct = false;
    errorSignature = `unevaluated:${question.answer_kind}`;
  }

  const attempt: LocalAttempt = {
    id: crypto.randomUUID(),
    anon_user_id: input.anonId,
    question_id: question.id,
    submitted_answer: input.submittedAnswer,
    is_correct: correct,
    hint_levels_used: input.hintLevelsUsed,
    created_at: new Date().toISOString(),
  };

  const list = attemptsByUser.get(input.anonId) ?? [];
  list.unshift(attempt);
  attemptsByUser.set(input.anonId, list);

  if (correct) {
    awardLocalCorrect(
      input.anonId,
      question.topic,
      question.difficulty,
      input.hintLevelsUsed
    );
  }

  return {
    attempt,
    result: { correct, errorSignature },
    question,
  };
}

// ---------------------------------------------------------------------------
// Nudge usage + hint cache
// ---------------------------------------------------------------------------

export function bumpLocalNudgeUsage(anonId: string): number {
  const key = todayKey(anonId);
  const next = (usageByUserDay.get(key) ?? 0) + 1;
  usageByUserDay.set(key, next);
  return next;
}

export function getLocalDailyNudgeLimit(): number {
  return DAILY_NUDGE_LIMIT;
}

function hintCacheKey(questionId: string, errorSignature: string, level: number) {
  return `${questionId}:${errorSignature}:${level}`;
}

export function getLocalCachedHint(
  questionId: string,
  errorSignature: string,
  level: number
): string | null {
  return (
    hintsCache.get(hintCacheKey(questionId, errorSignature, level))?.hint_text ??
    null
  );
}

export function setLocalCachedHint(
  questionId: string,
  errorSignature: string,
  level: number,
  hintText: string
) {
  hintsCache.set(hintCacheKey(questionId, errorSignature, level), {
    hint_text: hintText,
  });
}

// ---------------------------------------------------------------------------
// Grade cache (freeform)
// ---------------------------------------------------------------------------

export function getLocalCachedGrade(
  questionId: string,
  answerHash: string
): CachedGrade | null {
  return gradeCache.get(`${questionId}:${answerHash}`) ?? null;
}

export function setLocalCachedGrade(
  questionId: string,
  answerHash: string,
  grade: CachedGrade
) {
  gradeCache.set(`${questionId}:${answerHash}`, grade);
}

// ---------------------------------------------------------------------------
// Playlists
// ---------------------------------------------------------------------------

export interface LocalPlaylist extends PlaylistDef {
  id: string;
}

const localPlaylists: LocalPlaylist[] = PLAYLISTS.map((p, idx) => ({
  ...p,
  id: `00000000-0000-4000-9000-${String(idx + 1).padStart(12, "0")}`,
}));

export function getLocalPlaylists(): LocalPlaylist[] {
  return localPlaylists;
}

export function getLocalPlaylistBySlug(slug: string): LocalPlaylist | undefined {
  return localPlaylists.find((p) => p.slug === slug);
}

export function getLocalPlaylistQuestions(slug: string): LocalQuestion[] {
  const pl = getLocalPlaylistBySlug(slug);
  if (!pl) return [];
  return pl.question_slugs
    .map((qs) => getLocalQuestionBySlug(qs))
    .filter((q): q is LocalQuestion => !!q);
}

// ---------------------------------------------------------------------------
// Tag-driven nudge generator (offline + no Anthropic key)
// ---------------------------------------------------------------------------

function tagDrivenHint(question: LocalQuestion, level: 1 | 2 | 3): string {
  const tags = new Set(question.tags);

  if (tags.has("bayes")) {
    if (level === 1) {
      return "Separate the prior, the likelihood, and the total probability of the observed event before you simplify anything.";
    }
    if (level === 2) {
      return "Write down Bayes' Theorem explicitly and expand the denominator as all ways the observed event can happen.";
    }
    return "Start with the denominator as the sum of the true-positive path and the false-positive path before you compare terms.";
  }

  if (tags.has("expectation") || tags.has("linearity-of-expectation")) {
    if (level === 1) {
      return "Don't jump to a number yet; first express the random quantity cleanly in terms of states or stopping times.";
    }
    if (level === 2) {
      return "Write the expectation directly as either $E[X] = \\sum x p(x)$ or a recursion on the current state before solving.";
    }
    return "Your next useful intermediate step is the full recurrence or summation, not the final simplified value.";
  }

  if (tags.has("random-walk") || tags.has("martingale")) {
    if (level === 1) {
      return "Treat this as a state-based process with boundary conditions instead of trying to guess the result from symmetry alone.";
    }
    if (level === 2) {
      return "Set up the hitting-probability recursion or the standard gambler's-ruin formula before substituting the endpoints.";
    }
    return "Write the boundary values first and then solve the interior relation that connects neighboring states.";
  }

  if (tags.has("theorem-recall") || tags.has("optimal-stopping")) {
    if (level === 1) {
      return "Focus on the asymptotic reject-then-select strategy rather than the exact finite-$n$ proof details.";
    }
    if (level === 2) {
      return "Name the classical optimal-stopping result associated with the $1/e$ threshold rule.";
    }
    return "The keyword you want is the famous hiring problem studied in optimal stopping.";
  }

  if (tags.has("combinatorics") || tags.has("uniform")) {
    if (level === 1) {
      return "Make sure your sample space is the right one before you count favorable outcomes.";
    }
    if (level === 2) {
      return "Count the total equally likely outcomes first, then count the favorable cases separately.";
    }
    return "Your next intermediate quantity should be the total number of equally likely outcomes in the sample space.";
  }

  if (tags.has("ev") || tags.has("risk-reward")) {
    if (level === 1) {
      return "Separate upside, downside, and their probabilities before you do any arithmetic.";
    }
    if (level === 2) {
      return "Write expected value explicitly as probability-weighted payoff minus any fixed cost to enter the trade.";
    }
    return "Your next intermediate step is the full EV expression with each scenario written out term by term.";
  }

  if (tags.has("mental-math") || tags.has("percentages") || tags.has("bps")) {
    if (level === 1) {
      return "Use benchmark percentages like $1\\%$, $10\\%$, or $50\\%$ first, then scale from there mentally.";
    }
    if (level === 2) {
      return "Rewrite the computation into an easy base unit, such as basis points or one percent, before you scale.";
    }
    return "Your next intermediate number should be the clean benchmark quantity before you adjust it up or down.";
  }

  if (tags.has("signal-combination")) {
    if (level === 1) {
      return "Break the outcome into the three disjoint cases: both right, both wrong, and split signals.";
    }
    if (level === 2) {
      return "Apply the law of total probability across agreement and tie cases, then handle the tiebreak separately.";
    }
    return "Your next intermediate quantity should be the probability of a tie, because that is the only part where the coin flip matters.";
  }

  if (
    tags.has("hashmap") ||
    tags.has("arrays") ||
    tags.has("stack") ||
    tags.has("strings") ||
    tags.has("design") ||
    tags.has("linked-list")
  ) {
    if (level === 1) {
      return "First decide on the right data structure: a hash map for $O(1)$ lookups, a stack for matched pairs, or a linked list for $O(1)$ removal.";
    }
    if (level === 2) {
      return "Write the loop invariant — what each entry in your data structure represents at the moment of insertion — before coding.";
    }
    return "Your next intermediate step is to handle the smallest non-trivial test case by hand and confirm the data-structure operations match.";
  }

  if (
    tags.has("synchronization") ||
    tags.has("deadlock") ||
    tags.has("memory-model") ||
    tags.has("condition-variables") ||
    tags.has("semaphores") ||
    tags.has("singleton") ||
    tags.has("lock-free")
  ) {
    if (level === 1) {
      return "Identify exactly which invariant breaks under interleaved execution before reaching for a primitive.";
    }
    if (level === 2) {
      return "Match the right primitive to that invariant: a mutex for shared state, condition variables for waiting, atomics with acquire/release for ordering.";
    }
    return "Your next intermediate step is to enumerate the bad interleaving and show how your primitive prevents exactly that interleaving.";
  }

  if (tags.has("lld") || tags.has("oop") || tags.has("encoding")) {
    if (level === 1) {
      return "Sketch the entities and their responsibilities first; the data structures fall out of that, not the other way around.";
    }
    if (level === 2) {
      return "Once entities are clear, give each one a single primary method (park/unpark, shorten/expand, subscribe/publish) and lock concurrency at the smallest aggregate that needs it.";
    }
    return "Your next intermediate step is the full method signature on each class, including the return type and the locking scope.";
  }

  if (tags.has("clt") || tags.has("variance") || tags.has("order-statistics")) {
    if (level === 1) {
      return "Identify which moment or limit theorem the question is really probing — variance scaling, the CLT, or the distribution of the min/max.";
    }
    if (level === 2) {
      return "Write the relevant formula directly: $\\mathrm{Var}(X) = E[X^2] - E[X]^2$, the CLT scaling $\\sqrt{n}$, or the order-statistic CDF.";
    }
    return "Your next intermediate step is to plug the parameters into that formula symbolically before you simplify.";
  }

  if (level === 1) {
    return "Step back and identify exactly what event or random variable the question is asking you to compute.";
  }
  if (level === 2) {
    return "Write the governing formula first and only then plug in the probabilities or counts from the prompt.";
  }
  return "Your next step should be one clean intermediate quantity, such as the sample-space size, a conditioning split, or a recurrence.";
}

export function generateLocalNudge(
  input: NudgeInput & { questionId: string }
): string {
  const question = getLocalQuestionById(input.questionId);
  const base =
    question != null
      ? tagDrivenHint(question, input.level)
      : "Work backward from the structure of the problem and isolate the one theorem or counting step that unlocks it.";
  return scrubAnswer(base, input.canonicalAnswer);
}
