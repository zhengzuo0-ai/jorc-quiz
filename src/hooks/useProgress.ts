import { useState, useCallback } from 'react';
import type { AnswerRecord, ChapterStats } from '../types';
import { storage } from '../lib/storage';

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

  const getChapterStats = useCallback(
    (chapterId: string): ChapterStats => {
      const chapterAnswers = answers.filter(a => a.chapterId === chapterId);
      const correct = chapterAnswers.filter(a => a.correct).length;
      const total = chapterAnswers.length;
      return {
        chapterId,
        total,
        correct,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      };
    },
    [answers]
  );

  const totalAnswered = answers.length;
  const totalCorrect = answers.filter(a => a.correct).length;
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Daily streak: count consecutive days with at least 1 answer
  const getDailyStreak = useCallback((): number => {
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

  // Weak chapters: chapters with >5 answers and <60% accuracy
  const getWeakChapters = useCallback(
    (chapterIds: string[]): string[] => {
      return chapterIds.filter(id => {
        const stats = getChapterStats(id);
        return stats.total >= 5 && stats.accuracy < 60;
      });
    },
    [getChapterStats]
  );

  // Today's progress
  const getTodayCount = useCallback((): number => {
    const todayStr = new Date().toDateString();
    return answers.filter(a => new Date(a.answeredAt).toDateString() === todayStr).length;
  }, [answers]);

  return {
    answers, recordAnswer, getChapterStats,
    totalAnswered, totalCorrect, overallAccuracy,
    getDailyStreak, getWeakChapters, getTodayCount,
  };
}
