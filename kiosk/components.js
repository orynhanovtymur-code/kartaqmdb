/* ҚМДБ терминалы — Home page компоненттері (HTML қайтаратын таза функциялар) */
(function(){
const D = window.KIOSK_DATA;
const icon = (name, cls='') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${D.ICONS[name]||''}</svg>`;
const tr = (o, lang) => (o && (o[lang] || o.kk)) || '';
const T = (k, lang) => tr(D.I18N.t[k], lang);

function Header(lang){
  return `
    <div class="k-brand">
      <div class="k-logo"><img src="./assets/logo-qmdb.png" alt="ҚМДБ"></div>
      <div><h1>${T('orgName', lang)}</h1><small>${T('terminal', lang)}</small></div>
    </div>
    <div class="k-loc">${icon('pin')}<span>${tr(D.PrayerService.city, lang)}</span></div>
    <div class="k-lang" role="group" aria-label="Тіл / Язык">
      <button data-lang="kk" class="${lang==='kk'?'on':''}">KAZ</button>
      <button data-lang="ru" class="${lang==='ru'?'on':''}">РУС</button>
      <button data-lang="en" class="${lang==='en'?'on':''}">ENG</button>
    </div>
    <button class="k-theme" data-act="theme" aria-label="${T('themeToDark', lang)} / ${T('themeToLight', lang)}">${icon('moon','ti-moon')}${icon('sun','ti-sun')}</button>
    <div class="k-clock"><b id="kClock">--:--</b><span id="kDate"></span></div>`;
}

/* Сол жақ панель: сурет + қош келдіңіз, намаз, бүгінгі іс-шаралар */

/* 360° тур: сурет орнына сызықты панорама (мешіт, мұнаралар, ғимараттар) */
function SkylineSVG(){
  return `<svg viewBox="0 0 600 120" width="600" height="120" preserveAspectRatio="none"><g fill="currentColor">
    <rect x="0" y="82" width="58" height="38"/><rect x="62" y="30" width="9" height="90"/><path d="M60 30l6.5-16 6.5 16z"/>
    <rect x="86" y="72" width="124" height="48"/><path d="M104 72a43 43 0 0 1 88 0z"/><rect x="146" y="14" width="3" height="16"/>
    <rect x="222" y="34" width="9" height="86"/><path d="M220 34l6.5-17 6.5 17z"/>
    <rect x="244" y="66" width="56" height="54"/><rect x="304" y="88" width="40" height="32"/>
    <rect x="352" y="84" width="84" height="36"/><path d="M362 84a32 32 0 0 1 64 0z"/>
    <rect x="452" y="42" width="20" height="78"/><path d="M450 42l12-20 12 20z"/>
    <rect x="484" y="76" width="56" height="44"/><rect x="544" y="94" width="56" height="26"/>
  </g></svg>`;
}


/* 360° тур: минималистік циферблат — айналатын градус белгілері және орбитадағы нүкте */
function Dial360(){
  let ticks = '';
  for (let i = 0; i < 72; i++){
    const long = i % 6 === 0, a = i * 5, len = long ? 14 : 7;
    ticks += `<line x1="100" y1="6" x2="100" y2="${6 + len}" transform="rotate(${a} 100 100)" stroke-width="${long ? 2.2 : 1.2}"/>`;
  }
  return `<div class="dial" aria-hidden="true"><svg viewBox="0 0 200 200">
    <g class="ticks">${ticks}</g>
    <circle class="orbit" cx="100" cy="100" r="66"/>
    <g class="odot"><circle cx="100" cy="34" r="6"/></g>
    <text x="100" y="112" text-anchor="middle" class="dl">360°</text>
  </svg></div>`;
}


/* 360° тур: ғимараттың сызықты жоспары, ішінде көру бұрышы бар нүкте жүріп өтеді */
function PlanTour(){
  const rooms = [
    [22,22,68,42],[96,22,68,42],[170,22,68,42],[244,22,34,42],
    [22,98,80,42],[108,98,80,42],[194,98,84,42]
  ];
  return `<div class="plan" aria-hidden="true"><svg viewBox="0 0 300 162">
    <rect class="wall" x="10" y="10" width="280" height="142" rx="12"/>
    ${rooms.map((r,i)=>`<rect class="room r${i}" x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" rx="5" style="animation-delay:${(i*1.8).toFixed(1)}s"/>`).join('')}
    <path class="route" d="M24 81 H130 V43 H60 V81 H200 V119 H150 V81 H262 V119 H240 V81 H24"/>
    <g class="walker">
      <path class="cone" d="M0 0 L34 -15 A37 37 0 0 1 34 15 Z"/>
      <circle class="me" r="5"/>
      <animateMotion dur="26s" repeatCount="indefinite" rotate="auto" path="M24 81 H130 V43 H60 V81 H200 V119 H150 V81 H262 V119 H240 V81 H24"/>
    </g>
  </svg></div>`;
}

function BuildingVisual(lang){
  return `
    <div class="k-visual">
      <svg class="ph" viewBox="0 0 560 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="#e8cf8f" stroke-opacity=".55" stroke-width="1.6">
          <path d="M60 300V150h80v150M140 300V110h90v190M230 300V80h100v220M330 300V120h90v180M420 300V160h80v140"/>
          <path d="M260 80l20-30 20 30M280 50V30"/>
        </g>
      </svg>
      <img src="./assets/qmdb-building.jpeg" alt="" onerror="this.remove()">
      <div class="cap"><h2 id="kGreet">${D.I18N.t.greet[lang]}</h2><span>${T('orgShort', lang)}</span></div>
    </div>`;
}


/* Күн уақытына сай өзгеретін аспан фоны (намаз панелі) */
function SkyScene(){
  const sun = '<i class="sun"></i>';
  const cloud = '<i class="cloud c1"></i><i class="cloud c2"></i><i class="cloud c3"></i>';
  const stars = '<i class="stars"></i><i class="stars s2"></i>';
  const moon = '<svg class="moon" viewBox="0 0 40 40"><path d="M27 4a17 17 0 1 0 9 26A14 14 0 0 1 27 4z" fill="#f6f0cf"/></svg>';
  return `<div class="scene" aria-hidden="true">
    <div class="sc" data-ph="night">${stars}${moon}</div>
    <div class="sc" data-ph="fajr">${stars}<i class="glow"></i></div>
    <div class="sc" data-ph="sunrise"><i class="glow"></i>${sun}${cloud}</div>
    <div class="sc" data-ph="noon">${sun}${cloud}</div>
    <div class="sc" data-ph="asr">${sun}${cloud}</div>
    <div class="sc" data-ph="sunset"><i class="glow"></i>${sun}${cloud}</div>
  </div>`;
}


/* Түрлі-түсті намаз иконкалары */
const PRAYER_GLYPH = {
  fajr:'<path d="M7 13a5 5 0 0 1 10 0z" fill="#fff"/><rect x="5" y="15" width="14" height="1.6" rx=".8" fill="#fff"/><rect x="8" y="18" width="8" height="1.6" rx=".8" fill="#fff" opacity=".7"/>',
  sunrise:'<path d="M7 14.5a5 5 0 0 1 10 0z" fill="#c9d8ff"/><path d="M12 11V5.5M9.6 7.9 12 5.5l2.4 2.4" stroke="#fff" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="5" y="16.4" width="14" height="1.6" rx=".8" fill="#fff"/><rect x="8" y="19" width="8" height="1.4" rx=".7" fill="#fff" opacity=".7"/>',
  dhuhr:'<circle cx="12" cy="12" r="3.6" fill="#fff"/><path d="M12 4v2.2M12 17.8V20M4 12h2.2M17.8 12H20M6.3 6.3l1.5 1.5M16.2 16.2l1.5 1.5M6.3 17.7l1.5-1.5M16.2 7.8l1.5-1.5" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>',
  asr:'<circle cx="12" cy="12" r="4.4" fill="#fff"/><path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M6 18l1.4-1.4M16.6 7.4 18 6" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>',
  maghrib:'<path d="M7 14.5a5 5 0 0 1 10 0z" fill="#ffd0d3"/><path d="M12 5.5V11M9.6 9.1 12 11.5l2.4-2.4" stroke="#fff" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="5" y="16.4" width="14" height="1.6" rx=".8" fill="#fff"/><rect x="8" y="19" width="8" height="1.4" rx=".7" fill="#fff" opacity=".7"/>',
  isha:'<path d="M15.8 15.6A6.2 6.2 0 1 1 10.4 6.3a5 5 0 0 0 5.4 9.3z" fill="#b9b4f4"/><path d="M17.5 5.2v3M16 6.7h3M19.5 10.4v1.6M18.7 11.2h1.6" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>'
};
function PrayerIcon(k){
  return `<span class="pi pi-${k}"><svg viewBox="0 0 24 24" aria-hidden="true">${PRAYER_GLYPH[k]}</svg></span>`;
}

function NamazTimesWidget(lang, times){
  const cells = D.PRAYER_ORDER.map(k => `
    <div class="k-time" data-p="${k}">${PrayerIcon(k)}<span>${tr(D.PRAYER_NAMES[k], lang)}</span><b>${times ? times[k] : '--:--'}</b></div>`).join('');
  return `
    <div class="k-namaz">
      <div class="k-next">
        ${SkyScene()}
        <div class="cols">
          <div class="l"><div class="lab">${T('nextPrayer', lang)}</div><div class="nm" id="kNextName">—</div></div>
          <div class="r"><div class="cd"><span id="kCountdown">--:--:--</span></div><div class="tm" id="kNextTime"></div></div>
        </div>
        <div class="bar"><i id="kBar"></i></div>
      </div>
      <div class="k-times">${cells}</div>
    </div>`;
}

function TodayEvents(lang){
  return `
    <div class="k-today">
      <h4>${T('today', lang)}</h4>
      ${D.EVENTS.map(e=>`<div class="k-event"><b>${e.time}</b><span>${tr(e.title, lang)}<small>${tr(e.place, lang)}</small></span></div>`).join('')}
    </div>`;
}

function SidePanel(lang, times){
  return BuildingVisual(lang) + ReceptionCard(lang) + NewsSection(lang);
}

/* Оң жақ: іздеу + жылдам чиптер */
function GlobalSearch(lang){
  return `
    <label class="k-search">
      ${icon('search')}
      <input id="kSearch" type="text" placeholder="${T('searchPh', lang)}" data-ph="1" autocomplete="off" inputmode="search">
      <button class="go" data-act="search">${T('find', lang)}</button>
    </label>`;
}

function QuickActions(lang){
  return `
    <div class="k-quick">
      ${D.QUICK_ACTIONS.map(a=>`<button class="k-chip" data-nav="quick:${a.id}">${icon(a.icon)}<span>${tr(a.title, lang)}</span></button>`).join('')}
    </div>`;
}

function HeroSection(lang){
  return `<div class="k-find">${GlobalSearch(lang)}${QuickActions(lang)}</div>`;
}

/* Мәзір: 1 үлкен басты карточка + 7 бірдей плитка, топтар түсі бойынша ажыратылады */
function MenuCard(item, lang, i){
  if (item.primary) return `
    <button class="k-card feature anim" data-nav="menu:${item.id}" style="animation-delay:${0.2+i*0.06}s">
      <div class="pings" aria-hidden="true"><i style="left:60%;top:12%"></i><i style="left:82%;top:9%;animation-delay:.7s"></i><i style="left:91%;top:30%;animation-delay:1.4s"></i><i style="left:72%;top:24%;animation-delay:2.1s"></i><i style="left:94%;top:58%;animation-delay:1s"></i></div>
      <div class="ic">${icon(item.icon)}</div>
      <div class="stats">${D.STATS.map(x=>`<div><b data-count="${x.n}">0</b><span>${T(x.label, lang)}</span></div>`).join('')}</div>
      <div class="tx"><h3>${tr(item.title, lang)}</h3><p>${tr(item.sub, lang)}</p></div>
      <div class="foot"><span class="cta">${T('openMap', lang)} ${icon('arrow')}</span></div>
    </button>`;
  return `
    <button class="k-card g-${item.group} m-${item.id} anim" data-nav="menu:${item.id}" style="animation-delay:${0.2+i*0.06}s">
      ${item.group==='media' ? `<div class="tv" aria-hidden="true"></div><span class="live"><i></i>${T('live', lang)}</span>` : ''}
      ${item.group==='tour' ? PlanTour() : ''}
      <div class="ic">${icon(item.icon)}</div>
      <div class="tx"><h3>${tr(item.title, lang).replace('\n','<br>')}</h3></div>
      
      <span class="go">${icon('arrow')}</span>
    </button>`;
}

function MainMenuGrid(lang){
  const order = ['map','structure','leadership','departments','services','regions','products','munara','tour'];
  const items = order.map(id => D.MENU.find(m => m.id === id));
  return `<div class="k-grid">${items.map((m,i)=>MenuCard(m, lang, i)).join('')}</div>`;
}

function SecondaryActions(lang){
  return `<div class="k-secondary">
    ${D.SECONDARY.map(a=>`<button class="k-sbtn" data-nav="secondary:${a.id}">${icon(a.icon)}<span>${tr(a.title, lang)}</span></button>`).join('')}
  </div>`;
}

function ReceptionCard(lang){
  const r = D.RECEPTION;
  return `
    <div class="k-reception">
      <div class="ph"><i class="ring"></i><i class="pulse"></i><img src="${r.photo}" alt="" onerror="this.remove()"></div>
      <div class="tx">
        <span class="role">${tr(r.role, lang)}</span>
        <b class="nm">${tr(r.name, lang)}</b>
      </div>
    </div>`;
}

function NewsSection(lang){
  return `
    <div class="k-newsbox">
      <h4>${T('news', lang)}</h4>
      <div class="list">${D.NEWS.slice(0,4).map(n=>`<div class="ni"><span class="d">${n.date}</span><span class="t">${tr(n.title, lang)}</span></div>`).join('')}</div>
    </div>`;
}

function Footer(lang){
  return `
    <div class="fi">${icon('globe')}muftyat.kz</div>
    <div class="fi">${icon('phone')}1511 Call Center</div>
    <div class="fi"><span class="qr">QR</span>${T('official', lang)}</div>
    <div class="fi">${T('rights', lang)}</div>`;
}

window.KIOSK_UI = {icon, tr, T, Header, HeroSection, GlobalSearch, NamazTimesWidget, MenuCard, MainMenuGrid, QuickActions, SecondaryActions, ReceptionCard, BuildingVisual, SidePanel, NewsSection, TodayEvents, Footer};
})();
