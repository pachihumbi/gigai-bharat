import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useLedger } from "@/hooks/useLedger";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useNearbyJobs } from "@/hooks/useNearbyJobs";
import { useEvChargers } from "@/hooks/useEvChargers";
import { useRoute } from "@/hooks/useRoute";
import { BLR_HOTSPOTS, getMapConfig, levelColor, levelRadius } from "@/lib/maps/config";
import {
  addCircleMarker,
  addHeatmapLayer,
  addRouteLine,
  createGigMap,
  flyTo,
  formatDistance,
  formatDuration,
  isInsideGeofence,
  KORAMANGALA_GEOFENCE,
  waitForMapLoad,
  type maplibregl,
} from "@gigai/maps";
import { Battery, Loader2, MapPin, Navigation, Radio, Zap } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";

type Selected =
  | { kind: "hotspot"; data: (typeof BLR_HOTSPOTS)[number] }
  | { kind: "job"; data: { id: string; title: string; lat: number; lng: number; payoutInr?: number; distanceM?: number } };

const MapPage = () => {
  const { worker } = useLedger();
  const mapConfig = getMapConfig();
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<Selected | null>(null);
  const [showEv, setShowEv] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distanceM: number; durationS: number } | null>(null);

  const home = worker?.home_lat && worker?.home_lng
    ? { lat: Number(worker.home_lat), lng: Number(worker.home_lng) }
    : null;

  const center = home ?? mapConfig.defaultCenter;
  const geo = useGeolocation({ track: true, syncToSupabase: true, intervalMs: 20000 });
  const activeCenter = geo.position ?? center;

  const { data: jobs = [] } = useNearbyJobs(activeCenter);
  const { data: chargers = [] } = useEvChargers(activeCenter);
  const routeMutation = useRoute();

  const inKoramangala = geo.position ? isInsideGeofence(geo.position, KORAMANGALA_GEOFENCE) : false;

  useEffect(() => {
    let cancelled = false;
    if (!ref.current) return;

    try {
      const map = createGigMap(ref.current, {
        styleUrl: mapConfig.styleUrl,
        center: activeCenter,
        zoom: mapConfig.defaultZoom,
      });
      mapRef.current = map;

      waitForMapLoad(map).then(() => {
        if (cancelled) return;

        addHeatmapLayer(map, BLR_HOTSPOTS.map((h) => ({ lat: h.lat, lng: h.lng })));
        addCircleMarker(
          map,
          "hotspots",
          BLR_HOTSPOTS.map((h) => ({
            lat: h.lat,
            lng: h.lng,
            color: levelColor(h.level),
            radius: levelRadius(h.level),
            label: h.name,
          })),
        );

        if (home) {
          addCircleMarker(map, "home", [{ ...home, color: "hsl(210 100% 60%)", radius: 8 }]);
        }

        map.on("click", "hotspots-layer", (e) => {
          const f = e.features?.[0];
          if (!f) return;
          const idx = f.id as number;
          const h = BLR_HOTSPOTS[idx];
          if (h) setSelected({ kind: "hotspot", data: h });
        });

        setReady(true);
      }).catch((e) => setErr(e.message));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Map failed");
    }

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    if (geo.position) {
      addCircleMarker(map, "worker", [{ ...geo.position, color: "#22d3ee", radius: 10 }]);
      if (geo.tracking) flyTo(map, geo.position, 13);
    }
  }, [geo.position, geo.tracking, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    addCircleMarker(
      map,
      "jobs",
      jobs.map((j) => ({ lat: j.lat, lng: j.lng, color: "#a78bfa", radius: 9, label: j.title })),
    );
  }, [jobs, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    if (showEv && chargers.length) {
      addCircleMarker(
        map,
        "ev",
        chargers.map((c) => ({ lat: c.lat, lng: c.lng, color: "#34d399", radius: 8, label: c.name })),
      );
    } else if (map.getLayer("ev-layer")) {
      map.removeLayer("ev-layer");
      map.removeSource("ev-source");
    }
  }, [chargers, showEv, ready]);

  const drawRoute = async (dest: { lat: number; lng: number }) => {
    if (!geo.position && !home) return;
    const origin = geo.position ?? home!;
    try {
      const route = await routeMutation.mutateAsync({ origin, destination: dest });
      setRouteInfo({ distanceM: route.distanceM, durationS: route.durationS });
      if (mapRef.current) addRouteLine(mapRef.current, "active-route", route.geometry);
      flyTo(mapRef.current!, dest, 14);
    } catch {
      setRouteInfo(null);
    }
  };

  return (
    <AppShell title="Hotspots" kn="ಬಿಸಿ ತಾಣಗಳು">
      <div className="relative glass-card p-2 mb-4 overflow-hidden h-[440px] animate-fade-in">
        <div ref={ref} className="absolute inset-2 rounded-2xl overflow-hidden bg-background/40" />
        {!ready && !err && (
          <div className="absolute inset-0 grid place-items-center">
            <Loader2 className="h-6 w-6 animate-spin text-secondary" />
          </div>
        )}
        {err && (
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <p className="text-sm text-destructive">{err}</p>
          </div>
        )}
        <div className="absolute top-4 left-4 right-4 flex justify-between gap-2 pointer-events-none">
          <span className="font-mono-tech text-[10px] px-2 py-1 rounded-md border border-primary/30 bg-background/60 backdrop-blur-md">
            BLR LIVE • OSM
          </span>
          <div className="flex gap-1 pointer-events-auto">
            <button
              type="button"
              onClick={() => setShowEv((v) => !v)}
              className={`font-mono-tech text-[10px] px-2 py-1 rounded-md border backdrop-blur-md flex items-center gap-1 ${showEv ? "border-emerald-400/50 text-emerald-300 bg-background/80" : "border-border/50 bg-background/60"}`}
            >
              <Battery className="h-3 w-3" /> EV
            </button>
            {geo.tracking && (
              <span className="font-mono-tech text-[10px] px-2 py-1 rounded-md border border-cyan-400/40 bg-background/60 backdrop-blur-md text-cyan-300 flex items-center gap-1">
                <Radio className="h-3 w-3 animate-pulse" /> LIVE
              </span>
            )}
          </div>
        </div>
        {inKoramangala && (
          <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
            <span className="font-mono-tech text-[10px] px-2 py-1 rounded-md border border-accent/40 bg-accent/10 backdrop-blur-md text-accent">
              GEOFENCE • Koramangala zone
            </span>
          </div>
        )}
      </div>

      {routeInfo && (
        <div className="glass-card p-3 mb-4 border-cyan-500/30 text-xs font-mono-tech flex gap-4">
          <span>{formatDistance(routeInfo.distanceM)}</span>
          <span>{formatDuration(routeInfo.durationS)}</span>
          <span className="text-muted-foreground">OpenRoute/OSRM</span>
        </div>
      )}

      {selected && (
        <div className="glass-card p-4 mb-4 border-accent/40 animate-scale-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 grid place-items-center">
              <MapPin className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">
                {selected.kind === "hotspot" ? selected.data.name : selected.data.title}
              </p>
              {selected.kind === "hotspot" && (
                <>
                  <p className="text-[11px] font-kannada text-muted-foreground">{selected.data.kn}</p>
                  <p className="text-[10px] font-mono-tech mt-1" style={{ color: levelColor(selected.data.level) }}>
                    {selected.data.level} DEMAND
                  </p>
                </>
              )}
              {selected.kind === "job" && selected.data.payoutInr != null && (
                <p className="text-[10px] font-mono-tech mt-1 text-emerald-300">₹{selected.data.payoutInr}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() =>
                drawRoute({
                  lat: selected.kind === "hotspot" ? selected.data.lat : selected.data.lat,
                  lng: selected.kind === "hotspot" ? selected.data.lng : selected.data.lng,
                })
              }
              disabled={routeMutation.isPending}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-accent/15 text-accent border border-accent/40 disabled:opacity-50"
            >
              <Navigation className="h-3.5 w-3.5" /> Route
            </button>
          </div>
        </div>
      )}

      {jobs.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-3.5 w-3.5 text-violet-400" />
            <p className="text-[10px] font-mono-tech uppercase tracking-widest text-violet-300">Nearby jobs</p>
          </div>
          <div className="space-y-2 mb-4">
            {jobs.slice(0, 4).map((j) => (
              <button
                key={j.id}
                type="button"
                onClick={() => setSelected({ kind: "job", data: j })}
                className="w-full glass-card p-3 flex items-center gap-3 text-left active:scale-[0.98] transition"
              >
                <span className="w-3 h-3 rounded-full bg-violet-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight truncate">{j.title}</p>
                  {j.distanceM != null && (
                    <p className="text-[10px] text-muted-foreground">{formatDistance(j.distanceM)} away</p>
                  )}
                </div>
                {j.payoutInr != null && (
                  <span className="text-[10px] font-mono-tech text-emerald-300">₹{j.payoutInr}</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="space-y-2">
        {BLR_HOTSPOTS.map((h) => (
          <button
            key={h.name}
            type="button"
            onClick={() => setSelected({ kind: "hotspot", data: h })}
            className="w-full glass-card p-3 flex items-center gap-3 text-left active:scale-[0.98] transition"
          >
            <span className="w-3 h-3 rounded-full" style={{ background: levelColor(h.level) }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">{h.name}</p>
              <p className="text-[11px] font-kannada text-muted-foreground">{h.kn}</p>
            </div>
            <span className="text-[10px] font-mono-tech" style={{ color: levelColor(h.level) }}>{h.level}</span>
          </button>
        ))}
      </div>
    </AppShell>
  );
};

export default MapPage;
