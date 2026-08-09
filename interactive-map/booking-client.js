(function () {
  'use strict';
  const cfg = window.ATO_BOOKING_CONFIG || {};
  const configured = () => /^https:\/\/.+\.supabase\.co\/?$/.test(cfg.supabaseUrl || '') && !String(cfg.supabaseAnonKey || '').startsWith('PASTE_');
  const makeNumber = () => `ATO-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
  async function createPending(payload) {
    if (!configured()) throw new Error('Booking Manager is not connected yet. Add the Supabase URL and anon key to booking-config.js.');
    const requestNumber = payload.request_number || makeNumber();
    const response = await fetch(`${String(cfg.supabaseUrl).replace(/\/$/,'')}/rest/v1/bookings`, {
      method: 'POST',
      headers: {
        apikey: cfg.supabaseAnonKey,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify({ ...payload, request_number: requestNumber, status: 'PENDING' })
    });
    if (!response.ok) {
      let detail = '';
      try {
        const problem = await response.json();
        detail = problem.message || problem.error_description || problem.error || '';
      } catch (_) {}
      throw new Error(`Booking save failed (${response.status})${detail ? `: ${detail}` : '.'}`);
    }
    const rows = await response.json();
    return rows[0] || { request_number: requestNumber };
  }
  window.ATOBooking = { configured, createPending };
  document.addEventListener('DOMContentLoaded', () => {
    const hotel = document.getElementById('requestHotel');
    if (!hotel || document.getElementById('requestPhone')) return;
    const field = document.createElement('div');
    field.className = 'request-field';
    field.innerHTML = '<label for="requestPhone">WHATSAPP NUMBER *</label><input id="requestPhone" name="phone" required autocomplete="tel" inputmode="tel" placeholder="+90 …">';
    hotel.closest('.request-field')?.before(field);
  });
})();
