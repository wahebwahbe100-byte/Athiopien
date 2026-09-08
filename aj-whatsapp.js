(function(){
  'use strict';
  const ICON='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.03 3.2c-7.06 0-12.8 5.67-12.8 12.65 0 2.22.59 4.4 1.7 6.31L3.12 28.8l6.82-1.78a12.92 12.92 0 0 0 6.08 1.53h.01c7.05 0 12.8-5.67 12.8-12.65 0-3.38-1.33-6.56-3.75-8.95A12.78 12.78 0 0 0 16.03 3.2Zm0 23.22h-.01a10.72 10.72 0 0 1-5.47-1.49l-.39-.23-4.05 1.06 1.08-3.91-.25-.4a10.47 10.47 0 0 1-1.64-5.6c0-5.81 4.81-10.53 10.73-10.53 2.87 0 5.56 1.1 7.58 3.1a10.4 10.4 0 0 1 3.14 7.48c0 5.8-4.81 10.52-10.72 10.52Zm5.88-7.88c-.32-.16-1.91-.93-2.21-1.03-.3-.11-.51-.16-.73.16-.21.32-.83 1.03-1.02 1.24-.19.21-.38.24-.7.08-.33-.16-1.37-.5-2.61-1.58a9.74 9.74 0 0 1-1.81-2.22c-.19-.32-.02-.5.14-.66.15-.14.33-.37.49-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.73-1.74-1-2.38-.26-.63-.53-.54-.73-.55h-.62c-.22 0-.57.08-.87.4-.3.32-1.13 1.09-1.13 2.66 0 1.56 1.16 3.08 1.32 3.29.16.21 2.29 3.45 5.55 4.84.78.33 1.38.53 1.85.68.78.24 1.49.21 2.05.13.63-.09 1.91-.77 2.18-1.51.27-.74.27-1.37.19-1.5-.08-.13-.3-.21-.62-.37Z"/></svg>';
  const DEFAULT_TEXT='Hallo, ich interessiere mich für eine Äthiopien-Reise und möchte mich beraten lassen.';

  function cleanNumber(raw){
    let s=String(raw||'').trim();
    if(!s)return '';
    s=s.replace(/^\+49\s*\(0\)/,'+49').replace(/^\+251\s*\(0\)/,'+251');
    let digits=s.replace(/\D/g,'');
    if(digits.startsWith('00'))digits=digits.slice(2);
    if(!digits || /^0+$/.test(digits) || /^(?:49|251)?0{6,}$/.test(digits) || digits.length<8)return '';
    return digits;
  }
  function configuredNumber(){
    const direct=cleanNumber(window.AJ_WHATSAPP_NUMBER||'');
    if(direct)return direct;
    try{
      const raw=localStorage.getItem('aj_company');
      if(raw){
        const obj=JSON.parse(raw);
        const n=cleanNumber(obj && (obj.whatsapp||obj.phone));
        if(n)return n;
      }
    }catch(e){}
    try{
      if(typeof window.company==='function'){
        const c=window.company();
        const n=cleanNumber(c && (c.whatsapp||c.phone));
        if(n)return n;
      }
    }catch(e){}
    return '';
  }
  function whatsappHref(){
    const n=configuredNumber();
    const text=encodeURIComponent(DEFAULT_TEXT);
    return n ? 'https://wa.me/'+n+'?text='+text : 'https://wa.me/?text='+text;
  }
  function makeLink(cls,label){
    const a=document.createElement('a');
    a.className=cls;
    a.href=whatsappHref();
    a.target='_blank';
    a.rel='noopener noreferrer';
    a.setAttribute('aria-label',label);
    a.title='WhatsApp';
    a.innerHTML=ICON;
    return a;
  }
  function ensureFooter(){
    document.querySelectorAll('.footer-socials-ref').forEach(function(row){
      if(row.querySelector('.aj-whatsapp-footer'))return;
      row.appendChild(makeLink('aj-whatsapp-footer','WhatsApp'));
    });
  }
  function ensureFloating(){
    if(document.querySelector('.aj-whatsapp-float'))return;
    const a=makeLink('aj-whatsapp-float','WhatsApp – Beratung starten');
    document.body.appendChild(a);
  }
  function syncMenuState(){
    const open=!!document.querySelector('.navlinks.open,.menuBtn.menu-open');
    document.body.classList.toggle('aj-mobile-menu-open',open);
  }
  function refresh(){ensureFooter();ensureFloating();syncMenuState();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});
  else refresh();
  const mo=new MutationObserver(function(){ensureFooter();ensureFloating();});
  mo.observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('click',function(){setTimeout(syncMenuState,0);},true);
  window.addEventListener('resize',syncMenuState,{passive:true});
  window.addEventListener('pageshow',refresh,{passive:true});
})();
