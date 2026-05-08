import type { PlaylistDef } from "@/content/question-types";

/**
 * Curated playlists for the v2 question bank.
 *
 * Each playlist is a hand-ordered list of question slugs. The playlist page
 * resolves slugs to full Question rows and renders them in this order.
 *
 * A question can appear in multiple playlists. The `top-50` showcase
 * intentionally pulls from every topic so a brand-new visitor sees a
 * representative sample without first picking a track.
 */
export const PLAYLISTS: PlaylistDef[] = [
  {
    slug: "researcher-foundations",
    name: "Researcher Foundations",
    description:
      "The probability + statistics core every quant researcher interview leans on. Bayes, expectation, order statistics, random walks.",
    hero_emoji: "📐",
    question_slugs: [
      "two-dice-sum-seven",
      "geometric-first-head-third-flip",
      "expected-rolls-until-six",
      "monty-hall-switch",
      "two-children-at-least-one-boy",
      "disease-test-bayes",
      "birthday-23",
      "ace-in-five-card-hand",
      "expected-flips-until-hh",
      "expected-flips-until-ht",
      "max-of-two-dice",
      "coupon-collector-four",
      "hat-check-fixed-points",
      "random-walk-return-step-2",
      "gamblers-ruin-fair",
      "stick-broken-triangle",
      "ev-uniform-zero-one-square",
      "ev-min-two-uniforms",
      "variance-binomial-100-half",
      "clt-distribution-mcq",
    ],
  },
  {
    slug: "quant-dev-essentials",
    name: "Quant Dev Essentials",
    description:
      "Algorithms, data structures, concurrency reasoning, and low-level design — the SWE side of the trading-firm interview loop.",
    hero_emoji: "⚙️",
    question_slugs: [
      "two-sum",
      "valid-parens",
      "lru-cache-ops",
      "dynamic-array-amortized-mcq",
      "vector-iterator-invalidation-mcq",
      "producer-consumer-bounded-buffer",
      "dining-philosophers-explain",
      "double-checked-locking-broken",
      "volatile-not-thread-sync",
      "relaxed-ready-data-bug",
      "false-sharing-explain",
      "aba-problem-explain",
      "lld-parking-lot",
      "lld-url-shortener",
      "lld-pubsub",
      "md-pipeline-multicast-to-strategy",
      "pretrade-risk-check-sub10us",
      "sliding-window-maximum",
      "subarray-sum-equals-k",
      "rolling-vwap",
    ],
  },
  {
    slug: "quant-dev-core",
    name: "Quant Dev Core",
    description:
      "A deeper quant-dev set: C++ gotchas, atomics, low-latency performance, and practical coding primitives (windowed stats, queues, caches).",
    hero_emoji: "🧵",
    question_slugs: [
      "vector-iterator-invalidation-mcq",
      "unordered-map-rehash-latency-freeform",
      "volatile-not-thread-sync",
      "relaxed-ready-data-bug",
      "false-sharing-explain",
      "aba-problem-explain",
      "producer-consumer-bounded-buffer",
      "dining-philosophers-explain",
      "double-checked-locking-broken",
      "md-pipeline-multicast-to-strategy",
      "pretrade-risk-check-sub10us",
      "two-sum",
      "valid-parens",
      "lru-cache-ops",
      "sliding-window-maximum",
      "subarray-sum-equals-k",
      "rolling-vwap",
    ],
  },
  {
    slug: "top-50",
    name: "Top 50",
    description:
      "A mixed showcase across every topic. Use this if you don't know where to start.",
    hero_emoji: "⭐",
    question_slugs: [
      "monty-hall-switch",
      "two-children-at-least-one-boy",
      "disease-test-bayes",
      "expected-flips-until-hh",
      "max-of-two-dice",
      "coupon-collector-four",
      "birthday-23",
      "stick-broken-triangle",
      "gamblers-ruin-fair",
      "secretary-named-theorem",
      "variance-binomial-100-half",
      "ev-min-two-uniforms",
      "clt-distribution-mcq",
      "prob-up-after-two-signals",
      "two-sum",
      "valid-parens",
      "lru-cache-ops",
      "producer-consumer-bounded-buffer",
      "double-checked-locking-broken",
      "lld-parking-lot",
      "lld-pubsub",
      "dynamic-array-amortized-mcq",
    ],
  },
];
