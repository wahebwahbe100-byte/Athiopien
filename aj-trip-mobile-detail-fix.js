(function(){
  'use strict';

  function addWordStrip(){
    var category=document.getElementById('dcat');
    if(!category || document.querySelector('.trip-word-strip')) return;
    var strip=document.createElement('nav');
    strip.className='trip-word-strip';
    strip.setAttribute('aria-label','Reiseabschnitte');
    strip.innerHTML=
      '<a href="#termine">Termine &amp; Preise</a><span class="trip-word-dot">·</span>'+
      '<a href="#ueberblick">Reiseprofil</a><span class="trip-word-dot">·</span>'+
      '<a href="#verlauf">Reiseverlauf</a><span class="trip-word-dot">·</span>'+
      '<a href="#leistungen">Leistungen</a><span class="trip-word-dot">·</span>'+
      '<a href="#faq">FAQ</a>';
    category.parentNode.insertBefore(strip,category);
  }

  function removeLegacyDateHeader(){
    document.querySelectorAll('.date-table-head').forEach(function(head){head.remove();});
  }



  function installReliableMobileDateFilters(){
    function apply(toolbar){
      if(!toolbar) return;
      var wrap=document.getElementById('dates');
      if(!wrap) return;
      var checked=Array.prototype.slice.call(toolbar.querySelectorAll('.aj-year-checks input:checked')).map(function(x){return x.value;});
      var available=toolbar.querySelector('#ajAvailableOnly');
      var availableOnly=!!(available&&available.checked);
      var visible=0;
      wrap.querySelectorAll('.date-row[data-year]').forEach(function(row){
        var show=checked.indexOf(row.getAttribute('data-year'))!==-1 && (!availableOnly || row.getAttribute('data-status')!=='red');
        row.hidden=!show;
        row.classList.toggle('is-filtered-out',!show);
        row.setAttribute('aria-hidden',String(!show));
        if(show){
          row.style.removeProperty('display');
          visible++;
        }else{
          row.style.setProperty('display','none','important');
        }
      });
      var empty=document.querySelector('.aj-no-dates');
      if(empty) empty.classList.toggle('is-visible',visible===0);
    }

    function bind(toolbar){
      if(!toolbar || toolbar.dataset.ajMobileFilterBound==='1') return;
      toolbar.dataset.ajMobileFilterBound='1';
      var run=function(){
        if(window.requestAnimationFrame) window.requestAnimationFrame(function(){apply(toolbar);});
        else window.setTimeout(function(){apply(toolbar);},0);
      };
      toolbar.addEventListener('change',run);
      toolbar.addEventListener('input',run);
      toolbar.addEventListener('click',function(e){
        if(e.target.closest('.aj-year-checks label,.aj-year-checks input,.aj-available-only')) run();
      });
      toolbar.addEventListener('touchend',function(e){
        if(e.target.closest('.aj-year-checks label,.aj-year-checks input,.aj-available-only')) run();
      },{passive:true});
      apply(toolbar);
    }

    function scan(){document.querySelectorAll('.aj-date-toolbar').forEach(bind);}
    scan();
    var observer=new MutationObserver(function(){scan();});
    observer.observe(document.documentElement,{childList:true,subtree:true});
    window.setTimeout(function(){scan();observer.disconnect();},3000);
  }

  function enhance(){
    addWordStrip();
    removeLegacyDateHeader();
    installReliableMobileDateFilters();
    var dates=document.getElementById('dates');
    if(dates){
      var observer=new MutationObserver(removeLegacyDateHeader);
      observer.observe(dates,{childList:true});
      setTimeout(function(){removeLegacyDateHeader();observer.disconnect();},1200);
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',enhance,{once:true});
  else enhance();
})();
