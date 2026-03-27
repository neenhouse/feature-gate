# FeatureGate -- Root CLAUDE.md

Feature flag and experimentation platform. React 19 + Vite + Cloudflare Workers + D1.

## Documentation Hierarchy

```
CLAUDE.md                  (this file -- root authority, tech stack, commands, team)
  .claude/CLAUDE.md        (agent instructions, conventions, project structure)
  docs/vision.md           (north star vision and design principles)
  docs/prd.md              (product requirements -- 8 features)
  docs/specs/              (technical specs)
```

When documents conflict, resolve by walking up the chain.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, TailwindCSS (planned) |
| Backend | Cloudflare Workers, D1 (SQLite), KV |
| Deploy | Cloudflare Pages via GitHub Actions |
| Testing | Vitest + React Testing Library |
| Tooling | pnpm (package manager), mise (runtime versions) |

## Dev Commands

```bash
pnpm dev           # Start dev server
pnpm build         # TypeScript check + Vite production build
pnpm test          # Run Vitest
pnpm lint          # ESLint
pnpm lint:fix      # ESLint with auto-fix
pnpm preview       # Preview production build locally
```

## Conventions

- Use **pnpm** as package manager (never npm or yarn)
- Use **mise** for runtime versions (see `.mise.toml`)
- CSS custom properties for theming (defined in `src/index.css`)
- React.lazy + Suspense for route-level code splitting
- Tests live next to source files (`Component.test.tsx`)
- All API routes in `worker/routes/`
- Feature flags stored in KV, experiment data in D1

## Agent Team Roles

Six agents defined in `.claude/agents/`:

| Agent | Role | Scope | Writes Code |
|-------|------|-------|-------------|
| `ceo` | Strategic leadership, vision, priorities | Strategy docs | No |
| `team-lead` | Orchestrator -- decomposes, delegates, monitors | Task management | No |
| `frontend-dev` | React, components, pages, UI | `src/` | Yes |
| `backend-dev` | Cloudflare Workers, APIs, D1, KV | `worker/` | Yes |
| `content-writer` | Copy, messaging, SEO, meta tags | Text content | No |
| `qa` | Testing, accessibility, performance | Tests + read-only | Yes (tests) |

## Single Source of Truth

| Concern | Source File |
|---------|------------|
| Vision and design principles | `docs/vision.md` |
| Product requirements | `docs/prd.md` |
| Runtime versions | `.mise.toml` |
| Agent definitions | `.claude/agents/*.md` |
| Worker config | `wrangler.jsonc` |

## Project Structure

```
src/
  pages/           Route-level components
  components/
    ui/            Reusable UI components
    sections/      Page sections
  hooks/           Custom React hooks
  lib/             Utilities, types, constants
worker/
  routes/          API endpoints
  index.ts         Worker entry point
docs/
  specs/           Technical specs
public/            Static assets
```
