import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useBackgroundSync } from "@/pwa/useBackgroundSync";
import { isStandaloneMode } from "@/pwa/install-utils";
import { useInstallPrompt } from "@/pwa/useInstallPrompt";
import { usePushNotifications } from "@/pwa/usePushNotifications";
import { useServiceWorkerUpdate } from "@/pwa/useServiceWorkerUpdate";

interface PwaContextValue {
  canInstall: boolean;
  isInstalled: boolean;
  isInstalling: boolean;
  install: () => Promise<boolean>;
  dismissInstall: () => void;
  needRefresh: boolean;
  offlineReady: boolean;
  applyUpdate: () => void;
  push: ReturnType<typeof usePushNotifications>;
  sync: ReturnType<typeof useBackgroundSync>;
  showLaunchOverlay: boolean;
  completeLaunch: () => void;
}

const PwaContext = createContext<PwaContextValue | null>(null);

export function PwaProvider({ children }: { children: ReactNode }) {
  const install = useInstallPrompt();
  const update = useServiceWorkerUpdate();
  const push = usePushNotifications();
  const sync = useBackgroundSync();
  const [showLaunchOverlay, setShowLaunchOverlay] = useState(false);

  useEffect(() => {
    if (isStandaloneMode()) {
      setShowLaunchOverlay(true);
      const timer = window.setTimeout(() => setShowLaunchOverlay(false), 1400);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "NAVIGATE" && typeof event.data.url === "string") {
        window.location.assign(event.data.url);
      }
    };
    navigator.serviceWorker?.addEventListener("message", onMessage);
    return () => navigator.serviceWorker?.removeEventListener("message", onMessage);
  }, []);

  const value = useMemo<PwaContextValue>(
    () => ({
      canInstall: install.canInstall,
      isInstalled: install.isInstalled,
      isInstalling: install.isInstalling,
      install: install.install,
      dismissInstall: install.dismiss,
      needRefresh: update.needRefresh,
      offlineReady: update.offlineReady,
      applyUpdate: update.applyUpdate,
      push,
      sync,
      showLaunchOverlay,
      completeLaunch: () => setShowLaunchOverlay(false),
    }),
    [install, update, push, sync, showLaunchOverlay],
  );

  return <PwaContext.Provider value={value}>{children}</PwaContext.Provider>;
}

export function usePwa() {
  const context = useContext(PwaContext);
  if (!context) throw new Error("usePwa must be used within PwaProvider");
  return context;
}
