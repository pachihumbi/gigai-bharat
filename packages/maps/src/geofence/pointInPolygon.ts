import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, polygon } from "@turf/helpers";
import type { LatLng } from "@gigai/geo";

/** Check if a point is inside a polygon ring (first/last coordinate must match). */
export function isInsideGeofence(p: LatLng, ring: LatLng[]): boolean {
  if (ring.length < 3) return false;
  const coords = ring.map((c) => [c.lng, c.lat] as [number, number]);
  if (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1]) {
    coords.push(coords[0]);
  }
  return booleanPointInPolygon(point([p.lng, p.lat]), polygon([coords]));
}

/** Bengaluru Koramangala demo geofence (investor demo). */
export const KORAMANGALA_GEOFENCE: LatLng[] = [
  { lat: 12.945, lng: 77.610 },
  { lat: 12.945, lng: 77.640 },
  { lat: 12.925, lng: 77.640 },
  { lat: 12.925, lng: 77.610 },
];

export { booleanPointInPolygon };
