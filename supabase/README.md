# Supabase — GigAI Bharat backend

Single source of truth for database, auth, RLS, and Edge Functions.

## Structure

```
supabase/
├── config.toml          # Project link & local dev settings
├── migrations/          # Ordered SQL migrations (never edit applied files)
└── functions/
    └── parse-earning/   # AI earnings OCR (Gemini via Lovable gateway)
```

## Commands (from repo root)

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF

# Local stack
npx supabase start
npm run db:reset          # reset local DB + apply migrations

# Ship schema
npm run db:push

# Edge Functions
npm run functions:serve
npm run functions:deploy

# Regenerate TS types → packages/types
npm run db:types
```

## Secrets (Dashboard → Edge Functions)

| Secret | Used by |
|--------|---------|
| `LOVABLE_API_KEY` | `parse-earning` |
| `SUPABASE_URL` | Auto in hosted runtime |
| `SUPABASE_ANON_KEY` | Auto in hosted runtime |

## Environments

| Environment | Supabase project | Branch |
|---------------|------------------|--------|
| Development | local or `jsdmmskzwnqhmxboergf` | `develop` |
| Staging | `jsdmmskzwnqhmxboergf` | `staging` |
| Production | **`jsdmmskzwnqhmxboergf`** | `main` |

> **Single production project:** All apps (`worker`, `admin`) and `supabase/config.toml` must use `jsdmmskzwnqhmxboergf`. The legacy dev project `ykrdwmbbieccfftierzc` is retired — do not use in env or Vercel.

Never run destructive migrations against production without a reviewed PR.
