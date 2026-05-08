import type { SeedQuestion } from "@/content/question-types";

/**
 * Pure Math — kept empty in v1 (existing problems leaned probabilistic).
 * The file exists so the seed-glob loader picks up the topic immediately
 * when new linear-algebra / calculus questions are added.
 */
export const PURE_MATH_SEED: SeedQuestion[] = [
  {
    slug: "jensen-inequality-application",
    topic: "Pure Math",
    title: "Jensen's Inequality (and a Quant Application)",
    prompt_md:
      "State Jensen's inequality. Then give a concrete quant/finance application where the direction of the inequality matters.",
    solution_md:
      "For convex \(f\), \(E[f(X)] \\ge f(E[X])\). For concave \(f\), the inequality reverses. Application: \(\\log\\) is concave, so \(E[\\log(1+R)] \\le \\log(1+E[R])\) — volatility drag in geometric growth. This is also why log utility implies risk aversion.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["inequalities", "convexity", "finance"],
    source: "Core inequality",
    answer_meta: {
      rubric: [
        "Correctly states Jensen for convex (and ideally mentions concave reversal)",
        "Mentions expectation and the shape (convex/concave) as the reason for inequality direction",
        "Gives a relevant application (log returns / volatility drag / utility)",
      ],
      min_words: 50,
      reference_solution_md:
        "Jensen: for convex \(f\), \(E[f(X)] \\ge f(E[X])\) (reverse for concave). Since \(\\log\\) is concave, \(E[\\log(1+R)] \\le \\log(1+E[R])\), which explains volatility drag in geometric returns and connects to concave utility.",
    },
  },
  {
    slug: "covariance-matrix-psd",
    topic: "Pure Math",
    title: "Why Covariance Matrices Are PSD",
    prompt_md:
      "Explain why a covariance matrix is always positive semidefinite (PSD).",
    solution_md:
      "For any vector \(a\), \(a^T \\Sigma a = \\mathrm{Var}(a^T X) \\ge 0\). Since the quadratic form is nonnegative for all \(a\), \\(\\Sigma\\) is PSD.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["linear-algebra", "psd", "covariance"],
    source: "Linear algebra / stats core",
    answer_meta: {
      rubric: [
        "Uses the quadratic form \(a^T\\Sigma a\)",
        "Connects it to a variance of a linear combination",
        "Concludes nonnegativity implies PSD",
      ],
      min_words: 35,
      reference_solution_md:
        "For any \(a\), \(a^T\\Sigma a = \\mathrm{Var}(a^T X) \\ge 0\). Therefore \(\\Sigma\\) is PSD.",
    },
  },
  {
    slug: "rayleigh-quotient-max-eigenvalue",
    topic: "Pure Math",
    title: "Rayleigh Quotient and Largest Eigenvalue",
    prompt_md:
      "Let \(A\\) be a real symmetric matrix. Show that\n\n\\[ \\max_{x\\ne 0} \\frac{x^T A x}{x^T x} = \\lambda_{\\max}(A). \\]\n\nDescribe the key idea (you do not need a fully formal proof).",
    solution_md:
      "Diagonalize \(A = Q\\Lambda Q^T\). Substitute \(y = Q^T x\). Then the quotient becomes \(\\frac{\\sum_i \\lambda_i y_i^2}{\\sum_i y_i^2}\\), a weighted average of eigenvalues, maximized by putting all mass on the largest eigenvalue's coordinate (choose \(x\) to be that eigenvector).",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["linear-algebra", "eigenvalues", "optimization"],
    source: "Rayleigh quotient",
    answer_meta: {
      rubric: [
        "Uses symmetry to justify diagonalization / orthonormal eigenbasis",
        "Rewrites the quotient as a weighted average of eigenvalues",
        "Argues max occurs at the eigenvector of the largest eigenvalue",
      ],
      min_words: 70,
      reference_solution_md:
        "For symmetric \(A\), write \(A=Q\\Lambda Q^T\). With \(y=Q^T x\), the quotient is \\(\\frac{\\sum_i \\lambda_i y_i^2}{\\sum_i y_i^2}\\), a weighted average of eigenvalues. It is maximized by choosing \(y\\) supported on the coordinate for \\(\\lambda_{\\max}\\), i.e., \(x\) is the top eigenvector.",
    },
  },
];
