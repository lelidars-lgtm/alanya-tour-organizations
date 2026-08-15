(() => {
  'use strict';

  const root = document.getElementById('atoLivingHero');
  if (!root) return;

  const current = root.querySelector('.ato-living-hero__scene--current');
  const next = root.querySelector('.ato-living-hero__scene--next');
  const edge = root.querySelector('.ato-living-hero__edge');
  const transitionLayer = root.querySelector('.ato-living-hero__transition');
  const hit = root.querySelector('.ato-living-hero__hit');
  const caption = root.querySelector('.ato-living-hero__caption');
  const captionText = caption?.querySelector('span');
  const currentNum = root.querySelector('.ato-living-hero__current-num');
  const totalNum = root.querySelector('.ato-living-hero__total-num');
  const trackFill = root.querySelector('.ato-living-hero__track i');
  const pauseBtn = root.querySelector('.ato-living-hero__pause');
  const slogan = root.querySelector('.ato-living-hero__slogan');
  const oldHeroContent = root.querySelector('.hero-content');

  if (!current || !next) return;

  const scenes = [
    {
      desktop: 'assets/img/hero/desktop/01-RAFTING-APPROVED.png',
      mobile: 'assets/img/hero/mobile/01-RAFTING-MOBILE.png',
      label: 'NATURE & ADVENTURE — RAFTING',
      href: '/rafting-koprulu-canyon.html',
      hold: 5000, duration: 920,
      ambient: { from:'scale(1.018) translate3d(0,0,0)', to:'scale(1.055) translate3d(0,-0.8%,0)' }
    },
    {
      desktop: 'assets/img/hero/desktop/02-TAZY-CANYON-APPROVED.png',
      mobile: 'assets/img/hero/mobile/02-TAZY-CANYON-MOBILE.png',
      label: 'NATURE & ADVENTURE — TAZY CANYON',
      href: '/nature-adventures.html',
      hold: 5300, duration: 1120,
      ambient: { from:'scale(1.02) translate3d(0,0,0)', to:'scale(1.048) translate3d(-0.6%,-0.5%,0)' }
    },
    {
      desktop: 'assets/img/hero/desktop/03-ISTANBUL-APPROVED.png',
      mobile: 'assets/img/hero/mobile/03-ISTANBUL-MOBILE.png',
      label: 'HISTORY & CULTURE — ISTANBUL',
      href: '/istanbul-tour.html',
      hold: 5600, duration: 1080,
      ambient: { from:'scale(1.014)', to:'scale(1.032)' }
    },
    {
      desktop: 'assets/img/hero/desktop/04-PAMUKKALE-APPROVED.jpg',
      mobile: 'assets/img/hero/mobile/04-PAMUKKALE-MOBILE.png',
      label: 'HISTORY & CULTURE — PAMUKKALE',
      href: '/pamukkale-salda-lake.html',
      hold: 5600, duration: 1200,
      ambient: { from:'scale(1.02) translate3d(0,0,0)', to:'scale(1.045) translate3d(-0.9%,0,0)' }
    },
    {
      desktop: 'assets/img/hero/desktop/05-CAPPADOCIA-APPROVED.jpg',
      mobile: 'assets/img/hero/mobile/05-CAPPADOCIA-MOBILE.png',
      label: 'HISTORY & CULTURE — CAPPADOCIA',
      href: '/cappadocia.html',
      hold: 5900, duration: 1050,
      ambient: { from:'scale(1.02) translate3d(0,0.5%,0)', to:'scale(1.05) translate3d(0,-1%,0)' }
    },
    {
      desktop: 'assets/img/hero/desktop/06-EVENING-ALANYA-APPROVED.png',
      mobile: 'assets/img/hero/mobile/06-EVENING-ALANYA-MOBILE.png',
      label: 'ALANYA — EVENING VIEW FROM ABOVE',
      href: '/alanya-city-tour.html',
      hold: 5900, duration: 1180,
      ambient: { from:'scale(1.052)', to:'scale(1.018)' }
    },
    {
      desktop: 'assets/img/hero/desktop/07-HELICOPTER-FLYME-AIR-APPROVED.jpg',
      mobile: 'assets/img/hero/mobile/07-HELICOPTER-FLYME-AIR-MOBILE.png',
      label: 'VIP SERVICES — HELICOPTER FLIGHT',
      href: '/helicopter-flight.html',
      hold: 6000, duration: 1000,
      ambient: { from:'scale(1.018)', to:'scale(1.05) translate3d(-0.5%,-0.4%,0)' }
    }
  ];

  let index = 0;
  let paused = false;
  let locked = false;
  let timer = null;
  let ambientAnimation = null;
  let progressAnimation = null;
  const mq = window.matchMedia('(max-width: 980px)');

  // Force a predictable stacking model even if an older CSS version is cached.
  Object.assign(root.style, { position: root.style.position || 'relative', overflow: 'hidden' });
  const stage = root.querySelector('.ato-living-hero__stage');
  if (stage) Object.assign(stage.style, { position:'absolute', inset:'0', overflow:'hidden', background:'#020c14' });
  [current, next].forEach((el, i) => Object.assign(el.style, {
    position:'absolute', inset:'0',
    backgroundRepeat:'no-repeat', backgroundSize:'cover', backgroundPosition:'center center',
    willChange:'transform,clip-path',
    opacity: i === 0 ? '1' : '0',
    zIndex: i === 0 ? '1' : '2'
  }));
  if (edge) edge.style.display = 'none';
  if (transitionLayer) transitionLayer.style.display = 'none';
  if (oldHeroContent) oldHeroContent.style.display = 'none';
  if (slogan) slogan.style.display = 'none';

  const srcFor = (scene) => mq.matches ? scene.mobile : scene.desktop;

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve(src);
      img.onerror = reject;
      img.src = src;
    });
  }

  async function safeSrc(scene) {
    const primary = srcFor(scene);
    try {
      await loadImage(primary);
      return primary;
    } catch (_) {
      const fallback = mq.matches ? scene.desktop : scene.mobile;
      await loadImage(fallback);
      return fallback;
    }
  }

  function applyImage(el, src) {
    el.style.backgroundImage = `url("${src}")`;
  }

  function updateUI(scene, n) {
    const num = String(n + 1).padStart(2,'0');
    if (currentNum) currentNum.textContent = num;
    if (totalNum) totalNum.textContent = String(scenes.length).padStart(2,'0');
    if (captionText) captionText.textContent = scene.label;
    if (caption) {
      caption.href = scene.href;
      caption.setAttribute('aria-label', `${scene.label} — open tour`);
    }
    if (hit) {
      hit.href = scene.href;
      hit.setAttribute('aria-label', `${scene.label} — open tour`);
    }
  }

  function startAmbient(scene) {
    ambientAnimation?.cancel();
    current.style.transform = scene.ambient.from;
    ambientAnimation = current.animate(
      [{ transform: scene.ambient.from }, { transform: scene.ambient.to }],
      { duration: scene.hold + scene.duration + 800, easing:'linear', fill:'forwards' }
    );
  }

  function startProgress(scene) {
    progressAnimation?.cancel();
    if (!trackFill) return;
    trackFill.style.transformOrigin = 'left center';
    progressAnimation = trackFill.animate(
      [{ transform:'scaleX(0)' }, { transform:'scaleX(1)' }],
      { duration: scene.hold, easing:'linear', fill:'forwards' }
    );
  }

  function schedule() {
    clearTimeout(timer);
    if (paused) return;
    const scene = scenes[index];
    startProgress(scene);
    timer = setTimeout(() => goTo((index + 1) % scenes.length), scene.hold);
  }

  async function goTo(target) {
    if (locked || target === index) return;
    locked = true;
    clearTimeout(timer);
    progressAnimation?.cancel();

    const fromScene = scenes[index];
    const toScene = scenes[target];
    let src;
    try {
      src = await safeSrc(toScene);
    } catch (err) {
      console.error('[ATO HERO] image missing:', srcFor(toScene), err);
      locked = false;
      schedule();
      return;
    }

    applyImage(next, src);
    next.style.opacity = '1';
    next.style.zIndex = '2';
    next.style.clipPath = 'ellipse(10% 125% at 112% 50%)';
    next.style.transform = 'scale(1.028) translate3d(1.2%,0,0)';

    if (caption) {
      caption.animate([{opacity:1, transform:'translateY(0)'},{opacity:0, transform:'translateY(8px)'}],
        {duration:180, easing:'ease', fill:'forwards'});
    }

    const duration = fromScene.duration;
    const reveal = next.animate([
      { clipPath:'ellipse(10% 125% at 112% 50%)', transform:'scale(1.028) translate3d(1.2%,0,0)' },
      { clipPath:'ellipse(165% 165% at 100% 50%)', transform:'scale(1) translate3d(0,0,0)' }
    ], {
      duration,
      easing:'cubic-bezier(.16,1,.30,1)',
      fill:'forwards'
    });

    current.animate([
      { transform:getComputedStyle(current).transform === 'none' ? 'scale(1.02)' : getComputedStyle(current).transform, opacity:1 },
      { transform:'scale(1.035) translate3d(-1.2%,0,0)', opacity:.92 }
    ], { duration, easing:'cubic-bezier(.2,.7,.2,1)', fill:'forwards' });

    await reveal.finished.catch(()=>{});

    applyImage(current, src);
    current.style.opacity = '1';
    current.style.transform = toScene.ambient.from;
    current.style.clipPath = 'none';
    next.style.opacity = '0';
    next.style.clipPath = 'none';
    next.style.backgroundImage = 'none';

    index = target;
    updateUI(toScene, index);
    startAmbient(toScene);

    if (caption) {
      caption.getAnimations().forEach(a => a.cancel());
      caption.style.opacity = '1';
      caption.style.transform = 'translateY(0)';
      caption.animate([{opacity:0, transform:'translateY(7px)'},{opacity:1, transform:'translateY(0)'}],
        {duration:360, delay:160, easing:'cubic-bezier(.16,1,.3,1)', fill:'both'});
    }

    locked = false;
    schedule();
  }

  async function init() {
    const scene = scenes[0];
    let src;
    try {
      src = await safeSrc(scene);
    } catch (err) {
      console.error('[ATO HERO] first image missing', err);
      current.style.background = '#020c14';
      return;
    }
    applyImage(current, src);
    updateUI(scene, 0);
    startAmbient(scene);
    scenes.slice(1,3).forEach(s => safeSrc(s).catch(()=>{}));
    schedule();
  }

  pauseBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    paused = !paused;
    pauseBtn.setAttribute('aria-pressed', String(paused));
    pauseBtn.textContent = paused ? '▶' : 'Ⅱ';
    if (paused) {
      clearTimeout(timer);
      progressAnimation?.pause();
      ambientAnimation?.pause();
    } else {
      progressAnimation?.play();
      ambientAnimation?.play();
      schedule();
    }
  });

  mq.addEventListener?.('change', async () => {
    try {
      const src = await safeSrc(scenes[index]);
      applyImage(current, src);
    } catch (_) {}
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimeout(timer);
      ambientAnimation?.pause();
      progressAnimation?.pause();
    } else if (!paused) {
      ambientAnimation?.play();
      schedule();
    }
  });

  init();
})();
