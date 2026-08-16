(() => {
  'use strict';

  function addPhoneField() {
    const hotel = document.getElementById('requestHotel');
    if (!hotel || document.getElementById('requestPhone')) return;
    const field = document.createElement('div');
    field.className = 'request-field';
    field.innerHTML = '<label for="requestPhone">WHATSAPP NUMBER *</label>' +
      '<input id="requestPhone" name="phone" required autocomplete="tel" inputmode="tel" placeholder="+90 …">';
    hotel.closest('.request-field')?.before(field);
  }

  async function submitToCanonicalBooking(event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || form.id !== 'managerRequestForm') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const ids = data.getAll('requestTour').map(String);
    if (!ids.length) return alert('Please select at least one tour.');
    const childCount = Number(data.get('children') || 0);
    const childAges = String(data.get('childAges') || '').trim();
    if (childCount > 0 && !childAges) {
      const field = document.getElementById('requestChildAges');
      field.setCustomValidity("Please enter the children's ages.");
      field.reportValidity();
      field.focus();
      return;
    }
    document.getElementById('requestChildAges')?.setCustomValidity('');

    if (!window.ATOBooking?.createTripRequest || !window.ATOBooking.configured?.()) {
      return alert('Booking Manager connection is unavailable. The request was not sent.');
    }

    const selected = ids.map(id => tours.find(t => t.id === id)).filter(Boolean);
    const specials = data.getAll('special').map(String);
    const comparison = comparisonShareData().url;
    const requestTours = selected.map(t => ({
      id: t.id,
      title: t.title,
      category: (t.categories || [])[0] || 'tour',
      requested_date: form.querySelector(`[data-tour-date="${CSS.escape(t.id)}"]`)?.value || '',
      price_display: t.price == null ? 'Price on request' : `€${t.price}`,
      page: new URL(t.page, location.href).href,
      pickup: data.get('pickup')
    }));
    const payload = {
      source: 'interactive-map',
      travel_start: data.get('arrival') || null,
      travel_end: data.get('departure') || null,
      guest_name: String(data.get('name') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      hotel: String(data.get('hotel') || '').trim(),
      room: '',
      adults: Number(data.get('adults') || 1),
      children: childCount ? `${childCount} child(ren)${childAges ? ` — ages ${childAges}` : ''}` : '',
      pregnancy: specials.includes('Pregnancy'),
      elderly: specials.includes('Elderly guest'),
      mobility: specials.filter(x => x !== 'Pregnancy' && x !== 'Elderly guest').join(', ') || 'No',
      language: data.get('language') || 'English',
      notes: String(data.get('notes') || ''),
      prefs: { hotel_pickup: data.get('pickup'), comparison_url: comparison },
      tours: requestTours
    };

    const submit = form.querySelector('.request-submit');
    const requestWindow = window.open('about:blank', '_blank');
    submit.disabled = true;
    submit.textContent = 'SAVING REQUEST…';
    try {
      const saved = await window.ATOBooking.createTripRequest(payload);
      const requestNo = saved?.data?.request_no || 'Created';
      const tourLines = requestTours.map((t, index) =>
        `${index + 1}. ${t.title} — ${t.price_display}\nPreferred date: ${t.requested_date || 'Flexible'}\n${t.page}`
      );
      const message = `NEW TOUR REQUEST — ALANYA TOUR ORGANIZATIONS\nRequest: ${requestNo}\nSource: Interactive Map\n\nCLIENT\nName: ${payload.guest_name}\nWhatsApp: ${payload.phone}\nHotel: ${payload.hotel}\nStay dates: ${payload.travel_start || 'Not specified'} — ${payload.travel_end || 'Not specified'}\nGuests: ${payload.adults} adult(s), ${childCount} child(ren)${childAges ? ` — ages ${childAges}` : ''}\nLanguage: ${payload.language}\nHotel pickup: ${data.get('pickup')}\n\nSELECTED TOURS\n${tourLines.join('\n\n')}\n\nSPECIAL INFORMATION\n${specials.length ? specials.join(', ') : 'None specified'}\n\nADDITIONAL NOTES\n${payload.notes || 'None'}\n\nPlease confirm availability, dates, final price, child price and pickup details.\n\nCOMPARISON\n${comparison}`;
      const target = `https://wa.me/${window.ATO_BOOKING_CONFIG?.bookingWhatsApp || '905387045999'}?text=${encodeURIComponent(message)}`;
      if (requestWindow) requestWindow.location.href = target;
      else location.href = target;
      closeManagerRequest();
      form.reset();
    } catch (error) {
      requestWindow?.close();
      alert(`The request was not saved: ${error?.message || error}`);
    } finally {
      submit.disabled = false;
      submit.textContent = 'SEND COMPLETE REQUEST VIA WHATSAPP';
    }
  }

  addPhoneField();
  document.addEventListener('submit', submitToCanonicalBooking, true);
})();
