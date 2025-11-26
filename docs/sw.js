const STATIC_CACHE = "smart-cache";

// INSTALACIÓN
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll([
        "./",
        "index.html",
        "assets/css/styles.css",
        "assets/js/app.js",
        "assets/js/ui.js",
        "assets/js/storage.js",
        "offline.html" 
      ]);
    })
  );
});

// ACTIVACIÓN (limpiar caches viejos)
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// FETCH
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Si es un documento HTML → NETWORK FIRST
  if (req.destination === "document") {
    event.respondWith(networkFirst(req));
    return;
  }

  // Si es CSS/JS/IMG → CACHE FIRST
  event.respondWith(cacheFirst(req));
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
