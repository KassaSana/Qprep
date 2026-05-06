import Link from "next/link";
import { cn } from "@/lib/utils";

interface Track {
  slug: string;
  name: string;
  tagline: string;
  focus: string;
  bullets: string[];
  href: string | null;
}

const TRACKS: Track[] = [
  {
    slug: "researcher",
    name: "Quant Researcher",
    tagline: "Depth & rigor.",
    focus: "Probability, stochastic calculus, linear algebra, p-values.",
    bullets: [
      "Bayes, conditioning, and total expectation",
      "Order statistics, random walks, martingales",
      "LaTeX-native, KaTeX-rendered prompts",
    ],
    href: "/researcher",
  },
  {
    slug: "trader",
    name: "Quant Trader",
    tagline: "Speed & intuition.",
    focus: "Mental math, EV estimation, brainteasers, market-making games.",
    bullets: [
      "Sub-10ms Rapid Fire timer",
      "Spread / EV games",
      "Coming after researcher MVP",
    ],
    href: null,
  },
  {
    slug: "dev",
    name: "Quant Dev (SWE)",
    tagline: "Performance & logic.",
    focus: "Big-O, low-latency data structures, C++ memory, systems.",
    bullets: [
      "Tight algorithm prompts",
      "Latency-aware design questions",
      "Coming after researcher MVP",
    ],
    href: null,
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <div className="pill mb-4">QPrep · Quant Interview Practice</div>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Practice quant problems with an
          <span className="text-accent"> agentic tutor</span>.
        </h1>
        <p className="mt-4 max-w-2xl text-fg-muted">
          Submit an answer. If it's wrong, ask for a nudge — three escalating
          hints powered by Claude 4.7 Opus that point at your specific reasoning
          gap without revealing the number.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TRACKS.map((t) => {
          const disabled = !t.href;
          const Wrapper: React.ElementType = disabled ? "div" : Link;
          const wrapperProps = disabled ? {} : { href: t.href };
          return (
            <Wrapper
              key={t.slug}
              {...wrapperProps}
              className={cn(
                "card p-6 group transition",
                disabled
                  ? "opacity-50"
                  : "hover:border-accent/40 hover:bg-bg-raised cursor-pointer"
              )}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t.name}</h2>
                {disabled && <span className="pill">soon</span>}
              </div>
              <p className="mt-1 text-sm text-accent">{t.tagline}</p>
              <p className="mt-3 text-sm text-fg-muted">{t.focus}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-fg-muted">
                {t.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-fg-subtle">·</span> {b}
                  </li>
                ))}
              </ul>
              {!disabled && (
                <div className="mt-5 text-sm font-medium text-accent group-hover:translate-x-0.5 transition-transform">
                  Start practising →
                </div>
              )}
            </Wrapper>
          );
        })}
      </section>
    </main>
  );
}
