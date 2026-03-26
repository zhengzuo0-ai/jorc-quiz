import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { chapters, jorcChapters, goldChapters } from '../data/chapters';
import { useQuestions } from '../hooks/useQuestions';
import { useProgress } from '../hooks/useProgress';
import { useErrorBook } from '../hooks/useErrorBook';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import ChapterList from '../components/ChapterList';

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
      setResult({
        total: nextIdx,
        correct: correctCount,
        wrong: [],
      });
    } else {
      setCurrentIndex(nextIdx);
    }
  }, [currentIndex, questions, correctCount]);

  // Chapter selection view
  if (!chapterId) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-800 mb-2">练习</h1>
        <p className="text-sm text-gray-500 mb-4">选择一个章节开始练习 · 建议从上到下依次学习</p>
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-5 text-xs text-blue-700">
          <span className="font-medium">学习路径建议:</span> 先阅读
          <Link to="/concepts" className="underline mx-0.5">知识点</Link>
          理解概念，再做对应章节的练习题巩固。做错的题目会自动进入
          <Link to="/review" className="underline mx-0.5">错题本</Link>
          ，系统会按遗忘曲线安排复习。
        </div>
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-600 mb-2">JORC Code</h2>
          <ChapterList chapters={jorcChapters} getStats={getChapterStats} />
        </div>
        <div>
          <h2 className="text-sm font-medium text-gray-600 mb-2">Gold Exploration</h2>
          <ChapterList chapters={goldChapters} getStats={getChapterStats} />
        </div>
      </div>
    );
  }

  const chapter = chapters.find(c => c.id === chapterId);

  const chapterStats = chapterId ? getChapterStats(chapterId) : null;

  if (loading) {
    return <div className="text-center text-gray-500 mt-12">加载中...</div>;
  }

  if (error || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center mt-12">
        <p className="text-gray-500 mb-4">{chapter?.name ?? chapterId}: 暂无题目</p>
        <Link to="/practice" className="text-blue-600 text-sm hover:underline">← 返回章节列表</Link>
      </div>
    );
  }

  // Session complete
  if (result) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {chapter?.name} — 练习完成
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-2">
            总题数: {questions.length} · 正确: {correctCount} · 正确率: {Math.round((correctCount / questions.length) * 100)}%
          </div>
          {chapterStats && chapterStats.total > 0 && (
            <div className="text-xs text-gray-500 mb-3">
              累计: {chapterStats.total} 题 · 总正确率 {chapterStats.accuracy}%
            </div>
          )}
          <div className="flex gap-3 mt-4">
            <Link
              to="/practice"
              className="px-4 py-2 text-sm border border-gray-200 rounded hover:bg-gray-50"
            >
              ← 返回章节
            </Link>
            <Link
              to={`/concepts/${chapterId}`}
              className="px-4 py-2 text-sm border border-blue-200 text-blue-600 rounded hover:bg-blue-50"
            >
              看知识点
            </Link>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setCorrectCount(0);
                setResult(null);
              }}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
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
      <div className="flex items-center justify-between mb-2">
        <Link to="/practice" className="text-sm text-gray-500 hover:text-blue-600">← {chapter?.name}</Link>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {chapterStats && chapterStats.total > 0 && (
            <span>历史正确率: {chapterStats.accuracy}%</span>
          )}
          <Link to={`/concepts/${chapterId}`} className="text-blue-500 hover:underline">知识点</Link>
        </div>
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
