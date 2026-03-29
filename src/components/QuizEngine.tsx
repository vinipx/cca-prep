import React, { useState, useMemo, useCallback } from 'react';
import {
  QUESTIONS,
  TIER_LABELS,
  DOMAIN_LABELS,
  DOMAINS,
  TIERS,
  type Tier,
  type Domain,
} from '../data/questions';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TIER_CLASS: Record<Tier, string> = {
  basic: 'tier-basic',
  intermediate: 'tier-inter',
  advanced: 'tier-advanced',
  exam: 'tier-exam',
};

const DOMAIN_CLASS: Record<number, string> = {
  1: 'badge-d1', 2: 'badge-d2', 3: 'badge-d3', 4: 'badge-d4', 5: 'badge-d5',
};

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

type FilterState = {
  domains: Set<Domain>;
  tiers: Set<Tier>;
};

type QuizState = {
  questions: typeof QUESTIONS;
  current: number;
  score: number;
  answered: number;
  selected: number | null;
  showExplanation: boolean;
  finished: boolean;
};

export default function QuizEngine() {
  const [filters, setFilters] = useState<FilterState>({
    domains: new Set(DOMAINS),
    tiers: new Set(TIERS),
  });
  const [quiz, setQuiz] = useState<QuizState | null>(null);

  const filteredCount = useMemo(() =>
    QUESTIONS.filter(q =>
      filters.domains.has(q.domain) && filters.tiers.has(q.tier)
    ).length,
    [filters]
  );

  const startQuiz = useCallback(() => {
    const filtered = shuffle(
      QUESTIONS.filter(q =>
        filters.domains.has(q.domain) && filters.tiers.has(q.tier)
      )
    );
    setQuiz({
      questions: filtered,
      current: 0,
      score: 0,
      answered: 0,
      selected: null,
      showExplanation: false,
      finished: false,
    });
  }, [filters]);

  const handleSelect = useCallback((idx: number) => {
    if (!quiz || quiz.selected !== null) return;
    const isCorrect = idx === quiz.questions[quiz.current].correct;
    setQuiz(q => ({
      ...q!,
      selected: idx,
      showExplanation: true,
      score: q!.score + (isCorrect ? 1 : 0),
      answered: q!.answered + 1,
    }));
  }, [quiz]);

  const handleNext = useCallback(() => {
    if (!quiz) return;
    const nextIdx = quiz.current + 1;
    if (nextIdx >= quiz.questions.length) {
      setQuiz(q => ({ ...q!, finished: true }));
    } else {
      setQuiz(q => ({ ...q!, current: nextIdx, selected: null, showExplanation: false }));
    }
  }, [quiz]);

  const toggleDomain = (d: Domain) => {
    setFilters(f => {
      const next = new Set(f.domains);
      if (next.has(d) && next.size > 1) next.delete(d); else next.add(d);
      return { ...f, domains: next };
    });
  };

  const toggleTier = (t: Tier) => {
    setFilters(f => {
      const next = new Set(f.tiers);
      if (next.has(t) && next.size > 1) next.delete(t); else next.add(t);
      return { ...f, tiers: next };
    });
  };

  // ── Finished screen ──────────────────────────────────────────────────────
  if (quiz?.finished) {
    const pct = Math.round((quiz.score / quiz.questions.length) * 100);
    const pass = pct >= 72;
    return (
      <div className="quiz-container">
        <div className="question-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '3.5rem', fontFamily: 'Lora, serif', fontWeight: 500, marginBottom: '0.5rem' }}>
            {quiz.score}/{quiz.questions.length}
          </div>
          <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: pass ? 'var(--cca-green)' : 'var(--cca-red)' }}>
            {pct}% — {pass ? '✓ Pass threshold reached' : '✗ Below pass threshold (72%)'}
          </div>
          <p style={{ color: 'var(--ifm-color-emphasis-600)', marginBottom: '2rem' }}>
            {pass
              ? "Great work! You're approaching exam readiness."
              : 'Keep studying — review the explanations for questions you missed.'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="button button--primary" onClick={startQuiz}>Retry same filters</button>
            <button className="button button--secondary" onClick={() => setQuiz(null)}>Change filters</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Active quiz ──────────────────────────────────────────────────────────
  if (quiz) {
    const q = quiz.questions[quiz.current];
    const progress = ((quiz.current) / quiz.questions.length) * 100;

    return (
      <div className="quiz-container">
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="quiz-meta">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className={`domain-badge ${DOMAIN_CLASS[q.domain]}`}>Domain {q.domain}</span>
            <span className={`tier-badge ${TIER_CLASS[q.tier]}`}>{TIER_LABELS[q.tier]}</span>
            {q.scenario && (
              <span style={{ fontSize: '0.75rem', color: 'var(--ifm-color-emphasis-500)' }}>
                📋 Scenario-based
              </span>
            )}
          </div>
          <span className="quiz-score">{quiz.score}/{quiz.answered} correct · Q{quiz.current + 1}/{quiz.questions.length}</span>
        </div>

        <div className="question-card">
          {q.scenario && <div className="question-scenario">Scenario: {q.scenario}</div>}
          <div className="question-text">{q.text}</div>

          {q.options.map((opt, idx) => {
            let cls = 'option-btn';
            if (quiz.selected !== null) {
              if (idx === q.correct) cls += ' correct';
              else if (idx === quiz.selected && idx !== q.correct) cls += ' wrong';
            }
            return (
              <button
                key={idx}
                className={cls}
                onClick={() => handleSelect(idx)}
                disabled={quiz.selected !== null}
              >
                <strong style={{ marginRight: 8 }}>{OPTION_LABELS[idx]}.</strong>{opt}
              </button>
            );
          })}

          {quiz.showExplanation && (
            <div className="explanation-box">
              <div className="explanation-title">
                {quiz.selected === q.correct ? '✓ Correct' : '✗ Incorrect'} — Explanation
              </div>
              <p style={{ margin: 0 }}>{q.explanation}</p>

              {quiz.selected !== q.correct && q.refs.length > 0 && (
                <div className="ref-links">
                  <div className="ref-links-label">📖 Study these resources</div>
                  {q.refs.map((ref, i) => (
                    <a key={i} href={ref.url} target="_blank" rel="noopener noreferrer" className="ref-link">
                      ↗ {ref.label}
                    </a>
                  ))}
                </div>
              )}

              {quiz.selected === q.correct && q.refs.length > 0 && (
                <div className="ref-links">
                  <div className="ref-links-label">📚 Go deeper</div>
                  {q.refs.map((ref, i) => (
                    <a key={i} href={ref.url} target="_blank" rel="noopener noreferrer" className="ref-link">
                      ↗ {ref.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {quiz.showExplanation && (
          <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
            <button className="button button--primary" onClick={handleNext}>
              {quiz.current + 1 >= quiz.questions.length ? 'See results' : 'Next question →'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Filter / start screen ────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '1rem' }}>
      <p style={{ color: 'var(--ifm-color-emphasis-600)', marginBottom: '1.5rem' }}>
        Choose which domains and difficulty levels to include, then start your quiz.
        Every question you get wrong includes direct links to the relevant official documentation.
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontWeight: 600, marginBottom: '0.6rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ifm-color-emphasis-500)' }}>
          Difficulty level
        </p>
        <div className="filter-tabs">
          {TIERS.map(t => (
            <button
              key={t}
              className={`filter-tab${filters.tiers.has(t) ? ' active' : ''}`}
              onClick={() => toggleTier(t)}
            >
              {TIER_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontWeight: 600, marginBottom: '0.6rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ifm-color-emphasis-500)' }}>
          Domain
        </p>
        <div className="filter-tabs" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          {DOMAINS.map(d => (
            <button
              key={d}
              className={`filter-tab${filters.domains.has(d) ? ' active' : ''}`}
              onClick={() => toggleDomain(d)}
              style={{ textAlign: 'left' }}
            >
              <span className={`domain-badge ${DOMAIN_CLASS[d]}`} style={{ marginRight: 8 }}>D{d}</span>
              {DOMAIN_LABELS[d]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <button
          className="button button--primary button--lg"
          onClick={startQuiz}
          disabled={filteredCount === 0}
        >
          Start quiz ({filteredCount} questions)
        </button>
        <span style={{ fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-500)' }}>
          {filteredCount} of {QUESTIONS.length} questions match your filters
        </span>
      </div>
    </div>
  );
}
