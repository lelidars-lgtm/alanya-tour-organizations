/* ALANYA TOUR ORGANIZATIONS — AI Travel Sales Agent V7
   Vercel route: /api/ato-assistant
   - verified ATO knowledge
   - live weather tool
   - tour search / compare / deterministic price estimate
   - Group & Event Offer calculator
   - structured lead profile for manager handoff
   - indecision rescue -> AI-built holiday itinerary -> Trip Planner
   - price-objection rescue -> Special Offers check -> lower-budget rebuild
   - Popular Tours collection + Combo Deals catalog (non-stackable by default)
   - VIP Event Concierge: event brief -> bespoke schedule -> ATO Manager
   - never confirms availability/payment on its own
*/

const OPENAI_URL = 'https://api.openai.com/v1/responses';
const MODEL_FAST = process.env.OPENAI_MODEL_FAST || 'gpt-5.6-luna';
const MODEL_BALANCED = process.env.OPENAI_MODEL_BALANCED || 'gpt-5.6-terra';
const MODEL_REASONING = process.env.OPENAI_MODEL_REASONING || 'gpt-5.6-sol';
const WEATHER_PROVIDER = (process.env.ATO_WEATHER_PROVIDER || 'open-meteo').toLowerCase();
const OPEN_METEO_HOST = process.env.OPEN_METEO_HOST || 'https://api.open-meteo.com';
const OPEN_METEO_GEO_HOST = process.env.OPEN_METEO_GEO_HOST || 'https://geocoding-api.open-meteo.com';
const OPEN_METEO_API_KEY = process.env.OPEN_METEO_API_KEY || '';

let KNOWLEDGE={items:[]};
try{ KNOWLEDGE=require('./_data/ato-knowledge.json'); }catch(e){ console.error('ATO knowledge load failed',e?.message||e); }

const OFFER_DISCOUNTS=Object.freeze({
  'Sea Experiences':15,
  'Nature & Adventure':20,
  'Extreme & Adventure':10,
  'Family Experiences':15,
  'History & Culture':20,
  'Water Sports':13,
  'Air Experiences':17,
  'Wellness & Relax':15,
  'VIP Services':20
});

const POPULAR_IDS=Object.freeze(new Set(['pirate-yacht','green-canyon','jeep-safari','sapadere-canyon','land-of-legends','cappadocia','pamukkale-salda','turkish-hammam','paragliding']));
const NON_STACKABLE_CATEGORIES=Object.freeze(new Set(['Combo Deals']));

const MAX_MESSAGE=1200, MAX_HISTORY=10, MAX_BODY_BYTES=42_000;
const RATE_WINDOW_MS=10*60*1000, RATE_MAX=28;
const rate=globalThis.__ATO_SALES_AGENT_RATE__ || new Map();
globalThis.__ATO_SALES_AGENT_RATE__=rate;

function clean(v,limit=2000){ return String(v??'').replace(/\u0000/g,'').trim().slice(0,limit); }

function detectMessageLanguage(message, siteLanguage='en', clientHint=''){
  const text=clean(message,MAX_MESSAGE);
  const hint=clean(clientHint,24).toLowerCase();
  if(hint && hint!=='auto' && /^[a-z]{2,3}(?:-[a-z0-9]{2,8})?$/i.test(hint)) return hint;

  if(/[\u3040-\u30ff]/u.test(text)) return 'ja';
  if(/[\uac00-\ud7af]/u.test(text)) return 'ko';
  if(/[\u4e00-\u9fff]/u.test(text)) return 'zh';
  if(/[\u0600-\u06ff]/u.test(text)) return 'ar';
  if(/[\u0590-\u05ff]/u.test(text)) return 'he';
  if(/[\u0370-\u03ff]/u.test(text)) return 'el';
  if(/[\u0900-\u097f]/u.test(text)) return 'hi';
  if(/[\u0e00-\u0e7f]/u.test(text)) return 'th';
  if(/[\u10a0-\u10ff]/u.test(text)) return 'ka';
  if(/[\u0530-\u058f]/u.test(text)) return 'hy';
  if(/[іїєґІЇЄҐ]/u.test(text)) return 'uk';
  if(/[А-Яа-яЁё]/u.test(text)) return 'ru';

  const normalized=` ${text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z]+/g,' ')} `;
  const score=(words)=>words.reduce((n,w)=>n+(normalized.includes(` ${w} `)?1:0),0);
  const scores={
    fr:score(['bonjour','salut','je','nous','voudrais','veux','avec','pour','combien','prix','anniversaire','voyage','excursion','merci']),
    es:score(['hola','yo','nosotros','quiero','queremos','con','para','cuanto','precio','cumpleanos','viaje','excursion','gracias']),
    it:score(['ciao','io','noi','voglio','vorrei','con','per','quanto','prezzo','compleanno','viaggio','escursione','grazie']),
    pt:score(['ola','eu','nos','quero','queremos','com','para','quanto','preco','aniversario','viagem','passeio','obrigado']),
    nl:score(['hallo','ik','wij','wil','willen','met','voor','hoeveel','prijs','verjaardag','reis','excursie','bedankt']),
    ro:score(['buna','eu','noi','vreau','vrem','cu','pentru','cat','pret','ziua','excursie','multumesc']),
    cs:score(['ahoj','ja','my','chci','chceme','pro','kolik','cena','narozeniny','vylet','dekuji']),
    sv:score(['hej','jag','vi','vill','med','for','hur','pris','fodelsedag','resa','utflykt','tack']),
    da:score(['hej','jeg','vi','vil','med','for','hvor','pris','fodselsdag','rejse','udflugt','tak']),
    no:score(['hei','jeg','vi','vil','med','for','hvor','pris','bursdag','reise','utflukt','takk']),
    de:score(['hallo','ich','wir','mochte','moechte','wollen','mit','fur','fuer','wieviel','preis','geburtstag','reise','ausflug','danke']),
    tr:score(['merhaba','ben','biz','istiyorum','istiyoruz','ile','icin','fiyat','dogum','gunu','tur','tesekkur']),
    pl:score(['czesc','ja','my','chce','chcemy','dla','ile','cena','urodziny','wycieczka','dziekuje']),
    en:score(['hello','hi','want','would','with','for','how','much','price','birthday','trip','tour','thanks'])
  };
  const ranked=Object.entries(scores).sort((a,b)=>b[1]-a[1]);
  if(ranked[0][1]>=2 && ranked[0][1]>ranked[1][1]) return ranked[0][0];
  return 'auto';
}

function send(res,status,body){ res.statusCode=status; res.setHeader('Content-Type','application/json; charset=utf-8'); res.setHeader('Cache-Control','no-store'); res.setHeader('X-Content-Type-Options','nosniff'); res.end(JSON.stringify(body)); }
function clientIp(req){ const f=clean(req.headers['x-forwarded-for']||'',256); return f?f.split(',')[0].trim():clean(req.headers['x-real-ip']||req.socket?.remoteAddress||'unknown',128); }
function allowRequest(req){ const now=Date.now(), ip=clientIp(req), cur=rate.get(ip); if(!cur||now-cur.start>RATE_WINDOW_MS){rate.set(ip,{start:now,count:1});return true;} cur.count++; rate.set(ip,cur); return cur.count<=RATE_MAX; }
function normalizeHistory(x){ if(!Array.isArray(x))return[]; return x.slice(-MAX_HISTORY).map(m=>({role:m?.role==='assistant'?'assistant':'user',content:clean(m?.text??m?.content??'',1800)})).filter(x=>x.content); }
function tokens(v){ return [...new Set(clean(v,16000).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').match(/[a-z0-9а-яёğüşöçıąćęłńóśźż€]+/gi)||[])].filter(x=>x.length>2); }
function basename(v){ return clean(v,400).split('/').filter(Boolean).pop()?.replace(/\.html?$/i,'')||''; }
function knowledgeItems(){ return Array.isArray(KNOWLEDGE?.items)?KNOWLEDGE.items:[]; }
function itemUrl(item){ const s=clean(item?.source_file,400); return s?('/'+s.replace(/^\/+/,'')):''; }
function findItem(ref){ const q=clean(ref,300).toLowerCase(); if(!q)return null; return knowledgeItems().find(x=>{ const id=clean(x.id,200).toLowerCase(), title=clean(x.title,250).toLowerCase(), src=basename(x.source_file).toLowerCase(); return q===id||q===src||title===q||title.includes(q)||q.includes(title); })||null; }

function structuredPage(page){ return {
  mode:clean(page?.mode,40), title:clean(page?.title,300), path:clean(page?.path,300), description:clean(page?.description,700),
  current_tour:page?.current_tour&&typeof page.current_tour==='object'?{id:clean(page.current_tour.id,180),name:clean(page.current_tour.name,220),url:clean(page.current_tour.url,300)}:null,
  selected_tours:Array.isArray(page?.selected_tours)?page.selected_tours.slice(0,8).map(x=>clean(x,220)):[],
  ticket:page?.ticket&&typeof page.ticket==='object'?{tour:clean(page.ticket.tour,220),date:clean(page.ticket.date,140),pickup:clean(page.ticket.pickup,220),time:clean(page.ticket.time,120),guests:clean(page.ticket.guests,180),hotel:clean(page.ticket.hotel,220)}:null,
  offer:page?.offer&&typeof page.offer==='object'?{group_guests:clean(page.offer.group_guests,80),group_total:clean(page.offer.group_total,100),heart_discount:clean(page.offer.heart_discount,100),heart_price:clean(page.offer.heart_price,140)}:null,
  visible_text:clean(page?.visible_text,3800)
}; }

function normalizeAgentState(state){
  const p=state&&typeof state==='object'&&state.lead_profile&&typeof state.lead_profile==='object'?state.lead_profile:{};
  return {
    lead_profile:{
      adults:Number.isInteger(p.adults)?Math.max(0,Math.min(30,p.adults)):null,
      children_count:Number.isInteger(p.children_count)?Math.max(0,Math.min(20,p.children_count)):(Array.isArray(p.children_ages)&&p.children_ages.length?p.children_ages.length:null),
      children_ages:Array.isArray(p.children_ages)?p.children_ages.slice(0,12).map(Number).filter(x=>Number.isInteger(x)&&x>=0&&x<=17):[],
      hotel:clean(p.hotel,220)||null,
      preferred_dates:Array.isArray(p.preferred_dates)?p.preferred_dates.slice(0,16).map(x=>clean(x,40)).filter(Boolean):[],
      budget_amount:Number.isFinite(Number(p.budget_amount))?Number(p.budget_amount):null,
      budget_currency:clean(p.budget_currency,12)||null,
      preferences:Array.isArray(p.preferences)?p.preferences.slice(0,16).map(x=>clean(x,100)).filter(Boolean):[],
      mobility_notes:clean(p.mobility_notes,260)||null,
      selected_tour_ids:Array.isArray(p.selected_tour_ids)?p.selected_tour_ids.slice(0,8).map(x=>clean(x,180)).filter(Boolean):[]
    },
    recommendations:Array.isArray(state?.recommendations)?state.recommendations.slice(0,4).map(x=>({id:clean(x?.id,180),title:clean(x?.title,220),url:clean(x?.url,300)})):[],
    weather:state?.weather&&typeof state.weather==='object'?{location:clean(state.weather.location,160),best_weather_day:clean(state.weather.best_weather_day,40)}:null,
    itinerary:state?.itinerary&&typeof state.itinerary==='object'?{status:clean(state.itinerary.status,30),title:clean(state.itinerary.title,180),days:Array.isArray(state.itinerary.days)?state.itinerary.days.slice(0,14).map(d=>({date:clean(d?.date,40),type:clean(d?.type,20),tour_id:clean(d?.tour_id,180),title:clean(d?.title,220)})):[]}:null,
    offer_rescue:state?.offer_rescue&&typeof state.offer_rescue==='object'?{
      status:clean(state.offer_rescue.status,30),
      original_total_eur:Number.isFinite(Number(state.offer_rescue.original_total_eur))?Number(state.offer_rescue.original_total_eur):null,
      discounted_total_eur:Number.isFinite(Number(state.offer_rescue.discounted_total_eur))?Number(state.offer_rescue.discounted_total_eur):null,
      savings_eur:Number.isFinite(Number(state.offer_rescue.savings_eur))?Number(state.offer_rescue.savings_eur):null,
      note:clean(state.offer_rescue.note,500),
      offer_url:clean(state.offer_rescue.offer_url,300)
    }:null,
    event_profile:state?.event_profile&&typeof state.event_profile==='object'?{
      event_type:clean(state.event_profile.event_type,80)||null,event_date:clean(state.event_profile.event_date,40)||null,
      guest_count:Number.isInteger(state.event_profile.guest_count)?Math.max(1,Math.min(100,state.event_profile.guest_count)):null,
      occasion_for:clean(state.event_profile.occasion_for,120)||null,style:clean(state.event_profile.style,160)||null,
      must_haves:Array.isArray(state.event_profile.must_haves)?state.event_profile.must_haves.slice(0,12).map(x=>clean(x,120)).filter(Boolean):[],
      avoid:Array.isArray(state.event_profile.avoid)?state.event_profile.avoid.slice(0,12).map(x=>clean(x,120)).filter(Boolean):[],
      privacy_level:clean(state.event_profile.privacy_level,80)||null,surprise:Boolean(state.event_profile.surprise),
      photo_video:clean(state.event_profile.photo_video,120)||null,transport:clean(state.event_profile.transport,120)||null
    }:null,
    event_plan:state?.event_plan&&typeof state.event_plan==='object'?{
      status:clean(state.event_plan.status,30),title:clean(state.event_plan.title,180),summary:clean(state.event_plan.summary,700),
      components:Array.isArray(state.event_plan.components)?state.event_plan.components.slice(0,8).map(c=>({service_id:clean(c?.service_id,180),title:clean(c?.title,220),url:clean(c?.url,300),time:clean(c?.time,80),role:clean(c?.role,140),reason:clean(c?.reason,360),price_label:clean(c?.price_label,180),confidence:clean(c?.confidence,40)})):[],
      alternatives:Array.isArray(state.event_plan.alternatives)?state.event_plan.alternatives.slice(0,3).map(a=>({name:clean(a?.name,100),description:clean(a?.description,300),changes:clean(a?.changes,300)})):[],
      budget_note:clean(state.event_plan.budget_note,500),disclaimer:clean(state.event_plan.disclaimer,500)
    }:null,
    decision_turns_without_selection:Math.max(0,Math.min(8,Number(state?.decision_turns_without_selection)||0)),
    itinerary_offer_shown:Boolean(state?.itinerary_offer_shown),
    price_rescue_shown:Boolean(state?.price_rescue_shown),
    next_action:clean(state?.next_action,60)
  };
}

function chooseModel(message,page){ const m=clean(message,1400).toLowerCase(), mode=clean(page?.mode,40).toLowerCase(); if(['planner','compare'].includes(mode)||/compare|сравн|karşılaştır|vergleich|porówn|budget|бюджет|itiner|маршрут|plan|event|мероприят|день рожд|birthday|proposal|предложен|anniversary|wedding|свадьб|celebrat|vip/.test(m)) return MODEL_REASONING; if(['tour','offer','booking','ticket','map'].includes(mode)||/weather|погод|wetter|hava|pogod|price|цена|fiyat|preis|cena|child|дет|transfer|pickup/.test(m)) return MODEL_BALANCED; return MODEL_FAST; }

function knowledgeMatches(message,page){ const query=[message,page?.title,page?.path,page?.current_tour?.name,page?.current_tour?.id,...(page?.selected_tours||[])].filter(Boolean).join(' '), q=tokens(query); if(!q.length)return[]; return knowledgeItems().map(item=>{ const title=clean(item.title,240).toLowerCase(), hay=clean([item.title,item.category,item.description,item.details,item.price,item.child_policy,item.highlights,item.search_text].join(' '),30000).toLowerCase(); let score=0; const id=clean(item.id,180).toLowerCase(), source=basename(item.source_file).toLowerCase(); const curId=clean(page?.current_tour?.id,180).toLowerCase(), curName=clean(page?.current_tour?.name,220).toLowerCase(); if(curId&&(id===curId||source===curId))score+=120; if(curName&&title&&(title.includes(curName)||curName.includes(title)))score+=100; for(const t of q){if(title.includes(t))score+=8;else if(hay.includes(t))score+=1;} return {item,score}; }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,5).map(x=>x.item); }

function compactKnowledge(items){ return items.map((x,i)=>[
  `VERIFIED ${i+1}: ${clean(x.title,220)}`,`ID: ${clean(x.id,180)}`,`Category: ${clean(x.category,160)}`,
  `Description: ${clean(x.description,650)}`,`Details: ${clean(x.details,650)}`,`Price: ${clean(x.price,700)}`,
  `Child policy: ${clean(x.child_policy,550)}`,`Included: ${clean(x.included,700)}`,`Not included: ${clean(x.not_included,550)}`,
  `Highlights: ${clean(x.highlights,850)}`,`Popular collection: ${POPULAR_IDS.has(x.id)?'YES':'NO'}`,`Combo deal: ${x.combo_deal?'YES':'NO'}`,`Special Offers stacking: ${x.combo_deal?'NO by default — ATO override only':'category rules may apply'}`,`Pickup: ${clean(x.pickup,650)}`,`URL: ${itemUrl(x)}`
].join('\n')).join('\n\n'); }

function searchTours(args={}){
  const criteria=clean(args.criteria,1200), q=tokens(criteria), family=!!args.family, budget=Number(args.budget_eur||0), max=Math.min(6,Math.max(2,Number(args.max_results||4)));
  const wanted=(args.categories||[]).map(x=>clean(x,120).toLowerCase()); const wantsPopular=/popular|traveller|traveler|best seller|популяр|популярн|beliebt|popularn/i.test(criteria); const wantsCombo=/combo|deal|package|комбо|пакет|komb/i.test(criteria);
  return knowledgeItems().map(item=>{
    const hay=clean([item.title,item.category,item.description,item.highlights,item.search_text].join(' '),40000).toLowerCase(); let score=0;
    for(const t of q){ if(clean(item.title,240).toLowerCase().includes(t))score+=10; else if(clean(item.category,160).toLowerCase().includes(t))score+=6; else if(hay.includes(t))score+=1; }
    if(family&&item?.flags?.family_friendly)score+=12;
    if(wanted.length&&wanted.some(w=>clean(item.category,160).toLowerCase().includes(w)))score+=18; if(wantsPopular&&POPULAR_IDS.has(item.id))score+=24; if(wantsCombo&&item.combo_deal)score+=26;
    const adult=parseAdultPrice(item.price); if(budget>0&&adult!=null){ if(adult<=budget)score+=5; else score-=6; }
    return {item,score};
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,max).map(({item})=>({
    id:item.id,title:item.title,category:item.category,url:itemUrl(item),price_label:clean(item.price,420),duration:clean(item.details,420),child_policy:clean(item.child_policy,360),family_friendly:!!item?.flags?.family_friendly,popular_collection:POPULAR_IDS.has(item.id),combo_deal:!!item.combo_deal,special_offers_stackable:item.combo_deal?false:true,highlights:clean(item.highlights,520)
  }));
}

function tourDetails(args={}){ const item=findItem(args.tour); if(!item)return {found:false}; return {found:true,id:item.id,title:item.title,category:item.category,url:itemUrl(item),description:item.description,details:item.details,price:item.price,child_policy:item.child_policy,included:item.included,not_included:item.not_included,highlights:item.highlights,what_to_bring:item.what_to_bring,pickup:item.pickup,popular_collection:POPULAR_IDS.has(item.id),combo_deal:!!item.combo_deal,special_offers_stackable:item.combo_deal?false:true}; }

function compareTours(args={}){ const refs=Array.isArray(args.tours)?args.tours.slice(0,4):[]; return refs.map(ref=>findItem(ref)).filter(Boolean).map(item=>({id:item.id,title:item.title,category:item.category,url:itemUrl(item),price_label:clean(item.price,420),duration:clean(item.details,420),child_policy:clean(item.child_policy,360),included:clean(item.included,420),pickup:clean(item.pickup,420),highlights:clean(item.highlights,500),popular_collection:POPULAR_IDS.has(item.id),combo_deal:!!item.combo_deal,special_offers_stackable:item.combo_deal?false:true})); }

function parseAdultPrice(text){ const m=clean(text,1200).match(/€\s*(\d+(?:[.,]\d+)?)/); return m?Number(m[1].replace(',','.')):null; }
function ageRangeMatches(age,a,b){ return age>=a&&(b==null||age<=b); }
function childCostForAge(text,age,adult){
  const s=clean(text,2400).replace(/[–—]/g,'-');
  const rows=s.split(/\n+/).map(x=>x.trim()).filter(Boolean);
  for(const row of rows){
    let m=row.match(/children?\s*(\d+)\s*-\s*(\d+)\s*(?:years?)?\s*[:\-]?\s*€\s*(\d+(?:[.,]\d+)?)/i); if(m&&ageRangeMatches(age,+m[1],+m[2]))return {cost:+m[3].replace(',','.'),rule:row};
    m=row.match(/children?\s*(\d+)\s*\+\s*(?:years?)?\s*[:\-]?\s*€\s*(\d+(?:[.,]\d+)?)/i); if(m&&age>=+m[1])return {cost:+m[2].replace(',','.'),rule:row};
    m=row.match(/children?\s*(\d+)\s*-\s*(\d+)\s*[:\-]?\s*(free|half price|full(?: adult)? price|adult price|child price)/i); if(m&&ageRangeMatches(age,+m[1],+m[2])){ const r=m[3].toLowerCase(); if(r==='free')return{cost:0,rule:row}; if(r.includes('half'))return adult==null?null:{cost:adult/2,rule:row}; if(r.includes('full')||r==='adult price')return adult==null?null:{cost:adult,rule:row}; return null; }
    m=row.match(/children?\s*(\d+)\s*\+\s*[:\-]?\s*(free|half price|full(?: adult)? price|adult price|child price)/i); if(m&&age>=+m[1]){ const r=m[2].toLowerCase(); if(r==='free')return{cost:0,rule:row}; if(r.includes('half'))return adult==null?null:{cost:adult/2,rule:row}; if(r.includes('full')||r==='adult price')return adult==null?null:{cost:adult,rule:row}; return null; }
  }
  // Generic lines such as "0–4 years: Free" from child_policy.
  const p=s.match(new RegExp(`(?:^|\\n)\\s*(\\d+)\\s*-\\s*(\\d+)\\s*(?:years?)?\\s*[:\\-]?\\s*(free|half price|full(?: adult)? price|adult price)`, 'ig'));
  if(p){ /* handled conservatively below by row parser when explicit 'Children' exists */ }
  return null;
}

function estimateGroupPrice(args={}){
  const adults=Math.max(0,Math.min(20,Number(args.adults||0))), ages=Array.isArray(args.children_ages)?args.children_ages.map(Number).filter(x=>Number.isFinite(x)&&x>=0&&x<=17).slice(0,12):[];
  const refs=Array.isArray(args.tours)?args.tours.slice(0,8):[];
  return refs.map(ref=>{ const item=findItem(ref); if(!item)return {tour:String(ref),status:'not_found'}; const adult=parseAdultPrice(item.price); const priceText=clean(item.price,1800); if(adult==null||/per confirmed vehicle|per vehicle|per private yacht|per yacht|per private|for up to \d+ guests|maximum capacity|starting price|from €|final price depends/i.test(priceText)) return {id:item.id,title:item.title,status:'manager_confirmation',price_label:item.price,reason:'Price is variable, vehicle-based, or cannot be safely calculated from verified text.'}; let total=adult*adults, uncertain=false, child_lines=[]; for(const age of ages){ let c=childCostForAge(priceText+'\n'+clean(item.child_policy,1000),age,adult); if(!c){ uncertain=true; child_lines.push({age,status:'manager_confirmation'}); } else {total+=c.cost; child_lines.push({age,cost_eur:Number(c.cost.toFixed(2)),rule:c.rule});} } return {id:item.id,title:item.title,status:uncertain?'partial_estimate':'verified_estimate',adult_price_eur:adult,adults,children:child_lines,total_eur:Number(total.toFixed(2)),price_label:item.price,warning:uncertain?'One or more child tariffs require ATO confirmation.':''}; });
}

function groupOffer(args={}){
  const lines=Array.isArray(args.lines)?args.lines.slice(0,12):[]; let original=0, discounted=0; const result=[];
  for(const l of lines){ const category=clean(l.category,160), total=Number(l.line_total_eur);
    if(!Number.isFinite(total)||total<0){result.push({category,line_total_eur:Number.isFinite(total)?total:null,status:'manager_confirmation'});continue;}
    if(NON_STACKABLE_CATEGORIES.has(category)){ original+=total; discounted+=total; result.push({category,line_total_eur:Number(total.toFixed(2)),discount_percent:0,savings_eur:0,after_discount_eur:Number(total.toFixed(2)),status:'combo_price_no_stack'}); continue; }
    const pct=OFFER_DISCOUNTS[category]; if(pct==null){result.push({category,line_total_eur:Number(total.toFixed(2)),status:'manager_confirmation'});continue;}
    const save=total*pct/100, after=total-save; original+=total; discounted+=after; result.push({category,line_total_eur:Number(total.toFixed(2)),discount_percent:pct,savings_eur:Number(save.toFixed(2)),after_discount_eur:Number(after.toFixed(2)),status:'calculated'});
  }
  return {lines:result,original_total_eur:Number(original.toFixed(2)),discounted_total_eur:Number(discounted.toFixed(2)),savings_eur:Number((original-discounted).toFixed(2)),rule:'Eligible ordinary lines keep their own Journey category discount. Combo Deals are already package-priced and do not automatically stack an additional Special Offer unless ATO explicitly overrides it. Mixed categories are never averaged.'};
}

function checkSpecialOffersSavings(args={}){
  const refs=Array.isArray(args.tours)?args.tours.slice(0,4):[];
  const adults=Math.max(0,Math.min(20,Number(args.adults||0)));
  const ages=Array.isArray(args.children_ages)?args.children_ages.map(Number).filter(x=>Number.isInteger(x)&&x>=0&&x<=17).slice(0,12):[];
  const estimates=estimateGroupPrice({tours:refs,adults,children_ages:ages});
  let original=0, discounted=0, exactCount=0;
  const lines=estimates.map((est,i)=>{
    const ref=refs[i]||est.id||est.title||'';
    const item=findItem(est.id||ref);
    const category=clean(item?.category,160);
    const pct=OFFER_DISCOUNTS[category];
    const total=Number(est?.total_eur);
    const safeTotal=est?.status==='verified_estimate' && Number.isFinite(total);
    if(item && item.combo_deal && safeTotal){
      original+=total; discounted+=total; exactCount++;
      return {tour_id:item.id,title:item.title,category,line_total_eur:Number(total.toFixed(2)),discount_percent:0,savings_eur:0,after_discount_eur:Number(total.toFixed(2)),status:'combo_price_no_stack'};
    }
    if(!item || pct==null || !safeTotal){
      return {
        tour_id:clean(item?.id||est?.id||ref,180),
        title:clean(item?.title||est?.title||ref,220),
        category:category||'',
        line_total_eur:Number.isFinite(total)?Number(total.toFixed(2)):null,
        discount_percent:pct==null?null:pct,
        savings_eur:null,
        after_discount_eur:null,
        status:'manager_confirmation'
      };
    }
    const save=total*pct/100, after=total-save;
    original+=total; discounted+=after; exactCount++;
    return {
      tour_id:item.id,title:item.title,category,
      line_total_eur:Number(total.toFixed(2)),
      discount_percent:pct,
      savings_eur:Number(save.toFixed(2)),
      after_discount_eur:Number(after.toFixed(2)),
      status:'potential_calculated'
    };
  });
  const allExact=lines.length>0 && exactCount===lines.length;
  return {
    status:allExact?'potential_calculated':(exactCount>0?'partial':'manager_confirmation'),
    lines,
    original_total_eur:allExact?Number(original.toFixed(2)):null,
    discounted_total_eur:allExact?Number(discounted.toFixed(2)):null,
    savings_eur:allExact?Number((original-discounted).toFixed(2)):null,
    offer_url:'/special-offers.html',
    note:'Potential savings check only. Eligible ordinary tours use the current ATO category matrix. Combo Deals remain at their package price and do not automatically receive a second discount. Any stacking exception, offer eligibility, availability and final payable amount must be confirmed by ATO Manager.'
  };
}


function vipEventPriceLabel(item,guestCount){
  const raw=clean(item?.price,800), desc=clean(item?.description,900), id=clean(item?.id,180);
  if(id==='luxury-yacht-cruise' && Number.isInteger(guestCount) && guestCount>=1 && guestCount<=12){
    const base=250 + Math.max(0,guestCount-5)*50;
    return {price_label:`€${base} verified yacht base for ${guestCount} guest${guestCount===1?'':'s'} (included standard cruise service only; event extras are separate)`,estimate_eur:base,estimate_type:'verified_service_base'};
  }
  if(raw) return {price_label:raw,estimate_eur:null,estimate_type:/^€\s*\d+/i.test(raw)&&!/from|on request|final price depends|per confirmed vehicle/i.test(raw)?'listed_price':'manager_confirmation'};
  const m=desc.match(/from\s*€\s*(\d+(?:[.,]\d+)?)/i);
  if(m) return {price_label:`From €${m[1].replace(',','.')}`,estimate_eur:null,estimate_type:'manager_confirmation'};
  return {price_label:'On Request',estimate_eur:null,estimate_type:'manager_confirmation'};
}
function vipScheduleHint(item){
  const id=clean(item?.id,180);
  if(id==='luxury-yacht-cruise') return 'Verified standard windows: 09:00–13:00, 13:00–17:00 or 17:00–21:00; daily subject to availability and sea conditions.';
  if(id==='private-photographer') return 'Approx. 1 hour; exact start time/location confirmed individually.';
  if(id==='private-yacht-charter') return 'Custom duration; morning, daytime or sunset format on request.';
  if(id==='helicopter-experience') return 'Custom flight time; aviation operator/pilot approval required.';
  if(id==='personal-concierge') return 'Hourly/daily/custom route; service hours confirmed in writing.';
  if(id==='airport-vip-transfer') return '24/7 by reservation; exact pickup/meeting details confirmed after booking.';
  return 'Timing confirmed by ATO.';
}
function getVipEventComponents(args={}){
  const criteria=clean(args.criteria,1200).toLowerCase(), q=tokens(criteria);
  const guestCount=Number.isInteger(args.guest_count)?Math.max(1,Math.min(100,args.guest_count)):null;
  return knowledgeItems().filter(x=>(x?.flags?.vip||clean(x.category,120)==='VIP Services') && !(guestCount>12 && x.id==='luxury-yacht-cruise')).map(item=>{
    const hay=clean([item.title,item.description,item.highlights,item.search_text].join(' '),20000).toLowerCase(); let score=1;
    for(const t of q){ if(clean(item.title,220).toLowerCase().includes(t))score+=8; else if(hay.includes(t))score+=2; }
    if(guestCount && item.id==='luxury-yacht-cruise' && guestCount<=12) score+=4;
    return {item,score};
  }).sort((a,b)=>b.score-a.score).slice(0,8).map(({item})=>{ const price=vipEventPriceLabel(item,guestCount); return {id:item.id,title:item.title,url:itemUrl(item),price_label:price.price_label,estimate_eur:price.estimate_eur,estimate_type:price.estimate_type,schedule_hint:vipScheduleHint(item),description:clean(item.description,520),highlights:clean(item.highlights,520),pickup:clean(item.pickup,360),confidence:price.estimate_type==='verified_service_base'?'verified':(!clean(item.price,500)||/on request|from €|final price depends|per private yacht|per yacht|per vehicle/i.test(clean(item.price,500)))?'manager_confirmation':'verified'}; });
}

const WMO={0:'clear sky',1:'mainly clear',2:'partly cloudy',3:'overcast',45:'fog',48:'rime fog',51:'light drizzle',53:'drizzle',55:'dense drizzle',61:'light rain',63:'rain',65:'heavy rain',71:'light snow',73:'snow',75:'heavy snow',80:'rain showers',81:'rain showers',82:'heavy showers',95:'thunderstorm',96:'thunderstorm with hail',99:'thunderstorm with hail'};
async function fetchJson(url){ const c=new AbortController(); const t=setTimeout(()=>c.abort(),8500); try{ const r=await fetch(url,{headers:{'User-Agent':'ATO-Travel-Agent/2.0'},signal:c.signal}); if(!r.ok)throw new Error(`HTTP ${r.status}`); return await r.json(); } finally{clearTimeout(t);} }
async function weatherForecast(args={}){
  if(WEATHER_PROVIDER!=='open-meteo') return {status:'unavailable',reason:'Configured weather provider is not implemented.'};
  const location=clean(args.location,180); if(!location)return {status:'missing_location'};
  const geoParams=new URLSearchParams({name:location,count:'1',language:'en',format:'json'}); if(OPEN_METEO_API_KEY)geoParams.set('apikey',OPEN_METEO_API_KEY);
  let geo; try{ geo=await fetchJson(`${OPEN_METEO_GEO_HOST}/v1/search?${geoParams}`); }catch(e){return{status:'unavailable',reason:'Geocoding service unavailable.'};}
  const p=geo?.results?.[0]; if(!p)return {status:'location_not_found',location};
  const now=new Date(), today=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).format(now); let start=clean(args.start_date,10)||today, end=clean(args.end_date,10)||'';
  const maxDate=new Date(now.getTime()+15*86400000).toISOString().slice(0,10); if(!/^\d{4}-\d{2}-\d{2}$/.test(start))start=today; if(!end||!/^\d{4}-\d{2}-\d{2}$/.test(end))end=new Date(Math.min(new Date(start+'T00:00:00Z').getTime()+6*86400000,new Date(maxDate+'T00:00:00Z').getTime())).toISOString().slice(0,10);
  if(start>maxDate)return {status:'outside_forecast_window',location:`${p.name}, ${p.country}`,forecast_available_through:maxDate,reason:'Reliable live forecast is only requested inside the provider forecast horizon.'}; if(end>maxDate)end=maxDate;
  const params=new URLSearchParams({latitude:String(p.latitude),longitude:String(p.longitude),timezone:'auto',start_date:start,end_date:end,daily:'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max,uv_index_max'}); if(OPEN_METEO_API_KEY)params.set('apikey',OPEN_METEO_API_KEY);
  let data; try{ data=await fetchJson(`${OPEN_METEO_HOST}/v1/forecast?${params}`); }catch(e){return{status:'unavailable',reason:'Weather forecast service unavailable.'};}
  const d=data?.daily||{}, times=d.time||[], activity=clean(args.activity_type,40).toLowerCase()||'general';
  const days=times.map((date,i)=>{ const max=Number(d.temperature_2m_max?.[i]), min=Number(d.temperature_2m_min?.[i]), apparent=Number(d.apparent_temperature_max?.[i]), pp=Number(d.precipitation_probability_max?.[i]||0), ps=Number(d.precipitation_sum?.[i]||0), wind=Number(d.wind_speed_10m_max?.[i]||0), gust=Number(d.wind_gusts_10m_max?.[i]||0), code=Number(d.weather_code?.[i]??-1), uv=Number(d.uv_index_max?.[i]||0); let target=24, windWeight=1.1; if(activity==='sea'){target=29;windWeight=1.5;} if(activity==='air'){target=22;windWeight=2.6;} if(activity==='walking'||activity==='family'){target=23;windWeight=1.15;} let score=100-Math.abs(((max+min)/2)-target)*1.5-pp*.38-Math.max(0,wind-20)*windWeight-Math.max(0,gust-35)*.45-Math.max(0,uv-8)*1.2; if([65,82,95,96,99].includes(code))score-=18; return {date,max_c:max,min_c:min,apparent_max_c:apparent,precip_probability_percent:pp,precipitation_mm:ps,wind_max_kmh:wind,gust_max_kmh:gust,uv_index:uv,weather_code:code,summary:WMO[code]||'weather',comfort_score:Number(score.toFixed(1))}; });
  const best=days.slice().sort((a,b)=>b.comfort_score-a.comfort_score)[0]||null;
  return {status:'ok',provider:'Open-Meteo',location:`${p.name}${p.admin1?', '+p.admin1:''}, ${p.country}`,timezone:data?.timezone||p.timezone||'',days,best_weather_comfort_day:best?.date||null,best_day_reason:best?`Best weather-comfort score among the requested forecast days (${best.summary}, ${best.max_c}°C max, ${best.precip_probability_percent}% precipitation probability, ${best.wind_max_kmh} km/h max wind).`:null,disclaimer:'This is a weather-comfort recommendation, not an operating/availability guarantee. Tour operation and exact pickup must still be confirmed by ATO.'};
}

const TOOLS=[
 {type:'function',name:'search_ato_tours',description:'Search verified ATO tours/services for a visitor. Use when the visitor asks what suits their family, preferences or budget.',parameters:{type:'object',properties:{criteria:{type:'string'},family:{type:'boolean'},budget_eur:{type:['number','null']},categories:{type:'array',items:{type:'string'}},max_results:{type:'integer',minimum:2,maximum:6}},required:['criteria','family','budget_eur','categories','max_results'],additionalProperties:false},strict:true},
 {type:'function',name:'get_ato_tour_details',description:'Retrieve verified details for one named ATO tour/service. Use instead of guessing exact commercial facts.',parameters:{type:'object',properties:{tour:{type:'string'}},required:['tour'],additionalProperties:false},strict:true},
 {type:'function',name:'compare_ato_tours',description:'Return comparable verified facts for up to four ATO tours/services.',parameters:{type:'object',properties:{tours:{type:'array',items:{type:'string'},minItems:2,maxItems:4}},required:['tours'],additionalProperties:false},strict:true},
 {type:'function',name:'estimate_group_price',description:'Deterministically estimate a group/family total only where verified ATO price and child rules are safely machine-readable. Returns manager_confirmation when uncertain.',parameters:{type:'object',properties:{tours:{type:'array',items:{type:'string'},minItems:1,maxItems:8},adults:{type:'integer',minimum:0,maximum:20},children_ages:{type:'array',items:{type:'integer',minimum:0,maximum:17},maxItems:12}},required:['tours','adults','children_ages'],additionalProperties:false},strict:true},
 {type:'function',name:'calculate_group_event_offer',description:'Apply the approved ATO Group & Event Offers category discount matrix to already-known EUR line totals. Never average mixed categories.',parameters:{type:'object',properties:{lines:{type:'array',items:{type:'object',properties:{category:{type:'string'},line_total_eur:{type:'number'}},required:['category','line_total_eur'],additionalProperties:false},maxItems:12}},required:['lines'],additionalProperties:false},strict:true},
 {type:'function',name:'check_special_offers_savings',description:'Check potential savings for the visitor’s current 1–4 ATO tours using verified family/group totals plus the current ATO Special Offers category matrix. This NEVER grants eligibility or confirms a final discounted price; uncertain lines require manager confirmation.',parameters:{type:'object',properties:{tours:{type:'array',items:{type:'string'},minItems:1,maxItems:4},adults:{type:'integer',minimum:0,maximum:20},children_ages:{type:'array',items:{type:'integer',minimum:0,maximum:17},maxItems:12}},required:['tours','adults','children_ages'],additionalProperties:false},strict:true},
 {type:'function',name:'get_vip_event_components',description:'Return verified ATO VIP services that can be combined into a bespoke private event such as birthday, proposal, anniversary, wedding-related celebration, family celebration or corporate/private day. Provide guest_count when known so deterministic capacity/base-price rules can be applied. Prices marked From/On Request are never treated as final.',parameters:{type:'object',properties:{criteria:{type:'string'},guest_count:{type:['integer','null'],minimum:1,maximum:100}},required:['criteria','guest_count'],additionalProperties:false},strict:true},
 {type:'function',name:'get_weather_forecast',description:'Get live forecast for a destination/date range and identify the best weather-comfort day. Use whenever weather could materially affect date choice. This does not confirm tour operation.',parameters:{type:'object',properties:{location:{type:'string'},start_date:{type:['string','null'],description:'YYYY-MM-DD or null'},end_date:{type:['string','null'],description:'YYYY-MM-DD or null'},activity_type:{type:'string',enum:['general','family','walking','sea','air']}},required:['location','start_date','end_date','activity_type'],additionalProperties:false},strict:true}
];

async function runTool(name,args){ if(name==='search_ato_tours')return searchTours(args); if(name==='get_ato_tour_details')return tourDetails(args); if(name==='compare_ato_tours')return compareTours(args); if(name==='estimate_group_price')return estimateGroupPrice(args); if(name==='calculate_group_event_offer')return groupOffer(args); if(name==='check_special_offers_savings')return checkSpecialOffersSavings(args); if(name==='get_vip_event_components')return getVipEventComponents(args); if(name==='get_weather_forecast')return await weatherForecast(args); return {error:'unknown_tool'}; }

const OUTPUT_SCHEMA={type:'object',additionalProperties:false,properties:{
 answer:{type:'string'},
 lead_profile:{type:'object',additionalProperties:false,properties:{adults:{type:['integer','null']},children_count:{type:['integer','null']},children_ages:{type:'array',items:{type:'integer'}},hotel:{type:['string','null']},preferred_dates:{type:'array',items:{type:'string'}},budget_amount:{type:['number','null']},budget_currency:{type:['string','null']},preferences:{type:'array',items:{type:'string'}},mobility_notes:{type:['string','null']},selected_tour_ids:{type:'array',items:{type:'string'}}},required:['adults','children_count','children_ages','hotel','preferred_dates','budget_amount','budget_currency','preferences','mobility_notes','selected_tour_ids']},
 event_profile:{type:'object',additionalProperties:false,properties:{event_type:{type:['string','null']},event_date:{type:['string','null']},guest_count:{type:['integer','null']},occasion_for:{type:['string','null']},style:{type:['string','null']},must_haves:{type:'array',items:{type:'string'}},avoid:{type:'array',items:{type:'string'}},privacy_level:{type:['string','null']},surprise:{type:'boolean'},photo_video:{type:['string','null']},transport:{type:['string','null']}},required:['event_type','event_date','guest_count','occasion_for','style','must_haves','avoid','privacy_level','surprise','photo_video','transport']},
 recommendations:{type:'array',maxItems:4,items:{type:'object',additionalProperties:false,properties:{id:{type:'string'},title:{type:'string'},url:{type:'string'},price_label:{type:'string'},reason:{type:'string'},best_for:{type:'string'},confidence:{type:'string',enum:['verified','estimate','manager_confirmation']}},required:['id','title','url','price_label','reason','best_for','confidence']}},
 comparison:{type:'array',maxItems:4,items:{type:'object',additionalProperties:false,properties:{id:{type:'string'},title:{type:'string'},price_label:{type:'string'},duration:{type:'string'},child_policy:{type:'string'},why_it_fits:{type:'string'}},required:['id','title','price_label','duration','child_policy','why_it_fits']}},
 weather:{type:'object',additionalProperties:false,properties:{location:{type:['string','null']},best_weather_day:{type:['string','null']},best_day_reason:{type:['string','null']},days:{type:'array',maxItems:16,items:{type:'object',additionalProperties:false,properties:{date:{type:'string'},max_c:{type:'number'},min_c:{type:'number'},precip_probability_percent:{type:'number'},wind_max_kmh:{type:'number'},summary:{type:'string'}},required:['date','max_c','min_c','precip_probability_percent','wind_max_kmh','summary']}},disclaimer:{type:['string','null']}},required:['location','best_weather_day','best_day_reason','days','disclaimer']},
 itinerary:{type:'object',additionalProperties:false,properties:{status:{type:'string',enum:['none','offered','proposed']},title:{type:'string'},summary:{type:'string'},days:{type:'array',maxItems:14,items:{type:'object',additionalProperties:false,properties:{date:{type:'string'},type:{type:'string',enum:['tour','rest','free']},tour_id:{type:['string','null']},title:{type:'string'},reason:{type:'string'}},required:['date','type','tour_id','title','reason']}},budget_note:{type:'string'},disclaimer:{type:'string'}},required:['status','title','summary','days','budget_note','disclaimer']},
 event_plan:{type:'object',additionalProperties:false,properties:{status:{type:'string',enum:['none','offered','proposed']},title:{type:'string'},summary:{type:'string'},components:{type:'array',maxItems:8,items:{type:'object',additionalProperties:false,properties:{service_id:{type:'string'},title:{type:'string'},url:{type:'string'},time:{type:'string'},role:{type:'string'},reason:{type:'string'},price_label:{type:'string'},confidence:{type:'string',enum:['verified','estimate','manager_confirmation']}},required:['service_id','title','url','time','role','reason','price_label','confidence']}},alternatives:{type:'array',maxItems:3,items:{type:'object',additionalProperties:false,properties:{name:{type:'string'},description:{type:'string'},changes:{type:'string'}},required:['name','description','changes']}},budget_note:{type:'string'},disclaimer:{type:'string'}},required:['status','title','summary','components','alternatives','budget_note','disclaimer']},
 offer_rescue:{type:'object',additionalProperties:false,properties:{status:{type:'string',enum:['none','offered','potential_calculated','partial','manager_confirmation']},original_total_eur:{type:['number','null']},discounted_total_eur:{type:['number','null']},savings_eur:{type:['number','null']},lines:{type:'array',maxItems:4,items:{type:'object',additionalProperties:false,properties:{tour_id:{type:'string'},title:{type:'string'},category:{type:'string'},line_total_eur:{type:['number','null']},discount_percent:{type:['number','null']},savings_eur:{type:['number','null']},after_discount_eur:{type:['number','null']},status:{type:'string'}},required:['tour_id','title','category','line_total_eur','discount_percent','savings_eur','after_discount_eur','status']}},note:{type:'string'},offer_url:{type:'string'}},required:['status','original_total_eur','discounted_total_eur','savings_eur','lines','note','offer_url']},
 next_action:{type:'string',enum:['continue_discovery','compare','offer_itinerary','review_itinerary','offer_vip_event','review_vip_event','offer_special_offer','review_special_offer','rebuild_budget','manager_handoff','ready_to_request_booking','payment_after_confirmation']},
 suggested_questions:{type:'array',maxItems:5,items:{type:'string'}}
},required:['answer','lead_profile','event_profile','recommendations','comparison','weather','itinerary','event_plan','offer_rescue','next_action','suggested_questions']};

function buildInstructions(siteLanguage,responseLanguage,page,verified,agentState){ const siteLang=clean(siteLanguage||'en',12).toLowerCase(); const langHint=clean(responseLanguage||'auto',24).toLowerCase(); const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()); return `You are the official ATO AI TRAVEL SALES AGENT for ALANYA TOUR ORGANIZATIONS in Alanya, Türkiye.\n\nYour job is not to behave like a passive FAQ bot. Lead the visitor intelligently from discovery to a ready booking request: understand needs, family/group, children ages, preferred dates, hotel, budget and preferences; recommend a small set of strong options; use live weather when dates/destination matter; compare; make a concrete recommendation; then prepare a clean manager handoff.\n\nSITE UI LANGUAGE: ${siteLang}.\nVISITOR LANGUAGE HINT: ${langHint}.\nUNIVERSAL LANGUAGE POLICY:\n- Answer in the same natural language as the CURRENT VISITOR MESSAGE, regardless of the site's UI language and regardless of whether that language is one of ATO's five website languages. This includes French, Spanish, Italian, Portuguese, Dutch, Arabic, Hebrew, Ukrainian, Greek, Chinese, Japanese, Korean and any other language you can reliably identify.\n- The visitor's actual message is authoritative; VISITOR LANGUAGE HINT is advisory only.\n- If the visitor changes language during the conversation, change with them on that turn and preserve the same remembered trip/event context.\n- If the current message is genuinely too short or language-neutral to identify (for example only a number, emoji, tour name or OK), continue in the language of the most recent clearly identifiable VISITOR message in RECENT CONVERSATION. Only if that is unavailable, fall back to SITE UI LANGUAGE.\n- Keep official ATO brand names, tour names and product names in their verified form where appropriate; do not mistake those English labels for the visitor's language.\n- Do not translate URLs, codes, booking numbers or exact official labels that must remain stable.\nCURRENT DATE IN TÜRKİYE: ${today}. Interpret relative visitor dates against this date.\nCURRENT PAGE: ${JSON.stringify(page)}\nPERSISTENT SESSION STATE: ${JSON.stringify(agentState||{})}\n\nSALES METHOD:\n- Ask only for information that is still missing and materially changes the recommendation. If the visitor gives several details in one sentence, extract them and do not ask again.
- Distinguish children_count=null (not yet known) from children_count=0 (visitor explicitly has no children). If there are children, collect ages because child tariffs and suitability can change by age.
- Treat PERSISTENT SESSION STATE as remembered visitor information. Carry it forward across turns. If the visitor explicitly corrects a remembered fact, the newest statement wins. Never erase a known field merely because it is absent from the latest message.
- When the visitor clearly chooses or commits to a tour, put its verified tour id in lead_profile.selected_tour_ids. Recommendations alone are not selections; do not mark them selected until the visitor chooses them.\n- Prefer 2–4 strong choices, not a giant list. Explain why each fits.\n- When budget is given, optimise the whole experience plan, not just the cheapest single tour.\n- If weather is relevant to date choice, call get_weather_forecast. Say \"best weather-comfort day\", not \"tour definitely operates\".\n- For comparisons, make a recommendation with trade-offs. Do not hide behind neutrality.\n- Use estimate_group_price only for safe deterministic estimates. If it returns manager_confirmation, say so plainly.\n- Group & Event Offers: every eligible ordinary line uses its own category discount; never average categories.
- COMBO DEALS: treat Combo Deals as already package-priced. Do NOT automatically stack an additional Special Offer on top of a Combo Deal. Only an explicit ATO override may allow stacking. If a visitor wants value, you may recommend a Combo Deal as an alternative to buying separate experiences.
- POPULAR TOURS: Popular is a trust/collection signal, not a pricing category. Use it as social proof when helpful, but family fit, safety, budget, road tolerance and preferences outrank popularity.

VIP EVENT CONCIERGE:
- When the visitor mentions a birthday, marriage proposal, anniversary, wedding-related celebration, romantic surprise, private family celebration, corporate/private event, yacht celebration, VIP day, or asks you to organize an event, switch from normal tour picker to concierge thinking.
- Capture only the event facts they actually state: event type, date, total guests, who it is for, desired style/mood, must-haves, dislikes/avoid, privacy, surprise yes/no, photo/video preference, transport, budget and hotel/location. Do not repeat questions already answered.
- Normalize an unambiguous event date to YYYY-MM-DD using CURRENT DATE IN TÜRKİYE. If the date is genuinely ambiguous, keep the wording and ask only what is needed to disambiguate it.
- If the event intent is clear but the brief is incomplete, set event_plan.status='offered' and next_action='offer_vip_event' while asking only the 1–2 missing facts that materially change the concept.
- When enough is known or the visitor asks you to create it, call get_vip_event_components and build event_plan.status='proposed', next_action='review_vip_event'. Use ONLY verified ATO VIP service IDs returned by tools/knowledge. Pass the known total guest count to the tool. A tool-returned verified_service_base may be used as a base service figure, but it is not a final event total and excludes unconfirmed extras.
- Think as an event designer, not a list seller: sequence the day with realistic transitions/buffers and explain the role of each component. Examples of roles: private transfer, yacht core experience, helicopter highlight, photographer, private driver/concierge. Do not invent restaurants, decoration vendors, musicians, menus, fireworks, permits or third-party services unless they are explicitly present in verified ATO data; instead mark them as 'ATO Manager to source/confirm' in prose.
- Offer up to three concept directions when useful (e.g. Essential / Signature / Grand), but NEVER invent exact package totals. Many VIP services are 'From' or 'On Request'; show those labels and say ATO Manager will quote the complete event after availability and supplier confirmation.
- Weather may affect yacht/air/outdoor components. When date is within forecast horizon and weather matters, use get_weather_forecast. Weather comfort never confirms yacht/flight operation.
- A VIP event request is allowed to proceed to ATO Manager even when exact price is not yet known; it is a bespoke quote request, not a confirmed booking.


PRICE OBJECTION / VALUE RESCUE:
- If the visitor says the plan/tour is too expensive, over budget, costs too much, or clearly rejects it because of price, do NOT immediately throw away the plan. First offer a calm value-rescue option: "I can check our Special Offers and see whether the current plan can be reduced. Want me to recalculate it?"
- On that first price objection, set offer_rescue.status="offered" and next_action="offer_special_offer". Do not promise that a discount is guaranteed and do not invent a percentage.
- If the visitor accepts the Special Offers check, use check_special_offers_savings on the current selected tours. If selected_tour_ids is empty but there is a proposed itinerary, use the itinerary's unique tour_ids. If still empty, use the small current recommendation set only after making clear that this is an example check, not a chosen booking.
- After the tool call, set offer_rescue.status to the returned status and next_action="review_special_offer". Show ordinary safely-calculable total, potential Special Offers total and savings only when the tool returns exact totals. For partial/uncertain lines, say ATO must confirm those lines.
- The assistant is NEVER authorised to grant, activate or redeem a Special Offer. It can only check potential savings and route the visitor into the real Special Offers flow / ATO Manager confirmation.
- If the visitor says the discounted result is still too expensive, or asks for a cheaper version, keep the known priorities and rebuild the plan instead of starting discovery from zero. If budget_amount is already known, target that budget. If it is not known, ask only for the maximum total budget. Set next_action="rebuild_budget" while waiting for that amount, then produce revised recommendations/itinerary once known.
- If the visitor only says "I don't want this" without mentioning price, do not assume a price objection. Give a low-pressure fork: if price is the issue, you can check Special Offers; if the format itself is wrong, replace the tour while preserving the rest of their profile.
- Never pressure the visitor after a clear "no". One offer to check savings is enough unless the visitor asks again. If PERSISTENT SESSION STATE.price_rescue_shown is true, do not repeat the Special Offers pitch automatically.

INDECISION RESCUE / HOLIDAY PLAN:
- Do not keep a hesitant visitor trapped in endless comparison. If there are strong recommendations/comparison but selected_tour_ids is still empty and the visitor is hesitating (for example: "I don't know", "maybe", "what would you do?", "I need to think") OR PERSISTENT SESSION STATE.decision_turns_without_selection >= 2, proactively offer one stronger next step: "I can build your personal excursion plan for the whole stay using your arrival/departure dates, family, budget and preferences."
- Offer this only once unless the visitor asks again. Use itinerary.status="offered" and next_action="offer_itinerary". If arrival/departure dates are missing, ask only for those dates (and any other truly essential missing constraint) rather than repeating the comparison.
- If the visitor accepts, asks you to plan the stay, or says a clear equivalent such as "yes, build my plan", create itinerary.status="proposed" and next_action="review_itinerary". Build a day-by-day plan across the known travel date range.
- The itinerary may contain up to FOUR unique ATO tours because the current ATO Trip Planner compares/plans up to four excursions. Use rest/free days to balance a longer stay. Do not cram a tour into every day unless the visitor explicitly wants that pace.
- Alternate tiring/long-distance days with easier or free days when that better fits the group. Children ages, mobility notes, budget, road tolerance and preferences outrank generic popularity.
- Use verified ATO tour ids/titles only. If exact operating days or availability are not verified, the itinerary is PROPOSED, not confirmed. State that ATO Manager will confirm operation, pickup and final price.
- If live forecast falls within the forecast horizon and materially changes placement, use get_weather_forecast and explain the weather-comfort logic. Weather never guarantees operation.
- If a budget exists, keep the proposed set within it when verified/estimable; if exact family totals are uncertain, say which lines require manager confirmation instead of inventing a total.
- The itinerary should feel like a travel manager planned the holiday, not like a random list: give each day a short reason (recovery day, best weather window, family day, long-road day, sea day, etc.).

STRICT COMMERCIAL SAFETY:\n- Exact prices, child tariffs, inclusions, pickup, operating days, discounts and tour facts must come from verified ATO data/tools/current page. Never invent them.
- A Special Offers calculation is a potential-savings check, not proof of eligibility. Only the real Special Offers flow / ATO Manager may confirm the final offer and payable amount.\n- Weather is live forecast data but does NOT prove availability or operation.\n- Never say a booking, seat, pickup, payment or reservation is confirmed unless a real backend/ATO confirmation exists.\n- Never collect or process card number/CVV in chat.\n- The correct final path is: AI recommendation -> visitor approval -> ATO/backend availability + exact price confirmation -> secure payment page.\n- If the visitor is ready but availability is not verified, set next_action=ready_to_request_booking or manager_handoff, not payment_after_confirmation.\n- payment_after_confirmation is allowed only when CURRENT PAGE explicitly says backend availability and exact total are confirmed.\n\nLEAD PROFILE:\nReturn only facts the visitor actually stated or that are explicit in current page/session. Keep missing fields null/empty. Preserve previously stated facts from RECENT CONVERSATION.\n\nVERIFIED ATO CONTEXT RETRIEVED:\n${verified||'No matching records retrieved yet. Use tools before stating exact commercial facts.'}`; }

function extractStructured(data){ const text=typeof data?.output_text==='string'?data.output_text.trim():''; if(text){try{return JSON.parse(text)}catch{}} for(const item of data?.output||[]){ if(item?.type==='message') for(const c of item.content||[]){ if(c?.type==='output_text'&&typeof c.text==='string'){try{return JSON.parse(c.text)}catch{}} } } return null; }
function functionCalls(data){ return (data?.output||[]).filter(x=>x?.type==='function_call'); }

async function openaiRequest(payload,signal){ const r=await fetch(OPENAI_URL,{method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(payload),signal}); const data=await r.json().catch(()=>({})); if(!r.ok){const e=new Error(data?.error?.message||`OpenAI HTTP ${r.status}`); e.status=r.status; throw e;} return data; }

module.exports=async function handler(req,res){
  if(req.method!=='POST')return send(res,405,{error:'Method not allowed.'});
  if(!process.env.OPENAI_API_KEY)return send(res,503,{error:'AI Assistant is not configured yet.'});
  if(!allowRequest(req))return send(res,429,{error:'Too many requests. Please try again shortly.'});
  if(Number(req.headers['content-length']||0)>MAX_BODY_BYTES)return send(res,413,{error:'Request is too large.'});
  const body=req.body&&typeof req.body==='object'?req.body:(()=>{try{return JSON.parse(req.body||'{}')}catch{return{}}})();
  const message=clean(body?.message,MAX_MESSAGE); if(!message)return send(res,400,{error:'Message is required.'});
  const history=normalizeHistory(body?.history), page=structuredPage(body?.page||{}), agentState=normalizeAgentState(body?.agent_state||{}), matches=knowledgeMatches(message,page), verified=compactKnowledge(matches), model=chooseModel(message,page);
  const responseLanguage=detectMessageLanguage(message,body?.language,body?.message_language);
  const historyText=history.map(x=>`${x.role==='assistant'?'ATO ASSISTANT':'VISITOR'}: ${x.content}`).join('\n\n');
  const userText=[`REMEMBERED SESSION PROFILE:\n${JSON.stringify(agentState.lead_profile)}`,historyText?`RECENT CONVERSATION:\n${historyText}`:'',`CURRENT VISITOR MESSAGE:\n${message}`].filter(Boolean).join('\n\n');
  const instructions=buildInstructions(body?.language,responseLanguage,page,verified,agentState);
  let input=[{role:'user',content:[{type:'input_text',text:userText}]}];
  const controller=new AbortController(), timeout=setTimeout(()=>controller.abort(),28_000);
  let lastWeather=null, lastOffer=null, toolTrace=[];
  try{
    for(let round=0;round<4;round++){
      const data=await openaiRequest({model,instructions,input,tools:TOOLS,tool_choice:'auto',parallel_tool_calls:true,max_output_tokens:1200,store:false,text:{format:{type:'json_schema',name:'ato_sales_agent_response',strict:true,schema:OUTPUT_SCHEMA}}},controller.signal);
      const calls=functionCalls(data);
      if(!calls.length){ const result=extractStructured(data); if(!result)throw new Error('Structured agent response missing.'); if(lastWeather&&(!result.weather?.days?.length)){ result.weather={location:lastWeather.location||null,best_weather_day:lastWeather.best_weather_comfort_day||null,best_day_reason:lastWeather.best_day_reason||null,days:(lastWeather.days||[]).map(d=>({date:d.date,max_c:d.max_c,min_c:d.min_c,precip_probability_percent:d.precip_probability_percent,wind_max_kmh:d.wind_max_kmh,summary:d.summary})),disclaimer:lastWeather.disclaimer||null}; }
        if(lastOffer&&(!result.offer_rescue||result.offer_rescue.status==='none')){
          result.offer_rescue={
            status:lastOffer.status||'manager_confirmation',
            original_total_eur:lastOffer.original_total_eur??null,
            discounted_total_eur:lastOffer.discounted_total_eur??null,
            savings_eur:lastOffer.savings_eur??null,
            lines:Array.isArray(lastOffer.lines)?lastOffer.lines.slice(0,4):[],
            note:lastOffer.note||'',
            offer_url:lastOffer.offer_url||'/special-offers.html'
          };
          if(result.next_action==='continue_discovery') result.next_action='review_special_offer';
        }
        return send(res,200,{...result,model,response_language:responseLanguage,context_mode:page.mode||'generic',knowledge_matches:matches.map(x=>x.title).slice(0,5),tool_trace:toolTrace}); }
      input.push(...(data.output||[]));
      const outputs=[];
      for(const call of calls){ let args={}; try{args=JSON.parse(call.arguments||'{}')}catch{} const result=await runTool(call.name,args); if(call.name==='get_weather_forecast')lastWeather=result; if(call.name==='check_special_offers_savings')lastOffer=result; toolTrace.push(call.name); outputs.push({type:'function_call_output',call_id:call.call_id,output:JSON.stringify(result).slice(0,18000)}); }
      input.push(...outputs);
    }
    return send(res,502,{error:'The travel agent could not complete the request safely.'});
  }catch(e){ if(e?.name==='AbortError')return send(res,504,{error:'The assistant took too long to respond. Please try again.'}); console.error('ATO Sales Agent error',e?.message||e); return send(res,e?.status===429?429:500,{error:e?.status===429?'The assistant is busy. Please try again shortly.':'The assistant is temporarily unavailable.'}); }
  finally{clearTimeout(timeout);}
};

// Optional test exports (ignored by Vercel runtime).
module.exports.__test={parseAdultPrice,childCostForAge,estimateGroupPrice,groupOffer,checkSpecialOffersSavings,searchTours,compareTours,getVipEventComponents,normalizeAgentState,detectMessageLanguage};
