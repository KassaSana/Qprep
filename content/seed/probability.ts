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
];
