// Mobile menu toggle
(function(){
  var btn=document.querySelector('.menu-btn'), menu=document.getElementById('mobile-menu');
  if(!btn||!menu) return;
  btn.addEventListener('click',function(){
    var open=menu.classList.toggle('open');
    btn.setAttribute('aria-expanded',open?'true':'false');
  });
  menu.addEventListener('click',function(e){ if(e.target.tagName==='A'){ menu.classList.remove('open'); btn.setAttribute('aria-expanded','false'); } });
})();
