# LearnByPlay — UX & Developer Experience Audit

**Reviewed:** June 2025
**Reviewer posture:** Senior engineer encountering the codebase for the first time + product UX auditor
**Scope:** Full product audit — user flows, UI polish, accessibility, code quality, DX, feature completeness vs PRD

---

## Executive Summary

LearnByPlay is an impressively complete MVP for a solo project. The landing page is polished, the game-to-curriculum browser works end-to-end with real filters, lesson detail pages are rich and well-structured, classroom tools (timer, group generator, rules viewer) function, and the dashboard provides real CRUD operations against SQLite. The visual design is consistent and professional — warm amber accents, rounded cards, clear typography hierarchy.

However, significant gaps exist between the PRD's v1 scope and what's implemented, the accessibility story is nearly nonexistent, there are no tests, mobile navigation is missing, and several interactive flows have UX friction that would block real teacher adoption. The app is a strong demo but needs targeted work to become a usable pilot product.

---

## 1. Product UX Audit

### 1.1 User Flows

#### Flow: Find a game → open lesson → export PDF ✅ Mostly works
- Landing page → "Browse game-to-curriculum matches" → filter sidebar → game card → game detail → lesson plan link → lesson detail → "Download as PDF" — this core path works in ~5 clicks.
- **Issue:** The filter form uses native HTML `<form>` submission, causing a full page reload on every filter change. No instant feedback. Teachers with slow connections will think the app is broken.
- **Issue:** The game→lesson relationship is clear, but there's no way to search/browse lessons independently. A teacher who knows they want a "fraction lesson" must first find a game.

#### Flow: Log a session in the dashboard ✅ Works but has friction
- The "Log a classroom session" form shows ALL games and ALL lessons in flat dropdowns — not filtered by each other. Selecting game "Prime Climb" still shows lesson plans for unrelated games.
- **Issue:** No cascading dropdown logic. A teacher selecting a game should only see lessons for that game.

#### Flow: Use classroom tools ✅ Works
- Group generator, session timer, and rules viewer are functional.
- **Issue:** The session timer speaks phase names via `speechSynthesis` on every phase change — including initial load (phase 0). This will surprise users with unexpected audio on page load.

### 1.2 UI Clarity & Visual Design Consistency

**Strengths:**
- Consistent design language: rounded-3xl cards, amber-700 label accents, slate-900/600 text hierarchy, consistent button styles.
- Good use of stat cards (metrics on landing page and dashboard).
- The pricing section and testimonials feel real and grounded.
- `GameArt` component creates visually distinct gradient placeholders per game — clever for an MVP without real images.

**Issues:**

| ID | Issue | Location | Priority |
|---|---|---|---|
| UI-1 | No active/current nav indicator in the header — users can't tell which page they're on | `site-header.tsx` | **P1** |
| UI-2 | No mobile hamburger menu — all 4 nav links plus logo render in a wrapping pill layout that's cramped on small screens | `site-header.tsx` | **P0** |
| UI-3 | Button style inconsistency: the favorite button uses `bg-amber-600` while every other primary button uses `bg-slate-900` | `lessons/[slug]/page.tsx:67` | **P2** |
| UI-4 | Breadcrumbs on lesson page use plain text separators (`/`) with no semantic `<nav aria-label="breadcrumb">` or `<ol>` structure | `lessons/[slug]/page.tsx:46-52` | **P1** |
| UI-5 | Tables in dashboard have no responsive treatment — they overflow with `overflow-x-auto` but lack visual indication of scrollability | `dashboard/page.tsx` | **P1** |

### 1.3 Responsiveness

- Layout uses Tailwind responsive breakpoints consistently (`sm:`, `lg:`, `xl:`).
- Grid layouts collapse to single-column on mobile appropriately.
- **Critical gap:** No mobile navigation pattern. The header nav links wrap onto a second line on small viewports with no hamburger/drawer menu.
- **Issue:** The game browser's sticky filter sidebar (`lg:sticky lg:top-6`) stacks above results on mobile, pushing the actual game cards far down the page. A collapsible/drawer filter pattern would be better.
- **Issue:** The session timer's `text-6xl` countdown is appropriately large for classroom projection, but the control buttons below are small (`px-5 py-3 text-sm`) — the PRD specifically requires "large tap/click targets suitable for classroom movement."

### 1.4 Accessibility

This is the weakest area of the product. The PRD targets **WCAG 2.2 AA**.

| ID | Issue | Severity | Priority |
|---|---|---|---|
| A11Y-1 | Zero `sr-only` utility usage across entire codebase | Major | **P0** |
| A11Y-2 | Zero `role` attributes used anywhere | Major | **P0** |
| A11Y-3 | No focus-visible styles defined — keyboard users cannot see where they are | Critical | **P0** |
| A11Y-4 | `GameArt` uses `aria-hidden="true"` (good) but the game cards themselves have no accessible description of the gradient art placeholder | Minor | **P2** |
| A11Y-5 | Timer phase changes use `aria-live="polite"` on the phase indicator (good), but the countdown number itself has no live region — screen reader users can't track time | Major | **P1** |
| A11Y-6 | Filter form selects have no `id` attributes — `<label>` wraps work, but explicit association is more robust | Minor | **P2** |
| A11Y-7 | Color is used as the sole indicator for skills heatmap levels (emerald=high, amber=medium, slate=low) — PRD explicitly requires color not be the only indicator | Critical | **P0** |
| A11Y-8 | No skip-to-content link | Major | **P1** |
| A11Y-9 | Tables lack `<caption>` elements or `aria-label` — screen readers can't distinguish which table they're in on the dashboard | Major | **P1** |
| A11Y-10 | The speech synthesis in session timer fires on component mount with no user opt-in — this is intrusive and violates autoplay audio expectations | Major | **P1** |

---

## 2. Developer Experience Audit

### 2.1 Onboarding & Setup

**Time from clone to running: ~60 seconds** — `npm install && npm run dev`. SQLite auto-seeds. This is excellent.

**Strengths:**
- README is clear, concise, and lists all routes.
- Zero environment variables needed.
- Database creates itself on first run with realistic seed data.
- Reset instructions are documented (delete the `.db` file).

**Issues:**

| ID | Issue | Priority |
|---|---|---|
| DX-1 | No `.nvmrc` or `engines` field in `package.json` — a developer on Node 18 might have `better-sqlite3` compilation issues | **P1** |
| DX-2 | `CLAUDE.md` just references `AGENTS.md` which only has Next.js version warnings — no architecture overview, coding conventions, or contribution guidelines | **P2** |
| DX-3 | No `CONTRIBUTING.md` or development workflow documentation | **P2** |

### 2.2 Code Organization & Discoverability

**Strengths:**
- Clean separation: `lib/` (data, db, types, utils), `components/` (reusable UI), `app/` (pages and routes).
- Type definitions are centralized in `types.ts` and well-structured.
- Seed data is organized into separate files per entity (`seed/games.ts`, `seed/lessons.ts`, etc.).
- Server actions are consolidated in a single `actions.ts` file.
- Consistent file naming (kebab-case components, page.tsx convention).

**Issues:**

| ID | Issue | Priority |
|---|---|---|
| DX-4 | `data.ts` is a 278-line god-file combining all data access functions — as more features are added, this should split into domain-specific modules (e.g., `data/games.ts`, `data/lessons.ts`, `data/dashboard.ts`) | **P2** |
| DX-5 | `db.ts` combines schema creation, seeding, and connection management in one file. Schema migrations will be painful if the DB structure evolves | **P1** |
| DX-6 | The `getGames()` function loads ALL games from DB, deserializes ALL JSON fields, then filters in JavaScript. With 37 games this is fine; at 300+ (PRD Year 1 target) this will degrade | **P1** |
| DX-7 | No `constants.ts` — magic values like subjects (`['Math', 'Science', ...]`) and grade bands (`['K-2', '3-5', ...]`) are duplicated across `games/page.tsx` and `dashboard/page.tsx` | **P1** |

### 2.3 Error Handling & Debugging

**Strengths:**
- Custom `error.tsx` boundaries at root, `/games`, and `/dashboard` levels — good granularity.
- Error messages are user-friendly and suggest actionable next steps (restart app, retry).
- Server actions validate required fields and redirect with error params.
- `notFound()` is called correctly when game/lesson slugs don't match.

**Issues:**

| ID | Issue | Priority |
|---|---|---|
| DX-8 | Server actions use redirect-with-query-param for error reporting (`?error=classroom`), but the dashboard page shows a generic message regardless of which field failed — no field-level validation feedback | **P1** |
| DX-9 | No server-side logging — if a DB query fails or seed data is corrupt, the only signal is the error boundary rendering. Add structured logging | **P1** |
| DX-10 | The PDF route returns plain text `"Lesson not found"` with status 404 — this is fine for an API but if a user navigates there in a browser they see a raw text response, not the styled 404 page | **P2** |
| DX-11 | The PDF generation has no overflow protection — if a lesson has many objectives/materials, the content will draw below the page boundary (`cursor` goes negative) with no page-break logic | **P1** |

### 2.4 Testing

**There are zero tests.** No test framework is installed, no test config exists, no test scripts in `package.json`.

| ID | Issue | Priority |
|---|---|---|
| DX-12 | No test infrastructure at all — no unit tests, integration tests, or E2E tests | **P0** |
| DX-13 | The data layer (filtering, sorting, dashboard snapshot aggregation) is pure logic that's trivially testable but untested | **P0** |
| DX-14 | Server actions (create classroom, log session, toggle favorite) mutate the database with no test coverage | **P1** |

### 2.5 Tooling & Automation

**Present:** ESLint, TypeScript strict mode, Tailwind CSS, PostCSS.
**Missing:**

| ID | Issue | Priority |
|---|---|---|
| DX-15 | No Prettier or formatting tool — code style consistency depends on individual discipline | **P1** |
| DX-16 | No pre-commit hooks (husky/lint-staged) — linting isn't enforced before commits | **P2** |
| DX-17 | No CI/CD pipeline (no GitHub Actions, no `.github/` directory) | **P1** |
| DX-18 | No database migration tooling — schema changes require deleting the DB and re-seeding | **P1** |

---

## 3. Feature Completeness vs PRD

### Implemented (partial or full)

| PRD Requirement | Status | Notes |
|---|---|---|
| FR-02 Standards Catalog | ✅ Partial | Standards exist in DB and display on game/lesson pages, but no standalone standards browsing page |
| FR-03 Game Catalog and Metadata | ✅ Good | 37 games with rich metadata, classroom fit, simplified rules |
| FR-04 Search/Filter Engine | ✅ Good | 7 filter dimensions, near-match suggestions on empty results |
| FR-05 Lesson Plans + Export | ✅ Good | 12 lessons with variants, rubrics, PDF export |
| FR-06 Classroom Management | ⚠️ Basic | Create classroom only — no roster/student management, no CSV import |
| FR-07 Session Tools | ⚠️ Basic | Timer and group generator exist but are disconnected from lessons/classrooms |
| FR-09 Evidence Reports | ⚠️ Basic | Skills heatmap and session log — not a real reporting dashboard |

### Not Implemented

| PRD Requirement | Status | Impact |
|---|---|---|
| FR-01 Authentication & RBAC | ❌ Missing | No login, no roles, no multi-user support |
| FR-06 Roster/Student Management | ❌ Missing | No CSV import, no Google Classroom sync, no student records |
| FR-07 Live Session Run Mode | ❌ Missing | Timer exists as standalone tool, not integrated with lesson/classroom context |
| FR-08 Assessment & Reflection | ❌ Missing | No rubric scoring, no observation capture, no student reflections |
| FR-09 Full Evidence Reports | ❌ Missing | No filterable reports, no date ranges, no CSV/PDF report exports |
| FR-10 Content Authoring Workflow | ❌ Missing | Content is static seed data with no create/edit/publish flow |
| FR-11 Procurement Wishlist | ❌ Missing | No wishlist or kit builder |

### PRD Compliance Summary
The MVP implements approximately **40% of v1 Must-have requirements** by feature count. The implemented features are well-built for what they cover (catalog, search, lesson detail, PDF export), but the entire assessment/evidence and user management layers are absent. This is appropriate for a demo/prototype but would need significant work for a teacher pilot.

---

## 4. Polish Audit

### Loading States ✅ Good
- Root, `/games`, and `/dashboard` all have skeleton loading screens with `animate-pulse`.
- Skeleton layouts match the actual page structure (filter sidebar + 3-column grid for games, 4 metric cards + 2-column layout for dashboard).

### Error States ✅ Good
- Dedicated `error.tsx` at three levels with contextual messaging.
- `not-found.tsx` is styled and offers navigation options.

### Empty States ⚠️ Partial
- Reusable `EmptyState` component exists and is used for zero search results and zero favorites.
- **Missing:** No empty state for the sessions table when it's empty (though seed data prevents this in practice).
- **Missing:** No empty state guidance for the skills heatmap when no sessions exist.

### Edge Cases

| ID | Issue | Priority |
|---|---|---|
| EDGE-1 | Group generator allows `studentCount=0` or negative values — produces empty groups | **P1** |
| EDGE-2 | Group generator uses `studentCount > 40` without warning despite max=40 attribute — the input `max` attribute doesn't prevent typing larger values | **P2** |
| EDGE-3 | Session timer doesn't stop or indicate completion when the last phase ends — it just stays at 00:00 and re-triggers the same phase | **P1** |
| EDGE-4 | Dashboard session logger accepts any combination of game + lesson, even if the lesson isn't for that game — no validation | **P1** |
| EDGE-5 | PDF generation has no page-break logic — lessons with long content overflow off the page | **P1** |
| EDGE-6 | The "Clear" link on the games filter page navigates to `/games` — but doesn't visually reset the form inputs if the user hasn't submitted yet (native form behavior), which may confuse users | **P2** |
| EDGE-7 | `speechSynthesis` in session timer fires on initial render (phase 0) before user interacts — unexpected audio on page load | **P1** |
| EDGE-8 | Dashboard success banners (`?created=1`, `?logged=1`) persist in the URL — refreshing shows the banner again. These should be cleared or use a flash message pattern | **P2** |

### Micro-interactions
- Hover lift on game cards (`hover:-translate-y-1 hover:shadow-lg`) — nice touch.
- Button hover transitions are consistent.
- `SubmitButton` shows pending state during form submission — good.
- **Missing:** No transition/animation on filter results changing.
- **Missing:** No confirmation before destructive actions (removing a favorite).

---

## 5. Performance Audit

### Rendering Efficiency

| ID | Issue | Priority |
|---|---|---|
| PERF-1 | `getGames()` loads ALL games and deserializes ALL JSON columns, then filters in JS — should push filters to SQL WHERE clauses | **P1** |
| PERF-2 | `getDashboardSnapshot()` calls `getGameBySlug()` in a loop for each session to collect standards — this is N+1 query pattern | **P1** |
| PERF-3 | Dashboard page calls `getGames()` then `getLessonsByGameSlug()` for every game to populate the lesson dropdown — loads entire catalog on every dashboard render | **P1** |
| PERF-4 | All data-fetching pages use `force-dynamic` — appropriate for an MVP with mutations, but caching strategy should be planned | **P2** |
| PERF-5 | The tools page sends 15 games' simplified rules arrays as serialized props to the client — with longer rule lists this becomes a large page payload | **P2** |

### Data Loading Patterns
- SQLite with WAL mode is a good choice for local MVP.
- `getDb()` uses a global singleton pattern — correct for Next.js dev/prod.
- Seed data runs in a transaction — good.
- **Issue:** No database indexes beyond primary keys. As data grows, queries on `game_slug`, `classroom_id`, `session_date` will slow down.

---

## 6. Recommendations

### P0 — Critical (blocks pilot usability)

1. **Add focus-visible styles and keyboard navigation** — Define `:focus-visible` rings on all interactive elements. Teachers on accessibility-mandated school devices will be blocked. (`globals.css`, all interactive elements)

2. **Fix the skills heatmap to not rely solely on color** — Add text labels like "High (4 sessions)", "Medium (2 sessions)" or icons alongside color coding. The PRD explicitly requires this. (`dashboard/page.tsx:171`)

3. **Add mobile navigation** — Implement a hamburger/drawer menu for viewports below `sm`. Currently the nav is unusable on phones. (`site-header.tsx`)

4. **Install a test framework and write foundational tests** — Add Vitest, write tests for: `getGames()` filtering/sorting logic, `getDashboardSnapshot()` aggregation, server action validation. This is pure logic with zero UI dependency. (`lib/data.ts`, `app/actions.ts`)

### P1 — High (significant UX/DX friction)

5. **Add active nav state** — Use `usePathname()` in the header to highlight the current section. (`site-header.tsx`)

6. **Fix the session timer edge cases** — Don't fire `speechSynthesis` on mount; only on user-initiated phase changes. Stop the timer when the last phase completes. Show a "Session complete" state. (`session-timer.tsx`)

7. **Add cascading dropdown logic to the session logger** — When a game is selected, filter the lesson dropdown to only show lessons for that game. (`dashboard/page.tsx`)

8. **Add field-level form validation** — Replace redirect-with-error-param pattern with inline validation messages. Show which specific field needs attention. (`actions.ts`, `dashboard/page.tsx`)

9. **Fix PDF page overflow** — Add multi-page support to the PDF generator. Track cursor position and add new pages when content would overflow. (`api/lessons/[slug]/pdf/route.ts`)

10. **Extract shared constants** — Create `lib/constants.ts` for subjects, grade bands, complexity labels. Remove duplication across pages. (`games/page.tsx`, `dashboard/page.tsx`)

11. **Add Node.js version constraint** — Add `engines` field to `package.json` and/or `.nvmrc` file.

12. **Validate group generator inputs** — Clamp `studentCount` to 2–40 and `groupSize` to 2–8 in the state setter, not just in the HTML attributes. (`group-generator.tsx`)

13. **Add a skip-to-content link** — Standard accessibility requirement. (`layout.tsx`)

14. **Add table captions** — All dashboard tables need `<caption>` or `aria-label` for screen readers. (`dashboard/page.tsx`)

15. **Push game filters to SQL** — Refactor `getGames()` to build SQL WHERE clauses from filters instead of loading all rows and filtering in JavaScript. (`lib/data.ts`)

16. **Fix N+1 query in dashboard** — Pre-load game standards in a single query instead of calling `getGameBySlug()` per session. (`lib/data.ts:237`)

17. **Add breadcrumb semantics** — Wrap lesson breadcrumbs in `<nav aria-label="Breadcrumb"><ol>` structure. (`lessons/[slug]/page.tsx`)

18. **Set up CI** — Add a GitHub Actions workflow that runs lint + type-check + tests on push/PR.

### P2 — Medium (polish and long-term quality)

19. **Add Prettier** — Install and configure with a `.prettierrc`. Add `format` and `format:check` scripts.

20. **Add a standalone lessons browsing page** — Teachers should be able to browse/search all lessons directly, not only through game detail pages. New route: `/lessons`.

21. **Add a standalone standards browsing page** — The PRD requires standards browsing (FR-02). New route: `/standards`.

22. **Use flash messages instead of URL params for success/error** — Dashboard success banners persist on refresh. Use cookies or a client-side toast pattern. (`dashboard/page.tsx`)

23. **Add collapsible filter panel on mobile** — The game browser's filter sidebar should collapse to a "Filters" button on small screens. (`games/page.tsx`)

24. **Make session timer buttons larger** — The PRD requires large tap targets for classroom use. Timer control buttons should be at least 48x48px touch targets. (`session-timer.tsx`)

25. **Add responsive table treatment** — Consider card-based layouts for tables on mobile, or at minimum add a visual scroll indicator. (`dashboard/page.tsx`)

26. **Split `data.ts` into domain modules** — As the feature set grows, break into `lib/data/games.ts`, `lib/data/lessons.ts`, `lib/data/dashboard.ts`.

27. **Add database indexes** — Create indexes on `sessions.classroom_id`, `sessions.game_slug`, `sessions.lesson_slug`, `favorites.lesson_slug`. (`db.ts`)

28. **Add pre-commit hooks** — Install husky + lint-staged for automated lint/format on commit.

29. **Add confirmation for destructive actions** — "Remove favorite" should have a confirmation step or undo option. (`lessons/[slug]/page.tsx`)

30. **Improve the "Explore the catalog" button visibility** — It's hidden on mobile (`hidden sm:inline-flex`) with no mobile alternative. (`site-header.tsx`)

---

## 7. Comparison to Best Practices

| Area | Industry Standard | LearnByPlay Status | Gap |
|---|---|---|---|
| **Accessibility** | WCAG 2.2 AA with automated CI checks (axe-core) | Near-zero a11y implementation | Critical |
| **Testing** | 70%+ coverage, unit + integration + E2E | 0% coverage, no framework installed | Critical |
| **Mobile nav** | Responsive hamburger/drawer menu | Desktop-only nav wrapping on mobile | Major |
| **Form validation** | Inline field-level errors with accessible announcements | Redirect-with-query-param, generic messages | Major |
| **CI/CD** | Automated lint, type-check, test, build on every PR | No CI pipeline | Major |
| **Auth** | Token-based auth with role management | No auth at all | Expected for MVP, but blocks pilot |
| **Code formatting** | Prettier + enforced via CI | No formatter configured | Moderate |
| **Error monitoring** | Sentry or equivalent | No error tracking | Expected gap for MVP |
| **Database migrations** | Version-controlled schema migrations | Delete DB and re-seed | Moderate |
| **Component library** | Shared design tokens, documented component API | Inline Tailwind classes, no Storybook | Acceptable for MVP |

---

## 8. What's Done Well

Credit where due — these things are genuinely good:

1. **Zero-config local setup** — `npm install && npm run dev` with auto-seeding SQLite is the gold standard for MVP DX.
2. **Rich seed data** — 37 games, 20 standards, 12 lesson plans with rubrics and variants. This makes the demo feel real.
3. **Visual design consistency** — The warm amber + slate palette, rounded cards, and typography hierarchy are cohesive and professional.
4. **Loading/error boundaries** — Skeleton screens and error pages at multiple levels show attention to polish.
5. **PDF export** — A working PDF generation pipeline using `pdf-lib` is a non-trivial feature that adds real teacher value.
6. **Lesson variant switching** — The 30/45/60-minute variant tabs with sequence details are a standout feature that maps directly to real teacher needs.
7. **Near-match suggestions** — When filters return zero games, showing relaxed alternatives is thoughtful UX.
8. **Server actions with pending states** — Using `useFormStatus` for submit buttons is a modern React pattern done correctly.
9. **TypeScript coverage** — Full TypeScript with proper interfaces for all domain entities.
10. **Empty state component** — A reusable, well-designed `EmptyState` component used consistently.
