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

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-800 mb-4">学习进度 Progress</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: '已答题', value: totalAnswered, sub: `正确 ${totalCorrect}` },
          { label: '正确率', value: `${overallAccuracy}%`, sub: `错题 ${errorEntries.length}` },
          { label: '概念已读', value: conceptReads.length, sub: `共 ${chapters.length} 章` },
          { label: '连续天数', value: streak, sub: `活跃 ${activeDays} 天` },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-gray-800">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Due review reminder */}
      {dueEntries.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-sm text-amber-800">
          {dueEntries.length} 道错题待复习 — 前往错题本复习
        </div>
      )}

      {/* Chapter mastery */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
          章节掌握度 Chapter Mastery
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {chapterMastery.map(ch => {
            const barWidth = ch.stats.total > 0 ? ch.stats.accuracy : 0;
            const barColor =
              ch.stats.accuracy >= 90
                ? 'bg-green-500'
                : ch.stats.accuracy >= 70
                  ? 'bg-blue-500'
                  : ch.stats.accuracy >= 50
                    ? 'bg-amber-500'
                    : 'bg-red-400';
            return (
              <div key={ch.id} className="flex items-center gap-3 px-3 py-2">
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-gray-700 truncate">{ch.name}</div>
                  <div className="text-xs text-gray-400">{ch.nameEn}</div>
                </div>
                <div className="w-24 h-2 bg-gray-100 rounded-full shrink-0">
                  <div
                    className={`h-full rounded-full ${barColor}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <span
                  className={`text-xs w-14 text-right shrink-0 ${
                    ch.level === '精通'
                      ? 'text-green-600'
                      : ch.level === '熟练'
                        ? 'text-blue-600'
                        : ch.level === '需加强'
                          ? 'text-red-500'
                          : 'text-gray-400'
                  }`}
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
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
          最近活动 Recent Activity
        </h2>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-gray-400">暂无活动记录</p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    item.type === 'correct'
                      ? 'bg-green-500'
                      : item.type === 'wrong'
                        ? 'bg-red-400'
                        : 'bg-blue-400'
                  }`}
                />
                <span className="text-sm text-gray-700 flex-1 truncate">{item.label}</span>
                <span className="text-xs text-gray-400 shrink-0">
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
