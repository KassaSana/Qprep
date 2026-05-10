/**
 * Spaced-repetition resurfacing.
 *
 * "You missed these N days ago — retry." Picks the K oldest questions the
 * user got wrong and never came back to solve, so they actually have to
 * remember the idea instead of just patching the surface mistake.
 *
 * Pure logic only — the home page calls this with the user's attempts and
 * the questions map. No DB awareness.
 *
 * Algorithm:
 * 1. Reduce the attempt log to one row per question:
 *      - skip questions the user has ever solved (`is_correct === true`)
 *      - for the rest, track the most recent wrong attempt and total wrong count
 * 2. Filter to candidates whose latest wrong is at least `minDaysOld` days
 *    in the past (default 3) — we don't want to resurface something they
 *    just gave up on five minutes ago.
 * 3. Sort by `mostRecentWrongAt` ascending (oldest first), then by total
 *    wrong attempts descending as a tie-breaker (the more they've struggled,
 *    the more it deserves a re-look).
 * 4. Return the first `limit` (default 5).
 */

export interface AttemptForResurface {
  question_id: string;
  is_correct: boolean;
  /** ISO timestamp; required for spaced-rep. */
  created_at: string;
}

export interface ResurfaceCandidate {
  questionId: string;
  /** Days since the most recent wrong attempt (rounded down). */
  daysSinceLastWrong: number;
  /** How many times the user has gotten this question wrong. */
  wrongAttemptCount: number;
  /** ISO timestamp of the most recent wrong attempt. */
  lastWrongAt: string;
}

export interface PickResurfacedOptions {
  /** Override "now" — useful for tests and SSR caching. */
  now?: Date;
  /** Only resurface attempts at least this many days old. Default 3. */
  minDaysOld?: number;
  /** Maximum candidates to return. Default 5. */
  limit?: number;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Compute resurface candidates from a flat attempt log. Attempts can come in
 * any order; the function reduces them itself.
 */
export function pickResurfaced(
  attempts: readonly AttemptForResurface[],
  options: PickResurfacedOptions = {}
): ResurfaceCandidate[] {
  const now = options.now ?? new Date();
  const minDays = options.minDaysOld ?? 3;
  const limit = options.limit ?? 5;
  const cutoffMs = now.getTime() - minDays * MS_PER_DAY;

  // Reduce: per question, latest wrong + wrong count, tracked only when no
  // correct attempt has ever been recorded.
  interface Agg {
    everSolved: boolean;
    latestWrongAtMs: number;
    latestWrongAtIso: string;
    wrongCount: number;
  }
  const byQuestion = new Map<string, Agg>();

  for (const a of attempts) {
    if (!a.created_at) continue;
    const ms = Date.parse(a.created_at);
    if (!Number.isFinite(ms)) continue;

    const cur = byQuestion.get(a.question_id) ?? {
      everSolved: false,
      latestWrongAtMs: -Infinity,
      latestWrongAtIso: "",
      wrongCount: 0,
    };

    if (a.is_correct) {
      cur.everSolved = true;
    } else {
      cur.wrongCount += 1;
      if (ms > cur.latestWrongAtMs) {
        cur.latestWrongAtMs = ms;
        cur.latestWrongAtIso = a.created_at;
      }
    }
    byQuestion.set(a.question_id, cur);
  }

  const candidates: ResurfaceCandidate[] = [];
  for (const [questionId, agg] of byQuestion) {
    if (agg.everSolved) continue;
    if (agg.wrongCount === 0) continue;
    if (agg.latestWrongAtMs > cutoffMs) continue; // too recent
    candidates.push({
      questionId,
      daysSinceLastWrong: Math.floor(
        (now.getTime() - agg.latestWrongAtMs) / MS_PER_DAY
      ),
      wrongAttemptCount: agg.wrongCount,
      lastWrongAt: agg.latestWrongAtIso,
    });
  }

  candidates.sort((a, b) => {
    if (a.lastWrongAt !== b.lastWrongAt) {
      // Oldest first.
      return a.lastWrongAt.localeCompare(b.lastWrongAt);
    }
    // Tie-break: more wrong attempts → resurface first.
    return b.wrongAttemptCount - a.wrongAttemptCount;
  });

  return candidates.slice(0, limit);
}
