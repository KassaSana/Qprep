import { NextResponse, type NextRequest } from "next/server";

export const ANON_COOKIE = "qprep_anon";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * UUID v4. Web Crypto's `randomUUID` is available on the Edge runtime that
 * Next proxy runs on, so we just delegate.
 */
function randomUuid(): string {
  return crypto.randomUUID();
}

/**
 * Next.js 16 proxy: sets a long-lived `qprep_anon` UUID cookie on first visit.
 * That cookie is the user identity for everything in v1 (no auth wall).
 */
export function proxy(req: NextRequest) {
  const existing = req.cookies.get(ANON_COOKIE)?.value;
  if (existing) {
    return NextResponse.next();
  }

  const id = randomUuid();
  const res = NextResponse.next();
  res.cookies.set({
    name: ANON_COOKIE,
    value: id,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
  });
  // Forward to downstream handlers in the same request via a request header
  // so the first response can already attribute attempts to this id.
  res.headers.set("x-qprep-anon", id);
  return res;
}

export const config = {
  // Skip static assets and Next internals; cover everything else (pages + API).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)"],
};
