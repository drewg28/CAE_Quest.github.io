/* CAE Quest service worker — keeps the map usable with no signal. */
const VERSION = 'quest-v1';
const SHELL = [
  './cae-quest.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    // tolerate a missing file rather than failing the whole install
    await Promise.all(SHELL.map(u => c.add(u).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Opening the app: serve from cache first so it launches with no signal,
  // then refresh in the background for next time.
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const cached = await caches.match('./cae-quest.html');
      const net = fetch(req).then(r => {
        if (r && r.ok) caches.open(VERSION).then(c => c.put('./cae-quest.html', r.clone()));
        return r;
      }).catch(() => null);
      return cached || (await net) || new Response('Offline', { status: 503 });
    })());
    return;
  }

  // Fonts and anything else off-site: use the cached copy, update quietly.
  if (url.origin !== location.origin) {
    e.respondWith((async () => {
      const c = await caches.open(VERSION + '-ext');
      const hit = await c.match(req);
      const net = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; })
                            .catch(() => null);
      return hit || (await net) || new Response('', { status: 504 });
    })());
    return;
  }

  // Same-origin files: cache first.
  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    try {
      const r = await fetch(req);
      if (r && r.ok) (await caches.open(VERSION)).put(req, r.clone());
      return r;
    } catch (err) {
      return new Response('', { status: 504 });
    }
  })());
});
