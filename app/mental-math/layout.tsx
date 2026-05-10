import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Mental math",
  description:
    "Zetamac-style timed mental math drills — percentages, basis points, and decimals. Client-side only (no question bank rows).",
  openGraph: {
    title: "Mental math · QPrep",
    description:
      "Timed drills for quant warm-ups. No account required.",
  },
};

export default function MentalMathLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
