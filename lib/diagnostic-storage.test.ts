import { beforeEach, describe, expect, it } from "vitest";
import {
  STORAGE_KEY,
  clearDiagnosticState,
  loadDiagnosticState,
  resumeIndex,
  saveDiagnosticState,
} from "./diagnostic-storage";

const SLUGS = ["a", "b", "c", "d"] as const;

/**
 * Minimal in-memory `Storage` implementation. We use an object literal that
 * structurally satisfies the DOM `Storage` interface — vitest runs in node
 * by default (no jsdom), so the helper takes Storage via DI.
 */
function makeStorage(initial: Record<string, string> = {}): Storage {
  const map = new Map(Object.entries(initial));
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    key(i: number) {
      return Array.from(map.keys())[i] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    },
  } satisfies Storage;
}

/** A Storage that throws on every mutation — simulates quota-exceeded / private mode. */
function makeFailingStorage(): Storage {
  return {
    get length() {
      return 0;
    },
    clear() {
      throw new Error("nope");
    },
    getItem() {
      throw new Error("nope");
    },
    key() {
      return null;
    },
    removeItem() {
      throw new Error("nope");
    },
    setItem() {
      throw new Error("nope");
    },
  } satisfies Storage;
}

describe("loadDiagnosticState", () => {
  it("returns null when no storage adapter is available (SSR / private mode)", () => {
    expect(loadDiagnosticState(SLUGS, null)).toBeNull();
  });

  it("returns null on an empty store", () => {
    expect(loadDiagnosticState(SLUGS, makeStorage())).toBeNull();
  });

  it("returns null and never throws when the storage adapter throws", () => {
    expect(loadDiagnosticState(SLUGS, makeFailingStorage())).toBeNull();
  });

  it("round-trips a freshly saved state", () => {
    const s = makeStorage();
    saveDiagnosticState({ a: "A", b: "B" }, s, 1000);
    const out = loadDiagnosticState(SLUGS, s, 1000);
    expect(out).not.toBeNull();
    expect(out!.answers).toEqual({ a: "A", b: "B" });
    expect(out!.version).toBe(1);
    expect(out!.savedAt).toBe(1000);
  });

  it("discards malformed JSON and clears the entry", () => {
    const s = makeStorage({ [STORAGE_KEY]: "not-json{" });
    expect(loadDiagnosticState(SLUGS, s)).toBeNull();
    expect(s.getItem(STORAGE_KEY)).toBeNull();
  });

  it("discards a payload whose version doesn't match", () => {
    const s = makeStorage({
      [STORAGE_KEY]: JSON.stringify({
        version: 99,
        savedAt: Date.now(),
        answers: { a: "A" },
      }),
    });
    expect(loadDiagnosticState(SLUGS, s)).toBeNull();
    expect(s.getItem(STORAGE_KEY)).toBeNull();
  });

  it("discards a payload whose `answers` shape is wrong", () => {
    const s = makeStorage({
      [STORAGE_KEY]: JSON.stringify({
        version: 1,
        savedAt: Date.now(),
        answers: { a: 42 }, // not a string
      }),
    });
    expect(loadDiagnosticState(SLUGS, s)).toBeNull();
  });

  it("discards a payload older than the 24h TTL", () => {
    const s = makeStorage();
    saveDiagnosticState({ a: "A" }, s, 0);
    const dayLater = 24 * 60 * 60 * 1000 + 1;
    expect(loadDiagnosticState(SLUGS, s, dayLater)).toBeNull();
    expect(s.getItem(STORAGE_KEY)).toBeNull();
  });

  it("discards a payload that references a slug not in the current pack", () => {
    // Simulates content drift: someone changed DIAGNOSTIC_SLUGS between visits.
    const s = makeStorage();
    saveDiagnosticState({ a: "A", removed: "X" }, s);
    expect(loadDiagnosticState(SLUGS, s)).toBeNull();
    expect(s.getItem(STORAGE_KEY)).toBeNull();
  });
});

describe("saveDiagnosticState", () => {
  it("is a no-op when no storage adapter is available", () => {
    // Just shouldn't throw.
    expect(() => saveDiagnosticState({ a: "A" }, null)).not.toThrow();
  });

  it("swallows storage errors (quota exceeded, private mode)", () => {
    expect(() => saveDiagnosticState({ a: "A" }, makeFailingStorage())).not.toThrow();
  });

  it("persists answers under the canonical key", () => {
    const s = makeStorage();
    saveDiagnosticState({ a: "A" }, s);
    const raw = s.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.answers).toEqual({ a: "A" });
  });
});

describe("clearDiagnosticState", () => {
  let s: Storage;
  beforeEach(() => {
    s = makeStorage();
    saveDiagnosticState({ a: "A" }, s);
  });

  it("removes the stored payload", () => {
    expect(s.getItem(STORAGE_KEY)).not.toBeNull();
    clearDiagnosticState(s);
    expect(s.getItem(STORAGE_KEY)).toBeNull();
  });

  it("is safe to call when storage is unavailable", () => {
    expect(() => clearDiagnosticState(null)).not.toThrow();
  });

  it("does not throw when the underlying storage throws", () => {
    expect(() => clearDiagnosticState(makeFailingStorage())).not.toThrow();
  });
});

describe("resumeIndex", () => {
  it("returns 0 on an empty answer map (fresh start)", () => {
    expect(resumeIndex({}, SLUGS)).toBe(0);
  });

  it("returns the first unanswered index", () => {
    expect(resumeIndex({ a: "A", b: "B" }, SLUGS)).toBe(2);
  });

  it("returns the slug-list length when every slug is answered (route to result)", () => {
    expect(
      resumeIndex({ a: "A", b: "B", c: "C", d: "D" }, SLUGS)
    ).toBe(SLUGS.length);
  });

  it("walks the slug list in order, ignoring out-of-pack keys", () => {
    // `extra` was already filtered upstream by loadDiagnosticState; this just
    // documents that the picker is order-driven, not key-driven.
    expect(resumeIndex({ a: "A", c: "C" }, SLUGS)).toBe(1);
  });
});
