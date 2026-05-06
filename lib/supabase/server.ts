import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _admin: SupabaseClient | null = null;

/**
 * Returns true if Supabase env looks like a real project, false if it's
 * still the placeholder values from .env.local.example. Lets non-critical
 * code paths (e.g. the streak chip in the site header) bail out fast
 * instead of hanging on DNS for the placeholder host.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;
  if (url.includes("YOUR_PROJECT")) return false;
  if (key.includes("YOUR_") || key === "YOUR_SERVICE_ROLE_KEY") return false;
  return true;
}

/**
 * Server-side Supabase client using the service-role key.
 * NEVER import this from a Client Component or expose it to the browser.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (_admin) return _admin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment"
    );
  }

  _admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _admin;
}

/**
 * Ensures the anon_users row exists for this cookie id.
 * Idempotent; returns the id.
 */
export async function ensureAnonUser(id: string): Promise<string> {
  const sb = getSupabaseAdmin();
  const { error } = await sb
    .from("anon_users")
    .upsert({ id }, { onConflict: "id", ignoreDuplicates: true });
  if (error) {
    throw new Error(`ensureAnonUser failed: ${error.message}`);
  }
  return id;
}
