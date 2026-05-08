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
];

