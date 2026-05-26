# Marketing deploy target

**Production:** Spaceship shared hosting (`www.bharatgig.live`)

- Build: `DEPLOY_TARGET=spaceship npm run build:spaceship -w @gigai/marketing`
- Bundle: `npm run deploy:spaceship` (from repo root)
- Routing / SSL / redirects: `deployment/spaceship/public/.htaccess`
- Contact API: `deployment/spaceship/api/contact.php`

Former Vercel config archived at `deployment/archive/marketing.vercel.json`.

Worker app remains on Vercel: `app.bharatgig.live` → `apps/worker/vercel.json`
