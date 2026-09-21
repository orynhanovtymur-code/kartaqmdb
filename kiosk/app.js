/* ҚМДБ терминалы — Home page логикасы: рендер, тіл, тақырып, уақыт, намаз, навигация, масштаб */
(function(){
const D = window.KIOSK_DATA, U = window.KIOSK_UI;
const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, '0');
const store = {
  get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } },
  set(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }
};
const params = new URLSearchParams(location.search);
const state = {lang: store.get('kiosk-lang') || 'kk', times: null, preview: null};
if (params.get('lite')) document.documentElement.classList.add('lite');   // ?lite=1 — анимациясыз режим

/* ── Түнгі / жарық режим ── */
function applyTheme(t){
  document.documentElement.dataset.theme = t;
  document.querySelectorAll('[data-theme-set]').forEach(b => b.classList.toggle('on', b.dataset.themeSet === t));
  store.set('kiosk-theme', t);
}

/* ── Күн мен уақыт: григориан мен хижри кезектесіп ауысады ── */
const HIJRI = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {day:'numeric', month:'numeric', year:'numeric'});
function hijriText(d){
  const p = Object.fromEntries(HIJRI.formatToParts(d).map(x => [x.type, x.value]));
  return `${p.day} ${D.I18N.hijri[state.lang][+p.month - 1]} ${p.year} ${D.I18N.hijri.suffix[state.lang]}`;
}
let dateMode = 'greg', dateText = '', greetIdx = 0;
function tickClock(){
  const n = new Date();
  $('kClock').innerHTML = `${pad(n.getHours())}<i class="colon">:</i>${pad(n.getMinutes())}`;
  const greg = `${n.getDate()} ${D.I18N.months[state.lang][n.getMonth()]} ${n.getFullYear()}`;
  const text = dateMode === 'greg' ? greg : hijriText(n);
  if (text !== dateText){ dateText = text; $('kDate').textContent = text; }
}
function fadeSwap(el, apply){
  el.style.opacity = 0; el.style.transform = 'translateY(6px)';
  setTimeout(() => { apply(); el.style.opacity = ''; el.style.transform = ''; }, 400);
}
const rotateDate = () => fadeSwap($('kDate'), () => { dateMode = dateMode === 'greg' ? 'hij' : 'greg'; tickClock(); });
function rotateGreeting(){
  const g = D.I18N.t.greet, order = [state.lang, ...['kk', 'ru', 'en'].filter(k => k !== state.lang)];
  greetIdx = (greetIdx + 1) % order.length;
  fadeSwap($('kGreet'), () => { $('kGreet').textContent = g[order[greetIdx]]; });
}

/* ── Намаз уақыттары: келесі намаз, санақ, прогресс, аспан фоны ── */
const PHASE = {fajr:'fajr', sunrise:'sunrise', dhuhr:'noon', asr:'asr', maghrib:'sunset', isha:'night'};
const prayerDate = (hhmm, dayOffset = 0) => { const [h, m] = hhmm.split(':').map(Number), d = new Date(); d.setDate(d.getDate() + dayOffset); d.setHours(h, m, 0, 0); return d; };
let lastNext = null;
function tickPrayer(force){
  if (!state.times) return;
  const now = new Date(), order = D.PRAYER_ORDER;
  let idx = order.findIndex(k => prayerDate(state.times[k]) > now), target;
  if (idx === -1){ idx = 0; target = prayerDate(state.times[order[0]], 1); } else target = prayerDate(state.times[order[idx]]);
  const key = order[idx], prevIdx = (idx + order.length - 1) % order.length;
  if (force || key !== lastNext){
    lastNext = key;
    document.querySelectorAll('.k-time').forEach(el => {
      const i = order.indexOf(el.dataset.p);
      el.classList.toggle('next', i === idx);
      el.classList.toggle('past', idx !== 0 && i < idx);
    });
    $('kNextName').textContent = U.tr(D.PRAYER_NAMES[key], state.lang).toUpperCase();
    $('kNextTime').textContent = state.times[key];
  }
  const prev = prayerDate(state.times[order[prevIdx]], idx === 0 ? -1 : 0);
  const frac = Math.min(1, Math.max(0, (now - prev) / (target - prev)));
  const phase = params.get('phase') || state.preview || (idx === 0 ? 'night' : PHASE[order[prevIdx]]);
  document.querySelectorAll('.sc').forEach(el => el.classList.toggle('on', el.dataset.ph === phase));
  $('kBar').style.width = (frac * 100).toFixed(1) + '%';
  const s = Math.max(0, Math.round((target - now) / 1000));
  $('kCountdown').textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s % 3600 / 60))}:${pad(s % 60)}`;
}

/* Интерактивті карта: сандар 0-ден өседі (тек бір рет) */
function runCounters(){
  document.querySelectorAll('[data-count]').forEach(el => {
    const to = +el.dataset.count, t0 = performance.now();
    (function step(t){
      const k = Math.min(1, (t - t0) / 1800);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString('ru-RU');
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  });
}

/* Айналатын алтын рамка: жұмсақ градиент жарығы карточка жиегін бойлай баяу айналады.
   [ұзақтығы (с), бағыты (1 / -1), бастапқы фазасы (с)] — әр карточкада әртүрлі */
const FRAME = {structure:[7,1,0], leadership:[9,-1,-2], departments:[6,1,-4], services:[8,-1,-1], regions:[10,1,-6], products:[7.5,-1,-3], munara:[6.5,1,-5]};
function fitFrames(){
  document.querySelectorAll('.k-card').forEach(card => {
    const svg = card.querySelector('.frame'), cfg = FRAME[card.dataset.nav]; if (!svg || !cfg) return;
    const w = card.offsetWidth, h = card.offsetHeight, cx = w / 2, cy = h / 2, R = Math.hypot(w, h) / 2 * 0.85;
    const [dur, dir, begin] = cfg, id = 'fg-' + card.dataset.nav;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.innerHTML = `
      <defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${cx - R}" y1="${cy}" x2="${cx + R}" y2="${cy}">
        <stop offset=".42" stop-color="#e8cf8f" stop-opacity="0"/><stop offset=".7" stop-color="#e8cf8f" stop-opacity=".4"/>
        <stop offset=".92" stop-color="#f6e6b0" stop-opacity=".9"/><stop offset="1" stop-color="#fff3cf"/>
        <animateTransform attributeName="gradientTransform" type="rotate" from="${dir > 0 ? 0 : 360} ${cx} ${cy}" to="${dir > 0 ? 360 : 0} ${cx} ${cy}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>
      </linearGradient></defs>
      <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="27" stroke="url(#${id})" stroke-width="7" opacity=".22"/>
      <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="27" stroke="url(#${id})" stroke-width="2"/>`;
  });
}

/* ── Рендер ── */
let firstRender = true;
function render(){
  const L = state.lang;
  document.documentElement.lang = L;
  $('kHeader').innerHTML = U.Header(L);
  $('kSide').innerHTML = U.SidePanel(L);
  $('kMain').innerHTML = U.NamazTimesWidget(L, state.times) + U.MainMenuGrid(L);
  applyTheme(document.documentElement.dataset.theme);
  greetIdx = 0; dateText = '';
  fitFrames();
  tickClock(); tickPrayer(true);
  if (firstRender){ firstRender = false; runCounters(); }
}

/* ── Басу оқиғалары ── */
document.addEventListener('click', e => {
  const t = e.target;
  const time = t.closest('.k-time');           // тест: намаз уақытын басқанда сол мезгілдің фонын көру (қайта бассаңыз — автомат)
  if (time){
    state.preview = state.preview === PHASE[time.dataset.p] ? null : PHASE[time.dataset.p];
    document.querySelectorAll('.k-time').forEach(el => el.classList.toggle('preview', !!state.preview && PHASE[el.dataset.p] === state.preview));
    tickPrayer(true); return;
  }
  const nav = t.closest('[data-nav]');
  if (nav){
    const item = D.MENU.find(m => m.id === nav.dataset.nav);
    if (item && item.route){ $('screen').classList.add('leaving'); setTimeout(() => { location.href = item.route; }, 280); }
    return;
  }
  const lang = t.closest('[data-lang]');
  if (lang){ state.lang = lang.dataset.lang; store.set('kiosk-lang', state.lang); render(); return; }
  const theme = t.closest('[data-theme-set]');
  if (theme) applyTheme(theme.dataset.themeSet);
});

/* ── Idle режим (архитектура; әзірге өшірулі) ── */
(function idle(){
  const c = D.IDLE_CONFIG; if (!c.enabled) return;
  let timer;
  const reset = () => { clearTimeout(timer); timer = setTimeout(() => document.dispatchEvent(new CustomEvent('kiosk:idle', {detail: c})), c.timeoutMs); };
  ['touchstart', 'pointerdown', 'keydown'].forEach(ev => addEventListener(ev, reset, {passive: true}));
  reset();
})();

/* ── Экранды 1920×1080 масштабтау және пайдаланушы zoom-ын өшіру ── */
const fit = () => { $('screen').style.transform = `translate(-50%,-50%) scale(${Math.min(innerWidth / 1920, innerHeight / 1080)})`; };
addEventListener('resize', fit);
addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, {passive: false});
addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0', '_'].includes(e.key)) e.preventDefault(); });
['touchstart', 'touchmove'].forEach(ev => addEventListener(ev, e => { if (e.touches.length > 1) e.preventDefault(); }, {passive: false}));
['gesturestart', 'gesturechange', 'gestureend'].forEach(ev => addEventListener(ev, e => e.preventDefault()));
addEventListener('contextmenu', e => e.preventDefault());

/* ── Іске қосу ── */
applyTheme(store.get('kiosk-theme') === 'dark' ? 'dark' : 'light');
fit(); render();
D.PrayerService.get().then(t => { state.times = t; render(); });
setInterval(() => { tickClock(); tickPrayer(); }, 1000);
setInterval(rotateGreeting, 5000);
setInterval(rotateDate, 4500);
})();
