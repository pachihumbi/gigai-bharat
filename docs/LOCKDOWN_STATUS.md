# FINAL LOCKDOWN STATUS — GigAI Bharat

**Generated:** 2026-05-25 · **Live:** https://www.bharatgig.live

---

## Validation report (automated)

| Check | Status |
|-------|--------|
| `npm run health:production` | **16/16 GREEN** |
| `scripts/test-contact-api.mjs` | **5/5 GREEN** |
| `scripts/verify-email-dns.mjs` | **3/6 RED** (SPF + 2 DKIM) |
| `/api/health` → `resend` | **false** (key not in Vercel) |
| Vercel Web Analytics | **Enabled** |
| Vercel Speed Insights | **Enabled** |
| CSP + HSTS headers | **Live** |
| OG / Twitter / manifest | **Verified** |

---

## BLOCKER — you must run this once (2 min)

No `RESEND_API_KEY` exists in Vercel or repo (correct — never commit keys).

```powershell
cd "c:\Users\TEMP.DELL\Desktop\Documents → GigAI"
$env:RESEND_API_KEY = "re_PASTE_FROM_resend.com"
$env:TURNSTILE_SECRET_KEY = "PASTE_FROM_cloudflare_turnstile"   # optional
$env:VITE_TURNSTILE_SITE_KEY = "PASTE_FROM_cloudflare_turnstile"
.\scripts\lockdown-production.ps1
```

This sets env on **Production + Preview + Development**, redeploys, and re-runs all validators.

After Resend key is set, test live send:

```powershell
$env:CONTACT_TEST_EMAIL = "your@gmail.com"
node scripts/test-contact-api.mjs --send
```

Forms return **503** until `RESEND_API_KEY` is set.

---

## Exact DNS records still required

**Replace** apex SPF TXT (do not duplicate):

```
Name: @
Type: TXT
Value: v=spf1 include:_spf.google.com include:amazonses.com ~all
```

**Replace** DMARC:

```
Name: _dmarc
Type: TXT
Value: v=DMARC1; p=quarantine; rua=mailto:legal@bharatgig.live; pct=100; adkim=s; aspf=s
```

**Add** from Resend dashboard (Domains → bharatgig.live → DNS records):

```
Name: resend2._domainkey
Type: TXT or CNAME  (exact value from Resend)

Name: resend3._domainkey
Type: TXT or CNAME  (exact value from Resend)
```

Verify after 15 min:

```powershell
npm run verify:email-dns
```

Gmail → Show original on test email → **spf=pass dkim=pass dmarc=pass**

---

## Exact Vercel env vars (marketing project)

| Variable | Production | Preview | Development | Value |
|----------|:----------:|:-------:|:-----------:|-------|
| `RESEND_API_KEY` | ✓ | ✓ | ✓ | `re_...` |
| `EMAIL_FROM` | ✓ | ✓ | ✓ | `GigAI Bharat <no-reply@bharatgig.live>` |
| `VITE_SITE_URL` | ✓ | ✓ | ✓ | `https://www.bharatgig.live` |
| `TURNSTILE_SECRET_KEY` | ✓ | ✓ | ✓ | Cloudflare secret |
| `VITE_TURNSTILE_SITE_KEY` | ✓ | ✓ | ✓ | Cloudflare site key |
| `CONTACT_ADMIN_NOTIFY` | ✓ | — | — | your private Gmail (BCC) |

---

## Email routing (live when Resend configured)

| Form URL | Delivers to |
|----------|-------------|
| `/contact` | support@bharatgig.live |
| `/contact/investors` | investors@bharatgig.live |
| `/contact/careers` | careers@bharatgig.live |
| `/contact/partnerships` | partnerships@bharatgig.live |
| Auto-reply | no-reply@bharatgig.live |

---

## Final production status

| Layer | Status |
|-------|--------|
| www → marketing SSR | **LIVE** |
| app → worker | **LIVE** |
| All routes + API | **LIVE** |
| Security (CSP/HSTS/rate limit/honeypot) | **LIVE** |
| Analytics + Speed Insights | **ENABLED** |
| SEO (sitemap, robots, OG) | **LIVE** |
| Email send (Resend) | **BLOCKED** — needs API key |
| Gmail auth (SPF/DKIM/DMARC) | **PARTIAL** — 3 DNS records |

**Investor-ready after:** Resend key + 3 DNS TXT records (~10 min).

```powershell
npm run lockdown   # full report anytime
```
