---
id: cicd
title: CI/CD integration
sidebar_label: CI/CD integration
---

# CI/CD integration

## GitHub Actions workflow

```yaml
# .github/workflows/claude-review.yml
name: Claude Code PR Review

on:
  pull_request:
    branches: [main, develop]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for diff context

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Run automated review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "Review the changes in this PR against our CLAUDE.md standards.
          Check for: security vulnerabilities, missing tests, architecture violations,
          performance issues, and documentation gaps.
          Output a JSON report with structure:
          {
            'summary': string,
            'blocking_issues': [{file, line, issue, severity}],
            'suggestions': [{file, suggestion}],
            'test_coverage_adequate': boolean
          }" \
          --output-format json \
          --max-turns 20 \
          > review-output.json

      - name: Post review comment
        uses: actions/github-script@v7
        with:
          script: |
            const review = require('./review-output.json');
            const body = formatReviewComment(review);
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body
            });
```

## Key CI/CD configuration choices

### Use `permissionMode: "acceptEdits"` in CI
CI pipelines cannot prompt for approval. Auto-approve file operations:
```python
options = ClaudeAgentOptions(
    permission_mode="acceptEdits",
    allowed_tools=["Read", "Glob", "Grep", "Write"],
    disallowed_tools=["Bash"]  # No shell in read-only review mode
)
```

### Lock down file access with path restrictions
For test generation, limit writes to `/tests` only:
```json
// .claude/settings.json
{
  "permissions": {
    "allow": ["Write(/tests/*)", "Read(**)", "Glob(**)", "Grep(**)"],
    "deny": ["Write(src/*)", "Write(config/*)", "Bash"]
  }
}
```

### Use CLAUDE.md for CI-specific context
Add a section to CLAUDE.md that reduces false positives for your codebase:
```markdown
## CI Review — Known safe patterns (do not flag)
- `eval()` in /sandbox/* — reviewed and approved by security team (2026-01-15)
- Dynamic `require()` in /scripts/build.js — build tooling, not production code
- `any` types in /src/legacy/* — migration in progress, tracked in #4521
```

## Structured review output

Requesting structured JSON output from CI reviews enables downstream automation:

```python
REVIEW_SCHEMA = {
    "type": "object",
    "properties": {
        "blocking_issues": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "file": {"type": "string"},
                    "line": {"type": "integer"},
                    "severity": {"type": "string", "enum": ["critical", "high", "medium"]},
                    "issue": {"type": "string"},
                    "suggestion": {"type": "string"}
                }
            }
        },
        "approved": {"type": "boolean"}
    }
}
```

## Official documentation
- [Claude Code overview](https://code.claude.com/docs/en/overview)
- [Claude Code settings](https://code.claude.com/docs/en/overview)
