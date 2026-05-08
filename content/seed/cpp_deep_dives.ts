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
  {
    slug: "cpp-zero-initialization-vs-default-init-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Initialization: Default vs Value vs Zero (Common Bug)",
    prompt_md:
      "Explain a common bug related to uninitialized variables/fields in C++ and how initialization syntax affects it.\n\nAnswer in 6–10 sentences and mention that POD members may be uninitialized with default initialization.",
    solution_md:
      "In C++, default initialization of built-in types (like `int`) does not initialize them; they contain indeterminate values. This often bites when you create a struct/class with primitive members and rely on an implicit default constructor that doesn't set them.\n\nUsing value initialization (e.g., braces `{}`) typically zero-initializes aggregates and primitives. Best practice: always initialize members (in-class member initializers or constructors) and prefer brace initialization when you want zero-initialization.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["cpp", "bugs", "initialization"],
    source: "C++ fundamentals",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 135,
      rubric: [
        "States default initialization can leave primitives/fields indeterminate (uninitialized): 50%",
        "Contrasts with value/brace initialization leading to zero init in common cases: 35%",
        "Mentions mitigation (member initializers/constructors; brace init) clearly: 15%",
      ],
      reference_solution_md:
        "Default init can leave primitive members uninitialized. Brace/value init often zero-initializes. Fix by always initializing members (in-class initializers/ctors) and using {} when you need zero.\n",
    },
  },
  {
    slug: "cpp-one-definition-rule-violation-symptoms-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "ODR Violations — How They Show Up",
    prompt_md:
      "What is an ODR (One Definition Rule) violation and how can it show up in practice?\n\nAnswer in 6–10 sentences and mention inline functions/templates vs non-inline globals.",
    solution_md:
      "An ODR violation occurs when the program contains multiple conflicting definitions of an entity that must have a single definition (e.g., non-inline function, non-inline global variable). It can show up as link errors (multiple definition) or, worse, as runtime bugs if the linker allows multiple copies with different definitions (e.g., violating 'same definition' requirements for inline functions across TUs).\n\nTemplates and inline functions are allowed to have multiple identical definitions, but non-inline globals/functions in headers are a common trap.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "linking", "odr"],
    source: "C++ build/linking staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 140,
      rubric: [
        "Defines ODR violation as multiple conflicting definitions of an entity requiring one definition: 50%",
        "Mentions manifestations (linker multiple-definition errors or subtle runtime behavior): 25%",
        "Mentions header trap (non-inline globals/functions) and contrasts with allowed identical inline/template defs: 25%",
      ],
      reference_solution_md:
        "ODR violation: multiple conflicting definitions of an entity that must be single-defined. Often link errors, sometimes subtle runtime issues. Inline/template entities can have multiple identical defs; non-inline globals/functions in headers are common trap.\n",
    },
  },
  {
    slug: "cpp-const-correctness-why-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Const Correctness — Why It Matters",
    prompt_md:
      "Why does const correctness matter in C++ APIs?\n\nAnswer in 5–10 sentences and mention compiler guarantees and overloading.",
    solution_md:
      "Const correctness lets the compiler enforce which functions mutate state and which don't, preventing accidental modification and enabling safer interfaces. It allows calling methods on const objects and enables overloads (`T&` vs `const T&`) and optimizations (reasoning about aliasing/mutation).\n\nIt also improves readability: callers know what a function can do. Violating const correctness often forces unnecessary copying or prevents use in generic code.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["cpp", "api-design"],
    source: "C++ fundamentals",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "Mentions compiler-enforced non-mutation guarantees and safer APIs: 55%",
        "Mentions enabling const overloads / calling methods on const objects: 25%",
        "Mentions readability/generic-code/avoid copying angle appropriately: 20%",
      ],
      reference_solution_md:
        "Const correctness makes mutation explicit and compiler-enforced, enables const overloads and calling on const objects, and improves readability and generic usability.\n",
    },
  },
  {
    slug: "cpp-copy-elision-not-a-optimization-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Copy Elision — Not Just an Optimization",
    prompt_md:
      "Explain why copy elision (RVO) isn't just an optimization detail you can ignore.\n\nAnswer in 5–10 sentences and mention C++17 guaranteed elision and observable behavior (constructors not called).",
    solution_md:
      "With copy elision, the compiler can construct an object directly in its final storage without calling copy/move constructors at all. In C++17, some elisions are guaranteed, meaning your code must be correct even if copy/move constructors are never invoked for certain return patterns.\n\nThis affects observable behavior: side effects in copy/move constructors may not run, and it changes when objects are constructed/destructed. Therefore you should not rely on copy/move side effects for correctness.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "rvo", "performance"],
    source: "Modern C++ semantics",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 130,
      rubric: [
        "States copy elision can skip copy/move constructor calls entirely: 45%",
        "Mentions C++17 guaranteed elision and that code must be correct under it: 35%",
        "Mentions observable behavior angle (side effects may not happen; lifetime differences): 20%",
      ],
      reference_solution_md:
        "Copy elision can skip copy/move constructors; in C++17 some cases are guaranteed. Thus you can't rely on copy/move side effects; lifetimes/side effects may differ.\n",
    },
  },
  {
    slug: "cpp-std-visit-exhaustiveness-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "`std::visit` — Why It's Powerful",
    prompt_md:
      "Why is `std::visit` with `std::variant` often preferable to manual type tags + `switch`?\n\nAnswer in 5–10 sentences and mention exhaustiveness and type safety.",
    solution_md:
      "`std::visit` dispatches based on the active alternative of a variant in a type-safe way. It encourages handling all alternatives, and with helper patterns you can make missing cases a compile error (exhaustiveness).\n\nCompared to manual tags and void pointers/unions, variant+visit keeps the tag and value together, prevents mismatched tags, and makes refactoring safer when adding new alternatives.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["cpp", "variant", "api-design"],
    source: "Modern C++ best practice",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "Explains visit dispatches on active alternative with type safety: 50%",
        "Mentions exhaustiveness/refactor safety when adding alternatives: 35%",
        "Mentions avoiding mismatched tag/value bugs vs manual tagging: 15%",
      ],
      reference_solution_md:
        "visit dispatches based on variant alternative safely; it keeps tag+value together and can enforce handling all cases, making refactors safer than manual tags/switches.\n",
    },
  },
  {
    slug: "cpp-template-instantiation-code-bloat-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Templates and Code Bloat",
    prompt_md:
      "Why can heavy use of templates increase binary size and compile times, and why does that matter for performance?\n\nAnswer in 6–10 sentences and mention instruction cache.",
    solution_md:
      "Templates are instantiated for each set of template arguments used, potentially producing many copies of similar code. This increases compile times and can increase binary size.\n\nLarge binaries can harm runtime performance by increasing instruction cache pressure and reducing locality, which can hurt tail latency in hot loops. Mitigations include reducing template instantiations, using type-erasure in non-hot paths, explicit instantiation, and careful API design.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "performance", "build"],
    source: "C++ performance engineering",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 135,
      rubric: [
        "Explains template instantiation produces multiple code copies and increases compile time/binary size: 55%",
        "Connects large binaries to I-cache pressure/runtime performance/tail: 30%",
        "Mentions at least one mitigation (explicit instantiation, reduce variants, type erasure off hot path): 15%",
      ],
      reference_solution_md:
        "Templates instantiate per type set → code bloat and compile time. Bigger binaries can worsen I-cache locality and tail latency. Mitigate via fewer instantiations, explicit instantiation, and moving flexibility off hot paths.\n",
    },
  },
  {
    slug: "cpp-union-inactive-member-ub-mcq",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "UB: Reading Inactive Union Member",
    prompt_md:
      "In C++, which statement is most accurate about reading from a union member that was not most recently written?",
    solution_md:
      "In general it is undefined behavior (with some narrow exceptions like common initial sequence in standard-layout structs or reading object representation via unsigned char).",
    answer_kind: "mcq",
    answer_value: "ub-general",
    answer_tolerance: null,
    difficulty: 5,
    tags: ["cpp", "ub"],
    source: "C++ object model deep cut",
    target_roles: ["Dev"],
    answer_meta: {
      options: [
        {
          id: "ub-general",
          label:
            "Generally UB (with narrow exceptions like common initial sequence / object representation rules).",
          correct: true,
        },
        { id: "always-ok", label: "Always well-defined; unions are meant for type punning.", correct: false },
        { id: "always-compile-error", label: "Always a compile error.", correct: false },
        { id: "only-runtime", label: "Only a runtime error, never UB.", correct: false },
      ],
    },
  },
  {
    slug: "cpp-lifetime-of-temporary-extension-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Temporary Lifetime Extension — When It Does/Doesn't Happen",
    prompt_md:
      "When does binding a reference extend the lifetime of a temporary in C++?\n\nAnswer in 6–10 sentences and mention the common trap with returning references/views.",
    solution_md:
      "Binding a temporary directly to a `const T&` in a local variable declaration extends the temporary's lifetime to the lifetime of that reference. However, this does not generally extend across function boundaries: returning a reference or `string_view` to a temporary/local object will still dangle.\n\nA common trap is constructing a temporary string in an expression and storing a view/reference that outlives it. The safe approach is to return/store an owning object, or ensure the referenced object has a longer lifetime.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "lifetime", "bugs"],
    source: "C++ lifetime rules staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 140,
      rubric: [
        "States lifetime extension occurs when binding temporary to const reference in a local declaration: 50%",
        "States it doesn't save returning references/views to locals/temporaries (dangling trap): 35%",
        "Mentions mitigation (owning return, ensure lifetime) clearly: 15%",
      ],
      reference_solution_md:
        "Temporary lifetime can be extended by binding to a const reference in a local declaration, but returning references/views to temporaries/locals still dangles. Prefer owning returns or ensure longer-lived storage.\n",
    },
  },
  {
    slug: "cpp-sso-and-string-view-interaction-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "SSO and `string_view` Interaction",
    prompt_md:
      "Why can SSO make `string_view` bugs harder to detect?\n\nAnswer in 4–8 sentences and mention that a dangling view might appear to work sometimes.",
    solution_md:
      "With SSO, small strings store their characters inside the string object itself. If you take a `string_view` to a small temporary string, the view may point into stack memory that happens to remain unchanged for a while, making the bug appear to work in tests.\n\nWhen the string grows (heap allocation) or stack layout changes, it breaks. SSO increases the chance of \"heisenbugs\" because memory may look valid temporarily.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "lifetime", "bugs"],
    source: "Modern C++ pitfall",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 115,
      rubric: [
        "Explains SSO stores small data inline in object (often stack) so views can point to stack memory: 50%",
        "Explains why bug can seem to work (stack memory unchanged) and later fail: 35%",
        "Mentions mitigation (avoid views to temporaries; own data) briefly: 15%",
      ],
      reference_solution_md:
        "SSO keeps small string bytes inline; a view to a temporary may point into stack memory that 'looks valid' for a while, hiding dangling bugs until layout changes. Avoid views to temporaries; keep ownership/lifetime clear.\n",
    },
  },
  {
    slug: "cpp-returning-span-from-vector-ub-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Returning a `span`/Pointer into a Temporary",
    prompt_md:
      "Explain why returning a `std::span` (or pointer) into a temporary container (like a local `std::vector`) is a bug.\n\nAnswer in 5–10 sentences and connect to lifetime.",
    solution_md:
      "A span/pointer is non-owning and references memory owned by something else. If you return a span into a local vector, the vector is destroyed at function exit and its buffer is freed; the returned span dangles immediately.\n\nEven if it appears to work in tests, it's undefined behavior. The fix is to return an owning object (vector/string) or ensure the referenced storage outlives the span (caller-owned buffer, static storage, arena with appropriate lifetime).",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["cpp", "lifetime", "bugs"],
    source: "Modern C++ pitfall",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "States span/pointer is non-owning and depends on underlying storage lifetime: 45%",
        "Explains local container destruction frees buffer → dangling view: 45%",
        "Mentions a correct fix (return owning; caller-owned storage; longer lifetime): 10%",
      ],
      reference_solution_md:
        "Returning span/pointer into local vector returns a non-owning view to memory that is freed when vector is destroyed → dangling UB. Fix: return owning object or ensure storage outlives the view.\n",
    },
  },
  {
    slug: "cpp-aliasing-and-restrict-equivalent-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Aliasing and Optimizations (Why Compilers Care)",
    prompt_md:
      "Why do compilers care about aliasing, and how does it relate to performance?\n\nAnswer in 6–10 sentences and mention that fewer aliasing possibilities enable better optimization.",
    solution_md:
      "If the compiler can assume two pointers don't alias, it can keep values in registers, reorder loads/stores, and vectorize more aggressively because it doesn't need to conservatively reload memory after every store. If aliasing is possible, it must assume stores may affect later loads through other pointers.\n\nC++ strict aliasing and type-based alias analysis are key tools. In performance-critical code, writing alias-friendly code (clear ownership, restrict-like patterns, avoiding ambiguous pointers) can materially improve optimization.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "optimization", "performance"],
    source: "Compiler optimization staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 135,
      rubric: [
        "Explains non-aliasing assumptions enable register caching/reordering/vectorization: 55%",
        "Explains aliasing forces conservative reloads and blocks some optimizations: 30%",
        "Mentions strict aliasing / TBAA or writing alias-friendly code as practical lever: 15%",
      ],
      reference_solution_md:
        "If pointers don't alias, compiler can reorder and keep values in registers and vectorize. If aliasing possible, it must reload conservatively. Strict aliasing/TBAA and clear ownership patterns enable better optimization.\n",
    },
  },
  {
    slug: "cpp-std-byte-why-mcq",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Why `std::byte` Exists",
    prompt_md:
      "Which statement best describes why `std::byte` exists (vs using `char`)?",
    solution_md:
      "`std::byte` is a distinct type intended for raw memory/object representation, making intent explicit and avoiding accidental arithmetic/character semantics.",
    answer_kind: "mcq",
    answer_value: "intent",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["cpp", "memory"],
    source: "Modern C++ library design",
    target_roles: ["Dev"],
    answer_meta: {
      options: [
        {
          id: "intent",
          label:
            "`std::byte` is a distinct type for raw memory/object representation; it makes intent explicit and avoids char/arith semantics.",
          correct: true,
        },
        { id: "faster", label: "`std::byte` is always faster than `char`.", correct: false },
        { id: "bigger", label: "`std::byte` is 16 bits; `char` is 8 bits.", correct: false },
        { id: "unicode", label: "`std::byte` is for Unicode text.", correct: false },
      ],
    },
  },
  {
    slug: "cpp-byte-object-representation-aliasing-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "`std::byte` vs `unsigned char` for Object Representation",
    prompt_md:
      "When dealing with raw object representation bytes, why do many C++ rules mention `unsigned char` (and now `std::byte`)?\n\nAnswer in 5–10 sentences and mention aliasing rules at a high level.",
    solution_md:
      "The language grants special aliasing permissions to character types: you can inspect an object's representation via `unsigned char*` safely. This exists so low-level code can copy/serialize/inspect bytes without violating strict aliasing. `std::byte` provides an explicit \"byte\" type for intent, but aliasing rules historically center on `char`/`unsigned char`.\n\nThe key point is: arbitrary type-punning through unrelated pointer types is UB; viewing as bytes is the sanctioned route.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["cpp", "ub", "memory"],
    source: "C++ object model staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 135,
      rubric: [
        "States character types have special permission to view object representation as bytes: 55%",
        "Connects this to strict aliasing/type-punning being UB and bytes as the sanctioned route: 30%",
        "Mentions std::byte as intent type and why rules historically mention unsigned char: 15%",
      ],
      reference_solution_md:
        "C++ allows examining object representation via (unsigned) char pointers (aliasing exception). This enables byte-level inspection without UB. std::byte makes intent explicit; unrelated type-punning remains UB.\n",
    },
  },
  {
    slug: "cpp-mutex-move-copy-mcq",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Why `std::mutex` Is Non-Copyable",
    prompt_md:
      "Why is `std::mutex` non-copyable (and non-movable) in C++?",
    solution_md:
      "Copying/moving a mutex would be ambiguous/unsafe because it represents a synchronization primitive tied to a specific state/OS object; duplicating it would break mutual exclusion semantics.",
    answer_kind: "mcq",
    answer_value: "semantics",
    answer_tolerance: null,
    difficulty: 2,
    tags: ["cpp", "concurrency"],
    source: "C++ core rule",
    target_roles: ["Dev"],
    answer_meta: {
      options: [
        {
          id: "semantics",
          label:
            "Because copying/moving would be ambiguous/unsafe for a primitive tied to a specific OS/state; it would break mutual exclusion semantics.",
          correct: true,
        },
        { id: "performance", label: "Because it would be too slow.", correct: false },
        { id: "templates", label: "Because mutexes cannot be templates.", correct: false },
        { id: "alignment", label: "Because it cannot be aligned.", correct: false },
      ],
    },
  },
  {
    slug: "cpp-std-vector-growth-factor-why-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Vector Growth Factor — Why Not Grow by +1?",
    prompt_md:
      "Why do dynamic arrays (like `std::vector`) typically grow geometrically (e.g., ×1.5 or ×2) instead of growing by +1 element each time?\n\nAnswer in 5–10 sentences and mention amortized cost.",
    solution_md:
      "Growing by +1 would cause a reallocation and copy/move of all elements on almost every insertion, making the total cost over n pushes O(n^2). Geometric growth makes the total relocation work O(n) via a geometric series, giving O(1) amortized insertion.\n\nThe tradeoff is some unused capacity (memory overhead) for better performance and fewer reallocations (better tail latency).",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["cpp", "performance", "amortized-analysis"],
    source: "CS/DS staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "Explains +1 growth leads to O(n^2) total copies/moves over n inserts: 45%",
        "Explains geometric growth yields O(1) amortized insertion via O(n) total relocation: 40%",
        "Mentions tradeoff (extra capacity/memory) and benefit (fewer spikes): 15%",
      ],
      reference_solution_md:
        "Growing by +1 reallocates almost every push → O(n^2) total work. Geometric growth makes total relocation O(n), yielding O(1) amortized insertion; tradeoff is extra capacity.\n",
    },
  },
  {
    slug: "cpp-std-memcpy-nontrivial-why-ub-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Why `memcpy`ing Non-Trivial Types Is Dangerous",
    prompt_md:
      "Why is using `memcpy` to copy non-trivially-copyable C++ objects dangerous?\n\nAnswer in 6–10 sentences and mention invariants/ownership.",
    solution_md:
      "Non-trivial types often manage resources (ownership, pointers, reference counts) and have invariants maintained by constructors/destructors. `memcpy` performs a byte-wise copy without running those operations, which can duplicate pointers/handles and cause double-free, leaks, or broken invariants.\n\nOnly trivially copyable types can be safely copied this way. For others, use copy/move constructors or serialization logic that understands the type.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["cpp", "ub", "memory"],
    source: "C++ fundamentals",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 130,
      rubric: [
        "States non-trivial types have invariants/resources managed by ctors/dtors: 45%",
        "Explains memcpy bypasses ctors/dtors causing double-free/leaks/broken invariants: 45%",
        "States safe rule: only trivially copyable; otherwise use proper copy/move/serialize: 10%",
      ],
      reference_solution_md:
        "memcpy bypasses constructors/destructors; for non-trivial resource-owning types it duplicates internal pointers/handles causing double-free/leaks/invariant break. Only trivially copyable types are safe for byte-wise copy.\n",
    },
  },
  {
    slug: "cpp-hidden-allocations-hot-path-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Design Smell: Hidden Allocations on Hot Paths",
    prompt_md:
      "Give three examples of standard C++ library operations that can hide allocations (and thus cause tail-latency spikes) if you're not careful.\n\nAnswer in 6–10 sentences and include at least one mitigation technique.",
    solution_md:
      "Examples: `std::string` growth/appends reallocating; `std::vector` growth without reserve; `std::unordered_map` rehashing; `std::function` allocating for large callables; `shared_ptr` control-block allocations.\n\nMitigations include reserving capacity, using `pmr`/pool allocators, preallocating and reusing buffers, and keeping allocation off the hot path by moving work to a background thread.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "performance", "allocations"],
    source: "Low-latency engineering staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 145,
      rubric: [
        "Lists at least three real hidden-allocation sources in stdlib containers/abstractions: 55%",
        "Connects hidden allocations to tail-latency spikes: 15%",
        "Mentions at least one mitigation (reserve, pmr/pool, reuse buffers, move off hot path): 30%",
      ],
      reference_solution_md:
        "Hidden allocations: string/vector growth, unordered_map rehash, std::function for large callables, shared_ptr control blocks. Mitigate with reserve, pmr/pools, buffer reuse, and keeping allocs off hot path.\n",
    },
  },
  {
    slug: "cpp-atomic-ref-what-when-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "`std::atomic_ref` — What Problem It Solves",
    prompt_md:
      "What is `std::atomic_ref<T>`, and when would you use it instead of `std::atomic<T>`?\n\nAnswer in 6–10 sentences and mention that it refers to existing storage and alignment requirements.",
    solution_md:
      "`std::atomic_ref<T>` provides atomic operations on an existing `T` object without changing its type to `std::atomic<T>`. It’s useful when you need atomic access to data that is stored in a layout you can’t change (e.g., a struct shared with C/FFI, a packed array, or memory-mapped/shared memory layout).\n\nBecause it references existing storage, the referenced object must be suitably aligned and must not be concurrently accessed non-atomically (data race rules still apply). Lifetime also matters: the referenced `T` must outlive the `atomic_ref`.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["cpp", "atomics", "memory-model"],
    source: "Modern C++ concurrency tool",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 140,
      rubric: [
        "Defines atomic_ref as providing atomic ops on existing non-atomic storage (without changing the object type): 55%",
        "Gives a plausible use case where you can't change layout/type (FFI/shared memory/arrays): 25%",
        "Mentions key caveats: alignment + no mixed atomic/non-atomic concurrent access + lifetime: 20%",
      ],
      reference_solution_md:
        "atomic_ref gives atomic operations over existing storage (no need to store as std::atomic). Use it when layout/type can't change (FFI/shared memory/arrays). Caveats: alignment, lifetime, and you still must avoid mixed atomic/non-atomic concurrent access.\n",
    },
  },
  {
    slug: "cpp-relaxed-atomic-when-ok-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "When Is `memory_order_relaxed` OK?",
    prompt_md:
      "Give one scenario where `memory_order_relaxed` is correct, and one where it is not.\n\nAnswer in 6–10 sentences and mention that relaxed gives atomicity but not ordering.",
    solution_md:
      "Relaxed atomics provide atomic read-modify-write/loads/stores but do not create ordering or synchronization with other memory operations. A correct use is a statistics counter where you only need atomicity of the increment and don't use the value to publish or guard access to other data.\n\nA not-correct use is a “publish data then set flag” pattern: if a reader uses a relaxed load of the flag to decide the data is ready, it may observe the flag but still see stale data due to reordering/visibility. That needs release/acquire (or stronger).",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "atomics", "memory-model"],
    source: "C++ memory model staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 135,
      rubric: [
        "States relaxed provides atomicity but no ordering/synchronization: 45%",
        "Gives a correct example use case (counters/stats) with appropriate reasoning: 30%",
        "Gives a not-correct example (publish flag) and mentions release/acquire as fix: 25%",
      ],
      reference_solution_md:
        "Relaxed = atomicity without ordering. OK for independent counters/stats. Not OK for publish-then-flag; reader might see flag without data. Use release/acquire for publication.\n",
    },
  },
  {
    slug: "cpp-shared-ptr-aliasing-ctor-why-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "`shared_ptr` Aliasing Constructor — Why It Exists",
    prompt_md:
      "What is the `shared_ptr` aliasing constructor, and what problem does it solve?\n\nAnswer in 6–10 sentences and mention shared ownership + pointing to a subobject.",
    solution_md:
      "The aliasing constructor lets you create a `shared_ptr<U>` that shares ownership with an existing `shared_ptr<T>` (same control block) but points to a different address, typically a subobject (like a field inside `T`) or an element within a managed buffer.\n\nThis solves the problem of wanting a non-owning pointer into an object while still keeping the object alive via shared ownership. Without it, you might use a raw pointer to a subobject and accidentally outlive the owning shared_ptr.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "smart-pointers", "lifetime"],
    source: "Modern C++ standard library",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 130,
      rubric: [
        "Defines aliasing constructor as sharing ownership/control block but pointing to a different address (subobject): 55%",
        "Explains the problem it solves (keep owner alive while exposing subobject pointer safely): 35%",
        "Mentions a realistic example category (field/view into buffer) without confusion: 10%",
      ],
      reference_solution_md:
        "Aliasing ctor: new shared_ptr shares the same control block/ownership but points at a subobject/other address. It keeps the owner alive while handing out a pointer to part of it, avoiding dangling raw subobject pointers.\n",
    },
  },
  {
    slug: "cpp-virtual-inheritance-costs-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Virtual Inheritance — What Does It Cost?",
    prompt_md:
      "At a high level, what does virtual inheritance change, and what costs can it introduce?\n\nAnswer in 6–10 sentences and mention object layout and pointer adjustment.",
    solution_md:
      "Virtual inheritance ensures there is only one shared base subobject when multiple paths inherit from the same base (diamond problem). To support this, object layout becomes more complex and access to the virtual base can require runtime pointer adjustment (often via extra metadata).\n\nCosts include larger objects (extra pointers/offset tables), more complex construction/destruction, and potentially slower base access and worse cache locality. It’s primarily a correctness/design tool, not a performance one.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["cpp", "abi", "performance"],
    source: "C++ object model/ABI intuition",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 140,
      rubric: [
        "States what virtual inheritance achieves (single shared base in diamond): 40%",
        "Mentions layout complexity/pointer adjustment/metadata as the mechanism: 35%",
        "Mentions realistic costs (size, ctor/dtor complexity, slower access/cache): 25%",
      ],
      reference_solution_md:
        "Virtual inheritance ensures one shared base in diamond. Mechanism involves more complex layout and runtime pointer adjustments/metadata. Costs: bigger objects, more complex ctors/dtors, potentially slower access and worse locality.\n",
    },
  },
  {
    slug: "cpp-small-object-optimization-when-breaks-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Small Object Optimization — When It Breaks",
    prompt_md:
      "Many standard-library types use small-object optimization (SBO/SSO). Give one example and explain what changes when the object exceeds the small buffer.\n\nAnswer in 6–10 sentences and connect to tail latency.",
    solution_md:
      "Examples include `std::string` (SSO) and `std::function` (SBO for small callables). When the payload fits, the object stores data inline with no heap allocation; once it exceeds the small buffer, it allocates on the heap and stores a pointer.\n\nCrossing that threshold can create unexpected allocations and copies/moves, causing latency spikes. In low-latency code, you often constrain sizes, preallocate, or use alternative representations to avoid threshold-crossing on hot paths.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpp", "performance", "allocations"],
    source: "Low-latency C++ staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 135,
      rubric: [
        "Gives a correct SBO/SSO example (string/function/etc.) and states it stores small payload inline: 45%",
        "Explains what changes when exceeding buffer (heap allocation + pointer indirection): 35%",
        "Connects threshold crossing to tail latency and mentions a mitigation: 20%",
      ],
      reference_solution_md:
        "SBO/SSO stores small payload inline (e.g., string, function). If it exceeds the buffer, it heap-allocates and adds indirection. Crossing the threshold can cause allocation spikes; mitigate by size constraints, preallocation, or alternatives.\n",
    },
  },
  {
    slug: "cpp-bool-bitset-atomicity-false-sharing-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Packed Bits and 'Accidental Sharing'",
    prompt_md:
      "Why can packing many flags into a single word (bitset/bitfield) create contention between threads even if each thread updates a different flag?\n\nAnswer in 6–10 sentences and mention cache lines / read-modify-write.",
    solution_md:
      "Even if threads conceptually update different bits, the hardware typically updates the containing word using a read-modify-write sequence. That means both threads repeatedly write to the same cache line (and often the same word), causing heavy coherence traffic.\n\nThis is similar to false sharing but worse because it’s the same word. A fix is to use per-thread/sharded flags, separate words/cache lines for independently-updated flags, or redesign to avoid frequent shared writes.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["cpp", "performance", "cache", "concurrency"],
    source: "Low-latency concurrency pitfall",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 140,
      rubric: [
        "Explains bit updates are read-modify-write on the containing word, not independent per-bit writes: 45%",
        "Connects to cache-line sharing/coherence traffic/contestion correctly: 40%",
        "Gives at least one correct mitigation (sharding, separate words/cache lines, redesign): 15%",
      ],
      reference_solution_md:
        "Different bits still share the same word; updates are read-modify-write, so threads repeatedly write the same cache line/word causing coherence contention. Mitigate via sharding, separate words/cache lines, or avoiding shared hot writes.\n",
    },
  },
  {
    slug: "cpp-aba-problem-what-is-it-freeform",
    topic: "C++ Deep Dives",
    track: "dev",
    title: "Lock-Free Pitfall: The ABA Problem",
    prompt_md:
      "What is the ABA problem in lock-free programming, and name two common mitigation strategies.\n\nAnswer in 6–10 sentences and mention CAS (compare-and-swap).",
    solution_md:
      "The ABA problem occurs when a thread reads a value A, gets descheduled, and later uses CAS expecting the value is still A. If another thread changes the value from A→B→A in the meantime, the CAS can succeed even though the underlying state changed, breaking correctness (e.g., in lock-free stacks/queues with pointer reuse).\n\nMitigations include tagging/versioning (store a counter with the pointer/value so A with version 1 differs from A with version 2), hazard pointers/epochs to prevent reclamation/reuse while readers exist, and using APIs that avoid ABA-sensitive representations.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["cpp", "concurrency", "lock-free"],
    source: "Lock-free programming staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 150,
      rubric: [
        "Defines ABA in the CAS context (A read; changes A→B→A; CAS spuriously succeeds): 55%",
        "Connects to pointer reuse/memory reclamation as common trigger: 20%",
        "Names two correct mitigations (tagged/versioned pointers, hazard pointers/epochs/RCU-style): 25%",
      ],
      reference_solution_md:
        "ABA: CAS sees A again after A→B→A, so it succeeds though state changed (often due to pointer reuse). Mitigate with version tags/counters (tagged pointers) and safe reclamation (hazard pointers/epochs/RCU).\n",
    },
  },
];

