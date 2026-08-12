/*
 * ALANYA TOUR ORGANIZATIONS — shared header/promo bootstrap
 * Source of truth: /index.html + the stylesheets used by that index page.
 * The HTML already contains a fallback header/promo so the page remains usable
 * if index.html is temporarily unavailable.
 */
(() => {
  'use strict';

  const INDEX_URL = '/index.html';
  const MAIN_SCRIPT = 'special-offers.js';
  const stateClasses = new Set(['active','open','special']);

  function loadMainScript(){
    if (document.querySelector('script[data-special-offers-main]')) return;
    const script = document.createElement('script');
    script.src = MAIN_SCRIPT;
    script.defer = false;
    script.dataset.specialOffersMain = 'true';
    document.body.appendChild(script);
  }

  function rebaseUrl(value, baseUrl){
    if (!value || value.startsWith('data:') || value.startsWith('mailto:') || value.startsWith('tel:') || value.startsWith('javascript:')) return value;
    try {
      const u = new URL(value, baseUrl);
      if (u.origin !== location.origin) return u.href;
      return `${u.pathname}${u.search}${u.hash}`;
    } catch {
      return value;
    }
  }

  function rebaseTree(root, baseUrl){
    root.querySelectorAll('[href]').forEach(el => {
      const raw = el.getAttribute('href');
      if (raw?.startsWith('#')) el.setAttribute('href', `/index.html${raw}`);
      else el.setAttribute('href', rebaseUrl(raw, baseUrl));
    });
    root.querySelectorAll('[src]').forEach(el => el.setAttribute('src', rebaseUrl(el.getAttribute('src'), baseUrl)));

    // Special Offers is the current page, not an index anchor.
    root.querySelectorAll('a,button,.nav-item').forEach(el => {
      const text = (el.textContent || '').replace(/\s+/g,' ').trim().toUpperCase();
      if (text.includes('SPECIAL OFFERS')) {
        el.classList.add('active');
        if (el.tagName === 'A') el.setAttribute('href','/special-offers.html');
      } else if (el.classList.contains('nav-item')) {
        el.classList.remove('active');
      }
    });
  }

  function collectSelectorHooks(...roots){
    const classes = new Set();
    const ids = new Set();
    for (const root of roots) {
      if (!root) continue;
      [root, ...root.querySelectorAll('*')].forEach(el => {
        el.classList?.forEach(c => classes.add(c));
        if (el.id) ids.add(el.id);
      });
    }
    stateClasses.forEach(c => classes.add(c));
    // Interaction/future-proof hooks that may only appear after a click.
    ['nav-dropdown','dropdown-menu','language-dropdown','language-menu','language-close','mobile-menu-btn','mobile-overlay','header-tour-search','promo-track','promo-text','promo-dot','fire'].forEach(c=>classes.add(c));
    return {classes,ids};
  }

  function tokenRegex(prefix, token){
    return new RegExp(`\\${prefix}${token.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}(?![-_a-zA-Z0-9])`);
  }

  function selectorIsRelevant(selector, hooks){
    if (!selector) return false;
    for (const c of hooks.classes) if (tokenRegex('.',c).test(selector)) return true;
    for (const id of hooks.ids) if (tokenRegex('#',id).test(selector)) return true;
    return false;
  }

  async function filterCss(cssText, hooks){
    if (!('CSSStyleSheet' in window) || !CSSStyleSheet.prototype.replace) return '';
    const sheet = new CSSStyleSheet();
    await sheet.replace(cssText);
    const usedAnimations = new Set();
    const keyframes = new Map();

    function animationNames(css){
      const names = [];
      const matches = css.matchAll(/animation(?:-name)?\s*:\s*([^;}]+)/gi);
      for (const m of matches) {
        const value=m[1];
        value.split(',').forEach(part=>{
          part.trim().split(/\s+/).forEach(tok=>{
            if (/^[a-zA-Z_][\w-]*$/.test(tok) && !/^(none|linear|ease|ease-in|ease-out|ease-in-out|infinite|forwards|backwards|both|normal|reverse|alternate|alternate-reverse|running|paused)$/i.test(tok)) names.push(tok);
          });
        });
      }
      return names;
    }

    function walk(rules){
      const out=[];
      for (const rule of rules) {
        if (rule.type === CSSRule.STYLE_RULE) {
          if (selectorIsRelevant(rule.selectorText, hooks)) {
            out.push(rule.cssText);
            animationNames(rule.cssText).forEach(n=>usedAnimations.add(n));
          }
        } else if (rule.type === CSSRule.MEDIA_RULE || rule.type === CSSRule.SUPPORTS_RULE || rule.type === CSSRule.LAYER_BLOCK_RULE) {
          const inner=walk(rule.cssRules || []);
          if (inner.length) {
            const head = rule.type === CSSRule.MEDIA_RULE ? `@media ${rule.conditionText}` :
                         rule.type === CSSRule.SUPPORTS_RULE ? `@supports ${rule.conditionText}` : `@layer ${rule.name || ''}`;
            out.push(`${head}{${inner.join('\n')}}`);
          }
        } else if (rule.type === CSSRule.KEYFRAMES_RULE) {
          keyframes.set(rule.name, rule.cssText);
        }
      }
      return out;
    }

    const selected=walk(sheet.cssRules);
    // Promo animation is part of the shared header even if parsing shorthand is conservative.
    usedAnimations.add('promoMove');
    for (const name of usedAnimations) if (keyframes.has(name)) selected.push(keyframes.get(name));
    return selected.join('\n');
  }

  async function installIndexStyles(indexDoc, baseUrl, hooks){
    const cssSources=[];
    indexDoc.querySelectorAll('link[rel~="stylesheet"][href]').forEach(link=>{
      cssSources.push({url:new URL(link.getAttribute('href'),baseUrl).href});
    });
    indexDoc.querySelectorAll('style').forEach(style=>{
      if (style.textContent?.trim()) cssSources.push({text:style.textContent});
    });

    const filtered=[];
    for (const source of cssSources) {
      try {
        const text = source.text ?? await fetch(source.url,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`CSS ${r.status}`);return r.text()});
        const scoped = await filterCss(text,hooks);
        if (scoped) filtered.push(scoped);
      } catch (err) {
        console.warn('[ATO] Shared header stylesheet source skipped:',err);
      }
    }
    if (filtered.length) {
      let style=document.getElementById('ato-index-header-live-style');
      if (!style) {style=document.createElement('style');style.id='ato-index-header-live-style';document.head.appendChild(style)}
      style.textContent=filtered.join('\n');
      return true;
    }
    return false;
  }

  async function syncFromIndex(){
    const response=await fetch(INDEX_URL,{cache:'no-store',headers:{'X-ATO-Fragment':'header-promo'}});
    if(!response.ok) throw new Error(`Index ${response.status}`);
    const html=await response.text();
    const doc=new DOMParser().parseFromString(html,'text/html');
    const sourceHeader=doc.querySelector('header.header, .header');
    const sourcePromo=doc.querySelector('.promo-bar');
    if(!sourceHeader || !sourcePromo) throw new Error('Index header/promo not found');

    const header=sourceHeader.cloneNode(true);
    const promo=sourcePromo.cloneNode(true);
    rebaseTree(header,new URL(INDEX_URL,location.href).href);
    rebaseTree(promo,new URL(INDEX_URL,location.href).href);

    const hooks=collectSelectorHooks(sourceHeader,sourcePromo);
    const stylesSynced=await installIndexStyles(doc,new URL(INDEX_URL,location.href).href,hooks);

    document.querySelector('header.header, .header')?.replaceWith(header);
    document.querySelector('.promo-bar')?.replaceWith(promo);
    if(stylesSynced) document.body.classList.remove('so-header-fallback');
    document.dispatchEvent(new CustomEvent('ato:index-header-synced'));
  }

  (async()=>{
    try { await syncFromIndex(); }
    catch(err){ console.warn('[ATO] Using local header/promo fallback:',err); }
    finally { loadMainScript(); }
  })();
})();
