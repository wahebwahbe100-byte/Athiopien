(function(){
'use strict';

const P={
 addis:[9.0301,38.7497],bishoftu:[8.7500,38.9833],debrelibanos:[9.7282,38.8680],bahirdar:[11.5742,37.3614],bluenile:[11.4864,37.5872],gondar:[12.6030,37.4521],debark:[13.1561,37.8981],sankaber:[13.2385,38.0333],geech:[13.2447,38.0950],imetgogo:[13.2540,38.1170],chenek:[13.2607,38.1900],axum:[14.1211,38.7234],yeha:[14.2850,39.0180],lalibela:[12.0317,39.0476],
 mekele:[13.4967,39.4753],berhale:[13.8520,40.0200],hamedela:[14.0930,40.2770],dallol:[14.2417,40.3000],karum:[14.1710,40.3090],ertaale:[13.6000,40.6700],awash:[8.9833,40.1667],harar:[9.3099,42.1258],diredawa:[9.5931,41.8661],babile:[9.2200,42.3300],dinsho:[7.1000,39.7833],goba:[7.0100,39.9700],sanetti:[6.9000,39.9000],harenna:[6.6500,39.7300],
 ziway:[7.9360,38.7160],shashemene:[7.2000,38.6000],hawassa:[7.0621,38.4764],yirgaalem:[6.7500,38.4200],langano:[7.6080,38.7070],arbaminch:[6.0333,37.5500],dorze:[6.1800,37.5700],nechisar:[6.0500,37.6667],konso:[5.3010,37.4310],jinka:[5.7833,36.5667],mago:[5.5100,36.2500],turmi:[4.9667,36.4833],dimeka:[4.5150,36.2350],omorate:[4.8000,35.9833],
 dessie:[11.1333,39.6333],kombolcha:[11.0833,39.7333]
};
const stop=(name,key,meta)=>({name,lat:P[key][0],lng:P[key][1],meta:meta||''});
// Every trip has its own explicit route. The arrows are drawn from these points only.
const ROUTES={
 north:{label:'Felsenkirchen & Kaiserstädte',arrowRepeat:'54px',stops:[stop('Addis Abeba','addis','Start'),stop('Debre Libanos','debrelibanos','Kloster & Schlucht'),stop('Bahir Dar','bahirdar','Tanasee'),stop('Blue Nile Falls','bluenile','Wasserfälle'),stop('Gondar','gondar','Kaiserstadt'),stop('Debark','debark','Tor zum Simien'),stop('Axum','axum','Stelen & Geschichte'),stop('Yeha','yeha','Antikes Heiligtum'),stop('Lalibela','lalibela','Felsenkirchen'),stop('Addis Abeba','addis','Rückkehr')]},
 south:{label:'Völker des Südens · Omo-Tal',arrowRepeat:'48px',stops:[stop('Addis Abeba','addis','Start'),stop('Ziway','ziway','Rift Valley'),stop('Shashemene','shashemene','Südroute'),stop('Hawassa','hawassa','See'),stop('Yirga Alem','yirgaalem','Kaffeehochland'),stop('Arba Minch','arbaminch','Seenland'),stop('Dorze','dorze','Bergdorf'),stop('Konso','konso','Kulturlandschaft'),stop('Jinka','jinka','Tor zum Omo'),stop('Mago Nationalpark','mago','Omo-Gebiet'),stop('Turmi','turmi','Hamar'),stop('Dimeka','dimeka','Marktregion'),stop('Omorate','omorate','Omo-Fluss'),stop('Turmi','turmi','Rückweg'),stop('Arba Minch','arbaminch','Rückweg'),stop('Addis Abeba','addis','Ende')]},
 simien:{label:'Dach Afrikas · Simien Trekking',arrowRepeat:'42px',stops:[stop('Addis Abeba','addis','Start'),stop('Gondar','gondar','Anreise'),stop('Debark','debark','Nationalpark'),stop('Sankaber','sankaber','Trekkingstart'),stop('Geech','geech','Camp'),stop('Imet Gogo','imetgogo','Aussichtspunkt'),stop('Chenek','chenek','Hochgebirge'),stop('Debark','debark','Trekkingende'),stop('Gondar','gondar','Rückfahrt'),stop('Addis Abeba','addis','Ende')]},
 danakil:{label:'Feuer & Salz · Danakil',arrowRepeat:'50px',stops:[stop('Addis Abeba','addis','Start'),stop('Mekele','mekele','Expeditionsstart'),stop('Berhale','berhale','Afar-Land'),stop('Hamed Ela','hamedela','Wüstencamp'),stop('Dallol','dallol','Hydrothermalgebiet'),stop('Lake Karum','karum','Salzsee'),stop('Erta Ale','ertaale','Vulkan'),stop('Hamed Ela','hamedela','Rückweg'),stop('Mekele','mekele','Expeditionsende'),stop('Addis Abeba','addis','Ende')]},
 harar:{label:'Harar & Bale',arrowRepeat:'52px',stops:[stop('Addis Abeba','addis','Start'),stop('Awash','awash','Nationalpark'),stop('Dire Dawa','diredawa','Ostäthiopien'),stop('Harar','harar','Altstadt'),stop('Babile','babile','Elefantenschutzgebiet'),stop('Goba','goba','Bale'),stop('Dinsho','dinsho','Nationalpark'),stop('Sanetti Plateau','sanetti','Hochplateau'),stop('Harenna Forest','harenna','Bergwald'),stop('Addis Abeba','addis','Ende')]},
 photo:{label:'Licht des Hochlands · Fotoreise',arrowRepeat:'46px',stops:[stop('Addis Abeba','addis','Start'),stop('Debre Libanos','debrelibanos','Schlucht & Kloster'),stop('Bahir Dar','bahirdar','Tanasee'),stop('Blue Nile Falls','bluenile','Landschaft'),stop('Gondar','gondar','Architektur'),stop('Debark','debark','Simien-Licht'),stop('Sankaber','sankaber','Panorama'),stop('Lalibela','lalibela','Felsenkirchen'),stop('Addis Abeba','addis','Ende')]},
 family:{label:'Seen, Natur & Familie',arrowRepeat:'56px',stops:[stop('Addis Abeba','addis','Start'),stop('Bishoftu','bishoftu','Kraterseen'),stop('Ziway','ziway','Vögel & See'),stop('Langano','langano','Badesee'),stop('Shashemene','shashemene','Zwischenstopp'),stop('Hawassa','hawassa','Seeufer'),stop('Arba Minch','arbaminch','Seen & Berge'),stop('Nech Sar','nechisar','Safari'),stop('Addis Abeba','addis','Ende')]},
 private:{label:'Äthiopien Privat',arrowRepeat:'58px',stops:[stop('Addis Abeba','addis','Start'),stop('Lalibela','lalibela','Kultur'),stop('Axum','axum','Geschichte'),stop('Gondar','gondar','Kaiserstadt'),stop('Bahir Dar','bahirdar','Tanasee'),stop('Awash','awash','Natur'),stop('Harar','harar','Altstadt'),stop('Addis Abeba','addis','Flexibles Ende')]},
 comfort:{label:'Äthiopien komfortabel',arrowRepeat:'62px',stops:[stop('Addis Abeba','addis','Start'),stop('Bishoftu','bishoftu','Entspannt ankommen'),stop('Bahir Dar','bahirdar','Tanasee'),stop('Gondar','gondar','Kaiserstadt'),stop('Lalibela','lalibela','Felsenkirchen'),stop('Addis Abeba','addis','Ende')]},
 // Reisearten: jede Reiseart besitzt eine eigene Beispielroute und eigene Pfeilfolge.
 'reiseart-kultur':{label:'Kulturreisen in Äthiopien',arrowRepeat:'52px',stops:[stop('Addis Abeba','addis','Start'),stop('Debre Libanos','debrelibanos','Kloster'),stop('Bahir Dar','bahirdar','Tanasee'),stop('Gondar','gondar','Kaiserstadt'),stop('Axum','axum','Stelen'),stop('Yeha','yeha','Antikes Heiligtum'),stop('Lalibela','lalibela','Felsenkirchen'),stop('Addis Abeba','addis','Ende')]},
 'reiseart-trekking':{label:'Trekkingreisen in Äthiopien',arrowRepeat:'42px',stops:[stop('Addis Abeba','addis','Start'),stop('Gondar','gondar','Anreise ins Hochland'),stop('Debark','debark','Nationalpark'),stop('Sankaber','sankaber','Trekkingstart'),stop('Geech','geech','Camp'),stop('Imet Gogo','imetgogo','Panorama'),stop('Chenek','chenek','Hochgebirge'),stop('Debark','debark','Trekkingende'),stop('Addis Abeba','addis','Ende')]},
 'reiseart-abenteuer':{label:'Abenteuerreisen in Äthiopien',arrowRepeat:'48px',stops:[stop('Addis Abeba','addis','Start'),stop('Mekele','mekele','Expeditionsstart'),stop('Berhale','berhale','Afar-Land'),stop('Hamed Ela','hamedela','Wüstencamp'),stop('Dallol','dallol','Hydrothermalgebiet'),stop('Lake Karum','karum','Salzsee'),stop('Erta Ale','ertaale','Vulkan'),stop('Mekele','mekele','Rückkehr'),stop('Addis Abeba','addis','Ende')]},
 'reiseart-natur':{label:'Naturreisen in Äthiopien',arrowRepeat:'54px',stops:[stop('Addis Abeba','addis','Start'),stop('Awash','awash','Savanne & Wildtiere'),stop('Dinsho','dinsho','Bale Nationalpark'),stop('Goba','goba','Bergwelt'),stop('Sanetti Plateau','sanetti','Hochplateau'),stop('Harenna Forest','harenna','Bergwald'),stop('Hawassa','hawassa','See & Vogelwelt'),stop('Langano','langano','Rift Valley'),stop('Addis Abeba','addis','Ende')]},
 'reiseart-individual':{label:'Individualreisen in Äthiopien',arrowRepeat:'58px',stops:[stop('Addis Abeba','addis','Start'),stop('Lalibela','lalibela','Kulturbaustein'),stop('Gondar','gondar','Historisches Hochland'),stop('Bahir Dar','bahirdar','Tanasee'),stop('Hawassa','hawassa','Rift Valley'),stop('Arba Minch','arbaminch','Seenland'),stop('Konso','konso','Kulturlandschaft'),stop('Addis Abeba','addis','Flexibles Ende')]}
};

const UI={
 de:{title:'Reiseverlauf und Karte',desc:'Tag für Tag durch Äthiopien – die Karte bleibt stehen, während sich die Route beim Scrollen aufbaut.',itinerary:'Reiseverlauf',map:'Karte',play:'Route abspielen',pause:'Pause',overview:'Gesamte Route',open:'In Google Maps öffnen',loading:'Google Maps wird geladen …',unavailable:'Google Maps konnte nicht geladen werden.',key:'Bitte Google Maps API Key in aj-google-maps-config.js eintragen.',day:'Tag',route:'Reiseroute'},
 en:{title:'Itinerary and map',desc:'Day by day through Ethiopia – the map stays fixed while the route builds as you scroll.',itinerary:'Itinerary',map:'Map',play:'Play route',pause:'Pause',overview:'Full route',open:'Open in Google Maps',loading:'Loading Google Maps …',unavailable:'Google Maps could not be loaded.',key:'Please add the Google Maps API key in aj-google-maps-config.js.',day:'Day',route:'Route'},
 ar:{title:'برنامج الرحلة والخريطة',desc:'يومًا بعد يوم في إثيوبيا — الخريطة ثابتة والمسار يتقدّم تدريجيًا أثناء النزول.',itinerary:'برنامج الرحلة',map:'الخريطة',play:'تشغيل المسار',pause:'إيقاف',overview:'عرض المسار كاملًا',open:'فتح في خرائط Google',loading:'جارٍ تحميل خرائط Google…',unavailable:'تعذر تحميل خرائط Google.',key:'يرجى إضافة Google Maps API Key في ملف aj-google-maps-config.js.',day:'اليوم',route:'مسار الرحلة'},
 he:{title:'מסלול הטיול והמפה',desc:'יום אחר יום באתיופיה – המפה נשארת קבועה והמסלול מתקדם בזמן הגלילה.',itinerary:'מסלול הטיול',map:'מפה',play:'נגן מסלול',pause:'עצור',overview:'המסלול המלא',open:'פתח ב-Google Maps',loading:'Google Maps נטען…',unavailable:'לא ניתן לטעון את Google Maps.',key:'יש להוסיף Google Maps API Key בקובץ aj-google-maps-config.js.',day:'יום',route:'מסלול'},
 el:{title:'Πρόγραμμα και χάρτης',desc:'Μέρα με τη μέρα στην Αιθιοπία – ο χάρτης μένει σταθερός και η διαδρομή προχωρά με την κύλιση.',itinerary:'Πρόγραμμα',map:'Χάρτης',play:'Αναπαραγωγή διαδρομής',pause:'Παύση',overview:'Ολόκληρη διαδρομή',open:'Άνοιγμα στο Google Maps',loading:'Φόρτωση Google Maps…',unavailable:'Δεν ήταν δυνατή η φόρτωση του Google Maps.',key:'Προσθέστε το Google Maps API Key στο aj-google-maps-config.js.',day:'Ημέρα',route:'Διαδρομή'},
 fr:{title:'Itinéraire et carte',desc:'Jour après jour en Éthiopie – la carte reste fixe tandis que l’itinéraire progresse au défilement.',itinerary:'Itinéraire',map:'Carte',play:'Lire le parcours',pause:'Pause',overview:'Parcours complet',open:'Ouvrir dans Google Maps',loading:'Chargement de Google Maps…',unavailable:'Google Maps n’a pas pu être chargé.',key:'Ajoutez la clé Google Maps API dans aj-google-maps-config.js.',day:'Jour',route:'Parcours'},
 it:{title:'Itinerario e mappa',desc:'Giorno dopo giorno in Etiopia – la mappa resta fissa mentre il percorso avanza con lo scorrimento.',itinerary:'Itinerario',map:'Mappa',play:'Riproduci percorso',pause:'Pausa',overview:'Percorso completo',open:'Apri in Google Maps',loading:'Caricamento Google Maps…',unavailable:'Impossibile caricare Google Maps.',key:'Inserisci la Google Maps API Key in aj-google-maps-config.js.',day:'Giorno',route:'Percorso'},
 es:{title:'Itinerario y mapa',desc:'Día a día por Etiopía: el mapa permanece fijo mientras la ruta avanza al desplazarte.',itinerary:'Itinerario',map:'Mapa',play:'Reproducir ruta',pause:'Pausa',overview:'Ruta completa',open:'Abrir en Google Maps',loading:'Cargando Google Maps…',unavailable:'No se pudo cargar Google Maps.',key:'Añade la Google Maps API Key en aj-google-maps-config.js.',day:'Día',route:'Ruta'},
 pt:{title:'Roteiro e mapa',desc:'Dia a dia pela Etiópia – o mapa fica fixo enquanto a rota avança ao rolar a página.',itinerary:'Roteiro',map:'Mapa',play:'Reproduzir rota',pause:'Pausa',overview:'Rota completa',open:'Abrir no Google Maps',loading:'A carregar Google Maps…',unavailable:'Não foi possível carregar o Google Maps.',key:'Adicione a Google Maps API Key em aj-google-maps-config.js.',day:'Dia',route:'Rota'},
 ru:{title:'Маршрут и карта',desc:'День за днём по Эфиопии — карта остаётся неподвижной, а маршрут продвигается при прокрутке.',itinerary:'Маршрут',map:'Карта',play:'Проиграть маршрут',pause:'Пауза',overview:'Весь маршрут',open:'Открыть в Google Maps',loading:'Загрузка Google Maps…',unavailable:'Не удалось загрузить Google Maps.',key:'Добавьте Google Maps API Key в aj-google-maps-config.js.',day:'День',route:'Маршрут'},
 zh:{title:'行程与地图',desc:'逐日游览埃塞俄比亚，地图保持固定，路线会随着页面滚动逐步展开。',itinerary:'行程',map:'地图',play:'播放路线',pause:'暂停',overview:'完整路线',open:'在 Google 地图中打开',loading:'正在加载 Google 地图…',unavailable:'无法加载 Google 地图。',key:'请在 aj-google-maps-config.js 中添加 Google Maps API Key。',day:'第',route:'路线'},
 ja:{title:'旅程と地図',desc:'エチオピアを日ごとに巡り、地図は固定されたまま、スクロールに合わせてルートが進みます。',itinerary:'旅程',map:'地図',play:'ルート再生',pause:'一時停止',overview:'全ルート',open:'Google マップで開く',loading:'Google マップを読み込み中…',unavailable:'Google マップを読み込めませんでした。',key:'aj-google-maps-config.js に Google Maps API Key を追加してください。',day:'日目',route:'ルート'},
 ko:{title:'일정과 지도',desc:'에티오피아 여행 일정 동안 지도는 고정되고 스크롤에 따라 경로가 진행됩니다.',itinerary:'여행 일정',map:'지도',play:'경로 재생',pause:'일시정지',overview:'전체 경로',open:'Google 지도에서 열기',loading:'Google 지도를 불러오는 중…',unavailable:'Google 지도를 불러올 수 없습니다.',key:'aj-google-maps-config.js에 Google Maps API Key를 추가하세요.',day:'일차',route:'여행 경로'},
 am:{title:'የጉዞ መርሃ ግብር እና ካርታ',desc:'በኢትዮጵያ ቀን በቀን — ካርታው ቋሚ ሆኖ መስመሩ ሲወርዱ ቀስ በቀስ ይታያል።',itinerary:'የጉዞ መርሃ ግብር',map:'ካርታ',play:'መስመሩን አጫውት',pause:'አቁም',overview:'ሙሉ መስመር',open:'በGoogle Maps ክፈት',loading:'Google Maps በመጫን ላይ…',unavailable:'Google Maps መጫን አልተቻለም።',key:'Google Maps API Key በ aj-google-maps-config.js ውስጥ ያስገቡ።',day:'ቀን',route:'የጉዞ መስመር'}
};

const ico={
 play:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg>',
 pause:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
 pin:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.2 6-11A6 6 0 1 0 6 10c0 5.8 6 11 6 11Z"/><circle cx="12" cy="10" r="2.2"/></svg>',
 external:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/></svg>'
};

function lang(){try{return (localStorage.getItem('aj_lang')||document.documentElement.lang||'de').toLowerCase()}catch(e){return document.documentElement.lang||'de'}}
function tr(){return UI[lang()]||UI.de}
function tripId(){
 const explicit=String(window.AJ_ROUTE_ID||document.body?.dataset?.ajRoute||'').toLowerCase();
 if(explicit&&ROUTES[explicit])return explicit;
 try{if(typeof getTrip==='function'){const t=getTrip();if(t&&t.id&&ROUTES[t.id])return t.id}}catch(e){}
 const m=(location.pathname.match(/reise-([a-z-]+)\.html/i)||[])[1];
 if(m&&ROUTES[m])return m;
 const q=new URLSearchParams(location.search).get('id');
 return ROUTES[q]?q:'north';
}
function googleUrl(stops){
 const first=stops[0],last=stops[stops.length-1],middle=stops.slice(1,-1);
 const p=new URLSearchParams({api:'1',origin:`${first.lat},${first.lng}`,destination:`${last.lat},${last.lng}`,travelmode:'driving'});
 if(middle.length)p.set('waypoints',middle.map(s=>`${s.lat},${s.lng}`).join('|'));
 return `https://www.google.com/maps/dir/?${p.toString()}`;
}
function template(route){const t=tr();return `<div class="aj-route-diamir" id="ajRouteExperience">
 <header class="aj-route-heading"><div><div class="aj-route-kicker">${route.label}</div><h2 data-route-t="title">${t.title}</h2><p data-route-t="desc">${t.desc}</p></div><a class="aj-route-google-top" target="_blank" rel="noopener" href="${googleUrl(route.stops)}">${ico.external}<span data-route-t="open">${t.open}</span></a></header>
 <div class="aj-route-mobile-tabs" role="tablist"><button type="button" class="is-active" data-route-view="itinerary">${ico.pin}<span data-route-t="itinerary">${t.itinerary}</span></button><button type="button" data-route-view="map">${ico.pin}<span data-route-t="map">${t.map}</span></button></div>
 <div class="aj-route-diamir-grid">
  <aside class="aj-route-map-col"><div class="aj-route-map-card"><div class="aj-route-map" id="ajRouteMap"><div class="aj-route-loading"><span></span><strong data-route-t="loading">${t.loading}</strong></div></div>
   <div class="aj-route-map-topline"><div class="aj-route-map-brand">${ico.pin}<span data-route-t="map">${t.map}</span></div><button type="button" class="aj-route-overview" data-route-action="overview"><span data-route-t="overview">${t.overview}</span></button></div>
   <div class="aj-route-map-bottom"><div class="aj-route-current"><small id="ajRouteDayLabel">1. ${t.day}</small><strong id="ajRouteCurrent">${route.stops[0].name}</strong><span id="ajRouteMeta">${route.stops[0].meta}</span></div><div class="aj-route-scroll-hint" aria-hidden="true"><span>↓</span></div></div>
  </div></aside>
  <div class="aj-route-days-col"><div class="aj-route-days-head"><strong data-route-t="itinerary">${t.itinerary}</strong><span>${route.stops.length} <span data-route-t="route">${t.route}</span></span></div><div class="aj-route-days-slot"></div></div>
 </div>
</div>`}

function updateText(root){const t=tr();root.querySelectorAll('[data-route-t]').forEach(el=>{const k=el.dataset.routeT;if(t[k])el.textContent=t[k]});}
function routeIndexForDay(i,dayCount,stopCount){if(dayCount<=1||stopCount<=1)return 0;return Math.round(i*(stopCount-1)/(dayCount-1));}

function insert(){
 const sec=document.getElementById('verlauf');if(!sec||document.getElementById('ajRouteExperience'))return null;
 const daysList=sec.querySelector('#daysList,.day-list');if(!daysList||!daysList.querySelector('.day'))return null;
 const routeId=tripId();const route=ROUTES[routeId]||ROUTES.north;
 const box=document.createElement('div');box.innerHTML=template(route);const root=box.firstElementChild;root.dataset.routeId=routeId;
 const container=sec.querySelector('.container')||sec;
 const head=sec.querySelector('.section-head');if(head)head.classList.add('aj-route-original-head');
 const oldGrid=daysList.closest('.itinerary-grid');
 if(head)head.insertAdjacentElement('afterend',root);else container.prepend(root);
 root.querySelector('.aj-route-days-slot').appendChild(daysList);
 if(oldGrid&&oldGrid!==daysList&&oldGrid.children.length===0)oldGrid.remove();
 sec.classList.add('aj-route-enhanced');
 const dayEls=[...daysList.querySelectorAll('.day')];
 dayEls.forEach((day,i)=>{const ri=routeIndexForDay(i,dayEls.length,route.stops.length);day.dataset.routeIndex=String(ri);day.dataset.routeDay=String(i+1);day.tabIndex=0;day.setAttribute('role','button');day.setAttribute('aria-label',`${i+1}. ${tr().day}: ${route.stops[ri].name}`);});
 return {root,route,dayEls,sec};
}

function embedLanguage(){
 const l=lang();
 if(l==='he')return 'iw';
 return ['de','en','ar','el','fr','it','es','pt','ru','zh','ja','ko','am'].includes(l)?l:'de';
}
function mercator(lat,lng){
 const x=(lng+180)/360;
 const s=Math.max(-.9999,Math.min(.9999,Math.sin(lat*Math.PI/180)));
 const y=.5-Math.log((1+s)/(1-s))/(4*Math.PI);
 return {x,y};
}
function inverseMercator(x,y){
 const lng=x*360-180;
 const n=Math.PI-2*Math.PI*y;
 const lat=180/Math.PI*Math.atan(.5*(Math.exp(n)-Math.exp(-n)));
 return {lat,lng};
}
function mapView(stops,w,h){
 const p=stops.map(s=>mercator(s.lat,s.lng));
 let minX=Math.min(...p.map(a=>a.x)),maxX=Math.max(...p.map(a=>a.x));
 let minY=Math.min(...p.map(a=>a.y)),maxY=Math.max(...p.map(a=>a.y));
 // More breathing room, similar to the supplied route-map reference.
 const dx=Math.max(maxX-minX,.002),dy=Math.max(maxY-minY,.002);
 const padX=Math.max(55,w*.11),padY=Math.max(75,h*.14);
 const zx=Math.log2(Math.max(1,(w-padX*2))/(256*dx));
 const zy=Math.log2(Math.max(1,(h-padY*2))/(256*dy));
 let zoom=Math.floor(Math.min(zx,zy));
 zoom=Math.max(4,Math.min(11,zoom));
 // Small trip-specific tweaks make each route fill the map nicely.
 const id=tripId();
 const tweak={south:0,north:0,simien:0,danakil:0,harar:0,photo:0,family:0,private:0,comfort:0}[id]||0;
 zoom=Math.max(4,Math.min(11,zoom+tweak));
 const center=inverseMercator((minX+maxX)/2,(minY+maxY)/2);
 return {center,zoom};
}
function googleEmbedUrl(center,zoom){
 const hl=embedLanguage();
 // This is the regular Google Maps embed URL and does not require the JS API key.
 return `https://maps.google.com/maps?hl=${encodeURIComponent(hl)}&ll=${center.lat.toFixed(6)},${center.lng.toFixed(6)}&z=${zoom}&t=m&output=embed`;
}
function projectPoint(lat,lng,center,zoom,w,h){
 const p=mercator(lat,lng),c=mercator(center.lat,center.lng),world=256*Math.pow(2,zoom);
 let dx=(p.x-c.x)*world;
 if(dx>world/2)dx-=world;if(dx<-world/2)dx+=world;
 return {x:w/2+dx,y:h/2+(p.y-c.y)*world};
}
function dist2d(a,b){return Math.hypot(b.x-a.x,b.y-a.y)}
function pointOnPolyline(points,target){
 if(points.length<2)return {x:points[0]?.x||0,y:points[0]?.y||0,angle:0};
 let total=0,lens=[];for(let i=1;i<points.length;i++){const d=dist2d(points[i-1],points[i]);lens.push(d);total+=d}
 let left=Math.max(0,Math.min(total,target));
 for(let i=0;i<lens.length;i++){
  const d=lens[i];if(left<=d||i===lens.length-1){const t=d?left/d:0,a=points[i],b=points[i+1];return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,angle:Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI}}
  left-=d;
 }
 return {x:points.at(-1).x,y:points.at(-1).y,angle:0};
}
function makeOverlay(mapEl,route,dayEls){
 mapEl.innerHTML='';
 const iframe=document.createElement('iframe');
 iframe.className='aj-google-embed';iframe.title='Google Maps';iframe.loading='eager';iframe.referrerPolicy='no-referrer-when-downgrade';iframe.setAttribute('aria-label',route.label+' – Google Maps');
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.classList.add('aj-route-overlay');svg.setAttribute('aria-hidden','true');svg.setAttribute('preserveAspectRatio','none');
 svg.innerHTML=`<g class="aj-overlay-route"><path class="aj-overlay-base"></path><path class="aj-overlay-active"></path><g class="aj-overlay-arrows"></g><g class="aj-overlay-stops"></g><g class="aj-overlay-current"><circle r="10"></circle><circle class="pulse" r="14"></circle></g></g>`;
 mapEl.append(iframe,svg);
 const base=svg.querySelector('.aj-overlay-base'),active=svg.querySelector('.aj-overlay-active'),arrowsG=svg.querySelector('.aj-overlay-arrows'),stopsG=svg.querySelector('.aj-overlay-stops'),currentG=svg.querySelector('.aj-overlay-current');
 let geometry=null,manualFull=false,ticking=false,lastSize='';
 const current=document.querySelector('#ajRouteCurrent'),meta=document.querySelector('#ajRouteMeta'),dayLabel=document.querySelector('#ajRouteDayLabel');
 function build(){
  const r=mapEl.getBoundingClientRect(),w=Math.max(320,Math.round(r.width)),h=Math.max(360,Math.round(r.height));
  const size=w+'x'+h;if(size===lastSize&&geometry)return;lastSize=size;
  const view=mapView(route.stops,w,h);iframe.src=googleEmbedUrl(view.center,view.zoom);
  svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
  const pts=route.stops.map(s=>projectPoint(s.lat,s.lng,view.center,view.zoom,w,h));
  const d=pts.map((p,i)=>(i?'L':'M')+p.x.toFixed(1)+' '+p.y.toFixed(1)).join(' ');base.setAttribute('d',d);active.setAttribute('d',d);
  const total=pts.slice(1).reduce((n,p,i)=>n+dist2d(pts[i],p),0)||1;
  active.style.strokeDasharray=String(total);active.style.strokeDashoffset=String(total);
  arrowsG.innerHTML='';
  const spacing=route.arrowRepeat?Math.max(42,parseInt(route.arrowRepeat,10)||54):54;
  const arrows=[];
  for(let at=spacing*.72;at<total-spacing*.18;at+=spacing){
   const p=pointOnPolyline(pts,at),g=document.createElementNS(svg.namespaceURI,'g');
   g.classList.add('aj-overlay-arrow');g.dataset.progress=String(at/total);g.setAttribute('transform',`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.angle.toFixed(1)})`);
   const poly=document.createElementNS(svg.namespaceURI,'path');poly.setAttribute('d','M -7 -5 L 4 0 L -7 5 L -3 0 Z');g.appendChild(poly);arrowsG.appendChild(g);arrows.push(g);
  }
  stopsG.innerHTML='';const stopNodes=[];
  pts.forEach((p,i)=>{
   const g=document.createElementNS(svg.namespaceURI,'g');g.classList.add('aj-overlay-stop');g.dataset.index=String(i);g.setAttribute('transform',`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
   const hit=document.createElementNS(svg.namespaceURI,'circle');hit.classList.add('hit');hit.setAttribute('r','15');
   const c=document.createElementNS(svg.namespaceURI,'circle');c.setAttribute('r','7.5');g.append(hit,c);stopsG.appendChild(g);stopNodes.push(g);
   g.style.pointerEvents='auto';g.addEventListener('click',()=>{const di=Math.round(i*Math.max(0,dayEls.length-1)/Math.max(1,route.stops.length-1));dayEls[di]?.scrollIntoView({behavior:'smooth',block:'center'})});
  });
  geometry={pts,total,arrows,stopNodes,view,w,h};render(scrollProgress());
 }
 function scrollProgress(){
  if(manualFull)return 1;if(!dayEls.length)return 0;
  const cursor=window.scrollY+window.innerHeight*.52,first=dayEls[0],last=dayEls.at(-1);
  const a=first.getBoundingClientRect().top+window.scrollY+first.offsetHeight*.5,b=last.getBoundingClientRect().top+window.scrollY+last.offsetHeight*.5;
  return b<=a?0:Math.max(0,Math.min(1,(cursor-a)/(b-a)));
 }
 function render(p){
  if(!geometry)return;p=Math.max(0,Math.min(1,p));
  active.style.strokeDashoffset=String(geometry.total*(1-p));
  geometry.arrows.forEach(a=>a.classList.toggle('is-visible',Number(a.dataset.progress)<=p+.008));
  const si=Math.max(0,Math.min(route.stops.length-1,Math.round(p*Math.max(0,route.stops.length-1))));
  const di=Math.max(0,Math.min(dayEls.length-1,Math.round(p*Math.max(0,dayEls.length-1))));
  geometry.stopNodes.forEach((n,i)=>n.classList.toggle('is-active',i===si));
  const cursor=pointOnPolyline(geometry.pts,geometry.total*p);currentG.setAttribute('transform',`translate(${cursor.x.toFixed(1)} ${cursor.y.toFixed(1)})`);
  dayEls.forEach((d,i)=>d.classList.toggle('is-route-active',i===di));
  const st=route.stops[si];if(current)current.textContent=st.name;if(meta)meta.textContent=st.meta||'';if(dayLabel)dayLabel.textContent=`${di+1}. ${tr().day}`;
 }
 function onScroll(){manualFull=false;if(!ticking){ticking=true;requestAnimationFrame(()=>{ticking=false;render(scrollProgress())})}}
 const ro=new ResizeObserver(()=>{clearTimeout(ro._t);ro._t=setTimeout(build,160)});ro.observe(mapEl);
 window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll,{passive:true});
 build();
 return {render,overview:()=>{manualFull=true;render(1)},refresh:build};
}
function startMap(data){
 const {root,route,dayEls}=data,mapEl=root.querySelector('#ajRouteMap');
 const overlay=makeOverlay(mapEl,route,dayEls);
 root.querySelector('[data-route-action="overview"]')?.addEventListener('click',()=>overlay.overview());
 bindMobileTabs(root,overlay);
}
function bindMobileTabs(root,overlay){
 root.querySelectorAll('[data-route-view]').forEach(btn=>btn.addEventListener('click',()=>{
  const view=btn.dataset.routeView;root.dataset.mobileView=view;root.querySelectorAll('[data-route-view]').forEach(x=>x.classList.toggle('is-active',x===btn));
  if(view==='map'&&overlay)setTimeout(()=>overlay.refresh(),100);
 }));
}

function boot(attempt=0){
 const data=insert();
 if(!data){if(attempt<30)setTimeout(()=>boot(attempt+1),100);return}
 updateText(data.root);startMap(data);
 const mo=new MutationObserver(()=>updateText(data.root));mo.observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
 window.addEventListener('storage',e=>{if(e.key==='aj_lang')updateText(data.root)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot());else boot();
})();
