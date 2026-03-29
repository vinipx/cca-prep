---
id: overview
title: Domain 1 — Agentic Architecture & Orchestration
sidebar_label: Overview (27%)
---

# Domain 1 — Agentic Architecture & Orchestration

**Exam weight: 27% — the heaviest domain on the exam.**

This domain tests your ability to design, implement, and debug multi-agent systems built on the Claude Agent SDK. It covers the full lifecycle of an agentic loop, coordinator-subagent patterns, enforcement via hooks, and session management.

## What this domain tests

| Task Statement | Description |
|---|---|
| 1.1 | Design and implement agentic loops for autonomous task execution |
| 1.2 | Orchestrate multi-agent systems with coordinator-subagent patterns |
| 1.3 | Configure subagent invocation, context passing, and spawning |
| 1.4 | Implement multi-step workflows with enforcement and handoff patterns |
| 1.5 | Apply Agent SDK hooks for tool call interception and data normalization |
| 1.6 | Design task decomposition strategies for complex workflows |
| 1.7 | Manage session state, resumption, and forking |

## The agentic loop lifecycle

The agentic loop is the fundamental building block. Understanding it precisely — not approximately — is required for this domain.

```
1. Send request to Claude (with tool definitions + conversation history)
2. Receive response
3. Check stop_reason:
   → "tool_use"  = Claude wants to call tools → execute them → go to step 4
   → "end_turn"  = Claude finished → terminate loop
4. Append assistant message to history
5. Append tool results to history as user message
6. Go to step 1
```

:::danger Critical anti-pattern
**Never** use text content checks to decide loop termination:
```js
// WRONG — fragile, non-deterministic
if (response.content[0].text.includes('Task complete')) break;

// CORRECT — use the structured API signal
if (response.stop_reason === 'end_turn') break;
```
:::

## Hub-and-spoke coordinator pattern

```
         ┌──────────────┐
         │  Coordinator  │
         │  (hub)        │
         └──────┬───────┘
       ┌────────┼────────┐
       ▼        ▼        ▼
  [Web search] [Doc     ] [Synthesis]
  subagent     analysis   subagent
               subagent
```

**Rules:**
- All inter-subagent communication routes through the coordinator
- Subagents have **isolated context** — they receive only what the coordinator explicitly passes
- Coordinator handles: task decomposition, delegation, result aggregation, error routing
- Parallel spawning: emit multiple `Task` tool calls in **one coordinator response**

## Context passing — what to include

When a coordinator passes findings to a synthesis subagent, the context must be **structured** — not a plain text blob:

```json
{
  "findings": [
    {
      "content": "...",
      "source_url": "https://...",
      "source_title": "...",
      "retrieved_at": "2026-03-26"
    }
  ]
}
```

Plain concatenation loses attribution. Structured data preserves it.

## Hooks: programmatic enforcement

Hooks are Python/TypeScript functions invoked by the Agent SDK at specific loop points — **not by Claude**.

| Hook type | When it fires | Use for |
|---|---|---|
| `PostToolUse` | After tool execution, before Claude sees the result | Normalizing data formats (timestamps, status codes) |
| Interception hook | Before tool execution | Blocking policy-violating calls (refund > $500 → escalate) |

```python
# PostToolUse — normalize timestamps before Claude processes them
def normalize_tool_result(result):
    if 'timestamp' in result:
        result['timestamp'] = to_iso8601(result['timestamp'])
    return result
```

**Hooks vs prompt instructions:**

| | Hooks | Prompt instructions |
|---|---|---|
| Compliance rate | 100% (code runs) | ~99% (probabilistic) |
| Use for | Financial gates, identity verification, policy rules | Guidance, style, preference |

## Session management

| Operation | Use when |
|---|---|
| `--resume <session-name>` | Prior context is mostly valid; continuing the same work |
| `fork_session` | You want two independent approaches from the same baseline |
| New session + injected summary | Prior tool results are stale; fundamental assumption changed |

:::tip Resuming after file changes
When resuming a session after you modified files Claude previously analyzed, **explicitly tell Claude which files changed**. It will not detect file system changes automatically. Without this, Claude reasons from stale analysis.
:::

## Task decomposition patterns

| Pattern | When to use | Example |
|---|---|---|
| **Prompt chaining** | Steps are known upfront, sequential | File-by-file analysis → cross-file synthesis |
| **Dynamic adaptive** | Scope unknown until you explore | "Add tests to legacy codebase" |
| **Parallel decomposition** | Independent subtasks | Simultaneous web search + doc analysis |

## Quick reference: `allowedTools` for subagent spawning

```python
options = ClaudeAgentOptions(
    allowed_tools=["Read", "Grep", "Glob", "Task"],  # "Task" required to spawn subagents
    system_prompt="You are a research coordinator...",
)
```

## Official documentation

- [Agent SDK overview](https://platform.claude.com/docs/en/agent-sdk/overview)
- [How the agent loop works](https://platform.claude.com/docs/en/agent-sdk/agent-loop)
- [Agent SDK quickstart](https://platform.claude.com/docs/en/agent-sdk/quickstart)
- [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
- [Agent SDK Python repo (hooks)](https://github.com/anthropics/claude-agent-sdk-python)
