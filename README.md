# GigAI Bharat

**India's worker-owned AI operating system** for mobility and gig workforce infrastructure.

| | |
|---|---|
| **Live site** | [www.bharatgig.live](https://www.bharatgig.live) |
| **Worker app** | [app.bharatgig.live/demo](https://app.bharatgig.live/demo) |
| **Contact** | hello@bharatgig.live |
| **CI** | [![CI](https://github.com/pachihumbi/gigai-bharat/actions/workflows/ci.yml/badge.svg)](https://github.com/pachihumbi/gigai-bharat/actions/workflows/ci.yml) |

---

## Repository map (founder-friendly)

```
gigai-bharat/
├── frontend/          → apps/marketing, apps/worker, apps/admin
├── backend/           → supabase/ (Postgres, Auth, RLS)
├── api/               → supabase/functions/
├── assets/            → apps/*/public/
├── deployment/        → DNS, Vercel, checklists, monitoring
├── docs/              → runbooks + FOUNDER_LAUNCH.md
├── apps/              → actual application code (monorepo)
├── packages/          → shared UI, types, tsconfig
└── supabase/          → migrations + Edge Functions
```

**Start here:** [deployment/PRODUCTION_FIX_NOW.md](./deployment/PRODUCTION_FIX_NOW.md) — **fix DNS + Vercel in 10 min**

---

## What we are building

A platform where gig workers own their data, earnings intelligence, and economic outcomes — starting with Bengaluru, scaling across Bharat.

| Surface | Package | URL |
|---------|---------|-----|
| **Marketing** | `@gigai/marketing` | https://www.bharatgig.live |
| **Worker app** | `@gigai/worker` | https://app.bharatgig.live |
| **Admin** | `@gigai/admin` | Internal (staging) |
| **Backend** | `supabase/` | Hosted Supabase |

---

## Quick start (developers)

```bash
git clone https://github.com/pachihumbi/gigai-bharat.git
cd gigai-bharat
npm install
cp .env.example .env.local
cp .env.example apps/worker/.env.local
# Edit Supabase + Maps keys
npm run dev:marketing   # http://localhost:5173
npm run dev:worker      # http://localhost:8080
```

---

## Production commands

```bash
npm run build                 # build all apps
npm run health:production     # smoke test live URLs
npm run verify:secrets        # check local env files
git push origin main          # triggers CI + Vercel deploy
```

---

## Documentation

| Doc | Purpose |
|-----|---------|
| [docs/FOUNDER_LAUNCH.md](./docs/FOUNDER_LAUNCH.md) | **Launch playbook** — deploy, DNS, checklist |
| [deployment/DNS_SETUP.md](./deployment/DNS_SETUP.md) | Cloudflare + Vercel DNS |
| [deployment/PRODUCTION_CHECKLIST.md](./deployment/PRODUCTION_CHECKLIST.md) | Pre-launch boxes |
| [docs/BHARATGIG_LIVE.md](./docs/BHARATGIG_LIVE.md) | Marketing Vercel settings |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Git workflow |
| [SECURITY.md](./SECURITY.md) | Security policy |

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Marketing | TanStack Start, Nitro, Vercel SSR |
| Worker | React 19, Vite, PWA, Capacitor Android |
| Backend | Supabase (Postgres, Auth, RLS, Edge Functions) |
| AI | Gemini via `parse-earning` Edge Function |
| Monorepo | npm workspaces + Turborepo |
| Deploy | Vercel (frontend) + Supabase (backend) |
| DNS | Cloudflare → Vercel |

---

## License

[MIT](./LICENSE) — see file for terms.
