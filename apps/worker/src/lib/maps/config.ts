import { getWorkerEnv } from "@/lib/env";

export type MapConfig = {
  styleUrl: string;
  defaultCenter: { lat: number; lng: number };
  defaultZoom: number;
  geoProxyUrl?: string;
  routeProxyUrl?: string;
  evProxyUrl?: string;
};

export function getMapConfig(): MapConfig {
  const env = getWorkerEnv();
  const supabaseUrl = env.supabaseUrl.replace(/\/$/, "");

  return {
    styleUrl: import.meta.env.VITE_MAP_STYLE_URL ?? "https://tiles.openfreemap.org/styles/dark",
    defaultCenter: {
      lat: Number(import.meta.env.VITE_MAP_DEFAULT_LAT ?? 12.9716),
      lng: Number(import.meta.env.VITE_MAP_DEFAULT_LNG ?? 77.5946),
    },
    defaultZoom: Number(import.meta.env.VITE_MAP_DEFAULT_ZOOM ?? 12),
    geoProxyUrl: import.meta.env.VITE_GEO_PROXY_URL ?? `${supabaseUrl}/functions/v1/geocode-proxy`,
    routeProxyUrl: import.meta.env.VITE_ROUTE_PROXY_URL ?? `${supabaseUrl}/functions/v1/route-optimize`,
    evProxyUrl: import.meta.env.VITE_EV_PROXY_URL ?? `${supabaseUrl}/functions/v1/ev-nearby`,
  };
}

export const BLR_HOTSPOTS = [
  { name: "Indiranagar", kn: "ಇಂದಿರಾನಗರ", lat: 12.9719, lng: 77.6412, level: "HIGH" as const },
  { name: "Koramangala", kn: "ಕೋರಮಂಗಲ", lat: 12.9352, lng: 77.6245, level: "HIGH" as const },
  { name: "Whitefield", kn: "ವೈಟ್‌ಫೀಲ್ಡ್", lat: 12.9698, lng: 77.7500, level: "MED" as const },
  { name: "HSR Layout", kn: "ಎಚ್‌ಎಸ್‌ಆರ್", lat: 12.9116, lng: 77.6473, level: "MED" as const },
  { name: "MG Road", kn: "ಎಂ.ಜಿ. ರಸ್ತೆ", lat: 12.9756, lng: 77.6050, level: "HIGH" as const },
  { name: "Electronic City", kn: "ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ", lat: 12.8456, lng: 77.6603, level: "LOW" as const },
];

export const levelColor = (l: "HIGH" | "MED" | "LOW") =>
  l === "HIGH" ? "hsl(24 100% 58%)" : l === "MED" ? "hsl(180 95% 50%)" : "hsl(145 70% 50%)";

export const levelRadius = (l: "HIGH" | "MED" | "LOW") =>
  l === "HIGH" ? 14 : l === "MED" ? 10 : 7;
