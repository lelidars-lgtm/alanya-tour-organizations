(() => {
  'use strict';

  const FORECAST_WINDOW_DAYS = 9;
  const cache = new Map();

  const DESTINATIONS = [
    {re:/cappadocia|kapadok/i,name:'Cappadocia',lat:38.6431,lon:34.8289},
    {re:/istanbul/i,name:'Istanbul',lat:41.0082,lon:28.9784},
    {re:/pamukkale|salda/i,name:'Pamukkale',lat:37.9137,lon:29.1187},
    {re:/demre|myra|kekova/i,name:'Demre / Kekova',lat:36.2444,lon:29.9850},
    {re:/land.?of.?legends|belek/i,name:'Belek',lat:36.8625,lon:31.0556},
    {re:/aspendos|side|manavgat/i,name:'Side / Manavgat',lat:36.7869,lon:31.4436},
    {re:/anamur/i,name:'Anamur',lat:36.0751,lon:32.8369},
    {re:/syedra/i,name:'Syedra',lat:36.4333,lon:32.1519},
    {re:/rafting|köprülü|koprulu|canyon/i,name:'Köprülü Canyon',lat:37.1910,lon:31.1800}
  ];

  const ALANYA = {name:'Alanya',lat:36.5438,lon:31.9998};

  const num=v=>Number.isFinite(Number(v))?Number(v):null;
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();

  function daysAway(date){
    if(!date)return null;
    const d=new Date(date+'T12:00:00+03:00');
    const now=new Date();
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now).reduce((a,p)=>(a[p.type]=p.value,a),{});
    const today=new Date(`${parts.year}-${parts.month}-${parts.day}T12:00:00+03:00`);
    return Math.floor((d-today)/86400000);
  }

  function profile(tour={}){
    const s=`${tour.category||''} ${tour.title||''} ${tour.href||''}`.toLowerCase();
    if(/paragl|skydive|helicopter|air/.test(s))return 'air';
    if(/yacht|boat|sea|fishing|parasail|jet.?ski|diving|water|wakeboard|ringo|banana|sofa|sup|e-foil|catamaran/.test(s))return 'marine';
    if(/rafting|safari|quad|buggy|canyon|nature|horse/.test(s))return 'outdoor';
    if(/land.?of.?legends|dolphin|aquapark|waterpark|family/.test(s))return 'family';
    return 'general';
  }

  function locationFor(tour={}){
    const text=`${tour.title||''} ${tour.href||''} ${tour.category||''}`;
    return DESTINATIONS.find(x=>x.re.test(text)) || ALANYA;
  }

  function statusFor(date){
    const delta=daysAway(date);
    if(!date||delta===null)return {state:'missing-date',message:'Tour date is not confirmed yet.'};
    if(delta<0)return {state:'past',message:'This tour date has already passed.'};
    if(delta>FORECAST_WINDOW_DAYS)return {state:'too-early',message:'Live weather recommendations will become available closer to your travel date.'};
    return {state:'ready',message:'Live forecast is available.'};
  }

  async function fetchLocation(loc){
    const key=`${loc.lat.toFixed(4)},${loc.lon.toFixed(4)}`;
    if(cache.has(key))return cache.get(key);
    const promise=fetch(`/api/weather?lat=${encodeURIComponent(loc.lat)}&lon=${encodeURIComponent(loc.lon)}`,{
      headers:{'Accept':'application/json'}
    }).then(async r=>{
      const data=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(data?.error||`Weather service ${r.status}`);
      return data;
    });
    cache.set(key,promise);
    try{return await promise}catch(err){cache.delete(key);throw err}
  }

  function conditionIcon(symbol=''){
    const s=String(symbol).toLowerCase();
    if(s.includes('thunder'))return '⛈';
    if(s.includes('rain'))return '🌧';
    if(s.includes('snow')||s.includes('sleet'))return '🌨';
    if(s.includes('fog'))return '🌫';
    if(s.includes('partlycloudy'))return '⛅';
    if(s.includes('cloudy'))return '☁';
    if(s.includes('fair'))return '🌤';
    if(s.includes('clearsky'))return '☀';
    return '◌';
  }

  function buildGuidance(f,tour={}){
    if(f.state!=='live')return [f.message];
    const d=f.day||{},p=f.profile,g=[];
    const tMin=num(d.temperatureMinC),tMax=num(d.temperatureMaxC),rain=num(d.precipitationMm),rainP=num(d.precipitationProbabilityPct),wind=num(d.windKmh),gust=num(d.gustKmh);

    if(tMin!=null&&tMax!=null)g.push(`Air: ${Math.round(tMin)}–${Math.round(tMax)}°C`);
    if(rain!=null)g.push(`Rain: about ${rain.toFixed(rain<1?1:0)} mm${rainP!=null?` · up to ${Math.round(rainP)}% probability`:''}`);
    if(wind!=null)g.push(`Wind: up to ${Math.round(wind)} km/h${gust!=null?` · gusts ${Math.round(gust)} km/h`:''}`);

    if(p==='air'){
      if((rain||0)>=0.5||(gust||wind||0)>=25) g.push('Air activity: the forecast deserves extra attention — final flight approval is always made by the operator.');
      else g.push('Air activity: no strong weather flag is visible right now; the operator still makes the final flight decision.');
    } else if(p==='marine'){
      if((rain||0)>=3||(gust||wind||0)>=25) g.push('Sea activity: wind or rain may affect comfort or operation — confirmation recommended.');
      else g.push('Sea activity: no strong weather flag is visible in the current land-based forecast; the operator confirms actual sea conditions.');
    } else if(p==='outdoor'){
      if((tMax||0)>=34)g.push('Outdoor activity: a hot day is expected — water, sun protection and light clothing are recommended.');
      if((rain||0)>=3)g.push('Outdoor activity: rain may affect comfort or timing — check the latest guidance before departure.');
      if((tMax||0)<34&&(rain||0)<3)g.push('Outdoor activity: no major comfort warning is visible in the current forecast.');
    } else if(p==='family'){
      if((tMax||0)>=34)g.push('Family day: plan extra water, shade and sun protection.');
      if((rain||0)>=3)g.push('Family day: rain may affect outdoor parts of the program — confirmation recommended.');
      if((tMax||0)<34&&(rain||0)<3)g.push('Family day: current weather looks broadly suitable; availability still requires confirmation.');
    } else {
      if((tMax||0)>=34)g.push('Hot weather expected — take extra water and sun protection.');
      if((rain||0)>=3)g.push('Rain may affect comfort or timing — check the latest update before departure.');
      if((tMax||0)<34&&(rain||0)<3)g.push('No major weather concern is visible in the current forecast.');
    }

    g.push('Weather never automatically cancels a tour in Trip Planner; final operational confirmation comes from the manager/operator.');
    return g;
  }

  async function getForecast(tour,date){
    const status=statusFor(date);
    const loc=locationFor(tour);
    const p=profile(tour);
    if(status.state!=='ready')return {...status,date,profile:p,location:loc};
    try{
      const data=await fetchLocation(loc);
      const day=(data.days||[]).find(x=>x.date===date);
      if(!day){
        return {state:'too-early',date,profile:p,location:loc,message:'Live weather recommendations will become available closer to your travel date.',provider:data.provider||'MET Norway'};
      }
      const out={state:'live',date,profile:p,location:loc,day,provider:data.provider||'MET Norway',updatedAt:data.updatedAt||new Date().toISOString(),attribution:data.attribution||'Weather data: MET Norway'};
      out.guidance=buildGuidance(out,tour);
      return out;
    }catch(err){
      return {state:'error',date,profile:p,location:loc,message:'Live weather is temporarily unavailable. Please try again shortly.',error:String(err?.message||err)};
    }
  }

  window.ATOWeather={
    forecastWindowDays:FORECAST_WINDOW_DAYS,
    profile,locationFor,statusFor,getForecast,buildGuidance,daysAway,conditionIcon
  };
})();
