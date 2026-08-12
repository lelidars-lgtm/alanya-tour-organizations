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

const RANDOM_TOURS=[
  {title:'Aspendos, Side & Manavgat Waterfall',meta:'History & Culture · Full Day',image:'images/history-culture/history-culture-hero.png',url:'manavgat-aspendos-side.html',tags:['Cultural','Family','Team','Large Group','Education'],groupFriendly:true},
  {title:'Land of Legends — Day Tour',meta:'Family Experience · Belek',image:'images/family-experiences/hero.png',url:'land-of-legends.html',tags:['Fun','Family','Friends','Birthday','Celebration'],groupFriendly:true},
  {title:'Alanya Paragliding',meta:'Air Experience · Alanya',image:'images/air-experiences/air-category-hero.png',url:'paragliding.html',tags:['Adventurous','Couple','Friends','Birthday'],groupFriendly:false},
  {title:'Family Jeep Safari',meta:'Nature & Adventure · Alanya',image:'images/nature-adventure/canyon-adventures.png',url:'family-jeep-safari.html',tags:['Adventurous','Fun','Family','Friends','Team'],groupFriendly:true},
  {title:'Private Yacht Charter',meta:'VIP Service · Private Experience',image:'images/vip-services/HERO.png',url:'private-yacht-charter.html',tags:['Romantic','Exclusive','Couple','Family','Friends','Wedding','Anniversary','Birthday'],groupFriendly:true},
  {title:'Turkish Hammam & Spa',meta:'Wellness & Relax · Alanya',image:'images/wellness-relax/hero.jpeg',url:'turkish-hammam.html',tags:['Relaxed','Romantic','Couple','Family','Anniversary'],groupFriendly:true}
];
let activeRandomTour=null;
let activeMatchReason='A surprise selected from experiences that fit your answers.';
let journeyTimerPool=[];

function clearJourneyTimers(){journeyTimerPool.forEach(clearTimeout);journeyTimerPool=[]}
function queueJourney(fn,ms){const t=setTimeout(fn,ms);journeyTimerPool.push(t)}

function plannerHasChoices(){
  return Boolean(planner.occasion||planner.people||planner.feeling||planner.groupSize);
}

function buildJourneyCard(){
  const signals=[planner.occasion,planner.people,planner.feeling].filter(Boolean);
  const needsGroup=Boolean(planner.groupSize && planner.groupSize!=='2–4 Guests');
  const ranked=RANDOM_TOURS.map(tour=>{
    let score=0;
    signals.forEach(s=>{if(tour.tags.includes(s)) score+=3;});
    if(needsGroup) score+=tour.groupFriendly?2:-4;
    if(planner.people==='Large Group') score+=tour.groupFriendly?3:-6;
    if(planner.people==='Family' && tour.tags.includes('Family')) score+=2;
    return {...tour,score};
  }).sort((a,b)=>b.score-a.score);
  const bestScore=ranked[0]?.score??0;
  const candidates=ranked.filter((t,i)=>i<3 && t.score>=Math.max(0,bestScore-2));
  activeRandomTour=(candidates.length?candidates:RANDOM_TOURS)[Math.floor(Math.random()*(candidates.length?candidates.length:RANDOM_TOURS.length))];
  const matchedSignals=signals.filter(s=>activeRandomTour.tags.includes(s));
  activeMatchReason=matchedSignals.length?`Matched to ${matchedSignals.join(' + ')}${needsGroup&&activeRandomTour.groupFriendly?' + group-friendly format':''}.`:'A surprise chosen from the strongest compatible experiences for your brief.';
  const title=activeRandomTour.title;
  const text='A surprise chosen by the journey — guided by your answers, not by chance alone.';
  dockCardTitle.textContent=title; dockCardText.textContent=text;
  if(dockCard){dockCard.setAttribute('href',activeRandomTour.url||'#');dockCard.setAttribute('aria-label',`Open ${title}`);}
  flyCardTitle.textContent=title; flyCardText.textContent=text;
  const bg=`url("${activeRandomTour.image}")`;
  if(flyCardThumb) flyCardThumb.style.backgroundImage=bg;
  if(dockCardThumb) dockCardThumb.style.backgroundImage=bg;
  if(flyCardMeta) flyCardMeta.textContent=activeRandomTour.meta;
  if(dockCardMeta) dockCardMeta.textContent=activeRandomTour.meta;
  const chips=[planner.occasion,planner.people,planner.feeling,planner.groupSize].filter(Boolean);
  offerResultMeta.innerHTML=chips.map(v=>`<span>${v}</span>`).join('');
  const reason=document.getElementById('journeyMatchReason'); if(reason) reason.textContent=activeMatchReason;
  const bonus=document.getElementById('journeyBonus');
  if(bonus) bonus.hidden=!needsGroup;
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

requestPersonalOffer?.addEventListener('click',()=>{
  const hasGroupBonus=Boolean(planner.groupSize && planner.groupSize!=='2–4 Guests');
  const lines=['SPECIAL EXPERIENCE REQUEST',''];
  if(activeRandomTour){lines.push(`Journey match: ${activeRandomTour.title}`,`Category: ${activeRandomTour.meta}`,`Why this match: ${activeMatchReason}`,'');}
  if(planner.occasion) lines.push(`Occasion: ${planner.occasion}`);
  if(planner.people) lines.push(`For: ${planner.people}`);
  if(planner.feeling) lines.push(`Feeling: ${planner.feeling}`);
  if(planner.groupSize) lines.push(`Group size: ${planner.groupSize}`);
  if(hasGroupBonus) lines.push('Journey group bonus: 5% OFF for every paying guest — please confirm final conditions.');
  lines.push('','Please check availability, final price and confirm this personal Journey offer.');
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`,'_blank','noopener');
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

// Gift Certificate Builder — two different products, one live certificate.
const giftOptions=[...document.querySelectorAll('.gift-option')];
const giftForm=document.getElementById('giftForm');
const giftType=document.getElementById('giftType');
const giftMode=document.getElementById('giftMode');
const giftFreedomFields=document.getElementById('giftFreedomFields');
const giftSignatureFields=document.getElementById('giftSignatureFields');
const giftSubmit=document.getElementById('giftSubmit');
const giftRecipient=document.getElementById('giftRecipient');
const giftGiver=document.getElementById('giftGiver');
const giftOccasion=document.getElementById('giftOccasion');
const giftAmount=document.getElementById('giftAmount');
const giftExperience=document.getElementById('giftExperience');
const giftGuests=document.getElementById('giftGuests');
const giftPreferredDate=document.getElementById('giftPreferredDate');
const giftDateFlexible=document.getElementById('giftDateFlexible');
const giftDatePickerBtn=document.getElementById('giftDatePickerBtn');
const giftMessage=document.getElementById('giftMessage');
const giftMiniImage=document.getElementById('giftLiveMiniImage');
const certificateImage=document.querySelector('#certificateCard img');
let selectedGiftMode='';

if(giftMiniImage && certificateImage) giftMiniImage.src=certificateImage.src;
if(giftPreferredDate) giftPreferredDate.min=localISODate();
giftDatePickerBtn?.addEventListener('click',()=>openNativeDatePicker(giftPreferredDate));

function addMonthsLocal(date,months){const d=new Date(date.getFullYear(),date.getMonth()+months,date.getDate());return d;}
function humanDate(date){return new Intl.DateTimeFormat(document.documentElement.lang||'en',{day:'2-digit',month:'short',year:'numeric'}).format(date);}
function certSet(field,value){document.querySelectorAll(`[data-cert-field="${field}"]`).forEach(el=>{el.textContent=value;});}
function flashCertificate(){document.querySelectorAll('.certificate-live-layer').forEach(layer=>{layer.classList.remove('is-updating');void layer.offsetWidth;layer.classList.add('is-updating');});}
function giftDateLogic(){
  if(selectedGiftMode==='freedom') return 'Recipient chooses the date later';
  if(!selectedGiftMode) return '—';
  if(giftDateFlexible?.checked) return 'Date stays flexible';
  return giftPreferredDate?.value?`Preferred: ${giftPreferredDate.value}`:'Date to confirm';
}
function updateGiftPreview(){
  const recipient=(giftRecipient?.value||'').trim()||'YOUR RECIPIENT';
  const occasion=giftOccasion?.value||'—';
  const valid=humanDate(addMonthsLocal(new Date(),12)).toUpperCase();
  certSet('recipient',recipient);
  certSet('validUntil',valid);
  certSet('number','ATO-GIFT-PREVIEW');
  const layerList=document.querySelectorAll('.certificate-live-layer');
  layerList.forEach(l=>l.classList.toggle('signature',selectedGiftMode==='signature'));
  if(selectedGiftMode==='signature'){
    certSet('fieldLabel','EXPERIENCE');
    certSet('mainValue',(giftExperience?.value||'CHOOSE EXPERIENCE').toUpperCase());
    certSet('description',giftGuests?.value?`${giftGuests.value}. The experience is chosen now; the final date can stay flexible.`:'The experience is chosen now; the recipient receives a personal experience certificate.');
  }else{
    const amount=giftAmount?.value?`€${Number(giftAmount.value).toLocaleString('en-US')}`:'€100';
    certSet('fieldLabel','AMOUNT');
    certSet('mainValue',amount);
    certSet('description','They choose the experience and suitable date later with our team. Maximum freedom, zero guesswork.');
  }
  const pType=document.getElementById('giftPreviewType'); if(pType) pType.textContent=selectedGiftMode==='signature'?'Signature Experience Certificate':selectedGiftMode==='freedom'?'Freedom Value Certificate':'Choose a gift type';
  const pOcc=document.getElementById('giftPreviewOccasion'); if(pOcc) pOcc.textContent=occasion;
  const pDate=document.getElementById('giftPreviewDateLogic'); if(pDate) pDate.textContent=giftDateLogic();
  flashCertificate();
}
function validateGift(){
  if(!selectedGiftMode) return false;
  if(!giftRecipient?.value.trim() || !giftGiver?.value.trim()) return false;
  if(selectedGiftMode==='freedom') return Number(giftAmount?.value)>=25;
  if(selectedGiftMode==='signature') return Boolean(giftExperience?.value && giftGuests?.value);
  return false;
}
function renderGiftMode(){
  const freedom=selectedGiftMode==='freedom';
  const signature=selectedGiftMode==='signature';
  if(giftFreedomFields) giftFreedomFields.hidden=!freedom;
  if(giftSignatureFields) giftSignatureFields.hidden=!signature;
  if(giftAmount) giftAmount.required=freedom;
  if(giftExperience) giftExperience.required=signature;
  if(giftGuests) giftGuests.required=signature;
  const intro=document.getElementById('giftFormIntro');
  if(intro){intro.innerHTML=freedom?'<span>FREEDOM GIFT · VALUE CERTIFICATE</span><strong>You set the value. The recipient keeps control over both experience and date.</strong>':signature?'<span>SIGNATURE GIFT · EXPERIENCE CERTIFICATE</span><strong>You choose the memory now. The exact date can stay flexible, and the price stays off the certificate.</strong>':'<span>CHOOSE ONE OF THE TWO GIFT TYPES ABOVE</span><strong>The questions will change depending on what you are actually giving.</strong>';}
  if(giftSubmit){giftSubmit.disabled=!validateGift();giftSubmit.textContent=freedom?'Request My Value Certificate →':signature?'Request My Experience Certificate →':'Choose Gift Type First';}
  updateGiftPreview();
}
giftOptions.forEach(btn=>btn.addEventListener('click',()=>{
  giftOptions.forEach(x=>x.classList.remove('selected'));
  btn.classList.add('selected');
  selectedGiftMode=btn.dataset.giftMode||'';
  if(giftType) giftType.value=btn.dataset.giftType||'';
  if(giftMode) giftMode.value=selectedGiftMode;
  renderGiftMode();
  document.getElementById('giftBuilderGrid')?.scrollIntoView({behavior:'smooth',block:'start'});
}));
document.querySelectorAll('[data-gift-value]').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('[data-gift-value]').forEach(x=>x.classList.remove('selected'));
  btn.classList.add('selected');
  if(giftAmount){giftAmount.value=btn.dataset.giftValue;giftAmount.dispatchEvent(new Event('input',{bubbles:true}));}
}));
[giftRecipient,giftGiver,giftOccasion,giftAmount,giftExperience,giftGuests,giftPreferredDate,giftMessage].forEach(el=>el?.addEventListener('input',()=>{if(giftSubmit) giftSubmit.disabled=!validateGift();updateGiftPreview();}));
[giftOccasion,giftExperience,giftGuests,giftPreferredDate].forEach(el=>el?.addEventListener('change',()=>{if(giftSubmit) giftSubmit.disabled=!validateGift();updateGiftPreview();}));
giftDateFlexible?.addEventListener('change',()=>{if(giftPreferredDate) giftPreferredDate.disabled=giftDateFlexible.checked;updateGiftPreview();});
if(giftPreferredDate && giftDateFlexible) giftPreferredDate.disabled=giftDateFlexible.checked;

giftForm?.addEventListener('submit',e=>{
  e.preventDefault();
  if(!validateGift()){giftSubmit?.classList.add('needs-attention');setTimeout(()=>giftSubmit?.classList.remove('needs-attention'),700);return;}
  const f=new FormData(giftForm);
  const lines=['GIFT CERTIFICATE REQUEST',''];
  if(selectedGiftMode==='freedom'){
    lines.push('Product: FREEDOM GIFT — VALUE CERTIFICATE',`Gift value: €${f.get('amount')}`,'Recipient chooses the experience and suitable date later.');
  }else{
    const timing=giftDateFlexible?.checked?'Flexible date':(f.get('preferredDate')||'To confirm');
    lines.push('Product: SIGNATURE GIFT — EXPERIENCE CERTIFICATE',`Experience: ${f.get('experience')}`,`Guests: ${f.get('guests')}`,`Date preference: ${timing}`,'Please keep the experience price off the certificate.');
  }
  lines.push('',`Recipient: ${f.get('recipient')}`,`From: ${f.get('giver')}`,`Occasion: ${f.get('occasion')||'—'}`,`Personal message: ${f.get('message')||'—'}`,'','Please confirm the final certificate conditions, validity and certificate number.');
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`,'_blank','noopener');
});
renderGiftMode();

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


  

import('https://unpkg.com/three@0.160.1/build/three.module.js').then(({default: _unused, ...THREE_NS}) => { const THREE = THREE_NS;

const canvas = document.getElementById('liveGlobeCanvas');
const globeShell = document.getElementById('globeShell');
const globeZone = document.getElementById('globeZone');
const bokehWrap = document.getElementById('globeBokeh');

if (canvas && globeShell && globeZone) {
  function createBokehDots(count = 48){
    if(!bokehWrap) return;
    bokehWrap.innerHTML = '';
    for(let i = 0; i < count; i++){
      const dot = document.createElement('span');
      dot.className = 'bokeh-dot' + (Math.random() > 0.82 ? ' gold' : '');
      const size = 7 + Math.random() * 26;
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
      dot.style.left = Math.random() * 100 + '%';
      dot.style.top = 18 + Math.random() * 72 + '%';
      dot.style.animationDuration = (7 + Math.random() * 8) + 's';
      dot.style.animationDelay = (Math.random() * 6) + 's';
      bokehWrap.appendChild(dot);
    }
  }
  createBokehDots();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 7.9);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const root = new THREE.Group();
  scene.add(root);

  const ambient = new THREE.AmbientLight(0x79c8ff, 0.82);
  scene.add(ambient);

  const key = new THREE.PointLight(0x8fe4ff, 3.4, 40);
  key.position.set(4.2, 2.8, 6);
  scene.add(key);

  const rim = new THREE.PointLight(0x258bff, 2.5, 30);
  rim.position.set(-5.5, -2.4, -3);
  scene.add(rim);

  const warm = new THREE.PointLight(0xffd27b, 0.8, 24);
  warm.position.set(-4, 1, 3);
  scene.add(warm);

  const loader = new THREE.TextureLoader();
  const globeGeometry = new THREE.SphereGeometry(2.28, 128, 128);

  function makeFallbackGlobe(){
    const mat = new THREE.MeshStandardMaterial({
      color: 0x05234b,
      emissive: 0x1aa3ff,
      emissiveIntensity: 0.9,
      roughness: 0.7,
      metalness: 0.15
    });
    const mesh = new THREE.Mesh(globeGeometry, mat);
    root.add(mesh);
    addAtmosphere();
    addNetworkShell();
    addStars();
    addGoldenStars();
    resize();
    animate();
  }

  const assets = {
    map: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
    lights: 'https://threejs.org/examples/textures/planets/earth_lights_2048.png',
    normal: 'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg'
  };

  Promise.all([
    loader.loadAsync(assets.map),
    loader.loadAsync(assets.lights),
    loader.loadAsync(assets.normal)
  ]).then(([earthMap, earthLights, earthNormal]) => {
    const globeMaterial = new THREE.MeshStandardMaterial({
      map: earthMap,
      normalMap: earthNormal,
      color: new THREE.Color(0x31577a),
      emissive: new THREE.Color(0x0086c7),
      emissiveMap: earthLights,
      emissiveIntensity: 0.72,
      roughness: 0.78,
      metalness: 0.05
    });

    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    globe.name = 'mainGlobe';
    root.add(globe);

    addAtmosphere();
    addNetworkShell();
    addStars();
    addGoldenStars();
    resize();
    animate();
  }).catch((err) => {
    console.warn('Live globe textures failed to load, using fallback globe.', err);
    makeFallbackGlobe();
  });

  function addAtmosphere(){
    const glowGeometry = new THREE.SphereGeometry(2.38, 96, 96);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x20bfff,
      transparent: true,
      opacity: 0.095
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.name = 'glowShell';
    root.add(glow);
  }

  function addNetworkShell(){
    const networkGeometry = new THREE.SphereGeometry(2.43, 72, 72);
    const networkMaterial = new THREE.MeshBasicMaterial({
      color: 0x55cfff,
      wireframe: true,
      transparent: true,
      opacity: 0.035
    });
    const network = new THREE.Mesh(networkGeometry, networkMaterial);
    network.name = 'networkShell';
    root.add(network);
  }


  function addGoldenStars(){
    const count = 24;
    const positions = new Float32Array(count * 3);
    for(let i=0;i<count;i++){
      const radius = 4.8 + Math.random()*5.8;
      const theta = Math.random()*Math.PI*2;
      const phi = Math.acos((Math.random()*2)-1);
      positions[i*3] = radius*Math.sin(phi)*Math.cos(theta);
      positions[i*3+1] = radius*Math.sin(phi)*Math.sin(theta);
      positions[i*3+2] = radius*Math.cos(phi);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions,3));
    const m = new THREE.PointsMaterial({
      color:0xffd382,
      size:.085,
      transparent:true,
      opacity:.72
    });
    const pts = new THREE.Points(g,m);
    pts.name='goldParticles';
    scene.add(pts);
  }

  function addStars(){
    const particleCount = 220;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 7 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x63d7ff,
      size: 0.06,
      transparent: true,
      opacity: 0.78
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    particles.name = 'outerParticles';
    scene.add(particles);
  }

  let mouseX = 0;
  let mouseY = 0;

  globeShell.addEventListener('pointermove', (e) => {
    const rect = globeShell.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  });

  globeShell.addEventListener('pointerleave', () => {
    mouseX = 0;
    mouseY = 0;
  });

  function resize(){
    const size = globeShell.getBoundingClientRect();
    const w = Math.max(320, Math.round(size.width));
    const h = Math.max(320, Math.round(size.height));
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();

  function animate(){
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();
    const mainGlobe = root.getObjectByName('mainGlobe');
    const glowShell = root.getObjectByName('glowShell');
    const networkShell = root.getObjectByName('networkShell');
    const outerParticles = scene.getObjectByName('outerParticles');
    const goldParticles = scene.getObjectByName('goldParticles');

    const running = globeZone.classList.contains('journey-running');
    const arrived = globeZone.classList.contains('journey-arrived');
    const pulsing = globeZone.classList.contains('journey-pulse');
    const heart = globeZone.classList.contains('journey-heart');
    const exploding = globeZone.classList.contains('journey-explode');
    const launched = globeZone.classList.contains('journey-card-launch') || globeZone.classList.contains('card-landed');

    let spin = 0.0024;
    if (running) spin = 0.0072;
    if (arrived) spin = 0.004;
    if (heart || pulsing) spin = 0.0031;
    if (exploding || launched) spin = 0.001;

    if (mainGlobe) {
      mainGlobe.rotation.y += spin;
      mainGlobe.rotation.x = Math.sin(t * 0.35) * 0.03 + mouseY * 0.06;
      mainGlobe.rotation.z = Math.sin(t * 0.18) * 0.02;
    }

    if (glowShell) {
      glowShell.rotation.y += spin * 0.82;
      glowShell.material.opacity = heart ? 0.08 : (0.14 + Math.sin(t * 1.8) * 0.018);
    }

    if (networkShell) {
      networkShell.rotation.y += spin * 1.25;
      networkShell.rotation.z = Math.sin(t * 0.26) * 0.03;
      networkShell.material.opacity = launched ? 0.05 : (pulsing ? 0.22 : 0.13);
    }

    if (outerParticles) {
      outerParticles.rotation.y += 0.0008;
      outerParticles.rotation.x = Math.sin(t * 0.12) * 0.05;
      outerParticles.material.opacity = launched ? 0.18 : 0.82;
    }
    if (goldParticles) {
      goldParticles.rotation.y -= 0.00042;
      goldParticles.rotation.z = Math.sin(t * 0.18) * 0.04;
      goldParticles.material.opacity = launched ? 0.18 : (0.60 + Math.sin(t*1.1)*0.10);
    }

    root.rotation.y += mouseX * 0.0009;

    renderer.render(scene, camera);
  }
}
}).catch(err => console.error('Three.js failed to load:', err));

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
