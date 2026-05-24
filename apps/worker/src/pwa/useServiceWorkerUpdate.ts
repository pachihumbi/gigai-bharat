import { useCallback, useEffect, useState } from "react";
import { registerSW } from "virtual:pwa-register";

export function useServiceWorkerUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    const updateSW = registerSW({
      immediate: true,
      onOfflineReady() {
        setOfflineReady(true);
      },
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onRegistered(registration) {
        if (!registration) return;
        setInterval(() => registration.update(), 60 * 60 * 1000);
      },
    });

    (window as Window & { __gigaiUpdateSW?: () => void }).__gigaiUpdateSW = updateSW;
  }, []);

  const applyUpdate = useCallback(() => {
    const updateSW = (window as Window & { __gigaiUpdateSW?: () => void }).__gigaiUpdateSW;
    updateSW?.();
    setNeedRefresh(false);
  }, []);

  return { needRefresh, offlineReady, applyUpdate };
}
