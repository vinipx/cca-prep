import type { Domain } from './questions';

export interface CheatsheetItem {
  id: number;
  domain: Domain;
  tag: string;
  title: string;
  body: string;
  code?: string;
}

export const CHEATSHEET_ITEMS: CheatsheetItem[] = [
  {
    id: 1, domain: 1, tag: 'Agentic loops',
    title: 'stop_reason control flow',
    body: 'Continue loop when stop_reason === "tool_use". Execute tools, append results to conversation history, call Claude again. Terminate when stop_reason === "end_turn". Never use text content checks as a stop signal.',
    code: `while (true) {
  const response = await claude.messages.create({...});
  if (response.stop_reason === 'end_turn') break;
  // stop_reason === 'tool_use' — execute tools
  const toolResults = await executeTools(response.content);
  messages.push({ role: 'assistant', content: response.content });
  messages.push({ role: 'user', content: toolResults });
}`,
  },
  {
    id: 2, domain: 1, tag: 'Multi-agent',
    title: 'Hub-and-spoke coordinator pattern',
    body: 'Coordinator manages ALL inter-subagent communication, error handling, and information routing. Subagents receive isolated context — must be passed explicitly in each prompt. Coordinator decomposes tasks, delegates, aggregates results, and routes errors. Subagents never communicate directly with each other.',
  },
  {
    id: 3, domain: 1, tag: 'Hooks',
    title: 'Programmatic enforcement via hooks',
    body: 'PostToolUse hooks normalize data between tool calls (timestamps, status codes, heterogeneous formats). Interception hooks block policy-violating calls before execution (refunds > $500). Use hooks for GUARANTEED compliance. Use prompt instructions only for guidance — they have a non-zero failure rate on compliance-critical paths.',
  },
  {
    id: 4, domain: 1, tag: 'Session management',
    title: '--resume vs fork_session',
    body: '--resume <session-name>: continues a named prior session. Use when prior context is mostly still valid. Best practice: explicitly inform Claude about any files that changed since the last session.\n\nfork_session: creates independent branches from a shared baseline. Use to explore two divergent approaches (e.g., two refactoring strategies) without interference.\n\nStart fresh when: prior tool results are stale due to major system changes.',
  },
  {
    id: 5, domain: 2, tag: 'Tool descriptions',
    title: 'Tool descriptions are the routing mechanism',
    body: 'Tool descriptions are the primary signal Claude uses for tool selection. Each description must state: (1) exact purpose, (2) required input format, (3) what it returns, (4) when to use it vs. similar alternatives, (5) edge cases. Overlapping descriptions cause misrouting. System prompt keywords can create unintended tool associations — review prompts for conflicts.',
  },
  {
    id: 6, domain: 2, tag: 'MCP errors',
    title: 'Structured MCP error fields',
    body: 'Every MCP error response must include:\n• isError: true/false\n• errorCategory: "transient" | "validation" | "business" | "permission"\n• isRetryable: true/false\n• message: human-readable description\n\nCritical distinction: isError: false + empty array = successful query with no results (do NOT retry). isError: true = execution failure (handle per errorCategory).',
    code: `// Transient — retry appropriate
{ isError: true, errorCategory: 'transient', isRetryable: true, message: 'DB timeout' }

// Business rule — do not retry
{ isError: true, errorCategory: 'business', isRetryable: false, message: 'Refund exceeds $500 limit' }

// Valid empty result — NOT an error
{ isError: false, content: [], message: 'No records found' }`,
  },
  {
    id: 7, domain: 3, tag: 'CLAUDE.md',
    title: 'CLAUDE.md hierarchy and use cases',
    body: 'Hierarchy (most specific wins): subdirectory CLAUDE.md > project root CLAUDE.md > global user ~/.claude/CLAUDE.md.\n\nProject root: coding standards, architecture decisions, naming conventions, PR format, shared tooling.\nSubdirectory: technology-specific rules (React patterns in /frontend, Python conventions in /backend).\nGlobal user: personal defaults and preferences.\n\nLoaded automatically at every session start — no additional configuration needed.',
  },
  {
    id: 8, domain: 3, tag: 'Plan mode',
    title: 'When to require plan mode',
    body: 'Plan mode shows Claude\'s full intended action sequence BEFORE any execution begins. Mandatory for: large-scale refactors, database schema migrations, CI/CD deployments, changes spanning 10+ files, any irreversible production operations.\n\nInvoke with /plan or the plan mode flag. Review the plan carefully. Approve, modify specific steps, or cancel entirely.',
  },
  {
    id: 9, domain: 4, tag: 'Structured output',
    title: 'Validation retry loop pattern',
    body: 'Step 1: Request output with JSON schema defined.\nStep 2: Validate response against schema.\nStep 3: If validation fails, return specific error to Claude: exact field + expected type/format + actual wrong value + example correction.\nStep 4: Claude regenerates with that feedback.\nRepeat until valid or max retries exceeded.\nOn persistent failures: set requires_human_review: true and route to manual queue.',
  },
  {
    id: 10, domain: 4, tag: 'Batch API',
    title: 'Message Batches API decision criteria',
    body: 'Use Batches API when ALL of these are true:\n✓ No real-time user waiting for the response\n✓ Deadline is hours away (not seconds)\n✓ Volume is high (100+ requests)\n✓ ~50% cost savings justify the variable latency\n\nNEVER use for:\n✗ Live user queries (chat, search)\n✗ Blocking workflows with hard SLAs\n✗ Any step a user is actively waiting on',
  },
  {
    id: 11, domain: 5, tag: 'Context & reliability',
    title: 'Attention dilution — diagnosis and fix',
    body: 'Symptom: agent misses details from the middle of long documents or contexts.\nRoot cause: attention dilution — not a context window size problem.\n\nFix pattern:\n1. Split document into logical sections\n2. Process each section with its own focused context pass\n3. Run a separate integration/synthesis pass over all section summaries\n\nA larger context window does NOT fix this — it just relocates the diluted zone. Never substitute window size for focused passes.',
  },

  // ── New cheatsheet items from official CCA Exam Guide ────────────────────

  {
    id: 12, domain: 3, tag: 'CLAUDE.md',
    title: 'CLAUDE.md configuration hierarchy',
    body: 'Three levels, each with a different scope:\n\n1. User-level (~/.claude/CLAUDE.md) — personal only, never shared via version control. Use for personal preferences.\n\n2. Project-level (root CLAUDE.md or .claude/CLAUDE.md) — committed to version control, applies to all team members.\n\n3. Directory-level (subdirectory CLAUDE.md) — applies only when working in that directory.\n\nPath-scoped rules (.claude/rules/*.md with YAML frontmatter) apply only to files matching glob patterns. Use these over directory-level CLAUDE.md when conventions span multiple directories (e.g., test files spread throughout the codebase).\n\n@import syntax: reference external files from any CLAUDE.md for modular configuration.',
    code: `# .claude/rules/testing.md
---
paths: ["**/*.test.tsx", "**/*.spec.ts"]
---
# Testing conventions
- Use React Testing Library
- Prefer userEvent over fireEvent
- Always test accessibility`,
  },
  {
    id: 13, domain: 3, tag: 'Skills',
    title: 'Skill SKILL.md frontmatter options',
    body: 'Three key frontmatter options for skills in .claude/skills/:\n\ncontext: fork — runs the skill in an isolated sub-agent context. Intermediate tool output stays isolated; only the final response returns. Use for verbose analysis or exploration skills.\n\nallowed-tools — restrict which tools the skill can call during execution. Prevents destructive actions.\n\nargument-hint — display text shown when the skill is invoked without arguments, prompting for required parameters.\n\nProject-scoped skills: .claude/skills/ (committed, shared)\nUser-scoped skills: ~/.claude/skills/ (personal, not shared)',
    code: `# .claude/skills/analyze-codebase.md
---
context: fork
allowed-tools: Read, Grep, Glob
argument-hint: "module-name to analyze (e.g., auth, payments)"
---
Analyze the architecture of the specified module...`,
  },
  {
    id: 14, domain: 1, tag: 'Session management',
    title: 'Session resumption vs fork_session',
    body: '--resume <session-name> — continues a specific prior named session. Use when prior context is still valid (no major file changes). When resuming after file changes, explicitly inform the agent about what changed for targeted re-analysis.\n\nfork_session — creates two independent branches from a shared session baseline. Use when exploring two divergent approaches from the same starting point (e.g., comparing two refactoring strategies).\n\nStarting fresh with summaries — preferred when prior tool results are stale (many files changed). Inject a structured summary of key findings into the new session\'s initial context.\n\n/compact — reduces context usage during extended sessions when context fills with verbose discovery output.',
  },
  {
    id: 15, domain: 2, tag: 'MCP servers',
    title: 'MCP server scoping: project vs user',
    body: 'Project-scoped .mcp.json (project root):\n• Committed to version control\n• Available to ALL team members automatically on clone/pull\n• Use for: shared team tooling (GitHub, Jira, internal databases)\n• Use environment variable expansion for credentials: ${GITHUB_TOKEN}\n\nUser-scoped ~/.claude.json:\n• Personal only, never version-controlled\n• Use for: personal experimental servers or user-specific integrations\n\nBoth scopes are active simultaneously — you can have project and user servers configured at the same time.',
    code: `// .mcp.json (committed to version control)
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "\${GITHUB_TOKEN}"
      }
    }
  }
}`,
  },
  {
    id: 16, domain: 2, tag: 'Built-in tools',
    title: 'Built-in tool selection guide',
    body: 'Grep — search file CONTENTS for patterns\n• Finding all callers of a function\n• Finding all imports of a module\n• Finding error message strings\n• Pattern: grep → find entry points → Read to follow\n\nGlob — find FILES by name/extension pattern\n• Find all *.test.tsx files\n• Find all files in src/api/**\n• Find all Terraform *.tf files\n\nRead — load FULL FILE CONTENTS for one file\nEdit — targeted modification using UNIQUE anchor text; fallback: Read + Write when anchor is non-unique\nWrite — create new files or full rewrites\nBash — shell commands not covered by above tools\n\nRule: Grep for content search, Glob for file name patterns, never use Bash for what a dedicated tool can do.',
  },
  {
    id: 17, domain: 4, tag: 'Structured output',
    title: 'tool_choice options — when to use each',
    body: '"auto" (default) — Claude may call a tool OR return conversational text. No guarantee of tool use. Use when tool calling is optional.\n\n"any" — Claude MUST call at least one tool, its choice. Use when you need guaranteed structured output but multiple extraction schemas are valid (e.g., document type unknown).\n\nForced {"type": "tool", "name": "X"} — Claude MUST call this specific named tool. Use when a specific tool must run FIRST before any other step (e.g., extract_metadata before enrichment tools).\n\nFor multi-step pipelines: use forced selection on the first turn, then "auto" or "any" for subsequent turns.',
    code: `// Guarantee a specific tool runs first
const response = await claude.messages.create({
  tools: [extractMetadata, enrichContent],
  tool_choice: { type: 'tool', name: 'extract_metadata' },
  messages,
});

// Then allow free tool selection for enrichment
const enriched = await claude.messages.create({
  tools: [enrichContent, validateOutput],
  tool_choice: { type: 'any' },
  messages: [...messages, response],
});`,
  },
  {
    id: 18, domain: 4, tag: 'Batch API',
    title: 'Message Batches API — use vs avoid',
    body: 'Message Batches API: ~50% cost savings, up to 24-hour processing window, no guaranteed latency SLA. Responses correlated via custom_id fields.\n\nUSE for (latency-tolerant, non-blocking):\n✓ Overnight technical debt reports\n✓ Weekly security audits\n✓ Nightly test generation\n✓ Bulk document classification\n✓ Any job where results are reviewed hours later\n\nAVOID for (blocking, latency-sensitive):\n✗ Pre-merge CI checks (developers waiting)\n✗ Live user queries\n✗ Any workflow with a hard sub-minute SLA\n\nNote: Batch API does NOT support multi-turn tool calling within a single request.',
  },
  {
    id: 19, domain: 4, tag: 'Review architecture',
    title: 'Multi-pass code review architecture',
    body: 'Problem: single-pass review of many files causes attention dilution — inconsistent depth, missed bugs, contradictory feedback.\n\nSolution — split into focused passes:\n\nPass 1 (per-file local): analyze each file individually for local issues (correctness, security, style). Each file gets its own focused context.\n\nPass 2 (cross-file integration): examine cross-file data flow, interface contracts, and integration points across all files together.\n\nAdditional patterns:\n• Independent review instance: use a fresh session (no generation context) for final review\n• Dedup pass: when re-running after new commits, include prior findings and instruct Claude to report only new or still-unaddressed issues',
  },
  {
    id: 20, domain: 5, tag: 'Context management',
    title: 'Structured facts extraction pattern',
    body: 'Problem: progressive summarization loses numerical precision — "$43.27" becomes "$43" or "approximately $40."\n\nSolution: extract transactional facts into a persistent "case facts" block included VERBATIM in every subsequent prompt, outside the summarized conversation history.\n\nWhat to extract:\n• Exact amounts (disputed charges, refund amounts)\n• Dates and order numbers\n• Account and case IDs\n• Statuses confirmed by the customer\n• Policy thresholds exceeded\n\nThe conversation history can be compressed; the facts block must stay exact.',
    code: `// Injected at the top of every prompt in the session
const caseFacts = {
  customerId: 'C-98234',
  disputedAmount: 43.27,  // exact — never summarize
  orderIds: ['ORD-1122', 'ORD-1133'],
  confirmedIssue: 'double charge on 2024-11-03',
};`,
  },
  {
    id: 21, domain: 5, tag: 'Error propagation',
    title: 'Structured error propagation response format',
    body: 'When a subagent fails, return structured error context — not empty results and not a generic "error" status.\n\nRequired fields in error response:\n• errorCategory: "transient" | "validation" | "permission" | "business"\n• isRetryable: boolean — should the coordinator retry?\n• failureType: what specifically went wrong\n• attemptedQuery: what the subagent tried\n• partialResults: any data retrieved before failure\n• alternativeApproach: suggestions for recovery\n\nNever return empty results on failure (coordinator mistakes it for "found nothing").\nNever terminate the entire workflow on a single subagent failure.',
    code: `// Structured error context returned by a subagent
return {
  isError: true,
  errorCategory: 'transient',
  isRetryable: true,
  failureType: 'timeout',
  attemptedQuery: 'AI adoption in healthcare 2024',
  partialResults: ['article1.pdf summary'],
  alternativeApproach: 'Try splitting query into two narrower searches',
};`,
  },
  {
    id: 22, domain: 1, tag: 'Context management',
    title: 'Trimming verbose tool outputs before context accumulation',
    body: 'Tool results often return far more data than the agent needs. A 40-field order object trimmed to 5 relevant fields before being appended to context costs ~90% fewer tokens — preventing exhaustion without losing semantic value.\n\nWhen to trim:\n• API responses with many irrelevant fields\n• File system listings where only a few paths are needed\n• Database records where only specific columns matter\n\nWhen NOT to trim:\n• When downstream agents need the full record\n• When the "irrelevant" fields might be referenced in error handling\n\nTrim at the tool result layer, before appending to conversation history.',
    code: `// Before appending tool result to context, extract only needed fields
const rawOrder = await getOrder(orderId); // 40 fields
const relevantOrder = {
  orderId: rawOrder.orderId,
  status: rawOrder.status,
  amount: rawOrder.amount,
  customerId: rawOrder.customerId,
  lastUpdated: rawOrder.lastUpdated,
  // 35 fields omitted — not needed for this agent's task
};
messages.push({ role: 'user', content: JSON.stringify(relevantOrder) });`,
  },
  {
    id: 23, domain: 1, tag: 'Multi-agent',
    title: 'Explore subagent pattern for context budget preservation',
    body: 'Spawn a dedicated Explore subagent for verbose discovery work. The subagent\'s tool calls — file listings, search results, directory trees — accumulate in its own isolated context. Only the structured summary returns to the coordinator.\n\nCoordinator context stays clean for high-level orchestration.\n\nUse when:\n• Discovering which files match a complex pattern across a large repo\n• Scanning many documents to find relevant ones\n• Any exploratory task that generates output the coordinator does not need verbatim\n\nThe coordinator\'s prompt to the Explore subagent should specify: what to look for and what format to return the summary in.',
  },
  {
    id: 24, domain: 2, tag: 'MCP servers',
    title: 'MCP Resources as content catalogs',
    body: 'MCP Resources expose WHAT data is available — they are content catalogs, not actions.\n\nUse Resources when:\n• Agents need to know which documents, issues, or schemas exist before deciding what to fetch\n• Exploratory tool calls waste quota when the agent does not know what is available\n• The data set is large and browsable (e.g., 500 Jira issues, a documentation hierarchy)\n\nUse Tools when:\n• The agent needs to perform an operation (create, update, fetch a specific item)\n\nPattern: agent browses Resource catalog → selects relevant items → calls Tools to fetch only those items.\n\nThis avoids blind tool calls like "fetch all issues and filter" when 450 of 500 are irrelevant.',
  },
  {
    id: 25, domain: 3, tag: 'CI/CD',
    title: '--output-format json + --json-schema for CI structured findings',
    body: 'For CI pipelines that need to post findings as inline PR comments or feed downstream tooling, use structured output flags instead of parsing prose.\n\n`--output-format json` — Claude Code emits JSON instead of Markdown prose.\n`--json-schema <schema-file>` — enforces a specific JSON shape.\n\nCombined with `-p` (non-interactive), this produces a fully machine-parseable output.\n\nTypical CI workflow:\n1. Claude Code runs review with these flags\n2. CI script parses the JSON findings\n3. Script posts each finding as an inline PR comment via the GitHub API\n\nDo not parse prose for structured data — use these flags instead.',
    code: `# CI step: structured review output
claude -p "Review for security issues" \\
  --output-format json \\
  --json-schema .claude/review-schema.json \\
  > findings.json

# findings.json shape (defined by review-schema.json):
# [{ "file": "src/auth.ts", "line": 42, "severity": "high", "message": "..." }]`,
  },
  {
    id: 26, domain: 4, tag: 'Structured output',
    title: '"other" + detail string pattern for extensible enums',
    body: 'Pure enums force the model to pick the nearest wrong category when a value does not fit — degrading accuracy silently.\n\nPattern: add "other" to the enum + a companion detail field.\n\nRules:\n• `category_detail` is null when `category !== "other"`\n• `category_detail` is a non-null string when `category === "other"`\n• Downstream: items with `category === "other"` are routed to human review\n\nBenefits:\n• Preserves controlled vocabulary for known types (enables aggregation, filtering)\n• Gives a structured escape hatch for novel cases\n• Surfaces unknown types for later enum expansion — do not silently fail',
    code: `// Schema
{
  "category": {
    "type": "string",
    "enum": ["medical", "dental", "pharmacy", "vision", "other"]
  },
  "category_detail": {
    "type": ["string", "null"],
    "description": "Required when category is 'other'. Null otherwise."
  }
}

// Valid outputs:
{ "category": "dental", "category_detail": null }
{ "category": "other", "category_detail": "holistic wellness treatment" }`,
  },
  {
    id: 27, domain: 4, tag: 'Structured output',
    title: 'detected_pattern field for false positive analysis',
    body: 'Add a `detected_pattern` field to structured review findings to name the code construct that triggered each finding.\n\nWhen developers dismiss findings, log which patterns were dismissed. Over time, high-dismissal patterns are false positive candidates for prompt tuning.\n\nWorkflow:\n1. Pipeline outputs `{ finding: "...", detected_pattern: "eval_in_userland" }`\n2. Developer dismisses the finding → pattern is logged\n3. Weekly: patterns dismissed > 70% of the time are flagged for review\n4. Tune prompt to exclude or handle those patterns differently\n\nWithout this field: you know precision is low but not WHY or WHERE to fix it.',
    code: `// Structured finding with pattern annotation
{
  "file": "src/renderer.js",
  "line": 88,
  "severity": "medium",
  "message": "Dynamic code execution via eval()",
  "detected_pattern": "eval_in_userland",  // ← enables false positive analysis
  "dismissed": false  // set to true when developer dismisses
}`,
  },
  {
    id: 28, domain: 5, tag: 'Context management',
    title: 'Field-level confidence calibration workflow',
    body: 'Per-field confidence scores are a valid routing signal when calibrated against labeled data — not when used raw.\n\nCalibration workflow:\n1. Extraction pipeline outputs { value: "2026-03-15", confidence: 0.82 } per field\n2. Team manually labels 500+ extractions as correct / incorrect\n3. Plot accuracy vs. confidence score — find the threshold where accuracy ≥ 95%\n4. Route fields below that threshold to human review\n5. Re-calibrate quarterly as document types evolve\n\nKey distinction from the anti-pattern:\n• Anti-pattern: raw, uncalibrated confidence as a blanket escalation signal\n• Valid use: empirically validated per-field threshold for review routing',
    code: `// Extraction output per field
{
  "invoice_number": { "value": "INV-2024-0892", "confidence": 0.97 },
  "invoice_date":   { "value": "2024-11-03",    "confidence": 0.91 },
  "line_items":     { "value": [...],             "confidence": 0.61 }  // → human review
}

// Routing logic (threshold calibrated from labeled validation set)
const REVIEW_THRESHOLD = 0.87; // empirically: accuracy ≥ 95% above this
const needsReview = fields.filter(f => f.confidence < REVIEW_THRESHOLD);`,
  },
  {
    id: 29, domain: 5, tag: 'Context management',
    title: 'Rendering content types appropriately in synthesis output',
    body: 'Do not homogenize all synthesis output to prose. Different content types communicate more clearly in different formats.\n\n• Financial / numerical data → tables (enables direct comparison)\n• Narrative findings, analysis → prose paragraphs\n• Technical specifications, APIs → structured lists or code blocks\n• Contested findings with conflicting sources → side-by-side comparison\n• Time series data → table with date column\n\nWhy it matters: converting a 10-row financial comparison to prose strips the structure that makes comparison possible. Converting a nuanced narrative to bullet points loses the connective reasoning.\n\nInstruct synthesis agents explicitly: "present financial data as tables, narrative analysis as prose, and flagged conflicts as side-by-side comparisons."',
  },
];
