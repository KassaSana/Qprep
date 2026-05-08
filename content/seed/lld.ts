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
        "Names a top-level entity (e.g. `ParkingLot`) that aggregates floors",
        "Models per-floor `ParkingSpot`s with size or type",
        "Has a `Vehicle` (or equivalent) class hierarchy or size enum",
        "Describes a `park` / `unpark` flow and how a ticket or license-plate lookup works",
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
        "Picks an encoding strategy: counter+base62 OR hash OR random with retry",
        "Stores at least a slug → URL map (and ideally a reverse URL → slug map for idempotency)",
        "Discusses collision handling (or argues it can't happen with a counter)",
        "Names a `shorten(url)` and an `expand(slug)` API or equivalent",
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
        "Has a topic → set/list of subscribers data structure",
        "Defines subscribe / unsubscribe / publish semantics",
        "Discusses concurrency: locking, copy-on-publish, or a similar strategy that avoids running user callbacks while holding a lock",
        "Mentions how unsubscribe interacts with an in-flight publish (cancelled flag, snapshot, etc.)",
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
        "Mentions cleanup of empty price levels and invariants: 10%",
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
];
