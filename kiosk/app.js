/* ҚМДБ терминалы — Home page логикасы: рендер, тіл, уақыт, намаз, навигация, idle */
(function(){
const D = window.KIOSK_DATA, U = window.KIOSK_UI;
const state = {lang: (function(){try{return localStorage.getItem('kiosk-lang')}catch(e){}})() || 'kk', times:null};

const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2,'0');

/* ── Рендер ── */
function render(){
  const L = state.lang;
  document.documentElement.lang = L === 'ru' ? 'ru' : 'kk';
  $('kHeader').innerHTML = U.Header(L);
  $('kMain').innerHTML = U.HeroSection(L) + U.NamazTimesWidget(L, state.times) + U.MainMenuGrid(L) + U.QuickActions(L);
  $('kSide').innerHTML = U.BuildingVisual(L) + U.NewsSection(L) + U.TodayEvents(L) + U.SecondaryActions(L);
  $('kFooter').innerHTML = U.Footer(L);
  tickClock(); tickPrayer(true);
}

/* ── Уақыт пен күн ── */
function tickClock(){
  const n = new Date();
  $('kClock').textContent = pad(n.getHours()) + ':' + pad(n.getMinutes());
  $('kDate').textContent = n.getDate() + ' ' + D.I18N.months[state.lang][n.getMonth()] + ' ' + n.getFullYear();
}

/* ── Намаз уақыттары және countdown ── */
function prayerDate(hhmm, dayOffset){
  const [h,m] = hhmm.split(':').map(Number), d = new Date();
  d.setDate(d.getDate() + (dayOffset||0)); d.setHours(h, m, 0, 0); return d;
}
let lastNext = null;
function tickPrayer(force){
  if (!state.times) return;
  const now = new Date(), order = D.PRAYER_ORDER;
  let idx = order.findIndex(k => prayerDate(state.times[k]) > now), target;
  if (idx === -1){ idx = 0; target = prayerDate(state.times[order[0]], 1); }
  else target = prayerDate(state.times[order[idx]]);
  const key = order[idx];
  if (force || key !== lastNext){
    lastNext = key;
    document.querySelectorAll('.k-time').forEach(el=>{
      const i = order.indexOf(el.dataset.p);
      el.classList.toggle('next', i === idx);
      el.classList.toggle('past', idx !== 0 && i < idx);
    });
    $('kNextName').textContent = U.tr(D.PRAYER_NAMES[key], state.lang).toUpperCase();
    $('kNextTime').textContent = '— ' + state.times[key];
  }
  const s = Math.max(0, Math.round((target - now)/1000));
  $('kCountdown').textContent = pad(Math.floor(s/3600)) + ':' + pad(Math.floor(s%3600/60)) + ':' + pad(s%60);
}

/* ── Навигация ── */
const REGISTRY = {};
D.MENU.forEach(m => REGISTRY['menu:'+m.id] = m);
D.QUICK_ACTIONS.forEach(m => REGISTRY['quick:'+m.id] = m);
D.SECONDARY.forEach(m => REGISTRY['secondary:'+m.id] = m);

let toastTimer;
function toast(msg){
  const t = $('kToast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>t.classList.remove('show'), 2200);
}
function go(item){
  if (item.route){
    $('screen').classList.add('leaving');
    setTimeout(()=>{ location.href = item.route; }, 280);
  } else toast(U.T('soon', state.lang));
}

document.addEventListener('click', e=>{
  const nav = e.target.closest('[data-nav]');
  if (nav){
    nav.classList.add('pressed'); setTimeout(()=>nav.classList.remove('pressed'), 220);
    const item = REGISTRY[nav.dataset.nav]; if (item) go(item); return;
  }
  const lang = e.target.closest('[data-lang]');
  if (lang){
    state.lang = lang.dataset.lang;
    try{ localStorage.setItem('kiosk-lang', state.lang); }catch(err){}
    render(); return;
  }
  const act = e.target.closest('[data-act]');
  if (act){
    if (act.dataset.act === 'focus-search') $('kSearch').focus();
    if (act.dataset.act === 'search') toast(U.T('searchSoon', state.lang));
  }
});
document.addEventListener('keydown', e=>{
  if (e.key === 'Enter' && e.target.id === 'kSearch') toast(U.T('searchSoon', state.lang));
});

/* ── Idle режим (архитектура; әзірге өшірулі) ── */
const Idle = {
  timer:null,
  start(){
    const c = D.IDLE_CONFIG; if (!c.enabled) return;
    const reset = () => { clearTimeout(this.timer); this.timer = setTimeout(()=>document.dispatchEvent(new CustomEvent('kiosk:idle',{detail:c})), c.timeoutMs); };
    ['touchstart','pointerdown','keydown'].forEach(t=>addEventListener(t, reset, {passive:true}));
    reset();
  }
};

/* ── Экран масштабы (карта беті сияқты 1920×1080) және zoom-ды өшіру ── */
function fit(){
  const s = Math.min(innerWidth/1920, innerHeight/1080);
  $('screen').style.transform = 'translate(-50%,-50%) scale('+s+')';
}
addEventListener('resize', fit);
addEventListener('wheel', e=>{ if (e.ctrlKey) e.preventDefault(); }, {passive:false});
addEventListener('keydown', e=>{ if ((e.ctrlKey||e.metaKey) && ['+','-','=','0','_'].includes(e.key)) e.preventDefault(); });
addEventListener('touchmove', e=>{ if (e.touches.length>1) e.preventDefault(); }, {passive:false});
addEventListener('touchstart', e=>{ if (e.touches.length>1) e.preventDefault(); }, {passive:false});
['gesturestart','gesturechange','gestureend'].forEach(t=>addEventListener(t, e=>e.preventDefault()));
addEventListener('contextmenu', e=>e.preventDefault());

/* ── Іске қосу ── */
fit(); render();
D.PrayerService.get().then(t=>{ state.times = t; render(); });
setInterval(()=>{ tickClock(); tickPrayer(); }, 1000);
Idle.start();
})();
