/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "@/lib/loadGoogleMaps";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";

const DARK_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0b1220" }] },
  { elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a2332" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0a1a2a" }] },
];

const HOTSPOTS = [
  { lat: 12.9719, lng: 77.6412 },
  { lat: 12.9352, lng: 77.6245 },
  { lat: 12.9756, lng: 77.6050 },
];

interface Props {
  homeLat?: number | null;
  homeLng?: number | null;
}

export const MiniMap = ({ homeLat, homeLng }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps(["marker"])
      .then((g) => {
        if (cancelled || !ref.current) return;
        const center = homeLat && homeLng ? { lat: homeLat, lng: homeLng } : { lat: 12.9716, lng: 77.5946 };
        const map = new g.maps.Map(ref.current, {
          center, zoom: 11, styles: DARK_STYLES,
          disableDefaultUI: true, gestureHandling: "none", clickableIcons: false, draggable: false,
        });
        HOTSPOTS.forEach((h) =>
          new g.maps.Marker({
            position: h, map,
            icon: { path: g.maps.SymbolPath.CIRCLE, scale: 8, fillColor: "hsl(24 100% 58%)", fillOpacity: 0.85, strokeColor: "#fff", strokeWeight: 1.5 },
          })
        );
        if (homeLat && homeLng) {
          new g.maps.Marker({
            position: { lat: homeLat, lng: homeLng }, map,
            icon: { path: g.maps.SymbolPath.CIRCLE, scale: 6, fillColor: "hsl(210 100% 60%)", fillOpacity: 1, strokeColor: "#fff", strokeWeight: 2 },
          });
        }
      })
      .catch(() => setErr(true));
    return () => { cancelled = true; };
  }, [homeLat, homeLng]);

  return (
    <Link to="/map" className="glass-card p-4 mb-4 block animate-fade-in active:scale-[0.99] transition">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-3.5 w-3.5 text-accent" />
        <p className="text-[10px] font-mono-tech uppercase tracking-widest text-accent">Live Hotspots • ಬಿಸಿ ತಾಣಗಳು</p>
        <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="relative h-32 rounded-xl overflow-hidden bg-background/40 border border-border/50">
        <div ref={ref} className="absolute inset-0" />
        {err && <div className="absolute inset-0 grid place-items-center text-[11px] text-muted-foreground">Map unavailable</div>}
      </div>
      <p className="text-[11px] text-muted-foreground mt-2">Tap to explore high-demand zones near you.</p>
    </Link>
  );
};
