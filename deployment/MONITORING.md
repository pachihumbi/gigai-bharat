# Monitoring & Analytics

## Vercel Analytics (recommended — zero code config)

1. Vercel Dashboard → each project → **Analytics** → Enable.
2. Code integration (already wired): `@vercel/analytics` + `@vercel/speed-insights` in marketing & worker.
3. View traffic in Vercel → Analytics tab.

## Sentry (optional — errors)

1. Create project at [sentry.io](https://sentry.io) → React.
2. Add to **worker** Vercel env:

```
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

3. Marketing: only add if you need SSR error tracking (usually skip for public site).

## Uptime alerts (free tier)

**UptimeRobot** (or Better Stack):

| Monitor | URL | Interval |
|---------|-----|----------|
| Marketing home | https://www.bharatgig.live | 5 min |
| Worker demo | https://app.bharatgig.live/demo | 5 min |
| Manifesto | https://www.bharatgig.live/manifesto | 15 min |

Alert via email/SMS to founder phone.

## Supabase

Dashboard → Logs → API, Auth, Edge Functions. Set log drain later (Datadog) when scaling.

## GitHub

- **Validate Production** workflow runs every 6 hours.
- Failed run → email from GitHub notifications.

## Health script (local)

```powershell
npm run health:production
```

Writes `scripts/production-health-report.json`.
