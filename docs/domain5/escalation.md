---
id: escalation
title: Escalation patterns & reliability
sidebar_label: Escalation & reliability
---

# Escalation patterns & reliability

## Rule-based vs. confidence-based escalation

The exam consistently tests this distinction. Self-reported confidence is always wrong as a primary escalation signal.

```python
# ❌ Confidence-based (unreliable)
def should_escalate(response: str) -> bool:
    uncertain_phrases = ["I'm not sure", "I'm uncertain", "I'm not confident", "might be"]
    return any(phrase in response.lower() for phrase in uncertain_phrases)
# Problem: Claude says "I'm not sure" on easy questions and is confident on hard ones

# ✅ Rule-based (reliable)
def should_escalate(session_state: dict, extracted: dict) -> tuple[bool, str]:
    # Policy threshold
    if extracted.get("refund_amount", 0) > 500:
        return True, "refund_over_limit"

    # Required data missing
    if not extracted.get("customer_verified"):
        return True, "identity_not_verified"

    # Tool failure count
    if session_state.get("tool_errors", 0) > 3:
        return True, "excessive_tool_failures"

    # Category requires human
    if extracted.get("issue_category") in {"fraud", "legal", "executive_complaint"}:
        return True, "escalation_category"

    return False, None
```

## Structured handoff protocol

When escalating to a human, the handoff must be self-contained:

```python
def build_escalation_handoff(session: dict) -> dict:
    return {
        # Identity
        "customer_id": session["customer_id"],
        "customer_name": session.get("customer_name"),
        "account_tier": session.get("account_tier"),

        # Issue
        "issue_summary": session["issue_summary"],
        "root_cause": session["determined_root_cause"],

        # Actions already taken
        "actions_taken": session["completed_actions"],
        "credits_applied": session.get("credits_applied", []),

        # Escalation context
        "escalation_reason": session["escalation_reason"],
        "escalation_trigger": session["escalation_trigger_rule"],
        "recommended_next_action": session["recommended_action"],

        # Metadata
        "session_started": session["start_time"],
        "escalated_at": datetime.utcnow().isoformat(),
        "conversation_reference": session["session_id"]
    }
```

## Per-item error isolation

```python
def process_document_batch(documents: list) -> dict:
    results = []

    for doc in documents:
        try:
            # Process one document at a time
            result = extract_document(doc)
            results.append({
                "id": doc["id"],
                "status": "success",
                "data": result
            })

        except ValidationError as e:
            # Failed document doesn't stop the batch
            results.append({
                "id": doc["id"],
                "status": "validation_failed",
                "error": str(e),
                "requires_human_review": True
            })

        except Exception as e:
            results.append({
                "id": doc["id"],
                "status": "error",
                "error": str(e),
                "requires_human_review": True
            })

    return {
        "total": len(documents),
        "succeeded": sum(1 for r in results if r["status"] == "success"),
        "failed": sum(1 for r in results if r["status"] != "success"),
        "results": results
    }
```

## Circuit breaker pattern

```python
class CircuitBreaker:
    def __init__(self, failure_threshold: int = 5, recovery_time: int = 60):
        self.failure_count = 0
        self.failure_threshold = failure_threshold
        self.state = "closed"  # closed = normal operation
        self.last_failure_time = None
        self.recovery_time = recovery_time

    def call(self, fn, *args, **kwargs):
        if self.state == "open":
            if time.time() - self.last_failure_time > self.recovery_time:
                self.state = "half-open"
            else:
                raise CircuitOpenError("Circuit breaker open — service unavailable")

        try:
            result = fn(*args, **kwargs)
            if self.state == "half-open":
                self.state = "closed"
                self.failure_count = 0
            return result

        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()
            if self.failure_count >= self.failure_threshold:
                self.state = "open"  # Stop trying, alert ops
            raise
```

## Official documentation
- [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
