---
id: claude-md
title: CLAUDE.md deep dive
sidebar_label: CLAUDE.md
---

# CLAUDE.md deep dive

## Hierarchy and precedence

```
~/.claude/CLAUDE.md           ← global (lowest priority)
/project/CLAUDE.md            ← project root
/project/frontend/CLAUDE.md   ← subdirectory (highest priority)
```

The most specific file wins. A rule in `/project/frontend/CLAUDE.md` overrides the same rule in `/project/CLAUDE.md`.

## What to put in each level

### Global (~/.claude/CLAUDE.md) — personal defaults
```markdown
# Personal Claude Code preferences

## My defaults
- Always use TypeScript, never plain JavaScript
- Prefer functional patterns over class-based
- Default test framework: Vitest

## My tools
- Package manager: pnpm
- Formatter: Prettier with printWidth: 100
```

### Project root — team-wide rules
```markdown
# Payments Platform — Claude Code configuration

## Essential commands
- `pnpm dev`          Start dev server on :3000
- `pnpm test`         Run full test suite (required before PR)
- `pnpm build`        Production build
- `pnpm lint && pnpm typecheck`  Required to pass CI

## Architecture rules
- All API routes use Zod for input validation — never trust raw request bodies
- Database access only through the repository layer (src/repositories/)
- Never import directly from src/db/ — always use the repository
- Services communicate via events, not direct function calls

## Code style
- TypeScript strict mode — no `any` types, use `unknown` + type guards
- All async functions must have explicit error handling
- No console.log in production code — use the logger at src/lib/logger.ts

## Testing standards
- Unit tests for all business logic functions
- Integration tests for all API routes
- Coverage threshold: 80% (enforced in CI)
- Test file location: colocated with source (foo.ts → foo.test.ts)

## PR requirements
- [ ] All tests pass
- [ ] Coverage threshold maintained
- [ ] No TypeScript errors
- [ ] Changelog entry added in CHANGELOG.md
- [ ] API changes documented in /docs/api/

## Security rules
- Never log customer PII — use anonymized IDs in logs
- All user inputs sanitized before database queries
- OWASP Top 10 compliance required for new endpoints
```

### Subdirectory — technology-specific rules
```markdown
# Frontend (React + TypeScript)

## Component rules
- Functional components only — no class components
- Props interfaces exported and named ComponentNameProps
- Use design system components from src/design-system/ — never raw HTML elements
- Tailwind classes only — no inline styles, no CSS modules

## State management
- Zustand for global state (src/stores/)
- React Query for server state
- useState/useReducer for local component state only

## Accessibility
- All interactive elements need accessible labels
- Keyboard navigation must work for all user flows
- Color contrast ratio minimum 4.5:1
```

## Auto-memory

Claude Code automatically builds memory as it works, saving useful learnings without you writing anything:

- Build commands it discovers
- File locations it identifies
- Patterns it notices
- Debugging insights

These accumulate across sessions in the project's `.claude/` directory.

## Official documentation
- [Claude Code — store instructions and memory](https://code.claude.com/docs/en/memory)
