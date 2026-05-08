import Link from "next/link";
import { notFound } from "next/navigation";
import { getAnonId } from "@/lib/anon";
import {
  loadPlaylistBySlug,
  statusMapFromAttempts,
} from "@/lib/questions-data";
import { QuestionTable } from "@/components/QuestionTable";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PlaylistDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const anonId = await getAnonId();
  const supabaseReady = isSupabaseConfigured();

  const { playlist, questions, attempts } = await loadPlaylistBySlug(slug, anonId);
  if (!playlist) {
    notFound();
  }

  const status = statusMapFromAttempts(attempts);
  const total = questions.length;
  const solved = questions.filter((q) => status.get(q.id) === "correct").length;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href="/playlists"
        className="inline-block text-sm text-fg-muted hover:text-fg"
      >
        ← All playlists
      </Link>

      <header className="mt-4 mb-6">
        <div className="flex items-center gap-3">
          {playlist.hero_emoji && (
            <span aria-hidden className="text-3xl">
              {playlist.hero_emoji}
            </span>
          )}
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {playlist.name}
          </h1>
        </div>
        {playlist.description && (
          <p className="mt-2 text-sm text-fg-muted">{playlist.description}</p>
        )}

        {!supabaseReady && (
          <p className="mt-3 inline-flex rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning">
            Local preview mode: progress is in-memory until Supabase is configured.
          </p>
        )}
      </header>

      <section className="card p-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-fg-muted">
              Progress
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {solved} / {total} solved
            </div>
          </div>
          <Link
            href={`/questions?playlist=${playlist.slug}`}
            className="text-sm text-fg-muted underline-offset-2 hover:text-fg hover:underline"
          >
            Open as filtered table →
          </Link>
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-bg-subtle">
          <div
            className="h-full bg-success transition-all"
            style={{ width: `${total > 0 ? (solved / total) * 100 : 0}%` }}
            aria-hidden
          />
        </div>
      </section>

      <QuestionTable
        showPosition
        linkSuffix={`?from=playlist:${playlist.slug}`}
        questions={questions.map((q) => ({
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
    </main>
  );
}
