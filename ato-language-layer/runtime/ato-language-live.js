/*
  ALANYA TOUR ORGANIZATIONS — LANGUAGE LIVE LOADER v1.1
  Safe to load more than once: duplicate boot is ignored.
*/
(function(){
  'use strict';
  if(window.__ATO_LANGUAGE_LIVE_BOOTSTRAPPED__) return;
  window.__ATO_LANGUAGE_LIVE_BOOTSTRAPPED__=true;

  const LANGS=['en','ru','tr','de','pl'];
  const self=document.currentScript;
  const src=self&&self.src?self.src:'';
  const base=src?new URL('../',src).href:new URL('/ato-language-layer/',location.origin).href;

  function selectedLanguage(){
    const x=(localStorage.getItem('atoLanguage')||document.documentElement.lang||'en').toLowerCase().slice(0,2);
    return LANGS.includes(x)?x:'en';
  }
  function currentPage(){
    let p=(location.pathname||'/').replace(/^\/+/, '');
    if(!p) return 'index.html';
    if(p.endsWith('/')) p+='index.html';
    return decodeURIComponent(p);
  }
  function loadCore(){
    if(window.ATOLanguageLayer) return Promise.resolve();
    return new Promise((resolve,reject)=>{
      const existing=document.querySelector('script[data-ato-language-core="1"]');
      if(existing){
        if(window.ATOLanguageLayer){resolve();return;}
        existing.addEventListener('load',resolve,{once:true});
        existing.addEventListener('error',()=>reject(new Error('ATO Language Layer core could not be loaded')),{once:true});
        return;
      }
      const s=document.createElement('script');
      s.src=new URL('runtime/ato-language-layer.js',base).href;
      s.async=false;
      s.dataset.atoLanguageCore='1';
      s.onload=resolve;
      s.onerror=()=>reject(new Error('ATO Language Layer core could not be loaded'));
      (document.head||document.documentElement).appendChild(s);
    });
  }
  async function apply(lang){
    try{
      await loadCore();
      ATOLanguageLayer.setBase(base);
      const page=currentPage();
      const meta=await ATOLanguageLayer.pageMeta(page);
      if(!meta){
        document.documentElement.dataset.atoLanguageLayer='page-not-registered';
        return {ok:false,reason:'page-not-registered',page};
      }
      const useLang=LANGS.includes(lang)?lang:selectedLanguage();
      const result=await ATOLanguageLayer.applyToDocument(useLang,document,page,{verify:true,observe:true});
      document.documentElement.dataset.atoLanguageLayer='active';
      document.documentElement.dataset.atoLanguage=useLang;
      return {ok:true,result};
    }catch(error){
      document.documentElement.dataset.atoLanguageLayer='safety-stop';
      console.warn('[ATO Language Layer] SAFETY STOP:',error);
      return {ok:false,reason:String(error&&error.message||error)};
    }
  }
  function start(){ apply(selectedLanguage()); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
  window.addEventListener('ato-language-changed',e=>{
    const lang=e&&e.detail&&e.detail.lang;
    if(LANGS.includes(lang)) apply(lang);
  });
  window.ATOLanguageLive={apply,selectedLanguage,currentPage,base};
})();
