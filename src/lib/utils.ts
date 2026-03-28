// Utility functions for FeatureGate

/**
 * Format a date string to a human-readable relative time
 */
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`;
  return `${Math.floor(seconds / 31536000)}y ago`;
}

/**
 * Format a date string to a standard display format
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calculate the age of a flag in days
 */
export function flagAgeDays(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Format a number with commas
 */
export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

/**
 * Calculate sample size for A/B test
 * Uses the formula: n = (Z_alpha/2 + Z_beta)^2 * (p1(1-p1) + p2(1-p2)) / (p2-p1)^2
 */
export function calculateSampleSize(
  baselineRate: number,
  mde: number,
  significanceLevel: number,
  power: number,
): number {
  const p1 = baselineRate / 100;
  const p2 = p1 + mde / 100;

  const zAlpha = getZScore(1 - significanceLevel / 2);
  const zBeta = getZScore(power);

  const n = Math.ceil(
    (Math.pow(zAlpha + zBeta, 2) * (p1 * (1 - p1) + p2 * (1 - p2))) /
    Math.pow(p2 - p1, 2),
  );

  return n * 2; // Two variants
}

/**
 * Z-score lookup (approximate inverse normal CDF)
 */
function getZScore(p: number): number {
  // Rational approximation for the inverse normal CDF
  if (p <= 0 || p >= 1) return 0;
  if (p < 0.5) return -getZScore(1 - p);

  const t = Math.sqrt(-2 * Math.log(1 - p));
  const c0 = 2.515517;
  const c1 = 0.802853;
  const c2 = 0.010328;
  const d1 = 1.432788;
  const d2 = 0.189269;
  const d3 = 0.001308;

  return t - (c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t);
}

/**
 * Calculate statistical significance (p-value) from two proportions
 */
export function calculatePValue(
  conversionsA: number,
  impressionsA: number,
  conversionsB: number,
  impressionsB: number,
): number {
  const pA = conversionsA / impressionsA;
  const pB = conversionsB / impressionsB;
  const pPooled = (conversionsA + conversionsB) / (impressionsA + impressionsB);
  const se = Math.sqrt(pPooled * (1 - pPooled) * (1 / impressionsA + 1 / impressionsB));

  if (se === 0) return 1;

  const z = Math.abs(pB - pA) / se;

  // Two-tailed p-value approximation
  return 2 * (1 - normalCDF(z));
}

function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989422804014327;
  const p =
    d *
    Math.exp((-x * x) / 2) *
    (0.3193815 * t +
      -0.3565638 * t * t +
      1.781478 * t * t * t +
      -1.8212560 * t * t * t * t +
      1.3302744 * t * t * t * t * t);
  return x > 0 ? 1 - p : p;
}

/**
 * Get cleanup suggestion for a flag based on its state
 */
export function getCleanupSuggestion(
  status: string,
  rolloutPercentage: number,
  lastEvaluatedAt: string | null,
  evaluationCount: number,
): string | null {
  if (status === 'archived') return null;
  if (status === 'deprecated') return 'Ready for archival. Remove code references and archive.';
  if (status === 'stale') {
    if (rolloutPercentage === 100 && evaluationCount > 100000) {
      return 'Fully rolled out and stale. Safe to remove -- make the code permanent.';
    }
    return 'Not evaluated recently. Review if still needed or archive.';
  }
  if (rolloutPercentage === 100 && status === 'active') {
    const daysSinceEval = lastEvaluatedAt ? flagAgeDays(lastEvaluatedAt) : 999;
    if (daysSinceEval < 7) return null; // Recently active at 100%, keep it
    return 'At 100% rollout. Consider making permanent and removing flag.';
  }
  return null;
}
