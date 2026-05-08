/**
 * Shared types for the QPrep question bank.
 *
 * After the 0002_unified_bank migration, every question carries a `topic`
 * (the canonical filter) and one of six `answer_kind`s. The discriminated
 * union below is the single source of truth on disk, in the seed bundles,
 * and in `lib/local-dev.ts` — it intentionally mirrors the row shape stored
 * in the `questions` Postgres table so the same record can be upserted by
 * the seed script without any per-kind transformation.
 */

export type Topic =
  | "Probability"
  | "Brainteasers"
  | "Statistics"
  | "Pure Math"
  | "Concurrency"
  | "Systems"
  | "LLD"
  | "System Design"
  | "Algorithms"
  | "Data Structures"
  | "C++ Deep Dives";

export const TOPICS: readonly Topic[] = [
  "Probability",
  "Brainteasers",
  "Statistics",
  "Pure Math",
  "Concurrency",
  "Systems",
  "LLD",
  "System Design",
  "Algorithms",
  "Data Structures",
  "C++ Deep Dives",
] as const;

/**
 * Legacy track. Kept on a SeedQuestion only so the seed script can backfill
 * the not-yet-dropped `track` column on `questions` — the app no longer
 * reads it for routing or filtering.
 */
export type Track = "researcher" | "trader" | "dev";

export type TargetRole = "Trader" | "Dev" | "Researcher" | "All";

export const TARGET_ROLES: readonly TargetRole[] = [
  "Trader",
  "Dev",
  "Researcher",
  "All",
] as const;

export type AnswerKind =
  | "numeric"
  | "fraction"
  | "exact"
  | "mcq"
  | "freeform"
  | "code";

// ---------------------------------------------------------------------------
// answer_meta payload shapes (one per non-numeric answer_kind)
// ---------------------------------------------------------------------------

export interface McqOption {
  id: string;
  label: string;
  /** Exactly one option in an `options` array should have `correct: true`. */
  correct: boolean;
}

export interface McqMeta {
  options: McqOption[];
}

export interface FreeformMeta {
  /**
   * Bullet-point rubric. The grader checks that an answer addresses each
   * point; the deterministic keyword fallback also uses these as keyword
   * triggers when no LLM is configured.
   */
  rubric: string[];
  /** Floor on answer length. Optional; defaults to 0 (no minimum). */
  min_words?: number;
  /** Worked solution shown after submit. */
  reference_solution_md?: string;
}

export interface CodeTestCase {
  /** Stdin sent to the user's program, or the function-call argument string. */
  input: string;
  /** Expected stdout (compared after trim/whitespace-collapse). */
  expected: string;
  /** When true, the test is hidden from the UI until after submit. */
  hidden?: boolean;
}

export interface CodeMeta {
  /** Piston language identifier (e.g. "python", "javascript", "cpp"). */
  language: string;
  /** Initial editor contents. */
  starter_code: string;
  test_cases: CodeTestCase[];
  time_limit_ms?: number;
  memory_limit_mb?: number;
}

// ---------------------------------------------------------------------------
// SeedQuestion discriminated union
// ---------------------------------------------------------------------------

interface BaseSeedQuestion {
  slug: string;
  topic: Topic;
  title: string;
  prompt_md: string;
  solution_md: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  source: string;
  /**
   * Role(s) this question is relevant for.
   *
   * Stored in Postgres as `questions.target_roles text[]`.
   * When omitted in legacy seed content, the seed script infers a default
   * from the question's topic.
   */
  target_roles?: TargetRole[];
  /** Companies that have asked something like this. Free-text strings. */
  companies?: string[];
  is_premium?: boolean;
  /**
   * Legacy track. Optional; the seed script writes it through to the
   * `track` column when present so v1 environments keep working.
   */
  track?: Track;
}

export interface NumericSeedQuestion extends BaseSeedQuestion {
  answer_kind: "numeric" | "fraction" | "exact";
  answer_value: string;
  answer_tolerance: number | null;
  /** Numeric/fraction/exact questions don't need an `answer_meta` payload. */
  answer_meta?: null;
}

export interface McqSeedQuestion extends BaseSeedQuestion {
  answer_kind: "mcq";
  /** The id of the correct option. Must match one entry in `answer_meta.options`. */
  answer_value: string;
  answer_tolerance?: null;
  answer_meta: McqMeta;
}

export interface FreeformSeedQuestion extends BaseSeedQuestion {
  answer_kind: "freeform";
  answer_value?: null;
  answer_tolerance?: null;
  answer_meta: FreeformMeta;
}

export interface CodeSeedQuestion extends BaseSeedQuestion {
  answer_kind: "code";
  answer_value?: null;
  answer_tolerance?: null;
  answer_meta: CodeMeta;
}

export type SeedQuestion =
  | NumericSeedQuestion
  | McqSeedQuestion
  | FreeformSeedQuestion
  | CodeSeedQuestion;

// ---------------------------------------------------------------------------
// Playlists
// ---------------------------------------------------------------------------

export interface PlaylistDef {
  slug: string;
  name: string;
  description: string;
  hero_emoji: string;
  is_premium?: boolean;
  /** Question slugs in the order they appear on the playlist page. */
  question_slugs: string[];
}

// ---------------------------------------------------------------------------
// Convenience helpers
// ---------------------------------------------------------------------------

export const DIFFICULTY_LABEL = ["", "Easy", "Easy+", "Medium", "Hard", "Brutal"] as const;

export function difficultyLabel(difficulty: number): string {
  return DIFFICULTY_LABEL[difficulty] ?? `D${difficulty}`;
}

export function inferTargetRolesFromTopic(topic: Topic): TargetRole[] {
  switch (topic) {
    case "Algorithms":
    case "Data Structures":
    case "Concurrency":
    case "Systems":
    case "C++ Deep Dives":
    case "LLD":
    case "System Design":
      return ["Dev"];
    case "Brainteasers":
      return ["All"];
    case "Probability":
    case "Statistics":
    case "Pure Math":
      return ["Researcher"];
    default:
      throw new Error(`Unhandled topic: ${topic satisfies never}`);
  }
}
