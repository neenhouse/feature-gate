# FeatureGate -- Product Requirements Document

## Overview

FeatureGate is a feature flag and experimentation platform. This PRD defines the 8 core features for the v1 release.

---

## Feature 1: Landing Page

### Summary
Marketing and product landing page that communicates FeatureGate's value proposition, showcases key features, and drives sign-up/self-host adoption.

### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| LP-1 | Hero section with tagline, subtitle, and primary CTA | P0 |
| LP-2 | Feature grid showcasing all 7 platform capabilities | P0 |
| LP-3 | Live demo widget -- interactive flag toggle that changes page element in real time | P1 |
| LP-4 | Code snippet preview showing SDK integration in 3 languages | P0 |
| LP-5 | Performance stats section (latency, uptime, edge locations) | P1 |
| LP-6 | Pricing/self-host comparison table | P2 |
| LP-7 | Footer with docs links, GitHub, changelog | P0 |
| LP-8 | Responsive design -- mobile-first, works on all breakpoints | P0 |

### Acceptance Criteria
- Page loads in under 1 second on 3G
- Lighthouse performance score >= 90
- All CTAs link to appropriate destinations
- Interactive demo works without authentication

---

## Feature 2: Flag Creation + Targeting Rules

### Summary
Core flag management interface. Users create boolean, string, number, or JSON flags and define targeting rules that determine which users see which variant.

### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| FC-1 | Create flags with name, key (slug), description, type (boolean/string/number/JSON) | P0 |
| FC-2 | Default value and per-environment overrides (dev, staging, production) | P0 |
| FC-3 | Targeting rules engine: attribute-based conditions (user ID, email, country, custom attributes) | P0 |
| FC-4 | Rule operators: equals, not equals, contains, starts with, ends with, in list, regex, semver comparison | P0 |
| FC-5 | Rule ordering with priority (first match wins) | P0 |
| FC-6 | Percentage-based splits within targeting rules | P1 |
| FC-7 | Flag tags and search/filter | P1 |
| FC-8 | Bulk flag operations (enable, disable, archive) | P2 |
| FC-9 | Flag validation -- prevent duplicate keys, enforce naming conventions | P0 |
| FC-10 | Real-time preview: "What would user X see?" test panel | P1 |

### Acceptance Criteria
- Flag creation takes < 30 seconds for a simple boolean flag
- Targeting rules evaluate consistently (deterministic hashing for percentage splits)
- Maximum 100 targeting rules per flag
- Flag key immutable after creation

---

## Feature 3: Gradual Rollout Controls

### Summary
Percentage-based rollout mechanism that lets teams progressively increase a flag's exposure from 0% to 100%, with scheduling and automatic progression.

### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| GR-1 | Percentage slider (0-100%) with real-time user count estimate | P0 |
| GR-2 | Deterministic bucketing -- same user always gets same variant at same percentage | P0 |
| GR-3 | Rollout schedule: define percentage steps with timestamps (e.g., 10% Monday, 50% Wednesday, 100% Friday) | P1 |
| GR-4 | Automatic rollback trigger: if error rate metric exceeds threshold, revert to previous percentage | P2 |
| GR-5 | Rollout history graph showing percentage over time | P1 |
| GR-6 | Per-environment rollout percentages | P0 |
| GR-7 | Sticky bucketing -- users don't switch variants when percentage changes | P0 |
| GR-8 | Exclude list -- specific user IDs always excluded from rollout | P1 |

### Acceptance Criteria
- Bucketing is deterministic using murmur3 hash of (flag_key + user_id)
- Percentage changes propagate to all edges within 60 seconds
- Rollout schedule executes within 1 minute of scheduled time
- Sticky bucketing survives percentage increases (no reassignment)

---

## Feature 4: A/B Test Setup + Statistical Significance Calculator

### Summary
Full experimentation workflow: create experiments with control/treatment variants, assign metrics, collect results, and calculate statistical significance with clear pass/fail verdicts.

### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| AB-1 | Create experiment linked to a feature flag with 2+ variants | P0 |
| AB-2 | Define primary metric (conversion rate, revenue, latency, custom) and guardrail metrics | P0 |
| AB-3 | Sample size calculator: given baseline rate, MDE, significance level, and power, compute required sample | P0 |
| AB-4 | Real-time results dashboard: conversion rates per variant, confidence intervals, p-value | P0 |
| AB-5 | Sequential testing support (avoid peeking problem) | P1 |
| AB-6 | Automatic winner declaration when significance threshold reached | P1 |
| AB-7 | Segment analysis: break down results by user attribute | P2 |
| AB-8 | Experiment history with exportable results (CSV/JSON) | P1 |
| AB-9 | Mutual exclusion groups -- ensure users are in only one experiment at a time | P2 |
| AB-10 | Bayesian and frequentist calculation modes | P2 |

### Acceptance Criteria
- Statistical calculations validated against known test datasets
- Sample size calculator matches industry-standard formulas (Evan Miller)
- Results update within 5 minutes of event ingestion
- P-value and confidence interval displayed with plain-language interpretation

---

## Feature 5: Kill Switch Panel

### Summary
Emergency response interface for instantly disabling flags across all environments and edges. Designed for incident response -- speed and clarity above all else.

### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| KS-1 | Global kill switch: disable any flag with one click, propagates to all edges | P0 |
| KS-2 | Bulk kill: disable all flags matching a tag or project | P0 |
| KS-3 | Kill confirmation dialog with impact summary (affected users, environments, experiments) | P0 |
| KS-4 | Kill propagation status: real-time indicator showing edge propagation progress | P1 |
| KS-5 | Auto-kill rules: if external health check fails, automatically kill specified flags | P2 |
| KS-6 | Kill history with restore capability (one-click revert to pre-kill state) | P0 |
| KS-7 | Incident timeline view: chronological log of all kills during an incident window | P1 |
| KS-8 | Slack/webhook notification on kill activation | P1 |

### Acceptance Criteria
- Kill switch takes effect within 10 seconds globally
- Kill action requires exactly 1 click (no multi-step wizard)
- Restore to pre-kill state preserves all targeting rules and rollout percentages
- Kill events are immutably logged in audit trail

---

## Feature 6: Flag Lifecycle Manager

### Summary
Manage the full lifecycle of feature flags: creation, active use, stale detection, deprecation, and cleanup. Prevents flag debt from accumulating.

### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| FL-1 | Flag states: draft, active, stale, deprecated, archived | P0 |
| FL-2 | Stale flag detection: flags not evaluated in N days are marked stale | P0 |
| FL-3 | Deprecation workflow: mark flag deprecated, set removal date, notify SDK consumers | P1 |
| FL-4 | Cleanup report: list of flags safe to remove (100% rolled out, no experiments, no recent evaluations) | P0 |
| FL-5 | Flag owner assignment and ownership transfer | P1 |
| FL-6 | Scheduled archival: auto-archive deprecated flags after grace period | P2 |
| FL-7 | Dashboard widget showing flag health: active vs stale vs deprecated counts | P0 |
| FL-8 | Code reference scanner: find flag key references in connected repositories | P2 |

### Acceptance Criteria
- Stale detection configurable per flag (default: 30 days without evaluation)
- Archived flags are soft-deleted (recoverable for 90 days)
- Cleanup report runs daily and is available via API
- Lifecycle state changes logged in audit trail

---

## Feature 7: Audit Log

### Summary
Immutable, searchable log of every action taken in the platform. Supports compliance requirements and incident investigation.

### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| AL-1 | Log every mutation: flag CRUD, targeting changes, rollout changes, kills, experiment actions | P0 |
| AL-2 | Log entry fields: timestamp, actor (user ID + email), action, resource, before/after diff, IP address | P0 |
| AL-3 | Search and filter: by actor, action type, resource, date range | P0 |
| AL-4 | Diff viewer: side-by-side before/after for any change | P1 |
| AL-5 | Export: CSV and JSON export of filtered results | P1 |
| AL-6 | Retention policy: configurable retention period (default 1 year) | P1 |
| AL-7 | Webhook integration: stream audit events to external SIEM/logging platform | P2 |
| AL-8 | Immutability guarantee: audit entries cannot be modified or deleted via API | P0 |

### Acceptance Criteria
- Every state-changing API call produces an audit entry
- Audit log query returns results in < 500ms for up to 1M entries
- Before/after diff is human-readable (not raw JSON dump)
- Audit entries include full request context (IP, user agent, API key ID)

---

## Feature 8: SDK Code Generator

### Summary
Generate copy-paste SDK integration code for 6 languages. Each snippet is idiomatic, handles initialization, flag evaluation, and event tracking.

### Supported Languages

1. **JavaScript/TypeScript** (browser + Node.js)
2. **Python**
3. **Go**
4. **Ruby**
5. **Java**
6. **Rust**

### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| SDK-1 | Language selector with syntax-highlighted code preview | P0 |
| SDK-2 | Generated code includes: SDK install command, initialization, flag evaluation, event tracking | P0 |
| SDK-3 | Context-aware: code references the actual flag key and variants from the selected flag | P0 |
| SDK-4 | Framework-specific variants: React hook, Express middleware, Django middleware, Gin middleware | P1 |
| SDK-5 | Copy-to-clipboard button with success feedback | P0 |
| SDK-6 | Package manager variants: npm/pnpm/yarn, pip/poetry, go get, gem, maven/gradle, cargo | P1 |
| SDK-7 | Environment configuration: auto-populate API key and endpoint for selected environment | P1 |
| SDK-8 | Type-safe evaluation: generated code uses correct types for the flag's value type | P0 |

### Code Generation Templates

Each language generates 4 sections:

```
1. Installation
   $ npm install @featuregate/sdk

2. Initialization
   import { FeatureGate } from '@featuregate/sdk';
   const fg = new FeatureGate({ apiKey: 'fg_live_xxx' });

3. Flag Evaluation
   const showNewUI = fg.isEnabled('new-dashboard-ui', { userId: user.id });

4. Event Tracking (for experiments)
   fg.track('purchase_completed', { userId: user.id, revenue: 49.99 });
```

### Acceptance Criteria
- Generated code compiles/runs without modification (given valid API key)
- All 6 languages have complete templates for all 4 sections
- Code follows each language's idiomatic style (e.g., snake_case for Python/Ruby, camelCase for JS/Java)
- Syntax highlighting uses appropriate language grammar
