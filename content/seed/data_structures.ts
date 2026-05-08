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
  {
    slug: "vector-iterator-invalidation-mcq",
    topic: "Data Structures",
    title: "Vector Iterator Invalidation on `push_back`",
    prompt_md:
      "In C++:\n\n```cpp\nstd::vector<int> v = {1,2,3};\nauto it = v.begin();\nv.push_back(4);\nstd::cout << *it;\n```\n\nWhat is the correct statement?",
    solution_md:
      "`push_back` may reallocate the underlying buffer, which invalidates all iterators, pointers, and references to elements. Dereferencing `it` after a reallocation is undefined behavior. If capacity was sufficient, it would still be valid — but you can't rely on that without managing capacity (e.g. `reserve`).",
    answer_kind: "mcq",
    answer_value: "ub",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["c++", "ub", "iterators"],
    companies: ["HRT", "Jane Street"],
    source: "C++ container rules",
    answer_meta: {
      options: [
        { id: "prints-1", label: "Always prints `1`", correct: false },
        { id: "prints-1-most", label: "Prints `1` on most compilers, so it's fine", correct: false },
        { id: "ub", label: "Undefined behavior (iterator may be invalidated)", correct: true },
        { id: "compile-error", label: "Does not compile", correct: false },
      ],
    },
  },
  {
    slug: "unordered-map-rehash-latency-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "`unordered_map` Rehash Spikes in Low-Latency Code",
    prompt_md:
      "Why can `std::unordered_map` cause latency spikes in production systems? Name two mitigations you would use in a low-latency service.",
    solution_md:
      "`unordered_map` periodically rehashes (allocates a bigger bucket array and reinserts/moves elements), which can take a long time and allocate memory. Hashing itself can also be expensive and collisions can degrade performance. Mitigations: call `reserve()`/`rehash()` up front based on expected size, use an allocator/pool, pick a cache-friendly hashmap (flat/robin-hood) and avoid rehashing in the hot path, or use a sorted vector for small N.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["hashmap", "performance", "allocations"],
    companies: ["Jump Trading", "Citadel"],
    source: "Low-latency engineering",
    answer_meta: {
      rubric: [
        "Mentions rehashing (resize + reinsert) as the spike source",
        "Mentions allocations / memory churn as part of the problem",
        "Provides two mitigations (reserve/rehash, custom allocator/pool, alternative container, avoid growth in hot path)",
      ],
      min_words: 50,
      reference_solution_md:
        "`unordered_map` can rehash, allocating a new bucket array and moving/reinserting entries, causing long pauses and allocator contention. Mitigate by `reserve()`/`rehash()` up front, using a pool allocator, or switching to a flat hash map / sorted vector when appropriate.",
    },
  },
];
