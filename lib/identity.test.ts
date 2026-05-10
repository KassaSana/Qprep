import { afterEach, describe, expect, it, vi } from "vitest";
import { getIdentityKey, isAuthEnabled, type Identity } from "./identity";

describe("isAuthEnabled", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("defaults to false when the flag is unset", () => {
    vi.stubEnv("NEXT_PUBLIC_AUTH_ENABLED", "");
    expect(isAuthEnabled()).toBe(false);
  });

  it('returns true only when the flag is exactly "true"', () => {
    vi.stubEnv("NEXT_PUBLIC_AUTH_ENABLED", "true");
    expect(isAuthEnabled()).toBe(true);
  });

  it('treats casing/typo variants as false (no surprise opt-in)', () => {
    vi.stubEnv("NEXT_PUBLIC_AUTH_ENABLED", "TRUE");
    expect(isAuthEnabled()).toBe(false);
    vi.stubEnv("NEXT_PUBLIC_AUTH_ENABLED", "1");
    expect(isAuthEnabled()).toBe(false);
    vi.stubEnv("NEXT_PUBLIC_AUTH_ENABLED", "yes");
    expect(isAuthEnabled()).toBe(false);
  });
});

describe("getIdentityKey", () => {
  it("prefers userId when both are set", () => {
    const id: Identity = {
      anonId: "anon-abc",
      userId: "user-xyz",
      isAuthed: true,
    };
    expect(getIdentityKey(id)).toBe("user-xyz");
  });

  it("falls back to anonId when userId is null", () => {
    const id: Identity = {
      anonId: "anon-abc",
      userId: null,
      isAuthed: false,
    };
    expect(getIdentityKey(id)).toBe("anon-abc");
  });

  it("returns null when neither id is present", () => {
    const id: Identity = { anonId: null, userId: null, isAuthed: false };
    expect(getIdentityKey(id)).toBeNull();
  });

  it("does not depend on the isAuthed flag — the key resolution is purely id-based", () => {
    // Pathological but possible: isAuthed wrong, userId still wins.
    const id: Identity = {
      anonId: "anon-abc",
      userId: "user-xyz",
      isAuthed: false,
    };
    expect(getIdentityKey(id)).toBe("user-xyz");
  });
});
