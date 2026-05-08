"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Latex } from "@/components/Latex";
import { NudgePanel } from "@/components/NudgePanel";
import { NextQuestionCTA } from "@/components/answer/NextQuestionCTA";
import type { McqMeta } from "@/content/question-types";
import { cn } from "@/lib/utils";

interface McqAnswerFormProps {
  questionId: string;
  questionTitle: string;
  answerMeta: McqMeta;
  solutionMd: string | null;
  alreadySolved?: boolean;
  nextHref?: string | null;
  nextLabel?: string | null;
}

type Status =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "wrong"; attemptId: string; selected: string }
  | { kind: "correct"; selected: string };

export function McqAnswerForm({
  questionId,
  questionTitle,
  answerMeta,
  solutionMd,
  alreadySolved = false,
  nextHref = null,
  nextLabel = null,
}: McqAnswerFormProps) {
  const router = useRouter();
  const [selected, setSelected] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<Status>({ kind: "idle" });
  const [hintLevelsUsed, setHintLevelsUsed] = React.useState(0);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [showSolution, setShowSolution] = React.useState(alreadySolved);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || status.kind === "checking" || status.kind === "correct") return;

    setSubmitError(null);
    setStatus({ kind: "checking" });
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          questionId,
          submittedAnswer: selected,
          hintLevelsUsed,
        }),
      });
      const data = (await res.json()) as
        | { correct: boolean; attemptId: string }
        | { error: string };
      if (!res.ok || "error" in data) {
        setStatus({ kind: "idle" });
        setSubmitError(("error" in data && data.error) || "Request failed.");
        return;
      }
      if (data.correct) {
        setStatus({ kind: "correct", selected });
        router.refresh();
      } else {
        setStatus({ kind: "wrong", attemptId: data.attemptId, selected });
      }
    } catch (err) {
      console.error(err);
      setStatus({ kind: "idle" });
      setSubmitError("Network error. Try again.");
    }
  }

  const isCorrect = status.kind === "correct";
  const isWrong = status.kind === "wrong";
  const isChecking = status.kind === "checking";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <ol className="space-y-2" aria-label={`Answer choices for ${questionTitle}`}>
        {answerMeta.options.map((opt, idx) => {
          const isSelected = selected === opt.id;
          const showAsCorrect = isCorrect && opt.correct;
          const showAsWrongChosen = isWrong && isSelected;
          return (
            <li key={opt.id}>
              <label
                className={cn(
                  "flex items-start gap-3 rounded-md border px-4 py-3 text-sm transition cursor-pointer",
                  showAsCorrect && "border-success/50 bg-success/10",
                  showAsWrongChosen && "border-danger/40 bg-danger/5",
                  !showAsCorrect && !showAsWrongChosen && isSelected && "border-accent",
                  !showAsCorrect && !showAsWrongChosen && !isSelected && "border-border bg-bg-raised hover:border-accent/40"
                )}
              >
                <input
                  type="radio"
                  name={`mcq-${questionId}`}
                  value={opt.id}
                  checked={isSelected}
                  disabled={isCorrect || isChecking}
                  onChange={() => setSelected(opt.id)}
                  className="mt-0.5 h-4 w-4 accent-accent"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-fg-subtle">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <Latex className="text-fg">{opt.label}</Latex>
                  </div>
                </div>
              </label>
            </li>
          );
        })}
      </ol>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={!selected || isCorrect || isChecking}>
          {isChecking ? "Checking…" : isCorrect ? "Correct" : "Submit"}
        </Button>
        {isCorrect && solutionMd && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowSolution((s) => !s)}
          >
            {showSolution ? "Hide explanation" : "Show explanation"}
          </Button>
        )}
      </div>

      {submitError && (
        <div className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {submitError}
        </div>
      )}

      {isCorrect && (
        <div className="rounded-md border border-success/30 bg-success/5 px-4 py-3 text-sm text-success">
          <div>Correct. Streak and points updated.</div>
          {nextHref && (
            <div className="mt-3">
              <NextQuestionCTA href={nextHref} label={nextLabel} />
            </div>
          )}
        </div>
      )}

      {isWrong && (
        <div className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          Not quite. Pick again, or ask for a nudge.
        </div>
      )}

      {isWrong && (
        <NudgePanel
          attemptId={status.attemptId}
          onLevelRevealed={(lvl) => setHintLevelsUsed((cur) => Math.max(cur, lvl))}
        />
      )}

      {showSolution && solutionMd && (
        <div className="card p-4">
          <div className="mb-2 text-xs uppercase tracking-wider text-fg-muted">
            Explanation
          </div>
          <Latex>{solutionMd}</Latex>
        </div>
      )}
    </form>
  );
}
