/**
 * ALANYA TOUR ORGANIZATIONS — standalone mobile navigation
 * Mobile/tablet only. Native anchors; no navigation interception.
 * Version: 2026-08-27-control-v1
 */
(() => {
  'use strict';

  const mobile = matchMedia('(max-width:980px)').matches &&
    (/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '') ||
      navigator.maxTouchPoints > 0);
  if (!mobile || document.getElementById('atoMobileNavigationRoot')) return;

  const style = document.createElement('style');
  style.id = 'ato-mobile-navigation-style';
  style.textContent = `
    @media(max-width:980px){
      #atoGlobalHeaderRoot,body>header:not(#atoMobileNavigationRoot),body>.header{display:none!important}
      #atoMobileNavigationRoot{display:block!important;position:sticky!important;top:0!important;z-index:2147483647!important;width:100%!important;font-family:Arial,Helvetica,sans-serif!important;isolation:isolate!important}
      #atoMobileNavigationRoot *{box-sizing:border-box!important}
      #atoMobileNavigationRoot a{color:inherit!important;text-decoration:none!important}
      #atoMobileNavigationRoot .ato-mn-head{height:84px!important;display:flex!important;align-items:center!important;gap:12px!important;padding:0 14px!important;background:#081426!important;border-bottom:1px solid rgba(220,177,82,.28)!important;position:relative!important;z-index:3!important}
      #atoMobileNavigationRoot .ato-mn-toggle{width:42px!important;height:42px!important;display:grid!important;place-items:center!important;border:0!important;background:transparent!important;color:#d7a83e!important;font-size:31px!important;line-height:1!important;padding:0!important}
      #atoMobileNavigationRoot .ato-mn-brand{display:flex!important;align-items:center!important;gap:9px!important;min-width:0!important}
      #atoMobileNavigationRoot .ato-mn-brand img{width:46px!important;height:46px!important;object-fit:contain!important}
      #atoMobileNavigationRoot .ato-mn-brand-copy{display:grid!important;gap:3px!important;color:#fff!important;white-space:nowrap!important}
      #atoMobileNavigationRoot .ato-mn-brand-copy strong{font-size:14px!important;line-height:1!important;letter-spacing:.2px!important}
      #atoMobileNavigationRoot .ato-mn-brand-copy small{font-size:8px!important;line-height:1!important;letter-spacing:2px!important;color:#d7a83e!important;font-weight:800!important}
      #atoMobileNavigationRoot .ato-mn-lang{margin-left:auto!important;color:#fff!important;font-weight:900!important;font-size:13px!important}
      #atoMobileNavigationRoot .ato-mn-promo{height:34px!important;display:flex!important;align-items:center!important;overflow:hidden!important;background:#0b1b2d!important;border-bottom:1px solid rgba(220,177,82,.2)!important;color:#fff!important;font-size:10px!important;font-weight:900!important;letter-spacing:.7px!important;white-space:nowrap!important}
      #atoMobileNavigationRoot .ato-mn-promo span{padding-left:18px!important}
      #atoMobileNavigationRoot .ato-mn-scrim{display:none!important;position:fixed!important;inset:0!important;background:rgba(0,7,15,.55)!important;backdrop-filter:blur(5px)!important;z-index:1!important}
      #atoMobileNavigationRoot .ato-mn-drawer{display:flex!important;position:fixed!important;left:0!important;top:84px!important;bottom:0!important;width:min(86vw,380px)!important;flex-direction:column!important;gap:8px!important;padding:18px 18px calc(28px + env(safe-area-inset-bottom))!important;overflow-y:auto!important;background:linear-gradient(180deg,#071426,#061120)!important;border-right:1px solid rgba(220,177,82,.28)!important;box-shadow:20px 0 55px rgba(0,0,0,.48)!important;transform:translateX(-105%)!important;transition:transform .24s ease!important;z-index:2!important;-webkit-overflow-scrolling:touch!important;pointer-events:auto!important}
      #atoMobileNavigationRoot.ato-mn-open .ato-mn-drawer{transform:translateX(0)!important}
      #atoMobileNavigationRoot.ato-mn-open .ato-mn-scrim{display:block!important}
      #atoMobileNavigationRoot .ato-mn-link,#atoMobileNavigationRoot summary{display:flex!important;align-items:center!important;width:100%!important;min-height:52px!important;padding:0 14px!important;border:0!important;border-radius:12px!important;background:transparent!important;color:#fff!important;font-size:16px!important;font-weight:900!important;letter-spacing:.25px!important;list-style:none!important;cursor:pointer!important;pointer-events:auto!important;touch-action:manipulation!important}
      #atoMobileNavigationRoot .ato-mn-link:active,#atoMobileNavigationRoot summary:active{background:rgba(215,168,62,.13)!important;color:#f2cb73!important}
      #atoMobileNavigationRoot summary::-webkit-details-marker{display:none!important}
      #atoMobileNavigationRoot summary::after{content:'⌄'!important;margin-left:auto!important;color:#d7a83e!important}
      #atoMobileNavigationRoot details[open] summary::after{content:'⌃'!important}
      #atoMobileNavigationRoot .ato-mn-sub{display:grid!important;gap:4px!important;padding:4px 8px 10px 18px!important}
      #atoMobileNavigationRoot .ato-mn-sub a{display:flex!important;align-items:center!important;min-height:44px!important;padding:8px 12px!important;border-left:1px solid rgba(215,168,62,.38)!important;color:#dce5ed!important;font-size:13px!important;font-weight:800!important;pointer-events:auto!important;touch-action:manipulation!important}
      body.ato-mobile-navigation-open{overflow:hidden!important}
      body.ato-mobile-navigation-open>*:not(#atoMobileNavigationRoot){pointer-events:none!important}
      html.ato-map-mobile-device{--ato-map-mobile-header-h:118px!important}
    }
    @media(min-width:981px){#atoMobileNavigationRoot{display:none!important}}
  `;
  document.head.appendChild(style);

  const root = document.createElement('div');
  root.id = 'atoMobileNavigationRoot';
  root.innerHTML = `
    <div class="ato-mn-head">
      <button class="ato-mn-toggle" type="button" aria-label="Open menu" aria-expanded="false">☰</button>
      <a class="ato-mn-brand" href="/index.html" aria-label="Home">
        <img src="/logo.png" alt="ALANYA TOUR ORGANIZATIONS">
        <span class="ato-mn-brand-copy"><strong>ALANYA TOUR</strong><small>ORGANIZATIONS</small></span>
      </a>
      <span class="ato-mn-lang">EN</span>
    </div>
    <div class="ato-mn-promo"><span>TRAVEL WITH LOVE. TRAVEL WITH US.　◆　PRIVATE TOURS · VIP TRANSFERS · FAMILY EXPERIENCES</span></div>
    <div class="ato-mn-scrim" aria-hidden="true"></div>
    <nav class="ato-mn-drawer" aria-label="Mobile navigation">
      <a class="ato-mn-link" href="/index.html">HOME</a>
      <details>
        <summary>TOURS</summary>
        <div class="ato-mn-sub">
          <a href="/sea-experiences.html">SEA EXPERIENCES</a>
          <a href="/extreme-adventure.html">EXTREME &amp; ADVENTURE</a>
          <a href="/nature-adventures.html">NATURE &amp; ADVENTURE</a>
          <a href="/history-culture.html">HISTORY &amp; CULTURE</a>
          <a href="/family-experiences.html">FAMILY EXPERIENCES</a>
          <a href="/water-sports.html">WATER SPORTS</a>
          <a href="/air-experiences.html">AIR EXPERIENCES</a>
          <a href="/wellness-relax.html">WELLNESS &amp; RELAX</a>
          <a href="/popular-tours.html">POPULAR TOURS</a>
        </div>
      </details>
      <a class="ato-mn-link" href="/interactive-map/interactive-map.html">EXPLORE MAP</a>
      <a class="ato-mn-link" href="/trip-planner.html">TRIP PLANNER</a>
      <a class="ato-mn-link" href="/combo-deals.html">COMBO DEALS</a>
      <a class="ato-mn-link" href="/special-offers.html">🔥　SPECIAL OFFERS</a>
      <a class="ato-mn-link" href="/vip-service.html">VIP SERVICE</a>
      <a class="ato-mn-link" href="/index.html#about">ABOUT US</a>
      <a class="ato-mn-link" href="/contact.html">CONTACT</a>
    </nav>`;

  document.body.insertAdjacentElement('afterbegin', root);
  const toggle = root.querySelector('.ato-mn-toggle');
  const scrim = root.querySelector('.ato-mn-scrim');
  const setOpen = (open) => {
    root.classList.toggle('ato-mn-open', open);
    document.body.classList.toggle('ato-mobile-navigation-open', open);
    toggle.textContent = open ? '×' : '☰';
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => setOpen(!root.classList.contains('ato-mn-open')));
  scrim.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
})();
