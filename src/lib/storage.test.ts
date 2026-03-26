import { describe, it, expect, beforeEach } from 'vitest';

// Mock localStorage
const mockStorage = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => mockStorage.get(key) ?? null,
  setItem: (key: string, value: string) => mockStorage.set(key, value),
  removeItem: (key: string) => mockStorage.delete(key),
  clear: () => mockStorage.clear(),
  length: 0,
  key: () => null,
};
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Now import after mock
const { storage } = await import('./storage');

describe('storage', () => {
  beforeEach(() => mockStorage.clear());

  it('returns fallback when key does not exist', () => {
    expect(storage.get('nonexistent', 42)).toBe(42);
  });

  it('stores and retrieves a value', () => {
    storage.set('test', { hello: 'world' });
    expect(storage.get('test', null)).toEqual({ hello: 'world' });
  });

  it('uses jorc_quiz_ prefix', () => {
    storage.set('key', 'value');
    expect(mockStorage.get('jorc_quiz_key')).toBe('"value"');
  });

  it('removes a value', () => {
    storage.set('key', 'value');
    storage.remove('key');
    expect(storage.get('key', 'default')).toBe('default');
  });

  it('stores arrays', () => {
    storage.set('arr', [1, 2, 3]);
    expect(storage.get('arr', [])).toEqual([1, 2, 3]);
  });
});
