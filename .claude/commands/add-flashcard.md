---
description: Add a flashcard to src/data/flashcards.ts
argument-hint: "domain:<1-5> [topic:<optional concept hint>]"
---

Add a new flashcard to `src/data/flashcards.ts` following the steps below.

## Arguments

Parse from `$ARGUMENTS`:
- `domain` — required, integer 1–5
- `topic` — optional, a concept hint (e.g. `topic:argument-hint`)

If `domain` is missing or not 1–5, stop and report the valid range.

## Step 1 — Read and audit

Read `src/data/flashcards.ts` in full.

- Find the highest `id` in the `FLASHCARDS` array — the new id is that value + 1.
- Scan existing `front` strings for the requested domain to avoid a near-duplicate.

## Step 2 — Draft the flashcard

Follow CLAUDE.md content quality standards:

- `front`: one focused question about a single concept. Phrase it as a direct question ending with `?`. Do not ask "what are all the X" unless the complete list is the entire point.
- `back`:
  - Line 1: the direct answer (no preamble)
  - Separate the core answer from supporting detail with `\n\n`
  - Use `•` for bullet lists
  - Keep total length under ~6 lines so it fits on screen without scrolling
  - Include a contrast element: X vs Y, when to use vs not use, correct vs incorrect behavior, "Never X — always Y"

Ensure the front/back pair is not already covered by an existing flashcard (check the scan from Step 1).

## Step 3 — Insert

Append the new object to the `FLASHCARDS` array in `src/data/flashcards.ts`. Match the existing formatting style (inline `id`, `domain` on first line).

## Step 4 — Verify

Run `npm run typecheck`. If it fails, fix and re-run before reporting.

Report: new id, domain, and the `front` text.
