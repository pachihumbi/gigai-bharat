const DISMISS_KEY = "gigai-pwa-install-dismissed";
const DISMISS_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function isStandaloneMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function wasInstallDismissed() {
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  return Number.isFinite(dismissedAt) && Date.now() - dismissedAt < DISMISS_TTL_MS;
}

export function markInstallDismissed() {
  localStorage.setItem(DISMISS_KEY, String(Date.now()));
}

export function clearInstallDismissed() {
  localStorage.removeItem(DISMISS_KEY);
}

export type { BeforeInstallPromptEvent as InstallPromptEvent };
