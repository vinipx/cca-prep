import React from 'react';
import Layout from '@theme/Layout';
import MockExam from '../components/MockExam';

export default function MockExamPage() {
  return (
    <Layout
      title="Mock Exam — CCA Prep"
      description="Timed 60-question mock exam simulation with domain-weighted questions, question palette navigation, and detailed results breakdown. No feedback until you submit."
    >
      <div style={{ padding: '2rem 1rem 4rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', marginBottom: '1.75rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Mock exam</h1>
          <p style={{ color: 'var(--ifm-color-emphasis-600)', marginBottom: 0 }}>
            Simulate the real CCA exam — 60 domain-weighted questions, 120-minute countdown,
            no feedback until you submit. Full score breakdown and explanation review at the end.
          </p>
        </div>
        <MockExam />
      </div>
    </Layout>
  );
}
