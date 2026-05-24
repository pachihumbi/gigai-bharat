const DISMISS_KEY = "gigai-pwa-install-dismissed";
const DISMISS_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  try {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    );
  } catch {
    return false;
  }
}

export function wasInstallDismissed() {
  if (typeof localStorage === "undefined") return false;
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const dismissedAt = Number(raw);
    return Number.isFinite(dismissedAt) && Date.now() - dismissedAt < DISMISS_TTL_MS;
  } catch {
    return false;
  }
}

export function markInstallDismissed() {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    /* private browsing / storage blocked */
  }
}

export function clearInstallDismissed() {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(DISMISS_KEY);
  } catch {
    /* ignore */
  }
}

export type { BeforeInstallPromptEvent as InstallPromptEvent };
