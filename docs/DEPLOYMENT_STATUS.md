# Production deployment status — GigAI Bharat

**Verified:** 2026-05-23 (DNS cleanup complete)  
**Status:** ✅ FULLY OPERATIONAL

---

## Live URLs

| Surface | URL | Status |
|---------|-----|--------|
| Marketing | https://www.bharatgig.live | ✅ 200 |
| Apex redirect | https://bharatgig.live → www | ✅ 200 |
| Worker app | https://app.bharatgig.live | ✅ 200 |

---

## Vercel production deployments

| Project | Production deployment | State |
|---------|----------------------|-------|
| `gigai-bharat` | `gigai-bharat-opofz01wp` | READY |
| `gigai-bharat-worker` | `gigai-bharat-worker-phm7cnfcs` | READY |

Dashboard:
- https://vercel.com/pachihumbis-projects/gigai-bharat
- https://vercel.com/pachihumbis-projects/gigai-bharat-worker

---

## DNS & SSL

| Host | Resolves to | Vercel configured | SSL |
|------|-------------|-------------------|-----|
| `www.bharatgig.live` | `76.76.21.21` | ✅ | ✅ HSTS active |
| `app.bharatgig.live` | `76.76.21.21` | ✅ | ✅ HSTS active |
| `bharatgig.live` | `76.76.21.21` | ✅ | ✅ |

---

## Route verification — www.bharatgig.live

| Route | Status | Notes |
|-------|--------|-------|
| `/` | ✅ 200 | Investor section, demo flow, command center |
| `/join` | ✅ 200 | Worker onboarding |
| `/hiring` | ✅ 200 | Careers page |
| `/manifesto` | ✅ 200 | Chapter 01 |
| `/workers` | ✅ 200 | Chapter 02 |
| `/cities` | ✅ 200 | Chapter 03 |
| `/infrastructure` | ✅ 200 | Command center |
| `/future` | ✅ 200 | Chapter 05 |
| `/robots.txt` | ✅ 200 | |
| `/sitemap.xml` | ✅ 200 | |

No Lovable routes. No 404/500.

---

## Route verification — app.bharatgig.live

| Route | Status | Notes |
|-------|--------|-------|
| `/` | ✅ 200 | Splash |
| `/auth` | ✅ 200 | Sign in / sign up |
| `/onboarding` | ✅ 200 | SPA rewrite |
| `/dashboard` | ✅ 200 | SPA rewrite |
| `/ledger` | ✅ 200 | Driver Ledger |
| `/ocr` | ✅ 200 | OCR upload |
| `/gigpay` | ✅ 200 | GigPay wallet |
| `/map` | ✅ 200 | Map view |

Bundle: `index-BDlfOalT.js` (Worker OS prototype). No Lovable badge.

---

## Fixes applied

1. Re-attached custom domains to Vercel projects (were detached → `DEPLOYMENT_NOT_FOUND`)
2. Redeployed marketing prebuilt to `gigai-bharat` (linked project correctly)
3. Redeployed worker prebuilt with SPA routing to `gigai-bharat-worker`
4. Cleared doubled `rootDirectory` path causing deploy failures
5. Cache-free deploy (`--force`) on both projects

---

## Redeploy command

```powershell
$env:VERCEL_TOKEN = "<token>"
.\scripts\deploy-vercel.ps1 -Target all -SkipCache
```

Or link + prebuilt deploy from each app folder per `docs/DEPLOY_APP_BHARATGIG.md`.
