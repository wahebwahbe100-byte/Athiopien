(function(){
  'use strict';

  var lastWidth = window.innerWidth || document.documentElement.clientWidth || 0;
  var geoTick = 0;

  function setViewportVars(){
    var h = window.innerHeight || document.documentElement.clientHeight || 0;
    if(h) document.documentElement.style.setProperty('--aj-js-vh', (h * 0.01) + 'px');
  }

  function setNavGeometry(){
    var nav=document.querySelector('.site-nav');
    if(!nav) return;
    var rect=nav.getBoundingClientRect();
    var bottom=Math.max(0,Math.min(window.innerHeight || 9999,Math.round(rect.bottom)));
    if(bottom) document.documentElement.style.setProperty('--aj-nav-drawer-top', bottom+'px');
  }

  function requestNavGeometry(){
    if(geoTick) return;
    geoTick=requestAnimationFrame(function(){geoTick=0;setNavGeometry();});
  }

  function installLateTabletMenuGuard(){
    if(document.getElementById('aj-tablet-menu-guard-v2')) return;
    var s=document.createElement('style');
    s.id='aj-tablet-menu-guard-v2';
    s.textContent=`
@media (min-width:769px) and (max-width:1080px){
 .site-nav .menuBtn{display:grid!important;place-items:center!important;flex:0 0 46px!important;width:46px!important;min-width:46px!important;height:44px!important;min-height:44px!important;order:3!important;margin-left:4px!important;z-index:1302!important}
 .site-nav .navlinks,.site-nav.aj-nav-compact .navlinks,.site-nav .navlinks.aj-separate-menus,.site-nav.aj-nav-compact .navlinks.aj-separate-menus{position:fixed!important;top:var(--aj-nav-drawer-top,78px)!important;right:14px!important;left:auto!important;z-index:1300!important;width:min(430px,calc(100vw - 28px))!important;max-width:calc(100vw - 28px)!important;height:auto!important;max-height:0!important;margin:0!important;padding:0 12px!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;gap:4px!important;overflow:hidden!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:none!important;background:linear-gradient(145deg,#183c5a 0%,#123752 48%,#0c2942 100%)!important;border:1px solid rgba(255,255,255,.14)!important;border-radius:0 0 18px 18px!important;box-shadow:0 24px 60px rgba(3,20,34,.32)!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;transition:max-height .28s ease,opacity .18s ease,padding .22s ease,visibility 0s linear .28s!important}
 .site-nav .navlinks.open,.site-nav.aj-nav-compact .navlinks.open,.site-nav .navlinks.aj-separate-menus.open,.site-nav.aj-nav-compact .navlinks.aj-separate-menus.open{max-height:min(calc(100dvh - var(--aj-nav-drawer-top,78px) - 14px),680px)!important;padding:12px!important;overflow-x:hidden!important;overflow-y:auto!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior:contain!important;transition:max-height .32s ease,opacity .18s ease,padding .22s ease,visibility 0s!important}
 .site-nav .navlinks>a,.site-nav .navlinks>.nav-dropdown>.nav-main-link,.site-nav.aj-nav-compact .navlinks>.nav-dropdown>.nav-main-link{width:100%!important;min-width:0!important;min-height:44px!important;margin:0!important;padding:11px 12px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;text-align:left!important;white-space:normal!important;color:#f7fafc!important;background:transparent!important;border:0!important;border-radius:10px!important;box-shadow:none!important;transform:none!important;font-size:.82rem!important;line-height:1.3!important}
 .site-nav .navlinks>a::after,.site-nav .navlinks>.nav-dropdown>.nav-main-link::after{display:none!important}
 .site-nav .navlinks>a:hover,.site-nav .navlinks>a.active,.site-nav .navlinks>.nav-dropdown>.nav-main-link:hover,.site-nav .navlinks>.nav-dropdown.is-open>.nav-main-link{color:#f2cf74!important;background:rgba(255,255,255,.08)!important}
 .site-nav .navlinks>.nav-dropdown{display:block!important;position:relative!important;width:100%!important;min-width:0!important;height:auto!important;margin:0!important}
 .site-nav .navlinks .nav-dropdown-menu,.site-nav.aj-nav-compact .navlinks .nav-dropdown-menu,.site-nav .navlinks .nav-dropdown:hover>.nav-dropdown-menu,.site-nav .navlinks .nav-dropdown:focus-within>.nav-dropdown-menu{position:static!important;inset:auto!important;width:100%!important;min-width:0!important;max-width:100%!important;height:auto!important;max-height:0!important;margin:0!important;padding:0 6px!important;display:block!important;overflow:hidden!important;opacity:1!important;visibility:hidden!important;pointer-events:none!important;transform:none!important;background:rgba(255,255,255,.07)!important;border:0!important;border-radius:10px!important;box-shadow:none!important;transition:max-height .24s ease,padding .2s ease,margin .2s ease!important}
 .site-nav .navlinks .nav-dropdown.is-open>.nav-dropdown-menu,.site-nav.aj-nav-compact .navlinks .nav-dropdown.is-open>.nav-dropdown-menu{max-height:min(48dvh,360px)!important;margin:3px 0 7px!important;padding:6px!important;overflow:auto!important;visibility:visible!important;pointer-events:auto!important}
 .site-nav .navlinks .nav-dropdown-menu::before,.site-nav .navlinks .nav-dropdown-menu::after{display:none!important}
 .site-nav .navlinks .nav-dropdown-menu a,.site-nav .navlinks .nav-dropdown-menu .drop-row{min-height:38px!important;padding:8px 10px!important;color:#eef5f9!important;background:transparent!important;border:0!important;border-radius:8px!important;font-size:.76rem!important;line-height:1.3!important;transform:none!important}
 .site-nav .navlinks .nav-dropdown-menu a:hover,.site-nav .navlinks .nav-dropdown-menu .drop-row:hover{color:#f2cf74!important;background:rgba(255,255,255,.07)!important}
 #langMenu.langmenu,#currencyMenu.currmenu{position:fixed!important;top:var(--aj-nav-drawer-top,78px)!important;right:14px!important;left:auto!important;max-width:calc(100vw - 28px)!important;max-height:calc(100dvh - var(--aj-nav-drawer-top,78px) - 14px)!important;overflow:auto!important;z-index:1310!important}
}
@media (min-width:769px) and (max-width:920px){
 .site-nav .nav-actions>.nav-cta,.site-nav .nav-actions>a.btn.primary,.site-nav .nav-actions>.nav-login{display:none!important}
 .site-nav .nav-actions{margin-left:auto!important;gap:7px!important;min-width:0!important}
}`;
    document.head.appendChild(s);
  }

  function closeAllMenus(){
    document.querySelectorAll('.navlinks.open').forEach(function(el){el.classList.remove('open');});
    document.querySelectorAll('.langmenu.open,.currmenu.open').forEach(function(el){el.classList.remove('open');});
    document.querySelectorAll('.nav-dropdown.is-open,.drop-group.is-open').forEach(function(el){el.classList.remove('is-open');});
    document.querySelectorAll('.menuBtn.menu-open').forEach(function(el){
      el.classList.remove('menu-open');
      el.setAttribute('aria-expanded','false');
      el.setAttribute('aria-label','Menü öffnen');
    });
    document.querySelectorAll('[aria-expanded="true"]#langBtn,[aria-expanded="true"]#currencyBtn').forEach(function(el){el.setAttribute('aria-expanded','false');});
    if(document.body){
      document.body.classList.remove('menu-locked');
      if(document.body.style && document.body.style.overflow==='hidden' && !document.querySelector('.trip-lightbox.is-open,.aj-wishlist-overlay.is-open')){
        document.body.style.removeProperty('overflow');
      }
    }
  }

  function syncMenuLock(){
    if(!document.body) return;
    var openNav=document.querySelector('.site-nav .navlinks.open');
    if(openNav && window.innerWidth<=1080) document.body.classList.add('menu-locked');
    else if(!document.querySelector('.trip-lightbox.is-open,.aj-wishlist-overlay.is-open')) document.body.classList.remove('menu-locked');
  }

  function observeMenus(){
    document.querySelectorAll('.site-nav .navlinks').forEach(function(nav){
      if(nav.dataset.ajStabilityObserved==='1') return;
      nav.dataset.ajStabilityObserved='1';
      new MutationObserver(function(){syncMenuLock();requestNavGeometry();}).observe(nav,{attributes:true,attributeFilter:['class']});
    });
  }

  function recoverFromBFCache(){
    setViewportVars();
    installLateTabletMenuGuard();
    closeAllMenus();
    observeMenus();
    requestNavGeometry();
  }

  function onResize(){
    setViewportVars();
    requestNavGeometry();
    var w=window.innerWidth || document.documentElement.clientWidth || 0;
    if(Math.abs(w-lastWidth)>24){
      closeAllMenus();
      lastWidth=w;
    }
  }

  function onOrientationChange(){
    closeAllMenus();
    window.setTimeout(function(){
      setViewportVars();
      closeAllMenus();
      observeMenus();
      requestNavGeometry();
      lastWidth=window.innerWidth || document.documentElement.clientWidth || lastWidth;
    },120);
  }

  function init(){
    setViewportVars();
    installLateTabletMenuGuard();
    closeAllMenus();
    observeMenus();
    requestNavGeometry();
  }

  /* Close an open drawer when the user taps outside it. */
  document.addEventListener('pointerdown',function(e){
    var open=document.querySelector('.site-nav .navlinks.open');
    if(!open) return;
    if(e.target.closest('.site-nav')) return;
    closeAllMenus();
  },{passive:true});

  /* Menu class changes happen in legacy handlers; sync body lock on next task. */
  document.addEventListener('click',function(e){
    if(e.target.closest('.menuBtn')) window.setTimeout(function(){syncMenuLock();requestNavGeometry();},0);
  },true);

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
  window.addEventListener('pageshow',recoverFromBFCache,{passive:true});
  window.addEventListener('resize',onResize,{passive:true});
  window.addEventListener('scroll',requestNavGeometry,{passive:true});
  window.addEventListener('orientationchange',onOrientationChange,{passive:true});
}());
