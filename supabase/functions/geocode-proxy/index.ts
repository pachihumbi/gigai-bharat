// Rate-limited Photon geocode proxy with Postgres cache.
// GET ?q=indiranagar&limit=5&lat=12.97&lon=77.59

import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

type PlaceSuggestion = {
  id: string;
  label: string;
  secondary?: string;
  lat: number;
  lng: number;
};

function formatLabel(props: Record<string, string | undefined>) {
  const parts = [props.name, props.street, props.city, props.state].filter(Boolean);
  return {
    label: parts[0] ?? "Unknown",
    secondary: parts.slice(1).join(", ") || undefined,
  };
}

async function photonSearch(q: string, lat?: string | null, lon?: string | null, limit = 5) {
  const params = new URLSearchParams({ q, limit: String(limit), lang: "en" });
  if (lat) params.set("lat", lat);
  if (lon) params.set("lon", lon);

  const res = await fetch(`https://photon.komoot.io/api/?${params.toString()}`);
  if (!res.ok) throw new Error(`Photon ${res.status}`);
  const data = await res.json();
  const features = (data.features ?? []) as Array<{
    geometry: { coordinates: [number, number] };
    properties: Record<string, string | undefined>;
  }>;

  return features.map((f, i) => {
    const [lng, latC] = f.geometry.coordinates;
    const { label, secondary } = formatLabel(f.properties);
    return { id: `${lng},${latC},${i}`, label, secondary, lat: latC, lng };
  }) satisfies PlaceSuggestion[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "GET") return json({ error: "GET only" }, 405);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Unauthorized" }, 401);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return json({ error: "Unauthorized" }, 401);

  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim();
  if (!q || q.length < 2) return json({ suggestions: [] });

  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 5), 10);
  const cacheKey = `photon:${q.toLowerCase()}:${lat ?? ""}:${lon ?? ""}:${limit}`;

  const service = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const rateLimitPerMin = Number(Deno.env.get("RATE_LIMIT_GEO_PER_MIN") ?? 30);
  const windowStart = new Date();
  windowStart.setSeconds(0, 0);
  const windowIso = windowStart.toISOString();

  const { data: rateRow } = await service
    .from("geocode_rate_limits")
    .select("request_count")
    .eq("user_id", userData.user.id)
    .eq("window_start", windowIso)
    .maybeSingle();

  const count = (rateRow?.request_count ?? 0) + 1;
  if (count > rateLimitPerMin) {
    return json({ error: "Rate limit exceeded", retryAfterSec: 60 }, 429);
  }

  await service.from("geocode_rate_limits").upsert({
    user_id: userData.user.id,
    window_start: windowIso,
    request_count: count,
  });

  const { data: cached } = await service
    .from("geocode_cache")
    .select("payload")
    .eq("cache_key", cacheKey)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (cached?.payload) {
    return json({ suggestions: cached.payload as PlaceSuggestion[], cached: true });
  }

  try {
    const suggestions = await photonSearch(q, lat, lon, limit);
    await service.from("geocode_cache").upsert({
      cache_key: cacheKey,
      payload: suggestions,
      expires_at: new Date(Date.now() + 86400_000 * 30).toISOString(),
    });
    return json({ suggestions, cached: false });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Geocode failed" }, 502);
  }
});
