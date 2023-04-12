const cacheName = 'site-cache-v1'
const assetsToCache = [
    '/common/css/common.css',
    '/common/css/common_app.css',
	'/common/css/maintenance.css',
    '/common/js/common.js',
    '/common/js/maintenance.js',
    '/common/images/logo.png',    
    '/common/modules/easy.qrcode/easy.qrcode.module.js',
    '/common/modules/easy.qrcode/canvas2svg.module.js',
    '/common/modules/fontawesome/webfonts/fa-regular-400.woff2',
    '/common/modules/fontawesome/webfonts/fa-solid-900.woff2',
    '/common/modules/leaflet/leaflet-src.module.js',
    '/common/modules/leaflet/leaflet.css',
    '/common/modules/leaflet/images/layers-2x.png',
    '/common/modules/leaflet/images/layers.png',
    '/common/modules/leaflet/images/marker-icon-2x.png',
    '/common/modules/leaflet/images/marker-icon.png',
    '/common/modules/leaflet/images/marker-shadow.png',
    '/common/modules/PrayTimes/PrayTimes.module.js',
    '/common/modules/regional/regional.js',
    '/app2/css/app.css',
    '/app2/css/app_report.css',
    '/app2/images/banner_default.webp',
    '/app2/images/favicon-32x32.png',
    '/app2/images/favicon-192x192.png',
    '/app2/images/logo.png',
    '/app2/js/app_common.js',
    '/app2/js/app_report.js',
    '/app2/js/app.js'
]
self.addEventListener('install', ( event ) => {
    self.skipWaiting();
    event.waitUntil(  
        caches.open(cacheName).then((cache) => {
              return cache.addAll(assetsToCache);
        })
      );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
        .then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            if (response) {
                return response;
            } else {
                return fetch(event.request);
            }
        })
    );
});
