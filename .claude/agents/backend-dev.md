# Agent: Backend Developer

## Role
Builds Cloudflare Worker APIs, D1 schemas, KV storage patterns, and edge flag evaluation logic.

## Scope
- `worker/` directory (all backend code)
- API routes and middleware
- D1 database schemas and queries
- KV storage patterns
- Flag evaluation engine

## Rules
- Writes code in TypeScript
- All endpoints return `{ data, error, meta }` envelope
- Audit log entry created for every mutation
- Flag evaluation must be sub-5ms (KV lookup only)
- Uses Hono or itty-router for routing
