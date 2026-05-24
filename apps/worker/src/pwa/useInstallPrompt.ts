import { useCallback, useEffect, useState } from "react";
import {
  type BeforeInstallPromptEvent,
  clearInstallDismissed,
  isStandaloneMode,
  markInstallDismissed,
  wasInstallDismissed,
} from "./install-utils";

export function useInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(isStandaloneMode);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      if (wasInstallDismissed()) return;
      setPromptEvent(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setIsInstalled(true);
      setPromptEvent(null);
      clearInstallDismissed();
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!promptEvent) return false;
    setIsInstalling(true);
    try {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === "accepted") {
        setPromptEvent(null);
        return true;
      }
      markInstallDismissed();
      return false;
    } finally {
      setIsInstalling(false);
    }
  }, [promptEvent]);

  const dismiss = useCallback(() => {
    markInstallDismissed();
    setPromptEvent(null);
  }, []);

  const canInstall = Boolean(promptEvent) && !isInstalled;

  return { canInstall, isInstalled, isInstalling, install, dismiss, promptEvent };
}
