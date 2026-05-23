# Production deployment status — GigAI Bharat

**Last updated:** 2026-05-23  
**GitHub main:** `eca6904` → https://github.com/pachihumbi/gigai-bharat

---

## Deployment status

| Surface | Custom domain | Production build | Status |
|---------|---------------|------------------|--------|
| Marketing | www.bharatgig.live | `gigai-bharat-5vd4iviyk` | **DNS misconfigured** — serving stale build |
| Marketing | bharatgig.live | same | **DNS misconfigured** |
| Worker | app.bharatgig.live | `gigai-bharat-worker-8q0jsz0b4` | **DNS misconfigured** — serving stale Lovable build |

### Live production URLs (working now)

| Surface | URL |
|---------|-----|
| Marketing (latest) | https://gigai-bharat-5vd4iviyk-pachihumbis-projects.vercel.app |
| Marketing `/join` | https://gigai-bharat-5vd4iviyk-pachihumbis-projects.vercel.app/join |
| Marketing `/manifesto` | https://gigai-bharat-5vd4iviyk-pachihumbis-projects.vercel.app/manifesto |
| Worker (latest) | https://gigai-bharat-worker-8q0jsz0b4-pachihumbis-projects.vercel.app |
| Worker `/auth` | https://gigai-bharat-worker-8q0jsz0b4-pachihumbis-projects.vercel.app/auth |

---

## Vercel projects

| Project | Root | Domains assigned |
|---------|------|------------------|
| `gigai-bharat` | `apps/marketing` (via prebuilt deploy) | `www.bharatgig.live`, `bharatgig.live` |
| `gigai-bharat-worker` | `apps/worker` | `app.bharatgig.live` |

Dashboard:
- https://vercel.com/pachihumbis-projects/gigai-bharat
- https://vercel.com/pachihumbis-projects/gigai-bharat-worker

---

## DNS fix required (name.com)

Current A records point to `185.158.133.1` (wrong). Update at **name.com** DNS:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |
| A | `www` | `76.76.21.21` |
| A | `app` | `76.76.21.21` |

**Or** switch nameservers to Vercel:
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

After DNS propagates (5–30 min), custom domains will serve the latest production deployments.

Verify:
```powershell
nslookup www.bharatgig.live
nslookup app.bharatgig.live
# Both should resolve to 76.76.21.21
```

---

## Route verification (latest builds)

| Route | Expected | Verified on deployment URL |
|-------|----------|----------------------------|
| `/` marketing | Investor signal section | ✅ |
| `/join` | Worker onboarding page | ✅ |
| `/manifesto` | Chapter content | ✅ |
| `/` worker | Splash + auth CTA | ✅ |
| `/auth` | Sign in | ✅ |
| `/onboarding` | Auth-gated | ✅ (SPA) |
| `/ledger` | Driver Ledger | ✅ (SPA, post-auth) |

---

## Redeploy without cache

```powershell
$env:VERCEL_TOKEN = "<from vercel.com/account/tokens>"
.\scripts\deploy-vercel.ps1 -Target all -SkipCache
```

Or Vercel Dashboard → Deployments → ⋮ → **Redeploy without Build Cache**

---

## Worker env vars (set on Vercel)

`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`, Google Maps keys — configured on `gigai-bharat-worker` project.
