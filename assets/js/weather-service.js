(() => {
  'use strict';

  const TOUR_LOCATIONS = {"parasailing.html":{"lat":36.5188,"lon":32.033,"name":"Alanya","profile":"sea"},"jet-ski.html":{"lat":36.518,"lon":32.0337,"name":"Alanya","profile":"sea"},"e-foil.html":{"lat":36.5173,"lon":32.0345,"name":"Alanya","profile":"sea"},"wakeboard.html":{"lat":36.5168,"lon":32.0355,"name":"Alanya","profile":"sea"},"water-ski.html":{"lat":36.5167,"lon":32.0365,"name":"Alanya","profile":"sea"},"luxury-jet-car.html":{"lat":36.5171,"lon":32.0374,"name":"Alanya","profile":"sea"},"speed-boat-tour.html":{"lat":36.5178,"lon":32.0382,"name":"Alanya","profile":"sea"},"twister.html":{"lat":36.5188,"lon":32.0387,"name":"Alanya","profile":"sea"},"banana-boat.html":{"lat":36.5198,"lon":32.0382,"name":"Alanya","profile":"sea"},"sofa-ride.html":{"lat":36.5205,"lon":32.0373,"name":"Alanya","profile":"sea"},"sup-boarding.html":{"lat":36.519,"lon":32.0338,"name":"Alanya","profile":"sea"},"scuba-diving.html":{"lat":36.5325,"lon":32.0085,"name":"Alanya","profile":"sea"},"pirate-yacht.html":{"lat":36.535,"lon":32.004,"name":"Alanya","profile":"sea"},"relax-boat-tour.html":{"lat":36.535,"lon":32.0,"name":"Alanya","profile":"sea"},"catamaran.html":{"lat":36.5345,"lon":32.002,"name":"Alanya","profile":"sea"},"private-fishing-tour.html":{"lat":36.535,"lon":32.008,"name":"Alanya","profile":"sea"},"fishing-tour.html":{"lat":36.535,"lon":32.006,"name":"Alanya","profile":"sea"},"adrasan-suluada-porto-genovese.html":{"lat":36.3,"lon":30.479,"name":"Alanya","profile":"sea"},"gazipasa-bays.html":{"lat":36.225,"lon":32.3775,"name":"Gazipaşa","profile":"sea"},"luxury-yacht-cruise.html":{"lat":36.535,"lon":32.005,"name":"Alanya","profile":"sea"},"paragliding.html":{"lat":36.576364,"lon":31.970806,"name":"Alanya","profile":"air"},"helicopter-flight.html":{"lat":36.559274,"lon":31.938977,"name":"Alanya","profile":"air"},"skydive-experience.html":{"lat":36.77657,"lon":31.42822,"name":"Aspendos / Side / Manavgat","profile":"air"},"rafting-koprulu-canyon.html":{"lat":37.1919,"lon":31.1809,"name":"Köprülü Canyon","profile":"outdoor"},"jeep-safari.html":{"lat":36.6399,"lon":31.9956,"name":"Alanya","profile":"outdoor"},"quad-safari.html":{"lat":36.635,"lon":32.055,"name":"Alanya","profile":"outdoor"},"family-jeep-safari.html":{"lat":36.631,"lon":32.015,"name":"Alanya","profile":"outdoor"},"family-buggy-safari.html":{"lat":36.62,"lon":32.082,"name":"Alanya","profile":"outdoor"},"green-canyon.html":{"lat":36.9079,"lon":31.5307,"name":"Aspendos / Side / Manavgat","profile":"outdoor"},"sapadere-canyon.html":{"lat":36.5276,"lon":32.3136,"name":"Alanya","profile":"outdoor"},"pamukkale-salda.html":{"lat":37.9236,"lon":29.1208,"name":"Pamukkale","profile":"outdoor"},"horse-riding.html":{"lat":36.4411,"lon":32.15595,"name":"Gazipaşa","profile":"outdoor"},"land-of-legends.html":{"lat":36.8767,"lon":31.1056,"name":"Belek","profile":"family"},"sealanya-dolphinpark.html":{"lat":36.5897,"lon":31.8711,"name":"Türkler / Alanya","profile":"family"},"eftalia-island-waterpark.html":{"lat":36.5945,"lon":31.8595,"name":"Türkler / Alanya","profile":"family"},"night-jeep-safari.html":{"lat":36.645,"lon":32.02,"name":"Alanya","profile":"outdoor"},"cappadocia.html":{"lat":38.6401,"lon":34.8454,"name":"Cappadocia","profile":"general"},"demre-myra-kekova.html":{"lat":36.2589,"lon":29.9851,"name":"Demre / Myra / Kekova","profile":"general"},"istanbul-tour.html":{"lat":41.0082,"lon":28.9784,"name":"Istanbul","profile":"general"},"syedra-ancient-city.html":{"lat":36.4397,"lon":32.1517,"name":"Syedra","profile":"general"},"anamur.html":{"lat":36.0803,"lon":32.8368,"name":"Anamur","profile":"general"},"aspendos.html":{"lat":36.9389,"lon":31.172,"name":"Aspendos / Side / Manavgat","profile":"general"},"alanya-city-tour.html":{"lat":36.544,"lon":31.999,"name":"Alanya","profile":"general"},"manavgat-aspendos-side.html":{"lat":36.7643,"lon":31.3864,"name":"Aspendos / Side / Manavgat","profile":"general"},"airport-vip-transfer.html":{"lat":36.299217,"lon":32.300598,"name":"Gazipaşa","profile":"general"},"private-yacht-charter.html":{"lat":36.535,"lon":32.002,"name":"Alanya","profile":"sea"},"personal-concierge.html":{"lat":36.533,"lon":32.0,"name":"Alanya","profile":"general"},"helicopter-experience.html":{"lat":36.559274,"lon":31.938977,"name":"Alanya","profile":"air"},"private-photographer.html":{"lat":36.533,"lon":32.0,"name":"Alanya","profile":"general"},"turkish-hammam.html":{"lat":36.5593,"lon":32.0125,"name":"Alanya","profile":"wellness"},"turkish-massage-spa.html":{"lat":36.5593,"lon":32.0125,"name":"Alanya","profile":"wellness"}};
  const DEFAULT_LOCATION = {lat:36.54375, lon:31.99982, name:'Alanya', profile:'general'};

  const clean = v => String(v ?? '').trim();
  const basename = value => {
    const raw=clean(value); if(!raw) return '';
    try { return new URL(raw, location.origin).pathname.split('/').filter(Boolean).pop() || ''; }
    catch(_) { return raw.split('?')[0].split('#')[0].split('/').pop() || ''; }
  };

  function profile(tour={}) {
    if(clean(tour.weather_profile)) return clean(tour.weather_profile).toLowerCase();
    const cats=Array.isArray(tour.categories)?tour.categories.map(x=>String(x).toLowerCase()):String(tour.category||'').toLowerCase().split(/[,&]/).map(x=>x.trim());
    const title=clean(tour.title||tour.name).toLowerCase();
    if(cats.includes('air')||/paraglid|skydive|helicopter/.test(title)) return 'air';
    if(cats.includes('water')||cats.includes('sea')||/boat|yacht|diving|jet ski|parasail|wakeboard|fishing|e-?foil|sup|banana|twister|sofa/.test(title)) return 'sea';
    if(cats.includes('extreme')||cats.includes('nature')||/rafting|buggy|quad|jeep|canyon|horse/.test(title)) return 'outdoor';
    if(cats.includes('family')) return 'family';
    if(cats.includes('wellness')) return 'wellness';
    return 'general';
  }

  function locationFor(tour={}) {
    const lat=Number(tour.weather_lat ?? tour.lat);
    const lon=Number(tour.weather_lon ?? tour.lon ?? tour.lng);
    if(Number.isFinite(lat)&&Number.isFinite(lon)) return {lat,lon,name:clean(tour.weather_location)||'Tour location',profile:profile(tour)};
    const key=basename(tour.href||tour.page||tour.url);
    const known=TOUR_LOCATIONS[key];
    if(known) return {...known,profile:profile(tour)||known.profile};
    const title=clean(tour.title||tour.name).toLowerCase();
    const special =
      /istanbul/.test(title)?{lat:41.0082,lon:28.9784,name:'Istanbul'}:
      /cappadocia/.test(title)?{lat:38.6431,lon:34.8289,name:'Cappadocia'}:
      /pamukkale/.test(title)?{lat:37.9137,lon:29.1187,name:'Pamukkale'}:
      /demre|myra|kekova/.test(title)?{lat:36.2444,lon:29.9853,name:'Demre / Kekova'}:
      /aspendos|side|manavgat/.test(title)?{lat:36.7863,lon:31.1659,name:'Side / Manavgat'}:
      /land of legends|belek/.test(title)?{lat:36.8765,lon:31.0056,name:'Belek'}:
      /rafting|köpr|kopr/.test(title)?{lat:37.1917,lon:31.1814,name:'Köprülü Canyon'}:
      DEFAULT_LOCATION;
    return {...special,profile:profile(tour)};
  }

  function turkeyDateISO(date=new Date()) {
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
    const get=t=>parts.find(x=>x.type===t)?.value||'';
    return `${get('year')}-${get('month')}-${get('day')}`;
  }
  function daysUntil(iso) {
    if(!/^\d{4}-\d{2}-\d{2}$/.test(clean(iso))) return null;
    const today=turkeyDateISO();
    const a=Date.parse(today+'T00:00:00+03:00');
    const b=Date.parse(iso+'T00:00:00+03:00');
    return Number.isFinite(b)?Math.round((b-a)/86400000):null;
  }

  const CONDITION_LABELS = [
    [/thunder/,'Thunderstorms'],[/heavyrain|rainshowers/,'Rain showers'],[/rain/,'Rain'],[/heavysnow|snowshowers/,'Snow showers'],[/snow|sleet/,'Snow / sleet'],[/fog/,'Fog'],[/cloudy/,'Cloudy'],[/partlycloudy/,'Partly cloudy'],[/fair/,'Mostly fair'],[/clearsky/,'Clear sky']
  ];
  function conditionLabel(symbol='') {
    const s=String(symbol).toLowerCase();
    for(const [re,label] of CONDITION_LABELS) if(re.test(s)) return label;
    return 'Forecast';
  }
  function conditionIcon(symbol='') {
    const s=String(symbol).toLowerCase();
    if(/thunder/.test(s))return '⚡'; if(/rain/.test(s))return '☂'; if(/snow|sleet/.test(s))return '❄';
    if(/fog/.test(s))return '≋'; if(/cloudy/.test(s))return '☁'; if(/partlycloudy/.test(s))return '◒'; if(/fair|clearsky/.test(s))return '☀'; return '◌';
  }

  function guidanceFor(kind,day={}) {
    const g=[]; const rain=Number(day.precipitationMm||0), wind=Number(day.windKmh||0), max=Number(day.temperatureMaxC);
    if(kind==='air') g.push(wind>=25?'Wind may affect air-activity operations. Final go/no-go is confirmed by the operator.':'Air activity: final wind and launch conditions are rechecked by the operator before departure.');
    else if(kind==='sea') g.push(wind>=25?'Wind may make sea conditions rougher; operating conditions are rechecked before departure.':'Sea activity: conditions are checked again before departure.');
    else if(kind==='outdoor') g.push(rain>=2?'Outdoor surfaces may be wet or slippery; use suitable footwear.':'Outdoor activity: comfortable closed shoes are recommended.');
    else if(kind==='family') g.push('Family day: keep water, sun protection and child essentials easy to reach.');
    if(Number.isFinite(max)&&max>=30) g.push('Hot weather expected: water, hat and high-SPF sun protection are important.');
    if(rain>=2) g.push('Rain is possible: bring a light waterproof layer if the tour page allows it.');
    if(!g.length) g.push('No major weather-specific preparation is indicated at this time.');
    return g.slice(0,3);
  }

  async function getForecast(tour,date) {
    const target=clean(date);
    if(!target) return {state:'waiting',message:'The excursion date must be confirmed before date-specific weather can be shown.',location:locationFor(tour),guidance:[]};
    const d=daysUntil(target);
    if(d===null) return {state:'error',message:'The confirmed excursion date is invalid.',location:locationFor(tour),guidance:[]};
    if(d<0) return {state:'unavailable',message:'Live weather guidance is no longer available for this past excursion date.',location:locationFor(tour),guidance:[]};
    if(d>9) return {state:'waiting',message:'Live weather recommendations will become available closer to your travel date.',location:locationFor(tour),guidance:[]};
    const loc=locationFor(tour);
    try {
      const url=new URL('/api/ato-weather',location.origin);
      url.searchParams.set('lat',String(loc.lat)); url.searchParams.set('lon',String(loc.lon)); url.searchParams.set('date',target);
      const res=await fetch(url,{cache:'no-store',headers:{Accept:'application/json'}});
      const data=await res.json().catch(()=>({}));
      if(!res.ok||data?.ok===false) throw new Error(data?.message||`Weather service error ${res.status}`);
      const day={...data.day,condition:conditionLabel(data.day?.symbol)};
      return {state:'live',location:{...loc,name:data.locationName||loc.name},day,guidance:guidanceFor(loc.profile||profile(tour),day),source:'MET Norway',license:'CC BY 4.0'};
    } catch(error) {
      console.error('ATO weather:',error);
      return {state:'error',message:'Live weather is temporarily unavailable. Please check again closer to departure.',location:loc,guidance:[]};
    }
  }

  window.ATOWeather={getForecast,locationFor,profile,conditionIcon,conditionLabel,daysUntil};
})();
