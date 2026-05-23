# Production deployment status — GigAI Bharat

**Verified:** 2026-05-23  
**Status:** ✅ SOVEREIGN OS — Flagship modules + global site live  
**Revision:** `2026-05-23-sovereign-os`

---

## Live URLs

| Surface | URL |
|---------|-----|
| Marketing | https://www.bharatgig.live |
| **ShramSetu (marketing)** | https://www.bharatgig.live/shramsetu |
| **Investor ROI Engine** | https://www.bharatgig.live/investors |
| `/roi` redirect | https://www.bharatgig.live/roi → `/investors` |
| **Smart Hub Blueprint** | https://www.bharatgig.live/smart-hub |
| **Founder manifesto** | https://www.bharatgig.live/founder |
| **Public roadmap** | https://www.bharatgig.live/roadmap |
| **Infrastructure status** | https://www.bharatgig.live/status |
| Worker app | https://app.bharatgig.live |
| **ShramSetu dashboard** | https://app.bharatgig.live/welfare |
| Worker `/shramsetu` alias | https://app.bharatgig.live/shramsetu |

---

## Flagship modules (production)

### 1. Digital ShramSetu — Welfare Intelligence
- **Marketing:** `/shramsetu` — interactive dashboard preview (SSC tracker, Karnataka welfare fee, compliance score, earnings ledger, PF/ESIC, audit logs, AI insights, lifecycle timeline)
- **Worker:** `/welfare`, `/shramsetu` — full GovTech dashboard with Recharts
- **Nav:** Bottom nav "ShramSetu" tab in worker app

### 2. Investor ROI Engine
- **Route:** `/investors` (canonical) — VC-grade simulator: GMV, embedded finance, data moat, valuation, 5-year charts
- **Legacy:** `/roi` redirects to `/investors`

### 3. Smart Hub Blueprint
- **Route:** `/smart-hub` — EV charging, housing, solar/wind, dispatch, kiosks, kitchens, clinics, skill centers, fleet intelligence, sustainability metrics

---

## Global site upgrades

- Premium navigation (ShramSetu, Investors, Smart Hub, Founder, Roadmap, Join)
- Homepage: flagship modules, media showcase, multilingual readiness
- Founder manifesto (`/founder`), public roadmap (`/roadmap`), infra status (`/status`)
- Media integration: investor deck, fleet deck, workforce OS video, Kannada audio (request links)
- SEO: expanded sitemap, route-level meta, analytics hooks

---

## Route health (verified)

### Marketing — all ✅ 200
`/`, `/shramsetu`, `/investors`, `/roi`, `/smart-hub`, `/founder`, `/roadmap`, `/status`, `/join`, `/manifesto`, `/infrastructure`, `/future`, `/robots.txt`, `/sitemap.xml`

### Worker — all ✅ 200
`/`, `/auth`, `/welfare`, `/shramsetu`, `/ledger`, `/ocr`, `/gigpay`, `/dashboard`

---

## DNS & SSL
- All domains → `76.76.21.21` ✅
- HSTS active ✅
- No Lovable stale content ✅

---

## Vercel production
- `gigai-bharat` — marketing (Nitro SSR) — READY
- `gigai-bharat-worker` — worker SPA — READY
