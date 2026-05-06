import { cookies, headers } from "next/headers";
import { ANON_COOKIE } from "@/proxy";

/**
 * Reads the anonymous-session id from the request cookie set by proxy.ts.
 *
 * Falls back to the `x-qprep-anon` header that the proxy writes on the
 * very first response of a session, so server components rendered during
 * that same request still get a stable id without an extra round trip.
 */
export async function getAnonId(): Promise<string | null> {
  const c = await cookies();
  const fromCookie = c.get(ANON_COOKIE)?.value;
  if (fromCookie) return fromCookie;
  const h = await headers();
  return h.get("x-qprep-anon");
}

/**
 * Same as getAnonId() but throws if the cookie is missing.
 * Use in API routes where the proxy should always have run.
 */
export async function requireAnonId(): Promise<string> {
  const id = await getAnonId();
  if (!id) {
    throw new Error("anon session cookie missing");
  }
  return id;
}
