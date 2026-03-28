import { useState } from 'react';
import { useStore } from '../lib/store';
import { timeAgo } from '../lib/utils';
import '../components/ui/shared.css';
import './KillSwitchPage.css';

export default function KillSwitchPage() {
  const { flags, killFlag, restoreFlag, addAuditEntry } = useStore();
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<string | null>(null);

  const activeFlags = flags.filter((f) => f.status !== 'archived' && f.status !== 'deprecated');
  const killedFlags = flags.filter((f) => f.killSwitchActive);

  const handleKill = (flagId: string) => {
    const flag = flags.find((f) => f.id === flagId);
    if (!flag) return;

    killFlag(flagId);
    addAuditEntry({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: { id: 'u0', email: 'you@company.com', name: 'You' },
      action: 'killed',
      resourceType: 'flag',
      resourceId: flagId,
      resourceName: flag.name,
      description: `Emergency kill switch activated for ${flag.key}`,
      before: 'enabled',
      after: 'killed (0%)',
      ipAddress: '127.0.0.1',
    });
    setConfirmTarget(null);
  };

  const handleRestore = (flagId: string) => {
    const flag = flags.find((f) => f.id === flagId);
    if (!flag) return;

    restoreFlag(flagId);
    addAuditEntry({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: { id: 'u0', email: 'you@company.com', name: 'You' },
      action: 'restored',
      resourceType: 'flag',
      resourceId: flagId,
      resourceName: flag.name,
      description: `Restored ${flag.key} from kill switch`,
      before: 'killed',
      after: 'restored',
      ipAddress: '127.0.0.1',
    });
    setRestoreTarget(null);
  };

  return (
    <div className="killswitch-page">
      <div className="page-header">
        <h1>Kill Switch</h1>
        <p>Emergency flag controls -- instantly disable any flag across all environments</p>
      </div>

      {/* Currently killed flags */}
      {killedFlags.length > 0 && (
        <div className="killed-section">
          <h3 className="killed-heading">Currently Killed ({killedFlags.length})</h3>
          <div className="killed-list">
            {killedFlags.map((flag) => (
              <div key={flag.id} className="killed-item">
                <div className="killed-info">
                  <strong>{flag.name}</strong>
                  <code className="flag-key">{flag.key}</code>
                  {flag.lastKilledAt && (
                    <span className="killed-time">Killed {timeAgo(flag.lastKilledAt)}</span>
                  )}
                </div>
                <button
                  className="btn-sm btn-restore"
                  onClick={() => setRestoreTarget(flag.id)}
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kill switch grid */}
      <div className="kill-grid">
        {activeFlags.map((flag) => (
          <div
            key={flag.id}
            className={`kill-card ${flag.killSwitchActive ? 'kill-card--killed' : ''}`}
          >
            <div className="kill-card-header">
              <div>
                <strong className="kill-card-name">{flag.name}</strong>
                <code className="flag-key">{flag.key}</code>
              </div>
              <span className={`badge badge--${flag.status}`}>{flag.status}</span>
            </div>

            <div className="kill-card-envs">
              {(['development', 'staging', 'production'] as const).map((env) => (
                <div key={env} className="kill-env-row">
                  <span
                    className="env-dot"
                    style={{
                      background: flag.environments[env].enabled
                        ? 'var(--fg-success)'
                        : 'var(--fg-danger)',
                    }}
                  />
                  <span className="kill-env-name">{env.slice(0, 4)}</span>
                  <span className="kill-env-pct">
                    {flag.environments[env].enabled
                      ? `${flag.environments[env].rolloutPercentage}%`
                      : 'off'}
                  </span>
                </div>
              ))}
            </div>

            <button
              className={`kill-btn ${flag.killSwitchActive ? 'kill-btn--killed' : ''}`}
              onClick={() =>
                flag.killSwitchActive
                  ? setRestoreTarget(flag.id)
                  : setConfirmTarget(flag.id)
              }
              disabled={!flag.enabled && !flag.killSwitchActive}
            >
              {flag.killSwitchActive ? 'Restore' : 'Kill'}
            </button>
          </div>
        ))}
      </div>

      {/* Kill confirmation modal */}
      {confirmTarget && (
        <div className="modal-overlay" onClick={() => setConfirmTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-danger-title">Activate Kill Switch</h2>
            <p>
              This will <strong>immediately disable</strong> the flag{' '}
              <code>{flags.find((f) => f.id === confirmTarget)?.key}</code>{' '}
              across <strong>all environments</strong>. All users will receive the default value.
            </p>
            <div className="modal-impact">
              <div className="impact-row">
                <span>Environments affected</span>
                <strong>3 (dev, staging, production)</strong>
              </div>
              <div className="impact-row">
                <span>Propagation time</span>
                <strong>&lt;10 seconds</strong>
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="btn-sm btn-ghost"
                onClick={() => setConfirmTarget(null)}
              >
                Cancel
              </button>
              <button
                className="btn-sm btn-danger-fill"
                onClick={() => handleKill(confirmTarget)}
              >
                Confirm Kill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore confirmation modal */}
      {restoreTarget && (
        <div className="modal-overlay" onClick={() => setRestoreTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Restore Flag</h2>
            <p>
              This will re-enable the flag{' '}
              <code>{flags.find((f) => f.id === restoreTarget)?.key}</code>.
              Previous targeting rules and rollout percentages will need to be reconfigured.
            </p>
            <div className="modal-actions">
              <button
                className="btn-sm btn-ghost"
                onClick={() => setRestoreTarget(null)}
              >
                Cancel
              </button>
              <button
                className="btn-sm btn-primary"
                onClick={() => handleRestore(restoreTarget)}
              >
                Restore Flag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
