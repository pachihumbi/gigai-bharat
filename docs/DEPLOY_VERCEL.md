# Deploy GigAI Bharat marketing site on Vercel

Step-by-step guide to put the public marketing site live — for investors, LinkedIn, collaborators, and early supporters.

**Time:** ~20 minutes  
**Cost:** Free on Vercel Hobby tier  
**What goes live:** `apps/marketing` — homepage, manifesto, chapter pages, investor CTAs

---

## Before you start

You need:

1. A [GitHub](https://github.com) account with the repo pushed (`pachihumbi/gigai-bharat`)
2. A [Vercel](https://vercel.com) account (sign in with GitHub)
3. Node.js 20+ installed locally (already done if dev works)

**Security note:** The marketing site needs **no API keys**. Do not add Supabase or Google Maps keys to Vercel for this project.

---

## Step 1 — Verify the build locally (optional but recommended)

Open PowerShell in the repo root:

```powershell
cd "c:\Users\TEMP.DELL\Desktop\Documents → GigAI"
npm install
npm run build -w @gigai/marketing
```

You should see `✓ built` with no errors. Bundle size ~126 KB gzip for the main JS chunk.

To simulate the Vercel build:

```powershell
$env:VERCEL = "1"
npm run build -w @gigai/marketing
Remove-Item Env:VERCEL
```

This uses the **Nitro Vercel adapter** (SSR + routing). Output goes to `apps/marketing/.vercel/output/`.

---

## Step 2 — Push code to GitHub

If the repo is not on GitHub yet:

```powershell
cd "c:\Users\TEMP.DELL\Desktop\Documents → GigAI"
git init
git add .
git commit -m "Prepare marketing site for public launch"
git branch -M main
git remote add origin https://github.com/pachihumbi/gigai-bharat.git
git push -u origin main
```

> Never commit `.env.local` or real API keys. Run `npm run verify:secrets` before pushing if that script exists.

---

## Step 3 — Create the Vercel project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import** next to `pachihumbi/gigai-bharat`
3. Configure the project:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Other (or TanStack Start if detected) |
| **Root Directory** | `apps/marketing` |
| **Build Command** | *(leave default — uses `vercel.json`)* |
| **Output Directory** | *(leave empty — Nitro sets `.vercel/output`)* |
| **Install Command** | `cd ../.. && npm install` |

4. Click **Deploy**

Vercel automatically sets `VERCEL=1` during build, which activates the Nitro Vercel preset in `vite.config.ts`.

---

## Step 4 — Environment variables (optional)

The marketing site works with **zero env vars**. Add these only when needed:

| Variable | When to set | Example |
|----------|-------------|---------|
| `VITE_SITE_URL` | Custom domain or canonical URLs | `https://www.gigaibharat.in` |

**Do not add** `VITE_SUPABASE_*`, service role keys, or Maps keys here — those belong on the worker app only.

To add in Vercel: **Project → Settings → Environment Variables → Production**

---

## Step 5 — Verify the live deployment

After deploy finishes, Vercel gives you a URL like:

`https://gigai-bharat-marketing-xxxxx.vercel.app`

Checklist:

- [ ] Homepage loads with dark theme + hero
- [ ] `/manifesto`, `/workers`, `/cities` all work (no 404)
- [ ] Mobile menu opens (test on phone or DevTools)
- [ ] Sticky bottom CTA visible on mobile
- [ ] View page source — title contains "GigAI Bharat"
- [ ] `/robots.txt` and `/sitemap.xml` load

If routes 404, redeploy with **Redeploy → Redeploy without Build Cache**.

---

## Step 6 — Connect custom domain (`gigaibharat.in`)

### In Vercel

1. **Project → Settings → Domains**
2. Add `gigaibharat.in` and `www.gigaibharat.in`
3. Vercel shows DNS records to add

### At your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)

**Option A — Apex + www on Vercel**

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

**Option B — Cloudflare DNS (recommended for India latency + DDoS)**

1. Point nameservers to Cloudflare
2. Add CNAME `www` → `cname.vercel-dns.com` (proxy on)
3. Add CNAME `@` → `cname.vercel-dns.com` (Cloudflare CNAME flattening) or use Vercel A record

### After DNS propagates (5 min – 48 hrs)

1. Set `VITE_SITE_URL=https://www.gigaibharat.in` in Vercel env
2. Redeploy
3. Enable **Redirect** `gigaibharat.in` → `www.gigaibharat.in` in Vercel Domains

---

## Step 7 — Share publicly

Your live URLs:

| Audience | Link |
|----------|------|
| General / LinkedIn | `https://www.gigaibharat.in` |
| Investors | Homepage → "For investors" CTA or `mailto:hello@gigaibharat.in` |
| Collaborators | GitHub: `https://github.com/pachihumbi/gigai-bharat` |
| Worker app (future) | `https://app.gigaibharat.in` (not live yet) |

**LinkedIn post tip:** Share the homepage URL. OG image and description are pre-configured for rich previews.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| 404 on `/manifesto` etc. | Redeploy without cache; ensure Root Directory is `apps/marketing` |
| Build fails on Vercel | Check Node 20+ in Project Settings; run build locally first |
| Blank white screen | Open browser console; usually a JS error — fix locally, push, redeploy |
| Wrong canonical URL | Set `VITE_SITE_URL` to production domain and redeploy |
| Fonts slow on mobile | Expected on first visit (Google Fonts CDN); improves on repeat visits |
| "No output directory" error | Leave Output Directory **empty** in Vercel — Nitro handles it |

---

## Architecture note

| Platform | Build trigger | Output |
|----------|---------------|--------|
| **Vercel** | `VERCEL=1` (automatic) | `.vercel/output/` via Nitro |
| **Cloudflare Workers** | Default local/CI build | `dist/client` + `dist/server` |

Both paths share the same codebase. Vercel is recommended for the **first public launch** because setup is one-click from GitHub.

---

## Pre-launch checklist

- [ ] Production build passes locally
- [ ] No secrets in git (`npm run verify:secrets`)
- [ ] GitHub repo is public or accessible to collaborators
- [ ] Vercel project deployed from `apps/marketing`
- [ ] All routes tested on mobile
- [ ] Custom domain configured (or using `.vercel.app` for soft launch)
- [ ] `hello@gigaibharat.in` email ready for investor replies

---

## Next steps after launch

1. Deploy worker app to `app.gigaibharat.in` (separate Vercel project, `apps/worker`)
2. Replace OG image with a branded asset on your own CDN
3. Add Google Search Console + submit sitemap
4. Wire analytics (Plausible / Vercel Analytics) when ready

Questions: **hello@gigaibharat.in**
