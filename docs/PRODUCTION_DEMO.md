# GigAI Bharat — Production Public Demo

**Last updated:** May 2026

## Live URLs

| Surface | URL | Purpose |
|---------|-----|---------|
| Marketing site | https://www.bharatgig.live | Investor cinematic landing |
| Worker super app | https://app.bharatgig.live | Installable PWA |
| Public demo | https://app.bharatgig.live/demo | No-auth investor demo workspace |
| GitHub | https://github.com/pachihumbi/gigai-bharat | Source |

## PWA install status

| Feature | Status |
|---------|--------|
| Web manifest | `apps/worker/public/manifest.webmanifest` |
| Service worker | Workbox injectManifest (`src/service-worker.ts`) |
| Offline page | `/offline.html` + `/offline` route |
| Install prompt | `InstallPrompt` + `InstallFloatingButton` |
| Push ready | `usePushNotifications.ts` (requires VAPID + server) |
| Android install | Chrome → Add to Home Screen / `beforeinstallprompt` |

**Verify:** Open app.bharatgig.live/demo on Android Chrome → Install banner or menu → Add to Home Screen.

## APK build steps

See [apps/worker/android/README.md](../apps/worker/android/README.md).

Quick path:

```bash
npm run build -w @gigai/worker
cd apps/worker
npx cap sync android
cd android && ./gradlew assembleDebug
```

## Lighthouse (target 90+)

Run locally after build:

```bash
npm run build -w @gigai/marketing
npm run preview -w @gigai/marketing
# In another terminal:
npx lighthouse http://localhost:4173 --only-categories=performance,accessibility,best-practices,seo --view
```

Worker app:

```bash
npm run build -w @gigai/worker
npm run preview -w @gigai/worker
npx lighthouse http://localhost:4173 --preset=desktop --view
```

**Optimizations applied:** lazy routes, code splitting (vendor/supabase/charts), `gpu-lite` sections, reduced motion hook, content-visibility on marketing sections, PWA precache.

## Architecture summary

```
www.bharatgig.live     → @gigai/marketing (TanStack Start + Vercel)
app.bharatgig.live     → @gigai/worker (React PWA + Capacitor android/)
supabase               → Auth, RLS, Edge Functions
```

**Worker OS modules:** GigPay, GigEV, Dispatch/AI, Ledger, Gurukul, Co-Living, ShramSetu, Insurance, Community, Leaderboard, Dignity, Credit, OCR.

## Screenshots (capture checklist)

1. Marketing hero — www.bharatgig.live (mobile 390×844)
2. Live demo tabs — #live-demo section
3. Investor section — #investors with ROI slider
4. Worker dashboard — app.bharatgig.live/demo
5. GigPay wallet — /gigpay
6. EV command — /ev-command
7. PWA install prompt — Chrome Android
8. Bottom nav + More sheet

## Deployment checklist

- [ ] `npm run build` passes (all workspaces)
- [ ] Vercel env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` on worker project
- [ ] `VITE_ALLOW_INVESTOR_DEMO=true` for public demo (optional; production host enables demo)
- [ ] Supabase Auth redirect: `https://app.bharatgig.live/auth/callback`
- [ ] Marketing `VITE_SITE_URL=https://www.bharatgig.live`
- [ ] Deploy marketing + worker projects on Vercel
- [ ] Test `/demo` → dashboard without login
- [ ] Test PWA install on Android Chrome
- [ ] Run Lighthouse on production URLs
- [ ] Capacitor `npx cap sync android` before APK release

## Environment

Copy `.env.example` → `.env.local` at repo root. Required for full auth:

- `VITE_SUPABASE_URL` (https://*.supabase.co)
- `VITE_SUPABASE_PUBLISHABLE_KEY` (valid anon key, not placeholder)

Public demo works without valid Supabase keys on production hosts and `/demo`.
