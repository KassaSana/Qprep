import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "QPrep — Quant Interview Practice",
    template: "%s · QPrep",
  },
  description:
    "An agent-first quant interview prep platform. Probability, stochastic, and brainteasers with a Claude-powered Nudge Engine.",
  applicationName: "QPrep",
  authors: [{ name: "QPrep" }],
  openGraph: {
    title: "QPrep — Quant Interview Practice",
    description:
      "Practice quant problems with an agentic tutor. Three escalating hints, never the answer.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f6f2",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-dvh flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
