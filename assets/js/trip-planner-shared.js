(() => {
  'use strict';
  const KEY='atoTripPlannerPool';
  const MAX=8;
  const normalizeHref=(href)=>{
    if(!href) return '';
    try{
      const u=new URL(href,location.href);
      return u.pathname.split('/').filter(Boolean).pop()||'';
    }catch(_){return String(href).split('?')[0].split('#')[0].split('/').pop()||'';}
  };
  const read=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?[...new Set(v.map(normalizeHref).filter(Boolean))].slice(0,MAX):[]}catch(_){return[]}};
  const write=(v)=>{try{localStorage.setItem(KEY,JSON.stringify([...new Set(v.map(normalizeHref).filter(Boolean))].slice(0,MAX)))}catch(_){}};
  let pool=read();
  let toastTimer;
  function toast(message){
    let el=document.querySelector('.ato-planner-toast');
    if(!el){el=document.createElement('div');el.className='ato-planner-toast';document.body.appendChild(el)}
    el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2200);
  }
  function plannerHref(){
    // Category pages live at site root. This also works when opened from nested previews.
    const path=location.pathname;
    if(path.includes('/interactive-map/')) return '../trip-planner.html';
    return 'trip-planner.html';
  }
  function ensureDock(){
    let dock=document.querySelector('.ato-planner-dock');
    if(dock)return dock;
    dock=document.createElement('div');dock.className='ato-planner-dock';dock.innerHTML=`<div class="ato-planner-dock-copy"><strong></strong><small>Choose up to 8 tours from any category</small></div><button class="ato-planner-open" type="button">OPEN PLANNER</button><button class="ato-planner-clear" type="button" aria-label="Clear selected tours">×</button>`;
    dock.querySelector('.ato-planner-dock-copy').addEventListener('click',()=>location.href=plannerHref());
    dock.querySelector('.ato-planner-open').addEventListener('click',()=>location.href=plannerHref());
    dock.querySelector('.ato-planner-clear').addEventListener('click',(e)=>{e.stopPropagation();pool=[];write(pool);update()});
    document.body.appendChild(dock);return dock;
  }
  function update(){
    document.querySelectorAll('.ato-compare-control').forEach(el=>{
      const href=normalizeHref(el.dataset.tourHref);const added=pool.includes(href);
      el.classList.toggle('is-added',added);el.setAttribute('aria-pressed',added?'true':'false');
      el.textContent=added?'✓ Added':'＋ Compare';
    });
    const dock=ensureDock();const count=pool.length;
    dock.classList.toggle('visible',count>0);
    dock.querySelector('strong').textContent=`TRIP PLANNER · ${count}/${MAX} TOURS`;
  }
  function toggle(href){
    href=normalizeHref(href);if(!href)return;
    const i=pool.indexOf(href);
    if(i>=0){pool.splice(i,1)}
    else if(pool.length<MAX){pool.push(href)}
    else{toast('You can select up to 8 tours. Open Trip Planner to review your list.');return}
    write(pool);update();
  }
  function enhanceCategoryCards(){
    document.querySelectorAll('a.tour-card[href]').forEach(card=>{
      if(card.dataset.atoPlannerReady)return;card.dataset.atoPlannerReady='1';
      const href=normalizeHref(card.getAttribute('href')); if(!href)return;
      const host=card.querySelector('.tour-image')||card;
      if(getComputedStyle(host).position==='static')host.style.position='relative';
      const control=document.createElement('span');
      control.className='ato-compare-control';control.tabIndex=0;control.setAttribute('role','button');control.dataset.tourHref=href;
      const act=(e)=>{e.preventDefault();e.stopPropagation();toggle(href)};
      control.addEventListener('click',act);
      control.addEventListener('keydown',(e)=>{if(e.key==='Enter'||e.key===' '){act(e)}});
      host.appendChild(control);
    });
    update();
  }
  document.addEventListener('DOMContentLoaded',enhanceCategoryCards);
  window.addEventListener('storage',(e)=>{if(e.key===KEY){pool=read();update()}});
  window.ATOTripPlannerPool={get:()=>[...pool],toggle,clear:()=>{pool=[];write(pool);update()},max:MAX,key:KEY,normalizeHref};
})();
