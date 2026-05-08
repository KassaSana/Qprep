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
    slug: "ts-ar1-stationarity-condition-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "AR(1) Stationarity Condition",
    prompt_md:
      "For $X_t = \\phi X_{t-1} + \\varepsilon_t$ with iid noise, which condition on $\\phi$ ensures a weakly stationary solution exists?",
    solution_md:
      "A stationary AR(1) requires $|\\phi|<1$.",
    answer_kind: "mcq",
    answer_value: "abslt1",
    answer_tolerance: null,
    difficulty: 1,
    tags: ["time-series", "ar1", "stationarity"],
    source: "AR(1) basics",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        { id: "abslt1", label: "$|\\phi|<1$", correct: true },
        { id: "absle1", label: "$|\\phi|\\le 1$", correct: false },
        { id: "phi0", label: "$\\phi=0$", correct: false },
        { id: "philarge", label: "$|\\phi|>1$", correct: false },
      ],
    },
  },
  {
    slug: "ts-walk-forward-validation-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Walk-Forward Validation (Time Series)",
    prompt_md:
      "Describe walk-forward (rolling-origin) validation for time series forecasting.\n\nIn 4–8 sentences: explain the split procedure and why it avoids leakage.",
    solution_md:
      "Walk-forward validation uses a sequence of train/validation splits that respect time order: train on an initial window, validate on the next block; then expand or roll the training window forward and validate on the subsequent block, repeating. This avoids leakage because each validation window occurs strictly after the data used for training and preprocessing.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["time-series", "evaluation", "leakage"],
    source: "Forecasting evaluation best practices",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 70,
      rubric: [
        "Describes repeated forward-in-time splits (train window before validation window): 55%",
        "Explains why this avoids leakage / respects causality: 35%",
        "Mentions expanding vs rolling training window (either is fine): 10%",
      ],
      reference_solution_md:
        "Walk-forward: train on past, validate on the next future block; move forward and repeat. Avoids leakage because validation is always after training.\n",
    },
  },
  {
    slug: "ts-ljung-box-what-tests-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "Ljung–Box Test — What Does It Test?",
    prompt_md:
      "What is the Ljung–Box test commonly used to test in time series modeling?",
    solution_md:
      "It tests whether a set of autocorrelations up to some lag are jointly zero (i.e., whether residuals look like white noise). Often used as a diagnostic on model residuals.",
    answer_kind: "mcq",
    answer_value: "autocorr",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["time-series", "diagnostics", "autocorrelation"],
    source: "Time series diagnostics",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        {
          id: "autocorr",
          label:
            "Whether autocorrelations up to a chosen lag are jointly zero (residuals are consistent with white noise).",
          correct: true,
        },
        { id: "unitroot", label: "Whether the series has a unit root (non-stationarity).", correct: false },
        { id: "hetero", label: "Whether the errors are heteroskedastic (ARCH effects).", correct: false },
        { id: "normal", label: "Whether the innovations are Gaussian.", correct: false },
      ],
    },
  },
  {
    slug: "ts-seasonality-handling-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Handling Seasonality",
    prompt_md:
      "You observe strong weekly seasonality in a daily series. Give two ways to model or remove seasonality before/while fitting a forecasting model.\n\nAnswer in 4–8 sentences.",
    solution_md:
      "Options include: seasonal differencing (e.g. $X_t-X_{t-7}$), adding seasonal dummy variables, Fourier terms, or using a seasonal ARIMA/SARIMAX specification. You can also decompose into trend/seasonal/residual components and model the residuals, or use models that naturally capture seasonality (e.g. TBATS/Prophet-style components).",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["time-series", "seasonality", "modeling"],
    source: "Forecasting fundamentals",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 70,
      rubric: [
        "Gives two distinct seasonality strategies (seasonal differencing, dummies, Fourier, SARIMA, decomposition): 70%",
        "Explains at least one briefly in terms of what it removes/captures: 20%",
        "Keeps the answer time-order aware (no random splits / no leakage): 10%",
      ],
      reference_solution_md:
        "E.g. seasonal differencing $X_t-X_{t-7}$, seasonal dummies/Fourier terms, SARIMA/SARIMAX, or decomposition then model residual.\n",
    },
  },
  {
    slug: "ts-trend-stationary-vs-difference-stationary-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Trend-Stationary vs Difference-Stationary",
    prompt_md:
      "Explain the difference between a trend-stationary process and a difference-stationary (unit-root) process.\n\nIn 5–10 sentences: mention what transformation makes each stationary and what shocks do (temporary vs permanent).",
    solution_md:
      "Trend-stationary: $X_t$ can be written as deterministic trend + stationary noise; detrending makes it stationary. Shocks are temporary in the sense deviations revert around the trend.\n\nDifference-stationary: $X_t$ has a unit root; differencing makes it stationary. Shocks have persistent/permanent effects on the level because they accumulate (random-walk-like behavior).",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["time-series", "stationarity", "unit-root"],
    source: "Econometrics fundamentals",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 90,
      rubric: [
        "Defines trend-stationary via deterministic trend + stationary residual; detrending yields stationarity: 40%",
        "Defines difference-stationary via unit root; differencing yields stationarity: 40%",
        "Contrasts shock behavior (temporary vs permanent/persistent): 20%",
      ],
      reference_solution_md:
        "Trend-stationary: detrend to get stationary; shocks are mean-reverting around trend. Difference-stationary: unit root; difference to get stationary; shocks persist in levels.\n",
    },
  },
  {
    slug: "ts-arma-vs-arima-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "ARMA vs ARIMA",
    prompt_md:
      "What is the key difference between an ARMA model and an ARIMA model?",
    solution_md:
      "ARIMA includes an integration/differencing step (the I component) to handle non-stationarity; ARMA assumes stationarity in levels.",
    answer_kind: "mcq",
    answer_value: "differencing",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["time-series", "arima", "arma"],
    source: "Forecasting basics",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        { id: "differencing", label: "ARIMA includes differencing (integration) to handle non-stationarity.", correct: true },
        { id: "nonlinear", label: "ARIMA is nonlinear, while ARMA is linear.", correct: false },
        { id: "bayes", label: "ARIMA is Bayesian, while ARMA is frequentist.", correct: false },
        { id: "only-seasonal", label: "ARIMA is only for seasonal data, ARMA is only for non-seasonal data.", correct: false },
      ],
    },
  },
  {
    slug: "ts-forecast-metrics-mape-smape-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "Forecasting Metrics — MAPE Pitfall",
    prompt_md:
      "Why can MAPE (mean absolute percentage error) be a problematic metric for forecasting?",
    solution_md:
      "MAPE divides by the true value; it can explode or be undefined when actuals are near zero and it is asymmetric (penalizes over/under differently in practice). Alternatives include sMAPE, MAE, RMSE, or scaled errors.",
    answer_kind: "mcq",
    answer_value: "near-zero",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["time-series", "metrics", "evaluation"],
    source: "Forecasting practice",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      options: [
        { id: "near-zero", label: "It can blow up / be undefined when actuals are near zero (division by small numbers).", correct: true },
        { id: "convex", label: "It is non-convex, so it cannot be minimized.", correct: false },
        { id: "always-better", label: "It is always better than MAE/RMSE.", correct: false },
        { id: "scale", label: "It is scale-dependent, unlike RMSE.", correct: false },
      ],
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

