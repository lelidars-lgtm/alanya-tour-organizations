(() => {
  'use strict';

  const root = document.getElementById('atoLivingHero');
  if (!root || root.dataset.atoHeroReady === '1') return;
  root.dataset.atoHeroReady = '1';

  const current = root.querySelector('.ato-living-hero__scene--current');
  const next = root.querySelector('.ato-living-hero__scene--next');
  const currentNum = root.querySelector('.ato-living-hero__current-num');
  const totalNum = root.querySelector('.ato-living-hero__total-num');
  const fill = root.querySelector('.ato-living-hero__track i');
  const caption = root.querySelector('.ato-living-hero__caption');
  const captionText = caption?.querySelector('span');
  const hit = root.querySelector('.ato-living-hero__hit');
  const pause = root.querySelector('.ato-living-hero__pause');
  const slogan = root.querySelector('.ato-living-hero__slogan');
  const mobile = matchMedia('(max-width:980px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!current || !next || !currentNum || !totalNum || !fill || !caption || !captionText || !hit) return;

  /*
    V4.1 — ATO SIGNATURE CURVED REVEAL / DIRECTED MOTION

    APPROVED MOTION LANGUAGE
    ------------------------------------------------------
    One recognisable right-to-left curved reveal across all 7 scenes.
    The brand geometry never changes into another effect; only radius,
    duration and depth vary subtly (roughly 5–10%) to prevent monotony.

    Scene character while the image is resting:
      01 Rafting       — light push-in toward the water
      02 Tazy Canyon   — slow drift into canyon depth
      03 Istanbul      — almost still, micro-zoom only
      04 Pamukkale     — very slow lateral drift
      05 Cappadocia    — gentle upward camera feel toward balloons
      06 Helicopter    — restrained push toward helicopter
      07 Evening Alanya— very slow pull-back / final exhale

    No blur. No flash. No gold trace. No splash/panels/gimmicks.
    Persistent Hero UI remains visually fixed above the photography.
  */

  const scenes = [
    {
      id:'01', file:'01-rafting.webp', duration:6000,
      href:'/rafting-koprulu-canyon.html',
      label:'NATURE & ADVENTURE — RAFTING',
      ambient:{fromScale:1.012,toScale:1.047,fromX:0,fromY:0,toX:0,toY:.10,ease:'cubic-bezier(.20,.62,.20,1)'}
    },
    {
      id:'02', file:'05-tazy-canyon.webp', duration:6100,
      href:'/nature-adventures.html',
      label:'NATURE & ADVENTURE — TAZY CANYON',
      ambient:{fromScale:1.013,toScale:1.041,fromX:0,fromY:0,toX:.05,toY:-.16,ease:'cubic-bezier(.18,.60,.22,1)'}
    },
    {
      id:'03', file:'04-istanbul/composite.webp', duration:6400,
      href:'/istanbul-tour.html',
      label:'HISTORY & CULTURE — ISTANBUL',
      ambient:{fromScale:1.012,toScale:1.026,fromX:0,fromY:0,toX:0,toY:-.025,ease:'cubic-bezier(.22,.58,.24,1)'}
    },
    {
      id:'04', file:'03-pamukkale.webp', duration:6200,
      href:'/pamukkale-salda-lake.html',
      label:'HISTORY & CULTURE — PAMUKKALE',
      ambient:{fromScale:1.018,toScale:1.030,fromX:.08,fromY:0,toX:-.12,toY:-.03,ease:'cubic-bezier(.20,.58,.20,1)'}
    },
    {
      id:'05', file:'02-cappadocia/composite.webp', duration:6500,
      href:'/cappadocia.html',
      label:'HISTORY & CULTURE — CAPPADOCIA',
      ambient:{fromScale:1.016,toScale:1.036,fromX:0,fromY:.09,toX:.03,toY:-.14,ease:'cubic-bezier(.18,.60,.22,1)'}
    },
    {
      id:'06', file:'09-vip-helicopter.webp', duration:6200,
      href:'/helicopter-experience.html',
      label:'VIP SERVICES — HELICOPTER FLIGHT',
      ambient:{fromScale:1.012,toScale:1.039,fromX:0,fromY:0,toX:.12,toY:-.06,ease:'cubic-bezier(.20,.60,.20,1)'}
    },
    {
      id:'07', file:'10-alanya-night.webp', duration:6600,
      href:'/alanya-city-tour.html',
      label:'ALANYA — EVENING VIEW',
      ambient:{fromScale:1.042,toScale:1.014,fromX:.05,fromY:-.03,toX:0,toY:0,ease:'cubic-bezier(.20,.56,.24,1)'}
    }
  ];

  /*
    Transition direction is keyed by the scene we are LEAVING.
    Values stay deliberately close to one another: this is one ATO motion
    signature with scene-specific pacing, not seven different transitions.
  */
  const transitions = {
    // 01 Rafting → 02 Tazy: energetic opening move.
    '01': {ms:980,  fromRY:122, toRX:153, toRY:128, originX:109.0, inX:1.20, inScale:1.036, outX:-1.40, outScale:1.037, ease:'cubic-bezier(.20,.78,.16,1)'},
    // 02 Tazy → 03 Istanbul: broader, calmer cinematic curtain.
    '02': {ms:1160, fromRY:136, toRX:164, toRY:136, originX:109.5, inX:1.05, inScale:1.033, outX:-1.22, outScale:1.034, ease:'cubic-bezier(.22,.72,.20,1)'},
    // 03 Istanbul → 04 Pamukkale: soft, even reveal.
    '03': {ms:1100, fromRY:130, toRX:158, toRY:131, originX:109.0, inX:.98,  inScale:1.031, outX:-1.15, outScale:1.032, ease:'cubic-bezier(.26,.64,.20,1)'},
    // 04 Pamukkale → 05 Cappadocia: longest, most graceful reveal.
    '04': {ms:1200, fromRY:138, toRX:166, toRY:138, originX:109.5, inX:1.00, inScale:1.033, outX:-1.18, outScale:1.034, ease:'cubic-bezier(.18,.72,.18,1)'},
    // 05 Cappadocia → 06 Helicopter: slightly denser VIP hand-off.
    '05': {ms:1040, fromRY:124, toRX:154, toRY:127, originX:109.0, inX:1.14, inScale:1.036, outX:-1.35, outScale:1.037, ease:'cubic-bezier(.20,.76,.16,1)'},
    // 06 Helicopter → 07 Evening Alanya: ceremonial final reveal.
    '06': {ms:1220, fromRY:140, toRX:166, toRY:140, originX:109.5, inX:.98,  inScale:1.032, outX:-1.12, outScale:1.033, ease:'cubic-bezier(.22,.68,.20,1)'},
    // 07 Evening Alanya → 01 Rafting: quicker restart of the loop.
    '07': {ms:990,  fromRY:123, toRX:154, toRY:128, originX:109.0, inX:1.18, inScale:1.035, outX:-1.38, outScale:1.036, ease:'cubic-bezier(.20,.80,.15,1)'}
  };

  const CAPTION_DELAY_MS = 205;
  const supportsEllipse = CSS.supports?.('clip-path', 'ellipse(100% 120% at 110% 50%)') ?? true;

  let i = 0;
  let timer = 0;
  let stopped = false;
  let busy = false;
  let drift = null;

  totalNum.textContent = String(scenes.length).padStart(2, '0');

  const dir = () => `assets/img/hero/${mobile.matches ? 'mobile' : 'desktop'}/`;
  const path = scene => dir() + scene.file;
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const preload = src => new Promise(resolve => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      const decoded = image.decode?.();
      decoded?.catch?.(() => {}).finally(resolve) || resolve();
    };
    image.onerror = resolve;
    image.src = src;
  });

  function paint(el, scene) {
    el.style.backgroundImage = `url("${path(scene)}")`;
    el.style.backgroundPosition = 'center center';
  }

  function transform(scale, x, y) {
    return `translate3d(${x}%,${y}%,0) scale(${scale})`;
  }

  function startDrift(scene) {
    drift?.cancel?.();
    if (reduced || stopped) return;

    const m = scene.ambient;
    drift = current.animate([
      {transform:transform(m.fromScale,m.fromX,m.fromY)},
      {transform:transform(m.toScale,m.toX,m.toY)}
    ], {
      duration:scene.duration + 900,
      easing:m.ease,
      fill:'forwards'
    });
  }

  function updateUI(scene) {
    currentNum.textContent = scene.id;
    caption.href = hit.href = scene.href;
    captionText.textContent = scene.label;
    caption.setAttribute('aria-label', `${scene.label} — open tour`);
    hit.setAttribute('aria-label', `${scene.label} — open tour`);

    root.classList.toggle('is-opening-scene', scene.id === '01');
    slogan?.setAttribute('aria-hidden', scene.id === '01' ? 'false' : 'true');

    root.style.setProperty('--ato-hero-duration', `${scene.duration}ms`);
    fill.classList.remove('is-running');
    void fill.offsetWidth;
    if (!stopped && !reduced) fill.classList.add('is-running');

    startDrift(scene);
  }

  function resetNext() {
    next.getAnimations().forEach(animation => animation.cancel());
    next.style.opacity = '0';
    next.style.clipPath = '';
    next.style.webkitClipPath = '';
    next.style.transform = 'scale(1.012)';
  }

  async function curvedReveal(fromScene) {
    const t = transitions[fromScene.id] || transitions['03'];
    next.style.opacity = '1';

    const fromClip = supportsEllipse
      ? `ellipse(4% ${t.fromRY}% at ${t.originX}% 50%)`
      : 'inset(0 0 0 100% round 48% 0 0 48%)';
    const toClip = supportsEllipse
      ? `ellipse(${t.toRX}% ${t.toRY}% at ${t.originX}% 50%)`
      : 'inset(0 0 0 0 round 0)';

    next.style.clipPath = fromClip;
    next.style.webkitClipPath = fromClip;
    next.style.transform = `translate3d(${t.inX}%,0,0) scale(${t.inScale})`;

    drift?.pause?.();
    const currentTransform = getComputedStyle(current).transform;

    const currentExit = current.animate([
      {transform:currentTransform === 'none' ? 'scale(1.02)' : currentTransform},
      {transform:`translate3d(${t.outX}%,0,0) scale(${t.outScale})`}
    ], {
      duration:t.ms,
      easing:t.ease,
      fill:'forwards'
    });

    const incoming = next.animate([
      {
        clipPath:fromClip,
        webkitClipPath:fromClip,
        transform:`translate3d(${t.inX}%,0,0) scale(${t.inScale})`
      },
      {
        clipPath:toClip,
        webkitClipPath:toClip,
        transform:'translate3d(0,0,0) scale(1.012)'
      }
    ], {
      duration:t.ms,
      easing:t.ease,
      fill:'forwards'
    });

    await Promise.allSettled([incoming.finished,currentExit.finished]);
  }

  async function go(n) {
    if (busy || stopped || reduced) return;
    busy = true;

    const fromScene = scenes[i];
    const scene = scenes[n];
    await preload(path(scene));
    paint(next, scene);

    caption.classList.remove('is-visible');

    if (fromScene.id === '01' && scene.id !== '01') {
      root.classList.remove('is-opening-scene');
      slogan?.setAttribute('aria-hidden', 'true');
    }

    await curvedReveal(fromScene);

    current.getAnimations().forEach(animation => animation.cancel());
    current.style.backgroundImage = next.style.backgroundImage;
    current.style.backgroundPosition = next.style.backgroundPosition || 'center center';
    current.style.transform = 'scale(1.012)';

    i = n;
    updateUI(scene);
    resetNext();

    await sleep(CAPTION_DELAY_MS);
    caption.classList.add('is-visible');

    busy = false;
    schedule();
  }

  function schedule() {
    clearTimeout(timer);
    if (stopped || reduced) return;
    timer = setTimeout(() => go((i + 1) % scenes.length), scenes[i].duration);
  }

  pause?.addEventListener('click', () => {
    stopped = !stopped;
    pause.textContent = stopped ? '▶' : 'Ⅱ';
    pause.setAttribute('aria-pressed', String(stopped));

    if (stopped) {
      clearTimeout(timer);
      fill.classList.remove('is-running');
      drift?.pause?.();
    } else {
      updateUI(scenes[i]);
      schedule();
    }
  });

  mobile.addEventListener?.('change', () => {
    paint(current, scenes[i]);
    scenes.slice(0, 3).forEach(scene => preload(path(scene)));
  });

  paint(current, scenes[0]);
  updateUI(scenes[0]);
  caption.classList.add('is-visible');
  scenes.slice(1, 4).forEach(scene => preload(path(scene)));
  if (!reduced) schedule();
})();
