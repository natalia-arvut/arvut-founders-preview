/* Language toggle for DAP Axiomatics (EN/RU).
   External file on purpose: arvut.ch enforces a strict CSP
   (script-src 'self' + one hash) — inline scripts are blocked,
   but a same-origin file is allowed by 'self'. */
(function () {
  var body = document.body;
  var btns = document.querySelectorAll('.langbar button');
  function set(l) {
    if (l !== 'ru') l = 'en';
    body.classList.remove('lang-en', 'lang-ru');
    body.classList.add('lang-' + l);
    btns.forEach(function (b) { b.classList.toggle('on', b.dataset.lang === l); });
    try { history.replaceState(null, '', '#' + l); } catch (e) { location.hash = l; }
    window.scrollTo(0, 0);
  }
  btns.forEach(function (b) {
    b.addEventListener('click', function () { set(b.dataset.lang); });
  });
  var h = (location.hash || '').replace('#', '').toLowerCase();
  set(h === 'ru' ? 'ru' : 'en');
})();
