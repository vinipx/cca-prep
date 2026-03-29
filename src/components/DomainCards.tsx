import React from 'react';
import Link from '@docusaurus/Link';
import { DOMAIN_LABELS, DOMAIN_WEIGHTS, DOMAINS, type Domain } from '../data/questions';

const DOMAIN_COLORS: Record<Domain, string> = {
  1: 'var(--cca-orange)',
  2: 'var(--cca-blue)',
  3: 'var(--cca-green)',
  4: 'var(--cca-gray)',
  5: 'var(--cca-red)',
};

const DOMAIN_TOPICS: Record<Domain, string> = {
  1: 'Agentic loops · stop_reason · hub-and-spoke · Task tool · hooks · fork_session',
  2: 'Tool descriptions · MCP error structure · tool scoping · tool_choice config',
  3: 'CLAUDE.md hierarchy · plan mode · slash commands · CI/CD integration · Agent Skills',
  4: 'JSON schemas · few-shot · validation retry loops · Batch API · strict mode',
  5: 'Attention dilution · context strategies · escalation patterns · confidence calibration',
};

const DOMAIN_LINKS: Record<Domain, string> = {
  1: '/study-guide/domain1/overview',
  2: '/study-guide/domain2/overview',
  3: '/study-guide/domain3/overview',
  4: '/study-guide/domain4/overview',
  5: '/study-guide/domain5/overview',
};

const DOMAIN_CLASSES: Record<Domain, string> = {
  1: 'badge-d1', 2: 'badge-d2', 3: 'badge-d3', 4: 'badge-d4', 5: 'badge-d5',
};

export default function DomainCards() {
  return (
    <div className="domain-cards">
      {DOMAINS.map(d => (
        <Link key={d} className="domain-card" to={DOMAIN_LINKS[d]} style={{ textDecoration: 'none' }}>
          <div className="domain-card-head">
            <span className={`domain-badge ${DOMAIN_CLASSES[d]}`}>Domain {d}</span>
            <span className="domain-weight">{DOMAIN_WEIGHTS[d]}%</span>
          </div>
          <div className="domain-card-title">{DOMAIN_LABELS[d]}</div>
          <div className="domain-card-desc">{DOMAIN_TOPICS[d]}</div>
          <div className="domain-progress">
            <div
              className="domain-progress-fill"
              style={{ width: `${DOMAIN_WEIGHTS[d]}%`, background: DOMAIN_COLORS[d] }}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
