# Deployment

Production runbooks for **GigAI Bharat** (`bharatgig.live`). Copy-paste friendly for founders.

| Doc | Use when |
|-----|----------|
| [DNS_SETUP.md](./DNS_SETUP.md) | Custom domain broken, SSL pending, www vs apex |
| [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) | Pre-launch & post-deploy verification |
| [GITHUB_SETUP.md](./GITHUB_SETUP.md) | Branches, secrets, CI/CD |
| [VERCEL.md](./VERCEL.md) | Vercel project settings (marketing + worker) |
| [MONITORING.md](./MONITORING.md) | Analytics, Sentry, uptime |

**Live URLs**

| Surface | URL | Platform |
|---------|-----|----------|
| Marketing | https://www.bharatgig.live | Vercel (`gigai-bharat`) |
| Worker app | https://app.bharatgig.live | Vercel (`gigai-bharat-worker`) |
| Backend | https://jsdmmskzwnqhmxboergf.supabase.co | Supabase Cloud |

Quick deploy:

```powershell
git add .
git commit -m "chore: production launch"
git push origin main
```

Or manual: GitHub → Actions → **Deploy Production** → Run workflow → skip_cache: true
