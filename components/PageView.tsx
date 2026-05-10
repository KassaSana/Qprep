"use client";

import * as React from "react";
import { track } from "@/lib/analytics";

/**
 * Tiny client wrapper that fires a `page_viewed` event exactly once per
 * mount. Drop into a server component to instrument a route without
 * converting the whole page to a client component.
 *
 * Renders nothing.
 *
 * Usage:
 *   <PageView path="/today" />
 *   <PageView path="/diagnostic" />
 */
export function PageView({ path }: { path: string }) {
  // Strict-mode double-invokes effects in dev; the ref guard keeps us at
  // exactly one event per mount lifetime.
  const fired = React.useRef(false);
  React.useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track({ name: "page_viewed", properties: { path } });
  }, [path]);
  return null;
}
