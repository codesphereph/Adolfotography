// PhotoGrab by Adolfotography (c) 2026 - Service Worker
const CACHE_NAME = 'photograb-v3';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(function(key) { return key !== CACHE_NAME; })
          .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

// Cache-first for the shell only; never intercept the Apps Script app itself.
self.addEventListener('fetch', function(event) {
  if (event.request.url.indexOf('script.google.com') !== -1 ||
      event.request.url.indexOf('googleusercontent.com') !== -1) {
    return; // always go to the network for the live app and photos
  }
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
