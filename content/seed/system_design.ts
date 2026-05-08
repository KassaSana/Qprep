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
];
