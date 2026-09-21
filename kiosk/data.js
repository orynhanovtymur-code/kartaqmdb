/* ҚМДБ терминалы — деректер мен конфигурация.
   Мәзір, жаңалық, іс-шара және намаз уақыты осында ғана басқарылады.
   Кейін бұл файлдың орнына API / Admin Panel жауабын қосуға болады. */
(function(){
const L = (kk, ru, en) => ({kk, ru, en});

const ICONS = {
  about:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  leadership:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M17 14c2.5 0 4 1.8 4 4.5"/>',
  structure:'<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="2" y="16" width="6" height="5" rx="1"/><rect x="16" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M5 16v-4h14v4"/>',
  building:'<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/>',
  map:'<path d="M4 21V11l8-6 8 6v10"/><path d="M12 5V2"/><path d="M9 21v-5a3 3 0 0 1 6 0v5"/>',
  orgs:'<path d="M3 21h18"/><path d="M5 21V8l5-3v16"/><path d="M14 21V11l5 2v8"/><path d="M8 10h.01M8 14h.01M17 15h.01"/>',
  digital:'<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/>',
  tv:'<rect x="3" y="5" width="18" height="13" rx="2"/><path d="M10 9.5v4l4-2z"/><path d="M8 21h8"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  person:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',
  door:'<path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17"/><path d="M4 21h16"/><path d="M14 12h.01"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/>',
  fajr:'<path d="M3 19h18"/><path d="M7 19a5 5 0 0 1 10 0"/><path d="M5 8h.01M12 5h.01M19 8h.01"/>',
  sunrise:'<path d="M3 19h18"/><path d="M7 19a5 5 0 0 1 10 0"/><path d="M12 3v6M9.5 5.5 12 3l2.5 2.5"/><path d="M4.9 11l1.8 1.8M19.1 11l-1.8 1.8"/>',
  dhuhr:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  asr:'<circle cx="12" cy="13" r="4"/><path d="M12 4v2M4.5 7.5 6 9M19.5 7.5 18 9M2 13h2M20 13h2M3 20h18"/>',
  maghrib:'<path d="M3 19h18"/><path d="M7 19a5 5 0 0 1 10 0"/><path d="M12 3v6M9.5 6.5 12 9l2.5-2.5"/><path d="M4.9 11l1.8 1.8M19.1 11l-1.8 1.8"/>',
  isha:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/><path d="M17 3v3M15.5 4.5h3"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'
};

/* route: null = ішкі бет әлі жасалмаған. Кейін тек route жолын қосу жеткілікті. */
const MENU = [
  {id:'about', group:'info',      icon:'about',      route:null, title:L('ҚМДБ туралы','О ҚМДБ','About SAMK'),               sub:L('Тарихы, миссиясы және қызмет бағыттары','История, миссия и направления деятельности','History, mission and areas of work')},
  {id:'leadership', group:'info', icon:'leadership', route:null, title:L('Басшылық','Руководство','Leadership'),             sub:L('Бас мүфти және ҚМДБ басшылығы','Верховный муфтий и руководство ДУМК','Grand Mufti and SAMK leadership')},
  {id:'structure', group:'info',  icon:'structure',  route:null, title:L('Құрылым','Структура','Structure'),                sub:L('Басқармалар, бөлімдер және секторлар','Управления, отделы и секторы','Departments, divisions and sectors')},
  {id:'building', group:'place',   icon:'building',   route:null, title:L('Ғимарат','Здание','Building'),                   sub:L('Қабаттар, кабинеттер және залдар','Этажи, кабинеты и залы','Floors, offices and halls')},
  {id:'map', group:'feature',        icon:'map',        route:'./map.html', primary:true,
                                                          title:L('Интерактивті карта','Интерактивная карта','Interactive map'), sub:L('Қазақстан мешіттері мен діни оқу орындары','Мечети и религиозные учебные заведения Казахстана','Mosques and religious educational institutions of Kazakhstan')},
  {id:'orgs', group:'place',       icon:'orgs',       route:null, title:L('Қарасты мекемелер','Подведомственные учреждения','Affiliated institutions'), sub:L('Оқу орындары, қорлар және ұйымдар','Учебные заведения, фонды и организации','Schools, foundations and organizations')},
  {id:'digital', group:'tech',    icon:'digital',    route:null, title:L('Цифрлық жобалар','Цифровые проекты','Digital projects'), sub:L('Қосымшалар, сайттар және онлайн платформалар','Приложения, сайты и онлайн-платформы','Apps, websites and online platforms')},
  {id:'munara', group:'media',     icon:'tv',         route:null, title:L('Munara TV','Munara TV','Munara TV'),              sub:L('Тікелей эфир және медиа жобалар','Прямой эфир и медиапроекты','Live broadcast and media projects')}
];

const QUICK_ACTIONS = [
  {id:'find-person', icon:'person', route:null, title:L('Қызметкерді табу','Найти сотрудника','Find an employee')},
  {id:'find-dept',   icon:'building', route:null, title:L('Бөлімді табу','Найти отдел','Find a department')},
  {id:'find-room',   icon:'door',   route:null, title:L('Кабинетті табу','Найти кабинет','Find an office')},
  {id:'find-mosque', icon:'map',    route:'./map.html', title:L('Мешітті табу','Найти мечеть','Find a mosque')}
];

const SECONDARY = [
  {id:'resources', icon:'globe', route:null, title:L('Ресми ресурстар','Официальные ресурсы','Official resources')},
  {id:'contacts',  icon:'phone', route:null, title:L('Байланыс және қабылдау','Контакты и приём','Contacts and reception')}
];

const NEWS = [
  {date:'20.09.2026', title:L('Астанада жаңа мешіттің іргетасы қаланды','В Астане заложен фундамент новой мечети','Foundation laid for a new mosque in Astana')},
  {date:'18.09.2026', title:L('Қари дайындау орталықтарында жаңа оқу маусымы басталды','В центрах подготовки қари начался новый учебный сезон','New academic season begins at qari training centers')},
  {date:'15.09.2026', title:L('ҚМДБ жаңа мобильді қосымшасы іске қосылды','Запущено новое мобильное приложение ДУМК','New SAMK mobile app launched')}
];

const EVENTS = [
  {time:'14:30', title:L('Мәжіліс','Заседание','Meeting'), place:L('Мәжіліс залы','Зал заседаний','Meeting hall')},
  {time:'16:00', title:L('Кездесу','Встреча','Appointment'), place:L('Акт залы','Актовый зал','Assembly hall')},
  {time:'17:30', title:L('Қабылдау','Приём граждан','Reception'), place:L('1-қабат, 105 кабинет','1 этаж, кабинет 105','Floor 1, office 105')}
];

const PRAYER_NAMES = {
  fajr:L('Таң','Фаджр','Fajr'), sunrise:L('Күн','Восход','Sunrise'), dhuhr:L('Бесін','Зухр','Dhuhr'),
  asr:L('Екінті','Аср','Asr'), maghrib:L('Ақшам','Магриб','Maghrib'), isha:L('Құптан','Иша','Isha')
};
const PRAYER_ORDER = ['fajr','sunrise','dhuhr','asr','maghrib','isha'];

/* Демо деректер. Нақты API қосылғанда тек PrayerService.get ауыстырылады. */
const PrayerService = {
  city: L('Астана','Астана','Astana'),
  async get(/* cityId, dateISO */){
    return {fajr:'04:37', sunrise:'06:12', dhuhr:'12:08', asr:'16:10', maghrib:'18:01', isha:'19:31'};
  }
};

const I18N = {
  months:{
    kk:['қаңтар','ақпан','наурыз','сәуір','мамыр','маусым','шілде','тамыз','қыркүйек','қазан','қараша','желтоқсан'],
    en:['January','February','March','April','May','June','July','August','September','October','November','December'],
    ru:['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']
  },
  hijri:{
    kk:['Мұхаррам','Сафар','Рабиғул-әууәл','Рабиғул-ахир','Жумада-л-уля','Жумада-с-сания','Ражаб','Шағбан','Рамазан','Шәууәл','Зұл-қағда','Зұл-хижжа'],
    ru:['Мухаррам','Сафар','Раби-уль-авваль','Раби-уль-ахир','Джумада-уль-уля','Джумада-уль-ахира','Раджаб','Шаабан','Рамадан','Шавваль','Зуль-каада','Зуль-хиджа'],
    en:['Muharram','Safar','Rabi al-Awwal','Rabi al-Thani','Jumada al-Ula','Jumada al-Thani','Rajab','Shaban','Ramadan','Shawwal','Dhu al-Qadah','Dhu al-Hijjah'],
    suffix:{kk:'х.',ru:'г. х.',en:'AH'}
  },
  t:{
    orgName:L('ҚАЗАҚСТАН МҰСЫЛМАНДАРЫ ДІНИ БАСҚАРМАСЫ','ДУХОВНОЕ УПРАВЛЕНИЕ МУСУЛЬМАН КАЗАХСТАНА','SPIRITUAL ADMINISTRATION OF MUSLIMS OF KAZAKHSTAN'),
    orgShort:L('Қазақстан мұсылмандары діни басқармасы','Духовное управление мусульман Казахстана','Spiritual Administration of Muslims of Kazakhstan'),
    terminal:L('Цифрлық ақпараттық терминал','Цифровой информационный терминал','Digital information terminal'),
    search:L('Іздеу','Поиск','Search'),
    welcome:L('ҚОШ КЕЛДІҢІЗ!','ДОБРО ПОЖАЛОВАТЬ!','WELCOME!'),
    choose:L('Қажетті ақпаратты немесе қызметті таңдаңыз','Выберите нужную информацию или услугу','Choose the information or service you need'),
    searchPh:L('Бөлімді, қызметкерді, мешітті немесе қызметті іздеңіз...','Найдите отдел, сотрудника, мечеть или услугу...','Search a department, employee, mosque or service...'),
    find:L('Табу','Найти','Find'),
    nextPrayer:L('Келесі намаз','Следующий намаз','Next prayer'),
    left:L('қалды','осталось','left'),
    pickSection:L('Қажетті бөлімді таңдаңыз','Выберите нужный раздел','Choose a section'),
    quick:L('Жылдам әрекеттер','Быстрые действия','Quick actions'),
    news:L('Соңғы жаңалықтар','Последние новости','Latest news'),
    today:L('Бүгін ҚМДБ-да','Сегодня в ДУМК','Today at SAMK'),
    soon:L('Бұл бөлім жақын арада ашылады','Этот раздел скоро откроется','This section will open soon'),
    searchSoon:L('Іздеу жақын арада қосылады','Поиск скоро будет доступен','Search will be available soon'),
    visual:L('ҚМДБ ғимараты','Здание ДУМК','SAMK building'),
    visualSub:L('Астана, Қазақстан','Астана, Казахстан','Astana, Kazakhstan'),
    official:L('Ресми ақпарат','Официальная информация','Official information'),
    rights:L('© Қазақстан мұсылмандары діни басқармасы','© Духовное управление мусульман Казахстана','© Spiritual Administration of Muslims of Kazakhstan'),
    open:L('Ашу','Открыть','Open'),
    greet:{kk:'Қош келдіңіз!',ru:'Добро пожаловать!',en:'Welcome!'},
    live:L('Тікелей','В эфире','Live'),
    mosques:L('мешіт','мечетей','mosques'),
    schools:L('оқу орны','учебных заведений','schools'),
    qari:L('қари орталығы','центров қари','qari centers'),
    ph:[L('Мешітті іздеңіз...','Найдите мечеть...','Search a mosque...'),L('Бөлімді табыңыз...','Найдите отдел...','Find a department...'),L('Қызметкерді іздеңіз...','Найдите сотрудника...','Look up an employee...'),L('Кабинетті табыңыз...','Найдите кабинет...','Find an office...')],
    openMap:L('Картаны ашу','Открыть карту','Open the map')
  }
};

/* Idle режим конфигурациясы (әзірге өшірулі). Кейін экрандар кезектесіп көрсетіледі. */
const STATS = [{n:2977,label:'mosques'},{n:14,label:'schools'},{n:18,label:'qari'}];

const IDLE_CONFIG = {
  enabled:false,
  timeoutMs:120000,
  screens:['welcome','munara','news','digital-projects','prayer-times'],
  slideMs:12000
};

window.KIOSK_DATA = {ICONS, MENU, QUICK_ACTIONS, SECONDARY, NEWS, EVENTS, STATS, PRAYER_NAMES, PRAYER_ORDER, PrayerService, I18N, IDLE_CONFIG};
})();
