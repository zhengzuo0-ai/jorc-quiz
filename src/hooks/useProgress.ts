import { useState, useCallback, useMemo } from 'react';
import type { AnswerRecord, ChapterStats } from '../types';
import { storage } from '../lib/storage';

const WEAK_MIN_ANSWERS = 5;
const WEAK_ACCURACY_THRESHOLD = 60;

export function calcAccuracy(correct: number, total: number): number {
  return total > 0 ? Math.round((correct / total) * 100) : 0;
}

export function useProgress() {
  const [answers, setAnswers] = useState<AnswerRecord[]>(() =>
    storage.get<AnswerRecord[]>('answers', [])
  );

  const recordAnswer = useCallback((record: AnswerRecord) => {
    setAnswers(prev => {
      const next = [...prev, record];
      storage.set('answers', next);
      return next;
    });
  }, []);

  // Single-pass stats map — avoids repeated filtering per chapter
  const statsMap = useMemo(() => {
    const map = new Map<string, { total: number; correct: number }>();
    for (const a of answers) {
      const entry = map.get(a.chapterId) ?? { total: 0, correct: 0 };
      entry.total++;
      if (a.correct) entry.correct++;
      map.set(a.chapterId, entry);
    }
    return map;
  }, [answers]);

  const getChapterStats = useCallback(
    (chapterId: string): ChapterStats => {
      const entry = statsMap.get(chapterId) ?? { total: 0, correct: 0 };
      return {
        chapterId,
        total: entry.total,
        correct: entry.correct,
        accuracy: calcAccuracy(entry.correct, entry.total),
      };
    },
    [statsMap]
  );

  const { totalAnswered, totalCorrect, overallAccuracy } = useMemo(() => {
    const total = answers.length;
    const correct = answers.filter(a => a.correct).length;
    return { totalAnswered: total, totalCorrect: correct, overallAccuracy: calcAccuracy(correct, total) };
  }, [answers]);

  const dailyStreak = useMemo((): number => {
    if (answers.length === 0) return 0;
    const daySet = new Set(
      answers.map(a => new Date(a.answeredAt).toDateString())
    );
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (daySet.has(d.toDateString())) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [answers]);

  const getWeakChapters = useCallback(
    (chapterIds: string[]): string[] => {
      return chapterIds.filter(id => {
        const stats = getChapterStats(id);
        return stats.total >= WEAK_MIN_ANSWERS && stats.accuracy < WEAK_ACCURACY_THRESHOLD;
      });
    },
    [getChapterStats]
  );

  const todayCount = useMemo((): number => {
    const todayStr = new Date().toDateString();
    return answers.filter(a => new Date(a.answeredAt).toDateString() === todayStr).length;
  }, [answers]);

  return {
    answers, recordAnswer, getChapterStats,
    totalAnswered, totalCorrect, overallAccuracy,
    dailyStreak, getWeakChapters, todayCount,
  };
}
