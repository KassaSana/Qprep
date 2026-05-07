/**
 * Topic-keyed seed bundle.
 *
 * Per the v2 plan, content lives in one file per topic so authors can find
 * their bank quickly. This index re-exports a flat list for the seed script
 * and the local-dev in-memory bank.
 *
 * To add a new topic, drop a `<topic>.ts` next to this file with a default
 * export of `SeedQuestion[]` and append it here. The schema check constraint
 * on `questions.topic` enumerates the allowed strings.
 */

import type { SeedQuestion } from "@/content/question-types";
import { PROBABILITY_SEED } from "./probability";
import { STATISTICS_SEED } from "./statistics";
import { FINANCE_SEED } from "./finance";
import { BRAINTEASERS_SEED } from "./brainteasers";
import { ALGORITHMS_SEED } from "./algorithms";
import { CONCURRENCY_SEED } from "./concurrency";
import { LLD_SEED } from "./lld";
import { SYSTEM_DESIGN_SEED } from "./system_design";
import { PURE_MATH_SEED } from "./pure_math";
import { DATA_STRUCTURES_SEED } from "./data_structures";

export const ALL_SEED_QUESTIONS: SeedQuestion[] = [
  ...PROBABILITY_SEED,
  ...STATISTICS_SEED,
  ...FINANCE_SEED,
  ...BRAINTEASERS_SEED,
  ...ALGORITHMS_SEED,
  ...CONCURRENCY_SEED,
  ...LLD_SEED,
  ...SYSTEM_DESIGN_SEED,
  ...PURE_MATH_SEED,
  ...DATA_STRUCTURES_SEED,
];

export {
  PROBABILITY_SEED,
  STATISTICS_SEED,
  FINANCE_SEED,
  BRAINTEASERS_SEED,
  ALGORITHMS_SEED,
  CONCURRENCY_SEED,
  LLD_SEED,
  SYSTEM_DESIGN_SEED,
  PURE_MATH_SEED,
  DATA_STRUCTURES_SEED,
};
