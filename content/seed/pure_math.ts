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
    track: "researcher",
    title: "Jensen's Inequality (and a Quant Application)",
    prompt_md:
      "State Jensen's inequality. Then give a concrete quant application where the direction of the inequality matters (no options/derivatives).",
    solution_md:
      "For convex \(f\), \(E[f(X)] \\ge f(E[X])\). For concave \(f\), the inequality reverses. Application: \(\\log\\) is concave, so \(E[\\log(1+R)] \\le \\log(1+E[R])\) — volatility drag in geometric growth and why geometric growth is penalized by variance even at fixed mean return.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["inequalities", "convexity", "applications"],
    source: "Core inequality",
    target_roles: ["Researcher"],
    answer_meta: {
      rubric: [
        "States Jensen correctly for convex \(f\): \(E[f(X)] \\ge f(E[X])\) (and/or notes concave reversal): 55%",
        "Explains the role of convexity/concavity in the inequality direction (not just memorized): 20%",
        "Gives a correct non-options quant application where direction matters (e.g., log growth/volatility drag): 25%",
      ],
      min_words: 50,
      reference_solution_md:
        "Jensen: for convex \(f\), \(E[f(X)] \\ge f(E[X])\) (reverse for concave). Since \(\\log\\) is concave, \(E[\\log(1+R)] \\le \\log(1+E[R])\), explaining volatility drag in geometric growth.",
    },
  },
  {
    slug: "covariance-matrix-psd",
    topic: "Pure Math",
    track: "researcher",
    title: "Why Covariance Matrices Are PSD",
    prompt_md:
      "Explain why a covariance matrix is always positive semidefinite (PSD).",
    solution_md:
      "For any vector \(a\), \(a^T \\Sigma a = \\mathrm{Var}(a^T X) \\ge 0\). Since the quadratic form is nonnegative for all \(a\), \\(\\Sigma\\) is PSD.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["linear-algebra", "psd", "covariance"],
    source: "Linear algebra / stats core",
    target_roles: ["Researcher"],
    answer_meta: {
      rubric: [
        "Uses the quadratic form \(a^T\\Sigma a\): 35%",
        "Connects it to a variance \(\\mathrm{Var}(a^T X)\): 45%",
        "Concludes nonnegativity for all \(a\) implies PSD: 20%",
      ],
      min_words: 35,
      reference_solution_md:
        "For any \(a\), \(a^T\\Sigma a = \\mathrm{Var}(a^T X) \\ge 0\). Therefore \(\\Sigma\\) is PSD.",
    },
  },
  {
    slug: "rayleigh-quotient-max-eigenvalue",
    topic: "Pure Math",
    track: "researcher",
    title: "Rayleigh Quotient and Largest Eigenvalue",
    prompt_md:
      "Let \(A\\) be a real symmetric matrix. Show that\n\n\\[ \\max_{x\\ne 0} \\frac{x^T A x}{x^T x} = \\lambda_{\\max}(A). \\]\n\nDescribe the key idea (you do not need a fully formal proof).",
    solution_md:
      "Diagonalize \(A = Q\\Lambda Q^T\). Substitute \(y = Q^T x\). Then the quotient becomes \(\\frac{\\sum_i \\lambda_i y_i^2}{\\sum_i y_i^2}\\), a weighted average of eigenvalues, maximized by putting all mass on the largest eigenvalue's coordinate (choose \(x\) to be that eigenvector).",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["linear-algebra", "eigenvalues", "optimization"],
    source: "Rayleigh quotient",
    target_roles: ["Researcher"],
    answer_meta: {
      rubric: [
        "Uses symmetry to justify diagonalization / orthonormal eigenbasis: 30%",
        "Rewrites the quotient as a weighted average of eigenvalues: 40%",
        "Argues the maximizer is the top-eigenvector direction: 30%",
      ],
      min_words: 70,
      reference_solution_md:
        "For symmetric \(A\), write \(A=Q\\Lambda Q^T\). With \(y=Q^T x\), the quotient is \\(\\frac{\\sum_i \\lambda_i y_i^2}{\\sum_i y_i^2}\\), a weighted average of eigenvalues. It is maximized by choosing \(y\\) supported on the coordinate for \\(\\lambda_{\\max}\\), i.e., \(x\) is the top eigenvector.",
    },
  },
  {
    slug: "projection-matrix-properties-mcq",
    topic: "Pure Math",
    track: "researcher",
    title: "Projection Matrix — Key Properties",
    prompt_md:
      "Let $P$ be the matrix for orthogonal projection onto a subspace in $\\mathbb{R}^n$. Which properties must $P$ satisfy?",
    solution_md:
      "An orthogonal projection matrix is idempotent and symmetric: $P^2=P$ and $P^\\top=P$.",
    answer_kind: "mcq",
    answer_value: "sym-idempotent",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["linear-algebra", "projections"],
    source: "Linear algebra core",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        { id: "sym-idempotent", label: "$P^2=P$ and $P^\\top=P$", correct: true },
        { id: "orthogonal", label: "$P^\\top P = I$", correct: false },
        { id: "invertible", label: "$P$ is invertible", correct: false },
        { id: "skew", label: "$P^\\top=-P$", correct: false },
      ],
    },
  },
  {
    slug: "least-squares-projection-geometry-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Least Squares as Orthogonal Projection",
    prompt_md:
      "Explain the geometric interpretation of ordinary least squares (OLS) $\\hat\\beta = \\arg\\min_\\beta \\|y-X\\beta\\|_2^2$.\n\nIn 5–10 sentences: interpret $X\\hat\\beta$ and the residual $r=y-X\\hat\\beta$ as a projection statement.",
    solution_md:
      "The set of all fitted values is the column space $\\mathcal{C}(X)=\\{X\\beta\\}$. OLS chooses the point in $\\mathcal{C}(X)$ closest to $y$ in Euclidean norm, so $\\hat y=X\\hat\\beta$ is the orthogonal projection of $y$ onto $\\mathcal{C}(X)$. The residual $r=y-\\hat y$ is orthogonal to every column of $X$ (normal equations $X^\\top r=0$).",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["linear-algebra", "ols", "projections"],
    source: "Linear regression geometry",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 95,
      rubric: [
        "States that fitted values lie in the column space of $X$ and OLS picks the closest point to $y$: 45%",
        "States the orthogonality condition $X^\\top (y-X\\hat\\beta)=0$ (residual orthogonal to columns): 40%",
        "Uses correct geometric language: projection / subspace / orthogonal complement: 15%",
      ],
      reference_solution_md:
        "OLS picks $\\hat y=X\\hat\\beta\\in\\mathcal{C}(X)$ minimizing distance to $y$, i.e. orthogonal projection onto the column space. Residual $r=y-X\\hat\\beta$ satisfies $X^\\top r=0$ (orthogonal to columns).\n",
    },
  },
  {
    slug: "svd-what-it-is-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "SVD — What Does It Give You?",
    prompt_md:
      "State the singular value decomposition (SVD) of a matrix $A\\in\\mathbb{R}^{m\\times n}$.\n\nIn 4–8 sentences: explain what the singular values represent geometrically.",
    solution_md:
      "SVD: $A = U\\Sigma V^\\top$ where $U\\in\\mathbb{R}^{m\\times m}$ and $V\\in\\mathbb{R}^{n\\times n}$ are orthogonal, and $\\Sigma$ is diagonal (rectangular) with nonnegative singular values $\\sigma_1\\ge\\cdots\\ge 0$. Geometrically, $A$ maps the unit sphere to an ellipsoid; the singular values are the lengths of the ellipsoid's principal semi-axes, with directions given by columns of $V$ (input) and $U$ (output).",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["linear-algebra", "svd"],
    source: "Linear algebra core",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 90,
      rubric: [
        "States SVD form $A=U\\Sigma V^\\top$ with orthogonal $U,V$ and nonnegative singular values: 55%",
        "Explains singular values as axis lengths of the image of the unit sphere (ellipsoid geometry): 35%",
        "Mentions the role of $V$ (input directions) and/or $U$ (output directions): 10%",
      ],
      reference_solution_md:
        "$A=U\\Sigma V^\\top$ with orthogonal $U,V$ and diagonal $\\Sigma$ (nonnegative singular values). Geometrically, unit sphere maps to ellipsoid; $\\sigma_i$ are principal axis lengths.\n",
    },
  },
  {
    slug: "lagrange-multipliers-condition-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Lagrange Multipliers — First-Order Condition",
    prompt_md:
      "State the first-order condition for constrained optimization with one equality constraint.\n\nSpecifically: to optimize $\\min_x f(x)$ subject to $g(x)=0$, what condition relates $\\nabla f$ and $\\nabla g$ at an interior optimum (assume differentiability and regularity)?",
    solution_md:
      "At a regular interior optimum $x^*$, gradients are parallel: there exists $\\lambda$ such that\n\n$$\\nabla f(x^*) + \\lambda \\nabla g(x^*) = 0,$$\n\nwith the constraint satisfied $g(x^*)=0$. This comes from optimizing the Lagrangian $\\mathcal{L}(x,\\lambda)=f(x)+\\lambda g(x)$.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["optimization", "lagrange-multipliers"],
    source: "Calculus/optimization core",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 65,
      rubric: [
        "States existence of multiplier $\\lambda$ with $\\nabla f(x^*)+\\lambda\\nabla g(x^*)=0$: 70%",
        "States the constraint is satisfied $g(x^*)=0$: 20%",
        "Mentions regularity/gradient nonzero or Lagrangian framing: 10%",
      ],
      reference_solution_md:
        "FOC: find $x^*,\\lambda$ such that $g(x^*)=0$ and $\\nabla f(x^*)+\\lambda\\nabla g(x^*)=0$ (regular interior optimum).\n",
    },
  },
  {
    slug: "taylor-approx-error-order-mcq",
    topic: "Pure Math",
    track: "researcher",
    title: "Taylor Approximation — Error Order",
    prompt_md:
      "If $f$ has a continuous second derivative near $a$, what is the typical order of the error when you approximate $f(a+h)$ by the first-order Taylor expansion $f(a)+f'(a)h$ as $h\\to 0$?",
    solution_md:
      "The remainder is typically $O(h^2)$ (more precisely, $\\frac{1}{2}f''(\\xi)h^2$ for some $\\xi$ between $a$ and $a+h$).",
    answer_kind: "mcq",
    answer_value: "h2",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["calculus", "taylor"],
    source: "Calculus core",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        { id: "h2", label: "$O(h^2)$", correct: true },
        { id: "h", label: "$O(h)$", correct: false },
        { id: "h3", label: "$O(h^3)$", correct: false },
        { id: "const", label: "$O(1)$", correct: false },
      ],
    },
  },
  {
    slug: "convexity-second-derivative-criterion-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Convexity via Second Derivative (1D)",
    prompt_md:
      "State a common sufficient condition for a twice-differentiable function $f:\\mathbb{R}\\to\\mathbb{R}$ to be convex.\n\nAnswer in 3–6 sentences and mention how the condition changes for concavity.",
    solution_md:
      "If $f$ is twice differentiable and $f''(x)\\ge 0$ for all $x$ in an interval, then $f$ is convex on that interval. If $f''(x)\\le 0$, then $f$ is concave. Intuition: nonnegative curvature means chords lie above the function and tangents lie below.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["convexity", "calculus"],
    source: "Calculus/optimization core",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 55,
      rubric: [
        "States $f''(x)\\ge 0$ implies convexity (on interval) for twice-differentiable $f$: 65%",
        "States the concavity analog $f''(x)\\le 0$: 25%",
        "Provides a brief intuition (curvature / chords / tangents) without errors: 10%",
      ],
      reference_solution_md:
        "If $f$ is $C^2$ and $f''\\ge 0$ on an interval, then $f$ is convex there; if $f''\\le 0$, $f$ is concave. Curvature sign captures the shape.\n",
    },
  },
  {
    slug: "psd-matrix-equivalent-definitions-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "PSD Matrices — Equivalent Characterizations",
    prompt_md:
      "Give two equivalent ways to characterize a real symmetric matrix $A$ being positive semidefinite (PSD).\n\nAnswer in 4–8 sentences; you can use quadratic forms and eigenvalues (or Cholesky-style factorizations).",
    solution_md:
      "Equivalently: (1) $x^\\top A x\\ge 0$ for all $x$ (quadratic form nonnegative). (2) All eigenvalues of $A$ are nonnegative. Another equivalent statement is that $A=B^\\top B$ for some $B$ (Gram form).",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["linear-algebra", "psd"],
    source: "Linear algebra core",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 70,
      rubric: [
        "Gives the quadratic form definition $x^\\top A x\\ge 0$ for all $x$: 45%",
        "Gives an eigenvalue characterization (all eigenvalues nonnegative) or an equivalent factorization ($A=B^\\top B$): 45%",
        "States symmetry requirement or stays within symmetric case without confusion: 10%",
      ],
      reference_solution_md:
        "For symmetric $A$, PSD iff $x^\\top A x\\ge 0$ for all $x$, equivalently iff all eigenvalues are $\\ge 0$ (also iff $A=B^\\top B$ for some $B$).\n",
    },
  },
  {
    slug: "conditioning-why-matters-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Condition Number — Why It Matters",
    prompt_md:
      "What is the condition number of an invertible matrix (informally), and why does it matter for numerical linear algebra?\n\nAnswer in 5–10 sentences and connect to sensitivity of solutions to $Ax=b$.",
    solution_md:
      "The condition number (often $\\kappa(A)=\\|A\\|\\,\\|A^{-1}\\|$ in a chosen norm) measures how sensitive the solution of $Ax=b$ is to small perturbations in $A$ or $b$. A large $\\kappa(A)$ means the problem is ill-conditioned: small relative input errors can lead to large relative errors in $x$. This affects numerical stability and explains why near-singular matrices amplify noise and rounding error.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["linear-algebra", "numerical"],
    source: "Numerical linear algebra staple",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 90,
      rubric: [
        "Defines condition number informally as $\\|A\\|\\|A^{-1}\\|$ (or sensitivity ratio) for invertible $A$: 45%",
        "Explains it measures sensitivity of $Ax=b$ solution to perturbations/rounding: 45%",
        "Mentions ill-conditioning corresponds to near-singularity and error amplification: 10%",
      ],
      reference_solution_md:
        "$\\kappa(A)=\\|A\\|\\|A^{-1}\\|$ (norm-dependent) measures sensitivity of solving $Ax=b$; large $\\kappa$ implies small input errors can cause large output errors (ill-conditioned / near singular).\n",
    },
  },
  {
    slug: "eckart-young-best-rank-k-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Best Rank-$k$ Approximation (Eckart–Young)",
    prompt_md:
      "State (informally) the Eckart–Young theorem about the best rank-$k$ approximation of a matrix.\n\nIn 5–10 sentences: describe what approximation you take from the SVD and what norm it is optimal for.",
    solution_md:
      "If $A=U\\Sigma V^\\top$ with singular values $\\sigma_1\\ge\\cdots\\ge\\sigma_r$, the best rank-$k$ approximation (in Frobenius norm, and also spectral/operator 2-norm) is obtained by truncating the SVD: keep only the top $k$ singular values and corresponding singular vectors. Concretely, $A_k = U_{:,1:k}\\Sigma_{1:k,1:k}V_{:,1:k}^\\top$ minimizes $\\|A-B\\|_F$ over all rank-$k$ matrices $B$ (and similarly for $\\|\\cdot\\|_2$).",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["linear-algebra", "svd", "approximation"],
    source: "Numerical linear algebra staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 95,
      rubric: [
        "States that truncating the SVD (keep top k singular values/vectors) gives the best rank-k approximation: 65%",
        "Mentions at least one norm of optimality correctly (Frobenius and/or spectral 2-norm): 25%",
        "Writes a correct form like $A_k=U_k\\Sigma_kV_k^\\top$ or equivalent description: 10%",
      ],
      reference_solution_md:
        "Eckart–Young: if $A=U\\Sigma V^\\top$, then $A_k=U_k\\Sigma_kV_k^\\top$ (top k singular values/vectors) minimizes $\\|A-B\\|_F$ over rank-k $B$ (also optimal for $\\|\\cdot\\|_2$).\n",
    },
  },
  {
    slug: "pseudoinverse-least-norm-solution-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Pseudoinverse — Least-Norm Solution",
    prompt_md:
      "Suppose $Ax=b$ is underdetermined and has infinitely many solutions. What does the Moore–Penrose pseudoinverse $A^+$ give you?\n\nAnswer in 4–8 sentences and be explicit about what is minimized.",
    solution_md:
      "Among all solutions to $Ax=b$, the pseudoinverse solution $x^* = A^+ b$ is the one with minimum Euclidean norm $\\|x\\|_2$. More generally, in least-squares settings it gives the minimum-norm least-squares solution. It can be derived from the SVD by inverting nonzero singular values.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["linear-algebra", "pseudoinverse", "svd"],
    source: "Linear algebra / numerical methods",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 80,
      rubric: [
        "States $x^*=A^+b$ is the minimum-norm solution among all solutions to $Ax=b$: 65%",
        "Mentions least-squares generalization (minimum-norm LS) or clarifies existence conditions: 20%",
        "Mentions SVD intuition (invert nonzero singular values) or projection view: 15%",
      ],
      reference_solution_md:
        "If $Ax=b$ has many solutions, $x^*=A^+b$ is the one minimizing $\\|x\\|_2$ subject to $Ax=b$ (and in general gives the minimum-norm least-squares solution).",
    },
  },
  {
    slug: "quadratic-form-gradient-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Gradient of a Quadratic Form",
    prompt_md:
      "Let $f(x)=x^\\top A x$ for a constant matrix $A\\in\\mathbb{R}^{n\\times n}$.\n\nWhat is $\\nabla_x f(x)$? Give the simplest correct expression (no need for index notation).",
    solution_md:
      "In general, $\\nabla_x (x^\\top A x) = (A + A^\\top)x$. In particular, if $A$ is symmetric, the gradient is $2Ax$.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["calculus", "linear-algebra", "gradients"],
    source: "Matrix calculus staple",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 45,
      rubric: [
        "Gives the general expression $(A+A^\\top)x$: 75%",
        "Notes the symmetric special case $2Ax$ (or clearly restricts to symmetric $A$): 25%",
      ],
      reference_solution_md:
        "$$\\nabla_x(x^\\top A x)=(A+A^\\top)x$$ (and if $A$ symmetric, $=2Ax$).",
    },
  },
  {
    slug: "hessian-and-convexity-mcq",
    topic: "Pure Math",
    track: "researcher",
    title: "Hessian Test for Convexity",
    prompt_md:
      "Let $f:\\mathbb{R}^n\\to\\mathbb{R}$ be twice differentiable. Which statement is a common sufficient condition for $f$ to be convex on a convex set?",
    solution_md:
      "A standard sufficient condition is that the Hessian is PSD everywhere on the set: $\\nabla^2 f(x)\\succeq 0$.",
    answer_kind: "mcq",
    answer_value: "hessian-psd",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["convexity", "optimization"],
    source: "Optimization basics",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        { id: "hessian-psd", label: "$\\nabla^2 f(x)\\succeq 0$ for all $x$ in the domain.", correct: true },
        { id: "grad-zero", label: "$\\nabla f(x)=0$ for all $x$ in the domain.", correct: false },
        { id: "det-positive", label: "$\\det(\\nabla^2 f(x))>0$ for all $x$ in the domain.", correct: false },
        { id: "trace-negative", label: "$\\mathrm{tr}(\\nabla^2 f(x))<0$ for all $x$ in the domain.", correct: false },
      ],
    },
  },
  {
    slug: "strong-convexity-definition-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Strong Convexity — Definition/Implication",
    prompt_md:
      "Define $\\mu$-strong convexity for a differentiable function $f$.\n\nIn 4–8 sentences: give one useful implication (e.g., uniqueness of minimizer or a quadratic lower bound).",
    solution_md:
      "$f$ is $\\mu$-strongly convex if for all $x,y$,\n\n$$f(y)\\ge f(x)+\\nabla f(x)^\\top (y-x)+\\frac{\\mu}{2}\\|y-x\\|_2^2.$$\n\nThis implies (when a minimizer exists) the minimizer is unique and $f$ grows at least quadratically away from it; equivalently, if twice differentiable, $\\nabla^2 f(x)\\succeq \\mu I$.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["convexity", "optimization"],
    source: "Convex optimization core",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 85,
      rubric: [
        "States a correct strong convexity inequality with a quadratic term (or Hessian lower bound $\\nabla^2 f\\succeq \\mu I$): 65%",
        "Mentions one correct implication (unique minimizer / quadratic growth / better rates): 25%",
        "Uses correct quantifiers (for all x,y) and nonnegative parameter $\\mu$: 10%",
      ],
      reference_solution_md:
        "$f$ is $\\mu$-strongly convex if $f(y)\\ge f(x)+\\nabla f(x)^\\top(y-x)+\\frac{\\mu}{2}\\|y-x\\|^2$ for all $x,y$ (equiv $\\nabla^2 f\\succeq \\mu I$). Implies unique minimizer and quadratic growth.\n",
    },
  },
  {
    slug: "log-sum-exp-convex-mcq",
    topic: "Pure Math",
    track: "researcher",
    title: "Log-Sum-Exp",
    prompt_md:
      "Which statement about the log-sum-exp function $\\mathrm{LSE}(x)=\\log\\left(\\sum_i e^{x_i}\\right)$ is true?",
    solution_md:
      "Log-sum-exp is convex and is a smooth approximation of $\\max_i x_i$.",
    answer_kind: "mcq",
    answer_value: "convex-smooth-max",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["convexity", "optimization"],
    source: "Convex analysis / ML math",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      options: [
        { id: "convex-smooth-max", label: "It is convex and provides a smooth approximation to $\\max_i x_i$.", correct: true },
        { id: "concave", label: "It is concave and provides a smooth approximation to $\\min_i x_i$.", correct: false },
        { id: "linear", label: "It is linear in $x$.", correct: false },
        { id: "nonconvex", label: "It is non-convex except in 1D.", correct: false },
      ],
    },
  },
  {
    slug: "cauchy-schwarz-statement-application-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Cauchy–Schwarz (and a Quick Application)",
    prompt_md:
      "State the Cauchy–Schwarz inequality.\n\nThen give one short application (1–2 lines) showing how it can upper-bound an inner product or expectation.",
    solution_md:
      "For vectors $u,v$, $|u^\\top v|\\le \\|u\\|_2\\,\\|v\\|_2$. In random-variable form, $|E[XY]|\\le \\sqrt{E[X^2]E[Y^2]}$. Application: $|E[X]| = |E[X\\cdot 1]|\\le \\sqrt{E[X^2]}$.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["inequalities", "linear-algebra"],
    source: "Core inequality",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 65,
      rubric: [
        "States Cauchy–Schwarz correctly in vector and/or RV form: 70%",
        "Provides a correct concrete application bound (e.g., $|E[X]|\\le\\sqrt{E[X^2]}$ or $|u^Tv|$ bound): 25%",
        "Uses correct absolute values/norms and no direction mistakes: 5%",
      ],
      reference_solution_md:
        "C–S: $|u^Tv|\\le \\|u\\|\\|v\\|$; equivalently $|E[XY]|\\le\\sqrt{E[X^2]E[Y^2]}$. Example: $|E[X]|\\le \\sqrt{E[X^2]}$.\n",
    },
  },
  {
    slug: "spectral-theorem-symmetric-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Spectral Theorem (Real Symmetric Matrices)",
    prompt_md:
      "State the spectral theorem for real symmetric matrices.\n\nIn 4–8 sentences: include what decomposition exists and what it implies about eigenvalues/eigenvectors.",
    solution_md:
      "If $A\\in\\mathbb{R}^{n\\times n}$ is symmetric, it is orthogonally diagonalizable: there exists an orthogonal matrix $Q$ and a real diagonal matrix $\\Lambda$ such that $A=Q\\Lambda Q^\\top$. The diagonal entries of $\\Lambda$ are the real eigenvalues, and the columns of $Q$ are an orthonormal eigenbasis. This implies symmetric matrices have real eigenvalues and orthogonal eigenvectors (for distinct eigenvalues).",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["linear-algebra", "eigenvalues"],
    source: "Linear algebra core",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 85,
      rubric: [
        "States orthogonal diagonalization $A=Q\\Lambda Q^\\top$ for symmetric $A$: 60%",
        "Mentions eigenvalues are real and eigenvectors form an orthonormal basis: 30%",
        "Uses correct terms (orthogonal Q, diagonal Λ) without mixing SVD/eigendecomposition: 10%",
      ],
      reference_solution_md:
        "Spectral theorem: if $A$ is real symmetric, $A=Q\\Lambda Q^\\top$ with orthogonal $Q$ and real diagonal $\\Lambda$. Eigenvalues are real; eigenvectors form an orthonormal basis.\n",
    },
  },
  {
    slug: "orthonormal-matrix-properties-mcq",
    topic: "Pure Math",
    track: "researcher",
    title: "Orthonormal Matrices",
    prompt_md:
      "If $Q\\in\\mathbb{R}^{n\\times n}$ is orthogonal (orthonormal columns), which identity is true?",
    solution_md:
      "Orthogonal matrices satisfy $Q^\\top Q = I$ (and also $QQ^\\top=I$).",
    answer_kind: "mcq",
    answer_value: "qtq",
    answer_tolerance: null,
    difficulty: 1,
    tags: ["linear-algebra", "orthogonal"],
    source: "Core definition",
    target_roles: ["All"],
    answer_meta: {
      options: [
        { id: "qtq", label: "$Q^\\top Q = I$", correct: true },
        { id: "qq", label: "$Q^2 = I$", correct: false },
        { id: "sym", label: "$Q=Q^\\top$", correct: false },
        { id: "det0", label: "$\\det(Q)=0$", correct: false },
      ],
    },
  },
  {
    slug: "gram-schmidt-what-does-it-do-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Gram–Schmidt — What Does It Produce?",
    prompt_md:
      "What does the Gram–Schmidt procedure do?\n\nIn 4–8 sentences: describe the input and output and one common use (QR, projections, least squares).",
    solution_md:
      "Given a linearly independent set of vectors, Gram–Schmidt produces an orthonormal basis spanning the same subspace. It iteratively subtracts projections onto previously constructed basis vectors and normalizes. A common use is computing a QR decomposition $A=QR$ (columns of $Q$ are orthonormal), which is useful for least squares and for numerically stable projections.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["linear-algebra", "orthogonalization", "qr"],
    source: "Linear algebra staple",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 85,
      rubric: [
        "States it converts a linearly independent set into an orthonormal basis spanning the same subspace: 60%",
        "Mentions the projection-subtraction idea (orthogonalizing step) and normalization: 25%",
        "Mentions a common use (QR/least squares/projections) correctly: 15%",
      ],
      reference_solution_md:
        "Gram–Schmidt takes independent vectors and produces an orthonormal basis for the same span by subtracting projections onto earlier basis vectors and normalizing; used for QR and least squares/projections.\n",
    },
  },
  {
    slug: "determinant-geometric-meaning-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Determinant — Geometric Meaning",
    prompt_md:
      "What is the geometric meaning of $|\\det(A)|$ for a square matrix $A$?\n\nAnswer in 3–6 sentences and mention volume scaling and orientation.",
    solution_md:
      "$|\\det(A)|$ is the factor by which $A$ scales volumes in $\\mathbb{R}^n$ (e.g., area in 2D, volume in 3D). A determinant of 0 means volume collapses to a lower-dimensional set (non-invertible). The sign of $\\det(A)$ indicates whether orientation is preserved (+) or flipped (−).",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["linear-algebra", "determinant"],
    source: "Linear algebra core",
    target_roles: ["All"],
    answer_meta: {
      min_words: 70,
      rubric: [
        "States $|\\det(A)|$ is the volume scaling factor: 70%",
        "Mentions sign as orientation (preserve vs flip): 20%",
        "Mentions det=0 implies collapse / non-invertible: 10%",
      ],
      reference_solution_md:
        "$|\\det(A)|$ scales nD volume; sign indicates orientation; det=0 collapses volume (singular).\n",
    },
  },
  {
    slug: "trace-invariance-cyclic-mcq",
    topic: "Pure Math",
    track: "researcher",
    title: "Trace Trick",
    prompt_md:
      "Which identity is always true when the matrix products are well-defined?",
    solution_md:
      "Trace is invariant under cyclic permutations: $\\mathrm{tr}(AB)=\\mathrm{tr}(BA)$ (and more generally $\\mathrm{tr}(ABC)=\\mathrm{tr}(BCA)=\\mathrm{tr}(CAB)$).",
    answer_kind: "mcq",
    answer_value: "cyclic",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["linear-algebra", "trace"],
    source: "Matrix calculus staple",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      options: [
        { id: "cyclic", label: "$\\mathrm{tr}(AB)=\\mathrm{tr}(BA)$", correct: true },
        { id: "commute", label: "$AB=BA$ for all square matrices", correct: false },
        { id: "inv", label: "$\\mathrm{tr}(A^{-1})=1/\\mathrm{tr}(A)$", correct: false },
        { id: "mult", label: "$\\mathrm{tr}(AB)=\\mathrm{tr}(A)\\mathrm{tr}(B)$", correct: false },
      ],
    },
  },
  {
    slug: "pca-variance-maximization-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "PCA Derivation (Variance Maximization View)",
    prompt_md:
      "Assume data is centered and has sample covariance $S$. Derive the optimization problem for the first principal component direction and show what vector solves it.\n\nKeep it to 6–12 sentences; no long computations needed.",
    solution_md:
      "The first PC direction $v$ maximizes the variance of the 1D projection: maximize $\\mathrm{Var}(v^\\top X)=v^\\top S v$ subject to $\\|v\\|_2=1$. This is the Rayleigh quotient maximization. Using Lagrange multipliers gives $Sv=\\lambda v$, so the maximizer is the eigenvector corresponding to the largest eigenvalue of $S$.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["linear-algebra", "pca", "optimization"],
    source: "PCA core derivation",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 110,
      rubric: [
        "Sets up the correct constrained optimization $\\max_{\\|v\\|=1} v^\\top S v$: 50%",
        "Uses Rayleigh quotient / Lagrange multiplier argument to get eigenvector condition $Sv=\\lambda v$: 35%",
        "Identifies solution as top eigenvector (largest eigenvalue): 15%",
      ],
      reference_solution_md:
        "First PC maximizes projected variance: $\\max_{\\|v\\|=1} v^\\top S v$. Lagrange multipliers give $Sv=\\lambda v$, so choose eigenvector with largest eigenvalue.\n",
    },
  },
  {
    slug: "quadratic-form-convexity-psd-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "When Is $x^\\top A x$ Convex?",
    prompt_md:
      "Consider $f(x)=x^\\top A x$ with $A\\in\\mathbb{R}^{n\\times n}$. Give a condition on $A$ for $f$ to be convex.\n\nAnswer in 3–6 sentences and mention the Hessian.",
    solution_md:
      "The Hessian of $x^\\top A x$ is $A+A^\\top$ (and equals $2A$ if $A$ is symmetric). The function is convex iff the Hessian is PSD, i.e. iff $A+A^\\top\\succeq 0$. In the common symmetric case, this reduces to $A\\succeq 0$.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["convexity", "linear-algebra", "hessian"],
    source: "Optimization core",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 75,
      rubric: [
        "States convexity requires PSD Hessian: 35%",
        "Identifies the Hessian for the quadratic form (A+A^T, or 2A if symmetric): 45%",
        "Gives the resulting matrix condition (A+A^T PSD; symmetric case A PSD): 20%",
      ],
      reference_solution_md:
        "For $f(x)=x^TAx$, Hessian is $A+A^T$ (or $2A$ if symmetric). Convex iff Hessian PSD, i.e. $A+A^T\\succeq 0$ (symmetric case: $A\\succeq 0$).\n",
    },
  },
  {
    slug: "lipschitz-gradient-smoothness-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Smoothness: Lipschitz Gradient",
    prompt_md:
      "What does it mean for a differentiable function $f$ to have an $L$-Lipschitz gradient (be $L$-smooth)?\n\nAnswer in 4–8 sentences and give one implication used in optimization (a quadratic upper bound / descent lemma).",
    solution_md:
      "$f$ is $L$-smooth if its gradient is Lipschitz: $\\|\\nabla f(x)-\\nabla f(y)\\|_2\\le L\\|x-y\\|_2$ for all $x,y$. A key implication is the quadratic upper bound (descent lemma):\n\n$$f(y)\\le f(x)+\\nabla f(x)^\\top (y-x)+\\frac{L}{2}\\|y-x\\|_2^2,$$\n\nwhich is used to justify step sizes and convergence rates in gradient methods.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["optimization", "calculus", "convexity"],
    source: "First-order optimization basics",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 95,
      rubric: [
        "States the Lipschitz gradient definition $\\|\\nabla f(x)-\\nabla f(y)\\|\\le L\\|x-y\\|$: 55%",
        "Gives a correct implication such as the quadratic upper bound / descent lemma: 35%",
        "Connects to practical optimization use (step sizes / GD convergence) without major errors: 10%",
      ],
      reference_solution_md:
        "$L$-smooth: $\\|\\nabla f(x)-\\nabla f(y)\\|\\le L\\|x-y\\|$. Implication: $f(y)\\le f(x)+\\nabla f(x)^T(y-x)+\\frac{L}{2}\\|y-x\\|^2$ (descent lemma).\n",
    },
  },
  {
    slug: "cholesky-when-exists-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Cholesky Factorization — When Does It Exist?",
    prompt_md:
      "When does a real symmetric matrix $A$ admit a Cholesky factorization $A=LL^\\top$ with $L$ lower-triangular?\n\nAnswer in 4–8 sentences and be clear about PSD vs PD.",
    solution_md:
      "A standard Cholesky factorization with positive diagonal exists for symmetric positive definite (SPD) matrices. For positive semidefinite (PSD) matrices, a factorization $A=LL^\\top$ can exist but may require pivoting / can have zeros on the diagonal and may fail without care if $A$ is only semidefinite or numerically singular. In interview terms: SPD ⇒ Cholesky exists and is unique with positive diagonal.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["linear-algebra", "cholesky", "psd"],
    source: "Numerical linear algebra staple",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 85,
      rubric: [
        "States Cholesky exists (with positive diagonal) for symmetric positive definite matrices: 70%",
        "Distinguishes PSD vs PD (PSD may be singular / may need pivoting / not unique): 20%",
        "Uses correct factor form $A=LL^\\top$ and symmetry requirement: 10%",
      ],
      reference_solution_md:
        "Cholesky with positive diagonal exists for symmetric positive definite $A$ and is unique under that convention. PSD matrices can be singular; an $LL^\\top$ factor may exist but can involve zeros/pivoting.\n",
    },
  },
  {
    slug: "sherman-morrison-formula-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Sherman–Morrison (Rank-1 Update Inverse)",
    prompt_md:
      "State the Sherman–Morrison formula for the inverse of a rank-1 update.\n\nSpecifically, for invertible $A$ and vectors $u,v$, give $(A+uv^\\top)^{-1}$ assuming the denominator is nonzero.",
    solution_md:
      "If $A$ is invertible and $1+v^\\top A^{-1}u\\ne 0$, then\n\n$$(A+uv^\\top)^{-1}=A^{-1}-\\frac{A^{-1}u v^\\top A^{-1}}{1+v^\\top A^{-1}u}.$$\n",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["linear-algebra", "numerical", "matrix-inverse"],
    source: "Matrix identities staple",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 55,
      rubric: [
        "Writes the correct Sherman–Morrison formula with numerator $A^{-1}u v^\\top A^{-1}$: 75%",
        "Includes the correct denominator $1+v^\\top A^{-1}u$ and notes it must be nonzero: 25%",
      ],
      reference_solution_md:
        "$$(A+uv^\\top)^{-1}=A^{-1}-\\frac{A^{-1}u v^\\top A^{-1}}{1+v^\\top A^{-1}u},\\quad 1+v^\\top A^{-1}u\\ne 0.$$",
    },
  },
  {
    slug: "svd-vs-eigendecomposition-mcq",
    topic: "Pure Math",
    track: "researcher",
    title: "SVD vs Eigendecomposition",
    prompt_md:
      "Which statement best contrasts SVD with eigendecomposition?",
    solution_md:
      "SVD exists for any matrix (rectangular allowed) and uses orthogonal matrices with nonnegative singular values; eigendecomposition $A=Q\\Lambda Q^{-1}$ generally requires square matrices and nice structure (e.g., diagonalizability; orthogonal diagonalization for symmetric).",
    answer_kind: "mcq",
    answer_value: "svd-any-matrix",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["linear-algebra", "svd", "eigenvalues"],
    source: "Core comparison",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      options: [
        {
          id: "svd-any-matrix",
          label:
            "SVD exists for any (even rectangular) matrix with nonnegative singular values; eigendecomposition is for square matrices and may require diagonalizability (orthogonal form for symmetric).",
          correct: true,
        },
        { id: "same", label: "They are the same decomposition with different notation.", correct: false },
        { id: "eigen-rect", label: "Eigendecomposition exists for any rectangular matrix.", correct: false },
        { id: "svd-needs-symmetric", label: "SVD requires the matrix to be symmetric.", correct: false },
      ],
    },
  },
  {
    slug: "jacobian-change-of-variables-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Change of Variables and the Jacobian",
    prompt_md:
      "State the multivariate change-of-variables formula for integrals.\n\nIn 4–8 sentences: include the Jacobian determinant and why an absolute value appears.",
    solution_md:
      "If $y=g(x)$ is a differentiable bijection with differentiable inverse, then\n\n$$\\int_{g(U)} f(y)\\,dy = \\int_U f(g(x))\\,|\\det J_g(x)|\\,dx,$$\n\nwhere $J_g$ is the Jacobian matrix of $g$. The absolute value appears because volume elements scale by the magnitude of the determinant; orientation flips should not make a volume negative.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["calculus", "jacobian", "integration"],
    source: "Multivariable calculus core",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 95,
      rubric: [
        "States the correct formula with $f(g(x))$ and the Jacobian determinant factor: 65%",
        "Uses absolute value and explains it as volume scaling (orientation): 20%",
        "Mentions the needed conditions at a high level (diffeomorphism / invertibility on region): 15%",
      ],
      reference_solution_md:
        "$$\\int_{g(U)} f(y)dy = \\int_U f(g(x))|\\det J_g(x)|dx.$$ Absolute value because the determinant magnitude scales volume; sign is orientation.\n",
    },
  },
  {
    slug: "am-gm-inequality-statement-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "AM–GM Inequality",
    prompt_md:
      "State the AM–GM inequality for nonnegative real numbers.\n\nAnswer in 3–6 sentences and include the equality condition.",
    solution_md:
      "For $x_1,\\dots,x_n\\ge 0$,\n\n$$\\frac{1}{n}\\sum_{i=1}^n x_i \\ge \\left(\\prod_{i=1}^n x_i\\right)^{1/n},$$\n\nwith equality iff all $x_i$ are equal.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["inequalities"],
    source: "Core inequality",
    target_roles: ["All"],
    answer_meta: {
      min_words: 55,
      rubric: [
        "States the AM–GM inequality correctly for nonnegative numbers: 75%",
        "States the equality condition (all equal): 25%",
      ],
      reference_solution_md:
        "$$\\frac{1}{n}\\sum_i x_i \\ge (\\prod_i x_i)^{1/n}$$ for $x_i\\ge 0$, equality iff all $x_i$ equal.\n",
    },
  },
  {
    slug: "max-inner-product-unit-vector-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Maximize an Inner Product Under a Norm Constraint",
    prompt_md:
      "Compute\n\n$$\\max_{\\|x\\|_2=1} a^\\top x$$\n\nfor a given vector $a\\in\\mathbb{R}^n$, and describe an optimizer $x^*$.\n\nAnswer in 3–6 sentences.",
    solution_md:
      "By Cauchy–Schwarz, $a^\\top x\\le \\|a\\|_2\\|x\\|_2=\\|a\\|_2$ with equality when $x$ is aligned with $a$. So the maximum is $\\|a\\|_2$, achieved by $x^*=a/\\|a\\|_2$ (if $a\\ne 0$).",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["optimization", "inequalities"],
    source: "Core exercise",
    target_roles: ["All"],
    answer_meta: {
      min_words: 70,
      rubric: [
        "Uses Cauchy–Schwarz to upper bound $a^\\top x$ by $\\|a\\|_2$: 55%",
        "States the maximum value is $\\|a\\|_2$: 25%",
        "Gives a correct optimizer direction $x^*=a/\\|a\\|_2$ (when $a\\ne 0$): 20%",
      ],
      reference_solution_md:
        "By C–S, $a^\\top x\\le \\|a\\|\\|x\\|=\\|a\\|$. Achieve equality with $x=a/\\|a\\|$. So max is $\\|a\\|$.\n",
    },
  },
  {
    slug: "kkt-conditions-summary-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "KKT Conditions (High Level)",
    prompt_md:
      "State the Karush–Kuhn–Tucker (KKT) conditions at a high level for\n\n$$\\min_x f(x)\\ \\text{s.t. } g_i(x)\\le 0\\ (i=1..m),\\ \\ h_j(x)=0\\ (j=1..p).$$\n\nAnswer in 6–12 sentences. Name the main parts (stationarity, primal feasibility, dual feasibility, complementary slackness).",
    solution_md:
      "KKT conditions (under suitable regularity) include: primal feasibility ($g_i(x^*)\\le 0$, $h_j(x^*)=0$), dual feasibility ($\\lambda_i\\ge 0$ for inequality multipliers), stationarity ($\\nabla f(x^*)+\\sum_i \\lambda_i\\nabla g_i(x^*)+\\sum_j \\nu_j\\nabla h_j(x^*)=0$), and complementary slackness ($\\lambda_i g_i(x^*)=0$ for all $i$). They characterize optimality for convex problems (and are necessary under constraint qualifications more generally).",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["optimization", "kkt"],
    source: "Optimization staple",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 130,
      rubric: [
        "Lists the four core pieces: primal feasibility, dual feasibility, stationarity, complementary slackness: 55%",
        "Writes a correct stationarity condition with gradients and multipliers: 30%",
        "Mentions convexity/regularity caveat (necessary vs sufficient): 15%",
      ],
      reference_solution_md:
        "KKT: primal feasibility ($g_i\\le 0$, $h_j=0$), dual feasibility ($\\lambda_i\\ge 0$), stationarity ($\\nabla f+\\sum_i\\lambda_i\\nabla g_i+\\sum_j\\nu_j\\nabla h_j=0$), complementary slackness ($\\lambda_i g_i=0$). Under convexity + regularity, sufficient.\n",
    },
  },
  {
    slug: "triangle-inequality-norm-mcq",
    topic: "Pure Math",
    track: "researcher",
    title: "Norms — Triangle Inequality",
    prompt_md:
      "Which inequality is always true for any norm $\\|\\cdot\\|$ on $\\mathbb{R}^n$?",
    solution_md:
      "Any norm satisfies the triangle inequality: $\\|x+y\\|\\le \\|x\\|+\\|y\\|$.",
    answer_kind: "mcq",
    answer_value: "triangle",
    answer_tolerance: null,
    difficulty: 1,
    tags: ["linear-algebra", "norms"],
    source: "Core definition",
    target_roles: ["All"],
    answer_meta: {
      options: [
        { id: "triangle", label: "$\\|x+y\\|\\le \\|x\\|+\\|y\\|$", correct: true },
        { id: "reverse", label: "$\\|x+y\\|\\ge \\|x\\|+\\|y\\|$", correct: false },
        { id: "multiplicative", label: "$\\|x+y\\|=\\|x\\|\\|y\\|$", correct: false },
        { id: "orth", label: "$\\|x+y\\|=\\|x\\|+\\|y\\|$ for all $x,y$", correct: false },
      ],
    },
  },
  {
    slug: "psd-ordering-monotonicity-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "PSD Ordering and Quadratic Forms",
    prompt_md:
      "Let $A$ and $B$ be symmetric matrices with $A\\succeq B$ (meaning $A-B$ is PSD).\n\nWhat inequality does this imply for quadratic forms $x^\\top A x$ and $x^\\top B x$ for all $x$?\n\nAnswer in 2–5 sentences.",
    solution_md:
      "If $A\\succeq B$, then $A-B$ is PSD so $x^\\top(A-B)x\\ge 0$ for all $x$. Equivalently, $x^\\top A x\\ge x^\\top B x$ for all $x$.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["linear-algebra", "psd"],
    source: "Core fact",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 40,
      rubric: [
        "States $x^\\top(A-B)x\\ge 0$ for all $x$ from PSD definition: 55%",
        "Concludes $x^\\top A x\\ge x^\\top B x$ for all $x$: 45%",
      ],
      reference_solution_md:
        "$A\\succeq B$ means $A-B\\succeq 0$, so $x^\\top(A-B)x\\ge 0$ for all $x$, i.e. $x^\\top A x\\ge x^\\top B x$.\n",
    },
  },
  {
    slug: "rank-nullity-theorem-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Rank–Nullity Theorem",
    prompt_md:
      "State the rank–nullity theorem for a linear map (or matrix) $A\\in\\mathbb{R}^{m\\times n}$.\n\nAnswer in 2–5 sentences and define the terms you use.",
    solution_md:
      "Rank–nullity says\n\n$$\\mathrm{rank}(A)+\\mathrm{nullity}(A)=n,$$\n\nwhere $\\mathrm{rank}(A)=\\dim(\\mathrm{col}(A))$ and $\\mathrm{nullity}(A)=\\dim(\\mathrm{null}(A))$ (dimension of the kernel).",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["linear-algebra", "rank"],
    source: "Linear algebra core",
    target_roles: ["All"],
    answer_meta: {
      min_words: 55,
      rubric: [
        "States $\\mathrm{rank}(A)+\\mathrm{nullity}(A)=n$ (domain dimension): 70%",
        "Defines rank as dimension of column space and nullity as dimension of null space/kernel: 30%",
      ],
      reference_solution_md:
        "Rank–nullity: $\\mathrm{rank}(A)+\\mathrm{nullity}(A)=n$, with rank = dim(col(A)) and nullity = dim(null(A)).\n",
    },
  },
  {
    slug: "invertible-det-nonzero-mcq",
    topic: "Pure Math",
    track: "researcher",
    title: "Invertibility and Determinant",
    prompt_md:
      "For a square matrix $A\\in\\mathbb{R}^{n\\times n}$, which statement is true?",
    solution_md:
      "$A$ is invertible iff $\\det(A)\\ne 0$.",
    answer_kind: "mcq",
    answer_value: "det-nonzero",
    answer_tolerance: null,
    difficulty: 1,
    tags: ["linear-algebra", "determinant"],
    source: "Core equivalence",
    target_roles: ["All"],
    answer_meta: {
      options: [
        { id: "det-nonzero", label: "$A$ is invertible iff $\\det(A)\\ne 0$.", correct: true },
        { id: "det-one", label: "$A$ is invertible iff $\\det(A)=1$.", correct: false },
        { id: "trace", label: "$A$ is invertible iff $\\mathrm{tr}(A)\\ne 0$.", correct: false },
        { id: "diag", label: "$A$ is invertible iff all diagonal entries are nonzero.", correct: false },
      ],
    },
  },
  {
    slug: "singular-values-eigenvalues-ata-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Singular Values and $A^\\top A$",
    prompt_md:
      "Let $A\\in\\mathbb{R}^{m\\times n}$. How are the singular values of $A$ related to the eigenvalues of $A^\\top A$?\n\nAnswer in 3–6 sentences.",
    solution_md:
      "The eigenvalues of $A^\\top A$ are nonnegative and equal to the squared singular values of $A$: if $\\lambda_i$ are eigenvalues of $A^\\top A$, then $\\sigma_i=\\sqrt{\\lambda_i}$ are the singular values (with appropriate multiplicities). This follows from the SVD $A=U\\Sigma V^\\top$, which gives $A^\\top A=V\\Sigma^2V^\\top$.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["linear-algebra", "svd"],
    source: "Core fact",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 75,
      rubric: [
        "States eigenvalues of $A^\\top A$ are squares of singular values: 70%",
        "Mentions nonnegativity and square-root relation $\\sigma_i=\\sqrt{\\lambda_i}$: 20%",
        "Optionally cites SVD $A^\\top A=V\\Sigma^2V^\\top$ (or equivalent): 10%",
      ],
      reference_solution_md:
        "If $A=U\\Sigma V^\\top$, then $A^\\top A=V\\Sigma^2V^\\top$. Thus eigenvalues of $A^\\top A$ are $\\sigma_i^2$ and singular values are $\\sigma_i=\\sqrt{\\lambda_i}$.\n",
    },
  },
  {
    slug: "gradient-least-squares-objective-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Gradient of Least Squares Objective",
    prompt_md:
      "Let $f(x)=\\|Ax-b\\|_2^2$ where $A\\in\\mathbb{R}^{m\\times n}$ and $b\\in\\mathbb{R}^m$.\n\nCompute $\\nabla_x f(x)$.",
    solution_md:
      "Expand $\\|Ax-b\\|^2=(Ax-b)^\\top(Ax-b)$. The gradient is\n\n$$\\nabla f(x)=2A^\\top(Ax-b).$$\n",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["calculus", "linear-algebra", "gradients"],
    source: "Matrix calculus staple",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 45,
      rubric: [
        "Gives the correct gradient direction $A^\\top(Ax-b)$: 70%",
        "Includes the factor 2 (or explains convention): 30%",
      ],
      reference_solution_md:
        "$$\\nabla_x\\|Ax-b\\|^2 = 2A^\\top(Ax-b).$$",
    },
  },
  {
    slug: "dual-norm-definition-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Dual Norm — Definition",
    prompt_md:
      "Define the dual norm $\\|\\cdot\\|_*$ associated with a norm $\\|\\cdot\\|$.\n\nAnswer in 3–6 sentences and include the maximization form.",
    solution_md:
      "The dual norm is\n\n$$\\|y\\|_* = \\max_{\\|x\\|\\le 1} y^\\top x.$$\n\nIt measures the largest inner product with a unit-norm vector under the primal norm. For example, the dual of $\\ell_2$ is $\\ell_2$, and the dual of $\\ell_1$ is $\\ell_\\infty$.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["optimization", "norms"],
    source: "Convex analysis staple",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 85,
      rubric: [
        "States the correct definition $\\|y\\|_* = \\max_{\\|x\\|\\le 1} y^\\top x$: 75%",
        "Explains interpretation as maximum inner product over unit ball: 15%",
        "Gives one correct dual-pair example (optional but strong): 10%",
      ],
      reference_solution_md:
        "Dual norm: $\\|y\\|_* = \\max_{\\|x\\|\\le 1} y^\\top x$ (support function of the unit ball). Examples: $(\\ell_2)^*=\\ell_2$, $(\\ell_1)^*=\\ell_\\infty$.\n",
    },
  },
  {
    slug: "norms-are-convex-mcq",
    topic: "Pure Math",
    track: "researcher",
    title: "Are Norms Convex?",
    prompt_md:
      "Which statement about norms is true?",
    solution_md:
      "Every norm is a convex function (triangle inequality implies convexity).",
    answer_kind: "mcq",
    answer_value: "convex",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["convexity", "norms"],
    source: "Convex analysis basic",
    target_roles: ["All"],
    answer_meta: {
      options: [
        { id: "convex", label: "Every norm is convex.", correct: true },
        { id: "concave", label: "Every norm is concave.", correct: false },
        { id: "linear", label: "Every norm is linear.", correct: false },
        { id: "nonconvex", label: "Most norms are non-convex except $\\ell_2$.", correct: false },
      ],
    },
  },
  {
    slug: "subgradient-absolute-value-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Subgradient of $|x|$",
    prompt_md:
      "Give the subgradient set (subdifferential) of $f(x)=|x|$.\n\nAnswer in 2–6 sentences.",
    solution_md:
      "For $x>0$, subgradient is {1}. For $x<0$, subgradient is {-1}. At $x=0$, the subdifferential is the interval $[-1,1]$.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["optimization", "subgradients"],
    source: "Convex analysis staple",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 55,
      rubric: [
        "Gives correct subgradient for x>0 (1) and x<0 (-1): 55%",
        "Gives correct subdifferential at 0 as interval [-1,1]: 45%",
      ],
      reference_solution_md:
        "$\\partial |x| = \\{1\\}$ if $x>0$, $\\{-1\\}$ if $x<0$, and $[-1,1]$ if $x=0$.\n",
    },
  },
  {
    slug: "eigenvalues-psd-nonnegative-mcq",
    topic: "Pure Math",
    track: "researcher",
    title: "Eigenvalues of PSD Matrices",
    prompt_md:
      "If $A$ is symmetric positive semidefinite ($A\\succeq 0$), what can you say about its eigenvalues?",
    solution_md:
      "All eigenvalues are nonnegative.",
    answer_kind: "mcq",
    answer_value: "nonnegative",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["linear-algebra", "psd", "eigenvalues"],
    source: "Core fact",
    target_roles: ["All"],
    answer_meta: {
      options: [
        { id: "nonnegative", label: "All eigenvalues are $\\ge 0$.", correct: true },
        { id: "positive", label: "All eigenvalues are $>0$.", correct: false },
        { id: "mixed", label: "Eigenvalues must have both signs.", correct: false },
        { id: "complex", label: "Eigenvalues must be complex.", correct: false },
      ],
    },
  },
  {
    slug: "projection-matrix-column-space-formula-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Projection onto Column Space: $P = A(A^\\top A)^{-1}A^\\top$",
    prompt_md:
      "Let $A\\in\\mathbb{R}^{m\\times n}$ have full column rank. What is the matrix $P$ for orthogonal projection onto the column space of $A$?\n\nAnswer in 2–5 sentences.",
    solution_md:
      "The orthogonal projector onto $\\mathrm{col}(A)$ is\n\n$$P=A(A^\\top A)^{-1}A^\\top.$$",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["linear-algebra", "projections"],
    source: "Least squares / projection identity",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 45,
      rubric: [
        "Gives the correct formula $P=A(A^\\top A)^{-1}A^\\top$: 80%",
        "Mentions the full column rank / invertibility condition for $A^\\top A$: 20%",
      ],
      reference_solution_md:
        "If $A$ has full column rank, projector onto $\\mathrm{col}(A)$ is $P=A(A^\\top A)^{-1}A^\\top$.\n",
    },
  },
  {
    slug: "condition-number-singular-values-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Condition Number via Singular Values",
    prompt_md:
      "For an invertible matrix $A$, express the 2-norm condition number $\\kappa_2(A)$ in terms of singular values.\n\nAnswer in 2–5 sentences.",
    solution_md:
      "In the 2-norm, $\\kappa_2(A)=\\|A\\|_2\\|A^{-1}\\|_2=\\sigma_{\\max}(A)/\\sigma_{\\min}(A)$, where $\\sigma_{\\min}$ is the smallest singular value (positive if invertible).",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["linear-algebra", "numerical", "svd"],
    source: "Numerical linear algebra core",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 55,
      rubric: [
        "States $\\kappa_2(A)=\\sigma_{\\max}/\\sigma_{\\min}$ correctly: 80%",
        "Notes invertibility implies $\\sigma_{\\min}>0$ (or equivalent): 20%",
      ],
      reference_solution_md:
        "$\\kappa_2(A)=\\sigma_{\\max}(A)/\\sigma_{\\min}(A)$ (2-norm). Invertible ⇒ $\\sigma_{\\min}>0$.\n",
    },
  },
  {
    slug: "second-order-optimality-conditions-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Second-Order Optimality Conditions (Unconstrained)",
    prompt_md:
      "State the usual first- and second-order conditions for a local minimum of a twice-differentiable function $f:\\mathbb{R}^n\\to\\mathbb{R}$.\n\nAnswer in 4–8 sentences and distinguish necessary vs sufficient.",
    solution_md:
      "At a local minimum $x^*$ of a differentiable $f$, a necessary condition is $\\nabla f(x^*)=0$. If $f$ is twice differentiable, a necessary condition is that the Hessian is PSD: $\\nabla^2 f(x^*)\\succeq 0$.\n\nA common sufficient condition for a strict local minimum is $\\nabla f(x^*)=0$ and $\\nabla^2 f(x^*)\\succ 0$ (positive definite).",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["optimization", "calculus", "hessian"],
    source: "Calculus/optimization core",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 95,
      rubric: [
        "States the first-order necessary condition $\\nabla f(x^*)=0$: 35%",
        "States Hessian PSD as a second-order necessary condition: 35%",
        "States PD Hessian as a sufficient condition for strict local minimum (with FOC): 30%",
      ],
      reference_solution_md:
        "Local min: necessary $\\nabla f(x^*)=0$; if $C^2$, necessary $\\nabla^2 f(x^*)\\succeq 0$. Sufficient (strict): $\\nabla f(x^*)=0$ and $\\nabla^2 f(x^*)\\succ 0$.\n",
    },
  },
  {
    slug: "operator-norm-definition-mcq",
    topic: "Pure Math",
    track: "researcher",
    title: "Operator (Induced) 2-Norm",
    prompt_md:
      "Which expression defines the induced (operator) 2-norm of a matrix $A$?",
    solution_md:
      "$\\|A\\|_2 = \\max_{\\|x\\|_2=1} \\|Ax\\|_2$.",
    answer_kind: "mcq",
    answer_value: "max-unit",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["linear-algebra", "norms"],
    source: "Core definition",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      options: [
        { id: "max-unit", label: "$\\|A\\|_2=\\max_{\\|x\\|_2=1}\\|Ax\\|_2$", correct: true },
        { id: "trace", label: "$\\|A\\|_2=\\mathrm{tr}(A)$", correct: false },
        { id: "det", label: "$\\|A\\|_2=|\\det(A)|$", correct: false },
        { id: "sum", label: "$\\|A\\|_2=\\sum_{i,j}|A_{ij}|$", correct: false },
      ],
    },
  },
  {
    slug: "spectral-norm-singular-value-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Spectral Norm and Largest Singular Value",
    prompt_md:
      "Show (informally) why $\\|A\\|_2 = \\sigma_{\\max}(A)$.\n\nAnswer in 4–8 sentences; you can use the SVD.",
    solution_md:
      "Let $A=U\\Sigma V^\\top$. For any unit vector $x$, write $x=V y$ with $\\|y\\|=1$. Then $\\|Ax\\|=\\|U\\Sigma y\\|=\\|\\Sigma y\\|$ because $U$ is orthogonal. The maximum of $\\|\\Sigma y\\|$ over unit $y$ is achieved by putting all mass on the largest diagonal entry, giving $\\sigma_{\\max}$. Hence $\\|A\\|_2=\\max_{\\|x\\|=1}\\|Ax\\|=\\sigma_{\\max}(A)$.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["linear-algebra", "svd", "norms"],
    source: "Numerical linear algebra core",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 95,
      rubric: [
        "Uses SVD $A=U\\Sigma V^\\top$ and orthogonality to reduce to maximizing $\\|\\Sigma y\\|$: 60%",
        "Argues the maximum occurs at the largest singular value direction: 30%",
        "Clearly states conclusion $\\|A\\|_2=\\sigma_{\\max}$: 10%",
      ],
      reference_solution_md:
        "With $A=U\\Sigma V^\\top$, $\\|Ax\\|=\\|\\Sigma y\\|$ for $x=Vy$. Max over unit $y$ is $\\sigma_{\\max}$, so $\\|A\\|_2=\\sigma_{\\max}(A)$.\n",
    },
  },
  {
    slug: "logdet-gradient-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Gradient of $\\log\\det(X)$",
    prompt_md:
      "Let $X$ be symmetric positive definite. What is the gradient of $f(X)=\\log\\det(X)$ with respect to $X$?\n\nAnswer in 2–5 sentences.",
    solution_md:
      "The differential identity is $d\\log\\det(X)=\\mathrm{tr}(X^{-1}dX)$. So the gradient is $\\nabla_X \\log\\det(X)=X^{-\\top}$, which equals $X^{-1}$ when $X$ is symmetric.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["matrix-calculus", "optimization"],
    source: "Matrix calculus staple",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 65,
      rubric: [
        "States gradient as $X^{-\\top}$ (or $X^{-1}$ in symmetric SPD case): 70%",
        "Mentions the trace differential identity $d\\log\\det(X)=\\mathrm{tr}(X^{-1}dX)$ (or equivalent): 30%",
      ],
      reference_solution_md:
        "$d\\log\\det(X)=\\mathrm{tr}(X^{-1}dX)$ so $\\nabla_X\\log\\det(X)=X^{-\\top}$ (=$X^{-1}$ if symmetric).\n",
    },
  },
  {
    slug: "eigenvalue-variational-characterization-mcq",
    topic: "Pure Math",
    track: "researcher",
    title: "Largest Eigenvalue (Variational Form)",
    prompt_md:
      "For a real symmetric matrix $A$, which variational characterization is correct for the largest eigenvalue?",
    solution_md:
      "$\\lambda_{\\max}(A)=\\max_{\\|x\\|_2=1} x^\\top A x$ (Rayleigh quotient).",
    answer_kind: "mcq",
    answer_value: "rayleigh",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["linear-algebra", "eigenvalues"],
    source: "Rayleigh quotient",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        { id: "rayleigh", label: "$\\lambda_{\\max}(A)=\\max_{\\|x\\|_2=1} x^\\top A x$", correct: true },
        { id: "min", label: "$\\lambda_{\\max}(A)=\\min_{\\|x\\|_2=1} x^\\top A x$", correct: false },
        { id: "trace", label: "$\\lambda_{\\max}(A)=\\mathrm{tr}(A)$", correct: false },
        { id: "det", label: "$\\lambda_{\\max}(A)=\\det(A)$", correct: false },
      ],
    },
  },
  {
    slug: "gerschgorin-disks-intuition-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Gershgorin Disks — What Do They Tell You?",
    prompt_md:
      "What does the Gershgorin circle theorem tell you about eigenvalues of a matrix?\n\nAnswer in 4–8 sentences (high level).",
    solution_md:
      "It provides regions in the complex plane that must contain all eigenvalues. Specifically, every eigenvalue lies in at least one Gershgorin disk centered at $A_{ii}$ with radius equal to the sum of absolute values of off-diagonal entries in that row (or column version). It’s a quick way to bound eigenvalue locations and reason about stability/diagonal dominance.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["linear-algebra", "eigenvalues", "bounds"],
    source: "Linear algebra / numerical methods",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 95,
      rubric: [
        "States the core claim: all eigenvalues lie in the union of Gershgorin disks: 55%",
        "Defines disk centers and radii correctly (center $A_{ii}$, radius sum of off-diagonal abs values): 35%",
        "Mentions a use-case (bounds/diagonal dominance/stability) without errors: 10%",
      ],
      reference_solution_md:
        "Gershgorin: every eigenvalue lies in at least one disk centered at $A_{ii}$ with radius $\\sum_{j\\ne i}|A_{ij}|$ (row form). Thus eigenvalues lie in union of these disks; useful for quick bounds/diagonal dominance.\n",
    },
  },
  {
    slug: "convex-set-definition-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Convex Set — Definition",
    prompt_md:
      "Define what it means for a set $C\\subseteq\\mathbb{R}^n$ to be convex.\n\nAnswer in 2–5 sentences.",
    solution_md:
      "A set $C$ is convex if for any $x,y\\in C$ and any $t\\in[0,1]$, the convex combination $tx+(1-t)y$ is also in $C$. Equivalently, the line segment between any two points in $C$ lies entirely in $C$.",
    answer_kind: "freeform",
    difficulty: 1,
    tags: ["convexity", "definitions"],
    source: "Optimization basics",
    target_roles: ["All"],
    answer_meta: {
      min_words: 45,
      rubric: [
        "States the convex-combination condition for all x,y in C and t in [0,1]: 80%",
        "Optionally notes the line-segment interpretation: 20%",
      ],
      reference_solution_md:
        "Convex set: for all $x,y\\in C$ and $t\\in[0,1]$, $tx+(1-t)y\\in C$ (line segment stays in C).\n",
    },
  },
  {
    slug: "projection-onto-convex-set-property-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Projection onto a Convex Set — Key Property",
    prompt_md:
      "Let $C$ be a nonempty closed convex set and let $p=\\Pi_C(x)$ be the Euclidean projection of $x$ onto $C$.\n\nState one key characterization/property of $p$ that is often used in proofs (a variational inequality is fine).",
    solution_md:
      "A key characterization is: for all $y\\in C$,\n\n$$(x-p)^\\top (y-p)\\le 0.$$\n\nEquivalently, the projection error $x-p$ defines a supporting hyperplane at $p$; the residual points outward and forms an obtuse angle with any feasible direction in $C$.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["optimization", "projections", "convexity"],
    source: "Convex analysis staple",
    target_roles: ["Researcher"],
    answer_meta: {
      min_words: 105,
      rubric: [
        "States a correct variational inequality / optimality condition like $(x-p)^\\top(y-p)\\le 0$ for all $y\\in C$: 75%",
        "Mentions assumptions needed (closed convex set; Euclidean projection well-defined): 15%",
        "Gives geometric interpretation (supporting hyperplane / obtuse angle) correctly: 10%",
      ],
      reference_solution_md:
        "If $p=\\Pi_C(x)$ for closed convex $C$, then $(x-p)^T(y-p)\\le 0$ for all $y\\in C$ (projection residual defines supporting hyperplane).\n",
    },
  },
  {
    slug: "l1-linfty-duality-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "$\\ell_1$ and $\\ell_\\infty$ Duality",
    prompt_md:
      "Show (informally) that the dual norm of $\\|\\cdot\\|_1$ is $\\|\\cdot\\|_\\infty$.\n\nIn 5–10 sentences: write the max-over-unit-ball definition and the key inequality step.",
    solution_md:
      "By definition, $\\|y\\|_* = \\max_{\\|x\\|_1\\le 1} y^\\top x$. For any $x$ with $\\|x\\|_1\\le 1$, we have\n\n$$y^\\top x \\le \\sum_i |y_i||x_i| \\le \\|y\\|_\\infty \\sum_i |x_i| = \\|y\\|_\\infty\\|x\\|_1 \\le \\|y\\|_\\infty.$$\n\nThis shows the maximum is at most $\\|y\\|_\\infty$. Achieve equality by choosing $x$ concentrated on an index where $|y_i|=\\|y\\|_\\infty$ with matching sign. Hence the dual of $\\ell_1$ is $\\ell_\\infty$.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["optimization", "norms", "inequalities"],
    source: "Convex analysis staple",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 130,
      rubric: [
        "Uses the max definition $\\max_{\\|x\\|_1\\le 1} y^\\top x$: 25%",
        "Upper-bounds $y^\\top x$ by $\\|y\\|_\\infty\\|x\\|_1$ (key inequality step): 45%",
        "Shows achievability by choosing x on an argmax coordinate with correct sign: 30%",
      ],
      reference_solution_md:
        "$\\|y\\|_* = \\max_{\\|x\\|_1\\le 1} y^Tx \\le \\max_{\\|x\\|_1\\le 1} \\|y\\|_\\infty\\|x\\|_1 \\le \\|y\\|_\\infty$, and equality by choosing $x$ supported on an argmax coordinate.\n",
    },
  },
  {
    slug: "smooth-strongly-convex-rates-mcq",
    topic: "Pure Math",
    track: "researcher",
    title: "Smooth + Strongly Convex — What Happens?",
    prompt_md:
      "If $f$ is $\\mu$-strongly convex and $L$-smooth, which statement is most accurate about its minimizer and conditioning?",
    solution_md:
      "Such a function has a unique minimizer, and the ratio $L/\\mu$ is a condition-number-like quantity that governs optimization difficulty (e.g., gradient descent rates).",
    answer_kind: "mcq",
    answer_value: "unique-and-conditioned",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["optimization", "convexity"],
    source: "Optimization basics",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      options: [
        {
          id: "unique-and-conditioned",
          label:
            "It has a unique minimizer, and $L/\\mu$ behaves like a condition number that affects first-order method convergence rates.",
          correct: true,
        },
        { id: "many-min", label: "It always has infinitely many minimizers.", correct: false },
        { id: "nonconvex", label: "It must be non-convex.", correct: false },
        { id: "no-implication", label: "Strong convexity and smoothness imply nothing useful.", correct: false },
      ],
    },
  },
  {
    slug: "quadratic-strong-convexity-example-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Quadratic Example: Strong Convexity Parameter",
    prompt_md:
      "Let $f(x)=\\frac{1}{2}x^\\top A x$ with symmetric $A\\succ 0$.\n\nWhat is the strong convexity parameter $\\mu$ in terms of eigenvalues of $A$? (You can assume the Euclidean norm.)",
    solution_md:
      "For a quadratic, the Hessian is constant: $\\nabla^2 f(x)=A$. Strong convexity parameter is the minimum eigenvalue: $\\mu=\\lambda_{\\min}(A)$ (and smoothness constant $L=\\lambda_{\\max}(A)$).",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["optimization", "linear-algebra", "eigenvalues"],
    source: "Optimization core",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 75,
      rubric: [
        "Identifies the Hessian as $A$ (or 1/2 factors handled correctly): 35%",
        "States $\\mu=\\lambda_{\\min}(A)$ correctly: 55%",
        "Optionally mentions $L=\\lambda_{\\max}(A)$ (bonus but not required): 10%",
      ],
      reference_solution_md:
        "For $f(x)=\\tfrac12 x^TAx$ with SPD $A$, Hessian is $A$. Thus strong convexity parameter is $\\mu=\\lambda_{\\min}(A)$ (and $L=\\lambda_{\\max}(A)$).\n",
    },
  },
  {
    slug: "matrix-vectorization-trace-identity-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Trace Identity: $x^\\top A x = \\mathrm{tr}(Axx^\\top)$",
    prompt_md:
      "Show the identity $x^\\top A x = \\mathrm{tr}(Axx^\\top)$.\n\nAnswer in 2–6 sentences.",
    solution_md:
      "Use cyclic invariance of trace:\n\n$$\\mathrm{tr}(Axx^\\top)=\\mathrm{tr}(x^\\top A x)=x^\\top A x,$$\n\nsince $x^\\top A x$ is a 1×1 matrix and trace of a scalar is itself.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["linear-algebra", "trace"],
    source: "Matrix calculus staple",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 65,
      rubric: [
        "Uses trace cyclic property to rewrite $\\mathrm{tr}(Axx^\\top)$ as $\\mathrm{tr}(x^\\top A x)$: 60%",
        "Notes $x^\\top A x$ is scalar so trace equals itself: 40%",
      ],
      reference_solution_md:
        "$\\mathrm{tr}(Axx^\\top)=\\mathrm{tr}(x^\\top A x)=x^\\top A x$ since scalar trace is itself.\n",
    },
  },
  {
    slug: "woodbury-matrix-identity-freeform",
    topic: "Pure Math",
    track: "researcher",
    title: "Woodbury Matrix Identity",
    prompt_md:
      "State the Woodbury matrix identity.\n\nGive an expression for $(A+UCV)^{-1}$ in terms of $A^{-1}$, assuming dimensions match and inverses exist.",
    solution_md:
      "Woodbury:\n\n$$(A+UCV)^{-1}=A^{-1}-A^{-1}U\\,(C^{-1}+VA^{-1}U)^{-1}\\,VA^{-1}.$$",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["linear-algebra", "matrix-inverse", "numerical"],
    source: "Matrix identities staple",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      min_words: 70,
      rubric: [
        "Writes the correct Woodbury identity structure (A^{-1} - A^{-1}U(...)^{-1}VA^{-1}): 75%",
        "Has the correct middle term $(C^{-1}+VA^{-1}U)^{-1}$ (order matters): 25%",
      ],
      reference_solution_md:
        "$$(A+UCV)^{-1}=A^{-1}-A^{-1}U(C^{-1}+VA^{-1}U)^{-1}VA^{-1}.$$",
    },
  },
  {
    slug: "matrix-determinant-lemma-mcq",
    topic: "Pure Math",
    track: "researcher",
    title: "Matrix Determinant Lemma (Rank-1 Case)",
    prompt_md:
      "Which identity is correct for an invertible square matrix $A$ and vectors $u,v$ (dimensions match)?",
    solution_md:
      "Matrix determinant lemma: $\\det(A+uv^\\top)=\\det(A)\\,(1+v^\\top A^{-1}u)$.",
    answer_kind: "mcq",
    answer_value: "det-lemma",
    answer_tolerance: null,
    difficulty: 4,
    tags: ["linear-algebra", "determinant", "identities"],
    source: "Matrix identities staple",
    target_roles: ["Researcher", "Dev"],
    answer_meta: {
      options: [
        {
          id: "det-lemma",
          label: "$\\det(A+uv^\\top)=\\det(A)\\,(1+v^\\top A^{-1}u)$",
          correct: true,
        },
        { id: "det-add", label: "$\\det(A+uv^\\top)=\\det(A)+\\det(uv^\\top)$", correct: false },
        { id: "det-mult", label: "$\\det(A+uv^\\top)=\\det(A)\\,\\det(uv^\\top)$", correct: false },
        { id: "det-trace", label: "$\\det(A+uv^\\top)=\\det(A)\\,\\mathrm{tr}(uv^\\top)$", correct: false },
      ],
    },
  },
  {
    slug: "projection-matrix-eigenvalues-mcq",
    topic: "Pure Math",
    track: "researcher",
    title: "Eigenvalues of an Orthogonal Projector",
    prompt_md:
      "If $P$ is an orthogonal projection matrix (i.e., $P^2=P$ and $P^\\top=P$), what are its eigenvalues?",
    solution_md:
      "Eigenvalues are only 0 or 1 (idempotent).",
    answer_kind: "mcq",
    answer_value: "0-1",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["linear-algebra", "projections", "eigenvalues"],
    source: "Core fact",
    target_roles: ["Researcher"],
    answer_meta: {
      options: [
        { id: "0-1", label: "All eigenvalues are in {0, 1}.", correct: true },
        { id: "any", label: "Eigenvalues can be any real numbers.", correct: false },
        { id: "pm1", label: "All eigenvalues are in {−1, 1}.", correct: false },
        { id: "complex", label: "Eigenvalues must be complex.", correct: false },
      ],
    },
  },
];
