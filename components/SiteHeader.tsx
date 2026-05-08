import Link from "next/link";
import { getAnonId } from "@/lib/anon";
import { loadProfile } from "@/lib/home-data";
import { ThemeToggle } from "@/components/ThemeToggle";

export async function SiteHeader() {
  const anonId = await getAnonId();
  const profile = await loadProfile(anonId);

  return (
    <header className="border-b border-border bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-fg hover:text-accent"
        >
          <span
            aria-hidden
            className="grid h-6 w-6 place-items-center rounded-md border border-border bg-bg-raised text-[11px] font-semibold"
          >
            Q
          </span>
          QPrep
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          <HeaderLink href="/questions" label="Questions" />
          <HeaderLink href="/playlists" label="Playlists" />
          <HeaderLink href="/mental-math" label="Mental math" />
        </nav>

        <div className="flex items-center gap-2 text-xs">
          <ThemeToggle />
          {profile && profile.points > 0 && (
            <span className="pill">
              <span className="mr-1 text-fg-subtle">pts</span>
              <span className="font-medium text-fg">{profile.points}</span>
            </span>
          )}
          {profile && profile.streak > 0 && (
            <span className="pill">
              <span className="mr-1 text-fg-subtle">streak</span>
              <span className="font-medium text-fg">{profile.streak}</span>
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

function HeaderLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-1.5 text-sm text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg"
    >
      {label}
    </Link>
  );
}
