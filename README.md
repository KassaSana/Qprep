# QPrep

An agent-first quant interview practice site. The current build ships two
tracks:

- **Quant Researcher**: probability and stochastic problems
- **Quant Trader**: expected-value, market-making intuition, payoffs, and fast
  mental-math prompts

Both use KaTeX-rendered LaTeX, server-side answer validation, and a 3-level
**Agentic Nudge Engine** powered by Claude 4.7 Opus that points at your
specific reasoning gap without revealing the final number.

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS for styling
- KaTeX (`react-katex`) for math rendering
- Supabase Postgres for persistence
- `@anthropic-ai/sdk` (Claude 4.7 Opus) for nudges
- Anonymous cookie sessions in v1 (real auth swappable later)

## Architecture

```
User answer  ─►  /api/check  ─►  Postgres `attempts`
                                     │ wrong
                                     ▼
User clicks "Nudge me" ─►  /api/nudge  ─►  hints_cache hit?
                                              │ no
                                              ▼
                                          Claude 4.7 Opus  ─►  scrubAnswer
                                              │
                                              ▼
                                          hints_cache insert
```

The nudge route enforces a daily per-cookie limit (30 hints/day by default)
and caches every generated hint by `(question_id, normalized_wrong_answer, level)`
so equivalent mistakes don't pay for a second model call.

## Setup

1. **Install deps**

   ```bash
   npm install
   ```

2. **Create a Supabase project** at <https://supabase.com>, then copy
   `.env.local.example` to `.env.local` and fill in:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`

3. **Apply the schema**

   Either via the Supabase SQL editor (paste `supabase/migrations/0001_init.sql`)
   or via the Supabase CLI:

   ```bash
   supabase db push
   ```

4. **Seed the question bank**

   ```bash
   npm run seed
   ```

   This upserts the current researcher and trader problem sets into the
   `questions` table.

5. **Run the app**

   ```bash
   npm run dev
   ```

   Then open <http://localhost:3000>.

   If `.env.local` is still using placeholder values, the app now boots in a
   local preview mode: the Researcher and Trader tracks read from the built-in
   seed bank,
   stores progress in memory, and serves deterministic fallback nudges so you
   can explore the full flow before wiring real services.

## Tests

```bash
npm test
```

Covers `lib/answer-check.ts` — numeric tolerance, fraction/decimal/percent
equivalence, exact string normalization, and stable error signatures.

## Project layout

```
app/
  page.tsx                       # track picker
  researcher/page.tsx            # question list + streak/points dashboard
  researcher/q/[slug]/page.tsx   # question view with KaTeX + AnswerForm
  trader/page.tsx                # trader list + streak/points dashboard
  trader/q/[slug]/page.tsx       # trader question view with KaTeX + AnswerForm
  api/check/route.ts             # validate answer + log attempt + award points
  api/nudge/route.ts             # 3-level Claude hint with cache + rate limit
components/
  Latex.tsx                      # KaTeX-aware mixed-content renderer
  AnswerForm.tsx                 # client form, streak refresh, solution toggle
  NudgePanel.tsx                 # 3-level escalating hint UI
  ui/{button,input}.tsx
content/
  researcher-seed.ts             # typed probability / stochastic fixtures
  trader-seed.ts                 # typed trader EV / payoff / mental-math fixtures
  question-types.ts              # shared SeedQuestion / Track types
lib/
  anon.ts                        # getAnonId() helper for cookie session
  answer-check.ts                # numeric/fraction/exact validator
  anthropic.ts                   # Claude client + scrubAnswer()
  local-dev.ts                   # in-memory local preview bank + progress store
  supabase/{server,client}.ts
proxy.ts                         # Next.js 16 proxy: sets `qprep_anon` cookie
scripts/
  seed-researcher.ts             # `npm run seed`
  mutate.ts                      # v1 stub — Claude-driven question variants
supabase/
  migrations/0001_init.sql
```

## Roadmap (out of scope for v1)

- Real auth (Supabase Auth) — `anon_users.id` is a UUID so the migration is a
  rename, not a rewrite.
- Quant Trader Rapid Fire mode — sub-10ms timer and hot-loop drills (separate
  from the current trader problem bank).
- Quant Dev (SWE) track — algorithmic prompts.
- Question mutation pipeline — Claude-driven variants of seed problems so users
  can't memorize an answer key from a PDF.
- Leaderboards, payments, social.

## Operational notes

- The Anthropic model name lives in `ANTHROPIC_MODEL` (default `claude-opus-4-7`)
  — bump it when a newer Opus ships.
- Hint generations are cached forever; if the system prompt changes
  meaningfully, truncate `hints_cache` so users get the new style.
- The `bump_nudge_usage` SQL function and a per-cookie 30/day cap protect
  against API-cost surprises. Tune the constant in `app/api/nudge/route.ts`.
