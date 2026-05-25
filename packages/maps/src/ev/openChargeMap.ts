import type { EvCharger, LatLng } from "@gigai/geo";

type OcmPoi = {
  ID: number;
  AddressInfo?: {
    Title?: string;
    Latitude?: number;
    Longitude?: number;
  };
  Connections?: Array<{ PowerKW?: number; ConnectionType?: { Title?: string } }>;
  OperatorInfo?: { Title?: string };
};

export async function fetchOcmNear(
  center: LatLng,
  apiKey: string,
  radiusKm = 10,
): Promise<EvCharger[]> {
  const params = new URLSearchParams({
    key: apiKey,
    latitude: String(center.lat),
    longitude: String(center.lng),
    distance: String(radiusKm),
    distanceunit: "KM",
    maxresults: "50",
    compact: "true",
    verbose: "false",
  });

  const res = await fetch(`https://api.openchargemap.io/v3/poi/?${params.toString()}`);
  if (!res.ok) throw new Error(`OpenChargeMap failed (${res.status})`);

  const pois = (await res.json()) as OcmPoi[];
  return pois
    .filter((p) => p.AddressInfo?.Latitude != null && p.AddressInfo?.Longitude != null)
    .map((p) => ({
      id: p.ID,
      name: p.AddressInfo?.Title ?? "EV Charger",
      lat: p.AddressInfo!.Latitude!,
      lng: p.AddressInfo!.Longitude!,
      powerKw: p.Connections?.[0]?.PowerKW,
      operator: p.OperatorInfo?.Title,
      connectorTypes: p.Connections?.map((c) => c.ConnectionType?.Title).filter(Boolean) as string[],
    }));
}

export async function fetchEvNearViaProxy(
  center: LatLng,
  proxyUrl: string,
  accessToken: string,
  radiusKm = 10,
): Promise<EvCharger[]> {
  const params = new URLSearchParams({
    lat: String(center.lat),
    lng: String(center.lng),
    radius: String(radiusKm),
  });
  const res = await fetch(`${proxyUrl}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}`, apikey: accessToken },
  });
  if (!res.ok) throw new Error(`EV proxy failed (${res.status})`);
  const data = (await res.json()) as { chargers?: EvCharger[] };
  return data.chargers ?? [];
}
