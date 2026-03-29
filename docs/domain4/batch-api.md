---
id: batch-api
title: Message Batches API
sidebar_label: Batch API
---

# Message Batches API

## The core trade-off

| Property | Batches API | Synchronous API |
|---|---|---|
| Cost | ~50% less | Full price |
| Latency | Up to 24 hours | Milliseconds |
| SLA | None | Standard |
| Concurrency | Managed by Anthropic | You manage |
| Use case | Background, non-interactive | Real-time, interactive |

## When to use Batches

Use Batches API when **all** of these are true:

✅ No user is waiting for the response  
✅ The deadline is measured in hours, not seconds  
✅ The job is high-volume (100+ requests)  
✅ 50% cost savings justifies variable completion time  

## When NOT to use Batches

❌ Live chat or search (user expects sub-second response)  
❌ Blocking pipeline step (downstream needs the result now)  
❌ Hard SLA exists (must complete by X:00 AM)  
❌ Low-volume one-off queries (overhead not worth it)  

## Implementation

```python
import anthropic

client = anthropic.Anthropic()

# Submit a batch
batch = client.beta.messages.batches.create(
    requests=[
        {
            "custom_id": f"support-ticket-{ticket['id']}",
            "params": {
                "model": "claude-haiku-4-5-20251001",  # Use Haiku for cost efficiency
                "max_tokens": 256,
                "system": "Classify this support ticket into one category.",
                "messages": [{"role": "user", "content": ticket["text"]}]
            }
        }
        for ticket in tickets  # Could be 50,000+ tickets
    ]
)

batch_id = batch.id
print(f"Batch submitted: {batch_id}")

# Come back later (or use a webhook) to collect results
# The batch has a 24-hour processing window
```

```python
# Collect results (run this the next morning)
batch = client.beta.messages.batches.retrieve(batch_id)

if batch.processing_status == "ended":
    for result in client.beta.messages.batches.results(batch_id):
        if result.result.type == "succeeded":
            process_classification(
                ticket_id=result.custom_id,
                response=result.result.message.content[0].text
            )
        else:
            log_failure(result.custom_id, result.result.error)
```

## Cost calculation example

```
50,000 support tickets × avg 500 input tokens + 100 output tokens

Synchronous API (claude-haiku-4-5-20251001):
  50,000 × (500 × $0.80/M + 100 × $4.00/M)
  = 50,000 × ($0.0004 + $0.0004) = $40.00

Batches API (~50% discount):
  ≈ $20.00

Savings: $20 per batch run × daily = $7,300/year
```

## Official documentation
- [Message Batches API](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
