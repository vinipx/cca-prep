---
description: Guide for UI/design changes to components in src/components/ or the design system in src/css/custom.css
argument-hint: "component:<ComponentName|css> [change:<description of the change>]"
---

Make a UI or design system change following the steps below.

## Arguments

Parse from `$ARGUMENTS`:
- `component` — required. One of: `QuizEngine`, `FlashcardDeck`, `CheatsheetView`, `AntiPatternList`, `DomainCards`, `ExamStats`, or `css` for design system changes.
- `change` — optional description of the intended change.

If `component` is not one of the known values, stop and list the valid options.

## Step 1 — Read relevant files

- If `component` is a component name: read `src/components/<component>.tsx`
- If `component` is `css`: read `src/css/custom.css` in full
- Always also read `src/css/custom.css` for design token reference, even for component changes

Understand the current prop interface, state shape, and JSX structure before making any edits.

## Step 2 — Design system constraints

These rules apply to every change. Check them before and after editing.

**Colors — never hardcode hex values:**
- Use `var(--cca-orange)`, `var(--cca-blue)`, `var(--cca-green)`, `var(--cca-red)`, `var(--cca-gray)` etc.
- Semantic usage: orange = interactive/primary, blue = secondary/info, green = correct/success, red = wrong/error, gray = neutral/muted
- Backgrounds: use the `-lt` variant (12% alpha). Borders: use the `-bd` variant (30% alpha).
- Prefer `var(--ifm-*)` tokens over custom ones when an IFM token exists for the property.

**Domain badges:**
- Use existing CSS classes `badge-d1` through `badge-d5` — do not inline domain colors.

**Typography:**
- Headings: `font-family: var(--ifm-heading-font-family)` (Lora)
- Body/UI text: `font-family: var(--ifm-font-family-base)` (Poppins)
- Code/metrics: `font-family: var(--ifm-font-family-monospace)` (DM Mono)

**React patterns:**
- Functional components only — no class components
- State: `useState`; derived state: `useMemo`; side effects: `useEffect`; stable callbacks: `useCallback`
- No external state management library — keep state local to the component
- Do not rename or remove exported names; do not change existing prop interfaces without updating all call sites

**Dark mode:**
- New background or border colors must work in both light and dark mode
- Use `[data-theme='dark']` selector for dark mode overrides

## Step 3 — Make the change

Edit the target file. Apply only the requested change — do not refactor surrounding code or add unrelated improvements.

## Step 4 — Verify

Run `npm run typecheck`. If it fails, fix and re-run before reporting.

Remind the user to run `npm start` and visually test the change in both light mode and dark mode.
