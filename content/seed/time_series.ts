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
    slug: "ts-kpss-null-hypothesis-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "KPSS Test — Null Hypothesis",
    prompt_md:
      "In the KPSS test, what is the usual null hypothesis (in contrast to ADF)?",
    solution_md:
      "KPSS typically has null of stationarity (around a level or trend depending on specification), with alternative of unit root / non-stationarity.",
    answer_kind: "mcq",
    answer_value: "stationary",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["time-series", "kpss", "stationarity"],
    source: "Econometrics basics",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        { id: "stationary", label: "The series is stationary (level- or trend-stationary depending on version).", correct: true },
        { id: "unitroot", label: "The series has a unit root (non-stationary).", correct: false },
        { id: "normal", label: "Innovations are Gaussian.", correct: false },
        { id: "no-autocorr", label: "No autocorrelation at any lag.", correct: false },
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
    slug: "ts-overdifferencing-what-happens-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Over-Differencing — What Happens?",
    prompt_md:
      "What can go wrong if you difference a series more times than necessary (over-differencing)?\n\nAnswer in 4–8 sentences. Mention at least one symptom in ACF/PACF or forecast behavior.",
    solution_md:
      "Over-differencing can introduce unnecessary moving-average structure and amplify noise, making the series harder to model and forecasts more volatile. It can create negative autocorrelation at lag 1 and distort ACF/PACF patterns, leading to overfitting with extra MA terms. It can also remove genuine low-frequency signal (trend) you might want to model explicitly.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["time-series", "differencing", "arma"],
    source: "ARIMA modeling practice",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 80,
      rubric: [
        "Explains over-differencing adds unnecessary MA-like structure / increases noise: 55%",
        "Mentions a concrete symptom (negative lag-1 autocorrelation, distorted ACF/PACF, volatile forecasts): 30%",
        "Mentions loss of low-frequency signal / removing meaningful trend: 15%",
      ],
      reference_solution_md:
        "Over-differencing can add MA structure and amplify noise (often negative lag-1 autocorrelation), distort ACF/PACF, and produce volatile forecasts; it may remove meaningful low-frequency signal.\n",
    },
  },
  {
    slug: "ts-feature-leakage-rolling-window-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Leakage via Rolling Windows",
    prompt_md:
      "Give one example of how rolling-window features can accidentally leak future information in time-series ML, and how to fix it.\n\nAnswer in 4–8 sentences.",
    solution_md:
      "Leakage can occur if you compute a centered rolling mean (uses future points) or compute rolling statistics over a window that extends past the prediction timestamp. Fix by using strictly backward-looking (causal) windows with explicit cutoffs and by writing unit tests that assert feature timestamps are <= label timestamp.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["time-series", "leakage", "features"],
    source: "Practical time-series ML",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 75,
      rubric: [
        "Provides a concrete leakage example (centered window, future-inclusive window, label lookahead): 55%",
        "Provides a concrete fix (causal windows, strict cutoffs, fit-on-train): 35%",
        "Mentions timestamp discipline/tests as a guardrail: 10%",
      ],
      reference_solution_md:
        "Leakage: centered rolling stats or windows extending into future. Fix: strictly backward-looking windows and timestamp cutoffs; add tests enforcing causality.\n",
    },
  },
  {
    slug: "ts-arima-order-selection-aic-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "ARIMA Order Selection — AIC",
    prompt_md:
      "A common way to select ARIMA(p,d,q) orders among candidate models is to minimize which criterion?",
    solution_md: "AIC (or BIC) is commonly used; AIC is a standard default in many workflows.",
    answer_kind: "mcq",
    answer_value: "aic",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["time-series", "arima", "model-selection"],
    source: "Forecasting practice",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        { id: "aic", label: "AIC (Akaike Information Criterion)", correct: true },
        { id: "mse-train", label: "Training-set MSE only", correct: false },
        { id: "pvalue", label: "Smallest p-value among coefficients", correct: false },
        { id: "accuracy", label: "Classification accuracy", correct: false },
      ],
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
    slug: "ts-arch-effects-what-are-they-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "ARCH Effects",
    prompt_md:
      "In time series, what does it mean to see ARCH effects in residuals?",
    solution_md:
      "ARCH effects mean conditional heteroskedasticity: variance changes over time and depends on past squared residuals; residuals may be uncorrelated but their squares are autocorrelated.",
    answer_kind: "mcq",
    answer_value: "cond-var",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["time-series", "heteroskedasticity", "diagnostics"],
    source: "Time series diagnostics",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        { id: "cond-var", label: "Conditional variance varies over time; squared residuals are autocorrelated.", correct: true },
        { id: "unitroot", label: "The series has a unit root (non-stationary mean).", correct: false },
        { id: "seasonal", label: "The series has deterministic seasonality.", correct: false },
        { id: "iid", label: "Residuals are iid Gaussian with constant variance.", correct: false },
      ],
    },
  },
  {
    slug: "ts-granger-causality-what-it-means-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Granger Causality — What Does It Mean?",
    prompt_md:
      "Explain what it means for a time series $X$ to Granger-cause another series $Y$.\n\nAnswer in 4–8 sentences, and explicitly state what it does *not* imply.",
    solution_md:
      "$X$ Granger-causes $Y$ if past values of $X$ provide additional predictive power for $Y$ beyond what past values of $Y$ already provide (typically in a VAR/regression framework). It is a statement about predictability with lags, not true causal mechanism; it does not imply interventions on $X$ will change $Y$ without additional assumptions.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["time-series", "causality", "forecasting"],
    source: "Econometrics interview staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 80,
      rubric: [
        "Defines Granger causality in terms of incremental predictive power using lagged $X$: 60%",
        "Mentions conditioning on past $Y$ / baseline autoregressive info: 25%",
        "Explicitly states it is not true causal intervention causality: 15%",
      ],
      reference_solution_md:
        "Granger-cause: lagged $X$ improves prediction of $Y$ beyond lagged $Y$ alone. It's predictability, not mechanistic causality.\n",
    },
  },
  {
    slug: "ts-var-what-is-it-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "VAR — What Is It?",
    prompt_md:
      "What is a vector autoregression (VAR) model?\n\nIn 4–8 sentences: describe the idea, what it models, and one common use (forecasting, impulse responses).",
    solution_md:
      "A VAR models multiple time series jointly, where each variable is regressed on lagged values of itself and lagged values of the other variables. It captures dynamic interdependence and can be used for multivariate forecasting and for analyzing dynamic responses via impulse response functions and forecast error variance decompositions (with identification assumptions).",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["time-series", "var", "forecasting"],
    source: "Econometrics basics",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 80,
      rubric: [
        "Defines VAR as multivariate autoregression using lagged values of all variables: 60%",
        "Mentions joint modeling / interdependence (not separate univariate ARs): 20%",
        "Mentions one application (forecasting or impulse responses): 20%",
      ],
      reference_solution_md:
        "VAR: vector time series where each component depends on lags of all components. Used for multivariate forecasting and impulse responses.\n",
    },
  },
  {
    slug: "ts-impulse-response-what-is-it-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Impulse Response — What Is It?",
    prompt_md:
      "In VAR modeling, what is an impulse response function (IRF)?\n\nAnswer in 4–8 sentences. Mention identification caveat (ordering/structural assumptions).",
    solution_md:
      "An IRF traces how a shock to one variable (or one equation's innovation) propagates through the system over future horizons, affecting the variables over time. In reduced-form VARs, innovations are correlated; to interpret a shock as a structural impulse, you need identification (e.g. Cholesky ordering, sign restrictions, external instruments). Different identification choices can change the IRFs.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["time-series", "var", "irf"],
    source: "Econometrics basics",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 85,
      rubric: [
        "Defines IRF as dynamic response path over time horizons to a shock: 55%",
        "Mentions cross-variable propagation in multivariate system: 20%",
        "Mentions identification caveat (ordering/structural assumptions): 25%",
      ],
      reference_solution_md:
        "IRF: response of variables over time to a shock. In VARs, need identification (Cholesky/sign restrictions/instruments) to interpret shocks structurally.\n",
    },
  },
  {
    slug: "ts-forecast-horizon-direct-vs-iterated-mcq",
    topic: "Statistics",
    track: "researcher",
    title: "Forecasting — Direct vs Iterated",
    prompt_md:
      "In time series forecasting, what is a common downside of iterated (recursive) multi-step forecasting using a one-step model?",
    solution_md:
      "Errors can compound as predictions are fed back in as inputs, leading to drift/instability at longer horizons. Direct multi-step models avoid feeding predictions as inputs but require separate models per horizon.",
    answer_kind: "mcq",
    answer_value: "error-compound",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["time-series", "forecasting", "evaluation"],
    source: "Forecasting practice",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      options: [
        { id: "error-compound", label: "Forecast errors can compound when predictions are fed back recursively.", correct: true },
        { id: "always-better", label: "Iterated forecasting is always better than direct forecasting.", correct: false },
        { id: "no-data", label: "It requires no historical data beyond one step.", correct: false },
        { id: "only-linear", label: "It only works for linear models.", correct: false },
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
    slug: "ts-engle-granger-two-step-intuition-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Engle–Granger (Two-Step) Cointegration Test — Intuition",
    prompt_md:
      "Describe the Engle–Granger two-step procedure for testing cointegration between two $I(1)$ series.\n\nAnswer in 5–10 sentences and include what you test in step 2.",
    solution_md:
      "Step 1: regress one series on the other (possibly with intercept/trend) to estimate the long-run relation and obtain residuals $\\hat u_t$.\n\nStep 2: test the residuals for stationarity (unit root test on $\\hat u_t$, e.g. ADF with modified critical values). If residuals are stationary, the series are cointegrated (the linear combination is $I(0)$).",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["time-series", "cointegration", "adf"],
    source: "Econometrics staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 95,
      rubric: [
        "States step 1 regression to estimate long-run relation and extract residuals: 45%",
        "States step 2 tests residuals for stationarity / unit root (ADF on residuals): 45%",
        "Concludes stationarity of residuals implies cointegration: 10%",
      ],
      reference_solution_md:
        "Engle–Granger: regress to get residuals, then unit-root test residuals. Stationary residuals → cointegration.\n",
    },
  },
  {
    slug: "ts-vecm-intuition-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "VECM — Intuition",
    prompt_md:
      "What is a vector error correction model (VECM), and when do you use it?\n\nAnswer in 5–10 sentences, referencing cointegration and error-correction term.",
    solution_md:
      "A VECM is a reparameterization of a VAR for cointegrated $I(1)$ series. It models differences (short-run dynamics) while including an error-correction term that measures deviation from the long-run cointegrating relationship. You use it when multiple non-stationary series are cointegrated: it preserves long-run equilibrium while allowing short-run adjustment dynamics.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["time-series", "cointegration", "vecm"],
    source: "Econometrics staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 95,
      rubric: [
        "States VECM is used for cointegrated $I(1)$ series (VAR with cointegration): 50%",
        "Mentions modeling differences + an error-correction term for long-run equilibrium: 40%",
        "Mentions short-run adjustment dynamics interpretation: 10%",
      ],
      reference_solution_md:
        "VECM: VAR form for cointegrated I(1) series; models differences plus an error-correction term capturing deviations from long-run equilibrium.\n",
    },
  },
  {
    slug: "ts-cross-correlation-why-care-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "Cross-Correlation — Why It Matters",
    prompt_md:
      "What is the cross-correlation function between two time series, and what can it be used for?\n\nAnswer in 4–8 sentences and mention lag relationships.",
    solution_md:
      "Cross-correlation measures correlation between $X_t$ and $Y_{t+k}$ as a function of lag $k$, capturing lead–lag relationships. It can be used to identify whether one series tends to move before the other (predictive lags), guide feature engineering (lagged predictors), and diagnose relationships in multivariate time series. Interpretation requires care due to autocorrelation and confounding.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["time-series", "correlation", "lags"],
    source: "Time series basics",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 80,
      rubric: [
        "Defines cross-correlation as correlation across lags (X_t with Y_{t+k}): 55%",
        "Mentions lead–lag / predictive lag use: 30%",
        "Mentions caveat about autocorrelation/confounding or need for care: 15%",
      ],
      reference_solution_md:
        "Cross-correlation: corr(X_t, Y_{t+k}) vs k; used for lead–lag/predictive lag discovery and lagged features, but interpret carefully due to autocorrelation/confounding.\n",
    },
  },
  {
    slug: "ts-var-stability-what-means-freeform",
    topic: "Statistics",
    track: "researcher",
    title: "VAR Stability Condition (High Level)",
    prompt_md:
      "What does it mean for a VAR model to be stable/stationary?\n\nAnswer in 4–8 sentences and mention the eigenvalue/spectral-radius criterion at a high level.",
    solution_md:
      "A VAR is stable if shocks do not cause the system to explode and the process has a stationary distribution (in levels). In matrix form, stability corresponds to the eigenvalues of the companion matrix lying inside the unit circle (spectral radius < 1). This ensures impulse responses decay over time and forecasts remain bounded.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["time-series", "var", "stationarity"],
    source: "VAR theory basics",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 80,
      rubric: [
        "Defines stability as non-explosive / stationary behavior with decaying shocks: 45%",
        "Mentions eigenvalues/companion matrix inside unit circle (spectral radius < 1): 45%",
        "Connects to bounded forecasts / decaying impulse responses: 10%",
      ],
      reference_solution_md:
        "Stable VAR: eigenvalues of companion matrix inside unit circle (spectral radius < 1), so shocks decay and process is stationary/bounded.\n",
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

