(() => {
  'use strict';

  function boot(){
    const root=document.getElementById('atoLivingHero');
    if(!root || root.dataset.atoHeroReady==='1') return;
    root.dataset.atoHeroReady='1';

    const current=root.querySelector('.ato-living-hero__scene--current');
    const next=root.querySelector('.ato-living-hero__scene--next');
    const transitionHost=root.querySelector('.ato-living-hero__transition');
    const progressFill=root.querySelector('.ato-living-hero__track i');
    const currentNum=root.querySelector('.ato-living-hero__current-num');
    const caption=root.querySelector('.ato-living-hero__caption');
    const captionText=caption?.querySelector('span');
    const hit=root.querySelector('.ato-living-hero__hit');
    const pauseBtn=root.querySelector('.ato-living-hero__pause');
    const scrollText=root.querySelector('.ato-living-hero__scroll span');

    if(!current || !next || !transitionHost || !progressFill || !currentNum || !caption || !captionText || !hit) return;

    const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobileMq=window.matchMedia('(max-width:980px)');
    const TRANSITION_LEAD=1120;

    const chapters=[
      {
        id:'01', file:'01-sea-private-yacht.webp', enter:'portal', duration:5800,
        href:'/luxury-yacht-cruise.html',
        labels:{en:'SEA EXPERIENCE — PRIVATE YACHT',ru:'МОРСКИЕ ВПЕЧАТЛЕНИЯ — ЧАСТНАЯ ЯХТА',tr:'DENİZ DENEYİMİ — ÖZEL YAT',de:'MEERESERLEBNIS — PRIVATE YACHT',pl:'MORSKIE WRAŻENIA — PRYWATNY JACHT'}
      },
      {
        id:'02', file:'02-air-paragliding.webp', enter:'horizon', duration:4900,
        href:'/paragliding.html',
        labels:{en:'AIR EXPERIENCE — PARAGLIDING',ru:'ВОЗДУШНЫЕ ВПЕЧАТЛЕНИЯ — ПАРАПЛАН',tr:'HAVA DENEYİMİ — YAMAÇ PARAŞÜTÜ',de:'LUFTERLEBNIS — PARAGLIDING',pl:'PODNIEBNE WRAŻENIA — PARALOTNIA'}
      },
      {
        id:'03', file:'03-nature-rafting.webp', enter:'splash', duration:5200,
        href:'/rafting-koprulu-canyon.html',
        labels:{en:'NATURE & ADVENTURE — RAFTING',ru:'ПРИРОДА И ПРИКЛЮЧЕНИЯ — РАФТИНГ',tr:'DOĞA & MACERA — RAFTİNG',de:'NATUR & ABENTEUER — RAFTING',pl:'NATURA & PRZYGODA — RAFTING'}
      },
      {
        id:'04', file:'04-history-cappadocia.webp', enter:'panels', duration:5600,
        href:'/cappadocia.html',
        labels:{en:'HISTORY & CULTURE — CAPPADOCIA',ru:'ИСТОРИЯ И КУЛЬТУРА — КАППАДОКИЯ',tr:'TARİH & KÜLTÜR — KAPADOKYA',de:'GESCHICHTE & KULTUR — KAPPADOKIEN',pl:'HISTORIA & KULTURA — KAPADOCJA'}
      },
      {
        id:'05', file:'05-family-land-of-legends.webp', enter:'reflection', duration:5000,
        href:'/land-of-legends.html',
        labels:{en:'FAMILY EXPERIENCE — LAND OF LEGENDS',ru:'СЕМЕЙНЫЕ ВПЕЧАТЛЕНИЯ — LAND OF LEGENDS',tr:'AİLE DENEYİMİ — LAND OF LEGENDS',de:'FAMILIENERLEBNIS — LAND OF LEGENDS',pl:'RODZINNE WRAŻENIA — LAND OF LEGENDS'}
      },
      {
        id:'06', file:'06-vip-helicopter.webp', enter:'rotor', duration:5400,
        href:'/helicopter-experience.html',
        labels:{en:'VIP SERVICES — HELICOPTER CHARTER',ru:'VIP-СЕРВИС — ВЕРТОЛЁТНЫЙ ЧАРТЕР',tr:'VIP HİZMETLER — HELİKOPTER KİRALAMA',de:'VIP-SERVICE — HELIKOPTER-CHARTER',pl:'USŁUGI VIP — CZARTER HELIKOPTERA'}
      }
    ];

    const scrollLabels={
      en:'SCROLL TO EXPLORE',ru:'ЛИСТАЙТЕ, ЧТОБЫ ИССЛЕДОВАТЬ',tr:'KEŞFETMEK İÇİN KAYDIRIN',de:'SCROLLEN ZUM ENTDECKEN',pl:'PRZEWIŃ, ABY ODKRYWAĆ'
    };

    let index=0;
    let busy=false;
    let paused=false;
    let timer=null;
    let deadline=0;
    let remaining=0;
    let drift=null;
    let currentLang=getLang();

    const sleep=ms=>new Promise(r=>setTimeout(r,ms));
    const isMobile=()=>mobileMq.matches;
    const pathFor=chapter=>`assets/img/hero/${isMobile()?'mobile':'desktop'}/${chapter.file}`;

    function getLang(){
      const l=(localStorage.getItem('atoLanguage')||document.documentElement.lang||'en').slice(0,2);
      return ['en','ru','tr','de','pl'].includes(l)?l:'en';
    }

    function preload(src){
      return new Promise(resolve=>{
        const img=new Image();
        img.decoding='async';
        img.onload=()=>{
          if(img.decode){img.decode().catch(()=>{}).finally(resolve)}
          else resolve();
        };
        img.onerror=resolve;
        img.src=src;
      });
    }

    function paint(el,chapter){
      el.style.backgroundImage=`url("${pathFor(chapter)}")`;
      el.style.backgroundPosition='center center';
    }

    function translateUi(){
      currentLang=getLang();
      const label=chapters[index].labels[currentLang]||chapters[index].labels.en;
      captionText.textContent=label;
      if(scrollText) scrollText.textContent=scrollLabels[currentLang]||scrollLabels.en;
      caption.setAttribute('aria-label',label+' — open tour');
      hit.setAttribute('aria-label',label+' — open tour');
    }

    function setUi(chapter){
      currentNum.textContent=chapter.id;
      caption.href=chapter.href;
      hit.href=chapter.href;
      translateUi();
      caption.classList.remove('is-visible');
      setTimeout(()=>caption.classList.add('is-visible'),650);

      root.style.setProperty('--ato-hero-duration',`${chapter.duration}ms`);
      progressFill.classList.remove('is-running');
      void progressFill.offsetWidth;
      if(!paused && !reducedMotion) progressFill.classList.add('is-running');
    }

    function startDrift(chapter){
      drift?.cancel?.();
      if(reducedMotion) return;
      const map={
        '01':[0.25,-0.25],
        '02':[-0.65,-0.12],
        '03':[0.18,-0.40],
        '04':[0.20,-0.15],
        '05':[0.12,-0.10],
        '06':[0.55,-0.22]
      };
      const [dx,dy]=map[chapter.id]||[0.2,-0.2];
      drift=current.animate([
        {transform:'scale(1.012) translate3d(0,0,0)'},
        {transform:`scale(1.052) translate3d(${dx}%,${dy}%,0)`}
      ],{duration:chapter.duration+800,easing:'cubic-bezier(.2,.65,.2,1)',fill:'forwards'});
    }

    function clearTemp(){
      transitionHost.replaceChildren();
      transitionHost.style.opacity='0';
      next.style.clipPath='';
      next.style.webkitClipPath='';
      next.style.opacity='0';
      next.style.transform='scale(1.012)';
    }

    function goldTrace(vertical=false){
      const el=document.createElement('i');
      el.className='ato-hero-gold-trace';
      el.style.left=vertical?'58%':'31%';
      el.style.top='50%';
      transitionHost.appendChild(el);
      return el.animate([
        {opacity:0,transform:`${vertical?'rotate(90deg) ':''}scaleX(.10)`},
        {opacity:.92,offset:.42,transform:`${vertical?'rotate(90deg) ':''}scaleX(1)`},
        {opacity:0,transform:`${vertical?'rotate(90deg) ':''}scaleX(1.22)`}
      ],{duration:720,easing:'cubic-bezier(.2,.72,.2,1)',fill:'forwards'});
    }

    async function horizonReveal(){
      next.style.opacity='1';
      next.style.clipPath='inset(49.7% 0 49.7% 0)';
      goldTrace(false);
      await next.animate([
        {clipPath:'inset(49.7% 0 49.7% 0)',transform:'scale(1.045)'},
        {clipPath:'inset(0 0 0 0)',transform:'scale(1.012)'}
      ],{duration:1040,easing:'cubic-bezier(.76,0,.24,1)',fill:'forwards'}).finished;
    }

    async function splashReveal(){
      next.style.opacity='1';
      const start='polygon(0 80%,8% 70%,17% 82%,27% 67%,37% 79%,47% 65%,57% 80%,67% 68%,77% 77%,88% 64%,100% 74%,100% 100%,0 100%)';
      const end='polygon(0 0,8% 0,17% 0,27% 0,37% 0,47% 0,57% 0,67% 0,77% 0,88% 0,100% 0,100% 100%,0 100%)';
      next.style.clipPath=start;
      const flare=document.createElement('i');
      flare.className='ato-hero-reflection-flare';
      transitionHost.appendChild(flare);
      flare.animate([{opacity:0,transform:'translateY(230px)'},{opacity:.78,offset:.45},{opacity:0,transform:'translateY(-220px)'}],{duration:900,easing:'ease-out',fill:'forwards'});
      await next.animate([
        {clipPath:start,transform:'scale(1.045) translateY(1.6%)'},
        {clipPath:end,transform:'scale(1.012) translateY(0)'}
      ],{duration:1080,easing:'cubic-bezier(.16,.78,.18,1)',fill:'forwards'}).finished;
    }

    async function panelsReveal(chapter){
      const host=document.createElement('div');
      host.className='ato-hero-panels';
      const count=isMobile()?2:3;
      for(let i=0;i<count;i++){
        const p=document.createElement('div');
        p.className='ato-hero-panel';
        const bg=document.createElement('i');
        bg.style.backgroundImage=`url("${pathFor(chapter)}")`;
        p.appendChild(bg);
        host.appendChild(p);
      }
      transitionHost.appendChild(host);
      transitionHost.style.opacity='1';
      [...host.children].forEach((p,i)=>p.animate([
        {transform:i%2?'translateY(-105%)':'translateY(105%)'},
        {transform:'translateY(0)'}
      ],{duration:850,delay:i*80,easing:'cubic-bezier(.70,0,.20,1)',fill:'forwards'}));
      await sleep(900);
      next.style.opacity='1';
      await host.animate([{opacity:1},{opacity:0}],{duration:270,easing:'ease',fill:'forwards'}).finished;
    }

    async function reflectionReveal(){
      next.style.opacity='1';
      next.style.clipPath='inset(50% 0 0 0)';
      const flare=document.createElement('i');
      flare.className='ato-hero-reflection-flare';
      transitionHost.appendChild(flare);
      flare.animate([{opacity:0},{opacity:.86,offset:.42},{opacity:0}],{duration:760,easing:'ease',fill:'forwards'});
      await next.animate([
        {clipPath:'inset(50% 0 0 0)',transform:'scaleY(-1) scale(1.024)',opacity:.80},
        {clipPath:'inset(0 0 0 0)',transform:'scaleY(1) scale(1.012)',opacity:1}
      ],{duration:1050,easing:'cubic-bezier(.65,0,.24,1)',fill:'forwards'}).finished;
    }

    async function rotorReveal(){
      next.style.opacity='1';
      const center=isMobile()?'62% 28%':'73% 29%';
      const start=`circle(0% at ${center})`;
      const end=`circle(150% at ${center})`;
      next.style.clipPath=start;
      const ring=document.createElement('div');
      ring.style.cssText=`position:absolute;left:${isMobile()?'62%':'73%'};top:${isMobile()?'28%':'29%'};width:8px;height:8px;border:1px solid rgba(214,170,89,.78);border-radius:50%;transform:translate(-50%,-50%);opacity:0;`;
      transitionHost.appendChild(ring);
      ring.animate([
        {width:'8px',height:'8px',opacity:0},
        {opacity:.86,offset:.28},
        {width:'130vmax',height:'130vmax',opacity:0}
      ],{duration:980,easing:'cubic-bezier(.15,.72,.2,1)',fill:'forwards'});
      await next.animate([
        {clipPath:start,transform:'scale(1.045)'},
        {clipPath:end,transform:'scale(1.012)'}
      ],{duration:1030,easing:'cubic-bezier(.15,.72,.2,1)',fill:'forwards'}).finished;
    }

    async function portalReveal(){
      next.style.opacity='1';
      const center=isMobile()?'58% 47%':'65% 48%';
      const start=`ellipse(0% 0% at ${center})`;
      const end=`ellipse(132% 132% at ${center})`;
      next.style.clipPath=start;
      goldTrace(true);
      await next.animate([
        {clipPath:start,transform:'scale(1.050)'},
        {clipPath:end,transform:'scale(1.012)'}
      ],{duration:1110,easing:'cubic-bezier(.72,0,.20,1)',fill:'forwards'}).finished;
    }

    async function transitionTo(nextIndex){
      if(busy || paused || reducedMotion) return;
      busy=true;
      const target=chapters[nextIndex];
      await preload(pathFor(target));
      paint(next,target);
      caption.classList.remove('is-visible');
      drift?.pause?.();
      await sleep(220);
      transitionHost.style.opacity='1';

      switch(target.enter){
        case 'horizon': await horizonReveal(); break;
        case 'splash': await splashReveal(); break;
        case 'panels': await panelsReveal(target); break;
        case 'reflection': await reflectionReveal(); break;
        case 'rotor': await rotorReveal(); break;
        default: await portalReveal();
      }

      index=nextIndex;
      paint(current,target);
      current.style.opacity='1';
      current.style.clipPath='';
      current.style.transform='scale(1.012)';
      clearTemp();
      setUi(target);
      startDrift(target);
      preload(pathFor(chapters[(index+1)%chapters.length]));
      busy=false;
      schedule();
    }

    function schedule(ms){
      clearTimeout(timer);
      if(paused || reducedMotion) return;
      remaining=Number.isFinite(ms)?ms:Math.max(2600,chapters[index].duration-TRANSITION_LEAD);
      deadline=performance.now()+remaining;
      timer=setTimeout(()=>transitionTo((index+1)%chapters.length),remaining);
    }

    function setPaused(value){
      if(reducedMotion) return;
      paused=value;
      pauseBtn?.setAttribute('aria-pressed',String(value));
      pauseBtn?.setAttribute('aria-label',value?'Resume hero animation':'Pause hero animation');
      if(pauseBtn) pauseBtn.textContent=value?'▶':'Ⅱ';
      if(value){
        remaining=Math.max(0,deadline-performance.now());
        clearTimeout(timer);
        progressFill.style.animationPlayState='paused';
        drift?.pause?.();
      }else{
        progressFill.style.animationPlayState='running';
        drift?.play?.();
        schedule(remaining||Math.max(2600,chapters[index].duration-TRANSITION_LEAD));
      }
    }

    pauseBtn?.addEventListener('click',()=>setPaused(!paused));

    window.addEventListener('ato-language-changed',()=>translateUi());

    document.addEventListener('visibilitychange',()=>{
      if(reducedMotion) return;
      if(document.hidden){
        remaining=Math.max(0,deadline-performance.now());
        clearTimeout(timer);
        drift?.pause?.();
        progressFill.style.animationPlayState='paused';
      }else if(!paused){
        drift?.play?.();
        progressFill.style.animationPlayState='running';
        schedule(remaining||Math.max(2600,chapters[index].duration-TRANSITION_LEAD));
      }
    });

    let wasMobile=isMobile();
    window.addEventListener('resize',()=>{
      const nowMobile=isMobile();
      if(nowMobile!==wasMobile && !busy){
        wasMobile=nowMobile;
        paint(current,chapters[index]);
        preload(pathFor(chapters[(index+1)%chapters.length]));
      }
    },{passive:true});

    paint(current,chapters[0]);
    setUi(chapters[0]);
    startDrift(chapters[0]);
    preload(pathFor(chapters[1]));
    preload(pathFor(chapters[2]));
    if(!reducedMotion) schedule();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
