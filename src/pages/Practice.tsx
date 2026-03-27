import { useState, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { ChapterStats } from '../types';
import { chapters, jorcChapters, goldChapters } from '../data/chapters';
import { useQuestions } from '../hooks/useQuestions';
import { useProgress } from '../hooks/useProgress';
import { useErrorBook } from '../hooks/useErrorBook';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import ChapterList from '../components/ChapterList';

type DomainFilter = 'all' | 'jorc' | 'gold';

function ChapterSelector({ getChapterStats }: { getChapterStats: (id: string) => ChapterStats }) {
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState<DomainFilter>('all');

  const filteredJorc = useMemo(() => {
    const q = search.toLowerCase().trim();
    return jorcChapters.filter(c =>
      !q || c.name.toLowerCase().includes(q) || c.nameEn.toLowerCase().includes(q) || c.id.includes(q)
    );
  }, [search]);

  const filteredGold = useMemo(() => {
    const q = search.toLowerCase().trim();
    return goldChapters.filter(c =>
      !q || c.name.toLowerCase().includes(q) || c.nameEn.toLowerCase().includes(q) || c.id.includes(q)
    );
  }, [search]);

  return (
    <div className="max-w-3xl mx-auto">
      <h1
        className="text-2xl font-semibold mb-2"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--navy-dark)' }}
      >
        练习
      </h1>
      <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
        选择一个章节开始练习
      </p>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索章节 Search chapters..."
            className="w-full text-sm px-4 py-2 rounded-lg outline-none transition-all duration-200"
            style={{
              background: 'var(--white)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
          />
        </div>
        <div className="flex gap-2">
          {([['all', '全部'], ['jorc', 'JORC'], ['gold', 'Gold']] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setDomainFilter(val)}
              className="px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200"
              style={{
                background: domainFilter === val ? 'var(--gold)' : 'var(--warm-gray)',
                color: domainFilter === val ? 'var(--white)' : 'var(--text-secondary)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {(domainFilter === 'all' || domainFilter === 'jorc') && filteredJorc.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: 'var(--text-muted)' }}
          >
            JORC Code
          </h2>
          <ChapterList chapters={filteredJorc} getStats={getChapterStats} />
        </div>
      )}
      {(domainFilter === 'all' || domainFilter === 'gold') && filteredGold.length > 0 && (
        <div>
          <h2
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: 'var(--text-muted)' }}
          >
            Gold Exploration
          </h2>
          <ChapterList chapters={filteredGold} getStats={getChapterStats} />
        </div>
      )}

      {filteredJorc.length === 0 && filteredGold.length === 0 && (
        <div className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>
          没有匹配的章节
        </div>
      )}
    </div>
  );
}

interface SessionResult {
  total: number;
  correct: number;
  wrong: { questionId: string; question: string }[];
}

export default function Practice() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const { questions, loading, error } = useQuestions(chapterId);
  const { recordAnswer, getChapterStats } = useProgress();
  const { addError } = useErrorBook();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [result, setResult] = useState<SessionResult | null>(null);

  // Reset session when chapter changes
  const [activeChapter, setActiveChapter] = useState(chapterId);
  if (chapterId !== activeChapter) {
    setActiveChapter(chapterId);
    setCurrentIndex(0);
    setCorrectCount(0);
    setResult(null);
  }

  const handleAnswer = useCallback(
    (questionId: string, selected: 'A' | 'B' | 'C' | 'D', correct: boolean) => {
      recordAnswer({
        questionId,
        chapterId: chapterId!,
        correct,
        selectedAnswer: selected,
        answeredAt: Date.now(),
      });
      if (correct) {
        setCorrectCount(c => c + 1);
      } else {
        addError(questionId, chapterId!);
      }
    },
    [chapterId, recordAnswer, addError]
  );

  const handleNext = useCallback(() => {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= questions.length) {
      const answered = nextIdx;
      setResult({
        total: answered,
        correct: correctCount + (questions[currentIndex] ? 0 : 0),
        wrong: [],
      });
    } else {
      setCurrentIndex(nextIdx);
    }
  }, [currentIndex, questions.length, correctCount]);

  // Chapter selection view
  if (!chapterId) {
    return <ChapterSelector getChapterStats={getChapterStats} />;
  }

  const chapter = chapters.find(c => c.id === chapterId);

  if (loading) {
    return (
      <div className="text-center mt-16" style={{ color: 'var(--text-muted)' }}>
        加载中...
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center mt-16">
        <p className="mb-4" style={{ color: 'var(--text-muted)' }}>{chapter?.name ?? chapterId}: 暂无题目</p>
        <Link
          to="/practice"
          className="text-sm font-medium transition-colors duration-200"
          style={{ color: 'var(--gold)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold-light)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--gold)'; }}
        >
          ← 返回章节列表
        </Link>
      </div>
    );
  }

  // Session complete
  if (result) {
    const accuracy = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto">
        <h2
          className="text-xl font-semibold mb-5"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--navy-dark)' }}
        >
          {chapter?.name} — 练习完成
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
              {questions.length} 题 · 正确 {correctCount}
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Link
              to="/practice"
              className="px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--warm-gray)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = ''; }}
            >
              ← 返回章节
            </Link>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setCorrectCount(0);
                setResult(null);
              }}
              className="px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200"
              style={{ background: 'var(--gold)', color: 'var(--white)' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#9F7F3E'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold)'; }}
            >
              再做一次
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <Link
          to="/practice"
          className="text-sm font-medium transition-colors duration-200"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          ← {chapter?.name}
        </Link>
      </div>
      <ProgressBar current={currentIndex} total={questions.length} correct={correctCount} />
      <QuestionCard
        question={questions[currentIndex]}
        index={currentIndex}
        total={questions.length}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </div>
  );
}
