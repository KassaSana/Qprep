import { PLAYLISTS } from "@/content/playlists";
import { TOPICS, type Topic } from "@/content/question-types";
import { getLocalProfile } from "@/lib/local-dev";
import {
  loadAllQuestions,
  type LoadedQuestion,
} from "@/lib/questions-data";
import {
  pickResurfaced,
  type AttemptForResurface,
  type ResurfaceCandidate,
} from "@/lib/spaced-rep";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

export interface HomeProfile {
  streak: number;
  points: number;
  /**
   * Per-topic XP-style level. Sourced from `anon_users.topic_levels` (jsonb)
   * in Supabase mode; from the in-memory profile in local-dev. Empty `{}`
   * for users who have no correct answers yet.
   */
  topicLevels: Partial<Record<Topic, number>>;
}

export interface MasteryBar {
  topic: Topic;
  level: number;
  /** Normalized 0..1 of `level` against `MAX_DISPLAY_LEVEL`. */
  fraction: number;
}

/** Cap for the mastery-bar visualization. Levels keep climbing past this. */
export const MAX_DISPLAY_LEVEL = 10;

export interface HomePlaylist {
  slug: string;
  name: string;
  description: string;
  heroEmoji: string;
  total: number;
  solved: number;
}

export interface HomeNextUp {
  questionSlug: string;
  title: string;
  topic: Topic;
  difficulty: number;
  playlistSlug: string;
  playlistName: string;
  heroEmoji: string;
}

export interface HomeResurface {
  questionSlug: string;
  title: string;
  topic: Topic;
  difficulty: number;
  daysSinceLastWrong: number;
  wrongAttemptCount: number;
}

export interface HomeData {
  profile: HomeProfile | null;
  playlists: HomePlaylist[];
  topics: Topic[];
  nextUp: HomeNextUp | null;
  hasAttempts: boolean;
  /** Up to 5 questions the user got wrong N+ days ago and never solved. */
  resurface: HomeResurface[];
}

export async function loadProfile(
  anonId: string | null
): Promise<HomeProfile | null> {
  if (!anonId) return null;

  // Local-dev: read straight off the in-memory profile so the home page can
  // render mastery bars without a real DB. Returns null when the user has no
  // streak/points yet so the chip block stays hidden in the header.
  if (!isSupabaseConfigured()) {
    const local = getLocalProfile(anonId);
    if (
      local.streak_count === 0 &&
      local.total_points === 0 &&
      Object.keys(local.topic_levels).length === 0
    ) {
      return null;
    }
    return {
      streak: local.streak_count,
      points: local.total_points,
      topicLevels: local.topic_levels,
    };
  }

  try {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from("anon_users")
      .select("streak_count, total_points, topic_levels")
      .eq("id", anonId)
      .maybeSingle();
    if (error || !data) return null;
    return {
      streak: (data.streak_count as number) ?? 0,
      points: (data.total_points as number) ?? 0,
      topicLevels: normalizeTopicLevels(data.topic_levels),
    };
  } catch {
    return null;
  }
}

/**
 * Postgres returns `topic_levels` as jsonb — coerce defensively. Drop any
 * key that isn't in the canonical TOPICS set so the UI can iterate safely.
 */
function normalizeTopicLevels(raw: unknown): Partial<Record<Topic, number>> {
  if (!raw || typeof raw !== "object") return {};
  const out: Partial<Record<Topic, number>> = {};
  const known = new Set<string>(TOPICS);
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!known.has(k)) continue;
    const n = typeof v === "number" ? v : Number(v);
    if (Number.isFinite(n) && n > 0) out[k as Topic] = Math.floor(n);
  }
  return out;
}

/**
 * Convert a profile's topic levels into bar data, sorted by level desc.
 * Returns at most `limit` entries (omit for all). Topics with level 0 are
 * dropped — only show progress that exists.
 */
export function topicMasteryBars(
  topicLevels: Partial<Record<Topic, number>> | undefined,
  limit?: number
): MasteryBar[] {
  if (!topicLevels) return [];
  const bars: MasteryBar[] = [];
  for (const t of TOPICS) {
    const level = topicLevels[t] ?? 0;
    if (level <= 0) continue;
    bars.push({
      topic: t,
      level,
      fraction: Math.min(1, level / MAX_DISPLAY_LEVEL),
    });
  }
  bars.sort((a, b) => b.level - a.level || a.topic.localeCompare(b.topic));
  return typeof limit === "number" ? bars.slice(0, limit) : bars;
}

export async function loadHomeData(anonId: string | null): Promise<HomeData> {
  const [profile, { questions, attempts }] = await Promise.all([
    loadProfile(anonId),
    loadAllQuestions(anonId),
  ]);

  const bySlug = new Map(questions.map((q) => [q.slug, q]));
  const byId = new Map(questions.map((q) => [q.id, q]));
  const solvedQuestionIds = new Set(
    attempts.filter((a) => a.is_correct).map((a) => a.question_id)
  );
  const hasAttempts = attempts.length > 0;

  const playlists: HomePlaylist[] = PLAYLISTS.map((p) => {
    const total = p.question_slugs.length;
    const solved = p.question_slugs.reduce((n, slug) => {
      const q = bySlug.get(slug);
      return n + (q && solvedQuestionIds.has(q.id) ? 1 : 0);
    }, 0);
    return {
      slug: p.slug,
      name: p.name,
      description: p.description,
      heroEmoji: p.hero_emoji,
      total,
      solved,
    };
  });

  const nextUp = hasAttempts
    ? pickNextUnsolved(playlists, bySlug, solvedQuestionIds)
    : null;

  // Topics come from the canonical enum so the strip renders even when the
  // questions table is empty (fresh local env, cold Supabase, etc).
  const topics: Topic[] = [...TOPICS];

  const resurface = hasAttempts ? buildResurface(attempts, byId) : [];

  return { profile, playlists, topics, nextUp, hasAttempts, resurface };
}

function buildResurface(
  attempts: { question_id: string; is_correct: boolean; created_at?: string }[],
  byId: Map<string, LoadedQuestion>
): HomeResurface[] {
  const withTimestamps: AttemptForResurface[] = attempts
    .filter((a): a is AttemptForResurface => typeof a.created_at === "string")
    .map((a) => ({
      question_id: a.question_id,
      is_correct: a.is_correct,
      created_at: a.created_at,
    }));
  const candidates: ResurfaceCandidate[] = pickResurfaced(withTimestamps);
  const out: HomeResurface[] = [];
  for (const c of candidates) {
    const q = byId.get(c.questionId);
    if (!q) continue;
    out.push({
      questionSlug: q.slug,
      title: q.title,
      topic: q.topic,
      difficulty: q.difficulty,
      daysSinceLastWrong: c.daysSinceLastWrong,
      wrongAttemptCount: c.wrongAttemptCount,
    });
  }
  return out;
}

/**
 * Pick the most-advanced incomplete playlist, then the first unsolved slug
 * inside it. Returns null when the user has solved everything (or there is
 * nothing to recommend). Tie-break is the order of `PLAYLISTS`, which falls
 * out of `Array.reduce` naturally.
 */
export function pickNextUnsolved(
  playlists: HomePlaylist[],
  bySlug: Map<string, LoadedQuestion>,
  solvedQuestionIds: Set<string>
): HomeNextUp | null {
  let bestIdx = -1;
  let bestFraction = -1;
  for (let i = 0; i < playlists.length; i++) {
    const p = playlists[i];
    if (p.total === 0 || p.solved >= p.total) continue;
    const fraction = p.solved / p.total;
    if (fraction > bestFraction) {
      bestFraction = fraction;
      bestIdx = i;
    }
  }
  if (bestIdx === -1) return null;

  const chosen = playlists[bestIdx];
  const def = PLAYLISTS.find((p) => p.slug === chosen.slug);
  if (!def) return null;

  for (const slug of def.question_slugs) {
    const q = bySlug.get(slug);
    if (!q) continue;
    if (solvedQuestionIds.has(q.id)) continue;
    return {
      questionSlug: q.slug,
      title: q.title,
      topic: q.topic,
      difficulty: q.difficulty,
      playlistSlug: chosen.slug,
      playlistName: chosen.name,
      heroEmoji: chosen.heroEmoji,
    };
  }
  return null;
}

