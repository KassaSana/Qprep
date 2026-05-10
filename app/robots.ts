import type { MetadataRoute } from "next";

/**
 * Allow all crawlers, with the API and middleware-internal paths blocked.
 *
 * - `/api/*` is server-only — no public content for indexers to extract
 *   and crawling it just wastes their budget on POST endpoints they can't
 *   meaningfully render.
 * - We deliberately allow `/diagnostic` and the dynamic playlist/question
 *   routes; their metadata is stable enough to be useful in search.
 *
 * `host` and `sitemap` URLs resolve against `metadataBase` (set in the root
 * layout from `NEXT_PUBLIC_APP_URL` / `VERCEL_URL` / localhost).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "/sitemap.xml",
  };
}
