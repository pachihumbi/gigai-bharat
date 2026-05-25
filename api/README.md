# API

HTTP APIs are **Supabase Edge Functions** (Deno) plus **Postgres RPC** under RLS. There is no standalone Node API server.

| Endpoint | Path | Purpose |
|----------|------|---------|
| `parse-earning` | `supabase/functions/parse-earning/` | Gemini Vision OCR → structured earnings |
| Postgres RPCs | `supabase/migrations/*.sql` | Wallet, ledger, welfare (RLS-gated) |

## Local development

```bash
npm run functions:serve
# Test: POST http://localhost:54321/functions/v1/parse-earning
```

## Production secrets

Set in **Supabase Dashboard → Edge Functions → Secrets** (never in marketing Vercel project):

- `LOVABLE_API_KEY` (Gemini)
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` (auto-injected in hosted runtime)

Client apps call functions via `@supabase/supabase-js` with the user's JWT.
