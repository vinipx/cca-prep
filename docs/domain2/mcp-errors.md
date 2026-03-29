---
id: mcp-errors
title: MCP error handling
sidebar_label: MCP error handling
---

# MCP error handling

## The complete error response structure

```typescript
// Every MCP tool failure must return this structure
interface MCPErrorResponse {
  isError: true;
  errorCategory: 'transient' | 'validation' | 'business' | 'permission';
  isRetryable: boolean;
  message: string;        // Specific human-readable description
  retryAfterMs?: number;  // Optional: hint for retry backoff
}
```

## Error category reference

| Category | Meaning | `isRetryable` | Agent action |
|---|---|---|---|
| `transient` | Temporary failure: DB timeout, service down | `true` | Retry with exponential backoff |
| `validation` | Bad input: wrong format, missing required field | `false` | Fix input before retrying |
| `business` | Policy violation: limit exceeded, not allowed | `false` | Escalate or communicate to user |
| `permission` | Access denied: no auth, wrong scope | `false` | Rotate credentials or escalate |

## The critical empty-result distinction

```json
// ✅ Successful query, no records found
// isError: false — this is NOT an error
// The agent should accept this and continue
{
  "isError": false,
  "content": [],
  "message": "No orders found for customer CUS-48291 in the last 90 days"
}

// ❌ Tool execution failed
// isError: true — agent must handle the failure
{
  "isError": true,
  "errorCategory": "transient",
  "isRetryable": true,
  "message": "Database connection timeout after 30 seconds"
}
```

**Why this matters:** An agent that treats empty results as errors will retry a successful query endlessly. An agent that treats errors as empty results will silently miss data.

## Implementing the error structure

```python
# MCP tool implementation
def get_customer(customer_id: str) -> dict:
    try:
        customer = db.query("SELECT * FROM customers WHERE id = ?", customer_id)

        if customer is None:
            # Not an error — valid query, no matching record
            return {
                "isError": False,
                "content": [],
                "message": f"No customer found with ID {customer_id}"
            }

        return {"isError": False, "content": [customer]}

    except DatabaseTimeout:
        return {
            "isError": True,
            "errorCategory": "transient",
            "isRetryable": True,
            "message": "Database connection timeout. Retry is appropriate.",
            "retryAfterMs": 2000
        }

    except PermissionDenied:
        return {
            "isError": True,
            "errorCategory": "permission",
            "isRetryable": False,
            "message": "Agent does not have permission to access customer records"
        }
```

## Agent-side error handling

```python
def handle_tool_result(tool_name: str, result: dict) -> None:
    if not result.get("isError"):
        # Success — content may be empty (that's fine)
        process_content(result.get("content", []))
        return

    category = result.get("errorCategory")
    if result.get("isRetryable") and retry_count < MAX_RETRIES:
        schedule_retry(tool_name, result.get("retryAfterMs", 1000))
    elif category == "business":
        escalate_to_human(reason=result["message"])
    elif category == "permission":
        alert_operations(f"Permission error on {tool_name}: {result['message']}")
    else:
        log_failure(tool_name, result)
        propagate_to_coordinator(result)
```

## Official documentation
- [MCP documentation](https://modelcontextprotocol.io/docs)
- [Tool use overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
