(() => {
  'use strict';

  const INDEX_URL='/index.html';
  const allowedLangs=['ru','en','tr','de','pl'];
  let globalHandlersBound=false;

  const currentLang=()=>{
    try{
      const saved=localStorage.getItem('atoLanguage');
      return allowedLangs.includes(saved)?saved:'en';
    }catch(_){
      return 'en';
    }
  };

  function updateLanguage(header,lang,promo=document.querySelector('.promo-bar')){
    if(!header||!allowedLangs.includes(lang)) return;
    [header,promo].filter(Boolean).forEach(root=>{
      root.querySelectorAll(`[data-${lang}]`).forEach(el=>{el.textContent=el.getAttribute(`data-${lang}`)});
    });
    const label=header.querySelector('.language-dropdown > span');
    if(label) label.textContent=lang.toUpperCase();
    document.documentElement.lang=lang;
    try{localStorage.setItem('atoLanguage',lang)}catch(_){}
  }

  function rebaseTree(root){
    root.querySelectorAll('a[href]').forEach(el=>{
      const href=el.getAttribute('href');
      if(href && href!=='#' && href.startsWith('#')) el.setAttribute('href',`/index.html${href}`);
    });
  }

  function closeAllDropdowns(header){
    header?.querySelectorAll('.ato-header-dropdown.open').forEach(dd=>{
      dd.classList.remove('open');
      dd.querySelector('.ato-dropdown-trigger')?.setAttribute('aria-expanded','false');
    });
  }

  function closeMenu(header){
    const nav=header?.querySelector('.nav');
    const mobileBtn=header?.querySelector('#mobileMenuBtn');
    const overlay=header?.querySelector('#mobileOverlay');
    nav?.classList.remove('active');
    mobileBtn?.classList.remove('active');
    overlay?.classList.remove('active');
    mobileBtn?.setAttribute('aria-expanded','false');
    header?.querySelector('.language-dropdown')?.classList.remove('open');
    closeAllDropdowns(header);
  }

  function bindHeader(header){
    if(!header || header.dataset.atoChromeBound==='1') return;
    header.dataset.atoChromeBound='1';

    const mobileBtn=header.querySelector('#mobileMenuBtn');
    const nav=header.querySelector('.nav');
    const overlay=header.querySelector('#mobileOverlay');
    const dropdowns=[...header.querySelectorAll('.ato-header-dropdown')];
    const languageDropdown=header.querySelector('.language-dropdown');
    const languageClose=header.querySelector('.language-close');
    const isMobile=()=>window.innerWidth<=980;

    const setDropdown=(dropdown,open)=>{
      dropdown?.classList.toggle('open',open);
      dropdown?.querySelector('.ato-dropdown-trigger')?.setAttribute('aria-expanded',open?'true':'false');
    };

    if(mobileBtn&&nav&&overlay){
      mobileBtn.setAttribute('role','button');
      mobileBtn.setAttribute('tabindex','0');
      mobileBtn.setAttribute('aria-label','Open navigation');
      mobileBtn.setAttribute('aria-expanded','false');
      const toggle=()=>{
        const open=!nav.classList.contains('active');
        nav.classList.toggle('active',open);
        mobileBtn.classList.toggle('active',open);
        overlay.classList.toggle('active',open);
        mobileBtn.setAttribute('aria-expanded',open?'true':'false');
        if(!open) closeMenu(header);
      };
      mobileBtn.addEventListener('click',toggle);
      mobileBtn.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}});
      overlay.addEventListener('click',()=>closeMenu(header));
    }

    dropdowns.forEach(dropdown=>{
      dropdown.querySelector('.ato-dropdown-trigger')?.addEventListener('click',e=>{
        e.preventDefault();e.stopPropagation();
        const open=!dropdown.classList.contains('open');
        dropdowns.forEach(dd=>{if(dd!==dropdown)setDropdown(dd,false)});
        setDropdown(dropdown,open);
      });
    });

    languageDropdown?.addEventListener('click',e=>{
      if(isMobile()){
        if(e.target.closest('.language-menu')) return;
        e.stopPropagation();
        closeAllDropdowns(header);
        languageDropdown.classList.toggle('open');
      }
    });
    languageClose?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();languageDropdown?.classList.remove('open')});
    header.querySelectorAll('.language-menu a[data-lang]').forEach(link=>link.addEventListener('click',e=>{
      e.preventDefault();
      e.stopPropagation();
      updateLanguage(header,link.dataset.lang);
      languageDropdown?.classList.remove('open');
    }));
    nav?.querySelectorAll('a[href]').forEach(link=>link.addEventListener('click',()=>{closeAllDropdowns(header);if(isMobile())closeMenu(header)}));
    header.addEventListener('click',e=>{if(!e.target.closest('.ato-header-dropdown'))closeAllDropdowns(header)});
    updateLanguage(header,currentLang());

    if(!globalHandlersBound){
      globalHandlersBound=true;
      document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu(document.querySelector('header.header'))});
      window.addEventListener('resize',()=>{const h=document.querySelector('header.header');if(window.innerWidth>980)closeMenu(h);else closeAllDropdowns(h)},{passive:true});
    }
  }

  function collectSelectorHooks(...roots){
    const classes=new Set(['active','open','special']);
    const ids=new Set();
    for(const root of roots){
      if(!root) continue;
      [root,...root.querySelectorAll('*')].forEach(el=>{el.classList?.forEach(c=>classes.add(c));if(el.id)ids.add(el.id)});
    }
    ['nav-dropdown','dropdown-menu','language-dropdown','language-menu','language-close','mobile-menu-btn','mobile-overlay','header-tour-search','promo-track','promo-text','promo-dot','fire'].forEach(c=>classes.add(c));
    return {classes,ids};
  }

  function escapeRx(value){return value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
  function selectorIsRelevant(selector,hooks){
    if(!selector) return false;
    for(const c of hooks.classes) if(new RegExp(`\\.${escapeRx(c)}(?![-_a-zA-Z0-9])`).test(selector)) return true;
    for(const id of hooks.ids) if(new RegExp(`#${escapeRx(id)}(?![-_a-zA-Z0-9])`).test(selector)) return true;
    return false;
  }

  async function filterCss(cssText,hooks){
    if(!('CSSStyleSheet' in window) || !CSSStyleSheet.prototype.replace) return '';
    const sheet=new CSSStyleSheet();
    await sheet.replace(cssText);
    const usedAnimations=new Set(['promoMove']);
    const keyframes=new Map();

    function animationNames(css){
      const out=[];
      for(const m of css.matchAll(/animation(?:-name)?\s*:\s*([^;}]+)/gi)){
        m[1].split(',').forEach(part=>part.trim().split(/\s+/).forEach(tok=>{
          if(/^[a-zA-Z_][\w-]*$/.test(tok)&&!/^(none|linear|ease|ease-in|ease-out|ease-in-out|infinite|forwards|backwards|both|normal|reverse|alternate|alternate-reverse|running|paused)$/i.test(tok)) out.push(tok);
        }));
      }
      return out;
    }
    function walk(rules){
      const out=[];
      for(const rule of rules){
        if(rule.type===CSSRule.STYLE_RULE){
          if(selectorIsRelevant(rule.selectorText,hooks)){out.push(rule.cssText);animationNames(rule.cssText).forEach(n=>usedAnimations.add(n))}
        }else if(rule.type===CSSRule.MEDIA_RULE||rule.type===CSSRule.SUPPORTS_RULE){
          const inner=walk(rule.cssRules||[]);
          if(inner.length){const head=rule.type===CSSRule.MEDIA_RULE?`@media ${rule.conditionText}`:`@supports ${rule.conditionText}`;out.push(`${head}{${inner.join('\n')}}`)}
        }else if(rule.type===CSSRule.KEYFRAMES_RULE){keyframes.set(rule.name,rule.cssText)}
      }
      return out;
    }
    const selected=walk(sheet.cssRules);
    for(const name of usedAnimations) if(keyframes.has(name)) selected.push(keyframes.get(name));
    return selected.join('\n');
  }

  async function installIndexStyles(indexDoc,baseUrl,hooks){
    const sources=[];
    indexDoc.querySelectorAll('link[rel~="stylesheet"][href]').forEach(link=>sources.push({url:new URL(link.getAttribute('href'),baseUrl).href}));
    indexDoc.querySelectorAll('head style').forEach(style=>{if(style.textContent?.trim())sources.push({text:style.textContent})});
    const chunks=[];
    for(const source of sources){
      try{
        const text=source.text ?? await fetch(source.url,{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error(`CSS ${r.status}`);return r.text()});
        const filtered=await filterCss(text,hooks);
        if(filtered)chunks.push(filtered);
      }catch(err){console.warn('[ATO] Header style source skipped:',err)}
    }
    if(!chunks.length)return;
    let style=document.getElementById('ato-index-header-live-style');
    if(!style){style=document.createElement('style');style.id='ato-index-header-live-style';document.head.appendChild(style)}
    style.textContent=chunks.join('\n');
  }

  function stableMarkup(el){
    const copy=el.cloneNode(true);
    copy.removeAttribute('data-ato-chrome-bound');
    copy.querySelectorAll('.open,.active').forEach(x=>x.classList.remove('open','active'));
    const mobileBtn=copy.querySelector('#mobileMenuBtn');
    ['role','tabindex','aria-label','aria-expanded'].forEach(a=>mobileBtn?.removeAttribute(a));

    const canonical=node=>{
      if(node.nodeType===Node.TEXT_NODE){
        const text=node.textContent.replace(/\s+/g,' ').trim();
        return text?`#${text}`:'';
      }
      if(node.nodeType!==Node.ELEMENT_NODE) return '';
      const attrs=[...node.attributes]
        .map(a=>[a.name,a.value])
        .sort((a,b)=>a[0].localeCompare(b[0]))
        .map(([k,v])=>`${k}=${JSON.stringify(v)}`)
        .join(';');
      return `<${node.tagName.toLowerCase()}|${attrs}>${[...node.childNodes].map(canonical).join('')}</${node.tagName.toLowerCase()}>`;
    };
    return canonical(copy);
  }

  async function syncFromIndex(){
    const response=await fetch(INDEX_URL,{cache:'no-cache',headers:{'X-ATO-Fragment':'header-promo'}});
    if(!response.ok) throw new Error(`Index ${response.status}`);
    const html=await response.text();
    const doc=new DOMParser().parseFromString(html,'text/html');
    const sourceHeader=doc.querySelector('header.header');
    const sourcePromo=doc.querySelector('.promo-bar');
    if(!sourceHeader||!sourcePromo) throw new Error('Index header/promo not found');

    const baseUrl=new URL(INDEX_URL,location.href).href;
    const header=sourceHeader.cloneNode(true);
    const promo=sourcePromo.cloneNode(true);
    rebaseTree(header);rebaseTree(promo);
    updateLanguage(header,currentLang(),promo);
    await installIndexStyles(doc,baseUrl,collectSelectorHooks(sourceHeader,sourcePromo));

    let liveHeader=document.querySelector('header.header');
    let livePromo=document.querySelector('.promo-bar');
    if(!liveHeader||!livePromo) throw new Error('Local header/promo fallback missing');

    if(stableMarkup(liveHeader)!==stableMarkup(header)){
      liveHeader.replaceWith(header);
      liveHeader=header;
      bindHeader(liveHeader);
    }
    if(stableMarkup(livePromo)!==stableMarkup(promo)){
      livePromo.replaceWith(promo);
      livePromo=promo;
    }
    updateLanguage(liveHeader,currentLang(),livePromo);
    document.dispatchEvent(new CustomEvent('ato:index-header-synced'));
  }

  bindHeader(document.querySelector('header.header'));
  syncFromIndex().catch(err=>console.warn('[ATO] Live index header sync skipped; immediate fallback remains active:',err));
})();
