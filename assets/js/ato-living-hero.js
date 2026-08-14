(() => {
  'use strict';
  const root = document.getElementById('atoLivingHero');
  if (!root) return;

  const current = root.querySelector('.ato-living-hero__scene--current');
  const next = root.querySelector('.ato-living-hero__scene--next');
  const stage = root.querySelector('.ato-living-hero__stage');
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

  const scenes = [
    {id:'01',file:'01-rafting.webp',transition:'splash',duration:5600,href:'/rafting-koprulu-canyon.html',label:'NATURE & ADVENTURE — RAFTING'},
    {id:'02',file:'02-cappadocia/composite.webp',transition:'cappadocia',duration:7600,href:'/cappadocia.html',label:'HISTORY & CULTURE — CAPPADOCIA',multi:[
      '02-cappadocia/01-dawn-balloons.webp','02-cappadocia/02-ancient-rock-houses.webp','02-cappadocia/03-night-lights-balloons.webp'
    ]},
    {id:'03',file:'03-pamukkale.webp',transition:'terraces',duration:5400,href:'/pamukkale-salda-lake.html',label:'NATURE & ADVENTURE — PAMUKKALE'},
    {id:'04',file:'04-istanbul/composite.webp',transition:'istanbul',duration:7600,href:'/istanbul-tour.html',label:'HISTORY & CULTURE — ISTANBUL',multi:[
      '04-istanbul/01-galata-night.webp','04-istanbul/02-bosphorus-sunset.webp','04-istanbul/03-sultanahmet-seagulls.webp'
    ]},
    {id:'05',file:'05-tazy-canyon.webp',transition:'canyon',duration:5600,href:'/nature-adventures.html',label:'NATURE & ADVENTURE — TAZY CANYON'},
    {id:'06',file:'06-land-of-legends.webp',transition:'reflection',duration:5400,href:'/land-of-legends.html',label:'FAMILY EXPERIENCE — THE LAND OF LEGENDS'},
    {id:'07',file:'07-jeep-safari.webp',transition:'dust',duration:5200,href:'/jeep-safari.html',label:'NATURE & ADVENTURE — JEEP SAFARI'},
    {id:'08',file:'08-gazipasa-heart.webp',transition:'heart',duration:5700,href:'/gazipasa-bays.html',label:'GAZİPAŞA — HEART ROCK'},
    {id:'09',file:'09-vip-helicopter.webp',transition:'rotor',duration:5600,href:'/helicopter-experience.html',label:'VIP SERVICES — HELICOPTER CHARTER'},
    {id:'10',file:'10-alanya-night.webp',transition:'night',duration:5600,href:'/alanya-city-tour.html',label:'ALANYA BY NIGHT — CASTLE VIEW'}
  ];

  let i=0, timer=0, stopped=false, busy=false;
  if (totalNum) totalNum.textContent=String(scenes.length);
  const dir=()=>`assets/img/hero/${mobile.matches?'mobile':'desktop'}/`;
  const path=s=>dir()+s.file;
  const asset=f=>dir()+f;
  const preload=src=>new Promise(r=>{const im=new Image(); im.onload=im.onerror=r; im.decoding='async'; im.src=src;});

  function paint(el,s){ el.style.backgroundImage=`url("${path(s)}")`; el.dataset.transition=s.transition; }
  function ui(s){
    currentNum.textContent=s.id;
    caption.href=hit.href=s.href;
    captionText.textContent=s.label;
    caption.setAttribute('aria-label',s.label+' — open tour');
    hit.setAttribute('aria-label',s.label+' — open tour');
    root.classList.toggle('is-opening-scene',s.id==='01');
    slogan?.setAttribute('aria-hidden',s.id==='01'?'false':'true');
    root.style.setProperty('--ato-hero-duration',Math.max(1400,s.duration-1150)+'ms');
    fill.classList.remove('is-running'); void fill.offsetWidth;
    if(!stopped && !reduced) fill.classList.add('is-running');
  }

  function clearMulti(){ stage.querySelectorAll('.ato-multi-scene').forEach(el=>el.remove()); }
  function clean(){
    clearMulti();
    next.style.cssText=''; next.className='ato-living-hero__scene ato-living-hero__scene--next';
    root.classList.remove('tr-splash','tr-cappadocia','tr-terraces','tr-istanbul','tr-canyon','tr-reflection','tr-dust','tr-heart','tr-rotor','tr-night');
  }

  async function revealCappadocia(s){
    clearMulti();
    await Promise.all(s.multi.map(f=>preload(asset(f))));
    const host=document.createElement('div'); host.className='ato-multi-scene ato-multi-scene--cappadocia';
    s.multi.forEach((f,k)=>{const p=document.createElement('div');p.className=`ato-multi-panel ato-multi-panel--${k+1}`;p.style.backgroundImage=`url("${asset(f)}")`;host.appendChild(p)});
    stage.appendChild(host);
    const [a,b,c]=host.children;
    a.animate([{clipPath:'polygon(0 0,0 0,0 100%,0 100%)',transform:'scale(1.06)'},{clipPath:'polygon(0 0,58% 0,47% 100%,0 100%)',transform:'scale(1.015)'}],{duration:1050,easing:'cubic-bezier(.16,.8,.2,1)',fill:'forwards'});
    await new Promise(r=>setTimeout(r,720));
    b.animate([{clipPath:'polygon(52% 0,52% 0,44% 100%,44% 100%)',transform:'translateX(6%) scale(1.08)'},{clipPath:'polygon(42% 0,76% 0,64% 100%,36% 100%)',transform:'translateX(0) scale(1.02)'}],{duration:1150,easing:'cubic-bezier(.16,.82,.22,1)',fill:'forwards'});
    await new Promise(r=>setTimeout(r,760));
    await c.animate([{clipPath:'polygon(100% 0,100% 0,100% 100%,100% 100%)',transform:'scale(1.07)'},{clipPath:'polygon(68% 0,100% 0,100% 100%,57% 100%)',transform:'scale(1.015)'}],{duration:1150,easing:'cubic-bezier(.16,.8,.2,1)',fill:'forwards'}).finished.catch(()=>{});
    await new Promise(r=>setTimeout(r,500));
    next.style.backgroundImage=`url("${path(s)}")`; next.style.opacity='1'; next.style.clipPath='inset(0)';
    await host.animate([{opacity:1},{opacity:0}],{duration:420,easing:'ease',fill:'forwards'}).finished.catch(()=>{});
  }

  async function revealIstanbul(s){
    clearMulti();
    await Promise.all(s.multi.map(f=>preload(asset(f))));
    const host=document.createElement('div'); host.className='ato-multi-scene ato-multi-scene--istanbul';
    s.multi.forEach((f,k)=>{const p=document.createElement('div');p.className=`ato-multi-panel ato-multi-panel--${k+1}`;p.style.backgroundImage=`url("${asset(f)}")`;host.appendChild(p)});
    stage.appendChild(host);
    const [a,b,c]=host.children;
    a.animate([{clipPath:'polygon(0 0,0 0,0 100%,0 100%)',transform:'translateX(-7%) scale(1.06)'},{clipPath:'polygon(0 0,38% 0,30% 100%,0 100%)',transform:'translateX(0) scale(1.015)'}],{duration:900,easing:'cubic-bezier(.16,.82,.22,1)',fill:'forwards'});
    await new Promise(r=>setTimeout(r,620));
    b.animate([{clipPath:'polygon(44% 0,44% 0,38% 100%,38% 100%)',transform:'translateY(5%) scale(1.07)'},{clipPath:'polygon(30% 0,72% 0,66% 100%,25% 100%)',transform:'translateY(0) scale(1.015)'}],{duration:1020,easing:'cubic-bezier(.16,.82,.22,1)',fill:'forwards'});
    await new Promise(r=>setTimeout(r,680));
    await c.animate([{clipPath:'polygon(100% 0,100% 0,100% 100%,100% 100%)',transform:'translateX(7%) scale(1.07)'},{clipPath:'polygon(68% 0,100% 0,100% 100%,61% 100%)',transform:'translateX(0) scale(1.015)'}],{duration:1050,easing:'cubic-bezier(.16,.82,.22,1)',fill:'forwards'}).finished.catch(()=>{});
    host.classList.add('is-complete');
    await new Promise(r=>setTimeout(r,520));
    next.style.backgroundImage=`url("${path(s)}")`; next.style.opacity='1'; next.style.clipPath='inset(0)';
    await host.animate([{opacity:1},{opacity:0}],{duration:420,easing:'ease',fill:'forwards'}).finished.catch(()=>{});
  }

  async function reveal(type,s){
    if(type==='cappadocia') return revealCappadocia(s);
    if(type==='istanbul') return revealIstanbul(s);
    next.style.opacity='1'; root.classList.add('tr-'+type);
    const map={
      splash:['polygon(0 82%,14% 65%,28% 80%,44% 58%,58% 78%,74% 62%,100% 76%,100% 100%,0 100%)','polygon(0 0,100% 0,100% 100%,0 100%)'],
      terraces:['polygon(0 82%,28% 74%,28% 59%,54% 59%,54% 42%,77% 42%,77% 24%,100% 24%,100% 100%,0 100%)','polygon(0 0,100% 0,100% 100%,0 100%)'],
      canyon:['polygon(47% 0,53% 0,58% 100%,42% 100%)','polygon(0 0,100% 0,100% 100%,0 100%)'],
      reflection:['polygon(0 50%,100% 50%,100% 100%,0 100%)','polygon(0 0,100% 0,100% 100%,0 100%)'],
      dust:['circle(4% at 72% 68%)','circle(145% at 72% 68%)'],
      heart:['polygon(50% 37%,55% 29%,64% 28%,71% 35%,72% 45%,50% 73%,28% 45%,29% 35%,36% 28%,45% 29%)','polygon(0 0,100% 0,100% 100%,0 100%)'],
      rotor:['circle(1% at 70% 30%)','circle(145% at 70% 30%)'],
      night:['inset(47% 47% 47% 47% round 50%)','inset(0 0 0 0 round 0)']
    };
    let [a,b]=map[type]||map.splash; next.style.clipPath=a;
    await next.animate([{clipPath:a,transform:'scale(1.045)'},{clipPath:b,transform:'scale(1.012)'}],{duration:1150,easing:'cubic-bezier(.16,.76,.2,1)',fill:'forwards'}).finished.catch(()=>{});
  }

  async function go(n){
    if(busy || stopped || reduced) return;
    busy=true; const s=scenes[n]; await preload(path(s)); paint(next,s);
    caption.classList.remove('is-visible');
    if (scenes[i].id === '01' && s.id !== '01') {root.classList.remove('is-opening-scene'); slogan?.setAttribute('aria-hidden','true'); await new Promise(r=>setTimeout(r,420));}
    await reveal(s.transition,s);
    current.style.backgroundImage=next.style.backgroundImage; current.dataset.transition=s.transition;
    i=n; ui(s); clean(); requestAnimationFrame(()=>caption.classList.add('is-visible'));
    busy=false; schedule();
  }

  function schedule(){clearTimeout(timer);if(stopped||reduced)return;timer=setTimeout(()=>go((i+1)%scenes.length),Math.max(2600,scenes[i].duration-1150));}
  pause?.addEventListener('click',()=>{stopped=!stopped;pause.textContent=stopped?'▶':'Ⅱ';pause.setAttribute('aria-pressed',String(stopped));if(stopped){clearTimeout(timer);fill.classList.remove('is-running')}else{ui(scenes[i]);schedule();}});
  mobile.addEventListener?.('change',()=>{paint(current,scenes[i]);scenes.forEach(s=>{preload(path(s));s.multi?.forEach(f=>preload(asset(f)))})});

  paint(current,scenes[0]); ui(scenes[0]); caption.classList.add('is-visible');
  scenes.slice(1,5).forEach(s=>{preload(path(s));s.multi?.forEach(f=>preload(asset(f)))});
  if(!reduced) schedule();
})();
