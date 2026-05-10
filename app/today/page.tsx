import type { Metadata } from "next";
import Link from "next/link";
import { PageView } from "@/components/PageView";
import { TodayStatusEmitter } from "@/components/TodayStatusEmitter";
import { getAnonId } from "@/lib/anon";
import { loadAllQuestions, type LoadedQuestion } from "@/lib/questions-data";
import {
  pickTodayPair,
  type TodayRole,
} from "@/lib/today";
import { difficultyLabel } from "@/content/question-types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Today",
  description:
    "Two new quant interview questions every day — one for the researcher loop, one for the dev loop. Same pair worldwide, deterministic by UTC date.",
  openGraph: {
    title: "Today's pair · QPrep",
    description:
      "Two new quant interview questions every day — one researcher, one dev.",
  },
};

/**
 * Two questions a day, deterministic by UTC date — one Researcher, one Dev.
 *
 * Habit-forming hook the home redesign implies: a stable destination users
 * can come back to once a day, with a status badge that reflects whether
 * they've already cleared today's pair.
 */
export default async function TodayPage() {
  const anonId = await getAnonId();
  const { questions, attempts } = await loadAllQuestions(anonId);
  const today = new Date();
  const pair = pickTodayPair(today, questions);

  const solvedIds = new Set(
    attempts.filter((a) => a.is_correct).map((a) => a.question_id)
  );
  const attemptedIds = new Set(attempts.map((a) => a.question_id));

  const researcherSolved =
    pair.researcher != null && solvedIds.has(pair.researcher.id);
  const devSolved = pair.dev != null && solvedIds.has(pair.dev.id);
  const cleared =
    (pair.researcher == null || researcherSolved) &&
    (pair.dev == null || devSolved);

  const dateLabel = formatDateLabel(pair.dateKey);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <PageView path="/today" />
      <TodayStatusEmitter
        researcherSolved={researcherSolved}
        devSolved={devSolved}
        cleared={cleared}
      />
      <header className="mb-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-fg-muted">
              Today · {pair.dateKey}
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              {dateLabel}
            </h1>
          </div>
          {cleared && (
            <span className="pill border-success/40 text-success">
              ✓ Day cleared
            </span>
          )}
        </div>
        <p className="mt-3 max-w-2xl text-sm text-fg-muted">
          Two fresh questions every day — one for the researcher loop, one for
          the dev loop. Same pair worldwide; come back tomorrow for new ones.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <DailyCard
          role="Researcher"
          question={pair.researcher}
          status={
            pair.researcher == null
              ? "missing"
              : solvedIds.has(pair.researcher.id)
                ? "solved"
                : attemptedIds.has(pair.researcher.id)
                  ? "attempted"
                  : "fresh"
          }
        />
        <DailyCard
          role="Dev"
          question={pair.dev}
          status={
            pair.dev == null
              ? "missing"
              : solvedIds.has(pair.dev.id)
                ? "solved"
                : attemptedIds.has(pair.dev.id)
                  ? "attempted"
                  : "fresh"
          }
        />
      </section>

      <footer className="mt-10 text-xs text-fg-subtle">
        Picker is deterministic by UTC date. If you want to drill more, browse
        the{" "}
        <Link
          href="/playlists"
          className="underline-offset-2 hover:text-fg hover:underline"
        >
          curated playlists
        </Link>{" "}
        or the{" "}
        <Link
          href="/questions"
          className="underline-offset-2 hover:text-fg hover:underline"
        >
          full bank
        </Link>
        .
      </footer>
    </main>
  );
}

type DailyCardStatus = "fresh" | "attempted" | "solved" | "missing";

function DailyCard({
  role,
  question,
  status,
}: {
  role: TodayRole;
  question: LoadedQuestion | null;
  status: DailyCardStatus;
}) {
  const roleEmoji = role === "Researcher" ? "📐" : "⚙️";
  const roleSub = role === "Researcher" ? "Probability / Stats / Math" : "Algorithms / Concurrency / Systems";

  if (status === "missing" || !question) {
    return (
      <div className="card p-6">
        <div className="text-xs uppercase tracking-wider text-fg-muted">
          <span aria-hidden className="mr-1">
            {roleEmoji}
          </span>
          {role}
        </div>
        <p className="mt-3 text-sm text-fg-muted">
          No question available for this role today. The bank may be empty for{" "}
          <code>{role}</code> after filtering.
        </p>
      </div>
    );
  }

  return (
    <Link
      href={`/questions/${question.slug}?from=today`}
      className="card group block p-6 transition hover:border-accent/40 hover:bg-bg-raised"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-fg-muted">
            <span aria-hidden className="mr-1">
              {roleEmoji}
            </span>
            {role}
          </div>
          <div className="text-[11px] text-fg-subtle">{roleSub}</div>
        </div>
        <StatusPill status={status} />
      </div>

      <h2 className="mt-3 text-lg font-semibold tracking-tight">
        {question.title}
      </h2>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-fg-muted">
        <span className="pill">{question.topic}</span>
        <span className="pill">{difficultyLabel(question.difficulty)}</span>
        <span className="pill">{question.answer_kind}</span>
      </div>

      <div className="mt-5 text-sm font-medium text-accent transition-transform group-hover:translate-x-0.5">
        {status === "solved" ? "Revisit →" : "Start →"}
      </div>
    </Link>
  );
}

function StatusPill({ status }: { status: DailyCardStatus }) {
  if (status === "solved") {
    return (
      <span className="pill border-success/40 text-success">✓ Solved</span>
    );
  }
  if (status === "attempted") {
    return (
      <span className="pill border-warning/40 text-warning">In progress</span>
    );
  }
  return <span className="pill">New</span>;
}

/**
 * Render `2026-05-10` as `Sunday, May 10`. Uses UTC to match dateKey.
 */
function formatDateLabel(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map((s) => parseInt(s, 10));
  if (!y || !m || !d) return dateKey;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
