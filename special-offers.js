const WHATSAPP='905387045999';


// Three-path gateway: preserve visible context when returning from a branch
document.querySelectorAll('.offer-path').forEach(card=>{
  card.addEventListener('click',()=>{
    document.querySelectorAll('.offer-path').forEach(x=>x.classList.remove('selected-path'));
    card.classList.add('selected-path');
  });
});

// Header
const menuBtn=document.getElementById('menuBtn');
const mainNav=document.getElementById('mainNav');
menuBtn?.addEventListener('click',()=>mainNav.classList.toggle('open'));
mainNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mainNav.classList.remove('open')));


// Group & Event Planner
const groupPlanner={step:0,type:'',guests:'',date:'',hotel:'',flexible:false};
const groupQuestions=[...document.querySelectorAll('.group-question')];
const groupIndexes=[...document.querySelectorAll('[data-group-index]')];
const groupNext=document.getElementById('groupPlannerNext');
const groupBack=document.getElementById('groupPlannerBack');
const groupDate=document.getElementById('groupPreferredDate');
const groupHotel=document.getElementById('groupHotelArea');
const groupFlexible=document.getElementById('groupFlexibleDate');

function groupStepReady(){
  if(groupPlanner.step===0) return !!groupPlanner.type;
  if(groupPlanner.step===1) return !!groupPlanner.guests;
  if(groupPlanner.step===2) return groupPlanner.flexible || !!groupPlanner.date;
  if(groupPlanner.step===3) return true;
  return false;
}
function renderGroupPlanner(){
  groupQuestions.forEach((q,i)=>q.classList.toggle('active',i===groupPlanner.step));
  groupIndexes.forEach((x,i)=>x.classList.toggle('active',i===groupPlanner.step));
  groupBack.hidden=groupPlanner.step===0;
  groupNext.disabled=!groupStepReady();
  groupNext.textContent=groupPlanner.step===3?'Create My Group Request →':'Continue →';
}
document.querySelectorAll('.group-question').forEach((q,step)=>{
  q.querySelectorAll('.group-choice').forEach(btn=>btn.addEventListener('click',()=>{
    q.querySelectorAll('.group-choice').forEach(x=>x.classList.remove('selected'));
    btn.classList.add('selected');
    if(step===0) groupPlanner.type=btn.dataset.value;
    if(step===1) groupPlanner.guests=btn.dataset.value;
    renderGroupPlanner();
  }));
});
groupDate?.addEventListener('input',()=>{
  groupPlanner.date=groupDate.value;
  if(groupPlanner.date){
    groupPlanner.flexible=false;
    groupFlexible?.classList.remove('selected');
  }
  renderGroupPlanner();
});
groupFlexible?.addEventListener('click',()=>{
  groupPlanner.flexible=!groupPlanner.flexible;
  groupFlexible.classList.toggle('selected',groupPlanner.flexible);
  if(groupPlanner.flexible && groupDate){
    groupDate.value='';
    groupPlanner.date='';
  }
  renderGroupPlanner();
});
groupHotel?.addEventListener('input',()=>{groupPlanner.hotel=groupHotel.value.trim()});
groupNext?.addEventListener('click',()=>{
  if(!groupStepReady()) return;
  if(groupPlanner.step<3){
    groupPlanner.step++;
    renderGroupPlanner();
    return;
  }
  groupPlanner.hotel=groupHotel?.value.trim()||'';
  const timing=groupPlanner.flexible?'Flexible date':(groupPlanner.date||'Date to confirm');
  document.getElementById('groupSummaryText').textContent=
    `${groupPlanner.type} · ${groupPlanner.guests} · ${timing}${groupPlanner.hotel?` · ${groupPlanner.hotel}`:''}. We’ll prepare a personal group proposal around these details.`;
  document.getElementById('groupPlannerSummary').classList.add('show');
  document.getElementById('groupPlannerSummary').scrollIntoView({behavior:'smooth',block:'nearest'});
});
groupBack?.addEventListener('click',()=>{
  if(groupPlanner.step>0){groupPlanner.step--;renderGroupPlanner()}
});
document.getElementById('sendGroupOffer')?.addEventListener('click',()=>{
  const timing=groupPlanner.flexible?'Flexible':(groupPlanner.date||'To confirm');
  const lines=[
    'GROUP & EVENT OFFER REQUEST','',
    `Type: ${groupPlanner.type||'—'}`,
    `Guests: ${groupPlanner.guests||'—'}`,
    `Preferred date: ${timing}`,
    `Hotel / Area: ${groupPlanner.hotel||'Not specified'}`,
    '',
    'Please prepare a personal group offer around these details.'
  ];
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`,'_blank','noopener');
});
renderGroupPlanner();

// Special Experience Planner
const planner={step:0,occasion:'',people:'',feeling:'',groupSize:''};
const questions=[...document.querySelectorAll('.question')];
const indexes=[...document.querySelectorAll('.planner-index span')];
const nextBtn=document.getElementById('plannerNext');
const backBtn=document.getElementById('plannerBack');
function currentField(){return ['occasion','people','feeling','groupSize'][planner.step]}
function renderPlanner(){
  questions.forEach((q,i)=>q.classList.toggle('active',i===planner.step));
  indexes.forEach((x,i)=>x.classList.toggle('active',i===planner.step));
  backBtn.hidden=planner.step===0;
  nextBtn.disabled=!planner[currentField()];
  nextBtn.textContent=planner.step===3?'Create My Experience →':'Continue →';
}
document.querySelectorAll('.choice-grid').forEach(grid=>{
  grid.querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>{
    grid.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected'));
    btn.classList.add('selected');
    planner[grid.dataset.field]=btn.textContent.trim();
    nextBtn.disabled=false;
  }));
});
nextBtn.addEventListener('click',()=>{
  if(!planner[currentField()]) return;
  if(planner.step<3){planner.step++;renderPlanner();return;}
  document.getElementById('plannerSummary').classList.add('show');
  document.getElementById('summaryText').textContent=`${planner.occasion} · ${planner.people} · ${planner.feeling} · ${planner.groupSize}. We’ll prepare an individual proposal around these choices.`;
  document.getElementById('plannerSummary').scrollIntoView({behavior:'smooth',block:'nearest'});
});
backBtn.addEventListener('click',()=>{if(planner.step>0){planner.step--;renderPlanner()}});
document.getElementById('sendExperience').addEventListener('click',()=>{
  document.getElementById('journey').scrollIntoView({behavior:'smooth',block:'center'});
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
const dockLabel=document.querySelector('.journey-dock-label');
const dockCardTitle=document.getElementById('dockCardTitle');
const dockCardText=document.getElementById('dockCardText');
const flyCardTitle=document.getElementById('flyCardTitle');
const flyCardText=document.getElementById('flyCardText');
const offerResultMeta=document.getElementById('offerResultMeta');
const requestPersonalOffer=document.getElementById('requestPersonalOffer');
const alanyaDot=document.querySelector('.destination-dot');
const tourCardFly=document.getElementById('tourCardFly');
const atoFlightOverlay=document.getElementById('atoFlightOverlay');
const atoFlightRouteBase=document.getElementById('atoFlightRouteBase');
const atoFlightRouteLive=document.getElementById('atoFlightRouteLive');
const atoLaunchPlane=document.getElementById('atoLaunchPlane');
const siteLogo=document.querySelector('.header .logo');
const globeStageLive=document.getElementById('globeStageLive');
const flyCardThumb=document.getElementById('flyCardThumb');
const flyCardMeta=document.getElementById('flyCardMeta');
const dockCardThumb=document.getElementById('dockCardThumb');
const dockCardMeta=document.getElementById('dockCardMeta');
const finalTurkiyeStage=document.getElementById('finalTurkiyeStage');

const RANDOM_TOURS=[
  {title:'Aspendos, Side & Manavgat Waterfall',meta:'History & Culture · Full Day',image:'images/history-culture/history-culture-hero.png',url:'manavgat-aspendos-side.html'},
  {title:'Land of Legends — Day Tour',meta:'Family Experience · Belek',image:'images/family-experiences/hero.png',url:'land-of-legends.html'},
  {title:'Alanya Paragliding',meta:'Air Experience · Alanya',image:'images/air-experiences/air-category-hero.png',url:'paragliding.html'},
  {title:'Family Jeep Safari',meta:'Nature & Adventure · Alanya',image:'images/nature-adventure/canyon-adventures.png',url:'family-jeep-safari.html'},
  {title:'Private Yacht Charter',meta:'VIP Service · Private Experience',image:'images/vip-services/HERO.png',url:'private-yacht-charter.html'},
  {title:'Turkish Hammam & Spa',meta:'Wellness & Relax · Alanya',image:'images/wellness-relax/hero.jpeg',url:'turkish-hammam.html'}
];
let activeRandomTour=null;
let journeyTimerPool=[];

function clearJourneyTimers(){journeyTimerPool.forEach(clearTimeout);journeyTimerPool=[]}
function queueJourney(fn,ms){const t=setTimeout(fn,ms);journeyTimerPool.push(t)}

function plannerHasChoices(){
  return Boolean(planner.occasion||planner.people||planner.feeling||planner.groupSize);
}

function buildJourneyCard(){
  activeRandomTour=RANDOM_TOURS[Math.floor(Math.random()*RANDOM_TOURS.length)];
  const title=activeRandomTour.title;
  const text='A tour chosen by the journey — discover where the heart takes you.';
  dockCardTitle.textContent=title; dockCardText.textContent=text;
  if(dockCard) dockCard.setAttribute('href',activeRandomTour.url||'#');
  flyCardTitle.textContent=title; flyCardText.textContent=text;
  const bg=`url("${activeRandomTour.image}")`;
  if(flyCardThumb) flyCardThumb.style.backgroundImage=bg;
  if(dockCardThumb) dockCardThumb.style.backgroundImage=bg;
  if(flyCardMeta) flyCardMeta.textContent=activeRandomTour.meta;
  if(dockCardMeta) dockCardMeta.textContent=activeRandomTour.meta;
  const chips=[planner.occasion,planner.people,planner.feeling,planner.groupSize].filter(Boolean);
  offerResultMeta.innerHTML=chips.map(v=>`<span>${v}</span>`).join('');
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


function setLogoFlightGeometry(){
  if(!atoFlightOverlay||!atoFlightRouteBase||!atoFlightRouteLive||!atoLaunchPlane||!siteLogo||!globeStageLive) return;
  const logo=siteLogo.getBoundingClientRect(), globe=globeStageLive.getBoundingClientRect();
  const sx=logo.left+Math.min(logo.width*.78,logo.width-10), sy=logo.top+logo.height*.52;
  const ex=globe.left+globe.width*.28, ey=globe.top+globe.height*.30, dx=ex-sx;
  const d=`M ${sx} ${sy} C ${sx+dx*.30} ${sy-Math.max(70,Math.abs(dx)*.10)}, ${sx+dx*.72} ${ey-Math.max(45,Math.abs(dx)*.05)}, ${ex} ${ey}`;
  atoFlightRouteBase.setAttribute('d',d); atoFlightRouteLive.setAttribute('d',d);
  atoLaunchPlane.style.offsetPath=`path("${d}")`;
}
function launchFromLogo(){
  if(!atoFlightOverlay) return;
  setLogoFlightGeometry();
  atoFlightOverlay.classList.remove('fly','route-visible','route-fade');
  void atoFlightOverlay.offsetWidth;
  atoFlightOverlay.classList.add('active');
  // Aircraft appears first. The route is revealed a fraction later.
  requestAnimationFrame(()=>{
    atoFlightOverlay.classList.add('fly');
    setTimeout(()=>atoFlightOverlay.classList.add('route-visible'),220);
  });
}
function endLogoFlight(){
  if(!atoFlightOverlay) return;
  atoFlightOverlay.classList.add('route-fade');
  setTimeout(()=>{
    atoFlightOverlay.classList.remove('fly','active','route-visible','route-fade');
  },520);
}

function resetJourneyVisual(){
  clearJourneyTimers(); endLogoFlight();
  globeZone.classList.remove('journey-running','orbit-flight','orbit-complete','journey-arrived','turkiye-focus','alanya-landed','journey-pulse','light-collapse','journey-heart','heart-full','journey-explode','journey-card-launch','card-landed','heart-return','final-turkiye');
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

  dockCard.classList.remove('visible','final-visible');
  dockLabel?.classList.add('ready');
  globeZone.classList.add('card-landed');
  status.innerHTML='<strong>YOUR EXPERIENCE HAS ARRIVED.</strong><span>ALANYA → YOUR PERSONAL OFFER</span>';
  startJourney.disabled=false;
  startJourney.classList.add('is-active');
  if(startJourney.querySelector('span')) startJourney.querySelector('span').textContent='REPLAY MY JOURNEY ↻';
}

function runJourney(fromPlanner=false){
  buildJourneyCard();
  resetJourneyVisual();
  dockCard?.classList.remove('visible','final-visible');
  dockLabel?.classList.remove('ready');

  requestAnimationFrame(()=>{
    setCardFlightGeometry();
    setLogoFlightGeometry();
    void globeZone.offsetWidth;

    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      globeZone.classList.add('final-turkiye');
      status.innerHTML='<strong>WE ARE HERE.</strong><span>ALANYA · 36.532392° N · 32.038899° E</span>';
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
      status.innerHTML='<strong>AROUND THE WORLD.</strong><span>ONE ORBIT → ONE DESTINATION</span>';
    },3300);

    /* 04 ORBIT LINE / PLANE DISAPPEAR, THEN FOCUS ON TÜRKİYE. */
    queueJourney(()=>{
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
      globeZone.classList.add('light-collapse');
      status.innerHTML='<strong>THE WORLD BECOMES A FEELING.</strong><span>COLD BLUE LIGHT → ONE WARM RED CORE</span>';
    },10650);

    /* 09 Red core. */
    queueJourney(()=>{
      status.innerHTML='<strong>THE POINT BECOMES A HEART.</strong><span>ALANYA → EMOTION</span>';
    },11450);

    /* 10 Red digital heart is born. */
    queueJourney(()=>{
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
      setCardFlightGeometry();
      globeZone.classList.add('journey-card-launch');
      status.innerHTML='<strong>YOUR TOUR APPEARS.</strong><span>THE HEART CHOOSES AN EXPERIENCE</span>';
    },14600);

    queueJourney(()=>{
      globeZone.classList.add('journey-explode');
    },15350);

    queueJourney(()=>{
      landOfferCard();
    },16250);

    /* 13 Heart returns to original Alanya point and disappears. */
    queueJourney(()=>{
      dockCard.classList.remove('visible','final-visible');
      globeZone.classList.add('heart-return');
      status.innerHTML='<strong>THE HEART COMES HOME.</strong><span>BACK TO ALANYA</span>';
    },18000);

    /* 14–15 Final state: glowing Türkiye + flag + WE ARE HERE + coordinates. */
    queueJourney(()=>{
      globeZone.classList.add('final-turkiye');
      status.innerHTML='<strong>WE ARE HERE.</strong><span>ALANYA · 36.532392° N · 32.038899° E</span>';
      startJourney.disabled=false;
      startJourney.classList.remove('is-active');
      if(startJourney.querySelector('span')) startJourney.querySelector('span').textContent='PLAY AGAIN →';
      queueJourney(()=>{
        dockCard?.classList.add('final-visible');
        dockLabel?.classList.add('ready');
      },520);
    },19250);
  });
}

startJourney.addEventListener('click',()=>runJourney(false));

window.addEventListener('resize',()=>{
  setLogoFlightGeometry();
  if(globeZone.classList.contains('journey-card-launch') || globeZone.classList.contains('card-landed')){
    setCardFlightGeometry();
  }
});

requestPersonalOffer?.addEventListener('click',()=>{
  const lines=['SPECIAL EXPERIENCE REQUEST',''];
  if(planner.occasion) lines.push(`Occasion: ${planner.occasion}`);
  if(planner.people) lines.push(`For: ${planner.people}`);
  if(planner.feeling) lines.push(`Feeling: ${planner.feeling}`);
  if(planner.groupSize) lines.push(`Group size: ${planner.groupSize}`);
  lines.push('','Please prepare my personal offer.');
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

// Gift mini planner
const giftOptions=[...document.querySelectorAll('.gift-option')];
const giftForm=document.getElementById('giftForm');
giftOptions.forEach(btn=>btn.addEventListener('click',()=>{
  giftOptions.forEach(x=>x.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('giftType').value=btn.dataset.giftType;
  giftForm.classList.add('show');
  giftForm.scrollIntoView({behavior:'smooth',block:'nearest'});
}));
giftForm.addEventListener('submit',e=>{
  e.preventDefault();
  const f=new FormData(giftForm);
  const text=[
    'GIFT CERTIFICATE REQUEST','',
    `Type: ${f.get('giftType')}`,
    `Recipient: ${f.get('recipient')}`,
    `From: ${f.get('giver')}`,
    `Occasion: ${f.get('occasion')||'—'}`,
    `Amount / Experience: ${f.get('choice')}`,
    `Personal message: ${f.get('message')||'—'}`
  ].join('\n');
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`,'_blank','noopener');
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
  const card=document.getElementById('dockCard');
  if(card){
    card.style.pointerEvents='auto';
    if(card.tagName!=='A'){
      card.setAttribute('role','link');
      card.setAttribute('tabindex','0');
      const open=()=>{ const href=card.getAttribute('data-href')||card.getAttribute('href'); if(href&&href!=='#') window.location.href=href; };
      card.addEventListener('click',open);
      card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
    }
  }
});
