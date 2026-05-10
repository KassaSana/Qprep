"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Latex } from "@/components/Latex";
import { NudgePanel } from "@/components/NudgePanel";
import { NextQuestionCTA } from "@/components/answer/NextQuestionCTA";
import type { FreeformMeta } from "@/content/question-types";
import { cn } from "@/lib/utils";

interface FreeformAnswerFormProps {
  questionId: string;
  questionTitle: string;
  answerMeta: FreeformMeta;
  solutionMd: string | null;
  alreadySolved?: boolean;
  nextHref?: string | null;
  nextLabel?: string | null;
}

interface CheckResponse {
  correct: boolean;
  attemptId: string;
  feedback?: string;
  provider?: string;
}

type Status =
  | { kind: "idle" }
  | { kind: "checking" }
  | {
      kind: "graded";
      attemptId: string;
      correct: boolean;
      feedback: string;
      provider: string;
    };

export function FreeformAnswerForm({
  questionId,
  questionTitle,
  answerMeta,
  solutionMd,
  alreadySolved = false,
  nextHref = null,
  nextLabel = null,
}: FreeformAnswerFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from") ?? undefined;
  const [value, setValue] = React.useState("");
  const [status, setStatus] = React.useState<Status>({ kind: "idle" });
  const [hintLevelsUsed, setHintLevelsUsed] = React.useState(0);
  const [showSolution, setShowSolution] = React.useState(alreadySolved);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const wordCount = (value.match(/\b\w+\b/g) ?? []).length;
  const minWords = answerMeta.min_words ?? 0;
  const meetsMin = wordCount >= minWords;

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
          submittedAnswer: value,
          hintLevelsUsed,
          from: fromParam,
        }),
      });
      const data = (await res.json()) as CheckResponse | { error: string };
      if (!res.ok || "error" in data) {
        setStatus({ kind: "idle" });
        setSubmitError(("error" in data && data.error) || "Request failed.");
        return;
      }
      setStatus({
        kind: "graded",
        attemptId: data.attemptId,
        correct: data.correct,
        feedback: data.feedback ?? "",
        provider: data.provider ?? "unknown",
      });
      if (data.correct) router.refresh();
    } catch (err) {
      console.error(err);
      setStatus({ kind: "idle" });
      setSubmitError("Network error. Try again.");
    }
  }

  const isChecking = status.kind === "checking";
  const graded = status.kind === "graded" ? status : null;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="freeform-answer"
          className="mb-1 block text-xs font-medium uppercase tracking-wider text-fg-muted"
        >
          Your answer
        </label>
        <textarea
          id="freeform-answer"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={8}
          disabled={isChecking}
          aria-label={`Answer for ${questionTitle}`}
          className="w-full rounded-md border border-border bg-bg-subtle p-3 text-sm focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
          placeholder="Type your reasoning. Plain prose is fine; bullet points are also fine."
        />
        <div className="mt-1 flex items-center justify-between text-xs text-fg-subtle">
          <span>
            {wordCount} word{wordCount === 1 ? "" : "s"}
            {minWords > 0 && (
              <>
                {" · "}
                <span className={cn(!meetsMin && "text-warning")}>
                  rubric expects at least {minWords}
                </span>
              </>
            )}
          </span>
          <span>Markdown + LaTeX (`$...$`) supported in the preview below</span>
        </div>
      </div>

      {value.trim().length > 0 && (
        <div className="card p-4">
          <div className="mb-2 text-xs uppercase tracking-wider text-fg-muted">
            Preview
          </div>
          <Latex>{value}</Latex>
        </div>
      )}

      <div className="rounded-md border border-border bg-bg-subtle p-4">
        <div className="text-xs font-medium uppercase tracking-wider text-fg-muted">
          Rubric
        </div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-fg-muted">
          {answerMeta.rubric.map((b, idx) => (
            <li key={idx}>{b}</li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={!value.trim() || isChecking}>
          {isChecking ? "Grading…" : "Submit"}
        </Button>
        {graded && solutionMd && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowSolution((s) => !s)}
          >
            {showSolution ? "Hide reference" : "Show reference"}
          </Button>
        )}
      </div>

      {submitError && (
        <div className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {submitError}
        </div>
      )}

      {graded && (
        <div
          className={cn(
            "rounded-md border px-4 py-3 text-sm",
            graded.correct
              ? "border-success/30 bg-success/5 text-success"
              : "border-danger/30 bg-danger/5 text-danger"
          )}
        >
          <div className="mb-1 flex items-center justify-between">
            <span className="font-medium">
              {graded.correct ? "Passed the rubric." : "Not yet — see feedback below."}
            </span>
            <span className="rounded-full border border-border bg-bg-raised px-2 py-0.5 text-[10px] uppercase tracking-wider text-fg-muted">
              graded by {graded.provider}
            </span>
          </div>
          {graded.feedback && <p className="text-sm">{graded.feedback}</p>}
          {graded.correct && nextHref && (
            <div className="mt-3">
              <NextQuestionCTA href={nextHref} label={nextLabel} />
            </div>
          )}
        </div>
      )}

      {graded && !graded.correct && (
        <NudgePanel
          attemptId={graded.attemptId}
          onLevelRevealed={(lvl) => setHintLevelsUsed((cur) => Math.max(cur, lvl))}
        />
      )}

      {(showSolution || (alreadySolved && !graded)) &&
        (solutionMd || answerMeta.reference_solution_md) && (
          <div className="card p-4">
            <div className="mb-2 text-xs uppercase tracking-wider text-fg-muted">
              Reference solution
            </div>
            <Latex>{answerMeta.reference_solution_md ?? solutionMd ?? ""}</Latex>
          </div>
        )}
    </form>
  );
}
