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
];
