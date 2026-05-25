import type { LatLng } from "@gigai/geo";

const R = 6371000;

export function haversineM(a: LatLng, b: LatLng): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(1)} km`;
}

export function formatDuration(s: number): string {
  const min = Math.round(s / 60);
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const rem = min % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
}

export async function fetchRouteViaProxy(
  origin: LatLng,
  destination: LatLng,
  proxyUrl: string,
  accessToken: string,
): Promise<{ distanceM: number; durationS: number; geometry: GeoJSON.LineString }> {
  const res = await fetch(proxyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      apikey: accessToken,
    },
    body: JSON.stringify({ origin, destination }),
  });
  if (!res.ok) throw new Error(`Route proxy failed (${res.status})`);
  return res.json();
}

export async function fetchOsrmRoute(origin: LatLng, destination: LatLng): Promise<{
  distanceM: number;
  durationS: number;
  geometry: GeoJSON.LineString;
}> {
  const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OSRM route failed (${res.status})`);
  const data = (await res.json()) as {
    routes?: Array<{ distance: number; duration: number; geometry: GeoJSON.LineString }>;
  };
  const route = data.routes?.[0];
  if (!route) throw new Error("No route found");
  return { distanceM: route.distance, durationS: route.duration, geometry: route.geometry };
}

export async function getRoute(
  origin: LatLng,
  destination: LatLng,
  opts?: { proxyUrl?: string; accessToken?: string },
): Promise<{ distanceM: number; durationS: number; geometry: GeoJSON.LineString }> {
  if (opts?.proxyUrl && opts?.accessToken) {
    try {
      return await fetchRouteViaProxy(origin, destination, opts.proxyUrl, opts.accessToken);
    } catch {
      // fallback
    }
  }
  return fetchOsrmRoute(origin, destination);
}
