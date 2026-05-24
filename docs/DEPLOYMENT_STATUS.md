# Production deployment status — GigAI Bharat

**Verified:** 2026-05-24  
**Status:** ⚠️ Worker stable · Marketing subroutes need redeploy  
**Branch:** `main`  
**Toolchain:** Cursor · GitHub · Vercel · Supabase only

---

## Live URLs

| URL | Status |
|-----|--------|
| https://www.bharatgig.live | ✅ 200 |
| https://bharatgig.live | ✅ 200 (→ www) |
| https://app.bharatgig.live | ✅ 200 |
| https://app.bharatgig.live/auth | ✅ 200 |
| https://app.bharatgig.live/dashboard | ✅ 200 |
| https://www.bharatgig.live/investors | ❌ 404 — redeploy needed |
| https://www.bharatgig.live/gurukul | ❌ 404 — redeploy needed |

---

## Blocker: refresh Vercel token

GitHub Actions **Deploy Production** failed because `VERCEL_TOKEN` is invalid/expired.

**Fix:** Update secret per [GITHUB_SECRETS.md](./GITHUB_SECRETS.md), then re-run **Deploy Production** workflow.

---

## Architecture

See [PRODUCTION_ARCHITECTURE.md](./PRODUCTION_ARCHITECTURE.md)
