import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  studySidebar: [
    { type: 'doc', id: 'intro', label: 'Introduction' },
    {
      type: 'category', label: 'Domain 1 — Agentic Architecture',
      items: ['domain1/overview', 'domain1/agentic-loops', 'domain1/multi-agent', 'domain1/hooks', 'domain1/session-management'],
    },
    {
      type: 'category', label: 'Domain 2 — Tool Design & MCP',
      items: ['domain2/overview', 'domain2/tool-descriptions', 'domain2/mcp-errors', 'domain2/tool-scoping'],
    },
    {
      type: 'category', label: 'Domain 3 — Claude Code',
      items: ['domain3/overview', 'domain3/claude-md', 'domain3/plan-mode', 'domain3/cicd'],
    },
    {
      type: 'category', label: 'Domain 4 — Prompt Engineering',
      items: ['domain4/overview', 'domain4/structured-output', 'domain4/batch-api', 'domain4/few-shot'],
    },
    {
      type: 'category', label: 'Domain 5 — Context & Reliability',
      items: ['domain5/overview', 'domain5/context-strategies', 'domain5/escalation'],
    },
    { type: 'doc', id: 'anti-patterns', label: '⚠️ Anti-patterns' },
    { type: 'doc', id: 'exam-scenarios', label: '📋 Exam scenarios' },
    { type: 'doc', id: 'contributing', label: '🤝 Contributing' },
  ],
};

export default sidebars;
