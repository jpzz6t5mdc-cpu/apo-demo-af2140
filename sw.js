/* LOG POSE ― サービスワーカー（network-first＝常に最新を取りに行く） */
/* オンラインなら毎回ネットから新しい版を取り、オフライン時だけキャッシュで代替。 */
/* ＝更新がすぐ反映される（PWAの「古いまま」を防ぐ）。 */
var CACHE = 'logpose-runtime';

self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });

self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET'){ return; }
  e.respondWith(
    fetch(e.request).then(function(res){
      try{ var cp = res.clone(); caches.open(CACHE).then(function(c){ c.put(e.request, cp); }); }catch(_){}
      return res;
    }).catch(function(){
      return caches.match(e.request);   // オフライン時のみ前回のキャッシュ
    })
  );
});
