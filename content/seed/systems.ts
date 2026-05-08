import type { SeedQuestion } from "@/content/question-types";

/**
 * Systems — OS / hardware / networking depth for quant-dev interviews.
 *
 * Focus: cache/memory, scheduling, IO, and latency diagnostics.
 * No finance/options content.
 */
export const SYSTEMS_SEED: SeedQuestion[] = [
  {
    slug: "sys-cacheline-false-sharing-diagnose-freeform",
    topic: "Systems",
    track: "dev",
    title: "Cache Lines and False Sharing — Diagnose the Symptom",
    prompt_md:
      "You have two threads incrementing two different counters in a tight loop. Surprisingly, throughput is far worse than expected, even though the counters are different variables.\n\nExplain a likely cause at the CPU-cache level and give two concrete fixes.\n\nAnswer in 6–10 sentences.",
    solution_md:
      "A likely cause is false sharing: the two counters sit on the same cache line, so each core's write invalidates the other's cache line (coherence ping-pong), causing heavy inter-core traffic and stalling.\n\nFixes include padding/alignment so each counter is on a separate cache line (e.g., `alignas(64)` or `std::hardware_destructive_interference_size`) and using per-thread counters with periodic aggregation (reduce write frequency and sharing).",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["cache", "performance", "false-sharing"],
    source: "Low-latency systems staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 110,
      rubric: [
        "Identifies false sharing as the cause (different vars on same cache line): 45%",
        "Explains coherence invalidation/ping-pong mechanism (MESI-style) at a high level: 35%",
        "Gives two concrete fixes (padding/alignment; sharding + aggregation; reduce shared writes): 20%",
      ],
      reference_solution_md:
        "Likely false sharing: counters share one cache line, so writes cause coherence ping-pong. Fix: separate onto different cache lines (align/pad) and/or shard per-thread then aggregate.\n",
    },
  },
  {
    slug: "sys-page-faults-major-minor-freeform",
    topic: "Systems",
    track: "dev",
    title: "Major vs Minor Page Faults",
    prompt_md:
      "Explain the difference between a **minor** and a **major** page fault.\n\nIn 5–10 sentences: describe what triggers each and why major faults can be catastrophic for latency.",
    solution_md:
      "A minor page fault occurs when the page is not currently mapped for the process but the data is already resident in memory (e.g., page in the page cache or shared), so the kernel mostly updates page tables and bookkeeping.\n\nA major page fault requires fetching the page from disk (or another slow backing store), which introduces large, unpredictable latency. For low-latency systems, major faults can cause multi-millisecond stalls and tail-latency spikes.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["virtual-memory", "page-faults", "latency"],
    source: "OS fundamentals",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 105,
      rubric: [
        "Correctly distinguishes minor (in-memory, mapping work) vs major (requires IO/backing store): 55%",
        "Mentions page tables / mapping update vs disk access as the key difference: 25%",
        "Connects major faults to tail latency and why they're bad for low-latency workloads: 20%",
      ],
      reference_solution_md:
        "Minor: page not mapped but already in RAM → update mappings. Major: must fetch from disk/backing store → long unpredictable stall; bad for tail latency.\n",
    },
  },
  {
    slug: "sys-tlb-what-is-it-freeform",
    topic: "Systems",
    track: "dev",
    title: "TLB — What Is It and Why Do We Care?",
    prompt_md:
      "What is the TLB (translation lookaside buffer), and why can TLB misses hurt performance?\n\nAnswer in 5–10 sentences and mention page size and locality.",
    solution_md:
      "The TLB is a small cache in the CPU that stores recent virtual-to-physical address translations. A TLB miss forces the CPU to walk page tables (often multiple memory accesses), which is expensive and can stall loads.\n\nTLB behavior depends on working-set size and page size: larger pages (hugepages) can reduce the number of translations needed, improving TLB hit rate for large contiguous memory regions. Good spatial locality helps; random access patterns can blow out the TLB.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["tlb", "virtual-memory", "performance"],
    source: "Systems fundamentals",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 105,
      rubric: [
        "Defines TLB as a cache of address translations (VA→PA): 45%",
        "Explains why misses are expensive (page-table walk / extra memory accesses): 35%",
        "Mentions page size/hugepages or locality as a lever affecting miss rate: 20%",
      ],
      reference_solution_md:
        "TLB caches VA→PA translations. Miss → page-table walk (extra memory accesses) → stalls. Hugepages reduce translation count; locality improves hit rate.\n",
    },
  },
  {
    slug: "sys-epoll-vs-select-why-freeform",
    topic: "Systems",
    track: "dev",
    title: "Why `epoll` Scales Better Than `select`",
    prompt_md:
      "In Linux, why does `epoll` typically scale better than `select`/`poll` for many sockets?\n\nAnswer in 5–10 sentences and mention the complexity difference.",
    solution_md:
      "`select`/`poll` typically scan a list of file descriptors each time you wait, making readiness checking proportional to the number of fds (often O(n) per call). `epoll` registers interest once and then returns only the ready fds, so the work is closer to O(#ready) per wakeup. It also avoids repeatedly copying large fd sets between user and kernel.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["linux", "io", "epoll"],
    source: "Linux I/O staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 105,
      rubric: [
        "Contrasts scan-based select/poll vs event-based epoll registration model: 45%",
        "States the complexity intuition (O(n) scanning vs ~O(#ready) delivery): 35%",
        "Mentions avoiding repeated copying of fd sets or other practical overhead: 20%",
      ],
      reference_solution_md:
        "select/poll scan fds each wait (O(n)). epoll registers once and returns ready fds (~O(#ready)), reducing scanning/copying overhead.\n",
    },
  },
  {
    slug: "sys-context-switch-costs-freeform",
    topic: "Systems",
    track: "dev",
    title: "Why Context Switches Are Expensive",
    prompt_md:
      "Why are context switches (or frequent thread migrations) expensive in low-latency systems?\n\nAnswer in 5–10 sentences and mention at least two concrete costs.",
    solution_md:
      "Context switches cost CPU time for saving/restoring registers and kernel scheduler overhead. They can also destroy cache locality: L1/L2 caches and TLB entries may no longer be warm, increasing miss rates after the switch.\n\nIf threads migrate across cores, you also lose NUMA locality and may pay remote memory penalties. Frequent switches increase tail latency because the preempted thread might not run again promptly.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["scheduling", "latency", "performance"],
    source: "Systems performance staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 105,
      rubric: [
        "Mentions at least two concrete costs (scheduler overhead; cache/TLB coldness; NUMA penalties; run-queue delays): 60%",
        "Connects those costs to tail latency / jitter: 25%",
        "Uses correct systems terminology (cache/TLB/NUMA/preemption) without major errors: 15%",
      ],
      reference_solution_md:
        "Context switches cost scheduler overhead + register save/restore, and they wreck cache/TLB locality. Cross-core migration can add NUMA remote-memory penalties. All of this increases jitter/tail latency.\n",
    },
  },
  {
    slug: "sys-mmap-vs-read-when-freeform",
    topic: "Systems",
    track: "dev",
    title: "`mmap` vs `read` — When Would You Use Each?",
    prompt_md:
      "Compare using `mmap` vs using `read`/`pread` for file IO.\n\nIn 6–10 sentences: mention page faults, random access, and one pitfall of `mmap`.",
    solution_md:
      "`mmap` maps file pages into your address space so reads become memory loads, which can be convenient for random access and lets the kernel page-cache handle caching. But you can incur page faults on first touch, making latency spiky, and errors surface as SIGBUS/segfault-like faults rather than explicit error returns.\n\n`read`/`pread` is explicit and often easier to bound/handle; you can batch reads and handle partial reads/errors directly. `mmap` can be great for read-mostly, random-access workloads when you can tolerate or pre-fault pages.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["linux", "io", "mmap"],
    source: "Systems tradeoff staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "Contrasts mmap as memory-mapped access vs read/pread as explicit syscalls: 35%",
        "Mentions page faults and their latency implications (especially first-touch): 35%",
        "Names at least one mmap pitfall (SIGBUS on truncation, fault-driven errors, address-space pressure, writeback surprises): 30%",
      ],
      reference_solution_md:
        "mmap turns file IO into memory accesses but can cause page faults and fault-driven failures (e.g., SIGBUS). read/pread is explicit and easier to handle; mmap can be good for random access when you can manage faults (prefault/hugepages).\n",
    },
  },
  {
    slug: "sys-hugepages-why-freeform",
    topic: "Systems",
    track: "dev",
    title: "Huge Pages — Why They Help (and When They Hurt)",
    prompt_md:
      "Why can huge pages (e.g. 2MB pages) improve performance for some workloads?\n\nAnswer in 6–10 sentences and mention TLB coverage and fragmentation/tradeoffs.",
    solution_md:
      "Huge pages increase the amount of memory covered by a single TLB entry, reducing TLB misses for large working sets and improving performance on memory-intensive workloads. They can also reduce page-table size and page-walk overhead.\n\nTradeoffs: huge pages can increase internal fragmentation and make allocation/compaction harder; they can also complicate memory management and may waste memory for small allocations. In practice they help when you have large, contiguous, hot memory regions (e.g., large arrays, in-memory books).",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["virtual-memory", "tlb", "performance"],
    source: "Low-latency systems staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 115,
      rubric: [
        "Explains TLB coverage benefit (more bytes per TLB entry → fewer misses): 55%",
        "Mentions reduced page-walk/page-table overhead as an additional benefit: 15%",
        "Mentions at least one real tradeoff (fragmentation/waste, allocation complexity, operational overhead): 30%",
      ],
      reference_solution_md:
        "Huge pages increase TLB coverage and reduce page-walk overhead, helping large hot working sets. Tradeoffs include fragmentation/wasted memory and harder allocation/ops complexity.\n",
    },
  },
  {
    slug: "sys-mlock-what-why-freeform",
    topic: "Systems",
    track: "dev",
    title: "`mlock` / Page Fault Avoidance",
    prompt_md:
      "What does `mlock` do on Linux, and why might a low-latency service use it?\n\nAnswer in 5–10 sentences and mention page faults and swap.",
    solution_md:
      "`mlock` pins pages in RAM so they are not swapped out. Low-latency systems use it to reduce tail latency by avoiding major page faults caused by page-in from disk/swap.\n\nIt doesn't magically prevent all page faults (e.g., first-touch can still fault), but combined with prefaulting/pre-touching, it helps ensure hot memory stays resident. Tradeoffs include higher memory pressure and requiring appropriate privileges/limits.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["linux", "virtual-memory", "latency"],
    source: "Low-latency ops staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 110,
      rubric: [
        "States mlock pins pages in RAM / prevents swapping: 50%",
        "Connects to avoiding major page faults and tail latency spikes: 35%",
        "Mentions tradeoffs/limitations (first-touch faults, memory pressure, privileges/rlimits): 15%",
      ],
      reference_solution_md:
        "mlock pins memory to avoid swapping. Used to reduce tail latency by avoiding major faults; combine with prefault/pre-touch. Tradeoffs: memory pressure and privileges.\n",
    },
  },
  {
    slug: "sys-numa-what-can-go-wrong-freeform",
    topic: "Systems",
    track: "dev",
    title: "NUMA — What Can Go Wrong?",
    prompt_md:
      "On a dual-socket NUMA machine, what can go wrong if a latency-sensitive thread runs on CPU socket A but mostly accesses memory allocated on socket B?\n\nAnswer in 5–10 sentences and name two mitigations.",
    solution_md:
      "Remote NUMA memory access adds extra latency and reduces bandwidth because the request traverses the inter-socket link, increasing tail latency for memory-bound work. It can also increase contention on that link.\n\nMitigations: pin threads to cores and allocate memory on the same NUMA node (first-touch or explicit NUMA APIs), use `numactl`/cpusets, partition per-core/per-socket state, and avoid cross-socket sharing on hot paths.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["numa", "performance", "latency"],
    source: "HFT systems staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 115,
      rubric: [
        "Explains remote memory adds latency / reduces bandwidth vs local NUMA: 55%",
        "Connects to tail latency / jitter on memory accesses: 20%",
        "Gives two mitigations (pinning + local allocation/first-touch, numactl/cpuset, sharding per socket): 25%",
      ],
      reference_solution_md:
        "Remote NUMA access traverses interconnect → higher latency/lower bandwidth and worse tail latency. Mitigate with thread pinning + local allocation (first-touch/numa APIs), numactl/cpusets, and per-socket sharding.\n",
    },
  },
  {
    slug: "sys-clock-sources-monotonic-freeform",
    topic: "Systems",
    track: "dev",
    title: "Time Sources: `CLOCK_MONOTONIC` vs `CLOCK_REALTIME`",
    prompt_md:
      "When measuring latency inside a process, why is `CLOCK_MONOTONIC` (or `steady_clock`) typically preferred over `CLOCK_REALTIME`?\n\nAnswer in 4–8 sentences and mention time adjustments.",
    solution_md:
      "`CLOCK_REALTIME` represents wall-clock time and can jump forwards/backwards due to NTP adjustments, manual changes, or leap seconds handling. That can produce negative or distorted durations.\n\n`CLOCK_MONOTONIC` is designed for measuring intervals: it is monotonic and not subject to wall-clock jumps, making it suitable for latency measurement and timeouts.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["time", "latency", "linux"],
    source: "Systems fundamentals",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 85,
      rubric: [
        "States realtime can jump due to NTP/manual adjustments and is not safe for durations: 55%",
        "States monotonic is monotonic and appropriate for interval measurement: 35%",
        "Mentions practical consequence (negative durations / broken timeouts / jittery metrics): 10%",
      ],
      reference_solution_md:
        "Use monotonic/steady clocks for durations because realtime can jump due to NTP/manual changes, leading to incorrect/negative intervals.\n",
    },
  },
  {
    slug: "sys-udp-vs-tcp-latency-tradeoff-freeform",
    topic: "Systems",
    track: "dev",
    title: "UDP vs TCP — Latency Tradeoffs",
    prompt_md:
      "In low-latency systems, why might you choose UDP for data distribution and TCP for recovery/control?\n\nAnswer in 6–10 sentences and mention head-of-line blocking and loss.",
    solution_md:
      "UDP has lower overhead and avoids TCP's retransmission and congestion-control behaviors on the data path, which can create head-of-line blocking and latency spikes. It also supports multicast efficiently for one-to-many distribution.\n\nBut UDP can lose/reorder packets, so you often pair it with sequence numbers + gap detection and use TCP (or another reliable channel) for gap fill, snapshots, and control messages where reliability matters more than microsecond latency.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["networking", "udp", "tcp"],
    source: "Low-latency networking staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 115,
      rubric: [
        "Explains why UDP can be lower-latency (less HOL blocking / no retransmission on critical path, multicast): 50%",
        "Mentions UDP downsides (loss/reordering) and need for sequencing/gap detection: 30%",
        "Explains why TCP is used for recovery/control (reliability; gap fill/snapshots): 20%",
      ],
      reference_solution_md:
        "Use UDP/multicast for low-latency distribution; TCP can introduce HOL blocking/retransmission latency. Pair UDP with seq numbers + gap detection and use TCP for gap fill/control where reliability is needed.\n",
    },
  },
  {
    slug: "sys-io-uring-vs-epoll-freeform",
    topic: "Systems",
    track: "dev",
    title: "`io_uring` vs `epoll` (High Level)",
    prompt_md:
      "At a high level, how does `io_uring` differ from `epoll` in Linux, and why might it improve performance?\n\nAnswer in 6–10 sentences; mention syscalls and batching.",
    solution_md:
      "`epoll` is an event notification mechanism: it tells you which fds are ready, but you still perform read/write syscalls to do IO. `io_uring` provides a submission/completion queue interface that can batch IO operations and reduce the number of syscalls by submitting many requests at once and receiving completions via shared rings.\n\nThis can reduce syscall overhead and context switches, and enable more efficient async IO patterns. The real gains depend on workload, kernel version, and whether you can structure IO to batch effectively.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["linux", "io", "io_uring"],
    source: "Linux performance staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 125,
      rubric: [
        "Contrasts epoll readiness notification vs io_uring submission/completion model: 45%",
        "Mentions batching and reduced syscalls as core performance reasons: 40%",
        "Mentions practical caveat (workload/kernel version/structure) without misinformation: 15%",
      ],
      reference_solution_md:
        "epoll tells you readiness, then you do syscalls. io_uring is submission/completion rings enabling batching and fewer syscalls/context switches. Gains depend on workload and how well you batch.\n",
    },
  },
  {
    slug: "sys-busy-polling-why-freeform",
    topic: "Systems",
    track: "dev",
    title: "Busy Polling — Why It Reduces Latency (and Costs CPU)",
    prompt_md:
      "Why does busy polling (spin-waiting) sometimes reduce latency in trading systems, and what is the main cost?\n\nAnswer in 5–10 sentences and mention scheduling and tail latency.",
    solution_md:
      "Busy polling avoids going to sleep and being woken by the scheduler/interrupts, which can add unpredictable wakeup latency. By continuously polling a NIC queue or ring buffer, you can react immediately when data arrives, reducing tail latency.\n\nThe main cost is burning CPU (power/thermal) and potentially starving other work; it can also increase contention if not isolated to dedicated cores. It's typically used only on pinned/isolated cores for critical-path threads.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["latency", "scheduling", "performance"],
    source: "Low-latency engineering staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 110,
      rubric: [
        "Explains avoiding sleep/wakeup scheduling overhead reduces tail latency: 55%",
        "States main cost is CPU burn / resource usage and potential interference: 30%",
        "Mentions isolation/pinning as a practical requirement for safe use: 15%",
      ],
      reference_solution_md:
        "Busy polling reduces latency by avoiding sleep/wakeup scheduling jitter; cost is CPU burn and interference unless cores are dedicated/pinned.\n",
    },
  },
  {
    slug: "sys-kernel-bypass-why-freeform",
    topic: "Systems",
    track: "dev",
    title: "Kernel Bypass (DPDK/Solarflare/OpenOnload) — Why?",
    prompt_md:
      "What is kernel bypass in networking, and why might a colocated trading system use it?\n\nAnswer in 6–10 sentences and mention syscalls/copies/interrupts.",
    solution_md:
      "Kernel bypass moves packet processing from the kernel networking stack into user space (often via a driver exposing NIC rings directly). This can reduce latency by avoiding syscalls, kernel scheduling, interrupt handling, and multiple memory copies through the stack.\n\nIt enables busy polling and tighter control over batching, memory allocation, and CPU affinity. Tradeoffs include higher complexity, less portability, and needing careful operational tuning.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["networking", "low-latency", "dpdk"],
    source: "HFT networking staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 130,
      rubric: [
        "Defines kernel bypass as user-space packet IO bypassing kernel stack: 40%",
        "Mentions at least two reduced overheads (syscalls, copies, interrupts/scheduling): 40%",
        "Mentions tradeoffs (complexity/ops/portability) clearly: 20%",
      ],
      reference_solution_md:
        "Kernel bypass exposes NIC rings to user space, bypassing kernel stack to reduce syscalls/copies/interrupt/scheduling overhead; used for lower tail latency. Tradeoff: complexity and tuning burden.\n",
    },
  },
  {
    slug: "sys-perf-flamegraphs-what-they-show-freeform",
    topic: "Systems",
    track: "dev",
    title: "`perf` + Flame Graphs — What Do They Tell You?",
    prompt_md:
      "What does Linux `perf` sampling measure, and what does a flame graph visualize?\n\nAnswer in 5–10 sentences and mention that sampling is statistical.",
    solution_md:
      "`perf` can sample program counters (and call stacks) at some frequency, attributing where CPU time is spent statistically rather than deterministically. A flame graph visualizes aggregated stack traces: width corresponds to the amount of sampled time in that stack path; height corresponds to call depth.\n\nBecause it's sampling, small functions may be noisy, and interpreting results requires understanding the sampling rate and overhead. It’s excellent for identifying hot paths and unexpected call stacks in production-like workloads.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["profiling", "linux", "performance"],
    source: "Performance engineering staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "Explains perf sampling as statistical attribution of CPU time via sampled PCs/stacks: 55%",
        "Explains flame graph encoding (width=time, stacks aggregated, height=depth): 35%",
        "Mentions sampling caveat/noise and need for proper interpretation: 10%",
      ],
      reference_solution_md:
        "perf samples PCs/stacks statistically to estimate where CPU time goes. Flame graphs aggregate stacks: width ≈ sampled time, height = depth. Sampling is statistical/noisy for small signals.\n",
    },
  },
  {
    slug: "sys-lock-contention-symptoms-freeform",
    topic: "Systems",
    track: "dev",
    title: "Lock Contention — Symptoms and a Fix",
    prompt_md:
      "In a multithreaded service, what are common symptoms of lock contention, and name two fixes?\n\nAnswer in 5–10 sentences and mention tail latency.",
    solution_md:
      "Symptoms include high CPU time in mutex functions, threads frequently blocked/runnable but not making progress, throughput flattening as threads increase, and tail latency spikes due to queueing behind a lock. You may also see increased context switches and cache-line ping-pong on lock metadata.\n\nFixes: reduce shared mutable state (shard/partition), use finer-grained locks or lock-free structures, batch work to reduce lock frequency, or move contention off hot path with SPSC queues.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["concurrency", "latency", "performance"],
    source: "Performance engineering staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "Names realistic symptoms (blocked threads, mutex hot in profile, throughput plateau, tail spikes): 50%",
        "Explains why tail latency worsens (queueing behind lock / contention): 20%",
        "Gives two concrete fixes (sharding, reduce shared state, batching, finer locks, lock-free/SPSC): 30%",
      ],
      reference_solution_md:
        "Contention shows as time in mutex, blocked threads, throughput plateau, and tail spikes due to queueing. Fix by sharding/reducing shared state, batching, finer locks, or moving to SPSC/lock-free patterns.\n",
    },
  },
  {
    slug: "sys-rss-vs-vsz-what-means-freeform",
    topic: "Systems",
    track: "dev",
    title: "RSS vs VSZ — What Do They Mean?",
    prompt_md:
      "What is the difference between RSS and VSZ (virtual memory size) for a process?\n\nAnswer in 4–8 sentences and mention memory mapping.",
    solution_md:
      "VSZ is the amount of virtual address space the process has mapped; it includes regions that may not be resident in RAM (e.g., unmapped-on-demand pages, mmapped files not touched). RSS is the portion that is actually resident in physical memory at the moment (pages currently in RAM for that process).\n\nLarge VSZ can come from mappings that aren't used; RSS is typically the more relevant number for memory pressure, though shared pages complicate attribution.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["memory", "linux"],
    source: "Ops fundamentals",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 95,
      rubric: [
        "Defines VSZ as mapped virtual address space (not necessarily resident): 45%",
        "Defines RSS as resident physical memory pages currently in RAM: 45%",
        "Mentions mmap/touched pages/shared attribution as nuance: 10%",
      ],
      reference_solution_md:
        "VSZ = mapped virtual address space; RSS = resident pages in RAM. Mappings (mmap) may not be resident until touched; shared pages complicate attribution.\n",
    },
  },
  {
    slug: "sys-cgroups-what-problem-freeform",
    topic: "Systems",
    track: "dev",
    title: "cgroups — What Problem Do They Solve?",
    prompt_md:
      "What are Linux cgroups, and what problem do they solve?\n\nAnswer in 5–10 sentences and give one example relevant to performance isolation.",
    solution_md:
      "cgroups (control groups) let you account for and limit resource usage (CPU, memory, IO) for a group of processes. They solve the problem of isolating workloads so one process can't starve others or exceed budgets.\n\nExample: you can cap CPU shares or set CPU affinity/quotas for a background job so it doesn't steal cycles from a latency-critical service; or set memory limits to prevent swapping/oom interactions across unrelated processes.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["linux", "isolation", "performance"],
    source: "Ops/performance staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 115,
      rubric: [
        "Defines cgroups as resource accounting/limiting for process groups: 55%",
        "Explains the isolation goal (prevent starvation / enforce budgets): 25%",
        "Gives a concrete performance isolation example (CPU quota/shares, memory limits, IO throttling): 20%",
      ],
      reference_solution_md:
        "cgroups provide resource accounting and limits for process groups (CPU/mem/IO), enabling isolation so background workloads don't starve low-latency services (e.g., CPU quota, memory limit).\n",
    },
  },
  {
    slug: "sys-nagle-tcp-nodelay-freeform",
    topic: "Systems",
    track: "dev",
    title: "Nagle's Algorithm and `TCP_NODELAY`",
    prompt_md:
      "What is Nagle's algorithm in TCP, and why might enabling `TCP_NODELAY` reduce latency for some applications?\n\nAnswer in 5–10 sentences and mention small packets and ACKs.",
    solution_md:
      "Nagle's algorithm tries to reduce small-packet overhead by coalescing tiny writes until previous data is acknowledged (or enough data accumulates). This can introduce extra delay for latency-sensitive request/response patterns that send many small messages.\n\nSetting `TCP_NODELAY` disables Nagle, allowing small packets to be sent immediately, which can reduce latency at the cost of potentially more packets and overhead. Whether it helps depends on the pattern and on interaction with delayed ACKs.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["networking", "tcp", "latency"],
    source: "Networking performance staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 115,
      rubric: [
        "Explains Nagle as coalescing small writes to reduce small-packet overhead: 50%",
        "Explains why this can add latency in small-message patterns and why TCP_NODELAY helps: 35%",
        "Mentions tradeoff (more packets/overhead) or delayed ACK interaction: 15%",
      ],
      reference_solution_md:
        "Nagle coalesces small TCP sends until ACK/aggregation, which can add latency for tiny messages. TCP_NODELAY disables it so small packets send immediately, trading overhead for latency.\n",
    },
  },
  {
    slug: "sys-irq-affinity-why-freeform",
    topic: "Systems",
    track: "dev",
    title: "IRQ Affinity — Why It Matters",
    prompt_md:
      "What is IRQ affinity and why does it matter for network latency on Linux?\n\nAnswer in 5–10 sentences and mention cache locality and jitter.",
    solution_md:
      "IRQ affinity controls which CPU core handles a device's interrupts (e.g., NIC RX/TX). If interrupts bounce across cores, you can lose cache locality and introduce jitter due to scheduler/interrupt distribution. Pinning NIC interrupts to the same core(s) used by your network processing threads can improve locality and reduce tail latency.\n\nThe tradeoff is you must ensure you don't overload one core and you need careful core isolation for low-latency work.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["linux", "networking", "performance"],
    source: "Low-latency ops staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 115,
      rubric: [
        "Defines IRQ affinity as selecting which CPU handles device interrupts: 40%",
        "Connects to cache locality/jitter and tail latency for NIC processing: 40%",
        "Mentions a practical tuning idea (pin IRQs + threads; avoid overload) and tradeoff: 20%",
      ],
      reference_solution_md:
        "IRQ affinity pins device interrupts to specific CPUs. Stable placement improves cache locality and reduces jitter for NIC handling; tune alongside thread pinning while avoiding core overload.\n",
    },
  },
  {
    slug: "sys-rss-nic-why-freeform",
    topic: "Systems",
    track: "dev",
    title: "NIC RSS (Receive Side Scaling) — Why Use It?",
    prompt_md:
      "What is Receive Side Scaling (RSS) on a NIC, and why is it useful?\n\nAnswer in 5–10 sentences and mention distributing flows across queues/cores.",
    solution_md:
      "RSS hashes packet headers (e.g., 5‑tuple) to distribute incoming traffic across multiple receive queues, so multiple CPU cores can process packets in parallel. This improves throughput and helps avoid a single-core bottleneck on high packet rates.\n\nFor latency-sensitive systems, RSS can be combined with queue-to-core pinning so a given flow stays on one queue/core, improving cache locality and reducing locking in the network stack or user-space processing.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["networking", "performance", "linux"],
    source: "Networking systems staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 115,
      rubric: [
        "Defines RSS as hashing to distribute RX across multiple queues/cores: 55%",
        "Explains benefit (parallelism/throughput; avoid bottleneck): 25%",
        "Mentions queue-to-core pinning / flow affinity and locality as a latency angle: 20%",
      ],
      reference_solution_md:
        "RSS hashes flows to distribute packets across NIC RX queues for parallel processing. With queue-to-core pinning it improves locality and reduces contention.\n",
    },
  },
  {
    slug: "sys-batching-tradeoff-latency-throughput-freeform",
    topic: "Systems",
    track: "dev",
    title: "Batching: Throughput vs Latency",
    prompt_md:
      "Why does batching work often improve throughput but worsen tail latency?\n\nAnswer in 5–10 sentences and give one example (network packets, logging, disk IO).",
    solution_md:
      "Batching amortizes fixed overheads (syscalls, locks, cache misses) across many items, improving throughput and CPU efficiency. But it introduces queueing delay: an item may wait in a buffer until the batch is full or a timer fires, increasing latency and especially tail latency.\n\nExample: batching network sends reduces syscalls but delays the first packet; batching logs improves write throughput but delays visibility. Low-latency systems often use small batches or adaptive batching with tight time bounds.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["latency", "performance", "throughput"],
    source: "Performance engineering staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 115,
      rubric: [
        "Explains batching amortizes overhead and improves throughput: 45%",
        "Explains batching introduces queueing delay → worse latency/tail: 45%",
        "Gives one concrete example and mentions mitigation (small/adaptive batches or deadlines): 10%",
      ],
      reference_solution_md:
        "Batching amortizes overhead, improving throughput, but adds queueing delay (items wait for batch) which worsens tail latency. Use small/adaptive batches with tight time bounds.\n",
    },
  },
  {
    slug: "sys-udp-reordering-dedup-freeform",
    topic: "Systems",
    track: "dev",
    title: "UDP Reordering/Dedup — How Do You Handle It?",
    prompt_md:
      "If you receive updates over UDP, how do you handle packet reordering, duplicates, and loss?\n\nAnswer in 6–10 sentences and mention sequence numbers and buffering.",
    solution_md:
      "Use sequence numbers (or per-stream monotonic IDs) to detect gaps and out-of-order packets. Maintain a small reorder buffer keyed by sequence number; apply packets in order and discard duplicates. If a gap persists beyond a timeout or buffer window, trigger recovery (request gap fill, snapshot refresh, or failover to an alternate feed).\n\nDesign must bound memory and avoid unbounded buffering; you typically accept that late packets past the window are discarded.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["networking", "udp", "reliability"],
    source: "Market data / realtime systems staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 125,
      rubric: [
        "Mentions sequence numbers to detect loss and reordering: 45%",
        "Mentions reorder buffer + dedup strategy and applying in order: 35%",
        "Mentions bounded window/timeouts and recovery action (gap fill/snapshot/failover): 20%",
      ],
      reference_solution_md:
        "Use seq numbers; keep bounded reorder buffer; discard duplicates; detect gaps and trigger gap fill/snapshot/failover after timeout/window.\n",
    },
  },
  {
    slug: "sys-memory-barriers-why-on-x86-freeform",
    topic: "Systems",
    track: "dev",
    title: "Memory Ordering — Why It Still Matters on x86",
    prompt_md:
      "x86 has a relatively strong memory model compared to some other CPUs. Why do memory ordering and atomics still matter for correctness and performance?\n\nAnswer in 6–10 sentences and mention compilers and portability.",
    solution_md:
      "Even on x86, compilers can reorder loads/stores unless constrained by atomics/fences, so you need the language memory model for correctness. Also, x86 is not fully sequentially consistent (e.g., store→load reordering can happen), so relying on informal assumptions is risky.\n\nPortability matters: code that \"works\" on x86 may break on ARM/Power. Performance matters too: stronger fences/orderings can be expensive; choosing minimal correct order (acquire/release) avoids unnecessary barriers.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["memory-model", "performance", "portability"],
    source: "Concurrency/systems staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 135,
      rubric: [
        "Mentions compiler reordering and need for language-level atomics/fences: 45%",
        "Mentions portability to weaker models (ARM/Power) as key reason: 30%",
        "Mentions performance tradeoff of stronger fences/orderings: 25%",
      ],
      reference_solution_md:
        "Ordering still matters because compilers reorder and x86 isn't fully SC; portability to ARM/Power requires correct atomics. Stronger fences cost performance, so pick minimal correct ordering.\n",
    },
  },
  {
    slug: "sys-socket-buffers-rmem-wmem-freeform",
    topic: "Systems",
    track: "dev",
    title: "Socket Buffers: `rmem`/`wmem` and Latency",
    prompt_md:
      "What are TCP/UDP socket receive/send buffers, and how can their sizing impact latency and loss?\n\nAnswer in 6–10 sentences. Mention buffering vs backpressure.",
    solution_md:
      "Socket buffers hold data in the kernel between the NIC and your application (receive) or between your application and the NIC (send). If receive buffers are too small, bursts can overflow and you can drop packets (especially for UDP) or trigger excessive retransmits/backpressure for TCP. If buffers are too large, you can hide congestion and build up queueing delay (bufferbloat), worsening tail latency.\n\nGood tuning balances loss protection for bursts with bounded queueing delay; for low-latency work you often prefer smaller buffers plus application-level backpressure and careful batching.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["networking", "tcp", "latency"],
    source: "Low-latency networking staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 125,
      rubric: [
        "Defines recv/send socket buffers as kernel queues between app and NIC: 40%",
        "Explains too-small buffers → drops (UDP) or retransmit/backpressure (TCP): 30%",
        "Explains too-large buffers → queueing delay/bufferbloat → worse tail latency: 30%",
      ],
      reference_solution_md:
        "Socket buffers queue data in kernel. Too small → drops or retransmits; too large → bufferbloat/queueing delay. Tune to balance burst tolerance and tail latency.\n",
    },
  },
  {
    slug: "sys-bufferbloat-what-is-it-freeform",
    topic: "Systems",
    track: "dev",
    title: "Bufferbloat — What Is It?",
    prompt_md:
      "What is bufferbloat, and why is it especially harmful for latency-sensitive systems?\n\nAnswer in 5–10 sentences and mention queueing delay.",
    solution_md:
      "Bufferbloat is excessive buffering in the network (or OS) that causes large queueing delays under load. Even if throughput is high, packets may sit in queues for a long time, inflating RTT and tail latency.\n\nIt’s harmful for latency-sensitive systems because it makes response times unpredictable and can amplify feedback loops (timeouts, rate control). Mitigations include AQM (e.g., CoDel/RED), smaller buffers, and explicit backpressure or pacing.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["networking", "latency", "queues"],
    source: "Networking performance staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 115,
      rubric: [
        "Defines bufferbloat as excessive buffering leading to large queueing delay: 55%",
        "Connects to tail latency/jitter and why throughput alone is misleading: 25%",
        "Mentions at least one mitigation (AQM, smaller buffers, pacing/backpressure): 20%",
      ],
      reference_solution_md:
        "Bufferbloat = too much buffering → big queueing delays and tail latency under load. Mitigate with AQM (CoDel), smaller buffers, pacing/backpressure.\n",
    },
  },
  {
    slug: "sys-p99-vs-mean-why-freeform",
    topic: "Systems",
    track: "dev",
    title: "Why p99 Matters More Than the Mean",
    prompt_md:
      "In low-latency systems, why do we care about p99/p99.9 latency rather than just average latency?\n\nAnswer in 5–10 sentences and mention long tails.",
    solution_md:
      "Average latency can hide rare but severe stalls (page faults, GC pauses, lock contention, network jitter). Users and trading strategies are often impacted by the slowest fraction of operations, so tail metrics capture the real experience and risk.\n\nTail latency also reveals queueing effects: a small increase in load can cause a disproportionate increase in p99 due to contention and burstiness. Therefore you monitor histograms and percentiles, not just means.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["latency", "metrics", "performance"],
    source: "Performance engineering staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 110,
      rubric: [
        "States mean hides rare stalls and tail captures worst-case behavior: 55%",
        "Mentions concrete tail sources (faults, contention, jitter, GC) and long-tail risk: 25%",
        "Mentions queueing/loaded systems can blow up p99 disproportionately: 20%",
      ],
      reference_solution_md:
        "Means hide rare stalls; p99 shows long-tail events that dominate risk/experience. Tail grows disproportionately under contention/queueing, so track percentiles/histograms.\n",
    },
  },
  {
    slug: "sys-cpu-frequency-scaling-latency-freeform",
    topic: "Systems",
    track: "dev",
    title: "CPU Frequency Scaling and Latency",
    prompt_md:
      "How can CPU frequency scaling / power states (P-states, C-states) affect tail latency?\n\nAnswer in 5–10 sentences and mention wake-up/boost behavior.",
    solution_md:
      "Deep sleep states can increase wake-up latency: if a core is in a deep C-state, it can take longer to resume full execution, adding jitter. Frequency scaling can also cause variable instruction throughput depending on current frequency and boost behavior.\n\nLow-latency systems often pin critical threads and tune governors (performance mode), limit deep C-states, and isolate cores to reduce latency variation, trading power for predictability.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpu", "latency", "performance"],
    source: "Low-latency ops staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "Mentions deep power states increase wake-up latency/jitter: 45%",
        "Mentions frequency changes/boost can change throughput and timing: 25%",
        "Mentions tuning approach (governor/perf mode, limit C-states, pin/isolate cores) and tradeoff: 30%",
      ],
      reference_solution_md:
        "Deep C-states add wakeup latency; freq scaling/boost changes throughput. Low-latency tuning pins/isolate threads, uses performance governor, limits deep C-states, trading power for predictability.\n",
    },
  },
  {
    slug: "sys-hyperthreading-when-bad-freeform",
    topic: "Systems",
    track: "dev",
    title: "Hyper-Threading (SMT) — When Can It Hurt?",
    prompt_md:
      "What is SMT/Hyper-Threading, and when can it hurt latency-sensitive workloads?\n\nAnswer in 5–10 sentences and mention shared resources.",
    solution_md:
      "SMT exposes two logical threads on one physical core that share execution resources (caches, pipelines, ports). It can improve throughput by using otherwise idle resources, but it can increase jitter if a neighbor thread competes for the same resources, causing variable execution time.\n\nFor strict latency targets, teams may disable SMT, or ensure that only one logical thread per core runs critical work and the sibling is kept idle or used for non-critical tasks.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cpu", "latency", "performance"],
    source: "Low-latency engineering staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "Defines SMT as two logical threads sharing one physical core's resources: 45%",
        "Explains how contention on shared resources increases jitter/tail latency: 40%",
        "Mentions mitigation (disable SMT or isolate critical thread from sibling): 15%",
      ],
      reference_solution_md:
        "SMT shares core resources across two logical threads. It can add contention/jitter, hurting tail latency. Mitigate by disabling SMT or keeping sibling idle/non-critical.\n",
    },
  },
  {
    slug: "sys-jitter-sources-checklist-freeform",
    topic: "Systems",
    track: "dev",
    title: "Latency Jitter — Common Sources Checklist",
    prompt_md:
      "Name 6–10 common sources of latency jitter/tail spikes in a Linux low-latency service.\n\nAnswer as short bullet points with brief explanations (1 line each).",
    solution_md:
      "Examples: major page faults/swap, allocator slow paths/rehash, lock contention, scheduler preemption/context switches, CPU frequency/power states, NUMA remote memory, interrupt storms/IRQ migration, GC pauses (if managed runtime), IO stalls/fsync, network bufferbloat/jitter.\n\nMitigate by pinning/isolation, prefault+mlock, preallocation, sharding state, tuning CPU/IRQ, and measuring percentiles.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["latency", "linux", "checklist"],
    source: "Interview + ops staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 140,
      rubric: [
        "Lists at least 6 distinct realistic jitter sources (faults, contention, scheduling, power, NUMA, IRQs, IO, network): 70%",
        "Provides brief correct explanations (not just nouns): 20%",
        "Avoids incorrect sources (e.g., 'more threads always reduces jitter'): 10%",
      ],
      reference_solution_md:
        "Jitter sources: major faults/swap, allocator slow paths, lock contention, preemption/context switches, CPU power states, NUMA remote memory, IRQ storms/migration, IO stalls, network queueing/bufferbloat, GC (if applicable).\n",
    },
  },
  {
    slug: "sys-llc-misses-why-hurt-freeform",
    topic: "Systems",
    track: "dev",
    title: "LLC Misses — Why They Hurt Tail Latency",
    prompt_md:
      "Why can last-level cache (LLC) misses create large latency variance?\n\nAnswer in 4–8 sentences and mention memory hierarchy.",
    solution_md:
      "An LLC miss forces a fetch from DRAM, which is much slower than L1/L2/L3 access and has variable latency depending on contention, row buffer hits, and NUMA locality. Under load, memory controllers and interconnects can become congested, amplifying variance.\n\nAs a result, memory access time can vary widely, which shows up as tail latency in pointer-chasing workloads.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["cache", "performance", "latency"],
    source: "Systems performance staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 105,
      rubric: [
        "Explains LLC miss leads to DRAM access much slower than caches: 55%",
        "Mentions variance sources (contention, NUMA, memory controller) beyond just 'slower': 30%",
        "Connects to tail latency variance in pointer-chasing workloads: 15%",
      ],
      reference_solution_md:
        "LLC miss → DRAM access, far slower and more variable due to contention/NUMA/controller effects, causing tail latency variance especially in pointer-chasing workloads.\n",
    },
  },
  {
    slug: "sys-process-vs-thread-freeform",
    topic: "Systems",
    track: "dev",
    title: "Process vs Thread — What’s the Difference?",
    prompt_md:
      "Explain the difference between a process and a thread on a typical OS.\n\nAnswer in 6–10 sentences and mention address space, scheduling, and what is shared.",
    solution_md:
      "A process is an executing program instance with its own virtual address space and OS resources (e.g., file descriptor table, mappings). Threads are multiple execution contexts within a process that share the same address space and most resources, but have their own registers, stack, and scheduling identity.\n\nBoth are scheduled by the OS, but threads communicate cheaply via shared memory (with synchronization), while processes require IPC to communicate safely. Isolation is stronger across processes because they don’t share an address space by default.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["os", "processes", "threads"],
    source: "CSAPP staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "States processes have separate address spaces; threads share a process address space: 50%",
        "Mentions what differs for threads (own stack/registers) and what is shared (heap/mappings/fds): 35%",
        "Mentions isolation/communication tradeoff (IPC vs shared memory): 15%",
      ],
      reference_solution_md:
        "Process: own virtual address space + resources. Thread: execution context within a process; shares address space/resources but has its own stack/registers and is scheduled. Threads communicate via shared memory; processes via IPC; processes offer stronger isolation.\n",
    },
  },
  {
    slug: "sys-fork-exec-what-happens-freeform",
    topic: "Systems",
    track: "dev",
    title: "`fork` vs `exec` — What Happens?",
    prompt_md:
      "At a high level, what does `fork()` do, what does `exec()` do, and why are they often used together?\n\nAnswer in 6–10 sentences and mention copy-on-write.",
    solution_md:
      "`fork()` creates a new process (child) as a near-copy of the parent: it duplicates the process state (address space mappings, file descriptors) so the child continues from the same instruction, but `fork()` returns different values in parent/child. Modern OSes implement this efficiently via copy-on-write: parent and child initially share physical pages read-only, and pages are copied only when one writes.\n\n`exec()` replaces the current process image with a new program (new code/data/stack), keeping the same PID and typically preserving selected resources like open file descriptors. They’re used together to spawn a new program: fork to create a child, exec in the child to run a different binary.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["os", "processes", "virtual-memory"],
    source: "CSAPP staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 145,
      rubric: [
        "Explains fork creates a child process and how return values differ: 35%",
        "Mentions copy-on-write as the key optimization for memory sharing: 35%",
        "Explains exec replaces the process image and why fork+exec is used to spawn: 30%",
      ],
      reference_solution_md:
        "fork duplicates process state to create child (different return values); implemented with COW so pages are copied on write. exec replaces current process image with new program. fork+exec is standard spawn pattern.\n",
    },
  },
  {
    slug: "sys-copy-on-write-why-helps-freeform",
    topic: "Systems",
    track: "dev",
    title: "Copy-on-Write (COW) — Why It Helps",
    prompt_md:
      "What is copy-on-write (COW) in virtual memory, and why is it useful?\n\nAnswer in 5–10 sentences and give one concrete example (like fork).",
    solution_md:
      "Copy-on-write lets multiple virtual pages map to the same physical page as long as nobody writes. When a write occurs, the OS traps (page fault) and creates a private copy for the writing process, updating the page table.\n\nIt’s useful because it avoids copying large memory regions that might never be modified. Example: after `fork()`, parent and child initially share pages; if the child immediately `exec()`s, you avoided copying almost everything.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["virtual-memory", "os"],
    source: "CSAPP staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "Defines COW as shared physical pages until a write triggers a private copy via fault: 55%",
        "Explains why it saves work (avoid copying unchanged memory): 25%",
        "Gives a correct example (fork+exec) and mentions page tables/fault: 20%",
      ],
      reference_solution_md:
        "COW maps multiple virtual pages to one physical page read-only; on write, a fault triggers a private copy and page-table update. Saves copying; classic example is fork where child often execs.\n",
    },
  },
  {
    slug: "sys-page-table-walk-what-is-it-freeform",
    topic: "Systems",
    track: "dev",
    title: "Page Table Walk — What Is It?",
    prompt_md:
      "What is a page table walk, and why does it matter for performance?\n\nAnswer in 5–10 sentences and mention TLB misses and multi-level tables.",
    solution_md:
      "A page table walk is the process of translating a virtual address to a physical address by reading page table entries in memory (often multiple levels: e.g., 4-level tables). If the translation is in the TLB, the walk is avoided; on a TLB miss, the CPU must perform the walk, which can require several dependent memory accesses.\n\nThis is expensive and can stall loads, so workloads with many TLB misses suffer. Huge pages and better locality reduce walk frequency.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["virtual-memory", "tlb", "performance"],
    source: "CSAPP staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 130,
      rubric: [
        "Defines page-table walk as multi-level memory reads to translate VA→PA: 55%",
        "Connects to TLB misses as the trigger and why it stalls (dependent accesses): 35%",
        "Mentions mitigation levers (huge pages/locality) correctly: 10%",
      ],
      reference_solution_md:
        "TLB hit avoids translation cost; TLB miss triggers a multi-level page-table walk (several dependent memory accesses), which is expensive. Huge pages/locality reduce misses.\n",
    },
  },
  {
    slug: "sys-cache-associativity-conflict-misses-freeform",
    topic: "Systems",
    track: "dev",
    title: "Cache Associativity and Conflict Misses",
    prompt_md:
      "What is cache associativity, and what is a conflict miss?\n\nAnswer in 6–10 sentences and give one example pattern that causes conflict misses.",
    solution_md:
      "Associativity is how many cache lines can reside in a given cache set (direct-mapped = 1-way; N-way set associative = N). Addresses map to sets; if too many frequently used lines map to the same set, they evict each other even if the cache has free space elsewhere—this is a conflict miss.\n\nExample: striding through an array with a stride that repeatedly maps to the same set (power-of-two strides) can cause thrashing. Padding or changing layout can reduce conflicts.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cache", "computer-architecture", "performance"],
    source: "CSAPP staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 130,
      rubric: [
        "Defines associativity/sets and how addresses map to cache sets: 45%",
        "Defines conflict miss as eviction due to set contention (not capacity): 35%",
        "Gives a correct example (stride/thrashing) and one mitigation (padding/layout): 20%",
      ],
      reference_solution_md:
        "Cache is set-associative: each address maps to a set with N ways. Conflict misses happen when hot lines map to same set and evict each other. Example: power-of-two stride thrashing; mitigate via padding/layout changes.\n",
    },
  },
  {
    slug: "sys-writeback-vs-writethrough-freeform",
    topic: "Systems",
    track: "dev",
    title: "Write-Back vs Write-Through Caches",
    prompt_md:
      "What is the difference between a write-back and write-through cache policy?\n\nAnswer in 5–10 sentences and mention latency and bandwidth tradeoffs.",
    solution_md:
      "Write-through writes data to the next level immediately on every store, which simplifies coherence and durability reasoning but increases bandwidth and can add latency. Write-back keeps modified lines in cache and marks them dirty; the line is written to the next level only on eviction or flush.\n\nWrite-back reduces write traffic and can improve performance, but it makes write visibility and persistence more complex: you need explicit flushes/fences to ensure data reaches memory or stable storage when required.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cache", "computer-architecture"],
    source: "CSAPP staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 125,
      rubric: [
        "Defines write-through (propagate on every store) vs write-back (dirty line, write on eviction/flush): 60%",
        "Mentions bandwidth/latency tradeoff (traffic vs performance): 25%",
        "Mentions persistence/visibility complexity with write-back (flush/fence) appropriately: 15%",
      ],
      reference_solution_md:
        "Write-through writes to next level on every store; write-back keeps dirty lines and writes on eviction/flush. Write-back reduces traffic but complicates persistence/visibility; use flush/fence when needed.\n",
    },
  },
  {
    slug: "sys-branch-mispredict-cost-freeform",
    topic: "Systems",
    track: "dev",
    title: "Branch Misprediction — Why It’s Expensive",
    prompt_md:
      "Why is a branch misprediction expensive on modern CPUs?\n\nAnswer in 4–8 sentences and mention pipelines/speculation.",
    solution_md:
      "Modern CPUs speculate along predicted branches to keep pipelines full. If the prediction is wrong, the CPU must flush the speculated work and restart from the correct path, wasting many cycles. The cost depends on pipeline depth and frontend/backend effects, and shows up as latency variance in branchy code.\n\nReducing unpredictable branches or making hot paths more predictable can improve performance.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["computer-architecture", "performance"],
    source: "CSAPP staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 105,
      rubric: [
        "Mentions speculation/pipelines and that mispredict flushes work and restarts: 70%",
        "Mentions cost depends on pipeline depth and causes variance: 20%",
        "Mentions one mitigation idea (predictable hot path / fewer unpredictable branches): 10%",
      ],
      reference_solution_md:
        "CPU speculates down predicted branch. Mispredict flushes pipeline and restarts, wasting cycles; cost depends on pipeline depth and causes variance. Make hot paths predictable to mitigate.\n",
    },
  },
  {
    slug: "sys-syscall-why-slower-than-function-call-freeform",
    topic: "Systems",
    track: "dev",
    title: "Why Syscalls Are Slower Than Function Calls",
    prompt_md:
      "Why is a system call typically much slower than a regular function call?\n\nAnswer in 5–10 sentences and mention privilege transitions and kernel work.",
    solution_md:
      "A syscall crosses the user/kernel boundary: it requires a privilege-level transition, saving/restoring state, and often involves kernel scheduler and security checks. It can disrupt CPU pipeline and cache locality, and may block or contend on kernel structures.\n\nIn low-latency code, you try to reduce syscall frequency via batching, async logging, busy polling, or kernel bypass, but correctness and safety still matter.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["os", "performance", "linux"],
    source: "CSAPP staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "Mentions user→kernel transition/privilege change and state save/restore: 45%",
        "Mentions kernel work/checks/contended structures and pipeline/cache disruption: 35%",
        "Mentions mitigation idea (batching/reducing syscall frequency) without unsafe claims: 20%",
      ],
      reference_solution_md:
        "Syscalls are slower because they transition privilege levels, save/restore state, and run kernel checks/work, disrupting pipeline/cache and sometimes blocking/contending. Reduce frequency via batching/async, but keep correctness.\n",
    },
  },
  {
    slug: "sys-file-descriptor-what-is-it-freeform",
    topic: "Systems",
    track: "dev",
    title: "File Descriptors — What Are They?",
    prompt_md:
      "What is a file descriptor on Unix-like systems?\n\nAnswer in 5–10 sentences and mention the per-process table and that it refers to an underlying kernel object.",
    solution_md:
      "A file descriptor (fd) is a small integer handle used by a process to refer to an open file/socket/pipe. It indexes the process’s file descriptor table; entries typically point to a kernel \"open file\" object (file description) that holds state like current offset and flags.\n\nMultiple fds can refer to the same underlying open file object (e.g., via `dup` or after `fork`). The fd is per-process, while the underlying kernel object can be shared.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["os", "files", "unix"],
    source: "CSAPP staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "Defines fd as per-process integer handle/index into fd table: 45%",
        "Mentions it refers to an underlying kernel open-file object with state (offset/flags): 35%",
        "Mentions sharing via dup/fork (multiple fds can refer to same underlying object): 20%",
      ],
      reference_solution_md:
        "fd is a per-process integer index into the fd table, pointing to a kernel open-file object (file description) with state like offset/flags. dup/fork can create multiple fds sharing the same underlying object.\n",
    },
  },
  {
    slug: "sys-dup-vs-open-offset-sharing-freeform",
    topic: "Systems",
    track: "dev",
    title: "`dup` and File Offsets — What Gets Shared?",
    prompt_md:
      "If you `dup()` a file descriptor, what state is shared between the original fd and the duplicate?\n\nAnswer in 4–8 sentences and mention the file offset.",
    solution_md:
      "`dup` creates a new fd table entry pointing to the same underlying open file object. As a result, the two fds share file offset and status flags stored in that open file object; reading from one advances the offset seen by the other.\n\nThey do not share the integer fd value itself (those are different), but they refer to the same kernel object.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["os", "files", "unix"],
    source: "CSAPP staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 105,
      rubric: [
        "States dup makes two fds point to the same underlying open file object: 50%",
        "Mentions shared file offset (read/write advances offset for both): 40%",
        "Mentions flags/state sharing vs separate fd integers: 10%",
      ],
      reference_solution_md:
        "dup makes a second fd pointing to the same open file object; they share file offset and status flags. Reads/writes on one affect the offset seen by the other.\n",
    },
  },
  {
    slug: "sys-fork-fd-inheritance-freeform",
    topic: "Systems",
    track: "dev",
    title: "`fork()` and File Descriptors",
    prompt_md:
      "After `fork()`, what happens to the parent's open file descriptors in the child?\n\nAnswer in 5–10 sentences and mention sharing of underlying open-file objects and offsets.",
    solution_md:
      "The child inherits copies of the parent's file descriptors: it gets a new fd table with entries referring to the same underlying kernel open file objects. Therefore, file offsets are shared: reading/writing in one process affects the offset seen by the other when they refer to the same open file object.\n\nThis is why careful coordination is needed when parent/child both write to the same fd. You can close unused fds in child or use `O_CLOEXEC` to avoid leaking fds across an `exec`.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["os", "processes", "unix"],
    source: "CSAPP staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 130,
      rubric: [
        "States child inherits fds that refer to the same underlying open file objects: 50%",
        "Mentions shared offsets/status causing inter-process interaction on reads/writes: 35%",
        "Mentions mitigation/practice (close unused fds, CLOEXEC) appropriately: 15%",
      ],
      reference_solution_md:
        "After fork, child has fds referring to same kernel open file objects, so offsets are shared. Close unused fds or use CLOEXEC to prevent leaks across exec.\n",
    },
  },
  {
    slug: "sys-pipe-what-is-it-freeform",
    topic: "Systems",
    track: "dev",
    title: "Pipes — What Are They and When Used?",
    prompt_md:
      "What is a pipe in Unix and what is it used for?\n\nAnswer in 5–10 sentences and mention unidirectional byte stream and fork/exec pipelines.",
    solution_md:
      "A pipe is a kernel-managed unidirectional byte stream with a read end and a write end (two file descriptors). Writes to the write end can be read from the read end in FIFO order. Pipes are commonly used for IPC between related processes, especially parent/child after `fork()`, and for shell pipelines (connecting stdout of one program to stdin of another).\n\nThey provide backpressure: if the pipe buffer is full, writers can block.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["os", "ipc", "unix"],
    source: "CSAPP staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 120,
      rubric: [
        "Defines a pipe as a unidirectional FIFO byte stream with read/write ends: 55%",
        "Mentions common use (IPC between forked processes, shell pipelines): 30%",
        "Mentions blocking/backpressure or bounded buffer behavior: 15%",
      ],
      reference_solution_md:
        "Pipe: kernel FIFO byte stream with read and write fds. Used for IPC and shell pipelines (stdout→stdin). Bounded buffer provides backpressure (writers can block).\n",
    },
  },
  {
    slug: "sys-signal-what-is-it-freeform",
    topic: "Systems",
    track: "dev",
    title: "Signals — What Are They?",
    prompt_md:
      "What is a Unix signal, and what are the usual ways a process can handle a signal?\n\nAnswer in 6–10 sentences and mention default action vs handler vs ignore.",
    solution_md:
      "A signal is an asynchronous notification delivered to a process (or thread) to notify it of an event (e.g., SIGINT, SIGSEGV, SIGTERM). Each signal has a default action (terminate, stop, ignore, core dump). A process can install a handler to run on delivery, or choose to ignore some signals.\n\nSignal handlers run asynchronously with respect to the main code, so they must be careful and typically can only call async-signal-safe functions.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["os", "signals", "unix"],
    source: "CSAPP staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 135,
      rubric: [
        "Defines signal as asynchronous notification (to process/thread) with examples: 40%",
        "Mentions default actions and that process can handle via handler or ignore: 40%",
        "Mentions handler safety constraint (async-signal-safe) or asynchronous nature: 20%",
      ],
      reference_solution_md:
        "Signals are async notifications (SIGINT/SIGTERM/etc) with default actions; process can install handler or ignore some. Handlers are async; use only async-signal-safe operations.\n",
    },
  },
  {
    slug: "sys-signal-handler-why-unsafe-freeform",
    topic: "Systems",
    track: "dev",
    title: "Why Many Functions Are Unsafe in Signal Handlers",
    prompt_md:
      "Why are many standard library functions (like `malloc`, `printf`) unsafe to call inside a Unix signal handler?\n\nAnswer in 5–10 sentences and mention reentrancy.",
    solution_md:
      "Signal handlers can interrupt code at almost any point, including while the interrupted code is inside a non-reentrant function holding internal locks or manipulating global state. If the handler calls the same function (or another function that uses the same internal state), it can deadlock or corrupt state.\n\nFor example, `malloc` and `printf` often use locks and global buffers. Therefore handlers should stick to async-signal-safe functions and set flags or write to a pipe/eventfd to notify the main loop.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["os", "signals", "concurrency"],
    source: "CSAPP staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 130,
      rubric: [
        "Explains non-reentrancy and that handler can interrupt code inside locked/global-state functions: 55%",
        "Gives at least one concrete example (`malloc`, `printf`) and why it can deadlock/corrupt: 25%",
        "Mentions safe pattern (set atomic flag; write to pipe/eventfd) or async-signal-safe restriction: 20%",
      ],
      reference_solution_md:
        "Handlers can interrupt code while it's inside non-reentrant functions holding locks/global state. Calling malloc/printf can deadlock or corrupt state. Use async-signal-safe ops; set flags or write to a pipe/eventfd.\n",
    },
  },
  {
    slug: "sys-mmap-page-cache-freeform",
    topic: "Systems",
    track: "dev",
    title: "`mmap` and the Page Cache",
    prompt_md:
      "How does `mmap` interact with the OS page cache?\n\nAnswer in 5–10 sentences and mention that reads via mapping are still backed by the page cache.",
    solution_md:
      "`mmap` maps file-backed pages into a process's address space. When you access a mapped page, the OS serves it from the page cache; on first access it may fault in and load the page into memory. Subsequent accesses are memory loads hitting cache/page cache.\n\nThis means `mmap` isn't \"bypassing\" caching; it's using the same page cache as `read`. The difference is the access pattern: faults/VM mapping are the interface, and the OS handles eviction like any cached file page.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["virtual-memory", "linux", "io"],
    source: "CSAPP / OS VM",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 125,
      rubric: [
        "States mmap maps file pages and accesses go through the page cache: 55%",
        "Mentions first-touch faults page in; later accesses are loads: 25%",
        "Clarifies mmap uses same caching as read (not bypass) and mentions eviction: 20%",
      ],
      reference_solution_md:
        "mmap maps file-backed pages; faults bring pages into page cache; reads via mapping are backed by the page cache like read. mmap isn't bypassing cache; it changes the interface to VM faults/loads.\n",
    },
  },
  {
    slug: "sys-demand-paging-what-is-it-freeform",
    topic: "Systems",
    track: "dev",
    title: "Demand Paging",
    prompt_md:
      "What is demand paging in virtual memory?\n\nAnswer in 4–8 sentences and mention why processes can have large VSZ without large RSS.",
    solution_md:
      "Demand paging means pages are not loaded into physical memory until they are actually accessed. A process can map large regions (e.g., mmapped files, heap reservations) without immediately consuming RAM; those pages become resident only on first touch (page fault).\n\nThat’s why VSZ can be large while RSS remains smaller: VSZ counts mapped virtual address space, while RSS counts pages currently resident in RAM.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["virtual-memory", "os"],
    source: "CSAPP staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 115,
      rubric: [
        "Defines demand paging as loading pages on first access via fault: 55%",
        "Explains VSZ can be large without RSS because mapping != residency: 35%",
        "Mentions mmap/heap reservation as an example: 10%",
      ],
      reference_solution_md:
        "Demand paging loads pages into RAM only when accessed (fault). Thus VSZ can be large (mapped) while RSS stays smaller (resident pages only).\n",
    },
  },
  {
    slug: "sys-read-vs-write-page-cache-freeform",
    topic: "Systems",
    track: "dev",
    title: "Buffered IO: `write()` Doesn’t Mean It Hit Disk",
    prompt_md:
      "On a typical OS with a page cache, why does a successful `write()` not necessarily mean the data is on disk?\n\nAnswer in 5–10 sentences and mention the page cache and fsync.",
    solution_md:
      "With buffered IO, `write()` usually copies data into the kernel page cache and returns once it is in memory, not once it is persisted. The kernel later flushes dirty pages to disk asynchronously.\n\nTo ensure data is durably on disk, you typically need `fsync()`/`fdatasync()` (and possibly syncing directory metadata). This matters for correctness (crash consistency) and for latency because forcing durability can be very slow.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["os", "io", "persistence"],
    source: "CSAPP / OS IO staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 125,
      rubric: [
        "States write() often copies into page cache and returns before disk persistence: 55%",
        "Mentions asynchronous flush of dirty pages and that crash can lose data: 25%",
        "Mentions fsync/fdatasync for durability and tail-latency cost: 20%",
      ],
      reference_solution_md:
        "Buffered write() typically writes to page cache and returns; kernel flushes later. For durability, use fsync/fdatasync (and dir sync). Forcing durability is slow and affects tail latency.\n",
    },
  },
  {
    slug: "sys-fsync-what-it-does-freeform",
    topic: "Systems",
    track: "dev",
    title: "`fsync()` — What Does It Guarantee?",
    prompt_md:
      "What does `fsync()` (or `fdatasync()`) guarantee, and what is a common misconception about it?\n\nAnswer in 6–10 sentences and mention metadata vs data.",
    solution_md:
      "`fsync(fd)` forces dirty data and metadata for that file to be flushed to stable storage (as defined by the OS and storage stack), so that after it returns the file contents and metadata updates are durable across a crash (assuming the storage honors the contract). `fdatasync` focuses on file data and minimal metadata.\n\nA common misconception is that `write()` is durable without fsync, or that fsync is cheap. Another is forgetting to fsync the directory after creating/renaming a file, which can lose the directory entry on crash.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["os", "io", "persistence"],
    source: "Systems correctness staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 140,
      rubric: [
        "States fsync flushes file data and metadata (fdatasync flushes data + minimal metadata): 55%",
        "Mentions common misconception (write is durable; fsync cheap; ignoring dir fsync): 30%",
        "Mentions crash-consistency framing and storage-stack caveat appropriately: 15%",
      ],
      reference_solution_md:
        "fsync flushes file data+metadata to stable storage; fdatasync focuses on data. Misconceptions: write() is durable; fsync is cheap; forgetting to fsync directory for create/rename.\n",
    },
  },
  {
    slug: "sys-o_direct-what-is-it-freeform",
    topic: "Systems",
    track: "dev",
    title: "`O_DIRECT` — Why It’s Tricky",
    prompt_md:
      "What is `O_DIRECT` and why is it tricky to use correctly?\n\nAnswer in 6–10 sentences and mention alignment and page cache bypass.",
    solution_md:
      "`O_DIRECT` requests direct IO that bypasses the page cache for reads/writes. It’s tricky because it typically requires strict alignment (buffer alignment, IO size alignment) and has filesystem/device-specific constraints. Bypassing the page cache can reduce double buffering and cache pollution for some workloads, but it can also hurt performance if you lose readahead/caching benefits.\n\nIt also complicates latency: IO completion is tied more directly to storage behavior. Many systems prefer buffered IO with careful flushing unless they truly need direct control.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["linux", "io", "performance"],
    source: "Linux IO deep dive",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 140,
      rubric: [
        "Defines O_DIRECT as bypassing the page cache for IO: 45%",
        "Mentions alignment/size constraints and portability pitfalls: 35%",
        "Mentions tradeoffs (avoid double buffering vs lose cache/readahead; latency implications): 20%",
      ],
      reference_solution_md:
        "O_DIRECT bypasses page cache; tricky due to alignment/size constraints and FS/device quirks. Can avoid double buffering but loses caching/readahead; can expose storage latency directly.\n",
    },
  },
  {
    slug: "sys-read-vs-pread-offset-freeform",
    topic: "Systems",
    track: "dev",
    title: "`read()` vs `pread()`",
    prompt_md:
      "What is the difference between `read()` and `pread()`?\n\nAnswer in 4–8 sentences and mention shared file offsets and thread safety.",
    solution_md:
      "`read()` reads from the file’s current offset in the underlying open file object and advances that offset. If multiple threads/processes share the same open file object (dup/fork), they share and race on that offset.\n\n`pread()` reads from an explicit offset and does not change the file offset, making it easier to use safely in concurrent code and for random access.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["os", "io", "unix"],
    source: "CSAPP staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 115,
      rubric: [
        "States read uses and advances the shared file offset: 55%",
        "States pread uses explicit offset and does not change file offset: 35%",
        "Mentions concurrency/thread-safety implication (shared offset races): 10%",
      ],
      reference_solution_md:
        "read() uses/advances current file offset (shared across dup/fork). pread() reads at explicit offset without changing file offset, aiding concurrency and random access.\n",
    },
  },
  {
    slug: "sys-select-vs-epoll-readiness-freeform",
    topic: "Systems",
    track: "dev",
    title: "Readiness vs Completion (and Why `read()` Can Still Block)",
    prompt_md:
      "In event-driven IO, what's the difference between readiness (select/epoll) and completion, and why can `read()` still block even after readiness is signaled?\n\nAnswer in 6–10 sentences and mention edge/level triggering at a high level.",
    solution_md:
      "Readiness means an fd is likely to make progress without blocking (e.g., some bytes available), not that your requested amount is available. If you call `read()` requesting more than available and the fd is blocking, it can still block waiting for more data. Even in nonblocking mode, you may get a short read.\n\nWith level-triggered readiness, you keep getting notified while the condition holds; with edge-triggered, you must drain the fd until EAGAIN to avoid missing future notifications. Completion-based APIs instead notify when a specific IO request finishes.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["linux", "io", "epoll"],
    source: "Event-driven IO staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 145,
      rubric: [
        "Explains readiness is 'can make progress' not 'request complete': 45%",
        "Explains why read can block/short-read (amount requested vs available; blocking vs nonblocking): 35%",
        "Mentions edge vs level trigger and draining to EAGAIN as a key practical detail: 20%",
      ],
      reference_solution_md:
        "Readiness ≠ completion. After readiness, read may short-read or block if requesting more than available on blocking fd. Edge-triggered requires draining to EAGAIN; level-triggered repeats while condition holds.\n",
    },
  },
  {
    slug: "sys-accept-backlog-what-means-freeform",
    topic: "Systems",
    track: "dev",
    title: "`listen(backlog)` — What Does Backlog Mean?",
    prompt_md:
      "In TCP servers, what does the `backlog` argument to `listen()` represent?\n\nAnswer in 5–10 sentences and mention connection queues and overload behavior.",
    solution_md:
      "`backlog` controls how many pending connections the kernel will queue before `accept()` picks them up. In practice there are often two queues (SYN/half-open and accept/fully established) and OS-specific tuning limits. If the queues fill, new connection attempts may be dropped, refused, or experience retransmission delays.\n\nFor latency and reliability, you tune backlog and ensure the accept loop keeps up, often using multiple acceptor threads or `SO_REUSEPORT` to scale across cores.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["networking", "tcp", "linux"],
    source: "Networking server staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 135,
      rubric: [
        "States backlog relates to queued pending connections before accept: 55%",
        "Mentions queueing/overload behavior when full (drops/refusals/retries) and OS nuance: 25%",
        "Mentions scaling/tuning idea (keep accept loop up; reuseport; multiple acceptors): 20%",
      ],
      reference_solution_md:
        "backlog limits queued pending connections before accept. When queues fill, new connects can drop/refuse/retry. Tune backlog and accept throughput (reuseport/multi acceptors) to handle load.\n",
    },
  },
  {
    slug: "sys-so-reuseport-why-freeform",
    topic: "Systems",
    track: "dev",
    title: "`SO_REUSEPORT` — Why Use It?",
    prompt_md:
      "What is `SO_REUSEPORT` on Linux, and why might it improve performance for multi-core servers?\n\nAnswer in 5–10 sentences and mention accept contention.",
    solution_md:
      "`SO_REUSEPORT` allows multiple sockets to bind to the same (ip,port), letting the kernel distribute incoming connections/packets across them. This can reduce lock contention on a single accept queue and allow each worker thread to have its own socket, improving cache locality and scaling.\n\nIt’s useful for high-connection-rate servers where a single acceptor becomes a bottleneck.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["networking", "linux", "performance"],
    source: "Linux server scaling staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 125,
      rubric: [
        "Defines reuseport as multiple sockets bound to same port with kernel distribution: 55%",
        "Mentions reducing accept/queue contention and scaling across cores: 35%",
        "Mentions a practical use-case (high connection rate; per-thread socket) or caveat: 10%",
      ],
      reference_solution_md:
        "SO_REUSEPORT lets multiple sockets bind same port; kernel distributes connections, reducing accept contention and improving multi-core scaling with per-thread sockets.\n",
    },
  },
  {
    slug: "sys-page-replacement-why-locality-matters-freeform",
    topic: "Systems",
    track: "dev",
    title: "Page Replacement — Why Locality Matters",
    prompt_md:
      "Why does locality (temporal/spatial) matter for paging performance?\n\nAnswer in 5–10 sentences and connect to working set and page faults.",
    solution_md:
      "Paging works well when programs exhibit locality: they reuse the same pages over short periods and access nearby addresses. If the working set (the set of pages actively used) fits in physical memory, page faults are rare. If access patterns have poor locality and working set exceeds memory, the system thrashes: pages are constantly evicted and faulted back in, causing huge slowdowns.\n\nThis is why algorithms/data layouts that improve locality can dramatically reduce faults and tail latency.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["virtual-memory", "performance", "os"],
    source: "CSAPP staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 125,
      rubric: [
        "Defines locality/working set idea and why fitting working set reduces faults: 55%",
        "Mentions thrashing when working set exceeds memory and locality is poor: 35%",
        "Connects to performance/tail latency and data layout implications: 10%",
      ],
      reference_solution_md:
        "Locality keeps working set small; if it fits in RAM, few faults. Poor locality with working set > RAM → thrashing (constant faults). Locality-aware layouts reduce faults and tail latency.\n",
    },
  },
  {
    slug: "sys-write-allocate-what-is-it-freeform",
    topic: "Systems",
    track: "dev",
    title: "Write-Allocate — What Is It?",
    prompt_md:
      "In cache design, what is write-allocate (a.k.a. fetch-on-write), and why might it exist?\n\nAnswer in 4–8 sentences.",
    solution_md:
      "Write-allocate means that on a write miss, the cache first loads the cache line into the cache (allocates a line) and then performs the write. This can be beneficial when programs tend to write to the same line multiple times (temporal locality), because subsequent writes hit in cache.\n\nIt pairs naturally with write-back caches. The downside is extra read-for-ownership traffic on write misses.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["cache", "computer-architecture"],
    source: "CSAPP staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 115,
      rubric: [
        "Defines write-allocate as bringing the line into cache on write miss: 55%",
        "Explains why (temporal locality; subsequent writes hit; pairs with write-back): 30%",
        "Mentions tradeoff (extra traffic/read-for-ownership) correctly: 15%",
      ],
      reference_solution_md:
        "Write-allocate loads/allocates a cache line on write miss then writes, helping when you write repeatedly to the line (locality). Tradeoff is extra traffic (RFO) on miss.\n",
    },
  },
  {
    slug: "sys-context-switch-vs-syscall-freeform",
    topic: "Systems",
    track: "dev",
    title: "Syscall vs Context Switch (Cost Intuition)",
    prompt_md:
      "What's the difference between a syscall and a context switch, and why can a context switch be more expensive?\n\nAnswer in 5–10 sentences.",
    solution_md:
      "A syscall is a transition from user mode to kernel mode within the same thread to request a service; it may return without switching to another runnable thread. A context switch switches CPU execution from one thread/process to another, which involves scheduler decisions and saving/restoring a larger set of state.\n\nContext switches can be more expensive because they often blow away cache/TLB locality and may move execution to a different core/NUMA domain, increasing variance.",
    answer_kind: "freeform",
    difficulty: 4,
    tags: ["os", "scheduling", "performance"],
    source: "CSAPP staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 125,
      rubric: [
        "Distinguishes syscall as user→kernel service vs context switch as switching threads/processes: 45%",
        "Mentions scheduler involvement and state save/restore for context switch: 25%",
        "Mentions cache/TLB/NUMA locality loss as key reason for cost/variance: 30%",
      ],
      reference_solution_md:
        "Syscall enters kernel for service and may return to same thread. Context switch switches to another runnable thread with scheduler involvement and hurts cache/TLB locality (and possibly NUMA), often more expensive.\n",
    },
  },
  {
    slug: "sys-endianness-what-is-it-freeform",
    topic: "Systems",
    track: "dev",
    title: "Endianness — What Is It and Why It Matters",
    prompt_md:
      "What is endianness, and why does it matter for networking and binary file formats?\n\nAnswer in 5–10 sentences.",
    solution_md:
      "Endianness is the byte order used to represent multi-byte integers in memory: little-endian stores the least significant byte first; big-endian stores the most significant byte first. It matters when interpreting raw bytes across machines or protocols.\n\nNetworking often uses network byte order (big-endian), so code must convert (htonl/ntohl) when sending/receiving integers. Binary file formats likewise specify an endianness; reading on a machine with different endianness requires swapping.",
    answer_kind: "freeform",
    difficulty: 2,
    tags: ["computer-architecture", "networking"],
    source: "CSAPP staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 115,
      rubric: [
        "Defines endianness as byte order for multi-byte integers (little vs big): 55%",
        "Explains why it matters for interpreting raw bytes across systems/protocols: 25%",
        "Mentions networking 'network byte order' and conversion as a concrete example: 20%",
      ],
      reference_solution_md:
        "Endianness = byte order (little vs big). Matters for binary interchange; network byte order is big-endian, so convert on send/recv (htonl/ntohl). File formats also specify endianness.\n",
    },
  },
  {
    slug: "sys-virtual-address-space-why-large-freeform",
    topic: "Systems",
    track: "dev",
    title: "Why 64-bit Virtual Address Space Helps",
    prompt_md:
      "Why is a large virtual address space (e.g., 64-bit) useful even if your machine has much less physical RAM?\n\nAnswer in 5–10 sentences and mention mappings/isolation.",
    solution_md:
      "A large virtual address space allows each process to have its own spacious, sparsely populated address space with room for mappings (heap, stacks, shared libraries, mmapped files) without collisions. It improves isolation because different processes can use the same virtual addresses without conflict.\n\nIt also enables tricks like guard pages for stacks/heaps and memory-mapped IO/files. Physical RAM is managed separately; virtual memory lets you map more than you physically have, with demand paging and file-backed mappings.",
    answer_kind: "freeform",
    difficulty: 3,
    tags: ["virtual-memory", "os"],
    source: "CSAPP staple",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 125,
      rubric: [
        "Explains large VA space enables flexible sparse mappings (heap/stack/libs/mmap) without collisions: 45%",
        "Mentions process isolation (same VA across processes) and guard pages as benefits: 35%",
        "Mentions VA ≠ physical RAM; demand paging/file-backed mappings: 20%",
      ],
      reference_solution_md:
        "Large virtual address space allows sparse mappings (heap/stack/libs/mmap) and guard pages, and isolates processes (each has its own VA space). It's separate from physical RAM; demand paging/file-backed mappings make it useful even with limited RAM.\n",
    },
  },
  {
    slug: "sys-atomicity-of-aligned-word-writes-freeform",
    topic: "Systems",
    track: "dev",
    title: "Atomicity of Aligned Word Writes (Caveats)",
    prompt_md:
      "On many CPUs, aligned word-sized loads/stores are atomic at the hardware level. Why is it still a mistake to treat that as \"thread-safe\" in C/C++?\n\nAnswer in 6–10 sentences and mention the language memory model and data races.",
    solution_md:
      "Even if the hardware performs an aligned 64-bit store atomically, the C/C++ memory model says a data race on a non-atomic object is undefined behavior. The compiler is allowed to assume data races don't happen and can reorder or cache values in registers, breaking your intended synchronization.\n\nThread safety requires both atomicity and ordering/visibility guarantees; you need `std::atomic` (with appropriate memory order) or locks to establish happens-before. Hardware atomicity alone doesn't give you the required language-level semantics or portability.",
    answer_kind: "freeform",
    difficulty: 5,
    tags: ["memory-model", "concurrency", "computer-architecture"],
    source: "CSAPP + C++ memory model bridge",
    target_roles: ["Dev"],
    answer_meta: {
      min_words: 145,
      rubric: [
        "States C/C++ data races on non-atomics are UB regardless of hardware atomicity: 55%",
        "Mentions compiler reordering/register caching and need for language memory model: 25%",
        "Mentions correct fix (std::atomic/locks; happens-before) and portability: 20%",
      ],
      reference_solution_md:
        "Hardware atomic loads/stores don't make non-atomic sharing safe: C/C++ data races are UB and compiler may reorder/cache. Use std::atomic/locks to establish happens-before and ordering/visibility.\n",
    },
  },
];

