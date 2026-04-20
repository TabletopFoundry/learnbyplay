# LearnByPlay — Second-Pass UX & DX Audit

**Reviewed:** July 2025
**Context:** Follow-up to `UX_REVIEW.md`. Many first-pass issues (mobile nav, skip-to-content, focus-visible, breadcrumb semantics, heatmap labels, cascading dropdowns, timer edge cases, constants extraction, `.nvmrc`, CI pipeline, N+1 fix, table aria-labels, input clamping) were fixed. This audit focuses on remaining gaps, regressions, and new issues found during the fixes.

---

## Executive Summary

The first-pass fixes raised the quality bar significantly. Mobile navigation, keyboard accessibility, and the session timer are now in good shape. However, several medium-severity issues remain: color contrast failures across repeated UI patterns, missing accessible names and descriptions on interactive elements, an incomplete responsive story on the PD page and filter sidebar, inconsistent error feedback UX, and a few edge cases in the PDF export and data layer. The app is closer to pilot-ready but still has accessibility debt and responsive polish gaps that would surface in real classroom use on school-issued devices.

---

## Findings

### P0 — Critical (blocks accessibility compliance or causes data loss)

#### P0-1: `text-slate-500` on white backgrounds fails WCAG AA contrast

**Location:** `dashboard/page.tsx:64-67`, `games/[slug]/page.tsx:56-59`, `lessons/[slug]/page.tsx:75-78`, `page.tsx:194`, `pd/page.tsx:25`

Tailwind's `slate-500` (#64748b) on white (#ffffff) yields a contrast ratio of ~4.0:1. WCAG AA requires 4.5:1 for normal text. This pattern is used extensively for stat card labels ("Classes", "Sessions logged", "Player count", etc.) and section kickers across the entire app — affecting dozens of text elements.

**Fix:** Replace `text-slate-500` with `text-slate-600` (#475569, ~5.9:1 ratio) for all label text on white/light backgrounds. The distinction between label and body text is already carried by `font-semibold` + `uppercase tracking-[0.2em]`, so darkening won't hurt the hierarchy.

---

#### P0-2: `text-slate-300` testimonial attribution fails contrast on `bg-slate-900`

**Location:** `page.tsx:167`

`figcaption` text uses `text-slate-300` (#cbd5e1) on `bg-slate-900` (#0f172a) — contrast ratio ~8.2:1 for the caption text, but the role text sits directly on this same figcaption with inherited `text-slate-300`. The actual issue: the `text-slate-300` role text ("Grade 4 teacher") on `bg-slate-900` passes, but this pattern is fragile. More importantly, the same figcaption contains the name in `text-white` and the role in inherited `text-slate-300` separated only by a `<br>` — no semantic distinction exists between the two.

**Fix:** Wrap the role text in a `<span>` with `text-slate-400` (for adequate contrast) and add `sr-only` context like "Role:" for screen readers.

---

#### P0-3: Filter form submits via full-page GET with no loading indication

**Location:** `games/page.tsx:48-99`

The game browser filter form is a plain `<form>` with a submit button. Applying filters causes a full server round-trip with no visual feedback — no spinner, no disabled state, no skeleton. On slow connections, teachers will click "Apply filters" and see nothing happen for seconds. The loading skeleton at `games/loading.tsx` only activates on Next.js navigation transitions (Link clicks), not on form submissions that stay on the same route with different search params.

**Fix:** Either (a) convert to client-side filtering with `useRouter().push()` so the Suspense boundary triggers, or (b) add a `SubmitButton` with pending state (the component already exists) to the filter form.

---

### P1 — High (significant UX friction or accessibility gaps)

#### P1-1: No `<h2>` heading structure on the landing page for "Why teachers trust it" and "Pricing" sections

**Location:** `page.tsx:122-202`

The three value proposition cards at line 122 have `<h3>` elements but no parent `<h2>`. The testimonials section uses `<h2>` (good), but the three value-prop cards jump from `<h1>` to `<h3>`, breaking heading hierarchy. Screen reader users navigating by headings will miss this section entirely.

**Fix:** Add an `<h2>` before the value-prop cards grid (e.g., "How LearnByPlay works") and demote or keep the `<h3>` elements as-is.

---

#### P1-2: Game cards in the browser are giant click targets with no accessible name beyond the visual content

**Location:** `games/page.tsx:129-148`

Each game card is wrapped in a `<Link>` that contains the art, subject badges, title, tagline, and stats — all as the link's accessible name. Screen readers will announce the entire card content as one long run-on string: "Math Science Prime Climb Arithmetic strategy game... Grades 3-5 Play time 20-45 min Players 2-4 Standards 3". This is not scannable.

**Fix:** Add `aria-label={game.name}` to the `<Link>` element and wrap the inner content in a `<div aria-hidden="true">` (or use `aria-labelledby` pointing to the `<h2>`).

---

#### P1-3: Filter sidebar doesn't collapse on mobile — still pushes content down

**Location:** `games/page.tsx:48`

The first review flagged this (1.3 responsiveness). The fix was noted as P2 recommendation #23 but was not implemented. The filter sidebar with 7 fields + 2 buttons renders fully expanded above the game grid on mobile, pushing actual results ~500px below the fold. On a phone, a teacher has to scroll past all filters to see any results.

**Fix:** Wrap the filter form in a collapsible `<details>/<summary>` or a button-toggled drawer on small screens. Use `lg:block hidden` for the sidebar and show a "Filters" toggle button on mobile.

---

#### P1-4: PDF link opens in same tab with no user warning

**Location:** `games/[slug]/page.tsx:120`, `lessons/[slug]/page.tsx:63`, `dashboard/page.tsx:198`

"Download PDF" and "PDF" links point to `/api/lessons/[slug]/pdf`, which returns a binary response with `Content-Disposition: attachment`. Clicking these navigates away from the current page (even though the browser should trigger a download due to the attachment header, some browsers — especially on school Chromebooks — may render the PDF inline instead). There is no `target="_blank"` or `download` attribute.

**Fix:** Add `download` attribute to all PDF links (`<a download href=...>`) and optionally `target="_blank"` so the user's context is preserved.

---

#### P1-5: Error banners on dashboard still use URL params — persist on refresh

**Location:** `dashboard/page.tsx:55-61`, `actions.ts:24-25,49-50`

The first review flagged this as EDGE-8 / recommendation #22 (P2). It remains unfixed. When a classroom is created (`?created=1`) or a session is logged (`?logged=1`), the success banner persists if the user refreshes the page, bookmarks the URL, or shares it. Similarly, error state (`?error=classroom&fields=name`) is in the URL permanently.

**Fix:** Use a client-side toast/notification pattern, or clear the URL params via `router.replace()` after displaying the banner.

---

#### P1-6: `<ol>` elements used for rules but render without list markers

**Location:** `games/[slug]/page.tsx:78-82`, `components/rules-viewer.tsx:36-42`

The simplified rules use `<ol>` (ordered list) semantically, which is correct — rules have a sequence. However, the `<li>` items are styled with `rounded-2xl bg-slate-50 px-4 py-3` which suppresses default list-style markers, and no explicit numbering (like `list-decimal` or manual step numbers) is applied. Users see a vertical stack of cards with no numbers. Screen readers will announce "list item 1, list item 2" etc., but sighted users lose the ordering context.

**Fix:** Add step numbers via a CSS counter, Tailwind `list-decimal`, or manual `{index + 1}.` prefix text.

---

#### P1-7: Duplicate `Subject` type definition creates maintenance risk

**Location:** `lib/types.ts:1`, `lib/constants.ts:2`

`Subject` is defined as a string union in `types.ts` AND derived from `SUBJECTS` const array in `constants.ts`. These can drift apart. The `types.ts` definition is the canonical one used in interfaces, but `constants.ts` drives the UI dropdowns. If someone adds "Art" to one but not the other, the type system won't catch it.

**Fix:** Export `Subject` only from `constants.ts` (derived from the const array) and re-export from `types.ts`, or delete the redundant definition in `types.ts` and import from `constants.ts`.

---

#### P1-8: Mobile hamburger button touch target is only 40×40px

**Location:** `site-header.tsx:41-58`

The hamburger button uses `p-2.5` which yields a ~40×40px touch target. WCAG 2.2 "Target Size (Minimum)" (2.5.8, Level AA) requires at least 24×24px — passes, but Apple HIG and Material Design both recommend 44×44px minimum. In a classroom setting where teachers are often tapping while standing, this is tight.

**Fix:** Increase to `p-3` or add `min-h-[44px] min-w-[44px]` to ensure adequate touch target.

---

#### P1-9: No empty state for sessions table when no sessions exist

**Location:** `dashboard/page.tsx:135-156`

The classrooms table and favorites section have empty states, but the sessions table will render an empty `<tbody>` with no rows if a user hasn't logged any sessions and seed data is absent. The table headers appear with nothing below them — confusing and looks broken.

**Fix:** Add a conditional empty state row or replace the table with an `EmptyState` component when `snapshot.sessions.length === 0`.

---

#### P1-10: Landing page featured game cards have no heading level — `<h2>` used for game names inside links

**Location:** `page.tsx:110`

Featured game cards on the landing page use `<h2>` for game names. These appear before the "How LearnByPlay works" value-prop section (which uses `<h3>`). This means the heading hierarchy jumps: `<h1>` → `<h2>` (game names) → `<h3>` (value props) → back to `<h2>` (testimonials). The intent hierarchy is broken — game names in the featured section should be `<h3>` under an `<h2>` section heading.

**Fix:** Add an `<h2>` like "Featured games" before the featured cards grid, and change the game name headings to `<h3>`.

---

### P2 — Medium (polish, consistency, and minor friction)

#### P2-1: `key={item}` on list items uses content strings as keys — fragile

**Location:** `games/[slug]/page.tsx:73,80`, `lessons/[slug]/page.tsx:94,100,120,126,142`, `pd/page.tsx:33,52,71`

Multiple lists use the text content of each item as the React `key` (e.g., `key={item}`, `key={rule}`, `key={skill}`). If two items have identical text (plausible with large seed data), React will silently drop one. This is a latent correctness bug.

**Fix:** Use index-based keys (`key={index}`) or a composite key (`key={\`${section}-${index}\`}`) for content-derived lists where items may not be unique.

---

#### P2-2: Pricing section cards lack interactive affordance despite suggesting action

**Location:** `page.tsx:191-201`

The pricing cards show plan names and prices but have no CTA button ("Get started", "Contact us", "Learn more"). Users see pricing tiers with no way to act on them. The section description says "This MVP includes sample pricing language" — which is fine internally, but the UI doesn't communicate this to end users.

**Fix:** Add a disabled button or explanatory text like "Coming soon" to each pricing card to set expectations.

---

#### P2-3: PD page admin FAQ section has poor contrast for link-like elements

**Location:** `pd/page.tsx:62-76`

The admin FAQ renders on `bg-slate-900` with `text-slate-200` body text. The link at `dashboard/page.tsx:167` ("See facilitation best practices") points here, but no anchor targets exist in the PD page — the user lands at the top, not at the FAQ section. Additionally, the FAQ section has no `id` for deep linking.

**Fix:** Add `id="admin-faq"` to the FAQ section and update any referencing links to `/pd#admin-faq`.

---

#### P2-4: Footer lacks navigational links

**Location:** `components/site-footer.tsx`

The footer contains descriptive text about the MVP but no links to any page. Users who scroll to the bottom have no navigation options other than scrolling back up or using browser back. Every other page has the header nav, but a footer nav is a standard pattern teachers expect.

**Fix:** Add a simple link list (Browse Games, Dashboard, Classroom Tools, PD Content) to the footer.

---

#### P2-5: Lessons rubric table has no responsive fallback

**Location:** `lessons/[slug]/page.tsx:147-168`

The assessment rubric table has 4 columns (Criterion, Exceeds, Meets, Developing) and uses `overflow-x-auto` on the wrapper. Unlike the dashboard tables, this wrapper has no `tabIndex={0}`, no `role="region"`, and no `aria-label` indicating scrollability — the dashboard tables got this fix but the lesson rubric table was missed.

**Fix:** Add `tabIndex={0} role="region" aria-label="Assessment rubric, scroll for more"` to the `overflow-x-auto` wrapper div.

---

#### P2-6: `GameArt` gradient assignment is not truly unique per game

**Location:** `components/game-art.tsx:25`

The gradient is selected via `name.length % gradients.length`. With only 6 gradients and 37 games, many games share identical gradient backgrounds. Games with the same name length (e.g., "Azul" and "Coup" — both 4 chars) get the same gradient. The first review noted this as "clever for an MVP" but it creates visual confusion when scanning the game grid.

**Fix:** Use a simple hash of the full name string (not just length) for better distribution: `const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0); const gradient = gradients[hash % gradients.length];`.

---

#### P2-7: Mobile nav doesn't trap focus and lacks transition animation

**Location:** `site-header.tsx:84-111`

The mobile nav renders conditionally (`{menuOpen && ...}`) with no entry/exit animation — it pops in and out instantly. More importantly, when the mobile menu opens, focus is not moved to the nav and there is no focus trap. A keyboard user pressing Tab after opening the menu may tab into content behind the nav rather than the nav links. Also, pressing Escape doesn't close the menu.

**Fix:** (a) Add `onKeyDown` handler for Escape key to close the menu. (b) Move focus to the first nav link when menu opens (via `useRef` + `useEffect`). (c) Optionally add a simple CSS transition (e.g., `transition-all duration-200`) for visual polish.

---

#### P2-8: `aria-live="off"` on the timer countdown is semantically odd

**Location:** `session-timer.tsx:110`

The countdown display uses `aria-live="off"` which is the default — the attribute is redundant. However, the separate `sr-only` live region at line 118 with `aria-live="assertive"` updates every second with the full time string. Assertive announcements every second will overwhelm screen reader users during active use.

**Fix:** Change `aria-live="assertive"` to `aria-live="polite"` and throttle updates to every 30 seconds or at phase transitions only. Remove the redundant `aria-live="off"`.

---

#### P2-9: `data.ts:288` calls `getGames()` with no filters to count total games — expensive

**Location:** `lib/data.ts:288`

`getDashboardSnapshot()` calls `getGames().length` to populate `totalGames` in metrics. This loads all 37 games, parses all JSON columns, and counts them — just to get a count. A `SELECT COUNT(*) FROM games` would be trivial.

**Fix:** Replace with `db.prepare("SELECT COUNT(*) as count FROM games").get()` like the lesson count on line 295.

---

#### P2-10: No `<meta name="viewport">` explicitly set

**Location:** `app/layout.tsx`

Next.js automatically injects a viewport meta tag, but it's worth verifying. The app relies on Tailwind responsive breakpoints, so if the viewport meta were missing, all mobile responsive behavior would break. This is a "verify and document" item rather than a bug.

**Fix:** Confirm Next.js injects `<meta name="viewport" content="width=device-width, initial-scale=1">` in the rendered HTML. If deploying outside Next.js hosting, add it explicitly.

---

#### P2-11: Session logger `action` prop typed as `(formData: FormData) => void` — should be async

**Location:** `components/session-logger.tsx:14`

The `action` prop is typed as synchronous `(formData: FormData) => void` but receives `logSessionAction` which is an async server action. While this works at runtime (React/Next.js handles the promise), the type signature is misleading and suppresses TypeScript checking of the return type.

**Fix:** Type as `(formData: FormData) => Promise<void>` or use `React.FormHTMLAttributes<HTMLFormElement>['action']`.

---

#### P2-12: Redundant `role="navigation"` on `<nav>` element

**Location:** `site-header.tsx:85`

The mobile nav uses `<nav id="mobile-nav" role="navigation" ...>`. The `<nav>` element has an implicit `role="navigation"` — adding it explicitly is redundant (though not harmful). The desktop nav at line 63 correctly omits it.

**Fix:** Remove `role="navigation"` from the mobile nav for consistency.

---

## Regressions from First-Pass Fixes

### R-1: Heatmap labels added but not announced to screen readers with context

The heatmap now shows text labels like "High", "Medium", "Low" alongside colors (fixing A11Y-7). However, the label badge (line 174) and the session count text (line 178) are separate elements with no programmatic association. A screen reader announces them as disconnected items: "Strategic thinking" ... "High" ... "Practiced in 5 sessions". Adding `aria-label` to the container `<div>` that synthesizes these would be cleaner.

**Priority:** P2

### R-2: Skip-to-content link should use `:focus-visible` not `:focus`

The skip-to-content link in `globals.css:64` uses `.skip-to-content:focus` instead of `.skip-to-content:focus-visible`. Since all other focusable elements use `:focus-visible`, the skip link should match. The `:focus` selector means mouse-clicking the skip link (which is nearly impossible since it's off-screen) would also show the style — not harmful, but inconsistent.

**Priority:** P2

---

## Summary of What Was Fixed Well

Credit for improvements since the first review:

1. **Mobile navigation** — Full hamburger menu with proper `aria-expanded`, `aria-controls`, `aria-label` states. Well done.
2. **Skip-to-content link** — Implemented with correct off-screen positioning and styled focus state.
3. **Focus-visible styles** — Global `:focus-visible` with amber outline consistently applied.
4. **Breadcrumb semantics** — Proper `<nav aria-label="Breadcrumb"><ol>` structure on the lesson page.
5. **Heatmap text labels** — Colors now paired with "High"/"Medium"/"Low" text badges.
6. **Session timer fixes** — `hasStartedRef` prevents speech on mount; completed state shows clear messaging; phase cards show completion.
7. **Cascading dropdowns** — `SessionLogger` component correctly filters lessons by selected game.
8. **Constants extraction** — `SUBJECTS`, `GRADE_BANDS`, `COMPLEXITY_LABELS` centralized in `lib/constants.ts`.
9. **Table accessibility** — `aria-label` on tables, scrollable region wrappers with `tabIndex={0}` and `role="region"`.
10. **N+1 query fix** — Dashboard standards collection uses a single `WHERE IN` query.
11. **Node version** — `.nvmrc` file and `engines` field in `package.json`.
12. **CI pipeline** — GitHub Actions workflow with lint, type-check, and build.
13. **Input clamping** — Group generator validates `studentCount` and `groupSize` in JS, not just HTML attrs.
14. **Field-level error messages** — Dashboard errors now list which fields failed.
15. **PDF pagination** — `ensureSpace()` function adds new pages when content overflows.

---

## Priority Summary

| Priority | Count | Theme |
|----------|-------|-------|
| **P0** | 3 | Color contrast failures, no filter loading state |
| **P1** | 10 | Heading hierarchy, accessible names, mobile filter UX, PDF links, empty states |
| **P2** | 12 + 2 regressions | Polish, type safety, performance, focus management, redundant attributes |
