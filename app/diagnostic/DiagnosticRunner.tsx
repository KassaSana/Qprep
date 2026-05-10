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
import {
  clearDiagnosticState,
  loadDiagnosticState,
  resumeIndex,
  saveDiagnosticState,
} from "@/lib/diagnostic-storage";
import type { LoadedQuestion } from "@/lib/questions-data";
import type { Topic } from "@/content/question-types";
import { track } from "@/lib/analytics";
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
  // Hydrate from localStorage exactly once (lazy initializer). The slug list
  // mirrors `DIAGNOSTIC_SLUGS`; passing it in lets the storage layer drop
  // stale answers if the diagnostic pack changed since the last visit.
  const slugList = React.useMemo(() => questions.map((q) => q.slug), [questions]);

  const initial = React.useMemo(() => {
    const saved = loadDiagnosticState(slugList);
    const answers: DiagnosticAnswers = saved?.answers ?? {};
    const idx = resumeIndex(answers, slugList);
    const phase: Phase =
      idx >= questions.length ? { kind: "result" } : { kind: "running", index: idx };
    return {
      answers,
      phase,
      // We treat anything other than 0 as a *resumed* session. `resumed`
      // governs both the UI banner ("Resuming from question N") and whether
      // we re-fire `diagnostic_started` (we shouldn't — that would inflate
      // the funnel denominator on every refresh).
      resumed: idx > 0,
    };
    // Run-once: state hydration must not depend on later renders. The slug
    // list is derived from the stable server payload, so this is safe.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [phase, setPhase] = React.useState<Phase>(initial.phase);
  const [answers, setAnswers] = React.useState<DiagnosticAnswers>(initial.answers);
  const [pendingPick, setPendingPick] = React.useState<string | null>(null);
  // Sticky banner state: stays true until the user explicitly restarts.
  const [resumed, setResumed] = React.useState<boolean>(initial.resumed);

  // Fire `diagnostic_started` once per mount, but **only** for fresh starts.
  // A page refresh mid-flow now restores prior answers, so re-firing here
  // would double-count starts and tank the apparent completion rate.
  const startedRef = React.useRef(false);
  React.useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    if (!initial.resumed) {
      track({
        name: "diagnostic_started",
        properties: { totalQuestions: questions.length },
      });
    }
  }, [questions.length, initial.resumed]);

  function pickOption(slug: string, optionId: string) {
    if (pendingPick) return; // ignore double-clicks during the auto-advance flash
    setPendingPick(optionId);
    setAnswers((cur) => {
      const next = { ...cur, [slug]: optionId };
      // Persist before the auto-advance fires, so a refresh during the
      // 250ms flash window still keeps this answer.
      saveDiagnosticState(next);
      return next;
    });

    const q = questions.find((x) => x.slug === slug);
    if (q) {
      const idx = questions.findIndex((x) => x.slug === slug);
      track({
        name: "diagnostic_question_answered",
        properties: {
          slug: q.slug,
          topic: q.topic,
          index: idx,
          correct: optionId === q.answerValue,
        },
      });
    }

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
    track({
      name: "diagnostic_cta_clicked",
      properties: { cta: "restart", recommendedPlaylist: "" },
    });
    clearDiagnosticState();
    setAnswers({});
    setPendingPick(null);
    setPhase({ kind: "running", index: 0 });
    setResumed(false);
    startedRef.current = false; // allow `diagnostic_started` to refire
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

      {resumed && (
        <div
          className="mt-3 rounded-md border border-border bg-bg-subtle px-3 py-2 text-xs text-fg-muted"
          role="status"
        >
          Picking up where you left off — question {phase.index + 1} of {total}.{" "}
          <button
            type="button"
            onClick={restart}
            className="text-fg-subtle underline-offset-2 hover:text-fg hover:underline"
          >
            Start over
          </button>
        </div>
      )}

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

  // One-shot `diagnostic_completed` event when this card mounts. We rely on
  // the parent re-rendering ResultCard (instead of toggling a flag inside the
  // existing tree) so the ref is naturally bounded to "the user reached the
  // end" — not "the user clicked an answer that happened to be the last one".
  const firedRef = React.useRef(false);
  React.useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    // Result reached → drop the saved-progress blob. A future visit should
    // start fresh; otherwise we'd resume them straight onto the result page
    // forever (or until the 24h TTL kicked in).
    clearDiagnosticState();
    track({
      name: "diagnostic_completed",
      properties: {
        answered: summary.answered,
        right: totalRight,
        researcherFraction: summary.researcherFraction,
        devFraction: summary.devFraction,
        recommendedPlaylist: recommendation.playlistSlug,
      },
    });
  }, [
    summary.answered,
    summary.researcherFraction,
    summary.devFraction,
    recommendation.playlistSlug,
    totalRight,
  ]);

  function fireCta(cta: "open_playlist" | "todays_pair") {
    track({
      name: "diagnostic_cta_clicked",
      properties: { cta, recommendedPlaylist: recommendation.playlistSlug },
    });
  }

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
          <Link
            href={`/playlists/${recommendation.playlistSlug}?from=diagnostic`}
            onClick={() => fireCta("open_playlist")}
          >
            <Button>Open {recommendation.playlistName}</Button>
          </Link>
          <Link href="/today" onClick={() => fireCta("todays_pair")}>
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
