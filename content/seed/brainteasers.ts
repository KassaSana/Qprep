import type { SeedQuestion } from "@/content/question-types";

/**
 * Brainteasers — quick mental-math, theorem recall, and EV-style puzzles
 * that don't quite fit a more rigorous topic. Migrated from the v1 trader
 * mental-math set plus the Secretary Problem theorem-recall question.
 */
export const BRAINTEASERS_SEED: SeedQuestion[] = [
  {
    slug: "secretary-named-theorem",
    topic: "Brainteasers",
    track: "researcher",
    title: "Theorem Recognition — Optimal Stopping",
    prompt_md:
      "An interviewer faces $n$ candidates one at a time, in random order, and must immediately accept or reject each. The asymptotic optimal strategy rejects the first $\\lfloor n/e \\rfloor$ candidates and accepts the next who is best so far. By what name is this problem most commonly known? (Answer with two words.)",
    solution_md: "This is the Secretary Problem.",
    answer_kind: "exact",
    answer_value: "secretary problem",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["theorem-recall", "optimal-stopping"],
    companies: ["Jane Street"],
    source: "Classic",
  },
  {
    slug: "coin-game-advantage",
    topic: "Brainteasers",
    track: "trader",
    title: "Biased Coin EV",
    prompt_md:
      "You pay $5$ dollars to play a game. A biased coin lands heads with probability $0.55$. If heads, you receive $12$ dollars; if tails, you receive $0$. What is your expected profit per play?",
    solution_md:
      "Expected payout is $0.55 \\cdot 12 = 6.6$. Subtract the $5$ entry cost to get expected profit $1.6$.",
    answer_kind: "numeric",
    answer_value: "1.6",
    answer_tolerance: 1e-3,
    difficulty: 1,
    tags: ["ev", "probability", "mental-math"],
    source: "Classic trader warm-up",
  },
  {
    slug: "mental-math-eight-percent-of-250",
    topic: "Brainteasers",
    track: "trader",
    title: "Mental Math: 8% of 250",
    prompt_md:
      "Without a calculator, compute $8\\%$ of $250$.",
    solution_md:
      "$10\\%$ of $250$ is $25$, and $8\\%$ is $0.8$ of that, so the answer is $20$.",
    answer_kind: "numeric",
    answer_value: "20",
    answer_tolerance: 1e-9,
    difficulty: 1,
    tags: ["mental-math", "percentages"],
    source: "Trader screening",
  },
  {
    slug: "mental-math-1-point-5-percent-of-640",
    topic: "Brainteasers",
    track: "trader",
    title: "Mental Math: 1.5% of 640",
    prompt_md:
      "Without a calculator, compute $1.5\\%$ of $640$.",
    solution_md:
      "$1\\%$ of $640$ is $6.4$, and $0.5\\%$ is $3.2$, so total is $9.6$.",
    answer_kind: "numeric",
    answer_value: "9.6",
    answer_tolerance: 1e-3,
    difficulty: 1,
    tags: ["mental-math", "percentages"],
    source: "Trader screening",
  },
];
