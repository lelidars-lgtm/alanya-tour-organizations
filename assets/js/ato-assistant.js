(() => {
  'use strict';

  const API_URL = '/api/ato-assistant';
  const MANAGER_WA = '905387045999';
  const STORAGE_KEY = 'ato_assistant_history_v1';
  const SESSION_KEY = 'ato_assistant_session_v1';
  const MAX_HISTORY = 12;

  const I18N = {
    en:{
      ask:'ASK SOMETHING', title:'ASSISTANT', status:'AI ASSISTANT · MANAGER READY',
      intro:'Hello. I can help with tours, prices, children, transfers, schedules and booking.',
      placeholder:'Ask about tours, prices, children…', send:'Send', manager:'Talk to Manager',
      chips:['Find a tour','With children','Prices','Pickup & transfer','What do you recommend?'],
      thinking:'Looking into it…', unavailable:'The assistant is being connected. A manager can help you now.',
      retry:'Please try again.', close:'Close', reset:'New chat', managerLead:'Send this conversation to ATO Manager'
    },
    ru:{
      ask:'СПРОСИТЬ', title:'АССИСТЕНТ', status:'AI-ПОМОЩНИК · МЕНЕДЖЕР НА СВЯЗИ',
      intro:'Здравствуйте. Я помогу с турами, ценами, детьми, трансфером, расписанием и бронированием.',
      placeholder:'Спросите о турах, ценах, детях…', send:'Отправить', manager:'Связаться с менеджером',
      chips:['Подобрать тур','С детьми','Цены','Трансфер','Что посоветуете?'],
      thinking:'Уточняю…', unavailable:'Ассистент сейчас подключается. Менеджер может помочь вам прямо сейчас.',
      retry:'Попробуйте ещё раз.', close:'Закрыть', reset:'Новый чат', managerLead:'Передать этот диалог менеджеру ATO'
    },
    tr:{
      ask:'BİR ŞEY SORUN', title:'ASİSTAN', status:'AI ASİSTAN · YÖNETİCİ HAZIR',
      intro:'Merhaba. Turlar, fiyatlar, çocuklar, transfer, program ve rezervasyon konusunda yardımcı olabilirim.',
      placeholder:'Turlar, fiyatlar, çocuklar hakkında sorun…', send:'Gönder', manager:'Yöneticiye Bağlan',
      chips:['Tur bul','Çocuklarla','Fiyatlar','Transfer','Ne önerirsiniz?'],
      thinking:'Kontrol ediyorum…', unavailable:'Asistan bağlantısı hazırlanıyor. Yöneticimiz şimdi yardımcı olabilir.',
      retry:'Lütfen tekrar deneyin.', close:'Kapat', reset:'Yeni sohbet', managerLead:'Bu konuşmayı ATO yöneticisine gönder'
    },
    de:{
      ask:'ETWAS FRAGEN', title:'ASSISTENT', status:'AI-ASSISTENT · MANAGER BEREIT',
      intro:'Hallo. Ich helfe bei Touren, Preisen, Kindern, Transfer, Zeitplan und Buchung.',
      placeholder:'Fragen Sie nach Touren, Preisen, Kindern…', send:'Senden', manager:'Mit Manager sprechen',
      chips:['Tour finden','Mit Kindern','Preise','Transfer','Was empfehlen Sie?'],
      thinking:'Ich prüfe das…', unavailable:'Der Assistent wird gerade verbunden. Unser Manager kann jetzt helfen.',
      retry:'Bitte versuchen Sie es erneut.', close:'Schließen', reset:'Neuer Chat', managerLead:'Diesen Chat an den ATO Manager senden'
    },
    pl:{
      ask:'ZAPYTAJ', title:'ASYSTENT', status:'ASYSTENT AI · MENEDŻER GOTOWY',
      intro:'Dzień dobry. Pomogę w sprawie wycieczek, cen, dzieci, transferu, terminów i rezerwacji.',
      placeholder:'Zapytaj o wycieczki, ceny, dzieci…', send:'Wyślij', manager:'Połącz z menedżerem',
      chips:['Znajdź wycieczkę','Z dziećmi','Ceny','Transfer','Co polecacie?'],
      thinking:'Sprawdzam…', unavailable:'Asystent jest właśnie podłączany. Menedżer może pomóc od razu.',
      retry:'Spróbuj ponownie.', close:'Zamknij', reset:'Nowy czat', managerLead:'Wyślij tę rozmowę do menedżera ATO'
    }
  };

  const $ = (s, root=document) => root.querySelector(s);
  const esc = (s='') => String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  function lang(){
    const raw=(document.documentElement.lang || localStorage.getItem('siteLanguage') || localStorage.getItem('language') || 'en').toLowerCase();
    const l=raw.slice(0,2);
    return I18N[l] ? l : 'en';
  }
  function T(){ return I18N[lang()]; }

  function sessionId(){
    let id=sessionStorage.getItem(SESSION_KEY);
    if(!id){
      id=(crypto.randomUUID ? crypto.randomUUID() : `ato-${Date.now()}-${Math.random().toString(36).slice(2)}`);
      sessionStorage.setItem(SESSION_KEY,id);
    }
    return id;
  }

  function loadHistory(){
    try{
      const x=JSON.parse(sessionStorage.getItem(STORAGE_KEY)||'[]');
      return Array.isArray(x) ? x.slice(-MAX_HISTORY) : [];
    }catch(e){ return []; }
  }
  let history=loadHistory();
  let busy=false;
  let launchToneBound=false;
  let launchToneRaf=0;

  function save(){
    try{ sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-MAX_HISTORY))); }catch(e){}
  }

  function pageContext(){
    const meta=document.querySelector('meta[name="description"]')?.content || '';
    const scope=document.querySelector('main, article, .tour-page, .page-content, #main') || document.body;
    let txt=(scope?.innerText||'')
      .replace(/\s+/g,' ')
      .replace(/ATO ASSISTANT/gi,'')
      .trim();
    if(txt.length>6500) txt=txt.slice(0,6500);
    return {
      title: document.title || '',
      url: location.href,
      path: location.pathname,
      description: meta.slice(0,600),
      visible_text: txt
    };
  }

  function launchTone(){
    const launch=$('#atoAssistantLaunch');
    if(!launch) return;

    const r=launch.getBoundingClientRect();
    const x=Math.max(1,Math.min(window.innerWidth-2,r.left+r.width*.52));
    const y=Math.max(1,Math.min(window.innerHeight-2,r.top+r.height*.52));

    const stack=document.elementsFromPoint(x,y)
      .filter(el=>!el.closest?.('#atoAssistantRoot'));

    const under=stack[0] || document.body;
    let tone='default';

    if(under.closest?.('#atoLivingHero')) tone='hero';
    else if(under.closest?.('#main-categories')) tone='categories';
    else if(under.closest?.('.vip-service-premium,.vip-service-premium-link')) tone='vip';
    else if(under.closest?.('#about')) tone='about';
    else if(under.closest?.('#contacts')) tone='contact';
    else if(under.closest?.('.footer-strip')) tone='footer';

    launch.dataset.tone=tone;
  }

  function scheduleLaunchTone(){
    if(launchToneRaf) return;
    launchToneRaf=requestAnimationFrame(()=>{
      launchToneRaf=0;
      launchTone();
    });
  }

  function initLaunchTone(){
    launchTone();
    if(launchToneBound) return;
    launchToneBound=true;
    window.addEventListener('scroll',scheduleLaunchTone,{passive:true});
    window.addEventListener('resize',scheduleLaunchTone,{passive:true});
  }


  const ORB_HINT_KEY='ato_ai_orb_hint_v1';

  function injectOrbStyles(){
    if(document.getElementById('atoAssistantOrbStyles')) return;

    const style=document.createElement('style');
    style.id='atoAssistantOrbStyles';
    style.textContent=`
      :root{
        --ato-orb-blue-deep:#0b2948;
        --ato-orb-blue:#1f5f95;
        --ato-orb-blue-soft:#5d87ac;
        --ato-orb-gold:#d7a83e;
        --ato-orb-gold-bright:#e8b64f;
        --ato-orb-champagne:#f0cf89;
        --ato-orb-ivory:#fff9ef;
        --ato-orb-ease:cubic-bezier(.22,.61,.36,1);
      }

      /* The existing REAL launch button becomes the orb.
         No proxy element. No click forwarding. */
      html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch{
        position:fixed!important;
        right:24px!important;
        bottom:22px!important;
        width:52px!important;
        min-width:52px!important;
        max-width:52px!important;
        height:52px!important;
        min-height:52px!important;
        max-height:52px!important;
        margin:0!important;
        padding:0!important;
        display:flex!important;
        align-items:center!important;
        justify-content:flex-start!important;
        gap:10px!important;
        overflow:hidden!important;
        border-radius:999px!important;
        border:1px solid rgba(215,168,62,.28)!important;
        background:
          radial-gradient(circle at 25px 50%,rgba(49,112,164,.22),transparent 46%),
          linear-gradient(135deg,rgba(8,27,44,.58),rgba(12,52,84,.42))!important;
        -webkit-backdrop-filter:blur(13px) saturate(118%)!important;
        backdrop-filter:blur(13px) saturate(118%)!important;
        box-shadow:
          0 8px 24px rgba(2,9,17,.18),
          inset 0 1px 0 rgba(255,249,239,.05),
          0 0 16px rgba(31,95,149,.08)!important;
        color:var(--ato-orb-ivory)!important;
        cursor:pointer!important;
        z-index:900!important;
        opacity:1!important;
        visibility:visible!important;
        pointer-events:auto!important;
        transform:translateZ(0)!important;
        transition:
          width 280ms var(--ato-orb-ease),
          max-width 280ms var(--ato-orb-ease),
          min-width 280ms var(--ato-orb-ease),
          border-color 230ms ease,
          box-shadow 230ms ease,
          background 230ms ease,
          opacity 180ms ease,
          transform 180ms var(--ato-orb-ease)!important;
        -webkit-tap-highlight-color:transparent!important;
      }

      html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch[data-tone="hero"],
      html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch[data-tone="vip"],
      html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch[data-tone="footer"]{
        background:
          radial-gradient(circle at 25px 50%,rgba(56,126,180,.25),transparent 46%),
          linear-gradient(135deg,rgba(11,42,68,.62),rgba(16,71,112,.46))!important;
        border-color:rgba(232,182,79,.31)!important;
      }

      html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch[data-tone="categories"],
      html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch[data-tone="about"],
      html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch[data-tone="contact"]{
        background:
          radial-gradient(circle at 25px 50%,rgba(39,92,139,.23),transparent 46%),
          linear-gradient(135deg,rgba(7,26,44,.67),rgba(11,48,79,.56))!important;
      }

      @media (hover:hover) and (pointer:fine){
        html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch:hover,
        html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch:focus-visible,
        html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch.ato-ai-orb-hint{
          width:164px!important;
          min-width:164px!important;
          max-width:164px!important;
          border-color:rgba(232,182,79,.43)!important;
          box-shadow:
            0 10px 28px rgba(2,9,17,.20),
            inset 0 1px 0 rgba(255,249,239,.06),
            0 0 19px rgba(31,95,149,.11)!important;
        }
      }

      html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch.is-hidden{
        opacity:0!important;
        visibility:hidden!important;
        pointer-events:none!important;
        transform:scale(.96)!important;
      }

      .ato-ai-orb-shell{
        position:relative!important;
        width:52px!important;
        min-width:52px!important;
        height:52px!important;
        flex:0 0 52px!important;
        display:grid!important;
        place-items:center!important;
        pointer-events:none!important;
      }

      .ato-ai-orb-symbol{
        width:36px!important;
        height:36px!important;
        display:block!important;
        overflow:visible!important;
        pointer-events:none!important;
        filter:drop-shadow(0 0 5px rgba(232,182,79,.10))!important;
      }

      .ato-ai-orbit{
        fill:none!important;
        stroke-linecap:round!important;
        transform-box:view-box!important;
        transform-origin:32px 32px!important;
        vector-effect:non-scaling-stroke!important;
      }
      .ato-ai-orbit--a{
        stroke:rgba(240,207,137,.96)!important;
        stroke-width:1.10!important;
        animation:atoOrbA 13.2s linear infinite!important;
      }
      .ato-ai-orbit--b{
        stroke:rgba(75,140,193,.96)!important;
        stroke-width:1.05!important;
        animation:atoOrbB 10.8s linear infinite!important;
      }
      .ato-ai-orbit--c{
        stroke:rgba(232,182,79,.92)!important;
        stroke-width:.98!important;
        animation:atoOrbC 8.7s linear infinite!important;
      }
      .ato-ai-orbit--d{
        stroke:rgba(31,95,149,.98)!important;
        stroke-width:.92!important;
        animation:atoOrbD 12.0s linear infinite!important;
      }

      @keyframes atoOrbA{
        0%{transform:rotate(10deg) scaleY(.70)}
        50%{transform:rotate(190deg) scaleY(.50)}
        100%{transform:rotate(370deg) scaleY(.70)}
      }
      @keyframes atoOrbB{
        0%{transform:rotate(122deg) scaleY(.54)}
        50%{transform:rotate(-58deg) scaleY(.88)}
        100%{transform:rotate(-238deg) scaleY(.54)}
      }
      @keyframes atoOrbC{
        0%{transform:rotate(-38deg) scaleY(.82)}
        50%{transform:rotate(142deg) scaleY(.56)}
        100%{transform:rotate(322deg) scaleY(.82)}
      }
      @keyframes atoOrbD{
        0%{transform:rotate(82deg) scaleY(.44)}
        50%{transform:rotate(-98deg) scaleY(.76)}
        100%{transform:rotate(-278deg) scaleY(.44)}
      }

      .ato-ai-orb-particle{
        transform-box:view-box!important;
        transform-origin:32px 32px!important;
      }
      .ato-ai-orb-particle--1{animation:atoOrbCW 12.4s linear infinite!important}
      .ato-ai-orb-particle--2{animation:atoOrbCCW 9.7s linear infinite!important}
      .ato-ai-orb-particle--3{animation:atoOrbCW 8.0s linear infinite!important}
      .ato-ai-orb-particle--4{animation:atoOrbCCW 13.8s linear infinite!important}
      .ato-ai-orb-particle--5{animation:atoOrbCW 10.3s linear infinite!important}
      .ato-ai-orb-particle--6{animation:atoOrbCCW 11.5s linear infinite!important}
      @keyframes atoOrbCW{to{transform:rotate(360deg)}}
      @keyframes atoOrbCCW{to{transform:rotate(-360deg)}}

      .ato-ai-orb-core{
        transform-box:view-box!important;
        transform-origin:32px 32px!important;
        animation:atoOrbBreathe 5.3s ease-in-out infinite!important;
      }
      @keyframes atoOrbBreathe{
        0%,100%{opacity:.88;transform:scale(.986)}
        50%{opacity:.98;transform:scale(1.03)}
      }

      .ato-ai-orb-pass{
        fill:none!important;
        stroke:rgba(240,207,137,.72)!important;
        stroke-width:1.18!important;
        stroke-linecap:round!important;
        stroke-dasharray:2 54!important;
        opacity:0!important;
        animation:atoOrbPass 10.8s ease-in-out infinite!important;
      }
      @keyframes atoOrbPass{
        0%,74%,100%{opacity:0;stroke-dashoffset:0}
        79%{opacity:.32}
        89%{opacity:.05;stroke-dashoffset:-56}
        91%{opacity:0}
      }

      .ato-ai-orb-label{
        flex:0 0 auto!important;
        margin-left:-1px!important;
        padding-right:14px!important;
        color:rgba(255,249,239,.95)!important;
        font-family:"Cormorant Garamond",Georgia,"Times New Roman",serif!important;
        font-size:14px!important;
        font-weight:500!important;
        letter-spacing:.018em!important;
        line-height:1!important;
        white-space:nowrap!important;
        opacity:0!important;
        transform:translateX(-5px)!important;
        pointer-events:none!important;
        text-shadow:0 1px 8px rgba(0,0,0,.14)!important;
        transition:
          opacity 210ms ease,
          transform 270ms var(--ato-orb-ease)!important;
      }

      @media (hover:hover) and (pointer:fine){
        #atoAssistantLaunch.ato-ai-orb-launch:hover .ato-ai-orb-label,
        #atoAssistantLaunch.ato-ai-orb-launch:focus-visible .ato-ai-orb-label,
        #atoAssistantLaunch.ato-ai-orb-launch.ato-ai-orb-hint .ato-ai-orb-label{
          opacity:1!important;
          transform:translateX(0)!important;
        }
        #atoAssistantLaunch.ato-ai-orb-launch:hover .ato-ai-orb-symbol{
          filter:
            brightness(1.08)
            drop-shadow(0 0 6px rgba(232,182,79,.12))!important;
        }
      }

      #atoAssistantLaunch.ato-ai-orb-press .ato-ai-orb-shell{
        transform:scale(.96)!important;
      }

      #atoAssistantLaunch.ato-ai-orb-launch:focus-visible{
        outline:1px solid rgba(240,207,137,.56)!important;
        outline-offset:3px!important;
      }

      @media (max-width:980px){
        html body #atoAssistantRoot #atoAssistantLaunch.ato-ai-orb-launch{
          right:calc(14px + env(safe-area-inset-right,0px))!important;
          bottom:calc(14px + env(safe-area-inset-bottom,0px))!important;
          width:50px!important;
          min-width:50px!important;
          max-width:50px!important;
          height:50px!important;
          min-height:50px!important;
          max-height:50px!important;
        }
        .ato-ai-orb-shell{
          width:50px!important;
          min-width:50px!important;
          height:50px!important;
          flex-basis:50px!important;
        }
        .ato-ai-orb-symbol{
          width:34px!important;
          height:34px!important;
        }
        .ato-ai-orb-label{
          display:none!important;
        }
      }

      @media (prefers-reduced-motion:reduce){
        .ato-ai-orbit,
        .ato-ai-orb-particle,
        .ato-ai-orb-core,
        .ato-ai-orb-pass{
          animation:none!important;
        }
        #atoAssistantLaunch.ato-ai-orb-launch,
        .ato-ai-orb-label{
          transition-duration:120ms!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function orbMarkup(){
    return `
      <span class="ato-ai-orb-shell" aria-hidden="true">
        <svg class="ato-ai-orb-symbol" viewBox="0 0 64 64" focusable="false" aria-hidden="true">
          <defs>
            <radialGradient id="atoNativeOrbHalo" cx="50%" cy="50%" r="62%">
              <stop offset="0" stop-color="#fff9ef" stop-opacity=".95"/>
              <stop offset=".18" stop-color="#f0cf89" stop-opacity=".82"/>
              <stop offset=".46" stop-color="#1f5f95" stop-opacity=".48"/>
              <stop offset="1" stop-color="#0b2948" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="atoNativeOrbCore" cx="40%" cy="36%" r="74%">
              <stop offset="0" stop-color="#fff9ef"/>
              <stop offset=".24" stop-color="#f6d58f"/>
              <stop offset=".58" stop-color="#e8b64f"/>
              <stop offset="1" stop-color="#b97818"/>
            </radialGradient>
            <linearGradient id="atoNativeOrbRing" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#fff9ef" stop-opacity=".96"/>
              <stop offset=".36" stop-color="#f0cf89" stop-opacity=".88"/>
              <stop offset="1" stop-color="#1f5f95" stop-opacity=".66"/>
            </linearGradient>
          </defs>

          <ellipse class="ato-ai-orbit ato-ai-orbit--a" cx="32" cy="32" rx="24.6" ry="8.0"/>
          <ellipse class="ato-ai-orbit ato-ai-orbit--b" cx="31.4" cy="31.8" rx="21.5" ry="10.8"/>
          <ellipse class="ato-ai-orbit ato-ai-orbit--c" cx="32.8" cy="31.4" rx="17.6" ry="6.0"/>
          <ellipse class="ato-ai-orbit ato-ai-orbit--d" cx="31.8" cy="32.6" rx="25.8" ry="9.2"/>
          <ellipse class="ato-ai-orb-pass" cx="32" cy="32" rx="24.6" ry="8.0"/>

          <g class="ato-ai-orb-particle ato-ai-orb-particle--1"><circle cx="32" cy="8" r="1.12" fill="#e8b64f"/></g>
          <g class="ato-ai-orb-particle ato-ai-orb-particle--2"><circle cx="53.2" cy="25.6" r=".96" fill="#5d87ac"/></g>
          <g class="ato-ai-orb-particle ato-ai-orb-particle--3"><circle cx="17.4" cy="13.9" r=".80" fill="#fff9ef"/></g>
          <g class="ato-ai-orb-particle ato-ai-orb-particle--4"><circle cx="12.4" cy="42.2" r=".86" fill="#d7a83e"/></g>
          <g class="ato-ai-orb-particle ato-ai-orb-particle--5"><circle cx="44.6" cy="51.6" r=".92" fill="#1f5f95"/></g>
          <g class="ato-ai-orb-particle ato-ai-orb-particle--6"><circle cx="47.6" cy="16" r=".78" fill="#f0cf89"/></g>

          <g class="ato-ai-orb-core">
            <circle cx="32" cy="32" r="13.8" fill="url(#atoNativeOrbHalo)" opacity=".94"/>
            <circle cx="32" cy="32" r="8.9" fill="url(#atoNativeOrbHalo)" opacity=".38"/>
            <circle cx="32" cy="32" r="6.4" fill="none" stroke="url(#atoNativeOrbRing)" stroke-width=".88" stroke-opacity=".74"/>
            <circle cx="32" cy="32" r="5.6" fill="url(#atoNativeOrbCore)"/>
            <circle cx="32" cy="32" r="2.7" fill="#fff9ef" opacity=".24"/>
            <circle cx="31.15" cy="31.0" r=".78" fill="#fff9ef" opacity=".95"/>
          </g>
        </svg>
      </span>
      <span class="ato-ai-orb-label" aria-hidden="true">AI Assistant</span>
    `;
  }

  function initOrbHint(){
    const launch=$('#atoAssistantLaunch');
    if(!launch || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

    let seen=false;
    try{ seen=sessionStorage.getItem(ORB_HINT_KEY)==='1'; }catch(e){}
    if(seen) return;

    setTimeout(()=>{
      const b=$('#atoAssistantLaunch');
      if(!b || b.getAttribute('aria-expanded')==='true') return;
      b.classList.add('ato-ai-orb-hint');
      setTimeout(()=>b?.classList.remove('ato-ai-orb-hint'),2400);
      try{ sessionStorage.setItem(ORB_HINT_KEY,'1'); }catch(e){}
    },5600);
  }

  function buildUI(){
    injectOrbStyles();
    // Remove the old generic WhatsApp/Concierge popup without editing legacy markup.
    document.querySelectorAll('.whatsapp-popup, .ato-concierge').forEach(el=>el.remove());
    if($('#atoAssistantRoot')) return;

    const t=T();
    const root=document.createElement('div');
    root.id='atoAssistantRoot';
    root.className='ato-assistant';
    root.innerHTML=`
      <button class="ato-assistant-launch ato-ai-orb-launch" id="atoAssistantLaunch" type="button"
              aria-label="Open AI Assistant" aria-expanded="false">
        ${orbMarkup()}
      </button>

      <section class="ato-assistant-panel" id="atoAssistantPanel" aria-hidden="true" aria-label="${esc(t.title)}">
        <header class="ato-assistant-head">
          <div>
            <div class="ato-assistant-eyebrow">ALANYA TOUR ORGANIZATIONS</div>
            <h3>${esc(t.title)}</h3>
            <div class="ato-assistant-status"><span></span>${esc(t.status)}</div>
          </div>
          <div class="ato-assistant-head__actions">
            <button type="button" id="atoAssistantReset" title="${esc(t.reset)}" aria-label="${esc(t.reset)}">↺</button>
            <button type="button" id="atoAssistantClose" title="${esc(t.close)}" aria-label="${esc(t.close)}">×</button>
          </div>
        </header>

        <div class="ato-assistant-thread" id="atoAssistantThread" aria-live="polite"></div>
        <div class="ato-assistant-chips" id="atoAssistantChips"></div>

        <div class="ato-assistant-handoff">
          <button type="button" id="atoAssistantManager">
            <span>${esc(t.manager)}</span><b>→</b>
          </button>
        </div>

        <form class="ato-assistant-compose" id="atoAssistantForm">
          <textarea id="atoAssistantInput" rows="1" maxlength="900" placeholder="${esc(t.placeholder)}" aria-label="${esc(t.placeholder)}"></textarea>
          <button type="submit" id="atoAssistantSend" aria-label="${esc(t.send)}">↗</button>
        </form>
        <div class="ato-assistant-fineprint">AI ASSISTANT · FINAL AVAILABILITY & BOOKING CONFIRMED BY ATO MANAGER</div>
      </section>`;
    document.body.appendChild(root);
    initLaunchTone();

    renderHistory();
    renderChips();
    bind();
    initOrbHint();
  }

  function bubble(role,text, temporary=false){
    const wrap=document.createElement('div');
    wrap.className=`ato-assistant-msg ato-assistant-msg--${role}${temporary?' is-temporary':''}`;
    wrap.innerHTML=`<div class="ato-assistant-msg__label">${role==='user'?'YOU':'ATO'}</div><div class="ato-assistant-msg__body">${esc(text).replace(/\n/g,'<br>')}</div>`;
    return wrap;
  }

  function renderHistory(){
    const thread=$('#atoAssistantThread'); if(!thread) return;
    thread.innerHTML='';
    if(!history.length) thread.appendChild(bubble('assistant',T().intro));
    history.forEach(m=>thread.appendChild(bubble(m.role,m.text)));
    thread.scrollTop=thread.scrollHeight;
  }

  function renderChips(){
    const el=$('#atoAssistantChips'); if(!el) return;
    el.innerHTML=T().chips.map(x=>`<button type="button" data-ato-prompt="${esc(x)}">${esc(x)}</button>`).join('');
  }

  function add(role,text){
    history.push({role,text:String(text).slice(0,1800)});
    history=history.slice(-MAX_HISTORY);
    save();
    const thread=$('#atoAssistantThread');
    thread.appendChild(bubble(role,text));
    thread.scrollTop=thread.scrollHeight;
  }

  function openPanel(){
    const p=$('#atoAssistantPanel'), b=$('#atoAssistantLaunch');
    if(!p || !b) return;

    p.classList.add('is-open');
    p.setAttribute('aria-hidden','false');
    b.setAttribute('aria-expanded','true');

    requestAnimationFrame(()=>{
      const cs=getComputedStyle(p);
      const r=p.getBoundingClientRect();
      const rendered=
        cs.display!=='none' &&
        cs.visibility!=='hidden' &&
        r.width>0 &&
        r.height>0;

      if(rendered){
        b.classList.add('is-hidden');
        setTimeout(()=>$('#atoAssistantInput')?.focus(),180);
      }else{
        /* Safety: never leave the user with a vanished trigger. */
        p.classList.remove('is-open');
        p.setAttribute('aria-hidden','true');
        b.classList.remove('is-hidden');
        b.setAttribute('aria-expanded','false');
      }
    });
  }

  function closePanel(){
    const p=$('#atoAssistantPanel'), b=$('#atoAssistantLaunch');
    if(!p || !b) return;

    p.classList.remove('is-open');
    p.setAttribute('aria-hidden','true');
    b.classList.remove('is-hidden');
    b.setAttribute('aria-expanded','false');
  }

  function autoresize(el){
    el.style.height='auto';
    el.style.height=Math.min(112, Math.max(42,el.scrollHeight))+'px';
  }

  async function send(text){
    text=String(text||'').trim();
    if(!text || busy) return;
    busy=true;
    const prior=history.slice(-8);
    add('user',text);
    const thread=$('#atoAssistantThread');
    const temp=bubble('assistant',T().thinking,true); thread.appendChild(temp); thread.scrollTop=thread.scrollHeight;
    $('#atoAssistantSend').disabled=true;

    try{
      const r=await fetch(API_URL,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          message:text,
          history:prior,
          language:lang(),
          session_id:sessionId(),
          page:pageContext()
        })
      });
      const data=await r.json().catch(()=>({}));
      temp.remove();
      if(!r.ok || !data.answer){
        add('assistant', r.status===503 ? T().unavailable : (data.error || T().retry));
      }else{
        add('assistant',data.answer);
      }
    }catch(e){
      temp.remove();
      add('assistant',T().retry);
    }finally{
      busy=false;
      $('#atoAssistantSend').disabled=false;
      $('#atoAssistantInput')?.focus();
    }
  }

  function managerHandoff(){
    const t=T();
    const transcript=history.slice(-8).map(m=>`${m.role==='user'?'CLIENT':'ATO ASSISTANT'}: ${m.text}`).join('\n\n').slice(0,2600);
    const msg=[
      'ATO ASSISTANT — CLIENT HANDOFF',
      `Language: ${lang().toUpperCase()}`,
      `Page: ${location.href}`,
      '',
      transcript || t.managerLead,
      '',
      'Please continue this conversation as ATO Manager.'
    ].join('\n');
    window.open(`https://wa.me/${MANAGER_WA}?text=${encodeURIComponent(msg)}`,'_blank','noopener');
  }

  function resetChat(){
    history=[]; save(); renderHistory(); renderChips();
  }

  function bind(){
    const launch=$('#atoAssistantLaunch');
    launch.addEventListener('pointerdown',()=>{
      launch.classList.add('ato-ai-orb-press');
      setTimeout(()=>launch.classList.remove('ato-ai-orb-press'),170);
    });
    launch.addEventListener('click',openPanel);
    $('#atoAssistantClose').addEventListener('click',closePanel);
    $('#atoAssistantReset').addEventListener('click',resetChat);
    $('#atoAssistantManager').addEventListener('click',managerHandoff);
    $('#atoAssistantChips').addEventListener('click',e=>{
      const b=e.target.closest('[data-ato-prompt]'); if(b) send(b.dataset.atoPrompt);
    });
    $('#atoAssistantForm').addEventListener('submit',e=>{
      e.preventDefault(); const input=$('#atoAssistantInput'); const v=input.value; input.value=''; autoresize(input); send(v);
    });
    $('#atoAssistantInput').addEventListener('input',e=>autoresize(e.target));
    $('#atoAssistantInput').addEventListener('keydown',e=>{
      if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); $('#atoAssistantForm').requestSubmit(); }
    });
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') closePanel(); });
  }

  function refreshLanguage(){
    const wasOpen=$('#atoAssistantPanel')?.classList.contains('is-open');
    $('#atoAssistantRoot')?.remove();
    buildUI();
    if(wasOpen) openPanel();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',buildUI,{once:true});
  else buildUI();

  const obs=new MutationObserver(m=>{ if(m.some(x=>x.type==='attributes'&&x.attributeName==='lang')) refreshLanguage(); });
  obs.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
