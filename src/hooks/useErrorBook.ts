import { useState, useCallback, useMemo } from 'react';
import type { ErrorEntry } from '../types';
import { storage } from '../lib/storage';
import { calculateNextReview, isDueForReview } from '../lib/spaced-repetition';

export function useErrorBook() {
  const [entries, setEntries] = useState<ErrorEntry[]>(() =>
    storage.get<ErrorEntry[]>('errorBook', [])
  );

  const addError = useCallback((questionId: string, chapterId: string) => {
    setEntries(prev => {
      const existing = prev.find(e => e.questionId === questionId);
      let next: ErrorEntry[];
      if (existing) {
        next = prev.map(e =>
          e.questionId === questionId
            ? {
                ...e,
                wrongCount: e.wrongCount + 1,
                lastWrong: Date.now(),
                nextReview: Date.now() + 86400000,
                intervalDays: 1,
                mastered: false,
              }
            : e
        );
      } else {
        const entry: ErrorEntry = {
          questionId,
          chapterId,
          wrongCount: 1,
          lastWrong: Date.now(),
          nextReview: Date.now() + 86400000,
          intervalDays: 1,
          easeFactor: 2.5,
          mastered: false,
        };
        next = [...prev, entry];
      }
      storage.set('errorBook', next);
      return next;
    });
  }, []);

  const reviewAnswer = useCallback((questionId: string, wasCorrect: boolean) => {
    setEntries(prev => {
      const next = prev.map(e =>
        e.questionId === questionId ? calculateNextReview(e, wasCorrect) : e
      );
      storage.set('errorBook', next);
      return next;
    });
  }, []);

  const dueEntries = useMemo(() => entries.filter(isDueForReview), [entries]);
  const activeEntries = useMemo(() => entries.filter(e => !e.mastered), [entries]);

  return { entries, activeEntries, dueEntries, addError, reviewAnswer };
}
