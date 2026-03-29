# CCA Prep — Claude Certified Architect Study Guide

### [🔥 CHECK IT OUT! — Live Study Guide](https://cca-prep-a54506.git.pages.epam.com/)

Community study resource for the **Claude Certified Architect — Foundations (CCA)** certification.

> Not affiliated with Anthropic. Independent community resource.

## Quick start

```bash
npm install
npm start
# http://localhost:3000/claude-architect-certification-prep/
```

## What's inside

- 100 practice questions across 4 difficulty tiers and 5 domains
- Every wrong answer links to the relevant official Anthropic documentation
- 20 flashcards with keyboard navigation
- 11-item cheat sheet with code examples
- 7 anti-pattern breakdowns with correct alternatives
- Deep-dive study guide for all 5 exam domains
- Exam overview with all 6 scenarios and a 6-week study plan

## Contributing content

Full guide with all schemas and examples: [Contributing](https://vinipx.github.io/claude-architect-certification-prep/study-guide/contributing)

### Adding a question

Edit `src/data/questions.ts`:

```typescript
{
  id: 101,                    // next sequential id
  domain: 1,                  // 1–5 (see domain reference below)
  tier: 'intermediate',       // 'basic' | 'intermediate' | 'advanced' | 'exam'
  text: 'When should you use programmatic hooks instead of few-shot examples to enforce tool ordering?',
  options: [
    'When you want to demonstrate best practices to Claude',
    'When the ordering must be enforced deterministically for compliance or safety',
    'When the prompt context window is too small for examples',
    'When Claude has not seen enough training data for the domain',
  ],
  correct: 1,                 // 0-indexed — option B is correct
  explanation: 'Few-shot examples influence behavior probabilistically. Programmatic hooks enforce ordering deterministically every time — required for financial or compliance workflows where "most of the time" is not acceptable.',
  refs: [
    { label: 'Hooks overview', url: 'https://platform.claude.com/docs/en/agent-sdk/hooks' },
  ],
},
```

### Adding a flashcard

Edit `src/data/flashcards.ts`:

```typescript
{
  id: 21,       // next sequential id
  domain: 1,
  front: 'When must you use programmatic hooks instead of few-shot examples?',
  back: 'When ordering or sequencing MUST be enforced deterministically.\n\nFew-shot examples = probabilistic influence.\nProgrammatic hooks = deterministic enforcement.\n\nUse hooks for compliance, financial flows, or any irreversible action sequence.',
},
```

### Adding a cheatsheet item

Edit `src/data/cheatsheet.ts`:

```typescript
{
  id: 12,                 // next sequential id
  domain: 1,
  tag: 'Hooks',
  title: 'Programmatic vs few-shot tool ordering',
  body: 'Few-shot examples reduce but cannot eliminate ordering violations. Use programmatic prerequisite hooks to deterministically block downstream tool calls until required upstream tools complete.',
  code: `// Hook blocks process_payment until verify_identity has run
hooks.before('process_payment', async (ctx) => {
  if (!ctx.session.identityVerified) {
    throw new Error('verify_identity must run first');
  }
});`,
},
```

**Domain reference:** 1 Agentic Architecture · 2 Tool Design & MCP · 3 Claude Code · 4 Prompt Engineering · 5 Context & Reliability

## Official resources

- Anthropic Academy: https://anthropic.skilljar.com
- Agent SDK: https://platform.claude.com/docs/en/agent-sdk/overview
- Claude Code: https://code.claude.com/docs/en/overview
- MCP docs: https://modelcontextprotocol.io/docs
