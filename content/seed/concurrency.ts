import type { SeedQuestion } from "@/content/question-types";

/**
 * Concurrency reasoning — graded as freeform text via lib/grade-freeform.ts.
 * The rubric on each question is the contract the grader checks against.
 */
export const CONCURRENCY_SEED: SeedQuestion[] = [
  {
    slug: "dining-philosophers-explain",
    topic: "Concurrency",
    track: "dev",
    title: "Dining Philosophers — Avoid Deadlock",
    prompt_md:
      "Five philosophers sit around a circular table. Between each pair of neighbors lies one chopstick (so five chopsticks total). Each philosopher alternates between thinking and eating, and to eat must hold both adjacent chopsticks at once.\n\nDescribe a concrete scheme that lets all five philosophers make progress without deadlock or starvation. Justify why your scheme avoids the four classical deadlock conditions (mutual exclusion, hold-and-wait, no preemption, circular wait).",
    solution_md:
      "Several valid solutions exist. The most common: enforce a global ordering on chopsticks and require every philosopher to pick up the lower-numbered chopstick first. This breaks the *circular wait* condition because no thread can be holding chopstick $k$ while waiting on chopstick $j < k$. An alternative is to use a waiter that allows at most $4$ philosophers to attempt eating simultaneously, which guarantees at least one can acquire both chopsticks (breaking *hold-and-wait* in the worst case).",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["deadlock", "synchronization", "classic"],
    companies: ["Citadel", "Two Sigma"],
    source: "Operating-systems classic",
    answer_meta: {
      rubric: [
        "Identifies a concrete scheme (e.g. global chopstick ordering or waiter / semaphore limiting concurrent diners)",
        "Mentions deadlock or one of its four conditions (mutual exclusion, hold-and-wait, no preemption, circular wait)",
        "Explains why the scheme breaks at least one of those conditions",
      ],
      min_words: 40,
      reference_solution_md:
        "Enforce a total order on chopsticks and have every philosopher acquire the lower-numbered one first. No thread can hold chopstick $k$ while waiting on chopstick $j < k$, so the circular-wait condition cannot form and the system is deadlock-free.",
    },
  },
  {
    slug: "producer-consumer-bounded-buffer",
    topic: "Concurrency",
    track: "dev",
    title: "Producer–Consumer with a Bounded Buffer",
    prompt_md:
      "You have a bounded ring buffer shared by a single producer thread and a single consumer thread. Sketch a correct synchronization scheme using a mutex and condition variables (or two counting semaphores) so that:\n\n1. The producer blocks when the buffer is full.\n2. The consumer blocks when the buffer is empty.\n3. There are no lost updates and no spurious wake-ups go uncaught.\n\nState what each lock/semaphore protects and at which point the threads signal/wake the other.",
    solution_md:
      "One mutex protects the buffer state (head, tail, count). Two condition variables — `not_full` and `not_empty` — let each thread sleep when its precondition fails. The producer locks the mutex, while-waits on `not_full` while the buffer is full, writes one element, increments count, signals `not_empty`, and unlocks. The consumer mirrors that with `not_empty` / `not_full`. The semaphore equivalent uses two counting semaphores initialized to capacity and $0$ respectively, plus a binary mutex.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["synchronization", "condition-variables", "semaphores"],
    companies: ["Jane Street", "Citadel"],
    source: "Concurrency interview staple",
    answer_meta: {
      rubric: [
        "Names a mutex (or binary semaphore) that protects the buffer state",
        "Uses two condition variables or counting semaphores — one for not-full, one for not-empty",
        "Producer waits while full and signals not-empty after writing; consumer waits while empty and signals not-full after reading",
        "Mentions guarding the wait with a `while` loop (not `if`) to handle spurious wake-ups",
      ],
      min_words: 60,
      reference_solution_md:
        "Use one mutex over `(head, tail, count)`, plus two condition variables. Producer: lock; while count == capacity wait on not_full; write element; count++; signal not_empty; unlock. Consumer: lock; while count == 0 wait on not_empty; read element; count--; signal not_full; unlock. The `while` (not `if`) handles spurious wake-ups.",
    },
  },
  {
    slug: "double-checked-locking-broken",
    topic: "Concurrency",
    track: "dev",
    title: "Why is Naive Double-Checked Locking Broken?",
    prompt_md:
      "In a multi-threaded language without memory barriers between the heap allocation, the constructor, and the assignment of the singleton pointer, the textbook \"double-checked locking\" pattern is unsafe.\n\nExplain in your own words *why* the naive pattern can hand a partially-constructed object to a reader thread, and what the canonical fix is in modern C++ or Java.",
    solution_md:
      "Without ordering guarantees, `instance = new Singleton()` can be reordered so the pointer becomes visible *before* the constructor finishes. A second thread sees a non-null `instance` on the first check, skips the lock, and dereferences a half-built object. The fix in modern C++ is to declare the pointer `std::atomic<T*>` (or use `std::call_once` / a function-local static); in Java the fix is `volatile` on the singleton field, which since Java 5 establishes the necessary happens-before edge.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["memory-model", "singleton", "lock-free"],
    companies: ["Two Sigma", "Citadel Securities"],
    source: "Concurrency deep cut",
    answer_meta: {
      rubric: [
        "Identifies that store ordering / memory-model effects let writes reorder relative to the pointer assignment",
        "Explicitly mentions the partially-constructed object hazard for the second thread",
        "Names a correct fix: `volatile` (Java), `std::atomic` / `std::call_once` / function-local static (C++), or an explicit fence",
      ],
      min_words: 60,
      reference_solution_md:
        "The two writes — \"build the object\" and \"publish the pointer\" — are not ordered by the language memory model in a naive implementation, so a reader can observe a non-null pointer before the constructor's stores become visible. In modern C++ use `std::atomic<T*>` with acquire/release, `std::call_once`, or a Meyers' singleton; in Java, declare the field `volatile`.",
    },
  },
  {
    slug: "volatile-not-thread-sync",
    topic: "Concurrency",
    track: "dev",
    title: "Why `volatile` Does Not Synchronize Threads",
    prompt_md:
      "In C/C++ you sometimes see code like `volatile bool ready;` used as a cross-thread signal.\n\nExplain why `volatile` is **not** sufficient for thread synchronization, and what you should use instead.",
    solution_md:
      "`volatile` only constrains certain compiler optimizations for that variable (historically for memory-mapped I/O). It does not provide atomicity, does not create a happens-before edge, and does not prevent CPU reordering. For cross-thread communication use `std::atomic` plus acquire/release (or higher-level primitives like mutexes/condition variables).",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["memory-model", "atomics", "volatile"],
    companies: ["HRT", "Jane Street"],
    source: "Quant-dev concurrency staple",
    answer_meta: {
      rubric: [
        "States that `volatile` is not a synchronization primitive (no happens-before / no inter-thread ordering)",
        "Mentions at least one missing guarantee: atomicity, CPU reordering prevention, or visibility of other writes",
        "Proposes a correct alternative: `std::atomic` (acquire/release) or mutex/condition_variable",
      ],
      min_words: 50,
      reference_solution_md:
        "`volatile` does not make operations atomic and does not establish inter-thread ordering; it mainly affects compiler optimization and is meant for memory-mapped I/O. Use `std::atomic` with acquire/release (or a mutex/condition variable) to publish data safely between threads.",
    },
  },
  {
    slug: "relaxed-ready-data-bug",
    topic: "Concurrency",
    track: "dev",
    title: "Relaxed Atomics Bug: `ready` Does Not Publish `data`",
    prompt_md:
      "Consider:\n\n```cpp\nstd::atomic<bool> ready{false};\nint data;\n// Thread 1\ndata = 42;\nready.store(true, std::memory_order_relaxed);\n// Thread 2\nwhile (!ready.load(std::memory_order_relaxed)) {}\nstd::cout << data;\n```\n\nExplain what can go wrong and how to fix it using memory orderings.",
    solution_md:
      "With `memory_order_relaxed`, the atomic only guarantees atomicity of `ready`, not ordering/visibility for `data`. Thread 2 can observe `ready==true` but still see a stale/uninitialized `data`. Fix: `ready.store(true, release)` and `ready.load(acquire)`, or use seq_cst, or guard `data` with a mutex.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["atomics", "acquire-release", "happens-before"],
    companies: ["HRT", "Citadel"],
    source: "C++ memory model classic",
    answer_meta: {
      rubric: [
        "Identifies that relaxed does not order/flush the non-atomic `data` write",
        "Explains the 'ready true but data stale' outcome",
        "Provides a correct fix: release on store + acquire on load (or mutex / seq_cst)",
      ],
      min_words: 70,
      reference_solution_md:
        "`ready` being relaxed only makes the flag atomic; it does not publish `data`. Use `ready.store(true, std::memory_order_release)` in Thread 1 and `ready.load(std::memory_order_acquire)` in Thread 2 so the write to `data` happens-before the read when the flag is observed true.",
    },
  },
  {
    slug: "false-sharing-explain",
    topic: "Concurrency",
    track: "dev",
    title: "False Sharing: What It Is and How to Fix It",
    prompt_md:
      "Define *false sharing*. Why can it destroy throughput even when two threads update different variables? Give two concrete fixes.",
    solution_md:
      "False sharing occurs when two hot variables live on the same cache line. Each core's writes invalidate the other core's cache line (MESI ping-pong), causing constant coherence traffic. Fixes: separate the variables onto different cache lines via padding/`alignas(64)` or `std::hardware_destructive_interference_size`, or redesign to use per-thread counters + periodic aggregation.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["cache", "performance", "mesi"],
    companies: ["Jump Trading", "IMC"],
    source: "Low-latency engineering staple",
    answer_meta: {
      rubric: [
        "Defines false sharing as independent variables sharing one cache line",
        "Mentions cache-coherence invalidation/ping-pong as the mechanism",
        "Gives at least one fix involving alignment/padding, and one alternative (per-thread shards / reduce writes / batching)",
      ],
      min_words: 60,
      reference_solution_md:
        "False sharing is when threads modify different variables that sit on the same cache line, causing coherence invalidations. Fix by separating onto different lines (padding/`alignas(64)`), or by sharding state per thread and aggregating occasionally.",
    },
  },
  {
    slug: "aba-problem-explain",
    topic: "Concurrency",
    track: "dev",
    title: "ABA Problem in Lock-Free Code",
    prompt_md:
      "What is the ABA problem? Give one realistic scenario where it happens and list three standard mitigation strategies.",
    solution_md:
      "ABA: a thread reads A, gets paused; other threads change A→B→A; the original thread's CAS succeeds even though the object/meaning changed. Common in lock-free stacks where nodes are popped then freed and reused. Mitigations: tagged pointers/version counters, hazard pointers, epoch-based reclamation (RCU-style), or never-reuse memory (in practice, deferred reclamation).",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["lock-free", "cas", "memory-reclamation"],
    companies: ["HRT", "Jane Street"],
    source: "Lock-free deep cut",
    answer_meta: {
      rubric: [
        "Defines the A→B→A pattern and why CAS can be fooled",
        "Gives an example involving pointer reuse / memory reclamation",
        "Names at least two mitigations (tagged pointers/versioning, hazard pointers, epochs/RCU)",
      ],
      min_words: 70,
      reference_solution_md:
        "ABA occurs when a value changes from A to B and back to A between a read and a CAS, so the CAS 'succeeds' despite an intervening change (often due to freed/reused nodes). Mitigate with version tags, hazard pointers, or epoch-based reclamation.",
    },
  },
];
