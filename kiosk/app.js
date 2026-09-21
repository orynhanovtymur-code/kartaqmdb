/* ҚМДБ терминалы — Home page логикасы: рендер, тіл, уақыт, намаз, навигация, idle */
(function(){
const D = window.KIOSK_DATA, U = window.KIOSK_UI;
const state = {lang: (function(){try{return localStorage.getItem('kiosk-lang')}catch(e){}})() || 'kk', times:null};

const $ = id => document.getElementById(id);

/* ── Түнгі / жарық режим ── */
function applyTheme(t){
  document.documentElement.dataset.theme = t;
  document.querySelectorAll('[data-theme-set]').forEach(b=>b.classList.toggle('on', b.dataset.themeSet === t));
  try{ localStorage.setItem('kiosk-theme', t); }catch(e){}
}
applyTheme((function(){ try{ return localStorage.getItem('kiosk-theme'); }catch(e){} })() === 'dark' ? 'dark' : 'light');
const pad = n => String(n).padStart(2,'0');

/* ── Рендер ── */
function render(){
  const L = state.lang;
  document.documentElement.lang = L;
  $('kHeader').innerHTML = U.Header(L);
  $('kSide').innerHTML = U.SidePanel(L, state.times);
  $('kMain').innerHTML = U.NamazTimesWidget(L, state.times) + U.MainMenuGrid(L);
  applyTheme(document.documentElement.dataset.theme);
  tickClock(); tickPrayer(true); greetIdx = 0;
  setTimeout(runCounters, 700);
}

/* ── Уақыт пен күн ── */
let newsIdx = 0;
function rotateNews(){
  const el = $('kNewsText'); if (!el) return;
  newsIdx = (newsIdx + 1) % D.NEWS.length;
  const n = D.NEWS[newsIdx];
  el.style.opacity = 0;
  setTimeout(()=>{ el.textContent = n.date + ' · ' + U.tr(n.title, state.lang); el.style.opacity = 1; }, 350);
}
const HIJRI_FMT = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {day:'numeric', month:'numeric', year:'numeric'});
function hijriText(d){
  const p = Object.fromEntries(HIJRI_FMT.formatToParts(d).map(x=>[x.type, x.value]));
  return p.day + ' ' + D.I18N.hijri[state.lang][+p.month - 1] + ' ' + p.year + ' ' + D.I18N.hijri.suffix[state.lang];
}
/* Күн жолы: григориан мен хижри кезектесіп ауысады (бір қатарда) */
let dateMode = 'greg', dateFading = false, dateTexts = {};
function rotateDate(){
  const el = $('kDate'); if (!el) return;
  dateMode = dateMode === 'greg' ? 'hij' : 'greg';
  dateFading = true; el.style.opacity = 0; el.style.transform = 'translateY(6px)';
  setTimeout(()=>{ el.textContent = dateTexts[dateMode]; el.style.opacity = 1; el.style.transform = 'none'; dateFading = false; }, 400);
}
function tickClock(){
  const n = new Date();
  $('kClock').innerHTML = pad(n.getHours()) + '<i class="colon">:</i>' + pad(n.getMinutes());
  const greg = n.getDate() + ' ' + D.I18N.months[state.lang][n.getMonth()] + ' ' + n.getFullYear();
  const hij = hijriText(n);
  dateTexts = {greg, hij};
  if (!$('kDate').textContent) $('kDate').textContent = dateMode === 'hij' ? hij : greg;
  else if (!dateFading) $('kDate').textContent = dateMode === 'hij' ? hij : greg;
}

/* ── Намаз уақыттары және countdown ── */
function prayerDate(hhmm, dayOffset){
  const [h,m] = hhmm.split(':').map(Number), d = new Date();
  d.setDate(d.getDate() + (dayOffset||0)); d.setHours(h, m, 0, 0); return d;
}
let lastNext = null;
const FORCE_PHASE = new URLSearchParams(location.search).get('phase'); // тест үшін: ?phase=night|fajr|sunrise|noon|asr|sunset
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
    $('kNextTime').textContent = state.times[key];
  }
  const prevIdx = (idx + order.length - 1) % order.length;
  const prev = prayerDate(state.times[order[prevIdx]], idx === 0 ? -1 : 0);
  const frac = Math.min(1, Math.max(0, (now - prev) / (target - prev)));
  const PH = {fajr:'fajr', sunrise:'sunrise', dhuhr:'noon', asr:'asr', maghrib:'sunset', isha:'night'};
  const phase = FORCE_PHASE || state.preview || (idx === 0 ? 'night' : PH[order[prevIdx]]);
  document.querySelectorAll('.sc').forEach(el=>el.classList.toggle('on', el.dataset.ph === phase));
  const bar = $('kBar'); if (bar) bar.style.width = (frac*100).toFixed(1) + '%';
  const s = Math.max(0, Math.round((target - now)/1000));
  $('kCountdown').textContent = pad(Math.floor(s/3600)) + ':' + pad(Math.floor(s%3600/60)) + ':' + pad(s%60);
}

/* ── Жандандыру: сәлемдесу, placeholder, санауыштар ── */
let greetIdx = 0;
function rotateGreeting(){
  const el = $('kGreet'); if (!el) return;
  const g = D.I18N.t.greet, order = [state.lang, ...['kk','ru','en'].filter(k=>k!==state.lang)];
  greetIdx = (greetIdx + 1) % order.length;
  el.style.opacity = 0; el.style.transform = 'translateY(10px)';
  setTimeout(()=>{ el.textContent = g[order[greetIdx]]; el.style.opacity = 1; el.style.transform = 'none'; }, 400);
}
let phIdx = 0;
function rotatePlaceholder(){
  const el = $('kSearch'); if (!el || document.activeElement === el) return;
  phIdx = (phIdx + 1) % D.I18N.t.ph.length;
  el.placeholder = U.tr(D.I18N.t.ph[phIdx], state.lang);
}
function runCounters(){
  document.querySelectorAll('[data-count]').forEach(el=>{
    const to = +el.dataset.count, t0 = performance.now(), dur = 1800;
    (function step(t){
      const k = Math.min(1, (t - t0)/dur), e = 1 - Math.pow(1-k, 3);
      el.textContent = Math.round(to*e).toLocaleString('ru-RU');
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  });
}

/* ── Навигация ── */
const REGISTRY = {};
D.MENU.forEach(m => REGISTRY['menu:'+m.id] = m);
D.QUICK_ACTIONS.forEach(m => REGISTRY['quick:'+m.id] = m);
D.SECONDARY.forEach(m => REGISTRY['secondary:'+m.id] = m);
REGISTRY['reception:'+D.RECEPTION.id] = D.RECEPTION;

let toastTimer;
function toast(msg){
  const t = $('kToast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>t.classList.remove('show'), 2200);
}
function go(item){
  if (item.route){
    $('screen').classList.add('leaving');
    setTimeout(()=>{ location.href = item.route; }, 280);
  }
}

const PH_OF = {fajr:'fajr', sunrise:'sunrise', dhuhr:'noon', asr:'asr', maghrib:'sunset', isha:'night'};
document.addEventListener('click', e=>{
  /* ТЕСТ: намаз уақытын басқанда сол мезгілдің фонын көрсету (қайта бассаңыз — автомат режим) */
  const tm = e.target.closest('.k-time');
  if (tm){
    const ph = PH_OF[tm.dataset.p];
    state.preview = state.preview === ph ? null : ph;
    document.querySelectorAll('.k-time').forEach(el=>el.classList.toggle('preview', !!state.preview && PH_OF[el.dataset.p] === state.preview));
    tickPrayer(true); return;
  }
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
  const ts = e.target.closest('[data-theme-set]');
  if (ts){ applyTheme(ts.dataset.themeSet); return; }
  const act = e.target.closest('[data-act]');
  if (act){
    if (act.dataset.act === 'theme') applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
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
setInterval(rotateGreeting, 5000);
setInterval(rotateDate, 4500);
let heading = 0;
setInterval(()=>{ const el = $('kHead'); if (!el) return; heading = (heading + 1.4) % 360; el.textContent = String(Math.floor(heading)).padStart(3,'0'); }, 60);
setInterval(rotatePlaceholder, 3500);
Idle.start();
})();
