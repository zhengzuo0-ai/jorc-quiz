import { describe, it, expect } from 'vitest';
import { chapters, jorcChapters, goldChapters } from './chapters';

describe('chapters data', () => {
  it('has at least 30 chapters', () => {
    expect(chapters.length).toBeGreaterThanOrEqual(30);
  });

  it('all chapters have required fields', () => {
    for (const ch of chapters) {
      expect(ch.id).toBeTruthy();
      expect(ch.domain).toMatch(/^(jorc|gold)$/);
      expect(ch.name).toBeTruthy();
      expect(ch.nameEn).toBeTruthy();
      expect(ch.questionCount).toBeGreaterThanOrEqual(0);
    }
  });

  it('jorc chapters are correctly filtered', () => {
    expect(jorcChapters.length).toBe(12);
    expect(jorcChapters.every(c => c.domain === 'jorc')).toBe(true);
  });

  it('gold chapters are correctly filtered', () => {
    expect(goldChapters.length).toBeGreaterThanOrEqual(13);
    expect(goldChapters.every(c => c.domain === 'gold')).toBe(true);
  });

  it('all chapter ids are unique', () => {
    const ids = chapters.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('questionCount is positive for main chapters', () => {
    const mainChapters = chapters.filter(c => c.id.match(/^(jorc|gold)-\d+$/));
    for (const ch of mainChapters) {
      expect(ch.questionCount).toBeGreaterThan(0);
    }
  });
});

import * as fs from 'fs';
import * as path from 'path';

describe('concept files', () => {
  const conceptDir = path.join(__dirname, '../../public/concepts');

  it('glossary.md exists', () => {
    expect(fs.existsSync(path.join(conceptDir, 'glossary.md'))).toBe(true);
  });

  it('learning-path.md exists', () => {
    expect(fs.existsSync(path.join(conceptDir, 'learning-path.md'))).toBe(true);
  });

  it('all main chapters have concept files', () => {
    for (const ch of chapters) {
      const file = path.join(conceptDir, `${ch.id}.md`);
      expect(fs.existsSync(file), `Missing concept file: ${ch.id}.md`).toBe(true);
    }
  });
});
