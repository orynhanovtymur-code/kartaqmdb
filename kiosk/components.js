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
    <button class="k-hsearch" data-act="focus-search">${icon('search')}<span>${T('search', lang)}</span></button>
    <div class="k-lang" role="group" aria-label="Тіл / Язык">
      <button data-lang="kk" class="${lang==='kk'?'on':''}">KAZ</button>
      <button data-lang="ru" class="${lang==='ru'?'on':''}">РУС</button>
    </div>
    <div class="k-clock"><b id="kClock">--:--</b><span id="kDate"></span></div>`;
}

function GlobalSearch(lang){
  return `
    <label class="k-search">
      ${icon('search')}
      <input id="kSearch" type="text" placeholder="${T('searchPh', lang)}" autocomplete="off" inputmode="search">
      <button class="go" data-act="search">${T('find', lang)}</button>
    </label>`;
}

function HeroSection(lang){
  return `
    <div class="k-hero">
      <h2>${T('welcome', lang)}</h2>
      <div class="org">${T('orgShort', lang)}</div>
      <div class="hint">${T('choose', lang)}</div>
      ${GlobalSearch(lang)}
    </div>`;
}

function NamazTimesWidget(lang, times){
  const cells = D.PRAYER_ORDER.map(k => `
    <div class="k-time" data-p="${k}"><span>${tr(D.PRAYER_NAMES[k], lang)}</span><b>${times ? times[k] : '--:--'}</b></div>`).join('');
  return `
    <div class="k-namaz" id="kNamaz">
      <div class="k-next">
        <div class="lab">${tr(D.PrayerService.city, lang)} · ${T('nextPrayer', lang)}</div>
        <div class="nm"><span id="kNextName">—</span><em id="kNextTime"></em></div>
        <div class="cd"><span id="kCountdown">--:--:--</span> ${T('left', lang)}</div>
      </div>
      <div class="k-times">${cells}</div>
    </div>`;
}

function MenuCard(item, lang, i){
  return `
    <button class="k-card anim${item.primary?' primary':''}" data-nav="menu:${item.id}" style="animation-delay:${0.35+i*0.07}s">
      <div class="ic">${icon(item.icon)}</div>
      <div class="tx"><h3>${tr(item.title, lang)}</h3><p>${tr(item.sub, lang)}</p></div>
      ${item.primary ? `<span class="badge">${T('open', lang)} ›</span>` : ''}
    </button>`;
}

function MainMenuGrid(lang){
  return `
    <div class="k-title">${T('pickSection', lang)}</div>
    <div class="k-grid">${D.MENU.map((m,i)=>MenuCard(m, lang, i)).join('')}</div>`;
}

function QuickActions(lang){
  return `
    <div class="k-actions">
      <div class="k-quick">
        <div class="k-quick-lab">${T('quick', lang)}</div>
        ${D.QUICK_ACTIONS.map(a=>`<button class="k-qbtn" data-nav="quick:${a.id}">${icon(a.icon)}<span>${tr(a.title, lang)}</span></button>`).join('')}
      </div>
    </div>`;
}

function SecondaryActions(lang){
  return `<div class="k-secondary">
    ${D.SECONDARY.map(a=>`<button class="k-sbtn" data-nav="secondary:${a.id}">${icon(a.icon)}<span>${tr(a.title, lang)}</span></button>`).join('')}
  </div>`;
}

function BuildingVisual(lang){
  /* Сурет жоқ/жүктелмесе — абстрактілі ғимарат иллюстрациясы көрінеді */
  return `
    <div class="k-visual anim" style="animation-delay:.3s">
      <svg class="ph" viewBox="0 0 560 296" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="#e8cf8f" stroke-opacity=".55" stroke-width="1.6">
          <path d="M60 296V150h80v146M140 296V110h90v186M230 296V80h100v216M330 296V120h90v186M420 296V160h80v136"/>
          <path d="M260 80l20-30 20 30M280 50V30"/>
          <path d="M80 175h40M80 205h40M160 135h50M160 170h50M160 205h50M250 105h60M250 140h60M250 175h60M350 145h50M350 180h50M440 185h40"/>
        </g>
      </svg>
      <img src="./assets/qmdb-building.jpeg" alt="" onerror="this.remove()">
      <div class="cap"><b>${T('visual', lang)}</b><span>${T('visualSub', lang)}</span></div>
    </div>`;
}

function NewsSection(lang){
  return `
    <div class="k-panel anim" style="animation-delay:.5s">
      <h4>${T('news', lang)}</h4>
      <div class="k-list">${D.NEWS.map(n=>`<div class="k-news"><div class="d">${n.date}</div><div class="t">${tr(n.title, lang)}</div></div>`).join('')}</div>
    </div>`;
}

function TodayEvents(lang){
  return `
    <div class="k-panel anim" style="animation-delay:.6s">
      <h4>${T('today', lang)}</h4>
      <div class="k-list">${D.EVENTS.map(e=>`<div class="k-event"><div class="h">${e.time}</div><div class="n">${tr(e.title, lang)}<small>${tr(e.place, lang)}</small></div></div>`).join('')}</div>
    </div>`;
}

function Footer(lang){
  return `
    <div class="fi">${icon('globe')}muftyat.kz</div>
    <div class="fi">${icon('phone')}1511 Call Center</div>
    <div class="fi"><span class="qr">QR</span>${T('official', lang)}</div>
    <div class="fi">${T('rights', lang)}</div>`;
}

window.KIOSK_UI = {icon, tr, T, Header, HeroSection, GlobalSearch, NamazTimesWidget, MenuCard, MainMenuGrid, QuickActions, SecondaryActions, BuildingVisual, NewsSection, TodayEvents, Footer};
})();
