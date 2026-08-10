/* ALANYA TOUR ORGANIZATIONS — runtime configuration
   Fill the Supabase values after running supabase/booking-schema.sql.
   Weather uses the free MET Norway Locationforecast service through /api/weather.
*/
window.ATO_CONFIG = Object.assign({
  supabaseUrl: 'https://gryyphkbcdibrribzccn.supabase.co',
  supabasePublishableKey: 'sb_publishable_pzMSu9hTzwyZgRKMhPyj2w_aAcApP3P',
  siteBaseUrl: 'https://alanya-tour-organizations.vercel.app',
  managerWhatsApp: '905387045999',
  weather: {
    enabled: true,
    provider: 'met-norway',
    apiBase: '/api/weather',
    latitude: 36.5438,
    longitude: 31.9998,
    timezone: 'Europe/Istanbul',
    forecastWindowDays: 9
  }
}, window.ATO_CONFIG || {});
