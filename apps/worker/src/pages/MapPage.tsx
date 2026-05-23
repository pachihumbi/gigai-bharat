/// <reference types="google.maps" />
import { AppShell } from "@/components/AppShell";
import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "@/lib/loadGoogleMaps";
import { useLedger } from "@/hooks/useLedger";
import { Loader2, MapPin, Navigation } from "lucide-react";

// Bengaluru hotspots — high-demand zones for gig workers.
const HOTSPOTS: { name: string; kn: string; lat: number; lng: number; level: "HIGH" | "MED" | "LOW" }[] = [
  { name: "Indiranagar", kn: "ಇಂದಿರಾನಗರ", lat: 12.9719, lng: 77.6412, level: "HIGH" },
  { name: "Koramangala", kn: "ಕೋರಮಂಗಲ", lat: 12.9352, lng: 77.6245, level: "HIGH" },
  { name: "Whitefield", kn: "ವೈಟ್‌ಫೀಲ್ಡ್", lat: 12.9698, lng: 77.7500, level: "MED" },
  { name: "HSR Layout", kn: "ಎಚ್‌ಎಸ್‌ಆರ್", lat: 12.9116, lng: 77.6473, level: "MED" },
  { name: "MG Road", kn: "ಎಂ.ಜಿ. ರಸ್ತೆ", lat: 12.9756, lng: 77.6050, level: "HIGH" },
  { name: "Electronic City", kn: "ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ", lat: 12.8456, lng: 77.6603, level: "LOW" },
];

// Dark UI styles for Google Maps that match our app's neon aesthetic.
const DARK_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0b1220" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#7a8aa0" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0b1220" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a2332" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2a3b52" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0a1a2a" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
];

const levelColor = (l: "HIGH" | "MED" | "LOW") =>
  l === "HIGH" ? "hsl(24 100% 58%)" : l === "MED" ? "hsl(180 95% 50%)" : "hsl(145 70% 50%)";

const MapPage = () => {
  const { worker } = useLedger();
  const ref = useRef<HTMLDivElement | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<typeof HOTSPOTS[number] | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps(["places", "marker"])
      .then((g) => {
        if (cancelled || !ref.current) return;
        const center = worker?.home_lat && worker?.home_lng
          ? { lat: Number(worker.home_lat), lng: Number(worker.home_lng) }
          : { lat: 12.9716, lng: 77.5946 };

        const map = new g.maps.Map(ref.current, {
          center,
          zoom: 12,
          styles: DARK_STYLES,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
        });

        HOTSPOTS.forEach((h) => {
          const marker = new g.maps.Marker({
            position: { lat: h.lat, lng: h.lng },
            map,
            title: h.name,
            icon: {
              path: g.maps.SymbolPath.CIRCLE,
              scale: h.level === "HIGH" ? 14 : h.level === "MED" ? 10 : 7,
              fillColor: levelColor(h.level),
              fillOpacity: 0.85,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
          });
          marker.addListener("click", () => setSelected(h));
        });

        // Worker home marker
        if (worker?.home_lat && worker?.home_lng) {
          new g.maps.Marker({
            position: { lat: Number(worker.home_lat), lng: Number(worker.home_lng) },
            map,
            title: "Home",
            icon: {
              path: g.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              scale: 6,
              fillColor: "hsl(210 100% 60%)",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
          });
        }

        setReady(true);
      })
      .catch((e) => setErr(e.message));
    return () => { cancelled = true; };
  }, [worker?.home_lat, worker?.home_lng]);

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
        <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
          <span className="font-mono-tech text-[10px] px-2 py-1 rounded-md border border-primary/30 bg-background/60 backdrop-blur-md">
            BLR LIVE • {HOTSPOTS.length} ZONES
          </span>
          <span className="font-mono-tech text-[10px] px-2 py-1 rounded-md border border-secondary/30 bg-background/60 backdrop-blur-md text-secondary">
            GMAPS
          </span>
        </div>
      </div>

      {selected && (
        <div className="glass-card p-4 mb-4 border-accent/40 animate-scale-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 grid place-items-center">
              <MapPin className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{selected.name}</p>
              <p className="text-[11px] font-kannada text-muted-foreground">{selected.kn}</p>
              <p className="text-[10px] font-mono-tech mt-1" style={{ color: levelColor(selected.level) }}>
                {selected.level} DEMAND
              </p>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
              target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-accent/15 text-accent border border-accent/40"
            >
              <Navigation className="h-3.5 w-3.5" /> Go
            </a>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {HOTSPOTS.map((h) => (
          <button
            key={h.name}
            onClick={() => setSelected(h)}
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
