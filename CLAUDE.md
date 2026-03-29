# CCA Prep — Claude Context

## Project Identity

CCA Prep is a community study site for the Claude Certified Architect — Foundations exam. Not affiliated with Anthropic.

- **Stack:** Docusaurus 3.9.2, React 19, TypeScript 5.6
- **Hosted:** GitLab Pages — `https://cca-prep-a54506.git.pages.epam.com`
- **Node requirement:** >=20.0

## Build Commands

```
npm start            # dev server (localhost:3000)
npm run build        # production build
npm run typecheck    # tsc — run after EVERY data file edit
npm run serve        # serve the production build locally
```

Always run `npm run typecheck` after editing any `.ts` data file. TypeScript catches missing/wrong fields immediately (union types for Domain and Tier).

## Key File Paths

```
src/data/questions.ts         — Question[] array
src/data/flashcards.ts        — Flashcard[] array
src/data/cheatsheet.ts        — CheatsheetItem[] array
src/data/antipatterns.ts      — AntiPattern[] array

src/components/QuizEngine.tsx
src/components/FlashcardDeck.tsx
src/components/CheatsheetView.tsx
src/components/AntiPatternList.tsx
src/components/DomainCards.tsx
src/components/ExamStats.tsx

src/css/custom.css            — design system tokens
src/pages/index.tsx           — landing page
src/pages/quiz.tsx
src/pages/flashcards.tsx
src/pages/cheatsheet.tsx
src/pages/overview.tsx

docs/domain1/                 — study guide markdown files
docs/domain2/
docs/domain3/
docs/domain4/
docs/domain5/
docs/contributing.md

docusaurus.config.ts
sidebars.ts                   — register new docs here
.claude/commands/             — skill files (slash commands)
```

Named exports that matter: `QUESTIONS`, `FLASHCARDS`, `CHEATSHEET_ITEMS`, `ANTI_PATTERNS`, `DOMAIN_LABELS`, `DOMAIN_WEIGHTS`, `TIERS`, `QUESTION_COUNT`.

## Domain Reference

| ID | Label | Weight | Key Topics |
|----|-------|--------|------------|
| 1 | Agentic Architecture & Orchestration | 27% | agentic loops, stop_reason, Task tool, hub-and-spoke, hooks, session management, fork_session/--resume |
| 2 | Tool Design & MCP Integration | 18% | tool descriptions, MCP error schema, isError/isRetryable, tool_choice, tool scoping, .mcp.json |
| 3 | Claude Code Configuration & Workflows | 20% | CLAUDE.md hierarchy, plan mode, CI/CD integration, .mcp.json scoping, skill files, argument-hint |
| 4 | Prompt Engineering & Structured Output | 20% | structured output, validation-retry loop, Batch API decision criteria, tool_choice, few-shot |
| 5 | Context Management & Reliability | 15% | context window strategies, lost-in-the-middle, escalation triggers, structured facts extraction, error propagation |

## Tier Definitions

| Tier | What It Tests | scenario field |
|------|--------------|----------------|
| `basic` | Single-concept recall — "what does X mean?" | Not present |
| `intermediate` | Applied understanding — "what is wrong with this approach?" | Not present |
| `advanced` | Multi-constraint reasoning — tradeoffs across concepts | Not present |
| `exam` | Full scenario with business context, mirrors real CCA exam | **Required** |

Rule: `tier:'exam'` questions **must** have a `scenario` field. All other tiers **must not**.

## Exam Scenarios

The 6 canonical scenarios used in `tier:'exam'` questions:

1. **Customer Support Resolution Agent** — Domains 1, 2, 5
2. **Code Generation with Claude Code** — Domains 3, 5
3. **Multi-Agent Research System** — Domains 1, 2, 5
4. **Developer Productivity Tools** — Domains 1, 2, 3
5. **Claude Code for CI/CD** — Domains 3, 4
6. **Structured Data Extraction** — Domains 4, 5

The `scenario` string in a question is 2-3 sentences of business context that makes multiple answer options plausible. Cross-reference domain when choosing a scenario.

## Data Schemas

```typescript
// questions.ts
interface Question {
  id: number;
  domain: Domain;           // 1 | 2 | 3 | 4 | 5
  tier: Tier;               // 'basic' | 'intermediate' | 'advanced' | 'exam'
  scenario?: string;        // required if tier === 'exam', absent otherwise
  text: string;
  options: string[];        // exactly 4
  correct: number;          // 0-indexed (0–3)
  explanation: string;
  wrongExplanations?: string[]; // optional, 3 entries for the 3 wrong options
  refs: Ref[];              // required, at least 1 entry
}
interface Ref { label: string; url: string; }

// flashcards.ts
interface Flashcard {
  id: number;
  domain: Domain;
  front: string;
  back: string;  // uses \n for line breaks, • for bullets
}

// cheatsheet.ts
interface CheatsheetItem {
  id: number;
  domain: Domain;
  tag: string;    // short category label, e.g. 'Agentic loops', 'MCP errors', 'CLAUDE.md'
  title: string;
  body: string;
  code?: string;  // optional code block, TypeScript preferred
}

// antipatterns.ts
interface AntiPattern {
  id: number;
  domain: Domain;
  title: string;   // gerund: "Using X to do Y"
  why: string;
  correct: string;
  examTip: string;
}
```

## Content Quality Standards

**For all content types:**
- IDs are sequential — read the last `id` in the target file and increment by 1
- `domain` is an integer (1-5), not a string
- Run `npm run typecheck` after every edit

**Questions:**
- One concept per question — not "which of the following are true" multi-selects
- Exactly 4 options; one unambiguous correct answer
- All 4 options must be plausible — a test-savvy reader cannot eliminate one immediately without knowing the content
- At least one distractor should be a known anti-pattern (the most common exam trap)
- `explanation` must teach: (a) why correct is correct, (b) why at least one distractor fails
- `refs` must link to a specific page, not the docs homepage. Prefer Agent SDK docs and feature-specific pages
- `tier:'exam'` scenario: 2-3 sentences of business context making 2+ options superficially appealing; requires reasoning about tradeoffs, not just recall

**Flashcards:**
- `front`: one focused question
- `back`: direct answer on line 1; use `\n\n` to separate core answer from supporting detail; `•` for bullets
- Include a contrast element: "X vs Y", "when to use vs not use", "correct vs incorrect behavior"
- Keep `back` under ~6 lines so it fits on screen

**Cheatsheet items:**
- `body`: state the rule first, then exceptions/edge cases; use `\n\n` to separate logical blocks
- `code`: preferred for patterns with a canonical implementation; TypeScript preferred; comment the key decision line
- `tag`: reuse an existing tag string if the category already exists — avoid near-duplicate tags

**Anti-patterns:**
- `title`: gerund form — "Using X to do Y" — not "Do not use X"
- `why`: name the specific failure mode and the observable bad outcome in production
- `correct`: actionable — what exactly to do instead, with key constraint named explicitly
- `examTip`: name the tell-tale wording in exam distractors so a reader can recognize and eliminate on sight

## Design System

**CSS custom properties** (all in `src/css/custom.css`):

| Token | Value | Semantic Use |
|-------|-------|-------------|
| `--cca-orange` | `#d97757` | Primary accent, interactive elements |
| `--cca-blue` | `#6a9bcc` | Secondary accent, info states |
| `--cca-green` | `#788c5d` | Success, correct states |
| `--cca-red` | `#c0473a` | Error, wrong states |
| `--cca-gray` | `#b0aea5` | Neutral, muted text |
| `--cca-cream` | `#faf9f5` | Light mode background |
| `--cca-dark` | `#141413` | Dark mode background |

Each color has `-lt` (light/12% alpha background) and `-bd` (border/30% alpha) variants.

**Never hardcode hex values in components.** Always use `var(--cca-*)`.

**Fonts:**
- `Lora` — headings (`var(--ifm-heading-font-family)`)
- `Poppins` — body/UI (`var(--ifm-font-family-base)`)
- `DM Mono` — code and metrics (`var(--ifm-font-family-monospace)`)

**Domain badges:** use existing classes `badge-d1` through `badge-d5` — do not inline domain colors.

**Dark mode:** use `[data-theme='dark']` selector. Always test both light and dark modes after UI changes.

## Architecture Notes

- Data files are **append-only arrays**. New entries go in the array; named helpers (`DOMAIN_LABELS`, etc.) are at the bottom and must not be edited unless adding a new domain/tier.
- UI components import directly from data files — **no API layer, no state management library**. Components are pure React with `useState`/`useMemo`/`useCallback`.
- Study guide docs live in `docs/domain{1-5}/` as `.md` files. Adding a new doc requires registering it in `sidebars.ts`.
- The Docusaurus route base for docs is `study-guide/` (not `docs/`) — set by `routeBasePath: 'study-guide'` in `docusaurus.config.ts`.
- `npm run typecheck` uses `tsc` reading `tsconfig.json` — it validates types in all data files and components, catching wrong domain values, missing required fields, etc.
