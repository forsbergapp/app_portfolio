/*
    '/app1/css/images/marker-icon-blue.png',
    '/app1/css/images/marker-icon-green.png',
    '/app1/css/images/marker-icon-red.png',

*/
const cacheName = 'site-cache-v1'
const assetsToCache = [
    '/common/css/common.css',
    '/app1/css/app_themes.css',
    '/app1/css/app.css',
    '/app1/css/images/theme_day_10001.jpg',
    '/app1/css/images/theme_day_10002.jpg',
    '/app1/css/images/theme_day_10003.jpg',
    '/app1/css/images/theme_month_20001.jpg',
    '/app1/css/images/theme_month_20002.jpg',
    '/app1/css/images/theme_month_20003.jpg',
    '/app1/css/images/theme_month_20004.jpg',
    '/app1/css/images/theme_month_20005.jpg',
    '/app1/css/images/theme_month_20006.jpg',
    '/app1/css/images/theme_month_20007.jpg',
    '/app1/css/images/theme_month_20008.jpg',
    '/app1/css/images/theme_month_20009.jpg',
    '/app1/css/images/theme_month_20010.jpg',
    '/app1/css/images/theme_month_20011.jpg',
    '/app1/css/images/theme_month_20012.jpg',
    '/app1/css/images/theme_month_20013.jpg',
    '/app1/css/images/theme_month_20014.jpg',
    '/app1/css/images/theme_month_20015.jpg',
    '/app1/css/images/theme_year_30001.jpg',
    '/app1/images/banner_kaaba.jpg',
    '/app1/images/logo.png',
    '/common/js/common.js',
    '/app1/js/app_globals.js',
    '/app1/js/app_report.js',
    '/app1/js/app_thirdparty.js',
    '/app1/js/app.js',
    '/app1/js/easy.qrcode.js',
    '/app1/js/PrayTimes.js'
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
