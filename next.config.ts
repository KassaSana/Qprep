import type { NextConfig } from "next";

/**
 * Permanent redirects from the deleted v1 track route trees to the
 * playlist that subsumed each. /researcher and /trader both used to be
 * landing pages; in v2 they're entries in the unified bank, accessible
 * via curated playlists.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/researcher",
        destination: "/playlists/researcher-foundations",
        permanent: true,
      },
      {
        source: "/researcher/q/:slug",
        destination: "/questions/:slug",
        permanent: true,
      },
      {
        source: "/trader",
        destination: "/playlists/top-50",
        permanent: true,
      },
      {
        source: "/trader/q/:slug",
        destination: "/questions/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
