/**
 * Seed Supabase with the Quant Researcher question bank.
 *
 * Usage:
 *   npm run seed
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
 * Idempotent: upserts on the unique `slug` column.
 */

import { config as loadEnv } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { RESEARCHER_SEED } from "../content/researcher-seed";

loadEnv({ path: ".env.local" });

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
    process.exit(1);
  }

  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log(`Seeding ${RESEARCHER_SEED.length} researcher problems...`);

  const { data, error } = await sb
    .from("questions")
    .upsert(RESEARCHER_SEED, { onConflict: "slug" })
    .select("id, slug, title");

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  for (const row of data ?? []) {
    console.log(`  ${row.slug.padEnd(38)}  ${row.title}`);
  }
  console.log(`Done. Inserted/updated ${data?.length ?? 0} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
