-- Mobility ops schema: vehicles, route cache, demand heatmaps, operator RPCs

-- Fleet vehicles (linked to workers)
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  vehicle_type TEXT NOT NULL DEFAULT '2W',
  is_ev BOOLEAN NOT NULL DEFAULT false,
  battery_pct REAL,
  registration TEXT,
  geom geography(POINT, 4326),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS vehicles_worker_idx ON public.vehicles (worker_id);
CREATE INDEX IF NOT EXISTS vehicles_geom_idx ON public.vehicles USING GIST (geom);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vehicles self manage" ON public.vehicles;
CREATE POLICY "vehicles self manage" ON public.vehicles
  FOR ALL
  USING (public.owns_worker(worker_id))
  WITH CHECK (public.owns_worker(worker_id));

DROP POLICY IF EXISTS "vehicles operator read" ON public.vehicles;
CREATE POLICY "vehicles operator read" ON public.vehicles
  FOR SELECT
  USING (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', 'worker')
      IN ('operator', 'admin', 'founder')
  );

-- Route cache (Edge Function writes — no client access)
CREATE TABLE IF NOT EXISTS public.route_cache (
  cache_key TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS route_cache_expires_idx ON public.route_cache (expires_at);

ALTER TABLE public.route_cache ENABLE ROW LEVEL SECURITY;
-- No policies — service role only

-- Demand heatmap grid (city intelligence)
CREATE TABLE IF NOT EXISTS public.demand_heatmap (
  id SERIAL PRIMARY KEY,
  city TEXT NOT NULL DEFAULT 'Bengaluru',
  zone_name TEXT NOT NULL,
  demand_level TEXT NOT NULL DEFAULT 'MED',
  geom geography(POINT, 4326) NOT NULL,
  weight REAL NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS demand_heatmap_geom_idx ON public.demand_heatmap USING GIST (geom);
CREATE INDEX IF NOT EXISTS demand_heatmap_city_idx ON public.demand_heatmap (city);

ALTER TABLE public.demand_heatmap ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "heatmap read authenticated" ON public.demand_heatmap;
CREATE POLICY "heatmap read authenticated" ON public.demand_heatmap
  FOR SELECT TO authenticated
  USING (true);

-- Geocode rate limits (Edge Function)
CREATE TABLE IF NOT EXISTS public.geocode_rate_limits (
  user_id UUID NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, window_start)
);

ALTER TABLE public.geocode_rate_limits ENABLE ROW LEVEL SECURITY;
-- No client policies

-- Realtime on worker_locations for ops dashboard
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'worker_locations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.worker_locations;
  END IF;
END $$;

-- Live workers in bbox (operators)
CREATE OR REPLACE FUNCTION public.workers_in_bbox(
  min_lat DOUBLE PRECISION,
  min_lng DOUBLE PRECISION,
  max_lat DOUBLE PRECISION,
  max_lng DOUBLE PRECISION
)
RETURNS TABLE (
  worker_id UUID,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  heading REAL,
  speed_mps REAL,
  on_shift BOOLEAN,
  updated_at TIMESTAMPTZ
)
LANGUAGE SQL STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    wl.worker_id,
    ST_Y(wl.geom::geometry) AS lat,
    ST_X(wl.geom::geometry) AS lng,
    wl.heading,
    wl.speed_mps,
    wl.on_shift,
    wl.updated_at
  FROM public.worker_locations wl
  WHERE wl.on_shift = true
    AND wl.geom && ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)::geography;
$$;

GRANT EXECUTE ON FUNCTION public.workers_in_bbox TO authenticated;

-- Hotspot analytics (demand grid + active workers)
CREATE OR REPLACE FUNCTION public.hotspot_analytics(
  p_city TEXT DEFAULT 'Bengaluru'
)
RETURNS TABLE (
  zone_name TEXT,
  demand_level TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  weight REAL,
  active_workers BIGINT
)
LANGUAGE SQL STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    dh.zone_name,
    dh.demand_level,
    ST_Y(dh.geom::geometry) AS lat,
    ST_X(dh.geom::geometry) AS lng,
    dh.weight,
    (
      SELECT COUNT(*)
      FROM public.worker_locations wl
      WHERE wl.on_shift = true
        AND ST_DWithin(wl.geom, dh.geom, 2000)
    ) AS active_workers
  FROM public.demand_heatmap dh
  WHERE dh.city = p_city
  ORDER BY dh.weight DESC;
$$;

GRANT EXECUTE ON FUNCTION public.hotspot_analytics TO authenticated;

-- Seed Bengaluru demand heatmap (idempotent)
INSERT INTO public.demand_heatmap (zone_name, demand_level, geom, weight, city)
SELECT v.zone_name, v.demand_level, ST_SetSRID(ST_MakePoint(v.lng, v.lat), 4326)::geography, v.weight, 'Bengaluru'
FROM (VALUES
  ('Indiranagar', 'HIGH', 77.6412, 12.9719, 1.0),
  ('Koramangala', 'HIGH', 77.6245, 12.9352, 1.0),
  ('Whitefield', 'MED', 77.7500, 12.9698, 0.7),
  ('HSR Layout', 'MED', 77.6473, 12.9116, 0.7),
  ('MG Road', 'HIGH', 77.6050, 12.9756, 0.9),
  ('Electronic City', 'LOW', 77.6603, 12.8456, 0.4)
) AS v(zone_name, demand_level, lng, lat, weight)
WHERE NOT EXISTS (SELECT 1 FROM public.demand_heatmap LIMIT 1);
