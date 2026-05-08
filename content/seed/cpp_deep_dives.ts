import type { SeedQuestion } from "@/content/question-types";

/**
 * C++ Deep Dives — modern C++ performance and correctness pitfalls.
 *
 * Focus: object lifetimes, value categories, atomics, UB, and ABI-ish intuition.
 * No trivia; emphasize "why" and concrete consequences.
 */
export const CPP_DEEP_DIVES_SEED: SeedQuestion[] = [
  {
    slug: "cpp-rule-of-zero-five-when-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Rule of Zero vs Rule of Five",
    prompt_md:
      "Explain the Rule of Zero and the Rule of Five in modern C++.\n\nIn 6–10 sentences: define what each says, when you'd follow each, and why.",
    solution_md:
      "Rule of Zero: design types so they don't manage resources manually; rely on RAII members (e.g., `std::vector`, `std::unique_ptr`) so you don't need to write destructor/copy/move at all.\n\nRule of Five: if your type manually manages a resource (custom ownership), then you should usually define (or delete) all of destructor, copy constructor, copy assignment, move constructor, and move assignment to keep ownership semantics correct.\n\nRule of Zero is preferred because it reduces bugs and composes well; Rule of Five is for when you truly need custom ownership/control.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["cpp", "raii", "move-semantics"],
    source: "Effective Modern C++ staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "Defines Rule of Zero (no custom special members because members handle resources): 45%",
        "Defines Rule of Five and correctly names the five special members: 35%",
        "Explains why Rule of Zero is preferred (fewer bugs/composability) and when Rule of Five is needed: 20%",
      ],
      reference_solution_md:
        "Rule of Zero: avoid manual resource management; then no custom dtor/copy/move. Rule of Five: if you manage resources, define/delete dtor, copy/move ctor, copy/move assign. Prefer Zero; use Five only when ownership is custom.\n",
    },
  },
  {
    slug: "cpp-move-vs-copy-when-happens-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Move vs Copy — When Does a Move Actually Happen?",
    prompt_md:
      "In C++, when does a move constructor/assignment get used instead of a copy?\n\nAnswer in 6–10 sentences. Mention rvalues, `std::move`, and copy elision (RVO).",
    solution_md:
      "Moves are used when the source object is an rvalue (a temporary or something explicitly cast to an rvalue via `std::move`) and the type has a viable move constructor/assignment. `std::move` does not move by itself; it casts to an rvalue so overload resolution can pick move operations.\n\nHowever, copy elision (especially guaranteed copy elision in C++17 for some return cases) can avoid both copy and move entirely (RVO/NRVO). If a move is deleted/unavailable, the compiler may fall back to copy (or fail to compile).",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["cpp", "move-semantics", "rvo"],
    source: "Modern C++ interviews",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "States move operations are selected for rvalues and via `std::move` casts: 50%",
        "Clarifies `std::move` is a cast, not an operation that moves data by itself: 20%",
        "Mentions copy elision/RVO and that it can remove moves/copies: 30%",
      ],
      reference_solution_md:
        "Moves are chosen for rvalues (temporaries or `std::move`d objects) when move ops exist. `std::move` is just a cast. Copy elision/RVO can eliminate both copy and move entirely in many return cases.\n",
    },
  },
  {
    slug: "cpp-forwarding-reference-what-is-it-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Forwarding References (Universal References)",
    prompt_md:
      "What is a forwarding reference (a.k.a. universal reference), and why do we use `std::forward<T>(x)`?\n\nAnswer in 6–10 sentences and mention reference collapsing.",
    solution_md:
      "A forwarding reference is a function template parameter of the form `T&&` where `T` is deduced; it can bind to both lvalues and rvalues. Due to reference collapsing, if an lvalue is passed then `T` deduces to `U&` and `T&&` becomes `U&`.\n\n`std::forward<T>(x)` preserves the original value category (lvalue vs rvalue) when passing `x` onward so that overload resolution can select the right copy/move or lvalue/rvalue overloads.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "templates", "perfect-forwarding"],
    source: "Effective Modern C++ staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 125,
      rubric: [
        "Defines forwarding reference as deduced `T&&` that can bind to lvalues and rvalues: 45%",
        "Mentions reference-collapsing behavior (lvalue makes T=U&, so T&& becomes U&): 30%",
        "Explains `std::forward` preserves value category for perfect forwarding: 25%",
      ],
      reference_solution_md:
        "Forwarding reference: `T&&` with deduced T; binds to lvalues/rvalues via reference collapsing. `std::forward<T>(x)` preserves the original value category when forwarding to another call.\n",
    },
  },
  {
    slug: "cpp-rvo-guaranteed-cpp17-mcq",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "C++17 Guaranteed Copy Elision",
    prompt_md:
      "In C++17, in which situation is copy elision (no move/copy) guaranteed?",
    solution_md:
      "When initializing an object directly from a prvalue temporary of the same type (e.g., `T x = T{...};` or returning `T{...}` and initializing the return object), copy/move can be elided and in some cases is guaranteed by the standard in C++17.",
    answer_kind: "mcq",
    answer_value: "prvalue-init",
    answer_tolerance: null,
    difficulty: 4,
    tags: ["cpp", "rvo", "performance"],
    source: "Modern C++ standard behavior",
    target_roles: ["Dev"],
    answer_meta: {
      options: [
        {
          id: "prvalue-init",
          label:
            "Direct initialization from a prvalue of the same type (e.g., returning `T{...}` and initializing the result).",
          correct: true,
        },
        {
          id: "always",
          label: "Copy elision is always guaranteed for any return statement.",
          correct: false,
        },
        {
          id: "malloc",
          label: "Copy elision is guaranteed whenever `new` is used.",
          correct: false,
        },
        {
          id: "volatile",
          label: "Copy elision is guaranteed only for `volatile` objects.",
          correct: false,
        },
      ],
    },
  },
  {
    slug: "cpp-strict-aliasing-ub-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Strict Aliasing — Why Can It Be UB?",
    prompt_md:
      "What is the strict aliasing rule in C/C++, and why can violating it lead to undefined behavior?\n\nAnswer in 6–10 sentences and mention compiler optimizations.",
    solution_md:
      "Strict aliasing says that, with limited exceptions, you may not read/write an object through a pointer/reference of an unrelated type. Compilers assume this rule to optimize (e.g., keep values in registers and reorder loads/stores) because they believe two differently-typed pointers don't point to the same storage.\n\nIf you violate strict aliasing (type-punning through incompatible pointers), the compiler may optimize as if the aliasing doesn't exist, producing surprising results. Safe alternatives include `memcpy`, `std::bit_cast` (C++20 for trivially copyable types), or using `char`/`std::byte` for raw storage.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["cpp", "ub", "optimization"],
    source: "C++ UB deep cut",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 130,
      rubric: [
        "States the rule at a high level: incompatible typed pointers generally assumed not to alias: 40%",
        "Explains UB arises because compiler optimizations rely on that assumption (reordering/caching in registers): 40%",
        "Gives at least one safe alternative (`memcpy`, `std::bit_cast`, char/byte storage): 20%",
      ],
      reference_solution_md:
        "Strict aliasing lets the compiler assume unrelated pointer types don't alias, enabling reordering and register caching. Violations break those assumptions → UB. Use memcpy/bit_cast/byte storage for safe type punning.\n",
    },
  },
  {
    slug: "cpp-atomic-memory-order-when-mcq",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Atomics — Acquire/Release vs Relaxed",
    prompt_md:
      "You want a flag to publish data written by one thread so another thread can safely read it after seeing the flag.\n\nWhich ordering pair is the standard minimal correct choice for the flag?",
    solution_md:
      "Use release on the store in the writer and acquire on the load in the reader (or stronger).",
    answer_kind: "mcq",
    answer_value: "release-acquire",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["cpp", "atomics", "memory-model"],
    source: "C++ memory model staple",
    target_roles: ["Dev"],
    answer_meta: {
      options: [
        { id: "release-acquire", label: "Store with release; load with acquire.", correct: true },
        { id: "relaxed-relaxed", label: "Both operations relaxed.", correct: false },
        { id: "relaxed-acquire", label: "Store relaxed; load acquire.", correct: false },
        { id: "release-relaxed", label: "Store release; load relaxed.", correct: false },
      ],
    },
  },
  {
    slug: "cpp-unique-ptr-overhead-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "`unique_ptr` — Runtime Overhead and Tradeoffs",
    prompt_md:
      "What is the typical runtime overhead of `std::unique_ptr<T>` compared to a raw `T*`, and what do you get in return?\n\nAnswer in 5–10 sentences and mention the deleter and inlining.",
    solution_md:
      "In typical builds, `unique_ptr<T>` is a zero-cost abstraction: it stores a raw pointer (and possibly an empty deleter) and its destructor compiles down to a `delete` call that can often be inlined. It doesn't do reference counting, so there's no atomic overhead like `shared_ptr`.\n\nYou get automatic lifetime management (RAII), exception safety, and clear ownership semantics. The main overhead is at construction/destruction boundaries (a delete), and size can increase if you use a stateful custom deleter.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["cpp", "smart-pointers", "performance"],
    source: "Modern C++ interviews",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "States unique_ptr is typically zero/near-zero overhead vs raw pointer (no refcount; stores pointer + deleter): 45%",
        "Mentions destructor does delete and can be inlined; no atomic ops like shared_ptr: 30%",
        "Mentions custom deleter can affect size/overhead and what safety/ownership you gain: 25%",
      ],
      reference_solution_md:
        "unique_ptr usually stores a pointer (and empty deleter) and compiles to a delete in the destructor; no refcount/atomics. Gains RAII/ownership clarity. Stateful deleters can increase size.\n",
    },
  },
  {
    slug: "cpp-shared-ptr-overhead-why-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "`shared_ptr` — Where Does the Overhead Come From?",
    prompt_md:
      "Explain the typical overheads of `std::shared_ptr` compared to `std::unique_ptr`.\n\nAnswer in 6–10 sentences and mention the control block and atomic refcounts.",
    solution_md:
      "`shared_ptr` maintains a control block (refcount(s), deleter, possibly weak count) and typically uses atomic increments/decrements on reference count operations, which can be expensive under contention. It may involve additional allocations: constructing a `shared_ptr` from a raw pointer usually allocates a separate control block, while `make_shared` co-allocates object + control block.\n\nBy contrast, `unique_ptr` has no refcount and usually compiles to a raw pointer + delete at destruction. `shared_ptr` is valuable for shared ownership but should be avoided on hot paths when ownership can be made explicit.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "smart-pointers", "performance"],
    source: "Quant-dev C++ staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 125,
      rubric: [
        "Mentions control block + reference counting as core overhead source: 45%",
        "Mentions atomic inc/dec (contention/cache traffic) as important cost: 35%",
        "Mentions allocation behavior (`make_shared` co-allocation vs separate control block): 20%",
      ],
      reference_solution_md:
        "shared_ptr uses a control block and atomic refcount operations (cache traffic/contestion) and may allocate control block separately unless make_shared co-allocates. unique_ptr has none of that.\n",
    },
  },
  {
    slug: "cpp-make-shared-vs-shared-ptr-new-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "`make_shared` vs `shared_ptr(new T)`",
    prompt_md:
      "Why is `std::make_shared<T>(...)` often preferred over `std::shared_ptr<T>(new T(...))`?\n\nAnswer in 5–10 sentences and mention allocation count and exception safety.",
    solution_md:
      "`make_shared` typically performs a single allocation that stores both the control block and the object, improving locality and reducing allocator overhead. It is also exception-safe in the sense that you don't risk leaking the raw pointer if an exception occurs between allocation and control block construction in more complex expressions.\n\nOne tradeoff is that the object memory may be retained until the last `weak_ptr` is gone because control block and object are co-allocated.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "smart-pointers", "allocations"],
    source: "Modern C++ best practice",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 115,
      rubric: [
        "Mentions fewer allocations / co-allocation of object + control block as the main win: 55%",
        "Mentions locality/allocator overhead and/or exception-safety benefit: 30%",
        "Mentions a real tradeoff (weak_ptr lifetime / custom deleter / aliasing) correctly: 15%",
      ],
      reference_solution_md:
        "make_shared co-allocates object+control block (often one allocation), improving locality and reducing overhead; also avoids some leak hazards in complex expressions. Tradeoff: memory may stick around until weak_ptrs are gone.\n",
    },
  },
  {
    slug: "cpp-small-string-optimization-why-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Small String Optimization (SSO)",
    prompt_md:
      "What is the small string optimization (SSO) in `std::string`, and why does it matter for latency?\n\nAnswer in 5–10 sentences. Mention allocations and typical thresholds (high level).",
    solution_md:
      "SSO is an implementation technique where short strings are stored directly inside the `std::string` object (inline buffer) instead of allocating on the heap. This avoids heap allocations for common small strings, reducing latency and allocator contention.\n\nThresholds vary by implementation (often around 15–23 bytes for 64-bit builds). It matters because heap allocation is relatively expensive and can introduce tail-latency spikes; SSO keeps hot-path operations predictable for small payloads.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["cpp", "performance", "allocations"],
    source: "C++ performance staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 110,
      rubric: [
        "Defines SSO as storing short strings inline inside the std::string object: 55%",
        "Connects SSO to avoiding heap allocations and improving latency/predictability: 35%",
        "Mentions the threshold varies by implementation (no need for exact number): 10%",
      ],
      reference_solution_md:
        "SSO stores short strings inline (no heap allocation), reducing allocator overhead and tail latency. Threshold varies by lib implementation.\n",
    },
  },
  {
    slug: "cpp-vtable-when-created-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "vtables — What They Are and a Performance Implication",
    prompt_md:
      "At a high level, what is a vtable in C++ and what does a virtual call typically compile to?\n\nAnswer in 5–10 sentences and mention one performance implication.",
    solution_md:
      "A vtable is a compiler-generated table of function pointers used to implement dynamic dispatch for polymorphic types. An object with virtual functions typically contains a vptr pointing to its vtable. A virtual call generally loads the vptr, loads the function pointer from a fixed slot, and then performs an indirect call.\n\nPerformance implications include an indirect branch (harder to predict) and inhibited inlining/devirtualization in some cases, which can matter in tight loops.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "abi", "performance"],
    source: "C++ internals interview staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 115,
      rubric: [
        "Describes vtable/vptr mechanism (table of function pointers + per-object pointer): 55%",
        "Describes virtual call as an indirect call via vtable slot (high-level is fine): 30%",
        "Mentions one realistic perf implication (branch prediction, inlining limits, cache effects): 15%",
      ],
      reference_solution_md:
        "Vtable is a function-pointer table; object holds vptr. Virtual call loads vptr → loads slot → indirect call. Indirect call can hurt branch prediction and inlining.\n",
    },
  },
  {
    slug: "cpp-object-lifetime-placement-new-ub-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Object Lifetime and Placement New — A Common UB Trap",
    prompt_md:
      "Explain a common undefined-behavior trap involving object lifetime when reusing storage (e.g., placement-new into a buffer) and then accessing through an old pointer/reference.\n\nAnswer in 6–10 sentences and mention lifetime and `std::launder` (high level is fine).",
    solution_md:
      "If you construct a new object into the same storage (placement new), the old object’s lifetime ends and the new object’s lifetime begins. Accessing the new object through an old pointer/reference that refers to the previous object can be UB because the compiler may assume the old object still exists (or that the type-based aliasing/lifetime rules allow optimizations).\n\n`std::launder` can be needed to obtain a pointer that the compiler must treat as pointing to the newly created object in the same storage. In practice, prefer not to reuse storage this way unless you understand the rules; or use standard containers/variants that manage lifetime correctly.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["cpp", "ub", "lifetime"],
    source: "Modern C++ UB deep cut",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 135,
      rubric: [
        "Mentions lifetime ends/begins when placement-new constructs a new object in same storage: 45%",
        "Explains old pointer/reference can be invalid for the new object due to lifetime/optimization assumptions: 35%",
        "Mentions `std::launder` (or safe alternative: avoid; use std::variant/container) appropriately: 20%",
      ],
      reference_solution_md:
        "Placement-new starts a new object's lifetime; old references/pointers may not be valid for the new object → UB. `std::launder` can be required to get a pointer to the new object; safer is to avoid raw lifetime tricks.\n",
    },
  },
  {
    slug: "cpp-alignment-padding-cachelines-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Alignment, Padding, and Cache Lines",
    prompt_md:
      "In performance-sensitive C++, why do alignment and padding matter?\n\nAnswer in 6–10 sentences and mention cache lines, false sharing, and `alignas`.",
    solution_md:
      "Alignment affects how objects sit in memory; misalignment can cause extra loads/stores or even faults on some architectures. Padding affects object size and layout and can place hot fields on the same cache line.\n\nIn multithreaded code, if two threads write to different fields that share a cache line, you can get false sharing. Using `alignas(64)` or padding to separate hot per-thread fields onto different cache lines can reduce coherence traffic and tail latency. The tradeoff is increased memory footprint.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "performance", "cache"],
    source: "Low-latency C++ staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "Mentions alignment/padding impacts memory layout and performance: 30%",
        "Mentions cache lines and false sharing as key reason padding/alignment matters: 50%",
        "Mentions a concrete tool like `alignas(64)` (or destructive interference size) and tradeoff (memory footprint): 20%",
      ],
      reference_solution_md:
        "Alignment/padding affect layout; hot fields can share cache lines. In multithreaded code this can cause false sharing; use alignas/padding to separate into different cache lines, trading memory for lower tail latency.\n",
    },
  },
  {
    slug: "cpp-std-span-why-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "`std::span` — Why It's Useful",
    prompt_md:
      "What is `std::span`, and why might it be preferable to passing `(ptr, len)` or `std::vector&` in APIs?\n\nAnswer in 6–10 sentences and mention ownership and bounds.",
    solution_md:
      "`std::span<T>` is a non-owning view over a contiguous sequence (pointer + length) with a safe-ish interface. It makes it explicit that the function does not take ownership and can accept arrays, vectors, and contiguous buffers uniformly.\n\nCompared to `(ptr, len)`, it packages the pair and can enable bounds-checked access in debug builds; compared to `std::vector&`, it doesn't force a specific container type and can represent subranges. The lifetime must outlive the span, so it's still a view, not ownership.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["cpp", "api-design", "performance"],
    source: "Modern C++ API design staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "Defines span as a non-owning view over contiguous memory (ptr+len): 45%",
        "Mentions API benefits vs ptr+len and vs vector& (generic, subranges, clearer ownership): 40%",
        "Mentions lifetime/ownership caveat correctly: 15%",
      ],
      reference_solution_md:
        "span is a non-owning contiguous view (ptr+len). It's clearer than ptr+len and more general than vector&, supports subranges. Lifetime must outlive the span.\n",
    },
  },
  {
    slug: "cpp-constexpr-consteval-when-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "`constexpr` vs `consteval`",
    prompt_md:
      "Explain the difference between `constexpr` and `consteval`.\n\nAnswer in 5–10 sentences and give one example scenario where `consteval` is useful.",
    solution_md:
      "`constexpr` means a function or value *can* be evaluated at compile time when given constant inputs, but it may also run at runtime. `consteval` means it *must* be evaluated at compile time; calling it with non-constant inputs is ill-formed.\n\n`consteval` is useful for enforcing compile-time computation/validation, e.g., building a lookup table or validating format strings/config constants so errors are caught at compile time rather than at runtime.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "compile-time"],
    source: "Modern C++ deep dive",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 115,
      rubric: [
        "States constexpr is allowed at compile time but can also run at runtime: 45%",
        "States consteval must run at compile time (otherwise ill-formed): 40%",
        "Gives a plausible consteval use case (compile-time validation/table): 15%",
      ],
      reference_solution_md:
        "constexpr: may be evaluated at compile time if inputs are constant, otherwise runtime. consteval: must be compile-time. Use consteval for enforced compile-time validation or table generation.\n",
    },
  },
  {
    slug: "cpp-vector-reserve-why-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "`std::vector::reserve` — Why It Matters for Latency",
    prompt_md:
      "Why can calling `reserve()` on a `std::vector` matter for tail latency?\n\nAnswer in 5–10 sentences and mention reallocation and iterator/pointer invalidation.",
    solution_md:
      "Without sufficient capacity, `push_back` can trigger reallocation: allocate a larger buffer, move/copy elements, and free the old buffer. That can cause latency spikes due to allocations and bulk moves, and it invalidates pointers/iterators/references to elements.\n\n`reserve` pre-allocates capacity up front so growth doesn't happen on the hot path, reducing jitter and making behavior more predictable.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["cpp", "performance", "containers"],
    source: "Low-latency C++ staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 110,
      rubric: [
        "Mentions vector growth can reallocate and move/copy elements, causing spikes: 55%",
        "Mentions pointer/iterator invalidation as an important consequence: 25%",
        "Explains reserve moves that work off the hot path / improves predictability: 20%",
      ],
      reference_solution_md:
        "Vector growth can reallocate + move elements (alloc spike) and invalidates iterators/pointers. reserve preallocates so hot path avoids reallocations → better tail latency.\n",
    },
  },
  {
    slug: "cpp-exception-safety-basic-strong-mcq",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Exception Safety Guarantees",
    prompt_md:
      "Which statement best describes the difference between the basic and strong exception safety guarantees?",
    solution_md:
      "Basic guarantee: invariants are preserved and no resources leak, but state may change. Strong guarantee: operation is atomic with respect to failure (either succeeds fully or has no effect).",
    answer_kind: "mcq",
    answer_value: "basic-strong",
    answer_tolerance: null,
    difficulty: 3,
    tags: ["cpp", "exceptions"],
    source: "Effective C++ staple",
    target_roles: ["Dev"],
    answer_meta: {
      options: [
        {
          id: "basic-strong",
          label:
            "Basic: invariants preserved/no leaks, but state may change. Strong: either succeeds fully or has no effect.",
          correct: true,
        },
        {
          id: "swap",
          label:
            "Strong guarantee means memory is never allocated; basic guarantee means it may allocate.",
          correct: false,
        },
        {
          id: "none",
          label:
            "There is no standard definition; teams define basic/strong differently.",
          correct: false,
        },
        {
          id: "only-nothrow",
          label:
            "Strong guarantee means the function is `noexcept`; basic guarantee means it may throw.",
          correct: false,
        },
      ],
    },
  },
  {
    slug: "cpp-string-view-dangling-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "`std::string_view` — A Dangling Lifetime Pitfall",
    prompt_md:
      "Give a common way `std::string_view` can dangle and cause bugs.\n\nAnswer in 5–10 sentences and show one example scenario in words (no code required).",
    solution_md:
      "`string_view` is a non-owning view into a character buffer. It dangles if it outlives the underlying storage, e.g., returning a `string_view` to a local `std::string` inside a function, or storing a view into a `std::string` that later reallocates/mutates.\n\nBecause it doesn't own memory, you must ensure the referenced string/buffer outlives the view and is not invalidated by reallocation.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["cpp", "lifetime", "api-design"],
    source: "Modern C++ pitfall",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 110,
      rubric: [
        "States string_view is non-owning and depends on external buffer lifetime: 45%",
        "Gives a correct dangling scenario (local string return, mutation/realloc, temp string): 45%",
        "Mentions correct mitigation idea (ensure lifetime; return string; store owning copy): 10%",
      ],
      reference_solution_md:
        "string_view is a non-owning view; it dangles if underlying string/buffer dies or reallocates (e.g., returning view to a local string). Ensure lifetime or use owning std::string.\n",
    },
  },
  {
    slug: "cpp-noexcept-move-vector-growth-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "`noexcept` Move and `std::vector` Reallocation",
    prompt_md:
      "Why does marking a move constructor `noexcept` matter for performance with standard containers like `std::vector`?\n\nAnswer in 6–10 sentences and mention strong exception safety.",
    solution_md:
      "When `vector` grows, it must relocate elements. To preserve strong exception safety, the standard library may prefer copying over moving if moving can throw, because a throwing move during reallocation could leave the container in a partially-moved state.\n\nIf the move constructor is `noexcept`, `vector` can move elements during reallocation confidently, which is often much cheaper than copying. Therefore making moves `noexcept` where correct can improve performance and reduce latency spikes during growth.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "performance", "exceptions"],
    source: "Effective Modern C++ staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 125,
      rubric: [
        "Explains vector reallocation/relocation and the exception-safety constraint: 45%",
        "States that throwing moves may force copies; noexcept moves enable moving: 45%",
        "Connects to performance/tail latency (copy vs move cost) without overclaiming: 10%",
      ],
      reference_solution_md:
        "vector relocation wants strong exception safety; if move can throw, implementation may copy. If move is noexcept, it can move during reallocation → cheaper and more predictable.\n",
    },
  },
  {
    slug: "cpp-pmr-what-is-it-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "`std::pmr` — Polymorphic Memory Resources",
    prompt_md:
      "What problem does `std::pmr` (polymorphic memory resources) solve, and how can it help in low-latency code?\n\nAnswer in 6–10 sentences and mention controlling allocation strategy.",
    solution_md:
      "`std::pmr` decouples containers from the global allocator by letting you supply a memory resource at runtime. That lets you route allocations to a pool/arena, control fragmentation, and reduce allocator contention without rewriting container logic.\n\nIn low-latency code, you can use a monotonic buffer resource for request-scoped allocations or a synchronized/unsynchronized pool for node allocations, improving predictability. You still need to manage lifetime of the backing storage and avoid cross-thread misuse for unsynchronized resources.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "allocators", "performance"],
    source: "Modern C++ performance tool",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 130,
      rubric: [
        "States pmr lets containers use a provided memory resource instead of global new/delete: 45%",
        "Explains how it helps latency (pools/arenas, reduced fragmentation/contestion, predictability): 40%",
        "Mentions a real caveat (resource lifetime/thread-safety) correctly: 15%",
      ],
      reference_solution_md:
        "pmr lets you inject allocation strategy (pool/arena) into containers at runtime, improving predictability and reducing fragmentation/contestion; caveats include resource lifetime and thread-safety.\n",
    },
  },
  {
    slug: "cpp-optional-vs-sentinel-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "`std::optional` vs Sentinel Values",
    prompt_md:
      "When would you prefer returning `std::optional<T>` over using a sentinel value (like -1) to indicate \"not found\"?\n\nAnswer in 5–10 sentences and mention type safety and ambiguity.",
    solution_md:
      "`optional<T>` is preferable when there is no natural sentinel value, or when using a sentinel is ambiguous (the sentinel could be a valid value). It improves type safety by forcing callers to handle the empty case explicitly and avoids conflating \"no value\" with some magic number.\n\nSentinels can be fine for performance-critical code when a clear, unambiguous sentinel exists and the API is well-documented, but `optional` often leads to clearer, safer interfaces.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["cpp", "api-design"],
    source: "Modern C++ best practice",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 110,
      rubric: [
        "Mentions ambiguity of sentinel values and why optional avoids it: 50%",
        "Mentions type safety / forcing explicit handling of empty case: 35%",
        "Mentions tradeoff/perf or when sentinel is acceptable (clear/unambiguous): 15%",
      ],
      reference_solution_md:
        "optional is better when sentinel is ambiguous or doesn't exist; it forces explicit handling and improves type safety. Sentinels can be ok when unambiguous and on hot paths.\n",
    },
  },
  {
    slug: "cpp-branch-prediction-layout-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Branch Prediction — A C++ Coding Implication",
    prompt_md:
      "Give one practical C++ coding implication of branch prediction and misprediction cost.\n\nAnswer in 5–10 sentences. You can use an example like handling rare error paths.",
    solution_md:
      "Mispredicted branches can cost many cycles because the CPU speculatively executes the wrong path and must flush/restart. A practical implication is to structure code so the hot/common path is the fall-through and rare error handling is off the main path. For example, check for unlikely errors and early-return, or separate slow-path handling to reduce instruction cache pressure.\n\nThis is not about micro-optimizing everything, but in tight loops it can matter.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["cpp", "performance"],
    source: "Performance engineering staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 110,
      rubric: [
        "Explains mispredictions cost cycles due to pipeline flush/speculation: 45%",
        "Gives a concrete coding implication (hot path fall-through; rare error slow path; early return): 45%",
        "Mentions scope/when it matters (tight loops; don't over-optimize) appropriately: 10%",
      ],
      reference_solution_md:
        "Mispredicted branches flush pipelines (costly). Keep hot path predictable; move rare error handling off hot path (early returns/slow path). Matters in tight loops.\n",
    },
  },
  {
    slug: "cpp-trivially-copyable-memcpy-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Trivially Copyable and `memcpy`",
    prompt_md:
      "What does it mean for a type to be trivially copyable, and why does it matter?\n\nAnswer in 5–10 sentences and mention when `memcpy`/binary IO is safe.",
    solution_md:
      "A trivially copyable type can be copied byte-for-byte (its copy/move operations are trivial and it has no complex invariants). This matters because it allows certain low-level operations like `memcpy` to be well-defined for copying objects, and makes it safer to treat the object representation as bytes.\n\nIt does not automatically mean it's safe to persist the bytes across processes/architectures (endianness, padding, ABI), but within a process it enables fast copies and serialization patterns when carefully controlled.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "performance", "ub"],
    source: "Modern C++ fundamentals",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 125,
      rubric: [
        "Defines trivially copyable as safe byte-wise copy within the language rules: 45%",
        "Connects to when memcpy/object-representation access is defined/safe: 35%",
        "Mentions a real caveat (padding/endianness/ABI for persistence) correctly: 20%",
      ],
      reference_solution_md:
        "Trivially copyable types can be copied byte-wise (memcpy) without UB, enabling fast copies. Caveat: persisting raw bytes across machines/ABIs can still be unsafe due to padding/endianness.\n",
    },
  },
  {
    slug: "cpp-string-small-buffer-realloc-pitfall-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "`std::string` Reallocation Pitfall (Pointers/Views)",
    prompt_md:
      "Explain a common pitfall where taking a pointer/view into a `std::string` becomes invalid later.\n\nAnswer in 5–10 sentences and mention reallocation.",
    solution_md:
      "Pointers/iterators/`string_view` into a `std::string` refer to its internal buffer. If the string grows past its current capacity (or transitions from SSO to heap), it can reallocate and move the buffer, invalidating existing pointers/views.\n\nThis shows up when you cache `c_str()` or keep a view across appends/modifications. The fix is to avoid keeping non-owning references across mutations, or to reserve capacity / store an owning copy.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["cpp", "lifetime", "containers"],
    source: "Common C++ pitfall",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 115,
      rubric: [
        "States that pointers/views into string refer to internal buffer and can be invalidated: 45%",
        "Mentions reallocation/growth/SSO transition as the trigger: 45%",
        "Mentions at least one mitigation (avoid caching; reserve; copy/own): 10%",
      ],
      reference_solution_md:
        "string can reallocate/move its buffer on growth (or SSO transition), invalidating cached pointers/views (c_str/string_view). Avoid holding views across mutation, or reserve/own a copy.\n",
    },
  },
  {
    slug: "cpp-rule-of-five-delete-why-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Deleting Copy/Move — Why You Might Do It",
    prompt_md:
      "When would you explicitly `delete` copy or move operations for a type, and why?\n\nAnswer in 6–10 sentences; give one example category of type (mutex, file descriptor wrapper, etc.).",
    solution_md:
      "You delete copy operations when copying would be nonsensical or unsafe (unique ownership of a resource like a file descriptor, mutex, socket, or hardware handle). You may delete move operations if moving would break invariants or if the type must remain at a stable address (rare, but sometimes for self-referential structures).\n\nDeleting operations makes misuse a compile-time error and communicates ownership semantics clearly. For unique-ownership resources you often allow move but delete copy.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["cpp", "raii", "api-design"],
    source: "Modern C++ design staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 125,
      rubric: [
        "Explains deleting copy to enforce unique ownership / non-copyable resource semantics: 55%",
        "Gives at least one concrete example type category (mutex, fd wrapper, socket handle): 25%",
        "Mentions move allowed vs deleted as a design choice and rationale: 20%",
      ],
      reference_solution_md:
        "Delete copy when copying is unsafe/nonsensical (unique resource: fd, mutex, socket). Usually allow move but delete copy; deleting makes misuse a compile-time error and clarifies ownership.\n",
    },
  },
  {
    slug: "cpp-abi-padding-offsetof-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Padding/ABI and `offsetof` (Why Layout Matters)",
    prompt_md:
      "Why can struct layout/padding matter for performance and correctness, and what does `offsetof` tell you?\n\nAnswer in 6–10 sentences and mention cache lines and ABI stability.",
    solution_md:
      "Padding affects the size and alignment of structs; poor layout can waste space, increase cache footprint, and cause extra cache misses. Layout also matters for correctness when doing binary serialization, interfacing with hardware/network protocols, or FFI, because ABI/packing expectations must match.\n\n`offsetof(Type, field)` gives the byte offset of a field within a standard-layout type, useful for verifying layouts and building low-level code. However, relying on layout across compilers/platforms is risky unless you control packing/ABI.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "abi", "performance"],
    source: "Systems/C++ staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 130,
      rubric: [
        "Explains padding/layout affects size/cache footprint and thus performance: 40%",
        "Explains layout matters for low-level correctness (serialization/FFI/protocols): 35%",
        "Explains what offsetof provides and notes portability/ABI caveat: 25%",
      ],
      reference_solution_md:
        "Layout/padding affects cache footprint and correctness for binary interfaces. offsetof gives byte offset of a field in standard-layout types; relying on layout across platforms needs ABI/packing control.\n",
    },
  },
  {
    slug: "cpp-std-function-overhead-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "`std::function` — Where Overhead Comes From",
    prompt_md:
      "Why can `std::function` introduce overhead compared to templated callables or function pointers?\n\nAnswer in 6–10 sentences and mention type erasure and allocations.",
    solution_md:
      "`std::function` uses type erasure to store any callable behind a uniform interface. That often implies an indirect call (virtual/erased dispatch) and potentially heap allocation if the callable doesn't fit in the small buffer (small object optimization).\n\nTemplated callables can be inlined and avoid allocations because the concrete type is known at compile time. In hot paths, prefer templates or lightweight function_ref-style views; use `std::function` where flexibility matters more than nanosecond-level overhead.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "performance", "abstractions"],
    source: "Performance engineering staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 130,
      rubric: [
        "Mentions type erasure and indirect call as core overhead: 45%",
        "Mentions potential heap allocation when callable doesn't fit SBO: 35%",
        "Contrasts with templates/inlining and gives a reasonable guidance tradeoff: 20%",
      ],
      reference_solution_md:
        "std::function type-erases callables: indirect dispatch and possible heap allocation if callable exceeds SBO. Templated callables can inline and avoid allocs; use std::function for flexibility, not hottest paths.\n",
    },
  },
  {
    slug: "cpp-virtual-destructor-why-mcq",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Virtual Destructor — When Needed?",
    prompt_md:
      "When do you need a virtual destructor in a base class?",
    solution_md:
      "When you intend to delete derived objects through a base-class pointer; otherwise deleting through the base pointer would be undefined behavior (derived destructor not called).",
    answer_kind: "mcq",
    answer_value: "delete-through-base",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["cpp", "oop", "ub"],
    source: "C++ core rule",
    target_roles: ["Dev"],
    answer_meta: {
      options: [
        { id: "delete-through-base", label: "When deleting derived objects via a base pointer.", correct: true },
        { id: "always", label: "Always; every class should have a virtual destructor.", correct: false },
        { id: "never", label: "Never; virtual destructors are always overhead with no benefit.", correct: false },
        { id: "only-templates", label: "Only when the base class is a template.", correct: false },
      ],
    },
  },
  {
    slug: "cpp-inline-functions-odr-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "ODR and `inline` (Why Header-Only Works)",
    prompt_md:
      "Explain why `inline` functions can be defined in headers included by many translation units without violating the One Definition Rule (ODR).\n\nAnswer in 5–10 sentences and mention linkage/duplicate definitions.",
    solution_md:
      "Normally, defining a non-inline function in a header included in multiple translation units creates multiple definitions at link time, violating ODR. Marking a function `inline` changes the ODR rule: it allows multiple identical definitions across translation units as long as they are the same.\n\nThe linker can then merge them. This is why header-only libraries often use `inline` (and templates, which are implicitly ODR-friendly in this way).",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "linking", "odr"],
    source: "C++ build/linking staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "States the problem: header-defined non-inline functions cause multiple definitions across TUs: 45%",
        "Explains inline relaxes ODR to allow multiple identical definitions: 40%",
        "Mentions linker merging/comdat or template/header-only context (high-level): 15%",
      ],
      reference_solution_md:
        "Without inline, header-defined functions produce multiple linker definitions. inline permits multiple identical definitions across TUs under ODR; linker merges them. This enables header-only patterns.\n",
    },
  },
  {
    slug: "cpp-atomic-false-sharing-why-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Atomics and False Sharing",
    prompt_md:
      "Why can updating two different `std::atomic<uint64_t>` variables from two threads still be slow, and how would you fix it?\n\nAnswer in 5–10 sentences.",
    solution_md:
      "Even though the atomics are different variables, if they share the same cache line, updates trigger cache coherence traffic (false sharing). Atomics can make this worse because they often imply stronger coherence behavior. The fix is to place them on separate cache lines using padding/`alignas(64)` or to shard per-thread and aggregate.\n\nThe key is reducing shared writable cache lines on hot paths.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["cpp", "atomics", "performance"],
    source: "Low-latency engineering staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 115,
      rubric: [
        "Identifies false sharing (same cache line) as the root cause: 55%",
        "Mentions coherence traffic/ping-pong and that atomics can intensify it: 25%",
        "Gives a concrete fix (padding/alignas; sharding + aggregation): 20%",
      ],
      reference_solution_md:
        "Two atomics can be slow if they share a cache line (false sharing) causing coherence ping-pong. Fix with padding/alignas to separate cache lines or shard per-thread.\n",
    },
  },
  {
    slug: "cpp-move-if-noexcept-why-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "`std::move_if_noexcept` — Why It Exists",
    prompt_md:
      "What is `std::move_if_noexcept`, and why does it matter for exception safety/performance in generic code?\n\nAnswer in 6–10 sentences and mention fallback to copy.",
    solution_md:
      "`std::move_if_noexcept(x)` returns an rvalue reference if moving `x` is noexcept (or if copying is not available), otherwise it returns an lvalue reference so code will copy instead of move. This matters because generic code (like container reallocation) often wants the strong exception guarantee: if moving can throw, copying may be safer to preserve invariants.\n\nUsing move_if_noexcept lets templates choose the best operation automatically: move when it's safe, otherwise copy, balancing performance and exception safety.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "exceptions", "move-semantics"],
    source: "Effective Modern C++ staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 130,
      rubric: [
        "Defines move_if_noexcept as selecting move only when move is noexcept (else copy): 55%",
        "Connects to strong exception safety in generic/container code: 30%",
        "Mentions performance tradeoff and that copy is fallback when move may throw: 15%",
      ],
      reference_solution_md:
        "move_if_noexcept chooses move when it's noexcept; otherwise it yields lvalue so code copies, helping strong exception safety in generic code (e.g., container relocation) while still enabling moves when safe.\n",
    },
  },
  {
    slug: "cpp-variant-vs-any-when-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "`std::variant` vs `std::any`",
    prompt_md:
      "Compare `std::variant` and `std::any`. When would you choose each?\n\nAnswer in 6–10 sentences and mention type safety and overhead.",
    solution_md:
      "`variant` is a tagged union over a fixed set of types known at compile time; access is type-safe via `std::get`/`std::visit` and the compiler can often optimize it well. `any` is type-erased: it can hold any type, but you must downcast with `any_cast` at runtime.\n\n`variant` is preferable when the set of alternatives is known (protocol messages, states) because it gives compile-time exhaustiveness via visitors. `any` is for plugin-like or generic storage where types are not known ahead of time, with more runtime checks and potential allocations.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["cpp", "type-erasure", "api-design"],
    source: "Modern C++ standard library",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 130,
      rubric: [
        "Correctly contrasts variant as fixed alternative set vs any as type-erased arbitrary type: 55%",
        "Mentions type safety/exhaustiveness of variant (visit) vs runtime cast of any: 30%",
        "Mentions overhead tradeoff (runtime checks/allocations/type erasure) appropriately: 15%",
      ],
      reference_solution_md:
        "variant: tagged union of known types, visited safely. any: type-erased box of arbitrary type, retrieved with any_cast at runtime. Choose variant for known alternatives; any for plugin/generic storage with more overhead.\n",
    },
  },
  {
    slug: "cpp-allocator-propagation-pmr-caveat-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Allocator Propagation — A `pmr` Caveat",
    prompt_md:
      "In allocator-aware containers (including `std::pmr` containers), what is a common caveat when copying/moving containers across different allocators/resources?\n\nAnswer in 6–10 sentences; mention propagation and that moving may allocate.",
    solution_md:
      "If two containers use different allocators/resources, moving from one to the other may not be a cheap pointer-swap; the standard allows (and sometimes requires) element-wise moves/allocations if allocators are not equal and not propagating. Allocator propagation traits control whether the allocator is propagated on move/copy/swap.\n\nIn `pmr`, this means moving a `pmr::vector` between different memory_resources can allocate and copy/move elements, which can surprise you on a hot path. Mitigation: keep allocator/resource consistent in a subsystem or design APIs to avoid cross-resource moves.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["cpp", "allocators", "pmr"],
    source: "Allocator-aware container rules",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 140,
      rubric: [
        "States that moving/copying across different allocators/resources may require element-wise moves/allocations: 55%",
        "Mentions allocator propagation traits (propagate_on_container_move_assignment/swap/copy) at a high level: 25%",
        "Mentions pmr-specific practical implication (moving between resources can allocate) and mitigation: 20%",
      ],
      reference_solution_md:
        "Allocator-aware containers may not do cheap moves if allocators differ; move can become element-wise with allocations unless propagation traits allow. For pmr, moving between different memory_resources can allocate—keep resources consistent or avoid cross-resource moves on hot paths.\n",
    },
  },
  {
    slug: "cpp-offsetof-standard-layout-why-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "`offsetof` and Standard-Layout Types",
    prompt_md:
      "Why is `offsetof(T, field)` only well-defined for standard-layout types?\n\nAnswer in 5–10 sentences and mention that complex inheritance/layout can break assumptions.",
    solution_md:
      "For standard-layout types, the language guarantees a predictable relationship between object address and member addresses that matches C-like layout assumptions, so `offsetof` can be meaningful. For non-standard-layout types (e.g., with multiple/virtual inheritance, reordered bases, or other complex layout), the memory layout can have compiler-specific adjustments, and the notion of a fixed byte offset may not be meaningful or well-defined.\n\nRestricting `offsetof` to standard-layout types avoids undefined behavior and portability traps.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "abi", "ub"],
    source: "C++ object model staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "States standard-layout provides predictable C-like member layout assumptions: 45%",
        "Mentions complex inheritance/virtual bases can make offsets non-portable/ill-defined: 40%",
        "Connects restriction to avoiding UB/portability issues: 15%",
      ],
      reference_solution_md:
        "offsetof is defined for standard-layout types because layout is C-like/predictable. Complex inheritance/virtual bases can make offsets ill-defined/non-portable, so restricting avoids UB traps.\n",
    },
  },
  {
    slug: "cpp-signed-overflow-ub-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Signed Integer Overflow — Why It’s UB",
    prompt_md:
      "In C++, why is signed integer overflow undefined behavior, and what practical problems can it cause?\n\nAnswer in 6–10 sentences and mention compiler optimizations.",
    solution_md:
      "The standard leaves signed overflow undefined so compilers can assume it never happens and apply aggressive optimizations (e.g., transform comparisons, remove checks) based on mathematical properties. If overflow does happen, the compiler may have optimized in ways that produce surprising results.\n\nPractical issues include security bugs (bounds checks optimized away) and logic errors under high values. Mitigations include using unsigned types when wraparound is intended, using wider types, or using checked arithmetic/sanitizers.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "ub", "security"],
    source: "C++ UB staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 135,
      rubric: [
        "States signed overflow is UB and compilers optimize assuming it doesn't happen: 55%",
        "Gives at least one practical consequence (removed checks, security/logic bug): 30%",
        "Mentions a mitigation (unsigned wrap, wider type, checked arithmetic/sanitizer): 15%",
      ],
      reference_solution_md:
        "Signed overflow is UB so compiler can assume it never occurs and optimize; if it occurs you can get surprising logic/security bugs. Mitigate with unsigned when wrapping intended, wider types, or checked arithmetic/sanitizers.\n",
    },
  },
  {
    slug: "cpp-exception-vs-error-code-hotpath-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Exceptions vs Error Codes on a Hot Path",
    prompt_md:
      "In low-latency C++, when might you prefer error codes over exceptions (or vice versa)?\n\nAnswer in 6–10 sentences and mention the 'rare path' assumption and code size/inlining.",
    solution_md:
      "Exceptions can be great when failures are truly rare: the hot path stays clean and can be optimized without carrying error-handling branches everywhere, but enabling exceptions can increase code size and affect inlining/ICache behavior, and unwinding is expensive when triggered.\n\nError codes make control flow explicit and predictable but can clutter hot code and introduce branches/checks that affect performance. Many low-latency systems use error codes on the absolute hottest path and reserve exceptions for initialization/configuration or truly exceptional states, depending on policy and tooling.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "performance", "api-design"],
    source: "Low-latency C++ tradeoff",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 140,
      rubric: [
        "Explains exceptions are good when failures are rare but unwinding is costly when hit: 40%",
        "Mentions code size/inlining/ICache or branch/check tradeoff for error codes: 35%",
        "Gives a reasonable guideline for where each is used (hot path vs init/rare): 25%",
      ],
      reference_solution_md:
        "Exceptions keep hot path clean if failures are rare, but unwinding is expensive and may affect code size/inlining. Error codes are explicit/predictable but add checks/branches. Many systems use error codes on hottest paths and exceptions in init/rare cases.\n",
    },
  },
];

