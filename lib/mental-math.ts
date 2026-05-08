export type MentalMathDifficulty = 1 | 2 | 3;

export type MentalMathProblem = {
  /** Stable id for React keying + debugging (not persisted). */
  id: string;
  prompt: string;
  /** Numeric target. We accept user input as a number (allowing decimals). */
  answer: number;
  /**
   * Absolute tolerance for numeric checking.
   * Use 0 for exact integer tasks.
   */
  tolerance: number;
  /** Used for lightweight filtering / future tuning. */
  tags: string[];
};

function randInt(rng: () => number, lo: number, hi: number): number {
  const a = Math.min(lo, hi);
  const b = Math.max(lo, hi);
  return a + Math.floor(rng() * (b - a + 1));
}

function pick<T>(rng: () => number, xs: readonly T[]): T {
  return xs[Math.floor(rng() * xs.length)]!;
}

function makeId(): string {
  // Small, readable id for debugging; uniqueness is sufficient for a session.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function roundTo(x: number, decimals: number): number {
  const m = 10 ** decimals;
  return Math.round(x * m) / m;
}

/**
 * Generate a Zetamac-style arithmetic / percentage / bps drill prompt.
 * Pure client-side: no seed bank rows, no DB calls.
 */
export function generateMentalMathProblem(opts: {
  difficulty: MentalMathDifficulty;
  includePercentages: boolean;
  includeBps: boolean;
  rng?: () => number;
}): MentalMathProblem {
  const rng = opts.rng ?? Math.random;
  const d = opts.difficulty;

  const families: Array<() => MentalMathProblem> = [];

  // -------------------------------------------------------------------------
  // Multiplication / division (exact integer)
  // -------------------------------------------------------------------------

  families.push(() => {
    const a = d === 1 ? randInt(rng, 6, 25) : d === 2 ? randInt(rng, 12, 60) : randInt(rng, 25, 99);
    const b = d === 1 ? randInt(rng, 6, 25) : d === 2 ? randInt(rng, 12, 60) : randInt(rng, 25, 99);
    return {
      id: makeId(),
      prompt: `${a} × ${b} = ?`,
      answer: a * b,
      tolerance: 0,
      tags: ["arithmetic", "multiplication"],
    };
  });

  families.push(() => {
    const b = d === 1 ? randInt(rng, 2, 12) : d === 2 ? randInt(rng, 3, 20) : randInt(rng, 5, 30);
    const q = d === 1 ? randInt(rng, 5, 25) : d === 2 ? randInt(rng, 8, 40) : randInt(rng, 10, 70);
    const a = b * q;
    return {
      id: makeId(),
      prompt: `${a} ÷ ${b} = ?`,
      answer: q,
      tolerance: 0,
      tags: ["arithmetic", "division"],
    };
  });

  // -------------------------------------------------------------------------
  // Percentages
  // -------------------------------------------------------------------------

  if (opts.includePercentages) {
    families.push(() => {
      const p = d === 1 ? pick(rng, [5, 10, 12.5, 15, 20, 25, 50] as const)
        : d === 2 ? pick(rng, [2, 3, 4, 6, 7.5, 8, 9, 11, 13, 17] as const)
        : pick(rng, [0.5, 1.5, 2.5, 3.75, 6.25, 12.5, 18, 22.5] as const);

      const base =
        d === 1 ? randInt(rng, 40, 500)
          : d === 2 ? randInt(rng, 80, 2000)
          : randInt(rng, 200, 8000);

      const ans = (p / 100) * base;
      const decimals = Number.isInteger(p) ? 2 : 3;
      return {
        id: makeId(),
        prompt: `${p}% of ${base} = ?`,
        answer: roundTo(ans, decimals),
        tolerance: 1e-3,
        tags: ["mental-math", "percentages"],
      };
    });
  }

  // -------------------------------------------------------------------------
  // Basis points
  // -------------------------------------------------------------------------

  if (opts.includeBps) {
    families.push(() => {
      const bps =
        d === 1 ? pick(rng, [10, 25, 50, 75, 100, 150, 200] as const)
          : d === 2 ? pick(rng, [5, 12, 20, 35, 80, 120, 175, 250] as const)
          : pick(rng, [1, 3, 7, 15, 33, 67, 125, 275] as const);
      const notional =
        d === 1 ? randInt(rng, 1000, 20000)
          : d === 2 ? randInt(rng, 5000, 200000)
          : randInt(rng, 20000, 2000000);

      const ans = (bps / 10000) * notional;
      // bps tasks should be exact to cents in spirit; accept small tolerance.
      return {
        id: makeId(),
        prompt: `${bps} bps of ${notional} = ?`,
        answer: roundTo(ans, 2),
        tolerance: 1e-2,
        tags: ["mental-math", "bps"],
      };
    });
  }

  // -------------------------------------------------------------------------
  // Add/subtract (exact integer)
  // -------------------------------------------------------------------------

  families.push(() => {
    const a = d === 1 ? randInt(rng, 50, 500) : d === 2 ? randInt(rng, 200, 5000) : randInt(rng, 2000, 60000);
    const b = d === 1 ? randInt(rng, 50, 500) : d === 2 ? randInt(rng, 200, 5000) : randInt(rng, 2000, 60000);
    const op = pick(rng, ["+", "-"] as const);
    return {
      id: makeId(),
      prompt: `${a} ${op} ${b} = ?`,
      answer: op === "+" ? a + b : a - b,
      tolerance: 0,
      tags: ["arithmetic", "addition-subtraction"],
    };
  });

  return pick(rng, families)();
}

export function checkMentalMathAnswer(problem: MentalMathProblem, raw: string): {
  ok: boolean;
  parsed: number | null;
} {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, parsed: null };

  // Allow commas in large numbers.
  const cleaned = trimmed.replace(/,/g, "");
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return { ok: false, parsed: null };

  if (problem.tolerance === 0) {
    return { ok: n === problem.answer, parsed: n };
  }
  return { ok: Math.abs(n - problem.answer) <= problem.tolerance, parsed: n };
}

