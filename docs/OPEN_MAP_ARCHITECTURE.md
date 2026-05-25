# GigAI Bharat — Open Map Architecture (Production Runbook)

**Status:** Production-ready open stack — zero Google Maps dependency  
**Live:** [www.bharatgig.live](https://www.bharatgig.live) · [app.bharatgig.live](https://app.bharatgig.live)  
**Supabase project:** `jsdmmskzwnqhmxboergf`  
**Last updated:** 2026-05-25

This document is the single source of truth for Phases 1–9 of the open mobility infrastructure. No placeholders — every path, command, and env var maps to code in this repo.

---

## 1. Exact folder structure

```
gigai-bharat/
├── apps/
│   ├── marketing/                         # TanStack Start SSR — zero map secrets
│   │   ├── src/routes/                    # Public investor site
│   │   └── vercel.json                    # CSP, HSTS, domain redirects
│   │
│   ├── worker/                            # @gigai/worker — driver PWA + Capacitor
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── MiniMap.tsx            # Dashboard map preview (MapLibre)
│   │   │   │   └── PlacePicker.tsx        # Photon geocoder autocomplete
│   │   │   ├── hooks/
│   │   │   │   ├── useGeolocation.ts      # GPS + Supabase location sync
│   │   │   │   ├── useNearbyJobs.ts       # PostGIS nearby_jobs RPC
│   │   │   │   ├── useEvChargers.ts       # OCM via ev-nearby Edge Function
│   │   │   │   └── useRoute.ts            # ORS/OSRM via route-optimize
│   │   │   ├── lib/maps/config.ts         # Map style, proxies, BLR hotspots
│   │   │   └── pages/MapPage.tsx          # Full ops map (heatmap, EV, routes)
│   │   └── vercel.json                    # SPA routing + CSP for OSM tiles
│   │
│   └── admin/                             # @gigai/admin — city ops console
│       └── src/
│           ├── pages/OpsMapPage.tsx       # Live worker map + Realtime
│           ├── pages/AnalyticsPage.tsx    # ECharts operational analytics
│           └── stores/mapFilters.ts       # Zustand map layer toggles
│
├── packages/
│   ├── geo/                               # @gigai/geo — shared LatLng, Job, Charger types
│   │   └── src/index.ts
│   ├── maps/                              # @gigai/maps — reusable map stack
│   │   └── src/
│   │       ├── maplibre/createMap.ts      # createGigMap, markers, heatmap, routes
│   │       ├── geocode/photon.ts          # Photon + proxy + Nominatim reverse
│   │       ├── routing/haversine.ts       # OSRM fallback + formatters
│   │       ├── geofence/pointInPolygon.ts # Turf geofencing (Koramangala demo)
│   │       └── ev/openChargeMap.ts        # OCM client helpers
│   └── types/                             # @gigai/types — Supabase generated types
│
├── supabase/
│   ├── migrations/
│   │   ├── 20260525180000_maps_ev_intel.sql      # PostGIS core: jobs, chargers, locations
│   │   └── 20260525190000_mobility_ops_schema.sql # vehicles, routes, heatmaps, RPCs
│   └── functions/
│       ├── geocode-proxy/               # Photon + rate limit + geocode_cache
│       ├── route-optimize/              # ORS + OSRM + route_cache
│       ├── ev-nearby/                   # OpenChargeMap live lookup
│       ├── sync-chargers/               # Cron: OCM → ev_chargers table
│       └── parse-earning/               # OCR (existing)
│
├── scripts/
│   ├── sync-supabase-vercel-env.mjs     # Push env to Vercel worker + admin
│   └── health-check-production.mjs      # Post-deploy smoke tests
│
└── docs/
    ├── OPEN_MAP_ARCHITECTURE.md         # This file
    └── OPEN_INFRA_STACK.md              # Extended API catalog + scaling
```

---

## 2. Exact package architecture

| Package | NPM name | Depends on | Consumed by |
|---------|----------|------------|-------------|
| Geo types | `@gigai/geo` | — | maps, worker, admin |
| Map stack | `@gigai/maps` | geo, maplibre-gl, @turf/turf | worker, admin |
| DB types | `@gigai/types` | — | admin |
| UI primitives | `@gigai/ui` | — | admin, marketing |
| Worker app | `@gigai/worker` | geo, maps, supabase, tanstack-query | Vercel SPA |
| Admin app | `@gigai/admin` | geo, maps, echarts, zustand | Vercel SPA |
| Marketing | `@gigai/marketing` | — (no Supabase) | Vercel SSR |

**Dependency rule:** `apps/* → packages/*` only. Never import sibling apps.

**Install (monorepo root):**

```powershell
npm install
npm install maplibre-gl @turf/turf -w @gigai/worker
npm install echarts zustand maplibre-gl -w @gigai/admin
```

---

## 3. Exact map architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (MapLibre GL)                      │
│  createGigMap() → OpenFreeMap dark style (vector tiles)         │
│  Layers: heatmap | circle markers | route line | geofence      │
└────────────┬────────────────────────────────────────────────────┘
             │
    ┌────────┴────────┬─────────────────┬──────────────────┐
    ▼                 ▼                 ▼                  ▼
 Photon           OpenRouteService    OSRM public      OpenChargeMap
 (geocode)        (routing primary)   (routing fallback) (EV POIs)
    │                 │                 │                  │
    └────────► Supabase Edge Functions ◄─┴──────────────────┘
                      │
              geocode_cache │ route_cache │ ev_chargers
                      │
              Postgres + PostGIS (geography POINT, GIST indexes)
                      │
              Realtime → admin OpsMapPage worker markers
```

### Map style

| Env var | Production value |
|---------|------------------|
| `VITE_MAP_STYLE_URL` | `https://tiles.openfreemap.org/styles/dark` |

### Client API (`@gigai/maps`)

| Export | Purpose |
|--------|---------|
| `createGigMap(container, opts)` | Initialize MapLibre with dark OSM style |
| `addCircleMarker(map, id, points[])` | Worker/job/EV/hotspot markers |
| `addHeatmapLayer(map, id, points[])` | Demand density visualization |
| `addRouteLine(map, id, geometry)` | Cyan route polyline from ORS/OSRM |
| `searchPlaces(q, { proxyUrl })` | Photon autocomplete via Edge Function |
| `isInsideGeofence(point, ring)` | Turf point-in-polygon |
| `getRoute(origin, dest)` | OSRM direct fallback |

### Worker map routes

| Route | Component | Features |
|-------|-----------|----------|
| `/map` | `MapPage.tsx` | Live GPS, heatmap, jobs, EV toggle, routing |
| Dashboard | `MiniMap.tsx` | Preview link to full map |

---

## 4. Exact Supabase setup

### Enable PostGIS

Already in migration `20260525180000_maps_ev_intel.sql`:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### Tables

| Table | Purpose | RLS |
|-------|---------|-----|
| `worker_locations` | Live GPS (geography POINT) | Worker writes own; operators read |
| `jobs` | Open gigs with location | Authenticated read (open status) |
| `ev_chargers` | OCM cache | Authenticated read |
| `geocode_cache` | Photon results (30d TTL) | Service role only |
| `route_cache` | Route polylines (7d TTL) | Service role only |
| `geocode_rate_limits` | 30 req/min/user | Service role only |
| `vehicles` | Fleet linked to workers | Worker self; operators read |
| `demand_heatmap` | City demand grid | Authenticated read |

### RPC functions

| Function | Args | Returns |
|----------|------|---------|
| `nearby_jobs(lat, lng, radius_m)` | Center + radius | Jobs sorted by distance |
| `upsert_worker_location(p_lat, p_lng, ...)` | GPS coords | Upserts worker row |
| `workers_in_bbox(min_lat, min_lng, max_lat, max_lng)` | Bbox | On-shift workers |
| `hotspot_analytics(p_city)` | City name | Zones + active worker counts |

### Realtime

`worker_locations` is added to `supabase_realtime` publication (migration `20260525190000`).

### Apply migrations

```powershell
supabase link --project-ref jsdmmskzwnqhmxboergf
supabase db push
supabase gen types typescript --linked > packages/types/src/database.ts
```

---

## 5. Exact migration SQL

**File 1:** `supabase/migrations/20260525180000_maps_ev_intel.sql`  
Creates: PostGIS, `worker_locations`, `ev_chargers`, `jobs`, `geocode_cache`, `nearby_jobs`, `upsert_worker_location`, demo job seeds.

**File 2:** `supabase/migrations/20260525190000_mobility_ops_schema.sql`  
Creates: `vehicles`, `route_cache`, `demand_heatmap`, `geocode_rate_limits`, Realtime publication, `workers_in_bbox`, `hotspot_analytics`, BLR heatmap seeds.

---

## 6. Exact API routes (Edge Functions)

| Function | Method | Auth | Query/Body | Response |
|----------|--------|------|------------|----------|
| `geocode-proxy` | GET | JWT | `?q=indiranagar&lat=12.97&lon=77.59&limit=5` | `{ suggestions[], cached }` |
| `route-optimize` | POST | JWT header | `{ origin: {lat,lng}, destination: {lat,lng} }` | `{ distanceM, durationS, geometry, provider }` |
| `ev-nearby` | GET | Optional | `?lat=12.97&lng=77.59&radius=10` | `{ chargers[] }` |
| `sync-chargers` | POST | Service role | — | `{ synced: N }` |

### Deploy commands

```powershell
supabase functions deploy geocode-proxy
supabase functions deploy route-optimize
supabase functions deploy ev-nearby
supabase functions deploy sync-chargers

supabase secrets set `
  OPENROUTESERVICE_API_KEY=your_ors_key `
  OPENCHARGEMAP_API_KEY=your_ocm_key `
  RATE_LIMIT_GEO_PER_MIN=30
```

### Cron (sync chargers daily)

In Supabase Dashboard → Database → Extensions → enable `pg_cron`, then:

```sql
SELECT cron.schedule(
  'sync-chargers-daily',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://jsdmmskzwnqhmxboergf.supabase.co/functions/v1/sync-chargers',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
```

Or invoke manually:

```powershell
curl -X POST "https://jsdmmskzwnqhmxboergf.supabase.co/functions/v1/sync-chargers" `
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

---

## 7. Exact environment variables

### Worker + Admin (Vercel + `.env.local`)

```bash
VITE_SUPABASE_URL=https://jsdmmskzwnqhmxboergf.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...your_anon_key
VITE_SUPABASE_PROJECT_ID=jsdmmskzwnqhmxboergf

VITE_MAP_STYLE_URL=https://tiles.openfreemap.org/styles/dark
VITE_MAP_DEFAULT_LAT=12.9716
VITE_MAP_DEFAULT_LNG=77.5946
VITE_MAP_DEFAULT_ZOOM=12

VITE_ALLOW_INVESTOR_DEMO=false   # true only for demo builds
```

Proxy URLs default to `{VITE_SUPABASE_URL}/functions/v1/{geocode-proxy|route-optimize|ev-nearby}` — override only if using a custom gateway.

### Supabase Edge Function secrets

```bash
OPENROUTESERVICE_API_KEY=    # Free at openrouteservice.org
OPENCHARGEMAP_API_KEY=       # Free at openchargemap.org
RATE_LIMIT_GEO_PER_MIN=30
DATA_GOV_IN_API_KEY=         # Optional — data.gov.in
```

### Marketing (no Supabase, no map keys)

```bash
VITE_SITE_URL=https://www.bharatgig.live
RESEND_API_KEY=re_...
EMAIL_FROM=GigAI Bharat <no-reply@bharatgig.live>
```

### GitHub Actions secrets

```bash
VERCEL_TOKEN=
VERCEL_ORG_ID=
VERCEL_MARKETING_PROJECT_ID=
VERCEL_WORKER_PROJECT_ID=
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
SUPABASE_ACCESS_TOKEN=       # For CI db push
```

### REMOVED — do not set

```bash
# VITE_GOOGLE_MAPS_API_KEY=
# VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY=
```

---

## 8. Exact deployment steps

### Local dev

```powershell
git clone https://github.com/pachihumbi/gigai-bharat.git
cd gigai-bharat
npm install
cp .env.example .env.local
cp apps/worker/.env.example apps/worker/.env.local
# Edit keys
npm run dev:worker    # http://localhost:8080
npm run dev:admin     # http://localhost:5174 (check vite port)
```

### Production deploy sequence

```powershell
# 1. Verify locally
npm run typecheck
npm run build -w @gigai/worker
npm run build -w @gigai/admin

# 2. Push database (if migrations changed)
supabase db push --linked

# 3. Deploy Edge Functions (if changed)
supabase functions deploy

# 4. Sync env to Vercel
node scripts/sync-supabase-vercel-env.mjs

# 5. Push to main → GitHub Actions deploys marketing + worker
git push origin main

# 6. Smoke test
npm run health:production
```

### Vercel project mapping

| Domain | Project | Root Directory |
|--------|---------|----------------|
| www.bharatgig.live | gigai-bharat-marketing | apps/marketing |
| app.bharatgig.live | gigai-bharat-worker | apps/worker |
| admin.bharatgig.live | gigai-bharat-admin | apps/admin |

---

## 9. Exact security setup

### Content-Security-Policy (worker)

Configured in `apps/worker/vercel.json`:

- `connect-src` allows: Supabase, OpenFreeMap tiles, Photon, Nominatim, OSRM, ORS, OpenChargeMap
- No `maps.googleapis.com` or `googleapis.com/maps` entries
- `frame-ancestors 'none'`, HSTS preload enabled

### Marketing CSP

`apps/marketing/src/lib/security-headers.server.ts` — no map providers needed.

### RLS policies

| Table | Worker | Operator/Admin |
|-------|--------|-----------------|
| worker_locations | CRUD own | SELECT all on-shift |
| jobs | SELECT open | SELECT all |
| ev_chargers | SELECT | SELECT |
| vehicles | CRUD own | SELECT |
| geocode_cache | — | — (service role) |

### Rate limiting

- Geocode: 30 req/min/user via `geocode_rate_limits` table
- Route: cached 7 days per origin-destination pair
- EV: proxied server-side (API key never in client)

### Secret hygiene

- Service role key: Supabase Edge Functions + CI only
- Anon key: client apps (RLS enforced)
- No secrets in marketing app

---

## 10. Exact scaling roadmap

| Stage | MAU | Infrastructure | Est. cost |
|-------|-----|----------------|-----------|
| **Demo** | 0–500 | Supabase free, Vercel hobby, public OSM/OSRM | ₹0 |
| **Pilot** | 500–5K | Supabase Pro, ORS 2K/day + route_cache, OCM daily sync | ₹1.5K/mo |
| **City** | 5K–50K | Self-host Protomaps on Cloudflare R2, read replica | ₹8K/mo |
| **Multi-city** | 50K–500K | Dedicated OSRM, self-host Nominatim, partition by city | ₹40K/mo |
| **National** | 500K+ | Tile CDN farm, NATS/Redpanda event bus, ledger sharding | Custom |

### Caching layers

| Data | Store | TTL |
|------|-------|-----|
| Geocode | `geocode_cache` | 30 days |
| Routes | `route_cache` | 7 days |
| EV POIs | `ev_chargers` | Daily cron sync |
| Map tiles | CDN (OpenFreeMap) | Browser + edge cache |

### When to self-host

1. **>2K routes/day** → deploy OSRM on Fly.io/Railway
2. **>50K map loads/day** → Protomaps PMTiles on R2
3. **>100K geocode/day** → self-host Photon/Nominatim mirror

---

## Phase completion status

| Phase | Status | Key artifacts |
|-------|--------|---------------|
| 1 — Remove Google Maps | ✅ Done | `loadGoogleMaps.ts` deleted; MapLibre everywhere |
| 2 — Open map stack | ✅ Done | `@gigai/maps`, MapPage, PlacePicker, MiniMap |
| 3 — Supabase + PostGIS | ✅ Done | 2 migrations, RLS, Realtime |
| 4 — API layer | ✅ Done | 4 Edge Functions + caching + rate limits |
| 5 — AI ops dashboard | ✅ Done | Admin OpsMapPage + AnalyticsPage (ECharts + Zustand) |
| 6 — Open APIs | ✅ Partial | OCM live; data.gov.in hook ready via env |
| 7 — Security | ✅ Done | CSP, RLS, rate limits, HSTS |
| 8 — Production deploy | ✅ Done | GitHub Actions + Vercel + health checks |
| 9 — Documentation | ✅ Done | This file + OPEN_INFRA_STACK.md |

---

## Investor demo checklist (60 seconds)

1. Open **https://app.bharatgig.live/demo** on mobile 4G
2. Navigate to **Map** → dark OSM map, orange demand zones, cyan live dot
3. Toggle **EV** → green charger pins (OCM or demo fallback)
4. Tap a **Nearby job** → route draws, shows ₹ payout + ETA
5. Show **www.bharatgig.live** on laptop for narrative
6. Mention: *"Zero Google Maps billing — entire stack is open source"*

---

*Maintained by GigAI Bharat engineering. Cross-reference: [OPEN_INFRA_STACK.md](./OPEN_INFRA_STACK.md) · [BHARATGIG_LIVE.md](./BHARATGIG_LIVE.md)*
