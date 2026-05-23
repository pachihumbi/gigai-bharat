# GigAI Bharat

**India's worker-owned AI operating system** for mobility and gig workforce infrastructure.

[![CI](https://github.com/YOUR_ORG/gigai-bharat/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_ORG/gigai-bharat/actions/workflows/ci.yml)

---

## What we are building

A platform where gig workers own their data, earnings intelligence, and economic outcomes — starting with Bengaluru, scaling across Bharat.

| Surface | Package | Purpose |
|---------|---------|---------|
| **Worker app** | `@gigai/worker` | Earnings OCR, wallet, welfare, maps, safety |
| **Admin console** | `@gigai/admin` | City ops, audit, compliance |
| **Marketing site** | `@gigai/marketing` | Public narrative & investor story |
| **Backend** | `supabase/` | Postgres, Auth, RLS, Edge Functions, AI |

---

## Repository structure

```
gigai-bharat/
├── apps/
│   ├── worker/          # React + Vite — worker product
│   ├── admin/           # React + Vite — internal ops
│   └── marketing/       # TanStack Start — public site
├── packages/
│   ├── ui/              # Shared design system (extracting)
│   ├── types/           # Shared TS + generated DB types
│   └── tsconfig/        # Shared compiler config
├── supabase/
│   ├── migrations/      # Schema + RLS
│   └── functions/       # AI & server logic (Deno)
├── infra/
│   └── ai/              # Prompts, evals, AI roadmap
├── docs/
│   ├── MIGRATION.md
│   └── DEPLOYMENT.md
├── ARCHITECTURE.md
├── CONTRIBUTING.md
└── SECURITY.md
```

Full system design → **[ARCHITECTURE.md](./ARCHITECTURE.md)**

---

## Quick start

### Prerequisites

- Node.js **20+**
- npm **10+**
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for backend)

### Install

```bash
git clone https://github.com/YOUR_ORG/gigai-bharat.git
cd gigai-bharat
npm install
```

### Environment

```bash
cp .env.example .env.local
cp .env.example apps/worker/.env.local
# Edit with your Supabase + Maps keys (see .env.example)
```

### Run apps

```bash
npm run dev:worker      # http://localhost:8080
npm run dev:marketing   # TanStack dev server
npm run dev:admin       # http://localhost:8081
```

### Supabase (from repo root)

```bash
npx supabase login
npx supabase link --project-ref YOUR_REF
npx supabase start          # optional local stack
npm run functions:serve     # test parse-earning locally
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:worker` | Worker app dev server |
| `npm run dev:marketing` | Marketing site |
| `npm run dev:admin` | Admin console |
| `npm run build` | Build all apps (Turbo) |
| `npm run lint` | Lint all workspaces |
| `npm run test` | Run tests |
| `npm run db:push` | Apply migrations |
| `npm run db:types` | Generate TS types → `packages/types` |
| `npm run functions:deploy` | Deploy Edge Functions |

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Vite, Tailwind, shadcn/ui |
| Marketing SSR | TanStack Start, Vercel (Nitro) or Cloudflare Workers |
| Backend | Supabase (Postgres, Auth, RLS, Edge Functions) |
| AI | Gemini Vision via `parse-earning` Edge Function |
| Monorepo | npm workspaces + Turborepo |

---

## Documentation

| Doc | Audience |
|-----|----------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Engineers, investors (technical diligence) |
| [docs/CTO_ROADMAP.md](./docs/CTO_ROADMAP.md) | **Engineering roadmap** — Phases 1–4 |
| [docs/BHARATGIG_LIVE.md](./docs/BHARATGIG_LIVE.md) | Production domain — bharatgig.live |
| [docs/DEPLOY_VERCEL.md](./docs/DEPLOY_VERCEL.md) | Vercel deployment guide |
| [docs/MIGRATION.md](./docs/MIGRATION.md) | Legacy folder merge |
| [docs/FOLDER_STRUCTURE.md](./docs/FOLDER_STRUCTURE.md) | Full directory reference |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contributors |
| [SECURITY.md](./SECURITY.md) | Security policy & reporting |

---

## License

Proprietary — All rights reserved. Contact founders for partnership inquiries.
