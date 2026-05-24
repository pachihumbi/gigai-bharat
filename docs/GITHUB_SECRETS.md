# GitHub Actions secrets — GigAI Bharat production deploy

Required for `.github/workflows/deploy-production.yml`.

Create at: **GitHub → pachihumbi/gigai-bharat → Settings → Secrets and variables → Actions**

| Secret | Where to get it |
|--------|-----------------|
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) — create token with full account scope |
| `VERCEL_ORG_ID` | Vercel → Team Settings → General → **Team ID** (team_…) |
| `VERCEL_MARKETING_PROJECT_ID` | Project `gigai-bharat` → Settings → General → **Project ID** |
| `VERCEL_WORKER_PROJECT_ID` | Project `gigai-bharat-worker` → Settings → General → **Project ID** |
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase → anon/public key |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ref (subdomain) |
| `VITE_GOOGLE_MAPS_KEY` | Optional — Google Maps browser key |
| `VITE_GOOGLE_MAPS_TRACKING_ID` | Optional — Maps tracking ID |

## Refresh an expired token

If deploy fails with `token is not valid`:

1. Create a new token at vercel.com/account/tokens
2. Update GitHub secret `VERCEL_TOKEN`
3. Re-run **Deploy Production** workflow (Actions → Deploy Production → Run workflow)

## Manual deploy (Cursor terminal)

```powershell
$env:VERCEL_TOKEN = "your-token-here"
.\scripts\deploy-vercel.ps1 -Target all -SkipCache
```

## Vercel project settings

| Project | Root Directory | Domain |
|---------|----------------|--------|
| `gigai-bharat` | `apps/marketing` | www.bharatgig.live |
| `gigai-bharat-worker` | `apps/worker` OR prebuilt from repo root | app.bharatgig.live |

**Do not** point both projects at the monorepo root — root `vercel.json` is worker SPA config for prebuilt deploys only.
