/**
 * When this document is inside latex_single’s preview iframe:
 * — Same-site links (non-PDF) open in a real browser tab so navigation isn’t trapped in the narrow preview.
 * — PDFs and off-site URLs follow the anchor normally so the iframe can show the PDF or page.
 * — Same-page #hash links are left alone.
 * Opt out: target="_blank", download, mailto/tel/javascript, .latex-open-parent (bridge).
 */
(function () {
  function isPrimaryUnmodifiedClick(e) {
    return e.button === 0 && !e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
  }

  function isPdfUrl(href) {
    try {
      return new URL(href, window.location.href).pathname.toLowerCase().endsWith('.pdf');
    } catch (_) {
      return false;
    }
  }

  function isSamePageLocation(href) {
    try {
      const u = new URL(href, window.location.href);
      const here = new URL(window.location.href);
      if (u.origin !== here.origin) return false;
      const norm = function (path) {
        var p = path || '/';
        if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1);
        return p;
      };
      return norm(u.pathname) === norm(here.pathname) && u.search === here.search;
    } catch (_) {
      return false;
    }
  }

  document.addEventListener('click', function (e) {
    if (window.self === window.top) return;
    if (!isPrimaryUnmodifiedClick(e)) return;

    var a = e.target.closest('a[href]');
    if (!a) return;
    if (a.getAttribute('target') === '_blank') return;
    if (a.hasAttribute('download')) return;
    if (a.classList.contains('latex-open-parent')) return;

    var href = a.getAttribute('href');
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;

    var u;
    try {
      u = new URL(href, window.location.href);
    } catch (_) {
      return;
    }
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return;

    if (isSamePageLocation(href)) return;

    if (u.origin !== window.location.origin || isPdfUrl(u.href)) return;

    e.preventDefault();
    window.open(u.href, '_blank', 'noopener,noreferrer');
  }, true);
})();
