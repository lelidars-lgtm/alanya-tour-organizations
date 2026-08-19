
/* ==========================================================================
   ALANYA TOUR ORGANIZATIONS — AI ASSISTANT FLOATING ORB V1
   One native Assistant. One state. One global trigger.
   No GIF. No duplicate chat UI. No synthetic click bridge.
   ========================================================================== */
(function(){
  'use strict';

  const HOST_CLASS='ato-ai-floating-ready';
  const VISUAL_CLASS='ato-ai-floating-visual';
  const CLICK_CLASS='ato-ai-native-click-surface';
  const SESSION_KEY='ato-ai-assistant-hint-v1';

  let host=null;
  let nativeSurface=null;
  let raf=0;
  let lastTone=0;
  let openState=false;

  const ORB_SVG=`
    <span class="ato-ai-orb" aria-hidden="true">
      <svg viewBox="0 0 64 64" focusable="false" aria-hidden="true">
        <defs>
          <radialGradient id="atoAiCoreGlow" cx="50%" cy="50%" r="58%">
            <stop offset="0" stop-color="#fff8ec" stop-opacity=".96"/>
            <stop offset=".17" stop-color="#e7c473" stop-opacity=".78"/>
            <stop offset=".44" stop-color="#527da2" stop-opacity=".38"/>
            <stop offset="1" stop-color="#10253a" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="atoAiCoreDot" cx="42%" cy="38%" r="70%">
            <stop offset="0" stop-color="#fffaf1"/>
            <stop offset=".35" stop-color="#ddba69"/>
            <stop offset="1" stop-color="#315f87"/>
          </radialGradient>
        </defs>

        <g opacity=".95">
          <ellipse class="ato-ai-orbit ato-ai-orbit-a" cx="32" cy="32" rx="24.8" ry="8.4"/>
          <ellipse class="ato-ai-orbit ato-ai-orbit-b" cx="31.2" cy="31.8" rx="22.1" ry="10.2"/>
          <ellipse class="ato-ai-orbit ato-ai-orbit-c" cx="32.7" cy="31.4" rx="19.2" ry="6.4"/>
          <ellipse class="ato-ai-orbit ato-ai-orbit-d" cx="31.7" cy="32.4" rx="26.4" ry="7.2"/>
          <ellipse class="ato-ai-data-pass" cx="32" cy="32" rx="24.8" ry="8.4"/>
        </g>

        <g class="ato-ai-particle-track p1"><circle class="ato-ai-particle-gold" cx="32" cy="7.8" r="1.25"/></g>
        <g class="ato-ai-particle-track p2"><circle class="ato-ai-particle-blue" cx="53.4" cy="25.4" r="1.10"/></g>
        <g class="ato-ai-particle-track p3"><circle class="ato-ai-particle-ivory" cx="17.0" cy="14.0" r=".90"/></g>
        <g class="ato-ai-particle-track p4"><circle class="ato-ai-particle-gold" cx="12.0" cy="42.5" r=".95"/></g>
        <g class="ato-ai-particle-track p5"><circle class="ato-ai-particle-blue" cx="44.8" cy="51.8" r="1.05"/></g>

        <g class="ato-ai-core-halo">
          <circle cx="32" cy="32" r="10.5" fill="url(#atoAiCoreGlow)" opacity=".72"/>
          <circle cx="32" cy="32" r="4.4" fill="none" stroke="#d7ad55" stroke-opacity=".28" stroke-width=".7"/>
          <circle cx="32" cy="32" r="2.2" fill="url(#atoAiCoreDot)"/>
          <circle cx="31.3" cy="31.3" r=".55" fill="#fffaf0" opacity=".88"/>
        </g>
      </svg>
    </span>`;

  function isVisible(el){
    try{
      const cs=getComputedStyle(el),r=el.getBoundingClientRect();
      return !!el && !el.hidden &&
        cs.display!=='none' && cs.visibility!=='hidden' &&
        r.width>0 && r.height>0 &&
        r.right>0 && r.bottom>0 && r.left<innerWidth && r.top<innerHeight;
    }catch(_){return false}
  }

  function findHost(){
    const exact=[...document.querySelectorAll('.ato-assistant-ai-host')].filter(isVisible);
    if(!exact.length)return null;

    exact.sort((a,b)=>{
      const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect();
      const ad=Math.hypot(innerWidth-ar.right,innerHeight-ar.bottom);
      const bd=Math.hypot(innerWidth-br.right,innerHeight-br.bottom);
      return ad-bd;
    });
    return exact[0];
  }

  function findNativeSurface(h){
    if(!h)return null;
    const core=h.querySelector('.ato-assistant-ai-control');
    if(!core)return null;

    if(core.matches('button,a,[role="button"]'))return core;

    const interactive=core.closest('button,a,[role="button"]');
    if(interactive && h.contains(interactive))return interactive;

    /* Existing control itself may own the click listener. */
    return core;
  }

  function ensureVisual(h){
    let visual=h.querySelector(':scope > .'+VISUAL_CLASS);
    if(visual)return visual;

    visual=document.createElement('span');
    visual.className=VISUAL_CLASS;
    visual.setAttribute('aria-hidden','true');
    visual.innerHTML=ORB_SVG+'<span class="ato-ai-floating-label">AI Assistant</span>';
    h.appendChild(visual);
    return visual;
  }

  function restoreOld(){
    if(nativeSurface)nativeSurface.classList.remove(CLICK_CLASS);
    if(host){
      host.querySelector(':scope > .'+VISUAL_CLASS)?.remove();
      host.classList.remove(
        HOST_CLASS,
        'ato-ai-context-light',
        'ato-ai-context-dark',
        'ato-ai-onboarding',
        'ato-ai-clicking',
        'ato-ai-assistant-open'
      );
      host.style.removeProperty('--ato-ai-lift');
    }
    host=null;
    nativeSurface=null;
  }

  function parseRGB(value){
    const m=String(value||'').match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
    return m ? [Number(m[1]),Number(m[2]),Number(m[3])] : null;
  }

  function luminance(rgb){
    if(!rgb)return null;
    const f=v=>{
      v/=255;
      return v<=.03928 ? v/12.92 : Math.pow((v+.055)/1.055,2.4);
    };
    return .2126*f(rgb[0])+.7152*f(rgb[1])+.0722*f(rgb[2]);
  }

  function contextTone(){
    if(!host||!host.isConnected)return;
    const now=performance.now();
    if(now-lastTone<120)return;
    lastTone=now;

    const r=host.getBoundingClientRect();
    const x=Math.max(4,Math.min(innerWidth-4,r.left-8));
    const y=Math.max(4,Math.min(innerHeight-4,r.top+r.height/2));
    let el=document.elementFromPoint(x,y);
    let rgb=null;

    for(let i=0;i<7 && el;i++,el=el.parentElement){
      const bg=getComputedStyle(el).backgroundColor;
      const parsed=parseRGB(bg);
      if(parsed && !/rgba\([^)]*,\s*0(?:\.0+)?\s*\)/i.test(bg)){
        rgb=parsed;
        break;
      }
    }

    const L=luminance(rgb);
    host.classList.toggle('ato-ai-context-light',L!==null && L>.62);
    host.classList.toggle('ato-ai-context-dark',L===null || L<=.62);
  }

  function computeLift(){
    if(!host||!host.isConnected)return;

    const hr=host.getBoundingClientRect();
    let lift=0;
    const nodes=[...document.body.children];

    nodes.forEach(el=>{
      if(el===host || host.contains(el) || !isVisible(el))return;
      const cs=getComputedStyle(el);
      if(cs.position!=='fixed' && cs.position!=='sticky')return;

      const r=el.getBoundingClientRect();
      const nearRight=r.right>innerWidth-220;
      const nearBottom=r.bottom>innerHeight-180;
      const horizontalOverlap=r.right>hr.left-10 && r.left<hr.right+10;

      if(nearRight && nearBottom && horizontalOverlap){
        const needed=Math.max(0,innerHeight-r.top+12);
        if(needed<220)lift=Math.max(lift,needed);
      }

      /* Full-width sticky CTA / cookie panel. */
      if(r.width>innerWidth*.55 && r.bottom>innerHeight-8 && r.top>innerHeight-220){
        lift=Math.max(lift,innerHeight-r.top+12);
      }
    });

    host.style.setProperty('--ato-ai-lift',Math.round(lift)+'px');
  }

  function panelIsOpen(){
    const desktop=document.querySelector('.ato-desktop-assistant-v7-surface');
    if(desktop && isVisible(desktop))return true;

    const backdrop=document.getElementById('atoDesktopAssistantBackdropV7');
    if(backdrop?.classList.contains('is-open'))return true;

    if(nativeSurface?.getAttribute?.('aria-expanded')==='true')return true;
    return false;
  }

  function syncOpenState(){
    if(!host)return;
    const next=panelIsOpen();
    if(next!==openState){
      openState=next;
      host.classList.toggle('ato-ai-assistant-open',openState);
      nativeSurface?.setAttribute?.('aria-expanded',openState?'true':'false');
    }
  }

  function apply(){
    raf=0;
    const nextHost=findHost();

    if(!nextHost){
      if(host)restoreOld();
      return;
    }

    if(host && host!==nextHost)restoreOld();

    host=nextHost;
    nativeSurface=findNativeSurface(host);
    if(!nativeSurface)return;

    host.classList.add(HOST_CLASS);
    ensureVisual(host);

    /* Stretch the original native clickable control over the whole compact trigger.
       No new trigger is created and no synthetic click is used. */
    if(nativeSurface!==host){
      nativeSurface.classList.add(CLICK_CLASS);
    }

    nativeSurface.setAttribute('aria-label','Open AI Assistant');
    nativeSurface.setAttribute('aria-expanded',panelIsOpen()?'true':'false');

    contextTone();
    computeLift();
    syncOpenState();
  }

  function queue(){
    if(!raf)raf=requestAnimationFrame(apply);
  }

  function onboarding(){
    if(!host || openState)return;
    let seen=false;
    try{seen=sessionStorage.getItem(SESSION_KEY)==='1'}catch(_){}
    if(seen)return;

    window.setTimeout(()=>{
      if(!host || openState)return;
      host.classList.add('ato-ai-onboarding');
      window.setTimeout(()=>host?.classList.remove('ato-ai-onboarding'),2400);
      try{sessionStorage.setItem(SESSION_KEY,'1')}catch(_){}
    },5600);
  }

  function interactionHooks(){
    document.addEventListener('pointerdown',e=>{
      if(!host || !host.contains(e.target))return;
      host.classList.add('ato-ai-clicking');
      window.setTimeout(()=>host?.classList.remove('ato-ai-clicking'),170);
    },true);

    document.addEventListener('click',e=>{
      if(!host || !host.contains(e.target))return;
      window.setTimeout(syncOpenState,50);
      window.setTimeout(syncOpenState,180);
      window.setTimeout(syncOpenState,450);
    },true);
  }

  function init(){
    queue();
    interactionHooks();

    const mo=new MutationObserver(()=>{
      queue();
      window.setTimeout(syncOpenState,0);
    });

    mo.observe(document.documentElement,{
      subtree:true,
      childList:true,
      attributes:true,
      attributeFilter:['class','style','aria-hidden','aria-expanded','hidden','open']
    });

    let scrollRAF=0;
    addEventListener('scroll',()=>{
      if(scrollRAF)return;
      scrollRAF=requestAnimationFrame(()=>{
        scrollRAF=0;
        contextTone();
      });
    },{passive:true});

    addEventListener('resize',()=>{
      queue();
      computeLift();
    },{passive:true});

    window.setTimeout(queue,100);
    window.setTimeout(queue,450);
    window.setTimeout(()=>{
      queue();
      onboarding();
    },1000);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{
    init();
  }
})();
