/* Карта беті: kk / ru / en аудармасы.
   Деректер (OBJECTS, REGION_STATS т.б.) қазақша кілтпен сақталады, экранға шығарда MI.* арқылы аударылады. */
(function(){
  const KEY = 'kiosk-lang';
  const LANGS = ['kk', 'ru', 'en'];
  const store = {
    get(){ try{ return localStorage.getItem(KEY); }catch(e){ return null; } },
    set(v){ try{ localStorage.setItem(KEY, v); }catch(e){} }
  };
  let lang = LANGS.includes(store.get()) ? store.get() : 'kk';

  // ── Интерфейс мәтіндері ──
  const UI = {
    home:      {kk:'Басты бет', ru:'Главная', en:'Home'},
    close:     {kk:'Жабу', ru:'Закрыть', en:'Close'},
    kicker:    {kk:'Қазақстан мұсылмандары діни басқармасы', ru:'Духовное управление мусульман Казахстана', en:'Spiritual Administration of Muslims of Kazakhstan'},
    title:     {kk:'Қазақстан мешіттері мен діни оқу орындары', ru:'Мечети и религиозные учебные заведения Казахстана', en:'Mosques and Religious Educational Institutions of Kazakhstan'},
    stMosque:  {kk:'Мешіт', ru:'Мечетей', en:'Mosques'},
    stUniv:    {kk:'Университет', ru:'Вуз', en:'University'},
    stInst:    {kk:'Институт', ru:'Института', en:'Institutes'},
    stMed:     {kk:'Медресе-колледж', ru:'Медресе', en:'Madrasas'},
    stQari:    {kk:'Қарилар дайындау орталығы', ru:'Центров қари', en:'Qari centers'},
    search:    {kk:'Мешіт, медресе немесе қала атауын іздеңіз…', ru:'Поиск по названию мечети, медресе или города…', en:'Search by mosque, madrasa or city name…'},
    region:    {kk:'Өңір', ru:'Регион', en:'Region'},
    allRegions:{kk:'Барлық өңір', ru:'Все регионы', en:'All regions'},
    objType:   {kk:'Нысан түрі', ru:'Тип объекта', en:'Facility type'},
    all:       {kk:'Барлығы', ru:'Все', en:'All'},
    find:      {kk:'Іздеу', ru:'Найти', en:'Search'},
    mapSub:    {kk:'Нысандарды көру үшін маркерді таңдаңыз', ru:'Выберите маркер, чтобы увидеть объекты', en:'Select a marker to view facilities'},
    mapAria:   {kk:'Қазақстан картасы', ru:'Карта Казахстана', en:'Map of Kazakhstan'},
    catMosque: {kk:'Мешіттер', ru:'Мечети', en:'Mosques'},
    catEdu:    {kk:'Медресе-колледждер', ru:'Медресе-колледжи', en:'Madrasa colleges'},
    catQari:   {kk:'Қарилар дайындау орталықтары', ru:'Центры подготовки қари', en:'Qari training centers'},
    catQariS:  {kk:'Қарилар дайындау орт.', ru:'Центры подгот. қари', en:'Qari centers'},
    lgSingle:  {kk:'Жеке нысан', ru:'Отдельный объект', en:'Single facility'},
    lgGroup:   {kk:'Нысандар тобы', ru:'Группа объектов', en:'Group of facilities'},
    lgHeritage:{kk:'Тарихи мұра', ru:'Историческое наследие', en:'Historical heritage'},
    scale:     {kk:'250 км', ru:'250 км', en:'250 km'},
    listTitle: {kk:'Нысандар тізімі', ru:'Список объектов', en:'List of facilities'},
    chipAll:   {kk:'Барлығы', ru:'Все', en:'All'},
    chipMosque:{kk:'Мешіттер', ru:'Мечети', en:'Mosques'},
    chipEdu:   {kk:'Медресе-колледждер', ru:'Медресе-колледжи', en:'Madrasa colleges'},
    chipQari:  {kk:'Қарилар дайындау орталықтары', ru:'Центры подготовки қари', en:'Qari training centers'},
    fullList:  {kk:'Толық тізім', ru:'Полный список', en:'Full list'},
    collapse:  {kk:'Қысу', ru:'Свернуть', en:'Collapse'},
    footMain:  {kk:'Қазақстан мұсылмандары діни басқармасы · Ақпараттық терминал', ru:'Духовное управление мусульман Казахстана · Информационный терминал', en:'Spiritual Administration of Muslims of Kazakhstan · Information terminal'},
    footSrc:   {kk:'Дерек көзі: ҚМДБ тізілімі · Жаңартылған: 10.09.2026', ru:'Источник данных: реестр ДУМК · Обновлено: 10.09.2026', en:'Data source: SAMK registry · Updated: 10.09.2026'},
    nounAll:   {kk:'нысан', ru:'объектов', en:'facilities'},
    nounMosque:{kk:'мешіт', ru:'мечетей', en:'mosques'},
    nounEdu:   {kk:'медресе-колледж', ru:'медресе-колледжей', en:'madrasa colleges'},
    nounQari:  {kk:'орталық', ru:'центров', en:'centers'},
    found:     {kk:'табылды', ru:'найдено', en:'found'},
    empty:     {kk:'Іздеу шарттарына сәйкес нысан табылмады', ru:'Объекты по заданным условиям не найдены', en:'No facilities match your search'},
    phone:     {kk:'Телефон', ru:'Телефон', en:'Phone'},
    email:     {kk:'Электрондық пошта', ru:'Электронная почта', en:'Email'},
    yearOpened:{kk:'Қолданысқа берілген жылы', ru:'Год ввода в эксплуатацию', en:'Year opened'},
    capacity:  {kk:'Сыйымдылығы', ru:'Вместимость', en:'Capacity'},
    institution:{kk:'Мекеме', ru:'Учреждение', en:'Institution'},
    univ:      {kk:'Университет', ru:'Университет', en:'University'},
    dept:      {kk:'Бөлім', ru:'Отделов', en:'Departments'},
    sector:    {kk:'Сектор', ru:'Секторов', en:'Sectors'},
    inst2:     {kk:'Мекеме', ru:'Учреждений', en:'Institutions'},
    qmdb:      {kk:'Қазақстан мұсылмандары діни басқармасы', ru:'Духовное управление мусульман Казахстана', en:'Spiritual Administration of Muslims of Kazakhstan'},
    qmdbShort: {kk:'ҚМДБ', ru:'ДУМК', en:'SAMK'},
    nurShort:  {kk:'Нұр-Мүбарак', ru:'Нур-Мубарак', en:'Nur-Mubarak'},
    registered:{kk:'нысан тіркелген', ru:'объектов зарегистрировано', en:'facilities registered'},
    cObl:      {kk:'Облыстық мешіттер', ru:'Областные мечети', en:'Regional mosques'},
    cCity:     {kk:'Қалалық мешіттер', ru:'Городские мечети', en:'City mosques'},
    cDist:     {kk:'Аудандық мешіттер', ru:'Районные мечети', en:'District mosques'},
    cRural:    {kk:'Ауылдық мешіттер', ru:'Сельские мечети', en:'Rural mosques'},
    cPrayer:   {kk:'Намазханалар', ru:'Молельные дома', en:'Prayer rooms'},
    fullListView:{kk:'Толық тізімді көру', ru:'Смотреть полный список', en:'View full list'},
    mosqueWord:{kk:'мешіт', ru:'мечетей', en:'mosques'},
    noMapData: {kk:'үшін карта деректері әзірге қосылмаған', ru:': данные для карты пока не добавлены', en:': map data has not been added yet'},
    loading:   {kk:'Жүктелуде…', ru:'Загрузка…', en:'Loading…'}
  };

  // ── Өңірлер ──
  const REGIONS = {
    'Астана қаласы':{ru:'г. Астана', en:'Astana city'},
    'Алматы қаласы':{ru:'г. Алматы', en:'Almaty city'},
    'Шымкент қаласы':{ru:'г. Шымкент', en:'Shymkent city'},
    'Алматы облысы':{ru:'Алматинская область', en:'Almaty Region'},
    'Ақмола облысы':{ru:'Акмолинская область', en:'Akmola Region'},
    'Ақтөбе облысы':{ru:'Актюбинская область', en:'Aktobe Region'},
    'Атырау облысы':{ru:'Атырауская область', en:'Atyrau Region'},
    'Абай облысы':{ru:'область Абай', en:'Abai Region'},
    'Батыс Қазақстан облысы':{ru:'Западно-Казахстанская область', en:'West Kazakhstan Region'},
    'Жамбыл облысы':{ru:'Жамбылская область', en:'Zhambyl Region'},
    'Ұлытау облысы':{ru:'область Улытау', en:'Ulytau Region'},
    'Қарағанды облысы':{ru:'Карагандинская область', en:'Karaganda Region'},
    'Қостанай облысы':{ru:'Костанайская область', en:'Kostanay Region'},
    'Қызылорда облысы':{ru:'Кызылординская область', en:'Kyzylorda Region'},
    'Маңғыстау облысы':{ru:'Мангистауская область', en:'Mangystau Region'},
    'Павлодар облысы':{ru:'Павлодарская область', en:'Pavlodar Region'},
    'Солтүстік Қазақстан облысы':{ru:'Северо-Казахстанская область', en:'North Kazakhstan Region'},
    'Жетісу облысы':{ru:'область Жетісу', en:'Zhetysu Region'},
    'Түркістан облысы':{ru:'Туркестанская область', en:'Turkistan Region'},
    'Шығыс Қазақстан облысы':{ru:'Восточно-Казахстанская область', en:'East Kazakhstan Region'}
  };
  // Картадағы қысқа белгілер (кластерлер)
  const SHORT = {
    'Астана':{ru:'Астана', en:'Astana'}, 'Алматы':{ru:'Алматы', en:'Almaty'}, 'Шымкент':{ru:'Шымкент', en:'Shymkent'},
    'Ақмола':{ru:'Акмола', en:'Akmola'}, 'Ақтөбе':{ru:'Актобе', en:'Aktobe'}, 'Алматы обл.':{ru:'Алматы обл.', en:'Almaty Reg.'},
    'Атырау':{ru:'Атырау', en:'Atyrau'}, 'Абай':{ru:'Абай', en:'Abai'}, 'Жамбыл':{ru:'Жамбыл', en:'Zhambyl'},
    'Жетісу':{ru:'Жетісу', en:'Zhetysu'}, 'БҚО':{ru:'ЗКО', en:'WKR'}, 'Қарағанды':{ru:'Караганда', en:'Karaganda'},
    'Қостанай':{ru:'Костанай', en:'Kostanay'}, 'Қызылорда':{ru:'Кызылорда', en:'Kyzylorda'}, 'Маңғыстау':{ru:'Мангистау', en:'Mangystau'},
    'Павлодар':{ru:'Павлодар', en:'Pavlodar'}, 'СҚО':{ru:'СКО', en:'NKR'}, 'Түркістан':{ru:'Туркестан', en:'Turkistan'},
    'Ұлытау':{ru:'Улытау', en:'Ulytau'}, 'ШҚО':{ru:'ВКО', en:'EKR'}
  };
  const TYPES = {
    'Облыстық мешіт':{ru:'Областная мечеть', en:'Regional mosque'},
    'Қалалық мешіт':{ru:'Городская мечеть', en:'City mosque'},
    'Аудандық мешіт':{ru:'Районная мечеть', en:'District mosque'},
    'Ауылдық мешіт':{ru:'Сельская мечеть', en:'Rural mosque'},
    'Медресе-колледж':{ru:'Медресе-колледж', en:'Madrasa college'},
    'Қарилар дайындау орталығы':{ru:'Центр подготовки қари', en:'Qari training center'}
  };

  // ── Қолмен аударылған мекемелер (медресе, қари орталықтары, университет) ──
  const NAMES = {
    '«Актобе» медресе колледжі':{ru:'Медресе-колледж «Актобе»', en:'Aktobe Madrasa College'},
    '«Әбу Ханифа» медресе колледжі':{ru:'Медресе-колледж «Абу Ханифа»', en:'Abu Hanifa Madrasa College'},
    '«Астана» медресе-колледжі':{ru:'Медресе-колледж «Астана»', en:'Astana Madrasa College'},
    '«Әбу Бәкір Сыддық» медресе колледжі':{ru:'Медресе-колледж «Абу Бакр Сиддик»', en:'Abu Bakr Siddiq Madrasa College'},
    '«Сарыағаш» медресе колледжі':{ru:'Медресе-колледж «Сарыагаш»', en:'Saryagash Madrasa College'},
    '«Һибатулла Тарази» медресе колледжі':{ru:'Медресе-колледж «Хибатулла Тарази»', en:'Hibatulla Tarazi Madrasa College'},
    '«Орал» медресе колледжі':{ru:'Медресе-колледж «Орал»', en:'Oral Madrasa College'},
    '«Үшқоңыр» медресе колледжі':{ru:'Медресе-колледж «Ушкоңыр»', en:'Ushkonyr Madrasa College'},
    '«Шымкент» медресе колледжі':{ru:'Медресе-колледж «Шымкент»', en:'Shymkent Madrasa College'},
    '«Қауам Ад-Дин Әл-Итқани Әл-Фараби Ат-Түркістани» Құран жаттау орталығы':{ru:'Центр заучивания Корана «Каваму ад-Дин аль-Иткани аль-Фараби ат-Туркестани»', en:'Qawam ad-Din al-Itqani al-Farabi at-Turkistani Quran Memorization Center'},
    '«Ықылас» Құран жаттау орталығы':{ru:'Центр заучивания Корана «Ықылас»', en:'Yqylas Quran Memorization Center'},
    '«Балаби Қари» Құран жаттау орталығы':{ru:'Центр заучивания Корана «Балаби Қари»', en:'Balabi Qari Quran Memorization Center'},
    '«Qusshy Ata» Құран жаттау орталығы':{ru:'Центр заучивания Корана «Қусшы Ата»', en:'Qusshy Ata Quran Memorization Center'},
    '«Атбасар» Құран жаттау орталығы':{ru:'Центр заучивания Корана «Атбасар»', en:'Atbasar Quran Memorization Center'},
    '«Әз-Тәуке хан» Құран жаттау орталығы':{ru:'Центр заучивания Корана «Аз-Тауке хан»', en:'Az-Tauke Khan Quran Memorization Center'},
    '«Арал» Құран жаттау орталығы':{ru:'Центр заучивания Корана «Арал»', en:'Aral Quran Memorization Center'},
    '«Қазалы» Құран жаттау орталығы':{ru:'Центр заучивания Корана «Казалы»', en:'Kazaly Quran Memorization Center'},
    '«Айқожа ишан» Құран жаттау орталығы':{ru:'Центр заучивания Корана «Айкожа ишан»', en:'Aikozha Ishan Quran Memorization Center'},
    '«Қордай» Құран жаттау орталығы':{ru:'Центр заучивания Корана «Кордай»', en:'Kordai Quran Memorization Center'},
    '«Көк-Төбе» Құран жаттау орталығы':{ru:'Центр заучивания Корана «Кок-Тобе»', en:'Kok-Tobe Quran Memorization Center'},
    '«Тілеулес» Құран жаттау орталығы':{ru:'Центр заучивания Корана «Тілеулес»', en:'Tileules Quran Memorization Center'},
    '«Сауран» Құран жаттау орталығы':{ru:'Центр заучивания Корана «Сауран»', en:'Sauran Quran Memorization Center'},
    '«Жетісай» Құран жаттау орталығы':{ru:'Центр заучивания Корана «Жетысай»', en:'Zhetysai Quran Memorization Center'},
    '«Жібек жолы» Құран жаттау орталығы':{ru:'Центр заучивания Корана «Жибек жолы»', en:'Zhibek Zholy Quran Memorization Center'},
    '«Сұлтан Бейбарыс» Құран жаттау орталығы':{ru:'Центр заучивания Корана «Султан Бейбарыс»', en:'Sultan Beibarys Quran Memorization Center'},
    '«Хусамуддин әс-Сығанақи» Қарилар дайындау ижаза орталығы':{ru:'Центр подготовки қари и выдачи иджазы «Хусамуддин ас-Сыганаки»', en:'Husamuddin as-Sighnaqi Qari Training and Ijazah Center'},
    'Нұр-Мүбарак Мысыр ислам мәдениеті университеті':{ru:'Египетский университет исламской культуры «Нур-Мубарак»', en:'Nur-Mubarak Egyptian University of Islamic Culture'},
    'Ректорат кеңсесі':{ru:'Приёмная ректората', en:'Rector\'s office'},
    'Қабылдау комиссиясы (WhatsApp)':{ru:'Приёмная комиссия (WhatsApp)', en:'Admissions office (WhatsApp)'},
    'Қабылдау комиссиясы (Қоңырау)':{ru:'Приёмная комиссия (звонок)', en:'Admissions office (phone)'}
  };

  // ── Транслитерация (қазақ/орыс кириллицасы → латын) ──
  const TL = {
    'а':'a','ә':'a','б':'b','в':'v','г':'g','ғ':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y','к':'k','қ':'q',
    'л':'l','м':'m','н':'n','ң':'n','о':'o','ө':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ұ':'u','ү':'u','ф':'f','х':'kh',
    'һ':'h','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','і':'i','ь':'','э':'e','ю':'yu','я':'ya'
  };
  const VOW = 'аеёиоуыэюяәөұүі';
  function translit(s){
    let out = '';
    const up = s.length > 1 && s === s.toUpperCase() && s !== s.toLowerCase();
    const rus = /(ский|ская|ское|ской|ный|ной|ний|ий|ый|ой)$/i.test(s);
    const low = s.toLowerCase();
    for (let i = 0; i < s.length; i++){
      const ch = s[i];
      const lo = ch.toLowerCase();
      let m = TL[lo];
      if (lo === 'й' && !rus && i > 0 && VOW.includes(low[i-1])) m = 'i';
      if (m === undefined){ out += ch; continue; }
      if (ch !== lo) out += up ? m.toUpperCase() : (m.charAt(0).toUpperCase() + m.slice(1));
      else out += m;
    }
    return out;
  }
  const KZ_RU = {'ә':'а','ғ':'г','қ':'к','ң':'н','ө':'о','ұ':'у','ү':'у','һ':'х','і':'и','Ә':'А','Ғ':'Г','Қ':'К','Ң':'Н','Ө':'О','Ұ':'У','Ү':'У','Һ':'Х','І':'И'};
  const ruKz = s => s.replace(/[әғқңөұүһіӘҒҚҢӨҰҮҺІ]/g, c => KZ_RU[c]);
  const cap = w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w;
  const isUpper = s => s === s.toUpperCase() && s !== s.toLowerCase();

  // ── Жалпы сөздер (атаулар мен мекенжайлар үшін) ──
  const W = { // kk-lowercase → {ru, en}
    'қажы':{ru:'хаджи', en:'Haji'}, 'хажы':{ru:'хаджи', en:'Haji'},
    'хазірет':{ru:'хазрет', en:'Hazrat'}, 'хазрет':{ru:'хазрет', en:'Hazrat'},
    'баба':{ru:'баба', en:'Baba'}, 'ата':{ru:'ата', en:'Ata'}, 'ана':{ru:'ана', en:'Ana'}, 'ишан':{ru:'ишан', en:'Ishan'},
    'әулие':{ru:'әулие', en:'Auliye'}, 'батыр':{ru:'батыр', en:'Batyr'}, 'би':{ru:'би', en:'Bi'}, 'жырау':{ru:'жырау', en:'Zhyrau'},
    'ахун':{ru:'ахун', en:'Akhun'}, 'молда':{ru:'молда', en:'Molda'}, 'имам':{ru:'имам', en:'Imam'},
    'атындағы':{ru:'имени', en:'named after'},
    'орталық':{ru:'центральная', en:'Central'},
    'мұсылмандар':{ru:'мусульмане', en:'Muslims'},
    'облысы':{ru:'область', en:'Region'}, 'ауданы':{ru:'район', en:'District'}, 'ауылы':{ru:'село', en:'Village'},
    'кенті':{ru:'посёлок', en:'Settlement'}, 'қаласы':{ru:'город', en:'City'}, 'округі':{ru:'округ', en:'District'},
    'ауылдық':{ru:'сельский', en:'Rural'}, 'село':{ru:'село', en:'village'}, 'район':{ru:'район', en:'District'},
    'сельский':{ru:'сельский', en:'Rural'}, 'округ':{ru:'округ', en:'District'}, 'поселок':{ru:'посёлок', en:'Settlement'},
    'улица':{ru:'улица', en:'Street'}, 'область':{ru:'область', en:'Region'},
    'нет':{ru:'нет', en:'no'}, 'данных':{ru:'данных', en:'data'},
    'бқо':{ru:'ЗКО', en:'WKR'}, 'шқо':{ru:'ВКО', en:'EKR'}, 'сқо':{ru:'СКО', en:'NKR'},
    '(намазхана)':{ru:'(молельный дом)', en:'(prayer room)'}, 'намазхана':{ru:'молельный дом', en:'prayer room'},
    'елді':{ru:'населённый', en:'settlement'}, 'мекені':{ru:'пункт', en:''}, 'мекен':{ru:'пункт', en:''},
    'селолық':{ru:'сельская', en:'Village'},
    'шет':{ru:'окраина', en:'outskirts'},
    'ауылының':{ru:'села', en:'village'}, 'кентінің':{ru:'посёлка', en:'settlement'}, 'қаласының':{ru:'города', en:'city'},
    'б/н':{ru:'б/н', en:'n/a'}
  };
  const PHRASES = [
    [/есептік тіркеуден шығарылған/gi, {ru:'снята с учёта', en:'removed from registration'}],
    [/тіркеуден шығару/gi, {ru:'снятие с учёта', en:'deregistration'}]
  ];
  const MOSQUE_RE = /^(меші[тт]і|мешiтi|meshiti|мешіт|мешiт)$/i;
  const MOSQUE_ADJ = {
    'ауылдық':{ru:'Сельская мечеть', en:'Rural Mosque'},
    'қалалық':{ru:'Городская мечеть', en:'City Mosque'},
    'аудандық':{ru:'Районная мечеть', en:'District Mosque'},
    'облыстық':{ru:'Областная мечеть', en:'Regional Mosque'},
    'орталық':{ru:'Центральная мечеть', en:'Central Mosque'},
    'селолық':{ru:'Сельская мечеть', en:'Village Mosque'},
    'ауыл':{ru:'Сельская мечеть', en:'Village Mosque'}
  };

  function wordTr(tok, L){
    const m = tok.match(/^([(«"“]*)(.*?)([)»"”,.;:]*)$/);
    const pre = m[1], core = m[2], post = m[3];
    if (!core) return tok;
    const hit = W[core.toLowerCase()];
    if (hit) return pre + (hit[L] ?? '') + post;
    if (L === 'ru') return tok;
    if (/^[0-9\/\-.№]+[а-яa-zәғқңөұүһі]?$/i.test(core)) return pre + translit(core) + post; // нөмірлер
    if (/[а-яәғқңөұүһіё]/i.test(core)) return pre + translit(core) + post;
    return tok;
  }
  function textTr(s, L){
    let out = s;
    PHRASES.forEach(([re, v]) => { out = out.replace(re, v[L]); });
    return out.split(/(\s+)/).map(t => /^\s+$/.test(t) ? t : wordTr(t, L)).join('').replace(/\s{2,}/g, ' ').trim();
  }

  // Мешіт атауы: «X ауылдық мешіті» → ru: «Сельская мечеть X», en: «X Rural Mosque»
  function trName(n, L){
    if (L === 'kk') return n;
    if (NAMES[n]) return NAMES[n][L];
    const toks = n.trim().split(/\s+/);
    const mi = toks.findIndex(t => MOSQUE_RE.test(t.replace(/[()«»",.]/g, '')));
    if (mi < 0) return textTr(n, L);
    let adjKey = null, cut = mi;
    const prev = (toks[mi-1] || '').toLowerCase();
    if (MOSQUE_ADJ[prev]){ adjKey = prev; cut = mi - 1; }
    const before = textTr(toks.slice(0, cut).join(' '), L);
    const after = textTr(toks.slice(mi + 1).join(' '), L);
    const rest = [before, after].filter(Boolean).join(' ');
    if (L === 'ru'){
      const head = adjKey ? MOSQUE_ADJ[adjKey].ru : 'Мечеть';
      return rest ? head + ' ' + rest : head;
    }
    const tail = adjKey ? MOSQUE_ADJ[adjKey].en : 'Mosque';
    return [before, tail, after].filter(Boolean).join(' ');
  }

  // ── Мекенжай ──
  const NUM = '([0-9][0-9a-zA-Zа-яәғқңөұүһі\\/\\-.]*(?:\\s?[а-яa-z])?|№\\s?\\S+)';
  function normCase(seg){
    return isUpper(seg) ? seg.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : seg;
  }
  const SEG = [
    // [regex, ru-шаблон, en-шаблон]  ($1 — атау)
    [/^(.+?)\s+(?:облысы|область|обл\.?)$/i, '$1', null, 'region'],
    [/^(.+?)\s+(?:ауылдық округі|сельский округ|ауыл округі|а\.?о\.?)$/i, 'сельский округ $1', '$1 Rural District'],
    [/^(.+?)\s+(?:ауданы|аудан|районы|район)$/i, 'район $1', '$1 District'],
    [/^(.+?)\s+(?:қаласы|қала|город|г\.)$/i, 'г. $1', '$1 city'],
    [/^(.+?)\s+(?:ауылы|ауыл|село|с\.)$/i, 'с. $1', '$1 village'],
    [/^(.+?)\s+(?:кенті|кенты|кент|поселок|посёлок|пос\.)$/i, 'пос. $1', '$1 settlement'],
    [/^(.+?)\s+(?:шағын ауданы|мөлтек ауданы|микрорайон|мкр\.?)$/i, 'мкр. $1', '$1 microdistrict'],
    [/^(.+?)\s+(?:елді мекені)$/i, 'населённый пункт $1', '$1 settlement'],
    [/^(?:көшесі|көше|улица|ул\.)\s+(.+)$/i, 'ул. $1', '$1 Street'],
    [/^(.+?)\s+(?:көшесі|көшесі|көше|көш\.)$/i, 'ул. $1', '$1 Street'],
    [/^(.+?)\s+(?:даңғылы|проспект)$/i, 'пр. $1', '$1 Avenue'],
    [/^(?:даңғылы|проспект)\s+(.+)$/i, 'пр. $1', '$1 Avenue'],
    [/^(?:ғимарат|здание)\s+(.+)$/i, 'здание $1', 'Building $1'],
    [/^(?:құрылыс|строение)\s+(.+)$/i, 'строение $1', 'Building $1'],
    [/^(?:үй|дом)\s+(.+)$/i, 'д. $1', 'House $1'],
    [/^(?:орам|квартал)\s+(.+)$/i, 'квартал $1', 'Block $1'],
    [/^(.+?)\s+(?:үй|ғимарат|құрылыс)$/i, 'д. $1', 'Building $1'],
    [/^(?:пошталық индексі|почтовый индекс|индекс)\s+(.+)$/i, 'почтовый индекс $1', 'postal code $1']
  ];
  function trSeg(seg, L){
    let s = seg.trim();
    if (!s || s === '-' || s === '—') return '';
    s = normCase(s);
    for (const [re, ru, en, kind] of SEG){
      const m = s.match(re);
      if (!m) continue;
      const g = m[1];
      if (kind === 'region'){
        const key = Object.keys(REGIONS).find(k => k.toLowerCase().replace(/\s+облысы$/, '') === g.toLowerCase());
        if (key) return REGIONS[key][L];
        return L === 'ru' ? 'область ' + g : textTr(g, L) + ' Region';
      }
      const inner = L === 'ru' ? g : textTr(g, L);
      return (L === 'ru' ? ru : en).replace('$1', inner);
    }
    return textTr(s, L);
  }
  function trAddr(c, L){
    if (L === 'kk' || !c) return c;
    return c.split(',').map(p => trSeg(p, L)).filter(Boolean).join(', ');
  }

  function trYear(d, L){
    if (L === 'kk') return d;
    return L === 'ru' ? d.replace(/ж\./, 'г.') : d.replace(/\s*ж\./, '');
  }
  function trCap(cp, L){
    if (L === 'kk' || !cp || cp === '—') return cp;
    const num = cp.replace(/\s*адам\s*$/, '');
    return L === 'ru' ? num + ' чел.' : num.replace(/\s/g, ',') + ' people';
  }

  const listeners = [];
  const MI = {
    get lang(){ return lang; },
    LANGS,
    ui(k, L){ const e = UI[k]; return e ? e[L || lang] : k; },
    region(r, L){ L = L || lang; return L === 'kk' ? r : (REGIONS[r] ? REGIONS[r][L] : r); },
    short(t, L){ L = L || lang; return L === 'kk' ? t : (SHORT[t] ? SHORT[t][L] : t); },
    type(t, L){ L = L || lang; return L === 'kk' ? t : (TYPES[t] ? TYPES[t][L] : t); },
    name(n, L){ L = L || lang; const r = trName(n, L); return L === 'ru' ? ruKz(r) : r; },
    addr(c, L){ L = L || lang; const r = trAddr(c, L); return L === 'ru' ? ruKz(r) : r; },
    year(d, L){ return trYear(d, L || lang); },
    cap(c, L){ return trCap(c, L || lang); },
    // іздеу үшін: нысанның барлық тілдегі атауы мен мекенжайы
    haystack(o){
      if (!o._hay) o._hay = {};
      if (!o._hay[lang]) o._hay[lang] = (MI.name(o.n) + ' ' + MI.addr(o.c)).toLowerCase();
      return o._hay[lang];
    },
    // data-i18n / data-i18n-ph / data-i18n-aria / data-i18n-title атрибуттарын қолдану
    apply(root){
      root = root || document;
      document.documentElement.lang = lang;
      root.querySelectorAll('[data-i18n]').forEach(el => {
        const t = MI.ui(el.dataset.i18n); el.textContent = t;
        if (el.hasAttribute('title')) el.title = t;
      });
      root.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = MI.ui(el.dataset.i18nPh); });
      root.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', MI.ui(el.dataset.i18nAria)); });
      root.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = MI.ui(el.dataset.i18nTitle); });
    },
    set(l){
      if (!LANGS.includes(l) || l === lang) return;
      lang = l; store.set(l);
      listeners.forEach(f => f(l));
    },
    onChange(f){ listeners.push(f); }
  };
  window.MI = MI;
})();
