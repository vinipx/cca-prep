---
id: hooks
title: Agent SDK hooks
sidebar_label: Hooks & enforcement
---

# Agent SDK hooks

Hooks are functions invoked by the **SDK** (not by Claude) at specific points in the agent loop. They provide deterministic, guaranteed behavior — the key property that separates them from prompt instructions.

## Why hooks beat prompt instructions for enforcement

| | Hooks | Prompt instructions |
|---|---|---|
| Failure rate | 0% (code runs or errors) | ~1-3% on compliance paths |
| Appropriate for | Business rules, policies, data normalization | Style, preference, guidance |
| Auditability | Full — logged as code execution | None — invisible reasoning |
| Override-ability | Cannot be circumvented by Claude | Can be "forgotten" in long contexts |

**The exam rule:** if the word "always", "never", "must", or "every time" appears in a requirement — use a hook, not a prompt instruction.

## Hook types

### PostToolUse — normalize data after tool execution

```python
from claude_agent_sdk import query, ClaudeAgentOptions

def normalize_timestamps(tool_name: str, tool_result: dict) -> dict:
    """Normalize all timestamp formats to ISO 8601 before Claude sees them."""
    if "created_at" in tool_result:
        # Convert Unix timestamp to ISO 8601
        if isinstance(tool_result["created_at"], (int, float)):
            tool_result["created_at"] = datetime.fromtimestamp(
                tool_result["created_at"]
            ).isoformat()
    if "status" in tool_result:
        # Convert numeric status codes to human-readable strings
        STATUS_MAP = {1: "active", 2: "suspended", 3: "closed"}
        tool_result["status"] = STATUS_MAP.get(tool_result["status"], "unknown")
    return tool_result

options = ClaudeAgentOptions(
    post_tool_use_hooks=[normalize_timestamps]
)
```

### Pre-execution hook — block policy violations

```python
def enforce_refund_policy(tool_name: str, tool_input: dict) -> dict | None:
    """
    Block refunds over $500 and redirect to human escalation.
    Returns None to allow the call, or a modified input/error to block it.
    """
    if tool_name == "process_refund":
        amount = tool_input.get("amount", 0)
        if amount > 500:
            # Block the call and return an error result instead
            return {
                "error": True,
                "message": f"Refund of ${amount} exceeds the $500 automated limit.",
                "action_required": "escalate_to_human",
                "reason": "refund_over_limit"
            }
    return None  # Allow the call to proceed

options = ClaudeAgentOptions(
    pre_tool_use_hooks=[enforce_refund_policy]
)
```

## Common hook use cases

| Use case | Hook type | Example |
|---|---|---|
| Data normalization | PostToolUse | Timestamps, status codes, currency formats |
| Policy enforcement | Pre-execution | Refund limits, write permissions |
| Audit logging | PostToolUse | Log all tool calls to observability system |
| Rate limiting | Pre-execution | Prevent too many API calls in a session |
| Path restrictions | Pre-execution | Block file writes outside /src and /tests |
| Prerequisite gates | Pre-execution | Require `get_customer` before `process_refund` |

## Prerequisite gate pattern

This is the canonical exam pattern — enforce step ordering deterministically:

```python
session_state = {"customer_verified": False, "customer_id": None}

def prerequisite_gate(tool_name: str, tool_input: dict) -> dict | None:
    """Block financial operations until identity is verified."""

    if tool_name == "get_customer":
        # Allow through — this is the prerequisite step
        return None

    if tool_name in ["process_refund", "process_payment", "update_account"]:
        if not session_state["customer_verified"]:
            return {
                "error": True,
                "message": "Identity verification required before financial operations.",
                "required_action": "call get_customer first",
                "blocked_tool": tool_name
            }
    return None

def on_tool_result(tool_name: str, result: dict) -> dict:
    """Track when verification completes."""
    if tool_name == "get_customer" and result.get("verified"):
        session_state["customer_verified"] = True
        session_state["customer_id"] = result.get("customer_id")
    return result

options = ClaudeAgentOptions(
    pre_tool_use_hooks=[prerequisite_gate],
    post_tool_use_hooks=[on_tool_result]
)
```

## Official documentation
- [Agent SDK Python repo (hooks examples)](https://github.com/anthropics/claude-agent-sdk-python)
- [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
