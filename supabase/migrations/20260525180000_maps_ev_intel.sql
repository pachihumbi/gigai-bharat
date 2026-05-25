-- PostGIS + location intelligence for open map stack (Phase 1/2)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Live worker location
CREATE TABLE IF NOT EXISTS public.worker_locations (
  worker_id UUID PRIMARY KEY REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  geom geography(POINT, 4326) NOT NULL,
  heading REAL,
  speed_mps REAL,
  on_shift BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.worker_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "location self manage" ON public.worker_locations;
CREATE POLICY "location self manage" ON public.worker_locations
  FOR ALL
  USING (public.owns_worker(worker_id))
  WITH CHECK (public.owns_worker(worker_id));

DROP POLICY IF EXISTS "location operator read" ON public.worker_locations;
CREATE POLICY "location operator read" ON public.worker_locations
  FOR SELECT
  USING (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', 'worker')
      IN ('operator', 'admin', 'founder')
  );

-- EV charger cache (synced via Edge Function)
CREATE TABLE IF NOT EXISTS public.ev_chargers (
  id BIGINT PRIMARY KEY,
  name TEXT,
  geom geography(POINT, 4326) NOT NULL,
  connector_types JSONB DEFAULT '[]'::jsonb,
  power_kw REAL,
  operator TEXT,
  ocm_raw JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ev_chargers_geom_idx ON public.ev_chargers USING GIST (geom);

ALTER TABLE public.ev_chargers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chargers public read" ON public.ev_chargers;
CREATE POLICY "chargers public read" ON public.ev_chargers
  FOR SELECT TO authenticated
  USING (true);

-- Open jobs with geography
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  geom geography(POINT, 4326) NOT NULL,
  payout_inr NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'open',
  city TEXT NOT NULL DEFAULT 'Bengaluru',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS jobs_geom_idx ON public.jobs USING GIST (geom);
CREATE INDEX IF NOT EXISTS jobs_status_idx ON public.jobs (status, city);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "jobs read authenticated" ON public.jobs;
CREATE POLICY "jobs read authenticated" ON public.jobs
  FOR SELECT TO authenticated
  USING (status = 'open');

-- Geocode cache (Edge Function writes)
CREATE TABLE IF NOT EXISTS public.geocode_cache (
  cache_key TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + interval '30 days',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.geocode_cache ENABLE ROW LEVEL SECURITY;
-- No client access — service role / Edge Functions only

-- Nearby jobs RPC
CREATE OR REPLACE FUNCTION public.nearby_jobs(
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  radius_m INTEGER DEFAULT 5000
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  payout_inr NUMERIC,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  distance_m DOUBLE PRECISION
)
LANGUAGE SQL STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    j.id,
    j.title,
    j.payout_inr,
    ST_Y(j.geom::geometry) AS lat,
    ST_X(j.geom::geometry) AS lng,
    ST_Distance(j.geom, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography) AS distance_m
  FROM public.jobs j
  WHERE j.status = 'open'
    AND ST_DWithin(
      j.geom,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius_m
    )
  ORDER BY j.geom <-> ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
  LIMIT 50;
$$;

GRANT EXECUTE ON FUNCTION public.nearby_jobs TO authenticated;

-- Upsert worker location RPC
CREATE OR REPLACE FUNCTION public.upsert_worker_location(
  p_lat DOUBLE PRECISION,
  p_lng DOUBLE PRECISION,
  p_heading REAL DEFAULT NULL,
  p_speed_mps REAL DEFAULT NULL,
  p_on_shift BOOLEAN DEFAULT true
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  wid UUID;
BEGIN
  SELECT id INTO wid FROM public.worker_profiles WHERE user_id = auth.uid() LIMIT 1;
  IF wid IS NULL THEN
    RAISE EXCEPTION 'worker profile not found';
  END IF;

  INSERT INTO public.worker_locations (worker_id, geom, heading, speed_mps, on_shift, updated_at)
  VALUES (
    wid,
    ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
    p_heading,
    p_speed_mps,
    p_on_shift,
    now()
  )
  ON CONFLICT (worker_id) DO UPDATE SET
    geom = EXCLUDED.geom,
    heading = EXCLUDED.heading,
    speed_mps = EXCLUDED.speed_mps,
    on_shift = EXCLUDED.on_shift,
    updated_at = now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_worker_location TO authenticated;

-- Seed demo jobs (Bengaluru) — idempotent
INSERT INTO public.jobs (title, geom, payout_inr, city)
SELECT v.title, ST_SetSRID(ST_MakePoint(v.lng, v.lat), 4326)::geography, v.payout, 'Bengaluru'
FROM (VALUES
  ('Swiggy delivery — Indiranagar', 77.6412, 12.9719, 185.00),
  ('Rapido ride — Koramangala', 77.6245, 12.9352, 220.00),
  ('Zomato batch — MG Road', 77.6050, 12.9756, 165.00),
  ('EV shuttle — Whitefield', 77.7500, 12.9698, 310.00),
  ('Last-mile — HSR Layout', 77.6473, 12.9116, 140.00),
  ('Fleet swap — Electronic City', 77.6603, 12.8456, 275.00)
) AS v(title, lng, lat, payout)
WHERE NOT EXISTS (SELECT 1 FROM public.jobs LIMIT 1);
