---
id: anti-patterns
title: Anti-patterns guide
sidebar_label: ⚠️ Anti-patterns
---

import AntiPatternList from '@site/src/components/AntiPatternList';

# Anti-patterns guide

The CCA exam is specifically designed so that **wrong answers look reasonable**. Every distractor represents a real mistake that engineers make when they understand the concepts partially but haven't internalized the production trade-offs.

Knowing these 7 patterns is worth 10–15 points on the real exam.

:::danger Study these before taking any practice questions
These anti-patterns appear in every domain. Once you recognize the pattern in a question, the correct answer becomes obvious — the wrong answers are deliberately constructed around these exact mistakes.
:::

<AntiPatternList />

---

## The meta-pattern

All 7 anti-patterns share a common failure mode: **substituting probabilistic mechanisms for deterministic ones**.

| Task | Probabilistic (wrong) | Deterministic (correct) |
|---|---|---|
| Enforce tool ordering | Few-shot examples | Programmatic prerequisite hooks |
| Escalation routing | Self-reported confidence | Rule-based triggers |
| Schema compliance | Prompt instructions | `strict: true` + JSON schema |
| Loop termination | Text content parsing | `stop_reason` check |
| Error recovery | Retry everything | `isRetryable` flag |

When the exam asks "how do you ensure X always happens," the answer is always the deterministic mechanism — never the probabilistic one.
