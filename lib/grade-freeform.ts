/**
 * Provider-agnostic freeform answer grader.
 *
 * The same `gradeFreeform({prompt, rubric, reference, answer})` call works
 * across four providers, selected by the `GRADER_PROVIDER` env var:
 *
 *   - groq      (default; free tier ~14,400 req/day; Llama 3.3 70B)
 *   - anthropic (Claude Haiku 4.7 by default; reuses lib/anthropic client)
 *   - ollama    (local Ollama server; great for offline dev with a real LLM)
 *   - keyword   (deterministic rubric-keyword + min-words check; no network)
 *
 * Every provider returns the same JSON shape:
 *
 *   { passed: boolean, feedback: string, provider: string }
 *
 * The keyword adapter is also used as the *runtime fallback* on 429 / 5xx
 * from any LLM provider, and as the implicit default whenever
 * `GRADER_PROVIDER` is unset and no API key is configured. That makes
 * `npm run dev` Just Work even with a fully empty `.env.local`.
 *
 * Caching is the responsibility of the caller (the API route hashes
 * `(question_id, sha256(answer))` and stores results in `grade_cache`).
 */

import { ANTHROPIC_MODEL, getAnthropic, isAnthropicConfigured } from "@/lib/anthropic";

export type GraderProvider = "groq" | "anthropic" | "ollama" | "keyword";

export interface GradeFreeformInput {
  questionTitle: string;
  questionPromptMd: string;
  rubric: string[];
  /** Reference solution markdown (may include LaTeX). Optional. */
  reference?: string | null;
  /** The user's freeform answer. */
  answer: string;
  /** Floor on answer length, in words. */
  minWords?: number;
  /** Override the configured provider (used for tests / preview). */
  providerOverride?: GraderProvider;
}

export interface GradeFreeformResult {
  passed: boolean;
  feedback: string;
  provider: GraderProvider;
}

const SYSTEM_PROMPT = `You are an interview grader for a quant-firm coding/concurrency/system-design assessment.

You will receive:
- a problem statement
- a rubric (a list of points the answer must address)
- (optionally) a reference solution
- the candidate's answer

Decide whether the answer demonstrably covers the rubric. Be lenient on
phrasing and notation, strict on whether the underlying idea is present.

Reply with EXACTLY one JSON object on a single line, no markdown fences,
no preamble, of the form:

  {"passed": <true|false>, "feedback": "<one to three sentences>"}

Mark passed=true only if every rubric point is meaningfully addressed.
Feedback should be useful: name which rubric items are missing or weak,
or what was strong if passed=true. Never reveal new content beyond the
rubric/reference.`;

function buildUserPrompt(input: GradeFreeformInput): string {
  const reference = input.reference?.trim()
    ? `\n\nReference solution (do not paraphrase verbatim):\n${input.reference.trim()}`
    : "";
  return [
    `Title: ${input.questionTitle}`,
    "",
    "Problem statement:",
    input.questionPromptMd,
    "",
    "Rubric (each bullet must be meaningfully addressed):",
    ...input.rubric.map((b) => `- ${b}`),
    reference,
    "",
    "Candidate answer:",
    input.answer,
    "",
    "Reply with the JSON object now.",
  ].join("\n");
}

interface GradeJson {
  passed: boolean;
  feedback: string;
}

function parseGraderJson(raw: string): GradeJson | null {
  const trimmed = raw.trim();
  // Tolerate a fenced code block ``` ... ```
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fenced ? fenced[1] : trimmed;

  // Pull the first {...} block in case the model added stray text.
  const match = body.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    const obj = JSON.parse(match[0]) as Partial<GradeJson> & {
      passed?: unknown;
      feedback?: unknown;
    };
    if (typeof obj.passed !== "boolean") return null;
    const feedback = typeof obj.feedback === "string" ? obj.feedback : "";
    return { passed: obj.passed, feedback };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Provider config + detection
// ---------------------------------------------------------------------------

export function configuredGraderProvider(): GraderProvider {
  const raw = (process.env.GRADER_PROVIDER ?? "").toLowerCase().trim();
  if (raw === "groq" || raw === "anthropic" || raw === "ollama" || raw === "keyword") {
    return raw;
  }
  // Default to groq when an API key looks present, else fall back to keyword.
  if (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes("YOUR_")) {
    return "groq";
  }
  if (isAnthropicConfigured()) {
    return "anthropic";
  }
  return "keyword";
}

export function isGraderProviderReady(provider: GraderProvider): boolean {
  switch (provider) {
    case "groq":
      return !!process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes("YOUR_");
    case "anthropic":
      return isAnthropicConfigured();
    case "ollama":
      return !!process.env.OLLAMA_URL || true; // local default works without env
    case "keyword":
      return true;
  }
}

// ---------------------------------------------------------------------------
// Adapters
// ---------------------------------------------------------------------------

async function gradeWithGroq(input: GradeFreeformInput): Promise<GradeJson | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  const model = process.env.GRADER_MODEL ?? "llama-3.3-70b-versatile";

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(input) },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`groq grader HTTP ${res.status}`);
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content ?? "";
  return parseGraderJson(text);
}

async function gradeWithAnthropic(input: GradeFreeformInput): Promise<GradeJson | null> {
  if (!isAnthropicConfigured()) return null;
  const client = getAnthropic();
  const model =
    process.env.GRADER_MODEL ?? ANTHROPIC_MODEL ?? "claude-haiku-4-7";
  const resp = await client.messages.create({
    model,
    max_tokens: 400,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(input) }],
  });
  const text = resp.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("")
    .trim();
  return parseGraderJson(text);
}

async function gradeWithOllama(input: GradeFreeformInput): Promise<GradeJson | null> {
  const base = process.env.OLLAMA_URL ?? "http://localhost:11434";
  const model = process.env.GRADER_MODEL ?? "llama3.1:8b";
  const res = await fetch(`${base.replace(/\/$/, "")}/api/generate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      system: SYSTEM_PROMPT,
      prompt: buildUserPrompt(input),
      format: "json",
      options: { temperature: 0 },
    }),
  });
  if (!res.ok) {
    throw new Error(`ollama grader HTTP ${res.status}`);
  }
  const data = (await res.json()) as { response?: string };
  return parseGraderJson(data.response ?? "");
}

/**
 * Deterministic keyword + min-words grader.
 *
 * For each rubric bullet, extract its top significant tokens (lowercased,
 * stop-words removed) and require the answer to contain at least one of
 * them. Pass iff every bullet matches and the answer is at least
 * `minWords` long.
 */
export function gradeWithKeyword(input: GradeFreeformInput): GradeJson {
  const answer = (input.answer ?? "").toLowerCase();
  const wordCount = (input.answer.match(/\b\w+\b/g) ?? []).length;
  const minWords = input.minWords ?? 0;

  const missing: string[] = [];
  for (const bullet of input.rubric) {
    if (!matchesBullet(bullet, answer)) {
      missing.push(bullet);
    }
  }

  const tooShort = wordCount < minWords;

  if (missing.length === 0 && !tooShort) {
    return {
      passed: true,
      feedback: `Heuristic grader: all ${input.rubric.length} rubric points matched (answer ${wordCount} words).`,
    };
  }

  const parts: string[] = [];
  if (tooShort) {
    parts.push(`answer is only ${wordCount} words; rubric expects at least ${minWords}.`);
  }
  if (missing.length > 0) {
    parts.push(
      `still missing: ${missing
        .map((m) => `"${m.replace(/^[\-\u2022]+\s*/, "").slice(0, 80)}"`)
        .join("; ")}`
    );
  }
  return {
    passed: false,
    feedback: `Heuristic grader (keyword fallback): ${parts.join(" ")}`,
  };
}

const STOP_WORDS = new Set([
  "the","a","an","and","or","is","are","of","on","in","to","for","with","by",
  "as","at","be","that","this","its","it","but","if","than","then","when","into",
  "from","via","one","two","three","four","each","any","all","not","no","do","does",
  "via","using","via","you","your","ours","may","also","while","over","under","between",
  "names","name","describe","explain","mention","mentions","point","points","item","items","at","least",
]);

function tokensFor(bullet: string): string[] {
  // Remove inline LaTeX `$...$` and parenthetical asides; lowercase the rest.
  const stripped = bullet
    .replace(/\$[^$]*\$/g, " ")
    .replace(/\(.*?\)/g, " ")
    .toLowerCase();
  const words = stripped.match(/[a-z][a-z\-]{2,}/g) ?? [];
  return Array.from(new Set(words.filter((w) => !STOP_WORDS.has(w)))).slice(0, 6);
}

function matchesBullet(bullet: string, answerLower: string): boolean {
  const tokens = tokensFor(bullet);
  if (tokens.length === 0) return true;
  // Require at least one significant token from the bullet to appear.
  return tokens.some((t) => answerLower.includes(t));
}

// ---------------------------------------------------------------------------
// Public entrypoint
// ---------------------------------------------------------------------------

export async function gradeFreeform(
  input: GradeFreeformInput
): Promise<GradeFreeformResult> {
  const provider = input.providerOverride ?? configuredGraderProvider();

  if (provider === "keyword") {
    const result = gradeWithKeyword(input);
    return { ...result, provider: "keyword" };
  }

  if (!isGraderProviderReady(provider)) {
    // Fail open to keyword so submissions never silently 500.
    const fallback = gradeWithKeyword(input);
    return { ...fallback, provider: "keyword" };
  }

  try {
    let json: GradeJson | null = null;
    if (provider === "groq") {
      json = await gradeWithGroq(input);
    } else if (provider === "anthropic") {
      json = await gradeWithAnthropic(input);
    } else if (provider === "ollama") {
      json = await gradeWithOllama(input);
    }

    if (json) {
      return { ...json, provider };
    }

    // Provider returned but produced unparseable JSON. Fall through to keyword.
    const fallback = gradeWithKeyword(input);
    return {
      ...fallback,
      provider: "keyword",
      feedback: `${fallback.feedback} (provider="${provider}" produced no parseable JSON)`,
    };
  } catch (err) {
    const fallback = gradeWithKeyword(input);
    return {
      ...fallback,
      provider: "keyword",
      feedback: `${fallback.feedback} (provider="${provider}" failed: ${(err as Error).message})`,
    };
  }
}
