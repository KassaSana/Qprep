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
        "Mentions sequence numbers and gap detection",
        "Proposes a gap recovery mechanism (gap-fill channel, snapshot, A/B feeds)",
        "Describes a threading model with dedicated cores and a queue/ring buffer handoff",
        "Addresses tail latency (avoid allocations, pin cores, histograms, page faults/NUMA)",
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
        "Places checks on the hot path (in-process gateway) and explains why",
        "Names at least two concrete checks (size, price band, position, notional, rate limits)",
        "Mentions techniques to avoid latency spikes (no allocations, pre-reserve, async logging, pin cores)",
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
];
