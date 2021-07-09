const CACHE_NAME = "V1_Blog",
  urlsToCache = [
    "./manifest.json",
    "./images/blogging_24.png",
    "./images/blogging_64.png",
    "https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap",
    "./images/ball-triangle.svg",
  ];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache).then(() => self.skipWaiting());
      })
      .catch((err) => console.error("Registro cache fallo", err))
  );
});

self.addEventListener("activate", (e) => {
  const cacheWhitelist = [CACHE_NAME];

  e.waitUntil(
    caches
      .keys()
      .then((cachesName) =>
        cachesName.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) {
        return res;
      }
      return fetch(e.request);
    })
  );
});
