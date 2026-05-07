"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NudgePanel } from "@/components/NudgePanel";
import { Latex } from "@/components/Latex";
import { cn } from "@/lib/utils";

export interface PriorAttempt {
  submitted: string;
  isCorrect: boolean;
  /** ISO timestamp from Postgres. */
  createdAt: string;
}

interface NumericAnswerFormProps {
  questionId: string;
  questionTitle: string;
  solutionMd: string | null;
  priorAttempts?: PriorAttempt[];
  /** True if any prior attempt was correct. We unlock the solution from the start in that case. */
  alreadySolved?: boolean;
  /** Placeholder shown in the input. */
  placeholder?: string;
}

type Status =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "wrong"; attemptId: string; submitted: string }
  | { kind: "correct"; attemptId: string };

const SURRENDER_AFTER_WRONG_ATTEMPTS = 3;

export function NumericAnswerForm({
  questionId,
  questionTitle,
  solutionMd,
  priorAttempts = [],
  alreadySolved = false,
  placeholder = "Your answer (e.g. 1/3, 0.5, 6)",
}: NumericAnswerFormProps) {
  const router = useRouter();
  const [value, setValue] = React.useState("");
  const [status, setStatus] = React.useState<Status>({ kind: "idle" });
  const [hintLevelsUsed, setHintLevelsUsed] = React.useState(0);
  const [showSolution, setShowSolution] = React.useState(alreadySolved);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [sessionAttempts, setSessionAttempts] = React.useState<PriorAttempt[]>([]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || status.kind === "checking") return;

    setSubmitError(null);
    setStatus({ kind: "checking" });
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          questionId,
          submittedAnswer: value.trim(),
          hintLevelsUsed,
        }),
      });
      const data = (await res.json()) as
        | { correct: boolean; attemptId: string }
        | { error: string; details?: string };

      if (!res.ok || "error" in data) {
        setStatus({ kind: "idle" });
        const msg = "error" in data ? humanizeError(data) : "request_failed";
        setSubmitError(msg);
        return;
      }

      const submitted = value.trim();
      setSessionAttempts((cur) => [
        { submitted, isCorrect: data.correct, createdAt: new Date().toISOString() },
        ...cur,
      ]);

      if (data.correct) {
        setStatus({ kind: "correct", attemptId: data.attemptId });
        router.refresh();
      } else {
        setStatus({ kind: "wrong", attemptId: data.attemptId, submitted });
      }
    } catch (err) {
      console.error(err);
      setStatus({ kind: "idle" });
      setSubmitError("Network error. Try again.");
    }
  }

  function reset() {
    setValue("");
    setStatus({ kind: "idle" });
    setHintLevelsUsed(0);
    setSubmitError(null);
    if (!alreadySolved) setShowSolution(false);
  }

  const isCorrect = status.kind === "correct";
  const isWrong = status.kind === "wrong";
  const isChecking = status.kind === "checking";

  const allWrongAttempts = React.useMemo(() => {
    const merged = [...sessionAttempts, ...priorAttempts];
    return merged.filter((a) => !a.isCorrect);
  }, [sessionAttempts, priorAttempts]);

  const wrongAttemptCount = allWrongAttempts.length;
  const dedupedWrong = React.useMemo(() => {
    const seen = new Set<string>();
    const out: PriorAttempt[] = [];
    for (const a of allWrongAttempts) {
      const key = a.submitted.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(a);
    }
    return out.slice(0, 5);
  }, [allWrongAttempts]);

  const canSurrender =
    !isCorrect &&
    !alreadySolved &&
    !!solutionMd &&
    (wrongAttemptCount >= SURRENDER_AFTER_WRONG_ATTEMPTS || hintLevelsUsed >= 3);

  return (
    <div className="space-y-5">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={isCorrect || isChecking}
          autoFocus
          aria-label={`Answer for ${questionTitle}`}
          className={cn(
            isWrong && "border-danger/50 focus:border-danger/70",
            isCorrect && "border-success/50"
          )}
        />
        <Button type="submit" disabled={!value.trim() || isCorrect || isChecking}>
          {isChecking ? "Checking…" : isCorrect ? "Correct" : "Submit"}
        </Button>
      </form>

      {submitError && (
        <div className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {submitError}
        </div>
      )}

      {dedupedWrong.length > 0 && !isCorrect && (
        <div className="text-xs text-fg-muted">
          <span className="mr-2 uppercase tracking-wider text-fg-subtle">
            Already tried
          </span>
          {dedupedWrong.map((a, i) => (
            <span key={`${a.submitted}-${i}`} className="mr-2 inline-flex items-center">
              <code className="rounded bg-bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-fg-muted line-through decoration-fg-subtle/60">
                {a.submitted}
              </code>
            </span>
          ))}
        </div>
      )}

      {isWrong && (
        <div className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          That's not quite right. Try again, or ask for a nudge below.
        </div>
      )}

      {isCorrect && (
        <div className="rounded-md border border-success/30 bg-success/5 px-4 py-3 text-sm text-success">
          Correct. Streak and points updated.
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" size="sm" onClick={reset}>
              Try another answer
            </Button>
            {solutionMd && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSolution((s) => !s)}
              >
                {showSolution ? "Hide solution" : "Show solution"}
              </Button>
            )}
          </div>
        </div>
      )}

      {alreadySolved && !isCorrect && (
        <div className="rounded-md border border-success/30 bg-success/5 px-4 py-3 text-sm text-success">
          You've solved this one before. Solution is unlocked below — or have
          another go.
        </div>
      )}

      {isWrong && (
        <NudgePanel
          attemptId={status.attemptId}
          onLevelRevealed={(lvl) => setHintLevelsUsed((cur) => Math.max(cur, lvl))}
        />
      )}

      {canSurrender && !showSolution && (
        <div className="rounded-md border border-border bg-bg-subtle px-4 py-3 text-sm">
          <div className="font-medium text-fg">Stuck?</div>
          <p className="mt-1 text-xs text-fg-muted">
            You've taken {wrongAttemptCount}{" "}
            {wrongAttemptCount === 1 ? "shot" : "shots"}
            {hintLevelsUsed >= 3 ? " and used all three nudges" : ""}. Reveal
            the worked solution if you want to study it — your streak still
            tracks future correct answers.
          </p>
          <div className="mt-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowSolution(true)}
            >
              Reveal solution
            </Button>
          </div>
        </div>
      )}

      {showSolution && solutionMd && (
        <div className="card p-4">
          <div className="mb-2 text-xs uppercase tracking-wider text-fg-muted">
            Solution
          </div>
          <Latex>{solutionMd}</Latex>
        </div>
      )}
    </div>
  );
}

function humanizeError(data: { error: string; details?: string }): string {
  switch (data.error) {
    case "missing_session":
      return "We couldn't find your session cookie. Reload the page and try again.";
    case "question_not_found":
      return "This question is no longer available.";
    case "invalid_request":
      return "Your answer couldn't be parsed. Try a number, fraction, or short word.";
    case "attempt_log_failed":
      return "Couldn't save your attempt. Try again in a moment.";
    default:
      return data.details ?? data.error ?? "Something went wrong.";
  }
}
