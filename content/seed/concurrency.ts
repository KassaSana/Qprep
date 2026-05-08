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
  {
    slug: "memory-order-acq-rel-what-guarantees-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "Acquire/Release — What Guarantee Does It Provide?",
    prompt_md:
      "In C++ atomics, explain what guarantee you get from a `store(..., std::memory_order_release)` in one thread paired with a `load(..., std::memory_order_acquire)` in another thread.\n\nAnswer in 6–10 sentences. Use the terms *happens-before* and *publishing*.",
    solution_md:
      "If a thread performs a release store to an atomic variable and another thread later reads that value (or a later value in the release sequence) with an acquire load, then the release synchronizes-with the acquire. This establishes a happens-before relation: all writes in the releasing thread that occurred before the release store become visible to the acquiring thread after the acquire load.\n\nThis is the standard \"publish data then set a flag\" pattern: store data (non-atomic ok if not raced) then release-store the flag; reader acquire-loads the flag and then safely reads the published data.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["atomics", "memory-order", "happens-before"],
    source: "C++ memory model staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "States release store + acquire load (when the value is observed) synchronizes-with and creates a happens-before edge: 50%",
        "Explains visibility/order guarantee: prior writes before release become visible after acquire: 35%",
        "Connects to the publish-flag pattern (data then flag; read flag then data): 15%",
      ],
      reference_solution_md:
        "release-store + acquire-load (when acquire reads the released value) synchronizes-with and establishes happens-before: writes before release become visible after acquire. This is the publish-flag pattern.\n",
    },
  },
  {
    slug: "memory-order-seq-cst-when-use-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "When Would You Use `memory_order_seq_cst`?",
    prompt_md:
      "When is it reasonable to use `std::memory_order_seq_cst` instead of acquire/release or relaxed?\n\nAnswer in 5–10 sentences and mention the idea of a single total order and debugging/correctness tradeoffs.",
    solution_md:
      "`seq_cst` provides the strongest guarantee: all seq-cst operations participate in a single total order consistent with program order, which makes reasoning simpler. It's reasonable when correctness is more important than micro-optimizing, when you're first implementing something and want the simplest correct semantics, or when you need global ordering across multiple atomics.\n\nYou can often relax to acquire/release after proving the minimal required ordering. The tradeoff is potential performance cost on some architectures due to stronger fences/order constraints.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["atomics", "memory-order", "performance"],
    source: "C++ concurrency practice",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 110,
      rubric: [
        "Explains seq_cst as imposing a single total order (strongest ordering) for those atomics: 50%",
        "Gives at least one good use case (simpler reasoning, cross-atomic ordering, correctness-first): 30%",
        "Mentions tradeoff (possible perf cost; can later relax after proof): 20%",
      ],
      reference_solution_md:
        "seq_cst gives a single global total order for seq-cst ops, simplifying reasoning and sometimes needed across multiple atomics. Use when correctness/simplicity first; later relax if proven. Stronger ordering can cost performance.\n",
    },
  },
  {
    slug: "condition-variable-missed-wakeup-why-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "Condition Variables — What Causes a Missed Wakeup?",
    prompt_md:
      "Explain what a \"missed wakeup\" is with condition variables, and how the standard pattern avoids it.\n\nAnswer in 6–10 sentences. Mention the predicate, the mutex, and the `while` loop.",
    solution_md:
      "A missed wakeup occurs when a thread goes to sleep even though the condition it cares about is already true, or when a notify happens before the waiter is actually waiting and the waiter sleeps forever. The standard pattern avoids this by protecting the predicate with a mutex and using `while (!pred) cv.wait(lock)`.\n\nThe mutex ensures the check and the decision to sleep are atomic with respect to predicate changes; the `while` loop handles spurious wakeups and re-checks the predicate after being notified.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["condition-variables", "synchronization"],
    source: "Concurrency interview staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "Defines missed wakeup in terms of predicate/notify timing and sleeping incorrectly: 35%",
        "Explains the role of the mutex in protecting the predicate and making check+sleep atomic: 40%",
        "Mentions the `while` predicate loop (spurious wakeups + re-check): 25%",
      ],
      reference_solution_md:
        "Missed wakeup: waiter sleeps though predicate true or notify happens before it waits. Fix: protect predicate with mutex and use `while(!pred) cv.wait(lock)`, re-checking after wake (also handles spurious wakeups).\n",
    },
  },
  {
    slug: "lock-free-progress-guarantees-mcq",
    topic: "Concurrency",
    track: "dev",
    title: "Progress Guarantees: Wait-Free vs Lock-Free vs Obstruction-Free",
    prompt_md:
      "Which statement best matches the standard progress guarantees terminology?",
    solution_md:
      "Wait-free: every thread completes in a bounded number of steps. Lock-free: system as a whole makes progress (some thread completes) even if others are stalled. Obstruction-free: a thread completes if it runs alone for long enough.",
    answer_kind: "mcq",
    answer_value: "definitions",
    answer_tolerance: null,
    difficulty: 4,
    tags: ["lock-free", "theory"],
    source: "Concurrency terminology",
    target_roles: ["Dev"],
    answer_meta: {
      options: [
        {
          id: "definitions",
          label:
            "Wait-free: each thread finishes in bounded steps. Lock-free: overall progress (some thread finishes). Obstruction-free: finishes if runs alone.",
          correct: true,
        },
        {
          id: "swap",
          label:
            "Lock-free: each thread finishes in bounded steps. Wait-free: only overall progress is guaranteed.",
          correct: false,
        },
        {
          id: "mutex",
          label: "Obstruction-free means it uses a mutex but avoids deadlock.",
          correct: false,
        },
        {
          id: "none",
          label: "These terms have no standard meaning; everyone defines them differently.",
          correct: false,
        },
      ],
    },
  },
  {
    slug: "hazard-pointers-what-problem-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "Hazard Pointers — What Problem Do They Solve?",
    prompt_md:
      "What problem do hazard pointers solve in lock-free data structures?\n\nAnswer in 6–10 sentences. Mention memory reclamation and why naive `delete` is unsafe.",
    solution_md:
      "Hazard pointers solve safe memory reclamation: in lock-free structures, one thread may remove a node while another thread still holds a pointer to it. If the remover immediately `delete`s the node, the other thread may dereference freed memory (use-after-free), or the memory could be recycled causing ABA-style bugs.\n\nWith hazard pointers, threads publish which nodes they might access; a node can only be reclaimed when no hazard pointer references it. This makes reclamation safe without stopping the world.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["lock-free", "memory-reclamation", "hazard-pointers"],
    source: "Lock-free engineering staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 130,
      rubric: [
        "States the problem: safe memory reclamation / use-after-free in lock-free structures: 45%",
        "Explains why immediate delete is unsafe (other threads may still read pointers): 35%",
        "Explains the hazard-pointer idea (publish protected pointers; reclaim only when none reference): 20%",
      ],
      reference_solution_md:
        "Hazard pointers address lock-free memory reclamation: removed nodes can't be deleted immediately because other threads may still hold pointers. Threads publish hazard pointers; reclaim only when node not present in any hazard pointer set.\n",
    },
  },
];
