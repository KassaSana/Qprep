import { afterEach, describe, expect, it, vi } from "vitest";
import { gradeFreeform } from "./grade-freeform";

const input = {
  questionTitle: "Test",
  questionPromptMd: "Explain X",
  rubric: ["mentions foo", "mentions bar"],
  reference: "foo then bar",
  answer: "I will mention foo and also bar in my answer, with enough words.",
  minWords: 5,
};

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.GRADER_PROVIDER;
  delete process.env.GROQ_API_KEY;
  delete process.env.GRADER_MODEL;
});

describe("gradeFreeform provider JSON tolerance + fallback", () => {
  it("tolerates fenced JSON and extra text from a provider", async () => {
    process.env.GRADER_PROVIDER = "groq";
    process.env.GROQ_API_KEY = "test-key";

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          choices: [
            {
              message: {
                content:
                  "Sure!\n```json\n{\"passed\": true, \"feedback\": \"good\"}\n```\n(extra)",
              },
            },
          ],
        }),
      }))
    );

    const r = await gradeFreeform({ ...input, providerOverride: "groq" });
    expect(r.provider).toBe("groq");
    expect(r.passed).toBe(true);
    expect(r.feedback).toBe("good");
  });

  it("falls back to keyword when provider returns unparseable content", async () => {
    process.env.GRADER_PROVIDER = "groq";
    process.env.GROQ_API_KEY = "test-key";

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          choices: [{ message: { content: "not json" } }],
        }),
      }))
    );

    const r = await gradeFreeform({
      ...input,
      answer: "foo bar baz qux quux",
      providerOverride: "groq",
    });
    expect(r.provider).toBe("keyword");
    expect(r.feedback).toMatch(/produced no parseable JSON/i);
  });

  it("falls back to keyword when provider throws (e.g. HTTP error)", async () => {
    process.env.GRADER_PROVIDER = "groq";
    process.env.GROQ_API_KEY = "test-key";

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 429,
        json: async () => ({}),
      }))
    );

    const r = await gradeFreeform({
      ...input,
      answer: "foo bar baz qux quux",
      providerOverride: "groq",
    });
    expect(r.provider).toBe("keyword");
    expect(r.feedback).toMatch(/provider="groq" failed/i);
    expect(r.passed).toBe(true);
  });
});

