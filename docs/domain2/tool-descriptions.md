---
id: tool-descriptions
title: Writing effective tool descriptions
sidebar_label: Tool descriptions
---

# Writing effective tool descriptions

Tool descriptions are the **only routing signal** Claude has for tool selection. Everything else — tool names, parameter names, system prompts — is secondary.

## The anatomy of a bad description

```python
# ❌ These descriptions cause misrouting in production
tools = [
    {"name": "search_kb",  "description": "Searches for information"},
    {"name": "search_web", "description": "Searches for information"},
    {"name": "search_db",  "description": "Searches for information"},
]
```

With identical descriptions, Claude cannot distinguish between tools. Selection becomes random.

## The anatomy of a good description

Each description must answer five questions:

1. **What does this tool do** — specifically, not generically
2. **What input does it take** — format, type, constraints
3. **What does it return** — fields, types, what "empty" means
4. **When to use it** — the trigger condition
5. **When NOT to use it** — disambiguation from similar tools

```python
# ✅ Descriptions that route correctly
tools = [
    {
        "name": "search_kb",
        "description": """Search the internal company knowledge base for policy documents,
        product documentation, and internal procedures.

        INPUT: Natural language query string. Best for: policy questions,
        internal process questions, product feature questions.

        RETURNS: Array of {doc_id, title, excerpt, last_updated}.
        Returns empty array if no internal documents match — this is NOT an error.

        USE THIS when the question is about internal company information.
        DO NOT USE for current events, external facts, or customer-specific data."""
    },
    {
        "name": "search_web",
        "description": """Search the public internet for current information,
        news, external documentation, and publicly available facts.

        INPUT: Concise search query (3-8 words works best).

        RETURNS: Array of {title, url, snippet, published_date}.

        USE THIS for: current events, competitor information, public API docs,
        anything that changes frequently or lives outside the company.
        DO NOT USE for internal company information — use search_kb instead."""
    },
    {
        "name": "search_db",
        "description": """Query the structured customer and transaction database
        by specific record identifiers.

        INPUT: Object with at least one of: customer_id (string, format CUS-XXXXXXXX),
        order_id (string, format ORD-XXXXXXXX), or date_range {start, end} ISO 8601.

        RETURNS: Typed database records matching the query criteria.
        Returns empty array for no matches — this is a valid successful response.

        USE THIS when you have specific IDs or need structured customer/order data.
        DO NOT USE for general information questions — use search_kb or search_web."""
    }
]
```

## System prompt keyword conflicts

System prompt phrasing can create unintended tool associations:

```
System prompt: "Always analyze the content from each URL before summarizing."
Tool name:     analyze_content

→ "analyze content" in the prompt creates a strong association
   with analyze_content, causing it to fire even for non-URL content.
```

**Audit your system prompt for phrases that contain tool name fragments.**

## Tool splitting: when one tool should become three

Signs a tool needs to be split:
- It takes a `type` parameter that changes its behavior entirely
- Its description has multiple "if X, then Y" branches
- Different callers need different subsets of its functionality
- Misrouting frequency is above 5%

```python
# ❌ Overloaded tool — split this
{"name": "analyze_document",
 "description": "Analyzes a document. If type='web', extracts web content.
                 If type='pdf', extracts PDF sections. If type='db', queries database."}

# ✅ Three focused tools
{"name": "extract_web_content",   "description": "...web-specific..."}
{"name": "extract_pdf_sections",  "description": "...PDF-specific..."}
{"name": "query_database_record", "description": "...DB-specific..."}
```

## Official documentation
- [Tool use overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
