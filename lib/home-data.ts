import { PLAYLISTS } from "@/content/playlists";
import { TOPICS, type Topic } from "@/content/question-types";
import { loadAllQuestions, type LoadedQuestion } from "@/lib/questions-data";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

export interface HomeProfile {
  streak: number;
  points: number;
}

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

export interface HomeData {
  profile: HomeProfile | null;
  playlists: HomePlaylist[];
  topics: Topic[];
  nextUp: HomeNextUp | null;
  hasAttempts: boolean;
}

export async function loadProfile(
  anonId: string | null
): Promise<HomeProfile | null> {
  if (!anonId || !isSupabaseConfigured()) return null;
  try {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from("anon_users")
      .select("streak_count, total_points")
      .eq("id", anonId)
      .maybeSingle();
    if (error || !data) return null;
    return {
      streak: (data.streak_count as number) ?? 0,
      points: (data.total_points as number) ?? 0,
    };
  } catch {
    return null;
  }
}

export async function loadHomeData(anonId: string | null): Promise<HomeData> {
  const [profile, { questions, attempts }] = await Promise.all([
    loadProfile(anonId),
    loadAllQuestions(anonId),
  ]);

  const bySlug = new Map(questions.map((q) => [q.slug, q]));
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

  return { profile, playlists, topics, nextUp, hasAttempts };
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

