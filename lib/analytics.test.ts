import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getProvider, track } from "./analytics";

describe("getProvider", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses the console provider in development by default", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_PROVIDER", "");
    expect(getProvider().name).toBe("console");
  });

  it("uses the noop provider in production by default", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_PROVIDER", "");
    expect(getProvider().name).toBe("noop");
  });

  it("respects an explicit `console` override even in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_PROVIDER", "console");
    expect(getProvider().name).toBe("console");
  });

  it("respects an explicit `noop` override even in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_PROVIDER", "noop");
    expect(getProvider().name).toBe("noop");
  });

  it("falls through to the env default for unknown overrides (no crash)", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_PROVIDER", "posthog");
    expect(getProvider().name).toBe("noop");
  });

  it("treats override casing leniently", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_PROVIDER", "CONSOLE");
    expect(getProvider().name).toBe("console");
  });
});

describe("track", () => {
  let infoSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    infoSpy = vi.spyOn(console, "info").mockImplementation(() => undefined);
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    infoSpy.mockRestore();
    warnSpy.mockRestore();
    vi.unstubAllEnvs();
  });

  it("forwards typed events to the active provider", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_PROVIDER", "console");
    track({
      name: "diagnostic_started",
      properties: { totalQuestions: 10 },
    });
    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(infoSpy.mock.calls[0]?.[0]).toContain("diagnostic_started");
  });

  it("never throws on an unknown env even when provider explodes", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_PROVIDER", "console");
    // Force the underlying console.info to throw — track() should swallow it.
    infoSpy.mockImplementation(() => {
      throw new Error("transport down");
    });
    expect(() =>
      track({ name: "page_viewed", properties: { path: "/" } })
    ).not.toThrow();
    // And we should warn (in dev) so the failure isn't completely silent.
    expect(warnSpy).toHaveBeenCalledOnce();
  });

  it("emits nothing visibly when the provider is noop", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_PROVIDER", "noop");
    track({ name: "page_viewed", properties: { path: "/today" } });
    expect(infoSpy).not.toHaveBeenCalled();
  });

  it("accepts the attempt_submitted event with the full property shape", () => {
    // This test exists primarily to lock the schema: if the event union
    // ever drops a field the API route depends on, this stops compiling.
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_PROVIDER", "console");
    track({
      name: "attempt_submitted",
      properties: {
        slug: "monty-hall-switch-mcq",
        topic: "Brainteasers",
        kind: "mcq",
        difficulty: 2,
        correct: true,
        hintLevelsUsed: 0,
        from: "playlist:warmup-quickstart",
      },
    });
    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(infoSpy.mock.calls[0]?.[0]).toContain("attempt_submitted");
  });

  it("accepts attempt_submitted without a `from` (organic navigation)", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_PROVIDER", "console");
    track({
      name: "attempt_submitted",
      properties: {
        slug: "clt-distribution-mcq",
        topic: "Statistics",
        kind: "mcq",
        difficulty: 3,
        correct: false,
        hintLevelsUsed: 1,
      },
    });
    expect(infoSpy).toHaveBeenCalledTimes(1);
  });

  it("accepts the nudge_requested event across all four sources", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_PROVIDER", "console");
    const sources = ["cached", "provider", "rate_limited", "error"] as const;
    for (const source of sources) {
      track({
        name: "nudge_requested",
        properties: { questionId: "abc-123", level: 2, source },
      });
    }
    expect(infoSpy).toHaveBeenCalledTimes(sources.length);
  });

  it("accepts mental_math_session_completed for timer and stop reasons", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_PROVIDER", "console");
    track({
      name: "mental_math_session_completed",
      properties: {
        reason: "timer",
        durationSec: 60,
        difficulty: 2,
        includePercentages: true,
        includeBps: false,
        elapsedSeconds: 60,
        attempted: 12,
        correct: 9,
        accuracy: 0.75,
        streakAtEnd: 3,
      },
    });
    track({
      name: "mental_math_session_completed",
      properties: {
        reason: "stop",
        durationSec: 120,
        difficulty: 3,
        includePercentages: false,
        includeBps: true,
        elapsedSeconds: 45,
        attempted: 0,
        correct: 0,
        accuracy: 0,
        streakAtEnd: 0,
      },
    });
    expect(infoSpy).toHaveBeenCalledTimes(2);
  });
});
