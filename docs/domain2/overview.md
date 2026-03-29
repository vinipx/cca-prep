---
id: overview
title: Domain 2 — Tool Design & MCP Integration
sidebar_label: Overview (18%)
---

# Domain 2 — Tool Design & MCP Integration

**Exam weight: 18%**

This domain tests your ability to design reliable MCP tool interfaces, write effective tool descriptions, handle errors correctly, and configure tool access for multi-agent systems.

## What this domain tests

| Task Statement | Description |
|---|---|
| 2.1 | Design effective tool interfaces with clear descriptions and boundaries |
| 2.2 | Implement structured error responses for MCP tools |
| 2.3 | Distribute tools appropriately across agents and configure tool choice |

## Tool descriptions are the routing mechanism

Claude has no routing layer beyond the tool descriptions. When deciding which tool to call, Claude reads each tool's description and picks the best match. This means:

- **Minimal descriptions → misrouting**
- **Overlapping descriptions → unpredictable selection**
- **Well-differentiated descriptions → reliable routing**

### What a good tool description includes

1. **What it does** — specific, not generic ("Searches internal company knowledge base for policy documents" not "Searches for information")
2. **Required input format** — e.g., "Takes a `customer_id` string (format: CUS-XXXXXXXX)"
3. **What it returns** — e.g., "Returns customer profile including tier, history, and open cases"
4. **When to use it vs. alternatives** — e.g., "Use this for customer data. For order data, use `lookup_order` instead."
5. **Edge cases** — e.g., "Returns empty array if no records found — this is NOT an error"

### Splitting generic tools

```
❌ BEFORE: analyze_document (description: "Analyzes a document")
           analyze_content  (description: "Analyzes content")

✅ AFTER:  extract_web_results   — "Extracts structured data from web search results.
                                   Input: raw HTML/text from web. Returns: title, url,
                                   summary, date. Use for web content only."

           parse_pdf_sections    — "Extracts sections and metadata from PDF documents.
                                   Input: PDF bytes or path. Returns: sections[], page_count,
                                   metadata. Use for PDF files only, not web content."

           query_database_record — "Queries structured customer/transaction database by ID.
                                   Input: record_id string. Returns: typed fields per schema.
                                   Use when you have a specific record ID to look up."
```

## MCP error structure

Every MCP tool error response must include these fields:

```typescript
interface MCPErrorResponse {
  isError: true;
  errorCategory: 'transient' | 'validation' | 'business' | 'permission';
  isRetryable: boolean;
  message: string; // human-readable, specific
}
```

### Error categories and recovery

| Category | Example | `isRetryable` | Agent action |
|---|---|---|---|
| `transient` | DB timeout, service unavailable | `true` | Retry with backoff |
| `validation` | Invalid input format | `false` | Fix input, don't retry |
| `business` | Refund exceeds limit | `false` | Escalate, communicate to user |
| `permission` | Access denied | `false` | Rotate credentials or escalate |

### Empty result vs. error — critical distinction

```json
// ✅ Successful query, no records found — NOT an error
{ "isError": false, "content": [], "message": "No orders found for customer CUS-48291" }

// ❌ Execution failed — IS an error
{ "isError": true, "errorCategory": "transient", "isRetryable": true, "message": "DB timeout" }
```

Treating empty results as errors causes agents to retry successful queries indefinitely.

## Tool scoping

**Principle: give each agent only the tools it needs for its role.**

```
Research coordinator:    ["Task", "search_web"]
Web search subagent:     ["search_web", "fetch_page"]
Document analysis agent: ["read_file", "extract_document_sections"]
Synthesis agent:         ["summarize_findings"]   ← no web search!
Report agent:            ["format_report", "write_file"]
```

Why 4–5 tools max per agent:
- More tools = more decision complexity = worse selection reliability
- Out-of-role tools get misused (synthesis agent calling web search)
- Security principle: least privilege

## `tool_choice` configuration

```typescript
// Auto — Claude decides whether to use any tool
tool_choice: "auto"

// Any — Claude must use at least one tool
tool_choice: "any"

// Forced — Claude must call this specific tool
tool_choice: { type: "tool", name: "extract_structured_data" }
```

Use forced `tool_choice` when a specific pipeline step always requires a specific tool — e.g., the extraction step in a structured data pipeline must always call `extract_structured_data`.

## `strict: true` for schema validation

Adding `strict: true` to a tool definition enables **Structured Outputs mode** — guaranteeing Claude's tool calls always match your schema:

```python
tools = [{
    "name": "classify_ticket",
    "description": "Classify a support ticket",
    "input_schema": {
        "type": "object",
        "properties": {
            "category": {
                "type": "string",
                "enum": ["billing", "technical", "account", "other"]
            },
            "priority": { "type": "integer", "minimum": 1, "maximum": 5 }
        },
        "required": ["category", "priority"]
    },
    "strict": True  # ← guarantees schema compliance
}]
```

## System prompt conflicts

System prompt wording can unintentionally trigger specific tool invocations. If your system prompt says "analyze content from each URL," the phrase "analyze content" may cause Claude to preferentially invoke an `analyze_content` tool even when a different tool is more appropriate.

**Audit your system prompt for phrases that match tool names.**

## Official documentation

- [Tool use overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
- [MCP documentation](https://modelcontextprotocol.io/docs)
- [Structured outputs with tools](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
