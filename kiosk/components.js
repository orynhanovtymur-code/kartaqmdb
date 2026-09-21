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
    <div class="k-clock"><b id="kClock">--:--</b><span id="kDate"></span></div>`;
}

/* Сол жақ панель: сурет + қош келдіңіз, намаз, бүгінгі іс-шаралар */
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

function NamazTimesWidget(lang, times){
  const cells = D.PRAYER_ORDER.map(k => `
    <div class="k-time" data-p="${k}">${icon(k)}<span>${tr(D.PRAYER_NAMES[k], lang)}</span><b>${times ? times[k] : '--:--'}</b></div>`).join('');
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
      <div class="ic">${icon(item.icon)}</div>
      <div class="tx"><h3>${tr(item.title, lang)}</h3><p>${tr(item.sub, lang)}</p></div>
      <div class="pings" aria-hidden="true"><i style="left:60%;top:12%"></i><i style="left:82%;top:9%;animation-delay:.7s"></i><i style="left:91%;top:30%;animation-delay:1.4s"></i><i style="left:72%;top:24%;animation-delay:2.1s"></i><i style="left:94%;top:58%;animation-delay:1s"></i></div>
      <div class="foot">
        <span class="cta">${T('openMap', lang)} ${icon('arrow')}</span>
        <div class="stats">${D.STATS.map(x=>`<div><b data-count="${x.n}">0</b><span>${T(x.label, lang)}</span></div>`).join('')}</div>
      </div>
    </button>`;
  return `
    <button class="k-card g-${item.group} m-${item.id} anim" data-nav="menu:${item.id}" style="animation-delay:${0.2+i*0.06}s">
      ${item.group==='media' ? `<div class="tv" aria-hidden="true"></div><span class="live"><i></i>${T('live', lang)}</span>` : ''}
      <div class="ic">${icon(item.icon)}${item.group==='tour' ? '<i class="spinring"></i>' : ''}</div>
      <div class="tx"><h3>${tr(item.title, lang)}</h3></div>
      ${item.group==='tour' ? '<span class="b360">360°</span>' : ''}
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
