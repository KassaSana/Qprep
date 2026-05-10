/**
 * Provider-agnostic analytics layer.
 *
 * The owner has not yet picked a provider (PostHog / Vercel Analytics /
 * Plausible / etc.). Until they do, this module ships as:
 *
 *   - dev:  console-logger (so you can verify events fire while building)
 *   - prod: no-op           (so prod stays free of accidental telemetry)
 *
 * When the owner picks a provider, only `getProvider()` and one new
 * `lib/analytics-providers/<name>.ts` need to change. Every callsite stays
 * the same, because callers only ever touch the typed `track()` API.
 *
 * Provider override (for staging / canary):
 *   NEXT_PUBLIC_ANALYTICS_PROVIDER=console   force the dev logger
 *   NEXT_PUBLIC_ANALYTICS_PROVIDER=noop      force the no-op
 *
 * Why typed events instead of `track(name: string, props: object)`:
 *   - The compiler catches typos in event names, which prevents the
 *     classic "we tracked `diagnostic_complete` AND `diagnostic_completed`
 *     for two months and merged them in a dashboard query later" bug.
 *   - Each event has a documented `properties` shape, so the analytics
 *     dashboard schema is the same as the source of truth in code.
 *   - Adding a new event is a single `interface` addition + one branch.
 */

import type { Topic } from "@/content/question-types";

// ---------------------------------------------------------------------------
// Event catalogue. Add new events here, not in callsites.
// ---------------------------------------------------------------------------

export type AnalyticsEvent =
  | { name: "page_viewed"; properties: { path: string } }
  | { name: "diagnostic_started"; properties: { totalQuestions: number } }
  | {
      name: "diagnostic_question_answered";
      properties: {
        slug: string;
        topic: Topic;
        index: number; // 0-based question index in the runner
        correct: boolean;
      };
    }
  | {
      name: "diagnostic_completed";
      properties: {
        answered: number;
        right: number;
        researcherFraction: number;
        devFraction: number;
        recommendedPlaylist: string;
      };
    }
  | {
      name: "diagnostic_cta_clicked";
      properties: {
        cta: "open_playlist" | "todays_pair" | "restart";
        recommendedPlaylist: string;
      };
    }
  | {
      name: "today_pair_status";
      properties: {
        researcherSolved: boolean;
        devSolved: boolean;
        cleared: boolean;
      };
    }
  | {
      name: "resurface_clicked";
      properties: {
        slug: string;
        daysSinceLastWrong: number;
        wrongAttemptCount: number;
      };
    }
  | {
      name: "attempt_submitted";
      properties: {
        slug: string;
        topic: Topic;
        kind: "numeric" | "fraction" | "exact" | "mcq" | "freeform" | "code";
        difficulty: number;
        correct: boolean;
        hintLevelsUsed: number;
        /**
         * Where the user came from. `playlist:<slug>` is set by the auto-advance
         * link, `resurface` by the home-page resurface row, `diagnostic` by the
         * recommendation CTA. Undefined = organic / direct navigation.
         *
         * This is the single most important field for activation funnels — it
         * answers "did the diagnostic recommendation actually drive a real
         * attempt?" which is the metric Phase 3 hinges on.
         */
        from?: string;
      };
    }
  | {
      name: "nudge_requested";
      properties: {
        /** Question id, not slug — the API only carries the attempt's question id. */
        questionId: string;
        /** Hint level the user requested (1 = nudge, 2 = stronger, 3 = solution-shape). */
        level: 1 | 2 | 3;
        /**
         * Where the hint was served from. `cached` means we hit the
         * hints_cache table and didn't pay any AI cost; `provider` means we
         * called the model. `rate_limited` and `error` are emitted on the
         * unhappy paths so the dashboard can compute hit-rate + failure-rate.
         */
        source: "cached" | "provider" | "rate_limited" | "error";
      };
    }
  | {
      name: "mental_math_session_completed";
      properties: {
        /** Clock ran out vs user hit Stop. */
        reason: "timer" | "stop";
        /** Configured session length (seconds). */
        durationSec: number;
        /** 1 = easy, 2 = medium, 3 = hard. */
        difficulty: 1 | 2 | 3;
        includePercentages: boolean;
        includeBps: boolean;
        /** Seconds elapsed ≈ `durationSec - timeLeftAtFinish`. */
        elapsedSeconds: number;
        attempted: number;
        correct: number;
        /** 0..1; 0 when `attempted === 0`. */
        accuracy: number;
        /** Current streak when the session ended (resets on wrong / invalid). */
        streakAtEnd: number;
      };
    };

// ---------------------------------------------------------------------------
// Provider abstraction.
// ---------------------------------------------------------------------------

export interface AnalyticsProvider {
  name: string;
  send(event: AnalyticsEvent): void;
}

const consoleProvider: AnalyticsProvider = {
  name: "console",
  send(event) {
    if (typeof console === "undefined") return;
    // Use info so it's visually distinct from errors/warnings during dev.
    console.info(`[analytics:${event.name}]`, event.properties);
  },
};

const noopProvider: AnalyticsProvider = {
  name: "noop",
  send() {
    // intentional
  },
};

/**
 * Picks the active provider. Override-aware.
 *
 * Order of resolution:
 *   1. `NEXT_PUBLIC_ANALYTICS_PROVIDER` env value (one of `console` / `noop`)
 *   2. Default by NODE_ENV: `console` in dev/test, `noop` in prod
 *
 * Anything unrecognized falls through to the env-based default rather than
 * crashing — analytics should never break the app.
 */
export function getProvider(): AnalyticsProvider {
  const override = (
    process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? ""
  ).toLowerCase();
  if (override === "console") return consoleProvider;
  if (override === "noop") return noopProvider;
  return process.env.NODE_ENV === "production" ? noopProvider : consoleProvider;
}

// ---------------------------------------------------------------------------
// Public API.
// ---------------------------------------------------------------------------

/**
 * Fire an analytics event. Always safe to call — provider failures are
 * swallowed (analytics must never break the user-facing experience).
 *
 * Designed to be called from both client and server components. On the
 * server today the only provider available is the console logger; once a
 * real provider is wired (slice 2 of analytics) it will gain a server
 * surface too.
 */
export function track(event: AnalyticsEvent): void {
  try {
    getProvider().send(event);
  } catch (err) {
    if (process.env.NODE_ENV !== "production" && typeof console !== "undefined") {
      console.warn("[analytics] provider threw", err);
    }
  }
}
