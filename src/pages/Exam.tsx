import { useState, useCallback, useMemo } from 'react';
import { chapters } from '../data/chapters';
import { useMultiChapterQuestions } from '../hooks/useQuestions';
import { useProgress } from '../hooks/useProgress';
import { useErrorBook } from '../hooks/useErrorBook';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';

type Domain = 'jorc' | 'gold' | 'both';
type Phase = 'config' | 'exam' | 'result';

interface ExamAnswer {
  questionId: string;
  selected: 'A' | 'B' | 'C' | 'D';
  correct: boolean;
}

export default function Exam() {
  const [phase, setPhase] = useState<Phase>('config');
  const [domain, setDomain] = useState<Domain>('both');
  const [questionCount, setQuestionCount] = useState(25);
  const [timeMinutes, setTimeMinutes] = useState(30);
  const [examAnswers, setExamAnswers] = useState<ExamAnswer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [startedChapterIds, setStartedChapterIds] = useState<string[]>([]);

  const { recordAnswer } = useProgress();
  const { addError } = useErrorBook();

  const chapterIds = useMemo(() => {
    const available = chapters.filter(c => c.questionCount > 0);
    if (domain === 'jorc') return available.filter(c => c.domain === 'jorc').map(c => c.id);
    if (domain === 'gold') return available.filter(c => c.domain === 'gold').map(c => c.id);
    return available.map(c => c.id);
  }, [domain]);

  const { questions, loading } = useMultiChapterQuestions(startedChapterIds, questionCount);

  const startExam = useCallback(() => {
    setStartedChapterIds(chapterIds);
    setExamAnswers([]);
    setCurrentIndex(0);
    setPhase('exam');
    setTimerRunning(true);
  }, [chapterIds]);

  const questionMap = useMemo(() => new Map(questions.map(q => [q.id, q])), [questions]);
  const answerMap = useMemo(() => new Map(examAnswers.map(a => [a.questionId, a])), [examAnswers]);

  const finishExam = useCallback(() => {
    setTimerRunning(false);
    setPhase('result');
  }, []);

  const handleAnswer = useCallback(
    (questionId: string, selected: 'A' | 'B' | 'C' | 'D', correct: boolean) => {
      setExamAnswers(prev => [...prev, { questionId, selected, correct }]);
      const q = questionMap.get(questionId);
      if (q) {
        recordAnswer({
          questionId,
          chapterId: q.chapterId,
          correct,
          selectedAnswer: selected,
          answeredAt: Date.now(),
        });
        if (!correct) addError(questionId, q.chapterId);
      }
    },
    [questionMap, recordAnswer, addError]
  );

  const handleNext = useCallback(() => {
    const next = currentIndex + 1;
    if (next >= questions.length) {
      finishExam();
    } else {
      setCurrentIndex(next);
    }
  }, [currentIndex, questions.length, finishExam]);

  // Config phase
  if (phase === 'config') {
    return (
      <div className="max-w-md mx-auto">
        <h1 className="text-xl font-semibold text-gray-800 mb-6">模考</h1>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-2">范围</label>
            <div className="flex gap-2">
              {([['both', '全部'], ['jorc', 'JORC'], ['gold', 'Gold']] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setDomain(val)}
                  className={`px-3 py-1.5 text-sm rounded ${
                    domain === val ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-2">题数</label>
            <div className="flex gap-2">
              {[10, 25, 50].map(n => (
                <button
                  key={n}
                  onClick={() => setQuestionCount(n)}
                  className={`px-3 py-1.5 text-sm rounded ${
                    questionCount === n ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm text-gray-600 block mb-2">时间限制</label>
            <div className="flex gap-2">
              {[15, 30, 60, 90].map(m => (
                <button
                  key={m}
                  onClick={() => setTimeMinutes(m)}
                  className={`px-3 py-1.5 text-sm rounded ${
                    timeMinutes === m ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {m} 分钟
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startExam}
            className="w-full py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            开始模考
          </button>
        </div>
      </div>
    );
  }

  // Loading
  if (phase === 'exam' && (loading || questions.length === 0)) {
    if (!loading && questions.length === 0 && startedChapterIds.length > 0) {
      // No questions available — show fallback
      return (
        <div className="text-center mt-12">
          <p className="text-gray-500 mb-4">暂无题目</p>
          <button
            onClick={() => { setPhase('config'); setStartedChapterIds([]); }}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            返回设置
          </button>
        </div>
      );
    }
    return <div className="text-center text-gray-500 mt-12">加载题目中...</div>;
  }

  // Exam phase
  if (phase === 'exam') {
    const correctCount = examAnswers.filter(a => a.correct).length;
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            {currentIndex + 1}/{questions.length} · 正确 {correctCount}
          </span>
          <Timer totalSeconds={timeMinutes * 60} onTimeUp={finishExam} running={timerRunning} />
        </div>

        {/* Question navigator */}
        <div className="flex flex-wrap gap-1 mb-4">
          {questions.map((q, i) => {
            const ans = answerMap.get(q.id);
            let cls = 'w-7 h-7 text-xs rounded border ';
            if (i === currentIndex) cls += 'border-blue-600 bg-blue-50 text-blue-600 font-medium';
            else if (ans?.correct) cls += 'border-green-400 bg-green-50 text-green-700';
            else if (ans && !ans.correct) cls += 'border-red-400 bg-red-50 text-red-700';
            else cls += 'border-gray-200 text-gray-400';
            return (
              <button key={q.id} className={cls} onClick={() => setCurrentIndex(i)}>
                {i + 1}
              </button>
            );
          })}
        </div>

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

  // Result phase
  const correctCount = examAnswers.filter(a => a.correct).length;
  const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const wrongQuestions = questions.filter(q => {
    const ans = answerMap.get(q.id);
    return ans && !ans.correct;
  });

  // Per-chapter breakdown
  const chapterBreakdown = (() => {
    const map = new Map<string, { total: number; correct: number }>();
    for (const q of questions) {
      const ans = answerMap.get(q.id);
      if (!ans) continue;
      const entry = map.get(q.chapterId) ?? { total: 0, correct: 0 };
      entry.total++;
      if (ans.correct) entry.correct++;
      map.set(q.chapterId, entry);
    }
    return Array.from(map.entries())
      .map(([id, s]) => ({ id, ...s, accuracy: Math.round((s.correct / s.total) * 100) }))
      .sort((a, b) => a.accuracy - b.accuracy);
  })();

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">模考结果</h2>
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <div className="text-sm text-gray-600 space-y-1">
          <div>总题数: {questions.length}</div>
          <div>正确: {correctCount} · 正确率: {accuracy}%</div>
          <div>已答: {examAnswers.length}/{questions.length}</div>
        </div>
        {chapterBreakdown.length > 1 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500 font-medium mb-2">各章表现</div>
            {chapterBreakdown.map(ch => {
              const chapter = chapters.find(c => c.id === ch.id);
              return (
                <div key={ch.id} className="flex items-center gap-2 text-xs py-0.5">
                  <span className="w-20 truncate text-gray-600">{chapter?.name ?? ch.id}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${ch.accuracy >= 80 ? 'bg-green-500' : ch.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${ch.accuracy}%` }}
                    />
                  </div>
                  <span className="text-gray-500 w-16 text-right">{ch.accuracy}% ({ch.correct}/{ch.total})</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {wrongQuestions.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">错题 ({wrongQuestions.length})</h3>
          <div className="flex flex-col gap-2">
            {wrongQuestions.map(q => {
              const ans = answerMap.get(q.id);
              return (
                <div key={q.id} className="bg-white rounded border border-gray-200 px-4 py-3 text-sm">
                  <div className="text-gray-700 mb-1">{q.question}</div>
                  <div className="text-xs text-red-600">
                    你的答案: {ans?.selected} · 正确答案: {q.correct}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{q.explanation}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={() => {
          setPhase('config');
          setStartedChapterIds([]);
        }}
        className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        再考一次
      </button>
    </div>
  );
}
