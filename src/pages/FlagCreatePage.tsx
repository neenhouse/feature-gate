import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import type { FlagType, TargetingRule, Environment } from '../lib/types';
import '../components/ui/shared.css';
import './FlagCreatePage.css';

const operators = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'starts_with', label: 'Starts With' },
  { value: 'ends_with', label: 'Ends With' },
  { value: 'in_list', label: 'In List' },
  { value: 'regex', label: 'Regex' },
  { value: 'semver_gte', label: 'Semver >=' },
] as const;

const envs: Environment[] = ['development', 'staging', 'production'];

export default function FlagCreatePage() {
  const navigate = useNavigate();
  const { addFlag, addAuditEntry } = useStore();

  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [flagType, setFlagType] = useState<FlagType>('boolean');
  const [rules, setRules] = useState<TargetingRule[]>([]);
  const [envConfig, setEnvConfig] = useState<Record<Environment, { enabled: boolean; rolloutPercentage: number }>>({
    development: { enabled: true, rolloutPercentage: 100 },
    staging: { enabled: false, rolloutPercentage: 0 },
    production: { enabled: false, rolloutPercentage: 0 },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateKey = (n: string) => {
    return n
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 50);
  };

  const handleNameChange = (v: string) => {
    setName(v);
    if (!key || key === generateKey(name)) {
      setKey(generateKey(v));
    }
  };

  const addRule = () => {
    setRules([
      ...rules,
      {
        id: `rule-${Date.now()}`,
        attribute: 'user_id',
        operator: 'equals',
        value: '',
      },
    ]);
  };

  const updateRule = (index: number, field: keyof TargetingRule, value: string) => {
    const updated = [...rules];
    updated[index] = { ...updated[index], [field]: value };
    setRules(updated);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const toggleEnv = (env: Environment) => {
    setEnvConfig({
      ...envConfig,
      [env]: { ...envConfig[env], enabled: !envConfig[env].enabled },
    });
  };

  const setEnvRollout = (env: Environment, pct: number) => {
    setEnvConfig({
      ...envConfig,
      [env]: { ...envConfig[env], rolloutPercentage: pct },
    });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!key.trim()) errs.key = 'Key is required';
    if (!/^[a-z0-9-]+$/.test(key)) errs.key = 'Key must be lowercase letters, numbers, and hyphens';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const id = `flag-${Date.now()}`;
    const now = new Date().toISOString();

    addFlag({
      id,
      key,
      name,
      description,
      type: flagType,
      status: 'draft',
      enabled: false,
      environments: envConfig,
      targetingRules: rules,
      tags: [],
      owner: 'You',
      createdAt: now,
      updatedAt: now,
      lastEvaluatedAt: null,
      evaluationCount: 0,
      killSwitchActive: false,
      lastKilledAt: null,
    });

    addAuditEntry({
      id: `audit-${Date.now()}`,
      timestamp: now,
      actor: { id: 'u0', email: 'you@company.com', name: 'You' },
      action: 'created',
      resourceType: 'flag',
      resourceId: id,
      resourceName: name,
      description: `Created flag ${key}`,
      ipAddress: '127.0.0.1',
    });

    navigate('/dashboard');
  };

  return (
    <div className="create-page">
      <div className="page-header">
        <h1>Create Flag</h1>
        <p>Define a new feature flag with targeting rules</p>
      </div>

      <form onSubmit={handleSubmit} className="create-form">
        {/* Basic Info */}
        <div className="card form-section">
          <h3>Basic Information</h3>

          <div className="grid-2">
            <div className="form-group">
              <label htmlFor="flag-name">Flag Name *</label>
              <input
                id="flag-name"
                className="form-input"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. New Dashboard UI"
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="flag-key">Flag Key *</label>
              <input
                id="flag-key"
                className="form-input"
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="e.g. new-dashboard-ui"
              />
              {errors.key && <span className="form-error">{errors.key}</span>}
              <span className="form-hint">Immutable after creation. Lowercase, hyphens only.</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="flag-desc">Description</label>
            <textarea
              id="flag-desc"
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this flag control?"
            />
          </div>

          <div className="form-group">
            <label htmlFor="flag-type">Type</label>
            <select
              id="flag-type"
              className="form-select"
              value={flagType}
              onChange={(e) => setFlagType(e.target.value as FlagType)}
            >
              <option value="boolean">Boolean</option>
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="json">JSON</option>
            </select>
          </div>
        </div>

        {/* Environment Config */}
        <div className="card form-section">
          <h3>Environment Configuration</h3>

          <div className="env-config-grid">
            {envs.map((env) => (
              <div key={env} className="env-config-item">
                <div className="env-config-header">
                  <span className="env-config-name">{env}</span>
                  <button
                    type="button"
                    className={`toggle ${envConfig[env].enabled ? 'toggle--on' : ''}`}
                    onClick={() => toggleEnv(env)}
                    aria-label={`Toggle ${env}`}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>
                {envConfig[env].enabled && (
                  <div className="env-config-rollout">
                    <label>Rollout: {envConfig[env].rolloutPercentage}%</label>
                    <input
                      type="range"
                      className="range-slider"
                      min="0"
                      max="100"
                      value={envConfig[env].rolloutPercentage}
                      onChange={(e) => setEnvRollout(env, Number(e.target.value))}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Targeting Rules */}
        <div className="card form-section">
          <div className="card-header">
            <h3>Targeting Rules</h3>
            <button type="button" className="btn-sm btn-ghost" onClick={addRule}>
              + Add Rule
            </button>
          </div>

          {rules.length === 0 && (
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              No targeting rules. Flag will apply to all users based on rollout percentage.
            </p>
          )}

          {rules.map((rule, i) => (
            <div key={rule.id} className="targeting-rule">
              <div className="rule-fields">
                <select
                  className="form-select"
                  value={rule.attribute}
                  onChange={(e) => updateRule(i, 'attribute', e.target.value)}
                >
                  <option value="user_id">User ID</option>
                  <option value="email">Email</option>
                  <option value="country">Country</option>
                  <option value="plan">Plan</option>
                  <option value="device">Device</option>
                  <option value="app_version">App Version</option>
                </select>

                <select
                  className="form-select"
                  value={rule.operator}
                  onChange={(e) => updateRule(i, 'operator', e.target.value)}
                >
                  {operators.map((op) => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>

                <input
                  className="form-input"
                  type="text"
                  value={rule.value}
                  onChange={(e) => updateRule(i, 'value', e.target.value)}
                  placeholder="Value (comma-separated for lists)"
                />
              </div>
              <button type="button" className="btn-sm btn-ghost rule-remove" onClick={() => removeRule(i)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Create Flag
          </button>
        </div>
      </form>
    </div>
  );
}
