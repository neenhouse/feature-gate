// FeatureGate core types

export type FlagType = 'boolean' | 'string' | 'number' | 'json';
export type FlagStatus = 'draft' | 'active' | 'stale' | 'deprecated' | 'archived';
export type Environment = 'development' | 'staging' | 'production';

export interface TargetingRule {
  id: string;
  attribute: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'starts_with' | 'ends_with' | 'in_list' | 'regex' | 'semver_gte';
  value: string;
  percentage?: number;
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  type: FlagType;
  status: FlagStatus;
  enabled: boolean;
  environments: Record<Environment, {
    enabled: boolean;
    rolloutPercentage: number;
  }>;
  targetingRules: TargetingRule[];
  tags: string[];
  owner: string;
  createdAt: string;
  updatedAt: string;
  lastEvaluatedAt: string | null;
  evaluationCount: number;
  killSwitchActive: boolean;
  lastKilledAt: string | null;
}

export interface Experiment {
  id: string;
  flagId: string;
  name: string;
  status: 'draft' | 'running' | 'completed' | 'stopped';
  variants: ExperimentVariant[];
  primaryMetric: string;
  baselineRate: number;
  mde: number;
  significanceLevel: number;
  power: number;
  requiredSampleSize: number;
  currentSampleSize: number;
  startedAt: string | null;
  completedAt: string | null;
}

export interface ExperimentVariant {
  id: string;
  name: string;
  description: string;
  allocation: number;
  conversions: number;
  impressions: number;
  conversionRate: number;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: { id: string; email: string; name: string };
  action: 'created' | 'updated' | 'deleted' | 'enabled' | 'disabled' | 'killed' | 'restored' | 'archived' | 'rollout_changed' | 'experiment_started' | 'experiment_stopped';
  resourceType: 'flag' | 'experiment' | 'targeting_rule' | 'environment';
  resourceId: string;
  resourceName: string;
  description: string;
  before?: string;
  after?: string;
  ipAddress: string;
}
