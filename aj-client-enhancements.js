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
  function tripPage(id){if(id==='senior')return rootPrefix+'Reisearten/reiseart-senioren.html';if(id==='romance')return rootPrefix+'Reisearten/reiseart-hochzeit-verlobung.html';const file={north:'reise-north.html',south:'reise-south.html',simien:'reise-simien.html',danakil:'reise-danakil.html',harar:'reise-harar.html',photo:'reise-photo.html',family:'reise-family.html',private:'reise-private.html',comfort:'reise-comfort.html'}[id]||'reise.html';return isSubdir&&/\/Ausgewaehlte-Reisen\//i.test(location.pathname)?file:rootPrefix+'Ausgewaehlte-Reisen/'+file}
  function bookingHref(t,mode='book'){const q=new URLSearchParams();if(t?.id)q.set('id',t.id);q.set('mode',mode);return rootPrefix+'buchung.html?'+q.toString()}
  function contactHref(type='video'){return rootPrefix+'kontakt.html?art='+encodeURIComponent(type)}

  function patchLanguageMenu(){
    const menu=document.getElementById('langMenu');
    if(!menu)return;
    const he=menu.querySelector('[data-lang="he"]');
    if(he && !he.querySelector('img[src*="/il.png"]')) he.innerHTML='<img src="https://flagcdn.com/28x21/il.png" srcset="https://flagcdn.com/56x42/il.png 2x" alt="עברית"><span>עברית</span>';
    if(!menu.querySelector('[data-lang="tr"]')){
      const btn=document.createElement('button');btn.type='button';btn.dataset.lang='tr';btn.setAttribute('aria-label','Türkçe');btn.innerHTML='<img src="https://flagcdn.com/28x21/tr.png" srcset="https://flagcdn.com/56x42/tr.png 2x" alt="Türkçe"><span>Türkçe</span>';menu.appendChild(btn);
    }
  }

  function enhanceBanner(){
    const banner=document.querySelector('.promo-banner');if(!banner||banner.dataset.ajEnhanced)return;banner.dataset.ajEnhanced='1';
    const title=banner.querySelector('.promo-title'),copy=banner.querySelector('.promo-copy');if(!title||!copy)return;
    const messages=[
      ['Spezialreisen & Rabattaktionen','Besondere Reisetermine, Restplätze und zeitlich begrenzte Angebote auf einen Blick.'],
      ['Früh planen: 2027–2030','Langfristige Reisetermine und individuelle Terminwünsche frühzeitig vormerken.'],
      ['Besondere Reisen & Restplätze','Ausgewählte Reiseideen, persönliche Beratung und kurzfristig verfügbare Plätze.']
    ];
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    let i=0;setInterval(()=>{i=(i+1)%messages.length;banner.classList.add('aj-changing');setTimeout(()=>{title.textContent=messages[i][0];copy.textContent=messages[i][1];banner.classList.remove('aj-changing')},240)},5600);
  }

  function getFavs(){return safeJSON('aj_favs',[])}
  function setFavs(favs){localStorage.setItem('aj_favs',JSON.stringify([...new Set(favs)]));window.dispatchEvent(new CustomEvent('aj:favs-changed'))}
  function toggleFav(id){if(!id)return;let favs=getFavs();favs=favs.includes(id)?favs.filter(x=>x!==id):[...favs,id];setFavs(favs);toastMessage(favs.includes(id)?'Reise gespeichert':'Aus Merkliste entfernt');return favs.includes(id)}

  function setupWishlist(){
    const actions=document.querySelector('.nav-actions');if(!actions||document.querySelector('.aj-wishlist-trigger'))return;
    const trigger=document.createElement('button');trigger.type='button';trigger.className='aj-wishlist-trigger';trigger.setAttribute('aria-label','Merkliste öffnen');trigger.innerHTML=heartSvg+'<span class="aj-wishlist-count"></span>';
    const lang=actions.querySelector('.langwrap');actions.insertBefore(trigger,lang||actions.firstChild);
    const overlay=document.createElement('div');overlay.className='aj-wishlist-overlay';overlay.setAttribute('aria-hidden','true');overlay.innerHTML='<aside class="aj-wishlist-drawer" role="dialog" aria-modal="true" aria-label="Merkliste"><div class="aj-wishlist-head"><h2>Merkliste</h2><button class="aj-wishlist-close" type="button" aria-label="Merkliste schließen">×</button></div><div class="aj-wishlist-list"></div></aside>';document.body.appendChild(overlay);
    const list=overlay.querySelector('.aj-wishlist-list');
    function render(){
      const favs=getFavs(),all=tripList(),count=trigger.querySelector('.aj-wishlist-count');count.textContent=favs.length?String(favs.length):'';
      document.querySelectorAll('[data-fav]').forEach(b=>{const on=favs.includes(b.dataset.fav);b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on))});
      document.querySelectorAll('[data-aj-current-fav]').forEach(b=>{const id=b.dataset.ajCurrentFav,on=favs.includes(id);b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on))});
      if(!favs.length){list.innerHTML='<div class="aj-wishlist-empty"><strong>Noch keine Reise gemerkt.</strong><br><small>Mit dem Herz können Reisen hier gesammelt werden.</small></div>';return}
      list.innerHTML=favs.map(id=>{const t=all.find(x=>x.id===id);if(!t)return `<div class="aj-wishlist-item"><div></div><div><strong>${id}</strong><small>Gespeicherte Reise</small></div><button class="aj-wishlist-remove" data-remove-fav="${id}" aria-label="Entfernen">×</button></div>`;return `<div class="aj-wishlist-item"><a href="${tripPage(id)}"><img src="${t.image||''}" alt="${t.title||id}" loading="lazy"></a><div><a href="${tripPage(id)}"><strong>${t.title||id}</strong></a><small>${t.days||''} Tage · ab ${money(t.price)}</small></div><button class="aj-wishlist-remove" data-remove-fav="${id}" aria-label="Aus Merkliste entfernen">×</button></div>`}).join('');
    }
    function open(){render();overlay.classList.add('is-open');overlay.setAttribute('aria-hidden','false');document.body.classList.add('aj-modal-open');overlay.querySelector('.aj-wishlist-close')?.focus()}
    function close(){overlay.classList.remove('is-open');overlay.setAttribute('aria-hidden','true');document.body.classList.remove('aj-modal-open')}
    trigger.addEventListener('click',open);overlay.querySelector('.aj-wishlist-close').addEventListener('click',close);overlay.addEventListener('click',e=>{if(e.target===overlay)close();const rem=e.target.closest('[data-remove-fav]');if(rem){setFavs(getFavs().filter(x=>x!==rem.dataset.removeFav));render()}});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    document.addEventListener('click',e=>{if(e.target.closest('[data-fav]'))setTimeout(render,30)},true);window.addEventListener('aj:favs-changed',render);window.addEventListener('storage',render);render();
  }

  function enhanceNavCategories(){
    document.querySelectorAll('.nav-dropdown-groups .drop-submenu').forEach(menu=>{
      const additions=[['Seniorenreisen',rootPrefix+'Reisearten/reiseart-senioren.html'],['Hochzeits- & Verlobungsreisen',rootPrefix+'Reisearten/reiseart-hochzeit-verlobung.html']];
      additions.forEach(([label,href])=>{if([...menu.querySelectorAll('a')].some(a=>a.textContent.trim()===label))return;const a=document.createElement('a');a.href=href;a.textContent=label;menu.appendChild(a)});
    });
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
    if(document.querySelector('.aj-trip-subnav'))return;const gallery=document.querySelector('#tripPhotoGallery'),hero=document.querySelector('.trip-hero');if(!hero)return;
    const nav=document.createElement('nav');nav.className='aj-trip-subnav';nav.setAttribute('aria-label','Reisenavigation');nav.innerHTML=`<div class="aj-trip-subnav-inner"><div class="aj-trip-subnav-links"><a href="#ueberblick">Überblick</a><a href="#termine">Termine / Preise</a><a href="#verlauf">Reiseablauf / Karte</a><a href="#leistungen">Leistungen</a><a href="#hinweise">Hinweise</a></div><div class="aj-trip-action"><button type="button" aria-haspopup="true" aria-expanded="false">Reise anfragen ▾</button><div class="aj-trip-action-menu"><a href="${bookingHref(t,'book')}">Buchen</a><a href="${bookingHref(t,'request')}">Anfrage</a><a href="${bookingHref(t,'term')}">Terminanfrage</a></div></div></div>`;
    (gallery||hero).insertAdjacentElement('afterend',nav);const action=nav.querySelector('.aj-trip-action'),btn=action.querySelector('button');btn.addEventListener('click',e=>{e.stopPropagation();action.classList.toggle('is-open');btn.setAttribute('aria-expanded',String(action.classList.contains('is-open')))});document.addEventListener('click',()=>{action.classList.remove('is-open');btn.setAttribute('aria-expanded','false')});
    const links=[...nav.querySelectorAll('.aj-trip-subnav-links a')];const targets=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);if('IntersectionObserver'in window){const ob=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;links.forEach(a=>a.classList.toggle('is-active',a.getAttribute('href')==='#'+visible.target.id))},{rootMargin:'-170px 0px -55% 0px',threshold:[0,.1,.4]});targets.forEach(x=>ob.observe(x))}
  }

  function enhanceTripMedia(t){const gallery=document.querySelector('#tripPhotoGallery');if(gallery&&!gallery.querySelector('.aj-trip-media-caption')){const cap=document.createElement('div');cap.className='aj-trip-media-caption';cap.textContent='Bilder & Video dieser Reise';gallery.appendChild(cap)}const video=t?.heroVideo||t?.video;if(video){const media=document.querySelector('.trip-hero-media');if(media)media.innerHTML=`<video src="${video}" poster="${t.image||''}" muted loop autoplay playsinline controls aria-label="Video: ${t.title||'Reise'}"></video>`}}

  function enhanceHeroActions(t){const buttons=document.querySelector('.trip-hero .hero-btns');if(!buttons)return;buttons.innerHTML=`<a class="btn gold" href="${bookingHref(t,'book')}">Buchen</a><a class="btn dark-outline aj-btn-request" href="${bookingHref(t,'request')}">Anfragen</a><a class="btn dark-outline aj-btn-video" href="${contactHref('video')}">Videoberatung</a>`}

  function enhanceOverview(t){const sec=document.getElementById('ueberblick'),term=document.getElementById('termine');if(!sec)return;if(term&&term.previousElementSibling!==sec)term.parentNode.insertBefore(sec,term);const kicker=sec.querySelector('.kicker');if(kicker)kicker.textContent='Highlights Ihrer Reise';const h2=sec.querySelector('h2');if(h2)h2.textContent=t.title;const lead=sec.querySelector('.lead');if(lead)lead.textContent=t.subtitle;const cfg=DETAIL_CONFIG[t.id]||DETAIL_CONFIG.north,points=sec.querySelector('.points'),highlights=(Array.isArray(t.highlights)&&t.highlights.length?t.highlights:cfg.highlights);if(points)points.innerHTML=highlights.map(x=>`<div class="point"><strong>${checkSvg}<span>${x}</span></strong></div>`).join('');const right=sec.querySelector('#overviewImg')||sec.querySelector('.overview-image');if(right)right.innerHTML=tripDetailsCard(t)}

  function parsePrice(txt,fallback){const cleaned=String(txt||'').replace(/\./g,'').replace(/[^0-9]/g,'');return Number(cleaned)||fallback}
  function statusFor(text){
    const s=String(text||'').toLowerCase();
    if(s==='green'||s.includes('mindestteilnehmerzahl erreicht')||s.includes('findet statt'))return {cls:'green',label:'Mindestteilnehmerzahl erreicht – Reise findet statt'};
    if(s==='orange'||s.includes('wenige')||s.includes('schnell'))return {cls:'orange',label:'Schnell buchen – nur noch wenige Plätze verfügbar'};
    return {cls:'yellow',label:'Mit Ihnen Mindestteilnehmerzahl erreicht'}
  }
  function enhanceDates(t){
    const wrap=document.getElementById('dates');if(!wrap||wrap.dataset.ajEnhanced)return;wrap.dataset.ajEnhanced='1';
    const base=DETAIL_CONFIG[t.id]||{ezz:390},defaultEzz=Number(t.ezz)||base.ezz;
    const domRaw=[...wrap.querySelectorAll('.date-row')].map((row,i)=>{const strong=row.querySelectorAll('strong'),date=strong[0]?.textContent.trim()||'',price=parsePrice(strong[1]?.textContent,t.price),status=statusFor(row.querySelector('.availability')?.textContent),year=(date.match(/20\d{2}/g)||[]).pop()||'';return {date,price,ezz:defaultEzz,status,year,index:i}});
    const supplied=Array.isArray(t.dates)?t.dates.filter(Boolean):[];
    const raw=supplied.length?supplied.map((d,i)=>{const date=d.label||[d.start,d.end].filter(Boolean).join(' – ')||d.date||'',year=String(d.year||(String(date).match(/20\d{2}/g)||[]).pop()||'');return {date,price:Number(d.price)||Number(t.price)||0,ezz:Number(d.ezz)||defaultEzz,status:statusFor(d.status||d.availability),year,index:i}}):domRaw;
    const toolbar=document.createElement('div');toolbar.className='aj-date-toolbar';toolbar.innerHTML='<div class="aj-year-filter"><strong>Reisejahr auswählen</strong><div class="aj-year-checks">'+[2026,2027,2028,2029,2030].map(y=>`<label><input type="checkbox" value="${y}" checked> ${y}</label>`).join('')+'</div></div><div class="aj-traffic-legend"><strong>Verfügbarkeit</strong><div class="aj-legend-items"><span class="aj-legend-item"><i class="aj-status-dot aj-status-green"></i> findet statt</span><span class="aj-legend-item"><i class="aj-status-dot aj-status-yellow"></i> mit Ihnen Mindestzahl</span><span class="aj-legend-item"><i class="aj-status-dot aj-status-orange"></i> wenige Plätze</span></div></div>';wrap.before(toolbar);
    const head=document.createElement('div');head.className='aj-date-head';head.innerHTML='<span>Termin</span><span>Preis p. P.</span><span>EZZ</span><span>Status</span><span>Aktion</span>';wrap.before(head);
    wrap.innerHTML=raw.map(r=>`<div class="date-row aj-date-row" data-year="${r.year}"><strong>${r.date}</strong><strong>${money(r.price)}</strong><strong>+ ${money(r.ezz)}</strong><span class="availability"><i class="aj-status-dot aj-status-${r.status.cls}"></i>${r.status.label}</span><span class="aj-date-actions"><a class="btn aj-book" href="${bookingHref(t,'book')}&termin=${encodeURIComponent(r.date)}">Buchen</a><a class="btn aj-request" href="${bookingHref(t,'request')}&termin=${encodeURIComponent(r.date)}">Anfragen</a></span></div>`).join('');
    const empty=document.createElement('div');empty.className='aj-no-dates';empty.innerHTML='Für die ausgewählten Jahre sind noch keine festen Termine hinterlegt. <strong>Nutzen Sie „Termin vorschlagen“ für Ihre Frühplanung.</strong>';wrap.after(empty);
    const footer=document.createElement('div');footer.className='aj-date-footer';footer.innerHTML=`<p>Langfristige Planung für 2027–2030 ist vorgesehen. Weitere Termine können ergänzt werden, sobald die Termintabelle vorliegt.</p><a class="btn forest" href="${bookingHref(t,'term')}">Termin vorschlagen</a>`;empty.after(footer);
    function filter(){const years=[...toolbar.querySelectorAll('input:checked')].map(x=>x.value);let visible=0;wrap.querySelectorAll('[data-year]').forEach(row=>{const show=years.includes(row.dataset.year);row.hidden=!show;if(show)visible++});empty.classList.toggle('is-visible',visible===0)}toolbar.addEventListener('change',filter);filter();
  }

  function enhanceHints(){const faq=document.getElementById('faq');if(faq&&!document.getElementById('hinweise')){const anchor=document.createElement('div');anchor.id='hinweise';anchor.className='aj-hinweise-anchor';faq.before(anchor)}}
  function setupTripButtons(t){document.addEventListener('click',async e=>{const fav=e.target.closest('[data-aj-current-fav]');if(fav){e.preventDefault();toggleFav(fav.dataset.ajCurrentFav);return}const sh=e.target.closest('[data-aj-share]');if(sh){e.preventDefault();const data={title:t.title,text:t.subtitle,url:location.href};try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(location.href);toastMessage('Link zur Reise kopiert')}}catch(err){}}})}

  function enhanceTripDetail(){const t=currentTrip();if(!t||!document.querySelector('.trip-hero'))return;enhanceTripMedia(t);enhanceHints();addTripSubnav(t);enhanceHeroActions(t);enhanceOverview(t);enhanceDates(t);setupTripButtons(t);window.dispatchEvent(new CustomEvent('aj:favs-changed'))}

  function enhanceListingCategories(){
    const cat=document.getElementById('cat'),tags=document.getElementById('tags');if(!cat||!tags)return;
    const additions=[['Seniorenreisen','Seniorenreisen'],['Hochzeits- & Verlobungsreisen','Hochzeits- & Verlobungsreisen']];
    function showPreparedState(val){
      if(!additions.some(([,v])=>v===val))return;
      setTimeout(()=>{const grid=document.getElementById('allTrips');if(!grid)return;const hasTrip=grid.querySelector('.trip-card');if(hasTrip)return;grid.innerHTML=`<div class="empty"><h3>${val}</h3><p class="muted">Diese Reiseart ist bereits im System vorbereitet. Konkrete Reisen, Bilder, Preise und Termine werden mit den kommenden Reisedaten ergänzt.</p><a class="btn forest" href="${contactHref('video')}">Persönliche Beratung / Video</a></div>`},20)
    }
    additions.forEach(([label,val])=>{
      if(![...cat.options].some(o=>o.value===val)){const o=document.createElement('option');o.value=val;o.textContent=label;cat.appendChild(o)}
      if(![...tags.querySelectorAll('[data-v]')].some(b=>b.dataset.v===val)){const b=document.createElement('button');b.className='tagbtn';b.dataset.v=val;b.textContent=label;b.addEventListener('click',()=>{tags.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');cat.value=val;cat.dispatchEvent(new Event('input',{bubbles:true}));showPreparedState(val)});tags.appendChild(b)}
    });
    cat.addEventListener('input',()=>showPreparedState(cat.value));
    const requested=new URLSearchParams(location.search).get('cat');if(additions.some(([,v])=>v===requested)){cat.value=requested;tags.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x.dataset.v===requested));cat.dispatchEvent(new Event('input',{bubbles:true}));showPreparedState(requested)}
  }

  function boot(){patchLanguageMenu();enhanceBanner();setupWishlist();enhanceNavCategories();enhanceContact();enhanceBooking();enhanceTripDetail();enhanceListingCategories();setTimeout(()=>{patchLanguageMenu();enhanceNavCategories();setupWishlist()},180)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
