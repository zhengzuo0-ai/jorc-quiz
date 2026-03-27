import { Link } from 'react-router-dom';
import type { Chapter, ChapterStats } from '../types';

interface Props {
  chapters: Chapter[];
  getStats?: (chapterId: string) => ChapterStats;
}

export default function ChapterList({ chapters, getStats }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {chapters.map(ch => {
        const stats = getStats?.(ch.id);
        const hasQuestions = ch.questionCount > 0;
        return (
          <Link
            key={ch.id}
            to={hasQuestions ? `/practice/${ch.id}` : '#'}
            className="flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-200"
            style={{
              background: 'var(--white)',
              border: '1px solid var(--border)',
              color: hasQuestions ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: hasQuestions ? 'pointer' : 'default',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
            onMouseEnter={e => {
              if (hasQuestions) {
                e.currentTarget.style.borderColor = 'var(--gold)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }
            }}
            onMouseLeave={e => {
              if (hasQuestions) {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';
              }
            }}
          >
            <div className="min-w-0">
              <span className="font-medium">{ch.name}</span>
              <span className="ml-2 text-xs" style={{ color: 'var(--text-muted)' }}>{ch.nameEn}</span>
            </div>
            {stats && stats.total > 0 && (
              <span
                className="text-xs font-semibold shrink-0 ml-2 px-2 py-0.5 rounded-full"
                style={{ background: 'var(--gold-dim)', color: 'var(--gold)' }}
              >
                {stats.accuracy}% ({stats.correct}/{stats.total})
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
