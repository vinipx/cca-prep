---
id: exam-scenarios
title: The 6 exam scenarios
sidebar_label: 📋 Exam scenarios
---

# The 6 exam scenarios

The CCA exam randomly selects 4 of these 6 scenarios. Every question is anchored to one of the selected scenarios — you're the architect of a specific production system, not answering in the abstract.

:::tip Preparation strategy
You cannot know which 4 scenarios will appear. Study all 6, but pay extra attention to **Scenarios 1, 3, and 4** — they cover Domains 1 and 2, which together account for 45% of the exam.
:::

---

## Scenario 1 — Customer Support Resolution Agent

**Primary domains: D1, D2, D5**

You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues.

**MCP tools available:**
- `get_customer` — retrieve customer profile and verification status
- `lookup_order` — fetch order details and history
- `process_refund` — issue a refund to a payment method
- `escalate_to_human` — create a human agent handoff ticket

**Target:** 80%+ first-contact resolution rate

**Key architectural challenges tested:**
- Programmatic prerequisites: `process_refund` must be gated on verified `get_customer`
- Multi-concern decomposition: a customer with 3 issues needs parallel investigation tracks
- Structured handoff: escalation summaries must be self-contained for agents without session access
- Escalation triggers: replace confidence-based routing with rule-based triggers

**Common exam traps in this scenario:**
- Using system prompt ordering instructions instead of prerequisite hooks
- Escalating based on Claude's expressed uncertainty
- Returning empty results when a tool times out

---

## Scenario 2 — Code Generation with Claude Code

**Primary domains: D3, D5**

You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow.

**Key architectural challenges tested:**
- CLAUDE.md hierarchy for a monorepo with multiple technology stacks
- Plan mode before high-impact operations (40+ file refactors, database migrations)
- Session management for multi-day projects (when to resume vs. start fresh)
- CI/CD integration for automated PR review

**Common exam traps in this scenario:**
- Skipping plan mode for large refactors
- Using only a root CLAUDE.md instead of subdirectory files for tech-specific rules
- Continuing in a session after a fundamental assumption was invalidated

---

## Scenario 3 — Multi-Agent Research System

**Primary domains: D1, D2, D5**

You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialist subagents: web search, document analysis, synthesis, and report generation.

**Target:** Comprehensive cited research reports

**Key architectural challenges tested:**
- Parallel vs. sequential subagent invocation (web search and doc analysis are independent)
- Structured context passing with source provenance metadata
- Iterative refinement: coordinator evaluates synthesis and re-delegates for gaps
- Error handling: what happens when a subagent partially fails

**Common exam traps in this scenario:**
- Always routing through all 4 subagents regardless of query type
- Passing findings as plain text blobs (loses attribution)
- Having the synthesis subagent query the web directly instead of via coordinator

---

## Scenario 4 — Developer Productivity Tools

**Primary domains: D1, D2, D3**

You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers explore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive tasks.

**Built-in tools available:** Read, Write, Bash, Grep, Glob

**Key architectural challenges tested:**
- Task-scoped tool profiles: exploration (Read/Glob/Grep only) vs. development (add Write/Bash) vs. deployment (add deployment tools)
- Dynamic adaptive decomposition for open-ended tasks ("add tests to this legacy codebase")
- Tool description overlap across MCP servers

**Common exam traps in this scenario:**
- Giving the agent all available tools regardless of current task phase
- Using fixed sequential decomposition for open-ended exploration tasks
- Over-provisioning tools causing misuse

---

## Scenario 5 — Claude Code for CI/CD

**Primary domains: D3, D4**

You are integrating Claude Code into your Continuous Integration/Continuous Deployment pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests.

**Key architectural challenges tested:**
- CLAUDE.md with project-specific security exceptions to reduce false positives
- Prompt engineering for actionable, specific feedback (few-shot with good/bad examples)
- `permissionMode: "acceptEdits"` for automated pipeline operation
- Path restrictions preventing Claude from modifying production code during test generation

**Common exam traps in this scenario:**
- Generic system prompts producing generic reviews
- Removing security checks entirely to reduce false positives (should add exceptions, not remove checks)
- Using `permissionMode: "default"` in CI (blocks automation waiting for user approval)

---

## Scenario 6 — Structured Data Extraction

**Primary domains: D4, D5**

You are building a structured data extraction system using Claude. The system extracts information from unstructured documents, validates output using JSON schemas, and maintains high accuracy.

**Key architectural challenges tested:**
- Validation retry loops with specific error feedback
- Handling persistent failures gracefully (requires_human_review pattern)
- Multi-pass extraction for long documents (per-section → integration)
- Message Batches API for bulk processing with appropriate latency expectations

**Common exam traps in this scenario:**
- Generic retry feedback ("that was wrong, try again")
- Using Batches API for time-sensitive downstream systems
- Processing entire long documents in one call instead of focused section passes

---

## How to study scenarios

For each scenario, practice answering: *"What is the most common architectural mistake in this scenario, and what is the correct fix?"*

The exam always presents production situations where something is going wrong. Your job is to identify the root cause and select the correct architectural intervention — not a symptomatic fix.
