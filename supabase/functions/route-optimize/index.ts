// Route optimization proxy — OpenRouteService with OSRM fallback.
// POST { origin: { lat, lng }, destination: { lat, lng } }

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

type LatLng = { lat: number; lng: number };

async function routeOrs(origin: LatLng, destination: LatLng, apiKey: string) {
  const res = await fetch("https://api.openrouteservice.org/v2/directions/driving-car/geojson", {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coordinates: [
        [origin.lng, origin.lat],
        [destination.lng, destination.lat],
      ],
    }),
  });
  if (!res.ok) throw new Error(`ORS ${res.status}`);
  const data = await res.json();
  const feature = data.features?.[0];
  if (!feature) throw new Error("No ORS route");
  const props = feature.properties?.summary ?? feature.properties?.segments?.[0];
  return {
    distanceM: props?.distance ?? 0,
    durationS: props?.duration ?? 0,
    geometry: feature.geometry as GeoJSON.LineString,
  };
}

async function routeOsrm(origin: LatLng, destination: LatLng) {
  const url =
    `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OSRM ${res.status}`);
  const data = await res.json();
  const route = data.routes?.[0];
  if (!route) throw new Error("No OSRM route");
  return {
    distanceM: route.distance,
    durationS: route.duration,
    geometry: route.geometry as GeoJSON.LineString,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  if (!req.headers.get("Authorization")) return json({ error: "Unauthorized" }, 401);

  let body: { origin?: LatLng; destination?: LatLng };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { origin, destination } = body;
  if (!origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng) {
    return json({ error: "origin and destination required" }, 400);
  }

  const orsKey = Deno.env.get("OPENROUTESERVICE_API_KEY");

  const service = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const cacheKey = `route:${origin.lat.toFixed(5)},${origin.lng.toFixed(5)}:${destination.lat.toFixed(5)},${destination.lng.toFixed(5)}`;

  const { data: cached } = await service
    .from("route_cache")
    .select("payload")
    .eq("cache_key", cacheKey)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (cached?.payload) {
    return json({ ...(cached.payload as Record<string, unknown>), cached: true });
  }

  try {
    const route = orsKey
      ? await routeOrs(origin, destination, orsKey)
      : await routeOsrm(origin, destination);

    await service.from("route_cache").upsert({
      cache_key: cacheKey,
      payload: route,
      expires_at: new Date(Date.now() + 604_800_000).toISOString(),
    });

    return json({ ...route, provider: orsKey ? "openrouteservice" : "osrm", cached: false });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Route failed" }, 502);
  }
});
