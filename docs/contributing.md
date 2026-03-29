---
id: contributing
title: Contributing to CCA Prep
sidebar_label: "\U0001F91D Contributing"
---

# Contributing to CCA Prep

Every question, flashcard, and cheatsheet item in this project lives in a TypeScript data file. Contributing is as simple as appending a new object to the right array.

:::tip Before you start
All examples below are **copy-paste-ready**. Grab one, change the content, and run `npm start` — TypeScript will catch any schema mistakes immediately.
:::

---

## What you can contribute

| Content type | File | Current count |
|:---|:---|:---:|
| Practice questions | `src/data/questions.ts` | 100 |
| Flashcards | `src/data/flashcards.ts` | 20 |
| Cheatsheet items | `src/data/cheatsheet.ts` | 11 |
| Anti-patterns | `src/data/antipatterns.ts` | 7 |
| Study guide docs | `docs/domain{1-5}/*.md` | 20 |

---

## Quick reference

### Domains

| ID | Domain | Key topics |
|:---:|:---|:---|
| 1 | **Agentic Architecture** | Agent loops, multi-agent orchestration, Task tool, hooks, session management |
| 2 | **Tool Design & MCP** | Tool descriptions, MCP errors, tool scoping, result formatting |
| 3 | **Claude Code** | CLAUDE.md conventions, plan mode, CI/CD integration, hooks |
| 4 | **Prompt Engineering** | Structured output, batch API, few-shot patterns, validation retries |
| 5 | **Context & Reliability** | Context window strategies, escalation, long-horizon tasks |

### Difficulty tiers

| Tier | What it tests |
|:---|:---|
| `basic` | Single-concept recall — *what does X mean?* |
| `intermediate` | Applied understanding — *what is wrong with this approach?* |
| `advanced` | Multi-constraint reasoning — *given these tradeoffs, what is best?* |
| `exam` | Full scenario with business context — mirrors the actual CCA exam format |

---

## Adding a practice question

Edit **`src/data/questions.ts`** — append a new object to the exported array.

### Schema

| Field | Type | Required | Description |
|:---|:---|:---:|:---|
| `id` | `number` | Yes | Next sequential integer |
| `domain` | `1 \| 2 \| 3 \| 4 \| 5` | Yes | Maps to the exam domain |
| `tier` | `Tier` | Yes | `'basic'` `'intermediate'` `'advanced'` `'exam'` |
| `scenario` | `string` | Exam only | Business context paragraph for exam-tier questions |
| `text` | `string` | Yes | The question itself |
| `options` | `string[4]` | Yes | Exactly 4 answer choices |
| `correct` | `number` | Yes | **0-indexed** position of the correct option |
| `explanation` | `string` | Yes | Teaches the concept — not just "B is correct" |
| `wrongExplanations` | `string[3]` | No | Per-distractor explanations (optional) |
| `refs` | `Ref[]` | Yes | Links to official Anthropic docs |

### Example — intermediate tier

```typescript
{
  id: 101,
  domain: 1,
  tier: 'intermediate',
  text: 'A developer uses few-shot examples to ensure verify_identity always runs before process_payment. What is the fundamental problem with this approach?',
  options: [
    'Few-shot examples increase prompt token usage, risking context overflow',
    'Few-shot examples influence tool ordering probabilistically, not deterministically',
    'Claude ignores few-shot examples when tool descriptions are present',
    'The approach is valid — few-shot examples are the recommended ordering mechanism',
  ],
  correct: 1,
  explanation:
    'Few-shot examples demonstrate a pattern and raise the probability Claude follows it — but they cannot guarantee ordering. For compliance or financial workflows, "most of the time" is unacceptable. Use programmatic prerequisite hooks that deterministically block downstream tools until required upstream tools have completed.',
  refs: [
    { label: 'Hooks — tool prerequisites', url: 'https://platform.claude.com/docs/en/agent-sdk/hooks' },
    { label: 'Few-shot prompting', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-examples' },
  ],
},
```

### Example — exam tier (with scenario)

```typescript
{
  id: 102,
  domain: 2,
  tier: 'exam',
  scenario:
    'You are building a refund processing agent for an e-commerce platform. The MCP tool process_refund returns different shapes depending on the outcome: a refund object on success, an empty array when no eligible orders are found, and an error object when the database is unavailable.',
  text: 'How should the agent distinguish between "no eligible orders" and a database failure?',
  options: [
    'Check whether the response body is an empty array vs. an object',
    'Inspect the isError flag: false with empty content means no results; true means execution failure',
    'Retry the tool three times — if it keeps returning empty, assume no orders exist',
    'Ask Claude to infer intent from the message field of the response',
  ],
  correct: 1,
  explanation:
    'isError: false with empty content is a successful query that found nothing — do not retry. isError: true signals an execution failure that may be retryable (check isRetryable and errorCategory). Relying on response shape or retry count conflates two semantically different outcomes.',
  refs: [
    { label: 'MCP error handling', url: 'https://platform.claude.com/docs/en/agent-sdk/mcp' },
  ],
},
```

:::info Exam-tier questions require a `scenario` field
The scenario sets up business context so the reader must reason about tradeoffs — not just recall a fact. Keep scenarios 2–3 sentences.
:::

---

## Adding a flashcard

Edit **`src/data/flashcards.ts`** — append a new object to the exported array.

### Schema

| Field | Type | Required | Description |
|:---|:---|:---:|:---|
| `id` | `number` | Yes | Next sequential integer |
| `domain` | `1 \| 2 \| 3 \| 4 \| 5` | Yes | Enables domain filter in the UI |
| `front` | `string` | Yes | The question side of the card |
| `back` | `string` | Yes | The answer side — use `\n` for line breaks |

### Example

```typescript
{
  id: 21,
  domain: 1,
  front: 'When must you use programmatic hooks instead of few-shot examples?',
  back:
    'When tool ordering MUST be enforced deterministically.\n\n' +
    'Few-shot examples = probabilistic influence.\n' +
    'Programmatic hooks = deterministic enforcement every time.\n\n' +
    'Use hooks for: compliance workflows, financial operations, irreversible action sequences.',
},
```

:::tip Writing effective flashcards
- **Front**: One focused question — not a list of things to remember.
- **Back**: Lead with the direct answer, then add a contrast (e.g., "X vs. Y").
- Use `\n\n` to separate the core answer from supporting detail.
- Keep backs under ~6 lines so they fit on screen without scrolling.
:::

---

## Adding a cheatsheet item

Edit **`src/data/cheatsheet.ts`** — append a new object to the exported array.

### Schema

| Field | Type | Required | Description |
|:---|:---|:---:|:---|
| `id` | `number` | Yes | Next sequential integer |
| `domain` | `1 \| 2 \| 3 \| 4 \| 5` | Yes | Used for grouping |
| `tag` | `string` | Yes | Short category label (e.g., `'Agentic loops'`, `'MCP errors'`) |
| `title` | `string` | Yes | Quick-reference title |
| `body` | `string` | Yes | Plain-text explanation |
| `code` | `string` | No | Code example (TypeScript/JavaScript preferred) |

### Example — with code

```typescript
{
  id: 12,
  domain: 1,
  tag: 'Hooks',
  title: 'Enforcing tool prerequisites programmatically',
  body:
    'Use before-hooks to block a tool until a required upstream tool has completed. ' +
    'This is deterministic — unlike few-shot examples which are probabilistic.\n\n' +
    'Required when: ordering matters for compliance, safety, or data integrity.',
  code: `// Block process_payment until verify_identity has run
hooks.before('process_payment', async (ctx) => {
  if (!ctx.session.get('identityVerified')) {
    throw new Error('verify_identity must complete before process_payment');
  }
});`,
},
```

### Example — without code

```typescript
{
  id: 13,
  domain: 5,
  tag: 'Escalation',
  title: 'Deterministic escalation triggers',
  body:
    'Route to human review based on objective conditions, not Claude\'s self-reported confidence.\n\n' +
    'Reliable triggers:\n' +
    '• Missing required data fields\n' +
    '• Amount exceeds policy threshold (e.g., refund > $500)\n' +
    '• Specific issue category flags\n' +
    '• Tool error count exceeds limit\n\n' +
    'Unreliable: Claude\'s confidence score (models are poorly calibrated).',
},
```

---

## Adding an anti-pattern

Edit **`src/data/antipatterns.ts`** — append a new object to the exported array.

### Schema

| Field | Type | Required | Description |
|:---|:---|:---:|:---|
| `id` | `number` | Yes | Next sequential integer |
| `domain` | `1 \| 2 \| 3 \| 4 \| 5` | Yes | Primary domain this mistake appears in |
| `title` | `string` | Yes | What NOT to do (short phrase) |
| `why` | `string` | Yes | Why this fails — the concrete failure mode |
| `correct` | `string` | Yes | What to do instead |
| `examTip` | `string` | Yes | How this shows up in exam questions |

### Example

```typescript
{
  id: 8,
  domain: 5,
  title: 'Using Claude\'s self-reported confidence to trigger escalation',
  why:
    'LLMs are poorly calibrated. Models express high confidence on questions they answer incorrectly. ' +
    'For escalation routing, this means the cases that MOST need human review are the ones the model ' +
    'will most confidently handle itself — and get wrong.',
  correct:
    'Use programmatic escalation triggers: missing required data fields, policy threshold violations ' +
    '(e.g., amount > $500), specific issue category flags, or tool error counts exceeding a threshold. ' +
    'These are objective and deterministic.',
  examTip:
    'Any answer option that relies on "Claude\'s confidence score" or "self-reported certainty" ' +
    'as an escalation signal is wrong. Look for the answer that names a concrete, measurable threshold.',
},
```

:::danger Anti-pattern exam strategy
On the CCA exam, at least one distractor per question is a known anti-pattern. Studying the [anti-patterns list](/study-guide/anti-patterns) teaches you to eliminate wrong answers before reasoning about correct ones.
:::

---

## Adding a study guide doc

Study guide docs live in `docs/domain{1-5}/` as Markdown files.

**Step 1** — Create the file with frontmatter:

```markdown
---
id: your-topic
title: Your Topic Title
---

# Your Topic Title

Content goes here...
```

**Step 2** — Register in `sidebars.ts` under the matching domain:

```typescript
{
  type: 'category',
  label: 'Domain 1 — Agentic Architecture',
  items: [
    'domain1/overview',
    // ... existing items
    'domain1/your-topic',   // add here
  ],
},
```

---

## General guidelines

:::warning Check before submitting
1. **IDs are sequential** — check the last `id` in the target file and increment by 1.
2. **Always include `refs`** for questions — link to the specific official Anthropic page, not the docs homepage.
3. **Run `npm start`** — TypeScript will catch missing fields or wrong types immediately.
4. **Explanations teach** — don't just restate the correct answer; explain *why* the alternatives fail.
5. **Exam-tier = scenario-rich** — provide enough business context to test reasoning, not recall.
:::
