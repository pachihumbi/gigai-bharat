# Spaceship Production Checklist — bharatgig.live

Print and check in order. **Hybrid setup:** marketing on Spaceship, worker on Vercel.

---

## BLOCKING ISSUES (fix first)

| # | Issue | Status | Fix |
|---|-------|--------|-----|
| 1 | SSL cert is `server53.shared.spaceship.host`, not `bharatgig.live` | **BLOCKING** | cPanel → SSL/TLS Status → Run AutoSSL |
| 2 | `www.bharatgig.live` DNS missing | **BLOCKING** | Add CNAME `www` → `bharatgig.live` |
| 3 | Site not deployed (directory listing) | **BLOCKING** | Run `npm run deploy:spaceship`, upload `dist-spaceship/` to `public_html` |
| 4 | Duplicate SPF TXT records | Warning | Merge to one SPF record |

---

## Phase 1 — Vercel cleanup (marketing)

- [ ] **Vercel Dashboard** → `gigai-bharat-marketing` → **Settings → Domains**
  - [ ] Remove `www.bharatgig.live`
  - [ ] Remove `bharatgig.live`
- [ ] Confirm `apps/marketing/vercel.json` is **removed** (archived at `deployment/archive/marketing.vercel.json`)
- [ ] Confirm GitHub **Deploy Production** workflow deploys **worker only** (not marketing)
- [ ] Keep `app.bharatgig.live` on Vercel worker project until worker is migrated

---

## Phase 2 — DNS (name.com)

### ADD / KEEP

| Type | Host | Value | Purpose |
|------|------|-------|---------|
| **TXT** | `@` | *(Spaceship verification string from Hosting Manager)* | Domain verify |
| **A** | `@` | `66.29.148.164` | Spaceship server |
| **A** | `@` | *(2nd IP from Hosting Manager if shown)* | Spaceship failover |
| **CNAME** | `www` | `bharatgig.live` | Marketing www |
| **CNAME** | `app` | `cname.vercel-dns.com` | Worker (hybrid) |
| **MX** | `@` | Google / Spacemail (as needed) | Email |
| **TXT** | `@` | `v=spf1 include:spf.shared.spaceship.host ~all` | SPF (single record) |

### DELETE (old Vercel marketing DNS)

| Type | Host | Old value | Why delete |
|------|------|-----------|------------|
| **A** | `@` | `76.76.21.21` | Vercel apex — conflicts with Spaceship |
| **CNAME** | `www` | `cname.vercel-dns.com` | Vercel marketing — use Spaceship CNAME |
| **CNAME** | `www` | `*.vercel-dns-*.com` | Any Vercel alias |

**Do NOT delete** `app` → Vercel CNAME until worker migrates.

Verify:

```powershell
nslookup bharatgig.live
nslookup www.bharatgig.live
nslookup app.bharatgig.live
```

---

## Phase 3 — Spaceship hosting panel

- [ ] **Hosting Manager** → Add domain `bharatgig.live`
- [ ] Confirm document root (usually `public_html` or `public_html/bharatgig.live`)
- [ ] **cPanel → SSL/TLS Status**
  - [ ] Include `bharatgig.live` in AutoSSL
  - [ ] Include `www.bharatgig.live` in AutoSSL
  - [ ] Click **Run AutoSSL**
  - [ ] Or: Hosting Manager → lock icon → **Get SSL → Free SSL (Let's Encrypt)**
- [ ] Wait 5–30 min; verify cert CN = `bharatgig.live`

### Let's Encrypt activation (step-by-step)

1. Log in to **Spaceship → Hosting Manager**
2. Open **cPanel** for your plan
3. Go to **Security → SSL/TLS Status**
4. Locate `bharatgig.live` — if status is "Excluded", click **Run AutoSSL** or **Include**
5. Repeat for `www.bharatgig.live`
6. Alternative: **SSL/TLS → Manage SSL sites** → select domain → **Autofill by Domain**
7. Enable **Force HTTPS Redirect** under **Domains → Domains** (optional; `.htaccess` also handles this)

---

## Phase 4 — Build & deploy

```powershell
cd "C:\Users\TEMP.DELL\Desktop\Documents → GigAI"
.\scripts\deploy-spaceship.ps1
```

Upload **all contents** of `apps/marketing/dist-spaceship/` to document root via cPanel File Manager or FTP.

**Build output path:** `apps/marketing/.output/public/` (24 prerendered HTML routes + assets).  
The deploy script copies this to `dist-spaceship/` and adds `.htaccess` + PHP API files.

### Configure PHP API (contact forms)

Edit `public_html/api/contact.php` on server:

```php
const RESEND_API_KEY = 're_xxxxxxxx';
const TURNSTILE_SECRET = 'xxxxxxxx';  // optional
```

Or set via cPanel environment variables if supported.

---

## Phase 5 — Environment variables

### Build-time (local / CI)

| Variable | Value | Required |
|----------|-------|----------|
| `DEPLOY_TARGET` | `spaceship` | Yes |
| `VITE_SITE_URL` | `https://www.bharatgig.live` | Yes |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare site key | Recommended |

### Server-side (PHP on Spaceship — NOT in client bundle)

| Variable / config | Value | Required |
|-------------------|-------|----------|
| `RESEND_API_KEY` in `contact.php` | `re_...` | Yes for forms |
| `TURNSTILE_SECRET` in `contact.php` | Turnstile secret | Recommended |
| `EMAIL_FROM` | `GigAI Bharat <no-reply@bharatgig.live>` | Yes |

### Worker (still Vercel — unchanged)

Set in **Vercel → gigai-bharat-worker → Environment Variables**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

---

## Phase 6 — Smoke test

```powershell
curl.exe -sI http://bharatgig.live
curl.exe -sI https://bharatgig.live
curl.exe -sI http://www.bharatgig.live
curl.exe -sI https://www.bharatgig.live
curl.exe -s https://www.bharatgig.live/api/health
curl.exe -sI https://app.bharatgig.live/demo
```

| Check | Expected |
|-------|----------|
| `http://bharatgig.live` | 301 → `https://www.bharatgig.live` |
| `https://bharatgig.live` | 301 → `https://www.bharatgig.live` |
| `https://www.bharatgig.live` | 200, homepage HTML |
| Browser padlock | Valid cert for `bharatgig.live` |
| `/manifesto`, `/investors` | 200 |
| `/api/health` | JSON `{ "ok": true }` |
| `app.bharatgig.live/demo` | 200 (Vercel worker) |

---

## Phase 7 — Production-ready sign-off

- [ ] SSL valid on apex + www
- [ ] HTTP → HTTPS redirect works
- [ ] Apex → www redirect works
- [ ] Static assets load (`/assets/*`, favicon, manifest)
- [ ] Contact form sends email (test `/contact`)
- [ ] No Vercel redeploy fighting DNS (marketing domains removed from Vercel)
- [ ] Worker app still live on `app.bharatgig.live`
- [ ] `robots.txt` / `sitemap.xml` reference `www.bharatgig.live`

**Done when Phases 1–7 pass.**
