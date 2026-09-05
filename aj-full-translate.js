/* Abyssinia Journeys - fast in-page translation via Microsoft Azure Translator */
(function(){
  'use strict';

  const CFG = Object.assign({
    sourceLanguage: 'de',
    apiKey: '',
    region: '',
    endpoint: 'https://api.cognitive.microsofttranslator.com',
    requestTimeoutMs: 6500,
    maxBatchItems: 35,
    maxBatchChars: 9000,
    maxConcurrentRequests: 2,
    maxRetries: 2,
    autoDetectSource: false,
    dynamicDebounceMs: 450,
    switchDebounceMs: 160,
    cacheVersion: 'v1'
  }, window.AJ_AZURE_TRANSLATOR_CONFIG || {});

  const LANGS = {
    de:{name:'Deutsch'}, en:{name:'English'}, ar:{name:'العربية'}, zh:{name:'中文'},
    fr:{name:'Français'}, it:{name:'Italiano'}, ja:{name:'日本語'}, ko:{name:'한국어'},
    pt:{name:'Português'}, ru:{name:'Русский'}, es:{name:'Español'}, am:{name:'አማርኛ'},
    el:{name:'Ελληνικά'}, he:{name:'עברית'}, tr:{name:'Türkçe'}
  };
  const NAV_I18N = {
    de:{groups:'Gruppenreisen',private:'Individualreisen',modules:'Reisebausteine',tips:'Reisetipps',info:'Infos',builder:'Reise planen',login:'Einloggen',home:'Äthiopien'},
    en:{groups:'Group tours',private:'Private tours',modules:'Trip builder',tips:'Travel tips',info:'Info',builder:'Plan a trip',login:'Log in',home:'Ethiopia'},
    ar:{groups:'رحلات جماعية',private:'رحلات خاصة',modules:'صمم رحلتك',tips:'نصائح السفر',info:'معلومات',builder:'خطط الرحلة',login:'تسجيل الدخول',home:'إثيوبيا'},
    zh:{groups:'团体旅行',private:'私人旅行',modules:'行程定制',tips:'旅行贴士',info:'信息',builder:'规划旅行',login:'登录',home:'埃塞俄比亚'},
    fr:{groups:'Voyages en groupe',private:'Voyages privés',modules:'Voyage sur mesure',tips:'Conseils voyage',info:'Infos',builder:'Planifier',login:'Connexion',home:'Éthiopie'},
    it:{groups:'Viaggi di gruppo',private:'Viaggi privati',modules:'Crea il viaggio',tips:'Consigli viaggio',info:'Info',builder:'Pianifica',login:'Accedi',home:'Etiopia'},
    ja:{groups:'グループ旅行',private:'プライベート旅行',modules:'旅行プラン',tips:'旅行のヒント',info:'情報',builder:'旅行を計画',login:'ログイン',home:'エチオピア'},
    ko:{groups:'단체 여행',private:'개인 여행',modules:'여행 맞춤 구성',tips:'여행 팁',info:'정보',builder:'여행 계획',login:'로그인',home:'에티오피아'},
    pt:{groups:'Viagens em grupo',private:'Viagens privadas',modules:'Monte sua viagem',tips:'Dicas de viagem',info:'Informações',builder:'Planejar',login:'Entrar',home:'Etiópia'},
    ru:{groups:'Туры',private:'Частные туры',modules:'Маршруты',tips:'Советы',info:'Инфо',builder:'Спланировать',login:'Войти',home:'Эфиопия'},
    es:{groups:'Viajes en grupo',private:'Viajes privados',modules:'Diseña tu viaje',tips:'Consejos de viaje',info:'Información',builder:'Planificar',login:'Iniciar sesión',home:'Etiopía'},
    am:{groups:'የቡድን ጉዞዎች',private:'የግል ጉዞዎች',modules:'ጉዞዎን ያቅዱ',tips:'የጉዞ ምክሮች',info:'መረጃ',builder:'ጉዞ አቅድ',login:'ግባ',home:'ኢትዮጵያ'},
    el:{groups:'Ταξίδια',private:'Ιδιωτικά',modules:'Σχεδιασμός',tips:'Συμβουλές',info:'Πληροφορίες',builder:'Σχεδιάστε',login:'Σύνδεση',home:'Αιθιοπία'},
    he:{groups:'טיולים קבוצתיים',private:'טיולים פרטיים',modules:'בניית מסלול',tips:'טיפים למטיילים',info:'מידע',builder:'תכנון טיול',login:'התחברות',home:'אתיופיה'},
    tr:{groups:'Grup turları',private:'Özel turlar',modules:'Seyahat planlayıcı',tips:'Seyahat ipuçları',info:'Bilgi',builder:'Seyahat planla',login:'Giriş',home:'Etiyopya'}
  };
  const RTL = new Set(['ar','he']);
  const SOURCE = (CFG.sourceLanguage || 'de').toLowerCase();
  const CACHE_PREFIX = `aj_azure_translate_${CFG.cacheVersion || 'v4-fast'}:`;
  const ORIGINAL_TEXT = new WeakMap();
  const ORIGINAL_ATTR = new WeakMap();
  const LAST_APPLIED_TEXT = new WeakMap();
  const LAST_APPLIED_ATTR = new WeakMap();

  let originalTitle = document.title || '';
  let originalDescription = '';
  let currentLang = SOURCE;
  let generation = 0;
  let observer = null;
  let mutationTimer = 0;
  let applying = false;
  let warnedMissingConfig = false;
  let switchTimer = 0;
  let mainTranslationRunning = false;
  let masterRefs = new Map();
  const activeControllers = new Set();
  const pendingDynamicRoots = new Set();

  function safeGet(key){ try{return localStorage.getItem(key)}catch(_){return null} }
  function safeSet(key,val){ try{localStorage.setItem(key,val)}catch(_){} }
  function normalize(value){ return String(value == null ? '' : value).replace(/\s+/g,' ').trim(); }

  function excluded(el){
    if(!el || el.nodeType !== 1) return false;
    if(el.closest('.notranslate,[translate="no"],[data-no-translate],#langMenu,#langBtn,.langmenu,.langbtn,.langwrap,#currencyMenu,#currencyBtn,.currmenu,.currbtn,.currwrap,[data-i18n]')) return true;
    return !!el.closest('script,style,noscript,template,svg,canvas,code,pre,textarea,[contenteditable="true"]');
  }

  function worthTranslating(text){
    const s = normalize(text);
    if(!s || s.length < 2) return false;
    if(/^([\d\s.,:+\-–—/%€$£¥()]+)$/.test(s)) return false;
    if(/^(https?:\/\/|www\.|mailto:|tel:)/i.test(s)) return false;
    if(/^[A-Z]{2,5}$/.test(s) && ['EUR','USD','FRA','BER','MUC','VIE','ZRH','PDF','FAQ','VISA','VIP'].includes(s)) return false;
    return /[\p{L}]/u.test(s);
  }

  function rememberText(node){ if(!ORIGINAL_TEXT.has(node)) ORIGINAL_TEXT.set(node,node.nodeValue); }

  function rememberAttrs(el){
    let map = ORIGINAL_ATTR.get(el);
    if(!map){ map={}; ORIGINAL_ATTR.set(el,map); }
    for(const attr of ['placeholder','title','aria-label','alt']){
      if(el.hasAttribute(attr) && !(attr in map)) map[attr]=el.getAttribute(attr);
    }
    if(el.matches('input[type="button"],input[type="submit"]') && !('value' in map)) map.value=el.value;
  }

  function addRef(refs, source, ref){
    const key=normalize(source);
    if(!worthTranslating(key)) return;
    if(!refs.has(key)) refs.set(key,[]);
    refs.get(key).push(ref);
  }

  function collect(root=document.body){
    const refs = new Map();
    if(!root) return refs;

    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
      const parent=node.parentElement;
      if(!parent || excluded(parent)) return NodeFilter.FILTER_REJECT;
      return worthTranslating(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }});
    while(walker.nextNode()){
      const node=walker.currentNode;
      rememberText(node);
      addRef(refs, ORIGINAL_TEXT.get(node), {type:'text',node});
    }

    const elements = root.nodeType===1 ? [root,...root.querySelectorAll('*')] : [];
    for(const el of elements){
      if(!el || excluded(el)) continue;
      if(el.hasAttribute?.('placeholder') || el.hasAttribute?.('title') || el.hasAttribute?.('aria-label') || el.hasAttribute?.('alt') || el.matches?.('input[type="button"],input[type="submit"]')){
        rememberAttrs(el);
        const map=ORIGINAL_ATTR.get(el);
        for(const [attr,source] of Object.entries(map||{})) addRef(refs,source,{type:'attr',el,attr});
      }
    }
    return refs;
  }

  function mergeRefs(into, from){
    for(const [source,targets] of from){
      if(!into.has(source)) into.set(source,[]);
      into.get(source).push(...targets);
    }
    return into;
  }

  function getMetaOriginals(){
    const meta=document.querySelector('meta[name="description"]');
    if(meta && !originalDescription) originalDescription=meta.getAttribute('content')||'';
    return meta;
  }

  function cacheKey(lang,source){ return `${CACHE_PREFIX}${lang}:${source}`; }
  function cacheGet(lang,source){
    try{return sessionStorage.getItem(cacheKey(lang,source)) || localStorage.getItem(cacheKey(lang,source));}catch(_){return null}
  }
  function cacheSet(lang,source,value){
    try{sessionStorage.setItem(cacheKey(lang,source),value);}catch(_){}
    try{localStorage.setItem(cacheKey(lang,source),value);}catch(_){}
  }

  const AZURE_LANG_CODES = {
    zh: 'zh-Hans'
  };

  function azureLanguageCode(lang){
    return AZURE_LANG_CODES[lang] || lang;
  }

  function canUseCloud(){
    const key=String(CFG.apiKey||'').trim();
    return !!key && !/^PASTE_YOUR_/i.test(key);
  }

  function configuredRegion(){
    const region=String(CFG.region||'').trim();
    if(!region || /^PASTE_YOUR_/i.test(region) || /^global$/i.test(region)) return '';
    return region;
  }

  function hideTranslationStatus(){
    const box=document.getElementById('ajTranslateStatus');
    if(box) box.remove();
  }

  /* Translation is intentionally silent: no loading note/toast is shown to visitors. */
  function showStatus(){ hideTranslationStatus(); }

  async function translateBatch(strings,target,run){
    if(!strings.length) return [];
    if(run!==generation) return [];

    const controller=new AbortController();
    activeControllers.add(controller);
    let timedOut=false;
    const timeout=setTimeout(()=>{timedOut=true;controller.abort();},Math.max(2500,Number(CFG.requestTimeoutMs)||6500));

    let response;
    const payload=strings.map(text=>({Text:text}));
    try{
      if(canUseCloud()){
        const endpoint=String(CFG.endpoint||'https://api.cognitive.microsofttranslator.com').trim().replace(/\/+$/,'');
        const params=new URLSearchParams({
          'api-version':'3.0',
          to:azureLanguageCode(target)
        });
        if(!CFG.autoDetectSource) params.set('from',azureLanguageCode(SOURCE));
        const headers={
          'Content-Type':'application/json; charset=UTF-8',
          'Accept':'application/json',
          'Ocp-Apim-Subscription-Key':String(CFG.apiKey).trim()
        };
        const region=configuredRegion();
        if(region) headers['Ocp-Apim-Subscription-Region']=region;

        response=await fetch(`${endpoint}/translate?${params.toString()}`,{
          method:'POST',
          headers,
          body:JSON.stringify(payload),
          mode:'cors',
          signal:controller.signal
        });
      }else{
        const err=new Error('AJ_AZURE_TRANSLATOR_KEY_NOT_CONFIGURED');
        err.code='AJ_AZURE_TRANSLATOR_KEY_NOT_CONFIGURED';
        throw err;
      }

      if(!response.ok){
        let detail=''; try{detail=await response.text()}catch(_){}
        const err=new Error(`Azure Translator request failed (${response.status}) ${detail}`.slice(0,900));
        err.status=response.status;
        const retryAfter=response.headers.get('Retry-After');
        err.retryAfterMs=retryAfter && /^\d+(?:\.\d+)?$/.test(retryAfter) ? Math.ceil(Number(retryAfter)*1000) : 0;
        throw err;
      }
      const data=await response.json();
      if(!Array.isArray(data)) throw new Error('Azure Translator returned an unexpected response.');
      return data.map(item=>String(item?.translations?.[0]?.text ?? ''));
    } catch(err) {
      if(timedOut){
        const timeoutError=new Error('Azure Translator request timed out.');
        timeoutError.status=408;
        throw timeoutError;
      }
      throw err;
    } finally {
      clearTimeout(timeout);
      activeControllers.delete(controller);
    }
  }

  function wait(ms){ return new Promise(resolve=>setTimeout(resolve,ms)); }

  async function translateBatchResilient(strings,target,run,depth=0){
    if(!strings.length) return [];
    const maxRetries=Math.max(0,Math.min(4,Number(CFG.maxRetries)||2));
    let lastError=null;
    for(let attempt=0;attempt<=maxRetries;attempt++){
      if(run!==generation || currentLang!==target){
        const stale=new DOMException('Translation superseded','AbortError');
        throw stale;
      }
      try{
        return await translateBatch(strings,target,run);
      }catch(err){
        if(err?.name==='AbortError') throw err;
        lastError=err;
        const status=Number(err?.status)||0;
        const retryable=!status || status===408 || status===409 || status===429 || status>=500;
        if(!retryable || attempt>=maxRetries) break;
        const backoff=Math.min(3500, Number(err?.retryAfterMs)||350*Math.pow(2,attempt));
        await wait(backoff);
      }
    }

    /* A single bad/oversized item must never stop the rest of the page. Split the batch and continue. */
    if(strings.length>1 && depth<7){
      const mid=Math.ceil(strings.length/2);
      const left=await translateBatchResilient(strings.slice(0,mid),target,run,depth+1).catch(err=>{
        if(err?.name==='AbortError') throw err;
        return Array(mid).fill('');
      });
      const right=await translateBatchResilient(strings.slice(mid),target,run,depth+1).catch(err=>{
        if(err?.name==='AbortError') throw err;
        return Array(strings.length-mid).fill('');
      });
      return [...left,...right];
    }

    console.warn('[Abyssinia Journeys] Skipped one translation item after retries:', lastError?.message||lastError);
    return [''];
  }


  function applyTranslation(refs,translated){
    applying=true;
    try{
      for(const ref of refs){
        if(ref.type==='text' && ref.node?.isConnected){
          const original=ORIGINAL_TEXT.get(ref.node)||'';
          const lead=(original.match(/^\s*/)||[''])[0];
          const trail=(original.match(/\s*$/)||[''])[0];
          const value=lead+translated+trail;
          ref.node.nodeValue=value;
          LAST_APPLIED_TEXT.set(ref.node,value);
        }else if(ref.type==='attr' && ref.el?.isConnected){
          ref.el.setAttribute(ref.attr,translated);
          let map=LAST_APPLIED_ATTR.get(ref.el); if(!map){map={};LAST_APPLIED_ATTR.set(ref.el,map)}
          map[ref.attr]=translated;
        }
      }
    }finally{
      applying=false;
      observer?.takeRecords();
    }
  }

  function applySpecialOrRefs(targets,value){
    const normal=[];
    applying=true;
    try{
      for(const ref of targets){
        if(ref.type==='title') document.title=value;
        else if(ref.type==='meta' && ref.el?.isConnected) ref.el.setAttribute('content',value);
        else normal.push(ref);
      }
    }finally{applying=false;observer?.takeRecords();}
    if(normal.length) applyTranslation(normal,value);
  }

  function restoreSource(){
    for(const controller of activeControllers) controller.abort();
    activeControllers.clear();
    applying=true;
    try{
      document.querySelectorAll('body *').forEach(el=>{
        if(excluded(el)) return;
        const map=ORIGINAL_ATTR.get(el);
        if(map) for(const [attr,val] of Object.entries(map)) el.setAttribute(attr,val);
      });
      const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
      while(walker.nextNode()){
        const node=walker.currentNode;
        if(ORIGINAL_TEXT.has(node)) node.nodeValue=ORIGINAL_TEXT.get(node);
      }
      document.title=originalTitle;
      const meta=getMetaOriginals(); if(meta) meta.setAttribute('content',originalDescription);
    }finally{
      applying=false;
      observer?.takeRecords();
    }
  }

  function normalizeLanguageMenuLabels(){
    const menu=document.getElementById('langMenu');
    if(!menu) return;
    menu.classList.add('notranslate');
    menu.setAttribute('translate','no');
    for(const [code,item] of Object.entries(LANGS)){
      const btn=menu.querySelector(`[data-lang="${CSS.escape(code)}"]`);
      if(!btn) continue;
      btn.classList.add('notranslate');
      btn.setAttribute('translate','no');
      btn.setAttribute('aria-label',item.name);
      let label=btn.querySelector(':scope > .aj-lang-label, :scope > .aj-lang-short, :scope > span');
      if(!label){ label=document.createElement('span'); btn.appendChild(label); }
      label.classList.remove('aj-lang-short');
      label.classList.add('aj-lang-label');
      label.textContent=item.name;
    }
  }

  function applyCompactNav(lang){
    const dict=NAV_I18N[lang]||NAV_I18N.de;
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key=el.dataset.i18n;
      if(dict[key]) el.textContent=dict[key];
      el.classList.add('notranslate');
      el.setAttribute('translate','no');
    });
  }

  function ensureStableLanguageUIStyles(){
    if(document.getElementById('aj-stable-language-layout-v1')) return;
    const style=document.createElement('style');
    style.id='aj-stable-language-layout-v1';
    style.textContent=`
/* Keep header/language controls geometrically identical in every language. */
html{direction:ltr!important}
.site-nav,.site-nav .nav-inner,.site-nav .nav-actions,.site-nav .navlinks,.langwrap,#langMenu.langmenu{direction:ltr!important}
#langMenu.langmenu{
  width:min(420px,calc(100vw - 24px))!important;
  max-width:calc(100vw - 24px)!important;
  grid-template-columns:repeat(3,minmax(0,1fr))!important;
  gap:7px!important;
  box-sizing:border-box!important;
  overflow:hidden!important;
}
#langMenu.langmenu button{
  min-width:0!important;max-width:100%!important;width:100%!important;
  box-sizing:border-box!important;overflow:hidden!important;
  display:flex!important;align-items:center!important;justify-content:flex-start!important;
  gap:8px!important;white-space:nowrap!important;
}
#langMenu.langmenu button>img{flex:0 0 auto!important;width:30px!important;height:20px!important;max-width:30px!important;object-fit:cover!important}
#langMenu.langmenu .aj-flag-pair{width:40px!important;min-width:40px!important;flex:0 0 40px!important;height:22px!important}
#langMenu.langmenu button[data-lang="pt"] .aj-flag-pair img{width:24px!important;height:17px!important;max-width:24px!important;top:2px!important}
#langMenu.langmenu button[data-lang="pt"] .aj-flag-pair img:first-child{left:0!important}
#langMenu.langmenu button[data-lang="pt"] .aj-flag-pair img+img{left:15px!important}
#langMenu.langmenu button>span:not(.aj-flag-pair),
#langMenu.langmenu .aj-lang-short,
#langMenu.langmenu .aj-lang-label{
  min-width:0!important;max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important;
  white-space:nowrap!important;unicode-bidi:plaintext!important;text-align:start!important;
}
#langBtn.langbtn,.site-nav .nav-actions .langbtn{flex:0 0 auto!important;box-sizing:border-box!important}
body.aj-translation-rtl main :where(h1,h2,h3,h4,h5,h6,p,li,blockquote,label,legend,figcaption,td,th),
body.aj-translation-rtl .page-main :where(h1,h2,h3,h4,h5,h6,p,li,blockquote,label,legend,figcaption,td,th),
body.aj-translation-rtl form :where(label,legend){direction:rtl!important;text-align:right!important}
body.aj-translation-rtl input:not([type="email"]):not([type="tel"]),
body.aj-translation-rtl textarea{direction:rtl!important;text-align:right!important}
/* Never let translated top navigation change the header footprint. */
.site-nav .nav-inner{max-width:100%!important;box-sizing:border-box!important}
.site-nav .navlinks{min-width:0!important}
.site-nav .navlinks>[data-i18n],.site-nav .nav-actions>[data-i18n],.site-nav [data-i18n]{white-space:nowrap!important}
@media (max-width:768px){
  #langMenu.langmenu{width:min(410px,calc(100vw - 18px))!important;max-width:calc(100vw - 18px)!important;grid-template-columns:repeat(3,minmax(0,1fr))!important}
  #langMenu.langmenu button{gap:6px!important;padding-left:8px!important;padding-right:8px!important}
}
@media (max-width:430px){
  #langMenu.langmenu{width:calc(100vw - 16px)!important;max-width:calc(100vw - 16px)!important}
  #langMenu.langmenu button{font-size:clamp(.78rem,3.6vw,.94rem)!important}
}
`;
    document.head.appendChild(style);
  }

  function syncUI(lang){
    currentLang=LANGS[lang]?lang:SOURCE;
    safeSet('aj_lang',currentLang);
    document.documentElement.lang=currentLang;
    /* Keep the site shell/header LTR so changing language never moves controls outside the viewport. */
    document.documentElement.dir='ltr';
    document.body?.classList.remove('rtl');
    document.body?.classList.toggle('aj-translation-rtl',RTL.has(currentLang));
    document.body?.classList.toggle('aj-translated-language',currentLang!==SOURCE);
    applyCompactNav(currentLang);
    normalizeLanguageMenuLabels();

    const menu=document.getElementById('langMenu');
    const button=document.getElementById('langBtn');
    const wrap=button?.closest('.langwrap');
    wrap?.classList.add('notranslate'); wrap?.setAttribute('translate','no');
    button?.classList.add('notranslate'); button?.setAttribute('translate','no');
    menu?.classList.add('notranslate');
    menu?.setAttribute('translate','no');
    document.querySelectorAll('#langMenu [data-lang]').forEach(el=>el.classList.toggle('is-active',el.dataset.lang===currentLang));

    if(button){
      const active=menu?.querySelector(`[data-lang="${CSS.escape(currentLang)}"]`);
      const visual=active?.querySelector('.aj-flag-pair,.aj-flag-svg,img')?.cloneNode(true);
      button.replaceChildren();
      if(visual) button.appendChild(visual);
      const label=document.createElement('span'); label.className='lang-name'; label.textContent=LANGS[currentLang]?.name||currentLang.toUpperCase();
      button.appendChild(label);
      button.setAttribute('aria-label',LANGS[currentLang]?.name||currentLang.toUpperCase());
    }
  }

  function applyCachedOnly(refs,lang){
    if(lang===SOURCE) return;
    for(const [source,targets] of refs){
      const cached=cacheGet(lang,source);
      if(cached!=null && cached!=='') applySpecialOrRefs(targets,cached);
    }
  }


  function refPriority(targets){
    let best=2;
    for(const ref of targets){
      const el=ref.type==='text'?ref.node?.parentElement:ref.el;
      if(!el?.getBoundingClientRect) continue;
      const r=el.getBoundingClientRect();
      if(r.bottom>=-100 && r.top<=innerHeight+180) return 0;
      if(r.top>innerHeight+180 && r.top<innerHeight*3.2) best=Math.min(best,1);
    }
    return best;
  }

  function makeBatches(items){
    const maxItems=Math.max(5,Math.min(100,Number(CFG.maxBatchItems)||35));
    const maxChars=Math.max(1500,Math.min(25000,Number(CFG.maxBatchChars)||9000));
    const batches=[];
    let batch=[]; let chars=0;
    for(const item of items){
      const n=item.length;
      if(batch.length && (batch.length>=maxItems || chars+n>maxChars)){
        batches.push(batch); batch=[]; chars=0;
      }
      batch.push(item); chars+=n;
    }
    if(batch.length) batches.push(batch);
    return batches;
  }

  async function translateRefs(refs,lang,run){
    if(run!==generation || lang===SOURCE) return;

    const missing=[];
    for(const [source,targets] of refs){
      const cached=cacheGet(lang,source);
      if(cached!=null) applySpecialOrRefs(targets,cached);
      else missing.push({source,priority:refPriority(targets)});
    }
    missing.sort((a,b)=>a.priority-b.priority);
    const batches=makeBatches(missing.map(x=>x.source));

    let nextBatch=0;
    const workerCount=Math.max(1,Math.min(3,Number(CFG.maxConcurrentRequests)||2));
    async function worker(){
      while(nextBatch<batches.length){
        if(run!==generation || currentLang!==lang) return;
        const batch=batches[nextBatch++];
        let translated;
        try{
          translated=await translateBatchResilient(batch,lang,run);
        }catch(err){
          if(err?.name==='AbortError') return;
          console.warn('[Abyssinia Journeys] Translation batch failed and was skipped:',err);
          continue;
        }
        if(run!==generation || currentLang!==lang) return;
        batch.forEach((source,index)=>{
          const value=translated[index];
          if(value==null || value==='') return;
          cacheSet(lang,source,value);
          applySpecialOrRefs(refs.get(source)||[],value);
        });
        /* Yield to rendering so the page stays responsive between batches. */
        await new Promise(resolve=>setTimeout(resolve,0));
      }
    }
    await Promise.all(Array.from({length:Math.min(workerCount,batches.length)},()=>worker()));
  }

  async function translateDocument(lang){
    const run=generation;
    const refs=new Map();
    mergeRefs(refs,masterRefs);
    const meta=getMetaOriginals();
    const titleKey=normalize(originalTitle);
    const descKey=normalize(originalDescription);
    if(titleKey && worthTranslating(titleKey)) addRef(refs,titleKey,{type:'title'});
    if(meta && descKey && worthTranslating(descKey)) addRef(refs,descKey,{type:'meta',el:meta});
    await translateRefs(refs,lang,run);
  }

  async function translateDynamicRoots(lang,roots){
    const run=generation;
    const refs=new Map();
    for(const root of roots){
      if(root?.isConnected && !excluded(root)){
        const found=collect(root);
        mergeRefs(masterRefs,found);
        mergeRefs(refs,found);
      }
    }
    if(refs.size) await translateRefs(refs,lang,run);
  }

  async function setLanguage(lang){
    lang=(lang||SOURCE).toLowerCase();
    if(!LANGS[lang]) lang=SOURCE;

    generation++;
    const run=generation;
    clearTimeout(switchTimer);
    for(const controller of activeControllers) controller.abort();
    activeControllers.clear();
    mainTranslationRunning=false;
    hideTranslationStatus();

    /* Always return to the German source first. This prevents mixed languages when users switch rapidly. */
    restoreSource();
    syncUI(lang);
    document.getElementById('langMenu')?.classList.remove('open');
    document.getElementById('langBtn')?.setAttribute('aria-expanded','false');

    if(lang===SOURCE){
      pendingDynamicRoots.clear();
      window.dispatchEvent(new CustomEvent('aj:languagechange',{detail:{language:lang,provider:'azure-translator'}}));
      return;
    }

    if(!canUseCloud()){
      if(!warnedMissingConfig){
        warnedMissingConfig=true;
        console.warn('Microsoft Azure Translator key is not configured. Put it in aj-azure-translator-config.js.');
      }
      restoreSource();
      syncUI(SOURCE);
      return;
    }

    /* Cached target text is applied instantly. Network work is slightly coalesced so repeated clicks only translate the last language. */
    applyCachedOnly(masterRefs,lang);
    switchTimer=setTimeout(async()=>{
      if(run!==generation || currentLang!==lang) return;
      mainTranslationRunning=true;
      try{
        await translateDocument(lang);
        if(run===generation && currentLang===lang){
          window.dispatchEvent(new CustomEvent('aj:languagechange',{detail:{language:lang,provider:'azure-translator'}}));
        }
      }catch(err){
        if(err?.name!=='AbortError') console.error('[Abyssinia Journeys] Azure translation failed:',err);
      }finally{
        if(run===generation) mainTranslationRunning=false;
        if(run===generation && currentLang===lang && pendingDynamicRoots.size){
          const roots=[...pendingDynamicRoots]; pendingDynamicRoots.clear();
          translateDynamicRoots(lang,roots).catch(err=>{
            if(err?.name!=='AbortError') console.error('[Abyssinia Journeys] Dynamic translation failed:',err);
          });
        }
      }
    },Math.max(60,Number(CFG.switchDebounceMs)||160));
  }

  function scheduleDynamicTranslation(root){
    if(root?.nodeType===1) pendingDynamicRoots.add(root);
    clearTimeout(mutationTimer);
    mutationTimer=setTimeout(()=>{
      if(currentLang===SOURCE || !canUseCloud()){ pendingDynamicRoots.clear(); return; }
      if(mainTranslationRunning) return; /* main job will drain pending roots when it finishes */
      const roots=[...pendingDynamicRoots]; pendingDynamicRoots.clear();
      if(!roots.length) return;
      translateDynamicRoots(currentLang,roots).catch(err=>{
        if(err?.name!=='AbortError') console.error('[Abyssinia Journeys] Dynamic translation failed:',err);
      });
    },Math.max(150,Number(CFG.dynamicDebounceMs)||450));
  }

  function watchDynamicContent(){
    observer=new MutationObserver(records=>{
      if(applying) return;
      for(const record of records){
        if(record.type==='characterData'){
          const node=record.target;
          if(excluded(node.parentElement)) continue;
          const last=LAST_APPLIED_TEXT.get(node);
          if(last!==node.nodeValue){
            ORIGINAL_TEXT.set(node,node.nodeValue);
            scheduleDynamicTranslation(node.parentElement);
          }
        }else if(record.type==='childList' && record.addedNodes.length){
          for(const node of record.addedNodes){
            if(node.nodeType===3 && worthTranslating(node.nodeValue)){
              ORIGINAL_TEXT.set(node,node.nodeValue);
              scheduleDynamicTranslation(node.parentElement);
            }else if(node.nodeType===1 && !excluded(node)){
              collect(node); /* remember originals only for this new subtree */
              scheduleDynamicTranslation(node);
            }
          }
        }else if(record.type==='attributes'){
          const el=record.target;
          if(excluded(el)) continue;
          const attr=record.attributeName;
          if(['placeholder','title','aria-label','alt','value'].includes(attr)){
            const last=LAST_APPLIED_ATTR.get(el)?.[attr];
            const now=el.getAttribute(attr);
            if(last!==now){
              let map=ORIGINAL_ATTR.get(el); if(!map){map={};ORIGINAL_ATTR.set(el,map)}
              map[attr]=now;
              scheduleDynamicTranslation(el);
            }
          }
        }
      }
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','title','aria-label','alt','value']});
  }

  function boot(){
    ensureStableLanguageUIStyles();
    /* Legacy inline language code can run before this file. Reset only the compact nav to German
       before originals are captured; the Azure engine remains authoritative for page content. */
    document.documentElement.dir='ltr';
    document.body?.classList.remove('rtl');
    applyCompactNav(SOURCE);
    normalizeLanguageMenuLabels();
    originalTitle=document.title||'';
    getMetaOriginals();
    hideTranslationStatus();
    masterRefs=collect(document.body);
    document.getElementById('langMenu')?.classList.add('notranslate');
    document.getElementById('langMenu')?.setAttribute('translate','no');

    document.addEventListener('click',event=>{
      const item=event.target.closest?.('#langMenu [data-lang]');
      if(!item) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      setLanguage(item.dataset.lang);
    },true);

    watchDynamicContent();
    window.AJSetLanguage=setLanguage;
    window.applyLang=setLanguage;
    window.applyLanguage=setLanguage;

    let requested=SOURCE;
    try{
      const q=(new URLSearchParams(location.search).get('lang')||'').toLowerCase();
      const preserved=(window.__AJ_REQUESTED_LANG||'').toLowerCase();
      requested=LANGS[q]?q:(LANGS[preserved]?preserved:((safeGet('aj_lang')||SOURCE).toLowerCase()));
    }catch(_){ requested=(safeGet('aj_lang')||SOURCE).toLowerCase(); }
    if(!LANGS[requested]) requested=SOURCE;
    setLanguage(requested);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0),{once:true});
  else setTimeout(boot,0);
})();
