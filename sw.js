/* ҚМДБ терминалы — офлайн service worker.
   • core кэш (нұсқаланған): HTML, CSS, JS, қаріптер, кітапханалар, иконкалар, аудио — толық міндетті precache.
   • photos кэш (тұрақты): 2700+ мешіт суреті — бөлек, қайта жүктелмейді, тек жаңалары қосылады.
   • Навигация: cache-first; кэште жоқ болса index.html-ге қайтады. */
importScripts('./precache-manifest.js');

const CORE = 'qmdb-core-' + self.PRECACHE_VERSION;
const PHOTOS = 'qmdb-photos-v1';

async function broadcast(msg){
  for (const c of await self.clients.matchAll({ includeUncontrolled: true })) c.postMessage(msg);
}

async function precachePhotos(){
  const cache = await caches.open(PHOTOS);
  const have = new Set((await cache.keys()).map(r => new URL(r.url).pathname));
  const want = new Set(self.PRECACHE_PHOTOS.map(u => new URL(u, self.registration.scope).pathname));
  for (const r of await cache.keys()) if (!want.has(new URL(r.url).pathname)) await cache.delete(r);   // ескірген суреттер
  const todo = self.PRECACHE_PHOTOS.filter(u => !have.has(new URL(u, self.registration.scope).pathname));
  const total = self.PRECACHE_PHOTOS.length;
  let done = total - todo.length, last = 0;
  const worker = async () => {
    while (todo.length){
      const u = todo.pop();
      try { const r = await fetch(u, { cache: 'reload' }); if (r.ok) await cache.put(u, r); else continue; } catch (e) { continue; }
      done++;
      if (Date.now() - last > 400){ last = Date.now(); broadcast({ type: 'precache-progress', done, total }); }
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  broadcast({ type: 'precache-progress', done, total });
}

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CORE);
    // міндетті: біреуі жүктелмесе — install сәтсіз, ескі нұсқа жұмысын жалғастырады
    await Promise.all(self.PRECACHE_CORE.map(async u => {
      const r = await fetch(u, { cache: 'reload' });
      if (!r.ok) throw new Error('precache ' + u + ' ' + r.status);
      await cache.put(u, r);
    }));
    await self.skipWaiting();
    await precachePhotos().catch(() => {});   // сурет қатесі install-ды бұзбайды; кейін 'sync-photos' қайталайды
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('qmdb-core-') && k !== CORE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'sync-photos') e.waitUntil(precachePhotos().catch(() => {}));
});

/* <audio> Range сұрауларын кэштен қайтару */
async function rangeResponse(req, res){
  const buf = await res.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range'));
  const start = m[1] ? +m[1] : 0, end = m[2] ? Math.min(+m[2], buf.byteLength - 1) : buf.byteLength - 1;
  return new Response(buf.slice(start, end + 1), { status: 206, statusText: 'Partial Content', headers: {
    'Content-Type': res.headers.get('Content-Type') || 'audio/mpeg',
    'Content-Range': `bytes ${start}-${end}/${buf.byteLength}`, 'Content-Length': String(end - start + 1), 'Accept-Ranges': 'bytes' } });
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;   // сыртқы (YouTube, iframe, т.б.) — браузердің өзі

  e.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: true, ignoreVary: true });
    if (hit){
      if (req.headers.has('range')) return rangeResponse(req, hit);
      return hit;
    }
    try {
      const res = await fetch(req);
      return res;
    } catch (err) {
      if (req.mode === 'navigate'){
        // /map сияқты кеңейтусіз сұрау — .html нұсқасы; болмаса басты бет
        const alt = await caches.match(url.pathname.replace(/\/$/, '') + '.html');
        if (alt) return alt;
        const home = await caches.match('./index.html', { ignoreSearch: true });
        if (home) return home;
      }
      return new Response('Офлайн', { status: 503, statusText: 'Offline', headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
  })());
});
