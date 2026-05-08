import { describe, expect, it } from "vitest";
import { checkAnswer, parseNumeric } from "./answer-check";

describe("parseNumeric additional cases", () => {
  it("parses scientific notation", () => {
    expect(parseNumeric("1e-3")).toBeCloseTo(0.001);
    expect(parseNumeric("-2E2")).toBe(-200);
  });

  it("parses fraction with negative denominator", () => {
    expect(parseNumeric("1/-2")).toBe(-0.5);
    expect(parseNumeric("-1/-2")).toBe(0.5);
  });

  it("parses mixed negative number", () => {
    expect(parseNumeric("-1 1/2")).toBeCloseTo(-1.5);
  });

  it("parses percent with whitespace", () => {
    expect(parseNumeric("  12.5 % ")).toBeCloseTo(0.125);
  });

  it("rejects decimals with trailing junk", () => {
    expect(parseNumeric("1.2.3")).toBeNull();
    expect(parseNumeric("1e")).toBeNull();
    expect(parseNumeric("1e-")).toBeNull();
  });
});

describe("checkAnswer signatures and bucketing", () => {
  it("buckets numerics so equivalent values share a signature", () => {
    const spec = {
      answer_kind: "numeric" as const,
      answer_value: "1",
      answer_tolerance: 0,
    };

    const a = checkAnswer(spec, "0.3334").errorSignature;
    const b = checkAnswer(spec, "0.3334000").errorSignature;
    expect(a).toBe(b);
  });

  it("produces a deterministic signature when question answer_value is malformed", () => {
    const spec = {
      answer_kind: "numeric" as const,
      answer_value: "not-a-number",
      answer_tolerance: 0,
    };
    const r = checkAnswer(spec, "0.5");
    expect(r.correct).toBe(false);
    expect(r.errorSignature).toContain("unparseable_target:");
  });

  it("exact kind includes normalized string in signature", () => {
    const spec = {
      answer_kind: "exact" as const,
      answer_value: "Hello   World",
      answer_tolerance: null,
    };
    const r = checkAnswer(spec, "  heLLo world  ");
    expect(r.correct).toBe(true);
    expect(r.errorSignature).toBe("exact:hello world");
  });
});

