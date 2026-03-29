import React, { useState } from 'react';
import { ANTI_PATTERNS } from '../data/antipatterns';

export default function AntiPatternList() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div>
      {ANTI_PATTERNS.map((ap, i) => (
        <div
          key={ap.id}
          style={{
            marginBottom: '1rem',
            borderRadius: 10,
            border: '1px solid rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Header — always visible */}
          <button
            onClick={() => setExpanded(expanded === i ? null : i)}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              textAlign: 'left',
              padding: '1rem 1.25rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              gap: 12,
              fontFamily: 'inherit',
            }}
          >
            <span style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              background: 'var(--cca-red-lt)',
              border: '1px solid rgba(192,71,58,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700, color: 'var(--cca-red)',
            }}>
              ✗
            </span>
            <span style={{ flex: 1, fontSize: '0.95rem', fontWeight: 600, color: 'inherit' }}>
              {ap.title}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--ifm-color-emphasis-400)', fontFamily: 'DM Mono, monospace' }}>
              {expanded === i ? '▲' : '▼'}
            </span>
          </button>

          {/* Body — collapsible */}
          {expanded === i && (
            <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--cca-red)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  Why it's wrong
                </p>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{ap.why}</p>
              </div>

              <div style={{
                marginTop: '1rem',
                padding: '0.9rem 1rem',
                borderRadius: 8,
                background: 'rgba(120,140,93,0.08)',
                borderLeft: '3px solid var(--cca-green)',
              }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--cca-green)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  ✓ The correct approach
                </p>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{ap.correct}</p>
              </div>

              <div style={{
                marginTop: '0.9rem',
                padding: '0.75rem 1rem',
                borderRadius: 8,
                background: 'var(--cca-orange-lt)',
                border: '1px solid var(--cca-orange-bd)',
              }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--cca-orange)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  💡 Exam tip
                </p>
                <p style={{ fontSize: '0.88rem', lineHeight: 1.65, margin: 0 }}>{ap.examTip}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
