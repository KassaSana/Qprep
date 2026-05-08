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
  {
    slug: "mle-bernoulli-derivation-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "MLE for Bernoulli($p$)",
    prompt_md:
      "Let $X_1,\\dots,X_n$ be iid Bernoulli($p$). Derive the maximum likelihood estimator $\\hat p$.\n\nYour answer should show the log-likelihood and the maximizer.",
    solution_md:
      "Likelihood: $L(p)=\\prod_i p^{x_i}(1-p)^{1-x_i}$. Log-likelihood: $\\ell(p)=\\sum_i x_i\\log p + (n-\\sum_i x_i)\\log(1-p)$. Differentiate and set to zero:\n\n$$\\ell'(p)=\\frac{\\sum x_i}{p} - \\frac{n-\\sum x_i}{1-p}=0 \\Rightarrow \\hat p = \\frac{1}{n}\\sum_{i=1}^n X_i.$$\n",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["mle", "bernoulli", "estimation"],
    source: "Textbook / interview staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 40,
      rubric: [
        "Writes the (log-)likelihood for Bernoulli sample correctly: 40%",
        "Differentiates and solves the first-order condition: 40%",
        "States the final MLE $\\hat p=\\bar X$: 20%",
      ],
      reference_solution_md:
        "$$\\ell(p)=\\sum_i x_i\\log p + (n-\\sum_i x_i)\\log(1-p),\\quad \\ell'(p)=\\frac{\\sum x_i}{p}-\\frac{n-\\sum x_i}{1-p}=0\\Rightarrow \\hat p=\\bar X.$$",
    },
  },
  {
    slug: "unbiased-sample-variance-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "Why Divide by $n-1$?",
    prompt_md:
      "You compute sample variance from iid observations. Why does the unbiased estimator divide by $n-1$ instead of $n$?",
    solution_md:
      "Because the sample mean is estimated from the same data, costing one degree of freedom; using $n-1$ corrects the bias so $E[S^2]=\\sigma^2$.",
    answer_kind: "mcq",
    answer_value: "dof",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["unbiasedness", "variance", "degrees-of-freedom"],
    source: "Classical stats",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        {
          id: "dof",
          label:
            "Estimating the mean uses one degree of freedom; dividing by $n-1$ corrects bias.",
          correct: true,
        },
        {
          id: "clt",
          label: "The CLT requires $n-1$ for asymptotic normality.",
          correct: false,
        },
        {
          id: "robust",
          label: "It makes the estimator more robust to outliers.",
          correct: false,
        },
        {
          id: "consistency",
          label: "Dividing by $n$ is inconsistent but $n-1$ is consistent.",
          correct: false,
        },
      ],
    },
  },
  {
    slug: "ols-normal-equations-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "OLS — Normal Equations",
    prompt_md:
      "Let $X\\in\\mathbb{R}^{n\\times d}$ and $y\\in\\mathbb{R}^n$. Consider ordinary least squares:\n\n$$\\hat\\beta = \\arg\\min_\\beta \\|y - X\\beta\\|_2^2.$$\n\nDerive the normal equations and the closed-form solution (assume $X^\\top X$ is invertible).",
    solution_md:
      "Objective: $(y-X\\beta)^\\top (y-X\\beta)$. Differentiate: $-2X^\\top(y-X\\beta)=0$ giving the normal equations $X^\\top X\\hat\\beta = X^\\top y$. If $X^\\top X$ invertible, $\\hat\\beta=(X^\\top X)^{-1}X^\\top y$.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["ols", "linear-algebra", "derivation"],
    source: "Linear regression staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 50,
      rubric: [
        "Derives the normal equations $X^\\top X\\hat\\beta = X^\\top y$: 55%",
        "Gives the closed-form solution $(X^\\top X)^{-1}X^\\top y$ under invertibility: 35%",
        "Mentions the invertibility / full-rank condition or equivalent: 10%",
      ],
      reference_solution_md:
        "Differentiate $\\|y-X\\beta\\|^2$ to get $-2X^\\top(y-X\\beta)=0\\Rightarrow X^\\top X\\hat\\beta=X^\\top y$, so $\\hat\\beta=(X^\\top X)^{-1}X^\\top y$ when invertible.\n",
    },
  },
  {
    slug: "ci-mean-known-variance-numeric",
    topic: "Statistics",
    track: "researcher",
    title: "95% CI for Mean (Known Variance)",
    prompt_md:
      "You observe $n=100$ iid samples from a distribution with **known** standard deviation $\\sigma=2$. The sample mean is $\\bar X=10$.\n\nAssuming a normal approximation, what is a **95% confidence interval** for the mean $\\mu$? Use $1.96$ for the $z$-critical value.\n\nAnswer as `lower, upper` (two numbers).",
    solution_md:
      "Standard error is $\\sigma/\\sqrt{n}=2/10=0.2$. 95% CI: $\\bar X \\pm 1.96\\cdot 0.2 = 10 \\pm 0.392$, i.e. $(9.608, 10.392)$.",
    answer_kind: "exact",
    answer_value: "9.608, 10.392",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["confidence-interval", "normal-approx"],
    source: "Classical inference",
    target_roles: ["Researcher"],
  },
  {
    slug: "delta-method-statement-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Delta Method — Statement",
    prompt_md:
      "State the (one-dimensional) delta method.\n\nSpecifically: if $\\sqrt{n}(\\hat\\theta-\\theta) \\Rightarrow \\mathcal{N}(0,\\sigma^2)$ and $g$ is differentiable at $\\theta$, what is the asymptotic distribution of $\\sqrt{n}(g(\\hat\\theta)-g(\\theta))$?",
    solution_md:
      "Delta method: linearize $g$ at $\\theta$. Then\n\n$$\\sqrt{n}(g(\\hat\\theta)-g(\\theta)) \\Rightarrow \\mathcal{N}(0, (g'(\\theta))^2\\sigma^2).$$\n",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["asymptotic", "delta-method", "theorem-recall"],
    source: "Asymptotic statistics staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 25,
      rubric: [
        "States the asymptotic normal limit for $g(\\hat\\theta)$ with variance scaled by $(g'(\\theta))^2$: 80%",
        "Mentions the differentiability / first-order Taylor expansion intuition: 20%",
      ],
      reference_solution_md:
        "$$\\sqrt{n}(g(\\hat\\theta)-g(\\theta))\\Rightarrow \\mathcal{N}(0,(g'(\\theta))^2\\sigma^2).$$",
    },
  },
  {
    slug: "clt-does-not-mean-normal-sample-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "Common CLT Misinterpretation",
    prompt_md:
      "Which statement is **always** true under the classic CLT assumptions (iid, finite mean/variance)?",
    solution_md:
      "The standardized sum converges in distribution to $\\mathcal{N}(0,1)$; it does not imply the sample itself becomes normal, nor does it guarantee good finite-$n$ approximation without conditions.",
    answer_kind: "mcq",
    answer_value: "standardized",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["clt", "asymptotic", "pitfalls"],
    source: "Interview pitfall",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        {
          id: "standardized",
          label:
            "The standardized sum $(S_n-n\\mu)/(\\sigma\\sqrt{n})$ converges in distribution to $\\mathcal{N}(0,1)$.",
          correct: true,
        },
        {
          id: "sample-normal",
          label: "The $X_i$ become approximately normal for large $n$.",
          correct: false,
        },
        {
          id: "always-accurate",
          label: "Normal approximation is accurate for any finite $n$ once $n>30$.",
          correct: false,
        },
        {
          id: "tails",
          label: "Heavy tails never matter as long as the mean exists.",
          correct: false,
        },
      ],
    },
  },
];
