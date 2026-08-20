(function(){
  'use strict';

  const I18N={
    de:{label:'Reise teilen',whatsapp:'WhatsApp',copy:'Link kopieren',copied:'Link kopiert',native:'Teilen',text:'Diese Reise ansehen'},
    en:{label:'Share trip',whatsapp:'WhatsApp',copy:'Copy link',copied:'Link copied',native:'Share',text:'Take a look at this trip'},
    ar:{label:'مشاركة الرحلة',whatsapp:'واتساب',copy:'نسخ الرابط',copied:'تم نسخ الرابط',native:'مشاركة',text:'شاهد هذه الرحلة'},
    he:{label:'שיתוף הטיול',whatsapp:'WhatsApp',copy:'העתקת קישור',copied:'הקישור הועתק',native:'שיתוף',text:'צפו בטיול הזה'},
    el:{label:'Κοινοποίηση ταξιδιού',whatsapp:'WhatsApp',copy:'Αντιγραφή συνδέσμου',copied:'Ο σύνδεσμος αντιγράφηκε',native:'Κοινοποίηση',text:'Δείτε αυτό το ταξίδι'},
    pt:{label:'Partilhar viagem',whatsapp:'WhatsApp',copy:'Copiar link',copied:'Link copiado',native:'Partilhar',text:'Veja esta viagem'},
    fr:{label:'Partager le voyage',whatsapp:'WhatsApp',copy:'Copier le lien',copied:'Lien copié',native:'Partager',text:'Découvrez ce voyage'},
    it:{label:'Condividi viaggio',whatsapp:'WhatsApp',copy:'Copia link',copied:'Link copiato',native:'Condividi',text:'Guarda questo viaggio'},
    es:{label:'Compartir viaje',whatsapp:'WhatsApp',copy:'Copiar enlace',copied:'Enlace copiado',native:'Compartir',text:'Mira este viaje'},
    ru:{label:'Поделиться поездкой',whatsapp:'WhatsApp',copy:'Копировать ссылку',copied:'Ссылка скопирована',native:'Поделиться',text:'Посмотрите это путешествие'},
    am:{label:'ጉዞውን ያጋሩ',whatsapp:'WhatsApp',copy:'ሊንኩን ቅዳ',copied:'ሊንኩ ተቀድቷል',native:'አጋራ',text:'ይህን ጉዞ ይመልከቱ'}
  };

  function lang(){
    const raw=(document.documentElement.lang||localStorage.getItem('aj_lang')||'de').toLowerCase();
    return I18N[raw]?raw:'de';
  }
  function t(){ return I18N[lang()]||I18N.de; }
  function tripTitle(){
    const h=document.getElementById('dtitle') || document.querySelector('.trip-hero h1');
    const s=(h&&h.textContent||'').trim();
    if(s) return s;
    return (document.title||'Abyssinia Journeys').replace(/\s*\|\s*Abyssinia Journeys\s*$/i,'').trim();
  }
  function shareUrl(){
    try{
      const u=new URL(window.location.href);
      u.hash='';
      const l=lang();
      if(l && l!=='de') u.searchParams.set('lang',l); else u.searchParams.delete('lang');
      return u.href;
    }catch(e){ return window.location.href; }
  }
  function message(){
    const x=t();
    return `${x.text}: ${tripTitle()}\n${shareUrl()}`;
  }
  function toast(msg){
    if(typeof window.toast==='function'){ try{window.toast(msg);return;}catch(e){} }
    let el=document.getElementById('ajShareToast');
    if(!el){el=document.createElement('div');el.id='ajShareToast';el.className='aj-share-toast notranslate';el.setAttribute('translate','no');document.body.appendChild(el);}
    el.textContent=msg;el.classList.add('show');clearTimeout(el._timer);el._timer=setTimeout(()=>el.classList.remove('show'),1800);
  }
  async function copyLink(){
    const url=shareUrl();
    try{await navigator.clipboard.writeText(url);toast(t().copied);return;}catch(e){}
    const ta=document.createElement('textarea');ta.value=url;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();
    try{document.execCommand('copy');toast(t().copied);}catch(e){}
    ta.remove();
  }
  function whatsapp(){
    const url='https://wa.me/?text='+encodeURIComponent(message());
    window.open(url,'_blank','noopener,noreferrer');
  }
  async function nativeShare(){
    if(!navigator.share){ copyLink(); return; }
    try{await navigator.share({title:tripTitle(),text:t().text,url:shareUrl()});}catch(e){if(e&&e.name!=='AbortError')copyLink();}
  }
  function icon(name){
    if(name==='whatsapp') return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.7 11.7 0 0 0 12.1 0C5.5 0 .2 5.3.2 11.8c0 2.1.6 4.1 1.6 5.9L0 24l6.5-1.7a12 12 0 0 0 5.6 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.5-8.4Zm-8.3 18.2h-.1a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.9 1 1-3.8-.2-.4a9.7 9.7 0 0 1-1.5-5.1A9.9 9.9 0 0 1 12.1 2c2.6 0 5.1 1 7 2.9a9.8 9.8 0 0 1 2.9 7c0 5.4-4.4 9.8-9.8 9.8Zm5.4-7.4c-.3-.1-1.8-.9-2.1-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-1.8-.9-3-1.6-4.2-3.7-.3-.5.3-.5.9-1.6.1-.2.1-.4 0-.6l-.9-2.2c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.9 5.2 2.2 1 3.1 1 4.2.8.7-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4Z"/></svg>';
    if(name==='copy') return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>';
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.6 6.8-4.1M8.6 13.4l6.8 4.1"/></svg>';
  }
  function addStyles(){
    if(document.getElementById('aj-trip-share-style-v13'))return;
    const s=document.createElement('style');s.id='aj-trip-share-style-v13';s.textContent=`
      .aj-trip-share{margin-top:18px;display:flex;align-items:center;gap:9px;flex-wrap:wrap}.aj-trip-share-label{font:800 .71rem 'Manrope',sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#f1d38a;margin-right:2px}.aj-share-btn{appearance:none;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.08);color:#fff;min-height:42px;padding:9px 13px;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;gap:8px;font:800 .76rem 'Manrope',sans-serif;cursor:pointer;transition:.2s ease;text-decoration:none}.aj-share-btn:hover{background:#fff;color:#183c5a;border-color:#fff;transform:translateY(-1px)}.aj-share-btn.whatsapp{background:#fff;color:#183c5a;border-color:#fff}.aj-share-btn.whatsapp:hover{background:#f1d38a;border-color:#f1d38a}.aj-share-btn svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;flex:0 0 auto}.aj-share-btn.whatsapp svg{fill:currentColor;stroke:none}.aj-share-toast{position:fixed;left:50%;bottom:24px;transform:translate(-50%,18px);z-index:99999;background:#183c5a;color:#fff;border:1px solid rgba(255,255,255,.18);padding:10px 14px;border-radius:999px;font:800 .78rem 'Manrope',sans-serif;box-shadow:0 12px 30px rgba(0,0,0,.2);opacity:0;pointer-events:none;transition:.2s ease}.aj-share-toast.show{opacity:1;transform:translate(-50%,0)}
      @media(max-width:768px){.aj-trip-share{margin-top:13px;gap:7px}.aj-trip-share-label{width:100%;font-size:.64rem}.aj-share-btn{min-height:38px;padding:8px 10px;border-radius:10px;font-size:.69rem;gap:6px;flex:1 1 auto}.aj-share-btn svg{width:15px;height:15px}.aj-share-toast{bottom:16px;max-width:calc(100vw - 28px);text-align:center}}
    `;document.head.appendChild(s);
  }
  function render(){
    addStyles();
    let box=document.getElementById('ajTripShare');
    if(!box){
      const heroBtns=document.querySelector('.trip-hero .hero-btns');
      const host=heroBtns?heroBtns.parentElement:document.querySelector('.trip-hero-copy');
      if(!host)return;
      box=document.createElement('div');box.id='ajTripShare';box.className='aj-trip-share notranslate';box.setAttribute('translate','no');
      host.appendChild(box);
    }
    const x=t();
    box.innerHTML=`<span class="aj-trip-share-label">${x.label}</span><button class="aj-share-btn whatsapp" type="button" data-aj-share="whatsapp" aria-label="${x.whatsapp}">${icon('whatsapp')}<span>${x.whatsapp}</span></button><button class="aj-share-btn" type="button" data-aj-share="copy" aria-label="${x.copy}">${icon('copy')}<span>${x.copy}</span></button><button class="aj-share-btn" type="button" data-aj-share="native" aria-label="${x.native}">${icon('share')}<span>${x.native}</span></button>`;
    const native=box.querySelector('[data-aj-share="native"]');if(native&&!navigator.share)native.style.display='none';
    box.querySelector('[data-aj-share="whatsapp"]')?.addEventListener('click',whatsapp);
    box.querySelector('[data-aj-share="copy"]')?.addEventListener('click',copyLink);
    box.querySelector('[data-aj-share="native"]')?.addEventListener('click',nativeShare);
  }
  function boot(){
    render();
    const mo=new MutationObserver(ms=>{for(const m of ms){if(m.type==='attributes'&&m.attributeName==='lang'){render();break;}}});
    mo.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,60),{once:true});else setTimeout(boot,60);
})();
