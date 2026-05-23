# Production deployment status — GigAI Bharat

**Verified:** 2026-05-23 (post DNS migration)  
**GitHub main:** https://github.com/pachihumbi/gigai-bharat

---

## Executive summary

| Item | Status |
|------|--------|
| Vercel marketing production build | ✅ READY (`gigai-bharat-39aznacha`) |
| Vercel worker production build | ✅ READY (`gigai-bharat-worker-2p1pks05e`) |
| SSL certificates | ⚠️ Issuance blocked — DNS still misconfigured |
| Custom domains serving latest code | ❌ Split traffic to old Lovable + new Vercel |
| `.vercel.app` production URLs | ✅ All routes pass |

---

## DNS (action required)

Vercel reports **misconfigured** — stale A record still present:

| Host | Current A records | Required |
|------|-------------------|----------|
| `www.bharatgig.live` | `185.158.133.1`, `76.76.21.21` | **`76.76.21.21` only** |
| `app.bharatgig.live` | `185.158.133.1`, `76.76.21.21` | **`76.76.21.21` only** |
| `bharatgig.live` | `185.158.133.1`, `216.198.79.1`, `76.76.21.21` | **`76.76.21.21` only** |

**Remove `185.158.133.1` and `216.198.79.1` at name.com.**  
Until removed, custom domains intermittently serve old Lovable builds (500 / 404 / stale content).

---

## Vercel projects

| Project | Domain | Production deployment | State |
|---------|--------|----------------------|-------|
| `gigai-bharat` | `www.bharatgig.live`, `bharatgig.live` | `gigai-bharat-39aznacha` | READY |
| `gigai-bharat-worker` | `app.bharatgig.live` | `gigai-bharat-worker-2p1pks05e` | READY |

Dashboard:
- https://vercel.com/pachihumbis-projects/gigai-bharat
- https://vercel.com/pachihumbis-projects/gigai-bharat-worker

---

## Route verification

### Marketing — `gigai-bharat.vercel.app` (latest build)

| Route | Status |
|-------|--------|
| `/` | ✅ 200 — investor section, demo flow |
| `/join` | ✅ 200 |
| `/hiring` | ✅ 200 |
| `/manifesto` | ✅ 200 |
| `/workers` | ✅ 200 |
| `/cities` | ✅ 200 |
| `/infrastructure` | ✅ 200 |
| `/future` | ✅ 200 |
| `/robots.txt` | ✅ 200 |
| `/sitemap.xml` | ✅ 200 |

### Marketing — `www.bharatgig.live` (custom domain)

| Route | Status |
|-------|--------|
| `/` | ⚠️ 200 — **old build** (no investor section) |
| `/join` | ❌ 500 / 404 |
| `/manifesto` | ⚠️ 200 — **old Lovable build** |
| `/infrastructure` | ❌ 500 |

### Worker — `gigai-bharat-worker.vercel.app` (latest build)

| Route | Status |
|-------|--------|
| `/` | ✅ 200 |
| `/auth` | ✅ 200 |
| `/onboarding` | ✅ 200 (SPA) |
| `/dashboard` | ✅ 200 (SPA) |
| `/ledger` | ✅ 200 (SPA) |
| `/ocr` | ✅ 200 (SPA) |
| `/gigpay` | ✅ 200 (SPA) |
| `/map` | ✅ 200 (SPA) |

### Worker — `app.bharatgig.live` (custom domain)

| Route | Status |
|-------|--------|
| `/` | ⚠️ 200 — **old Lovable build** |
| `/auth` | ⚠️ 200 — **old Lovable build** |
| `/ledger` | ⚠️ 200 — **old Lovable build** (no Driver Ledger) |

---

## Public URLs

### Working now (latest production)

| Surface | URL |
|---------|-----|
| Marketing | https://gigai-bharat.vercel.app |
| Worker app | https://gigai-bharat-worker.vercel.app |

### After DNS cleanup (single A → `76.76.21.21`)

| Surface | URL |
|---------|-----|
| Marketing | https://www.bharatgig.live |
| Worker app | https://app.bharatgig.live |

---

## Fixes applied this session

1. Redeployed marketing — previous production was **ERROR** (git auto-build failure)
2. Redeployed worker prebuilt with latest Worker OS bundle
3. Set Vercel project root directories via API (`apps/marketing`, `apps/worker`)
4. Confirmed all routes on `.vercel.app` aliases

---

## Post-DNS verification command

After removing stale A records, re-run:

```powershell
nslookup www.bharatgig.live   # should show 76.76.21.21 only
nslookup app.bharatgig.live   # should show 76.76.21.21 only
curl -I https://www.bharatgig.live/join   # expect 200
curl -I https://app.bharatgig.live/auth   # expect 200, no Lovable badge
```
