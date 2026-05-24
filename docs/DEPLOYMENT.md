# Deployment strategy — GigAI Bharat

## Overview

| App | Host (recommended) | URL pattern |
|-----|-------------------|-------------|
| **Marketing** | **Vercel** (Nitro SSR) | `bharatgig.live`, `www.bharatgig.live` |
| **Worker** | Vercel / Cloudflare Pages | `app.bharatgig.live` |
| **Admin** | Vercel (private) | `admin.bharatgig.live` |
| **Backend** | Supabase Cloud | `*.supabase.co` |

> **Production domain:** **[BHARATGIG_LIVE.md](./BHARATGIG_LIVE.md)** — `www.bharatgig.live`

## Environments

| Env | Git branch | Supabase project |
|-----|------------|------------------|
| Development | `develop` | `gigai-dev` |
| Staging | `staging` | `gigai-staging` |
| Production | `main` | `gigai-prod` |

Use separate Supabase projects — never share service role keys across envs.

## Marketing (`@gigai/marketing`)

### Vercel (recommended for launch)

```bash
# Local simulation of Vercel build
VERCEL=1 npm run build -w @gigai/marketing
```

- Root Directory in Vercel: `apps/marketing`
- Uses Nitro Vercel preset (SSR + client routing)
- **No environment variables required** for static marketing routes
- Optional: `VITE_SITE_URL=https://www.bharatgig.live` for canonical URLs

See **[DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)** for the full beginner guide.

### Cloudflare Workers (alternative)

```bash
npm run build -w @gigai/marketing
cd apps/marketing && npx wrangler deploy
```

Default build (without `VERCEL=1`) targets Cloudflare via `@cloudflare/vite-plugin`.

## Worker (`@gigai/worker`)

```bash
npm run build -w @gigai/worker
```

**Vercel / Netlify / Cloudflare Pages:**

- Root directory: `apps/worker`
- Build: `npm run build`
- Output: `dist`
- Env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, Maps keys

**SPA routing:** redirect all paths to `index.html`.

## Admin (`@gigai/admin`)

Same static hosting as worker, but:

- Restrict via Cloudflare Access, VPN, or IP allowlist
- Do **not** set `SUPABASE_SERVICE_ROLE_KEY` in Vite env

Privileged reads → Supabase Edge Function with service role server-side.

## Supabase

```bash
# From repo root
npm run db:push                    # migrations
npm run functions:deploy           # all functions, or:
npx supabase functions deploy parse-earning
```

**Auth redirect URLs:** add production domains only. See [AUTH_PRODUCTION.md](./AUTH_PRODUCTION.md).

**Secrets:** `LOVABLE_API_KEY` in Supabase dashboard.

## CI/CD (recommended)

GitHub Actions on `main`:

1. `npm ci` → lint → test → build all apps
2. Deploy worker + marketing via platform tokens
3. `supabase db push` only from protected workflow with manual approval

## DNS (example)

| Record | Target |
|--------|--------|
| `@` | Vercel (marketing) — A `76.76.21.21` or CNAME flatten |
| `www` | CNAME → `cname.vercel-dns.com` |
| `app` | CNAME → Vercel worker |
| `admin` | CNAME → Vercel admin (Access protected) |

## Pre-launch checklist

- [ ] Marketing build passes: `npm run build -w @gigai/marketing`
- [ ] Vercel deploy verified on mobile
- [ ] `robots.txt` + `sitemap.xml` live
- [ ] No secrets committed (`npm run verify:secrets`)
- [ ] `APP_ENV=production` on worker — demo seed disabled
- [ ] RLS verified on all tables
- [ ] API keys rotated and referrer-restricted
- [ ] Sentry / logging enabled (optional)
- [ ] Backup + PITR on Supabase Pro
