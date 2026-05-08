import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PLAYLISTS } from "@/content/playlists";

/**
 * Landing page.
 *
 * The flow is QuantGuide-style: a featured playlist strip plus a
 * "Browse all questions" CTA that drops the user into the unified bank.
 * The legacy per-track routes (`/researcher`, `/trader`) have been
 * retired entirely — there is one bank, filtered by topic and role.
 */
export default function Home() {
  const featured = PLAYLISTS.slice(0, 4);

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <div className="pill mb-4">QPrep · Quant Interview Practice</div>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Practice quant problems with an
          <span className="text-accent"> agentic tutor</span>.
        </h1>
        <p className="mt-4 max-w-2xl text-fg-muted">
          Probability, statistics, algorithms, low-level design, and
          concurrency drills. Submit an answer; if it&apos;s wrong, ask for a
          nudge — three escalating hints that point at your specific gap
          without revealing the number.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/questions">
            <Button>Browse all questions</Button>
          </Link>
          <Link href="/playlists">
            <Button variant="secondary">Curated playlists</Button>
          </Link>
        </div>
      </header>

      <section>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-fg-muted">
          Featured playlists
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {featured.map((p) => (
            <Link
              key={p.slug}
              href={`/playlists/${p.slug}`}
              className="card p-6 group transition hover:border-accent/40 hover:bg-bg-raised"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span aria-hidden className="text-2xl">
                    {p.hero_emoji}
                  </span>
                  {p.name}
                </h3>
                <span className="pill">{p.question_slugs.length} qs</span>
              </div>
              <p className="mt-3 text-sm text-fg-muted">{p.description}</p>
              <div className="mt-5 text-sm font-medium text-accent group-hover:translate-x-0.5 transition-transform">
                Start →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
