# Backend

Server-side logic runs on **Supabase** (hosted Postgres, Auth, RLS, Edge Functions). No separate Express/Railway server — by design for solo-founder velocity.

| Layer | Path | Production |
|-------|------|------------|
| **Database + Auth** | `supabase/migrations/` | `ykrdwmbbieccfftierzc.supabase.co` |
| **Edge Functions (API)** | `supabase/functions/` | Deployed via Supabase CLI |
| **AI prompts** | `infra/ai/` | Evals & prompt versions |

## Commands (from repo root)

```bash
npx supabase login
npx supabase link --project-ref ykrdwmbbieccfftierzc
npm run db:push              # apply migrations
npm run functions:deploy     # deploy Edge Functions
npm run db:types             # regenerate TS types
```

Auth redirect URLs → [`docs/AUTH_PRODUCTION.md`](../docs/AUTH_PRODUCTION.md)
