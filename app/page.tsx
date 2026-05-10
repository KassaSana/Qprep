import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAnonId } from "@/lib/anon";
import {
  loadHomeData,
  topicMasteryBars,
  MAX_DISPLAY_LEVEL,
  type HomeNextUp,
  type HomePlaylist,
  type HomeProfile,
  type HomeResurface,
  type MasteryBar,
} from "@/lib/home-data";
import { difficultyLabel } from "@/content/question-types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const anonId = await getAnonId();
  const data = await loadHomeData(anonId);
  const masteryBars = topicMasteryBars(data.profile?.topicLevels, 6);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      {data.hasAttempts ? (
        <ReturningHero profile={data.profile} nextUp={data.nextUp} />
      ) : (
        <FirstTimeHero />
      )}

      {data.resurface.length > 0 && (
        <ResurfaceSection items={data.resurface} />
      )}

      {masteryBars.length > 0 && <MasterySection bars={masteryBars} />}

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
          href="/today"
          className="ml-auto text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          Today&apos;s pair →
        </Link>
        <Link
          href="/mental-math"
          className="text-sm text-fg-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Warm up with mental math →
        </Link>
      </div>

      {nextUp ? (
        <Link
          href={`/questions/${nextUp.questionSlug}?from=playlist:${nextUp.playlistSlug}`}
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
        <Link href="/diagnostic">
          <Button>Take the 60-second diagnostic</Button>
        </Link>
        <Link href="/today">
          <Button variant="secondary">Today&apos;s pair</Button>
        </Link>
        <Link href="/playlists">
          <Button variant="secondary">Curated playlists</Button>
        </Link>
        <Link href="/questions">
          <Button variant="secondary">Browse all questions</Button>
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

function ResurfaceSection({ items }: { items: HomeResurface[] }) {
  return (
    <section className="mb-12">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-wider text-fg-muted">
          Resurface
        </h2>
        <span className="text-xs text-fg-subtle">
          You missed these — give them another shot
        </span>
      </div>
      <ul className="card divide-y divide-border">
        {items.map((it) => (
          <li key={it.questionSlug}>
            <Link
              href={`/questions/${it.questionSlug}?from=resurface`}
              className="flex items-center gap-4 px-5 py-3 transition hover:bg-bg-raised"
            >
              <span
                aria-hidden
                className="h-2.5 w-2.5 shrink-0 rounded-full bg-warning"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-fg">{it.title}</div>
                <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-fg-muted">
                  <span className="pill">{it.topic}</span>
                  <span className="pill">{difficultyLabel(it.difficulty)}</span>
                  <span>
                    {it.daysSinceLastWrong}d ago · {it.wrongAttemptCount}{" "}
                    wrong {it.wrongAttemptCount === 1 ? "try" : "tries"}
                  </span>
                </div>
              </div>
              <span className="text-fg-subtle">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MasterySection({ bars }: { bars: MasteryBar[] }) {
  return (
    <section className="mb-12">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-wider text-fg-muted">
          Topic mastery
        </h2>
        <span className="text-xs text-fg-subtle">
          Level cap shown at {MAX_DISPLAY_LEVEL}; you keep climbing past it
        </span>
      </div>
      <div className="card grid gap-3 p-5 sm:grid-cols-2">
        {bars.map((b) => (
          <Link
            key={b.topic}
            href={`/questions?topic=${encodeURIComponent(b.topic)}`}
            className="group block"
            aria-label={`${b.topic}: level ${b.level}`}
          >
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-fg group-hover:text-accent">
                {b.topic}
              </span>
              <span className="text-xs text-fg-muted">L{b.level}</span>
            </div>
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-bg-subtle"
              role="progressbar"
              aria-valuenow={b.level}
              aria-valuemin={0}
              aria-valuemax={MAX_DISPLAY_LEVEL}
            >
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${Math.round(b.fraction * 100)}%` }}
              />
            </div>
          </Link>
        ))}
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
