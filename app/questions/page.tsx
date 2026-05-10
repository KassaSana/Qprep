import type { Metadata } from "next";
import Link from "next/link";
import { PageView } from "@/components/PageView";
import { getAnonId } from "@/lib/anon";
import {
  applyQuestionFilters,
  loadAllQuestions,
  loadPlaylistBySlug,
  readSearchParam,
  readSingleSearchParam,
  statusMapFromAttempts,
} from "@/lib/questions-data";
import { QuestionTable } from "@/components/QuestionTable";
import { FilterSidebar } from "@/components/FilterSidebar";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Question bank",
  description:
    "Browse 633 quant interview questions across 11 topics — probability, statistics, pure math, brainteasers, algorithms, data structures, C++, concurrency, systems, LLD, and system design.",
  openGraph: {
    title: "Question bank · QPrep",
    description:
      "Filter 633 quant interview questions by topic, difficulty, kind, and company.",
  },
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function QuestionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const anonId = await getAnonId();
  const supabaseReady = isSupabaseConfigured();

  const filters = {
    topic: readSearchParam(params.topic),
    difficulty: readSearchParam(params.difficulty),
    kind: readSearchParam(params.kind),
    company: readSearchParam(params.company),
    role: readSearchParam(params.role),
    status: readSingleSearchParam(params.status),
    playlist: readSingleSearchParam(params.playlist),
  };

  // Load the bank, and optionally narrow to a playlist if `playlist=...`.
  const [{ questions: allQuestions, attempts, companies }, playlistResult] =
    await Promise.all([
      loadAllQuestions(anonId),
      filters.playlist
        ? loadPlaylistBySlug(filters.playlist, anonId)
        : Promise.resolve(null),
    ]);

  const status = statusMapFromAttempts(attempts);

  let scoped = allQuestions;
  if (playlistResult?.playlist) {
    const playlistIds = new Set(playlistResult.questions.map((q) => q.id));
    scoped = allQuestions.filter((q) => playlistIds.has(q.id));
  }

  const filtered = applyQuestionFilters(scoped, filters, status);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PageView path="/questions" />
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Question bank
          </h1>
          <p className="mt-1 text-sm text-fg-muted">
            {filters.playlist && playlistResult?.playlist ? (
              <>
                Filtering by playlist{" "}
                <Link
                  href={`/playlists/${playlistResult.playlist.slug}`}
                  className="underline underline-offset-2 hover:text-fg"
                >
                  {playlistResult.playlist.name}
                </Link>{" "}
                — {filtered.length} of {scoped.length} questions
              </>
            ) : (
              <>
                {filtered.length} of {scoped.length} questions
              </>
            )}
          </p>
        </div>
      </header>

      {!supabaseReady && (
        <p className="mb-6 inline-flex rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning">
          Local preview mode: using the built-in seed bank and in-memory progress
          because Supabase is not configured yet.
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[16rem,minmax(0,1fr)]">
        <FilterSidebar companies={companies} />

        <section>
          <QuestionTable
            questions={filtered.map((q) => ({
              id: q.id,
              slug: q.slug,
              title: q.title,
              topic: q.topic,
              answer_kind: q.answer_kind,
              difficulty: q.difficulty,
              tags: q.tags,
              companies: q.companies,
              status: status.get(q.id),
            }))}
          />
        </section>
      </div>
    </main>
  );
}
