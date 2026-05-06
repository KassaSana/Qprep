/**
 * Seed problems for the Quant Researcher track.
 *
 * Each problem stores the prompt as Markdown with KaTeX-style math:
 *   inline:  $E[X] = \\sum x \\, p(x)$
 *   block:   $$ ... $$
 *
 * `answer_kind` controls validation (see lib/answer-check.ts).
 */

export interface SeedQuestion {
  slug: string;
  track: "researcher";
  title: string;
  prompt_md: string;
  solution_md: string;
  answer_kind: "numeric" | "fraction" | "exact";
  answer_value: string;
  answer_tolerance: number | null;
  difficulty: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  source: string;
}

export const RESEARCHER_SEED: SeedQuestion[] = [
  {
    slug: "two-dice-sum-seven",
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
    source: "Classic",
  },
  {
    slug: "monty-hall-switch",
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
    source: "Selvin / Savant",
  },
  {
    slug: "two-children-at-least-one-boy",
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
    source: "Gardner",
  },
  {
    slug: "disease-test-bayes",
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
    source: "Classic",
  },
  {
    slug: "expected-rolls-until-six",
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
    source: "Classic interview",
  },
  {
    slug: "expected-flips-until-ht",
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
    source: "Classic",
  },
  {
    slug: "ace-in-five-card-hand",
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
    source: "50 Challenging Problems",
  },
  {
    slug: "hat-check-fixed-points",
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
    slug: "variance-binomial-100-half",
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
    slug: "geometric-first-head-third-flip",
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
    track: "researcher",
    title: "Symmetric Random Walk — Back at Origin in 2 Steps",
    prompt_md:
      "A symmetric simple random walk on $\\mathbb{Z}$ starts at $0$ and at each step moves $\\pm 1$ with probability $1/2$. What is the probability it is back at $0$ after exactly $2$ steps?",
    solution_md:
      "$P = \\binom{2}{1}(1/2)^2 = 1/2$.",
    answer_kind: "fraction",
    answer_value: "1/2",
    answer_tolerance: 1e-9,
    difficulty: 2,
    tags: ["random-walk", "binomial"],
    source: "Textbook",
  },
  {
    slug: "ev-uniform-zero-one-square",
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
    source: "Textbook",
  },
  {
    slug: "gamblers-ruin-fair",
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
    source: "Textbook",
  },
  {
    slug: "secretary-named-theorem",
    track: "researcher",
    title: "Theorem Recognition — Optimal Stopping",
    prompt_md:
      "An interviewer faces $n$ candidates one at a time, in random order, and must immediately accept or reject each. The asymptotic optimal strategy rejects the first $\\lfloor n/e \\rfloor$ candidates and accepts the next who is best so far. By what name is this problem most commonly known? (Answer with two words.)",
    solution_md:
      "This is the Secretary Problem.",
    answer_kind: "exact",
    answer_value: "secretary problem",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["theorem-recall", "optimal-stopping"],
    source: "Classic",
  },
];
