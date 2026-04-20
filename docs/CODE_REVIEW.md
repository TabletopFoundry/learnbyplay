# Code Quality & Architecture Review — LearnByPlay

**Reviewed**: 2025  
**Codebase**: Next.js 16 + React 19 + TypeScript 5 + SQLite (better-sqlite3) + Tailwind CSS 4  
**Total Lines (src/)**: ~3,263 across 30 source files  
**Test Coverage**: 0% (zero test files)

---

## Executive Summary

| Dimension              | Rating        |
|------------------------|---------------|
| Overall Quality Score  | **C+**        |
| Architecture Health    | **Fair**      |
| Maintainability Index  | **Medium**    |
| Technical Debt         | **Medium**    |

The codebase is a functional MVP with solid UI/UX polish, good accessibility basics (skip-nav, ARIA landmarks, focus-visible), and clean Tailwind styling. However, it has **zero test coverage**, **security concerns in data access**, **binary files tracked in Git**, and a **monolithic data layer** that will resist scaling. The issues below are actionable and ordered by business risk.

---

## Critical Findings — P0 (Must Address)

### P0-1 · SQLite WAL files committed to Git
**Files**: `data/learnbyplay.db-shm`, `data/learnbyplay.db-wal`  
**Impact**: Binary WAL/SHM files change on every write, bloat the repo, and cause merge conflicts. The `.gitignore` pattern `data/*.db` does **not** match `.db-shm` or `.db-wal` extensions.

**Fix**:
```gitignore
# .gitignore — replace the current data lines with:
data/
```
Then remove the tracked files:
```bash
git rm --cached data/learnbyplay.db-shm data/learnbyplay.db-wal
```

---

### P0-2 · Potential SQL injection via string interpolation
**File**: `src/lib/db.ts:21`
```ts
const row = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
```
**File**: `src/lib/data.ts:254`
```ts
const placeholders = Array.from(gameSlugSet).map(() => "?").join(",");
const rows = db.prepare(`SELECT standards FROM games WHERE slug IN (${placeholders})`).all(...);
```

The `db.ts:21` usage interpolates the `table` variable directly into SQL. Although the values come from a hardcoded `const` array today, this pattern is dangerous and easy to misuse if the array source ever changes.

The `data.ts:254` pattern constructs a dynamic `IN (?, ?, ?)` clause — this one is **safe** because the placeholders are `?` only, but the style is fragile and should use a helper.

**Fix for db.ts:21**: Since the table names are from a compile-time constant, add an explicit allowlist assertion:
```ts
const ALLOWED_TABLES = new Set(tables);
for (const table of tables) {
  if (!ALLOWED_TABLES.has(table)) throw new Error(`Invalid table: ${table}`);
  const row = db.prepare(`SELECT COUNT(*) as count FROM "${table}"`).get() as { count: number };
  // ...
}
```
Or better, use a single query:
```ts
const counts = db.prepare(
  `SELECT (SELECT COUNT(*) FROM standards) +
         (SELECT COUNT(*) FROM games) +
         ... AS total`
).get();
```

---

### P0-3 · Server actions accept unsanitized input without length/format validation
**File**: `src/app/actions.ts:13-34` (`createClassroomAction`), `:36-60` (`logSessionAction`)

Form inputs are cast via `String()` but never validated for:
- Maximum length (a user can POST megabytes in `name` or `notes`)
- Character constraints (e.g., `gradeBand` should be one of the `GRADE_BANDS` enum values)
- Date format (the `sessionDate` is written to SQLite without verifying ISO format)

**Fix**: Add a validation layer:
```ts
import { GRADE_BANDS, SUBJECTS } from "@/lib/constants";

function validateString(value: unknown, maxLength = 500): string {
  const str = String(value ?? "").trim();
  if (str.length > maxLength) throw new Error("Input too long");
  return str;
}

function validateEnum<T extends string>(value: unknown, allowed: readonly T[]): T {
  const str = String(value ?? "");
  if (!allowed.includes(str as T)) throw new Error(`Invalid value: ${str}`);
  return str as T;
}
```
Apply to every server action parameter. Validate `gradeBand` against `GRADE_BANDS`, `subject` against `SUBJECTS`, `sessionDate` against a date regex, and cap `name`/`notes` length.

---

### P0-4 · Zero test coverage
**Impact**: No test files exist anywhere in the project. No test runner is configured in `package.json`. CI runs lint, type-check, and build — but never tests.

**Fix (phased)**:
1. Install a test runner: `npm install -D vitest @testing-library/react @testing-library/jest-dom`
2. Add `"test": "vitest run"` to `package.json` scripts and add it to CI.
3. **Priority test targets** (highest value per effort):
   - `src/lib/utils.ts` — pure functions, trivial to test
   - `src/lib/data.ts` — query logic with filters and sort; use an in-memory SQLite DB
   - `src/app/actions.ts` — server actions with validation edge cases
   - `src/app/api/lessons/[slug]/pdf/route.ts` — PDF generation (smoke test: returns 200 + valid PDF bytes)

---

## Architectural Concerns — P1

### P1-1 · `data.ts` is a 301-line God Module
**File**: `src/lib/data.ts`

This single file holds **all** data access: 4 mapper functions, 15 exported query functions, filtering logic, aggregation (`getDashboardSnapshot`), and sorting. It violates SRP — any change to games, lessons, standards, sessions, or dashboard metrics touches this file.

**Fix**: Extract into domain-specific modules:
```
src/lib/data/
  games.ts        — getGames, getGameBySlug, getFeaturedGames, getNearMatches
  lessons.ts      — getLessonBySlug, getLessonsByGameSlug, getFavoriteLessons, isFavoriteLesson
  standards.ts    — getStandards
  sessions.ts     — getSessions, getClassrooms
  dashboard.ts    — getDashboardSnapshot, getCatalogInsights
  mappers.ts      — mapGame, mapLesson, mapArticle, mapStandard, parseJson
  index.ts        — re-exports
```

---

### P1-2 · N+1 query pattern in dashboard page
**File**: `src/app/dashboard/page.tsx:36-41`
```ts
for (const game of games) {
  const gameLessons = getLessonsByGameSlug(game.slug);
  if (gameLessons.length > 0) {
    lessonsByGame[game.slug] = gameLessons;
  }
}
```
This executes one SQL query per game to build a dropdown mapping. With the current seed of ~37 games this means ~37 extra queries on every dashboard load.

**Fix**: Add a bulk function to `data.ts`:
```ts
export function getAllLessonsGroupedByGame(): Record<string, LessonPlan[]> {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM lessons ORDER BY game_slug, title").all();
  const grouped: Record<string, LessonPlan[]> = {};
  for (const row of rows) {
    const lesson = mapLesson(row as Record<string, unknown>);
    (grouped[lesson.gameSlug] ??= []).push(lesson);
  }
  return grouped;
}
```

---

### P1-3 · `getDashboardSnapshot` has a massive inline return type
**File**: `src/lib/data.ts:230-243`

The return type is a 12-line inline object type with nested `metrics` and `skillsHeatmap` arrays. This makes it hard to reference elsewhere and defeats TypeScript's documentation benefits.

**Fix**: Extract to `types.ts`:
```ts
export interface DashboardMetrics {
  classCount: number;
  sessionCount: number;
  favoriteCount: number;
  standardsCovered: number;
  totalGames: number;
  totalStandards: number;
}

export interface SkillHeatmapEntry {
  skill: string;
  count: number;
  level: "high" | "medium" | "low";
}

export interface DashboardSnapshot {
  classrooms: Classroom[];
  sessions: SessionRecord[];
  favoriteLessons: LessonPlan[];
  metrics: DashboardMetrics;
  skillsHeatmap: SkillHeatmapEntry[];
}
```

---

### P1-4 · Hardcoded demo data in raw SQL strings
**File**: `src/lib/db.ts:94-110`

Seed classrooms and sessions are written as raw multi-value SQL strings, not using the prepared statement pattern the rest of the seeder uses. This is inconsistent and hard to maintain.

**Fix**: Move demo classrooms and sessions into `src/lib/seed/` as typed arrays matching the pattern used for games, lessons, standards, and PD articles.

---

### P1-5 · `parseJson` silently trusts input — no error boundary
**File**: `src/lib/data.ts:12-14`
```ts
function parseJson<T>(value: string): T {
  return JSON.parse(value) as T;
}
```
If a column contains malformed JSON (data corruption, migration error), this will throw an unhandled `SyntaxError` that surfaces as a 500 error.

**Fix**: Add a safe variant with fallback:
```ts
function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    console.error(`Failed to parse JSON: ${value.slice(0, 100)}`);
    return fallback;
  }
}
```

---

### P1-6 · PDF route mixes HTTP handling with PDF rendering
**File**: `src/app/api/lessons/[slug]/pdf/route.ts` (121 lines)

The entire PDF layout (margins, fonts, text wrapping, page breaks, section headings) lives inside the route handler. This makes the rendering logic untestable and unreusable.

**Fix**: Extract into `src/lib/pdf.ts`:
```ts
export async function generateLessonPdf(lesson: LessonPlan, game: Game, variant: LessonVariant): Promise<Uint8Array> { ... }
```
The route handler becomes a thin adapter:
```ts
const bytes = await generateLessonPdf(lesson, game, variant);
return new Response(new Blob([bytes]), { headers: { ... } });
```

---

### P1-7 · `FlashBanner` hardcodes redirect to `/dashboard`
**File**: `src/components/flash-banner.tsx:15`
```ts
router.replace("/dashboard", { scroll: false });
```
This component is coupled to a specific route. If reused elsewhere, it will unexpectedly navigate the user to `/dashboard`.

**Fix**: Accept a `cleanUrl` prop or use `usePathname()` to replace only the query params:
```ts
const pathname = usePathname();
router.replace(pathname, { scroll: false });
```

---

### P1-8 · No environment/config management
**File**: `src/lib/db.ts:7-8`
```ts
const dataDirectory = path.join(process.cwd(), "data");
const dbPath = path.join(dataDirectory, "learnbyplay.db");
```
The database path is hardcoded. There is no way to configure a different path for testing, staging, or production without editing source code.

**Fix**: Read from an environment variable with a sensible default:
```ts
const dbPath = process.env.LEARNBYPLAY_DB_PATH ?? path.join(process.cwd(), "data", "learnbyplay.db");
```

---

### P1-9 · Duplicated error boundary components
**Files**: `src/app/error.tsx`, `src/app/dashboard/error.tsx`, `src/app/games/error.tsx`

Three nearly identical error boundary components with only the title and description varying.

**Fix**: Create a shared `ErrorFallback` component:
```tsx
// src/components/error-fallback.tsx
export function ErrorFallback({ title, description, reset }: { title: string; description: string; reset: () => void }) { ... }
```
Then each `error.tsx` becomes a 5-line wrapper.

---

### P1-10 · Home page embeds business data inline
**File**: `src/app/page.tsx:6-43`

Testimonials (3 objects) and pricing tiers (3 objects) are hardcoded in the component file. This mixes content with presentation, making localization and A/B testing harder.

**Fix**: Move to `src/lib/content.ts` or a JSON/MDX file:
```ts
export const testimonials = [ ... ];
export const pricingTiers = [ ... ];
```

---

## Code Smell Inventory — P2

### P2-1 · Fragile string splitting in GroupGenerator
**File**: `src/components/group-generator.tsx:31`
```ts
const randomized = shuffle(students.map((s, i) => `${s}-${i}-${seed}`))
  .map((value) => value.split("-")[0]);
```
This encodes the seed into a string then splits on `-` to recover the original name. If a student name ever contains a dash, this breaks. The entire approach is used only to trigger a re-shuffle on seed change — `useMemo` already handles that via its dependency array.

**Fix**: Shuffle the indices array instead:
```ts
const indices = shuffle(Array.from({ length: studentCount }, (_, i) => i));
const result: string[][] = [];
for (let i = 0; i < indices.length; i += groupSize) {
  result.push(indices.slice(i, i + groupSize).map(j => `Student ${j + 1}`));
}
```

---

### P2-2 · Inconsistent mapping patterns
**Files**: `src/lib/data.ts:172-184` (inline mapper for `getClassrooms`), `src/lib/data.ts:198-213` (inline mapper for `getSessions`) vs. extracted `mapGame`, `mapLesson`, `mapArticle`, `mapStandard` functions.

Two data access functions use inline mapping while four others use extracted mapper functions. This inconsistency makes the codebase harder to navigate.

**Fix**: Extract `mapClassroom` and `mapSession` functions to match the existing pattern.

---

### P2-3 · Magic numbers
| Location | Value | Meaning |
|---|---|---|
| `src/app/tools/page.tsx:13` | `.slice(0, 15)` | Max games in rules viewer |
| `src/lib/data.ts:142` | `.slice(0, 6)` | Near-match limit |
| `src/lib/data.ts:145` | `limit = 6` | Featured games default |
| `src/lib/data.ts:275` | `count >= 4 ? "high" : count >= 2 ? "medium" : "low"` | Heatmap thresholds |
| `src/app/api/.../route.ts:55` | `750` | PDF top margin cursor |
| `src/app/api/.../route.ts:54` | `PAGE_BOTTOM_MARGIN = 60` | Only one PDF constant is named |

**Fix**: Define named constants in `src/lib/constants.ts`:
```ts
export const NEAR_MATCH_LIMIT = 6;
export const FEATURED_GAMES_LIMIT = 6;
export const RULES_VIEWER_GAME_LIMIT = 15;
export const SKILL_HEATMAP_THRESHOLDS = { high: 4, medium: 2 } as const;
```

---

### P2-4 · No pagination on any list endpoint
**Files**: `getGames`, `getSessions`, `getStandards`, `getPdArticles`

All query functions return every row in the table. With the current seed data (~37 games, ~12 lessons) this is fine, but it won't scale.

**Fix**: Add optional `limit`/`offset` parameters to query functions and paginate in the UI.

---

### P2-5 · Seed data files have extremely long lines
**File**: `src/lib/seed/games.ts` — each game is a single line (~800+ characters).

**Fix**: Format as multi-line object literals for readability and cleaner diffs.

---

### P2-6 · `getCatalogInsights` is inefficient
**File**: `src/lib/data.ts:294-301`
```ts
export function getCatalogInsights() {
  return {
    games: getGames().length,    // fetches ALL games + parses JSON for each
    lessons: lessonCount.count,  // efficient COUNT(*)
    standards: getStandards().length,  // fetches ALL standards
  };
}
```
Two of three metrics fetch full result sets and throw them away just to get a count.

**Fix**: Use `SELECT COUNT(*) FROM games` and `SELECT COUNT(*) FROM standards`.

---

### P2-7 · `formatDate` doesn't handle invalid input
**File**: `src/lib/utils.ts:3-8`
```ts
export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", { ... }).format(new Date(dateString));
}
```
`new Date("invalid")` produces `Invalid Date`, and `Intl.DateTimeFormat.format(Invalid Date)` returns `"Invalid Date"` — no explicit error handling.

**Fix**:
```ts
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-US", { ... }).format(date);
}
```

---

### P2-8 · Duplicated Tailwind utility patterns
Multiple files repeat the same card/section patterns: `rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm`, `rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200`, etc.

**Fix**: Extract shared CSS utility classes or component abstractions:
```tsx
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm ${className ?? ""}`}>{children}</div>;
}
```

---

## SOLID Violations

| Principle | Violation | Location | Severity |
|-----------|-----------|----------|----------|
| **SRP** | `data.ts` handles queries, mapping, filtering, sorting, and aggregation for all 6 domain entities | `src/lib/data.ts` | P1 |
| **SRP** | Dashboard page does data fetching, N+1 queries, URL parsing, form rendering, and table rendering | `src/app/dashboard/page.tsx` | P1 |
| **SRP** | PDF route handler does HTTP routing + PDF layout + text wrapping | `src/app/api/.../route.ts` | P1 |
| **OCP** | `getGames` filter logic uses if-chains that must be modified to add new filters | `src/lib/data.ts:87-136` | P2 |
| **DIP** | All data functions call `getDb()` directly — there's no abstraction for the data source, making it untestable without the real DB | `src/lib/data.ts` (all functions) | P1 |

---

## Refactoring Roadmap

### High Impact, Low Effort
1. **Fix `.gitignore`** to exclude all `data/` files and remove tracked WAL files (P0-1)
2. **Add input validation** to server actions with length caps and enum checks (P0-3)
3. **Extract `parseJson` error handling** with fallback (P1-5)
4. **Fix `FlashBanner` hardcoded path** to use `usePathname()` (P1-7)
5. **Replace inefficient `getCatalogInsights`** with COUNT queries (P2-6)
6. **Fix fragile string splitting** in GroupGenerator (P2-1)
7. **Add `formatDate` guard** for invalid dates (P2-7)

### High Impact, High Effort
8. **Add test infrastructure** and write initial unit tests for `utils.ts`, `data.ts`, `actions.ts` (P0-4)
9. **Split `data.ts` into domain modules** (P1-1)
10. **Extract PDF generation** into a testable `pdf.ts` module (P1-6)
11. **Fix N+1 dashboard query** with bulk lesson fetch (P1-2)

### Medium Impact, Low Effort
12. **Extract inline return types** to `types.ts` (P1-3)
13. **Define named constants** for magic numbers (P2-3)
14. **Create shared `ErrorFallback` component** (P1-9)
15. **Move testimonials/pricing to content file** (P1-10)
16. **Add environment variable for DB path** (P1-8)
17. **Extract `mapClassroom` and `mapSession`** functions (P2-2)

### Low Impact, Low Effort
18. **Format seed data files** with multi-line objects (P2-5)
19. **Extract shared Tailwind card patterns** into components (P2-8)
20. **Move hardcoded seed classrooms/sessions** into seed data files (P1-4)

---

## Positive Observations

These are genuine strengths that should be preserved:

1. **Accessibility**: Skip-to-content link, ARIA landmarks (`role="banner"`, `role="contentinfo"`), `aria-label` on tables, `aria-live` regions on the timer, `aria-current="page"` on active nav links, and `:focus-visible` styling. This is above-average for an MVP.

2. **Type safety**: TypeScript strict mode is enabled, interfaces are well-defined in `types.ts`, and `satisfies` is used where appropriate. The `as const` pattern for `SUBJECTS` and `GRADE_BANDS` generates narrow literal types.

3. **Clean component API design**: Components like `SubmitButton`, `EmptyState`, `GameArt`, and `SessionLogger` have focused, minimal prop interfaces. Each does one thing well.

4. **Server actions**: Proper use of Next.js server actions with `revalidatePath` and `redirect`. The `toggleFavoriteLessonAction` correctly supports a dynamic redirect target.

5. **Database design**: Good use of WAL mode, `CREATE TABLE IF NOT EXISTS` for idempotent schema creation, transactions for seeding, and foreign keys for referential integrity.

6. **CI pipeline**: Lint → Type-check → Build pipeline catches errors early.

7. **Loading states**: Every route segment has a skeleton loading component with `animate-pulse`.

8. **Error boundaries**: Every major route has a dedicated error boundary with user-friendly messaging and a retry button.

9. **Mobile responsiveness**: Responsive navigation with a hamburger menu, responsive grid layouts, and `details`/`summary` for filter collapse on mobile.

10. **Global singleton pattern**: `getDb()` correctly uses `global.__learnByPlayDb` to survive HMR reloads in development, which is the recommended pattern for database connections in Next.js.

---

## Detailed File-Level Findings

### `src/lib/db.ts` (217 lines)
| Line | Finding | Priority |
|------|---------|----------|
| 21 | String interpolation in SQL `FROM ${table}` | P0-2 |
| 94-110 | Hardcoded seed data in raw SQL strings (inconsistent with rest of seeder) | P1-4 |
| 7-8 | Hardcoded DB path with no env var override | P1-8 |

### `src/lib/data.ts` (301 lines)
| Line | Finding | Priority |
|------|---------|----------|
| 1-301 | God Module — all queries for 6 entities in one file | P1-1 |
| 12-14 | `parseJson` has no error handling | P1-5 |
| 172-184 | Inline mapping for `getClassrooms` (inconsistent) | P2-2 |
| 198-213 | Inline mapping for `getSessions` (inconsistent) | P2-2 |
| 230-243 | Massive inline return type for `getDashboardSnapshot` | P1-3 |
| 254 | Dynamic SQL placeholder construction (safe but fragile) | P2 |
| 275 | Magic heatmap thresholds (4, 2) | P2-3 |
| 294-301 | Inefficient count-by-fetch in `getCatalogInsights` | P2-6 |

### `src/app/actions.ts` (83 lines)
| Line | Finding | Priority |
|------|---------|----------|
| 14-17 | No max-length or format validation on inputs | P0-3 |
| 16 | `gradeBand` default `"3-5"` — not validated against `GRADE_BANDS` | P0-3 |
| 40 | `sessionDate` not validated as ISO date | P0-3 |

### `src/app/dashboard/page.tsx` (218 lines)
| Line | Finding | Priority |
|------|---------|----------|
| 36-41 | N+1 query loop: `getLessonsByGameSlug` for every game | P1-2 |

### `src/components/group-generator.tsx` (90 lines)
| Line | Finding | Priority |
|------|---------|----------|
| 31 | Fragile string encode-then-split-on-dash shuffle strategy | P2-1 |

### `src/components/flash-banner.tsx` (30 lines)
| Line | Finding | Priority |
|------|---------|----------|
| 15 | Hardcoded `router.replace("/dashboard")` | P1-7 |

### `src/app/api/lessons/[slug]/pdf/route.ts` (121 lines)
| Line | Finding | Priority |
|------|---------|----------|
| 30-121 | HTTP handler + PDF rendering mixed (SRP violation) | P1-6 |
| 55 | Magic number `750` for PDF cursor start | P2-3 |

### `src/lib/utils.ts` (17 lines)
| Line | Finding | Priority |
|------|---------|----------|
| 3-8 | `formatDate` doesn't guard against `Invalid Date` | P2-7 |

### `src/app/page.tsx` (212 lines)
| Line | Finding | Priority |
|------|---------|----------|
| 6-43 | Business content (testimonials, pricing) inline in component | P1-10 |

### Project-level
| Finding | Priority |
|---------|----------|
| SQLite WAL/SHM files tracked in Git | P0-1 |
| Zero test files; no test runner configured | P0-4 |
| Three near-identical error boundary components | P1-9 |

---

*Review conducted against the `main` branch at commit `dd458e6` ("Initial implementation").*
