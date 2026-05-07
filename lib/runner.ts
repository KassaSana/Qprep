/**
 * Code runner — thin Piston client + offline mock.
 *
 * The runner takes a question's `answer_meta.test_cases` and a candidate
 * source file, executes each case via the configured Piston endpoint
 * (default `https://emkc.org/api/v2/piston`), and returns a per-test
 * verdict.
 *
 * If `CODE_RUNNER_URL` is unset *and* we're in local-dev mode (no Supabase),
 * the mock implementation marks every test as `skipped: true` so the UI
 * still has something to render. The runner result is treated as advisory
 * by `app/api/check`: a failed runner call returns a structured error and
 * does not silently mark an attempt as wrong.
 */

import type { CodeMeta, CodeTestCase } from "@/content/question-types";

export interface RunCaseResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  hidden: boolean;
  stdout: string;
  stderr: string;
  time_ms: number;
  /** True when the case wasn't actually executed (offline / mock). */
  skipped?: boolean;
  /** True when the runtime exceeded the time limit. */
  timed_out?: boolean;
}

export interface RunResult {
  passed: boolean;
  results: RunCaseResult[];
  /** Surfaces "no runner configured" so the UI can show a helpful note. */
  runner: "piston" | "mock";
  message?: string;
}

const DEFAULT_PISTON_URL = "https://emkc.org/api/v2/piston";

function pistonUrl(): string {
  const u = process.env.CODE_RUNNER_URL;
  if (u && u.trim().length > 0 && !u.includes("YOUR_")) {
    return u.replace(/\/$/, "");
  }
  return DEFAULT_PISTON_URL;
}

function isPistonConfigured(): boolean {
  // The public endpoint is always reachable, but in offline / local-dev mode
  // we deliberately stub. The toggle: explicit CODE_RUNNER_URL or non-test env.
  if (process.env.CODE_RUNNER_URL && process.env.CODE_RUNNER_URL.trim() !== "") {
    return true;
  }
  // The default URL is fine in production. In tests / `next dev` without
  // network, callers can pass `useMock` to short-circuit.
  return true;
}

function normalizeOutput(s: string): string {
  return (s ?? "").replace(/\r\n/g, "\n").replace(/\s+$/g, "");
}

function compareOutputs(actual: string, expected: string): boolean {
  return normalizeOutput(actual) === normalizeOutput(expected);
}

interface PistonExecuteResponse {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
}

/**
 * Fetches the latest Piston version for a language. Piston's `/runtimes`
 * endpoint returns a list; we pick the first match. We cache per-process so
 * repeated runs only hit the registry once.
 */
const versionCache = new Map<string, string>();

async function pistonVersionFor(language: string): Promise<string> {
  const cached = versionCache.get(language);
  if (cached) return cached;
  const res = await fetch(`${pistonUrl()}/runtimes`);
  if (!res.ok) throw new Error(`piston /runtimes HTTP ${res.status}`);
  const list = (await res.json()) as { language: string; version: string; aliases?: string[] }[];
  const match = list.find(
    (r) => r.language === language || (r.aliases ?? []).includes(language)
  );
  if (!match) throw new Error(`piston: no runtime for language "${language}"`);
  versionCache.set(language, match.version);
  return match.version;
}

async function runOnPiston(meta: CodeMeta, source: string): Promise<RunResult> {
  const version = await pistonVersionFor(meta.language);

  const results: RunCaseResult[] = [];
  for (const tc of meta.test_cases) {
    const start = performance.now();
    const res = await fetch(`${pistonUrl()}/execute`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        language: meta.language,
        version,
        files: [{ name: fileNameFor(meta.language), content: source }],
        stdin: tc.input,
        run_timeout: meta.time_limit_ms ?? 3000,
        compile_timeout: 10000,
        run_memory_limit: (meta.memory_limit_mb ?? 128) * 1024 * 1024,
      }),
    });
    const elapsed = performance.now() - start;

    if (!res.ok) {
      results.push(makeErrorCase(tc, `piston HTTP ${res.status}`, elapsed));
      continue;
    }
    const data = (await res.json()) as PistonExecuteResponse;
    const stderr = (data.compile?.stderr ?? "") + data.run.stderr;
    const stdout = data.run.stdout ?? "";
    const passed = data.run.code === 0 && compareOutputs(stdout, tc.expected);
    const timedOut = data.run.signal === "SIGKILL" || data.run.signal === "SIGTERM";
    results.push({
      input: tc.input,
      expected: tc.expected,
      actual: normalizeOutput(stdout),
      passed,
      hidden: !!tc.hidden,
      stdout,
      stderr,
      time_ms: Math.round(elapsed),
      timed_out: timedOut,
    });
  }

  return {
    passed: results.every((r) => r.passed),
    results,
    runner: "piston",
  };
}

function makeErrorCase(
  tc: CodeTestCase,
  message: string,
  elapsed: number
): RunCaseResult {
  return {
    input: tc.input,
    expected: tc.expected,
    actual: "",
    passed: false,
    hidden: !!tc.hidden,
    stdout: "",
    stderr: message,
    time_ms: Math.round(elapsed),
  };
}

function fileNameFor(language: string): string {
  switch (language) {
    case "python":
    case "python3":
      return "main.py";
    case "javascript":
    case "node":
      return "main.js";
    case "typescript":
      return "main.ts";
    case "cpp":
    case "c++":
      return "main.cpp";
    case "c":
      return "main.c";
    case "java":
      return "Main.java";
    case "go":
      return "main.go";
    case "rust":
      return "main.rs";
    default:
      return "main.txt";
  }
}

/**
 * Mock runner: returns one skipped result per test case so the UI still
 * shows the expected/actual layout in offline / preview mode.
 */
export function runLocalMock(meta: CodeMeta): RunResult {
  return {
    passed: false,
    results: meta.test_cases.map((tc) => ({
      input: tc.input,
      expected: tc.expected,
      actual: "",
      passed: false,
      hidden: !!tc.hidden,
      stdout: "",
      stderr: "",
      time_ms: 0,
      skipped: true,
    })),
    runner: "mock",
    message:
      "Code runner is mocked. Set CODE_RUNNER_URL (e.g. https://emkc.org/api/v2/piston) to execute test cases for real.",
  };
}

export interface RunCodeInput {
  meta: CodeMeta;
  source: string;
  /** Force the offline mock even when CODE_RUNNER_URL would otherwise be used. */
  useMock?: boolean;
}

export async function runCode(input: RunCodeInput): Promise<RunResult> {
  if (input.useMock || !isPistonConfigured()) {
    return runLocalMock(input.meta);
  }
  try {
    return await runOnPiston(input.meta, input.source);
  } catch (err) {
    return {
      passed: false,
      results: input.meta.test_cases.map((tc) => makeErrorCase(tc, (err as Error).message, 0)),
      runner: "piston",
      message: `Code runner failed: ${(err as Error).message}`,
    };
  }
}
