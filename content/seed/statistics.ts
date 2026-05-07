import type { SeedQuestion } from "@/content/question-types";

/**
 * Statistics — distributions, moments, order statistics, and basic
 * estimators. Migrated from the v1 researcher bank along with one new
 * MCQ on the Central Limit Theorem.
 */
export const STATISTICS_SEED: SeedQuestion[] = [
  {
    slug: "variance-binomial-100-half",
    topic: "Statistics",
    track: "researcher",
    title: "Variance of Binomial(100, 1/2)",
    prompt_md:
      "Let $X \\sim \\text{Binomial}(n=100, p=1/2)$. Compute $\\mathrm{Var}(X)$.",
    solution_md: "$\\mathrm{Var}(X) = np(1-p) = 100 \\cdot 1/2 \\cdot 1/2 = 25$.",
    answer_kind: "numeric",
    answer_value: "25",
    answer_tolerance: 1e-9,
    difficulty: 1,
    tags: ["variance", "binomial"],
    source: "Textbook",
  },
  {
    slug: "ev-uniform-zero-one-square",
    topic: "Statistics",
    track: "researcher",
    title: "$E[U^2]$ for Uniform(0,1)",
    prompt_md:
      "Let $U \\sim \\text{Uniform}(0, 1)$. Compute $E[U^2]$.",
    solution_md: "$E[U^2] = \\int_0^1 u^2 \\, du = 1/3$.",
    answer_kind: "fraction",
    answer_value: "1/3",
    answer_tolerance: 1e-3,
    difficulty: 1,
    tags: ["uniform", "integration"],
    source: "Textbook",
  },
  {
    slug: "ev-min-two-uniforms",
    topic: "Statistics",
    track: "researcher",
    title: "$E[\\min(U_1, U_2)]$",
    prompt_md:
      "Let $U_1, U_2$ be independent $\\text{Uniform}(0, 1)$ random variables. Compute $E[\\min(U_1, U_2)]$.",
    solution_md:
      "$P(\\min > t) = (1-t)^2$, so $E[\\min] = \\int_0^1 (1-t)^2 \\, dt = 1/3$.",
    answer_kind: "fraction",
    answer_value: "1/3",
    answer_tolerance: 1e-3,
    difficulty: 2,
    tags: ["order-statistics", "uniform"],
    companies: ["D. E. Shaw"],
    source: "Textbook",
  },
  {
    slug: "clt-distribution-mcq",
    topic: "Statistics",
    title: "Central Limit Theorem — Limit Distribution",
    prompt_md:
      "Let $X_1, X_2, \\ldots$ be iid with finite mean $\\mu$ and finite positive variance $\\sigma^2$. Let $S_n = \\sum_{i=1}^n X_i$. Which of the following describes the limiting distribution of $\\dfrac{S_n - n\\mu}{\\sigma\\sqrt{n}}$ as $n \\to \\infty$?",
    solution_md:
      "The Central Limit Theorem says the standardized partial sum converges in distribution to a standard normal $\\mathcal{N}(0, 1)$, regardless of the shape of the underlying distribution as long as the mean and variance are finite.",
    answer_kind: "mcq",
    answer_value: "normal",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["clt", "asymptotic", "theorem-recall"],
    companies: ["Two Sigma"],
    source: "Textbook MCQ",
    answer_meta: {
      options: [
        { id: "uniform", label: "Uniform on $(-1, 1)$", correct: false },
        {
          id: "normal",
          label: "Standard normal $\\mathcal{N}(0, 1)$",
          correct: true,
        },
        {
          id: "same",
          label: "The same distribution as the $X_i$",
          correct: false,
        },
        {
          id: "exponential",
          label: "Exponential with rate $1$",
          correct: false,
        },
      ],
    },
  },
];
