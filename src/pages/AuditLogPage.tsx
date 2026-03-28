import { useState, useMemo } from 'react';
import { useStore } from '../lib/store';
import { formatDate, timeAgo } from '../lib/utils';
import type { AuditEntry } from '../lib/types';
import '../components/ui/shared.css';
import './AuditLogPage.css';

const actionTypes: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'All Actions' },
  { value: 'created', label: 'Created' },
  { value: 'updated', label: 'Updated' },
  { value: 'enabled', label: 'Enabled' },
  { value: 'disabled', label: 'Disabled' },
  { value: 'killed', label: 'Killed' },
  { value: 'restored', label: 'Restored' },
  { value: 'archived', label: 'Archived' },
  { value: 'rollout_changed', label: 'Rollout Changed' },
  { value: 'experiment_started', label: 'Experiment Started' },
  { value: 'experiment_stopped', label: 'Experiment Stopped' },
];

function getActionColor(action: AuditEntry['action']): string {
  switch (action) {
    case 'created': return 'var(--fg-accent-light)';
    case 'enabled': return 'var(--fg-success)';
    case 'disabled': return 'var(--fg-text-muted)';
    case 'killed': return 'var(--fg-danger)';
    case 'restored': return 'var(--fg-success)';
    case 'archived': return 'var(--fg-text-muted)';
    case 'rollout_changed': return 'var(--fg-warning)';
    case 'experiment_started': return 'var(--fg-accent-light)';
    case 'experiment_stopped': return 'var(--fg-warning)';
    default: return 'var(--fg-text)';
  }
}

export default function AuditLogPage() {
  const { auditLog } = useStore();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return auditLog.filter((entry) => {
      if (actionFilter !== 'all' && entry.action !== actionFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          entry.resourceName.toLowerCase().includes(q) ||
          entry.description.toLowerCase().includes(q) ||
          entry.actor.name.toLowerCase().includes(q) ||
          entry.actor.email.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [auditLog, search, actionFilter]);

  return (
    <div className="audit-page">
      <div className="page-header">
        <h1>Audit Log</h1>
        <p>Immutable record of every action taken in the platform</p>
      </div>

      {/* Filters */}
      <div className="audit-filters">
        <div className="search-input">
          <input
            type="text"
            placeholder="Search by resource, description, or actor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select audit-filter-select"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
        >
          {actionTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div className="audit-summary">
        Showing {filtered.length} of {auditLog.length} entries
      </div>

      {/* Audit feed */}
      <div className="audit-feed">
        {filtered.map((entry) => (
          <div
            key={entry.id}
            className={`audit-entry ${expandedId === entry.id ? 'audit-entry--expanded' : ''}`}
            onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
          >
            <div className="audit-entry-main">
              <div className="audit-timeline">
                <div
                  className="audit-dot"
                  style={{ background: getActionColor(entry.action) }}
                />
                <div className="audit-line" />
              </div>

              <div className="audit-content">
                <div className="audit-content-header">
                  <span
                    className="audit-action-badge"
                    style={{
                      color: getActionColor(entry.action),
                      borderColor: getActionColor(entry.action),
                    }}
                  >
                    {entry.action.replace('_', ' ')}
                  </span>
                  <span className="audit-resource">{entry.resourceName}</span>
                  <span className="audit-time">{timeAgo(entry.timestamp)}</span>
                </div>
                <p className="audit-description">{entry.description}</p>
                <div className="audit-actor">
                  {entry.actor.name} ({entry.actor.email})
                </div>
              </div>
            </div>

            {/* Expanded details */}
            {expandedId === entry.id && (
              <div className="audit-details">
                <div className="audit-detail-grid">
                  <div className="audit-detail-item">
                    <span className="audit-detail-label">Timestamp</span>
                    <span className="audit-detail-value">{formatDate(entry.timestamp)}</span>
                  </div>
                  <div className="audit-detail-item">
                    <span className="audit-detail-label">Resource Type</span>
                    <span className="audit-detail-value">{entry.resourceType}</span>
                  </div>
                  <div className="audit-detail-item">
                    <span className="audit-detail-label">Resource ID</span>
                    <span className="audit-detail-value mono-value">{entry.resourceId}</span>
                  </div>
                  <div className="audit-detail-item">
                    <span className="audit-detail-label">IP Address</span>
                    <span className="audit-detail-value mono-value">{entry.ipAddress}</span>
                  </div>
                </div>

                {/* Before/After diff */}
                {(entry.before || entry.after) && (
                  <div className="audit-diff">
                    <h4>Changes</h4>
                    <div className="diff-columns">
                      {entry.before && (
                        <div className="diff-col diff-col--before">
                          <span className="diff-label">Before</span>
                          <code>{entry.before}</code>
                        </div>
                      )}
                      {entry.after && (
                        <div className="diff-col diff-col--after">
                          <span className="diff-label">After</span>
                          <code>{entry.after}</code>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="empty-state">
            <h3>No audit entries found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
