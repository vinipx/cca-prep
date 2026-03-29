---
id: context-strategies
title: Context management strategies
sidebar_label: Context strategies
---

# Context management strategies

## The attention dilution problem

Transformer models attend less reliably to content in the middle of long contexts. This is not a context window size limitation — it is a property of the attention mechanism.

```
Document position in context vs. attention reliability:

Beginning  ████████████  High reliability
Middle     ████░░░░░░░░  Lower reliability ("lost in the middle")
End        ████████████  High reliability
```

**The exam trap:** "Use a larger context window model" is always the wrong answer for attention dilution. A 200K window helps with fitting the content, but does not fix attention quality in the middle.

## Per-section pass architecture

```python
def analyze_long_document(document: str) -> dict:
    sections = split_into_sections(document)
    section_analyses = []

    # Pass 1: Each section gets full, focused attention
    for i, section in enumerate(sections):
        analysis = client.messages.create(
            model="claude-sonnet-4-6",
            system="Analyze this document section thoroughly. Extract all claims, dates, entities, and key facts.",
            messages=[{
                "role": "user",
                "content": f"Section {i+1} of {len(sections)}:\n\n{section}"
            }]
        )
        section_analyses.append({
            "section_index": i,
            "content": section[:200] + "...",  # Reference snippet
            "analysis": analysis.content[0].text
        })

    # Pass 2: Integration pass — synthesize all section analyses
    synthesis = client.messages.create(
        model="claude-sonnet-4-6",
        system="Synthesize these section analyses into a coherent whole. Identify cross-section themes, contradictions, and the overall narrative arc.",
        messages=[{
            "role": "user",
            "content": f"Synthesize these {len(sections)} section analyses:\n\n" +
                      "\n\n---\n\n".join(f"Section {a['section_index']+1}:\n{a['analysis']}"
                                         for a in section_analyses)
        }]
    )

    return {"sections": section_analyses, "synthesis": synthesis.content[0].text}
```

## Rolling summary for long conversations

```python
class ConversationManager:
    def __init__(self, max_live_turns: int = 20, summary_threshold: int = 40):
        self.messages = []
        self.max_live_turns = max_live_turns
        self.summary_threshold = summary_threshold
        self.summary = None

    def add_turn(self, role: str, content: str) -> None:
        self.messages.append({"role": role, "content": content})

        # Compress when threshold is reached
        if len(self.messages) >= self.summary_threshold:
            self._compress()

    def _compress(self) -> None:
        # Summarize everything except the last N turns
        old_messages = self.messages[:-self.max_live_turns]
        recent_messages = self.messages[-self.max_live_turns:]

        summary_text = self._summarize(old_messages)

        # Replace old messages with compact summary
        self.messages = [
            {"role": "user", "content": f"[Previous conversation summary]\n{summary_text}"},
            {"role": "assistant", "content": "Understood. I'll continue with that context in mind."},
            *recent_messages
        ]

    def get_messages(self) -> list:
        return self.messages
```

## Prompt caching for repeated prefixes

```python
# Large stable prefix — cache it to save cost and latency
response = client.messages.create(
    model="claude-sonnet-4-6",
    system=[
        {
            "type": "text",
            "text": LARGE_SYSTEM_PROMPT,  # 50K tokens, reused on every request
            "cache_control": {"type": "ephemeral"}  # Mark for caching
        }
    ],
    messages=[{"role": "user", "content": user_query}]
)
```

**Cache invalidation warning:** Any change to the cached prefix — even adding a timestamp, a version string, or a single space — breaks the cache and forces full re-processing. Keep cached prefixes strictly immutable.

## Official documentation
- [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
