import type { SeedQuestion } from "@/content/question-types";

/**
 * Brainteasers — quick mental-math, theorem recall, and EV-style puzzles
 * that don't quite fit a more rigorous topic. Migrated from the v1 trader
 * mental-math set plus the Secretary Problem theorem-recall question.
 */
export const BRAINTEASERS_SEED: SeedQuestion[] = [
  {
    slug: "secretary-named-theorem",
    topic: "Brainteasers",
    track: "researcher",
    title: "Theorem Recognition — Optimal Stopping",
    prompt_md:
      "An interviewer faces $n$ candidates one at a time, in random order, and must immediately accept or reject each. The asymptotic optimal strategy rejects the first $\\lfloor n/e \\rfloor$ candidates and accepts the next who is best so far. By what name is this problem most commonly known? (Answer with two words.)",
    solution_md: "This is the Secretary Problem.",
    answer_kind: "exact",
    answer_value: "secretary problem",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["theorem-recall", "optimal-stopping"],
    companies: ["Jane Street"],
    source: "Classic",
    target_roles: ["All"],
  },
  {
    slug: "coin-game-advantage",
    topic: "Brainteasers",
    track: "researcher",
    title: "Biased Coin EV",
    prompt_md:
      "You pay $5$ dollars to play a game. A biased coin lands heads with probability $0.55$. If heads, you receive $12$ dollars; if tails, you receive $0$. What is your expected profit per play?",
    solution_md:
      "Expected payout is $0.55 \\cdot 12 = 6.6$. Subtract the $5$ entry cost to get expected profit $1.6$.",
    answer_kind: "numeric",
    answer_value: "1.6",
    answer_tolerance: 1e-3,
    difficulty: 1,
    tags: ["ev", "probability", "mental-math"],
    source: "Classic trader warm-up",
    target_roles: ["All"],
  },
  {
    slug: "russian-roulette-adjacent-bullets",
    topic: "Brainteasers",
    track: "researcher",
    title: "Russian Roulette: Spin or Pull Again?",
    prompt_md:
      "A revolver has 6 chambers with **2 bullets in adjacent chambers**. You pull the trigger once and hear a click (empty).\n\nDo you have a higher survival probability if you **spin** the cylinder again, or if you **pull again without spinning**? Answer with one word: `spin` or `pull`.",
    solution_md:
      "After a safe click with adjacent bullets, the current chamber is known empty. Without spinning, the next chamber is a bullet in 1 of the 4 possible remaining positions (conditional), giving survival probability 3/4. Spinning resets to 4/6 survival. So you should **pull** again without spinning.",
    answer_kind: "exact",
    answer_value: "pull",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["conditioning", "bayes", "logic"],
    companies: ["SIG", "Optiver"],
    source: "Classic brainteaser",
    target_roles: ["All"],
  },
  {
    slug: "two-ropes-45-minutes-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "Two Ropes: Measure 45 Minutes",
    prompt_md:
      "You have two ropes. Each rope takes **exactly 60 minutes** to burn completely, but they burn at a **non-uniform** rate (different thicknesses, etc.).\n\nYou have a lighter. How can you measure exactly **45 minutes**?\n\nAnswer in 3–7 sentences.",
    solution_md:
      "Light rope A at both ends and rope B at one end simultaneously. Rope A will finish in 30 minutes (burning from both ends). At that moment, light rope B at its other end; the remaining half-hour of rope B now burns from both ends and finishes in 15 minutes. Total: 30 + 15 = 45 minutes.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["logic", "puzzle"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      min_words: 45,
      rubric: [
        "Uses the idea of lighting one rope at both ends to get a guaranteed 30 minutes: 55%",
        "Correctly sequences the second rope so the remaining time is 15 minutes (light other end at 30-minute mark): 35%",
        "Clearly states the total is 45 minutes: 10%",
      ],
      reference_solution_md:
        "Light rope A at both ends + rope B at one end. After A finishes (30 min), light B at the other end; it finishes in 15 more → 45 total.\n",
    },
  },
  {
    slug: "three-switches-lightbulb-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "Three Switches, One Bulb",
    prompt_md:
      "Three switches outside a closed room control one lightbulb inside. Exactly one switch works.\n\nYou may enter the room **once**. How do you determine which switch controls the bulb?\n\nAnswer in 3–7 sentences.",
    solution_md:
      "Turn switch 1 on for several minutes, then turn it off. Turn switch 2 on and enter the room. If the bulb is on, it's switch 2. If the bulb is off but warm, it's switch 1. If the bulb is off and cold, it's switch 3.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["logic", "puzzle"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      min_words: 55,
      rubric: [
        "Uses heat as an additional piece of information beyond on/off: 40%",
        "Provides a correct switch sequence (one on then off, another on) before entering: 40%",
        "Correctly maps outcomes (on/warm/cold) to the three switches: 20%",
      ],
      reference_solution_md:
        "Leave one switch on long enough to heat bulb then off; turn another on; enter once and use on/warm/cold to identify the correct switch.\n",
    },
  },
  {
    slug: "50-50-or-100-ev-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "50/50: $50$ for Sure vs $100$ or $0$",
    prompt_md:
      "You can choose between:\n\n- Option A: receive $50 for sure\n- Option B: flip a fair coin; receive $100 on heads and $0 on tails\n\nWhich has higher expected value, and which would a risk-averse person typically prefer?\n\nAnswer in 4–8 sentences.",
    solution_md:
      "Both have the same expected value: Option A EV = 50, Option B EV = 0.5·100 + 0.5·0 = 50. A risk-averse person (concave utility) typically prefers the sure $50 because it has lower variance; with concave utility, $E[u(X)]<u(E[X])$ so the lottery is less attractive than the sure amount at the same mean.",
    answer_kind: "freeform",
    difficulty: 1,
    tags: ["ev", "utility", "jensen"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      min_words: 70,
      rubric: [
        "Computes both expected values correctly (they are equal): 55%",
        "States risk-averse preference (typically choose sure $50) and ties to variance/concave utility: 35%",
        "Uses correct language (risk-averse/concave utility) without claiming it is always optimal for everyone: 10%",
      ],
      reference_solution_md:
        "EV(A)=50, EV(B)=0.5·100=50. Risk-averse (concave utility) prefers the sure $50 due to variance/ Jensen.",
    },
  },
  {
    slug: "monty-hall-switch-mcq",
    topic: "Brainteasers",
    track: "researcher",
    title: "Monty Hall — Switch or Stay?",
    prompt_md:
      "In the classic Monty Hall problem (3 doors, 1 car, 2 goats), after you pick a door the host opens a different door showing a goat and offers you a chance to switch.\n\nWhich strategy maximizes your probability of winning the car?",
    solution_md:
      "Switching wins with probability $2/3$ (staying wins with $1/3$) under the standard assumptions (host always opens a goat door and always offers the switch).",
    answer_kind: "mcq",
    answer_value: "switch",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["conditioning", "probability", "classic"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      options: [
        { id: "switch", label: "Always switch.", correct: true },
        { id: "stay", label: "Always stay.", correct: false },
        { id: "random", label: "Switching or staying are equal; it doesn't matter.", correct: false },
        { id: "depends", label: "It depends, even under the standard host assumptions.", correct: false },
      ],
    },
  },
  {
    slug: "monty-hall-why-switch-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "Monty Hall — Explain Why Switching Works",
    prompt_md:
      "Explain (in 5–10 sentences) why switching in Monty Hall gives a $2/3$ chance of winning under the standard assumptions.\n\nBe explicit about where the $2/3$ probability mass goes after the host reveals a goat.",
    solution_md:
      "Initially your chosen door has probability $1/3$ of hiding the car and the set of the other two doors has probability $2/3$. The host's action (opening a goat door among the two you didn't pick) does not change the $1/3$ chance your original door is correct; instead it concentrates the entire $2/3$ probability on the single remaining unopened door. Therefore switching wins with probability $2/3$.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["conditioning", "bayes", "explanation"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      min_words: 95,
      rubric: [
        "States the initial probabilities (chosen door 1/3, other-two-doors combined 2/3): 45%",
        "Explains host reveals information without changing the 1/3 on the chosen door under standard assumptions: 30%",
        "Explicitly states the 2/3 mass concentrates on the remaining unopened door → switching wins 2/3: 25%",
      ],
      reference_solution_md:
        "Chosen door starts at 1/3; the other two doors are 2/3. Host opens a goat among the other two; under standard host rules the 1/3 stays on your door and the 2/3 collapses to the remaining unopened door → switch wins 2/3.\n",
    },
  },
  {
    slug: "100-prisoners-probability-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "100 Prisoners — Strategy and Success Probability",
    prompt_md:
      "100 prisoners face 100 boxes labeled 1..100 containing a random permutation of the numbers 1..100. Prisoner $i$ may open up to 50 boxes, one at a time, and succeeds if they find the box containing $i$. The prisoners may agree on a strategy beforehand but cannot communicate afterward.\n\nDescribe the best-known strategy and give its approximate probability of success.",
    solution_md:
      "Strategy: each prisoner starts at their own label $i$, opens that box, then follows the pointer chain (the number inside tells the next box to open), continuing for up to 50 steps. The group succeeds iff the permutation has no cycle longer than 50. The success probability is about 0.31 (≈ 30.7%).",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["permutations", "cycles", "strategy"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      min_words: 110,
      rubric: [
        "Describes the cycle-following (pointer chain) strategy starting from box i: 55%",
        "States the success condition in terms of permutation cycle lengths (no cycle > 50): 30%",
        "Gives a reasonable success probability (≈0.31) or clearly states 'about 30%': 15%",
      ],
      reference_solution_md:
        "Use the permutation-cycle strategy: start at box i and follow the chain of numbers. Success iff permutation has no cycle longer than 50; probability ≈ 0.31.\n",
    },
  },
  {
    slug: "bridge-and-torch-17-minutes-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "Bridge and Torch (1,2,5,10)",
    prompt_md:
      "Four people need to cross a bridge at night with one torch. They take 1, 2, 5, and 10 minutes respectively to cross. At most two people can cross at once, and the torch must be carried.\n\nWhat is the minimum total time, and outline an optimal schedule.",
    solution_md:
      "Minimum is 17 minutes. Schedule: (1,2) cross (2 min), 1 returns (1) → 3. (5,10) cross (10) → 13. 2 returns (2) → 15. (1,2) cross again (2) → 17.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["logic", "scheduling", "classic"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      min_words: 95,
      rubric: [
        "Gives the correct minimum total time (17): 40%",
        "Provides a correct sequence of crossings/returns that achieves 17: 50%",
        "Explains the key idea (use fastest as shuttles; send 5&10 together): 10%",
      ],
      reference_solution_md:
        "17 minutes: 1&2 cross, 1 back; 5&10 cross, 2 back; 1&2 cross.\n",
    },
  },
  {
    slug: "two-egg-100-floor-mcq",
    topic: "Brainteasers",
    track: "researcher",
    title: "Two Eggs and 100 Floors",
    prompt_md:
      "You have 2 identical eggs and a 100-floor building. An egg breaks if dropped from some floor $F$ or higher, and never breaks below $F$. Eggs that break are unusable.\n\nWhat is the minimum number of drops needed in the worst case to determine $F$?",
    solution_md:
      "14. Use decreasing step sizes: drop from 14, then +13, then +12, ... so the worst-case total drops is 14.",
    answer_kind: "mcq",
    answer_value: "14",
    answer_tolerance: null,
    difficulty: 4,
    tags: ["optimization", "puzzle", "worst-case"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      options: [
        { id: "14", label: "14", correct: true },
        { id: "10", label: "10", correct: false },
        { id: "7", label: "7", correct: false },
        { id: "50", label: "50", correct: false },
      ],
    },
  },
  {
    slug: "three-hats-two-white-one-black-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "Three Hats (2 White, 1 Black)",
    prompt_md:
      "Three people are each given a hat. There are two white hats and one black hat total. Each person can see the other two hats but not their own.\n\nThey are asked in order: A, then B, then C. A says \"I don't know.\" B says \"I don't know.\" What can C conclude about their own hat color, and why?\n\nAnswer in 5–10 sentences.",
    solution_md:
      "C must be wearing a white hat. If C were wearing black, then A would see B and C both wearing white and would immediately know A must be black (since only one black exists). But A didn't know, so C is not black. Therefore C is white.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["logic", "common-knowledge", "deduction"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      min_words: 95,
      rubric: [
        "Correctly concludes C's hat is white: 40%",
        "Uses the counterfactual reasoning: if C were black then A would see two whites and know immediately: 45%",
        "Clearly ties this to A's 'I don't know' response (information revealed): 15%",
      ],
      reference_solution_md:
        "C is white. If C were black, A would see two white hats and know A must be black. Since A didn't know, C isn't black → C is white.\n",
    },
  },
  {
    slug: "counterfeit-coin-12-balls-why-3-weighings-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "12 Balls and a Balance Scale — Why 3 Weighings Suffice",
    prompt_md:
      "Classic puzzle: 12 balls, one is counterfeit and is either heavier or lighter (unknown which). You have a balance scale and want to identify the counterfeit ball and whether it is heavier or lighter.\n\nIn 4–8 sentences, explain why **3 weighings** are information-theoretically enough (i.e., what the key counting argument is). You do *not* need to give the full weighing scheme.",
    solution_md:
      "Each weighing has 3 outcomes: left heavy, right heavy, or balance. So 3 weighings yield up to $3^3=27$ outcome patterns. There are 24 possibilities to distinguish (12 choices × {heavy, light}), plus one 'all genuine' state if you include it. Since 27 ≥ 24 (and even ≥ 25), there is enough information in principle for a 3-weighing strategy.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["information", "logic", "counting"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      min_words: 85,
      rubric: [
        "Counts 3 outcomes per weighing and computes $3^3=27$ patterns: 50%",
        "Counts the hypotheses as 12×2=24 (heavy vs light) and compares to 27: 40%",
        "Mentions optional 'all genuine' state and still notes feasibility: 10%",
      ],
      reference_solution_md:
        "3-outcome balance scale → $3^3=27$ patterns. Need distinguish 12×2=24 cases (heavy vs light). Since 27 ≥ 24 (even ≥ 25 incl. all-genuine), 3 weighings are information-theoretically enough.\n",
    },
  },
  {
    slug: "airplane-seating-last-seat-mcq",
    topic: "Brainteasers",
    track: "researcher",
    title: "Airplane Seating — Last Passenger Probability",
    prompt_md:
      "Classic puzzle: 100 passengers board a plane with assigned seats 1..100. Passenger 1 has lost their boarding pass and sits in a random seat. Each subsequent passenger sits in their assigned seat if available; otherwise they pick a random remaining seat.\n\nWhat is the probability that the last passenger sits in their assigned seat?",
    solution_md:
      "The probability is 1/2 (for $n\\ge 2$).",
    answer_kind: "mcq",
    answer_value: "half",
    answer_tolerance: null,
    difficulty: 4,
    tags: ["probability", "classic", "invariants"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      options: [
        { id: "half", label: "$1/2$", correct: true },
        { id: "one-over-100", label: "$1/100$", correct: false },
        { id: "ninety-nine-over-100", label: "$99/100$", correct: false },
        { id: "one-third", label: "$1/3$", correct: false },
      ],
    },
  },
  {
    slug: "airplane-seating-why-half-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "Airplane Seating — Explain Why It's 1/2",
    prompt_md:
      "In 5–10 sentences, explain why the airplane seating puzzle yields probability $1/2$ for the last passenger to get their seat.\n\nHint: track what happens when someone is forced to pick a random seat.",
    solution_md:
      "At any point, the only seats that matter are seat 1 and seat 100 (the last passenger's). The process ends when one of those is chosen randomly: if someone is forced to choose and picks seat 100, the last passenger loses; if they pick seat 1, then everyone else can sit correctly and the last passenger wins. When the first forced random choice among {1,100} occurs, it is equally likely to be seat 1 or seat 100, giving probability 1/2.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["probability", "explanation", "invariants"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      min_words: 100,
      rubric: [
        "Identifies the key invariant: only seats {1, n} remain 'special'/relevant: 45%",
        "Explains the stopping event: first time a forced random chooser picks seat 1 or seat n: 35%",
        "Concludes symmetry gives probability 1/2: 20%",
      ],
      reference_solution_md:
        "Only seats 1 and n matter. Eventually a forced random picker chooses one of {1,n}. If they choose n, last passenger loses; if they choose 1, the chain resolves and last passenger wins. By symmetry, probability is 1/2.\n",
    },
  },
  {
    slug: "poisoned-bottles-binary-encoding-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "Poisoned Bottles — Binary Encoding",
    prompt_md:
      "You have 1000 bottles of wine; exactly one is poisoned. You have 10 prisoners (or mice) available to test. The poison takes effect overnight and you only get **one round** of testing.\n\nHow can you identify the poisoned bottle, and why does 10 suffice?\n\nAnswer in 6–12 sentences.",
    solution_md:
      "Label bottles 1..1000 and write each label in binary using 10 bits. Assign each tester to one bit position. For a given bottle, have all testers whose bit is 1 drink from that bottle (mixed into their cup). After overnight, the pattern of which testers die corresponds to the 10-bit binary representation of the poisoned bottle's index. 10 testers suffice because there are $2^{10}=1024$ possible death patterns, enough to encode 1000 bottles.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["information", "binary", "logic"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "Uses binary encoding / assigns testers to bit positions: 55%",
        "Explains decoding: death pattern reveals the binary label of the poisoned bottle: 30%",
        "Justifies sufficiency via $2^{10}=1024\\ge 1000$: 15%",
      ],
      reference_solution_md:
        "Use 10-bit binary labels for bottles. Tester j drinks from bottles with bit j=1. Death pattern is the binary index of poisoned bottle. 2^10=1024≥1000.\n",
    },
  },
  {
    slug: "prisoners-lightbulb-counting-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "Prisoners and a Lightbulb",
    prompt_md:
      "N prisoners are in isolated cells. Each day, one randomly chosen prisoner is taken to a common room containing a lightbulb with a switch (initial state unknown). Prisoners can see the bulb state only when in the room.\n\nThey must eventually announce a day when they are certain **everyone** has visited the room at least once; a wrong announcement means everyone loses.\n\nDescribe a winning strategy (high level) and explain why it works.",
    solution_md:
      "Pick a leader/counter. Non-leaders, the first time they see the bulb off, turn it on (exactly once per prisoner). The leader turns the bulb off whenever they see it on, and increments a count each time they do so. Once the leader has turned it off N−1 times, they can safely announce everyone has visited: each increment corresponds to a distinct non-leader's first visit (since non-leaders act at most once). The initial unknown state is handled by having the leader 'normalize' by first turning it off the first time they see it on without counting, or by adjusting the protocol to ensure counts correspond to unique actions.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["strategy", "invariants", "logic"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      min_words: 140,
      rubric: [
        "Defines leader-counter strategy with non-leaders turning bulb on at most once: 50%",
        "Explains why N−1 counted offs implies everyone visited (each count maps to unique prisoner): 35%",
        "Addresses unknown initial state correctly (normalization step / don't count first on): 15%",
      ],
      reference_solution_md:
        "Leader counts. Each non-leader turns the light on exactly once (first time they see it off). Leader turns it off and increments count. After N−1 valid increments, all must have visited. Handle unknown initial state by not counting the first time leader sees it on (normalize).\n",
    },
  },
  {
    slug: "meeting-on-a-circle-expected-time-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "Meeting on a Circle (Strategy Question)",
    prompt_md:
      "Two people are supposed to meet somewhere on a large circular track. Each arrives at a random time (uniform on an interval), and can decide a strategy for waiting/moving. You want to maximize the probability of meeting.\n\nDescribe a reasonable strategy and the intuition (no need for an exact probability).",
    solution_md:
      "A common high-level strategy is to create a symmetric search pattern: wait for some time threshold, then start walking in one direction; if you don't meet by another time, reverse direction. The intuition is to break symmetry so relative motion increases coverage while ensuring you don't 'chase' indefinitely in the same direction; the wait phase handles the case where arrivals are close in time, and walking phases handle larger offsets.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["strategy", "symmetry", "search"],
    source: "Interview-style puzzle",
    target_roles: ["All"],
    answer_meta: {
      min_words: 110,
      rubric: [
        "Proposes a coherent, symmetric strategy (wait then walk; possibly reverse) rather than ad hoc: 50%",
        "Gives intuition about symmetry breaking / increasing relative motion / coverage: 35%",
        "Mentions how the strategy handles both small and large arrival offsets: 15%",
      ],
      reference_solution_md:
        "Reasonable strategy: wait some time, then walk one direction, then possibly reverse. Intuition: symmetry + increasing relative motion improves meeting chance without endless chasing.\n",
    },
  },
  {
    slug: "two-jugs-measure-4-mcq",
    topic: "Brainteasers",
    track: "researcher",
    title: "Water Jugs (3L and 5L)",
    prompt_md:
      "You have a 3-liter jug and a 5-liter jug (no markings). You have unlimited water and can fill, pour, and empty jugs.\n\nCan you measure exactly 4 liters?",
    solution_md:
      "Yes. Standard solution: fill 5, pour into 3 (leaves 2), empty 3, pour 2 into 3, fill 5, pour into 3 to fill remaining 1 → leaves 4 in the 5-liter jug.",
    answer_kind: "mcq",
    answer_value: "yes",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["logic", "puzzle"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      options: [
        { id: "yes", label: "Yes", correct: true },
        { id: "no", label: "No", correct: false },
      ],
    },
  },
  {
    slug: "expected-rolls-until-6-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "Expected Rolls Until a 6",
    prompt_md:
      "You roll a fair six-sided die until you see a 6.\n\nWhat is the expected number of rolls?\n\nAnswer in 2–5 sentences.",
    solution_md:
      "This is geometric with success probability $p=1/6$, so $E[T]=1/p=6$.",
    answer_kind: "freeform",
    difficulty: 1,
    tags: ["ev", "geometric", "mental-math"],
    source: "Core EV fact",
    target_roles: ["All"],
    answer_meta: {
      min_words: 35,
      rubric: [
        "Identifies the geometric distribution (or memoryless argument): 50%",
        "Computes $E[T]=1/p=6$ correctly: 50%",
      ],
      reference_solution_md:
        "Geometric with $p=1/6$ so $E[T]=1/p=6$.",
    },
  },
  {
    slug: "three-people-birthday-match-mcq",
    topic: "Brainteasers",
    track: "researcher",
    title: "Birthday Match (3 People)",
    prompt_md:
      "Assume birthdays are uniformly random over 365 days and independent. For 3 people, what is the probability that at least two share a birthday (ignore leap years)?",
    solution_md:
      "Probability of all distinct is $\\frac{365}{365}\\cdot\\frac{364}{365}\\cdot\\frac{363}{365}$. So match probability is $1-\\frac{364\\cdot 363}{365^2}$.",
    answer_kind: "mcq",
    answer_value: "1-364*363/365^2",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["probability", "counting"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      options: [
        { id: "1-364*363/365^2", label: "$1-\\frac{364\\cdot 363}{365^2}$", correct: true },
        { id: "3/365", label: "$3/365$", correct: false },
        { id: "1/365", label: "$1/365$", correct: false },
        { id: "1-363/365", label: "$1-\\frac{363}{365}$", correct: false },
      ],
    },
  },
  {
    slug: "expected-coin-flips-until-heads-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "Expected Flips Until First Heads",
    prompt_md:
      "You flip a fair coin until you see the first heads.\n\nWhat is the expected number of flips?\n\nAnswer in 2–5 sentences.",
    solution_md:
      "Geometric with $p=1/2$, so $E[T]=1/p=2$.",
    answer_kind: "freeform",
    difficulty: 1,
    tags: ["ev", "geometric", "mental-math"],
    source: "Core EV fact",
    target_roles: ["All"],
    answer_meta: {
      min_words: 35,
      rubric: [
        "Identifies geometric distribution with $p=1/2$ (or equivalent reasoning): 50%",
        "Computes $E[T]=2$ correctly: 50%",
      ],
      reference_solution_md:
        "Geometric with $p=1/2$ so expected flips is 2.",
    },
  },
  {
    slug: "two-doors-truth-lie-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "Two Doors, Two Guards (Truth/Lie)",
    prompt_md:
      "Two doors: one leads to safety, one to danger. Two guards: one always tells the truth, one always lies. You don't know which guard is which.\n\nYou may ask **one** question to **one** guard.\n\nWhat question guarantees you can choose the safe door?\n\nAnswer in 3–8 sentences.",
    solution_md:
      "Ask either guard: \"Which door would the other guard say leads to safety?\" Then choose the opposite door. If you ask the truth-teller, they truthfully report the liar's (wrong) recommendation; if you ask the liar, they lie about the truth-teller's (correct) recommendation. Either way, you are pointed to the wrong door, so you take the opposite.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["logic", "puzzle"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      min_words: 95,
      rubric: [
        "Provides the standard 'ask what the other would say' (or equivalent) question: 55%",
        "Correctly explains why it works under both cases (truth-teller vs liar): 35%",
        "States to choose the opposite door after hearing the answer: 10%",
      ],
      reference_solution_md:
        "Ask: \"Which door would the other guard say is safe?\" Choose the opposite. Works regardless of which guard you ask.\n",
    },
  },
  {
    slug: "ants-on-triangle-no-collision-mcq",
    topic: "Brainteasers",
    track: "researcher",
    title: "Ants on a Triangle — No Collision Probability",
    prompt_md:
      "Three ants start at the three vertices of an equilateral triangle. Each ant independently chooses to walk along an edge either clockwise or counterclockwise, all at the same speed.\n\nWhat is the probability that no ants collide?",
    solution_md:
      "No collision occurs only if all choose the same direction (all clockwise or all counterclockwise): probability $2/2^3=1/4$.",
    answer_kind: "mcq",
    answer_value: "1/4",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["probability", "symmetry"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      options: [
        { id: "1/4", label: "$1/4$", correct: true },
        { id: "1/2", label: "$1/2$", correct: false },
        { id: "3/4", label: "$3/4$", correct: false },
        { id: "1/8", label: "$1/8$", correct: false },
      ],
    },
  },
  {
    slug: "nine-balls-two-weighings-info-argument-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "9 Balls, One Heavier — Why 2 Weighings Can Be Enough",
    prompt_md:
      "You have 9 identical-looking balls, one is heavier. You have a balance scale.\n\nExplain (in 3–7 sentences) why 2 weighings can be enough to identify the heavier ball in principle (you do not need to give the full plan, just the key counting/information argument).",
    solution_md:
      "Each weighing has 3 outcomes (left heavy, right heavy, balance), so 2 weighings yield up to $3^2=9$ distinct outcome patterns. Since there are 9 possibilities for which ball is heavier, 2 weighings can encode enough information to identify the culprit.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["information", "logic", "counting"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      min_words: 75,
      rubric: [
        "Notes 3 outcomes per weighing and computes $3^2=9$: 60%",
        "Connects 9 outcome patterns to 9 hypotheses (which ball is heavier): 40%",
      ],
      reference_solution_md:
        "2 weighings → $3^2=9$ patterns. Need distinguish 9 possibilities → enough information in principle.\n",
    },
  },
  {
    slug: "take-1-2-3-stones-winning-strategy-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "Take 1–3 Stones (Winning Strategy)",
    prompt_md:
      "A pile starts with $n$ stones. Two players alternate removing 1, 2, or 3 stones. The player who takes the last stone wins.\n\nDescribe the winning strategy and for which $n$ the first player wins.\n\nAnswer in 4–8 sentences.",
    solution_md:
      "The losing positions are multiples of 4. If $n\\equiv 0\\pmod 4$, whatever the first player takes (1–3) leaves $n'\\not\\equiv 0\\pmod 4$ and the second can respond to bring it back to a multiple of 4. If $n\\not\\equiv 0\\pmod 4$, the first player removes $n\\bmod 4$ stones to leave a multiple of 4, then mirrors moves (take 4−k when opponent takes k).",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["games", "invariants"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      min_words: 95,
      rubric: [
        "Identifies multiples of 4 as losing positions: 45%",
        "Gives correct first move when $n\\not\\equiv 0\\pmod 4$ (remove $n\\bmod 4$): 35%",
        "Explains the mirroring response strategy (make total 4 each round): 20%",
      ],
      reference_solution_md:
        "Losing positions are multiples of 4. If $n\\not\\equiv 0\\pmod 4$, take $n\\bmod 4$ to leave a multiple of 4, then mirror to make total 4 each pair of moves.\n",
    },
  },
  {
    slug: "boy-girl-at-least-one-boy-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "Two Children Given At Least One Boy",
    prompt_md:
      "A family has two children. You are told that at least one is a boy. Assuming boy/girl are equally likely and independent, what is the probability that both are boys?\n\nAnswer in 2–6 sentences.",
    solution_md:
      "Possible equally likely pairs are {BB, BG, GB, GG}. Conditioning on at least one boy excludes GG, leaving {BB, BG, GB}. Only one of these three is BB, so probability is 1/3.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["conditioning", "probability"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      min_words: 60,
      rubric: [
        "Conditions correctly by excluding GG and keeping three equally likely cases: 60%",
        "Computes probability as 1/3: 40%",
      ],
      reference_solution_md:
        "Cases: BB,BG,GB,GG. Condition on at least one boy → remove GG → 3 cases, 1 favorable → 1/3.\n",
    },
  },
  {
    slug: "sum-1-to-100-mental-math-mcq",
    topic: "Brainteasers",
    track: "researcher",
    title: "Mental Math: $1+2+\\cdots+100$",
    prompt_md:
      "Compute $1+2+\\cdots+100$.",
    solution_md:
      "$100\\cdot 101/2=5050$.",
    answer_kind: "mcq",
    answer_value: "5050",
    answer_tolerance: null,
    difficulty: 1,
    tags: ["mental-math", "arithmetic"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      options: [
        { id: "5050", label: "5050", correct: true },
        { id: "5000", label: "5000", correct: false },
        { id: "10000", label: "10000", correct: false },
        { id: "4950", label: "4950", correct: false },
      ],
    },
  },
  {
    slug: "three-coin-weighing-min-weighings-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "Weighing: Minimum Weighings for $3^k$ Items",
    prompt_md:
      "You have a balance scale and want to identify one heavier ball among $N$ balls (others equal).\n\nExplain why a natural strategy uses ternary splitting and leads to $k$ weighings being enough for up to $3^k$ balls.\n\nAnswer in 4–8 sentences.",
    solution_md:
      "Each weighing has 3 outcomes: left heavy, right heavy, or balance. If you split the candidates into three equal groups each weighing, you can eliminate about 2/3 of candidates each time. After $k$ weighings, you can distinguish up to $3^k$ possibilities because there are $3^k$ outcome sequences, matching the number of candidate indices.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["information", "logic"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      min_words: 95,
      rubric: [
        "Notes 3 outcomes per weighing → $3^k$ outcome sequences: 55%",
        "Connects to splitting candidates into three groups / ternary search idea: 30%",
        "States the conclusion (up to $3^k$ balls in k weighings): 15%",
      ],
      reference_solution_md:
        "Balance has 3 outcomes per weighing so $k$ weighings yield $3^k$ patterns. Splitting candidates into three groups each time lets you identify one heavier among up to $3^k$ balls.\n",
    },
  },
  {
    slug: "expected-tries-to-get-6-two-dice-mcq",
    topic: "Brainteasers",
    track: "researcher",
    title: "Expected Tries: Sum of Two Dice Equals 6",
    prompt_md:
      "You repeatedly roll two fair dice until the sum is 6. What is the expected number of tries?",
    solution_md:
      "P(sum=6)=5/36, so expected tries is 1/(5/36)=36/5=7.2.",
    answer_kind: "mcq",
    answer_value: "36/5",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["ev", "mental-math"],
    source: "Core EV",
    target_roles: ["All"],
    answer_meta: {
      options: [
        { id: "36/5", label: "$36/5$", correct: true },
        { id: "6", label: "6", correct: false },
        { id: "36", label: "36", correct: false },
        { id: "5/36", label: "$5/36$", correct: false },
      ],
    },
  },
  {
    slug: "chessboard-domino-tiling-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "Mutilated Chessboard and Dominoes",
    prompt_md:
      "An 8×8 chessboard has two opposite corner squares removed. You have 31 dominoes, each covering exactly two adjacent squares.\n\nCan you tile the remaining 62 squares perfectly? Explain why or why not in 3–7 sentences.",
    solution_md:
      "No. A domino always covers one black and one white square. Opposite corners are the same color on a chessboard, so removing them leaves an imbalance: 30 of one color and 32 of the other. Since each domino covers one of each color, perfect tiling is impossible.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["invariants", "logic", "classic"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      min_words: 80,
      rubric: [
        "Uses the coloring invariant (domino covers one black and one white): 55%",
        "Notes opposite corners are same color and removal creates color-count imbalance: 35%",
        "Concludes tiling is impossible: 10%",
      ],
      reference_solution_md:
        "Domino covers 1 black + 1 white. Opposite corners have same color; removing them makes counts unequal, so impossible to tile.\n",
    },
  },
  {
    slug: "wolf-goat-cabbage-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "Wolf, Goat, Cabbage River Crossing",
    prompt_md:
      "Classic river crossing: you must transport a wolf, a goat, and a cabbage across a river using a boat that can carry you plus at most one item. If left alone, the wolf eats the goat, and the goat eats the cabbage.\n\nGive a valid sequence of crossings.\n\nAnswer in 4–10 sentences.",
    solution_md:
      "Take goat across. Return alone. Take wolf across. Bring goat back. Take cabbage across. Return alone. Take goat across. This avoids leaving wolf+goat or goat+cabbage alone.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["logic", "puzzle"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      min_words: 85,
      rubric: [
        "Provides a correct full sequence that ends with all three across: 70%",
        "Avoids forbidden pairings at each intermediate step (wolf+goat, goat+cabbage): 30%",
      ],
      reference_solution_md:
        "Goat over; back; wolf over; goat back; cabbage over; back; goat over.\n",
    },
  },
  {
    slug: "coin-weighing-8-balls-one-heavier-mcq",
    topic: "Brainteasers",
    track: "researcher",
    title: "Weighing Puzzle: 8 Balls, One Heavier",
    prompt_md:
      "You have 8 balls; one is heavier. With a balance scale, what is the minimum number of weighings needed to find the heavier ball?",
    solution_md:
      "2 weighings: first split 3 vs 3; if unbalanced, weigh 1 vs 1 among the heavier side; if balanced, the heavier is among the remaining 2 and one weighing finds it.",
    answer_kind: "mcq",
    answer_value: "2",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["logic", "information"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      options: [
        { id: "1", label: "1", correct: false },
        { id: "2", label: "2", correct: true },
        { id: "3", label: "3", correct: false },
        { id: "4", label: "4", correct: false },
      ],
    },
  },
  {
    slug: "probability-three-coin-same-side-mcq",
    topic: "Brainteasers",
    track: "researcher",
    title: "Three Coin Flips All Same",
    prompt_md:
      "You flip a fair coin 3 times. What is the probability all flips show the same side?",
    solution_md:
      "Outcomes: HHH or TTT → 2 out of 8 → 1/4.",
    answer_kind: "mcq",
    answer_value: "1/4",
    answer_tolerance: null,
    difficulty: 1,
    tags: ["probability", "mental-math"],
    source: "Warm-up",
    target_roles: ["All"],
    answer_meta: {
      options: [
        { id: "1/4", label: "$1/4$", correct: true },
        { id: "1/2", label: "$1/2$", correct: false },
        { id: "1/8", label: "$1/8$", correct: false },
        { id: "3/4", label: "$3/4$", correct: false },
      ],
    },
  },
  {
    slug: "expected-flips-until-two-heads-in-row-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "Expected Flips Until HH",
    prompt_md:
      "You repeatedly flip a fair coin until you see two heads in a row (HH).\n\nWhat is the expected number of flips?\n\nAnswer in 4–10 sentences; set up a short recursion.",
    solution_md:
      "Let $E$ be expected flips from start, and let $E_H$ be expected flips given the last flip was H. Then\n\n$E = 1 + \\tfrac12 E_H + \\tfrac12 E$ (after first flip: H leads to state H, T resets).\n\nAlso $E_H = 1 + \\tfrac12\\cdot 0 + \\tfrac12 E$ (next flip: H finishes; T resets).\n\nFrom first equation, $\\tfrac12E = 1 + \\tfrac12 E_H$ so $E=2+E_H$. From second, $E_H = 1 + \\tfrac12 E$. Substitute: $E=2+1+\\tfrac12E \\Rightarrow \\tfrac12E=3 \\Rightarrow E=6$.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["ev", "recursion"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "Defines appropriate states (start vs last flip H) and sets up correct recursions: 55%",
        "Solves the system correctly: 25%",
        "Gets the correct expected value E=6: 20%",
      ],
      reference_solution_md:
        "Let E=start, E_H=after H. E=1+0.5E_H+0.5E; E_H=1+0.5*0+0.5E. Solve: E=6.\n",
    },
  },
  {
    slug: "birthday-paradox-23-approx-mcq",
    topic: "Brainteasers",
    track: "researcher",
    title: "Birthday Paradox: 23 People",
    prompt_md:
      "Roughly how many people are needed so that the probability of at least one shared birthday exceeds 50% (assuming 365 equally likely birthdays)?",
    solution_md:
      "About 23.",
    answer_kind: "mcq",
    answer_value: "23",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["probability", "approximation", "classic"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      options: [
        { id: "23", label: "23", correct: true },
        { id: "10", label: "10", correct: false },
        { id: "50", label: "50", correct: false },
        { id: "100", label: "100", correct: false },
      ],
    },
  },
  {
    slug: "coin-flip-game-double-or-nothing-ev-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "Double-or-Nothing Until Tails (EV)",
    prompt_md:
      "You flip a fair coin until the first tails. You start with $1. Each time you see heads, your amount doubles. When you see tails, you stop and receive the amount.\n\nWhat is the expected payout? (This is the St. Petersburg-style setup.)\n\nAnswer in 4–8 sentences.",
    solution_md:
      "If the first tails occurs on flip $k$ (meaning $k-1$ heads then a tail), payout is $2^{k-1}$ and probability is $(1/2)^k$. Expected value is\n\n$$\\sum_{k\\ge 1} 2^{k-1}\\cdot (1/2)^k = \\sum_{k\\ge 1} (1/2)=\\infty.$$\n\nSo the expected payout diverges, even though in practice you would cap payouts or have utility/risk constraints.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["ev", "paradox"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      min_words: 105,
      rubric: [
        "Correctly identifies payout $2^{k-1}$ with probability $(1/2)^k$ for first tails on flip k: 45%",
        "Writes the expected value sum and simplifies each term to a constant (1/2): 35%",
        "Concludes the expected value diverges (infinite): 20%",
      ],
      reference_solution_md:
        "First tails at k: prob $(1/2)^k$, payout $2^{k-1}$. EV $=\\sum 2^{k-1}(1/2)^k=\\sum 1/2=\\infty$.\n",
    },
  },
  {
    slug: "logic-odd-one-out-ternary-encoding-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "Ternary Encoding Intuition (Why Balance Scales Are Powerful)",
    prompt_md:
      "In 3–7 sentences, explain why balance-scale puzzles often involve powers of 3 (e.g., $3^k$ cases for $k$ weighings).\n\nYou can frame it as an information argument.",
    solution_md:
      "A balance scale has three outcomes per weighing: left heavy, right heavy, or balanced. With $k$ weighings, you can observe one of $3^k$ outcome sequences. If each hypothesis leads to a unique outcome sequence (a carefully designed weighing plan), then you can distinguish up to $3^k$ cases.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["information", "logic"],
    source: "Interview staple",
    target_roles: ["All"],
    answer_meta: {
      min_words: 75,
      rubric: [
        "States there are 3 outcomes per weighing and thus $3^k$ sequences in k weighings: 70%",
        "Connects outcome sequences to distinguishable hypotheses (encoding idea): 30%",
      ],
      reference_solution_md:
        "Balance has 3 outcomes; k weighings yield $3^k$ patterns; design plan so each hypothesis maps to unique pattern → distinguish up to $3^k$ cases.\n",
    },
  },
  {
    slug: "mislabeled-boxes-one-draw-freeform",
    topic: "Brainteasers",
    track: "researcher",
    title: "Mislabeled Boxes (Apples/Oranges/Mixed)",
    prompt_md:
      "You have three boxes labeled:\n\n- \"Apples\"\n- \"Oranges\"\n- \"Mixed\"\n\nEach label is wrong. Each box contains either all apples, all oranges, or a mix.\n\nYou may draw **one fruit** from **one box** (without looking inside otherwise). How can you determine the correct contents of all boxes?\n\nAnswer in 5–10 sentences.",
    solution_md:
      "Draw from the box labeled \"Mixed\". Since all labels are wrong, this box cannot be mixed; it must be all apples or all oranges. If you draw an apple, that box is all apples; if you draw an orange, it is all oranges. Then the box labeled with the opposite fruit cannot be that fruit (label wrong) and also cannot be mixed if the mixed box is already determined, so you can deduce the remaining two boxes by elimination: the box labeled with the fruit you just drew must be mixed, and the last box is the remaining pure fruit.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["logic", "deduction"],
    source: "Classic",
    target_roles: ["All"],
    answer_meta: {
      min_words: 115,
      rubric: [
        "Chooses the 'Mixed' labeled box for the draw and explains why it must be a pure box: 50%",
        "Uses the drawn fruit to determine that box's true content (all apples or all oranges): 20%",
        "Correctly deduces the other two boxes by elimination with the 'all labels wrong' constraint: 30%",
      ],
      reference_solution_md:
        "Draw from 'Mixed' (can't be mixed). If apple → it's all apples; then 'Oranges' can't be oranges and can't be all apples → must be mixed; remaining box is all oranges (and similarly if orange drawn).\n",
    },
  },
  {
    slug: "probability-at-least-one-six-4-rolls-mcq",
    topic: "Brainteasers",
    track: "researcher",
    title: "At Least One 6 in 4 Rolls",
    prompt_md:
      "You roll a fair six-sided die 4 times. What is the probability of getting at least one 6?",
    solution_md:
      "Use complement: $1-P(\\text{no 6}) = 1-(5/6)^4$.",
    answer_kind: "mcq",
    answer_value: "1-(5/6)^4",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["probability", "complement"],
    source: "Core",
    target_roles: ["All"],
    answer_meta: {
      options: [
        { id: "1-(5/6)^4", label: "$1-(5/6)^4$", correct: true },
        { id: "(1/6)^4", label: "$(1/6)^4$", correct: false },
        { id: "4/6", label: "$4/6$", correct: false },
        { id: "1-(1/6)^4", label: "$1-(1/6)^4$", correct: false },
      ],
    },
  },
];
