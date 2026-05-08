import type { SeedQuestion } from "@/content/question-types";

/**
 * Stochastic / Random Walks / Martingales — interview-level probability.
 *
 * Focus: random walks, optional stopping intuition, Brownian basics, Ito
 * intuition (no heavy PDE/finance).
 */
export const STOCHASTIC_SEED: SeedQuestion[] = [
  {
    slug: "rw-simple-symmetric-martingale-freeform",
    topic: "Probability",
    track: "researcher",
    title: "Simple Symmetric Random Walk as a Martingale",
    prompt_md:
      "Let $S_0=0$ and $S_n=\\sum_{i=1}^n X_i$ where $X_i\\in\\{+1,-1\\}$ are iid with $P(X_i=1)=P(X_i=-1)=1/2$.\n\nShow that $(S_n)$ is a martingale with respect to the natural filtration $\\mathcal{F}_n=\\sigma(X_1,\\dots,X_n)$.",
    solution_md:
      "We need $E[S_{n+1}\\mid \\mathcal{F}_n]=S_n$. But $S_{n+1}=S_n+X_{n+1}$ and $X_{n+1}$ is independent of $\\mathcal{F}_n$ with mean $0$, so\n\n$$E[S_{n+1}\\mid \\mathcal{F}_n]=S_n+E[X_{n+1}]=S_n.$$",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["random-walk", "martingale", "conditioning"],
    source: "Standard stochastic processes",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 35,
      rubric: [
        "States martingale condition $E[S_{n+1}\\mid\\mathcal{F}_n]=S_n$: 30%",
        "Uses $S_{n+1}=S_n+X_{n+1}$ and independence of $X_{n+1}$ from $\\mathcal{F}_n$: 40%",
        "Uses $E[X_{n+1}]=0$ to conclude the result: 30%",
      ],
      reference_solution_md:
        "$$E[S_{n+1}|\\mathcal{F}_n]=E[S_n+X_{n+1}|\\mathcal{F}_n]=S_n+E[X_{n+1}]=S_n.$$",
    },
  },
  {
    slug: "rw-hitting-time-optional-stopping-intuition-freeform",
    topic: "Probability",
    track: "researcher",
    title: "Optional Stopping — When It Can Fail",
    prompt_md:
      "Optional stopping theorems have conditions. Give one reason (in plain language) why naively applying $E[M_\\tau]=E[M_0]$ for a martingale $(M_t)$ at a stopping time $\\tau$ can fail.\n\nGive a concrete example type: e.g. an unbounded stopping time, or a martingale with unbounded increments, etc.",
    solution_md:
      "It can fail when the stopping time is not integrable / has infinite expectation or when the martingale is not uniformly integrable; then expectation may not pass through the limit. A classic failure is the symmetric random walk stopped at the first hit of a far boundary as the boundary goes to infinity, or stopping at the first time the walk hits +1 (which has infinite expected time).",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["martingale", "optional-stopping", "pitfalls"],
    source: "Classic OST caveats",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 60,
      rubric: [
        "Mentions at least one real OST condition that can fail (integrability, boundedness, uniform integrability): 60%",
        "Explains the failure mode in words (expectation doesn't commute / infinite expectation): 25%",
        "Gives a plausible concrete example (random-walk hitting time, gambler's ruin limit, etc.): 15%",
      ],
      reference_solution_md:
        "Naive $E[M_\\tau]=E[M_0]$ can fail if $\\tau$ has infinite expectation or $M_\\tau$ is not integrable / not uniformly integrable. Classic: random walk stopped at an unbounded hitting time.\n",
    },
  },
  {
    slug: "bm-mean-and-variance-mcq",
    topic: "Probability",
    track: "researcher",
    title: "Brownian Motion — Mean and Variance",
    prompt_md:
      "For standard Brownian motion $(B_t)$, what are $E[B_t]$ and $\\mathrm{Var}(B_t)$?",
    solution_md:
      "Standard Brownian motion has $E[B_t]=0$ and $\\mathrm{Var}(B_t)=t$.",
    answer_kind: "mcq",
    answer_value: "0-and-t",
    answer_tolerance: null,
    difficulty: 1,
    tags: ["brownian-motion", "moments", "theorem-recall"],
    source: "Definition-level",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        { id: "0-and-t", label: "$E[B_t]=0,\\ \\mathrm{Var}(B_t)=t$", correct: true },
        { id: "0-and-1", label: "$E[B_t]=0,\\ \\mathrm{Var}(B_t)=1$", correct: false },
        { id: "t-and-t", label: "$E[B_t]=t,\\ \\mathrm{Var}(B_t)=t$", correct: false },
        { id: "t-and-1", label: "$E[B_t]=t,\\ \\mathrm{Var}(B_t)=1$", correct: false },
      ],
    },
  },
  {
    slug: "bm-independent-increments-mcq",
    topic: "Probability",
    track: "researcher",
    title: "Brownian Motion — Independent Increments",
    prompt_md:
      "Which statement about standard Brownian motion $(B_t)$ is true?",
    solution_md:
      "Brownian motion has independent increments: $B_t-B_s$ is independent of the past up to time $s$, and $B_t-B_s\\sim\\mathcal{N}(0,t-s)$.",
    answer_kind: "mcq",
    answer_value: "increments",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["brownian-motion", "increments"],
    source: "Definition-level",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        {
          id: "increments",
          label:
            "For $0\\le s<t$, $B_t-B_s$ is independent of $\\{B_u:u\\le s\\}$ and is $\\mathcal{N}(0,t-s)$.",
          correct: true,
        },
        {
          id: "bounded",
          label: "Paths of $B_t$ are differentiable almost surely.",
          correct: false,
        },
        {
          id: "finite-var",
          label: "Brownian paths have finite total variation on $[0,1]$ almost surely.",
          correct: false,
        },
        {
          id: "deterministic",
          label: "$B_t$ is deterministic given $B_1$.",
          correct: false,
        },
      ],
    },
  },
  {
    slug: "ito-intuition-freeform",
    topic: "Probability",
    track: "researcher",
    title: "Itô's Lemma — Intuition (No Full Proof)",
    prompt_md:
      "In one paragraph, explain why Itô's lemma has an extra $\\tfrac12 f''(X_t)\\sigma^2\\,dt$ term compared to the ordinary chain rule.\n\nYou may reference that Brownian increments scale like $\\sqrt{dt}$.",
    solution_md:
      "Because for stochastic increments $dX_t = \\mu\\,dt + \\sigma\\,dB_t$, the second-order term in the Taylor expansion doesn't vanish: $(dB_t)^2$ is of order $dt$ (since $dB_t\\sim\\mathcal{N}(0,dt)$), so the quadratic variation contributes a deterministic drift term. This yields the $\\tfrac12 f''\\sigma^2 dt$ correction.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["ito", "brownian-motion", "taylor"],
    source: "Shreve interview-level intuition",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 70,
      rubric: [
        "Mentions Taylor expansion and that the second-order term matters: 35%",
        "Explains scaling: $dB_t\\sim\\sqrt{dt}$ so $(dB_t)^2\\sim dt$ (quadratic variation): 45%",
        "Connects this to the extra $\\tfrac12 f''\\sigma^2 dt$ drift correction: 20%",
      ],
      reference_solution_md:
        "Because $dB_t$ is $O(\\sqrt{dt})$, the $(dB_t)^2$ term is $O(dt)$ and does not vanish; the quadratic variation produces the extra $\\tfrac12 f''(X_t)\\sigma^2dt$ term.\n",
    },
  },
  {
    slug: "rw-gamblers-ruin-hit-prob-biased-exact",
    topic: "Probability",
    track: "researcher",
    title: "Gambler’s Ruin: Hit Probability (Biased Walk)",
    prompt_md:
      "Let $(S_n)$ be a biased random walk on integers with steps +1 w.p. $p$ and -1 w.p. $q=1-p$, where $p\\ne 1/2$. Start at $S_0=i$ with absorbing barriers at 0 and N.\n\nCompute $P(\\text{hit }N\\text{ before }0\\mid S_0=i)$ as a closed form.",
    solution_md:
      "For $p\\ne q$, the standard result is:\n\n$$P_i=\\frac{1-(q/p)^i}{1-(q/p)^N}.$$\n\nDerivation uses that $( (q/p)^{S_n} )$ is a martingale and optional stopping at the hitting time of {0,N} (with bounded stopping time).",
    answer_kind: "exact",
    answer_value: "(1-(q/p)^i)/(1-(q/p)^N)",
    answer_tolerance: null,
    difficulty: 4,
    tags: ["random-walk", "optional-stopping", "gambler-ruin"],
    source: "Classic random walk",
    target_roles: ["Researcher"],
  },
  {
    slug: "rw-gamblers-ruin-expected-time-fair-exact",
    topic: "Probability",
    track: "researcher",
    title: "Gambler’s Ruin: Expected Time (Fair Walk)",
    prompt_md:
      "Let $(S_n)$ be a simple symmetric random walk on {0,1,...,N} with absorbing barriers at 0 and N. Start at $S_0=i$.\n\nCompute the expected absorption time $E_i[\\tau]$ where $\\tau=\\inf\\{n: S_n\\in\\{0,N\\}\\}$.",
    solution_md:
      "The classic result is:\n\n$$E_i[\\tau]=i(N-i).$$\n\nOne derivation uses that $S_n$ is a martingale and $S_n^2-n$ is also a martingale, then optional stopping at bounded time \\(\\tau\\).",
    answer_kind: "exact",
    answer_value: "i(N-i)",
    answer_tolerance: null,
    difficulty: 4,
    tags: ["random-walk", "hitting-time", "martingale"],
    source: "Classic",
    target_roles: ["Researcher"],
  },
  {
    slug: "rw-optional-stopping-why-bounded",
    topic: "Probability",
    track: "researcher",
    title: "Why Bounded Stopping Times Make OST Easier",
    prompt_md:
      "Explain (in 6–10 sentences) why many optional stopping results are easiest to justify when the stopping time \\(\\tau\\) is bounded.\n\nMention what tends to go wrong when \\(\\tau\\) is unbounded.",
    solution_md:
      "If \\(\\tau\\le T\\) almost surely, then \\(M_\\tau\\) is typically integrable whenever the martingale is integrable up to time T, and you avoid subtle limiting arguments. You can often write \\(E[M_\\tau]=E[M_T]\\) on the event \\(\\tau=T\\) and use tower property cleanly.\n\nWhen \\(\\tau\\) is unbounded, you need extra conditions (uniform integrability, bounded increments, or \\(E[\\tau]<\\infty\\)) to interchange limits and expectations; otherwise \\(E[M_\\tau]\\) may not exist or may differ from \\(E[M_0]\\).",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["martingale", "optional-stopping"],
    source: "Stochastic processes basics",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "States bounded \\(\\tau\\) avoids limiting arguments and usually preserves integrability: 45%",
        "Mentions what fails for unbounded \\(\\tau\\) (need UI, E[tau]<inf, may not interchange limit/expectation): 40%",
        "Uses correct terminology (integrability/uniform integrability) without major errors: 15%",
      ],
      reference_solution_md:
        "Bounded stopping times avoid delicate limit/expectation interchange and usually keep M_tau integrable. Unbounded tau requires extra conditions (UI, bounded increments, E[tau]<inf); otherwise E[M_tau] may not exist or may differ from E[M0].\n",
    },
  },
  {
    slug: "bm-scaling-property-mcq",
    topic: "Probability",
    track: "researcher",
    title: "Brownian Scaling Property",
    prompt_md:
      "Which statement is true for standard Brownian motion $(B_t)$?",
    solution_md:
      "Scaling: for any c>0, the process $\\{B_{ct}/\\sqrt{c}\\}$ is also a standard Brownian motion.",
    answer_kind: "mcq",
    answer_value: "scaling",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["brownian-motion", "scaling"],
    source: "Standard property",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        {
          id: "scaling",
          label: "For c>0, {B_{ct}/sqrt(c)} is a standard Brownian motion.",
          correct: true,
        },
        { id: "linear", label: "For c>0, {c B_t} is a standard Brownian motion.", correct: false },
        { id: "shift", label: "For c>0, {B_{t+c}} is a standard Brownian motion starting at 0.", correct: false },
        { id: "diff", label: "Brownian motion has differentiable paths a.s.", correct: false },
      ],
    },
  },
  {
    slug: "bm-reflection-principle-max",
    topic: "Probability",
    track: "researcher",
    title: "Reflection Principle: P(max_{s<=t} B_s >= a)",
    prompt_md:
      "Let $(B_t)$ be standard Brownian motion. Use the reflection principle to compute:\n\n$$P\\left(\\max_{0\\le s\\le t} B_s \\ge a\\right)$$\n\nfor a>0, in terms of the standard normal CDF Φ.",
    solution_md:
      "By reflection principle:\n\n$$P(\\max_{s\\le t} B_s \\ge a)=2P(B_t\\ge a)=2(1-\\Phi(a/\\sqrt{t})).$$",
    answer_kind: "exact",
    answer_value: "2*(1-Phi(a/sqrt(t)))",
    answer_tolerance: null,
    difficulty: 4,
    tags: ["brownian-motion", "reflection-principle"],
    source: "Classic",
    target_roles: ["Researcher"],
  },
  {
    slug: "bm-hitting-time-level-distribution",
    topic: "Probability",
    track: "researcher",
    title: "Brownian Hitting Time: P(τ_a <= t)",
    prompt_md:
      "Let $\\tau_a=\\inf\\{t\\ge 0: B_t=a\\}$ for standard Brownian motion and a>0.\n\nCompute $P(\\tau_a\\le t)$.",
    solution_md:
      "Using reflection principle, $P(\\tau_a\\le t)=P(\\max_{s\\le t} B_s\\ge a)=2(1-\\Phi(a/\\sqrt{t}))$.",
    answer_kind: "exact",
    answer_value: "2*(1-Phi(a/sqrt(t)))",
    answer_tolerance: null,
    difficulty: 4,
    tags: ["brownian-motion", "hitting-time", "reflection-principle"],
    source: "Classic",
    target_roles: ["Researcher"],
  },
  {
    slug: "bm-first-passage-density-shape-freeform",
    topic: "Probability",
    track: "researcher",
    title: "First Passage Time Density (Qualitative)",
    prompt_md:
      "For Brownian motion hitting a fixed level a>0, the density of \\(\\tau_a\\) has a heavy tail and infinite mean.\n\nExplain in 6–10 sentences why it is plausible that \\(E[\\tau_a]=\\infty\\) even though \\(P(\\tau_a<\\infty)=1\\).",
    solution_md:
      "Almost sure finiteness does not imply finite expectation: a random variable can be finite a.s. but have a heavy enough tail that the mean diverges. Brownian motion is recurrent, so it hits levels eventually, but the time to hit can sometimes be extremely large.\n\nThe first-passage distribution has tail roughly of order t^{-1/2}, which is not integrable for the first moment. Intuitively, long excursions away from the target level are possible with non-negligible probability.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["brownian-motion", "hitting-time", "tails"],
    source: "Classic insight",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 150,
      rubric: [
        "States a.s. finiteness does not imply finite mean; heavy tails can diverge: 45%",
        "Connects to Brownian recurrence but possibility of very long excursions: 35%",
        "Mentions tail-integral intuition (slow-decaying tail) at a high level: 20%",
      ],
      reference_solution_md:
        "A variable can be finite a.s. yet have infinite mean if tail decays too slowly. Brownian hits levels a.s. (recurrent) but can take extremely long via long excursions. First-passage tails are heavy enough that E[tau] diverges.\n",
    },
  },
  {
    slug: "quadratic-variation-bm-freeform",
    topic: "Probability",
    track: "researcher",
    title: "Quadratic Variation of Brownian Motion",
    prompt_md:
      "Define the quadratic variation of a process on [0,t] via a partition \\(\\Pi\\):\n\n$$[X]_t = \\lim_{|\\Pi|\\to 0} \\sum_{k}(X_{t_{k+1}}-X_{t_k})^2.$$\n\nWhat is \\([B]_t\\) for standard Brownian motion, and why does it matter for Itô calculus?",
    solution_md:
      "For Brownian motion, \\([B]_t = t\\) almost surely.\n\nThis matters because the quadratic variation is what makes the second-order term survive in Itô's lemma: heuristically, (dB_t)^2 behaves like dt, producing the extra drift correction.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["brownian-motion", "ito", "quadratic-variation"],
    source: "Stochastic calculus staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 140,
      rubric: [
        "States the result [B]_t = t (a.s.) correctly: 45%",
        "Gives a correct intuitive reason (sum of squared increments ~ t; increments variance add): 25%",
        "Connects quadratic variation to Ito correction term (dB^2 ~ dt): 30%",
      ],
      reference_solution_md:
        "Brownian quadratic variation satisfies [B]_t = t a.s. This is the key reason Ito calculus differs from ordinary calculus: (dB_t)^2 contributes at order dt, producing the Ito correction.\n",
    },
  },
  {
    slug: "ito-isometry-statement-freeform",
    topic: "Probability",
    track: "researcher",
    title: "Itô Isometry (Statement + Meaning)",
    prompt_md:
      "State the Itô isometry for an adapted square-integrable process \\(H_t\\) and explain (in 1–2 sentences) what it means.\n\nYou don't need a proof.",
    solution_md:
      "Itô isometry:\n\n$$E\\left[\\left(\\int_0^T H_t\\,dB_t\\right)^2\\right] = E\\left[\\int_0^T H_t^2\\,dt\\right].$$\n\nIt means the stochastic integral has variance equal to the L2 norm of the integrand over time, analogous to an isometry in Hilbert space.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["ito", "stochastic-integral"],
    source: "Stochastic calculus staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "States the Ito isometry formula correctly (with expectation and integral of H^2): 70%",
        "Mentions adapted/square-integrable condition (high level) without confusion: 15%",
        "Explains the meaning (variance/L2 isometry intuition) briefly: 15%",
      ],
      reference_solution_md:
        "E[(∫ H dB)^2] = E[∫ H^2 dt] for adapted square-integrable H. Meaning: stochastic integral preserves L2 norm (variance equals time integral of H^2).\n",
    },
  },
  {
    slug: "exponential-race-argmin-probability",
    topic: "Probability",
    track: "researcher",
    title: "Exponential Race: Who Arrives First?",
    prompt_md:
      "Let $X_i\\sim\\text{Exp}(\\lambda_i)$ be independent and let $I=\\arg\\min_i X_i$.\n\nCompute $P(I=k)$.",
    solution_md:
      "The probability the k-th exponential is the minimum is:\n\n$$P(I=k)=\\frac{\\lambda_k}{\\sum_{i=1}^n \\lambda_i}.$$\n\nThis can be shown by symmetry of competing hazards or by integrating the joint density of the minimum event.",
    answer_kind: "exact",
    answer_value: "lambda_k/sum_i lambda_i",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["exponential", "minimum", "memoryless"],
    source: "Classic exponential race",
    target_roles: ["Researcher"],
  },
  {
    slug: "poisson-thinning-proof-sketch-freeform",
    topic: "Probability",
    track: "researcher",
    title: "Poisson Thinning — Why It Stays Poisson",
    prompt_md:
      "Explain (in 6–10 sentences) why thinning a Poisson process with keep-probability p yields another Poisson process of rate pλ.\n\nNo full proof required, but outline the key idea (independent labeling, increments).",
    solution_md:
      "A Poisson process has independent increments and counts over an interval are Poisson(λt). If each arrival is independently labeled 'kept' with probability p, then conditional on N arrivals in an interval, the kept count is Binomial(N,p). Mixing Binomial(N,p) over N~Poisson(λt) yields Poisson(pλt).\n\nIndependence across disjoint intervals is preserved because labeling is independent and original increments are independent, so the thinned process is Poisson with rate pλ.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["poisson", "thinning", "processes"],
    source: "Classic fact",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 150,
      rubric: [
        "Mentions conditional Binomial given Poisson count and mixing yields Poisson(pλt): 55%",
        "Mentions independent increments preserved under independent labeling: 25%",
        "Gives correct rate and avoids major misconceptions: 20%",
      ],
      reference_solution_md:
        "Conditional on N arrivals, kept count is Binomial(N,p). Mixing with N~Poisson(λt) gives Poisson(pλt). Independent labeling preserves independent increments, so the thinned process is Poisson with rate pλ.\n",
    },
  },
  {
    slug: "martingale-transform-definition",
    topic: "Probability",
    track: "researcher",
    title: "Martingale Transform (Definition + Example)",
    prompt_md:
      "What is a martingale transform? Give a simple example using a random walk.\n\nAnswer in 6–10 sentences.",
    solution_md:
      "Given a martingale (M_n) and a predictable sequence (H_n) (i.e., H_n is F_{n-1}-measurable), the transformed process\n\n$$\\sum_{k=1}^n H_k (M_k - M_{k-1})$$\n\nis a martingale under suitable integrability. Example: for a random walk S_n (a martingale), choose H_k based on past (e.g., H_k=1_{S_{k-1}>0}) to form a martingale representing gains from a predictable betting strategy.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["martingale", "stopping-times"],
    source: "Stochastic processes staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 160,
      rubric: [
        "Defines martingale transform using predictable H_k multiplying increments: 55%",
        "Mentions predictability (H_k measurable w.r.t. past filtration) correctly: 25%",
        "Gives a coherent random-walk example of H_k based on past: 20%",
      ],
      reference_solution_md:
        "Martingale transform: with martingale M and predictable H_k (F_{k-1}-measurable), sum H_k ΔM_k is a martingale (under integrability). Example: random walk increments with H_k based on sign of S_{k-1} forms a martingale representing predictable betting.\n",
    },
  },
  {
    slug: "doob-optional-stopping-bounded-example",
    topic: "Probability",
    track: "researcher",
    title: "Apply OST in a Bounded Case (Quick)",
    prompt_md:
      "Let $S_n$ be a simple symmetric random walk with $S_0=i$ and absorbing barriers at 0 and N. Let \\(\\tau\\) be the hitting time of {0,N}.\n\nUsing that $S_n$ is a martingale and \\(\\tau\\) is bounded by the gambler's ruin setup, show in one line how to derive $P(S_\\tau=N)=i/N$.",
    solution_md:
      "Optional stopping: $E[S_\\tau]=E[S_0]=i$. But $S_\\tau\\in\\{0,N\\}$, so $E[S_\\tau]=N\\,P(S_\\tau=N)$. Thus $P(S_\\tau=N)=i/N$.",
    answer_kind: "exact",
    answer_value: "i/N",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["random-walk", "optional-stopping"],
    source: "Classic",
    target_roles: ["Researcher"],
  },
];

