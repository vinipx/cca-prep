---
id: plan-mode
title: Plan mode
sidebar_label: Plan mode
---

# Plan mode

Plan mode shows Claude's complete intended sequence of actions before any execution begins. It is the mandatory safety review for high-impact operations.

## When plan mode is required

| Operation | Why plan mode |
|---|---|
| Refactor spanning 10+ files | Verify scope and approach before any file changes |
| Database schema migration | Irreversible in production, high blast radius |
| Authentication system changes | Security-critical, hard to reverse |
| CI/CD pipeline changes | Affects all deployments |
| Dependency major version upgrade | May break many callsites |
| Deleting files or directories | Irreversible |

## How to use plan mode

```bash
# Enter plan mode
/plan

# Or with a specific task
/plan migrate all authentication from session-based to JWT

# Claude produces:
# 1. Analysis of what needs to change
# 2. Ordered list of files to modify
# 3. Summary of each change
# 4. Risk assessment
#
# You review → approve / modify / cancel
# Only after approval does Claude begin executing
```

## What a good plan review checks

When Claude presents a plan, verify:

1. **Scope is correct** — does it cover all affected files?
2. **Order is safe** — are dependencies handled in the right sequence?
3. **Reversibility** — are there any irreversible steps? Is there a rollback plan?
4. **Test coverage** — does the plan include test updates?
5. **No surprises** — are there any files in the plan that shouldn't be touched?

## Plan mode vs. `acceptEdits`

```
Plan mode:     Shows plan → human approves → executes
               Best for: high-impact, irreversible operations

acceptEdits:   Auto-approves all file operations
               Best for: CI/CD pipelines, automated batch tasks
               Never for: production-impacting changes without review
```

## Official documentation
- [Claude Code overview — plan mode](https://code.claude.com/docs/en/overview)
