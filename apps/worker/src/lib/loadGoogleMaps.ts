/// <reference types="google.maps" />
// Singleton loader for the Google Maps JS API with async callback.
// Safe to call multiple times — returns the same promise.

declare global {
  interface Window {
    google?: typeof google;
    __gmapsInit?: () => void;
  }
}

let promise: Promise<typeof google> | null = null;

export function loadGoogleMaps(libs: string[] = ["places", "marker"]): Promise<typeof google> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.google?.maps) return Promise.resolve(window.google);
  if (promise) return promise;

  const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY as string | undefined;
  const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID as string | undefined;
  if (!key) return Promise.reject(new Error("Google Maps browser key missing"));

  promise = new Promise((resolve, reject) => {
    window.__gmapsInit = () => resolve(window.google!);
    const s = document.createElement("script");
    const params = new URLSearchParams({
      key,
      v: "weekly",
      loading: "async",
      callback: "__gmapsInit",
      libraries: libs.join(","),
    });
    if (channel) params.set("channel", channel);
    s.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    s.async = true;
    s.defer = true;
    s.onerror = () => {
      promise = null;
      reject(new Error("Failed to load Google Maps"));
    };
    document.head.appendChild(s);
  });
  return promise;
}
