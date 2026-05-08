import type { SeedQuestion } from "@/content/question-types";

/**
 * Machine Learning — interview-grade theory + practical pitfalls.
 *
 * Focus: estimation, generalization, regularization, leakage, and model
 * evaluation reasoning. No finance/options content.
 */
export const MACHINE_LEARNING_SEED: SeedQuestion[] = [
  {
    slug: "ml-bias-variance-decomposition-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Bias–Variance Decomposition (Squared Loss)",
    prompt_md:
      "State the bias–variance decomposition for squared error at a point $x$.\n\nAssume $Y = f(x) + \\varepsilon$ with $E[\\varepsilon]=0$ and $\\mathrm{Var}(\\varepsilon)=\\sigma^2$, and you fit a predictor $\\hat f(x)$ from data. Express $E[(Y-\\hat f(x))^2]$ in terms of bias, variance, and noise.",
    solution_md:
      "For squared loss at fixed $x$,\n\n$$E[(Y-\\hat f(x))^2] = (E[\\hat f(x)]-f(x))^2 + \\mathrm{Var}(\\hat f(x)) + \\sigma^2.$$\n\nThe first term is squared bias, second is variance, and $\\sigma^2$ is irreducible noise.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["bias-variance", "generalization", "theorem-recall"],
    source: "ESLR / standard ML interviews",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 40,
      rubric: [
        "Provides the full decomposition into squared bias + variance + noise: 60%",
        "Clearly identifies squared bias as $(E[\\hat f(x)]-f(x))^2$: 25%",
        "Mentions $\\sigma^2$ (irreducible noise) explicitly: 15%",
      ],
      reference_solution_md:
        "At a fixed $x$ under $Y=f(x)+\\varepsilon$,\n\n$$E[(Y-\\hat f(x))^2] = E[(f(x)+\\varepsilon-\\hat f(x))^2] = (E[\\hat f(x)]-f(x))^2 + \\mathrm{Var}(\\hat f(x)) + \\sigma^2.$$\n",
    },
  },
  {
    slug: "ml-ridge-closed-form-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Ridge Regression — Closed Form",
    prompt_md:
      "Consider ridge regression with $\\lambda>0$:\n\n$$\\hat\\beta = \\arg\\min_\\beta \\|y - X\\beta\\|_2^2 + \\lambda \\|\\beta\\|_2^2.$$\n\nDerive the closed-form solution.",
    solution_md:
      "Differentiate and set to zero:\n\n$$-2X^\\top(y-X\\beta)+2\\lambda\\beta=0 \\Rightarrow (X^\\top X + \\lambda I)\\hat\\beta = X^\\top y,$$\n\nso\n\n$$\\hat\\beta = (X^\\top X + \\lambda I)^{-1}X^\\top y.$$\n",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["ridge", "regularization", "linear-algebra"],
    source: "ESLR / standard derivation",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 40,
      rubric: [
        "Derives the first-order condition leading to $(X^\\top X+\\lambda I)\\hat\\beta=X^\\top y$: 60%",
        "States the closed-form inverse solution: 30%",
        "Notes $\\lambda>0$ ensures invertibility even if $X^\\top X$ is singular: 10%",
      ],
      reference_solution_md:
        "$$-2X^\\top(y-X\\beta)+2\\lambda\\beta=0\\Rightarrow (X^\\top X+\\lambda I)\\hat\\beta=X^\\top y\\Rightarrow \\hat\\beta=(X^\\top X+\\lambda I)^{-1}X^\\top y.$$",
    },
  },
  {
    slug: "ml-train-test-leakage-examples-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Train/Test Leakage — Concrete Examples",
    prompt_md:
      "Give **two distinct** ways train/test leakage can occur in a typical ML pipeline, and for each, name a concrete fix.\n\nAnswer in 4–8 sentences total.",
    solution_md:
      "Examples: (1) Fitting preprocessing (standardization, PCA) on the full dataset before splitting; fix by fitting transforms on train only and applying to val/test.\n\n(2) Using target-derived features (e.g., computing future returns / using post-event info); fix by strict time-based splits, feature computation with causal windows, and unit tests that enforce no lookahead.\n\nOther examples: data dedup issues, leakage via imputation across train+test, hyperparameter tuning on the test set instead of a validation set.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["leakage", "evaluation", "pipelines"],
    source: "Industry ML interviews",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 60,
      rubric: [
        "Provides two genuinely different leakage mechanisms (not rephrasings): 45%",
        "Pairs each leakage mechanism with a concrete fix (fit-on-train, time split, etc.): 45%",
        "Uses at least one specific pipeline component (scaler/PCA/imputer/feature gen/CV): 10%",
      ],
      reference_solution_md:
        "- Leakage #1: fit scaler/PCA on full data before split → fix: fit on train only.\n- Leakage #2: target/label lookahead in features (post-event data) → fix: time-based split + causal feature windows + leakage tests.\n",
    },
  },
  {
    slug: "ml-l1-vs-l2-geometry-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "L1 vs L2 Regularization — Sparsity Intuition",
    prompt_md:
      "In linear regression, why does an $\\ell_1$ penalty (Lasso) tend to produce sparse solutions more often than an $\\ell_2$ penalty (Ridge)?",
    solution_md:
      "Geometrically, the $\\ell_1$ constraint region has corners aligned with coordinate axes; the quadratic loss contours are smooth ellipses. The optimum often hits a corner, setting some coefficients exactly to zero. The $\\ell_2$ ball is smooth, so exact zeros are less likely.",
    answer_kind: "mcq",
    answer_value: "corners",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["regularization", "lasso", "ridge"],
    source: "ESLR geometry explanation",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        {
          id: "corners",
          label:
            "The $\\ell_1$ constraint has corners; optima often occur at corners, yielding exact zeros.",
          correct: true,
        },
        {
          id: "convex",
          label: "$\\ell_1$ is convex but $\\ell_2$ is non-convex.",
          correct: false,
        },
        {
          id: "noise",
          label: "$\\ell_1$ reduces noise variance but $\\ell_2$ increases it.",
          correct: false,
        },
        {
          id: "unique",
          label: "$\\ell_2$ always has multiple solutions but $\\ell_1$ is unique.",
          correct: false,
        },
      ],
    },
  },
  {
    slug: "ml-pca-optimization-statement-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "PCA — What Optimization Problem Is It Solving?",
    prompt_md:
      "Assume data is centered and let $S$ be the sample covariance matrix.\n\nState an optimization problem whose solution is the **first principal component direction**. You may write it as maximizing variance or minimizing reconstruction error.",
    solution_md:
      "The first PC solves\n\n$$\\max_{\\|v\\|_2=1} v^\\top S v,$$\n\nso $v$ is the top eigenvector of $S$ (Rayleigh quotient). Equivalently, it minimizes squared reconstruction error among 1D subspaces.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["pca", "linear-algebra", "rayleigh-quotient"],
    source: "ESLR / linear algebra staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 35,
      rubric: [
        "States a correct constrained optimization (maximize $v^\\top S v$ s.t. $\\|v\\|=1$ OR minimize reconstruction error): 70%",
        "Connects the solution to the top eigenvector / Rayleigh quotient: 30%",
      ],
      reference_solution_md:
        "$$\\max_{\\|v\\|=1} v^\\top S v$$; maximizer is the leading eigenvector of $S$ (Rayleigh quotient).",
    },
  },
  {
    slug: "ml-logistic-loss-gradient-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Logistic Regression — Gradient",
    prompt_md:
      "Consider logistic regression with labels $y_i\\in\\{0,1\\}$, features $x_i\\in\\mathbb{R}^d$, and model $p_i = \\sigma(w^\\top x_i)$.\n\nWrite the negative log-likelihood and its gradient with respect to $w$ (no regularization).",
    solution_md:
      "Negative log-likelihood:\n\n$$\\mathcal{L}(w)= -\\sum_i \\big[y_i\\log p_i + (1-y_i)\\log(1-p_i)\\big].$$\n\nGradient:\n\n$$\\nabla_w \\mathcal{L}(w)= \\sum_i (p_i - y_i) x_i.$$\n",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["logistic-regression", "mle", "gradients"],
    source: "Standard derivation",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 35,
      rubric: [
        "Writes the correct Bernoulli negative log-likelihood (cross-entropy) form: 50%",
        "Provides the simplified gradient $\\sum_i (p_i-y_i)x_i$: 40%",
        "Defines $p_i=\\sigma(w^\\top x_i)$ (or equivalent) clearly: 10%",
      ],
      reference_solution_md:
        "$$\\mathcal{L}(w)= -\\sum_i \\left[y_i\\log \\sigma(w^\\top x_i) + (1-y_i)\\log(1-\\sigma(w^\\top x_i))\\right],\\quad \\nabla_w\\mathcal{L}(w)=\\sum_i(\\sigma(w^\\top x_i)-y_i)x_i.$$\n",
    },
  },
  {
    slug: "ml-auc-vs-accuracy-when-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "AUC vs Accuracy — When to Prefer AUC?",
    prompt_md:
      "When is ROC-AUC typically a better evaluation metric than accuracy for binary classification?",
    solution_md:
      "When classes are imbalanced or decision threshold is not fixed; AUC summarizes ranking performance across thresholds, while accuracy can be misleading when one class dominates.",
    answer_kind: "mcq",
    answer_value: "imbalance",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["evaluation", "auc", "classification"],
    source: "ML evaluation basics",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      options: [
        {
          id: "imbalance",
          label:
            "When classes are imbalanced and the threshold may vary; AUC measures ranking across thresholds.",
          correct: true,
        },
        {
          id: "always",
          label: "Always; AUC strictly dominates accuracy in every setting.",
          correct: false,
        },
        {
          id: "regression",
          label: "When the task is regression and outputs are continuous.",
          correct: false,
        },
        {
          id: "calibration",
          label: "When you need calibrated probabilities, not rankings.",
          correct: false,
        },
      ],
    },
  },
  {
    slug: "ml-mcmc-metropolis-acceptance-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Metropolis–Hastings — Acceptance Probability",
    prompt_md:
      "State the Metropolis–Hastings acceptance probability for proposing $x'\\sim q(x'\\mid x)$ when targeting distribution with density $\\pi(x)$.\n\nYou can assume everything is absolutely continuous.",
    solution_md:
      "Acceptance probability:\n\n$$\\alpha(x,x')=\\min\\left(1,\\;\\frac{\\pi(x')\\,q(x\\mid x')}{\\pi(x)\\,q(x'\\mid x)}\\right).$$\n\nFor symmetric proposals $q(x'\\mid x)=q(x\\mid x')$, it reduces to $\\min(1,\\pi(x')/\\pi(x))$.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["mcmc", "metropolis-hastings", "bayes"],
    source: "Bayesian computation staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 25,
      rubric: [
        "Gives the correct MH ratio with target density and proposal terms: 80%",
        "Uses the min-with-1 form (accept with probability min(1, r)): 20%",
      ],
      reference_solution_md:
        "$$\\alpha(x,x')=\\min\\left(1,\\frac{\\pi(x')q(x\\mid x')}{\\pi(x)q(x'\\mid x)}\\right).$$",
    },
  },
  {
    slug: "ml-cross-validation-when-not-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "When Is Cross-Validation a Bad Idea?",
    prompt_md:
      "Give one scenario where standard i.i.d. $k$-fold cross-validation is inappropriate, and describe the correct evaluation split.\n\nKeep it to 3–6 sentences.",
    solution_md:
      "Time series forecasting / any temporally ordered data: random folds leak future information into training. Use a time-based split (walk-forward validation / blocked CV) where validation windows occur strictly after training windows. Similar issues arise with grouped data (same user/product repeated); use group-aware splitting.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["evaluation", "cross-validation", "leakage"],
    source: "Practical ML evaluation",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 35,
      rubric: [
        "Names a non-i.i.d. scenario (time series, grouped users, duplicates, etc.): 45%",
        "Explains why random folds leak information / break assumptions: 25%",
        "Gives a concrete correct split (walk-forward, blocked, group k-fold): 30%",
      ],
      reference_solution_md:
        "Time series: random folds leak future into train. Use walk-forward / blocked CV with training windows strictly before validation windows.\n",
    },
  },
];

