import type { SeedQuestion } from "@/content/question-types";

/**
 * Data Structures — one MCQ on amortized cost to round out the v1 MCQ
 * inventory across topics. More to follow.
 */
export const DATA_STRUCTURES_SEED: SeedQuestion[] = [
  {
    slug: "dynamic-array-amortized-mcq",
    topic: "Data Structures",
    title: "Amortized Cost of Dynamic Array Push",
    prompt_md:
      "Consider a dynamic array (like C++'s `std::vector` or Python's `list`) that doubles its underlying buffer on every reallocation. What is the amortized time complexity of a single `push_back` / `append`?",
    solution_md:
      "When you double on overflow, the cost of all reallocations across $n$ pushes is bounded by $O(n)$ via the geometric series. Dividing by $n$ pushes gives $O(1)$ amortized cost per push, even though individual operations occasionally take $O(n)$.",
    answer_kind: "mcq",
    answer_value: "amortized-1",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["amortized-analysis", "complexity", "theorem-recall"],
    companies: ["Jane Street"],
    source: "CLRS-style MCQ",
    answer_meta: {
      options: [
        { id: "constant", label: "$O(1)$ worst-case", correct: false },
        { id: "amortized-1", label: "$O(1)$ amortized, $O(n)$ worst-case", correct: true },
        { id: "logn", label: "$O(\\log n)$ amortized", correct: false },
        { id: "linear", label: "$O(n)$ amortized", correct: false },
      ],
    },
  },
];
