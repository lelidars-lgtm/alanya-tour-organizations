/* ALANYA TOUR ORGANIZATIONS — free MET Norway weather proxy for Vercel
   Source: MET Norway Locationforecast 2.0
   No API key required. This proxy identifies the site with a User-Agent,
   caches responses, and returns daily values for the Trip Planner/e-ticket.
*/

const MET_ENDPOINT = 'https://api.met.no/weatherapi/locationforecast/2.0/complete';
const DEFAULT_LAT = 36.5438;
const DEFAULT_LON = 31.9998;
const TIMEZONE = 'Europe/Istanbul';
const USER_AGENT = 'AlanyaTourOrganizations/1.0 https://alanya-tour-organizations.vercel.app';

function roundCoord(v, fallback) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.round(n * 10000) / 10000;
}

function localParts(iso) {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(d).reduce((acc, p) => (acc[p.type] = p.value, acc), {});
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    hour: Number(parts.hour || 0)
  };
}

function localToday() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date()).reduce((acc, p) => (acc[p.type] = p.value, acc), {});
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function asNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function maxMaybe(a, b) {
  if (b == null) return a;
  return a == null ? b : Math.max(a, b);
}

function minMaybe(a, b) {
  if (b == null) return a;
  return a == null ? b : Math.min(a, b);
}

function conditionFromSymbol(symbol = '') {
  const s = String(symbol).toLowerCase();
  if (!s) return 'Forecast available';
  if (s.includes('thunder')) return 'Thunderstorms';
  if (s.includes('heavyrain')) return 'Heavy rain';
  if (s.includes('rain')) return 'Rain';
  if (s.includes('sleet')) return 'Sleet';
  if (s.includes('snow')) return 'Snow';
  if (s.includes('fog')) return 'Fog';
  if (s.includes('partlycloudy')) return 'Partly cloudy';
  if (s.includes('cloudy')) return 'Cloudy';
  if (s.includes('fair')) return 'Mostly clear';
  if (s.includes('clearsky')) return 'Clear sky';
  return 'Forecast available';
}

function aggregate(data) {
  const rows = data?.properties?.timeseries || [];
  const byDay = new Map();
  for (const row of rows) {
    const lp = localParts(row.time);
    let d = byDay.get(lp.date);
    if (!d) {
      d = {
        date: lp.date,
        min: null, max: null,
        humiditySum: 0, humidityCount: 0,
        windMs: null, gustMs: null,
        windDirection: null,
        precipitationMm: 0,
        precipitationProbability: null,
        cloudSum: 0, cloudCount: 0,
        symbol: '', symbolDistance: 99,
        points: 0
      };
      byDay.set(lp.date, d);
    }

    d.points += 1;
    const instant = row?.data?.instant?.details || {};
    const temp = asNum(instant.air_temperature);
    const hum = asNum(instant.relative_humidity);
    const wind = asNum(instant.wind_speed);
    const gust = asNum(instant.wind_speed_of_gust);
    const dir = asNum(instant.wind_from_direction);
    const cloud = asNum(instant.cloud_area_fraction);

    d.min = minMaybe(d.min, temp);
    d.max = maxMaybe(d.max, temp);
    d.windMs = maxMaybe(d.windMs, wind);
    d.gustMs = maxMaybe(d.gustMs, gust);
    if (dir != null && Math.abs(lp.hour - 12) < 4) d.windDirection = dir;
    if (hum != null) { d.humiditySum += hum; d.humidityCount += 1; }
    if (cloud != null) { d.cloudSum += cloud; d.cloudCount += 1; }

    // Prefer non-overlapping 1h periods. Medium-range data switches to 6h steps.
    const period = row?.data?.next_1_hours || row?.data?.next_6_hours || null;
    if (period) {
      const pd = period.details || {};
      const mm = asNum(pd.precipitation_amount);
      const prob = asNum(pd.probability_of_precipitation);
      if (mm != null) d.precipitationMm += mm;
      d.precipitationProbability = maxMaybe(d.precipitationProbability, prob);

      const symbol = period?.summary?.symbol_code || '';
      const distance = Math.abs(lp.hour - 12);
      if (symbol && distance < d.symbolDistance) {
        d.symbol = symbol;
        d.symbolDistance = distance;
      }
    }
  }

  const today = localToday();
  return [...byDay.values()].sort((a, b) => a.date.localeCompare(b.date)).map(d => ({
    date: d.date,
    condition: conditionFromSymbol(d.symbol),
    symbol: d.symbol,
    temperatureMinC: d.min == null ? null : Math.round(d.min * 10) / 10,
    temperatureMaxC: d.max == null ? null : Math.round(d.max * 10) / 10,
    humidityPct: d.humidityCount ? Math.round(d.humiditySum / d.humidityCount) : null,
    cloudPct: d.cloudCount ? Math.round(d.cloudSum / d.cloudCount) : null,
    windKmh: d.windMs == null ? null : Math.round(d.windMs * 3.6),
    gustKmh: d.gustMs == null ? null : Math.round(d.gustMs * 3.6),
    windDirectionDeg: d.windDirection == null ? null : Math.round(d.windDirection),
    precipitationMm: Math.round(d.precipitationMm * 10) / 10,
    precipitationProbabilityPct: d.precipitationProbability == null ? null : Math.round(d.precipitationProbability),
    partialToday: d.date === today,
    points: d.points
  }));
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const lat = roundCoord(req.query?.lat, DEFAULT_LAT);
  const lon = roundCoord(req.query?.lon, DEFAULT_LON);
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return res.status(400).json({ error: 'Invalid coordinates' });
  }

  const url = `${MET_ENDPOINT}?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
  try {
    const upstream = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json'
      }
    });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '');
      return res.status(502).json({
        error: `MET Norway returned ${upstream.status}`,
        detail: text.slice(0, 180)
      });
    }

    const data = await upstream.json();
    const days = aggregate(data);

    let ttl = 1800;
    const expires = upstream.headers.get('expires');
    if (expires) {
      const seconds = Math.floor((new Date(expires).getTime() - Date.now()) / 1000);
      if (Number.isFinite(seconds) && seconds > 60) ttl = Math.min(Math.max(seconds, 300), 21600);
    }

    res.setHeader('Cache-Control', `public, s-maxage=${ttl}, stale-while-revalidate=300`);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json({
      provider: 'MET Norway',
      product: 'Locationforecast 2.0',
      license: 'CC BY 4.0',
      attribution: 'Weather data: MET Norway · processed into daily guidance by ALANYA TOUR ORGANIZATIONS',
      latitude: lat,
      longitude: lon,
      timezone: TIMEZONE,
      updatedAt: data?.properties?.meta?.updated_at || new Date().toISOString(),
      days
    });
  } catch (err) {
    return res.status(502).json({ error: 'Weather service unavailable', detail: String(err?.message || err) });
  }
};
