# GO-LIVE — GigAI Bharat (Final)

**Run this once with your Vercel token:**

```powershell
cd "c:\Users\TEMP.DELL\Desktop\Documents → GigAI"
$env:VERCEL_TOKEN = "YOUR_TOKEN"   # vercel.com/account/tokens
npm run go-live
```

This script automatically:
1. Removes `www` / apex from worker Vercel project
2. Attaches domains to marketing project
3. Builds + deploys marketing (prebuilt, `--force`)
4. Runs all validation scripts

---

## Current validation (pre go-live)

| Check | Status | Blocker |
|-------|--------|---------|
| `www.bharatgig.live` | **RED** | Serves worker app (`manifest.webmanifest`) |
| `/api/contact` | **RED** | 405 — marketing not deployed on www |
| SPF | **RED** | Missing `include:amazonses.com` |
| DKIM | **RED** | 2/3 Resend records missing |
| DMARC | **YELLOW** | `p=none` → upgrade to `p=quarantine` |
| MX | **GREEN** | Google Workspace |
| `app.bharatgig.live` | **GREEN** | Worker OK |

---

## DNS records still required (copy-paste)

**Cloudflare or Google Domains DNS:**

```
TXT  @       v=spf1 include:_spf.google.com include:amazonses.com ~all
TXT  _dmarc   v=DMARC1; p=quarantine; rua=mailto:legal@bharatgig.live; pct=100; adkim=s; aspf=s
TXT  resend2._domainkey   (paste from Resend → Domains → bharatgig.live)
TXT  resend3._domainkey   (paste from Resend → Domains → bharatgig.live)
```

**Website (unchanged):**
```
A     @    76.76.21.21
CNAME www  cname.vercel-dns.com
CNAME app  cname.vercel-dns.com
```

---

## Vercel env vars (marketing project)

Set in **Vercel → gigai-bharat-marketing → Settings → Environment Variables → Production:**

| Variable | Value |
|----------|-------|
| `RESEND_API_KEY` | `re_...` from Resend |
| `EMAIL_FROM` | `GigAI Bharat <no-reply@bharatgig.live>` |
| `VITE_SITE_URL` | `https://www.bharatgig.live` |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key |
| `CONTACT_ADMIN_NOTIFY` | *(optional)* hidden BCC |

```powershell
cd apps/marketing
npx vercel env add RESEND_API_KEY production
npx vercel env add EMAIL_FROM production
npx vercel env add VITE_SITE_URL production
npx vercel env add TURNSTILE_SECRET_KEY production
npx vercel env add VITE_TURNSTILE_SITE_KEY production preview production
```

---

## Vercel domain mapping (target state)

| Domain | Project | Root |
|--------|---------|------|
| `www.bharatgig.live` | gigai-bharat-marketing | apps/marketing |
| `bharatgig.live` | gigai-bharat-marketing | apps/marketing |
| `app.bharatgig.live` | gigai-bharat-worker | apps/worker |

---

## Cloudflare settings

| Setting | Value |
|---------|-------|
| SSL/TLS | Full (strict) |
| Always Use HTTPS | On |
| Auto Minify | JS + CSS + HTML |
| Brotli | On |

---

## Post go-live validation

```powershell
npm run health:production      # all OK
npm run verify:email-dns       # SPF + DKIM green after DNS
npm run test:contact-api       # API returns JSON, CSP present

$env:CONTACT_TEST_EMAIL = "you@gmail.com"
node scripts/test-contact-api.mjs --send
```

Gmail → Show original → **spf=pass dkim=pass dmarc=pass**

---

## Email routing (live after deploy + RESEND_API_KEY)

| Form | Inbox |
|------|-------|
| Contact | support@bharatgig.live |
| Investor | investors@bharatgig.live |
| Careers | careers@bharatgig.live |
| Partnerships | partnerships@bharatgig.live |
| Auto-reply | no-reply@bharatgig.live |

---

**Full runbook:** [PRODUCTION_RUNBOOK.md](./PRODUCTION_RUNBOOK.md)
