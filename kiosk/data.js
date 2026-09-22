/* ҚМДБ терминалы — деректер мен конфигурация.
   Мәзір, жаңалық және намаз уақыты осында ғана басқарылады.
   Кейін бұл файлдың орнына API / Admin Panel жауабын қосуға болады. */
(function(){
const L = (kk, ru, en) => ({kk, ru, en});

const ICONS = {
  map:'<path d="M4 21V11l8-6 8 6v10"/><path d="M12 5V2"/><path d="M9 21v-5a3 3 0 0 1 6 0v5"/>',
  structure:'<rect class="sn a" x="9" y="3" width="6" height="5" rx="1"/><rect class="sn b" x="2" y="16" width="6" height="5" rx="1"/><rect class="sn c" x="16" y="16" width="6" height="5" rx="1"/><path class="sl" d="M12 8v4M5 16v-4h14v4"/>',
  leadership:'<circle class="lp" cx="12" cy="8.5" r="4"/><path class="lp" d="M4.5 21c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7"/>',
  departments:'<rect class="dq q1" x="3" y="3" width="8" height="8" rx="1.6"/><rect class="dq q2" x="13" y="3" width="8" height="8" rx="1.6"/><rect class="dq q3" x="3" y="13" width="8" height="8" rx="1.6"/><rect class="dq q4" x="13" y="13" width="8" height="8" rx="1.6"/>',
  services:'<g class="gear"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="6.6"/><path d="M12 2.4v3M12 18.6v3M2.4 12h3M18.6 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M5.2 18.8l2.1-2.1M16.7 7.3l2.1-2.1"/></g>',
  regions:'<ellipse class="rip" cx="12" cy="21.4" rx="6" ry="1.5"/><g class="pin"><path d="M12 19s6-5.2 6-9.8A6 6 0 0 0 6 9.2c0 4.6 6 9.8 6 9.8z"/><circle cx="12" cy="9.2" r="2.2"/></g>',
  products:'<g class="ph"><rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 19h2"/><path class="scr" d="M10 7h4M10 10h4M10 13h2.5"/></g><circle class="bd" cx="18" cy="4" r="2.4" fill="currentColor" stroke="none"/>',
  tv:'<rect x="3" y="3" width="18" height="18" rx="2.5"/><circle cx="12" cy="12" r="3.5"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="16.6" cy="7.4" r="1" fill="currentColor" stroke="none"/>',
  tour:'<g class="vr"><path d="M4.5 8h15A2.5 2.5 0 0 1 22 10.5v4a2.5 2.5 0 0 1-2.5 2.5h-3.3c-1 0-1.6-.7-2.2-1.5-.4-.6-1.1-1-2-1s-1.6.4-2 1c-.6.8-1.2 1.5-2.2 1.5H4.5A2.5 2.5 0 0 1 2 14.5v-4A2.5 2.5 0 0 1 4.5 8z"/><circle class="pl" cx="7.5" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle class="pl" cx="16.5" cy="12" r="1.5" fill="currentColor" stroke="none"/></g>',
  pin:'<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>'
};

/* route — басылғанда өтетін бет (null = ішкі бет әлі жасалмаған). Мәзір реті = торға орналасу реті. */
const MENU = [
  {id:'map', icon:'map', route:'./map.html', title:L('Интерактивті карта','Интерактивная карта','Interactive map'),
       sub:L('Қазақстан мешіттері мен діни оқу орындары','Мечети и религиозные учебные заведения Казахстана','Mosques and religious educational institutions of Kazakhstan')},
  {id:'structure',   icon:'structure',   route:null, title:L('ҚМДБ құрылымы','Структура ДУМК','SAMK structure'),
       sub:L('Басқарма мен бөлімдердің иерархиясы','Иерархия управления и отделов','Hierarchy of management and departments')},
  {id:'leadership',  icon:'leadership',  route:'./leadership.html', title:L('Басшылық құрам','Руководящий состав','Leadership team'),
       sub:L('Басқарма мүшелерінің тізімі мен байланысы','Список и контакты членов управления','List and contacts of the board members')},
  {id:'departments', icon:'departments', route:'./departments.html', title:L('Бөлімдер','Отделы','Departments'),
       sub:L('Құрылымдық бөлімдер мен секторлар тізімі','Список структурных отделов и секторов','List of structural departments and sectors')},
  {id:'services',    icon:'services',    route:'./services.html', title:L('Қызметтер','Услуги','Services'),
       sub:L('ҚМДБ-ға қарасты қорлар мен мекемелер қызметі','Деятельность фондов и учреждений при ДУМК','Activities of funds and institutions under SAMK')},
  {id:'regions',     icon:'regions',     route:'./regions.html', title:L('Өкілдіктер','Представительства','Offices'),
       sub:L('Облыстық өкілдіктер мен байланыстар','Областные представительства и контакты','Regional offices and contacts')},
  {id:'products',    icon:'products',    route:null, embed:'https://digital.muftyat.kz', title:L('Цифрлық өнімдер','Цифровые продукты','Digital products'),
       sub:L('Мобильді қосымшалар мен онлайн қызметтер','Мобильные приложения и онлайн-сервисы','Mobile apps and online services')},
  {id:'munara',      icon:'tv',          route:null, gallery:true, title:L('Фотокөрме','Фотогалерея','Photo exhibition'),
       sub:L('ҚМДБ-ның 35 жылдығына арналған «Дін мен Дәуір» фотокөрмесі','Фотовыставка «Дін мен Дәуір», посвящённая 35-летию ДУМК','"Din men Dauir" photo exhibition dedicated to SAMK\'s 35th anniversary')},
  {id:'tour',        icon:'tour',        route:null, embed:'https://3d.muftyat.kz/', title:L('360° виртуалды тур','360° виртуальный тур','360° virtual tour'),
       sub:L('ҚМДБ орталық аппаратына виртуалды саяхат жасаңыз','Виртуальное путешествие по центральному аппарату ДУМК','Take a virtual tour of SAMK\'s central office')}
];

const STATS = [{n:2977,label:'mosques'},{n:9,label:'schools'},{n:18,label:'qari'}];

/* «Дін мен Дәуір» фотокөрмесі (ҚМДБ-ның 35 жылдығына арналған) — слайдер суреттері */
const GALLERY = [
  {photo:'./assets/qmdb-building.jpeg', caption:L('ҚМДБ орталық ғимараты','Центральное здание ДУМК','SAMK central building')},
  {photo:null, caption:L('Мешіт салу рәсімі','Церемония закладки мечети','Mosque foundation ceremony')},
  {photo:null, caption:L('Қари дайындау орталығы','Центр подготовки қари','Qari training center')},
  {photo:null, caption:L('Жастар кездесуі','Встреча с молодёжью','Youth gathering')},
  {photo:null, caption:L('Қажылық сапары','Паломничество (хадж)','Hajj pilgrimage')},
  {photo:null, caption:L('ҚМДБ-ның 35 жылдығы','35-летие ДУМК','SAMK\'s 35th anniversary')}
];

const RECEPTION = {
  photo:'./assets/mufti.jpg',
  role:L('ҚМДБ төрағасы, Бас мүфти','Председатель ДУМК, Верховный муфтий','SAMK Chairman, Grand Mufti'),
  name:L('Наурызбай қажы Тағанұлы','Наурызбай хаджи Таганулы','Nauryzbay Hajji Taganuly')
};

const NEWS = [
  {date:'20.09.2026', photo:'./assets/qmdb-building.jpeg',
   title:L('Астанада жаңа мешіттің іргетасы қаланды','В Астане заложен фундамент новой мечети','Foundation laid for a new mosque in Astana'),
   body:L('Астана қаласында жаңа мешіттің құрылысы басталды: іргетас қалау рәсіміне ҚМДБ өкілдері мен қала тұрғындары қатысты. Жаңа мешіт бірнеше мың адамды сыйдыратын етіп жобаланған, құрылыс жұмыстары кезең-кезеңімен жүргізіледі.',
     'В Астане началось строительство новой мечети: в церемонии закладки фундамента приняли участие представители ДУМК и жители города. Новая мечеть рассчитана на несколько тысяч человек, строительные работы будут вестись поэтапно.',
     'Construction of a new mosque has begun in Astana: SAMK representatives and city residents took part in the foundation-laying ceremony. The new mosque is designed to accommodate several thousand worshippers, with construction proceeding in stages.')},
  {date:'18.09.2026', photo:'./assets/qmdb-building.jpeg',
   title:L('Қари дайындау орталықтарында жаңа оқу маусымы басталды','В центрах подготовки қари начался новый учебный сезон','New academic season begins at qari training centers'),
   body:L('Еліміздің қари дайындау орталықтарында жаңа оқу маусымы ашылды. Оқушылар Құранды жатқа білу және таджуид ілімін меңгеру бағдарламасы бойынша сабақ бастады, оқу барысы білікті ұстаздардың басшылығымен жүргізіледі.',
     'В центрах подготовки қари страны открылся новый учебный сезон. Учащиеся приступили к занятиям по программе заучивания Корана наизусть и изучения таджвида под руководством квалифицированных преподавателей.',
     'A new academic season has opened at the country\'s qari training centers. Students have begun classes in Quran memorization and tajwid under the guidance of qualified instructors.')},
  {date:'16.09.2026', photo:'./assets/qmdb-building.jpeg',
   title:L('Мешіттерде жастарға арналған дәрістер циклі өтеді','В мечетях пройдёт цикл лекций для молодёжи','A lecture series for young people will be held in mosques'),
   body:L('Еліміздің мешіттерінде жастарға арналған дәрістер циклі басталады. Кездесулерде дін негіздері, адамгершілік құндылықтар және қоғамдағы өзекті мәселелер талқыланады, дәрістерді білікті имамдар мен теолог-мамандар жүргізеді.',
     'В мечетях страны стартует цикл лекций для молодёжи. На встречах будут обсуждаться основы религии, нравственные ценности и актуальные вопросы общества, лекции проведут квалифицированные имамы и специалисты-теологи.',
     'A lecture series for young people is starting in mosques across the country. The sessions will cover the fundamentals of religion, moral values and topical social issues, led by qualified imams and theology specialists.')},
  {date:'15.09.2026', photo:'./assets/qmdb-building.jpeg',
   title:L('ҚМДБ жаңа мобильді қосымшасы іске қосылды','Запущено новое мобильное приложение ДУМК','New SAMK mobile app launched'),
   body:L('ҚМДБ намаз уақыттарын, жақын маңдағы мешіттерді және діни ақпаратты бір қосымшада біріктірген жаңа мобильді қосымшасын іске қосты. Қосымша қазақ, орыс және ағылшын тілдерінде қолжетімді, оны App Store және Google Play дүкендерінен тегін жүктеп алуға болады.',
     'ДУМК запустило новое мобильное приложение, объединяющее время намаза, ближайшие мечети и религиозную информацию в одном сервисе. Приложение доступно на казахском, русском и английском языках, скачать его можно бесплатно в App Store и Google Play.',
     'SAMK has launched a new mobile app that brings together prayer times, nearby mosques and religious information in one place. The app is available in Kazakh, Russian and English and can be downloaded free from the App Store and Google Play.')}
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
    ru:['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],
    en:['January','February','March','April','May','June','July','August','September','October','November','December']
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
    greet:L('Қош келдіңіз!','Добро пожаловать!','Welcome!'),
    nextPrayer:L('Келесі намаз','Следующий намаз','Next prayer'),
    news:L('Соңғы жаңалықтар','Последние новости','Latest news'),
    openMap:L('Картаны ашу','Открыть карту','Open the map'),
    themeLight:L('Жарық режим','Светлая тема','Light mode'),
    themeDark:L('Түнгі режим','Тёмная тема','Dark mode'),
    mosques:L('мешіт','мечетей','mosques'),
    schools:L('медресе','медресе','madrasahs'),
    qari:L('қарилар орталығы','центры қари','qari centers')
  }
};

/* Idle режим (болашақ): әрекетсіздіктен кейін welcome / Munara TV / жаңалық / намаз экрандары кезектеседі. Әзірге өшірулі. */
const IDLE_CONFIG = {enabled:false, timeoutMs:120000, screens:['welcome','munara','news','digital-projects','prayer-times'], slideMs:12000};

window.KIOSK_DATA = {ICONS, MENU, STATS, RECEPTION, NEWS, GALLERY, PRAYER_NAMES, PRAYER_ORDER, PrayerService, I18N, IDLE_CONFIG};
})();
