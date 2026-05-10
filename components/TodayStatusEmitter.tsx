"use client";

import * as React from "react";
import { track } from "@/lib/analytics";

interface TodayStatusEmitterProps {
  researcherSolved: boolean;
  devSolved: boolean;
  cleared: boolean;
}

/**
 * Tiny client component that fires `today_pair_status` exactly once per
 * mount. Server component renders the page; this just emits the structured
 * status snapshot the analytics dashboard cares about.
 *
 * Renders nothing.
 */
export function TodayStatusEmitter({
  researcherSolved,
  devSolved,
  cleared,
}: TodayStatusEmitterProps) {
  const fired = React.useRef(false);
  React.useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track({
      name: "today_pair_status",
      properties: { researcherSolved, devSolved, cleared },
    });
  }, [researcherSolved, devSolved, cleared]);
  return null;
}
