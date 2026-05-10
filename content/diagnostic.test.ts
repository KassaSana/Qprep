import { describe, expect, it } from "vitest";
import { ALL_SEED_QUESTIONS } from "@/content/seed";
import { DIAGNOSTIC_SLUGS } from "@/content/diagnostic";

/**
 * The diagnostic page degrades to an "unavailable" notice if any slug fails
 * to resolve in the bank. That's defensive runtime behavior, but we want
 * the CI to scream loudly if a seed rename ever silently breaks onboarding.
 */
describe("diagnostic slug coverage", () => {
  const bySlug = new Map(ALL_SEED_QUESTIONS.map((q) => [q.slug, q]));

  it("every diagnostic slug exists in the seed bundle", () => {
    const missing = DIAGNOSTIC_SLUGS.filter((s) => !bySlug.has(s));
    expect(missing, `Missing diagnostic slugs: ${missing.join(", ")}`).toEqual(
      []
    );
  });

  it("every diagnostic question is an MCQ", () => {
    const wrongKind = DIAGNOSTIC_SLUGS
      .map((s) => ({ slug: s, q: bySlug.get(s) }))
      .filter((x) => x.q && x.q.answer_kind !== "mcq")
      .map((x) => `${x.slug} (${x.q!.answer_kind})`);
    expect(
      wrongKind,
      `Diagnostic slugs that aren't MCQ: ${wrongKind.join(", ")}`
    ).toEqual([]);
  });

  it("every diagnostic MCQ has a valid answer_value pointing at one of its options", () => {
    const broken: string[] = [];
    for (const slug of DIAGNOSTIC_SLUGS) {
      const q = bySlug.get(slug);
      if (!q || q.answer_kind !== "mcq") continue;
      const meta = q.answer_meta as { options?: { id: string }[] } | null;
      const ids = new Set((meta?.options ?? []).map((o) => o.id));
      if (!q.answer_value || !ids.has(q.answer_value)) {
        broken.push(slug);
      }
    }
    expect(broken, `Broken MCQ wiring: ${broken.join(", ")}`).toEqual([]);
  });
});
