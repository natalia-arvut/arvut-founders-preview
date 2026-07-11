/* Shared photo-injection for partner hub access pages (aar/cs/express/figemax/ibex/mdv/merlas/pm/selinus).
   External (not inline) so it passes the arvut.ch CSP `script-src 'self'` without a per-page sha256 hash
   — inline <script> is blocked under CSP enforce (active since 2026-07-04). Config comes from the tag:
     data-base : URL prefix for the photos, e.g. "/cs/photos/"  (falls back to "/<first-path-segment>/photos/")
     data-ext  : extension to append, e.g. ".png" / ".jpg" / "" (empty when the extension is already in data-ph, cf. ibex)
   Photos are loaded with the ?k from the URL — no request outside the gate, no leak. */
(function () {
  var s = document.currentScript;
  var base = (s && s.getAttribute('data-base')) || ('/' + (location.pathname.split('/')[1] || '') + '/photos/');
  var ext = s && s.getAttribute('data-ext') !== null ? s.getAttribute('data-ext') : '.png';
  var k = new URLSearchParams(location.search).get('k');
  document.querySelectorAll('img[data-ph]').forEach(function (i) {
    i.src = base + i.getAttribute('data-ph') + ext + (k ? ('?k=' + encodeURIComponent(k)) : '');
  });
})();
