# LearnByPlay — Sixth-Pass UX & DX Audit

**Reviewed:** July 2025
**Context:** Follow-up to `UX_REVIEW_5.md`. Multiple fifth-pass issues were addressed: Vitest installed with `vitest.config.ts` and a `"test": "vitest run"` script in `package.json` (P0-1 partially resolved), `Content-Security-Policy` and `X-Frame-Options` headers added to `next.config.ts:20-28` (P0-2 resolved), sitemap N+1 replaced with `getAllLessonsGroupedByGame()` bulk query (P1-1 resolved), seed versioning via `_meta` table with `SEED_VERSION` check at `db.ts:19-23` (P1-2 resolved), `aria-describedby` added to `ConfirmDeleteForm` confirm button at `confirm-delete-form.tsx:49` (P1-3 resolved), session timer consolidated to a single `aria-live="polite"` SR-only region at `session-timer.tsx:126-130` (P1-4 resolved), `wrapText` empty-first-line bug fixed with `if (current)` guard at `pdf.ts:13` (P1-5 resolved), `SortOption` type alias added at `types.ts:105` and used in `CatalogFilters.sort` (P1-6 resolved), CI now runs `npm test` step at `ci.yml:38-39`. This audit focuses exclusively on **genuinely new P0/P1 issues** not documented in any prior review.

---

## Executive Summary

LearnByPlay has made substantial progress across six review cycles. Every P0 and P1 from UX_REVIEW_5 has been addressed. The testing foundation now exists (Vitest, 28 passing tests across 3 files covering `utils`, `pdf/wrapText`, and all 6 mapper functions), security headers are in place, seed versioning prevents corruption, and the timer accessibility is properly consolidated. What remains are three new issues: (1) the `pdf.test.ts` test duplicates the `wrapText` implementation instead of importing it — the real function is never tested, creating a false-confidence trap; (2) the `mapLesson` test on line 96 asserts `lesson.standards` is `null`, which violates the `LessonPlan` type contract (`standards: string[]`) — a passing test that masks a runtime type hole; (3) `ErrorFallback` still renders the short `title` as `<h1>` with kicker styling and the long `description` as a `<p>` with 3xl heading styling — the visual/semantic mismatch persists in the opposite direction from UX_REVIEW_4's P1-5. All remaining P2 carry-overs from prior reviews are cataloged but not re-flagged.

---

## Findings — New Issues Only

### P0 — Critical

#### P0-1: `pdf.test.ts` tests a local copy of `wrapText`, not the actual `pdf.ts` implementation — false test coverage

**Location:** `src/lib/__tests__/pdf.test.ts:3-25`

The test file contains the comment `// wrapText is not exported, so we replicate the function for testing.` and then defines a standalone copy of `wrapText` with 25 lines of logic. All 7 test cases run against this copy. The actual `wrapText` in `src/lib/pdf.ts:5-25` is **never imported, never exercised, and never verified**.

This means:
- If someone introduces a regression in `pdf.ts:wrapText` (e.g., reverts the P1-5 empty-line fix), all 7 tests still pass.
- The CI pipeline reports green, and `pdf.ts` coverage shows 0% on the `wrapText` function despite a dedicated test file.
- The test file creates *negative* value — it's worse than having no test, because it gives false confidence.

This was the most critical P0-1 from UX_REVIEW_5 ("still zero automated tests"), and while the infrastructure is now correctly in place, the highest-priority test target (`wrapText`) is not actually covered.

**Impact:** The entire purpose of the PDF test suite is defeated. A future refactor to `wrapText` that breaks PDF output will pass CI.

**Fix:** Export `wrapText` from `pdf.ts` and import it in the test:
```typescript
// In src/lib/pdf.ts — add export:
export function wrapText(text: string, maxLength = 95) { ... }

// In src/lib/__tests__/pdf.test.ts — replace local copy:
import { wrapText } from "@/lib/pdf";
```
Delete lines 3-25 (the replicated function). All 7 existing test cases remain unchanged.

---

### P1 — High

#### P1-1: `mapLesson` test asserts `standards` is `null` on parsed `"null"` — type contract violation passes silently

**Location:** `src/lib/data/__tests__/mappers.test.ts:91-97`

The test case "handles null-like JSON fields" sets `standards: "null"` and then asserts:
```typescript
expect(lesson.standards).toBeNull();
```

This assertion **passes** because `JSON.parse("null")` returns `null`, and `parseJson` has no runtime type guard. But `LessonPlan.standards` is typed as `string[]` — a `null` value violates the interface contract. Any downstream code (e.g., `lesson.standards.includes(...)` at `lessons/[slug]/page.tsx:42`, `lesson.standards.map(...)` at `games/[slug]/page.tsx:112`) will throw `TypeError: Cannot read properties of null`.

The test documents and *asserts correct behavior for* a scenario that would crash the app. It should either:
1. Assert that `parseJson` returns the fallback (`[]`) when the parsed result doesn't match the expected type, or
2. Be explicitly documented as testing current (buggy) behavior with a `// TODO` marker.

**Impact:** If a lesson's `standards` column ever contains the literal string `"null"` (e.g., from a seed migration error or manual DB edit), the lesson detail page and game detail page will crash with an unhandled TypeError. The test suite says this is fine.

**Fix (option A — fix `parseJson` to validate array shape):**
```typescript
export function parseJson<T>(value: string, fallback: T): T {
  try {
    const parsed = JSON.parse(value);
    if (parsed === null || parsed === undefined) return fallback;
    return parsed as T;
  } catch {
    console.error("Failed to parse JSON column value (length=%d)", value.length);
    return fallback;
  }
}
```
Then update the test to assert `lesson.standards` equals `[]` (the fallback).

**Fix (option B — update test to document known gap):**
```typescript
it("returns parsed null for 'null' string — KNOWN: violates LessonPlan.standards type", () => {
  // TODO: parseJson should return fallback for null/undefined parsed values
  const row = { ...validRow, standards: "null" };
  const lesson = mapLesson(row);
  expect(lesson.standards).toBeNull(); // Bug: should be []
});
```

---

#### P1-2: `ErrorFallback` renders `title` as `<h1>` with kicker styling and `description` as `<p>` with heading styling — visual/semantic mismatch persists

**Location:** `src/components/error-fallback.tsx:14-15`, `src/app/error.tsx:8-9`

UX_REVIEW_4 P1-5 flagged that `title` was `<p>` and `description` was `<h1>` — inverted semantics. The fix swapped them: `title` is now `<h1>` (line 14) and `description` is now `<p>` (line 15). But the *CSS classes* were not updated:

```tsx
<h1 className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">{title}</h1>
<p className="mt-3 text-3xl font-semibold text-slate-900">{description}</p>
```

The `<h1>` renders at `text-sm` (14px) with uppercase tracking — visually a kicker/eyebrow. The `<p>` renders at `text-3xl` (30px) with bold weight — visually a heading. Screen readers announce the tiny kicker text as the page heading. Sighted users perceive the large bold text as the heading. This creates a semantic/visual disconnect that confuses both audiences.

The actual usage in `error.tsx`:
- `title="Something needs another try"` → renders as tiny uppercase `<h1>`
- `description="We couldn't load LearnByPlay right now."` → renders as large bold `<p>`

**Fix:** Swap the classes to match the corrected semantics:
```tsx
<h1 className="mt-3 text-3xl font-semibold text-slate-900">{title}</h1>
<p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">{description}</p>
```
And update the caller to pass props that make sense with this visual order:
```tsx
// error.tsx
<ErrorFallback
  title="We couldn't load LearnByPlay right now."
  description="Something needs another try"
  ...
/>
```

---

#### P1-3: `SpeechSynthesis` in session timer fires without user gesture or opt-in — unexpected audio in classroom

**Location:** `src/components/session-timer.tsx:54-66`

The timer uses `window.speechSynthesis.speak()` to announce phase transitions after the user has pressed Start. While the `hasStartedRef` guard prevents announcements before the first interaction, there are two problems:

1. **No opt-in control.** Once a teacher presses Start, they cannot disable voice announcements without pausing/stopping the timer entirely. In a quiet testing environment or during standardized testing in an adjacent room, unexpected speech synthesis is disruptive. There is no "Mute announcements" toggle.

2. **`speechSynthesis.cancel()` immediately before `speak()` on every phase change** (lines 58, 62) — if a teacher is using a screen reader simultaneously (common for visually impaired educators), `cancel()` kills the screen reader's queued announcements. The `aria-live="polite"` region at line 126-130 provides the same information accessibly — the `speechSynthesis` call is redundant and harmful for screen reader users.

This was not flagged in prior reviews because UX_REVIEW_3 P1-3 focused on `aria-live="assertive"` and UX_REVIEW_5 P1-4 focused on triple live regions. The `speechSynthesis` API usage itself was never reviewed.

**Fix:** Add a state toggle for voice announcements (default off):
```tsx
const [voiceEnabled, setVoiceEnabled] = useState(false);
// In the useEffect:
if (voiceEnabled && hasStartedRef.current && "speechSynthesis" in window) { ... }
```
Add a "🔊 Voice" toggle button in the controls area. This gives teachers explicit control and avoids interfering with screen readers by default.

---

#### P1-4: `GroupGenerator` shuffle uses `Math.random()` seeded by `seed` state but doesn't actually seed — groups aren't reproducible

**Location:** `src/components/group-generator.tsx:5-14, 31-38`

The component has a `seed` state that increments on "Randomize groups" click. The `useMemo` depends on `seed`, which triggers re-computation. But the `shuffle` function uses `Math.random()`, which is not seeded by the `seed` value. The `seed` is only used in the string `${student}-${seed}-${index}` (line 33) and then immediately stripped by `.split("-")[0]`.

This means:
1. The `seed` parameter creates the illusion of reproducible randomization but does nothing — each render produces a different shuffle regardless of the seed value.
2. If a teacher wants to re-generate the same groups (e.g., to project them again after navigating away), refreshing the page produces different groups even at the same `seed` value.
3. The string manipulation on line 33 is dead code — appending and then stripping `seed` and `index` has no effect on the shuffle output.

**Impact:** Minor — groups are functional — but the code is misleading. A contributor reading this would assume `seed` affects group composition. It doesn't.

**Fix:** Either remove the `seed` illusion (simplest) or implement a proper seeded PRNG:
```typescript
// Option A: Remove seed pretense
const groups = useMemo(() => {
  const students = Array.from({ length: studentCount }, (_, i) => `Student ${i + 1}`);
  const randomized = shuffle(students);
  // ...
}, [groupSize, studentCount, seed]); // seed just triggers re-render

// Option B: Seeded PRNG for reproducibility
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}
```

---

#### P1-5: No test coverage for server actions, data queries, or components — test suite covers only pure utility functions

**Location:** `src/lib/__tests__/` (2 test files), `src/lib/data/__tests__/` (1 test file)

The 28 tests cover:
- `utils.ts`: `formatDate`, `clamp`, `getComplexityLabel` — 9 tests
- `pdf.test.ts`: replicated `wrapText` — 7 tests (see P0-1: not actually testing `pdf.ts`)
- `mappers.ts`: `parseJson` + all 6 map functions — 12 tests

Missing entirely:
1. **`actions.ts`** — 5 server actions with validation, FK checks, transactions, redirects. Zero tests. This is the highest-risk module: it's the only write path, handles user input, and has 3 distinct error branches per action.
2. **Data query functions** — `getGames()` with its JS-side subject/standard filtering and 4-way sort, `getDashboardSnapshot()` with its 5-query aggregation, `getNearMatches()` relaxation logic. These are testable against an in-memory SQLite database.
3. **Component behavior** — `SessionTimer` phase transitions, `FlashBanner` URL cleanup, `ConfirmDeleteForm` two-step flow.

UX_REVIEW_5 P0-1 required "Install Vitest + `@testing-library/react`" with priority targets: mappers (done), actions (not done), utils (done), pdf (not actually done). `@testing-library/react` is not installed — component testing is not yet possible.

**Impact:** The test suite validates only stateless data transformations. All stateful behavior (DB writes, validation logic, UI interactions) is untested. The riskiest code paths have zero coverage.

**Fix:** Prioritized test additions:
1. Add `actions.test.ts` with in-memory SQLite: test validation rejections, FK reference checks, successful inserts, redirect behavior.
2. Add `games.test.ts`: test filter combinations, sort orders, `getNearMatches` relaxation.
3. Install `@testing-library/react` and add component tests for `SessionTimer` and `ConfirmDeleteForm`.

---

## What's Been Fixed Well Since UX_REVIEW_5

1. **Vitest installed and configured** — `vitest.config.ts` with `@` alias, `package.json` test script, 28 passing tests across 3 files. P0-1 infrastructure resolved.
2. **CSP and X-Frame-Options headers** — `next.config.ts:20-28` adds both with `frame-ancestors 'none'`. P0-2 resolved.
3. **Sitemap N+1 eliminated** — `sitemap.ts:3` imports `getAllLessonsGroupedByGame`, single bulk query replaces per-game loop. P1-1 resolved.
4. **Seed versioning** — `_meta` table with `SEED_VERSION` constant at `db.ts:19-23`. Seed transaction includes version write at `db.ts:108`. P1-2 resolved.
5. **`ConfirmDeleteForm` accessibility** — `aria-describedby` links confirm button to confirmation message via `confirmId` at `confirm-delete-form.tsx:25, 49`. P1-3 resolved.
6. **Timer single live region** — Consolidated to one `aria-live="polite"` SR-only `<p>` at `session-timer.tsx:126-130`. Visual countdown uses `aria-live="off"`. Phase indicator has no live region. P1-4 resolved.
7. **`wrapText` bug fixed** — Guard `if (current) lines.push(current)` at `pdf.ts:13` prevents empty first line. P1-5 resolved.
8. **`SortOption` type** — `types.ts:105` defines union type, used at `types.ts:114`. Games page casts properly at `games/page.tsx:33`. P1-6 resolved.
9. **CI runs tests** — `ci.yml:38-39` includes `npm test` step. Tests run in matrix across Node 20 and 22.
10. **Mapper tests comprehensive** — `mappers.test.ts` covers all 6 map functions with valid rows and malformed JSON edge cases.

---

## P2 Carry-Overs (Not Re-Flagged — Tracked for Completeness)

These were first documented in prior reviews and remain unfixed. They are not new findings.

| ID | Source | Issue |
|----|--------|-------|
| P2-1 | UX_REVIEW_3 P2-4 / UX_REVIEW_5 P2-1 | `skip-to-content` uses `:focus` instead of `:focus-visible` (`globals.css:64`) |
| P2-2 | UX_REVIEW_3 P2-5 / UX_REVIEW_5 P2-2 | Footer has no navigation links (`site-footer.tsx`) |
| P2-3 | UX_REVIEW_3 P2-2 / UX_REVIEW_5 P2-3 | `GameArt` gradient uses `name.length % 6` — poor color distribution (`game-art.tsx:25`) |
| P2-4 | UX_REVIEW_3 P2-7 / UX_REVIEW_5 P2-4 | PD page FAQ section has no `id` for deep linking (`pd/page.tsx`) |
| P2-5 | UX_REVIEW_3 P2-14 / UX_REVIEW_5 P2-5 | Pricing cards have no CTA or "Coming soon" indicator (`page.tsx:199-207`) |
| P2-6 | UX_REVIEW_3 P2-9 / UX_REVIEW_5 P2-6 | `parseJson` logs to `console.error` without structured context (`mappers.ts:7`) |
| P2-7 | UX_REVIEW_3 DX-2 / UX_REVIEW_5 P2-7 | No pre-commit hooks (Husky/lint-staged) |
| P2-8 | UX_REVIEW_3 DX-3 / UX_REVIEW_5 P2-8 | No `typecheck` script in `package.json` — must remember `npx tsc --noEmit` |
| P2-9 | UX_REVIEW_5 P2-9 | Mobile nav does not set `inert` on main content (`site-header.tsx`) |
| P2-10 | UX_REVIEW_5 P2-10 | Landing page `<section>` elements lack `aria-labelledby` (`page.tsx:125, 150, 184`) |

---

## Priority Summary

| Priority | Count | Theme |
|----------|-------|-------|
| **P0** | 1 | `pdf.test.ts` tests a copy, not the real function — false coverage |
| **P1** | 5 | Mapper test asserts type-violating null, ErrorFallback visual/semantic swap incomplete, SpeechSynthesis without opt-in, GroupGenerator fake seed, action/query test gap |
| **P2** | 10 | Carry-over polish from prior reviews |

---

## Recommended Action Order

1. **P0-1** — Export `wrapText` from `pdf.ts`, replace local copy in `pdf.test.ts` with import. Verify the *real* function passes all 7 tests. One import change + one `export` keyword.
2. **P1-1** — Fix `parseJson` to return fallback on `null`/`undefined` parsed values. Update `mappers.test.ts` assertion to expect `[]`. Two-line guard.
3. **P1-2** — Swap CSS classes in `ErrorFallback` so the `<h1>` has heading styling and `<p>` has kicker styling. Update `error.tsx` prop values. Pure class swap.
4. **P1-3** — Add voice announcement opt-in toggle to `SessionTimer` (default off). Prevents `speechSynthesis.cancel()` from killing screen reader output.
5. **P1-4** — Remove dead `seed` string manipulation in `GroupGenerator`. Either drop reproducibility pretense or implement seeded PRNG.
6. **P1-5** — Add `actions.test.ts` with in-memory SQLite covering validation paths, FK checks, and successful inserts. Install `@testing-library/react` for future component tests.
7. Batch remaining P2 items as polish sprint.
