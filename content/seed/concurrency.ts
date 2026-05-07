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
];
