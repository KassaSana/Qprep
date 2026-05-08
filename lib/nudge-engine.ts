/**
 * Provider-agnostic nudge (hint) generator.
 *
 * Mirrors the multi-provider structure of `lib/grade-freeform.ts` so we can
 * switch away from expensive defaults as traffic grows.
 *
 * Providers:
 * - groq      (OpenAI-compatible chat completions)
 * - anthropic (Claude)
 * - ollama    (local)
 * - keyword   (deterministic fallback; no network)
 */
import {
  ANTHROPIC_MODEL,
  getAnthropic,
  isAnthropicConfigured,
  scrubAnswer,
  type NudgeInput,
  type NudgeLevel,
} from "@/lib/anthropic";

export type NudgeProvider = "groq" | "anthropic" | "ollama" | "keyword";

export interface GenerateNudgeInput extends NudgeInput {
  // NudgeInput already has: level, questionTitle, questionPromptMd, submittedAnswer, canonicalAnswer
}

const SYSTEM_PROMPT = `You are a Senior Quant Tutor helping a student stuck on an interview problem.

CRITICAL RULES (never violate):
1. NEVER state the final numeric answer.
2. NEVER state any partial answer that the student could combine into the final answer with one trivial step.
3. Output exactly ONE sentence. No preamble like "Hint:" or "Sure!". No code fences.
4. Speak directly to the student in second person ("you").
5. Use LaTeX inline math with $...$ for any formulas.

Hint level semantics:
- Level 1 (Conceptual): Identify the conceptual gap; reference the relevant law/idea without doing arithmetic.
- Level 2 (Formulaic): Name the specific formula/theorem to apply, but do not compute with it.
- Level 3 (Partial Solve): Reveal ONE intermediate quantity that is clearly not the final answer.`;

function buildUserMessage(input: GenerateNudgeInput): string {
  return [
    `Hint level: ${input.level}`,
    "",
    `Problem title: ${input.questionTitle}`,
    "",
    "Problem statement:",
    input.questionPromptMd,
    "",
    `Student's incorrect answer: ${input.submittedAnswer}`,
    "",
    "Write the hint now. One sentence. Never reveal the final answer.",
  ].join("\n");
}

export function configuredNudgeProvider(): NudgeProvider {
  const raw = (process.env.NUDGE_PROVIDER ?? "").toLowerCase().trim();
  if (raw === "groq" || raw === "anthropic" || raw === "ollama" || raw === "keyword") {
    return raw;
  }
  // Default: prefer groq when key present, else anthropic if configured, else keyword.
  if (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes("YOUR_")) {
    return "groq";
  }
  if (isAnthropicConfigured()) return "anthropic";
  return "keyword";
}

export function isNudgeProviderReady(provider: NudgeProvider): boolean {
  switch (provider) {
    case "groq":
      return !!process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes("YOUR_");
    case "anthropic":
      return isAnthropicConfigured();
    case "ollama":
      return !!process.env.OLLAMA_URL || true;
    case "keyword":
      return true;
  }
}

function keywordNudge(level: NudgeLevel): string {
  if (level === 1) return "Identify what random variable/event you're computing, then choose the single law that lets you break it into simpler cases.";
  if (level === 2) return "Write the exact governing formula first (e.g., conditioning / Bayes / total expectation), then plug in the quantities from the prompt.";
  return "Compute one clean intermediate quantity (sample-space size, a conditional probability, or a one-step recurrence) before you attempt the final combination.";
}

async function nudgeWithGroq(input: GenerateNudgeInput): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  const model = process.env.NUDGE_MODEL ?? "llama-3.3-70b-versatile";
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserMessage(input) },
      ],
    }),
  });
  if (!res.ok) throw new Error(`groq nudge HTTP ${res.status}`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = data.choices?.[0]?.message?.content ?? "";
  return text.trim();
}

async function nudgeWithAnthropic(input: GenerateNudgeInput): Promise<string | null> {
  if (!isAnthropicConfigured()) return null;
  const client = getAnthropic();
  const model = process.env.NUDGE_MODEL ?? ANTHROPIC_MODEL ?? "claude-haiku-4-7";
  const resp = await client.messages.create({
    model,
    max_tokens: 200,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserMessage(input) }],
  });
  const text = resp.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim();
  return text;
}

async function nudgeWithOllama(input: GenerateNudgeInput): Promise<string | null> {
  const base = process.env.OLLAMA_URL ?? "http://localhost:11434";
  const model = process.env.NUDGE_MODEL ?? "llama3.1:8b";
  const res = await fetch(`${base.replace(/\/$/, "")}/api/generate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      system: SYSTEM_PROMPT,
      prompt: buildUserMessage(input),
      options: { temperature: 0.2 },
    }),
  });
  if (!res.ok) throw new Error(`ollama nudge HTTP ${res.status}`);
  const data = (await res.json()) as { response?: string };
  return (data.response ?? "").trim();
}

export async function generateNudgeMultiProvider(
  input: GenerateNudgeInput
): Promise<{ hint: string; provider: NudgeProvider }> {
  const provider = configuredNudgeProvider();

  if (provider === "keyword" || !isNudgeProviderReady(provider)) {
    return { hint: scrubAnswer(keywordNudge(input.level), input.canonicalAnswer), provider: "keyword" };
  }

  try {
    let raw: string | null = null;
    if (provider === "groq") raw = await nudgeWithGroq(input);
    else if (provider === "anthropic") raw = await nudgeWithAnthropic(input);
    else if (provider === "ollama") raw = await nudgeWithOllama(input);

    const cleaned = scrubAnswer((raw ?? "").trim(), input.canonicalAnswer).trim();
    if (cleaned) return { hint: cleaned, provider };

    // Provider returned nothing usable -> keyword fallback.
    return {
      hint: scrubAnswer(keywordNudge(input.level), input.canonicalAnswer),
      provider: "keyword",
    };
  } catch (err) {
    return {
      hint: scrubAnswer(keywordNudge(input.level), input.canonicalAnswer),
      provider: "keyword",
    };
  }
}

