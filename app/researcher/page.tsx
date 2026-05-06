import Link from "next/link";
import { getAnonId } from "@/lib/anon";
import {
  getLocalAttemptsForUser,
  getLocalProfile,
  getLocalResearcherQuestions,
} from "@/lib/local-dev";
import {
  ensureAnonUser,
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const DIFFICULTY_LABEL = ["", "Easy", "Easy+", "Medium", "Hard", "Brutal"];

interface QuestionRow {
  id: string;
  slug: string;
  title: string;
  difficulty: number;
  tags: string[];
}

interface AttemptStat {
  question_id: string;
  is_correct: boolean;
}

export default async function ResearcherPage() {
  const anonId = await getAnonId();
  const supabaseReady = isSupabaseConfigured();

  let questions: QuestionRow[] = [];
  let attempts: AttemptStat[] = [];
  let profile:
    | { streak_count: number; total_points: number; researcher_level: number }
    | null = null;

  if (!supabaseReady) {
    questions = getLocalResearcherQuestions().map((q) => ({
      id: q.id,
      slug: q.slug,
      title: q.title,
      difficulty: q.difficulty,
      tags: q.tags,
    }));
    attempts = getLocalAttemptsForUser(anonId).map((a) => ({
      question_id: a.question_id,
      is_correct: a.is_correct,
    }));
    profile = getLocalProfile(anonId);
  } else {
    const sb = getSupabaseAdmin();

    if (anonId) {
      await ensureAnonUser(anonId);
    }

    const [{ data: remoteQuestions }, { data: remoteAttempts }, { data: remoteProfile }] =
      await Promise.all([
        sb
          .from("questions")
          .select("id, slug, title, difficulty, tags")
          .eq("track", "researcher")
          .order("difficulty", { ascending: true })
          .order("title", { ascending: true }),
        anonId
          ? sb
              .from("attempts")
              .select("question_id, is_correct")
              .eq("anon_user_id", anonId)
          : Promise.resolve({ data: [] as AttemptStat[] }),
        anonId
          ? sb
              .from("anon_users")
              .select("streak_count, total_points, researcher_level")
              .eq("id", anonId)
              .single()
          : Promise.resolve({
              data: { streak_count: 0, total_points: 0, researcher_level: 1 },
            }),
      ]);

    questions = (remoteQuestions ?? []) as QuestionRow[];
    attempts = (remoteAttempts ?? []) as AttemptStat[];
    profile = (remoteProfile ?? null) as {
      streak_count: number;
      total_points: number;
      researcher_level: number;
    } | null;
  }

  const status = new Map<string, "correct" | "attempted">();
  for (const a of attempts ?? []) {
    if (a.is_correct) {
      status.set(a.question_id, "correct");
    } else if (!status.has(a.question_id)) {
      status.set(a.question_id, "attempted");
    }
  }

  const total = (questions ?? []).length;
  const solved = Array.from(status.values()).filter((s) => s === "correct").length;

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href="/"
        className="inline-block text-sm text-fg-muted hover:text-fg"
      >
        ← All tracks
      </Link>

      <header className="mt-4 mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Quant Researcher
        </h1>
        <p className="mt-1 text-sm text-fg-muted">
          Probability, stochastic, and theorem recall. Pick a problem to start.
        </p>
        {!supabaseReady && (
          <p className="mt-3 inline-flex rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning">
            Local preview mode: using the built-in seed bank and in-memory progress
            because Supabase is not configured yet.
          </p>
        )}
      </header>

      <section className="card p-5 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <Stat label="Solved" value={`${solved} / ${total}`} />
          <Stat
            label="Streak"
            value={`${profile?.streak_count ?? 0}`}
            hint="correct attempts in a row"
          />
          <Stat
            label="Points"
            value={`${profile?.total_points ?? 0}`}
            hint="harder problems = more"
          />
          <Stat
            label="Level"
            value={`${profile?.researcher_level ?? 1}`}
            hint="researcher track"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-fg-muted">
          Problems
        </h2>
        <ul className="card divide-y divide-border">
          {(questions ?? []).map((q: QuestionRow) => {
            const s = status.get(q.id);
            return (
              <li key={q.id}>
                <Link
                  href={`/researcher/q/${q.slug}`}
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-bg-raised"
                >
                  <StatusDot status={s} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-fg truncate">
                      {q.title}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-fg-muted">
                      <span className="pill">
                        {DIFFICULTY_LABEL[q.difficulty] ?? `D${q.difficulty}`}
                      </span>
                      {q.tags.slice(0, 4).map((t) => (
                        <span key={t} className="text-fg-subtle">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-fg-subtle">→</span>
                </Link>
              </li>
            );
          })}
          {(!questions || questions.length === 0) && (
            <li className="px-5 py-6 text-sm text-fg-muted">
              No questions yet. Run{" "}
              <code className="rounded bg-bg-raised px-1.5 py-0.5 text-xs">
                npm run seed
              </code>{" "}
              to populate the bank.
            </li>
          )}
        </ul>
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-fg-muted">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold text-fg">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-fg-subtle">{hint}</div>}
    </div>
  );
}

function StatusDot({ status }: { status: "correct" | "attempted" | undefined }) {
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
