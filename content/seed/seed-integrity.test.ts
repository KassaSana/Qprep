import { describe, expect, it } from "vitest";
import { ALL_SEED_QUESTIONS } from "@/content/seed";
import { PLAYLISTS } from "@/content/playlists";
import type {
  SeedQuestion,
  McqSeedQuestion,
  FreeformSeedQuestion,
  CodeSeedQuestion,
} from "@/content/question-types";

function isMcq(q: SeedQuestion): q is McqSeedQuestion {
  return q.answer_kind === "mcq";
}
function isFreeform(q: SeedQuestion): q is FreeformSeedQuestion {
  return q.answer_kind === "freeform";
}
function isCode(q: SeedQuestion): q is CodeSeedQuestion {
  return q.answer_kind === "code";
}

describe("seed integrity", () => {
  it("has unique slugs", () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const q of ALL_SEED_QUESTIONS) {
      if (seen.has(q.slug)) dupes.push(q.slug);
      seen.add(q.slug);
    }
    expect(dupes, `Duplicate slugs: ${dupes.join(", ")}`).toEqual([]);
  });

  it("playlists reference existing question slugs", () => {
    const slugs = new Set(ALL_SEED_QUESTIONS.map((q) => q.slug));
    const missing: string[] = [];
    for (const p of PLAYLISTS) {
      for (const s of p.question_slugs) {
        if (!slugs.has(s)) missing.push(`${p.slug} -> ${s}`);
      }
    }
    expect(missing, `Missing playlist slugs: ${missing.join(", ")}`).toEqual([]);
  });

  it("MCQs have exactly one correct option and answer_value matches it", () => {
    const failures: string[] = [];
    for (const q of ALL_SEED_QUESTIONS.filter(isMcq)) {
      const options = q.answer_meta?.options ?? [];
      const correct = options.filter((o) => o.correct);
      if (correct.length !== 1) {
        failures.push(`${q.slug}: expected 1 correct option, got ${correct.length}`);
        continue;
      }
      if (correct[0]!.id !== q.answer_value) {
        failures.push(
          `${q.slug}: answer_value="${q.answer_value}" but correct option is "${correct[0]!.id}"`
        );
      }
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });

  it("freeform questions define a non-empty rubric", () => {
    const failures: string[] = [];
    for (const q of ALL_SEED_QUESTIONS.filter(isFreeform)) {
      const rubric = q.answer_meta?.rubric ?? [];
      if (!Array.isArray(rubric) || rubric.length === 0) {
        failures.push(`${q.slug}: missing rubric`);
      }
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });

  it("code questions define at least one test case", () => {
    const failures: string[] = [];
    for (const q of ALL_SEED_QUESTIONS.filter(isCode)) {
      const tcs = q.answer_meta?.test_cases ?? [];
      if (!Array.isArray(tcs) || tcs.length === 0) {
        failures.push(`${q.slug}: missing test_cases`);
      }
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });
});

