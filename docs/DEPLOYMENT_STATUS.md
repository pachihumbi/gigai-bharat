# Production deployment status — GigAI Bharat

**Verified:** 2026-05-23  
**Status:** ✅ FULLY OPERATIONAL — Flagship modules live  
**Commit:** `5132974`

---

## Live URLs

| Surface | URL |
|---------|-----|
| Marketing | https://www.bharatgig.live |
| **ShramSetu (marketing)** | https://www.bharatgig.live/shramsetu |
| **Investor ROI Calculator** | https://www.bharatgig.live/roi |
| **Smart Hub Blueprint** | https://www.bharatgig.live/smart-hub |
| Worker app | https://app.bharatgig.live |
| **ShramSetu dashboard** | https://app.bharatgig.live/welfare |
| Worker `/shramsetu` alias | https://app.bharatgig.live/shramsetu |

---

## Flagship modules (production)

### 1. Digital ShramSetu — Welfare Intelligence
- **Marketing:** `/shramsetu` — regulatory narrative + CTA to worker app
- **Worker:** `/welfare`, `/shramsetu` — full GovTech dashboard with charts, SSC tracker, ESIC/PF, audit logs, AI insights
- **Nav:** Bottom nav "ShramSetu" tab in worker app

### 2. Investor ROI Calculator
- **Route:** `/roi` — live simulator with sliders, GMV/lending/insurance/valuation outputs, 5-year charts, data moat flywheel

### 3. Smart Hub Blueprint
- **Route:** `/smart-hub` — 11 infrastructure modules, sustainability dashboards, state readiness, cinematic hero

---

## Route health (verified)

### Marketing — all ✅ 200
`/`, `/shramsetu`, `/roi`, `/smart-hub`, `/join`, `/manifesto`, `/infrastructure`, `/future`, `/robots.txt`, `/sitemap.xml`

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
