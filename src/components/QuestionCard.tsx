import { useState, useEffect, useCallback } from 'react';
import type { Question } from '../types';

const optionKeys = ['A', 'B', 'C', 'D'] as const;
type OptionKey = (typeof optionKeys)[number];

interface Props {
  question: Question;
  index: number;
  total: number;
  onAnswer: (questionId: string, selected: OptionKey, correct: boolean) => void;
  onNext: () => void;
}

export default function QuestionCard({ question, index, total, onAnswer, onNext }: Props) {
  const [selected, setSelected] = useState<OptionKey | null>(null);
  const [trackedId, setTrackedId] = useState(question.id);
  if (trackedId !== question.id) {
    setTrackedId(question.id);
    setSelected(null);
  }
  const answered = selected !== null;
  const isCorrect = selected === question.correct;

  const handleSelect = useCallback(
    (key: OptionKey) => {
      if (answered) return;
      setSelected(key);
      onAnswer(question.id, key, key === question.correct);
    },
    [answered, question, onAnswer]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const keyMap: Record<string, OptionKey> = {
        '1': 'A', '2': 'B', '3': 'C', '4': 'D',
        a: 'A', b: 'B', c: 'C', d: 'D',
        A: 'A', B: 'B', C: 'C', D: 'D',
      };

      if (!answered && keyMap[e.key]) {
        e.preventDefault();
        handleSelect(keyMap[e.key]);
      } else if (answered && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onNext();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [answered, handleSelect, onNext]);

  function optionStyle(key: OptionKey): React.CSSProperties {
    if (!answered) return {};
    if (key === question.correct) {
      return { borderColor: 'var(--success)', background: 'rgba(34, 197, 94, 0.08)', color: '#166534' };
    }
    if (key === selected) {
      return { borderColor: 'var(--error)', background: 'rgba(239, 68, 68, 0.08)', color: '#991b1b' };
    }
    return { borderColor: 'var(--border)', color: 'var(--text-muted)' };
  }

  function optionClass(): string {
    const base = 'w-full text-left px-4 py-3.5 rounded-lg border text-sm transition-all duration-200';
    if (!answered) {
      return `${base} cursor-pointer`;
    }
    return base;
  }

  return (
    <div
      className="rounded-xl p-6 md:p-8 max-w-2xl mx-auto"
      style={{
        background: 'var(--white)',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: 'var(--gold-dim)', color: 'var(--gold)' }}
        >
          Q{index + 1}/{total}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
            question.difficulty === 1 ? 'bg-green-100 text-green-700' :
            question.difficulty === 2 ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {question.difficulty === 1 ? '基础' : question.difficulty === 2 ? '应用' : '综合'}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{question.chapterId}</span>
        </div>
      </div>

      {/* Question stem */}
      <p
        className="mb-6 leading-relaxed text-base"
        style={{ color: 'var(--text-primary)', fontWeight: 500 }}
      >
        {question.question}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-2.5 mb-4">
        {optionKeys.map(key => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            disabled={answered}
            className={optionClass()}
            style={{
              borderColor: 'var(--border)',
              ...optionStyle(key),
            }}
            onMouseEnter={e => {
              if (!answered) {
                e.currentTarget.style.borderColor = 'var(--gold)';
                e.currentTarget.style.background = 'var(--gold-dim)';
              }
            }}
            onMouseLeave={e => {
              if (!answered) {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = '';
              }
            }}
          >
            <span
              className="font-mono text-xs mr-2.5 opacity-50"
            >
              {key}
            </span>
            {question.options[key]}
          </button>
        ))}
      </div>

      {/* Explanation */}
      {answered && (
        <div className="pt-5 mt-5" style={{ borderTop: '1px solid var(--border)' }}>
          <div
            className="text-sm font-semibold mb-3"
            style={{ color: isCorrect ? 'var(--success)' : 'var(--error)' }}
          >
            {isCorrect ? '正确 ✓' : `错误 ✗ — 正确答案: ${question.correct}`}
          </div>
          <div
            className="text-sm leading-relaxed mb-3 p-4 rounded-lg"
            style={{
              background: 'var(--cream)',
              borderLeft: '3px solid var(--gold)',
              color: 'var(--text-secondary)',
            }}
          >
            {question.explanation}
          </div>
          <div className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
            <span className="font-semibold">关键概念:</span> {question.key_concept}
          </div>
          <div className="flex justify-end">
            <button
              onClick={onNext}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                background: 'var(--gold)',
                color: 'var(--white)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#9F7F3E'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold)'; }}
            >
              下一题 → (Enter)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
