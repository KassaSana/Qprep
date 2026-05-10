import type { Metadata } from "next";
import Link from "next/link";
import { PageView } from "@/components/PageView";
import { getAnonId } from "@/lib/anon";
import {
  loadPlaylists,
  loadAllQuestions,
  loadPlaylistBySlug,
  statusMapFromAttempts,
} from "@/lib/questions-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Playlists",
  description:
    "Curated QPrep sequences: warmup quickstart, researcher foundations, researcher advanced, quant dev essentials, low-latency core, and the cross-topic Top 50.",
  openGraph: {
    title: "Curated playlists · QPrep",
    description:
      "Hand-picked sequences. Work through one for a guided arc.",
  },
};

export default async function PlaylistsIndexPage() {
  const anonId = await getAnonId();

  const [playlists, { attempts }] = await Promise.all([
    loadPlaylists(),
    loadAllQuestions(anonId),
  ]);

  // Compute solved counts per playlist by joining each playlist's question
  // list with the user's attempts. We hit `loadPlaylistBySlug` for every
  // playlist; the lists are tiny so the overhead is negligible.
  const status = statusMapFromAttempts(attempts);
  const counts = await Promise.all(
    playlists.map(async (p) => {
      const { questions } = await loadPlaylistBySlug(p.slug, anonId);
      const total = questions.length;
      const solved = questions.filter((q) => status.get(q.id) === "correct").length;
      return { slug: p.slug, total, solved };
    })
  );
  const countsBySlug = new Map(counts.map((c) => [c.slug, c]));

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <PageView path="/playlists" />
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Curated playlists
        </h1>
        <p className="mt-1 text-sm text-fg-muted">
          Hand-picked sequences. Work through one for a guided arc, or jump to
          the question bank for free-form practice.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {playlists.map((p) => {
          const c = countsBySlug.get(p.slug) ?? { total: 0, solved: 0 };
          return (
            <li key={p.slug}>
              <Link
                href={`/playlists/${p.slug}`}
                className="card p-6 block transition hover:border-accent/40 hover:bg-bg-raised"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    {p.hero_emoji && (
                      <span aria-hidden className="text-2xl">
                        {p.hero_emoji}
                      </span>
                    )}
                    {p.name}
                  </h2>
                  <span className="pill">
                    {c.solved} / {c.total}
                  </span>
                </div>
                {p.description && (
                  <p className="mt-2 text-sm text-fg-muted">{p.description}</p>
                )}
                <ProgressBar solved={c.solved} total={c.total} />
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

function ProgressBar({ solved, total }: { solved: number; total: number }) {
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
  return (
    <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-bg-subtle">
      <div
        className="h-full bg-success transition-all"
        style={{ width: `${pct}%` }}
        aria-hidden
      />
    </div>
  );
}
