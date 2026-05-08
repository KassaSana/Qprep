import { describe, expect, it } from "vitest";
import { scrubAnswer } from "./anthropic";

describe("scrubAnswer", () => {
  it("redacts an exact numeric canonical answer", () => {
    const out = scrubAnswer("The answer is 0.375.", "0.375");
    expect(out).not.toContain("0.375");
    expect(out).toContain("[redacted]");
  });

  it("redacts common rounded numeric variants", () => {
    const out = scrubAnswer("I think it is 1.50 or maybe 1.5000.", "1.5");
    expect(out).toContain("[redacted]");
    expect(out).not.toMatch(/\b1\.50\b/);
    expect(out).not.toMatch(/\b1\.5000\b/);
  });

  it("redacts decimal expansions for simple fractions", () => {
    const out = scrubAnswer("That fraction is 0.3333 approximately.", "1/3");
    expect(out).toContain("[redacted]");
  });

  it("does not over-redact parts of other numbers", () => {
    const out = scrubAnswer("This is 12.375 not 0.375.", "0.375");
    expect(out).toContain("12.375");
  });
});

