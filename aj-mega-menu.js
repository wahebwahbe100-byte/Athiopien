(function(){
  'use strict';

  const script = document.currentScript;
  const root = script ? new URL('.', script.src) : new URL('.', location.href);
  const url = (path) => new URL(path, root).href;

  // Each top-level item owns ONLY its own dropdown.
  // Every submenu entry points to the matching existing page/section.
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
        ['Über uns', 'info.html#ueber-uns'],
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

  function closeMobileDrawer(nav, links){
    links.classList.remove('open');
    const btn = nav.querySelector('.menuBtn');
    btn?.classList.remove('menu-open');
    btn?.setAttribute('aria-expanded', 'false');
    btn?.setAttribute('aria-label', 'Menü öffnen');
    document.body.classList.remove('menu-locked');
  }

  function fitDropdown(drop){
    if (innerWidth <= 820 || !drop) return;
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
      if (innerWidth > 820) return;
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
        if (innerWidth <= 820) {
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
        if (innerWidth > 820 && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
          if (e.key !== 'Enter') e.preventDefault();
          openDrop(drop);
          panel?.querySelector('a')?.focus();
        }
      });

      // Desktop: keep the dropdown open while the pointer moves from the heading
      // into the panel. The small delay also makes diagonal mouse movement forgiving.
      drop.addEventListener('mouseenter', () => {
        if (innerWidth > 820) openDrop(drop);
      });
      panel?.addEventListener('mouseenter', () => {
        if (innerWidth > 820) {
          cancelClose(drop);
          drop.classList.add('is-open');
          main.setAttribute('aria-expanded', 'true');
        }
      });
      drop.addEventListener('mouseleave', () => {
        if (innerWidth > 820) {
          cancelClose(drop);
          const timer = setTimeout(() => closeDrop(drop), 320);
          closeTimers.set(drop, timer);
        }
      });
      panel?.addEventListener('mouseleave', () => {
        if (innerWidth > 820) {
          cancelClose(drop);
          const timer = setTimeout(() => closeDrop(drop), 220);
          closeTimers.set(drop, timer);
        }
      });
    });

    links.querySelectorAll('.nav-dropdown-menu a').forEach(a => a.addEventListener('click', () => {
      closeOthers();
      if (innerWidth <= 820) closeMobileDrawer(nav, links);
    }));

    document.addEventListener('click', (e) => {
      if (!links.contains(e.target)) {
        closeOthers();
        if (innerWidth <= 820 && links.classList.contains('open') && !nav.contains(e.target)) {
          closeMobileDrawer(nav, links);
        }
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeOthers();
        if (innerWidth <= 820 && links.classList.contains('open')) closeMobileDrawer(nav, links);
      }
    });
    window.addEventListener('resize', () => {
      closeOthers();
      dropdowns.forEach(fitDropdown);
    }, {passive:true});
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
          <span>${group.title}</span><i class="nav-arrow" aria-hidden="true"></i>
        </a>
        <div class="nav-dropdown-menu" aria-label="${group.title} Untermenü">
          ${group.items.map(([label, href]) => `<a class="drop-row" href="${url(href)}"><span>${label}</span></a>`).join('')}
        </div>
      </div>`).join('');

    bindMobileMenuButton(nav, links);
    bindMenus(nav, links);
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
