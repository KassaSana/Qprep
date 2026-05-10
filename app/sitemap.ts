import type { MetadataRoute } from "next";
import { loadAllQuestions, loadPlaylists } from "@/lib/questions-data";

/**
 * Dynamic sitemap.
 *
 * Includes every static route plus one entry per playlist and per question.
 * For 633 questions + 6 playlists + ~6 static routes that's ~645 URLs, well
 * inside Google's 50k-URL-per-sitemap cap. If the bank ever crosses ~10k we
 * should split this into a sitemap index (Next.js supports that with
 * `generateSitemaps`).
 *
 * `lastModified` is intentionally `new Date()` for everything for now —
 * neither the questions table nor the playlists table tracks an
 * `updated_at` we can surface here. Search engines treat that as "may have
 * changed; rescan", which is fine for a small bank.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Anon-less reads are safe — sitemap should be cacheable across visitors
  // and these loaders accept null.
  const [{ questions }, playlists] = await Promise.all([
    loadAllQuestions(null),
    loadPlaylists(),
  ]);

  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = [
    { url: "/", lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: "/today", lastModified: now, changeFrequency: "daily", priority: 0.9 },
    {
      url: "/diagnostic",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "/playlists",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "/questions",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "/mental-math",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const playlistEntries: MetadataRoute.Sitemap = playlists.map((p) => ({
    url: `/playlists/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const questionEntries: MetadataRoute.Sitemap = questions.map((q) => ({
    url: `/questions/${q.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...playlistEntries, ...questionEntries];
}
