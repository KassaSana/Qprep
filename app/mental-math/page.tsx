"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { track } from "@/lib/analytics";
import {
  checkMentalMathAnswer,
  generateMentalMathProblem,
  type MentalMathDifficulty,
  type MentalMathProblem,
} from "@/lib/mental-math";

type SessionState = "ready" | "running" | "finished";

function formatSeconds(s: number): string {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export default function MentalMathPage() {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  /** Monotonic id per started session — prevents double `session_completed` in Strict Mode. */
  const runIdRef = React.useRef(0);
  const completedRunIdRef = React.useRef<number | null>(null);

  // One-shot pageview, strict-mode safe.
  const pageviewFired = React.useRef(false);
  React.useEffect(() => {
    if (pageviewFired.current) return;
    pageviewFired.current = true;
    track({ name: "page_viewed", properties: { path: "/mental-math" } });
  }, []);

  const [difficulty, setDifficulty] = React.useState<MentalMathDifficulty>(2);
  const [durationSec, setDurationSec] = React.useState<number>(60);
  const [includePercentages, setIncludePercentages] = React.useState(true);
  const [includeBps, setIncludeBps] = React.useState(true);

  const [state, setState] = React.useState<SessionState>("ready");
  const [timeLeft, setTimeLeft] = React.useState<number>(durationSec);

  const [problem, setProblem] = React.useState<MentalMathProblem>(() =>
    generateMentalMathProblem({
      difficulty,
      includePercentages,
      includeBps,
    })
  );
  const [answer, setAnswer] = React.useState("");

  const [attempted, setAttempted] = React.useState(0);
  const [correct, setCorrect] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [lastVerdict, setLastVerdict] = React.useState<
    | { kind: "correct" }
    | { kind: "wrong"; expected: number }
    | { kind: "invalid" }
    | null
  >(null);

  const accuracy = attempted === 0 ? 0 : correct / attempted;

  const finishSession = React.useCallback(
    (reason: "timer" | "stop", timeLeftAtFinish: number) => {
      if (completedRunIdRef.current === runIdRef.current) return;
      completedRunIdRef.current = runIdRef.current;
      setState("finished");
      const elapsedSeconds = Math.max(0, durationSec - timeLeftAtFinish);
      track({
        name: "mental_math_session_completed",
        properties: {
          reason,
          durationSec,
          difficulty,
          includePercentages,
          includeBps,
          elapsedSeconds,
          attempted,
          correct,
          accuracy: attempted === 0 ? 0 : correct / attempted,
          streakAtEnd: streak,
        },
      });
    },
    [
      attempted,
      correct,
      streak,
      durationSec,
      difficulty,
      includePercentages,
      includeBps,
    ]
  );

  const nextProblem = React.useCallback(() => {
    setProblem(
      generateMentalMathProblem({
        difficulty,
        includePercentages,
        includeBps,
      })
    );
    setAnswer("");
    setLastVerdict(null);
    queueMicrotask(() => inputRef.current?.focus());
  }, [difficulty, includePercentages, includeBps]);

  const resetSession = React.useCallback(() => {
    setState("ready");
    setAttempted(0);
    setCorrect(0);
    setStreak(0);
    setLastVerdict(null);
    setTimeLeft(durationSec);
    nextProblem();
  }, [durationSec, nextProblem]);

  const start = React.useCallback(() => {
    runIdRef.current += 1;
    completedRunIdRef.current = null;
    setState("running");
    setTimeLeft(durationSec);
    setAttempted(0);
    setCorrect(0);
    setStreak(0);
    setLastVerdict(null);
    nextProblem();
  }, [durationSec, nextProblem]);

  // Keep timeLeft aligned if user edits duration before starting.
  React.useEffect(() => {
    if (state === "ready") setTimeLeft(durationSec);
  }, [durationSec, state]);

  // Countdown tick.
  React.useEffect(() => {
    if (state !== "running") return;
    if (timeLeft <= 0) {
      finishSession("timer", 0);
      return;
    }
    const t = window.setTimeout(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearTimeout(t);
  }, [state, timeLeft, finishSession]);

  const submit = React.useCallback(() => {
    if (state !== "running") return;

    const r = checkMentalMathAnswer(problem, answer);
    if (r.parsed === null) {
      setLastVerdict({ kind: "invalid" });
      setStreak(0);
      return;
    }

    setAttempted((x) => x + 1);
    if (r.ok) {
      setCorrect((x) => x + 1);
      setStreak((x) => x + 1);
      setLastVerdict({ kind: "correct" });
    } else {
      setStreak(0);
      setLastVerdict({ kind: "wrong", expected: problem.answer });
    }

    nextProblem();
  }, [answer, nextProblem, problem, state]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Mental math
            </h1>
            <p className="mt-1 text-sm text-fg-muted">
              Zetamac-style timed drills. Client-generated questions (no seed rows).
            </p>
          </div>
          <Link href="/questions">
            <Button variant="secondary" size="sm">
              Browse bank
            </Button>
          </Link>
        </div>
      </header>

      <section className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="pill">
              <span className="mr-1 text-fg-subtle">time</span>
              <span className="font-medium text-fg">{formatSeconds(timeLeft)}</span>
            </span>
            <span className="pill">
              <span className="mr-1 text-fg-subtle">streak</span>
              <span className="font-medium text-fg">{streak}</span>
            </span>
            <span className="pill">
              <span className="mr-1 text-fg-subtle">acc</span>
              <span className="font-medium text-fg">
                {attempted === 0 ? "—" : `${Math.round(accuracy * 100)}%`}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {state !== "running" ? (
              <Button onClick={start} size="sm">
                Start
              </Button>
            ) : (
              <Button
                onClick={() => finishSession("stop", timeLeft)}
                variant="danger"
                size="sm"
              >
                Stop
              </Button>
            )}
            <Button onClick={resetSession} variant="ghost" size="sm">
              Reset
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <label className="text-xs text-fg-muted">
            Duration
            <select
              className="mt-1 h-11 w-full rounded-md border border-border bg-bg-subtle px-3 text-sm text-fg"
              value={durationSec}
              disabled={state === "running"}
              onChange={(e) => setDurationSec(Number(e.target.value))}
            >
              {[30, 60, 120, 300].map((s) => (
                <option key={s} value={s}>
                  {s}s
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs text-fg-muted">
            Difficulty
            <select
              className="mt-1 h-11 w-full rounded-md border border-border bg-bg-subtle px-3 text-sm text-fg"
              value={difficulty}
              disabled={state === "running"}
              onChange={(e) => setDifficulty(Number(e.target.value) as MentalMathDifficulty)}
            >
              <option value={1}>Easy</option>
              <option value={2}>Medium</option>
              <option value={3}>Hard</option>
            </select>
          </label>

          <div className="flex flex-col justify-end gap-2">
            <label className="flex items-center gap-2 text-xs text-fg-muted">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={includePercentages}
                disabled={state === "running"}
                onChange={(e) => setIncludePercentages(e.target.checked)}
              />
              Percentages
            </label>
            <label className="flex items-center gap-2 text-xs text-fg-muted">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={includeBps}
                disabled={state === "running"}
                onChange={(e) => setIncludeBps(e.target.checked)}
              />
              Basis points
            </label>
          </div>
        </div>

        <div className="mt-8 rounded-md border border-border bg-bg-raised p-6">
          <div className="text-sm text-fg-muted">Solve:</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight">
            {state === "finished" ? "Session finished" : problem.prompt}
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={answer}
                disabled={state !== "running"}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={state === "running" ? "Type answer and press Enter" : "Press Start"}
                inputMode="decimal"
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                }}
              />
            </div>
            <Button
              onClick={submit}
              disabled={state !== "running"}
              className="sm:w-32"
            >
              Submit
            </Button>
          </div>

          {lastVerdict && (
            <div className="mt-4 text-sm">
              {lastVerdict.kind === "correct" && (
                <span className="text-success">Correct.</span>
              )}
              {lastVerdict.kind === "invalid" && (
                <span className="text-warning">
                  Please enter a valid number.
                </span>
              )}
              {lastVerdict.kind === "wrong" && (
                <span className="text-danger">
                  Wrong. Expected {lastVerdict.expected}.
                </span>
              )}
            </div>
          )}
        </div>

        {state === "finished" && (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="card p-4">
              <div className="text-xs text-fg-muted">Attempted</div>
              <div className="mt-1 text-2xl font-semibold">{attempted}</div>
            </div>
            <div className="card p-4">
              <div className="text-xs text-fg-muted">Correct</div>
              <div className="mt-1 text-2xl font-semibold">{correct}</div>
            </div>
            <div className="card p-4">
              <div className="text-xs text-fg-muted">Accuracy</div>
              <div className="mt-1 text-2xl font-semibold">
                {attempted === 0 ? "—" : `${Math.round(accuracy * 100)}%`}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

