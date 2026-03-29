---
id: intro
title: Study guide introduction
sidebar_label: Introduction
slug: /intro
---

import AntiPatternList from '@site/src/components/AntiPatternList';

# CCA Foundations study guide

Welcome to the community study guide for the **Claude Certified Architect — Foundations (CCA)** certification. This guide covers every domain tested on the exam, with task statements drawn directly from the official exam guide PDF.

:::tip What this exam actually tests
The CCA does not test whether you know how to *use* Claude. It tests whether you can *architect* production-grade Claude applications — designing multi-agent systems, configuring Claude Code for teams, building reliable MCP integrations, and making the right engineering trade-offs under production constraints.
:::

## How to use this guide

1. **Start with the overview** — understand the exam format, all 6 scenarios, and the 6-week study plan at [/overview](/overview)
2. **Read each domain** — use the sidebar to navigate domain deep-dives in order of exam weight (Domain 1 → 2 → 3 → 4 → 5)
3. **Drill the anti-patterns** — review the 7 canonical wrong answers before sitting any practice questions
4. **Practice** — work through [flashcards](/flashcards) (concepts) then [quiz](/quiz) (application)
5. **Target weaknesses** — the quiz lets you filter by domain and difficulty level; drill your weak domains

## Exam weight at a glance

| Domain | Topic | Weight |
|--------|-------|--------|
| 1 | Agentic Architecture & Orchestration | **27%** |
| 3 | Claude Code Configuration & Workflows | **20%** |
| 4 | Prompt Engineering & Structured Output | **20%** |
| 2 | Tool Design & MCP Integration | **18%** |
| 5 | Context Management & Reliability | **15%** |

Domains 1 + 3 alone make up 47% of the exam. If time is short, prioritize them.

## The mental model that passes the exam

Most wrong answers on the CCA are architecturally plausible but miss a single key trade-off. The exam rewards one consistent mental model:

**Deterministic > probabilistic.** When the exam asks how to enforce ordering, compliance, or policy rules — the answer is always programmatic (hooks, prerequisites, schema validation), never prompt-based (instructions, few-shot examples). Prompts guide; code enforces.

Everything else flows from this:
- `stop_reason` over text parsing
- Programmatic prerequisites over system prompt instructions
- `isRetryable` flags over generic retry logic
- JSON schema + `strict: true` over "ask Claude nicely"
- Scoped tools over giving agents everything

## Official preparation resources

| Resource | URL |
|----------|-----|
| Anthropic Academy (13 free courses) | [anthropic.skilljar.com](https://anthropic.skilljar.com) |
| Agent SDK docs | [platform.claude.com/docs/en/agent-sdk/overview](https://platform.claude.com/docs/en/agent-sdk/overview) |
| Claude Code docs | [code.claude.com/docs/en/overview](https://code.claude.com/docs/en/overview) |
| Tool use docs | [platform.claude.com/docs/en/agents-and-tools/tool-use/overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) |
| MCP documentation | [modelcontextprotocol.io/docs](https://modelcontextprotocol.io/docs) |
| Official exam guide PDF | [Download PDF](https://everpath-course-content.s3-accelerate.amazonaws.com/instructor/8lsy243ftffjjy1cx9lm3o2bw/public/1773274827/Claude+Certified+Architect+%E2%80%93+Foundations+Certification+Exam+Guide.pdf) |
