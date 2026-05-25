import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { LatLng, NearbyJob } from "@gigai/geo";

const DEMO_JOBS: NearbyJob[] = [
  { id: "demo-1", title: "Swiggy delivery — Indiranagar", lat: 12.9719, lng: 77.6412, payoutInr: 185 },
  { id: "demo-2", title: "Rapido ride — Koramangala", lat: 12.9352, lng: 77.6245, payoutInr: 220 },
  { id: "demo-3", title: "Zomato batch — MG Road", lat: 12.9756, lng: 77.6050, payoutInr: 165 },
];

export function useNearbyJobs(center: LatLng | null, radiusM = 5000) {
  return useQuery({
    queryKey: ["nearby-jobs", center?.lat, center?.lng, radiusM],
    enabled: !!center,
    staleTime: 30_000,
    queryFn: async (): Promise<NearbyJob[]> => {
      if (!center) return [];

      const { data, error } = await supabase.rpc("nearby_jobs", {
        lat: center.lat,
        lng: center.lng,
        radius_m: radiusM,
      });

      if (error || !data?.length) {
        return DEMO_JOBS.map((j) => ({
          ...j,
          distanceM: Math.round(
            Math.hypot((j.lat - center.lat) * 111_000, (j.lng - center.lng) * 111_000 * Math.cos((center.lat * Math.PI) / 180)),
          ),
        }));
      }

      return (data as Array<Record<string, unknown>>).map((row) => ({
        id: String(row.id),
        title: String(row.title),
        lat: Number(row.lat),
        lng: Number(row.lng),
        payoutInr: row.payout_inr != null ? Number(row.payout_inr) : undefined,
        distanceM: row.distance_m != null ? Number(row.distance_m) : undefined,
      }));
    },
  });
}
