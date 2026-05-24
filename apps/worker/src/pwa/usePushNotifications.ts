import { useCallback, useEffect, useState } from "react";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY ?? "";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)));
}

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default",
  );
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported("serviceWorker" in navigator && "PushManager" in window && "Notification" in window);
  }, []);

  useEffect(() => {
    if (!isSupported) return;
    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then(setSubscription)
      .catch(() => undefined);
  }, [isSupported]);

  const subscribe = useCallback(async () => {
    if (!isSupported) return null;

    const result = await Notification.requestPermission();
    setPermission(result);
    if (result !== "granted") return null;

    const registration = await navigator.serviceWorker.ready;
    const existing = await registration.pushManager.getSubscription();
    if (existing) {
      setSubscription(existing);
      return existing;
    }

    if (!VAPID_PUBLIC_KEY) {
      console.info("[GigAI PWA] Push ready — set VITE_VAPID_PUBLIC_KEY to enable server subscriptions.");
      return null;
    }

    const created = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
    setSubscription(created);
    return created;
  }, [isSupported]);

  const unsubscribe = useCallback(async () => {
    if (!subscription) return;
    await subscription.unsubscribe();
    setSubscription(null);
  }, [subscription]);

  return {
    isSupported,
    permission,
    subscription,
    subscribe,
    unsubscribe,
    isSubscribed: Boolean(subscription),
  };
}
