"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Latex } from "@/components/Latex";
import {
  recommendPlaylist,
  summarizeAnswers,
  type DiagnosticAnswers,
} from "@/lib/diagnostic";
import type { LoadedQuestion } from "@/lib/questions-data";
import type { Topic } from "@/content/question-types";
import { cn } from "@/lib/utils";

/**
 * Subset of LoadedQuestion the runner needs. Mirrors what the server page
 * passes via `serializeForClient` — kept narrow so the wire payload stays
 * small (no rubrics, no solutions, no prompts beyond the markdown body).
 */
export interface DiagnosticItem {
  slug: string;
  title: string;
  topic: Topic;
  difficulty: number;
  promptMd: string;
  answerValue: string;
  options: { id: string; label: string }[];
}

interface DiagnosticRunnerProps {
  questions: DiagnosticItem[];
}

type Phase =
  | { kind: "running"; index: number }
  | { kind: "result" };

/**
 * Step-through diagnostic UI. Click an option → record + auto-advance after
 * a brief flash so the user sees their pick highlight before the next card.
 *
 * We grade locally (compare optionId === answerValue) so there's no network
 * call per step. At the end we hand the answer map to `summarizeAnswers` +
 * `recommendPlaylist` and render a result card with a single CTA.
 */
export function DiagnosticRunner({ questions }: DiagnosticRunnerProps) {
  const [phase, setPhase] = React.useState<Phase>({ kind: "running", index: 0 });
  const [answers, setAnswers] = React.useState<DiagnosticAnswers>({});
  const [pendingPick, setPendingPick] = React.useState<string | null>(null);

  function pickOption(slug: string, optionId: string) {
    if (pendingPick) return; // ignore double-clicks during the auto-advance flash
    setPendingPick(optionId);
    setAnswers((cur) => ({ ...cur, [slug]: optionId }));
    window.setTimeout(() => {
      setPendingPick(null);
      setPhase((p) => {
        if (p.kind !== "running") return p;
        if (p.index + 1 >= questions.length) return { kind: "result" };
        return { kind: "running", index: p.index + 1 };
      });
    }, 250);
  }

  function restart() {
    setAnswers({});
    setPendingPick(null);
    setPhase({ kind: "running", index: 0 });
  }

  if (phase.kind === "result") {
    // Map the runner's serialized items back into the LoadedQuestion shape
    // the lib expects. We only fill what the lib reads; everything else is
    // a stub — the lib never touches them.
    const asLoaded: LoadedQuestion[] = questions.map((q) => ({
      id: `diag-${q.slug}`,
      slug: q.slug,
      topic: q.topic,
      title: q.title,
      prompt_md: q.promptMd,
      solution_md: null,
      answer_kind: "mcq",
      answer_value: q.answerValue,
      answer_tolerance: null,
      answer_meta: { options: q.options.map((o) => ({ ...o, correct: o.id === q.answerValue })) },
      target_roles: ["All"],
      difficulty: q.difficulty,
      tags: [],
      companies: [],
      source: null,
      is_premium: false,
    }));
    const summary = summarizeAnswers(asLoaded, answers);
    const rec = recommendPlaylist(summary);
    return (
      <ResultCard
        summary={summary}
        recommendation={rec}
        onRestart={restart}
      />
    );
  }

  const q = questions[phase.index];
  const picked = answers[q.slug];
  const total = questions.length;

  return (
    <div>
      <ProgressBar current={phase.index + 1} total={total} />

      <div className="mt-4 mb-3 flex items-center gap-2 text-xs text-fg-muted">
        <span className="pill">{q.topic}</span>
        <span className="pill">D{q.difficulty}</span>
        <span className="ml-auto text-fg-subtle">
          {phase.index + 1} / {total}
        </span>
      </div>

      <article className="card p-5">
        <h2 className="text-lg font-semibold tracking-tight">{q.title}</h2>
        <div className="mt-3 text-sm text-fg">
          <Latex>{q.promptMd}</Latex>
        </div>
      </article>

      <ul className="mt-4 grid gap-2">
        {q.options.map((opt) => {
          const isPicked = picked === opt.id;
          const isPending = pendingPick === opt.id;
          return (
            <li key={opt.id}>
              <button
                type="button"
                onClick={() => pickOption(q.slug, opt.id)}
                disabled={!!pendingPick}
                className={cn(
                  "card w-full px-4 py-3 text-left text-sm transition-colors",
                  "hover:border-accent/40 hover:bg-bg-raised",
                  "disabled:cursor-default",
                  isPending && "border-accent bg-accent/10",
                  isPicked && !isPending && "border-accent/40"
                )}
                aria-pressed={isPicked}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs font-mono text-fg-subtle">
                    {opt.id}.
                  </span>
                  <Latex className="text-fg">{opt.label}</Latex>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex items-center justify-between text-xs text-fg-muted">
        <span>Click an option to advance — answers don&apos;t count as real attempts.</span>
        <button
          type="button"
          onClick={restart}
          className="text-fg-subtle underline-offset-2 hover:text-fg hover:underline"
        >
          Restart
        </button>
      </div>
    </div>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div
      className="h-1 w-full overflow-hidden rounded-full bg-bg-subtle"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Question ${current} of ${total}`}
    >
      <div
        className="h-full rounded-full bg-accent transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

interface ResultCardProps {
  summary: ReturnType<typeof summarizeAnswers>;
  recommendation: ReturnType<typeof recommendPlaylist>;
  onRestart: () => void;
}

function ResultCard({ summary, recommendation, onRestart }: ResultCardProps) {
  const totalRight = summary.byTopic.reduce((n, t) => n + t.right, 0);
  return (
    <div>
      <div className="card p-6">
        <div className="text-xs font-medium uppercase tracking-wider text-fg-muted">
          Result
        </div>
        <div className="mt-1 text-2xl font-semibold tracking-tight">
          {totalRight} / {summary.answered} correct
        </div>
        <p className="mt-3 text-sm text-fg-muted">{recommendation.why}</p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Link href={`/playlists/${recommendation.playlistSlug}`}>
            <Button>Open {recommendation.playlistName}</Button>
          </Link>
          <Link href="/today">
            <Button variant="secondary">Try today&apos;s pair</Button>
          </Link>
          <Button variant="ghost" onClick={onRestart}>
            Restart
          </Button>
        </div>
      </div>

      {summary.byTopic.length > 0 && (
        <section className="mt-8">
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-fg-muted">
            By topic
          </h3>
          <ul className="card divide-y divide-border">
            {summary.byTopic.map((t) => {
              const pct = Math.round((t.right / t.asked) * 100);
              return (
                <li
                  key={t.topic}
                  className="flex items-center gap-4 px-5 py-3 text-sm"
                >
                  <span className="font-medium text-fg">{t.topic}</span>
                  <div
                    className="ml-auto h-1.5 w-24 overflow-hidden rounded-full bg-bg-subtle"
                    role="progressbar"
                    aria-valuenow={t.right}
                    aria-valuemin={0}
                    aria-valuemax={t.asked}
                    aria-label={`${t.topic}: ${t.right} of ${t.asked}`}
                  >
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-xs text-fg-muted">
                    {t.right} / {t.asked}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
