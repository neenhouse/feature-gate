import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../lib/store';
import { formatNumber, formatDate, timeAgo } from '../lib/utils';
import { estimateAffectedUsers } from '../lib/mock-data';
import type { Environment } from '../lib/types';
import '../components/ui/shared.css';
import './FlagDetailPage.css';

const envs: Environment[] = ['development', 'staging', 'production'];

export default function FlagDetailPage() {
  const { flagId } = useParams<{ flagId: string }>();
  const { flags, updateFlag, auditLog, addAuditEntry } = useStore();
  const flag = flags.find((f) => f.id === flagId);

  const [selectedEnv, setSelectedEnv] = useState<Environment>('production');

  if (!flag) {
    return (
      <div className="empty-state">
        <h3>Flag not found</h3>
        <Link to="/dashboard">Back to dashboard</Link>
      </div>
    );
  }

  const envConfig = flag.environments[selectedEnv];
  const affectedUsers = estimateAffectedUsers(envConfig.rolloutPercentage);
  const flagAudit = auditLog.filter((e) => e.resourceId === flag.id).slice(0, 5);

  const handleRolloutChange = (pct: number) => {
    const oldPct = flag.environments[selectedEnv].rolloutPercentage;
    updateFlag(flag.id, {
      environments: {
        ...flag.environments,
        [selectedEnv]: { ...flag.environments[selectedEnv], rolloutPercentage: pct },
      },
    });
    addAuditEntry({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: { id: 'u0', email: 'you@company.com', name: 'You' },
      action: 'rollout_changed',
      resourceType: 'flag',
      resourceId: flag.id,
      resourceName: flag.name,
      description: `Changed ${selectedEnv} rollout from ${oldPct}% to ${pct}%`,
      before: `${oldPct}%`,
      after: `${pct}%`,
      ipAddress: '127.0.0.1',
    });
  };

  const handleToggle = () => {
    const newEnabled = !flag.environments[selectedEnv].enabled;
    updateFlag(flag.id, {
      environments: {
        ...flag.environments,
        [selectedEnv]: { ...flag.environments[selectedEnv], enabled: newEnabled },
      },
    });
    addAuditEntry({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: { id: 'u0', email: 'you@company.com', name: 'You' },
      action: newEnabled ? 'enabled' : 'disabled',
      resourceType: 'flag',
      resourceId: flag.id,
      resourceName: flag.name,
      description: `${newEnabled ? 'Enabled' : 'Disabled'} flag in ${selectedEnv}`,
      before: newEnabled ? 'disabled' : 'enabled',
      after: newEnabled ? 'enabled' : 'disabled',
      ipAddress: '127.0.0.1',
    });
  };

  return (
    <div className="flag-detail">
      <div className="detail-breadcrumb">
        <Link to="/dashboard">Flags</Link>
        <span>/</span>
        <span>{flag.name}</span>
      </div>

      <div className="detail-header">
        <div>
          <h1>{flag.name}</h1>
          <code className="flag-key">{flag.key}</code>
          <p className="detail-desc">{flag.description}</p>
          <div className="flag-tags" style={{ marginTop: '8px' }}>
            {flag.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
        </div>
        <div className="detail-meta">
          <span className={`badge badge--${flag.status}`}>{flag.status}</span>
          <span className="meta-item">Owner: {flag.owner}</span>
          <span className="meta-item">Type: {flag.type}</span>
        </div>
      </div>

      {/* Environment selector */}
      <div className="tabs" style={{ marginTop: 'var(--fg-space-lg)' }}>
        {envs.map((env) => (
          <button
            key={env}
            className={`tab ${selectedEnv === env ? 'tab--active' : ''}`}
            onClick={() => setSelectedEnv(env)}
          >
            {env}
          </button>
        ))}
      </div>

      <div className="detail-grid">
        {/* Rollout Control (Feature 3) */}
        <div className="card rollout-card">
          <div className="card-header">
            <h3>Gradual Rollout</h3>
            <button
              type="button"
              className={`toggle ${envConfig.enabled ? 'toggle--on' : ''}`}
              onClick={handleToggle}
              aria-label="Toggle flag"
            >
              <span className="toggle-knob" />
            </button>
          </div>

          <div className="rollout-slider-area">
            <div className="rollout-value">
              <span className="rollout-pct">{envConfig.rolloutPercentage}%</span>
              <span className="rollout-users">
                {formatNumber(affectedUsers)} users affected
              </span>
            </div>
            <input
              type="range"
              className="range-slider"
              min="0"
              max="100"
              value={envConfig.rolloutPercentage}
              onChange={(e) => handleRolloutChange(Number(e.target.value))}
              disabled={!envConfig.enabled}
            />
            <div className="rollout-labels">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="rollout-presets">
            {[0, 10, 25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                className="btn-sm btn-ghost"
                onClick={() => handleRolloutChange(pct)}
                disabled={!envConfig.enabled}
              >
                {pct}%
              </button>
            ))}
          </div>

          {/* Environment status overview */}
          <div className="env-overview">
            <h4>All Environments</h4>
            {envs.map((env) => (
              <div key={env} className="env-row">
                <span
                  className="env-dot"
                  style={{
                    background: flag.environments[env].enabled
                      ? 'var(--fg-success)'
                      : 'var(--fg-danger)',
                  }}
                />
                <span className="env-name">{env}</span>
                <div className="progress-bar" style={{ flex: 1 }}>
                  <div
                    className={`progress-bar-fill ${flag.environments[env].enabled ? 'progress-bar-fill--accent' : 'progress-bar-fill--danger'}`}
                    style={{ width: `${flag.environments[env].rolloutPercentage}%` }}
                  />
                </div>
                <span className="env-pct-label">{flag.environments[env].rolloutPercentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Flag Stats */}
        <div className="detail-sidebar">
          <div className="card">
            <h3>Statistics</h3>
            <div className="stat-list">
              <div className="stat-row">
                <span className="stat-label">Total Evaluations</span>
                <span className="stat-val">{formatNumber(flag.evaluationCount)}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Created</span>
                <span className="stat-val">{formatDate(flag.createdAt)}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Last Updated</span>
                <span className="stat-val">{timeAgo(flag.updatedAt)}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Last Evaluated</span>
                <span className="stat-val">{flag.lastEvaluatedAt ? timeAgo(flag.lastEvaluatedAt) : 'Never'}</span>
              </div>
              {flag.lastKilledAt && (
                <div className="stat-row">
                  <span className="stat-label">Last Killed</span>
                  <span className="stat-val" style={{ color: 'var(--fg-danger)' }}>
                    {formatDate(flag.lastKilledAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Targeting Rules */}
          <div className="card" style={{ marginTop: 'var(--fg-space-md)' }}>
            <h3>Targeting Rules</h3>
            {flag.targetingRules.length === 0 ? (
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>No targeting rules configured.</p>
            ) : (
              <div className="rule-list">
                {flag.targetingRules.map((rule, i) => (
                  <div key={rule.id} className="rule-item">
                    <span className="rule-num">{i + 1}</span>
                    <span className="rule-text">
                      <strong>{rule.attribute}</strong>{' '}
                      <em>{rule.operator.replace('_', ' ')}</em>{' '}
                      <code>{rule.value}</code>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Audit */}
          <div className="card" style={{ marginTop: 'var(--fg-space-md)' }}>
            <h3>Recent Activity</h3>
            {flagAudit.length === 0 ? (
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>No activity yet.</p>
            ) : (
              <div className="activity-list">
                {flagAudit.map((entry) => (
                  <div key={entry.id} className="activity-item">
                    <span className="activity-time">{timeAgo(entry.timestamp)}</span>
                    <span className="activity-desc">{entry.description}</span>
                    <span className="activity-actor">{entry.actor.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
