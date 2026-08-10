(() => {
  'use strict';
  const cfg=()=>window.ATO_CONFIG?.weather||{};
  const num=v=>Number.isFinite(Number(v))?Number(v):null;
  const daysAway=date=>{
    if(!date)return null;
    const d=new Date(date+'T12:00:00'),t=new Date();t.setHours(12,0,0,0);
    return Math.ceil((d-t)/86400000);
  };
  function profile(tour={}){
    const s=`${tour.category||''} ${tour.title||''} ${tour.href||''}`.toLowerCase();
    if(/paragl|skydive|helicopter|air/.test(s))return 'air';
    if(/yacht|boat|sea|fishing|parasail|jet.?ski|diving|water|wakeboard|ringo|banana|sofa|sup|e-foil/.test(s))return 'marine';
    if(/rafting|safari|quad|buggy|canyon|nature|horse/.test(s))return 'outdoor';
    return 'general';
  }
  function statusFor(date){
    const c=cfg(),delta=daysAway(date),windowDays=Number(c.forecastWindowDays||15);
    if(!date)return {state:'missing-date',message:'Tour date is not confirmed yet.'};
    if(delta===null)return {state:'missing-date',message:'Tour date is not confirmed yet.'};
    if(delta<0)return {state:'past',message:'This tour date has already passed.'};
    if(delta>windowDays)return {state:'too-early',message:'Live weather recommendations will become available closer to your tour date.'};
    if(!c.enabled||!c.apiBase||!c.apiKey)return {state:'not-connected',message:'Live weather connection is prepared but the commercial weather API is not connected yet.'};
    return {state:'ready',message:'Live forecast available.'};
  }
  async function getForecast(tour,date){
    const c=cfg(),status=statusFor(date); if(status.state!=='ready')return {...status,date,profile:profile(tour)};
    const lat=Number(c.latitude),lon=Number(c.longitude),tz=c.timezone||'Europe/Istanbul';
    const q=new URLSearchParams({latitude:String(lat),longitude:String(lon),timezone:tz,start_date:date,end_date:date,apikey:c.apiKey,daily:'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max'});
    const res=await fetch(`${c.apiBase}?${q}`); if(!res.ok)throw new Error(`Weather API ${res.status}`); const data=await res.json();
    const d=data.daily||{},out={state:'live',date,profile:profile(tour),updatedAt:new Date().toISOString(),air:{code:num(d.weather_code?.[0]),max:num(d.temperature_2m_max?.[0]),min:num(d.temperature_2m_min?.[0]),rain:num(d.precipitation_probability_max?.[0]),wind:num(d.wind_speed_10m_max?.[0]),gust:num(d.wind_gusts_10m_max?.[0])}};
    if(out.profile==='marine'&&c.marineApiBase){
      try{
        const mq=new URLSearchParams({latitude:String(lat),longitude:String(lon),timezone:tz,start_date:date,end_date:date,apikey:c.apiKey,daily:'wave_height_max,wave_period_max'});
        const mr=await fetch(`${c.marineApiBase}?${mq}`); if(mr.ok){const md=await mr.json(),dd=md.daily||{};out.marine={wave:num(dd.wave_height_max?.[0]),period:num(dd.wave_period_max?.[0])};}
      }catch(_){ }
    }
    out.guidance=buildGuidance(out,tour);return out;
  }
  function buildGuidance(f,tour){
    if(f.state!=='live')return [f.message];
    const a=f.air||{},g=[];
    if(a.max!=null)g.push(`Air temperature: ${Math.round(a.min)}–${Math.round(a.max)}°C`);
    if(a.rain!=null)g.push(`Precipitation probability: ${Math.round(a.rain)}%`);
    if(a.wind!=null)g.push(`Wind up to ${Math.round(a.wind)} km/h${a.gust!=null?`, gusts ${Math.round(a.gust)} km/h`:''}`);
    if(f.marine?.wave!=null)g.push(`Wave height up to ${f.marine.wave.toFixed(1)} m${f.marine.period!=null?`, period ${f.marine.period.toFixed(0)} s`:''}`);
    const p=f.profile;
    if((p==='air'||p==='marine')&&((a.gust||0)>=40||(a.rain||0)>=60))g.push('Weather conditions may affect this activity — confirmation recommended.');
    else if(p==='outdoor'&&((a.max||0)>=36||(a.rain||0)>=60))g.push('Weather may change comfort or timing — check the latest guidance before departure.');
    else g.push('No automatic cancellation is inferred from forecast data; the manager/operator confirms operational conditions.');
    return g;
  }
  window.ATOWeather={profile,statusFor,getForecast,buildGuidance,daysAway};
})();
