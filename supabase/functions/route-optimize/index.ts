// Route optimization proxy — OpenRouteService with OSRM fallback.
// POST { origin: { lat, lng }, destination: { lat, lng } }

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

  try {
    if (orsKey) {
      const route = await routeOrs(origin, destination, orsKey);
      return json({ ...route, provider: "openrouteservice" });
    }
    const route = await routeOsrm(origin, destination);
    return json({ ...route, provider: "osrm" });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Route failed" }, 502);
  }
});
