/* Kids Learning PWA: version 1, network-first updates and offline practice */
const CACHE = 'kids-learning-pwa-v14';
const SHELL = [
 '/kids-learning/', '/kids-learning/index.html',
 '/kids-learning/sakinah/', '/kids-learning/sakinah/index.html',
 '/kids-learning/sakinah/english-challenge.html',
 '/kids-learning/sakinah/ultimate-english-quest.html',
 '/kids-learning/raghd/', '/kids-learning/raghd/index.html',
 '/kids-learning/raghd/letter-za.html',
 '/kids-learning/raghd/letter-p.html',
 '/kids-learning/raghd/letter-i.html',
 '/kids-learning/raghd/audio/p-letter.mp3',
 '/kids-learning/raghd/audio/p-pencil.mp3',
 '/kids-learning/raghd/audio/p-pancake.mp3',
 '/kids-learning/raghd/audio/p-potato.mp3',
 '/kids-learning/raghd/audio/p-pig.mp3',
 '/kids-learning/raghd/audio/p-plane.mp3',
 '/kids-learning/raghd/audio/p-popcorn.mp3',
 '/kids-learning/raghd/audio/i-letter.mp3',
 '/kids-learning/raghd/audio/i-icecream.mp3',
 '/kids-learning/raghd/audio/i-iron.mp3',
 '/kids-learning/raghd/audio/i-ink.mp3',
 '/kids-learning/raghd/audio/i-island.mp3',
 '/kids-learning/raghd/audio/i-insect.mp3',
 '/kids-learning/raghd/audio/i-ill.mp3',
 '/kids-learning/raghd/audio/letter.mp3',
 '/kids-learning/raghd/audio/fatha.mp3',
 '/kids-learning/raghd/audio/damma.mp3',
 '/kids-learning/raghd/audio/kasra.mp3',
 '/kids-learning/raghd/audio/alif.mp3',
 '/kids-learning/raghd/audio/waw.mp3',
 '/kids-learning/raghd/audio/ya.mp3',
 '/kids-learning/raghd/audio/giraffe.mp3',
 '/kids-learning/raghd/audio/butter.mp3',
 '/kids-learning/raghd/audio/oil.mp3',
 '/kids-learning/raghd/audio/olives.mp3',
 '/kids-learning/raghd/audio/raisins.mp3',
 '/kids-learning/raghd/audio/farm.mp3',
 '/kids-learning/raghd/audio/scale.mp3',
 '/kids-learning/raghd/audio/banana.mp3',
 '/kids-learning/raghd/audio/bread.mp3',
 '/kids-learning/raghd/print.html', '/kids-learning/raghd/name-practice.png',
 '/kids-learning/assets/style.css',
 '/kids-learning/aboud/', '/kids-learning/aboud/index.html',
 '/kids-learning/aboud/math-midterm-grade2-50.html',
 '/kids-learning/aboud/math-period1-mnhaji-50.html',
 '/kids-learning/sakinah/lughati-grade4-term1.html',
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
