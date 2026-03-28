import { describe, it, expect } from 'vitest';
import { calcAccuracy } from './calcAccuracy';

describe('calcAccuracy', () => {
  it('returns 0 when total is 0', () => expect(calcAccuracy(0, 0)).toBe(0));
  it('returns 100 when all correct', () => expect(calcAccuracy(10, 10)).toBe(100));
  it('returns 0 when none correct', () => expect(calcAccuracy(0, 10)).toBe(0));
  it('rounds correctly', () => { expect(calcAccuracy(1, 3)).toBe(33); expect(calcAccuracy(2, 3)).toBe(67); });
  it('handles typical quiz', () => { expect(calcAccuracy(20, 28)).toBe(71); expect(calcAccuracy(25, 28)).toBe(89); });
});
