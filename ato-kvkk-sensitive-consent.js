/*
ATO KVKK — SPECIAL-CATEGORY DATA CONSENT GATE
Version: KVKK-SPECIAL-2026-08-13
Use on pages/forms that ask for pregnancy, wheelchair or reduced-mobility information.
The privacy notice and explicit consent remain separate.
*/
(function(){
  'use strict';
  const VERSION='KVKK-SPECIAL-2026-08-13';
  const WORDS=/pregnan|hamile|wheelchair|reduced\s*mobility|mobility|tekerlekli|engelli|erişilebilir/i;

  function textFor(el){
    const bits=[
      el.name, el.id, el.getAttribute('aria-label'), el.getAttribute('placeholder'),
      el.closest('label')?.textContent, el.parentElement?.textContent
    ];
    return bits.filter(Boolean).join(' ');
  }
  function isSensitiveControl(el){ return WORDS.test(textFor(el)); }
  function active(el){
    if(el.disabled)return false;
    if(el.type==='checkbox'||el.type==='radio')return el.checked;
    if(el.tagName==='SELECT'){
      const v=(el.value||'').trim();
      return v && !/^(no|none|false|0|hayır|hayir)$/i.test(v) && WORDS.test(textFor(el)+' '+v);
    }
    return Boolean((el.value||'').trim());
  }
  function controls(form){
    return [...form.querySelectorAll('input,select,textarea')].filter(isSensitiveControl);
  }
  function needsConsent(form){ return controls(form).some(active); }

  function ensureBox(form){
    if(form.querySelector('[data-ato-kvkk-consent]'))return;
    const sensitive=controls(form);
    if(!sensitive.length)return;

    const wrap=document.createElement('div');
    wrap.setAttribute('data-ato-kvkk-consent','');
    wrap.className='ato-kvkk-consent';
    wrap.innerHTML=
      '<label class="ato-kvkk-consent-label">'+
        '<input type="checkbox" name="kvkkSpecialCategoryConsent" value="yes" class="ato-kvkk-consent-check">'+
        '<span><b>Explicit consent for special-category data</b><br>'+
        'If I provide pregnancy and/or health/accessibility information, I explicitly consent to its processing solely to assess tour safety, suitability and necessary assistance, as explained in the '+
        '<a href="kvkk-privacy.html" target="_blank" rel="noopener">KVKK &amp; Privacy Notice</a>. This consent is separate from the privacy notice.</span>'+
      '</label>'+
      '<input type="hidden" name="kvkkSpecialCategoryConsentVersion" value="'+VERSION+'">'+
      '<input type="hidden" name="kvkkSpecialCategoryConsentAt" value="">'+
      '<div class="ato-kvkk-consent-status" role="status" aria-live="polite"></div>';

    const target=form.querySelector('.tp-actions, .form-actions, button[type="submit"]');
    if(target && target.classList && (target.classList.contains('tp-actions')||target.classList.contains('form-actions'))){
      target.before(wrap);
    }else if(target){
      target.before(wrap);
    }else{
      form.appendChild(wrap);
    }

    const check=wrap.querySelector('.ato-kvkk-consent-check');
    const timestamp=wrap.querySelector('[name="kvkkSpecialCategoryConsentAt"]');
    const status=wrap.querySelector('.ato-kvkk-consent-status');

    function sync(){
      const needed=needsConsent(form);
      wrap.classList.toggle('is-needed',needed);
      check.required=needed;
      if(!needed){
        check.checked=false;
        timestamp.value='';
        status.textContent='';
      }else if(check.checked){
        if(!timestamp.value) timestamp.value=new Date().toISOString();
        status.textContent='Consent recorded for the information selected in this form.';
      }
    }
    check.addEventListener('change',sync);
    sensitive.forEach(el=>el.addEventListener('change',sync));
    sensitive.forEach(el=>el.addEventListener('input',sync));
    sync();
  }

  function scan(root=document){
    root.querySelectorAll?.('form').forEach(ensureBox);
  }

  document.addEventListener('submit',function(e){
    const form=e.target;
    if(!(form instanceof HTMLFormElement))return;
    ensureBox(form);
    if(!needsConsent(form))return;

    const box=form.querySelector('[data-ato-kvkk-consent]');
    const check=box?.querySelector('.ato-kvkk-consent-check');
    const status=box?.querySelector('.ato-kvkk-consent-status');
    if(!check?.checked){
      e.preventDefault();
      e.stopImmediatePropagation();
      if(status)status.textContent='Please give separate explicit consent before submitting pregnancy or health/accessibility information.';
      box?.classList.add('is-error');
      box?.scrollIntoView({behavior:'smooth',block:'center'});
      check?.focus({preventScroll:true});
      return;
    }

    box?.classList.remove('is-error');
    const stamp=box?.querySelector('[name="kvkkSpecialCategoryConsentAt"]');
    if(stamp && !stamp.value) stamp.value=new Date().toISOString();

    // Add a compact audit marker to an existing note/comment field when available.
    const note=form.querySelector('textarea[name="notes"],textarea[name="comment"],textarea[name="message"]');
    if(note){
      const marker='[KVKK SPECIAL CONSENT: YES | '+VERSION+' | '+(stamp?.value||new Date().toISOString())+']';
      note.value=(note.value||'').replace(/\n?\[KVKK SPECIAL CONSENT:[^\]]+\]/g,'').trim();
      note.value=(note.value?note.value+'\n':'')+marker;
    }
  },true);

  const css=document.createElement('style');
  css.textContent=`
  .ato-kvkk-consent{display:none;margin:14px 0;padding:15px 16px;border:1px solid rgba(214,162,74,.30);border-radius:14px;background:linear-gradient(135deg,rgba(214,162,74,.07),rgba(6,24,39,.70));color:#c9d5dd}
  .ato-kvkk-consent.is-needed{display:block}
  .ato-kvkk-consent.is-error{border-color:rgba(231,119,107,.7);box-shadow:0 0 0 2px rgba(231,119,107,.08)}
  .ato-kvkk-consent-label{display:flex;align-items:flex-start;gap:11px;font-size:10px;line-height:1.55;cursor:pointer}
  .ato-kvkk-consent-label input{margin-top:3px;accent-color:#d6a24a;flex:0 0 auto}
  .ato-kvkk-consent-label b{color:#f0ca72;font-size:10px;letter-spacing:.03em}
  .ato-kvkk-consent-label a{color:#f0ca72;text-decoration:underline}
  .ato-kvkk-consent-status{margin-top:8px;color:#d8c38d;font-size:9px;line-height:1.45}
  `;
  document.head.appendChild(css);

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>scan());
  else scan();

  new MutationObserver(m=>{for(const x of m){for(const n of x.addedNodes){if(n.nodeType===1)scan(n)}}})
    .observe(document.documentElement,{childList:true,subtree:true});
})();