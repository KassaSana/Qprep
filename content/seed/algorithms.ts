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
];
