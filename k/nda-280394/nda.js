/* NDA auto-paginator + Print button. External file on purpose: arvut.ch enforces a
   strict CSP (script-src 'self') — inline scripts are blocked. Referenced via the
   UNGATED absolute path /k/<slug>/nda.js so it also runs on the 0010-gated /documents
   mirror (a relative nda.js there is caught by the gate → HTML, not JS).

   Pagination: content lives in #doc as a flat sequence of blocks. This flows the
   blocks into fixed A4 .page sheets, starting a new sheet whenever the next block
   would overflow. Break granularity is the block: paragraphs and individual <li>
   items (a long <ol> is split at item boundaries, numbering continued via `start`).
   Headings/intro lines carry data-keep-next so they never sit alone at a page foot.
   Because the generated .page divs use break-after:page, print matches the screen. */
(function () {
  function el(t, c) { var e = document.createElement(t); if (c) e.className = c; return e; }
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function wirePrint() {
    var b = document.getElementById('printBtn');
    if (!b) return;
    b.addEventListener('click', function () {
      // Safari prints a blank page when window.print() runs synchronously inside the
      // click handler — defer it (and blur the button) so layout settles first.
      b.blur();
      setTimeout(function () { window.print(); }, 200);
    });
  }

  function run() {
    var doc = document.getElementById('doc');
    var out = document.getElementById('pages');
    if (!doc || !out) { wirePrint(); return; }

    var hl = doc.getAttribute('data-hdr-left') || '';
    var hr = doc.getAttribute('data-hdr-right') || '';
    var fl = doc.getAttribute('data-ftr-left') || '';
    var blocks = Array.prototype.slice.call(doc.children);
    doc.parentNode.removeChild(doc);

    var pages = [];
    function newPage() {
      var pg = el('div', 'page');
      var rh = el('div', 'rh');
      rh.innerHTML = '<span class="b"><span class="d"></span>' + esc(hl) + '</span><span>' + esc(hr) + '</span>';
      var pc = el('div', 'pc');
      var rf = el('div', 'rf');
      rf.innerHTML = '<span>' + esc(fl) + '</span><span class="pg"></span>';
      pg.appendChild(rh); pg.appendChild(pc); pg.appendChild(rf);
      out.appendChild(pg);
      pages.push(pg);
      return pc;
    }
    function fits(pc) { return pc.scrollHeight <= pc.clientHeight + 1; }

    var pc = newPage();

    function splitOL(ol) {
      // ol is appended to pc and overflowing — move trailing <li>s to a continuation
      var removed = [];
      while (ol.children.length > 1 && !fits(pc)) {
        removed.unshift(ol.removeChild(ol.lastElementChild));
      }
      if (!fits(pc)) { // not even one item fits here
        removed.forEach(function (li) { ol.appendChild(li); });
        return false;
      }
      if (removed.length) {
        var cont = ol.cloneNode(false);
        var start = (parseInt(ol.getAttribute('start'), 10) || 1) + ol.children.length;
        cont.setAttribute('start', String(start));
        removed.forEach(function (li) { cont.appendChild(li); });
        pc = newPage();
        place(cont);
      }
      return true;
    }

    function place(node) {
      pc.appendChild(node);
      if (fits(pc)) return;
      if (node.tagName === 'OL' && node.children.length > 1 && splitOL(node)) return;
      // move node (and any trailing keep-next blocks, e.g. a heading) to a fresh page
      pc.removeChild(node);
      var moved = [];
      while (pc.lastChild && pc.lastChild.nodeType === 1 && pc.lastChild.hasAttribute('data-keep-next')) {
        moved.unshift(pc.removeChild(pc.lastChild));
      }
      pc = newPage();
      moved.forEach(function (m) { pc.appendChild(m); });
      pc.appendChild(node);
      if (!fits(pc) && node.tagName === 'OL' && node.children.length > 1) splitOL(node);
    }

    blocks.forEach(place);

    var n = pages.length;
    pages.forEach(function (pg, i) { pg.querySelector('.pg').textContent = (i + 1) + ' / ' + n; });
    wirePrint();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
