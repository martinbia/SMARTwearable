/* Generated cache ID changes with application content. */
const CACHE = 'smartwearable-__BUILD_ID__';
const FILES = /* assets */ '__PRECACHE__';
const BASE = new URL('./', self.location.href);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES.map(f => new URL(f, BASE).href))));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith('smartwearable-') && key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data === 'ACTIVATE_UPDATE') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== BASE.origin || !url.pathname.startsWith(BASE.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (event.request.mode === 'navigate') {
      try { return await fetch(event.request); }
      catch { return await cache.match(new URL('index.html', BASE).href); }
    }
    return (await cache.match(event.request)) || fetch(event.request);
  })());
});
