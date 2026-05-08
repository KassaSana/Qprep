import type { SeedQuestion } from "@/content/question-types";

/**
 * LLD (Low-Level Design) questions — graded as freeform.
 * The rubric for each is the contract the freeform grader will check.
 * These are intentionally bounded: keep designs to a handful of classes
 * with clean responsibilities, not a full system.
 */
export const LLD_SEED: SeedQuestion[] = [
  {
    slug: "lld-parking-lot",
    topic: "LLD",
    track: "dev",
    title: "Design a Parking Lot",
    prompt_md:
      "Design a parking-lot system that supports:\n\n- multiple floors, each with several spots\n- spot sizes (compact, standard, large) and matching vehicle types\n- park / unpark by license plate\n- query the number of available spots per size\n\nProvide the main classes you'd use, their key methods, and how they interact. You don't need code — pseudo-class definitions are fine.",
    solution_md:
      "A common design: `ParkingLot` aggregates `ParkingFloor`s; each floor owns a per-size `ParkingSpot` pool. `Vehicle` is a base class with `Compact`, `Standard`, `Large` subclasses (or a `size` enum). `ParkingLot.park(vehicle)` walks floors and asks each for the smallest fitting available spot, returning a `Ticket` keyed on license plate. `unpark(ticket)` releases the spot. `availableBySize()` aggregates counts across floors. Concurrency: a per-floor lock around the spot maps avoids whole-lot contention.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["lld", "design", "oop"],
    companies: ["Citadel", "Two Sigma"],
    source: "Classic LLD interview",
    answer_meta: {
      rubric: [
        "Names a top-level entity (e.g., `ParkingLot`) that aggregates floors: 25%",
        "Models per-floor `ParkingSpot`s with size/type and availability accounting: 25%",
        "Has a `Vehicle` model (hierarchy or size enum) and matching logic: 20%",
        "Describes `park`/`unpark` flow incl. ticket/license lookup and updates counts: 30%",
      ],
      min_words: 60,
      reference_solution_md:
        "`ParkingLot` -> `ParkingFloor[]` -> `ParkingSpot` (size). `Vehicle{Compact|Standard|Large}` matches spot size. `park(vehicle)` finds the smallest available fitting spot and returns a `Ticket` keyed by license plate. `unpark(ticket)` releases the slot. Aggregate `availableBySize()` for queries. Per-floor lock for concurrency.",
    },
  },
  {
    slug: "lld-url-shortener",
    topic: "LLD",
    track: "dev",
    title: "Design a URL Shortener (Code-Level)",
    prompt_md:
      "Design the in-process classes for a URL shortener (think the bit.ly *encoder*, not the full distributed service). Cover:\n\n- the encoding scheme (mapping a long URL to a short slug)\n- collision handling\n- whether the same URL maps to the same slug deterministically or via a counter\n- the in-memory data structures and their methods\n\nKeep it focused on a single-process design — no need to discuss distributed counters or replicated databases.",
    solution_md:
      "A typical design: a monotonic 64-bit counter assigned per insert is base62-encoded into a 7–11 character slug. Two hash maps, `slug_to_url` and `url_to_slug`, give $O(1)$ lookups in both directions; the second map enforces \"same URL maps to the same slug\" idempotency. `shorten(url)` returns the existing slug if present, else allocates a new counter, encodes it, and inserts both directions atomically. `expand(slug)` is a single map lookup. Counter-based generation eliminates collisions entirely; if you instead random-sample the slug space, you need a retry loop on collision.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["lld", "design", "encoding"],
    source: "Classic LLD interview",
    answer_meta: {
      rubric: [
        "Picks an encoding strategy (counter+base62 OR hash OR random with retry): 30%",
        "Stores slug→URL (and URL→slug for idempotency) with clear method APIs: 35%",
        "Discusses collision handling (or argues none with counter) and determinism: 20%",
        "Names `shorten(url)` and `expand(slug)` and their semantics: 15%",
      ],
      min_words: 60,
      reference_solution_md:
        "Counter + base62 encoder. Two hash maps: `slug_to_url`, `url_to_slug`. `shorten(url)` returns existing slug or allocates the next counter, encodes it, and inserts both maps. `expand(slug)` is a single $O(1)$ lookup. Counter-based generation has no collisions.",
    },
  },
  {
    slug: "lld-pubsub",
    topic: "LLD",
    track: "dev",
    title: "Design an In-Process Pub/Sub",
    prompt_md:
      "Design an in-process publish/subscribe library with these requirements:\n\n- `subscribe(topic, handler)` registers a callback for a topic and returns a handle\n- `unsubscribe(handle)` removes that callback\n- `publish(topic, message)` invokes every active subscriber for that topic\n- Subscribers can subscribe and unsubscribe concurrently with publishes\n\nDescribe your data structures and how you'd avoid (a) calling a removed handler and (b) holding a lock while running an arbitrary user callback.",
    solution_md:
      "Maintain `topics: Map<topic, Set<Subscription>>`. A `Subscription` carries the handler and a `cancelled` flag. On `subscribe`, lock the topic's set and insert; return the subscription as the handle. On `unsubscribe`, set `cancelled = true` and remove from the set under the lock. On `publish`, copy the current subscriber list under the lock, then release the lock and iterate, skipping subscriptions whose `cancelled` flag has flipped. This avoids calling removed handlers, and never runs user code while holding the lock.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["lld", "design", "concurrency"],
    companies: ["Citadel", "Two Sigma"],
    source: "Classic LLD interview",
    answer_meta: {
      rubric: [
        "Has a topic→subscriber-set/list data structure and a Subscription handle: 25%",
        "Defines subscribe/unsubscribe/publish semantics and return types clearly: 20%",
        "Explains concurrency strategy (snapshot/copy-on-publish) and avoids running user callbacks under lock: 35%",
        "Explains unsubscribe vs in-flight publish (cancel flag / snapshot semantics): 20%",
      ],
      min_words: 80,
      reference_solution_md:
        "Map<topic, Set<Subscription>>. Subscribe inserts under lock and returns the subscription as a cancellation handle. Unsubscribe sets `cancelled = true` and removes under lock. Publish snapshots the set under lock, releases, then iterates and skips cancelled subs. No user code runs under the lock.",
    },
  },
  {
    slug: "lld-limit-order-book",
    topic: "LLD",
    track: "dev",
    title: "Design a Limit Order Book (In-Process)",
    prompt_md:
      "Design an in-process limit order book for a single symbol.\n\nRequirements:\n- support `add(order_id, side, price, qty)`\n- support `cancel(order_id)`\n- support `modify(order_id, new_qty)` (price unchanged)\n- query best bid/ask\n- match logic is out of scope (you can ignore trades), but you must maintain price levels efficiently\n\nDescribe your main data structures and class interfaces. Keep it bounded to 5–8 main components.",
    solution_md:
      "A common design uses a map from price → FIFO queue (price level), plus an index from order_id → (side, price, pointer/iterator to node). For bids, use an ordered map with descending keys; for asks, ascending. Each price level holds an intrusive list or deque of orders to maintain time priority.\n\n`add` inserts into the appropriate price level and updates the order_id index. `cancel` uses the index to remove in O(1) from the level (intrusive list) and erases empty levels. `modify` finds the order via index and updates qty; if qty becomes 0, treat as cancel. Best bid/ask is the first key in each ordered map.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["lld", "data-structures", "order-book"],
    companies: ["Jane Street", "Citadel", "HRT"],
    source: "Quant-dev LLD staple",
    answer_meta: {
      min_words: 170,
      rubric: [
        "Uses price levels (price→queue/list) and preserves time priority within a level: 35%",
        "Maintains an order_id→location index to support O(1) cancel/modify: 35%",
        "Uses ordered structure for best bid/ask retrieval (two maps or one with comparator): 20%",
        "Mentions cleanup of empty price levels and key invariants: 10%",
      ],
      reference_solution_md:
        "Two ordered maps: bids (desc) and asks (asc): price→FIFO container. Index order_id→(side,price,iterator) enables O(1) cancel/modify. Best bid/ask from begin() of each map; remove empty levels on cancel.\n",
    },
  },
  {
    slug: "lld-token-bucket-rate-limiter",
    topic: "LLD",
    track: "dev",
    title: "Design a Token Bucket Rate Limiter",
    prompt_md:
      "Design a token-bucket rate limiter for an in-process API.\n\nRequirements:\n- configure rate r tokens/sec and burst capacity B\n- `allow(now)` returns true/false\n- thread-safe for multiple callers\n- avoid heavy locking on the hot path if possible\n\nDescribe your state variables and how `allow` updates them.",
    solution_md:
      "Keep state: `capacity B`, `rate r`, `tokens` (float or fixed-point), and `last_ts`. On `allow(now)`, compute elapsed time, refill `tokens = min(B, tokens + r * dt)`, then if tokens ≥ 1, decrement and allow.\n\nFor thread safety, use a mutex for simplicity; for lower overhead use an atomic CAS loop on a packed state (last_ts, tokens in fixed-point) or shard limiters per thread and aggregate. If exactness is required under contention, a lock is acceptable because the limiter is typically not on the tightest loop.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["lld", "rate-limiting", "concurrency"],
    source: "Systems design primitive",
    answer_meta: {
      min_words: 150,
      rubric: [
        "Defines token bucket state (tokens, last timestamp, rate, capacity) and refill formula: 55%",
        "Defines allow logic (refill then decrement if ≥1): 25%",
        "Addresses thread safety and mentions at least one approach (mutex or atomic CAS packed state): 20%",
      ],
      reference_solution_md:
        "State: tokens, last_ts, rate r, capacity B. allow(now): refill tokens by r*dt capped at B, then if tokens≥1 decrement and allow. Thread safety via mutex or atomic CAS on packed fixed-point state.\n",
    },
  },
  {
    slug: "lld-snowflake-id-generator",
    topic: "LLD",
    track: "dev",
    title: "Design a Snowflake-Style ID Generator",
    prompt_md:
      "Design an in-process unique ID generator inspired by Snowflake.\n\nRequirements:\n- IDs are 64-bit integers\n- IDs are roughly time-ordered\n- multiple threads call `next_id()` concurrently\n- handle same-millisecond bursts (sequence)\n- consider clock going backwards\n\nProvide the main state variables and `next_id()` logic. You can keep it single-process (no distributed coordination).",
    solution_md:
      "Maintain fields packed into 64 bits: timestamp (ms since epoch), machine_id (or process id), and sequence. State: last_ts, seq. On next_id: read now_ms. If now_ms == last_ts: seq++, and if seq overflows, spin/wait until next ms. If now_ms > last_ts: seq=0, last_ts=now_ms. If now_ms < last_ts (clock went backwards): either wait until last_ts, or use a 'logical clock' (stick to last_ts) and keep sequence.\n\nThread safety: guard last_ts/seq with a mutex or an atomic CAS on packed state.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["lld", "id", "concurrency"],
    source: "Common systems primitive",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 160,
      rubric: [
        "Defines packed fields (timestamp + node/process id + sequence) and rough time ordering: 35%",
        "Describes same-millisecond sequence increment and overflow behavior (wait/roll): 30%",
        "Mentions clock-backwards handling strategy (wait or logical clock) correctly: 20%",
        "Addresses thread safety (mutex or atomic packed state/CAS): 15%",
      ],
      reference_solution_md:
        "Pack timestamp(ms)+node_id+sequence. Keep last_ts and seq. If now==last_ts: seq++, overflow→wait next ms. If now>last_ts: reset seq. If clock goes backwards: wait or pin to last_ts with logical clock. Make it thread-safe with mutex or CAS on packed state.\n",
    },
  },
  {
    slug: "lld-circuit-breaker",
    topic: "LLD",
    track: "dev",
    title: "Design a Circuit Breaker",
    prompt_md:
      "Design a circuit breaker component for calling an unreliable downstream service.\n\nRequirements:\n- states: CLOSED, OPEN, HALF_OPEN\n- failure threshold over a rolling window\n- OPEN state blocks requests for a cooldown\n- HALF_OPEN allows a small number of trial requests\n- thread-safe\n\nProvide the main classes/state variables and method signatures.",
    solution_md:
      "Expose `allow_request(now)`/`on_success(now)`/`on_failure(now)` or wrap a callable `execute(fn)`. Maintain state enum, timestamps, and rolling counts (ring buffer of per-bucket failures/requests or a deque of failure timestamps). CLOSED: allow; if failure rate exceeds threshold, transition to OPEN with opened_at. OPEN: reject until cooldown passes then transition to HALF_OPEN. HALF_OPEN: allow up to N trials; if successes >= threshold, go CLOSED; any failure may revert to OPEN.\n\nThread safety via mutex; for higher perf, atomics around state + counters with careful ordering.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["lld", "resilience", "concurrency"],
    source: "Systems resilience primitive",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 170,
      rubric: [
        "Defines the three states and correct transitions incl. cooldown and trial requests: 45%",
        "Defines how failures are tracked over a window (ring buffer / timestamps) and threshold logic: 30%",
        "Defines a clean API (allow/record or execute wrapper) and how callers use it: 15%",
        "Mentions thread safety approach: 10%",
      ],
      reference_solution_md:
        "Circuit breaker with CLOSED/OPEN/HALF_OPEN. Track failures over rolling window (bucketed ring buffer). CLOSED allows until threshold triggers OPEN with cooldown. OPEN rejects until cooldown, then HALF_OPEN allows limited trials; success closes, failure reopens. API allow/record or execute(fn). Thread-safe via mutex/atomics.\n",
    },
  },
  {
    slug: "lld-object-pool",
    topic: "LLD",
    track: "dev",
    title: "Design an Object Pool (Low-Latency)",
    prompt_md:
      "Design an object pool for reusing fixed-size objects to avoid allocations on a hot path.\n\nRequirements:\n- `acquire()` returns an object (or null/throws if exhausted)\n- `release(obj)` returns it to the pool\n- optional: thread-local caching to reduce contention\n- detect double-free / use-after-release if possible\n\nProvide your main data structures and invariants.",
    solution_md:
      "Back the pool with a preallocated array of objects and a free-list (stack) of indices. `acquire` pops an index; `release` pushes it back. For thread safety, either lock around the free list, or use a lock-free stack with hazard/epoch reclamation (simpler since nodes are fixed). For performance, add per-thread caches (small local stacks) that refill/drain from a global pool.\n\nDebugging: keep an in-use bitset or generation counters to detect double release and stale handles.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["lld", "memory", "performance"],
    source: "Low-latency engineering staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 170,
      rubric: [
        "Defines preallocation + free-list (indices/stack) and acquire/release semantics: 45%",
        "Mentions contention mitigation (thread-local caches or lock-free stack) and invariants: 30%",
        "Mentions at least one safety/debug mechanism (bitset, generation counters) correctly: 25%",
      ],
      reference_solution_md:
        "Preallocate objects and manage a free-list (stack of indices). acquire pops, release pushes. Reduce contention with thread-local caches or a lock-free stack. Add debug checks (in-use bitset or generation counters) to detect double-free/stale releases.\n",
    },
  },
  {
    slug: "lld-config-hot-reload",
    topic: "LLD",
    track: "dev",
    title: "Design a Hot-Reloadable Config System",
    prompt_md:
      "Design an in-process configuration system that supports hot reload.\n\nRequirements:\n- config is a structured object (typed)\n- reloads happen periodically or on file change\n- readers are on hot paths and must not lock heavily\n- config updates must be atomic from the reader’s point of view\n\nProvide the classes and the read/update strategy.",
    solution_md:
      "Use immutable config snapshots: store `std::shared_ptr<const Config>` (or equivalent) as an atomic pointer. Readers do an atomic load and use the snapshot without locks. Updater builds a new Config object off-thread, validates it, then atomically swaps the pointer.\n\nOptionally include versioning and metrics for reload failures. This is classic RCU-style publishing for configs.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["lld", "rcu", "performance"],
    source: "Low-latency config pattern",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 160,
      rubric: [
        "Uses immutable snapshots and atomic publish/swap so readers see consistent config: 55%",
        "Mentions low-overhead reader path (atomic load, no locks) and writer builds off-thread: 25%",
        "Mentions validation/versioning/observability or failure handling: 20%",
      ],
      reference_solution_md:
        "Publish immutable Config snapshots via an atomic shared_ptr/pointer. Readers do atomic load and use snapshot lock-free. Writer builds/validates new config then atomically swaps. Optionally add versioning/metrics on reload.\n",
    },
  },
  {
    slug: "lld-sessionization-window",
    topic: "LLD",
    track: "dev",
    title: "Design a Sessionizer (Event Windows)",
    prompt_md:
      "Design a component that groups events into sessions.\n\nAn event has (user_id, timestamp). A session ends if there's a gap > G seconds between consecutive events for that user.\n\nRequirements:\n- `on_event(user_id, ts)` updates session state\n- `flush(now)` emits sessions that are complete (gap exceeded) without scanning all users\n- handle out-of-order events within a small tolerance (optional)\n\nProvide your main data structures and APIs.",
    solution_md:
      "Maintain per-user state (current session start, last_ts, count). To flush efficiently, keep a min-heap keyed by (deadline = last_ts+G, user_id). On event: update user state and push a new (deadline,user_id,version) entry; use a version counter to ignore stale heap entries. On flush(now): pop heap while deadline<=now, check if it matches current user version and last_ts, then emit and clear state.\n\nOut-of-order tolerance can be handled by allowing small backward adjustments or buffering, but must be bounded.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["lld", "streams", "heaps"],
    source: "Streaming systems primitive",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 180,
      rubric: [
        "Defines per-user session state and gap rule correctly: 35%",
        "Explains efficient flush using a heap of deadlines (no full scan) and stale-entry handling (versioning): 45%",
        "Mentions out-of-order handling strategy or explicitly bounds/declines it thoughtfully: 20%",
      ],
      reference_solution_md:
        "Keep per-user (session_start,last_ts,count) and a min-heap of (last_ts+G,user,version). On event update state and push new deadline with version. flush(now) pops while deadline<=now and emits only if entry matches current version (skip stale). Avoids scanning all users.\n",
    },
  },
  {
    slug: "lld-order-gateway-connection-manager",
    topic: "LLD",
    track: "dev",
    title: "Design an Order Gateway Connection Manager (In-Process)",
    prompt_md:
      "Design the in-process components for managing exchange connections in an order gateway.\n\nRequirements:\n- manage multiple sessions (per venue)\n- reconnect with backoff\n- expose `send(order)` and `on_message(msg)` hooks\n- maintain per-session sequence numbers and heartbeats\n\nProvide classes/interfaces (not full networking code) and key state variables.",
    solution_md:
      "Model a `VenueSession` per venue with state: connected/disconnected, next_out_seq, last_in_seq, last_heartbeat_ts. A `ConnectionManager` owns sessions and a scheduler/timer for heartbeats and reconnect backoff. `send(order)` routes to the session’s encoder and transport; if disconnected, it can reject or enqueue depending on policy. `on_message` decodes and updates sequence tracking and liveness.\n\nBackoff policy can be exponential with jitter. Keep responsibilities separated: transport, protocol codec, session state, and application callbacks.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["lld", "networking", "state-machine"],
    source: "Quant-dev gateway primitive",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 190,
      rubric: [
        "Defines per-venue session state machine (connect/reconnect/backoff, heartbeats): 45%",
        "Mentions sequence numbers and message handling state (in/out seq, liveness): 30%",
        "Provides clean class separation (transport/codec/session/manager) and APIs: 25%",
      ],
      reference_solution_md:
        "Per venue: VenueSession with connection state, seq numbers, heartbeat timers. ConnectionManager schedules reconnect with exponential backoff and heartbeats. send(order) routes via codec+transport; on_message decodes and updates seq/liveness. Separate transport, codec, session state, and app callbacks.\n",
    },
  },
  {
    slug: "lld-sliding-window-rate-limiter",
    topic: "LLD",
    track: "dev",
    title: "Design a Sliding-Window Rate Limiter (In-Process)",
    prompt_md:
      "Design an in-process per-key sliding-window rate limiter.\n\nRequirements:\n- limit: at most N requests per W seconds per key\n- `allow(key, now)` returns true/false\n- support many keys\n- avoid unbounded memory growth\n- thread-safe\n\nDescribe your data structures and how `allow` works. Keep it bounded (few components).",
    solution_md:
      "A simple exact approach stores a deque of timestamps per key. On allow(key, now): drop timestamps < now-W, then if size < N push now and allow else reject. To avoid unbounded keys, add an LRU/TTL eviction: if a key's deque becomes empty or hasn't been touched for some TTL, remove it.\n\nFor performance and lower memory, an approximate alternative is a ring buffer of per-bucket counts (fixed window buckets) per key. Thread safety: per-key locks (striped) or a concurrent map plus per-entry mutex.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["lld", "rate-limiting", "data-structures"],
    source: "Systems primitive",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 170,
      rubric: [
        "Defines correct sliding-window semantics and a concrete data structure (timestamp deque or bucket ring): 45%",
        "Explains `allow` steps: evict old events, check count, record new event: 30%",
        "Addresses memory bounds/eviction across many keys (TTL/LRU/cleanup): 15%",
        "Addresses thread safety (striped locks / per-key lock / atomic buckets): 10%",
      ],
      reference_solution_md:
        "Per key, keep deque of timestamps. allow: drop < now-W, if len<N push now and allow else reject. Bound memory with TTL/LRU eviction of inactive keys. Thread-safe with per-key/striped locks or per-entry mutex.\n",
    },
  },
  {
    slug: "lld-metrics-aggregator",
    topic: "LLD",
    track: "dev",
    title: "Design an In-Process Metrics Aggregator",
    prompt_md:
      "Design an in-process metrics aggregator library.\n\nRequirements:\n- counters: `inc(name, delta)`\n- gauges: `set(name, value)`\n- timers/histograms: `observe(name, value)`\n- periodic flush to a sink `export()` returning a snapshot\n- low overhead on hot path\n- thread-safe\n\nProvide your classes/data structures and how you avoid locks on the hot path (if possible).",
    solution_md:
      "Use sharding: per-thread or striped maps from metric name to metric state. Counters can be `std::atomic<int64_t>` per shard; flush sums across shards. Gauges can be atomic last-value (possibly with timestamp). Histograms can be fixed buckets or DDSketch-like approximation; per-shard bucket arrays updated without global locks.\n\n`export()` walks shards and aggregates into a snapshot object. Names can be interned to IDs to reduce hashing overhead. The key is: avoid a single global lock by sharding and using mostly atomic increments on the hot path.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["lld", "performance", "concurrency"],
    source: "Production engineering staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 190,
      rubric: [
        "Defines APIs for counter/gauge/histogram and a snapshot/export mechanism: 30%",
        "Uses sharding/per-thread/striped design to reduce contention and explains how flush aggregates: 40%",
        "Mentions concrete histogram approach (fixed buckets / approximate sketch) and update semantics: 20%",
        "Mentions name→id interning or other overhead-reduction idea: 10%",
      ],
      reference_solution_md:
        "Shard metrics state per thread/stripe. Counters: atomic increments per shard; export sums shards. Gauges: atomic last-value. Histograms: fixed buckets or sketch with per-shard bucket arrays. export() aggregates shards to a snapshot. Avoid global locks by sharding and atomics; optionally intern names to ids.\n",
    },
  },
];
