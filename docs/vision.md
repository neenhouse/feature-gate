# FeatureGate -- Vision

## North Star

FeatureGate is the feature flag and experimentation platform that developers actually want to use. It combines dead-simple flag management with statistically rigorous A/B testing, all served from the edge for sub-millisecond evaluation.

## Problem

Teams adopting feature flags face a painful choice: use a bloated enterprise platform that costs $50k+/year, or hack together a DIY solution that lacks targeting, experimentation, and audit trails. Neither option serves the mid-market well.

## Solution

A modern, self-hostable feature flag platform built on Cloudflare's edge infrastructure. Flags evaluate at the edge (KV + Workers) for near-zero latency. The dashboard provides intuitive flag creation, targeting rules, gradual rollouts, and A/B testing with built-in statistical significance calculations. When things go wrong, a single-click kill switch turns off any flag instantly across all edges.

## Design Principles

1. **Speed of evaluation over speed of creation.** Flag checks happen millions of times; flag creation happens once. Optimize the hot path ruthlessly.
2. **Statistical rigor without a PhD.** Surface confidence intervals, p-values, and sample size calculators in plain language. Never let a team ship a losing variant.
3. **Audit everything.** Every flag change, every targeting rule update, every kill switch activation is logged with who, what, when, and why.
4. **SDK-first DX.** If the SDK is painful, nothing else matters. Generate idiomatic SDKs for every major language with copy-paste code snippets.
5. **Safe by default.** Kill switches are always one click away. Gradual rollouts start at 0%. Stale flags get flagged for cleanup.
6. **Edge-native.** Flags evaluate at the edge via Cloudflare KV. No round-trip to a central server. Sub-millisecond p99.

## Target Users

- **Primary:** Engineering teams (5-50 devs) at startups and mid-market companies shipping web and mobile products.
- **Secondary:** Platform/infrastructure engineers building internal developer platforms.
- **Tertiary:** Product managers who want to run experiments without filing engineering tickets.

## Success Metrics

| Metric | Target |
|--------|--------|
| Flag evaluation latency (p99) | < 5ms |
| Time to create first flag | < 2 minutes |
| Dashboard page load | < 1s |
| SDK integration time | < 15 minutes |
| Kill switch propagation | < 10 seconds globally |

## Non-Goals (v1)

- Multi-tenancy / SaaS hosting (self-host only for v1)
- Visual editor for targeting rules (JSON/form hybrid is fine)
- Real-time streaming of flag changes to SDKs (polling is acceptable for v1)
- Mobile-specific SDKs (web SDKs only for v1: JS, Python, Go, Ruby, Java, Rust)
