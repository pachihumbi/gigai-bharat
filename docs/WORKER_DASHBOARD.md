# Worker Dashboard Architecture

**App:** `apps/worker` → `app.bharatgig.live`  
**Backend:** Supabase (Postgres + Auth + RLS + Edge Functions)

---

## Layer model

```
┌─────────────────────────────────────────────────────────┐
│  PRESENTATION (React + Vite SPA)                        │
│  Dashboard · Ledger · OCR · GigPay · Shift Coach        │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│  DATA HOOKS (TanStack Query)                              │
│  useAuth · useLedger · useWallet · useRestLock            │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│  SUPABASE CLIENT (anon key + JWT)                       │
│  RLS-enforced reads/writes · Edge Function invoke         │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│  POSTGRES + EDGE FUNCTIONS                              │
│  earnings_ledger · wallet_and_credit · parse-earning    │
└─────────────────────────────────────────────────────────┘
```

---

## Core screens (Sprint 2A)

| Route | Screen | Data source |
|-------|--------|-------------|
| `/dashboard` | Home KPIs, quick actions | `useLedger` aggregates |
| `/ledger` | **New** — full earnings history | `earnings_ledger` |
| `/ocr` | Screenshot upload → parse | `parse-earning` Edge Fn |
| `/gigpay` | Wallet, credit score, bills | `wallet_and_credit` RPCs |
| `/heatmap` | Shift coach | Edge Fn (planned) |
| `/hub` | Smart hub widgets | Mixed ledger + wallet |

---

## Data model (production)

| Table | Purpose |
|-------|---------|
| `worker_profiles` | Identity, vehicle, platforms, onboarding |
| `earnings_ledger` | Immutable daily earnings per platform |
| `wallet_and_credit` | Balance, Gig Credit Score, loans |
| `welfare_tracker` | Working days, scheme eligibility |
| `audit_log` | Compliance trail |

**Planned:** `pending_earnings`, `wallet_transactions`, `credit_score_history`

---

## Auth flow

1. `/auth` — email/password or Google OAuth
2. `handle_new_worker` trigger — profile + wallet seed
3. `/onboarding` — vehicle, platforms, home location
4. `/dashboard` — product entry

Marketing `/join` → deep link to `app.bharatgig.live/auth`

---

## Multilingual (Sprint 2C)

```
apps/worker/src/i18n/
├── en.json
├── hi.json
└── kn.json
```

Default: English. User preference stored in `worker_profiles.locale`.

---

## Security rules

- Anon key in browser only — never service role
- All tables RLS: `auth.uid() = worker_id`
- OCR via JWT-gated Edge Function
- `APP_ENV=production` disables demo earnings seed

---

## Next build: `/ledger` page

1. List `earnings_ledger` rows grouped by week
2. Platform breakdown chart (recharts)
3. CSV export button
4. Link from Dashboard + GigPay Skill Passport

See [CTO_ROADMAP.md](./CTO_ROADMAP.md) for full Phase 2 schedule.
