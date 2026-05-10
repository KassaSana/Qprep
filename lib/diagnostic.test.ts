import { describe, expect, it } from "vitest";
import {
  recommendPlaylist,
  summarizeAnswers,
  type DiagnosticAnswers,
} from "./diagnostic";
import type { LoadedQuestion } from "./questions-data";
import type { Topic } from "@/content/question-types";

function mcq(slug: string, topic: Topic, correctOption: string): LoadedQuestion {
  return {
    id: `id-${slug}`,
    slug,
    topic,
    title: `Q ${slug}`,
    prompt_md: "",
    solution_md: null,
    answer_kind: "mcq",
    answer_value: correctOption,
    answer_tolerance: null,
    answer_meta: { options: [{ id: "A", label: "A", correct: correctOption === "A" }, { id: "B", label: "B", correct: correctOption === "B" }] },
    target_roles: ["All"],
    difficulty: 2,
    tags: [],
    companies: [],
    source: null,
    is_premium: false,
  };
}

const QUESTIONS: LoadedQuestion[] = [
  mcq("p1", "Probability", "A"),
  mcq("p2", "Probability", "B"),
  mcq("s1", "Statistics", "A"),
  mcq("m1", "Pure Math", "A"),
  mcq("m2", "Pure Math", "B"),
  mcq("ds1", "Data Structures", "A"),
  mcq("ds2", "Data Structures", "B"),
  mcq("cpp1", "C++ Deep Dives", "A"),
  mcq("c1", "Concurrency", "A"),
  mcq("bt1", "Brainteasers", "A"),
];

describe("summarizeAnswers", () => {
  it("returns zeros for an empty answer map", () => {
    const s = summarizeAnswers(QUESTIONS, {});
    expect(s.answered).toBe(0);
    expect(s.byTopic).toEqual([]);
    expect(s.researcherFraction).toBe(0);
    expect(s.devFraction).toBe(0);
  });

  it("counts right vs wrong per topic", () => {
    const answers: DiagnosticAnswers = {
      p1: "A", // right
      p2: "A", // wrong (correct is B)
      s1: "A", // right
    };
    const s = summarizeAnswers(QUESTIONS, answers);
    expect(s.answered).toBe(3);
    const byTopic = Object.fromEntries(s.byTopic.map((t) => [t.topic, t]));
    expect(byTopic.Probability).toEqual({ topic: "Probability", asked: 2, right: 1 });
    expect(byTopic.Statistics).toEqual({ topic: "Statistics", asked: 1, right: 1 });
  });

  it("computes researcher and dev lane fractions independently", () => {
    const answers: DiagnosticAnswers = {
      p1: "A", // researcher right
      p2: "A", // researcher wrong
      s1: "A", // researcher right
      m1: "A", // researcher right
      m2: "B", // researcher right
      ds1: "B", // dev wrong
      ds2: "A", // dev wrong
      cpp1: "A", // dev right
      c1: "A", // dev right
    };
    const s = summarizeAnswers(QUESTIONS, answers);
    // researcher: 4 right out of 5 asked = 0.8
    expect(s.researcherFraction).toBeCloseTo(4 / 5);
    // dev: 2 right out of 4 asked = 0.5
    expect(s.devFraction).toBeCloseTo(2 / 4);
  });

  it("ignores answers for unknown slugs (stale content) without throwing", () => {
    const answers: DiagnosticAnswers = { unknown: "A", p1: "A" };
    const s = summarizeAnswers(QUESTIONS, answers);
    expect(s.answered).toBe(1);
  });

  it("ignores non-MCQ questions defensively", () => {
    const mixed: LoadedQuestion[] = [
      { ...mcq("p1", "Probability", "A"), answer_kind: "freeform" },
      mcq("p2", "Probability", "B"),
    ];
    const s = summarizeAnswers(mixed, { p1: "A", p2: "B" });
    expect(s.answered).toBe(1);
    expect(s.byTopic[0].topic).toBe("Probability");
    expect(s.byTopic[0].asked).toBe(1);
  });

  it("brainteasers don't count toward researcher or dev lane fractions", () => {
    const answers: DiagnosticAnswers = { bt1: "A" };
    const s = summarizeAnswers(QUESTIONS, answers);
    expect(s.researcherFraction).toBe(0);
    expect(s.devFraction).toBe(0);
    expect(s.byTopic[0].topic).toBe("Brainteasers");
  });
});

describe("recommendPlaylist", () => {
  it("recommends warmup when lanes are weak", () => {
    const r = recommendPlaylist({
      answered: 10,
      total: 10,
      byTopic: [],
      researcherFraction: 0.4,
      devFraction: 0.4,
    });
    expect(r.playlistSlug).toBe("warmup-quickstart");
  });

  it("recommends researcher-foundations on a clear researcher lean", () => {
    const r = recommendPlaylist({
      answered: 10,
      total: 10,
      byTopic: [],
      researcherFraction: 0.8,
      devFraction: 0.25,
    });
    expect(r.playlistSlug).toBe("researcher-foundations");
  });

  it("recommends quant-dev-essentials on a clear dev lean", () => {
    const r = recommendPlaylist({
      answered: 10,
      total: 10,
      byTopic: [],
      researcherFraction: 0.2,
      devFraction: 0.75,
    });
    expect(r.playlistSlug).toBe("quant-dev-essentials");
  });

  it("recommends top-50 when both lanes are strong (and lean is small)", () => {
    const r = recommendPlaylist({
      answered: 10,
      total: 10,
      byTopic: [],
      researcherFraction: 0.8,
      devFraction: 0.8,
    });
    expect(r.playlistSlug).toBe("top-50");
  });

  it("requires a meaningful margin to lean — close calls go to warmup", () => {
    // Researcher 0.7 (strong), Dev 0.6 (also pretty strong, not strong enough
    // to qualify; margin 0.1 < 0.2). Expect warmup, not researcher-foundations.
    const r = recommendPlaylist({
      answered: 10,
      total: 10,
      byTopic: [],
      researcherFraction: 0.7,
      devFraction: 0.6,
    });
    expect(r.playlistSlug).toBe("warmup-quickstart");
  });
});
