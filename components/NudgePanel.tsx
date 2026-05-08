"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Latex } from "@/components/Latex";
import { cn } from "@/lib/utils";

interface NudgePanelProps {
  attemptId: string;
  onLevelRevealed?: (level: 1 | 2 | 3) => void;
}

interface HintState {
  level: 1 | 2 | 3;
  text: string;
  cached: boolean;
}

const LEVEL_LABELS: Record<1 | 2 | 3, { name: string; sub: string }> = {
  1: {
    name: "Conceptual",
    sub: "What kind of object are we counting?",
  },
  2: {
    name: "Formulaic",
    sub: "Which formula or theorem applies?",
  },
  3: {
    name: "Partial Solve",
    sub: "One intermediate quantity revealed.",
  },
};

export function NudgePanel({ attemptId, onLevelRevealed }: NudgePanelProps) {
  const [hints, setHints] = React.useState<HintState[]>([]);
  const [loadingLevel, setLoadingLevel] = React.useState<1 | 2 | 3 | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const nextLevel: 1 | 2 | 3 | null = (() => {
    const max = hints.reduce((m, h) => Math.max(m, h.level), 0);
    if (max >= 3) return null;
    return ((max + 1) as 1 | 2 | 3);
  })();

  async function requestNudge(level: 1 | 2 | 3) {
    setLoadingLevel(level);
    setError(null);
    try {
      const res = await fetch("/api/nudge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ attemptId, level }),
      });
      const data = (await res.json()) as
        | { hint: string; cached: boolean; level: 1 | 2 | 3 }
        | { error: string; message?: string };

      if (!res.ok || "error" in data) {
        const msg =
          ("error" in data && (data.message ?? data.error)) || "Hint failed.";
        setError(msg);
        return;
      }

      setHints((cur) => [
        ...cur,
        { level: data.level, text: data.hint, cached: data.cached },
      ]);
      onLevelRevealed?.(level);
    } catch (err) {
      console.error(err);
      setError("Network error. Try again.");
    } finally {
      setLoadingLevel(null);
    }
  }

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-fg">Nudge me</div>
          <div className="text-xs text-fg-muted">
            Three escalating hints. The final answer is never revealed.
          </div>
        </div>
        <span className="pill">{hints.length} / 3 used</span>
      </div>

      <ul className="space-y-3">
        {hints.map((h) => (
          <li
            key={h.level}
            className="rounded-md border border-border bg-bg-raised px-4 py-3"
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-accent">
                Level {h.level} · {LEVEL_LABELS[h.level].name}
              </span>
              {h.cached && (
                <span className="text-[10px] uppercase tracking-wider text-fg-subtle">
                  cached
                </span>
              )}
            </div>
            <div className="text-sm text-fg">
              <Latex>{h.text}</Latex>
            </div>
          </li>
        ))}
      </ul>

      {nextLevel !== null && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button
            variant={hints.length === 0 ? "primary" : "secondary"}
            size="sm"
            onClick={() => requestNudge(nextLevel)}
            disabled={loadingLevel !== null}
          >
            {loadingLevel === nextLevel
              ? "Thinking…"
              : `Reveal Level ${nextLevel} — ${LEVEL_LABELS[nextLevel].name}`}
          </Button>
          <span className="text-xs text-fg-subtle">
            {LEVEL_LABELS[nextLevel].sub}
          </span>
        </div>
      )}

      {nextLevel === null && (
        <div className="mt-3 text-xs text-fg-subtle">
          You&apos;ve used all three nudges. Try the answer again — or peek at the
          solution after you&apos;ve taken your best shot.
        </div>
      )}

      {error && (
        <div
          className={cn(
            "mt-3 rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger"
          )}
        >
          {error}
        </div>
      )}
    </div>
  );
}
