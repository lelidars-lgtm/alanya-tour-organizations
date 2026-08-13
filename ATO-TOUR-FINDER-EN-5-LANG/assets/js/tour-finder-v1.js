(function(){
  'use strict';

  const DATA_URL='/assets/data/tours-v1.json';

  const I18N={
    en:{title:'Find your perfect tour',close:'Close tour finder',ph:'Search Cappadocia, rafting, kids, yacht, spa...',categories:'Categories',price:'Price',quick:'Quick filters',matching:'matching tours',reset:'Reset filters',all:'All tours',any:'Any price',under50:'Up to €50',mid:'€51–100',over100:'€100+',request:'On request',empty:'No exact matches. Reset one of the filters or try another word.',found:'tours found',resetShort:'Reset',viewAll:'VIEW ALL {n} TOURS →',try:'Try another word or reset filters.',tags:{family:'Family',vip:'VIP',private:'Private',kids:'Kids',couples:'Couples',friends:'Friends',extreme:'Extreme',relax:'Relax',luxury:'Luxury'},cats:['Sea Experiences','Extreme & Adventure','Nature & Adventure','History & Culture','Family Experiences','Air Experiences','Water Sports','Wellness & Relax','VIP Service']},
    ru:{title:'Найдите идеальный тур',close:'Закрыть поиск туров',ph:'Каппадокия, рафтинг, дети, яхта, спа...',categories:'Категории',price:'Цена',quick:'Быстрые фильтры',matching:'подходящих туров',reset:'Сбросить фильтры',all:'Все туры',any:'Любая цена',under50:'До €50',mid:'€51–100',over100:'€100+',request:'По запросу',empty:'Точных совпадений нет. Сбросьте один из фильтров или попробуйте другое слово.',found:'туров найдено',resetShort:'Сбросить',viewAll:'ПОКАЗАТЬ ВСЕ {n} ТУРОВ →',try:'Попробуйте другое слово или сбросьте фильтры.',tags:{family:'Семья',vip:'VIP',private:'Частный',kids:'Дети',couples:'Пары',friends:'Друзья',extreme:'Экстрим',relax:'Отдых',luxury:'Люкс'},cats:['Морские приключения','Экстрим и приключения','Природа и приключения','История и культура','Семейный отдых','Воздушные приключения','Водные виды спорта','Велнес и отдых','VIP-сервис']},
    tr:{title:'Mükemmel turunuzu bulun',close:'Tur bulucuyu kapat',ph:'Kapadokya, rafting, çocuklar, yat, spa...',categories:'Kategoriler',price:'Fiyat',quick:'Hızlı filtreler',matching:'uygun tur',reset:'Filtreleri sıfırla',all:'Tüm turlar',any:'Tüm fiyatlar',under50:'€50’ye kadar',mid:'€51–100',over100:'€100+',request:'Fiyat sorunuz',empty:'Tam eşleşme bulunamadı. Bir filtreyi sıfırlayın veya başka bir kelime deneyin.',found:'tur bulundu',resetShort:'Sıfırla',viewAll:'TÜM {n} TURU GÖR →',try:'Başka bir kelime deneyin veya filtreleri sıfırlayın.',tags:{family:'Aile',vip:'VIP',private:'Özel',kids:'Çocuklar',couples:'Çiftler',friends:'Arkadaşlar',extreme:'Ekstrem',relax:'Rahatlama',luxury:'Lüks'},cats:['Deniz Deneyimleri','Ekstrem & Macera','Doğa & Macera','Tarih & Kültür','Aile Deneyimleri','Hava Deneyimleri','Su Sporları','Wellness & Rahatlama','VIP Hizmet']},
    de:{title:'Finden Sie Ihre perfekte Tour',close:'Tourensuche schließen',ph:'Kappadokien, Rafting, Kinder, Yacht, Spa...',categories:'Kategorien',price:'Preis',quick:'Schnellfilter',matching:'passende Touren',reset:'Filter zurücksetzen',all:'Alle Touren',any:'Jeder Preis',under50:'Bis €50',mid:'€51–100',over100:'€100+',request:'Auf Anfrage',empty:'Keine exakten Treffer. Setzen Sie einen Filter zurück oder versuchen Sie ein anderes Wort.',found:'Touren gefunden',resetShort:'Zurücksetzen',viewAll:'ALLE {n} TOUREN ANSEHEN →',try:'Versuchen Sie ein anderes Wort oder setzen Sie die Filter zurück.',tags:{family:'Familie',vip:'VIP',private:'Privat',kids:'Kinder',couples:'Paare',friends:'Freunde',extreme:'Extrem',relax:'Entspannung',luxury:'Luxus'},cats:['Meereserlebnisse','Extrem & Abenteuer','Natur & Abenteuer','Geschichte & Kultur','Familienerlebnisse','Lufterlebnisse','Wassersport','Wellness & Entspannung','VIP-Service']},
    pl:{title:'Znajdź idealną wycieczkę',close:'Zamknij wyszukiwarkę',ph:'Kapadocja, rafting, dzieci, jacht, spa...',categories:'Kategorie',price:'Cena',quick:'Szybkie filtry',matching:'pasujących wycieczek',reset:'Wyczyść filtry',all:'Wszystkie wycieczki',any:'Dowolna cena',under50:'Do €50',mid:'€51–100',over100:'€100+',request:'Na zapytanie',empty:'Brak dokładnych wyników. Wyczyść jeden z filtrów lub spróbuj innego słowa.',found:'wycieczek znaleziono',resetShort:'Wyczyść',viewAll:'ZOBACZ WSZYSTKIE {n} WYCIECZEK →',try:'Spróbuj innego słowa lub wyczyść filtry.',tags:{family:'Rodzina',vip:'VIP',private:'Prywatne',kids:'Dzieci',couples:'Pary',friends:'Przyjaciele',extreme:'Ekstremalne',relax:'Relaks',luxury:'Luksus'},cats:['Morskie przygody','Ekstremalne przygody','Natura i przygoda','Historia i kultura','Rodzinne atrakcje','Przygody w powietrzu','Sporty wodne','Wellness i relaks','Usługi VIP']}
  };
  function lang(){const x=localStorage.getItem('atoLanguage')||document.documentElement.lang||'en';return I18N[x]?x:'en'}
  function L(){return I18N[lang()]}

  const TAG_LABELS={family:'Family',vip:'VIP',private:'Private',kids:'Kids',couples:'Couples',friends:'Friends',extreme:'Extreme',relax:'Relax',luxury:'Luxury'};
  const CATEGORY_ORDER=['Sea Experiences','Extreme & Adventure','Nature & Adventure','History & Culture','Family Experiences','Air Experiences','Water Sports','Wellness & Relax','VIP Service'];
  const ALIASES={
    'рафтинг':'rafting','яхта':'yacht','яхты':'yacht','лодка':'boat','корабль':'boat','море':'sea','семья':'family','семейный':'family','дети':'kids','ребенок':'kids','ребёнок':'kids','хамам':'hammam','спа':'spa','массаж':'massage','параглайдинг':'paragliding','дельфин':'dolphin','каппадокия':'cappadocia','памуккале':'pamukkale','сафари':'safari','рыбалка':'fishing','вертолет':'helicopter','вертолёт':'helicopter','частный':'private','приватный':'private','экстрим':'extreme','релакс':'relax','люкс':'luxury',
    'aile':'family','çocuk':'kids','cocuk':'kids','tekne':'boat','yat':'yacht','özel':'private','ozel':'private','rahatlama':'relax','masaj':'massage','helikopter':'helicopter'
  };

  const state={query:'',tags:new Set(),category:'',price:''};
  let tours=[];

  function ensureModal(){
    if(document.getElementById('atoTourFinderModal')) return;
    document.body.insertAdjacentHTML('beforeend',`<div class="ato-tour-finder-modal" id="atoTourFinderModal" aria-hidden="true">
      <section class="ato-tour-finder-dialog" role="dialog" aria-modal="true" aria-labelledby="atoTourFinderTitle">
        <div class="ato-tour-finder-head">
          <div><div class="ato-tour-finder-eyebrow">ALANYA TOUR ORGANIZATIONS</div><h2 id="atoTourFinderTitle">Find your perfect tour</h2></div>
          <button type="button" class="ato-tour-finder-close" id="atoTourFinderClose" aria-label="Close tour finder">×</button>
        </div>
        <div class="ato-tour-finder-controls">
          <div class="ato-tour-finder-search-wrap"><span aria-hidden="true">⌕</span><input id="atoTourFinderSearch" type="search" autocomplete="off" placeholder="Search Cappadocia, rafting, kids, yacht, spa..."></div>
          <div class="ato-filter-label" id="atoCategoriesLabel">Categories</div><div class="ato-chip-row" id="atoTourFinderCategories"></div>
          <div class="ato-filter-label" id="atoPriceLabel">Price</div><div class="ato-chip-row" id="atoTourFinderPrices"></div>
          <div class="ato-filter-label" id="atoQuickLabel">Quick filters</div><div class="ato-chip-row" id="atoTourFinderTags"></div>
        </div>
        <div class="ato-tour-finder-summary"><span><strong id="atoTourFinderCount">0</strong> <span id="atoMatchingLabel">matching tours</span></span><button type="button" class="ato-reset-filter" id="atoTourFinderReset">Reset filters</button></div>
        <div class="ato-tour-finder-results" id="atoTourFinderResults"></div>
      </section>
    </div>`);
  }

  function norm(v){
    let s=String(v||'').toLocaleLowerCase('en').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
    Object.entries(ALIASES).forEach(([from,to])=>{s=s.split(from).join(to)});
    return s;
  }
  function hay(t){return norm([t.name,t.category,t.duration,...(t.meta||[]),...(t.tags||[]),...(t.keywords||[])].join(' '))}
  function active(){return !!(state.query||state.category||state.price||state.tags.size)}
  function matches(){
    const words=norm(state.query).split(/\s+/).filter(Boolean);
    return tours.filter(t=>{
      const h=hay(t);
      const p=typeof t.price==='number'?t.price:null;
      const priceOK=!state.price ||
        (state.price==='under50' && p!==null && p<=50) ||
        (state.price==='mid' && p!==null && p>50 && p<=100) ||
        (state.price==='over100' && p!==null && p>100) ||
        (state.price==='request' && /ask|vip|request/i.test(String(t.priceLabel||'')));
      return (!words.length||words.every(w=>h.includes(w))) &&
             (!state.category||t.category===state.category) && priceOK &&
             (!state.tags.size||[...state.tags].every(tag=>(t.tags||[]).includes(tag)));
    });
  }
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
  function resultHTML(t,compact){
    const n=esc(t.name), c=esc(t.category), url=esc(t.url||'#');
    const detail=[t.priceLabel||'',t.duration||''].filter(Boolean).join(' · ');
    if(compact) return `<a class="ato-sidebar-result" href="${url}"><b>${n}</b><span>${c}${detail?' · '+esc(detail):''} →</span></a>`;
    const labels=(t.tags||[]).slice(0,3).map(x=>L().tags[x]||TAG_LABELS[x]||x).join(' · ');
    const meta=[c,t.priceLabel||'',t.duration||'',labels].filter(Boolean).map(esc).join(' · ');
    return `<a class="ato-tour-result" href="${url}"><div><div class="ato-tour-result-title">${n}</div><div class="ato-tour-result-meta">${meta}</div></div><div class="ato-tour-result-arrow">→</div></a>`;
  }
  function updateURL(){
    if(!document.getElementById('officialTourSearch')) return;
    try{
      const u=new URL(location.href);
      state.query?u.searchParams.set('q',state.query):u.searchParams.delete('q');
      state.category?u.searchParams.set('category',state.category):u.searchParams.delete('category');
      state.tags.size?u.searchParams.set('tags',[...state.tags].join(',')):u.searchParams.delete('tags');
      state.price?u.searchParams.set('price',state.price):u.searchParams.delete('price');
      history.replaceState(null,'',u.pathname+(u.search||'')+u.hash);
    }catch(e){}
  }
  function syncCategoryCards(found){
    const cards=[...document.querySelectorAll('.category-card')];
    if(!cards.length) return;
    if(!active()){cards.forEach(c=>c.classList.remove('is-filter-hidden'));return}
    const cats=new Set(found.map(t=>norm(t.category)));
    cards.forEach(card=>{
      const href=norm(card.getAttribute('href')), txt=norm(card.textContent);
      const visible=[...cats].some(c=>txt.includes(c.split(' ')[0])||href.includes(c.split(' ')[0]));
      card.classList.toggle('is-filter-hidden',!visible);
    });
  }

  function localizeUI(){
    const l=L(), set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
    set('atoTourFinderTitle',l.title); set('atoCategoriesLabel',l.categories); set('atoPriceLabel',l.price);
    set('atoQuickLabel',l.quick); set('atoMatchingLabel',l.matching); set('atoTourFinderReset',l.reset);
    const close=document.getElementById('atoTourFinderClose'); if(close) close.setAttribute('aria-label',l.close);
    const ms=document.getElementById('atoTourFinderSearch'); if(ms) ms.placeholder=l.ph;
    const ss=document.getElementById('officialTourSearch'); if(ss) ss.placeholder=l.ph;
    const sr=document.getElementById('atoSidebarReset'); if(sr) sr.textContent=l.resetShort;
    const st=document.querySelector('#atoSidebarFilterStatus span'); if(st){const c=document.getElementById('atoSidebarResultCount'); st.innerHTML='<strong id="atoSidebarResultCount">'+(c?c.textContent:'0')+'</strong> '+l.found;}
    const cats=document.getElementById('atoTourFinderCategories');
    if(cats) cats.innerHTML='<button type="button" class="ato-filter-chip" data-ato-category="">'+l.all+'</button>'+CATEGORY_ORDER.map((c,i)=>`<button type="button" class="ato-filter-chip" data-ato-category="${esc(c)}">${esc(l.cats[i]||c)}</button>`).join('');
    const prices=document.getElementById('atoTourFinderPrices');
    if(prices) prices.innerHTML='<button type="button" class="ato-filter-chip" data-ato-price="">'+l.any+'</button><button type="button" class="ato-filter-chip" data-ato-price="under50">'+l.under50+'</button><button type="button" class="ato-filter-chip" data-ato-price="mid">'+l.mid+'</button><button type="button" class="ato-filter-chip" data-ato-price="over100">'+l.over100+'</button><button type="button" class="ato-filter-chip" data-ato-price="request">'+l.request+'</button>';
    const tags=document.getElementById('atoTourFinderTags');
    if(tags) tags.innerHTML=Object.keys(TAG_LABELS).map(k=>`<button type="button" class="ato-filter-chip" data-ato-tag="${k}">${esc(l.tags[k]||TAG_LABELS[k])}</button>`).join('');
  }

  function render(){
    localizeUI();
    const found=matches();
    const sidebarSearch=document.getElementById('officialTourSearch');
    const modalSearch=document.getElementById('atoTourFinderSearch');
    if(sidebarSearch&&sidebarSearch.value!==state.query) sidebarSearch.value=state.query;
    if(modalSearch&&modalSearch.value!==state.query) modalSearch.value=state.query;

    document.querySelectorAll('[data-filter-tag]').forEach(b=>b.classList.toggle('is-active',state.tags.has(b.dataset.filterTag)));
    document.querySelectorAll('[data-ato-tag]').forEach(b=>b.classList.toggle('is-active',state.tags.has(b.dataset.atoTag)));
    document.querySelectorAll('[data-ato-category]').forEach(b=>b.classList.toggle('is-active',(b.dataset.atoCategory||'')===state.category));
    document.querySelectorAll('[data-ato-price]').forEach(b=>b.classList.toggle('is-active',(b.dataset.atoPrice||'')===state.price));

    const modalCount=document.getElementById('atoTourFinderCount');
    const modalResults=document.getElementById('atoTourFinderResults');
    if(modalCount) modalCount.textContent=found.length;
    if(modalResults) modalResults.innerHTML=found.length?found.map(t=>resultHTML(t,false)).join(''):`<div class="ato-tour-empty">${esc(L().empty)}</div>`;

    const sidebarStatus=document.getElementById('atoSidebarFilterStatus');
    const sidebarCount=document.getElementById('atoSidebarResultCount');
    const sidebarResults=document.getElementById('atoSidebarResults');
    const isActive=active();
    if(sidebarStatus) sidebarStatus.hidden=!isActive;
    if(sidebarCount) sidebarCount.textContent=found.length;
    if(sidebarResults){
      sidebarResults.hidden=!isActive;
      if(isActive){
        sidebarResults.innerHTML=found.length?found.slice(0,6).map(t=>resultHTML(t,true)).join('')+(found.length>6?`<button type="button" class="ato-sidebar-more" id="atoSidebarMore">${esc(L().viewAll.replace('{n}',found.length))}</button>`:''):`<div class="ato-sidebar-result"><b>${esc(L().empty.split('.')[0])}</b><span>${esc(L().try)}</span></div>`;
        document.getElementById('atoSidebarMore')?.addEventListener('click',openModal);
      }
    }
    syncCategoryCards(found);
    updateURL();
  }
  function reset(){state.query='';state.category='';state.price='';state.tags.clear();render()}
  function openModal(){
    const modal=document.getElementById('atoTourFinderModal');
    modal?.classList.add('open'); modal?.setAttribute('aria-hidden','false'); document.body.classList.add('ato-tour-finder-open');
    requestAnimationFrame(()=>document.getElementById('atoTourFinderSearch')?.focus());
  }
  function closeModal(){document.getElementById('atoTourFinderModal')?.classList.remove('open');document.getElementById('atoTourFinderModal')?.setAttribute('aria-hidden','true');document.body.classList.remove('ato-tour-finder-open')}
  function bind(){
    const cats=document.getElementById('atoTourFinderCategories');
    let prices=document.getElementById('atoTourFinderPrices');
    if(!prices&&cats){cats.insertAdjacentHTML('afterend','<div class="ato-filter-label" id="atoPriceLabel">Price</div><div class="ato-chip-row" id="atoTourFinderPrices"></div>');prices=document.getElementById('atoTourFinderPrices')}
    const tags=document.getElementById('atoTourFinderTags');
    if(cats){
      cats.innerHTML='<button type="button" class="ato-filter-chip" data-ato-category="">All tours</button>'+CATEGORY_ORDER.map(c=>`<button type="button" class="ato-filter-chip" data-ato-category="${esc(c)}">${esc(c)}</button>`).join('');
      cats.addEventListener('click',e=>{const b=e.target.closest('[data-ato-category]');if(!b)return;state.category=b.dataset.atoCategory||'';render()});
    }
    if(prices){
      prices.innerHTML='<button type="button" class="ato-filter-chip" data-ato-price="">Any price</button><button type="button" class="ato-filter-chip" data-ato-price="under50">Up to €50</button><button type="button" class="ato-filter-chip" data-ato-price="mid">€51–100</button><button type="button" class="ato-filter-chip" data-ato-price="over100">€100+</button><button type="button" class="ato-filter-chip" data-ato-price="request">On request</button>';
      prices.addEventListener('click',e=>{const b=e.target.closest('[data-ato-price]');if(!b)return;state.price=b.dataset.atoPrice||'';render()});
    }
    if(tags){
      tags.innerHTML=Object.entries(TAG_LABELS).map(([k,v])=>`<button type="button" class="ato-filter-chip" data-ato-tag="${k}">${v}</button>`).join('');
      tags.addEventListener('click',e=>{const b=e.target.closest('[data-ato-tag]');if(!b)return;const tag=b.dataset.atoTag;state.tags.has(tag)?state.tags.delete(tag):state.tags.add(tag);render()});
    }
    let timer;
    document.getElementById('officialTourSearch')?.addEventListener('input',e=>{clearTimeout(timer);timer=setTimeout(()=>{state.query=e.target.value||'';render()},70)});
    document.getElementById('atoTourFinderSearch')?.addEventListener('input',e=>{clearTimeout(timer);timer=setTimeout(()=>{state.query=e.target.value||'';render()},55)});
    document.querySelectorAll('[data-filter-tag]').forEach(b=>b.addEventListener('click',()=>{const tag=b.dataset.filterTag;state.tags.has(tag)?state.tags.delete(tag):state.tags.add(tag);render()}));
    document.getElementById('atoSidebarReset')?.addEventListener('click',reset);
    document.getElementById('atoTourFinderReset')?.addEventListener('click',reset);
    document.getElementById('atoTourFinderClose')?.addEventListener('click',closeModal);
    document.getElementById('atoTourFinderModal')?.addEventListener('click',e=>{if(e.target.id==='atoTourFinderModal')closeModal()});
    const headers=[...document.querySelectorAll('#headerTourSearch,.header-tour-search')];
    headers.forEach(h=>h.addEventListener('click',e=>{e.preventDefault();openModal()}));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openModal()}});
  }
  function restoreFromURL(){
    if(!document.getElementById('officialTourSearch')) return;
    try{const p=new URLSearchParams(location.search);state.query=p.get('q')||'';state.category=p.get('category')||'';state.price=p.get('price')||'';(p.get('tags')||'').split(',').filter(Boolean).forEach(t=>state.tags.add(t))}catch(e){}
  }
  async function init(){
    ensureModal(); bind(); restoreFromURL();
    try{
      const r=await fetch(DATA_URL,{cache:'no-store'});
      if(!r.ok) throw new Error('Tour catalog HTTP '+r.status);
      tours=await r.json();
      if(!Array.isArray(tours)) throw new Error('Tour catalog format');
    }catch(err){
      console.error('[ATO Tour Finder] catalog load failed:',err);
      tours=[];
    }
    render();
  }
  window.addEventListener('ato-language-changed',()=>render());
  window.AlanyaTourFinder={open:openModal,close:closeModal,reset,getState:()=>({query:state.query,category:state.category,price:state.price,tags:[...state.tags]}),getCatalog:()=>tours.slice()};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
