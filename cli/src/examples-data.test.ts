import { describe, it, expect } from 'vitest';
import { EXAMPLES, findExample } from './examples-data.js';

describe('EXAMPLES', () => {
  it('has exactly 5 entries', () => {
    expect(EXAMPLES).toHaveLength(5);
  });
  it('each entry has required fields', () => {
    for (const ex of EXAMPLES) {
      expect(ex.slug).toBeTruthy();
      expect(ex.tier).toMatch(/^Tier-(A|Mid|Exec)$/);
      expect(ex.url).toMatch(/^https:\/\//);
      expect(ex.scores.judgment).toBeGreaterThanOrEqual(1);
      expect(ex.scores.judgment).toBeLessThanOrEqual(5);
    }
  });
  it('contains expected slugs', () => {
    const slugs = EXAMPLES.map(e => e.slug);
    expect(slugs).toContain('eslint');
    expect(slugs).toContain('auth');
    expect(slugs).toContain('borderline');
  });
});

describe('findExample()', () => {
  it('finds by exact slug', () => {
    expect(findExample('eslint')?.slug).toBe('eslint');
  });
  it('finds by partial slug', () => {
    expect(findExample('auth')?.slug).toBe('auth');
  });
  it('finds by title keyword (case insensitive)', () => {
    expect(findExample('CQRS')?.slug).toBe('refactor');
  });
  it('returns null for unknown query', () => {
    expect(findExample('nonexistent-xyz')).toBeNull();
  });
});
