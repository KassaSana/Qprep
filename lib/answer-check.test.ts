import { describe, expect, it } from "vitest";
import { checkAnswer, parseNumeric } from "./answer-check";

describe("parseNumeric", () => {
  it("parses decimals", () => {
    expect(parseNumeric("0.375")).toBe(0.375);
    expect(parseNumeric("-2.5")).toBe(-2.5);
  });

  it("parses integers", () => {
    expect(parseNumeric("7")).toBe(7);
  });

  it("parses simple fractions", () => {
    expect(parseNumeric("3/8")).toBe(0.375);
    expect(parseNumeric("-1/4")).toBe(-0.25);
  });

  it("parses mixed numbers", () => {
    expect(parseNumeric("1 1/2")).toBeCloseTo(1.5);
    expect(parseNumeric("2 3/4")).toBeCloseTo(2.75);
  });

  it("parses percentages", () => {
    expect(parseNumeric("50%")).toBe(0.5);
    expect(parseNumeric("37.5%")).toBeCloseTo(0.375);
  });

  it("rejects garbage", () => {
    expect(parseNumeric("")).toBeNull();
    expect(parseNumeric("seven")).toBeNull();
    expect(parseNumeric("1/0")).toBeNull();
  });
});

describe("checkAnswer numeric", () => {
  const spec = {
    answer_kind: "numeric" as const,
    answer_value: "0.375",
    answer_tolerance: 1e-3,
  };

  it("accepts exact decimal", () => {
    expect(checkAnswer(spec, "0.375").correct).toBe(true);
  });

  it("accepts equivalent fraction", () => {
    expect(checkAnswer(spec, "3/8").correct).toBe(true);
  });

  it("accepts equivalent percent", () => {
    expect(checkAnswer(spec, "37.5%").correct).toBe(true);
  });

  it("rejects close but outside tolerance", () => {
    expect(checkAnswer(spec, "0.38").correct).toBe(false);
  });

  it("produces stable signature for equivalent wrong answers", () => {
    const a = checkAnswer(spec, "0.5").errorSignature;
    const b = checkAnswer(spec, "1/2").errorSignature;
    expect(a).toBe(b);
  });
});

describe("checkAnswer fraction", () => {
  const spec = {
    answer_kind: "fraction" as const,
    answer_value: "1/2",
    answer_tolerance: 1e-6,
  };

  it("accepts the canonical form", () => {
    expect(checkAnswer(spec, "1/2").correct).toBe(true);
  });

  it("accepts the decimal form", () => {
    expect(checkAnswer(spec, "0.5").correct).toBe(true);
  });
});

describe("checkAnswer exact", () => {
  const spec = {
    answer_kind: "exact" as const,
    answer_value: "Bayes' Theorem",
    answer_tolerance: null,
  };

  it("is case-insensitive and whitespace tolerant", () => {
    expect(checkAnswer(spec, "  bayes'  theorem ").correct).toBe(true);
  });

  it("rejects different strings", () => {
    expect(checkAnswer(spec, "Markov's inequality").correct).toBe(false);
  });
});

describe("checkAnswer edge cases", () => {
  it("empty answer is incorrect, not a crash", () => {
    const spec = {
      answer_kind: "numeric" as const,
      answer_value: "1",
      answer_tolerance: 0,
    };
    const r = checkAnswer(spec, "");
    expect(r.correct).toBe(false);
    expect(r.errorSignature).toContain("unparseable");
  });

  it("uses default tolerance when none provided", () => {
    const spec = {
      answer_kind: "numeric" as const,
      answer_value: "0.3333333",
      answer_tolerance: null,
    };
    expect(checkAnswer(spec, "0.3334").correct).toBe(true);
  });
});
