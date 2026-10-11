/* Kids Learning PWA: version 1, network-first updates and offline practice */
const CACHE = 'kids-learning-pwa-v2';
const SHELL = [
 '/kids-learning/', '/kids-learning/index.html',
 '/kids-learning/sakinah/', '/kids-learning/sakinah/index.html',
 '/kids-learning/sakinah/english-challenge.html',
 '/kids-learning/sakinah/ultimate-english-quest.html',
 '/kids-learning/aboud/', '/kids-learning/aboud/index.html',
 '/kids-learning/aboud/lughati-116-questions.html',
 '/kids-learning/aboud/lughati-92-questions.html',
 '/kids-learning/manifest.webmanifest',
 '/kids-learning/icons/icon-192.png',
 '/kids-learning/icons/icon-512.png'
];
self.addEventListener('install', event => {
 event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
 event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('kids-learning-pwa-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
 const request = event.request, url = new URL(request.url);
 if (request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith('/kids-learning/')) return;
 event.respondWith(fetch(request).then(response => {
   if (response.ok) {
     const copy = response.clone();
     event.waitUntil(caches.open(CACHE).then(cache => cache.put(request, copy)));
   }
   return response;
 }).catch(async () => (await caches.match(request, {ignoreSearch:true})) || (request.mode === 'navigate' ? caches.match('/kids-learning/') : Response.error())));
});
