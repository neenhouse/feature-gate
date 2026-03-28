import { useState } from 'react';
import { useStore } from '../lib/store';
import { formatNumber, calculateSampleSize, calculatePValue } from '../lib/utils';
import '../components/ui/shared.css';
import './ExperimentsPage.css';

export default function ExperimentsPage() {
  const { experiments, flags } = useStore();

  // Sample size calculator state
  const [calcBaseline, setCalcBaseline] = useState(10);
  const [calcMDE, setCalcMDE] = useState(2);
  const [calcSignificance, setCalcSignificance] = useState(0.05);
  const [calcPower, setCalcPower] = useState(0.8);

  const requiredSample = calculateSampleSize(calcBaseline, calcMDE, calcSignificance, calcPower);

  return (
    <div className="experiments-page">
      <div className="page-header">
        <h1>A/B Testing</h1>
        <p>Run experiments with statistical rigor</p>
      </div>

      {/* Active Experiments */}
      <div className="experiments-list">
        {experiments.map((exp) => {
          const flag = flags.find((f) => f.id === exp.flagId);
          const progress = Math.min(100, Math.round((exp.currentSampleSize / exp.requiredSampleSize) * 100));
          const pValue = exp.variants.length >= 2
            ? calculatePValue(
                exp.variants[0].conversions,
                exp.variants[0].impressions,
                exp.variants[1].conversions,
                exp.variants[1].impressions,
              )
            : 1;
          const isSignificant = pValue < exp.significanceLevel;
          const confidenceLevel = ((1 - pValue) * 100).toFixed(1);

          // Find the winning variant
          const sorted = [...exp.variants].sort((a, b) => b.conversionRate - a.conversionRate);
          const winner = sorted[0];
          const lift = exp.variants.length >= 2
            ? ((exp.variants[1].conversionRate - exp.variants[0].conversionRate) / exp.variants[0].conversionRate * 100).toFixed(1)
            : '0';

          return (
            <div key={exp.id} className="card experiment-card">
              <div className="exp-header">
                <div>
                  <h3>{exp.name}</h3>
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                    Flag: {flag?.key || exp.flagId} | Metric: {exp.primaryMetric}
                  </span>
                </div>
                <span className={`badge badge--${exp.status}`}>{exp.status}</span>
              </div>

              {/* Variants comparison */}
              <div className="variants-grid">
                {exp.variants.map((v) => (
                  <div key={v.id} className={`variant-card ${winner.id === v.id && isSignificant ? 'variant-card--winner' : ''}`}>
                    <div className="variant-header">
                      <span className="variant-name">{v.name}</span>
                      {winner.id === v.id && isSignificant && (
                        <span className="winner-badge">Winner</span>
                      )}
                    </div>
                    <div className="variant-rate">{v.conversionRate.toFixed(2)}%</div>
                    <div className="variant-desc">{v.description}</div>
                    <div className="variant-stats">
                      <span>{formatNumber(v.conversions)} / {formatNumber(v.impressions)}</span>
                      <span>{v.allocation}% allocation</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="exp-stats-row">
                <div className="exp-stat">
                  <span className="exp-stat-label">P-Value</span>
                  <span className={`exp-stat-value ${isSignificant ? 'significant' : ''}`}>
                    {pValue.toFixed(4)}
                  </span>
                </div>
                <div className="exp-stat">
                  <span className="exp-stat-label">Confidence</span>
                  <span className={`exp-stat-value ${isSignificant ? 'significant' : ''}`}>
                    {confidenceLevel}%
                  </span>
                </div>
                <div className="exp-stat">
                  <span className="exp-stat-label">Lift</span>
                  <span className="exp-stat-value">
                    {Number(lift) > 0 ? '+' : ''}{lift}%
                  </span>
                </div>
                <div className="exp-stat">
                  <span className="exp-stat-label">Sample Progress</span>
                  <span className="exp-stat-value">
                    {formatNumber(exp.currentSampleSize)} / {formatNumber(exp.requiredSampleSize)}
                  </span>
                </div>
              </div>

              {/* Significance meter */}
              <div className="significance-meter">
                <div className="significance-bar">
                  <div
                    className={`significance-fill ${isSignificant ? 'significance-fill--pass' : ''}`}
                    style={{ width: `${Math.min(100, Number(confidenceLevel))}%` }}
                  />
                  <div className="significance-threshold" style={{ left: `${(1 - calcSignificance) * 100}%` }}>
                    <span>95%</span>
                  </div>
                </div>
                <div className="significance-label">
                  {isSignificant
                    ? 'Statistically significant -- results are reliable'
                    : `Not yet significant. ${formatNumber(exp.requiredSampleSize - exp.currentSampleSize)} more samples needed.`
                  }
                </div>
              </div>

              {/* Sample progress bar */}
              <div style={{ marginTop: 'var(--fg-space-sm)' }}>
                <div className="progress-bar">
                  <div
                    className={`progress-bar-fill ${progress >= 100 ? 'progress-bar-fill--success' : 'progress-bar-fill--accent'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="progress-label">{progress}% of required sample collected</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sample Size Calculator */}
      <div className="card calculator-card">
        <h3>Sample Size Calculator</h3>
        <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: 'var(--fg-space-md)' }}>
          Calculate the required sample size for your next experiment
        </p>

        <div className="calc-grid">
          <div className="form-group">
            <label>Baseline Conversion Rate (%)</label>
            <input
              type="number"
              className="form-input"
              value={calcBaseline}
              onChange={(e) => setCalcBaseline(Number(e.target.value))}
              min="0.1"
              max="99"
              step="0.1"
            />
          </div>
          <div className="form-group">
            <label>Minimum Detectable Effect (%)</label>
            <input
              type="number"
              className="form-input"
              value={calcMDE}
              onChange={(e) => setCalcMDE(Number(e.target.value))}
              min="0.1"
              max="50"
              step="0.1"
            />
          </div>
          <div className="form-group">
            <label>Significance Level (alpha)</label>
            <select
              className="form-select"
              value={calcSignificance}
              onChange={(e) => setCalcSignificance(Number(e.target.value))}
            >
              <option value={0.01}>0.01 (99% confidence)</option>
              <option value={0.05}>0.05 (95% confidence)</option>
              <option value={0.1}>0.10 (90% confidence)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Statistical Power</label>
            <select
              className="form-select"
              value={calcPower}
              onChange={(e) => setCalcPower(Number(e.target.value))}
            >
              <option value={0.8}>0.80 (80%)</option>
              <option value={0.9}>0.90 (90%)</option>
              <option value={0.95}>0.95 (95%)</option>
            </select>
          </div>
        </div>

        <div className="calc-result">
          <div className="calc-result-value">{formatNumber(requiredSample)}</div>
          <div className="calc-result-label">
            total samples needed ({formatNumber(Math.ceil(requiredSample / 2))} per variant)
          </div>
        </div>
      </div>
    </div>
  );
}
