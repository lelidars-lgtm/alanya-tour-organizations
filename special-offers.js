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
  setTimeout(()=>beginHeartOfferJourney(),620);
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

function animateTourCardContinuously(duration=1550){
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

    /* 11 Heart grows to globe scale. */
    queueJourney(()=>{
      globeZone.classList.add('heart-full');
      status.innerHTML='<strong>FOLLOW YOUR HEART.</strong><span>ONE HEART · ONE JOURNEY</span>';
    },13350);

    /* 12 Random tour card is born. */
    queueJourney(()=>{
      globeZone.classList.add('journey-explode');
      status.innerHTML='<strong>THE HEART CELEBRATES.</strong><span>ONE MOMENT BEFORE YOUR TOUR APPEARS</span>';
    },14600);

    queueJourney(()=>{
      setCardFlightGeometry();
      globeZone.classList.add('journey-card-launch');
      animateTourCardContinuously(1550);
      status.innerHTML='<strong>YOUR TOUR APPEARS.</strong><span>STRAIGHT FROM THE HEART</span>';
    },16050);

    /* 12B Once the card has clearly left the heart, let the heart breathe down
       in several diminishing pulses until only a luminous red core remains. */
    queueJourney(()=>{
      globeZone.classList.add('heart-after-card');
      status.innerHTML='<strong>THE HEART LETS IT FLY.</strong><span>ONE LAST BEAT · THEN HOME</span>';
    },16650);

    queueJourney(()=>{
      cancelTourCardFlight();
      landOfferCard();
    },17650);

    /* 13 Heart returns to original Alanya point and disappears. */
    queueJourney(()=>{
      dockCard?.classList.add('final-visible');
      globeZone.classList.add('heart-return');
      status.innerHTML='<strong>THE HEART COMES HOME.</strong><span>BACK TO ALANYA</span>';
    },19000);

    /* 14–15 Final state: glowing Türkiye + flag + WE ARE HERE + coordinates. */
    queueJourney(()=>{
      globeZone.classList.add('final-turkiye');
      status.innerHTML='<strong>WE ARE HERE.</strong><span>ALANYA · 36.532392° N · 32.038899° E</span>';
      startJourney.disabled=false;
      startJourney.classList.remove('is-active');
      if(startJourney.querySelector('span')) startJourney.querySelector('span').textContent='PLAY AGAIN →';
      
    },20250);
  });
}

// HEART OFFER ENTRY: the existing animation is launched only after server-side eligibility check.
/* LIVE IDLE STATE INIT */
resetJourneyVisual();
startJourney.addEventListener('click',()=>beginHeartOfferJourney());

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
chooseAnotherHeartTour?.addEventListener('click',async e=>{
  e.preventDefault();e.stopPropagation();
  if(heartOfferRedeemed){heartVisualOnly=true;runJourney(false);return}
  try{
    if(!heartClientPhone){await beginHeartOfferJourney();return}
    if(await verifyHeartEligibility(heartClientPhone)){runJourney(false)}
  }catch(err){setHeartStatus(heartEligibilityStatus,err.message,'error');openHeartModal(heartEligibilityModal)}
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

// Gift builder/live preview removed from page by design.

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
  }
  updateLang(currentLang);
  document.querySelectorAll(".language-menu a").forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      const lang = this.getAttribute("data-lang");
      if (allowedLangs.includes(lang)) updateLang(lang);
    });
  });
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const nav = document.querySelector('.nav');
  const overlay = document.getElementById('mobileOverlay');
  const aboutDropdown = document.querySelector('.nav-dropdown');
  const languageDropdown = document.querySelector('.language-dropdown');
  const languageClose = document.querySelector('.language-close');
  function toggleMenu() {
    nav.classList.toggle('active');
    mobileBtn.classList.toggle('active');
    overlay.classList.toggle('active');
  }
  if (mobileBtn && nav && overlay) {
    mobileBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
  }
  if (aboutDropdown) {
    aboutDropdown.addEventListener('click', function(e) {
      if (window.innerWidth <= 980) {
        e.stopPropagation();
        this.classList.toggle('open');
      }
    });
  }
  if (languageDropdown) {
    languageDropdown.addEventListener('click', function(e) {
      if (window.innerWidth <= 980) {
        e.stopPropagation();
        this.classList.toggle('open');
      }
    });
  }
  if (languageClose && languageDropdown) {
    languageClose.addEventListener('click', function(e) {
      e.stopPropagation();
      languageDropdown.classList.remove('open');
    });
  }


  

/* ===== ATO SELF-CONTAINED WEBGL 3D GLOBE =====
   No CDN / Three.js dependency. The sphere, map texture, grid and route are
   rendered locally so the Journey globe cannot disappear when a third-party
   module fails to load. */
(function initAtoWebGLGlobe(){
  const canvas=document.getElementById('liveGlobeCanvas');
  const globeShell=document.getElementById('globeShell');
  const globeZone=document.getElementById('globeZone');
  const bokehWrap=document.getElementById('globeBokeh');
  if(!canvas||!globeShell||!globeZone) return;

  /* Replace the old large blurred bokeh with a sparse star field. */
  if(bokehWrap){
    bokehWrap.innerHTML='';
    for(let i=0;i<54;i++){
      const dot=document.createElement('span');
      dot.className='ato-space-star'+(i%13===0?' warm':'');
      const s=1+Math.random()*2.8;
      dot.style.width=s+'px';dot.style.height=s+'px';
      dot.style.left=(4+Math.random()*92)+'%';dot.style.top=(5+Math.random()*90)+'%';
      dot.style.opacity=(.24+Math.random()*.58).toFixed(2);
      dot.style.animationDelay=(Math.random()*4).toFixed(2)+'s';
      bokehWrap.appendChild(dot);
    }
  }

  const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false})||canvas.getContext('experimental-webgl');
  if(!gl){
    /* Safety fallback only: browsers without WebGL still see a rotating spherical globe. */
    canvas.classList.add('ato-webgl-unavailable');
    const ctx=canvas.getContext('2d');
    if(!ctx){console.error('[ATO] Neither WebGL nor Canvas2D is available.');return;}
    const land=[
      [[-168,72],[-145,70],[-128,58],[-118,49],[-102,50],[-91,55],[-78,49],[-66,44],[-79,31],[-96,21],[-111,27],[-126,32],[-145,55]],
      [[-82,13],[-70,10],[-58,4],[-48,-10],[-51,-24],[-61,-39],[-70,-55],[-76,-36],[-80,-15]],
      [[-58,82],[-29,79],[-19,66],[-43,59],[-61,70]],
      [[-11,71],[15,70],[31,60],[40,50],[31,40],[16,35],[1,42],[-10,55]],
      [[-17,37],[8,36],[34,30],[45,10],[39,-14],[25,-35],[10,-35],[-5,-20],[-15,5]],
      [[29,70],[65,75],[103,70],[139,59],[158,44],[147,31],[125,24],[106,10],[82,18],[62,35],[42,44]],
      [[111,-10],[145,-12],[155,-27],[145,-40],[121,-38],[110,-25]]
    ];
    let ang=-65*Math.PI/180,last2=performance.now();
    function proj(lonD,latD,r,cx,cy,rr){
      const lon=lonD*Math.PI/180,lat=latD*Math.PI/180,cl=Math.cos(lat);
      let x=cl*Math.cos(lon),y=Math.sin(lat),z=cl*Math.sin(lon);
      const ca=Math.cos(ang),sa=Math.sin(ang);const x1=ca*x+sa*z,z1=-sa*x+ca*z;
      const tilt=8*Math.PI/180,ct=Math.cos(tilt),st=Math.sin(tilt);const y1=ct*y-st*z1,z2=st*y+ct*z1;
      return {x:cx+x1*rr*r,y:cy-y1*rr*r,z:z2};
    }
    function lineGeo(points,color,width,cx,cy,rr){
      ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();let pen=false;
      for(let i=0;i<points.length;i++){const p=proj(points[i][0],points[i][1],1,cx,cy,rr);if(p.z<=0){pen=false;continue}if(!pen){ctx.moveTo(p.x,p.y);pen=true}else ctx.lineTo(p.x,p.y)}ctx.stroke();
    }
    function fallbackFrame(now){
      requestAnimationFrame(fallbackFrame);const rect=globeShell.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);const size=Math.max(360,Math.round(rect.width*dpr));if(canvas.width!==size||canvas.height!==size){canvas.width=size;canvas.height=size}
      const dt=Math.min(.05,(now-last2)/1000);last2=now;ang+=dt*(globeZone.classList.contains('journey-running')?.55:.16);
      ctx.clearRect(0,0,size,size);const cx=size/2,cy=size/2,rr=size*.355;
      const g=ctx.createRadialGradient(cx-rr*.28,cy-rr*.35,rr*.08,cx,cy,rr*1.25);g.addColorStop(0,'#184b83');g.addColorStop(.55,'#061d40');g.addColorStop(1,'rgba(1,7,19,.15)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);ctx.fill();
      ctx.save();ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);ctx.clip();
      for(let lat=-75;lat<=75;lat+=15){const pts=[];for(let lon=-180;lon<=180;lon+=3)pts.push([lon,lat]);lineGeo(pts,'rgba(77,201,255,.30)',Math.max(1,dpr*.7),cx,cy,rr)}
      for(let lon=-180;lon<180;lon+=15){const pts=[];for(let lat=-88;lat<=88;lat+=3)pts.push([lon,lat]);lineGeo(pts,'rgba(77,201,255,.30)',Math.max(1,dpr*.7),cx,cy,rr)}
      land.forEach(poly=>lineGeo([...poly,poly[0]],'rgba(105,219,255,.88)',Math.max(1.3,dpr*1.15),cx,cy,rr));
      const route=[];for(let i=0;i<100;i++){const t=i/99;route.push([-112+(144.0389)*t,35+(1.5324)*t+28*Math.sin(Math.PI*t)])}lineGeo(route,'rgba(244,194,83,.96)',Math.max(1.6,dpr*1.45),cx,cy,rr);
      ctx.restore();ctx.strokeStyle='rgba(93,211,255,.65)';ctx.lineWidth=Math.max(1.2,dpr);ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);ctx.stroke();
      ctx.shadowBlur=35*dpr;ctx.shadowColor='rgba(40,151,255,.65)';ctx.strokeStyle='rgba(79,194,255,.18)';ctx.lineWidth=5*dpr;ctx.beginPath();ctx.arc(cx,cy,rr*1.015,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;
    }
    requestAnimationFrame(fallbackFrame);
    console.warn('[ATO] WebGL unavailable; Canvas2D spherical fallback is active.');
    return;
  }

  const VERT=`
    attribute vec3 aPos;
    attribute vec3 aNormal;
    attribute vec2 aUV;
    uniform mat4 uMVP;
    uniform mat4 uModel;
    varying vec3 vNormal;
    varying vec2 vUV;
    varying vec3 vWorld;
    void main(){
      vec4 world=uModel*vec4(aPos,1.0);
      vWorld=world.xyz;
      vNormal=normalize(mat3(uModel)*aNormal);
      vUV=aUV;
      gl_Position=uMVP*vec4(aPos,1.0);
    }`;
  const FRAG=`
    precision mediump float;
    varying vec3 vNormal;
    varying vec2 vUV;
    varying vec3 vWorld;
    uniform sampler2D uTex;
    void main(){
      vec3 n=normalize(vNormal);
      vec3 lightDir=normalize(vec3(-0.45,0.70,0.95));
      float light=max(dot(n,lightDir),0.0);
      float rim=pow(1.0-max(n.z,0.0),2.25);
      vec3 tex=texture2D(uTex,vUV).rgb;
      vec3 col=tex*(0.42+0.68*light);
      col=mix(col, vec3(0.04,0.15,0.29), 0.18);
      col+=vec3(0.10,0.42,0.78)*rim*0.92;
      col+=vec3(0.01,0.05,0.11)*(1.0-light)*0.45;
      gl_FragColor=vec4(col,0.985);
    }`;
  const LINE_VERT=`
    attribute vec3 aPos;
    uniform mat4 uMVP;
    void main(){gl_Position=uMVP*vec4(aPos,1.0);}`;
  const LINE_FRAG=`
    precision mediump float;
    uniform vec4 uColor;
    void main(){gl_FragColor=uColor;}`;

  function shader(type,src){
    const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)||'Shader compilation failed');
    return s;
  }
  function program(vs,fs){
    const p=gl.createProgram();gl.attachShader(p,shader(gl.VERTEX_SHADER,vs));gl.attachShader(p,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);
    if(!gl.getProgramParameter(p,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)||'Program link failed');
    return p;
  }
  const sphereProgram=program(VERT,FRAG);
  const lineProgram=program(LINE_VERT,LINE_FRAG);

  function makeSphere(latSeg=72,lonSeg=144){
    const pos=[],norm=[],uv=[],idx=[];
    for(let y=0;y<=latSeg;y++){
      const v=y/latSeg,lat=(.5-v)*Math.PI;
      const cl=Math.cos(lat),sl=Math.sin(lat);
      for(let x=0;x<=lonSeg;x++){
        const u=x/lonSeg,lon=(u*2-1)*Math.PI;
        const px=cl*Math.cos(lon),py=sl,pz=cl*Math.sin(lon);
        pos.push(px,py,pz);norm.push(px,py,pz);uv.push(u,1-v);
      }
    }
    for(let y=0;y<latSeg;y++)for(let x=0;x<lonSeg;x++){
      const a=y*(lonSeg+1)+x,b=a+lonSeg+1;
      idx.push(a,b,a+1,b,b+1,a+1);
    }
    return {pos:new Float32Array(pos),norm:new Float32Array(norm),uv:new Float32Array(uv),idx:new Uint16Array(idx)};
  }
  function buffer(data,target=gl.ARRAY_BUFFER){const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b}
  const sphere=makeSphere();
  const spherePos=buffer(sphere.pos),sphereNorm=buffer(sphere.norm),sphereUV=buffer(sphere.uv),sphereIdx=buffer(sphere.idx,gl.ELEMENT_ARRAY_BUFFER);

  function sphericalPoint(lonDeg,latDeg,r=1.018){
    const lon=lonDeg*Math.PI/180,lat=latDeg*Math.PI/180,cl=Math.cos(lat);
    return [r*cl*Math.cos(lon),r*Math.sin(lat),r*cl*Math.sin(lon)];
  }
  const grid=[];
  for(let lat=-75;lat<=75;lat+=15){
    for(let lon=-180;lon<180;lon+=3){grid.push(...sphericalPoint(lon,lat),...sphericalPoint(lon+3,lat))}
  }
  for(let lon=-180;lon<180;lon+=15){
    for(let lat=-87;lat<87;lat+=3){grid.push(...sphericalPoint(lon,lat),...sphericalPoint(lon,lat+3))}
  }
  const gridBuf=buffer(new Float32Array(grid));

  /* Golden great-circle-like Journey line ending at Alanya. */
  const route=[];
  const lon0=-112,lon1=32.0389,lat0=35,lat1=36.5324;
  for(let i=0;i<100;i++){
    const t=i/99;
    const lon=lon0+(lon1-lon0)*t;
    const lat=lat0+(lat1-lat0)*t+28*Math.sin(Math.PI*t);
    route.push(...sphericalPoint(lon,lat,1.034));
  }
  const routeBuf=buffer(new Float32Array(route));

  /* Local equirectangular texture: dark oceans + stylised world continents. */
  function makeEarthTexture(){
    const c=document.createElement('canvas');c.width=1024;c.height=512;const ctx=c.getContext('2d');
    const g=ctx.createLinearGradient(0,0,0,c.height);g.addColorStop(0,'#102d55');g.addColorStop(.52,'#061a38');g.addColorStop(1,'#031025');ctx.fillStyle=g;ctx.fillRect(0,0,c.width,c.height);
    ctx.strokeStyle='rgba(70,171,235,.08)';ctx.lineWidth=1;
    for(let y=32;y<c.height;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(c.width,y);ctx.stroke()}
    const continents=[
      [[-168,72],[-145,70],[-128,58],[-118,49],[-102,50],[-91,55],[-78,49],[-66,44],[-79,31],[-96,21],[-111,27],[-126,32],[-145,55]],
      [[-82,13],[-70,10],[-58,4],[-48,-10],[-51,-24],[-61,-39],[-70,-55],[-76,-36],[-80,-15]],
      [[-58,82],[-29,79],[-19,66],[-43,59],[-61,70]],
      [[-11,71],[15,70],[31,60],[40,50],[31,40],[16,35],[1,42],[-10,55]],
      [[-17,37],[8,36],[34,30],[45,10],[39,-14],[25,-35],[10,-35],[-5,-20],[-15,5]],
      [[29,70],[65,75],[103,70],[139,59],[158,44],[147,31],[125,24],[106,10],[82,18],[62,35],[42,44]],
      [[66,25],[84,28],[94,20],[87,8],[76,7],[68,17]],
      [[111,-10],[145,-12],[155,-27],[145,-40],[121,-38],[110,-25]],
      [[130,34],[142,42],[146,35],[139,30]],
      [[95,5],[118,4],[135,-5],[121,-12],[104,-7]]
    ];
    const xy=(lon,lat)=>[(lon+180)/360*c.width,(90-lat)/180*c.height];
    ctx.lineJoin='round';ctx.lineCap='round';
    continents.forEach(poly=>{
      ctx.beginPath();
      poly.forEach((pt,i)=>{const [x,y]=xy(pt[0],pt[1]);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});
      ctx.closePath();
      const cg=ctx.createLinearGradient(0,0,c.width,c.height);
      cg.addColorStop(0,'rgba(20,53,86,.78)');
      cg.addColorStop(.52,'rgba(12,38,68,.82)');
      cg.addColorStop(1,'rgba(8,24,47,.88)');
      ctx.fillStyle=cg;
      ctx.shadowColor='rgba(73,181,255,.16)';
      ctx.shadowBlur=8;
      ctx.fill();
      ctx.shadowBlur=0;
      ctx.strokeStyle='rgba(118,220,255,.24)';
      ctx.lineWidth=0.9;
      ctx.stroke();
    });
    /* Very subtle tech network only, to avoid visual trash. */
    ctx.strokeStyle='rgba(82,193,255,.08)';ctx.lineWidth=.55;
    for(let i=0;i<18;i++){
      const a=xy(-150+Math.random()*290,50-Math.random()*85),b=xy(-150+Math.random()*290,50-Math.random()*85);
      ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
    }
    return c;
  }
  const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,makeEarthTexture());
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);

  function perspective(fovy,aspect,near,far){
    const f=1/Math.tan(fovy/2),nf=1/(near-far);
    return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);
  }
  function identity(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}
  function multiply(a,b){
    const o=new Float32Array(16);
    for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[0*4+r]*b[c*4+0]+a[1*4+r]*b[c*4+1]+a[2*4+r]*b[c*4+2]+a[3*4+r]*b[c*4+3];
    return o;
  }
  function rotateX(a){const c=Math.cos(a),s=Math.sin(a);return new Float32Array([1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1])}
  function rotateY(a){const c=Math.cos(a),s=Math.sin(a);return new Float32Array([c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1])}
  function translate(z){const m=identity();m[14]=z;return m}

  let rotY=-65*Math.PI/180,rotX=8*Math.PI/180,targetX=0,targetY=0,last=performance.now();
  globeShell.addEventListener('pointermove',e=>{const r=globeShell.getBoundingClientRect();targetY=((e.clientX-r.left)/r.width-.5)*.18;targetX=((e.clientY-r.top)/r.height-.5)*.11});
  globeShell.addEventListener('pointerleave',()=>{targetX=0;targetY=0});

  function bindAttr(program,name,buf,size){const loc=gl.getAttribLocation(program,name);if(loc<0)return;gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,0,0)}
  function resize(){
    const r=globeShell.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2),w=Math.max(360,Math.round(r.width*dpr)),h=Math.max(360,Math.round(r.width*dpr));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}canvas.style.width='100%';canvas.style.height='100%';gl.viewport(0,0,w,h);
  }
  window.addEventListener('resize',resize,{passive:true});resize();

  function drawLines(buf,count,mvp,color,mode=gl.LINES){
    gl.useProgram(lineProgram);bindAttr(lineProgram,'aPos',buf,3);gl.uniformMatrix4fv(gl.getUniformLocation(lineProgram,'uMVP'),false,mvp);gl.uniform4fv(gl.getUniformLocation(lineProgram,'uColor'),color);gl.drawArrays(mode,0,count);
  }
  function render(now){
    requestAnimationFrame(render);resize();
    const dt=Math.min(.05,(now-last)/1000);last=now;
    const running=globeZone.classList.contains('journey-running');
    const routeActive=running||globeZone.classList.contains('orbit-flight')||globeZone.classList.contains('journey-arrived')||globeZone.classList.contains('turkiye-focus')||globeZone.classList.contains('alanya-landed');
    const hidden=globeZone.classList.contains('light-collapse')||globeZone.classList.contains('journey-heart')||globeZone.classList.contains('journey-explode')||globeZone.classList.contains('final-turkiye');
    rotY+=dt*(running?.55:.16);rotX+=(targetX-rotX+8*Math.PI/180)*dt*.9;const y=rotY+targetY;
    const model=multiply(rotateX(rotX),rotateY(y));
    const view=multiply(translate(-3.45),model);
    const proj=perspective(34*Math.PI/180,canvas.width/canvas.height,.1,100);
    const mvp=multiply(proj,view);

    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);if(hidden)return;
    gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.BLEND);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);
    gl.useProgram(sphereProgram);bindAttr(sphereProgram,'aPos',spherePos,3);bindAttr(sphereProgram,'aNormal',sphereNorm,3);bindAttr(sphereProgram,'aUV',sphereUV,2);
    gl.uniformMatrix4fv(gl.getUniformLocation(sphereProgram,'uMVP'),false,mvp);gl.uniformMatrix4fv(gl.getUniformLocation(sphereProgram,'uModel'),false,model);
    gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);gl.uniform1i(gl.getUniformLocation(sphereProgram,'uTex'),0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,sphereIdx);gl.drawElements(gl.TRIANGLES,sphere.idx.length,gl.UNSIGNED_SHORT,0);

    gl.disable(gl.CULL_FACE);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);
    drawLines(gridBuf,grid.length/3,mvp,new Float32Array([.30,.78,1.0,.24]));
    if(routeActive){drawLines(routeBuf,route.length/3,mvp,new Float32Array([.96,.77,.34,.78]),gl.LINE_STRIP);}
    gl.disable(gl.BLEND);
  }
  requestAnimationFrame(render);
})();

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
