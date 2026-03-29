import React from 'react';
import Layout from '@theme/Layout';
import CheatsheetView from '../components/CheatsheetView';

export default function CheatsheetPage() {
  return (
    <Layout
      title="Cheat Sheet — CCA Prep"
      description="Quick-reference cheat sheet for the CCA Foundations exam. All 5 domains with code examples."
    >
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1rem 4rem' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Cheat sheet</h1>
          <p style={{ color: 'var(--ifm-color-emphasis-600)', marginBottom: 0 }}>
            11 domain-grouped quick-reference entries covering the most critical concepts.
            Filter by domain or browse all. Print this page for exam-day review.
          </p>
        </div>
        <CheatsheetView />
      </div>
    </Layout>
  );
}
