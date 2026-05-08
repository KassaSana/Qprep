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
  {
    slug: "lld-dedup-cache-ttl",
    topic: "LLD",
    track: "dev",
    title: "Design a De-dup Cache with TTL",
    prompt_md:
      "Design an in-process de-duplication cache to drop duplicate events.\n\nRequirements:\n- `seen(event_id, now)` returns true if event_id was seen within last TTL seconds, else records it and returns false\n- bounded memory\n- thread-safe\n- TTL-based eviction (no full scans)\n\nProvide classes/data structures and key invariants.",
    solution_md:
      "Use a hash map event_id→(expires_at, node) plus a min-heap (or timing wheel) keyed by expires_at. On seen(): evict expired entries by popping heap while expires_at<=now, validating against map (versioning to skip stale heap entries). Then check map for event_id; if present and not expired => seen; else insert with expires_at=now+TTL and push to heap.\n\nBound memory by max size: if exceeded, evict earliest-expiring entries or use LRU as fallback. Thread safety via a mutex or striped locks; hot-path can be optimized with sharding.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["lld", "caching", "heaps"],
    source: "Streaming correctness primitive",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 170,
      rubric: [
        "Defines API semantics (seen-within-TTL) and correct behavior on insert/check: 35%",
        "Explains TTL eviction without full scans (heap/timing wheel) and stale-entry handling: 40%",
        "Addresses bounded memory (max size policy) and thread safety approach: 25%",
      ],
      reference_solution_md:
        "Map event_id→expires_at plus min-heap of (expires_at,event_id,version). seen(): evict expired by popping heap and validating, then check/insert. Bound memory via max size eviction. Thread-safe via mutex/striped locks.\n",
    },
  },
  {
    slug: "lld-timer-wheel",
    topic: "LLD",
    track: "dev",
    title: "Design a Timer Wheel Scheduler",
    prompt_md:
      "Design a timer scheduler using a timing wheel.\n\nRequirements:\n- `schedule(delay_ms, callback)` returns a handle\n- `cancel(handle)`\n- `tick(now_ms)` runs due callbacks\n- many timers; avoid O(n) scans\n- do not run user callbacks while holding locks\n\nDescribe your wheel structure and how you handle long delays.",
    solution_md:
      "Use a circular array of buckets, each bucket a list of timer nodes. Wheel resolution is `tick_ms`. A timer maps to slot = (current_slot + delay/tick_ms) mod wheel_size, with a `rounds` count for delays beyond one revolution. On tick(), advance slot, decrement rounds for timers in bucket; execute those with rounds==0.\n\nCancel marks node cancelled and removes from bucket if you have pointers; otherwise lazy-cancel with a flag. Snapshot due callbacks under lock, then execute after releasing lock.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["lld", "timers", "performance"],
    source: "Networking/runtime primitive",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 190,
      rubric: [
        "Describes timing wheel buckets/slots and mapping delay to slot: 40%",
        "Handles long delays via rounds/hierarchical wheels and explains tick processing: 35%",
        "Addresses cancel semantics and not running callbacks under lock (snapshot): 25%",
      ],
      reference_solution_md:
        "Circular wheel of buckets at tick resolution. schedule maps delay to slot and rounds count. tick advances slot; timers with rounds==0 fire, others decrement rounds. Cancel via removal pointer or lazy flag. Collect due callbacks under lock then run after releasing.\n",
    },
  },
  {
    slug: "lld-fixed-capacity-hashmap",
    topic: "LLD",
    track: "dev",
    title: "Design a Fixed-Capacity Hash Map (No Rehash)",
    prompt_md:
      "Design an in-process hash map with fixed capacity for low-latency use.\n\nRequirements:\n- no rehashing on hot path (capacity fixed)\n- `get/put/erase`\n- handle collisions\n- define behavior when full\n- thread-safety is optional (say what you'd do)\n\nProvide a bounded design (few structs) and key tradeoffs.",
    solution_md:
      "Pick open addressing (linear/robin-hood) with an array of slots: {state, key, value, fingerprint}. put probes until empty/deleted slot; get probes until empty slot or key found; erase marks tombstone. Behavior when full: reject puts or overwrite with a policy.\n\nTradeoffs: tombstones degrade performance; consider periodic maintenance off hot path. Thread safety: simplest is single-thread use; otherwise shard by hash and lock per shard.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["lld", "hashmap", "performance"],
    source: "Low-latency DS primitive",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 170,
      rubric: [
        "Defines fixed-capacity slot array + collision strategy (open addressing/chaining) and core ops: 45%",
        "Defines full-table behavior and deletion semantics (tombstones or free list): 30%",
        "Mentions tradeoffs (tombstone accumulation, probe lengths) and concurrency option (sharding/locks): 25%",
      ],
      reference_solution_md:
        "Fixed slot array with open addressing (linear/robin-hood). put/get probe; erase uses tombstones. When full, reject or apply overwrite policy. Tombstones can degrade; do maintenance off hot path. Concurrency via sharding + per-shard lock or single-thread ownership.\n",
    },
  },
  {
    slug: "lld-order-state-machine",
    topic: "LLD",
    track: "dev",
    title: "Design an Order State Machine",
    prompt_md:
      "Design the in-process state machine for handling order lifecycle.\n\nEvents include:\n- New(order)\n- Ack\n- Reject\n- Fill(qty)\n- CancelRequest\n- CancelAck\n- CancelReject\n\nRequirements:\n- maintain remaining quantity\n- reject invalid transitions\n- expose callbacks for downstream (positions/pnl)\n\nProvide main classes and how you'd encode transitions.",
    solution_md:
      "Represent state as an enum (NEW_SENT, LIVE, PARTIALLY_FILLED, FILLED, CANCEL_PENDING, CANCELED, REJECTED). Maintain fields: order_id, orig_qty, filled_qty, remaining, last_event_seq. Implement `apply(event)` that validates transition table and updates quantities.\n\nEmit side effects via observer callbacks (on_ack/on_fill/on_cancel). Use a transition table (map[state][event_type] → handler) or switch with explicit guards, keeping invariants centralized.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["lld", "state-machine", "correctness"],
    source: "Quant-dev gateway primitive",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 190,
      rubric: [
        "Defines a reasonable set of states and valid transitions for ack/fill/cancel paths: 45%",
        "Maintains quantity invariants (filled+remaining=orig; no negative; terminal states): 30%",
        "Explains how transitions are encoded (table/handlers) and how invalid transitions are rejected: 15%",
        "Mentions side-effect/callback design (observer) cleanly: 10%",
      ],
      reference_solution_md:
        "Enum states (sent/live/partial/filled/cancel_pending/canceled/rejected). apply(event) validates transitions and updates filled/remaining invariants; terminal states reject further events. Encode transitions via table or handlers. Emit side effects via callbacks for positions/pnl.\n",
    },
  },
  {
    slug: "lld-retry-scheduler-backoff",
    topic: "LLD",
    track: "dev",
    title: "Design a Retry Scheduler with Backoff",
    prompt_md:
      "Design a retry scheduler for retrying failed requests.\n\nRequirements:\n- retries have exponential backoff with jitter\n- max attempts\n- `schedule(task)` and `tick(now)` or `run()` loop\n- allow cancellation\n- efficient for many pending retries\n\nProvide main data structures and method signatures.",
    solution_md:
      "Represent a retry task with {id, attempt, next_run_ts, callable}. Use a min-heap keyed by next_run_ts. schedule inserts with next_run_ts=now. tick(now) pops due tasks, executes them (outside locks), and on failure increments attempt and re-inserts with next_run_ts computed by backoff policy; stop after max attempts.\n\nCancellation via a cancelled flag and id→task map; skip cancelled tasks when popped. Jitter via randomization on delay.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["lld", "scheduling", "heaps"],
    source: "Systems primitive",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 180,
      rubric: [
        "Defines exponential backoff with jitter and max-attempt behavior: 35%",
        "Uses an efficient scheduler structure (min-heap by next_run_ts) and tick loop: 40%",
        "Handles cancellation without O(n) scans (id map / lazy cancel) and runs tasks off-lock: 25%",
      ],
      reference_solution_md:
        "RetryTask{id,attempt,next_ts}. Min-heap by next_ts; tick pops due and executes; on failure reinsert with exp backoff+jitter until max attempts. Cancel via id map + cancelled flag; lazy skip when popped; never execute user task under lock.\n",
    },
  },
  {
    slug: "lld-ring-buffer-logger",
    topic: "LLD",
    track: "dev",
    title: "Design a Ring-Buffer Logger (Async)",
    prompt_md:
      "Design an async logger for a low-latency component.\n\nRequirements:\n- hot path: `log(level, msg)` must not allocate\n- logger thread flushes to sink (file/stdout)\n- bounded memory (drop policy if full)\n- include timestamping\n\nDescribe the classes and the buffer structure.",
    solution_md:
      "Use a fixed-size ring buffer of preallocated log records (fixed-size message or pointer into an arena). Hot path writes into ring via SPSC or MPSC depending on producers; if full, drop with a counter. Timestamp using a fast clock (monotonic) and optionally wall time.\n\nLogger thread drains ring, formats and writes to sink in batches. Keep formatting off hot path; use ids/enums rather than strings where possible.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["lld", "logging", "performance"],
    source: "Low-latency engineering staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 170,
      rubric: [
        "Defines fixed-size preallocated ring buffer and async drain thread: 45%",
        "Mentions no allocation/formatting on hot path and batching on drain: 30%",
        "Defines bounded memory + drop policy and metrics for drops: 15%",
        "Mentions timestamping approach appropriately: 10%",
      ],
      reference_solution_md:
        "Preallocate fixed ring of log records. Hot path writes (no alloc) into SPSC/MPSC ring; if full, drop and increment counter. Logger thread drains, formats, and flushes in batches. Timestamp on hot path with fast clock; keep heavy formatting off hot path.\n",
    },
  },
  {
    slug: "lld-risk-limit-store",
    topic: "LLD",
    track: "dev",
    title: "Design a Risk Limit Store (Hot Path Reads)",
    prompt_md:
      "Design an in-process risk limit store used by a hot-path risk check.\n\nRequirements:\n- limits keyed by (strategy_id, symbol)\n- hot path reads: `get_limit(key)` must be very fast\n- control plane updates limits occasionally\n- updates must be atomic from reader POV\n\nDescribe your classes and update strategy.",
    solution_md:
      "Use immutable snapshots published via an atomic pointer (RCU style). Store limits in a fixed-capacity array or flat hash map keyed by small integer ids (intern strategy/symbol to ids). Readers do an atomic load of the snapshot pointer and then a lock-free lookup.\n\nUpdater builds a new snapshot off-thread, validates it, then swaps it atomically. Keep versions/metrics for updates.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["lld", "rcu", "performance"],
    source: "Trading controls primitive",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 170,
      rubric: [
        "Designs fast hot-path lookup keyed by (strategy,symbol) using cache-friendly structure: 35%",
        "Uses atomic snapshot publishing so updates are atomic for readers (RCU): 45%",
        "Mentions update build/validate off-thread and basic observability/versioning: 20%",
      ],
      reference_solution_md:
        "Publish immutable limit snapshots via atomic pointer/shared_ptr. Readers atomically load snapshot and do a lock-free lookup in array/flat hash map keyed by interned ids. Writers build+validate new snapshot off-thread then swap; track versions/metrics.\n",
    },
  },
  {
    slug: "lld-order-throttler",
    topic: "LLD",
    track: "dev",
    title: "Design an Order Throttler (Per-Symbol + Global)",
    prompt_md:
      "Design an in-process throttler that limits outgoing orders.\n\nRequirements:\n- global limit: at most Ng orders/sec\n- per-symbol limit: at most Ns orders/sec per symbol\n- bursts allowed up to B\n- `allow(symbol, now)` fast hot path\n- thread-safe (assume multiple strategies)\n\nProvide main classes/state variables and how `allow` updates them.",
    solution_md:
      "Use token buckets: one global bucket and one bucket per symbol. `allow(symbol, now)` refills buckets using elapsed time, then checks both buckets have >=1 token; if so, decrement both and allow.\n\nTo keep it fast, store per-symbol buckets in a fixed-capacity map keyed by interned symbol id; shard by hash for locking or funnel requests through a single gateway thread. Bursts are handled by capacity B. Track metrics for rejects.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["lld", "rate-limiting", "performance"],
    source: "Trading controls primitive",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 170,
      rubric: [
        "Defines global + per-symbol limits with a concrete algorithm (token buckets) and burst semantics: 45%",
        "Explains allow() logic (refill, check, decrement both) correctly: 30%",
        "Addresses hot-path performance + concurrency strategy (gateway thread/sharding/locks) and metrics: 25%",
      ],
      reference_solution_md:
        "Use token buckets: one global + per-symbol. allow() refills, checks both >=1, then decrements both. Store per-symbol state in fixed-capacity map keyed by symbol id; for concurrency use sharding or a single gateway thread. Burst via capacity B; track reject metrics.\n",
    },
  },
  {
    slug: "lld-seq-gap-buffer",
    topic: "LLD",
    track: "dev",
    title: "Design a Sequence Gap Buffer (Reorder + Drain)",
    prompt_md:
      "Design an in-process component that accepts messages (seq, payload) and outputs them in-order.\n\nRequirements:\n- `on_message(seq, payload)`\n- when seq==next_expected, emit immediately and drain buffered contiguous messages\n- buffer out-of-order messages up to a bound\n- expose gap detection (missing seq ranges)\n\nProvide data structures and APIs (bounded design).",
    solution_md:
      "Maintain `next_expected` and a map seq→payload (e.g., ordered map or flat map + min tracking). On message:\n- if seq < next_expected: drop\n- if seq == next_expected: emit, next_expected++, then while map contains next_expected, emit and advance\n- else: insert into map if within bound\n\nGap detection is (next_expected .. min_buffered_seq-1). Bound memory by max buffered entries/seq distance; overflow triggers reset or snapshot request.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["lld", "sequencing", "data-structures"],
    source: "Feed handler primitive",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 170,
      rubric: [
        "Defines next_expected logic with correct handling of seq <, ==, > expected: 45%",
        "Explains buffering and draining contiguous messages correctly: 30%",
        "Defines bounded buffering policy and gap reporting interface: 25%",
      ],
      reference_solution_md:
        "Keep next_expected and a map seq→payload. Drop seq<expected. If seq==expected, emit and drain buffered while present. Else buffer if within bound. Gap is [next_expected, min_buffered_seq). Bound by max entries/distance; overflow triggers reset/snapshot.\n",
    },
  },
  {
    slug: "lld-symbol-state-store",
    topic: "LLD",
    track: "dev",
    title: "Design a Symbol State Store (Hot Reads, Occasional Writes)",
    prompt_md:
      "Design an in-process store of per-symbol state used on a hot path.\n\nRequirements:\n- symbol ids are integers 0..M-1\n- state includes a few fields (e.g., last_mid, last_update_ts, flags)\n- readers are very frequent\n- writers update occasionally\n- updates should be atomic per symbol\n\nProvide your classes/structs and concurrency approach.",
    solution_md:
      "Use a flat array `state[M]` where each entry is a small struct aligned to avoid false sharing. For atomic per-symbol updates, either protect each symbol with a small spin/mutex (striped locks) or store fields in atomics (or use a versioned seqlock pattern: version counter + fields + version).\n\nIf single-writer (e.g., normalized feed thread), then lock-free reads are easy: readers read the struct as-is with versioning to avoid torn reads if needed.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["lld", "performance", "concurrency"],
    source: "Low-latency state primitive",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 170,
      rubric: [
        "Uses a cache-friendly per-symbol layout (array by symbol id) and explains why: 40%",
        "Provides an atomic per-symbol update strategy (atomics, striped locks, or versioned seqlock): 40%",
        "Mentions false-sharing alignment and/or single-writer simplification appropriately: 20%",
      ],
      reference_solution_md:
        "Store state in an array indexed by symbol id for locality. For atomic updates use per-symbol/striped locks, per-field atomics, or a versioned seqlock per entry. Align entries to avoid false sharing; if single-writer, versioning makes reads safe and cheap.\n",
    },
  },
  {
    slug: "lld-order-router",
    topic: "LLD",
    track: "dev",
    title: "Design an In-Process Order Router",
    prompt_md:
      "Design an order router that chooses a venue/session for an outgoing order.\n\nRequirements:\n- input: (symbol, side, qty, optional venue preference)\n- configurable routing rules (per symbol or strategy)\n- fallback if preferred venue is down\n- expose `route(order)` → (session_id, routed_order)\n\nProvide main classes and how rules are represented and updated.",
    solution_md:
      "Have a `RoutingTable` mapping (symbol,strategy) to a ranked list of venues/sessions and constraints. A `SessionHealth` component tracks whether a venue session is UP/DOWN/DEGRADED. `OrderRouter.route(order)` consults routing table, filters by health and constraints, and returns the first viable session.\n\nRules updates published via immutable snapshot (RCU) so router reads are lock-free. Fallback is selecting next viable route; if none, reject with reason.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["lld", "routing", "state-machine"],
    source: "Gateway primitive",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 180,
      rubric: [
        "Defines routing rules representation (ranked venues per key) and route() behavior: 40%",
        "Handles session health + fallback logic cleanly: 30%",
        "Explains how rules are updated atomically without hot-path locks (RCU snapshot): 30%",
      ],
      reference_solution_md:
        "RoutingTable maps (symbol,strategy)→ranked venues/sessions. SessionHealth tracks UP/DOWN. route() picks first viable by rules+health, else falls back or rejects. Publish routing rules via immutable snapshots (RCU) so reads are lock-free.\n",
    },
  },
  {
    slug: "lld-binary-protocol-codec",
    topic: "LLD",
    track: "dev",
    title: "Design a Binary Protocol Codec (Zero-Alloc)",
    prompt_md:
      "Design an in-process encoder/decoder for a binary protocol.\n\nRequirements:\n- decoder consumes bytes and emits messages (possibly partial frames)\n- encoder writes messages into a caller-provided buffer\n- avoid allocations on hot path\n- include checksum/length validation\n\nProvide key interfaces and state variables (bounded design).",
    solution_md:
      "Decoder: keep a small state machine with an input ring buffer, parse header (len/type), wait until full frame available, validate checksum, then emit a view (span) or copy into a preallocated message struct. Encoder: `encode(msg, out_buf)` returns bytes written or error if out_buf too small.\n\nAvoid allocations by using caller-provided buffers and fixed-size scratch. Use explicit error codes for invalid frames.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["lld", "networking", "performance"],
    source: "Low-latency networking staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 180,
      rubric: [
        "Defines decoder state machine for partial frames (header → wait → validate → emit): 45%",
        "Defines encoder API writing into caller-provided buffer and handling insufficient space: 25%",
        "Mentions zero-alloc approach (spans/views, preallocated scratch) and validation (len/checksum): 30%",
      ],
      reference_solution_md:
        "Decoder keeps state across calls: buffer bytes, parse header len/type, wait for full frame, validate checksum, then emit message view/struct. Encoder writes into caller-provided buffer and returns bytes written or error. Zero-alloc via spans and preallocated scratch; validate length/checksum.\n",
    },
  },
  {
    slug: "lld-mpsc-bounded-queue",
    topic: "LLD",
    track: "dev",
    title: "Design a Bounded MPSC Queue",
    prompt_md:
      "Design an in-process bounded MPSC (multi-producer, single-consumer) queue.\n\nRequirements:\n- producers call `try_push(x)` (non-blocking)\n- consumer calls `pop()`\n- bounded capacity\n- avoid allocations\n- define memory-ordering / correctness at a high level\n\nProvide the data structure and key invariants.",
    solution_md:
      "Use a fixed-size ring buffer of slots plus atomic indices. A common approach uses an atomic tail for producers (fetch_add) and a non-atomic head owned by consumer, plus per-slot sequence numbers to distinguish full/empty (Vyukov MPSC bounded queue pattern). Producers reserve a slot by incrementing tail and then publish into slot when sequence matches; consumer reads slot when available and advances head.\n\nNo allocations; correctness relies on release when publishing and acquire when consuming.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["lld", "concurrency", "queues"],
    source: "Low-latency queue primitive",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 190,
      rubric: [
        "Defines fixed-capacity ring + producer reservation (atomic tail) and consumer-owned head: 35%",
        "Mentions per-slot sequence/versioning to distinguish full/empty under wraparound: 35%",
        "Mentions no-alloc and high-level memory-ordering (release publish, acquire consume): 30%",
      ],
      reference_solution_md:
        "Bounded MPSC via fixed ring: producers reserve slots with atomic tail, consumer owns head. Use per-slot sequence numbers to detect full/empty under wrap. Publish with release, consume with acquire. No allocations.\n",
    },
  },
  {
    slug: "lld-event-journal-compact",
    topic: "LLD",
    track: "dev",
    title: "Design a Compact Event Journal (Replayable)",
    prompt_md:
      "Design an in-process event journal for replay.\n\nRequirements:\n- append-only\n- bounded memory in RAM (spill optional)\n- each entry has (type, timestamp, payload)\n- ability to replay from an offset\n- avoid allocations on hot path\n\nProvide classes and data structures.",
    solution_md:
      "Use a fixed-size chunked log in memory: a ring of preallocated chunks, each chunk holds many variable-length records encoded as [len|type|ts|payload]. Hot path appends bytes to the current chunk; if chunk full, rotate to next and either overwrite old (bounded) or spill to disk asynchronously.\n\nExpose `append(record)` returning an offset and `replay(from_offset, callback)` that iterates and decodes records. Keep encoding simple and include checksums for corruption detection.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["lld", "logging", "replay"],
    source: "Event sourcing primitive",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 180,
      rubric: [
        "Defines append-only representation and replay-by-offset API: 35%",
        "Uses bounded, preallocated storage (ring of chunks) and explains rotation/spill policy: 40%",
        "Mentions hot-path no-alloc approach (binary encoding into buffers) and integrity checks: 25%",
      ],
      reference_solution_md:
        "Append-only journal as a ring of preallocated chunks storing binary records [len|type|ts|payload]. append returns an offset; replay decodes from offset. Bounded by chunk ring; rotate/overwrite or spill asynchronously. No alloc on hot path; include checksums/validation.\n",
    },
  },
  {
    slug: "lld-cancel-replace-order-flow",
    topic: "LLD",
    track: "dev",
    title: "Design Cancel/Replace (Amend) Order Flow",
    prompt_md:
      "Design the in-process flow for cancel/replace (amend) of an order.\n\nRequirements:\n- `replace(order_id, new_qty, new_price?)` produces messages to exchange\n- must handle out-of-order acks/fills\n- maintain a consistent order state\n- expose callbacks to strategy\n\nKeep it bounded: focus on key classes and state transitions, not full protocol details.",
    solution_md:
      "Model a per-order state machine with a monotonic event_seq and sub-states for pending replace/cancel. Replace usually maps to a specific protocol message (CancelReplaceRequest) or a cancel+new depending on venue. Maintain invariants: outstanding leaves_qty, last_acknowledged version, and pending modification.\n\nProcess inbound events (acks/fills/rejects) through `apply(event)` with guards: if fill arrives during replace pending, update remaining and keep pending request; if replace rejected, revert pending and notify. Use correlation IDs for replace requests and keep an index mapping request_id→order_id. Callbacks notify strategy on accepted/rejected replace and on fills.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["lld", "state-machine", "order-entry"],
    source: "Gateway correctness staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 190,
      rubric: [
        "Defines key states/fields for replace pending vs live and uses correlation/request ids: 40%",
        "Handles out-of-order acks/fills with correct invariants (leaves qty, versioning): 35%",
        "Defines clear APIs/callbacks and rejection/rollback behavior: 25%",
      ],
      reference_solution_md:
        "Per-order state machine with pending_replace and monotonic event/versioning. replace() emits amend message and records request_id→order_id. apply(event) updates leaves_qty on fills even during pending replace; resolves replace ack/reject to commit/rollback pending state and notifies strategy via callbacks.\n",
    },
  },
  {
    slug: "lld-coalescing-latest-per-symbol-queue",
    topic: "LLD",
    track: "dev",
    title: "Design a Coalescing Queue (Latest-Per-Symbol)",
    prompt_md:
      "Design a queue for market data updates where you only care about the latest update per symbol.\n\nRequirements:\n- producer pushes updates (symbol_id, payload)\n- consumer pops updates\n- if producer pushes multiple updates for same symbol before consumer pops, keep only the latest (coalesce)\n- bounded memory\n- avoid allocations\n\nDescribe data structures and concurrency approach (SPSC is fine).",
    solution_md:
      "Use a fixed array `latest[symbol]` holding the most recent payload and a fixed bitset/flag `dirty[symbol]`. Producer writes `latest[symbol]=payload` and if dirty was false, sets it true and enqueues symbol_id into a ring of symbol_ids. Consumer pops symbol_id, reads latest[symbol], clears dirty[symbol], and processes.\n\nThis bounds memory (O(num_symbols)) and avoids allocating per update; it also naturally coalesces bursts.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["lld", "queues", "performance"],
    source: "Market data systems pattern",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 170,
      rubric: [
        "Defines latest-per-symbol storage + dirty flag/bitset to coalesce updates: 45%",
        "Defines a bounded queue of symbol_ids (ring) and how producer enqueues only on first dirty transition: 35%",
        "Mentions concurrency model (SPSC) and no-allocation/bounded memory rationale: 20%",
      ],
      reference_solution_md:
        "Store latest[symbol] and dirty[symbol]. Producer overwrites latest and if dirty was false, sets it true and enqueues symbol_id into a ring. Consumer pops symbol_id, reads latest, clears dirty. Coalesces multiple updates per symbol and uses bounded memory with no per-update allocations.\n",
    },
  },
  {
    slug: "lld-fixed-capacity-topn-scoreboard",
    topic: "LLD",
    track: "dev",
    title: "Design a Fixed-Capacity Top-N Scoreboard",
    prompt_md:
      "Design a component that maintains the top N items by score.\n\nRequirements:\n- `update(id, delta_score)` updates an item's score\n- `top()` returns the current top N ids in descending score (tie: smaller id)\n- fixed maximum number of ids M (ids are 0..M-1)\n- avoid allocations\n\nProvide the data structures and complexity tradeoffs.",
    solution_md:
      "Because ids are bounded, store scores in an array `score[M]`. For top-N queries, maintain a min-heap of current top-N ids keyed by (score, -id) with an index map id→heap_pos for O(log N) updates. On update: adjust score, then fix heap: if id in heap, sift; else if heap not full or score better than heap min, insert/replace.\n\nAlternative: for small N, keep a sorted fixed array of size N (O(N) update) with excellent locality.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["lld", "heaps", "performance"],
    source: "Analytics primitive",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 180,
      rubric: [
        "Uses bounded score storage (array) and maintains top-N via heap or fixed sorted array: 45%",
        "Explains update mechanics (in-heap vs not, replace min) and tie-breaking: 35%",
        "Mentions complexity/locality tradeoffs and why fixed bounds avoid allocations: 20%",
      ],
      reference_solution_md:
        "With bounded ids, keep score[M]. Maintain top N using a min-heap (size N) plus id→pos index for O(log N) updates; insert/replace when candidate beats heap min. For small N, a fixed sorted array gives O(N) updates with great locality. No allocations due to fixed bounds.\n",
    },
  },
];
