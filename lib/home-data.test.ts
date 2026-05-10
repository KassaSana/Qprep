import { describe, expect, it } from "vitest";
import {
  pickNextUnsolved,
  topicMasteryBars,
  MAX_DISPLAY_LEVEL,
  type HomePlaylist,
} from "./home-data";
import type { LoadedQuestion } from "./questions-data";
import { PLAYLISTS } from "@/content/playlists";

function makeQ(slug: string, id: string): LoadedQuestion {
  return {
    id,
    slug,
    topic: "Probability",
    title: `Q ${slug}`,
    prompt_md: "",
    solution_md: null,
    answer_kind: "numeric",
    answer_value: null,
    answer_tolerance: null,
    answer_meta: null,
    target_roles: ["All"],
    difficulty: 1,
    tags: [],
    companies: [],
    source: null,
    is_premium: false,
  };
}

function buildBySlug(slugs: string[]): Map<string, LoadedQuestion> {
  return new Map(slugs.map((s, i) => [s, makeQ(s, `id-${i}`)]));
}

function homePlaylist(
  slug: string,
  name: string,
  total: number,
  solved: number
): HomePlaylist {
  return {
    slug,
    name,
    description: "",
    heroEmoji: "·",
    total,
    solved,
  };
}

describe("pickNextUnsolved", () => {
  it("returns null when every playlist is fully solved", () => {
    const playlists: HomePlaylist[] = PLAYLISTS.map((p) =>
      homePlaylist(p.slug, p.name, p.question_slugs.length, p.question_slugs.length)
    );
    const allSlugs = PLAYLISTS.flatMap((p) => p.question_slugs);
    const bySlug = buildBySlug(allSlugs);
    const solved = new Set(Array.from(bySlug.values()).map((q) => q.id));

    expect(pickNextUnsolved(playlists, bySlug, solved)).toBeNull();
  });

  it("picks the most-advanced incomplete playlist's first unsolved", () => {
    // researcher-foundations: 2/20 solved (10%); quant-dev-essentials: 5/20 (25%).
    // The function should pick from quant-dev-essentials.
    const rf = PLAYLISTS[0];
    const qd = PLAYLISTS[1];
    const playlists: HomePlaylist[] = [
      homePlaylist(rf.slug, rf.name, rf.question_slugs.length, 2),
      homePlaylist(qd.slug, qd.name, qd.question_slugs.length, 5),
    ];
    const bySlug = buildBySlug([...rf.question_slugs, ...qd.question_slugs]);
    const solved = new Set<string>();
    rf.question_slugs.slice(0, 2).forEach((s) => solved.add(bySlug.get(s)!.id));
    qd.question_slugs.slice(0, 5).forEach((s) => solved.add(bySlug.get(s)!.id));

    const next = pickNextUnsolved(playlists, bySlug, solved);
    expect(next).not.toBeNull();
    expect(next!.playlistSlug).toBe(qd.slug);
    expect(next!.questionSlug).toBe(qd.question_slugs[5]);
  });

  it("breaks ties by playlist order (earlier wins)", () => {
    const rf = PLAYLISTS[0];
    const qd = PLAYLISTS[1];
    const playlists: HomePlaylist[] = [
      homePlaylist(rf.slug, rf.name, 4, 1), // 25%
      homePlaylist(qd.slug, qd.name, 4, 1), // 25%, same fraction
    ];
    const bySlug = buildBySlug([...rf.question_slugs, ...qd.question_slugs]);
    const solved = new Set<string>();
    solved.add(bySlug.get(rf.question_slugs[0])!.id);
    solved.add(bySlug.get(qd.question_slugs[0])!.id);

    const next = pickNextUnsolved(playlists, bySlug, solved);
    expect(next!.playlistSlug).toBe(rf.slug);
  });

  it("skips slugs missing from the question map and falls through to the next slug", () => {
    const rf = PLAYLISTS[0];
    const playlists: HomePlaylist[] = [
      homePlaylist(rf.slug, rf.name, rf.question_slugs.length, 0),
    ];
    // Drop the first slug from the bySlug map — function should skip and
    // return the second one.
    const bySlug = buildBySlug(rf.question_slugs.slice(1));

    const next = pickNextUnsolved(playlists, bySlug, new Set());
    expect(next!.questionSlug).toBe(rf.question_slugs[1]);
  });

  it("returns null when the only incomplete playlist has zero questions", () => {
    const playlists: HomePlaylist[] = [
      homePlaylist("empty", "Empty", 0, 0),
    ];
    expect(pickNextUnsolved(playlists, new Map(), new Set())).toBeNull();
  });
});

describe("topicMasteryBars", () => {
  it("returns empty for undefined / empty input", () => {
    expect(topicMasteryBars(undefined)).toEqual([]);
    expect(topicMasteryBars({})).toEqual([]);
  });

  it("drops zero / negative levels, sorts by level desc", () => {
    const bars = topicMasteryBars({
      Probability: 3,
      Statistics: 7,
      Algorithms: 0,
      Concurrency: 1,
    });
    expect(bars.map((b) => b.topic)).toEqual([
      "Statistics",
      "Probability",
      "Concurrency",
    ]);
  });

  it("normalizes fraction against MAX_DISPLAY_LEVEL and clamps", () => {
    const bars = topicMasteryBars({
      Probability: MAX_DISPLAY_LEVEL,
      Statistics: MAX_DISPLAY_LEVEL * 3, // way past cap
      Concurrency: 2,
    });
    const byTopic = Object.fromEntries(bars.map((b) => [b.topic, b]));
    expect(byTopic.Probability.fraction).toBe(1);
    expect(byTopic.Statistics.fraction).toBe(1);
    expect(byTopic.Concurrency.fraction).toBeCloseTo(2 / MAX_DISPLAY_LEVEL);
  });

  it("respects the limit argument", () => {
    const bars = topicMasteryBars(
      { Probability: 3, Statistics: 7, Concurrency: 5 },
      2
    );
    expect(bars).toHaveLength(2);
    expect(bars[0].topic).toBe("Statistics");
    expect(bars[1].topic).toBe("Concurrency");
  });
});
