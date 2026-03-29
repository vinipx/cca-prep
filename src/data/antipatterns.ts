import type { Domain } from './questions';

export interface AntiPattern {
  id: number;
  domain: Domain;
  title: string;
  why: string;
  correct: string;
  examTip: string;
}

export const ANTI_PATTERNS: AntiPattern[] = [
  {
    id: 1, domain: 1,
    title: 'Using few-shot examples to enforce tool ordering',
    why: 'Few-shot examples are demonstrations — they influence Claude\'s behavior probabilistically, not deterministically. Showing Claude examples of "always call verify_identity before process_payment" reduces but cannot eliminate ordering violations. For financial or compliance workflows, "most of the time" is not acceptable.',
    correct: 'Use programmatic prerequisites: hooks that block downstream tool calls until required upstream tools have completed. The gate fires deterministically every time — not based on what Claude has "seen" in examples.',
    examTip: 'If the exam asks about enforcing ORDERING or SEQUENCING of tool calls for compliance, the answer is never few-shot examples — it is always programmatic hooks or prerequisite gates.',
  },
  {
    id: 2, domain: 5,
    title: 'Self-reported confidence scores for escalation routing',
    why: 'LLMs are poorly calibrated on confidence. Research consistently shows models express high confidence on questions they answer incorrectly. For an escalation system, this means the cases that MOST need human review (hard, ambiguous, high-stakes) are the ones the model will most confidently handle itself — and get wrong.',
    correct: 'Use programmatic escalation triggers: missing required data fields, policy threshold violations (amount > $500), specific issue category flags, tool error counts exceeding a threshold. These are objective and deterministic.',
    examTip: 'Any answer option involving "Claude\'s confidence score" or "self-reported certainty" as an escalation signal is wrong.',
  },
  {
    id: 3, domain: 4,
    title: 'Routing all workflows to the Batch API for cost savings',
    why: 'The Message Batches API has a 24-hour processing window with no SLA. "~50% cost savings" sounds compelling, but applying it to real-time or blocking workflows means users wait minutes or hours for responses, or hard deadlines are missed. Cost savings are worthless if the product is unusable.',
    correct: 'Batches API for: overnight processing, bulk classification, non-interactive jobs with deadlines hours away. Synchronous API for: live user queries, any workflow where a human is waiting for the result right now.',
    examTip: 'The exam will present "route to Batch API" as a cost optimization option. It is wrong whenever the workflow is real-time, blocking, or has a hard latency requirement.',
  },
  {
    id: 4, domain: 5,
    title: 'Using a larger context window to fix attention dilution',
    why: 'Context window size and attention quality are different properties. Putting a 200-page document into a 200K token window does not guarantee reliable attention across all 200 pages — the model still has the "lost in the middle" property, just at a larger scale. The diluted zone moves but does not disappear.',
    correct: 'Per-section passes where each section is the primary focus of the entire context, followed by a separate synthesis/integration pass over section summaries. Focused attention on smaller chunks always outperforms diluted attention on large chunks.',
    examTip: '"Use a model with a larger context window" is a distractor for attention dilution questions. The correct answer always involves splitting into focused passes.',
  },
  {
    id: 5, domain: 1,
    title: 'Returning empty results when a subagent fails',
    why: 'Silently returning empty results on failure is catastrophic for coordinator recovery. The coordinator cannot tell the difference between "found nothing" and "failed to look." It will proceed with an incomplete picture, producing incorrect or incomplete synthesis, and will not know to retry or escalate.',
    correct: 'Return structured error context: what was retrieved before failure (partial results), what error occurred (category, message), whether retry is appropriate (isRetryable), and what was attempted. The coordinator uses this to make an informed decision.',
    examTip: 'Empty results on failure is wrong. Structured error propagation with partial results is correct.',
  },
  {
    id: 6, domain: 2,
    title: 'Giving all agents access to all available tools',
    why: 'Tool selection reliability degrades with the number of available tools. An agent with 18 tools will make worse decisions than one with 4-5 role-appropriate tools. Agents with tools outside their role tend to misuse them — a synthesis agent with email access may send emails in unexpected contexts.',
    correct: 'Scope tools to each agent\'s role. Give each agent only the tools it needs: read-only tools for exploration agents, role-specific tools for specialist agents. Fewer, more relevant tools = better selection reliability.',
    examTip: '"Give the agent access to all tools" is always wrong. "Scope tools to 4-5 per agent role" is always right.',
  },
  {
    id: 7, domain: 1,
    title: 'Parsing natural language to determine loop termination',
    why: 'Claude\'s phrasing is non-deterministic. Checking response text for phrases like "I\'m done", "Task complete", or "Finished" is fragile: Claude may use these phrases mid-task while still planning further steps, or may not use them even when finished. This creates both premature termination and infinite loops.',
    correct: 'Always use stop_reason as the loop termination signal. stop_reason === "end_turn" means the loop is done. stop_reason === "tool_use" means continue. This is the structured, reliable API contract.',
    examTip: 'Any answer involving "check if the response text says X to stop" is wrong. stop_reason is always the correct termination mechanism.',
  },

  // ── New anti-patterns from official CCA Exam Guide ────────────────────────

  {
    id: 8, domain: 5,
    title: 'Using sentiment analysis for escalation routing',
    why: 'Customer frustration (sentiment) does not correlate with case complexity. A customer can be highly frustrated about a simple issue the agent can resolve in one turn, and completely calm about a complex policy exception requiring human judgment. Sentiment-based escalation causes the agent to escalate resolvable cases (frustrated customers with simple issues) while autonomously mishandling complex cases (calm customers with policy gaps).',
    correct: 'Use explicit, objective escalation criteria: (1) customer explicitly requests a human, (2) policy is silent or ambiguous on the case, (3) agent cannot make meaningful progress. These triggers are deterministic and directly tied to whether human judgment is actually needed.',
    examTip: '"Detect customer frustration" and "sentiment threshold" escalation options are always wrong. Explicit customer request, policy gap, and inability to progress are the correct triggers.',
  },
  {
    id: 9, domain: 3,
    title: 'Resuming a session without informing Claude about changed files',
    why: 'When you resume a session after code modifications, the prior tool results in context still reference the old file contents. Claude may reason from outdated facts — referencing classes that were renamed, functions that were removed, or patterns that were refactored. The session appears to continue correctly but produces recommendations based on a codebase that no longer exists.',
    correct: 'When resuming after file changes: explicitly inform the agent about which specific files changed and what changed in them. For major refactors (many files changed), starting a new session with an injected summary of prior findings is more reliable than resuming with stale tool results.',
    examTip: 'When the exam describes session resumption after code changes, "resume and assume Claude detects changes" is wrong. The correct answer involves explicitly informing Claude about what changed.',
  },
  {
    id: 10, domain: 2,
    title: 'Giving synthesis agents access to all available web search tools',
    why: 'Synthesis agents are designed to combine and reason over findings already gathered by search agents. Giving them full web search access blurs specialization — the synthesis agent may start conducting its own research, duplicating work, using inconsistent search strategies, and routing around the coordinator. Tool selection also degrades: agents with more tools than they need make worse tool decisions.',
    correct: 'Give synthesis agents a scoped, limited tool for common verification needs (e.g., a verify_fact tool for simple date/name lookups). Route complex verification needs back through the coordinator to the web search agent. This applies least-privilege while handling the 85% common case efficiently.',
    examTip: '"Give the synthesis agent access to all web search tools" is wrong. "Give it a scoped verify_fact tool" for the common case, with complex verifications through the coordinator, is correct.',
  },
  {
    id: 11, domain: 4,
    title: 'Trusting aggregate accuracy metrics to reduce human review',
    why: 'A 97% overall accuracy rate can coexist with 40% error on a specific document type if that type is a small fraction of total volume. The high accuracy of the majority papers over the minority failures in aggregate metrics. Reducing human review based on aggregate metrics can silently introduce systematic failures in specific segments — only discovered later when production errors surface.',
    correct: 'Before reducing human review, measure accuracy by document type, field, and other meaningful segments. Stratified random sampling of high-confidence extractions catches novel error patterns and segment-level failures. Only automate when performance is consistently high across all relevant segments — not just in aggregate.',
    examTip: '"97% overall accuracy justifies removing human review" is wrong. "Verify accuracy by document type and field segment first" is always the correct answer for questions about reducing human review.',
  },
  {
    id: 12, domain: 1,
    title: 'Terminating the entire workflow when a single subagent fails',
    why: 'A single subagent failure does not necessarily invalidate the entire research or processing task. Propagating a subagent timeout to a top-level handler that terminates everything means partial work is discarded and the coordinator has no opportunity to recover — it cannot retry with a different query, proceed with partial results, or route around the failed source.',
    correct: 'Subagents should implement local recovery for transient failures. Errors that cannot be resolved locally should be propagated to the coordinator as structured error context (failure type, partial results, alternatives) — not as workflow-terminating exceptions. The coordinator then decides whether to retry, proceed with partial results, or escalate.',
    examTip: '"Terminate the entire workflow on a subagent failure" is always wrong. "Return structured error context to the coordinator for intelligent recovery" is always right.',
  },
  {
    id: 13, domain: 5,
    title: 'Silently omitting topic areas with no source coverage in synthesis',
    why: 'When a synthesis agent has no sources for a topic, silently omitting it from the output makes the gap invisible. Readers and downstream consumers assume the output is complete. Decisions made on this output may be systematically wrong because entire topic areas are missing — with no indication that they are absent rather than simply unimportant.',
    correct: 'Annotate each section of synthesis output with its coverage status. When no sources are available for a topic, include a coverage gap annotation: "Music industry: no sources retrieved for this topic area — findings are incomplete." This makes the gap explicit and lets readers know where to seek additional information rather than assuming silence means "nothing notable."',
    examTip: 'Any option that describes a synthesis agent "focusing on well-covered topics" or "omitting areas with insufficient data" is wrong. Coverage gaps must be explicitly surfaced, not silently dropped.',
  },
  {
    id: 14, domain: 2,
    title: 'Using generic tools when constrained alternatives enforce their own validation',
    why: 'A generic `fetch_url` tool lets an agent fetch any URL — including internal services, sensitive endpoints, or domains outside the intended scope. Prompt instructions like "only fetch approved domains" are probabilistic and can be overridden by adversarial inputs in fetched content (prompt injection). The tool itself has no enforcement mechanism.',
    correct: 'Replace generic tools with constrained alternatives that bake the restrictions into the tool itself. A `load_document` tool that validates document URLs against an allow-list enforces its scope deterministically — the restriction fires on every call regardless of what is in the conversation history or any injected content.',
    examTip: 'When the exam asks about securing tool access or preventing agents from accessing out-of-scope resources, prompt-level instructions are the wrong answer. Constrained tool alternatives with built-in validation are the correct answer.',
  },
  {
    id: 15, domain: 4,
    title: 'Making all extraction schema fields required to ensure complete output',
    why: 'Required fields force the model to fabricate a value when the source document does not contain the information. A required `invoice_date` field on a purchase order that has no date will be hallucinated — commonly as today\'s date, a date from another field, or a plausible-looking made-up value. The output appears complete but contains fabricated data that corrupts downstream processing.',
    correct: 'Make fields nullable/optional when the source document may not contain the information. Return an explicit null for absent fields. Required fields should only be used when the source document is guaranteed to contain that information every time.',
    examTip: '"Make all fields required to guarantee structured output" is wrong. "Make fields optional/nullable when source documents may not contain the data" is always the correct answer for preventing hallucination in extraction schemas.',
  },
  {
    id: 16, domain: 4,
    title: 'Submitting large batch jobs without testing the prompt on a sample first',
    why: 'Submitting 50,000 documents to the Batches API with an untested prompt means discovering prompt failures only after the 24-hour processing window completes. If extraction quality is poor — wrong fields, hallucinated values, schema violations — the entire batch must be resubmitted with a corrected prompt, doubling both cost and time. Errors that affect 10% of documents would have been found with a 100-document sample in minutes.',
    correct: 'Before any large batch submission, test the prompt synchronously on a representative sample of 50-100 documents. Validate extraction quality on that sample — check field accuracy, null rates, and schema compliance — then refine the prompt before submitting the full batch.',
    examTip: '"Submit the full batch to minimize API calls" is wrong when prompt quality is unvalidated. "Test on a synchronous sample first, then batch" is the correct answer for any question about batch workflow efficiency.',
  },
  {
    id: 17, domain: 5,
    title: 'Using heuristic selection when a lookup returns multiple matching records',
    why: 'When a customer lookup returns multiple matches, selecting the "most recently active" account or the first result is a heuristic that will eventually pick the wrong account. Applying a refund, canceling an order, or updating contact information on the wrong customer account is a serious operational error — potentially affecting a customer who had no interaction with the current agent session.',
    correct: 'When a lookup returns multiple matches, ask the customer for an additional identifier that uniquely identifies their account: email address, order number, last 4 digits of card on file, or account creation date. Only proceed with the action once the correct account is unambiguously identified.',
    examTip: 'Any option that selects a record from multiple matches based on recency, order, or activity heuristics is wrong. "Request additional identifying information from the customer" is always the correct answer when a lookup returns multiple results.',
  },
];
