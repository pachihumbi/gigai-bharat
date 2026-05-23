# Ideal folder structure — GigAI Bharat

Reference tree for engineers and investors (technical diligence).

```
gigai-bharat/
│
├── .github/
│   └── workflows/
│       └── ci.yml                 # Lint, test, build on PR
│
├── apps/
│   ├── worker/                    # @gigai/worker — gig worker product
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── components/        # UI + AppShell
│   │   │   ├── hooks/             # useAuth, useLedger, …
│   │   │   ├── integrations/      # supabase client (→ @gigai/types later)
│   │   │   ├── lib/
│   │   │   ├── pages/             # Route screens
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   ├── admin/                     # @gigai/admin — city ops console
│   │   └── src/
│   │       ├── components/
│   │       ├── pages/
│   │       └── lib/supabase.ts
│   │
│   └── marketing/                 # @gigai/marketing — public SSR site
│       ├── src/
│       │   ├── routes/            # TanStack file routes
│       │   ├── components/
│       │   └── data/
│       ├── wrangler.jsonc
│       └── package.json
│
├── packages/
│   ├── ui/                        # @gigai/ui — shared components
│   ├── types/                     # @gigai/types — domain + DB types
│   └── tsconfig/                  # @gigai/tsconfig — shared TS config
│
├── supabase/                      # Backend single source of truth
│   ├── config.toml
│   ├── migrations/                # Ordered SQL
│   └── functions/
│       └── parse-earning/         # AI OCR
│
├── infra/
│   └── ai/                        # Prompts, evals, AI roadmap
│       ├── prompts/               # (future)
│       └── schemas/               # (future)
│
├── docs/
│   ├── DEPLOYMENT.md
│   ├── MIGRATION.md
│   └── FOLDER_STRUCTURE.md        # This file
│
├── .env.example                   # Template — copy to .env.local
├── .gitignore
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── SECURITY.md
├── README.md
├── package.json                   # Workspace root
└── turbo.json
```

## Dependency rules

```
apps/*  →  packages/*  →  (no upward imports)
apps/*  →  supabase client SDK only (not supabase/migrations)
supabase/functions  →  Postgres + external AI APIs
apps/*  ✗  apps/*     (never import sibling apps)
```

## Growth path

| When | Add |
|------|-----|
| 2nd engineer | `CODEOWNERS`, branch protection |
| Payments | `supabase/functions/payments-webhook/` |
| Mobile | `apps/mobile/` (Expo) sharing `@gigai/types` |
| Node BFF | `apps/api/` only if Edge limits hit |
