import Link from "next/link";
import { getAnonId } from "@/lib/anon";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/ThemeToggle";

interface ProfileSummary {
  streak_count: number;
  total_points: number;
}

async function loadProfile(anonId: string): Promise<ProfileSummary | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from("anon_users")
      .select("streak_count, total_points")
      .eq("id", anonId)
      .maybeSingle();
    if (error || !data) return null;
    return data as ProfileSummary;
  } catch {
    return null;
  }
}

export async function SiteHeader() {
  const anonId = await getAnonId();
  const profile = anonId ? await loadProfile(anonId) : null;

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
        </nav>

        <div className="flex items-center gap-2 text-xs">
          <ThemeToggle />
          {profile && profile.total_points > 0 && (
            <span className="pill">
              <span className="mr-1 text-fg-subtle">pts</span>
              <span className="font-medium text-fg">
                {profile.total_points}
              </span>
            </span>
          )}
          {profile && profile.streak_count > 0 && (
            <span className="pill">
              <span className="mr-1 text-fg-subtle">streak</span>
              <span className="font-medium text-fg">
                {profile.streak_count}
              </span>
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
