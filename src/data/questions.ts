export type Tier = 'basic' | 'intermediate' | 'advanced' | 'exam';
export type Domain = 1 | 2 | 3 | 4 | 5;

export interface Ref {
  label: string;
  url: string;
}

export interface Question {
  id: number;
  domain: Domain;
  tier: Tier;
  scenario?: string; // exam-ready questions name their scenario
  text: string;
  options: string[];
  correct: number; // index 0-3
  explanation: string;
  wrongExplanations?: string[]; // per-distractor explanations (optional)
  refs: Ref[];
}

export const QUESTIONS: Question[] = [

  // ─── DOMAIN 1 — Agentic Architecture & Orchestration ────────────────────

  // BASIC
  {
    id: 1, domain: 1, tier: 'basic',
    text: 'In an agentic loop, what does a `stop_reason` value of `"tool_use"` indicate?',
    options: [
      'Claude is requesting that a tool be executed and its result fed back',
      'Claude has finished the task and no further action is needed',
      'The agentic loop has exceeded its configured maximum iteration count limit and was terminated',
      'Claude encountered an unrecoverable error and cannot continue',
    ],
    correct: 0,
    explanation: '`stop_reason: "tool_use"` means Claude wants to invoke one or more tools. Your loop must execute those tools, append the results to the conversation history, and call Claude again. The loop only terminates when `stop_reason` is `"end_turn"` (or a budget/turn limit is hit).',
    refs: [
      { label: 'Agent SDK — how the loop works', url: 'https://platform.claude.com/docs/en/agent-sdk/agent-loop' },
      { label: 'Tool use overview', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview' },
    ],
  },
  {
    id: 2, domain: 1, tier: 'basic',
    text: 'What does `stop_reason: "end_turn"` signal in an agentic loop?',
    options: [
      'A tool execution failed and must be retried by the loop handler',
      'Claude has completed its response and the loop should terminate',
      'The model ran out of available context window space mid-response',
      'The user must provide additional input before the loop continues',
    ],
    correct: 1,
    explanation: '`end_turn` means Claude has produced a final text-only response with no pending tool calls. This is the correct loop termination signal. Do not check text content or other heuristics to decide when to stop — always use `stop_reason`.',
    refs: [
      { label: 'Agent SDK — how the loop works', url: 'https://platform.claude.com/docs/en/agent-sdk/agent-loop' },
    ],
  },
  {
    id: 3, domain: 1, tier: 'basic',
    text: 'What is the role of a coordinator agent in a hub-and-spoke multi-agent architecture?',
    options: [
      'To execute all tool calls directly without delegating to others',
      'To act as a proxy relay between subagents and external tool APIs',
      'To decompose tasks, delegate to subagents, and aggregate results',
      'To store a shared memory space accessible by all active subagents',
    ],
    correct: 2,
    explanation: 'In hub-and-spoke, the coordinator is the central hub. It decomposes the task, delegates to specialist subagents, routes information, and aggregates results. Subagents communicate only through the coordinator — never directly with each other.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 4, domain: 1, tier: 'basic',
    text: 'Which SDK option caps the number of tool-use turns in an agentic loop?',
    options: [
      'max_iterations',
      'turn_limit',
      'stop_after',
      'max_turns',
    ],
    correct: 3,
    explanation: '`max_turns` (Python) / `maxTurns` (TypeScript) limits how many tool-use turns the loop can run. It counts tool-use turns only, not the final text response. `max_budget_usd` / `maxBudgetUsd` is the cost-based equivalent.',
    refs: [
      { label: 'Agent SDK — turns and budget', url: 'https://platform.claude.com/docs/en/agent-sdk/agent-loop' },
    ],
  },
  {
    id: 5, domain: 1, tier: 'basic',
    text: 'After a coordinator spawns a subagent using the Task tool, does the subagent automatically have access to the coordinator\'s conversation history?',
    options: [
      'No — subagents have isolated context and receive information only via their prompt',
      'Yes — the Agent SDK shares conversation context and tool results automatically between all agents',
      'Yes — subagents inherit context through the SDK\'s shared session state store',
      'Only if the coordinator explicitly sets `share_context: true` in the Task call',
    ],
    correct: 0,
    explanation: 'Subagents are isolated. They have no access to the coordinator\'s conversation history unless the coordinator explicitly includes the relevant information in the subagent\'s prompt. This is one of the most commonly tested facts on the exam.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },

  // INTERMEDIATE
  {
    id: 6, domain: 1, tier: 'intermediate',
    text: 'A developer implements an agentic loop that checks `response.content[0].text` to decide whether to stop. What is wrong with this approach?',
    options: [
      'The content array may be empty or missing, causing a runtime index error',
      'Text content checks are unreliable — `stop_reason` is the authoritative signal',
      'The developer should check `response.content[0].type` instead of the `.text` field',
      'Nothing is wrong; this is a valid alternative approach to checking `stop_reason`',
    ],
    correct: 1,
    explanation: '`stop_reason` is the correct and only reliable termination signal. Parsing text content (e.g., looking for "Done" or "Finished") is an anti-pattern: Claude\'s phrasing varies and the text may contain the word even mid-task. Always use `stop_reason === "end_turn"` to terminate the loop.',
    refs: [
      { label: 'Agent SDK — how the loop works', url: 'https://platform.claude.com/docs/en/agent-sdk/agent-loop' },
    ],
  },
  {
    id: 7, domain: 1, tier: 'intermediate',
    text: 'A coordinator agent decomposes a research task into 3 fixed subtopics and consistently misses entire subject areas. What is the root cause?',
    options: [
      'The subagents are not returning their completed results back to the coordinator agent for aggregation',
      'The context window is too small to handle all aspects of the full topic',
      'Fixed decomposition is too narrow — the coordinator should adapt scope dynamically',
      'The web search tool is returning incomplete or low-quality search results',
    ],
    correct: 2,
    explanation: 'Fixed decomposition causes incomplete coverage when topics are broader or more complex than the preset subtopics. The coordinator should analyze the query and dynamically determine how many subtopics to generate, not always route through a fixed pipeline. This is a task decomposition design flaw.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 8, domain: 1, tier: 'intermediate',
    text: 'You want to spawn multiple subagents to run in parallel. How do you achieve this with the Task tool?',
    options: [
      'Set `parallel: true` in the Task tool configuration object for concurrent execution',
      'Call the Task tool separately, once per coordinator turn each time',
      'Use the `fork_session` function instead of the standard Task tool',
      'Emit multiple Task tool calls within a single coordinator response',
    ],
    correct: 3,
    explanation: 'Parallel subagent execution is triggered by emitting multiple Task tool calls in a single coordinator response (single turn). If you make separate Task calls across separate turns, they execute sequentially. The SDK interprets multiple tool calls in one response as concurrent invocations.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 9, domain: 1, tier: 'intermediate',
    text: 'When passing context from a web search subagent to a synthesis subagent, what should the coordinator include to preserve attribution?',
    options: [
      'Structured data separating content from metadata like source URLs and page numbers',
      'Only the final text summary without source URLs; including metadata adds unnecessary token overhead cost',
      'A plain text blob of all findings concatenated together without structure',
      'A reference to the shared session ID where the subagent results are stored',
    ],
    correct: 0,
    explanation: 'The coordinator should use structured data to separate content (what was found) from metadata (where it came from — URLs, titles, page numbers). This allows the synthesis subagent to produce properly cited output and enables the coordinator to trace any finding back to its source for verification.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 10, domain: 1, tier: 'intermediate',
    text: 'Which mechanism must be included in the coordinator\'s `allowedTools` for it to spawn subagents?',
    options: [
      'Spawn',
      'Task',
      'Delegate',
      'SubAgent',
    ],
    correct: 1,
    explanation: 'The `Task` tool is the Agent SDK mechanism for spawning subagents. If "Task" is not included in the coordinator\'s `allowedTools`, the coordinator cannot invoke subagents — the call will either fail or Claude will not attempt it.',
    refs: [
      { label: 'Agent SDK quickstart', url: 'https://platform.claude.com/docs/en/agent-sdk/quickstart' },
    ],
  },
  {
    id: 11, domain: 1, tier: 'intermediate',
    text: 'A PostToolUse hook is best used to accomplish which of the following?',
    options: [
      'Block a tool from being called at all during the current session',
      'Override Claude\'s decision about which tool to invoke in the next step of the agentic loop',
      'Normalize heterogeneous data formats like timestamps before Claude processes them',
      'Log all tool calls and their results to an external database for auditing',
    ],
    correct: 2,
    explanation: 'PostToolUse hooks intercept tool results *after* execution but *before* Claude processes them. They are ideal for normalizing heterogeneous data — e.g., converting Unix timestamps, ISO 8601 strings, and numeric codes from different MCP tools into a consistent format. Blocking tool calls before execution requires a pre-call interception hook.',
    refs: [
      { label: 'Agent SDK — hooks documentation', url: 'https://github.com/anthropics/claude-agent-sdk-python' },
    ],
  },
  {
    id: 12, domain: 1, tier: 'intermediate',
    text: 'You use `--resume <session-name>` to continue a prior investigation. After resuming, you notice Claude is reasoning from stale file analysis done before you modified several files. What should you do?',
    options: [
      'Restart the entire session from scratch with no prior context at all',
      'Use `fork_session` to create an independent branch from the stale point',
      'Simply re-run the previous prompt — Claude will automatically detect and process file changes',
      'Tell the resumed session which files changed so Claude re-analyzes them specifically',
    ],
    correct: 3,
    explanation: 'When resuming a session after code modifications, you must explicitly tell Claude which files changed. Claude will not automatically diff the file system against its prior analysis. Targeted re-analysis ("file X and Y were modified — please re-analyze them") is more efficient than full re-exploration and produces better results than relying on stale tool results.',
    refs: [
      { label: 'Claude Code — memory and sessions', url: 'https://code.claude.com/docs/en/memory' },
    ],
  },
  {
    id: 13, domain: 1, tier: 'intermediate',
    text: '`fork_session` is most appropriate when you want to:',
    options: [
      'Create independent exploration branches from a shared analysis baseline point',
      'Continue a previously suspended session with updated and corrected context information',
      'Run the same agent on multiple machines simultaneously for load balancing',
      'Share session state between two different coordinator agents in a pipeline',
    ],
    correct: 0,
    explanation: '`fork_session` creates parallel branches from a shared starting point — ideal when you want to explore two divergent approaches (e.g., two refactoring strategies, two testing architectures) without them interfering with each other. It is not for resuming sessions or distributed execution.',
    refs: [
      { label: 'Claude Code — sessions and forking', url: 'https://code.claude.com/docs/en/overview' },
    ],
  },

  // ADVANCED
  {
    id: 14, domain: 1, tier: 'advanced',
    text: 'A financial workflow requires that `verify_identity` must always run before `process_payment`. A senior engineer proposes adding a clear system prompt instruction: "Always call verify_identity before process_payment." Why is this insufficient for a production financial system?',
    options: [
      'System prompt instructions are ignored when tools are present',
      'Claude cannot read multi-sentence system prompts reliably',
      'Prompt instructions have a non-zero failure rate; programmatic prerequisites with hooks provide deterministic enforcement',
      'The instruction would only apply during the first tool call, not subsequent calls',
    ],
    correct: 2,
    explanation: 'Prompt instructions influence Claude probabilistically — they work most of the time but have a measurable failure rate. For compliance-critical financial operations (identity verification before payment), "most of the time" is not acceptable. Programmatic prerequisites — hooks that literally block `process_payment` until `verify_identity` has returned a verified customer ID — provide guaranteed enforcement regardless of Claude\'s reasoning.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 15, domain: 1, tier: 'advanced',
    text: 'A multi-agent research coordinator produces synthesis reports with poor coverage because it invokes all four subagents (web, document, synthesis, report) for every query regardless of complexity. What architectural improvement should be made?',
    options: [
      'Add a fifth "orchestration" subagent to manage the other four',
      'Switch to a fixed sequential pipeline with no dynamic routing',
      'Configure the coordinator to analyze query requirements and dynamically select only the relevant subagents',
      'Increase the context window size to accommodate all four subagents\' outputs',
    ],
    correct: 2,
    explanation: 'Always routing through the full pipeline is wasteful and can actually degrade quality (irrelevant subagents add noise). The coordinator should analyze each query and dynamically select only the subagents needed. A simple factual question might only need the web search subagent; a document-heavy analysis might skip web search entirely.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 16, domain: 1, tier: 'advanced',
    text: 'You are designing a coordinator prompt for a multi-agent research system. Which prompt style leads to better subagent outcomes?',
    options: [
      'Step-by-step procedural instructions: "First search for X, then analyze Y, then synthesize Z"',
      'Goal-oriented prompts specifying research goals and quality criteria rather than procedural steps',
      'Single-sentence prompts to minimize token usage',
      'Prompts that list which tools each subagent should use in what order',
    ],
    correct: 1,
    explanation: 'Goal-oriented coordinator prompts ("Research the impact of X on Y, ensure findings are cited, cover both short-term and long-term effects") outperform procedural step-by-step instructions. Specifying the *what* and *quality bar* rather than the *how* allows subagents to adapt their approach based on what they discover, producing more thorough and accurate results.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 17, domain: 1, tier: 'advanced',
    text: 'When should you start a new session with an injected structured summary rather than resuming a prior session with `--resume`?',
    options: [
      'Always — new sessions are always more reliable than resumed ones',
      'When the prior session\'s tool results are stale due to significant system state changes',
      'Only when the original session exceeded 100 turns',
      'When the task domain changes from one programming language to another',
    ],
    correct: 1,
    explanation: 'Resume (`--resume`) is effective when prior context is mostly still valid. When significant state changes have occurred (large refactors, database schema changes, dependency updates), the prior tool results become stale and can mislead Claude into reasoning from outdated assumptions. A fresh session with an injected structured summary of current state is more reliable in these cases.',
    refs: [
      { label: 'Claude Code — memory and sessions', url: 'https://code.claude.com/docs/en/memory' },
    ],
  },
  {
    id: 18, domain: 1, tier: 'advanced',
    text: 'An interception hook blocks a `process_refund` call when the refund amount exceeds $500 and redirects to `escalate_to_human`. A colleague argues this logic should be in the system prompt instead. What is the strongest argument against the system prompt approach?',
    options: [
      'System prompts cannot reference specific dollar thresholds',
      'Claude would ignore financial rules in system prompts',
      'Hooks provide deterministic, guaranteed enforcement; prompt instructions are probabilistic and have a measurable failure rate on compliance-critical paths',
      'System prompts are processed before tool definitions and cannot reference tool names',
    ],
    correct: 2,
    explanation: 'For business rule enforcement (refund thresholds, compliance gates), determinism is required. Hooks are code that executes deterministically — the rule fires every time without exception. A system prompt instruction might work 99% of the time, but for financial operations, 1% failure means real financial exposure. This is the fundamental programmatic vs prompt-based enforcement tradeoff.',
    refs: [
      { label: 'Agent SDK — hooks', url: 'https://github.com/anthropics/claude-agent-sdk-python' },
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 19, domain: 1, tier: 'advanced',
    text: 'A large code review task is producing inconsistent results because Claude is missing interactions between files analyzed separately. What decomposition strategy addresses this?',
    options: [
      'Use a larger model with a bigger context window to process all files simultaneously',
      'Split into per-file local analysis passes followed by a separate cross-file integration pass',
      'Have Claude re-read the entire codebase after each file analysis',
      'Increase max_turns to allow more iterations',
    ],
    correct: 1,
    explanation: 'Attention dilution occurs when too many files are processed simultaneously. The correct pattern: (1) run focused per-file analysis passes where each file gets full attention, then (2) run a dedicated cross-file integration pass with summaries from step 1. This two-phase approach reliably surfaces cross-file issues without attention degradation.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 20, domain: 1, tier: 'advanced',
    text: 'What is the key difference between `prompt chaining` and `dynamic adaptive decomposition` for task execution?',
    options: [
      'Prompt chaining uses multiple models; dynamic decomposition uses one',
      'Prompt chaining is for sequential predictable steps; dynamic decomposition generates subtasks based on intermediate findings',
      'Dynamic decomposition requires a coordinator agent; prompt chaining can run in a single agent',
      'Prompt chaining is cheaper; dynamic decomposition produces better results but at higher cost',
    ],
    correct: 1,
    explanation: 'Prompt chaining is best for workflows with known, fixed steps (e.g., file-by-file analysis → cross-file synthesis). Dynamic adaptive decomposition is for open-ended tasks where the full scope is unknown upfront — the plan adapts as findings emerge. A legacy codebase test coverage task uses dynamic decomposition because you don\'t know the structure or high-impact areas until you start exploring.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 21, domain: 1, tier: 'advanced',
    text: 'A subagent fails to retrieve data from a slow external API (timeout). What is the correct error-handling architecture?',
    options: [
      'Return an empty result set and let the coordinator decide what to do',
      'Immediately propagate the error to the coordinator without any local recovery attempt',
      'Attempt local recovery (e.g., retry); if unresolvable, propagate to coordinator with partial results and a structured error description',
      'Log the error silently and continue as if the tool call succeeded',
    ],
    correct: 2,
    explanation: 'Subagents should attempt local recovery for transient errors (timeouts, temporary unavailability) before escalating. When escalating, they must return structured context: what data was retrieved before failure, what failed and why, and whether retry is appropriate. Silent error suppression prevents coordinator recovery; immediate escalation without retry wastes resources on recoverable failures.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
      { label: 'Tool use overview', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview' },
    ],
  },

  // EXAM READY
  {
    id: 22, domain: 1, tier: 'exam',
    scenario: 'Customer Support Resolution Agent',
    text: 'Your customer support agent is resolving billing disputes 80% of the time on first contact, but 6% of transactions are processed without the mandatory identity verification step. You have a clear system prompt instruction: "Always verify customer identity before processing any transaction." What is the most appropriate fix?',
    options: [
      'Strengthen the system prompt instruction with more explicit language and examples',
      'Add few-shot examples demonstrating correct identity-first sequences',
      'Implement a programmatic prerequisite gate: block `process_refund` and `process_payment` tool calls until `get_customer` has returned a verified customer ID in the current session',
      'Add a classifier that detects when Claude skips verification and triggers a retry',
    ],
    correct: 2,
    explanation: 'System prompt instructions and few-shot examples address probabilistic behavior — they reduce but cannot eliminate the failure rate. A 6% skip rate on financial identity verification is a compliance failure. Programmatic prerequisite gates (hooks that block payment tools until verification returns a valid ID) provide deterministic, guaranteed enforcement. The fix must be architectural, not prompt-based.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
      { label: 'Agent SDK — hooks', url: 'https://github.com/anthropics/claude-agent-sdk-python' },
    ],
  },
  {
    id: 23, domain: 1, tier: 'exam',
    scenario: 'Multi-Agent Research System',
    text: 'Your coordinator agent delegates a broad research topic to four specialist subagents. The synthesis subagent\'s output has poor source attribution — it cannot identify which findings came from which source. What caused this and what is the fix?',
    options: [
      'The synthesis subagent needs a larger context window to hold all sources',
      'The coordinator passed findings as plain concatenated text without preserving source metadata; fix by passing structured data that separates content from source URLs, titles, and page numbers',
      'The web search subagent is not returning URLs in its results',
      'Attribution requires a dedicated attribution subagent in the pipeline',
    ],
    correct: 1,
    explanation: 'When a coordinator passes subagent findings as unstructured text blobs, attribution data (source URLs, document titles, page numbers) is lost or conflated. The fix is to pass structured data — e.g., a JSON array where each finding has a `content` field and a `source` field with URL and metadata. The synthesis subagent can then produce properly cited output.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 24, domain: 1, tier: 'exam',
    scenario: 'Developer Productivity Tools',
    text: 'An engineer asks your developer productivity agent to "add comprehensive tests to this legacy codebase." The agent immediately starts writing tests for the first file it finds, without understanding the codebase structure. What task decomposition pattern should the agent use?',
    options: [
      'Prompt chaining: write tests for each file in alphabetical order',
      'Dynamic adaptive decomposition: first map codebase structure, identify high-impact areas, then create a prioritized plan that adapts as dependencies are discovered',
      'Parallel decomposition: spawn one subagent per file simultaneously',
      'Sequential fixed pipeline: analyze → write → run → fix',
    ],
    correct: 1,
    explanation: 'Open-ended tasks on unknown systems require dynamic adaptive decomposition. The agent cannot know the right approach until it understands the codebase. Phase 1: map the structure and understand the domain. Phase 2: identify high-impact, under-tested areas. Phase 3: create a prioritized plan that adapts as dependencies and test complexity emerge. This contrasts with prompt chaining, which requires knowing the steps upfront.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 25, domain: 1, tier: 'exam',
    scenario: 'Multi-Agent Research System',
    text: 'After a multi-agent research pipeline produces a comprehensive but shallow first draft, the coordinator needs to run iterative refinement. What is the architecturally correct approach?',
    options: [
      'Have the coordinator re-run the entire pipeline from scratch',
      'Have the synthesis subagent expand all sections autonomously without coordinator guidance',
      'The coordinator evaluates the synthesis for coverage gaps, re-delegates targeted queries to search/analysis subagents, and re-invokes synthesis until quality criteria are met',
      'Ask the end user to identify which sections need more depth',
    ],
    correct: 2,
    explanation: 'Iterative refinement is a coordinator responsibility. The coordinator evaluates synthesis output against quality criteria (depth, coverage, citation density), identifies specific gaps (not vague dissatisfaction), formulates targeted follow-up queries, and re-delegates only what is needed. This loop continues until the coordinator\'s quality evaluation passes. Full pipeline re-runs are wasteful; user-driven gap identification is a design failure.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 26, domain: 1, tier: 'exam',
    scenario: 'Customer Support Resolution Agent',
    text: 'A customer contacts support with three separate issues: a billing error, a failed delivery, and a missing account credit. Your agent is handling them sequentially and missing interactions between them (the billing error and missing credit are related). What is the correct architectural approach?',
    options: [
      'Handle each issue in a separate session to avoid context contamination',
      'Have the customer resubmit each issue separately',
      'Decompose the multi-concern request into distinct items, investigate each in parallel using shared context, then synthesize a unified resolution',
      'Use a larger context window to process all three issues together in a single prompt',
    ],
    correct: 2,
    explanation: 'Multi-concern requests should be decomposed into parallel investigation tracks that share context (so the billing/credit relationship is visible to both tracks), then synthesized into a unified resolution. Sequential handling misses cross-issue relationships. Separate sessions destroy the shared context needed to detect interactions. This is parallel decomposition with shared context — a core orchestration pattern.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 27, domain: 1, tier: 'exam',
    scenario: 'Customer Support Resolution Agent',
    text: 'Your agent has resolved a complex billing dispute but cannot resolve a technical account issue that requires backend engineering access. It must hand off to a human agent. What should the handoff summary include?',
    options: [
      'A link to the conversation transcript only — the human agent can read it',
      'Customer ID, root cause analysis, actions already taken, refund amounts applied, and recommended next action',
      'A single sentence summary of the issue',
      'The full raw conversation history in JSON format',
    ],
    correct: 1,
    explanation: 'Human agents receiving escalations typically do not have access to the full conversation transcript or AI session context. The structured handoff summary must be self-contained: customer ID (for lookup), root cause (what was determined), actions taken (what the AI already did, including any credits applied), and recommended next action (what the human should do first). This prevents duplicate actions and allows the human to work from a cold start.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },

  // ─── DOMAIN 2 — Tool Design & MCP Integration ────────────────────────────

  // BASIC
  {
    id: 28, domain: 2, tier: 'basic',
    text: 'What is the primary mechanism Claude uses to decide which tool to invoke?',
    options: [
      'The tool name only — Claude does not read or parse the tool description text at all',
      'The tool description, which explains purpose, expected inputs, and boundaries',
      'The order in which tools appear in the tools array sent to the API',
      'A separate routing system prompt that maps user intents to tool names',
    ],
    correct: 1,
    explanation: 'Tool descriptions are the primary selection mechanism. Claude reads each tool\'s description to determine which tool is appropriate for the current task. Weak, minimal, or overlapping descriptions directly cause misrouting. This is why investing in clear, differentiated descriptions is critical for reliable tool use.',
    refs: [
      { label: 'Tool use overview', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview' },
    ],
  },
  {
    id: 29, domain: 2, tier: 'basic',
    text: 'An MCP tool encounters a permanent business rule violation (refund exceeds the allowed maximum). Which `isRetryable` value should the error response include?',
    options: [
      'true',
      'null',
      'false',
      'The field should be omitted for business errors',
    ],
    correct: 2,
    explanation: 'Business rule violations are not retryable — retrying with the same parameters will always produce the same error. Setting `isRetryable: false` signals this to the agent, preventing wasted retry attempts. Transient errors (timeouts, temporary service unavailability) should use `isRetryable: true`.',
    refs: [
      { label: 'MCP documentation', url: 'https://modelcontextprotocol.io/docs' },
    ],
  },
  {
    id: 30, domain: 2, tier: 'basic',
    text: 'What are the three values available for the `tool_choice` parameter?',
    options: [
      '"always", "never", "auto" with an optional tool name override parameter',
      '"required", "optional", "forced" as the three selection modes',
      '"auto", "required", "none" matching the standard API values',
      '"auto", "any", and a forced object `{"type": "tool", "name": "..."}`',
    ],
    correct: 3,
    explanation: '`tool_choice` options: `"auto"` (Claude decides whether to use a tool), `"any"` (Claude must use at least one tool), and `{"type": "tool", "name": "tool_name"}` (Claude must call this specific named tool). There is no "required" or "none" option.',
    refs: [
      { label: 'Tool use overview', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview' },
    ],
  },
  {
    id: 31, domain: 2, tier: 'basic',
    text: 'What does the MCP `isError` flag on a tool response indicate?',
    options: [
      'The tool encountered a runtime error and the agent should handle the failure',
      'The tool call was rejected by the MCP server before execution even started due to invalid params',
      'Claude made an invalid tool call with wrong parameter types or values',
      'The tool result should be ignored and the agent should proceed without it',
    ],
    correct: 0,
    explanation: '`isError: true` on an MCP tool response means the tool was called successfully (no schema error) but encountered a runtime error during execution. The agent should read the error metadata and decide whether to retry, escalate, or continue with partial data.',
    refs: [
      { label: 'MCP documentation', url: 'https://modelcontextprotocol.io/docs' },
    ],
  },

  // INTERMEDIATE
  {
    id: 32, domain: 2, tier: 'intermediate',
    text: 'You have two tools: `analyze_content` (description: "Analyzes content") and `analyze_document` (description: "Analyzes a document"). What problem will this cause in production?',
    options: [
      'Both tools will be called simultaneously for every request, causing duplicate data processing',
      'Unreliable tool selection — Claude misroutes because descriptions are identical',
      'Claude will refuse to use either tool due to the ambiguity in descriptions',
      'The tools will merge into a single logical tool inside the agent runtime',
    ],
    correct: 1,
    explanation: 'Identical or near-identical descriptions make it impossible for Claude to reliably distinguish between tools. With no functional differentiation, Claude will select unpredictably. The fix is to make each tool\'s description explicitly explain: (1) what it does differently, (2) its specific input format, (3) when to use it instead of similar alternatives.',
    refs: [
      { label: 'Tool use overview', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview' },
    ],
  },
  {
    id: 33, domain: 2, tier: 'intermediate',
    text: 'An MCP tool returns `{"isError": false, "content": []}` when a customer lookup finds no matching records. A different call returns `{"isError": true, "errorCategory": "permission"}` when the agent lacks database access. Why is this distinction important?',
    options: [
      'Both should return `isError: true` for consistent unified error handling across all tool responses',
      'The `isError` flag is optional and both responses need the same handling',
      'Empty results are a successful query; permission errors need different recovery',
      'Empty results and permission errors should be treated identically as no-data',
    ],
    correct: 2,
    explanation: 'This distinction is critical for agent recovery logic. `isError: false` + empty content = the query ran successfully, no records exist — do not retry. `isError: true` + permission error = the agent doesn\'t have access — retry won\'t help, escalation or credential rotation is needed. Treating them identically causes agents to retry successful queries or give up on fixable access errors.',
    refs: [
      { label: 'MCP documentation', url: 'https://modelcontextprotocol.io/docs' },
    ],
  },
  {
    id: 34, domain: 2, tier: 'intermediate',
    text: 'A synthesis subagent is given access to 18 tools: web search, document analysis, database query, file read/write, email, calendar, and 12 others. What is the most likely consequence?',
    options: [
      'The subagent will use all 18 tools for every task, slowing performance down',
      'The MCP server will reject the connection due to the hard tool count limit',
      'The synthesis subagent will request a tool manifest from the coordinator agent',
      'Tool selection degrades — Claude makes worse decisions with too many options',
    ],
    correct: 3,
    explanation: 'Tool selection reliability degrades as the number of available tools increases, especially when many tools are outside the agent\'s core role. A synthesis agent with 18 tools will sometimes misuse web search or email tools. The principle is to scope each agent\'s tools to 4–5 role-relevant tools, with limited cross-role tools only for high-frequency needs.',
    refs: [
      { label: 'Tool use overview', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview' },
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 35, domain: 2, tier: 'intermediate',
    text: 'You want to ensure Claude always calls the `extract_structured_data` tool for a specific step in a pipeline, regardless of what the conversation context suggests. Which `tool_choice` configuration achieves this?',
    options: [
      '`tool_choice: {"type": "tool", "name": "extract_structured_data"}`',
      '`tool_choice: "auto"` which lets Claude decide based on conversation context',
      '`tool_choice: "any"` which guarantees some tool call but not a specific one',
      '`tool_choice: "required"` with the tool name passed in a separate parameter',
    ],
    correct: 0,
    explanation: 'Forced tool selection requires `{"type": "tool", "name": "tool_name"}`. This guarantees Claude calls that specific tool regardless of context. `"auto"` lets Claude decide freely. `"any"` requires *some* tool call but not a specific one. `"required"` is not a valid value.',
    refs: [
      { label: 'Tool use overview', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview' },
    ],
  },
  {
    id: 36, domain: 2, tier: 'intermediate',
    text: 'Your system prompt contains the phrase "analyze content from URLs." You have a tool named `analyze_content`. What unintended consequence might occur?',
    options: [
      'The system prompt phrase will completely override the tool description text',
      'The phrase "analyze content" will cause Claude to over-invoke that tool name',
      'No consequence — system prompts and tool descriptions are processed separately',
      'Claude will create a new virtual tool called "analyze content from URLs"',
    ],
    correct: 1,
    explanation: 'System prompt wording is keyword-sensitive and can create unintended tool associations. The phrase "analyze content" in a system prompt can cause Claude to over-invoke `analyze_content` in contexts where it is not appropriate. Always review system prompts for phrases that might conflict with or trigger tool name associations unexpectedly.',
    refs: [
      { label: 'Tool use overview', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview' },
    ],
  },

  // ADVANCED
  {
    id: 37, domain: 2, tier: 'advanced',
    text: 'You have a generic `analyze_document` tool that is being called for web results, PDFs, and database records with inconsistent quality. What is the best refactoring approach?',
    options: [
      'Add a `document_type` parameter to the existing tool and update the description',
      'Split into purpose-specific tools: `extract_web_results`, `parse_pdf_content`, `query_database_record` — each with defined input/output contracts',
      'Add more few-shot examples showing correct document type handling',
      'Create a pre-routing tool that classifies the document type before calling `analyze_document`',
    ],
    correct: 1,
    explanation: 'Generic multi-purpose tools with parameter-based branching are harder for Claude to route correctly than purpose-specific tools with clear descriptions. Splitting into `extract_web_results` (web content, returns structured web data), `parse_pdf_content` (PDFs, returns sections + metadata), and `query_database_record` (structured queries, returns typed fields) gives Claude distinct routing signals and produces more reliable, higher-quality outputs.',
    refs: [
      { label: 'Tool use overview', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview' },
    ],
  },
  {
    id: 38, domain: 2, tier: 'advanced',
    text: 'An MCP tool connects to a customer database and returns `{"isError": true, "errorCategory": "transient", "isRetryable": true, "message": "Connection timeout after 30s"}`. The agent is a subagent in a coordinator-subagent system. What should happen next?',
    options: [
      'The subagent should immediately propagate the error to the coordinator',
      'The subagent should attempt local retry logic for the transient error; propagate to coordinator only if retries are exhausted, including partial results and what was attempted',
      'The subagent should return empty results and continue',
      'The coordinator should restart the entire pipeline from scratch',
    ],
    correct: 1,
    explanation: 'Transient errors (`isRetryable: true`) should be handled locally by the subagent first — retry with appropriate back-off. Only when local recovery fails should the error propagate to the coordinator, along with: (1) what data was retrieved before the failure, (2) the specific error details, (3) what was attempted, (4) whether further retries are advisable. This preserves partial work and enables informed coordinator decisions.',
    refs: [
      { label: 'MCP documentation', url: 'https://modelcontextprotocol.io/docs' },
    ],
  },
  {
    id: 39, domain: 2, tier: 'advanced',
    text: 'A web research subagent and a document analysis subagent both have a tool called `extract_information`. The coordinator occasionally routes document analysis requests to the wrong subagent. What is causing this and how should it be fixed?',
    options: [
      'The coordinator needs more context about which subagent to use — add routing instructions to the coordinator system prompt',
      'Rename both tools with role-specific names and update descriptions to eliminate overlap: e.g., `extract_web_search_results` vs `extract_document_sections`',
      'Merge the two subagents into one to eliminate ambiguity',
      'Add a `target_subagent` parameter to the Task tool call',
    ],
    correct: 1,
    explanation: 'Identical tool names across subagents create routing ambiguity at the coordinator level. The fix is to give each subagent\'s tools distinct, role-specific names that make the boundary obvious: `extract_web_search_results` (web subagent) vs `extract_document_sections` (document subagent). The coordinator can now route unambiguously based on the task type.',
    refs: [
      { label: 'Tool use overview', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview' },
    ],
  },
  {
    id: 40, domain: 2, tier: 'advanced',
    text: 'You want to validate all tool inputs against a strict schema and ensure Claude never passes missing or incorrectly typed parameters. What configuration achieves this?',
    options: [
      'Add a `validate: true` flag to the tool definition',
      'Use `strict: true` in tool definitions to enable Structured Outputs for guaranteed schema validation',
      'Write a PostToolUse hook that validates inputs after the call',
      'Add explicit validation instructions to the tool description',
    ],
    correct: 1,
    explanation: '`strict: true` in tool definitions enables Structured Outputs mode, which guarantees that Claude\'s tool calls always match the defined schema exactly — no missing required fields, no type mismatches. This eliminates an entire class of production failures where Claude generates syntactically valid but schema-invalid tool calls.',
    refs: [
      { label: 'Tool use — structured outputs', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview' },
    ],
  },
  {
    id: 41, domain: 2, tier: 'advanced',
    text: 'Your MCP tool for processing customer refunds is called by multiple different agents. How should you configure access to prevent a reporting agent from accidentally triggering a refund?',
    options: [
      'Add authorization checks inside the `process_refund` tool itself',
      'Scope tool access: only include `process_refund` in the allowedTools of agents that need it; exclude it from reporting and read-only agents',
      'Add a system prompt instruction telling the reporting agent not to use `process_refund`',
      'Use `tool_choice: "auto"` which will prevent accidental calls',
    ],
    correct: 1,
    explanation: 'Tool access should be scoped to each agent\'s role. A reporting agent should never have `process_refund` in its `allowedTools` — if the tool isn\'t available, it literally cannot be called. Prompt instructions and `tool_choice: "auto"` are probabilistic guardrails that can still fail. Defense-in-depth starts with not giving agents tools they should never use.',
    refs: [
      { label: 'Agent SDK — permissions', url: 'https://platform.claude.com/docs/en/agent-sdk/agent-loop' },
    ],
  },

  // EXAM READY
  {
    id: 42, domain: 2, tier: 'exam',
    scenario: 'Customer Support Resolution Agent',
    text: 'Your support agent has four MCP tools: `get_customer`, `lookup_order`, `process_refund`, and `escalate_to_human`. Over time, `get_customer` is being called for order-related queries and `lookup_order` is being called to fetch customer profiles. The tool descriptions are: `get_customer`: "Gets customer information" and `lookup_order`: "Gets order information." What is the correct fix?',
    options: [
      'Rename the tools to `customer_tool` and `order_tool` for clarity',
      'Rewrite both descriptions to explicitly state their purpose, expected inputs (customer ID vs order ID), returned fields, and when to use each vs alternatives',
      'Add a routing system prompt that maps keywords to tools',
      'Merge both tools into a single `get_record` tool with a `type` parameter',
    ],
    correct: 1,
    explanation: 'One-line generic descriptions like "Gets customer information" are the most common cause of tool misrouting. Each description should include: (1) exactly what it fetches, (2) the required input format (e.g., "Takes a `customer_id` string — use this when you have a customer ID, not an order ID"), (3) what it returns, and (4) when NOT to use it. Detailed descriptions are the primary routing mechanism Claude has available.',
    refs: [
      { label: 'Tool use overview', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview' },
    ],
  },
  {
    id: 43, domain: 2, tier: 'exam',
    scenario: 'Structured Data Extraction',
    text: 'Your extraction system calls an `extract_fields` MCP tool on a 500-document batch. For 12% of documents, the tool returns `{"isError": true, "errorCategory": "validation", "isRetryable": false, "message": "Document format not supported: .pages"}`. How should the system handle these?',
    options: [
      'Retry each failed document three times before skipping',
      'Skip all failed documents without logging',
      'Since `isRetryable: false` and the error is a validation/format issue, log the specific files with their error details, continue processing the remaining documents, and report the failure summary to the operator',
      'Halt the entire batch and fix the format issue before restarting',
    ],
    correct: 2,
    explanation: '`isRetryable: false` means retrying will not help — the format is unsupported and retrying the same document will always fail. The correct response is to: (1) skip these documents without retry, (2) log each failure with the document name and error details for operator review, (3) continue processing supported formats, (4) include a failure summary in the final report. Halting the entire batch is disproportionate when most documents are processable.',
    refs: [
      { label: 'MCP documentation', url: 'https://modelcontextprotocol.io/docs' },
    ],
  },
  {
    id: 44, domain: 2, tier: 'exam',
    scenario: 'Developer Productivity Tools',
    text: 'Your developer productivity agent uses built-in tools (Read, Write, Bash, Grep, Glob) plus 14 custom MCP tools for linting, type-checking, test running, deployment, database migration, and more. Engineers report the agent is using deployment tools during routine code exploration tasks. What is the architectural fix?',
    options: [
      'Add system prompt instructions: "Do not use deployment tools during exploration"',
      'Reduce the total tool count to 5 by merging related tools',
      'Create task-scoped tool profiles: exploration tasks get Read/Grep/Glob only; development tasks add Write/Bash/Lint/TypeCheck; deployment tasks add the deployment/migration tools',
      'Move deployment tools to a separate MCP server',
    ],
    correct: 2,
    explanation: 'The solution is task-scoped tool profiles — dynamically configure `allowedTools` based on the current task phase. Exploration: read-only tools only. Development: add write and quality tools. Deployment: add deployment tools explicitly. This prevents accidental deployment tool invocations by making them literally unavailable during exploration, rather than relying on prompt instructions that can fail.',
    refs: [
      { label: 'Agent SDK — permissions', url: 'https://platform.claude.com/docs/en/agent-sdk/agent-loop' },
      { label: 'Tool use overview', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview' },
    ],
  },

  // ─── DOMAIN 3 — Claude Code Configuration & Workflows ───────────────────

  // BASIC
  {
    id: 45, domain: 3, tier: 'basic',
    text: 'What is CLAUDE.md and when does Claude Code read it?',
    options: [
      'A runtime configuration file passed via the `--config` flag each session',
      'A system prompt template stored in the Anthropic cloud service backend',
      'A markdown file in the project that Claude Code reads automatically at session start',
      'A configuration file that explicitly defines which tools Claude Code is allowed to use per session',
    ],
    correct: 2,
    explanation: 'CLAUDE.md is a markdown file you place in your project (typically at the root) that Claude Code reads automatically at session start. It provides persistent project context — coding standards, architectural decisions, naming conventions, review checklists — without requiring you to re-explain them every session.',
    refs: [
      { label: 'Claude Code overview — CLAUDE.md', url: 'https://code.claude.com/docs/en/overview' },
      { label: 'Claude Code — store instructions and memory', url: 'https://code.claude.com/docs/en/memory' },
    ],
  },
  {
    id: 46, domain: 3, tier: 'basic',
    text: 'In the CLAUDE.md hierarchy, which file takes precedence when there are conflicting instructions?',
    options: [
      'The global user-level CLAUDE.md at ~/.claude/CLAUDE.md takes precedence',
      'The project root CLAUDE.md always overrides all other CLAUDE.md files',
      'The most recently modified CLAUDE.md, regardless of its directory location',
      'The subdirectory CLAUDE.md closest to the file currently being edited',
    ],
    correct: 3,
    explanation: 'CLAUDE.md files follow a specificity hierarchy: subdirectory (closest to the current file) > project root > global user. More specific context overrides more general context. This allows subdirectories to set their own conventions (e.g., a `frontend/` directory with React-specific rules) that override project-wide defaults.',
    refs: [
      { label: 'Claude Code — store instructions and memory', url: 'https://code.claude.com/docs/en/memory' },
    ],
  },
  {
    id: 47, domain: 3, tier: 'basic',
    text: 'When should you use plan mode in Claude Code?',
    options: [
      'Before irreversible or high-impact operations, to review plans before execution',
      'For every task without exception, to review Claude\'s full reasoning process before it acts',
      'Only when working with files that are larger than 1MB in total size',
      'When you want Claude to run autonomously without any human interaction',
    ],
    correct: 0,
    explanation: 'Plan mode is a human review checkpoint before execution. Use it before: large refactors, database migrations, CI/CD deployments, anything that modifies many files, or any operation that is difficult to reverse. Claude shows its plan; you can approve, modify, or cancel before a single line of code changes.',
    refs: [
      { label: 'Claude Code overview', url: 'https://code.claude.com/docs/en/overview' },
    ],
  },
  {
    id: 48, domain: 3, tier: 'basic',
    text: 'What is the `permissionMode: "acceptEdits"` option in the Claude Agent SDK?',
    options: [
      'Requires explicit user approval for every single file operation attempted',
      'Auto-approves file read/write operations so the agent runs without prompts',
      'Restricts the agent to read-only operations with no file modification allowed',
      'Enables the agent to accept edits suggested by external code review tools',
    ],
    correct: 1,
    explanation: '`permissionMode: "acceptEdits"` auto-approves file read/write operations, enabling the agent to run without prompting the user for approval on each edit. This is appropriate for automated/CI workflows where human approval per operation is not feasible. `default` mode prompts for approval — better for interactive development.',
    refs: [
      { label: 'Agent SDK quickstart', url: 'https://platform.claude.com/docs/en/agent-sdk/quickstart' },
    ],
  },

  // INTERMEDIATE
  {
    id: 49, domain: 3, tier: 'intermediate',
    text: 'Your team has a monorepo with a React frontend in `/frontend` and a Python API in `/backend`. You want different coding standards for each. How should you structure your CLAUDE.md files?',
    options: [
      'Use one root CLAUDE.md with all standards and section headers for each language',
      'Use environment variables to switch between different configuration profiles',
      'Root CLAUDE.md for shared rules plus subdirectory CLAUDE.md files per package',
      'Create separate Docusaurus config files for each subdirectory in the monorepo',
    ],
    correct: 2,
    explanation: 'The CLAUDE.md hierarchy is designed exactly for this. Root CLAUDE.md contains shared project-wide rules (git conventions, PR format, architecture principles). Subdirectory CLAUDE.md files contain technology-specific rules (React component patterns in `/frontend`, Python type hints and test structure in `/backend`). The subdirectory files take precedence when working in their respective directories.',
    refs: [
      { label: 'Claude Code — store instructions and memory', url: 'https://code.claude.com/docs/en/memory' },
    ],
  },
  {
    id: 50, domain: 3, tier: 'intermediate',
    text: 'You want to package a multi-step code review workflow (run linting, check coverage, review security, summarize findings) that your team can invoke with a single command. What Claude Code feature enables this?',
    options: [
      'A CLAUDE.md entry that lists all review steps as numbered instructions',
      'A Bash alias that chains multiple separate claude commands together in a shell script',
      'An Agent Skill defined in a dedicated `SKILL.md` file in the project',
      'A custom slash command like `/review-pr` that packages the full workflow',
    ],
    correct: 3,
    explanation: 'Custom slash commands package repeatable, multi-step workflows into a single invocable command. `/review-pr` can encode: lint → check test coverage → security scan → summarize findings. Team members invoke it without needing to know the underlying steps. This is distinct from Agent Skills (which extend Claude\'s knowledge/behavior) and CLAUDE.md (which provides persistent context).',
    refs: [
      { label: 'Claude Code overview', url: 'https://code.claude.com/docs/en/overview' },
    ],
  },
  {
    id: 51, domain: 3, tier: 'intermediate',
    text: 'You want Claude Code to automatically run your linter after every file edit. Which mechanism achieves this?',
    options: [
      'Configure a hook that runs the linter command after each Write tool invocation',
      'Add a `post_edit_command` key to the project CLAUDE.md configuration file under the hooks section',
      'Use `permissionMode: "acceptEdits"` which triggers post-edit callback hooks',
      'Set up a separate file watcher in your CI/CD pipeline to catch file changes',
    ],
    correct: 0,
    explanation: 'Hooks let you run shell commands at specific points in the Claude Code agent loop. A PostToolUse hook configured on the Write tool will automatically run your linter (or formatter, or type checker) after each file edit. This provides immediate feedback without any additional prompting and ensures code quality gates are applied deterministically.',
    refs: [
      { label: 'Agent SDK — hooks', url: 'https://github.com/anthropics/claude-agent-sdk-python' },
    ],
  },
  {
    id: 52, domain: 3, tier: 'intermediate',
    text: 'What is the key benefit of integrating Claude Code into a CI/CD pipeline for automated PR reviews?',
    options: [
      'It eliminates the need for human code review entirely across the engineering team',
      'Consistent automated checks on every PR without fatigue, catching bugs early',
      'It provides real-time streaming feedback to developers as they type code',
      'It replaces unit tests with AI-generated assertions for faster test cycles',
    ],
    correct: 1,
    explanation: 'CI/CD integration provides consistent, scalable code review that does not suffer from reviewer fatigue. Claude Code can run on every PR with the same thoroughness: linting, security scan, test coverage check, architecture review, documentation check. This surfaces issues earlier (cheaper to fix) and makes human reviews more focused on logic and design rather than mechanics.',
    refs: [
      { label: 'Claude Code overview', url: 'https://code.claude.com/docs/en/overview' },
    ],
  },
  {
    id: 53, domain: 3, tier: 'intermediate',
    text: 'A new engineer joins the team. What is the most effective way to use CLAUDE.md to accelerate their onboarding?',
    options: [
      'Have the new engineer write their own CLAUDE.md from scratch as a team onboarding learning task',
      'Provide a curated list of documentation links for them to read independently',
      'Add a section with key architectural decisions, conventions, and common pitfalls',
      'CLAUDE.md is only for configuring Claude Code, not for developer onboarding',
    ],
    correct: 2,
    explanation: 'CLAUDE.md functions as a "tech lead in a file." It can include architectural decision rationale, naming conventions, test patterns, required build commands, common pitfalls, and links to deeper documentation. When a new engineer runs Claude Code, Claude immediately applies all these rules without the engineer needing to ask — effectively encoding institutional knowledge into the development tool.',
    refs: [
      { label: 'Claude Code — store instructions and memory', url: 'https://code.claude.com/docs/en/memory' },
    ],
  },
  {
    id: 54, domain: 3, tier: 'intermediate',
    text: 'Which `allowedTools` configuration creates a read-only agent that can explore a codebase without modifying any files?',
    options: [
      '`allowedTools: ["Read"]` only — the absolute minimum needed for basic file read operations',
      '`disallowedTools: ["Write", "Edit"]` to block modifications explicitly',
      '`permissionMode: "readonly"` to restrict all agents to read-only access',
      '`allowedTools: ["Read", "Glob", "Grep"]` with `permissionMode: "default"`',
    ],
    correct: 3,
    explanation: 'A read-only exploration agent needs Read (read file contents), Glob (find files by pattern), and Grep (search file contents). These three tools cover all code exploration needs. Setting `permissionMode: "default"` prevents auto-approval of any write operations. Using `disallowedTools` is the inverse approach and may still allow other unintended tools.',
    refs: [
      { label: 'Agent SDK — permissions', url: 'https://platform.claude.com/docs/en/agent-sdk/agent-loop' },
    ],
  },

  // ADVANCED
  {
    id: 55, domain: 3, tier: 'advanced',
    text: 'Your CI/CD pipeline runs Claude Code for automated PR review. After 3 weeks, you notice it is generating a high rate of false positive security warnings on legitimate patterns. What is the most effective fix?',
    options: [
      'Increase the temperature parameter to make Claude less strict',
      'Add known-safe patterns and project-specific security exceptions to the project root CLAUDE.md, and include examples of false positive patterns to avoid',
      'Switch to manual security review to avoid false positives',
      'Remove security checks from the automated review entirely',
    ],
    correct: 1,
    explanation: 'CLAUDE.md is the right place for project-specific security context: known-safe patterns, approved libraries with known "suspicious" API usage, exceptions to generic security rules. Including examples of both true positives and false positives in the review instructions reduces noise without removing coverage. This is the CLAUDE.md-as-context-provider pattern.',
    refs: [
      { label: 'Claude Code — store instructions and memory', url: 'https://code.claude.com/docs/en/memory' },
    ],
  },
  {
    id: 56, domain: 3, tier: 'advanced',
    text: 'Enterprise security policy requires that Claude Code never access files outside the `/src` and `/tests` directories, regardless of what engineers ask it to do. Where should this restriction be defined?',
    options: [
      'In each engineer\'s personal CLAUDE.md (~/.claude/CLAUDE.md)',
      'In a system prompt passed via the `--system` flag',
      'In the project `.claude/settings.json` (checked into version control) or enterprise policy settings with disallowedTools and path restrictions',
      'In the CI/CD pipeline configuration only — not in the local environment',
    ],
    correct: 2,
    explanation: 'Enterprise-level security restrictions belong in project settings (`.claude/settings.json`) or enterprise policy settings — not personal CLAUDE.md files (which individuals can override) and not the `--system` flag (which is session-specific). Project settings are version-controlled and applied consistently to everyone who works in the repository.',
    refs: [
      { label: 'Claude Code settings configuration', url: 'https://code.claude.com/docs/en/overview' },
    ],
  },
  {
    id: 57, domain: 3, tier: 'advanced',
    text: 'A team wants to configure Claude Code so that it applies TypeScript strict mode checks, uses their internal design system components, and follows their specific accessibility standards. These rules are complex enough that they cannot be fully described in a single CLAUDE.md. What feature addresses this?',
    options: [
      'Multiple CLAUDE.md files in different subdirectories',
      'Agent Skills (SKILL.md files) that package specialized knowledge for specific domains — e.g., an accessibility skill with detailed WCAG rules',
      'A longer global user CLAUDE.md with all rules listed',
      'A custom slash command that injects the rules into each session',
    ],
    correct: 1,
    explanation: 'Agent Skills (SKILL.md files) are designed for packaging deep, specialized knowledge that is too detailed for CLAUDE.md. An `accessibility` skill can contain full WCAG 2.1 AA criteria, code examples, common failure patterns, and testing instructions. Claude Code reads the relevant SKILL.md when the task matches the skill\'s triggers, without bloating the always-loaded CLAUDE.md.',
    refs: [
      { label: 'Claude Code overview — Agent Skills', url: 'https://code.claude.com/docs/en/overview' },
    ],
  },

  // EXAM READY
  {
    id: 58, domain: 3, tier: 'exam',
    scenario: 'Claude Code for CI/CD',
    text: 'Your automated CI/CD pipeline using Claude Code generates PR feedback reports, but senior engineers complain the feedback is too generic — it ignores the team\'s specific architectural patterns and flags standard patterns as violations. The pipeline uses `permissionMode: "acceptEdits"` and a generic system prompt. What is the most impactful single change?',
    options: [
      'Switch to a more powerful Claude model for better judgment',
      'Add a detailed project root CLAUDE.md that encodes the team\'s specific architectural patterns, approved libraries, known exceptions, and review criteria',
      'Increase `max_turns` to give Claude more iterations to refine feedback',
      'Switch from automated to human-in-the-loop review for architectural checks',
    ],
    correct: 1,
    explanation: 'Generic system prompts produce generic output. A project CLAUDE.md loaded at session start provides persistent, project-specific context: the team\'s architectural patterns, approved vs. disallowed libraries, known-safe patterns that look suspicious, and specific review criteria. This is precisely what CLAUDE.md is for — context that makes Claude Code behave like a team member rather than a generic reviewer.',
    refs: [
      { label: 'Claude Code — store instructions and memory', url: 'https://code.claude.com/docs/en/memory' },
    ],
  },
  {
    id: 59, domain: 3, tier: 'exam',
    scenario: 'Code Generation with Claude Code',
    text: 'A developer is about to have Claude Code perform a large-scale refactoring of the authentication module — replacing the legacy session-based auth with JWT across 47 files. This is a high-stakes, partially reversible operation. What should the developer do before confirming execution?',
    options: [
      'Run the refactor with `permissionMode: "acceptEdits"` for maximum automation',
      'Ask Claude Code to explain its plan in the system prompt before executing',
      'Enter plan mode first: review the full plan of intended changes, then approve or modify before execution begins',
      'Fork the session before the refactor so the original can be resumed if needed',
    ],
    correct: 2,
    explanation: 'Large-scale, partially reversible refactoring is exactly when plan mode is mandatory. Plan mode shows the full intended sequence of changes before any file is modified. The developer can verify the plan covers all 47 files correctly, catches any scope errors, and decides whether to approve, modify, or cancel. Running immediately with `acceptEdits` on a 47-file auth refactor without reviewing the plan first is a high-risk anti-pattern.',
    refs: [
      { label: 'Claude Code overview — plan mode', url: 'https://code.claude.com/docs/en/overview' },
    ],
  },
  {
    id: 60, domain: 3, tier: 'exam',
    scenario: 'Claude Code for CI/CD',
    text: 'You want your CI pipeline to use Claude Code for automated test generation but need to ensure it never modifies existing production code, only creates new test files. Which combination of settings enforces this?',
    options: [
      'Add "only create test files" to the system prompt',
      'Configure `allowedTools: ["Read", "Glob", "Grep"]` and rely on Claude\'s judgment for file creation',
      'Configure `allowedTools: ["Read", "Glob", "Grep", "Write"]` with `disallowedTools: []` and add path restrictions in `.claude/settings.json` limiting Write to the `/tests` directory',
      'Use `permissionMode: "default"` which blocks all file writes by default',
    ],
    correct: 2,
    explanation: 'Multi-layer enforcement: (1) `allowedTools` includes Write (needed to create test files) but omits Edit (prevents modifying existing files), (2) path restrictions in `.claude/settings.json` limit Write operations to the `/tests` directory, blocking any attempt to write to production code paths. System prompt instructions alone are insufficient for a CI security requirement.',
    refs: [
      { label: 'Agent SDK — permissions', url: 'https://platform.claude.com/docs/en/agent-sdk/agent-loop' },
      { label: 'Claude Code settings', url: 'https://code.claude.com/docs/en/overview' },
    ],
  },

  // ─── DOMAIN 4 — Prompt Engineering & Structured Output ──────────────────

  // BASIC
  {
    id: 61, domain: 4, tier: 'basic',
    text: 'What is the primary advantage of requesting JSON output with a defined schema over free-form text output?',
    options: [
      'Schema validation guarantees structure and enables reliable downstream parsing',
      'JSON output is always shorter and cheaper than equivalent free-form text output',
      'Claude produces higher quality content when asked to output in JSON format',
      'JSON format prevents Claude from making factual errors in the extracted data',
    ],
    correct: 0,
    explanation: 'Structured JSON output with a defined schema enables reliable programmatic processing: downstream systems can parse fields by name, validate types, and fail fast on schema violations. Free-form text requires fragile regex or NLP parsing. When combined with `strict: true`, the schema contract is guaranteed at the API level.',
    refs: [
      { label: 'Structured outputs', url: 'https://platform.claude.com/docs/en/build-with-claude/structured-outputs' },
    ],
  },
  {
    id: 62, domain: 4, tier: 'basic',
    text: 'What is a few-shot prompt?',
    options: [
      'A prompt sent multiple times until Claude eventually produces the right answer through repetition',
      'A prompt with input-output examples that demonstrate the desired behavior pattern',
      'A prompt that limits Claude to short responses of only a few sentences each',
      'A batch of multiple prompts that are processed simultaneously in one API call',
    ],
    correct: 1,
    explanation: 'Few-shot prompting provides examples of the desired input-output pattern within the prompt. These examples act as demonstrations — they show Claude the format, style, and reasoning pattern expected. Few-shot examples are effective for establishing output format and tone but are not compliance mechanisms (they cannot guarantee behavior).',
    refs: [
      { label: 'Prompt engineering overview', url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview' },
    ],
  },
  {
    id: 63, domain: 4, tier: 'basic',
    text: 'The Message Batches API offers approximately what cost reduction compared to the standard synchronous API?',
    options: [
      '10%',
      '25%',
      '50%',
      '75%',
    ],
    correct: 2,
    explanation: 'The Message Batches API offers approximately 50% cost savings compared to real-time API calls. The tradeoff is a 24-hour processing window with no SLA guarantees. This makes it suitable only for latency-tolerant, non-interactive workloads — batch classification, overnight analysis, bulk transformations.',
    refs: [
      { label: 'Message Batches API', url: 'https://platform.claude.com/docs/en/build-with-claude/batch-processing' },
    ],
  },
  {
    id: 64, domain: 4, tier: 'basic',
    text: 'What is a validation retry loop in the context of structured output extraction?',
    options: [
      'A loop that automatically retries the API call three times on any error regardless of its cause',
      'A client-side retry mechanism for handling API rate limits gracefully',
      'A mechanism that validates user input before sending it to the Claude API',
      'A pattern where the model gets its validation errors and regenerates until passing',
    ],
    correct: 3,
    explanation: 'Validation retry loops are a self-healing pattern: (1) request structured output, (2) validate against schema, (3) if validation fails, send the specific error back to Claude ("Field `price` must be a number, you returned a string"), (4) Claude regenerates with that specific feedback. Without the error feedback, Claude cannot self-correct reliably.',
    refs: [
      { label: 'Structured outputs', url: 'https://platform.claude.com/docs/en/build-with-claude/structured-outputs' },
    ],
  },

  // INTERMEDIATE
  {
    id: 65, domain: 4, tier: 'intermediate',
    text: 'You need to extract structured data from 50,000 product descriptions overnight. The downstream system ingests a batch file at 6 AM the next day. Which API approach is most appropriate?',
    options: [
      'Message Batches API — 50% cost savings with a 24-hour processing window',
      'Standard synchronous API with 50 parallel threads for maximum throughput',
      'Streaming API for real-time processing with minimal per-request overhead',
      'Standard API with prompt caching for repeated schema definition prefixes',
    ],
    correct: 0,
    explanation: 'Overnight bulk processing with a next-morning deadline is the canonical Message Batches API use case: (1) latency-tolerant (deadline is tomorrow morning, not now), (2) non-interactive (no user waiting), (3) high volume (50k requests). The 50% cost savings on this volume is significant. Parallel synchronous requests would work but cost double and add infrastructure complexity.',
    refs: [
      { label: 'Message Batches API', url: 'https://platform.claude.com/docs/en/build-with-claude/batch-processing' },
    ],
  },
  {
    id: 66, domain: 4, tier: 'intermediate',
    text: 'A validation retry loop is running but Claude keeps making the same schema error repeatedly across retries. What is most likely causing this?',
    options: [
      'The model needs to be replaced with a larger, more capable one for this task',
      'Error feedback is too generic — it lacks the specific field name and expected type',
      'The JSON schema is too complex for Claude to follow reliably in this context',
      'Validation retry loops are only effective for the first retry attempt per field in each extraction',
    ],
    correct: 1,
    explanation: 'For self-correction to work, the error feedback must be specific. "Validation failed" is useless. "Field `publish_date` must be ISO 8601 format (YYYY-MM-DD). You returned `March 15, 2026` — please use `2026-03-15` instead." is actionable. The more precisely the error identifies what failed and what the correct format is, the more reliably Claude self-corrects.',
    refs: [
      { label: 'Structured outputs', url: 'https://platform.claude.com/docs/en/build-with-claude/structured-outputs' },
    ],
  },
  {
    id: 67, domain: 4, tier: 'intermediate',
    text: 'When is it NOT appropriate to use the Message Batches API?',
    options: [
      'For classifying 100,000 support tickets overnight with results by morning',
      'For generating weekly summary reports that run on Sunday each week',
      'For live user queries in a chat app that requires sub-2-second latency',
      'For bulk document analysis with results needed the next business day',
    ],
    correct: 2,
    explanation: 'The Message Batches API has a 24-hour processing window with no latency SLA. Live user queries requiring sub-2-second responses must use the synchronous API. Using Batches for live interactions would result in users waiting minutes or hours for responses. The key filter: if a real human is waiting for the answer right now, use synchronous API.',
    refs: [
      { label: 'Message Batches API', url: 'https://platform.claude.com/docs/en/build-with-claude/batch-processing' },
    ],
  },
  {
    id: 68, domain: 4, tier: 'intermediate',
    text: 'You are building a multi-pass document review system: first pass extracts all claims, second pass verifies each claim against sources, third pass generates a credibility report. What architectural pattern does this represent?',
    options: [
      'A standard validation retry loop that corrects schema errors on each pass',
      'Parallel decomposition where all dimensions are analyzed simultaneously',
      'Chain-of-thought prompting applied across multiple sequential API calls',
      'Multi-pass review — separate specialized passes for each review dimension',
    ],
    correct: 3,
    explanation: 'Multi-pass review architecture dedicates each pass to a single review dimension: extract claims (no judgment, just extraction), verify claims (no extraction, just verification), report credibility (no extraction or verification, just synthesis). Each pass gets full attention on its specific task. Attempting all three in one pass causes attention dilution and lower quality on each dimension.',
    refs: [
      { label: 'Prompt engineering overview', url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview' },
    ],
  },
  {
    id: 69, domain: 4, tier: 'intermediate',
    text: 'Few-shot examples are effective for which purpose, and NOT effective for which purpose?',
    options: [
      'Effective for format and style demonstration; not for guaranteeing compliance',
      'Effective for compliance enforcement; not effective for output format control',
      'Effective for preventing hallucinations; not effective for formatting output',
      'Effective for all purposes universally; no known limitations for few-shot use',
    ],
    correct: 0,
    explanation: 'Few-shot examples are excellent for demonstrating desired output format, style, and reasoning patterns — Claude reliably mimics demonstrated patterns. They are NOT compliance mechanisms: showing Claude examples of correct tool ordering does not guarantee it will always follow that order (a probabilistic influence, not deterministic enforcement). For compliance, use programmatic mechanisms.',
    refs: [
      { label: 'Prompt engineering overview', url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview' },
    ],
  },
  {
    id: 70, domain: 4, tier: 'intermediate',
    text: 'What does `strict: true` on a tool definition guarantee?',
    options: [
      'Claude will always use this specific tool regardless of the conversation context or user intent',
      'Tool calls will always match the defined JSON schema — no missing or wrong fields',
      'The tool will reject invalid inputs at the MCP server level before processing',
      'Claude will validate the tool\'s output before returning results to the user',
    ],
    correct: 1,
    explanation: '`strict: true` enables Structured Outputs for tool use, guaranteeing that every tool call Claude generates adheres exactly to the defined input schema. This eliminates runtime errors caused by Claude passing `null` for a required field or a string where an integer is expected. It is a pre-call guarantee, not a post-call validation.',
    refs: [
      { label: 'Tool use — structured outputs mode', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview' },
    ],
  },

  // ADVANCED
  {
    id: 71, domain: 4, tier: 'advanced',
    text: 'A structured data extraction pipeline processes legal contracts. 15% of contracts use non-standard date formats that cause schema validation failures. The retry loop sends back "Invalid date format." How should the retry prompt be improved?',
    options: [
      'Increase max_retries from 3 to 10',
      'Remove the date field from the schema and process dates separately',
      'Include in the retry: the exact field that failed, the expected format (ISO 8601: YYYY-MM-DD), the value Claude returned, and an example conversion',
      'Switch to a few-shot approach with date format examples in the initial prompt',
    ],
    correct: 2,
    explanation: 'Specific error feedback is the key to reliable self-correction. The retry should include: "Field `contract_date` requires ISO 8601 format (YYYY-MM-DD). You returned `15th March 2026`. The correct value is `2026-03-15`." This gives Claude the exact field, the exact format requirement, the exact wrong value, and the correct form — all the information needed to fix it on the next attempt.',
    refs: [
      { label: 'Structured outputs', url: 'https://platform.claude.com/docs/en/build-with-claude/structured-outputs' },
    ],
  },
  {
    id: 72, domain: 4, tier: 'advanced',
    text: 'You are designing a prompt for a CI code review tool that must provide actionable, specific feedback and minimize false positives. Which prompt engineering technique is MOST important?',
    options: [
      'Chain-of-thought: ask Claude to reason step by step',
      'Few-shot: provide examples of good vs. bad review comments, distinguishing true positives from common false positives specific to your codebase',
      'Higher temperature: generate more diverse feedback',
      'Longer prompts: include all possible coding standards in the system prompt',
    ],
    correct: 1,
    explanation: 'Few-shot examples are uniquely powerful for CI review because they demonstrate the style distinction between actionable feedback ("Line 47: `user_input` is used in an SQL query without parameterization") vs. vague false positives ("This code might have security issues"). Pairing positive examples (good reviews) with negative examples (common false positives in your codebase) calibrates Claude\'s judgment to your team\'s standards.',
    refs: [
      { label: 'Prompt engineering overview', url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview' },
    ],
  },
  {
    id: 73, domain: 4, tier: 'advanced',
    text: 'A batch job uses the Message Batches API to process 10,000 support ticket classifications. The job starts at 11 PM and the results are needed by 9 AM. Should you use the Batches API? What is the key risk?',
    options: [
      'Yes — 10 hours is sufficient buffer. Key risk: the 24-hour window means results may not be ready within 10 hours',
      'No — use synchronous API instead',
      'Yes — the 24-hour window guarantees completion within 9 hours',
      'No — Batches API is limited to 1,000 requests',
    ],
    correct: 0,
    explanation: 'The Message Batches API has a 24-hour *window* — not a 10-hour guarantee. While most batch jobs complete much faster than 24 hours, there is no SLA. If the 9 AM deadline is hard, there is a risk of results not being ready. For guaranteed timing, use the synchronous API. This is the core Batches API tradeoff the exam tests: cost savings vs. latency unpredictability.',
    refs: [
      { label: 'Message Batches API', url: 'https://platform.claude.com/docs/en/build-with-claude/batch-processing' },
    ],
  },
  {
    id: 74, domain: 4, tier: 'advanced',
    text: 'A content moderation pipeline classifies 1 million items per day. The schema has 12 fields with nested objects. Validation shows 3% of outputs fail the schema on the first pass. The retry loop fixes 97% of failures. What is the remaining architectural concern?',
    options: [
      'A 3% initial failure rate is too high and the schema must be simplified',
      'The retry loop cost (3% × full-price retries vs. Batches pricing) and retry latency must be factored into the SLA and cost model for production',
      'Validation retry loops cannot be used with the Batches API',
      'The remaining 3% after retry (0.09% total) can be ignored at this scale',
    ],
    correct: 1,
    explanation: 'At 1M items/day, 3% initial failure = 30,000 retry calls. If retries use synchronous API (can\'t use Batches for time-sensitive retries), the cost and latency model changes significantly. Additionally, the 3% of Batches failures that enter retry queues may violate latency SLAs if the pipeline has hard deadlines. Production architecture must account for the retry cost and latency of the failure-and-recover path, not just the happy path.',
    refs: [
      { label: 'Message Batches API', url: 'https://platform.claude.com/docs/en/build-with-claude/batch-processing' },
      { label: 'Structured outputs', url: 'https://platform.claude.com/docs/en/build-with-claude/structured-outputs' },
    ],
  },

  // EXAM READY
  {
    id: 75, domain: 4, tier: 'exam',
    scenario: 'Structured Data Extraction',
    text: 'Your extraction system processes invoices and must populate 8 mandatory fields. On the first pass, 18% of invoices fail validation — mostly because `currency_code` is returned as "US Dollars" instead of the ISO 4217 code "USD". After implementing a retry loop, failures drop to 2%. The remaining 2% have ambiguous or missing currency information in the source document. How should you handle the persistent 2%?',
    options: [
      'Run them through three more retry passes until they succeed',
      'Use a default currency code of "USD" for all remaining failures',
      'Mark them with a `requires_human_review: true` flag and `confidence: "low"` field, route to a manual review queue rather than auto-processing',
      'Drop them from the pipeline to maintain data quality',
    ],
    correct: 2,
    explanation: 'When repeated retry passes still fail, the underlying issue is ambiguous source data — no amount of retrying will produce a reliable answer. The correct architectural pattern is graceful degradation: set `requires_human_review: true` and `confidence: "low"`, route to a manual review queue, and process the remaining 98% automatically. This maximizes automation while maintaining data quality for the edge cases that genuinely need human judgment.',
    refs: [
      { label: 'Structured outputs', url: 'https://platform.claude.com/docs/en/build-with-claude/structured-outputs' },
    ],
  },
  {
    id: 76, domain: 4, tier: 'exam',
    scenario: 'Claude Code for CI/CD',
    text: 'Your CI pipeline generates code review comments using Claude. Developers complain that 40% of security-related comments are false positives about their use of `eval()` in a controlled, sandboxed context. You have documented that `eval()` in the `/sandbox` directory is reviewed and approved. What is the most targeted fix?',
    options: [
      'Remove all security checks from the automated review',
      'Add a post-processing filter that removes any comment mentioning `eval()`',
      'Add to CLAUDE.md: "In the /sandbox directory, eval() usage has been security-reviewed and approved. Do not flag eval() in /sandbox as a security issue."',
      'Increase the review model\'s temperature to reduce repeated patterns',
    ],
    correct: 2,
    explanation: 'This is a targeted CLAUDE.md context injection. The false positives are caused by Claude lacking project-specific knowledge that `/sandbox/eval()` is approved. Adding this specific exception to CLAUDE.md tells Claude exactly which pattern to exempt and why — without removing eval() coverage elsewhere. Removing all security checks or adding blanket filters are over-corrections that reduce security coverage across the codebase.',
    refs: [
      { label: 'Claude Code — store instructions and memory', url: 'https://code.claude.com/docs/en/memory' },
    ],
  },
  {
    id: 77, domain: 4, tier: 'exam',
    scenario: 'Structured Data Extraction',
    text: 'You need to build a contract analysis pipeline that extracts 15 fields from legal documents including parties, dates, payment terms, termination clauses, and governing law. Some documents are 80+ pages. What is the most reliable architecture?',
    options: [
      'Send the entire 80-page document in one API call with all 15 fields in the schema',
      'Use a multi-pass architecture: pass 1 extracts structural elements (parties, dates), pass 2 extracts financial terms, pass 3 extracts legal clauses — each pass with focused schema and relevant document sections',
      'Use a larger context window model and extract all 15 fields simultaneously',
      'Chain 15 separate API calls, one per field',
    ],
    correct: 1,
    explanation: 'Multi-pass extraction on long documents produces significantly better results than single-pass. Each pass focuses on a subset of related fields and the relevant document sections (e.g., pass 1 only reads the header and signature blocks; pass 2 reads the payment section). This prevents attention dilution, reduces the extraction schema complexity per pass, and allows each pass to use the most relevant document context.',
    refs: [
      { label: 'Structured outputs', url: 'https://platform.claude.com/docs/en/build-with-claude/structured-outputs' },
      { label: 'Prompt engineering overview', url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview' },
    ],
  },
  {
    id: 78, domain: 4, tier: 'exam',
    scenario: 'Structured Data Extraction',
    text: 'A product classification pipeline achieves 94% accuracy on well-formatted product listings but drops to 71% on short, abbreviated listings (e.g., "16GB DDR5 3200MHz" instead of "Kingston 16GB DDR5 RAM Module 3200MHz CL16"). How should you address this?',
    options: [
      'Filter out short listings and process them manually',
      'Use a higher temperature for short listings to generate more diverse outputs',
      'Add few-shot examples specifically demonstrating classification of abbreviated, incomplete listings, including the reasoning process for resolving ambiguous abbreviations',
      'Use a larger model for all listings to improve overall accuracy',
    ],
    correct: 2,
    explanation: 'Few-shot examples are ideally suited for demonstrating how to handle the specific failure mode: abbreviated input. By showing Claude several examples of abbreviated listings and the reasoning used to classify them ("DDR5 3200MHz → RAM category, 3200MHz is the speed → subcategory: Memory"), you teach the pattern without modifying the schema. This is targeted prompt engineering for a specific input distribution.',
    refs: [
      { label: 'Prompt engineering overview', url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview' },
    ],
  },

  // ─── DOMAIN 5 — Context Management & Reliability ─────────────────────────

  // BASIC
  {
    id: 79, domain: 5, tier: 'basic',
    text: 'What is attention dilution and when does it occur?',
    options: [
      'When Claude processes too many requests simultaneously and latency increases',
      'When the prompt is too vague and Claude spreads attention across irrelevant topics',
      'When middle content in a very long context receives less reliable model attention',
      'When the context window is completely full and model responses get truncated',
    ],
    correct: 2,
    explanation: 'Attention dilution is the tendency for transformer models to give less reliable attention to content in the middle of very long contexts ("lost in the middle" problem). Content at the beginning and end of the context receives more reliable attention. The solution is to avoid stuffing too much into a single context — use per-section passes instead.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 80, domain: 5, tier: 'basic',
    text: 'Why is self-reported LLM confidence a poor signal for escalation routing?',
    options: [
      'The API does not expose a confidence score parameter for routing decisions',
      'Confidence scores are only available when using chain-of-thought prompting',
      'Self-reported confidence is reliable but too slow to compute for real-time use',
      'LLMs are poorly calibrated — often highly confident on exactly wrong answers',
    ],
    correct: 3,
    explanation: 'LLM confidence calibration is poor, particularly for hard cases. Models often express high confidence on questions they answer incorrectly — the specific situations where escalation matters most. Escalation routing must use programmatic signals: missing required data fields, explicit error returns, policy threshold violations, or structured uncertainty flags — not Claude\'s self-assessment.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 81, domain: 5, tier: 'basic',
    text: 'When should you use prompt caching for cost optimization?',
    options: [
      'When the same prefix (system prompt, examples, document) is reused across calls',
      'For any API call to reduce costs regardless of the prompt content or structure being repeated',
      'When the user asks the same question multiple times in a single conversation',
      'When the response is expected to be very long and consume many output tokens',
    ],
    correct: 0,
    explanation: 'Prompt caching stores the KV cache of a prompt prefix. Subsequent calls that share the same prefix pay the cache read price instead of re-processing those tokens. Maximum benefit comes from large, stable prefixes — a long system prompt, a big document, or a large set of few-shot examples that are reused across many requests.',
    refs: [
      { label: 'Prompt caching', url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-caching' },
    ],
  },

  // INTERMEDIATE
  {
    id: 82, domain: 5, tier: 'intermediate',
    text: 'A document analysis agent is processing a 200-page report and consistently misses details from pages 80–140. What is the root cause and fix?',
    options: [
      'Context window exceeded — switch to a model with a larger context window size',
      'Attention dilution on middle content — split into per-section passes with integration',
      'Document contains tables Claude cannot parse correctly — convert all tables to plain text format first',
      'Pages 80-140 are less relevant — use retrieval to focus on important sections',
    ],
    correct: 1,
    explanation: 'The "missing middle" symptom is a classic attention dilution pattern. The fix is per-section passes: chunk the 200-page report into logical sections, process each section with full attention (the entire context is that one section), then run a separate synthesis pass over all section summaries. A larger context window does not fix attention dilution — it just moves the diluted zone further in.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 83, domain: 5, tier: 'intermediate',
    text: 'A customer support agent is routing all complex, multi-step issues to human agents based on Claude\'s self-reported uncertainty: "I\'m not 100% confident about the billing policy here." 40% of these escalations turn out to be cases Claude could have resolved. What escalation signal should replace self-reported confidence?',
    options: [
      'Add a second AI model to verify and validate Claude\'s confidence assessment',
      'Increase Claude\'s temperature parameter to reduce hedging uncertainty expressions in responses',
      'Use programmatic signals: missing data fields, policy violations, error thresholds',
      'Add "Be more confident in your assessments" to the agent\'s system prompt text',
    ],
    correct: 2,
    explanation: 'Programmatic escalation signals are reliable; self-reported confidence is not. Examples: (1) `get_customer` returned no policy tier → escalate because policy lookup is required. (2) Refund amount > $500 → escalate per policy. (3) Tool error count > 3 in this session → escalate. These conditions are objective, deterministic, and not subject to the model\'s calibration errors.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 84, domain: 5, tier: 'intermediate',
    text: 'A multi-turn conversation agent is losing context from early in long conversations — users have to repeat context they provided 20+ turns ago. What strategy best addresses this?',
    options: [
      'Increase the context window to fit more conversation turns in total',
      'Delete old turns automatically when the context is nearly full',
      'Ask users to restate their full context every 10 turns as a manual conversation refresh mechanism',
      'Implement rolling summaries that compress earlier turns into structured context',
    ],
    correct: 3,
    explanation: 'Rolling summaries (also called context compression or memory summarization) maintain the most important information from earlier conversation turns in a compact form. Instead of dropping or truncating old turns, the agent periodically summarizes them ("User is researching competitor pricing for their enterprise software pitch to FinanceCo") and injects that summary as persistent context. This preserves semantic continuity without consuming the full context window.',
    refs: [
      { label: 'Claude Code — memory and context', url: 'https://code.claude.com/docs/en/memory' },
    ],
  },
  {
    id: 85, domain: 5, tier: 'intermediate',
    text: 'Information provenance in a multi-agent pipeline refers to:',
    options: [
      'Tracking which source (URL, document, record) each piece of information came from',
      'The geographic location of the API servers processing the pipeline request for data residency compliance',
      'The sequential order in which agents processed information in the pipeline',
      'Legal provenance — ensuring AI content is not used in violation of any TOS',
    ],
    correct: 0,
    explanation: 'Information provenance is the ability to trace any claim in a synthesized output back to its original source. In a research pipeline, this means the synthesis output can identify which document, URL, or database record each fact came from. This enables fact-checking, transparency, and the ability to invalidate specific claims if a source is found to be unreliable.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },

  // ADVANCED
  {
    id: 86, domain: 5, tier: 'advanced',
    text: 'A research pipeline processes 50-page documents. The team proposes switching to a model with a 200K token context window to process each document in one call, eliminating the per-section chunking. What is wrong with this reasoning?',
    options: [
      '200K token models are more expensive, making the pipeline cost-prohibitive',
      'Context window size does not equal attention quality — a larger window moves the diluted zone but does not eliminate it; focused per-section passes still produce more reliable extraction',
      '200K token models are slower and would violate the pipeline\'s latency SLA',
      'The reasoning is correct — a 200K window would eliminate the need for chunking',
    ],
    correct: 1,
    explanation: 'This is a fundamental misconception the exam tests directly. A larger context window does NOT fix attention dilution — it just means the dilution zone is further from the ends. A 50-page document in a 200K window will still have attention issues in the middle sections. Per-section passes where each section is the primary focus of the entire context window produce more reliable results than dumping the whole document into a large window.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 87, domain: 5, tier: 'advanced',
    text: 'A medical triage agent routes patient cases to either a nurse or a specialist based on its confidence assessment. Engineering review finds that 8% of high-confidence specialist referrals were cases the nurse could have handled, and 3% of high-confidence nurse referrals needed a specialist. How should the routing architecture be redesigned?',
    options: [
      'Lower the confidence threshold for specialist referral to be more conservative',
      'Replace self-reported confidence with rule-based routing: symptom categories, vital sign thresholds, medication interaction flags from structured extraction — with a `requires_specialist` field derived from the data, not Claude\'s assessment',
      'Add a second Claude model to validate routing decisions',
      'Increase temperature to generate more routing decision diversity',
    ],
    correct: 1,
    explanation: 'Medical routing based on LLM confidence is a safety risk. The correct architecture uses objective, clinically-defined routing rules derived from structured data extraction: "fever > 39.5°C → specialist flag," "chest pain with shortness of breath → specialist flag," "medication interaction detected → specialist flag." These rules are encoded in the extraction schema and routing logic — not in Claude\'s self-assessment. The extracted structured data drives the decision.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 88, domain: 5, tier: 'advanced',
    text: 'A coordinator agent receives partial results from a failed subagent: web search returned 3 sources before a timeout, document analysis completed successfully, synthesis was not attempted. How should the coordinator proceed?',
    options: [
      'Discard all results and re-run the entire pipeline',
      'Proceed with synthesis using only the document analysis results, discarding the incomplete web search',
      'Evaluate partial results: if 3 sources + document analysis are sufficient for the quality bar, proceed; otherwise targeted re-delegation to web search only (not the full pipeline)',
      'Ask the user whether to proceed with partial results',
    ],
    correct: 2,
    explanation: 'Intelligent partial result handling is a coordinator skill. The coordinator should evaluate: are the partial results (3 web sources + full document analysis) sufficient for the required quality? If yes, proceed — no need to re-run anything. If no, targeted re-delegation to only the failed component (web search) is more efficient than full pipeline re-runs. Discarding all results wastes the successful document analysis.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 89, domain: 5, tier: 'advanced',
    text: 'Your system uses prompt caching for a 50,000-token system prompt shared across all user requests. After a model upgrade, you notice cache hit rates dropped to near zero. What is the most likely cause?',
    options: [
      'The new model has a different context window size that invalidates caches',
      'A small modification to the shared system prompt (even a single character) breaks the cache prefix match — the entire prefix must be byte-for-byte identical',
      'Prompt caching is not available on the new model version',
      'The 50,000-token system prompt exceeds the cache size limit',
    ],
    correct: 1,
    explanation: 'Prompt caching requires exact byte-for-byte match on the cached prefix. Any modification — a single extra space, a version string update, a date injection — breaks the cache match and forces full re-processing. After a model upgrade, review whether the system prompt was also updated. Cache hit rates near zero after an upgrade almost always indicate a prompt modification, not a model incompatibility.',
    refs: [
      { label: 'Prompt caching', url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-caching' },
    ],
  },

  // EXAM READY
  {
    id: 90, domain: 5, tier: 'exam',
    scenario: 'Customer Support Resolution Agent',
    text: 'Your support agent handles 10,000 tickets per day. Analysis shows 12% are escalated to human agents. Post-escalation review finds: 60% of escalations were based on Claude\'s "I\'m not fully confident" output, and 40% of those did not actually need human handling. Engineering is asked to reduce unnecessary escalations without increasing missed escalations. What is the correct architectural change?',
    options: [
      'Fine-tune the model with examples of correctly handled complex cases',
      'Remove escalation entirely and let the model always attempt resolution',
      'Replace confidence-based escalation with rule-based escalation: define specific triggers (refund > $500, unverifiable account, 3+ tool failures, specific issue categories) in the routing logic derived from structured extraction',
      'Add a second call to Claude asking it to reconsider its confidence assessment',
    ],
    correct: 2,
    explanation: 'The problem is over-reliance on self-reported confidence. The fix is deterministic rule-based escalation: define the exact conditions that require human judgment in your routing logic, derive them from structured extraction fields, not Claude\'s uncertainty expressions. This reduces false escalations (Claude saying "not confident" when it actually can handle it) while maintaining necessary escalations (rules fire when the actual conditions are met).',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 91, domain: 5, tier: 'exam',
    scenario: 'Multi-Agent Research System',
    text: 'Your research coordinator is producing synthesis reports, but the sources in the final report cannot be traced back to specific documents — the synthesis subagent merged everything into unsourced paragraphs. You are now asked to add citation tracking. What change makes this possible?',
    options: [
      'Ask the synthesis subagent to "add citations where possible"',
      'Redesign the coordinator to pass structured context: each finding tagged with source ID, document title, URL, and page number; require the synthesis subagent to output a `citations` array alongside each claim',
      'Add a post-synthesis citation extraction step that parses the report for URLs',
      'Store all source documents in a shared database that the synthesis subagent queries',
    ],
    correct: 1,
    explanation: 'Citation tracking must be architected upstream, not retrofitted downstream. The coordinator must pass structured context (source ID → document title + URL + page) to the synthesis subagent, and the synthesis schema must include a `citations` field (array of source IDs) alongside each claim. The synthesis subagent can only attribute claims to sources if it received source metadata. Post-hoc citation extraction from unstructured prose is fragile and will miss many citations.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 92, domain: 5, tier: 'exam',
    scenario: 'Structured Data Extraction',
    text: 'Your legal document extraction system processes 500 contracts per hour. The pipeline has 99.1% availability but experiences occasional cascading failures when a malformed document causes the extraction model to generate a response that crashes the JSON parser, which in turn drops the next 30 documents in the queue. How should the pipeline be redesigned for resilience?',
    options: [
      'Add input validation to reject malformed documents before processing',
      'Implement per-document error isolation: each document processed in an independent try-catch; validation failures set `status: "failed"` and log details without affecting the queue; circuit breaker pattern to prevent cascading failures',
      'Process documents sequentially instead of in parallel to prevent cascade effects',
      'Increase the retry count from 3 to 10 for all documents',
    ],
    correct: 1,
    explanation: 'Cascading failure prevention requires two patterns: (1) per-document error isolation — each document must fail independently without affecting others (try-catch per item, not per batch), and (2) the circuit breaker pattern — if error rates spike above a threshold, the pipeline temporarily stops accepting new documents and alerts operations rather than continuing to fail. Sequential processing would eliminate one cause of cascades but at a severe throughput cost.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 93, domain: 5, tier: 'exam',
    scenario: 'Code Generation with Claude Code',
    text: 'A developer is using Claude Code for a multi-day migration project. After working for 3 days, they discover that a fundamental assumption in the migration approach is wrong, requiring a significantly different strategy. The current session has 200+ turns of context. What is the best way to proceed?',
    options: [
      'Continue in the current session and add a note about the wrong assumption',
      'Use `--resume` to jump back to the point before the wrong assumption was made',
      'Start a new session with a structured summary of: (1) what was learned so far, (2) the corrected understanding, (3) the new migration strategy — discarding the stale approach from prior turns',
      'Fork the current session to preserve the old approach while trying the new one',
    ],
    correct: 2,
    explanation: 'When a fundamental assumption is invalidated, the prior 200 turns of context based on the wrong assumption become actively misleading. Resuming or continuing in that context means Claude will reason from stale, incorrect premises. A new session with a structured summary that explicitly states the corrected understanding prevents stale reasoning. The summary should capture everything learned that is still valid, plus the corrected approach — a "clean start with memory" rather than a full restart.',
    refs: [
      { label: 'Claude Code — memory and sessions', url: 'https://code.claude.com/docs/en/memory' },
    ],
  },

  // ─── ADDITIONAL CROSS-DOMAIN & SCENARIO QUESTIONS ────────────────────────

  {
    id: 94, domain: 1, tier: 'advanced',
    text: 'A customer support agent processes a refund request. The `process_refund` tool is called before `get_customer` has been invoked. Which root cause and fix apply?',
    options: [
      'Claude misunderstood the system prompt order; rewrite it with numbered steps',
      'Missing programmatic prerequisite gate — `process_refund` should require a verified customer ID from a prior `get_customer` call in the current session to execute',
      'The tools should be merged into a single `process_refund_with_lookup` tool',
      'The agent should ask the user to confirm the customer ID before proceeding',
    ],
    correct: 1,
    explanation: 'This is the canonical prerequisite enforcement problem. The gate must be programmatic: before `process_refund` executes, the hook checks whether a verified customer ID exists in session state from a completed `get_customer` call. If not, the hook blocks the call and redirects to identity verification. Prompt-based ordering is insufficient for financial operations.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
      { label: 'Agent SDK — hooks', url: 'https://github.com/anthropics/claude-agent-sdk-python' },
    ],
  },
  {
    id: 95, domain: 3, tier: 'advanced',
    text: 'Your enterprise deploys Claude Code to 500 developers. The security team requires that certain file paths (secrets, credentials) are never accessible regardless of individual developer configuration. Where must this policy be enforced?',
    options: [
      'In each developer\'s personal `~/.claude/CLAUDE.md`',
      'In the project root CLAUDE.md with a "Security rules" section',
      'In enterprise-level policy settings or organization-wide `.claude/settings.json` checked into version control — applied before any individual settings',
      'In the CI/CD pipeline as a post-commit hook',
    ],
    correct: 2,
    explanation: 'Enterprise security policies must be enforced at the organizational level — not in individual developer files that employees can modify. Organization-wide settings (enterprise policy settings or project `.claude/settings.json` in version control) are applied before personal settings, creating a non-overridable security baseline. This mirrors how enterprise firewalls work: corporate policy > individual preferences.',
    refs: [
      { label: 'Claude Code settings', url: 'https://code.claude.com/docs/en/overview' },
    ],
  },
  {
    id: 96, domain: 2, tier: 'exam',
    scenario: 'Customer Support Resolution Agent',
    text: 'The support agent calls the `lookup_order` tool and receives: `{"isError": false, "content": [], "message": "No orders found for customer ID 48291"}`. It then calls `lookup_order` again three more times with the same customer ID. What is wrong with the agent\'s behavior and what caused it?',
    options: [
      'The agent is retrying correctly — transient errors should be retried',
      'The agent is treating a valid empty result (no orders found) as an error, causing unnecessary retries. The tool should have returned `isError: false` with an empty array — which it did — and the agent should have accepted this as a successful lookup with no results',
      'The `lookup_order` tool should have returned `isError: true` to prevent this confusion',
      'The agent needs better retry logic with exponential back-off',
    ],
    correct: 1,
    explanation: 'The tool returned `isError: false` with an empty array — this is correct behavior for "no records found." The agent erroneously interpreted this as a failure and retried. The root cause is missing downstream logic to distinguish empty results (success, no data) from errors (failure, try again). This is the critical `isError: false + empty content` vs `isError: true` distinction the exam tests directly.',
    refs: [
      { label: 'MCP documentation', url: 'https://modelcontextprotocol.io/docs' },
    ],
  },
  {
    id: 97, domain: 4, tier: 'exam',
    scenario: 'Structured Data Extraction',
    text: 'You are extracting data from insurance claims forms. The schema requires a `claim_type` field with enum values: `["medical", "dental", "vision", "mental_health", "pharmacy"]`. Validation shows Claude is occasionally returning `"Mental Health"` (capitalized, with space) instead of `"mental_health"`. Which two changes together guarantee this never happens?',
    options: [
      'Add "use lowercase with underscores" to the prompt and add a few-shot example of the correct enum value',
      'Set `strict: true` on the tool definition (schema validation guaranteed) AND include the enum in the JSON schema definition — any response deviating from the enum values will be rejected before it reaches your validation code',
      'Add a post-processing step that normalizes strings to the expected enum format',
      'Use a different model that has better enum adherence',
    ],
    correct: 1,
    explanation: 'Two layers of guarantee: (1) defining the enum in the JSON schema tells Claude exactly which values are valid, (2) `strict: true` guarantees that the response matches the schema — any deviation (capitalization, spacing) is caught at the API level before your code processes it. Post-processing normalization is a workaround that treats the symptom; schema enforcement prevents the problem at the source.',
    refs: [
      { label: 'Tool use — structured outputs mode', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview' },
      { label: 'Structured outputs', url: 'https://platform.claude.com/docs/en/build-with-claude/structured-outputs' },
    ],
  },
  {
    id: 98, domain: 5, tier: 'exam',
    scenario: 'Code Generation with Claude Code',
    text: 'You want to use Claude Code to refactor a monolithic authentication service into microservices. This is a week-long project. You plan a session architecture: Day 1 explores the codebase, Day 2-3 designs the new architecture, Day 4-5 implements. How should sessions be managed across this project?',
    options: [
      'Use a single long-running session for the entire week to preserve maximum context',
      'Start a completely new session each day to avoid stale context',
      'Use named sessions (`--resume <name>`) within each phase; at major phase transitions (exploration → design → implementation), start a new session with a structured summary of prior phase learnings and decisions',
      'Fork the session at the start of each day to preserve rollback capability',
    ],
    correct: 2,
    explanation: 'Named session resumption within a phase preserves the context of ongoing work (exploration findings, design decisions). Phase transitions warrant new sessions with structured summaries: the implementation session starts with "Architecture decisions from design phase: [list]" rather than carrying all the exploratory dead-ends and discarded design options from days 1-3. This keeps each phase context focused and avoids stale reasoning from earlier phases.',
    refs: [
      { label: 'Claude Code — memory and sessions', url: 'https://code.claude.com/docs/en/memory' },
    ],
  },
  {
    id: 99, domain: 1, tier: 'exam',
    scenario: 'Multi-Agent Research System',
    text: 'Your multi-agent research system takes 45 minutes to complete a comprehensive research report because the web search, document analysis, synthesis, and report generation subagents run sequentially. The coordinator waits for each to complete before starting the next. How do you reduce this to ~12 minutes without changing the synthesis step?',
    options: [
      'Use a faster model for each subagent',
      'Emit parallel Task tool calls: web search and document analysis run simultaneously in a single coordinator response; synthesis waits for both to complete; report generation follows synthesis',
      'Reduce the number of sources each subagent processes',
      'Run all four subagents in parallel and merge the outputs',
    ],
    correct: 1,
    explanation: 'Web search and document analysis are independent — they do not need each other\'s results. Running them in parallel (single coordinator response with two Task calls) reduces their combined time from sum to max. Synthesis correctly waits for both (it needs both results). Report generation correctly follows synthesis. This is the parallel-then-sequential pattern: parallelize independent steps, sequence dependent ones. Running synthesis in parallel with earlier steps would break the dependency chain.',
    refs: [
      { label: 'Building agents with the Claude Agent SDK', url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk' },
    ],
  },
  {
    id: 100, domain: 2, tier: 'advanced',
    text: 'An MCP server exposes 3 tools: `search_knowledge_base`, `search_web`, and `search_database`. All three have the description: "Searches for information." A system prompt says "Search for relevant information before answering." What two changes are needed?',
    options: [
      'Rename the tools to remove the word "search" and update the system prompt',
      'Rewrite each tool description to explicitly distinguish its source, input format, and when to use it vs. the others; and add a system prompt instruction that maps specific query types to the correct tool',
      'Merge all three into a single `search` tool with a `source` parameter',
      'Add few-shot examples showing the correct tool for different query types',
    ],
    correct: 1,
    explanation: 'Two changes needed: (1) Descriptions must differentiate: `search_knowledge_base` — "search internal company documentation; use when the question is about company policies, products, or procedures; input: keyword query; output: internal doc excerpts with IDs"; `search_web` — "search public internet; use for current events, external facts, recent information"; `search_database` — "query structured customer/transaction data; use when needing specific records by ID or date range." (2) System prompt should map task types to appropriate tools to reinforce the descriptions.',
    refs: [
      { label: 'Tool use overview', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview' },
    ],
  },

  // ── Official sample questions from the CCA Foundations Exam Guide PDF ──────

  {
    id: 101, domain: 1, tier: 'exam',
    scenario:
      'You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems through custom MCP tools (get_customer, lookup_order, process_refund, escalate_to_human). Your target is 80%+ first-contact resolution while knowing when to escalate.',
    text: 'Production data shows that in 12% of cases, your agent skips get_customer entirely and calls lookup_order using only the customer\'s stated name, occasionally leading to misidentified accounts and incorrect refunds. What change would most effectively address this reliability issue?',
    options: [
      'Add a programmatic prerequisite that blocks lookup_order and process_refund calls until get_customer has returned a verified customer ID',
      'Enhance the system prompt to state that customer verification via get_customer is mandatory before any order operations',
      'Add few-shot examples showing the agent always calling get_customer first, even when customers volunteer order details',
      'Implement a routing classifier that analyzes each request and enables only the subset of tools appropriate for that request type',
    ],
    correct: 0,
    explanation:
      'When a specific tool sequence is required for critical business logic (like verifying customer identity before processing refunds), programmatic enforcement provides deterministic guarantees that prompt-based approaches cannot. Options B and C rely on probabilistic LLM compliance, which is insufficient when errors have financial consequences. Option D addresses tool availability rather than tool ordering, which is not the actual problem.',
    refs: [
      { label: 'Hooks — tool prerequisites', url: 'https://platform.claude.com/docs/en/agent-sdk/hooks' },
    ],
  },
  {
    id: 102, domain: 2, tier: 'exam',
    scenario:
      'You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems through custom MCP tools (get_customer, lookup_order, process_refund, escalate_to_human). Your target is 80%+ first-contact resolution while knowing when to escalate.',
    text: 'Production logs show the agent frequently calls get_customer when users ask about orders (e.g., "check my order #12345"), instead of calling lookup_order. Both tools have minimal descriptions ("Retrieves customer information" / "Retrieves order details") and accept similar identifier formats. What\'s the most effective first step to improve tool selection reliability?',
    options: [
      'Add few-shot examples to the system prompt demonstrating correct tool selection patterns, with 5–8 examples showing order-related queries routing to lookup_order',
      'Expand each tool\'s description to include input formats it handles, example queries, edge cases, and boundaries explaining when to use it versus similar tools',
      'Implement a routing layer that parses user input before each turn and pre-selects the appropriate tool based on detected keywords and identifier patterns',
      'Consolidate both tools into a single lookup_entity tool that accepts any identifier and internally determines which backend to query',
    ],
    correct: 1,
    explanation:
      'Tool descriptions are the primary mechanism LLMs use for tool selection. When descriptions are minimal, models lack the context to differentiate between similar tools. Option B directly addresses this root cause with a low-effort, high-leverage fix. Few-shot examples (A) add token overhead without fixing the underlying issue. A routing layer (C) is over-engineered and bypasses the LLM\'s natural language understanding. Consolidating tools (D) is a valid architectural choice but requires more effort than a "first step" warrants when the immediate problem is inadequate descriptions.',
    refs: [
      { label: 'Tool use overview', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview' },
    ],
  },
  {
    id: 103, domain: 5, tier: 'exam',
    scenario:
      'You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems through custom MCP tools (get_customer, lookup_order, process_refund, escalate_to_human). Your target is 80%+ first-contact resolution while knowing when to escalate.',
    text: 'Your agent achieves 55% first-contact resolution, well below the 80% target. Logs show it escalates straightforward cases (standard damage replacements with photo evidence) while attempting to autonomously handle complex situations requiring policy exceptions. What\'s the most effective way to improve escalation calibration?',
    options: [
      'Add explicit escalation criteria to your system prompt with few-shot examples demonstrating when to escalate versus resolve autonomously',
      'Have the agent self-report a confidence score (1–10) before each response and automatically route requests to humans when confidence falls below a threshold',
      'Deploy a separate classifier model trained on historical tickets to predict which requests need escalation before the main agent begins processing',
      'Implement sentiment analysis to detect customer frustration levels and automatically escalate when negative sentiment exceeds a threshold',
    ],
    correct: 0,
    explanation:
      'Adding explicit escalation criteria with few-shot examples directly addresses the root cause: unclear decision boundaries. This is the proportionate first response before adding infrastructure. Option B fails because LLM self-reported confidence is poorly calibrated — the agent is already incorrectly confident on hard cases. Option C is over-engineered, requiring labeled data and ML infrastructure when prompt optimization hasn\'t been tried. Option D solves a different problem entirely; sentiment doesn\'t correlate with case complexity, which is the actual issue.',
    refs: [
      { label: 'Human-in-the-loop patterns', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/human-in-the-loop' },
    ],
  },
  {
    id: 104, domain: 3, tier: 'exam',
    scenario:
      'You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution.',
    text: 'You want to create a custom /review slash command that runs your team\'s standard code review checklist. This command should be available to every developer when they clone or pull the repository. Where should you create this command file?',
    options: [
      'In the .claude/commands/ directory in the project repository',
      'In ~/.claude/commands/ in each developer\'s home directory',
      'In the CLAUDE.md file at the project root',
      'In a .claude/config.json file with a commands array',
    ],
    correct: 0,
    explanation:
      'Project-scoped custom slash commands should be stored in the .claude/commands/ directory within the repository. These commands are version-controlled and automatically available to all developers when they clone or pull the repo. Option B (~/.claude/commands/) is for personal commands that aren\'t shared via version control. Option C (CLAUDE.md) is for project instructions and context, not command definitions. Option D describes a configuration mechanism that doesn\'t exist in Claude Code.',
    refs: [
      { label: 'Claude Code slash commands', url: 'https://docs.anthropic.com/en/docs/claude-code/slash-commands' },
    ],
  },
  {
    id: 105, domain: 3, tier: 'exam',
    scenario:
      'You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution.',
    text: 'You\'ve been assigned to restructure the team\'s monolithic application into microservices. This will involve changes across dozens of files and requires decisions about service boundaries and module dependencies. Which approach should you take?',
    options: [
      'Enter plan mode to explore the codebase, understand dependencies, and design an implementation approach before making changes',
      'Start with direct execution and make changes incrementally, letting the implementation reveal the natural service boundaries',
      'Use direct execution with comprehensive upfront instructions detailing exactly how each service should be structured',
      'Begin in direct execution mode and only switch to plan mode if you encounter unexpected complexity during implementation',
    ],
    correct: 0,
    explanation:
      'Plan mode is designed for complex tasks involving large-scale changes, multiple valid approaches, and architectural decisions — exactly what monolith-to-microservices restructuring requires. It enables safe codebase exploration and design before committing to changes. Option B risks costly rework when dependencies are discovered late. Option C assumes you already know the right structure without exploring the code. Option D ignores that the complexity is already stated in the requirements, not something that might emerge later.',
    refs: [
      { label: 'Claude Code plan mode', url: 'https://docs.anthropic.com/en/docs/claude-code/plan-mode' },
    ],
  },
  {
    id: 106, domain: 3, tier: 'exam',
    scenario:
      'You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution.',
    text: 'Your codebase has distinct areas with different coding conventions: React components use functional style with hooks, API handlers use async/await with specific error handling, and database models follow a repository pattern. Test files are spread throughout the codebase alongside the code they test (e.g., Button.test.tsx next to Button.tsx), and you want all tests to follow the same conventions regardless of location. What\'s the most maintainable way to ensure Claude automatically applies the correct conventions when generating code?',
    options: [
      'Create rule files in .claude/rules/ with YAML frontmatter specifying glob patterns to conditionally apply conventions based on file paths',
      'Consolidate all conventions in the root CLAUDE.md file under headers for each area, relying on Claude to infer which section applies',
      'Create skills in .claude/skills/ for each code type that include the relevant conventions in their SKILL.md files',
      'Place a separate CLAUDE.md file in each subdirectory containing that area\'s specific conventions',
    ],
    correct: 0,
    explanation:
      '.claude/rules/ with glob patterns (e.g., **/*.test.tsx) allows conventions to be automatically applied based on file paths regardless of directory location — essential for test files spread throughout the codebase. Option B relies on inference rather than explicit matching, making it unreliable. Option C requires manual skill invocation or relies on Claude choosing to load them, contradicting the need for deterministic "automatic" application based on file paths. Option D can\'t easily handle files spread across many directories since CLAUDE.md files are directory-bound.',
    refs: [
      { label: 'CLAUDE.md configuration', url: 'https://docs.anthropic.com/en/docs/claude-code/memory' },
    ],
  },
  {
    id: 107, domain: 1, tier: 'exam',
    scenario:
      'You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one generates reports. The system researches topics and produces comprehensive, cited reports.',
    text: 'After running the system on the topic "impact of AI on creative industries," you observe that each subagent completes successfully — the web search agent finds relevant articles, the document analysis agent summarizes papers correctly, and the synthesis agent produces coherent output. However, the final reports cover only visual arts, completely missing music, writing, and film production. When you examine the coordinator\'s logs, you see it decomposed the topic into three subtasks: "AI in digital art creation," "AI in graphic design," and "AI in photography." What is the most likely root cause?',
    options: [
      'The synthesis agent lacks instructions for identifying coverage gaps in the findings it receives from other agents',
      'The coordinator agent\'s task decomposition is too narrow, resulting in subagent assignments that don\'t cover all relevant domains of the topic',
      'The web search agent\'s queries are not comprehensive enough and need to be expanded to cover more creative industry sectors',
      'The document analysis agent is filtering out sources related to non-visual creative industries due to overly restrictive relevance criteria',
    ],
    correct: 1,
    explanation:
      'The coordinator\'s logs reveal the root cause directly: it decomposed "creative industries" into only visual arts subtasks (digital art, graphic design, photography), completely omitting music, writing, and film. The subagents executed their assigned tasks correctly — the problem is what they were assigned. Options A, C, and D incorrectly blame downstream agents that are working correctly within their assigned scope.',
    refs: [
      { label: 'Multi-agent orchestration', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/orchestration' },
    ],
  },
  {
    id: 108, domain: 5, tier: 'exam',
    scenario:
      'You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one generates reports. The system researches topics and produces comprehensive, cited reports.',
    text: 'The web search subagent times out while researching a complex topic. You need to design how this failure information flows back to the coordinator agent. Which error propagation approach best enables intelligent recovery?',
    options: [
      'Return structured error context to the coordinator including the failure type, the attempted query, any partial results, and potential alternative approaches',
      'Implement automatic retry logic with exponential backoff within the subagent, returning a generic "search unavailable" status only after all retries are exhausted',
      'Catch the timeout within the subagent and return an empty result set marked as successful',
      'Propagate the timeout exception directly to a top-level handler that terminates the entire research workflow',
    ],
    correct: 0,
    explanation:
      'Structured error context gives the coordinator the information it needs to make intelligent recovery decisions — whether to retry with a modified query, try an alternative approach, or proceed with partial results. Option B\'s generic status hides valuable context from the coordinator, preventing informed decisions. Option C suppresses the error by marking failure as success, which prevents any recovery and risks incomplete research outputs. Option D terminates the entire workflow unnecessarily when recovery strategies could succeed.',
    refs: [
      { label: 'Error handling in agents', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/orchestration' },
    ],
  },
  {
    id: 109, domain: 2, tier: 'exam',
    scenario:
      'You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one generates reports. The system researches topics and produces comprehensive, cited reports.',
    text: 'During testing, you observe that the synthesis agent frequently needs to verify specific claims while combining findings. Currently, when verification is needed, the synthesis agent returns control to the coordinator, which invokes the web search agent, then re-invokes synthesis with results. This adds 2–3 round trips per task and increases latency by 40%. Your evaluation shows that 85% of these verifications are simple fact-checks (dates, names, statistics) while 15% require deeper investigation. What\'s the most effective approach to reduce overhead while maintaining system reliability?',
    options: [
      'Give the synthesis agent a scoped verify_fact tool for simple lookups, while complex verifications continue delegating to the web search agent through the coordinator',
      'Have the synthesis agent accumulate all verification needs and return them as a batch to the coordinator at the end of its pass, which then sends them all to the web search agent at once',
      'Give the synthesis agent access to all web search tools so it can handle any verification need directly without round-trips through the coordinator',
      'Have the web search agent proactively cache extra context around each source during initial research, anticipating what the synthesis agent might need to verify',
    ],
    correct: 0,
    explanation:
      'Option A applies the principle of least privilege by giving the synthesis agent only what it needs for the 85% common case (simple fact verification) while preserving the existing coordination pattern for complex cases. Option B\'s batching approach creates blocking dependencies since synthesis steps may depend on earlier verified facts. Option C over-provisions the synthesis agent, violating separation of concerns. Option D relies on speculative caching that cannot reliably predict what the synthesis agent will need to verify.',
    refs: [
      { label: 'Tool distribution across agents', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/orchestration' },
    ],
  },
  {
    id: 110, domain: 3, tier: 'exam',
    scenario:
      'You are integrating Claude Code into your CI/CD pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests. You need to design prompts that provide actionable feedback and minimize false positives.',
    text: 'Your pipeline script runs `claude "Analyze this pull request for security issues"` but the job hangs indefinitely. Logs indicate Claude Code is waiting for interactive input. What\'s the correct approach to run Claude Code in an automated pipeline?',
    options: [
      'Add the -p flag: claude -p "Analyze this pull request for security issues"',
      'Set the environment variable CLAUDE_HEADLESS=true before running the command',
      'Redirect stdin from /dev/null: claude "Analyze this pull request for security issues" < /dev/null',
      'Add the --batch flag: claude --batch "Analyze this pull request for security issues"',
    ],
    correct: 0,
    explanation:
      'The -p (or --print) flag is the documented way to run Claude Code in non-interactive mode. It processes the prompt, outputs the result to stdout, and exits without waiting for user input — exactly what CI/CD pipelines require. The other options reference non-existent features (CLAUDE_HEADLESS environment variable, --batch flag) or use Unix workarounds that don\'t properly address Claude Code\'s command syntax.',
    refs: [
      { label: 'Claude Code CLI reference', url: 'https://docs.anthropic.com/en/docs/claude-code/cli-reference' },
    ],
  },
  {
    id: 111, domain: 4, tier: 'exam',
    scenario:
      'You are integrating Claude Code into your CI/CD pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests. You need to design prompts that provide actionable feedback and minimize false positives.',
    text: 'Your team wants to reduce API costs for automated analysis. Currently, real-time Claude calls power two workflows: (1) a blocking pre-merge check that must complete before developers can merge, and (2) a technical debt report generated overnight for review the next morning. Your manager proposes switching both to the Message Batches API for its 50% cost savings. How should you evaluate this proposal?',
    options: [
      'Use batch processing for the technical debt reports only; keep real-time calls for pre-merge checks',
      'Switch both workflows to batch processing with status polling to check for completion',
      'Keep real-time calls for both workflows to avoid batch result ordering issues',
      'Switch both to batch processing with a timeout fallback to real-time if batches take too long',
    ],
    correct: 0,
    explanation:
      'The Message Batches API offers 50% cost savings but has processing times up to 24 hours with no guaranteed latency SLA. This makes it unsuitable for blocking pre-merge checks where developers wait for results, but ideal for overnight batch jobs like technical debt reports. Option B is wrong because relying on polling isn\'t acceptable for blocking workflows with developer wait time. Option C reflects a misconception — batch results can be correlated using custom_id fields. Option D adds unnecessary complexity when the simpler solution is matching each API to its appropriate use case.',
    refs: [
      { label: 'Message Batches API', url: 'https://docs.anthropic.com/en/docs/build-with-claude/batch-processing' },
    ],
  },
  {
    id: 112, domain: 4, tier: 'exam',
    scenario:
      'You are integrating Claude Code into your CI/CD pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests. You need to design prompts that provide actionable feedback and minimize false positives.',
    text: 'A pull request modifies 14 files across the stock tracking module. Your single-pass review analyzing all files together produces inconsistent results: detailed feedback for some files but superficial comments for others, obvious bugs missed, and contradictory feedback — flagging a pattern as problematic in one file while approving identical code elsewhere in the same PR. How should you restructure the review?',
    options: [
      'Split into focused passes: analyze each file individually for local issues, then run a separate integration-focused pass examining cross-file data flow',
      'Require developers to split large PRs into smaller submissions of 3–4 files before the automated review runs',
      'Switch to a higher-tier model with a larger context window to give all 14 files adequate attention in one pass',
      'Run three independent review passes on the full PR and only flag issues that appear in at least two of the three runs',
    ],
    correct: 0,
    explanation:
      'Splitting reviews into focused passes directly addresses the root cause: attention dilution when processing many files at once. File-by-file analysis ensures consistent depth, while a separate integration pass catches cross-file issues. Option B shifts burden to developers without improving the system. Option C misunderstands that larger context windows don\'t solve attention quality issues. Option D would actually suppress detection of real bugs by requiring consensus on issues that may only be caught intermittently.',
    refs: [
      { label: 'Multi-pass review architecture', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/orchestration' },
    ],
  },

  // ── New intermediate / advanced questions per task statement ─────────────

  {
    id: 113, domain: 1, tier: 'intermediate',
    text: 'A coordinator agent is configured with allowedTools: ["Read", "Grep", "Glob"]. When it attempts to spawn a subagent by emitting a Task tool call, nothing happens — the call is silently ignored. What is the most likely cause?',
    options: [
      'The subagent\'s AgentDefinition is missing a required system prompt field',
      '"Task" is not included in the coordinator\'s allowedTools list configuration',
      'Subagents can only be spawned from the root agent, not from nested coordinator agents',
      'The Task tool call must include an allowedTools array for the subagent',
    ],
    correct: 1,
    explanation:
      'The Task tool is the mechanism for spawning subagents. Like any other tool, it must be included in the coordinator\'s allowedTools configuration before it can be called. If "Task" is absent, the coordinator simply cannot emit Task calls. This is a common misconfiguration when assembling multi-agent systems: developers configure the subagents\' AgentDefinitions carefully but forget to add "Task" to the coordinator\'s own allowed tools.',
    refs: [
      { label: 'Subagent spawning with Task tool', url: 'https://platform.claude.com/docs/en/agent-sdk/tasks' },
    ],
  },
  {
    id: 114, domain: 1, tier: 'advanced',
    text: 'A coordinator agent needs to gather data from three independent sources (web, database, document store) before synthesizing a final answer. Currently it spawns each subagent in a separate turn — web search, then wait, then database, then wait, then document store, then wait — taking ~90 seconds total. How should you modify the coordinator to reduce latency?',
    options: [
      'Use fork_session so each subagent runs in its own isolated session',
      'Emit all three Task tool calls in a single coordinator response; they will execute in parallel',
      'Configure the coordinator\'s max_tokens higher so it can process all three in one reasoning pass',
      'Chain the subagents so each passes its results directly to the next without returning to the coordinator',
    ],
    correct: 1,
    explanation:
      'Multiple Task tool calls emitted in a single coordinator response execute in parallel — this is the designed mechanism for concurrent subagent execution. By returning all three Task calls at once (instead of one per turn), all three subagents start simultaneously. Total latency becomes max(web, database, docs) rather than sum. Fork_session (A) is for exploring divergent approaches from a shared baseline, not for parallelism. Max_tokens (C) controls output length, not execution model. Chaining subagents (D) destroys parallelism by creating sequential dependencies.',
    refs: [
      { label: 'Parallel subagent execution', url: 'https://platform.claude.com/docs/en/agent-sdk/tasks' },
    ],
  },
  {
    id: 115, domain: 1, tier: 'intermediate',
    text: 'Your agent integrates with three MCP tools from different vendors. Tool A returns dates as Unix timestamps, Tool B returns ISO 8601 strings, and Tool C returns dates as "DD/MM/YYYY". The agent frequently miscomputes date differences when comparing results across tools. What is the cleanest architectural fix?',
    options: [
      'Add a date normalization instruction to the system prompt telling the agent to convert all formats',
      'Add few-shot examples showing correct date parsing for each tool\'s format',
      'Implement a PostToolUse hook that normalizes all date fields to one format',
      'Wrap each MCP tool call in a helper function that normalizes the response',
    ],
    correct: 2,
    explanation:
      'A PostToolUse hook intercepts tool results after execution but before the model processes them — exactly the right place for deterministic data normalization. All three date formats become one consistent format transparently, without requiring prompt changes or wrapper complexity. System prompt instructions (A) are probabilistic and won\'t reliably fix parsing of structured data. Few-shot examples (C) teach the model to handle variation rather than eliminating the variation itself. Wrapper functions (D) would work but require modifying every tool call site individually; a single hook is more maintainable.',
    refs: [
      { label: 'Agent SDK hooks', url: 'https://platform.claude.com/docs/en/agent-sdk/hooks' },
    ],
  },
  {
    id: 116, domain: 1, tier: 'advanced',
    text: 'You are choosing a decomposition strategy for two workflows: (A) a code review that must check security, performance, and style for each file in a PR; (B) an investigation into why production errors spiked — the cause is unknown and each finding may redirect the investigation. Which strategy fits each?',
    options: [
      'Dynamic decomposition for both: uncertainty always favors adaptive plans',
      'Prompt chaining for A, dynamic decomposition for B',
      'Prompt chaining for both: structured steps produce more consistent output',
      'Dynamic decomposition for A, prompt chaining for B',
    ],
    correct: 1,
    explanation:
      'Code review (A) has a predictable multi-aspect structure: the same three checks apply to every file, making prompt chaining (fixed sequential passes) ideal. Error investigation (B) is open-ended: what you find in step one determines what to look at in step two. Dynamic decomposition — generating subtasks based on intermediate findings — is the right fit. Applying dynamic decomposition to the code review wastes overhead for no gain; applying prompt chaining to the investigation would miss the adaptive branching the task requires.',
    refs: [
      { label: 'Task decomposition strategies', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/orchestration' },
    ],
  },
  {
    id: 117, domain: 1, tier: 'intermediate',
    text: 'A developer spent three hours analyzing a legacy codebase yesterday. Today they want to explore two different refactoring approaches starting from the same analysis baseline — without the approaches polluting each other. Which session management feature should they use?',
    options: [
      '--resume with yesterday\'s session name to continue from where they left off',
      'Start two new sessions with the same system prompt and re-analyze each time',
      '/compact to reduce yesterday\'s session to a summary, then branch from there',
      'fork_session to create two independent branches from the shared baseline',
    ],
    correct: 3,
    explanation:
      'fork_session creates independent branches from an existing session\'s state — both branches share the analysis baseline but diverge independently from that point. Changes in branch A don\'t affect branch B. This is precisely the "explore two approaches from a common baseline" use case. --resume (A) would continue the single prior session, not create branches. Starting new sessions (C) requires expensive re-analysis. /compact reduces context but doesn\'t create forks.',
    refs: [
      { label: 'Session management', url: 'https://docs.anthropic.com/en/docs/claude-code/session-management' },
    ],
  },
  {
    id: 118, domain: 1, tier: 'advanced',
    text: 'An agent has a named session from last week that contains extensive tool results from analyzing a codebase. Since then, 15 files have been modified and 3 new modules added. A developer wants to continue the investigation. What is the recommended approach?',
    options: [
      'Resume the old session with --resume; the model will detect changes automatically',
      'Resume the old session and immediately inform the agent about which specific files changed, for targeted re-analysis',
      'Start a new session and inject a structured summary of the prior session\'s key findings, then re-analyze only changed files',
      'Resume the old session and run /compact first to condense the stale tool results',
    ],
    correct: 2,
    explanation:
      'When prior tool results are stale (files have changed), starting fresh with injected summaries is more reliable than resuming. The old session\'s tool results reference code that no longer exists — the model may reason from outdated facts. A structured summary of key findings (architecture decisions, entry points, patterns) gives the new session the conceptual baseline without stale data. Option B (resume + inform) can work for minor changes but is risky when 15 files and 3 modules changed. Option A assumes automatic change detection, which doesn\'t exist. Option D doesn\'t help because /compact would just compress the stale data.',
    refs: [
      { label: 'Session resumption patterns', url: 'https://docs.anthropic.com/en/docs/claude-code/session-management' },
    ],
  },
  {
    id: 119, domain: 2, tier: 'basic',
    text: 'Your team wants to share a GitHub MCP server configuration so all developers have access to it when they clone the repository. Where should you configure this MCP server?',
    options: [
      'In the project\'s .mcp.json file, committed to version control for the team',
      'In ~/.claude.json on each developer\'s machine for personal MCP server configuration',
      'In the root CLAUDE.md file as a structured MCP configuration code block',
      'In a .env file at the project root with MCP_SERVER_URL variables defined',
    ],
    correct: 0,
    explanation:
      'Project-level MCP server configuration belongs in .mcp.json at the project root. This file is committed to version control and automatically available to all team members when they clone or pull the repository. ~/.claude.json is for personal or experimental MCP servers that should not be shared with the team. CLAUDE.md is for instructions and context, not server configuration. A .env file doesn\'t configure MCP servers.',
    refs: [
      { label: 'MCP server configuration', url: 'https://docs.anthropic.com/en/docs/claude-code/mcp' },
    ],
  },
  {
    id: 120, domain: 2, tier: 'intermediate',
    text: 'You are configuring a GitHub MCP server in your project\'s .mcp.json. The server requires a personal access token. A teammate suggests hardcoding the token directly in the JSON file since it\'s an internal repo. What is the correct approach?',
    options: [
      'Hardcode the token — internal repos don\'t need the same security standards',
      'Use ${GITHUB_TOKEN} env var expansion in .mcp.json; each dev sets it locally',
      'Store the token in CLAUDE.md under a dedicated secrets configuration section',
      'Create a .mcp.local.json file with the token and add it to the .gitignore',
    ],
    correct: 1,
    explanation:
      '.mcp.json supports environment variable expansion using ${VAR_NAME} syntax. This allows the shared configuration file to be committed safely without containing credentials — each developer sets the actual token value in their shell environment (e.g., ~/.zshrc or a local .env). Hardcoding tokens (A) is a security anti-pattern even in internal repos — tokens get leaked through git history, screenshots, and team changes. CLAUDE.md is not a secrets store. A .mcp.local.json approach isn\'t a supported pattern.',
    refs: [
      { label: 'MCP server configuration', url: 'https://docs.anthropic.com/en/docs/claude-code/mcp' },
    ],
  },
  {
    id: 121, domain: 2, tier: 'basic',
    text: 'A developer needs to find all files in a repository that have the extension .test.tsx. Which built-in tool should they use?',
    options: [
      'Grep with the pattern "\.test\.tsx$" to search for matching filenames',
      'Read with a directory path argument to recursively list all contents',
      'Glob with the pattern "**/*.test.tsx" to match files by extension',
      'Bash with the find command to locate files matching the extension',
    ],
    correct: 2,
    explanation:
      'Glob is the built-in tool for finding files by name or extension patterns. The pattern **/*.test.tsx matches all files ending in .test.tsx anywhere in the directory tree. Grep searches file contents, not file names — it would need the -l flag and wouldn\'t efficiently match by extension. Read operates on individual files or directories but doesn\'t support recursive pattern matching. Bash with find works but bypasses the purpose-built Glob tool.',
    refs: [
      { label: 'Built-in tools reference', url: 'https://docs.anthropic.com/en/docs/claude-code/built-in-tools' },
    ],
  },
  {
    id: 122, domain: 2, tier: 'intermediate',
    text: 'An agent attempts to use the Edit tool to update a configuration value in a large auto-generated file where the same string "timeout: 30" appears 47 times. The Edit call fails because the match is not unique. What is the correct fallback approach?',
    options: [
      'Use Grep to find the correct line number, then pass it as an Edit offset',
      'Use Bash with sed to replace the specific occurrence by its line number',
      'Use Edit with a larger surrounding context block to make the old_string match unique',
      'Use Read to load the full file, make the change, then Write the result back',
    ],
    correct: 3,
    explanation:
      'When Edit fails due to non-unique text matches, the correct fallback is Read + Write: load the full file with Read, apply the targeted modification programmatically, and save the result with Write. This provides reliable modification even when no unique anchor text exists. Option D (larger context) would work if unique context exists, but when the same pattern repeats 47 times throughout an auto-generated file, finding a unique anchor may be impossible. Bash sed (C) works but is fragile and bypasses the purpose-built tools. Grep + Edit offset (A) doesn\'t exist — Edit doesn\'t accept line-number offsets.',
    refs: [
      { label: 'Built-in tools reference', url: 'https://docs.anthropic.com/en/docs/claude-code/built-in-tools' },
    ],
  },
  {
    id: 123, domain: 3, tier: 'basic',
    text: 'A new developer on your team reports that Claude Code is not applying the team\'s coding standards — it\'s ignoring the conventions defined in CLAUDE.md. You discover the team lead put all conventions in ~/.claude/CLAUDE.md on their own machine. What is wrong?',
    options: [
      'User-level CLAUDE.md is personal and not shared; team conventions need project-level CLAUDE.md',
      'CLAUDE.md files must be placed in the src/ directory under the project root, not the user home directory at all',
      'The team lead needs to run "claude sync" to push their CLAUDE.md to all team members',
      'CLAUDE.md only works when placed in the .claude/ subdirectory, not in the project root',
    ],
    correct: 0,
    explanation:
      'The CLAUDE.md configuration hierarchy has three levels: user-level (~/.claude/CLAUDE.md), project-level (root CLAUDE.md or .claude/CLAUDE.md), and directory-level (subdirectory CLAUDE.md files). User-level settings exist only on the developer\'s own machine and are never version-controlled. For team-wide standards to apply to all developers, they must be in the project-level CLAUDE.md, which is committed to the repository.',
    refs: [
      { label: 'CLAUDE.md configuration hierarchy', url: 'https://docs.anthropic.com/en/docs/claude-code/memory' },
    ],
  },
  {
    id: 124, domain: 3, tier: 'intermediate',
    text: 'A monorepo has three packages: frontend (React), backend (Node.js), and infrastructure (Terraform). Each package has its own maintainer and separate coding standards documents. The root CLAUDE.md is growing very large as all standards are consolidated. What is the most maintainable solution?',
    options: [
      'Split the root CLAUDE.md into three separate files, one per package directory',
      'Use @import directives in each CLAUDE.md to reference relevant standards files',
      'Move all standards to .claude/rules/ with glob patterns to scope each package directory individually',
      'Keep a single large CLAUDE.md and rely on Claude to load relevant sections',
    ],
    correct: 1,
    explanation:
      'The @import syntax allows CLAUDE.md files to reference external files, enabling modular configuration. Each package maintainer can manage their own standards file independently, and the package\'s CLAUDE.md imports only what\'s relevant. The root CLAUDE.md stays minimal with only universal conventions. Option A (separate CLAUDE.md per directory) works but doesn\'t support importing shared standards files. Option C (.claude/rules/) is good for path-scoped rules but not for the modular documentation use case. Option D relies on inference, which is unreliable.',
    refs: [
      { label: 'CLAUDE.md configuration', url: 'https://docs.anthropic.com/en/docs/claude-code/memory' },
    ],
  },
  {
    id: 125, domain: 3, tier: 'intermediate',
    text: 'Your team creates a /analyze-codebase skill that explores the entire repository structure and produces a detailed architecture summary. When developers invoke this skill, the verbose exploration output floods the main conversation, making subsequent interactions cluttered. What skill frontmatter option fixes this?',
    options: [
      'Set allowed-tools: [] to prevent the skill from reading any project files',
      'Add a max-output-tokens limit in the skill frontmatter configuration block to cap output size',
      'Set context: fork so only the final summary returns to the main conversation',
      'Set scope: project to limit the skill to only project-level files and paths',
    ],
    correct: 2,
    explanation:
      'context: fork runs the skill in an isolated sub-agent context. All intermediate tool calls and verbose output remain inside that isolated context. Only the skill\'s final response returns to the main conversation. This is exactly the right pattern for exploration and analysis skills that produce a lot of intermediate output. allowed-tools: [] (A) would prevent the skill from doing any file reading, breaking its purpose. max-output-tokens and scope are not valid skill frontmatter options.',
    refs: [
      { label: 'Claude Code skills', url: 'https://docs.anthropic.com/en/docs/claude-code/skills' },
    ],
  },
  {
    id: 126, domain: 3, tier: 'basic',
    text: 'A developer creates a /migrate skill that requires a target-version argument. When teammates invoke /migrate without providing the argument, Claude simply runs the skill with an empty argument and produces incorrect output. What frontmatter option should be added to the SKILL.md?',
    options: [
      'required-args: ["target-version"] in the skill frontmatter to enforce the argument before invocation',
      'validate-args: true',
      'min-args: 1',
      'argument-hint: "target-version (e.g., v2.0.0)"',
    ],
    correct: 3,
    explanation:
      'The argument-hint frontmatter option prompts developers for required parameters when they invoke the skill without arguments. Claude Code will display the hint and request the argument before proceeding. This prevents silent invocation with empty inputs. required-args, validate-args, and min-args are not valid SKILL.md frontmatter options.',
    refs: [
      { label: 'Claude Code skills', url: 'https://docs.anthropic.com/en/docs/claude-code/skills' },
    ],
  },
  {
    id: 127, domain: 3, tier: 'intermediate',
    text: 'A developer asks Claude Code to build a Redis cache layer for an existing Express API. They provide a detailed specification but Claude asks several follow-up questions: "Should the cache invalidate on every write or use TTL only? What failure mode is acceptable — fail open or fail closed? Should cache keys be per-user or shared?" The developer is frustrated by the questions and wants Claude to just implement. What should they understand about this behavior?',
    options: [
      'Claude is surfacing design tradeoffs the developer may not have anticipated upfront',
      'This is a bug — Claude should implement based on the specification without questions',
      'The developer should use plan mode, which skips the interview question phase',
      'The specification is too vague — a more detailed spec would prevent the questions',
    ],
    correct: 0,
    explanation:
      'The interview pattern is an intentional iterative refinement technique. Before implementing in unfamiliar domains with significant tradeoffs (caching, distributed systems, security), Claude asks questions to surface design considerations the developer may not have anticipated — cache invalidation strategy, failure modes, and key design are all decisions that significantly affect correctness and performance. Answering them upfront prevents costly rework. This is not a bug, not a plan-mode vs direct-execution issue, and not caused by specification vagueness — these questions arise because the decisions are genuinely underspecified.',
    refs: [
      { label: 'Iterative refinement', url: 'https://docs.anthropic.com/en/docs/claude-code/best-practices' },
    ],
  },
  {
    id: 128, domain: 4, tier: 'basic',
    text: 'What is the difference between tool_choice: "auto", tool_choice: "any", and forced tool selection in the Claude API?',
    options: [
      '"auto" forces a tool call; "any" lets Claude choose which; forced names a tool',
      '"auto" lets Claude decide freely; "any" guarantees some tool; forced names one',
      '"auto" and "any" are identical; forced is the only option that changes behavior',
      '"any" and forced both guarantee a call; "auto" disables tool calling entirely',
    ],
    correct: 1,
    explanation:
      'tool_choice: "auto" (default) allows Claude to either call a tool or return conversational text — no guarantee of tool use. tool_choice: "any" guarantees Claude will call at least one tool but lets it choose which from available tools. Forced tool selection ({"type": "tool", "name": "..."}) guarantees a specific named tool is called. Use "any" when you need structured output but have multiple valid schemas; use forced selection when a specific tool must run first (e.g., metadata extraction before enrichment).',
    refs: [
      { label: 'Tool use — tool_choice', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use' },
    ],
  },
  {
    id: 129, domain: 4, tier: 'intermediate',
    text: 'You are building a document enrichment pipeline. Documents must first go through metadata extraction (extract_metadata tool) before any enrichment steps run. If metadata extraction is skipped, enrichment tools may fail or produce incorrect results. How do you enforce this ordering using the Claude API?',
    options: [
      'Add a system prompt instruction: "Always call extract_metadata before any enrichment tools run"',
      'Use tool_choice: "any" so Claude is guaranteed to call a tool on the first turn',
      'Set tool_choice to force extract_metadata on the first call; use auto for the rest',
      'List extract_metadata first in the tools array so Claude encounters it first',
    ],
    correct: 2,
    explanation:
      'Forced tool selection (tool_choice: {"type": "tool", "name": "extract_metadata"}) guarantees that the specific named tool is called, not just any tool. By using this on the first API call, you ensure metadata extraction runs before the model has the option to call enrichment tools. Subsequent turns can then use tool_choice: "auto" or "any" for the enrichment steps. System prompt instructions (A) are probabilistic. tool_choice: "any" (C) guarantees a tool call but doesn\'t specify which one. Tool array ordering (D) has no effect on tool selection.',
    refs: [
      { label: 'Tool use — tool_choice', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use' },
    ],
  },
  {
    id: 130, domain: 4, tier: 'intermediate',
    text: 'You are extracting information from legal contracts. Some contracts contain penalty clauses with specific dollar amounts; others don\'t mention penalties at all. Your extraction schema has a penalty_amount field. What is the correct way to define this field to prevent hallucination?',
    options: [
      'Define penalty_amount as a required string field with a default value of "N/A"',
      'Omit penalty_amount from the schema and use a free-text notes field instead',
      'Add an instruction: "If penalty_amount is not mentioned, set the value to 0"',
      'Define penalty_amount as optional (nullable) so null signals genuine absence',
    ],
    correct: 3,
    explanation:
      'Required fields create pressure on the model to produce a value even when none exists in the source document — leading to hallucinated data. Making penalty_amount optional (nullable) allows the model to return null when no penalty clause is present, which correctly signals absence rather than fabricating a value. Setting a default of "N/A" (A) is a string, not a sentinel for absence, and may be confused with actual contract text. A free-text notes field (C) loses structure. Defaulting to 0 (D) fabricates a value that may be mistaken for a real contract amount.',
    refs: [
      { label: 'Structured output with tool use', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use' },
    ],
  },
  {
    id: 131, domain: 4, tier: 'intermediate',
    text: 'Your extraction pipeline produces a result where line_items sum to $1,250 but the stated_total field is $1,200. Schema validation passes because both fields are present and correctly typed, but the values are semantically inconsistent. What is the correct approach for handling this in a retry loop?',
    options: [
      'Send the original document with the failed extraction and the specific semantic error for re-extraction',
      'Accept the output without further checks — schema validation passed, so the extraction is considered correct by the pipeline',
      'Set stated_total = sum(line_items) programmatically before passing it downstream',
      'Retry the same request three times and use the most common value for stated_total',
    ],
    correct: 0,
    explanation:
      'Semantic validation errors (inconsistent values) require retry-with-error-feedback: include the original document, the failed extraction, and a precise description of the error. The model can then re-examine the source document to determine whether stated_total or line_items is wrong. Option A is wrong — schema validity doesn\'t imply semantic correctness. Option C silently picks an answer without checking which value is correct in the source. Option D retries the same context without feedback, which rarely fixes semantic errors.',
    refs: [
      { label: 'Validation and retry patterns', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use' },
    ],
  },
  {
    id: 132, domain: 4, tier: 'advanced',
    text: 'Your extraction pipeline retries failed extractions up to 5 times. For a batch of 200 contracts, 30 contracts fail validation on every retry. Investigation shows these 30 contracts reference an addendum document ("Exhibit A") that was not included in the original document set. What should you conclude about the retries?',
    options: [
      'Increase the retry limit to 10 — 5 retries may not be enough for complex documents',
      'Retries are ineffective when required information is absent from the source document; these 30 contracts need the missing Exhibit A documents, not more retries',
      'Change the retry strategy to use a higher temperature on each retry to encourage the model to try different extraction approaches',
      'Add a fallback that extracts whatever is available and marks the missing fields as "pending"',
    ],
    correct: 1,
    explanation:
      'Retry-with-error-feedback is effective for format mismatches and structural errors — cases where the information exists but the model extracted it incorrectly. When required information is simply absent from the source document (the addendum exists but wasn\'t provided), no number of retries will help. The model cannot extract what isn\'t there. The correct resolution is to obtain the missing Exhibit A documents and reprocess. More retries (A) waste API calls. Higher temperature (C) increases randomness, making hallucination more likely. Option D produces incomplete data that may be misinterpreted downstream.',
    refs: [
      { label: 'Validation and retry patterns', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use' },
    ],
  },
  {
    id: 133, domain: 4, tier: 'intermediate',
    text: 'A team generates code with Claude and then uses the same Claude session to review that code for bugs. The review consistently misses subtle logical errors — issues that human reviewers catch immediately. What is the most likely explanation and best fix?',
    options: [
      'The model is running out of context space; the fix is to use /compact before the code review step',
      'The generating session retains reasoning context, making it less likely to question itself',
      'The same model cannot both generate and review code — use a different model instead',
      'Add a "be critical" system prompt instruction to Claude before starting the review',
    ],
    correct: 1,
    explanation:
      'Self-review in the same session is a known limitation: the model retains reasoning context from generation and is less likely to question its own decisions. This is not a model capability issue — it\'s a context contamination issue. An independent review instance (fresh session without the generation context) is substantially more effective at catching subtle issues. This is equivalent to the human practice of having code reviewed by someone who didn\'t write it. /compact (A) reduces tokens but doesn\'t remove the reasoning context. Different model (C) may help but misidentifies the root cause. System prompt instructions (D) are probabilistic and don\'t address context contamination.',
    refs: [
      { label: 'Multi-instance review patterns', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/orchestration' },
    ],
  },
  {
    id: 134, domain: 5, tier: 'intermediate',
    text: 'Your agent processes a 200-page research report, extracting findings from each section. After processing, the agent\'s synthesis consistently omits findings from sections 60–140 but reliably includes content from the first 30 pages and the final 20 pages. What is the root cause and correct fix?',
    options: [
      'Context window is too small; switch to a model with a larger context window to fit the full document',
      'Extraction prompt is too general; add instructions targeting sections 60-140',
      'Lost-in-the-middle effect — use per-section passes with a separate integration pass',
      'Token limits are hit mid-document; implement chunking to process in segments',
    ],
    correct: 2,
    explanation:
      'The pattern (reliable at beginning and end, gaps in the middle) is the hallmark of the "lost in the middle" effect — a well-documented phenomenon where models attend reliably to the start and end of long contexts but give less attention to middle content. The fix has two components: (1) place key findings summaries at the beginning of aggregated inputs, and (2) use per-section passes (each section gets its own focused context window) with a separate integration pass over all summaries. A larger context window (A) does not fix attention distribution — it just moves the diluted zone.',
    refs: [
      { label: 'Context management patterns', url: 'https://docs.anthropic.com/en/docs/build-with-claude/context-windows' },
    ],
  },
  {
    id: 135, domain: 5, tier: 'advanced',
    text: 'A customer support agent handles multi-turn conversations about billing disputes. After 15+ turns, the agent starts misremembering the exact disputed amount — stating "$43" instead of the customer\'s stated "$43.27" — and loses track of which charges the customer already confirmed. What is the most robust architectural fix?',
    options: [
      'Use /compact to summarize the conversation before it gets long',
      'Increase max_tokens so the full conversation fits in a single prompt',
      'Extract transactional facts (disputed amount, confirmed charges, account ID, timestamps) into a persistent "case facts" block that is included verbatim in every subsequent prompt, outside the summarized conversation history',
      'Ask the customer to restate the disputed amount at the start of each turn',
    ],
    correct: 2,
    explanation:
      'Progressive summarization loses precision on numerical values — "$43.27" becomes "$43" or "approximately $40." The fix is to extract transactional facts into a dedicated persistent block that bypasses summarization: amounts, dates, order numbers, statuses are stored structurally and injected verbatim into every prompt. The conversation history can be compressed but the fact block remains accurate. /compact (A) worsens the problem by further compressing numerical details. More tokens (B) delays but doesn\'t solve the problem. Re-asking customers (D) is a bad user experience and doesn\'t scale.',
    refs: [
      { label: 'Context management patterns', url: 'https://docs.anthropic.com/en/docs/build-with-claude/context-windows' },
    ],
  },
  {
    id: 136, domain: 5, tier: 'intermediate',
    text: 'A customer contacts your support agent asking for a price match against a competitor. Your policy document covers price matching against your own historical prices but is completely silent on competitor price matching. The agent has the tools and authority to apply discounts. What should the agent do?',
    options: [
      'Apply the largest standard discount available as a goodwill gesture to retain',
      'Deny the request since the policy doesn\'t explicitly authorize competitor matching',
      'Ask the customer for proof of the competitor\'s price and then match autonomously',
      'Escalate to a human — policy gaps are a canonical escalation trigger for agents',
    ],
    correct: 3,
    explanation:
      'Policy gaps — situations where policy is ambiguous or silent on the customer\'s specific request — are a canonical escalation trigger, distinct from technical complexity. The agent should not apply discounts it\'s not authorized for (A), nor deny valid requests it\'s not authorized to deny (B), nor autonomously interpret a silent policy (D). When policy is silent, a human must make the call. This is a reliability principle: agents should escalate uncertainty about authorization, not make autonomous decisions that extend their authority.',
    refs: [
      { label: 'Escalation patterns', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/human-in-the-loop' },
    ],
  },
  {
    id: 137, domain: 5, tier: 'basic',
    text: 'A customer interacting with your support agent says: "I don\'t want to deal with a bot. Please connect me to a real person right now." The case involves a routine order status inquiry that the agent can easily resolve. What should the agent do?',
    options: [
      'Honor the request immediately and escalate to a human agent without attempting resolution',
      'Resolve the order status inquiry first since it is simple, then offer to connect to a human',
      'Explain that a human agent isn\'t available right now and attempt autonomous resolution',
      'Ask the customer to confirm their preference for a human before escalating the case',
    ],
    correct: 0,
    explanation:
      'Explicit customer requests for a human agent must be honored immediately, regardless of case complexity. The agent should not first attempt resolution — even on a simple case — when the customer has clearly stated their preference. Attempting to resolve first (A) ignores the customer\'s stated preference and damages trust. Saying a human isn\'t available (B) is deceptive if one is. Asking the customer to confirm (D) adds friction to an already expressed preference. The rule is: explicit human request = immediate escalation, no investigation first.',
    refs: [
      { label: 'Escalation patterns', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/human-in-the-loop' },
    ],
  },
  {
    id: 138, domain: 5, tier: 'intermediate',
    text: 'An agent has been exploring a large legacy codebase for 2 hours. You notice it starting to give inconsistent answers — referencing "the typical pattern in this codebase" rather than specific classes it found earlier, and suggesting approaches it already ruled out 30 minutes ago. What is happening and what is the fix?',
    options: [
      'The model is confused by the complexity of the codebase; restart with a cleaner system prompt setup',
      'Context degradation — use a scratchpad file for key findings plus /compact to reduce',
      'The agent is hitting rate limits causing inconsistent responses; add retry logic',
      'This is normal for large codebases; use a model with a larger context window size',
    ],
    correct: 1,
    explanation:
      'Context degradation is a documented pattern in extended sessions: as the context window fills with verbose tool results, the model loses reliable access to earlier specific findings and falls back on generic knowledge. The fix combines two techniques: (1) maintain a scratchpad file where the agent records key findings (class names, entry points, patterns) after each major discovery, referencing it for subsequent questions; and (2) use /compact to reduce context usage by condensing verbose tool output. Restarting (A) loses all progress. Rate limits (C) cause errors, not inconsistency. A larger context window (D) delays but doesn\'t solve context degradation.',
    refs: [
      { label: 'Context management in long sessions', url: 'https://docs.anthropic.com/en/docs/build-with-claude/context-windows' },
    ],
  },
  {
    id: 139, domain: 5, tier: 'advanced',
    text: 'Your data extraction pipeline achieves 97% overall accuracy across 10,000 documents. Based on this, your team decides to stop human review for all extractions with model confidence > 0.9. Three months later, you discover a systematic 40% error rate on one document type (scanned PDFs with handwritten annotations) that represents 8% of your volume. What went wrong?',
    options: [
      'The confidence threshold was set too high; lowering it to 0.8 would have caught more errors',
      'Overall accuracy metrics can mask poor performance on specific document types or fields; stratified analysis by document type and field should have been done before automating high-confidence extractions',
      'The 97% accuracy was calculated on a biased sample; use random sampling next time',
      'Confidence scores above 0.9 are inherently unreliable; use a different metric',
    ],
    correct: 1,
    explanation:
      'Aggregate accuracy metrics hide segment-level failures. 97% overall accuracy could coexist with 40% error on a specific document type if that type is a small fraction of volume — the high performance on the majority papers over the minority failures. The correct approach is stratified analysis: measure accuracy by document type, field, and other segments before reducing human review. Confidence threshold (A) doesn\'t address the root cause — the model was also highly confident on the scanned PDFs it got wrong. Sampling bias (C) is not the issue. Confidence score reliability (D) misidentifies the problem.',
    refs: [
      { label: 'Human review and confidence calibration', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/human-in-the-loop' },
    ],
  },
  {
    id: 140, domain: 5, tier: 'advanced',
    text: 'A multi-agent research pipeline has a web search agent and a document analysis agent that both find statistics on AI adoption rates. The web search agent finds "34% of enterprises have deployed AI in production" (McKinsey 2024). The document analysis agent finds "67% of enterprises have deployed AI in production" (Gartner 2024). Both sources are credible. How should the synthesis agent handle this?',
    options: [
      'Use the more recent source and discard the older one',
      'Average the two values: report "~50% of enterprises have deployed AI in production"',
      'Pick the more conservative estimate to avoid overstating adoption',
      'Report both values with their source attributions and explicitly annotate the conflict, preserving both for the final report to distinguish contested from well-established findings',
    ],
    correct: 3,
    explanation:
      'When credible sources conflict, the synthesis agent must not arbitrarily select one value, average them, or suppress the conflict. The correct approach is to annotate the conflict: include both values with their source attributions (McKinsey vs Gartner, 2024), note the discrepancy, and structure the final report to distinguish well-established findings from contested ones. This preserves information provenance and lets readers understand the uncertainty rather than presenting a false consensus. Arbitrarily selecting recency (A), averaging (B), or conservatism (C) all destroy information and misrepresent the evidence.',
    refs: [
      { label: 'Information provenance and synthesis', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/orchestration' },
    ],
  },

  // ─── DOMAIN 1 — new gap-fill questions ───────────────────────────────────

  {
    id: 141, domain: 1, tier: 'advanced',
    text: 'A multi-phase coordinator agent crashes after completing phase 2 of a 4-phase research pipeline. The pipeline must resume without restarting from the beginning. Which architecture enables reliable crash recovery?',
    options: [
      'Rely on `--resume` to reload the conversation history and infer progress from prior messages',
      'Implement session checkpointing with `fork_session` at the end of each phase',
      'Have each phase export a structured state manifest (completed work, partial results, next phase inputs) to a known location, and have the coordinator load that manifest on startup to determine where to resume',
      'Configure the coordinator with a high `max_tokens` budget so phases are less likely to be interrupted',
    ],
    correct: 2,
    explanation: '`--resume` reloads conversation history but cannot recover in-progress subagent state or structured phase outputs — it tells you what was discussed, not what was computed. `fork_session` creates a branch of the conversation but also does not persist phase outputs across crashes. The correct pattern is structured state exports: at the end of each phase, the coordinator writes a manifest (phase number, completed agent outputs, next-phase inputs) to a known file location. On startup, the coordinator reads the manifest to determine the last completed phase and continues from there. High `max_tokens` budgets (D) affect generation length, not crash recovery.',
    refs: [
      { label: 'Agent state persistence', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/orchestration' },
      { label: 'Claude Code --resume flag', url: 'https://docs.anthropic.com/en/docs/claude-code/cli-reference' },
    ],
  },
  {
    id: 142, domain: 1, tier: 'advanced',
    text: 'A coordinator agent needs to inventory all files matching a complex pattern across a large monorepo before deciding which ones to process. This discovery step generates thousands of lines of tool output. What is the recommended approach to prevent this verbose output from exhausting the coordinator\'s context budget?',
    options: [
      'Increase the coordinator\'s context window by switching to a model with a larger context limit',
      'Have the coordinator run the discovery tools directly and use /compact after each batch',
      'Spawn a dedicated Explore subagent to perform the discovery; the subagent\'s verbose tool results accumulate in its own isolated context and only a structured summary is returned to the coordinator',
      'Run the discovery step synchronously before starting the agentic loop so output does not enter the conversation history',
    ],
    correct: 2,
    explanation: 'The Explore subagent pattern exists specifically for this problem: verbose discovery work runs inside the subagent\'s isolated context window. The coordinator only receives the structured summary (e.g., a list of matching file paths and their purposes) — not the raw tool output that generated it. This keeps the coordinator\'s context clean for high-level orchestration. Switching to a larger context model (A) delays but does not prevent exhaustion. /compact (B) compresses history but loses detail the coordinator may need later. Running discovery before the loop (D) still produces output that must live somewhere — it does not avoid the accumulation problem.',
    refs: [
      { label: 'Subagents and context isolation', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/orchestration' },
      { label: 'Agent SDK — Task tool', url: 'https://docs.anthropic.com/en/docs/agent-sdk/task-tool' },
    ],
  },

  // ─── DOMAIN 2 — new gap-fill questions ───────────────────────────────────

  {
    id: 143, domain: 2, tier: 'basic',
    text: 'In the Model Context Protocol, what is the difference between an MCP Resource and an MCP Tool?',
    options: [
      'Resources are faster than Tools because they skip the server round-trip and resolve content locally',
      'Resources are defined in `.mcp.json` while Tools are defined in prompts',
      'Resources expose content catalogs for browsing; Tools expose parameterized operations',
      'Resources are read-only versions of Tools with otherwise identical functionality',
    ],
    correct: 2,
    explanation: 'MCP Resources and MCP Tools serve distinct purposes. A Resource is a content catalog entry — it tells the agent what data exists (e.g., a list of issue summaries, documentation pages, database schema) so the agent can choose what to request without making blind exploratory tool calls. A Tool is an operation: it takes parameters, executes logic, and returns results. By browsing Resources first, an agent avoids calling a tool with wrong parameters or fetching documents it does not need. Options A, C, and D conflate or misrepresent these distinct concepts.',
    refs: [
      { label: 'MCP — Resources', url: 'https://docs.anthropic.com/en/docs/build-with-claude/mcp' },
      { label: 'MCP concepts overview', url: 'https://modelcontextprotocol.io/docs/concepts/resources' },
    ],
  },
  {
    id: 144, domain: 2, tier: 'intermediate',
    text: 'Your team needs to integrate Claude Code with Jira to let agents create and update tickets. A developer proposes building a custom MCP server for Jira. What is the recommended approach?',
    options: [
      'Build a custom MCP server to have full control over the Jira API surface and schema exposed',
      'Connect directly to the Jira REST API via a generic `fetch_url` tool instead',
      'Embed Jira credentials in the system prompt and use built-in web fetch tool',
      'Use the existing community MCP server; reserve custom builds for unique needs',
    ],
    correct: 3,
    explanation: 'For standard integrations like Jira, GitHub, or Slack, the MCP ecosystem has community servers that are already built, tested, and maintained. Using an existing community server eliminates engineering overhead and gets the integration working immediately. Custom MCP servers should be reserved for workflows that are genuinely team-specific — internal databases, proprietary APIs, or unusual tool compositions that have no existing solution. A generic `fetch_url` tool (C) bypasses the structured, purpose-built capabilities of an MCP server. Embedding credentials in the system prompt (D) is a security anti-pattern.',
    refs: [
      { label: 'MCP server ecosystem', url: 'https://docs.anthropic.com/en/docs/build-with-claude/mcp' },
      { label: 'Claude Code MCP configuration', url: 'https://docs.anthropic.com/en/docs/claude-code/mcp' },
    ],
  },
  {
    id: 145, domain: 2, tier: 'intermediate',
    text: 'You add a powerful `semantic_search_codebase` MCP tool that outperforms Grep for conceptual queries across a large monorepo. However, you observe that Claude consistently uses Grep instead. What is the most likely cause and fix?',
    options: [
      'The tool description is too vague — rewrite it to explain when it outperforms Grep',
      'The MCP server has higher latency than Grep; reduce server response time to make it competitive',
      'Claude always prefers built-in tools over MCP tools; this cannot be changed',
      'Add a system prompt instruction: "always use semantic_search_codebase instead"',
    ],
    correct: 0,
    explanation: 'Claude selects tools based on their descriptions. If `semantic_search_codebase` has a generic description like "search the codebase", Claude has no basis for preferring it over Grep, which it already understands well. The fix is to write a description that explains the tool\'s unique capabilities: "Use this tool for conceptual or semantic queries where you need to find code related to a concept, pattern, or intent — not just a literal string. More accurate than Grep for queries like \'authentication middleware\' or \'payment processing logic\'." Latency (A) is not the cause here. Claude does not unconditionally prefer built-in tools (B). A system prompt instruction (D) is fragile compared to a well-written description.',
    refs: [
      { label: 'Tool descriptions and selection', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use/tool-use-best-practices' },
    ],
  },

  // ─── DOMAIN 3 — new gap-fill questions ───────────────────────────────────

  {
    id: 146, domain: 3, tier: 'basic',
    text: 'A team member reports that Claude Code is not applying the project\'s CLAUDE.md rules — it seems to ignore certain conventions that should be loaded. What is the first diagnostic step?',
    options: [
      'Delete and re-create the CLAUDE.md file from scratch, as it may have been corrupted or malformed',
      'Run `/memory` to verify which memory files are actually loaded in the session',
      'Check the file permissions on CLAUDE.md to ensure Claude Code can read it',
      'Add the rules to the system prompt in `docusaurus.config.ts` as a fallback',
    ],
    correct: 1,
    explanation: 'The `/memory` command displays all memory files currently loaded in the session, including which CLAUDE.md files are active and from which directories. This is the direct way to verify whether the expected CLAUDE.md is being found and loaded — before spending time debugging the file\'s contents. Common causes for missing CLAUDE.md: the file is in the wrong directory, the session was started from a different working directory, or there is a typo in the filename. Deleting and recreating (A) destroys content unnecessarily. File permissions (C) are rarely the issue on developer machines. Modifying project config files (D) is not how Claude Code memory works.',
    refs: [
      { label: 'Claude Code memory and CLAUDE.md', url: 'https://docs.anthropic.com/en/docs/claude-code/memory' },
      { label: 'Claude Code slash commands', url: 'https://docs.anthropic.com/en/docs/claude-code/slash-commands' },
    ],
  },
  {
    id: 147, domain: 3, tier: 'intermediate',
    text: 'You want a Claude Code CI step to produce structured security findings that a downstream script can parse and post as inline PR comments via the GitHub API. Which CLI flag combination achieves this?',
    options: [
      '`-p` (non-interactive) combined with `--format structured` output flag',
      '`--silent` combined with `--export findings.json` after the run completes',
      '`--output-format json` combined with `--json-schema <schema-file>` for shape',
      'Pipe stdout through `jq` to extract JSON from Claude\'s natural-language prose responses',
    ],
    correct: 2,
    explanation: '`--output-format json` tells Claude Code to emit structured JSON output instead of Markdown prose. Combined with `--json-schema <schema-file>`, it enforces a specific JSON shape so the downstream script can reliably parse fields like `file`, `line`, `severity`, and `message` to construct inline PR comments. `-p` makes the session non-interactive but does not control output format. `--silent` and `--export` are not valid Claude Code flags. Piping through `jq` (D) is fragile because it depends on Claude embedding valid JSON in free-form text, which is not guaranteed.',
    refs: [
      { label: 'Claude Code CLI reference', url: 'https://docs.anthropic.com/en/docs/claude-code/cli-reference' },
      { label: 'Claude Code CI/CD integration', url: 'https://docs.anthropic.com/en/docs/claude-code/github-actions' },
    ],
  },
  {
    id: 148, domain: 3, tier: 'advanced',
    text: 'Your CI pipeline runs a Claude Code review on every push to a PR. Developers complain that each new push generates duplicate comments about issues that were already reported on a previous push and have not been fixed yet. How do you fix this?',
    options: [
      'Switch from per-push triggers to a scheduled nightly review to reduce comment frequency',
      'Deduplicate comments in the GitHub API layer by comparing new comments against existing ones before posting',
      'Include the prior review findings in the context for each new run and instruct Claude to report only issues that are new or still unaddressed since the last review',
      'Reduce the review scope to only the diff of each push, not the full file',
    ],
    correct: 2,
    explanation: 'The root cause is stateless review: each run has no knowledge of what was already reported. The fix is to inject context: retrieve the findings from the previous review run (stored as a file or fetched from the PR comments), include them in the prompt for the current run, and instruct Claude to report only issues that are either new or still unresolved. This requires Claude to distinguish between "this issue was reported in the prior run and is still present" versus "this is a new issue introduced since the last review." A nightly schedule (A) reduces frequency but does not eliminate duplicates. GitHub API deduplication (B) is a workaround that does not leverage Claude\'s reasoning. Diff-only review (D) misses regressions in unchanged code.',
    refs: [
      { label: 'Claude Code CI/CD integration', url: 'https://docs.anthropic.com/en/docs/claude-code/github-actions' },
    ],
  },
  {
    id: 149, domain: 3, tier: 'intermediate',
    text: 'You ask Claude Code to implement a complex data transformation function. After three iterations, the output still has subtle edge case bugs that are hard to describe in prose. What iteration strategy will most reliably converge on a correct implementation?',
    options: [
      'Add more detailed prose descriptions of each edge case in follow-up messages',
      'Switch to a more capable model mid-session for the remaining iteration passes',
      'Use plan mode to have Claude design the algorithm approach before implementing any code',
      'Write tests first, then iterate by sharing actual test failure output with Claude',
    ],
    correct: 3,
    explanation: 'Test-driven iteration is the most reliable convergence strategy for complex implementations. Writing tests first gives Claude an objective, executable specification — instead of prose descriptions that can be ambiguous, the failing test output (exact assertion, expected vs. actual values, stack trace) provides precise, machine-generated feedback. Claude can reason about the specific failure and make targeted corrections. Repeated prose descriptions (A) remain ambiguous and lead to the same misinterpretations. Switching models mid-session (B) does not address the root cause. Plan mode (D) helps with design but does not replace test feedback for implementation correctness.',
    refs: [
      { label: 'Claude Code iterative development', url: 'https://docs.anthropic.com/en/docs/claude-code/best-practices' },
    ],
  },
  {
    id: 150, domain: 3, tier: 'intermediate',
    text: 'You ask Claude Code to generate test cases for a module that already has a 200-line test file with 40 tests. The generated tests are mostly duplicates of existing coverage. What is the fix?',
    options: [
      'Include the existing test file so Claude sees what is already covered and fills gaps',
      'Ask Claude to generate tests for "uncovered paths only" in the task prompt text without providing code',
      'Generate tests in a fresh session with no prior context to avoid anchoring bias',
      'Use a coverage report to identify uncovered lines and paste those into the prompt',
    ],
    correct: 0,
    explanation: 'When generating tests without access to existing test files, Claude defaults to testing the most obvious behaviors — which are typically already covered. Providing the existing test file as context gives Claude visibility into what is already tested, allowing it to reason about gaps: uncovered edge cases, error paths, boundary conditions, and interaction scenarios. Option A\'s prose instruction helps but is less precise than actual test code. A fresh session (C) makes the duplication problem worse, not better. Pasting uncovered lines (D) provides implementation context but not test coverage context — Claude still does not know what was already tested.',
    refs: [
      { label: 'Claude Code context management', url: 'https://docs.anthropic.com/en/docs/claude-code/best-practices' },
    ],
  },
  {
    id: 151, domain: 3, tier: 'intermediate',
    text: 'During a debugging session, you identify two bugs: Bug A causes incorrect tax calculation in the checkout module, and Bug B causes a display error in the order history page. These modules share no code. How should you structure your messages to Claude Code?',
    options: [
      'Send both bugs in a single detailed message so Claude considers any potential code interactions',
      'Fix Bug A first, review the diff, then send Bug B — sequential gives clean attribution',
      'Create a new session for each bug to ensure completely clean isolated context',
      'Send Bug B first since display bugs are simpler, then tackle Bug A afterward',
    ],
    correct: 1,
    explanation: 'When bugs are independent (no shared code, no interacting fixes), sequential iteration is preferred. Fixing one bug per message keeps the diff small and attributable — you can review exactly what changed for Bug A before introducing Bug B\'s changes. If bugs interact (e.g., both stem from a shared data model), they should be sent together so Claude can design a unified fix. In this case, the checkout module and order history page share no code, so there is no interaction risk, and sequential messages provide the cleaner workflow.',
    refs: [
      { label: 'Claude Code best practices', url: 'https://docs.anthropic.com/en/docs/claude-code/best-practices' },
    ],
  },

  // ─── DOMAIN 4 — new gap-fill questions ───────────────────────────────────

  {
    id: 152, domain: 4, tier: 'intermediate',
    text: 'You are designing a JSON schema for a medical claims classification pipeline. The category field must be one of a predefined list, but new claim types occasionally appear that do not fit any category. What schema pattern prevents hallucinated category values while keeping the pipeline extensible?',
    options: [
      'Use a free-text `category` string field so the model can describe any claim type in its own words',
      'Make `category` a required enum and retrain the model when new types appear',
      'Add an `"other"` enum value with a companion `category_detail` field for specifics',
      'Use a category array so the model can select multiple values when one won\'t fit',
    ],
    correct: 2,
    explanation: 'A free-text field (A) removes the guarantee of controlled vocabulary — the model will produce different strings for the same concept across runs. A pure enum without a catch-all (C) forces the model to pick the nearest wrong category rather than admitting the case does not fit, degrading accuracy. A multi-select array (D) changes the semantics of the field. The correct pattern is `enum: ["medical", "dental", "pharmacy", "other"]` paired with `category_detail: string | null` — populated only when `category === "other"`. This preserves controlled vocabulary for known types, enables downstream filtering and aggregation, and gives a structured escape hatch for novel cases that surfaces them for human review without hallucinating a false category.',
    refs: [
      { label: 'Structured output schema design', url: 'https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs' },
    ],
  },
  {
    id: 153, domain: 4, tier: 'advanced',
    text: 'Your code review pipeline produces structured findings that developers frequently dismiss as false positives. You want to systematically improve the pipeline\'s precision over time. Which schema addition enables this analysis?',
    options: [
      'Add a `severity: "critical" | "high" | "medium" | "low"` field to filter out low-severity findings before display',
      'Add a `detected_pattern` field to each finding that names the code construct that triggered the finding (e.g., `"eval_in_userland"`, `"unvalidated_redirect"`); when developers dismiss findings, analyze which patterns are dismissed most frequently to identify false positive candidates',
      'Add a `model_confidence: number` field and only show findings where confidence > 0.8',
      'Add a `fix_suggestion: string` field so developers can accept the fix with one click instead of dismissing',
    ],
    correct: 1,
    explanation: 'The `detected_pattern` field instruments findings with the code construct that triggered them. When developers dismiss a finding, that pattern name is logged. Over time, patterns that are dismissed at high rates (e.g., 80% of `"eval_in_userland"` findings are dismissed in this codebase) are identified as false positive candidates for prompt tuning or rule exclusion. Severity filtering (A) reduces noise but does not provide signal for improvement. Model confidence scores (C) are poorly calibrated — high confidence does not correlate reliably with correctness. Fix suggestions (D) improve developer experience but do not help identify systematic false positive patterns.',
    refs: [
      { label: 'Structured output for analysis pipelines', url: 'https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs' },
    ],
  },
  {
    id: 154, domain: 4, tier: 'advanced',
    text: 'Your document processing pipeline must return results within 30 hours of document receipt. You plan to use the Message Batches API (24-hour processing window). What is the maximum allowable time between document receipt and batch submission to guarantee the 30-hour SLA?',
    options: [
      '12 hours — leave buffer on both sides of the 24-hour window',
      '24 hours — the batch window starts after submission so documents can wait a full day',
      '6 hours — SLA (30h) minus the maximum batch processing time (24h) leaves 6 hours for pre-submission queuing',
      'There is no safe window; the Batches API cannot guarantee a 30-hour SLA',
    ],
    correct: 2,
    explanation: 'The calculation is straightforward: SLA deadline (30h) − maximum batch processing time (24h) = maximum pre-submission delay (6h). Documents must be submitted to a batch within 6 hours of receipt to guarantee that even a worst-case 24-hour processing window still meets the 30-hour SLA. Leaving 12 hours (A) is unnecessarily conservative — documents received 7-12 hours ago would be rejected when they could safely be included. Waiting 24 hours (B) guarantees SLA violations for documents that take the full 24-hour processing window. Option D is incorrect — the Batches API can meet this SLA if submission timing is managed.',
    refs: [
      { label: 'Message Batches API', url: 'https://docs.anthropic.com/en/docs/build-with-claude/message-batches' },
    ],
  },
  {
    id: 155, domain: 4, tier: 'advanced',
    text: 'Your structured data extraction pipeline outputs a confidence score alongside each extracted field. A teammate argues these per-field confidence scores should never be used to route review decisions because "model confidence scores are unreliable." How do you respond?',
    options: [
      'Agree — self-reported confidence scores are always unreliable and should be removed from the schema',
      'Per-field confidence scores can be a valid routing signal when calibrated against a labeled validation set: measure what confidence threshold corresponds to acceptable accuracy on labeled data, then route fields below that threshold to human review',
      'Use the scores only for fields that are not critical to downstream decisions',
      'Replace confidence scores with a binary `is_certain: boolean` flag to avoid the calibration problem',
    ],
    correct: 1,
    explanation: 'The distinction is calibration. Raw, uncalibrated confidence scores correlate poorly with accuracy — models can be highly confident on wrong extractions. However, when you build a labeled validation set (e.g., 500 manually verified extractions), measure actual accuracy at each confidence level, and find that confidence > 0.87 corresponds to 95% accuracy in your specific domain, you have a calibrated threshold. Fields below that threshold are routed to human review. This is different from using raw confidence as a blanket routing signal (the anti-pattern) — it is an empirically validated threshold specific to your pipeline. Removing confidence scores entirely (A) discards a useful signal. Binary flags (D) are less informative.',
    refs: [
      { label: 'Human review and confidence calibration', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/human-in-the-loop' },
      { label: 'Structured output patterns', url: 'https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs' },
    ],
  },

  // ─── DOMAIN 5 — new gap-fill questions ───────────────────────────────────

  {
    id: 156, domain: 5, tier: 'intermediate',
    text: 'A customer support agent calls `lookup_customer("Smith")` and receives three matching records: John Smith (account #1001), Jane Smith (#1002), and Robert Smith (#1003). What should the agent do?',
    options: [
      'Select the most recently active account as it is most likely the caller',
      'Select the first match returned by the lookup tool as the default result',
      'Process the request for all three accounts simultaneously to cover all bases',
      'Ask the customer for an additional identifier like email or order number',
    ],
    correct: 3,
    explanation: 'When a lookup returns multiple matches, heuristic selection (most recent, first result) risks performing actions on the wrong customer account — applying a refund, updating contact info, or canceling an order for the wrong person. The correct pattern is to ask the customer for a disambiguating identifier that is unique to their account: email, order number, or a card\'s last 4 digits. This is a deterministic resolution that avoids both heuristic errors and the impracticality of processing all matching accounts. Processing all three accounts (D) would be incorrect and potentially harmful.',
    refs: [
      { label: 'Agentic systems — human in the loop', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/human-in-the-loop' },
    ],
  },
  {
    id: 157, domain: 5, tier: 'intermediate',
    text: 'A customer says: "This is absolutely unacceptable! I\'ve been waiting three weeks for a refund and nobody has helped me!" They have not asked to speak to a human. The agent can verify the refund status and initiate a resolution. What should the agent do?',
    options: [
      'Acknowledge frustration, investigate the refund status, and offer a resolution',
      'Immediately escalate to a human agent because the customer sounds frustrated',
      'Apologize for the delay and close the ticket, asking them to call support instead',
      'Ask the customer to rate their frustration level on a scale of 1-10 first',
    ],
    correct: 0,
    explanation: 'Frustration alone is not an escalation trigger. The escalation rule is: explicit request for a human = immediate escalation; frustration without an explicit request = acknowledge and attempt resolution. In this case, the agent should validate the customer\'s experience ("I understand how frustrating a three-week wait is") and then address the underlying issue — verifying the refund status and initiating resolution if possible. Immediate escalation on frustration alone (A) ignores cases the agent can and should handle. Deflecting to a phone line (C) abandons the customer. Asking them to rate frustration (D) adds friction without value.',
    refs: [
      { label: 'Escalation and handoff patterns', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/human-in-the-loop' },
    ],
  },
  {
    id: 158, domain: 5, tier: 'advanced',
    text: 'A multi-agent research system has a web search subagent and a document analysis subagent. Both return statistics on cloud adoption rates. The web search agent returns "48% of enterprises use cloud" from a 2021 report. The document analysis agent returns "81% of enterprises use cloud" from a 2024 report. The synthesis agent flags this as a conflict. What is the correct interpretation and what schema change prevents this misclassification?',
    options: [
      'This is a genuine conflict; annotate it as contested data and present both values without interpretation',
      'The 2024 value supersedes the 2021 value; discard the older finding',
      'These values represent the same metric at different points in time — a time series, not a conflict. Requiring subagents to include a `publication_date` or `data_collection_date` field in structured outputs enables the synthesis agent to correctly interpret temporal differences rather than treating them as source conflicts',
      'Average the two values to produce a best estimate of current adoption',
    ],
    correct: 2,
    explanation: 'The same metric measured at different times is a time series, not a contradiction. Cloud adoption rising from 48% in 2021 to 81% in 2024 is entirely plausible. Without timestamps in the structured output, the synthesis agent has no way to distinguish "two sources disagree" from "the same metric changed over time." The fix is schema-level: require each subagent\'s structured output to include a `publication_date` or `data_collection_date` field. With dates, the synthesis agent can correctly interpret the values as a temporal progression and present them as a trend. Treating it as a conflict (A) misrepresents the data. Discarding the older value (B) loses valid historical context.',
    refs: [
      { label: 'Multi-agent synthesis patterns', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/orchestration' },
      { label: 'Structured output design', url: 'https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs' },
    ],
  },

  // ─── EXTRACTED FROM combined_unique_exam_questions 4.md ──────────────────

  {
    id: 159, domain: 4, tier: 'exam',
    scenario: 'Your team uses Claude Code in a CI/CD pipeline for automated code quality, security, and testing tasks. You need to balance cost optimization against developer experience constraints across workflows with different latency requirements.',
    text: 'Your CI/CD system performs three types of Claude-powered analysis: (1) quick style checks on each PR that block merging until complete, (2) comprehensive security audits of the entire codebase run weekly, and (3) test case generation triggered nightly for recently-modified modules. The Message Batches API offers 50% cost savings but can take up to 24 hours to process. You want to optimize API costs while maintaining acceptable developer experience. Which combination correctly matches each task to its API approach?',
    options: [
      'Use synchronous calls for PR style checks and nightly test generation; use Message Batches API only for weekly security audits.',
      'Use the Message Batches API for all three tasks to maximize the 50% cost savings, and configure the pipeline to poll for batch completion.',
      'Use synchronous calls for all three tasks for consistent response times, and rely on prompt caching to reduce costs across all workloads.',
      'Use synchronous calls for PR style checks; use the Message Batches API for weekly security audits and nightly test generation.',
    ],
    correct: 3,
    explanation: 'PR style checks block developers from merging and require immediate responses — they must use synchronous calls. Weekly security audits and nightly test generation are scheduled tasks with flexible timelines: they already run asynchronously and can easily tolerate the up-to-24-hour batch processing window. Using the Batches API for both scheduled workflows captures the 50% cost savings on the two highest-volume workloads without degrading developer experience. Option A incorrectly uses sync for nightly test generation, missing cost savings. Option B would make PR style checks unusable. Option C foregoes all batch savings.',
    wrongExplanations: [
      'Incorrect: nightly test generation is a scheduled, latency-tolerant task — identical to the security audit in its batch-compatibility. Using sync for it wastes 50% cost savings with no benefit.',
      'Incorrect: PR style checks block merging — developers cannot wait up to 24 hours. Batching them would halt the development workflow entirely.',
      'Incorrect: prompt caching reduces costs for repeated prefixes but does not provide the 50% across-the-board savings of batch processing. Using sync for all three foregoes significant savings on the two scheduled tasks.',
    ],
    refs: [
      { label: 'Message Batches API', url: 'https://docs.anthropic.com/en/docs/build-with-claude/message-batches' },
      { label: 'Claude Code in CI/CD', url: 'https://docs.anthropic.com/en/docs/claude-code/github-actions' },
    ],
  },
  {
    id: 160, domain: 4, tier: 'exam',
    scenario: 'Your team uses the Claude Code CLI with --print mode for automated PR reviews in CI. The review pipeline analyzes code quality, documentation accuracy, and potential bugs across a large codebase with varied commenting conventions.',
    text: 'Your automated review analyzes comments and docstrings. The current prompt instructs Claude to "check that comments are accurate and up-to-date." Findings frequently flag acceptable patterns (TODO markers, straightforward descriptions) while missing comments that describe behavior the code no longer implements. What change addresses the root cause of this inconsistent analysis?',
    options: [
      'Include git blame data so Claude can identify comments that predate recent code modifications',
      'Filter out TODO, FIXME, and descriptive comment patterns before analysis to reduce noise',
      'Add few-shot examples of misleading comments to help the model recognize similar patterns in the codebase',
      'Specify explicit criteria: flag comments only when their claimed behavior contradicts actual code behavior',
    ],
    correct: 3,
    explanation: 'The root cause is the vague instruction "check that comments are accurate and up-to-date," which provides no concrete definition of what makes a comment problematic. Specifying explicit criteria — flag a comment only when its stated behavior contradicts what the code actually does — removes the ambiguity that generates both false positives (TODO markers, obvious descriptions) and false negatives (stale behavioral claims). This directly targets the mismatch between claim and implementation. Git blame (A) adds noise without a decision rule. Filtering (B) is a workaround, not a fix. Few-shot examples (C) help but are secondary to fixing the missing criterion.',
    wrongExplanations: [
      'Git blame data indicates which comments are old but does not define whether an old comment is wrong. A comment from 3 years ago may still be accurate; a comment added yesterday may already be stale. Age alone cannot substitute for behavioral accuracy criteria.',
      'Filtering out TODO and descriptive patterns treats the symptom rather than the root cause. This reduces false positives on those specific patterns but does not prevent future false positives on new acceptable patterns, nor does it improve detection of genuinely stale behavioral descriptions.',
      'Few-shot examples can improve recognition of specific misleading patterns but only generalize well to similar examples. Without an explicit criterion (claimed behavior vs. actual code), the model lacks a general principle to apply to novel comment structures it has not seen examples of.',
    ],
    refs: [
      { label: 'Prompt engineering — explicit criteria', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview' },
      { label: 'Claude Code CI/CD integration', url: 'https://docs.anthropic.com/en/docs/claude-code/github-actions' },
    ],
  },
  {
    id: 161, domain: 4, tier: 'exam',
    scenario: 'Your team uses the Claude Code CLI with --print mode for automated PR reviews in CI. The review pipeline uses an iterative tool-calling pattern where Claude requests additional file context mid-analysis before producing final feedback.',
    text: 'The code review component works iteratively: Claude analyzes a changed file, then may request related files (imports, base classes, tests) via tool calling to understand context before providing final feedback. Your application defines a tool that lets Claude request file contents; Claude invokes this tool, receives results, and continues its analysis. You\'re evaluating batch processing to reduce API costs. What is the primary technical constraint when considering batch processing for this workflow?',
    options: [
      'The batch API does not support tool definitions in request parameters.',
      'Batch processing latency of up to 24 hours is too slow for pull request feedback, though the workflow could otherwise function.',
      'The asynchronous model prevents executing tools mid-request and returning results for Claude to continue analysis.',
      'Batch processing lacks request correlation identifiers for matching outputs to input requests.',
    ],
    correct: 2,
    explanation: 'The Batches API uses a fire-and-forget asynchronous model: you submit a batch and poll for completion; there is no mechanism to intercept a tool call mid-request, execute it server-side, and return the result so Claude can continue. Iterative tool-calling requires multiple round-trips within a single logical interaction — Claude calls a tool, your code executes it and returns the result, Claude resumes. This architecture is fundamentally incompatible with the batch model. The latency concern (B) is real but secondary — even if latency were acceptable, the workflow would still be broken because the tool calls cannot be served. Tool definitions (A) are supported in batch requests. Correlation IDs (D) are handled via the custom_id field.',
    wrongExplanations: [
      'Incorrect: the Batches API does support tool definitions in request parameters — you can include a `tools` array. The problem is not the request schema but the inability to serve tool calls asynchronously mid-execution.',
      'Incorrect: latency is a valid concern for PR-blocking workflows, but it is not the primary technical constraint. Even for a workflow where latency is acceptable, the tool-calling interaction pattern still cannot function with the async fire-and-forget model.',
      'Incorrect: the Batches API does provide correlation — each request includes a `custom_id` field that maps to the corresponding output. Request correlation is not the constraint.',
    ],
    refs: [
      { label: 'Message Batches API', url: 'https://docs.anthropic.com/en/docs/build-with-claude/message-batches' },
      { label: 'Tool use overview', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview' },
    ],
  },
  {
    id: 162, domain: 4, tier: 'exam',
    scenario: 'Your team uses the Claude Code CLI with --print mode for automated PR reviews in CI. The review pipeline analyzes code quality, documentation accuracy, and potential bugs across a large codebase with varied commenting conventions.',
    text: 'Your automated code review averages 15 findings per pull request, with developers reporting a 40% false positive rate. The bottleneck is investigation time: developers must click into each finding to read Claude\'s reasoning before deciding whether to address or dismiss it. Your CLAUDE.md already contains comprehensive rules for acceptable patterns, and stakeholders have rejected any approach that filters findings before developer review. What change would best address the investigation time bottleneck?',
    options: [
      'Require Claude to include its reasoning and confidence assessment inline with each finding',
      'Categorize findings as "blocking issues" versus "suggestions" with tiered review requirements',
      'Add a post-processor that analyzes finding patterns and automatically suppresses those matching historical false positive signatures',
      'Configure Claude to only surface findings it assesses as high confidence, filtering out uncertain flags before developers see them',
    ],
    correct: 0,
    explanation: 'The bottleneck is clicking into findings to read reasoning. Including reasoning and confidence inline with each finding eliminates that click — developers can triage at a glance without navigating away. This respects the no-filtering constraint because all findings remain visible; it simply makes the information needed for triage immediately accessible. Categorizing (B) adds a useful label but still requires developers to evaluate each finding without the reasoning they need. The post-processor (C) was explicitly rejected by stakeholders as a filtering approach. High-confidence filtering (D) was also explicitly rejected — it hides findings from developers.',
    wrongExplanations: [
      'While categorizing findings into blocking vs. suggestions can speed some triage decisions, it does not address the root bottleneck: developers still need to click into each finding to understand why it was flagged before deciding. Inline reasoning is what eliminates the click.',
      'Adding a post-processor to suppress historical false positive patterns is a form of pre-filtering — it removes findings before developers see them. Stakeholders explicitly rejected this approach.',
      'High-confidence filtering hides findings from developers — this was explicitly rejected by stakeholders who want all findings visible.',
    ],
    refs: [
      { label: 'Prompt engineering — structured output', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview' },
      { label: 'Claude Code CI/CD integration', url: 'https://docs.anthropic.com/en/docs/claude-code/github-actions' },
    ],
  },
  {
    id: 163, domain: 3, tier: 'exam',
    scenario: 'You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution.',
    text: 'Your CLAUDE.md has grown to over 400 lines containing coding standards, testing conventions, a detailed PR review checklist, deployment workflow instructions, and database migration procedures. You want Claude to always follow the coding standards and testing conventions, but only apply PR review, deployment, and migration guidance when you\'re actually performing those tasks. What\'s the most effective restructuring approach?',
    options: [
      'Split the CLAUDE.md into files in .claude/rules/ with path-specific glob patterns so each rule loads only for matching file types',
      'Keep universal standards in CLAUDE.md and create Skills for task-specific workflows (PR reviews, deployments, migrations) with trigger keywords',
      'Move all guidance into separate Skills files organized by workflow type, keeping only a brief project description in CLAUDE.md',
      'Keep all content in CLAUDE.md but use @import syntax to organize it into separately maintained files by category',
    ],
    correct: 1,
    explanation: 'CLAUDE.md content is loaded for every conversation, making it the right home for standards that should always apply (coding conventions, testing rules). Skills are invoked on-demand when Claude detects relevant trigger keywords or the developer uses a slash command, making them ideal for task-specific workflows like PR reviews, deployments, and migrations. This matches loading behavior to usage frequency. Glob rules (A) are path-based — they activate for files matching a pattern, not for tasks like "I\'m doing a deployment." Moving everything to Skills (C) would cause coding standards to be absent from regular coding sessions. The `@import` syntax (D) does not exist in CLAUDE.md — there is no such feature.',
    wrongExplanations: [
      'Glob patterns in .claude/rules/ activate based on the file path being edited — they are ideal for "apply this when editing test files" but cannot express "apply this when the developer is performing a deployment." Task-based activation requires Skills.',
      'Moving all guidance to Skills means coding standards and testing conventions would only be active when a developer explicitly invokes the relevant skill. During normal coding, Claude would have no standards to follow — the opposite of what is needed.',
      'CLAUDE.md does not support an @import syntax. There is no mechanism to compose CLAUDE.md from separate files via imports.',
    ],
    refs: [
      { label: 'Claude Code memory — CLAUDE.md', url: 'https://docs.anthropic.com/en/docs/claude-code/memory' },
      { label: 'Claude Code slash commands and skills', url: 'https://docs.anthropic.com/en/docs/claude-code/slash-commands' },
    ],
  },
  {
    id: 164, domain: 3, tier: 'basic',
    text: 'Your team uses a /commit skill stored in .claude/skills/commit/SKILL.md. One developer wants to customize it for their personal workflow (different commit message format, additional checks) without affecting teammates. What should you recommend?',
    options: [
      'Set override: true in the personal skill\'s frontmatter for precedence',
      'Create a personal version in ~/.claude/skills/ with a different name like /my-commit',
      'Create a personal version at ~/.claude/skills/commit/SKILL.md with the same /commit name to override',
      'Add username-based conditional logic to the project skill\'s frontmatter config',
    ],
    correct: 1,
    explanation: 'Project-scoped skills (in .claude/skills/) take precedence over user-scoped skills (~/.claude/skills/) when both have the same name. To make a personal skill accessible alongside the project skill, the developer must use a different name — such as /my-commit — in their personal ~/.claude/skills/ directory. Using the same /commit name in user scope (C) would be silently overridden by the project skill. The override: true key (A) and username-based conditionals (D) are not valid SKILL.md frontmatter options.',
    refs: [
      { label: 'Claude Code slash commands and skills', url: 'https://docs.anthropic.com/en/docs/claude-code/slash-commands' },
    ],
  },
  {
    id: 165, domain: 5, tier: 'exam',
    scenario: 'Your team is building an AI-powered customer support agent that handles order inquiries, billing disputes, and account management. The agent uses a set of tools including get_customer, lookup_order, process_refund, and escalate_to_human to resolve customer issues autonomously.',
    text: 'Production metrics show that when your agent resolves complex cases involving billing disputes or multi-order returns, customer satisfaction scores are 15% lower than for simple cases—even when the resolution is technically correct. Root cause analysis reveals the agent provides accurate resolutions but inconsistently explains the reasoning: sometimes omitting relevant policy details, other times missing timeline information or next steps. The specific context gaps vary by case. You want to improve resolution quality without adding human review overhead. Which approach is most effective?',
    options: [
      'Add a self-critique step where the agent evaluates its draft response for completeness—ensuring it addresses the customer\'s concern, includes relevant context, and anticipates follow-up questions.',
      'Add a confirmation step where the agent asks "Does this fully address your concern?" before closing, letting customers request additional information if needed.',
      'Implement few-shot examples in the system prompt showing complete resolution explanations for five common complex case types, demonstrating how to include policy context, timelines, and next steps.',
      'Increase the model tier from Haiku to Sonnet for complex cases, routing based on detected case complexity.',
    ],
    correct: 0,
    explanation: 'The self-critique step (evaluator-optimizer pattern) directly addresses the root cause: gaps in completeness that vary by case. Before presenting the response, the agent evaluates its own draft against explicit criteria — does it explain the policy, include relevant timelines, address all concerns, and anticipate follow-up questions? This catch-mechanism is case-aware and handles the variability that makes few-shot examples insufficient. The confirmation question (B) shifts the burden to customers to identify their own information gaps. Few-shot examples (C) cover five specific templates but miss novel gap patterns in different case types. A model tier upgrade (D) may improve general quality but does not add a targeted completeness check.',
    wrongExplanations: [
      'Asking customers "Does this fully address your concern?" puts the burden on the customer to identify gaps in the agent\'s explanation — a poor experience. Many customers will not know what policy details or next steps they are missing until they need them later.',
      'Few-shot examples for five common case types provide templates but cannot cover all complex case variations. The root cause is variable, case-specific gaps; a fixed set of templates cannot catch gaps in novel case configurations.',
      'A model tier upgrade may improve general quality but provides no targeted mechanism to detect or fill completeness gaps in the response. Without a self-critique step, a more capable model will still produce inconsistently complete explanations.',
    ],
    refs: [
      { label: 'Agentic systems — human in the loop', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/human-in-the-loop' },
      { label: 'Build effective agents', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/build-effective-agents' },
    ],
  },
  {
    id: 166, domain: 1, tier: 'exam',
    scenario: 'Your team built a multi-agent research system using Claude as a coordinator with specialized subagents: a web search agent, a document analysis agent, and a synthesis agent. The coordinator decomposes research topics, delegates to subagents, and passes combined findings to the synthesis agent.',
    text: 'When researching a broad topic, you observe that the web search agent and document analysis agent are both investigating the same subtopics, resulting in significant overlap in their findings. Token usage nearly doubled without proportionally increasing the breadth or depth of research coverage. What\'s the most effective way to address this?',
    options: [
      'Implement a shared state mechanism where agents log their current focus area, allowing other agents to dynamically avoid duplicating work in progress',
      'Convert to sequential execution where document analysis runs only after web search completes, using the web search findings as context to avoid duplication',
      'Allow both agents to complete their parallel work, then have the coordinator deduplicate overlapping findings before passing to the synthesis agent',
      'Have the coordinator explicitly partition the research space before delegation, assigning distinct subtopics or source types to each agent',
    ],
    correct: 3,
    explanation: 'The root cause is that the coordinator delegated the same research space to both agents without defining boundaries. Having the coordinator explicitly partition the research space before delegation — assigning distinct subtopics (e.g., agent A covers academic/primary sources; agent B covers industry/news) or distinct domains of the topic — addresses the problem at its source, before any wasted work occurs. This preserves the benefits of parallel execution. Shared state (A) adds coordination complexity and coordination failures. Sequential execution (B) eliminates the parallelism benefit. Post-hoc deduplication (C) is a workaround that still wastes all the tokens spent on overlapping work.',
    wrongExplanations: [
      'Shared state between parallel agents introduces coordination overhead and race conditions (what if both agents choose the same focus area simultaneously?). It also requires agents to monitor and respond to each other\'s state, adding complexity. Upfront partitioning is simpler and more reliable.',
      'Converting to sequential execution solves the overlap but at the cost of the primary performance benefit — parallel research. The coordinator pattern uses parallel subagents specifically to reduce total time. Sequential execution defeats this architecture.',
      'Post-hoc deduplication removes overlapping findings before synthesis but the tokens were already spent generating them. This treats the symptom (duplicate findings) rather than the cause (unpartitioned task assignment).',
    ],
    refs: [
      { label: 'Build effective agents — orchestration', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/orchestration' },
      { label: 'Agentic systems overview', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/build-effective-agents' },
    ],
  },
  {
    id: 167, domain: 5, tier: 'exam',
    scenario: 'Your team built a multi-agent research system using Claude as a coordinator with specialized subagents: a web search agent, a document analysis agent, and a synthesis agent. The coordinator decomposes research topics, delegates to subagents, and passes combined findings to the synthesis agent.',
    text: 'The web search subagent returns results for only 3 of 5 requested source categories (competitor websites and industry reports succeeded, but news archives and social media feeds timed out). The document analysis subagent successfully processed all provided documents. The synthesis subagent must now produce a findings summary from this mixed-quality input. What\'s the most effective error propagation strategy?',
    options: [
      'Have the synthesis subagent request the coordinator retry the timed-out sources with extended timeouts before proceeding, ensuring complete data coverage before synthesis begins.',
      'Structure the synthesis output with coverage annotations indicating which findings are well-supported versus which topic areas have gaps due to unavailable sources.',
      'Have the synthesis subagent return an error to the coordinator indicating incomplete upstream data, triggering a full retry or task failure.',
      'Proceed with synthesis using only the successful sources, generating output without indicating which data was unavailable.',
    ],
    correct: 1,
    explanation: 'Graceful degradation with transparency is the correct pattern: the synthesis agent produces the most useful output possible from available data, while explicitly annotating which findings are well-supported and which areas have gaps due to unavailable sources. This preserves the value of the completed work (3 of 5 sources succeeded) and propagates uncertainty information so downstream consumers can make informed decisions. Blocking on retry (A) delays the entire output for sources that may time out again. Returning an error (C) discards all completed work. Silent synthesis (D) hides the uncertainty, potentially leading consumers to make decisions on incomplete data without knowing it.',
    wrongExplanations: [
      'Blocking synthesis until all sources respond discards the value of the 3 successful sources and the completed document analysis while waiting for timed-out sources that may never respond. A partial synthesis with gap annotations is more useful than no synthesis.',
      'Returning an error and discarding all completed work means the successfully retrieved competitor websites, industry reports, and all analyzed documents produce nothing. This is the worst outcome — it wastes all completed work for the sake of two failed sources.',
      'Synthesizing silently without gap annotations produces output that appears comprehensive but is not. Consumers may make decisions based on missing news and social media perspectives without knowing those sources failed, which is worse than knowing the gaps exist.',
    ],
    refs: [
      { label: 'Build effective agents — error handling', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/build-effective-agents' },
      { label: 'Context management', url: 'https://docs.anthropic.com/en/docs/build-with-claude/context-windows' },
    ],
  },
  {
    id: 168, domain: 5, tier: 'exam',
    scenario: 'Your team built a multi-agent research system using Claude as a coordinator with specialized subagents: a web search agent, a document analysis agent, and a synthesis agent. The coordinator decomposes research topics, delegates to subagents, and passes combined findings to the synthesis agent.',
    text: 'Production monitoring reveals inconsistent synthesis quality. When aggregated results total ~75K tokens, the synthesis agent reliably cites information from the first 15K tokens (web search headlines and snippets) and the final 10K tokens (document analysis conclusions), but frequently omits critical findings that appear in the middle 50K tokens—even when those findings directly address the research question. How should you restructure the aggregated input?',
    options: [
      'Place a key findings summary at the beginning of the aggregated input and organize detailed results with explicit section headers for easier navigation.',
      'Implement rotation that alternates which subagent\'s results appear first across different research tasks, ensuring both sources receive primacy positioning equally over time.',
      'Stream subagent results to the synthesis agent incrementally, processing web search results first to completion before introducing document analysis findings.',
      'Summarize all subagent outputs to under 20K tokens total before aggregation, ensuring content stays within the model\'s reliable processing range.',
    ],
    correct: 0,
    explanation: 'The pattern is classic lost-in-the-middle: reliable attention at the start and end, poor attention in the middle. Placing a key findings summary at the beginning leverages the primacy effect — the most critical information occupies the most reliably attended position. Explicit section headers throughout the 75K input help the model navigate and maintain attention on middle sections. These two changes directly mitigate the attention pattern without discarding any content. Rotation (B) distributes the problem across tasks but does not fix it — findings will still be missed, just from different positions. Streaming (C) creates sequential processing that eliminates the parallelism benefit. Aggressive summarization to 20K (D) risks losing important details that were in the original findings.',
    wrongExplanations: [
      'Rotation ensures each source receives primacy positioning equally across tasks, but this does not improve synthesis quality for any individual task — critical findings from one source will still be in the middle when the other source leads. The problem recurs for every task.',
      'Streaming web results first to completion before introducing document analysis results converts parallel aggregation into sequential processing. This eliminates the performance benefit of running subagents in parallel and does not address the attention distribution problem for whichever source comes second.',
      'Summarizing all outputs to 20K tokens reduces the lost-in-the-middle risk by shrinking the context, but aggressive compression risks losing important secondary findings. A key findings summary at the start plus section headers achieves the attention improvement without discarding content.',
    ],
    refs: [
      { label: 'Context windows and attention', url: 'https://docs.anthropic.com/en/docs/build-with-claude/context-windows' },
      { label: 'Build effective agents', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/build-effective-agents' },
    ],
  },
  {
    id: 169, domain: 1, tier: 'exam',
    scenario: 'Your team built a multi-agent research system using Claude as a coordinator with specialized subagents: a web search agent, a document analysis agent, and a synthesis agent. The coordinator decomposes research topics, delegates to subagents, and passes combined findings to the synthesis agent.',
    text: 'During testing, combined outputs from the web search agent (85K tokens including page content) and the document analysis agent (70K tokens including reasoning chains) total 155K tokens, but the synthesis agent performs optimally with inputs under 50K tokens. What\'s the most effective solution?',
    options: [
      'Store findings in a vector database and give the synthesis agent retrieval tools to query during its work',
      'Add an intermediate summarization agent that condenses findings before passing to synthesis',
      'Modify upstream agents to return structured data (key facts, citations, relevance scores) instead of verbose content and reasoning',
      'Have the synthesis agent process findings in sequential batches, maintaining running state between calls',
    ],
    correct: 2,
    explanation: 'Modifying upstream agents to return structured data addresses the root cause: the agents are returning far more token-volume than the synthesis step needs. Full page content and reasoning chains are intermediate artifacts of the search and analysis process — they are not the output the synthesis agent needs. Requiring agents to output key facts, citations, and relevance scores reduces token volume at the source while preserving the essential information. This is better than downstream approaches: vector retrieval (A) adds latency and requires the synthesis agent to know what to retrieve; intermediate summarization (B) adds another agent hop and may lose structured facts; sequential batches (D) require maintaining state across calls and do not reduce total token usage.',
    wrongExplanations: [
      'A vector database with retrieval tools gives the synthesis agent a way to query for specific information but requires it to generate queries, increasing complexity and latency. It also does not reduce the total data generated by upstream agents — the 155K tokens are still produced and stored. Structured output upstream is simpler and more direct.',
      'An intermediate summarization agent adds a third layer of processing and another agent hop. It also risks losing structured data (key facts, specific figures, citation metadata) that is easier to preserve by having the upstream agents return structured output directly.',
      'Sequential batch processing of 155K tokens across multiple calls adds complexity through state management and does not reduce the total context the synthesis agent must process — it just fragments it. Upstream structured output is more efficient.',
    ],
    refs: [
      { label: 'Build effective agents — orchestration', url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/orchestration' },
      { label: 'Context windows', url: 'https://docs.anthropic.com/en/docs/build-with-claude/context-windows' },
    ],
  },
  {
    id: 170, domain: 2, tier: 'exam',
    scenario: 'Your team is building an AI-powered customer support agent that handles order inquiries, billing disputes, and account management. The agent uses a set of tools including get_customer, lookup_order, process_refund, and escalate_to_human to resolve customer issues autonomously.',
    text: 'Production logs show the agent sometimes selects get_customer when lookup_order would be more appropriate, particularly for ambiguous requests like "I need help with my recent purchase." You decide to add few-shot examples to your system prompt to improve tool selection. Which approach will most effectively address this issue?',
    options: [
      'Add examples grouped by tool—all get_customer scenarios together, then all lookup_order scenarios.',
      'Add 10–15 examples of clear, unambiguous requests that demonstrate correct tool selection for each tool\'s typical use cases.',
      'Add explicit "use when" and "do not use when" guidelines in each tool\'s description covering the ambiguous cases.',
      'Add 4–6 examples targeting ambiguous scenarios, each showing reasoning for why one tool was chosen over plausible alternatives.',
    ],
    correct: 3,
    explanation: 'The error occurs on ambiguous requests — not on clear cases where the agent already performs correctly. Few-shot examples are most effective when they target the specific scenarios where errors occur, paired with explicit reasoning about the comparative decision. For "I need help with my recent purchase," the reasoning might be: "This mentions a purchase, not account details — use lookup_order, not get_customer. If the customer had said \'my account\' or \'my profile,\' get_customer would be appropriate." This comparative reasoning directly teaches the decision process for edge cases. Grouping by tool (A) makes examples easier to scan but does not demonstrate comparative reasoning. Many clear-case examples (B) reinforce behavior that already works correctly without addressing the ambiguous cases. Tool description updates (C) are a valid complementary fix but are not few-shot examples.',
    wrongExplanations: [
      'Grouping examples by tool (all get_customer first, then all lookup_order) organizes the prompt for human readability but does not teach comparative reasoning. The model sees each tool\'s use cases in isolation rather than side-by-side for ambiguous inputs.',
      'Adding 10–15 clear-case examples reinforces correct behavior on cases the agent already handles correctly. Since the errors occur specifically on ambiguous requests, these examples do not address the problem. More examples of already-known patterns do not generalize to edge cases.',
      'Updating tool descriptions with "use when / do not use when" guidelines is a valid and complementary approach, but it is not few-shot prompting. The question asks specifically about which few-shot approach is most effective.',
    ],
    refs: [
      { label: 'Tool use best practices', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use/best-practices' },
      { label: 'Prompt engineering — few-shot', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-examples' },
    ],
  },
];

export const QUESTION_COUNT = QUESTIONS.length;
export const DOMAINS = [1, 2, 3, 4, 5] as const;
export const TIERS: Tier[] = ['basic', 'intermediate', 'advanced', 'exam'];

export const TIER_LABELS: Record<Tier, string> = {
  basic: 'Basic',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  exam: 'Exam Ready',
};

export const DOMAIN_LABELS: Record<Domain, string> = {
  1: 'Agentic Architecture & Orchestration',
  2: 'Tool Design & MCP Integration',
  3: 'Claude Code Configuration & Workflows',
  4: 'Prompt Engineering & Structured Output',
  5: 'Context Management & Reliability',
};

export const DOMAIN_WEIGHTS: Record<Domain, number> = {
  1: 27, 2: 18, 3: 20, 4: 20, 5: 15,
};
