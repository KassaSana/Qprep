/**
 * Diagnostic progress persistence (Phase 3 onboarding).
 *
 * The 60-second diagnostic ran entirely in React state until now — a refresh
 * mid-flow dropped every answer and forced a restart, which the analytics
 * dashboard sees as a `diagnostic_started` with no matching
 * `diagnostic_completed`. That's the single biggest leak in the onboarding
 * funnel.
 *
 * This module is a tiny, **storage-agnostic** persistence layer:
 *
 *   - `Storage` is injected (defaults to `window.localStorage` at runtime)
 *     so unit tests don't need jsdom, and so SSR / private-mode browsers
 *     fail open instead of throwing.
 *   - The payload is **versioned** (`STORAGE_VERSION`). A schema change in
 *     a later slice bumps the version, which makes every prior cache miss
 *     gracefully on the next load.
 *   - We **validate against the current diagnostic pack** at load time:
 *     if a saved answer references a slug no longer in `DIAGNOSTIC_SLUGS`
 *     (i.e. someone changed the pack since the user's last visit), we
 *     discard the whole state. Better to start fresh than to hand the
 *     scoring function a phantom slug it can't grade.
 *   - There's a **24-hour TTL** so stale "I started this last week" state
 *     doesn't surprise returning visitors.
 *
 * The runner doesn't need to know about any of this — it calls
 * `loadDiagnosticState`, gets either `null` or a `{ answers }` object,
 * and treats `null` as "fresh start".
 */

/** Bump on any schema change to `SavedDiagnostic`. */
const STORAGE_VERSION = 1;

/** Storage key. Suffixed with the version so `v2` won't read `v1` blobs. */
export const STORAGE_KEY = `qprep:diagnostic:v${STORAGE_VERSION}`;

/** Discard saved state older than this. */
const TTL_MS = 24 * 60 * 60 * 1000;

export interface SavedDiagnostic {
  /** Schema version. Always equal to `STORAGE_VERSION` once loaded. */
  version: number;
  /** Unix ms when the state was last persisted. Used for TTL. */
  savedAt: number;
  /**
   * Map of `slug → option id` for every question the user has answered.
   * The runner derives the resume index from `expectedSlugs` order and
   * which slugs already appear here.
   */
  answers: Record<string, string>;
}

/**
 * Resolve the active storage adapter. Returns `null` at SSR (no `window`),
 * in private-mode browsers that throw on access, or when the caller is
 * running under a runtime that simply doesn't expose one.
 */
function defaultStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

function isStringRecord(v: unknown): v is Record<string, string> {
  if (v === null || typeof v !== "object") return false;
  for (const value of Object.values(v as Record<string, unknown>)) {
    if (typeof value !== "string") return false;
  }
  return true;
}

/**
 * Load the user's saved diagnostic progress.
 *
 * Returns `null` (i.e. "treat as fresh start") in every defensive case:
 *   - no storage available
 *   - no key set
 *   - stored JSON is malformed
 *   - the version doesn't match `STORAGE_VERSION`
 *   - `savedAt` is stale (older than `TTL_MS`)
 *   - any saved slug is not in `expectedSlugs` (content drift)
 *
 * Stale / invalid entries are **deleted** on the way out so we don't pay
 * the parse cost again next time.
 */
export function loadDiagnosticState(
  expectedSlugs: readonly string[],
  storage: Storage | null = defaultStorage(),
  now: number = Date.now()
): SavedDiagnostic | null {
  if (!storage) return null;

  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    safeRemove(storage);
    return null;
  }

  if (
    parsed === null ||
    typeof parsed !== "object" ||
    typeof (parsed as { version?: unknown }).version !== "number" ||
    (parsed as { version: number }).version !== STORAGE_VERSION ||
    typeof (parsed as { savedAt?: unknown }).savedAt !== "number" ||
    !isStringRecord((parsed as { answers?: unknown }).answers)
  ) {
    safeRemove(storage);
    return null;
  }

  const candidate = parsed as SavedDiagnostic;

  if (now - candidate.savedAt > TTL_MS) {
    safeRemove(storage);
    return null;
  }

  const allowed = new Set(expectedSlugs);
  for (const slug of Object.keys(candidate.answers)) {
    if (!allowed.has(slug)) {
      safeRemove(storage);
      return null;
    }
  }

  return candidate;
}

/**
 * Persist the current answer map. Errors (quota exceeded, security
 * exception, etc.) are swallowed — analytics-style fail-open. Persistence
 * is a nice-to-have; the diagnostic must never fail because the disk is
 * full.
 */
export function saveDiagnosticState(
  answers: Record<string, string>,
  storage: Storage | null = defaultStorage(),
  now: number = Date.now()
): void {
  if (!storage) return;
  const payload: SavedDiagnostic = {
    version: STORAGE_VERSION,
    savedAt: now,
    answers,
  };
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // intentional — see jsdoc
  }
}

/** Remove any saved diagnostic state. Safe to call repeatedly. */
export function clearDiagnosticState(
  storage: Storage | null = defaultStorage()
): void {
  safeRemove(storage);
}

function safeRemove(storage: Storage | null): void {
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // intentional
  }
}

/**
 * Compute the question index a runner should resume at, given the saved
 * answers and the **ordered** slug list the runner is iterating over.
 *
 * Returns the index of the **first unanswered** slug in `expectedSlugs`.
 * If every slug already has an answer, returns `expectedSlugs.length`,
 * which the runner treats as "go straight to the result phase".
 *
 * Pure / synchronous so it can be called from a useState lazy initializer.
 */
export function resumeIndex(
  answers: Record<string, string>,
  expectedSlugs: readonly string[]
): number {
  for (let i = 0; i < expectedSlugs.length; i++) {
    if (!(expectedSlugs[i] in answers)) return i;
  }
  return expectedSlugs.length;
}
