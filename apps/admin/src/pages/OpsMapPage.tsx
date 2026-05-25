import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Radio } from "lucide-react";
import {
  addCircleMarker,
  addHeatmapLayer,
  createGigMap,
  waitForMapLoad,
  type maplibregl,
} from "@gigai/maps";
import { supabase } from "@/lib/supabase";
import { useMapFilters } from "@/stores/mapFilters";
import "maplibre-gl/dist/maplibre-gl.css";

const MAP_STYLE = import.meta.env.VITE_MAP_STYLE_URL ?? "https://tiles.openfreemap.org/styles/dark";
const DEFAULT_CENTER = {
  lat: Number(import.meta.env.VITE_MAP_DEFAULT_LAT ?? 12.9716),
  lng: Number(import.meta.env.VITE_MAP_DEFAULT_LNG ?? 77.5946),
};

const levelColor = (l: string) =>
  l === "HIGH" ? "hsl(24 100% 58%)" : l === "MED" ? "hsl(180 95% 50%)" : "hsl(145 70% 50%)";

export function OpsMapPage() {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [ready, setReady] = useState(false);
  const filters = useMapFilters();

  const { data: hotspots = [] } = useQuery({
    queryKey: ["admin", "hotspots"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("hotspot_analytics", { p_city: "Bengaluru" });
      if (error) throw error;
      return (data ?? []) as Array<{
        zone_name: string;
        demand_level: string;
        lat: number;
        lng: number;
        weight: number;
        active_workers: number;
      }>;
    },
    refetchInterval: 30_000,
  });

  const { data: workers = [] } = useQuery({
    queryKey: ["admin", "live-workers"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("workers_in_bbox", {
        min_lat: 12.7,
        min_lng: 77.3,
        max_lat: 13.2,
        max_lng: 77.9,
      });
      if (error) throw error;
      return (data ?? []) as Array<{
        worker_id: string;
        lat: number;
        lng: number;
        on_shift: boolean;
      }>;
    },
    refetchInterval: 10_000,
  });

  useEffect(() => {
    let cancelled = false;
    if (!ref.current) return;

    const map = createGigMap(ref.current, {
      styleUrl: MAP_STYLE,
      center: DEFAULT_CENTER,
      zoom: 11,
    });
    mapRef.current = map;

    waitForMapLoad(map).then(() => {
      if (cancelled) return;
      setReady(true);
    });

    return () => {
      cancelled = true;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    if (filters.showHeatmap && hotspots.length) {
      addHeatmapLayer(
        map,
        "ops-demand",
        hotspots.map((h) => ({ lat: h.lat, lng: h.lng })),
      );
      addCircleMarker(
        map,
        "ops-zones",
        hotspots.map((h) => ({
          lat: h.lat,
          lng: h.lng,
          color: levelColor(h.demand_level),
          radius: 12,
          label: h.zone_name,
        })),
      );
    } else {
      for (const id of ["ops-demand-heat-layer", "ops-zones-layer"]) {
        if (map.getLayer(id)) map.removeLayer(id);
      }
      for (const id of ["ops-demand-heat-source", "ops-zones-source"]) {
        if (map.getSource(id)) map.removeSource(id);
      }
    }
  }, [filters.showHeatmap, hotspots, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    if (filters.showWorkers && workers.length) {
      addCircleMarker(
        map,
        "ops-workers",
        workers.map((w) => ({
          lat: w.lat,
          lng: w.lng,
          color: "#22d3ee",
          radius: 9,
        })),
      );
    } else if (map.getLayer("ops-workers-layer")) {
      map.removeLayer("ops-workers-layer");
      map.removeSource("ops-workers-source");
    }
  }, [filters.showWorkers, workers, ready]);

  useEffect(() => {
    const channel = supabase
      .channel("admin-worker-locations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "worker_locations" },
        () => {
          void supabase.rpc("workers_in_bbox", {
            min_lat: 12.7,
            min_lng: 77.3,
            max_lat: 13.2,
            max_lng: 77.9,
          });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const activeCount = workers.filter((w) => w.on_shift).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Ops map</h1>
          <p className="mt-1 text-slate-400">
            Live Bengaluru command center — MapLibre + PostGIS + Realtime
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-200">
          <Radio className="h-4 w-4 animate-pulse" />
          {activeCount} workers on shift
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(
          [
            ["showWorkers", "Workers"],
            ["showHeatmap", "Heatmap"],
            ["showEv", "EV (soon)"],
            ["showJobs", "Jobs (soon)"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => filters.set({ [key]: !filters[key] })}
            className={`rounded-lg border px-3 py-1.5 text-xs ${
              filters[key]
                ? "border-brand-saffron/50 bg-brand-saffron/10 text-brand-saffron"
                : "border-white/10 text-slate-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="relative mt-6 h-[520px] overflow-hidden rounded-xl border border-white/10">
        <div ref={ref} className="absolute inset-0" />
        {!ready && (
          <div className="absolute inset-0 grid place-items-center bg-black/40">
            <Loader2 className="h-8 w-8 animate-spin text-brand-saffron" />
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {hotspots.map((h) => (
          <div key={h.zone_name} className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="font-semibold">{h.zone_name}</p>
            <p className="mt-1 text-xs text-slate-400">{h.demand_level} demand</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-brand-saffron">
              {h.active_workers}
              <span className="ml-1 text-sm font-normal text-slate-400">active</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
