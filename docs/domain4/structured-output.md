---
id: structured-output
title: Structured output & JSON schemas
sidebar_label: Structured output
---

# Structured output & JSON schemas

## Defining a schema in the system prompt

```python
system = """You are a data extraction assistant.
Always respond with valid JSON matching exactly this schema:

{
  "invoice_number": "string — the invoice ID exactly as printed",
  "vendor_name": "string — full legal company name",
  "invoice_date": "string — ISO 8601 format: YYYY-MM-DD",
  "due_date": "string — ISO 8601 format: YYYY-MM-DD",
  "subtotal": "number — in the invoice's currency, no currency symbol",
  "tax_amount": "number — total tax, 0 if none",
  "total_amount": "number — final total including tax",
  "currency_code": "string — ISO 4217: USD, EUR, GBP, JPY, etc.",
  "line_items": [
    {
      "description": "string",
      "quantity": "number",
      "unit_price": "number",
      "line_total": "number"
    }
  ]
}

Rules:
- Respond ONLY with the JSON object
- No preamble, no explanation, no markdown code fences
- If a field cannot be determined, use null (never omit the field)
- Dates must always be ISO 8601 (YYYY-MM-DD), never "March 15" or "15/03/2026"
"""
```

## strict: true for guaranteed schema compliance

When using tool_use for extraction, `strict: true` enforces schema compliance at the API level:

```python
extraction_tool = {
    "name": "extract_invoice",
    "description": "Extract structured data from an invoice",
    "input_schema": {
        "type": "object",
        "properties": {
            "invoice_number": {"type": "string"},
            "vendor_name": {"type": "string"},
            "invoice_date": {"type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$"},
            "total_amount": {"type": "number"},
            "currency_code": {
                "type": "string",
                "enum": ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"]
            }
        },
        "required": ["invoice_number", "vendor_name", "invoice_date", "total_amount", "currency_code"]
    },
    "strict": True  # API guarantees schema compliance
}
```

## Validation retry loop: full implementation

```python
import json
import jsonschema
from anthropic import Anthropic

client = Anthropic()

def extract_with_validation(document: str, schema: dict, max_retries: int = 3) -> dict:
    messages = [{"role": "user", "content": document}]
    system = build_extraction_system_prompt(schema)

    for attempt in range(max_retries + 1):
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2048,
            system=system,
            messages=messages
        )
        raw_text = response.content[0].text

        # Parse JSON
        try:
            result = json.loads(raw_text)
        except json.JSONDecodeError as e:
            if attempt == max_retries:
                return {"status": "failed", "requires_human_review": True,
                        "error": f"Invalid JSON: {e}"}
            messages.append({"role": "assistant", "content": raw_text})
            messages.append({"role": "user", "content":
                f"Your response was not valid JSON. Parse error: {e}\n"
                f"Please respond with only a valid JSON object."})
            continue

        # Validate schema
        try:
            jsonschema.validate(result, schema)
            return {"status": "success", "data": result}  # ✅

        except jsonschema.ValidationError as e:
            if attempt == max_retries:
                return {"status": "failed", "requires_human_review": True,
                        "data": result, "error": str(e)}

            # ✅ Specific, actionable error feedback
            field_path = " → ".join(str(p) for p in e.absolute_path) or "root"
            error_feedback = (
                f"Schema validation failed:\n"
                f"Field: {field_path}\n"
                f"Problem: {e.message}\n"
                f"You provided: {json.dumps(e.instance)}\n"
            )
            if "enum" in str(e.schema):
                valid_values = e.schema.get("enum", [])
                error_feedback += f"Valid values are: {valid_values}\n"

            messages.append({"role": "assistant", "content": raw_text})
            messages.append({"role": "user", "content":
                f"Your response failed validation. Please correct and regenerate.\n\n{error_feedback}"})
```

## Graceful degradation for persistent failures

```python
def process_batch(documents: list) -> dict:
    results = {"processed": [], "failed": [], "needs_review": []}

    for doc in documents:
        result = extract_with_validation(doc["content"], SCHEMA)

        if result["status"] == "success":
            results["processed"].append({**doc, "data": result["data"]})
        else:
            # Don't drop failed items — route to human review
            results["needs_review"].append({
                "doc_id": doc["id"],
                "error": result["error"],
                "partial_data": result.get("data"),
                "requires_human_review": True
            })

    return results
```

## Official documentation
- [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- [Tool use — strict mode](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
