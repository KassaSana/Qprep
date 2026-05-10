/**
 * Question-of-the-day picker.
 *
 * Picks one Researcher and one Dev question per UTC day, deterministically.
 * Same date → same pair for everyone, regardless of timezone or session.
 *
 * Design choices worth knowing:
 * - Keyed by UTC `YYYY-MM-DD` so users in different timezones still share a
 *   "today" — otherwise a New Yorker and a Tokyo user would see different
 *   pairs at the same wall-clock instant.
 * - The candidate pool is sorted by `slug` before indexing, so adding a new
 *   question to the bank does NOT shuffle yesterday's pick. That preserves
 *   the audit trail; e.g. /today?date=2026-05-09 always resolves to the
 *   same pair.
 * - Quality filter: difficulty 2–4 only and no `mental-math` tag, so the
 *   daily isn't trivial. Falls back to the unfiltered pool if filtering
 *   leaves nothing (defensive — shouldn't happen at current bank size).
 * - Hash is FNV-1a, a non-cryptographic 32-bit hash. We only need uniform
 *   distribution over a small pool; cryptographic strength is overkill.
 */

import type { LoadedQuestion } from "@/lib/questions-data";

export type TodayRole = "Researcher" | "Dev";

export interface TodayPair {
  dateKey: string;
  researcher: LoadedQuestion | null;
  dev: LoadedQuestion | null;
}

/**
 * Format a Date as UTC `YYYY-MM-DD`. Always UTC so timezone doesn't matter.
 */
export function dateKeyFor(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * FNV-1a 32-bit hash. Stable across runtimes (Node + Edge + browser).
 */
function fnv1a(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function passesQualityFilter(q: LoadedQuestion): boolean {
  if (q.difficulty < 2 || q.difficulty > 4) return false;
  if ((q.tags ?? []).includes("mental-math")) return false;
  return true;
}

function rolePool(
  role: TodayRole,
  questions: LoadedQuestion[]
): LoadedQuestion[] {
  const matchesRole = (q: LoadedQuestion) => {
    const roles = q.target_roles ?? [];
    return roles.includes(role) || roles.includes("All");
  };

  const filtered = questions
    .filter(matchesRole)
    .filter(passesQualityFilter);

  // If the quality filter leaves nothing, fall back to the unfiltered role
  // pool so the page never renders empty state due to a bank quirk.
  const pool = filtered.length > 0 ? filtered : questions.filter(matchesRole);

  // Sort by slug for stable indexing.
  return [...pool].sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Pick a single role's question for a given date. Returns null only if
 * the role has zero candidates (genuinely empty bank).
 */
export function pickTodayQuestion(
  role: TodayRole,
  date: Date,
  questions: LoadedQuestion[]
): LoadedQuestion | null {
  const pool = rolePool(role, questions);
  if (pool.length === 0) return null;
  const key = `qprep-today-v1:${dateKeyFor(date)}:${role}`;
  const idx = fnv1a(key) % pool.length;
  return pool[idx];
}

/**
 * Pick the (Researcher, Dev) pair for a date. The dateKey is included in
 * the result so callers (page header, share links) don't have to recompute.
 */
export function pickTodayPair(
  date: Date,
  questions: LoadedQuestion[]
): TodayPair {
  return {
    dateKey: dateKeyFor(date),
    researcher: pickTodayQuestion("Researcher", date, questions),
    dev: pickTodayQuestion("Dev", date, questions),
  };
}
