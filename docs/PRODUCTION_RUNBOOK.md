# GigAI Bharat — Production Runbook (Final)

**Domain:** bharatgig.live · **Canonical:** https://www.bharatgig.live  
**Marketing Vercel project:** `gigai-bharat-marketing` · **Worker:** `gigai-bharat-worker`  
**Stack:** TanStack Start + Nitro (SSR) · Resend · Cloudflare DNS/Email/Turnstile

---

## Architecture

```mermaid
flowchart TB
  subgraph users [Users]
    WEB[Browser / Mobile]
  end

  subgraph cloudflare [Cloudflare]
    DNS[DNS + SSL]
    MX[Email Routing MX]
    TS[Turnstile CAPTCHA]
  end

  subgraph vercel [Vercel Pro]
    WWW[www.bharatgig.live<br/>gigai-bharat-marketing]
    APP[app.bharatgig.live<br/>gigai-bharat-worker]
    API["/api/contact<br/>/api/health"]
  end

  subgraph email [Email]
    RESEND[Resend API]
    NOREPLY[no-reply@bharatgig.live]
    INBOX[support@ investors@ careers@ partnerships@]
    GMAIL[Founder Gmail via routing]
  end

  WEB --> DNS
  DNS --> WWW
  DNS --> APP
  WEB --> API
  API --> TS
  API --> RESEND
  RESEND --> NOREPLY
  RESEND --> INBOX
  MX --> GMAIL
  INBOX --> GMAIL
```

---

## Phase 1 — Resend + email (execute in order)

### 1.1 Resend dashboard

1. Go to [resend.com/domains](https://resend.com/domains) → **Add Domain** → `bharatgig.live`
2. **API Keys** → Create → name `gigai-bharat-production` → copy key (`re_...`)
3. After DNS verification → status **Verified**

### 1.2 Exact DNS records (Cloudflare → DNS)

**Website (Vercel):**

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `@` | `76.76.21.21` | DNS only (grey) |
| CNAME | `www` | `cname.vercel-dns.com` | DNS only |
| CNAME | `app` | `cname.vercel-dns.com` | DNS only |

**Inbound email (Cloudflare Email Routing — auto-added when enabled):**

| Type | Name | Priority | Content |
|------|------|----------|---------|
| MX | `@` | 1 | `route1.mx.cloudflare.net` |
| MX | `@` | 2 | `route2.mx.cloudflare.net` |
| MX | `@` | 3 | `route3.mx.cloudflare.net` |

**Outbound + auth (single merged SPF — one TXT on `@`):**

Google Workspace + Resend (current live DNS pattern):

| Type | Name | Content |
|------|------|---------|
| TXT | `@` | `v=spf1 include:_spf.google.com include:amazonses.com ~all` |

Cloudflare Email Routing + Resend (alternative):

| Type | Name | Content |
|------|------|---------|
| TXT | `@` | `v=spf1 include:_spf.mx.cloudflare.net include:amazonses.com ~all` |

**DKIM (copy exact values from Resend dashboard after adding domain):**

| Type | Name | Content |
|------|------|---------|
| TXT or CNAME | `resend._domainkey` | *(Resend provides)* |
| TXT or CNAME | `resend2._domainkey` | *(Resend provides)* |
| TXT or CNAME | `resend3._domainkey` | *(Resend provides)* |

**DMARC:**

| Type | Name | Content |
|------|------|---------|
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:legal@bharatgig.live; pct=100; adkim=s; aspf=s` |

### 1.3 Inbound mail routing

**Option A — Google Workspace (detected on live DNS):**

Create users or aliases in Google Admin → `support@`, `investors@`, `careers@`, `partnerships@`, `hello@`, `founder@`, `press@`, `legal@`.

MX (Google defaults):

| Type | Name | Priority | Content |
|------|------|----------|---------|
| MX | `@` | 1 | `ASPMX.L.GOOGLE.COM` |
| MX | `@` | 5 | `ALT1.ASPMX.L.GOOGLE.COM` |
| MX | `@` | 5 | `ALT2.ASPMX.L.GOOGLE.COM` |
| MX | `@` | 10 | `ALT3.ASPMX.L.GOOGLE.COM` |
| MX | `@` | 10 | `ALT4.ASPMX.L.GOOGLE.COM` |

**Option B — Cloudflare Email Routing (free forwarding):**

| Alias | Action |
|-------|--------|
| hello@bharatgig.live | Forward → your Gmail |
| support@bharatgig.live | Forward → your Gmail |
| investors@bharatgig.live | Forward → your Gmail |
| founder@bharatgig.live | Forward → your Gmail |
| careers@bharatgig.live | Forward → your Gmail |
| partnerships@bharatgig.live | Forward → your Gmail |
| press@bharatgig.live | Forward → your Gmail |
| legal@bharatgig.live | Forward → your Gmail |
| no-reply@bharatgig.live | Drop / no forward (outbound only) |

### 1.4 Form → inbox routing (code — already deployed)

| Form `type` | Delivers to |
|-------------|-------------|
| `contact` | support@bharatgig.live |
| `investor` | investors@bharatgig.live |
| `partnership` | partnerships@bharatgig.live |
| `careers` | careers@bharatgig.live |
| `press` | press@bharatgig.live |

Auto-reply from: `no-reply@bharatgig.live` · Hidden BCC: `CONTACT_ADMIN_NOTIFY` env var

---

## Phase 2 — Vercel Pro settings

### Marketing project (`gigai-bharat-marketing`)

| Setting | Value |
|---------|-------|
| Root Directory | `apps/marketing` |
| Framework Preset | Other |
| Node.js | 20.x |
| Install Command | `cd ../.. && npm install` |
| Build Command | `cd ../.. && npm run build -w @gigai/marketing` |
| Output Directory | *(empty)* |
| Fluid Compute | On (default) |

**Domains:** `www.bharatgig.live` (primary), `bharatgig.live` (apex → www redirect in vercel.json)

**Analytics:** Dashboard → Analytics → Enable  
**Speed Insights:** Dashboard → Speed Insights → Enable (already in code via `@vercel/speed-insights`)

### Environment variables (Production + Preview)

```bash
# Required — production
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
VITE_SITE_URL=https://www.bharatgig.live
EMAIL_FROM=GigAI Bharat <no-reply@bharatgig.live>

# Recommended — bot protection
TURNSTILE_SECRET_KEY=0x4AAAAAAA...
VITE_TURNSTILE_SITE_KEY=0x4AAAAAAA...

# Optional — hidden admin copy
CONTACT_ADMIN_NOTIFY=your-private@gmail.com
```

**Preview env:** same except `VITE_SITE_URL` can be preview URL; use Resend test key or same key with rate limits.

### Terminal — push env via Vercel CLI

```powershell
cd "c:\Users\TEMP.DELL\Desktop\Documents → GigAI\apps\marketing"
npx vercel login
npx vercel link   # select gigai-bharat-marketing

npx vercel env add RESEND_API_KEY production
npx vercel env add EMAIL_FROM production
npx vercel env add VITE_SITE_URL production
npx vercel env add TURNSTILE_SECRET_KEY production
npx vercel env add VITE_TURNSTILE_SITE_KEY production preview production
npx vercel env add CONTACT_ADMIN_NOTIFY production
```

---

## Phase 3 — DNS + SSL (Cloudflare)

| Setting | Value |
|---------|-------|
| SSL/TLS mode | **Full (strict)** |
| Always Use HTTPS | On |
| Automatic HTTPS Rewrites | On |
| Minimum TLS | 1.2 |
| HSTS | On (Vercel also sends HSTS header) |
| Proxy (orange cloud) | Optional for www/app after Vercel cert active |

**Verify SSL:**

```powershell
curl -I https://www.bharatgig.live
curl -I https://bharatgig.live
curl -I https://app.bharatgig.live
```

Expected: `HTTP/2 200` or `301` → www with valid cert.

**Verify apex → www:**

```powershell
curl -sI https://bharatgig.live | Select-String location
# location: https://www.bharatgig.live/
```

---

## Phase 4 — Deploy commands

```powershell
cd "c:\Users\TEMP.DELL\Desktop\Documents → GigAI"

# Local verify
$env:VERCEL = "1"
npm run build -w @gigai/marketing
npm run lint -w @gigai/marketing

# DNS email auth
npm run verify:email-dns

# Production deploy (Git — recommended)
git add .
git commit -m "Production: email + contact + Vercel Pro finalization"
git push origin main

# Or CLI prebuilt
cd apps/marketing
$env:VERCEL = "1"
npm run build
npx vercel deploy --prebuilt --prod
```

**After deploy — redeploy without cache if routes 404:**

Vercel → Deployments → ⋮ → Redeploy → **without Build Cache**

---

## Phase 5 — Testing commands

```powershell
# Full URL smoke test (www + app + contact + API)
npm run health:production

# API security smoke (honeypot, timing, headers)
npm run test:contact-api

# Live email send test (after RESEND on Vercel)
$env:CONTACT_TEST_EMAIL = "your@gmail.com"
node scripts/test-contact-api.mjs --send

# DNS SPF/DKIM/DMARC/MX + Resend domain status
$env:RESEND_API_KEY = "re_..."
npm run verify:email-dns
```

**Gmail deliverability:** Send form from `/contact` → open in Gmail → **Show original** → confirm:

```
spf=pass
dkim=pass
dmarc=pass
```

**Lighthouse (local):**

```powershell
npx lighthouse https://www.bharatgig.live --only-categories=performance,accessibility,best-practices,seo --view
```

---

## Phase 6 — GitHub secrets (Actions)

Repository → Settings → Secrets → Actions:

| Secret | Value |
|--------|-------|
| `VERCEL_TOKEN` | Vercel → Settings → Tokens |
| `VERCEL_ORG_ID` | `team_xxx` from Vercel |
| `VERCEL_MARKETING_PROJECT_ID` | `prj_8pk8D5inKD9wCnvmYG7bWklO6b55` |
| `VERCEL_WORKER_PROJECT_ID` | `prj_td8bpmue2FlTHOqrZ1RkAfU7PAUY` |
| `VITE_SUPABASE_URL` | Worker build |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Worker build |

Workflows: `.github/workflows/ci.yml` · `deploy-production.yml` · `validate-production.yml` (every 6h)

---

## Phase 7 — Production checklist

### DNS & SSL
- [ ] `@` A → `76.76.21.21`
- [ ] `www` CNAME → `cname.vercel-dns.com`
- [ ] `app` CNAME → `cname.vercel-dns.com`
- [ ] Apex redirects to www (301)
- [ ] Cloudflare SSL Full (strict)
- [ ] No mixed content in browser console

### Email
- [ ] Resend domain **Verified**
- [ ] SPF single TXT with Cloudflare + amazonses.com
- [ ] DKIM ×3 from Resend
- [ ] DMARC `_dmarc` TXT
- [ ] MX Cloudflare routing active
- [ ] All aliases forward to founder inbox
- [ ] `RESEND_API_KEY` in Vercel production
- [ ] Test form → support@ + auto-reply from no-reply@
- [ ] Gmail: SPF/DKIM/DMARC PASS

### Vercel
- [ ] www on marketing project only
- [ ] app on worker project only
- [ ] Output Directory empty (marketing)
- [ ] Node 20.x
- [ ] Analytics + Speed Insights enabled
- [ ] All env vars set

### Site
- [ ] `/contact` forms submit successfully
- [ ] `/api/health` returns `{ ok: true }`
- [ ] `/press` · `/privacy` live
- [ ] sitemap.xml includes contact routes
- [ ] robots.txt points to sitemap
- [ ] OG/Twitter cards on view-source
- [ ] Turnstile widget on forms (if keys set)

### CI/CD
- [ ] `npm run health:production` passes
- [ ] `npm run test:contact-api` passes
- [ ] GitHub deploy workflow green

---

## API reference

**GET `/api/health`**

```json
{
  "ok": true,
  "service": "gigai-bharat-marketing",
  "domain": "bharatgig.live",
  "email": { "resend": true, "turnstile": true }
}
```

**POST `/api/contact`** — see [EMAIL_SETUP.md](./EMAIL_SETUP.md)

---

## Related docs

- [BHARATGIG_LIVE.md](./BHARATGIG_LIVE.md) — marketing deploy
- [EMAIL_SETUP.md](./EMAIL_SETUP.md) — email troubleshooting
- [../deployment/DNS_SETUP.md](../deployment/DNS_SETUP.md) — DNS deep dive
