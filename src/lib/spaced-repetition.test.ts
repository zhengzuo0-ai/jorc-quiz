import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculateNextReview, isDueForReview } from './spaced-repetition';
import type { ErrorEntry } from '../types';

function makeEntry(overrides: Partial<ErrorEntry> = {}): ErrorEntry {
  return {
    questionId: 'test-001', chapterId: 'test-ch', wrongCount: 1,
    lastWrong: Date.now(), nextReview: Date.now(), intervalDays: 1,
    easeFactor: 2.5, mastered: false, ...overrides,
  };
}

describe('calculateNextReview', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2026-03-26T00:00:00Z')); });
  afterEach(() => vi.useRealTimers());

  it('on correct with intervalDays=1, advances to 2', () => {
    const r = calculateNextReview(makeEntry({ intervalDays: 1 }), true);
    expect(r.intervalDays).toBe(2);
    expect(r.easeFactor).toBe(2.6);
  });

  it('on correct with intervalDays=2, sets interval to 6', () => {
    expect(calculateNextReview(makeEntry({ intervalDays: 2 }), true).intervalDays).toBe(6);
  });

  it('on correct with intervalDays>2, multiplies by easeFactor', () => {
    expect(calculateNextReview(makeEntry({ intervalDays: 6, easeFactor: 2.5 }), true).intervalDays).toBe(15);
  });

  it('marks mastered when wrongCount<=1 and interval>=21', () => {
    const r = calculateNextReview(makeEntry({ intervalDays: 10, easeFactor: 2.5, wrongCount: 1 }), true);
    expect(r.mastered).toBe(true);
  });

  it('on wrong, resets interval to 1', () => {
    const r = calculateNextReview(makeEntry({ intervalDays: 6 }), false);
    expect(r.intervalDays).toBe(1);
  });

  it('on wrong, ease factor floors at 1.3', () => {
    expect(calculateNextReview(makeEntry({ easeFactor: 1.3 }), false).easeFactor).toBe(1.3);
  });
});

describe('isDueForReview', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2026-03-26T12:00:00Z')); });
  afterEach(() => vi.useRealTimers());

  it('returns true when overdue and not mastered', () => {
    expect(isDueForReview(makeEntry({ nextReview: Date.now() - 1000, mastered: false }))).toBe(true);
  });
  it('returns false when mastered', () => {
    expect(isDueForReview(makeEntry({ nextReview: Date.now() - 1000, mastered: true }))).toBe(false);
  });
  it('returns false when not yet due', () => {
    expect(isDueForReview(makeEntry({ nextReview: Date.now() + 86400000, mastered: false }))).toBe(false);
  });
});
