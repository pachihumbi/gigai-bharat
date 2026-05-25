# Frontend

All user-facing applications live in `apps/` (npm workspaces). This folder is the **logical map** for investors and hires — no duplicate code.

| App | Path | Production URL | Stack |
|-----|------|----------------|-------|
| **Marketing** (investor site) | `apps/marketing/` | https://www.bharatgig.live | TanStack Start + Nitro (Vercel SSR) |
| **Worker** (product PWA) | `apps/worker/` | https://app.bharatgig.live | React + Vite + PWA |
| **Admin** (internal ops) | `apps/admin/` | Vercel preview (staging) | React + Vite |
| **Shared UI** | `packages/ui/` | — | shadcn primitives (`cn()`) |

## Commands

```bash
npm run dev:marketing   # http://localhost:5173
npm run dev:worker      # http://localhost:8080
npm run dev:admin       # http://localhost:8081
npm run build           # all apps
```

Deploy guides → [`deployment/`](../deployment/README.md)
