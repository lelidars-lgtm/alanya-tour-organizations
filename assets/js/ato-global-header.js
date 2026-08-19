/* ATO GLOBAL HEADER v1.3 FIX — V3 preserved; click + approved navy-glass surface only — 2026-08-19.
   Canonical: header + auction/promo bar + navigation + languages + search + mobile. */
(function(){
'use strict';
if(document.getElementById('atoGlobalHeaderRoot'))return;
const css="\n/* ==========================================================\n   ATO GLOBAL HEADER \u2014 CANONICAL INDEX HEADER\n   One source of truth for every site page.\n   ========================================================== */\n#atoGlobalHeaderRoot{\n  position:sticky!important; top:0!important; z-index:2147483000!important;\n  width:100%!important; max-width:none!important; margin:0!important; padding:0!important;\n  display:block!important; isolation:isolate!important;\n  font-family:Arial,Helvetica,sans-serif!important;\n}\n#atoGlobalHeaderRoot, #atoGlobalHeaderRoot *{box-sizing:border-box}\n#atoGlobalHeaderRoot a{color:inherit;text-decoration:none}\n#atoGlobalHeaderRoot button,#atoGlobalHeaderRoot input{font-family:inherit}\n\n#atoGlobalHeaderRoot .header{\n  width:100%!important;height:104px!important;min-height:104px!important;\n  display:flex!important;align-items:center!important;justify-content:space-between!important;gap:22px!important;\n  padding:0 24px!important;margin:0!important;position:relative!important;top:auto!important;left:auto!important;right:auto!important;\n  z-index:100!important;background:rgba(255,255,255,.88)!important;\n  backdrop-filter:blur(22px)!important;-webkit-backdrop-filter:blur(22px)!important;\n  border:0!important;border-bottom:1px solid rgba(201,154,61,.14)!important;\n  box-shadow:0 10px 30px rgba(0,0,0,.06)!important;overflow:visible!important;\n}\n#atoGlobalHeaderRoot .logo{display:flex!important;align-items:center!important;gap:10px!important;flex:0 0 auto!important;margin:0!important;padding:0!important;min-width:0!important;text-decoration:none!important}\n#atoGlobalHeaderRoot .logo img{display:block!important;width:56px!important;height:56px!important;min-width:56px!important;object-fit:contain!important;margin:0!important;opacity:1!important;visibility:visible!important}\n#atoGlobalHeaderRoot .logo-text{display:flex!important;flex-direction:column!important;justify-content:center!important;gap:0!important;white-space:nowrap!important}\n#atoGlobalHeaderRoot .logo-title{font:900 18px/1 Arial,Helvetica,sans-serif!important;color:#08142b!important;letter-spacing:0!important;margin:0!important;padding:0!important}\n#atoGlobalHeaderRoot .logo-subtitle{margin:4px 0 0!important;padding:0!important;font:800 10px/1 Arial,Helvetica,sans-serif!important;letter-spacing:2.5px!important;color:#c99a3d!important}\n\n#atoGlobalHeaderRoot .nav{\n  display:flex!important;align-items:center!important;justify-content:center!important;gap:18px!important;white-space:nowrap!important;\n  flex:1 1 auto!important;height:auto!important;min-height:0!important;margin:0!important;padding:0!important;\n  position:static!important;inset:auto!important;transform:none!important;background:transparent!important;overflow:visible!important;\n}\n#atoGlobalHeaderRoot .nav-item,#atoGlobalHeaderRoot .contact-link{\n  display:flex!important;align-items:center!important;gap:6px!important;color:#111827!important;\n  font:800 13px/1.2 Arial,Helvetica,sans-serif!important;letter-spacing:0!important;cursor:pointer!important;transition:.25s ease!important;\n  margin:0!important;padding:0!important;text-transform:none!important;border:0!important;background:transparent!important;\n}\n#atoGlobalHeaderRoot .nav-item:hover,#atoGlobalHeaderRoot .contact-link:hover{color:#c99a3d!important}\n#atoGlobalHeaderRoot .nav-item.special .fire{font-size:13px!important}\n#atoGlobalHeaderRoot .arrow-icon{width:12px!important;height:12px!important;stroke:#c99a3d!important;stroke-width:2.2!important;stroke-linecap:round!important;stroke-linejoin:round!important;fill:none!important;flex:0 0 auto!important}\n#atoGlobalHeaderRoot .arrow-icon path{fill:none!important;stroke:#c99a3d!important}\n#atoGlobalHeaderRoot .globe-icon{width:20px!important;height:20px!important;stroke:#c99a3d!important;stroke-width:1.8!important;fill:none!important}\n\n#atoGlobalHeaderRoot .language{position:relative!important;display:flex!important;align-items:center!important;gap:7px!important;flex:0 0 auto!important;margin:0!important;padding:0!important;color:#111827!important;font:800 14px/1 Arial,Helvetica,sans-serif!important;cursor:pointer!important;height:auto!important}\n#atoGlobalHeaderRoot .nav-dropdown{position:relative!important}\n#atoGlobalHeaderRoot .dropdown-menu,#atoGlobalHeaderRoot .language-menu{\n  position:absolute!important;\n  background:radial-gradient(105% 72% at 12% 0%,rgba(221,180,93,.075) 0%,rgba(221,180,93,.018) 34%,transparent 58%),linear-gradient(145deg,rgba(7,17,30,.965) 0%,rgba(8,25,41,.955) 58%,rgba(7,20,34,.965) 100%)!important;\n  backdrop-filter:blur(20px) saturate(118%)!important;-webkit-backdrop-filter:blur(20px) saturate(118%)!important;\n  border:1px solid rgba(205,165,92,.28)!important;border-radius:20px!important;padding:10px!important;margin:0!important;\n  opacity:0!important;visibility:hidden!important;transition:opacity .22s ease,visibility .22s ease,transform .22s cubic-bezier(.22,.61,.36,1)!important;box-shadow:0 22px 62px rgba(0,0,0,.30),inset 0 1px 0 rgba(255,248,236,.035)!important;z-index:1000!important;\n  height:auto!important;overflow:visible!important;\n}\n#atoGlobalHeaderRoot .dropdown-menu{top:42px!important;left:50%!important;right:auto!important;transform:translateX(-50%)!important;width:300px!important}\n#atoGlobalHeaderRoot .language-menu{top:calc(100% + 16px)!important;right:0!important;left:auto!important;transform:none!important;width:220px!important}\n#atoGlobalHeaderRoot .nav-dropdown:hover>.dropdown-menu,#atoGlobalHeaderRoot .nav-dropdown:focus-within>.dropdown-menu,#atoGlobalHeaderRoot .nav-dropdown.open>.dropdown-menu,#atoGlobalHeaderRoot .language-dropdown:hover>.language-menu,#atoGlobalHeaderRoot .language-dropdown.open>.language-menu{opacity:1!important;visibility:visible!important;pointer-events:auto!important}\n#atoGlobalHeaderRoot .dropdown-menu a,#atoGlobalHeaderRoot .language-menu a{display:flex!important;align-items:center!important;gap:12px!important;padding:14px 16px!important;margin:0!important;border-radius:16px!important;color:#fff!important;font:800 14px/1.25 Arial,Helvetica,sans-serif!important;white-space:normal!important;background:transparent!important}\n#atoGlobalHeaderRoot .dropdown-menu a:hover,#atoGlobalHeaderRoot .language-menu a:hover{background:rgba(255,255,255,.06)!important;color:#d4a64a!important}\n#atoGlobalHeaderRoot .language-close{display:none;border:0;background:transparent;color:#fff;cursor:pointer}\n#atoGlobalHeaderRoot .ato-dropdown-svg-icon{color:#f3c66d!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;width:22px!important;height:22px!important;flex:0 0 22px!important}\n#atoGlobalHeaderRoot .ato-dropdown-svg-icon .ato-cat-svg{width:18px!important;height:18px!important;fill:none!important;stroke:currentColor!important;stroke-width:1.8!important;stroke-linecap:round!important;stroke-linejoin:round!important}\n\n#atoGlobalHeaderRoot .mobile-menu-btn,#atoGlobalHeaderRoot .mobile-overlay{display:none}\n#atoGlobalHeaderRoot .ato-mobile-search-trigger{display:none}\n\n#atoGlobalHeaderRoot .promo-bar{\n  width:100%!important;\n  height:auto!important;\n  min-height:30px!important;\n  box-sizing:border-box!important;\n  display:flex!important;\n  align-items:center!important;\n  overflow:hidden!important;\n  position:relative!important;\n  top:auto!important;\n  left:auto!important;\n  right:auto!important;\n  z-index:190!important;\n  margin:0 0 -30px!important;\n  padding:7px 0!important;\n  background:linear-gradient(90deg,rgba(5,16,28,.28) 0%,rgba(10,30,47,.40) 50%,rgba(5,16,28,.28) 100%)!important;\n  backdrop-filter:blur(14px) saturate(1.18)!important;\n  -webkit-backdrop-filter:blur(14px) saturate(1.18)!important;\n  border:0!important;\n  box-shadow:inset 0 1px 0 rgba(255,255,255,.025),0 4px 14px rgba(0,0,0,.08)!important;\n}\n#atoGlobalHeaderRoot .promo-bar::before{\n  content:\"\"!important;\n  position:absolute!important;\n  left:0!important;\n  right:0!important;\n  height:1px!important;\n  transform:scaleY(.5)!important;\n  transform-origin:center!important;\n  z-index:4!important;\n  pointer-events:none!important;\n  background:linear-gradient(90deg,rgba(212,166,74,.18) 0%,rgba(241,202,104,.72) 18%,rgba(246,215,137,.94) 50%,rgba(241,202,104,.72) 82%,rgba(212,166,74,.18) 100%)!important;\n  box-shadow:0 0 5px rgba(241,202,104,.075)!important;\n}\n#atoGlobalHeaderRoot .promo-bar::before{top:0!important}\n#atoGlobalHeaderRoot .promo-track{\n  display:flex!important;\n  align-items:center!important;\n  gap:0!important;\n  width:max-content!important;\n  min-width:max-content!important;\n  white-space:nowrap!important;\n  color:#fff!important;\n  font:800 11px/1 Arial,Helvetica,sans-serif!important;\n  letter-spacing:.9px!important;\n  text-transform:uppercase!important;\n  padding:0!important;\n  margin:0!important;\n  animation:atoGlobalPromoMove 58s linear infinite!important;\n  will-change:transform!important;\n  position:relative!important;\n  z-index:2!important;\n}\n#atoGlobalHeaderRoot .promo-group{display:inline-flex!important;align-items:center!important;gap:24px!important;padding-right:24px!important;flex:0 0 auto!important}\n#atoGlobalHeaderRoot .promo-dot{color:#d4a64a!important}\n#atoGlobalHeaderRoot .promo-text{color:#fff!important}\n#atoGlobalHeaderRoot .promo-slogan{color:#fff!important}\n#atoGlobalHeaderRoot .promo-services{color:#fff!important}\n@keyframes atoGlobalPromoMove{from{transform:translateX(0)}to{transform:translateX(-50%)}}\n\n/* Active page: quiet gold cue, never a second bar. */\n#atoGlobalHeaderRoot .nav>a.is-current,#atoGlobalHeaderRoot .ato-subitem.is-current{color:#c99a3d!important}\n\n@media(max-width:1380px) and (min-width:981px){\n  #atoGlobalHeaderRoot .header{padding:0 18px!important;gap:14px!important}\n  #atoGlobalHeaderRoot .nav{gap:12px!important}\n  #atoGlobalHeaderRoot .nav-item,#atoGlobalHeaderRoot .contact-link{font-size:12px!important}\n  #atoGlobalHeaderRoot .logo img{width:52px!important;height:52px!important;min-width:52px!important}\n  #atoGlobalHeaderRoot .logo-title{font-size:17px!important}\n}\n@media(max-width:1160px) and (min-width:981px){\n  #atoGlobalHeaderRoot .header{padding:0 12px!important;gap:9px!important}\n  #atoGlobalHeaderRoot .nav{gap:8px!important}\n  #atoGlobalHeaderRoot .nav-item,#atoGlobalHeaderRoot .contact-link{font-size:10.5px!important}\n  #atoGlobalHeaderRoot .logo{gap:7px!important}\n  #atoGlobalHeaderRoot .logo img{width:46px!important;height:46px!important;min-width:46px!important}\n  #atoGlobalHeaderRoot .logo-title{font-size:15px!important}\n  #atoGlobalHeaderRoot .logo-subtitle{font-size:8px!important;letter-spacing:1.8px!important}\n}\n@media(max-width:980px){\n  #atoGlobalHeaderRoot .header{height:84px!important;min-height:84px!important;padding:0 16px!important;gap:8px!important;background:rgba(11,20,36,.96)!important;border-bottom:1px solid rgba(201,154,61,.22)!important;box-shadow:0 12px 30px rgba(0,0,0,.22)!important}\n  #atoGlobalHeaderRoot .logo{margin-left:55px!important;gap:8px!important}\n  #atoGlobalHeaderRoot .logo img{width:48px!important;height:48px!important;min-width:48px!important}\n  #atoGlobalHeaderRoot .logo-title{font-size:15px!important;color:rgba(255,255,255,.92)!important}\n  #atoGlobalHeaderRoot .logo-subtitle{font-size:8px!important;letter-spacing:2.1px!important}\n  #atoGlobalHeaderRoot .mobile-menu-btn{display:flex!important;flex-direction:column!important;gap:5px!important;position:absolute!important;left:20px!important;top:50%!important;transform:translateY(-50%)!important;width:34px!important;height:34px!important;align-items:center!important;justify-content:center!important;cursor:pointer!important;z-index:100001!important;margin:0!important;padding:0!important}\n  #atoGlobalHeaderRoot .mobile-menu-btn span{display:block!important;width:25px!important;height:2px!important;background:#c99a3d!important;border-radius:999px!important;transition:.22s ease!important}\n  #atoGlobalHeaderRoot .mobile-menu-btn.active span:nth-child(1){transform:translateY(7px) rotate(45deg)!important}\n  #atoGlobalHeaderRoot .mobile-menu-btn.active span:nth-child(2){opacity:0!important}\n  #atoGlobalHeaderRoot .mobile-menu-btn.active span:nth-child(3){transform:translateY(-7px) rotate(-45deg)!important}\n  #atoGlobalHeaderRoot .mobile-overlay{display:block!important;position:fixed!important;inset:0!important;background:rgba(0,0,0,.45)!important;backdrop-filter:blur(6px)!important;-webkit-backdrop-filter:blur(6px)!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;z-index:99990!important;transition:.25s ease!important}\n  #atoGlobalHeaderRoot .mobile-overlay.active{opacity:1!important;visibility:visible!important;pointer-events:auto!important}\n  #atoGlobalHeaderRoot .nav{position:fixed!important;top:84px!important;left:-100%!important;width:82%!important;max-width:360px!important;height:calc(100dvh - 84px)!important;overflow-y:auto!important;background:rgba(8,17,32,.985)!important;flex-direction:column!important;align-items:flex-start!important;justify-content:flex-start!important;padding:28px 24px 40px!important;gap:20px!important;transition:left .35s ease!important;z-index:100000!important;margin:0!important}\n  #atoGlobalHeaderRoot .nav.active{left:0!important}\n  #atoGlobalHeaderRoot .nav-item,#atoGlobalHeaderRoot .contact-link{color:#fff!important;font-size:15px!important;width:100%!important;justify-content:flex-start!important;min-height:34px!important}\n  #atoGlobalHeaderRoot .nav-dropdown{width:100%!important}\n  #atoGlobalHeaderRoot .dropdown-menu{position:static!important;inset:auto!important;transform:none!important;width:100%!important;max-width:none!important;margin:7px 0 5px!important;display:none!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;box-shadow:none!important;background:rgba(255,255,255,.035)!important;border-radius:16px!important}\n  #atoGlobalHeaderRoot .nav-dropdown.open>.dropdown-menu{display:block!important}\n  #atoGlobalHeaderRoot .language{margin-left:auto!important;color:#fff!important;height:auto!important}\n  #atoGlobalHeaderRoot .language-menu{position:fixed!important;top:84px!important;right:16px!important;left:auto!important;width:calc(100% - 32px)!important;max-width:320px!important;transform:none!important}\n  #atoGlobalHeaderRoot .language-close{display:block!important;position:absolute!important;right:10px!important;top:8px!important;width:34px!important;height:34px!important;font-size:26px!important;z-index:2!important}\n  #atoGlobalHeaderRoot .language-menu a:first-of-type{margin-top:32px!important}\n  #atoGlobalHeaderRoot .promo-bar{height:auto!important;min-height:28px!important;padding:6px 0!important;margin-bottom:-28px!important;background:linear-gradient(90deg,rgba(5,16,28,.24),rgba(10,30,47,.36),rgba(5,16,28,.24))!important}\n  #atoGlobalHeaderRoot .promo-track{font-size:10px!important;line-height:1!important;letter-spacing:.75px!important;animation-duration:50s!important}\n  #atoGlobalHeaderRoot .promo-group{gap:20px!important;padding-right:20px!important}\n}\n@media(max-width:560px){\n  #atoGlobalHeaderRoot .header{padding:0 10px!important}\n  #atoGlobalHeaderRoot .logo{margin-left:48px!important;gap:6px!important}\n  #atoGlobalHeaderRoot .logo img{width:42px!important;height:42px!important;min-width:42px!important}\n  #atoGlobalHeaderRoot .logo-title{font-size:13px!important}\n  #atoGlobalHeaderRoot .logo-subtitle{font-size:7px!important;letter-spacing:1.65px!important}\n  #atoGlobalHeaderRoot .mobile-menu-btn{left:12px!important}\n  #atoGlobalHeaderRoot .ato-mobile-search-trigger{width:36px!important;height:36px!important;margin-left:auto!important}\n  #atoGlobalHeaderRoot .language{font-size:12px!important;gap:4px!important}\n  #atoGlobalHeaderRoot .globe-icon{width:18px!important;height:18px!important}\n}\n@media(prefers-reduced-motion:reduce){#atoGlobalHeaderRoot .promo-track{animation:none!important;transform:none!important}}\n\n\n/* ===== ATO WORKING HEADER PATCH ===== */\n.header .logo{ text-decoration:none; }\n.header .ato-header-dropdown{ position:relative; }\n.header .ato-dropdown-trigger{\n  appearance:none;\n  -webkit-appearance:none;\n  border:0;\n  background:transparent;\n  padding:0;\n  margin:0;\n  display:inline-flex;\n  align-items:center;\n  justify-content:center;\n  gap:6px;\n  color:inherit;\n  font:inherit;\n  font-weight:inherit;\n  letter-spacing:inherit;\n  cursor:pointer;\n}\n.header .ato-dropdown-trigger .arrow-icon{ transition:transform .22s ease; }\n.header .ato-header-dropdown.open .ato-dropdown-trigger .arrow-icon{ transform:rotate(180deg); }\n.header .ato-header-dropdown > .dropdown-menu{\n  pointer-events:none;\n}\n.header .ato-header-dropdown:hover > .dropdown-menu,\n.header .ato-header-dropdown:focus-within > .dropdown-menu,\n.header .ato-header-dropdown.open > .dropdown-menu{\n  opacity:1;\n  visibility:visible;\n  pointer-events:auto;\n}\n.header .ato-tours-menu{ width:330px; }\n.header .ato-about-menu{ width:340px; }\n.header .ato-menu-group{\n  margin:4px 0;\n  padding:7px;\n  border-radius:16px;\n  background:rgba(255,255,255,.035);\n  border:1px solid rgba(255,255,255,.05);\n}\n.header .ato-menu-group-label{\n  display:flex;\n  align-items:center;\n  gap:12px;\n  padding:9px 9px 7px;\n  color:#f3c66d;\n  font-size:12px;\n  font-weight:900;\n  letter-spacing:.35px;\n}\n.header .dropdown-menu .ato-subitem{\n  margin-left:25px;\n  padding:10px 12px;\n  font-size:13px;\n  font-weight:750;\n  color:#eef3fb;\n  border-left:1px solid rgba(243,198,109,.28);\n  border-radius:0 12px 12px 0;\n}\n.header .dropdown-menu .ato-subitem:hover{\n  border-left-color:#f3c66d;\n  background:rgba(243,198,109,.08);\n  color:#f3c66d;\n}\n\n@media (max-width:980px){\n  .header .ato-header-dropdown{ width:100%; }\n  .header .ato-dropdown-trigger{\n    width:100%;\n    justify-content:space-between;\n    min-height:44px;\n    text-align:left;\n  }\n  .header .ato-header-dropdown > .dropdown-menu{\n    position:static !important;\n    inset:auto !important;\n    transform:none !important;\n    width:100% !important;\n    max-width:none !important;\n    margin:7px 0 5px !important;\n    display:none !important;\n    opacity:1 !important;\n    visibility:visible !important;\n    pointer-events:auto !important;\n    box-shadow:none !important;\n  }\n  .header .ato-header-dropdown.open > .dropdown-menu{\n    display:block !important;\n  }\n  .header .ato-header-dropdown:hover > .dropdown-menu:not(:focus-within){\n    /* touch devices open only by explicit tap */\n  }\n  .header .ato-menu-group{ margin:3px 0; }\n  .header .dropdown-menu .ato-subitem{ margin-left:18px; }\n}\n\n\n/* =============== ATO HEADER SMART SEARCH \u00b7 Apple \u00d7 ZARA \u00d7 Nike =============== */\n:root{--ato-hs-gold:#f3c66d;--ato-hs-gold2:#d7a64a;--ato-hs-bg:#071522;--ato-hs-bg2:#0a1c2d;--ato-hs-line:rgba(243,198,109,.22);--ato-hs-text:#f7f8fb;--ato-hs-muted:#8ea0b5}\n.header{isolation:isolate}\n.header .ato-search-trigger{appearance:none;-webkit-appearance:none;position:relative;border:0;background:transparent;color:inherit;font:inherit;display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:38px;cursor:pointer;white-space:nowrap;padding:0 1px;transition:color .22s ease}\n.header .ato-search-trigger::after{content:\"\";position:absolute;left:0;right:0;bottom:3px;height:1px;background:linear-gradient(90deg,transparent,#d7a64a 18%,#f3c66d 50%,#d7a64a 82%,transparent);transform:scaleX(1);transform-origin:center;opacity:.72;box-shadow:0 0 0 rgba(243,198,109,0);transition:opacity .22s ease,box-shadow .25s ease}\n.header .ato-search-trigger:hover::after,.header .ato-search-trigger:focus-visible::after,.header .ato-search-trigger[aria-expanded=\"true\"]::after{transform:scaleX(1);opacity:1;box-shadow:0 0 7px rgba(243,198,109,.38)}\n.header .ato-search-trigger:focus-visible{outline:0;color:#071522}\n.header .ato-search-trigger-label{display:block;color:#0a1b30!important;line-height:1;font-family:Arial,sans-serif!important;font-weight:400!important;letter-spacing:.055em;text-shadow:none!important;-webkit-text-stroke:0!important}\n.header .ato-search-trigger-icon,.ato-mobile-search-trigger svg,.ato-hs-search-icon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}\n.header .ato-search-trigger-icon{width:16px;height:16px;flex:0 0 16px;color:#c99327;transition:transform .25s ease,color .22s ease,filter .25s ease}.header .ato-search-trigger:hover .ato-search-trigger-icon,.header .ato-search-trigger:focus-visible .ato-search-trigger-icon,.header .ato-search-trigger[aria-expanded=\"true\"] .ato-search-trigger-icon{color:#e2ad3d;transform:translateX(1px) scale(1.06);filter:drop-shadow(0 0 6px rgba(243,198,109,.32))}\n.ato-mobile-search-trigger{display:none;appearance:none;border:0;background:transparent;color:#f3c66d;width:42px;height:42px;align-items:center;justify-content:center;cursor:pointer}\n.ato-header-search-shell{position:fixed;z-index:100520;left:var(--ato-hs-left,260px);right:var(--ato-hs-right,120px);top:var(--ato-hs-top,12px);opacity:0;visibility:hidden;pointer-events:none;transform:translateY(-4px) scaleX(.965);transform-origin:center;transition:opacity .22s ease,transform .36s cubic-bezier(.16,1,.3,1),visibility .22s}\n.header.ato-search-active .ato-header-search-shell{opacity:1;visibility:visible;pointer-events:auto;transform:translateY(0) scaleX(1)}\n.header.ato-search-active .nav{opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:translateY(-4px)!important;transition:opacity .18s ease,transform .24s ease,visibility .18s!important}\n.ato-hs-bar{height:52px;display:grid;grid-template-columns:24px minmax(0,1fr) auto 42px;gap:10px;align-items:center;padding:0 7px 0 17px;border:1px solid rgba(243,198,109,.42);border-radius:16px;background:linear-gradient(180deg,rgba(8,24,39,.985),rgba(5,17,29,.99));box-shadow:0 14px 42px rgba(0,0,0,.34),inset 0 1px rgba(255,255,255,.04)}\n.ato-hs-search-icon{display:flex;color:var(--ato-hs-gold)}\n#atoHeaderSmartSearch{width:100%;height:48px;border:0!important;outline:0!important;background:transparent!important;color:#fff!important;font:700 15px/1.2 Arial,sans-serif;letter-spacing:.005em;box-shadow:none!important;padding:0!important}\n#atoHeaderSmartSearch::placeholder{color:#8394a8;opacity:1;font-weight:600}\n.ato-hs-filters{height:34px;display:inline-flex;align-items:center;gap:7px;padding:0 11px;border:1px solid rgba(243,198,109,.24);border-radius:999px;background:rgba(243,198,109,.045);color:#dce4ed;font:900 9px/1 Arial,sans-serif;letter-spacing:.08em;cursor:pointer;transition:.2s ease}\n.ato-hs-filters:hover{border-color:rgba(243,198,109,.62);color:#f4d174;background:rgba(243,198,109,.08)}.ato-hs-filters b{min-width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;background:var(--ato-hs-gold);color:#061522;font-size:9px}.ato-hs-filters b:empty{display:none}\n.ato-hs-close{width:38px;height:38px;border:0;border-radius:50%;background:rgba(255,255,255,.045);color:#fff;font:400 25px/1 Arial,sans-serif;cursor:pointer;transition:.2s ease}.ato-hs-close:hover{background:rgba(243,198,109,.10);color:#f3c66d;transform:rotate(5deg)}\n.ato-hs-panel{position:absolute;left:0;right:0;top:calc(100% + 9px);max-height:min(68vh,650px);overflow:auto;padding:19px;border:1px solid rgba(243,198,109,.22);border-radius:18px;background:linear-gradient(180deg,rgba(7,21,34,.995),rgba(4,15,26,.997));box-shadow:0 30px 85px rgba(0,0,0,.62),inset 0 1px rgba(255,255,255,.035);scrollbar-width:thin;scrollbar-color:rgba(243,198,109,.28) transparent}\n.ato-header-search-scrim{position:fixed;z-index:100490;left:0;right:0;top:var(--ato-hs-scrim-top,76px);bottom:0;opacity:0;visibility:hidden;pointer-events:none;background:linear-gradient(180deg,rgba(1,7,13,.38),rgba(1,7,13,.70));backdrop-filter:blur(4px);transition:.22s ease}.ato-header-search-scrim.open{opacity:1;visibility:visible;pointer-events:auto}\n.ato-hs-section+.ato-hs-section{margin-top:20px;padding-top:17px;border-top:1px solid rgba(255,255,255,.055)}\n.ato-hs-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:11px;color:#8ea0b5;font:900 9px/1.2 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase}.ato-hs-heading strong{color:#f3c66d;font-size:9px}\n.ato-hs-chips{display:flex;flex-wrap:wrap;gap:8px}.ato-hs-chip{appearance:none;border:1px solid rgba(255,255,255,.095);border-radius:999px;background:rgba(255,255,255,.025);color:#e6ebf2;padding:9px 12px;font:800 10px/1 Arial,sans-serif;cursor:pointer;display:inline-flex;align-items:center;gap:7px;transition:.2s ease}.ato-hs-chip:hover,.ato-hs-chip.is-active{border-color:rgba(243,198,109,.62);color:#f3cf78;background:rgba(243,198,109,.07);transform:translateY(-1px)}\n.ato-hs-chip svg{width:14px;height:14px;fill:none;stroke:#f3c66d;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}\n.ato-hs-quick-actions{display:flex;align-items:center;gap:9px;margin-top:18px;padding-top:15px;border-top:1px solid rgba(255,255,255,.055)}.ato-hs-all,.ato-hs-open-filters,.ato-hs-view-all{appearance:none;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:37px;padding:9px 13px;border-radius:10px;font:900 9px/1 Arial,sans-serif;letter-spacing:.075em;text-transform:uppercase;cursor:pointer;transition:.2s ease}.ato-hs-all{border:1px solid rgba(255,255,255,.10);background:transparent;color:#dce4ed}.ato-hs-open-filters,.ato-hs-view-all{border:1px solid rgba(243,198,109,.42);background:linear-gradient(135deg,rgba(243,198,109,.14),rgba(243,198,109,.035));color:#f4d174}.ato-hs-all:hover,.ato-hs-open-filters:hover,.ato-hs-view-all:hover{border-color:#e7bd62;transform:translateY(-1px)}.ato-hs-view-all{margin-left:auto}\n.ato-hs-results{display:grid;gap:7px}.ato-hs-result{display:grid;grid-template-columns:62px minmax(0,1fr) auto;gap:12px;align-items:center;min-height:68px;padding:7px;border:1px solid transparent;border-radius:13px;background:rgba(255,255,255,.018);transition:.2s ease}.ato-hs-result:hover{border-color:rgba(243,198,109,.20);background:rgba(255,255,255,.032)}\n.ato-hs-thumb{width:62px;height:54px;border-radius:9px;overflow:hidden;background:#102235}.ato-hs-thumb img{width:100%;height:100%;object-fit:cover;display:block}.ato-hs-result-copy{min-width:0}.ato-hs-result-name{display:block;color:#f8fafc;text-decoration:none;font:900 12px/1.2 Arial,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ato-hs-result-meta{margin-top:5px;color:#8799ad;font:700 9px/1.25 Arial,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ato-hs-result-meta b{color:#e9c56e}\n.ato-hs-result-actions{display:flex;align-items:center;gap:7px}.ato-hs-compare,.ato-hs-view{appearance:none;text-decoration:none;min-height:31px;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;font:900 8px/1 Arial,sans-serif;letter-spacing:.055em;text-transform:uppercase;white-space:nowrap}.ato-hs-compare{padding:0 9px;border:1px solid rgba(243,198,109,.32);background:rgba(243,198,109,.045);color:#f1ce79}.ato-hs-compare:hover,.ato-hs-compare.is-added{background:rgba(14,114,91,.40);border-color:rgba(89,218,174,.55);color:#dff8ed}.ato-hs-view{width:34px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.025);color:#fff;font-size:15px}.ato-hs-view:hover{border-color:rgba(243,198,109,.48);color:#f3c66d}\n.ato-hs-groups{display:grid;grid-template-columns:1fr 1fr;gap:13px;margin-top:16px}.ato-hs-group{padding:12px;border:1px solid rgba(255,255,255,.055);border-radius:12px;background:rgba(255,255,255,.015)}.ato-hs-group .ato-hs-heading{margin-bottom:8px}.ato-hs-group-links{display:flex;flex-wrap:wrap;gap:6px}.ato-hs-group-link{appearance:none;border:0;background:transparent;color:#cdd6e0;font:800 9px/1.25 Arial,sans-serif;padding:5px 0;margin-right:12px;cursor:pointer;text-align:left}.ato-hs-group-link:hover{color:#f3c66d}\n.ato-hs-empty{padding:24px 10px;text-align:center;color:#8ea0b5}.ato-hs-empty strong{display:block;color:#eef3f8;font-size:14px;margin-bottom:6px}.ato-hs-safety{margin:0 0 13px;padding:11px 12px;border:1px solid rgba(243,198,109,.25);border-radius:11px;background:rgba(243,198,109,.045);color:#cfd9e4;font:700 9px/1.45 Arial,sans-serif}.ato-hs-safety b{color:#f3c66d}\nbody.ato-header-search-open{overflow-x:hidden}\n@media(max-width:1180px) and (min-width:981px){.ato-hs-filters-label{display:none}.ato-hs-bar{grid-template-columns:24px minmax(0,1fr) auto 42px}.ato-hs-result{grid-template-columns:56px minmax(0,1fr) auto}.ato-hs-compare{padding:0 7px}}\n@media(max-width:980px){\n  #headerTourSearch{display:none!important}.ato-mobile-search-trigger{display:inline-flex;position:relative;z-index:20;margin-left:auto}.language{margin-left:0!important}\n  .ato-header-search-shell{inset:0!important;z-index:100600!important;background:linear-gradient(180deg,#071522,#04101b);transform:translateY(10px)!important;padding:14px 14px calc(18px + env(safe-area-inset-bottom));overflow:auto}.header.ato-search-active .ato-header-search-shell{transform:translateY(0)!important}.header.ato-search-active .nav{opacity:1!important;visibility:visible!important;transform:none!important}\n  .ato-hs-bar{position:sticky;top:0;z-index:4;height:54px;grid-template-columns:22px minmax(0,1fr) auto 42px;border-radius:15px;background:rgba(7,21,34,.98)}\n  .ato-hs-panel{position:static;max-height:none;overflow:visible;margin-top:12px;padding:16px 4px 8px;border:0;background:transparent;box-shadow:none}.ato-header-search-scrim{display:none}\n  .ato-hs-results{gap:9px}.ato-hs-result{grid-template-columns:64px minmax(0,1fr);padding:8px;background:rgba(255,255,255,.025);border-color:rgba(255,255,255,.045)}.ato-hs-thumb{width:64px;height:58px}.ato-hs-result-actions{grid-column:1/-1;justify-content:flex-end;margin-top:-2px}.ato-hs-compare{min-height:34px}.ato-hs-view{width:40px;min-height:34px}.ato-hs-groups{grid-template-columns:1fr}.ato-hs-view-all{margin-left:0}.ato-hs-quick-actions{flex-wrap:wrap}.ato-hs-all,.ato-hs-open-filters,.ato-hs-view-all{flex:1 1 auto}.ato-hs-heading{font-size:8.5px}\n}\n@media(max-width:520px){.ato-hs-filters-label{display:none}.ato-hs-filters{padding:0 8px}.ato-hs-bar{grid-template-columns:20px minmax(0,1fr) auto 40px;gap:7px;padding-left:12px}#atoHeaderSmartSearch{font-size:13px}.ato-hs-chip{padding:9px 10px;font-size:9px}.ato-hs-result-name{font-size:11px}.ato-hs-result-meta{font-size:8.5px}}\n@media(prefers-reduced-motion:reduce){.ato-header-search-shell,.ato-header-search-scrim,.header .nav,.ato-hs-chip,.ato-hs-close{transition:none!important}}\n\n\n/* V4.5 \u2014 keep SMART HEADER SEARCH live results above the page scrim.\n   The scrim darkens only page content, never the search panel. */\n.header.ato-search-active{\n  z-index:100700!important;\n}\n.header.ato-search-active .ato-header-search-shell{\n  z-index:100760!important;\n}\n.header.ato-search-active .ato-hs-bar{\n  position:relative;\n  z-index:100780!important;\n}\n.header.ato-search-active .ato-hs-panel{\n  z-index:100770!important;\n  opacity:1!important;\n  filter:none!important;\n  -webkit-filter:none!important;\n  backdrop-filter:none!important;\n  -webkit-backdrop-filter:none!important;\n}\n.ato-header-search-scrim{\n  z-index:100400!important;\n  /* Keep the premium dimming, but do not optically blur content that may overlap. */\n  backdrop-filter:none!important;\n  -webkit-backdrop-filter:none!important;\n  background:linear-gradient(180deg,rgba(1,7,13,.48),rgba(1,7,13,.76))!important;\n}\n@media(max-width:980px){\n  .header.ato-search-active{z-index:100800!important}\n  .header.ato-search-active .ato-header-search-shell{z-index:100820!important}\n}\n\n\n/* Final override: keep SEARCH visibly thin and navy despite global nav rules. */\nhtml body .header #headerTourSearch.ato-search-trigger{\n  color:#0b2948!important;\n  font-family:\"Segoe UI Light\",\"Segoe UI\",Arial,sans-serif!important;\n  font-weight:300!important;\n}\nhtml body .header #headerTourSearch .ato-search-trigger-label{\n  color:#0b2948!important;\n  font-family:\"Segoe UI Light\",\"Segoe UI\",Arial,sans-serif!important;\n  font-size:16px!important;\n  font-style:normal!important;\n  font-weight:300!important;\n  letter-spacing:.07em!important;\n  text-shadow:none!important;\n  -webkit-text-stroke:0 transparent!important;\n}\n\n/* ==========================================================\n   ATO MOBILE HEADER UX FIX — MOBILE ONLY\n   Desktop remains unchanged.\n   ========================================================== */\n@media(max-width:980px){\n  body.ato-mobile-header-modal-open{\n    overflow:hidden!important;\n  }\n\n  /* Keep the page inactive while the mobile nav or language panel is open. */\n  #atoGlobalHeaderRoot .mobile-overlay{\n    display:block!important;\n    position:fixed!important;\n    top:84px!important;\n    right:0!important;\n    bottom:0!important;\n    left:0!important;\n    background:rgba(1,8,16,.62)!important;\n    backdrop-filter:blur(7px)!important;\n    -webkit-backdrop-filter:blur(7px)!important;\n    opacity:0!important;\n    visibility:hidden!important;\n    pointer-events:none!important;\n    z-index:99990!important;\n  }\n  #atoGlobalHeaderRoot .mobile-overlay.active{\n    opacity:1!important;\n    visibility:visible!important;\n    pointer-events:auto!important;\n  }\n\n  /* Search lives in the mobile header as a clean gold loupe. */\n  #atoGlobalHeaderRoot .ato-mobile-search-trigger{\n    display:inline-flex!important;\n    align-items:center!important;\n    justify-content:center!important;\n    flex:0 0 38px!important;\n    width:38px!important;\n    height:38px!important;\n    min-width:38px!important;\n    min-height:38px!important;\n    margin-left:auto!important;\n    margin-right:2px!important;\n    padding:0!important;\n    border:0!important;\n    background:transparent!important;\n    color:#d7a83e!important;\n    position:relative!important;\n    z-index:100003!important;\n  }\n  #atoGlobalHeaderRoot .ato-mobile-search-trigger svg{\n    width:20px!important;\n    height:20px!important;\n    stroke:#d7a83e!important;\n    stroke-width:1.45!important;\n    fill:none!important;\n  }\n\n  /* SEARCH is no longer duplicated inside the left drawer. */\n  #atoGlobalHeaderRoot .nav #headerTourSearch{\n    display:none!important;\n  }\n\n  /* Every visible item in the left mobile menu must be readable. */\n  #atoGlobalHeaderRoot .nav,\n  #atoGlobalHeaderRoot .nav .nav-item,\n  #atoGlobalHeaderRoot .nav .nav-item > span,\n  #atoGlobalHeaderRoot .nav .ato-dropdown-trigger,\n  #atoGlobalHeaderRoot .nav .ato-dropdown-trigger > span,\n  #atoGlobalHeaderRoot .nav a,\n  #atoGlobalHeaderRoot .nav a > span{\n    color:#fff!important;\n    opacity:1!important;\n  }\n  #atoGlobalHeaderRoot .nav .ato-dropdown-trigger .arrow-icon,\n  #atoGlobalHeaderRoot .nav .ato-dropdown-trigger .arrow-icon path{\n    stroke:#d7a83e!important;\n  }\n\n  /* Language panel: compact, readable, and above the inactive-page scrim. */\n  #atoGlobalHeaderRoot .language{\n    margin-left:0!important;\n    z-index:100004!important;\n  }\n  #atoGlobalHeaderRoot .language-menu{\n    top:92px!important;\n    right:12px!important;\n    left:auto!important;\n    width:min(82vw,300px)!important;\n    max-width:300px!important;\n    padding:14px 12px 12px!important;\n    border-radius:20px!important;\n    background:rgba(6,12,23,.985)!important;\n    border:1px solid rgba(215,168,62,.22)!important;\n    box-shadow:0 24px 70px rgba(0,0,0,.52)!important;\n    z-index:100005!important;\n  }\n  #atoGlobalHeaderRoot .language-menu a{\n    min-height:48px!important;\n    padding:12px 14px!important;\n    border-radius:13px!important;\n    color:#fff!important;\n    font-size:14px!important;\n  }\n  #atoGlobalHeaderRoot .language-close{\n    top:7px!important;\n    right:8px!important;\n    color:#fff!important;\n  }\n}\n\n@media(max-width:560px){\n  #atoGlobalHeaderRoot .ato-mobile-search-trigger{\n    flex-basis:36px!important;\n    width:36px!important;\n    height:36px!important;\n    min-width:36px!important;\n    min-height:36px!important;\n    margin-right:0!important;\n  }\n  #atoGlobalHeaderRoot .ato-mobile-search-trigger svg{\n    width:18px!important;\n    height:18px!important;\n  }\n  #atoGlobalHeaderRoot .language-menu{\n    width:min(84vw,290px)!important;\n    right:10px!important;\n  }\n}\n\n/* Dynamically tagged Assistant launcher — mobile only. */\n@media(max-width:980px){\n  .ato-mobile-assistant-arrow{\n    width:42px!important;\n    min-width:42px!important;\n    height:42px!important;\n    min-height:42px!important;\n    padding:0!important;\n    display:grid!important;\n    place-items:center!important;\n    border:0!important;\n    border-radius:50%!important;\n    background:transparent!important;\n    box-shadow:none!important;\n    color:#d7a83e!important;\n  }\n  .ato-mobile-assistant-arrow svg{\n    width:25px!important;\n    height:25px!important;\n    display:block!important;\n    fill:none!important;\n    stroke:#e1b553!important;\n    stroke-width:1.35!important;\n    stroke-linecap:round!important;\n    stroke-linejoin:round!important;\n    filter:drop-shadow(0 0 5px rgba(225,181,83,.18));\n  }\n}\n\n/* MOBILE SEARCH RESULTS — COMPARE MUST ALWAYS BE VISIBLE */\n@media(max-width:980px){\n  #atoGlobalHeaderRoot .ato-header-search-shell .ato-hs-result-actions{\n    grid-column:1/-1!important;\n    display:flex!important;\n    align-items:center!important;\n    justify-content:flex-end!important;\n    gap:8px!important;\n    width:100%!important;\n    min-width:0!important;\n    margin-top:2px!important;\n    visibility:visible!important;\n    opacity:1!important;\n  }\n\n  #atoGlobalHeaderRoot .ato-header-search-shell .ato-hs-compare{\n    display:inline-flex!important;\n    align-items:center!important;\n    justify-content:center!important;\n    visibility:visible!important;\n    opacity:1!important;\n    position:relative!important;\n    transform:none!important;\n    float:none!important;\n    width:auto!important;\n    min-width:104px!important;\n    max-width:none!important;\n    min-height:36px!important;\n    height:36px!important;\n    padding:0 13px!important;\n    margin:0!important;\n    border:1px solid rgba(224,182,83,.50)!important;\n    border-radius:999px!important;\n    background:rgba(224,182,83,.065)!important;\n    color:#f1cf7a!important;\n    font:800 9px/1 Arial,sans-serif!important;\n    letter-spacing:.065em!important;\n    text-transform:uppercase!important;\n    white-space:nowrap!important;\n    pointer-events:auto!important;\n    z-index:2!important;\n    box-sizing:border-box!important;\n  }\n\n  #atoGlobalHeaderRoot .ato-header-search-shell .ato-hs-compare.is-added{\n    border-color:rgba(89,218,174,.58)!important;\n    background:rgba(14,114,91,.38)!important;\n    color:#e2faef!important;\n  }\n\n  #atoGlobalHeaderRoot .ato-header-search-shell .ato-hs-view{\n    display:inline-flex!important;\n    visibility:visible!important;\n    opacity:1!important;\n    flex:0 0 40px!important;\n    width:40px!important;\n    min-width:40px!important;\n    height:36px!important;\n    min-height:36px!important;\n    margin:0!important;\n  }\n}\n\n@media(max-width:520px){\n  #atoGlobalHeaderRoot .ato-header-search-shell .ato-hs-result{\n    grid-template-columns:60px minmax(0,1fr)!important;\n  }\n  #atoGlobalHeaderRoot .ato-header-search-shell .ato-hs-compare{\n    min-width:98px!important;\n    min-height:34px!important;\n    height:34px!important;\n    padding:0 11px!important;\n    font-size:8.5px!important;\n  }\n  #atoGlobalHeaderRoot .ato-header-search-shell .ato-hs-view{\n    width:38px!important;\n    min-width:38px!important;\n    height:34px!important;\n    min-height:34px!important;\n  }\n}\n\n/* MOBILE NAV — every actual link must remain tappable above the scrim */\n@media(max-width:980px){\n  #atoGlobalHeaderRoot .nav{\n    pointer-events:auto!important;\n  }\n  #atoGlobalHeaderRoot .nav a[href],\n  #atoGlobalHeaderRoot .nav .dropdown-menu a[href]{\n    position:relative!important;\n    z-index:100002!important;\n    pointer-events:auto!important;\n    touch-action:manipulation!important;\n    -webkit-tap-highlight-color:transparent!important;\n  }\n}\n";
const atoDesktopFinalCss='\n\n/* ======================================================================\n   ATO DESKTOP FINAL HEADER DROPDOWN POLISH — 2026-08-19\n   Scope: desktop only (>=981px). Mobile header remains untouched.\n   ====================================================================== */\n@media (min-width:981px){\n  /* Dropdowns must always paint above the promo/auction ribbon. */\n  #atoGlobalHeaderRoot .header{\n    z-index:260!important;\n  }\n  #atoGlobalHeaderRoot .dropdown-menu,\n  #atoGlobalHeaderRoot .language-menu{\n    z-index:1400!important;\n  }\n\n  /* One premium typography system for TOURS / ABOUT US / LANGUAGES. */\n  #atoGlobalHeaderRoot .ato-tours-menu > a,\n  #atoGlobalHeaderRoot .ato-about-menu > a,\n  #atoGlobalHeaderRoot .ato-about-menu .ato-menu-group-label,\n  #atoGlobalHeaderRoot .ato-about-menu .ato-subitem,\n  #atoGlobalHeaderRoot .language-menu a,\n  #atoGlobalHeaderRoot .language-menu .ato-lang-code,\n  #atoGlobalHeaderRoot .language-menu .ato-lang-name,\n  #atoGlobalHeaderRoot .language-menu .ato-v8-lang-code,\n  #atoGlobalHeaderRoot .language-menu .ato-v8-lang-name{\n    font-family:Georgia,"Times New Roman",Times,serif!important;\n    font-style:normal!important;\n  }\n\n  #atoGlobalHeaderRoot .ato-tours-menu > a{\n    font-size:14.5px!important;\n    font-weight:500!important;\n    line-height:1.25!important;\n    letter-spacing:.018em!important;\n  }\n\n  #atoGlobalHeaderRoot .ato-about-menu > a{\n    font-size:14.5px!important;\n    font-weight:500!important;\n    line-height:1.28!important;\n    letter-spacing:.018em!important;\n  }\n\n  #atoGlobalHeaderRoot .ato-about-menu .ato-menu-group{\n    position:relative!important;\n    overflow:hidden!important;\n  }\n  #atoGlobalHeaderRoot .ato-about-menu .ato-menu-group-label{\n    font-size:12.5px!important;\n    font-weight:600!important;\n    line-height:1.25!important;\n    letter-spacing:.055em!important;\n  }\n  /* One continuous thin gold line for Legal Information + TÜRSAB. No dots. */\n  #atoGlobalHeaderRoot .ato-about-menu .ato-menu-group::before{\n    content:""!important;\n    position:absolute!important;\n    left:20px!important;\n    top:51px!important;\n    bottom:15px!important;\n    width:1px!important;\n    background:linear-gradient(180deg,rgba(243,198,109,.78),rgba(215,168,62,.36))!important;\n    box-shadow:0 0 5px rgba(243,198,109,.10)!important;\n    pointer-events:none!important;\n  }\n  #atoGlobalHeaderRoot .ato-about-menu .ato-subitem{\n    margin-left:30px!important;\n    padding:11px 12px!important;\n    border-left:0!important;\n    border-radius:0 12px 12px 0!important;\n    font-size:14px!important;\n    font-weight:400!important;\n    line-height:1.28!important;\n    letter-spacing:.012em!important;\n    color:#f4f0e7!important;\n  }\n  #atoGlobalHeaderRoot .ato-about-menu .ato-subitem:hover{\n    border-left:0!important;\n  }\n\n  /* Languages: same typography, elegant hierarchy, En/Ru/Tr/De/Pl. */\n  #atoGlobalHeaderRoot .language-menu{\n    display:flex!important;\n    flex-direction:column!important;\n  }\n  #atoGlobalHeaderRoot .language-menu a{\n    font-size:15px!important;\n    font-weight:400!important;\n    line-height:1.25!important;\n    letter-spacing:.012em!important;\n  }\n  #atoGlobalHeaderRoot .language-menu .ato-lang-code,\n  #atoGlobalHeaderRoot .language-menu .ato-v8-lang-code{\n    min-width:30px!important;\n    font-size:17px!important;\n    font-weight:600!important;\n    letter-spacing:.01em!important;\n    color:#fff8ec!important;\n  }\n  #atoGlobalHeaderRoot .language-menu .ato-lang-name,\n  #atoGlobalHeaderRoot .language-menu .ato-v8-lang-name{\n    font-size:15px!important;\n    font-weight:400!important;\n    letter-spacing:.01em!important;\n    color:rgba(255,248,236,.82)!important;\n  }\n  #atoGlobalHeaderRoot .language-menu a[data-lang="en"]{order:1!important}\n  #atoGlobalHeaderRoot .language-menu a[data-lang="ru"]{order:2!important}\n  #atoGlobalHeaderRoot .language-menu a[data-lang="tr"]{order:3!important}\n  #atoGlobalHeaderRoot .language-menu a[data-lang="de"]{order:4!important}\n  #atoGlobalHeaderRoot .language-menu a[data-lang="pl"]{order:5!important}\n}\n';
const style=document.createElement('style');style.id='ato-global-header-style';style.textContent=css+atoDesktopFinalCss;document.head.appendChild(style);
const atoHeaderGridBridgeStyle=document.createElement('style');atoHeaderGridBridgeStyle.id='ato-header-grid-bridge-v3';atoHeaderGridBridgeStyle.textContent="\n/* ======================================================================\n   ATO HEADER GRID BRIDGE V3 — 2026-08-19\n   Preserve the approved original TOURS / ABOUT US visual language.\n   Only separate symbol/code from text, and apply that same language to SPECIAL OFFERS.\n   ====================================================================== */\n@media (min-width:981px){\n  /* One original typography system everywhere — no Segoe/bold override. */\n  #atoGlobalHeaderRoot .ato-tours-menu > a,\n  #atoGlobalHeaderRoot .ato-special-menu > a,\n  #atoGlobalHeaderRoot .ato-about-menu > a,\n  #atoGlobalHeaderRoot .ato-about-menu .ato-menu-group-label,\n  #atoGlobalHeaderRoot .ato-about-menu .ato-subitem,\n  #atoGlobalHeaderRoot .language-menu a,\n  #atoGlobalHeaderRoot .language-menu .ato-lang-code,\n  #atoGlobalHeaderRoot .language-menu .ato-lang-name,\n  #atoGlobalHeaderRoot .language-menu .ato-v8-lang-code,\n  #atoGlobalHeaderRoot .language-menu .ato-v8-lang-name{\n    font-family:Georgia,\"Times New Roman\",Times,serif!important;\n    font-style:normal!important;\n  }\n\n  #atoGlobalHeaderRoot .ato-special-menu{width:320px!important}\n  #atoGlobalHeaderRoot .ato-special-menu > a{\n    font-size:14.5px!important;\n    font-weight:500!important;\n    line-height:1.25!important;\n    letter-spacing:.018em!important;\n  }\n\n  /* Exactly one row: original symbol | thin line | one text label. */\n  #atoGlobalHeaderRoot .ato-tours-menu > a.ato-grid-row,\n  #atoGlobalHeaderRoot .ato-special-menu > a.ato-grid-row,\n  #atoGlobalHeaderRoot .ato-about-menu > a.ato-grid-row,\n  #atoGlobalHeaderRoot .ato-about-menu .ato-menu-group-label.ato-grid-row{\n    display:grid!important;\n    grid-template-columns:38px minmax(0,1fr)!important;\n    align-items:center!important;\n    column-gap:0!important;\n  }\n  #atoGlobalHeaderRoot .ato-grid-symbol{\n    grid-column:1!important;\n    width:100%!important;\n    min-width:0!important;\n    height:24px!important;\n    margin:0!important;\n    padding:0 11px 0 0!important;\n    display:flex!important;\n    align-items:center!important;\n    justify-content:center!important;\n    border-right:1px solid rgba(215,168,62,.34)!important;\n    box-sizing:border-box!important;\n  }\n  #atoGlobalHeaderRoot .ato-grid-label{\n    grid-column:2!important;\n    min-width:0!important;\n    padding-left:13px!important;\n    color:inherit!important;\n    font:inherit!important;\n    letter-spacing:inherit!important;\n  }\n\n  /* Keep all original TOURS SVG artwork exactly as supplied. */\n  #atoGlobalHeaderRoot .ato-tours-menu .ato-grid-symbol.ato-dropdown-svg-icon,\n  #atoGlobalHeaderRoot .ato-special-menu .ato-grid-symbol.ato-dropdown-svg-icon{\n    color:#f3c66d!important;\n  }\n  #atoGlobalHeaderRoot .ato-tours-menu .ato-grid-symbol .ato-cat-svg,\n  #atoGlobalHeaderRoot .ato-special-menu .ato-grid-symbol .ato-cat-svg{\n    width:18px!important;height:18px!important;fill:none!important;stroke:currentColor!important;\n    stroke-width:1.8!important;stroke-linecap:round!important;stroke-linejoin:round!important;\n  }\n\n  /* ABOUT US stays structurally identical to the approved screenshot. */\n  #atoGlobalHeaderRoot .ato-about-menu .ato-menu-group::before{\n    display:block!important;\n  }\n  #atoGlobalHeaderRoot .ato-about-menu .ato-subitem{\n    display:block!important;\n  }\n\n  /* Languages: code | divider | native language name. Existing globe remains untouched. */\n  #atoGlobalHeaderRoot .language-menu a[data-lang]{\n    display:grid!important;\n    grid-template-columns:42px minmax(0,1fr)!important;\n    align-items:center!important;\n    gap:0!important;\n  }\n  #atoGlobalHeaderRoot .language-menu .ato-lang-code,\n  #atoGlobalHeaderRoot .language-menu .ato-v8-lang-code{\n    width:100%!important;\n    min-width:0!important;\n    padding-right:11px!important;\n    text-align:center!important;\n    border-right:1px solid rgba(215,168,62,.34)!important;\n    box-sizing:border-box!important;\n  }\n  #atoGlobalHeaderRoot .language-menu .ato-lang-name,\n  #atoGlobalHeaderRoot .language-menu .ato-v8-lang-name{\n    padding-left:13px!important;\n  }\n  #atoGlobalHeaderRoot .language-menu a.is-active{\n    background:rgba(215,168,62,.075)!important;\n    color:#f1c96f!important;\n  }\n}\n";document.head.appendChild(atoHeaderGridBridgeStyle);
const markup="<div data-ato-global-root=\"true\" id=\"atoGlobalHeaderRoot\">\n<header class=\"header ato-global-header\" data-ato-global=\"true\">\n<a aria-label=\"ALANYA TOUR ORGANIZATIONS — Home\" class=\"logo\" href=\"/index.html\">\n<img alt=\"ALANYA TOUR ORGANIZATIONS\" src=\"/logo.png\"/>\n<div class=\"logo-text\">\n<div class=\"logo-title\">ALANYA TOUR</div>\n<div class=\"logo-subtitle\">ORGANIZATIONS</div>\n</div>\n</a>\n<div class=\"mobile-menu-btn\" id=\"mobileMenuBtn\">\n<span></span>\n<span></span>\n<span></span>\n</div>\n<div class=\"mobile-overlay\" id=\"mobileOverlay\"></div>\n<nav aria-label=\"Main navigation\" class=\"nav\">\n<div class=\"nav-item nav-dropdown ato-header-dropdown\" data-header-dropdown=\"tours\">\n<button aria-expanded=\"false\" aria-haspopup=\"true\" class=\"ato-dropdown-trigger\" type=\"button\">\n<span>TOURS</span>\n<svg aria-hidden=\"true\" class=\"arrow-icon\" viewbox=\"0 0 24 24\"><path d=\"M7 10L12 15L17 10\"></path></svg>\n</button>\n<div class=\"dropdown-menu ato-tours-menu\" role=\"menu\">\n<a class=\"ato-grid-row\" href=\"/sea-experiences.html\" role=\"menuitem\"><span class=\"dropdown-icon ato-dropdown-svg-icon ato-grid-symbol\"><svg aria-hidden=\"true\" class=\"ato-cat-svg\" viewbox=\"0 0 24 24\"><path d=\"M3 18c2.2 0 2.2 1.5 4.4 1.5S9.6 18 11.8 18s2.2 1.5 4.4 1.5S18.4 18 20.6 18\"></path><path d=\"M12 4v10\"></path><path d=\"M12 5 6.5 12H12\"></path><path d=\"M12 6.5 17.5 12H12\"></path></svg></span><span class=\"ato-grid-label\">SEA EXPERIENCES</span></a>\n<a class=\"ato-grid-row\" href=\"/extreme-adventure.html\" role=\"menuitem\"><span class=\"dropdown-icon ato-dropdown-svg-icon ato-grid-symbol\"><svg aria-hidden=\"true\" class=\"ato-cat-svg\" viewbox=\"0 0 24 24\"><path d=\"M13.2 2 5.5 13h5.2L9.8 22 18.5 9.7h-5.3z\"></path></svg></span><span class=\"ato-grid-label\">EXTREME &amp; ADVENTURE</span></a>\n<a class=\"ato-grid-row\" href=\"/nature-adventures.html\" role=\"menuitem\"><span class=\"dropdown-icon ato-dropdown-svg-icon ato-grid-symbol\"><svg aria-hidden=\"true\" class=\"ato-cat-svg\" viewbox=\"0 0 24 24\"><path d=\"M5 20c4.5-1 8-4.5 10-9\"></path><path d=\"M7 14c-2.2-3.5.4-7.7 8.8-9-1 8-4.7 11.3-8.8 9Z\"></path><path d=\"M13 9c1.7.1 3.7.8 5.8 2.1-2 4.8-5.2 6.4-8.2 5\"></path></svg></span><span class=\"ato-grid-label\">NATURE &amp; ADVENTURE</span></a>\n<a class=\"ato-grid-row\" href=\"/history-culture.html\" role=\"menuitem\"><span class=\"dropdown-icon ato-dropdown-svg-icon ato-grid-symbol\"><svg aria-hidden=\"true\" class=\"ato-cat-svg\" viewbox=\"0 0 24 24\"><path d=\"m4 9 8-5 8 5\"></path><path d=\"M5 10h14\"></path><path d=\"M7 10v8M11 10v8M15 10v8M19 10v8\"></path><path d=\"M4 19h16M3 21h18\"></path></svg></span><span class=\"ato-grid-label\">HISTORY &amp; CULTURE</span></a>\n<a class=\"ato-grid-row\" href=\"/family-experiences.html\" role=\"menuitem\"><span class=\"dropdown-icon ato-dropdown-svg-icon ato-grid-symbol\"><svg aria-hidden=\"true\" class=\"ato-cat-svg\" viewbox=\"0 0 24 24\"><circle cx=\"8\" cy=\"8\" r=\"2.3\"></circle><circle cx=\"16\" cy=\"8\" r=\"2.3\"></circle><circle cx=\"12\" cy=\"13\" r=\"1.8\"></circle><path d=\"M3.5 19c.5-3.5 2.2-5.3 4.5-5.3 1.2 0 2.2.4 3 1.1M20.5 19c-.5-3.5-2.2-5.3-4.5-5.3-1.2 0-2.2.4-3 1.1\"></path><path d=\"M8.5 20c.4-2.6 1.6-4 3.5-4s3.1 1.4 3.5 4\"></path></svg></span><span class=\"ato-grid-label\">FAMILY EXPERIENCES</span></a>\n<a class=\"ato-grid-row\" href=\"/water-sports.html\" role=\"menuitem\"><span class=\"dropdown-icon ato-dropdown-svg-icon ato-grid-symbol\"><svg aria-hidden=\"true\" class=\"ato-cat-svg\" viewbox=\"0 0 24 24\"><path d=\"M3 8c2.2 0 2.2 1.5 4.4 1.5S9.6 8 11.8 8s2.2 1.5 4.4 1.5S18.4 8 20.6 8\"></path><path d=\"M3 13c2.2 0 2.2 1.5 4.4 1.5s2.2-1.5 4.4-1.5 2.2 1.5 4.4 1.5 2.2-1.5 4.4-1.5\"></path><path d=\"M3 18c2.2 0 2.2 1.5 4.4 1.5s2.2-1.5 4.4-1.5 2.2 1.5 4.4 1.5 2.2-1.5 4.4-1.5\"></path></svg></span><span class=\"ato-grid-label\">WATER SPORTS</span></a>\n<a class=\"ato-grid-row\" href=\"/air-experiences.html\" role=\"menuitem\"><span class=\"dropdown-icon ato-dropdown-svg-icon ato-grid-symbol\"><svg aria-hidden=\"true\" class=\"ato-cat-svg\" viewbox=\"0 0 24 24\"><path d=\"M4 9c2-4 5-6 8-6s6 2 8 6\"></path><path d=\"M4 9h16\"></path><path d=\"M4 9 10 16M20 9l-6 7\"></path><path d=\"M10 16h4l1 4h-6z\"></path></svg></span><span class=\"ato-grid-label\">AIR EXPERIENCES</span></a>\n<a class=\"ato-grid-row\" href=\"/wellness-relax.html\" role=\"menuitem\"><span class=\"dropdown-icon ato-dropdown-svg-icon ato-grid-symbol\"><svg aria-hidden=\"true\" class=\"ato-cat-svg\" viewbox=\"0 0 24 24\"><path d=\"M12 20c-4-2.5-6.5-5.8-6.5-9.2 2.9.2 5.1 1.4 6.5 3.5 1.4-2.1 3.6-3.3 6.5-3.5 0 3.4-2.5 6.7-6.5 9.2Z\"></path><path d=\"M12 14.3C9.8 11.7 9.8 8.8 12 5c2.2 3.8 2.2 6.7 0 9.3Z\"></path></svg></span><span class=\"ato-grid-label\">WELLNESS &amp; RELAX</span></a>\n</div>\n</div>\n<a class=\"nav-item\" href=\"/interactive-map/\">\n<span>EXPLORE MAP</span>\n</a>\n<a class=\"nav-item\" href=\"/trip-planner.html\" title=\"Compare tours and build your itinerary\">\n<span>TRIP PLANNER</span>\n</a>\n<a class=\"nav-item\" href=\"/combo-deals.html\" title=\"Ready-made tour combinations\">\n<span>COMBO DEALS</span>\n</a>\n<div class=\"nav-item special nav-dropdown ato-header-dropdown\" data-header-dropdown=\"offers\">\n<button aria-expanded=\"false\" aria-haspopup=\"true\" class=\"ato-dropdown-trigger\" type=\"button\">\n<span class=\"fire\">🔥</span><span class=\"ato-dropdown-title\">SPECIAL OFFERS</span>\n<svg aria-hidden=\"true\" class=\"arrow-icon\" viewbox=\"0 0 24 24\"><path d=\"M7 10L12 15L17 10\"></path></svg>\n</button>\n<div class=\"dropdown-menu ato-special-menu\" role=\"menu\">\n<a class=\"ato-grid-row\" data-offer-link=\"group\" href=\"/special-offers.html#special-privileges\" role=\"menuitem\">\n<span aria-hidden=\"true\" class=\"dropdown-icon ato-dropdown-svg-icon ato-grid-symbol\">\n<svg class=\"ato-cat-svg\" focusable=\"false\" viewbox=\"0 0 24 24\"><path d=\"M5 4h9l5 5-9 9-5-5z\"></path><path d=\"M13.5 6.5h.01\"></path><path d=\"M8 16.5 6.5 18A2.1 2.1 0 0 0 9.5 21l1.5-1.5\"></path></svg>\n</span><span class=\"ato-grid-label\">GROUP &amp; EVENT OFFERS</span>\n</a>\n<a class=\"ato-grid-row\" data-offer-link=\"journey\" href=\"/special-offers.html#journey\" role=\"menuitem\">\n<span aria-hidden=\"true\" class=\"dropdown-icon ato-dropdown-svg-icon ato-grid-symbol\">\n<svg class=\"ato-cat-svg\" focusable=\"false\" viewbox=\"0 0 24 24\"><path d=\"M20.8 5.8c-2.2-2.2-5.8-2.2-8 0L12 6.6l-.8-.8c-2.2-2.2-5.8-2.2-8 0s-2.2 5.8 0 8L12 22l8.8-8.2c2.2-2.2 2.2-5.8 0-8Z\"></path></svg>\n</span><span class=\"ato-grid-label\">SURPRISE JOURNEY</span>\n</a>\n<a class=\"ato-grid-row\" data-offer-link=\"gift\" href=\"/special-offers.html#gift\" role=\"menuitem\">\n<span aria-hidden=\"true\" class=\"dropdown-icon ato-dropdown-svg-icon ato-grid-symbol\">\n<svg class=\"ato-cat-svg\" focusable=\"false\" viewbox=\"0 0 24 24\"><path d=\"M4 10h16v10H4z\"></path><path d=\"M3 7h18v4H3z\"></path><path d=\"M12 7v13\"></path><path d=\"M12 7c-2.8 0-4.5-.9-4.5-2.3C7.5 3.6 8.4 3 9.4 3c1.5 0 2.6 1.4 2.6 4Z\"></path><path d=\"M12 7c2.8 0 4.5-.9 4.5-2.3 0-1.1-.9-1.7-1.9-1.7C13.1 3 12 4.4 12 7Z\"></path></svg>\n</span><span class=\"ato-grid-label\">GIFT CERTIFICATE</span>\n</a>\n</div>\n</div>\n<a class=\"nav-item\" href=\"/vip-service.html\">\n<span>VIP SERVICE</span>\n</a>\n<div class=\"nav-item nav-dropdown ato-header-dropdown\" data-header-dropdown=\"about\">\n<button aria-expanded=\"false\" aria-haspopup=\"true\" class=\"ato-dropdown-trigger\" type=\"button\">\n<span>ABOUT US</span>\n<svg aria-hidden=\"true\" class=\"arrow-icon\" viewbox=\"0 0 24 24\"><path d=\"M7 10L12 15L17 10\"></path></svg>\n</button>\n<div class=\"dropdown-menu ato-about-menu\" role=\"menu\">\n<a class=\"ato-grid-row\" href=\"/index.html#about\" role=\"menuitem\"><span class=\"dropdown-icon ato-grid-symbol\">◆</span><span class=\"ato-grid-label\">OUR COMPANY</span></a>\n<div aria-label=\"Licenses and certifications\" class=\"ato-menu-group\">\n<div class=\"ato-menu-group-label ato-grid-row\"><span class=\"dropdown-icon ato-grid-symbol\">◇</span><span class=\"ato-grid-label\">LICENSES &amp; CERTIFICATIONS</span></div>\n<a class=\"ato-subitem\" href=\"/legal-information.html\" role=\"menuitem\">Legal Information</a>\n<a class=\"ato-subitem\" href=\"https://www.tursab.org.tr/acenta-arama\" rel=\"noopener\" role=\"menuitem\" target=\"_blank\" title=\"Official TÜRSAB agency search — verify Belge No 2156\">TÜRSAB Verification ↗</a>\n</div>\n<a class=\"ato-grid-row\" href=\"/contact.html\" role=\"menuitem\"><span class=\"dropdown-icon ato-grid-symbol\">◎</span><span class=\"ato-grid-label\">CONTACT / COMPANY DETAILS</span></a>\n</div>\n</div>\n<button aria-controls=\"atoHeaderSearchShell\" aria-expanded=\"false\" class=\"nav-item header-tour-search ato-search-trigger\" id=\"headerTourSearch\" type=\"button\">\n<span class=\"ato-search-trigger-label\">SEARCH</span>\n<svg aria-hidden=\"true\" class=\"ato-search-trigger-icon\" viewbox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"6.5\"></circle><path d=\"m16 16 4 4\"></path></svg>\n</button>\n</nav>\n<button aria-controls=\"atoHeaderSearchShell\" aria-expanded=\"false\" aria-label=\"Search tours\" class=\"ato-mobile-search-trigger\" id=\"atoMobileSearchTrigger\" type=\"button\">\n<svg aria-hidden=\"true\" viewbox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"6.5\"></circle><path d=\"m16 16 4 4\"></path></svg>\n</button>\n<div aria-hidden=\"true\" class=\"ato-header-search-shell\" id=\"atoHeaderSearchShell\">\n<div class=\"ato-hs-bar\">\n<span aria-hidden=\"true\" class=\"ato-hs-search-icon\"><svg viewbox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"6.5\"></circle><path d=\"m16 16 4 4\"></path></svg></span>\n<input aria-label=\"Search tours, places or experiences\" autocomplete=\"off\" id=\"atoHeaderSmartSearch\" placeholder=\"Search tours, places or experiences...\" spellcheck=\"false\" type=\"search\"/>\n<button class=\"ato-hs-filters\" id=\"atoHeaderFilters\" type=\"button\"><span class=\"ato-hs-filters-label\">FILTERS</span><b id=\"atoHeaderFilterCount\">0</b></button>\n<button aria-label=\"Close search\" class=\"ato-hs-close\" id=\"atoHeaderSearchClose\" type=\"button\">×</button>\n</div>\n<div aria-live=\"polite\" class=\"ato-hs-panel\" id=\"atoHeaderSearchPanel\" role=\"region\"></div>\n</div>\n<div class=\"language language-dropdown\">\n<svg class=\"globe-icon\" viewbox=\"0 0 24 24\">\n<circle cx=\"12\" cy=\"12\" r=\"9\"></circle>\n<path d=\"M3 12H21\"></path>\n<path d=\"M12 3C15 6 16.5 9 16.5 12C16.5 15 15 18 12 21\"></path>\n<path d=\"M12 3C9 6 7.5 9 7.5 12C7.5 15 9 18 12 21\"></path>\n</svg>\n<span>EN</span>\n<svg class=\"arrow-icon\" viewbox=\"0 0 24 24\">\n<path d=\"M7 10L12 15L17 10\"></path>\n</svg>\n<div class=\"language-menu\">\n<button aria-label=\"Close languages\" class=\"language-close\" type=\"button\">×</button>\n\n\n\n\n\n<a data-lang=\"en\" href=\"#\"><span class=\"ato-lang-code\">EN</span><span class=\"ato-lang-name\">English</span></a><a data-lang=\"ru\" href=\"#\"><span class=\"ato-lang-code\">RU</span><span class=\"ato-lang-name\">Русский</span></a><a data-lang=\"tr\" href=\"#\"><span class=\"ato-lang-code\">TR</span><span class=\"ato-lang-name\">Türkçe</span></a><a data-lang=\"de\" href=\"#\"><span class=\"ato-lang-code\">DE</span><span class=\"ato-lang-name\">Deutsch</span></a><a data-lang=\"pl\" href=\"#\"><span class=\"ato-lang-code\">PL</span><span class=\"ato-lang-name\">Polski</span></a></div>\n</div>\n</header>\n<div aria-hidden=\"true\" class=\"ato-header-search-scrim\" id=\"atoHeaderSearchScrim\"></div>\n<div aria-label=\"Special offers\" class=\"promo-bar ato-global-promo\" id=\"atoPromoRibbon\">\n<div class=\"promo-track\">\n<div class=\"promo-group\">\n<span class=\"promo-text\" data-de=\"🔥 SONDERANGEBOT — 2 TOUREN BUCHEN, DIE 3. GRATIS\" data-en=\"🔥 SPECIAL OFFER — BUY 2 TOURS, GET THE 3RD FREE\" data-pl=\"🔥 OFERTA SPECJALNA — KUP 2 WYCIECZKI, 3. GRATIS\" data-ru=\"🔥 СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ — 2 ТУРА + 3-Й В ПОДАРОК\" data-tr=\"🔥 ÖZEL TEKLİF — 2 TUR AL, 3. TUR HEDİYE\">\n        🔥 SPECIAL OFFER — BUY 2 TOURS, GET THE 3RD FREE\n      </span>\n<span aria-hidden=\"true\" class=\"promo-dot\">◆</span>\n<span class=\"promo-slogan\">TRAVEL WITH LOVE. TRAVEL WITH US.</span>\n<span aria-hidden=\"true\" class=\"promo-dot\">◆</span>\n<span class=\"promo-services\">PRIVATE TOURS • VIP TRANSFERS • FAMILY EXPERIENCES</span>\n<span aria-hidden=\"true\" class=\"promo-dot\">◆</span>\n</div>\n<div aria-hidden=\"true\" class=\"promo-group\">\n<span class=\"promo-text\" data-de=\"🔥 SONDERANGEBOT — 2 TOUREN BUCHEN, DIE 3. GRATIS\" data-en=\"🔥 SPECIAL OFFER — BUY 2 TOURS, GET THE 3RD FREE\" data-pl=\"🔥 OFERTA SPECJALNA — KUP 2 WYCIECZKI, 3. GRATIS\" data-ru=\"🔥 СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ — 2 ТУРА + 3-Й В ПОДАРОК\" data-tr=\"🔥 ÖZEL TEKLİF — 2 TUR AL, 3. TUR HEDİYE\">\n        🔥 SPECIAL OFFER — BUY 2 TOURS, GET THE 3RD FREE\n      </span>\n<span aria-hidden=\"true\" class=\"promo-dot\">◆</span>\n<span class=\"promo-slogan\">TRAVEL WITH LOVE. TRAVEL WITH US.</span>\n<span aria-hidden=\"true\" class=\"promo-dot\">◆</span>\n<span class=\"promo-services\">PRIVATE TOURS • VIP TRANSFERS • FAMILY EXPERIENCES</span>\n<span aria-hidden=\"true\" class=\"promo-dot\">◆</span>\n</div>\n</div>\n</div>\n</div>";
document.body.insertAdjacentHTML('afterbegin',markup);

const ATO_HEADER_LANG={
 en:{tours:'TOURS',sea:'SEA EXPERIENCES',extreme:'EXTREME & ADVENTURE',nature:'NATURE & ADVENTURE',history:'HISTORY & CULTURE',family:'FAMILY EXPERIENCES',water:'WATER SPORTS',air:'AIR EXPERIENCES',wellness:'WELLNESS & RELAX',map:'EXPLORE MAP',planner:'TRIP PLANNER',combo:'COMBO DEALS',offers:'SPECIAL OFFERS',groupOffers:'GROUP & EVENT OFFERS',surpriseJourney:'SURPRISE JOURNEY',giftCertificate:'GIFT CERTIFICATE',vip:'VIP SERVICE',about:'ABOUT US',company:'OUR COMPANY',licenses:'LICENSES & CERTIFICATIONS',legal:'Legal Information',verify:'TÜRSAB Verification ↗',contact:'CONTACT / COMPANY DETAILS',search:'SEARCH',ph:'Search tours, places or experiences...',filters:'FILTERS'},
 ru:{tours:'ТУРЫ',sea:'МОРСКИЕ ПРИКЛЮЧЕНИЯ',extreme:'ЭКСТРИМ И ПРИКЛЮЧЕНИЯ',nature:'ПРИРОДА И ПРИКЛЮЧЕНИЯ',history:'ИСТОРИЯ И КУЛЬТУРА',family:'СЕМЕЙНЫЙ ОТДЫХ',water:'ВОДНЫЕ ВИДЫ СПОРТА',air:'ВОЗДУШНЫЕ ПРИКЛЮЧЕНИЯ',wellness:'ВЕЛНЕС И ОТДЫХ',map:'ИЗУЧИТЬ КАРТУ',planner:'ПЛАНИРОВЩИК ПОЕЗДКИ',combo:'КОМБО-ПРЕДЛОЖЕНИЯ',offers:'СПЕЦИАЛЬНЫЕ ПРЕДЛОЖЕНИЯ',groupOffers:'ГРУППЫ И МЕРОПРИЯТИЯ',surpriseJourney:'ПУТЕШЕСТВИЕ-СЮРПРИЗ',giftCertificate:'ПОДАРОЧНЫЙ СЕРТИФИКАТ',vip:'VIP-СЕРВИС',about:'О НАС',company:'О КОМПАНИИ',licenses:'ЛИЦЕНЗИИ И СЕРТИФИКАТЫ',legal:'Юридическая информация',verify:'Проверить TÜRSAB ↗',contact:'КОНТАКТЫ / ДАННЫЕ КОМПАНИИ',search:'ПОИСК',ph:'Поиск туров, мест или впечатлений...',filters:'ФИЛЬТРЫ'},
 tr:{tours:'TURLAR',sea:'DENİZ DENEYİMLERİ',extreme:'EKSTREM & MACERA',nature:'DOĞA & MACERA',history:'TARİH & KÜLTÜR',family:'AİLE DENEYİMLERİ',water:'SU SPORLARI',air:'HAVA DENEYİMLERİ',wellness:'WELLNESS & RAHATLAMA',map:'HARİTAYI KEŞFET',planner:'SEYAHAT PLANLAYICI',combo:'KOMBO FIRSATLAR',offers:'ÖZEL FIRSATLAR',groupOffers:'GRUP & ETKİNLİK TEKLİFLERİ',surpriseJourney:'SÜRPRİZ YOLCULUK',giftCertificate:'HEDİYE SERTİFİKASI',vip:'VIP HİZMET',about:'HAKKIMIZDA',company:'ŞİRKETİMİZ',licenses:'LİSANSLAR & SERTİFİKALAR',legal:'Yasal Bilgiler',verify:'TÜRSAB Doğrulama ↗',contact:'İLETİŞİM / ŞİRKET BİLGİLERİ',search:'ARA',ph:'Tur, yer veya deneyim ara...',filters:'FİLTRELER'},
 de:{tours:'TOUREN',sea:'MEERESERLEBNISSE',extreme:'EXTREM & ABENTEUER',nature:'NATUR & ABENTEUER',history:'GESCHICHTE & KULTUR',family:'FAMILIENERLEBNISSE',water:'WASSERSPORT',air:'LUFTERLEBNISSE',wellness:'WELLNESS & ENTSPANNUNG',map:'KARTE ENTDECKEN',planner:'REISEPLANER',combo:'KOMBI-ANGEBOTE',offers:'SONDERANGEBOTE',groupOffers:'GRUPPEN- & EVENTANGEBOTE',surpriseJourney:'ÜBERRASCHUNGSREISE',giftCertificate:'GESCHENKGUTSCHEIN',vip:'VIP-SERVICE',about:'ÜBER UNS',company:'UNSER UNTERNEHMEN',licenses:'LIZENZEN & ZERTIFIKATE',legal:'Rechtliche Informationen',verify:'TÜRSAB prüfen ↗',contact:'KONTAKT / FIRMENDATEN',search:'SUCHE',ph:'Touren, Orte oder Erlebnisse suchen...',filters:'FILTER'},
 pl:{tours:'WYCIECZKI',sea:'MORSKIE PRZYGODY',extreme:'EKSTREMALNE PRZYGODY',nature:'NATURA I PRZYGODA',history:'HISTORIA I KULTURA',family:'RODZINNE ATRAKCJE',water:'SPORTY WODNE',air:'PRZYGODY W POWIETRZU',wellness:'WELLNESS I RELAKS',map:'ODKRYJ MAPĘ',planner:'PLANER PODRÓŻY',combo:'PAKIETY COMBO',offers:'OFERTY SPECJALNE',groupOffers:'OFERTY GRUPOWE I EVENTOWE',surpriseJourney:'PODRÓŻ-NIESPODZIANKA',giftCertificate:'BON PODARUNKOWY',vip:'USŁUGI VIP',about:'O NAS',company:'O FIRMIE',licenses:'LICENCJE I CERTYFIKATY',legal:'Informacje prawne',verify:'Weryfikacja TÜRSAB ↗',contact:'KONTAKT / DANE FIRMY',search:'SZUKAJ',ph:'Szukaj wycieczek, miejsc lub atrakcji...',filters:'FILTRY'}
};
function atoHeaderLanguage(){const x=localStorage.getItem('atoLanguage')||document.documentElement.lang||'en';return ATO_HEADER_LANG[x]?x:'en'}
function atoSetDirectText(el,text){if(!el)return;const label=el.querySelector?.('.ato-grid-label');if(label){label.textContent=text;return;}[...el.childNodes].filter(n=>n.nodeType===3).forEach(n=>n.remove());el.append(document.createTextNode(text))}
function atoApplyHeaderLanguage(lang=atoHeaderLanguage()){
 const t=ATO_HEADER_LANG[lang]||ATO_HEADER_LANG.en;
 const q=s=>document.querySelector('#atoGlobalHeaderRoot '+s);
 q('[data-header-dropdown="tours"] .ato-dropdown-trigger span').textContent=t.tours;
 const tourLinks=[['.ato-tours-menu a:nth-child(1)',t.sea],['.ato-tours-menu a:nth-child(2)',t.extreme],['.ato-tours-menu a:nth-child(3)',t.nature],['.ato-tours-menu a:nth-child(4)',t.history],['.ato-tours-menu a:nth-child(5)',t.family],['.ato-tours-menu a:nth-child(6)',t.water],['.ato-tours-menu a:nth-child(7)',t.air],['.ato-tours-menu a:nth-child(8)',t.wellness]];
 tourLinks.forEach(([s,v])=>atoSetDirectText(q(s),v));
 q('.nav > a[href="/interactive-map/"] span').textContent=t.map;
 q('.nav > a[href="/trip-planner.html"] span').textContent=t.planner;
 q('.nav > a[href="/combo-deals.html"] span').textContent=t.combo;
 const offersTitle=q('[data-header-dropdown="offers"] .ato-dropdown-title');if(offersTitle)offersTitle.textContent=t.offers;
 atoSetDirectText(q('.ato-special-menu [data-offer-link="group"]'),t.groupOffers);
 atoSetDirectText(q('.ato-special-menu [data-offer-link="journey"]'),t.surpriseJourney);
 atoSetDirectText(q('.ato-special-menu [data-offer-link="gift"]'),t.giftCertificate);
 q('.nav > a[href="/vip-service.html"] span').textContent=t.vip;
 q('[data-header-dropdown="about"] .ato-dropdown-trigger span').textContent=t.about;
 atoSetDirectText(q('.ato-about-menu > a:first-child'),t.company);
 atoSetDirectText(q('.ato-menu-group-label'),t.licenses);
 q('.ato-about-menu .ato-subitem[href="/legal-information.html"]').textContent=t.legal;
 q('.ato-about-menu .ato-subitem[href*="tursab.org.tr"]').textContent=t.verify;
 atoSetDirectText(q('.ato-about-menu > a:last-child'),t.contact);
 q('#headerTourSearch .ato-search-trigger-label').textContent=t.search;
 q('#atoHeaderSmartSearch').placeholder=t.ph;
 q('#atoHeaderFilters .ato-hs-filters-label').textContent=t.filters;
 const label=q('.language-dropdown > span'); if(label)label.textContent=lang.toUpperCase();
 document.querySelectorAll('#atoGlobalHeaderRoot .language-menu a[data-lang]').forEach(a=>{const code=a.querySelector('.ato-lang-code,.ato-v8-lang-code');if(code)code.textContent=a.dataset.lang.toUpperCase();a.classList.toggle('is-active',a.dataset.lang===lang)});
 document.querySelectorAll('#atoGlobalHeaderRoot .promo-text').forEach(el=>{el.textContent=el.dataset[lang]||el.dataset.en||el.textContent});
}


function atoInitGlobalHeader(){
 const root=document.getElementById('atoGlobalHeaderRoot'); if(!root)return;
 const mobileBtn=root.querySelector('#mobileMenuBtn'),nav=root.querySelector('.nav'),overlay=root.querySelector('#mobileOverlay');
 const dropdowns=[...root.querySelectorAll('.ato-header-dropdown')],languageDropdown=root.querySelector('.language-dropdown'),languageClose=root.querySelector('.language-close');
 const isMobile=()=>window.innerWidth<=980;
 const setDropdown=(dd,on)=>{if(!dd)return;dd.classList.toggle('open',on);dd.querySelector('.ato-dropdown-trigger')?.setAttribute('aria-expanded',on?'true':'false')};
 const closeDropdowns=(except=null)=>dropdowns.forEach(dd=>{if(dd!==except)setDropdown(dd,false)});
 const syncMobileModal=()=>{
   if(!isMobile()) return;
   const on=!!(nav?.classList.contains('active')||languageDropdown?.classList.contains('open'));
   overlay?.classList.toggle('active',on);
   document.body.classList.toggle('ato-mobile-header-modal-open',on);
 };
 const setLanguage=on=>{
   if(!languageDropdown)return;
   languageDropdown.classList.toggle('open',!!on);
   syncMobileModal();
 };
 const setMenu=on=>{
   if(!mobileBtn||!nav||!overlay)return;
   nav.classList.toggle('active',!!on);
   mobileBtn.classList.toggle('active',!!on);
   mobileBtn.setAttribute('aria-expanded',on?'true':'false');
   if(!on)closeDropdowns();
   syncMobileModal();
 };
 const closeMobilePanels=()=>{
   if(!isMobile())return;
   nav?.classList.remove('active');
   mobileBtn?.classList.remove('active');
   mobileBtn?.setAttribute('aria-expanded','false');
   closeDropdowns();
   setLanguage(false);
   syncMobileModal();
 };
 if(mobileBtn&&nav&&overlay){
   mobileBtn.setAttribute('role','button');
   mobileBtn.setAttribute('tabindex','0');
   mobileBtn.setAttribute('aria-label','Open navigation');
   mobileBtn.setAttribute('aria-expanded','false');
   mobileBtn.addEventListener('click',()=>{
     const on=!nav.classList.contains('active');
     setLanguage(false);
     setMenu(on);
   });
   mobileBtn.addEventListener('keydown',e=>{
     if(e.key==='Enter'||e.key===' '){
       e.preventDefault();
       const on=!nav.classList.contains('active');
       setLanguage(false);
       setMenu(on);
     }
   });
   overlay.addEventListener('click',e=>{
     e.preventDefault();
     e.stopPropagation();
     closeMobilePanels();
   });
 }
 dropdowns.forEach(dd=>{
   const tr=dd.querySelector('.ato-dropdown-trigger');
   tr?.addEventListener('click',e=>{
     e.preventDefault();
     e.stopPropagation();
     e.stopImmediatePropagation();
     const on=!dd.classList.contains('open');
     closeDropdowns(dd);
     setLanguage(false);
     setDropdown(dd,on);
   },true);
 });
 languageDropdown?.addEventListener('click',e=>{
   if(e.target.closest('.language-menu a')||e.target.closest('.language-close'))return;
   if(isMobile()){
     e.preventDefault();
     e.stopPropagation();
     const on=!languageDropdown.classList.contains('open');
     setMenu(false);
     closeDropdowns();
     setLanguage(on);
   }
 });
 languageClose?.addEventListener('click',e=>{
   e.preventDefault();
   e.stopPropagation();
   setLanguage(false);
 });
 root.querySelectorAll('.language-menu a[data-lang]').forEach(a=>a.addEventListener('click',e=>{
   e.preventDefault();e.stopPropagation();
   const lang=a.dataset.lang;if(!ATO_HEADER_LANG[lang])return;
   localStorage.setItem('atoLanguage',lang);
   document.documentElement.lang=lang;
   atoApplyHeaderLanguage(lang);
   window.dispatchEvent(new CustomEvent('ato-language-changed',{detail:{lang}}));
   setLanguage(false);
   setMenu(false);
   setTimeout(()=>location.reload(),35);
 }));
 nav?.querySelectorAll('a[href]').forEach(a=>a.addEventListener('click',e=>{
   const href=a.getAttribute('href');
   const target=a.getAttribute('target');
   if(isMobile()&&href&&href!=='#'){
     e.preventDefault();
     e.stopPropagation();
     const url=new URL(href,location.href).href;
     closeMobilePanels();
     requestAnimationFrame(()=>{
       if(target==='_blank') window.open(url,'_blank','noopener');
       else location.assign(url);
     });
     return;
   }
   closeDropdowns();
   if(isMobile())closeMobilePanels();
 }));
 document.addEventListener('click',e=>{
   if(!e.target.closest('#atoGlobalHeaderRoot .ato-header-dropdown'))closeDropdowns();
   if(!e.target.closest('#atoGlobalHeaderRoot .language-dropdown'))setLanguage(false);
 });
 document.addEventListener('keydown',e=>{
   if(e.key==='Escape'){
     closeDropdowns();
     setLanguage(false);
     if(isMobile())closeMobilePanels();
   }
 });
 window.addEventListener('resize',()=>{
   if(!isMobile()){
     nav?.classList.remove('active');
     mobileBtn?.classList.remove('active');
     overlay?.classList.remove('active');
     document.body.classList.remove('ato-mobile-header-modal-open');
     setLanguage(false);
   }
   closeDropdowns();
   atoApplyHeaderLanguage();
 },{passive:true});
 // Current-page cue.
 const here=location.pathname.replace(/\/+$/,'')||'/index.html';
 root.querySelectorAll('a[href]').forEach(a=>{try{const p=new URL(a.href,location.href).pathname.replace(/\/+$/,'')||'/index.html';if(p===here)a.classList.add('is-current')}catch(_){}});
 atoApplyHeaderLanguage();
}
function atoInitPromoTone(){
 const root=document.getElementById('atoGlobalHeaderRoot'),promo=root?.querySelector('.promo-bar');if(!promo)return;
 const tone=()=>{const y=root.getBoundingClientRect().bottom+8;const el=document.elementFromPoint(Math.min(innerWidth-2,Math.max(2,innerWidth/2)),Math.min(innerHeight-2,Math.max(2,y)));const bg=el?getComputedStyle(el).backgroundColor:'';promo.style.setProperty('--ato-under-bg',bg||'transparent')};
 let raf=0;const q=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;tone()})};window.addEventListener('scroll',q,{passive:true});window.addEventListener('resize',q,{passive:true});tone();
}


function atoInitMobileAssistantPolish(){
 const isMobile=()=>window.innerWidth<=980;
 const arrowSvg='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 17.5 17.5 6.5"></path><path d="M10.5 6.5h7v7"></path></svg>';
 const restore=()=>{
   document.querySelectorAll('.ato-mobile-assistant-arrow').forEach(el=>{
     if(el.dataset.atoOriginalHtml!==undefined){
       el.innerHTML=el.dataset.atoOriginalHtml;
       delete el.dataset.atoOriginalHtml;
     }
     el.classList.remove('ato-mobile-assistant-arrow');
   });
 };
 const apply=()=>{
   if(!isMobile()){restore();return;}
   const all=[...document.querySelectorAll('body *')];
   const candidates=all.filter(el=>{
     const txt=(el.innerText||'').replace(/\s+/g,' ').trim().toUpperCase();
     if(!txt.includes('ASK SOMETHING')||!txt.includes('ASSISTANT'))return false;
     const r=el.getBoundingClientRect();
     return r.width>=180&&r.width<=520&&r.height>=45&&r.height<=190;
   }).sort((a,b)=>{
     const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect();
     return (ar.width*ar.height)-(br.width*br.height);
   });
   if(!candidates.length)return;
   let host=candidates[0];
   for(let i=0;i<6&&host.parentElement;i++){
     const p=host.parentElement,cs=getComputedStyle(p),r=p.getBoundingClientRect();
     if(cs.position==='fixed'&&r.width>=180&&r.width<=560){host=p;break;}
     if(r.width>650)break;
     host=p;
   }
   const hr=host.getBoundingClientRect();
   const controls=[...host.querySelectorAll('button,a')].filter(el=>{
     const r=el.getBoundingClientRect();
     return r.width>=24&&r.width<=80&&r.height>=24&&r.height<=80&&r.left>hr.left+hr.width*.52;
   }).sort((a,b)=>b.getBoundingClientRect().left-a.getBoundingClientRect().left);
   const btn=controls[0];
   if(!btn||btn.classList.contains('ato-mobile-assistant-arrow'))return;
   btn.dataset.atoOriginalHtml=btn.innerHTML;
   btn.innerHTML=arrowSvg;
   btn.classList.add('ato-mobile-assistant-arrow');
 };
 let raf=0;
 const queue=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(apply)};
 const mo=new MutationObserver(queue);
 mo.observe(document.body,{childList:true,subtree:true});
 window.addEventListener('resize',queue,{passive:true});
 queue();
}

atoInitGlobalHeader();
atoInitPromoTone();
/* V6: replaced by atoInitMobileV6Fixes() */
// Approved INDEX smart search:

(function(){
'use strict';
const header=document.querySelector('.header'), shell=document.getElementById('atoHeaderSearchShell'), panel=document.getElementById('atoHeaderSearchPanel'), input=document.getElementById('atoHeaderSmartSearch'), trigger=document.getElementById('headerTourSearch'), mobileTrigger=document.getElementById('atoMobileSearchTrigger'), closeBtn=document.getElementById('atoHeaderSearchClose'), scrim=document.getElementById('atoHeaderSearchScrim'), filtersBtn=document.getElementById('atoHeaderFilters'), filterCount=document.getElementById('atoHeaderFilterCount');
if(!header||!shell||!panel||!input)return;
let openState=false, category='', timer=0;
const norm=s=>String(s||'').toLocaleLowerCase('en').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[ıİ]/g,'i').replace(/[^a-zа-яёçğıöşüäöüßąćęłńóśźż0-9€+&]+/gi,' ').replace(/\s+/g,' ').trim();
const I18N={
 en:{ph:'Search tours, places or experiences...',trending:'Trending',explore:'Explore by',tours:'Tours',destinations:'Destinations',categories:'Categories',filters:'Filters',all:'All tours',viewAll:'View all results',compare:'＋ Compare',added:'✓ Added',no:'No exact matches',noText:'Try another word or open Filters for a wider selection.',safety:'This request needs tour-specific confirmation. We do not automatically label an experience as suitable without verified data.',verified:'Safety-sensitive search',popular:['Cappadocia','Rafting','Boat Trips','Land of Legends','Paragliding','With Children','From Alanya']},
 ru:{ph:'Поиск туров, мест или впечатлений...',trending:'Популярные запросы',explore:'Выбрать по категории',tours:'Туры',destinations:'Направления',categories:'Категории',filters:'Фильтры',all:'Все туры',viewAll:'Все результаты',compare:'＋ Сравнить',added:'✓ Добавлено',no:'Точного совпадения нет',noText:'Попробуйте другой запрос или откройте фильтры для более широкой выборки.',safety:'Для этого запроса требуется подтверждение по конкретному туру. Мы не отмечаем тур как подходящий без проверенных данных.',verified:'Запрос, связанный с безопасностью',popular:['Каппадокия','Рафтинг','Морские туры','Land of Legends','Параглайдинг','С детьми','Из Алании']},
 tr:{ph:'Tur, yer veya deneyim ara...',trending:'Popüler aramalar',explore:'Kategoriye göre keşfet',tours:'Turlar',destinations:'Destinasyonlar',categories:'Kategoriler',filters:'Filtreler',all:'Tüm turlar',viewAll:'Tüm sonuçları gör',compare:'＋ Karşılaştır',added:'✓ Eklendi',no:'Tam eşleşme yok',noText:'Başka bir kelime deneyin veya daha geniş seçim için Filtreler’i açın.',safety:'Bu arama tur bazında doğrulama gerektirir. Doğrulanmış veri olmadan bir deneyimi otomatik olarak uygun göstermiyoruz.',verified:'Güvenlik hassasiyeti olan arama',popular:['Kapadokya','Rafting','Tekne Turları','Land of Legends','Yamaç Paraşütü','Çocuklarla','Alanya’dan']},
 de:{ph:'Touren, Orte oder Erlebnisse suchen...',trending:'Beliebte Suchen',explore:'Nach Kategorie',tours:'Touren',destinations:'Reiseziele',categories:'Kategorien',filters:'Filter',all:'Alle Touren',viewAll:'Alle Ergebnisse',compare:'＋ Vergleichen',added:'✓ Hinzugefügt',no:'Keine exakte Übereinstimmung',noText:'Versuchen Sie einen anderen Begriff oder öffnen Sie Filter für eine größere Auswahl.',safety:'Diese Suche erfordert eine tourbezogene Bestätigung. Ohne verifizierte Daten markieren wir keine Tour automatisch als geeignet.',verified:'Sicherheitsrelevante Suche',popular:['Kappadokien','Rafting','Bootstouren','Land of Legends','Paragliding','Mit Kindern','Ab Alanya']},
 pl:{ph:'Szukaj wycieczek, miejsc lub atrakcji...',trending:'Popularne wyszukiwania',explore:'Odkrywaj według kategorii',tours:'Wycieczki',destinations:'Kierunki',categories:'Kategorie',filters:'Filtry',all:'Wszystkie wycieczki',viewAll:'Zobacz wszystkie wyniki',compare:'＋ Porównaj',added:'✓ Dodano',no:'Brak dokładnych wyników',noText:'Spróbuj innego hasła lub otwórz Filtry, aby poszerzyć wybór.',safety:'To wyszukiwanie wymaga potwierdzenia dla konkretnej wycieczki. Bez zweryfikowanych danych nie oznaczamy atrakcji automatycznie jako odpowiedniej.',verified:'Wyszukiwanie dotyczące bezpieczeństwa',popular:['Kapadocja','Rafting','Rejsy','Land of Legends','Paralotnia','Z dziećmi','Z Alanyi']}
};
const CAT=[
 ['Sea Experiences','sea'],['Extreme & Adventure','adventure'],['Family Experiences','family'],['History & Culture','history'],['Air Experiences','air'],['Wellness & Relax','wellness'],['VIP Service','vip']
];
const CAT_LABEL={
 en:{'Sea Experiences':'Sea','Extreme & Adventure':'Adventure','Family Experiences':'Family','History & Culture':'History','Air Experiences':'Air','Wellness & Relax':'Wellness','VIP Service':'VIP'},
 ru:{'Sea Experiences':'Море','Extreme & Adventure':'Приключения','Family Experiences':'Семья','History & Culture':'История','Air Experiences':'Воздух','Wellness & Relax':'Wellness','VIP Service':'VIP'},
 tr:{'Sea Experiences':'Deniz','Extreme & Adventure':'Macera','Family Experiences':'Aile','History & Culture':'Tarih','Air Experiences':'Hava','Wellness & Relax':'Wellness','VIP Service':'VIP'},
 de:{'Sea Experiences':'Meer','Extreme & Adventure':'Abenteuer','Family Experiences':'Familie','History & Culture':'Kultur','Air Experiences':'Luft','Wellness & Relax':'Wellness','VIP Service':'VIP'},
 pl:{'Sea Experiences':'Morze','Extreme & Adventure':'Przygoda','Family Experiences':'Rodzina','History & Culture':'Historia','Air Experiences':'Powietrze','Wellness & Relax':'Wellness','VIP Service':'VIP'}
};
function lang(){const x=localStorage.getItem('atoLanguage')||document.documentElement.lang||'en';return I18N[x]?x:'en'}
function L(){return I18N[lang()]}
function catSvg(kind){const p={
 sea:'<path d="M3 18c2.2 0 2.2 1.5 4.4 1.5S9.6 18 11.8 18s2.2 1.5 4.4 1.5S18.4 18 20.6 18"/><path d="M12 4v10M12 5 6.5 12H12M12 6.5 17.5 12H12"/>',
 adventure:'<path d="M13.2 2 5.5 13h5.2L9.8 22 18.5 9.7h-5.3z"/>',
 family:'<circle cx="8" cy="8" r="2.3"/><circle cx="16" cy="8" r="2.3"/><path d="M3.5 19c.5-3.5 2.2-5.3 4.5-5.3M20.5 19c-.5-3.5-2.2-5.3-4.5-5.3"/>',
 history:'<path d="m4 9 8-5 8 5M5 10h14M7 10v8M12 10v8M17 10v8M4 19h16"/>',
 air:'<path d="M4 9c2-4 5-6 8-6s6 2 8 6M4 9h16M4 9l6 7M20 9l-6 7M10 16h4l1 4H9z"/>',
 wellness:'<path d="M12 20c-4-2.5-6.5-5.8-6.5-9.2 2.9.2 5.1 1.4 6.5 3.5 1.4-2.1 3.6-3.3 6.5-3.5 0 3.4-2.5 6.7-6.5 9.2Z"/><path d="M12 14.3C9.8 11.7 9.8 8.8 12 5c2.2 3.8 2.2 6.7 0 9.3Z"/>',
 vip:'<path d="m3 7 4 10h10l4-10-5 4-4-6-4 6-5-4ZM7 20h10"/>'};return `<svg viewBox="0 0 24 24" aria-hidden="true">${p[kind]||p.adventure}</svg>`}
function data(){return window.AlanyaTourFinder?.data||[]}
function activeFilters(){return window.AlanyaTourFinder?.activeFilterCount?.()||0}
function updateFilterCount(){const n=activeFilters();filterCount.textContent=n;filterCount.style.display=n?'inline-flex':'none'}
function position(){if(innerWidth<=980)return;const r=header.getBoundingClientRect(),logo=header.querySelector('.logo')?.getBoundingClientRect(),lg=header.querySelector('.language')?.getBoundingClientRect();const left=Math.max(r.left+170,(logo?.right||r.left+180)+20);const right=Math.max(innerWidth-r.right+12,innerWidth-(lg?.left||r.right-100)+14);shell.style.setProperty('--ato-hs-left',left+'px');shell.style.setProperty('--ato-hs-right',right+'px');shell.style.setProperty('--ato-hs-top',(r.top+Math.max(6,(r.height-52)/2))+'px');document.documentElement.style.setProperty('--ato-hs-scrim-top',(r.bottom+1)+'px')}
function selectedPool(){try{return window.ATOTripPlannerPool?.get?.()||JSON.parse(localStorage.getItem('atoTripPlannerPool')||'[]')}catch(e){return[]}}
function normalizeHref(href){try{return new URL(href,location.href).pathname.split('/').filter(Boolean).pop()||''}catch(e){return String(href||'').split('/').pop()}}
function isAdded(url){return selectedPool().includes(normalizeHref(url))}
function toggleCompare(url){if(window.ATOTripPlannerPool?.toggle){window.ATOTripPlannerPool.toggle(url)}else{try{let a=JSON.parse(localStorage.getItem('atoTripPlannerPool')||'[]');const h=normalizeHref(url),i=a.indexOf(h);if(i>=0)a.splice(i,1);else if(a.length<8)a.push(h);localStorage.setItem('atoTripPlannerPool',JSON.stringify(a))}catch(e){}}render()}
const special={cheap:/\b(cheap|budget|low price|дешев|недорог|ucuz|gunstig|günstig|tani)\b/i,full:/\b(full day|all day|весь день|целый день|tam gun|tam gün|ganztag|caly dzien|cały dzień)\b/i,sunset:/\b(sunset|закат|gun bat|gün bat|sonnenuntergang|zachod)\b/i,children:/\b(children|child|kids|with children|ребен|дети|с детьми|cocuk|çocuk|kinder|dzieci)\b/i,fromAlanya:/\b(from alanya|из алании|alanya dan|alanya'dan|ab alanya|z alanyi)\b/i,toddler:/\b(2 year old|2-year-old|toddler|2 года|2 лет|2 yas|2 yaş|2 jahr|2 lata)\b/i};
function safetyIntent(q){return /pregnan|pregnancy|беремен|hamile|schwanger|ciaz|ciąż|no swimming|без плаван|без купан|yuzme yok|yüzme yok|ohne schwimmen|bez plywania|bez pływania/i.test(q)}
function smartMatch(t,q){let n=norm(q);if(!n)return true;if(special.cheap.test(q)){if(!(t.price!=null&&t.price<=35))return false;n=n.replace(/cheap|budget|low price|дешев\w*|недорог\w*|ucuz|gunstig|günstig|tani/g,' ')}if(special.full.test(q)){if(t.durationType!=='full')return false;n=n.replace(/full day|all day|весь день|целый день|tam gun|tam gün|ganztag|caly dzien|cały dzień/g,' ')}if(special.sunset.test(q)){if(!(t._time==='sunset'||t._search?.includes('sunset')))return false;n=n.replace(/sunset|закат|gun bat|gün bat|sonnenuntergang|zachod/g,' ')}if(special.children.test(q)){if(!((t.tags||[]).some(x=>['kids','family'].includes(x))||t._allAges))return false;n=n.replace(/children|child|kids|with children|ребен\w*|дети|с детьми|cocuk|çocuk|kinder|dzieci/g,' ')}if(special.fromAlanya.test(q)){if(!norm(t.destination).includes('alanya')&&!t._search?.includes('alanya'))return false;n=n.replace(/from alanya|из алании|alanya dan|alanya d an|ab alanya|z alanyi/g,' ')}if(special.toddler.test(q)){if(!t._allAges)return false;n=n.replace(/2 year old|2 year old|toddler|2 года|2 лет|2 yas|2 yaş|2 jahr|2 lata/g,' ')}const words=n.split(/\s+/).filter(Boolean);return words.every(w=>{const aliases={cappadocia:['cappadocia','kapadokya','каппадокия','kappadokien','kapadocja'],boat:['boat','yacht','tekne','yat','лодка','яхта','boot','rejs'],spa:['spa','wellness','hammam','hamam','massage','хамам','массаж','masaj'],dolphin:['dolphin','дельфин','yunus','delfin'],canyon:['canyon','каньон','kanyon','kanion'],istanbul:['istanbul','стамбул','stambul']};const a=aliases[w]||[w];return a.some(x=>(t._search||'').includes(norm(x)))})}
function score(t,q){const n=norm(q);let s=100-(t.rank||100);if(n&&norm(t.name).startsWith(n))s+=90;else if(n&&norm(t.name).includes(n))s+=55;if(n&&norm(t.destination).includes(n))s+=30;if(t.price!=null)s+=3;if(t.image)s+=2;return s}
function currentResults(){const q=input.value.trim();let arr;if(window.AlanyaTourFinder?.preview){const opts={q:''};if(category)opts.category=category;arr=window.AlanyaTourFinder.preview(opts)}else arr=data();arr=arr.filter(t=>smartMatch(t,q));return arr.sort((a,b)=>score(b,q)-score(a,q))}
function tourRow(t){const l=L(),added=isAdded(t.url);const fallback={'Sea Experiences':'sea.jpg','Extreme & Adventure':'extreme.jpg','Nature & Adventure':'nature.jpg','History & Culture':'history.jpg','Family Experiences':'family.jpg','Air Experiences':'air.jpg','Water Sports':'watersports.jpg','Wellness & Relax':'wellness.jpg','VIP Service':'sea.jpg','Combo Deals':'family.jpg'}[t.category]||'sea.jpg';return `<div class="ato-hs-result"><a class="ato-hs-thumb" href="${t.url}"><img src="${t.image||fallback}" alt="${String(t.name).replace(/"/g,'&quot;')}" loading="lazy" onerror="this.onerror=null;this.src='${fallback}'"></a><div class="ato-hs-result-copy"><a class="ato-hs-result-name" href="${t.url}">${t.name}</a><div class="ato-hs-result-meta">${t.category} · ${t.duration||''} · <b>${t.priceLabel||'On request'}</b></div></div><div class="ato-hs-result-actions"><button class="ato-hs-compare${added?' is-added':''}" type="button" data-ato-hs-compare="${t.url}" aria-pressed="${added?'true':'false'}">${added?l.added:l.compare}</button><a class="ato-hs-view" href="${t.url}" aria-label="View ${String(t.name).replace(/"/g,'&quot;')}">→</a></div></div>`}
function landing(){const l=L();return `<section class="ato-hs-section"><div class="ato-hs-heading"><span>${l.trending}</span></div><div class="ato-hs-chips">${l.popular.map(x=>`<button class="ato-hs-chip" type="button" data-ato-hs-query="${x.replace(/"/g,'&quot;')}">${x}</button>`).join('')}</div></section><section class="ato-hs-section"><div class="ato-hs-heading"><span>${l.explore}</span></div><div class="ato-hs-chips">${CAT.map(([c,k])=>`<button class="ato-hs-chip${category===c?' is-active':''}" type="button" data-ato-hs-category="${c}">${catSvg(k)}${CAT_LABEL[lang()][c]}</button>`).join('')}</div></section><div class="ato-hs-quick-actions"><button class="ato-hs-all" type="button" data-ato-hs-all>${l.all}</button><button class="ato-hs-open-filters" type="button" data-ato-hs-filters>${l.filters}${activeFilters()?` · ${activeFilters()}`:''}</button></div>`}
function results(){const l=L(),q=input.value.trim(),arr=currentResults(),top=arr.slice(0,5),dests=[...new Set(arr.map(t=>t.destination).filter(Boolean))].slice(0,5),cats=[...new Set(arr.map(t=>t.category).filter(Boolean))].slice(0,5);const safe=safetyIntent(q)?`<div class="ato-hs-safety"><b>${l.verified}.</b> ${l.safety}</div>`:'';if(!top.length)return safe+`<div class="ato-hs-empty"><strong>${l.no}</strong><span>${l.noText}</span></div><div class="ato-hs-quick-actions"><button class="ato-hs-open-filters" type="button" data-ato-hs-filters>${l.filters}</button></div>`;return safe+`<section class="ato-hs-section"><div class="ato-hs-heading"><span>${l.tours}</span><strong>${arr.length}</strong></div><div class="ato-hs-results">${top.map(tourRow).join('')}</div></section><div class="ato-hs-groups"><section class="ato-hs-group"><div class="ato-hs-heading"><span>${l.destinations}</span></div><div class="ato-hs-group-links">${dests.map(x=>`<button class="ato-hs-group-link" type="button" data-ato-hs-query="${x}">${x}</button>`).join('')}</div></section><section class="ato-hs-group"><div class="ato-hs-heading"><span>${l.categories}</span></div><div class="ato-hs-group-links">${cats.map(x=>`<button class="ato-hs-group-link" type="button" data-ato-hs-category="${x}">${x}</button>`).join('')}</div></section></div><div class="ato-hs-quick-actions"><button class="ato-hs-all" type="button" data-ato-hs-all>${l.all}</button><button class="ato-hs-open-filters" type="button" data-ato-hs-filters>${l.filters}${activeFilters()?` · ${activeFilters()}`:''}</button><button class="ato-hs-view-all" type="button" data-ato-hs-view-all>${l.viewAll} →</button></div>`}
function render(){input.placeholder=L().ph;filtersBtn.querySelector('.ato-hs-filters-label').textContent=L().filters;updateFilterCount();panel.innerHTML=(input.value.trim()||category)?results():landing()}
function open(){if(openState)return;openState=true;position();header.classList.add('ato-search-active');document.body.classList.add('ato-header-search-open');shell.setAttribute('aria-hidden','false');trigger?.setAttribute('aria-expanded','true');mobileTrigger?.setAttribute('aria-expanded','true');scrim?.classList.add('open');setTimeout(()=>input.focus(),90);render()}
function close(){if(!openState)return;openState=false;header.classList.remove('ato-search-active');document.body.classList.remove('ato-header-search-open');shell.setAttribute('aria-hidden','true');trigger?.setAttribute('aria-expanded','false');mobileTrigger?.setAttribute('aria-expanded','false');scrim?.classList.remove('open');category=''}
function openFull(clearCategory=false){const q=input.value.trim(),cat=clearCategory?'':category,opts={q};if(clearCategory||category)opts.category=cat;close();if(window.AlanyaTourFinder?.openWith)window.AlanyaTourFinder.openWith(opts);else location.href=`/?finder=1&q=${encodeURIComponent(q)}${cat?`&cat=${encodeURIComponent(cat)}`:''}`} 
trigger?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();open()});mobileTrigger?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();document.querySelector('.nav')?.classList.remove('active');document.getElementById('mobileMenuBtn')?.classList.remove('active');document.getElementById('mobileOverlay')?.classList.remove('active');document.querySelector('.language-dropdown')?.classList.remove('open');document.body.classList.remove('ato-mobile-header-modal-open');open()});closeBtn?.addEventListener('click',close);scrim?.addEventListener('click',close);filtersBtn?.addEventListener('click',()=>openFull(false));
input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(render,55)});input.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close()}if(e.key==='Enter'){e.preventDefault();openFull(false)}});
panel.addEventListener('click',e=>{const q=e.target.closest('[data-ato-hs-query]');if(q){input.value=q.dataset.atoHsQuery||'';category='';render();input.focus();return}const c=e.target.closest('[data-ato-hs-category]');if(c){category=c.dataset.atoHsCategory||'';input.value='';render();return}const cmp=e.target.closest('[data-ato-hs-compare]');if(cmp){e.preventDefault();e.stopPropagation();toggleCompare(cmp.dataset.atoHsCompare);return}if(e.target.closest('[data-ato-hs-filters],[data-ato-hs-view-all]')){openFull(false);return}if(e.target.closest('[data-ato-hs-all]')){category='';openFull(true);return}});
window.addEventListener('resize',position,{passive:true});window.addEventListener('scroll',()=>{if(openState)position()},{passive:true});window.addEventListener('ato-language-changed',()=>{render()});window.addEventListener('storage',e=>{if(e.key==='atoTripPlannerPool')render()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&openState)close();if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();open()}});
window.ATOHeaderSearch={open,close,render};
render();
})();

})();


/* ========================================================================
   ATO MOBILE V6 — 2026-08-19
   Runtime fixes requested from real iPhone screenshots.
   MOBILE ONLY. Desktop behavior is intentionally left untouched.
   ======================================================================== */
(function atoInitMobileV6Fixes(){
  'use strict';

  const MOBILE_MAX = 980;
  const POOL_KEY = 'atoTripPlannerPool';
  const MAX_POOL = 8;
  const isMobile = () => window.innerWidth <= MOBILE_MAX;
  const thinArrowSVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+
      '<path d="M6.5 17.5 17.5 6.5"></path>'+
      '<path d="M10.5 6.5h7v7"></path>'+
    '</svg>';

  const normalizeHref = (href) => {
    try {
      return new URL(href, location.href).pathname.split('/').filter(Boolean).pop() || '';
    } catch (_) {
      return String(href || '').split('?')[0].split('#')[0].split('/').pop() || '';
    }
  };

  const readPool = () => {
    try {
      const raw = JSON.parse(localStorage.getItem(POOL_KEY) || '[]');
      return [...new Set((Array.isArray(raw) ? raw : []).map(normalizeHref).filter(Boolean))].slice(0, MAX_POOL);
    } catch (_) {
      return [];
    }
  };

  const writePool = (pool) => {
    const clean = [...new Set(pool.map(normalizeHref).filter(Boolean))].slice(0, MAX_POOL);
    const value = JSON.stringify(clean);
    try { localStorage.setItem(POOL_KEY, value); } catch (_) {}
    try {
      window.dispatchEvent(new StorageEvent('storage', {
        key: POOL_KEY,
        newValue: value,
        storageArea: localStorage,
        url: location.href
      }));
    } catch (_) {
      try { window.dispatchEvent(new Event('storage')); } catch (_) {}
    }
    try {
      window.dispatchEvent(new CustomEvent('ato-trip-planner-pool-changed', {detail:{pool:clean}}));
      document.dispatchEvent(new CustomEvent('ato:trip-planner-change', {detail:{pool:clean}}));
    } catch (_) {}
    return clean;
  };

  /* 7 — Mobile drawer links: capture the tap before any overlay/bubble handler can eat it. */
  document.addEventListener('click', (e) => {
    if (!isMobile()) return;
    const target = e.target instanceof Element ? e.target : null;
    const a = target?.closest('#atoGlobalHeaderRoot .nav a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#') return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const url = new URL(href, location.href).href;
    if (a.getAttribute('target') === '_blank') {
      window.open(url, '_blank', 'noopener');
    } else {
      window.location.assign(url);
    }
  }, true);

  /* 6 — Language close is always a real ×, never an inherited arrow/icon. */
  const fixLanguageClose = () => {
    if (!isMobile()) return;
    const close = document.querySelector('#atoGlobalHeaderRoot .language-close');
    if (!close) return;
    close.textContent = '×';
    close.setAttribute('aria-label', 'Close languages');
    close.classList.add('ato-mobile-language-x');
  };

  /* 3 — Hero: remove the broken custom pseudo-arrow and keep exactly one clean gold arrow. */
  const fixHeroArrow = () => {
    const arrow = document.querySelector('#atoLivingHero .ato-living-hero__arrow');
    if (!arrow) return;
    if (isMobile()) {
      if (!arrow.dataset.atoOriginalHtml) arrow.dataset.atoOriginalHtml = arrow.innerHTML || '↗';
      arrow.textContent = '↗';
      arrow.classList.add('ato-mobile-hero-arrow-fixed');
    } else if (arrow.classList.contains('ato-mobile-hero-arrow-fixed')) {
      arrow.innerHTML = arrow.dataset.atoOriginalHtml || '↗';
      arrow.classList.remove('ato-mobile-hero-arrow-fixed');
    }
  };

  /* 2 — Popular Tours: replace any emoji/blue-square arrow with a thin SVG gold arrow.
         Also make the link itself deterministic on iPhone. */
  const fixPopularViewAll = () => {
    if (!isMobile()) return;
    document.querySelectorAll('.popular-feature-card .view-all[href]').forEach(link => {
      link.classList.add('ato-mobile-viewall-fixed');
      if (!link.querySelector('.ato-mobile-viewall-arrow')) {
        const icon = document.createElement('span');
        icon.className = 'ato-mobile-viewall-arrow';
        icon.setAttribute('aria-hidden', 'true');
        icon.innerHTML = thinArrowSVG;
        link.appendChild(icon);
      }
      if (!link.dataset.atoMobileNavBound) {
        link.dataset.atoMobileNavBound = '1';
        link.addEventListener('click', e => {
          if (!isMobile()) return;
          const href = link.getAttribute('href');
          if (!href) return;
          e.preventDefault();
          e.stopPropagation();
          window.location.assign(new URL(href, location.href).href);
        }, true);
      }
    });
  };

  /* 5 — FULL Tour Finder results: add Compare next to VIEW TOUR.
         This is intentionally separate from header live-search Compare. */
  const syncFinderCompareButtons = () => {
    if (!isMobile()) return;
    const pool = readPool();

    document.querySelectorAll('.atf-card').forEach(card => {
      const actions = card.querySelector('.atf-card-actions');
      const view = actions?.querySelector('.atf-card-link[href]');
      if (!actions || !view) return;

      const href = view.getAttribute('href') || '';
      const key = normalizeHref(href);
      if (!key) return;

      let btn = actions.querySelector('.ato-mobile-atf-compare');
      if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ato-mobile-atf-compare';
        btn.dataset.tourHref = href;
        btn.setAttribute('aria-label', 'Compare this tour');
        actions.insertBefore(btn, view);

        btn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();

          const tourKey = normalizeHref(btn.dataset.tourHref);
          let next = readPool();
          const idx = next.indexOf(tourKey);

          if (idx >= 0) {
            next.splice(idx, 1);
          } else {
            if (next.length >= MAX_POOL) {
              btn.textContent = 'MAX 8';
              setTimeout(syncFinderCompareButtons, 750);
              return;
            }
            next.push(tourKey);
          }

          writePool(next);
          syncFinderCompareButtons();
          try { window.ATOHeaderSearch?.render?.(); } catch (_) {}
        });
      }

      const added = pool.includes(key);
      btn.classList.toggle('is-added', added);
      btn.setAttribute('aria-pressed', added ? 'true' : 'false');
      btn.textContent = added ? '✓ ADDED' : '＋ COMPARE';
    });
  };

  /* 1 — Türkiye map: preserve the exact map aspect ratio and provide a visible
         blue live-location point if iOS returns a position. */
  const applyUserLocation = (position) => {
    if (!isMobile() || !position?.coords) return;

    const root = document.getElementById('atoAboutLiveMap');
    const pin = document.getElementById('aboutUserMapPin');
    const label = document.getElementById('aboutUserLocationLabel');
    const coords = document.getElementById('aboutUserCoordinates');
    if (!root || !pin) return;

    const lat = Number(position.coords.latitude);
    const lon = Number(position.coords.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;

    const GEO = {
      minLon: 26.031096644168,
      maxLon: 44.82,
      maxLat: 42.11,
      minLat: 35.81,
      minX: 35,
      maxX: 965,
      minY: 93,
      maxY: 407
    };

    if (lon < GEO.minLon || lon > GEO.maxLon || lat < GEO.minLat || lat > GEO.maxLat) return;

    const x = GEO.minX + ((lon - GEO.minLon) / (GEO.maxLon - GEO.minLon)) * (GEO.maxX - GEO.minX);
    const y = GEO.minY + ((GEO.maxLat - lat) / (GEO.maxLat - GEO.minLat)) * (GEO.maxY - GEO.minY);

    pin.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
    pin.setAttribute('aria-hidden', 'false');
    pin.style.setProperty('display', 'block', 'important');
    pin.style.setProperty('visibility', 'visible', 'important');
    pin.style.setProperty('opacity', '1', 'important');

    const pulse = pin.querySelector('.about-user-pulse');
    const dot = pin.querySelector('.about-user-dot');
    const core = pin.querySelector('.about-user-core');
    pulse?.setAttribute('r', '17');
    dot?.setAttribute('r', '10');
    core?.setAttribute('r', '3.5');

    if (label) {
      label.style.left = `${(x / 1000) * 100}%`;
      label.style.top = `${(y / 500) * 100}%`;
      label.classList.add('is-visible');
    }
    if (coords) coords.textContent = `${lat.toFixed(5)}° N · ${lon.toFixed(5)}° E`;
    root.classList.add('geo-active', 'ato-mobile-geo-visible');
  };

  const fixMapAndGeo = () => {
    if (!isMobile()) return;
    const root = document.getElementById('atoAboutLiveMap');
    const svg = root?.querySelector('.final-turkiye-map');
    const button = document.getElementById('aboutGeoButton');
    if (!root || !svg) return;

    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    if (button && !button.dataset.atoV6GeoBound) {
      button.dataset.atoV6GeoBound = '1';
      button.addEventListener('click', () => {
        setTimeout(() => {
          if (!isMobile()) return;
          if (button.getAttribute('aria-pressed') !== 'true') return;
          if (!navigator.geolocation) return;
          navigator.geolocation.getCurrentPosition(
            applyUserLocation,
            () => {},
            {enableHighAccuracy:true, maximumAge:3000, timeout:12000}
          );
        }, 80);
      }, true);
    }
  };

  /* 3b — Assistant: find the actual right-side launcher control (button OR div/span)
          and replace the blue square icon with a thin gold SVG arrow. */
  const fixAssistantArrow = () => {
    if (!isMobile()) return;

    const nodes = [...document.querySelectorAll('body *')].filter(el => {
      if (!(el instanceof HTMLElement)) return false;
      const txt = (el.innerText || '').replace(/\s+/g, ' ').trim().toUpperCase();
      if (!txt.includes('ASK SOMETHING') || !txt.includes('ASSISTANT')) return false;
      const r = el.getBoundingClientRect();
      return r.width >= 180 && r.width <= Math.min(620, innerWidth) &&
             r.height >= 48 && r.height <= 190 &&
             r.bottom > 0 && r.top < innerHeight;
    });

    if (!nodes.length) return;

    nodes.sort((a,b) => {
      const ar=a.getBoundingClientRect(), br=b.getBoundingClientRect();
      return (ar.width*ar.height) - (br.width*br.height);
    });

    let host = nodes[0];
    for (let i=0; i<5 && host.parentElement; i++) {
      const p = host.parentElement;
      const r = p.getBoundingClientRect();
      const pos = getComputedStyle(p).position;
      if ((pos === 'fixed' || pos === 'sticky') && r.width >= 180 && r.width <= 620 && r.height <= 200) {
        host = p;
        break;
      }
      if (r.width > Math.min(650, innerWidth + 40) || r.height > 230) break;
    }
    host.classList.add('ato-mobile-assistant-host');

    const hr = host.getBoundingClientRect();
    const all = [...host.querySelectorAll('button,a,[role="button"],div,span')].filter(el => {
      if (el === host || !(el instanceof HTMLElement)) return false;
      const r = el.getBoundingClientRect();
      const txt = (el.innerText || '').replace(/\s+/g,' ').trim().toUpperCase();
      if (txt.includes('ASK SOMETHING') || txt === 'ASSISTANT') return false;
      return r.width >= 28 && r.width <= 96 &&
             r.height >= 28 && r.height <= 96 &&
             r.left >= hr.left + hr.width * .62 &&
             r.right <= hr.right + 6;
    });

    all.sort((a,b) => {
      const ar=a.getBoundingClientRect(), br=b.getBoundingClientRect();
      if (Math.abs(br.right-ar.right) > 2) return br.right-ar.right;
      return (ar.width*ar.height) - (br.width*br.height);
    });

    let control = all[0];
    if (!control) return;

    // Prefer the interactive parent if a small span/icon was selected.
    const interactive = control.closest('button,a,[role="button"]');
    if (interactive && host.contains(interactive)) control = interactive;

    if (!control.classList.contains('ato-mobile-assistant-arrow')) {
      if (!control.dataset.atoOriginalHtml) control.dataset.atoOriginalHtml = control.innerHTML;
      control.innerHTML = thinArrowSVG;
      control.classList.add('ato-mobile-assistant-arrow');
      control.setAttribute('aria-label', control.getAttribute('aria-label') || 'Open assistant');
    }
  };

  const applyAll = () => {
    if (!isMobile()) return;
    fixLanguageClose();
    fixHeroArrow();
    fixPopularViewAll();
    syncFinderCompareButtons();
    fixMapAndGeo();
    fixAssistantArrow();
  };

  let raf = 0;
  const queue = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(applyAll);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', queue, {once:true});
  } else {
    queue();
  }

  const mo = new MutationObserver(queue);
  mo.observe(document.documentElement, {childList:true, subtree:true});

  window.addEventListener('resize', queue, {passive:true});
  window.addEventListener('orientationchange', () => setTimeout(queue, 120), {passive:true});
  window.addEventListener('storage', e => {
    if (e.key === POOL_KEY) queue();
  });
})();


/* ========================================================================
   ATO MOBILE V8 — screenshot corrections
   MOBILE ONLY. Desktop is untouched.
   ======================================================================== */
(function atoMobileV8(){
  'use strict';

  const isMobile = () => window.innerWidth <= 980;
  const goldArrowSVG = `
    <svg class="ato-v8-gold-arrow-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6.5 17.5 17.5 6.5"></path>
      <path d="M10.5 6.5h7v7"></path>
    </svg>`;

  /* 1. HERO — force SVG instead of Unicode/emoji, so iOS can never draw blue square. */
  function fixHeroArrow(){
    if(!isMobile()) return;
    const arrow = document.querySelector('#atoLivingHero .ato-living-hero__arrow');
    if(!arrow) return;
    arrow.classList.add('ato-v8-hero-arrow');
    if(!arrow.querySelector('.ato-v8-gold-arrow-svg')){
      arrow.innerHTML = goldArrowSVG;
    }
  }

  /* 2. LANGUAGES — desktop-like letter codes instead of flags + gold working close X. */
  const langCodes = {ru:'RU', en:'EN', tr:'TR', de:'DE', pl:'PL'};
  const langNames = {en:'English', ru:'Русский', tr:'Türkçe', de:'Deutsch', pl:'Polski'};

  function closeLanguageMenu(){
    const dd=document.querySelector('#atoGlobalHeaderRoot .language-dropdown');
    const overlay=document.getElementById('mobileOverlay');
    dd?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.classList.remove('ato-mobile-header-modal-open');
  }

  function fixLanguages(){
    if(!isMobile()) return;
    const menu=document.querySelector('#atoGlobalHeaderRoot .language-menu');
    if(!menu) return;
    menu.classList.add('ato-v8-language-menu');

    const close=menu.querySelector('.language-close');
    if(close){
      close.textContent='×';
      close.classList.add('ato-v8-language-close');
      if(!close.dataset.v8Bound){
        close.dataset.v8Bound='1';
        close.addEventListener('click',e=>{
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          closeLanguageMenu();
        },true);
      }
    }

    menu.querySelectorAll('a[data-lang]').forEach(a=>{
      const lang=a.dataset.lang;
      if(!langCodes[lang]) return;
      a.classList.add('ato-v8-lang-row');
      a.innerHTML=`<span class="ato-v8-lang-code">${langCodes[lang]}</span><span class="ato-v8-lang-name">${langNames[lang]}</span>`;
    });
  }

  /* 3. Mobile drawer dropdowns — inline, readable, scrollable; never float to the right. */
  function fixMobileDrawer(){
    if(!isMobile()) return;
    const root=document.getElementById('atoGlobalHeaderRoot');
    if(!root) return;

    const nav=root.querySelector('.nav');
    nav?.classList.add('ato-v8-mobile-nav');

    root.querySelectorAll('.ato-header-dropdown').forEach(dd=>{
      dd.classList.add('ato-v8-mobile-dropdown');
      const menu=dd.querySelector('.dropdown-menu');
      if(menu) menu.classList.add('ato-v8-mobile-submenu');
    });

    /* Make opening trigger deterministic. */
    root.querySelectorAll('.ato-header-dropdown > .ato-dropdown-trigger').forEach(btn=>{
      if(btn.dataset.v8Bound) return;
      btn.dataset.v8Bound='1';
      btn.addEventListener('click',()=>{
        setTimeout(()=>{
          if(!isMobile()) return;
          const dd=btn.closest('.ato-header-dropdown');
          if(dd?.classList.contains('open')){
            dd.scrollIntoView({block:'nearest',behavior:'smooth'});
          }
        },40);
      });
    });
  }

  /* 4. Search X — gold from the start and guaranteed to close. */
  function fixSearchClose(){
    if(!isMobile()) return;
    const close=document.getElementById('atoHeaderSearchClose');
    if(!close) return;
    close.classList.add('ato-v8-search-close');
    close.textContent='×';
  }

  /* 5. Türkiye map — move strongly right, a little down, but keep inside phone. */
  function fixTurkeyMap(){
    if(!isMobile()) return;
    const root=document.getElementById('atoAboutLiveMap');
    const inner=root?.querySelector('.about-live-map-inner');
    const svg=root?.querySelector('.final-turkiye-map');
    if(!root || !inner || !svg) return;
    root.classList.add('ato-v8-map');
    inner.classList.add('ato-v8-map-inner');
    svg.classList.add('ato-v8-map-svg');
    svg.setAttribute('preserveAspectRatio','xMidYMid meet');
  }


  function syncHotlinePhone(){
    if(!isMobile()) return;
    const primary = document.querySelector('#contacts .contact-grid > div:first-child > a[href*="wa.me"]');
    const hotline = document.querySelector('#contacts .contact-hotline a[href^="tel:"]');
    if(!primary || !hotline) return;

    const s = getComputedStyle(primary);
    hotline.style.setProperty('font-size', s.fontSize, 'important');
    hotline.style.setProperty('font-family', s.fontFamily, 'important');
    hotline.style.setProperty('font-weight', s.fontWeight, 'important');
    hotline.style.setProperty('line-height', s.lineHeight, 'important');
    hotline.style.setProperty('letter-spacing', s.letterSpacing, 'important');
    hotline.style.setProperty('color', s.color, 'important');
    hotline.classList.add('ato-v9-hotline-synced');
  }

  function apply(){
    if(!isMobile()) return;
    fixHeroArrow();
    fixLanguages();
    fixMobileDrawer();
    fixSearchClose();
    fixTurkeyMap();
    syncHotlinePhone();
  }

  let raf=0;
  const queue=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(apply)};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',queue,{once:true});
  else queue();

  const mo=new MutationObserver(queue);
  mo.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('resize',queue,{passive:true});
  window.addEventListener('orientationchange',()=>setTimeout(queue,120),{passive:true});
})();


/* ========================================================================
   ATO MOBILE V10 — bottom Google map office marker fixed to real coordinates
   MOBILE ONLY.
   ======================================================================== */
(function atoMobileV10GoogleMapFix(){
  'use strict';

  const isMobile = () => window.innerWidth <= 980;

  function fixBottomGoogleMap(){
    if(!isMobile()) return;

    const wrapper = document.querySelector('#contacts .map-wrapper');
    const iframe = wrapper?.querySelector('iframe');
    if(!wrapper || !iframe) return;

    wrapper.classList.add('ato-v10-live-google-map');

    /* The office point belongs to the map itself, not to a screen overlay. */
    const officeLat = '36.529064';
    const officeLng = '32.044613';
    const desiredSrc =
      `https://maps.google.com/maps?q=${officeLat},${officeLng}&z=17&t=m&output=embed`;

    if(iframe.dataset.atoV10OfficeMap !== '1'){
      iframe.dataset.atoV10OfficeMap = '1';
      iframe.src = desiredSrc;
    }

    iframe.style.setProperty('pointer-events','auto','important');
    iframe.style.setProperty('touch-action','auto','important');

    /* Old overlay pin is visually misleading when the user pans the map. */
    const overlayPin = wrapper.querySelector('.ato-contact-map-pin');
    if(overlayPin){
      overlayPin.setAttribute('aria-hidden','true');
      overlayPin.style.setProperty('display','none','important');
    }
  }

  const run = () => {
    if(!isMobile()) return;
    fixBottomGoogleMap();
  };

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', run, {once:true});
  }else{
    run();
  }

  const mo = new MutationObserver(run);
  mo.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('resize',run,{passive:true});
  window.addEventListener('orientationchange',()=>setTimeout(run,120),{passive:true});
})();

