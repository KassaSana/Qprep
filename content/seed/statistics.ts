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
    slug: "hypothesis-test-vs-confidence-interval-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Tests vs Confidence Intervals",
    prompt_md:
      "Explain the relationship between a two-sided hypothesis test at significance level $\\alpha$ and a $(1-\\alpha)$ confidence interval.\n\nAnswer in 4–8 sentences.",
    solution_md:
      "For many standard problems, the two-sided test at level $\\alpha$ rejects $H_0: \\theta=\\theta_0$ iff $\\theta_0$ lies outside the $(1-\\alpha)$ confidence interval for $\\theta$. This equivalence comes from inverting the test: the confidence set is the set of parameter values not rejected by the corresponding level-$\\alpha$ tests.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["inference", "confidence-interval", "hypothesis-testing"],
    source: "Core inference equivalence",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 70,
      rubric: [
        "States the reject/outside-CI equivalence for two-sided tests: 70%",
        "Mentions test inversion / CI as non-rejected parameter values: 30%",
      ],
      reference_solution_md:
        "Two-sided level-$\\alpha$ test rejects $\\theta_0$ iff $\\theta_0$ is outside the $(1-\\alpha)$ CI. CI can be seen as inverting the family of tests.\n",
    },
  },
  {
    slug: "likelihood-ratio-test-intuition-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Likelihood Ratio Test — Intuition",
    prompt_md:
      "In 4–8 sentences, explain the intuition of the likelihood ratio test (LRT).\n\nWhat are you comparing, and why does it make sense?",
    solution_md:
      "The LRT compares how well the data can be fit under the null-constrained model versus the unrestricted alternative model, via the ratio of their maximized likelihoods. If the null model cannot achieve a likelihood close to the best achievable likelihood, the data provides evidence against $H_0$. Asymptotically, under regularity conditions, $-2\\log\\Lambda$ has a chi-square distribution with degrees of freedom equal to the constraint difference (Wilks' theorem).",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["hypothesis-testing", "mle", "lrt"],
    source: "Wilks/LRT staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 85,
      rubric: [
        "Explains comparing maximized likelihood under null vs alternative: 55%",
        "Explains why small ratio implies evidence against null: 25%",
        "Mentions asymptotic chi-square / Wilks theorem (optional but strong): 20%",
      ],
      reference_solution_md:
        "LRT compares best likelihood under $H_0$ vs best likelihood under $H_1$ via $\\Lambda$. If null fits much worse, reject. Under conditions, $-2\\log\\Lambda\\sim \\chi^2$ asymptotically.\n",
    },
  },
  {
    slug: "log-likelihood-concavity-bernoulli-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "Bernoulli Log-Likelihood Concavity",
    prompt_md:
      "For iid Bernoulli($p$) data, what is true about the log-likelihood as a function of $p\\in(0,1)$?",
    solution_md:
      "It is concave in $p$, so the MLE is a unique global maximizer in $(0,1)$ (unless all outcomes are 0 or 1, which push to boundary).",
    answer_kind: "mcq",
    answer_value: "concave",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["mle", "concavity", "optimization"],
    source: "Likelihood properties",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        { id: "concave", label: "It is concave in $p$ on $(0,1)$.", correct: true },
        { id: "convex", label: "It is convex in $p$ on $(0,1)$.", correct: false },
        { id: "flat", label: "It is constant in $p$ for any fixed dataset.", correct: false },
        { id: "periodic", label: "It is periodic in $p$.", correct: false },
      ],
    },
  },
  {
    slug: "fisher-information-intuition-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Fisher Information — Intuition",
    prompt_md:
      "In 4–8 sentences, explain what Fisher information measures.\n\nMention how it relates to estimator variance (Cramér–Rao) and to curvature of the log-likelihood.",
    solution_md:
      "Fisher information measures how sensitive the likelihood is to changes in the parameter; more information means the data pins down the parameter more sharply. It can be expressed as the negative expected second derivative (curvature) of the log-likelihood. The Cramér–Rao lower bound says the variance of any unbiased estimator is at least the inverse of the Fisher information (for scalar parameters), so higher information implies lower achievable variance.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["mle", "asymptotic", "fisher-information"],
    source: "Asymptotic statistics",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 85,
      rubric: [
        "Describes information as sensitivity/identifiability of parameter from data: 40%",
        "Mentions log-likelihood curvature (expected negative Hessian/second derivative): 35%",
        "Mentions CRLB relation variance ≥ 1/I (scalar) or inverse info matrix: 25%",
      ],
      reference_solution_md:
        "Fisher info measures curvature/sensitivity of log-likelihood. Higher info → parameter more identifiable. CRLB: Var(unbiased estimator) ≥ 1/I (scalar), so more info → lower variance bound.\n",
    },
  },
  {
    slug: "asymptotic-normality-mle-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "Asymptotic Normality of the MLE (Informal)",
    prompt_md:
      "Under standard regularity conditions, what is the typical asymptotic distribution of the MLE $\\hat\\theta$ of a scalar parameter $\\theta$?",
    solution_md:
      "Typically $\\sqrt{n}(\\hat\\theta-\\theta)\\Rightarrow \\mathcal{N}(0, I(\\theta)^{-1})$, where $I(\\theta)$ is the Fisher information per observation (or use total info depending on convention).",
    answer_kind: "mcq",
    answer_value: "normal",
    answer_tolerance: null,
    difficulty: 4,
    tags: ["mle", "asymptotic", "normal"],
    source: "Asymptotic theory staple",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        {
          id: "normal",
          label:
            "$\\sqrt{n}(\\hat\\theta-\\theta)\\Rightarrow \\mathcal{N}(0, I(\\theta)^{-1})$ (up to convention).",
          correct: true,
        },
        { id: "cauchy", label: "Cauchy, regardless of model.", correct: false },
        { id: "uniform", label: "Uniform on an interval shrinking like $1/n$.", correct: false },
        { id: "poisson", label: "Poisson with mean $\\theta$.", correct: false },
      ],
    },
  },
  {
    slug: "endogeneity-what-is-it-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Endogeneity — What Is It?",
    prompt_md:
      "In linear regression, what does it mean for a regressor $X$ to be endogenous?\n\nIn 4–8 sentences: connect to $E[\\varepsilon\\mid X]$ and give one cause (omitted variables, measurement error, simultaneity).",
    solution_md:
      "Endogeneity means the regressor is correlated with the error term; equivalently, the exogeneity condition fails: $E[\\varepsilon\\mid X]\\ne 0$ (or $\\mathrm{Cov}(X,\\varepsilon)\\ne 0$). Causes include omitted variable bias, simultaneity/reverse causality, and measurement error. Endogeneity biases OLS coefficients and breaks causal interpretation and standard inference.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["ols", "endogeneity", "causality"],
    source: "Econometrics staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 85,
      rubric: [
        "Defines endogeneity via $E[\\varepsilon\\mid X]\\ne 0$ or $\\mathrm{Cov}(X,\\varepsilon)\\ne 0$: 55%",
        "Gives at least one correct cause (omitted variables, simultaneity, measurement error): 25%",
        "States consequence: OLS bias / broken causal interpretation: 20%",
      ],
      reference_solution_md:
        "Endogenous $X$ means correlated with error: $E[\\varepsilon|X]\\ne 0$. Causes: omitted vars, simultaneity, measurement error. Consequence: OLS bias / no causal interpretation.\n",
    },
  },
  {
    slug: "instrumental-variables-intuition-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Instrumental Variables — Intuition",
    prompt_md:
      "Explain the intuition behind instrumental variables (IV) in 5–10 sentences.\n\nName the two core IV assumptions (relevance and exclusion) in words.",
    solution_md:
      "IV uses a variable $Z$ (instrument) that shifts the endogenous regressor $X$ in a way that is unrelated to the outcome $Y$ except through $X$. Relevance: $Z$ must be correlated with $X$ (it moves $X$). Exclusion: $Z$ affects $Y$ only through $X$ and is uncorrelated with the structural error term. With these, variation in $X$ induced by $Z$ is quasi-random and can identify a causal effect (often a local average treatment effect).",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["iv", "causality", "endogeneity"],
    source: "Econometrics interview staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 95,
      rubric: [
        "Explains IV as using exogenous variation in X induced by Z to identify causal effect: 45%",
        "States relevance (Z correlated with X) clearly: 25%",
        "States exclusion / exogeneity (Z affects Y only through X; uncorrelated with error): 30%",
      ],
      reference_solution_md:
        "IV: use instrument Z that moves X (relevance) and affects Y only via X / is exogenous (exclusion), so induced variation in X can identify causal effect.\n",
    },
  },
  {
    slug: "weak-instruments-why-bad-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Weak Instruments — Why Are They a Problem?",
    prompt_md:
      "Explain why weak instruments cause problems for IV estimates.\n\nIn 5–10 sentences: mention variance, finite-sample bias, and one diagnostic idea.",
    solution_md:
      "If the instrument is weakly correlated with the endogenous regressor, the first stage provides little exogenous variation, so IV estimates become noisy (high variance). In finite samples, weak instruments can also induce bias toward OLS and lead to misleading inference (non-normal sampling distributions, size distortions). Diagnostics include first-stage F-statistics, partial $R^2$, and robust weak-IV methods/tests (e.g., Anderson–Rubin-type inference).",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["iv", "endogeneity", "inference"],
    source: "Econometrics staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 95,
      rubric: [
        "Mentions high variance/noise due to weak first stage: 40%",
        "Mentions finite-sample bias/inference distortions (bias toward OLS, wrong size): 40%",
        "Mentions at least one diagnostic/mitigation (first-stage F, partial R^2, weak-IV robust tests): 20%",
      ],
      reference_solution_md:
        "Weak instruments → weak first stage → high variance; finite-sample bias toward OLS and distorted inference. Diagnose via first-stage F/partial R^2; use weak-IV robust inference.\n",
    },
  },
  {
    slug: "selection-bias-what-is-it-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Selection Bias",
    prompt_md:
      "What is selection bias, and why can it break inference?\n\nAnswer in 5–10 sentences and give one concrete example.",
    solution_md:
      "Selection bias occurs when the observed sample is not representative of the target population due to a selection mechanism related to the variables of interest. This can induce spurious correlations and bias estimates because $P(data\\mid\\text{selected})$ differs from the population distribution. Example: studying only people who opted into a program (or survived to be measured) can bias estimated treatment effects; classic survivorship bias or collider bias situations.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["bias", "causality", "inference"],
    source: "Core concept",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 95,
      rubric: [
        "Defines selection bias as non-representative sampling due to selection mechanism: 55%",
        "Explains consequence: biased estimates / spurious relationships (collider/survivorship): 30%",
        "Gives one concrete example: 15%",
      ],
      reference_solution_md:
        "Selection bias: sample depends on variables of interest, so observed distribution differs from population → biased estimates (e.g., survivorship/collider bias).\n",
    },
  },
  {
    slug: "difference-in-differences-assumptions-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Difference-in-Differences — Key Assumption",
    prompt_md:
      "What is the key identification assumption behind difference-in-differences (DiD)?\n\nAnswer in 4–8 sentences and mention how you would sanity-check it.",
    solution_md:
      "The key assumption is parallel trends: absent treatment, treated and control groups would have followed the same trend over time. You can sanity-check by examining pre-treatment trends (event study / placebo tests) and ensuring no differential pre-trends; also check for compositional changes and anticipation effects.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["causality", "did", "identification"],
    source: "Applied causal inference",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 80,
      rubric: [
        "States parallel trends assumption clearly: 65%",
        "Mentions checking pre-trends / event study / placebo as sanity check: 35%",
      ],
      reference_solution_md:
        "DiD relies on parallel trends (counterfactual trends match absent treatment). Check via pre-trends/event study/placebo tests.\n",
    },
  },
  {
    slug: "multiple-testing-bh-procedure-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Benjamini–Hochberg (BH) Procedure",
    prompt_md:
      "Describe the Benjamini–Hochberg procedure for controlling FDR.\n\nAnswer in 5–10 sentences; you may use ordered p-values notation.",
    solution_md:
      "Sort p-values $p_{(1)}\\le \\dots \\le p_{(m)}$. Find the largest $k$ such that $p_{(k)} \\le \\frac{k}{m}q$ where $q$ is the target FDR level. Reject all hypotheses with p-values $p_{(1)},\\dots,p_{(k)}$. Under independence (and some dependence conditions), this controls the false discovery rate.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["multiple-testing", "fdr", "bh"],
    source: "Benjamini–Hochberg",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 95,
      rubric: [
        "Mentions sorting p-values and using an increasing threshold of form (k/m)q: 55%",
        "Mentions selecting the largest k satisfying the inequality and rejecting up to k: 35%",
        "Mentions FDR control as the goal (and optional independence caveat): 10%",
      ],
      reference_solution_md:
        "BH: sort p-values, find largest k with $p_{(k)}\\le (k/m)q$, reject all p-values up to k. Controls FDR under independence/conditions.\n",
    },
  },
  {
    slug: "posterior-predictive-checks-intuition-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Posterior Predictive Checks — Intuition",
    prompt_md:
      "In Bayesian modeling, what is a posterior predictive check (PPC)?\n\nAnswer in 4–8 sentences and explain what you're comparing.",
    solution_md:
      "A PPC samples parameters from the posterior, then simulates replicated data from the model, and compares simulated data (or summary statistics) to the observed data. If the model cannot generate data that looks like the observed data in relevant aspects, it indicates model misfit. PPCs are diagnostic tools, not formal hypothesis tests.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["bayes", "model-checking", "ppc"],
    source: "Bayesian workflow",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 85,
      rubric: [
        "Describes sampling from posterior and generating replicated data from the model: 55%",
        "Describes comparing replicated data/summaries to observed data: 35%",
        "Mentions the goal is model-checking/diagnostics (not a proof of correctness): 10%",
      ],
      reference_solution_md:
        "PPC: draw parameters from posterior, simulate replicated datasets, compare summaries/plots to observed data to diagnose misfit.\n",
    },
  },
  {
    slug: "simpsons-paradox-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Simpson's Paradox",
    prompt_md:
      "What is Simpson's paradox?\n\nGive a brief description (4–8 sentences) and explain what it teaches you about aggregation and confounding.",
    solution_md:
      "Simpson's paradox occurs when a trend present in several groups reverses when the groups are aggregated. The reversal is typically due to a confounding variable (group membership) affecting both the predictor and outcome and changing the weighting of groups. It teaches that marginal associations can be misleading; you often need to stratify/adjust for confounders to interpret relationships.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["confounding", "causality", "paradox"],
    source: "Classic",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 80,
      rubric: [
        "Defines the reversal between within-group and aggregated association: 55%",
        "Mentions confounding/weighting as the mechanism: 35%",
        "States the lesson: adjust/stratify rather than rely on marginal associations: 10%",
      ],
      reference_solution_md:
        "Simpson's paradox: within-group trend reverses when aggregated due to confounding/weighting differences. Lesson: marginal associations can mislead; stratify/adjust.\n",
    },
  },
  {
    slug: "wald-score-lrt-differences-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Wald vs Score vs Likelihood Ratio Tests",
    prompt_md:
      "Compare the Wald test, score (LM) test, and likelihood ratio test.\n\nIn 6–10 sentences: say what each evaluates (where it is computed) and one practical difference (e.g. needing to fit under $H_0$ vs $H_1$).",
    solution_md:
      "Wald: uses the unrestricted estimate and its standard error to test whether the estimate is far from the null value; computed under the alternative fit.\n\nScore/LM: evaluates whether the likelihood slope at the null is large; computed using only the null fit.\n\nLRT: compares maximized likelihoods under null vs alternative; requires fitting both.\n\nAsymptotically under regularity, they often agree (chi-square), but can differ in small samples or under constraints/boundaries.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["hypothesis-testing", "lrt", "wald", "score"],
    source: "Asymptotic testing staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 110,
      rubric: [
        "Correctly characterizes Wald as using unrestricted estimate + SE relative to null: 35%",
        "Correctly characterizes score/LM as using gradient at null and requiring only null fit: 35%",
        "Correctly characterizes LRT as comparing maximized likelihoods (requires both fits): 20%",
        "Mentions asymptotic equivalence but possible small-sample differences: 10%",
      ],
      reference_solution_md:
        "Wald: test based on unrestricted estimate distance from null. Score/LM: test based on likelihood slope at null (needs only null fit). LRT: compare maximized likelihoods under null vs alt (needs both fits). Often asymptotically equivalent but can differ finite-sample.\n",
    },
  },
  {
    slug: "multicollinearity-what-happens-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Multicollinearity — What Happens in OLS?",
    prompt_md:
      "What is multicollinearity in regression, and what does it do to coefficient estimates and standard errors?\n\nAnswer in 5–10 sentences and mention at least one mitigation.",
    solution_md:
      "Multicollinearity means regressors are highly correlated, making $X^\\top X$ ill-conditioned. Coefficient estimates can become unstable (sensitive to small data changes) and individual standard errors inflate, so $t$-stats can look insignificant even if the model predicts well. Mitigations include collecting more data, removing/recombining correlated features, using regularization (ridge), or using PCA/partial least squares.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["ols", "linear-algebra", "inference"],
    source: "Regression diagnostics",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 90,
      rubric: [
        "Defines multicollinearity as high correlation / ill-conditioning in regressors: 35%",
        "Explains instability of coefficients and inflated SEs / weak individual t-stats: 45%",
        "Mentions at least one mitigation (ridge, feature removal, PCA): 20%",
      ],
      reference_solution_md:
        "Multicollinearity: regressors highly correlated → ill-conditioned $X^TX$. Coefs unstable and SEs inflate; mitigate via ridge, remove/combine features, PCA, more data.\n",
    },
  },
  {
    slug: "clustered-standard-errors-why-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Clustered Standard Errors — Why?",
    prompt_md:
      "When would you use clustered standard errors?\n\nAnswer in 4–8 sentences and explain what dependence structure clustering is meant to handle.",
    solution_md:
      "Clustered standard errors are used when observations are not independent within groups (clusters), e.g. repeated measurements per user, firm, or time period, but clusters are approximately independent of each other. Clustering allows arbitrary correlation and heteroskedasticity within a cluster, producing more reliable inference than naive iid or only-heteroskedastic robust SEs.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["inference", "standard-errors", "dependence"],
    source: "Applied econometrics",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 75,
      rubric: [
        "States the within-cluster dependence motivation (non-iid within groups): 55%",
        "Describes 'arbitrary correlation within cluster, independent across clusters' idea: 30%",
        "Contrasts with plain robust SEs (heteroskedastic only) or iid SEs: 15%",
      ],
      reference_solution_md:
        "Use clustered SEs when errors are correlated within groups (users/firms/time). Clustering allows arbitrary within-cluster correlation and heteroskedasticity while treating clusters as independent.\n",
    },
  },
  {
    slug: "robust-vs-clustered-se-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "Robust vs Clustered SEs",
    prompt_md:
      "Which statement best contrasts heteroskedasticity-robust standard errors with clustered standard errors?",
    solution_md:
      "Robust (White) SEs handle heteroskedasticity with independent observations; clustered SEs additionally allow correlation within clusters (and heteroskedasticity) while assuming clusters are independent.",
    answer_kind: "mcq",
    answer_value: "cluster",
    answer_tolerance: null,
    difficulty: 4,
    tags: ["inference", "standard-errors", "dependence"],
    source: "Applied econometrics",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        {
          id: "cluster",
          label:
            "Robust SEs handle heteroskedasticity with iid observations; clustered SEs also allow within-cluster correlation.",
          correct: true,
        },
        {
          id: "same",
          label: "They are the same thing; the terms are interchangeable.",
          correct: false,
        },
        {
          id: "bayes",
          label: "Robust SEs are Bayesian, clustered SEs are frequentist.",
          correct: false,
        },
        {
          id: "normality",
          label: "Clustered SEs require normal errors; robust SEs do not.",
          correct: false,
        },
      ],
    },
  },
  {
    slug: "p-hacking-garden-forking-paths-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "p-hacking / Garden of Forking Paths",
    prompt_md:
      "What is p-hacking (\"the garden of forking paths\"), and why does it inflate false positives?\n\nAnswer in 5–10 sentences and mention one mitigation.",
    solution_md:
      "p-hacking refers to trying many analyses/specifications (different subsets, transforms, models, outcomes) and reporting only those with significant p-values. Even if all nulls are true, searching many tests increases the chance at least one appears significant by chance, inflating the effective Type I error. Mitigations include pre-registration, correcting for multiple testing (Bonferroni/FDR), holding out a confirmatory test set, or reporting all tried specifications.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["multiple-testing", "inference", "reproducibility"],
    source: "Research practice",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 95,
      rubric: [
        "Defines p-hacking as trying many analyses and selectively reporting significant results: 50%",
        "Explains why it inflates false positives (multiple comparisons / effective alpha increases): 35%",
        "Mentions at least one mitigation (pre-reg, FDR/Bonferroni, holdout confirmatory): 15%",
      ],
      reference_solution_md:
        "p-hacking: many specs tried, only significant reported → multiple comparisons inflate false positives. Mitigate with pre-registration, multiple-testing correction, confirmatory holdout.\n",
    },
  },
  {
    slug: "aic-vs-bic-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "AIC vs BIC (Model Selection)",
    prompt_md:
      "Which statement best contrasts AIC and BIC for model selection?",
    solution_md:
      "Both trade off fit and complexity. BIC penalizes complexity more strongly (penalty grows like $\\log n$), often favoring simpler models as $n$ grows; AIC uses a constant penalty per parameter and is more prediction-focused.",
    answer_kind: "mcq",
    answer_value: "bic-stronger",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["model-selection", "aic", "bic"],
    source: "Classical criteria",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        {
          id: "bic-stronger",
          label:
            "BIC penalizes complexity more strongly (penalty involves $\\log n$), often choosing simpler models for large $n$.",
          correct: true,
        },
        { id: "same", label: "They are identical criteria with different names.", correct: false },
        { id: "bayes", label: "AIC is Bayesian while BIC is frequentist.", correct: false },
        { id: "always", label: "AIC always selects simpler models than BIC.", correct: false },
      ],
    },
  },
  {
    slug: "bootstrap-ci-percentile-basic-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Bootstrap Percentile CI (Basic Idea)",
    prompt_md:
      "Describe the bootstrap percentile confidence interval method in 5–10 sentences.\n\nYou can assume you have B bootstrap resamples and a statistic $\\hat\\theta$.",
    solution_md:
      "Resample the dataset with replacement B times. For each bootstrap sample, compute the statistic, yielding bootstrap replicates $\\hat\\theta^{*(1)},\\dots,\\hat\\theta^{*(B)}$. Then take the empirical quantiles: the $(\\alpha/2)$ and $(1-\\alpha/2)$ quantiles of the bootstrap replicates form an approximate $(1-\\alpha)$ CI. Intuition: bootstrap replicates approximate the sampling distribution of $\\hat\\theta$.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["bootstrap", "confidence-interval", "inference"],
    source: "Bootstrap basics",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 95,
      rubric: [
        "Mentions resampling with replacement B times and recomputing the statistic: 45%",
        "Mentions taking empirical quantiles of bootstrap replicates for CI: 45%",
        "Connects to approximating sampling distribution: 10%",
      ],
      reference_solution_md:
        "Bootstrap percentile CI: resample with replacement B times, compute $\\hat\\theta^*$ each time, then take empirical quantiles of the $\\hat\\theta^*$ distribution as CI endpoints.\n",
    },
  },
  {
    slug: "score-test-intuition-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Score (LM) Test — Intuition",
    prompt_md:
      "Explain the intuition of the score (Lagrange multiplier / LM) test.\n\nIn 4–8 sentences: mention evaluating the gradient at the null and why only fitting under $H_0$ is enough.",
    solution_md:
      "The score test asks whether the log-likelihood would increase rapidly if you moved away from the null: it evaluates the gradient (score) at the null parameter value. If the score is near zero, the null is locally optimal; if large, the null fits poorly relative to nearby alternatives. Because it's evaluated at the null, you only need to fit the restricted (null) model.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["hypothesis-testing", "score", "mle"],
    source: "Asymptotic testing staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 80,
      rubric: [
        "Mentions gradient/score of log-likelihood evaluated at null: 55%",
        "Explains why large score indicates improvement by moving away from null: 25%",
        "Mentions only needing to fit under $H_0$ (restricted model): 20%",
      ],
      reference_solution_md:
        "Score/LM test evaluates the log-likelihood gradient at the null; large score implies moving away improves fit. Computed using only the restricted null fit.\n",
    },
  },
  {
    slug: "cross-validation-vs-bootstrap-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Cross-Validation vs Bootstrap (When/Why)",
    prompt_md:
      "Compare cross-validation and the bootstrap for estimating model performance or uncertainty.\n\nIn 6–10 sentences: say what each resamples/splits, a typical use case, and one limitation.",
    solution_md:
      "Cross-validation splits data into folds, training on subsets and evaluating on held-out folds, commonly used for model selection and performance estimation. Bootstrap resamples the dataset with replacement to approximate the sampling distribution of a statistic (uncertainty / confidence intervals) and can also be used for optimism-corrected performance.\n\nLimitations: CV can have high variance for small datasets and can leak structure if folds are not group/time aware; bootstrap percentile CIs can be biased for some statistics and naive bootstrap performance estimates can be optimistic without correction.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["evaluation", "cross-validation", "bootstrap"],
    source: "Applied ML/stats",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 110,
      rubric: [
        "Correctly describes CV as repeated train/holdout fold evaluation for performance/model selection: 40%",
        "Correctly describes bootstrap as resampling-with-replacement to approximate sampling distribution/uncertainty: 40%",
        "Mentions one limitation for each (structure leakage, bias/optimism): 20%",
      ],
      reference_solution_md:
        "CV: fold splits for performance/model selection. Bootstrap: resample with replacement to approximate sampling distribution/uncertainty. Each has limitations (structure leakage in CV; bias/optimism in naive bootstrap).\n",
    },
  },
  {
    slug: "t-test-assumptions-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "One-Sample t-test — Key Assumption",
    prompt_md:
      "For the classic one-sample t-test of a mean, which assumption is most critical for the exact finite-sample t distribution result?",
    solution_md:
      "Exact t distribution relies on normality of the data (or of the error term). Without normality, the t-test can still be approximately valid by CLT for large n, but the exact result is lost.",
    answer_kind: "mcq",
    answer_value: "normality",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["hypothesis-testing", "t-test", "assumptions"],
    source: "Classical inference",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        { id: "normality", label: "Normality (exact finite-sample t distribution).", correct: true },
        { id: "linearity", label: "Linearity of the mean in parameters.", correct: false },
        { id: "independence-only", label: "Only independence; distribution shape never matters.", correct: false },
        { id: "bounded", label: "Bounded support.", correct: false },
      ],
    },
  },
  {
    slug: "regularization-selection-cv-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "Choosing Regularization Strength",
    prompt_md:
      "In practice, how do you usually choose the regularization strength (e.g., $\\lambda$ in ridge/lasso)?",
    solution_md:
      "Commonly via validation / cross-validation (possibly nested CV), selecting the value that optimizes an out-of-sample metric.",
    answer_kind: "mcq",
    answer_value: "cv",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["regularization", "cross-validation", "model-selection"],
    source: "Practical ML",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      options: [
        { id: "cv", label: "Use a validation set or cross-validation to pick $\\lambda$ by out-of-sample performance.", correct: true },
        { id: "always-zero", label: "Set $\\lambda=0$ unless the model overfits.", correct: false },
        { id: "maximize-train", label: "Pick $\\lambda$ that minimizes training error.", correct: false },
        { id: "pvalue", label: "Pick $\\lambda$ so every coefficient has p-value < 0.05.", correct: false },
      ],
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
