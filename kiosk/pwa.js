/* PWA: service worker тіркеу, тұрақты сақтау, орнату батырмасы, жаңарту, офлайн белгі */
(function(){
  if (!('serviceWorker' in navigator)) return;

  /* 1. Тұрақты сақтау — браузер кэшті өздігінен өшірмесін */
  function persist(){
    if (navigator.storage && navigator.storage.persist){
      navigator.storage.persisted().then(p => p || navigator.storage.persist()).catch(()=>{});
    }
  }

  /* 2. Service worker + автожаңарту */
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloading) return;   // бірінші орнатуда қайта жүктемейміз
    reloading = true;
    setTimeout(() => location.reload(), 300);
  });
  const hadController = !!navigator.serviceWorker.controller;

  navigator.serviceWorker.register('./sw.js', { scope: './' }).then(reg => {
    persist();
    // сурет кэші толмай қалса (үзіліс, орын жоқ) — интернет бар кезде қайта толтыру
    navigator.serviceWorker.ready.then(r => { if (navigator.onLine && r.active) r.active.postMessage({ type: 'sync-photos' }); });
    const check = () => reg.update().catch(()=>{});
    addEventListener('online', check);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
    setInterval(check, 30 * 60 * 1000);
  }).catch(e => console.warn('SW тіркелмеді', e));

  navigator.serviceWorker.addEventListener('message', e => {
    const d = e.data || {};
    if (d.type === 'precache-progress') setBadge(d.done, d.total);
  });

  /* 3. Орнату батырмасы (Chrome/Edge/Android) */
  let deferred = null;
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; showInstall(); });
  addEventListener('appinstalled', () => { deferred = null; hideInstall(); });

  const css = document.createElement('style');
  css.textContent = `
    #pwaBar{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:9999;display:flex;gap:10px;align-items:center;
      font:600 15px "IBM Plex Sans",system-ui,sans-serif;pointer-events:none}
    #pwaBar>*{pointer-events:auto}
    .pwa-pill{padding:10px 18px;border-radius:999px;background:#0e4b36;color:#fff;border:0;box-shadow:0 10px 30px rgba(0,0,0,.28);cursor:pointer;font:inherit}
    .pwa-pill.off{background:#7a5a12}
    .pwa-pill.info{background:#15211b;font-weight:500;cursor:default}`;
  document.head.appendChild(css);
  const bar = document.createElement('div'); bar.id = 'pwaBar';
  const mount = () => document.body.appendChild(bar);
  document.body ? mount() : addEventListener('DOMContentLoaded', mount);

  let installBtn = null, offBadge = null, progBadge = null;
  function showInstall(){
    if (installBtn) return;
    installBtn = document.createElement('button'); installBtn.className = 'pwa-pill';
    installBtn.textContent = '⬇ Қосымшаны орнату';
    installBtn.onclick = async () => { if (!deferred) return; deferred.prompt(); await deferred.userChoice.catch(()=>{}); deferred = null; hideInstall(); };
    bar.appendChild(installBtn);
  }
  function hideInstall(){ if (installBtn){ installBtn.remove(); installBtn = null; } }
  function setBadge(done, total){
    if (done >= total){ if (progBadge){ progBadge.textContent = '✓ Офлайн режимге дайын'; const b = progBadge; progBadge = null; setTimeout(() => b.remove(), 4000); } return; }
    if (!progBadge){ progBadge = document.createElement('div'); progBadge.className = 'pwa-pill info'; bar.appendChild(progBadge); }
    progBadge.textContent = 'Офлайн үшін жүктелуде… ' + Math.round(done / total * 100) + '%';
  }
  function net(){
    if (!navigator.onLine){
      if (!offBadge){ offBadge = document.createElement('div'); offBadge.className = 'pwa-pill off'; offBadge.textContent = 'Офлайн режим'; bar.appendChild(offBadge); }
    } else if (offBadge){ offBadge.remove(); offBadge = null; }
  }
  addEventListener('online', net); addEventListener('offline', net); net();
})();
