import { Link } from 'react-router-dom';
import { jorcChapters, goldChapters } from '../data/chapters';
import { useProgress } from '../hooks/useProgress';
import { useErrorBook } from '../hooks/useErrorBook';

export default function Home() {
  const { getChapterStats, totalAnswered, overallAccuracy, getDailyStreak, getWeakChapters, getTodayCount } = useProgress();
  const { dueEntries } = useErrorBook();
  const streak = getDailyStreak();
  const todayCount = getTodayCount();
  const allChapterIds = [...jorcChapters, ...goldChapters].map(c => c.id);
  const weakChapters = getWeakChapters(allChapterIds);

  const jorcStats = jorcChapters.reduce(
    (acc, ch) => {
      const s = getChapterStats(ch.id);
      return { total: acc.total + s.total, correct: acc.correct + s.correct };
    },
    { total: 0, correct: 0 }
  );

  const goldStats = goldChapters.reduce(
    (acc, ch) => {
      const s = getChapterStats(ch.id);
      return { total: acc.total + s.total, correct: acc.correct + s.correct };
    },
    { total: 0, correct: 0 }
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">JORC Quiz</h1>

      {/* Domain cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="font-medium text-gray-800 mb-1">JORC Code</div>
          <div className="text-sm text-gray-500">{jorcChapters.length} 章</div>
          <div className="text-sm text-gray-500">
            已做 {jorcStats.total} 题
            {jorcStats.total > 0 && ` · ${Math.round((jorcStats.correct / jorcStats.total) * 100)}%`}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="font-medium text-gray-800 mb-1">Gold Exploration</div>
          <div className="text-sm text-gray-500">{goldChapters.length} 章</div>
          <div className="text-sm text-gray-500">
            已做 {goldStats.total} 题
            {goldStats.total > 0 && ` · ${Math.round((goldStats.correct / goldStats.total) * 100)}%`}
          </div>
        </div>
      </div>

      {/* Today's progress & streak */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">
              今日已做 <span className="font-medium text-gray-800">{todayCount}</span> 题
            </div>
            <div className="text-sm text-gray-600">
              总进度: {totalAnswered} 题 · 正确率 {overallAccuracy}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{streak}</div>
            <div className="text-xs text-gray-500">连续天数</div>
          </div>
        </div>
      </div>

      {/* Action items */}
      {dueEntries.length > 0 && (
        <Link to="/review" className="block bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-3 hover:bg-yellow-100">
          <div className="text-sm text-yellow-800 font-medium">
            待复习错题: {dueEntries.length} 道 →
          </div>
          <div className="text-xs text-yellow-600 mt-0.5">及时复习能有效巩固记忆</div>
        </Link>
      )}

      {weakChapters.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
          <div className="text-sm text-red-800 font-medium mb-1">
            薄弱章节 ({weakChapters.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {weakChapters.map(id => {
              const ch = [...jorcChapters, ...goldChapters].find(c => c.id === id);
              const stats = getChapterStats(id);
              return (
                <Link
                  key={id}
                  to={`/practice/${id}`}
                  className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded hover:bg-red-200"
                >
                  {ch?.name} ({stats.accuracy}%)
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Per-chapter accuracy */}
      <div className="mt-6">
        <h2 className="text-sm font-medium text-gray-700 mb-3">各章正确率</h2>

        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-2 font-medium">JORC Code</div>
          {jorcChapters.map(ch => {
            const stats = getChapterStats(ch.id);
            const hasQuestions = ch.questionCount > 0;
            return (
              <div key={ch.id} className="flex items-center gap-2 py-1 text-sm">
                <Link
                  to={hasQuestions ? `/practice/${ch.id}` : '#'}
                  className={`w-28 shrink-0 truncate ${hasQuestions ? 'text-gray-700 hover:text-blue-600' : 'text-gray-400'}`}
                >
                  {ch.name}
                </Link>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${stats.accuracy}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-24 text-right shrink-0">
                  {stats.total > 0 ? `${stats.accuracy}% (${stats.correct}/${stats.total})` : '—'}
                </span>
              </div>
            );
          })}
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-2 font-medium">Gold Exploration</div>
          {goldChapters.map(ch => {
            const stats = getChapterStats(ch.id);
            const hasQuestions = ch.questionCount > 0;
            return (
              <div key={ch.id} className="flex items-center gap-2 py-1 text-sm">
                <Link
                  to={hasQuestions ? `/practice/${ch.id}` : '#'}
                  className={`w-28 shrink-0 truncate ${hasQuestions ? 'text-gray-700 hover:text-blue-600' : 'text-gray-400'}`}
                >
                  {ch.name}
                </Link>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${stats.accuracy}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-24 text-right shrink-0">
                  {stats.total > 0 ? `${stats.accuracy}% (${stats.correct}/${stats.total})` : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
