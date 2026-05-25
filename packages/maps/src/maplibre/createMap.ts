import maplibregl from "maplibre-gl";
import type { LatLng } from "@gigai/geo";

export type GigMapOptions = {
  styleUrl?: string;
  center: LatLng;
  zoom?: number;
  interactive?: boolean;
  attributionCompact?: boolean;
};

const DEFAULT_STYLE = "https://tiles.openfreemap.org/styles/dark";

export function createGigMap(container: HTMLElement, opts: GigMapOptions): maplibregl.Map {
  const map = new maplibregl.Map({
    container,
    style: opts.styleUrl ?? DEFAULT_STYLE,
    center: [opts.center.lng, opts.center.lat],
    zoom: opts.zoom ?? 12,
    attributionControl: opts.attributionCompact === false ? false : { compact: true },
    interactive: opts.interactive ?? true,
    pitch: 0,
    bearing: 0,
  });

  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
  return map;
}

export function waitForMapLoad(map: maplibregl.Map): Promise<void> {
  if (map.loaded()) return Promise.resolve();
  return new Promise((resolve) => {
    map.once("load", () => resolve());
  });
}

export function flyTo(map: maplibregl.Map, point: LatLng, zoom = 14): void {
  map.flyTo({ center: [point.lng, point.lat], zoom, essential: true });
}

export function addCircleMarker(
  map: maplibregl.Map,
  id: string,
  points: Array<LatLng & { color: string; radius?: number; label?: string }>,
): void {
  const sourceId = `${id}-source`;
  const layerId = `${id}-layer`;

  const geojson: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: points.map((p, i) => ({
      type: "Feature",
      id: i,
      properties: { color: p.color, radius: p.radius ?? 10, label: p.label ?? "" },
      geometry: { type: "Point", coordinates: [p.lng, p.lat] },
    })),
  };

  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(geojson);
    return;
  }

  map.addSource(sourceId, { type: "geojson", data: geojson });
  map.addLayer({
    id: layerId,
    type: "circle",
    source: sourceId,
    paint: {
      "circle-radius": ["get", "radius"],
      "circle-color": ["get", "color"],
      "circle-opacity": 0.85,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  });
}

export function addRouteLine(map: maplibregl.Map, id: string, geometry: GeoJSON.LineString, color = "#22d3ee"): void {
  const sourceId = `${id}-route-source`;
  const layerId = `${id}-route-layer`;
  const data: GeoJSON.Feature = { type: "Feature", properties: {}, geometry };

  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(data);
    return;
  }

  map.addSource(sourceId, { type: "geojson", data });
  map.addLayer({
    id: layerId,
    type: "line",
    source: sourceId,
    layout: { "line-join": "round", "line-cap": "round" },
    paint: { "line-color": color, "line-width": 4, "line-opacity": 0.9 },
  });
}

export function addHeatmapLayer(map: maplibregl.Map, id: string, points: LatLng[]): void {
  const sourceId = `${id}-heat-source`;
  const layerId = `${id}-heat-layer`;

  const geojson: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: points.map((p, i) => ({
      type: "Feature",
      id: i,
      properties: {},
      geometry: { type: "Point", coordinates: [p.lng, p.lat] },
    })),
  };

  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(geojson);
    return;
  }

  map.addSource(sourceId, { type: "geojson", data: geojson });
  map.addLayer({
    id: layerId,
    type: "heatmap",
    source: sourceId,
    paint: {
      "heatmap-weight": 1,
      "heatmap-intensity": 1.2,
      "heatmap-radius": 28,
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0,
        "rgba(11,18,32,0)",
        0.3,
        "rgba(0,200,255,0.4)",
        0.6,
        "rgba(255,120,0,0.7)",
        1,
        "rgba(255,60,0,0.95)",
      ],
    },
  });
}

export type { maplibregl };
