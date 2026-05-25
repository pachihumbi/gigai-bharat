// Cron: sync OpenChargeMap POIs → ev_chargers table (Bengaluru bbox).
// Invoke via Supabase cron or: curl -X POST .../sync-chargers -H "Authorization: Bearer SERVICE_ROLE"

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

const BLR = { lat: 12.9716, lng: 77.5946, radiusKm: 25 };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  const authHeader = req.headers.get("Authorization") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!authHeader.includes(serviceKey)) {
    return json({ error: "Service role required" }, 401);
  }

  const apiKey = Deno.env.get("OPENCHARGEMAP_API_KEY");
  if (!apiKey) return json({ error: "OPENCHARGEMAP_API_KEY not configured" }, 503);

  const params = new URLSearchParams({
    key: apiKey,
    latitude: String(BLR.lat),
    longitude: String(BLR.lng),
    distance: String(BLR.radiusKm),
    distanceunit: "KM",
    maxresults: "200",
    compact: "true",
    verbose: "false",
  });

  try {
    const res = await fetch(`https://api.openchargemap.io/v3/poi/?${params.toString()}`);
    if (!res.ok) throw new Error(`OCM ${res.status}`);
    const pois = (await res.json()) as Array<Record<string, unknown>>;

    const service = createClient(
      Deno.env.get("SUPABASE_URL")!,
      serviceKey,
    );

    const rows = pois
      .map((p) => {
        const info = p.AddressInfo as Record<string, unknown> | undefined;
        if (!info?.Latitude || !info?.Longitude || !p.ID) return null;
        const conns = (p.Connections as Array<Record<string, unknown>> | undefined) ?? [];
        return {
          id: p.ID as number,
          name: (info.Title as string) ?? "EV Charger",
          geom: { type: "Point", coordinates: [info.Longitude as number, info.Latitude as number] },
          power_kw: (conns[0]?.PowerKW as number | undefined) ?? null,
          operator: ((p.OperatorInfo as Record<string, unknown> | undefined)?.Title as string) ?? null,
          connector_types: conns
            .map((c) => ((c.ConnectionType as Record<string, unknown> | undefined)?.Title as string))
            .filter(Boolean),
          ocm_raw: p,
          updated_at: new Date().toISOString(),
        };
      })
      .filter(Boolean);

    if (!rows.length) return json({ synced: 0, warning: "No POIs returned" });

    const { error } = await service.from("ev_chargers").upsert(rows, { onConflict: "id" });
    if (error) throw error;

    return json({ synced: rows.length, city: "Bengaluru", radiusKm: BLR.radiusKm });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Sync failed" }, 502);
  }
});
