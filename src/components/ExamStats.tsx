import React from 'react';
import { QUESTION_COUNT, DOMAINS, TIERS } from '../data/questions';

const STATS = [
  { value: '60', label: 'Exam questions' },
  { value: String(DOMAINS.length), label: 'Domains' },
  { value: '720', label: 'Passing score' },
  { value: '6', label: 'Scenarios' },
  { value: String(QUESTION_COUNT), label: 'Practice questions' },
  { value: String(TIERS.length), label: 'Difficulty tiers' },
];

export default function ExamStats() {
  return (
    <div className="stats-bar">
      {STATS.map(s => (
        <div key={s.label} className="stat-item">
          <div className="stat-value">{s.value}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
