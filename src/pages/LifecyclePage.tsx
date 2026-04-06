import { Link } from 'react-router-dom';
import { useStore } from '../lib/store';
import { formatNumber, timeAgo, flagAgeDays, getCleanupSuggestion } from '../lib/utils';
import type { FlagStatus } from '../lib/types';
import '../components/ui/shared.css';
import './LifecyclePage.css';

const statusOrder: FlagStatus[] = ['active', 'draft', 'stale', 'deprecated', 'archived'];

export default function LifecyclePage() {
  const { flags, updateFlag, addAuditEntry } = useStore();

  const counts = statusOrder.reduce(
    (acc, s) => {
      acc[s] = flags.filter((f) => f.status === s).length;
      return acc;
    },
    {} as Record<FlagStatus, number>,
  );

  const cleanupCandidates = flags
    .filter((f) => {
      const suggestion = getCleanupSuggestion(
        f.status,
        f.environments.production.rolloutPercentage,
        f.lastEvaluatedAt,
        f.evaluationCount,
      );
      return suggestion !== null;
    })
    .map((f) => ({
      flag: f,
      suggestion: getCleanupSuggestion(
        f.status,
        f.environments.production.rolloutPercentage,
        f.lastEvaluatedAt,
        f.evaluationCount,
      )!,
    }));

  const handleArchive = (flagId: string) => {
    const flag = flags.find((f) => f.id === flagId);
    if (!flag) return;
    updateFlag(flagId, { status: 'archived', enabled: false });
    addAuditEntry({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      actor: { id: 'u0', email: 'you@company.com', name: 'You' },
      action: 'archived',
      resourceType: 'flag',
      resourceId: flagId,
      resourceName: flag.name,
      description: `Archived flag ${flag.key}`,
      before: flag.status,
      after: 'archived',
      ipAddress: '127.0.0.1',
    });
  };

  const handleDeprecate = (flagId: string) => {
    const flag = flags.find((f) => f.id === flagId);
    if (!flag) return;
    updateFlag(flagId, { status: 'deprecated' });
    addAuditEntry({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      actor: { id: 'u0', email: 'you@company.com', name: 'You' },
      action: 'updated',
      resourceType: 'flag',
      resourceId: flagId,
      resourceName: flag.name,
      description: `Deprecated flag ${flag.key}`,
      before: flag.status,
      after: 'deprecated',
      ipAddress: '127.0.0.1',
    });
  };

  return (
    <div className="lifecycle-page">
      <div className="page-header">
        <h1>Flag Lifecycle</h1>
        <p>Manage flags from creation through cleanup</p>
      </div>

      {/* Status distribution */}
      <div className="lifecycle-distribution">
        {statusOrder.map((status) => (
          <div key={status} className="lifecycle-stat">
            <div className={`lifecycle-stat-count lifecycle-stat-count--${status}`}>
              {counts[status]}
            </div>
            <div className="lifecycle-stat-label">{status}</div>
          </div>
        ))}
      </div>

      {/* Health bar visualization */}
      <div className="health-bar-container">
        <div className="health-bar">
          {statusOrder.map((status) => {
            const pct = flags.length > 0 ? (counts[status] / flags.length) * 100 : 0;
            if (pct === 0) return null;
            return (
              <div
                key={status}
                className={`health-segment health-segment--${status}`}
                style={{ width: `${pct}%` }}
                title={`${status}: ${counts[status]} flags (${pct.toFixed(0)}%)`}
              />
            );
          })}
        </div>
        <div className="health-legend">
          {statusOrder.map((status) => (
            <span key={status} className="legend-item">
              <span className={`legend-dot legend-dot--${status}`} />
              {status}
            </span>
          ))}
        </div>
      </div>

      {/* Cleanup Suggestions */}
      {cleanupCandidates.length > 0 && (
        <div className="cleanup-section">
          <h2>Cleanup Suggestions</h2>
          <p className="cleanup-subtitle">
            {cleanupCandidates.length} flag{cleanupCandidates.length !== 1 ? 's' : ''} need attention
          </p>
          <div className="cleanup-list">
            {cleanupCandidates.map(({ flag, suggestion }) => (
              <div key={flag.id} className="cleanup-item card">
                <div className="cleanup-info">
                  <div className="cleanup-flag-header">
                    <Link to={`/dashboard/flag/${flag.id}`} className="cleanup-flag-name">
                      {flag.name}
                    </Link>
                    <span className={`badge badge--${flag.status}`}>{flag.status}</span>
                  </div>
                  <code className="flag-key">{flag.key}</code>
                  <p className="cleanup-suggestion">{suggestion}</p>
                  <div className="cleanup-meta">
                    <span>Owner: {flag.owner}</span>
                    <span>Age: {flagAgeDays(flag.createdAt)}d</span>
                    <span>Evals: {formatNumber(flag.evaluationCount)}</span>
                    <span>Last eval: {flag.lastEvaluatedAt ? timeAgo(flag.lastEvaluatedAt) : 'Never'}</span>
                  </div>
                </div>
                <div className="cleanup-actions">
                  {flag.status !== 'deprecated' && flag.status !== 'archived' && (
                    <button
                      className="btn-sm btn-ghost"
                      onClick={() => handleDeprecate(flag.id)}
                    >
                      Deprecate
                    </button>
                  )}
                  {flag.status !== 'archived' && (
                    <button
                      className="btn-sm btn-ghost"
                      onClick={() => handleArchive(flag.id)}
                    >
                      Archive
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All flags by lifecycle state */}
      <div className="lifecycle-table-section">
        <h2>All Flags by Status</h2>
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Flag</th>
                <th>Status</th>
                <th>Owner</th>
                <th>Age</th>
                <th>Evaluations</th>
                <th>Last Evaluated</th>
                <th>Prod Rollout</th>
              </tr>
            </thead>
            <tbody>
              {flags
                .slice()
                .sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status))
                .map((flag) => (
                  <tr key={flag.id}>
                    <td>
                      <Link to={`/dashboard/flag/${flag.id}`} className="flag-name-link">
                        <strong>{flag.name}</strong>
                        <code className="flag-key">{flag.key}</code>
                      </Link>
                    </td>
                    <td>
                      <span className={`badge badge--${flag.status}`}>{flag.status}</span>
                    </td>
                    <td className="text-muted">{flag.owner}</td>
                    <td>{flagAgeDays(flag.createdAt)}d</td>
                    <td className="mono-value">{formatNumber(flag.evaluationCount)}</td>
                    <td className="text-muted">
                      {flag.lastEvaluatedAt ? timeAgo(flag.lastEvaluatedAt) : 'Never'}
                    </td>
                    <td>
                      {flag.environments.production.enabled ? (
                        <span className="mono-value">
                          {flag.environments.production.rolloutPercentage}%
                        </span>
                      ) : (
                        <span className="text-muted">off</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
