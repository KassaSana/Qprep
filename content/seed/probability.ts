import type { SeedQuestion } from "@/content/question-types";

/**
 * Probability problems — the largest topic in the bank.
 * Bayes, expectation, random walks, combinatorial sample-space counting.
 *
 * Existing v1 researcher questions (mostly probability) are migrated here
 * unchanged except for the new `topic` discriminator and optional `companies`
 * column. Tags are preserved so the local-dev tag-driven nudge generator
 * keeps producing the right hint flavor.
 */
export const PROBABILITY_SEED: SeedQuestion[] = [
  {
    slug: "two-dice-sum-seven",
    topic: "Probability",
    track: "researcher",
    title: "Two Dice, Sum of Seven",
    prompt_md:
      "You roll two fair six-sided dice. What is the probability that the sum is exactly $7$?",
    solution_md:
      "There are $36$ equally likely outcomes. The pairs summing to $7$ are $(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)$ — six of them. So $P = 6/36 = 1/6$.",
    answer_kind: "fraction",
    answer_value: "1/6",
    answer_tolerance: 1e-3,
    difficulty: 1,
    tags: ["combinatorics", "uniform", "warm-up"],
    companies: ["Jane Street"],
    source: "Classic",
  },
  {
    slug: "monty-hall-switch",
    topic: "Probability",
    track: "researcher",
    title: "Monty Hall — Always Switch",
    prompt_md:
      "Three doors hide one car and two goats. You pick a door; the host (who knows where the car is) opens a different door revealing a goat, then offers you the chance to switch. What is the probability of winning the car if you always switch?",
    solution_md:
      "Your initial pick is correct with probability $1/3$, in which case switching loses. With probability $2/3$ your pick is wrong, in which case switching wins.",
    answer_kind: "fraction",
    answer_value: "2/3",
    answer_tolerance: 1e-3,
    difficulty: 2,
    tags: ["bayes", "conditioning", "classic"],
    companies: ["Citadel", "Two Sigma"],
    source: "Selvin / Savant",
  },
  {
    slug: "two-children-at-least-one-boy",
    topic: "Probability",
    track: "researcher",
    title: "Two Children — At Least One Boy",
    prompt_md:
      "A family has two children. Given that at least one of them is a boy, what is the probability that both are boys? Assume each child is independently a boy or girl with probability $1/2$.",
    solution_md:
      "Sample space conditional on at least one boy is $\\{BB, BG, GB\\}$, each with probability $1/3$. Only $BB$ gives two boys.",
    answer_kind: "fraction",
    answer_value: "1/3",
    answer_tolerance: 1e-3,
    difficulty: 2,
    tags: ["bayes", "conditioning"],
    companies: ["Jane Street"],
    source: "Gardner",
  },
  {
    slug: "disease-test-bayes",
    topic: "Probability",
    track: "researcher",
    title: "Disease Test — Posterior",
    prompt_md:
      "A disease has prevalence $1\\%$ in the population. A test is $99\\%$ sensitive (true-positive rate) and $99\\%$ specific (true-negative rate). Given a positive test, what is the probability the patient actually has the disease? Round to 2 decimal places.",
    solution_md:
      "$P(D \\mid +) = \\dfrac{0.99 \\cdot 0.01}{0.99 \\cdot 0.01 + 0.01 \\cdot 0.99} = \\dfrac{0.0099}{0.0198} = 0.50$.",
    answer_kind: "numeric",
    answer_value: "0.5",
    answer_tolerance: 0.01,
    difficulty: 2,
    tags: ["bayes", "applied"],
    companies: ["D. E. Shaw"],
    source: "Classic",
  },
  {
    slug: "expected-rolls-until-six",
    topic: "Probability",
    track: "researcher",
    title: "Expected Rolls Until a Six",
    prompt_md:
      "You roll a fair six-sided die repeatedly until you see a $6$. What is the expected number of rolls (including the final $6$)?",
    solution_md:
      "This is geometric with success probability $p = 1/6$, so $E[N] = 1/p = 6$.",
    answer_kind: "numeric",
    answer_value: "6",
    answer_tolerance: 1e-6,
    difficulty: 1,
    tags: ["expectation", "geometric"],
    source: "Classic",
  },
  {
    slug: "expected-flips-until-hh",
    topic: "Probability",
    track: "researcher",
    title: "Expected Flips Until Two Heads in a Row",
    prompt_md:
      "You flip a fair coin until you see two heads in a row (HH). What is the expected number of flips?",
    solution_md:
      "Let $E$ be the expected number of flips. From the start: with probability $1/2$ flip a tail (back to start, used $1$ flip); with probability $1/2$ flip a head and move to state $H$. From $H$: with probability $1/2$ another head ends in $1$ more flip; with probability $1/2$ tail returns to start using $1$ flip. Solving: $E = 6$.",
    answer_kind: "numeric",
    answer_value: "6",
    answer_tolerance: 1e-6,
    difficulty: 3,
    tags: ["expectation", "markov-chain"],
    companies: ["Jane Street", "SIG"],
    source: "Classic interview",
  },
  {
    slug: "expected-flips-until-ht",
    topic: "Probability",
    track: "researcher",
    title: "Expected Flips Until HT",
    prompt_md:
      "You flip a fair coin until you see the pattern HT (a head immediately followed by a tail). What is the expected number of flips?",
    solution_md:
      "Wait $2$ flips on average for the first H, then $2$ more on average for a T. Answer: $4$.",
    answer_kind: "numeric",
    answer_value: "4",
    answer_tolerance: 1e-6,
    difficulty: 3,
    tags: ["expectation", "patterns"],
    source: "Classic interview",
  },
  {
    slug: "max-of-two-dice",
    topic: "Probability",
    track: "researcher",
    title: "Expected Max of Two Dice",
    prompt_md:
      "You roll two independent fair six-sided dice and take $M = \\max(X_1, X_2)$. Compute $E[M]$. Round to 4 decimal places if needed.",
    solution_md:
      "$P(M \\le k) = (k/6)^2$, so $P(M = k) = (k^2 - (k-1)^2)/36 = (2k-1)/36$. Then $E[M] = \\sum_{k=1}^6 k(2k-1)/36 = 161/36 \\approx 4.4722$.",
    answer_kind: "fraction",
    answer_value: "161/36",
    answer_tolerance: 1e-3,
    difficulty: 3,
    tags: ["expectation", "order-statistics"],
    source: "Classic",
  },
  {
    slug: "coupon-collector-four",
    topic: "Probability",
    track: "researcher",
    title: "Coupon Collector (n = 4)",
    prompt_md:
      "Cereal boxes contain one of $4$ equally likely coupons. What is the expected number of boxes you must buy to collect all $4$ different coupons?",
    solution_md:
      "$E = n \\sum_{k=1}^{n} 1/k = 4(1 + 1/2 + 1/3 + 1/4) = 4 \\cdot 25/12 = 25/3 \\approx 8.3333$.",
    answer_kind: "fraction",
    answer_value: "25/3",
    answer_tolerance: 1e-3,
    difficulty: 3,
    tags: ["expectation", "harmonic"],
    source: "Classic",
  },
  {
    slug: "birthday-23",
    topic: "Probability",
    track: "researcher",
    title: "Birthday Problem — 23 People",
    prompt_md:
      "In a room of $23$ people (assume $365$ equally likely birthdays, no leap years, independent), what is the probability that at least two share a birthday? Round to 2 decimal places.",
    solution_md:
      "$P(\\text{all distinct}) = \\prod_{k=0}^{22}(365-k)/365 \\approx 0.4927$, so $P(\\text{collision}) \\approx 0.5073$.",
    answer_kind: "numeric",
    answer_value: "0.51",
    answer_tolerance: 0.02,
    difficulty: 2,
    tags: ["combinatorics", "approximation"],
    companies: ["Two Sigma"],
    source: "Classic",
  },
  {
    slug: "ace-in-five-card-hand",
    topic: "Probability",
    track: "researcher",
    title: "At Least One Ace in 5 Cards",
    prompt_md:
      "You deal a $5$-card hand from a standard $52$-card deck. What is the probability the hand contains at least one ace? Round to 4 decimal places.",
    solution_md:
      "$1 - \\binom{48}{5}/\\binom{52}{5} = 1 - 1712304/2598960 \\approx 0.3412$.",
    answer_kind: "numeric",
    answer_value: "0.3412",
    answer_tolerance: 0.001,
    difficulty: 2,
    tags: ["combinatorics", "complement"],
    source: "Classic",
  },
  {
    slug: "stick-broken-triangle",
    topic: "Probability",
    track: "researcher",
    title: "Broken Stick — Triangle",
    prompt_md:
      "A stick of unit length is broken at two points chosen independently and uniformly at random along its length. What is the probability that the three pieces form a triangle?",
    solution_md:
      "By the triangle inequality, no piece may exceed $1/2$. A direct geometric argument gives $1/4$.",
    answer_kind: "fraction",
    answer_value: "1/4",
    answer_tolerance: 1e-3,
    difficulty: 4,
    tags: ["geometry", "uniform", "classic"],
    companies: ["Jane Street"],
    source: "50 Challenging Problems",
  },
  {
    slug: "hat-check-fixed-points",
    topic: "Probability",
    track: "researcher",
    title: "Hat-Check — Expected Matches",
    prompt_md:
      "$n$ people throw their hats into a pile, then each retrieves a hat uniformly at random. What is the expected number of people who get their own hat back? (Answer in closed form.)",
    solution_md:
      "By linearity, $E[\\text{matches}] = \\sum P(\\text{person } i \\text{ gets own}) = n \\cdot 1/n = 1$.",
    answer_kind: "numeric",
    answer_value: "1",
    answer_tolerance: 1e-9,
    difficulty: 2,
    tags: ["linearity-of-expectation", "permutations"],
    source: "Classic",
  },
  {
    slug: "geometric-first-head-third-flip",
    topic: "Probability",
    track: "researcher",
    title: "First Head on Third Flip",
    prompt_md:
      "A fair coin is flipped repeatedly. What is the probability that the first head appears on exactly the third flip?",
    solution_md: "$P = (1/2)^2 \\cdot (1/2) = 1/8$.",
    answer_kind: "fraction",
    answer_value: "1/8",
    answer_tolerance: 1e-6,
    difficulty: 1,
    tags: ["geometric", "warm-up"],
    source: "Classic",
  },
  {
    slug: "random-walk-return-step-2",
    topic: "Probability",
    track: "researcher",
    title: "Symmetric Random Walk — Back at Origin in 2 Steps",
    prompt_md:
      "A symmetric simple random walk on $\\mathbb{Z}$ starts at $0$ and at each step moves $\\pm 1$ with probability $1/2$. What is the probability it is back at $0$ after exactly $2$ steps?",
    solution_md: "$P = \\binom{2}{1}(1/2)^2 = 1/2$.",
    answer_kind: "fraction",
    answer_value: "1/2",
    answer_tolerance: 1e-9,
    difficulty: 2,
    tags: ["random-walk", "binomial"],
    source: "Textbook",
  },
  {
    slug: "gamblers-ruin-fair",
    topic: "Probability",
    track: "researcher",
    title: "Gambler's Ruin — Fair Game",
    prompt_md:
      "You start with \\$5 and bet \\$1 each round on a fair coin flip (gain \\$1 on heads, lose \\$1 on tails). You stop when you reach \\$0 or \\$10. What is the probability you reach \\$10 before going broke?",
    solution_md:
      "For a fair walk on $\\{0, 1, \\dots, N\\}$ starting at $k$, the probability of hitting $N$ first is $k/N$. Here $5/10 = 1/2$.",
    answer_kind: "fraction",
    answer_value: "1/2",
    answer_tolerance: 1e-6,
    difficulty: 3,
    tags: ["random-walk", "martingale"],
    companies: ["SIG"],
    source: "Textbook",
  },
  {
    slug: "prob-up-after-two-signals",
    topic: "Probability",
    track: "trader",
    title: "Combine Two Independent Signals",
    prompt_md:
      "Two independent signals each predict an up move correctly with probability $0.6$. You take the majority vote of the two signals, and in case of a tie you flip a fair coin. What is the probability your final directional call is correct?",
    solution_md:
      "Both correct with probability $0.6^2 = 0.36$. Both wrong with probability $0.4^2 = 0.16$. A tie happens when exactly one is correct, probability $2 \\cdot 0.6 \\cdot 0.4 = 0.48$, and then you are right with probability $1/2$, contributing $0.24$. Total: $0.36 + 0.24 = 0.60$.",
    answer_kind: "numeric",
    answer_value: "0.6",
    answer_tolerance: 1e-3,
    difficulty: 2,
    tags: ["signal-combination", "probability", "ev"],
    companies: ["Citadel", "Jane Street"],
    source: "Trader interview staple",
  },
  {
    slug: "bus-wait-less-than-3",
    topic: "Probability",
    track: "trader",
    title: "Bus Every 10 Minutes: P(wait < 3)",
    prompt_md:
      "A bus arrives exactly every 10 minutes. You arrive at a uniformly random time. What is the probability your waiting time is less than 3 minutes?",
    solution_md:
      "The waiting time is uniform on \\([0, 10)\\) minutes. So \\(P(W < 3) = 3/10\\).",
    answer_kind: "fraction",
    answer_value: "3/10",
    answer_tolerance: 1e-3,
    difficulty: 1,
    tags: ["uniform", "residual-life", "warm-up"],
    source: "Classic",
  },
  {
    slug: "competing-exponentials-x-less-y",
    topic: "Probability",
    track: "researcher",
    title: "Competing Exponentials: P(X < Y)",
    prompt_md:
      "Let \\(X \\sim \\text{Exp}(\\lambda_1)\\) and \\(Y \\sim \\text{Exp}(\\lambda_2)\\) be independent. Compute \\(P(X < Y)\\).",
    solution_md:
      "For competing exponentials, \\(P(X < Y) = \\lambda_1/(\\lambda_1+\\lambda_2)\\).",
    answer_kind: "exact",
    answer_value: "lambda1/(lambda1+lambda2)",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["exponential", "memoryless"],
    companies: ["Two Sigma"],
    source: "Queueing / reliability classic",
  },
  {
    slug: "mosteller-urn-two-red-one-blue",
    topic: "Probability",
    track: "researcher",
    title: "Urn: Two Red, One Blue (Without Replacement)",
    prompt_md:
      "An urn has 2 red balls and 1 blue ball. You draw two balls uniformly at random without replacement. What is the probability the two drawn balls are the same color?",
    solution_md:
      "The only way to match is drawing two reds. Total pairs: choose 2 of 3 balls = 3. Favorable pairs: choose 2 of the 2 reds = 1. Probability $1/3$.",
    answer_kind: "fraction",
    answer_value: "1/3",
    answer_tolerance: 1e-3,
    difficulty: 1,
    tags: ["combinatorics", "urns"],
    source: "Mosteller-style warm-up",
    target_roles: ["All"],
  },
  {
    slug: "expected-rolls-until-two-sixes",
    topic: "Probability",
    track: "researcher",
    title: "Expected Rolls Until Two Sixes",
    prompt_md:
      "You roll a fair six-sided die repeatedly. What is the expected number of rolls required to see **two** sixes (not necessarily consecutive)?",
    solution_md:
      "Time to first six is geometric with mean 6. After the first six, time to the second six is independent geometric with mean 6. By linearity, expected total is $6+6=12$.",
    answer_kind: "numeric",
    answer_value: "12",
    answer_tolerance: 1e-9,
    difficulty: 1,
    tags: ["expectation", "geometric", "linearity-of-expectation"],
    source: "Stat 110 style",
    target_roles: ["All"],
  },
  {
    slug: "expected-flips-until-hth",
    topic: "Probability",
    track: "researcher",
    title: "Expected Flips Until HTH",
    prompt_md:
      "You flip a fair coin until the pattern **HTH** appears as a contiguous substring. What is the expected number of flips?",
    solution_md:
      "Use states for the longest suffix that is a prefix of HTH.\nLet $E_0$ be expected flips from no match, $E_1$ after seeing H, $E_2$ after seeing HT.\nThen $E_0=1+\\tfrac12 E_1+\\tfrac12 E_0$, $E_1=1+\\tfrac12 E_1+\\tfrac12 E_2$, $E_2=1+\\tfrac12\\cdot 0+\\tfrac12 E_0$.\nSolve: $E_0=10$.",
    answer_kind: "numeric",
    answer_value: "10",
    answer_tolerance: 1e-9,
    difficulty: 4,
    tags: ["markov", "recurrence", "patterns"],
    source: "Classic pattern waiting time",
    target_roles: ["Researcher"],
  },
  {
    slug: "bayes-two-coins-picked",
    topic: "Probability",
    track: "researcher",
    title: "Bayes: Pick a Coin",
    prompt_md:
      "You have two coins: one fair and one double-headed. You pick a coin uniformly at random and flip it once; it lands heads. What is the probability you picked the double-headed coin?",
    solution_md:
      "$P(DH\\mid H)=\\dfrac{P(H\\mid DH)P(DH)}{P(H\\mid DH)P(DH)+P(H\\mid F)P(F)}=\\dfrac{1\\cdot 1/2}{1\\cdot 1/2 + (1/2)\\cdot 1/2}=\\dfrac{1/2}{3/4}=2/3$.",
    answer_kind: "fraction",
    answer_value: "2/3",
    answer_tolerance: 1e-3,
    difficulty: 2,
    tags: ["bayes", "conditioning"],
    source: "Classic",
    target_roles: ["All"],
  },
  {
    slug: "poisson-approx-binomial-mcq",
    topic: "Probability",
    track: "researcher",
    title: "Poisson Approximation — When?",
    prompt_md:
      "When is a Poisson approximation to a Binomial($n,p$) distribution typically appropriate?",
    solution_md:
      "When $n$ is large, $p$ is small, and $\\lambda=np$ is of moderate size; then Binomial($n,p$) is close to Poisson($\\lambda$).",
    answer_kind: "mcq",
    answer_value: "rare-events",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["poisson", "approximation", "binomial"],
    source: "Stat 110 staple",
    target_roles: ["All"],
    answer_meta: {
      options: [
        {
          id: "rare-events",
          label: "$n$ large, $p$ small, with $\\lambda=np$ moderate (rare events).",
          correct: true,
        },
        { id: "p-half", label: "$p\\approx 1/2$ and $n$ large.", correct: false },
        { id: "small-n", label: "$n$ small and $p$ arbitrary.", correct: false },
        { id: "always", label: "Always; Poisson is a universal approximation.", correct: false },
      ],
    },
  },
  {
    slug: "birthday-approx-derivation-freeform",
    topic: "Probability",
    track: "researcher",
    title: "Birthday Paradox — Approximation",
    prompt_md:
      "Derive the common approximation for the probability of **at least one shared birthday** among $n$ people (ignore leap days).\n\nProvide an approximation in terms of $n$ and 365 using $e^x$.",
    solution_md:
      "Probability of all distinct:\n\n$$P(\\text{all distinct})=\\prod_{k=0}^{n-1}\\left(1-\\frac{k}{365}\\right)\\approx \\exp\\left(-\\sum_{k=0}^{n-1}\\frac{k}{365}\\right)=\\exp\\left(-\\frac{n(n-1)}{2\\cdot 365}\\right).$$\n\nSo $P(\\text{collision})\\approx 1-\\exp\\left(-\\frac{n(n-1)}{2\\cdot 365}\\right)$.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["birthday", "approximation", "log"],
    source: "Stat 110 / classic",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 70,
      rubric: [
        "Starts from product for all-distinct birthdays: 35%",
        "Uses log/exp approximation to get $\\exp(-n(n-1)/(2\\cdot 365))$: 45%",
        "Converts to collision probability $1-\\exp(\\cdot)$: 20%",
      ],
      reference_solution_md:
        "$$P(\\text{collision})\\approx 1-\\exp\\left(-\\frac{n(n-1)}{2\\cdot 365}\\right).$$",
    },
  },
  {
    slug: "coupon-collector-n-freeform",
    topic: "Probability",
    track: "researcher",
    title: "Coupon Collector — $n$ Types",
    prompt_md:
      "There are $n$ equally likely coupon types. You draw coupons with replacement until you have seen all $n$ types.\n\nCompute the expected number of draws.",
    solution_md:
      "After collecting $k$ distinct types, probability the next draw is new is $(n-k)/n$, so expected additional draws to get a new type is $n/(n-k)$. Summing:\n\n$$E[T]=\\sum_{k=0}^{n-1}\\frac{n}{n-k}=n\\sum_{j=1}^n \\frac{1}{j}=nH_n.$$\n",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["expectation", "linearity-of-expectation", "coupon-collector"],
    source: "Mosteller / Stat 110 classic",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 60,
      rubric: [
        "Uses decomposition into stages with success prob $(n-k)/n$: 50%",
        "Gets the sum $\\sum_{k=0}^{n-1} n/(n-k)$: 30%",
        "Simplifies to $nH_n$ (harmonic number): 20%",
      ],
      reference_solution_md:
        "$$E[T]=\\sum_{k=0}^{n-1}\\frac{n}{n-k}=n\\sum_{j=1}^n \\frac{1}{j}=nH_n.$$",
    },
  },
  {
    slug: "order-stat-max-of-n-uniforms-cdf-freeform",
    topic: "Probability",
    track: "researcher",
    title: "Max of $n$ Uniforms — CDF",
    prompt_md:
      "Let $U_1,\\dots,U_n$ be iid $\\text{Uniform}(0,1)$ and let $M=\\max_i U_i$.\n\nDerive the CDF $F_M(x)=P(M\\le x)$ for $x\\in[0,1]$.",
    solution_md:
      "$$P(M\\le x)=P(U_1\\le x,\\dots,U_n\\le x)=\\prod_{i=1}^n P(U_i\\le x)=x^n,\\quad x\\in[0,1].$$",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["order-statistics", "cdf", "iid"],
    source: "Stat 110 classic",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 35,
      rubric: [
        "Uses event $\\{M\\le x\\}=\\cap_i\\{U_i\\le x\\}$: 35%",
        "Uses independence to multiply probabilities: 35%",
        "Gets the final CDF $x^n$ on $[0,1]$: 30%",
      ],
      reference_solution_md: "$$F_M(x)=x^n\\ \\text{for}\\ x\\in[0,1].$$",
    },
  },
  {
    slug: "order-stat-min-of-n-uniforms-ev",
    topic: "Probability",
    track: "researcher",
    title: "$E[\\min(U_1,\\dots,U_n)]$",
    prompt_md:
      "Let $U_1,\\dots,U_n$ be iid $\\text{Uniform}(0,1)$. Compute $E[\\min(U_1,\\dots,U_n)]$ as a function of $n$.",
    solution_md:
      "Let $Z=\\min_i U_i$. Then $P(Z>t)=P(U_1>t,\\dots,U_n>t)=(1-t)^n$. So\n\n$$E[Z]=\\int_0^1 P(Z>t)\\,dt=\\int_0^1 (1-t)^n\\,dt=\\frac{1}{n+1}.$$",
    answer_kind: "exact",
    answer_value: "1/(n+1)",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["order-statistics", "tail-integral", "uniform"],
    source: "Order statistics staple",
    target_roles: ["Researcher"],
  },
  {
    slug: "conditioning-dice-at-least-one-six",
    topic: "Probability",
    track: "researcher",
    title: "Two Dice — Given At Least One Six",
    prompt_md:
      "You roll two fair six-sided dice. Given that **at least one** die shows a 6, what is the probability that **both** dice show 6?",
    solution_md:
      "Conditional sample space has 11 outcomes: (6,1..6) and (1..5,6). Only (6,6) satisfies both sixes. Probability $1/11$.",
    answer_kind: "fraction",
    answer_value: "1/11",
    answer_tolerance: 1e-3,
    difficulty: 2,
    tags: ["conditioning", "combinatorics"],
    source: "Classic conditional counting",
    target_roles: ["All"],
  },
  {
    slug: "bertrand-paradox-why-ambiguous-freeform",
    topic: "Probability",
    track: "researcher",
    title: "Bertrand Paradox — Why It's Ill-Posed",
    prompt_md:
      "In the Bertrand paradox (\"pick a random chord in a circle\"), different methods give different probabilities for the chord being longer than the side of the inscribed equilateral triangle.\n\nIn 4–8 sentences, explain **why** the problem is ambiguous (what \"random chord\" fails to specify).",
    solution_md:
      "The phrase \"random chord\" does not define a unique probability measure on the space of chords. Different parameterizations (random endpoints on circumference, random radius then random distance from center, random midpoint uniformly in disk, etc.) induce different distributions over chord lengths, so the resulting probability depends on the sampling rule.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["paradox", "measure", "modeling"],
    source: "Classic probability modeling pitfall",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 70,
      rubric: [
        "States that the ambiguity is about the underlying probability measure / sampling rule: 55%",
        "Gives at least one concrete example of different 'random chord' constructions: 30%",
        "Connects to different induced chord-length distributions / different answers: 15%",
      ],
      reference_solution_md:
        "Bertrand paradox: 'random chord' doesn't specify a unique measure on chords; different constructions (random endpoints vs random midpoint vs random distance from center) yield different chord-length distributions and probabilities.\n",
    },
  },
  {
    slug: "occupancy-balls-bins-empty-expected",
    topic: "Probability",
    track: "researcher",
    title: "Expected Empty Bins",
    prompt_md:
      "You throw $m$ balls independently and uniformly into $n$ bins.\n\nWhat is the expected number of empty bins?",
    solution_md:
      "Let $I_j$ be indicator bin $j$ is empty. Then $E[I_j]=P(\\text{bin }j\\text{ gets no balls})=(1-1/n)^m$. By linearity,\n\n$$E[\\#\\text{ empty}]=\\sum_{j=1}^n E[I_j]=n(1-1/n)^m.$$",
    answer_kind: "exact",
    answer_value: "n(1-1/n)^m",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["linearity-of-expectation", "occupancy", "indicators"],
    source: "Stat 110 classic",
    target_roles: ["Researcher"],
  },
  {
    slug: "probability-union-bound-mcq",
    topic: "Probability",
    track: "researcher",
    title: "Union Bound",
    prompt_md:
      "Which inequality is the union bound?",
    solution_md:
      "For events $A_1,\\dots,A_k$, $P(\\cup_i A_i)\\le \\sum_i P(A_i)$.",
    answer_kind: "mcq",
    answer_value: "union",
    answer_tolerance: null,
    difficulty: 1,
    tags: ["inequalities", "union-bound"],
    source: "Basic probability tool",
    target_roles: ["All"],
    answer_meta: {
      options: [
        {
          id: "union",
          label: "$P\\left(\\bigcup_{i=1}^k A_i\\right) \\le \\sum_{i=1}^k P(A_i)$",
          correct: true,
        },
        {
          id: "intersection",
          label: "$P\\left(\\bigcap_{i=1}^k A_i\\right) \\le \\sum_{i=1}^k P(A_i)$",
          correct: false,
        },
        {
          id: "bayes",
          label: "$P(A\\mid B)=\\frac{P(B\\mid A)P(A)}{P(B)}$",
          correct: false,
        },
        {
          id: "markov",
          label: "$P(X\\ge a)\\le E[X]/a$",
          correct: false,
        },
      ],
    },
  },
  {
    slug: "conditional-expectation-tower-property-freeform",
    topic: "Probability",
    track: "researcher",
    title: "Tower Property (Law of Total Expectation)",
    prompt_md:
      "State the tower property (law of total expectation).\n\nThen give a one-line explanation of why it is useful for multi-stage random processes.",
    solution_md:
      "Tower property: for integrable $X$ and sigma-algebra $\\mathcal{G}$, $E[E[X\\mid \\mathcal{G}]]=E[X]$. It's useful because it lets you condition on an intermediate state and average: compute $E[X\\mid\\text{state}]$ first, then take expectation over states.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["expectation", "conditioning", "tower-property"],
    source: "Core tool",
    target_roles: ["All"],
    answer_meta: {
      min_words: 45,
      rubric: [
        "States the identity $E[E[X\\mid\\mathcal{G}]]=E[X]$ (or equivalent $E[X]=E[E[X\\mid Y]]$): 70%",
        "Explains it as 'condition on an intermediate state, then average over that state': 30%",
      ],
      reference_solution_md:
        "$$E[X]=E[E[X\\mid Y]].$$\nUseful: break a hard expectation into conditional expectations on a simpler intermediate state.\n",
    },
  },
  {
    slug: "markov-inequality-mcq",
    topic: "Probability",
    track: "researcher",
    title: "Markov's Inequality",
    prompt_md:
      "Which statement is Markov's inequality for a nonnegative random variable $X$?",
    solution_md: "For $a>0$, $P(X\\ge a)\\le E[X]/a$ when $X\\ge 0$.",
    answer_kind: "mcq",
    answer_value: "markov",
    answer_tolerance: null,
    difficulty: 1,
    tags: ["inequalities", "markov"],
    source: "Core tool",
    target_roles: ["All"],
    answer_meta: {
      options: [
        { id: "markov", label: "$P(X\\ge a)\\le \\frac{E[X]}{a}$ for $X\\ge 0$", correct: true },
        { id: "chebyshev", label: "$P(|X-\\mu|\\ge k)\\le \\frac{\\sigma^2}{k^2}$", correct: false },
        { id: "jensen", label: "$\\varphi(E[X])\\le E[\\varphi(X)]$ for convex $\\varphi$", correct: false },
        { id: "bayes", label: "$P(A\\mid B)=\\frac{P(B\\mid A)P(A)}{P(B)}$", correct: false },
      ],
    },
  },
  {
    slug: "chebyshev-inequality-mcq",
    topic: "Probability",
    track: "researcher",
    title: "Chebyshev's Inequality",
    prompt_md:
      "Which statement is Chebyshev's inequality for a random variable with mean $\\mu$ and variance $\\sigma^2$?",
    solution_md:
      "For $k>0$, $P(|X-\\mu|\\ge k)\\le \\sigma^2/k^2$.",
    answer_kind: "mcq",
    answer_value: "chebyshev",
    answer_tolerance: null,
    difficulty: 1,
    tags: ["inequalities", "chebyshev"],
    source: "Core tool",
    target_roles: ["All"],
    answer_meta: {
      options: [
        { id: "chebyshev", label: "$P(|X-\\mu|\\ge k)\\le \\frac{\\sigma^2}{k^2}$", correct: true },
        { id: "markov", label: "$P(X\\ge a)\\le E[X]/a$", correct: false },
        { id: "union", label: "$P(\\cup_i A_i)\\le \\sum_i P(A_i)$", correct: false },
        { id: "clt", label: "$\\sqrt{n}(\\bar X-\\mu)/\\sigma \\Rightarrow \\mathcal{N}(0,1)$", correct: false },
      ],
    },
  },
  {
    slug: "bayes-two-tests-sensitivity-specificity",
    topic: "Probability",
    track: "researcher",
    title: "Bayes: Two Independent Tests",
    prompt_md:
      "A disease has prevalence $1\\%$. A test is $99\\%$ sensitive and $99\\%$ specific. You take the test twice, independently conditional on disease status, and both results are positive.\n\nWhat is $P(D\\mid ++)$? Round to 2 decimal places.",
    solution_md:
      "Prior odds: $P(D)=0.01$, $P(\\neg D)=0.99$. Likelihoods: $P(++\\mid D)=0.99^2=0.9801$, $P(++\\mid \\neg D)=0.01^2=0.0001$.\n\nPosterior:\n\n$$P(D\\mid++)=\\frac{0.9801\\cdot 0.01}{0.9801\\cdot 0.01+0.0001\\cdot 0.99}=\\frac{0.009801}{0.009801+0.000099}\\approx 0.99.$$\n",
    answer_kind: "numeric",
    answer_value: "0.99",
    answer_tolerance: 0.01,
    difficulty: 3,
    tags: ["bayes", "conditioning", "independence"],
    source: "Classic Bayes extension",
    target_roles: ["All"],
  },
  {
    slug: "negative-binomial-expected-trials",
    topic: "Probability",
    track: "researcher",
    title: "Expected Trials Until $r$ Successes",
    prompt_md:
      "You flip a coin with probability of heads $p$ until you have seen $r$ heads.\n\nWhat is the expected number of flips?",
    solution_md:
      "The waiting time for one success is geometric with mean $1/p$. Sum $r$ independent geometric waiting times (memoryless), so expected flips is $r/p$.",
    answer_kind: "exact",
    answer_value: "r/p",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["expectation", "geometric", "negative-binomial"],
    source: "Stat 110 staple",
    target_roles: ["All"],
  },
  {
    slug: "law-of-total-probability-mcq",
    topic: "Probability",
    track: "researcher",
    title: "Law of Total Probability",
    prompt_md:
      "Let $B_1,\\dots,B_k$ be a partition of the sample space with $P(B_i)>0$. Which identity is the law of total probability for event $A$?",
    solution_md: "$P(A)=\\sum_i P(A\\mid B_i)P(B_i)$.",
    answer_kind: "mcq",
    answer_value: "total",
    answer_tolerance: null,
    difficulty: 1,
    tags: ["conditioning", "total-probability"],
    source: "Core tool",
    target_roles: ["All"],
    answer_meta: {
      options: [
        {
          id: "total",
          label: "$P(A)=\\sum_{i=1}^k P(A\\mid B_i)P(B_i)$",
          correct: true,
        },
        {
          id: "bayes",
          label: "$P(B_i\\mid A)=\\frac{P(A\\mid B_i)P(B_i)}{P(A)}$",
          correct: false,
        },
        {
          id: "union",
          label: "$P(\\cup_i A_i)\\le \\sum_i P(A_i)$",
          correct: false,
        },
        {
          id: "indep",
          label: "$P(A\\cap B)=P(A)P(B)$",
          correct: false,
        },
      ],
    },
  },
  {
    slug: "random-walk-hit-prob-unbiased",
    topic: "Probability",
    track: "researcher",
    title: "Random Walk Hitting Probability (Unbiased)",
    prompt_md:
      "A simple symmetric random walk on $\\{0,1,\\dots,N\\}$ starts at $k$ and is absorbed at 0 and $N$.\n\nWhat is the probability it hits $N$ before 0?",
    solution_md:
      "For the unbiased walk, the hitting probability is linear in $k$: $P(\\text{hit }N\\text{ first})=k/N$.",
    answer_kind: "exact",
    answer_value: "k/N",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["random-walk", "martingale", "gambler's-ruin"],
    source: "Classic",
    target_roles: ["Researcher"],
  },
  {
    slug: "monty-hall-general-n-doors",
    topic: "Probability",
    track: "researcher",
    title: "Monty Hall with $n$ Doors",
    prompt_md:
      "There are $n$ doors. One hides a car, $n-1$ hide goats. You pick one door uniformly. The host opens $n-2$ other doors, all goats, leaving your door and one other unopened.\n\nIf you always switch to the other unopened door, what is your probability of winning?",
    solution_md:
      "Your initial pick is correct with probability $1/n$. With probability $(n-1)/n$ you picked a goat; then the only other unopened door must be the car. So switching wins with probability $(n-1)/n$.",
    answer_kind: "exact",
    answer_value: "(n-1)/n",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["conditioning", "bayes", "classic"],
    source: "Generalization",
    target_roles: ["All"],
  },
  {
    slug: "expected-coin-flips-until-three-heads",
    topic: "Probability",
    track: "researcher",
    title: "Expected Flips Until 3 Heads",
    prompt_md:
      "You flip a fair coin until you have seen 3 heads total (not necessarily consecutive). What is the expected number of flips?",
    solution_md:
      "Each head is a success with probability $1/2$. Expected flips to get one head is 2. Sum three independent geometric waiting times: $2+2+2=6$.",
    answer_kind: "numeric",
    answer_value: "6",
    answer_tolerance: 1e-9,
    difficulty: 1,
    tags: ["expectation", "geometric", "linearity-of-expectation"],
    source: "Warm-up",
    target_roles: ["All"],
  },
  {
    slug: "expected-matches-random-permutation",
    topic: "Probability",
    track: "researcher",
    title: "Expected Fixed Points in a Random Permutation",
    prompt_md:
      "A random permutation of $\\{1,2,\\dots,n\\}$ is chosen uniformly.\n\nWhat is the expected number of fixed points (positions $i$ where $\\pi(i)=i$)?",
    solution_md:
      "Let $I_i=\\mathbf{1}\\{\\pi(i)=i\\}$. Then $E[I_i]=P(\\pi(i)=i)=1/n$. By linearity,\n\n$$E[\\#\\text{fixed points}]=\\sum_{i=1}^n E[I_i]=n\\cdot (1/n)=1.$$",
    answer_kind: "numeric",
    answer_value: "1",
    answer_tolerance: 1e-9,
    difficulty: 2,
    tags: ["linearity-of-expectation", "indicators", "permutations"],
    source: "Classic",
    target_roles: ["All"],
  },
  {
    slug: "probability-at-least-one-fixed-point-approx",
    topic: "Probability",
    track: "researcher",
    title: "Probability of At Least One Fixed Point (Asymptotic)",
    prompt_md:
      "A random permutation of $\\{1,2,\\dots,n\\}$ is chosen uniformly.\n\nAs $n\\to\\infty$, what is the limiting probability that the permutation has **at least one** fixed point?",
    solution_md:
      "The number of fixed points converges in distribution to $\\text{Poisson}(1)$, so\n\n$$P(\\ge 1)\\to 1-P(0)=1-e^{-1}.$$",
    answer_kind: "exact",
    answer_value: "1-1/e",
    answer_tolerance: null,
    difficulty: 4,
    tags: ["poisson", "asymptotic", "permutations"],
    source: "Poisson approximation / derangements",
    target_roles: ["Researcher"],
  },
  {
    slug: "expected-draws-until-repeat-cards",
    topic: "Probability",
    track: "researcher",
    title: "Expected Draws Until Repeat (Deck with Replacement)",
    prompt_md:
      "You draw cards uniformly from a 52-card deck **with replacement**. What is the expected number of draws until you see a repeated card value (i.e., the same exact card appears twice)?\n\nGive the answer as a summation expression (exact), not a decimal.",
    solution_md:
      "Let $T$ be time of first repeat. Use tail-sum:\n\n$$E[T]=\\sum_{k\\ge 0} P(T>k).$$\n\nWe have $P(T>k)$ = probability first $k$ draws are all distinct = $\\frac{52}{52}\\cdot\\frac{51}{52}\\cdots\\frac{52-k+1}{52}$ for $k\\le 52$, and 0 after.\n\nSo\n\n$$E[T]=\\sum_{k=0}^{52} \\prod_{j=0}^{k-1}\\left(1-\\frac{j}{52}\\right).$$",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["birthday", "tail-integral", "expectation"],
    source: "Birthday-type expectation",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 70,
      rubric: [
        "Uses tail-sum identity $E[T]=\\sum_{k\\ge 0}P(T>k)$: 40%",
        "Correctly expresses $P(T>k)$ as 'first k draws all distinct' product: 45%",
        "Correctly bounds the sum to $k\\le 52$ (or notes it becomes 0 after): 15%",
      ],
      reference_solution_md:
        "$$E[T]=\\sum_{k=0}^{52} P(\\text{first k draws all distinct})=\\sum_{k=0}^{52}\\prod_{j=0}^{k-1}\\left(1-\\frac{j}{52}\\right).$$",
    },
  },
  {
    slug: "conditional-expectation-ev-by-conditioning-freeform",
    topic: "Probability",
    track: "researcher",
    title: "Compute an Expectation by Conditioning",
    prompt_md:
      "Let $N\\sim\\text{Poisson}(\\lambda)$. Conditional on $N$, let $X\\mid N \\sim \\text{Binomial}(N,p)$.\n\nCompute $E[X]$ in terms of $\\lambda$ and $p$.",
    solution_md:
      "Use tower property: $E[X]=E[E[X\\mid N]]$. Given $N$, $E[X\\mid N]=Np$. So $E[X]=E[N]p=\\lambda p$.",
    answer_kind: "exact",
    answer_value: "lambda*p",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["expectation", "conditioning", "poisson"],
    source: "Classic conditioning",
    target_roles: ["Researcher"],
  },
  {
    slug: "poisson-thinning-mcq",
    topic: "Probability",
    track: "researcher",
    title: "Poisson Thinning",
    prompt_md:
      "If $N\\sim\\text{Poisson}(\\lambda)$ and each of the $N$ items is kept independently with probability $p$, what is the distribution of the number kept?",
    solution_md:
      "By Poisson thinning, the kept count is $\\text{Poisson}(\\lambda p)$.",
    answer_kind: "mcq",
    answer_value: "poisson-lp",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["poisson", "thinning"],
    source: "Core property",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        { id: "poisson-lp", label: "$\\text{Poisson}(\\lambda p)$", correct: true },
        { id: "poisson-l", label: "$\\text{Poisson}(\\lambda)$", correct: false },
        { id: "binomial", label: "$\\text{Binomial}(\\lambda, p)$", correct: false },
        { id: "normal", label: "$\\mathcal{N}(\\lambda p, \\lambda p(1-p))$", correct: false },
      ],
    },
  },
  {
    slug: "ev-max-of-n-uniforms",
    topic: "Probability",
    track: "researcher",
    title: "$E[\\max(U_1,\\dots,U_n)]$",
    prompt_md:
      "Let $U_1,\\dots,U_n$ be iid $\\text{Uniform}(0,1)$. Compute $E[\\max(U_1,\\dots,U_n)]$ as a function of $n$.",
    solution_md:
      "Let $M=\\max_i U_i$. Then $F_M(x)=x^n$ on $[0,1]$, so density is $f_M(x)=n x^{n-1}$. Thus\n\n$$E[M]=\\int_0^1 x\\,n x^{n-1}\\,dx = \\frac{n}{n+1}.$$",
    answer_kind: "exact",
    answer_value: "n/(n+1)",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["order-statistics", "uniform", "expectation"],
    source: "Order statistics staple",
    target_roles: ["Researcher"],
  },
  {
    slug: "continuous-conditioning-zero-probability-freeform",
    topic: "Probability",
    track: "researcher",
    title: "Conditioning on Probability-Zero Events",
    prompt_md:
      "In continuous problems you often see expressions like $P(X\\in A\\mid Y=y)$ even though $P(Y=y)=0$.\n\nIn 4–8 sentences, explain how to interpret this conditioning rigorously (at the level of intuition: densities / regular conditional distributions).",
    solution_md:
      "It is interpreted via conditional densities or regular conditional distributions: $P(X\\in A\\mid Y=y)$ is defined (a.e.) as a function of $y$ such that $P(X\\in A, Y\\in B)=\\int_B P(X\\in A\\mid Y=y) f_Y(y)\\,dy$. When densities exist, $f_{X\\mid Y}(x\\mid y)=f_{X,Y}(x,y)/f_Y(y)$, and conditioning on $Y=y$ means using that conditional density.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["conditioning", "continuous", "densities"],
    source: "Measure-theory intuition for interviews",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 80,
      rubric: [
        "Explains conditioning via conditional densities or regular conditional distributions (not naive $P(\\cdot)/P(Y=y)$): 55%",
        "Gives a correct relationship using joint/marginal densities or the integral identity over sets $B$: 30%",
        "Mentions the 'defined almost everywhere' / not unique on measure-zero sets caveat (optional but strong): 15%",
      ],
      reference_solution_md:
        "Interpret via conditional density $f_{X|Y}(x|y)=f_{X,Y}(x,y)/f_Y(y)$ when it exists, or via regular conditional distributions satisfying $P(X\\in A, Y\\in B)=\\int_B P(X\\in A|Y=y)f_Y(y)dy$.\n",
    },
  },
  {
    slug: "stationary-distribution-two-state-markov-chain",
    topic: "Probability",
    track: "researcher",
    title: "Stationary Distribution of a 2-State Markov Chain",
    prompt_md:
      "A 2-state Markov chain has transition matrix\n\n$$P=\\begin{pmatrix}1-a & a\\\\ b & 1-b\\end{pmatrix}$$\n\nwith $a,b\\in(0,1)$. Compute the stationary distribution $\\pi$.",
    solution_md:
      "Solve $\\pi=\\pi P$ with $\\pi_1+\\pi_2=1$. Balance gives $\\pi_1 a=\\pi_2 b$. So $\\pi_1=\\frac{b}{a+b}$ and $\\pi_2=\\frac{a}{a+b}$.",
    answer_kind: "exact",
    answer_value: "(b/(a+b), a/(a+b))",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["markov-chain", "stationary", "linear-algebra"],
    source: "Classic",
    target_roles: ["Researcher"],
  },
  {
    slug: "memoryless-property-exponential-mcq",
    topic: "Probability",
    track: "researcher",
    title: "Memoryless Property",
    prompt_md:
      "Which distribution on $[0,\\infty)$ is memoryless (continuous analogue of geometric)?",
    solution_md:
      "The exponential distribution is memoryless: $P(X>s+t\\mid X>s)=P(X>t)$.",
    answer_kind: "mcq",
    answer_value: "exponential",
    answer_tolerance: null,
    difficulty: 1,
    tags: ["memoryless", "exponential"],
    source: "Core fact",
    target_roles: ["All"],
    answer_meta: {
      options: [
        { id: "exponential", label: "Exponential", correct: true },
        { id: "normal", label: "Normal", correct: false },
        { id: "uniform", label: "Uniform", correct: false },
        { id: "gamma", label: "Gamma (general)", correct: false },
      ],
    },
  },
  {
    slug: "gambler-ruin-biased-hit-prob",
    topic: "Probability",
    track: "researcher",
    title: "Gambler's Ruin — Biased Walk Hitting Probability",
    prompt_md:
      "A random walk on $\\{0,1,\\dots,N\\}$ starts at $k$ and is absorbed at 0 and $N$. Each step goes up by 1 with probability $p$ and down by 1 with probability $q=1-p$.\n\nFor $p\\ne 1/2$, what is the probability it hits $N$ before 0?",
    solution_md:
      "For biased gambler's ruin, with $r=q/p$:\n\n$$P_k(\\text{hit }N)=\\frac{1-r^k}{1-r^N},\\quad r=\\frac{q}{p},\\ p\\ne q.$$",
    answer_kind: "exact",
    answer_value: "(1-(q/p)^k)/(1-(q/p)^N)",
    answer_tolerance: null,
    difficulty: 4,
    tags: ["random-walk", "gambler's-ruin", "recurrence"],
    source: "Classic",
    target_roles: ["Researcher"],
  },
  {
    slug: "gambler-ruin-fair-expected-time-freeform",
    topic: "Probability",
    track: "researcher",
    title: "Gambler's Ruin — Expected Absorption Time (Fair Walk)",
    prompt_md:
      "A simple symmetric random walk on $\\{0,1,\\dots,N\\}$ starts at $k$ and is absorbed at 0 and $N$.\n\nCompute the expected time to absorption $E_k[\\tau]$.",
    solution_md:
      "Let $e_k=E_k[\\tau]$. For $k\\in\\{1,\\dots,N-1\\}$, the walk moves to $k\\pm1$ with prob $1/2$, so\n\n$$e_k=1+\\tfrac12 e_{k-1}+\\tfrac12 e_{k+1},$$\n\nwith boundary conditions $e_0=e_N=0$. The solution to the discrete second-difference equation is quadratic:\n\n$$e_k=k(N-k).$$",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["random-walk", "recurrence", "hitting-time"],
    source: "Classic",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 75,
      rubric: [
        "Sets up the correct recurrence $e_k=1+\\tfrac12 e_{k-1}+\\tfrac12 e_{k+1}$ with $e_0=e_N=0$: 55%",
        "Solves (or identifies) the quadratic form solution: 25%",
        "States the final result $e_k=k(N-k)$: 20%",
      ],
      reference_solution_md:
        "Recurrence: $e_k=1+\\frac12 e_{k-1}+\\frac12 e_{k+1}$, $e_0=e_N=0$. Solution: $e_k=k(N-k)$.\n",
    },
  },
  {
    slug: "expected-nonempty-bins",
    topic: "Probability",
    track: "researcher",
    title: "Expected Non-Empty Bins",
    prompt_md:
      "You throw $m$ balls independently and uniformly into $n$ bins.\n\nWhat is the expected number of **non-empty** bins?",
    solution_md:
      "Expected non-empty = $n - E[\\#\\text{empty}] = n - n(1-1/n)^m = n\\left(1-(1-1/n)^m\\right)$.",
    answer_kind: "exact",
    answer_value: "n(1-(1-1/n)^m)",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["occupancy", "indicators", "linearity-of-expectation"],
    source: "Stat 110 classic",
    target_roles: ["Researcher"],
  },
  {
    slug: "conditional-expectation-law-total-variance-freeform",
    topic: "Probability",
    track: "researcher",
    title: "Law of Total Variance",
    prompt_md:
      "State the law of total variance.\n\nThat is, express $\\mathrm{Var}(X)$ in terms of $E[\\mathrm{Var}(X\\mid Y)]$ and $\\mathrm{Var}(E[X\\mid Y])$.",
    solution_md:
      "$$\\mathrm{Var}(X)=E[\\mathrm{Var}(X\\mid Y)] + \\mathrm{Var}(E[X\\mid Y]).$$\n\nIt decomposes total variability into within-conditional variability plus variability of conditional means.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["variance", "conditioning", "tower-property"],
    source: "Core identity",
    target_roles: ["All"],
    answer_meta: {
      min_words: 35,
      rubric: [
        "States the identity $\\mathrm{Var}(X)=E[\\mathrm{Var}(X\\mid Y)] + \\mathrm{Var}(E[X\\mid Y])$: 85%",
        "Provides brief interpretation (within + between): 15%",
      ],
      reference_solution_md:
        "$$\\mathrm{Var}(X)=E[\\mathrm{Var}(X\\mid Y)] + \\mathrm{Var}(E[X\\mid Y]).$$",
    },
  },
  {
    slug: "bayes-two-children-born-tuesday",
    topic: "Probability",
    track: "researcher",
    title: "Two Children — One Is a Boy Born on Tuesday",
    prompt_md:
      "A family has two children. You are told that **at least one** child is a boy **born on a Tuesday**.\n\nAssume each child's gender is independent and equally likely, and birthdays are uniformly distributed over the 7 days of the week.\n\nWhat is the probability that both children are boys?",
    solution_md:
      "Model each child as one of 14 equally likely outcomes (boy/girl × weekday). There are $14^2=196$ ordered pairs.\n\nCondition event: at least one child is (boy, Tuesday). Count complement: pairs with no (boy, Tuesday) are $13^2=169$, so conditioning set has $196-169=27$ outcomes.\n\nFavorable: both are boys and at least one is Tuesday-boy. Total boy-boy outcomes: $7\\cdot7=49$. Exclude the case where neither is Tuesday: $6\\cdot6=36$. Favorable $=49-36=13$.\n\nSo probability $13/27$.",
    answer_kind: "fraction",
    answer_value: "13/27",
    answer_tolerance: 1e-3,
    difficulty: 5,
    tags: ["conditioning", "combinatorics", "classic"],
    source: "Classic 'Tuesday boy' paradox",
    target_roles: ["Researcher"],
  },
  {
    slug: "expected-trials-until-first-success-geometric",
    topic: "Probability",
    track: "researcher",
    title: "Geometric Mean",
    prompt_md:
      "An experiment succeeds independently with probability $p$ each trial. Let $T$ be the number of trials until the first success.\n\nWhat is $E[T]$?",
    solution_md:
      "For geometric($p$) counting trials until first success, $E[T]=1/p$.",
    answer_kind: "exact",
    answer_value: "1/p",
    answer_tolerance: null,
    difficulty: 1,
    tags: ["geometric", "expectation"],
    source: "Core fact",
    target_roles: ["All"],
  },
  {
    slug: "markov-chain-detailed-balance-freeform",
    topic: "Probability",
    track: "researcher",
    title: "Detailed Balance (Reversibility)",
    prompt_md:
      "Define detailed balance for a Markov chain with transition matrix $P$ and distribution $\\pi$.\n\nWhat does detailed balance imply about $\\pi$?",
    solution_md:
      "Detailed balance means $\\pi_i P_{ij} = \\pi_j P_{ji}$ for all states $i,j$. Summing over $i$ gives stationarity: $\\pi P = \\pi$, so $\\pi$ is a stationary distribution. It also implies the chain is reversible w.r.t. $\\pi$.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["markov-chain", "stationary", "reversibility"],
    source: "MCMC / Markov chains",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 55,
      rubric: [
        "States the condition $\\pi_i P_{ij}=\\pi_j P_{ji}$: 60%",
        "Explains that it implies $\\pi$ is stationary ($\\pi P=\\pi$): 30%",
        "Mentions reversibility / time-reversal interpretation: 10%",
      ],
      reference_solution_md:
        "Detailed balance: $\\pi_iP_{ij}=\\pi_jP_{ji}$. Summing over $i$ gives $\\pi P=\\pi$, so $\\pi$ is stationary; also implies reversibility.\n",
    },
  },
  {
    slug: "coupon-collector-expected-new-coupon-step",
    topic: "Probability",
    track: "researcher",
    title: "Coupon Collector — Next New Coupon Expectation",
    prompt_md:
      "In the coupon collector problem with $n$ types, suppose you have already collected $k$ distinct types.\n\nWhat is the expected number of additional draws to see a **new** type?",
    solution_md:
      "Probability the next draw is new is $(n-k)/n$, so the waiting time is geometric with mean $1/((n-k)/n)=n/(n-k)$.",
    answer_kind: "exact",
    answer_value: "n/(n-k)",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["coupon-collector", "geometric", "expectation"],
    source: "Coupon collector decomposition",
    target_roles: ["Researcher"],
  },
  {
    slug: "probability-hypergeometric-expected-successes",
    topic: "Probability",
    track: "researcher",
    title: "Hypergeometric Expectation",
    prompt_md:
      "An urn has $K$ red balls and $N-K$ blue balls. You draw $n$ balls without replacement. Let $X$ be the number of red balls drawn.\n\nWhat is $E[X]$?",
    solution_md:
      "Each draw has marginal probability $K/N$ of being red. By linearity of expectation over indicators, $E[X]=n\\cdot K/N$.",
    answer_kind: "exact",
    answer_value: "n*K/N",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["hypergeometric", "linearity-of-expectation", "indicators"],
    source: "Core fact",
    target_roles: ["All"],
  },
  {
    slug: "jensen-inequality-mcq",
    topic: "Probability",
    track: "researcher",
    title: "Jensen's Inequality",
    prompt_md:
      "Which statement is Jensen's inequality for a convex function $\\varphi$?",
    solution_md:
      "For convex $\\varphi$, $\\varphi(E[X])\\le E[\\varphi(X)]$.",
    answer_kind: "mcq",
    answer_value: "jensen",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["inequalities", "jensen"],
    source: "Core inequality",
    target_roles: ["All"],
    answer_meta: {
      options: [
        { id: "jensen", label: "$\\varphi(E[X])\\le E[\\varphi(X)]$ for convex $\\varphi$", correct: true },
        { id: "reverse", label: "$\\varphi(E[X])\\ge E[\\varphi(X)]$ for convex $\\varphi$", correct: false },
        { id: "markov", label: "$P(X\\ge a)\\le E[X]/a$", correct: false },
        { id: "union", label: "$P(\\cup_i A_i)\\le \\sum_i P(A_i)$", correct: false },
      ],
    },
  },
  {
    slug: "chernoff-bound-coin-flips-mcq",
    topic: "Probability",
    track: "researcher",
    title: "Concentration: Hoeffding/Chernoff Flavor",
    prompt_md:
      "You flip a fair coin $n$ times. Which statement best captures a standard concentration result for the number of heads?",
    solution_md:
      "Deviations of order $\\Theta(\\sqrt{n})$ are typical; large deviations like $\\Theta(n)$ have exponentially small probability in $n$ (Chernoff/Hoeffding bounds).",
    answer_kind: "mcq",
    answer_value: "exp-small",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["concentration", "chernoff", "hoeffding"],
    source: "Core concentration intuition",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        { id: "exp-small", label: "$P(|H-n/2|\\ge \\epsilon n)$ decays exponentially in $n$ for fixed $\\epsilon>0$.", correct: true },
        { id: "linear", label: "$P(|H-n/2|\\ge \\epsilon n)$ stays around a constant for fixed $\\epsilon>0$.", correct: false },
        { id: "poly", label: "$P(|H-n/2|\\ge \\epsilon n)$ decays like $1/n$ for fixed $\\epsilon>0$.", correct: false },
        { id: "always-zero", label: "Such deviations are impossible for large $n$.", correct: false },
      ],
    },
  },
  {
    slug: "expected-inversions-random-permutation",
    topic: "Probability",
    track: "researcher",
    title: "Expected Inversions in a Random Permutation",
    prompt_md:
      "A random permutation of $\\{1,\\dots,n\\}$ is chosen uniformly. An inversion is a pair $(i,j)$ with $i<j$ but $\\pi(i)>\\pi(j)$.\n\nWhat is the expected number of inversions?",
    solution_md:
      "For each pair $(i,j)$ with $i<j$, symmetry gives $P(\\pi(i)>\\pi(j))=1/2$. There are $\\binom{n}{2}$ pairs, so expected inversions is $\\binom{n}{2}\\cdot\\tfrac12 = \\frac{n(n-1)}{4}$.",
    answer_kind: "exact",
    answer_value: "n(n-1)/4",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["linearity-of-expectation", "indicators", "permutations"],
    source: "Classic",
    target_roles: ["Researcher"],
  },
  {
    slug: "expected-collisions-birthday-general-m",
    topic: "Probability",
    track: "researcher",
    title: "Expected Collisions (Birthday Generalization)",
    prompt_md:
      "You sample $m$ times uniformly from $\\{1,2,\\dots,n\\}$ with replacement.\n\nLet $C$ be the number of colliding pairs: the number of pairs $(i,j)$ with $i<j$ where the samples are equal. Compute $E[C]$.",
    solution_md:
      "For each pair $(i,j)$, probability of equality is $1/n$. There are $\\binom{m}{2}$ pairs, so $E[C]=\\binom{m}{2}\\cdot\\frac{1}{n}=\\frac{m(m-1)}{2n}$.",
    answer_kind: "exact",
    answer_value: "m(m-1)/(2n)",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["linearity-of-expectation", "birthday", "indicators"],
    source: "Birthday generalization",
    target_roles: ["Researcher"],
  },
  {
    slug: "probability-at-least-one-collision-union-bound",
    topic: "Probability",
    track: "researcher",
    title: "Collision Probability — Union Bound",
    prompt_md:
      "You sample $m$ times uniformly from $\\{1,\\dots,n\\}$ with replacement.\n\nUse a union bound to give an upper bound on the probability that there exists a collision (at least one repeated value).",
    solution_md:
      "Let $A_{ij}$ be event samples $i$ and $j$ match. Then $P(A_{ij})=1/n$. Union bound:\n\n$$P(\\cup_{i<j} A_{ij})\\le \\sum_{i<j} P(A_{ij})=\\binom{m}{2}\\cdot \\frac{1}{n}.$$",
    answer_kind: "exact",
    answer_value: "C(m,2)/n",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["union-bound", "birthday", "inequalities"],
    source: "Standard bound",
    target_roles: ["Researcher"],
  },
  {
    slug: "markov-chain-absorbing-expected-time-setup-freeform",
    topic: "Probability",
    track: "researcher",
    title: "Absorbing Markov Chain — Expected Time Setup",
    prompt_md:
      "You have a Markov chain with an absorbing state. In general, how do you compute expected time to absorption from each state?\n\nAnswer in 4–8 sentences. (You do not need to give matrix formulas; a system-of-equations description is enough.)",
    solution_md:
      "Let $t(i)$ be expected time to absorption starting from state $i$. For absorbing states, $t(i)=0$. For transient states, use first-step analysis:\n\n$$t(i)=1+\\sum_j P_{ij} t(j).$$\n\nThis yields a linear system over transient states; solve it to get all expected absorption times.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["markov-chain", "recurrence", "expectation"],
    source: "First-step analysis staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 70,
      rubric: [
        "Defines expected time-to-absorption per state with boundary condition 0 on absorbing states: 40%",
        "Writes the first-step recurrence $t(i)=1+\\sum_j P_{ij}t(j)$ for transient states: 45%",
        "Mentions solving a linear system over transient states: 15%",
      ],
      reference_solution_md:
        "Let $t(i)$ be expected time to absorption. Absorbing: $t=0$. Transient: $t(i)=1+\\sum_j P_{ij}t(j)$. Solve the linear system.\n",
    },
  },
  {
    slug: "expected-value-of-min-exponential",
    topic: "Probability",
    track: "researcher",
    title: "$E[\\min(X,Y)]$ for Independent Exponentials",
    prompt_md:
      "Let $X\\sim\\text{Exp}(\\lambda_1)$ and $Y\\sim\\text{Exp}(\\lambda_2)$ be independent.\n\nCompute $E[\\min(X,Y)]$.",
    solution_md:
      "The minimum of independent exponentials is exponential with rate $\\lambda_1+\\lambda_2$, so the mean is $1/(\\lambda_1+\\lambda_2)$.",
    answer_kind: "exact",
    answer_value: "1/(lambda1+lambda2)",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["exponential", "memoryless", "expectation"],
    source: "Competing exponentials",
    target_roles: ["Researcher"],
  },
  {
    slug: "thinning-poisson-sum-property-freeform",
    topic: "Probability",
    track: "researcher",
    title: "Poisson Superposition",
    prompt_md:
      "Let $N_1\\sim\\text{Poisson}(\\lambda_1)$ and $N_2\\sim\\text{Poisson}(\\lambda_2)$ be independent.\n\nWhat is the distribution of $N_1+N_2$? Briefly justify.",
    solution_md:
      "The sum of independent Poisson variables is Poisson with rate sum: $N_1+N_2\\sim\\text{Poisson}(\\lambda_1+\\lambda_2)$. Justification via mgf/pgf or by thinking of superposition of independent Poisson processes.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["poisson", "superposition"],
    source: "Core property",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 45,
      rubric: [
        "States $N_1+N_2\\sim\\text{Poisson}(\\lambda_1+\\lambda_2)$: 70%",
        "Provides a valid justification (mgf/pgf or process superposition intuition): 30%",
      ],
      reference_solution_md:
        "$$N_1+N_2\\sim\\text{Poisson}(\\lambda_1+\\lambda_2).$$ Justify via mgf/pgf or superposition.\n",
    },
  },
  {
    slug: "bayes-conditional-independence-naive-bayes",
    topic: "Probability",
    track: "researcher",
    title: "Conditional Independence (Naive Bayes Intuition)",
    prompt_md:
      "Give a precise definition of conditional independence of events $A$ and $B$ given event $C$.\n\nThen explain in 2–4 sentences how conditional independence is used in naive Bayes classifiers.",
    solution_md:
      "Conditional independence means $P(A\\cap B\\mid C)=P(A\\mid C)P(B\\mid C)$ (equivalently $P(A\\mid B,C)=P(A\\mid C)$ when defined). Naive Bayes assumes features are conditionally independent given the class label, so the likelihood factorizes as $P(x\\mid y)=\\prod_j P(x_j\\mid y)$.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["conditional-independence", "bayes", "classification"],
    source: "Core concept",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 60,
      rubric: [
        "States the correct conditional independence identity $P(A\\cap B\\mid C)=P(A\\mid C)P(B\\mid C)$ (or equivalent): 70%",
        "Explains the naive Bayes factorization of likelihood across features given label: 30%",
      ],
      reference_solution_md:
        "Cond. independence: $P(A\\cap B|C)=P(A|C)P(B|C)$. Naive Bayes assumes feature conditional independence given class so $P(x|y)=\\prod_j P(x_j|y)$.\n",
    },
  },
  {
    slug: "stopping-time-definition-freeform",
    topic: "Probability",
    track: "researcher",
    title: "Stopping Time — Definition",
    prompt_md:
      "Define a stopping time $\\tau$ with respect to a filtration $(\\mathcal{F}_t)$.\n\nGive one example.",
    solution_md:
      "$\\tau$ is a stopping time if for each $t$, the event $\\{\\tau\\le t\\}\\in\\mathcal{F}_t$ (the decision to stop by time $t$ depends only on information up to time $t$). Example: first hitting time of a random walk to level +1, or first time $B_t$ exceeds 1 for Brownian motion.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["stopping-time", "martingale", "filtration"],
    source: "Stochastic processes basics",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 55,
      rubric: [
        "States the measurability condition $\\{\\tau\\le t\\}\\in\\mathcal{F}_t$ for all $t$: 75%",
        "Provides a valid example (hitting time, first passage time, etc.): 25%",
      ],
      reference_solution_md:
        "Stopping time: for all $t$, $\\{\\tau\\le t\\}\\in\\mathcal{F}_t$. Example: first hitting time of a process to a set.\n",
    },
  },
  {
    slug: "symmetry-random-chord-midpoint",
    topic: "Probability",
    track: "researcher",
    title: "Random Point on a Circle — Symmetry",
    prompt_md:
      "Pick a point uniformly at random on the unit circle. What is the expected value of its $x$-coordinate?",
    solution_md:
      "By symmetry, the distribution of $x$ is symmetric about 0, so $E[x]=0$.",
    answer_kind: "numeric",
    answer_value: "0",
    answer_tolerance: 1e-9,
    difficulty: 1,
    tags: ["symmetry", "expectation"],
    source: "Symmetry warm-up",
    target_roles: ["All"],
  },
  {
    slug: "conditional-expectation-bernoulli-given-sum",
    topic: "Probability",
    track: "researcher",
    title: "Conditional Expectation: Bernoulli Given the Sum",
    prompt_md:
      "Let $X_1,\\dots,X_n$ be iid Bernoulli($p$), and let $S=\\sum_{i=1}^n X_i$.\n\nCompute $E[X_1\\mid S]$.",
    solution_md:
      "By symmetry, conditional on $S=s$, each $X_i$ has the same conditional expectation and they sum to $s$. So $E[X_1\\mid S=s]=s/n$. Therefore $E[X_1\\mid S]=S/n$.",
    answer_kind: "exact",
    answer_value: "S/n",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["conditioning", "symmetry", "expectation"],
    source: "Stat 110 classic",
    target_roles: ["Researcher"],
  },
  {
    slug: "probability-borel-cantelli-mcq",
    topic: "Probability",
    track: "researcher",
    title: "Borel–Cantelli Lemma (First)",
    prompt_md:
      "Let $(A_n)$ be events. Which statement is the (first) Borel–Cantelli lemma?",
    solution_md:
      "If $\\sum_n P(A_n) < \\infty$, then $P(A_n\\ \\text{i.o.})=0$ (only finitely many occur almost surely).",
    answer_kind: "mcq",
    answer_value: "bc1",
    answer_tolerance: null,
    difficulty: 4,
    tags: ["measure", "asymptotic", "borel-cantelli"],
    source: "Classic theorem",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        { id: "bc1", label: "If $\\sum_n P(A_n)<\\infty$, then $P(A_n\\ \\text{i.o.})=0$.", correct: true },
        { id: "reverse", label: "If $\\sum_n P(A_n)<\\infty$, then $P(A_n\\ \\text{i.o.})=1$.", correct: false },
        { id: "always", label: "$P(A_n\\ \\text{i.o.})=0$ for any events.", correct: false },
        { id: "indep", label: "If $A_n$ are independent and $\\sum_n P(A_n)<\\infty$, then $P(A_n\\ \\text{i.o.})=1$.", correct: false },
      ],
    },
  },
  {
    slug: "random-variable-transform-cdf-method-freeform",
    topic: "Probability",
    track: "researcher",
    title: "CDF Method for Transformations",
    prompt_md:
      "Explain the CDF method for finding the distribution of $Y=g(X)$.\n\nIn 4–8 sentences, outline the steps, and mention when monotonicity matters.",
    solution_md:
      "Compute $F_Y(y)=P(Y\\le y)=P(g(X)\\le y)$. If $g$ is monotone, this becomes an event of the form $\\{X\\le g^{-1}(y)\\}$ (or $\\{X\\ge g^{-1}(y)\\}$), so you can use $F_X$ directly and then differentiate to get a density. If $g$ is not monotone, you may need to break into multiple regions where $g$ is monotone and sum the probabilities.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["cdf", "transformations", "distributions"],
    source: "Core technique",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 80,
      rubric: [
        "States $F_Y(y)=P(g(X)\\le y)$ and reduces to an event about $X$: 55%",
        "Mentions monotone case using inverse $g^{-1}$: 30%",
        "Mentions non-monotone case requires splitting into monotone regions: 15%",
      ],
      reference_solution_md:
        "CDF method: $F_Y(y)=P(g(X)\\le y)$. If $g$ monotone, rewrite using $g^{-1}$ and apply $F_X$, then differentiate. If not monotone, split into regions.\n",
    },
  },
  {
    slug: "bayes-three-coins",
    topic: "Probability",
    track: "researcher",
    title: "Bayes: Choose Among Three Coins",
    prompt_md:
      "You have three coins: one double-headed (HH), one fair (HT), and one double-tailed (TT). You pick one uniformly at random and flip it once; it lands heads.\n\nWhat is the probability you picked the double-headed coin?",
    solution_md:
      "P(H)= (1/3)\\cdot 1 + (1/3)\\cdot (1/2) + (1/3)\\cdot 0 = 1/2. Posterior:\n\n$$P(HH\\mid H)=\\frac{(1/3)\\cdot 1}{1/2}=\\frac{2}{3}.$$",
    answer_kind: "fraction",
    answer_value: "2/3",
    answer_tolerance: 1e-3,
    difficulty: 2,
    tags: ["bayes", "conditioning"],
    source: "Classic",
    target_roles: ["All"],
  },
  {
    slug: "expected-rolls-until-sum-seven",
    topic: "Probability",
    track: "researcher",
    title: "Expected Rolls Until Sum 7",
    prompt_md:
      "You repeatedly roll two fair dice until the sum is 7. What is the expected number of rolls?",
    solution_md:
      "Each roll is a Bernoulli trial with success probability $p=1/6$ (sum 7 has 6 out of 36 outcomes). Geometric mean is $1/p=6$.",
    answer_kind: "numeric",
    answer_value: "6",
    answer_tolerance: 1e-9,
    difficulty: 1,
    tags: ["geometric", "expectation", "combinatorics"],
    source: "Classic",
    target_roles: ["All"],
  },
  {
    slug: "median-of-three-uniforms",
    topic: "Probability",
    track: "researcher",
    title: "Median of 3 Uniform(0,1) — Expected Value",
    prompt_md:
      "Let $U_1,U_2,U_3$ be iid Uniform(0,1). Let $M$ be the median (the 2nd order statistic).\n\nCompute $E[M]$.",
    solution_md:
      "The $k$th order statistic of $n$ iid Uniform(0,1) has mean $k/(n+1)$. Here $k=2,n=3$, so $E[M]=2/4=1/2$.",
    answer_kind: "fraction",
    answer_value: "1/2",
    answer_tolerance: 1e-3,
    difficulty: 3,
    tags: ["order-statistics", "uniform"],
    source: "Order statistics fact",
    target_roles: ["Researcher"],
  },
  {
    slug: "conditional-expected-dice-sum-given-max",
    topic: "Probability",
    track: "researcher",
    title: "E[Sum | Max] for Two Dice",
    prompt_md:
      "Roll two fair dice with outcomes $X$ and $Y$. Let $M=\\max(X,Y)$.\n\nCompute $E[X+Y\\mid M=m]$ for a given $m\\in\\{1,2,3,4,5,6\\}$.",
    solution_md:
      "Condition on $M=m$. The valid ordered pairs are $(m,1..m)$ and $(1..m-1,m)$, total $2m-1$ outcomes. Sum of values across these outcomes: for $x=m$, $y$ runs 1..m giving sum $m\\cdot m + \\sum_{y=1}^m y$; for $y=m$, $x$ runs 1..m-1 giving sum $m\\cdot (m-1) + \\sum_{x=1}^{m-1} x$. Total sum is\n\n$$m(2m-1) + \\frac{m(m+1)}{2} + \\frac{(m-1)m}{2} = m(2m-1)+m^2 = m(3m-1).$$\n\nDivide by $2m-1$ to get\n\n$$E[X+Y\\mid M=m]=\\frac{m(3m-1)}{2m-1}.$$",
    answer_kind: "exact",
    answer_value: "m(3m-1)/(2m-1)",
    answer_tolerance: null,
    difficulty: 4,
    tags: ["conditioning", "expectation", "combinatorics"],
    source: "Classic conditioning exercise",
    target_roles: ["Researcher"],
  },
  {
    slug: "expected-value-of-exponential-truncated-freeform",
    topic: "Probability",
    track: "researcher",
    title: "Truncated Expectation via Tail Integral",
    prompt_md:
      "Let $X\\sim\\text{Exp}(\\lambda)$. Compute $E[\\min(X,t)]$ for a fixed $t>0$.",
    solution_md:
      "Use tail integral: $E[\\min(X,t)] = \\int_0^t P(X>s)\\,ds = \\int_0^t e^{-\\lambda s}\\,ds = \\frac{1-e^{-\\lambda t}}{\\lambda}$.",
    answer_kind: "exact",
    answer_value: "(1-exp(-lambda*t))/lambda",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["exponential", "tail-integral", "expectation"],
    source: "Tail integral trick",
    target_roles: ["Researcher"],
  },
];
