/* ҚМДБ терминалы — Құран тыңдау плеері.
   «Қош келдіңіз!» баннерінің сол жақ жоғарғы бұрышында (ол жоқ беттерде — экранның сол жақ жоғарғы бұрышында) қалқып тұрады,
   әдетте мөлдір (transparent), үстіне курсор апарғанда немесе ойнап тұрғанда жанады (толық көрінеді).
   Бет ауысқанда ойнату localStorage арқылы жалғасады (уақыты сақталып, жаңа бетте қайта жалғайды). */
(function(){
  const SRC = './assets/audio/fatiha.mp3';
  const LS_PLAYING = 'qp-playing';
  const LS_TIME = 'qp-time';

  function injectFloating(){
    if (document.getElementById('quranPlayer')) return;
    const banner = document.querySelector('.k-visual');
    const host = banner || document.getElementById('screen') || document.body;
    if (!host) return;

    const style = document.createElement('style');
    style.textContent = `
      #screen>.qp-float{position:absolute!important}
      .qp-float{position:absolute;right:16px;top:16px;z-index:5;transform:translateY(0);
        display:flex;align-items:center;gap:13px;padding:10px 20px 10px 10px;border-radius:999px;
        background:#fff;box-shadow:0 22px 60px rgba(9,42,30,.18),0 3px 8px rgba(9,42,30,.08);
        border:1px solid rgba(15,29,23,.08);font-family:"IBM Plex Sans",system-ui,sans-serif;
        opacity:.4;transition:opacity .35s cubic-bezier(.22,.8,.28,1),transform .35s cubic-bezier(.22,.8,.28,1),box-shadow .35s}
      html[data-theme=dark] .qp-float{background:#15211b;border-color:rgba(255,255,255,.09)}
      .qp-float:hover,.qp-float:focus-within,.qp-float.playing{opacity:1;transform:translateY(4px)}
      .qp-float:hover{box-shadow:0 26px 70px rgba(9,42,30,.26),0 4px 10px rgba(9,42,30,.1)}
      .qp-float .qp-btn{position:relative;flex:none;width:52px;height:52px;border-radius:50%;
        display:grid;place-items:center;border:0;cursor:pointer;color:#fff;
        background:linear-gradient(140deg,#2f7a5c,#0e4b36 65%,#083425);
        box-shadow:0 10px 22px rgba(14,75,54,.32);transition:transform .2s cubic-bezier(.22,.8,.28,1)}
      .qp-float .qp-btn:active{transform:scale(.92)}
      .qp-float .qp-btn svg{width:20px;height:20px;position:relative;z-index:2}
      .qp-float .qp-tx{display:flex;flex-direction:column;gap:2px}
      .qp-float .qp-lab{font-size:13.5px;font-weight:600;color:#0f1d17}
      html[data-theme=dark] .qp-float .qp-lab{color:#e8f0eb}
      .qp-float .qp-sub{font-size:11.5px;color:#66756e}
      .qp-float .qp-wave{position:absolute;inset:-6px;border-radius:50%;pointer-events:none}
      .qp-float .qp-wave i{position:absolute;inset:0;border-radius:50%;border:2px solid rgba(47,122,92,.55);opacity:0}
      .qp-float.playing .qp-wave i{animation:qpWaveF 2.2s ease-out infinite}
      .qp-float .qp-wave i:nth-child(2){animation-delay:.7s!important}
      .qp-float .qp-wave i:nth-child(3){animation-delay:1.4s!important}
      @keyframes qpWaveF{0%{transform:scale(.8);opacity:.75}100%{transform:scale(2.1);opacity:0}}
    `;
    document.head.appendChild(style);

    const el = document.createElement('div');
    el.className = 'qp-float';
    el.id = 'quranPlayer';
    el.tabIndex = 0;
    el.innerHTML = `
      <button class="qp-btn" id="qpBtn" aria-label="Ойнату / Тоқтату">
        <span class="qp-wave" aria-hidden="true"><i></i><i></i><i></i></span>
        <svg class="qp-ic-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        <svg class="qp-ic-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
      </button>
      <div class="qp-tx">
        <span class="qp-lab">Құран тыңдау</span>
        <span class="qp-sub" id="qpSub">Әл-Фатиха сүресі</span>
      </div>`;
    host.appendChild(el);
  }

  injectFloating();

  const player = document.getElementById('quranPlayer');
  const btn = document.getElementById('qpBtn');
  if (!player || !btn) return;

  const sub = document.getElementById('qpSub');
  const idleText = sub ? sub.textContent : '';
  const audio = new Audio(SRC);
  audio.preload = 'none';

  function setUI(on){
    player.classList.toggle('playing', on);
    const p = btn.querySelector('.qp-ic-play'), ps = btn.querySelector('.qp-ic-pause');
    if (p) p.style.display = on ? 'none' : '';
    if (ps) ps.style.display = on ? '' : 'none';
    if (sub) sub.textContent = on ? 'Ойнатылуда…' : idleText;
  }

  btn.addEventListener('click', () => {
    if (!audio.paused){ audio.pause(); }
    else { audio.play().catch(() => setUI(false)); }
  });
  audio.addEventListener('play', () => { setUI(true); try{ localStorage.setItem(LS_PLAYING, '1'); }catch(e){} });
  audio.addEventListener('pause', () => { setUI(false); try{ localStorage.setItem(LS_PLAYING, '0'); }catch(e){} });
  audio.addEventListener('ended', () => {
    try{ localStorage.setItem(LS_PLAYING, '0'); localStorage.removeItem(LS_TIME); }catch(e){}
  });

  /* Ойнап тұрған уақытты сақтап отыру — жаңа бетте дәл сол жерден жалғасады */
  setInterval(() => {
    if (!audio.paused){ try{ localStorage.setItem(LS_TIME, String(audio.currentTime)); }catch(e){} }
  }, 1000);
  addEventListener('beforeunload', () => {
    if (!audio.paused){ try{ localStorage.setItem(LS_TIME, String(audio.currentTime)); }catch(e){} }
  });

  /* Алдыңғы беттен ойнап тұрған күйінде келсе — осы бетте автоматты жалғайды */
  try {
    if (localStorage.getItem(LS_PLAYING) === '1'){
      const t = parseFloat(localStorage.getItem(LS_TIME) || '0');
      if (isFinite(t) && t > 0) audio.currentTime = t;
      audio.play().catch(() => setUI(false));
    }
  } catch(e){}
})();
