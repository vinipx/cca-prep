---
description: Add a well-formed practice question to src/data/questions.ts
argument-hint: "domain:<1-5> tier:<basic|intermediate|advanced|exam> [topic:<optional concept hint>]"
---

Add a new practice question to `src/data/questions.ts` following the steps below.

## Arguments

Parse from `$ARGUMENTS`:
- `domain` — required, integer 1–5
- `tier` — required, one of `basic`, `intermediate`, `advanced`, `exam`
- `topic` — optional, a concept hint (e.g. `topic:tool_choice`)

If `domain` or `tier` is missing or invalid, stop and report the valid values. Do not proceed.

## Step 1 — Read and audit

Read `src/data/questions.ts` in full.

- Find the highest `id` in the `QUESTIONS` array — the new id is that value + 1.
- Count existing questions for the requested domain.
- Note the comment block structure: domains are separated by `// ─── DOMAIN N ───` headers and tiers by `// BASIC`, `// INTERMEDIATE`, `// ADVANCED`, `// EXAM` sub-headers.
- If `topic` was provided, search the file for any existing question covering that concept to avoid a near-duplicate.

## Step 2 — Validate

- `domain` must be 1, 2, 3, 4, or 5.
- `tier` must be `basic`, `intermediate`, `advanced`, or `exam`.
- If `tier` is `exam`, a `scenario` field is required (see Step 3).

## Step 3 — Determine scenario (exam tier only)

If `tier` is `exam`, select the most relevant exam scenario for the domain:

| Scenario | Domains |
|---|---|
| Customer Support Resolution Agent | 1, 2, 5 |
| Code Generation with Claude Code | 3, 5 |
| Multi-Agent Research System | 1, 2, 5 |
| Developer Productivity Tools | 1, 2, 3 |
| Claude Code for CI/CD | 3, 4 |
| Structured Data Extraction | 4, 5 |

Write a 2-3 sentence `scenario` string that provides business context making 2+ answer options superficially appealing. The question should require reasoning about tradeoffs, not just recall.

## Step 4 — Draft the question

Follow CLAUDE.md content quality standards:

- `text`: one focused question, ends with `?`
- `options`: exactly 4 strings; one unambiguous correct answer; all 4 must be plausible to someone who partially knows the content; at least one distractor should be a known anti-pattern
- `correct`: 0-indexed position of the correct option (0, 1, 2, or 3)
- `explanation`: teach the concept — (a) why the correct answer is correct, (b) why at least one distractor fails. Not just a restatement of the answer.
- `wrongExplanations`: optional array of 3 strings (for the 3 wrong options); include if the distractors benefit from individual explanation
- `refs`: required, at least 1 entry. Link to a specific Anthropic docs page, not the root. Prefer Agent SDK docs and feature-specific pages.

## Step 5 — Insert

Append the new question object to the `QUESTIONS` array inside the correct domain and tier comment block. Match the existing formatting style (inline `id`, `domain`, `tier` on first line).

For `tier:'exam'` questions include the `scenario` field after `tier`.

## Step 6 — Verify

Run `npm run typecheck`. If it fails, fix the error and re-run before reporting.

Report: new question id, domain, tier, and first ~10 words of the text.
