import { useCallback, useEffect, useState } from "react";

export function useServiceWorkerUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    let cancelled = false;

    void (async () => {
      try {
        const { registerSW } = await import("virtual:pwa-register");
        if (cancelled) return;

        const updateSW = registerSW({
          immediate: true,
          onOfflineReady() {
            if (!cancelled) setOfflineReady(true);
          },
          onNeedRefresh() {
            if (!cancelled) setNeedRefresh(true);
          },
          onRegistered(registration) {
            if (!registration) return;
            window.setInterval(() => registration.update(), 60 * 60 * 1000);
          },
        });

        (window as Window & { __gigaiUpdateSW?: () => void }).__gigaiUpdateSW = updateSW;
      } catch (error) {
        console.warn("[GigAI PWA] Service worker registration skipped:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const applyUpdate = useCallback(() => {
    const updateSW = (window as Window & { __gigaiUpdateSW?: () => void }).__gigaiUpdateSW;
    updateSW?.();
    setNeedRefresh(false);
  }, []);

  return { needRefresh, offlineReady, applyUpdate };
}
