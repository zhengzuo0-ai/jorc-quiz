import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
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

  // React 19 pattern: reset state when key prop changes via state tracking
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

  function optionClass(key: OptionKey): string {
    const base = 'w-full text-left px-4 py-3 rounded border text-sm transition-colors';
    if (!answered) {
      return `${base} border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer`;
    }
    if (key === question.correct) {
      return `${base} border-green-400 bg-green-50 text-green-900`;
    }
    if (key === selected) {
      return `${base} border-red-400 bg-red-50 text-red-900`;
    }
    return `${base} border-gray-200 text-gray-400`;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
        <span>Q{index + 1}/{total}</span>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-1.5 py-0.5 rounded ${
            question.difficulty === 1 ? 'bg-green-100 text-green-700' :
            question.difficulty === 2 ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {question.difficulty === 1 ? '基础' : question.difficulty === 2 ? '应用' : '综合'}
          </span>
          <span>{question.chapterId}</span>
        </div>
      </div>

      {/* Question stem */}
      <p className="text-gray-800 mb-6 leading-relaxed">{question.question}</p>

      {/* Options */}
      <div className="flex flex-col gap-2 mb-4">
        {optionKeys.map(key => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            disabled={answered}
            className={optionClass(key)}
          >
            <span className="font-medium mr-2">[{key}]</span>
            {question.options[key]}
          </button>
        ))}
      </div>

      {/* Explanation */}
      {answered && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className={`text-sm font-medium mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? '正确 ✓' : `错误 ✗ — 正确答案: ${question.correct}`}
          </div>
          <div className="text-sm text-gray-700 leading-relaxed mb-3">
            {question.explanation}
          </div>
          <div className="text-xs text-gray-500 mb-4">
            <span className="font-medium">关键概念:</span> {question.key_concept}
            <Link
              to={`/concepts/${question.chapterId}`}
              className="ml-2 text-blue-500 hover:underline"
            >
              查看知识点 →
            </Link>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onNext}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              下一题 → (Enter)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
