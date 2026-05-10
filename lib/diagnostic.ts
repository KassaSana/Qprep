/**
 * 60-second diagnostic — pure scoring + recommendation logic.
 *
 * Inputs from the runner:
 *   - the diagnostic questions (resolved from `content/diagnostic.ts`'s slugs)
 *   - a {slug -> chosen option id} map of the user's answers
 *
 * Outputs:
 *   - per-topic score (right / asked) so we can render bars
 *   - a Researcher/Dev lean score
 *   - a recommended playlist slug + a one-sentence "why"
 *
 * No DB writes in v1: `topic_levels` accumulates from real attempts.
 * The diagnostic just routes; it doesn't pre-seed levels.
 */

import type { Topic } from "@/content/question-types";
import type { LoadedQuestion } from "@/lib/questions-data";

export type DiagnosticAnswers = Record<string, string>;

export interface TopicScore {
  topic: Topic;
  asked: number;
  right: number;
}

export interface DiagnosticSummary {
  /** Total MCQs answered (regardless of correctness). */
  answered: number;
  /** Total MCQs in the diagnostic. */
  total: number;
  /** Per-topic right/asked. Sorted by topic name for stable rendering. */
  byTopic: TopicScore[];
  /** 0..1 — share of researcher-flavored questions answered correctly. */
  researcherFraction: number;
  /** 0..1 — share of dev-flavored questions answered correctly. */
  devFraction: number;
}

export interface DiagnosticRecommendation {
  /** Playlist slug to route the user into. Always a slug from `content/playlists.ts`. */
  playlistSlug: string;
  /** Display title to show on the result card. */
  playlistName: string;
  /** One-sentence explanation of why this playlist was picked. */
  why: string;
}

const RESEARCHER_TOPICS: readonly Topic[] = [
  "Probability",
  "Statistics",
  "Pure Math",
];
const DEV_TOPICS: readonly Topic[] = [
  "Data Structures",
  "Algorithms",
  "C++ Deep Dives",
  "Concurrency",
  "Systems",
  "LLD",
  "System Design",
];

/**
 * Reduce a raw {slug -> optionId} answer map into per-topic and per-lane
 * scores. Unanswered questions are simply omitted from `answered` and
 * `byTopic`; missing-from-bank questions (e.g. someone deleted a slug from
 * the seed) are silently skipped — the diagnostic should never explode
 * because of stale content.
 */
export function summarizeAnswers(
  questions: LoadedQuestion[],
  answers: DiagnosticAnswers
): DiagnosticSummary {
  const bySlug = new Map(questions.map((q) => [q.slug, q]));
  const topicAgg = new Map<Topic, TopicScore>();
  let answered = 0;
  let researcherAsked = 0;
  let researcherRight = 0;
  let devAsked = 0;
  let devRight = 0;

  for (const [slug, optionId] of Object.entries(answers)) {
    const q = bySlug.get(slug);
    if (!q || q.answer_kind !== "mcq") continue;
    answered += 1;
    const correct = q.answer_value === optionId;

    const cur = topicAgg.get(q.topic) ?? {
      topic: q.topic,
      asked: 0,
      right: 0,
    };
    cur.asked += 1;
    if (correct) cur.right += 1;
    topicAgg.set(q.topic, cur);

    if (RESEARCHER_TOPICS.includes(q.topic)) {
      researcherAsked += 1;
      if (correct) researcherRight += 1;
    } else if (DEV_TOPICS.includes(q.topic)) {
      devAsked += 1;
      if (correct) devRight += 1;
    }
  }

  const byTopic = [...topicAgg.values()].sort((a, b) =>
    a.topic.localeCompare(b.topic)
  );

  return {
    answered,
    total: questions.length,
    byTopic,
    researcherFraction:
      researcherAsked > 0 ? researcherRight / researcherAsked : 0,
    devFraction: devAsked > 0 ? devRight / devAsked : 0,
  };
}

/**
 * Lane-routing thresholds. A user is "clearly leaning" a lane when they got
 * at least this fraction of that lane's questions right AND outscore the
 * other lane by `LEAN_MARGIN`. Otherwise we route them to the warmup.
 */
const STRONG_FRACTION = 0.7;
const LEAN_MARGIN = 0.2;

/**
 * Route a summary to a starter playlist:
 *
 *   - clear Researcher lean → researcher-foundations
 *   - clear Dev lean        → quant-dev-essentials
 *   - both lanes strong     → top-50 (mixed showcase)
 *   - else                  → warmup-quickstart
 *
 * Fractions are computed against questions actually answered in each lane,
 * so partial diagnostics still produce a sensible recommendation (a user
 * who only answered Researcher questions and got 4/5 will still route).
 */
export function recommendPlaylist(
  summary: DiagnosticSummary
): DiagnosticRecommendation {
  const r = summary.researcherFraction;
  const d = summary.devFraction;

  const researcherStrong = r >= STRONG_FRACTION;
  const devStrong = d >= STRONG_FRACTION;

  if (researcherStrong && devStrong) {
    return {
      playlistSlug: "top-50",
      playlistName: "Top 50",
      why: "You scored strongly on both the researcher and dev sides — start with the cross-topic showcase.",
    };
  }

  if (researcherStrong && r - d >= LEAN_MARGIN) {
    return {
      playlistSlug: "researcher-foundations",
      playlistName: "Researcher Foundations",
      why: "Strong on probability/stats/math. The researcher core is your fastest path to depth.",
    };
  }

  if (devStrong && d - r >= LEAN_MARGIN) {
    return {
      playlistSlug: "quant-dev-essentials",
      playlistName: "Quant Dev Essentials",
      why: "Strong on data structures, C++, and concurrency. The dev essentials playlist matches your lane.",
    };
  }

  // Lane is unclear or weak — default to the warmup ramp.
  return {
    playlistSlug: "warmup-quickstart",
    playlistName: "Warmup Quickstart",
    why: "We didn't see a clear lean either way. The warmup ramp will get you submitting answers fast and reveal your edges.",
  };
}
