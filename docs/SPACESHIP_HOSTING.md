# Spaceship hosting — bharatgig.live

Guide for DNS, SSL, redirects, and deploying after migrating the **marketing** site off Vercel.

## Why you see `NET::ERR_CERT_COMMON_NAME_INVALID`

| Check | Expected | Typical failure today |
|--------|----------|------------------------|
| Apex A record | Spaceship server IP | OK (`66.29.148.164`) |
| `www` DNS | A or CNAME to apex | **Missing (NXDOMAIN)** |
| TLS certificate SAN | `bharatgig.live`, `www.bharatgig.live` | **`server53.shared.spaceship.host` only** |
| Document root | Built site files | **Empty (directory listing)** |

The browser error is from Spaceship serving its **default shared-host certificate**, not a leftover Vercel config on the apex.

`app.bharatgig.live` can still point at Vercel until you migrate the worker PWA.

## 1. Vercel config still in the repo (expected)

These are for **Vercel deploy** and `app.bharatgig.live` until you remove them:

- `apps/marketing/vercel.json`, `apps/worker/vercel.json`
- `.github/workflows/deploy-production.yml`
- `scripts/go-live.mjs`, `scripts/deploy-vercel.ps1`

Remove **Vercel DNS** only for hosts you moved to Spaceship (`@`, `www`). Do not delete `app` CNAME until the worker moves.

## 2. DNS for SSL (AutoSSL / Let's Encrypt)

```
Type   Host   Value
----   ----   -----
A      @      <your Spaceship server IP>
A      www    <same IP>     # or CNAME www → bharatgig.live
```

Run: `npm run verify:domain-ssl`

### Email (SPF)

Use **one** SPF TXT on the apex. You may currently have both Google and Spaceship — consolidate to avoid deliverability issues.

## 3. Fix SSL in Spaceship

1. Hosting Manager → attach **bharatgig.live** (and www) to the plan.
2. cPanel → **SSL/TLS Status** → enable **AutoSSL** for `bharatgig.live` and `www.bharatgig.live`.
3. Re-run AutoSSL after adding the **www** DNS record.

Valid cert should list `bharatgig.live` and `www.bharatgig.live` in SANs.

## 4. Canonical host and redirects

Canonical: **https://www.bharatgig.live**

`deploy/spaceship/marketing/.htaccess` enforces:

- HTTP → HTTPS  
- apex → www  
- `/driver-app` → `https://app.bharatgig.live/driver-app`  
- `/roi` → `/investors`  
- SPA fallback → `_shell.html` (Spaceship static build)

## 5. Build and upload

```bash
npm ci
npm run build:spaceship
```

Upload **`apps/marketing/dist-spaceship/`** contents to the www document root, including `.htaccess`.

Contact form: static hosting has no Node `/api/contact`. Options:

- Upload `deploy/spaceship/api/contact.php` and set `GIGAI_CONTACT_API_URL`, or  
- Keep contact API on Vercel/Supabase and point the form there.

## 6. Worker (`app.bharatgig.live`)

```bash
npm run build -w @gigai/worker
```

Upload `apps/worker/dist/` + `deploy/spaceship/worker/.htaccess` when DNS points to Spaceship.

## 7. Checklist

- [ ] www A/CNAME added  
- [ ] AutoSSL for apex + www  
- [ ] Site files uploaded (not empty folder)  
- [ ] `.htaccess` in document root  
- [ ] SPF single TXT  
- [ ] `npm run verify:domain-ssl` clean  

## Links

- [Spaceship .htaccess guide](https://www.spaceship.com/knowledgebase/htaccess-setup-rules-redirects/)
- [Spaceship troubleshooting / SSL](https://www.spaceship.com/knowledgebase/website-down-troubleshooting/)
