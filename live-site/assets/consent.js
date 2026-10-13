/*
  Banksman cookie consent.
  The site sets NO non-essential cookies today, so no banner shows.
  When you add Google Analytics or the Meta (Facebook) pixel, paste the IDs below.
  The banner then appears, and the tools only load AFTER a visitor clicks "Accept".
  "Reject" is as easy as "Accept" (UK PECR / ICO guidance). Visitors can change their
  mind any time via "Cookie settings" in the footer.
*/
var BANKSMAN_TRACKING = {
  ga4: '',        // e.g. 'G-XXXXXXXXXX'
  metaPixel: ''   // e.g. '1234567890'
};

(function(){
  var KEY='banksman-consent-v1', T=BANKSMAN_TRACKING;
  var anyTools = !!(T.ga4 || T.metaPixel);
  function get(){ try{return localStorage.getItem(KEY);}catch(e){return null;} }
  function set(v){ try{localStorage.setItem(KEY,v);}catch(e){} }

  function loadTools(){
    if(T.ga4){
      var s=document.createElement('script'); s.async=true; s.src='https://www.googletagmanager.com/gtag/js?id='+T.ga4; document.head.appendChild(s);
      window.dataLayer=window.dataLayer||[]; window.gtag=function(){dataLayer.push(arguments);};
      gtag('js',new Date()); gtag('config',T.ga4,{anonymize_ip:true});
    }
    if(T.metaPixel){
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init',T.metaPixel); fbq('track','PageView');
    }
  }

  function banner(){
    if(document.getElementById('cookie-bar')) return;
    var d=document.createElement('div'); d.className='cookie-bar'; d.id='cookie-bar'; d.setAttribute('role','dialog'); d.setAttribute('aria-label','Cookie choices');
    d.innerHTML='<p>We\'d like to use cookies to see how people find and use this site, and to measure our adverts. Nothing loads unless you say yes. <a href="/privacy/#cookies">More about cookies</a></p>'+
      '<div class="row"><button class="btn btn-ghost" type="button" data-c="reject">Reject</button><button class="btn btn-primary" type="button" data-c="accept">Accept</button></div>';
    d.addEventListener('click',function(e){
      var c=e.target.getAttribute('data-c'); if(!c) return;
      set(c); d.remove(); if(c==='accept') loadTools(); else if(window._consentReload) location.reload();
    });
    document.body.appendChild(d);
  }

  window.openCookieSettings=function(){ if(!anyTools){ alertNone(); return; } window._consentReload = get()==='accept'; banner(); };
  function alertNone(){
    var el=document.getElementById('cookie-none'); if(el){ el.hidden=false; el.scrollIntoView({behavior:'smooth',block:'center'}); return; }
    location.href='/privacy/#cookies';
  }

  if(!anyTools) return;
  var c=get();
  if(c==='accept') loadTools();
  else if(c!=='reject') document.addEventListener('DOMContentLoaded',banner);
})();
