# Production deployment status — GigAI Bharat

**Updated:** 2026-05-24  
**Commit:** pending push  
**Toolchain:** GitHub → Vercel (git build + Actions prebuilt) · Supabase

---

## Production URLs

| URL | Target |
|-----|--------|
| https://www.bharatgig.live | Marketing homepage + SSR routes |
| https://bharatgig.live | Redirect → www |
| https://app.bharatgig.live | Worker SPA |

---

## Fixes in this release

- Marketing `vercel.json`: explicit `VERCEL=1` for Nitro SSR (fixes subroute 404s)
- Removed broken root `vercel.json` (Unix-only worker copy script)
- Removed Lovable OAuth (`@lovable.dev/cloud-auth-js`) — Supabase OAuth only
- Removed `build:cloudflare` and deprecated Wrangler config
- Deploy workflow: secret validation with clear error messages

---

## If GitHub Actions deploy fails

Update `VERCEL_TOKEN` in GitHub Secrets → re-run **Deploy Production**.  
See [GITHUB_SECRETS.md](./GITHUB_SECRETS.md)

Vercel **git integration** also auto-builds on push when project root is `apps/marketing` / `apps/worker`.
