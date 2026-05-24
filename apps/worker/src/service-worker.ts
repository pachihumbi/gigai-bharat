/// <reference lib="webworker" />
import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { BackgroundSyncPlugin } from "workbox-background-sync";

declare const self: ServiceWorkerGlobalScope;

const CACHE_VERSION = "gigai-v1";
const OFFLINE_URL = "/offline.html";
const SYNC_QUEUE = "gigai-background-sync";

clientsClaim();
self.skipWaiting();

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

const navigationHandler = createHandlerBoundToURL("/index.html");
const navigationRoute = new NavigationRoute(async (options) => {
  try {
    return await navigationHandler(options);
  } catch {
    const cache = await caches.open(`${CACHE_VERSION}-pages`);
    const offline = await cache.match(OFFLINE_URL);
    return offline ?? Response.error();
  }
}, {
  denylist: [/^\/api\//, /^\/~oauth\//],
});
registerRoute(navigationRoute);

registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: `${CACHE_VERSION}-images`,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 80,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  }),
);

registerRoute(
  ({ url }) => url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com",
  new StaleWhileRevalidate({
    cacheName: `${CACHE_VERSION}-fonts`,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  }),
);

const backgroundSync = new BackgroundSyncPlugin(SYNC_QUEUE, {
  maxRetentionTime: 24 * 60,
});

registerRoute(
  ({ url, request }) =>
    request.method === "POST" &&
    (url.pathname.startsWith("/api/") || url.hostname.includes("supabase")),
  new NetworkFirst({
    cacheName: `${CACHE_VERSION}-api`,
    networkTimeoutSeconds: 8,
    plugins: [backgroundSync],
  }),
  "POST",
);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(`${CACHE_VERSION}-pages`).then((cache) => cache.add(OFFLINE_URL)),
  );
});

self.addEventListener("push", (event) => {
  const payload = event.data?.json() ?? {
    title: "GigAI Bharat",
    body: "New update from your worker OS.",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon ?? "/icons/icon-192.png",
      badge: payload.badge ?? "/icons/icon-192.png",
      tag: payload.tag ?? "gigai-notification",
      data: payload.data ?? { url: "/dashboard" },
    } as NotificationOptions),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data?.url as string | undefined) ?? "/dashboard";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client && client.url.includes(self.location.origin)) {
          client.postMessage({ type: "NAVIGATE", url: targetUrl });
          return client.focus();
        }
      }
      return self.clients.openWindow(targetUrl);
    }),
  );
});

self.addEventListener("sync", (event) => {
  if (event.tag === SYNC_QUEUE) {
    event.waitUntil(replayQueuedRequests());
  }
});

async function replayQueuedRequests() {
  const cache = await caches.open(`${CACHE_VERSION}-api`);
  const keys = await cache.keys();
  await Promise.all(
    keys.map(async (request) => {
      try {
        await fetch(request.clone());
        await cache.delete(request);
      } catch {
        /* keep for next sync */
      }
    }),
  );
}

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
