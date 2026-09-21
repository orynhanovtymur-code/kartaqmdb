/* ҚМДБ терминалы — Home page компоненттері (HTML қайтаратын таза функциялар) */
(function(){
const D = window.KIOSK_DATA;
const icon = name => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${D.ICONS[name] || ''}</svg>`;
const tr = (o, lang) => (o && (o[lang] || o.kk)) || '';
const T = (k, lang) => tr(D.I18N.t[k], lang);

function Header(lang){
  const langBtn = (code, label) => `<button data-lang="${code}"${lang === code ? ' class="on"' : ''}>${label}</button>`;
  return `
    <div class="k-brand">
      <div class="k-logo"><img src="./assets/logo-qmdb.png" alt="ҚМДБ"></div>
      <div><h1>${T('orgName', lang)}</h1><small>${T('terminal', lang)}</small></div>
    </div>
    <div class="k-loc">${icon('pin')}<span>${tr(D.PrayerService.city, lang)}</span></div>
    <div class="k-lang" role="group" aria-label="Тіл / Язык">${langBtn('kk','KAZ')}${langBtn('ru','РУС')}${langBtn('en','ENG')}</div>
    <div class="k-mode" role="group">
      <button data-theme-set="light" aria-label="${T('themeLight', lang)}">${icon('sun')}</button>
      <button data-theme-set="dark" aria-label="${T('themeDark', lang)}">${icon('moon')}</button>
    </div>
    <div class="k-clock"><b id="kClock">--:--</b><span id="kDate"></span></div>`;
}

function BuildingVisual(lang){
  return `
    <div class="k-visual">
      <img src="./assets/qmdb-building.jpeg" alt="" onerror="this.remove()">
      <div class="cap"><h2 id="kGreet">${T('greet', lang)}</h2><span>${T('orgShort', lang)}</span></div>
    </div>`;
}

function ReceptionCard(lang){
  const r = D.RECEPTION;
  return `
    <div class="k-reception">
      <div class="ph"><i></i><svg class="orbit" viewBox="0 0 118 118" aria-hidden="true">
        <defs><linearGradient id="muftiGrad" gradientUnits="userSpaceOnUse" x1="4" y1="59" x2="114" y2="59">
          <stop offset=".42" stop-color="#e8cf8f" stop-opacity="0"/><stop offset=".72" stop-color="#e8cf8f" stop-opacity=".4"/><stop offset=".93" stop-color="#f6e6b0" stop-opacity=".9"/><stop offset="1" stop-color="#fff3cf"/>
          <animateTransform attributeName="gradientTransform" type="rotate" from="0 59 59" to="360 59 59" dur="6s" repeatCount="indefinite"/></linearGradient></defs>
        <circle cx="59" cy="59" r="57" stroke="url(#muftiGrad)" stroke-width="8" opacity=".25"/>
        <circle cx="59" cy="59" r="57" stroke="url(#muftiGrad)" stroke-width="3.5"/>
      </svg><img src="${r.photo}" alt="" onerror="this.remove()"></div>
      <div class="tx"><span class="role">${tr(r.role, lang)}</span><b class="nm">${tr(r.name, lang)}</b></div>
    </div>`;
}

function NewsSection(lang){
  return `
    <div class="k-newsbox">
      <h4>${T('news', lang)}</h4>
      ${D.NEWS.map(n => `<div class="ni"><span class="d">${n.date}</span><span class="t">${tr(n.title, lang)}</span></div>`).join('')}
    </div>`;
}

function SidePanel(lang){
  return BuildingVisual(lang) + ReceptionCard(lang) + NewsSection(lang);
}

/* Намаз панелі: мезгілге қарай аспан фоны (night/fajr — жұлдыздармен) */
function SkyScene(){
  const stars = '<i class="stars"></i>';
  return `<div class="scene" aria-hidden="true">
    <div class="sc" data-ph="night">${stars}</div><div class="sc" data-ph="fajr">${stars}</div>
    <div class="sc" data-ph="sunrise"></div><div class="sc" data-ph="noon"></div>
    <div class="sc" data-ph="asr"></div><div class="sc" data-ph="sunset"></div>
  </div>`;
}

const PRAYER_GLYPH = {
  fajr:'<path d="M7 13a5 5 0 0 1 10 0z" fill="#fff"/><rect x="5" y="15" width="14" height="1.6" rx=".8" fill="#fff"/><rect x="8" y="18" width="8" height="1.6" rx=".8" fill="#fff" opacity=".7"/>',
  sunrise:'<path d="M7 14.5a5 5 0 0 1 10 0z" fill="#c9d8ff"/><path d="M12 11V5.5M9.6 7.9 12 5.5l2.4 2.4" stroke="#fff" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="5" y="16.4" width="14" height="1.6" rx=".8" fill="#fff"/><rect x="8" y="19" width="8" height="1.4" rx=".7" fill="#fff" opacity=".7"/>',
  dhuhr:'<circle cx="12" cy="12" r="3.6" fill="#fff"/><path d="M12 4v2.2M12 17.8V20M4 12h2.2M17.8 12H20M6.3 6.3l1.5 1.5M16.2 16.2l1.5 1.5M6.3 17.7l1.5-1.5M16.2 7.8l1.5-1.5" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>',
  asr:'<circle cx="12" cy="12" r="4.4" fill="#fff"/><path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M6 18l1.4-1.4M16.6 7.4 18 6" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>',
  maghrib:'<path d="M7 14.5a5 5 0 0 1 10 0z" fill="#ffd0d3"/><path d="M12 5.5V11M9.6 9.1 12 11.5l2.4-2.4" stroke="#fff" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="5" y="16.4" width="14" height="1.6" rx=".8" fill="#fff"/><rect x="8" y="19" width="8" height="1.4" rx=".7" fill="#fff" opacity=".7"/>',
  isha:'<path d="M15.8 15.6A6.2 6.2 0 1 1 10.4 6.3a5 5 0 0 0 5.4 9.3z" fill="#b9b4f4"/><path d="M17.5 5.2v3M16 6.7h3M19.5 10.4v1.6M18.7 11.2h1.6" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>'
};
const PrayerIcon = k => `<span class="pi pi-${k}"><svg viewBox="0 0 24 24" aria-hidden="true">${PRAYER_GLYPH[k]}</svg></span>`;

function NamazTimesWidget(lang, times){
  const cells = D.PRAYER_ORDER.map(k => `
    <div class="k-time" data-p="${k}">${PrayerIcon(k)}<span>${tr(D.PRAYER_NAMES[k], lang)}</span><b>${times ? times[k] : '--:--'}</b></div>`).join('');
  return `
    <div class="k-namaz">
      <div class="k-next">
        ${SkyScene()}
        <div class="cols">
          <div class="lab">${T('nextPrayer', lang)}</div><div class="cd" id="kCountdown">--:--:--</div>
          <div class="nm" id="kNextName">—</div><div class="tm" id="kNextTime"></div>
        </div>
        <div class="bar"><i id="kBar"></i></div>
      </div>
      <div class="k-times">${cells}</div>
    </div>`;
}

/* 360° тур: ғимараттың сызықты жоспары, ішінде көру бұрышы бар нүкте жүріп өтеді */
const TOUR_PATH = 'M24 81 H130 V43 H60 V81 H200 V119 H150 V81 H262 V119 H240 V81 H24';
function PlanTour(){
  const rooms = [[22,22,68,42],[96,22,68,42],[170,22,68,42],[244,22,34,42],[22,98,80,42],[108,98,80,42],[194,98,84,42]];
  return `<div class="plan" aria-hidden="true"><svg viewBox="0 0 300 162">
    <rect class="wall" x="10" y="10" width="280" height="142" rx="12"/>
    ${rooms.map((r, i) => `<rect class="room" x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" rx="5" style="animation-delay:${(i * 1.8).toFixed(1)}s"/>`).join('')}
    <path class="route" d="${TOUR_PATH}"/>
    <g><path class="cone" d="M0 0 L34 -15 A37 37 0 0 1 34 15 Z"/><circle class="me" r="5"/>
      <animateMotion dur="26s" repeatCount="indefinite" rotate="auto" path="${TOUR_PATH}"/></g>
  </svg></div>`;
}

function MenuCard(item, lang, i){
  const delay = `style="animation-delay:${(0.15 + i * 0.05).toFixed(2)}s"`;
  if (item.id === 'map') return `
    <button class="k-card feature m-map anim" data-nav="${item.id}" ${delay}>
      <div class="ic">${icon(item.icon)}</div>
      <div class="stats">${D.STATS.map(x => `<div><b data-count="${x.n}">0</b><span>${T(x.label, lang)}</span></div>`).join('')}</div>
      <div class="tx"><h3>${tr(item.title, lang)}</h3><p>${tr(item.sub, lang)}</p></div>
      <span class="cta">${T('openMap', lang)} ${icon('arrow')}</span>
    </button>`;
  return `
    <button class="k-card m-${item.id} anim" data-nav="${item.id}" ${delay}>
      ${item.id === 'tour' ? PlanTour() : '<svg class="frame" aria-hidden="true"></svg>'}
      <div class="ic">${icon(item.icon)}</div>
      <div class="tx"><h3>${tr(item.title, lang)}</h3></div>
      <span class="go">${icon('arrow')}</span>
    </button>`;
}

const MainMenuGrid = lang => `<div class="k-grid">${D.MENU.map((m, i) => MenuCard(m, lang, i)).join('')}</div>`;

window.KIOSK_UI = {tr, T, SidePanel, NamazTimesWidget, MainMenuGrid, Header};
})();
