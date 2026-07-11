/* Best-kit interactions: main EN/RU language switch + per-card DE|IT|FR message tabs.
   External file on purpose: arvut.ch enforces a strict CSP (script-src 'self' + one
   hash) — inline scripts are blocked, so this must be a same-origin file to run. */
(function(){
  var kl = document.querySelectorAll('.langbar button[data-kl]');
  kl.forEach(function(b){
    b.addEventListener('click', function(){
      document.body.className = 'lang-' + b.getAttribute('data-kl');
      kl.forEach(function(x){ x.classList.toggle('on', x === b); });
    });
  });
  /* deep-link: #ru / #en preselects the kit language (cards on /presentations) */
  var h = (location.hash || '').replace('#','');
  if (h === 'ru' || h === 'en') {
    document.body.className = 'lang-' + h;
    kl.forEach(function(x){ x.classList.toggle('on', x.getAttribute('data-kl') === h); });
  }
  document.querySelectorAll('.msgset').forEach(function(set){
    var tabs = set.querySelectorAll('.mtabs button');
    tabs.forEach(function(b){
      b.addEventListener('click', function(){
        var l = b.getAttribute('data-ml');
        tabs.forEach(function(x){ x.classList.toggle('on', x === b); });
        set.querySelectorAll('.msg.M').forEach(function(m){
          if (m.classList.contains(l)) m.removeAttribute('hidden');
          else m.setAttribute('hidden','');
        });
      });
    });
  });
})();
