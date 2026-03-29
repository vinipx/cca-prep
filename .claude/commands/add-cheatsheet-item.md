---
description: Add a reference item to src/data/cheatsheet.ts
argument-hint: "domain:<1-5> tag:<category> [topic:<optional concept hint>]"
---

Add a new cheatsheet item to `src/data/cheatsheet.ts` following the steps below.

## Arguments

Parse from `$ARGUMENTS`:
- `domain` — required, integer 1–5
- `tag` — required, short category label (e.g. `tag:"Agentic loops"`, `tag:"MCP errors"`, `tag:"CLAUDE.md"`)
- `topic` — optional, concept hint

If `domain` is missing or not 1–5, stop and report the valid range.

## Step 1 — Read and audit

Read `src/data/cheatsheet.ts` in full.

- Find the highest `id` in the `CHEATSHEET_ITEMS` array — the new id is that value + 1.
- Collect all existing `tag` values from the file.
- Check for existing items that cover the same concept to avoid duplication.

## Step 2 — Resolve the tag

Compare the provided `tag` against existing tags. If the provided tag is semantically close to an existing tag (e.g. "MCP error" vs "MCP errors"), prefer the existing spelling for consistency. Inform the user which tag will be used.

If creating a new tag, keep it short (2-3 words), title-case, and category-level (not item-specific).

## Step 3 — Draft the item

Follow CLAUDE.md content quality standards:

- `title`: short noun-phrase describing the rule or pattern (e.g. "stop_reason control flow", "Hub-and-spoke coordinator pattern"). 2-6 words.
- `body`:
  - State the rule first, then exceptions, then edge cases
  - Use `\n\n` to separate logical blocks
  - Use `•` for bullet lists
  - For decision frameworks, structure with "Use when:" and "Avoid when:" sections
- `code` (optional, but strongly preferred for patterns with a canonical implementation):
  - TypeScript preferred
  - Use realistic variable names
  - Include a comment on the key decision line
  - For config examples: JSON or YAML is fine

## Step 4 — Insert

Append the new object to the `CHEATSHEET_ITEMS` array. Match the existing formatting style.

## Step 5 — Verify

Run `npm run typecheck`. If it fails, fix and re-run before reporting.

Report: new id, domain, tag, and title.
