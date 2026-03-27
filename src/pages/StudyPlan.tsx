import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { chapters } from '../data/chapters';
import { useProgress } from '../hooks/useProgress';
import { useErrorBook } from '../hooks/useErrorBook';
import { storage } from '../lib/storage';

interface PlanItem {
  id: string;
  type: 'read' | 'practice' | 'review';
  chapterId: string;
  label: string;
  estimate: string;
  link: string;
}

interface DailyCompletion {
  date: string;
  completed: string[];
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getCompletion(): DailyCompletion {
  const saved = storage.get<DailyCompletion>('studyPlan', { date: '', completed: [] });
  if (saved.date !== todayKey()) {
    return { date: todayKey(), completed: [] };
  }
  return saved;
}

function getConceptReadRecords(): { chapterId: string }[] {
  return storage.get<{ chapterId: string }[]>('conceptReads', []);
}

export default function StudyPlan() {
  const { getChapterStats } = useProgress();
  const { dueEntries } = useErrorBook();
  const [completion, setCompletion] = useState<DailyCompletion>(getCompletion);

  const plan = useMemo<PlanItem[]>(() => {
    const items: PlanItem[] = [];
    const readSet = new Set(getConceptReadRecords().map(r => r.chapterId));

    // 1. Due review items (highest priority)
    const reviewChapterIds = [...new Set(dueEntries.map(e => e.chapterId))];
    for (const chId of reviewChapterIds.slice(0, 3)) {
      const ch = chapters.find(c => c.id === chId);
      if (!ch) continue;
      const count = dueEntries.filter(e => e.chapterId === chId).length;
      items.push({
        id: `review-${chId}`,
        type: 'review',
        chapterId: chId,
        label: `复习 ${ch.name} 错题 (${count}题)`,
        estimate: `~${Math.max(5, count * 2)}min`,
        link: '/review',
      });
    }

    // 2. Unread concepts (prioritize)
    const unread = chapters.filter(c => !readSet.has(c.id));
    for (const ch of unread.slice(0, 2)) {
      items.push({
        id: `read-${ch.id}`,
        type: 'read',
        chapterId: ch.id,
        label: `阅读 ${ch.id} 概念 — ${ch.name}`,
        estimate: '~15min',
        link: `/concepts/${ch.id}`,
      });
    }

    // 3. Low-accuracy chapters for practice
    const chapterAccuracies = chapters
      .map(c => ({ chapter: c, stats: getChapterStats(c.id) }))
      .filter(x => x.stats.total > 0)
      .sort((a, b) => a.stats.accuracy - b.stats.accuracy);

    for (const { chapter } of chapterAccuracies.slice(0, 3)) {
      const stats = getChapterStats(chapter.id);
      items.push({
        id: `practice-${chapter.id}`,
        type: 'practice',
        chapterId: chapter.id,
        label: `练习 ${chapter.id} — ${chapter.name} (正确率 ${stats.accuracy}%)`,
        estimate: '~10min',
        link: `/practice/${chapter.id}`,
      });
    }

    // 4. If no low-accuracy chapters, suggest unattempted ones
    if (chapterAccuracies.length === 0) {
      const unattempted = chapters.filter(c => {
        const s = getChapterStats(c.id);
        return s.total === 0 && c.questionCount > 0;
      });
      for (const ch of unattempted.slice(0, 3)) {
        items.push({
          id: `practice-${ch.id}`,
          type: 'practice',
          chapterId: ch.id,
          label: `练习 ${ch.id} — ${ch.name} (未开始)`,
          estimate: '~10min',
          link: `/practice/${ch.id}`,
        });
      }
    }

    return items;
  }, [getChapterStats, dueEntries]);

  const toggleItem = useCallback((itemId: string) => {
    setCompletion(prev => {
      const isCompleted = prev.completed.includes(itemId);
      const next: DailyCompletion = {
        date: todayKey(),
        completed: isCompleted
          ? prev.completed.filter(id => id !== itemId)
          : [...prev.completed, itemId],
      };
      storage.set('studyPlan', next);
      return next;
    });
  }, []);

  const completedCount = plan.filter(item => completion.completed.includes(item.id)).length;
  const progress = plan.length > 0 ? Math.round((completedCount / plan.length) * 100) : 0;

  const typeIcon = (type: PlanItem['type']) => {
    if (type === 'read') return '📖';
    if (type === 'practice') return '⛏';
    return '🔄';
  };

  const typeColor = (type: PlanItem['type']) => {
    if (type === 'read') return 'var(--navy-light)';
    if (type === 'practice') return 'var(--gold)';
    return 'var(--error)';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1
        className="text-2xl font-semibold mb-2"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--navy-dark)' }}
      >
        每日学习计划
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        根据你的学习进度自动生成，优先复习错题和未读概念
      </p>

      {/* Progress summary */}
      <div
        className="rounded-xl p-5 mb-6"
        style={{
          background: 'var(--white)',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            今日进度
          </span>
          <span
            className="text-sm font-semibold"
            style={{ color: 'var(--gold)' }}
          >
            {completedCount}/{plan.length}
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--warm-gray)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(to right, var(--gold), var(--gold-light))',
            }}
          />
        </div>
        {completedCount === plan.length && plan.length > 0 && (
          <div className="text-sm mt-3 text-center font-medium" style={{ color: 'var(--gold)' }}>
            🎉 今日计划已完成！
          </div>
        )}
      </div>

      {/* Plan items */}
      {plan.length === 0 ? (
        <div
          className="text-sm text-center rounded-xl p-8"
          style={{ color: 'var(--text-muted)', background: 'var(--warm-gray)' }}
        >
          暂无学习建议，请先开始练习或阅读概念
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {plan.map(item => {
            const isDone = completion.completed.includes(item.id);
            return (
              <div
                key={item.id}
                className="rounded-xl p-4 transition-all duration-200"
                style={{
                  background: isDone ? 'var(--warm-gray)' : 'var(--white)',
                  border: '1px solid var(--border)',
                  opacity: isDone ? 0.7 : 1,
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 text-xs transition-all duration-200"
                    style={{
                      borderColor: isDone ? 'var(--gold)' : 'var(--border)',
                      background: isDone ? 'var(--gold)' : 'transparent',
                      color: isDone ? 'var(--white)' : 'transparent',
                    }}
                  >
                    ✓
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: `${typeColor(item.type)}15`,
                          color: typeColor(item.type),
                        }}
                      >
                        {typeIcon(item.type)} {item.type === 'read' ? '阅读' : item.type === 'practice' ? '练习' : '复习'}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {item.estimate}
                      </span>
                    </div>
                    <div
                      className="text-sm"
                      style={{
                        color: 'var(--text-primary)',
                        textDecoration: isDone ? 'line-through' : 'none',
                      }}
                    >
                      {item.label}
                    </div>
                  </div>

                  {/* Go link */}
                  <Link
                    to={item.link}
                    className="text-xs px-3 py-1 rounded-lg font-medium shrink-0 transition-all duration-200"
                    style={{
                      background: 'var(--gold-dim)',
                      color: 'var(--gold)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'var(--gold)';
                      e.currentTarget.style.color = 'var(--white)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'var(--gold-dim)';
                      e.currentTarget.style.color = 'var(--gold)';
                    }}
                  >
                    开始 →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
