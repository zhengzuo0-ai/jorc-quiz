import { Link } from 'react-router-dom';
import type { Chapter, ChapterStats } from '../types';

interface Props {
  chapters: Chapter[];
  getStats?: (chapterId: string) => ChapterStats;
}

export default function ChapterList({ chapters, getStats }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {chapters.map((ch, idx) => {
        const stats = getStats?.(ch.id);
        const hasQuestions = ch.questionCount > 0;
        const isComplete = stats && stats.total >= ch.questionCount && ch.questionCount > 0;
        const hasStarted = stats && stats.total > 0;

        return (
          <Link
            key={ch.id}
            to={hasQuestions ? `/practice/${ch.id}` : '#'}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm transition-colors ${
              hasQuestions
                ? 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                : 'border-gray-100 bg-gray-50 text-gray-400 cursor-default'
            }`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-medium ${
              isComplete ? 'bg-green-100 text-green-700' :
              hasStarted ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-500'
            }`}>
              {isComplete ? '✓' : idx + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-gray-800 truncate">{ch.name}</div>
              <div className="text-xs text-gray-400 truncate">{ch.nameEn}</div>
            </div>
            <div className="shrink-0 text-right">
              {hasStarted ? (
                <div>
                  <div className={`text-xs font-medium ${
                    stats.accuracy >= 80 ? 'text-green-600' :
                    stats.accuracy >= 60 ? 'text-yellow-600' : 'text-red-500'
                  }`}>{stats.accuracy}%</div>
                  <div className="text-[10px] text-gray-400">{stats.total}/{ch.questionCount}</div>
                </div>
              ) : hasQuestions ? (
                <span className="text-xs text-gray-400">{ch.questionCount} 题</span>
              ) : null}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
