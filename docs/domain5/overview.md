---
id: overview
title: Domain 5 — Context Management & Reliability
sidebar_label: Overview (15%)
---

# Domain 5 — Context Management & Reliability

**Exam weight: 15%**

This domain tests your ability to manage context windows effectively, design reliable escalation patterns, preserve information provenance across multi-agent handoffs, and build resilient production systems.

## What this domain tests

| Task Statement | Description |
|---|---|
| 5.1 | Apply context window management strategies for long documents |
| 5.2 | Design reliable escalation patterns that avoid self-reported confidence |
| 5.3 | Preserve information provenance across multi-agent handoffs |
| 5.4 | Implement graceful degradation and error resilience |
| 5.5 | Optimize cost with prompt caching |

## Attention dilution — the "lost in the middle" problem

**Symptom:** Agent misses details from the middle of long documents or contexts.

**Root cause:** Transformer models give less reliable attention to content in the middle of long contexts. This is a property of the architecture, not a context window size limitation.

**Critical misconception the exam tests:**

```
❌ Wrong:  "Use a model with a 200K context window to process the full document at once"
✅ Right:  "Split into focused per-section passes, then run a synthesis pass"
```

A larger context window does NOT fix attention dilution — it just moves the diluted zone. The fix is always focused passes:

```python
# ❌ Wrong — stuffing 200 pages into one call
response = client.messages.create(
    messages=[{"role": "user", "content": entire_200_page_document}]
)

# ✅ Right — focused section passes
section_summaries = []
for section in split_into_sections(document):
    summary = client.messages.create(
        messages=[{"role": "user", "content": f"Analyze this section:\n\n{section}"}]
    )
    section_summaries.append(summary)

# Final integration pass
final_report = client.messages.create(
    messages=[{"role": "user", "content": f"Synthesize these section analyses:\n\n{section_summaries}"}]
)
```

## Escalation patterns

### Why self-reported confidence fails

LLMs are poorly calibrated — they express high confidence on questions they answer incorrectly. This means the cases that **most need escalation** are exactly the ones the model will most confidently say it can handle.

```
❌ Wrong escalation signal:
"I'm only 70% confident about this refund policy — escalating to human"

✅ Correct escalation signals (programmatic):
- Required field `policy_tier` not found in get_customer response
- Refund amount > $500 (policy threshold)
- Tool error count > 3 in this session
- Issue category in ["fraud", "legal", "executive"] (hardcoded escalation list)
```

### Escalation architecture

```python
def should_escalate(session_state: dict, extracted: dict) -> bool:
    # Programmatic rules — not Claude's self-assessment
    if session_state['tool_errors'] > 3:
        return True
    if extracted.get('refund_amount', 0) > 500:
        return True
    if not extracted.get('customer_verified', False):
        return True
    if extracted.get('issue_category') in ESCALATION_CATEGORIES:
        return True
    return False
```

### Structured handoff for human escalation

When escalating to a human agent who lacks session access:

```json
{
  "customer_id": "CUS-48291",
  "issue_summary": "Billing dispute — charged twice for March subscription",
  "root_cause": "Duplicate charge identified in order ORD-9912 and ORD-9913",
  "actions_taken": ["Verified customer identity", "Confirmed duplicate charge", "Applied $29.99 credit for ORD-9913"],
  "recommended_action": "Confirm credit applied and send confirmation email",
  "escalation_reason": "Customer requesting formal refund receipt — requires accounting team",
  "session_started": "2026-03-26T14:22:00Z"
}
```

The handoff must be **self-contained** — the human should not need to read the conversation to act.

## Information provenance

In multi-agent pipelines, every claim in the final output must be traceable to a source.

**Coordinator → subagent context passing (with provenance):**

```json
{
  "research_findings": [
    {
      "claim": "Global AI market projected to reach $1.8T by 2030",
      "source_id": "src_001",
      "source_url": "https://...",
      "source_title": "McKinsey AI Report 2026",
      "retrieved_at": "2026-03-26",
      "page": 14
    }
  ]
}
```

**Synthesis schema (with citations):**

```json
{
  "sections": [
    {
      "title": "Market Size",
      "content": "...",
      "citation_ids": ["src_001", "src_003"]
    }
  ]
}
```

## Prompt caching

Cache the KV state of repeated prompt prefixes to reduce cost:

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    system=[
        {
            "type": "text",
            "text": large_system_prompt,  # 50K tokens shared across all requests
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[{"role": "user", "content": user_query}]
)
```

**When caching helps most:** large stable prefixes (system prompts, few-shot sets, large reference documents) reused across many requests.

**Cache invalidation:** any change — even a single character — breaks the prefix match and forces full re-processing. Version or date stamps in system prompts destroy cache hit rates.

## Resilience patterns

### Per-item error isolation

```python
results = []
for doc in documents:
    try:
        result = extract(doc)
        results.append(result)
    except Exception as e:
        # Fail this document without affecting others
        results.append({
            "doc_id": doc['id'],
            "status": "failed",
            "error": str(e),
            "requires_review": True
        })
# Continue processing — one failure doesn't stop the batch
```

### Rolling context summaries for long conversations

```python
def compress_history(messages: list, threshold: int = 40) -> list:
    if len(messages) < threshold:
        return messages

    # Summarize early messages
    summary = summarize(messages[:-20])  # keep last 20 turns verbatim
    return [
        {"role": "user", "content": f"[Conversation summary]\n{summary}"},
        {"role": "assistant", "content": "Understood. Continuing from that context."},
        *messages[-20:]
    ]
```

## Official documentation

- [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
- [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [Claude Code — memory and sessions](https://code.claude.com/docs/en/memory)
