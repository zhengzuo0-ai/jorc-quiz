import { useState } from 'react';
import { Link } from 'react-router-dom';
import { chapters, jorcChapters, goldChapters } from '../data/chapters';
import { useProgress, calcAccuracy } from '../hooks/useProgress';
import { useErrorBook } from '../hooks/useErrorBook';
import { storage } from '../lib/storage';

function aggregateStats(chs: typeof jorcChapters, getStats: (id: string) => { total: number; correct: number }) {
  let total = 0, correct = 0;
  for (const ch of chs) { const s = getStats(ch.id); total += s.total; correct += s.correct; }
  return { total, correct };
}

export default function Home() {
  const { getChapterStats, overallAccuracy, dailyStreak, getWeakChapters, todayCount } = useProgress();
  const { dueEntries } = useErrorBook();
  const [readConcepts] = useState(() => storage.get<string[]>('read_concepts', []));
  const allChapterIds = chapters.map(c => c.id);
  const weakChapters = getWeakChapters(allChapterIds);

  const jorcStats = aggregateStats(jorcChapters, getChapterStats);
  const goldStats = aggregateStats(goldChapters, getChapterStats);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 mb-6 text-white">
        <h1 className="text-lg font-semibold mb-1">JORC Quiz</h1>
        <p className="text-blue-100 text-sm mb-4">矿业知识学习平台 · Mining Knowledge Platform</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/15 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{dailyStreak}</div>
            <div className="text-xs text-blue-200">连续天数</div>
          </div>
          <div className="bg-white/15 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{todayCount}</div>
            <div className="text-xs text-blue-200">今日做题</div>
          </div>
          <div className="bg-white/15 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{overallAccuracy}%</div>
            <div className="text-xs text-blue-200">正确率</div>
          </div>
        </div>
      </div>

      {/* Domain cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <Link to="/concepts" className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="text-xs text-blue-600 font-medium mb-1">JORC Code</div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-800">{readConcepts.filter(id => id.startsWith('jorc')).length}</span>
            <span className="text-xs text-gray-400">/{jorcChapters.length} 章已读</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {jorcStats.total} 题{jorcStats.total > 0 ? ` · ${calcAccuracy(jorcStats.correct, jorcStats.total)}%` : ''}
          </div>
        </Link>
        <Link to="/concepts" className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="text-xs text-amber-600 font-medium mb-1">Gold Exploration</div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-800">{readConcepts.filter(id => id.startsWith('gold')).length}</span>
            <span className="text-xs text-gray-400">/{goldChapters.length} 章已读</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {goldStats.total} 题{goldStats.total > 0 ? ` · ${calcAccuracy(goldStats.correct, goldStats.total)}%` : ''}
          </div>
        </Link>
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

      {/* Smart recommendation */}
      {(() => {
        // Find chapters not yet attempted or with few attempts
        const untried = chapters.filter(c => c.questionCount > 0 && getChapterStats(c.id).total === 0);
        const needsPractice = chapters.filter(c => {
          const s = getChapterStats(c.id);
          return c.questionCount > 0 && s.total > 0 && s.total < 10;
        });
        const recommended = untried.length > 0 ? untried[0] : needsPractice[0];
        if (!recommended) return null;
        return (
          <Link
            to={untried.length > 0 ? `/concepts/${recommended.id}` : `/practice/${recommended.id}`}
            className="block bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-3 hover:bg-blue-100"
          >
            <div className="text-sm text-blue-800 font-medium">
              {untried.length > 0 ? '推荐学习' : '继续练习'}: {recommended.name} →
            </div>
            <div className="text-xs text-blue-600 mt-0.5">
              {untried.length > 0
                ? `还有 ${untried.length} 个章节未开始，先看看知识点吧`
                : `已做 ${getChapterStats(recommended.id).total} 题，建议多做几道巩固`}
            </div>
          </Link>
        );
      })()}

      {weakChapters.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
          <div className="text-sm text-red-800 font-medium mb-1">
            薄弱章节 ({weakChapters.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {weakChapters.map(id => {
              const ch = chapters.find(c => c.id === id);
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
