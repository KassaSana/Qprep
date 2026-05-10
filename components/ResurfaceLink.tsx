"use client";

import * as React from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

interface ResurfaceLinkProps {
  slug: string;
  daysSinceLastWrong: number;
  wrongAttemptCount: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Client wrapper around the resurface row's <Link>. Exists purely so the
 * server-rendered home page can fire `resurface_clicked` without needing to
 * become a client component itself.
 *
 * Why a real <Link> rather than a button + router.push: keeps cmd-click /
 * middle-click behavior intact, which matters for power users.
 */
export function ResurfaceLink({
  slug,
  daysSinceLastWrong,
  wrongAttemptCount,
  className,
  children,
}: ResurfaceLinkProps) {
  return (
    <Link
      href={`/questions/${slug}?from=resurface`}
      className={className}
      onClick={() => {
        track({
          name: "resurface_clicked",
          properties: { slug, daysSinceLastWrong, wrongAttemptCount },
        });
      }}
    >
      {children}
    </Link>
  );
}
