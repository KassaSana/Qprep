import { describe, expect, it } from "vitest";
import { ALL_SEED_QUESTIONS } from "@/content/seed";
import type { SeedQuestion } from "@/content/question-types";

function words(s: string): number {
  return (s.match(/\b\w+\b/g) ?? []).length;
}

function hasAny(haystackLower: string, needles: string[]): string | null {
  for (const n of needles) {
    if (haystackLower.includes(n)) return n;
  }
  return null;
}

function isNumericKind(q: SeedQuestion): boolean {
  return q.answer_kind === "numeric" || q.answer_kind === "fraction" || q.answer_kind === "exact";
}

describe("seed quality guardrails", () => {
  it("does not contain finance/options content (heuristic banned-term scan)", () => {
    const banned = [
      "black-scholes",
      "black scholes",
      "put-call",
      "put call",
      "implied vol",
      "implied volatility",
      "vol surface",
      "volatility surface",
      "call option payoff",
      "put option payoff",
      "put payoff",
      "call payoff",
      "american option",
      "european option",
      "greeks",
      "option greek",
      "implied vol smile",
      "implied volatility smile",
      "straddle",
      "strangle",
    ];

    const failures: string[] = [];
    for (const q of ALL_SEED_QUESTIONS) {
      const blob = [
        q.slug,
        q.title,
        q.prompt_md,
        q.solution_md,
        ...(q.tags ?? []),
        ...(q.companies ?? []),
        q.source ?? "",
      ]
        .join("\n")
        .toLowerCase();

      const hit = hasAny(blob, banned);
      if (hit) failures.push(`${q.slug}: contains "${hit}"`);
    }

    expect(failures, failures.join("\n")).toEqual([]);
  });

  it("freeform/code prompts and solutions are not empty/trivial", () => {
    const failures: string[] = [];
    for (const q of ALL_SEED_QUESTIONS) {
      const pw = words(q.prompt_md ?? "");
      const sw = words(q.solution_md ?? "");

      // MCQs and numeric drills can be intentionally terse; drift risk is
      // primarily on freeform/code where prompts must contain enough detail.
      if (q.answer_kind === "freeform" || q.answer_kind === "code") {
        // Allow concise definitions (some interview prompts are intentionally short),
        // but prevent truly empty/trivial drift.
        if (pw < 10) failures.push(`${q.slug}: prompt too short (${pw} words)`);
        if (sw < 5) failures.push(`${q.slug}: solution too short (${sw} words)`);
      }
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });

  it("numeric/fraction/exact questions define an answer_value", () => {
    const failures: string[] = [];
    for (const q of ALL_SEED_QUESTIONS.filter(isNumericKind)) {
      const ans = (q as { answer_value?: unknown }).answer_value;
      if (typeof ans !== "string" || ans.trim().length === 0) {
        failures.push(`${q.slug}: missing answer_value`);
      }
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });
});

