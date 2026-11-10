/* ===== 마이노트 서비스 워커 =====
 * 인터넷이 끊겨도 앱 화면이 열리도록 앱 파일을 기기에 저장해 둡니다.
 * 이 파일은 고칠 필요가 없습니다.
 */
var CACHE = 'mynote-v2';
var SDK = '12.19.0';
var SHELL = [
  './', './index.html', './style.css', './app.js', './store.js', './firebase-config.js',
  './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'
];
var REMOTE = [
  'https://www.gstatic.com/firebasejs/' + SDK + '/firebase-app.js',
  'https://www.gstatic.com/firebasejs/' + SDK + '/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/' + SDK + '/firebase-firestore.js',
  // 노트를 PDF·이미지로 저장할 때 쓰는 도구 (인터넷 없이도 저장되도록 미리 받아 둠)
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(CACHE).then(function (cache) {
    return cache.addAll(SHELL).then(function () {
      return Promise.all(REMOTE.map(function (u) {
        return fetch(u, { mode: 'cors' }).then(function (r) { if (r.ok) return cache.put(u, r); }).catch(function () {});
      }));
    });
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('mynote-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function timeout(ms) { return new Promise(function (_, reject) { setTimeout(function () { reject(new Error('timeout')); }, ms); }); }

/* 앱 파일: 인터넷이 되면 새 파일(업데이트 반영), 안 되면 저장해 둔 파일 */
function networkFirst(req) {
  return caches.open(CACHE).then(function (cache) {
    return Promise.race([fetch(req), timeout(4000)]).then(function (res) {
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    }).catch(function () {
      return cache.match(req, { ignoreSearch: true }).then(function (hit) {
        if (hit) return hit;
        if (req.mode === 'navigate') return cache.match('./index.html');
        return Response.error();
      });
    });
  });
}
/* Firebase 프로그램·글꼴: 저장해 둔 것이 있으면 그것을 씀 (바뀌지 않는 파일) */
function cacheFirst(req) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
        return res;
      });
    });
  });
}

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin === self.location.origin) { event.respondWith(networkFirst(req)); return; }
  if ((url.hostname === 'www.gstatic.com' && url.pathname.indexOf('/firebasejs/') === 0) ||
      (url.hostname === 'cdnjs.cloudflare.com' && url.pathname.indexOf('/ajax/libs/') === 0) ||
      url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(req));
  }
  // 그 밖의 요청(Firebase 서버 통신 등)은 건드리지 않습니다.
});
