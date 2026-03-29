import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const SCENARIOS = [
  { num: 1, title: 'Customer Support Resolution Agent', domains: ['D1', 'D2', 'D5'], desc: 'Building a support agent using the Claude Agent SDK with MCP tools (get_customer, lookup_order, process_refund, escalate_to_human). Target: 80%+ first-contact resolution.' },
  { num: 2, title: 'Code Generation with Claude Code', domains: ['D3', 'D5'], desc: 'Using Claude Code for code generation, refactoring, debugging, and documentation with CLAUDE.md configurations, custom slash commands, and plan mode.' },
  { num: 3, title: 'Multi-Agent Research System', domains: ['D1', 'D2', 'D5'], desc: 'A coordinator agent delegating to specialist subagents: web search, document analysis, synthesis, and report generation. Produces comprehensive cited reports.' },
  { num: 4, title: 'Developer Productivity Tools', domains: ['D1', 'D2', 'D3'], desc: 'An agent helping engineers explore codebases, understand legacy systems, generate boilerplate, and automate repetitive tasks using built-in tools and MCP servers.' },
  { num: 5, title: 'Claude Code for CI/CD', domains: ['D3', 'D4'], desc: 'Integrating Claude Code into CI/CD pipelines for automated code review, test generation, and PR feedback. Designing prompts that minimize false positives.' },
  { num: 6, title: 'Structured Data Extraction', domains: ['D4', 'D5'], desc: 'Extracting structured information from unstructured documents, validating output with JSON schemas, and handling edge cases gracefully with retry loops.' },
];

const DOMAIN_BADGES = { D1: 'badge-d1', D2: 'badge-d2', D3: 'badge-d3', D4: 'badge-d4', D5: 'badge-d5' };

export default function OverviewPage() {
  return (
    <Layout title="Exam Overview — CCA Prep" description="CCA Foundations exam format, scoring, all 6 scenarios, and 6-week study plan.">
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 1.5rem' }}>

        <h1>Exam overview</h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          The Claude Certified Architect — Foundations (CCA) certification validates that practitioners can make
          informed architectural decisions when implementing real-world solutions with Claude. Launched March 12, 2026,
          it is Anthropic's first official technical credential.
        </p>

        {/* Format */}
        <h2>Exam format</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, margin: '1rem 0 2.5rem' }}>
          {[
            { label: 'Questions', value: '60' },
            { label: 'Format', value: 'Multiple choice, 1 correct answer' },
            { label: 'Duration', value: '120 minutes' },
            { label: 'Passing score', value: '720 / 1,000 (scaled)' },
            { label: 'Scenarios', value: '4 of 6 selected randomly' },
            { label: 'Access', value: 'Claude Partner Network' },
          ].map(item => (
            <div key={item.label} style={{ background: 'var(--ifm-background-surface-color)', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: 10, padding: '1rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ifm-color-emphasis-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Domain weights */}
        <h2>Domain weights</h2>
        <div style={{ marginBottom: '2.5rem' }}>
          {[
            { d: 1, name: 'Agentic Architecture & Orchestration', pct: 27, cls: 'badge-d1', color: 'var(--cca-orange)' },
            { d: 3, name: 'Claude Code Configuration & Workflows', pct: 20, cls: 'badge-d3', color: 'var(--cca-green)' },
            { d: 4, name: 'Prompt Engineering & Structured Output', pct: 20, cls: 'badge-d4', color: 'var(--cca-gray)' },
            { d: 2, name: 'Tool Design & MCP Integration', pct: 18, cls: 'badge-d2', color: 'var(--cca-blue)' },
            { d: 5, name: 'Context Management & Reliability', pct: 15, cls: 'badge-d5', color: 'var(--cca-red)' },
          ].map(row => (
            <div key={row.d} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <span className={`domain-badge ${row.cls}`} style={{ minWidth: 80, textAlign: 'center' }}>Domain {row.d}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{row.name}</span>
                  <span style={{ fontSize: '0.85rem', fontFamily: 'DM Mono, monospace', color: 'var(--ifm-color-emphasis-600)' }}>{row.pct}%</span>
                </div>
                <div className="domain-progress">
                  <div className="domain-progress-fill" style={{ width: `${row.pct}%`, background: row.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scenarios */}
        <h2>The 6 exam scenarios</h2>
        <p style={{ color: 'var(--ifm-color-emphasis-600)', marginBottom: '1.25rem' }}>
          Four scenarios are randomly selected at exam time. Every question is anchored to one of the selected scenarios.
          You are the architect of a specific production system — not answering in the abstract.
        </p>
        <div style={{ marginBottom: '2.5rem' }}>
          {SCENARIOS.map(s => (
            <div key={s.num} className="scenario-box">
              <span className="scenario-label">Scenario {s.num}</span>
              <div className="scenario-title">{s.title}</div>
              <div className="scenario-desc">{s.desc}</div>
              <div className="scenario-domains">
                {s.domains.map(d => (
                  <span key={d} className={`domain-badge ${DOMAIN_BADGES[d]}`}>{d}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Target candidate */}
        <h2>Target candidate</h2>
        <p style={{ marginBottom: '0.75rem' }}>The ideal candidate has <strong>6+ months of hands-on production experience</strong> with:</p>
        <ul style={{ lineHeight: 1.9, marginBottom: '2.5rem' }}>
          <li>Building agentic applications using the Claude Agent SDK (multi-agent orchestration, tool integration, hooks)</li>
          <li>Configuring Claude Code for team workflows using CLAUDE.md files, Agent Skills, and MCP server integrations</li>
          <li>Designing Model Context Protocol (MCP) tool and resource interfaces for backend system integration</li>
          <li>Engineering prompts that produce reliable structured output using JSON schemas, few-shot examples, and validation patterns</li>
          <li>Managing context windows effectively across long documents, multi-turn conversations, and multi-agent handoffs</li>
          <li>Integrating Claude into CI/CD pipelines for automated code review, test generation, and pull request feedback</li>
        </ul>

        {/* Study plan */}
        <h2>6-week study plan</h2>
        <div style={{ marginBottom: '2.5rem' }}>
          {[
            { week: '1–2', title: 'Claude API & core concepts', tasks: 'Complete Anthropic Academy courses on Skilljar. Master the API fundamentals: messages, tools, stop_reason, streaming. Build a simple agentic loop from scratch.' },
            { week: '3', title: 'Agent SDK & multi-agent orchestration', tasks: 'Study the Agent SDK documentation. Build a coordinator-subagent system. Practice with the Task tool, hooks, and context passing patterns. Focus on Domain 1.' },
            { week: '4', title: 'MCP & tool design', tasks: 'Learn MCP tool interface design: descriptions, error structure (isError, errorCategory, isRetryable), tool scoping. Configure .mcp.json. Focus on Domain 2.' },
            { week: '5', title: 'Claude Code & prompt engineering', tasks: 'Configure CLAUDE.md hierarchies, set up custom slash commands and hooks. Practice structured output with JSON schemas and validation retry loops. Domains 3 & 4.' },
            { week: '6', title: 'Context management + mock exam', tasks: 'Study context strategies and escalation patterns. Complete the full 100-question practice set on this site. Take the official 60-question practice exam before booking.' },
          ].map((phase, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
              <div style={{ width: 80, flexShrink: 0, padding: '0.75rem 0' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.78rem', color: 'var(--cca-orange)', fontWeight: 600 }}>
                  Week {phase.week}
                </span>
              </div>
              <div style={{ flex: 1, background: 'var(--ifm-background-surface-color)', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: 10, padding: '0.875rem 1rem' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.3rem' }}>{phase.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-600)', lineHeight: 1.65 }}>{phase.tasks}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Official resources */}
        <h2>Official resources</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10, marginBottom: '2rem' }}>
          {[
            { title: 'Anthropic Academy (Skilljar)', url: 'https://anthropic.skilljar.com', desc: '13 free preparation courses' },
            { title: 'Agent SDK documentation', url: 'https://platform.claude.com/docs/en/agent-sdk/overview', desc: 'Agent loop, tools, hooks, sessions' },
            { title: 'Claude Code documentation', url: 'https://code.claude.com/docs/en/overview', desc: 'CLAUDE.md, plan mode, CI/CD' },
            { title: 'Tool use documentation', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview', desc: 'tool_choice, strict mode, MCP' },
            { title: 'MCP documentation', url: 'https://modelcontextprotocol.io/docs', desc: 'Protocol, error structure, servers' },
            { title: 'Official exam guide PDF', url: 'https://everpath-course-content.s3-accelerate.amazonaws.com/instructor/8lsy243ftffjjy1cx9lm3o2bw/public/1773274827/Claude+Certified+Architect+%E2%80%93+Foundations+Certification+Exam+Guide.pdf', desc: 'Domain weightings and task statements' },
          ].map(r => (
            <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" style={{ background: 'var(--ifm-background-surface-color)', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: 10, padding: '1rem 1.125rem', textDecoration: 'none', display: 'block', transition: 'border-color 0.15s' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem', color: 'inherit' }}>{r.title} ↗</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-500)' }}>{r.desc}</div>
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link className="button button--primary" to="/quiz">Start quiz →</Link>
          <Link className="button button--secondary" to="/study-guide/intro">Open study guide</Link>
        </div>
      </div>
    </Layout>
  );
}
