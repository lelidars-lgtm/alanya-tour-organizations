/* ATO MOBILE HEADER LOADER V41 — MOBILE ONLY. */
(function(){
  "use strict";
  if(!(window.matchMedia && window.matchMedia("(max-width: 980px)").matches)) return;
  if(document.getElementById("atoGlobalHeaderRoot")) return;
  if(document.querySelector('script[src*="/assets/js/ato-global-header.js"]')) return;
  var s=document.createElement("script");
  s.src="/assets/js/ato-global-header.js?v=20260828-mobile-native-v41";
  s.async=false;
  s.setAttribute("data-ato-mobile-navigation","v41");
  document.head.appendChild(s);
})();
