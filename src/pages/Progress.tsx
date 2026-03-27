import { useMemo } from 'react';
import { chapters } from '../data/chapters';
import { useProgress } from '../hooks/useProgress';
import { useErrorBook } from '../hooks/useErrorBook';
import { storage } from '../lib/storage';

interface ConceptReadRecord {
  chapterId: string;
  lastRead: number;
  readCount: number;
}

function getDayKey(ts: number) {
  return new Date(ts).toISOString().slice(0, 10);
}

export default function Progress() {
  const { answers, totalAnswered, totalCorrect, overallAccuracy, getChapterStats } = useProgress();
  const { entries: errorEntries, dueEntries } = useErrorBook();
  const conceptReads = storage.get<ConceptReadRecord[]>('conceptReads', []);

  const { streak, activeDays } = useMemo(() => {
    const days = new Set(answers.map(a => getDayKey(a.answeredAt)));
    conceptReads.forEach(r => days.add(getDayKey(r.lastRead)));

    const sorted = [...days].sort().reverse();
    let streak = 0;
    const today = getDayKey(Date.now());
    const yesterday = getDayKey(Date.now() - 86400000);

    if (sorted[0] !== today && sorted[0] !== yesterday) return { streak: 0, activeDays: days.size };

    const startDate = new Date(sorted[0]);
    for (let i = 0; i < sorted.length; i++) {
      const expected = new Date(startDate);
      expected.setDate(expected.getDate() - i);
      if (getDayKey(expected.getTime()) === sorted[i]) {
        streak++;
      } else {
        break;
      }
    }
    return { streak, activeDays: days.size };
  }, [answers, conceptReads]);

  const recentActivity = useMemo(() => {
    const items: { type: string; label: string; time: number }[] = [];

    answers.slice(-20).forEach(a => {
      const ch = chapters.find(c => c.id === a.chapterId);
      items.push({
        type: a.correct ? 'correct' : 'wrong',
        label: `${ch?.name ?? a.chapterId} — ${a.correct ? '✓' : '✗'}`,
        time: a.answeredAt,
      });
    });

    conceptReads.forEach(r => {
      const ch = chapters.find(c => c.id === r.chapterId);
      items.push({
        type: 'read',
        label: `阅读 ${ch?.name ?? r.chapterId}`,
        time: r.lastRead,
      });
    });

    return items.sort((a, b) => b.time - a.time).slice(0, 15);
  }, [answers, conceptReads]);

  const chapterMastery = useMemo(() => {
    return chapters.map(ch => {
      const stats = getChapterStats(ch.id);
      const isRead = conceptReads.some(r => r.chapterId === ch.id);
      let level: string;
      if (stats.total === 0) level = isRead ? '已读' : '未开始';
      else if (stats.accuracy >= 90) level = '精通';
      else if (stats.accuracy >= 70) level = '熟练';
      else if (stats.accuracy >= 50) level = '入门';
      else level = '需加强';
      return { ...ch, stats, isRead, level };
    });
  }, [getChapterStats, conceptReads]);

  const statCards = [
    { label: '已答题', value: totalAnswered, sub: `正确 ${totalCorrect}` },
    { label: '正确率', value: `${overallAccuracy}%`, sub: `错题 ${errorEntries.length}` },
    { label: '概念已读', value: conceptReads.length, sub: `共 ${chapters.length} 章` },
    { label: '连续天数', value: streak, sub: `活跃 ${activeDays} 天`, icon: '🔥' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h1
        className="text-2xl font-semibold mb-6"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--navy-dark)' }}
      >
        学习进度 Progress
      </h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map(s => (
          <div
            key={s.label}
            className="rounded-xl p-4 text-center"
            style={{
              background: 'var(--navy-dark)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            }}
          >
            <div
              className="text-3xl font-bold mb-1"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}
            >
              {'icon' in s && s.icon ? `${s.icon} ` : ''}{s.value}
            </div>
            <div className="text-xs font-medium" style={{ color: 'var(--text-light)' }}>{s.label}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Due review reminder */}
      {dueEntries.length > 0 && (
        <div
          className="rounded-xl p-4 mb-8 text-sm font-medium"
          style={{
            background: 'var(--gold-dim)',
            border: '1px solid rgba(184, 150, 78, 0.3)',
            color: 'var(--gold)',
          }}
        >
          ⚠ {dueEntries.length} 道错题待复习 — 前往错题本复习
        </div>
      )}

      {/* Chapter mastery */}
      <div className="mb-8">
        <h2
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          章节掌握度 Chapter Mastery
        </h2>
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: 'var(--white)',
            border: '1px solid var(--border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          {chapterMastery.map((ch, i) => {
            const barWidth = ch.stats.total > 0 ? ch.stats.accuracy : 0;
            const barColor =
              ch.stats.accuracy >= 90
                ? 'var(--gold)'
                : ch.stats.accuracy >= 70
                  ? 'var(--gold-light)'
                  : ch.stats.accuracy >= 50
                    ? '#D4A853'
                    : 'var(--error)';
            return (
              <div
                key={ch.id}
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  borderBottom: i < chapterMastery.length - 1 ? '1px solid var(--warm-gray)' : 'none',
                }}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{ch.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{ch.nameEn}</div>
                </div>
                <div className="w-24 h-2 rounded-full shrink-0" style={{ background: 'var(--warm-gray)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%`, background: barColor }}
                  />
                </div>
                <span
                  className="text-xs font-semibold w-14 text-right shrink-0"
                  style={{
                    color:
                      ch.level === '精通' ? 'var(--gold)'
                        : ch.level === '熟练' ? 'var(--gold-light)'
                          : ch.level === '需加强' ? 'var(--error)'
                            : 'var(--text-muted)',
                  }}
                >
                  {ch.level}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h2
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          最近活动 Recent Activity
        </h2>
        {recentActivity.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>暂无活动记录</p>
        ) : (
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: 'var(--white)',
              border: '1px solid var(--border)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  borderBottom: i < recentActivity.length - 1 ? '1px solid var(--warm-gray)' : 'none',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    background:
                      item.type === 'correct' ? 'var(--success)'
                        : item.type === 'wrong' ? 'var(--error)'
                          : 'var(--gold)',
                  }}
                />
                <span className="text-sm flex-1 truncate" style={{ color: 'var(--text-primary)' }}>
                  {item.label}
                </span>
                <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>
                  {new Date(item.time).toLocaleString('zh-CN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
