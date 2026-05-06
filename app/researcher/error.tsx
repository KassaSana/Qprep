"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ResearcherError({ error, reset }: ErrorPageProps) {
  React.useEffect(() => {
    console.error("Researcher route error", error);
  }, [error]);

  const looksLikeSupabase =
    /supabase|fetch failed|ENOTFOUND|service.role|anon.key/i.test(
      error.message ?? ""
    );

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href="/"
        className="inline-block text-sm text-fg-muted hover:text-fg"
      >
        ← All tracks
      </Link>

      <div className="card mt-4 p-6">
        <div className="text-xs uppercase tracking-wider text-fg-muted">
          Researcher track unavailable
        </div>
        <h1 className="mt-2 text-xl font-semibold tracking-tight">
          {looksLikeSupabase
            ? "Couldn't load problems from the database."
            : "Couldn't load problems."}
        </h1>
        <p className="mt-3 text-sm text-fg-muted">
          {looksLikeSupabase
            ? "The question bank lives in Supabase. Make sure you've run the migration in supabase/migrations/0001_init.sql, populated .env.local, and seeded the bank with `npm run seed`."
            : "Try again, or head back home and try a different track."}
        </p>

        {error.digest && (
          <p className="mt-3 text-xs text-fg-subtle">
            Error ref: <code className="font-mono">{error.digest}</code>
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={reset} size="sm">
            Try again
          </Button>
          <Link href="/">
            <Button variant="secondary" size="sm">
              Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
