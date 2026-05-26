# Deployment

Production runbooks for **GigAI Bharat** (`bharatgig.live`). Copy-paste friendly for founders.

| Doc | Use when |
|-----|----------|
| [SPACESHIP_CHECKLIST.md](./SPACESHIP_CHECKLIST.md) | **Launch checklist** — DNS, SSL, deploy, smoke test |
| [SPACESHIP.md](./SPACESHIP.md) | **Spaceship hosting** — SSL, DNS, `.htaccess`, static deploy |
| [DNS_SETUP.md](./DNS_SETUP.md) | Legacy Vercel DNS (worker `app` subdomain only) |
| [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) | Pre-launch & post-deploy verification |
| [GITHUB_SETUP.md](./GITHUB_SETUP.md) | Branches, secrets, CI/CD |
| [VERCEL.md](./VERCEL.md) | Vercel project settings (marketing + worker) |
| [MONITORING.md](./MONITORING.md) | Analytics, Sentry, uptime |

**Live URLs**

| Surface | URL | Platform |
|---------|-----|----------|
| Marketing | https://www.bharatgig.live | Spaceship shared hosting (migrating from Vercel) |
| Worker app | https://app.bharatgig.live | Vercel (`gigai-bharat-worker`) |
| Backend | https://ykrdwmbbieccfftierzc.supabase.co | Supabase Cloud |

Quick deploy:

```powershell
git add .
git commit -m "chore: production launch"
git push origin main
```

Or manual: GitHub → Actions → **Deploy Production** → Run workflow → skip_cache: true
