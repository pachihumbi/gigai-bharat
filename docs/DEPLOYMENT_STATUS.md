# Production deployment status — GigAI Bharat

**Last verified:** 2026-05-23  
**Repo:** https://github.com/pachihumbi/gigai-bharat  
**Latest commit:** see `git log -1`

---

## Public URLs

| Surface | URL | Project root |
|---------|-----|--------------|
| Marketing | https://www.bharatgig.live | `apps/marketing` |
| Apex redirect | https://bharatgig.live → www | same project |
| Worker app | https://app.bharatgig.live | `apps/worker` |

---

## DNS (verified)

| Host | Record | Resolves to |
|------|--------|-------------|
| `www.bharatgig.live` | A | `185.158.133.1` |
| `bharatgig.live` | A | `185.158.133.1`, `216.198.79.1` |
| `app.bharatgig.live` | A | `185.158.133.1` |

Expected CNAME: `app` → `cname.vercel-dns.com` (or Vercel A record via proxy)

---

## Vercel projects (two required)

| Project | Root Directory | Domain |
|---------|----------------|--------|
| Marketing | `apps/marketing` | `www.bharatgig.live` |
| Worker | `apps/worker` | `app.bharatgig.live` |

Runbooks: [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md), [DEPLOY_APP_BHARATGIG.md](./DEPLOY_APP_BHARATGIG.md), [BHARATGIG_LIVE.md](./BHARATGIG_LIVE.md)

---

## Route verification checklist

| Route | Expected |
|-------|----------|
| https://www.bharatgig.live | 200 — hero + investor sections |
| https://www.bharatgig.live/manifesto | 200 — chapter content |
| https://www.bharatgig.live/join | 200 — worker onboarding CTA |
| https://app.bharatgig.live | 200 — splash |
| https://app.bharatgig.live/auth | 200 — sign in |
| https://app.bharatgig.live/onboarding | 302/200 — auth gate |

---

## Redeploy without cache

**Vercel Dashboard:** Deployments → ⋮ → Redeploy → **Redeploy without Build Cache**

**CLI:** `.\scripts\deploy-vercel.ps1 -Target all -SkipCache` (requires `VERCEL_TOKEN`)

**GitHub Actions:** Actions → Deploy Production → Run workflow (requires repo secrets)
