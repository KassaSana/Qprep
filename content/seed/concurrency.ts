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
        "Identifies a concrete scheme (e.g., global chopstick ordering or waiter/semaphore limiting diners): 45%",
        "Mentions deadlock and at least one of its four conditions: 25%",
        "Explains clearly why the scheme breaks at least one condition (e.g., circular wait): 30%",
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
        "Names the shared state and what protects it (mutex / binary semaphore over head/tail/count): 30%",
        "Uses correct primitives (not_full/not_empty CVs or two counting semaphores): 25%",
        "Correct wait/signal sequencing for producer/consumer (wait while full/empty; signal other side after modifying state): 30%",
        "Mentions `while` predicate loop for spurious wakeups and re-checking the condition: 15%",
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
        "Explains the reordering/publishing issue (pointer can become visible before construction effects): 40%",
        "Explicitly describes the 'partially constructed object' hazard for reader thread: 35%",
        "Names a correct modern fix (C++ call_once/Meyers singleton/atomic acquire-release; Java volatile): 25%",
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
        "States volatile is not a synchronization primitive (no happens-before / no ordering for other data): 45%",
        "Mentions at least one missing guarantee (atomicity, CPU reordering, visibility of other writes): 30%",
        "Proposes a correct alternative (std::atomic acquire/release, mutex/cv): 25%",
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
        "Identifies relaxed does not order/publish the non-atomic `data` write: 40%",
        "Explains the 'ready==true but data stale' outcome in memory-model terms: 35%",
        "Provides a correct fix (release store + acquire load, or seq_cst/mutex): 25%",
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
        "Defines false sharing as independent variables sharing a cache line: 40%",
        "Explains cache-coherence invalidation/ping-pong mechanism at a high level: 35%",
        "Gives at least one concrete fix (padding/alignas) and one alternative (sharding/batching/reduce writes): 25%",
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
        "Defines ABA in CAS terms (A read; changes A→B→A; CAS fooled): 45%",
        "Gives a realistic scenario (pointer reuse / memory reclamation): 30%",
        "Names at least two mitigations (tagging/versioning; hazard pointers; epochs/RCU): 25%",
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
  {
    slug: "futex-what-is-it-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "Futex — What Is It (High Level)?",
    prompt_md:
      "On Linux, what is a futex and why is it useful for implementing mutexes/condition variables?\n\nAnswer in 6–10 sentences and mention the “fast path in userspace, slow path in kernel” idea.",
    solution_md:
      "A futex (fast userspace mutex) is a kernel primitive that lets threads wait on a memory word with minimal kernel involvement. The idea is that uncontended locking/unlocking happens entirely in userspace using atomics; only when contention occurs do threads call into the kernel to sleep/wake.\n\nThis reduces syscall overhead in the common case while still allowing efficient blocking when needed. Many pthread mutex/condvar implementations are built around futexes on Linux.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["linux", "futex", "synchronization"],
    source: "Linux concurrency staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 135,
      rubric: [
        "Defines futex as wait/wake on a memory word with kernel support: 40%",
        "Explains the fast-path userspace vs contended slow-path kernel sleep/wake: 45%",
        "Connects to mutex/condvar implementation and syscall reduction: 15%",
      ],
      reference_solution_md:
        "Futex lets threads sleep/wake based on a user memory word. Uncontended operations stay in userspace (atomics), contended case uses kernel to block/wake. This underlies Linux pthread mutex/condvar implementations and avoids syscalls on the fast path.\n",
    },
  },
  {
    slug: "priority-inversion-what-is-it-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "Priority Inversion",
    prompt_md:
      "What is priority inversion in concurrent systems? Give a simple example and one mitigation.\n\nAnswer in 6–10 sentences and mention locks.",
    solution_md:
      "Priority inversion happens when a high-priority thread is blocked waiting for a lock held by a low-priority thread, but the low-priority thread can’t run because medium-priority threads preempt it. The high-priority thread effectively inherits the low priority.\n\nMitigations include priority inheritance protocols (temporarily boosting the lock holder), priority ceiling, or designing to avoid long critical sections and priority-sensitive blocking.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["scheduling", "locks", "rt"],
    source: "OS/concurrency classic",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 135,
      rubric: [
        "Defines priority inversion in terms of lock blocking and scheduling priorities: 45%",
        "Gives a plausible 3-thread example (high waits on low; medium preempts low): 35%",
        "Mentions at least one correct mitigation (priority inheritance/ceiling; reduce critical sections): 20%",
      ],
      reference_solution_md:
        "Priority inversion: high-priority thread waits on lock held by low-priority thread, but medium-priority threads preempt the low one, delaying progress. Mitigate with priority inheritance/ceiling or by minimizing critical sections.\n",
    },
  },
  {
    slug: "thundering-herd-what-is-it-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "Thundering Herd (Wakeup Storm)",
    prompt_md:
      "What is the “thundering herd” problem in concurrency, and how can you reduce it?\n\nAnswer in 6–10 sentences and mention waking too many threads.",
    solution_md:
      "Thundering herd happens when many threads are awakened for an event, but only one (or a few) can make progress (e.g., many threads waiting on a single accept queue or condition). The others wake up, contend, and go back to sleep, causing wasted CPU and cache thrash.\n\nMitigations include waking a single waiter (`notify_one`), using separate queues/sharding (e.g., `SO_REUSEPORT`), using semaphores that wake the right number of threads, or designing work distribution to avoid stampedes.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["performance", "synchronization", "linux"],
    source: "Systems performance staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 135,
      rubric: [
        "Defines thundering herd as waking many threads when few can proceed: 45%",
        "Explains why it hurts (contention, wasted wakeups, cache thrash): 30%",
        "Gives at least one mitigation (notify_one, sharding, correct semaphore counts): 25%",
      ],
      reference_solution_md:
        "Thundering herd: many threads wake for an event but only one/few can proceed; the rest contend and sleep again. It wastes CPU and hurts caches. Mitigate with notify_one, sharding queues (reuseport), or primitives that wake only the required number.\n",
    },
  },
  {
    slug: "seqlock-when-use-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "SeqLock — When Would You Use It?",
    prompt_md:
      "What is a seqlock (sequence lock), and in what workload pattern can it outperform a regular mutex?\n\nAnswer in 6–10 sentences and mention many-readers/few-writers.",
    solution_md:
      "A seqlock uses a sequence counter that writers increment before and after updating data; readers read the sequence, copy the data, then re-check the sequence and retry if it changed (or was odd). Readers are lock-free but can retry under contention.\n\nIt works best when reads are frequent and must be fast, and writes are rare; then retries are uncommon and readers avoid mutex overhead. It’s not great when writers are frequent or readers can’t tolerate retries.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["lock-free", "read-mostly", "performance"],
    source: "Concurrency design pattern",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 145,
      rubric: [
        "Describes seqlock mechanism (sequence counter; readers retry if changed): 50%",
        "States best workload (many readers, few writers; retry rare): 35%",
        "Mentions limitation (writer-heavy hurts; readers may starve/retry): 15%",
      ],
      reference_solution_md:
        "Seqlock: writers bump sequence before/after; readers read seq, copy data, re-check seq and retry if changed/odd. Great for read-mostly workloads (many readers, few writers). Downsides: retry under writer contention and potential reader starvation.\n",
    },
  },
  {
    slug: "atomic-rmw-contention-why-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "Why Atomic RMW Can Be Slow Under Contention",
    prompt_md:
      "Why can something like `fetch_add` on a single atomic counter become a bottleneck under many threads?\n\nAnswer in 6–10 sentences and mention cache-line ownership/coherence.",
    solution_md:
      "Atomic read-modify-write operations require exclusive ownership of the cache line containing the atomic. Under many threads, the cache line ping-pongs between cores as each core takes ownership to perform the RMW, creating heavy coherence traffic.\n\nThis serializes updates and hurts scaling. Common fixes include sharded/per-thread counters with periodic aggregation, batching, or using relaxed atomics where appropriate (if ordering isn’t needed).",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["performance", "atomics", "cache"],
    source: "Low-latency engineering staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 140,
      rubric: [
        "Explains RMW requires exclusive cache-line ownership, causing coherence ping-pong: 55%",
        "Connects that to serialization/poor scaling under contention: 25%",
        "Mentions a correct mitigation (sharding, batching, aggregation) without overclaiming: 20%",
      ],
      reference_solution_md:
        "Atomic RMW needs exclusive ownership of its cache line, so many threads cause cache-line ping-pong and serialize updates. Mitigate via sharded counters + aggregation or batching.\n",
    },
  },
  {
    slug: "spsc-ring-buffer-ordering-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "SPSC Ring Buffer — Where Do Acquire/Release Go?",
    prompt_md:
      "In a single-producer single-consumer ring buffer implemented with atomics, where do you need acquire/release ordering and why?\n\nAnswer in 6–10 sentences; assume producer writes data then updates a tail index, consumer reads head/tail and then reads data.",
    solution_md:
      "The producer must ensure the data write becomes visible before publishing the updated tail index, so it uses a release store (or release RMW) when updating the tail. The consumer must use an acquire load of the tail before reading the data so that seeing the new tail implies seeing the data writes.\n\nSimilarly, when the consumer publishes an updated head (slot freed), it uses release, and the producer uses acquire when reading head to know slots are free. The goal is to create happens-before edges between data writes and index publication.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["spsc", "atomics", "memory-order"],
    source: "Quant-dev concurrency staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 150,
      rubric: [
        "Places release on producer’s publication (tail update) so data writes happen-before consumer sees tail: 45%",
        "Places acquire on consumer reading tail before reading data (visibility guarantee): 35%",
        "Mentions the symmetric head publication (consumer release; producer acquire) or explains the general happens-before idea: 20%",
      ],
      reference_solution_md:
        "Producer: write data, then release-store the tail to publish. Consumer: acquire-load tail, then read data. Consumer publishes head with release; producer reads head with acquire. These order data with index publication.\n",
    },
  },
  {
    slug: "spinlock-vs-mutex-when-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "Spinlock vs Mutex — When Would You Spin?",
    prompt_md:
      "When would a spinlock be better than a mutex, and when is it worse?\n\nAnswer in 6–10 sentences and mention preemption and critical section length.",
    solution_md:
      "Spinlocks can be better when the critical section is extremely short and contention is low, especially when the thread is running on a dedicated core and you want to avoid kernel sleep/wake overhead. They can be worse when the lock is held for longer or when the thread can be preempted while holding it: other threads may burn CPU spinning.\n\nOn oversubscribed systems, spinning wastes CPU time that could let the lock holder run and release the lock. Many systems use adaptive spinning: spin briefly then block.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["locks", "performance", "scheduling"],
    source: "Low-latency concurrency staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 140,
      rubric: [
        "Explains why spinning can help for very short critical sections (avoid kernel sleep/wake): 40%",
        "Explains why spinning is bad under preemption/long holds/oversubscription (wasted CPU): 45%",
        "Mentions at least one practical mitigation/heuristic (adaptive spin then block, dedicated cores): 15%",
      ],
      reference_solution_md:
        "Spinlocks can win for very short holds: avoid syscall sleep/wake overhead. They lose when holds are long or lock holder is preempted/oversubscribed, wasting CPU. Often spin briefly then block (adaptive).\n",
    },
  },
  {
    slug: "rwlock-writer-starvation-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "RWLock Pitfall: Writer Starvation",
    prompt_md:
      "Why can reader-writer locks cause writer starvation, and what are common ways to avoid it?\n\nAnswer in 6–10 sentences.",
    solution_md:
      "In reader-preference RWLocks, a steady stream of readers can keep acquiring the read lock, preventing writers from ever acquiring the write lock. The writer is always waiting for the reader count to drop to zero, but new readers keep arriving.\n\nAvoidance strategies include writer-preference or fair RWLocks (block new readers when a writer is waiting), queue-based locks, or redesigning to reduce write contention (sharding, RCU/seqlock patterns for read-mostly cases).",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["locks", "fairness", "performance"],
    source: "Concurrency design pitfall",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 140,
      rubric: [
        "Explains the starvation mechanism (reader-preference; new readers keep arriving while writer waits): 55%",
        "Mentions at least one correct fix (writer-preference/fairness; block new readers when writer waiting): 25%",
        "Mentions an alternative design approach (RCU/seqlock/sharding) without confusion: 20%",
      ],
      reference_solution_md:
        "RWLocks can starve writers if readers keep acquiring; writer never sees reader count reach 0. Fix with writer-preference/fair locks (block new readers when writer waiting) or use read-mostly designs like seqlock/RCU or sharding.\n",
    },
  },
  {
    slug: "notify-one-vs-notify-all-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "`notify_one` vs `notify_all`",
    prompt_md:
      "When should you use `notify_one` vs `notify_all` with a condition variable?\n\nAnswer in 6–10 sentences and mention the thundering herd tradeoff.",
    solution_md:
      "`notify_one` is usually preferred when a state change can only make one waiter’s predicate true (e.g., adding one item to a queue), because waking many threads wastes CPU and creates contention. `notify_all` is appropriate when a state change may satisfy many waiters at once (broadcast) or when multiple predicates share a CV and you can’t easily target a specific waiter.\n\nEven with `notify_one`, you still need the predicate+mutex+while pattern. Overusing `notify_all` can create a thundering herd.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["condition-variables", "performance"],
    source: "Concurrency practice",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 135,
      rubric: [
        "States notify_one for single-progress events to avoid wasted wakeups: 45%",
        "States notify_all for broadcast / many-waiters / mixed predicates cases: 35%",
        "Mentions thundering herd/contestion tradeoff and predicate+while correctness pattern: 20%",
      ],
      reference_solution_md:
        "Prefer notify_one when only one waiter can proceed (avoid herd). Use notify_all for broadcast or when many predicates could become true. Still use predicate+mutex+while; notify_all can cause thundering herd.\n",
    },
  },
  {
    slug: "lock-convoy-what-is-it-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "Lock Convoying",
    prompt_md:
      "What is lock convoying and why can it cause large latency spikes?\n\nAnswer in 6–10 sentences and mention scheduling effects.",
    solution_md:
      "Lock convoying occurs when many threads contend for a lock and the scheduler repeatedly wakes/runs threads that immediately block again, forming a “convoy.” If the lock holder is descheduled or runs intermittently, everyone queues behind it and context switching overhead dominates.\n\nThis can create tail-latency spikes due to scheduler thrash, cache/TLB disruption, and wakeup storms. Mitigations include reducing contention (sharding), shortening critical sections, using lock-free/read-mostly designs, or pinning/avoiding oversubscription for critical threads.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["locks", "performance", "scheduling"],
    source: "OS scheduling/perf staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 145,
      rubric: [
        "Defines lock convoying as many threads contending + scheduler/wakeup effects causing repeated blocking: 45%",
        "Connects to tail latency via context switches/cache disruption/wakeup storms: 35%",
        "Mentions at least one reasonable mitigation (sharding/shorten CS/read-mostly/avoid oversubscription): 20%",
      ],
      reference_solution_md:
        "Lock convoying: many contending threads repeatedly wake and block; scheduling effects + a descheduled lock holder create a convoy. Causes tail spikes from context switching and cache disruption. Mitigate by reducing contention/sharding, shortening critical sections, or using read-mostly/lock-free designs and avoiding oversubscription.\n",
    },
  },
  {
    slug: "cas-loop-backoff-why-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "CAS Loops and Backoff",
    prompt_md:
      "Why can a naive CAS loop perform poorly under contention, and what does backoff try to achieve?\n\nAnswer in 6–10 sentences and mention livelock/traffic.",
    solution_md:
      "Under contention, many threads can repeatedly fail CAS and immediately retry, generating heavy cache-coherence traffic on the same cache line. This can lead to livelock-like behavior where everyone is busy retrying and progress slows.\n\nBackoff introduces delays (often exponential or randomized) so retries are de-synchronized, reducing contention and allowing a winner to update the shared state. Backoff trades some added latency for higher throughput and better tail behavior under load.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["lock-free", "cas", "performance"],
    source: "Lock-free performance staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 135,
      rubric: [
        "Explains why naive CAS retries cause contention/coherence traffic and repeated failures: 50%",
        "Mentions livelock-like behavior / lack of progress under heavy contention: 20%",
        "Explains backoff goal (de-synchronize retries; reduce traffic) and tradeoff: 30%",
      ],
      reference_solution_md:
        "Naive CAS loops under contention repeatedly fail and retry, creating cache-line ping-pong and poor progress (livelock-like). Backoff (random/exponential delays) de-synchronizes retries so one thread can win, reducing traffic; trades some latency for better throughput/tails under load.\n",
    },
  },
  {
    slug: "work-stealing-deque-why-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "Work Stealing — Why It Scales",
    prompt_md:
      "What is a work-stealing scheduler, and why can it scale better than a single global queue?\n\nAnswer in 6–10 sentences and mention locality/contestion.",
    solution_md:
      "In work stealing, each worker thread has its own local deque of tasks; it pops from its own deque in the common case. When a worker runs out of work, it steals tasks from other workers (often from the opposite end of their deque).\n\nThis reduces contention versus a single global queue and improves cache locality because tasks tend to stay on the same worker. Stealing is less frequent, so synchronization overhead is paid mainly on imbalance, not on every task operation.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["scheduling", "performance", "queues"],
    source: "Concurrency design pattern",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 140,
      rubric: [
        "Describes per-worker local deques and stealing when empty: 50%",
        "Explains why it scales (less contention than global queue) and locality benefit: 35%",
        "Mentions that stealing is relatively rare / paid on imbalance (not every op): 15%",
      ],
      reference_solution_md:
        "Work stealing: per-worker deque; common-case pop/push is local; idle workers steal from others. It reduces contention versus a global queue and improves cache locality; synchronization is mostly on imbalance when stealing.\n",
    },
  },
  {
    slug: "fence-vs-atomic-acqrel-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "Fences vs Acquire/Release Atomics",
    prompt_md:
      "Conceptually, what’s the difference between using an explicit fence (barrier) and using acquire/release ordering on atomic operations?\n\nAnswer in 6–10 sentences; keep it language-level (C++ memory model).",
    solution_md:
      "Acquire/release orderings attach ordering constraints to specific atomic operations and create synchronization edges when paired correctly (release store observed by acquire load). Fences are broader: they impose ordering constraints on surrounding operations but don’t by themselves communicate with another thread unless there’s some atomic operation that both threads observe.\n\nIn C++ code, prefer acquire/release atomics for publication patterns because they express intent at the operation boundary and are easier to reason about than standalone fences. Fences are mainly used in low-level primitives or when you need to order multiple operations together.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["memory-model", "atomics"],
    source: "C++ memory model deep dive",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 150,
      rubric: [
        "Explains acquire/release as ordering tied to particular atomic ops and synchronization when paired: 45%",
        "Explains fences as broader ordering constraints that still require shared atomic communication to matter across threads: 35%",
        "Provides reasonable guidance on when/why prefer acq/rel vs fences: 20%",
      ],
      reference_solution_md:
        "Acq/rel attach ordering to specific atomic ops and synchronize when release is observed by acquire. Fences order surrounding ops but don't communicate by themselves without atomics both threads observe. Prefer acq/rel for publication; fences are for low-level primitives/ordering groups of ops.\n",
    },
  },
  {
    slug: "spurious-wakeup-what-is-it-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "Spurious Wakeups — Why They Exist",
    prompt_md:
      "What is a spurious wakeup with condition variables, and why do condition variable APIs allow it?\n\nAnswer in 6–10 sentences and mention the predicate loop.",
    solution_md:
      "A spurious wakeup is when a waiting thread wakes up even though no thread signaled it (or the predicate it cares about is still false). Many condition variable implementations allow this to simplify and optimize kernel/userspace interactions and to handle races where notifications and waits overlap.\n\nCorrect code must always re-check the predicate under the mutex in a `while` loop. The key contract is not “you wake only when signaled,” but “you may wake at any time; re-check the condition.”",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["condition-variables", "synchronization"],
    source: "Concurrency API contract",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 140,
      rubric: [
        "Defines spurious wakeup as waking without a corresponding signal / predicate still false: 45%",
        "Explains why APIs allow it (implementation efficiency/race handling) without overclaiming: 25%",
        "Mentions the correct pattern: predicate guarded by mutex + `while` loop: 30%",
      ],
      reference_solution_md:
        "Spurious wakeup = waiter wakes without a matching notify (predicate may still be false). APIs allow it for efficient implementations and race handling. Correctness requires re-checking predicate under the mutex in a while loop.\n",
    },
  },
  {
    slug: "semaphore-vs-mutex-difference-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "Semaphore vs Mutex",
    prompt_md:
      "What's the difference between a mutex and a semaphore, and when would you use a counting semaphore?\n\nAnswer in 6–10 sentences.",
    solution_md:
      "A mutex enforces mutual exclusion: at most one thread holds it, and it’s typically owned (unlocked by the thread that locked it). A counting semaphore represents a count of permits/resources; threads decrement to acquire and increment to release, and it’s not inherently tied to ownership.\n\nCounting semaphores are useful for limiting concurrency (e.g., allow up to N concurrent requests) or representing available items in a producer-consumer queue (items semaphore + slots semaphore).",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["synchronization", "semaphores", "locks"],
    source: "Concurrency fundamentals",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 140,
      rubric: [
        "Explains mutex as mutual exclusion with ownership semantics: 45%",
        "Explains semaphore as permit count (counting) and not inherently owned: 35%",
        "Gives a correct counting semaphore use case (limit N, producer-consumer counts): 20%",
      ],
      reference_solution_md:
        "Mutex: exclusive ownership lock. Semaphore: permit count; acquire decrements, release increments; not necessarily owned. Counting semaphores are great for limiting concurrency or modeling available items/slots in producer-consumer.\n",
    },
  },
  {
    slug: "epoch-reclamation-why-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "Epoch-Based Reclamation (EBR) — Why It Works",
    prompt_md:
      "What is epoch-based reclamation in lock-free code, and why does it prevent use-after-free?\n\nAnswer in 6–10 sentences and mention \"quiescent state\" or \"global epoch\".",
    solution_md:
      "Epoch-based reclamation tracks a global epoch and per-thread epochs to know which threads might still hold references to retired nodes. A thread retires nodes into a list associated with the current epoch; a node can only be freed once all threads have advanced past that epoch (reached a quiescent state).\n\nThis prevents freeing memory that another thread could still be reading. The tradeoff is delayed reclamation and needing threads to periodically report progress; a stalled thread can delay frees.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["lock-free", "memory-reclamation"],
    source: "Lock-free engineering staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 155,
      rubric: [
        "Describes the epoch concept (global epoch + per-thread participation) and retiring nodes: 45%",
        "Explains why it prevents UAF (free only after all threads are past epoch / quiescent): 40%",
        "Mentions at least one real tradeoff (delayed frees; stalled thread blocks reclamation): 15%",
      ],
      reference_solution_md:
        "EBR uses a global epoch and per-thread epochs: retire nodes with an epoch, free only after all threads have advanced beyond that epoch (quiescent). This prevents UAF at the cost of delayed reclamation and dependence on threads making progress.\n",
    },
  },
  {
    slug: "rcu-what-is-it-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "RCU — What Problem Does It Solve?",
    prompt_md:
      "At a high level, what is RCU (Read-Copy-Update) and what workload is it designed for?\n\nAnswer in 6–10 sentences and mention read-mostly and grace periods.",
    solution_md:
      "RCU is a synchronization strategy optimized for read-mostly workloads: readers run without locks (or with very cheap markers), while writers create a new version of data and publish it, then wait for a grace period until all pre-existing readers have finished before reclaiming the old version.\n\nThis provides extremely fast reads and avoids reader-writer lock contention, at the cost of more complex updates and delayed reclamation.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["rcu", "read-mostly", "performance"],
    source: "Linux/kernel concurrency pattern",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 150,
      rubric: [
        "Defines RCU as read-mostly scheme with readers mostly lock-free and writers publish new versions: 50%",
        "Mentions grace period before reclaiming old version (wait for old readers): 35%",
        "Mentions tradeoffs (fast reads; complex writes; delayed reclaim/memory): 15%",
      ],
      reference_solution_md:
        "RCU targets read-mostly: readers are very cheap; writers copy/update and publish new pointer, then wait a grace period for prior readers to finish before reclaiming old data. Great read perf; tradeoff is complex updates and delayed reclamation.\n",
    },
  },
  {
    slug: "thread-pool-backpressure-why-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "Thread Pools and Backpressure",
    prompt_md:
      "Why can an unbounded queue in front of a thread pool cause latency blowups, and what are two ways to add backpressure?\n\nAnswer in 6–10 sentences.",
    solution_md:
      "With an unbounded queue, when arrival rate exceeds service rate the queue grows without bound and requests wait longer and longer (queueing theory), causing tail latency to explode even if average compute per task is stable. Memory usage can also grow and cause GC/allocator pressure.\n\nBackpressure techniques include bounding the queue and rejecting/ shedding load, blocking producers, using a semaphore to cap in-flight work, or applying admission control / rate limiting upstream.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["performance", "queues", "backpressure"],
    source: "Systems performance staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 150,
      rubric: [
        "Explains why unbounded queue causes queueing delay/tail blowups when arrival > service: 50%",
        "Mentions an additional failure mode (memory pressure, cascading latency) correctly: 15%",
        "Gives two correct backpressure methods (bounded queue+reject, block, semaphore cap, rate limit): 35%",
      ],
      reference_solution_md:
        "Unbounded queues hide overload: when arrivals exceed service, queue grows and tail latency explodes; memory pressure can cascade. Add backpressure via bounded queues with rejection/shedding, blocking producers, semaphores to cap in-flight work, or admission control/rate limiting upstream.\n",
    },
  },
  {
    slug: "numa-and-lock-contention-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "NUMA and Lock Contention",
    prompt_md:
      "Why can a contended lock be much slower on a multi-socket NUMA machine than on a single-socket machine?\n\nAnswer in 6–10 sentences and mention remote cache-line ownership.",
    solution_md:
      "A contended lock typically lives in a cache line that must move between cores as ownership changes. On NUMA, if threads are on different sockets, transferring cache-line ownership can require inter-socket coherence traffic with higher latency than intra-socket transfers.\n\nThis increases both average and tail latency for lock acquisition. Mitigations include pinning related threads to the same socket, sharding state per socket (NUMA-aware partitioning), using per-core data + aggregation, and reducing shared-write hot spots.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["numa", "locks", "performance"],
    source: "Low-latency systems staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 150,
      rubric: [
        "Explains lock acquisition involves cache-line ownership transfers/coherence traffic: 40%",
        "Mentions NUMA inter-socket transfers are slower (remote ownership / QPI/UPI style cost): 35%",
        "Mentions at least one mitigation (pinning, sharding per socket, reduce sharing): 25%",
      ],
      reference_solution_md:
        "Contended locks bounce a cache line between cores. On NUMA, bouncing across sockets costs much more due to inter-socket coherence/remote ownership latency, worsening tails. Mitigate with pinning, NUMA-aware sharding/partitioning, and reducing shared-write hot spots.\n",
    },
  },
  {
    slug: "fairness-vs-throughput-locks-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "Fairness vs Throughput in Locks",
    prompt_md:
      "Why can a “fair” lock (strict FIFO) have worse throughput than an unfair lock? When might fairness still be required?\n\nAnswer in 6–10 sentences.",
    solution_md:
      "Fair locks can reduce throughput because they may force handoff to a specific waiting thread even if a different thread is currently running on-core and could acquire/release quickly. Strict fairness can increase context switches and reduce cache locality.\n\nUnfair locks can exploit locality (“lock holder runs again soon”) to increase throughput, but may starve some threads. Fairness may be required for latency guarantees, to avoid starvation, or in real-time / priority-sensitive systems.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["locks", "performance", "fairness"],
    source: "Concurrency performance tradeoff",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 145,
      rubric: [
        "Explains why strict fairness can hurt throughput (handoff, context switches, locality loss): 50%",
        "Explains why unfair locks can be faster but risk starvation: 30%",
        "Mentions when fairness is needed (avoid starvation, latency/RT constraints): 20%",
      ],
      reference_solution_md:
        "Fair FIFO locks can hurt throughput by forcing handoff/context switches and losing cache locality. Unfair locks can exploit locality for speed but can starve threads. Fairness may be required for starvation avoidance and latency/real-time guarantees.\n",
    },
  },
  {
    slug: "barrier-vs-latch-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "Barrier vs Latch",
    prompt_md:
      "What’s the difference between a barrier and a latch (countdown latch)? Give one use case for each.\n\nAnswer in 6–10 sentences.",
    solution_md:
      "A barrier makes a set of threads wait until all participants reach the barrier point, then they all proceed together (often reusable across phases). A countdown latch starts with a count; one or more threads decrement it, and waiters block until it reaches zero (typically one-shot).\n\nUse cases: barriers for synchronized phases in parallel algorithms; latches for waiting for startup/shutdown completion or a set of tasks to finish.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["synchronization", "primitives"],
    source: "Concurrency fundamentals",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 140,
      rubric: [
        "Defines barrier (all parties wait; proceed together; often reusable): 45%",
        "Defines countdown latch (count to zero; one-shot; waiters unblock): 35%",
        "Gives one correct use case for each: 20%",
      ],
      reference_solution_md:
        "Barrier: all participants wait until everyone arrives, then proceed together (often reusable). Latch: count down to zero; waiters unblock when it hits zero (usually one-shot). Barrier for phased parallel work; latch for waiting on startup/task completion.\n",
    },
  },
  {
    slug: "lock-striping-why-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "Lock Striping — Why It Helps",
    prompt_md:
      "What is lock striping and why can it dramatically improve throughput?\n\nAnswer in 6–10 sentences and mention reducing contention on a single lock.",
    solution_md:
      "Lock striping partitions a data structure into multiple shards, each protected by its own lock (often indexed by a hash). This reduces contention because unrelated operations likely hit different stripes and can proceed in parallel.\n\nIt also reduces cache-line ping-pong on a single lock variable. Tradeoffs include more complex code, potential deadlock if you need multiple stripes at once, and uneven load if keys are skewed.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["locks", "performance", "sharding"],
    source: "Systems design/concurrency staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 145,
      rubric: [
        "Defines lock striping as sharding state with multiple locks (often by hash): 45%",
        "Explains performance win as reduced contention/parallelism and reduced lock cache-line bouncing: 35%",
        "Mentions at least one tradeoff (complexity, multi-lock deadlock risk, skew): 20%",
      ],
      reference_solution_md:
        "Lock striping shards state and uses multiple locks (e.g., by hash) so independent operations contend less and run in parallel, reducing hot lock cache-line bouncing. Tradeoffs: complexity, multi-stripe operations needing ordering, and key skew.\n",
    },
  },
  {
    slug: "mutex-vs-atomic-when-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "Mutex vs Atomic — Choosing the Right Tool",
    prompt_md:
      "Give two reasons why replacing a mutex with atomics may make code worse, and one scenario where atomics are clearly better.\n\nAnswer in 6–10 sentences.",
    solution_md:
      "Atomics can make code worse because the reasoning is harder (memory ordering, ABA, subtle races) and because contended atomics can still serialize and create cache-line ping-pong. They also can’t easily protect compound invariants across multiple variables without careful design.\n\nAtomics are clearly better for simple independent state like counters/flags or SPSC queues where you can build a small, well-understood synchronization protocol, especially when avoiding kernel transitions matters.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["atomics", "locks", "tradeoffs"],
    source: "Concurrency engineering practice",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 150,
      rubric: [
        "Gives two correct reasons atomics can be worse (complex reasoning/order; contended ping-pong; multi-var invariants): 55%",
        "Gives one scenario where atomics are better (simple counters/flags; SPSC protocol; avoid kernel): 25%",
        "Avoids overclaiming (acknowledges tradeoffs) and stays language-level: 20%",
      ],
      reference_solution_md:
        "Atomics can be worse due to tricky memory-order reasoning and because contended atomics still serialize (cache-line ping-pong); also hard to protect multi-variable invariants. Atomics win for simple independent state (counters/flags) or well-scoped protocols like SPSC queues where avoiding kernel transitions matters.\n",
    },
  },
  {
    slug: "mcs-lock-why-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "Queue-Based Locks (MCS) — Why They Scale",
    prompt_md:
      "What problem do queue-based spin locks (e.g., MCS locks) solve compared to a naive test-and-set spinlock?\n\nAnswer in 6–10 sentences and mention cache-line contention.",
    solution_md:
      "A naive test-and-set spinlock makes all contenders repeatedly read-modify-write the same cache line, causing massive coherence traffic and poor scaling. Queue-based locks like MCS give each waiting thread its own queue node and have it spin on a thread-local flag, so spinning mostly hits a local cache line.\n\nThe lock ownership is passed along the queue, reducing cache-line ping-pong on a single shared word. This improves throughput and tail latency under high contention.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["locks", "performance", "cache"],
    source: "Concurrency performance staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 150,
      rubric: [
        "Explains naive TAS lock contention on one cache line causes coherence storms: 45%",
        "Explains MCS/queue lock has per-thread node and spins locally (local flag): 40%",
        "Connects to scaling/tail-latency under contention without overclaiming: 15%",
      ],
      reference_solution_md:
        "TAS spinlocks make everyone pound one cache line (RMW contention). MCS queue locks give each waiter a node and spin on a local flag; ownership is passed along the queue, reducing cache-line ping-pong and scaling better under contention.\n",
    },
  },
  {
    slug: "futex-mutex-lost-wakeup-pitfall-freeform",
    topic: "Concurrency",
    track: "dev",
    title: "Futex/Mutex Pitfall: Lost Wakeup (Conceptual)",
    prompt_md:
      "Conceptually, how can a “lost wakeup” happen if you check a condition and then go to sleep without making that check-and-sleep atomic?\n\nAnswer in 6–10 sentences and relate it to why futex-based designs carefully re-check state around sleep/wake.",
    solution_md:
      "A lost wakeup happens when a thread checks a condition (e.g., \"lock is held\") and decides to sleep, but before it actually goes to sleep another thread changes the condition and sends a wakeup. If the waiter wasn’t yet sleeping, the wakeup is “missed,” and the waiter can sleep forever.\n\nFutex-based designs avoid this by using an atomic state word: they re-check the state and only sleep if the state still indicates waiting is needed, often using a compare-and-sleep pattern. The core idea is to make “observe state → decide to sleep” race-free via an atomic protocol plus re-check loops.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["futex", "condition-variables", "synchronization"],
    source: "Concurrency correctness staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 155,
      rubric: [
        "Explains the lost-wakeup race (check condition; other thread signals before sleep; signal missed): 55%",
        "Connects to the need for atomic check-and-sleep protocol / re-check loops: 30%",
        "Relates to futex-style state word approach at a high level without implementation trivia: 15%",
      ],
      reference_solution_md:
        "Lost wakeup: waiter checks condition then sleeps; another thread changes condition and signals before waiter is actually sleeping, so wakeup is missed and waiter can block forever. Futex designs use an atomic state word and re-check loops so sleeping only happens if state still requires it, making observe→sleep race-free.\n",
    },
  },
];
