import { Link } from 'react-router-dom';
import { jorcChapters, goldChapters } from '../data/chapters';
import { useProgress } from '../hooks/useProgress';
import { useErrorBook } from '../hooks/useErrorBook';

export default function Home() {
  const { getChapterStats, totalAnswered, overallAccuracy } = useProgress();
  const { dueEntries } = useErrorBook();

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
    <div className="max-w-3xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1
          className="text-3xl font-semibold mb-1"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--navy-dark)' }}
        >
          PMH Mining
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          矿业知识学习平台 · Mining Knowledge Platform
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }} className="mt-1">
          总进度: {totalAnswered} 题 · 正确率 {overallAccuracy}%
        </p>

        {/* Quick start for new users */}
        {totalAnswered === 0 && (
          <div
            className="mt-4 p-4 rounded-xl text-sm"
            style={{ background: 'var(--gold-dim)', border: '1px solid rgba(184,150,78,0.2)' }}
          >
            <p style={{ color: 'var(--text-primary)' }} className="font-medium mb-2">
              欢迎！从这里开始学习 👇
            </p>
            <div className="flex flex-wrap gap-2">
              <Link to="/concepts/learning-path" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--gold)', color: 'var(--white)' }}>
                📋 5周学习路径
              </Link>
              <Link to="/concepts/gold-01" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--navy-dark)', color: 'var(--text-light)' }}>
                📖 从黄金基础开始
              </Link>
              <Link to="/concepts/glossary" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                📚 术语表
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Error book reminder */}
      {dueEntries.length > 0 && (
        <Link
          to="/review"
          className="flex items-center gap-2 rounded-xl p-4 mb-6 text-sm font-medium transition-all duration-200 hover:opacity-90"
          style={{
            background: 'var(--gold-dim)',
            color: 'var(--gold)',
            border: '1px solid rgba(184, 150, 78, 0.3)',
          }}
        >
          <span>⚠</span>
          待复习错题: {dueEntries.length} 道 →
        </Link>
      )}

      {/* Domain cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {/* JORC Card */}
        <div
          className="rounded-xl p-5 transition-all duration-200 hover:shadow-lg"
          style={{
            background: 'var(--white)',
            border: '1px solid var(--border)',
            borderTop: '3px solid var(--navy-light)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
              style={{ background: 'var(--navy-dark)', color: 'var(--text-light)' }}
            >
              📋
            </div>
            <div>
              <div className="font-semibold" style={{ color: 'var(--navy-dark)' }}>JORC Code</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{jorcChapters.length} 章</div>
            </div>
          </div>
          <div className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            已做 {jorcStats.total} 题
            {jorcStats.total > 0 && (
              <span style={{ color: 'var(--gold)', fontWeight: 600, marginLeft: '0.5rem' }}>
                {Math.round((jorcStats.correct / jorcStats.total) * 100)}%
              </span>
            )}
          </div>
          {jorcStats.total > 0 && (
            <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--warm-gray)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round((jorcStats.correct / jorcStats.total) * 100)}%`,
                  background: 'linear-gradient(to right, var(--gold), var(--gold-light))',
                }}
              />
            </div>
          )}
        </div>

        {/* Gold Card */}
        <div
          className="rounded-xl p-5 transition-all duration-200 hover:shadow-lg"
          style={{
            background: 'var(--white)',
            border: '1px solid var(--border)',
            borderTop: '3px solid var(--gold)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
              style={{ background: 'var(--gold-dim)', color: 'var(--gold)' }}
            >
              🥇
            </div>
            <div>
              <div className="font-semibold" style={{ color: 'var(--navy-dark)' }}>Gold Exploration</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{goldChapters.length} 章</div>
            </div>
          </div>
          <div className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            已做 {goldStats.total} 题
            {goldStats.total > 0 && (
              <span style={{ color: 'var(--gold)', fontWeight: 600, marginLeft: '0.5rem' }}>
                {Math.round((goldStats.correct / goldStats.total) * 100)}%
              </span>
            )}
          </div>
          {goldStats.total > 0 && (
            <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--warm-gray)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round((goldStats.correct / goldStats.total) * 100)}%`,
                  background: 'linear-gradient(to right, var(--gold), var(--gold-light))',
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Per-chapter accuracy */}
      <div>
        <h2
          className="text-lg font-semibold mb-4"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--navy-dark)' }}
        >
          各章正确率
        </h2>

        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            JORC Code
          </div>
          {jorcChapters.map(ch => {
            const stats = getChapterStats(ch.id);
            const hasQuestions = ch.questionCount > 0;
            return (
              <div key={ch.id} className="flex items-center gap-3 py-1.5 text-sm">
                <Link
                  to={hasQuestions ? `/practice/${ch.id}` : '#'}
                  className="w-32 shrink-0 truncate font-medium transition-colors duration-200"
                  style={{ color: hasQuestions ? 'var(--text-primary)' : 'var(--text-muted)' }}
                  onMouseEnter={e => hasQuestions && (e.currentTarget.style.color = 'var(--gold)')}
                  onMouseLeave={e => hasQuestions && (e.currentTarget.style.color = 'var(--text-primary)')}
                >
                  {ch.name}
                </Link>
                <div className="flex-1 rounded-full h-2" style={{ background: 'var(--warm-gray)' }}>
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.accuracy}%`,
                      background: 'linear-gradient(to right, var(--gold), var(--gold-light))',
                    }}
                  />
                </div>
                <span className="text-xs w-28 text-right shrink-0" style={{ color: 'var(--text-muted)' }}>
                  {stats.total > 0 ? `${stats.accuracy}% (${stats.correct}/${stats.total})` : '—'}
                </span>
              </div>
            );
          })}
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Gold Exploration
          </div>
          {goldChapters.map(ch => {
            const stats = getChapterStats(ch.id);
            const hasQuestions = ch.questionCount > 0;
            return (
              <div key={ch.id} className="flex items-center gap-3 py-1.5 text-sm">
                <Link
                  to={hasQuestions ? `/practice/${ch.id}` : '#'}
                  className="w-32 shrink-0 truncate font-medium transition-colors duration-200"
                  style={{ color: hasQuestions ? 'var(--text-primary)' : 'var(--text-muted)' }}
                  onMouseEnter={e => hasQuestions && (e.currentTarget.style.color = 'var(--gold)')}
                  onMouseLeave={e => hasQuestions && (e.currentTarget.style.color = 'var(--text-primary)')}
                >
                  {ch.name}
                </Link>
                <div className="flex-1 rounded-full h-2" style={{ background: 'var(--warm-gray)' }}>
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.accuracy}%`,
                      background: 'linear-gradient(to right, var(--gold), var(--gold-light))',
                    }}
                  />
                </div>
                <span className="text-xs w-28 text-right shrink-0" style={{ color: 'var(--text-muted)' }}>
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
