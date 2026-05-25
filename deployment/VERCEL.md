# Vercel Deployment

Two projects, one monorepo. **Never merge into a single Vercel project.**

## Marketing (`gigai-bharat`)

```
Root: apps/marketing
Domain: www.bharatgig.live, bharatgig.live
Build: VERCEL=1 npm run build -w @gigai/marketing
Output: .vercel/output (Nitro — leave dashboard Output Directory EMPTY)
```

CLI prebuilt deploy:

```powershell
cd "C:\Users\TEMP.DELL\Desktop\Documents → GigAI\apps\marketing"
$env:VERCEL = "1"
$env:VITE_SITE_URL = "https://www.bharatgig.live"
npm run build
npx vercel deploy --prebuilt --prod
```

## Worker (`gigai-bharat-worker`)

```
Root: apps/worker
Domain: app.bharatgig.live
Build: npm run build -w @gigai/worker
Output: dist (or prebuilt via scripts/prepare-worker-vercel-output.cjs)
```

```powershell
cd "C:\Users\TEMP.DELL\Desktop\Documents → GigAI"
npm run vercel:worker
npx vercel deploy --prebuilt --prod
```

## Link projects (first time)

```powershell
cd apps/marketing
npx vercel link
# Select gigai-bharat

cd ../worker
npx vercel link
# Select gigai-bharat-worker
```

## Redeploy without cache

Vercel Dashboard → Deployments → ⋮ → **Redeploy** → uncheck "Use existing Build Cache"

Or GitHub Actions with `skip_cache: true`.

## Environment variables

| Project | Variables |
|---------|-----------|
| Marketing | `VITE_SITE_URL` (optional) |
| Worker | `VITE_SUPABASE_*`, `VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_*`, `APP_ENV=production`, `VITE_ALLOW_INVESTOR_DEMO=false` |

Full list: root `.env.example`
