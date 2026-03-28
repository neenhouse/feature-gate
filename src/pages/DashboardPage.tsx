import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store';
import { formatNumber, timeAgo, flagAgeDays } from '../lib/utils';
import type { FlagStatus, Environment } from '../lib/types';
import '../components/ui/shared.css';
import './DashboardPage.css';

const statusFilters: Array<{ value: FlagStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'stale', label: 'Stale' },
  { value: 'deprecated', label: 'Deprecated' },
  { value: 'archived', label: 'Archived' },
];

const envs: Environment[] = ['development', 'staging', 'production'];

export default function DashboardPage() {
  const { flags } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FlagStatus | 'all'>('all');

  const filtered = flags.filter((f) => {
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.key.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const counts = {
    active: flags.filter((f) => f.status === 'active').length,
    stale: flags.filter((f) => f.status === 'stale').length,
    draft: flags.filter((f) => f.status === 'draft').length,
    total: flags.length,
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Feature Flags</h1>
        <p>Manage all flags across environments</p>
      </div>

      {/* Stats row */}
      <div className="grid-4" style={{ marginBottom: 'var(--fg-space-lg)' }}>
        <div className="stat-card">
          <div className="stat-card-value">{counts.total}</div>
          <div className="stat-card-label">Total Flags</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value" style={{ color: 'var(--fg-success)' }}>{counts.active}</div>
          <div className="stat-card-label">Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value" style={{ color: 'var(--fg-warning)' }}>{counts.stale}</div>
          <div className="stat-card-label">Stale</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value" style={{ color: 'var(--fg-accent-light)' }}>{counts.draft}</div>
          <div className="stat-card-label">Draft</div>
        </div>
      </div>

      {/* Filters */}
      <div className="dash-filters">
        <div className="search-input">
          <input
            type="text"
            placeholder="Search flags by name, key, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="tabs">
          {statusFilters.map((sf) => (
            <button
              key={sf.value}
              className={`tab ${statusFilter === sf.value ? 'tab--active' : ''}`}
              onClick={() => setStatusFilter(sf.value)}
            >
              {sf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Flag list */}
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Flag</th>
              <th>Status</th>
              {envs.map((e) => (
                <th key={e}>{e.slice(0, 3).toUpperCase()}</th>
              ))}
              <th>Evaluations</th>
              <th>Age</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((flag) => (
              <tr key={flag.id}>
                <td>
                  <Link to={`/dashboard/flag/${flag.id}`} className="flag-name-link">
                    <strong>{flag.name}</strong>
                    <code className="flag-key">{flag.key}</code>
                  </Link>
                  <div className="flag-tags">
                    {flag.tags.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </td>
                <td><span className={`badge badge--${flag.status}`}>{flag.status}</span></td>
                {envs.map((env) => (
                  <td key={env}>
                    <span
                      className="env-dot"
                      style={{
                        background: flag.environments[env].enabled
                          ? 'var(--fg-success)'
                          : 'var(--fg-danger)',
                      }}
                    />
                    {flag.environments[env].enabled && (
                      <span className="env-pct">{flag.environments[env].rolloutPercentage}%</span>
                    )}
                  </td>
                ))}
                <td className="mono-value">{formatNumber(flag.evaluationCount)}</td>
                <td>{flagAgeDays(flag.createdAt)}d</td>
                <td className="text-muted">{flag.owner}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="empty-state">No flags match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Last updated */}
      <p className="dash-updated">
        Last updated {timeAgo(new Date().toISOString())}
      </p>
    </div>
  );
}
