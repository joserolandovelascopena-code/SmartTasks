const STATIC_CACHE = "smart-cache";

// INSTALACIÓN
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll([
        "./",
        "index.html",
        "offline.html",

        // CSS
        "assets/css/app-css/styles.css",
        "assets/css/app-css/style2.css",
        "assets/css/app-css/styles3.css",
        "assets/css/theme.css",
        "assets/css/offline-css/styleOffline.css",

        // Core JS
        "assets/js/core/app.js",
        "assets/js/ui.js",
        "assets/js/storage.js",
        "assets/js/supabase.js",
        "assets/js/auth.js",

        // Scheduler
        "assets/js/scheduler/scheduler.js",
        "assets/js/scheduler/reminders.js",

        // Modals
        "assets/js/modals/modals.js",
        "assets/js/modals/scrollModals.js",
        "assets/js/modals/warning_messages/warningMessages.js",

        // Overlay
        "assets/js/overlayManager/overlayManager.js",

        // Security
        "assets/js/security/inputSanitizer.js",

        // Theme
        "assets/js/themeManager/theme.js",
        "assets/js/themeManager/theme.core.js",
        "assets/js/themeManager/theme.helpers.js",
        "assets/js/themeManager/theme.orchestrator.js",

        // Toast
        "assets/js/toastManager/toast.js",
        "assets/js/toastManager/haptic.js",
        "assets/js/toastManager/sound.js",
        "assets/js/toastManager/sunsSystem/errorMsg.wav",
        "assets/js/toastManager/sunsSystem/warning.mp3",
        "assets/js/toastManager/sunsSystem/succes.mp3",

        // Pages
        "pages/autentication/login.html",
        "pages/autentication/signup.html",
        "pages/autentication/reset-password.html",
        "pages/autentication/recover.html",
        "pages/sttings.html",
        "pages/stats.html",

        // PWA
        "manifest.json",
        "assets/icons/icon-192.png",
        "assets/icons/icon-512.png",
      ]);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// FETCH
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // INTERCEPTAR NAVEGACIÓN SIEMPRE
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          return await fetch(req);
        } catch (err) {
          const cached = await caches.match("index.html");
          return cached || caches.match("offline.html");
        }
      })(),
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req)),
  );
});

// NETWORK FIRST (para páginas)
async function networkFirst(req) {
  try {
    const networkRes = await fetch(req);
    return networkRes;
  } catch (err) {
    const cache = await caches.open(STATIC_CACHE);
    const cached = await cache.match(req);
    return cached || cache.match("offline.html");
  }
}

// CACHE FIRST (para assets)
async function cacheFirst(req) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(req);
  return cached || fetch(req);
}
