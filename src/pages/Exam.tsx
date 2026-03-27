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

  // Transition back to config if no questions available
  if (phase === 'exam' && questions.length === 0 && !loading && startedChapterIds.length > 0) {
    setPhase('config');
  }

  const finishExam = useCallback(() => {
    setTimerRunning(false);
    setPhase('result');
  }, []);

  const handleAnswer = useCallback(
    (questionId: string, selected: 'A' | 'B' | 'C' | 'D', correct: boolean) => {
      setExamAnswers(prev => [...prev, { questionId, selected, correct }]);
      const q = questions.find(q => q.id === questionId);
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
    [questions, recordAnswer, addError]
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
        <h1
          className="text-2xl font-semibold mb-6"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--navy-dark)' }}
        >
          模考
        </h1>

        <div
          className="rounded-xl p-6"
          style={{
            background: 'var(--white)',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          <div className="mb-5">
            <label className="text-sm block mb-2" style={{ color: 'var(--text-secondary)' }}>范围</label>
            <div className="flex gap-2">
              {([['both', '全部'], ['jorc', 'JORC'], ['gold', 'Gold']] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setDomain(val)}
                  className="px-4 py-1.5 text-sm rounded-lg font-medium transition-all duration-200"
                  style={{
                    background: domain === val ? 'var(--gold)' : 'var(--warm-gray)',
                    color: domain === val ? 'var(--white)' : 'var(--text-secondary)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="text-sm block mb-2" style={{ color: 'var(--text-secondary)' }}>题数</label>
            <div className="flex gap-2">
              {[10, 25, 50].map(n => (
                <button
                  key={n}
                  onClick={() => setQuestionCount(n)}
                  className="px-4 py-1.5 text-sm rounded-lg font-medium transition-all duration-200"
                  style={{
                    background: questionCount === n ? 'var(--gold)' : 'var(--warm-gray)',
                    color: questionCount === n ? 'var(--white)' : 'var(--text-secondary)',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm block mb-2" style={{ color: 'var(--text-secondary)' }}>时间限制</label>
            <div className="flex gap-2">
              {[15, 30, 60, 90].map(m => (
                <button
                  key={m}
                  onClick={() => setTimeMinutes(m)}
                  className="px-4 py-1.5 text-sm rounded-lg font-medium transition-all duration-200"
                  style={{
                    background: timeMinutes === m ? 'var(--gold)' : 'var(--warm-gray)',
                    color: timeMinutes === m ? 'var(--white)' : 'var(--text-secondary)',
                  }}
                >
                  {m} 分钟
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startExam}
            className="w-full py-2.5 text-sm font-semibold rounded-lg transition-all duration-200"
            style={{ background: 'var(--gold)', color: 'var(--white)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#A6843F'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold)'; }}
          >
            开始模考
          </button>
        </div>
      </div>
    );
  }

  // Loading
  if (loading || (phase === 'exam' && questions.length === 0)) {
    return <div className="text-center mt-12" style={{ color: 'var(--text-muted)' }}>加载题目中...</div>;
  }

  // Exam phase
  if (phase === 'exam') {
    const correctCount = examAnswers.filter(a => a.correct).length;
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {currentIndex + 1}/{questions.length} · 正确 {correctCount}
          </span>
          <div
            className="px-3 py-1 rounded-lg text-sm font-mono"
            style={{ background: 'var(--gold-dim)', color: 'var(--gold)' }}
          >
            <Timer totalSeconds={timeMinutes * 60} onTimeUp={finishExam} running={timerRunning} />
          </div>
        </div>

        {/* Question navigator */}
        <div className="flex flex-wrap gap-1 mb-4">
          {questions.map((q, i) => {
            const ans = examAnswers.find(a => a.questionId === q.id);
            const isCurrent = i === currentIndex;
            const isCorrect = ans?.correct;
            const isWrong = ans && !ans.correct;
            return (
              <button
                key={q.id}
                className="w-7 h-7 text-xs rounded border font-medium transition-all duration-200"
                style={{
                  borderColor: isCurrent ? 'var(--gold)' : isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : 'var(--border)',
                  background: isCurrent ? 'var(--gold-dim)' : isCorrect ? 'rgba(34,197,94,0.1)' : isWrong ? 'rgba(239,68,68,0.1)' : 'transparent',
                  color: isCurrent ? 'var(--gold)' : isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : 'var(--text-muted)',
                }}
                onClick={() => setCurrentIndex(i)}
              >
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
    const ans = examAnswers.find(a => a.questionId === q.id);
    return ans && !ans.correct;
  });

  return (
    <div className="max-w-2xl mx-auto">
      <h2
        className="text-xl font-semibold mb-5"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--navy-dark)' }}
      >
        模考结果
      </h2>
      <div
        className="rounded-xl p-6 mb-6"
        style={{
          background: 'var(--white)',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        }}
      >
        <div className="text-center mb-4">
          <div
            className="text-4xl font-bold mb-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}
          >
            {accuracy}%
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            总题数 {questions.length} · 正确 {correctCount} · 已答 {examAnswers.length}
          </div>
        </div>
      </div>

      {wrongQuestions.length > 0 && (
        <div>
          <h3
            className="text-sm font-semibold mb-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            错题 ({wrongQuestions.length})
          </h3>
          <div className="flex flex-col gap-2">
            {wrongQuestions.map(q => {
              const ans = examAnswers.find(a => a.questionId === q.id);
              return (
                <div
                  key={q.id}
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: 'var(--cream)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ color: 'var(--text-primary)' }} className="mb-1">{q.question}</div>
                  <div className="text-xs" style={{ color: 'var(--error)' }}>
                    你的答案: {ans?.selected} · 正确答案: {q.correct}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{q.explanation}</div>
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
        className="mt-5 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200"
        style={{ background: 'var(--gold)', color: 'var(--white)' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#A6843F'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold)'; }}
      >
        再考一次
      </button>
    </div>
  );
}
