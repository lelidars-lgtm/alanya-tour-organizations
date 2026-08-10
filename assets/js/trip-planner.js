(() => {
'use strict';
const POOL_KEY='atoTripPlannerPool', DETAIL_KEY='atoTripPlannerDetail', PREF_KEY='atoTripPlannerPrefs', SCHEDULE_KEY='atoTripPlannerSchedule';
const MAX_POOL=8, MAX_DETAIL=4, MIN_DETAIL=2;
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
let detail=[...new Set(readJSON(DETAIL_KEY,[]).map(normalizeHref).filter(h=>pool.includes(h)))].slice(0,MAX_DETAIL);
let registry=new Map(), detailsCache=new Map(), recommendations=[];
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
  if(!pool.length){host.innerHTML=`<div class="tp-empty" style="grid-column:1/-1"><strong>No tours selected yet</strong>Open any category and press <b>＋ Compare</b> on the tour cards. <a href="index.html#main-categories">Browse tours →</a></div>`;return}
  host.innerHTML=pool.map(h=>{const t=registry.get(h)||{href:h,title:h.replace('.html','').replace(/-/g,' '),image:'logo.png',price:'Loading…',desc:'',category:'Tour'};const selected=detail.includes(h);return `<article class="tp-card" data-href="${escapeHTML(h)}"><div class="tp-card-img"><img src="${escapeHTML(t.image)}" alt="${escapeHTML(t.title)}" onerror="this.src='logo.png'"><span class="tp-cat">${escapeHTML(t.category)}</span><button type="button" class="tp-detail-pick ${selected?'selected':''}" data-detail="${escapeHTML(h)}">${selected?'✓ Compare':'＋ Detailed compare'}</button></div><div class="tp-card-body"><h3>${escapeHTML(t.title)}</h3><div class="tp-price">${escapeHTML(t.price)}</div><div class="tp-desc">${escapeHTML(t.desc)}</div><div class="tp-card-actions"><a href="${escapeHTML(h)}">View tour →</a><span class="spacer"></span><button class="tp-remove" type="button" data-remove="${escapeHTML(h)}">Remove</button></div></div></article>`}).join('');
  $$('#poolGrid [data-remove]').forEach(b=>b.onclick=()=>removeFromPool(b.dataset.remove));
  $$('#poolGrid [data-detail]').forEach(b=>b.onclick=()=>toggleDetail(b.dataset.detail));
}
function removeFromPool(h){pool=pool.filter(x=>x!==h);detail=detail.filter(x=>x!==h);writeJSON(POOL_KEY,pool);writeJSON(DETAIL_KEY,detail);renderAll()}
function toggleDetail(h){
  if(detail.includes(h))detail=detail.filter(x=>x!==h);else if(detail.length<MAX_DETAIL)detail.push(h);else return showStatus('Choose no more than 4 tours for detailed comparison.');
  writeJSON(DETAIL_KEY,detail);renderPool();renderComparison();renderSchedule();updateFinal();
}
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
  if(!pool.length)return showStatus('Select tours first.');const p=savePrefs();showStatus('Reading the current tour pages…');
  const data=await Promise.all(pool.map(loadDetails));recommendations=data.map(t=>({...t,recommend:recommendTour(t,p)})).sort((a,b)=>b.recommend.score-a.recommend.score);renderRecommendations();renderComparison();renderSchedule();showStatus('Recommendations updated from the current tour files.');
}
function renderRecommendations(){
  const host=$('#recommendations');if(!recommendations.length){host.innerHTML='<div class="tp-empty"><strong>Ready for analysis</strong>Fill in your travel details and press “Get recommendations”. Planner recommends; you decide which 2–4 tours to compare.</div>';return}
  host.innerHTML=recommendations.map((t,i)=>`<article class="tp-rec"><div class="tp-rank">${i+1}</div><div><h3>${escapeHTML(t.title)}</h3><p>${escapeHTML(t.recommend.reasons.join(' · '))}</p><div class="tp-badges">${t.recommend.blocked.map(x=>`<span class="tp-badge stop">${escapeHTML(x)}</span>`).join('')}${t.recommend.warnings.map(x=>`<span class="tp-badge warn">${escapeHTML(x)}</span>`).join('')}${!t.recommend.blocked.length&&!t.recommend.warnings.length?'<span class="tp-badge">No conflict found in parsed rules</span>':''}</div></div><div class="tp-score">${t.recommend.blocked.length?'CHECK RULES':t.recommend.score+'/100'}</div></article>`).join('');
}
function short(v,n=150){v=clean(v);return v.length>n?v.slice(0,n-1)+'…':v||'See tour page'}
async function renderComparison(){
  const count=$('#detailCount');count.textContent=`${detail.length}/${MAX_DETAIL}`;const host=$('#comparisonHost');
  if(detail.length<MIN_DETAIL){host.innerHTML=`<div class="tp-empty"><strong>Select 2–4 tours yourself</strong>Use the “Detailed compare” control on the selected tour cards. Recommendations do not choose the comparison set for you.</div>`;return}
  host.innerHTML='<div class="tp-loading">Loading current tour details…</div>';
  const data=await Promise.all(detail.map(loadDetails));
  const rows=[['Price',t=>t.price],['Duration',t=>t.duration],['Transfer',t=>t.transfer],['Meals',t=>t.meals],['Child / age policy',t=>short(t.child,180)],['Intensity',t=>t.intensity],['Pregnancy / health notes',t=>short([...t.pregnancy,...t.restrictions].join(' · '),210)],['What to bring',t=>short(t.bring.join(' · '),230)]];
  host.innerHTML=`<div class="tp-compare-wrap"><table class="tp-compare"><thead><tr><th>COMPARE</th>${data.map(t=>`<th><img src="${escapeHTML(t.image)}" onerror="this.src='logo.png'" alt="${escapeHTML(t.title)}">${escapeHTML(t.title)}</th>`).join('')}</tr></thead><tbody>${rows.map(([label,fn],ri)=>`<tr><td>${label}</td>${data.map(t=>`<td class="${ri===0?'gold':''}">${escapeHTML(fn(t))}</td>`).join('')}</tr>`).join('')}<tr><td>Source</td>${data.map(t=>`<td><a href="${escapeHTML(t.href)}" style="color:var(--gold2);font-weight:900">Open current tour page →</a></td>`).join('')}</tr></tbody></table></div><div class="tp-source-note">Comparison data is read from the current tour/card files. If a source page does not state a fact clearly, the planner shows “See tour page” instead of inventing it.</div>`;
}
function dateRange(start,end){if(!start||!end)return[];let a=new Date(start+'T12:00:00'),b=new Date(end+'T12:00:00');if(isNaN(a)||isNaN(b)||b<a)return[];const arr=[];for(let d=new Date(a);d<=b&&arr.length<45;d.setDate(d.getDate()+1))arr.push(new Date(d));return arr}
function fmtDate(d){return d.toISOString().slice(0,10)}function niceDate(s){if(!s)return'';try{return new Intl.DateTimeFormat('en',{weekday:'short',day:'numeric',month:'short'}).format(new Date(s+'T12:00:00'))}catch(_){return s}}
async function renderSchedule(){
  const host=$('#scheduleHost');if(!detail.length){host.innerHTML='<div class="tp-empty"><strong>No final shortlist yet</strong>Select tours for detailed comparison first.</div>';return}
  const p=readPrefs(),days=dateRange(p.travelStart,p.travelEnd);if(!days.length){host.innerHTML='<div class="tp-empty"><strong>Add your travel dates</strong>The planner will distribute your chosen tours across your holiday dates.</div>';return}
  const saved=readJSON(SCHEDULE_KEY,{}),step=p.restDays?2:1;let idx=0;
  const data=await Promise.all(detail.map(loadDetails));
  host.innerHTML='<div class="tp-schedule">'+data.map((t,i)=>{let date=saved[t.href]||fmtDate(days[Math.min(idx,days.length-1)]);idx+=step;return `<div class="tp-schedule-row"><div class="tp-schedule-day">${escapeHTML(niceDate(date))}</div><div><div class="tp-schedule-title">${escapeHTML(t.title)}</div><div style="color:#9eb0bd;font-size:10px;margin-top:4px">${escapeHTML(t.duration)} · ${escapeHTML(t.intensity)}</div></div><input class="tp-input" type="date" min="${escapeHTML(p.travelStart)}" max="${escapeHTML(p.travelEnd)}" value="${escapeHTML(date)}" data-schedule="${escapeHTML(t.href)}"></div>`}).join('')+'</div>';
  $$('[data-schedule]',host).forEach(inp=>inp.onchange=()=>{const s=readJSON(SCHEDULE_KEY,{});s[inp.dataset.schedule]=inp.value;writeJSON(SCHEDULE_KEY,s);renderSchedule();updateRequestTours()});
  const today=new Date();today.setHours(0,0,0,0);const start=new Date(p.travelStart+'T00:00:00');const diff=Math.round((start-today)/86400000);
  $('#weatherNote').innerHTML=diff>14?'<strong>Weather layer:</strong> Live weather recommendations will become available closer to your travel dates.':'<strong>Weather layer:</strong> The itinerary is ready for live weather checks. A commercial weather provider has not been connected yet, so no forecast values are invented.';
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
function renderAll(){renderPool();renderRecommendations();renderComparison();renderSchedule();updateFinal()}
async function init(){
  hydratePrefs();$('#poolGrid').innerHTML='<div class="tp-loading" style="grid-column:1/-1">Reading current tour cards…</div>';
  await loadRegistry();pool=pool.filter(h=>registry.has(h)||h.endsWith('.html'));writeJSON(POOL_KEY,pool);detail=detail.filter(h=>pool.includes(h)).slice(0,MAX_DETAIL);writeJSON(DETAIL_KEY,detail);renderAll();
  $('#prefsForm').addEventListener('change',()=>{savePrefs();renderSchedule()});$('#analyzeBtn').onclick=analyze;$('#choiceBtn').onclick=openRequest;$('#closeRequest').onclick=closeRequest;$('#requestModal').onclick=e=>{if(e.target.id==='requestModal')closeRequest()};$('#requestForm').onsubmit=sendRequest;
  $('#shareBtn').onclick=async()=>{const data=await Promise.all((detail.length?detail:pool).map(loadDetails));const text=`ALANYA TOUR ORGANIZATIONS — Trip Planner\n${data.map((t,i)=>`${i+1}. ${t.title} — ${t.price}`).join('\n')}`;if(navigator.share){try{await navigator.share({title:'ALANYA TOUR ORGANIZATIONS — Trip Planner',text,url:location.href});return}catch(_){}}window.open(`https://wa.me/?text=${encodeURIComponent(text+'\n'+location.href)}`,'_blank','noopener')};
  if(pool.length)analyze();
}
document.addEventListener('DOMContentLoaded',init);
})();
