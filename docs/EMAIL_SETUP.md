# Email & Contact System — bharatgig.live

Production runbook for business inboxes, transactional email (Resend), DNS authentication, and the marketing contact API.

**Stack:** TanStack Start API route → Resend → business inboxes  
**Domain:** `bharatgig.live`  
**Transactional from:** `no-reply@bharatgig.live`

---

## Architecture

```
Visitor → /contact/* form → POST /api/contact
                              ├─ rate limit + honeypot + Turnstile (optional)
                              ├─ Resend → inbound desk (investors@, support@, …)
                              ├─ Resend → auto-reply to submitter (no-reply@)
                              └─ optional BCC → CONTACT_ADMIN_NOTIFY (hidden)
```

### Public emails (by surface)

| Surface | Shown publicly |
|---------|----------------|
| Footer | hello@, support@ |
| Investor sections | investors@, founder@ |
| Partnership / fleet | partnerships@ |
| Careers / hiring | careers@ |
| Press | press@ |
| Privacy / legal | legal@ |

**Not exposed publicly:** contact@, team@ (use routing aliases internally via Cloudflare).

---

## Folder structure

```
apps/marketing/
├── src/
│   ├── data/emails.ts              # Public email registry
│   ├── lib/email/
│   │   ├── schemas.ts              # Zod validation
│   │   ├── config.server.ts        # Server env + routing
│   │   ├── rate-limit.server.ts
│   │   ├── security.server.ts      # Honeypot, Turnstile, origin
│   │   ├── send.server.ts          # Resend delivery
│   │   └── templates.server.ts     # Admin + auto-reply HTML
│   ├── routes/api/contact.ts       # POST /api/contact
│   ├── routes/contact/             # Form pages
│   ├── routes/press.tsx
│   └── routes/privacy.tsx
│   └── components/contact/         # InquiryForm, EmailLink
```

---

## Environment variables

### Vercel → Project `gigai-bharat-marketing` → Settings → Environment Variables

| Name | Environments | Required | Example |
|------|--------------|----------|---------|
| `RESEND_API_KEY` | Production, Preview | **Yes (prod)** | `re_xxxxxxxx` |
| `EMAIL_FROM` | Production | No | `GigAI Bharat <no-reply@bharatgig.live>` |
| `CONTACT_ADMIN_NOTIFY` | Production | No | `founder@gmail.com` (hidden BCC) |
| `TURNSTILE_SECRET_KEY` | Production | Recommended | Cloudflare Turnstile secret |
| `VITE_TURNSTILE_SITE_KEY` | Production, Preview | If using Turnstile | Cloudflare site key |
| `VITE_SITE_URL` | Production | Yes | `https://www.bharatgig.live` |

**Never prefix secrets with `VITE_`** except the Turnstile **site** key (public widget).

Add to repo root `.env.example` — copy values into Vercel, not git.

---

## Resend setup (transactional)

1. Create account at [resend.com](https://resend.com)
2. **Domains → Add Domain** → `bharatgig.live`
3. Add DNS records Resend provides (see below)
4. **API Keys → Create** → paste as `RESEND_API_KEY` in Vercel
5. Redeploy marketing project without cache

### Resend DNS records (Cloudflare)

Add in **Cloudflare → DNS → Records** (DNS only / grey cloud for TXT & MX during verification):

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| **TXT** | `@` or `bharatgig.live` | `v=spf1 include:amazonses.com ~all` | SPF (merge if existing SPF) |
| **TXT** | `resend._domainkey` | *(from Resend dashboard)* | DKIM 1 |
| **TXT** | `resend2._domainkey` | *(from Resend dashboard)* | DKIM 2 |
| **TXT** | `resend3._domainkey` | *(from Resend dashboard)* | DKIM 3 |
| **TXT** | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:legal@bharatgig.live; pct=100; adkim=s; aspf=s` | DMARC |

> Resend may show CNAME-style DKIM — use exactly what the dashboard displays. After verification, status shows **Verified**.

### SPF merge rule

If Cloudflare Email Routing already added SPF, merge into **one** TXT record:

```
v=spf1 include:_spf.mx.cloudflare.net include:amazonses.com ~all
```

---

## Inbound mail (Cloudflare Email Routing)

For **receiving** at hello@, support@, investors@, etc.:

1. **Cloudflare → Email → Email Routing → Enable**
2. Add destination address (your Gmail) and verify
3. Create routing rules:

| Address | Forwards to |
|---------|-------------|
| hello@bharatgig.live | founder inbox |
| support@bharatgig.live | founder inbox |
| investors@bharatgig.live | founder inbox |
| founder@bharatgig.live | founder inbox |
| careers@bharatgig.live | founder inbox |
| legal@bharatgig.live | founder inbox |
| partnerships@bharatgig.live | founder inbox |
| press@bharatgig.live | founder inbox |
| contact@bharatgig.live | founder inbox |
| team@bharatgig.live | founder inbox |

4. Cloudflare auto-adds MX:

| Type | Name | Priority | Content |
|------|------|----------|---------|
| MX | `@` | 1 | `route1.mx.cloudflare.net` |
| MX | `@` | 2 | `route2.mx.cloudflare.net` |
| MX | `@` | 3 | `route3.mx.cloudflare.net` |

**Note:** MX (inbound) and Resend (outbound) coexist — SPF must include both Cloudflare and Amazon SES.

---

## Cloudflare Turnstile (bot protection)

1. **Cloudflare Dashboard → Turnstile → Add site**
2. Hostnames: `bharatgig.live`, `www.bharatgig.live`
3. Widget mode: Managed
4. Set `VITE_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` in Vercel
5. Redeploy

Without Turnstile keys, forms still use honeypot + timing + rate limit.

---

## API route

**Endpoint:** `POST https://www.bharatgig.live/api/contact`

**Body:** JSON discriminated by `type`:

- `contact` | `investor` | `partnership` | `careers` | `press`

**Responses:**

- `200` `{ "ok": true, "id": "..." }`
- `400` validation / bot check failed
- `429` rate limited (5 req / 15 min / IP)
- `503` Resend failure

---

## Vercel deployment steps

```powershell
cd apps/marketing
# Set env vars in Vercel Dashboard first
$env:VERCEL = "1"
npm run build
npx vercel deploy --prebuilt --prod
```

Or push to `main` if Git integration is connected.

**Post-deploy checklist:**

- [ ] Submit test on `/contact` → receive admin email at support@
- [ ] Submitter receives auto-reply from no-reply@
- [ ] `/contact/investors` routes to investors@
- [ ] Turnstile widget renders (if configured)
- [ ] [mail-tester.com](https://www.mail-tester.com) score ≥ 9/10 for auto-reply
- [ ] Gmail shows **SPF PASS, DKIM PASS, DMARC PASS**
- [ ] Footer shows hello@ + support@ only
- [ ] `/privacy` shows legal@

---

## Gmail deliverability fixes

| Issue | Fix |
|-------|-----|
| Lands in spam | Complete SPF + DKIM + DMARC; warm domain with low volume first |
| SPF fail | Single merged SPF TXT; no duplicate `@` TXT records |
| DKIM fail | Re-copy CNAME/TXT from Resend; wait 15 min propagation |
| DMARC fail | Set `_dmarc` with `p=quarantine`, move to `p=reject` after 30 days |
| From mismatch | `EMAIL_FROM` must use verified domain `bharatgig.live` |
| Reply broken | Admin emails set `reply_to` submitter address automatically |

Verify headers:

```powershell
# Send test via form, then in Gmail → Show original
# Look for: spf=pass, dkim=pass, dmarc=pass
```

---

## Security summary

| Control | Implementation |
|---------|----------------|
| Rate limit | 5 POST / 15 min / IP |
| Honeypot | Hidden `_website` field |
| Timing trap | Min 3s form open time |
| Origin check | www.bharatgig.live only (prod) |
| Turnstile | Optional CAPTCHA |
| Secrets | Server env only; never in client bundle |
| Admin routing | `CONTACT_ADMIN_NOTIFY` BCC (optional) |

---

## Auto-reply copy

Premium startup tone — implemented in `templates.server.ts`:

- **Investor:** data room / briefing follow-up
- **Support/contact:** 1 business day SLA
- **Partnership:** partnerships desk acknowledgment
- **Careers:** founding team review promise
- **Press:** assets + founder availability within 1 business day

---

## Troubleshooting

| Symptom | Action |
|---------|--------|
| 503 on submit | Check `RESEND_API_KEY` in Vercel production env |
| No inbound mail | Verify Cloudflare Email Routing rules + MX |
| API 404 | Redeploy without cache; confirm Nitro + TanStack Start build |
| Turnstile stuck | Check CSP allows `challenges.cloudflare.com` |
| CORS/origin 403 | Set `VITE_SITE_URL=https://www.bharatgig.live` |

**Related:** [BHARATGIG_LIVE.md](./BHARATGIG_LIVE.md) · [DNS_SETUP.md](../deployment/DNS_SETUP.md)
