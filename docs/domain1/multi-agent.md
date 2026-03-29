---
id: multi-agent
title: Multi-agent orchestration
sidebar_label: Multi-agent systems
---

# Multi-agent orchestration

## Hub-and-spoke architecture

All production multi-agent systems in the CCA exam use the **hub-and-spoke** pattern. The coordinator is the hub; subagents are the spokes.

```
                   ┌─────────────┐
                   │ Coordinator │  ← Hub
                   └──────┬──────┘
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
    [Web search]    [Doc analysis]    [Synthesis]
     subagent         subagent         subagent
```

**Invariants:**
- Subagents communicate **only** through the coordinator — never directly
- Subagents have **fully isolated context** — they receive only what the coordinator passes
- The coordinator handles all error routing, result aggregation, and quality evaluation

## Spawning subagents: the Task tool

```python
# Coordinator must have "Task" in allowedTools
options = ClaudeAgentOptions(
    allowed_tools=["Task", "search_web"],  # "Task" is mandatory for spawning
    system_prompt="You are a research coordinator..."
)
```

### Parallel spawning — one coordinator turn

```
# Emit BOTH Task calls in a single coordinator response
# → parallel execution (not sequential)

Tool call 1: Task("web_search_agent", query="...")
Tool call 2: Task("doc_analysis_agent", docs=[...])
```

```
# Separate turns → sequential (slow)
Turn 1: Task("web_search_agent", ...)    # waits for completion
Turn 2: Task("doc_analysis_agent", ...)  # only starts after turn 1 finishes
```

## Context passing

Subagents are isolated. They cannot see the coordinator's history. The coordinator must explicitly build their context:

```python
# ❌ Wrong — subagent gets no context
await coordinator.task("synthesis_agent", prompt="Synthesize the findings")

# ✅ Correct — explicitly pass everything the subagent needs
synthesis_prompt = f"""
Synthesize the following research findings into a coherent report.

Web search findings:
{json.dumps(web_results, indent=2)}

Document analysis findings:
{json.dumps(doc_analysis, indent=2)}

Requirements:
- Each claim must cite its source_id
- Cover all findings from both sources
- Identify any contradictions between sources
"""
await coordinator.task("synthesis_agent", prompt=synthesis_prompt)
```

## Dynamic vs. fixed routing

```python
# ❌ Fixed routing — always invokes all subagents regardless of query
def research(query):
    web = task("web_agent", query)
    doc = task("doc_agent", query)
    synthesis = task("synthesis_agent", web, doc)
    return task("report_agent", synthesis)

# ✅ Dynamic routing — coordinator decides which subagents to invoke
def research(query):
    # Coordinator analyzes the query first
    plan = coordinator.plan(query)

    results = {}
    if plan.needs_web_search:
        results["web"] = task("web_agent", query)
    if plan.needs_document_analysis:
        results["docs"] = task("doc_agent", query, plan.relevant_docs)

    return task("synthesis_agent", results)
```

## Iterative refinement loop

```
Coordinator → delegates to subagents
     ↑                ↓
     └── evaluates ← synthesis output
         (is quality bar met?)
         YES → produce final report
         NO  → targeted re-delegation with gap-filling queries
```

The coordinator should specify **quality criteria** in the synthesis prompt, evaluate the output, and re-delegate with targeted queries until the criteria are met. This is more reliable than hoping the first pass is sufficient.

## Error handling across agents

```python
# Subagent: attempt local recovery first, then propagate
async def web_search_subagent(query):
    for attempt in range(3):  # local retry for transient errors
        try:
            return await search(query)
        except TimeoutError:
            if attempt == 2:
                # Propagate structured error to coordinator
                return {
                    "status": "partial_failure",
                    "results_before_failure": accumulated_results,
                    "error": "Search timed out after 3 attempts",
                    "is_retryable": True,
                    "attempted": f"Searched for: {query}"
                }
            await asyncio.sleep(2 ** attempt)
```

## Official documentation
- [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
- [Agent SDK quickstart](https://platform.claude.com/docs/en/agent-sdk/quickstart)
