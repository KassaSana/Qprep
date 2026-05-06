"use client";

import * as React from "react";
import { BlockMath, InlineMath } from "react-katex";
import { cn } from "@/lib/utils";

type Segment =
  | { type: "text"; value: string }
  | { type: "inline"; value: string }
  | { type: "block"; value: string };

/**
 * Tiny LaTeX-aware splitter.
 *
 * Recognizes:
 *   $$ ... $$   -> block math
 *   $  ... $    -> inline math
 *   \$          -> literal dollar sign (escaped)
 *
 * Anything else is rendered as plain text with line breaks preserved.
 */
function splitLatex(input: string): Segment[] {
  const segments: Segment[] = [];
  let buf = "";
  let i = 0;

  const flushText = () => {
    if (buf.length) {
      segments.push({ type: "text", value: buf });
      buf = "";
    }
  };

  while (i < input.length) {
    const ch = input[i];

    if (ch === "\\" && input[i + 1] === "$") {
      buf += "$";
      i += 2;
      continue;
    }

    if (ch === "$" && input[i + 1] === "$") {
      const end = input.indexOf("$$", i + 2);
      if (end === -1) {
        buf += "$$";
        i += 2;
        continue;
      }
      flushText();
      segments.push({ type: "block", value: input.slice(i + 2, end) });
      i = end + 2;
      continue;
    }

    if (ch === "$") {
      // Find matching, unescaped, non-$$ closer.
      let j = i + 1;
      while (j < input.length) {
        if (input[j] === "\\" && input[j + 1] === "$") {
          j += 2;
          continue;
        }
        if (input[j] === "$") break;
        j++;
      }
      if (j >= input.length) {
        buf += "$";
        i += 1;
        continue;
      }
      flushText();
      segments.push({ type: "inline", value: input.slice(i + 1, j).replace(/\\\$/g, "$") });
      i = j + 1;
      continue;
    }

    buf += ch;
    i++;
  }
  flushText();
  return segments;
}

export interface LatexProps {
  children: string;
  className?: string;
}

/**
 * Renders a string of mixed prose and LaTeX (KaTeX) into HTML.
 *
 * The string can be plain text containing $...$ inline math and $$...$$
 * block math. Newlines are preserved as soft breaks.
 */
export function Latex({ children, className }: LatexProps) {
  const segments = React.useMemo(() => splitLatex(children), [children]);
  return (
    <div className={cn("whitespace-pre-wrap leading-relaxed", className)}>
      {segments.map((s, idx) => {
        if (s.type === "block") {
          return (
            <span key={idx} className="block my-2">
              <BlockMath math={s.value} />
            </span>
          );
        }
        if (s.type === "inline") {
          return <InlineMath key={idx} math={s.value} />;
        }
        return <React.Fragment key={idx}>{s.value}</React.Fragment>;
      })}
    </div>
  );
}
