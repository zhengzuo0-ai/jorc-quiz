import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculateNextReview, isDueForReview } from './spaced-repetition';
import type { ErrorEntry } from '../types';

function makeEntry(overrides: Partial<ErrorEntry> = {}): ErrorEntry {
  return {
    questionId: 'test-001',
    chapterId: 'test-ch',
    wrongCount: 1,
    lastWrong: Date.now(),
    nextReview: Date.now(),
    intervalDays: 1,
    easeFactor: 2.5,
    mastered: false,
    ...overrides,
  };
}

describe('calculateNextReview', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-26T00:00:00Z'));
  });
  afterEach(() => vi.useRealTimers());

  it('on correct answer with intervalDays=1, keeps interval at 1', () => {
    const entry = makeEntry({ intervalDays: 1 });
    const result = calculateNextReview(entry, true);
    expect(result.intervalDays).toBe(1);
    expect(result.easeFactor).toBe(2.6);
  });

  it('on correct answer with intervalDays=2, sets interval to 6', () => {
    const entry = makeEntry({ intervalDays: 2 });
    const result = calculateNextReview(entry, true);
    expect(result.intervalDays).toBe(6);
  });

  it('on correct answer with intervalDays>2, multiplies by easeFactor', () => {
    const entry = makeEntry({ intervalDays: 6, easeFactor: 2.5 });
    const result = calculateNextReview(entry, true);
    expect(result.intervalDays).toBe(15); // round(6 * 2.5) = 15
  });

  it('increases ease factor on correct', () => {
    const entry = makeEntry({ easeFactor: 2.5 });
    const result = calculateNextReview(entry, true);
    expect(result.easeFactor).toBeCloseTo(2.6);
  });

  it('sets nextReview correctly on correct', () => {
    const entry = makeEntry({ intervalDays: 2 });
    const result = calculateNextReview(entry, true);
    const expectedNext = Date.now() + 6 * 86400000;
    expect(result.nextReview).toBe(expectedNext);
  });

  it('marks mastered when wrongCount<=1 and interval>=21', () => {
    const entry = makeEntry({ intervalDays: 10, easeFactor: 2.5, wrongCount: 1 });
    const result = calculateNextReview(entry, true);
    // interval = round(10 * 2.5) = 25 >= 21, wrongCount = 1 <= 1
    expect(result.mastered).toBe(true);
    expect(result.intervalDays).toBe(25);
  });

  it('does not mark mastered when wrongCount>1', () => {
    const entry = makeEntry({ intervalDays: 10, easeFactor: 2.5, wrongCount: 3 });
    const result = calculateNextReview(entry, true);
    expect(result.mastered).toBe(false);
  });

  it('on wrong answer, resets interval to 1', () => {
    const entry = makeEntry({ intervalDays: 6 });
    const result = calculateNextReview(entry, false);
    expect(result.intervalDays).toBe(1);
    expect(result.nextReview).toBe(Date.now() + 86400000);
  });

  it('on wrong answer, decreases ease factor', () => {
    const entry = makeEntry({ easeFactor: 2.5 });
    const result = calculateNextReview(entry, false);
    expect(result.easeFactor).toBeCloseTo(2.3);
  });

  it('on wrong answer, ease factor floors at 1.3', () => {
    const entry = makeEntry({ easeFactor: 1.3 });
    const result = calculateNextReview(entry, false);
    expect(result.easeFactor).toBe(1.3);
  });

  it('on wrong answer, increments wrongCount', () => {
    const entry = makeEntry({ wrongCount: 2 });
    const result = calculateNextReview(entry, false);
    expect(result.wrongCount).toBe(3);
  });

  it('on wrong answer, sets mastered to false', () => {
    const entry = makeEntry({ mastered: true });
    const result = calculateNextReview(entry, false);
    expect(result.mastered).toBe(false);
  });
});

describe('isDueForReview', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-26T12:00:00Z'));
  });
  afterEach(() => vi.useRealTimers());

  it('returns true when nextReview is in the past and not mastered', () => {
    const entry = makeEntry({ nextReview: Date.now() - 1000, mastered: false });
    expect(isDueForReview(entry)).toBe(true);
  });

  it('returns true when nextReview equals now', () => {
    const entry = makeEntry({ nextReview: Date.now(), mastered: false });
    expect(isDueForReview(entry)).toBe(true);
  });

  it('returns false when nextReview is in the future', () => {
    const entry = makeEntry({ nextReview: Date.now() + 86400000, mastered: false });
    expect(isDueForReview(entry)).toBe(false);
  });

  it('returns false when mastered', () => {
    const entry = makeEntry({ nextReview: Date.now() - 1000, mastered: true });
    expect(isDueForReview(entry)).toBe(false);
  });
});
