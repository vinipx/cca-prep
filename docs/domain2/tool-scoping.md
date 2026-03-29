---
id: tool-scoping
title: Tool scoping & tool_choice
sidebar_label: Tool scoping
---

# Tool scoping & tool_choice

## The principle: least privilege for tools

Every agent should have only the tools it needs for its current role. This is not just a best practice — it directly affects tool selection reliability.

**Why fewer tools = better selection:**
- With 4-5 tools, each tool description is distinct and salient
- With 18 tools, descriptions compete and Claude makes worse choices
- Out-of-role tools get misused (a synthesis agent with web search will sometimes search when it should synthesize)

## Task-scoped tool profiles

```python
# Exploration phase — read only
exploration_options = ClaudeAgentOptions(
    allowed_tools=["Read", "Glob", "Grep"],
    permission_mode="default"
)

# Development phase — add write and quality tools
development_options = ClaudeAgentOptions(
    allowed_tools=["Read", "Glob", "Grep", "Write", "Bash"],
    permission_mode="acceptEdits"
)

# Deployment phase — add deployment tools
deployment_options = ClaudeAgentOptions(
    allowed_tools=["Read", "Glob", "Grep", "Write", "Bash",
                   "run_tests", "deploy_staging", "notify_team"],
    permission_mode="acceptEdits"
)
```

## tool_choice configuration

```python
# Auto — Claude decides whether to use a tool (default)
{"tool_choice": "auto"}

# Any — Claude must use at least one tool
{"tool_choice": "any"}

# Forced — Claude must call this specific tool
{"tool_choice": {"type": "tool", "name": "extract_invoice_data"}}
```

**Use forced tool_choice for pipeline steps** where you know exactly which tool must run:

```python
# Extraction pipeline — always use the extraction tool
extraction_response = client.messages.create(
    model="claude-sonnet-4-6",
    tools=[extraction_tool],
    tool_choice={"type": "tool", "name": "extract_invoice_data"},
    messages=[{"role": "user", "content": invoice_text}]
)
```

## Subagent tool assignment example

```python
SUBAGENT_TOOLS = {
    "web_search_agent": [
        "search_web",           # primary function
        "fetch_page_content",   # needed for web work
    ],
    "doc_analysis_agent": [
        "read_pdf",             # primary function
        "extract_tables",       # document-specific
        "search_document_text", # document-specific
    ],
    "synthesis_agent": [
        "format_citations",     # synthesis-specific
        "check_consistency",    # synthesis-specific
        # NO web search — synthesis agents shouldn't search
    ],
    "coordinator": [
        "Task",                 # required to spawn subagents
        "search_web",           # coordinator-level web check
    ]
}
```

## Official documentation
- [Tool use overview — tool_choice](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
- [Agent SDK — permissions](https://platform.claude.com/docs/en/agent-sdk/agent-loop)
