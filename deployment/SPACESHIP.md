# Spaceship hosting — bharatgig.live

**Status (2026-05-26):** Apex DNS points to Spaceship, but HTTPS serves the **wrong certificate** (`server53.shared.spaceship.host`). `www` has no DNS record. `app` still points to Vercel. Site files are not deployed (`public_html` shows directory listing).

---

## Root cause of `NET::ERR_CERT_COMMON_NAME_INVALID`

| Check | Result |
|-------|--------|
| DNS `bharatgig.live` | `66.29.148.164` (Spaceship) |
| HTTPS certificate CN | `server53.shared.spaceship.host` ❌ |
| Expected certificate CN/SAN | `bharatgig.live`, `www.bharatgig.live` |
| HTTP | Works (200, LiteSpeed) |
| HTTPS (valid cert) | **Fails** — default shared-host cert, not domain cert |

**Fix:** Issue a domain SSL in Spaceship cPanel (AutoSSL / Let's Encrypt) after the addon domain is attached and DNS verifies.

---

## Step 1 — Remove leftover Vercel DNS (marketing only)

These records still point at Vercel and must be updated or removed when fully migrating off Vercel:

| Host | Current | Action |
|------|---------|--------|
| `@` (apex) | `A → 66.29.148.164` | ✅ Already on Spaceship |
| `www` | **Missing** | Add `CNAME → bharatgig.live` |
| `app` | `CNAME → 9941c58d13f3638a.vercel-dns-017.com` | Keep on Vercel **or** migrate worker separately |
| `admin` | Missing | Add when admin app is deployed |

**Repo Vercel config (still present — not used by Spaceship):**

- `apps/marketing/vercel.json` — redirects, rewrites, security headers
- `apps/worker/vercel.json` — worker SPA + CSP
- `.github/workflows/deploy-production.yml` — Vercel CI deploy
- `deployment/DNS_SETUP.md`, `deployment/VERCEL.md` — Vercel runbooks

These files do **not** affect Spaceship once DNS no longer points to Vercel. Remove or archive when migration is complete.

---

## Step 2 — DNS records (name.com / external nameservers)

Nameservers: `ns1hwy.name.com`, `ns2fln.name.com`, `ns3fqs.name.com`, `ns4jnz.name.com`

Because the domain uses **external** nameservers, Spaceship requires a **TXT verification** record (copy exact value from **Hosting Manager → Domain → Connect**):

| Type | Host | Value | TTL |
|------|------|-------|-----|
| **TXT** | `@` | *(verification string from Spaceship Hosting Manager)* | 300 |
| **A** | `@` | `66.29.148.164` | 300 |
| **A** | `@` | *(second IP from Hosting Manager, if shown)* | 300 |
| **CNAME** | `www` | `bharatgig.live` | 300 |

**Optional — keep worker on Vercel during transition:**

| Type | Host | Value |
|------|------|-------|
| CNAME | `app` | `cname.vercel-dns.com` |

**Do not** point `www` or apex at Vercel while marketing is on Spaceship.

Verify:

```powershell
nslookup bharatgig.live
nslookup www.bharatgig.live
nslookup -type=TXT bharatgig.live
```

---

## Step 3 — Attach domain in Spaceship

1. **Hosting Manager** → select your plan → **Add domain** → `bharatgig.live`
2. Confirm DNS (A + TXT) matches Hosting Manager guidelines
3. Wait for domain status = connected (green check)

Document root should be `public_html` (or `public_html/bharatgig.live` for addon domains — confirm in cPanel **Domains → Domains**).

---

## Step 4 — Fix SSL (Let's Encrypt / AutoSSL)

1. Open **cPanel** from Hosting Manager
2. **Security → SSL/TLS Status**
3. Find `bharatgig.live` and `www.bharatgig.live`
4. If excluded: select **Include during AutoSSL**
5. Click **Run AutoSSL**
6. Wait 5–30 minutes, then verify:

```powershell
# PowerShell — inspect certificate subject
$tcp = New-Object System.Net.Sockets.TcpClient('bharatgig.live', 443)
$ssl = New-Object System.Net.Security.SslStream($tcp.GetStream(), $false, ({ $true } -as [Net.Security.RemoteCertificateValidationCallback]))
$ssl.AuthenticateAsClient('bharatgig.live')
$cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($ssl.RemoteCertificate)
$cert.Subject
$cert.Extensions | Where-Object { $_.Oid.FriendlyName -eq 'Subject Alternative Name' } | ForEach-Object { $_.Format($false) }
$ssl.Close(); $tcp.Close()
```

Expected: `CN=bharatgig.live` (or SAN includes `bharatgig.live` and `www.bharatgig.live`).

**If AutoSSL fails:**

- Confirm A record resolves to the **same server IP** shown in Hosting Manager
- Confirm TXT verification record exists
- Remove conflicting old SSL for `server53.shared.spaceship.host` as default vhost (support ticket if needed)
- Try **Free SSL (Let's Encrypt)** from Hosting Manager lock icon → **Get SSL → Free SSL**

---

## Step 5 — Deploy site files

Upload contents of `deployment/spaceship/public/` (after building — see below) to the domain document root via **File Manager** or FTP.

**Important:** Build uses Nitro `node-server` preset to **prerender** 24+ static HTML pages into `.output/public`. Upload that folder only — do not run the Node server on shared LiteSpeed hosting. Server API routes (`/api/contact`) are replaced by PHP handlers in `deployment/spaceship/api/`.

```powershell
cd "C:\Users\TEMP.DELL\Desktop\Documents → GigAI"
$env:DEPLOY_TARGET = "spaceship"
$env:VITE_SITE_URL = "https://www.bharatgig.live"
npm install
npm run build:spaceship -w @gigai/marketing
```

Upload `.output/public/*` to document root, then copy:

- `deployment/spaceship/public/.htaccess` → document root
- `deployment/spaceship/api/contact.php` → `public_html/api/contact.php`
- Set `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` in cPanel **Environment** or edit `contact.php` config block

---

## Step 6 — HTTPS redirect & www canonical

Handled by `deployment/spaceship/public/.htaccess`:

- `http://*` → `https://www.bharatgig.live` (301)
- `https://bharatgig.live` → `https://www.bharatgig.live` (301)
- SPA fallback: non-file routes → `index.html`

Also enable in cPanel: **Domains → Domains → bharatgig.live → Force HTTPS Redirect** (if available).

---

## Step 7 — Post-deploy checklist

```powershell
curl.exe -sI http://bharatgig.live
curl.exe -sI https://bharatgig.live
curl.exe -sI http://www.bharatgig.live
curl.exe -sI https://www.bharatgig.live
curl.exe -s https://www.bharatgig.live/api/health
```

| URL | Expected |
|-----|----------|
| `http://bharatgig.live` | 301 → `https://www.bharatgig.live` |
| `https://bharatgig.live` | 301 → `https://www.bharatgig.live` |
| `https://www.bharatgig.live` | 200, marketing homepage |
| `https://www.bharatgig.live/api/health` | JSON `{ "ok": true }` |
| Browser padlock | Valid for `bharatgig.live` / `www.bharatgig.live` |

---

## DNS expectations for SSL (summary)

AutoSSL / Let's Encrypt validates:

1. **HTTP-01:** Domain A/AAAA/CNAME resolves to the server running AutoSSL
2. **Domain on account:** `bharatgig.live` added as addon/parked in cPanel
3. **Verification TXT:** Required for external nameservers (name.com)
4. **Both hostnames:** Include apex **and** `www` in AutoSSL (wildcard or separate SAN)

Until all four are satisfied, browsers will keep showing `NET::ERR_CERT_COMMON_NAME_INVALID`.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Wrong cert (`server53.shared.spaceship.host`) | Run AutoSSL; include addon domain; wait for propagation |
| `www` does not resolve | Add CNAME `www → bharatgig.live` |
| Directory listing instead of site | Upload build output to document root |
| Contact form 404 | Deploy `api/contact.php`; point form to `/api/contact.php` or proxy in `.htaccess` |
| Mixed Vercel + Spaceship | Apex/www → Spaceship; `app` → Vercel until worker migrated |
| Duplicate SPF TXT records | Keep one SPF: `v=spf1 include:spf.shared.spaceship.host ~all` (merge Google if needed) |
