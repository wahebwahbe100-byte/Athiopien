(function(){
  'use strict';

  const STYLE_ID='aj-logo-scroll-lock-v18-style';
  const BODY_CLASS='aj-logo-scroll-lock-v18';
  const SHRINK_AT=24;
  const RESTORE_AT=3;

  const css=`
/* AJ v18 — one final scroll controller for the header/logo.
   The header is pinned before the first scroll pixel, so the logo can only
   shrink in place. No absolute→fixed jump, no top-strip jump and no vertical
   transform animation are allowed. */
body.${BODY_CLASS} .site-nav,
body.${BODY_CLASS} .site-nav:not(.scrolled),
body.${BODY_CLASS} .site-nav.scrolled,
body.${BODY_CLASS}.top-strip-collapsed .site-nav,
body.${BODY_CLASS}.top-strip-collapsed .site-nav.scrolled{
  position:fixed!important;
  top:var(--aj-logo-lock-nav-top,0px)!important;
  left:0!important;
  right:0!important;
  width:100%!important;
  transform:none!important;
  margin:0!important;
  border-top:0!important;
  will-change:auto!important;
  transition:background-color .22s ease,background .22s ease,box-shadow .22s ease,border-color .22s ease!important;
}

/* The optional information strip may stay visible, but it must never pull the
   navigation/logo upward while the user scrolls. */
body.${BODY_CLASS} .site-top,
body.${BODY_CLASS}.top-strip-collapsed .site-top{
  transform:none!important;
  translate:none!important;
  opacity:1!important;
  visibility:visible!important;
  transition:none!important;
}

/* Lock the logo's top-left anchor. Width changes are the only animated logo
   property, therefore shrinking cannot produce an up/down bounce. */
body.${BODY_CLASS} .site-nav .brand,
body.${BODY_CLASS} .site-nav:not(.scrolled) .brand,
body.${BODY_CLASS} .site-nav.scrolled .brand,
body.${BODY_CLASS} .site-nav .brand-index-logo,
body.${BODY_CLASS} .site-nav:not(.scrolled) .brand-index-logo,
body.${BODY_CLASS} .site-nav.scrolled .brand-index-logo{
  position:absolute!important;
  left:var(--aj-logo-lock-left,8px)!important;
  right:auto!important;
  top:0!important;
  bottom:auto!important;
  transform:none!important;
  translate:none!important;
  height:auto!important;
  min-height:0!important;
  max-height:none!important;
  overflow:visible!important;
  margin:0!important;
  padding:0!important;
  transform-origin:top left!important;
  transition:width .22s cubic-bezier(.22,1,.36,1),min-width .22s cubic-bezier(.22,1,.36,1)!important;
}
body.${BODY_CLASS} .site-nav .brand-emblem,
body.${BODY_CLASS} .site-nav .brand-index-logo .brand-emblem{
  display:block!important;
  width:100%!important;
  height:auto!important;
  min-height:0!important;
  max-height:none!important;
  overflow:visible!important;
  transform:none!important;
  transition:none!important;
}
body.${BODY_CLASS} .site-nav .brand-logo,
body.${BODY_CLASS} .site-nav .brand-index-logo .brand-logo,
body.${BODY_CLASS} .site-nav.scrolled .brand-logo,
body.${BODY_CLASS}.top-strip-collapsed .site-nav .brand-logo{
  display:block!important;
  width:100%!important;
  height:auto!important;
  min-width:0!important;
  min-height:0!important;
  max-width:none!important;
  max-height:none!important;
  margin:0!important;
  padding:0!important;
  object-fit:contain!important;
  object-position:left top!important;
  transform:none!important;
  translate:none!important;
  clip-path:none!important;
  -webkit-clip-path:none!important;
  mask:none!important;
  -webkit-mask:none!important;
  transition:none!important;
}

/* Desktop */
@media (min-width:1181px){
  body.${BODY_CLASS}{--aj-logo-lock-left:8px}
  body.${BODY_CLASS} .site-nav:not(.scrolled) .brand,
  body.${BODY_CLASS} .site-nav:not(.scrolled) .brand-index-logo{
    width:220px!important;min-width:220px!important;
  }
  body.${BODY_CLASS} .site-nav.scrolled .brand,
  body.${BODY_CLASS} .site-nav.scrolled .brand-index-logo{
    width:112px!important;min-width:112px!important;
  }
  body.${BODY_CLASS} .site-nav:not(.scrolled) .nav-inner{
    height:112px!important;min-height:112px!important;padding-left:246px!important;
  }
  body.${BODY_CLASS} .site-nav.scrolled .nav-inner{
    height:72px!important;min-height:72px!important;padding-left:132px!important;
  }
}

/* Laptops / landscape tablets */
@media (min-width:769px) and (max-width:1180px){
  body.${BODY_CLASS}{--aj-logo-lock-left:6px}
  body.${BODY_CLASS} .site-nav:not(.scrolled) .brand,
  body.${BODY_CLASS} .site-nav:not(.scrolled) .brand-index-logo{
    width:184px!important;min-width:184px!important;
  }
  body.${BODY_CLASS} .site-nav.scrolled .brand,
  body.${BODY_CLASS} .site-nav.scrolled .brand-index-logo{
    width:102px!important;min-width:102px!important;
  }
  body.${BODY_CLASS} .site-nav:not(.scrolled) .nav-inner{
    height:96px!important;min-height:96px!important;padding-left:202px!important;
  }
  body.${BODY_CLASS} .site-nav.scrolled .nav-inner{
    height:72px!important;min-height:72px!important;padding-left:118px!important;
  }
}

/* Mobile: top edge stays at 0; the logo gets smaller only. */
@media (max-width:768px){
  body.${BODY_CLASS}{--aj-logo-lock-nav-top:0px;--aj-logo-lock-left:2px}
  body.${BODY_CLASS} .site-top{display:none!important}
  body.${BODY_CLASS} .site-nav,
  body.${BODY_CLASS} .site-nav:not(.scrolled),
  body.${BODY_CLASS} .site-nav.scrolled{
    top:0!important;
    padding-top:env(safe-area-inset-top)!important;
  }
  body.${BODY_CLASS} .site-nav:not(.scrolled) .brand,
  body.${BODY_CLASS} .site-nav:not(.scrolled) .brand-index-logo{
    width:82px!important;min-width:82px!important;
  }
  body.${BODY_CLASS} .site-nav.scrolled .brand,
  body.${BODY_CLASS} .site-nav.scrolled .brand-index-logo{
    width:62px!important;min-width:62px!important;
  }
  body.${BODY_CLASS} .site-nav:not(.scrolled) .nav-inner{
    height:86px!important;min-height:86px!important;padding-left:94px!important;
  }
  body.${BODY_CLASS} .site-nav.scrolled .nav-inner{
    height:64px!important;min-height:64px!important;padding-left:72px!important;
  }
  body.${BODY_CLASS} .site-nav .navlinks{top:64px!important}
}

@media (max-width:390px){
  body.${BODY_CLASS} .site-nav:not(.scrolled) .brand,
  body.${BODY_CLASS} .site-nav:not(.scrolled) .brand-index-logo{
    width:76px!important;min-width:76px!important;
  }
  body.${BODY_CLASS} .site-nav.scrolled .brand,
  body.${BODY_CLASS} .site-nav.scrolled .brand-index-logo{
    width:58px!important;min-width:58px!important;
  }
  body.${BODY_CLASS} .site-nav:not(.scrolled) .nav-inner{padding-left:86px!important}
  body.${BODY_CLASS} .site-nav.scrolled .nav-inner{padding-left:68px!important}
}

@media (prefers-reduced-motion:reduce){
  body.${BODY_CLASS} .site-nav .brand,
  body.${BODY_CLASS} .site-nav .brand-index-logo{transition:none!important}
}
`;

  function putStyleLast(){
    let style=document.getElementById(STYLE_ID);
    if(!style){
      style=document.createElement('style');
      style.id=STYLE_ID;
      style.textContent=css;
    }
    (document.head||document.documentElement).appendChild(style);
  }

  function init(){
    const nav=document.querySelector('.site-nav');
    if(!nav||!document.body)return;

    document.body.classList.add(BODY_CLASS);
    let shrunk=false;
    let raf=0;

    const setFixedTop=()=>{
      const topStrip=document.querySelector('.site-top');
      let top=0;
      if(window.innerWidth>768 && topStrip){
        const cs=getComputedStyle(topStrip);
        if(cs.display!=='none' && cs.visibility!=='hidden'){
          top=Math.max(0,Math.round(topStrip.getBoundingClientRect().height||42));
        }
      }
      document.documentElement.style.setProperty('--aj-logo-lock-nav-top',top+'px');
    };

    const sync=()=>{
      const y=Math.max(0,window.scrollY||window.pageYOffset||0);
      if(y>SHRINK_AT)shrunk=true;
      else if(y<=RESTORE_AT)shrunk=false;
      nav.classList.toggle('scrolled',shrunk);
      /* Older header scripts may still add this class. Removing it here makes
         their scroll-direction animation visually inert. */
      document.body.classList.remove('top-strip-collapsed');
      setFixedTop();
      raf=0;
    };

    const requestSync=()=>{
      if(raf)return;
      raf=requestAnimationFrame(sync);
    };

    /* Re-append after legacy late-style injectors so this is always the final
       authority on logo position. */
    putStyleLast();
    requestAnimationFrame(()=>{putStyleLast();sync();});
    setTimeout(()=>{putStyleLast();sync();},260);

    window.addEventListener('scroll',requestSync,{passive:true});
    window.addEventListener('resize',()=>{putStyleLast();requestSync();},{passive:true});
    window.addEventListener('pageshow',()=>{putStyleLast();sync();},{passive:true});

    const bodyObserver=new MutationObserver(()=>{
      if(document.body.classList.contains('top-strip-collapsed')){
        document.body.classList.remove('top-strip-collapsed');
      }
    });
    bodyObserver.observe(document.body,{attributes:true,attributeFilter:['class']});
  }

  putStyleLast();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
