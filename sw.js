const CACHE = 'axis-v3';
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

// ── NOTIFICATION SUPPORT ──────────────────────────────────────────────────────
// Receives push-like messages from the main thread and shows them as system notifications
self.addEventListener('message', e => {
  if(e.data && e.data.type === 'SHOW_NOTIF') {
    const { title, body } = e.data;
    self.registration.showNotification(title, {
      body,
      icon: './icon-192.png',
      badge: './icon-192.png',
      vibrate: [300, 100, 300, 100, 300],
      tag: 'axis-task',
      renotify: true,
      requireInteraction: false,  // auto-dismiss after a few seconds
      silent: false               // plays default notification sound
    });
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window'}).then(list => {
    for(const c of list) { if(c.url && 'focus' in c) { c.focus(); return; } }
    return clients.openWindow('./index.html');
  }));
});
