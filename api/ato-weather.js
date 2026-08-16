export default {
  async fetch(request) {
    if (request.method !== 'GET') {
      return Response.json({ok:false,message:'Method not allowed'},{status:405,headers:{Allow:'GET'}});
    }

    const url = new URL(request.url);
    const lat = Number(url.searchParams.get('lat'));
    const lon = Number(url.searchParams.get('lon'));
    const date = String(url.searchParams.get('date') || '').trim();
    if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180 || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return Response.json({ok:false,message:'Invalid coordinates or date'},{status:400});
    }

    try {
      const metUrl = new URL('https://api.met.no/weatherapi/locationforecast/2.0/compact');
      metUrl.searchParams.set('lat', lat.toFixed(4));
      metUrl.searchParams.set('lon', lon.toFixed(4));
      const met = await fetch(metUrl, {
        headers: {
          'User-Agent': 'ALANYA-TOUR-ORGANIZATIONS/1.0 (+https://alanyatourorganizations.com)',
          'Accept': 'application/json'
        }
      });
      if (!met.ok) {
        const body = await met.text().catch(()=>'');
        return Response.json({ok:false,message:`MET Norway returned ${met.status}`,detail:body.slice(0,180)},{status:502});
      }
      const json = await met.json();
      const series = Array.isArray(json?.properties?.timeseries) ? json.properties.timeseries : [];

      const dateInTurkey = iso => {
        const parts = new Intl.DateTimeFormat('en-CA', {timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'}).formatToParts(new Date(iso));
        const get = t => parts.find(x=>x.type===t)?.value || '';
        return {date:`${get('year')}-${get('month')}-${get('day')}`, hour:Number(get('hour')||0)};
      };
      const points = series.map(x=>({x,local:dateInTurkey(x.time)})).filter(p=>p.local.date===date);
      if (!points.length) return Response.json({ok:false,message:'Forecast for this date is not available yet'},{status:404});

      const temps=[], winds=[], gusts=[]; let rain1=0, hasRain1=false, rain6=0, hasRain6=false;
      for (const {x} of points) {
        const d=x?.data?.instant?.details||{};
        if(Number.isFinite(Number(d.air_temperature))) temps.push(Number(d.air_temperature));
        if(Number.isFinite(Number(d.wind_speed))) winds.push(Number(d.wind_speed)*3.6);
        if(Number.isFinite(Number(d.wind_speed_of_gust))) gusts.push(Number(d.wind_speed_of_gust)*3.6);
        const p1=Number(x?.data?.next_1_hours?.details?.precipitation_amount);
        if(Number.isFinite(p1)){rain1+=p1;hasRain1=true;}
        const p6=Number(x?.data?.next_6_hours?.details?.precipitation_amount);
        if(Number.isFinite(p6)){rain6+=p6;hasRain6=true;}
      }
      const representative = points.reduce((best,p)=> Math.abs(p.local.hour-12)<Math.abs(best.local.hour-12)?p:best, points[0]).x;
      const symbol = representative?.data?.next_1_hours?.summary?.symbol_code || representative?.data?.next_6_hours?.summary?.symbol_code || representative?.data?.next_12_hours?.summary?.symbol_code || '';
      const min = a => a.length?Math.min(...a):null, max=a=>a.length?Math.max(...a):null;

      return Response.json({
        ok:true,
        day:{
          date,
          symbol,
          temperatureMinC:min(temps),
          temperatureMaxC:max(temps),
          precipitationMm:hasRain1?rain1:(hasRain6?rain6:null),
          windKmh:winds.length?Math.max(...winds):null,
          gustKmh:gusts.length?Math.max(...gusts):null
        },
        source:'MET Norway',
        license:'CC BY 4.0'
      },{
        status:200,
        headers:{'Cache-Control':'public, s-maxage=1800, stale-while-revalidate=1800'}
      });
    } catch (error) {
      console.error('ato-weather proxy', error);
      return Response.json({ok:false,message:'Weather service unavailable'},{status:500});
    }
  }
};
