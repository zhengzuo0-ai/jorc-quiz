import { describe, it, expect, beforeEach } from 'vitest';

const mockStorage = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => mockStorage.get(key) ?? null,
  setItem: (key: string, value: string) => mockStorage.set(key, value),
  removeItem: (key: string) => mockStorage.delete(key),
  clear: () => mockStorage.clear(), length: 0, key: () => null,
};
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

const { storage } = await import('./storage');

describe('storage', () => {
  beforeEach(() => mockStorage.clear());
  it('returns fallback when key missing', () => expect(storage.get('x', 42)).toBe(42));
  it('stores and retrieves value', () => { storage.set('t', { a: 1 }); expect(storage.get('t', null)).toEqual({ a: 1 }); });
  it('uses jorc_quiz_ prefix', () => { storage.set('k', 'v'); expect(mockStorage.get('jorc_quiz_k')).toBe('"v"'); });
  it('removes value', () => { storage.set('k', 'v'); storage.remove('k'); expect(storage.get('k', 'd')).toBe('d'); });
});
