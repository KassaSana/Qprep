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
    slug: "ml-logloss-vs-mse-when-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "Log Loss vs MSE — Why Not Use MSE for Classification?",
    prompt_md:
      "For binary classification with probabilistic outputs, why is log loss (cross-entropy) typically preferred over mean squared error?",
    solution_md:
      "Cross-entropy is the proper scoring rule for Bernoulli likelihood: it corresponds to maximizing the conditional log-likelihood and strongly penalizes confident wrong predictions, leading to better calibrated probabilities. MSE can behave poorly for probabilities and is not aligned with the Bernoulli likelihood.",
    answer_kind: "mcq",
    answer_value: "likelihood",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["classification", "loss-functions", "calibration"],
    source: "Likelihood/proper scoring rule explanation",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        {
          id: "likelihood",
          label:
            "It matches the Bernoulli log-likelihood (proper scoring rule) and penalizes confident wrong predictions appropriately.",
          correct: true,
        },
        { id: "convex", label: "MSE is non-convex but log loss is convex.", correct: false },
        { id: "faster", label: "Log loss always converges faster for any optimizer.", correct: false },
        { id: "variance", label: "MSE estimates variance, while log loss estimates bias.", correct: false },
      ],
    },
  },
  {
    slug: "ml-precision-recall-imbalanced-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Precision vs Recall Under Class Imbalance",
    prompt_md:
      "In an imbalanced classification problem (rare positives), explain why precision and recall can be more informative than accuracy.\n\nGive one scenario where you would prioritize recall over precision, and one where you would prioritize precision over recall.",
    solution_md:
      "Accuracy can be high by always predicting the majority class. Precision/recall focus on performance on the positive class: recall measures how many true positives you catch; precision measures how many predicted positives are actually correct.\n\nPrioritize recall when missing positives is costly (e.g. fraud/cancer screening). Prioritize precision when false alarms are costly (e.g. manual review budget, alert fatigue).",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["evaluation", "precision-recall", "class-imbalance"],
    source: "Practical ML evaluation",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 80,
      rubric: [
        "Explains why accuracy can be misleading under class imbalance: 35%",
        "Defines/contrasts precision and recall correctly: 35%",
        "Gives one correct scenario prioritizing recall and one prioritizing precision: 30%",
      ],
      reference_solution_md:
        "Imbalance: predicting all negatives can yield high accuracy. Recall = TP/(TP+FN), precision = TP/(TP+FP). Recall-priority when FN costly; precision-priority when FP costly.\n",
    },
  },
  {
    slug: "ml-pr-auc-vs-roc-auc-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "PR-AUC vs ROC-AUC Under Imbalance",
    prompt_md:
      "In heavily imbalanced problems with rare positives, which metric is often more informative for the positive class, and why?",
    solution_md:
      "PR-AUC is often more informative because precision is sensitive to false positives when positives are rare; ROC-AUC can look deceptively strong even with many false positives due to the large number of true negatives.",
    answer_kind: "mcq",
    answer_value: "prauc",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["evaluation", "auc", "class-imbalance"],
    source: "ML evaluation best practice",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      options: [
        {
          id: "prauc",
          label:
            "PR-AUC, because it focuses on precision/recall for the positive class; ROC-AUC can be misleading with many true negatives.",
          correct: true,
        },
        { id: "rocauc", label: "ROC-AUC, because it ignores class imbalance.", correct: false },
        { id: "accuracy", label: "Accuracy, because it is threshold-free.", correct: false },
        { id: "mse", label: "MSE, because it measures probability calibration.", correct: false },
      ],
    },
  },
  {
    slug: "ml-xgboost-why-works-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Why Gradient-Boosted Trees Work So Well",
    prompt_md:
      "In 5–10 sentences, explain (at a high level) why gradient-boosted decision trees (e.g. XGBoost/LightGBM) often perform strongly on tabular data.\n\nMention at least: additive model / boosting idea, handling nonlinearity/interactions, and regularization/early stopping.",
    solution_md:
      "Boosting builds an additive model by fitting each new tree to the current residuals/negative gradient of the loss, gradually improving fit. Trees naturally capture nonlinearities and feature interactions without manual feature engineering. Modern implementations add regularization (shrinkage/learning rate, tree depth limits, subsampling, column sampling) and early stopping to control overfitting, plus efficient handling of missing values and sparsity.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["xgboost", "boosting", "generalization"],
    source: "Practical ML interviews",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 90,
      rubric: [
        "Explains boosting as an additive model fitting residuals / negative gradients iteratively: 45%",
        "Mentions trees capture nonlinearities and interactions on tabular data: 30%",
        "Mentions concrete regularization controls (learning rate, depth, subsampling, early stopping): 25%",
      ],
      reference_solution_md:
        "Boosting adds trees sequentially to reduce loss (fit residuals/gradients). Trees capture nonlinearities/interactions. Regularization via shrinkage, depth constraints, subsampling/column sampling, and early stopping prevents overfit.\n",
    },
  },
  {
    slug: "ml-regularization-as-prior-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Regularization as a Prior (MAP View)",
    prompt_md:
      "Explain how $\\ell_2$ regularization in linear/logistic regression relates to a Bayesian prior.\n\nWhat prior on $\\beta$ corresponds to an $\\ell_2$ penalty $\\lambda\\|\\beta\\|_2^2$?",
    solution_md:
      "MAP maximizes log-likelihood plus log-prior. An $\\ell_2$ penalty corresponds to a zero-mean Gaussian prior on coefficients: $\\beta\\sim\\mathcal{N}(0,\\tau^2 I)$, where $\\lambda$ is proportional to $1/\\tau^2$.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["regularization", "bayes", "map"],
    source: "Common Bayesian interpretation",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 55,
      rubric: [
        "States MAP as maximizing log-likelihood + log-prior (or equivalent): 35%",
        "Identifies $\\ell_2$ penalty with a zero-mean Gaussian prior on coefficients: 50%",
        "Relates $\\lambda$ to prior variance (larger $\\lambda$ → smaller variance): 15%",
      ],
      reference_solution_md:
        "$\\ell_2$ regularization corresponds to a Gaussian prior $\\beta\\sim\\mathcal{N}(0,\\tau^2 I)$; MAP adds $\\log p(\\beta)$ giving a quadratic penalty with $\\lambda\\propto 1/\\tau^2$.\n",
    },
  },
  {
    slug: "ml-calibration-vs-discrimination-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Calibration vs Discrimination",
    prompt_md:
      "Explain the difference between probability calibration and discrimination (ranking) for a binary classifier.\n\nGive one metric or diagnostic for each.",
    solution_md:
      "Calibration: predicted probabilities match empirical frequencies (e.g., among examples predicted 0.7, about 70% are positive). Diagnostics/metrics include reliability plots, Brier score, and calibration error.\n\nDiscrimination: ability to rank positives above negatives regardless of calibration; metrics include ROC-AUC and PR-AUC.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["evaluation", "calibration", "auc"],
    source: "ML evaluation interviews",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 85,
      rubric: [
        "Defines calibration in terms of probabilities matching frequencies: 45%",
        "Defines discrimination/ranking as ordering positives above negatives: 35%",
        "Provides one metric/diagnostic for each (e.g., Brier/reliability for calibration; AUC for discrimination): 20%",
      ],
      reference_solution_md:
        "Calibration: probabilities reflect frequencies (use reliability plot/Brier). Discrimination: ranking quality (use ROC-AUC/PR-AUC).\n",
    },
  },
  {
    slug: "ml-data-leakage-time-split-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Time-Based Split — What Can Still Leak?",
    prompt_md:
      "You correctly do a time-based train/validation split for a forecasting or time-dependent classification problem.\n\nName two ways you can **still** get leakage even with a time split, and give a fix for each.",
    solution_md:
      "Leakage can still occur if you compute features using windows that peek into the future (e.g. centered rolling stats, target leakage) or if you fit preprocessing (scalers, PCA, imputation) on the full dataset instead of train only. Fixes: enforce causal feature windows with strict cutoff times; fit transforms only on the training set and apply to validation/test. Also watch for label definition leakage (using future outcomes in labels) and entity leakage (same user/item in both splits) depending on the problem.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["leakage", "time-series", "pipelines"],
    source: "Practical ML",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 90,
      rubric: [
        "Provides two distinct leakage mechanisms that can happen even with time splits: 55%",
        "Gives a concrete fix for each (causal windows, fit-on-train transforms, etc.): 35%",
        "Uses at least one specific example (rolling window, scaler/PCA/imputer, label leakage): 10%",
      ],
      reference_solution_md:
        "Even with time split: (1) features computed with future info (centered windows/target leakage) → causal windows; (2) preprocessing fit on full data → fit on train only.\n",
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

