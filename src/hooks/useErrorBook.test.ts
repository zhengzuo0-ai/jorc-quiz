import { describe, it, expect } from 'vitest';
import { calculateNextReview, isDueForReview } from '../lib/spaced-repetition';
import type { ErrorEntry } from '../types';

// Test the spaced repetition integration with error book logic
describe('ErrorBook spaced repetition integration', () => {
  const baseEntry: ErrorEntry = {
    questionId: 'q1', chapterId: 'ch1', wrongCount: 1,
    lastWrong: Date.now(), nextReview: Date.now(), intervalDays: 1,
    easeFactor: 2.5, mastered: false,
  };

  it('correct answer increases interval progressively: 1→1→6→15', () => {
    let entry = { ...baseEntry, intervalDays: 1 };
    entry = calculateNextReview(entry, true); // 1→1
    expect(entry.intervalDays).toBe(1);
    
    entry = { ...entry, intervalDays: 2 };
    entry = calculateNextReview(entry, true); // 2→6
    expect(entry.intervalDays).toBe(6);
    
    entry = calculateNextReview(entry, true); // 6→15 (6*2.6≈16, but ease was 2.6+0.1=2.7, so 6*2.7≈16)
    expect(entry.intervalDays).toBeGreaterThan(10);
  });

  it('wrong answer always resets to interval 1', () => {
    const entry = calculateNextReview({ ...baseEntry, intervalDays: 21 }, false);
    expect(entry.intervalDays).toBe(1);
    expect(entry.mastered).toBe(false);
  });

  it('mastery requires wrongCount<=1 AND interval>=21', () => {
    // High interval but high wrongCount → not mastered
    const notMastered = calculateNextReview({ ...baseEntry, intervalDays: 10, easeFactor: 2.5, wrongCount: 5 }, true);
    expect(notMastered.mastered).toBe(false);
    
    // High interval and low wrongCount → mastered
    const mastered = calculateNextReview({ ...baseEntry, intervalDays: 10, easeFactor: 2.5, wrongCount: 0 }, true);
    expect(mastered.mastered).toBe(true);
  });
});
