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
  {
    slug: "hashmap-load-factor-latency-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "Hash Map Load Factor and Tail Latency",
    prompt_md:
      "Why does hash-map performance (especially tail latency) often degrade sharply as load factor approaches 1 for open-addressing maps?\n\nAnswer in 6–10 sentences and mention probe lengths and clustering.",
    solution_md:
      "In open addressing, collisions are resolved by probing sequences. As load factor increases, empty slots become rarer, so probe sequences get longer on average and, more importantly, their distribution develops a heavy tail. Clustering (primary/secondary) amplifies this: one collision can create runs of occupied slots that make later probes even longer.\n\nThis increases variance and tail latency for lookups/inserts, even if average remains acceptable at moderate load. Mitigation: keep load factor lower, use robin-hood probing, periodic rehashing, or use chaining/flat maps with good resizing policies.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["hashmap", "performance", "tail-latency"],
    source: "DS performance staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 140,
      rubric: [
        "Explains higher load factor increases expected probe length and creates heavy-tail probe distributions: 50%",
        "Mentions clustering effect as a key reason performance degrades: 30%",
        "Mentions at least one mitigation (lower LF, robin-hood, rehash, chaining): 20%",
      ],
      reference_solution_md:
        "Open addressing relies on probing; as load factor nears 1, empty slots are rare so probe lengths grow and get heavy-tailed. Clustering worsens it, hurting tail latency. Mitigate by keeping LF lower, using robin-hood/rehash policies, or switching designs.\n",
    },
  },
  {
    slug: "robin-hood-hashing-why-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "Robin Hood Hashing — Why It Helps",
    prompt_md:
      "What is robin-hood hashing, and why can it improve tail latency compared to naive linear probing?\n\nAnswer in 6–10 sentences.",
    solution_md:
      "Robin-hood hashing is an open-addressing strategy where, during insertion, if the new key has probed farther from its ideal bucket than the existing key in the slot, they swap. Intuitively, it “steals” from keys that are close to home to help keys that are far.\n\nThis tends to equalize probe lengths, reducing variance and improving worst-case/tail behavior for successful lookups. Tradeoffs include slightly more work on insertion and more complex deletion handling.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["hashmap", "performance"],
    source: "High-performance hash map design",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 145,
      rubric: [
        "Defines robin-hood idea (swap based on probe distance; equalize distances): 55%",
        "Explains why it helps (reduces variance / tail probe lengths): 30%",
        "Mentions at least one tradeoff (insert work, deletion complexity/tombstones): 15%",
      ],
      reference_solution_md:
        "Robin-hood hashing swaps entries during insert when the newcomer has larger probe distance, equalizing probe lengths. This reduces variance and improves tail/worst-case successful lookup. Tradeoffs: more insert work and tricky deletions.\n",
    },
  },
  {
    slug: "skip-list-why-use-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "Skip List — Why Use It Instead of a Balanced Tree?",
    prompt_md:
      "What is a skip list and why might you choose it over a balanced BST for an ordered map?\n\nAnswer in 6–10 sentences and mention implementation simplicity and concurrency.",
    solution_md:
      "A skip list is a layered linked-list structure where higher levels “skip” over many elements, giving expected O(log n) search/insert/delete. It’s often simpler to implement than a red-black tree and can have good practical performance.\n\nSkip lists can also be friendlier to concurrent implementations because updates are local pointer changes and you can design lock-free variants more naturally than many tree rotations. Downsides include extra pointers, probabilistic balancing, and potentially worse cache locality than B-trees.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["ordered-map", "probabilistic", "concurrency"],
    source: "DS design tradeoff",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 145,
      rubric: [
        "Defines skip list at a high level and its expected O(log n) behavior: 45%",
        "Gives a reason to choose it (implementation simplicity and/or concurrency friendliness): 35%",
        "Mentions at least one downside (extra pointers, probabilistic, cache locality): 20%",
      ],
      reference_solution_md:
        "Skip list: layered lists with random levels; expected O(log n). Often simpler than RB-trees and can be more concurrency-friendly. Downsides: extra pointers, probabilistic balancing, and potentially worse locality than B-trees.\n",
    },
  },
  {
    slug: "bloom-filter-what-why-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "Bloom Filter — When It’s Useful",
    prompt_md:
      "What is a Bloom filter, and when is it useful in systems?\n\nAnswer in 6–10 sentences and mention false positives vs false negatives.",
    solution_md:
      "A Bloom filter is a space-efficient probabilistic set membership structure implemented with a bit array and multiple hash functions. It can tell you if an element is “definitely not in the set” or “maybe in the set.” It has false positives but no false negatives (assuming no deletions).\n\nIt’s useful as a front-door filter to avoid expensive lookups (disk/DB/cache misses) or to reduce network requests. Tradeoffs include choosing bit array size/hash count and inability to remove items without variants like counting Bloom filters.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["probabilistic-data-structures", "performance"],
    source: "Systems staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 140,
      rubric: [
        "Defines Bloom filter and its query semantics (definitely-no / maybe-yes): 45%",
        "States false positives allowed and (standard) no false negatives: 35%",
        "Gives a correct systems use case (avoid expensive lookups) and one tradeoff: 20%",
      ],
      reference_solution_md:
        "Bloom filter: bitset + hashes for probabilistic membership; returns definitely-not or maybe. False positives possible; no false negatives (without deletions). Used to avoid expensive lookups (DB/disk/network). Tradeoffs: sizing/hashes and deletions require variants.\n",
    },
  },
  {
    slug: "lru-cache-implementation-gotchas-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "LRU Cache Internals and Gotchas",
    prompt_md:
      "How is an LRU cache typically implemented, and what is one common gotcha in production use?\n\nAnswer in 6–10 sentences and mention hash map + linked list.",
    solution_md:
      "A classic LRU uses a hash map from key → node pointer and a doubly-linked list ordered by recency. On get/put, you move the node to the front; eviction removes from the back. This gives O(1) expected operations.\n\nGotchas: concurrency (needing locks around both structures), memory overhead and pointer chasing from the list, and \"thundering herd\" invalidations when many keys churn. Some systems prefer approximate LRU (CLOCK) or segmented LRU to reduce overhead.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cache", "hashmap", "linked-list"],
    source: "Systems design staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 145,
      rubric: [
        "Describes the standard implementation (hash map + doubly linked list with move-to-front; evict from back): 55%",
        "Mentions why it is O(1) expected and the two-structure coupling: 15%",
        "Mentions a real gotcha (concurrency, overhead/pointer chasing, churn) and a plausible alternative (CLOCK/approx): 30%",
      ],
      reference_solution_md:
        "LRU is usually hashmap key→node + doubly linked list by recency; move-to-front on access, evict from tail. Gotchas include concurrency (must keep structures consistent) and pointer-chasing overhead; many systems use approximate policies like CLOCK/segmented LRU.\n",
    },
  },
  {
    slug: "small-vector-optimization-why-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "Small-Vector Optimization (Store Small N Inline)",
    prompt_md:
      "Why can a “small vector” (vector with inline storage for small sizes) improve latency in practice?\n\nAnswer in 6–10 sentences and mention allocations and locality.",
    solution_md:
      "For many workloads, most vectors are small. If a container stores the first K elements inline inside the object, it avoids heap allocations for those common cases, reducing allocator overhead and tail-latency spikes.\n\nInline storage also improves locality (data near the object) and can reduce pointer chasing. Tradeoffs: larger object size, copying/moving cost for the larger inline buffer, and a threshold where it spills to heap.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["performance", "allocations", "locality"],
    source: "Low-latency DS pattern",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 140,
      rubric: [
        "Explains avoiding heap allocations for common small sizes reduces latency/tails: 50%",
        "Mentions locality benefits (inline near object) and fewer indirections: 25%",
        "Mentions at least one tradeoff (larger objects; copy/move cost; spill threshold): 25%",
      ],
      reference_solution_md:
        "Small-vector stores first K elements inline, avoiding heap allocations for typical small sizes → lower tail latency. Inline improves locality. Tradeoffs: larger object size and higher copy/move cost; spills to heap past threshold.\n",
    },
  },
  {
    slug: "soa-vs-aos-cache-locality-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "AoS vs SoA (Layout for Cache/Vectorization)",
    prompt_md:
      "Compare Array-of-Structs (AoS) vs Struct-of-Arrays (SoA). When does SoA win?\n\nAnswer in 6–10 sentences and mention cache lines / SIMD.",
    solution_md:
      "AoS stores records contiguously (struct per element), which is convenient when you use most fields together. SoA stores each field in its own array, which can be better when you process one or a few fields over many elements because it improves cache utilization and enables SIMD/vectorization with contiguous loads.\n\nSoA can reduce wasted bandwidth fetching unused fields and can improve prefetching. Downsides: less ergonomic APIs and worse locality if you frequently need all fields of an element together.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["memory-layout", "performance", "simd"],
    source: "Performance engineering staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 150,
      rubric: [
        "Defines AoS vs SoA layout correctly: 35%",
        "Explains when SoA wins (process few fields across many items; cache bandwidth; SIMD): 45%",
        "Mentions tradeoff where AoS is better (need all fields together; ergonomics): 20%",
      ],
      reference_solution_md:
        "AoS: struct per element; good when you use many fields together. SoA: separate arrays per field; wins when streaming one/few fields over many items (better cache bandwidth and SIMD). Tradeoff: harder APIs and worse locality when needing all fields of a record.\n",
    },
  },
  {
    slug: "bloom-filter-fpr-tradeoff-mcq",
    topic: "Data Structures",
    track: "dev",
    title: "Bloom Filters — What’s the Tradeoff?",
    prompt_md:
      "Which statement about a standard Bloom filter (without deletions) is correct?",
    solution_md:
      "Bloom filters can have false positives (say “maybe present” when absent) but do not have false negatives (won’t say “absent” when present), assuming correct implementation.",
    answer_kind: "mcq",
    answer_value: "fp-only",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["probabilistic-data-structures"],
    source: "Systems staple",
    target_roles: ["Dev"],
    answer_meta: {
      options: [
        { id: "fp-only", label: "False positives possible; false negatives not (without deletions).", correct: true },
        { id: "fn-only", label: "False negatives possible; false positives not.", correct: false },
        { id: "both", label: "Both false positives and false negatives are possible.", correct: false },
        { id: "neither", label: "Neither false positives nor false negatives are possible.", correct: false },
      ],
    },
  },
  {
    slug: "counting-bloom-filter-why-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "Counting Bloom Filter — Why It Exists",
    prompt_md:
      "Why does a counting Bloom filter exist, and what tradeoff does it introduce compared to a standard Bloom filter?\n\nAnswer in 6–10 sentences.",
    solution_md:
      "A standard Bloom filter doesn’t support deletions safely: clearing bits may remove evidence for other keys that also set those bits. A counting Bloom filter replaces the bit array with small counters, so inserts increment and deletes decrement; a bit is treated as set when the counter is > 0.\n\nTradeoffs: more memory (counters instead of bits), counter overflow considerations, and potentially more CPU per update.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["probabilistic-data-structures", "tradeoffs"],
    source: "Systems staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 145,
      rubric: [
        "States standard Bloom filter cannot delete safely due to shared bits among keys: 50%",
        "Explains counting variant uses counters to support deletions correctly: 35%",
        "Mentions a tradeoff (memory, overflow, CPU) clearly: 15%",
      ],
      reference_solution_md:
        "Standard Bloom filters don’t support deletion because bits are shared across keys. Counting Bloom filters use counters to allow decrement on delete. Tradeoff: more memory and some added CPU/overflow concerns.\n",
    },
  },
  {
    slug: "xor-filter-why-interesting-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "Xor Filters vs Bloom Filters (High Level)",
    prompt_md:
      "At a high level, what is an xor filter and why might systems use it instead of a Bloom filter?\n\nAnswer in 6–10 sentences. Keep it conceptual (no need for construction details).",
    solution_md:
      "An xor filter is a probabilistic membership structure like a Bloom filter but can be more space-efficient and faster to query in some designs. It typically uses a small number of array lookups and XOR operations, which can be cache-friendly.\n\nSystems may choose it for better space/lookup tradeoffs at a target false-positive rate. Like Bloom filters, it generally provides “maybe present” vs “definitely not” semantics, with false positives but no false negatives for membership queries (given correct build assumptions).",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["probabilistic-data-structures", "performance"],
    source: "Modern systems DS",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 145,
      rubric: [
        "Identifies xor filter as probabilistic membership (definitely-not / maybe) structure: 40%",
        "Mentions why it can be attractive (space efficiency and/or faster queries via few cache-friendly lookups): 40%",
        "Mentions false-positive/no-false-negative membership semantics appropriately (no overclaiming about deletions/build): 20%",
      ],
      reference_solution_md:
        "Xor filters are probabilistic membership structures like Bloom filters. They can be more space-efficient and fast to query (few cache-friendly lookups + XOR). They provide definitely-not vs maybe-present semantics with false positives but no false negatives for membership queries under standard assumptions.\n",
    },
  },
  {
    slug: "perfect-hashing-when-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "Perfect Hashing — When Would You Use It?",
    prompt_md:
      "What is (minimal) perfect hashing, and when would you prefer it over a normal hash map?\n\nAnswer in 6–10 sentences and mention static sets and memory.",
    solution_md:
      "Perfect hashing constructs a hash function for a fixed set of keys that avoids collisions; a minimal perfect hash maps N keys to exactly 0..N-1. It’s useful when the key set is static or changes rarely (compile-time tables, routing tables, keyword sets) and you want predictable O(1) lookups without storing full hash table metadata.\n\nThe tradeoff is that construction can be expensive and updates are hard; if the set changes frequently, a normal hash map is better.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["hashing", "performance"],
    source: "DS + systems staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 145,
      rubric: [
        "Defines perfect/minimal perfect hashing and collision-free mapping for a fixed set: 50%",
        "Gives correct use case (static set; predictable lookups; memory/perf benefits): 30%",
        "Mentions a tradeoff (build cost; poor updates/dynamic changes) clearly: 20%",
      ],
      reference_solution_md:
        "Perfect hashing builds a collision-free hash for a fixed key set; minimal perfect hashes map N keys to 0..N-1. Great for static sets needing compact, predictable lookups. Tradeoff: expensive construction and hard updates; use normal hash maps for dynamic sets.\n",
    },
  },
  {
    slug: "bitset-vs-hashset-when-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "Bitset vs Hash Set",
    prompt_md:
      "When is a bitset better than a hash set, and when is it worse?\n\nAnswer in 6–10 sentences and mention universe size / density.",
    solution_md:
      "A bitset is great when the universe of possible keys is small and known (e.g., IDs 0..M-1) and the set is relatively dense: membership is O(1) with a couple bit operations and is very cache-friendly. It can also enable fast bulk ops like AND/OR.\n\nIt’s worse when the universe is huge and the set is sparse because memory becomes O(M) regardless of how many elements you store. In that case, a hash set stores only present keys, trading memory for hashing overhead and less locality.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["bitset", "performance", "memory"],
    source: "DS tradeoff staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 145,
      rubric: [
        "Explains when bitset wins (small known universe; dense; cache-friendly; bulk bit ops): 45%",
        "Explains when bitset loses (huge universe; sparse; memory O(M)): 35%",
        "Mentions tradeoffs vs hash set (store only present keys; hashing/less locality): 20%",
      ],
      reference_solution_md:
        "Bitsets win when universe is small/known and sets are dense: O(1) membership, great locality, fast bulk ops. They lose when universe is huge and sparse since memory is O(M). Hash sets store only present keys but pay hashing and poorer locality.\n",
    },
  },
  {
    slug: "rope-vs-string-builder-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "Rope/Piece Table — When It Helps",
    prompt_md:
      "Why might a rope (or piece table) be better than a contiguous string for certain workloads?\n\nAnswer in 6–10 sentences and mention edit patterns and copying.",
    solution_md:
      "Contiguous strings are great for appends and sequential scans, but inserting/deleting in the middle can require shifting/copying O(n) bytes. A rope represents a string as a tree of chunks (or a piece table references original + add buffers), making mid-string edits cheaper because you mostly adjust pointers/structure rather than copying large byte ranges.\n\nTradeoffs include more complex implementation, pointer chasing during traversal, and potentially worse cache locality for sequential operations.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["strings", "trees", "performance"],
    source: "Practical DS design",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 145,
      rubric: [
        "Explains contiguous string mid-edit causes O(n) copying/shifting: 45%",
        "Explains rope/piece table avoids copying by chunking and adjusting structure: 35%",
        "Mentions at least one tradeoff (pointer chasing; locality; complexity): 20%",
      ],
      reference_solution_md:
        "Contiguous strings make mid-string edits expensive due to O(n) shifting/copying. Ropes/piece tables represent strings as chunks so edits adjust structure rather than copying. Tradeoffs: complexity, pointer chasing, and worse locality for sequential scans.\n",
    },
  },
  {
    slug: "flat-map-when-better-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "When a Sorted Vector Beats a Tree Map",
    prompt_md:
      "When can a sorted vector (flat_map-style) outperform a tree-based ordered map?\n\nAnswer in 6–10 sentences and mention cache locality and update patterns.",
    solution_md:
      "A sorted vector has excellent cache locality: lookups via binary search are log n with tight loops and contiguous memory, often faster than pointer-chasing in trees for small-to-medium n. It also stores less overhead per entry.\n\nIt performs poorly for frequent inserts/deletes in the middle because shifting is O(n). So it wins in read-heavy workloads with infrequent batch updates, or when the key set is mostly static.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["ordered-map", "performance", "locality"],
    source: "Practical DS performance",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 145,
      rubric: [
        "Explains why sorted vector can be faster for lookups (contiguous memory, cache locality, less overhead): 50%",
        "Explains update downside (inserts/deletes O(n) due to shifting): 35%",
        "Mentions correct workload fit (read-heavy, mostly static, batch updates): 15%",
      ],
      reference_solution_md:
        "Sorted vectors/flat_map can beat tree maps for lookups due to contiguous memory and low overhead. Inserts/deletes in the middle are O(n) shifts, so they fit read-heavy mostly-static or batch-update workloads.\n",
    },
  },
  {
    slug: "cuckoo-hashing-why-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "Cuckoo Hashing — Why/When Use It?",
    prompt_md:
      "What is cuckoo hashing, and what are its practical tradeoffs compared to linear/robin-hood probing?\n\nAnswer in 6–10 sentences and mention bounded lookup vs insertion costs.",
    solution_md:
      "Cuckoo hashing uses two (or more) hash functions and allows each key to live in one of a small number of candidate buckets. Lookups check a small fixed number of locations, giving very predictable lookup time.\n\nInsertions can be expensive: inserting a key may evict another key, triggering a chain of relocations, and in rare cases can loop and require a rebuild/rehash. This makes it attractive when you care about predictable lookup latency and can tolerate occasional expensive insert/rebuild events, or when the table is mostly read-only after build.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["hashmap", "performance", "tail-latency"],
    source: "High-performance hash tables",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 150,
      rubric: [
        "Defines cuckoo hashing with multiple candidate locations and (potential) eviction/relocation on insert: 50%",
        "Mentions predictable/bounded lookup (few probes) as a key benefit: 25%",
        "Mentions insertion/rebuild tradeoffs (relocation chains, cycles, occasional rehash): 25%",
      ],
      reference_solution_md:
        "Cuckoo hashing gives each key a few candidate buckets (via multiple hashes). Lookup checks a fixed small number of locations (predictable). Inserts may trigger eviction chains and can occasionally require rebuild/rehash if cycles occur.\n",
    },
  },
  {
    slug: "swisstable-control-bytes-why-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "SwissTable-Style Hash Maps — Why They’re Fast (High Level)",
    prompt_md:
      "Many modern hash maps (e.g., SwissTable/abseil flat_hash_map) use “control bytes” and SIMD-friendly scans. What’s the high-level idea and why is it fast?\n\nAnswer in 6–10 sentences; no need for implementation details.",
    solution_md:
      "The high-level idea is to store a compact metadata array (control bytes) that encodes whether slots are empty/deleted and often a small fingerprint of the hash. Lookups can scan a group of control bytes at once (vectorized / word-at-a-time) to quickly find candidate matches without touching full key/value storage.\n\nThis reduces cache misses and branch mispredicts by keeping the hot metadata tight and predictable. Only when a fingerprint matches do you access the actual key/value, which improves average and tail behavior.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["hashmap", "performance", "cache"],
    source: "Modern hashmap design",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 150,
      rubric: [
        "Describes control bytes/metadata + (often) hash fingerprints at a high level: 45%",
        "Explains why it’s fast (scan metadata in groups; fewer cache misses/branches; touch keys less): 40%",
        "Avoids over-specific claims and stays conceptual: 15%",
      ],
      reference_solution_md:
        "SwissTable keeps tight control-byte metadata (empty/deleted + small hash fingerprint). Lookups scan groups of metadata quickly (SIMD/word-at-a-time) and only touch key/value on candidate matches, reducing cache misses and branch mispredicts.\n",
    },
  },
  {
    slug: "priority-queue-heap-choice-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "Priority Queue Choices (Binary Heap vs Alternatives)",
    prompt_md:
      "When would a binary heap be a good priority queue choice, and when might you prefer an alternative (pairing heap / Fibonacci heap / indexed heap)?\n\nAnswer in 6–10 sentences and mention decrease-key and constants.",
    solution_md:
      "A binary heap is a great default: simple, cache-friendly array layout, good constants, and O(log n) push/pop. If you need efficient decrease-key operations (e.g., Dijkstra-style workloads), an indexed heap (tracking positions) can make decrease-key practical.\n\nTheoretical structures like Fibonacci heaps have better asymptotics for decrease-key but large constants and complexity; pairing heaps are simpler and often good in practice for many decrease-key scenarios. Choice depends on operation mix and constant factors, not just Big-O.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["heaps", "performance", "tradeoffs"],
    source: "DS tradeoff staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 150,
      rubric: [
        "Explains why binary heap is default (simplicity, array locality, good constants): 40%",
        "Mentions decrease-key as a differentiator and describes an indexed heap or alternative: 35%",
        "Mentions asymptotics vs constants/complexity tradeoff (Fib/pairing) correctly: 25%",
      ],
      reference_solution_md:
        "Binary heap is the default (simple, array-local, good constants) with log push/pop. If you need frequent decrease-key, consider indexed heaps or alternative heaps (pairing). Fibonacci heaps have theoretical wins but big constants/complexity; choose based on operation mix.\n",
    },
  },
  {
    slug: "bplus-tree-range-scan-why-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "B+Tree — Why Range Scans Are Fast",
    prompt_md:
      "Why are B+trees commonly used in databases for range scans and ordered iteration?\n\nAnswer in 6–10 sentences and mention leaf-level linkage and page locality.",
    solution_md:
      "In a B+tree, internal nodes route searches while the actual records/keys are stored in the leaves. Leaves are often stored in order and linked (next/prev pointers), so once you find the starting leaf, you can iterate sequentially through leaves for a range scan.\n\nBecause nodes are sized to pages/cache lines, traversal touches relatively few cache lines/pages, and range scans become mostly sequential IO/memory access. Compared to BSTs, the high fanout reduces height and pointer chasing.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["trees", "databases", "performance"],
    source: "DB index staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 150,
      rubric: [
        "Explains B+tree leaves store records and are linked for ordered iteration: 45%",
        "Connects to page/cache locality and fewer node touches due to high fanout: 40%",
        "Mentions why this helps range scans (sequential access after first seek): 15%",
      ],
      reference_solution_md:
        "B+trees store data in ordered linked leaves; after locating the start leaf you scan sequentially across leaves. Nodes are page-sized with high fanout, so height is small and access is cache/IO-friendly—ideal for range scans and ordered iteration.\n",
    },
  },
  {
    slug: "radix-trie-when-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "Radix Trees / Tries — When They Beat Hashing",
    prompt_md:
      "When can a radix tree / trie be better than a hash map for string keys?\n\nAnswer in 6–10 sentences and mention prefix queries and avoiding hashing.",
    solution_md:
      "Tries/radix trees support prefix queries naturally (autocomplete, routing tables) because keys share prefixes in the structure. They can also avoid hashing costs for long strings: instead of hashing the whole key, you traverse by bytes/chunks and can short-circuit early on mismatch.\n\nThey can offer ordered traversal by key and predictable behavior under adversarial hash inputs. Tradeoffs include higher pointer/metadata overhead and potentially worse cache locality if the structure is sparse (though radix compression helps).",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["tries", "strings", "performance"],
    source: "DS tradeoff staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 150,
      rubric: [
        "Mentions prefix query support and shared-prefix structure as a core advantage: 45%",
        "Mentions avoiding hashing full strings / early mismatch / predictable behavior as an advantage: 30%",
        "Mentions at least one tradeoff (overhead, locality, sparsity) and/or radix compression: 25%",
      ],
      reference_solution_md:
        "Tries/radix trees excel for prefix queries and can avoid hashing long strings by traversing bytes/chunks (early mismatch). They can provide ordered traversal and robustness to hash adversaries. Tradeoffs: pointer/metadata overhead and cache locality; radix compression mitigates sparsity.\n",
    },
  },
  {
    slug: "hash-flooding-attack-why-freeform",
    topic: "Data Structures",
    track: "dev",
    title: "Hash Flooding — Why Adversarial Inputs Matter",
    prompt_md:
      "What is a hash-flooding attack (or adversarial hashing scenario), and what are two mitigations used in practice?\n\nAnswer in 6–10 sentences and mention collision behavior.",
    solution_md:
      "Hash flooding is when an attacker (or adversarial data source) supplies keys designed to collide under your hash function, forcing many entries into the same bucket/probe cluster. This can degrade expected O(1) hash-map operations toward O(n), causing CPU spikes and latency DoS.\n\nMitigations include using a strong randomized hash (per-process seed), switching to collision-resistant hashing, using data structures with worst-case guarantees (e.g., tree buckets), limiting per-request work, and avoiding attacker-controlled keys on hot paths.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["hashmap", "security", "performance"],
    source: "Systems/security staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 150,
      rubric: [
        "Defines hash flooding/adversarial collisions and connects to O(1)→O(n) degradation/latency DoS: 55%",
        "Explains collision mechanism (same bucket/probe cluster) at a high level: 20%",
        "Names two correct mitigations (randomized hash, stronger hash, tree buckets, caps): 25%",
      ],
      reference_solution_md:
        "Hash flooding crafts keys that collide, turning hash-map ops from expected O(1) to O(n) and causing latency DoS (bucket chains/probe clusters). Mitigate with randomized/strong hashes, worst-case-guarantee buckets (trees), and work limits/admission control.\n",
    },
  },
];
