# 5-Minute Email Go-Live — GigAI Bharat

## Step 1 — Resend API key (2 min)

1. Open https://resend.com/api-keys → **Create API Key** → copy `re_...`
2. Open https://vercel.com/pachihumbis-projects/gigai-bharat-marketing/settings/environment-variables
3. **Add New** → Name: `RESEND_API_KEY` → Value: paste key
4. Check **Production**, **Preview**, **Development** → Save
5. Add also (same envs):

| Name | Value |
|------|-------|
| `EMAIL_FROM` | `GigAI Bharat <no-reply@bharatgig.live>` |
| `VITE_SITE_URL` | `https://www.bharatgig.live` |

6. **Deployments** → latest → ⋮ → **Redeploy** → **uncheck** Build Cache

**Or CLI (logged in as pachihumbi):**

```powershell
cd "c:\Users\TEMP.DELL\Desktop\Documents → GigAI\apps\marketing"
$env:RESEND_API_KEY = "re_PASTE_HERE"
$env:RESEND_API_KEY | npx vercel env add RESEND_API_KEY production
$env:RESEND_API_KEY | npx vercel env add RESEND_API_KEY preview
$env:RESEND_API_KEY | npx vercel env add RESEND_API_KEY development
echo "GigAI Bharat <no-reply@bharatgig.live>" | npx vercel env add EMAIL_FROM production preview development
echo "https://www.bharatgig.live" | npx vercel env add VITE_SITE_URL production preview development
cd ..\..
$env:VERCEL="1"; npm run build -w @gigai/marketing
cd apps/marketing; npx vercel deploy --prebuilt --prod --force
npx vercel alias set gigai-bharat-marketing-XXXX-pachihumbis-projects.vercel.app www.bharatgig.live
```

Replace `XXXX` with deployment id from deploy output.

---

## Step 2 — Verify delivery (1 min)

```powershell
(Invoke-WebRequest https://www.bharatgig.live/api/health).Content
# email.resend must be true

$env:CONTACT_TEST_EMAIL = "your@gmail.com"
node scripts/test-contact-api.mjs --send
```

Submit forms manually:
- https://www.bharatgig.live/contact
- https://www.bharatgig.live/contact/investors
- https://www.bharatgig.live/contact/careers
- https://www.bharatgig.live/contact/partnerships

Expected: **200** (not 503), admin email to support@/investors@/careers@/partnerships@, auto-reply to submitter.

---

## Step 3 — DNS (2 min, Google Domains / Cloudflare)

**Replace** `@` SPF TXT:
```
v=spf1 include:_spf.google.com include:amazonses.com ~all
```

**Replace** `_dmarc` TXT:
```
v=DMARC1; p=quarantine; rua=mailto:legal@bharatgig.live; pct=100; adkim=s; aspf=s
```

**Add** from Resend → Domains → bharatgig.live:
```
resend2._domainkey
resend3._domainkey
```

```powershell
npm run verify:email-dns
```

---

## Step 4 — Final validation

```powershell
npm run health:production
npm run verify:email-dns
node scripts/test-contact-api.mjs --send
```

All green = email system complete.
