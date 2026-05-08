import { describe, expect, it } from "vitest";
import { computeNext, parseFromParam } from "./next-question";
import type { LoadedQuestion } from "./questions-data";
import { PLAYLISTS } from "@/content/playlists";

function makeQ(slug: string, id: string): LoadedQuestion {
  return {
    id,
    slug,
    topic: "Probability",
    title: `Q ${slug}`,
    prompt_md: "",
    solution_md: null,
    answer_kind: "numeric",
    answer_value: null,
    answer_tolerance: null,
    answer_meta: null,
    target_roles: ["All"],
    difficulty: 1,
    tags: [],
    companies: [],
    source: null,
    is_premium: false,
  };
}

describe("parseFromParam", () => {
  it("parses playlist:<slug>", () => {
    expect(parseFromParam("playlist:warmup-quickstart")).toEqual({
      kind: "playlist",
      slug: "warmup-quickstart",
    });
  });

  it("returns null for missing or unknown shapes", () => {
    expect(parseFromParam(undefined)).toBeNull();
    expect(parseFromParam("")).toBeNull();
    expect(parseFromParam("topic:Probability")).toBeNull();
    expect(parseFromParam("playlist:")).toBeNull();
  });
});

describe("computeNext", () => {
  const warmup = PLAYLISTS.find((p) => p.slug === "warmup-quickstart")!;
  const slugs = warmup.question_slugs;
  // Build a question for every slug in the playlist so the helper can resolve them.
  const questions = slugs.map((s, i) => makeQ(s, `id-${i}`));

  it("returns the next unsolved slug in the playlist, scoped to that playlist", () => {
    const solved = new Set([questions[0].id]); // first slug already solved
    const next = computeNext({
      from: { kind: "playlist", slug: warmup.slug },
      currentQuestionId: questions[1].id, // user just solved index 1
      questions,
      solvedQuestionIds: solved,
    });
    expect(next).not.toBeNull();
    // First unsolved skipping idx 0 (solved) and idx 1 (current) → idx 2
    expect(next!.href).toBe(
      `/questions/${slugs[2]}?from=playlist:${warmup.slug}`
    );
    expect(next!.label).toContain(warmup.name);
  });

  it("falls back to a global pick when the scoping playlist is exhausted", () => {
    // Mark every question in warmup as solved
    const solved = new Set(questions.map((q) => q.id));
    const next = computeNext({
      from: { kind: "playlist", slug: warmup.slug },
      currentQuestionId: questions[0].id,
      questions,
      solvedQuestionIds: solved,
    });
    // Either null (everything solved) or a global suggestion. We just want
    // it not to throw and not to point back into warmup.
    if (next) {
      expect(next.href).not.toContain(`from=playlist:${warmup.slug}`);
    }
  });

  it("returns null when there is nothing to advance to", () => {
    const next = computeNext({
      from: null,
      currentQuestionId: "id-0",
      questions: [],
      solvedQuestionIds: new Set(),
    });
    expect(next).toBeNull();
  });

  it("with no `from` context, still suggests a global next from any playlist", () => {
    // Use a question that exists in PLAYLISTS, with nothing solved.
    const allQs: LoadedQuestion[] = [];
    for (const p of PLAYLISTS) {
      p.question_slugs.forEach((s, i) =>
        allQs.push(makeQ(s, `${p.slug}-${i}`))
      );
    }
    const next = computeNext({
      from: null,
      currentQuestionId: "nonexistent",
      questions: allQs,
      solvedQuestionIds: new Set(),
    });
    expect(next).not.toBeNull();
    expect(next!.href).toMatch(/^\/questions\/.+\?from=playlist:/);
  });
});
