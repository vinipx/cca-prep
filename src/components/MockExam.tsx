import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  QUESTIONS,
  DOMAINS,
  DOMAIN_LABELS,
  DOMAIN_WEIGHTS,
  TIER_LABELS,
  type Domain,
  type Question,
} from '../data/questions';

// ── Types ─────────────────────────────────────────────────────────────────

type ExamMode = 'simulated' | 'full';
type FeedbackMode = 'exam' | 'study';

type QuestionStatus = {
  selected: number | null;
  flagged: boolean;
  locked: boolean;
};

type SetupState = { screen: 'setup' };

type ExamState = {
  screen: 'exam';
  mode: ExamMode;
  feedbackMode: FeedbackMode;
  questions: Question[];
  statuses: QuestionStatus[];
  current: number;
  startedAt: number;
  timeRemainingMs: number | null; // null = full-practice (show elapsed instead)
  submitWarning: boolean;
};

type ResultsState = {
  screen: 'results';
  mode: ExamMode;
  feedbackMode: FeedbackMode;
  questions: Question[];
  statuses: QuestionStatus[];
  elapsedMs: number;
};

type MockExamState = SetupState | ExamState | ResultsState;

// ── Constants ─────────────────────────────────────────────────────────────

const SIMULATED_DURATION_MS = 120 * 60 * 1000; // 120 minutes

// Domain question targets summing to exactly 60 (real CCA exam distribution)
const DOMAIN_TARGETS: Record<Domain, number> = { 1: 16, 2: 11, 3: 12, 4: 12, 5: 9 };

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const DOMAIN_CLASS: Record<number, string> = {
  1: 'badge-d1', 2: 'badge-d2', 3: 'badge-d3', 4: 'badge-d4', 5: 'badge-d5',
};

const TIER_CLASS: Record<string, string> = {
  basic: 'tier-basic',
  intermediate: 'tier-inter',
  advanced: 'tier-advanced',
  exam: 'tier-exam',
};

// ── Pure helpers ──────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function selectSimulatedQuestions(): Question[] {
  const selected: Question[] = [];
  for (const d of DOMAINS) {
    const pool = shuffle(QUESTIONS.filter(q => q.domain === d));
    selected.push(...pool.slice(0, Math.min(DOMAIN_TARGETS[d], pool.length)));
  }
  return shuffle(selected);
}

function selectFullPracticeQuestions(): Question[] {
  return shuffle([...QUESTIONS]);
}

function buildResultsState(exam: ExamState): ResultsState {
  return {
    screen: 'results',
    mode: exam.mode,
    feedbackMode: exam.feedbackMode,
    questions: exam.questions,
    statuses: exam.statuses,
    elapsedMs: exam.mode === 'simulated'
      ? SIMULATED_DURATION_MS - (exam.timeRemainingMs ?? 0)
      : Date.now() - exam.startedAt,
  };
}

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// ── MockTimer ─────────────────────────────────────────────────────────────

function MockTimer({
  mode,
  timeRemainingMs,
  startedAt,
}: {
  mode: ExamMode;
  timeRemainingMs: number | null;
  startedAt: number;
}) {
  const [elapsed, setElapsed] = useState(Date.now() - startedAt);

  useEffect(() => {
    if (mode !== 'full') return;
    const id = setInterval(() => setElapsed(Date.now() - startedAt), 1000);
    return () => clearInterval(id);
  }, [mode, startedAt]);

  const displayMs = mode === 'simulated' ? (timeRemainingMs ?? 0) : elapsed;
  const isLow = mode === 'simulated' && displayMs < 10 * 60 * 1000;

  return (
    <div className={`mock-timer${isLow ? ' low' : ''}`} title={mode === 'simulated' ? 'Time remaining' : 'Elapsed time'}>
      {mode === 'simulated' ? '⏱ ' : '⏱ '}{formatTime(displayMs)}
    </div>
  );
}

// ── AnswerReviewCard ──────────────────────────────────────────────────────

function AnswerReviewCard({
  question,
  userChoice,
  questionNumber,
}: {
  question: Question;
  userChoice: number | null;
  questionNumber: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const wasCorrect = userChoice === question.correct;
  const cardType = userChoice === null ? 'unanswered' : wasCorrect ? 'correct' : 'wrong';

  return (
    <div className={`mock-answer-card ${cardType}`}>
      <button className="mock-answer-card-header" onClick={() => setExpanded(e => !e)}>
        <span className="mock-answer-q-num">Q{questionNumber}</span>
        <span className="mock-answer-q-text">{question.text}</span>
        <span className="mock-answer-card-toggle">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <div className="mock-answer-card-body">
          {userChoice !== null ? (
            <div className={`mock-user-choice ${wasCorrect ? '' : 'wrong'}`}>
              Your answer: <strong>{OPTION_LABELS[userChoice]}. {question.options[userChoice]}</strong>
            </div>
          ) : (
            <div className="mock-user-choice unanswered">Not answered</div>
          )}
          {!wasCorrect && (
            <div className="mock-correct-answer">
              Correct answer: <strong>{OPTION_LABELS[question.correct]}. {question.options[question.correct]}</strong>
            </div>
          )}
          <div className="explanation-box">
            <div className="explanation-title">
              {wasCorrect ? '✓ Correct' : '✗ Incorrect'} — Explanation
            </div>
            <p style={{ margin: 0 }}>{question.explanation}</p>
            {question.refs.length > 0 && (
              <div className="ref-links">
                <div className="ref-links-label">📖 Study these resources</div>
                {question.refs.map((ref, i) => (
                  <a key={i} href={ref.url} target="_blank" rel="noopener noreferrer" className="ref-link">
                    ↗ {ref.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── SetupScreen ───────────────────────────────────────────────────────────

function SetupScreen({ onStart }: { onStart: (mode: ExamMode, feedbackMode: FeedbackMode) => void }) {
  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>('exam');

  return (
    <div className="mock-setup-container">
      <div className="mock-feedback-toggle">
        <p className="mock-section-label">Answer feedback</p>
        <div className="mock-feedback-options">
          <button
            className={`mock-feedback-btn${feedbackMode === 'exam' ? ' active' : ''}`}
            onClick={() => setFeedbackMode('exam')}
          >
            <strong>Exam mode</strong>
            <span>No feedback until you submit — just like the real exam</span>
          </button>
          <button
            className={`mock-feedback-btn${feedbackMode === 'study' ? ' active' : ''}`}
            onClick={() => setFeedbackMode('study')}
          >
            <strong>Study mode</strong>
            <span>See correct/wrong + explanation after each answer</span>
          </button>
        </div>
      </div>

      <div className="mock-mode-cards">
        <button className="mock-mode-card" onClick={() => onStart('simulated', feedbackMode)}>
          <div className="mock-mode-title">Simulated Exam</div>
          <div className="mock-mode-desc">60 questions · 120-minute countdown · domain-weighted</div>
          <ul className="mock-mode-bullets">
            <li>Matches the real CCA exam domain distribution</li>
            <li>Timer counts down from 2:00:00</li>
            <li>72% pass threshold applied to results</li>
          </ul>
          <span className="button button--primary" style={{ alignSelf: 'flex-start' }}>Start simulated exam →</span>
        </button>

        <button className="mock-mode-card" onClick={() => onStart('full', feedbackMode)}>
          <div className="mock-mode-title">Full Practice</div>
          <div className="mock-mode-desc">All {QUESTIONS.length} questions · elapsed timer · unlimited time</div>
          <ul className="mock-mode-bullets">
            <li>All {QUESTIONS.length} questions shuffled randomly</li>
            <li>Timer shows elapsed time (no countdown)</li>
            <li>Great for exhaustive review before the exam</li>
          </ul>
          <span className="button button--secondary" style={{ alignSelf: 'flex-start' }}>Start full practice →</span>
        </button>
      </div>

      <p className="mock-section-label">Simulated exam — domain distribution</p>
      {DOMAINS.map(d => (
        <div key={d} className="mock-domain-row">
          <span className={`domain-badge ${DOMAIN_CLASS[d]}`}>D{d}</span>
          <span className="mock-domain-name">{DOMAIN_LABELS[d]}</span>
          <span className="mock-domain-weight">{DOMAIN_WEIGHTS[d]}%</span>
          <span className="mock-domain-count">~{DOMAIN_TARGETS[d]}q</span>
        </div>
      ))}
    </div>
  );
}

// ── ExamScreen ────────────────────────────────────────────────────────────

function ExamScreen({
  state,
  onSelect,
  onFlag,
  onNavigate,
  onSubmit,
  onSubmitConfirm,
  onDismissWarning,
}: {
  state: ExamState;
  onSelect: (optionIdx: number) => void;
  onFlag: () => void;
  onNavigate: (idx: number) => void;
  onSubmit: () => void;
  onSubmitConfirm: () => void;
  onDismissWarning: () => void;
}) {
  const q = state.questions[state.current];
  const status = state.statuses[state.current];
  const answeredCount = state.statuses.filter(s => s.selected !== null).length;
  const total = state.questions.length;
  const progress = (answeredCount / total) * 100;

  return (
    <div className="mock-exam-layout">
      {/* Top bar */}
      <div className="mock-exam-topbar">
        <span className="mock-exam-progress-label">{answeredCount}/{total} answered</span>
        <div className="quiz-progress-bar" style={{ flex: 1 }}>
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <MockTimer mode={state.mode} timeRemainingMs={state.timeRemainingMs} startedAt={state.startedAt} />
      </div>

      <div className="mock-exam-body">
        {/* Main question area */}
        <div className="mock-question-area">
          <div className="mock-question-header">
            <span className={`domain-badge ${DOMAIN_CLASS[q.domain]}`}>Domain {q.domain}</span>
            <span className={`tier-badge ${TIER_CLASS[q.tier]}`}>{TIER_LABELS[q.tier]}</span>
            {q.scenario && (
              <span style={{ fontSize: '0.75rem', color: 'var(--ifm-color-emphasis-500)' }}>
                📋 {q.scenario}
              </span>
            )}
            <span style={{ marginLeft: 'auto', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', color: 'var(--cca-gray)' }}>
              {state.current + 1} / {total}
            </span>
          </div>

          <div className="question-card">
            {q.scenario && <div className="question-scenario">Scenario: {q.scenario}</div>}
            <div className="question-text">{q.text}</div>

            {q.options.map((opt, idx) => {
              let cls = 'option-btn';
              if (state.feedbackMode === 'study' && status.locked) {
                if (idx === q.correct) cls += ' correct';
                else if (idx === status.selected) cls += ' wrong';
              } else if (status.selected === idx) {
                cls += ' mock-selected';
              }
              return (
                <button
                  key={idx}
                  className={cls}
                  onClick={() => onSelect(idx)}
                  disabled={status.locked}
                >
                  <strong style={{ marginRight: 8 }}>{OPTION_LABELS[idx]}.</strong>{opt}
                </button>
              );
            })}

            {state.feedbackMode === 'study' && status.locked && (
              <div className="explanation-box">
                <div className="explanation-title">
                  {status.selected === q.correct ? '✓ Correct' : '✗ Incorrect'} — Explanation
                </div>
                <p style={{ margin: 0 }}>{q.explanation}</p>
                {q.refs.length > 0 && (
                  <div className="ref-links">
                    <div className="ref-links-label">
                      {status.selected === q.correct ? '📚 Go deeper' : '📖 Study these resources'}
                    </div>
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

          {/* Navigation row */}
          <div className="mock-nav-row">
            <button
              className="button button--secondary"
              onClick={() => onNavigate(state.current - 1)}
              disabled={state.current === 0}
            >
              ← Prev
            </button>
            <button
              className={`mock-flag-btn${status.flagged ? ' flagged' : ''}`}
              onClick={onFlag}
            >
              {status.flagged ? '⚑ Flagged' : '⚐ Flag for review'}
            </button>
            <button
              className="button button--secondary"
              onClick={() => onNavigate(state.current + 1)}
              disabled={state.current === total - 1}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Palette sidebar */}
        <aside className="mock-palette">
          <p className="mock-palette-label">Questions</p>
          <div className="mock-palette-grid">
            {state.questions.map((_, idx) => {
              const s = state.statuses[idx];
              let cls = 'mock-palette-cell';
              if (idx === state.current) cls += ' current';
              else if (state.feedbackMode === 'study' && s.locked) {
                cls += s.selected === state.questions[idx].correct ? ' study-correct' : ' study-wrong';
              } else if (s.flagged) cls += ' flagged';
              else if (s.selected !== null) cls += ' answered';
              return (
                <button key={idx} className={cls} onClick={() => onNavigate(idx)}>
                  {idx + 1}
                </button>
              );
            })}
          </div>
          <div className="mock-palette-legend">
            {state.feedbackMode === 'study' ? (
              <>
                <span><span className="mock-legend-dot study-correct" /> Correct</span>
                <span><span className="mock-legend-dot study-wrong" /> Wrong</span>
              </>
            ) : (
              <span><span className="mock-legend-dot answered" /> Answered</span>
            )}
            <span><span className="mock-legend-dot flagged" /> Flagged</span>
            <span><span className="mock-legend-dot" /> Unanswered</span>
          </div>
          <button className="button button--primary mock-submit-btn" onClick={onSubmit}>
            Submit exam
          </button>
        </aside>
      </div>

      {/* Submit warning modal */}
      {state.submitWarning && (
        <div className="mock-modal-overlay">
          <div className="mock-modal">
            <p>
              <strong>
                {state.statuses.filter(s => s.selected === null).length} question
                {state.statuses.filter(s => s.selected === null).length !== 1 ? 's' : ''} unanswered.
              </strong>
              {' '}Unanswered questions will be marked incorrect. Submit anyway?
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="button button--secondary" onClick={onDismissWarning}>
                Keep reviewing
              </button>
              <button className="button button--primary" onClick={onSubmitConfirm}>
                Submit anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ResultsScreen ─────────────────────────────────────────────────────────

function ResultsScreen({
  state,
  onRetake,
  onChangeMode,
}: {
  state: ResultsState;
  onRetake: () => void;
  onChangeMode: () => void;
}) {
  const [expandCorrect, setExpandCorrect] = useState(false);

  const total = state.questions.length;
  const score = state.statuses.filter((s, i) => s.selected === state.questions[i].correct).length;
  const pct = Math.round((score / total) * 100);
  const pass = pct >= 72;

  const domainStats = useMemo(() =>
    DOMAINS.map(d => {
      const items = state.questions
        .map((q, i) => ({ q, s: state.statuses[i] }))
        .filter(({ q }) => q.domain === d);
      const correct = items.filter(({ q, s }) => s.selected === q.correct).length;
      return { domain: d, correct, total: items.length };
    }),
    [state]
  );

  const incorrectItems = state.questions
    .map((q, i) => ({ q, status: state.statuses[i], num: i + 1 }))
    .filter(({ q, status }) => status.selected !== q.correct);

  const correctItems = state.questions
    .map((q, i) => ({ q, status: state.statuses[i], num: i + 1 }))
    .filter(({ q, status }) => status.selected === q.correct);

  const unansweredCount = state.statuses.filter(s => s.selected === null).length;

  return (
    <div className="mock-results-container">
      {/* Score hero */}
      <div className="mock-results-hero">
        <div className="mock-results-score">{score}/{total}</div>
        <div className="mock-results-pct" style={{ color: pass ? 'var(--cca-green)' : 'var(--cca-red)' }}>
          {pct}%
        </div>
        <div className={`mock-pass-badge ${pass ? 'pass' : 'fail'}`}>
          {pass ? '✓ Pass threshold reached (≥72%)' : '✗ Below pass threshold (72%)'}
        </div>
        <div className="mock-results-meta">
          Time: {formatTime(state.elapsedMs)} · {total - score} incorrect
          {unansweredCount > 0 ? ` · ${unansweredCount} unanswered` : ''}
          {' '}· {state.mode === 'simulated' ? '60-question simulated exam' : `${total}-question full practice`}
          {' '}· {state.feedbackMode === 'study' ? 'Study mode' : 'Exam mode'}
        </div>
      </div>

      {/* Domain breakdown */}
      <div className="mock-domain-breakdown">
        <p className="mock-section-label">Domain breakdown</p>
        {domainStats.map(({ domain, correct, total: dt }) => {
          if (dt === 0) return null;
          const dpct = Math.round((correct / dt) * 100);
          return (
            <div key={domain} className="mock-domain-result-row">
              <span className={`domain-badge ${DOMAIN_CLASS[domain]}`}>D{domain}</span>
              <span className="mock-domain-result-name">{DOMAIN_LABELS[domain]}</span>
              <div className="quiz-progress-bar" style={{ flex: 1 }}>
                <div
                  className="quiz-progress-fill"
                  style={{
                    width: `${dpct}%`,
                    background: dpct >= 72 ? 'var(--cca-green)' : 'var(--cca-red)',
                  }}
                />
              </div>
              <span className="mock-domain-result-score">{correct}/{dt} ({dpct}%)</span>
            </div>
          );
        })}
      </div>

      {/* Incorrect answers */}
      <div className="mock-review-section">
        <p className="mock-section-label">{incorrectItems.length} incorrect / unanswered</p>
        {incorrectItems.length === 0 ? (
          <p style={{ color: 'var(--cca-green)', fontSize: '0.9rem' }}>Perfect score — all answers correct!</p>
        ) : (
          incorrectItems.map(({ q, status, num }) => (
            <AnswerReviewCard key={q.id} question={q} userChoice={status.selected} questionNumber={num} />
          ))
        )}
      </div>

      {/* Correct answers (collapsed) */}
      {correctItems.length > 0 && (
        <div className="mock-review-section">
          <button className="mock-expand-toggle" onClick={() => setExpandCorrect(e => !e)}>
            {expandCorrect ? '▼' : '▶'} {correctItems.length} correct answer{correctItems.length !== 1 ? 's' : ''}
          </button>
          {expandCorrect && correctItems.map(({ q, status, num }) => (
            <AnswerReviewCard key={q.id} question={q} userChoice={status.selected} questionNumber={num} />
          ))}
        </div>
      )}

      {/* Action row */}
      <div className="mock-results-actions">
        <button className="button button--primary" onClick={onRetake}>Retake exam</button>
        <button className="button button--secondary" onClick={onChangeMode}>Change mode</button>
      </div>
    </div>
  );
}

// ── Root MockExam ─────────────────────────────────────────────────────────

export default function MockExam() {
  const [state, setState] = useState<MockExamState>({ screen: 'setup' });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulated exam countdown — auto-submits at 0
  useEffect(() => {
    if (state.screen !== 'exam' || state.mode !== 'simulated') return;
    timerRef.current = setInterval(() => {
      setState(prev => {
        if (prev.screen !== 'exam') return prev;
        const next = (prev.timeRemainingMs ?? 0) - 1000;
        if (next <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          return buildResultsState(prev);
        }
        return { ...prev, timeRemainingMs: next };
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.screen, state.screen === 'exam' ? (state as ExamState).mode : null]);

  const handleStart = useCallback((mode: ExamMode, feedbackMode: FeedbackMode) => {
    const questions = mode === 'simulated'
      ? selectSimulatedQuestions()
      : selectFullPracticeQuestions();
    setState({
      screen: 'exam',
      mode,
      feedbackMode,
      questions,
      statuses: questions.map(() => ({ selected: null, flagged: false, locked: false })),
      current: 0,
      startedAt: Date.now(),
      timeRemainingMs: mode === 'simulated' ? SIMULATED_DURATION_MS : null,
      submitWarning: false,
    });
  }, []);

  const handleSelect = useCallback((optionIdx: number) => {
    setState(prev => {
      if (prev.screen !== 'exam') return prev;
      const currentStatus = prev.statuses[prev.current];
      if (currentStatus.locked) return prev;
      const newStatuses = [...prev.statuses];
      newStatuses[prev.current] = {
        ...currentStatus,
        selected: optionIdx,
        locked: prev.feedbackMode === 'study',
      };
      return { ...prev, statuses: newStatuses };
    });
  }, []);

  const handleFlag = useCallback(() => {
    setState(prev => {
      if (prev.screen !== 'exam') return prev;
      const newStatuses = [...prev.statuses];
      newStatuses[prev.current] = {
        ...newStatuses[prev.current],
        flagged: !newStatuses[prev.current].flagged,
      };
      return { ...prev, statuses: newStatuses };
    });
  }, []);

  const handleNavigate = useCallback((idx: number) => {
    setState(prev => {
      if (prev.screen !== 'exam') return prev;
      if (idx < 0 || idx >= prev.questions.length) return prev;
      return { ...prev, current: idx };
    });
  }, []);

  const handleSubmitRequest = useCallback(() => {
    setState(prev => {
      if (prev.screen !== 'exam') return prev;
      const unanswered = prev.statuses.filter(s => s.selected === null).length;
      if (unanswered > 0) return { ...prev, submitWarning: true };
      if (timerRef.current) clearInterval(timerRef.current);
      return buildResultsState(prev);
    });
  }, []);

  const handleSubmitConfirm = useCallback(() => {
    setState(prev => {
      if (prev.screen !== 'exam') return prev;
      if (timerRef.current) clearInterval(timerRef.current);
      return buildResultsState(prev);
    });
  }, []);

  const handleDismissWarning = useCallback(() => {
    setState(prev => prev.screen === 'exam' ? { ...prev, submitWarning: false } : prev);
  }, []);

  if (state.screen === 'setup') {
    return <SetupScreen onStart={handleStart} />;
  }

  if (state.screen === 'exam') {
    return (
      <ExamScreen
        state={state}
        onSelect={handleSelect}
        onFlag={handleFlag}
        onNavigate={handleNavigate}
        onSubmit={handleSubmitRequest}
        onSubmitConfirm={handleSubmitConfirm}
        onDismissWarning={handleDismissWarning}
      />
    );
  }

  if (state.screen === 'results') {
    return (
      <ResultsScreen
        state={state}
        onRetake={() => {
          if (state.screen === 'results') handleStart(state.mode, state.feedbackMode);
        }}
        onChangeMode={() => setState({ screen: 'setup' })}
      />
    );
  }

  return null;
}
