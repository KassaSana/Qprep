import type { SeedQuestion } from "@/content/question-types";

/**
 * Algorithms — sandboxed coding problems run via Piston (the public
 * `emkc.org/api/v2/piston` runner by default). Each question's
 * `answer_meta.test_cases` is the contract: the user's program reads stdin
 * and writes stdout, and the runner compares with whitespace-collapsed
 * equality.
 */
export const ALGORITHMS_SEED: SeedQuestion[] = [
  {
    slug: "two-sum",
    topic: "Algorithms",
    track: "dev",
    title: "Two Sum",
    prompt_md:
      "Read a target integer $T$ on the first line and a space-separated array of integers $a$ on the second line.\n\nPrint two zero-based indices $i < j$ such that $a_i + a_j = T$, separated by a single space. The input is guaranteed to have exactly one valid pair.\n\nExample:\n\nInput:\n```\n9\n2 7 11 15\n```\nOutput:\n```\n0 1\n```",
    solution_md:
      "Walk the array once, storing each value's index in a hash map. For element $a_j$, look up $T - a_j$. If you have seen it, that's your pair. $O(n)$ time, $O(n)$ space.",
    answer_kind: "code",
    difficulty: 1,
    tags: ["arrays", "hashmap", "leetcode-easy"],
    companies: ["Citadel", "Two Sigma"],
    source: "LeetCode classic",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\n\ndef solve():\n    target = int(input().strip())\n    nums = list(map(int, input().split()))\n    seen = {}\n    for j, x in enumerate(nums):\n        need = target - x\n        if need in seen:\n            print(seen[need], j)\n            return\n        seen[x] = j\n\nsolve()\n",
      test_cases: [
        { input: "9\n2 7 11 15", expected: "0 1" },
        { input: "6\n3 2 4", expected: "1 2" },
        { input: "6\n3 3", expected: "0 1" },
        { input: "0\n-3 4 3 90", expected: "0 2", hidden: true },
      ],
      time_limit_ms: 2000,
      memory_limit_mb: 64,
    },
  },
  {
    slug: "valid-parens",
    topic: "Algorithms",
    track: "dev",
    title: "Valid Parentheses",
    prompt_md:
      "Read a single line containing only the characters `(`, `)`, `{`, `}`, `[`, `]`. Print `true` if every opening bracket is matched by the same kind of closing bracket in the correct order, and `false` otherwise. An empty line is considered valid.\n\nExample:\n\nInput:\n```\n([{}])\n```\nOutput:\n```\ntrue\n```",
    solution_md:
      "Push openers onto a stack. On a closer, pop the top and check it pairs. If the stack mismatches at any point, return `false`. The string is valid iff the stack is empty at the end.",
    answer_kind: "code",
    difficulty: 1,
    tags: ["stack", "strings", "leetcode-easy"],
    companies: ["Jane Street"],
    source: "LeetCode classic",
    answer_meta: {
      language: "python",
      starter_code:
        "def solve():\n    s = input()\n    pairs = {')': '(', ']': '[', '}': '{'}\n    stack = []\n    for ch in s:\n        if ch in '([{':\n            stack.append(ch)\n        elif ch in pairs:\n            if not stack or stack.pop() != pairs[ch]:\n                print('false')\n                return\n    print('true' if not stack else 'false')\n\nsolve()\n",
      test_cases: [
        { input: "()", expected: "true" },
        { input: "([{}])", expected: "true" },
        { input: "(]", expected: "false" },
        { input: "([)]", expected: "false", hidden: true },
        { input: "{[()]}", expected: "true", hidden: true },
      ],
      time_limit_ms: 2000,
      memory_limit_mb: 64,
    },
  },
  {
    slug: "lru-cache-ops",
    topic: "Algorithms",
    track: "dev",
    title: "LRU Cache — Replay Operations",
    prompt_md:
      "Implement a fixed-capacity LRU cache and replay a sequence of operations.\n\nInput: the first line is an integer $C$ — the cache capacity. Each subsequent line is one of:\n\n- `put k v` — insert/update key `k` with value `v`\n- `get k` — print the integer value for key `k`, or `-1` if it is not in the cache\n\nFor every `get` operation, print the result on its own line. Both `get` and `put` count as a use that updates recency.\n\nExample:\n\nInput:\n```\n2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\n```\nOutput:\n```\n1\n-1\n```",
    solution_md:
      "An ordered dictionary (e.g. Python's `OrderedDict`) gives $O(1)$ amortized `get`/`put`. On `get`, move the key to the end. On `put` over capacity, pop the front (least recently used).",
    answer_kind: "code",
    difficulty: 3,
    tags: ["hashmap", "linked-list", "design"],
    companies: ["Citadel", "Two Sigma", "Jane Street"],
    source: "LeetCode classic",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\nfrom collections import OrderedDict\n\ndef main():\n    data = sys.stdin.read().splitlines()\n    if not data:\n        return\n    cap = int(data[0])\n    cache = OrderedDict()\n    out = []\n    for line in data[1:]:\n        parts = line.split()\n        if not parts:\n            continue\n        op = parts[0]\n        if op == 'put':\n            k, v = int(parts[1]), int(parts[2])\n            if k in cache:\n                cache.move_to_end(k)\n            cache[k] = v\n            if len(cache) > cap:\n                cache.popitem(last=False)\n        elif op == 'get':\n            k = int(parts[1])\n            if k in cache:\n                cache.move_to_end(k)\n                out.append(str(cache[k]))\n            else:\n                out.append('-1')\n    sys.stdout.write('\\n'.join(out))\n\nmain()\n",
      test_cases: [
        {
          input: "2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2",
          expected: "1\n-1",
        },
        {
          input: "1\nput 1 1\nput 2 2\nget 1\nget 2",
          expected: "-1\n2",
        },
        {
          input: "2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4",
          expected: "1\n-1\n-1\n3\n4",
          hidden: true,
        },
      ],
      time_limit_ms: 3000,
      memory_limit_mb: 128,
    },
  },
  {
    slug: "sliding-window-maximum",
    topic: "Algorithms",
    track: "dev",
    title: "Sliding Window Maximum",
    prompt_md:
      "Read an integer $k$ on the first line and a space-separated array of integers $a$ on the second line.\n\nFor each contiguous window of length $k$, print the maximum in that window. Output the maxima as space-separated integers on one line.\n\nExample:\n\nInput:\n```\n3\n1 3 -1 -3 5 3 6 7\n```\nOutput:\n```\n3 3 5 5 6 7\n```",
    solution_md:
      "Use a monotonic deque of indices. Maintain the deque in decreasing order of values: pop from the back while the new value is larger; pop from the front if it's outside the window. The front is always the max. Overall $O(n)$ time.",
    answer_kind: "code",
    difficulty: 3,
    tags: ["deque", "sliding-window", "monotonic-queue"],
    companies: ["Citadel", "Two Sigma", "Jump Trading"],
    source: "Coding screen staple",
    answer_meta: {
      language: "python",
      starter_code:
        "from collections import deque\n\ndef solve():\n    k = int(input().strip())\n    a = list(map(int, input().split()))\n    dq = deque()  # indices, values decreasing\n    out = []\n    for i, x in enumerate(a):\n        while dq and a[dq[-1]] <= x:\n            dq.pop()\n        dq.append(i)\n        if dq[0] <= i - k:\n            dq.popleft()\n        if i >= k - 1:\n            out.append(str(a[dq[0]]))\n    print(' '.join(out))\n\nsolve()\n",
      test_cases: [
        { input: "3\n1 3 -1 -3 5 3 6 7", expected: "3 3 5 5 6 7" },
        { input: "1\n5 4 3", expected: "5 4 3" },
        { input: "2\n9 8 7 6", expected: "9 8 7" },
        { input: "4\n2 2 2 2 2", expected: "2 2", hidden: true },
      ],
      time_limit_ms: 2500,
      memory_limit_mb: 128,
    },
  },
  {
    slug: "subarray-sum-equals-k",
    topic: "Algorithms",
    track: "dev",
    title: "Count Subarrays With Sum = K",
    prompt_md:
      "Read an integer $K$ on the first line and a space-separated array of integers $a$ on the second line.\n\nPrint the number of contiguous subarrays whose elements sum to exactly $K$.\n\nExample:\n\nInput:\n```\n2\n1 1 1\n```\nOutput:\n```\n2\n```",
    solution_md:
      "Use prefix sums. The sum of subarray (i..j] is `pref[j] - pref[i]`. For each prefix `p`, the number of earlier prefixes equal to `p - K` contributes to the count. Keep a hash map from prefix sum to frequency. $O(n)$ time.",
    answer_kind: "code",
    difficulty: 3,
    tags: ["prefix-sums", "hashmap"],
    companies: ["Jane Street", "Citadel"],
    source: "Coding screen staple",
    answer_meta: {
      language: "python",
      starter_code:
        "from collections import defaultdict\n\ndef solve():\n    K = int(input().strip())\n    a = list(map(int, input().split()))\n    freq = defaultdict(int)\n    freq[0] = 1\n    pref = 0\n    ans = 0\n    for x in a:\n        pref += x\n        ans += freq[pref - K]\n        freq[pref] += 1\n    print(ans)\n\nsolve()\n",
      test_cases: [
        { input: "2\n1 1 1", expected: "2" },
        { input: "3\n1 2 3", expected: "2", hidden: true },
        { input: "0\n1 -1 0", expected: "3" },
        { input: "-1\n-1 -1 1", expected: "3", hidden: true },
      ],
      time_limit_ms: 2500,
      memory_limit_mb: 128,
    },
  },
  {
    slug: "rolling-vwap",
    topic: "Algorithms",
    track: "dev",
    title: "Rolling VWAP (Window K)",
    prompt_md:
      "Volume-weighted average price (VWAP) over a window is:\n\n\\[\\text{VWAP} = \\frac{\\sum_i p_i v_i}{\\sum_i v_i}\\]\n\nRead an integer $K$ on the first line. Then read $n$ lines each containing `price volume` (both integers).\n\nFor each window of size $K$ ending at position $i$ (1-indexed), output the VWAP as a reduced fraction `A/B`.\n\nExample:\n\nInput:\n```\n2\n100 5\n101 5\n102 10\n```\nOutput:\n```\n201/2\n205/2\n```",
    solution_md:
      "Maintain two rolling sums: `sumPV = Σ(p·v)` and `sumV = Σ(v)`. Slide the window by adding the new row and removing the row that falls off. Reduce the fraction by gcd each step. $O(n)$ time.",
    answer_kind: "code",
    difficulty: 4,
    tags: ["sliding-window", "gcd", "applications"],
    companies: ["Optiver", "IMC"],
    source: "Execution analytics primitive",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\nimport math\n\ndef solve():\n    lines = [ln.strip() for ln in sys.stdin.read().splitlines() if ln.strip()]\n    if not lines:\n        return\n    K = int(lines[0])\n    rows = [tuple(map(int, ln.split())) for ln in lines[1:]]\n    sumPV = 0\n    sumV = 0\n    out = []\n    for i, (p, v) in enumerate(rows):\n        sumPV += p * v\n        sumV += v\n        if i >= K:\n            p0, v0 = rows[i - K]\n            sumPV -= p0 * v0\n            sumV -= v0\n        if i >= K - 1:\n            g = math.gcd(sumPV, sumV)\n            out.append(f\"{sumPV//g}/{sumV//g}\")\n    sys.stdout.write(\"\\n\".join(out))\n\nsolve()\n",
      test_cases: [
        { input: "2\n100 5\n101 5\n102 10", expected: "201/2\n205/2" },
        { input: "3\n10 1\n10 1\n10 1\n10 1", expected: "10/1\n10/1" },
        { input: "1\n7 3\n8 1", expected: "7/1\n8/1", hidden: true },
      ],
      time_limit_ms: 2500,
      memory_limit_mb: 128,
    },
  },
  {
    slug: "streaming-median",
    topic: "Algorithms",
    track: "dev",
    title: "Streaming Median",
    prompt_md:
      "You receive a stream of integers. After each new integer arrives, output the median of all numbers seen so far.\n\nInput format:\n- First line: integer $n$\n- Next $n$ lines: one integer per line\n\nOutput format:\n- After each insertion, print the median on its own line.\n- If the count is odd, the median is the middle number.\n- If the count is even, define the median as the average of the two middle numbers, printed as a reduced fraction `A/B`.\n\nExample:\n\nInput:\n```\n5\n1\n5\n2\n10\n-1\n```\nOutput:\n```\n1/1\n3/1\n2/1\n7/2\n2/1\n```",
    solution_md:
      "Maintain two heaps: a max-heap for the lower half and a min-heap for the upper half. Rebalance so their sizes differ by at most 1 and all elements in lower ≤ all in upper. Median is top of max-heap if odd; if even, it's the average of the two tops. Use gcd to reduce the fraction for even case.",
    answer_kind: "code",
    difficulty: 4,
    tags: ["heaps", "streaming", "median"],
    companies: ["Jane Street", "Citadel", "HRT"],
    source: "Streaming primitive",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\nimport heapq\nimport math\n\ndef solve():\n    data = sys.stdin.read().strip().split()\n    if not data:\n        return\n    n = int(data[0])\n    xs = list(map(int, data[1:1+n]))\n\n    lo = []  # max-heap via negative values\n    hi = []  # min-heap\n\n    out = []\n    for x in xs:\n        if not lo or x <= -lo[0]:\n            heapq.heappush(lo, -x)\n        else:\n            heapq.heappush(hi, x)\n\n        # rebalance\n        if len(lo) > len(hi) + 1:\n            heapq.heappush(hi, -heapq.heappop(lo))\n        elif len(hi) > len(lo):\n            heapq.heappush(lo, -heapq.heappop(hi))\n\n        if len(lo) == len(hi):\n            a = -lo[0]\n            b = hi[0]\n            num = a + b\n            den = 2\n            g = math.gcd(abs(num), den)\n            out.append(f\"{num//g}/{den//g}\")\n        else:\n            out.append(f\"{-lo[0]}/1\")\n\n    sys.stdout.write(\"\\n\".join(out))\n\nsolve()\n",
      test_cases: [
        { input: "5\n1\n5\n2\n10\n-1\n", expected: "1/1\n3/1\n2/1\n7/2\n2/1" },
        { input: "1\n42\n", expected: "42/1" },
        { input: "2\n1\n2\n", expected: "1/1\n3/2" },
        { input: "4\n-5\n-1\n-3\n-2\n", expected: "-5/1\n-3/1\n-3/1\n-5/2", hidden: true },
        { input: "6\n1\n1\n1\n1\n1\n1\n", expected: "1/1\n1/1\n1/1\n1/1\n1/1\n1/1", hidden: true },
      ],
      time_limit_ms: 2500,
      memory_limit_mb: 128,
    },
  },
  {
    slug: "top-k-frequent-stream",
    topic: "Algorithms",
    track: "dev",
    title: "Top-K Frequent Elements (Streaming Log)",
    prompt_md:
      "You are given a log of integer event IDs. Output the $k$ most frequent IDs.\n\nInput format:\n- First line: integer $k$\n- Second line: space-separated integers (the event IDs)\n\nOutput format:\n- Print the top $k$ IDs in descending frequency.\n- Break ties by smaller ID first.\n- Output as space-separated integers on one line.\n\nExample:\n\nInput:\n```\n2\n1 1 1 2 2 3\n```\nOutput:\n```\n1 2\n```",
    solution_md:
      "Count frequencies with a hash map. Then sort unique IDs by (-freq, id) and take the first k. For large domains you could maintain a min-heap of size k, but sorting is fine given typical interview constraints.",
    answer_kind: "code",
    difficulty: 2,
    tags: ["hashmap", "sorting", "heaps"],
    companies: ["Citadel", "Two Sigma"],
    source: "Interview staple",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\nfrom collections import Counter\n\ndef solve():\n    data = sys.stdin.read().strip().split()\n    if not data:\n        return\n    k = int(data[0])\n    ids = list(map(int, data[1:]))\n    c = Counter(ids)\n    items = sorted(c.items(), key=lambda kv: (-kv[1], kv[0]))\n    ans = [str(x) for x, _ in items[:k]]\n    sys.stdout.write(' '.join(ans))\n\nsolve()\n",
      test_cases: [
        { input: "2\n1 1 1 2 2 3\n", expected: "1 2" },
        { input: "1\n4 4 4 4\n", expected: "4" },
        { input: "3\n5 6 7\n", expected: "5 6 7", hidden: true },
        { input: "2\n2 2 3 3 1 1\n", expected: "1 2", hidden: true },
      ],
      time_limit_ms: 2000,
      memory_limit_mb: 64,
    },
  },
  {
    slug: "ewma-stream",
    topic: "Algorithms",
    track: "dev",
    title: "EWMA (Streaming) — Exact Fractions",
    prompt_md:
      "Compute an exponentially weighted moving average (EWMA) exactly (as reduced fractions).\n\nDefinition:\n- Given smoothing factor \\(\\alpha\\) with \\(0 < \\alpha \\le 1\\)\n- EWMA recursion: \\(m_0 = x_0\\), and for \\(t \\ge 1\\):\n  \\[m_t = \\alpha x_t + (1-\\alpha)m_{t-1}\\]\n\nInput format:\n- Line 1: `p q` meaning \\(\\alpha = p/q\\) (integers, reduced not guaranteed)\n- Line 2: integer `n`\n- Next `n` lines: one integer `x_t`\n\nOutput format:\n- Print `n` lines.\n- Line t: the reduced fraction `A/B` for \\(m_t\\).\n\nExample:\n\nInput:\n```\n1 2\n3\n10\n12\n14\n```\nOutput:\n```\n10/1\n11/1\n25/2\n```",
    solution_md:
      "Keep EWMA as a rational number `num/den`. With \\(\\alpha=p/q\\), update using integer arithmetic:\n\n`m = (p*x*q_prev + (q-p)*m_prev) / q`.\n\nMaintain numerator/denominator and reduce by gcd each step.",
    answer_kind: "code",
    difficulty: 4,
    tags: ["streaming", "fractions", "applications"],
    companies: ["Optiver", "IMC", "Jane Street"],
    source: "Execution analytics primitive",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\nimport math\n\ndef solve():\n    data = [ln.strip() for ln in sys.stdin.read().splitlines() if ln.strip()]\n    if not data:\n        return\n    p, q = map(int, data[0].split())\n    g = math.gcd(p, q)\n    p //= g\n    q //= g\n    n = int(data[1])\n    xs = [int(x) for x in data[2:2+n]]\n    out = []\n\n    # m = num/den\n    num = xs[0]\n    den = 1\n    out.append(f\"{num}/{den}\")\n\n    for x in xs[1:]:\n        # m' = (p/q)*x + (1-p/q)*m = (p*x*den + (q-p)*num) / (q*den)\n        new_num = p * x * den + (q - p) * num\n        new_den = q * den\n        gg = math.gcd(abs(new_num), new_den)\n        num = new_num // gg\n        den = new_den // gg\n        out.append(f\"{num}/{den}\")\n\n    sys.stdout.write(\"\\n\".join(out))\n\nsolve()\n",
      test_cases: [
        { input: "1 2\n3\n10\n12\n14\n", expected: "10/1\n11/1\n25/2" },
        { input: "1 1\n3\n5\n6\n7\n", expected: "5/1\n6/1\n7/1", hidden: true },
        { input: "1 3\n2\n0\n3\n", expected: "0/1\n1/1", hidden: true },
      ],
      time_limit_ms: 2500,
      memory_limit_mb: 128,
    },
  },
  {
    slug: "welford-variance-final",
    topic: "Algorithms",
    track: "dev",
    title: "Streaming Mean + Unbiased Variance (Welford)",
    prompt_md:
      "Given a stream of integers, compute the final sample mean and unbiased sample variance.\n\nDefinitions for \\(n\\ge 2\\):\n- Mean: \\(\\bar x = \\frac{1}{n}\\sum x_i\\)\n- Unbiased sample variance: \\(s^2 = \\frac{1}{n-1}\\sum (x_i-\\bar x)^2\\)\n\nInput format:\n- Line 1: integer `n`\n- Next `n` lines: one integer per line\n\nOutput format:\n- Line 1: mean as reduced fraction `A/B`\n- Line 2: variance as reduced fraction `C/D`\n\nExample:\n\nInput:\n```\n3\n1\n2\n3\n```\nOutput:\n```\n2/1\n1/1\n```",
    solution_md:
      "Use Welford's one-pass stable algorithm to compute mean and M2 (sum of squares of deviations). At the end, variance is M2/(n-1). Convert mean and variance to reduced fractions.",
    answer_kind: "code",
    difficulty: 5,
    tags: ["streaming", "numerical-stability", "statistics"],
    companies: ["Two Sigma", "Citadel", "Jane Street"],
    source: "Quant-dev primitive",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\nimport math\nfrom fractions import Fraction\n\ndef solve():\n    data = sys.stdin.read().strip().split()\n    if not data:\n        return\n    n = int(data[0])\n    xs = list(map(int, data[1:1+n]))\n\n    mean = Fraction(0, 1)\n    M2 = Fraction(0, 1)\n    k = 0\n    for x in xs:\n        k += 1\n        x = Fraction(x, 1)\n        delta = x - mean\n        mean += delta / k\n        delta2 = x - mean\n        M2 += delta * delta2\n\n    # mean is exact Fraction\n    m = mean\n    if n < 2:\n        # define variance 0 for n=1\n        v = Fraction(0, 1)\n    else:\n        v = M2 / (n - 1)\n\n    sys.stdout.write(f\"{m.numerator}/{m.denominator}\\n{v.numerator}/{v.denominator}\")\n\nsolve()\n",
      test_cases: [
        { input: "3\n1\n2\n3\n", expected: "2/1\n1/1" },
        { input: "2\n0\n2\n", expected: "1/1\n2/1", hidden: true },
        { input: "1\n5\n", expected: "5/1\n0/1", hidden: true },
      ],
      time_limit_ms: 3000,
      memory_limit_mb: 256,
    },
  },
  {
    slug: "max-drawdown",
    topic: "Algorithms",
    track: "dev",
    title: "Max Drawdown",
    prompt_md:
      "Given a time series of prices, compute the maximum drawdown.\n\nMax drawdown is:\n\\[\\max_{j>i} \\frac{P_i - P_j}{P_i}\\]\nwhere \\(P_i\\) is a prior peak and \\(P_j\\) is a later trough.\n\nInput format:\n- Line 1: integer `n`\n- Line 2: space-separated positive integers (prices)\n\nOutput:\n- Print the max drawdown as a reduced fraction `A/B`.\n\nExample:\n\nInput:\n```\n5\n100 120 90 110 80\n```\nOutput:\n```\n1/3\n```\n(peak 120 to trough 80 gives (120-80)/120 = 40/120 = 1/3)",
    solution_md:
      "Track the running peak price. For each price, compute (peak - price)/peak and keep the maximum. Output as a reduced fraction.",
    answer_kind: "code",
    difficulty: 3,
    tags: ["arrays", "streaming", "fractions"],
    companies: ["Optiver", "IMC", "Jump Trading"],
    source: "Time-series metric primitive",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\nimport math\n\ndef solve():\n    data = sys.stdin.read().strip().split()\n    if not data:\n        return\n    n = int(data[0])\n    ps = list(map(int, data[1:1+n]))\n    peak = ps[0]\n    best_num = 0\n    best_den = 1\n    for p in ps[1:]:\n        if p > peak:\n            peak = p\n+            continue\n        num = peak - p\n        den = peak\n        if num * best_den > best_num * den:\n            best_num, best_den = num, den\n    g = math.gcd(best_num, best_den)\n    best_num //= g\n    best_den //= g\n    sys.stdout.write(f\"{best_num}/{best_den}\")\n\nsolve()\n",
      test_cases: [
        { input: "5\n100 120 90 110 80\n", expected: "1/3" },
        { input: "4\n10 9 8 7\n", expected: "3/10", hidden: true },
        { input: "3\n5 6 7\n", expected: "0/1", hidden: true },
      ],
      time_limit_ms: 2000,
      memory_limit_mb: 128,
    },
  },
  {
    slug: "rolling-correlation-window-k",
    topic: "Algorithms",
    track: "dev",
    title: "Rolling Correlation (Window K)",
    prompt_md:
      "Compute the rolling Pearson correlation over a fixed window.\n\nFor a window of pairs \\((x_i,y_i)\\) of length \\(K\\), define:\n\\[\n\\rho = \\frac{\\sum (x_i-\\bar x)(y_i-\\bar y)}{\\sqrt{\\sum (x_i-\\bar x)^2}\\sqrt{\\sum (y_i-\\bar y)^2}}\n\\]\n\nInput format:\n- Line 1: integer `K`\n- Next lines: pairs `x y` (integers), one per line\n\nOutput:\n- For each full window (starting at i=K), print one line:\n  - If variance of x or y in the window is 0, print `nan`\n  - Else print correlation as a reduced fraction of the form `A/B` where \\(A/B\\) equals:\n    \\[ \\frac{\\sum (x_i-\\bar x)(y_i-\\bar y)}{\\sqrt{\\sum (x_i-\\bar x)^2\\sum (y_i-\\bar y)^2}} \\]\n\nFor this problem, instead output the *squared correlation* \\(\\rho^2\\) as a reduced fraction (so no square roots).\n\nExample:\n\nInput:\n```\n3\n1 1\n2 2\n3 3\n4 0\n```\nOutput:\n```\n1/1\n1/4\n```",
    solution_md:
      "Maintain rolling sums: Sx, Sy, Sxx, Syy, Sxy. For each window:\n\ncov_num = K*Sxy - Sx*Sy\nvarx_num = K*Sxx - Sx*Sx\nvary_num = K*Syy - Sy*Sy\n\nThen rho^2 = cov_num^2 / (varx_num * vary_num). Reduce by gcd. If varx_num==0 or vary_num==0 output nan.",
    answer_kind: "code",
    difficulty: 5,
    tags: ["rolling-window", "statistics", "fractions"],
    companies: ["Two Sigma", "Citadel", "Jane Street"],
    source: "Quant analytics primitive",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\nimport math\n\ndef solve():\n    lines = [ln.strip() for ln in sys.stdin.read().splitlines() if ln.strip()]\n    if not lines:\n        return\n    K = int(lines[0])\n    pairs = [tuple(map(int, ln.split())) for ln in lines[1:]]\n    out = []\n\n    Sx = Sy = Sxx = Syy = Sxy = 0\n    buf = []\n    for (x, y) in pairs:\n        buf.append((x, y))\n        Sx += x\n        Sy += y\n        Sxx += x * x\n        Syy += y * y\n        Sxy += x * y\n        if len(buf) > K:\n            x0, y0 = buf.pop(0)\n            Sx -= x0\n            Sy -= y0\n            Sxx -= x0 * x0\n            Syy -= y0 * y0\n            Sxy -= x0 * y0\n        if len(buf) == K:\n            cov = K * Sxy - Sx * Sy\n            varx = K * Sxx - Sx * Sx\n            vary = K * Syy - Sy * Sy\n            if varx == 0 or vary == 0:\n                out.append(\"nan\")\n            else:\n                num = cov * cov\n                den = varx * vary\n                if den < 0:\n                    # should not happen for integer sums, but keep safe\n                    out.append(\"nan\")\n                else:\n                    g = math.gcd(abs(num), den)\n                    out.append(f\"{num//g}/{den//g}\")\n\n    sys.stdout.write(\"\\n\".join(out))\n\nsolve()\n",
      test_cases: [
        { input: "3\n1 1\n2 2\n3 3\n4 0\n", expected: "1/1\n1/4" },
        { input: "2\n1 1\n1 1\n2 3\n", expected: "nan\nnan", hidden: true },
        { input: "3\n1 2\n2 1\n3 0\n4 -1\n", expected: "1/1\n1/1", hidden: true },
      ],
      time_limit_ms: 3500,
      memory_limit_mb: 256,
    },
  },
  {
    slug: "decimal-sum-exact",
    topic: "Algorithms",
    track: "dev",
    title: "Exact Decimal Summation (No Floating Point)",
    prompt_md:
      "Sum a list of decimal numbers exactly and print the exact result.\n\nInput format:\n- Line 1: integer `n`\n- Next `n` lines: a decimal number like `-12.34` or `5` or `0.001` (no exponent)\n\nOutput:\n- Print the exact sum in canonical decimal form (no trailing zeros; no trailing decimal point).\n\nExample:\n\nInput:\n```\n3\n0.1\n0.2\n0.3\n```\nOutput:\n```\n0.6\n```",
    solution_md:
      "Parse decimals as integers with a shared scale: keep (sign, digits, scale). Use max scale to align, sum integers, then format back to decimal stripping trailing zeros.",
    answer_kind: "code",
    difficulty: 4,
    tags: ["parsing", "numerical", "strings"],
    companies: ["Jane Street", "HRT"],
    source: "Numerical correctness primitive",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\n\ndef parse_decimal(s: str):\n    s = s.strip()\n    sign = 1\n    if s.startswith('-'):\n        sign = -1\n        s = s[1:]\n    if '.' in s:\n        a, b = s.split('.', 1)\n        scale = len(b)\n        digits = a + b\n    else:\n        scale = 0\n        digits = s\n    if digits == '':\n        digits = '0'\n    val = int(digits) * sign\n    return val, scale\n\ndef format_decimal(val: int, scale: int) -> str:\n    sign = '-' if val < 0 else ''\n    val = abs(val)\n    s = str(val)\n    if scale == 0:\n        return sign + s\n    if len(s) <= scale:\n        s = '0' * (scale - len(s) + 1) + s\n    whole = s[:-scale]\n    frac = s[-scale:]\n    # strip trailing zeros\n    frac = frac.rstrip('0')\n    if frac == '':\n        return sign + whole\n    return sign + whole + '.' + frac\n\ndef solve():\n    lines = [ln.strip() for ln in sys.stdin.read().splitlines() if ln.strip()]\n    if not lines:\n        return\n    n = int(lines[0])\n    nums = [parse_decimal(ln) for ln in lines[1:1+n]]\n    max_scale = max(sc for _, sc in nums) if nums else 0\n    total = 0\n    for v, sc in nums:\n        total += v * (10 ** (max_scale - sc))\n    sys.stdout.write(format_decimal(total, max_scale))\n\nsolve()\n",
      test_cases: [
        { input: "3\n0.1\n0.2\n0.3\n", expected: "0.6" },
        { input: "2\n1.2300\n-0.23\n", expected: "1", hidden: true },
        { input: "3\n-1\n0.001\n0.009\n", expected: "-0.99", hidden: true },
      ],
      time_limit_ms: 2500,
      memory_limit_mb: 128,
    },
  },
  {
    slug: "rolling-zscore-window-k",
    topic: "Algorithms",
    track: "dev",
    title: "Rolling Z-Score (Window K) — Exact Fractions",
    prompt_md:
      "Compute rolling z-scores over a fixed window exactly.\n\nFor a window of length K of values x, define:\n- mean: \\(\\mu\\)\n- variance: \\(\\sigma^2 = \\frac{1}{K}\\sum (x_i-\\mu)^2\\) (population variance)\n- z-score for the last element in the window: \\(z = \\frac{x_{last}-\\mu}{\\sigma}\\)\n\nFor this problem, output \\(z^2\\) as a reduced fraction, or `nan` if variance is 0.\n\nInput:\n- Line 1: integer K\n- Line 2: space-separated integers\n\nOutput:\n- For each full window, print `z^2` for the last element, as `A/B`, one per line.\n\nExample:\nInput:\n```\n3\n1 2 3 4\n```\nOutput:\n```\n3/2\n3/2\n```",
    solution_md:
      "Maintain rolling sums S and S2. For window, mean = S/K. For last value x, (x-mean)^2 = (Kx - S)^2 / K^2. Variance = (K*S2 - S^2)/K^2. Thus z^2 = (Kx - S)^2 / (K*S2 - S^2). Reduce by gcd; if denominator is 0 => nan.",
    answer_kind: "code",
    difficulty: 5,
    tags: ["rolling-window", "statistics", "fractions"],
    companies: ["Two Sigma", "Citadel"],
    source: "Quant analytics primitive",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\nimport math\n\ndef solve():\n    data = sys.stdin.read().strip().split()\n    if not data:\n        return\n    K = int(data[0])\n    xs = list(map(int, data[1:]))\n    out = []\n\n    S = 0\n    S2 = 0\n    buf = []\n    for x in xs:\n        buf.append(x)\n        S += x\n        S2 += x * x\n        if len(buf) > K:\n            x0 = buf.pop(0)\n            S -= x0\n            S2 -= x0 * x0\n        if len(buf) == K:\n            # denom = K*S2 - S^2  (proportional to variance)\n            denom = K * S2 - S * S\n            if denom == 0:\n                out.append(\"nan\")\n                continue\n            num = (K * buf[-1] - S) ** 2\n            g = math.gcd(abs(num), abs(denom))\n            num //= g\n            denom //= g\n            out.append(f\"{num}/{denom}\")\n\n    sys.stdout.write(\"\\n\".join(out))\n\nsolve()\n",
      test_cases: [
        { input: "3\n1 2 3 4\n", expected: "3/2\n3/2" },
        { input: "2\n5 5 5\n", expected: "nan\nnan", hidden: true },
        { input: "3\n0 1 0 1\n", expected: "1/2\n1/2", hidden: true },
      ],
      time_limit_ms: 3000,
      memory_limit_mb: 256,
    },
  },
  {
    slug: "reservoir-sampling-k",
    topic: "Algorithms",
    track: "dev",
    title: "Reservoir Sampling (Keep K Items Uniformly)",
    prompt_md:
      "Maintain a uniform random sample of size K from a stream of items 1..n.\n\nInput format:\n- Line 1: integer K\n- Line 2: integer n\n- Line 3: integer seed (for RNG)\n- Next line: n space-separated integers (the stream values)\n\nAlgorithm requirement:\n- Use reservoir sampling so every item has equal probability K/n of being included.\n- Use the provided seed to make output deterministic.\n\nOutput:\n- Print the final reservoir contents as space-separated integers in the order stored.\n\nExample:\nInput:\n```\n2\n5\n1\n10 20 30 40 50\n```\nOutput:\n```\n10 30\n```\n(Note: output depends on RNG; this example matches the required RNG below.)",
    solution_md:
      "Reservoir sampling: fill the reservoir with first K items. For item i (1-indexed) where i>K, draw j uniformly in [1..i]; if j<=K, replace reservoir[j-1] with the new item.\n\nTo keep results deterministic, use Python's `random.Random(seed)`.",
    answer_kind: "code",
    difficulty: 4,
    tags: ["streaming", "randomized"],
    companies: ["Jane Street", "Two Sigma"],
    source: "Streaming primitive",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\nimport random\n\ndef solve():\n    data = sys.stdin.read().strip().split()\n    if not data:\n        return\n    K = int(data[0])\n    n = int(data[1])\n    seed = int(data[2])\n    xs = list(map(int, data[3:3+n]))\n\n    rng = random.Random(seed)\n    res = []\n    for i, x in enumerate(xs, start=1):\n        if i <= K:\n            res.append(x)\n        else:\n            j = rng.randrange(1, i + 1)\n            if j <= K:\n                res[j - 1] = x\n\n    sys.stdout.write(' '.join(map(str, res)))\n\nsolve()\n",
      test_cases: [
        { input: "2\n5\n1\n10 20 30 40 50\n", expected: "10 30" },
        { input: "3\n6\n42\n1 2 3 4 5 6\n", expected: "1 5 3", hidden: true },
        { input: "1\n4\n7\n9 8 7 6\n", expected: "7", hidden: true },
      ],
      time_limit_ms: 2000,
      memory_limit_mb: 128,
    },
  },
  {
    slug: "stream-top-n-by-value",
    topic: "Algorithms",
    track: "dev",
    title: "Streaming Top-N by Value (Bounded Memory)",
    prompt_md:
      "You receive a stream of integers and want to output the N largest values seen.\n\nInput:\n- Line 1: integer N\n- Line 2: space-separated integers\n\nOutput:\n- Print the N largest values in descending order, space-separated.\n- If there are fewer than N values, print all of them in descending order.\n\nExample:\nInput:\n```\n3\n5 1 9 2 8\n```\nOutput:\n```\n9 8 5\n```",
    solution_md:
      "Maintain a min-heap of size at most N. Push new items; if heap grows beyond N, pop the smallest. At the end, sort heap descending and print.",
    answer_kind: "code",
    difficulty: 2,
    tags: ["streaming", "heaps"],
    companies: ["Citadel", "Jump Trading"],
    source: "Streaming primitive",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\nimport heapq\n\ndef solve():\n    data = sys.stdin.read().strip().split()\n    if not data:\n        return\n    N = int(data[0])\n    xs = list(map(int, data[1:]))\n    h = []\n    for x in xs:\n        if len(h) < N:\n            heapq.heappush(h, x)\n        else:\n            if N > 0 and x > h[0]:\n                heapq.heapreplace(h, x)\n    h.sort(reverse=True)\n    sys.stdout.write(' '.join(map(str, h)))\n\nsolve()\n",
      test_cases: [
        { input: "3\n5 1 9 2 8\n", expected: "9 8 5" },
        { input: "5\n1 2\n", expected: "2 1", hidden: true },
        { input: "0\n1 2 3\n", expected: "", hidden: true },
      ],
      time_limit_ms: 2000,
      memory_limit_mb: 128,
    },
  },
  {
    slug: "trades-to-vwap",
    topic: "Algorithms",
    track: "dev",
    title: "VWAP From Trades (One Pass)",
    prompt_md:
      "Compute VWAP from a list of trades.\n\nInput:\n- Line 1: integer n\n- Next n lines: `price size` (both integers)\n\nOutput:\n- Print VWAP as reduced fraction `A/B`.\n\nExample:\nInput:\n```\n3\n100 2\n101 1\n99 1\n```\nOutput:\n```\n400/4\n```\n(which reduces to `100/1`)",
    solution_md:
      "Sum `sumPV = Σ(price*size)` and `sumV = Σ(size)` in integers, then reduce `sumPV/sumV` by gcd.",
    answer_kind: "code",
    difficulty: 2,
    tags: ["streaming", "fractions"],
    companies: ["Optiver", "IMC"],
    source: "Execution analytics primitive",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\nimport math\n\ndef solve():\n    lines = [ln.strip() for ln in sys.stdin.read().splitlines() if ln.strip()]\n    if not lines:\n        return\n    n = int(lines[0])\n    sumPV = 0\n    sumV = 0\n    for ln in lines[1:1+n]:\n        p, s = map(int, ln.split())\n        sumPV += p * s\n        sumV += s\n    g = math.gcd(sumPV, sumV)\n    sys.stdout.write(f\"{sumPV//g}/{sumV//g}\")\n\nsolve()\n",
      test_cases: [
        { input: "3\n100 2\n101 1\n99 1\n", expected: "100/1" },
        { input: "1\n7 3\n", expected: "7/1", hidden: true },
      ],
      time_limit_ms: 2000,
      memory_limit_mb: 128,
    },
  },
  {
    slug: "rolling-bid-ask-spread-window-k",
    topic: "Algorithms",
    track: "dev",
    title: "Rolling Bid–Ask Spread (Window K)",
    prompt_md:
      "Given a stream of bid/ask quotes, output the maximum spread in each window of size K.\n\nSpread at time t is `ask - bid`.\n\nInput:\n- Line 1: integer K\n- Next lines: `bid ask` (integers), one per line\n\nOutput:\n- For each full window, print the maximum spread in that window.\n\nExample:\nInput:\n```\n3\n100 101\n100 103\n99 100\n100 100\n```\nOutput:\n```\n3\n3\n```",
    solution_md:
      "Compute spreads and apply the monotonic deque sliding window maximum algorithm in O(n).",
    answer_kind: "code",
    difficulty: 3,
    tags: ["sliding-window", "monotonic-queue", "applications"],
    companies: ["Jump Trading", "Citadel Securities"],
    source: "Market data primitive",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\nfrom collections import deque\n\ndef solve():\n    lines = [ln.strip() for ln in sys.stdin.read().splitlines() if ln.strip()]\n    if not lines:\n        return\n    K = int(lines[0])\n    spreads = []\n    for ln in lines[1:]:\n        b, a = map(int, ln.split())\n        spreads.append(a - b)\n\n    dq = deque()  # indices, values decreasing\n    out = []\n    for i, x in enumerate(spreads):\n        while dq and spreads[dq[-1]] <= x:\n            dq.pop()\n        dq.append(i)\n        if dq[0] <= i - K:\n            dq.popleft()\n        if i >= K - 1:\n            out.append(str(spreads[dq[0]]))\n\n    sys.stdout.write(\"\\n\".join(out))\n\nsolve()\n",
      test_cases: [
        { input: "3\n100 101\n100 103\n99 100\n100 100\n", expected: "3\n3" },
        { input: "2\n1 2\n1 10\n", expected: "1\n9", hidden: true },
      ],
      time_limit_ms: 2500,
      memory_limit_mb: 128,
    },
  },
  {
    slug: "online-covariance-final",
    topic: "Algorithms",
    track: "dev",
    title: "Online Covariance (Exact Fraction)",
    prompt_md:
      "Given pairs (x,y), compute the final sample covariance exactly.\n\nFor n>=2, sample covariance is:\n\\[\\text{cov} = \\frac{1}{n-1}\\sum (x_i-\\bar x)(y_i-\\bar y)\\]\n\nInput:\n- Line 1: integer n\n- Next n lines: `x y` (integers)\n\nOutput:\n- Print covariance as reduced fraction `A/B`.\n\nExample:\nInput:\n```\n3\n1 1\n2 2\n3 0\n```\nOutput:\n```\n-1/2\n```",
    solution_md:
      "Maintain sums Sx, Sy, Sxy. Cov numerator is: n*Sxy - Sx*Sy. Sample covariance = (n*Sxy - Sx*Sy) / (n*(n-1)). Reduce by gcd.",
    answer_kind: "code",
    difficulty: 4,
    tags: ["streaming", "statistics", "fractions"],
    companies: ["Two Sigma", "Citadel"],
    source: "Quant analytics primitive",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\nimport math\n\ndef solve():\n    lines = [ln.strip() for ln in sys.stdin.read().splitlines() if ln.strip()]\n    if not lines:\n        return\n    n = int(lines[0])\n    Sx = Sy = Sxy = 0\n    for ln in lines[1:1+n]:\n        x, y = map(int, ln.split())\n        Sx += x\n        Sy += y\n        Sxy += x * y\n    if n < 2:\n        sys.stdout.write(\"0/1\")\n        return\n    num = n * Sxy - Sx * Sy\n    den = n * (n - 1)\n    g = math.gcd(abs(num), den)\n    sys.stdout.write(f\"{num//g}/{den//g}\")\n\nsolve()\n",
      test_cases: [
        { input: "3\n1 1\n2 2\n3 0\n", expected: "-1/2" },
        { input: "2\n0 0\n1 1\n", expected: "1/2", hidden: true },
        { input: "1\n5 7\n", expected: "0/1", hidden: true },
      ],
      time_limit_ms: 2000,
      memory_limit_mb: 128,
    },
  },
  {
    slug: "logsumexp-stable",
    topic: "Algorithms",
    track: "dev",
    title: "Stable LogSumExp",
    prompt_md:
      "Compute \\(\\log\\left(\\sum_i e^{x_i}\\right)\\) stably for real inputs.\n\nInput:\n- Line 1: n\n- Line 2: space-separated floats\n\nOutput:\n- Print the result as a float with absolute error <= 1e-6.\n\nExample:\nInput:\n```\n3\n1000 1000 1000\n```\nOutput:\n```\n1001.098612\n```",
    solution_md:
      "Use the standard stabilization: let m = max(x). Then logsumexp = m + log(Σ exp(x_i - m)). This avoids overflow.",
    answer_kind: "code",
    difficulty: 3,
    tags: ["numerical-stability", "math"],
    companies: ["Two Sigma", "Jane Street"],
    source: "Numerical computing staple",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\nimport math\n\ndef solve():\n    data = sys.stdin.read().strip().split()\n    if not data:\n        return\n    n = int(data[0])\n    xs = list(map(float, data[1:1+n]))\n    m = max(xs)\n    s = 0.0\n    for x in xs:\n        s += math.exp(x - m)\n    ans = m + math.log(s)\n    sys.stdout.write(f\"{ans:.6f}\")\n\nsolve()\n",
      test_cases: [
        { input: "3\n1000 1000 1000\n", expected: "1001.098612" },
        { input: "2\n0 0\n", expected: "0.693147", hidden: true },
        { input: "2\n-1000 -1000\n", expected: "-999.306853", hidden: true },
      ],
      time_limit_ms: 2000,
      memory_limit_mb: 128,
    },
  },
  {
    slug: "reservoir-sampling-weighted",
    topic: "Algorithms",
    track: "dev",
    title: "Weighted Random Choice (Alias Method — Build Only)",
    prompt_md:
      "Build a data structure to sample from a discrete distribution quickly.\n\nInput:\n- Line 1: n\n- Line 2: n positive weights (floats)\n\nOutput:\n- Print two arrays for the alias method:\n  - `prob`: n floats\n  - `alias`: n integers\n\nFormat:\n- Line 1: `prob` as space-separated floats with 6 decimals\n- Line 2: `alias` as space-separated ints\n\nYou do NOT need to sample; only build the tables.\n\nExample:\nInput:\n```\n3\n1 1 2\n```\nOutput:\n```\n0.750000 0.750000 1.000000\n2 2 2\n```",
    solution_md:
      "Normalize weights to probabilities. Scale by n to get expected bucket sizes. Use two stacks (small/large) to fill prob/alias such that each bucket has total probability 1. Classic Vose alias method.",
    answer_kind: "code",
    difficulty: 5,
    tags: ["randomized", "preprocessing"],
    companies: ["HRT", "Jane Street"],
    source: "Sampling primitive",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\n\ndef solve():\n    data = sys.stdin.read().strip().split()\n    if not data:\n        return\n    n = int(data[0])\n    w = list(map(float, data[1:1+n]))\n    s = sum(w)\n    p = [x / s for x in w]\n    scaled = [x * n for x in p]\n\n    prob = [0.0] * n\n    alias = [0] * n\n\n    small = []\n    large = []\n    for i, v in enumerate(scaled):\n        if v < 1.0:\n            small.append(i)\n        else:\n            large.append(i)\n\n    while small and large:\n        a = small.pop()\n        b = large.pop()\n        prob[a] = scaled[a]\n        alias[a] = b\n        scaled[b] = scaled[b] - (1.0 - scaled[a])\n        if scaled[b] < 1.0:\n            small.append(b)\n        else:\n            large.append(b)\n\n    for i in large:\n        prob[i] = 1.0\n        alias[i] = i\n    for i in small:\n        prob[i] = 1.0\n        alias[i] = i\n\n    sys.stdout.write(' '.join(f\"{x:.6f}\" for x in prob) + \"\\n\")\n    sys.stdout.write(' '.join(str(x) for x in alias))\n\nsolve()\n",
      test_cases: [
        { input: "3\n1 1 2\n", expected: "0.750000 0.750000 1.000000\n2 2 2" },
        { input: "1\n5\n", expected: "1.000000\n0", hidden: true },
      ],
      time_limit_ms: 3000,
      memory_limit_mb: 256,
    },
  },
  {
    slug: "online-linear-regression-final",
    topic: "Algorithms",
    track: "dev",
    title: "Online Linear Regression (Slope + Intercept)",
    prompt_md:
      "Given pairs (x, y), compute the least-squares line \\(y = a x + b\\).\n\nUse the standard formulas:\n- \\(a = \\frac{n\\sum xy - (\\sum x)(\\sum y)}{n\\sum x^2 - (\\sum x)^2}\\)\n- \\(b = \\bar y - a\\bar x\\)\n\nInput:\n- Line 1: integer n (n>=2)\n- Next n lines: `x y` (integers)\n\nOutput:\n- Line 1: slope `a` as reduced fraction `A/B`\n- Line 2: intercept `b` as reduced fraction `C/D`\n\nIf the denominator for `a` is 0 (all x equal), print `nan` on both lines.\n\nExample:\nInput:\n```\n3\n1 2\n2 4\n3 6\n```\nOutput:\n```\n2/1\n0/1\n```",
    solution_md:
      "Maintain sums Sx, Sy, Sxx, Sxy. Compute slope numerator/denominator using integer arithmetic. If denom=0 => nan. Otherwise compute `a`, then `b = (Sy/n) - a*(Sx/n)` using exact rational arithmetic and reduce.",
    answer_kind: "code",
    difficulty: 4,
    tags: ["statistics", "streaming", "fractions"],
    companies: ["Two Sigma", "Citadel", "Jane Street"],
    source: "Quant analytics primitive",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\nimport math\nfrom fractions import Fraction\n\ndef solve():\n    lines = [ln.strip() for ln in sys.stdin.read().splitlines() if ln.strip()]\n    if not lines:\n        return\n    n = int(lines[0])\n    Sx = Sy = Sxx = Sxy = 0\n    for ln in lines[1:1+n]:\n        x, y = map(int, ln.split())\n        Sx += x\n        Sy += y\n        Sxx += x * x\n        Sxy += x * y\n\n    denom = n * Sxx - Sx * Sx\n    if denom == 0:\n        sys.stdout.write(\"nan\\nnan\")\n        return\n\n    a = Fraction(n * Sxy - Sx * Sy, denom)\n    b = Fraction(Sy, n) - a * Fraction(Sx, n)\n\n    sys.stdout.write(f\"{a.numerator}/{a.denominator}\\n{b.numerator}/{b.denominator}\")\n\nsolve()\n",
      test_cases: [
        { input: "3\n1 2\n2 4\n3 6\n", expected: "2/1\n0/1" },
        { input: "3\n1 1\n2 2\n3 2\n", expected: "1/2\n2/3", hidden: true },
        { input: "2\n5 1\n5 9\n", expected: "nan\nnan", hidden: true },
      ],
      time_limit_ms: 2500,
      memory_limit_mb: 256,
    },
  },
  {
    slug: "rolling-beta-window-k",
    topic: "Algorithms",
    track: "dev",
    title: "Rolling Beta (Window K) — Exact Fraction",
    prompt_md:
      "Compute rolling beta of asset returns vs market returns.\n\nFor a window of length K of pairs (r, m), define sample beta:\n\\[\\beta = \\frac{\\text{cov}(r,m)}{\\text{var}(m)}\\]\nwith sample covariance/variance using divisor (K-1).\n\nInput:\n- Line 1: integer K\n- Next lines: `r m` (integers)\n\nOutput:\n- For each full window, print beta as reduced fraction `A/B`\n- If var(m)=0 in the window, print `nan`\n\nExample:\nInput:\n```\n3\n1 1\n2 1\n3 2\n4 2\n```\nOutput:\n```\n2/1\n2/1\n```",
    solution_md:
      "Maintain rolling sums Sr, Sm, Smm, Srm. Use centered formulas:\n\ncov_num = K*Srm - Sr*Sm\nvarm_num = K*Smm - Sm*Sm\n\nThen beta = cov_num / varm_num (the (K-1) cancels). Reduce; if varm_num==0 output nan.",
    answer_kind: "code",
    difficulty: 5,
    tags: ["rolling-window", "statistics", "fractions"],
    companies: ["Two Sigma", "Citadel"],
    source: "Risk analytics primitive",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\nimport math\n\ndef solve():\n    lines = [ln.strip() for ln in sys.stdin.read().splitlines() if ln.strip()]\n    if not lines:\n        return\n    K = int(lines[0])\n    pairs = [tuple(map(int, ln.split())) for ln in lines[1:]]\n\n    Sr = Sm = Smm = Srm = 0\n    buf = []\n    out = []\n\n    for r, m in pairs:\n        buf.append((r, m))\n        Sr += r\n        Sm += m\n        Smm += m * m\n        Srm += r * m\n        if len(buf) > K:\n            r0, m0 = buf.pop(0)\n            Sr -= r0\n            Sm -= m0\n            Smm -= m0 * m0\n            Srm -= r0 * m0\n        if len(buf) == K:\n            cov = K * Srm - Sr * Sm\n            varm = K * Smm - Sm * Sm\n            if varm == 0:\n                out.append(\"nan\")\n            else:\n                g = math.gcd(abs(cov), abs(varm))\n                out.append(f\"{cov//g}/{varm//g}\")\n\n    sys.stdout.write(\"\\n\".join(out))\n\nsolve()\n",
      test_cases: [
        { input: "3\n1 1\n2 1\n3 2\n4 2\n", expected: "2/1\n2/1" },
        { input: "2\n1 0\n2 0\n3 0\n", expected: "nan\nnan", hidden: true },
        { input: "3\n1 1\n1 2\n1 3\n1 4\n", expected: "0/1\n0/1", hidden: true },
      ],
      time_limit_ms: 3500,
      memory_limit_mb: 256,
    },
  },
  {
    slug: "twap-from-quotes",
    topic: "Algorithms",
    track: "dev",
    title: "TWAP From Timestamped Quotes (Exact Fraction)",
    prompt_md:
      "Compute the time-weighted average price (TWAP) from timestamped quotes.\n\nAssume price is piecewise-constant: quote i sets price p_i for the interval [t_i, t_{i+1}).\n\nInput:\n- Line 1: integer n (n>=2)\n- Next n lines: `t p` (integers), timestamps strictly increasing\n\nOutput:\n- TWAP over [t_0, t_{n-1}) as reduced fraction `A/B`.\n\nExample:\nInput:\n```\n3\n0 100\n2 110\n5 90\n```\nOutput:\n```\n104/1\n```\n(because 100 for 2s and 110 for 3s => (200+330)/5=106; wait: interval is [0,5): 100*2 + 110*3 = 530; 530/5=106)",
    solution_md:
      "Compute total time T = t_{n-1} - t_0 and weighted sum = Σ p_i * (t_{i+1}-t_i) for i=0..n-2. Output weighted_sum / T reduced by gcd.",
    answer_kind: "code",
    difficulty: 3,
    tags: ["time-series", "fractions", "applications"],
    companies: ["Optiver", "IMC"],
    source: "Execution analytics primitive",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\nimport math\n\ndef solve():\n    lines = [ln.strip() for ln in sys.stdin.read().splitlines() if ln.strip()]\n    if not lines:\n        return\n    n = int(lines[0])\n    tp = [tuple(map(int, ln.split())) for ln in lines[1:1+n]]\n\n    t0 = tp[0][0]\n    t_last = tp[-1][0]\n    T = t_last - t0\n    weighted = 0\n    for i in range(n - 1):\n        t_i, p_i = tp[i]\n        t_next, _ = tp[i + 1]\n        weighted += p_i * (t_next - t_i)\n\n    g = math.gcd(abs(weighted), abs(T))\n    sys.stdout.write(f\"{weighted//g}/{T//g}\")\n\nsolve()\n",
      test_cases: [
        { input: "3\n0 100\n2 110\n5 90\n", expected: "106/1" },
        { input: "2\n0 5\n10 5\n", expected: "5/1", hidden: true },
      ],
      time_limit_ms: 2000,
      memory_limit_mb: 128,
    },
  },
  {
    slug: "ewma-volatility",
    topic: "Algorithms",
    track: "dev",
    title: "EWMA Volatility (Streaming) — Exact Fractions",
    prompt_md:
      "Compute EWMA volatility of returns using exact arithmetic.\n\nGiven returns r_t (integers) and \\(\\alpha=p/q\\), define the EWMA of squared returns:\n- v_0 = r_0^2\n- v_t = \\alpha r_t^2 + (1-\\alpha) v_{t-1}\n\nOutput v_t as reduced fraction `A/B` for each t.\n\nInput:\n- Line 1: p q (alpha=p/q)\n- Line 2: n\n- Next n lines: r_t (integer)\n\nExample:\nInput:\n```\n1 2\n3\n2\n0\n2\n```\nOutput:\n```\n4/1\n2/1\n3/1\n```",
    solution_md:
      "Same as EWMA but with x=r^2. Maintain v as rational num/den and update with integer arithmetic, reducing each step.",
    answer_kind: "code",
    difficulty: 4,
    tags: ["streaming", "fractions", "risk"],
    companies: ["Two Sigma", "Citadel"],
    source: "Risk metric primitive",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\nimport math\n\ndef solve():\n    lines = [ln.strip() for ln in sys.stdin.read().splitlines() if ln.strip()]\n    if not lines:\n        return\n    p, q = map(int, lines[0].split())\n    g = math.gcd(p, q)\n    p //= g\n    q //= g\n    n = int(lines[1])\n    rs = [int(x) for x in lines[2:2+n]]\n\n    out = []\n    num = rs[0] * rs[0]\n    den = 1\n    out.append(f\"{num}/{den}\")\n\n    for r in rs[1:]:\n        x = r * r\n        new_num = p * x * den + (q - p) * num\n        new_den = q * den\n        gg = math.gcd(abs(new_num), new_den)\n        num = new_num // gg\n        den = new_den // gg\n        out.append(f\"{num}/{den}\")\n\n    sys.stdout.write(\"\\n\".join(out))\n\nsolve()\n",
      test_cases: [
        { input: "1 2\n3\n2\n0\n2\n", expected: "4/1\n2/1\n3/1" },
        { input: "1 1\n2\n-3\n3\n", expected: "9/1\n9/1", hidden: true },
      ],
      time_limit_ms: 2500,
      memory_limit_mb: 128,
    },
  },
  {
    slug: "stable-softmax",
    topic: "Algorithms",
    track: "dev",
    title: "Stable Softmax",
    prompt_md:
      "Compute softmax probabilities stably.\n\nGiven logits x_i, softmax is:\n\\[p_i = \\frac{e^{x_i}}{\\sum_j e^{x_j}}\\]\n\nInput:\n- Line 1: n\n- Line 2: n floats\n\nOutput:\n- Print n probabilities with 6 decimals, space-separated.\n\nExample:\nInput:\n```\n3\n1000 1000 1000\n```\nOutput:\n```\n0.333333 0.333333 0.333333\n```",
    solution_md:
      "Use stabilization: subtract max m from all logits. Compute exp(x_i-m), sum, then divide. This prevents overflow/underflow.",
    answer_kind: "code",
    difficulty: 3,
    tags: ["numerical-stability", "math"],
    companies: ["Two Sigma", "Jane Street"],
    source: "Numerical computing staple",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\nimport math\n\ndef solve():\n    data = sys.stdin.read().strip().split()\n    if not data:\n        return\n    n = int(data[0])\n    xs = list(map(float, data[1:1+n]))\n    m = max(xs)\n    exps = [math.exp(x - m) for x in xs]\n    s = sum(exps)\n    ps = [e / s for e in exps]\n    sys.stdout.write(' '.join(f\"{p:.6f}\" for p in ps))\n\nsolve()\n",
      test_cases: [
        { input: "3\n1000 1000 1000\n", expected: "0.333333 0.333333 0.333333" },
        { input: "2\n0 0\n", expected: "0.500000 0.500000", hidden: true },
        { input: "2\n0 1000\n", expected: "0.000000 1.000000", hidden: true },
      ],
      time_limit_ms: 2000,
      memory_limit_mb: 128,
    },
  },
  {
    slug: "rolling-max-drawdown-duration",
    topic: "Algorithms",
    track: "dev",
    title: "Max Drawdown Duration",
    prompt_md:
      "Given a time series of prices, compute the maximum drawdown *duration*.\n\nDefine a drawdown period as time spent below the previous running peak. The drawdown duration ends when a new peak is reached.\n\nInput:\n- Line 1: n\n- Line 2: space-separated positive integers (prices)\n\nOutput:\n- Print the maximum drawdown duration as an integer number of steps.\n\nExample:\nInput:\n```\n7\n100 120 90 110 80 130 125\n```\nOutput:\n```\n3\n```\n(peak 120 at t=1, underwater at t=2..4 until new peak 130 at t=5 => duration 3)",
    solution_md:
      "Track running peak and the index when it occurred. When price >= peak, reset peak and peak index. When price < peak, current drawdown duration is i - peak_idx; track max.",
    answer_kind: "code",
    difficulty: 2,
    tags: ["time-series", "streaming"],
    companies: ["Optiver", "IMC"],
    source: "Risk metric primitive",
    answer_meta: {
      language: "python",
      starter_code:
        "import sys\n\ndef solve():\n    data = sys.stdin.read().strip().split()\n    if not data:\n        return\n    n = int(data[0])\n    ps = list(map(int, data[1:1+n]))\n    peak = ps[0]\n    peak_idx = 0\n    best = 0\n    for i in range(1, n):\n        p = ps[i]\n        if p >= peak:\n            peak = p\n            peak_idx = i\n        else:\n            best = max(best, i - peak_idx)\n    sys.stdout.write(str(best))\n\nsolve()\n",
      test_cases: [
        { input: "7\n100 120 90 110 80 130 125\n", expected: "3" },
        { input: "3\n1 2 3\n", expected: "0", hidden: true },
        { input: "4\n10 9 8 7\n", expected: "3", hidden: true },
      ],
      time_limit_ms: 2000,
      memory_limit_mb: 128,
    },
  },
];
