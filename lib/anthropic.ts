import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

export function isAnthropicConfigured(): boolean {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return false;
  if (apiKey === "sk-ant-..." || apiKey.includes("YOUR_")) return false;
  return true;
}

export function getAnthropic(): Anthropic {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!isAnthropicConfigured() || !apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY in environment");
  }
  _client = new Anthropic({ apiKey });
  return _client;
}

export const ANTHROPIC_MODEL =
  process.env.ANTHROPIC_MODEL ?? "claude-opus-4-7";

export type NudgeLevel = 1 | 2 | 3;

const SYSTEM_PROMPT = `You are a Senior Quant Tutor helping a student stuck on a probability or stochastic problem.

CRITICAL RULES (never violate):
1. NEVER state the final numeric answer.
2. NEVER state any partial answer that the student could combine into the final answer with one trivial step (i.e. do not give "the numerator is 11" if the denominator is already obvious).
3. Output exactly ONE sentence. No preamble like "Hint:" or "Sure!". No code fences.
4. Speak directly to the student in second person ("you").
5. Use LaTeX inline math with $...$ for any formulas.

The student will give you the problem, their (incorrect) answer, and the requested hint level.

Hint level semantics:
- Level 1 (Conceptual): Identify the conceptual gap. Reference the relevant law (e.g. total state space, independence, conditioning) WITHOUT naming the specific theorem.
- Level 2 (Formulaic): Name the specific formula or theorem to apply (e.g. Bayes' Theorem, Law of Total Expectation), but do not compute with it.
- Level 3 (Partial Solve): Reveal ONE intermediate quantity that is clearly not the final answer (e.g. the size of the sample space, the prior, the count of favourable outcomes for ONE of several cases).
`;

export interface NudgeInput {
  level: NudgeLevel;
  questionTitle: string;
  questionPromptMd: string;
  submittedAnswer: string;
  /** Canonical answer string. Used only for the leak-scrubber, never sent to the model. */
  canonicalAnswer: string;
}

/**
 * Strip any token that looks like the canonical answer from the model output.
 * Defense-in-depth: the system prompt forbids it, but we never trust the LLM.
 */
export function scrubAnswer(text: string, canonical: string): string {
  const candidates = new Set<string>();
  const trimmed = canonical.trim();
  candidates.add(trimmed);

  const num = Number(trimmed);
  if (Number.isFinite(num)) {
    candidates.add(String(num));
    candidates.add(num.toFixed(2));
    candidates.add(num.toFixed(3));
    candidates.add(num.toFixed(4));
  }

  const frac = trimmed.match(/^(-?\d+)\/(-?\d+)$/);
  if (frac) {
    const v = parseInt(frac[1], 10) / parseInt(frac[2], 10);
    if (Number.isFinite(v)) {
      candidates.add(v.toFixed(3));
      candidates.add(v.toFixed(4));
    }
  }

  let out = text;
  for (const c of candidates) {
    if (!c) continue;
    const escaped = c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`\\b${escaped}\\b`, "g"), "[redacted]");
  }
  return out;
}

export async function generateNudge(input: NudgeInput): Promise<string> {
  const client = getAnthropic();

  const userMessage = [
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

  const resp = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 200,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = resp.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("")
    .trim();

  return scrubAnswer(text, input.canonicalAnswer);
}
