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


  function enhance(){
    addWordStrip();
    removeLegacyDateHeader();
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
