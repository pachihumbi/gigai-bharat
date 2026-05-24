# Production deployment status — GigAI Bharat

**Verified:** 2026-05-24  
**Status:** ✅ Stable — GitHub → Vercel → Supabase  
**Branch:** `main` @ `f30cf0b`  
**Toolchain:** Cursor · GitHub · Vercel · Supabase only

---

## Live URLs (all ✅ 200)

| Surface | URL |
|---------|-----|
| Marketing | https://www.bharatgig.live |
| Apex redirect | https://bharatgig.live → www |
| Worker app | https://app.bharatgig.live |
| Auth | https://app.bharatgig.live/auth |
| OAuth callback | https://app.bharatgig.live/auth/callback |
| Dashboard | https://app.bharatgig.live/dashboard |
| Gurukul AI | https://www.bharatgig.live/gurukul · https://app.bharatgig.live/gurukul |

---

## Vercel projects

| Project | Domain | Deploy method |
|---------|--------|---------------|
| `gigai-bharat` | www.bharatgig.live | GitHub Actions prebuilt (Nitro SSR) |
| `gigai-bharat-worker` | app.bharatgig.live | GitHub Actions prebuilt (SPA) |

Push to `main` triggers `.github/workflows/deploy-production.yml`.

---

## Repository health

- ✅ Monorepo root is the single git root
- ✅ Broken nested `gigai-bharat` gitlink removed
- ✅ Worker + marketing builds pass with zero errors
- ✅ SPA rewrites configured (`vercel.json` + `config.json`)
- ✅ Supabase native OAuth (not Lovable broker)

---

## Architecture

See [PRODUCTION_ARCHITECTURE.md](./PRODUCTION_ARCHITECTURE.md)
