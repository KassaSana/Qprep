import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _browser: SupabaseClient | null = null;

/**
 * Browser-side Supabase client using the public anon key.
 * Safe to use from Client Components.
 */
export function getSupabaseBrowser(): SupabaseClient {
  if (_browser) return _browser;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment"
    );
  }

  _browser = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _browser;
}
