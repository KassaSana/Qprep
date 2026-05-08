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
  {
    slug: "sysdesign-exchange-session-seq-recovery",
    topic: "System Design",
    track: "dev",
    title: "Exchange Session Sequencing + Recovery",
    prompt_md:
      "Design how an order gateway maintains sequencing for an exchange session and recovers after disconnect.\n\nCover:\n- outbound sequence numbers and resend\n- inbound sequence tracking\n- how you persist minimal state\n- how you avoid sending duplicate orders on reconnect\n\nAssume a FIX-like protocol with sequence numbers.",
    solution_md:
      "Maintain next_out_seq and expected_in_seq per session. Persist an outbound message journal (or enough to reconstruct) keyed by out_seq. On reconnect, perform logon with sequence reset policy as per venue; if not resetting, resend from last acknowledged out_seq.\n\nAvoid duplicate orders by using stable client order ids and idempotent order semantics, and by tracking what was acknowledged vs merely sent. Inbound: detect gaps in seq and request resend; reject or resync on major inconsistency. Keep persistence off hot path via async journal and fsync policy.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["system-design", "networking", "correctness"],
    source: "Gateway/session management staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 190,
      rubric: [
        "Explains outbound seq + resend/journal strategy and what must be persisted: 45%",
        "Explains inbound seq tracking + gap handling/resend requests: 25%",
        "Explains duplicate prevention on reconnect (stable client ids; ack tracking): 20%",
        "Mentions keeping persistence/journaling off hot path (async/batching) and tradeoffs: 10%",
      ],
      reference_solution_md:
        "Track next_out_seq/expected_in_seq. Persist outbound journal by seq; on reconnect resend from last acked. Inbound: detect gaps and request resend. Prevent duplicates with stable client order ids and tracking acked vs merely sent. Journal asynchronously to keep hot path fast.\n",
    },
  },
  {
    slug: "sysdesign-snapshot-vs-delta-market-data",
    topic: "System Design",
    track: "dev",
    title: "Market Data: Snapshots vs Deltas",
    prompt_md:
      "Design how your market data system uses snapshots and deltas.\n\nCover:\n- when you request a snapshot\n- how you apply deltas around the snapshot\n- how you handle out-of-order and gaps\n- what per-symbol state you keep\n\nKeep it in-process and correctness-focused.",
    solution_md:
      "Per symbol keep next_expected_seq and an order book state. On gap detection, request a snapshot while buffering deltas > expected. When snapshot arrives, reset book to snapshot (with its last_seq), set expected to last_seq+1, then apply buffered deltas in order (dropping stale).\n\nBound the buffer; if snapshot is delayed or buffer overflows, reset and retry. Prefer a consistent snapshot+deltas guarantee from the feed; otherwise use sequence validation to ensure correctness.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["system-design", "market-data", "correctness"],
    source: "Feed handler staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 180,
      rubric: [
        "Explains gap detection and snapshot request trigger and what is buffered: 35%",
        "Explains correct ordering of snapshot + buffered deltas using sequence numbers: 45%",
        "Mentions bounded buffering + retry/overflow behavior: 20%",
      ],
      reference_solution_md:
        "On gap: request snapshot, buffer deltas beyond expected. Apply snapshot, set expected=last_seq+1, then drain buffered deltas in order. Drop stale, bound buffer; retry/reset if delayed/overflow.\n",
    },
  },
  {
    slug: "sysdesign-positions-source-of-truth",
    topic: "System Design",
    track: "dev",
    title: "Positions: Source of Truth + Consistency",
    prompt_md:
      "Design how you maintain positions consistently across:\n- order gateway\n- risk checks\n- analytics/PNL\n\nCover:\n- what is the source of truth\n- how fills update state\n- how you reconcile with broker/exchange reports\n- how you avoid race conditions across services\n\nKeep it bounded.",
    solution_md:
      "Make fills/clearing reports the source of truth and treat all derived positions as projections of an event stream. Publish fills as an ordered, idempotent stream (order_id,event_seq). Risk uses a fast in-memory projection with checkpoints; analytics uses its own projection with replay.\n\nReconcile periodically against broker/exchange statements; discrepancies trigger alerts and resync. Avoid races by partitioning by account and enforcing ordering per partition; all components consume the same canonical events.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["system-design", "correctness", "risk"],
    source: "Trading systems staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 180,
      rubric: [
        "Defines a clear source of truth (fills/clearing reports) and projection model: 45%",
        "Explains event ordering/idempotency and partitioning to avoid races: 30%",
        "Mentions reconciliation strategy and resync/alerts for discrepancies: 25%",
      ],
      reference_solution_md:
        "Use fills/clearing as source of truth; positions are projections of a canonical ordered idempotent fill stream. Risk/analytics maintain their own projections with checkpoints/replay. Reconcile against broker statements and resync on mismatches; partition by account to preserve ordering and avoid races.\n",
    },
  },
  {
    slug: "sysdesign-audit-log-orders",
    topic: "System Design",
    track: "dev",
    title: "Audit Log for Orders (Hot vs Cold Path)",
    prompt_md:
      "Design an audit logging system for orders/acks/fills.\n\nRequirements:\n- must not add tail latency to hot path\n- durable storage for compliance\n- ability to replay\n- tamper-evidence is a plus\n\nDescribe hot path vs cold path, durability choices, and integrity checks.",
    solution_md:
      "Hot path writes audit events into a preallocated ring buffer/WAL queue with minimal formatting. A dedicated logger thread batches and writes to durable storage (append-only log). Use checksums per record and periodic hash chaining (e.g., hash(prev_hash||record)) for tamper evidence.\n\nDurability policy may fsync periodically or on critical boundaries; separate “must-durable” events if needed. Replay reads the append-only log and replays in order; include sequence numbers and schema version.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["system-design", "logging", "compliance"],
    source: "Production trading ops staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 180,
      rubric: [
        "Separates hot path (enqueue) from cold path (batch persist) to avoid tail latency: 40%",
        "Explains durability strategy and replay ability (append-only log + ordering): 30%",
        "Mentions integrity checks (checksums, hash chain) and schema/versioning: 30%",
      ],
      reference_solution_md:
        "Hot path enqueues audit events to a ring/WAL queue; logger thread batches and appends to durable log. Use checksums and optional hash chaining for tamper evidence. Replay reads append-only log in seq order; include schema version. Durability via periodic fsync or tiered durability policy.\n",
    },
  },
  {
    slug: "sysdesign-latency-slo-budgeting",
    topic: "System Design",
    track: "dev",
    title: "Latency SLO Budgeting (p99/p99.9)",
    prompt_md:
      "You need a p99 and p99.9 latency SLO for an order path.\n\nDesign how you:\n- define the measurement points\n- attribute budget to components\n- detect regressions quickly\n- prevent 'averages look fine' failures\n\nAnswer in terms of practical system design and ops.",
    solution_md:
      "Define timestamps at consistent boundaries (strategy→gateway enqueue, risk, encode/send, ack decode). Use monotonic clocks for duration. Budget by component by measuring per-stage histograms and queueing delay separately.\n\nDetect regressions via percentiles and tail-focused alerts, plus change-point detection on histograms. Prevent averages hiding issues by storing histograms (HDR), tracking worst offenders (slowest N), and correlating tails with queue depth, GC/allocs, page faults, and CPU frequency changes.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["system-design", "observability", "latency"],
    source: "Performance ops staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 170,
      rubric: [
        "Defines measurement points and uses monotonic clocks + histograms for tails: 40%",
        "Explains budgeting/attribution by per-stage histograms + queueing vs service time: 35%",
        "Explains regression detection/alerting focused on p99/p99.9 and tail correlates: 25%",
      ],
      reference_solution_md:
        "Instrument consistent boundaries and record per-stage latency histograms with monotonic clocks. Budget by stage and separate queueing delay from service time. Detect regressions via p99/p99.9 alerts and histogram change detection; correlate tails with queue depth, alloc/GC, page faults, CPU freq, etc.\n",
    },
  },
  {
    slug: "sysdesign-cache-warming-and-preload",
    topic: "System Design",
    track: "dev",
    title: "Cache Warming / Preload for Cold Start",
    prompt_md:
      "Design how you handle cold starts in a low-latency trading service.\n\nCover:\n- memory/page cache warming\n- data structure preallocation\n- JIT/branch predictor warmup considerations\n- rollout strategy to avoid hitting production with cold caches\n\nKeep it bounded and practical.",
    solution_md:
      "Preallocate and pre-touch memory (touch pages to avoid major faults), warm critical maps and symbol tables, and load configs/limits before serving. If applicable, run a warmup phase that replays representative traffic to populate caches and train branches.\n\nRollout: bring up instance in shadow mode, verify metrics, then cut over gradually. Monitor page faults, cache-miss proxies, and latency histograms during warmup and after cutover.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["system-design", "performance", "latency"],
    source: "Low-latency operations staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 170,
      rubric: [
        "Mentions preallocation and pre-touch/page fault avoidance and why it matters: 40%",
        "Mentions warmup strategy (shadow, replay traffic) and gradual cutover: 35%",
        "Mentions what to monitor (faults, histograms, cache proxies) and rollback: 25%",
      ],
      reference_solution_md:
        "Preallocate and pre-touch memory to avoid major faults; load configs/limits and warm symbol tables. Run warmup/shadow replay to populate caches and stabilize behavior. Roll out gradually; monitor faults and latency histograms and roll back if tails spike.\n",
    },
  },
  {
    slug: "sysdesign-research-to-prod-model-rollout",
    topic: "System Design",
    track: "dev",
    title: "Research → Production Model Rollout",
    prompt_md:
      "Design a safe rollout process for a model/strategy change from research to production.\n\nCover:\n- versioning and reproducibility\n- shadow testing and backtesting pitfalls\n- gating/feature flags\n- rollback and post-deploy monitoring\n\nKeep it bounded.",
    solution_md:
      "Version everything: code, config, features, and data dependencies. Produce an immutable artifact and record inputs used for training/backtest. Shadow run the new model in production (no trading) to compare signals and latency; watch for data leakage mismatches.\n\nGate activation via feature flags and staged rollouts. Rollback by switching flags/artifacts. Monitor PnL, risk metrics, hit rates, and latency distributions, plus correctness checks (data freshness/seq).",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["system-design", "ml", "operations"],
    source: "Quant dev/research ops staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 180,
      rubric: [
        "Mentions versioned immutable artifacts and reproducibility (code+config+data deps): 35%",
        "Mentions shadow testing and leakage/mismatch pitfalls: 25%",
        "Mentions gated/staged rollout with feature flags and rollback plan: 25%",
        "Mentions post-deploy monitoring (risk, PnL, latency, correctness) clearly: 15%",
      ],
      reference_solution_md:
        "Version code/config/data deps and ship an immutable artifact; record training/backtest inputs. Shadow run in prod and watch leakage/mismatch. Gate activation with flags and staged rollout; rollback via flags/artifact switch. Monitor PnL/risk/latency and data freshness/seq correctness.\n",
    },
  },
  {
    slug: "sysdesign-symbology-normalization",
    topic: "System Design",
    track: "dev",
    title: "Symbology + Normalization Layer",
    prompt_md:
      "Design a symbology/normalization layer for market data and orders.\n\nCover:\n- mapping venue-specific symbols/instruments to internal ids\n- handling corporate actions / symbol changes\n- normalizing different message schemas into a canonical model\n- rollout and consistency (research vs production)\n\nKeep it bounded to components and invariants.",
    solution_md:
      "Use an internal instrument master with stable ids. Maintain mapping tables per venue (venue_symbol → internal_id) versioned by effective date/time. Corporate actions/symbol changes create new versions or alias mappings; never reuse ids.\n\nNormalization converts venue messages into a canonical internal schema with explicit schema versioning. Rollout: publish instrument master snapshots via immutable artifacts; deploy readers first; validate by dual mapping checks and monitoring unknown-symbol rates.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["system-design", "data", "correctness"],
    source: "Trading systems staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 180,
      rubric: [
        "Defines stable internal instrument ids and venue→internal mapping strategy with versioning: 40%",
        "Addresses corporate actions/symbol changes without breaking identity (aliases/effective dating): 30%",
        "Defines canonical schema normalization and mentions schema/version handling: 20%",
        "Mentions rollout/consistency and validation monitoring: 10%",
      ],
      reference_solution_md:
        "Maintain stable internal instrument ids and versioned venue symbol mappings (effective-dated). Handle symbol changes via aliases/new versions; don't reuse ids. Normalize venue schemas to canonical model with explicit versions. Roll out via snapshot artifacts/readers-first and validate with monitoring/dual checks.\n",
    },
  },
  {
    slug: "sysdesign-shared-memory-bus",
    topic: "System Design",
    track: "dev",
    title: "Shared Memory Bus Between Processes",
    prompt_md:
      "Design a shared-memory message bus between two processes on the same machine (producer and multiple consumers).\n\nCover:\n- memory layout (ring/log)\n- how consumers track their position\n- what happens if a consumer falls behind\n- synchronization primitives (atomics)\n\nKeep it in-process/OS-level (no network).",
    solution_md:
      "Use a single-writer append-only log in shared memory with a global write cursor (sequence number). Each consumer has its own read cursor (in shared memory) so lag is measurable. Producer writes messages into the ring/log and then publishes by advancing the cursor with release semantics; consumers read with acquire.\n\nIf consumer falls behind and data is overwritten (bounded ring), enforce a policy: disconnect/resync from snapshot. Keep cursors on separate cache lines to avoid false sharing.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["system-design", "ipc", "performance"],
    source: "Low-latency IPC staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 190,
      rubric: [
        "Defines shared-memory ring/log layout with publish semantics and sequence/cursor: 40%",
        "Explains per-consumer cursors and lag measurement and fall-behind policy: 35%",
        "Mentions synchronization (release publish, acquire consume) and false-sharing avoidance: 25%",
      ],
      reference_solution_md:
        "Shared memory append-only ring/log with global write cursor and per-consumer read cursors. Producer writes then release-publishes cursor; consumers acquire-load cursor then read. If consumer lags past overwritten data, force resync/snapshot. Separate cursor cache lines.\n",
    },
  },
  {
    slug: "sysdesign-tick-to-trade-measurement",
    topic: "System Design",
    track: "dev",
    title: "Tick-to-Trade Latency Measurement",
    prompt_md:
      "Design how you measure tick-to-trade latency (market data arrival → order sent/acked).\n\nCover:\n- where you timestamp\n- how you correlate updates to orders\n- clock choices (monotonic vs wall)\n- how to avoid measurement perturbing latency\n\nKeep it bounded and practical.",
    solution_md:
      "Timestamp market data at NIC receive (or as early as possible) and at key pipeline edges (decode, strategy decision, gateway enqueue, send). Use monotonic clocks for durations; optionally add PTP wall time for cross-host correlation.\n\nCorrelation uses symbol + seq + decision context: strategy can attach a causality id to orders indicating which tick triggered it. Logging should be async and sampled; aggregate latency histograms in-memory and export off hot path.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["system-design", "latency", "observability"],
    source: "HFT measurement staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 170,
      rubric: [
        "Defines timestamp points and uses monotonic durations (optionally wall/PTP for correlation): 40%",
        "Explains correlation mechanism between ticks and orders (causality id/seq/symbol): 35%",
        "Mentions low-perturbation logging/aggregation (async, sampling, histograms): 25%",
      ],
      reference_solution_md:
        "Timestamp earliest receive and key stages; use monotonic for durations, optionally PTP wall for cross-host. Correlate orders to triggering tick via causality id (symbol/seq). Avoid perturbation via async sampled logging and in-memory histograms exported off hot path.\n",
    },
  },
  {
    slug: "sysdesign-deterministic-replay",
    topic: "System Design",
    track: "dev",
    title: "Deterministic Replay for Debugging",
    prompt_md:
      "Design a deterministic replay system to debug rare trading incidents.\n\nCover:\n- what you need to log (inputs, config, randomness)\n- how you handle non-determinism (threads, time)\n- how replay is executed (single-threaded simulation vs recorded schedule)\n\nKeep it bounded and realistic.",
    solution_md:
      "Record all external inputs (market data, order acks/fills), configuration snapshots, and random seeds. Replace time calls with recorded timestamps during replay. To reduce nondeterminism, run the replay in a single-threaded simulation mode with deterministic event ordering (by recorded sequence/time) rather than trying to reproduce thread interleavings.\n\nIf concurrency is required, log scheduling decisions or use deterministic executors, but that’s heavier. The key is to make strategy logic a pure function of recorded inputs + config.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["system-design", "debugging", "replay"],
    source: "Production debugging staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 190,
      rubric: [
        "Mentions logging all external inputs + config snapshot + randomness seeds: 40%",
        "Explains handling time/non-determinism (recorded timestamps; avoid thread nondeterminism via single-thread sim): 40%",
        "Mentions replay execution model and boundaries (pure function assumption) realistically: 20%",
      ],
      reference_solution_md:
        "Log external inputs (MD, acks/fills), config snapshots, and RNG seeds. In replay, replace time with recorded timestamps. Prefer single-thread deterministic simulation ordering by recorded seq/time rather than reproducing thread schedules. Aim for strategy logic as pure function of inputs+config.\n",
    },
  },
  {
    slug: "sysdesign-multi-venue-routing-policy",
    topic: "System Design",
    track: "dev",
    title: "Multi-Venue Routing Policy (High Level)",
    prompt_md:
      "Design a multi-venue order routing policy engine.\n\nCover:\n- inputs (prices, fees, latency, fill probabilities)\n- constraints (risk, order type, venue availability)\n- how you test/roll out policy changes safely\n\nKeep it bounded; focus on components and data flow.",
    solution_md:
      "Split into components: data inputs (NBBO/quotes, fees, latency stats), a policy evaluator producing a ranked venue list with reasons, and a session health filter. Constraints and risk are applied before routing.\n\nFor rollout: version policies, shadow-run and compare decisions, gate by feature flags, and log decisions asynchronously for audit/replay. Keep the hot path simple: precompute routing tables periodically and do O(1) lookup by (symbol, strategy, order type).",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["system-design", "routing", "operations"],
    source: "Execution routing staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 180,
      rubric: [
        "Defines key inputs and constraints and where they apply (health/risk before routing): 40%",
        "Describes components/data flow (policy evaluator + precomputed tables) and hot-path behavior: 35%",
        "Mentions safe rollout/testing (versioning, shadow, flags, audit logs): 25%",
      ],
      reference_solution_md:
        "Use inputs (quotes/fees/latency stats) and constraints (risk/order type/session health). Policy engine outputs ranked venues; precompute routing tables periodically for hot-path O(1) lookup. Roll out via versioned policies, shadow comparisons, feature flags, and async audit logging.\n",
    },
  },
  {
    slug: "sysdesign-capacity-planning-hft",
    topic: "System Design",
    track: "dev",
    title: "Capacity Planning for Event Rates",
    prompt_md:
      "Design how you capacity-plan a low-latency event pipeline.\n\nCover:\n- estimating peak event rates (msgs/sec) and bursts\n- sizing queues/ring buffers\n- CPU core budgeting and pinning\n- failure mode under overload\n\nKeep it practical and quantitative (at a high level).",
    solution_md:
      "Estimate peak + burst rates from historical and worst-case venue specs. Size buffers for burst absorption given service rate margin (Little’s law intuition): buffer ≈ burst_rate * burst_duration. Budget cores by stage and isolate critical threads; measure per-stage service time and ensure utilization stays safely below 100%.\n\nDefine overload policy (drop/coalesce/shed strategy) and alerting on queue depth/lag. Validate with load tests and replay of recorded peak days.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["system-design", "performance", "capacity"],
    source: "Production performance staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 180,
      rubric: [
        "Explains peak/burst estimation and sizing buffers/queues accordingly: 40%",
        "Explains CPU/core budgeting and pinning/isolation for critical stages: 30%",
        "Defines overload behavior and alerting/validation (replay/load test): 30%",
      ],
      reference_solution_md:
        "Estimate peak+burst from specs/history. Size buffers to absorb bursts (burst_rate*duration). Budget cores per stage and keep utilization below saturation; pin/isolate critical threads. Define overload policy (drop/coalesce/shed) and alert on lag/queue depth; validate via load/replay tests.\n",
    },
  },
  {
    slug: "sysdesign-failure-drills-game-days",
    topic: "System Design",
    track: "dev",
    title: "Failure Drills (Game Days) for Trading Systems",
    prompt_md:
      "Design a \"game day\" / failure drill program for a trading system.\n\nCover:\n- which failures you simulate (packet loss, clock drift, disk full, exchange disconnect)\n- how you make drills safe (kill switch, sandbox accounts)\n- what you measure and what success looks like\n\nKeep it bounded but concrete.",
    solution_md:
      "Simulate targeted failures in controlled environments first, then in production with guardrails. Use kill switches, sandbox accounts, and staged scope (one strategy/venue). Failures to simulate: packet loss/gaps, clock drift/step, NIC/CPU saturation, disk full for audit logs, exchange disconnect/resend, config reload failure.\n\nSuccess metrics: time to detect (alerts), time to recover, correctness invariants (no duplicate orders, seq gap handled), and tail-latency impact. Document runbooks and incorporate learnings into automation.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["system-design", "reliability", "operations"],
    source: "SRE/ops staple adapted",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 180,
      rubric: [
        "Names realistic failure scenarios relevant to trading systems: 35%",
        "Explains safety guardrails (kill switch, sandbox, limited scope) and rollout: 30%",
        "Defines measurements/success criteria (detect/recover times, correctness invariants, tails): 35%",
      ],
      reference_solution_md:
        "Run controlled failure drills with guardrails (kill switch, sandbox accounts, staged scope). Simulate packet loss/gaps, clock drift, disk full, exchange disconnect/resend, CPU/NIC saturation, config reload failure. Measure detect/recover time, invariants (no dup orders; gaps handled), and tail-latency impact; update runbooks/automation.\n",
    },
  },
  {
    slug: "sysdesign-drop-copy-trade-capture",
    topic: "System Design",
    track: "dev",
    title: "Drop Copy / Trade Capture + Reconciliation",
    prompt_md:
      "Design a trade capture system using a drop-copy feed (or broker reports).\n\nCover:\n- how you ingest and normalize trades\n- how you correlate them to internal orders\n- how you ensure completeness (no missing trades)\n- reconciliation vs exchange/broker statements\n- what you persist and how you replay\n\nKeep it bounded (components + invariants).",
    solution_md:
      "Ingest drop-copy into a normalized trade event stream with stable identifiers (venue trade id, session, seq). Correlate to internal orders using client order id and execution ids; handle partial fills.\n\nEnsure completeness via seq/gap detection and periodic statement reconciliation. Persist an append-only immutable trade log (with schema version and checksums) for replay; maintain projections (positions/PnL) as derived state with checkpoints. Alert on mismatches and build resync tooling.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["system-design", "reconciliation", "correctness"],
    source: "Trading ops staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 190,
      rubric: [
        "Defines ingestion + normalization + stable identifiers and correlation to internal orders: 40%",
        "Explains completeness guarantees (seq/gaps) and reconciliation with external statements: 35%",
        "Defines persistence/replay (append-only log, checksums/schema version) and projections/checkpoints: 25%",
      ],
      reference_solution_md:
        "Normalize drop-copy into trade events with stable ids (trade id/session/seq) and correlate via client order ids/execution ids. Ensure completeness via seq/gap detection and reconcile with broker/exchange statements. Persist append-only trade log for replay; derive positions/PnL via projections with checkpoints; alert and resync on mismatches.\n",
    },
  },
];
