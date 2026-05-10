import { describe, expect, it } from "vitest";
import { pickResurfaced, type AttemptForResurface } from "./spaced-rep";

const NOW = new Date("2026-05-10T12:00:00Z");

function daysAgo(days: number): string {
  return new Date(NOW.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
}

describe("pickResurfaced", () => {
  it("returns nothing for an empty log", () => {
    expect(pickResurfaced([], { now: NOW })).toEqual([]);
  });

  it("excludes questions the user has ever solved", () => {
    const attempts: AttemptForResurface[] = [
      { question_id: "q1", is_correct: false, created_at: daysAgo(7) },
      { question_id: "q1", is_correct: true, created_at: daysAgo(2) },
    ];
    expect(pickResurfaced(attempts, { now: NOW })).toEqual([]);
  });

  it("excludes wrong attempts that are too recent (default >=3 days)", () => {
    const attempts: AttemptForResurface[] = [
      { question_id: "q1", is_correct: false, created_at: daysAgo(1) },
      { question_id: "q2", is_correct: false, created_at: daysAgo(2) },
    ];
    expect(pickResurfaced(attempts, { now: NOW })).toEqual([]);
  });

  it("returns oldest unsolved-wrong first", () => {
    const attempts: AttemptForResurface[] = [
      { question_id: "fresh", is_correct: false, created_at: daysAgo(4) },
      { question_id: "stale", is_correct: false, created_at: daysAgo(20) },
      { question_id: "mid", is_correct: false, created_at: daysAgo(10) },
    ];
    const out = pickResurfaced(attempts, { now: NOW });
    expect(out.map((c) => c.questionId)).toEqual(["stale", "mid", "fresh"]);
  });

  it("counts repeated wrongs and uses count as tie-breaker", () => {
    const attempts: AttemptForResurface[] = [
      // Two questions wrong at the same instant; the more-attempted one wins the tie.
      { question_id: "tried-once", is_correct: false, created_at: daysAgo(7) },
      { question_id: "tried-thrice", is_correct: false, created_at: daysAgo(7) },
      { question_id: "tried-thrice", is_correct: false, created_at: daysAgo(7) },
      { question_id: "tried-thrice", is_correct: false, created_at: daysAgo(7) },
    ];
    const out = pickResurfaced(attempts, { now: NOW });
    expect(out[0].questionId).toBe("tried-thrice");
    expect(out[0].wrongAttemptCount).toBe(3);
    expect(out[1].questionId).toBe("tried-once");
    expect(out[1].wrongAttemptCount).toBe(1);
  });

  it("respects the limit argument", () => {
    const attempts: AttemptForResurface[] = Array.from({ length: 12 }, (_, i) => ({
      question_id: `q${i}`,
      is_correct: false,
      created_at: daysAgo(5 + i),
    }));
    const out = pickResurfaced(attempts, { now: NOW, limit: 3 });
    expect(out).toHaveLength(3);
    expect(out[0].questionId).toBe("q11"); // oldest
  });

  it("computes daysSinceLastWrong correctly", () => {
    const attempts: AttemptForResurface[] = [
      { question_id: "q1", is_correct: false, created_at: daysAgo(7) },
    ];
    const out = pickResurfaced(attempts, { now: NOW });
    expect(out[0].daysSinceLastWrong).toBe(7);
  });

  it("uses the most recent wrong, not the first wrong, for age", () => {
    const attempts: AttemptForResurface[] = [
      { question_id: "q1", is_correct: false, created_at: daysAgo(20) },
      { question_id: "q1", is_correct: false, created_at: daysAgo(5) },
    ];
    const out = pickResurfaced(attempts, { now: NOW });
    expect(out[0].daysSinceLastWrong).toBe(5);
    expect(out[0].wrongAttemptCount).toBe(2);
  });

  it("ignores attempts with malformed created_at", () => {
    const attempts: AttemptForResurface[] = [
      { question_id: "good", is_correct: false, created_at: daysAgo(7) },
      { question_id: "bad", is_correct: false, created_at: "not-a-date" },
    ];
    const out = pickResurfaced(attempts, { now: NOW });
    expect(out.map((c) => c.questionId)).toEqual(["good"]);
  });

  it("respects custom minDaysOld", () => {
    const attempts: AttemptForResurface[] = [
      { question_id: "q1", is_correct: false, created_at: daysAgo(2) },
    ];
    expect(pickResurfaced(attempts, { now: NOW, minDaysOld: 1 })).toHaveLength(1);
    expect(pickResurfaced(attempts, { now: NOW, minDaysOld: 3 })).toHaveLength(0);
  });
});
