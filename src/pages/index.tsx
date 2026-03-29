import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import DomainCards from '../components/DomainCards';
import ExamStats from '../components/ExamStats';
import { QUESTION_COUNT } from '../data/questions';
import { FLASHCARDS } from '../data/flashcards';
import { CHEATSHEET_ITEMS } from '../data/cheatsheet';
import { ANTI_PATTERNS } from '../data/antipatterns';

export default function Home() {
  return (
    <Layout
      title="CCA Prep — Claude Certified Architect"
      description={`Complete study guide for the CCA Foundations exam. ${QUESTION_COUNT} practice questions, flashcards, cheat sheet, and anti-patterns guide.`}
    >
      <div className="hero--cca">
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            fontSize: '0.72rem', fontWeight: 700, color: 'var(--cca-orange)',
            background: 'rgba(217,119,87,0.12)', border: '1px solid rgba(217,119,87,0.28)',
            padding: '4px 14px 4px 10px', borderRadius: 999, marginBottom: 22,
            letterSpacing: '0.07em', textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cca-orange)' }} />
            CCA Foundations · Launched March 2026
          </div>
          <h1 className="hero__title">
            Become a<br /><em>Claude Certified</em><br />Architect
          </h1>
          <p className="hero__subtitle">
            Complete community study guide for the CCA Foundations exam — all 5 domains,
            {QUESTION_COUNT} scenario-based practice questions across 4 difficulty levels, {FLASHCARDS.length} flashcards,
            and a full cheat sheet with official documentation links.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <Link className="button button--primary button--lg" to="/quiz">Start quiz →</Link>
            <Link className="button button--secondary button--lg" to="/mock">Try mock exam</Link>
            <Link className="button button--secondary button--lg" to="/study-guide/intro">Browse study guide</Link>
          </div>
          <ExamStats />
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem 1rem' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ifm-color-emphasis-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
          Exam domains
        </p>
        <DomainCards />
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1rem 1.5rem 4rem' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ifm-color-emphasis-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
          Study tools
        </p>
        <div className="features-grid">
          {[
            { to: '/quiz', icon: '🎯', color: 'var(--cca-orange-lt)', title: 'Scenario quizzes', desc: `${QUESTION_COUNT} questions across 4 levels. Every wrong answer links directly to the relevant Anthropic documentation.` },
            { to: '/mock', icon: '📝', color: 'rgba(106,155,204,0.15)', title: 'Mock exam', desc: 'Timed 60-question exam simulation with domain-weighted selection, question palette navigation, and full results breakdown at the end.' },
            { to: '/flashcards', icon: '🃏', color: 'var(--cca-blue-lt)', title: 'Flashcards', desc: `${FLASHCARDS.length} flip cards covering every key concept. Filter by domain, keyboard navigation, flip with spacebar.` },
            { to: '/cheatsheet', icon: '📋', color: 'var(--cca-green-lt)', title: 'Cheat sheet', desc: `${CHEATSHEET_ITEMS.length} domain-grouped quick-reference entries with code examples. Printable for exam day.` },
            { to: '/study-guide/anti-patterns', icon: '⚠️', color: 'rgba(192,71,58,0.1)', title: 'Anti-patterns', desc: `${ANTI_PATTERNS.length} canonical wrong-answer patterns. Knowing what NOT to do is worth 10–15 points.` },
            { to: '/study-guide/intro', icon: '📚', color: 'rgba(176,174,165,0.12)', title: 'Study guide', desc: 'Deep dives into all 5 domains with task statements, production examples, and doc links.' },
            { to: '/overview', icon: '📄', color: 'rgba(106,155,204,0.12)', title: 'Exam overview', desc: 'Format, scoring, all 6 scenarios, candidate profile, and a 6-week study plan.' },
          ].map(f => (
            <Link key={f.to} className="feature-card" to={f.to} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="feature-icon" style={{ background: f.color }}><span style={{ fontSize: '1.1rem' }}>{f.icon}</span></div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: '3rem', padding: '1rem 1.25rem', borderRadius: 10, background: 'rgba(176,174,165,0.07)', border: '1px solid rgba(176,174,165,0.15)', fontSize: '0.82rem', color: 'var(--ifm-color-emphasis-500)', lineHeight: 1.65 }}>
          <strong style={{ color: 'var(--ifm-color-emphasis-700)' }}>Community resource — not affiliated with Anthropic.</strong>{' '}
          For official preparation materials, visit <a href="https://anthropic.skilljar.com" target="_blank" rel="noopener noreferrer">Anthropic Academy</a>.
        </div>
      </div>
    </Layout>
  );
}
