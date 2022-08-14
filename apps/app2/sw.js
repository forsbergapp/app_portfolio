/*
    '/app2/css/images/marker-icon-blue.png',
    '/app2/css/images/marker-icon-green.png',
    '/app2/css/images/marker-icon-red.png',

*/
const cacheName = 'site-cache-v1'
const assetsToCache = [
    '/common/css/common.css',
    '/common/css/maintenance.css',
    '/common/js/common.js',
    '/common/js/easy.qrcode.js',
    '/common/js/maintenance.js',
    '/app2/css/app.css',
    '/app2/css/app_report.css',
    '/app2/css/images/theme_day_10001.jpg',
    '/app2/css/images/theme_day_10002.jpg',
    '/app2/css/images/theme_day_10003.jpg',
    '/app2/css/images/theme_month_20001.jpg',
    '/app2/css/images/theme_month_20002.jpg',
    '/app2/css/images/theme_month_20003.jpg',
    '/app2/css/images/theme_month_20004.jpg',
    '/app2/css/images/theme_month_20005.jpg',
    '/app2/css/images/theme_month_20006.jpg',
    '/app2/css/images/theme_month_20007.jpg',
    '/app2/css/images/theme_month_20008.jpg',
    '/app2/css/images/theme_month_20009.jpg',
    '/app2/css/images/theme_month_20010.jpg',
    '/app2/css/images/theme_month_20011.jpg',
    '/app2/css/images/theme_month_20012.jpg',
    '/app2/css/images/theme_month_20013.jpg',
    '/app2/css/images/theme_month_20014.jpg',
    '/app2/css/images/theme_month_20015.jpg',
    '/app2/css/images/theme_year_30001.jpg',
    '/app2/images/banner_kaaba.jpg',
    '/app2/images/logo.png',
    '/app2/js/app_globals.js',
    '/app2/js/app_report.js',
    '/app2/js/app_thirdparty.js',
    '/app2/js/app.js',
    '/app2/js/PrayTimes.js'
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
