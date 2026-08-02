// Minimal service worker for Miftāḥ. Next.js App Router renders most pages
// on the server per-request, so this cannot precache a fixed manifest of
// hashed build assets the way a static-export PWA would. Instead it takes a
// pragmatic "network falling back to cache" approach: every successful GET
// (page navigation, static asset, or API response) is cached as it's seen;
// once offline, the same request is served from that cache. Combined with
// the /offline page's own IndexedDB-backed curriculum download, this means:
//   - pages you've visited before remain reachable offline,
//   - the /offline study mode works fully offline once downloaded, since it
//     makes no further network calls except attempt syncing.
const CACHE_NAME = 'miftah-cache-v1';
const CORE_ASSETS = ['/manifest.webmanifest', '/icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache auth or mutating-adjacent API routes — always go to the
  // network so session state and grading stay correct.
  if (url.pathname.startsWith('/api/auth/')) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || Response.error())),
  );
});
