const WHATSAPP='905387045999';


// Three-path gateway: preserve visible context when returning from a branch
document.querySelectorAll('.offer-path').forEach(card=>{
  card.addEventListener('click',()=>{
    document.querySelectorAll('.offer-path').forEach(x=>x.classList.remove('selected-path'));
    card.classList.add('selected-path');
  });
});


// Group & Event Planner
const groupPlanner={step:0,type:'',guests:'',interest:'',date:'',hotel:'',flexible:false};
const groupQuestions=[...document.querySelectorAll('.group-question')];
const groupIndexes=[...document.querySelectorAll('[data-group-index]')];
const groupNext=document.getElementById('groupPlannerNext');
const groupBack=document.getElementById('groupPlannerBack');
const groupDate=document.getElementById('groupPreferredDate');
const groupHotel=document.getElementById('groupHotelArea');
const groupFlexible=document.getElementById('groupFlexibleDate');
const groupDatePickerBtn=document.getElementById('groupDatePickerBtn');

function localISODate(date=new Date()){
  const y=date.getFullYear();
  const m=String(date.getMonth()+1).padStart(2,'0');
  const d=String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}
if(groupDate) groupDate.min=localISODate();

function openNativeDatePicker(input){
  if(!input) return;
  try{ if(typeof input.showPicker==='function'){ input.showPicker(); return; } }catch(_e){}
  input.focus();
  input.click();
}
groupDatePickerBtn?.addEventListener('click',()=>openNativeDatePicker(groupDate));

function groupStepReady(){
  if(groupPlanner.step===0) return !!groupPlanner.type;
  if(groupPlanner.step===1) return !!groupPlanner.guests;
  if(groupPlanner.step===2) return !!groupPlanner.interest;
  if(groupPlanner.step===3) return groupPlanner.flexible || !!groupPlanner.date;
  if(groupPlanner.step===4) return true;
  return false;
}
function updateGroupPreview(){
  const timing=groupPlanner.flexible?'Flexible — manager checks best date':(groupPlanner.date||'Choose a preferred date');
  const type=document.getElementById('groupPreviewType');
  const guests=document.getElementById('groupPreviewGuests');
  const date=document.getElementById('groupPreviewDate');
  const interest=document.getElementById('groupPreviewInterest');
  const hotel=document.getElementById('groupPreviewHotel');
  const statusEl=document.getElementById('groupPreviewStatus');
  if(type) type.textContent=groupPlanner.type||'Choose the group type';
  if(guests) guests.textContent=groupPlanner.guests||'—';
  if(interest) interest.textContent=groupPlanner.interest||'Choose a direction';
  if(date) date.textContent=timing;
  if(hotel) hotel.textContent=groupPlanner.hotel||'To be confirmed';
  if(statusEl){
    const labels=['TELL US WHO WE ARE PLANNING FOR','SET THE REAL GROUP SIZE','CHOOSE AN EXPERIENCE DIRECTION','CHOOSE A DATE OR KEEP IT FLEXIBLE','ADD THE STARTING POINT'];
    statusEl.textContent=`STEP ${String(groupPlanner.step+1).padStart(2,'0')} OF 05 · ${labels[groupPlanner.step]}`;
  }
}
function renderGroupPlanner(){
  groupQuestions.forEach((q,i)=>q.classList.toggle('active',i===groupPlanner.step));
  groupIndexes.forEach((x,i)=>x.classList.toggle('active',i===groupPlanner.step));
  if(groupBack) groupBack.hidden=groupPlanner.step===0;
  if(groupNext){groupNext.disabled=!groupStepReady();groupNext.textContent=groupPlanner.step===4?'Create My Group Request →':'Continue →';}
  updateGroupPreview();
}
document.querySelectorAll('.group-question').forEach((q,step)=>{
  q.querySelectorAll('.group-choice').forEach(btn=>btn.addEventListener('click',()=>{
    q.querySelectorAll('.group-choice').forEach(x=>x.classList.remove('selected'));
    btn.classList.add('selected');
    if(step===0) groupPlanner.type=btn.dataset.value;
    if(step===1) groupPlanner.guests=btn.dataset.value;
    if(step===2) groupPlanner.interest=btn.dataset.value;
    renderGroupPlanner();
  }));
});
groupDate?.addEventListener('input',()=>{
  groupPlanner.date=groupDate.value;
  if(groupPlanner.date){groupPlanner.flexible=false;groupFlexible?.classList.remove('selected');}
  renderGroupPlanner();
});
groupDate?.addEventListener('change',()=>{groupPlanner.date=groupDate.value;renderGroupPlanner();});
groupFlexible?.addEventListener('click',()=>{
  groupPlanner.flexible=!groupPlanner.flexible;
  groupFlexible.classList.toggle('selected',groupPlanner.flexible);
  if(groupPlanner.flexible && groupDate){groupDate.value='';groupPlanner.date='';}
  renderGroupPlanner();
});
groupHotel?.addEventListener('input',()=>{groupPlanner.hotel=groupHotel.value.trim();updateGroupPreview();});
groupNext?.addEventListener('click',()=>{
  if(!groupStepReady()) return;
  if(groupPlanner.step<4){groupPlanner.step++;renderGroupPlanner();return;}
  groupPlanner.hotel=groupHotel?.value.trim()||'';
  const timing=groupPlanner.flexible?'Flexible date':(groupPlanner.date||'Date to confirm');
  const summary=document.getElementById('groupSummaryText');
  if(summary) summary.textContent=`${groupPlanner.type} · ${groupPlanner.guests} · ${groupPlanner.interest} · ${timing}${groupPlanner.hotel?` · ${groupPlanner.hotel}`:''}. Your manager receives this exact planning brief and checks transport, availability and group conditions.`;
  document.getElementById('groupPlannerSummary')?.classList.add('show');
  document.getElementById('groupPlannerSummary')?.scrollIntoView({behavior:'smooth',block:'nearest'});
  updateGroupPreview();
});
groupBack?.addEventListener('click',()=>{if(groupPlanner.step>0){groupPlanner.step--;renderGroupPlanner();}});
document.getElementById('sendGroupOffer')?.addEventListener('click',()=>{
  const timing=groupPlanner.flexible?'Flexible — please recommend the best date':(groupPlanner.date||'To confirm');
  const lines=['GROUP & EVENT OFFER REQUEST','',`Type: ${groupPlanner.type||'—'}`,`Guests: ${groupPlanner.guests||'—'}`,`Experience direction: ${groupPlanner.interest||'—'}`,`Preferred date: ${timing}`,`Hotel / Area: ${groupPlanner.hotel||'Not specified'}`,'','Please check transport, availability, final price and the best group conditions for this request.'];
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`,'_blank','noopener');
});
renderGroupPlanner();

// Special Experience Planner
const planner={step:0,occasion:'',people:'',feeling:'',groupSize:''};
const questions=[...document.querySelectorAll('.question')];
const indexes=[...document.querySelectorAll('#experience-planner .planner-index span')];
const nextBtn=document.getElementById('plannerNext');
const backBtn=document.getElementById('plannerBack');
function currentField(){return ['occasion','people','feeling','groupSize'][planner.step]}
function updateExperiencePreview(){
  const values=[planner.occasion,planner.people,planner.feeling,planner.groupSize];
  const labels=['Occasion','People','Feeling','Group size'];
  const host=document.getElementById('experiencePreviewChips');
  if(host){host.innerHTML=values.map((v,i)=>`<span class="${v?'filled':''}">${v||labels[i]}</span>`).join('');}
  const title=document.getElementById('experiencePreviewTitle');
  if(title){
    if(values.every(Boolean)) title.textContent=`${planner.feeling.toUpperCase()} · ${planner.people.toUpperCase()} · ${planner.occasion.toUpperCase()}`;
    else title.textContent='YOUR STORY STARTS WITH FOUR CHOICES';
  }
  const copy=document.getElementById('experiencePreviewCopy');
  if(copy){copy.textContent=values.every(Boolean)?`The Journey will keep the surprise, but it will rank compatible experiences for a ${planner.feeling.toLowerCase()} ${planner.occasion.toLowerCase()} for ${planner.people.toLowerCase()} (${planner.groupSize.toLowerCase()}).`:'As you choose, this brief becomes the input for your Journey of the Heart. The final tour stays a surprise, but it will be selected from experiences that fit your answers.';}
}
function renderPlanner(){
  questions.forEach((q,i)=>q.classList.toggle('active',i===planner.step));
  indexes.forEach((x,i)=>x.classList.toggle('active',i===planner.step));
  if(backBtn) backBtn.hidden=planner.step===0;
  if(nextBtn){nextBtn.disabled=!planner[currentField()];nextBtn.textContent=planner.step===3?'Create My Experience →':'Continue →';}
  updateExperiencePreview();
}
document.querySelectorAll('.choice-grid').forEach(grid=>{
  grid.querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>{
    grid.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected'));
    btn.classList.add('selected');
    planner[grid.dataset.field]=btn.textContent.trim();
    if(nextBtn) nextBtn.disabled=false;
    updateExperiencePreview();
  }));
});
nextBtn?.addEventListener('click',()=>{
  if(!planner[currentField()]) return;
  if(planner.step<3){planner.step++;renderPlanner();return;}
  document.getElementById('plannerSummary')?.classList.add('show');
  const summary=document.getElementById('summaryText');
  if(summary) summary.textContent=`${planner.occasion} · ${planner.people} · ${planner.feeling} · ${planner.groupSize}. The Journey will now create a surprise match from experiences compatible with these choices.`;
  document.getElementById('plannerSummary')?.scrollIntoView({behavior:'smooth',block:'nearest'});
});
backBtn?.addEventListener('click',()=>{if(planner.step>0){planner.step--;renderPlanner();}});
document.getElementById('sendExperience')?.addEventListener('click',()=>{
  document.getElementById('journey')?.scrollIntoView({behavior:'smooth',block:'center'});
  setTimeout(()=>runJourney(true),620);
});
renderPlanner();

// Memory + gift moment reveal
const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    if(entry.target.classList.contains('moment')) entry.target.classList.add('visible');
    if(entry.target.id==='certificateStage'){const cw=document.getElementById('certificateWrap');cw.classList.add('revealed');const glint=cw?.querySelector('.certificate-glint');if(glint){glint.style.animation='none';void glint.offsetWidth;glint.style.animation='glint 1.55s .25s ease forwards';}}
    revealObserver.unobserve(entry.target);
  });
},{threshold:.32});
document.querySelectorAll('.moment').forEach((el,i)=>{
  el.style.transitionDelay=`${i*.11}s`;
  revealObserver.observe(el);
});
revealObserver.observe(document.getElementById('certificateStage'));

// Journey
const startJourney=document.getElementById('startJourney');
const globeZone=document.getElementById('globeZone');
const status=document.getElementById('journeyStatus');
const dockCard=document.getElementById('journeyDockCard');
const journeyCardPlaceholder=document.getElementById('journeyCardPlaceholder');
const dockLabel=document.querySelector('.journey-dock-label');
const dockCardTitle=document.getElementById('dockCardTitle');
const dockCardText=document.getElementById('dockCardText');
const flyCardTitle=document.getElementById('flyCardTitle');
const flyCardText=document.getElementById('flyCardText');
const offerResultMeta=document.getElementById('offerResultMeta');
const requestPersonalOffer=document.getElementById('requestPersonalOffer');
const alanyaDot=document.querySelector('.destination-dot');
const tourCardFly=document.getElementById('tourCardFly');
const heartTransform=document.getElementById('heartTransform');
const atoFlightOverlay=document.getElementById('atoFlightOverlay');
const atoFlightRouteBase=document.getElementById('atoFlightRouteBase');
const atoFlightRouteLive=document.getElementById('atoFlightRouteLive');
const atoLaunchPlane=document.getElementById('atoLaunchPlane');
const orbitPlaneGroup=document.getElementById('planeGroup');
const orbitRoutePath=document.querySelector('.journey-overlay-svg .route-live');
const siteLogo=document.querySelector('.header .logo');
const globeStageLive=document.getElementById('globeStageLive');
const flyCardThumb=document.getElementById('flyCardThumb');
const flyCardMeta=document.getElementById('flyCardMeta');
const dockCardThumb=document.getElementById('dockCardThumb');
const dockCardMeta=document.getElementById('dockCardMeta');
const finalTurkiyeStage=document.getElementById('finalTurkiyeStage');

const HEART_DISCOUNTS={
  'Sea Experiences':15,
  'Nature & Adventure':20,
  'Extreme & Adventure':10,
  'Family Experiences':15,
  'History & Culture':20,
  'Water Sports':13,
  'Air Experiences':17,
  'Wellness & Relax':15,
  'VIP Services':20
};

const RANDOM_TOURS=[
  {id:'relax-boat-tour',title:'Relax Boat Tour in Alanya',category:'Sea Experiences',price:25,priceUnit:'listed base price',meta:'Sea Experiences · Alanya',image:'images/relax-boat/relax-hero.jpg',url:'relax-boat-tour.html'},
  {id:'green-canyon',title:'Green Canyon in Alanya',category:'Nature & Adventure',price:35,priceUnit:'listed base price',meta:'Nature & Adventure · Green Canyon',image:'assets/images/tours/green-canyon.jpg',url:'green-canyon.html'},
  {id:'rafting-koprulu-canyon',title:'Rafting in Köprülü Canyon',category:'Extreme & Adventure',price:25,priceUnit:'listed base price',meta:'Extreme & Adventure · Köprülü Canyon',image:'images/rafting/rafting.hero.png',url:'rafting-koprulu-canyon.html'},
  {id:'land-of-legends',title:'The Land of Legends — Day Tour',category:'Family Experiences',price:75,priceUnit:'adult listed base price',meta:'Family Experiences · Belek',image:'assets/images/tours/land-of-legends.png',url:'land-of-legends.html'},
  {id:'manavgat-aspendos-side',title:'Aspendos, Side & Manavgat Waterfall',category:'History & Culture',price:75,priceUnit:'listed base price',meta:'History & Culture · Full Day',image:'assets/images/tours/manavgat-aspendos-side.png',url:'manavgat-aspendos-side.html'},
  {id:'scuba-diving',title:'Scuba Diving in Alanya',category:'Water Sports',price:35,priceUnit:'listed base price',meta:'Water Sports · Alanya',image:'assets/images/tours/scuba-diving.png',url:'scuba-diving.html'},
  {id:'paragliding',title:'Alanya Paragliding',category:'Air Experiences',price:75,priceUnit:'per person listed price',meta:'Air Experiences · Alanya',image:'assets/images/tours/paragliding.png',url:'paragliding.html'},
  {id:'turkish-hammam',title:'Turkish Hammam in Alanya',category:'Wellness & Relax',price:35,priceUnit:'listed base price',meta:'Wellness & Relax · Alanya',image:'assets/images/tours/turkish-hammam.png',url:'turkish-hammam.html'},
  {id:'private-photographer',title:'Private Photographer in Alanya',category:'VIP Services',price:100,priceUnit:'1 hour listed base price',meta:'VIP Services · Alanya',image:'assets/images/tours/private-photographer.png',url:'private-photographer.html'}
];
let activeRandomTour=null;
let lastRandomTourId=null;
let heartClientPhone='';
let heartOfferRedeemed=false;
let heartVisualOnly=false;
let journeyTimerPool=[];

function clearJourneyTimers(){journeyTimerPool.forEach(clearTimeout);journeyTimerPool=[]}
function queueJourney(fn,ms){const t=setTimeout(fn,ms);journeyTimerPool.push(t)}

function plannerHasChoices(){
  return Boolean(planner.occasion||planner.people||planner.feeling||planner.groupSize);
}

function heartMoney(value){
  if(value===null||value===undefined||Number.isNaN(Number(value))) return 'Manager confirms';
  const n=Number(value);
  return `€${Number.isInteger(n)?n:n.toFixed(2)}`;
}

function buildJourneyCard(){
  const pool=RANDOM_TOURS.filter(t=>t.id!==lastRandomTourId);
  activeRandomTour=(pool.length?pool:RANDOM_TOURS)[Math.floor(Math.random()*(pool.length?pool.length:RANDOM_TOURS.length))];
  lastRandomTourId=activeRandomTour.id;
  const title=activeRandomTour.title;
  const text='A tour chosen by the journey — discover where the heart takes you.';
  const discount=HEART_DISCOUNTS[activeRandomTour.category]||0;
  const offerPrice=activeRandomTour.price?activeRandomTour.price*(1-discount/100):null;
  dockCardTitle.textContent=title; dockCardText.textContent=text;
  flyCardTitle.textContent=title; flyCardText.textContent=text;
  if(dockCard){
    dockCard.setAttribute('href',activeRandomTour.url);
    dockCard.setAttribute('aria-label',`Open ${activeRandomTour.title}`);
  }
  const bg=`url("${activeRandomTour.image}")`;
  if(flyCardThumb) flyCardThumb.style.backgroundImage=bg;
  if(dockCardThumb) dockCardThumb.style.backgroundImage=bg;
  if(flyCardMeta) flyCardMeta.textContent=activeRandomTour.meta;
  if(dockCardMeta) dockCardMeta.textContent=activeRandomTour.meta;
  const discountEl=document.getElementById('heartDiscountValue');
  const regularEl=document.getElementById('heartRegularPrice');
  const offerEl=document.getElementById('heartOfferPrice');
  const claimBtn=document.getElementById('requestPersonalOffer');
  if(discountEl) discountEl.textContent=`${discount}% OFF`;
  if(regularEl) regularEl.textContent=`${heartMoney(activeRandomTour.price)} · ${activeRandomTour.priceUnit}`;
  if(offerEl) offerEl.textContent=`${heartMoney(offerPrice)} · discounted base`;
  if(claimBtn) claimBtn.textContent=heartVisualOnly?'OFFER ALREADY USED':`CLAIM ${discount}% OFFER →`;
  dockCard?.classList.toggle('visual-only',heartVisualOnly);
  const chips=[activeRandomTour.category,planner.occasion,planner.people,planner.feeling,planner.groupSize].filter(Boolean);
  offerResultMeta.innerHTML=chips.map(v=>`<span>${v}</span>`).join('');
}


let tourCardFlightRaf=0;

function cancelTourCardFlight(){
  if(tourCardFlightRaf){
    cancelAnimationFrame(tourCardFlightRaf);
    tourCardFlightRaf=0;
  }
}

function animateTourCardContinuously(duration=1800){
  if(!tourCardFly||!globeZone||!dockCard) return;
  cancelTourCardFlight();

  const zone=globeZone.getBoundingClientRect();
  const heart=heartTransform?.getBoundingClientRect();

  if(!heart || !heart.width || !heart.height) return;

  /* EXACT START = geometric center of the visible heart */
  const sx=(heart.left + heart.width/2) - zone.left;
  const sy=(heart.top + heart.height/2) - zone.top;

  const dock=dockCard.getBoundingClientRect();
  const ex=(dock.left + dock.width*.50) - zone.left;
  const ey=(dock.top + Math.min(dock.height*.42,96)) - zone.top;

  /* One smooth arc from heart center to card slot */
  const c1x=sx - zone.width*.08;
  const c1y=sy - zone.height*.16;
  const c2x=ex + zone.width*.14;
  const c2y=ey - zone.height*.11;

  const start=performance.now();

  const bez=(a,b,c,d,t)=>{
    const mt=1-t;
    return mt*mt*mt*a + 3*mt*mt*t*b + 3*mt*t*t*c + t*t*t*d;
  };

  const ease=t=>1-Math.pow(1-t,3);

  tourCardFly.classList.add('card-flight-active');
  tourCardFly.style.visibility='visible';
  tourCardFly.style.opacity='0';
  tourCardFly.style.filter='blur(5px) brightness(1.35)';

  /* place card at heart center before first frame */
  tourCardFly.style.transform=
    `translate(${sx}px,${sy}px) translate(-50%,-50%) scale(.08) rotate(-5deg)`;

  const frame=(now)=>{
    const raw=Math.min(1,(now-start)/duration);
    const t=ease(raw);

    const x=bez(sx,c1x,c2x,ex,t);
    const y=bez(sy,c1y,c2y,ey,t);

    const scale=.08 + (.84-.08)*(1-Math.pow(1-t,1.25));
    const rotate=-5*(1-t);
    const blur=Math.max(0,5*(1-raw*3.5));

    tourCardFly.style.opacity=raw<.08 ? String(raw/.08) : '1';
    tourCardFly.style.filter=`blur(${blur}px) brightness(${1.35-.35*t})`;
    tourCardFly.style.transform=
      `translate(${x}px,${y}px) translate(-50%,-50%) scale(${scale}) rotate(${rotate}deg)`;

    if(raw<1){
      tourCardFlightRaf=requestAnimationFrame(frame);
    }else{
      tourCardFlightRaf=0;
      tourCardFly.style.opacity='1';
      tourCardFly.style.filter='none';
      tourCardFly.style.transform=
        `translate(${ex}px,${ey}px) translate(-50%,-50%) scale(.84) rotate(0deg)`;
    }
  };

  tourCardFlightRaf=requestAnimationFrame(frame);
}

function setCardFlightGeometry(){
  if(!alanyaDot || !tourCardFly || !globeZone || !dockCard) return;

  const zone=globeZone.getBoundingClientRect();
  const dot=alanyaDot.getBoundingClientRect();
  const dock=dockCard.getBoundingClientRect();

  const zoneCenterX=zone.left + zone.width/2;
  const zoneCenterY=zone.top + zone.height/2;
  const dotCenterX=dot.left + dot.width/2;
  const dotCenterY=dot.top + dot.height/2;
  const dockCenterX=dock.left + Math.min(dock.width*.70, dock.width-28);
  const dockCenterY=dock.top + Math.min(dock.height*.42, 76);

  globeZone.style.setProperty('--card-origin-x',`${dotCenterX-zoneCenterX}px`);
  globeZone.style.setProperty('--card-origin-y',`${dotCenterY-zoneCenterY}px`);
  globeZone.style.setProperty('--card-fly-x',`${dockCenterX-zoneCenterX}px`);
  globeZone.style.setProperty('--card-fly-y',`${dockCenterY-zoneCenterY}px`);
}



let logoFlightRaf=0;
let orbitFlightRaf=0;

function cancelAircraftAnimations(){
  if(logoFlightRaf) cancelAnimationFrame(logoFlightRaf);
  if(orbitFlightRaf) cancelAnimationFrame(orbitFlightRaf);
  logoFlightRaf=0;
  orbitFlightRaf=0;
}

function animateHtmlPlaneAlongSvg(pathEl, planeEl, duration=2400){
  if(!pathEl||!planeEl) return;
  if(logoFlightRaf) cancelAnimationFrame(logoFlightRaf);

  const total=pathEl.getTotalLength();
  const start=performance.now();

  const frame=(now)=>{
    const p=Math.min(1,(now-start)/duration);
    const eased=1-Math.pow(1-p,3);
    const len=total*eased;
    const pt=pathEl.getPointAtLength(len);
    const ahead=pathEl.getPointAtLength(Math.min(total,len+2));
    const angle=Math.atan2(ahead.y-pt.y,ahead.x-pt.x)*180/Math.PI;

    planeEl.style.left='0px';
    planeEl.style.top='0px';
    planeEl.style.transform=`translate(${pt.x}px,${pt.y}px) translate(-50%,-50%) rotate(${angle}deg)`;
    planeEl.style.opacity='1';

    if(p<1){
      logoFlightRaf=requestAnimationFrame(frame);
    }else{
      logoFlightRaf=0;
    }
  };
  logoFlightRaf=requestAnimationFrame(frame);
}

function animateSvgPlaneAlongPath(pathEl, groupEl, duration=3050){
  if(!pathEl||!groupEl) return;
  if(orbitFlightRaf) cancelAnimationFrame(orbitFlightRaf);

  const total=pathEl.getTotalLength();
  const start=performance.now();

  const frame=(now)=>{
    const p=Math.min(1,(now-start)/duration);
    const eased=p<.5 ? 2*p*p : 1-Math.pow(-2*p+2,2)/2;
    const len=total*eased;
    const pt=pathEl.getPointAtLength(len);
    const ahead=pathEl.getPointAtLength(Math.min(total,len+2));
    const angle=Math.atan2(ahead.y-pt.y,ahead.x-pt.x)*180/Math.PI;

    groupEl.setAttribute('transform',`translate(${pt.x} ${pt.y}) rotate(${angle})`);
    groupEl.style.opacity='1';
    groupEl.style.visibility='visible';

    if(p<1){
      orbitFlightRaf=requestAnimationFrame(frame);
    }else{
      orbitFlightRaf=0;
    }
  };
  orbitFlightRaf=requestAnimationFrame(frame);
}

function setLogoFlightGeometry(){
  if(!atoFlightOverlay||!atoFlightRouteBase||!atoFlightRouteLive||!atoLaunchPlane||!siteLogo||!globeStageLive) return;
  const logo=siteLogo.getBoundingClientRect(), globe=globeStageLive.getBoundingClientRect();
  const sx=logo.left+Math.min(logo.width*.78,logo.width-10), sy=logo.top+logo.height*.52;
  const ex=globe.left+globe.width*.28, ey=globe.top+globe.height*.30, dx=ex-sx;
  const d=`M ${sx} ${sy} C ${sx+dx*.30} ${sy-Math.max(70,Math.abs(dx)*.10)}, ${sx+dx*.72} ${ey-Math.max(45,Math.abs(dx)*.05)}, ${ex} ${ey}`;
  atoFlightRouteBase.setAttribute('d',d); atoFlightRouteLive.setAttribute('d',d);
}
function launchFromLogo(){
  if(!atoFlightOverlay) return;
  setLogoFlightGeometry();
  atoFlightOverlay.classList.remove('fly','route-visible','route-fade');
  atoLaunchPlane.style.opacity='0';
  atoLaunchPlane.style.transform='translate(-9999px,-9999px)';
  void atoFlightOverlay.offsetWidth;
  atoFlightOverlay.classList.add('active');

  requestAnimationFrame(()=>{
    atoFlightOverlay.classList.add('fly');
    animateHtmlPlaneAlongSvg(atoFlightRouteLive,atoLaunchPlane,2400);
    setTimeout(()=>atoFlightOverlay.classList.add('route-visible'),220);
  });
}
function endLogoFlight(){
  if(!atoFlightOverlay) return;
  if(logoFlightRaf){
    cancelAnimationFrame(logoFlightRaf);
    logoFlightRaf=0;
  }
  atoFlightOverlay.classList.add('route-fade');
  setTimeout(()=>{
    atoFlightOverlay.classList.remove('fly','active','route-visible','route-fade');
    atoLaunchPlane.style.opacity='0';
    atoLaunchPlane.style.transform='translate(-9999px,-9999px)';
  },520);
}

function resetJourneyVisual(){
  tourCardFly?.classList.remove('card-flight-active');
  cancelTourCardFlight();
  if(tourCardFly){
    tourCardFly.style.opacity='0';
    tourCardFly.style.filter='none';
    tourCardFly.style.transform='';
  }
  cancelAircraftAnimations();
  if(orbitPlaneGroup){
    orbitPlaneGroup.removeAttribute('transform');
    orbitPlaneGroup.style.opacity='0';
    orbitPlaneGroup.style.visibility='hidden';
  }
  journeyCardPlaceholder?.classList.remove('is-hidden');
  dockCard?.classList.remove('visible','final-visible');
  clearJourneyTimers(); endLogoFlight();
  globeZone.classList.remove('journey-running','orbit-flight','orbit-complete','journey-arrived','turkiye-focus','alanya-landed','journey-pulse','light-collapse','journey-heart','heart-full','journey-explode','journey-card-launch','card-landed','heart-after-card','heart-return','final-turkiye');
  dockCard.classList.remove('visible'); dockLabel?.classList.remove('ready');
  status.innerHTML='<strong>ALANYA TOUR ORGANIZATIONS IS WAITING.</strong><span>LOGO → FLIGHT → GLOBE → TÜRKİYE → ALANYA → HEART → TOUR</span>';
  startJourney.disabled=false; startJourney.classList.remove('is-active');
  if(startJourney.querySelector('span')) startJourney.querySelector('span').textContent='START MY JOURNEY →';
  createBokehDots(64);

  document.querySelectorAll('.journey-overlay-svg .route-base,.journey-overlay-svg .route-live').forEach(p=>{
    p.style.opacity='0';
    p.style.visibility='hidden';
    p.style.stroke='transparent';
  });
  document.querySelectorAll('.journey-overlay-svg .plane-group').forEach(p=>{
    p.style.opacity='0';
    p.style.visibility='hidden';
  });

  dockCard?.classList.remove('visible','final-visible');
  dockLabel?.classList.remove('ready');
}

function landOfferCard(){
  cancelTourCardFlight();

  // 1) Show the permanent card in the destination slot FIRST.
  if(dockCard){
    dockCard.classList.add('handoff-ready','final-visible');
    dockCard.style.removeProperty('opacity');
    dockCard.style.removeProperty('visibility');
    dockCard.style.removeProperty('transform');
    dockCard.style.removeProperty('filter');
    void dockCard.offsetWidth;
  }
  dockLabel?.classList.add('ready');
  journeyCardPlaceholder?.classList.add('is-hidden');

  // 2) Only after the dock card is painted, hide the flying copy.
  requestAnimationFrame(()=>{
    if(tourCardFly){
      tourCardFly.classList.remove('card-flight-active');
      tourCardFly.style.opacity='0';
      tourCardFly.style.visibility='hidden';
      tourCardFly.style.pointerEvents='none';
    }
    dockCard?.classList.remove('handoff-ready');
    globeZone.classList.add('card-landed');
  });
}


function setHeartOriginFromAlanya(){
  const pin=document.getElementById('alanyaLandingPin');
  const zone=document.getElementById('globeZone');
  if(!pin||!zone) return;
  const pr=pin.getBoundingClientRect();
  const zr=zone.getBoundingClientRect();
  if(!zr.width||!zr.height) return;
  const x=((pr.left+pr.width/2-zr.left)/zr.width)*100;
  const y=((pr.top+pr.height/2-zr.top)/zr.height)*100;
  zone.style.setProperty('--heart-origin-x',`${x}%`);
  zone.style.setProperty('--heart-origin-y',`${y}%`);
}


function setHeartOriginFromExactAlanya(){
  const pin=document.getElementById('alanyaLandingPin');
  const zone=document.getElementById('globeZone');
  if(!zone) return;

  // During the live Türkiye phase, use the actual live Alanya pin.
  if(pin){
    const pr=pin.getBoundingClientRect();
    const zr=zone.getBoundingClientRect();
    if(zr.width && zr.height && pr.width){
      const x=((pr.left+pr.width/2-zr.left)/zr.width)*100;
      const y=((pr.top+pr.height/2-zr.top)/zr.height)*100;
      zone.style.setProperty('--heart-origin-x',`${x}%`);
      zone.style.setProperty('--heart-origin-y',`${y}%`);
      return;
    }
  }

  // Fallback to the exact geographic Alanya position from the final SVG map.
  zone.style.setProperty('--heart-origin-x',`33.237%`);
  zone.style.setProperty('--heart-origin-y',`74.294%`);
}

function runJourney(fromPlanner=false){
  buildJourneyCard();
  resetJourneyVisual();
  journeyCardPlaceholder?.classList.add('is-hidden');
  dockCard?.classList.remove('visible','final-visible');
  dockLabel?.classList.remove('ready');

  requestAnimationFrame(()=>{
    setCardFlightGeometry();
    setLogoFlightGeometry();
    void globeZone.offsetWidth;

    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      globeZone.classList.remove(
        'journey-running','orbit-flight','orbit-complete','journey-arrived',
        'turkiye-focus','alanya-landed','journey-pulse','light-collapse',
        'journey-heart','heart-full','journey-explode','journey-card-launch','heart-after-card','heart-return'
      );
      globeZone.classList.remove(
        'journey-running','orbit-flight','orbit-complete','journey-arrived',
        'turkiye-focus','alanya-landed','journey-pulse','light-collapse',
        'journey-heart','heart-full','journey-explode','journey-card-launch',
        'card-landed','heart-after-card','heart-return'
      );
      globeZone.classList.add('final-turkiye');
      const finalPin=document.getElementById('finalAlanyaMapPin');
      if(finalPin){
        finalPin.style.opacity='1';
        finalPin.style.visibility='visible';
      }
      const finalStageRM=document.getElementById('finalTurkiyeStage');
      if(finalStageRM){finalStageRM.style.display='grid';finalStageRM.style.visibility='visible';finalStageRM.style.opacity='1';}
      const finalStage=document.getElementById('finalTurkiyeStage');
      if(finalStage){
        finalStage.style.display='grid';
        finalStage.style.visibility='visible';
        finalStage.style.opacity='1';
      }
      status.innerHTML='<strong>WE ARE HERE.</strong><span>ALANYA · 36.532392° N · 32.038899° E</span>';
      startJourney.disabled=false;
      startJourney.classList.remove('is-active');
      if(startJourney.querySelector('span')) startJourney.querySelector('span').textContent='PLAY AGAIN →';
      journeyCardPlaceholder?.classList.add('is-hidden');
      dockCard?.style.removeProperty('transform');
      dockCard?.style.removeProperty('margin-top');
      if(dockCard){
        dockCard.style.removeProperty('position');
        dockCard.style.removeProperty('left');
        dockCard.style.removeProperty('right');
        dockCard.style.removeProperty('top');
        dockCard.style.removeProperty('bottom');
        dockCard.style.removeProperty('margin');
        dockCard.style.removeProperty('transform');
      }
      dockCard?.classList.add('final-visible');
      dockLabel?.classList.add('ready');
      return;
    }

    startJourney.classList.add('is-active');
    startJourney.disabled=true;
    if(startJourney.querySelector('span')) startJourney.querySelector('span').textContent='THIS IS MY JOURNEY';
    createBokehDots(92);

    /* 01 START — only logo + globe, no route. */
    status.innerHTML='<strong>THE JOURNEY BEGINS HERE.</strong><span>ALANYA TOUR ORGANIZATIONS</span>';

    /* 02 AIRCRAFT LEAVES LOGO — route appears only after launch. */
    queueJourney(()=>{
      launchFromLogo();
      status.innerHTML='<strong>FOLLOW THE FLIGHT.</strong><span>ALANYA TOUR ORGANIZATIONS → THE WORLD</span>';
    },650);

    /* 03 AIRCRAFT REACHES GLOBE AND ORBITS IT. */
    queueJourney(()=>{
      endLogoFlight();
      document.querySelectorAll('.journey-overlay-svg .route-base,.journey-overlay-svg .route-live').forEach(p=>{
        p.style.removeProperty('opacity');
        p.style.removeProperty('visibility');
        p.style.removeProperty('stroke');
      });
      document.querySelectorAll('.journey-overlay-svg .plane-group').forEach(p=>{
        p.style.removeProperty('opacity');
        p.style.removeProperty('visibility');
      });
      globeZone.classList.add('journey-running','orbit-flight');
      animateSvgPlaneAlongPath(orbitRoutePath,orbitPlaneGroup,3050);
      status.innerHTML='<strong>AROUND THE WORLD.</strong><span>ONE ORBIT → ONE DESTINATION</span>';
    },3300);

    /* 04 ORBIT LINE / PLANE DISAPPEAR, THEN FOCUS ON TÜRKİYE. */
    queueJourney(()=>{
      if(orbitFlightRaf){cancelAnimationFrame(orbitFlightRaf);orbitFlightRaf=0;}
      globeZone.classList.add('orbit-complete');
    },6150);

    queueJourney(()=>{
      globeZone.classList.remove('orbit-flight');
      globeZone.classList.add('journey-arrived','turkiye-focus');
      status.innerHTML='<strong>REPUBLIC OF TÜRKİYE.</strong><span>THE WORLD NARROWS TO ONE PLACE</span>';
    },6750);

    /* 05 ALANYA COORDINATES APPEAR. */
    queueJourney(()=>{
      globeZone.classList.add('alanya-landed');
      status.innerHTML='<strong>ALANYA.</strong><span>36.532392° N · 32.038899° E</span>';
    },8000);

    /* 06 WE ARE HERE pin drops. */
    queueJourney(()=>{
      globeZone.classList.add('journey-pulse');
      status.innerHTML='<strong>WE ARE HERE.</strong><span>ALANYA · 36.532392° N · 32.038899° E</span>';
    },8950);

    /* 07 Text changes. */
    queueJourney(()=>{
      status.innerHTML='<strong>ALANYA TOUR ORGANIZATIONS IS WAITING.</strong><span>THIS POINT IS WHERE YOUR STORY BEGINS</span>';
    },9800);

    /* 08 Blue light collapses into Alanya point. */
    queueJourney(()=>{
      setHeartOriginFromExactAlanya();
      globeZone.classList.add('light-collapse');
      status.innerHTML='<strong>THE WORLD BECOMES A FEELING.</strong><span>COLD BLUE LIGHT → ONE WARM RED CORE</span>';
    },10650);

    /* 09 Red core. */
    queueJourney(()=>{
      status.innerHTML='<strong>THE POINT BECOMES A HEART.</strong><span>ALANYA → EMOTION</span>';
    },11450);

    /* 10 Red digital heart is born. */
    queueJourney(()=>{
      setHeartOriginFromExactAlanya();
      globeZone.classList.add('journey-heart');
      status.innerHTML='<strong>A HEART IS BORN.</strong><span>ONE PLACE → ONE FEELING</span>';
    },12150);

    /* 11 Heart grows once, then settles. */
    queueJourney(()=>{
      globeZone.classList.add('heart-full');
      status.innerHTML='<strong>FOLLOW YOUR HEART.</strong><span>ONE HEART · ONE JOURNEY</span>';
    },13250);

    /* 12 Celebration: give the full confetti burst time to finish. */
    queueJourney(()=>{
      globeZone.classList.add('journey-explode');
      status.innerHTML='<strong>THE HEART CELEBRATES.</strong><span>ONE MOMENT BEFORE YOUR TOUR APPEARS</span>';
    },14350);

    /* 12A Card starts only after the complete confetti burst. */
    queueJourney(()=>{
      globeZone.classList.remove('journey-explode');
      setCardFlightGeometry();
      globeZone.classList.add('journey-card-launch');
      animateTourCardContinuously(1800);
      status.innerHTML='<strong>YOUR TOUR APPEARS.</strong><span>STRAIGHT FROM THE HEART</span>';
    },16150);

    /* 12B The heart starts shrinking only after the card has clearly escaped. */
    queueJourney(()=>{
      globeZone.classList.add('heart-after-card');
      status.innerHTML='<strong>THE HEART LETS IT FLY.</strong><span>ONE LAST BEAT · THEN HOME</span>';
    },17050);

    /* Card completes its continuous bezier flight before the dock handoff. */
    queueJourney(()=>{
      cancelTourCardFlight();
      landOfferCard();
    },18050);

    /* 13 Heart returns only after its pulse-down animation has completed. */
    queueJourney(()=>{
      dockCard?.classList.add('final-visible');
      globeZone.classList.remove('journey-card-launch');
      globeZone.classList.add('heart-return');
      status.innerHTML='<strong>THE HEART COMES HOME.</strong><span>BACK TO ALANYA</span>';
    },19150);

    /* 14–15 Final state begins after the return animation is fully complete. */
    queueJourney(()=>{
      globeZone.classList.remove('heart-full','heart-after-card','heart-return');
      globeZone.classList.add('final-turkiye');
      status.innerHTML='<strong>WE ARE HERE.</strong><span>ALANYA · 36.532392° N · 32.038899° E</span>';
      startJourney.disabled=false;
      startJourney.classList.remove('is-active');
      if(startJourney.querySelector('span')) startJourney.querySelector('span').textContent='PLAY AGAIN →';
    },20650);
  });
}

startJourney.addEventListener('click',()=>runJourney(false));

window.addEventListener('resize',()=>{
  setLogoFlightGeometry();
  if(globeZone.classList.contains('alanya-landed')||globeZone.classList.contains('journey-heart')){
    setHeartOriginFromExactAlanya();
  }
  if(globeZone.classList.contains('card-landed')){
    setCardFlightGeometry();
  }
});

requestPersonalOffer?.addEventListener('click',(e)=>{e.preventDefault();e.stopPropagation();openHeartClaimModal();});
document.querySelectorAll('#heartOfferTrigger,#heartPriceTrigger').forEach(trigger=>{
  const claim=e=>{
    e.preventDefault();
    e.stopPropagation();
    openHeartClaimModal();
  };
  trigger.addEventListener('click',claim);
  trigger.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){claim(e)}
  });
});

// ===== HEART OFFER COMMERCIAL FLOW =====
const heartEligibilityModal=document.getElementById('heartEligibilityModal');
const heartClaimModal=document.getElementById('heartClaimModal');
const heartEligibilityForm=document.getElementById('heartEligibilityForm');
const heartEligibilityStatus=document.getElementById('heartEligibilityStatus');
const heartClaimForm=document.getElementById('heartClaimForm');
const heartClaimStatus=document.getElementById('heartClaimStatus');
const viewHeartTour=document.getElementById('viewHeartTour');
const chooseAnotherHeartTour=document.getElementById('chooseAnotherHeartTour');

function openHeartModal(modal){if(!modal)return;modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.documentElement.style.overflow='hidden'}
function closeHeartModal(modal){if(!modal)return;modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');if(!document.querySelector('.heart-modal.is-open')) document.documentElement.style.removeProperty('overflow')}
document.querySelectorAll('[data-heart-close]').forEach(el=>el.addEventListener('click',()=>closeHeartModal(el.closest('.heart-modal'))));
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.heart-modal.is-open').forEach(closeHeartModal)});

function normalizeHeartPhoneClient(raw){
  let d=String(raw||'').replace(/\D/g,'');
  if(d.startsWith('00')) d=d.slice(2);
  if(/^0\d{10}$/.test(d)) d='90'+d.slice(1);
  return d;
}
function setHeartStatus(el,msg,type=''){if(!el)return;el.textContent=msg||'';el.classList.remove('is-error','is-success');if(type)el.classList.add(`is-${type}`)}
// Heart Offer uses the SAME Supabase / ATO Booking Manager as Map + Trip Planner.
// No second manager and no cookie/localStorage enforcement.
let heartBookingConfigPromise=null;
function detectHeartBookingConfig(){
  const candidates=[
    window.ATO_BOOKING_CONFIG,
    window.ATO_CONFIG,
    window.ATOBookingConfig,
    window.atoBookingConfig
  ].filter(Boolean);
  for(const cfg of candidates){
    const url=cfg.supabaseUrl||cfg.supabaseURL||cfg.url||cfg.SUPABASE_URL||'';
    const key=cfg.supabaseAnonKey||cfg.supabaseKey||cfg.anonKey||cfg.publishableKey||cfg.supabasePublishableKey||cfg.SUPABASE_ANON_KEY||cfg.SUPABASE_PUBLISHABLE_KEY||'';
    if(/^https:\/\/.+\.supabase\.co\/?$/i.test(String(url))&&String(key).length>20){
      return {url:String(url).replace(/\/$/,''),key:String(key)};
    }
  }
  return null;
}
function loadHeartConfigScript(src){
  return new Promise((resolve,reject)=>{
    const existing=[...document.scripts].find(x=>x.src&&new URL(x.src,location.href).pathname===src);
    if(existing){
      if(detectHeartBookingConfig()) return resolve();
      existing.addEventListener('load',()=>resolve(),{once:true});
      existing.addEventListener('error',()=>reject(new Error(`Could not load ${src}`)),{once:true});
      setTimeout(resolve,350);
      return;
    }
    const el=document.createElement('script');el.src=src;el.async=false;
    el.onload=()=>resolve();el.onerror=()=>reject(new Error(`Could not load ${src}`));
    document.head.appendChild(el);
  });
}
async function getHeartBookingConfig(){
  const ready=detectHeartBookingConfig();if(ready)return ready;
  if(!heartBookingConfigPromise){
    heartBookingConfigPromise=(async()=>{
      const paths=['/booking-config.js','/interactive-map/booking-config.js','/assets/js/ato-config.js'];
      for(const src of paths){
        try{await loadHeartConfigScript(src)}catch(_){/* try next known ATO config location */}
        const cfg=detectHeartBookingConfig();if(cfg)return cfg;
      }
      throw new Error('ATO Booking Manager connection was not found. Upload this page to the same site where Map / Booking Manager is connected.');
    })();
  }
  return heartBookingConfigPromise;
}
async function heartRpc(functionName,payload){
  const cfg=await getHeartBookingConfig();
  const res=await fetch(`${cfg.url}/rest/v1/rpc/${functionName}`,{
    method:'POST',
    headers:{
      apikey:cfg.key,
      Authorization:`Bearer ${cfg.key}`,
      'Content-Type':'application/json',
      Accept:'application/json'
    },
    body:JSON.stringify(payload||{}),
    cache:'no-store'
  });
  let data=null;try{data=await res.json()}catch{}
  if(!res.ok){
    const message=data?.message||data?.details||data?.hint||`Heart Offer / ATO Booking Manager error (${res.status})`;
    const err=new Error(message);err.status=res.status;err.data=data;throw err;
  }
  return data||{};
}

function showHeartRedeemedState(){
  heartOfferRedeemed=true;heartVisualOnly=true;
  const dock=document.getElementById('journeyDock');
  const template=document.getElementById('heartRedeemedTemplate');
  journeyCardPlaceholder?.classList.add('is-hidden');
  dockCard?.classList.remove('visible','final-visible');
  let state=document.getElementById('heartRedeemedState');
  if(!state&&dock&&template){
    state=document.createElement('div');
    state.id='heartRedeemedState';
    state.innerHTML=template.innerHTML;
    dock.appendChild(state);
    state.querySelector('#heartReplayVisual')?.addEventListener('click',()=>{
      state.classList.add('is-hidden');
      heartVisualOnly=true;
      runJourney(false);
    });
  }
  state?.classList.remove('is-hidden');
  startJourney.disabled=false;startJourney.classList.remove('is-active');
  if(startJourney.querySelector('span'))startJourney.querySelector('span').textContent='WATCH JOURNEY AGAIN →';
  status.innerHTML='<strong>YOUR HEART OFFER HAS ALREADY BEEN USED.</strong><span>THANK YOU FOR TRAVELLING WITH US.</span>';
}

async function verifyHeartEligibility(phone){
  const normalized=normalizeHeartPhoneClient(phone);
  if(normalized.length<10||normalized.length>15) throw new Error('Please enter a valid WhatsApp number with country code.');
  const data=await heartRpc('heart_offer_check',{p_phone:normalized});
  heartClientPhone=data.phone||normalized;
  sessionStorage.setItem('atoHeartPhone',heartClientPhone);
  if(data.redeemed){showHeartRedeemedState();return false}
  heartOfferRedeemed=false;heartVisualOnly=false;return true;
}

async function beginHeartOfferJourney(){
  if(heartOfferRedeemed){heartVisualOnly=true;runJourney(false);return}
  const stored=heartClientPhone||sessionStorage.getItem('atoHeartPhone')||'';
  if(stored){
    try{
      status.innerHTML='<strong>CHECKING YOUR HEART OFFER.</strong><span>ONE MOMENT…</span>';
      if(await verifyHeartEligibility(stored)){runJourney(false)}
    }catch(err){
      sessionStorage.removeItem('atoHeartPhone');heartClientPhone='';
      const phoneInput=document.getElementById('heartPhone');if(phoneInput)phoneInput.value=stored;
      setHeartStatus(heartEligibilityStatus,err.message,'error');openHeartModal(heartEligibilityModal);
    }
    return;
  }
  setHeartStatus(heartEligibilityStatus,'');openHeartModal(heartEligibilityModal);setTimeout(()=>document.getElementById('heartPhone')?.focus(),80);
}

heartEligibilityForm?.addEventListener('submit',async e=>{
  e.preventDefault();
  const btn=document.getElementById('heartEligibilitySubmit');
  const phone=document.getElementById('heartPhone').value;
  btn.disabled=true;setHeartStatus(heartEligibilityStatus,'Checking with ATO Booking Manager…');
  try{
    const ok=await verifyHeartEligibility(phone);
    closeHeartModal(heartEligibilityModal);
    if(ok)runJourney(false);
  }catch(err){setHeartStatus(heartEligibilityStatus,err.message,'error')}
  finally{btn.disabled=false}
});

viewHeartTour?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(activeRandomTour?.url)window.location.href=activeRandomTour.url});
chooseAnotherHeartTour?.addEventListener('click',e=>{
  e.preventDefault();
  e.stopPropagation();
  heartVisualOnly=false;
  runJourney(false);
});

function openHeartClaimModal(){
  if(heartVisualOnly||heartOfferRedeemed||!activeRandomTour)return;
  const discount=HEART_DISCOUNTS[activeRandomTour.category]||0;
  const offerPrice=activeRandomTour.price?activeRandomTour.price*(1-discount/100):null;
  document.getElementById('heartClaimTour').textContent=activeRandomTour.title;
  document.getElementById('heartClaimCategory').textContent=activeRandomTour.category;
  document.getElementById('heartClaimDiscount').textContent=`${discount}% OFF`;
  document.getElementById('heartClaimPrice').textContent=`${heartMoney(activeRandomTour.price)} → ${heartMoney(offerPrice)} · discounted listed base`;
  document.getElementById('heartClaimPhone').value=heartClientPhone||sessionStorage.getItem('atoHeartPhone')||'';
  const date=document.getElementById('heartDesiredDate');if(date){date.min=new Date().toISOString().slice(0,10)}
  setHeartStatus(heartClaimStatus,'');openHeartModal(heartClaimModal);
}

heartClaimForm?.addEventListener('submit',async e=>{
  e.preventDefault();if(!activeRandomTour)return;
  const btn=document.getElementById('heartClaimSubmit');btn.disabled=true;setHeartStatus(heartClaimStatus,'Saving your Heart Offer in ATO Booking Manager…');
  const payload={
    phone:document.getElementById('heartClaimPhone').value,
    clientName:document.getElementById('heartClientName').value.trim(),
    adults:Number(document.getElementById('heartAdults').value||1),
    children:document.getElementById('heartChildren').value.trim(),
    desiredDate:document.getElementById('heartDesiredDate').value,
    hotel:document.getElementById('heartHotel').value.trim(),
    comment:document.getElementById('heartComment').value.trim(),
    tourId:activeRandomTour.id,
    planner:{occasion:planner.occasion||'',people:planner.people||'',feeling:planner.feeling||'',groupSize:planner.groupSize||''}
  };
  try{
    const normalized=normalizeHeartPhoneClient(payload.phone);
    if(normalized.length<10||normalized.length>15) throw new Error('Please enter a valid WhatsApp number with country code.');

    // Eligibility is checked only when the client actually claims the offer.
    const eligibility=await heartRpc('heart_offer_check',{p_phone:normalized});
    if(eligibility?.redeemed){
      closeHeartModal(heartClaimModal);
      heartClientPhone=eligibility.phone||normalized;
      showHeartRedeemedState();
      return;
    }

    const result=await heartRpc('heart_offer_claim',{
      p_phone:normalized,
      p_client_name:payload.clientName,
      p_adults:payload.adults,
      p_children:payload.children,
      p_desired_date:payload.desiredDate||null,
      p_hotel:payload.hotel,
      p_comment:payload.comment,
      p_tour_id:payload.tourId,
      p_planner:payload.planner
    });
    if(result.redeemed){closeHeartModal(heartClaimModal);showHeartRedeemedState();return}
    heartClientPhone=result.phone||normalized;sessionStorage.setItem('atoHeartPhone',heartClientPhone);
    setHeartStatus(heartClaimStatus,`Offer ${result.code} is now PENDING in your ATO Booking Manager. Opening WhatsApp…`,'success');
    const lines=[
      '❤️ HEART OFFER CLAIM','',
      `Offer code: ${result.code}`,
      `Status: ${result.status}`,
      'ATO Booking Manager: request saved in the same queue as Map / Trip Planner requests',
      `Tour: ${result.tour.title}`,
      `Category: ${result.tour.category}`,
      `Regular listed price: ${result.pricing.regularPriceText}`,
      `Heart discount: ${result.pricing.discount}%`,
      `Heart listed price: ${result.pricing.offerPriceText}`,
      'Final booking total: manager confirms after guest ages / tariff rules.','',
      `Client: ${result.client.clientName}`,
      `WhatsApp: +${result.phone}`,
      `Adults: ${result.client.adults}`,
      `Children & ages: ${result.client.children||'—'}`,
      `Desired date: ${result.client.desiredDate||'Flexible'}`,
      `Hotel / area: ${result.client.hotel||'—'}`,
      `Comment: ${result.client.comment||'—'}`
    ];
    if(result.client.planner?.occasion) lines.push('',`Journey occasion: ${result.client.planner.occasion}`);
    lines.push('',`Tour page: ${location.origin}/${String(result.tour.url||'').replace(/^\//,'')}`,'','The Heart Offer is redeemed automatically only when the manager CONFIRMS this booking in ATO Booking Manager.');
    setTimeout(()=>window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`,'_blank','noopener'),250);
    setTimeout(()=>closeHeartModal(heartClaimModal),900);
  }catch(err){
    setHeartStatus(heartClaimStatus,err.message,'error');
  }finally{btn.disabled=false}
});

// Certificate subtle tilt: desktop only, tiny angle.
const card=document.getElementById('certificateCard');
const wrap=document.getElementById('certificateWrap');
if(window.matchMedia('(pointer:fine)').matches){
  card.addEventListener('pointermove',e=>{
    if(!wrap.classList.contains('revealed'))return;
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`rotateY(${x*5}deg) rotateX(${-y*4}deg)`;
  });
  card.addEventListener('pointerleave',()=>card.style.transform='rotateY(0deg) rotateX(0deg)');
}

// ===== GIFT CERTIFICATE -> EXISTING ATO BOOKING MANAGER =====
const giftOptions=[...document.querySelectorAll('[data-gift-mode]')];
const giftBuilder=document.getElementById('giftBuilder');
const giftForm=document.getElementById('giftForm');
const giftModeInput=document.getElementById('giftMode');
const giftFreedomFields=document.getElementById('giftFreedomFields');
const giftSignatureFields=document.getElementById('giftSignatureFields');
const giftAmount=document.getElementById('giftAmount');
const giftExperience=document.getElementById('giftExperience');
const giftPreferredDate=document.getElementById('giftPreferredDate');
const giftFlexibleDate=document.getElementById('giftFlexibleDate');
const giftDeliveryDate=document.getElementById('giftDeliveryDate');
const giftStatus=document.getElementById('giftStatus');
const giftSubmit=document.getElementById('giftSubmit');
let activeGiftMode='';

function setGiftStatus(message,type=''){
  if(!giftStatus)return;
  giftStatus.textContent=message||'';
  giftStatus.classList.remove('is-error','is-success');
  if(type)giftStatus.classList.add(`is-${type}`);
}
function giftDateText(value){
  if(!value)return 'Manager confirmation';
  try{return new Intl.DateTimeFormat(document.documentElement.lang||'en',{dateStyle:'medium'}).format(new Date(`${value}T12:00:00`))}catch(_){return value}
}
function updateGiftPreview(){
  const recipient=document.getElementById('giftRecipientName')?.value.trim()||'YOUR RECIPIENT';
  const amount=Number(giftAmount?.value||0);
  const experience=giftExperience?.value.trim()||'YOUR CHOSEN EXPERIENCE';
  const main=activeGiftMode==='signature'?experience:(amount>0?`€${amount.toLocaleString()}`:'CHOOSE VALUE');
  const fieldLabel=activeGiftMode==='signature'?'EXPERIENCE':'AMOUNT';
  document.querySelectorAll('[data-cert-field="fieldLabel"]').forEach(el=>el.textContent=fieldLabel);
  document.querySelectorAll('[data-cert-field="mainValue"]').forEach(el=>el.textContent=main);
  document.querySelectorAll('[data-cert-field="recipient"]').forEach(el=>el.textContent=recipient.toUpperCase());
  document.querySelectorAll('[data-cert-field="validUntil"]').forEach(el=>el.textContent='VALID FOR 12 MONTHS AFTER ISSUE');
  document.querySelectorAll('[data-cert-field="number"]').forEach(el=>el.textContent='ISSUED AFTER MANAGER CONFIRMATION');
  document.querySelectorAll('[data-cert-field="description"]').forEach(el=>el.textContent=activeGiftMode==='signature'?'A selected travel experience. The final date is confirmed with our team.':'The recipient chooses the experience and suitable date later with our team.');
  document.querySelectorAll('.certificate-live-layer').forEach(el=>el.classList.toggle('signature',activeGiftMode==='signature'));
  const mode=document.getElementById('giftPreviewMode');if(mode)mode.textContent=activeGiftMode==='signature'?'Signature Gift':'Freedom Gift';
  const rec=document.getElementById('giftPreviewRecipient');if(rec)rec.textContent=recipient;
  const delivery=document.getElementById('giftPreviewDelivery');if(delivery)delivery.textContent=giftDateText(giftDeliveryDate?.value);
}
function selectGiftMode(mode){
  activeGiftMode=mode;
  giftModeInput.value=mode;
  giftOptions.forEach(btn=>btn.classList.toggle('selected',btn.dataset.giftMode===mode));
  giftBuilder.hidden=false;
  giftFreedomFields.hidden=mode!=='freedom';
  giftSignatureFields.hidden=mode!=='signature';
  giftAmount.required=mode==='freedom';
  giftExperience.required=mode==='signature';
  updateGiftPreview();
  giftBuilder.scrollIntoView({behavior:'smooth',block:'nearest'});
}

const giftMini=document.getElementById('giftLiveCertificateMini');
if(giftMini&&card){
  const clone=card.cloneNode(true);clone.removeAttribute('id');
  clone.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
  giftMini.appendChild(clone);
}
giftOptions.forEach(btn=>btn.addEventListener('click',()=>selectGiftMode(btn.dataset.giftMode)));
document.querySelectorAll('[data-gift-amount]').forEach(btn=>btn.addEventListener('click',()=>{
  giftAmount.value=btn.dataset.giftAmount;
  document.querySelectorAll('[data-gift-amount]').forEach(x=>x.classList.toggle('selected',x===btn));
  updateGiftPreview();
}));
giftFlexibleDate?.addEventListener('change',()=>{
  giftPreferredDate.disabled=giftFlexibleDate.checked;
  if(giftFlexibleDate.checked)giftPreferredDate.value='';
  updateGiftPreview();
});
giftForm?.querySelectorAll('input,textarea').forEach(el=>el.addEventListener('input',updateGiftPreview));
if(giftDeliveryDate)giftDeliveryDate.min=new Date().toISOString().slice(0,10);
if(giftPreferredDate)giftPreferredDate.min=new Date().toISOString().slice(0,10);

giftForm?.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!activeGiftMode){setGiftStatus('Choose Freedom Gift or Signature Gift.','error');return}
  const fd=new FormData(giftForm);
  const buyerPhone=String(fd.get('buyerPhone')||'');
  const normalized=normalizeHeartPhoneClient(buyerPhone);
  if(normalized.length<10||normalized.length>15){setGiftStatus('Enter a valid WhatsApp number including country code.','error');return}
  giftSubmit.disabled=true;
  setGiftStatus('Saving the Gift Certificate request in ATO Booking Manager…');
  try{
    const result=await heartRpc('gift_certificate_request_v2',{
      p_mode:activeGiftMode,
      p_buyer_name:String(fd.get('buyerName')||'').trim(),
      p_buyer_phone:normalized,
      p_recipient_name:String(fd.get('recipientName')||'').trim(),
      p_recipient_contact:String(fd.get('recipientContact')||'').trim(),
      p_amount_eur:activeGiftMode==='freedom'?Number(fd.get('amountEur')||0):null,
      p_experience:activeGiftMode==='signature'?String(fd.get('experience')||'').trim():'',
      p_preferred_date:activeGiftMode==='signature'&&!giftFlexibleDate.checked?(fd.get('preferredDate')||null):null,
      p_delivery_date:fd.get('deliveryDate')||null,
      p_personal_message:String(fd.get('personalMessage')||'').trim()
    });
    const certificateUrl=`${location.origin}/gift-certificate.html?token=${encodeURIComponent(result.publicToken)}`;
    setGiftStatus(`Request ${result.requestNo} is PENDING in ATO Booking Manager. The certificate activates after manager confirmation.`,'success');
    const lines=['🎁 GIFT CERTIFICATE REQUEST','',`Request: ${result.requestNo}`,'Status: PENDING — manager confirmation required',`Type: ${activeGiftMode==='freedom'?'Freedom Gift':'Signature Gift'}`,`Gift: ${result.gift}`,`Recipient: ${result.recipientName}`,`Send certificate to: ${result.recipientContact}`,`From: ${result.buyerName}`,'',`Electronic certificate: ${certificateUrl}`,'','The certificate becomes ACTIVE and receives its ATO-GIFT code only after manager confirmation.'];
    setTimeout(()=>window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`,'_blank','noopener'),250);
  }catch(err){setGiftStatus(err.message||'Could not save the Gift Certificate request.','error')}
  finally{giftSubmit.disabled=false}
});

const allowedLangs = ["ru", "en", "tr", "de", "pl"];
  const savedLang = localStorage.getItem("atoLanguage");
  const currentLang = allowedLangs.includes(savedLang) ? savedLang : "en";
  function updateLang(lang) {
    document.querySelectorAll("[data-" + lang + "]").forEach(el => {
      el.textContent = el.getAttribute("data-" + lang);
    });
    const langLabel = document.querySelector(".language-dropdown > span");
    if (langLabel) langLabel.textContent = lang.toUpperCase();
    document.documentElement.lang = lang;
    localStorage.setItem("atoLanguage", lang);
    window.dispatchEvent(new CustomEvent("ato-language-changed",{detail:{lang}}));
  }
  updateLang(currentLang);
  document.querySelectorAll(".language-menu a").forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      const lang = this.getAttribute("data-lang");
      if (allowedLangs.includes(lang)) updateLang(lang);
    });
  });

  // Header/menu behavior is owned by the canonical ATO header script in special-offers.html.

/* === AUTONOMOUS WEBGL 3D GLOBE ===
 * No Three.js CDN dependency. The sphere geometry, lighting, rotation and
 * local Earth textures are rendered directly with WebGL.
 */
const canvas = document.getElementById('liveGlobeCanvas');
const globeShell = document.getElementById('globeShell');
const globeZone3D = document.getElementById('globeZone');
const bokehWrap = document.getElementById('globeBokeh');

if (canvas && globeShell && globeZone3D) {
  function createBokehDots(count = 64){
    if(!bokehWrap) return;
    bokehWrap.innerHTML = '';

    for(let i = 0; i < count; i++){
      const dot = document.createElement('span');

      const isGold = Math.random() > 0.78;
      const isLarge = Math.random() > 0.72;
      const isSmall = !isLarge && Math.random() > 0.42;

      let size;
      if(isLarge){
        size = 22 + Math.random() * 30;
      }else if(isSmall){
        size = 4 + Math.random() * 10;
      }else{
        size = 10 + Math.random() * 16;
      }

      dot.className =
        'bokeh-dot' +
        (isGold ? ' gold' : '') +
        (isLarge ? ' large' : '') +
        (isSmall ? ' small' : '');

      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
      dot.style.left = Math.random() * 100 + '%';
      dot.style.top = 10 + Math.random() * 78 + '%';
      dot.style.animationDuration = (8 + Math.random() * 10) + 's';
      dot.style.animationDelay = (Math.random() * 7) + 's';
      dot.style.transform = `translate3d(0,0,0) scale(${0.88 + Math.random() * 0.34})`;

      bokehWrap.appendChild(dot);
    }

    // Fine stars are appended AFTER the large/soft bokeh so the background
    // keeps depth: blurred light first, then crisp distant points of light.
    const starCount = Math.round(count * 1.45);
    for(let i = 0; i < starCount; i++){
      const star = document.createElement('span');
      const isGoldStar = Math.random() > 0.80;
      const size = 1 + Math.random() * 2.7;
      star.className = 'globe-star' + (isGoldStar ? ' gold' : '');
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = 5 + Math.random() * 88 + '%';
      star.style.animationDuration = (2.8 + Math.random() * 4.8) + 's';
      star.style.animationDelay = (Math.random() * 5.5) + 's';
      bokehWrap.appendChild(star);
    }
  }
  createBokehDots(64);

  function startCpuGlobeFallback(){
    const ctx = canvas.getContext('2d', { alpha:true });
    if(!ctx){
      globeZone3D.dataset.globeMode = 'css-fallback-last-resort';
      canvas.classList.add('webgl-unavailable');
      console.warn('[ATO] Neither WebGL nor Canvas2D globe renderer is available.');
      return;
    }

    globeZone3D.dataset.globeMode = 'canvas2d-spherical-geodesic';
    canvas.classList.remove('webgl-unavailable');
    canvas.classList.add('canvas2d-spherical-fallback');
    console.info('[ATO] WebGL unavailable: using animated Canvas2D spherical globe.');

    const TAU = Math.PI * 2;
    let N = 300;
    let imageData = null;
    let pixels = null;
    let texturePixels = null;
    let nightTexturePixels = null;
    let texW = 0, texH = 0;
    let angleY = -0.45;
    let last = performance.now();
    let mouseX2 = 0, mouseY2 = 0;

    // Build a true triangular icosphere network for the non-WebGL fallback.
    function buildCpuGeodesic(subdivisions=2){
      const t=(1+Math.sqrt(5))/2;
      let verts=[
        [-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],
        [0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],
        [t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]
      ].map(v=>{const l=Math.hypot(...v);return [v[0]/l,v[1]/l,v[2]/l]});
      let faces=[
        [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
        [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
        [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
        [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]
      ];
      for(let level=0;level<subdivisions;level++){
        const cache=new Map(), next=[];
        const mid=(a,b)=>{
          const key=a<b?`${a}_${b}`:`${b}_${a}`;
          if(cache.has(key)) return cache.get(key);
          const A=verts[a],B=verts[b];
          let x=(A[0]+B[0])*.5,y=(A[1]+B[1])*.5,z=(A[2]+B[2])*.5;
          const l=Math.hypot(x,y,z)||1; const idx=verts.length;
          verts.push([x/l,y/l,z/l]); cache.set(key,idx); return idx;
        };
        for(const [a,b,c] of faces){const ab=mid(a,b),bc=mid(b,c),ca=mid(c,a);next.push([a,ab,ca],[b,bc,ab],[c,ca,bc],[ab,bc,ca]);}
        faces=next;
      }
      const set=new Set(), edges=[];
      const add=(a,b)=>{const k=a<b?`${a}_${b}`:`${b}_${a}`;if(set.has(k))return;set.add(k);edges.push([a,b]);};
      for(const [a,b,c] of faces){add(a,b);add(b,c);add(c,a);}
      return {verts,edges};
    }
    const geo=buildCpuGeodesic(2);

    function resizeCpu(){
      const r=globeShell.getBoundingClientRect();
      const dpr=Math.min(window.devicePixelRatio||1,1.5);
      N=Math.max(240,Math.min(360,Math.round(Math.min(r.width,r.height)*dpr)));
      if(canvas.width!==N || canvas.height!==N){
        canvas.width=N; canvas.height=N;
        imageData=ctx.createImageData(N,N); pixels=imageData.data;
      }
    }
    resizeCpu();
    window.addEventListener('resize',resizeCpu,{passive:true});
    if('ResizeObserver' in window) new ResizeObserver(resizeCpu).observe(globeShell);

    globeShell.addEventListener('pointermove',e=>{
      const r=globeShell.getBoundingClientRect();
      mouseX2=((e.clientX-r.left)/Math.max(1,r.width)-.5)*2;
      mouseY2=((e.clientY-r.top)/Math.max(1,r.height)-.5)*2;
    });
    globeShell.addEventListener('pointerleave',()=>{mouseX2=0;mouseY2=0;});

    const img=new Image();
    img.decoding='async';
    img.onload=()=>{
      const off=document.createElement('canvas');
      texW=768; texH=384; off.width=texW; off.height=texH;
      const o=off.getContext('2d',{willReadFrequently:true});
      o.drawImage(img,0,0,texW,texH);
      texturePixels=o.getImageData(0,0,texW,texH).data;
      globeZone3D.dataset.globeTextures='local-ready-cpu';
    };
    img.onerror=()=>{ globeZone3D.dataset.globeTextures='procedural-cpu'; };
    img.src='assets/globe/earth_day_original_v6.jpg';

    const nightImg=new Image();
    nightImg.decoding='async';
    nightImg.onload=()=>{
      const off=document.createElement('canvas');
      off.width=768; off.height=384;
      const o=off.getContext('2d',{willReadFrequently:true});
      o.drawImage(nightImg,0,0,768,384);
      nightTexturePixels=o.getImageData(0,0,768,384).data;
    };
    nightImg.src='assets/globe/earth_lights_original_v6.png';

    function rotatePoint(v, ay, ax){
      const cy=Math.cos(ay), sy=Math.sin(ay), cx=Math.cos(ax), sx=Math.sin(ax);
      let x=cy*v[0]+sy*v[2], z=-sy*v[0]+cy*v[2], y=v[1];
      const y2=cx*y-sx*z, z2=sx*y+cx*z;
      return [x,y2,z2];
    }

    function sampleTexture(ox,oy,oz){
      if(!texturePixels){
        const land=(Math.sin(Math.atan2(oz,ox)*6.5)+Math.sin(Math.asin(Math.max(-1,Math.min(1,oy)))*9.0))>0.55;
        return land?[13,14,16]:[4,7,12];
      }
      let u=0.5-Math.atan2(oz,ox)/TAU;
      u=u-Math.floor(u);
      const v=Math.max(0,Math.min(0.999999,0.5-Math.asin(Math.max(-1,Math.min(1,oy)))/Math.PI));
      const tx=Math.min(texW-1,Math.floor(u*texW)), ty=Math.min(texH-1,Math.floor(v*texH));
      const i=(ty*texW+tx)*4;
      return [texturePixels[i],texturePixels[i+1],texturePixels[i+2]];
    }

    function sampleNightTexture(ox,oy,oz){
      if(!nightTexturePixels || !texW || !texH) return [0,0,0];
      let u=0.5-Math.atan2(oz,ox)/TAU;
      u=u-Math.floor(u);
      const v=Math.max(0,Math.min(0.999999,0.5-Math.asin(Math.max(-1,Math.min(1,oy)))/Math.PI));
      const tx=Math.min(texW-1,Math.floor(u*texW)), ty=Math.min(texH-1,Math.floor(v*texH));
      const i=(ty*texW+tx)*4;
      return [nightTexturePixels[i],nightTexturePixels[i+1],nightTexturePixels[i+2]];
    }

    function renderEarth(t){
      if(!imageData || !pixels) return;
      const c=(N-1)/2, radius=N*0.455;
      const cy=Math.cos(angleY), sy=Math.sin(angleY);
      const tilt=-0.10+mouseY2*0.05, cx=Math.cos(-tilt), sx=Math.sin(-tilt);
      const lx=-0.38,ly=0.54,lz=0.75;
      pixels.fill(0);
      for(let py=0;py<N;py++){
        const ny=(c-py)/radius;
        for(let px=0;px<N;px++){
          const nx=(px-c)/radius, rr=nx*nx+ny*ny;
          if(rr>1) continue;
          const z=Math.sqrt(1-rr);
          // Inverse X tilt, then inverse Y spin -> object-space texture lookup.
          const iy=cx*ny+sx*z, iz=-sx*ny+cx*z;
          const ox=cy*nx-sy*iz, oz=sy*nx+cy*iz, oy=iy;
          const rgb=sampleTexture(ox,oy,oz);
          const nightRgb=sampleNightTexture(ox,oy,oz);
          const lightDot=nx*lx+ny*ly+z*lz;
          const diffuse=Math.max(0,lightDot);
          const shade=0.035+0.24*diffuse;
          const softLight=Math.max(0,Math.min(1,(lightDot+0.20)/0.98));
          const nightSide=Math.pow(1-softLight,1.42);
          const duskBand=1-Math.max(0,Math.min(1,(softLight-0.10)/0.52));
          const rim=Math.pow(1-z,2.4);
          const idx=(py*N+px)*4;
          const nr=Math.pow(nightRgb[0]/255,0.64)*255;
          const ng=Math.pow(nightRgb[1]/255,0.64)*255;
          const nb=Math.pow(nightRgb[2]/255,0.64)*255;
          const emissive=.34+nightSide*3.65+duskBand*.92;
          pixels[idx]=Math.min(255,rgb[0]*.075 + nr*emissive*1.46 + 3*rim);
          pixels[idx+1]=Math.min(255,rgb[1]*.075 + ng*emissive*1.20 + 6*rim);
          pixels[idx+2]=Math.min(255,rgb[2]*.080 + nb*emissive*.64 + 12*rim);
          pixels[idx+3]=255;
        }
      }
      ctx.putImageData(imageData,0,0);

      // Atmosphere and true triangular shell are drawn in projected 3D.
      ctx.save();
      ctx.translate(c,c);
      ctx.beginPath();ctx.arc(0,0,radius,0,TAU);ctx.clip();
      const shellAngle=angleY*1.24+t*0.24;
      const tilt2=-0.10+Math.sin(t*.36)*.055;
      ctx.lineWidth=Math.max(0.8,N/340);
      ctx.strokeStyle='rgba(130,145,160,.18)';
      ctx.shadowColor='rgba(80,95,115,.12)';
      ctx.shadowBlur=Math.max(1.5,N/140);
      for(const [a,b] of geo.edges){
        const A=rotatePoint(geo.verts[a],shellAngle,tilt2), B=rotatePoint(geo.verts[b],shellAngle,tilt2);
        if(A[2]<-.08 && B[2]<-.08) continue;
        const alpha=Math.max(.15,Math.min(1,(A[2]+B[2]+2)*.25));
        ctx.globalAlpha=.15+.22*alpha;
        ctx.beginPath();
        ctx.moveTo(A[0]*radius*1.012,-A[1]*radius*1.012);
        ctx.lineTo(B[0]*radius*1.012,-B[1]*radius*1.012);
        ctx.stroke();
      }
      ctx.globalAlpha=1;ctx.restore();

      const glow=ctx.createRadialGradient(c,c,radius*.80,c,c,radius*1.12);
      glow.addColorStop(0,'rgba(0,145,255,0)');
      glow.addColorStop(.72,'rgba(0,160,255,.03)');
      glow.addColorStop(.93,'rgba(49,205,255,.30)');
      glow.addColorStop(1,'rgba(49,205,255,0)');
      ctx.fillStyle=glow;ctx.beginPath();ctx.arc(c,c,radius*1.12,0,TAU);ctx.fill();
    }

    function cpuAnimate(now){
      requestAnimationFrame(cpuAnimate);
      const dt=Math.min((now-last)/1000,.05); last=now;
      const running=globeZone3D.classList.contains('journey-running');
      // Deliberately obvious rotation: ~11°/s at rest, faster during Journey.
      const speed=running?0.34:0.19;
      angleY += (speed + mouseX2*.035)*dt;
      renderEarth(now/1000);
    }
    requestAnimationFrame(cpuAnimate);
  }

  let gl = null;
  try{
    gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      powerPreference: 'high-performance'
    }) || canvas.getContext('experimental-webgl', { alpha: true, antialias: true });
  }catch(err){
    console.warn('[ATO] WebGL context creation failed; switching to Canvas2D.', err);
  }

  if (!gl) {
    startCpuGlobeFallback();
  } else {
    globeZone3D.dataset.globeMode = 'webgl-3d-geodesic';

    const vertexShaderSource = `
      attribute vec3 aPosition;
      attribute vec3 aNormal;
      attribute vec2 aUV;
      uniform mat4 uProjection;
      uniform mat4 uView;
      uniform mat4 uModel;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec2 vUV;
      void main(){
        vec4 world = uModel * vec4(aPosition, 1.0);
        vWorldPos = world.xyz;
        vNormal = normalize(mat3(uModel) * aNormal);
        vUV = aUV;
        gl_Position = uProjection * uView * world;
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform sampler2D uDayMap;
      uniform sampler2D uNightMap;
      uniform vec3 uLightDir;
      uniform vec3 uCameraPos;
      uniform float uTextureMix;
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec2 vUV;
      void main(){
        vec3 n = normalize(vNormal);

        vec3 l = normalize(uLightDir);
        vec3 v = normalize(uCameraPos - vWorldPos);

        float diffuse = max(dot(n, l), 0.0);
        float softLight = smoothstep(-0.20, 0.78, dot(n, l));
        float fresnel = pow(1.0 - max(dot(n, v), 0.0), 3.0);
        float limb = pow(1.0 - max(dot(n, v), 0.0), 1.45);

        vec3 dayTex = texture2D(uDayMap, vUV).rgb;
        vec3 nightTex = texture2D(uNightMap, vUV).rgb;
        vec2 nightTexel = vec2(1.0 / 2048.0, 1.0 / 1024.0);
        vec3 nightHalo = max(
          max(texture2D(uNightMap, vUV + vec2(nightTexel.x * 3.0, 0.0)).rgb,
              texture2D(uNightMap, vUV - vec2(nightTexel.x * 3.0, 0.0)).rgb),
          max(texture2D(uNightMap, vUV + vec2(0.0, nightTexel.y * 3.0)).rgb,
              texture2D(uNightMap, vUV - vec2(0.0, nightTexel.y * 3.0)).rgb)
        );

        vec3 proceduralOcean = vec3(0.006, 0.010, 0.018);
        vec3 proceduralLand = vec3(0.026, 0.025, 0.021);
        float landMask = smoothstep(-0.10, 0.55, sin(vUV.x * 31.0) * sin(vUV.y * 21.0));
        vec3 procedural = mix(proceduralOcean, proceduralLand, landMask * 0.35);

        // V8: darker continents and much more visible earth_lights_2048.
        /* The photographic map is intentionally very dark. The second map
           supplies the visible city lights directly over the same UVs. */
        /* Exact supplied satellite map, only darkened here. No replacement
           material and no cyan recolouring. */
        vec3 mappedDay = dayTex * vec3(0.14, 0.14, 0.14);
        vec3 surface = mix(procedural * 0.74, mappedDay, uTextureMix);
        surface *= 0.28 + diffuse * 0.30;

        /* Brighter night lights with stronger coastline/city clusters.
           Using an exponent below 1.0 lifts mid-level light values so
           earth_lights_2048 becomes visibly richer on the night side. */
        float nightSide = pow(1.0 - softLight, 1.42);
        float duskBand = 1.0 - smoothstep(0.10, 0.62, softLight);
        vec3 concentratedLights = pow(max(nightTex, vec3(0.0)), vec3(0.62));
        vec3 haloLights = pow(max(nightHalo, vec3(0.0)), vec3(0.72));
        vec3 nightGold = concentratedLights * vec3(4.40, 3.50, 1.72);
        vec3 nightBloom = haloLights * vec3(1.82, 1.32, 0.54);
        float emissiveVisibility = 0.34 + nightSide * 3.65 + duskBand * 0.92;
        vec3 cityGlow = nightGold * emissiveVisibility * uTextureMix;
        vec3 cityBlend = nightBloom * (0.32 + nightSide * 1.18 + duskBand * 0.54) * uTextureMix;

        vec3 cyanRim = vec3(0.06, 0.055, 0.045) * fresnel * 0.16;
        vec3 blueAtmosphere = vec3(0.018, 0.020, 0.024) * limb * 0.10;
        float shimmer = 0.985 + 0.015 * sin(uTime * 1.7 + vUV.y * 10.0);

        vec3 h = normalize(l + v);
        float specular = pow(max(dot(n, h), 0.0), 42.0) * 0.12;
        vec3 specularGlow = vec3(0.06, 0.14, 0.26) * specular;

        vec3 color = (surface + cityGlow + cityBlend + cyanRim + blueAtmosphere + specularGlow) * shimmer;
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const lineVertexShaderSource = `
      attribute vec3 aPosition;
      uniform mat4 uProjection;
      uniform mat4 uView;
      uniform mat4 uModel;
      void main(){
        gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
      }
    `;

    const lineFragmentShaderSource = `
      precision mediump float;
      uniform vec4 uColor;
      void main(){ gl_FragColor = uColor; }
    `;

    function compileShader(type, source){
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        const error = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error('WebGL shader compilation failed: ' + error);
      }
      return shader;
    }

    function createProgram(vsSource, fsSource){
      const program = gl.createProgram();
      gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vsSource));
      gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fsSource));
      gl.linkProgram(program);
      if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        const error = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error('WebGL program link failed: ' + error);
      }
      return program;
    }

    function createSphere(radius = 2.28, latBands = 72, lonBands = 108){
      const positions = [];
      const normals = [];
      const uvs = [];
      const indices = [];

      for(let lat = 0; lat <= latBands; lat++){
        const theta = lat * Math.PI / latBands;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);
        for(let lon = 0; lon <= lonBands; lon++){
          const phi = lon * Math.PI * 2 / lonBands;
          const sinPhi = Math.sin(phi);
          const cosPhi = Math.cos(phi);
          const x = sinTheta * cosPhi;
          const y = cosTheta;
          const z = sinTheta * sinPhi;
          positions.push(radius * x, radius * y, radius * z);
          normals.push(x, y, z);
          // North must sample the TOP of the equirectangular map. The previous
          // `1 - lat` value flipped the entire globe vertically.
          uvs.push(1 - lon / lonBands, lat / latBands);
        }
      }

      for(let lat = 0; lat < latBands; lat++){
        for(let lon = 0; lon < lonBands; lon++){
          const first = lat * (lonBands + 1) + lon;
          const second = first + lonBands + 1;
          indices.push(first, second, first + 1);
          indices.push(second, second + 1, first + 1);
        }
      }

      return {
        positions: new Float32Array(positions),
        normals: new Float32Array(normals),
        uvs: new Float32Array(uvs),
        indices: new Uint16Array(indices)
      };
    }

    function createGeodesicWireframe(radius = 2.445, subdivisions = 3){
      // True triangular geodesic shell. This recreates the intended
      // blue faceted network instead of a latitude/longitude grid.
      const t = (1 + Math.sqrt(5)) / 2;
      let vertices = [
        [-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],
        [0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],
        [t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]
      ].map(v => {
        const l = Math.hypot(v[0],v[1],v[2]);
        return [v[0]/l, v[1]/l, v[2]/l];
      });
      let faces = [
        [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
        [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
        [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
        [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]
      ];

      for(let level=0; level<subdivisions; level++){
        const cache = new Map();
        const midpoint = (a,b) => {
          const key = a < b ? `${a}_${b}` : `${b}_${a}`;
          if(cache.has(key)) return cache.get(key);
          const va = vertices[a], vb = vertices[b];
          let x=(va[0]+vb[0])*0.5, y=(va[1]+vb[1])*0.5, z=(va[2]+vb[2])*0.5;
          const l=Math.hypot(x,y,z) || 1;
          const idx=vertices.length;
          vertices.push([x/l,y/l,z/l]);
          cache.set(key,idx);
          return idx;
        };
        const next=[];
        for(const [a,b,c] of faces){
          const ab=midpoint(a,b), bc=midpoint(b,c), ca=midpoint(c,a);
          next.push([a,ab,ca],[b,bc,ab],[c,ca,bc],[ab,bc,ca]);
        }
        faces=next;
      }

      const edgeSet = new Set();
      const lines=[];
      const addEdge=(a,b)=>{
        const key=a<b?`${a}_${b}`:`${b}_${a}`;
        if(edgeSet.has(key)) return;
        edgeSet.add(key);
        const va=vertices[a], vb=vertices[b];
        lines.push(
          va[0]*radius,va[1]*radius,va[2]*radius,
          vb[0]*radius,vb[1]*radius,vb[2]*radius
        );
      };
      for(const [a,b,c] of faces){ addEdge(a,b); addEdge(b,c); addEdge(c,a); }
      return new Float32Array(lines);
    }

    function createBuffer(target, data, usage = gl.STATIC_DRAW){
      const buffer = gl.createBuffer();
      gl.bindBuffer(target, buffer);
      gl.bufferData(target, data, usage);
      return buffer;
    }

    function createSolidTexture(r, g, b, a = 255){
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([r,g,b,a]));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return texture;
    }

    function isPowerOf2(value){ return (value & (value - 1)) === 0; }

    function loadImageIntoTexture(url, texture){
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.decoding = 'async';
        image.onload = () => {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          if(isPowerOf2(image.width) && isPowerOf2(image.height)){
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          }
          resolve(image);
        };
        image.onerror = () => reject(new Error('Could not load globe texture: ' + url));
        image.src = url;
      });
    }

    function mat4Identity(){
      return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
    }

    function mat4Multiply(a, b){
      const out = new Float32Array(16);
      for(let col=0; col<4; col++){
        for(let row=0; row<4; row++){
          let sum = 0;
          for(let k=0; k<4; k++) sum += a[k*4 + row] * b[col*4 + k];
          out[col*4 + row] = sum;
        }
      }
      return out;
    }

    function mat4Perspective(fovy, aspect, near, far){
      const f = 1 / Math.tan(fovy / 2);
      const nf = 1 / (near - far);
      const out = new Float32Array(16);
      out[0] = f / aspect;
      out[5] = f;
      out[10] = (far + near) * nf;
      out[11] = -1;
      out[14] = 2 * far * near * nf;
      return out;
    }

    function mat4Translation(x,y,z){
      const out = mat4Identity();
      out[12] = x; out[13] = y; out[14] = z;
      return out;
    }

    function mat4RotationX(a){
      const c = Math.cos(a), s = Math.sin(a);
      return new Float32Array([1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]);
    }

    function mat4RotationY(a){
      const c = Math.cos(a), s = Math.sin(a);
      return new Float32Array([c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]);
    }

    function mat4RotationZ(a){
      const c = Math.cos(a), s = Math.sin(a);
      return new Float32Array([c,s,0,0, -s,c,0,0, 0,0,1,0, 0,0,0,1]);
    }

    function modelMatrix(rx, ry, rz){
      return mat4Multiply(mat4RotationZ(rz), mat4Multiply(mat4RotationX(rx), mat4RotationY(ry)));
    }

    const sphereProgram = createProgram(vertexShaderSource, fragmentShaderSource);
    const lineProgram = createProgram(lineVertexShaderSource, lineFragmentShaderSource);
    const sphere = createSphere();
    const network = createGeodesicWireframe();

    const spherePositionBuffer = createBuffer(gl.ARRAY_BUFFER, sphere.positions);
    const sphereNormalBuffer = createBuffer(gl.ARRAY_BUFFER, sphere.normals);
    const sphereUVBuffer = createBuffer(gl.ARRAY_BUFFER, sphere.uvs);
    const sphereIndexBuffer = createBuffer(gl.ELEMENT_ARRAY_BUFFER, sphere.indices);
    const networkBuffer = createBuffer(gl.ARRAY_BUFFER, network);

    const sphereLoc = {
      position: gl.getAttribLocation(sphereProgram, 'aPosition'),
      normal: gl.getAttribLocation(sphereProgram, 'aNormal'),
      uv: gl.getAttribLocation(sphereProgram, 'aUV'),
      projection: gl.getUniformLocation(sphereProgram, 'uProjection'),
      view: gl.getUniformLocation(sphereProgram, 'uView'),
      model: gl.getUniformLocation(sphereProgram, 'uModel'),
      dayMap: gl.getUniformLocation(sphereProgram, 'uDayMap'),
      nightMap: gl.getUniformLocation(sphereProgram, 'uNightMap'),
      lightDir: gl.getUniformLocation(sphereProgram, 'uLightDir'),
      cameraPos: gl.getUniformLocation(sphereProgram, 'uCameraPos'),
      textureMix: gl.getUniformLocation(sphereProgram, 'uTextureMix'),
      time: gl.getUniformLocation(sphereProgram, 'uTime')
    };

    const lineLoc = {
      position: gl.getAttribLocation(lineProgram, 'aPosition'),
      projection: gl.getUniformLocation(lineProgram, 'uProjection'),
      view: gl.getUniformLocation(lineProgram, 'uView'),
      model: gl.getUniformLocation(lineProgram, 'uModel'),
      color: gl.getUniformLocation(lineProgram, 'uColor')
    };

    const dayTexture = createSolidTexture(4, 7, 12, 255);
    const nightTexture = createSolidTexture(0, 8, 20, 255);
    let textureMix = 0;

    Promise.all([
      loadImageIntoTexture('assets/globe/earth_day_original_v6.jpg', dayTexture),
      loadImageIntoTexture('assets/globe/earth_lights_original_v6.png', nightTexture)
    ]).then(() => {
      textureMix = 1;
      globeZone3D.dataset.globeTextures = 'local-ready';
    }).catch((err) => {
      // The sphere remains genuinely 3D even if a local texture file is missing.
      // Only the photographic Earth skin is replaced by the procedural material.
      globeZone3D.dataset.globeTextures = 'procedural-fallback';
      console.warn('[ATO] Local globe texture load failed; using procedural 3D material.', err);
    });

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.clearColor(0,0,0,0);

    let projection = mat4Perspective(40 * Math.PI / 180, 1, 0.1, 100);
    const view = mat4Translation(0, 0, -7.9);
    let mouseX = 0;
    let mouseY = 0;
    let rotationY = -0.35;
    let lastTime = performance.now();
    const startTime = lastTime;

    globeShell.addEventListener('pointermove', (e) => {
      const rect = globeShell.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
    });

    globeShell.addEventListener('pointerleave', () => {
      mouseX = 0;
      mouseY = 0;
    });

    function resize(){
      const rect = globeShell.getBoundingClientRect();
      const cssW = Math.max(320, Math.round(rect.width));
      const cssH = Math.max(320, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(cssW * dpr);
      const h = Math.round(cssH * dpr);
      if(canvas.width !== w || canvas.height !== h){
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      projection = mat4Perspective(40 * Math.PI / 180, cssW / cssH, 0.1, 100);
    }
    window.addEventListener('resize', resize, {passive:true});
    if('ResizeObserver' in window){
      new ResizeObserver(resize).observe(globeShell);
    }
    resize();

    function bindAttribute(buffer, location, size){
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
    }

    function drawSphere(model, t){
      gl.useProgram(sphereProgram);
      bindAttribute(spherePositionBuffer, sphereLoc.position, 3);
      bindAttribute(sphereNormalBuffer, sphereLoc.normal, 3);
      bindAttribute(sphereUVBuffer, sphereLoc.uv, 2);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBuffer);

      gl.uniformMatrix4fv(sphereLoc.projection, false, projection);
      gl.uniformMatrix4fv(sphereLoc.view, false, view);
      gl.uniformMatrix4fv(sphereLoc.model, false, model);
      gl.uniform3f(sphereLoc.lightDir, -0.42, 0.58, 0.72);
      gl.uniform3f(sphereLoc.cameraPos, 0, 0, 7.9);
      gl.uniform1f(sphereLoc.textureMix, textureMix);
      gl.uniform1f(sphereLoc.time, t);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, dayTexture);
      gl.uniform1i(sphereLoc.dayMap, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, nightTexture);
      gl.uniform1i(sphereLoc.nightMap, 1);

      gl.disable(gl.BLEND);
      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(true);
      gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0);
    }

    function drawNetwork(model, opacity){
      gl.useProgram(lineProgram);
      bindAttribute(networkBuffer, lineLoc.position, 3);
      gl.uniformMatrix4fv(lineLoc.projection, false, projection);
      gl.uniformMatrix4fv(lineLoc.view, false, view);
      gl.uniformMatrix4fv(lineLoc.model, false, model);
      gl.uniform4f(lineLoc.color, 0.54, 0.47, 0.32, opacity * 0.58);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(false);
      gl.drawArrays(gl.LINES, 0, network.length / 3);
      gl.depthMask(true);
      gl.disable(gl.BLEND);
    }

    function animate(now){
      requestAnimationFrame(animate);
      const dt = Math.min((now - lastTime) / 16.6667, 3);
      lastTime = now;
      const t = (now - startTime) / 1000;

      const running = globeZone3D.classList.contains('journey-running');
      const arrived = globeZone3D.classList.contains('journey-arrived');
      const pulsing = globeZone3D.classList.contains('journey-pulse');
      const heart = globeZone3D.classList.contains('journey-heart');
      const exploding = globeZone3D.classList.contains('journey-explode');
      const launched = globeZone3D.classList.contains('journey-card-launch') || globeZone3D.classList.contains('card-landed');

      // Rotation is deliberately visible at rest. The old value was so subtle
      // that the photographic texture looked static on desktop.
      let spin = 0.0048;
      if (running) spin = 0.0105;
      if (arrived) spin = 0.0065;
      if (heart || pulsing) spin = 0.0055;
      if (exploding || launched) spin = 0.0024;

      rotationY += (spin + mouseX * 0.0009) * dt;
      const rx = -0.11 + Math.sin(t * 0.35) * 0.035 + mouseY * 0.07;
      const rz = 0.055 + Math.sin(t * 0.18) * 0.025;
      const model = modelMatrix(rx, rotationY, rz);
      // Network shell is a separate sphere and drifts faster than the Earth,
      // which makes the geometry unmistakably three-dimensional.
      const networkModel = modelMatrix(rx * 0.92, rotationY * 1.28 + t * 0.045, rz + Math.sin(t * 0.30) * 0.055);
      const networkOpacity = launched
        ? 0.040
        : (pulsing ? 0.155 : 0.082 + Math.sin(t * 1.7) * 0.010);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      drawSphere(model, t);
      drawNetwork(networkModel, networkOpacity);
    }

    requestAnimationFrame(animate);
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  const editChoicesBtn=document.getElementById('editChoicesBtn');
  if(editChoicesBtn){
    editChoicesBtn.addEventListener('click',(e)=>{
      e.preventDefault();
      e.stopPropagation();
      document.getElementById('experience-planner')?.scrollIntoView({behavior:'smooth',block:'start'});
    });
  }

  const requestBtn=document.getElementById('requestPersonalOffer');
  if(requestBtn){
    requestBtn.addEventListener('click',(e)=>{
      e.stopPropagation();
    });
  }
});

document.addEventListener('DOMContentLoaded',()=>{
  const journeyDockCard=document.getElementById('journeyDockCard');
  if(journeyDockCard){
    journeyDockCard.addEventListener('click',(e)=>{
      if(e.target.closest('button')) return;
      const href=journeyDockCard.getAttribute('href');
      if(href && href !== '#'){
        e.preventDefault();
        window.location.href=href;
      }
    });
  }
});
