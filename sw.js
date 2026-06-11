const CACHE = 'axis-v1.5';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(ASSETS.map(a => c.add(a).catch(()=>{})))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(cached => {
    if(cached) return cached;
    return fetch(e.request).then(res => {
      if(!res || res.status!==200 || res.type==='opaque') return res;
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match('./index.html'));
  }));
});

// ── NOTIFICATION HANDLER ─────────────────────────────────────────────────────
// Receives messages from the app and shows them as proper OS-level notifications.
// requireInteraction:true = notification stays on screen until user taps it.
self.addEventListener('message', e => {
  if(!e.data || e.data.type !== 'SHOW_NOTIF') return;
  const { title, body } = e.data;
  self.registration.showNotification(title, {
    body,
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [400, 150, 400, 150, 600],
    tag: 'axis-task',
    renotify: true,
    requireInteraction: true,   // stays visible — user must dismiss
    silent: false               // plays system notification sound
  });
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url && 'focus' in c) { c.focus(); return; }
      }
      return clients.openWindow('./index.html');
    })
  );
});
