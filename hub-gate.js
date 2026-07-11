/* Access-gate form handler for partner hubs — external (not inline) so it passes
   the hubs' CSP `script-src 'self'` (active 2026-07-04), cf. /hub-photos.js and
   /hub-klink.js. The target hub route comes from data-hub on the <script> tag,
   e.g. <script src="/hub-gate.js" data-hub="/tbo"></script>. Expects a form#f,
   an input#p and an optional #err error element on the page. */
(function () {
  var s = document.currentScript;
  var hub = (s && s.getAttribute('data-hub')) || '/';
  try {
    if (sessionStorage.getItem('arv_gate_try') === '1') {
      var e = document.getElementById('err');
      if (e) e.classList.add('show');
      sessionStorage.removeItem('arv_gate_try');
    }
  } catch (e) {}
  var f = document.getElementById('f');
  if (!f) return;
  f.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var v = document.getElementById('p').value.trim();
    if (!v) return;
    try { sessionStorage.setItem('arv_gate_try', '1'); } catch (e) {}
    location.href = hub + '?k=' + encodeURIComponent(v);
  });
})();
