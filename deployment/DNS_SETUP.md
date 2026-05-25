# DNS Setup — bharatgig.live (Cloudflare + Vercel)

## Architecture

```
Registrar (where you bought bharatgig.live)
    └── Nameservers → Cloudflare (recommended)
            └── DNS records → Vercel edge
                    ├── www.bharatgig.live  → Marketing (gigai-bharat)
                    ├── bharatgig.live      → Apex redirect → www
                    └── app.bharatgig.live  → Worker (gigai-bharat-worker)
```

## Step 1 — Cloudflare nameservers

1. Log in to your **domain registrar** (GoDaddy, Namecheap, etc.).
2. Set **nameservers** to Cloudflare's pair (from Cloudflare → your site → DNS).
3. Wait up to 24h (usually &lt; 1h) for propagation.

## Step 2 — Cloudflare DNS records

In **Cloudflare → DNS → Records**, use **DNS only** (grey cloud) for Vercel custom domains — or orange cloud with SSL mode **Full (strict)** once Vercel cert is active.

| Type | Name | Content | Proxy | Notes |
|------|------|---------|-------|-------|
| **A** | `@` | `76.76.21.21` | DNS only recommended | Vercel apex |
| **CNAME** | `www` | `cname.vercel-dns.com` | DNS only recommended | Marketing |
| **CNAME** | `app` | `cname.vercel-dns.com` | DNS only recommended | Worker PWA |

> Do **not** point `www` and `app` to the same Vercel project. Each hostname must attach to its own project (see below).

## Step 3 — Vercel domain attachment

### Marketing project (`gigai-bharat-marketing`)

**Settings → Domains:**

- `www.bharatgig.live` (primary)
- `bharatgig.live` (apex — redirects to www via `vercel.json`)

**Settings → General:**

| Field | Value |
|-------|-------|
| Root Directory | `apps/marketing` |
| Framework | Other |
| Output Directory | *(empty)* |
| Node | 20.x |
| Install | `cd ../.. && npm install` |
| Build | `cd ../.. && npm run build -w @gigai/marketing` |

> **Do not** attach www to `gigai-bharat` (legacy misconfigured worker root) or `gigai-bharat-worker`.

### Worker project (`gigai-bharat-worker`)

**Settings → Domains:**

- `app.bharatgig.live` **only** (remove `www` if it appears here)

| Field | Value |
|-------|-------|
| Root Directory | `apps/worker` |
| Framework | Vite |
| Output Directory | `dist` |

## Step 4 — SSL

1. Vercel auto-provisions Let's Encrypt after DNS resolves.
2. Cloudflare SSL/TLS → **Full (strict)** if proxied; **Flexible** causes redirect loops — avoid.
3. Enable **Always Use HTTPS** in Cloudflare.
4. Enable **HSTS** (already in `vercel.json` headers).

Check SSL:

```powershell
curl -I https://www.bharatgig.live
curl -I https://app.bharatgig.live
```

## Step 5 — WWW & apex redirects

Handled in `apps/marketing/vercel.json`:

- `bharatgig.live/*` → `https://www.bharatgig.live/*` (301)
- `/driver-app` → `https://app.bharatgig.live/driver-app`
- `/roi` → `/investors`

Cloudflare optional rule (backup):

- Page Rule: `http://bharatgig.live/*` → `https://www.bharatgig.live/$1` (301)

## Step 6 — Verify DNS propagation

```powershell
nslookup www.bharatgig.live
nslookup app.bharatgig.live
nslookup bharatgig.live
```

Expected: Vercel edge IPs (e.g. `185.158.133.1`, `216.198.79.1`) or `76.76.21.21` for apex.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| www shows **Sign In** (worker app) | Remove `www` from worker Vercel project; add to marketing only |
| `/manifesto` 404 or 500 | Redeploy marketing **without build cache**; Output Directory must be empty |
| SSL "not secure" | Wait 15–60 min; confirm DNS points to Vercel; disable mixed Cloudflare SSL modes |
| Redirect loop | Cloudflare SSL → Full (strict); no http-only origin |
| `app` works, `www` broken | Separate projects — see Step 3 |

## Email (optional)

Forward `hello@bharatgig.live` via Cloudflare Email Routing or Google Workspace.
