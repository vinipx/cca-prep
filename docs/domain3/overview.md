---
id: overview
title: Domain 3 — Claude Code Configuration & Workflows
sidebar_label: Overview (20%)
---

# Domain 3 — Claude Code Configuration & Workflows

**Exam weight: 20%**

This domain tests your ability to configure Claude Code for team workflows using CLAUDE.md files, Agent Skills, custom slash commands, hooks, and CI/CD integration.

## What this domain tests

| Task Statement | Description |
|---|---|
| 3.1 | Configure persistent project context with CLAUDE.md |
| 3.2 | Design and use plan mode for high-impact operations |
| 3.3 | Create custom slash commands for repeatable workflows |
| 3.4 | Integrate Claude Code into CI/CD pipelines |
| 3.5 | Apply hooks for deterministic post-action behavior |
| 3.6 | Configure tool access with allowedTools and permissionMode |

## CLAUDE.md — the persistent project context

CLAUDE.md is a markdown file that Claude Code reads automatically at the start of every session. It functions as a "tech lead in a file" — encoding institutional knowledge that applies to every interaction.

### Hierarchy (most specific wins)

```
subdirectory CLAUDE.md  ← highest priority
       ↑
project root CLAUDE.md
       ↑
~/.claude/CLAUDE.md     ← lowest priority (global user defaults)
```

**Example: monorepo structure**

```
/project/
  CLAUDE.md              ← shared rules: git conventions, PR format, CI commands
  /frontend/
    CLAUDE.md            ← React patterns, component conventions, design system tokens
  /backend/
    CLAUDE.md            ← Python type hints, FastAPI patterns, test structure
```

### What belongs in CLAUDE.md

```markdown
# Project: Payments Platform

## Build commands
- `npm run dev` — start dev server
- `npm test` — run full test suite
- `npm run lint && npm run typecheck` — required before PR

## Architecture
- Services communicate via gRPC, not REST
- All new services must implement health check at /health
- Database: Postgres 15 via Prisma ORM

## Coding standards
- TypeScript strict mode required everywhere
- No `any` types — use `unknown` and type guards
- All async functions must handle errors explicitly

## PR checklist
- [ ] Tests added for new behavior
- [ ] No console.log left in code
- [ ] API changes documented in /docs/api
```

## Plan mode

Plan mode shows Claude's full intended action sequence before any file is modified. It is the human review checkpoint for high-stakes changes.

**When plan mode is required:**

| Scenario | Why |
|---|---|
| Large-scale refactor (10+ files) | Verify scope before execution |
| Database schema migration | Irreversible in production |
| CI/CD deployment | Broad system impact |
| Authentication changes | High-risk, hard to reverse |

```bash
# Invoke plan mode
/plan

# Or with a specific task description
/plan refactor authentication to use JWT across all services
```

Claude shows the plan → you review → approve, modify, or cancel.

## Custom slash commands

Custom slash commands package repeatable multi-step workflows:

```bash
/review-pr     → lint + test coverage + security scan + summarize findings
/add-tests     → explore structure + identify gaps + generate tests + run them
/deploy-staging → build + test + deploy + smoke test + notify team
```

Commands are defined in `.claude/commands/` and can be shared across the team via version control.

## Hooks

Hooks run shell commands at specific points in the Claude Code agent loop:

```json
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": { "tool_name": "Write" },
        "hooks": [{ "type": "command", "command": "npm run lint -- ${file}" }]
      }
    ]
  }
}
```

This hook runs the linter automatically after every file write — deterministic quality enforcement without prompting.

## Tool access configuration

```python
# Read-only exploration agent
options = ClaudeAgentOptions(
    allowed_tools=["Read", "Glob", "Grep"],
    permission_mode="default"  # prompts before any write
)

# Development agent with auto-approved edits
options = ClaudeAgentOptions(
    allowed_tools=["Read", "Glob", "Grep", "Write", "Bash"],
    permission_mode="acceptEdits"  # auto-approves file operations
)

# Explicitly block sensitive tools
options = ClaudeAgentOptions(
    allowed_tools=["Read", "Glob", "Grep", "Write"],
    disallowed_tools=["Bash"]  # no shell execution
)
```

**`permissionMode` values:**
- `"default"` — prompts user for approval on each write operation
- `"acceptEdits"` — auto-approves all file read/write; appropriate for CI/CD

## CI/CD integration

Claude Code in CI pipelines runs automated review on every PR:

```yaml
# .github/workflows/claude-review.yml
- name: Run Claude Code review
  run: |
    claude -p "Review this PR for: security issues, missing tests, \
    architecture violations per CLAUDE.md, and documentation gaps. \
    Output structured JSON with findings array." \
    --output-format json > review.json
```

**Key considerations for CI prompts:**
- Load CLAUDE.md automatically (happens by default)
- Request structured output for downstream processing
- Include specific review criteria, not "review this code"
- Calibrate false positive rate with project-specific examples in CLAUDE.md

## Official documentation

- [Claude Code overview](https://code.claude.com/docs/en/overview)
- [Store instructions and memory (CLAUDE.md)](https://code.claude.com/docs/en/memory)
- [Claude Code settings](https://code.claude.com/docs/en/overview)
- [Agent SDK permissions](https://platform.claude.com/docs/en/agent-sdk/agent-loop)
