import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getMapConfig } from "@/lib/maps/config";
import type { EvCharger, LatLng } from "@gigai/geo";

const DEMO_CHARGERS: EvCharger[] = [
  { id: 1, name: "BESCOM Hub — Indiranagar", lat: 12.9784, lng: 77.6408, powerKw: 50, operator: "BESCOM" },
  { id: 2, name: "Tata Power — Koramangala", lat: 12.9308, lng: 77.6228, powerKw: 30, operator: "Tata Power" },
  { id: 3, name: "Ather Grid — HSR", lat: 12.9123, lng: 77.6468, powerKw: 7, operator: "Ather" },
];

export function useEvChargers(center: LatLng | null, radiusKm = 10) {
  const mapConfig = getMapConfig();

  return useQuery({
    queryKey: ["ev-chargers", center?.lat, center?.lng, radiusKm],
    enabled: !!center,
    staleTime: 300_000,
    queryFn: async (): Promise<EvCharger[]> => {
      if (!center) return [];

      const { data: dbRows } = await supabase
        .from("ev_chargers")
        .select("id, name, power_kw, operator, connector_types")
        .limit(50);

      if (dbRows?.length) {
        // PostGIS ST_Y/ST_X not exposed in simple select — use proxy for coords if DB empty geom parse needed
      }

      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      if (mapConfig.evProxyUrl && token) {
        try {
          const params = new URLSearchParams({
            lat: String(center.lat),
            lng: String(center.lng),
            radius: String(radiusKm),
          });
          const res = await fetch(`${mapConfig.evProxyUrl}?${params.toString()}`, {
            headers: { Authorization: `Bearer ${token}`, apikey: token },
          });
          if (res.ok) {
            const payload = (await res.json()) as { chargers?: EvCharger[] };
            if (payload.chargers?.length) return payload.chargers;
          }
        } catch {
          // fallback demo
        }
      }

      return DEMO_CHARGERS;
    },
  });
}
