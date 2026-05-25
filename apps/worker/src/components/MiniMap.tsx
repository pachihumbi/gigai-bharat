import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { createGigMap, addCircleMarker, waitForMapLoad } from "@gigai/maps";
import { getMapConfig, BLR_HOTSPOTS, levelColor } from "@/lib/maps/config";
import "maplibre-gl/dist/maplibre-gl.css";

interface Props {
  homeLat?: number | null;
  homeLng?: number | null;
}

export const MiniMap = ({ homeLat, homeLng }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [err, setErr] = useState(false);
  const mapConfig = getMapConfig();

  useEffect(() => {
    let cancelled = false;
    let map: ReturnType<typeof createGigMap> | null = null;
    if (!ref.current) return;

    const center =
      homeLat && homeLng
        ? { lat: homeLat, lng: homeLng }
        : mapConfig.defaultCenter;

    try {
      map = createGigMap(ref.current, {
        styleUrl: mapConfig.styleUrl,
        center,
        zoom: 11,
        interactive: false,
      });

      waitForMapLoad(map).then(() => {
        if (cancelled || !map) return;
        addCircleMarker(
          map,
          "mini-hotspots",
          BLR_HOTSPOTS.slice(0, 3).map((h) => ({
            lat: h.lat,
            lng: h.lng,
            color: levelColor(h.level),
            radius: 8,
          })),
        );
        if (homeLat && homeLng) {
          addCircleMarker(map, "mini-home", [{ lat: homeLat, lng: homeLng, color: "hsl(210 100% 60%)", radius: 6 }]);
        }
      }).catch(() => setErr(true));
    } catch {
      setErr(true);
    }

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [homeLat, homeLng, mapConfig.defaultCenter, mapConfig.styleUrl]);

  return (
    <Link to="/map" className="glass-card p-4 mb-4 block animate-fade-in active:scale-[0.99] transition">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-3.5 w-3.5 text-accent" />
        <p className="text-[10px] font-mono-tech uppercase tracking-widest text-accent">Live Hotspots • OSM</p>
        <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="relative h-32 rounded-xl overflow-hidden bg-background/40 border border-border/50">
        <div ref={ref} className="absolute inset-0" />
        {err && (
          <div className="absolute inset-0 grid place-items-center text-[11px] text-muted-foreground">
            Map unavailable
          </div>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground mt-2">Tap to explore high-demand zones near you.</p>
    </Link>
  );
};
