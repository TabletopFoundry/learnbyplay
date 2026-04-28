# LearnByPlay — Fifth-Pass UX & DX Audit

**Reviewed:** July 2025
**Context:** Follow-up to `UX_REVIEW_4.md`. Multiple fourth-pass issues were addressed (FK `PRAGMA foreign_keys = ON` added at `db.ts:119`, delete confirmation UI via `ConfirmDeleteForm`, `toggleFavoriteLessonAction` wrapped in transaction, FK reference validation in `logSessionAction`, `SessionLogger` now uses `useActionState` with typed `ActionState` return, `ErrorFallback` heading hierarchy fixed — `title` is now `<h1>`, `getRulesViewerGames()` dedicated query added). This audit focuses exclusively on **genuinely new P0/P1 issues** not documented in any prior review.

---

## Executive Summary

LearnByPlay has matured substantially across five review cycles. The critical data-integrity gaps (FK enforcement, transaction safety, delete confirmation) are resolved. The codebase is well-organized, the design system is consistent, and accessibility foundations are solid. What remains falls into three themes: (1) **security hardening** — no Content-Security-Policy or X-Frame-Options headers, and the `sitemap.ts` N+1 query pattern leaks internal performance costs at build time; (2) **DX gaps** — still zero automated tests (the single longest-standing P0 across all reviews), no pre-commit gate, and three `aria-live` regions in the timer that create redundant screen reader announcements; (3) **resilience gaps** — the seeding logic's "any table has rows = skip all seeding" creates a corruption trap, and the `confirm-delete` inline UI lacks keyboard accessibility cues. The app is pilot-ready for small deployments but needs the testing foundation and security headers before any internet-facing use.

---

## Findings — New Issues Only

### P0 — Critical

#### P0-1: Still zero automated tests — fourth consecutive review flagging this

**Location:** `package.json:9-13` (no `test` script), `.github/workflows/ci.yml` (no test step)

No test framework exists in `devDependencies`. No test files exist anywhere in the repo. CI runs only `lint`, `tsc --noEmit`, and `build`. This was first flagged as P0-1 in `UX_REVIEW_3.md` and re-flagged as a theme in `UX_REVIEW_4.md`. After four review cycles and significant data-layer refactoring (transactions, FK checks, new queries), there is still no way to verify correctness except manual testing.

The risk has actually *increased* since the last review: `actions.ts` now has complex multi-step validation (validate → check FK references → insert → redirect), `toggleFavoriteLessonAction` uses a transaction with conditional logic, and `dashboard.ts:getDashboardSnapshot()` aggregates across 5 queries. Any regression in these paths is invisible.

**Impact:** Every code change is deployed blind. The `mappers.ts` module alone has 6 functions with JSON parsing and type coercion — prime regression candidates. The transaction-wrapped toggle and FK validation in actions are untestable without a test harness.

**Fix:** Install Vitest + `@testing-library/react`. Add `"test": "vitest run"` to `package.json`. Priority test targets:
1. `mappers.ts` — all 6 map functions with valid, malformed, and null input
2. `actions.ts` — validation paths, FK checks, transaction behavior
3. `utils.ts` — `formatDate`, `clamp`, `getComplexityLabel`
4. `pdf.ts` — `wrapText` edge cases (empty string, single long word, exactly-at-boundary)
Add `npm test` to CI pipeline.

---

#### P0-2: No `Content-Security-Policy` or `X-Frame-Options` headers — XSS and clickjacking unmitigated

**Location:** `next.config.ts:3-20`

The security headers array includes `X-DNS-Prefetch-Control`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy` — but omits `Content-Security-Policy` (CSP) and `X-Frame-Options`. Without CSP, any XSS vector (e.g., a future feature accepting teacher-authored content in notes, classroom names, or custom lessons) has no defense-in-depth. Without `X-Frame-Options`, the app can be embedded in a malicious iframe for clickjacking — particularly dangerous because the delete and favorite actions are single-click form submissions.

This was partially noted in the explore agent's findings but was never documented in any prior UX_REVIEW.

**Fix:**
```typescript
// Add to securityHeaders in next.config.ts:
{
  key: "X-Frame-Options",
  value: "DENY",
},
{
  key: "Content-Security-Policy",
  value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';",
},
```
Refine the CSP over time — `'unsafe-inline'` and `'unsafe-eval'` are needed for Next.js dev mode but can be tightened with nonces in production.

---

### P1 — High

#### P1-1: `sitemap.ts` has an N+1 query — calls `getLessonsByGameSlug()` per game inside `flatMap`

**Location:** `src/app/sitemap.ts:17-24`

The sitemap function calls `getGames()` (1 query), then for each of the 37 games calls `getLessonsByGameSlug(game.slug)` — producing 38 queries total. The `getAllLessonsGroupedByGame()` function already exists (used by the dashboard) and would replace this with a single bulk query.

This wasn't flagged in prior reviews because it doesn't affect user-facing latency (sitemaps are generated at build or on cold request), but it's a correctness and consistency issue: the pattern contradicts the explicit N+1 fix documented in `dashboard/page.tsx:36-37`.

**Fix:**
```typescript
import { getGames, getAllLessonsGroupedByGame } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const games = getGames();
  const lessonsByGame = getAllLessonsGroupedByGame();

  const lessonEntries = Object.values(lessonsByGame).flat().map((lesson) => ({
    url: `${BASE_URL}/lessons/${lesson.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  // ...
}
```

---

#### P1-2: `seedDatabase` skips ALL seeding if ANY table has rows — partial seed state is a corruption trap

**Location:** `src/lib/db.ts:19-28`

The seeding guard checks if *any* of the 7 tables has at least one row. If so, it skips all seeding. This means:
- If the seed transaction partially fails (e.g., disk full after inserting standards but before games), the next startup sees standards rows and skips everything — leaving games, lessons, articles, and sample data empty.
- If a user manually deletes all classrooms and sessions but keeps games, the sample data is never re-seeded (acceptable behavior), but if they also delete all games, the check still sees standards rows and won't reseed.

The core risk: `db.transaction()` on line 59 *should* make partial seeding impossible, but if `better-sqlite3` throws during the transaction (OOM, disk error), the `CREATE TABLE IF NOT EXISTS` DDL above runs outside the transaction and succeeds — tables exist but are empty.

**Fix:** Check seeding status per-table or use a dedicated `_meta` table with a `seed_version` flag:
```typescript
const meta = db.prepare("SELECT value FROM _meta WHERE key = 'seed_version'").get() as { value: string } | undefined;
if (meta?.value === CURRENT_SEED_VERSION) return;
// ... seed ...
db.prepare("INSERT OR REPLACE INTO _meta (key, value) VALUES ('seed_version', ?)").run(CURRENT_SEED_VERSION);
```

---

#### P1-3: `ConfirmDeleteForm` inline confirm/cancel has no `aria-describedby` — screen readers lack context

**Location:** `src/components/confirm-delete-form.tsx:38-56`

When a user clicks "Delete", the component switches to an inline `<form>` with a confirmation message (`<span class="text-xs text-rose-700">`), a "Confirm" button, and a "Cancel" button. The confirmation message is visually adjacent but not programmatically associated with the confirm button. Screen reader users tabbing to "Confirm" hear only "Confirm" with no indication of what they're confirming.

Prior reviews flagged the *absence* of delete functionality (UX_REVIEW_3 P1-6) and the *absence* of confirmation UI (UX_REVIEW_4 P0-2). The confirmation UI was added but its accessibility was not reviewed.

**Fix:** Add `id` to the confirmation message and `aria-describedby` to the Confirm button:
```tsx
<span id={`confirm-msg-${fieldKey}`} className="text-xs text-rose-700">{confirmMessage}</span>
<SubmitButton aria-describedby={`confirm-msg-${fieldKey}`} ... />
```

---

#### P1-4: Session timer has three concurrent `aria-live="polite"` regions — redundant announcements

**Location:** `src/components/session-timer.tsx:107, 121, 126`

The timer has three live regions:
1. Line 107: Phase indicator (`aria-live="polite"`) — "Current phase: Play"
2. Line 121: Duration text (`aria-live="polite"`) — "20 minutes planned for this phase"
3. Line 126: SR-only time (`aria-live="polite"`) — "19 minutes and 45 seconds remaining"

When a phase changes, all three update simultaneously, causing screen readers to queue three announcements in succession. The UX_REVIEW_3 P1-3 flagged the *original* `aria-live="assertive"` on the countdown (updating every second), which was fixed by switching to `"polite"` and moving the countdown to `aria-live="off"`. But the fix introduced a *new* problem: three `polite` regions all firing on phase transitions.

**Fix:** Consolidate to a single `aria-live="polite"` SR-only region that provides a complete announcement on phase change:
```tsx
<p className="sr-only" aria-live="polite">
  {completed
    ? "Session timer complete"
    : `Phase ${currentPhase + 1}: ${phase?.label}. ${Math.floor(secondsLeft / 60)} minutes remaining.`}
</p>
```
Remove `aria-live` from lines 107 and 121. Keep `aria-live="off"` on the visual countdown.

---

#### P1-5: `pdf.ts` `wrapText` pushes empty first line when a single word exceeds `maxLength`

**Location:** `src/lib/pdf.ts:5-25`

If a single word is longer than `maxLength` (e.g., a very long URL or compound phrase without spaces), the logic pushes `current` (empty string `""`) as a line, then sets `current = word`. This produces a blank line in the PDF before the long word.

```typescript
// When current="" and word.length > maxLength:
const candidate = "" ? `${""} ${word}` : word;  // candidate = word
if (candidate.length > maxLength) {
  lines.push("");  // ← empty line pushed
  current = word;
}
```

This is technically a bug, not a cosmetic issue — teachers downloading PDFs with long learning objectives or materials descriptions will see spurious blank lines.

**Fix:**
```typescript
if (candidate.length > maxLength) {
  if (current) lines.push(current);  // only push non-empty
  current = word;
}
```

---

#### P1-6: `CatalogFilters.sort` typed as `string` — no compile-time safety for sort values

**Location:** `src/lib/types.ts:112`

`CatalogFilters.sort` is `string | undefined`, while `games.ts:41-53` branches on `"time"`, `"complexity"`, `"standards"`, and `"fit"`. A typo like `sort: "stanards"` compiles fine and silently falls through to the default sort. The `games/page.tsx:91-95` select options use literal strings that must match — but TypeScript can't verify this.

Prior reviews noted weak typing in various places but this specific field was not flagged.

**Fix:**
```typescript
export type SortOption = "fit" | "time" | "complexity" | "standards";

export interface CatalogFilters {
  // ...
  sort?: SortOption;
}
```

---

### P2 — Medium

#### P2-1: `skip-to-content` still uses `:focus` instead of `:focus-visible`

**Location:** `src/app/globals.css:64`

All other interactive elements use `:focus-visible` (lines 37-51), but the skip link uses `:focus`. This was flagged as P2-4 in UX_REVIEW_3 — re-flagging for completeness as it remains unfixed.

---

#### P2-2: Footer still has no navigation links

**Location:** `src/components/site-footer.tsx`

The footer contains descriptive text but no links. Flagged as P2-5 in UX_REVIEW_3 — still unfixed.

---

#### P2-3: `GameArt` gradient selection still uses `name.length % 6` — poor distribution

**Location:** `src/components/game-art.tsx:25`

Flagged as P2-2 in UX_REVIEW_3 — still unfixed. Games with same-length names get identical gradient colors.

---

#### P2-4: PD page admin FAQ section still has no `id` for deep linking

**Location:** `src/app/pd/page.tsx:61`

Flagged as P2-7 in UX_REVIEW_3 — still unfixed. The dashboard's "See facilitation best practices" link dumps teachers at the top of /pd instead of the FAQ.

---

#### P2-5: Pricing cards still have no CTA or "Coming soon" indicator

**Location:** `src/app/page.tsx:199-207`

Flagged as P2-14 in UX_REVIEW_3 — still unfixed. Teachers/admins see tiers with no action.

---

#### P2-6: `parseJson` in mappers still logs to `console.error` with no structured context

**Location:** `src/lib/data/mappers.ts:6`

Flagged as P2-9 in UX_REVIEW_3 — still unfixed. A parse failure for `standards` JSON is indistinguishable from one for `skills` JSON in logs.

---

#### P2-7: No pre-commit hooks (Husky/lint-staged) — broken code can be committed

**Location:** `package.json` (no `prepare` script, no `.husky/` directory)

Flagged as DX-2 in UX_REVIEW_3 — still not implemented. The only quality gate is CI, which runs after push.

---

#### P2-8: No `typecheck` script in `package.json`

**Location:** `package.json:9-13`

Developers must remember `npx tsc --noEmit`. Flagged as DX-3 in UX_REVIEW_3 — still unfixed.

**Fix:** Add `"typecheck": "tsc --noEmit"` to scripts.

---

#### P2-9: Mobile nav does not set `inert` on main content — background remains interactive

**Location:** `src/components/site-header.tsx:126-154`, `src/app/layout.tsx:62`

When the mobile hamburger menu opens, a focus trap cycles within the nav links (good), but the main content behind the nav remains interactive for click/touch. A user could tap a link or button behind the menu. No overlay, no `inert` attribute on `<main>`.

**Fix:** Pass `menuOpen` state to the layout (via context or a portal pattern) and add `inert` to `<main>` when the menu is open. Alternatively, render a transparent overlay behind the nav that closes the menu on click.

---

#### P2-10: Landing page sections still lack `aria-labelledby` on `<section>` elements

**Location:** `src/app/page.tsx:125, 150, 184`

The landing page has 4 `<section>` elements. The first two now have sr-only `<h2>` headings (lines 98, 126) — good. But the `<section>` elements still don't have `aria-labelledby` pointing to those headings. Flagged as P2-1 in UX_REVIEW_3 — partially addressed (headings added) but linkage not completed.

---

## What's Been Fixed Well Since UX_REVIEW_4

1. **FK enforcement enabled** — `db.pragma("foreign_keys = ON")` at `db.ts:119`. P0-1 from UX_REVIEW_4 resolved.
2. **Delete confirmation UI** — `ConfirmDeleteForm` component with two-step click pattern. P0-2 from UX_REVIEW_4 resolved.
3. **Atomic favorite toggle** — `toggleFavoriteLessonAction` wrapped in `db.transaction()` with `DELETE` + conditional `INSERT`. P1-2 from UX_REVIEW_4 resolved.
4. **FK reference validation** — `logSessionAction` now checks `classrooms`, `games`, `lessons` exist before inserting. P1-1 from UX_REVIEW_4 resolved.
5. **Form state preserved on validation error** — Both `ClassroomForm` and `SessionLogger` use `useActionState` with `ActionState` return type — no redirect on validation failure. P1-3 from UX_REVIEW_4 resolved.
6. **`SessionLogger` action type fixed** — Now typed as `(prevState: ActionState, formData: FormData) => Promise<ActionState>`. P1-4 from UX_REVIEW_4 resolved.
7. **`ErrorFallback` heading hierarchy fixed** — `title` is now `<h1>`, `description` is `<p>`. P1-5 from UX_REVIEW_4 resolved.
8. **Dedicated `getRulesViewerGames()` query** — Tools page now loads only 3 columns with `LIMIT`. P1-6 from UX_REVIEW_4 resolved.
9. **`force-dynamic` removed from read-only pages** — Only `dashboard/page.tsx` retains it. P1-9 from UX_REVIEW_3 resolved.
10. **Validation error separation** — `ValidationError` class used in try/catch; non-validation errors re-thrown. P0-2 from UX_REVIEW_3 resolved.
11. **Open redirect sanitized** — `sanitizeRedirectTo()` validates path prefix and re-serializes via `new URL()`. P0-3 from UX_REVIEW_3 resolved.
12. **`FlashBanner` removes only flash params** — Uses `URLSearchParams` to delete specific keys, not nuke query string. P0-4 from UX_REVIEW_3 resolved.

---

## Priority Summary

| Priority | Count | Theme |
|----------|-------|-------|
| **P0** | 2 | Zero tests (4th review), missing CSP/X-Frame-Options |
| **P1** | 6 | Sitemap N+1, seed corruption trap, confirm a11y, timer triple live-region, PDF wrap bug, weak sort type |
| **P2** | 10 | Carry-over polish from UX_REVIEW_3 (skip-link focus, footer nav, gradient hash, FAQ deep link, pricing CTA, parseJson logging, pre-commit, typecheck script, mobile nav inert, landing page aria-labelledby) |

---

## Recommended Action Order

1. **P0-1** — Install Vitest, write tests for `mappers.ts`, `utils.ts`, `pdf.ts`, add `npm test` to CI. This unblocks all future refactoring with confidence.
2. **P0-2** — Add `Content-Security-Policy` and `X-Frame-Options` to `next.config.ts` security headers. One-line additions each.
3. **P1-5** — Fix `wrapText` empty-line bug in `pdf.ts`. One-line guard.
4. **P1-1** — Replace sitemap N+1 with `getAllLessonsGroupedByGame()`. Drop-in existing function.
5. **P1-6** — Add `SortOption` type alias. Two-line type change.
6. **P1-4** — Consolidate timer to single `aria-live` region. Net code reduction.
7. **P1-3** — Add `aria-describedby` to `ConfirmDeleteForm`. Small accessibility win.
8. **P1-2** — Add seed versioning via `_meta` table. Prevents future corruption.
9. **P2-8** — Add `typecheck` script. Literally one line in `package.json`.
10. Batch remaining P2 items as polish sprint.
