# Code Quality & Architecture Review — LearnByPlay (Delta 3)

**Reviewed**: 2025  
**Commit**: `390c252` ("chore: final improvements - CI, SEO, documentation, testing, and polish")  
**Scope**: New P0/P1 issues only — items already covered in `CODE_REVIEW.md` and `CODE_REVIEW_2.md` are not repeated.

---

## Summary of Previous-Review Status

| Previous Finding | Status |
|---|---|
| P0-1 · WAL files in Git | **Fixed** — `git ls-files data/` returns empty. WAL/SHM files fully untracked. |
| P0-2 · SQL injection in `db.ts` | **Fixed** — retained from prior review. |
| P0-3 · No input validation | **Fixed** — retained from prior review. |
| P0-4 · Zero test coverage | **Fixed** — 4 test files added covering `validation.ts`, `utils.ts`, `pdf.ts`, and `mappers.ts` via Vitest. CI runs tests in matrix. |
| P0-NEW-1 (R2) · No auth/ownership on server actions | **Still open** — no authentication layer added. Acceptable for single-user MVP, but flagged for multi-user deployment. Not re-raised. |
| P0-NEW-2 (R2) · WAL files still tracked | **Fixed** — see P0-1 above. |
| P1-NEW-1 (R2) · SessionTimer side-effects in state updater | **Fixed** — `phaseRef` pattern adopted; phase transition moved to a separate `useEffect` (lines 41-52). `currentPhase` removed from interval deps. |
| P1-NEW-2 (R2) · `parseJson` logs raw data | **Fixed** — now logs only `"Failed to parse JSON column value (length=%d)"` without raw content (`mappers.ts:9`). |
| P1-NEW-3 (R2) · Focus trap empty NodeList | **Fixed** — guard `if (focusable.length === 0) return;` added (`site-header.tsx:43`). |
| P1-NEW-4 (R2) · Manual cascade deletes | **Fixed** — FK now has `ON DELETE CASCADE` (`db.ts:194`). `deleteClassroomAction` uses a single DELETE. |
| P1-NEW-5 (R2) · `ConfirmDeleteForm` dead ref & wrong type | **Fixed** — `cancelRef` removed; `action` prop typed `(formData: FormData) => Promise<void>` (`confirm-delete-form.tsx:8`). |
| P1-NEW-6 (R2) · PDF Content-Disposition header injection | **Fixed** — slug sanitized via `replace(/[^a-z0-9_-]/gi, "_")` (`pdf/route.ts:35`). |
| P1-4 · Hardcoded seed SQL | **Still open** — demo classrooms/sessions remain inline SQL in `db.ts:91-106`. Not re-raised; low risk for MVP. |
| P1-10 · Inline business content | **Still open** — testimonials/pricing still inline in `page.tsx:6-43`. Not re-raised. |

---

## New Critical Findings — P0

### P0-NEW-1 · CSP allows `'unsafe-eval'` — negates XSS protection

**File**: `next.config.ts:27`

```ts
value:
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';",
```

The Content-Security-Policy header includes both `'unsafe-inline'` and `'unsafe-eval'` in `script-src`. `'unsafe-eval'` permits `eval()`, `Function()`, and `setTimeout("string")` — the exact attack surface CSP is designed to close. With `'unsafe-eval'`, an attacker who achieves injection (e.g., via a future XSS bug) can execute arbitrary JavaScript, making the CSP header security theatre rather than a real defence.

`'unsafe-inline'` for `script-src` is also dangerous but harder to avoid in Next.js without nonce support. `'unsafe-eval'` has no such justification — Next.js production builds do not require it.

**Impact**: An XSS vulnerability anywhere in the app bypasses CSP entirely. The header gives a false sense of protection to security auditors.

**Fix**: Remove `'unsafe-eval'` immediately. For `'unsafe-inline'`, implement nonce-based CSP when Next.js supports it in production, or accept the trade-off with a comment:

```ts
value:
  "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';",
```

If the dev server specifically requires `'unsafe-eval'`, conditionalise it:

```ts
const isDev = process.env.NODE_ENV === "development";
// ...
`script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`
```

---

## New Architectural Concerns — P1

### P1-NEW-1 · `sitemap.ts` and `robots.ts` hardcode a placeholder domain

**Files**: `src/app/sitemap.ts:5`, `src/app/robots.ts:12`, `src/app/layout.tsx:48`

```ts
// sitemap.ts:5
const BASE_URL = "https://learnbyplay.example.com";

// robots.ts:12
sitemap: "https://learnbyplay.example.com/sitemap.xml",

// layout.tsx:48
metadataBase: new URL("https://learnbyplay.example.com"),
```

`example.com` is an IANA-reserved domain that will never resolve. If the app is deployed without changing these three files, the generated `sitemap.xml` and `robots.txt` will point crawlers to a dead domain, and Open Graph / Twitter cards will resolve to `https://learnbyplay.example.com/...` — breaking social sharing and SEO.

The domain is duplicated in three separate files with no single source of truth, so a partial fix (changing only one) would leave the others inconsistent.

**Fix**: Extract the base URL to a single environment variable with a compile-time fallback:

```ts
// src/lib/constants.ts
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
```

Then import `BASE_URL` in `sitemap.ts`, `robots.ts`, and `layout.tsx`. Add `NEXT_PUBLIC_BASE_URL` to `.env.example`.

---

### P1-NEW-2 · `validateDate` accepts semantically invalid dates like `2025-02-30`

**File**: `src/lib/validation.ts:32-38`

```ts
export function validateDate(value: unknown): string {
  const str = String(value ?? "").trim();
  if (!ISO_DATE_REGEX.test(str)) throw new ValidationError("Invalid date format");
  const parsed = new Date(str);
  if (Number.isNaN(parsed.getTime())) throw new ValidationError("Invalid date");
  return str;
}
```

The regex `/^\d{4}-\d{2}-\d{2}$/` passes `"2025-02-30"`. JavaScript's `new Date("2025-02-30")` does **not** return `NaN` — it silently rolls forward to March 2, 2025. So the function returns `"2025-02-30"` as valid, and this string is stored in the database. Any consumer that later parses the stored date gets a different calendar date than the user intended.

The existing test at `validation.test.ts:68` asserts `"2025-13-45"` throws, but month `13` does produce `NaN`. Adding `"2025-02-30"` or `"2025-06-31"` would expose the bug.

**Impact**: Teachers logging a session on February 30 would silently have it recorded as March 2. The data corruption is silent and difficult to detect after the fact.

**Fix**: Round-trip through `Date` and compare the components:

```ts
export function validateDate(value: unknown): string {
  const str = String(value ?? "").trim();
  if (!ISO_DATE_REGEX.test(str)) throw new ValidationError("Invalid date format");
  const parsed = new Date(str + "T00:00:00"); // force local parse
  if (Number.isNaN(parsed.getTime())) throw new ValidationError("Invalid date");
  // Verify the Date didn't silently roll over
  const [year, month, day] = str.split("-").map(Number);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() + 1 !== month ||
    parsed.getDate() !== day
  ) {
    throw new ValidationError("Invalid date");
  }
  return str;
}
```

Add test cases:

```ts
it("rejects Feb 30 (date rollover)", () => {
  expect(() => validateDate("2025-02-30")).toThrow(ValidationError);
});

it("rejects Jun 31 (date rollover)", () => {
  expect(() => validateDate("2025-06-31")).toThrow(ValidationError);
});
```

---

### P1-NEW-3 · Health endpoint exposes internal database state without rate limiting

**File**: `src/app/api/health/route.ts:1-29`

```ts
export function GET() {
  try {
    const db = getDb();
    const result = db.prepare("SELECT COUNT(*) as count FROM games").get() as { count: number };
    return Response.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      checks: {
        database: "connected",
        games: result.count,    // ← leaks catalog size
      },
    });
  } catch {
    // ...
  }
}
```

Two issues:

1. **Information disclosure**: The response reveals the exact number of games in the database. While not sensitive today, health endpoints are public-facing and often scraped. Leaking internal counts is a minor information disclosure that can help attackers fingerprint the deployment state.

2. **No caching or rate limiting**: Every request triggers a synchronous SQLite query. An attacker can flood `/api/health` to saturate the single-writer SQLite lock and degrade the application.

Note: `robots.ts` correctly disallows `/api/`, but crawlers are not the only consumers — the endpoint is still reachable.

**Fix**: Return a minimal response and add `Cache-Control`:

```ts
export function GET() {
  try {
    const db = getDb();
    db.prepare("SELECT 1").get(); // connectivity check only
    return Response.json(
      { status: "healthy", timestamp: new Date().toISOString() },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch {
    return Response.json(
      { status: "unhealthy", timestamp: new Date().toISOString() },
      { status: 503 },
    );
  }
}
```

---

### P1-NEW-4 · `logSessionAction` does not validate `classroomId` as a positive integer

**File**: `src/app/actions.ts:65,78`

```ts
classroomId = Number(formData.get("classroomId") ?? 0);
// ...
if (!classroomId) errors.push("class");
```

`Number("abc")` returns `NaN`, and `!NaN` is `true`, so non-numeric input is caught. However, `Number("-5")` returns `-5`, and `!-5` is `false` — a negative integer passes validation. `Number("3.7")` also passes. While the `SELECT 1 FROM classrooms WHERE id = ?` check on line 90 will fail to find the record, the action leaks the fact that negative IDs don't exist — and more importantly, this is a missing validation pattern that could be missed if the existence check is ever removed.

Similarly, `studentCount` validation on line 42 does reject negative values (`studentCount <= 0`), but `classroomId` has no equivalent lower-bound check.

**Fix**: Add an integer validation helper and reuse it:

```ts
function validatePositiveInt(value: unknown): number {
  const num = Number(value);
  if (!Number.isInteger(num) || num <= 0) throw new ValidationError("Must be a positive integer");
  return num;
}
```

Apply to `classroomId` in `logSessionAction` and `id` in `deleteClassroomAction`/`deleteSessionAction`.

---

### P1-NEW-5 · `getGames()` fetches all columns with `SELECT *` then filters in JS — SQL/JS responsibility split

**File**: `src/lib/data/games.ts:28-39`

```ts
const games: Game[] = db.prepare(`SELECT * FROM games ${whereClause} ORDER BY name`)
  .all(...params)
  .map((row: unknown) => mapGame(row as Record<string, unknown>));

// Subject and standard filters require JSON array inspection, done in JS
const filtered = games.filter((game: Game) => {
  if (filters.subject && !game.subjects.includes(filters.subject as Game["subjects"][number])) {
    return false;
  }
  if (filters.standard && !game.standards.includes(filters.standard)) {
    return false;
  }
  return true;
});
```

When `subject` or `standard` filters are applied but no SQL-pushable filters are present, **all** games are fetched from SQLite, deserialized, mapped, and then most are discarded in JS. With the current seed data (~37 games) this is negligible, but the architecture doesn't scale.

More importantly, `SELECT *` fetches large JSON-serialised text columns (`simplified_rules`, `facilitation_guide`, etc.) even when only `slug` and `name` are needed for catalog cards. This is wasted I/O and memory.

**Fix (low effort, immediate)**: Use SQLite's `json_each()` or `LIKE '%"value"%'` to push subject/standard filtering into SQL. At minimum, select only the columns needed for the catalog list view.

**Fix (medium effort, future)**: Move JSON array columns to normalised junction tables (`game_subjects`, `game_standards`) so filtering is index-backed.

---

### P1-NEW-6 · `GroupGenerator` uses `Math.random()` — shuffle is non-reproducible and biased in edge cases

**File**: `src/components/group-generator.tsx:8`

```ts
const swapIndex = Math.floor(Math.random() * (index + 1));
```

`Math.random()` is not seedable. The `seed` state variable (line 19) is used only as a `useMemo` dependency to trigger re-computation — it does not actually seed the RNG. This means:

1. **No reproducibility**: A teacher cannot share or recreate a grouping. If the component re-renders (e.g., a parent state change), groups silently change.
2. **React StrictMode double-invoke**: In development, `useMemo` factories can be called twice. Each call produces different groups because `Math.random()` is stateless. The second result is used, but the mismatch may cause confusion during debugging.

**Impact**: For an educational tool where group assignments may need to be documented, reproduced, or shared, a non-deterministic shuffle is a UX gap.

**Fix**: Use a seeded PRNG (e.g., a simple mulberry32 or xoshiro) keyed on `seed`:

```ts
function seededRandom(seed: number) {
  return function () {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0x100000000;
  };
}

const groups = useMemo(() => {
  const rand = seededRandom(seed);
  const students = Array.from({ length: studentCount }, (_, i) => `Student ${i + 1}`);
  // Fisher-Yates with seeded RNG
  for (let i = students.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [students[i], students[j]] = [students[j]!, students[i]!];
  }
  // ...
}, [groupSize, seed, studentCount]);
```

---

### P1-NEW-7 · Test coverage gaps — no tests for server actions, data layer, or components

**Files**: `src/lib/__tests__/*.test.ts`, `src/lib/data/__tests__/mappers.test.ts`

The 4 test files cover pure utility functions (`wrapText`, `clamp`, `formatDate`, `getComplexityLabel`), validation (`validateString`, `validateEnum`, `validateDate`, `sanitizeRedirectTo`), and data mappers (`parseJson`, `mapGame`, `mapLesson`, etc.). This is a significant improvement from zero coverage.

However, the following critical areas have **no test coverage**:

| Area | Risk | Files |
|---|---|---|
| Server actions | Business logic + DB mutations | `src/app/actions.ts` (167 lines) |
| Data layer queries | Correctness of SQL joins, grouping | `src/lib/data/games.ts`, `dashboard.ts`, `sessions.ts`, `lessons.ts` |
| Database seeding | Schema correctness, seed idempotency | `src/lib/db.ts` |
| PDF generation | Output correctness, page breaks | `src/lib/pdf.ts` (only `wrapText` tested) |

The server actions contain the most security-sensitive code (input validation → DB mutation → redirect) and are the highest-value test target. The data layer contains complex SQL joins (`getSessions()` with 4 JOINs) that could silently break on schema changes.

**Fix**: Prioritise integration tests for server actions using an in-memory SQLite database. A single test file exercising the happy path and error paths for each action would cover the highest-risk surface:

```ts
// src/app/__tests__/actions.test.ts
import { createClassroomAction, deleteClassroomAction } from "@/app/actions";
// Set up in-memory DB, seed schema, test each action
```

---

## Refactoring Roadmap (New Items Only)

### High Impact, Low Effort
1. **Remove `'unsafe-eval'` from CSP** — single string edit in `next.config.ts` (P0-NEW-1)
2. **Fix `validateDate` rollover bug** — add round-trip check + 2 test cases (P1-NEW-2)
3. **Strip internal counts from health endpoint** — simplify response body (P1-NEW-3)
4. **Add positive-integer validation for `classroomId` / `id`** (P1-NEW-4)

### High Impact, High Effort
5. **Add server action integration tests** — highest-value test coverage expansion (P1-NEW-7)
6. **Extract `BASE_URL` to env var** — single source of truth for domain (P1-NEW-1)

### Medium Impact, Low Effort
7. **Use seeded PRNG in GroupGenerator** — reproducible shuffle (P1-NEW-6)
8. **Reduce `SELECT *` in `getGames`** — select only catalog-card columns (P1-NEW-5)

---

## Positive Observations (New)

The codebase has improved substantially since the last review. Specific praise:

1. **Test infrastructure landed**: Vitest configured with path aliases, 4 test files with 35+ assertions, CI matrix running tests on Node 20 and 22. The jump from 0% to tested utilities/validation/mappers is the single biggest quality improvement.
2. **SessionTimer refactor is correct**: The `phaseRef` + separate effect pattern cleanly avoids the state-updater side-effect issue flagged in R2. The implementation matches the recommended fix closely.
3. **ON DELETE CASCADE adopted**: The schema now uses declarative FK cascades, and the manual delete code was removed from `deleteClassroomAction`. Clean, atomic, maintainable.
4. **Security headers are comprehensive**: `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, and CSP are all present and correctly configured (modulo the `unsafe-eval` issue above).
5. **CI pipeline is solid**: Lint → Type check → Test → Build, with matrix strategy, `npm ci`, and telemetry disabled. The pipeline catches real issues.
6. **ConfirmDeleteForm cleanup**: Dead ref removed, correct async type signature, `aria-describedby` linking confirmation message to submit button. Good accessibility.
7. **SEO foundations**: `sitemap.ts`, `robots.ts`, structured `metadata` in layout and per-page, OpenGraph/Twitter tags — all present and well-structured (domain aside).
8. **Server action existence checks**: `logSessionAction` verifies classroom, game, and lesson exist before inserting. `deleteClassroomAction` verifies the classroom exists before deleting. This prevents silent no-ops and orphaned references.

---

*Delta review conducted against commit `390c252` on the `main` branch.*
