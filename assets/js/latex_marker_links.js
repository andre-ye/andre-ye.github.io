/**
 * Organic “highlighter” backings for in-content links (replaces underlines).
 * Runs site-wide: decorates links under document.body except chrome (nav, header, footer, code, etc.).
 * Same-origin http(s) → lavender family; other origins → yellow family. Deterministic per URL+label.
 * Call latexMarkerLinksRefresh(root) after injecting HTML.
 */
(function () {
  function hashString(s) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function mulberry32(seed) {
    return function () {
      var t = (seed += 0x6d2b79f5) >>> 0;
      t = Math.imul(t ^ (t >>> 15), t | 1) >>> 0;
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61) >>> 0;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function rand(rng, a, b) {
    return a + rng() * (b - a);
  }

  /** Same-origin links — lavender family */
  var PALETTE_INTERNAL = [
    'rgba(188, 165, 228, 0.55)',
    'rgba(220, 200, 248, 0.58)',
    'rgba(200, 185, 240, 0.52)',
  ];
  /** External http(s) — yellow family */
  var PALETTE_EXTERNAL = [
    'rgba(238, 215, 120, 0.55)',
    'rgba(248, 228, 155, 0.58)',
    'rgba(245, 220, 150, 0.55)',
  ];

  function linkIsExternalHttp(a) {
    try {
      var u = new URL(a.href, window.location.href);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
      return u.origin !== window.location.origin;
    } catch (_) {
      return false;
    }
  }

  function shouldSkip(a) {
    if (!a || !a.getAttribute) return true;
    var h = a.getAttribute('href');
    if (!h || h === '#' || h.indexOf('javascript:') === 0) return true;
    if (a.classList.contains('latex-no-marker-link')) return true;
    if (a.classList.contains('bubble-link')) return true;
    if (a.classList.contains('article-link-btn')) return true;
    if (a.classList.contains('random-article-link')) return true;
    if (a.classList.contains('latex-marker-link')) return true;
    if (a.closest('.latex-browser-chrome')) return true;
    if (a.closest('.latex-no-marker-links')) return true;
    if (a.closest('.latex-header')) return true;
    if (a.closest('.latex-default-video-caption')) return true;
    if (a.closest('header')) return true;
    if (a.closest('footer')) return true;
    if (a.closest('nav')) return true;
    if (a.closest('.navbar, .navbar-nav, .nav-link')) return true;
    if (a.closest('pre, code, .highlight, .chroma')) return true;
    if (a.closest('.quotes-nav-panel, .articles-nav-panel')) return true;
    if (a.closest('.pagination, .page-item')) return true;
    if (a.classList.contains('btn') || a.closest('.btn')) return true;
    return false;
  }

  function decorateLink(a) {
    if (shouldSkip(a)) return;
    var key = a.href + '\n' + (a.textContent || '').slice(0, 64);
    var rng = mulberry32(hashString(key));
    var palette = linkIsExternalHttp(a) ? PALETTE_EXTERNAL : PALETTE_INTERNAL;
    var color = palette[(Math.floor(rng() * palette.length) % palette.length) || 0];

    a.classList.add('latex-marker-link');
    a.style.setProperty('--marker-color', color);
    a.style.setProperty('--marker-top-stop', rand(rng, 5, 14).toFixed(1) + '%');
    a.style.setProperty('--marker-bot-stop', rand(rng, 86, 96).toFixed(1) + '%');
    a.style.setProperty('--marker-pad-x', rand(rng, 0.06, 0.16).toFixed(3) + 'em');
    a.style.setProperty('--marker-pad-y', rand(rng, 0.02, 0.12).toFixed(3) + 'em');
    for (var i = 1; i <= 8; i++) {
      a.style.setProperty('--marker-br' + i, rand(rng, 22, 78).toFixed(1) + '%');
    }
  }

  function scanRoot(root) {
    if (!root || !root.querySelectorAll) return;
    var sel = 'a[href]';
    root.querySelectorAll(sel).forEach(decorateLink);
  }

  function scanDocument() {
    scanRoot(document.body);
  }

  document.addEventListener('DOMContentLoaded', scanDocument);

  window.latexMarkerLinksRefresh = function (root) {
    if (root) scanRoot(root);
    else scanDocument();
  };
})();
