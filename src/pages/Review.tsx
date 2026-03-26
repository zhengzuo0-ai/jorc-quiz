import { useState, useCallback } from 'react';
import type { Question } from '../types';
import { chapters } from '../data/chapters';
import { useErrorBook } from '../hooks/useErrorBook';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';

type Filter = 'due' | 'all';

export default function Review() {
  const { activeEntries, dueEntries, reviewAnswer } = useErrorBook();
  const [filter, setFilter] = useState<Filter>('due');
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewQuestions, setReviewQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const displayEntries = filter === 'due' ? dueEntries : activeEntries;
  const [now] = useState(() => Date.now());

  const startReview = useCallback(async () => {
    const entriesToReview = filter === 'due' ? dueEntries : activeEntries;
    if (entriesToReview.length === 0) return;

    setLoading(true);
    // Group by chapter and fetch questions
    const chapterIds = [...new Set(entriesToReview.map(e => e.chapterId))];
    const questionMap = new Map<string, Question>();

    await Promise.all(
      chapterIds.map(id =>
        fetch(`/data/${id}.json`)
          .then(res => (res.ok ? res.json() : []))
          .then((qs: Question[]) => qs.forEach(q => questionMap.set(q.id, q)))
          .catch(() => {})
      )
    );

    const questions = entriesToReview
      .map(e => questionMap.get(e.questionId))
      .filter((q): q is Question => q !== undefined);

    setReviewQuestions(questions);
    setCurrentIndex(0);
    setCorrectCount(0);
    setDone(false);
    setReviewMode(true);
    setLoading(false);
  }, [filter, dueEntries, activeEntries]);

  const handleAnswer = useCallback(
    (questionId: string, _selected: 'A' | 'B' | 'C' | 'D', correct: boolean) => {
      reviewAnswer(questionId, correct);
      if (correct) setCorrectCount(c => c + 1);
    },
    [reviewAnswer]
  );

  const handleNext = useCallback(() => {
    const next = currentIndex + 1;
    if (next >= reviewQuestions.length) {
      setDone(true);
    } else {
      setCurrentIndex(next);
    }
  }, [currentIndex, reviewQuestions.length]);

  if (reviewMode && done) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">复习完成</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-2">
            总题数: {reviewQuestions.length} · 正确: {correctCount} · 正确率: {reviewQuestions.length > 0 ? Math.round((correctCount / reviewQuestions.length) * 100) : 0}%
          </div>
          <button
            onClick={() => setReviewMode(false)}
            className="mt-4 px-4 py-2 text-sm border border-gray-200 rounded hover:bg-gray-50"
          >
            ← 返回错题本
          </button>
        </div>
      </div>
    );
  }

  if (reviewMode && reviewQuestions.length > 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setReviewMode(false)}
          className="text-sm text-gray-500 hover:text-blue-600 mb-2"
        >
          ← 返回错题本
        </button>
        <ProgressBar current={currentIndex} total={reviewQuestions.length} correct={correctCount} />
        <QuestionCard
          question={reviewQuestions[currentIndex]}
          index={currentIndex}
          total={reviewQuestions.length}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
      </div>
    );
  }

  // Error book list view
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">错题本</h1>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('due')}
            className={`text-sm px-3 py-1 rounded ${filter === 'due' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            待复习 ({dueEntries.length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`text-sm px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            全部 ({activeEntries.length})
          </button>
        </div>
        {displayEntries.length > 0 && (
          <button
            onClick={startReview}
            disabled={loading}
            className="text-sm px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '加载中...' : '开始复习'}
          </button>
        )}
      </div>

      {displayEntries.length === 0 ? (
        <div className="text-sm text-gray-500 mt-8 text-center">
          {filter === 'due' ? '暂无待复习的错题' : '暂无错题记录'}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {displayEntries.map(entry => {
            const chapter = chapters.find(c => c.id === entry.chapterId);
            const nextDate = new Date(entry.nextReview);
            const isOverdue = entry.nextReview <= now;
            return (
              <div
                key={entry.questionId}
                className="bg-white rounded border border-gray-200 px-4 py-3 text-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="text-gray-700 font-mono text-xs">{entry.questionId}</div>
                  <div className="text-xs text-gray-500">{chapter?.name}</div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>错误 {entry.wrongCount} 次</span>
                  <span className={isOverdue ? 'text-red-500' : ''}>
                    下次复习: {nextDate.toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
