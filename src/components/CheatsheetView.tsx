import React, { useState } from 'react';
import { CHEATSHEET_ITEMS } from '../data/cheatsheet';
import { DOMAIN_LABELS, DOMAINS, type Domain } from '../data/questions';

const DOMAIN_CLASSES: Record<number, string> = {
  1: 'badge-d1', 2: 'badge-d2', 3: 'badge-d3', 4: 'badge-d4', 5: 'badge-d5',
};

export default function CheatsheetView() {
  const [filter, setFilter] = useState<Domain | null>(null);

  const items = filter ? CHEATSHEET_ITEMS.filter(i => i.domain === filter) : CHEATSHEET_ITEMS;

  return (
    <div>
      <div className="filter-tabs" style={{ marginBottom: '1.75rem' }}>
        <button
          className={`filter-tab${filter === null ? ' active' : ''}`}
          onClick={() => setFilter(null)}
        >
          All domains
        </button>
        {DOMAINS.map(d => (
          <button
            key={d}
            className={`filter-tab${filter === d ? ' active' : ''}`}
            onClick={() => setFilter(d)}
          >
            Domain {d}
          </button>
        ))}
      </div>

      {items.map(item => (
        <div key={item.id} className="cheatsheet-item">
          <div className="cheatsheet-meta">
            <span className={`domain-badge ${DOMAIN_CLASSES[item.domain]}`}>Domain {item.domain}</span>
            <span style={{
              fontSize: '0.72rem', fontWeight: 600, color: 'var(--cca-orange)',
              background: 'var(--cca-orange-lt)', border: '1px solid var(--cca-orange-bd)',
              padding: '2px 8px', borderRadius: 4, letterSpacing: '0.03em',
            }}>
              {item.tag}
            </span>
          </div>
          <div className="cheatsheet-title">{item.title}</div>
          <div className="cheatsheet-body" style={{ whiteSpace: 'pre-line' }}>{item.body}</div>
          {item.code && (
            <pre style={{
              marginTop: '0.75rem',
              background: 'rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 8,
              padding: '1rem',
              fontSize: '0.82rem',
              overflowX: 'auto',
              lineHeight: 1.6,
            }}>
              <code>{item.code}</code>
            </pre>
          )}
        </div>
      ))}

      {filter && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--ifm-color-emphasis-200)' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-500)' }}>
            Showing {items.length} items for {DOMAIN_LABELS[filter]}.{' '}
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cca-orange)', fontSize: '0.85rem', padding: 0 }}
              onClick={() => setFilter(null)}
            >
              Show all →
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
