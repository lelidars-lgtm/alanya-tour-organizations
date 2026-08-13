(() => {
  'use strict';

  const KEY = 'atoTripPlannerPool';
  const MAX = 8;
  const CARD_SELECTOR = '.tour-card';
  const CONTROL_CANDIDATES = [
    '.ato-compare-control',
    '.compare-btn',
    '[data-compare]',
    '[data-action*="compare" i]',
    'button',
    '[role="button"]'
  ].join(',');

  const normalizeHref = (href) => {
    if (!href) return '';
    try {
      const u = new URL(href, location.href);
      return u.pathname.split('/').filter(Boolean).pop() || '';
    } catch (_) {
      return String(href).split('?')[0].split('#')[0].split('/').pop() || '';
    }
  };

  const cardHref = (card) => {
    if (!card) return '';
    const direct = card.getAttribute?.('href');
    if (direct) return normalizeHref(direct);
    const link = card.querySelector?.('a[href]');
    return normalizeHref(link?.getAttribute('href') || '');
  };

  const read = () => {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(value)
        ? [...new Set(value.map(normalizeHref).filter(Boolean))].slice(0, MAX)
        : [];
    } catch (_) {
      return [];
    }
  };

  const write = (value) => {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify([...new Set(value.map(normalizeHref).filter(Boolean))].slice(0, MAX))
      );
    } catch (_) {}
  };

  let pool = read();
  let toastTimer;
  let observer;
  let normalizeQueued = false;

  function installCriticalLayoutCSS() {
    if (document.getElementById('ato-compare-arrow-layout-critical-v3')) return;
    const style = document.createElement('style');
    style.id = 'ato-compare-arrow-layout-critical-v3';
    style.textContent = `
      /* Critical invariant: Compare exists ONLY beside the gold arrow. */
      .tour-card .ato-compare-control{visibility:hidden!important;}
      .tour-card .tour-bottom{
        display:flex!important;
        align-items:center!important;
        flex-wrap:nowrap!important;
      }
      .tour-card .tour-bottom > .meta,
      .tour-card .tour-bottom .meta{
        flex:1 1 auto!important;
        min-width:0!important;
      }
      .tour-card .tour-bottom > .ato-card-actions,
      .tour-card .tour-bottom .ato-card-actions{
        position:static!important;
        inset:auto!important;
        margin:0 0 0 auto!important;
        display:inline-flex!important;
        align-items:center!important;
        justify-content:flex-end!important;
        flex:0 0 auto!important;
        gap:8px!important;
        white-space:nowrap!important;
        transform:none!important;
      }
      .tour-card .tour-bottom .ato-card-actions > .ato-compare-control{
        visibility:visible!important;
        position:static!important;
        inset:auto!important;
        top:auto!important;
        right:auto!important;
        bottom:auto!important;
        left:auto!important;
        float:none!important;
        transform:none!important;
        margin:0!important;
        align-self:center!important;
        flex:0 0 auto!important;
      }
      .tour-card .tour-bottom .ato-card-actions > .circle-arrow{
        position:static!important;
        inset:auto!important;
        margin:0!important;
        transform:none!important;
        flex:0 0 auto!important;
      }
      @media(max-width:760px){
        .tour-card .tour-bottom .ato-card-actions{gap:7px!important;}
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function toast(message) {
    let el = document.querySelector('.ato-planner-toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'ato-planner-toast';
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  function plannerHref() {
    return location.pathname.includes('/interactive-map/')
      ? '../trip-planner.html'
      : 'trip-planner.html';
  }

  function ensureDock() {
    if (!document.body) return null;
    let dock = document.querySelector('.ato-planner-dock');
    if (dock) return dock;

    dock = document.createElement('div');
    dock.className = 'ato-planner-dock';
    dock.innerHTML = `
      <div class="ato-planner-dock-copy">
        <strong></strong>
        <small>Choose up to 8 tours · compare 2–4 in the planner</small>
      </div>
      <button class="ato-planner-open" type="button">COMPARE & PLAN</button>
      <button class="ato-planner-clear" type="button" aria-label="Clear selected tours">×</button>`;

    dock.querySelector('.ato-planner-dock-copy')?.addEventListener('click', () => {
      location.href = plannerHref();
    });
    dock.querySelector('.ato-planner-open')?.addEventListener('click', () => {
      location.href = plannerHref();
    });
    dock.querySelector('.ato-planner-clear')?.addEventListener('click', (event) => {
      event.stopPropagation();
      pool = [];
      write(pool);
      update();
    });

    document.body.appendChild(dock);
    return dock;
  }

  function update() {
    document.querySelectorAll('.ato-compare-control').forEach((el) => {
      const href = normalizeHref(el.dataset.tourHref || cardHref(el.closest('.tour-card')));
      if (!href) return;
      const added = pool.includes(href);
      el.classList.toggle('is-added', added);
      el.classList.toggle('is-selected', added);
      el.setAttribute('aria-pressed', added ? 'true' : 'false');
      const label = added ? '✓ Added' : '＋ Compare';
      if ((el.textContent || '').trim() !== label) el.textContent = label;
    });

    const dock = ensureDock();
    if (!dock) return;
    const count = pool.length;
    dock.classList.toggle('visible', count > 0);
    const strong = dock.querySelector('strong');
    const label = `TRIP PLANNER · ${count}/${MAX} TOURS`;
    if (strong && strong.textContent !== label) strong.textContent = label;
  }

  function toggle(href) {
    href = normalizeHref(href);
    if (!href) return;

    const index = pool.indexOf(href);
    if (index >= 0) {
      pool.splice(index, 1);
    } else if (pool.length < MAX) {
      pool.push(href);
    } else {
      toast('You can select up to 8 tours. Open Trip Planner to review your list.');
      return;
    }

    write(pool);
    update();
  }

  function looksLikeCompare(el) {
    if (!el || el.closest('.ato-planner-dock')) return false;
    if (el.classList?.contains('ato-compare-control')) return true;
    if (el.classList?.contains('compare-btn')) return true;
    if (el.hasAttribute?.('data-compare')) return true;
    if (/compare/i.test(el.getAttribute?.('data-action') || '')) return true;
    const cls = typeof el.className === 'string' ? el.className : '';
    const txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
    return /compare/i.test(cls) || /(^|\s|\+)compare(\s|$)/i.test(txt) || /^✓\s*added$/i.test(txt);
  }

  function findCompareControls(card) {
    return [...card.querySelectorAll(CONTROL_CANDIDATES)].filter(looksLikeCompare);
  }

  function ensureActionPair(bottom, arrow) {
    let actions = arrow.closest('.card-actions, .ato-card-actions');
    if (actions && !bottom.contains(actions)) actions = null;

    if (!actions) {
      actions = document.createElement('span');
      actions.className = 'card-actions ato-card-actions';
      arrow.parentNode.insertBefore(actions, arrow);
      actions.appendChild(arrow);
    } else {
      actions.classList.add('card-actions', 'ato-card-actions');
      if (arrow.parentElement !== actions) actions.appendChild(arrow);
    }

    return actions;
  }

  function normalizeCard(card) {
    const href = cardHref(card);
    if (!href) return;

    const bottom = card.querySelector('.tour-bottom');
    const arrow = bottom?.querySelector('.circle-arrow');

    // Hard rule: no arrow = no Compare. Never place it on the image/top of the card.
    if (!bottom || !arrow) {
      findCompareControls(card).forEach((control) => {
        if (control.classList.contains('ato-compare-control')) control.remove();
      });
      card.dataset.atoPlannerReady = '0';
      return;
    }

    const actions = ensureActionPair(bottom, arrow);
    const controls = findCompareControls(card);
    let control = controls.find((el) => actions.contains(el)) || controls[0] || null;

    if (!control) {
      control = document.createElement('span');
      control.className = 'compare-btn ato-compare-control';
      control.textContent = '＋ Compare';
    }

    control.classList.add('ato-compare-control');
    control.dataset.tourHref = href;
    control.setAttribute('role', 'button');
    control.setAttribute('tabindex', '0');

    // Remove duplicate legacy Compare controls, including old image/top controls.
    controls.forEach((other) => {
      if (other !== control) other.remove();
    });

    // Physical DOM order is always: Compare, then gold arrow.
    if (control.parentElement !== actions || control.nextElementSibling !== arrow) {
      actions.insertBefore(control, arrow);
    }

    card.dataset.atoPlannerReady = '1';
  }

  function normalizeAll() {
    installCriticalLayoutCSS();
    document.querySelectorAll(CARD_SELECTOR).forEach(normalizeCard);
    update();
  }

  function queueNormalize() {
    if (normalizeQueued) return;
    normalizeQueued = true;
    requestAnimationFrame(() => {
      normalizeQueued = false;
      normalizeAll();
    });
  }

  function captureCompareClick(event) {
    const target = event.target instanceof Element ? event.target : null;
    const control = target?.closest('.ato-compare-control');
    if (!control) return;
    const card = control.closest('.tour-card');
    if (!card) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    toggle(control.dataset.tourHref || cardHref(card));
  }

  function captureCompareKeydown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const target = event.target instanceof Element ? event.target : null;
    const control = target?.closest('.ato-compare-control');
    if (!control) return;
    const card = control.closest('.tour-card');
    if (!card) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    toggle(control.dataset.tourHref || cardHref(card));
  }

  function start() {
    normalizeAll();

    // Capture phase neutralizes old per-page Compare handlers that may load later.
    document.addEventListener('click', captureCompareClick, true);
    document.addEventListener('keydown', captureCompareKeydown, true);

    if (!observer && document.documentElement) {
      observer = new MutationObserver(queueNormalize);
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    setTimeout(normalizeAll, 120);
    setTimeout(normalizeAll, 450);
    setTimeout(normalizeAll, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

  window.addEventListener('storage', (event) => {
    if (event.key === KEY) {
      pool = read();
      update();
    }
  });

  window.ATOTripPlannerPool = {
    get: () => [...pool],
    toggle,
    clear: () => {
      pool = [];
      write(pool);
      update();
    },
    max: MAX,
    key: KEY,
    normalizeHref,
    normalizeCards: normalizeAll
  };
})();
