ALTER TABLE public.worker_profiles
  ADD COLUMN IF NOT EXISTS platforms text[] NOT NULL DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS onboarded boolean NOT NULL DEFAULT false;