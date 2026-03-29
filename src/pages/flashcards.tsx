import React from 'react';
import Layout from '@theme/Layout';
import FlashcardDeck from '../components/FlashcardDeck';

export default function FlashcardsPage() {
  return (
    <Layout
      title="Flashcards — CCA Prep"
      description="20 flip cards covering key concepts across all 5 CCA exam domains."
    >
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1rem 4rem' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Flashcards</h1>
          <p style={{ color: 'var(--ifm-color-emphasis-600)', marginBottom: 0 }}>
            20 cards covering the most-tested concepts across all 5 domains.
            Click a card or press <kbd style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.85em', padding: '1px 5px', border: '1px solid currentColor', borderRadius: 4 }}>Space</kbd> to flip.
            Use <kbd style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.85em', padding: '1px 5px', border: '1px solid currentColor', borderRadius: 4 }}>← →</kbd> to navigate.
          </p>
        </div>
        <FlashcardDeck />
      </div>
    </Layout>
  );
}
