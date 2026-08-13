(() => {
  'use strict';

  const KEY = 'atoTripPlannerPool';
  const MAX = 8;
  const CARD_SELECTOR = 'a.tour-card[href]';
  const CONTROL_SELECTOR = '.ato-compare-control, .compare-btn, [data-compare], [data-action*="compare" i]';

  const normalizeHref = (href) => {
    if (!href) return '';
    try {
      const u = new URL(href, location.href);
      return u.pathname.split('/').filter(Boolean).pop() || '';
    } catch (_) {
      return String(href).split('?')[0].split('#')[0].split('/').pop() || '';
    }
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
      const href = normalizeHref(el.dataset.tourHref);
      const added = pool.includes(href);
      el.classList.toggle('is-added', added);
      el.classList.toggle('is-selected', added); // compatibility with older category CSS
      el.setAttribute('aria-pressed', added ? 'true' : 'false');
      const label = added ? '✓ Added' : '＋ Compare';
      if (el.textContent !== label) el.textContent = label;
    });

    if (!document.body) return;
    const dock = ensureDock();
    const count = pool.length;
    dock.classList.toggle('visible', count > 0);
    const strong = dock.querySelector('strong');
    const dockLabel = `TRIP PLANNER · ${count}/${MAX} TOURS`;
    if (strong && strong.textContent !== dockLabel) strong.textContent = dockLabel;
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

  function getOrCreateActions(bottom) {
    let actions = bottom.querySelector(':scope > .card-actions');
    if (!actions) {
      actions = document.createElement('span');
      actions.className = 'card-actions ato-card-actions';
      bottom.appendChild(actions);
    } else {
      actions.classList.add('ato-card-actions');
    }

    const arrow = bottom.querySelector(':scope > .circle-arrow') || actions.querySelector('.circle-arrow');
    if (arrow && arrow.parentElement !== actions) actions.appendChild(arrow);

    return { actions, arrow: actions.querySelector('.circle-arrow') };
  }

  function findExistingControl(card) {
    const candidates = [...card.querySelectorAll(CONTROL_SELECTOR)];
    return candidates.find((el) =>
      !el.closest('.ato-planner-dock') &&
      !el.classList.contains('ato-planner-open') &&
      !el.classList.contains('ato-planner-clear')
    ) || null;
  }

  function stripLegacyListeners(control) {
    // Some newer category pages contain their own inline Compare handler.
    // Cloning removes those page-specific listeners so every category uses one shared pool.
    if (!control || control.dataset.atoSharedBound === '1') return control;
    if (control.classList.contains('compare-btn') && !control.classList.contains('ato-compare-control')) {
      const clone = control.cloneNode(true);
      control.replaceWith(clone);
      return clone;
    }
    return control;
  }

  function bindControl(control, href) {
    if (control.dataset.atoSharedBound === '1') return;

    control.classList.add('ato-compare-control');
    control.dataset.atoSharedBound = '1';
    control.dataset.tourHref = href;
    control.setAttribute('role', 'button');
    control.setAttribute('tabindex', '0');

    const act = (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggle(href);
    };

    control.addEventListener('click', act);
    control.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') act(event);
    });
  }

  function normalizeCard(card) {
    const href = normalizeHref(card.getAttribute('href'));
    if (!href) return;

    const body = card.querySelector('.tour-body') || card;
    const bottom = body.querySelector('.tour-bottom');
    let control = stripLegacyListeners(findExistingControl(card));

    if (!control) {
      control = document.createElement('span');
      control.textContent = '＋ Compare';
    }

    bindControl(control, href);

    if (bottom) {
      const { actions, arrow } = getOrCreateActions(bottom);
      if (arrow) {
        if (control.parentElement !== actions || control.nextElementSibling !== arrow) {
          actions.insertBefore(control, arrow);
        }
      } else if (control.parentElement !== actions) {
        actions.appendChild(control);
      }
    } else if (control.parentElement !== body) {
      body.appendChild(control);
    }

    card.dataset.atoPlannerReady = '1';
  }

  function normalizeAll() {
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

  function start() {
    normalizeAll();

    if (!observer && document.documentElement) {
      observer = new MutationObserver(queueNormalize);
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    // Covers cards inserted by late category scripts without visible jumping/flicker.
    setTimeout(normalizeAll, 250);
    setTimeout(normalizeAll, 800);
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
