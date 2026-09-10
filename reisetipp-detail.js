(function(){
  const b=document.querySelector('.menuBtn'),n=document.querySelector('.navlinks');
  if(b&&n)b.addEventListener('click',()=>{const o=n.classList.toggle('open');b.setAttribute('aria-expanded',String(o));b.textContent=o?'×':'☰'});
})();
