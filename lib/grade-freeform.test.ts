import { describe, expect, it } from "vitest";
import { gradeFreeform, gradeWithKeyword } from "./grade-freeform";

const baseInput = {
  questionTitle: "Dining Philosophers — Avoid Deadlock",
  questionPromptMd: "Describe a scheme that avoids deadlock among 5 philosophers.",
  rubric: [
    "Identifies a concrete scheme (e.g. global chopstick ordering)",
    "Mentions deadlock or one of its conditions",
    "Explains why the scheme prevents the cycle",
  ],
  reference:
    "Acquire chopsticks in increasing-id order to break circular wait.",
  minWords: 20,
};

describe("gradeWithKeyword", () => {
  it("passes a thoroughly written answer that hits every rubric token", () => {
    const r = gradeWithKeyword({
      ...baseInput,
      answer:
        "I would enforce a global numerical ordering on chopsticks so every philosopher acquires the lower-numbered one first. This concrete scheme prevents the deadlock circular wait condition because no thread can hold a higher chopstick while waiting on a lower one.",
    });
    expect(r.passed).toBe(true);
    expect(r.feedback).toMatch(/all 3 rubric points/);
  });

  it("fails when the answer is too short", () => {
    const r = gradeWithKeyword({
      ...baseInput,
      answer: "ordering chopsticks deadlock",
    });
    expect(r.passed).toBe(false);
    expect(r.feedback).toMatch(/words/);
  });

  it("fails when a rubric bullet is unaddressed", () => {
    const r = gradeWithKeyword({
      ...baseInput,
      answer:
        "I would enforce a global numerical ordering on chopsticks so every philosopher acquires the lower-numbered one first, which is a clean concrete scheme to use. The first philosopher to grab the smallest chopstick is the one most likely to grab the next one quickly.",
    });
    expect(r.passed).toBe(false);
    expect(r.feedback).toMatch(/missing/);
  });
});

describe("gradeFreeform fallback", () => {
  it("returns provider=keyword when no LLM is configured", async () => {
    delete process.env.GROQ_API_KEY;
    delete process.env.GRADER_PROVIDER;
    const r = await gradeFreeform({
      ...baseInput,
      answer:
        "I would enforce a global numerical ordering on chopsticks so every philosopher acquires the lower-numbered one first. This concrete scheme prevents the deadlock circular wait condition because no thread can hold a higher chopstick while waiting on a lower one.",
      providerOverride: "keyword",
    });
    expect(r.provider).toBe("keyword");
    expect(r.passed).toBe(true);
  });
});
