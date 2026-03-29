---
description: Add an anti-pattern entry to src/data/antipatterns.ts
argument-hint: "domain:<1-5> [title:<short phrase of what NOT to do>]"
---

Add a new anti-pattern to `src/data/antipatterns.ts` following the steps below.

## Arguments

Parse from `$ARGUMENTS`:
- `domain` — required, integer 1–5
- `title` — optional, short phrase hinting at the anti-pattern (e.g. `title:"Using confidence scores for escalation"`)

If `domain` is missing or not 1–5, stop and report the valid range.

## Step 1 — Read and audit

Read `src/data/antipatterns.ts` in full.

- Find the highest `id` in the `ANTI_PATTERNS` array — the new id is that value + 1.
- Scan existing titles to avoid adding a near-duplicate.

## Step 2 — Cross-reference questions for inspiration

Read `src/data/questions.ts` and scan for questions in the requested domain — especially `advanced` and `exam` tier questions. The wrong-answer distractors in those questions are often known anti-patterns that may not yet have a dedicated anti-pattern entry.

Use this to surface candidates if no specific `title` was provided.

## Step 3 — Draft the anti-pattern

Follow CLAUDE.md content quality standards:

- `title`: gerund phrase — "Using X to do Y" or "Relying on X for Y". Not "Do not use X". Not a question.
- `why`: name the specific failure mode and the observable bad outcome. Structure: "When [situation], [anti-pattern approach] fails because [mechanism of failure], leading to [observable bad outcome]." Do not just say "this is wrong."
- `correct`: actionable — what exactly to do instead. Name the specific tool, pattern, or threshold. Not "use a better approach."
- `examTip`: name the tell-tale wording in exam distractors so a reader can recognize and eliminate on sight. Pattern: "Any option that says [phrase] is wrong. The correct answer involves [correct approach]."

## Step 4 — Insert

Append the new object to the `ANTI_PATTERNS` array. Match the existing formatting style.

## Step 5 — Verify

Run `npm run typecheck`. If it fails, fix and re-run before reporting.

Report: new id, domain, and title.
