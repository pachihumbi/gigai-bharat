# @gigai/worker

Worker-facing mobile web app — earnings, OCR, wallet, welfare, maps, safety.

## Dev

```bash
cp ../../.env.example .env.local
# Fill VITE_SUPABASE_* and Google Maps keys

npm run dev:worker   # from repo root → http://localhost:8080
```

## Backend

Database and Edge Functions live at **`../../supabase/`** (monorepo root), not inside this app.
