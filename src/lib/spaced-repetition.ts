import type { ErrorEntry } from '../types';

export function calculateNextReview(entry: ErrorEntry, wasCorrect: boolean): ErrorEntry {
  if (wasCorrect) {
    const newInterval = entry.intervalDays <= 1 ? 2
      : entry.intervalDays <= 2 ? 6
      : Math.round(entry.intervalDays * entry.easeFactor);
    const newEase = Math.max(1.3, entry.easeFactor + 0.1);
    return {
      ...entry,
      intervalDays: newInterval,
      easeFactor: newEase,
      nextReview: Date.now() + newInterval * 86400000,
      mastered: entry.wrongCount <= 1 && newInterval >= 21,
    };
  } else {
    return {
      ...entry,
      intervalDays: 1,
      easeFactor: Math.max(1.3, entry.easeFactor - 0.2),
      wrongCount: entry.wrongCount + 1,
      lastWrong: Date.now(),
      nextReview: Date.now() + 86400000,
      mastered: false,
    };
  }
}

export function isDueForReview(entry: ErrorEntry): boolean {
  return !entry.mastered && entry.nextReview <= Date.now();
}
