# Production deployment status — GigAI Bharat

**Verified:** 2026-05-23 (auth fix deploy)  
**Status:** ✅ GURUKUL AI + production auth routing  
**Worker deploy:** `dpl_DCXc3zg81UibsvfoJq3VzSxyFfge`

---

## Live URLs

| Surface | URL |
|---------|-----|
| Marketing | https://www.bharatgig.live |
| **Gurukul AI (marketing)** | https://www.bharatgig.live/gurukul |
| ShramSetu (marketing) | https://www.bharatgig.live/shramsetu |
| Investor ROI Engine | https://www.bharatgig.live/investors |
| EV Infrastructure | https://www.bharatgig.live/ev-infrastructure |
| Smart Hub Blueprint | https://www.bharatgig.live/smart-hub |
| Worker app | https://app.bharatgig.live |
| **Gurukul AI (worker)** | https://app.bharatgig.live/gurukul |
| **Onboarding flow** | https://app.bharatgig.live/onboarding → `/gurukul` |

---

## Gurukul AI — flagship worker civilization module

### Worker app (`app.bharatgig.live`)
- **Route:** `/gurukul` — Learn · Skills · Certs · Advisor · Tribe tabs
- **Onboarding:** `/onboarding` — 5-step ultra-simple flow with AI mentor, selfie/doc sim, multilingual, redirects to Gurukul
- **Skill graph:** Skill, reliability, earning potential, fleet leadership scores
- **Certifications:** Blockchain-ready GigAI credentials
- **Economic advisor:** Income, savings, EMI, fleet ownership tips
- **Tribes:** Regional worker communities + success stories
- **Nav:** Bottom nav — Command · Gurukul · Ledger · ShramSetu · GigPay
- **i18n:** EN / KN / HI / TA / TE

### Marketing (`www.bharatgig.live`)
- **Route:** `/gurukul` — flagship showcase page
- **Homepage:** Gurukul section above VinFast EV showcase
- **Nav:** Gurukul AI in primary navigation
- **Sitemap:** `/gurukul` listed (priority 0.98)

---

## Route health (verified)

### Marketing — all ✅ 200
`/`, `/gurukul`, `/shramsetu`, `/investors`, `/ev-infrastructure`, `/smart-hub`, `/founder`, `/roadmap`, `/status`, `/join`

### Worker — all ✅ 200
`/`, `/auth`, `/auth/callback`, `/oauth/callback`, `/~oauth/initiate`, `/oauth/initiate`, `/onboarding`, `/gurukul`, `/dashboard`, `/dispatch`, `/ev-command`, `/security`, `/credit`, `/ledger`, `/gigpay`, `/welfare`

---

## Vercel production
- `gigai-bharat` — marketing (Nitro SSR) — READY
- `gigai-bharat-worker` — worker SPA (prebuilt) — READY

**Deploy pattern:** Local build → copy to `.vercel/output` → `npx vercel deploy --prebuilt --prod --project <name>`
