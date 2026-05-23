# app.bharatgig.live — Worker app production deployment

**Live URL:** https://app.bharatgig.live  
**Monorepo path:** `apps/worker`  
**Stack:** Vite SPA + React Router + Supabase

---

## Vercel project settings (exact values)

Create a **separate** Vercel project from the marketing site:

| Setting | Value |
|---------|-------|
| **Repository** | `pachihumbi/gigai-bharat` |
| **Framework Preset** | Vite |
| **Root Directory** | `apps/worker` |
| **Install Command** | `cd ../.. && npm install` |
| **Build Command** | `cd ../.. && npm run build -w @gigai/worker` |
| **Output Directory** | `dist` |

---

## Environment variables (Production)

Set in **Vercel → Worker Project → Settings → Environment Variables**:

| Name | Required |
|------|----------|
| `VITE_SUPABASE_URL` | Yes |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes |
| `VITE_SUPABASE_PROJECT_ID` | Yes |
| `VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY` | For map routes |
| `VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID` | For map routes |

Copy values from local `apps/worker/.env.local`. Never commit them.

---

## Custom domain

1. **Vercel → Worker Project → Settings → Domains**
2. Add `app.bharatgig.live`
3. DNS at registrar:

| Type | Name | Value |
|------|------|-------|
| CNAME | `app` | `cname.vercel-dns.com` |

Current DNS (verified): `app.bharatgig.live` → `185.158.133.1` (Vercel edge)

---

## Deploy / redeploy

### Git push (recommended)

```powershell
git push origin main
```

Vercel auto-deploys when the worker project is connected to `main`.

### Redeploy without build cache

**Deployments → latest → ⋮ → Redeploy → Redeploy without Build Cache**

### CLI (requires `VERCEL_TOKEN`)

```powershell
cd apps/worker
npm run build
npx vercel deploy --prod --force
```

---

## Post-deploy verification

- [ ] https://app.bharatgig.live — splash loads
- [ ] https://app.bharatgig.live/auth — sign-in page
- [ ] https://app.bharatgig.live/onboarding — redirects to auth if logged out
- [ ] https://app.bharatgig.live/ledger — auth-gated (after login)
- [ ] Language switcher EN / KN / HI in app shell
- [ ] Mobile viewport 360px — bottom nav usable

---

## Routes (SPA)

All client routes rewrite to `index.html` via `vercel.json`:

`/`, `/auth`, `/onboarding`, `/dashboard`, `/ledger`, `/ocr`, `/gigpay`, `/map`, `/hub`, `/heatmap`, `/welfare`, `/pitch`
