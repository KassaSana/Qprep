import { describe, expect, it } from "vitest";
import { checkMcq } from "./check-mcq";

const meta = {
  options: [
    { id: "a", label: "Choice A", correct: false },
    { id: "b", label: "Choice B", correct: true },
    { id: "c", label: "Choice C", correct: false },
  ],
};

describe("checkMcq", () => {
  it("accepts the correct option id", () => {
    const r = checkMcq({ answer_value: "b", answer_meta: meta }, "b");
    expect(r.correct).toBe(true);
    expect(r.errorSignature).toBe("mcq:b");
  });

  it("is case insensitive on the option id", () => {
    const r = checkMcq({ answer_value: "b", answer_meta: meta }, "  B  ");
    expect(r.correct).toBe(true);
  });

  it("rejects a wrong option id", () => {
    const r = checkMcq({ answer_value: "b", answer_meta: meta }, "a");
    expect(r.correct).toBe(false);
    expect(r.errorSignature).toBe("mcq:a");
  });

  it("rejects when canonical answer disagrees with options[].correct", () => {
    // Defense-in-depth: even if `answer_value` is wrong, the chosen option
    // must also carry `correct: true`.
    const r = checkMcq(
      {
        answer_value: "a",
        answer_meta: meta,
      },
      "a"
    );
    expect(r.correct).toBe(false);
  });

  it("rejects an unknown option id", () => {
    const r = checkMcq({ answer_value: "b", answer_meta: meta }, "z");
    expect(r.correct).toBe(false);
    expect(r.errorSignature).toBe("mcq:z");
  });
});
