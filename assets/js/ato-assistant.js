(() => {
  'use strict';

  const API_URL = '/api/ato-assistant';
  const MANAGER_WA = '905387045999';
  const STORAGE_KEY = 'ato_assistant_history_v1';
  const SESSION_KEY = 'ato_assistant_session_v1';
  const MAX_HISTORY = 12;

  const I18N = {
    en:{
      ask:'ASK ANYTHING', title:'ATO ASSISTANT', status:'AI ASSISTANT · MANAGER READY',
      intro:'Hello. I can help with tours, prices, children, transfers, schedules and booking.',
      placeholder:'Ask about tours, prices, children…', send:'Send', manager:'Talk to Manager',
      chips:['Find a tour','With children','Prices','Pickup & transfer','What do you recommend?'],
      thinking:'Looking into it…', unavailable:'The assistant is being connected. A manager can help you now.',
      retry:'Please try again.', close:'Close', reset:'New chat', managerLead:'Send this conversation to ATO Manager'
    },
    ru:{
      ask:'СПРОСИТЬ', title:'ATO ASSISTANT', status:'AI-ПОМОЩНИК · МЕНЕДЖЕР НА СВЯЗИ',
      intro:'Здравствуйте. Я помогу с турами, ценами, детьми, трансфером, расписанием и бронированием.',
      placeholder:'Спросите о турах, ценах, детях…', send:'Отправить', manager:'Связаться с менеджером',
      chips:['Подобрать тур','С детьми','Цены','Трансфер','Что посоветуете?'],
      thinking:'Уточняю…', unavailable:'Ассистент сейчас подключается. Менеджер может помочь вам прямо сейчас.',
      retry:'Попробуйте ещё раз.', close:'Закрыть', reset:'Новый чат', managerLead:'Передать этот диалог менеджеру ATO'
    },
    tr:{
      ask:'SORUNUZU SORUN', title:'ATO ASSISTANT', status:'AI ASİSTAN · YÖNETİCİ HAZIR',
      intro:'Merhaba. Turlar, fiyatlar, çocuklar, transfer, program ve rezervasyon konusunda yardımcı olabilirim.',
      placeholder:'Turlar, fiyatlar, çocuklar hakkında sorun…', send:'Gönder', manager:'Yöneticiye Bağlan',
      chips:['Tur bul','Çocuklarla','Fiyatlar','Transfer','Ne önerirsiniz?'],
      thinking:'Kontrol ediyorum…', unavailable:'Asistan bağlantısı hazırlanıyor. Yöneticimiz şimdi yardımcı olabilir.',
      retry:'Lütfen tekrar deneyin.', close:'Kapat', reset:'Yeni sohbet', managerLead:'Bu konuşmayı ATO yöneticisine gönder'
    },
    de:{
      ask:'FRAGE STELLEN', title:'ATO ASSISTANT', status:'AI-ASSISTENT · MANAGER BEREIT',
      intro:'Hallo. Ich helfe bei Touren, Preisen, Kindern, Transfer, Zeitplan und Buchung.',
      placeholder:'Fragen Sie nach Touren, Preisen, Kindern…', send:'Senden', manager:'Mit Manager sprechen',
      chips:['Tour finden','Mit Kindern','Preise','Transfer','Was empfehlen Sie?'],
      thinking:'Ich prüfe das…', unavailable:'Der Assistent wird gerade verbunden. Unser Manager kann jetzt helfen.',
      retry:'Bitte versuchen Sie es erneut.', close:'Schließen', reset:'Neuer Chat', managerLead:'Diesen Chat an den ATO Manager senden'
    },
    pl:{
      ask:'ZAPYTAJ', title:'ATO ASSISTANT', status:'ASYSTENT AI · MENEDŻER GOTOWY',
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

  function buildUI(){
    // Remove the old generic WhatsApp/Concierge popup without editing legacy markup.
    document.querySelectorAll('.whatsapp-popup, .ato-concierge').forEach(el=>el.remove());
    if($('#atoAssistantRoot')) return;

    const t=T();
    const root=document.createElement('div');
    root.id='atoAssistantRoot';
    root.className='ato-assistant';
    root.innerHTML=`
      <button class="ato-assistant-launch" id="atoAssistantLaunch" type="button" aria-expanded="false">
        <span class="ato-assistant-launch__signal" aria-hidden="true"></span>
        <span class="ato-assistant-launch__copy"><small>${esc(t.ask)}</small><strong>${esc(t.title)}</strong></span>
        <span class="ato-assistant-launch__arrow" aria-hidden="true">↗</span>
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

    renderHistory();
    renderChips();
    bind();
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
    p.classList.add('is-open'); p.setAttribute('aria-hidden','false');
    b.classList.add('is-hidden'); b.setAttribute('aria-expanded','true');
    setTimeout(()=>$('#atoAssistantInput')?.focus(),180);
  }
  function closePanel(){
    const p=$('#atoAssistantPanel'), b=$('#atoAssistantLaunch');
    p.classList.remove('is-open'); p.setAttribute('aria-hidden','true');
    b.classList.remove('is-hidden'); b.setAttribute('aria-expanded','false');
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
    $('#atoAssistantLaunch').addEventListener('click',openPanel);
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
