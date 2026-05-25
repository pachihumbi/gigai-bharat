import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getMapConfig } from "@/lib/maps/config";
import { getRoute as getRouteDirect } from "@gigai/maps";
import type { LatLng, RouteResult } from "@gigai/geo";

export function useRoute() {
  const mapConfig = getMapConfig();

  return useMutation({
    mutationFn: async ({
      origin,
      destination,
    }: {
      origin: LatLng;
      destination: LatLng;
    }): Promise<RouteResult> => {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      if (mapConfig.routeProxyUrl && token) {
        try {
          const res = await fetch(mapConfig.routeProxyUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              apikey: token,
            },
            body: JSON.stringify({ origin, destination }),
          });
          if (res.ok) {
            const data = await res.json();
            return {
              distanceM: data.distanceM,
              durationS: data.durationS,
              geometry: data.geometry,
            };
          }
        } catch {
          // fallback
        }
      }

      return getRouteDirect(origin, destination);
    },
  });
}
