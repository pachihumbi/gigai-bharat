// EV chargers nearby — OpenChargeMap proxy (keeps API key server-side).
// GET ?lat=12.97&lng=77.59&radius=10

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "GET") return json({ error: "GET only" }, 405);

  const url = new URL(req.url);
  const lat = Number(url.searchParams.get("lat"));
  const lng = Number(url.searchParams.get("lng"));
  const radius = Math.min(Number(url.searchParams.get("radius") ?? 10), 25);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return json({ error: "lat and lng required" }, 400);
  }

  const apiKey = Deno.env.get("OPENCHARGEMAP_API_KEY");
  if (!apiKey) {
    return json({ chargers: [], warning: "OPENCHARGEMAP_API_KEY not configured" });
  }

  const params = new URLSearchParams({
    key: apiKey,
    latitude: String(lat),
    longitude: String(lng),
    distance: String(radius),
    distanceunit: "KM",
    maxresults: "50",
    compact: "true",
    verbose: "false",
  });

  try {
    const res = await fetch(`https://api.openchargemap.io/v3/poi/?${params.toString()}`);
    if (!res.ok) throw new Error(`OCM ${res.status}`);
    const pois = await res.json();

    const chargers = (pois as Array<Record<string, unknown>>)
      .map((p) => {
        const info = p.AddressInfo as Record<string, unknown> | undefined;
        if (!info?.Latitude || !info?.Longitude) return null;
        const conns = (p.Connections as Array<Record<string, unknown>> | undefined) ?? [];
        return {
          id: p.ID as number,
          name: (info.Title as string) ?? "EV Charger",
          lat: info.Latitude as number,
          lng: info.Longitude as number,
          powerKw: (conns[0]?.PowerKW as number | undefined) ?? undefined,
          operator: ((p.OperatorInfo as Record<string, unknown> | undefined)?.Title as string) ?? undefined,
          connectorTypes: conns
            .map((c) => ((c.ConnectionType as Record<string, unknown> | undefined)?.Title as string))
            .filter(Boolean),
        };
      })
      .filter(Boolean);

    return json({ chargers });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "EV lookup failed" }, 502);
  }
});
