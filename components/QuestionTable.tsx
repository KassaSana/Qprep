import Link from "next/link";
import { difficultyLabel } from "@/content/question-types";
import { cn } from "@/lib/utils";

export type QuestionStatus = "correct" | "attempted" | undefined;

export interface QuestionRow {
  id: string;
  slug: string;
  title: string;
  topic: string;
  answer_kind: string;
  difficulty: number;
  tags: string[];
  companies: string[];
  status?: QuestionStatus;
}

interface QuestionTableProps {
  questions: QuestionRow[];
  /** When provided, shows a per-question position number on the row. */
  showPosition?: boolean;
}

const KIND_LABEL: Record<string, string> = {
  numeric: "Numeric",
  fraction: "Fraction",
  exact: "Exact",
  mcq: "MCQ",
  freeform: "Freeform",
  code: "Code",
};

export function QuestionTable({ questions, showPosition }: QuestionTableProps) {
  if (questions.length === 0) {
    return (
      <div className="card px-5 py-8 text-sm text-fg-muted">
        No questions match those filters.
      </div>
    );
  }

  return (
    <ul className="card divide-y divide-border">
      {questions.map((q, idx) => (
        <li key={q.id}>
          <Link
            href={`/questions/${q.slug}`}
            className="flex items-center gap-4 px-5 py-3 transition hover:bg-bg-raised"
          >
            <StatusDot status={q.status} />
            {showPosition && (
              <span className="w-6 text-right text-xs font-mono text-fg-subtle">
                {idx + 1}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-fg truncate">{q.title}</div>
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-fg-muted">
                <span className="pill">{q.topic}</span>
                <span className="pill">{KIND_LABEL[q.answer_kind] ?? q.answer_kind}</span>
                <span
                  className={cn(
                    "pill",
                    q.difficulty <= 1 && "border-success/40 text-success",
                    q.difficulty === 2 && "border-success/40 text-success",
                    q.difficulty === 3 && "border-warning/40 text-warning",
                    q.difficulty >= 4 && "border-danger/40 text-danger"
                  )}
                >
                  {difficultyLabel(q.difficulty)}
                </span>
                {q.tags.slice(0, 3).map((t) => (
                  <span key={t} className="text-fg-subtle">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
            {q.companies.length > 0 && (
              <div className="hidden shrink-0 sm:flex flex-wrap items-center gap-1 max-w-[200px] justify-end">
                {q.companies.slice(0, 2).map((c) => (
                  <span
                    key={c}
                    className="rounded-md border border-border bg-bg-subtle px-2 py-0.5 text-[10px] uppercase tracking-wider text-fg-muted"
                  >
                    {c}
                  </span>
                ))}
                {q.companies.length > 2 && (
                  <span className="text-[10px] text-fg-subtle">
                    +{q.companies.length - 2}
                  </span>
                )}
              </div>
            )}
            <span className="text-fg-subtle">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function StatusDot({ status }: { status: QuestionStatus }) {
  return (
    <span
      aria-hidden
      className={cn(
        "h-2.5 w-2.5 rounded-full shrink-0",
        status === "correct" && "bg-success",
        status === "attempted" && "bg-warning",
        !status && "bg-border"
      )}
    />
  );
}
