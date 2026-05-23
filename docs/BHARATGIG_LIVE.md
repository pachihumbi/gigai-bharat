# bharatgig.live — Production deployment runbook

**Live URL:** https://www.bharatgig.live  
**Apex redirect:** https://bharatgig.live → www  
**Stack:** TanStack Start + Nitro (Vercel SSR)  
**Monorepo path:** `apps/marketing`

---

## Vercel project settings (exact values)

In **Vercel Dashboard → Project → Settings → General**:

| Setting | Value | Why |
|---------|-------|-----|
| **Framework Preset** | Other | TanStack Start is not a static Vite SPA |
| **Root Directory** | `apps/marketing` | Marketing app lives in monorepo subfolder |
| **Node.js Version** | 20.x | Required by repo `engines` |
| **Install Command** | `cd ../.. && npm install` | Installs from monorepo root |
| **Build Command** | `cd ../.. && npm run build -w @gigai/marketing` | Builds only marketing workspace |
| **Output Directory** | *(leave empty)* | Nitro writes to `.vercel/output` automatically |

> **Critical:** Do NOT set Output Directory to `dist/client`. That causes 404s on `/manifesto`, `/workers`, etc.

---

## Environment variables

**Production — set exactly one optional var:**

| Name | Value | Required |
|------|-------|----------|
| `VITE_SITE_URL` | `https://www.bharatgig.live` | Optional (also in `vercel.json` + `.env.production`) |

**Do NOT add to this project:**

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Google Maps keys

Those belong on the worker app (`apps/worker`) only.

---

## Custom domains

In **Vercel → Project → Settings → Domains**, attach:

1. `www.bharatgig.live` (primary)
2. `bharatgig.live` (apex — auto-redirects to www via `vercel.json`)

### DNS (already propagated)

Current resolution (verified):

| Host | Points to |
|------|-----------|
| `bharatgig.live` | Vercel edge (`185.158.133.1`, `216.198.79.1`) |
| `www.bharatgig.live` | Vercel edge (`185.158.133.1`) |

If reconfiguring at registrar:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

---

## Deploy / redeploy

### Option A — Git push (recommended)

```bash
git add .
git commit -m "Deploy investor marketing site to bharatgig.live"
git push origin main
```

Vercel auto-deploys on push to connected branch.

### Option B — CLI prebuilt deploy

```powershell
cd apps/marketing
$env:VERCEL = "1"
npm run build
npx vercel deploy --prebuilt --prod
```

Requires `vercel login` or `VERCEL_TOKEN` env var.

### If routes still 404 after deploy

**Deployments → latest → ⋮ → Redeploy → Redeploy without Build Cache**

---

## Post-deploy verification

Run through this checklist on mobile (4G) and desktop:

- [ ] https://www.bharatgig.live — hero + command center loads
- [ ] https://bharatgig.live — redirects to www
- [ ] `/manifesto`, `/workers`, `/cities`, `/infrastructure`, `/future` — no 500/404
- [ ] `/robots.txt` — references `www.bharatgig.live`
- [ ] `/sitemap.xml` — all 6 routes listed
- [ ] View source — `<title>GigAI Bharat`
- [ ] LinkedIn Post Inspector — OG title + image render
- [ ] No Supabase keys in page source or Network tab

---

## Share URLs

| Audience | Link |
|----------|------|
| LinkedIn / public | https://www.bharatgig.live |
| Investors | https://www.bharatgig.live → investor CTA |
| Hiring | https://www.bharatgig.live/manifesto |
| GitHub | https://github.com/pachihumbi/gigai-bharat |
| Email | hello@bharatgig.live |

---

## Architecture decision log

| Decision | Rationale |
|----------|-----------|
| Nitro Vercel preset | TanStack Start SSR requires server functions; static `dist/client` breaks routing |
| `www` as canonical | Consistent OG URLs, cleaner cookie scope, standard startup practice |
| Zero secrets on marketing | Public site has no backend calls; reduces attack surface |
| Google Fonts CDN | Acceptable for launch; self-host fonts in v2 for India edge latency |
| HSTS header | Production-grade transport security for investor trust |

---

## Known issue on current live site

The domain currently serves an **older build** with broken SSR on sub-routes (`/manifesto` returns 500). Pushing this repo configuration and redeploying without cache resolves it — the Nitro adapter is configured in `vite.config.ts` and activates automatically when `VERCEL=1`.
