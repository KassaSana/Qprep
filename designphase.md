# QPrep — Design Phase Tracker

> **Purpose:** Single source of truth for "what's done / what's next." Read this first before starting work. Update it as you ship.
>
> **Last updated:** 2026-05-10 (post diagnostic-progress persistence — refresh-safe with TTL + content-drift guard)
> **Current phase:** Phase 3 (🟡 in progress — diagnostic done + now refresh-safe; auth slice 1 done; analytics + mental-math session events wired; SEO + sitemap + robots done; auth slice 2 + leaderboards remaining)
> **Next action:** Owner reviews/commits the working tree, applies migration `0005`, picks an analytics provider, picks an auth UX.

---

## TL;DR for Claude

If you're picking up this project cold, here's what you need to know:

- Phase 1 (content + schema) is **done and in prod**. 633 questions live in Supabase across 11 topics, 0 Finance. Content-quality CI signal landed too (`content/seed/seed-quality.test.ts`).
- Phase 1.5 (home page redesign) is **done and in prod** (committed in an earlier session).
- Phase 2 (retention + cost) is **code-complete in the working tree** but **not yet committed by the owner**: Vercel env vars set + auto-advance + multi-provider nudge engine were already in prior commits; `/today`, per-topic mastery bars, and spaced-repetition resurfacing are uncommitted local edits awaiting the owner's review.
- Phase 3 item 1 (60-second diagnostic) is also **code-complete in the working tree** — owner directed the agent to push forward despite the original "wait for Phase 2 in prod" guidance. Now also **refresh-safe**: in-flight answers persist to localStorage with a 24h TTL and content-drift guard, so a tab close or page refresh mid-flow no longer dumps progress.
- Phase 3 item 2 (real auth) is **slice 1 of N done in the working tree**. Slice 1 = identity abstraction + opt-in migration `0005`, behavior-neutral while `NEXT_PUBLIC_AUTH_ENABLED !== "true"`. Slice 2 = sign-in UI + post-sign-in linking. Slice 3 = data merge for users who had anon attempts before signing in.
- **Analytics scaffolding** (out-of-band but blocked everything in "Suggested order from here") is **code-complete in the working tree**: typed event catalogue, provider abstraction (default: console in dev, noop in prod), wired across routes, diagnostic, resurface, `/api/check`, `/api/nudge`, and **mental-math session completion**. Owner picks a real provider (PostHog / Vercel Analytics / Plausible / etc.) when ready — the swap is one file.
- Phase 3 item 3 (leaderboards/payments/sharing) hasn't started.
- **Never run git on this repo.** Commits are the owner's job. **Do not** add new content topics.

---

## Verified state at this update

Snapshot from the full project sweep on 2026-05-10 after the Phase 2 + Phase 3 (diagnostic) code push. Trust this if the **Last updated** date above is recent; otherwise re-verify before relying on it.

- ✅ `npm test` → **140 passing across 18 files** (vitest 4.1.5, ~1.5s). Up from 121/17, 120/17, 119/17, 117/17, 108/16, 101/15, 87/13, 63/11 across the session.
- ✅ `npx tsc --noEmit` → clean.
- ✅ `npm run build` → clean. Routes built: `/`, `/today`, `/diagnostic`, `/mental-math`, `/playlists`, `/playlists/[slug]`, `/questions`, `/questions/[slug]`, `/api/check`, `/api/nudge`, `/api/run-code`, `/robots.txt`, `/sitemap.xml`.
- ✅ Seed bundle resolves to **633 questions** matching the canonical breakdown below.
- ✅ Diagnostic guard test (`content/diagnostic.test.ts`) confirms all 10 diagnostic slugs resolve to MCQs in the live bundle with valid `answer_value` wiring.
- 🟡 Uncommitted in working tree across this session (owner reviews + commits manually):
  - **Phase 2:** `lib/today.ts` + `lib/today.test.ts`, `lib/spaced-rep.ts` + `lib/spaced-rep.test.ts`, `app/today/page.tsx`, edits to `lib/home-data.ts`, `lib/home-data.test.ts`, `lib/questions-data.ts`, `app/page.tsx`, `components/SiteHeader.tsx`.
  - **Phase 3 item 1:** `content/diagnostic.ts` + `content/diagnostic.test.ts`, `lib/diagnostic.ts` + `lib/diagnostic.test.ts`, `app/diagnostic/page.tsx`, `app/diagnostic/DiagnosticRunner.tsx`, plus a CTA edit on `app/page.tsx`.
  - **Phase 3 item 2 — auth slice 1:** `supabase/migrations/0005_user_identity.sql` (must be applied with `supabase db push` before slice 2), `lib/identity.ts` + `lib/identity.test.ts` (new), `.env.local.example` (added `NEXT_PUBLIC_AUTH_ENABLED=false`).
  - **Analytics scaffolding:** `lib/analytics.ts` + `lib/analytics.test.ts` (new), `components/PageView.tsx` + `components/ResurfaceLink.tsx` + `components/TodayStatusEmitter.tsx` (new), wiring edits to `app/page.tsx`, `app/today/page.tsx`, `app/diagnostic/page.tsx`, `app/diagnostic/DiagnosticRunner.tsx`, `.env.local.example` (added `NEXT_PUBLIC_ANALYTICS_PROVIDER` knob).
  - **Server-side `attempt_submitted` telemetry:** extension to `lib/analytics.ts` (added `attempt_submitted` to the event union with `from?` for activation context) + extra test cases in `lib/analytics.test.ts`; `app/api/check/route.ts` (added `slug` to `QuestionForGrading`, optional `from` to the request body schema, `emitAttemptEvent` helper, three call sites covering Supabase + cached-freeform + main local-dev paths); 4 answer forms (`McqAnswerForm`, `NumericAnswerForm`, `FreeformAnswerForm`, `CodeAnswerForm`) now read `?from=` via `useSearchParams` and forward it in the `/api/check` body; diagnostic CTA links append `?from=diagnostic` for self-documentation.
  - **Route coverage + nudge telemetry:** `lib/analytics.ts` (added `nudge_requested` event with `source: cached|provider|rate_limited|error`); `<PageView>` wired into `app/playlists/page.tsx`, `app/playlists/[slug]/page.tsx`, `app/questions/page.tsx`, `app/questions/[slug]/page.tsx`; `app/mental-math/page.tsx` (client component) gets a one-shot `track('page_viewed', …)` in `useEffect`; `app/api/nudge/route.ts` got an `emitNudgeEvent` helper + 6 call sites covering both code paths × cached / provider / rate-limited / error.
  - **SEO / metadata pass:** refreshed `app/layout.tsx` with `metadataBase` (resolves from `NEXT_PUBLIC_APP_URL` → `VERCEL_URL` → localhost), updated description (was stale — only mentioned probability/stochastic/brainteasers, now reflects the full 11-topic bank), Twitter card config, keywords, robots directives. Per-page `metadata` exports on `/today`, `/diagnostic`, `/playlists`, `/questions`. `generateMetadata` on `/playlists/[slug]` (uses playlist name + description) and `/questions/[slug]` (uses question title + topic + sanitized prompt preview, with markdown/math stripped). New routes `app/sitemap.ts` (645 URLs: 6 static + 6 playlists + 633 questions, well under Google's 50k cap) and `app/robots.ts` (allow all, disallow `/api/`, link to sitemap).
  - **Mental math telemetry + metadata:** `lib/analytics.ts` (`mental_math_session_completed` union branch); `app/mental-math/page.tsx` (`finishSession` with per-run `runIdRef` / `completedRunIdRef` guard so Strict Mode never double-counts; fires on timer expiry and on Stop; payload includes `reason`, `durationSec`, `difficulty`, toggles, `elapsedSeconds`, `attempted`, `correct`, `accuracy`, `streakAtEnd`); `app/mental-math/layout.tsx` (server `metadata` for title/description so the client page keeps SEO without a refactor); `lib/analytics.test.ts` (schema lock test for timer + zero-attempt stop).
  - **Diagnostic progress persistence:** `lib/diagnostic-storage.ts` (new — versioned `qprep:diagnostic:v1` key with 24h TTL, injectable `Storage` for SSR/test safety, validates against the live `DIAGNOSTIC_SLUGS` so a content swap dumps stale state instead of feeding it phantom slugs, plus `resumeIndex` helper) and `lib/diagnostic-storage.test.ts` (19 cases — round-trip, malformed JSON, version mismatch, TTL expiry, content drift, quota-exceeded fail-open, SSR null Storage, resume-index ordering); `app/diagnostic/DiagnosticRunner.tsx` rewired to lazy-init from storage, persist on every pick, clear on completion + restart, suppress `diagnostic_started` on resume so the funnel denominator isn't inflated by refreshes, and surface a "Picking up where you left off — question N of 10. Start over" banner when resumed.
  - This file.

---

## Conventions (read before editing code)

- **Question schema:** `content/question-types.ts`. `target_roles: ('Trader' | 'Dev' | 'Researcher' | 'All')[]`.
- **Topics allowed:** Statistics, Probability, Systems, Pure Math, C++ Deep Dives, Brainteasers, Algorithms, Concurrency, System Design, LLD, Data Structures. **No Finance.** Constraint enforced in migration `0004`.
- **Seed bundle vs DB:** `content/seed/*` is the source of truth for questions. `npm run seed` pushes to Supabase. The app reads from Supabase when env vars are present, falls back to the bundle otherwise.
- **Migrations:** in `supabase/migrations/`. Apply with `supabase db push`. Never edit an applied migration — write a new one.
- **Git is the owner's job — never run `git add`, `git commit`, `git push`, or any git command.** Edit files; the owner reviews and commits.
- **Tests:** `npx vitest run` (140 currently passing across 18 files). `npx tsc --noEmit` must be clean. `npm run build` must pass.
- **Multi-provider AI pattern:** `lib/grade-freeform.ts` is the reference shape (groq / anthropic / ollama / keyword fallback). `lib/nudge-engine.ts` follows the same shape. New AI features should follow it too.
- **Identity:** `lib/anon.ts` is the low-level cookie reader; `lib/identity.ts` is the new abstraction (`getIdentity()`, `getIdentityKey()`, `isAuthEnabled()`). New code that reads who-the-user-is should call `getIdentity()`. Existing call sites can stay on `getAnonId()` until auth slice 2 ships — they're equivalent while the auth flag is off.
- **Analytics:** all telemetry funnels through `track(event)` in `lib/analytics.ts`. Events are typed — new events go in the `AnalyticsEvent` union, not as ad-hoc string names. Default provider is the dev console-logger; prod is no-op until the owner picks one. Pageview emits live in `components/PageView.tsx` and route-specific status emits in `components/TodayStatusEmitter.tsx` / `components/ResurfaceLink.tsx`.
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

## Phase 3 — Onboarding + social (🟡 in progress; item 1 code-complete)

### Done
- [x] **60-second diagnostic.** 10 hand-picked MCQs (Brainteasers 1, Probability 2, Statistics 1, Pure Math 2, Data Structures 2, C++ 1, Concurrency 1) gated to MCQ-only so the "60-second" promise holds. Researcher-vs-Dev lane scoring routes the user to one of `researcher-foundations` / `quant-dev-essentials` / `top-50` / `warmup-quickstart`. **No DB writes in v1** — `topic_levels` keeps accumulating from real attempts only, which means the diagnostic is pure routing and is safe to retake.
  - **Touch points:** `content/diagnostic.ts` (`DIAGNOSTIC_SLUGS` curated list + `DIAGNOSTIC_LENGTH`), `content/diagnostic.test.ts` (3 CI guards: every slug resolves, every slug is MCQ, every MCQ has a valid `answer_value`), `lib/diagnostic.ts` (`summarizeAnswers` per-topic + per-lane reducer, `recommendPlaylist` with `STRONG_FRACTION = 0.7` and `LEAN_MARGIN = 0.2`), `lib/diagnostic.test.ts` (11 cases — empty map, lane fractions, brainteaser-doesn't-count, all four routing branches, the close-call → warmup edge), `app/diagnostic/page.tsx` (server loader: pulls from `loadAllQuestions`, drops non-MCQs defensively, renders an "unavailable" notice if zero resolve), `app/diagnostic/DiagnosticRunner.tsx` (client step-through with auto-advance flash + Restart + result card with per-topic bars + dual CTA into the recommended playlist or `/today`), `app/page.tsx` (first-time hero now leads with `Take the 60-second diagnostic`).
  - **Why MCQ-only:** Algorithms / Systems / LLD / System Design have zero MCQs in the bank. Including numeric/freeform breaks the 60-second promise; signaling those topics indirectly via the Dev lane is an accepted gap and documented in `content/diagnostic.ts`.
- [x] **Diagnostic progress persistence (refresh-safe).** A page refresh, accidental tab close, or middle-click into a different question used to wipe in-flight answers — the dashboard saw a `diagnostic_started` with no `diagnostic_completed`, the user saw question 1 again. Now the answer map persists to `localStorage` keyed `qprep:diagnostic:v1`, with a 24h TTL and a content-drift guard that drops the blob if any saved slug is no longer in `DIAGNOSTIC_SLUGS`. On reload the runner restores answers, jumps to the first unanswered slug, and shows a "Picking up where you left off — question N of 10. Start over" banner.
  - **Touch points:** `lib/diagnostic-storage.ts` (`loadDiagnosticState` / `saveDiagnosticState` / `clearDiagnosticState` / `resumeIndex` — pure, dependency-injected `Storage` so vitest stays node-only and SSR / private-mode browsers fail open), `lib/diagnostic-storage.test.ts` (19 cases: round-trip, malformed JSON, version mismatch, wrong-shape `answers`, TTL expiry, content drift, quota-exceeded fail-open, SSR null Storage, ordered resume index), `app/diagnostic/DiagnosticRunner.tsx` (lazy-init from storage in a `useMemo`, persist inside the `setAnswers` updater so a refresh during the 250ms auto-advance flash still keeps the latest pick, clear on `restart` and on the result-card mount, suppress `diagnostic_started` when `resumed` so the funnel denominator isn't inflated by refreshes, render the resume banner with an inline Start-over).
  - **Storage shape:** `{ version: 1, savedAt: number, answers: Record<slug, optionId> }`. The version is suffixed onto the storage key so a future schema bump (`v2`) won't even read the old blob. Bump `STORAGE_VERSION` and `STORAGE_KEY` together when shape changes.
  - **Why no server persistence:** the diagnostic is anonymous and routing-only; pushing in-flight answers to the DB would (a) require an extra round-trip per pick that hurts the "60-second" feel, and (b) lock us out of letting users restart freely. localStorage is the right scope.

### In progress — Real auth via Supabase Auth (sliced rollout)

The auth project is split into reversible slices so each one is independently shippable, reviewable, and (where possible) revertible. Don't try to do the whole thing in one PR.

- [x] **Slice 1 — identity abstraction + opt-in migration (this session).** Behavior-neutral. Adds the seam every later slice will plug into.
  - **Touch points:** `supabase/migrations/0005_user_identity.sql` (nullable `user_id uuid` + `linked_at timestamptz` on `anon_users`, partial unique index `anon_users_user_id_unique`, idempotent `link_anon_to_user(anon_id, user_id)` SQL function service-role-only); `lib/identity.ts` (`Identity` shape, `getIdentity()`, `getIdentityKey()`, `isAuthEnabled()`); `lib/identity.test.ts` (7 cases — flag parsing strict equality on `"true"`, key resolution prefers `userId`); `.env.local.example` (added `NEXT_PUBLIC_AUTH_ENABLED=false` with rollout comment).
  - **Why no FK to `auth.users(id)`:** decoupled so the migration applies cleanly even if local Postgres dumps lack the auth schema. `link_anon_to_user` validates the value at write time. Documented in the migration header.
  - **Owner action required:** apply migration `0005` with `supabase db push` before slice 2 ships, otherwise `link_anon_to_user` won't exist when sign-in flows try to call it.
- [ ] **Slice 2 — sign-in UI + post-sign-in linking.** Adds a `/signin` route (magic link via Supabase Auth — no password reset surface, no OAuth provider config), a header status indicator, and a server action that calls `link_anon_to_user(anonId, supabaseUserId)` after `supabase.auth.exchangeCodeForSession`. Also extends `getIdentity()` to read `auth.getUser()` when `isAuthEnabled()` returns true. **Owner decisions needed:** sign-in optional vs required (recommend optional), and which auth providers to enable in the Supabase dashboard (recommend email magic link only for v1).
- [ ] **Slice 3 — data merge.** When a user signs in for the first time on a brand-new device (so their cookie's `anon_users.id` has no attempts), no merge needed. When they sign in on a device that *did* accumulate anon attempts, we have to either (a) merge attempts/streaks/`topic_levels` from the anon row into the canonical user row, or (b) keep both rows and key all reads on `getIdentityKey()`. Recommend (b) for v1 — simpler, reversible — but the merge function should still ship as `merge_anon_into_user(src_anon_id, dst_user_id)` for the day we want it.

### Remaining
- [ ] **Leaderboards, payments, sharing.** Social proof + monetization + virality. Don't start until auth ships and there's a steady-state user base to share with.

---

## Analytics scaffolding (out-of-band; ✅ code-complete this session)

The "Suggested order from here" section repeatedly references "watch onboarding signal in prod" / "watch retention signal in prod". None of those measurements were possible until now — there was zero telemetry. Without it, the owner cannot validate Phase 2 or the diagnostic, which blocks the rest of Phase 3.

### Done
- [x] **Provider-agnostic typed event API.** `lib/analytics.ts` exports `track(event)` against a discriminated union (`AnalyticsEvent`). Adding a new event is a one-line union extension; the compiler catches typos at every callsite. Provider abstraction (`AnalyticsProvider`) routes through `getProvider()`, with default = dev console-logger / prod no-op, override via `NEXT_PUBLIC_ANALYTICS_PROVIDER=console|noop`. `track()` always swallows provider errors (analytics must never break the user-facing experience). Tests: 9 cases in `lib/analytics.test.ts` (env defaults, override casing, error swallowing, noop visibility).
- [x] **Wired events that match the doc's monitoring goals.**
  - `page_viewed` on `/`, `/today`, `/diagnostic` via `<PageView path="…">` (a tiny client wrapper that lets server components instrument routes without becoming client components).
  - `diagnostic_started` (mount), `diagnostic_question_answered` (per pick, with `correct` boolean), `diagnostic_completed` (mount of the result card, with `researcherFraction` / `devFraction` / `recommendedPlaylist`), `diagnostic_cta_clicked` (`open_playlist` / `todays_pair` / `restart`) — covers the full funnel needed to compute the doc's "diagnostic-completion rate" and "playlist-CTA click-through" metrics.
  - `today_pair_status` (mount of `/today`, with `researcherSolved` / `devSolved` / `cleared`) — covers the "% of returning users that hit `/today`" and "% who clear it" metrics.
  - `resurface_clicked` (with `slug` / `daysSinceLastWrong` / `wrongAttemptCount`) via `<ResurfaceLink>` — covers the "% of `Resurface` clicks that turn into a correct re-solve" metric (combined with the existing attempt write).

### Done (continued)
- [x] **Server-side `attempt_submitted` telemetry.** `/api/check` now fires a typed event from all three return paths (Supabase main, local-dev cached-freeform, local-dev main) carrying `{ slug, topic, kind, difficulty, correct, hintLevelsUsed, from? }`. The 4 answer forms read `?from=` via `useSearchParams` and forward it in the request body, so the activation funnel **diagnostic_completed → diagnostic_cta_clicked(playlistSlug=Y) → attempt_submitted(from=playlist:Y)** is fully attributable on a single anon id once a real provider is wired. `from` values today: `playlist:<slug>` (auto-advance / playlist row), `resurface` (home resurface row). Direct browses leave `from` undefined — that's the organic baseline. The `emitAttemptEvent` helper is wrapped in a try/catch so a malformed `answer_kind` (e.g. content drift) can never break a real submission.
- [x] **Full route coverage for pageviews.** `<PageView>` is now wired on `/`, `/today`, `/diagnostic`, `/playlists`, `/playlists/[slug]`, `/questions`, `/questions/[slug]`, plus a direct `track('page_viewed', …)` in the `/mental-math` client component. The dashboard can now reconstruct every hop in the user journey, not just terminal actions.
- [x] **Server-side `nudge_requested` telemetry.** `/api/nudge` fires `{ questionId, level, source }` from 6 call sites covering both Supabase + local-dev code paths × cached / provider / rate-limited / error outcomes. Lets the owner answer questions like "what % of wrong attempts trigger a nudge?", "what's the cache hit rate so we know how much we're paying the AI provider?", and "are users hitting the daily rate limit, and if so on which questions?". Same fail-open wrapper as `attempt_submitted` — analytics never blocks a real hint request.
- [x] **`mental_math_session_completed` client event.** Fires when a timed drill ends — clock hits zero (`reason: "timer"`) or the user hits Stop (`reason: "stop"`). Carries configured `durationSec`, `difficulty`, generator toggles, `elapsedSeconds` (≈ `durationSec − timeLeftAtFinish`), attempt counts, `accuracy`, and `streakAtEnd`. A per-run id + `completedRunIdRef` guard prevents duplicate events under React Strict Mode. Lets dashboards separate bank practice (`attempt_submitted`) from drill-mode engagement.

### Remaining
- [ ] **Pick a real provider.** PostHog, Vercel Analytics, and Plausible all have small SDKs that fit the existing provider interface. Add `lib/analytics-providers/<name>.ts`, extend `getProvider()` to return it when the env var matches, set `NEXT_PUBLIC_ANALYTICS_PROVIDER=<name>` in Vercel.

---

## SEO / metadata (out-of-band; ✅ code-complete this session)

The home, today, diagnostic, playlists, and questions routes had **no per-page titles, no descriptions, no Twitter cards, no sitemap, no robots.txt** — every shared link looked like a generic "QPrep" tile no matter where it pointed. Foundational gap.

### Done
- [x] **Layout-level upgrade.** `app/layout.tsx` now resolves `metadataBase` from `NEXT_PUBLIC_APP_URL` → `VERCEL_URL` → localhost so OG image URLs render correctly in any environment. Description rewritten to match the actual 633-question, 11-topic bank (was stale — only mentioned probability/stochastic/brainteasers). Added `keywords`, `twitter` (`summary_large_image`), and explicit `robots.index/follow`.
- [x] **`/mental-math` route metadata.** `app/mental-math/layout.tsx` is a thin server layout exporting `metadata` only; `page.tsx` stays a client component for the drill UI.
- [x] **Per-page `metadata` exports** on `/today`, `/diagnostic`, `/playlists`, `/questions`. Each has a route-specific title (templated through `"%s · QPrep"`) and description tuned for SERP click-through.
- [x] **`generateMetadata` for dynamic routes.** `/playlists/[slug]` titles with the playlist name + uses its description (or a synthesized one). `/questions/[slug]` titles with the question's actual title + assembles a description from `topic + difficulty + sanitized prompt preview` (markdown fences, `$$`, and inline `$…$` math stripped, then capped at 200 chars). 404 paths return `robots.noindex` so the spec-compliant 404 doesn't pollute search results.
- [x] **`app/sitemap.ts`** generated dynamically from `loadAllQuestions(null) + loadPlaylists()`. 645 URLs (6 static + 6 playlists + 633 questions), well under Google's 50k-per-sitemap cap; if the bank ever crosses ~10k we should split via `generateSitemaps`.
- [x] **`app/robots.ts`** allows all crawlers, disallows `/api/` (no public content there, just wastes crawl budget), and points at `/sitemap.xml`.

### Remaining
- [ ] **Static OG image** at `public/og.png` (1200×630). Without it, Twitter/LinkedIn render the link as text-only. Owner can drop in a branded asset; the `metadataBase` is already set up to resolve relative URLs.
- [ ] **Dynamic per-question OG images** via Next.js `app/questions/[slug]/opengraph-image.tsx`. Higher effort, only worth it if the static OG image proves inadequate.

---

## Suggested order from here

Phase 2, Phase 3 item 1, Phase 3 item 2 slice 1, and the analytics scaffolding are all in the working tree. Owner-only steps next:

1. **Owner: review the diff** and commit Phase 2 + diagnostic + auth-slice-1 + analytics when satisfied. The agent never touches git.
2. **Owner: apply migration `0005_user_identity.sql`** with `supabase db push` (or via the SQL editor). It's additive + idempotent. Must run before auth slice 2 ships.
3. **Owner: pick an analytics provider.** Recommend PostHog (free tier, self-hostable, captures everything) for v1. Add `lib/analytics-providers/posthog.ts`, extend `getProvider()`, set `NEXT_PUBLIC_ANALYTICS_PROVIDER=posthog` + the project key in Vercel. Until then, prod stays on the no-op provider — no privacy concerns, no extra requests, but also no measurements.
4. **Owner: deploy to Vercel.** Auth slice 1 is inert (`NEXT_PUBLIC_AUTH_ENABLED` defaults to `"false"`); analytics is inert in prod (`NEXT_PUBLIC_ANALYTICS_PROVIDER` defaults to `noop` there). So prod behavior is unchanged from before this session.
5. **Watch onboarding signal in prod** (after step 3 lands). Diagnostic-completion rate (`diagnostic_started` → `diagnostic_completed`), playlist-CTA click-through (`diagnostic_cta_clicked` with `cta='open_playlist'`), and 24-hour activation: users who fired `diagnostic_completed` and then submitted at least one real attempt. If activation is below ~30% the routing thresholds (`STRONG_FRACTION`, `LEAN_MARGIN`) in `lib/diagnostic.ts` are the first knobs to turn. Note: `diagnostic_started` no longer fires on a resume (it would have inflated the denominator on every refresh), so the completion rate now reflects *intentional* starts only.
6. **Watch Phase 2 retention signal in prod** (after step 3 lands). Day-2 / day-7 return rate (`page_viewed`), % of returning users that hit `/today` (`today_pair_status`), % of `resurface_clicked` events that turn into a correct re-solve. If those numbers are flat, Phase 2 didn't work and the rest of Phase 3 won't fix it.
7. **Tune the spaced-rep parameters** if `Resurface` engagement is low: `minDaysOld` (currently 3) and `limit` (currently 5) in `lib/spaced-rep.ts` are the obvious knobs.
8. **Owner: decide auth UX before slice 2 begins.** Recommended defaults: magic-link only (no passwords, no OAuth), sign-in optional (anon stays first-class), one-row-per-identity for v1 (no merge). Slice 2 implementation is blocked on this decision.
9. **Then continue Phase 3 in this order:**
   - Auth slice 2 (sign-in UI + linking) — keeps users on a single source of truth across devices.
   - Auth slice 3 (data merge) — only if real-world usage shows visitors regularly accumulating anon data before signing up.
   - Leaderboards / payments / sharing — only after auth ships and there's a steady-state user base to share with.

---

## How to update this doc

- Tick checkboxes (`- [ ]` → `- [x]`) the moment a thing ships, not at the end of a session.
- When you change phase, update the **Current phase** + **Next action** lines at the top.
- New blockers go in **§ Blockers** with a one-line "why it matters" so future-you/Claude doesn't have to reconstruct it.
- New conventions go in **§ Conventions** — that section is what Claude reads before editing code.
- Don't delete completed items; they're the audit trail. Move them under the phase's **Done** subsection.
