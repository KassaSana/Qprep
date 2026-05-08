"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Latex } from "@/components/Latex";
import { NudgePanel } from "@/components/NudgePanel";
import { NextQuestionCTA } from "@/components/answer/NextQuestionCTA";
import type { CodeMeta } from "@/content/question-types";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 items-center justify-center rounded-md border border-border bg-bg-subtle text-xs text-fg-muted">
      Loading editor…
    </div>
  ),
});

interface CaseResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  hidden: boolean;
  stdout: string;
  stderr: string;
  time_ms: number;
  skipped?: boolean;
  timed_out?: boolean;
}

interface RunResponse {
  passed: boolean;
  results: CaseResult[];
  runner: "piston" | "mock";
  message?: string;
}

interface CheckResponse {
  correct: boolean;
  attemptId: string;
  results?: CaseResult[];
  runner?: "piston" | "mock";
  feedback?: string;
}

interface CodeAnswerFormProps {
  questionId: string;
  questionTitle: string;
  answerMeta: CodeMeta;
  solutionMd: string | null;
  alreadySolved?: boolean;
  nextHref?: string | null;
  nextLabel?: string | null;
}

const LANGUAGE_TO_MONACO: Record<string, string> = {
  python: "python",
  python3: "python",
  javascript: "javascript",
  node: "javascript",
  typescript: "typescript",
  cpp: "cpp",
  "c++": "cpp",
  c: "c",
  java: "java",
  go: "go",
  rust: "rust",
};

type Status =
  | { kind: "idle" }
  | { kind: "running" }
  | { kind: "submitting" }
  | {
      kind: "ran";
      runner: "piston" | "mock";
      results: CaseResult[];
      passed: boolean;
      message?: string;
    }
  | {
      kind: "submitted";
      attemptId: string;
      correct: boolean;
      results: CaseResult[];
      runner: "piston" | "mock";
    };

export function CodeAnswerForm({
  questionId,
  questionTitle,
  answerMeta,
  solutionMd,
  alreadySolved = false,
  nextHref = null,
  nextLabel = null,
}: CodeAnswerFormProps) {
  const router = useRouter();
  const [source, setSource] = React.useState(answerMeta.starter_code);
  const [status, setStatus] = React.useState<Status>({ kind: "idle" });
  const [hintLevelsUsed, setHintLevelsUsed] = React.useState(0);
  const [showSolution, setShowSolution] = React.useState(alreadySolved);
  const [error, setError] = React.useState<string | null>(null);

  const monacoLang =
    LANGUAGE_TO_MONACO[answerMeta.language.toLowerCase()] ?? "plaintext";

  const visibleCases = React.useMemo(
    () => answerMeta.test_cases.filter((c) => !c.hidden),
    [answerMeta.test_cases]
  );

  async function onRun() {
    setError(null);
    setStatus({ kind: "running" });
    try {
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ questionId, source }),
      });
      const data = (await res.json()) as RunResponse | { error: string };
      if (!res.ok || "error" in data) {
        setStatus({ kind: "idle" });
        setError(("error" in data && data.error) || "Run failed.");
        return;
      }
      setStatus({
        kind: "ran",
        runner: data.runner,
        results: data.results,
        passed: data.passed,
        message: data.message,
      });
    } catch (err) {
      console.error(err);
      setStatus({ kind: "idle" });
      setError("Network error. Try again.");
    }
  }

  async function onSubmit() {
    setError(null);
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          questionId,
          submittedAnswer: source,
          hintLevelsUsed,
        }),
      });
      const data = (await res.json()) as CheckResponse | { error: string };
      if (!res.ok || "error" in data) {
        setStatus({ kind: "idle" });
        setError(("error" in data && data.error) || "Submit failed.");
        return;
      }
      setStatus({
        kind: "submitted",
        attemptId: data.attemptId,
        correct: data.correct,
        results: data.results ?? [],
        runner: data.runner ?? "piston",
      });
      if (data.correct) router.refresh();
    } catch (err) {
      console.error(err);
      setStatus({ kind: "idle" });
      setError("Network error. Try again.");
    }
  }

  const isBusy = status.kind === "running" || status.kind === "submitting";
  const lastResults =
    status.kind === "ran" || status.kind === "submitted"
      ? status.results
      : null;
  const submittedCorrect =
    status.kind === "submitted" ? status.correct : false;
  const ranButFailed =
    status.kind === "ran" && !status.passed && status.runner === "piston";

  return (
    <div className="space-y-5">
      <div className="rounded-md border border-border overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-bg-subtle px-3 py-1.5 text-[11px] uppercase tracking-wider text-fg-muted">
          <span>{answerMeta.language}</span>
          <span>{source.split("\n").length} lines</span>
        </div>
        <MonacoEditor
          height="22rem"
          language={monacoLang}
          theme="vs"
          value={source}
          onChange={(v) => setSource(v ?? "")}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 2,
            automaticLayout: true,
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="secondary" onClick={onRun} disabled={isBusy}>
          {status.kind === "running" ? "Running…" : "Run sample tests"}
        </Button>
        <Button type="button" onClick={onSubmit} disabled={isBusy || submittedCorrect}>
          {status.kind === "submitting"
            ? "Submitting…"
            : submittedCorrect
              ? "Solved"
              : "Submit"}
        </Button>
        {(submittedCorrect || alreadySolved) && solutionMd && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowSolution((s) => !s)}
          >
            {showSolution ? "Hide solution" : "Show solution"}
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {status.kind === "ran" && status.runner === "mock" && status.message && (
        <div className="rounded-md border border-warning/30 bg-warning/10 px-4 py-3 text-xs text-warning">
          {status.message}
        </div>
      )}

      {status.kind === "submitted" && (
        <div
          className={cn(
            "rounded-md border px-4 py-3 text-sm",
            submittedCorrect
              ? "border-success/30 bg-success/5 text-success"
              : "border-danger/30 bg-danger/5 text-danger"
          )}
        >
          {submittedCorrect
            ? "All test cases pass. Streak and points updated."
            : "Some test cases still fail. See results below."}
          {submittedCorrect && nextHref && (
            <div className="mt-3">
              <NextQuestionCTA href={nextHref} label={nextLabel} />
            </div>
          )}
        </div>
      )}

      {(lastResults && lastResults.length > 0) || visibleCases.length > 0 ? (
        <div className="card divide-y divide-border">
          <div className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-fg-muted">
            Test cases
          </div>
          <ul className="divide-y divide-border">
            {(lastResults ?? visibleCases.map((tc, idx) => ({
              input: tc.input,
              expected: tc.expected,
              actual: "",
              passed: false,
              hidden: !!tc.hidden,
              stdout: "",
              stderr: "",
              time_ms: 0,
              skipped: true,
              _idx: idx,
            }))).map((r, idx) => (
              <li
                key={idx}
                className={cn(
                  "px-4 py-3 text-sm",
                  r.passed && "bg-success/5",
                  !r.passed && !("skipped" in r ? r.skipped : false) && "bg-danger/5"
                )}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">
                    Case {idx + 1}
                    {r.hidden && (
                      <span className="ml-2 rounded-full border border-border bg-bg-subtle px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-fg-muted">
                        hidden
                      </span>
                    )}
                  </span>
                  <span className={cn(
                    "uppercase tracking-wider",
                    r.passed ? "text-success" : (("skipped" in r && r.skipped) ? "text-fg-muted" : "text-danger")
                  )}>
                    {("skipped" in r && r.skipped)
                      ? "skipped"
                      : r.passed
                        ? `pass · ${r.time_ms}ms`
                        : r.timed_out
                          ? "timed out"
                          : "fail"}
                  </span>
                </div>
                {!r.hidden && (
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    <CaseField label="Input" value={r.input} />
                    <CaseField label="Expected" value={r.expected} />
                    <CaseField
                      label="Actual"
                      value={r.passed ? r.actual : r.actual || r.stdout}
                    />
                  </div>
                )}
                {r.stderr && (
                  <pre className="mt-2 overflow-x-auto rounded bg-bg-subtle p-2 text-[11px] text-danger">
                    {r.stderr}
                  </pre>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {(status.kind === "submitted" && !submittedCorrect) || ranButFailed ? (
        <NudgePanel
          attemptId={
            status.kind === "submitted"
              ? status.attemptId
              : ""
          }
          onLevelRevealed={(lvl) => setHintLevelsUsed((cur) => Math.max(cur, lvl))}
        />
      ) : null}

      {showSolution && solutionMd && (
        <div className="card p-4">
          <div className="mb-2 text-xs uppercase tracking-wider text-fg-muted">
            Solution
          </div>
          <Latex>{solutionMd}</Latex>
        </div>
      )}

      <span className="sr-only">Code editor for {questionTitle}</span>
    </div>
  );
}

function CaseField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
        {label}
      </div>
      <pre className="mt-1 max-h-40 overflow-auto rounded border border-border bg-bg-subtle p-2 text-[11px] font-mono">
        {value || <span className="text-fg-subtle">(empty)</span>}
      </pre>
    </div>
  );
}
