import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

/**
 * Resolve the canonical site URL for absolute metadata (OG, Twitter, sitemap).
 * Order: explicit env → Vercel-provided → localhost. Wrapped in `URL` so
 * trailing slashes are normalized.
 */
function siteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) return new URL(explicit);
  if (process.env.VERCEL_URL) return new URL(`https://${process.env.VERCEL_URL}`);
  return new URL("http://localhost:3000");
}

const SITE_DESCRIPTION =
  "An agent-first quant interview prep platform. 633 questions across probability, statistics, pure math, brainteasers, algorithms, data structures, C++, concurrency, systems, LLD, and system design — with a multi-provider AI Nudge Engine that hints without spoiling.";

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: {
    default: "QPrep — Quant Interview Practice",
    template: "%s · QPrep",
  },
  description: SITE_DESCRIPTION,
  applicationName: "QPrep",
  authors: [{ name: "QPrep" }],
  keywords: [
    "quant interview",
    "quantitative finance interview",
    "probability questions",
    "statistics interview",
    "brainteasers",
    "system design",
    "C++ interview",
    "concurrency",
    "research engineer interview",
    "trader interview",
  ],
  openGraph: {
    title: "QPrep — Quant Interview Practice",
    description:
      "Practice quant problems with an agentic tutor. Three escalating hints, never the answer.",
    type: "website",
    siteName: "QPrep",
  },
  twitter: {
    card: "summary_large_image",
    title: "QPrep — Quant Interview Practice",
    description:
      "Daily quant + dev interview prep with AI nudges that hint without spoiling.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f2" },
    { media: "(prefers-color-scheme: dark)", color: "#101010" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          // Runs before React hydration to avoid theme flash.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'system';var d=(t==='dark')||(t==='system'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',!!d);}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <div className="flex min-h-dvh flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
