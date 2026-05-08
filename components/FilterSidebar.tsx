"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { TARGET_ROLES, TOPICS, type Topic } from "@/content/question-types";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { id: "all", label: "All" },
  { id: "unattempted", label: "Unattempted" },
  { id: "attempted", label: "Attempted" },
  { id: "correct", label: "Correct" },
] as const;

const DIFFICULTY_OPTIONS = [
  { id: "1", label: "Easy" },
  { id: "2", label: "Easy+" },
  { id: "3", label: "Medium" },
  { id: "4", label: "Hard" },
  { id: "5", label: "Brutal" },
] as const;

const KIND_OPTIONS = [
  { id: "numeric", label: "Numeric" },
  { id: "fraction", label: "Fraction" },
  { id: "exact", label: "Exact" },
  { id: "mcq", label: "MCQ" },
  { id: "freeform", label: "Freeform" },
  { id: "code", label: "Code" },
] as const;

export interface FilterSidebarProps {
  /** Distinct company strings drawn from the current question bank. */
  companies: string[];
}

/**
 * URL-driven filter rail. Every checkbox toggle writes a new search-param
 * URL via `router.replace`; the parent server component re-renders the
 * filtered table on the next request. No local React state outside the
 * derived view of `useSearchParams`.
 *
 * Filter contract on /questions:
 *   ?topic=Probability
 *   &difficulty=1&difficulty=3
 *   &kind=mcq&kind=code
 *   &company=Citadel
 *   &role=Dev&role=Researcher
 *   &status=unattempted   (single-valued)
 *   &playlist=top-50   (single-valued)
 */
export function FilterSidebar({ companies }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selected = React.useMemo(
    () => ({
      topic: new Set(searchParams.getAll("topic")),
      difficulty: new Set(searchParams.getAll("difficulty")),
      kind: new Set(searchParams.getAll("kind")),
      company: new Set(searchParams.getAll("company")),
      role: new Set(searchParams.getAll("role")),
      status: searchParams.get("status") ?? "all",
    }),
    [searchParams]
  );

  function setMulti(key: string, values: Iterable<string>) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    for (const v of values) params.append(key, v);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function setSingle(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    if (value && value !== "all") params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function toggle(
    key: "topic" | "difficulty" | "kind" | "company" | "role",
    value: string
  ) {
    const cur = new Set(selected[key]);
    if (cur.has(value)) cur.delete(value);
    else cur.add(value);
    setMulti(key, cur);
  }

  function clearAll() {
    router.replace(pathname, { scroll: false });
  }

  const anySelected =
    selected.topic.size +
      selected.difficulty.size +
      selected.kind.size +
      selected.company.size >
      0 ||
    selected.role.size > 0 ||
    (selected.status !== "all" && selected.status !== "") ||
    !!searchParams.get("playlist");

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium uppercase tracking-wider text-fg-muted">
          Filters
        </div>
        {anySelected && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-fg-muted hover:text-fg underline-offset-2 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterGroup label="Status">
        {STATUS_OPTIONS.map((s) => {
          const isActive = selected.status === s.id || (s.id === "all" && !searchParams.get("status"));
          return (
            <RadioPill
              key={s.id}
              active={isActive}
              onClick={() => setSingle("status", s.id === "all" ? null : s.id)}
            >
              {s.label}
            </RadioPill>
          );
        })}
      </FilterGroup>

      <FilterGroup label="Topic">
        {TOPICS.map((t) => (
          <CheckPill
            key={t}
            active={selected.topic.has(t)}
            onClick={() => toggle("topic", t)}
          >
            {t as Topic}
          </CheckPill>
        ))}
      </FilterGroup>

      <FilterGroup label="Role">
        {TARGET_ROLES.map((r) => (
          <CheckPill
            key={r}
            active={selected.role.has(r)}
            onClick={() => toggle("role", r)}
          >
            {r}
          </CheckPill>
        ))}
      </FilterGroup>

      <FilterGroup label="Difficulty">
        {DIFFICULTY_OPTIONS.map((d) => (
          <CheckPill
            key={d.id}
            active={selected.difficulty.has(d.id)}
            onClick={() => toggle("difficulty", d.id)}
          >
            {d.label}
          </CheckPill>
        ))}
      </FilterGroup>

      <FilterGroup label="Type">
        {KIND_OPTIONS.map((k) => (
          <CheckPill
            key={k.id}
            active={selected.kind.has(k.id)}
            onClick={() => toggle("kind", k.id)}
          >
            {k.label}
          </CheckPill>
        ))}
      </FilterGroup>

      {companies.length > 0 && (
        <FilterGroup label="Companies">
          {companies.map((c) => (
            <CheckPill
              key={c}
              active={selected.company.has(c)}
              onClick={() => toggle("company", c)}
            >
              {c}
            </CheckPill>
          ))}
        </FilterGroup>
      )}
    </aside>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-fg-subtle">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function CheckPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-0.5 text-xs font-medium transition",
        active
          ? "border-accent bg-accent text-white"
          : "border-border bg-bg-subtle text-fg-muted hover:text-fg"
      )}
    >
      {children}
    </button>
  );
}

function RadioPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-0.5 text-xs font-medium transition",
        active
          ? "border-fg bg-fg text-bg"
          : "border-border bg-bg-subtle text-fg-muted hover:text-fg"
      )}
    >
      {children}
    </button>
  );
}
