---
id: session-management
title: Session management
sidebar_label: Session management
---

# Session management

## Session operations

| Operation | Command | When to use |
|---|---|---|
| Resume named session | `--resume <session-name>` | Prior context is still valid |
| Fork from baseline | `fork_session` | Explore two divergent approaches |
| Start fresh | New session + injected summary | Prior tool results are stale |

## --resume: continuing prior work

```bash
# Name a session when starting
claude --session-name "auth-migration-phase1"

# Resume it later
claude --resume "auth-migration-phase1"
```

**After resuming, always inform Claude about changes:**

```
# ❌ Wrong — resumes silently, Claude reasons from stale analysis
claude --resume "auth-migration"

# ✅ Correct — inform Claude what changed
claude --resume "auth-migration" --message "
Files changed since last session:
- src/auth/jwt.ts — rewritten to use RS256 instead of HS256
- src/middleware/auth.ts — updated token validation logic
- tests/auth.test.ts — new test suite added

Please re-analyze these three files before continuing.
"
```

## fork_session: parallel exploration

Use `fork_session` when you want to explore two different approaches from the same analysis starting point, without them interfering:

```python
# Both branches start from the same codebase analysis
branch_a = fork_session(
    base_session="codebase-analysis",
    prompt="Refactor using the Repository pattern"
)
branch_b = fork_session(
    base_session="codebase-analysis",
    prompt="Refactor using the Service Locator pattern"
)

# Run both, compare outcomes, pick the better approach
```

## When to start fresh vs. resume

```
Prior context still valid?
    YES → use --resume
    NO  → start fresh with structured summary

What makes prior context stale:
  • Fundamental assumption was wrong
  • Major architectural decision changed
  • 50%+ of analyzed files modified
  • Different task domain than prior session
```

## Structured summary for fresh sessions

When starting fresh after stale context, inject a summary that captures everything worth keeping:

```
# Phase transition summary (research → implementation)

## What we learned in the research phase
- Auth service uses JWT RS256, not HS256 (discovered Day 2)
- Token expiry is 15min access / 7day refresh
- 3 downstream services depend on the current token format

## Architecture decision made
- Using the Adapter pattern to maintain backwards compatibility
- New JWT service will wrap existing one during migration period

## Starting point for implementation phase
- Begin with src/auth/jwt-adapter.ts
- Do NOT touch src/auth/legacy-jwt.ts yet — other services depend on it
```

## Session management for multi-day projects

```
Day 1: Exploration session (named "explore")
  → understand codebase structure
  → identify key files and dependencies

Day 2-3: Design sessions (resume "explore" → fork to "design-a", "design-b")
  → compare two architectural approaches
  → pick the better one

Day 4-5: Implementation (NEW session with summary from design phase)
  → fresh session prevents design-phase dead-ends from cluttering context
  → injected summary carries forward only the relevant decisions
```

## Official documentation
- [Claude Code — memory and sessions](https://code.claude.com/docs/en/memory)
- [Claude Code overview](https://code.claude.com/docs/en/overview)
