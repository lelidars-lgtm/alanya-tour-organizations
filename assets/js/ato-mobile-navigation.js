/**
 * ALANYA TOUR ORGANIZATIONS — MOBILE NAVIGATION
 * Native-link controller for phones and tablets only.
 * Desktop navigation is intentionally untouched.
 * Version: 2026-08-25-v1
 */
(() => {
  'use strict';

  if (window.__ATO_MOBILE_NAVIGATION_V1__) return;
  window.__ATO_MOBILE_NAVIGATION_V1__ = true;

  const mobile = window.matchMedia('(max-width: 980px)');

  function closePanels() {
    const root = document.getElementById('atoGlobalHeaderRoot');
    if (!root) return;

    root.querySelector('.nav')?.classList.remove('active');
    root.querySelector('#mobileMenuBtn')?.classList.remove('active');
    root.querySelector('#mobileMenuBtn')?.setAttribute('aria-expanded', 'false');
    root.querySelector('#mobileOverlay')?.classList.remove('active');
    root.querySelectorAll('.ato-header-dropdown.open').forEach((item) => {
      item.classList.remove('open');
      item.querySelector(':scope > .ato-dropdown-trigger')?.setAttribute('aria-expanded', 'false');
    });
    root.querySelector('.language-dropdown')?.classList.remove('open');
    document.body.classList.remove('ato-mobile-header-modal-open');
  }

  document.addEventListener('click', (event) => {
    if (!mobile.matches || event.defaultPrevented) return;

    const target = event.target instanceof Element ? event.target : null;
    const link = target?.closest('#atoGlobalHeaderRoot .nav a[href]');
    if (!link) return;

    const href = (link.getAttribute('href') || '').trim();
    if (!href || href === '#' || href.startsWith('javascript:')) return;

    /* Stop older menu listeners, but deliberately DO NOT call preventDefault().
       Safari now follows the anchor's href through its native navigation path. */
    event.stopImmediatePropagation();
    event.stopPropagation();
    closePanels();
  }, true);
})();
