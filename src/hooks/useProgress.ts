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

  return { answers, recordAnswer, getChapterStats, totalAnswered, totalCorrect, overallAccuracy };
}
