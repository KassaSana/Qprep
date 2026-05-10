/**
 * 60-second diagnostic (Phase 3 onboarding).
 *
 * Hand-picked, MCQ-only sequence so a brand-new visitor can finish in roughly
 * a minute. The pack intentionally probes:
 *
 * - Researcher signal: Probability, Statistics, Pure Math
 * - Dev signal:        Data Structures, C++ Deep Dives, Concurrency
 * - Warmup:            one classic Brainteaser, low-pressure entry
 *
 * The ratio (5 Researcher / 4 Dev / 1 mixed) lets `recommendPlaylist` route
 * a clearly-leaning user without overweighting either lane.
 *
 * MCQs only by design:
 * - Numeric / freeform / code questions break the "60-second" promise.
 * - Algorithms / Systems / LLD / System Design have no MCQs in the bank, so
 *   they're picked up indirectly via Dev signal — that's an accepted gap.
 *
 * To swap a slug, also update the test fixtures in `lib/diagnostic.test.ts`.
 */
export const DIAGNOSTIC_SLUGS: readonly string[] = [
  // 1. Brainteaser warmup — gentle entry, signals general puzzle aptitude.
  "monty-hall-switch-mcq",
  // 2–3. Probability core.
  "law-of-total-probability-mcq",
  "memoryless-property-exponential-mcq",
  // 4. Statistics core.
  "clt-distribution-mcq",
  // 5–6. Pure Math.
  "eigenvalues-psd-nonnegative-mcq",
  "svd-vs-eigendecomposition-mcq",
  // 7–8. Data Structures (Dev).
  "dynamic-array-amortized-mcq",
  "vector-iterator-invalidation-mcq",
  // 9. C++ depth (Dev).
  "cpp-virtual-destructor-why-mcq",
  // 10. Concurrency (Dev).
  "lock-free-progress-guarantees-mcq",
];

/**
 * Total number of questions in the diagnostic. Keep in sync with
 * `DIAGNOSTIC_SLUGS.length` — exported so callers don't have to reach
 * into the slug list just to render "Q 3 of 10".
 */
export const DIAGNOSTIC_LENGTH = DIAGNOSTIC_SLUGS.length;
