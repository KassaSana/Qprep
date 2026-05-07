import type { SeedQuestion } from "@/content/question-types";

/**
 * Finance — the trader bank, plus one new MCQ on options Greeks.
 * Mental math, EV, market-making intuition, options payoff arithmetic.
 */
export const FINANCE_SEED: SeedQuestion[] = [
  {
    slug: "break-even-win-rate-even-loss",
    topic: "Finance",
    track: "trader",
    title: "Break-Even Win Rate",
    prompt_md:
      "A strategy makes $+2$ units when it wins and loses $-1$ unit when it loses. What win probability $p$ makes the strategy break even?",
    solution_md:
      "Set expected value to zero: $2p - 1(1-p) = 0$. Then $3p = 1$, so $p = 1/3$.",
    answer_kind: "fraction",
    answer_value: "1/3",
    answer_tolerance: 1e-3,
    difficulty: 1,
    tags: ["ev", "risk-reward", "mental-math"],
    companies: ["Optiver", "SIG"],
    source: "Classic trader warm-up",
  },
  {
    slug: "mid-from-bid-ask",
    topic: "Finance",
    track: "trader",
    title: "Compute the Mid",
    prompt_md:
      "A stock is quoted $99.80$ bid and $100.20$ ask. What is the mid price?",
    solution_md:
      "The mid is the average of bid and ask: $(99.80 + 100.20)/2 = 100.00$.",
    answer_kind: "numeric",
    answer_value: "100",
    answer_tolerance: 1e-6,
    difficulty: 1,
    tags: ["market-making", "spread", "mental-math"],
    source: "Desk arithmetic",
  },
  {
    slug: "edge-after-spread",
    topic: "Finance",
    track: "trader",
    title: "Expected Edge After Half-Spread",
    prompt_md:
      "You buy at the bid and expect the fair value to be $0.06$ above the mid one second later. The quoted spread is $0.10$. Ignoring inventory and adverse selection, what is your expected edge per share after paying half the spread to enter?",
    solution_md:
      "Crossing from the bid to the mid costs half the spread, $0.05$. Expected move in your favor is $0.06$, so edge is $0.06 - 0.05 = 0.01$ dollars per share.",
    answer_kind: "numeric",
    answer_value: "0.01",
    answer_tolerance: 1e-4,
    difficulty: 2,
    tags: ["market-making", "spread", "ev"],
    companies: ["Citadel Securities", "Optiver"],
    source: "Interview-style market intuition",
  },
  {
    slug: "expected-fill-value",
    topic: "Finance",
    track: "trader",
    title: "Expected Fill Value",
    prompt_md:
      "A passive buy order earns $0.03$ dollars if filled and the price reverts, loses $0.09$ dollars if filled and the price keeps moving against you, and earns $0$ if unfilled. If the order is filled $40\\%$ of the time, and conditional on a fill it reverts with probability $0.7$, what is the unconditional expected value of the order?",
    solution_md:
      "Conditional on a fill, EV is $0.7 \\cdot 0.03 + 0.3 \\cdot (-0.09) = 0.021 - 0.027 = -0.006$. Unconditional EV multiplies by fill probability $0.4$, so $-0.0024$ dollars.",
    answer_kind: "numeric",
    answer_value: "-0.0024",
    answer_tolerance: 1e-4,
    difficulty: 3,
    tags: ["market-making", "fill-probability", "ev"],
    companies: ["Citadel Securities"],
    source: "Execution intuition",
  },
  {
    slug: "call-option-payoff",
    topic: "Finance",
    track: "trader",
    title: "Call Payoff at Expiry",
    prompt_md:
      "You own one European call option with strike $100$. At expiry the stock is at $108$. Ignoring premium paid, what is the option payoff?",
    solution_md:
      "A call payoff is $\\max(S-K, 0) = \\max(108-100, 0) = 8$.",
    answer_kind: "numeric",
    answer_value: "8",
    answer_tolerance: 1e-9,
    difficulty: 1,
    tags: ["options", "payoff"],
    companies: ["Optiver"],
    source: "Trader basics",
  },
  {
    slug: "put-option-payoff",
    topic: "Finance",
    track: "trader",
    title: "Put Payoff at Expiry",
    prompt_md:
      "You own one European put option with strike $50$. At expiry the stock is at $44$. Ignoring premium paid, what is the option payoff?",
    solution_md:
      "A put payoff is $\\max(K-S, 0) = \\max(50-44, 0) = 6$.",
    answer_kind: "numeric",
    answer_value: "6",
    answer_tolerance: 1e-9,
    difficulty: 1,
    tags: ["options", "payoff"],
    source: "Trader basics",
  },
  {
    slug: "inventory-weighted-mid",
    topic: "Finance",
    track: "trader",
    title: "Inventory-Weighted Decision",
    prompt_md:
      "You hold a long inventory and estimate a $45\\%$ chance the next move is up by $0.20$ and a $55\\%$ chance it is down by $0.10$. What is the expected next price change?",
    solution_md:
      "Expected change is $0.45 \\cdot 0.20 + 0.55 \\cdot (-0.10) = 0.09 - 0.055 = 0.035$.",
    answer_kind: "numeric",
    answer_value: "0.035",
    answer_tolerance: 1e-4,
    difficulty: 2,
    tags: ["ev", "inventory", "market-making"],
    source: "Trading intuition",
  },
  {
    slug: "spread-in-bps",
    topic: "Finance",
    track: "trader",
    title: "Spread in Basis Points",
    prompt_md:
      "A stock is quoted $49.90$ bid and $50.10$ ask. What is the quoted spread in basis points relative to the mid? Round to 1 decimal place.",
    solution_md:
      "Spread is $0.20$ and mid is $50.00$. Relative spread is $0.20/50 = 0.004 = 0.4\\% = 40.0$ basis points.",
    answer_kind: "numeric",
    answer_value: "40",
    answer_tolerance: 0.2,
    difficulty: 2,
    tags: ["spread", "bps", "mental-math"],
    source: "Desk arithmetic",
  },
  {
    slug: "delta-of-call-mcq",
    topic: "Finance",
    title: "Delta of an At-the-Money Call",
    prompt_md:
      "Under standard Black–Scholes assumptions on a non-dividend stock, which of the following is the closest to the delta of a European call option that is at the money and has a moderate amount of time to expiry?",
    solution_md:
      "Delta of a European call is $N(d_1)$, which is roughly $0.5$ for an at-the-money option (and exactly $0.5$ in the limit as $T \\to 0$ ignoring drift). It approaches $1$ deep in the money and $0$ deep out of the money.",
    answer_kind: "mcq",
    answer_value: "half",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["options", "greeks", "theorem-recall"],
    companies: ["Optiver", "SIG"],
    source: "Options interview MCQ",
    answer_meta: {
      options: [
        { id: "zero", label: "$0$ — calls have no directional sensitivity", correct: false },
        {
          id: "half",
          label: "About $0.5$",
          correct: true,
        },
        { id: "one", label: "$1$ — every call moves dollar-for-dollar with the stock", correct: false },
        {
          id: "negative",
          label: "Negative — calls lose value when the stock rises",
          correct: false,
        },
      ],
    },
  },
];
