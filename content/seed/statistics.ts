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
    slug: "lln-vs-clt-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "LLN vs CLT — What Each Gives You",
    prompt_md:
      "In 4–8 sentences, explain the difference between the Law of Large Numbers (LLN) and the Central Limit Theorem (CLT).\n\nBe explicit about what converges, and at what rate.",
    solution_md:
      "LLN: sample average $\\bar X_n$ converges (typically in probability) to the mean $\\mu$ under mild conditions; it is about consistency.\n\nCLT: the centered and scaled sum (or mean) converges in distribution to a normal: $\\sqrt{n}(\\bar X_n-\\mu)/\\sigma \\Rightarrow \\mathcal{N}(0,1)$ under finite variance; it is about approximate sampling distributions and rates ($1/\\sqrt{n}$ scaling).",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["lln", "clt", "asymptotic"],
    source: "Core probability/statistics",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 60,
      rubric: [
        "Correctly states LLN as convergence of $\\bar X_n$ to $\\mu$ (type of convergence ok): 45%",
        "Correctly states CLT as distributional convergence of a standardized sum/mean to normal: 45%",
        "Mentions the $\\sqrt{n}$ rate/scaling (or $1/\\sqrt{n}$ error scale): 10%",
      ],
      reference_solution_md:
        "LLN: $\\bar X_n\\to\\mu$ (consistency). CLT: $(\\bar X_n-\\mu)/(\\sigma/\\sqrt{n})\\Rightarrow \\mathcal{N}(0,1)$ (sampling distribution + $\\sqrt{n}$ scaling).\n",
    },
  },
  {
    slug: "bootstrap-what-it-estimates-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "Bootstrap — What Is It Approximating?",
    prompt_md:
      "What does the (nonparametric) bootstrap primarily approximate?",
    solution_md:
      "It approximates the sampling distribution of a statistic by resampling from the empirical distribution of the observed data.",
    answer_kind: "mcq",
    answer_value: "sampling",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["bootstrap", "inference", "resampling"],
    source: "Classical bootstrap interpretation",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        {
          id: "sampling",
          label: "The sampling distribution of a statistic (via resampling from the empirical distribution).",
          correct: true,
        },
        { id: "prior", label: "A Bayesian prior distribution for the parameter.", correct: false },
        { id: "true-data", label: "The true data-generating distribution exactly.", correct: false },
        { id: "mle", label: "The maximum likelihood estimator in closed form.", correct: false },
      ],
    },
  },
  {
    slug: "p-value-definition-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "What Is a p-value?",
    prompt_md:
      "Define a p-value in the context of hypothesis testing.\n\nAnswer in 3–6 sentences. Include what distribution it is computed under.",
    solution_md:
      "A p-value is the probability, under the null hypothesis (i.e., under the null distribution of the test statistic), of observing a test statistic at least as extreme as the one observed. It is computed assuming $H_0$ is true and the model assumptions for the test hold.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["hypothesis-testing", "p-values", "inference"],
    source: "Interview staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 40,
      rubric: [
        "Defines p-value as a probability of 'as/extreme or more' under $H_0$: 60%",
        "Explicitly notes it is computed under the null distribution / assuming $H_0$ true: 30%",
        "Avoids incorrect interpretation as $P(H_0\\mid data)$ (not required, but penalize if asserted): 10%",
      ],
      reference_solution_md:
        "p-value = $P(T\\ge T_{obs}\\mid H_0)$ (or two-sided analog), computed under the null distribution; it is not $P(H_0\\mid data)$.\n",
    },
  },
  {
    slug: "multiple-testing-fdr-vs-fwer-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "Multiple Testing — FWER vs FDR",
    prompt_md:
      "Which statement best describes the difference between FWER and FDR control?",
    solution_md:
      "FWER controls the probability of making at least one false discovery; FDR controls the expected proportion of false discoveries among the rejected hypotheses (or equivalently the expected false discovery rate).",
    answer_kind: "mcq",
    answer_value: "fwer-vs-fdr",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["multiple-testing", "fdr", "fwer"],
    source: "Benjamini–Hochberg vs Bonferroni framing",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        {
          id: "fwer-vs-fdr",
          label:
            "FWER controls $P(\\text{at least one false positive})$; FDR controls $E[\\#FP/\\#rejections]$ (in expectation).",
          correct: true,
        },
        {
          id: "same",
          label: "They are the same notion; the terms are interchangeable.",
          correct: false,
        },
        {
          id: "variance",
          label: "FWER controls variance, while FDR controls bias.",
          correct: false,
        },
        {
          id: "bayes",
          label: "FWER is Bayesian and FDR is frequentist.",
          correct: false,
        },
      ],
    },
  },
  {
    slug: "gauss-markov-assumptions-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "Gauss–Markov — What Do You Need for BLUE?",
    prompt_md:
      "In the linear model $y=X\\beta+\\varepsilon$, which set of assumptions is sufficient for OLS to be the **best linear unbiased estimator** (BLUE)?",
    solution_md:
      "Gauss–Markov requires linear model with full column rank, exogeneity $E[\\varepsilon\\mid X]=0$, and homoskedastic uncorrelated errors $\\mathrm{Var}(\\varepsilon\\mid X)=\\sigma^2 I$. Normality is not required for BLUE (only for exact finite-sample normal inference).",
    answer_kind: "mcq",
    answer_value: "gm",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["ols", "gauss-markov", "inference"],
    source: "Econometrics staple",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        {
          id: "gm",
          label:
            "Exogeneity $E[\\varepsilon\\mid X]=0$ and $\\mathrm{Var}(\\varepsilon\\mid X)=\\sigma^2 I$ (plus full rank). No normality needed.",
          correct: true,
        },
        {
          id: "normality",
          label: "Errors must be Gaussian; otherwise OLS is biased.",
          correct: false,
        },
        {
          id: "independence",
          label: "Only independence of rows of $X$ is needed; no condition on $\\varepsilon$.",
          correct: false,
        },
        {
          id: "no-intercept",
          label: "Model must exclude an intercept term; otherwise BLUE fails.",
          correct: false,
        },
      ],
    },
  },
  {
    slug: "var-of-sample-mean-numeric",
    topic: "Statistics",
    track: "researcher",
    title: "Variance of the Sample Mean",
    prompt_md:
      "Let $X_1,\\dots,X_n$ be iid with $\\mathrm{Var}(X_i)=\\sigma^2$.\n\nWhat is $\\mathrm{Var}(\\bar X)$ where $\\bar X = \\frac{1}{n}\\sum_{i=1}^n X_i$?",
    solution_md:
      "By independence, $\\mathrm{Var}(\\bar X)=\\frac{1}{n^2}\\sum_i \\mathrm{Var}(X_i)=\\frac{n\\sigma^2}{n^2}=\\sigma^2/n$.",
    answer_kind: "exact",
    answer_value: "sigma^2/n",
    answer_tolerance: null,
    difficulty: 1,
    tags: ["variance", "linearity", "iid"],
    source: "Core fact",
    target_roles: ["All"],
  },
  {
    slug: "mle-vs-map-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "MLE vs MAP",
    prompt_md:
      "Explain the difference between maximum likelihood estimation (MLE) and maximum a posteriori estimation (MAP).\n\nIn 4–8 sentences: mention what each maximizes and what extra ingredient MAP uses.",
    solution_md:
      "MLE maximizes the likelihood $p(data\\mid \\theta)$ (equivalently log-likelihood) over parameters. MAP maximizes the posterior $p(\\theta\\mid data)\\propto p(data\\mid\\theta)p(\\theta)$, incorporating a prior $p(\\theta)$. MAP can be seen as MLE plus a regularization term from the log prior; with a flat prior, MAP reduces to MLE.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["mle", "bayes", "map"],
    source: "Bayesian vs frequentist staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 65,
      rubric: [
        "Correctly states MLE maximizes likelihood $p(data\\mid\\theta)$: 40%",
        "Correctly states MAP maximizes posterior $p(\\theta\\mid data)$: 40%",
        "Mentions the prior and the proportionality $p(\\theta\\mid data)\\propto p(data\\mid\\theta)p(\\theta)$ (or equivalent): 20%",
      ],
      reference_solution_md:
        "MLE: maximize $p(data\\mid\\theta)$. MAP: maximize $p(\\theta\\mid data)\\propto p(data\\mid\\theta)p(\\theta)$ (uses a prior). Flat prior → MAP = MLE.\n",
    },
  },
  {
    slug: "correlation-not-causation-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Correlation Is Not Causation — Give Two Reasons",
    prompt_md:
      "Give two distinct reasons why observing a correlation between variables $X$ and $Y$ does not imply $X$ causes $Y$.\n\nAnswer in 4–8 sentences.",
    solution_md:
      "Common reasons: confounding (a third variable causes both), reverse causality (Y causes X), selection bias, and coincidental correlation due to multiple testing. Without an identification strategy (randomization, instrumental variables, causal assumptions), correlation alone doesn't determine direction or mechanism.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["causality", "confounding", "inference"],
    source: "Interview staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 55,
      rubric: [
        "Provides two genuinely distinct non-causal explanations (confounding, reverse causality, selection bias, etc.): 70%",
        "Explains each briefly (not just naming): 20%",
        "Mentions identification / need for experimental or causal assumptions: 10%",
      ],
      reference_solution_md:
        "Two reasons: confounding and reverse causality (or selection bias). Correlation alone lacks an identification strategy, so you can't infer causation.\n",
    },
  },
  {
    slug: "type1-type2-errors-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "Type I vs Type II Error",
    prompt_md:
      "Which statement correctly describes Type I and Type II errors in hypothesis testing?",
    solution_md:
      "Type I error is rejecting $H_0$ when $H_0$ is true (false positive). Type II error is failing to reject $H_0$ when $H_1$ is true (false negative).",
    answer_kind: "mcq",
    answer_value: "fp-fn",
    answer_tolerance: null,
    difficulty: 1,
    tags: ["hypothesis-testing", "inference"],
    source: "Core definition",
    target_roles: ["All"],
    answer_meta: {
      options: [
        { id: "fp-fn", label: "Type I = false positive; Type II = false negative.", correct: true },
        { id: "swap", label: "Type I = false negative; Type II = false positive.", correct: false },
        { id: "bayes", label: "Type I/II errors are Bayesian posterior probabilities.", correct: false },
        { id: "only-ci", label: "Type I/II errors only apply to confidence intervals, not tests.", correct: false },
      ],
    },
  },
  {
    slug: "power-definition-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Power — Definition and Intuition",
    prompt_md:
      "Define the power of a hypothesis test.\n\nIn 3–6 sentences, mention what it is a probability of and what typically increases power.",
    solution_md:
      "Power is $P(\\text{reject }H_0\\mid H_1\\text{ true})=1-\\beta$ where $\\beta$ is Type II error. Power increases with larger sample size, larger effect size, lower noise, and higher significance level (though higher alpha increases false positives).",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["hypothesis-testing", "power"],
    source: "Core concept",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 45,
      rubric: [
        "Defines power as $P(\\text{reject }H_0\\mid H_1)$ or $1-\\beta$: 65%",
        "Gives at least two factors that increase power (n, effect size, noise, alpha): 35%",
      ],
      reference_solution_md:
        "Power = $P(\\text{reject }H_0\\mid H_1)=1-\\beta$. Increases with larger $n$, larger effect, lower variance; larger $\\alpha$ also increases power.\n",
    },
  },
  {
    slug: "omitted-variable-bias-intuition-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Omitted Variable Bias — Intuition",
    prompt_md:
      "Explain omitted variable bias in linear regression in 5–10 sentences.\n\nWhen does omitting a variable $Z$ bias the estimated coefficient on $X$ in a regression of $Y$ on $X$?",
    solution_md:
      "Omitted variable bias occurs when the omitted variable affects the outcome and is correlated with an included regressor. If $Z$ both influences $Y$ and is correlated with $X$, then $X$ partially picks up $Z$'s effect, biasing the coefficient. If either $Z$ has no effect on $Y$ (conditional on X) or $Z$ is uncorrelated with $X$, omission does not bias the coefficient on $X$ (though it may increase variance).",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["ols", "bias", "causality"],
    source: "Econometrics staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 90,
      rubric: [
        "States the two required conditions: omitted variable affects $Y$ and is correlated with included regressor $X$: 70%",
        "Explains the mechanism (X picks up Z’s effect via correlation): 20%",
        "Mentions one 'no bias' case (no effect or no correlation): 10%",
      ],
      reference_solution_md:
        "Bias if omitted $Z$ affects $Y$ and $\\mathrm{Cov}(X,Z)\\ne 0$. Otherwise omission doesn't bias the coefficient on $X$.\n",
    },
  },
  {
    slug: "likelihood-vs-probability-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Likelihood vs Probability",
    prompt_md:
      "In 4–8 sentences, explain the difference between a probability and a likelihood.\n\nInclude a simple example, e.g. coin flips with parameter $p$.",
    solution_md:
      "A probability treats parameters as fixed and quantifies uncertainty about random outcomes. A likelihood treats observed data as fixed and views the parameter as the variable, measuring how compatible each parameter value is with the observed data.\n\nExample: for one flip with result H, $P(H\\mid p)=p$ is a probability as a function of outcome given parameter; the likelihood is $L(p\\mid H)=p$ as a function of $p$ given the observed H. Likelihoods need not integrate to 1 over $p$.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["mle", "likelihood", "bayes"],
    source: "Core conceptual",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 70,
      rubric: [
        "States the key viewpoint swap: probability over outcomes vs likelihood over parameters given data: 65%",
        "Provides a concrete example (coin / Bernoulli) illustrating the same algebra but different interpretation: 25%",
        "Notes that likelihood doesn't integrate to 1 over parameters (or equivalent): 10%",
      ],
      reference_solution_md:
        "Probability: distribution of data given fixed parameter. Likelihood: function of parameter given fixed observed data; not a probability distribution over the parameter.\n",
    },
  },
  {
    slug: "mle-normal-mean-known-variance",
    topic: "Statistics",
    track: "researcher",
    title: "MLE of Normal Mean (Known Variance)",
    prompt_md:
      "Let $X_1,\\dots,X_n$ be iid $\\mathcal{N}(\\mu,\\sigma^2)$ with **known** $\\sigma^2$.\n\nDerive the MLE for $\\mu$.",
    solution_md:
      "Log-likelihood is proportional to $-\\frac{1}{2\\sigma^2}\\sum_i (x_i-\\mu)^2$. Minimizing the sum of squares gives $\\hat\\mu=\\bar X$.",
    answer_kind: "exact",
    answer_value: "Xbar",
    answer_tolerance: null,
    difficulty: 1,
    tags: ["mle", "normal", "estimation"],
    source: "Core fact",
    target_roles: ["Researcher"],
  },
  {
    slug: "ols-heteroskedasticity-why-matters-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Heteroskedasticity — What Breaks?",
    prompt_md:
      "In OLS regression, what goes wrong if errors are heteroskedastic (variance depends on $X$)?\n\nIn 5–10 sentences: discuss unbiasedness vs standard errors/inference, and one fix.",
    solution_md:
      "With exogeneity, OLS coefficients remain unbiased/consistent, but the usual homoskedastic standard error formula is wrong, so $t$-tests and confidence intervals are invalid. Fixes include using heteroskedasticity-robust (White) standard errors, modeling the variance, or using WLS/GLS when structure is known.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["ols", "inference", "heteroskedasticity"],
    source: "Econometrics staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 85,
      rubric: [
        "States coefficients can stay unbiased/consistent under exogeneity: 35%",
        "States standard errors/inference break under naive homoskedastic SEs: 45%",
        "Gives a concrete fix (robust SE, WLS/GLS): 20%",
      ],
      reference_solution_md:
        "Under exogeneity, OLS coefficients can be unbiased/consistent, but homoskedastic SE formula fails → invalid inference. Fix: robust (White) SEs, or WLS/GLS.\n",
    },
  },
  {
    slug: "bessel-correction-intuition-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Bessel's Correction — Intuition",
    prompt_md:
      "Give an intuition for why dividing by $n-1$ (instead of $n$) corrects bias in the sample variance.\n\nAnswer in 4–8 sentences.",
    solution_md:
      "The sample mean is estimated from the same data, so residuals $X_i-\\bar X$ are constrained to sum to 0, reducing their degrees of freedom by one. This makes the naive average squared residual (dividing by $n$) systematically too small. Dividing by $n-1$ inflates it to make the estimator unbiased under iid sampling.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["variance", "degrees-of-freedom", "unbiasedness"],
    source: "Classical stats",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 60,
      rubric: [
        "Mentions the constraint / one degree of freedom used to estimate mean: 55%",
        "Explains why this makes the naive variance biased downward: 25%",
        "States that dividing by $n-1$ corrects the bias: 20%",
      ],
      reference_solution_md:
        "Because estimating $\\bar X$ uses one degree of freedom and forces residuals to sum to zero, the average squared residual divided by $n$ is biased low; dividing by $n-1$ corrects it.\n",
    },
  },
  {
    slug: "variance-of-sum-independent-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Variance of a Sum (Independent Case)",
    prompt_md:
      "Let $X$ and $Y$ be independent with variances $\\sigma_X^2$ and $\\sigma_Y^2$.\n\nCompute $\\mathrm{Var}(X+Y)$ and briefly justify.",
    solution_md:
      "For independent variables, covariance is zero, so\n\n$$\\mathrm{Var}(X+Y)=\\mathrm{Var}(X)+\\mathrm{Var}(Y)=\\sigma_X^2+\\sigma_Y^2.$$",
    answer_kind: "freeform",
    difficulty: 1,
    tags: ["variance", "independence", "covariance"],
    source: "Core identity",
    target_roles: ["All"],
    answer_meta: {
      min_words: 35,
      rubric: [
        "States $\\mathrm{Var}(X+Y)=\\mathrm{Var}(X)+\\mathrm{Var}(Y)$ under independence: 75%",
        "Justifies via covariance term being 0 (or equivalent): 25%",
      ],
      reference_solution_md:
        "$$\\mathrm{Var}(X+Y)=\\mathrm{Var}(X)+\\mathrm{Var}(Y)+2\\mathrm{Cov}(X,Y)=\\sigma_X^2+\\sigma_Y^2$$ since $\\mathrm{Cov}=0$ under independence.\n",
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
