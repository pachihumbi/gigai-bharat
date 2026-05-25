export type LatLng = { lat: number; lng: number };

export type GeoPoint = LatLng;

export type DemandLevel = "HIGH" | "MED" | "LOW";

export type Hotspot = LatLng & {
  name: string;
  kn?: string;
  level: DemandLevel;
};

export type PickedPlace = LatLng & {
  address: string;
};

export type PhotonFeature = {
  geometry: { coordinates: [number, number] };
  properties: {
    name?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
};

export type PlaceSuggestion = {
  id: string;
  label: string;
  secondary?: string;
  lat: number;
  lng: number;
};

export type RouteResult = {
  distanceM: number;
  durationS: number;
  geometry: GeoJSON.LineString;
};

export type EvCharger = LatLng & {
  id: number;
  name: string;
  powerKw?: number;
  operator?: string;
  connectorTypes?: string[];
};

export type NearbyJob = LatLng & {
  id: string;
  title: string;
  payoutInr?: number;
  distanceM?: number;
};

export type WorkerLocation = LatLng & {
  workerId: string;
  heading?: number;
  speedMps?: number;
  onShift: boolean;
  updatedAt: string;
};
