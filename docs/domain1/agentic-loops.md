---
id: agentic-loops
title: Agentic loops deep dive
sidebar_label: Agentic loops
---

# Agentic loops

The agentic loop is the core execution pattern of every Claude-powered autonomous agent. Mastering it precisely — not approximately — is required to pass Domain 1.

## The loop in detail

```
┌─────────────────────────────────────────────┐
│  1. Build messages array                     │
│     [system prompt, conversation history,    │
│      tool definitions]                       │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  2. Call Claude API                          │
│     client.messages.create({...})            │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  3. Check stop_reason                        │
│                                              │
│  "end_turn"  ──────────────────► TERMINATE  │
│  "tool_use"  ──────────────────► step 4     │
│  "max_tokens" ─────────────────► handle     │
└────────────────┬────────────────────────────┘
                 │ tool_use
                 ▼
┌─────────────────────────────────────────────┐
│  4. Append assistant message to history      │
│     messages.push({role: 'assistant', ...})  │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  5. Execute each tool call                   │
│     for each tool_use block in response      │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  6. Append tool results as user message      │
│     messages.push({role: 'user',             │
│       content: [{type:'tool_result',...}]})  │
└────────────────┬────────────────────────────┘
                 │
                 └──────────────► back to step 2
```

## Complete Python implementation

```python
import anthropic

client = anthropic.Anthropic()

def run_agent(prompt: str, tools: list) -> str:
    messages = [{"role": "user", "content": prompt}]

    while True:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            tools=tools,
            messages=messages
        )

        # ALWAYS check stop_reason — never check text content
        if response.stop_reason == "end_turn":
            return response.content[0].text

        if response.stop_reason != "tool_use":
            # Handle max_tokens, stop_sequence, etc.
            raise RuntimeError(f"Unexpected stop_reason: {response.stop_reason}")

        # Append Claude's response (including tool call requests) to history
        messages.append({"role": "assistant", "content": response.content})

        # Execute all requested tool calls
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = execute_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": str(result)
                })

        # Append tool results — loop continues
        messages.append({"role": "user", "content": tool_results})
```

## Controlling the loop

### Turn budget
```python
# Cap by number of tool-use turns
for attempt in query(prompt=task, options=ClaudeAgentOptions(max_turns=10)):
    ...

# Cap by cost
for attempt in query(prompt=task, options=ClaudeAgentOptions(max_budget_usd=0.50)):
    ...
```

### Why `max_turns` is a safety cap, not a primary stop mechanism
Setting `max_turns=10` as your **only** stop condition is an anti-pattern. The correct primary stop is `stop_reason === "end_turn"`. `max_turns` is a safety net for runaway loops on open-ended prompts.

## Multiple tool calls in one response

Claude can request multiple tool calls in a single response. Your loop must handle **all of them** before returning results:

```python
# Claude may return multiple tool_use blocks in one response
for block in response.content:
    if block.type == "tool_use":
        # Execute ALL tool calls before appending results
        tool_results.append(execute_tool(block.name, block.input))

# Append ALL results together in one user message
messages.append({"role": "user", "content": tool_results})
```

## The order-of-operations rule

**Always append the assistant message BEFORE the tool results.** This maintains proper role alternation in the conversation history. The API requires `user → assistant → user → assistant...` alternation.

```python
# ✅ Correct order
messages.append({"role": "assistant", "content": response.content})  # First
messages.append({"role": "user", "content": tool_results})            # Second

# ❌ Wrong — never skip appending the assistant message
messages.append({"role": "user", "content": tool_results})  # Missing assistant turn!
```

## Official documentation
- [Agent SDK — how the loop works](https://platform.claude.com/docs/en/agent-sdk/agent-loop)
- [Tool use overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
