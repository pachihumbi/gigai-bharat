import type { PlaceSuggestion, PhotonFeature } from "@gigai/geo";

function formatLabel(props: PhotonFeature["properties"]): { label: string; secondary?: string } {
  const parts = [props.name, props.street, props.city, props.state].filter(Boolean);
  const label = parts[0] ?? "Unknown";
  const secondary = parts.slice(1).join(", ") || undefined;
  return { label, secondary };
}

export async function searchPhoton(
  query: string,
  opts?: { lat?: number; lng?: number; limit?: number },
): Promise<PlaceSuggestion[]> {
  const params = new URLSearchParams({
    q: query,
    limit: String(opts?.limit ?? 5),
    lang: "en",
  });
  if (opts?.lat != null && opts?.lng != null) {
    params.set("lat", String(opts.lat));
    params.set("lon", String(opts.lng));
  }

  const res = await fetch(`https://photon.komoot.io/api/?${params.toString()}`);
  if (!res.ok) throw new Error(`Photon geocode failed (${res.status})`);

  const data = (await res.json()) as { features?: PhotonFeature[] };
  return (data.features ?? []).map((f, i) => {
    const [lng, lat] = f.geometry.coordinates;
    const { label, secondary } = formatLabel(f.properties);
    return {
      id: `${lng},${lat},${i}`,
      label,
      secondary,
      lat,
      lng,
    };
  });
}

export async function searchPlacesViaProxy(
  query: string,
  proxyUrl: string,
  accessToken: string,
  opts?: { lat?: number; lng?: number; limit?: number },
): Promise<PlaceSuggestion[]> {
  const params = new URLSearchParams({
    q: query,
    limit: String(opts?.limit ?? 5),
  });
  if (opts?.lat != null) params.set("lat", String(opts.lat));
  if (opts?.lng != null) params.set("lon", String(opts.lng));

  const res = await fetch(`${proxyUrl}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      apikey: accessToken,
    },
  });
  if (!res.ok) throw new Error(`Geocode proxy failed (${res.status})`);
  const data = (await res.json()) as { suggestions?: PlaceSuggestion[] };
  return data.suggestions ?? [];
}

export async function searchPlaces(
  query: string,
  opts?: {
    lat?: number;
    lng?: number;
    limit?: number;
    proxyUrl?: string;
    accessToken?: string;
  },
): Promise<PlaceSuggestion[]> {
  if (opts?.proxyUrl && opts?.accessToken) {
    try {
      return await searchPlacesViaProxy(query, opts.proxyUrl, opts.accessToken, opts);
    } catch {
      // fall through to direct Photon
    }
  }
  return searchPhoton(query, opts);
}

export async function reverseNominatim(lat: number, lng: number): Promise<string> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: "json",
  });
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
    headers: { "User-Agent": "GigAI-Bharat/1.0 (https://www.bharatgig.live)" },
  });
  if (!res.ok) throw new Error("Reverse geocode failed");
  const data = (await res.json()) as { display_name?: string };
  return data.display_name ?? `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}
