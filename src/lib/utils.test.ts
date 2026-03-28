import { describe, it, expect } from 'vitest';
import { calculateSampleSize, calculatePValue, formatNumber, getCleanupSuggestion } from './utils';

describe('calculateSampleSize', () => {
  it('computes reasonable sample size for typical A/B test', () => {
    // 10% baseline, 2% MDE, 95% confidence, 80% power
    const n = calculateSampleSize(10, 2, 0.05, 0.8);
    // Should return a positive number (total for both variants)
    expect(n).toBeGreaterThan(1000);
    expect(n).toBeLessThan(100000);
  });

  it('requires more samples for smaller MDE', () => {
    const nSmallMDE = calculateSampleSize(10, 1, 0.05, 0.8);
    const nLargeMDE = calculateSampleSize(10, 5, 0.05, 0.8);
    expect(nSmallMDE).toBeGreaterThan(nLargeMDE);
  });
});

describe('calculatePValue', () => {
  it('returns low p-value for clearly different proportions', () => {
    // 10% vs 15% with large samples -- should be significant
    const p = calculatePValue(1000, 10000, 1500, 10000);
    expect(p).toBeLessThan(0.05);
  });

  it('returns high p-value for similar proportions', () => {
    // 10% vs 10.1% with small samples -- should not be significant
    const p = calculatePValue(10, 100, 11, 100);
    expect(p).toBeGreaterThan(0.05);
  });
});

describe('formatNumber', () => {
  it('formats numbers with commas', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('handles small numbers', () => {
    expect(formatNumber(42)).toBe('42');
  });
});

describe('getCleanupSuggestion', () => {
  it('returns null for archived flags', () => {
    expect(getCleanupSuggestion('archived', 0, null, 0)).toBeNull();
  });

  it('returns suggestion for deprecated flags', () => {
    const suggestion = getCleanupSuggestion('deprecated', 0, null, 0);
    expect(suggestion).toContain('archival');
  });

  it('returns suggestion for stale flags at 100% rollout', () => {
    const suggestion = getCleanupSuggestion('stale', 100, '2025-01-01', 500000);
    expect(suggestion).toContain('Fully rolled out');
  });
});
