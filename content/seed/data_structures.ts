import type { SeedQuestion } from "@/content/question-types";

/**
 * Data Structures — one MCQ on amortized cost to round out the v1 MCQ
 * inventory across topics. More to follow.
 */
export const DATA_STRUCTURES_SEED: SeedQuestion[] = [
  {
    slug: "dynamic-array-amortized-mcq",
    topic: "Data Structures",
    track: "dev",
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
    target_roles: ["Dev"],
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
    track: "dev",
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
    target_roles: ["Dev"],
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
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 85,
      rubric: [
        "Mentions rehashing (resize + reinsertion/moves) as the spike source: 45%",
        "Mentions allocations / memory churn / allocator contention as part of the problem: 25%",
        "Provides at least two concrete mitigations (reserve/rehash up front, pool/pmr allocator, flat hash map, avoid growth in hot path): 30%",
      ],
      reference_solution_md:
        "`unordered_map` can rehash, allocating a new bucket array and moving/reinserting entries, causing long pauses and allocator contention. Mitigate by `reserve()`/`rehash()` up front, using a pool allocator, or switching to a flat hash map / sorted vector when appropriate.",
    },
  },
  {
    slug: "btree-vs-rbtree-cache-locality-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "B-Tree vs Red–Black Tree (Cache Locality)",
    prompt_md:
      "Why can a B-tree (or B+tree) outperform a red–black tree for ordered maps in practice, even though both are $O(\\log n)$?\n\nAnswer in 6–10 sentences and mention cache lines and pointer chasing.",
    solution_md:
      "RB-trees are pointer-heavy: each node is a separate allocation, and traversals chase pointers across memory, causing many cache misses and branch mispredicts. A B-tree stores many keys per node (high branching factor), so each level does more work per cache line; this reduces height and the number of cache misses.\n\nB-trees can also pack nodes into contiguous memory, improving prefetching and locality. The asymptotic complexity matches, but constants and memory behavior dominate.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["trees", "cache", "performance"],
    source: "Systems + DS performance staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 110,
      rubric: [
        "Mentions pointer chasing / many allocations in RB-tree causing cache misses: 45%",
        "Mentions B-tree high fanout reduces height and uses cache lines effectively: 35%",
        "Mentions practical CPU effects (branch mispredicts, prefetching, contiguous nodes): 20%",
      ],
      reference_solution_md:
        "RB-trees chase pointers across allocations → cache misses/mispredicts. B-trees pack many keys per node (high fanout) → fewer levels and better cache-line utilization; constants dominate.\n",
    },
  },
  {
    slug: "open-addressing-vs-chaining-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "Hash Tables: Open Addressing vs Chaining",
    prompt_md:
      "Compare open addressing and separate chaining hash tables.\n\nIn 6–10 sentences: mention memory layout/cache effects, deletion complexity, and load-factor behavior.",
    solution_md:
      "Open addressing stores entries in an array and resolves collisions by probing, which can be cache-friendly and avoid pointer allocations; but performance degrades sharply as load factor increases and deletions require tombstones or rehashing. Chaining stores buckets with linked lists or small vectors; it tolerates higher load factors and deletions are simpler, but it can involve pointer chasing and extra allocations.\n\nMany high-performance hash maps use open addressing with robin-hood probing to improve clustering behavior.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["hashmap", "performance"],
    source: "DS implementation tradeoffs",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "Correctly contrasts memory layout/cache behavior (array probing vs pointers/allocations): 45%",
        "Mentions deletion complexity (tombstones vs easy removal) and load-factor sensitivity: 40%",
        "Mentions at least one practical refinement (robin-hood, small-vector buckets, resizing strategy): 15%",
      ],
      reference_solution_md:
        "Open addressing: array + probing (cache-friendly) but load-factor sensitive; deletes need tombstones. Chaining: buckets of lists/vectors (simpler deletes, higher load ok) but more pointer chasing/allocs.\n",
    },
  },
  {
    slug: "intrusive-list-what-why-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "Intrusive Lists — Why Use Them?",
    prompt_md:
      "What is an intrusive list, and why might you use it in low-latency C++ code?\n\nAnswer in 6–10 sentences and mention allocations and object lifetime.",
    solution_md:
      "An intrusive list stores the linkage (next/prev pointers) inside the elements themselves rather than in external node allocations. This avoids per-node allocations and can improve locality and predictability, which is useful in low-latency systems.\n\nTradeoffs: an object can typically be in only one list per linkage field, and you must manage lifetime carefully (removing before destruction) to avoid dangling links.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["c++", "lists", "performance"],
    source: "Low-latency engineering",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 110,
      rubric: [
        "Defines intrusive list as storing linkage inside the object (no separate node allocation): 45%",
        "Explains why this helps (fewer allocations, better predictability/locality): 35%",
        "Mentions tradeoffs (lifetime discipline; single membership per hook; coupling): 20%",
      ],
      reference_solution_md:
        "Intrusive list: next/prev pointers live in the element, avoiding node allocations. Helps latency/predictability. Tradeoffs: lifetime discipline and limited multi-list membership per hook.\n",
    },
  },
  {
    slug: "arena-allocator-why-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "Arena/Pool Allocator — Why It Helps",
    prompt_md:
      "Why can an arena/pool allocator dramatically improve performance for certain data structures?\n\nAnswer in 6–10 sentences and mention fragmentation and allocation patterns.",
    solution_md:
      "General-purpose allocators handle many sizes and lifetimes, which can create fragmentation and contention, and each allocation has metadata overhead. For DS workloads that allocate many similar-sized nodes (trees, hash nodes) or have phase-based lifetimes, an arena/pool can allocate from contiguous blocks, making allocation O(1) and improving locality.\n\nIt also enables bulk free (reset arena) and reduces tail latency by avoiding slow-path allocator work.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["allocators", "performance", "memory"],
    source: "Systems/DS performance staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "Explains allocator overhead/fragmentation/contestion as the baseline problem: 40%",
        "Explains why pool/arena helps (O(1) bump allocation, locality, bulk free): 45%",
        "Mentions tradeoff/constraint (lifetime coupling, cannot free individual nodes easily): 15%",
      ],
      reference_solution_md:
        "Arenas/pools reduce allocator overhead/fragmentation by allocating contiguous blocks (fast bump alloc), improving locality and enabling bulk free; tradeoff is lifetime coupling/less flexible frees.\n",
    },
  },
  {
    slug: "ring-buffer-spsc-why-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "SPSC Ring Buffer — Why It's Fast",
    prompt_md:
      "Why is a single-producer single-consumer (SPSC) ring buffer often faster than a mutex-protected queue?\n\nAnswer in 6–10 sentences and mention contention and cache behavior.",
    solution_md:
      "With exactly one producer and one consumer, you can avoid locks because each side owns its own index (head/tail) and updates it independently; with correct memory ordering, you get wait-free-ish behavior in the steady state. This eliminates mutex contention, context switches, and kernel involvement.\n\nA ring buffer is also contiguous memory, improving cache locality and prefetching. Care is still needed to avoid false sharing by separating head/tail onto different cache lines.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["queues", "lock-free", "cache"],
    source: "Low-latency engineering staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "Mentions SPSC ownership pattern enabling lock-free indices (head/tail owned by different threads): 45%",
        "Mentions avoiding mutex costs (contention/context switches/kernel) as key perf win: 35%",
        "Mentions cache/locality and/or false sharing considerations: 20%",
      ],
      reference_solution_md:
        "SPSC ring buffers can avoid locks because producer/consumer own different indices; avoids mutex contention/switches. Contiguous memory improves cache locality; pad indices to avoid false sharing.\n",
    },
  },
];
