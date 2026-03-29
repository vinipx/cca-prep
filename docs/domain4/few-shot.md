---
id: few-shot
title: Few-shot prompting
sidebar_label: Few-shot techniques
---

# Few-shot prompting

## What few-shot can and cannot do

| Few-shot IS effective for | Few-shot IS NOT effective for |
|---|---|
| Demonstrating output format | Guaranteeing compliance with rules |
| Showing reasoning patterns | Enforcing tool ordering |
| Handling specific ambiguity types | Policy enforcement |
| Calibrating tone and style | Preventing prohibited behavior |
| Edge case classification | Deterministic workflow control |

**The exam rule:** If the requirement uses "always", "never", or "every time" — use programmatic enforcement, not few-shot.

## Format demonstration

```python
system = """Extract product information from listings.

Examples:

Input: "Apple MacBook Pro 14-inch, M3 Pro, 18GB RAM, 512GB SSD, Space Black"
Output: {"brand": "Apple", "model": "MacBook Pro 14-inch", "specs": {"chip": "M3 Pro", "ram_gb": 18, "storage_gb": 512}, "color": "Space Black", "category": "laptops"}

Input: "Sony WH-1000XM5 Wireless Noise Canceling Headphones - Midnight Black"
Output: {"brand": "Sony", "model": "WH-1000XM5", "specs": {"type": "wireless", "feature": "noise_canceling"}, "color": "Midnight Black", "category": "headphones"}

Input: "Logitech MX Master 3S Performance Wireless Mouse, Pale Gray"
Output: {"brand": "Logitech", "model": "MX Master 3S", "specs": {"connectivity": "wireless", "tier": "performance"}, "color": "Pale Gray", "category": "mice"}

Now extract from:"""
```

## Ambiguity handling

Teach Claude how to handle the specific ambiguity types in your data:

```python
system = """Classify support tickets. When the category is ambiguous, use these rules:

Example — billing question that mentions a technical issue:
Input: "I was charged twice for my subscription and now my account is locked"
Reasoning: Primary issue is billing (duplicate charge). Account lock is a consequence.
Output: {"category": "billing", "subcategory": "duplicate_charge", "secondary": "account_access"}

Example — technical issue that mentions a billing term:
Input: "The premium features I'm paying for aren't working on my mobile app"
Reasoning: Primary issue is technical (features broken). Subscription context is background.
Output: {"category": "technical", "subcategory": "feature_not_working", "platform": "mobile"}

Now classify:"""
```

## CI/CD review quality calibration

For CI code review, include both good and bad review comment examples:

```python
system = """Review this code change for security issues.

Good review comment (specific, actionable):
Code: `db.query("SELECT * FROM users WHERE name = '" + username + "'")`
Comment: "SQL injection vulnerability on line 47. User input is concatenated directly into the query string. Replace with parameterized query: `db.query('SELECT * FROM users WHERE name = ?', [username])`"

Bad review comment (vague, not actionable — do not write comments like this):
Code: `db.query("SELECT * FROM users WHERE name = '" + username + "'")`
Comment: "This might have security issues. Consider sanitizing inputs."

Known safe patterns for this codebase (do NOT flag these):
- `eval()` in /sandbox/ — reviewed by security team, approved 2026-01-15
- Dynamic require() in /scripts/build.js — build tooling only

Review the following diff:"""
```

## Official documentation
- [Prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)
