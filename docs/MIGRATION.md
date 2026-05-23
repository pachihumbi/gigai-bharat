# Monorepo migration guide

This document records how the legacy two-folder layout was merged into **gigai-bharat**.

## Before → After

| Before | After |
|--------|-------|
| `GigAI/Bharat Gig AI/` | `apps/worker/` |
| `GigAI/Gig AI website/` | `apps/marketing/` |
| `apps/worker/supabase/` | `supabase/` (repo root) |
| *(none)* | `apps/admin/` (new scaffold) |
| *(none)* | `packages/ui`, `packages/types`, `packages/tsconfig` |

## File move reference

### Worker app (`apps/worker`)

| Keep in place | Notes |
|---------------|-------|
| `src/**` | All pages, hooks, components |
| `index.html`, `vite.config.ts`, `tailwind.config.ts` | App config |
| `public/**` | Static assets |

| Moved out | New location |
|-----------|--------------|
| `supabase/` | `../../supabase/` |

| Action required | Detail |
|-----------------|--------|
| `.env` → `.env.local` | Copy values from old `.env`; never commit |
| Supabase CLI | Run from **repo root** (`npx supabase …`) |

### Marketing app (`apps/marketing`)

| Keep in place | Notes |
|---------------|-------|
| `src/routes/**` | TanStack file routes |
| `wrangler.jsonc` | Cloudflare deploy |
| `bun.lock` | Optional; npm workspaces also supported |

No Supabase folder — marketing is static/SSR only.

### New: Admin (`apps/admin`)

Scaffolded with dashboard, workers, audit routes. Wire auth + RLS before production.

### New: Shared packages

| Package | Purpose |
|---------|---------|
| `@gigai/ui` | Shared `cn()` — extract components later |
| `@gigai/types` | Domain + generated DB types |
| `@gigai/tsconfig` | Shared TS bases |

## Post-migration checklist

- [ ] `git init` at repo root (if not already)
- [ ] Copy `.env.example` → `.env.local` and `apps/worker/.env.local`
- [ ] **Rotate** any keys that were in committed `.env`
- [ ] `npm install` at root
- [ ] `npm run dev:worker` — verify http://localhost:8080
- [ ] `npm run dev:marketing` — verify marketing site
- [ ] `npm run dev:admin` — verify http://localhost:8081
- [ ] `npx supabase link` from root
- [ ] `npm run db:types` — sync `packages/types`
- [ ] Delete `GigAI/*.zip` archives from repo (or add to `.gitignore` — already ignored)
- [ ] Remove empty `GigAI/` folder

## Sync database types to packages

```bash
# After supabase start or link
npm run db:types

# Optionally re-export in worker (until imports updated):
# import type { Database } from '@gigai/types/database'
```

## Rollback

If needed, legacy zips in `GigAI/` can restore pre-monorepo trees. Prefer git tags instead: `git tag pre-monorepo`.
