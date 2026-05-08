# QPrep — Design Phase Tracker

> **Purpose:** Single source of truth for "what's done / what's next." Read this first before starting work. Update it as you ship.
>
> **Last updated:** 2026-05-08
> **Current phase:** Phase 2 (in progress — auto-advance shipped)
> **Next action:** Implement `/today` question-of-the-day.

---

## TL;DR for Claude

If you're picking up this project cold, here's what you need to know:

- Phase 1 (content + schema) is **done**. 633 questions live in Supabase across 11 topics, 0 Finance.
- Phase 1.5 (home page redesign) shipped as a side quest.
- Phase 2 (retention features) is **in progress**: Vercel env vars are now set, and **auto-advance has shipped**. Next up: `/today`.
- Phase 3 (onboarding + auth + social) hasn't started.
- **Do not** start Phase 3 work. **Do not** add new content topics. **Do** work down the Phase 2 checklist in order.

---

## Conventions (read before editing code)

- **Question schema:** `content/question-types.ts`. `target_roles: ('Trader' | 'Dev' | 'Researcher' | 'All')[]`.
- **Topics allowed:** Statistics, Probability, Systems, Pure Math, C++ Deep Dives, Brainteasers, Algorithms, Concurrency, System Design, LLD, Data Structures. **No Finance.** Constraint enforced in migration `0004`.
- **Seed bundle vs DB:** `content/seed/*` is the source of truth for questions. `npm run seed` pushes to Supabase. The app reads from Supabase when env vars are present, falls back to the bundle otherwise.
- **Migrations:** in `supabase/migrations/`. Apply with `supabase db push`. Never edit an applied migration — write a new one.
- **Tests:** `npx vitest run` (54 currently passing). `npx tsc --noEmit` must be clean. `npm run build` must pass.
- **Multi-provider AI pattern:** `lib/grade-freeform.ts` is the reference shape (groq / anthropic / ollama / keyword fallback). New AI features should follow it.

---

## Blockers

_None right now._ Vercel env vars are set and prod hits Supabase.

---

## Phase 1 — Content + daily drill mode

**Status:** ✅ Operationally complete.

### Done
- [x] Cleanup: Finance + trivia removed (migration `0003`, 9 questions deleted, topic constraint tightened, `quant-trader-core` + `quant-dev-core` playlists deleted).
- [x] Schema: `target_roles text[]` column with check constraint (migration `0003`). Type added to `content/question-types.ts`. `inferTargetRolesFromTopic()` fallback. 557/633 carry explicit value, rest get topic defaults via seed script.
- [x] Researcher wave packs: Probability (100), Statistics (140), Pure Math (60), Brainteasers (42), Stochastic + Time Series + ML in own seed files. Mosteller / Stat 110 / Jane Street style with rubrics on freeform.
- [x] Dev wave packs: Systems (67), C++ Deep Dives (60), Concurrency (37), Algorithms (41), Data Structures (28), LLD (30), System Design (30). Migration `0004` extended topic constraint.
- [x] `/mental-math` mode: `app/mental-math/page.tsx` + client-side generator in `lib/mental-math.ts` (173 lines, no DB rows).
- [x] Playlists rework: 6 playlists (`warmup-quickstart`, `researcher-foundations`, `researcher-advanced`, `quant-dev-essentials`, `quant-dev-low-latency-core`, `top-50`). No trader/options playlist.
- [x] Verification: 54 vitest tests pass, `tsc --noEmit` clean, `build` clean, migrations `0003` + `0004` applied to remote, `npm run seed` populated 633 questions + 6 playlists, 2 orphan `mental-math-*` rows cleaned. DB exactly matches seed bundle.

### Final numbers (verified live in Supabase)
- 633 questions, 11 topics: Statistics 140, Probability 100, Systems 67, Pure Math 60, C++ Deep Dives 60, Brainteasers 42, Algorithms 41, Concurrency 37, System Design 30, LLD 30, Data Structures 28.
- 0 Finance. `target_roles` populated on every row. 6 playlists in DB matching code.

### Open gaps (accepted, not blockers)
- [ ] **Content-quality CI signal.** `seed-integrity.test.ts` checks structure (slugs, kinds, MCQ has-correct) but not *quality*. With 633 questions, no automated guardrail against drift. Note: `content/seed/seed-quality.test.ts` is currently uncommitted — see if it covers this.

---

## Phase 1.5 — UX changes (out-of-plan, shipped this session)

- [x] **Home page redesign** (`app/page.tsx`) with `hasAttempts` branch:
  - Returning: welcome strip (streak/points), "Pick up where you left off", "Your playlists" grid (`solved/total` + progress bars), topics strip.
  - First-time: trimmed hero, 3 CTAs, featured playlists, topics strip.
  - Driven by single `loadHomeData(anonId)` loader in `lib/home-data.ts`.
- [x] `pickNextUnsolved` helper + 5 vitest cases — picks highest-progress incomplete playlist's first unsolved.
- [x] Primary button dark-mode contrast bug fixed (`text-bg` instead of `text-white`).
- [x] Snapshot script `scripts/snap.sh` — headless Chrome captures of 5 routes → `.ui-snapshots/` (gitignored).

---

## Phase 2 — Retention + cost (in progress, blocked)

**Ship order: smallest first. All depend on Vercel env vars being set.**

- [x] **Auto-advance after correct submission.** Inbound links carry `?from=playlist:<slug>`. After a correct answer, the four answer forms render a primary "Next in <playlist>" CTA that auto-focuses (Enter advances). Falls back to a global pick when the playlist is exhausted or no `from` is present.
  - **Touch points:** `lib/next-question.ts` (helper + `parseFromParam` + `computeNext`), `lib/next-question.test.ts` (6 cases), `app/questions/[slug]/page.tsx` (reads `searchParams.from`, computes `nextHref` server-side), `components/answer/AnswerSwitch.tsx` + `Numeric/McqFreeform/Code` forms (props threaded through), `components/answer/NextQuestionCTA.tsx` (auto-focus + prefetch), `components/QuestionTable.tsx` (`linkSuffix`), `app/playlists/[slug]/page.tsx` + `app/page.tsx` (pass playlist context).
- [ ] **`/today` question-of-the-day.** One researcher + one dev question per day, deterministic by date (same for everyone).
  - **Effort:** ~1 day. **Payoff:** habit formation; the hook the home redesign implies.
  - **Touch points:** new route `app/today/page.tsx`; deterministic picker keyed by `YYYY-MM-DD`.
- [ ] **Multi-provider Nudge Engine.** Move `app/api/nudge/route.ts` to the `grade-freeform.ts` pattern (groq / anthropic / ollama / keyword). Default to Groq/Haiku to cut cost.
  - **Effort:** ~1 day. **Payoff:** cost reduction before traffic grows.
  - **Note:** `lib/nudge-engine.ts` is currently uncommitted — check if work has started.
- [ ] **Spaced-repetition resurfacing.** "You missed these N days ago — retry." Pick K oldest wrong-answer questions from N days ago.
  - **Effort:** 1–2 days. **Touch points:** small scheduling layer on top of `attempts` table.
- [ ] **Per-topic mastery bars on homepage.** Data already exists in `anon_users.topic_levels`.
  - **Effort:** ~half a day. **Touch points:** UI in `app/page.tsx` + query in `loadHomeData`.

---

## Phase 3 — Onboarding + social (not started, do not start)

- [ ] **60-second diagnostic.** ~10 quick questions across topics → routes user to a starter playlist. Leans on `topic_levels`.
- [ ] **Real auth via Supabase Auth.** `anon_users.id` is already a UUID — rename + Supabase Auth wiring, not an identity rewrite. Migration would attach `user_id` to existing anon rows on first sign-in.
- [ ] **Leaderboards, payments, sharing.** Social proof + monetization + virality.

---

## Suggested order from here

1. ✅ **Vercel env vars** — done.
2. ✅ **Auto-advance** — shipped (63/63 tests, build clean).
3. ▶ **`/today`** (Phase 2). Habit-forming hook the home redesign implies.
4. **Multi-provider nudge** (Phase 2). Cost reduction; not user-visible but matters before traffic grows.
5. **Spaced rep + mastery bars** (Phase 2). Round out retention.
6. **Phase 3** only after Phase 2 actually works in prod.

---

## How to update this doc

- Tick checkboxes (`- [ ]` → `- [x]`) the moment a thing ships, not at the end of a session.
- When you change phase, update the **Current phase** + **Next action** lines at the top.
- New blockers go in **§ Blockers** with a one-line "why it matters" so future-you/Claude doesn't have to reconstruct it.
- New conventions go in **§ Conventions** — that section is what Claude reads before editing code.
- Don't delete completed items; they're the audit trail. Move them under the phase's **Done** subsection.
