const cacheName = 'site-cache-v1'
const assetsToCache = [
    '/common/css/common.css',
    '/common/css/common_app.css',
	'/common/css/maintenance.css',
    '/common/js/common.js',
    '/common/js/maintenance.js',
    '/common/images/logo.png',    
    '/common/modules/easy.qrcode/easy.qrcode.js',
    '/common/modules/easy.qrcode/canvas2svg.js',
    '/common/modules/fontawesome/css/all.css',
    '/common/modules/fontawesome/webfonts/fa-brands-400.ttf',
    '/common/modules/fontawesome/webfonts/fa-brands-400.woff2',
    '/common/modules/fontawesome/webfonts/fa-regular-400.ttf',
    '/common/modules/fontawesome/webfonts/fa-regular-400.woff2',
    '/common/modules/fontawesome/webfonts/fa-solid-900.ttf',
    '/common/modules/fontawesome/webfonts/fa-solid-900.woff2',
    '/common/modules/fontawesome/webfonts/fa-v4compatibility.ttf',
    '/common/modules/fontawesome/webfonts/fa-v4compatibility.woff2',
    '/common/modules/leaflet/leaflet-src.js',
    '/common/modules/leaflet/leaflet.css',
    '/common/modules/leaflet/images/layers-2x.png',
    '/common/modules/leaflet/images/layers.png',
    '/common/modules/leaflet/images/marker-icon-2x.png',
    '/common/modules/leaflet/images/marker-icon.png',
    '/common/modules/leaflet/images/marker-shadow.png',
    '/common/modules/PrayTimes/PrayTimes.js',
    '/common/modules/regional/regional.js',
    '/app2/css/app.css',
    '/app2/css/app_report.css',
    '/app2/images/banner_default.png',
    '/app2/images/favicon-32x32.png',
    '/app2/images/favicon-192x192.png',
    '/app2/images/logo.png',
    '/app2/info/about.html',
    '/app2/info/disclaimer.html',
    '/app2/info/privacy_policy.html',
    '/app2/info/terms.html',
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

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys()
        .then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            if (response) {
                return response;
            } else {
                return fetch(event.request);
            }
        })
    );
});
