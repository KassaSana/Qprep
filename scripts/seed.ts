/**
 * Seed Supabase with the unified question bank and curated playlists.
 *
 * Usage:
 *   npm run seed
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
 * Idempotent: questions upsert on `slug`, playlists upsert on `slug`,
 * playlist_questions are wiped and reinserted per playlist.
 *
 * Writes the unified-bank columns (topic, target_roles, companies,
 * answer_meta, is_premium) plus the legacy `track` column when present so
 * installations that haven't yet applied `0002_unified_bank.sql` keep
 * working. `target_roles` is inferred from `topic` when a seed file
 * doesn't set it explicitly.
 */

import { config as loadEnv } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { ALL_SEED_QUESTIONS } from "../content/seed";
import { PLAYLISTS } from "../content/playlists";
import {
  inferTargetRolesFromTopic,
  type SeedQuestion,
} from "../content/question-types";

loadEnv({ path: ".env.local" });

interface QuestionRow {
  slug: string;
  topic: string;
  track: string | null;
  title: string;
  prompt_md: string;
  solution_md: string;
  answer_kind: string;
  answer_value: string | null;
  answer_tolerance: number | null;
  answer_meta: unknown;
  target_roles: string[];
  difficulty: number;
  tags: string[];
  companies: string[];
  is_premium: boolean;
  source: string;
}

function toQuestionRow(q: SeedQuestion): QuestionRow {
  const answer_value = (q as { answer_value?: string | null }).answer_value ?? null;
  const answer_tolerance =
    (q as { answer_tolerance?: number | null }).answer_tolerance ?? null;
  const answer_meta = (q as { answer_meta?: unknown }).answer_meta ?? null;
  const target_roles = q.target_roles ?? inferTargetRolesFromTopic(q.topic);
  return {
    slug: q.slug,
    topic: q.topic,
    track: q.track ?? null,
    title: q.title,
    prompt_md: q.prompt_md,
    solution_md: q.solution_md,
    answer_kind: q.answer_kind,
    answer_value,
    answer_tolerance,
    answer_meta,
    target_roles,
    difficulty: q.difficulty,
    tags: q.tags,
    companies: q.companies ?? [],
    is_premium: q.is_premium ?? false,
    source: q.source,
  };
}

function isMissingColumnError(err: unknown, column: string): boolean {
  const msg = String((err as { message?: unknown } | null)?.message ?? err ?? "");
  return (
    msg.includes(`Could not find the '${column}' column`) ||
    msg.includes(`column "${column}" of relation`) ||
    msg.includes(`unknown column "${column}"`)
  );
}

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

  const rows = ALL_SEED_QUESTIONS.map(toQuestionRow);
  console.log(
    `Seeding ${rows.length} questions across ${new Set(rows.map((r) => r.topic)).size} topics...`
  );

  // Some environments may still be on migrations prior to `target_roles`.
  // We try the full v2 shape first, then fall back to omitting that column.
  const qTable = sb.from("questions");

  let questions: { id: string; slug: string; title: string; topic: string; answer_kind: string }[] | null =
    null;

  const first = await qTable
    .upsert(rows, { onConflict: "slug" })
    .select("id, slug, title, topic, answer_kind");

  if (first.error) {
    if (isMissingColumnError(first.error, "target_roles")) {
      console.warn(
        "Supabase schema missing questions.target_roles — retrying seed without target_roles. " +
          "Apply migration 0003_roles_and_remove_finance.sql to enable role-based filtering."
      );
      const rowsWithoutRoles = rows.map(({ target_roles: _omit, ...rest }) => rest);
      const second = await qTable
        .upsert(rowsWithoutRoles, { onConflict: "slug" })
        .select("id, slug, title, topic, answer_kind");
      if (second.error) {
        console.error("Question upsert failed:", second.error.message);
        process.exit(1);
      }
      questions = second.data as typeof questions;
    } else {
      console.error("Question upsert failed:", first.error.message);
      process.exit(1);
    }
  } else {
    questions = first.data as typeof questions;
  }

  for (const row of questions ?? []) {
    console.log(
      `  [${String(row.topic).padEnd(15)}] ${String(row.answer_kind).padEnd(8)} ${String(row.slug).padEnd(38)}  ${row.title}`
    );
  }

  // Build slug -> id map for playlist linkage.
  const slugToId = new Map<string, string>();
  for (const q of questions ?? []) {
    slugToId.set(q.slug as string, q.id as string);
  }

  console.log(`\nUpserting ${PLAYLISTS.length} playlists...`);
  const playlistRows = PLAYLISTS.map((p) => ({
    slug: p.slug,
    name: p.name,
    description: p.description,
    hero_emoji: p.hero_emoji,
    is_premium: !!p.is_premium,
  }));
  const { data: playlists, error: plErr } = await sb
    .from("playlists")
    .upsert(playlistRows, { onConflict: "slug" })
    .select("id, slug, name");
  if (plErr) {
    console.error("Playlist upsert failed:", plErr.message);
    process.exit(1);
  }

  const playlistSlugToId = new Map<string, string>();
  for (const p of playlists ?? []) {
    playlistSlugToId.set(p.slug as string, p.id as string);
  }

  for (const def of PLAYLISTS) {
    const playlistId = playlistSlugToId.get(def.slug);
    if (!playlistId) continue;
    // Wipe and reinsert so reordering / removal is reflected.
    await sb.from("playlist_questions").delete().eq("playlist_id", playlistId);
    const links = def.question_slugs
      .map((slug, idx) => ({
        playlist_id: playlistId,
        question_id: slugToId.get(slug),
        position: idx,
      }))
      .filter((r) => !!r.question_id);
    if (links.length === 0) {
      console.warn(`  ! ${def.slug}: no resolvable question slugs`);
      continue;
    }
    const { error: linkErr } = await sb
      .from("playlist_questions")
      .insert(links);
    if (linkErr) {
      console.error(`  ! playlist_questions insert for ${def.slug} failed:`, linkErr.message);
      continue;
    }
    console.log(`  [${def.slug.padEnd(28)}]  ${def.name}  (${links.length} questions)`);
  }

  console.log(`\nDone. Inserted/updated ${questions?.length ?? 0} questions and ${playlists?.length ?? 0} playlists.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
