import React from 'react';
import Layout from '@theme/Layout';
import QuizEngine from '../components/QuizEngine';

export default function QuizPage() {
  return (
    <Layout
      title="Quiz — CCA Prep"
      description="100 scenario-based practice questions for the CCA Foundations exam. 4 difficulty levels, all 5 domains, with references on every wrong answer."
    >
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem 4rem' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Practice quiz</h1>
          <p style={{ color: 'var(--ifm-color-emphasis-600)', marginBottom: 0 }}>
            100 questions · 4 difficulty levels · all 5 domains.
            Every question you answer incorrectly shows a full explanation{' '}
            <strong>and links directly to the relevant official Anthropic documentation</strong> so you can read the source immediately.
          </p>
        </div>
        <QuizEngine />
      </div>
    </Layout>
  );
}
