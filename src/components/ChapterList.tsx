import { Link } from 'react-router-dom';
import type { Chapter, ChapterStats } from '../types';

interface Props {
  chapters: Chapter[];
  getStats?: (chapterId: string) => ChapterStats;
}

export default function ChapterList({ chapters, getStats }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {chapters.map(ch => {
        const stats = getStats?.(ch.id);
        const hasQuestions = ch.questionCount > 0;
        return (
          <Link
            key={ch.id}
            to={hasQuestions ? `/practice/${ch.id}` : '#'}
            className={`flex items-center justify-between px-3 py-2 rounded text-sm ${
              hasQuestions
                ? 'hover:bg-gray-100 text-gray-700'
                : 'text-gray-400 cursor-default'
            }`}
          >
            <div className="min-w-0">
              <span className="font-medium">{ch.name}</span>
              <span className="text-gray-400 ml-2 text-xs">{ch.nameEn}</span>
            </div>
            {stats && stats.total > 0 && (
              <span className="text-xs text-gray-500 shrink-0 ml-2">
                {stats.accuracy}% ({stats.correct}/{stats.total})
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
