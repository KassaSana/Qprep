"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface NextQuestionCTAProps {
  href: string | null | undefined;
  label: string | null | undefined;
  className?: string;
}

/**
 * Auto-advance CTA shown after a correct submission.
 *
 * Auto-focuses on mount so a quick `Enter` press carries the user forward
 * without a mouse round-trip — that's the whole point of the feature. We
 * still render as a Link (not a button) so middle-click / cmd-click for
 * "open in new tab" works for users who want to preview the next question.
 */
export function NextQuestionCTA({
  href,
  label,
  className,
}: NextQuestionCTAProps) {
  const router = useRouter();
  const ref = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    if (href) ref.current?.focus();
  }, [href]);

  // Prefetch the destination so the click feels instant.
  React.useEffect(() => {
    if (href) router.prefetch(href);
  }, [href, router]);

  if (!href) return null;

  return (
    <Link
      ref={ref}
      href={href}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-bg transition-colors duration-100 ease-out hover:bg-accent-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        className
      )}
    >
      {label ?? "Next question"} →
    </Link>
  );
}
