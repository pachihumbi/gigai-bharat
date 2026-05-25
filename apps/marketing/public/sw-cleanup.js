/** Remove stale worker-app service workers that block the marketing website on www.bharatgig.live */
(function () {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  navigator.serviceWorker.getRegistrations().then(function (regs) {
    regs.forEach(function (reg) {
      reg.unregister().catch(function () {});
    });
  });

  if ("caches" in window) {
    caches.keys().then(function (keys) {
      keys.forEach(function (key) {
        if (/gigai|workbox|precache/i.test(key)) {
          caches.delete(key).catch(function () {});
        }
      });
    });
  }
})();
