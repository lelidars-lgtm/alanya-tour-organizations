(() => {
'use strict';
const POOL_KEY='atoTripPlannerPool', DETAIL_KEY='atoTripPlannerDetail', PREF_KEY='atoTripPlannerPrefs', SCHEDULE_KEY='atoTripPlannerSchedule', GUIDE_KEY='atoTripPlannerGuideStep';
const MAX_POOL=4, MAX_DETAIL=4, MIN_DETAIL=2;
const WHATSAPP='905387045999';
const CATEGORY_SOURCES=[
  ['sea-experiences.html','Sea'],['extreme-adventure.html','Extreme & Adventure'],['nature-adventures.html','Nature & Adventure'],['history-culture.html','History & Culture'],['water-sports.html','Water Sports'],['air-experiences.html','Air Experiences'],['family-experiences.html','Family Experiences'],['wellness-relax.html','Wellness & Relax'],['vip-service.html','VIP Services']
];
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clean=s=>(s||'').replace(/\s+/g,' ').trim();
const normalizeHref=href=>{try{return new URL(href,location.href).pathname.split('/').filter(Boolean).pop()||''}catch(_){return String(href||'').split('?')[0].split('#')[0].split('/').pop()||''}};
const readJSON=(key,def)=>{try{const x=JSON.parse(localStorage.getItem(key)||'null');return x??def}catch(_){return def}};
const writeJSON=(key,val)=>{try{localStorage.setItem(key,JSON.stringify(val))}catch(_){}};
let pool=[...new Set(readJSON(POOL_KEY,[]).map(normalizeHref).filter(Boolean))].slice(0,MAX_POOL);
let detail=[...pool];
let registry=new Map(), detailsCache=new Map(), recommendations=[];
const GUIDE_STEPS={
  1:{target:'#exploreCategories',eyebrow:'STEP 1 OF 7',title:'Choose the tours that interest you',text:'Open the categories and add the excursions that caught your eye. Choose up to 4 tours to compare. When you select the fourth tour, Trip Planner will automatically take you to the next step.'},
  2:{target:'#tripPreferences',eyebrow:'STEP 2 OF 7',title:'Tell us about your holiday',text:'Add your travel dates and guest details, then choose your pace, road tolerance, preferred start time and interests. Mark pregnancy, elderly guests, stroller or reduced mobility if any of these apply. This makes the recommendations personal to your trip.'},
  3:{target:'#plannerRecommendations',eyebrow:'STEP 3 OF 7',title:'Your personal recommendations are ready',text:'We ranked your selected tours using the information you entered and the rules published on each tour page. Review the best matches, warnings and restrictions before continuing.'},
  4:{target:'#detailedComparison',eyebrow:'STEP 4 OF 7',title:'Compare your tours side by side',text:'Now review the analytical table: price, duration, transfer, meals, child policy, intensity, pregnancy or health notes and what to bring. Your selected tours are compared automatically.'},
  5:{target:'#planDates',eyebrow:'STEP 5 OF 7',title:'Build your holiday by dates',text:'We have prepared a suggested schedule for your selected tours. Review the proposed dates and change any of them if you wish. Weather guidance is added only when reliable live data is available.'},
  6:{target:'#bringChecklist',eyebrow:'STEP 6 OF 7',title:'Prepare for every excursion',text:'Check the What to Bring list for each tour separately. We keep the original tour requirements separate and will add date-specific weather guidance closer to the excursion.'},
  7:{target:'#finalPlan',eyebrow:'STEP 7 OF 7',title:'Your personal travel plan is ready',text:'Review your plan and send the request to our travel manager. The manager confirms availability, pickup time and final price. After confirmation, your electronic ticket and current pre-tour guidance become part of the same journey.'}
};
function guideRead(){try{return Number(localStorage.getItem(GUIDE_KEY)||1)||1}catch(_){return 1}}
function guideWrite(step){try{localStorage.setItem(GUIDE_KEY,String(step))}catch(_){} }
function ensureGuide(){
  let overlay=$('#tpGuideOverlay');
  if(overlay)return overlay;
  overlay=document.createElement('div');overlay.className='tp-guide-overlay';overlay.id='tpGuideOverlay';overlay.setAttribute('aria-hidden','true');
  overlay.innerHTML=`<div class="tp-guide-card" role="dialog" aria-modal="true" aria-labelledby="tpGuideTitle"><button class="tp-guide-close" type="button" aria-label="Close">×</button><div class="tp-guide-orbit"><span></span></div><div class="tp-guide-eyebrow"></div><h2 id="tpGuideTitle"></h2><p class="tp-guide-text"></p><button class="tp-guide-ok" type="button">GOT IT</button></div>`;
  document.body.appendChild(overlay);
  const close=()=>{overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true')};
  overlay.querySelector('.tp-guide-close').addEventListener('click',close);
  overlay.querySelector('.tp-guide-ok').addEventListener('click',close);
  overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open'))close()});
  return overlay;
}
function showGuide(step,{delay=0,scroll=true,force=false}={}){
  const data=GUIDE_STEPS[step];if(!data)return;
  if(!force&&guideRead()>step)return;
  window.setTimeout(()=>{
    const target=$(data.target);
    if(scroll&&target)target.scrollIntoView({behavior:'smooth',block:'start'});
    window.setTimeout(()=>{
      const overlay=ensureGuide();
      overlay.querySelector('.tp-guide-eyebrow').textContent=data.eyebrow;
      overlay.querySelector('#tpGuideTitle').textContent=data.title;
      overlay.querySelector('.tp-guide-text').textContent=data.text;
      overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');
      guideWrite(Math.max(guideRead(),step));
    },scroll?620:0);
  },delay);
}
function guideAdvance(step){guideWrite(step);showGuide(step,{force:true,scroll:true})}
function ensureResetDialog(){
  let overlay=$('#tpResetOverlay');
  if(overlay)return overlay;
  overlay=document.createElement('div');
  overlay.className='tp-reset-overlay';overlay.id='tpResetOverlay';overlay.setAttribute('aria-hidden','true');
  overlay.innerHTML=`<div class="tp-reset-card" role="dialog" aria-modal="true" aria-labelledby="tpResetTitle"><button class="tp-reset-x" type="button" aria-label="Close">×</button><div class="tp-reset-icon">↻</div><div class="tp-guide-eyebrow">START A NEW PLAN</div><h2 id="tpResetTitle">Build your trip again?</h2><p>This will clear selected tours, preferences, recommendations and planned dates. Your language setting will stay unchanged.</p><div class="tp-reset-actions"><button class="tp-reset-cancel" type="button">KEEP MY PLAN</button><button class="tp-reset-confirm" type="button">YES, START OVER</button></div></div>`;
  document.body.appendChild(overlay);
  const close=()=>{overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true')};
  overlay.querySelector('.tp-reset-x').addEventListener('click',close);
  overlay.querySelector('.tp-reset-cancel').addEventListener('click',close);
  overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
  overlay.querySelector('.tp-reset-confirm').addEventListener('click',()=>{close();resetPlannerState()});
  return overlay;
}
function openResetDialog(){const overlay=ensureResetDialog();overlay.classList.add('open');overlay.setAttribute('aria-hidden','false')}
function resetPlannerState(){
  [POOL_KEY,DETAIL_KEY,PREF_KEY,SCHEDULE_KEY,GUIDE_KEY].forEach(key=>{try{localStorage.removeItem(key)}catch(_){}});
  try{sessionStorage.removeItem('atoTPGuideIntroShown')}catch(_){}
  pool=[];detail=[];recommendations=[];detailsCache=new Map();
  const form=$('#prefsForm');if(form)form.reset();
  const requestTours=$('#requestTours');if(requestTours)requestTours.innerHTML='';
  const requestModal=$('#requestModal');if(requestModal){requestModal.classList.remove('open');requestModal.setAttribute('aria-hidden','true')}
  const guide=$('#tpGuideOverlay');if(guide){guide.classList.remove('open');guide.setAttribute('aria-hidden','true')}
  renderAll();renderCategoryCounts();
  history.replaceState(null,'',location.pathname+location.search+'#exploreCategories');
  window.setTimeout(()=>showGuide(1,{force:true,scroll:true}),250);
}
function ensureGuideNextButtons(){
  const defs=[
    ['#plannerRecommendations','CONTINUE TO COMPARISON',4],
    ['#detailedComparison','CONTINUE TO DATES',5],
    ['#planDates','CONTINUE TO WHAT TO BRING',6],
    ['#bringChecklist','CONTINUE TO FINAL STEP',7]
  ];
  defs.forEach(([sectionSel,label,step])=>{
    const section=$(sectionSel);if(!section||section.querySelector('.tp-guide-next'))return;
    const body=section.querySelector('.tp-section-body');if(!body)return;
    const wrap=document.createElement('div');wrap.className='tp-guide-next-wrap';
    const btn=document.createElement('button');btn.type='button';btn.className='tp-guide-next';btn.textContent=label;
    btn.addEventListener('click',()=>guideAdvance(step));
    wrap.appendChild(btn);body.appendChild(wrap);
  });
}
function updateGuideNextButtons(){
  const rec=$('#plannerRecommendations .tp-guide-next');if(rec)rec.disabled=!recommendations.length;
  const comp=$('#detailedComparison .tp-guide-next');if(comp)comp.disabled=detail.length<2;
  const dates=$('#planDates .tp-guide-next');if(dates){const p=readPrefs();dates.disabled=!(p.travelStart&&p.travelEnd&&detail.length)}
  const bring=$('#bringChecklist .tp-guide-next');if(bring)bring.disabled=!detail.length;
}
function startGuidedJourney(){
  let introShown=false;try{introShown=sessionStorage.getItem('atoTPGuideIntroShown')==='1'}catch(_){}
  if(pool.length===MAX_POOL){window.setTimeout(()=>showGuide(2,{force:true,scroll:true}),700);return}
  if(!introShown&&pool.length<MAX_POOL){
    try{sessionStorage.setItem('atoTPGuideIntroShown','1')}catch(_){}
    const launch=()=>window.setTimeout(()=>showGuide(1,{force:true,scroll:true}),10000);
    const intro=document.getElementById('tpYourIntro');
    if(intro){window.addEventListener('ato:your-intro-complete',launch,{once:true})}
    else{launch()}
  }
}

function escapeHTML(v){return String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function absoluteAsset(src,sourcePage){if(!src)return 'logo.png';try{return new URL(src,new URL(sourcePage,location.href)).href}catch(_){return src}}
function parseCard(card,category,sourcePage){
  const href=normalizeHref(card.getAttribute('href')); if(!href)return null;
  const title=clean(card.querySelector('.tour-body h3, h3')?.textContent)||href.replace(/\.html$/,'').replace(/-/g,' ');
  const img=card.querySelector('.tour-image img, img');
  const price=clean(card.querySelector('.tour-price')?.textContent)||'See tour page';
  const desc=clean(card.querySelector('.tour-body p, p')?.textContent);
  const meta=$$('.meta span',card).map(x=>clean(x.textContent)).filter(Boolean);
  return {href,title,image:absoluteAsset(img?.getAttribute('src'),sourcePage),price,desc,meta,category,sourcePage};
}
async function loadRegistry(){
  const jobs=CATEGORY_SOURCES.map(async([page,category])=>{
    try{
      const res=await fetch(page,{cache:'no-store',credentials:'same-origin'}); if(!res.ok)throw new Error(res.status);
      const html=await res.text(),doc=new DOMParser().parseFromString(html,'text/html');
      $$('a.tour-card[href]',doc).forEach(card=>{const item=parseCard(card,category,page);if(item)registry.set(item.href,item)});
    }catch(err){console.warn('Category source unavailable',page,err)}
  });
  await Promise.allSettled(jobs);
}
function textSentences(text,needle){
  return clean(text).split(/(?<=[.!?])\s+/).filter(s=>needle.test(s)).slice(0,4);
}
function findCardByHeading(doc,re){
  const heading=$$('h2,h3,h4',doc).find(h=>re.test(clean(h.textContent)));
  if(!heading)return null;
  return heading.closest('.premium-card,.info-card,.section-card,.details-col,section,article,div')||heading.parentElement;
}
function listFromBlock(block){if(!block)return[];let values=$$('li',block).map(li=>clean(li.textContent)).filter(Boolean);if(values.length)return [...new Set(values)].slice(0,12);values=$$('.premium-line,.small-list div,.highlight',block).map(x=>clean(x.textContent)).filter(Boolean);return [...new Set(values)].slice(0,12)}
function labeledValue(doc,labelRe){
  for(const row of $$('.premium-line,.detail-row,.small-list div,.info-row',doc)){
    const strong=row.querySelector('strong,b'); const label=clean(strong?.textContent||'');
    if(labelRe.test(label))return clean(row.textContent.replace(strong?.textContent||'','').replace(/^[:\s]+/,''));
  }
  return '';
}
function parsePageDetails(doc,item){
  const body=clean(doc.body?.innerText||doc.body?.textContent||'');
  const lower=body.toLowerCase();
  const bring=listFromBlock(findCardByHeading(doc,/what to bring|bring with you|what you need/i));
  const childBlock=findCardByHeading(doc,/child policy|children|age policy/i), safetyBlock=findCardByHeading(doc,/important.*information|important.*rules|safety|restrictions/i);
  const child=clean(childBlock?.innerText||childBlock?.textContent||labeledValue(doc,/children|child|age/i))||'See tour page';
  const safety=listFromBlock(safetyBlock);
  const duration=labeledValue(doc,/duration|total duration|tour duration/i)||item.meta.find(x=>/hour|day|minute/i.test(x))||'See tour page';
  let meals='See tour page';
  if(/lunch included|breakfast included|dinner included|meal[s]? included/i.test(lower)) meals='Included — see tour page for details';
  else if(/lunch.*not included|meal[s]?.*not included|food.*not included/i.test(lower)) meals='Not included / check tour page';
  const transfer=/hotel transfer|transfer included|pickup.*hotel|pick-up.*hotel/i.test(lower)?'Included / available':'See tour page';
  const pregnancy=textSentences(body,/pregnan/i);
  const ageSentences=textSentences(body,/minimum age|under \d+|children|child policy|age limit/i);
  const restrictions=textSentences(body,/not suitable|not recommended|not allowed|prohibited|restriction|medical|heart|blood pressure|wheelchair|mobility/i);
  const timeSentences=textSentences(body,/pickup|departure|return|starts? at|from \d{1,2}:\d{2}/i);
  let intensity='Moderate';
  if(/extreme|adrenaline|physically demanding|rafting|quad|buggy|paragliding|skydive|wakeboard|jet ski/i.test(lower))intensity='Active / high';
  if(/relax|wellness|hammam|massage|easy pace|peaceful/i.test(lower))intensity='Relaxed';
  const faq=$$('.faq-item',doc).map(x=>clean(x.textContent)).filter(Boolean).slice(0,8);
  return {body,bring,child,safety,duration,meals,transfer,pregnancy,ageSentences,restrictions,timeSentences,intensity,faq};
}
async function loadDetails(href){
  href=normalizeHref(href);if(detailsCache.has(href))return detailsCache.get(href);
  const item=registry.get(href)||{href,title:href.replace('.html',''),image:'logo.png',price:'See tour page',meta:[],category:'Tour',desc:''};
  const task=(async()=>{
    try{const res=await fetch(href,{cache:'no-store',credentials:'same-origin'});if(!res.ok)throw new Error(res.status);const html=await res.text(),doc=new DOMParser().parseFromString(html,'text/html');return {...item,...parsePageDetails(doc,item)}}
    catch(err){console.warn('Tour source unavailable',href,err);return {...item,body:'',bring:[],child:'See tour page',safety:[],duration:item.meta?.[0]||'See tour page',meals:'See tour page',transfer:'See tour page',pregnancy:[],ageSentences:[],restrictions:[],timeSentences:[],intensity:'See tour page',faq:[]}}
  })();detailsCache.set(href,task);return task;
}
function renderPool(){
  const host=$('#poolGrid'),count=$('#poolCount');count.textContent=`${pool.length}/${MAX_POOL}`;
  if(!pool.length){host.innerHTML=`<div class="tp-empty" style="grid-column:1/-1"><strong>Start building your journey</strong>Choose experiences from the premium category cards above, then press <b>＋ Compare</b> on the tours you love. <a href="#exploreCategories">Explore categories →</a></div>`;renderCategoryCounts();return}
  host.innerHTML=pool.map(h=>{const t=registry.get(h)||{href:h,title:h.replace('.html','').replace(/-/g,' '),image:'logo.png',price:'Loading…',desc:'',category:'Tour'};return `<article class="tp-card" data-href="${escapeHTML(h)}"><div class="tp-card-img"><img src="${escapeHTML(t.image)}" alt="${escapeHTML(t.title)}" onerror="this.src='logo.png'"><span class="tp-cat">${escapeHTML(t.category)}</span><span class="tp-auto-compare">✓ IN COMPARISON</span></div><div class="tp-card-body"><h3>${escapeHTML(t.title)}</h3><div class="tp-price">${escapeHTML(t.price)}</div><div class="tp-desc">${escapeHTML(t.desc)}</div><div class="tp-card-actions"><a href="${escapeHTML(h)}">View tour →</a><span class="spacer"></span><button class="tp-remove" type="button" data-remove="${escapeHTML(h)}">Remove</button></div></div></article>`}).join('');
  $$('#poolGrid [data-remove]').forEach(b=>b.onclick=()=>removeFromPool(b.dataset.remove));
  renderCategoryCounts();
}
function renderCategoryCounts(){
  const counts=new Map();
  pool.forEach(h=>{const t=registry.get(h);if(t?.category)counts.set(t.category,(counts.get(t.category)||0)+1)});
  $$('.tp-category-card[data-category-name]').forEach(card=>{
    const count=counts.get(card.dataset.categoryName)||0;const badge=card.querySelector('.tp-category-selected');if(!badge)return;
    badge.textContent=count?`${count} tour${count===1?'':'s'} selected`:'0 selected';badge.classList.toggle('has-selected',count>0);
  });
}
function applyQuickStart(mode){
  const form=$('#prefsForm');if(!form)return;
  const presets={
    family:{pace:'balanced',road:'low',startPref:'any',restDays:'yes',interests:['family']},
    sea:{pace:'balanced',road:'medium',startPref:'any',restDays:'no',interests:['sea','water']},
    active:{pace:'active',road:'high',startPref:'early',restDays:'no',interests:['extreme','nature','water','air']},
    relaxed:{pace:'relaxed',road:'low',startPref:'late',restDays:'yes',interests:['sea','wellness']},
    firsttime:{pace:'balanced',road:'medium',startPref:'any',restDays:'yes',interests:['sea','history','family','nature']},
    vip:{pace:'relaxed',road:'medium',startPref:'any',restDays:'yes',interests:['vip','sea','wellness','air']}
  };
  const p=presets[mode];if(!p)return;
  ['pace','road','startPref','restDays'].forEach(k=>{const el=form.querySelector(`[name="${k}"]`);if(el)el.value=p[k]});
  $$('[name="interests"]',form).forEach(el=>el.checked=p.interests.includes(el.value));
  savePrefs();
  $$('.tp-quick-card').forEach(b=>b.classList.toggle('is-active',b.dataset.quick===mode));
  showStatus('Travel style added. You can change every preference below.');
  $('#tripPreferences')?.scrollIntoView({behavior:'smooth',block:'start'});
}
function syncComparison(){detail=[...pool].slice(0,MAX_DETAIL);writeJSON(DETAIL_KEY,detail)}
function removeFromPool(h){pool=pool.filter(x=>x!==h);writeJSON(POOL_KEY,pool);syncComparison();renderAll()}
function readPrefs(){
  const form=$('#prefsForm');if(!form)return{};const fd=new FormData(form);return {travelStart:fd.get('travelStart')||'',travelEnd:fd.get('travelEnd')||'',adults:Number(fd.get('adults')||2),children:fd.get('children')||'',pregnant:fd.get('pregnant')==='yes',elderly:fd.get('elderly')==='yes',mobility:fd.get('mobility')==='yes',stroller:fd.get('stroller')==='yes',pace:fd.get('pace')||'balanced',road:fd.get('road')||'medium',startPref:fd.get('startPref')||'any',restDays:fd.get('restDays')==='yes',interests:fd.getAll('interests')};
}
function savePrefs(){const p=readPrefs();writeJSON(PREF_KEY,p);return p}
function hydratePrefs(){const p=readJSON(PREF_KEY,{});for(const [k,v] of Object.entries(p)){const els=$$(`[name="${k}"]`);if(!els.length)continue;if(Array.isArray(v)){els.forEach(e=>e.checked=v.includes(e.value))}else if(els[0].type==='radio'||els[0].type==='checkbox'){els.forEach(e=>e.checked=(e.value===String(v)||v===true&&e.value==='yes'))}else els[0].value=v}}
function youngestChild(children){const nums=(children||'').match(/\d+(?:\.\d+)?/g)?.map(Number)||[];return nums.length?Math.min(...nums):null}
function numericMinAge(text){const pats=[/minimum age\D{0,8}(\d+)/i,/children under\s*(\d+)\s*(?:are|is)?\s*(?:not|cannot|aren't)/i,/under\s*(\d+)\s*(?:years?)?\s*(?:not|cannot|aren't)/i,/from\s*(\d+)\s*years/i];for(const p of pats){const m=text.match(p);if(m)return Number(m[1])}return null}
function recommendTour(t,p){
  let score=70,reasons=[],warnings=[],blocked=[];const txt=(t.body||'').toLowerCase(),cat=(t.category||'').toLowerCase();
  const y=youngestChild(p.children),minAge=numericMinAge(t.body||'');if(y!=null&&minAge!=null&&y<minAge)blocked.push(`Minimum age appears to be ${minAge}+`);
  if(p.pregnant){if(/not suitable.{0,60}pregnan|pregnan.{0,60}not (?:allowed|recommended|suitable)/i.test(t.body||''))blocked.push('Source page says this activity is not suitable during pregnancy');else if(/pregnan/i.test(t.body||'')){warnings.push('Pregnancy requires checking the tour rules');score-=18}}
  if(p.mobility){if(/not wheelchair accessible|wheelchair access is not available/i.test(t.body||'')){warnings.push('Limited wheelchair accessibility');score-=25}else if(/stairs|climb|walking|uneven/i.test(txt)){warnings.push('May involve walking / uneven terrain');score-=10}}
  if(p.elderly&&/extreme|physically demanding|adrenaline|quad|buggy|rafting|skydive|paragliding/i.test(txt)){warnings.push('Higher activity level');score-=12}
  const pref=p.interests||[];const match=pref.some(i=>cat.includes(i)||txt.includes(i));if(match){score+=12;reasons.push('Matches your interests')}
  if(p.pace==='relaxed'){if(t.intensity==='Relaxed'){score+=12;reasons.push('Fits a relaxed pace')}else if(t.intensity==='Active / high')score-=12}
  if(p.pace==='active'){if(t.intensity==='Active / high'){score+=12;reasons.push('Fits an active pace')}else if(t.intensity==='Relaxed')score-=5}
  const fullDay=/full day|\b(?:9|10|11|12|13|14|15|16)\s*(?:hours?|h)\b|2-day|3-day/i.test((t.duration||'')+' '+txt);if(p.road==='low'&&fullDay){score-=12;warnings.push('Longer day / road time may be less suitable')}
  if(p.startPref==='late'&&/early|0[4-7]:\d\d|morning departure/i.test(txt)){score-=10;warnings.push('May require an early start')}
  if(/hotel transfer|transfer included|pickup.*hotel/i.test(txt)){score+=3;reasons.push('Hotel transfer indicated')}
  if(!reasons.length)reasons.push('Fits the selected tour pool');
  if(blocked.length)score=0;score=Math.max(0,Math.min(100,score));return {score,reasons,warnings,blocked};
}
async function analyze(){
  if(!pool.length)return showStatus('Select tours first.');
  const p=savePrefs();
  if(!p.travelStart||!p.travelEnd){
    showStatus('Add your holiday start and end dates first.');
    showGuide(2,{force:true,scroll:true});
    return;
  }
  showStatus('Reading the current tour pages…');
  const data=await Promise.all(pool.map(loadDetails));
  recommendations=data.map(t=>({...t,recommend:recommendTour(t,p)})).sort((a,b)=>b.recommend.score-a.recommend.score);
  renderRecommendations();renderComparison();renderSchedule();updateGuideNextButtons();
  showStatus('Recommendations updated from the current tour files.');
  guideWrite(3);showGuide(3,{force:true,scroll:true,delay:300});
}
function renderRecommendations(){
  const host=$('#recommendations');if(!recommendations.length){host.innerHTML='<div class="tp-empty"><strong>Ready for analysis</strong>Choose up to 4 tours you like most, add your travel details and press “Get recommendations”. We will rank the tours you selected.</div>';return}
  host.innerHTML=recommendations.map((t,i)=>`<article class="tp-rec"><img class="tp-rec-image" src="${escapeHTML(t.image)}" alt="${escapeHTML(t.title)}" onerror="this.src='logo.png'"><div class="tp-rank">${i+1}</div><div class="tp-rec-copy">${i===0&&!t.recommend.blocked.length?'<span class="tp-best-match">BEST MATCH</span>':''}<h3>${escapeHTML(t.title)}</h3><p>${escapeHTML(t.recommend.reasons.join(' · '))}</p><div class="tp-badges">${t.recommend.blocked.map(x=>`<span class="tp-badge stop">${escapeHTML(x)}</span>`).join('')}${t.recommend.warnings.map(x=>`<span class="tp-badge warn">${escapeHTML(x)}</span>`).join('')}${!t.recommend.blocked.length&&!t.recommend.warnings.length?'<span class="tp-badge">No conflict found in parsed rules</span>':''}</div></div><div class="tp-score">${t.recommend.blocked.length?'CHECK RULES':t.recommend.score+'/100'}</div></article>`).join('');
}
function short(v,n=150){v=clean(v);return v.length>n?v.slice(0,n-1)+'…':v||'See tour page'}
async function renderComparison(){
  const count=$('#detailCount');count.textContent=`${detail.length}/${MAX_DETAIL}`;const host=$('#comparisonHost');
  if(detail.length<MIN_DETAIL){host.innerHTML=`<div class="tp-empty"><strong>Add at least 2 tours to compare</strong>Your category selections automatically appear here. Choose up to 4 favorites and we will build one analytical comparison table.</div>`;return}
  host.innerHTML='<div class="tp-loading">Loading current tour details…</div>';
  const data=await Promise.all(detail.map(loadDetails));
  const rows=[['Price',t=>t.price],['Duration',t=>t.duration],['Transfer',t=>t.transfer],['Meals',t=>t.meals],['Child / age policy',t=>short(t.child,180)],['Intensity',t=>t.intensity],['Pregnancy / health notes',t=>short([...t.pregnancy,...t.restrictions].join(' · '),210)],['What to bring',t=>short(t.bring.join(' · '),230)]];
  host.innerHTML=`<div class="tp-compare-wrap"><table class="tp-compare"><thead><tr><th>COMPARE</th>${data.map(t=>`<th><img src="${escapeHTML(t.image)}" onerror="this.src='logo.png'" alt="${escapeHTML(t.title)}">${escapeHTML(t.title)}</th>`).join('')}</tr></thead><tbody>${rows.map(([label,fn],ri)=>`<tr><td>${label}</td>${data.map(t=>`<td class="${ri===0?'gold':''}">${escapeHTML(fn(t))}</td>`).join('')}</tr>`).join('')}<tr><td>Source</td>${data.map(t=>`<td><a href="${escapeHTML(t.href)}" style="color:var(--gold2);font-weight:900">Open current tour page →</a></td>`).join('')}</tr></tbody></table></div><div class="tp-source-note">Comparison data is read from the current tour/card files. If a source page does not state a fact clearly, the planner shows “See tour page” instead of inventing it.</div>`;
}
function dateRange(start,end){if(!start||!end)return[];let a=new Date(start+'T12:00:00'),b=new Date(end+'T12:00:00');if(isNaN(a)||isNaN(b)||b<a)return[];const arr=[];for(let d=new Date(a);d<=b&&arr.length<45;d.setDate(d.getDate()+1))arr.push(new Date(d));return arr}
function fmtDate(d){return d.toISOString().slice(0,10)}function niceDate(s){if(!s)return'';try{return new Intl.DateTimeFormat('en',{weekday:'short',day:'numeric',month:'short'}).format(new Date(s+'T12:00:00'))}catch(_){return s}}
async function renderSchedule(){
  const host=$('#scheduleHost');if(!detail.length){host.innerHTML='<div class="tp-empty"><strong>No tours selected yet</strong>Choose up to 4 favorites from the categories above.</div>';return}
  const p=readPrefs(),days=dateRange(p.travelStart,p.travelEnd);if(!days.length){host.innerHTML='<div class="tp-empty"><strong>Add your travel dates</strong>The planner will distribute your chosen tours across your holiday dates.</div>';return}
  const saved=readJSON(SCHEDULE_KEY,{}),step=p.restDays?2:1;let idx=0;
  const data=await Promise.all(detail.map(loadDetails));
  host.innerHTML='<div class="tp-schedule">'+data.map((t,i)=>{let date=saved[t.href]||fmtDate(days[Math.min(idx,days.length-1)]);idx+=step;return `<div class="tp-schedule-row"><div class="tp-schedule-day">${escapeHTML(niceDate(date))}</div><div><div class="tp-schedule-title">${escapeHTML(t.title)}</div><div style="color:#9eb0bd;font-size:10px;margin-top:4px">${escapeHTML(t.duration)} · ${escapeHTML(t.intensity)}</div></div><input class="tp-input" type="date" min="${escapeHTML(p.travelStart)}" max="${escapeHTML(p.travelEnd)}" value="${escapeHTML(date)}" data-schedule="${escapeHTML(t.href)}"></div>`}).join('')+'</div>';
  $$('[data-schedule]',host).forEach(inp=>inp.onchange=()=>{const s=readJSON(SCHEDULE_KEY,{});s[inp.dataset.schedule]=inp.value;writeJSON(SCHEDULE_KEY,s);renderSchedule();updateRequestTours()});
  const today=new Date();today.setHours(0,0,0,0);const start=new Date(p.travelStart+'T00:00:00');const diff=Math.round((start-today)/86400000);
  $('#weatherNote').innerHTML=diff>14?'<strong>Weather layer:</strong> Live weather recommendations will become available closer to your travel dates.':'<strong>Weather layer:</strong> The itinerary is ready for live weather checks. A commercial weather provider has not been connected yet, so no forecast values are invented.';
}
async function renderWhatToBring(){
  const host=$('#bringHost');if(!host)return;
  if(!detail.length){host.innerHTML='<div class="tp-empty" style="grid-column:1/-1"><strong>Your packing guide will appear here</strong>Choose your tours first. Each selected tour keeps its own original requirements.</div>';return}
  host.innerHTML='<div class="tp-loading" style="grid-column:1/-1">Preparing tour-specific checklists…</div>';
  const data=await Promise.all(detail.map(loadDetails));
  host.innerHTML=data.map(t=>{const items=t.bring?.length?t.bring:['See the original tour page for the confirmed packing list.'];return `<article class="tp-bring-card"><div class="tp-bring-image"><img src="${escapeHTML(t.image)}" alt="${escapeHTML(t.title)}" onerror="this.src='logo.png'"></div><div class="tp-bring-copy"><span>${escapeHTML(t.category)}</span><h3>${escapeHTML(t.title)}</h3><ul>${items.slice(0,7).map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul><a href="${escapeHTML(t.href)}">Open original tour rules →</a></div></article>`}).join('');
}
function showStatus(msg){const el=$('#plannerStatus');el.textContent=msg;el.style.opacity='1';clearTimeout(showStatus.t);showStatus.t=setTimeout(()=>el.style.opacity='.55',3500)}
function updateFinal(){const b=$('#choiceBtn');b.disabled=detail.length<1;b.querySelector('small').textContent=detail.length?`${detail.length} selected tour${detail.length===1?'':'s'} · open request form`:'Choose your tours first'}
function openRequest(){if(!detail.length)return;updateRequestTours();$('#requestModal').classList.add('open');$('#requestModal').setAttribute('aria-hidden','false')}
function closeRequest(){$('#requestModal').classList.remove('open');$('#requestModal').setAttribute('aria-hidden','true')}
async function updateRequestTours(){const host=$('#requestTours');if(!host)return;const p=readPrefs(),schedule=readJSON(SCHEDULE_KEY,{});const data=await Promise.all(detail.map(loadDetails));host.innerHTML=data.map(t=>`<div class="tp-request-tour"><strong>${escapeHTML(t.title)}</strong><input class="tp-input" type="date" name="tourDate__${escapeHTML(t.href)}" min="${escapeHTML(p.travelStart||'')}" max="${escapeHTML(p.travelEnd||'')}" value="${escapeHTML(schedule[t.href]||'')}"></div>`).join('')}
async function sendRequest(e){
  e.preventDefault();const fd=new FormData(e.currentTarget),p=readPrefs(),data=await Promise.all(detail.map(loadDetails));
  const lines=data.map((t,i)=>`${i+1}. ${t.title} — ${fd.get('tourDate__'+t.href)||'date to confirm'}`);
  const msg=[`ALANYA TOUR ORGANIZATIONS — TRIP PLANNER REQUEST`,``,`Selected tours:`,...lines,``,`Guest: ${fd.get('name')||'-'}`,`WhatsApp: ${fd.get('phone')||'-'}`,`Hotel: ${fd.get('hotel')||'-'}`,`Room: ${fd.get('room')||'-'}`,`Adults: ${fd.get('adults')||p.adults||'-'}`,`Children / ages: ${fd.get('children')||p.children||'No'}`,`Pregnancy: ${fd.get('pregnant')|| (p.pregnant?'Yes':'No')}`,`Elderly guests: ${fd.get('elderly')|| (p.elderly?'Yes':'No')}`,`Stroller / mobility: ${fd.get('mobility')||'-'}`,`Language: ${fd.get('language')||'English'}`,`Notes: ${fd.get('notes')||'-'}`,``,`Please confirm availability, pickup time and final price.`].join('\n');
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,'_blank','noopener');
}

function initProgressNav(){
  const nav=$('.tp-progress');if(!nav)return;
  const links=$$('a[href^="#"]',nav);
  const items=links.map(a=>({a,id:a.getAttribute('href').slice(1),el:document.getElementById(a.getAttribute('href').slice(1))})).filter(x=>x.el);
  links.forEach(a=>a.addEventListener('click',e=>{
    const id=a.getAttribute('href').slice(1),el=document.getElementById(id);
    if(!el)return;
    e.preventDefault();
    el.scrollIntoView({behavior:'smooth',block:'start'});
    history.replaceState(null,'','#'+id);
  }));
  const setActive=()=>{
    const y=window.scrollY+210;let current=items[0];
    items.forEach(item=>{if(item.el.offsetTop<=y)current=item});
    items.forEach(item=>item.a.classList.toggle('is-active',item===current));
  };
  window.addEventListener('scroll',setActive,{passive:true});
  setActive();
}

function renderAll(){renderPool();renderRecommendations();renderComparison();renderSchedule();renderWhatToBring();updateFinal();ensureGuideNextButtons();updateGuideNextButtons()}
async function init(){
  initProgressNav();hydratePrefs();$('#poolGrid').innerHTML='<div class="tp-loading" style="grid-column:1/-1">Reading current tour cards…</div>';
  await loadRegistry();pool=pool.filter(h=>registry.has(h)||h.endsWith('.html')).slice(0,MAX_POOL);writeJSON(POOL_KEY,pool);syncComparison();renderAll();renderCategoryCounts();
  $$('.tp-quick-card').forEach(btn=>btn.addEventListener('click',()=>applyQuickStart(btn.dataset.quick)));
  $$('[data-reset-planner]').forEach(btn=>btn.addEventListener('click',openResetDialog));
  $('#prefsForm').addEventListener('change',()=>{savePrefs();renderSchedule();updateGuideNextButtons()});
  $('#analyzeBtn').onclick=analyze;$('#choiceBtn').onclick=openRequest;$('#closeRequest').onclick=closeRequest;$('#requestModal').onclick=e=>{if(e.target.id==='requestModal')closeRequest()};$('#requestForm').onsubmit=sendRequest;
  $('#shareBtn').onclick=async()=>{const data=await Promise.all((detail.length?detail:pool).map(loadDetails));const text=`ALANYA TOUR ORGANIZATIONS — Trip Planner\n${data.map((t,i)=>`${i+1}. ${t.title} — ${t.price}`).join('\n')}`;if(navigator.share){try{await navigator.share({title:'ALANYA TOUR ORGANIZATIONS — Trip Planner',text,url:location.href});return}catch(_){}}window.open(`https://wa.me/?text=${encodeURIComponent(text+'\n'+location.href)}`,'_blank','noopener')};
  startGuidedJourney();
}
document.addEventListener('DOMContentLoaded',init);
})();
