(function(){
  'use strict';

  const isSubdir=/\/(?:Ausgewaehlte-Reisen|Reisearten)\//i.test((location.pathname||'').replace(/\\/g,'/'));
  const rootPrefix=isSubdir?'../':'';
  const heartSvg='<svg viewBox="0 0 24 24" aria-hidden="true"><path class="aj-heart-shape" d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/></svg>';
  const shareSvg='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.5-4.4M8.2 13.2l7.5 4.4"/></svg>';
  const transportIcons={
    plane:'<svg class="aj-plane-svg" viewBox="0 0 512 512" aria-hidden="true"><path d="M256 0c17.7 0 32 14.3 32 32v32l176 80v48l-176-48v112l48 32v32l-80-16-80 16v-32l48-32V144L48 192v-48l176-80V32c0-17.7 14.3-32 32-32Z" transform="rotate(45 256 256)"/></svg>',
    car:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17h14l-1.5-6h-11L5 17Z"/><path d="M7 11l1.4-3h7.2l1.4 3M4 17v2M20 17v2"/><circle cx="7.5" cy="17" r="1.2"/><circle cx="16.5" cy="17" r="1.2"/></svg>',
    bus:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="16" rx="3"/><path d="M7 7h10M7 13h10M8 19v2M16 19v2"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>',
    boat:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13h16l-3 5H7l-3-5Z"/><path d="M9 13V6h5l3 3H9M3 20c2 1.3 4 1.3 6 0 2 1.3 4 1.3 6 0 2 1.3 4 1.3 6 0"/></svg>',
    hike:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="13" cy="4" r="2"/><path d="m11 7-2 5 3 2 2 7M10 10l5 2 3-3M9 12l-4 8M12 14l-4 2"/></svg>'
  };
  const transportLabels={plane:'Flug',car:'Auto',bus:'Bus',boat:'Boot',hike:'Wandern'};
  const transportImageFiles={plane:'icon-airplane.png',car:'icon-car.png',bus:'icon-bus.png'};
  function transportSvg(kind){const k=kind||'car';const visual=transportImageFiles[k]?`<img class="aj-transport-img aj-transport-${k}" src="${rootPrefix}${transportImageFiles[k]}?v=5" alt="" aria-hidden="true">`:(transportIcons[k]||transportIcons.car);return `<span class="aj-transport-icon" role="img" aria-label="${transportLabels[k]||'Transport'}">${visual}</span>`}
  const checkSvg='<svg class="aj-check-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></svg>';

  function safeJSON(key,fallback){try{const v=JSON.parse(localStorage.getItem(key));return v??fallback}catch(e){return fallback}}
  function tripList(){try{return typeof window.trips==='function'?window.trips():[]}catch(e){return []}}
  function currentTrip(){try{return typeof window.getTrip==='function'?window.getTrip():null}catch(e){return null}}
  function money(n){try{return typeof window.euro==='function'?window.euro(n):new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Number(n)||0)}catch(e){return `${Number(n)||0} €`}}
  function toastMessage(msg){try{if(typeof window.toast==='function'){window.toast(msg);return}}catch(e){} const old=document.querySelector('.toast');if(old){old.textContent=msg;old.classList.add('show');setTimeout(()=>old.classList.remove('show'),2100)}}
  function tripPage(id){
    const reisearten={
      'reiseart-kultur':'Reisearten/reiseart-kultur.html',
      'reiseart-trekking':'Reisearten/reiseart-trekking.html',
      'reiseart-abenteuer':'Reisearten/reiseart-abenteuer.html',
      'reiseart-natur':'Reisearten/reiseart-natur.html',
      'reiseart-individual':'Reisearten/reiseart-individual.html',
      'reiseart-mobilitaet':'reisen.html?cat=Reisen%20f%C3%BCr%20Personen%20mit%20k%C3%B6rperlicher%20Beeintr%C3%A4chtigung',
      'reiseart-senioren':'Reisearten/reiseart-senioren.html',
      'reiseart-hochzeit':'Reisearten/reiseart-hochzeit-verlobung.html',
      senior:'Reisearten/reiseart-senioren.html',
      romance:'Reisearten/reiseart-hochzeit-verlobung.html'
    };
    if(reisearten[id])return rootPrefix+reisearten[id];
    const file={north:'reise-north.html',south:'reise-south.html',simien:'reise-simien.html',danakil:'reise-danakil.html',harar:'reise-harar.html',photo:'reise-photo.html',family:'reise-family.html',private:'reise-private.html',comfort:'reise-comfort.html'}[id]||'reise.html';
    return isSubdir&&/\/Ausgewaehlte-Reisen\//i.test(location.pathname)?file:rootPrefix+'Ausgewaehlte-Reisen/'+file
  }
  function bookingHref(t,mode='book'){const q=new URLSearchParams();if(t?.id)q.set('id',t.id);q.set('mode',mode);return rootPrefix+'buchung.html?'+q.toString()}
  function contactHref(type='video'){return rootPrefix+'kontakt.html?art='+encodeURIComponent(type)}

  function patchLanguageMenu(){
    const menu=document.getElementById('langMenu');
    if(!menu)return;
    const he=menu.querySelector('[data-lang="he"]');
    if(he && !he.querySelector('img[src*="/il.png"]')) he.innerHTML='<img src="flags/il.png" srcset="flags/il.png 2x" alt="עברית"><span>עברית</span>';
    if(!menu.querySelector('[data-lang="tr"]')){
      const btn=document.createElement('button');btn.type='button';btn.dataset.lang='tr';btn.setAttribute('aria-label','Türkçe');btn.innerHTML='<img src="flags/tr.png" srcset="flags/tr.png 2x" alt="Türkçe"><span>Türkçe</span>';menu.appendChild(btn);
    }
  }

  function applyClientV8LateStyles(){
    if(document.getElementById('aj-client-v8-late'))return;
    const style=document.createElement('style');
    style.id='aj-client-v8-late';
    style.textContent=`
/* Late v8 overrides: appended after the legacy inline style blocks. */
@media(min-width:821px){
 #langMenu.langmenu{width:min(330px,calc(100vw - 26px))!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:7px!important;padding:9px!important}
 #langMenu.langmenu button{min-width:0!important;justify-content:center!important;gap:7px!important;padding:10px 8px!important;text-align:center!important}
 #langMenu.langmenu button .aj-lang-short{font:800 .76rem 'Manrope',sans-serif!important;letter-spacing:.09em!important;min-width:20px!important;text-align:center!important}
}
.site-nav .aj-wishlist-trigger{width:44px!important;height:44px!important;border-radius:50%!important;border:1px solid transparent!important;background:transparent!important;color:rgba(255,255,255,.96)!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
.site-nav .aj-wishlist-trigger .aj-heart-shape{fill:rgba(255,255,255,.18)!important;stroke:rgba(255,255,255,.96)!important;stroke-width:1.8!important}
.site-nav .aj-wishlist-trigger:hover{background:rgba(255,255,255,.06)!important;color:#fff!important;border-color:rgba(255,255,255,.16)!important}
.site-nav .aj-wishlist-trigger:hover .aj-heart-shape{fill:rgba(255,255,255,.28)!important;stroke:#fff!important}
.site-nav .aj-wishlist-trigger.on{background:linear-gradient(145deg,#b95b42,#9f4633)!important;color:#fff!important;border-color:rgba(255,255,255,.42)!important}
.site-nav .aj-wishlist-trigger.on .aj-heart-shape{fill:currentColor!important;stroke:currentColor!important}
.site-nav .aj-wishlist-count{background:var(--clay,#b24d37)!important;border-color:#0c2942!important}
.promo-banner::after{display:none!important;animation:none!important}.promo-badge{animation:none!important}.promo-title,.promo-copy{transition:none!important}
body.top-strip-collapsed .site-top{transform:none!important;max-height:none!important;opacity:1!important;visibility:visible!important}
body.top-strip-collapsed .site-nav,body.top-strip-collapsed .site-nav.scrolled{top:0!important}
.aj-trip-subnav{top:var(--aj-main-nav-height,78px)!important;z-index:260!important;background:#fff!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;box-shadow:0 8px 20px rgba(24,60,90,.08)!important}
.trip-photo-grid{height:clamp(170px,13vw,245px)!important}
.trip-hero-copy{padding:22px 20px 24px!important;min-height:0!important}
.trip-hero-copy h1{font-size:clamp(2rem,3.2vw,3.35rem)!important;margin:7px 0 9px!important}
.trip-hero-copy>p{margin-bottom:10px!important;line-height:1.45!important}.trip-facts{margin:12px 0!important;gap:7px!important}.trip-fact{padding:9px 11px!important}
.trip-hero .hero-btns .btn{min-height:40px!important;padding:9px 13px!important}.trip-photo-gallery .aj-trip-media-caption{bottom:10px!important;padding:6px 10px!important}
.listing-hero{padding:30px 0 24px!important}.listing-hero h1{font-size:clamp(2.15rem,4.4vw,3.8rem)!important;margin:7px 0 9px!important}.listing-hero .lead{font-size:.98rem!important;line-height:1.45!important;margin-bottom:0!important}
.listing-stat{padding:11px 13px!important;border-radius:14px!important}.listing-stat strong{font-size:1.4rem!important}.listing-hero:after{font-size:6.2rem!important;bottom:-42px!important}
.date-row.aj-date-row.is-filtered-out,.date-row.aj-date-row[hidden]{display:none!important}.aj-status-red{background:#a53f3f!important}
.nav-dropdown-menu.aj-private-travel-menu{width:min(440px,calc(100vw - 28px))!important;grid-template-columns:1fr 1fr!important}
@media(max-width:768px){
 .site-nav.scrolled .nav-inner,body.top-strip-collapsed .site-nav .nav-inner,body.top-strip-collapsed .site-nav.scrolled .nav-inner{height:76px!important;min-height:76px!important;padding:0 8px 0 128px!important}
 .site-nav.scrolled .brand,body.top-strip-collapsed .site-nav .brand,body.top-strip-collapsed .site-nav.scrolled .brand{left:2px!important;top:3px!important;width:132px!important;height:96px!important;min-width:132px!important}
 .site-nav.scrolled .brand-emblem,.site-nav.scrolled .brand-logo,body.top-strip-collapsed .site-nav .brand-emblem,body.top-strip-collapsed .site-nav .brand-logo{width:132px!important;height:96px!important;min-width:132px!important}
 .site-nav .navlinks{top:76px!important}
 .nav-dropdown-menu.aj-private-travel-menu{width:100%!important;grid-template-columns:1fr!important}
 .trip-photo-grid{height:210px!important;grid-template-rows:1fr 1fr!important}
}
@media(max-width:390px){
 .site-nav.scrolled .nav-inner,body.top-strip-collapsed .site-nav .nav-inner{padding-left:112px!important;padding-right:5px!important}
 .site-nav.scrolled .brand,body.top-strip-collapsed .site-nav .brand{width:116px!important;height:86px!important;min-width:116px!important}
 .site-nav.scrolled .brand-emblem,.site-nav.scrolled .brand-logo,body.top-strip-collapsed .site-nav .brand-emblem,body.top-strip-collapsed .site-nav .brand-logo{width:116px!important;height:86px!important;min-width:116px!important}
}
`;
    (document.body||document.documentElement).appendChild(style);
  }

  function enhanceBanner(){
    const banner=document.querySelector('.promo-banner');if(!banner||banner.dataset.ajEnhanced)return;
    banner.dataset.ajEnhanced='1';
    /* Keep the promotional strip calm and readable; no rotating copy behind sticky headers. */
    banner.classList.remove('aj-changing');
  }

  function getFavs(){
    const favs=safeJSON('aj_favs',[]);
    return Array.isArray(favs)?favs.map(String).filter(Boolean):[];
  }
  function getSavedTrips(){
    const saved=safeJSON('aj_saved_trips',[]);
    return Array.isArray(saved)?saved.filter(x=>x&&x.id):[];
  }
  function cloneTrip(t){
    if(!t||typeof t!=='object')return null;
    try{return JSON.parse(JSON.stringify(t))}catch(e){return {...t}}
  }
  function cardTripData(id,sourceEl){
    const button=sourceEl?.closest?.('[data-fav]')||[...document.querySelectorAll('[data-fav]')].find(b=>String(b.dataset.fav)===String(id));
    const card=button?.closest?.('.trip-card,.popular-trip-card,.reiseart-card');if(!card)return null;
    const details=card.querySelector('.trip-foot a[href],a.btn[href],.popular-trip-cta[href],.reiseart-card-link[href],a.reiseart-card-media[href]');
    const img=card.querySelector('img');
    const meta=[...card.querySelectorAll('.trip-meta span,.popular-trip-meta span')].map(x=>x.textContent.trim()).filter(Boolean);
    const kicker=card.querySelector('.kicker')?.textContent?.trim()||card.querySelector('.reiseart-card-badge')?.textContent?.trim()||'';
    const priceText=card.querySelector('.trip-price strong,.popular-trip-price strong')?.textContent?.trim()||'';
    const numericPrice=Number(priceText.replace(/\./g,'').replace(/,/g,'.').replace(/[^0-9.]/g,''))||0;
    const reiseartDescription=card.querySelector('.reiseart-card-info > p:not(.reiseart-card-place)')?.textContent?.trim()||'';
    return {
      id:String(id),
      title:card.querySelector('h3')?.textContent?.trim()||String(id),
      subtitle:card.querySelector('.muted,.popular-trip-desc')?.textContent?.trim()||reiseartDescription,
      category:card.classList.contains('reiseart-card')?'Reiseart':(kicker.split('·')[0]?.trim()||''),
      days:Number((meta[0]||'').match(/\d+/)?.[0])||'',
      group:(meta[1]||'').replace(/\s*Pers\.?/i,'').replace(/^Gruppe:\s*/i,'').trim(),
      level:(meta[2]||'').replace(/^Niveau:\s*/i,'').trim(),
      image:img?.getAttribute('src')||'',
      tag:card.querySelector('.trip-badge,.popular-trip-tag,.reiseart-card-badge')?.textContent?.trim()||'',
      price:numericPrice,
      priceText,
      href:details?.getAttribute('href')||tripPage(id)
    };
  }
  function resolveTripRecord(id,sourceEl){
    id=String(id||'');if(!id)return null;
    const all=tripList();
    let t=Array.isArray(all)?all.find(x=>x&&String(x.id)===id):null;
    const cur=currentTrip();if(!t&&cur&&String(cur.id)===id)t=cur;
    const dom=cardTripData(id,sourceEl);
    const existing=getSavedTrips().find(x=>String(x.id)===id);
    const merged={...(existing||{}),...(cloneTrip(t)||{}),...(dom||{}),id};
    if(!merged.title)merged.title=id;
    if(!merged.href)merged.href=tripPage(id);
    if(!merged.savedAt)merged.savedAt=new Date().toISOString();
    return merged;
  }
  function syncSavedTrips(favs=getFavs(),sourceEl){
    const ids=[...new Set((Array.isArray(favs)?favs:[]).map(String).filter(Boolean))];
    const existing=new Map(getSavedTrips().map(t=>[String(t.id),t]));
    const records=ids.map(id=>resolveTripRecord(id,sourceEl)||existing.get(id)||{id,title:id,href:tripPage(id),savedAt:new Date().toISOString()});
    try{localStorage.setItem('aj_saved_trips',JSON.stringify(records))}catch(e){}
    return records;
  }
  function setFavs(favs,sourceEl){
    const clean=[...new Set((Array.isArray(favs)?favs:[]).map(String).filter(Boolean))];
    localStorage.setItem('aj_favs',JSON.stringify(clean));
    syncSavedTrips(clean,sourceEl);
    window.dispatchEvent(new CustomEvent('aj:favs-changed'));
  }
  function toggleFav(id,sourceEl){
    if(!id)return;
    id=String(id);let favs=getFavs();
    favs=favs.includes(id)?favs.filter(x=>x!==id):[...favs,id];
    setFavs(favs,sourceEl);
    toastMessage(favs.includes(id)?'Reise vollständig gespeichert':'Aus Merkliste entfernt');
    return favs.includes(id);
  }

  function setupWishlist(){
    const actions=document.querySelector('.nav-actions');if(!actions||document.querySelector('.aj-wishlist-trigger'))return;
    const trigger=document.createElement('button');trigger.type='button';trigger.className='aj-wishlist-trigger';trigger.setAttribute('aria-label','Gespeicherte Reisen öffnen');trigger.setAttribute('title','Gespeicherte Reisen');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls','aj-wishlist-overlay');trigger.innerHTML=heartSvg+'<span class="aj-wishlist-count"></span>';
    const lang=actions.querySelector('.langwrap');actions.insertBefore(trigger,lang||actions.firstChild);
    const overlay=document.createElement('div');overlay.id='aj-wishlist-overlay';overlay.className='aj-wishlist-overlay';overlay.setAttribute('aria-hidden','true');overlay.innerHTML='<aside class="aj-wishlist-drawer" role="dialog" aria-modal="true" aria-label="Gespeicherte Reisen"><div class="aj-wishlist-head"><div><span class="aj-wishlist-eyebrow">Reise-Speicher</span><h2>Gespeicherte Reisen</h2></div><button class="aj-wishlist-close" type="button" aria-label="Gespeicherte Reisen schließen">×</button></div><p class="aj-wishlist-intro">Alle Reisen, die Sie mit dem Herz markieren, werden hier mit ihren Reisedaten gespeichert.</p><div class="aj-wishlist-list"></div></aside>';document.body.appendChild(overlay);
    const list=overlay.querySelector('.aj-wishlist-list');
    function esc(v){return String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
    function render(){
      const favs=getFavs(),saved=syncSavedTrips(favs),all=tripList(),count=trigger.querySelector('.aj-wishlist-count');count.textContent=favs.length?String(favs.length):'';trigger.classList.toggle('on',favs.length>0);
      document.querySelectorAll('[data-fav]').forEach(b=>{const on=favs.includes(String(b.dataset.fav));b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on))});
      document.querySelectorAll('[data-aj-current-fav]').forEach(b=>{const id=String(b.dataset.ajCurrentFav),on=favs.includes(id);b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on))});
      if(!favs.length){list.innerHTML='<div class="aj-wishlist-empty"><strong>Noch keine Reise gespeichert.</strong><br><small>Drücken Sie bei einer Reise auf das Herz. Die komplette Reise wird dann hier im oberen Speicher abgelegt.</small></div>';return}
      const savedMap=new Map(saved.map(x=>[String(x.id),x]));
      list.innerHTML=favs.map(id=>{
        const live=Array.isArray(all)?all.find(x=>x&&String(x.id)===String(id)):null;
        const t={...(savedMap.get(String(id))||{}),...(cloneTrip(live)||{}),id:String(id)};
        const storedHref=String(t.href||'');
        const href=storedHref?(isSubdir&&!/^(?:\.\.\/|\/|https?:|mailto:|tel:|#)/i.test(storedHref)?rootPrefix+storedHref:storedHref):tripPage(id),title=t.title||id,img=t.image||'',days=t.days?`${esc(t.days)} Tage`:'';
        const group=t.group?`${esc(t.group)} Pers.`:'',price=t.price?`ab ${esc(money(t.price))}`:(t.priceText?esc(t.priceText):'');
        const meta=[days,group,price].filter(Boolean).join(' · ');
        const sub=t.subtitle||t.category||'Gespeicherte Reise';
        return `<article class="aj-wishlist-item" data-saved-trip="${esc(id)}"><a class="aj-wishlist-image" href="${esc(href)}">${img?`<img src="${esc(img)}" alt="${esc(title)}" loading="lazy" onerror="this.style.display='none'">`:'<span class="aj-wishlist-image-fallback" aria-hidden="true">♥</span>'}</a><div class="aj-wishlist-copy"><a href="${esc(href)}"><strong>${esc(title)}</strong></a><p>${esc(sub)}</p>${meta?`<small>${meta}</small>`:''}<a class="aj-wishlist-details" href="${esc(href)}">Reise öffnen →</a></div><button class="aj-wishlist-remove" type="button" data-remove-fav="${esc(id)}" aria-label="Aus gespeicherten Reisen entfernen">×</button></article>`
      }).join('');
    }
    let lastWishlistFocus=null;
    function open(){
      if(overlay.classList.contains('is-open'))return;
      lastWishlistFocus=document.activeElement;render();overlay.classList.add('is-open');overlay.setAttribute('aria-hidden','false');trigger.setAttribute('aria-expanded','true');document.body.classList.add('aj-modal-open');
      requestAnimationFrame(()=>overlay.querySelector('.aj-wishlist-close')?.focus());
    }
    function close(){
      if(!overlay.classList.contains('is-open'))return;
      overlay.classList.remove('is-open');overlay.setAttribute('aria-hidden','true');trigger.setAttribute('aria-expanded','false');document.body.classList.remove('aj-modal-open');
      const focusTarget=lastWishlistFocus&&document.contains(lastWishlistFocus)?lastWishlistFocus:trigger;
      requestAnimationFrame(()=>focusTarget?.focus?.());
    }
    trigger.addEventListener('click',open);
    overlay.querySelector('.aj-wishlist-close').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();close()});
    overlay.addEventListener('click',e=>{if(e.target===overlay){close();return}const rem=e.target.closest('[data-remove-fav]');if(rem){setFavs(getFavs().filter(x=>x!==String(rem.dataset.removeFav)),rem);render()}});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('is-open')){e.preventDefault();close()}});
    document.addEventListener('click',e=>{const favButton=e.target.closest('[data-fav]');if(!favButton)return;e.preventDefault();e.stopImmediatePropagation();toggleFav(favButton.dataset.fav,favButton)},true);
    window.addEventListener('aj:favs-changed',render);window.addEventListener('storage',render);render();
  }

  function enhanceNavCategories(){
    const groupsDrop=document.querySelector('.nav-dropdown-groups');
    if(groupsDrop){
      const groupBlocks=[...groupsDrop.querySelectorAll('.drop-group')];
      const byLabel=(label)=>groupBlocks.find(g=>g.querySelector(':scope > .drop-row span')?.textContent.trim().toLowerCase().includes(label));
      const regionGroup=byLabel('region');
      const themeGroup=byLabel('thema');
      const durationGroup=byLabel('dauer');

      const setLinks=(group,links)=>{
        const menu=group?.querySelector('.drop-submenu');if(!menu)return;
        menu.innerHTML=links.map(([label,href])=>`<a href="${href}">${label}</a>`).join('');
      };

      setLinks(regionGroup,[
        ['Nordäthiopien-Rundreisen',rootPrefix+'reisen.html?region=nord'],
        ['Südäthiopien-Rundreisen',rootPrefix+'reisen.html?region=sued'],
        ['Ostäthiopien-Rundreisen',rootPrefix+'reisen.html?region=ost'],
        ['Westäthiopien-Rundreisen',rootPrefix+'reisen.html?region=west']
      ]);

      setLinks(themeGroup,[
        ['Kulturreisen',rootPrefix+'reisen.html?cat=Kultur'],
        ['Natur & Trekking',rootPrefix+'reisen.html?cat=Wandern'],
        ['Abenteuerreisen',rootPrefix+'reisen.html?cat=Abenteuer'],
        ['Fotografie',rootPrefix+'reisen.html?cat=Foto'],
        ['Kurzreisen',rootPrefix+'reisen.html?thema=kurzreisen'],
        ['UNESCO-Welterbe',rootPrefix+'reisen.html?thema=unesco'],
        ['Campingreisen',rootPrefix+'reisen.html?thema=camping'],
        ['Familienreisen',rootPrefix+'reisen.html?cat=Familie'],
        ['Reisen für Personen mit körperlicher Beeinträchtigung',rootPrefix+'reisen.html?cat='+encodeURIComponent('Reisen für Personen mit körperlicher Beeinträchtigung')]
      ]);

      if(durationGroup){
        const menu=durationGroup.querySelector('.drop-submenu');
        if(menu){
          [...menu.querySelectorAll('a')].forEach(a=>{
            const txt=a.textContent.trim();
            if(txt==='Seniorenreisen'||txt==='Hochzeits- & Verlobungsreisen')a.remove();
          });
        }
      }
    }

    const privateLink=document.querySelector('.nav-main-link [data-i18n="private"]')?.closest('.nav-dropdown');
    const privateMenu=privateLink?.querySelector('.nav-dropdown-menu');
    if(privateMenu){
      privateMenu.classList.remove('compact');
      privateMenu.classList.add('aj-private-travel-menu');
      privateMenu.innerHTML=[
        ['Fotografie',rootPrefix+'Ausgewaehlte-Reisen/reise-photo.html'],
        ['Familienreisen',rootPrefix+'Ausgewaehlte-Reisen/reise-family.html'],
        ['Seniorenreisen',rootPrefix+'Reisearten/reiseart-senioren.html'],
        ['Hochzeits- & Verlobungsreisen',rootPrefix+'Reisearten/reiseart-hochzeit-verlobung.html'],
        ['Rundreisen',rootPrefix+'individualreisen.html'],
        ['Spezialreisen (z. B. VIP)',rootPrefix+'reisen.html?cat=VIP']
      ].map(([label,href])=>`<a class="drop-row" href="${href}"><span>${label}</span></a>`).join('');
    }
  }

  function enhanceContact(){
    const form=document.querySelector('.contact-form');let select=null;
    if(form){
      form.id=form.id||'beratungForm';
      select=[...form.querySelectorAll('select')].find(s=>s.closest('.form-control')?.querySelector('label')?.textContent.includes('Beratungsart'))||null;
      if(select&&!([...select.options].some(o=>/Video/i.test(o.textContent)))){const o=document.createElement('option');o.textContent='Videoberatung';o.value='Videoberatung';select.appendChild(o)}
      const requested=new URLSearchParams(location.search).get('art');
      if(select&&requested==='video'){
        const opt=[...select.options].find(o=>/Video/i.test(o.textContent));if(opt)select.value=opt.value;
        if(!form.querySelector('.aj-video-note')){const note=document.createElement('div');note.className='aj-video-note full';note.textContent='Videoberatung ausgewählt – bitte Wunschtermin und Uhrzeit angeben.';select.closest('.form-grid')?.appendChild(note)}
      }
    }
    const methods=document.querySelector('.contact-methods');
    if(methods){
      methods.classList.add('aj-three-methods');
      let box=methods.querySelector('.aj-video-method');
      if(!box){box=document.createElement('div');box.className='contact-method aj-video-method';box.innerHTML='<span><svg class="ui-icon inline-page-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="13" height="14" rx="2"></rect><path d="M16 9l5-3v12l-5-3z"></path></svg></span><strong>Videoberatung</strong><small>Persönliche Reiseplanung</small>';methods.appendChild(box)}
      if(!box.dataset.ajBound){box.dataset.ajBound='1';box.tabIndex=0;const go=()=>{if(select){const opt=[...select.options].find(o=>/Video/i.test(o.textContent));if(opt)select.value=opt.value}document.getElementById('beratungForm')?.scrollIntoView({behavior:'smooth',block:'start'})};box.addEventListener('click',go);box.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})}
    }
  }

  function enhanceBooking(){
    const params=new URLSearchParams(location.search),mode=params.get('mode');if(!mode)return;
    const heading=document.querySelector('h1');const submit=document.querySelector('.booking-submit');
    if(mode==='book'){if(heading)heading.textContent='Ihre Buchung.';if(submit)submit.textContent='Buchung verbindlich anfragen →'}
    if(mode==='request'){if(heading)heading.textContent='Ihre Reiseanfrage.';if(submit)submit.textContent='Unverbindliche Anfrage senden →'}
    if(mode==='term'){if(heading)heading.textContent='Termin vorschlagen.';if(submit)submit.textContent='Terminvorschlag senden →'}
  }

  const DETAIL_CONFIG={
    north:{ezz:450,stay:'Landestypische Hotels & Lodges',transport:['plane','car','bus'],highlights:['Lalibela und seine Felsenkirchen','Kaiserstädte Gondar & Axum','Historisches Hochland mit lokalen Begegnungen','Kleine Gruppe mit flexiblem Reisetempo']},
    south:{ezz:390,stay:'Lodges & landestypische Hotels',transport:['plane','car','boat'],highlights:['Omo-Tal und südliche Kulturräume','Seenlandschaften & Bootserlebnisse','Persönliche Begegnungen mit Respekt und Zeit','Kleine Gruppe und lokale Reiseleitung']},
    simien:{ezz:320,stay:'Lodges, Camps & Hotels',transport:['plane','car','hike'],highlights:['Panoramen im Simien-Gebirge','Aktive Trekkingtage mit Guide','Geladas und Hochlandnatur','Kleine Gruppe für flexible Etappen']},
    danakil:{ezz:280,stay:'Einfache Lodges, Camps & Hotels',transport:['plane','car','hike'],highlights:['Danakil-Senke und Dallol','Vulkanische Landschaften','Salzfelder und außergewöhnliche Lichtstimmungen','Expeditionscharakter in kleiner Gruppe']},
    'reiseart-abenteuer':{ezz:280,stay:'Einfache Lodges, Camps & Hotels',transport:['plane','car','hike'],highlights:['Danakil-Senke und Dallol','Vulkanische Landschaften und Salzfelder','Expeditionscharakter in kleiner Gruppe','Außergewöhnliche Naturerlebnisse abseits klassischer Routen']},
    harar:{ezz:390,stay:'Landestypische Hotels & Lodges',transport:['plane','car','bus'],highlights:['Historische Gassen von Harar','Bale-Hochland und Natur','Märkte und lokale Begegnungen','Kultur und Natur in einer Route']},
    photo:{ezz:420,stay:'Ausgewählte Hotels & Lodges',transport:['plane','car','bus'],highlights:['Mehr Zeit für Motive und Licht','Märkte, Landschaften und Begegnungen','Fotostopps ohne Zeitdruck','Kleine Gruppe für kreative Flexibilität']},
    family:{ezz:350,stay:'Familienfreundliche Hotels & Lodges',transport:['plane','car','boat'],highlights:['Entspanntes Reisetempo','Seen, Natur und Tierbeobachtung','Bootserlebnisse für die ganze Familie','Flexible Pausen und familiengerechte Etappen']},
    private:{ezz:590,stay:'Ausgewählte Hotels, Lodges & Resorts',transport:['plane','car','boat'],highlights:['Eigener Guide und flexible Route','Ihr persönliches Reisetempo','Ausgewählte Unterkünfte','Individuelle Verlängerungen möglich']},
    comfort:{ezz:490,stay:'Komfort-Hotels, Lodges & Resorts',transport:['plane','car','bus'],highlights:['Weniger Transfers, mehr Zeit vor Ort','Komfortorientierte Reiseplanung','Ausgewählte Unterkünfte','Barrierearme Optionen nach Möglichkeit']},
    senior:{ezz:450,stay:'Komfortable Hotels & Lodges mit guter Erreichbarkeit',transport:['plane','car','bus'],highlights:['Entspanntes Reisetempo mit längeren Pausen','Weniger Hotelwechsel und sinnvoll geplante Etappen','Persönliche Begleitung und individuelle Anpassungen','Komfortable Unterkünfte nach Verfügbarkeit']},
    romance:{ezz:0,stay:'Ausgewählte Boutique-Hotels, Lodges & besondere Unterkünfte',transport:['plane','car','boat'],highlights:['Private Reise zu zweit mit eigenem Guide','Besondere Orte für Verlobung, Hochzeitsreise oder Jubiläum','Romantische Unterkünfte und gemeinsame Genussmomente','Flexible Planung mit Zeit für Fotos und persönliche Wünsche']}
  };
  function groupParts(group){const m=String(group||'4–12').match(/(\d+)\D+(\d+)/);return m?{min:m[1],max:m[2]}:{min:'4',max:'12'}}
  function tripDetailsCard(t){
    const base=DETAIL_CONFIG[t.id]||{ezz:390,stay:'Landestypische Hotels, Lodges & Resorts',transport:['plane','car','bus','boat'],highlights:[]};
    const cfg={...base,...(t.detailConfig||{})};
    const g=groupParts(t.group),min=t.minParticipants||g.min,max=t.maxParticipants||g.max;
    const code=t.bookingNumber||('AJ-'+String(t.id||'REISE').toUpperCase());
    const reiseart=t.tripType||((t.id==='private'||String(t.id||'').includes('individual'))?'Individualreise':'Gruppenreise');
    const transport=Array.isArray(t.transport)&&t.transport.length?t.transport:cfg.transport;
    const stay=t.accommodation||t.stay||cfg.stay;
    const guidePrimary=t.guideLanguage||'Englisch';
    const guideGerman=t.germanGuideNote||'Deutsch ab 8 Reisenden auf Anfrage';
    const guideAi=t.aiLanguageNote||'Weitere Sprachen mit KI-unterstützter Hardware auf Anfrage';
    return `<div class="aj-trip-details-card"><h3>Details Ihrer Reise</h3><dl class="aj-detail-list"><div class="aj-detail-row"><dt>Reiseart</dt><dd>${reiseart}<small>${t.category||''}</small></dd></div><div class="aj-detail-row"><dt>Teilnehmer</dt><dd>mind. ${min} Reisende<small>max. ${max} Reisende</small></dd></div><div class="aj-detail-row"><dt>Reiseleitung</dt><dd>${guidePrimary}<small>${guideGerman}</small><small>${guideAi}</small></dd></div><div class="aj-detail-row"><dt>Transport</dt><dd><span class="aj-transport-icons">${transport.map(x=>transportSvg(x)).join('')}</span></dd></div><div class="aj-detail-row"><dt>Unterbringung</dt><dd>${stay}</dd></div><div class="aj-detail-row"><dt>Buchungsnummer</dt><dd>${code}</dd></div></dl><div class="aj-detail-actions"><a class="btn forest aj-price-cta" href="${bookingHref(t,'book')}">ab ${money(t.price)} o. Flug<small> · m. Flug auf Anfrage</small></a><button class="aj-icon-btn" type="button" data-aj-current-fav="${t.id}" aria-label="Reise merken">${heartSvg}</button><button class="aj-icon-btn" type="button" data-aj-share aria-label="Reise teilen">${shareSvg}</button></div></div>`
  }

  function addTripSubnav(t){
    // V11: trip section navigation lives inside the main header.
    // No separate third bar is created on trip detail pages.
    document.querySelectorAll('.aj-trip-subnav').forEach(el=>el.remove());
    const mainNav=document.querySelector('.site-nav');
    const linksHost=mainNav?.querySelector('.navlinks');
    if(!mainNav||!linksHost)return;

    linksHost.classList.add('aj-trip-main-links');
    linksHost.setAttribute('aria-label','Reisenavigation');
    linksHost.innerHTML=`<a href="#ueberblick">Überblick</a><a href="#termine">Termine / Preise</a><a href="#verlauf">Reiseablauf / Karte</a><a href="#leistungen">Leistungen</a><a href="#hinweise">Hinweise</a>`;

    const links=[...linksHost.querySelectorAll('a[href^="#"]')];
    const menuBtn=mainNav.querySelector('.menuBtn');
    links.forEach(a=>a.addEventListener('click',e=>{
      const hash=a.getAttribute('href');
      const target=document.querySelector(hash);
      if(!target)return;
      e.preventDefault();
      e.stopPropagation();
      target.scrollIntoView({behavior:'smooth',block:'start'});
      history.replaceState(null,'',`${location.pathname}${location.search}${hash}`);
      linksHost.classList.remove('open');
      menuBtn?.classList.remove('menu-open');
      menuBtn?.setAttribute('aria-expanded','false');
    }));

    const targets=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
    if('IntersectionObserver'in window){
      const ob=new IntersectionObserver(entries=>{
        const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
        if(!visible)return;
        links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+visible.target.id));
      },{rootMargin:'-135px 0px -58% 0px',threshold:[0,.1,.35]});
      targets.forEach(x=>ob.observe(x));
    }
  }

  function enhanceTripMedia(t){const gallery=document.querySelector('#tripPhotoGallery');if(gallery&&!gallery.querySelector('.aj-trip-media-caption')){const cap=document.createElement('div');cap.className='aj-trip-media-caption';cap.textContent='Bilder & Video dieser Reise';gallery.appendChild(cap)}const video=t?.heroVideo||t?.video;if(video){const media=document.querySelector('.trip-hero-media');if(media)media.innerHTML=`<video src="${video}" poster="${t.image||''}" muted loop autoplay playsinline controls aria-label="Video: ${t.title||'Reise'}"></video>`}}

  function enhanceHeroActions(t){const buttons=document.querySelector('.trip-hero .hero-btns');if(!buttons)return;buttons.innerHTML=`<a class="btn gold" href="${bookingHref(t,'book')}">Buchen</a><a class="btn dark-outline aj-btn-request" href="${bookingHref(t,'request')}">Anfragen</a><a class="btn dark-outline aj-btn-video" href="${contactHref('video')}">Videoberatung</a>`}

  function enhanceOverview(t){const sec=document.getElementById('ueberblick'),term=document.getElementById('termine');if(!sec)return;if(term&&term.previousElementSibling!==sec)term.parentNode.insertBefore(sec,term);const kicker=sec.querySelector('.kicker');if(kicker)kicker.textContent='Highlights Ihrer Reise';const h2=sec.querySelector('h2');if(h2)h2.textContent=t.title;const lead=sec.querySelector('.lead');if(lead)lead.textContent=t.subtitle;const cfg=DETAIL_CONFIG[t.id]||DETAIL_CONFIG.north,points=sec.querySelector('.points'),highlights=(Array.isArray(t.highlights)&&t.highlights.length?t.highlights:cfg.highlights);if(points)points.innerHTML=highlights.map(x=>`<div class="point"><strong>${checkSvg}<span>${x}</span></strong></div>`).join('');const right=sec.querySelector('#overviewImg')||sec.querySelector('.overview-image');if(right)right.innerHTML=tripDetailsCard(t)}

  function parsePrice(txt,fallback){const cleaned=String(txt||'').replace(/\./g,'').replace(/[^0-9]/g,'');return Number(cleaned)||fallback}
  function statusFor(text){
    const s=String(text||'').toLowerCase();
    if(s==='red'||s.includes('ausgebucht')||s.includes('sold out'))return {cls:'red',label:'leider ausgebucht'};
    if(s==='green'||s.includes('mindestteilnehmerzahl erreicht')||s.includes('findet statt'))return {cls:'green',label:'findet statt'};
    if(s==='orange'||s.includes('wenige')||s.includes('schnell'))return {cls:'orange',label:'nur noch wenige Plätze frei'};
    return {cls:'yellow',label:'mit Ihnen Mindestzahl'};
  }
  function enhanceDates(t){
    const wrap=document.getElementById('dates');if(!wrap||wrap.dataset.ajEnhanced)return;wrap.dataset.ajEnhanced='1';
    const base=DETAIL_CONFIG[t.id]||{ezz:390},defaultEzz=Number(t.ezz)||base.ezz;
    const domRaw=[...wrap.querySelectorAll('.date-row')].map((row,i)=>{const strong=row.querySelectorAll('strong'),date=strong[0]?.textContent.trim()||'',price=parsePrice(strong[1]?.textContent,t.price),status=statusFor(row.querySelector('.availability')?.textContent),year=(date.match(/20\d{2}/g)||[]).pop()||'';return {date,price,ezz:defaultEzz,status,year,index:i}});
    const supplied=Array.isArray(t.dates)?t.dates.filter(Boolean):[];
    const raw=supplied.length?supplied.map((d,i)=>{const date=d.label||[d.start,d.end].filter(Boolean).join(' – ')||d.date||'',year=String(d.year||(String(date).match(/20\d{2}/g)||[]).pop()||'');return {date,price:Number(d.price)||Number(t.price)||0,ezz:Number(d.ezz)||defaultEzz,status:statusFor(d.status||d.availability),year,index:i}}):domRaw;
    const toolbar=document.createElement('div');toolbar.className='aj-date-toolbar';toolbar.innerHTML='<div class="aj-year-filter"><strong>Reisejahr auswählen</strong><div class="aj-year-checks">'+[2026,2027,2028,2029,2030].map(y=>`<label><input type="checkbox" value="${y}" checked> ${y}</label>`).join('')+'</div></div><div class="aj-traffic-legend"><strong>Verfügbarkeit</strong><div class="aj-legend-items"><span class="aj-legend-item"><i class="aj-status-dot aj-status-green"></i> findet statt</span><span class="aj-legend-item"><i class="aj-status-dot aj-status-yellow"></i> mit Ihnen Mindestzahl</span><span class="aj-legend-item"><i class="aj-status-dot aj-status-orange"></i> nur noch wenige Plätze frei</span><span class="aj-legend-item"><i class="aj-status-dot aj-status-red"></i> leider ausgebucht</span></div></div>';wrap.before(toolbar);
    const head=document.createElement('div');head.className='aj-date-head';head.innerHTML='<span>Termin</span><span>Preis p. P.</span><span>EZZ</span><span>Status</span><span>Aktion</span>';wrap.before(head);
    wrap.innerHTML=raw.map(r=>`<div class="date-row aj-date-row" data-year="${r.year}"><strong>${r.date}</strong><strong>${money(r.price)}</strong><strong>+ ${money(r.ezz)}</strong><span class="availability"><i class="aj-status-dot aj-status-${r.status.cls}"></i>${r.status.label}</span><span class="aj-date-actions"><a class="btn aj-book" href="${bookingHref(t,'book')}&termin=${encodeURIComponent(r.date)}">Buchen</a><a class="btn aj-request" href="${bookingHref(t,'request')}&termin=${encodeURIComponent(r.date)}">Anfragen</a></span></div>`).join('');
    const empty=document.createElement('div');empty.className='aj-no-dates';empty.innerHTML='Für die ausgewählten Jahre sind noch keine festen Termine hinterlegt. <strong>Nutzen Sie „Termin vorschlagen“ für Ihre Frühplanung.</strong>';wrap.after(empty);
    const footer=document.createElement('div');footer.className='aj-date-footer';footer.innerHTML=`<p>Langfristige Planung für 2027–2030 ist vorgesehen. Weitere Termine können ergänzt werden, sobald die Termintabelle vorliegt.</p><a class="btn forest" href="${bookingHref(t,'term')}">Termin vorschlagen</a>`;empty.after(footer);
    function filter(){const years=[...toolbar.querySelectorAll('input:checked')].map(x=>x.value);let visible=0;wrap.querySelectorAll('[data-year]').forEach(row=>{const show=years.includes(row.dataset.year);row.hidden=!show;row.classList.toggle('is-filtered-out',!show);row.setAttribute('aria-hidden',String(!show));if(show)visible++});empty.classList.toggle('is-visible',visible===0)}toolbar.addEventListener('change',filter);toolbar.addEventListener('input',filter);filter();
  }

  function enhanceHints(){const faq=document.getElementById('faq');if(faq&&!document.getElementById('hinweise')){const anchor=document.createElement('div');anchor.id='hinweise';anchor.className='aj-hinweise-anchor';faq.before(anchor)}}
  function setupTripButtons(t){document.addEventListener('click',async e=>{const fav=e.target.closest('[data-aj-current-fav]');if(fav){e.preventDefault();toggleFav(fav.dataset.ajCurrentFav);return}const sh=e.target.closest('[data-aj-share]');if(sh){e.preventDefault();const data={title:t.title,text:t.subtitle,url:location.href};try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(location.href);toastMessage('Link zur Reise kopiert')}}catch(err){}}})}

  function enhanceTripDetail(){const t=currentTrip();if(!t||!document.querySelector('.trip-hero'))return;enhanceTripMedia(t);enhanceHints();addTripSubnav(t);enhanceHeroActions(t);enhanceOverview(t);enhanceDates(t);setupTripButtons(t);window.dispatchEvent(new CustomEvent('aj:favs-changed'))}

  function sanitizeGroupListingCategories(){
    if(!/\/reisen\.html$/i.test(location.pathname||''))return;
    const forbidden=new Set(['Seniorenreisen','Hochzeits- & Verlobungsreisen']);
    const cat=document.getElementById('cat'),tags=document.getElementById('tags');
    if(cat){[...cat.options].forEach(o=>{if(forbidden.has(o.value)||forbidden.has(o.textContent.trim()))o.remove()})}
    if(tags){[...tags.querySelectorAll('[data-v]')].forEach(b=>{if(forbidden.has(b.dataset.v)||forbidden.has(b.textContent.trim()))b.remove()})}
    document.querySelectorAll('#allTrips .trip-card').forEach(card=>{
      const id=card.querySelector('[data-fav]')?.dataset.fav;
      if(id==='senior'||id==='romance')card.remove();
    });
    const count=document.getElementById('tripCount');
    if(count)count.textContent=String(document.querySelectorAll('#allTrips .trip-card').length||9);
  }

  function stabilizeHeader(){
    const nav=document.querySelector('.site-nav');
    const sync=()=>{
      document.body.classList.remove('top-strip-collapsed');
      const h=Math.max(0,Math.round(nav?.getBoundingClientRect().height||0));
      if(h)document.documentElement.style.setProperty('--aj-main-nav-height',`${h}px`);
    };
    sync();
    window.addEventListener('resize',sync,{passive:true});
    window.addEventListener('pageshow',sync,{passive:true});
    window.addEventListener('scroll',()=>requestAnimationFrame(()=>document.body.classList.remove('top-strip-collapsed')),{passive:true});
  }

  function boot(){applyClientV8LateStyles();patchLanguageMenu();enhanceBanner();stabilizeHeader();setupWishlist();enhanceNavCategories();enhanceContact();enhanceBooking();enhanceTripDetail();sanitizeGroupListingCategories();setTimeout(()=>{patchLanguageMenu();enhanceNavCategories();setupWishlist();sanitizeGroupListingCategories();stabilizeHeader()},180)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
