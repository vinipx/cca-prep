import React, { useState, useEffect, useCallback } from 'react';
import { FLASHCARDS } from '../data/flashcards';
import { DOMAIN_LABELS, DOMAINS, type Domain } from '../data/questions';

const DOMAIN_CLASS: Record<number, string> = {
  1: 'badge-d1', 2: 'badge-d2', 3: 'badge-d3', 4: 'badge-d4', 5: 'badge-d5',
};

export default function FlashcardDeck() {
  const [domainFilter, setDomainFilter] = useState<Domain | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<Set<number>>(new Set());

  const cards = domainFilter
    ? FLASHCARDS.filter(c => c.domain === domainFilter)
    : FLASHCARDS;

  const card = cards[index];

  const go = useCallback((dir: number) => {
    setFlipped(false);
    setTimeout(() => {
      setIndex(i => {
        const next = (i + dir + cards.length) % cards.length;
        setSeen(s => new Set([...s, next]));
        return next;
      });
    }, 150);
  }, [cards.length]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === ' ') { e.preventDefault(); setFlipped(f => !f); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [go]);

  // Reset index when filter changes
  useEffect(() => {
    setIndex(0);
    setFlipped(false);
    setSeen(new Set([0]));
  }, [domainFilter]);

  const progress = Math.round((seen.size / cards.length) * 100);

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '1rem' }}>
      {/* Domain filter */}
      <div className="filter-tabs" style={{ marginBottom: '1.5rem' }}>
        <button
          className={`filter-tab${domainFilter === null ? ' active' : ''}`}
          onClick={() => setDomainFilter(null)}
        >
          All domains
        </button>
        {DOMAINS.map(d => (
          <button
            key={d}
            className={`filter-tab${domainFilter === d ? ' active' : ''}`}
            onClick={() => setDomainFilter(d)}
          >
            D{d}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-500)' }}>
          Card {index + 1} of {cards.length} · {progress}% seen
        </span>
        <span className={`domain-badge ${DOMAIN_CLASS[card.domain]}`}>
          Domain {card.domain}
        </span>
      </div>
      <div className="quiz-progress-bar" style={{ marginBottom: '1.25rem' }}>
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Card */}
      <div
        className={`flashcard-container`}
        style={{ height: 220, marginBottom: '1.25rem', cursor: 'pointer' }}
        onClick={() => setFlipped(f => !f)}
        role="button"
        tabIndex={0}
        aria-label={flipped ? 'Card answer (click to see question)' : 'Card question (click to see answer)'}
        onKeyDown={e => e.key === 'Enter' && setFlipped(f => !f)}
      >
        <div
          className={`flashcard${flipped ? ' flipped' : ''}`}
          style={{ height: '100%' }}
        >
          <div className="flashcard-face flashcard-front">
            <div>
              <div className="flashcard-hint">Click to reveal answer · Space to flip · ← → to navigate</div>
              <div className="flashcard-text">{card.front}</div>
            </div>
          </div>
          <div className="flashcard-face flashcard-back">
            <div style={{ width: '100%' }}>
              <div className="flashcard-text" style={{ whiteSpace: 'pre-line', textAlign: 'left' }}>
                {card.back}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="button button--secondary" onClick={() => go(-1)}>← Previous</button>
        <button className="button button--secondary" onClick={() => setFlipped(f => !f)}>
          {flipped ? 'Show question' : 'Flip card'}
        </button>
        <button className="button button--primary" onClick={() => go(1)}>Next →</button>
      </div>

      {/* Domain topic */}
      <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-400)' }}>
        {DOMAIN_LABELS[card.domain]}
      </p>
    </div>
  );
}
