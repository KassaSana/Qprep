import type { SeedQuestion } from "@/content/question-types";

/**
 * System Design — interview-style designs graded as freeform.
 *
 * Keep answers bounded: we're grading whether the candidate hits key
 * trade-offs and failure modes, not whether they produce a 20-page spec.
 */
export const SYSTEM_DESIGN_SEED: SeedQuestion[] = [
  {
    slug: "md-pipeline-multicast-to-strategy",
    topic: "System Design",
    track: "dev",
    title: "Market Data Pipeline: Multicast UDP → Strategy",
    prompt_md:
      "Design a low-latency market data ingestion pipeline that takes a multicast UDP feed and delivers normalized updates to a strategy.\n\nCover:\n\n- parsing + sequencing\n- gap detection + recovery\n- threading model (what runs on which core)\n- data structures for per-symbol state\n- how you would measure and control tail latency\n\nYou don't need to discuss cloud infrastructure — assume a colocated machine.",
    solution_md:
      "A typical design uses a dedicated receiver thread pinned to a core that busy-polls the NIC (or uses kernel-bypass), parses messages, checks sequence numbers, and writes into an SPSC ring buffer. A strategy thread reads from the ring, updates per-symbol order book state, and emits signals. Gaps are detected by sequence numbers; recover via a TCP gap-fill channel and/or dual A/B feeds + dedup. Tail latency is controlled by pinning/isolating cores, avoiding allocations, pre-touching memory, and measuring histograms (not averages).",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["system-design", "market-data", "low-latency"],
    companies: ["Jump Trading", "IMC", "Optiver"],
    source: "Quant dev system design staple",
    answer_meta: {
      rubric: [
        "Mentions sequence numbers and gap detection and what state is tracked per feed/symbol: 25%",
        "Proposes a gap recovery mechanism (gap-fill channel, snapshot, A/B feeds + dedup): 30%",
        "Describes a threading model with dedicated cores and a queue/ring buffer handoff: 25%",
        "Addresses tail latency controls (avoid allocs, pin cores, pre-touch, measure histograms): 20%",
      ],
      min_words: 120,
      reference_solution_md:
        "Dedicated receiver pinned to a core parses multicast, validates sequence numbers, and writes updates into an SPSC ring. Strategy thread consumes, updates per-symbol state, and produces signals. Detect gaps by seq; recover via TCP gap-fill or snapshot, optionally subscribe to A/B feeds and dedup. Control tail latency by avoiding allocations, pre-touching/locking memory, pinning threads/NUMA locality, and measuring latency histograms.",
    },
  },
  {
    slug: "pretrade-risk-check-sub10us",
    topic: "System Design",
    track: "dev",
    title: "Pre-Trade Risk Check Under 10μs",
    prompt_md:
      "Design a pre-trade risk check that must run in under 10 microseconds on the critical path of order entry.\n\nExplain what checks you'd do (examples: max order size, fat-finger bands, position limits), where you'd run them, and how you'd avoid latency spikes.",
    solution_md:
      "Run risk checks in-process on the order gateway thread (function call, no IPC). Keep limits in cache-resident structs, avoid allocations, avoid locks (single-threaded gateway) or use sharded atomics if needed. Reject quickly with a reason code; log asynchronously. Avoid spikes by preallocating, avoiding rehash/resize, pinning cores, and avoiding syscalls/page faults.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["system-design", "risk", "latency"],
    companies: ["Citadel Securities", "HRT"],
    source: "HFT system design",
    answer_meta: {
      rubric: [
        "Places checks on the hot path (in-process gateway) and explains why: 35%",
        "Names at least two concrete checks (size, price band, position/notional, throttles): 35%",
        "Mentions techniques to avoid latency spikes (no allocs/rehash, async logging, pin cores): 30%",
      ],
      min_words: 100,
      reference_solution_md:
        "Do risk checks inside the order gateway thread as a fast in-process function call. Store limits in cache-resident structs, avoid allocations/rehash, avoid syscalls, and log asynchronously. Checks include max size/notional, price bands (fat-finger), position limits, and per-symbol throttles. Pin cores and pre-touch memory to control tail latency.",
    },
  },
  {
    slug: "sysdesign-order-gateway-architecture-freeform",
    topic: "System Design",
    track: "dev",
    title: "Order Gateway Architecture (Low Latency + Safety)",
    prompt_md:
      "Design an order gateway that accepts strategy orders and sends them to an exchange.\n\nCover:\n\n- where risk checks happen\n- how you handle exchange acks/fills and correlation IDs\n- how you avoid latency spikes on the hot path\n- what you persist/log and where (hot vs cold path)\n\nAssume a colocated machine; keep the answer bounded (no cloud infra).",
    solution_md:
      "A typical design runs the gateway as a single-threaded event loop pinned to a core: it receives orders from strategy via an in-process queue (SPSC) or shared-memory IPC, runs risk checks inline, assigns a unique client order ID/correlation ID, and sends to the exchange via a low-latency session handler. Exchange acks/fills are processed on the same thread (or a dedicated network thread feeding an SPSC) to update state and notify strategy.\n\nAvoid spikes by preallocating objects, using fixed-capacity maps/arrays for hot state, avoiding rehashing/allocations, and making logging asynchronous (ring buffer to a logger thread). Persist critical audit trails (orders/acks/fills) asynchronously to disk or a replicated log, but do not block the hot path on IO.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["system-design", "order-entry", "low-latency"],
    companies: ["Citadel Securities", "HRT", "Jump Trading"],
    source: "Quant-dev system design staple",
    answer_meta: {
      min_words: 160,
      rubric: [
        "Places risk checks on the hot path before send and explains why: 25%",
        "Describes correlation IDs / state machine for acks/fills and strategy notification: 35%",
        "Mentions hot-path latency controls (no allocations/rehash, pinned threads, SPSC queues, async logging): 30%",
        "Mentions what is persisted and how to keep persistence off the hot path: 10%",
      ],
      reference_solution_md:
        "Single-threaded pinned gateway: receive → risk-check inline → assign client order ID → send. Process acks/fills to update state and notify strategy. Avoid spikes via preallocation, fixed-capacity state, no syscalls/allocs; async logging/persistence via ring buffer to separate thread.\n",
    },
  },
  {
    slug: "sysdesign-time-sync-ptp-vs-ntp-freeform",
    topic: "System Design",
    track: "dev",
    title: "Time Sync in Colocation: PTP vs NTP",
    prompt_md:
      "In a colocated trading environment, how would you think about time synchronization for timestamping and latency measurement?\n\nCompare NTP vs PTP at a high level and mention one failure mode/operational risk.",
    solution_md:
      "NTP is general-purpose and can be accurate to milliseconds/sub-millisecond depending on environment, but it can still have jitter and step adjustments that complicate latency measurement. PTP (IEEE 1588) with hardware timestamping can achieve much tighter synchronization (microsecond or better) in controlled networks, making it preferable for precise timestamping.\n\nOperational risks include misconfiguration, asymmetric network delays, or time stepping; robust systems monitor clock offset/drift and prefer monotonic clocks for internal durations while using synchronized wall time for cross-machine correlation.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["system-design", "time", "latency"],
    source: "Colo operations staple",
    answer_meta: {
      min_words: 135,
      rubric: [
        "Contrasts NTP vs PTP at high level (accuracy/jitter; hardware timestamping for PTP): 55%",
        "Mentions at least one operational risk/failure mode (stepping, asymmetry, misconfig, monitoring drift): 30%",
        "Mentions using monotonic clocks for durations vs synced time for correlation: 15%",
      ],
      reference_solution_md:
        "NTP is general-purpose with more jitter; PTP with hardware timestamping can be much tighter. Risks: stepping/asymmetry/misconfig; monitor offset and use monotonic for durations.\n",
    },
  },
  {
    slug: "sysdesign-sequencing-and-dedup-market-data",
    topic: "System Design",
    track: "dev",
    title: "Sequencing and De-dup (A/B Feeds)",
    prompt_md:
      "You ingest two redundant market data feeds (A and B) that carry the same messages, sometimes with different latency and occasional drops.\n\nDesign the logic that:\n- deduplicates messages\n- ensures you apply updates in sequence\n- handles gaps (fast detect + recovery)\n\nFocus on the in-process algorithm and data structures. Assume each message has (symbol, seq, payload).",
    solution_md:
      "Maintain per-symbol next_expected_seq and a small reorder buffer keyed by seq. When a message arrives from either feed:\n- if seq < next_expected, drop (duplicate/stale)\n- if seq == next_expected, apply and advance; then drain buffered contiguous seq\n- if seq > next_expected, buffer and trigger gap logic (request retransmit/snapshot) if gap persists beyond a small threshold.\n\nDedup is naturally handled by the seq check and a \"seen\" window. Keep buffers bounded; if too large, fall back to snapshot recovery.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["system-design", "market-data", "sequencing"],
    source: "Quant-dev primitive",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 170,
      rubric: [
        "Defines per-symbol next_expected_seq and how to handle seq<,==,> expected: 45%",
        "Explains bounded reordering buffer and draining contiguous sequences: 25%",
        "Explains gap detection + recovery trigger (retransmit/snapshot) and bounding memory: 30%",
      ],
      reference_solution_md:
        "Track per-symbol next_expected_seq and a bounded map seq→payload. Drop seq<expected, apply seq==expected and drain buffered, buffer seq>expected and trigger gap fill if missing persists. Bound buffer; fallback to snapshot.\n",
    },
  },
  {
    slug: "sysdesign-replay-and-backfill",
    topic: "System Design",
    track: "dev",
    title: "Replay/Backfill Pipeline for Research",
    prompt_md:
      "Design a replay/backfill system to feed historical market data into research/simulation.\n\nCover:\n- storage format (partitioning, compression)\n- indexing and random access\n- reproducing original timing vs running as fast as possible\n- handling schema evolution\n\nKeep it at the system level (components + tradeoffs).",
    solution_md:
      "Store time-partitioned files (e.g., by date/venue/symbol) with chunked formats and compression. Maintain an index from time→file/offset and per-symbol offsets for fast seeks. Replay reads chunks, decodes, and emits events; a scheduler can sleep to match timing or run in fast mode.\n\nSchema evolution: version messages and maintain decoders per version; optionally normalize to a canonical internal event model. Track correctness/lag and gap validation.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["system-design", "data", "replay"],
    source: "Quant research systems staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 170,
      rubric: [
        "Proposes storage/partitioning approach and compression tradeoffs: 30%",
        "Explains indexing/random access (time→offset, per-symbol seeks): 30%",
        "Explains timing modes (real-time vs fast) and scheduler: 20%",
        "Mentions schema evolution/versioning or canonical model: 20%",
      ],
      reference_solution_md:
        "Partition by date/venue/symbol with compressed chunks and time→offset indexes. Replay decodes and emits; scheduler supports real-time pacing or fast mode. Handle schema evolution via versioned decoders and/or canonical normalization.\n",
    },
  },
  {
    slug: "sysdesign-idempotency-ordering-order-events",
    topic: "System Design",
    track: "dev",
    title: "Idempotency and Ordering for Order Events",
    prompt_md:
      "You have an order event stream (new/ack/fill/cancel) and multiple downstream consumers.\n\nDesign how you ensure:\n- per-order ordering\n- de-duplication (retries)\n- idempotent processing\n\nAssume at-least-once delivery from the transport.",
    solution_md:
      "Include (order_id, event_seq) on every event. Partition the stream by order_id to preserve per-order ordering within a partition. Consumers store last_seen_seq per order; drop duplicates (<= last_seen) and buffer/reject out-of-order as needed.\n\nIdempotency is achieved by guarding state updates on event_seq. Persist offsets/checkpoints for restart correctness.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["system-design", "streaming", "correctness"],
    source: "Distributed systems staple adapted",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 170,
      rubric: [
        "Defines event identity (order_id + event_seq) and per-order ordering approach (partitioning): 45%",
        "Explains dedup/idempotency via last_seen_seq/guards and update semantics: 35%",
        "Mentions checkpoints/offset persistence and restart behavior: 20%",
      ],
      reference_solution_md:
        "Use (order_id,event_seq) and partition by order_id. Consumers track last_seen_seq and apply only if seq advances, making processing idempotent under retries. Persist offsets/checkpoints for restart.\n",
    },
  },
  {
    slug: "sysdesign-observability-low-latency",
    topic: "System Design",
    track: "dev",
    title: "Observability for Low-Latency Systems",
    prompt_md:
      "Design an observability approach for a low-latency trading system.\n\nCover:\n- latency measurement (what to timestamp, how)\n- metrics (what histograms matter)\n- logging/trace strategy without adding tail latency\n- alerting for correctness issues (gaps, seq, clock)\n\nKeep it bounded but concrete.",
    solution_md:
      "Timestamp key edges (receive→decode→normalize→strategy→send→ack) using monotonic clocks for durations and PTP/NTP wall time for cross-machine correlation. Track percentile histograms and queue depths.\n\nLog asynchronously via ring buffers and batching; avoid formatting/allocations on hot path. Alert on gaps/seq discontinuities, clock drift, heartbeat misses, and abnormal dedup/gap-fill rates.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["system-design", "observability", "latency"],
    source: "Production engineering staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 170,
      rubric: [
        "Defines what to timestamp and uses monotonic clocks for durations: 30%",
        "Mentions histograms/percentiles and queue depth as key metrics: 25%",
        "Explains async logging/tracing without hot-path allocations/formatting: 25%",
        "Mentions correctness alerts (seq/gaps/clock drift/heartbeats): 20%",
      ],
      reference_solution_md:
        "Instrument pipeline edges with monotonic timestamps; track p99/p99.9 histograms and queue depths. Use async ring-buffer logging/batching and avoid formatting on hot path. Alert on gaps/seq errors, clock drift, and heartbeat misses.\n",
    },
  },
  {
    slug: "sysdesign-kill-switch",
    topic: "System Design",
    track: "dev",
    title: "Design a Kill Switch (Fast Risk Shutdown)",
    prompt_md:
      "Design a kill switch that can rapidly stop order flow across strategies.\n\nRequirements:\n- flip to \"deny\" within milliseconds\n- audit trail of who/why flipped\n- allow gradual re-enable\n- avoid blocking the hot path\n\nDescribe components and failure modes.",
    solution_md:
      "Put a cheap hot-path check in the gateway/risk module (atomic/RCU-published config flag). Control plane publishes a new config snapshot setting deny mode. Audit is written asynchronously to durable storage.\n\nGradual re-enable uses scoped flags per strategy/symbol. Failure modes: split brain, stale config; mitigate with single authority, versioning, signed updates, and conservative defaults.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["system-design", "risk", "control-plane"],
    source: "Trading controls staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 160,
      rubric: [
        "Places decision on hot path as cheap check (atomic/RCU config) and explains why: 45%",
        "Describes control-plane update and async audit trail: 25%",
        "Mentions gradual re-enable/scoping and rollback: 15%",
        "Mentions at least one failure mode and mitigation (authority/versioning/defaults): 15%",
      ],
      reference_solution_md:
        "Hot path checks an atomic/RCU deny flag in gateway/risk. Control plane publishes config snapshot; audit asynchronously. Re-enable via scoped flags per strategy/symbol. Handle failure modes with single authority and versioned/signed config.\n",
    },
  },
  {
    slug: "sysdesign-schema-migrations-in-hot-systems",
    topic: "System Design",
    track: "dev",
    title: "Schema Evolution Without Downtime (Hot Systems)",
    prompt_md:
      "Design a strategy for evolving message schemas (and stored data schemas) without downtime.\n\nCover:\n- forward/backward compatibility\n- rolling deployments\n- version negotiation/feature flags\n- validation to prevent silent corruption\n\nAnswer for a system where both low-latency online components and offline research readers exist.",
    solution_md:
      "Use versioned schemas with optional fields and defaults; readers tolerate unknown fields. Deploy readers first, then writers. Use feature flags/version negotiation to gate new behavior. Validate via dual-read/dual-write comparisons, checksums, and metrics. Keep offline decoders for historical versions and normalize into a canonical model.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["system-design", "schema", "migrations"],
    source: "Production engineering staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 180,
      rubric: [
        "Explains forward/backward compat rules (optional fields, defaults, tolerate unknown): 40%",
        "Explains rollout order (readers first, writers later) and flags/negotiation: 30%",
        "Mentions validation against silent corruption (dual read/write, metrics): 20%",
        "Mentions offline/historical readers and canonical model: 10%",
      ],
      reference_solution_md:
        "Version schemas with optional fields/defaults; readers ignore unknowns. Roll readers first then writers and gate via flags/negotiation. Validate via dual-read/dual-write and metrics/checksums. Keep offline decoders for old versions and normalize to a canonical model.\n",
    },
  },
  {
    slug: "sysdesign-rate-limits-strategy-to-gateway",
    topic: "System Design",
    track: "dev",
    title: "Rate Limiting Strategy → Gateway",
    prompt_md:
      "Design rate limiting between strategies and an order gateway.\n\nRequirements:\n- per-strategy and per-symbol limits\n- bursts allowed up to a bound\n- minimal overhead on hot path\n- enforce limits consistently even if strategy is buggy\n\nDescribe where limits live and the data structures used.",
    solution_md:
      "Enforce at the gateway (authoritative) with token buckets per (strategy_id, symbol) and a per-strategy global bucket. Use fixed-capacity maps/arrays keyed by small ids; update on the gateway thread to avoid locks. Reject fast with reason codes.\n\nOptionally add a soft limiter in strategy to reduce rejects, but treat gateway as source of truth and measure rates for tuning.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["system-design", "rate-limiting", "risk"],
    source: "Trading controls staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 170,
      rubric: [
        "Places authoritative limits at gateway (not strategy) and explains why: 35%",
        "Defines per-(strategy,symbol) + per-strategy buckets with burst semantics: 35%",
        "Mentions hot-path perf (single-threaded, fixed-capacity state, no locks): 20%",
        "Mentions tuning/observability or soft limiter as optional: 10%",
      ],
      reference_solution_md:
        "Authoritative enforcement in gateway via token buckets per (strategy,symbol) plus per-strategy global bucket. Keep state in fixed-capacity arrays/maps on single thread; reject quickly. Optionally soft-limit in strategy; tune via metrics.\n",
    },
  },
  {
    slug: "sysdesign-market-data-fanout",
    topic: "System Design",
    track: "dev",
    title: "Market Data Fanout to Many Strategies",
    prompt_md:
      "You have one normalized market data stream and many strategies consuming it on the same machine.\n\nDesign how you fan out updates so that:\n- each strategy sees a consistent ordered stream\n- a slow strategy does not block others\n- you can measure per-strategy lag\n- the hot path stays low-latency\n\nAssume colocated machine; keep it in-process.",
    solution_md:
      "Use a single producer (normalizer) and per-strategy SPSC ring buffers. Producer writes each update into all rings (or a shared ring + per-strategy cursors if you accept more complexity). Each strategy reads independently, so slow consumers don't block others. Track lag by comparing producer sequence to consumer cursor.\n\nKeep rings fixed-size and preallocated; on overflow, decide policy (drop, disconnect, or apply backpressure upstream). Avoid locks by pinning threads and using cache-line separated cursors.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["system-design", "market-data", "low-latency"],
    source: "Quant-dev system design staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 180,
      rubric: [
        "Proposes per-consumer queueing model (per-strategy rings or shared log + cursors) and ordered delivery: 40%",
        "Explains isolation from slow consumers and overflow policy: 30%",
        "Mentions how to measure lag (seq/cursors) and observability: 15%",
        "Mentions hot-path perf practices (prealloc, no locks, pinning, avoid false sharing): 15%",
      ],
      reference_solution_md:
        "Use one producer and per-strategy SPSC rings (or shared log + cursors). Each consumer reads independently so slow strategies don't block others. Track lag via producer seq vs consumer cursor. Fixed-size preallocated buffers with overflow policy; avoid locks via pinning and cache-line separated cursors.\n",
    },
  },
  {
    slug: "sysdesign-backpressure-streaming",
    topic: "System Design",
    track: "dev",
    title: "Backpressure in a Streaming Pipeline",
    prompt_md:
      "Design how you handle backpressure in a low-latency streaming pipeline (market data → normalization → signals → orders).\n\nCover:\n- where queues live\n- what happens when a queue is full\n- how you prevent unbounded memory growth\n- how you surface overload to operators\n\nKeep it practical for colocated systems.",
    solution_md:
      "Use bounded queues between stages (SPSC rings). When full, choose policy per stage: drop non-critical messages, coalesce (keep latest per symbol), or shed load (disable strategy) rather than blocking the entire pipeline. Avoid unbounded memory by fixed capacities.\n\nSurface overload with metrics: queue depth, drop counts, lag in seq, and alerts. For critical correctness paths, prefer gap-fill/snapshot recovery rather than buffering indefinitely.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["system-design", "backpressure", "performance"],
    source: "Production systems staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 170,
      rubric: [
        "Mentions bounded queues between stages and why unbounded queues are dangerous: 40%",
        "Describes at least two overload policies (drop, coalesce latest, shed/disable, backpressure) with tradeoffs: 35%",
        "Mentions observability (queue depth, drops, lag) and operator surfacing: 15%",
        "Keeps correctness considerations clear (critical paths vs best-effort): 10%",
      ],
      reference_solution_md:
        "Use bounded rings between stages. When full: drop/coalesce (latest per symbol) or shed load/disable slow strategies rather than blocking everything. Fixed capacities prevent memory blowups. Surface overload via queue depth, drop counts, seq lag, and alerts; treat correctness-critical paths differently.\n",
    },
  },
  {
    slug: "sysdesign-exactly-once-analytics",
    topic: "System Design",
    track: "dev",
    title: "Exactly-Once-ish Analytics (At-Least-Once Transport)",
    prompt_md:
      "You compute PnL/positions/analytics from an at-least-once event stream of orders/acks/fills.\n\nDesign an approach that makes the analytics result effectively exactly-once.\n\nCover:\n- event identity and dedup\n- checkpointing state\n- replay on restart\n\nYou can assume a single-writer partition per account/order-id if useful.",
    solution_md:
      "Make events idempotent via stable identifiers (order_id,event_seq) or (session,seq). Maintain state keyed by account and last_processed_seq per partition. Persist checkpoints: (offset, state snapshot) or (offset, write-ahead log of state updates). On restart, restore last checkpoint and replay events from the stream, dropping duplicates/out-of-order using seq guards.\n\nIf you can partition by account, a single consumer per partition simplifies ordering and exactly-once semantics.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["system-design", "streaming", "correctness"],
    source: "Streaming analytics staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 180,
      rubric: [
        "Defines event identity and dedup/idempotent apply using seq guards: 45%",
        "Explains checkpointing state + offsets and how replay works on restart: 40%",
        "Mentions partitioning/single-writer per key as simplifying assumption and implications: 15%",
      ],
      reference_solution_md:
        "Use stable event ids (order_id+event_seq) and apply state updates idempotently guarded by last_seen_seq per key/partition. Persist checkpoints (offset + state snapshot or WAL). On restart restore checkpoint and replay from offset; duplicates are dropped by seq guards. Partition by account/order to preserve ordering.\n",
    },
  },
  {
    slug: "sysdesign-disaster-recovery-replay-integrity",
    topic: "System Design",
    track: "dev",
    title: "Disaster Recovery + Replay Integrity",
    prompt_md:
      "Design a disaster recovery plan for a trading system that relies on event logs and replay.\n\nCover:\n- what you replicate (configs, limits, event logs)\n- how you ensure replay integrity (no missing/duplicated events)\n- how you fail over safely (avoid double-sending orders)\n\nKeep it bounded (components + invariants).",
    solution_md:
      "Replicate immutable event logs (orders/acks/fills) and critical configs/limits to a second site. Use checksums/sequence numbers and periodic consistency audits to ensure log completeness. Replay integrity relies on stable event ids and monotonic sequences; consumers detect gaps.\n\nFailover safety: ensure only one active order-sending authority (leader election / manual cutover) and enforce idempotency on the exchange session (client order ids) so duplicates are rejected. Run DR in shadow until cutover, then reconcile positions and resume.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["system-design", "reliability", "correctness"],
    source: "Trading ops staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 190,
      rubric: [
        "States what must be replicated (event logs + configs/limits/state) and why: 30%",
        "Explains replay integrity via seq/gap detection/checksums and stable event ids: 35%",
        "Explains safe failover avoiding double-send (single authority, idempotent IDs, cutover): 25%",
        "Mentions validation/reconciliation (shadow mode, position checks) briefly: 10%",
      ],
      reference_solution_md:
        "Replicate immutable event logs and critical configs/limits. Use seq numbers/checksums and audits for completeness; replay relies on stable event ids and gap detection. Safe failover requires single active order-sending authority and idempotent client order ids; run shadow DR and reconcile before cutover.\n",
    },
  },
];
