---
id: overview
title: Domain 4 — Prompt Engineering & Structured Output
sidebar_label: Overview (20%)
---

# Domain 4 — Prompt Engineering & Structured Output

**Exam weight: 20%**

This domain tests your ability to engineer prompts that produce reliable structured output, implement validation retry loops, choose between synchronous and batch processing, and design multi-pass review architectures.

## What this domain tests

| Task Statement | Description |
|---|---|
| 4.1 | Engineer prompts for reliable structured output with JSON schemas |
| 4.2 | Implement validation retry loops with specific error feedback |
| 4.3 | Apply few-shot examples for format and style demonstration |
| 4.4 | Decide when to use Message Batches API vs synchronous API |
| 4.5 | Design multi-pass review architectures for complex documents |

## Structured output with JSON schemas

Define schemas explicitly and request JSON output:

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system="""Extract invoice data. Always respond with valid JSON matching this schema:
{
  "invoice_number": "string",
  "vendor_name": "string",
  "total_amount": number,
  "currency_code": "string (ISO 4217: USD, EUR, GBP)",
  "invoice_date": "string (ISO 8601: YYYY-MM-DD)",
  "line_items": [{"description": "string", "amount": number}]
}
Respond ONLY with the JSON object. No preamble, no explanation.""",
    messages=[{"role": "user", "content": invoice_text}]
)
```

### `strict: true` for tool-based extraction

When using tool_use for extraction, `strict: true` guarantees schema compliance at the API level:

```python
tools = [{
    "name": "extract_invoice",
    "input_schema": { ... },
    "strict": True  # Claude's tool call will always match this schema
}]
```

## Validation retry loop

The pattern for self-healing structured output:

```python
import json

def extract_with_retry(text: str, schema: dict, max_retries: int = 3) -> dict:
    messages = [{"role": "user", "content": text}]

    for attempt in range(max_retries):
        response = client.messages.create(model="claude-sonnet-4-6", ...)
        raw = response.content[0].text

        try:
            result = json.loads(raw)
            validate(result, schema)  # e.g., jsonschema.validate
            return result  # ✅ success

        except ValidationError as e:
            if attempt == max_retries - 1:
                # Final attempt failed — route to human review
                return {"status": "failed", "requires_human_review": True, "error": str(e)}

            # ✅ Specific error feedback — not "try again"
            error_feedback = f"""Your response failed validation:
Field: {e.path[-1] if e.path else 'unknown'}
Problem: {e.message}
You returned: {e.instance}
Expected format: {get_field_description(e.path, schema)}

Please regenerate the JSON with this field corrected."""

            messages.append({"role": "assistant", "content": raw})
            messages.append({"role": "user", "content": error_feedback})
```

:::warning The #1 retry mistake
Generic feedback like "That was invalid JSON, try again" does not help Claude self-correct. The feedback must include:
- The **exact field** that failed
- The **expected format** (including examples)
- The **actual wrong value** Claude returned

With specific feedback, correction rates are dramatically higher.
:::

## Few-shot prompting

Few-shot examples demonstrate desired patterns — format, style, reasoning. They are **not** compliance mechanisms.

```python
system = """Extract product categories. Here are examples:

Input: "Apple MacBook Pro 16-inch M3 Pro chip"
Output: {"category": "laptops", "subcategory": "professional", "brand": "Apple"}

Input: "Sony WH-1000XM5 Wireless Headphones"
Output: {"category": "headphones", "subcategory": "over_ear", "brand": "Sony"}

Input: "Logitech MX Master 3S Mouse"
Output: {"category": "mice", "subcategory": "ergonomic", "brand": "Logitech"}

Now extract from this input:"""
```

**Few-shot is effective for:** output format, reasoning style, handling ambiguous inputs (show examples of how to resolve specific ambiguity types)

**Few-shot is NOT effective for:** guaranteeing compliance with ordering or policy rules — use programmatic enforcement for those.

## Message Batches API decision matrix

| Criterion | Batches API ✅ | Synchronous API ✅ |
|---|---|---|
| User waiting? | No — background job | Yes — live query |
| Latency requirement | Hours (24h window) | Seconds (real-time) |
| Volume | High (100–millions) | Any |
| Cost priority | High (50% savings) | Secondary |
| SLA needed? | No | Yes |

**Never use Batches for:**
- Chat or search responses (user is waiting)
- Blocking pipeline steps (downstream needs the result now)
- Anything with a hard latency SLA

```python
# ✅ Correct Batches API use — overnight classification
batch = client.beta.messages.batches.create(
    requests=[
        {"custom_id": f"ticket-{t['id']}", "params": {"model": "claude-haiku-4-5-20251001", "max_tokens": 256, "messages": [...]}}
        for t in tickets  # 50,000 tickets
    ]
)
# Come back tomorrow morning to collect results
```

## Multi-pass review architecture

For complex documents, dedicated passes outperform single-pass:

```
Document (80 pages)
       │
       ▼
Pass 1: Claim extraction      ← only extracts claims, no judgment
       │
       ▼
Pass 2: Source verification   ← only verifies claims against sources
       │
       ▼
Pass 3: Credibility scoring   ← only synthesizes and scores
       │
       ▼
Final report with citations
```

Each pass gets full attention on its single task. Single-pass extraction + verification + scoring suffers from attention dilution and produces lower quality on all three dimensions.

## Official documentation

- [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- [Message Batches API](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
- [Prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)
- [Tool use — strict mode](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
