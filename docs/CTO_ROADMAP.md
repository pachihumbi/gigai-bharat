# GigAI Bharat — CTO Engineering Roadmap

**Mission:** Build the operating system for India's working class.  
**Live:** https://www.bharatgig.live  
**Repo:** `pachihumbi/gigai-bharat`  
**Last updated:** May 2026

---

## Architecture today

```
┌─────────────────────────────────────────────────────────────┐
│  MARKETING (TanStack Start + Vercel Nitro SSR)              │
│  www.bharatgig.live — investor narrative, chapter docs    │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│  WORKER APP (React + Vite SPA)                              │
│  app.bharatgig.live — earnings, wallet, coach, OCR          │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│  SUPABASE (Postgres + Auth + RLS + Edge Functions)          │
│  worker_profiles · earnings_ledger · wallet_and_credit      │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1 — Production Polish ✅ In progress

**Goal:** Zero broken routes. Premium feel on Jio/Airtel 4G. Investor-ready sharing.

| # | Task | Status | Owner |
|---|------|--------|-------|
| 1 | Nitro SSR on Vercel (fix route 500s) | ✅ Done | DevOps |
| 2 | SSR hydration fix (dispatch simulation) | ✅ Done | Frontend |
| 3 | Per-route SEO + canonical URLs | ✅ Done | Frontend |
| 4 | SVG ID collision fix (dual maps) | ✅ Done | Frontend |
| 5 | Mobile perf (orbs, blur, scanlines) | ✅ Done | Frontend |
| 6 | CTA hierarchy (investors first) | ✅ Done | Product |
| 7 | Footer mailto fix | ✅ Done | Frontend |
| 8 | Self-hosted OG image on bharatgig.live | 🔲 Sprint 1 | Design |
| 9 | Self-hosted fonts (Inter subset WOFF2) | 🔲 Sprint 1 | Frontend |
| 10 | Vercel Analytics / Plausible | 🔲 Sprint 1 | DevOps |

**Deploy after Phase 1:** Push → Vercel redeploy without cache.

---

## Phase 2 — Worker Operating System

**Goal:** Replace demo data with real worker-owned earnings infrastructure.

**Current state:** Worker app is a cohesive prototype (`apps/worker`). Auth, OCR, wallet RPCs, and dashboard UI exist. Missing: ledger screen, i18n, real KPIs, AI coach backend.

### Sprint 2A — Data truth (2 weeks)

| Priority | Deliverable | Path |
|----------|-------------|------|
| P0 | Sync `@gigai/types` from Supabase codegen | `packages/types/` |
| P0 | **Driver Ledger page** `/ledger` | `apps/worker/src/pages/Ledger.tsx` |
| P0 | Wire Dashboard KPIs to `useLedger` aggregates | `Dashboard.tsx` |
| P1 | OCR review step before insert | `OCR.tsx` + `pending_earnings` migration |
| P1 | Disable demo seed in production (`APP_ENV=production`) | Supabase trigger |

### Sprint 2B — Wallet + credit (2 weeks)

| Priority | Deliverable | Path |
|----------|-------------|------|
| P0 | `wallet_transactions` table + RPCs | `supabase/migrations/` |
| P0 | Transaction history on GigPay | `GigPay.tsx` |
| P1 | Persist Smart Bills to DB (replace `walletStore.ts` mock) | `walletStore.ts` |
| P1 | Gig Credit Score recalc from ledger behavior | Edge function |
| P2 | Score explainability UI on GigPay | `CreditDial` component |

### Sprint 2C — Multilingual + AI coach (3 weeks)

| Priority | Deliverable | Path |
|----------|-------------|------|
| P0 | i18n framework (react-i18next) | `apps/worker/src/i18n/` |
| P0 | Language switcher: EN / HI / KN | `AppShell.tsx` |
| P1 | Extract inline Kannada strings | All pages |
| P1 | Shift Coach edge function (Gemini + worker context) | `supabase/functions/shift-coach/` |
| P2 | Wire Heatmap/MapPage to live location + demand | `Heatmap.tsx`, `MapPage.tsx` |

### Phase 2 schema additions

```sql
-- pending_earnings (OCR review queue)
-- wallet_transactions (immutable txn log)
-- credit_score_history (score audit trail)
-- shift_sessions (coach context)
```

---

## Phase 3 — Infrastructure

**Goal:** Production-grade security, observability, and scale to 1M+ workers.

| # | System | Implementation |
|---|--------|----------------|
| 1 | **Auth hardening** | Phone OTP via Supabase Auth; MFA for admin |
| 2 | **API layer** | Supabase Edge Functions → future dedicated API gateway |
| 3 | **Analytics** | PostHog or Plausible (privacy-first); funnel: landing → app signup |
| 4 | **Monitoring** | Sentry (worker + marketing); Supabase logs |
| 5 | **CI/CD** | GitHub Actions: lint → test → build → deploy |
| 6 | **Supabase prod** | Separate projects: dev / staging / prod |
| 7 | **Cloudflare edge** | Worker app on Cloudflare Pages; R2 for OCR images |
| 8 | **Secrets** | Rotate all exposed keys; referrer-restrict Maps API |
| 9 | **RLS audit** | Pen-test all tables; service role server-side only |
| 10 | **Backup** | Supabase PITR on Pro; weekly schema export |

### Environment matrix

| Env | Marketing | Worker | Supabase |
|-----|-----------|--------|----------|
| Dev | localhost:5173 | localhost:8080 | local / dev project |
| Staging | preview.bharatgig.live | app-staging.bharatgig.live | staging project |
| Prod | www.bharatgig.live | app.bharatgig.live | prod project |

---

## Phase 4 — Founder Narrative

**Goal:** UI that signals Stripe × Palantir × worker sovereignty.

### Design system targets

| Reference | GigAI expression |
|-----------|------------------|
| **Stripe** | Clean typography hierarchy, confident whitespace, precise CTAs |
| **Linear** | Dark mode mastery, subtle motion, keyboard-nav polish |
| **Apple** | Premium first load, restrained animation, product photography |
| **Palantir** | Command center density, live data viz, institutional trust |

### Marketing narrative upgrades (Sprint 4)

- [ ] `/deck` route — investor one-pager (PDF export)
- [ ] Case study: Bengaluru pilot metrics (real when available)
- [ ] Founder video embed on homepage
- [ ] Press kit page (`/press`)
- [ ] Self-hosted OG image + social cards per chapter
- [ ] Hindi landing page variant (`/hi`)

### Positioning copy (locked)

> **GigAI Bharat** is worker-owned mobility infrastructure — an AI-powered labor operating system combining fintech, workforce intelligence, and city-scale dispatch for India's 23.5M gig workers.

---

## Engineering standards

1. **Ship weekly** — every sprint ends with a deployable increment
2. **No secrets in client** — `VITE_*` only for public keys; service role server-side only
3. **RLS everywhere** — no table without row-level security
4. **India-first** — test on 4G throttled Android; Kannada before French
5. **Monorepo discipline** — shared types in `@gigai/types`, UI in `@gigai/ui`
6. **Document decisions** — ADRs in `docs/adr/` for architectural choices

---

## Immediate next actions

1. **Push Phase 1 fixes** → trigger Vercel redeploy without cache
2. **Verify all 7 routes** on www.bharatgig.live post-deploy
3. **Start Sprint 2A** — Driver Ledger page + types sync
4. **Configure email** — hello@bharatgig.live forwarding for investor replies
5. **LinkedIn launch** — share www.bharatgig.live with OG preview check

---

## Metrics that matter

| Metric | Target (6 mo) |
|--------|---------------|
| Marketing LCP (4G) | < 2.5s |
| Route error rate | 0% |
| Worker app signups | 1,000 pilot users |
| OCR entries / week | 500+ |
| Investor intro emails | Track via mailto + CRM |

**North star:** Workers who own their earnings data and can prove income to banks.
