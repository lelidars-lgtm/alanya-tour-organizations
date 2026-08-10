/* ALANYA TOUR ORGANIZATIONS — runtime configuration
   Fill the Supabase values after running supabase/booking-schema.sql.
   Weather stays disabled until a commercial weather API subscription is connected.
*/
window.ATO_CONFIG = Object.assign({
  supabaseUrl: '',
  supabasePublishableKey: '',
  siteBaseUrl: 'https://alanya-tour-organizations.vercel.app',
  managerWhatsApp: '905387045999',
  weather: {
    enabled: false,
    provider: 'open-meteo-commercial',
    apiBase: '',
    marineApiBase: '',
    apiKey: '',
    latitude: 36.5438,
    longitude: 31.9998,
    timezone: 'Europe/Istanbul',
    forecastWindowDays: 15
  }
}, window.ATO_CONFIG || {});
