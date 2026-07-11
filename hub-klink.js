/* Propagates the ?k gate code from the current URL onto internal same-hub links,
   so the nginx gate keeps working when navigating within a partner hub — WITHOUT
   an inline <script> (the hubs run under CSP `script-src 'self'`, active since
   2026-07-04; inline is blocked unless hash-whitelisted, cf. /hub-photos.js).
   The hub slug is inferred from the first path segment, e.g. /tbo/... -> "/tbo",
   so this file is shared and needs no per-hub configuration. */
(function () {
  var k = new URLSearchParams(location.search).get('k');
  if (!k) return;
  var slug = '/' + (location.pathname.split('/')[1] || '');
  if (slug === '/') return;
  document.querySelectorAll('a[href^="' + slug + '"]').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href.indexOf('k=') >= 0) return;
    a.setAttribute('href', href + (href.indexOf('?') >= 0 ? '&' : '?') + 'k=' + encodeURIComponent(k));
  });
})();
