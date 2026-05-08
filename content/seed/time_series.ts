import type { SeedQuestion } from "@/content/question-types";

/**
 * Time Series — stationarity, autocorrelation, ARMA intuition, and evaluation.
 *
 * Interview focus: reasoning and basic derivations, not long computations.
 */
export const TIME_SERIES_SEED: SeedQuestion[] = [
  {
    slug: "ts-stationarity-definition-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Weak vs Strict Stationarity",
    prompt_md:
      "Define **strict stationarity** and **weak (covariance) stationarity** for a stochastic process $(X_t)$.\n\nThen give one example of a process that is weakly stationary but not strictly stationary (a sketch is fine).",
    solution_md:
      "Strict stationarity: all finite-dimensional distributions are invariant under time shift.\n\nWeak stationarity: mean is constant and autocovariance depends only on lag: $E[X_t]=\\mu$, and $\\mathrm{Cov}(X_t,X_{t+h})=\\gamma(h)$.\n\nExample: a process with time-invariant mean/covariance but non-Gaussian marginals whose higher moments vary with time; many textbook examples construct $X_t = Z\\cdot (-1)^t$ with carefully chosen $Z$ or use mixtures to break distributional invariance while preserving second moments.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["time-series", "stationarity", "definitions"],
    source: "Time series basics",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 70,
      rubric: [
        "Defines strict stationarity via time-shift invariance of all finite-dimensional distributions: 45%",
        "Defines weak stationarity via constant mean and autocovariance depending only on lag: 40%",
        "Provides a plausible example (or construction idea) distinguishing the two: 15%",
      ],
      reference_solution_md:
        "Strict: $(X_{t_1},...,X_{t_k})\\overset{d}{=}(X_{t_1+h},...,X_{t_k+h})$ for all $k,t_i,h$.\nWeak: $E[X_t]=\\mu$ and $\\mathrm{Cov}(X_t,X_{t+h})=\\gamma(h)$.\nExample sketches rely on breaking higher-moment invariance while keeping mean/covariance fixed.\n",
    },
  },
  {
    slug: "ts-adf-null-hypothesis-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "ADF Test — Null Hypothesis",
    prompt_md:
      "In the augmented Dickey–Fuller (ADF) test, what is the usual null hypothesis?",
    solution_md:
      "The null is a unit root (non-stationarity). The alternative is stationarity (often around a mean or trend depending on specification).",
    answer_kind: "mcq",
    answer_value: "unit-root",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["time-series", "adf", "stationarity"],
    source: "Econometrics basics",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        {
          id: "unit-root",
          label: "The series has a unit root (is non-stationary).",
          correct: true,
        },
        {
          id: "stationary",
          label: "The series is stationary with zero mean.",
          correct: false,
        },
        {
          id: "normal",
          label: "The innovations are Gaussian.",
          correct: false,
        },
        {
          id: "no-autocorr",
          label: "There is no autocorrelation at any lag.",
          correct: false,
        },
      ],
    },
  },
  {
    slug: "ts-ar1-autocorr-numeric",
    topic: "Statistics",
    track: "researcher",
    title: "AR(1) Autocorrelation",
    prompt_md:
      "Let $X_t = \\phi X_{t-1} + \\varepsilon_t$ with $|\\phi|<1$ and iid noise $\\varepsilon_t$ with mean $0$.\n\nWhat is the autocorrelation at lag $k$, $\\rho(k)$?",
    solution_md:
      "For stationary AR(1), $\\rho(k)=\\phi^k$.",
    answer_kind: "exact",
    answer_value: "phi^k",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["time-series", "ar1", "acf"],
    source: "Classic AR(1) property",
    target_roles: ["Researcher"],
  },
  {
    slug: "ts-differencing-why-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Why Do We Difference an $I(1)$ Series?",
    prompt_md:
      "Suppose $X_t$ is $I(1)$ (has a unit root). Why does first differencing $\\Delta X_t = X_t - X_{t-1}$ often help before fitting an ARMA-type model?\n\nAnswer in 3–6 sentences.",
    solution_md:
      "Differencing removes the stochastic trend and can turn an $I(1)$ series into a stationary ($I(0)$) series, making autocovariances well-defined and standard ARMA assumptions more plausible. Many estimation/inference procedures for ARMA rely on stationarity; fitting ARMA directly to a unit-root process leads to spurious inference.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["time-series", "differencing", "stationarity"],
    source: "ARIMA fundamentals",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 45,
      rubric: [
        "States that differencing removes a unit root / stochastic trend: 55%",
        "Connects this to stationarity and valid ARMA assumptions/inference: 35%",
        "Mentions avoiding spurious regression/inference issues: 10%",
      ],
      reference_solution_md:
        "Differencing is used to remove a unit root so the transformed series is closer to stationary, enabling ARMA modeling and valid inference.\n",
    },
  },
  {
    slug: "ts-acf-vs-pacf-heuristic-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "ACF vs PACF — Model Identification Heuristic",
    prompt_md:
      "Give the common heuristic relationship between ACF/PACF patterns and AR($p$) vs MA($q$) models.\n\nYou do not need to be perfectly formal; focus on the practical \"cut off\" vs \"tail off\" rule.",
    solution_md:
      "Heuristic: for AR($p$), PACF cuts off after lag $p$ while ACF tails off; for MA($q$), ACF cuts off after lag $q$ while PACF tails off. For ARMA both can tail off.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["time-series", "acf", "pacf", "arma"],
    source: "Time series identification rules of thumb",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 45,
      rubric: [
        "Correctly pairs AR($p$) with PACF cutoff and ACF tail: 45%",
        "Correctly pairs MA($q$) with ACF cutoff and PACF tail: 45%",
        "Mentions ARMA case (both tail) or caveat about heuristics: 10%",
      ],
      reference_solution_md:
        "AR($p$): PACF cuts off at $p$, ACF tails. MA($q$): ACF cuts off at $q$, PACF tails. ARMA: both tail.\n",
    },
  },
  {
    slug: "ts-white-noise-vs-martingale-diff-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "White Noise vs Martingale Difference",
    prompt_md:
      "Explain the difference between (i) white noise and (ii) a martingale difference sequence.\n\nGive one example of a martingale difference sequence that is **not** white noise.",
    solution_md:
      "White noise typically means zero mean, constant variance, and no autocorrelation (often independence is additionally assumed). A martingale difference sequence satisfies $E[X_t\\mid\\mathcal{F}_{t-1}]=0$ for a filtration; it need not be uncorrelated at all lags unless additional conditions hold, and it need not be independent.\n\nExample: $X_t = \\varepsilon_t \\varepsilon_{t-1}$ with iid mean-zero noise can be a martingale difference but is not independent / can fail white-noise conditions depending on definition.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["time-series", "martingale", "conditioning"],
    source: "Econometrics interview prep",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 70,
      rubric: [
        "Defines martingale difference as $E[X_t\\mid\\mathcal{F}_{t-1}]=0$: 35%",
        "Defines white noise in terms of mean/variance and (un)correlatedness / independence: 35%",
        "Gives a valid example where MDS holds but white-noise (esp independence) fails: 30%",
      ],
      reference_solution_md:
        "MDS: $E[X_t|\\mathcal{F}_{t-1}]=0$. White noise: $E[X_t]=0$, $\\mathrm{Var}(X_t)=\\sigma^2$, and $\\mathrm{Cov}(X_t,X_{t-k})=0$ for $k\\neq 0$ (often plus independence). Example: nonlinear transformations can be MDS but not independent.\n",
    },
  },
  {
    slug: "ts-cointegration-intuition-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Cointegration — Interview Intuition",
    prompt_md:
      "Two series $(X_t)$ and $(Y_t)$ are each non-stationary (e.g., $I(1)$). What does it mean for them to be cointegrated?\n\nAnswer in 4–8 sentences, focusing on intuition and implications for modeling.",
    solution_md:
      "Cointegration means there exists a non-zero vector $(a,b)$ such that the linear combination $aX_t + bY_t$ is stationary (often $I(0)$) even though each series individually is $I(1)$. Intuitively, they share a common stochastic trend and a stable long-run equilibrium relationship. Modeling often uses an error-correction form: short-run changes respond to the deviation from the long-run equilibrium.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["time-series", "cointegration", "error-correction"],
    source: "Econometrics fundamentals",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 60,
      rubric: [
        "States the key definition: a linear combination is stationary while each series is non-stationary: 55%",
        "Explains shared trend / long-run equilibrium intuition: 25%",
        "Mentions error-correction modeling or implications for regression: 20%",
      ],
      reference_solution_md:
        "Cointegration: $X_t,Y_t$ are $I(1)$ but $aX_t+bY_t$ is $I(0)$ for some $(a,b)\\neq (0,0)$. Implies a stable long-run relationship; use error-correction form.\n",
    },
  },
  {
    slug: "ts-spurious-regression-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "Spurious Regression (Non-Stationary Series)",
    prompt_md:
      "You regress one random-walk-like series on another unrelated random-walk-like series and get a high $R^2$ and significant $t$-stats. What is the most likely explanation?",
    solution_md:
      "This is classic spurious regression: non-stationary series can appear highly correlated even when unrelated, violating OLS assumptions. Differencing or testing for cointegration is the remedy.",
    answer_kind: "mcq",
    answer_value: "spurious",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["time-series", "stationarity", "ols"],
    source: "Granger/Newbold spurious regression",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        {
          id: "spurious",
          label:
            "Spurious regression due to non-stationarity; standard inference is invalid.",
          correct: true,
        },
        {
          id: "regularization",
          label: "You forgot regularization, so the fit is overconfident.",
          correct: false,
        },
        {
          id: "hetero",
          label: "Heteroskedasticity alone explains the high $R^2$.",
          correct: false,
        },
        {
          id: "multicol",
          label: "Multicollinearity between regressors causes this.",
          correct: false,
        },
      ],
    },
  },
];

