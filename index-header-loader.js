(function(){
  'use strict';

  const host=document.getElementById('indexChromeHost');
  if(!host) return;

  host.style.cssText='display:block;width:100%;min-height:138px;position:relative;z-index:9999';

  function setFailed(message){
    host.innerHTML='<div role="alert" style="padding:18px 24px;background:#081424;color:#f3c66d;font:700 13px Arial">'+message+'</div>';
  }

  function initChrome(root){
    const mobileBtn=root.getElementById('mobileMenuBtn');
    const nav=root.querySelector('.nav');
    const overlay=root.getElementById('mobileOverlay');
    const dropdowns=[...root.querySelectorAll('.ato-header-dropdown')];
    const languageDropdown=root.querySelector('.language-dropdown');
    const languageClose=root.querySelector('.language-close');
    const languageLinks=[...root.querySelectorAll('.language-menu a[data-lang]')];

    const isMobile=()=>window.innerWidth<=980;
    const setDropdown=(dropdown,open)=>{
      if(!dropdown) return;
      dropdown.classList.toggle('open',open);
      dropdown.querySelector('.ato-dropdown-trigger')?.setAttribute('aria-expanded',open?'true':'false');
    };
    const closeDropdowns=(except=null)=>dropdowns.forEach(dd=>{if(dd!==except)setDropdown(dd,false)});
    const setMenu=open=>{
      nav?.classList.toggle('active',open);
      mobileBtn?.classList.toggle('active',open);
      overlay?.classList.toggle('active',open);
      mobileBtn?.setAttribute('aria-expanded',open?'true':'false');
      if(!open){closeDropdowns();languageDropdown?.classList.remove('open')}
    };

    if(mobileBtn&&nav&&overlay){
      mobileBtn.setAttribute('role','button');
      mobileBtn.setAttribute('tabindex','0');
      mobileBtn.setAttribute('aria-label','Open navigation');
      mobileBtn.setAttribute('aria-expanded','false');
      mobileBtn.addEventListener('click',()=>setMenu(!nav.classList.contains('active')));
      mobileBtn.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setMenu(!nav.classList.contains('active'))}});
      overlay.addEventListener('click',()=>setMenu(false));
    }

    dropdowns.forEach(dropdown=>{
      dropdown.querySelector('.ato-dropdown-trigger')?.addEventListener('click',e=>{
        e.preventDefault();e.stopPropagation();
        const willOpen=!dropdown.classList.contains('open');
        closeDropdowns(dropdown);setDropdown(dropdown,willOpen);
      });
    });

    languageDropdown?.addEventListener('click',e=>{
      if(isMobile()){e.stopPropagation();closeDropdowns();languageDropdown.classList.toggle('open')}
    });
    languageClose?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();languageDropdown?.classList.remove('open')});

    const allowed=['ru','en','tr','de','pl'];
    const updateLanguage=lang=>{
      if(!allowed.includes(lang)) return;
      root.querySelectorAll('[data-'+lang+']').forEach(el=>{el.textContent=el.getAttribute('data-'+lang)});
      const label=root.querySelector('.language-dropdown > span');
      if(label) label.textContent=lang.toUpperCase();
      document.documentElement.lang=lang;
      localStorage.setItem('atoLanguage',lang);
    };
    updateLanguage(allowed.includes(localStorage.getItem('atoLanguage'))?localStorage.getItem('atoLanguage'):'en');
    languageLinks.forEach(link=>link.addEventListener('click',e=>{e.preventDefault();updateLanguage(link.dataset.lang);languageDropdown?.classList.remove('open')}));

    nav?.querySelectorAll('a[href]').forEach(link=>link.addEventListener('click',()=>{closeDropdowns();if(isMobile())setMenu(false)}));
    root.addEventListener('click',e=>{if(!e.target.closest('.ato-header-dropdown'))closeDropdowns()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDropdowns();languageDropdown?.classList.remove('open');if(isMobile())setMenu(false)}});
    window.addEventListener('resize',()=>{if(!isMobile())setMenu(false);closeDropdowns()});
  }

  fetch('index.html',{cache:'default'})
    .then(response=>{if(!response.ok)throw new Error('HTTP '+response.status);return response.text()})
    .then(async html=>{
      const parsed=new DOMParser().parseFromString(html,'text/html');
      const header=parsed.querySelector('header.header');
      const promo=parsed.querySelector('.promo-bar');
      if(!header||!promo) throw new Error('Header or promotion banner not found in index.html');

      const shadow=host.attachShadow({mode:'open'});
      const reset=document.createElement('style');
      reset.textContent=':host{display:block;width:100%;position:relative;z-index:9999}*{box-sizing:border-box}a{color:inherit;text-decoration:none}';
      shadow.appendChild(reset);

      const stylesheetLinks=[...parsed.querySelectorAll('link[rel="stylesheet"][href]')];
      const stylesheetTexts=await Promise.all(stylesheetLinks.map(async link=>{
        const url=new URL(link.getAttribute('href'),new URL('index.html',location.href)).href;
        const response=await fetch(url,{cache:'default'});
        if(!response.ok) throw new Error('Stylesheet '+response.status);
        return response.text();
      }));
      stylesheetTexts.forEach(css=>{
        const style=document.createElement('style');
        style.textContent=css;
        shadow.appendChild(style);
      });

      parsed.querySelectorAll('head style').forEach(source=>{
        const style=document.createElement('style');
        style.textContent=source.textContent;
        shadow.appendChild(style);
      });

      shadow.appendChild(document.importNode(header,true));
      shadow.appendChild(document.importNode(promo,true));
      host.style.minHeight='0';
      initChrome(shadow);
      document.documentElement.classList.add('ato-chrome-ready');
      document.dispatchEvent(new CustomEvent('ato:index-header-ready'));
    })
    .catch(error=>{
      console.error('Index header loader:',error);
      setFailed('Site navigation could not be loaded from index.html.');
      document.documentElement.classList.add('ato-chrome-ready');
    });
})();
