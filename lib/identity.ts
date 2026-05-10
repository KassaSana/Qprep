/**
 * Identity abstraction layer (auth slice 1).
 *
 * Today every QPrep visitor is identified by a `qprep_anon` UUID cookie
 * (see `proxy.ts` + `lib/anon.ts`). When the auth feature flag flips on,
 * the same visitors will optionally also be linked to a Supabase Auth user
 * via `anon_users.user_id` (migration `0005_user_identity.sql`).
 *
 * This module is the **single chokepoint** all callers should funnel through
 * to read "who is this request?". It exists so that slice 2 of the auth
 * rollout can wire in `auth.getUser()` without crawling every page and API
 * route. Until that flag flips, every call returns the anon-only shape and
 * behavior is identical to today.
 *
 * Migration plan from `getAnonId()` → `getIdentity()`:
 *   1. New code uses `getIdentity()` directly.
 *   2. Existing call sites stay on `getAnonId()` for now — they're equivalent
 *      while `isAuthEnabled()` returns false.
 *   3. When auth ships, sweep call sites that read user-owned data
 *      (attempts, streaks, levels) and switch to `getIdentityKey()` so we
 *      key on `userId ?? anonId`. Pure session reads (CSRF tokens, debug
 *      headers) can keep using `getAnonId()`.
 */

import { getAnonId } from "@/lib/anon";

export interface Identity {
  /** The `qprep_anon` cookie UUID, or null if the proxy hasn't run yet. */
  anonId: string | null;
  /** The Supabase Auth user id, or null if the visitor isn't signed in. */
  userId: string | null;
  /** Convenience flag. True iff `userId` is set. */
  isAuthed: boolean;
}

/**
 * Read the runtime auth feature flag.
 *
 * Lives in `NEXT_PUBLIC_*` so the same flag controls both server components
 * (sign-in button visibility) and client components (form rendering). Until
 * the owner sets this to `"true"`, every code path that touches identity
 * stays on the anon-only shape.
 */
export function isAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AUTH_ENABLED === "true";
}

/**
 * Resolve the current visitor's identity.
 *
 * Slice 1: always returns `{ anonId, userId: null, isAuthed: false }`.
 * Slice 2 will add the Supabase Auth lookup behind `isAuthEnabled()`.
 *
 * Never throws — callers that require an id should compose with
 * `getIdentityKey` and handle the null case explicitly.
 */
export async function getIdentity(): Promise<Identity> {
  const anonId = await getAnonId();
  // Auth is not yet wired. Keep the shape stable so callers can adopt this
  // function today and not have to refactor when the flag flips.
  return {
    anonId,
    userId: null,
    isAuthed: false,
  };
}

/**
 * The single string we should key user-owned data on (attempts, streaks,
 * levels, etc.). Prefers `userId` so a signed-in user's data follows them
 * across devices; falls back to `anonId` for visitors who haven't linked.
 *
 * Kept as a pure helper so tests don't have to mock next/headers.
 */
export function getIdentityKey(identity: Identity): string | null {
  return identity.userId ?? identity.anonId;
}
