# Production Checklist — Founder Launch

Print this. Check boxes in order.

## A. GitHub (one-time)

- [ ] Repo public or private per strategy: `github.com/pachihumbi/gigai-bharat`
- [ ] Default branch: `main`
- [ ] Branch protection on `main` (require PR + CI pass)
- [ ] Secrets added (see [GITHUB_SETUP.md](./GITHUB_SETUP.md))
- [ ] `LICENSE`, `README.md`, `CONTRIBUTING.md` present

## B. Vercel projects

- [ ] **gigai-bharat** — root `apps/marketing`, output dir **empty**
- [ ] **gigai-bharat-worker** — root `apps/worker`, output `dist`
- [ ] Marketing env: `VITE_SITE_URL=https://www.bharatgig.live` (optional)
- [ ] Worker env: Supabase + Google Maps keys (see `.env.example`)
- [ ] **No** Supabase keys on marketing project

## C. DNS (Cloudflare)

- [ ] A `@` → `76.76.21.21`
- [ ] CNAME `www` → `cname.vercel-dns.com`
- [ ] CNAME `app` → `cname.vercel-dns.com`
- [ ] `www` on marketing project only
- [ ] `app` on worker project only
- [ ] SSL active on all three hostnames

## D. Supabase

- [ ] Auth redirect: `https://app.bharatgig.live/auth/callback`
- [ ] Site URL: `https://app.bharatgig.live`
- [ ] Edge Function secrets set (`LOVABLE_API_KEY`)
- [ ] RLS enabled on all worker tables

## E. Deploy

```powershell
cd "C:\Users\TEMP.DELL\Desktop\Documents → GigAI"
git checkout main
git pull origin main
git push origin main
```

Or: GitHub Actions → **Deploy Production** → Run → skip cache **true**

## F. Smoke test (5 min)

```powershell
npm run health:production
```

Manual:

- [ ] https://www.bharatgig.live — hero loads
- [ ] https://bharatgig.live — redirects to www
- [ ] `/manifesto`, `/workers`, `/investors`, `/gurukul` — HTTP 200
- [ ] https://app.bharatgig.live/demo — demo loads (no login)
- [ ] https://app.bharatgig.live/auth — auth page
- [ ] View source — no `supabase` keys on www
- [ ] `/robots.txt`, `/sitemap.xml` — correct domain
- [ ] LinkedIn Post Inspector — OG image renders

## G. Observability

- [ ] Vercel Analytics enabled (project dashboard)
- [ ] `VITE_SENTRY_DSN` set on worker if using Sentry
- [ ] UptimeRobot or Better Stack ping on www + app (see [MONITORING.md](./MONITORING.md))

## H. Investor-ready

- [ ] README live link works
- [ ] `hello@bharatgig.live` forwards to your inbox
- [ ] GitHub CI badge green
- [ ] Tag release: `git tag -a v0.1.0-launch -m "Founder launch" && git push origin v0.1.0-launch`

**You are done when sections A–G are checked and F passes.**
