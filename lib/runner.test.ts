import { describe, expect, it, vi } from "vitest";
import { runCode, runLocalMock } from "./runner";
import type { CodeMeta } from "@/content/question-types";

const meta: CodeMeta = {
  language: "python",
  starter_code: "print('hi')",
  test_cases: [
    { input: "1\n", expected: "1\n" },
    { input: "2\n", expected: "2\n", hidden: true },
  ],
  time_limit_ms: 1000,
  memory_limit_mb: 64,
};

describe("runLocalMock", () => {
  it("returns one skipped result per test case", () => {
    const r = runLocalMock(meta);
    expect(r.runner).toBe("mock");
    expect(r.passed).toBe(false);
    expect(r.results).toHaveLength(2);
    expect(r.results.every((x) => x.skipped)).toBe(true);
  });
});

describe("runCode", () => {
  it("uses mock runner when useMock is true", async () => {
    const r = await runCode({ meta, source: "print('x')", useMock: true });
    expect(r.runner).toBe("mock");
    expect(r.results[0]?.skipped).toBe(true);
  });

  it("returns structured errors when Piston calls fail", async () => {
    // Ensure we go through the Piston path.
    const original = process.env.CODE_RUNNER_URL;
    process.env.CODE_RUNNER_URL = "https://example.invalid/piston";

    // 1) runtimes call
    const fetchMock = vi.fn(async (url: string) => {
      if (String(url).includes("/runtimes")) {
        return {
          ok: true,
          status: 200,
          json: async () => [{ language: "python", version: "3.11.0" }],
        } as any;
      }
      // 2) execute call fails
      return { ok: false, status: 500, json: async () => ({}) } as any;
    });
    vi.stubGlobal("fetch", fetchMock);

    const r = await runCode({ meta, source: "print('x')" });
    expect(r.runner).toBe("piston");
    expect(r.passed).toBe(false);
    expect(r.results).toHaveLength(2);
    expect(r.results[0]?.stderr).toMatch(/piston HTTP 500/);

    process.env.CODE_RUNNER_URL = original;
  });
});

