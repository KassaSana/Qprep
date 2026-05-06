"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  React.useEffect(() => {
    console.error("Unhandled app error", error);
  }, [error]);

  const looksLikeSupabase =
    /supabase|fetch failed|ENOTFOUND|service.role|anon.key/i.test(
      error.message ?? ""
    );

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="card p-6">
        <div className="text-xs uppercase tracking-wider text-fg-muted">
          Something broke
        </div>
        <h1 className="mt-2 text-xl font-semibold tracking-tight">
          {looksLikeSupabase
            ? "Couldn't reach the database."
            : "Unexpected error."}
        </h1>
        <p className="mt-3 text-sm text-fg-muted">
          {looksLikeSupabase ? (
            <>
              The app couldn't talk to Supabase. Most often this means your{" "}
              <code className="rounded bg-bg-subtle px-1 py-0.5 text-xs">
                .env.local
              </code>{" "}
              still has placeholder values, or the project is paused. Update{" "}
              <code className="rounded bg-bg-subtle px-1 py-0.5 text-xs">
                NEXT_PUBLIC_SUPABASE_URL
              </code>{" "}
              and{" "}
              <code className="rounded bg-bg-subtle px-1 py-0.5 text-xs">
                SUPABASE_SERVICE_ROLE_KEY
              </code>
              , then restart the dev server.
            </>
          ) : (
            <>An error was logged to the console. Try again, or go home.</>
          )}
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
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
