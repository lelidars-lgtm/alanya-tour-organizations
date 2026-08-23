/*
  ALANYA TOUR ORGANIZATIONS — SAFE LANGUAGE LAYER v1
  ---------------------------------------------------
  IMPORTANT SAFETY PROPERTY:
  This file does NOTHING automatically. It does not modify any page unless
  ATOLanguageLayer.applyToDocument(...) is explicitly called by a separate
  preview/integration context.

  Approved site HTML/CSS/JS/media files remain untouched.
*/
(function(global){
  'use strict';
  const LANGS=['en','ru','tr','de','pl'];
  const state={base:null,manifest:null,global:new Map(),observers:new WeakMap(),originals:new WeakMap()};

  function ownBase(){
    if(state.base) return state.base;
    const src=(document.currentScript&&document.currentScript.src)||'';
    state.base=src?new URL('../',src).href:new URL('/ato-language-layer/',location.origin).href;
    return state.base;
  }
  function setBase(url){ state.base=new URL(url,location.href).href; return state.base; }
  function norm(v){ return String(v??'').replace(/\s+/g,' ').trim(); }
  function normalizePagePath(path){
    let p=String(path||'').split('?')[0].split('#')[0];
    try{p=new URL(p,location.origin).pathname}catch(_){ }
    p=p.replace(/^\/+/, '');
    if(!p) return 'index.html';
    if(p.endsWith('/')) p+='index.html';
    return decodeURIComponent(p);
  }
  async function json(url){ const r=await fetch(url,{cache:'no-store'}); if(!r.ok) throw new Error('ATO Language Layer: '+r.status+' '+url); return r.json(); }
  async function loadManifest(){ if(!state.manifest) state.manifest=await json(new URL('manifest.json',ownBase())); return state.manifest; }
  async function pageMeta(path){
    const m=await loadManifest(), p=normalizePagePath(path);
    return m.pages.find(x=>x.path===p)||null;
  }
  async function loadGlobal(lang){
    lang=String(lang||'en').toLowerCase(); if(!LANGS.includes(lang)) lang='en';
    if(!state.global.has(lang)) state.global.set(lang,await json(new URL('dictionaries/'+lang+'.json',ownBase())));
    return state.global.get(lang);
  }
  async function loadPageDocument(path,lang){
    lang=String(lang||'en').toLowerCase(); if(!LANGS.includes(lang)) lang='en';
    const meta=await pageMeta(path); if(!meta) throw new Error('ATO Language Layer: page is not in approved manifest: '+normalizePagePath(path));
    const doc=await json(new URL(meta.document_root+'/'+lang+'.json',ownBase()));
    return {meta,doc};
  }
  async function sha256Buffer(buf){
    const digest=await crypto.subtle.digest('SHA-256',buf);
    return Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,'0')).join('');
  }
  // Vercel build may add exactly one approved loader marker to the DEPLOYED copy.
  // Strip only that exact byte sequence before checking the approved source hash.
  const BUILD_INJECT='<!-- ATO-LANGUAGE-BUILD-INJECT --><script src=\"/ato-language-layer/runtime/ato-language-live.js\" data-ato-language-build=\"1\"></script>\n';
  const BUILD_INJECT_NO_NL='<!-- ATO-LANGUAGE-BUILD-INJECT --><script src=\"/ato-language-layer/runtime/ato-language-live.js\" data-ato-language-build=\"1\"></script>';
  function stripExactBytes(buf,needleText){
    const bytes=new Uint8Array(buf), needle=new TextEncoder().encode(needleText);
    outer: for(let i=0;i<=bytes.length-needle.length;i++){
      for(let j=0;j<needle.length;j++) if(bytes[i+j]!==needle[j]) continue outer;
      const out=new Uint8Array(bytes.length-needle.length);
      out.set(bytes.subarray(0,i),0); out.set(bytes.subarray(i+needle.length),i);
      return out.buffer;
    }
    return buf;
  }
  function normalizeApprovedDeploymentBytes(buf){
    let out=stripExactBytes(buf,BUILD_INJECT);
    if(out===buf) out=stripExactBytes(buf,BUILD_INJECT_NO_NL);
    return out;
  }
  async function verifyApprovedPage(path){
    const meta=await pageMeta(path); if(!meta) return {ok:false,reason:'not-in-manifest'};
    const url=new URL('/'+meta.path,location.origin);
    const r=await fetch(url,{cache:'no-store'}); if(!r.ok) return {ok:false,reason:'http-'+r.status,expected:meta.approved_sha256};
    const deployed=await r.arrayBuffer();
    const normalized=normalizeApprovedDeploymentBytes(deployed);
    const actual=await sha256Buffer(normalized);
    return {ok:actual===meta.approved_sha256,expected:meta.approved_sha256,actual,path:meta.path,build_injection_ignored:normalized.byteLength!==deployed.byteLength};
  }
  function remember(node,key,value){
    let rec=state.originals.get(node); if(!rec){rec={};state.originals.set(node,rec);} if(!(key in rec)) rec[key]=value;
  }
  function keepOuterSpace(raw,repl){
    const a=(String(raw).match(/^\s*/)||[''])[0], b=(String(raw).match(/\s*$/)||[''])[0];
    return a+repl+b;
  }
  function buildMaps(pageDoc,globalDict){
    const byKind={text:new Map(),alt:new Map(),aria:new Map(),placeholder:new Map(),title:new Map(),meta:new Map()};
    for(const e of pageDoc.entries||[]){
      const s=norm(e.source), t=String(e.translation??''); if(!s) continue;
      if(e.kind==='alt') byKind.alt.set(s,t);
      else if(e.kind==='aria-label') byKind.aria.set(s,t);
      else if(e.kind==='placeholder') byKind.placeholder.set(s,t);
      else if(e.kind==='title') byKind.title.set(s,t);
      else if(e.kind==='meta') byKind.meta.set(s,t);
      else byKind.text.set(s,t);
    }
    const fallback=new Map(Object.entries(globalDict||{}).map(([k,v])=>[norm(k),String(v)]));
    return {byKind,fallback};
  }
  function translated(map,fallback,value){
    const k=norm(value); if(!k) return null;
    if(map&&map.has(k)) return map.get(k);
    if(fallback&&fallback.has(k)) return fallback.get(k);
    return null;
  }
  function translateTextNode(node,maps){
    const raw=node.nodeValue||'', parent=node.parentElement;
    if(!norm(raw)||!parent||/^(SCRIPT|STYLE|NOSCRIPT|SVG|PATH)$/i.test(parent.tagName)) return;
    const t=translated(maps.byKind.text,maps.fallback,raw); if(t==null||t===norm(raw)) return;
    remember(node,'nodeValue',raw); node.nodeValue=keepOuterSpace(raw,t);
  }
  function translateElement(el,maps){
    if(!el||el.nodeType!==1) return;
    const attrs=[['alt','alt'],['aria-label','aria'],['placeholder','placeholder'],['title','title']];
    for(const [attr,kind] of attrs){
      if(!el.hasAttribute(attr)) continue; const raw=el.getAttribute(attr)||'';
      const t=translated(maps.byKind[kind],maps.fallback,raw); if(t==null||t===norm(raw)) continue;
      remember(el,'@'+attr,raw); el.setAttribute(attr,t);
    }
    if(el.tagName==='META'&&el.hasAttribute('content')){
      const raw=el.getAttribute('content')||''; const t=translated(maps.byKind.meta,maps.fallback,raw);
      if(t!=null&&t!==norm(raw)){remember(el,'@content',raw);el.setAttribute('content',t);}
    }
  }
  function walk(root,maps){
    const doc=root.nodeType===9?root:root.ownerDocument;
    if(root.nodeType===9){
      const raw=doc.title||''; const t=translated(maps.byKind.title,maps.fallback,raw);
      if(t!=null&&t!==norm(raw)){ remember(doc,'title',raw); doc.title=t; }
    }
    const start=root.nodeType===9?root.documentElement:root;
    if(!start) return;
    translateElement(start,maps);
    const tw=doc.createTreeWalker(start,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);
    let n; while((n=tw.nextNode())){ if(n.nodeType===3) translateTextNode(n,maps); else translateElement(n,maps); }
  }
  function stopObserving(doc){ const o=state.observers.get(doc); if(o){o.disconnect();state.observers.delete(doc);} }
  function observe(doc,maps){
    stopObserving(doc);
    const o=new doc.defaultView.MutationObserver(muts=>{
      o.disconnect();
      try{
        for(const m of muts){
          if(m.type==='characterData') translateTextNode(m.target,maps);
          else if(m.type==='attributes') translateElement(m.target,maps);
          else for(const n of m.addedNodes){ if(n.nodeType===3) translateTextNode(n,maps); else if(n.nodeType===1) walk(n,maps); }
        }
      } finally { o.observe(doc.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['alt','aria-label','placeholder','title','content']}); }
    });
    o.observe(doc.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['alt','aria-label','placeholder','title','content']});
    state.observers.set(doc,o); return o;
  }
  async function applyToDocument(lang,doc,pagePath,options){
    if(!doc||doc.nodeType!==9) throw new Error('ATO Language Layer: a Document is required');
    lang=String(lang||'en').toLowerCase(); if(!LANGS.includes(lang)) lang='en';
    const loaded=await loadPageDocument(pagePath||doc.location?.pathname||'',lang);
    if(options?.verify===true){
      const v=await verifyApprovedPage(loaded.meta.path); if(!v.ok) throw new Error('ATO Language Layer safety stop: approved source hash mismatch for '+loaded.meta.path);
    }
    const gd=await loadGlobal(lang), maps=buildMaps(loaded.doc,gd);
    walk(doc,maps);
    doc.documentElement.lang=lang;
    if(options?.observe!==false) observe(doc,maps);
    return {language:lang,page:loaded.meta.path,approved_sha256:loaded.meta.approved_sha256,entries:loaded.doc.entries.length};
  }
  function restoreDocument(doc){
    stopObserving(doc);
    // Full restore is intentionally conservative: preview reloads approved source instead.
    // This avoids mutating approved files and avoids guessing after page scripts change DOM.
    return true;
  }
  async function translateText(value,lang){ const gd=await loadGlobal(lang); const k=norm(value); return Object.prototype.hasOwnProperty.call(gd,k)?gd[k]:String(value??''); }

  global.ATOLanguageLayer={
    version:'1.1.0-safe-vercel-build',supportedLanguages:LANGS.slice(),setBase,loadManifest,pageMeta,loadPageDocument,
    loadGlobal,verifyApprovedPage,applyToDocument,restoreDocument,translateText,normalizePagePath
  };
})(window);
