# Security Policy — GigAI Bharat

We protect **gig worker PII**, **financial ledger data**, and **AI infrastructure credits**. Security is a product feature for a worker-owned platform.

---

## Reporting vulnerabilities

**Do not** open public GitHub issues for security bugs.

| Channel | Contact |
|---------|---------|
| Email | security@gigaibharat.in *(replace with your domain)* |
| Response SLA | 48 hours acknowledgment, 7 days initial assessment |

Include: description, reproduction steps, impact, and suggested fix if known.

We support coordinated disclosure. Researchers acting in good faith will not face legal action.

---

## Scope

### In scope

- `apps/worker`, `apps/admin`, `apps/marketing` (production deployments)
- `supabase/` migrations, RLS policies, Edge Functions
- Supabase Auth configuration
- Exposure of service role or AI API keys

### Out of scope

- Social engineering of workers
- Physical device theft
- Denial of service without proven exploit chain
- Issues in third-party platforms (Swiggy, Uber, etc.)

---

## Security architecture summary

| Layer | Control |
|-------|---------|
| **Transport** | HTTPS everywhere |
| **Auth** | Supabase JWT; short-lived tokens |
| **Data** | Row Level Security on all worker tables |
| **AI** | Authenticated Edge Functions; audit logging |
| **Admin** | Private deploy; no service role in browser |
| **Secrets** | Environment variables + Supabase vault |

Full design: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Developer obligations

### Never commit

- `.env`, `.env.local`, credentials JSON
- Supabase **service role** key
- `LOVABLE_API_KEY`, OpenAI keys, Maps keys without restriction
- Worker PII exports, database dumps

Root `.gitignore` blocks these. If leaked: **rotate immediately**.

### Environment files

Use `.env.example` as template only. Production secrets live in:

- Vercel / Cloudflare env dashboards
- Supabase Edge Function secrets
- GitHub Actions encrypted secrets

### RLS checklist (every new table)

- [ ] `ENABLE ROW LEVEL SECURITY`
- [ ] Policies use `auth.uid()` or `owns_worker()`
- [ ] No `USING (true)` on worker data
- [ ] Service role used only in Edge Functions, never in SPA

### AI endpoints

- [ ] Require `Authorization: Bearer <jwt>`
- [ ] Rate limit per user (implement quotas)
- [ ] Log via `log_audit`
- [ ] Validate structured output before client insert

---

## Production launch checklist

- [ ] Rotate all keys that ever lived in git
- [ ] Separate Supabase projects per environment
- [ ] Google Maps API key HTTP referrer restricted
- [ ] Auth redirect URLs whitelist production domains only
- [ ] `APP_ENV=production` disables demo earnings seed
- [ ] Admin behind Cloudflare Access or VPN
- [ ] Enable Supabase audit logs + backups (PITR)
- [ ] CSP headers on worker and admin apps
- [ ] Dependency scanning (Dependabot / Renovate)

---

## Data protection (India)

Gig worker data may include phone numbers, location, and earnings — treat as sensitive under **DPDP Act 2023** principles:

- Collect minimum necessary fields
- Document purpose in privacy policy
- Support export and deletion requests
- Retain audit logs per compliance needs, not indefinitely

---

## Incident response (founder playbook)

1. **Contain** — rotate compromised keys, disable affected function  
2. **Assess** — query `audit_log`, Supabase logs  
3. **Notify** — affected workers if PII exposed (legal counsel)  
4. **Remediate** — patch, migration, redeploy  
5. **Post-mortem** — internal doc within 72 hours  

---

## Supported versions

| Component | Supported |
|-----------|-----------|
| `main` branch | Yes |
| `develop` branch | Best-effort |
| Legacy zip folders | No |

---

*Last updated: 2026-05-23*
