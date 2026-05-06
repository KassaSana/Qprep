import { RESEARCHER_SEED, type SeedQuestion } from "@/content/researcher-seed";
import { checkAnswer } from "@/lib/answer-check";
import { scrubAnswer, type NudgeInput } from "@/lib/anthropic";

export interface LocalQuestion extends SeedQuestion {
  id: string;
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
  researcher_level: number;
  last_correct_at: string | null;
}

interface CachedHint {
  hint_text: string;
}

const POINTS_BY_DIFFICULTY = [0, 5, 10, 20, 35, 60];
const DAILY_NUDGE_LIMIT = 30;

const localQuestions: LocalQuestion[] = RESEARCHER_SEED.map((q, idx) => ({
  ...q,
  id: `00000000-0000-4000-8000-${String(idx + 1).padStart(12, "0")}`,
}));

const attemptsByUser = new Map<string, LocalAttempt[]>();
const profilesByUser = new Map<string, LocalProfile>();
const hintsCache = new Map<string, CachedHint>();
const usageByUserDay = new Map<string, number>();

function defaultProfile(): LocalProfile {
  return {
    streak_count: 0,
    total_points: 0,
    researcher_level: 1,
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
  difficulty: number,
  hintLevelsUsed: number
): LocalProfile {
  const profile = profilesByUser.get(anonId) ?? defaultProfile();
  const basePoints =
    POINTS_BY_DIFFICULTY[Math.min(difficulty, POINTS_BY_DIFFICULTY.length - 1)] ??
    5;
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
  profile.researcher_level = levelFromPoints(profile.total_points);

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

export function getLocalResearcherQuestions(): LocalQuestion[] {
  return [...localQuestions];
}

export function getLocalQuestionBySlug(slug: string): LocalQuestion | undefined {
  return localQuestions.find((q) => q.slug === slug);
}

export function getLocalQuestionById(id: string): LocalQuestion | undefined {
  return localQuestions.find((q) => q.id === id);
}

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
  return getLocalAttemptsForUser(anonId).filter((a) => a.question_id === questionId);
}

export function getLocalAttemptById(
  anonId: string,
  attemptId: string
): LocalAttempt | undefined {
  return (attemptsByUser.get(anonId) ?? []).find((a) => a.id === attemptId);
}

export function recordLocalAttempt(input: {
  anonId: string;
  questionId: string;
  submittedAnswer: string;
  hintLevelsUsed: number;
}) {
  const question = getLocalQuestionById(input.questionId);
  if (!question) return null;

  ensureProfile(input.anonId);

  const result = checkAnswer(
    {
      answer_kind: question.answer_kind,
      answer_value: question.answer_value,
      answer_tolerance: question.answer_tolerance,
    },
    input.submittedAnswer
  );

  const attempt: LocalAttempt = {
    id: crypto.randomUUID(),
    anon_user_id: input.anonId,
    question_id: question.id,
    submitted_answer: input.submittedAnswer,
    is_correct: result.correct,
    hint_levels_used: input.hintLevelsUsed,
    created_at: new Date().toISOString(),
  };

  const list = attemptsByUser.get(input.anonId) ?? [];
  list.unshift(attempt);
  attemptsByUser.set(input.anonId, list);

  if (result.correct) {
    awardLocalCorrect(input.anonId, question.difficulty, input.hintLevelsUsed);
  }

  return { attempt, result, question };
}

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
  return hintsCache.get(hintCacheKey(questionId, errorSignature, level))?.hint_text ?? null;
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

  if (level === 1) {
    return "Step back and identify exactly what event or random variable the question is asking you to compute.";
  }
  if (level === 2) {
    return "Write the governing formula first and only then plug in the probabilities or counts from the prompt.";
  }
  return "Your next step should be one clean intermediate quantity, such as the sample-space size, a conditioning split, or a recurrence.";
}

export function generateLocalNudge(input: NudgeInput & { questionId: string }): string {
  const question = getLocalQuestionById(input.questionId);
  const base =
    question != null
      ? tagDrivenHint(question, input.level)
      : "Work backward from the structure of the problem and isolate the one theorem or counting step that unlocks it.";
  return scrubAnswer(base, input.canonicalAnswer);
}
