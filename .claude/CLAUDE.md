# FeatureGate -- Agent Instructions

## Project Context

FeatureGate is a feature flag and experimentation platform built on Cloudflare Workers + D1 + KV. The frontend is React 19 + Vite + TypeScript.

## Conventions

- Use **pnpm** as package manager (never npm or yarn)
- Use **mise** for runtime versions (see `.mise.toml`)
- All API routes live in `worker/routes/`
- Feature flag data stored in Cloudflare KV (hot path) and D1 (structured queries)
- Audit log entries are append-only in KV with D1 index
- Tests live next to source files (`Component.test.tsx`)
- Use React.lazy + Suspense for route-level code splitting

## Coding Standards

- TypeScript strict mode
- Named exports preferred over default exports
- Functional components with hooks (no class components)
- Error boundaries at route level
- All API endpoints return JSON with consistent envelope: `{ data, error, meta }`

## Project Structure

```
src/
  pages/           Route-level components
  components/
    ui/            Reusable UI (buttons, modals, tables, code blocks)
    sections/      Page sections (hero, feature grid, etc.)
  hooks/           Custom React hooks
  lib/             Utilities, types, constants, API client
worker/
  routes/          API endpoints (flags, experiments, audit, sdk)
  index.ts         Worker entry point + router
docs/              Product docs (vision, PRD, specs)
public/            Static assets
```
