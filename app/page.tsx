import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAnonId } from "@/lib/anon";
import {
  loadHomeData,
  type HomeNextUp,
  type HomePlaylist,
  type HomeProfile,
} from "@/lib/home-data";
import { difficultyLabel } from "@/content/question-types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const anonId = await getAnonId();
  const data = await loadHomeData(anonId);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      {data.hasAttempts ? (
        <ReturningHero profile={data.profile} nextUp={data.nextUp} />
      ) : (
        <FirstTimeHero />
      )}

      <PlaylistGrid
        playlists={data.playlists}
        showProgress={data.hasAttempts}
      />

      <TopicsStrip topics={data.topics} />
    </main>
  );
}

function ReturningHero({
  profile,
  nextUp,
}: {
  profile: HomeProfile | null;
  nextUp: HomeNextUp | null;
}) {
  const streak = profile?.streak ?? 0;
  const points = profile?.points ?? 0;

  return (
    <header className="mb-10">
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fg-muted">
        <span className="font-medium text-fg">Welcome back.</span>
        {streak > 0 && (
          <span className="inline-flex items-center gap-1">
            <span aria-hidden>🔥</span>
            <span className="font-medium text-fg">{streak}</span>
            <span>day streak</span>
          </span>
        )}
        {points > 0 && (
          <span className="inline-flex items-center gap-1">
            <span className="font-medium text-fg">{points}</span>
            <span>pts</span>
          </span>
        )}
        <Link
          href="/mental-math"
          className="ml-auto text-sm text-fg-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Warm up with mental math →
        </Link>
      </div>

      {nextUp ? (
        <Link
          href={`/questions/${nextUp.questionSlug}`}
          className="card group block p-6 transition hover:border-accent/40 hover:bg-bg-raised"
        >
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-fg-muted">
            Pick up where you left off
          </div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl">
                <span aria-hidden className="text-2xl">
                  {nextUp.heroEmoji}
                </span>
                {nextUp.title}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-fg-muted">
                <span className="pill">{nextUp.topic}</span>
                <span className="pill">
                  {difficultyLabel(nextUp.difficulty)}
                </span>
                <span>from {nextUp.playlistName}</span>
              </div>
            </div>
            <div className="text-sm font-medium text-accent transition-transform group-hover:translate-x-0.5">
              Resume →
            </div>
          </div>
        </Link>
      ) : (
        <div className="card p-6">
          <h2 className="text-lg font-semibold">
            You&apos;ve cleared every playlist. 🎉
          </h2>
          <p className="mt-1 text-sm text-fg-muted">
            Browse the full bank for a fresh challenge, or revisit a playlist to
            drill speed.
          </p>
          <div className="mt-4">
            <Link href="/questions">
              <Button>Browse all questions</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function FirstTimeHero() {
  return (
    <header className="mb-10">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Practice quant problems with an
        <span className="text-accent"> agentic tutor</span>.
      </h1>
      <p className="mt-4 max-w-2xl text-fg-muted">
        Probability, statistics, algorithms, low-level design, and concurrency
        drills. Submit an answer; if it&apos;s wrong, ask for a nudge — three
        escalating hints that point at your specific gap without revealing the
        number.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/questions">
          <Button>Browse all questions</Button>
        </Link>
        <Link href="/playlists">
          <Button variant="secondary">Curated playlists</Button>
        </Link>
        <Link href="/mental-math">
          <Button variant="secondary">Mental math drill</Button>
        </Link>
      </div>
    </header>
  );
}

function PlaylistGrid({
  playlists,
  showProgress,
}: {
  playlists: HomePlaylist[];
  showProgress: boolean;
}) {
  return (
    <section className="mb-12">
      <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-fg-muted">
        {showProgress ? "Your playlists" : "Featured playlists"}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {playlists.map((p) => {
          const pct = p.total > 0 ? Math.round((p.solved / p.total) * 100) : 0;
          return (
            <Link
              key={p.slug}
              href={`/playlists/${p.slug}`}
              className="card group flex flex-col p-6 transition hover:border-accent/40 hover:bg-bg-raised"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <span aria-hidden className="text-2xl">
                    {p.heroEmoji}
                  </span>
                  {p.name}
                </h3>
                <span className="pill shrink-0">
                  {showProgress ? `${p.solved} / ${p.total}` : `${p.total} qs`}
                </span>
              </div>

              <p className="mt-3 text-sm text-fg-muted">{p.description}</p>

              {showProgress && (
                <div
                  className="mt-4 h-1 rounded-full bg-bg-subtle"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${p.name}: ${p.solved} of ${p.total} solved`}
                >
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}

              <div className="mt-5 text-sm font-medium text-accent transition-transform group-hover:translate-x-0.5">
                Start →
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function TopicsStrip({ topics }: { topics: string[] }) {
  if (topics.length === 0) return null;
  return (
    <section>
      <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-fg-muted">
        Browse by topic
      </h2>
      <div className="flex flex-wrap gap-2">
        {topics.map((t) => (
          <Link
            key={t}
            href={`/questions?topic=${encodeURIComponent(t)}`}
            className="pill transition-colors hover:border-accent/40 hover:text-fg"
          >
            {t}
          </Link>
        ))}
      </div>
    </section>
  );
}
