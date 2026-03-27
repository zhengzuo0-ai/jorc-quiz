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

  const [now] = useState(() => Date.now());
  const displayEntries = filter === 'due' ? dueEntries : activeEntries;

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
    const accuracy = reviewQuestions.length > 0 ? Math.round((correctCount / reviewQuestions.length) * 100) : 0;
    return (
      <div className="max-w-2xl mx-auto">
        <h2
          className="text-xl font-semibold mb-5"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--navy-dark)' }}
        >
          复习完成
        </h2>
        <div
          className="rounded-xl p-6"
          style={{
            background: 'var(--white)',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          <div className="text-center mb-5">
            <div
              className="text-4xl font-bold mb-1"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}
            >
              {accuracy}%
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {reviewQuestions.length} 题 · 正确 {correctCount}
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => setReviewMode(false)}
              className="px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--warm-gray)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = ''; }}
            >
              ← 返回错题本
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (reviewMode && reviewQuestions.length > 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setReviewMode(false)}
          className="text-sm font-medium mb-3 transition-colors duration-200"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
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
      <h1
        className="text-2xl font-semibold mb-5"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--navy-dark)' }}
      >
        错题本
      </h1>

      <div className="flex items-center gap-4 mb-5">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('due')}
            className="text-sm px-4 py-1.5 rounded-lg font-medium transition-all duration-200"
            style={{
              background: filter === 'due' ? 'var(--gold)' : 'var(--warm-gray)',
              color: filter === 'due' ? 'var(--white)' : 'var(--text-secondary)',
            }}
          >
            待复习 ({dueEntries.length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className="text-sm px-4 py-1.5 rounded-lg font-medium transition-all duration-200"
            style={{
              background: filter === 'all' ? 'var(--gold)' : 'var(--warm-gray)',
              color: filter === 'all' ? 'var(--white)' : 'var(--text-secondary)',
            }}
          >
            全部 ({activeEntries.length})
          </button>
        </div>
        {displayEntries.length > 0 && (
          <button
            onClick={startReview}
            disabled={loading}
            className="text-sm px-5 py-1.5 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
            style={{ background: 'var(--gold)', color: 'var(--white)' }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#A6843F'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold)'; }}
          >
            {loading ? '加载中...' : '开始复习'}
          </button>
        )}
      </div>

      {displayEntries.length === 0 ? (
        <div
          className="text-sm mt-8 text-center rounded-xl p-8"
          style={{
            color: 'var(--text-muted)',
            background: 'var(--warm-gray)',
          }}
        >
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
                className="rounded-xl px-4 py-3 text-sm transition-all duration-200"
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="font-mono text-xs" style={{ color: 'var(--text-primary)' }}>{entry.questionId}</div>
                  <div
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--gold-dim)', color: 'var(--gold)' }}
                  >
                    {chapter?.name}
                  </div>
                </div>
                <div className="flex justify-between mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>错误 {entry.wrongCount} 次</span>
                  <span style={{ color: isOverdue ? 'var(--error)' : 'var(--text-muted)' }}>
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
