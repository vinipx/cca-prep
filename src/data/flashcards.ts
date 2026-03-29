import type { Domain } from './questions';

export interface Flashcard {
  id: number;
  domain: Domain;
  front: string;
  back: string;
}

export const FLASHCARDS: Flashcard[] = [
  {
    id: 1, domain: 1,
    front: 'What are the two key stop_reason values in an agentic loop and what does each mean?',
    back: '"tool_use" → Claude wants to call a tool; loop must execute tools and continue.\n"end_turn" → Claude finished; loop terminates.\n\nNever use text content to decide termination — always use stop_reason.',
  },
  {
    id: 2, domain: 1,
    front: 'What is the Task tool and what must be in allowedTools to use it?',
    back: 'Task is the Agent SDK mechanism for spawning subagents.\n\n"Task" MUST be included in the coordinator\'s allowedTools — otherwise the coordinator cannot invoke subagents.',
  },
  {
    id: 3, domain: 1,
    front: 'Do subagents inherit context from the coordinator automatically?',
    back: 'NO. Subagents are fully isolated.\n\nContext must be explicitly included in the subagent\'s prompt by the coordinator. This includes prior findings, source URLs, metadata, and any shared state.',
  },
  {
    id: 4, domain: 1,
    front: 'How do you spawn subagents in parallel with the Task tool?',
    back: 'Emit multiple Task tool calls in a SINGLE coordinator response (single turn).\n\nMultiple Task calls across separate turns = sequential execution.\nMultiple Task calls in one turn = parallel execution.',
  },
  {
    id: 5, domain: 1,
    front: 'When should you use programmatic hooks vs. prompt instructions for workflow enforcement?',
    back: 'Hooks → deterministic, guaranteed compliance (financial gates, identity verification, policy rules).\n\nPrompt instructions → probabilistic guidance, non-zero failure rate.\n\nRule: if the failure rate must be zero, use hooks.',
  },
  {
    id: 6, domain: 1,
    front: 'What is fork_session vs --resume?',
    back: '--resume <name> → continues a named prior session (use when prior context is still valid).\n\nfork_session → creates independent branches from a shared baseline (use to explore divergent approaches in parallel).',
  },
  {
    id: 7, domain: 2,
    front: 'What is the primary mechanism Claude uses for tool selection?',
    back: 'Tool descriptions.\n\nClaude reads each tool\'s description to decide which tool to invoke. Weak, minimal, or overlapping descriptions are the #1 cause of misrouting in production.',
  },
  {
    id: 8, domain: 2,
    front: 'What are the four MCP error categories and what does isRetryable indicate?',
    back: 'errorCategory values:\n• transient — timeout, service unavailable (isRetryable: true)\n• validation — bad input format (isRetryable: false)\n• business — policy violation (isRetryable: false)\n• permission — access denied (isRetryable: false)\n\nisRetryable: true → agent may retry with same params.',
  },
  {
    id: 9, domain: 2,
    front: 'What is the difference between isError: false + empty array vs isError: true?',
    back: 'isError: false + [] → successful query, no records found. Do NOT retry.\n\nisError: true → execution failed. Agent should read errorCategory and decide whether to retry or escalate.\n\nTreating these identically causes agents to retry successful queries.',
  },
  {
    id: 10, domain: 2,
    front: 'What are the three tool_choice configuration options?',
    back: '"auto" → Claude decides whether to use a tool.\n"any" → Claude must use at least one tool.\n{"type": "tool", "name": "tool_name"} → Claude must call this specific tool.\n\nThere is no "required" or "none" option.',
  },
  {
    id: 11, domain: 3,
    front: 'What is the CLAUDE.md hierarchy and which takes precedence?',
    back: 'Subdirectory CLAUDE.md (closest to file)\n  > Project root CLAUDE.md\n  > Global user CLAUDE.md (~/.claude/CLAUDE.md)\n\nMore specific always wins. Subdirectory rules override project root rules.',
  },
  {
    id: 12, domain: 3,
    front: 'When should you use plan mode in Claude Code?',
    back: 'Before irreversible or high-impact operations:\n• Large-scale refactors\n• Database migrations\n• CI/CD deployments\n• Multi-file changes\n\nPlan mode shows Claude\'s intended actions BEFORE execution. You approve, modify, or cancel.',
  },
  {
    id: 13, domain: 3,
    front: 'What is the difference between CLAUDE.md and Agent Skills (SKILL.md)?',
    back: 'CLAUDE.md → always-loaded persistent context: project conventions, architecture rules, naming standards, build commands.\n\nSKILL.md → on-demand specialized knowledge: loaded when the task matches the skill\'s triggers. Good for deep domain expertise (accessibility, security, API patterns).',
  },
  {
    id: 14, domain: 3,
    front: 'What does permissionMode: "acceptEdits" do and when is it appropriate?',
    back: 'acceptEdits → auto-approves all file read/write operations without prompting.\n\nAppropriate for: CI/CD pipelines, automated batch workflows.\nNot appropriate for: interactive development where human review per edit is desired.',
  },
  {
    id: 15, domain: 4,
    front: 'What is a validation retry loop and what makes the error feedback effective?',
    back: 'Pattern:\n1. Request structured output\n2. Validate against schema\n3. On failure: send specific error back to Claude\n4. Claude regenerates with that feedback\n5. Repeat until valid or max retries\n\nEffective feedback: exact field name + expected format + actual wrong value.',
  },
  {
    id: 16, domain: 4,
    front: 'When should you use the Message Batches API vs synchronous API?',
    back: 'Batches API:\n• ~50% cost savings\n• 24-hour window, no SLA\n• Use for: overnight processing, bulk classification, non-interactive jobs\n\nSynchronous API:\n• Real-time, sub-second\n• Use for: live user queries, blocking workflows, anything with a hard latency requirement',
  },
  {
    id: 17, domain: 4,
    front: 'What does strict: true on a tool definition guarantee?',
    back: 'strict: true enables Structured Outputs mode for tool calls.\n\nGuarantees: Claude\'s tool inputs ALWAYS match the defined JSON schema — no missing required fields, no type mismatches.\n\nThis is a pre-call guarantee enforced at the API level.',
  },
  {
    id: 18, domain: 5,
    front: 'What is attention dilution and how do you fix it?',
    back: 'Attention dilution: content in the MIDDLE of very long contexts receives less reliable model attention ("lost in the middle").\n\nFix: per-section passes (each section gets full context window focus) + separate integration pass over summaries.\n\nLarger context window does NOT fix this — it just moves the diluted zone.',
  },
  {
    id: 19, domain: 5,
    front: 'Why is self-reported LLM confidence unreliable for escalation routing?',
    back: 'LLMs are poorly calibrated — they are often MOST confident on the cases they get WRONG.\n\nUse programmatic escalation signals instead:\n• Missing required data fields\n• Policy threshold violations (amount > $500)\n• Tool error count > N\n• Specific issue category flags',
  },
  {
    id: 20, domain: 5,
    front: 'What is information provenance and why does it matter in multi-agent pipelines?',
    back: 'Provenance = ability to trace any claim in synthesized output back to its original source (URL, doc title, page number).\n\nRequires: coordinator passes structured context with source metadata; synthesis schema includes citations array.\n\nEnables: fact-checking, transparency, source invalidation.',
  },

  // ── New flashcards from official CCA Exam Guide ───────────────────────────

  {
    id: 21, domain: 1,
    front: 'What must allowedTools include for a coordinator agent to spawn subagents?',
    back: '"Task" must be explicitly listed in the coordinator\'s allowedTools configuration.\n\nWithout "Task" in allowedTools, the coordinator cannot emit Task tool calls — they are silently ignored.\n\nCommon misconfiguration: developers configure subagent AgentDefinitions carefully but forget to add "Task" to the coordinator\'s own allowed tools.',
  },
  {
    id: 22, domain: 1,
    front: 'How do you run subagents in parallel instead of sequentially?',
    back: 'Emit multiple Task tool calls in a SINGLE coordinator response.\n\nSingle response → multiple Task calls = parallel execution.\nSeparate turns → one Task call each = sequential execution.\n\nLatency: parallel = max(subtask times) vs sequential = sum(subtask times).\n\nIndependent subagents (no data dependencies between them) should always be parallelized.',
  },
  {
    id: 23, domain: 1,
    front: 'fork_session vs --resume: when do you use each?',
    back: 'fork_session — creates two INDEPENDENT branches from a shared session baseline.\nUse when: exploring two divergent approaches from the same analysis starting point.\n\n--resume — CONTINUES a single existing named session.\nUse when: prior context is still valid and you want to pick up where you left off.\n\nKey difference: fork = branch into two paths; resume = continue one path.',
  },
  {
    id: 24, domain: 3,
    front: 'What is the interview pattern in iterative refinement?',
    back: 'Have Claude ask clarifying questions BEFORE implementing, to surface design decisions you may not have anticipated.\n\nBest for: unfamiliar domains with significant tradeoffs (caching, failure modes, security).\n\nExample questions surfaced: "Fail open or closed? TTL only or write-invalidate? Per-user or shared keys?"\n\nPrevents costly rework by resolving underspecified decisions upfront — before a line of code is written.',
  },
  {
    id: 25, domain: 2,
    front: 'What is the difference between project-scoped and user-scoped MCP servers?',
    back: 'Project-scoped (.mcp.json in project root):\n• Committed to version control\n• Available to ALL team members automatically\n• Use for: shared tooling (GitHub, Jira, internal databases)\n\nUser-scoped (~/.claude.json):\n• Personal, never version-controlled\n• Use for: personal or experimental servers\n\nBoth are available simultaneously.',
  },
  {
    id: 26, domain: 2,
    front: 'When should you use Grep vs Glob vs Read for codebase exploration?',
    back: 'Grep — search FILE CONTENTS for patterns\n• Find all callers of getUserById\n• Find all imports of lodash\n\nGlob — find FILES by name/extension pattern\n• Find all *.test.tsx files\n• Find all files in src/api/**\n\nRead — load FULL FILE CONTENTS after finding the file\n\nTypical flow: Grep to find entry points → Read to follow imports → build understanding incrementally.',
  },
  {
    id: 27, domain: 3,
    front: 'What does context: fork do in a SKILL.md frontmatter?',
    back: 'Runs the skill in an ISOLATED sub-agent context.\n\nAll intermediate output (tool calls, verbose reasoning) stays inside the isolated context.\nOnly the FINAL RESPONSE returns to the main conversation.\n\nUse for: exploration or analysis skills that produce a lot of intermediate output, preventing them from polluting the main conversation.',
  },
  {
    id: 28, domain: 3,
    front: 'Why do settings in ~/.claude/CLAUDE.md not help teammates?',
    back: 'User-level configuration (~/.claude/CLAUDE.md) is PERSONAL.\nIt exists only on your machine and is never committed to version control.\n\nTeammates cloning the repo get no user-level config.\n\nFor team-wide standards: use PROJECT-level CLAUDE.md (root or .claude/CLAUDE.md) — this IS committed to version control.\n\nRule: personal preferences → user-level; team standards → project-level.',
  },
  {
    id: 29, domain: 3,
    front: 'What does argument-hint do in SKILL.md frontmatter?',
    back: 'Prompts developers for required parameters when they invoke a skill WITHOUT providing arguments.\n\nExample frontmatter:\n  argument-hint: "target-version (e.g., v2.0.0)"\n\nWhen a developer runs /migrate without an argument, Claude Code displays this hint and requests the argument before proceeding.\n\nPrevents silent invocation with empty required inputs.',
  },
  {
    id: 30, domain: 4,
    front: 'What is the difference between tool_choice: "auto", "any", and forced selection?',
    back: '"auto" — Claude MAY call a tool OR return text. No guarantee of tool use.\n\n"any" — Claude MUST call at least one tool (its choice).\nUse when: multiple valid schemas exist and you need guaranteed structured output.\n\nForced: {"type": "tool", "name": "X"} — Claude MUST call this SPECIFIC tool.\nUse when: a specific tool must run first (e.g., extract_metadata before enrichment).\n\nauto = maybe; any = definitely some tool; forced = definitely this tool.',
  },
  {
    id: 31, domain: 4,
    front: 'When does a validation-retry loop fail to help?',
    back: 'Retries WORK for:\n✓ Format mismatches (wrong date format, wrong nesting)\n✓ Structural errors (wrong field placement)\n✓ Data that IS in the document but was extracted incorrectly\n\nRetries DO NOT HELP when:\n✗ Required information is ABSENT from the source document\n✗ The document references an external file not provided\n\nIf contracts consistently fail on every retry → information is missing from the source, not fixable by re-prompting.',
  },
  {
    id: 32, domain: 4,
    front: 'Why are independent review instances more effective than self-review?',
    back: 'Self-review in the same session retains REASONING CONTEXT from code generation.\nThe model is less likely to question its own decisions — it "knows why" it made each choice.\n\nAn INDEPENDENT instance (fresh session, no generation context) reviews with fresh eyes.\n\nPractical rule: generate in session A, review in fresh session B.\n\nEquivalent to: having code reviewed by someone who didn\'t write it.',
  },
  {
    id: 33, domain: 5,
    front: 'What is the "lost in the middle" effect and how do you mitigate it?',
    back: 'Models reliably process content at the BEGINNING and END of long inputs, but miss MIDDLE sections.\n\nSymptom: synthesis omits findings from middle sections, reliably includes beginning/end.\n\nMitigation:\n1. Place key summaries at the BEGINNING of aggregated inputs\n2. Per-section passes (each section gets its own focused context window)\n3. Separate integration pass over all section summaries\n\nLarger context window does NOT fix this — it just moves the diluted zone.',
  },
  {
    id: 34, domain: 5,
    front: 'What are the three canonical escalation triggers for a support agent?',
    back: '1. EXPLICIT customer request for a human → escalate IMMEDIATELY, no investigation first\n\n2. POLICY GAP — policy is silent or ambiguous on the case → human must decide\n\n3. INABILITY TO PROGRESS — agent cannot make meaningful progress\n\nNOT valid triggers:\n✗ Customer sentiment / frustration level\n✗ Agent self-reported confidence score\n✗ General case "complexity"',
  },
  {
    id: 35, domain: 5,
    front: 'What is a structured claim-source mapping and why is it required in multi-agent synthesis?',
    back: 'Links each extracted finding to its original source:\n{ claim: "34% adoption rate", source_url: "...", document: "McKinsey 2024", excerpt: "..." }\n\nWhy required:\n• Summarization strips attribution — "34%" becomes an unsourced fact\n• Source conflicts must preserve BOTH values with attribution\n• Downstream agents need to know WHERE each claim came from\n\nWithout it: synthesis output is unverifiable; conflicts get silently resolved.',
  },
  {
    id: 36, domain: 1,
    front: 'What is the crash recovery manifest pattern for multi-phase coordinator agents?',
    back: 'At the end of each phase, the coordinator writes a structured manifest to a known file location:\n• Phase number completed\n• Outputs produced by that phase\n• Inputs required for the next phase\n\nOn startup, the coordinator reads the manifest to resume from the last completed phase.\n\nWhy not --resume? It reloads conversation history, not computed subagent outputs.\nWhy not fork_session? It branches conversation state, not phase results.',
  },
  {
    id: 37, domain: 2,
    front: 'What is the difference between an MCP Resource and an MCP Tool?',
    back: 'MCP RESOURCE — a content catalog entry.\nExposes WHAT data exists so the agent can choose what to request.\nExample: list of available issue summaries, documentation pages, DB schema.\nNo parameters, no side effects — pure discovery.\n\nMCP TOOL — an operation.\nTakes parameters, executes logic, returns results.\nExample: fetch_issue(id), create_ticket(title, body).\n\nBrowse Resources FIRST → avoid blind exploratory Tool calls.',
  },
  {
    id: 38, domain: 3,
    front: 'How do you verify which CLAUDE.md files are loaded in the current Claude Code session?',
    back: 'Run `/memory` — it lists all memory files currently loaded, including which CLAUDE.md files are active and from which directories.\n\nUse this FIRST when Claude Code is not applying expected rules.\n\nCommon causes for missing CLAUDE.md:\n• File is in the wrong directory\n• Session started from a different working directory\n• Typo in the filename (must be exactly CLAUDE.md)',
  },
  {
    id: 39, domain: 3,
    front: 'What is test-driven iteration and why does it converge faster than prose descriptions?',
    back: 'Write the test suite FIRST (expected behavior, edge cases, boundaries).\nThen iterate by sharing the ACTUAL test failure output — not a prose description of what went wrong.\n\nWhy faster:\n• Test failure output is machine-precise: exact assertion, expected vs. actual, stack trace\n• Prose descriptions are ambiguous — Claude may misinterpret what "wrong" means\n• Each iteration targets a specific failing assertion, not a vague "still broken"\n\nPattern: write tests → run → share failures → fix → repeat.',
  },
  {
    id: 40, domain: 4,
    front: 'Why should optional fields in extraction schemas be nullable rather than required?',
    back: 'Required fields FORCE the model to fabricate a value when the source document does not contain the information.\n\nNullable optional fields allow an explicit null return:\n{ "invoice_date": null }  ← field absent in source\n\nvs.\n{ "invoice_date": "2024-01-01" }  ← fabricated to satisfy required\n\nRule: make a field required only if the source document ALWAYS contains it.\nMake it nullable if the document MAY omit it.',
  },
  {
    id: 41, domain: 4,
    front: 'What distinguishes a valid use of per-field confidence scores from the escalation anti-pattern?',
    back: 'ANTI-PATTERN (Domain 5): using raw, uncalibrated self-reported confidence as a blanket escalation trigger. Models are overconfident on wrong answers — high confidence ≠ correct.\n\nVALID USE (Domain 4): per-field confidence in extraction pipelines, CALIBRATED against a labeled validation set.\n\nCalibration process:\n1. Label 500+ extractions as correct/incorrect\n2. Find the confidence threshold where accuracy ≥ 95%\n3. Route fields BELOW that threshold to human review\n\nKey: empirically validated threshold, not raw score.',
  },
  {
    id: 42, domain: 5,
    front: 'How do you prevent temporal differences from being misclassified as source conflicts in synthesis?',
    back: 'Require subagents to include publication_date or data_collection_date in structured outputs.\n\nWithout dates:\n"48% cloud adoption" vs "81% cloud adoption" → looks like a conflict\n\nWith dates:\n"48% (2021)" vs "81% (2024)" → correctly interpreted as a time series\n\nRule: two sources reporting the same metric at DIFFERENT times = time series, not a conflict.\nTwo sources reporting the same metric at the SAME time = genuine conflict to annotate.',
  },
  {
    id: 43, domain: 3,
    front: 'What is the @import syntax in CLAUDE.md and when should you use it over subdirectory CLAUDE.md files?',
    back: '@import path/to/standards.md\n\nIncludes the content of another file inside CLAUDE.md at load time.\n\nUse @import when:\n• Sharing a standards file across multiple packages in a monorepo\n• A subdirectory maintainer wants to include shared rules without duplicating them\n\nUse subdirectory CLAUDE.md when:\n• Rules apply to all files in that directory\n• Rules are directory-bound (not shared elsewhere)\n\nKey: @import enables modular composition; subdirectory files are directory-scoped.',
  },
  {
    id: 44, domain: 3,
    front: 'What is the plan-then-execute workflow and when is it most valuable?',
    back: 'Two-phase workflow:\n1. PLAN MODE — explore the codebase, gather context, produce an implementation plan. No edits made.\n2. DIRECT EXECUTION — approve the plan, then Claude implements it.\n\nMost valuable when:\n• The task spans many files (migration, refactor)\n• You want to review the approach before any code changes\n• The scope is uncertain and needs investigation first\n\nNot needed for: targeted bug fixes, single-file changes, or tasks with a clear, known approach.',
  },
  {
    id: 45, domain: 3,
    front: 'When should you send multiple bugs in a single message vs. fix them sequentially?',
    back: 'SINGLE MESSAGE — when bugs INTERACT:\n• Both stem from the same flawed data model\n• Fixing one first would require re-fixing after the other\n• The correct fix requires seeing both together\n\nSEQUENTIAL — when bugs are INDEPENDENT:\n• Different modules, no shared code\n• Each fix is self-contained\n• Smaller diffs = cleaner attribution and review\n\nDefault: prefer sequential unless you have a reason to believe fixes interact.',
  },
];
