# @gigai/marketing

Public marketing site — manifesto, infrastructure narrative, cities, future vision.

TanStack Start + Cloudflare Workers.

## Dev

```bash
npm run dev:marketing   # from repo root
```

## Deploy

**Cloudflare Workers (recommended):**

```bash
npm run build
npx wrangler deploy
```

**Vercel:** set root directory to `apps/marketing`, build `npm run build`, output `dist/client`.

Local dev: `npm run dev:marketing` from monorepo root → http://localhost:5173
