/* Language toggle for the Arvut DE report (DE/RU).
   External file on purpose: arvut.ch enforces a strict CSP
   (script-src 'self') — inline scripts are blocked, a same-origin file is allowed. */
(function () {
  var body = document.body;
  var btns = document.querySelectorAll('.langbar button');
  function set(l) {
    if (l !== 'ru') l = 'de';
    body.classList.remove('lang-de', 'lang-ru');
    body.classList.add('lang-' + l);
    btns.forEach(function (b) { b.classList.toggle('on', b.dataset.lang === l); });
    document.documentElement.setAttribute('lang', l);
    try { history.replaceState(null, '', '#' + l); } catch (e) { location.hash = l; }
    window.scrollTo(0, 0);
  }
  btns.forEach(function (b) {
    b.addEventListener('click', function () { set(b.dataset.lang); });
  });
  var h = (location.hash || '').replace('#', '').toLowerCase();
  set(h === 'ru' ? 'ru' : 'de');
})();
