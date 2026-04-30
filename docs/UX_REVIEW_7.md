# LearnByPlay — Seventh-Pass UX & DX Audit

**Reviewed:** July 2025
**Context:** Follow-up to `UX_REVIEW_6.md`. All six prior P0/P1 issues have been addressed: `wrapText` exported from `pdf.ts:5` and imported in `pdf.test.ts:3` (P0-1 resolved), `parseJson` now returns fallback for `null`/`undefined` parsed values at `mappers.ts:6` (P1-1 resolved), `ErrorFallback` classes swapped — `<h1>` now has `text-3xl` heading styling and `<p>` has `text-sm` kicker styling at `error-fallback.tsx:14-15`, root `error.tsx:7-9` updated to pass descriptive title/short description (P1-2 resolved), `voiceEnabled` state with default `false` and `aria-pressed` toggle added at `session-timer.tsx:16, 157-164` (P1-3 resolved), `seededRandom` PRNG and `seededShuffle` implemented at `group-generator.tsx:5-23` (P1-4 resolved), test suite expanded from 28 to 103 tests across 7 files — new validation tests (`validation.test.ts`, `validation-edge.test.ts`), constants tests (`constants.test.ts`), and mapper edge-case tests (`mappers-edge.test.ts`) added (P1-5 partially resolved). This audit focuses exclusively on **genuinely new P0/P1 issues** not documented in any prior review.

---

## Executive Summary

LearnByPlay has made remarkable progress across seven review cycles. The codebase has gone from zero tests and missing security headers to 103 passing tests, CSP/X-Frame-Options enforcement, seeded PRNG, proper type safety, and thoughtful accessibility. Every P0 and P1 from UX_REVIEW_6 has been addressed. What remains are four new issues in the P1 tier — all related to the test infrastructure's maturity and a straggling ErrorFallback prop issue that escaped the prior fix. Specifically: (1) the `games/error.tsx` and `dashboard/error.tsx` callers were not updated when ErrorFallback's styling was corrected — they still pass short titles as the visually dominant `<h1>` and longer descriptions as the visually subordinate kicker `<p>`, inverting the intended emphasis; (2) `vitest.config.ts` coverage requires `@vitest/coverage-v8` which is not installed — `npm run test:coverage` fails with `MISSING DEPENDENCY`; (3) the vitest include pattern `src/**/*.test.ts` excludes `.tsx` files, making component testing structurally impossible even if `@testing-library/react` were added; (4) test runs produce 5 `console.error` messages from expected `parseJson` fallback paths, creating noise that masks real failures. No new P0 issues were found — a first in seven review cycles.

---

## Findings — New Issues Only

### P0 — Critical

None. First review cycle with no P0 findings.

---

### P1 — High

#### P1-1: `games/error.tsx` and `dashboard/error.tsx` not updated after ErrorFallback styling fix — prop/style mismatch persists in route-level error boundaries

**Location:** `src/app/games/error.tsx:7-10`, `src/app/dashboard/error.tsx:7-10`

UX_REVIEW_6 P1-2 fixed the class swap in `ErrorFallback` and updated the root `error.tsx` caller to pass `title="We couldn't load LearnByPlay right now."` (long, descriptive → renders as 30px `<h1>`) and `description="Something needs another try"` (short → renders as 14px uppercase `<p>`). This is correct.

But the route-level error boundaries were not updated:

```tsx
// games/error.tsx:7-10
<ErrorFallback
  title="Catalog error"                         // 2-word title → renders as 30px heading
  description="We couldn't load the game browser."  // Informative text → renders as 14px kicker
/>

// dashboard/error.tsx:7-10
<ErrorFallback
  title="Dashboard error"                             // 2-word title → renders as 30px heading
  description="We couldn't load the teacher dashboard."  // Informative text → renders as 14px kicker
/>
```

The short, vague titles ("Catalog error", "Dashboard error") are visually dominant at 30px, while the useful context ("We couldn't load the game browser.") is visually subordinated at 14px uppercase — the same inverted emphasis pattern that prompted UX_REVIEW_4 P1-5 and UX_REVIEW_6 P1-2. Screen readers correctly announce the `<h1>` as the heading, but the information hierarchy is wrong: the least informative text is the most prominent.

**Impact:** Teachers hitting an error on `/games` or `/dashboard` see "Catalog error" in large text with the useful message barely visible. The root error page is correct; the route-level pages are not.

**Fix:** Swap the prop values to match the pattern established in root `error.tsx`:
```tsx
// games/error.tsx
<ErrorFallback
  title="We couldn't load the game browser."
  description="Catalog error"
  buttonLabel="Retry browser"
  reset={reset}
/>

// dashboard/error.tsx
<ErrorFallback
  title="We couldn't load the teacher dashboard."
  description="Dashboard error"
  buttonLabel="Retry dashboard"
  reset={reset}
/>
```

---

#### P1-2: `@vitest/coverage-v8` not installed — coverage thresholds are dead config and `npm run test:coverage` fails

**Location:** `vitest.config.ts:7-16`, `package.json:15,36`

The vitest config defines coverage settings with `provider: "v8"` and threshold enforcement (`statements: 80`, `branches: 75`, `functions: 80`, `lines: 80`). The `package.json` has a `"test:coverage": "vitest run --coverage"` script. But `@vitest/coverage-v8` is not in `devDependencies`:

```
$ npm run test:coverage
MISSING DEPENDENCY  Cannot find dependency '@vitest/coverage-v8'
```

This means:
1. The `test:coverage` script in `package.json` is non-functional — developers who try to check coverage get a confusing error, not a helpful "install X" message.
2. The 80/75/80/80 thresholds in `vitest.config.ts` are never enforced. Coverage could drop to zero and nothing would flag it.
3. CI runs `npm test` (which is `vitest run` without `--coverage`), so CI doesn't catch coverage regressions either.

**Impact:** Developers see coverage config and assume it's enforced. It isn't. The `test:coverage` script fails. The gap between perceived and actual coverage safety is a DX trap.

**Fix:**
```bash
npm install -D @vitest/coverage-v8
```
Then optionally add `npm run test:coverage` as a CI step (or at minimum, verify it works locally):
```yaml
# ci.yml — optional coverage gate
- name: Coverage
  run: npm run test:coverage
```

---

#### P1-3: Vitest include pattern excludes `.tsx` test files — component testing is structurally blocked

**Location:** `vitest.config.ts:6`

The test include pattern is:
```typescript
include: ["src/**/*.test.ts"],
```

This only matches `.test.ts` files. If a developer creates a component test as `session-timer.test.tsx` (required for JSX/React component tests), vitest will silently ignore it. Combined with the absence of `@testing-library/react` in `devDependencies`, component testing is blocked at two levels:
1. **Config level**: `.tsx` test files won't run.
2. **Dependency level**: No React testing utilities are available.

UX_REVIEW_5 P0-1 and UX_REVIEW_6 P1-5 both recommended installing `@testing-library/react` and writing component tests. The test infrastructure has grown impressively for pure functions (103 tests across utils, validation, constants, mappers, and pdf), but the gap to component testing requires two concrete unblocks.

**Impact:** The highest-risk interactive components (`SessionTimer` phase transitions, `ConfirmDeleteForm` two-step flow, `SessionLogger` cascading selects, `FlashBanner` URL cleanup) cannot be tested even if a developer tries.

**Fix:**
```typescript
// vitest.config.ts — expand include pattern
include: ["src/**/*.test.{ts,tsx}"],
```
```bash
# Install React testing utilities
npm install -D @testing-library/react @testing-library/jest-dom jsdom
```
Add `environment: 'jsdom'` to vitest config for component tests (or use per-file `// @vitest-environment jsdom` comments).

---

#### P1-4: `parseJson` tests produce 5 unsilenced `console.error` messages — test output noise masks real failures

**Location:** `src/lib/data/__tests__/mappers.test.ts:10-11, 14-15, 27-28, 73-74`, `src/lib/data/__tests__/mappers-edge.test.ts:151-152`

Running `npm test` produces:

```
stderr | mappers.test.ts > parseJson > returns fallback for invalid JSON
Failed to parse JSON column value (length=8)

stderr | mappers.test.ts > parseJson > returns fallback for empty string
Failed to parse JSON column value (length=0)

stderr | mappers.test.ts > parseJson > returns fallback when parsed value is undefined
Failed to parse JSON column value (length=9)

stderr | mappers.test.ts > mapGame > handles malformed JSON fields gracefully
Failed to parse JSON column value (length=3)
Failed to parse JSON column value (length=3)

stderr | mappers-edge.test.ts > mapSession edge cases > handles malformed skills JSON gracefully
Failed to parse JSON column value (length=8)
```

These are *expected* — the tests deliberately pass invalid JSON to verify fallback behavior. But the `console.error` calls in `parseJson` (`mappers.ts:9`) are not suppressed. In a 103-test suite this is manageable, but as tests grow, unsilenced expected errors create two problems:
1. Developers scanning test output for real failures must mentally filter 5+ known-noise lines.
2. A genuine unexpected `console.error` (e.g., from a new bug) blends into the noise and is easily missed.

**Impact:** Developer trust in clean test output erodes. Real errors hiding in expected noise is a classic false-negative pattern.

**Fix (option A — spy and suppress in tests):**
```typescript
import { vi } from "vitest";

it("returns fallback for invalid JSON", () => {
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});
  expect(parseJson("not json", [])).toEqual([]);
  expect(spy).toHaveBeenCalledOnce();
  spy.mockRestore();
});
```

**Fix (option B — global setup per test file):**
```typescript
import { afterEach, beforeEach, vi } from "vitest";

let consoleSpy: ReturnType<typeof vi.spyOn>;
beforeEach(() => { consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {}); });
afterEach(() => { consoleSpy.mockRestore(); });
```

Option A is preferred — it documents the expectation (`expect(spy).toHaveBeenCalledOnce()`) while keeping output clean.

---

## What's Been Fixed Well Since UX_REVIEW_6

1. **`wrapText` exported and tested against real implementation** — `pdf.ts:5` exports `wrapText`, `pdf.test.ts:3` imports it. All 7 tests run against the actual function. P0-1 resolved.
2. **`parseJson` returns fallback for `null`/`undefined`** — Guard at `mappers.ts:6` prevents type contract violations. Mapper tests updated to assert `[]` fallback. P1-1 resolved.
3. **`ErrorFallback` classes match semantics** — `<h1>` has `text-3xl` heading class, `<p>` has `text-sm` kicker class at `error-fallback.tsx:14-15`. Root `error.tsx` updated with descriptive title. P1-2 resolved.
4. **Voice announcements opt-in** — `voiceEnabled` state defaults to `false` at `session-timer.tsx:16`. Toggle button with `aria-pressed` at lines 157-164. `speechSynthesis` only fires when `voiceEnabled` is true (line 57). P1-3 resolved.
5. **Seeded PRNG for group generation** — `seededRandom` LCG at `group-generator.tsx:5-11`, `seededShuffle` Fisher-Yates at lines 13-23. Groups are deterministic for the same seed value. P1-4 resolved.
6. **Test suite expanded 3.7×** — From 28 tests in 3 files to 103 tests in 7 files. New coverage: all validation functions with edge cases (50 tests), all constants (9 tests), mapper edge cases with type coercion and complex JSON (13 tests). P1-5 substantially addressed.
7. **`typecheck` script added** — `package.json:13` has `"typecheck": "tsc --noEmit"`. CI runs it at `ci.yml:39`. P2-8 from prior reviews resolved.
8. **`check` meta-script** — `package.json:17` has `"check": "npm run lint && npm run typecheck && npm test && npm run build"`. Developers can run the full CI pipeline locally in one command.

---

## P2 Carry-Overs (Not Re-Flagged — Tracked for Completeness)

These were first documented in prior reviews and remain unfixed. They are not new findings.

| ID | Source | Issue |
|----|--------|-------|
| P2-1 | UX_REVIEW_3 P2-4 | `skip-to-content` uses `:focus` instead of `:focus-visible` (`globals.css:64`) |
| P2-2 | UX_REVIEW_3 P2-5 | Footer has no navigation links (`site-footer.tsx`) |
| P2-3 | UX_REVIEW_3 P2-2 | `GameArt` gradient uses `name.length % 6` — poor color distribution (`game-art.tsx:25`) |
| P2-4 | UX_REVIEW_3 P2-7 | PD page FAQ section has no `id` for deep linking (`pd/page.tsx:61`) |
| P2-5 | UX_REVIEW_3 P2-14 | Pricing cards have no CTA or "Coming soon" indicator (`page.tsx:199-207`) |
| P2-6 | UX_REVIEW_3 P2-9 | `parseJson` logs to `console.error` without structured context (`mappers.ts:9`) |
| P2-7 | UX_REVIEW_3 DX-2 | No pre-commit hooks (Husky/lint-staged) |
| P2-8 | UX_REVIEW_5 P2-9 | Mobile nav does not set `inert` on main content (`site-header.tsx`) |
| P2-9 | UX_REVIEW_5 P2-10 | Landing page `<section>` elements lack `aria-labelledby` (`page.tsx:125, 150, 184`) |

---

## Priority Summary

| Priority | Count | Theme |
|----------|-------|-------|
| **P0** | 0 | None — first clean P0 review |
| **P1** | 4 | ErrorFallback prop mismatch in route errors, coverage tooling missing, test config blocks `.tsx`, console noise in tests |
| **P2** | 9 | Carry-over polish from prior reviews |

---

## Recommended Action Order

1. **P1-2** — `npm install -D @vitest/coverage-v8`. One command. Unblocks `test:coverage` script and makes thresholds enforceable. Verify with `npm run test:coverage`.
2. **P1-3** — Change vitest include to `src/**/*.test.{ts,tsx}`. One character change (`{ts,tsx}`). Install `@testing-library/react @testing-library/jest-dom jsdom`. Unblocks future component tests.
3. **P1-1** — Swap title/description in `games/error.tsx` and `dashboard/error.tsx`. Two files, two string swaps each. Aligns with the root `error.tsx` pattern.
4. **P1-4** — Add `vi.spyOn(console, "error").mockImplementation(() => {})` to the 5 test cases that exercise `parseJson` fallback. Verify console noise is gone.
5. Batch remaining P2 items as polish sprint. Consider adding `npm run test:coverage` to CI once P1-2 is resolved.
