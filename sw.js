const CACHE = 'axis-v1.6';
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

// ── ALARM SYSTEM ─────────────────────────────────────────────────────────────
// The app posts SCHEDULE_ALARM with {deadlineTs, taskName, nextName, nextDur}
// SW sets a setTimeout to fire at deadlineTs — this works in background.
// When it fires: show notification + post TASK_EXPIRED to all clients.
// If no clients open: store in pendingExpiry so app picks it up on next open.

let alarmTimer = null;
let pendingExpiry = null; // tasks that expired while app was closed

self.addEventListener('message', e => {
  if(!e.data) return;

  if(e.data.type === 'SCHEDULE_ALARM'){
    // Cancel any existing alarm
    if(alarmTimer) clearTimeout(alarmTimer);
    const {deadlineTs, taskName, nextName, nextDur} = e.data;
    const msLeft = (deadlineTs * 1000) - Date.now();
    if(msLeft <= 0){
      // Already expired — fire immediately
      fireAlarm(taskName, nextName, nextDur);
      return;
    }
    alarmTimer = setTimeout(() => {
      fireAlarm(taskName, nextName, nextDur);
    }, msLeft);
  }

  if(e.data.type === 'CANCEL_ALARM'){
    if(alarmTimer){ clearTimeout(alarmTimer); alarmTimer = null; }
  }

  if(e.data.type === 'SHOW_NOTIF'){
    const {title, body} = e.data;
    self.registration.showNotification(title, notifOpts(body));
  }

  // App just opened — send back any pending expiry it missed
  if(e.data.type === 'APP_READY'){
    if(pendingExpiry && e.source){
      e.source.postMessage({type:'TASK_EXPIRED', ...pendingExpiry});
      pendingExpiry = null;
    }
  }
});

function notifOpts(body){
  return {
    body,
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [400,150,400,150,600],
    tag: 'axis-task',
    renotify: true,
    requireInteraction: true,
    silent: false
  };
}

function fireAlarm(taskName, nextName, nextDur){
  alarmTimer = null;
  const title = '⏱ ' + taskName + ' is done!';
  const body = nextName ? 'Up next: ' + nextName + (nextDur?' ('+nextDur+')':'') : 'All done for now!';
  self.registration.showNotification(title, notifOpts(body));
  // Tell the app to advance
  self.clients.matchAll({type:'window', includeUncontrolled:true}).then(list => {
    if(list.length){
      list.forEach(c => c.postMessage({type:'TASK_EXPIRED', taskName, nextName}));
    } else {
      // No open clients — store so app picks it up when opened
      pendingExpiry = {taskName, nextName};
    }
  });
}

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window', includeUncontrolled:true}).then(list => {
      for(const c of list){ if(c.url && 'focus' in c){ c.focus(); return; } }
      return clients.openWindow('./index.html');
    })
  );
});
