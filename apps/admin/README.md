# @gigai/admin

Internal console for city ops, compliance, and platform health.

## Local dev

```bash
# From repo root
cp .env.example apps/admin/.env.local
# Fill VITE_SUPABASE_* (admin role policies required for data access)

npm run dev:admin
```

Runs at **http://localhost:8081**

## Production

- Deploy to a **private subdomain** (e.g. `admin.gigaibharat.in`)
- IP allowlist or SSO (Google Workspace) recommended
- Never expose service role key in the browser — use Edge Functions for privileged reads
