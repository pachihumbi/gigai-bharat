# PRODUCTION FIX NOW — Founder Copy-Paste Runbook

**Status (2026-05-25):** Live marketing SSR is deployed. `www.bharatgig.live` serves the investor site. Complete the Vercel dashboard steps below so future deploys stay automatic.

---

## What was broken (root cause)

| Issue | Cause |
|-------|-------|
| www showed worker Sign In page | `www.bharatgig.live` was aliased to **gigai-bharat** project with Root Directory = `apps/worker` |
| `/manifesto` 500/404 | Wrong build output (static SPA instead of Nitro SSR) |
| 3 Vercel projects, 1 domain | `gigai-bharat`, `gigai-bharat-marketing`, `gigai-bharat-worker` — domains on wrong project |

---

## STEP 1 — Vercel Dashboard (10 minutes)

Open: https://vercel.com/pachihumbis-projects

### A. Marketing project → `gigai-bharat-marketing`

**Settings → General:**

| Field | Set to |
|-------|--------|
| Root Directory | `apps/marketing` |
| Framework Preset | Other |
| Node.js Version | **20.x** (not 24 — matches repo engines) |
| Output Directory | **(empty — delete any value)** |
| Install Command | `cd ../.. && npm install` |
| Build Command | `cd ../.. && npm run build -w @gigai/marketing` |

**Settings → Environment Variables (Production):**

```
VITE_SITE_URL=https://www.bharatgig.live
```

**Settings → Domains — add (move from gigai-bharat if needed):**

- `www.bharatgig.live` ← primary
- `bharatgig.live` ← apex

**Settings → Analytics:** Enable **Web Analytics** + **Speed Insights**

**Project ID (GitHub secret):** `prj_8pk8D5inKD9wCnvmYG7bWklO6b55`

### B. Worker project → `gigai-bharat-worker`

| Field | Set to |
|-------|--------|
| Root Directory | `apps/worker` |
| Framework | Vite |
| Output Directory | `dist` |
| Node.js | 20.x |

**Domains:** `app.bharatgig.live` **only**

**Env vars:** Supabase + Google Maps (see `.env.example`)

**Project ID:** `prj_td8bpmue2FlTHOqrZ1RkAfU7PAUY`

### C. Legacy project → `gigai-bharat` (disable)

1. **Settings → Domains** → Remove `www.bharatgig.live` and `bharatgig.live`
2. Optionally rename to `gigai-bharat-legacy` or delete after confirming marketing works
3. This project had Root Directory = `apps/worker` — **never attach www here again**

---

## STEP 2 — DNS (Name.com registrar)

Your domain uses **Name.com nameservers** (not Cloudflare yet). Current DNS resolves to Vercel — keep these records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| **A** | `@` | `76.76.21.21` | 300 |
| **CNAME** | `www` | `cname.vercel-dns.com` | 300 |
| **CNAME** | `app` | `cname.vercel-dns.com` | 300 |

**Verify propagation:**

```powershell
nslookup www.bharatgig.live
nslookup app.bharatgig.live
nslookup bharatgig.live
```

Expected: Vercel edge (`216.198.79.x`, `64.29.17.x`) or `76.76.21.21`.

**Optional (recommended later):** Move nameservers to Cloudflare for DDoS + email routing. See `deployment/DNS_SETUP.md`.

---

## STEP 3 — GitHub Secrets

GitHub → **pachihumbi/gigai-bharat** → Settings → Secrets → Actions:

| Secret | Value |
|--------|-------|
| `VERCEL_TOKEN` | vercel.com → Account → Tokens |
| `VERCEL_ORG_ID` | Team settings or `.vercel/project.json` |
| `VERCEL_MARKETING_PROJECT_ID` | `prj_8pk8D5inKD9wCnvmYG7bWklO6b55` |
| `VERCEL_WORKER_PROJECT_ID` | `prj_td8bpmue2FlTHOqrZ1RkAfU7PAUY` |
| `VITE_SUPABASE_URL` | Supabase dashboard |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key |
| `VITE_SUPABASE_PROJECT_ID` | `jsdmmskzwnqhmxboergf` |

---

## STEP 4 — Deploy (copy-paste)

```powershell
cd "C:\Users\TEMP.DELL\Desktop\Documents → GigAI"
npm install
$env:VERCEL = "1"
$env:VITE_SITE_URL = "https://www.bharatgig.live"
npm run build -w @gigai/marketing
cd apps\marketing
npx vercel link --project gigai-bharat-marketing --yes
npx vercel deploy --prebuilt --prod --yes
npm run health:production
```

Or push to main (after GitHub secrets are set):

```powershell
git push origin main
```

---

## STEP 5 — Verify (investor checklist)

```powershell
npm run health:production
```

Manual:

- [ ] https://www.bharatgig.live — dark hero, "Worker-Owned Mobility OS" ticker
- [ ] https://www.bharatgig.live/manifesto — SSR title "The Manifesto"
- [ ] https://www.bharatgig.live/investors — investor section loads
- [ ] https://app.bharatgig.live/demo — worker demo (no login)
- [ ] View source on www — **no** `manifest.webmanifest` (that's worker)
- [ ] LinkedIn Post Inspector — OG image renders
- [ ] SSL padlock on all three URLs

---

## Architecture (final)

```
                    ┌─────────────────────────────┐
                    │   Name.com DNS              │
                    │   A @ → 76.76.21.21         │
                    │   CNAME www,app → Vercel    │
                    └──────────────┬──────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
   gigai-bharat-marketing   gigai-bharat-worker    Supabase
   apps/marketing           apps/worker            Postgres+Auth
   www + apex               app.bharatgig.live     Edge Functions
   TanStack Start SSR       React PWA
```

---

## Rollback

Vercel → **gigai-bharat-marketing** → Deployments → previous green deployment → **Promote to Production**

---

## Support links

- Full launch playbook: `docs/FOUNDER_LAUNCH.md`
- DNS deep dive: `deployment/DNS_SETUP.md`
- Monitoring: `deployment/MONITORING.md`
