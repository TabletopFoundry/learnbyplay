# LearnByPlay — Third-Pass UX & DX Audit

**Reviewed:** July 2025
**Context:** Follow-up to `UX_REVIEW_2.md`. Many second-pass issues were addressed (Subject type consolidation, sessions empty state, game card `aria-label`, filter sidebar `<details>` collapse, game detail ordered list numbering, dashboard `COUNT(*)` fix, PDF `download` attribute). This audit focuses on remaining gaps, new issues discovered during deeper inspection, and DX-level concerns not previously covered.

---

## Executive Summary

LearnByPlay has matured into a well-structured, visually polished MVP. The previous two rounds of fixes resolved the most severe accessibility and layout issues. What remains are: (1) a complete absence of automated tests — the single largest DX risk; (2) several data-layer robustness gaps where unvalidated input or missing FK enforcement can silently corrupt state; (3) accessibility micro-issues around list semantics, focus management, and live-region chattiness that would surface during real assistive-technology usage; and (4) production-readiness gaps in error handling, security headers, and PDF generation. The project is close to pilot-ready but needs a testing foundation and a hardening pass before classroom deployment.

---

## Findings

### P0 — Critical (blocks pilot readiness, causes data loss, or breaks accessibility compliance)

#### P0-1: Zero automated tests — regressions are undetectable

**Location:** Entire project; `package.json:9-13` (no test script), CI pipeline `.github/workflows/ci.yml`

No test framework is installed (no Vitest, Jest, Playwright, or Testing Library in `devDependencies`). No `test` script exists in `package.json`. The CI pipeline runs only `lint`, `tsc --noEmit`, and `build`. Every server action (`actions.ts`), data access function (`lib/data/*`), mapper (`lib/data/mappers.ts`), utility (`lib/utils.ts`), and PDF generator (`lib/pdf.ts`) has zero coverage.

**Impact:** Any change to the data layer, validation logic, or PDF rendering is deployed blind. The `mappers.ts` module alone has 6 functions with JSON parsing and type coercion — prime candidates for regression.

**Fix:** Install Vitest + `@testing-library/react`. Add a `test` script to `package.json`. Write unit tests for `mappers.ts`, `utils.ts`, `pdf.ts`, and data access functions. Add `npm test` step to CI. This is the single highest-ROI improvement.

---

#### P0-2: `actions.ts` redirect-on-catch swallows all errors silently

**Location:** `src/app/actions.ts:42-49`, `src/app/actions.ts:75-83`

Both `createClassroomAction` and `logSessionAction` wrap validation in a `try/catch` that catches **any** error (including unexpected runtime errors like DB connection failures) and redirects to `?error=classroom&fields=validation`. A database crash, a null pointer in `validateEnum`, or a malformed `SUBJECTS` constant all produce the same generic "fix your fields" message. The teacher sees a validation error when the real problem is server-side.

```typescript
try {
  name = validateString(formData.get("name"), 200);
  // ...
} catch {
  redirect(`/dashboard?error=classroom&fields=validation`);  // swallows everything
}
```

**Fix:** Separate validation errors (which should redirect with field-specific messages) from unexpected errors (which should throw and be caught by the `error.tsx` boundary). Use typed error classes or a result pattern.

---

#### P0-3: `toggleFavoriteLessonAction` open redirect via `redirectTo` form field

**Location:** `src/app/actions.ts:106`

The `redirectTo` parameter is read from user-submitted form data and passed directly to `redirect()` with no validation. A crafted form submission can redirect users to any URL:

```typescript
const redirectTo = getRedirectTarget(formData, "/dashboard");
// ...
redirect(redirectTo);  // attacker can set redirectTo to https://evil.com
```

**Fix:** Validate that `redirectTo` starts with `/` and does not contain `//` (to prevent protocol-relative URLs). Example: `if (!redirectTo.startsWith('/') || redirectTo.startsWith('//')) redirectTo = '/dashboard'`.

---

#### P0-4: `FlashBanner` calls `router.replace()` on every mount — drops unrelated query params

**Location:** `src/components/flash-banner.tsx:15-17`

`FlashBanner` replaces the URL with `pathname` (no query string) on mount. If the dashboard ever uses additional query params (e.g., pagination, tab state, or deep links), they will be silently stripped when a success/error banner is shown. More critically, if two `FlashBanner` instances mount simultaneously (e.g., `?created=1&logged=1`), each triggers `router.replace(pathname)` — a race condition.

**Fix:** Use `URLSearchParams` to remove only the specific keys this banner is responsible for (`created`, `logged`, `error`, `fields`), not nuke the entire query string.

---

### P1 — High (significant UX friction, accessibility gaps, or data integrity risks)

#### P1-1: `<ul>` lists across the app use literal `•` characters instead of CSS markers

**Location:** `games/[slug]/page.tsx:73`, `lessons/[slug]/page.tsx:94,100,120,126,142`, `pd/page.tsx:33,52,71`

Multiple `<ul>` lists render `• {item}` as text content inside `<li>` elements. This means screen readers announce "bullet, Start with base game components only" — doubling the list marker. The `<ul>` element already implies list semantics. The literal bullet also creates inconsistent alignment if text wraps.

**Fix:** Remove the `• ` text prefix from all `<li>` items. Add `list-disc pl-5` (or equivalent Tailwind) to the `<ul>` to restore visual bullets via CSS, which screen readers handle correctly.

---

#### P1-2: `ErrorFallback` component swaps semantic hierarchy — title is `<p>`, description is `<h1>`

**Location:** `src/components/error-fallback.tsx:14-15`

The error fallback renders the `title` prop ("Something needs another try") as a `<p>` with kicker styling, and the `description` prop ("We couldn't load LearnByPlay right now.") as the `<h1>`. Semantically, the title should be the heading and the description the body text. Screen readers navigating by headings will announce the description as the page heading.

**Fix:** Make `title` the `<h1>` and `description` a `<p>`. Adjust font sizes to preserve visual hierarchy.

---

#### P1-3: Session timer `aria-live="assertive"` announces every second — overwhelming for screen readers

**Location:** `src/components/session-timer.tsx:118-119`

The SR-only live region uses `aria-live="assertive"` and updates its content every second with the full time string. During a 33-minute session, this generates ~1,980 assertive announcements. Screen reader users will hear continuous interruptions.

**Fix:** Change to `aria-live="polite"`. Throttle updates to announce only at phase transitions and at 5-minute / 1-minute / 30-second warnings. Remove redundant `aria-live="off"` on line 110.

---

#### P1-4: Mobile nav has no focus trap and no Escape key handling

**Location:** `src/components/site-header.tsx:84-111`

When the mobile hamburger menu opens, focus remains on the toggle button. Tab key moves focus into page content behind the nav. There is no `onKeyDown` handler for Escape to close the menu. Screen reader users cannot easily dismiss the menu.

**Fix:** (a) Add `onKeyDown` handler for Escape to close the menu and return focus to the toggle button. (b) Use `useRef` + `useEffect` to move focus to the first nav link when the menu opens. (c) Optionally add a focus trap (`inert` attribute on `<main>` when menu is open).

---

#### P1-5: `createClassroomAction` allows `studentCount` up to 999 — no practical classroom has 999 students

**Location:** `src/app/actions.ts:53`

Server-side validation allows `studentCount` values from 1 to 999. The HTML input has no `max` attribute at all (`dashboard/page.tsx:90`). A teacher accidentally typing `2400` instead of `24` will have corrupt data in their dashboard with no way to edit or delete the classroom.

**Fix:** Add `max={60}` to the HTML input and lower the server-side max to 60 (or a reasonable classroom ceiling). More importantly, there is currently **no way to edit or delete classrooms or sessions** — see P1-6.

---

#### P1-6: No edit or delete functionality for classrooms, sessions, or favorites from the dashboard

**Location:** `src/app/dashboard/page.tsx`, `src/app/actions.ts`

Teachers can create classrooms and log sessions but cannot edit or delete them. If a teacher makes a typo in a class name, enters wrong data, or wants to remove a test entry, the only option is deleting the SQLite database and losing all data. The README suggests this as the "reset" path: "Stop the server, delete `data/learnbyplay.db`, and restart."

**Fix:** Add delete buttons (with confirmation) for classrooms and sessions. Even a simple "Delete" server action per row would dramatically improve usability.

---

#### P1-7: PDF `Content-Disposition` filename is not sanitized for special characters

**Location:** `src/app/api/lessons/[slug]/pdf/route.ts:32`

The filename is constructed from `lesson.slug` which is user-facing data. While slugs are currently safe (lowercase alphanumeric + hyphens from seed data), if custom lessons are ever added, a slug containing quotes or special characters could break the `Content-Disposition` header or enable header injection.

**Fix:** Sanitize the filename: `filename="${lesson.slug.replace(/[^a-z0-9-]/g, '_')}.pdf"`.

---

#### P1-8: `getGames()` loads and parses ALL games for the tools page rules viewer — only first 15 used

**Location:** `src/app/tools/page.tsx:13`

The tools page calls `getGames()` which loads all 37 games from SQLite, parses 6 JSON columns per game (subjects, mechanics, skills, materials, simplifiedRules, standards), then `.slice(0, 15)` to take only 15, then maps to only 3 fields (slug, name, simplifiedRules). 22 games are loaded and fully parsed for nothing, and 5 of 6 JSON columns per game are parsed needlessly.

**Fix:** Add a dedicated `getRulesViewerGames(limit: number)` query that selects only `slug, name, simplified_rules` with `LIMIT 15`. This also avoids parsing unused JSON columns in `mapGame`.

---

#### P1-9: `force-dynamic` on every page disables all Next.js caching

**Location:** `games/page.tsx:10`, `games/[slug]/page.tsx:8`, `lessons/[slug]/page.tsx:8`, `dashboard/page.tsx:13`, `tools/page.tsx:6`, `pd/page.tsx:4`

Every page exports `export const dynamic = "force-dynamic"`, which disables static generation, ISR, and request deduplication. The games catalog, game detail pages, lesson details, PD articles, and tools page all serve read-only seed data that changes only when the database is manually reset. Only the dashboard (which shows user-specific data) genuinely needs dynamic rendering.

**Fix:** Remove `force-dynamic` from read-only pages (`games`, `games/[slug]`, `lessons/[slug]`, `pd`, `tools`). Use `revalidatePath` in server actions to bust cache when data changes. Keep `force-dynamic` only on `dashboard`.

---

### P2 — Medium (polish, DX friction, and hardening)

#### P2-1: No `<title>` or `aria-label` on the landing page sections — screen reader landmark navigation is flat

**Location:** `src/app/page.tsx`

The landing page has 4 `<section>` elements, but none have `aria-labelledby` or `aria-label` attributes. Screen reader users navigating by landmarks will see 4 unnamed "region" landmarks. The dashboard page correctly uses `aria-labelledby` (lines 67, 120, 165, 188) — the landing page should follow the same pattern.

**Fix:** Add `aria-labelledby` to each section pointing to its `<h2>` (which already exists or is sr-only).

---

#### P2-2: `GameArt` gradient selection uses `name.length % 6` — poor distribution

**Location:** `src/components/game-art.tsx:25`

With only 6 gradients and 37 games, collision rate is high. Games with names of the same length get identical colors (e.g., "Azul" and "Coup" both get gradient index 4). UX_REVIEW_2 noted this (P2-6) but the fix was not applied.

**Fix:** Use a character-code hash: `name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % gradients.length`.

---

#### P2-3: No Prettier or formatting enforcement — `.editorconfig` exists but no auto-formatter

**Location:** `.editorconfig`, `package.json`

An `.editorconfig` exists (good), but there's no Prettier config or `format` script. Contributors can introduce inconsistent formatting that lint won't catch. ESLint config only extends Next.js core-web-vitals and TypeScript — no style rules.

**Fix:** Add Prettier with a `.prettierrc` config and a `format` / `format:check` script. Add `format:check` to CI.

---

#### P2-4: `skip-to-content` uses `:focus` instead of `:focus-visible`

**Location:** `src/app/globals.css:64`

The skip-to-content link uses `.skip-to-content:focus` while all other elements use `:focus-visible`. This was noted in UX_REVIEW_2 regression R-2 but remains unfixed.

**Fix:** Change `.skip-to-content:focus` to `.skip-to-content:focus-visible` on line 64.

---

#### P2-5: Footer has no navigation links

**Location:** `src/components/site-footer.tsx`

The footer contains descriptive text but no links to any page. Users who scroll to the bottom have no navigation options except scrolling back up. This was noted in UX_REVIEW_2 (P2-4) but remains unfixed.

**Fix:** Add a nav link list: Browse Games, Dashboard, Classroom Tools, PD Content.

---

#### P2-6: `SessionLogger` action prop typed as sync `(formData: FormData) => void` — should be async

**Location:** `src/components/session-logger.tsx:14`

The `action` prop receives `logSessionAction` which is an async server action, but the type signature is `(formData: FormData) => void`. This suppresses TypeScript's async error handling checks. Noted in UX_REVIEW_2 (P2-11) but remains unfixed.

**Fix:** Type as `(formData: FormData) => Promise<void>`.

---

#### P2-7: PD page admin FAQ section has no `id` for deep linking

**Location:** `src/app/pd/page.tsx:62`

The admin FAQ `<section>` has no `id` attribute, so the dashboard's "See facilitation best practices" link dumps teachers at the top of the PD page, not the FAQ section. Noted in UX_REVIEW_2 (P2-3) but remains unfixed.

**Fix:** Add `id="admin-faq"` to the FAQ section wrapper. Update referencing links to `/pd#admin-faq`.

---

#### P2-8: Redundant `role="navigation"` on mobile `<nav>` element

**Location:** `src/components/site-header.tsx:85`

The mobile nav uses `<nav role="navigation">` — the role is implicit on `<nav>`. The desktop nav correctly omits it. Noted in UX_REVIEW_2 (P2-12) but remains unfixed.

**Fix:** Remove `role="navigation"` from the mobile `<nav>`.

---

#### P2-9: `parseJson` error logging in mappers uses `console.error` — no structured error handling

**Location:** `src/lib/data/mappers.ts:6`

When JSON parsing fails (corrupted DB data, schema drift), `parseJson` logs a truncated message to `console.error` and returns a silent fallback. In production, this means a game with corrupted `standards` JSON will render as having zero standards — with no indication to the user or developer that data is missing.

**Fix:** At minimum, include the column/context name in the error message. Ideally, throw on parse failure in development mode and use the fallback only in production.

---

#### P2-10: CI pipeline does not pin npm cache hash or use lockfile for reproducibility

**Location:** `.github/workflows/ci.yml:25`

The `actions/setup-node@v4` uses `cache: npm` which hashes `package-lock.json` for the cache key — this is correct. However, the pipeline uses `npm ci` (good) but does not set `NODE_ENV` or freeze the npm version. Different Node 20.x patch versions could produce different behaviors.

**Fix:** Pin the Node version more specifically (e.g., `20.x` instead of `20`) or use `.nvmrc` via `node-version-file: '.nvmrc'` for consistency between local dev and CI.

---

#### P2-11: `getRedirectTarget` does not URL-decode or sanitize the `redirectTo` value

**Location:** `src/app/actions.ts:9-12`

Beyond the open redirect risk (P0-3), the function performs no URL decoding, no length limiting, and no encoding of special characters. A `redirectTo` value of `/lessons/foo%0d%0aSet-Cookie:evil=true` could potentially inject headers in some server configurations.

**Fix:** Use `new URL(value, 'http://localhost')` to parse and re-serialize, ensuring only the pathname is used.

---

#### P2-12: `data/learnbyplay.db` is in `.gitignore` but WAL/SHM files pattern coverage is unclear

**Location:** `.gitignore`

The database uses WAL mode (`db.ts:118`). Confirm that `.gitignore` covers `*.db-wal` and `*.db-shm` patterns to prevent binary artifacts from being committed.

**Fix:** Verify `.gitignore` includes `data/*.db-wal` and `data/*.db-shm` (or `*.db-wal` globally).

---

#### P2-13: No `<meta name="description">` per-page — only root layout has generic description

**Location:** `src/app/layout.tsx:12`, individual page `metadata` exports

The root layout sets a generic description. Individual pages export only `title` in their `metadata` (e.g., `games/page.tsx:13`, `dashboard/page.tsx:16`). Game detail and lesson detail pages set `description` from the model (good), but static pages (`/tools`, `/pd`, `/dashboard`, `/games`) have no page-specific description for SEO or social sharing.

**Fix:** Add `description` to the `metadata` export of each static page.

---

#### P2-14: Pricing section cards have no CTA buttons — users see tiers with no action

**Location:** `src/app/page.tsx:199-207`

The pricing cards show plan names and prices but offer no buttons or "Coming soon" indicators. Noted in UX_REVIEW_2 (P2-2) but remains unfixed. Teachers and administrators will expect to click something.

**Fix:** Add a disabled button or "Coming soon" text to each pricing card.

---

## DX-Specific Findings

### DX-1: No test infrastructure at all

No test runner, no test utilities, no test files, no test script in `package.json`, no test step in CI. This is the single largest barrier to confident development. Any data layer change is a leap of faith.

### DX-2: No pre-commit hooks or Husky

Developers can commit code that fails lint or type-check. The only gate is CI, which runs after push. Adding `lint-staged` + `husky` would catch issues before they enter the repo.

### DX-3: No `npm run typecheck` script

The CONTRIBUTING guide instructs `npx tsc --noEmit` for type checking, but there's no `typecheck` script in `package.json`. This is a minor convenience gap but adds friction for new contributors who have to remember the exact command.

### DX-4: Seed data is ~2,000 lines of hardcoded TypeScript

**Location:** `src/lib/seed/games.ts`, `src/lib/seed/lessons.ts`, `src/lib/seed/standards.ts`, `src/lib/seed/pd.ts`

All seed data (37 games, 12 lessons, 20 standards, 4 articles) is maintained as TypeScript arrays. This makes the data type-safe (good) but difficult for non-developers to edit. For a teacher-facing tool, a JSON or YAML seed format with schema validation would lower the contribution barrier for curriculum content.

### DX-5: No database migration system

**Location:** `src/lib/db.ts:120-206`

Schema is defined in a raw `db.exec()` call with `CREATE TABLE IF NOT EXISTS`. Adding a column or changing a type requires either manual migration SQL or a full database reset. As the schema evolves, this will cause data loss for anyone with a populated database.

---

## What's Been Fixed Well Since UX_REVIEW_2

1. **Subject type consolidated** — `types.ts` now re-exports from `constants.ts`, eliminating drift risk.
2. **Sessions empty state** — Dashboard shows a helpful message when no sessions exist.
3. **Game card accessible names** — `aria-label={game.name}` on catalog links with `aria-hidden` inner content.
4. **Filter sidebar collapses on mobile** — `<details>/<summary>` pattern with `lg:open`.
5. **Game detail rules numbered** — `<ol>` items now show `{index + 1}.` prefix text.
6. **Dashboard `totalGames` uses `COUNT(*)`** — No longer loads all games to count them.
7. **PDF links have `download` attribute** — Dashboard and game detail PDF links preserved.
8. **`FlashBanner` auto-clears URL params** — (Partially addressed; see P0-4 for remaining issue.)

---

## Priority Summary

| Priority | Count | Theme |
|----------|-------|-------|
| **P0** | 4 | No tests, swallowed server errors, open redirect, query param race |
| **P1** | 9 | List semantics, error page hierarchy, timer a11y, nav focus, data CRUD gaps, perf |
| **P2** | 14 | Polish, DX friction, unfixed items from prior reviews, SEO, formatting |

---

## Recommended Action Order

1. **P0-1** — Install Vitest and write unit tests for `mappers.ts`, `utils.ts`, `pdf.ts` → CI green with test coverage.
2. **P0-2** — Separate validation errors from runtime errors in server actions.
3. **P0-3** — Validate `redirectTo` to prevent open redirect.
4. **P0-4** — Fix `FlashBanner` to remove only its own query params.
5. **P1-1** — Remove literal `•` from all `<li>` items, use CSS list markers.
6. **P1-5/P1-6** — Add edit/delete for classrooms and sessions; cap `studentCount`.
7. **P1-9** — Remove `force-dynamic` from read-only pages.
8. **P1-3/P1-4** — Fix timer `aria-live` and mobile nav focus trap.
9. Batch remaining P2 items as polish work.
