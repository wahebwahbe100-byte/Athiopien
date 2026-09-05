(function(){
  'use strict';

  const script = document.currentScript;
  const root = script ? new URL('.', script.src) : new URL('.', location.href);
  const url = (path) => new URL(path, root).href;

  // Each top-level item owns ONLY its own dropdown.
  // Every submenu entry points to the matching existing page/section.
  // Curated, compact top-level labels. These are intentionally short so a
  // language switch never makes the desktop header collide or become unreadable.
  const TOP_LABELS = {
    de:{ethiopia:'Äthiopien',offers:'Reiseangebote',private:'Individualreisen',modules:'Reisebausteine',tips:'Reisetipps',info:'Info'},
    en:{ethiopia:'Ethiopia',offers:'Tours',private:'Private tours',modules:'Trip builder',tips:'Travel tips',info:'Info'},
    ar:{ethiopia:'إثيوبيا',offers:'الرحلات',private:'رحلات خاصة',modules:'تصميم الرحلة',tips:'نصائح السفر',info:'معلومات'},
    zh:{ethiopia:'埃塞俄比亚',offers:'旅行',private:'私人旅行',modules:'行程定制',tips:'旅行贴士',info:'信息'},
    fr:{ethiopia:'Éthiopie',offers:'Voyages',private:'Privé',modules:'Sur mesure',tips:'Conseils',info:'Infos'},
    it:{ethiopia:'Etiopia',offers:'Viaggi',private:'Privati',modules:'Crea viaggio',tips:'Consigli',info:'Info'},
    ja:{ethiopia:'エチオピア',offers:'ツアー',private:'個人旅行',modules:'旅行プラン',tips:'旅行情報',info:'情報'},
    ko:{ethiopia:'에티오피아',offers:'여행',private:'개인 여행',modules:'여행 설계',tips:'여행 팁',info:'정보'},
    pt:{ethiopia:'Etiópia',offers:'Viagens',private:'Privadas',modules:'Monte a viagem',tips:'Dicas',info:'Info'},
    ru:{ethiopia:'Эфиопия',offers:'Туры',private:'Частные туры',modules:'Маршруты',tips:'Советы',info:'Инфо'},
    es:{ethiopia:'Etiopía',offers:'Viajes',private:'Privados',modules:'Diseña viaje',tips:'Consejos',info:'Info'},
    am:{ethiopia:'ኢትዮጵያ',offers:'ጉዞዎች',private:'የግል ጉዞ',modules:'ጉዞ እቅድ',tips:'ምክሮች',info:'መረጃ'},
    el:{ethiopia:'Αιθιοπία',offers:'Ταξίδια',private:'Ιδιωτικά',modules:'Σχεδιασμός',tips:'Συμβουλές',info:'Πληροφορίες'},
    he:{ethiopia:'אתיופיה',offers:'טיולים',private:'טיולים פרטיים',modules:'בניית מסלול',tips:'טיפים',info:'מידע'},
    tr:{ethiopia:'Etiyopya',offers:'Turlar',private:'Özel turlar',modules:'Seyahat planı',tips:'İpuçları',info:'Bilgi'}
  };

  const currentLanguage = () => {
    const htmlLang=(document.documentElement.lang||'').toLowerCase().split('-')[0];
    if(TOP_LABELS[htmlLang]) return htmlLang;
    try{
      const saved=(localStorage.getItem('aj_lang')||'').toLowerCase().split('-')[0];
      if(TOP_LABELS[saved]) return saved;
    }catch(e){}
    return 'de';
  };

  function applyTopLabels(links, lang=currentLanguage()){
    const dict=TOP_LABELS[lang]||TOP_LABELS.de;
    links?.querySelectorAll('[data-aj-nav-label]').forEach(el=>{
      const key=el.dataset.ajNavLabel;
      if(dict[key]) el.textContent=dict[key];
    });
  }

  const MENU = [
    {
      title: 'Äthiopien', href: 'index.html', key: 'ethiopia', className: 'aj-menu-ethiopia',
      items: [
        ['Länderinformation', 'info.html#laenderinformation'],
        ['Sehenswürdigkeiten', 'index.html#ethiopien-eindruecke'],
        ['Kultur', 'reisetipps.html#kultur'],
        ['Religion', 'reisetipps.html#religion'],
        ['Ernährung', 'reisetipps.html#ernaehrung'],
        ['Klima', 'reisetipps.html#klima']
      ]
    },
    {
      title: 'Reiseangebote', href: 'reisen.html', key: 'offers', className: 'aj-menu-offers',
      items: [
        ['Gruppenreisen', 'reisen.html#allTrips'],
        ['Highlights (Rundreise)', 'Ausgewaehlte-Reisen/reise-north.html'],
        ['Äthiopien kompakt', 'Ausgewaehlte-Reisen/reise-comfort.html'],
        ['Kurzreisen', 'reisen.html?thema=kurzreisen#allTrips'],
        ['Abenteuerreisen', 'Reisearten/reiseart-abenteuer.html'],
        ['Wandern & Natur & Safari', 'Reisearten/reiseart-natur.html'],
        ['Fotoreisen', 'Ausgewaehlte-Reisen/reise-photo.html'],
        ['Familienreisen', 'Ausgewaehlte-Reisen/reise-family.html'],
        ['Campingreisen', 'reisen.html?thema=camping#allTrips'],
        ['Seniorenreisen', 'Reisearten/reiseart-senioren.html'],
        ['Reise zu den UNESCO-Welterbestätten', 'reisen.html?thema=unesco#allTrips'],
        ['Spezialreisen (Anfrage)', 'kontakt.html#beratung'],
        ['Hochzeits- & Verlobungsreisen', 'Reisearten/reiseart-hochzeit-verlobung.html'],
        ['Reisen für Menschen mit körperlichen Beeinträchtigungen', 'Ausgewaehlte-Reisen/reise-comfort.html'],
        ['VIP-Reisen', 'Ausgewaehlte-Reisen/reise-private.html'],
        ['Persönliche Beratung', 'kontakt.html#beratung']
      ]
    },
    {
      title: 'Individualreisen', href: 'individualreisen.html', key: 'private', className: 'aj-menu-private',
      items: [
        ['Individuell planen', 'individualreisen.html#anfrage'],
        ['Persönliche Beratung', 'kontakt.html#beratung']
      ]
    },
    {
      title: 'Reisebausteine', href: 'baukasten.html', key: 'modules', className: 'aj-menu-modules',
      items: [
        ['Reise zusammenstellen', 'baukasten.html#builderForm'],
        ['Nordäthiopien – Lalibela – Gondar – Aksum', 'Ausgewaehlte-Reisen/reise-north.html'],
        ['Südäthiopien – Omo-Tal', 'Ausgewaehlte-Reisen/reise-south.html'],
        ['Westäthiopien – Gambela-Nationalpark', 'reisen.html?region=west#allTrips'],
        ['Ostäthiopien – Harar', 'Ausgewaehlte-Reisen/reise-harar.html'],
        ['Persönliche Beratung', 'kontakt.html#beratung']
      ]
    },
    {
      title: 'Reisetipps/Ihre Reise', href: 'reisetipps.html', key: 'tips', className: 'aj-menu-tips',
      items: [
        ['Reisevorbereitung', 'reisetipps.html#reisevorbereitung'],
        ['VISA & Einreise', 'reisetipps.html#visa'],
        ['Flüge', 'reisetipps.html#flug'],
        ['Gesundheit', 'reisetipps.html#gesundheit'],
        ['Geld und Bezahlen', 'reisetipps.html#geld'],
        ['Fotografieren', 'reisetipps.html#fotografieren'],
        ['Packliste', 'reisetipps.html#packliste'],
        ['FAQ', 'reisetipps.html#faq'],
        ['Persönliche Beratung', 'kontakt.html#beratung']
      ]
    },
    {
      title: 'Info', href: 'info.html', key: 'info', className: 'aj-menu-info',
      items: [
        ['Über uns', 'ueber-uns.html'],
        ['Kontaktieren Sie uns', 'kontakt.html#beratung']
      ]
    }
  ];

  function activeKey(){
    const p = location.pathname.toLowerCase();
    if (p.includes('/reisearten/') || p.includes('/ausgewaehlte-reisen/') || p.endsWith('/reisen.html') || p.endsWith('/reise.html')) return 'offers';
    if (p.endsWith('/individualreisen.html')) return 'private';
    if (p.endsWith('/baukasten.html') || p.endsWith('/buchung.html')) return 'modules';
    if (p.endsWith('/reisetipps.html')) return 'tips';
    if (p.endsWith('/info.html') || p.endsWith('/kontakt.html') || p.endsWith('/kundenbereich.html')) return 'info';
    return 'ethiopia';
  }

  function isDrawerMode(nav){
    return innerWidth <= 820 || !!nav?.classList.contains('aj-nav-compact');
  }

  function closeMobileDrawer(nav, links){
    links.classList.remove('open');
    const btn = nav.querySelector('.menuBtn');
    btn?.classList.remove('menu-open');
    btn?.setAttribute('aria-expanded', 'false');
    btn?.setAttribute('aria-label', 'Menü öffnen');
    document.body.classList.remove('menu-locked');
  }

  function fitDropdown(drop){
    if (isDrawerMode(drop?.closest('.site-nav')) || !drop) return;
    const panel=drop.querySelector(':scope > .nav-dropdown-menu');
    if(!panel) return;
    panel.style.setProperty('--aj-menu-shift-x','0px');
    requestAnimationFrame(()=>{
      const gutter=14;
      let rect=panel.getBoundingClientRect();
      let shift=0;
      if(rect.right > innerWidth-gutter) shift -= rect.right-(innerWidth-gutter);
      if(rect.left+shift < gutter) shift += gutter-(rect.left+shift);

      const brand=document.querySelector('.site-nav .brand');
      if(brand){
        const br=brand.getBoundingClientRect();
        const prTop=rect.top;
        const prBottom=rect.bottom;
        const verticalOverlap=prTop < br.bottom && prBottom > br.top;
        const shiftedLeft=rect.left+shift;
        const shiftedRight=rect.right+shift;
        const horizontalOverlap=shiftedLeft < br.right+12 && shiftedRight > br.left;
        if(verticalOverlap && horizontalOverlap){
          shift += (br.right+12)-shiftedLeft;
          const overflow=(rect.right+shift)-(innerWidth-gutter);
          if(overflow>0) shift-=overflow;
        }
      }
      panel.style.setProperty('--aj-menu-shift-x',`${Math.round(shift)}px`);
    });
  }

  function bindMobileMenuButton(nav, links){
    const btn = nav.querySelector('.menuBtn');
    if (!btn || btn.dataset.ajMenuButtonReady === '1') return;
    btn.dataset.ajMenuButtonReady = '1';
    btn.setAttribute('aria-controls', links.id || 'mainNav');

    // Capture phase intentionally owns the mobile toggle. Several legacy page scripts
    // also attach click listeners to this button; stopping them here prevents a
    // double-toggle (open -> immediately closed) while keeping desktop untouched.
    btn.addEventListener('click', (e) => {
      if (!isDrawerMode(nav)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const open = !links.classList.contains('open');
      links.classList.toggle('open', open);
      btn.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
      document.body.classList.toggle('menu-locked', open);
      if (!open) {
        links.querySelectorAll('.nav-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
        links.querySelectorAll('.nav-main-link[aria-expanded="true"]').forEach(a => a.setAttribute('aria-expanded','false'));
      }
      document.getElementById('langMenu')?.classList.remove('open');
      document.getElementById('currencyMenu')?.classList.remove('open');
    }, true);
  }

  function bindMenus(nav, links){
    const dropdowns = [...links.querySelectorAll('.nav-dropdown')];
    const closeTimers = new WeakMap();

    const cancelClose = (drop) => {
      const timer = closeTimers.get(drop);
      if (timer) clearTimeout(timer);
      closeTimers.delete(drop);
    };

    const closeDrop = (drop) => {
      cancelClose(drop);
      drop.classList.remove('is-open');
      drop.querySelector(':scope > .nav-main-link')?.setAttribute('aria-expanded', 'false');
    };

    const openDrop = (drop) => {
      cancelClose(drop);
      dropdowns.forEach(d => { if (d !== drop) closeDrop(d); });
      const main = drop.querySelector(':scope > .nav-main-link');
      drop.classList.add('is-open');
      main?.setAttribute('aria-expanded', 'true');
      fitDropdown(drop);
    };

    const closeOthers = (except = null) => dropdowns.forEach(d => {
      if (d !== except) closeDrop(d);
    });

    dropdowns.forEach(drop => {
      const main = drop.querySelector(':scope > .nav-main-link');
      const panel = drop.querySelector(':scope > .nav-dropdown-menu');
      if (!main) return;
      main.setAttribute('aria-haspopup', 'true');
      main.setAttribute('aria-expanded', 'false');

      main.addEventListener('click', (e) => {
        if (isDrawerMode(nav)) {
          // Mobile: the top-level word is a pure accordion control.
          // Tap once to open, tap the same word again to close.
          // This avoids the old behavior where the second tap unexpectedly navigated away.
          e.preventDefault();
          e.stopPropagation();
          if (drop.classList.contains('is-open')) closeDrop(drop);
          else openDrop(drop);
        }
      });

      main.addEventListener('keydown', (e) => {
        if (!isDrawerMode(nav) && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
          if (e.key !== 'Enter') e.preventDefault();
          openDrop(drop);
          panel?.querySelector('a')?.focus();
        }
      });

      // Desktop: keep the dropdown open while the pointer moves from the heading
      // into the panel. The small delay also makes diagonal mouse movement forgiving.
      drop.addEventListener('mouseenter', () => {
        if (!isDrawerMode(nav)) openDrop(drop);
      });
      panel?.addEventListener('mouseenter', () => {
        if (!isDrawerMode(nav)) {
          cancelClose(drop);
          drop.classList.add('is-open');
          main.setAttribute('aria-expanded', 'true');
        }
      });
      drop.addEventListener('mouseleave', () => {
        if (!isDrawerMode(nav)) {
          cancelClose(drop);
          const timer = setTimeout(() => closeDrop(drop), 320);
          closeTimers.set(drop, timer);
        }
      });
      panel?.addEventListener('mouseleave', () => {
        if (!isDrawerMode(nav)) {
          cancelClose(drop);
          const timer = setTimeout(() => closeDrop(drop), 220);
          closeTimers.set(drop, timer);
        }
      });
    });

    links.querySelectorAll('.nav-dropdown-menu a').forEach(a => a.addEventListener('click', () => {
      closeOthers();
      if (isDrawerMode(nav)) closeMobileDrawer(nav, links);
    }));

    document.addEventListener('click', (e) => {
      if (!links.contains(e.target)) {
        closeOthers();
        if (isDrawerMode(nav) && links.classList.contains('open') && !nav.contains(e.target)) {
          closeMobileDrawer(nav, links);
        }
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeOthers();
        if (isDrawerMode(nav) && links.classList.contains('open')) closeMobileDrawer(nav, links);
      }
    });
    window.addEventListener('resize', () => {
      closeOthers();
      dropdowns.forEach(fitDropdown);
    }, {passive:true});
  }

  function measureNaturalLinksWidth(links){
    if(!links || !document.body) return 0;
    const clone=links.cloneNode(true);
    clone.removeAttribute('id');
    clone.classList.remove('open');
    clone.querySelectorAll('.nav-dropdown-menu').forEach(el=>el.remove());
    clone.setAttribute('aria-hidden','true');
    const st=clone.style;
    st.setProperty('position','fixed','important');
    st.setProperty('left','-10000px','important');
    st.setProperty('top','0','important');
    st.setProperty('display','flex','important');
    st.setProperty('flex-direction','row','important');
    st.setProperty('align-items','center','important');
    st.setProperty('width','max-content','important');
    st.setProperty('max-width','none','important');
    st.setProperty('min-width','0','important');
    st.setProperty('height','auto','important');
    st.setProperty('max-height','none','important');
    st.setProperty('padding','0','important');
    st.setProperty('margin','0','important');
    st.setProperty('overflow','visible','important');
    st.setProperty('opacity','0','important');
    st.setProperty('visibility','hidden','important');
    st.setProperty('pointer-events','none','important');
    st.setProperty('transform','none','important');
    const host=links.closest('.site-nav')||document.body;
    host.appendChild(clone);
    const width=Math.ceil(clone.getBoundingClientRect().width);
    clone.remove();
    return width;
  }

  function availableDesktopLinksWidth(nav){
    const inner=nav?.querySelector('.nav-inner');
    const actions=nav?.querySelector('.nav-actions');
    if(!inner) return 0;
    const cs=getComputedStyle(inner);
    const px=v=>Number.parseFloat(v)||0;
    const gap=px(cs.columnGap||cs.gap);
    return Math.max(0,
      inner.clientWidth-px(cs.paddingLeft)-px(cs.paddingRight)-
      (actions?.getBoundingClientRect().width||0)-gap-8
    );
  }

  function setupAdaptiveNavigation(nav, links){
    if(!nav || !links || nav.dataset.ajAdaptiveReady==='1') return;
    nav.dataset.ajAdaptiveReady='1';
    let timer=0;
    const sync=()=>{
      clearTimeout(timer);
      timer=setTimeout(()=>{
        if(innerWidth<=820){
          nav.classList.remove('aj-nav-compact');
          return;
        }
        const required=measureNaturalLinksWidth(links);
        const available=availableDesktopLinksWidth(nav);
        if(!required || !available) return;
        const compact=nav.classList.contains('aj-nav-compact');
        const shouldCompact=compact ? required>available-34 : required>available-8;
        if(shouldCompact!==compact){
          nav.classList.toggle('aj-nav-compact',shouldCompact);
          closeMobileDrawer(nav,links);
          links.querySelectorAll('.nav-dropdown.is-open').forEach(d=>d.classList.remove('is-open'));
          links.querySelectorAll('.nav-main-link[aria-expanded="true"]').forEach(a=>a.setAttribute('aria-expanded','false'));
        }
      },30);
    };
    nav._ajSyncAdaptiveNav=sync;
    window.addEventListener('resize',sync,{passive:true});
    window.addEventListener('pageshow',sync,{passive:true});
    window.addEventListener('aj:languagechange',sync);
    const langObserver=new MutationObserver(()=>{
      applyTopLabels(links,currentLanguage());
      sync();
    });
    langObserver.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    if(document.fonts?.ready) document.fonts.ready.then(sync).catch(()=>{});
    sync();
    setTimeout(sync,180);
    setTimeout(sync,700);
  }

  function build(){
    const nav = document.querySelector('.site-nav');
    const links = nav?.querySelector('.navlinks');
    if (!nav || !links || links.dataset.separateMenuReady === '1') return;
    links.dataset.separateMenuReady = '1';
    links.classList.add('aj-separate-menus');
    const active = activeKey();

    links.innerHTML = MENU.map(group => `
      <div class="nav-dropdown aj-menu-group ${group.className || ''}" data-menu-key="${group.key}">
        <a class="nav-main-link" href="${url(group.href)}" data-menu-top="${group.key}"${group.key === active ? ' aria-current="page"' : ''}>
          <span class="notranslate aj-nav-top-label" translate="no" data-aj-nav-label="${group.key}">${group.title}</span><i class="nav-arrow" aria-hidden="true"></i>
        </a>
        <div class="nav-dropdown-menu" aria-label="${group.title} Untermenü">
          ${group.items.map(([label, href]) => `<a class="drop-row" href="${url(href)}"><span>${label}</span></a>`).join('')}
        </div>
      </div>`).join('');

    applyTopLabels(links,currentLanguage());
    setupAdaptiveNavigation(nav,links);
    bindMobileMenuButton(nav, links);
    bindMenus(nav, links);
    window.addEventListener('aj:languagechange',e=>{
      applyTopLabels(links,(e.detail?.language||currentLanguage()).toLowerCase().split('-')[0]);
      nav._ajSyncAdaptiveNav?.();
    });
  }

  function injectStyles(){
    if (document.getElementById('aj-separate-menu-style')) return;
    const s = document.createElement('style');
    s.id = 'aj-separate-menu-style';
    s.textContent = `
      /* Corrected navigation: six independent dropdowns, never one mega panel. */
      .site-nav .navlinks.aj-separate-menus .nav-dropdown-menu{
        scroll-behavior:smooth;
        overscroll-behavior:contain;
        scrollbar-width:thin;
        scrollbar-color:rgba(213,163,56,.75) rgba(13,48,74,.06);
      }
      .site-nav .navlinks.aj-separate-menus .nav-dropdown-menu::-webkit-scrollbar{width:7px}
      .site-nav .navlinks.aj-separate-menus .nav-dropdown-menu::-webkit-scrollbar-track{background:rgba(13,48,74,.05);border-radius:10px}
      .site-nav .navlinks.aj-separate-menus .nav-dropdown-menu::-webkit-scrollbar-thumb{background:rgba(213,163,56,.72);border-radius:10px}

      /* Keep every main menu word visually equal; current page is not painted yellow. */
      .site-nav .navlinks.aj-separate-menus .nav-main-link[aria-current="page"]{font-weight:700!important}

      @media (min-width:821px){
        /* Reserve real space for the hanging logo so it can never cover Äthiopien. */
        .site-nav .navlinks.aj-separate-menus{gap:12px!important;position:relative!important;margin-left:10px!important;z-index:4!important}
        .site-nav .navlinks.aj-separate-menus > .nav-dropdown:first-child{margin-left:4px!important}
        .site-nav .navlinks.aj-separate-menus > .nav-dropdown{position:relative!important}
        .site-nav .navlinks.aj-separate-menus .nav-main-link{
          gap:5px!important;font-size:.72rem!important;letter-spacing:0!important;white-space:nowrap!important;
        }
        .site-nav .navlinks.aj-separate-menus .nav-dropdown-menu{
          left:50%!important;right:auto!important;transform:translate(-50%,-7px) scale(.985)!important;
          width:310px!important;max-height:min(70vh,650px)!important;overflow-x:hidden!important;overflow-y:auto!important;
        }
        .site-nav .navlinks.aj-separate-menus .nav-dropdown:hover > .nav-dropdown-menu,
        .site-nav .navlinks.aj-separate-menus .nav-dropdown:focus-within > .nav-dropdown-menu,
        .site-nav .navlinks.aj-separate-menus .nav-dropdown.is-open > .nav-dropdown-menu{
          transform:translate(-50%,0) scale(1)!important;
        }
        .site-nav .navlinks.aj-separate-menus .aj-menu-ethiopia .nav-dropdown-menu{width:285px!important}
        .site-nav .navlinks.aj-separate-menus .aj-menu-offers .nav-dropdown-menu{width:390px!important}
        .site-nav .navlinks.aj-separate-menus .aj-menu-private .nav-dropdown-menu{width:310px!important}
        .site-nav .navlinks.aj-separate-menus .aj-menu-modules .nav-dropdown-menu{width:410px!important}
        .site-nav .navlinks.aj-separate-menus .aj-menu-tips .nav-dropdown-menu{width:325px!important}
        .site-nav .navlinks.aj-separate-menus .aj-menu-info .nav-dropdown-menu{width:255px!important}
        .site-nav .navlinks.aj-separate-menus .nav-dropdown-menu .drop-row{
          min-height:42px!important;height:auto!important;padding:8px 12px!important;font-size:.76rem!important;line-height:1.35!important;white-space:normal!important;
        }
      }

      @media (min-width:1181px){
        .site-nav:not(.scrolled) .nav-inner{padding-left:280px!important}
        .site-nav.scrolled .nav-inner,
        body.top-strip-collapsed .site-nav .nav-inner{padding-left:150px!important}
      }

      @media (min-width:821px) and (max-width:1180px){
        .site-nav:not(.scrolled) .nav-inner{padding-left:220px!important}
        .site-nav.scrolled .nav-inner,
        body.top-strip-collapsed .site-nav .nav-inner{padding-left:160px!important}
        .site-nav .navlinks.aj-separate-menus{gap:7px!important;margin-left:4px!important}
        .site-nav .navlinks.aj-separate-menus .nav-main-link{font-size:.64rem!important;gap:4px!important}
        .site-nav .navlinks.aj-separate-menus .aj-menu-offers .nav-dropdown-menu{width:350px!important}
        .site-nav .navlinks.aj-separate-menus .aj-menu-modules .nav-dropdown-menu{width:370px!important}
      }

      @media (max-width:820px){
        .site-nav .navlinks.aj-separate-menus > .nav-dropdown{display:block!important;height:auto!important;width:100%!important}
        .site-nav .navlinks.aj-separate-menus .nav-main-link{width:100%!important;justify-content:space-between!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}
        .site-nav .navlinks.aj-separate-menus .nav-dropdown-menu{
          position:static!important;left:auto!important;right:auto!important;top:auto!important;
          width:100%!important;max-height:0!important;padding:0 7px!important;margin:0!important;
          opacity:1!important;visibility:visible!important;pointer-events:auto!important;transform:none!important;
          border:0!important;border-radius:14px!important;background:rgba(4,23,38,.20)!important;box-shadow:none!important;
          -webkit-backdrop-filter:none!important;backdrop-filter:none!important;
          overflow:hidden!important;scroll-behavior:smooth!important;
          transition:max-height .48s cubic-bezier(.22,1,.36,1),padding .36s ease,margin .36s ease!important;
        }
        .site-nav .navlinks.aj-separate-menus .nav-dropdown.is-open > .nav-dropdown-menu{
          max-height:58vh!important;overflow-y:auto!important;overflow-x:hidden!important;padding:7px!important;margin:4px 0 8px!important;
        }
        .site-nav .navlinks.aj-separate-menus .nav-dropdown-menu .drop-row{
          height:auto!important;min-height:41px!important;padding:9px 11px!important;white-space:normal!important;line-height:1.35!important;
        }
      }


      /* V12 — visual correction from the supplied screenshot. */
      .site-nav .navlinks.aj-separate-menus > .nav-dropdown > .nav-main-link::after{
        display:none!important;
      }

      @media (min-width:821px){
        /* Every submenu starts under its own word; JS only nudges it when an edge needs clamping. */
        .site-nav .navlinks.aj-separate-menus .nav-dropdown-menu{
          left:0!important;
          right:auto!important;
          top:calc(100% - 2px)!important;
          --aj-menu-shift-x:0px;
          transform:translate(var(--aj-menu-shift-x),-6px) scale(.99)!important;
          transform-origin:top left!important;
          border-radius:14px!important;
          padding:7px!important;
          box-shadow:0 18px 46px rgba(7,29,46,.16),0 3px 12px rgba(7,29,46,.06)!important;
        }
        .site-nav .navlinks.aj-separate-menus .nav-dropdown:hover > .nav-dropdown-menu,
        .site-nav .navlinks.aj-separate-menus .nav-dropdown:focus-within > .nav-dropdown-menu,
        .site-nav .navlinks.aj-separate-menus .nav-dropdown.is-open > .nav-dropdown-menu{
          transform:translate(var(--aj-menu-shift-x),0) scale(1)!important;
        }
        .site-nav .navlinks.aj-separate-menus .nav-dropdown-menu::before{
          content:""!important;position:absolute!important;left:0!important;right:0!important;top:-10px!important;height:12px!important;
          background:transparent!important;pointer-events:auto!important;
        }
        .site-nav .navlinks.aj-separate-menus .nav-dropdown-menu::after{display:none!important}

        .site-nav .navlinks.aj-separate-menus .aj-menu-ethiopia .nav-dropdown-menu{width:250px!important}
        .site-nav .navlinks.aj-separate-menus .aj-menu-offers .nav-dropdown-menu{width:340px!important}
        .site-nav .navlinks.aj-separate-menus .aj-menu-private .nav-dropdown-menu{width:285px!important}
        .site-nav .navlinks.aj-separate-menus .aj-menu-modules .nav-dropdown-menu{width:360px!important}
        .site-nav .navlinks.aj-separate-menus .aj-menu-tips .nav-dropdown-menu{width:300px!important}
        .site-nav .navlinks.aj-separate-menus .aj-menu-info .nav-dropdown-menu{width:230px!important}

        .site-nav .navlinks.aj-separate-menus .nav-dropdown-menu .drop-row{
          min-height:38px!important;
          padding:7px 10px!important;
          font-size:.77rem!important;
          line-height:1.28!important;
          border-radius:9px!important;
        }

        /* Keep the first navigation item clearly separated from the logo. */
        .site-nav .navlinks.aj-separate-menus{
          margin-left:0!important;
          gap:11px!important;
        }
        .site-nav .navlinks.aj-separate-menus > .nav-dropdown:first-child{
          margin-left:0!important;
        }
        .site-nav .navlinks.aj-separate-menus .nav-main-link{
          font-size:.72rem!important;
          gap:5px!important;
        }
      }

      @media (min-width:1181px){
        .site-nav:not(.scrolled) .nav-inner{
          padding-left:246px!important;
        }
        .site-nav:not(.scrolled) .brand{
          left:8px!important;
          width:220px!important;
          height:146px!important;
          min-width:220px!important;
        }
        .site-nav:not(.scrolled) .brand-emblem,
        .site-nav:not(.scrolled) .brand-emblem img,
        .site-nav:not(.scrolled) .brand-logo{
          width:220px!important;
          height:146px!important;
          min-width:220px!important;
        }
        .site-nav.scrolled .nav-inner,
        body.top-strip-collapsed .site-nav .nav-inner{
          padding-left:132px!important;
        }
        .site-nav.scrolled .brand,
        body.top-strip-collapsed .site-nav .brand{
          width:104px!important;
          height:66px!important;
          min-width:104px!important;
        }
        .site-nav.scrolled .brand-emblem,
        .site-nav.scrolled .brand-emblem img,
        .site-nav.scrolled .brand-logo,
        body.top-strip-collapsed .site-nav .brand-emblem,
        body.top-strip-collapsed .site-nav .brand-emblem img,
        body.top-strip-collapsed .site-nav .brand-logo{
          width:104px!important;
          height:66px!important;
          min-width:104px!important;
        }
      }

      @media (min-width:821px) and (max-width:1180px){
        .site-nav:not(.scrolled) .nav-inner{padding-left:194px!important}
        .site-nav .navlinks.aj-separate-menus{gap:6px!important}
        .site-nav .navlinks.aj-separate-menus .nav-main-link{font-size:.63rem!important;gap:4px!important}
        .site-nav .navlinks.aj-separate-menus .aj-menu-offers .nav-dropdown-menu{width:320px!important}
        .site-nav .navlinks.aj-separate-menus .aj-menu-modules .nav-dropdown-menu{width:335px!important}
      }

      /* V17 — smoother, more refined desktop dropdown animation. */
      @media (min-width:821px){
        .site-nav .navlinks.aj-separate-menus > .nav-dropdown > .nav-main-link{
          position:relative!important;
          padding:8px 7px!important;
          border-radius:10px!important;
          transition:background-color .24s ease,box-shadow .24s ease,transform .24s cubic-bezier(.22,1,.36,1)!important;
        }
        .site-nav .navlinks.aj-separate-menus > .nav-dropdown:hover > .nav-main-link,
        .site-nav .navlinks.aj-separate-menus > .nav-dropdown:focus-within > .nav-main-link,
        .site-nav .navlinks.aj-separate-menus > .nav-dropdown.is-open > .nav-main-link{
          background:rgba(216,170,77,.09)!important;
          box-shadow:inset 0 0 0 1px rgba(216,170,77,.18)!important;
          transform:translateY(-1px)!important;
        }
        .site-nav .navlinks.aj-separate-menus .nav-arrow{
          transition:transform .38s cubic-bezier(.22,1,.36,1),opacity .22s ease!important;
        }
        .site-nav .navlinks.aj-separate-menus .nav-dropdown-menu{
          opacity:0!important;
          visibility:hidden!important;
          pointer-events:none!important;
          transform:translate(var(--aj-menu-shift-x),10px) scale(.975)!important;
          transform-origin:top left!important;
          background:linear-gradient(180deg,rgba(255,255,255,.995),rgba(249,246,238,.99))!important;
          border:1px solid rgba(23,58,85,.12)!important;
          border-radius:16px!important;
          box-shadow:0 24px 64px rgba(7,29,46,.19),0 7px 20px rgba(7,29,46,.08)!important;
          -webkit-backdrop-filter:blur(16px) saturate(1.05)!important;
          backdrop-filter:blur(16px) saturate(1.05)!important;
          will-change:opacity,transform!important;
          transition:opacity .24s ease,transform .36s cubic-bezier(.16,1,.3,1),visibility 0s linear .28s,box-shadow .3s ease!important;
        }
        .site-nav .navlinks.aj-separate-menus .nav-dropdown:hover > .nav-dropdown-menu,
        .site-nav .navlinks.aj-separate-menus .nav-dropdown:focus-within > .nav-dropdown-menu,
        .site-nav .navlinks.aj-separate-menus .nav-dropdown.is-open > .nav-dropdown-menu{
          opacity:1!important;
          visibility:visible!important;
          pointer-events:auto!important;
          transform:translate(var(--aj-menu-shift-x),0) scale(1)!important;
          transition:opacity .24s ease,transform .36s cubic-bezier(.16,1,.3,1),visibility 0s,box-shadow .3s ease!important;
        }
        .site-nav .navlinks.aj-separate-menus .nav-dropdown-menu::after{
          display:block!important;
          content:""!important;
          position:absolute!important;
          left:12px!important;right:12px!important;top:0!important;
          height:2px!important;width:auto!important;
          border:0!important;border-radius:999px!important;
          background:linear-gradient(90deg,rgba(216,170,77,.82),rgba(216,170,77,.16),transparent)!important;
          transform:none!important;
          pointer-events:none!important;
        }
        .site-nav .navlinks.aj-separate-menus .nav-dropdown-menu .drop-row{
          border:1px solid transparent!important;
          background:transparent!important;
          transition:background-color .22s ease,border-color .22s ease,color .22s ease,transform .28s cubic-bezier(.22,1,.36,1),box-shadow .22s ease!important;
        }
        .site-nav .navlinks.aj-separate-menus .nav-dropdown-menu .drop-row:hover,
        .site-nav .navlinks.aj-separate-menus .nav-dropdown-menu .drop-row:focus-visible{
          background:rgba(255,255,255,.88)!important;
          border-color:rgba(216,170,77,.20)!important;
          transform:translateX(3px)!important;
          box-shadow:0 7px 18px rgba(7,29,46,.06)!important;
        }
        .site-nav .navlinks.aj-separate-menus .nav-dropdown-menu .drop-row::before{
          transition:height .28s cubic-bezier(.22,1,.36,1),opacity .2s ease!important;
          opacity:.72!important;
        }
        .site-nav .navlinks.aj-separate-menus .nav-dropdown-menu .drop-row:hover::before,
        .site-nav .navlinks.aj-separate-menus .nav-dropdown-menu .drop-row:focus-visible::before{
          height:22px!important;
          opacity:1!important;
        }
      }


      /* Automatic translated-header fallback. If the six labels no longer fit,
         switch only the navigation links to a clean drawer while keeping the
         desktop logo, wishlist and language controls in place. */
      @media (min-width:821px){
        .site-nav.aj-nav-compact .menuBtn{
          display:grid!important;order:3!important;flex:0 0 44px!important;
          width:44px!important;height:44px!important;min-width:44px!important;
          margin-left:4px!important;border:0!important;border-radius:12px!important;
          background:rgba(12,41,66,.06)!important;box-shadow:none!important;
        }
        .site-nav.aj-nav-compact:not(.scrolled) .menu-icon::before,
        .site-nav.aj-nav-compact:not(.scrolled) .menu-icon::after{background:#0b2942!important}
        .site-nav.aj-nav-compact.scrolled .menu-icon::before,
        .site-nav.aj-nav-compact.scrolled .menu-icon::after{background:#fff!important}
        .site-nav.aj-nav-compact .navlinks.aj-separate-menus{
          position:absolute!important;top:calc(100% + 8px)!important;right:10px!important;left:auto!important;
          z-index:1200!important;width:min(390px,calc(100vw - 24px))!important;max-width:calc(100vw - 24px)!important;
          display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;
          gap:4px!important;margin:0!important;padding:0 12px!important;max-height:0!important;
          overflow:hidden!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;
          background:linear-gradient(180deg,#ffffff,#faf7f0)!important;
          border:1px solid rgba(23,58,85,.13)!important;border-radius:16px!important;
          box-shadow:0 24px 60px rgba(7,29,46,.20)!important;
          transition:max-height .28s ease,opacity .18s ease,padding .22s ease,visibility 0s linear .28s!important;
        }
        .site-nav.aj-nav-compact .navlinks.aj-separate-menus.open{
          max-height:min(74vh,680px)!important;padding:12px!important;overflow:auto!important;
          opacity:1!important;visibility:visible!important;pointer-events:auto!important;
          transition:max-height .32s ease,opacity .18s ease,padding .22s ease,visibility 0s!important;
        }
        .site-nav.aj-nav-compact .navlinks.aj-separate-menus > .nav-dropdown{
          display:block!important;width:100%!important;height:auto!important;margin:0!important;position:relative!important;
        }
        .site-nav.aj-nav-compact .navlinks.aj-separate-menus > .nav-dropdown > .nav-main-link{
          width:100%!important;min-height:43px!important;padding:10px 11px!important;justify-content:space-between!important;
          color:#123752!important;background:transparent!important;border:0!important;border-radius:10px!important;
          box-shadow:none!important;transform:none!important;font-size:.79rem!important;line-height:1.2!important;
        }
        .site-nav.aj-nav-compact .navlinks.aj-separate-menus > .nav-dropdown > .nav-main-link:hover,
        .site-nav.aj-nav-compact .navlinks.aj-separate-menus > .nav-dropdown.is-open > .nav-main-link{
          color:#0b2942!important;background:#eef3f6!important;box-shadow:none!important;transform:none!important;
        }
        .site-nav.aj-nav-compact .navlinks.aj-separate-menus .nav-arrow{
          color:#b57a18!important;margin-left:auto!important;
        }
        .site-nav.aj-nav-compact .navlinks.aj-separate-menus .nav-dropdown-menu,
        .site-nav.aj-nav-compact .navlinks.aj-separate-menus .nav-dropdown:hover > .nav-dropdown-menu,
        .site-nav.aj-nav-compact .navlinks.aj-separate-menus .nav-dropdown:focus-within > .nav-dropdown-menu{
          position:static!important;left:auto!important;right:auto!important;top:auto!important;
          width:100%!important;max-width:100%!important;max-height:0!important;margin:0!important;padding:0 6px!important;
          overflow:hidden!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;
          transform:none!important;background:#f3f6f8!important;border:0!important;border-radius:11px!important;
          box-shadow:none!important;transition:max-height .28s ease,padding .22s ease,margin .22s ease!important;
        }
        .site-nav.aj-nav-compact .navlinks.aj-separate-menus .nav-dropdown.is-open > .nav-dropdown-menu{
          max-height:50vh!important;margin:3px 0 7px!important;padding:6px!important;overflow:auto!important;
        }
        .site-nav.aj-nav-compact .navlinks.aj-separate-menus .nav-dropdown-menu::before,
        .site-nav.aj-nav-compact .navlinks.aj-separate-menus .nav-dropdown-menu::after{display:none!important}
        .site-nav.aj-nav-compact .navlinks.aj-separate-menus .nav-dropdown-menu .drop-row{
          min-height:39px!important;padding:8px 10px!important;color:#24465f!important;background:transparent!important;
          border:0!important;border-radius:8px!important;font-size:.75rem!important;line-height:1.3!important;transform:none!important;
        }
        .site-nav.aj-nav-compact .navlinks.aj-separate-menus .nav-dropdown-menu .drop-row:hover,
        .site-nav.aj-nav-compact .navlinks.aj-separate-menus .nav-dropdown-menu .drop-row:focus-visible{
          color:#0b2942!important;background:#fff!important;box-shadow:none!important;transform:none!important;
        }
      }

      @media (min-width:821px) and (prefers-reduced-motion:reduce){
        .site-nav .navlinks.aj-separate-menus .nav-dropdown-menu,
        .site-nav .navlinks.aj-separate-menus .nav-main-link,
        .site-nav .navlinks.aj-separate-menus .nav-arrow,
        .site-nav .navlinks.aj-separate-menus .drop-row{transition:none!important}
      }
    `;
    document.head.appendChild(s);
  }

  function navOffset(){
    const nav=document.querySelector('.site-nav');
    const h=nav ? Math.max(64, Math.round(nav.getBoundingClientRect().height)) : 80;
    return h + 18;
  }

  function sameDocumentAnchor(anchor){
    try{
      const u=new URL(anchor.href, location.href);
      return u.origin===location.origin && u.pathname===location.pathname && u.search===location.search && !!u.hash;
    }catch(e){ return false; }
  }

  function exactScrollToHash(hash, smooth=true){
    if(!hash || hash==='#') return false;
    let id='';
    try{id=decodeURIComponent(hash.slice(1));}catch(e){id=hash.slice(1)}
    const target=document.getElementById(id);
    if(!target) return false;
    const y=Math.max(0, target.getBoundingClientRect().top + window.scrollY - navOffset());
    window.scrollTo({top:y, behavior:(smooth && !matchMedia('(prefers-reduced-motion: reduce)').matches)?'smooth':'auto'});
    return true;
  }

  function bindExactAnchorPositioning(){
    document.addEventListener('click', e=>{
      const a=e.target.closest('a[href*="#"]');
      if(!a || !sameDocumentAnchor(a)) return;
      const u=new URL(a.href, location.href);
      if(!document.getElementById(decodeURIComponent(u.hash.slice(1)))) return;
      e.preventDefault();
      history.pushState(null,'',u.hash);
      closeAnyMenus();
      exactScrollToHash(u.hash,true);
    });

    function settleInitialHash(){
      if(!location.hash) return;
      exactScrollToHash(location.hash,false);
      setTimeout(()=>exactScrollToHash(location.hash,false),120);
      setTimeout(()=>exactScrollToHash(location.hash,false),520);
    }
    if(document.readyState==='complete') settleInitialHash();
    else window.addEventListener('load',settleInitialHash,{once:true});
    window.addEventListener('hashchange',()=>exactScrollToHash(location.hash,true));
  }

  function closeAnyMenus(){
    document.querySelectorAll('.nav-dropdown.is-open').forEach(d=>d.classList.remove('is-open'));
    document.querySelectorAll('.nav-main-link[aria-expanded="true"]').forEach(a=>a.setAttribute('aria-expanded','false'));
  }

  function init(){ injectStyles(); build(); bindExactAnchorPositioning(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
