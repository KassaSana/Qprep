# QPrep — Design Phase Tracker

> **Purpose:** Single source of truth for "what's done / what's next." Read this first before starting work. Update it as you ship.
>
> **Last updated:** 2026-05-10 (later that day)
> **Current phase:** Phase 2 (✅ code-complete — all 5 retention items implemented in the working tree; not yet committed/deployed)
> **Next action:** Commit + deploy the Phase 2 work, then Phase 3 prep (60-second diagnostic) **only after** Phase 2 has bake time in prod.

---

## TL;DR for Claude

If you're picking up this project cold, here's what you need to know:

- Phase 1 (content + schema) is **done and in prod**. 633 questions live in Supabase across 11 topics, 0 Finance. Content-quality CI signal landed too (`content/seed/seed-quality.test.ts`).
- Phase 1.5 (home page redesign) is **done and in prod** (committed in an earlier session).
- Phase 2 (retention + cost) is **code-complete in the working tree** but **not yet committed by the owner**: Vercel env vars set + auto-advance + multi-provider nudge engine were already in prior commits; `/today`, per-topic mastery bars, and spaced-repetition resurfacing are uncommitted local edits awaiting the owner's review.
- Phase 3 (onboarding + auth + social) hasn't started.
- **Never run git on this repo.** Commits are the owner's job. **Do not** start Phase 3 work yet. **Do not** add new content topics. **Do** validate Phase 2 in prod (after the owner commits + deploys) before opening Phase 3.

---

## Verified state at this update

Snapshot from the full project sweep on 2026-05-10 after the Phase 2 code push. Trust this if the **Last updated** date above is recent; otherwise re-verify before relying on it.

- ✅ `npm test` → **87 passing across 13 files** (vitest 4.1.5, ~0.9s). Up from 63/11 at the start of this session.
- ✅ `npx tsc --noEmit` → clean.
- ✅ `npm run build` → clean. Routes built: `/`, `/today`, `/mental-math`, `/playlists`, `/playlists/[slug]`, `/questions`, `/questions/[slug]`, `/api/check`, `/api/nudge`, `/api/run-code`.
- ✅ Seed bundle resolves to **633 questions** matching the canonical breakdown below.
- ✅ `content/seed/seed-quality.test.ts` and `lib/nudge-engine.ts` were already committed earlier and still pass.
- 🟡 Uncommitted in working tree this session (owner reviews + commits manually): `lib/today.ts` + `lib/today.test.ts` (new), `lib/spaced-rep.ts` + `lib/spaced-rep.test.ts` (new), `app/today/page.tsx` (new), edits to `lib/home-data.ts`, `lib/home-data.test.ts`, `lib/questions-data.ts`, `app/page.tsx`, `components/SiteHeader.tsx`, and this file.

---

## Conventions (read before editing code)

- **Question schema:** `content/question-types.ts`. `target_roles: ('Trader' | 'Dev' | 'Researcher' | 'All')[]`.
- **Topics allowed:** Statistics, Probability, Systems, Pure Math, C++ Deep Dives, Brainteasers, Algorithms, Concurrency, System Design, LLD, Data Structures. **No Finance.** Constraint enforced in migration `0004`.
- **Seed bundle vs DB:** `content/seed/*` is the source of truth for questions. `npm run seed` pushes to Supabase. The app reads from Supabase when env vars are present, falls back to the bundle otherwise.
- **Migrations:** in `supabase/migrations/`. Apply with `supabase db push`. Never edit an applied migration — write a new one.
- **Git is the owner's job — never run `git add`, `git commit`, `git push`, or any git command.** Edit files; the owner reviews and commits.
- **Tests:** `npx vitest run` (87 currently passing across 13 files). `npx tsc --noEmit` must be clean. `npm run build` must pass.
- **Multi-provider AI pattern:** `lib/grade-freeform.ts` is the reference shape (groq / anthropic / ollama / keyword fallback). `lib/nudge-engine.ts` follows the same shape. New AI features should follow it too.
- **Topic ↔ seed-file mapping:** seed files `machine_learning.ts` and `time_series.ts` set `topic: "Statistics"`; `stochastic.ts` sets `topic: "Probability"`. There is no "Machine Learning" / "Time Series" / "Stochastic" topic in the enum. If you add new role-flavored content, pick from the 11 topics in `Topic` (`content/question-types.ts`).

---

## Blockers

_None right now._ Vercel env vars are set and prod hits Supabase.

---

## Phase 1 — Content + daily drill mode

**Status:** ✅ Operationally complete.

### Done
- [x] Cleanup: Finance + trivia removed (migration `0003`, 9 questions deleted, topic constraint tightened, `quant-trader-core` + `quant-dev-core` playlists deleted).
- [x] Schema: `target_roles text[]` column with check constraint (migration `0003`). Type added to `content/question-types.ts`. `inferTargetRolesFromTopic()` fallback. 557/633 carry explicit value, rest get topic defaults via seed script.
- [x] Researcher wave packs: Probability (100), Statistics (140), Pure Math (60), Brainteasers (40). Stochastic, Time Series, and ML live in their own seed files but tag in as `Probability` / `Statistics` topics. Mosteller / Stat 110 / Jane Street style with rubrics on freeform.
- [x] Dev wave packs: Systems (67), C++ Deep Dives (60), Concurrency (37), Algorithms (41), Data Structures (28), LLD (30), System Design (30). Migration `0004` extended topic constraint.
- [x] `/mental-math` mode: `app/mental-math/page.tsx` + client-side generator in `lib/mental-math.ts` (173 lines, no DB rows).
- [x] Playlists rework: 6 playlists (`warmup-quickstart`, `researcher-foundations`, `researcher-advanced`, `quant-dev-essentials`, `quant-dev-low-latency-core`, `top-50`). No trader/options playlist.
- [x] Verification: 87 vitest tests pass, `tsc --noEmit` clean, `build` clean, migrations `0003` + `0004` applied to remote, `npm run seed` populated 633 questions + 6 playlists, 2 orphan `mental-math-*` rows cleaned. DB exactly matches seed bundle.
- [x] **Content-quality CI signal.** `content/seed/seed-quality.test.ts` is **committed and passing** — three guardrails: banned-finance/options term scan, freeform/code prompts and solutions hit a length floor, numeric/fraction/exact rows always carry `answer_value`.

### Final numbers (verified live in Supabase + bundle on 2026-05-10)
- 633 questions, 11 topics: Statistics 140, Probability 100, Systems 67, C++ Deep Dives 60, Pure Math 60, Algorithms 41, Brainteasers 40, Concurrency 37, LLD 30, System Design 30, Data Structures 28.
- 0 Finance. `target_roles` populated on every row. 6 playlists in DB matching code.

### Open gaps (accepted, not blockers)
_None. Phase 1's content-quality CI gap is closed by `seed-quality.test.ts`._

---

## Phase 1.5 — UX changes (out-of-plan; committed in an earlier session)

- [x] **Home page redesign** (`app/page.tsx`) with `hasAttempts` branch:
  - Returning: welcome strip (streak/points), "Pick up where you left off", "Your playlists" grid (`solved/total` + progress bars), topics strip.
  - First-time: trimmed hero, 3 CTAs, featured playlists, topics strip.
  - Driven by single `loadHomeData(anonId)` loader in `lib/home-data.ts`.
- [x] `pickNextUnsolved` helper + 5 vitest cases — picks highest-progress incomplete playlist's first unsolved.
- [x] Primary button dark-mode contrast bug fixed (`text-bg` instead of `text-white`).
- [x] Snapshot script `scripts/snap.sh` — headless Chrome captures of 5 routes → `.ui-snapshots/` (gitignored).

---

## Phase 2 — Retention + cost (✅ code-complete; awaiting owner commit + deploy)

**Ship order: smallest first. All depend on Vercel env vars being set (done).**

### Done
- [x] **Auto-advance after correct submission.** Inbound links carry `?from=playlist:<slug>`. After a correct answer, the four answer forms render a primary "Next in <playlist>" CTA that auto-focuses (Enter advances). Falls back to a global pick when the playlist is exhausted or no `from` is present.
  - **Touch points:** `lib/next-question.ts` (helper + `parseFromParam` + `computeNext`), `lib/next-question.test.ts` (4 cases), `app/questions/[slug]/page.tsx` (reads `searchParams.from`, computes `nextHref` server-side), `components/answer/AnswerSwitch.tsx` + `Numeric/Mcq/Freeform/Code` forms (props threaded through), `components/answer/NextQuestionCTA.tsx` (auto-focus + prefetch), `components/QuestionTable.tsx` (`linkSuffix`), `app/playlists/[slug]/page.tsx` + `app/page.tsx` (pass playlist context).
- [x] **Multi-provider Nudge Engine.** `lib/nudge-engine.ts` is committed and wired into `app/api/nudge/route.ts` on both the Supabase path and the local-dev path. Provider order: groq → anthropic → ollama → keyword fallback. `NUDGE_PROVIDER` / `NUDGE_MODEL` / `GROQ_API_KEY` / `OLLAMA_URL` env vars all honored. Mirrors `lib/grade-freeform.ts` exactly. Defaults to `llama-3.3-70b-versatile` on Groq when `GROQ_API_KEY` is set, falling back to Anthropic, then Ollama, then a deterministic keyword hint that always passes `scrubAnswer()`.
- [x] **`/today` question-of-the-day.** One Researcher + one Dev question per day, deterministic by UTC date so users worldwide share the same pair.
  - **Touch points:** `lib/today.ts` (`pickTodayQuestion`, `pickTodayPair`, `dateKeyFor` — FNV-1a hash on `${dateKey}:${role}` modulo a slug-sorted candidate pool, so adding a question never shuffles yesterday's pick), `lib/today.test.ts` (10 cases), `app/today/page.tsx` (server component with status pill — `New` / `In progress` / `✓ Solved` per card), `components/SiteHeader.tsx` (added a "Today" nav item), `app/page.tsx` (welcome strip primary link + first-time hero CTA).
  - **Quality filter:** difficulty 2–4 only, no `mental-math`-tagged rows, falls back to the unfiltered role pool defensively.
- [x] **Per-topic mastery bars on home.** `anon_users.topic_levels jsonb` (bumped by `award_correct_v2` since migration `0002`) now surfaces in the UI for the first time.
  - **Touch points:** `HomeProfile.topicLevels` added to `lib/home-data.ts` (Supabase select includes `topic_levels`; local-dev path reads `getLocalProfile`); `normalizeTopicLevels` defensively coerces jsonb (drops unknown keys, floors numbers); `topicMasteryBars(profile.topicLevels, limit)` returns sorted bar data normalized against `MAX_DISPLAY_LEVEL = 10`; `app/page.tsx` renders a `MasterySection` card grid linking each bar to `/questions?topic=…`. Tests: 4 cases in `lib/home-data.test.ts`.
- [x] **Spaced-repetition resurfacing.** "You missed these N days ago — retry." Up to 5 questions the user fumbled at least 3 days ago and never came back to solve.
  - **Touch points:** `lib/spaced-rep.ts` (`pickResurfaced(attempts, options)` — pure reducer that drops ever-solved questions, drops too-recent wrongs, sorts oldest-first with `wrongAttemptCount` tie-break), `lib/spaced-rep.test.ts` (10 cases), extended `AttemptStat.created_at` in `lib/questions-data.ts` (and the Supabase select string), `loadHomeData` builds `HomeData.resurface: HomeResurface[]` via a `byId` map, `app/page.tsx` renders a `ResurfaceSection` row list above the mastery section.

---

## Phase 3 — Onboarding + social (not started, do not start)

- [ ] **60-second diagnostic.** ~10 quick questions across topics → routes user to a starter playlist. Leans on `topic_levels`.
- [ ] **Real auth via Supabase Auth.** `anon_users.id` is already a UUID — rename + Supabase Auth wiring, not an identity rewrite. Migration would attach `user_id` to existing anon rows on first sign-in.
- [ ] **Leaderboards, payments, sharing.** Social proof + monetization + virality.

---

## Suggested order from here

Phase 2 code is in the working tree. Owner-only steps next:

1. **Owner: review the diff** (`git status` / `git diff`) and commit the Phase 2 work yourself when satisfied. The agent never touches git.
2. **Owner: deploy to Vercel** so prod actually runs the new home page + `/today`.
3. **Watch retention signal in prod.** Day-2 / day-7 return rate, % of returning users that hit `/today`, % of `Resurface` clicks that turn into a correct re-solve. If those numbers are flat, Phase 2 didn't work and Phase 3 won't fix it.
4. **Tune the spaced-rep parameters** if `Resurface` engagement is low: `minDaysOld` (currently 3) and `limit` (currently 5) in `lib/spaced-rep.ts` are the obvious knobs.
5. **Then Phase 3 in this order:**
   - 60-second diagnostic — biggest UX lever (it routes new users into the right playlist using `topic_levels` we now surface).
   - Real auth via Supabase Auth — `anon_users.id` is already a UUID; this is wiring, not an identity rewrite.
   - Leaderboards / payments / sharing — only when there's a steady-state user base to share with.

---

## How to update this doc

- Tick checkboxes (`- [ ]` → `- [x]`) the moment a thing ships, not at the end of a session.
- When you change phase, update the **Current phase** + **Next action** lines at the top.
- New blockers go in **§ Blockers** with a one-line "why it matters" so future-you/Claude doesn't have to reconstruct it.
- New conventions go in **§ Conventions** — that section is what Claude reads before editing code.
- Don't delete completed items; they're the audit trail. Move them under the phase's **Done** subsection.
