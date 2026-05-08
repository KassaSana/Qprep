import { PLAYLISTS } from "@/content/playlists";
import type { LoadedQuestion } from "@/lib/questions-data";
import {
  pickNextUnsolved,
  type HomePlaylist,
} from "@/lib/home-data";

export interface NextQuestion {
  href: string;
  label: string;
}

export interface FromContext {
  kind: "playlist";
  slug: string;
}

export function parseFromParam(raw: string | undefined): FromContext | null {
  if (!raw) return null;
  const [kind, slug] = raw.split(":");
  if (kind === "playlist" && slug) return { kind, slug };
  return null;
}

/**
 * Find the next unsolved question to advance to after a correct submission.
 *
 * If `from` scopes to a playlist, walks that playlist's slugs in order and
 * returns the first unsolved one (skipping `currentQuestionId` so we never
 * re-suggest the question the user just solved). When the playlist is fully
 * solved, falls back to the global `pickNextUnsolved` so the user still has
 * somewhere to go.
 */
export function computeNext(args: {
  from: FromContext | null;
  currentQuestionId: string;
  questions: LoadedQuestion[];
  solvedQuestionIds: Set<string>;
}): NextQuestion | null {
  const { from, currentQuestionId, questions, solvedQuestionIds } = args;
  const bySlug = new Map(questions.map((q) => [q.slug, q]));
  // The current question counts as solved for the purposes of picking next,
  // because by the time this CTA is rendered the user has just solved it.
  const solvedPlus = new Set(solvedQuestionIds);
  solvedPlus.add(currentQuestionId);

  if (from?.kind === "playlist") {
    const def = PLAYLISTS.find((p) => p.slug === from.slug);
    if (def) {
      for (const slug of def.question_slugs) {
        const q = bySlug.get(slug);
        if (!q) continue;
        if (q.id === currentQuestionId) continue;
        if (solvedPlus.has(q.id)) continue;
        return {
          href: `/questions/${q.slug}?from=playlist:${def.slug}`,
          label: `Next in ${def.name}`,
        };
      }
      // Playlist exhausted — fall through to global pick.
    }
  }

  // Global fallback: most-advanced incomplete playlist's first unsolved.
  const playlists: HomePlaylist[] = PLAYLISTS.map((p) => {
    const total = p.question_slugs.length;
    const solved = p.question_slugs.reduce((n, slug) => {
      const q = bySlug.get(slug);
      return n + (q && solvedPlus.has(q.id) ? 1 : 0);
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
  const next = pickNextUnsolved(playlists, bySlug, solvedPlus);
  if (!next) return null;
  return {
    href: `/questions/${next.questionSlug}?from=playlist:${next.playlistSlug}`,
    label: `Next in ${next.playlistName}`,
  };
}
