/**
 * Server-side question loaders shared by /questions, /playlists/[slug],
 * and /questions/[slug].
 *
 * Both the Supabase and local-dev paths produce the same `LoadedQuestion`
 * shape so callers don't have to branch on storage. The small "DB"
 * abstraction layer is intentionally limited to what the UI actually
 * needs — there's no caching layer here, and no ORM.
 */

import type { Topic } from "@/content/question-types";
import { PLAYLISTS } from "@/content/playlists";
import {
  getAllLocalQuestions,
  getLocalAttemptsForUser,
  getLocalPlaylistBySlug,
  getLocalPlaylistQuestions,
  getLocalPlaylists,
  getLocalQuestionBySlug,
} from "@/lib/local-dev";
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

export interface LoadedQuestion {
  id: string;
  slug: string;
  topic: Topic;
  title: string;
  prompt_md: string;
  solution_md: string | null;
  answer_kind: string;
  answer_value: string | null;
  answer_tolerance: number | null;
  answer_meta: unknown;
  target_roles: string[];
  difficulty: number;
  tags: string[];
  companies: string[];
  source: string | null;
  is_premium: boolean;
}

export interface LoadedPlaylist {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  hero_emoji: string | null;
  is_premium: boolean;
}

export interface AttemptStat {
  question_id: string;
  is_correct: boolean;
}

export type QuestionStatus = "correct" | "attempted" | undefined;

export function statusMapFromAttempts(
  attempts: AttemptStat[]
): Map<string, QuestionStatus> {
  const status = new Map<string, QuestionStatus>();
  for (const a of attempts) {
    if (a.is_correct) {
      status.set(a.question_id, "correct");
    } else if (!status.has(a.question_id)) {
      status.set(a.question_id, "attempted");
    }
  }
  return status;
}

export interface LoadAllQuestionsResult {
  questions: LoadedQuestion[];
  attempts: AttemptStat[];
  /** Distinct, sorted company names across the bank. */
  companies: string[];
}

export async function loadAllQuestions(
  anonId: string | null
): Promise<LoadAllQuestionsResult> {
  if (!isSupabaseConfigured()) {
    const questions = getAllLocalQuestions().map(toLoadedQuestion);
    const attempts = getLocalAttemptsForUser(anonId).map((a) => ({
      question_id: a.question_id,
      is_correct: a.is_correct,
    }));
    return { questions, attempts, companies: distinctCompanies(questions) };
  }

  const sb = getSupabaseAdmin();
  const [{ data: rows }, { data: attemptRows }] = await Promise.all([
    sb
      .from("questions")
      .select(
        "id, slug, topic, title, prompt_md, solution_md, answer_kind, answer_value, answer_tolerance, answer_meta, target_roles, difficulty, tags, companies, source, is_premium"
      )
      .order("topic", { ascending: true })
      .order("difficulty", { ascending: true })
      .order("title", { ascending: true }),
    anonId
      ? sb
          .from("attempts")
          .select("question_id, is_correct")
          .eq("anon_user_id", anonId)
      : Promise.resolve({ data: [] as AttemptStat[] }),
  ]);

  const questions = (rows ?? []).map((r) =>
    toLoadedQuestion(r as Partial<LoadedQuestion>)
  );
  const attempts = (attemptRows ?? []) as AttemptStat[];
  return { questions, attempts, companies: distinctCompanies(questions) };
}

export async function loadQuestionBySlug(
  slug: string
): Promise<LoadedQuestion | null> {
  if (!isSupabaseConfigured()) {
    const local = getLocalQuestionBySlug(slug);
    return local ? toLoadedQuestion(local) : null;
  }
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from("questions")
    .select(
      "id, slug, topic, title, prompt_md, solution_md, answer_kind, answer_value, answer_tolerance, answer_meta, target_roles, difficulty, tags, companies, source, is_premium"
    )
    .eq("slug", slug)
    .single();
  if (error || !data) return null;
  return toLoadedQuestion(data as Partial<LoadedQuestion>);
}

export async function loadPlaylists(): Promise<LoadedPlaylist[]> {
  if (!isSupabaseConfigured()) {
    return getLocalPlaylists().map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      hero_emoji: p.hero_emoji,
      is_premium: !!p.is_premium,
    }));
  }
  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("playlists")
    .select("id, slug, name, description, hero_emoji, is_premium")
    .order("created_at", { ascending: true });

  // Fall back to the static list when the DB is empty (e.g. migration was
  // applied but the seed hasn't run yet).
  if (!data || data.length === 0) {
    return PLAYLISTS.map((p, idx) => ({
      id: `00000000-0000-4000-9000-${String(idx + 1).padStart(12, "0")}`,
      slug: p.slug,
      name: p.name,
      description: p.description,
      hero_emoji: p.hero_emoji,
      is_premium: !!p.is_premium,
    }));
  }
  return data as LoadedPlaylist[];
}

export interface LoadPlaylistResult {
  playlist: LoadedPlaylist | null;
  questions: LoadedQuestion[];
  attempts: AttemptStat[];
}

export async function loadPlaylistBySlug(
  slug: string,
  anonId: string | null
): Promise<LoadPlaylistResult> {
  if (!isSupabaseConfigured()) {
    const pl = getLocalPlaylistBySlug(slug);
    if (!pl) return { playlist: null, questions: [], attempts: [] };
    const playlist: LoadedPlaylist = {
      id: pl.id,
      slug: pl.slug,
      name: pl.name,
      description: pl.description,
      hero_emoji: pl.hero_emoji,
      is_premium: !!pl.is_premium,
    };
    const questions = getLocalPlaylistQuestions(slug).map(toLoadedQuestion);
    const attempts = getLocalAttemptsForUser(anonId).map((a) => ({
      question_id: a.question_id,
      is_correct: a.is_correct,
    }));
    return { playlist, questions, attempts };
  }

  const sb = getSupabaseAdmin();
  const { data: pl } = await sb
    .from("playlists")
    .select("id, slug, name, description, hero_emoji, is_premium")
    .eq("slug", slug)
    .maybeSingle();

  // Static fallback, parallels loadPlaylists().
  let playlist: LoadedPlaylist | null = (pl as LoadedPlaylist | null) ?? null;
  let questionSlugs: string[] | null = null;
  if (!playlist) {
    const def = PLAYLISTS.find((p) => p.slug === slug);
    if (def) {
      playlist = {
        id: `00000000-0000-4000-9000-static-${slug}`,
        slug: def.slug,
        name: def.name,
        description: def.description,
        hero_emoji: def.hero_emoji,
        is_premium: !!def.is_premium,
      };
      questionSlugs = def.question_slugs;
    } else {
      return { playlist: null, questions: [], attempts: [] };
    }
  }

  let questions: LoadedQuestion[] = [];
  if (playlist && questionSlugs == null) {
    const { data } = await sb
      .from("playlist_questions")
      .select(
        "position, question:questions(id, slug, topic, title, prompt_md, solution_md, answer_kind, answer_value, answer_tolerance, answer_meta, target_roles, difficulty, tags, companies, source, is_premium)"
      )
      .eq("playlist_id", playlist.id)
      .order("position", { ascending: true });

    questions = (data ?? [])
      .map((row) => {
        const q = Array.isArray(
          (row as { question?: unknown }).question
        )
          ? ((row as { question: unknown[] }).question[0] as Partial<LoadedQuestion>)
          : ((row as { question?: Partial<LoadedQuestion> }).question ?? null);
        return q ? toLoadedQuestion(q) : null;
      })
      .filter((q): q is LoadedQuestion => !!q);
  } else if (questionSlugs) {
    const { data } = await sb
      .from("questions")
      .select(
        "id, slug, topic, title, prompt_md, solution_md, answer_kind, answer_value, answer_tolerance, answer_meta, target_roles, difficulty, tags, companies, source, is_premium"
      )
      .in("slug", questionSlugs);
    const bySlug = new Map((data ?? []).map((r) => [r.slug as string, r]));
    questions = questionSlugs
      .map((s) => bySlug.get(s))
      .filter((r): r is NonNullable<typeof r> => !!r)
      .map((r) => toLoadedQuestion(r as Partial<LoadedQuestion>));
  }

  const { data: attemptRows } = anonId
    ? await sb
        .from("attempts")
        .select("question_id, is_correct")
        .eq("anon_user_id", anonId)
    : { data: [] as AttemptStat[] };

  return {
    playlist,
    questions,
    attempts: (attemptRows ?? []) as AttemptStat[],
  };
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function toLoadedQuestion(input: Partial<LoadedQuestion>): LoadedQuestion {
  return {
    id: String(input.id ?? ""),
    slug: String(input.slug ?? ""),
    topic: (input.topic ?? "Probability") as Topic,
    title: String(input.title ?? ""),
    prompt_md: String(input.prompt_md ?? ""),
    solution_md: (input.solution_md as string | null | undefined) ?? null,
    answer_kind: String(input.answer_kind ?? "numeric"),
    answer_value: (input.answer_value as string | null | undefined) ?? null,
    answer_tolerance: (input.answer_tolerance as number | null | undefined) ?? null,
    answer_meta: input.answer_meta ?? null,
    target_roles: Array.isArray(input.target_roles) ? (input.target_roles as string[]) : ["All"],
    difficulty: typeof input.difficulty === "number" ? input.difficulty : 1,
    tags: Array.isArray(input.tags) ? (input.tags as string[]) : [],
    companies: Array.isArray(input.companies) ? (input.companies as string[]) : [],
    source: (input.source as string | null | undefined) ?? null,
    is_premium: !!input.is_premium,
  };
}

function distinctCompanies(rows: LoadedQuestion[]): string[] {
  const set = new Set<string>();
  for (const q of rows) for (const c of q.companies) set.add(c);
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export interface QuestionFilterParams {
  topic?: string[];
  difficulty?: string[];
  kind?: string[];
  company?: string[];
  role?: string[];
  status?: string;
  playlist?: string;
}

export function applyQuestionFilters(
  questions: LoadedQuestion[],
  filters: QuestionFilterParams,
  status: Map<string, QuestionStatus>
): LoadedQuestion[] {
  return questions.filter((q) => {
    if (filters.topic && filters.topic.length > 0 && !filters.topic.includes(q.topic)) {
      return false;
    }
    if (
      filters.difficulty &&
      filters.difficulty.length > 0 &&
      !filters.difficulty.includes(String(q.difficulty))
    ) {
      return false;
    }
    if (filters.kind && filters.kind.length > 0 && !filters.kind.includes(q.answer_kind)) {
      return false;
    }
    if (filters.company && filters.company.length > 0) {
      if (!q.companies.some((c) => filters.company!.includes(c))) {
        return false;
      }
    }
    if (filters.role && filters.role.length > 0) {
      const set = new Set(q.target_roles ?? []);
      if (!set.has("All") && !filters.role.some((r) => set.has(r))) {
        return false;
      }
    }
    if (filters.status) {
      const s = status.get(q.id);
      if (filters.status === "unattempted" && s !== undefined) return false;
      if (filters.status === "attempted" && s !== "attempted") return false;
      if (filters.status === "correct" && s !== "correct") return false;
    }
    return true;
  });
}

export function readSearchParam(
  raw: string | string[] | undefined
): string[] {
  if (raw == null) return [];
  if (Array.isArray(raw)) return raw;
  return [raw];
}

export function readSingleSearchParam(
  raw: string | string[] | undefined
): string | undefined {
  if (raw == null) return undefined;
  if (Array.isArray(raw)) return raw[0];
  return raw;
}
