import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { LatLng } from "@gigai/geo";

export type GeolocationState = {
  position: LatLng | null;
  accuracyM: number | null;
  heading: number | null;
  speedMps: number | null;
  error: string | null;
  loading: boolean;
  tracking: boolean;
};

type Options = {
  enableHighAccuracy?: boolean;
  track?: boolean;
  syncToSupabase?: boolean;
  intervalMs?: number;
};

export function useGeolocation(opts: Options = {}) {
  const {
    enableHighAccuracy = true,
    track = false,
    syncToSupabase = false,
    intervalMs = 15000,
  } = opts;

  const watchId = useRef<number | null>(null);
  const [state, setState] = useState<GeolocationState>({
    position: null,
    accuracyM: null,
    heading: null,
    speedMps: null,
    error: null,
    loading: true,
    tracking: false,
  });

  const syncLocation = useCallback(async (pos: GeolocationPosition) => {
    if (!syncToSupabase) return;
    const { latitude: lat, longitude: lng, heading, speed } = pos.coords;
    await supabase.rpc("upsert_worker_location", {
      p_lat: lat,
      p_lng: lng,
      p_heading: heading ?? null,
      p_speed_mps: speed ?? null,
      p_on_shift: true,
    });
  }, [syncToSupabase]);

  const applyPosition = useCallback(
    (pos: GeolocationPosition) => {
      setState({
        position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        accuracyM: pos.coords.accuracy,
        heading: pos.coords.heading,
        speedMps: pos.coords.speed,
        error: null,
        loading: false,
        tracking: track,
      });
      void syncLocation(pos);
    },
    [syncLocation, track],
  );

  const onError = useCallback((err: GeolocationPositionError) => {
    setState((s) => ({
      ...s,
      error: err.message,
      loading: false,
      tracking: false,
    }));
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: "Geolocation not supported", loading: false }));
      return;
    }

    if (track) {
      watchId.current = navigator.geolocation.watchPosition(applyPosition, onError, {
        enableHighAccuracy,
        maximumAge: 5000,
        timeout: 15000,
      });
      setState((s) => ({ ...s, tracking: true }));
    } else {
      navigator.geolocation.getCurrentPosition(applyPosition, onError, {
        enableHighAccuracy,
        timeout: 15000,
      });
    }

    return () => {
      if (watchId.current != null) navigator.geolocation.clearWatch(watchId.current);
    };
  }, [applyPosition, enableHighAccuracy, onError, track]);

  useEffect(() => {
    if (!track || !syncToSupabase || !state.position) return;
    const id = window.setInterval(() => {
      navigator.geolocation.getCurrentPosition(applyPosition, () => undefined, {
        enableHighAccuracy,
        maximumAge: intervalMs,
      });
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [applyPosition, enableHighAccuracy, intervalMs, state.position, syncToSupabase, track]);

  return state;
}
