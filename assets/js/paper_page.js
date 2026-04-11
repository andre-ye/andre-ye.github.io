/* paper_page.js — fold sections + falling paper scraps */

(function () {
  'use strict';

  var _animating = false;
  var _reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Fold sections ─── */
  function initFolds() {
    document.querySelectorAll('.fold-header').forEach(function (header) {
      header.addEventListener('click', function () {
        var section = header.closest('.fold-section');
        if (!section) return;
        section.classList.toggle('open');
      });
    });
  }

  /* ─── Dynamic content loaders ─── */

  function clearLoading(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }

  function loadCSPapers() {
    var container = document.getElementById('cs-papers-dynamic');
    if (!container) return;
    fetch('/assets/json/cs_papers.json')
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (papers) {
        clearLoading('cs-loading');
        container.innerHTML = '';
        papers.forEach(function (p) {
          var authors = (p.authors || []).map(function (a) {
            return a.includes('Andre Ye') ? '<strong>' + a + '</strong>' : a;
          }).join(', ');
          var links = '';
          if (p.paper_link) links += '<a href="' + p.paper_link + '" target="_blank" rel="noopener noreferrer">paper</a>';
          if (p.slides_link) links += '<a href="' + p.slides_link + '" target="_blank" rel="noopener noreferrer">slides</a>';
          if (p.poster_link) links += '<a href="' + p.poster_link + '" target="_blank" rel="noopener noreferrer">poster</a>';
          if (p.presentation_link) links += '<a href="' + p.presentation_link + '" target="_blank" rel="noopener noreferrer">talk</a>';
          var award = p.award ? '<div class="paper-item-award">' + p.award + '</div>' : '';
          var li = document.createElement('li');
          li.innerHTML =
            '<div class="paper-item-title"><a href="' + (p.paper_link || '#') + '" target="_blank" rel="noopener noreferrer">' + p.title + '</a></div>' +
            '<div class="paper-item-authors">' + authors + '</div>' +
            '<div class="paper-item-venue">' + p.conference_full + ' (' + p.conference_abbrev + ') ' + p.conference_year + '</div>' +
            award +
            (links ? '<div class="paper-item-links">' + links + '</div>' : '');
          container.appendChild(li);
        });
      })
      .catch(function () {
        container.innerHTML = '<li class="loading-text">Could not load papers.</li>';
      });
  }

  function loadPhilPapers() {
    var container = document.getElementById('phil-papers-dynamic');
    if (!container) return;
    fetch('/assets/json/philosophy_papers.json')
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (papers) {
        clearLoading('phil-loading');
        container.innerHTML = '';
        papers.forEach(function (p) {
          var authors = (p.authors || []).map(function (a) {
            return a.includes('Andre Ye') ? '<strong>' + a + '</strong>' : a;
          }).join(', ');
          var links = '';
          if (p.paper_link) links += '<a href="' + p.paper_link + '" target="_blank" rel="noopener noreferrer">paper</a>';
          if (p.slides_link) links += '<a href="' + p.slides_link + '" target="_blank" rel="noopener noreferrer">slides</a>';
          var award = p.award ? '<div class="paper-item-award">' + p.award + '</div>' : '';
          var li = document.createElement('li');
          li.innerHTML =
            '<div class="paper-item-title"><a href="' + (p.paper_link || '#') + '" target="_blank" rel="noopener noreferrer">' + p.title + '</a></div>' +
            '<div class="paper-item-authors">' + authors + '</div>' +
            '<div class="paper-item-venue">' + (p.conference_full || '') + (p.conference_abbrev ? ' (' + p.conference_abbrev + ')' : '') + (p.conference_year ? ' ' + p.conference_year : '') + '</div>' +
            award +
            (links ? '<div class="paper-item-links">' + links + '</div>' : '');
          container.appendChild(li);
        });
      })
      .catch(function () {
        container.innerHTML = '<li class="loading-text">Could not load papers.</li>';
      });
  }

  function loadQuotes() {
    var container = document.getElementById('quotes-dynamic');
    if (!container) return;
    fetch('/assets/json/quotes.json')
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (quotes) {
        var shuffled = quotes.slice().sort(function () { return Math.random() - 0.5; });
        container.innerHTML = '';
        shuffled.forEach(function (q) {
          var li = document.createElement('li');
          li.className = 'quote-item';
          li.innerHTML =
            '<div class="quote-text">\u201c' + q.quote + '\u201d</div>' +
            '<div class="quote-author">\u2014 ' + q.author + '</div>';
          container.appendChild(li);
        });
      })
      .catch(function () {
        container.innerHTML = '<li class="loading-text">Could not load quotes.</li>';
      });
  }

  function loadArticles() {
    var container = document.getElementById('articles-dynamic');
    if (!container) return;
    fetch('/assets/json/me-like-articles.json')
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        var cats = data.categories || [];
        container.innerHTML = '';
        cats.forEach(function (cat) {
          var papers = cat.papers || [];
          if (!papers.length) return;
          var section = document.createElement('div');
          section.className = 'articles-category';
          var title = document.createElement('div');
          title.className = 'articles-category-title';
          title.textContent = cat.title;
          section.appendChild(title);
          papers.forEach(function (item) {
            var el = document.createElement('div');
            el.className = 'article-item';
            var meta = [item.authors, item.year].filter(Boolean).join(', ');
            el.innerHTML =
              '<div class="article-item-title"><a href="' + item.link + '" target="_blank" rel="noopener noreferrer">' + item.title + '</a></div>' +
              (meta ? '<div class="article-item-meta">' + meta + '</div>' : '');
            section.appendChild(el);
          });
          container.appendChild(section);
        });
      })
      .catch(function () {
        container.innerHTML = '<div class="loading-text">Could not load articles.</div>';
      });
  }

  /* Load section data when that section is first opened */
  function initLazyLoaders() {
    var loaderMap = {
      'fold-cs': loadCSPapers,
      'fold-phil': loadPhilPapers,
      'fold-quotes': loadQuotes,
      'fold-articles': loadArticles,
    };

    Object.keys(loaderMap).forEach(function (id) {
      var section = document.getElementById(id);
      if (!section) return;
      var loaded = false;
      section.querySelector('.fold-header').addEventListener('click', function () {
        if (!loaded) {
          loaded = true;
          loaderMap[id]();
        }
      });
    });
  }

  /* ─── Sticky-note background ─── */
  function initStickyNoteBg() {
    var canvas = document.getElementById('bg-canvas');
    if (!canvas) return null;
    // NOTE: mobile gates are evaluated once at init time. Rotating from
    // landscape to portrait (or vice versa) won't re-run them — the user
    // would need to reload. This is intentional for simplicity.
    if (_reducedMotion || window.innerWidth < 740) return null;
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;

    /* Parallax factor: the sticky-note background scrolls at this fraction
     * of the page scroll, so it visually lags behind the main content.
     * 0.1 = strong lag (notes barely move); 0.5 = moderate; 1.0 = none. */
    var PARALLAX = 0.25;

    // Load articles for sticky note links
    var noteArticles = [];
    fetch('/assets/json/me-like-articles.json')
      .then(function(r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(data) {
        var links = [];
        (data.categories || []).forEach(function(cat) {
          (cat.papers || []).forEach(function(p) { if (p.link) links.push(p.link); });
        });
        for (var ii = links.length - 1; ii > 0; ii--) {
          var jj = Math.floor(Math.random() * (ii + 1));
          var tmp = links[ii]; links[ii] = links[jj]; links[jj] = tmp;
        }
        noteArticles = links;
        for (var ni = 0; ni < notes.length; ni++) {
          notes[ni].articleUrl = noteArticles[ni % noteArticles.length] || null;
        }
      })
      .catch(function() {});

    var NOTE = 50;   /* px (CSS) */
    var CELL = 36;   /* < NOTE so notes overlap */

    var STOPS = [
      { t: 0,    r: 42,  g: 16,  b: 64  },
      { t: 0.12, r: 74,  g: 26,  b: 94  },
      { t: 0.26, r: 125, g: 48,  b: 112 },
      { t: 0.40, r: 176, g: 80,  b: 96  },
      { t: 0.54, r: 204, g: 110, b: 72  },
      { t: 0.66, r: 217, g: 142, b: 88  },
      { t: 0.77, r: 232, g: 176, b: 112 },
      { t: 0.87, r: 240, g: 204, b: 144 },
      { t: 0.94, r: 247, g: 223, b: 168 },
      { t: 1.0,  r: 252, g: 238, b: 200 },
    ];

    function sampleGrad(t) {
      t = Math.max(0, Math.min(1, t));
      for (var i = 0; i < STOPS.length - 1; i++) {
        if (t <= STOPS[i + 1].t) {
          var lt = (t - STOPS[i].t) / (STOPS[i + 1].t - STOPS[i].t);
          var a = STOPS[i], b = STOPS[i + 1];
          return {
            r: a.r + (b.r - a.r) * lt,
            g: a.g + (b.g - a.g) * lt,
            b: a.b + (b.b - a.b) * lt,
          };
        }
      }
      return STOPS[STOPS.length - 1];
    }

    var GRAD_CYCLE = 1200;
    function gradientT(y) {
      var phase = (y % (GRAD_CYCLE * 2)) / GRAD_CYCLE;
      return phase > 1 ? 2 - phase : phase;
    }

    function noteColor(yC, jitter) {
      var col = sampleGrad(gradientT(yC));
      var mix = 0.28;
      var bv  = jitter ? 1 + (Math.random() - 0.5) * 0.18 : 1;
      var pr  = Math.round(Math.min(255, (col.r + (255 - col.r) * mix) * bv));
      var pg  = Math.round(Math.min(255, (col.g + (255 - col.g) * mix) * bv));
      var pb  = Math.round(Math.min(255, (col.b + (255 - col.b) * mix) * bv));
      return 'rgb(' + pr + ',' + pg + ',' + pb + ')';
    }

    var baseTiles = [];
    var notes     = [];
    var notesByRow = [];
    var builtTileRows = 0;
    var builtNoteRows = 0;
    var lastVw    = 0;
    var builtDocH = 0;
    var BUFFER    = 2400;

    /* Cached document height — recomputed only on resize/ResizeObserver
     * so the per-frame tick never forces a synchronous layout. */
    var cachedDocH = Math.max(document.documentElement.scrollHeight, window.innerHeight);
    function recomputeDocH() {
      cachedDocH = Math.max(document.documentElement.scrollHeight, window.innerHeight);
    }

    /* Sprite cache: baked per-color canvas (body + shadow + top band) so
     * drawNote can avoid expensive shadowBlur per-frame per-note.
     *
     * IMPORTANT: notes have their colors jittered per-instance, so caching
     * by raw color string would give a 1:1 cache (no sharing). We quantize
     * each RGB channel to the upper 4 bits (16 levels per channel) so
     * thousands of jittered notes share ~30 sprites — turning the cache
     * from "one canvas per note" into a real palette. */
    var spriteCache = Object.create(null);
    var _rgbRe = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;
    function quantizeColor(color) {
      var m = _rgbRe.exec(color);
      if (!m) return color; // unknown format — fall back to raw key
      var r = (+m[1]) & 0xF0, g = (+m[2]) & 0xF0, b = (+m[3]) & 0xF0;
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
    function getSprite(color) {
      var key = quantizeColor(color);
      var cached = spriteCache[key];
      if (cached) return cached;
      var pad = 10;
      var c = document.createElement('canvas');
      c.width  = NOTE + pad;
      c.height = NOTE + pad;
      var sctx = c.getContext('2d');
      // Baked soft shadow — offset (6, 7), approximates shadowBlur(5) at note size
      sctx.fillStyle = 'rgba(0,0,0,0.16)';
      sctx.fillRect(6, 7, NOTE, NOTE);
      // Note body — uses the QUANTIZED color so the cache key matches the pixels
      sctx.fillStyle = key;
      sctx.fillRect(4, 4, NOTE, NOTE);
      // Top band
      sctx.fillStyle = 'rgba(0,0,0,0.07)';
      sctx.fillRect(4, 4, NOTE, NOTE * 0.09);
      spriteCache[key] = c;
      return c;
    }

    /* Event-driven hover hit-test flag — flip on mousemove/scroll only. */
    var _hoverDirty = true;

    /* Spatial hash for hover proximity — O(1) vs O(n) */
    var hovBuckets = Object.create(null);
    var hovBucketsBuilt = 0;
    var HOVER_BUCKET = 100;

    function addNoteToBucket(n) {
      var bx = Math.floor((n.x + NOTE / 2) / HOVER_BUCKET);
      var by = Math.floor((n.y + NOTE / 2) / HOVER_BUCKET);
      var key = bx + ':' + by;
      if (!hovBuckets[key]) hovBuckets[key] = [];
      hovBuckets[key].push(n);
    }

    function updateHovBuckets() {
      for (var i = hovBucketsBuilt; i < notes.length; i++) {
        addNoteToBucket(notes[i]);
      }
      hovBucketsBuilt = notes.length;
    }

    function resetHovBuckets() {
      hovBuckets = Object.create(null);
      hovBucketsBuilt = 0;
    }

    function addBaseTileRows(vw, fromRow, toRow) {
      var cols = Math.ceil(vw / NOTE) + 2;
      for (var r = fromRow; r < toRow; r++) {
        for (var c = 0; c < cols; c++) {
          baseTiles.push({
            x    : c * NOTE,
            y    : r * NOTE,
            color: noteColor(r * NOTE, false),
          });
        }
      }
    }

    function addNoteRows(vw, fromRow, toRow) {
      var cols = Math.ceil(vw / CELL) + 6;
      for (var r = fromRow; r < toRow; r++) {
        if (!notesByRow[r]) notesByRow[r] = [];
        var rowBucket = notesByRow[r];
        for (var c = 0; c < cols; c++) {
          var yC = (r - 0.5) * CELL;
          var ox = (Math.random() - 0.5) * CELL * 0.7;
          var oy = (Math.random() - 0.5) * CELL * 0.7;
          var note = {
            x        : (c - 1) * CELL + ox,
            y        : (r - 1) * CELL + oy,
            baseRot  : (Math.random() - 0.5) * 14 * Math.PI / 180,
            phase    : Math.random() * Math.PI * 2,
            freq1    : 0.30 + Math.random() * 0.20,
            freq2    : 0.45 + Math.random() * 0.20,
            color    : noteColor(yC, true),
            hoverRot : 0,
            hoverV   : 0,
            rustlePos: 0,
            rustleV  : 0,
            articleUrl: noteArticles.length ? noteArticles[notes.length % noteArticles.length] : null,
            isHovered : false,
            row      : r,
          };
          notes.push(note);
          rowBucket.push(note);
        }
      }
    }

    function resizeCanvas() {
      var vw = window.innerWidth, vh = window.innerHeight;
      canvas.width  = vw * dpr;
      canvas.height = vh * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function ensureNotes() {
      var vw   = window.innerWidth;
      recomputeDocH();
      var docH = cachedDocH;

      if (vw !== lastVw) {
        baseTiles = []; notes = []; notesByRow = [];
        builtTileRows = 0; builtNoteRows = 0; builtDocH = 0;
        lastVw = vw;
        resetHovBuckets();
        resizeCanvas();
      }

      var targetH = docH + BUFFER;
      if (targetH > builtDocH) {
        var needTileRows = Math.ceil(targetH / NOTE) + 2;
        var needNoteRows = Math.ceil(targetH / CELL) + 6;
        if (needTileRows > builtTileRows) {
          addBaseTileRows(vw, builtTileRows, needTileRows);
          builtTileRows = needTileRows;
        }
        if (needNoteRows > builtNoteRows) {
          addNoteRows(vw, builtNoteRows, needNoteRows);
          builtNoteRows = needNoteRows;
        }
        builtDocH = targetH;
        updateHovBuckets();
      }
    }

    resizeCanvas();
    ensureNotes();

    /* rAF-throttled resize — at most one rebuild per animation frame */
    var resizePending = false;
    function scheduleEnsure() {
      if (!resizePending) {
        resizePending = true;
        requestAnimationFrame(function () {
          resizePending = false;
          ensureNotes();
        });
      }
    }
    window.addEventListener('resize', function() {
      recomputeDocH();
      scheduleEnsure();
    });
    if (window.ResizeObserver) {
      new ResizeObserver(function() {
        recomputeDocH();
        scheduleEnsure();
      }).observe(document.body);
    }
    window.addEventListener('scroll', function() {
      _hoverDirty = true;
    }, { passive: true });

    /* Autonomous gust system — infrequent, gentle */
    var gusts = [];
    var bgGustTimerId = null;
    function scheduleGust() {
      var delay = 4000 + Math.random() * 7000;
      bgGustTimerId = setTimeout(function () {
        var docH  = cachedDocH;
        var bandY = Math.random() * docH;
        var bandW = 300 + Math.random() * 500;
        var mag   = 0.018 + Math.random() * 0.022;
        gusts.push({ bandY: bandY, bandW: bandW, mag: mag });
        scheduleGust();
      }, delay);
    }
    scheduleGust();

    /* Global sway — all notes share this slow oscillation, creating the feel
     * of a unified field rather than independent motion. */
    var globalSway = 0;

    /* Traveling waves — a ripple front that crosses the grid periodically */
    var travelWaves = [];
    var travelWaveTimerId = null;
    function scheduleTravelWave() {
      var delay = 5500 + Math.random() * 9000;
      travelWaveTimerId = setTimeout(function() {
        var goRight = Math.random() < 0.5;
        var vw = window.innerWidth;
        travelWaves.push({
          x     : goRight ? -150 : vw + 150,
          vx    : goRight ? rnd(140, 240) : -rnd(140, 240),
          y     : (window.scrollY || 0) + rnd(80, window.innerHeight * 0.85),
          bandH : rnd(250, 500),
          halfW : rnd(80, 160),
          mag   : rnd(0.025, 0.055),
        });
        scheduleTravelWave();
      }, delay);
    }
    scheduleTravelWave();

    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        clearTimeout(bgGustTimerId);
        clearTimeout(travelWaveTimerId);
        bgGustTimerId = null;
        travelWaveTimerId = null;
      } else {
        // Cancel any in-flight chains BEFORE rescheduling — otherwise
        // back-to-back visible events would accumulate parallel chains.
        clearTimeout(bgGustTimerId);
        clearTimeout(travelWaveTimerId);
        scheduleGust();
        scheduleTravelWave();
      }
    });

    var _lastCursor = '';

    /* Mouse tracking in page coords */
    var mouseX = -9999, mouseY = -9999, mouseSpeed = 0;
    var lastMX = -9999, lastMY = -9999;
    var HOVER_R  = 110;
    var HOVER_R2 = HOVER_R * HOVER_R;

    document.addEventListener('mousemove', function (e) {
      // Notes are rendered with a parallax shift, so the "doc-space" Y for
      // hit-testing is offset by `effectiveScrollY = scrollY * PARALLAX`,
      // not raw scrollY.
      mouseX = e.clientX + window.scrollX;
      mouseY = e.clientY + (window.scrollY || 0) * PARALLAX;
      var dx = mouseX - lastMX, dy = mouseY - lastMY;
      mouseSpeed = Math.sqrt(dx * dx + dy * dy);
      lastMX = mouseX; lastMY = mouseY;
      _hoverDirty = true;
    });

    /* Apply hover kicks using spatial hash */
    function applyHoverKick() {
      if (mouseX < -9000 || mouseSpeed < 0.5) return;
      var bx0 = Math.floor((mouseX - HOVER_R) / HOVER_BUCKET);
      var bx1 = Math.floor((mouseX + HOVER_R) / HOVER_BUCKET);
      var by0 = Math.floor((mouseY - HOVER_R) / HOVER_BUCKET);
      var by1 = Math.floor((mouseY + HOVER_R) / HOVER_BUCKET);
      for (var bx = bx0; bx <= bx1; bx++) {
        for (var by = by0; by <= by1; by++) {
          var bucket = hovBuckets[bx + ':' + by];
          if (!bucket) continue;
          for (var i = 0; i < bucket.length; i++) {
            var n = bucket[i];
            var cx = n.x + NOTE / 2, cy = n.y + NOTE / 2;
            var dx = mouseX - cx, dy = mouseY - cy;
            var d2 = dx * dx + dy * dy;
            if (d2 < HOVER_R2) {
              var dist = Math.sqrt(d2);
              var proximity = 1 - dist / HOVER_R;
              n.hoverV += mouseSpeed * proximity * 0.018 * (dx < 0 ? 1 : -1);
            }
          }
        }
      }
    }

    function drawNote(n, t) {
      // Local variation: small, slow per-note ripple (subordinate to global sway)
      var localWave = Math.sin(n.phase + n.x * 0.038 + n.y * 0.018 + t * n.freq1) * 0.060
                    + Math.sin(n.phase * 0.7 - n.x * 0.022 + n.y * 0.032 + t * n.freq2) * 0.030;
      // Global sway dominates: all notes move collectively, slight per-note phase offset
      var sway = globalSway * (1.0 + 0.18 * Math.sin(n.phase));
      var rot  = n.baseRot + localWave + sway + n.hoverRot + n.rustlePos;

      ctx.save();
      ctx.translate(n.x + NOTE / 2, n.y + NOTE / 2);
      ctx.rotate(rot);

      if (n.isHovered && n.articleUrl) {
        ctx.filter = 'brightness(1.35) saturate(1.5)';
      }
      // Sprite has body at (4,4); drawing at (-NOTE/2 - 4) puts the body
      // center exactly on the rotation pivot (no off-by-1 drift).
      ctx.drawImage(getSprite(n.color), -NOTE / 2 - 4, -NOTE / 2 - 4);
      if (n.isHovered && n.articleUrl) {
        ctx.filter = 'none';
      }

      ctx.restore();
    }

    canvas.addEventListener('click', function(e) {
      // Same parallax conversion as mousemove — clicks need to land where
      // the user actually sees the note, not where it would be without parallax.
      var cx = e.clientX + (window.scrollX || window.pageXOffset || 0);
      var cy = e.clientY + ((window.scrollY || window.pageYOffset || 0) * PARALLAX);
      // Use the spatial hash (hovBuckets) — O(1) amortised vs full iteration.
      var bx = Math.floor(cx / HOVER_BUCKET);
      var by = Math.floor(cy / HOVER_BUCKET);
      // Check the target bucket and its 8 neighbors — a note's center may sit
      // in an adjacent bucket while its extent still covers (cx, cy).
      for (var ddx = -1; ddx <= 1; ddx++) {
        for (var ddy = -1; ddy <= 1; ddy++) {
          var bucket = hovBuckets[(bx + ddx) + ':' + (by + ddy)];
          if (!bucket) continue;
          for (var ci = bucket.length - 1; ci >= 0; ci--) {
            var cn = bucket[ci];
            if (cx >= cn.x && cx <= cn.x + NOTE && cy >= cn.y && cy <= cn.y + NOTE) {
              if (cn.articleUrl) window.open(cn.articleUrl, '_blank', 'noopener,noreferrer');
              return;
            }
          }
        }
      }
    });

    if (_reducedMotion) {
      var scrollY = window.scrollY || window.pageYOffset || 0;
      var vw = window.innerWidth, vh = window.innerHeight;
      ctx.clearRect(0, 0, vw, vh);
      ctx.save();
      ctx.translate(0, -scrollY);
      for (var si = 0; si < baseTiles.length; si++) {
        var sbt = baseTiles[si];
        ctx.fillStyle = sbt.color;
        ctx.fillRect(sbt.x, sbt.y, NOTE, NOTE);
      }
      for (var sj = 0; sj < notes.length; sj++) {
        drawNote(notes[sj], 0);
      }
      ctx.restore();
      return null;
    }

    /* Return tick for merged RAF loop */
    return function bgTick(now, dt, t) {
      /* Decay mouse speed so hover riffle fades naturally */
      mouseSpeed *= 0.88;

      // Global sway — two very slow sine waves; dominates local variation
      // for collective feel. Amplitudes bumped ~2x for more noticeable
      // background swaying without changing the slow frequencies.
      globalSway = Math.sin(t * 0.28) * 0.115 + Math.sin(t * 0.17) * 0.062;

      var rawScrollY = window.scrollY || window.pageYOffset || 0;
      // Parallax: notes are positioned in "doc space" but the effective
      // viewport-to-doc offset is reduced by PARALLAX, so the background
      // scrolls slower than the page.
      var scrollY = rawScrollY * PARALLAX;
      var vw = window.innerWidth, vh = window.innerHeight;

      var K = 18, Cd = 4.5;
      /* Rustle spring: lightly damped so kicks produce smooth sinusoidal swings
       * that gradually die down rather than snapping back instantly. */
      var KR = 1.2, CdR = 0.7;

      applyHoverKick();

      /* Physics — only for visible notes */
      var yLo = scrollY - NOTE * 2;
      var yHi = scrollY + vh + NOTE * 2;

      /* Row range currently visible — used to index notesByRow for
       * physics, draw, and hover hit-test in O(rows-in-view).
       * Pad ±2 rows because addNoteRows places each note at
       * y = (r - 1) * CELL + oy where oy ∈ [-0.35*CELL, +0.35*CELL] —
       * so a note in row r can occupy y from (r - 1.35)*CELL to
       * roughly (r - 0.35)*CELL + NOTE. The ±2 row pad guarantees no
       * notes are missed at the edges of the visible viewport. */
      var rLo = Math.floor((scrollY - NOTE * 2) / CELL) - 2;
      var rHi = Math.ceil((scrollY + vh + NOTE * 2) / CELL) + 2;
      if (rLo < 0) rLo = 0;
      if (rHi > notesByRow.length) rHi = notesByRow.length;

      // Update note hover state and cursor — event-driven: only run when dirty
      var hoveredNote = null;
      if (_hoverDirty) {
        _hoverDirty = false;
        if (mouseX > -9000) {
          // Clear hover on visible notes (off-screen notes can stay reset)
          for (var rr = rLo; rr < rHi; rr++) {
            var rowArrHov = notesByRow[rr];
            if (!rowArrHov) continue;
            for (var kk = 0; kk < rowArrHov.length; kk++) rowArrHov[kk].isHovered = false;
          }
          // Find topmost hit — iterate rows top-to-bottom; later rows drawn later
          // so we pick the last matching note in the last matching row.
          for (var rh = rHi - 1; rh >= rLo; rh--) {
            var rowArrH = notesByRow[rh];
            if (!rowArrH) continue;
            var found = false;
            for (var hk = rowArrH.length - 1; hk >= 0; hk--) {
              var hn = rowArrH[hk];
              if (mouseX >= hn.x && mouseX <= hn.x + NOTE && mouseY >= hn.y && mouseY <= hn.y + NOTE) {
                hn.isHovered = true;
                if (hn.articleUrl) hoveredNote = hn;
                found = true;
                break;
              }
            }
            if (found) break;
          }
        }
        var newCursor = hoveredNote ? 'pointer' : '';
        if (newCursor !== _lastCursor) { canvas.style.cursor = newCursor; _lastCursor = newCursor; }
      }

      // Update travel wave positions
      for (var wi = travelWaves.length - 1; wi >= 0; wi--) {
        travelWaves[wi].x += travelWaves[wi].vx * dt;
        var vwCur = window.innerWidth;
        if ((travelWaves[wi].vx > 0 && travelWaves[wi].x > vwCur + 200) ||
            (travelWaves[wi].vx < 0 && travelWaves[wi].x < -200)) {
          travelWaves.splice(wi, 1);
        }
      }

      for (var r = rLo; r < rHi; r++) {
        var rowArr = notesByRow[r];
        if (!rowArr) continue;
        for (var k = 0; k < rowArr.length; k++) {
          var n = rowArr[k];

          /* Skip & reset off-screen notes */
          if (n.y < yLo || n.y > yHi) {
            if (n.hoverRot !== 0 || n.hoverV !== 0 || n.rustleV !== 0 || n.rustlePos !== 0) {
              n.hoverRot = 0; n.hoverV = 0; n.rustleV = 0; n.rustlePos = 0;
            }
            continue;
          }

          /* Gust kicks */
          for (var g = 0; g < gusts.length; g++) {
            var gust = gusts[g];
            var cy = n.y + NOTE / 2;
            var gdist = Math.abs(cy - gust.bandY);
            if (gdist < gust.bandW) {
              var gprox = 1 - gdist / gust.bandW;
              n.rustleV += gust.mag * gprox * (Math.random() < 0.5 ? 1 : -1);
            }
          }

          /* Travel wave kicks */
          for (var wj = 0; wj < travelWaves.length; wj++) {
            var tw = travelWaves[wj];
            var xd = Math.abs(n.x + NOTE / 2 - tw.x);
            var yd = Math.abs(n.y + NOTE / 2 - tw.y);
            if (xd < tw.halfW && yd < tw.bandH) {
              var prox = (1 - xd / tw.halfW) * (1 - yd / tw.bandH);
              n.rustleV += tw.mag * prox * (tw.vx > 0 ? 1 : -1);
            }
          }

          /* Hover spring — skip entirely when at rest */
          if (Math.abs(n.hoverRot) > 0.001 || Math.abs(n.hoverV) > 0.001) {
            var acc = -K * n.hoverRot - Cd * n.hoverV;
            n.hoverV   += acc * dt;
            n.hoverRot += n.hoverV * dt;
            n.hoverRot  = Math.max(-0.30, Math.min(0.30, n.hoverRot));
          } else {
            n.hoverRot = 0; n.hoverV = 0;
          }

          /* Rustle spring — velocity drives position; lightly damped so the note
           * swings past centre and oscillates gently back rather than snapping. */
          if (Math.abs(n.rustlePos) > 0.0005 || Math.abs(n.rustleV) > 0.0005) {
            var racc = -KR * n.rustlePos - CdR * n.rustleV;
            n.rustleV   += racc * dt;
            n.rustlePos += n.rustleV * dt;
            n.rustlePos  = Math.max(-0.18, Math.min(0.18, n.rustlePos));
          } else {
            n.rustlePos = 0; n.rustleV = 0;
          }
        }
      }
      gusts.length = 0;

      /* Draw */
      ctx.clearRect(0, 0, vw, vh);
      ctx.save();
      ctx.translate(0, -scrollY);

      /* Base layer — pure fillRect, no transforms per tile */
      for (var i = 0; i < baseTiles.length; i++) {
        var bt = baseTiles[i];
        if (bt.y < yLo || bt.y > yHi) continue;
        ctx.fillStyle = bt.color;
        ctx.fillRect(bt.x, bt.y, NOTE, NOTE);
      }

      /* Decorative layer — iterate visible rows only */
      for (var rd = rLo; rd < rHi; rd++) {
        var rowArrD = notesByRow[rd];
        if (!rowArrD) continue;
        for (var kd = 0; kd < rowArrD.length; kd++) {
          var nd = rowArrD[kd];
          if (nd.y < yLo || nd.y > yHi) continue;
          drawNote(nd, t);
        }
      }

      ctx.restore();
    };
  }

  /* ─── Falling paper scraps ─── */

  function rnd(min, max) { return min + Math.random() * (max - min); }

  /* (Paper title labels removed — particles are now plain paper or AI art images) */
  var FALLING_PAPER_TITLES_UNUSED = [
    'What Do Philosophers Think\nof Using AI in Philosophy?',
    'Agonistic Image Generation',
    'Conceptual Multiverse',
    'Modern Deep Learning\nDesign and Applications',
    'Modern Deep Learning\nfor Tabular Data',
    'Human-AI Interaction\nin Open-Ended Tasks',
    'Language Models as\nPhilosophy Assistants',
    'AI Alignment and\nPhilosophical Method',
    'Evaluating LLMs on\nPhilosophical Reasoning',
    'The Woke Gemini Controversy\nas Agonistic Design',
    'Surveying Academic\nPhilosophers on AI',
    'CS + Philosophy:\nAn Interdisciplinary View',
    'Toward Critical\nCreative AI Practices',
    'Neural Meaning\nRepresentation',
    'Representation and\nIntent in Image Generation',
  ];

  /* Paper color tints — light pastel variations hinting at the background palette.
   * Each tint has [front-rgb, back-rgb] as arrays of [r,g,b] base values. */
  var PAPER_TINTS = [
    { f: [250,248,240], b: [228,222,205] },  // warm white
    { f: [242,232,252], b: [218,208,232] },  // purple-white
    { f: [252,248,228], b: [232,224,205] },  // yellow-white
    { f: [248,232,238], b: [228,210,220] },  // pink-white
    { f: [232,240,252], b: [210,218,232] },  // blue-white
  ];

  function paperColor(tint, face) {
    var base = face === 'front' ? tint.f : tint.b;
    var v = rnd(-6, 6);
    return 'rgb(' + Math.round(Math.max(0,Math.min(255,base[0]+v))) + ',' +
                    Math.round(Math.max(0,Math.min(255,base[1]+v))) + ',' +
                    Math.round(Math.max(0,Math.min(255,base[2]+v))) + ')';
  }

  function makeParticle(side) {
    var vw = window.innerWidth;
    var halfPaper = 370;
    var strictMin = side === 'left' ? 10  : vw / 2 + halfPaper + 10;
    var strictMax = side === 'left' ? vw / 2 - halfPaper - 10 : vw - 10;
    if (strictMax - strictMin < 60) return null;
    var tint = PAPER_TINTS[Math.floor(Math.random() * PAPER_TINTS.length)];
    /* 25% of side particles are in-front; they get a modest overlap into paper zone. */
    var inFront = Math.random() < 0.25;
    var overlap = inFront ? rnd(20, 55) : 0;
    var xMin = side === 'left' ? strictMin : strictMin - overlap;
    var xMax = side === 'left' ? strictMax + overlap : strictMax;
    var w = rnd(72, 112);
    var bvy = rnd(28, 55);
    // Parallax factor based on size + layer. Bigger papers feel closer
    // (higher parallax = appear to move faster on scroll). Front-layer
    // papers (over the main sheet) parallax > 1 (closer than the page);
    // back-layer papers parallax < 1 (between page at 1.0 and the
    // sticky-note background at 0.25).
    var sizeNorm = (w - 72) / 40; // 0..1 over the size range
    var parallax = inFront ? (1.05 + sizeNorm * 0.30) : (0.45 + sizeNorm * 0.40);
    return {
      baseX : rnd(strictMin, strictMax),
      baseXV: rnd(-6, 6),
      xMin  : xMin,
      xMax  : xMax,
      y     : -rnd(60, window.innerHeight + 60),
      vy    : bvy,  baseVy: bvy,
      yPhase: rnd(0, Math.PI * 2), yFreq: rnd(0.6, 1.8), yAmp: rnd(0, 14),
      wobblePhase: rnd(0, Math.PI * 2),
      wobbleFreq : rnd(1.5, 3.2),
      wobbleAmp  : rnd(12, Math.min((strictMax - strictMin) * 0.55, 60)),
      ATiltZ: rnd(10, 22), angY: rnd(0, Math.PI * 2), angYV: rnd(-0.2, 0.2),
      nextKick: rnd(0.8, 3.0), nextStochKick: 0, angX: rnd(-0.3, 0.3), angXV: rnd(-0.2, 0.2),
      bendY: rnd(-10, 10), bendYV: rnd(-1, 1), bendTarget: rnd(-14, 14), bendDriftT: rnd(2, 6),
      bendX: rnd(-8, 8), bendXV: rnd(-0.5, 0.5), bendXTarget: rnd(-10, 10), bendXDriftT: rnd(2, 5),
      w: w, h: rnd(50, 78),
      front: paperColor(tint, 'front'),
      back : paperColor(tint, 'back'),
      alpha : 1,
      isSide: true,
      inFront: inFront,
      tumble: false,
      parallax: parallax,
    };
  }

  /* Spawn a particle from anywhere across the full ceiling width. */
  function makeParticleAnywhere() {
    var vw = window.innerWidth;
    var halfPaper = 370;
    var paperL = vw / 2 - halfPaper;
    var paperR = vw / 2 + halfPaper;
    var tint = PAPER_TINTS[Math.floor(Math.random() * PAPER_TINTS.length)];

    /* 25% are in-front. They stay near the paper margins (max 55px overlap)
     * so they don't obscure large runs of text. Assigned once at creation. */
    var inFront = Math.random() < 0.25;
    var xMin, xMax;
    if (inFront) {
      if (Math.random() < 0.5) {
        xMin = 10; xMax = Math.min(paperL + 55, vw / 2);
      } else {
        xMin = Math.max(paperR - 55, vw / 2); xMax = vw - 10;
      }
    } else {
      xMin = 10; xMax = vw - 10;
    }
    var x = rnd(xMin, xMax);
    var w = rnd(60, 115);
    var tumble = w < 75 && Math.random() < 0.55; // small papers can tumble
    var bvy = rnd(22, 52);
    // 3D depth parallax — same scheme as makeParticle. See comments there.
    var sizeNorm = (w - 60) / 55; // 0..1 over the size range
    var parallax = inFront ? (1.05 + sizeNorm * 0.30) : (0.45 + sizeNorm * 0.40);
    return {
      baseX : x,
      baseXV: rnd(-9, 9),
      xMin  : xMin,
      xMax  : xMax,
      y     : -rnd(20, window.innerHeight * 1.8),
      vy    : bvy,  baseVy: bvy,
      yPhase: rnd(0, Math.PI * 2), yFreq: rnd(0.5, 2.0), yAmp: rnd(0, 18),
      wobblePhase: rnd(0, Math.PI * 2),
      wobbleFreq : rnd(1.3, 3.5),
      wobbleAmp  : rnd(8, 50),
      ATiltZ: rnd(6, 26), angY: rnd(0, Math.PI * 2),
      angYV: tumble ? (Math.random() < 0.5 ? rnd(2, 4) : rnd(-4, -2)) : rnd(-0.3, 0.3),
      nextKick: rnd(0.5, 2.5), nextStochKick: 0, angX: rnd(-0.35, 0.35), angXV: rnd(-0.2, 0.2),
      bendY: rnd(-12, 12), bendYV: rnd(-1.2, 1.2), bendTarget: rnd(-16, 16), bendDriftT: rnd(2, 6),
      bendX: rnd(-10, 10), bendXV: rnd(-0.6, 0.6), bendXTarget: rnd(-12, 12), bendXDriftT: rnd(2, 5),
      w: w,
      h: rnd(42, 80),
      front: paperColor(tint, 'front'),
      back : paperColor(tint, 'back'),
      alpha : 0.88,
      isSide: false,
      inFront: inFront,
      tumble: tumble,
      parallax: parallax,
    };
  }



  function updateParticle(p, dt, docH) {
    // Drag-based fall speed: face-on paper falls slower, edge-on falls faster.
    // Pitch (angX) creates a lift/dive effect.
    var cosY = Math.cos(p.angY);
    var drag = 0.28 + 0.72 * (cosY * cosY);
    var pitchLift = Math.sin(p.angX) * 22;
    p.vy += (p.baseVy * drag - pitchLift - p.vy) * 3.5 * dt;

    p.y += p.vy * dt;

    // Vertical oscillation — gentle bob that occasionally looks like a gust caught it.
    p.yPhase += p.yFreq * dt;
    p.y += Math.sin(p.yPhase) * p.yAmp * dt;

    p.baseX += p.baseXV * dt;
    if (p.baseX < p.xMin || p.baseX > p.xMax) {
      p.baseXV *= -1;
      p.baseX = Math.max(p.xMin, Math.min(p.xMax, p.baseX));
    }

    var bottom = (docH !== undefined ? docH : window.innerHeight);
    if (p.y > bottom + 140) {
      p.y = -rnd(60, 200);
      p.baseX = rnd(p.xMin, p.xMax);
    }

    p.wobblePhase += p.wobbleFreq * dt;

    p.nextKick -= dt;
    if (p.nextKick <= 0) {
      var big = Math.random() < 0.25;
      var mag = big ? rnd(1.5, 3.5) : rnd(0.1, 0.7);
      p.angYV += mag * (Math.random() < 0.5 ? 1 : -1);
      p.nextKick = rnd(1.5, 5.0);
    }

    // Throttle stochastic rnd() kicks to ~15Hz per particle.
    // Deterministic damping + drift (next block) keeps running every frame.
    var nowMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    var kickNow = nowMs >= (p.nextStochKick || 0);
    if (kickNow) p.nextStochKick = nowMs + 60;

    if (p.tumble) {
      // Small tumbling papers: low damping, strong random kicks, full rotations
      p.angYV *= Math.pow(0.62, dt);
      if (kickNow) p.angYV += rnd(-0.18, 0.18);
      if (Math.abs(p.angYV) < 1.2 && Math.random() < 0.006) {
        p.angYV += (Math.random() < 0.5 ? 1 : -1) * rnd(2.5, 5.0);
      }
      p.angYV = Math.max(-12, Math.min(12, p.angYV));
    } else {
      p.angYV *= Math.pow(0.18, dt);
      if (kickNow) p.angYV += rnd(-0.04, 0.04);
      p.angYV = Math.max(-8, Math.min(8, p.angYV));
    }
    p.angY  += p.angYV * dt;

    // Pitch (angX): tumbling papers pitch more freely; normal papers settle but react.
    var xRnd = kickNow ? (p.tumble ? rnd(-0.30, 0.30) : rnd(-0.20, 0.20)) : 0;
    var xAcc = p.tumble ? -p.angX * 1.5 - p.angXV * 1.4 + xRnd
                        : -p.angX * 2.0 - p.angXV * 1.6 + xRnd;
    p.angXV += xAcc * dt;
    p.angX  += p.angXV * dt;
    p.angX   = Math.max(-0.9, Math.min(0.9, p.angX));

    // Bend Y (bow along width): occasional large bending episodes.
    p.bendDriftT -= dt;
    if (p.bendDriftT <= 0) {
      var bigBendY = Math.random() < 0.15;
      p.bendTarget = bigBendY ? rnd(-34, 34) : rnd(-18, 18);
      p.bendDriftT = bigBendY ? rnd(4.0, 10.0) : rnd(2.5, 7.0);
    }
    var bendYRnd = kickNow ? rnd(-0.3, 0.3) : 0;
    var bendAcc = (p.bendTarget - p.bendY) * 1.8 - p.bendYV * 2.2 + bendYRnd;
    p.bendYV += bendAcc * dt;
    p.bendY  += p.bendYV * dt;
    p.bendY   = Math.max(-36, Math.min(36, p.bendY));

    // Bend X (diagonal twist): corners lift/drop creating a potato-chip curl.
    p.bendXDriftT -= dt;
    if (p.bendXDriftT <= 0) {
      var bigBendX = Math.random() < 0.15;
      p.bendXTarget = bigBendX ? rnd(-30, 30) : rnd(-14, 14);
      p.bendXDriftT = bigBendX ? rnd(4.0, 10.0) : rnd(2.0, 6.0);
    }
    var bendXRnd = kickNow ? rnd(-0.2, 0.2) : 0;
    var bendXAcc = (p.bendXTarget - p.bendX) * 1.6 - p.bendXV * 2.0 + bendXRnd;
    p.bendXV += bendXAcc * dt;
    p.bendX  += p.bendXV * dt;
    p.bendX   = Math.max(-32, Math.min(32, p.bendX));
  }

  function drawBentImage(ctx, img, hw, hh, pw, ph, bend, bendX) {
    var iw = img.naturalWidth  || img.width;
    var ih = img.naturalHeight || img.height;
    if (!iw || !ih) return;

    bendX = bendX || 0;
    var pad = 5;
    var dstW = pw - pad * 2;
    var dstH = ph - pad * 2;

    // Fast path: when the sheet is nearly flat, draw the texture once —
    // the per-strip loop produces an imperceptibly different result at
    // this small displacement scale.
    if (Math.abs(bend) < 0.5 && Math.abs(bendX) < 0.5) {
      ctx.drawImage(img, 0, 0, iw, ih, -hw + pad, -hh + pad, dstW, dstH);
      return;
    }

    var N    = 12;
    var stripSrcW = iw / N;
    var stripDstW = dstW / N;

    for (var i = 0; i < N; i++) {
      var t       = (i + 0.5) / N;
      var xFrac   = i / (N - 1);
      var yBow    = 2 * bend * t * (1 - t);
      // Diagonal twist: left edge lifted by +bendX, right edge lowered by -bendX.
      var twist   = bendX * (1 - 2 * xFrac);
      ctx.drawImage(
        img,
        i * stripSrcW, 0, stripSrcW + 1, ih,
        -hw + pad + i * stripDstW, -hh + pad + yBow + twist, stripDstW + 0.5, dstH
      );
    }
  }



  function drawParticle(ctx, p, pScrollY) {
    var cosY  = Math.cos(p.angY);
    var cosX  = Math.cos(p.angX);
    var isBack = cosY < 0;

    var normHV = Math.cos(p.wobblePhase);
    var tiltZ  = p.ATiltZ * normHV * (Math.PI / 180);
    var x = p.baseX + Math.sin(p.wobblePhase) * p.wobbleAmp;

    ctx.save();
    if (p.alpha !== undefined && p.alpha < 1) ctx.globalAlpha = p.alpha;
    // Translate to viewport y by subtracting per-particle effective scroll.
    // This is the parallax in action: same p.y, different visual y based on
    // how strongly the particle responds to scroll.
    ctx.translate(x, p.y - (pScrollY || 0));
    ctx.rotate(tiltZ);

    var sx = Math.abs(cosY);
    // More dramatic pitch compression: near edge-on (cosX≈0) paper looks very thin.
    var sy = Math.max(0.12, Math.abs(Math.cos(p.angX)));
    ctx.scale(sx, sy);

    var hw = p.w / 2, hh = p.h / 2;
    var bY = p.bendY;
    var bX = p.bendX || 0;

    // bentPath: horizontal bow (bY) + diagonal twist (bX) — corners rise/fall oppositely.
    function bentPath() {
      ctx.beginPath();
      ctx.moveTo(-hw, -hh + bX);
      ctx.quadraticCurveTo(0, -hh + bY, hw, -hh - bX);
      ctx.lineTo(hw, hh - bX);
      ctx.quadraticCurveTo(0, hh + bY, -hw, hh + bX);
      ctx.lineTo(-hw, -hh + bX);
      ctx.closePath();
    }

    if (p.paperImg && sx > 0.05) {
      ctx.fillStyle = isBack ? p.back : '#faf7f0';
      bentPath();
      ctx.fill();

      if (!isBack) {
        ctx.save();
        bentPath();
        ctx.clip();
        drawBentImage(ctx, p.paperImg, hw, hh, p.w, p.h, bY, bX);
        ctx.restore();
      }

      ctx.strokeStyle = isBack ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.12)';
      ctx.lineWidth   = 0.7 / Math.max(sx, 0.1);
      bentPath();
      ctx.stroke();

    } else {
      ctx.fillStyle = isBack ? p.back : p.front;
      bentPath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(0,0,0,0.045)';
      ctx.lineWidth   = 0.7 / Math.max(sx, 0.1);
      ctx.beginPath();
      ctx.moveTo(-hw * 0.3, -hh);
      ctx.quadraticCurveTo(0, bY * 0.5, -hw * 0.3, hh);
      ctx.stroke();

      ctx.strokeStyle = isBack ? 'rgba(0,0,0,0.07)' : 'rgba(0,0,0,0.06)';
      ctx.lineWidth   = 0.5 / Math.max(sx, 0.1);
      bentPath();
      ctx.stroke();

    }

    ctx.restore();
  }

  function initFallingPapers() {
    if (_reducedMotion) return null;
    if (window.innerWidth < 1060) return null;

    var canvas      = document.getElementById('paper-scraps-canvas');
    var canvasFront = document.getElementById('paper-scraps-front-canvas');
    if (!canvas || !canvasFront) return null;
    var ctx      = canvas.getContext('2d');
    var ctxFront = canvasFront.getContext('2d');

    var dpr = window.devicePixelRatio || 1;
    function resizeScrapsCanvas() {
      var w = window.innerWidth, h = window.innerHeight;
      canvas.width       = w * dpr; canvas.height       = h * dpr;
      canvasFront.width  = w * dpr; canvasFront.height  = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctxFront.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeScrapsCanvas();

    /* Cached document height — only recomputed on resize/ResizeObserver so
     * the per-frame tick never forces a synchronous layout. */
    var cachedScrapsDocH = Math.max(document.body.scrollHeight, window.innerHeight * 2);
    function recomputeScrapsDocH() {
      cachedScrapsDocH = Math.max(document.body.scrollHeight, window.innerHeight * 2);
    }

    var scrapsResizePending = false;
    window.addEventListener('resize', function () {
      if (!scrapsResizePending) {
        scrapsResizePending = true;
        requestAnimationFrame(function () {
          scrapsResizePending = false;
          resizeScrapsCanvas();
          recomputeScrapsDocH();
        });
      }
    });
    if (window.ResizeObserver) {
      var scrapsRoPending = false;
      new ResizeObserver(function() {
        if (!scrapsRoPending) {
          scrapsRoPending = true;
          requestAnimationFrame(function() {
            scrapsRoPending = false;
            recomputeScrapsDocH();
          });
        }
      }).observe(document.body);
    }

    var particles = [];

    // Spawn initial dense set — mix of side-only and full-ceiling (~3/4 of original)
    for (var i = 0; i < 13; i++) {
      var side = i % 2 === 0 ? 'left' : 'right';
      var p = makeParticle(side);
      if (!p) continue;
      particles.push(p);
    }

    // Full-ceiling particles — no zone restriction
    for (var j = 0; j < 31; j++) {
      var fp = makeParticleAnywhere();
      if (!fp) continue;
      particles.push(fp);
    }


    // Continuous spawn: add new full-ceiling particles every 2.4s, cap
    // scales with viewport width so small screens get fewer particles.
    // The interval is cleared while the tab is hidden so particles don't
    // accumulate at the ceiling unobserved and flood the screen on return.
    var spawnInterval = null;
    function startSpawn() {
      if (spawnInterval) return;
      spawnInterval = setInterval(function() {
        var cap = Math.max(50, Math.min(110, Math.round(window.innerWidth / 20)));
        if (particles.length >= cap) return;
        var np = makeParticleAnywhere();
        if (np) np.y = -rnd(20, 80);
        if (np) particles.push(np);
      }, 2400);
    }
    function stopSpawn() {
      clearInterval(spawnInterval);
      spawnInterval = null;
    }
    startSpawn();

    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        stopSpawn();
      } else {
        // Redistribute any particles that piled up near the ceiling while hidden
        var vh = window.innerHeight;
        particles.forEach(function(p) {
          if (p.y < 10) p.y = rnd(0, vh * 1.6);
        });
        startSpawn();
      }
    });

    return function scrapsTick(now, dt) {
      var scrollY = window.scrollY || window.pageYOffset || 0;
      var docH    = cachedScrapsDocH;
      var vw      = window.innerWidth;
      var vh      = window.innerHeight;

      ctx.clearRect(0, 0, vw, vh);
      ctxFront.clearRect(0, 0, vw, vh);

      /* Per-particle parallax for 3D depth: each particle's effective
       * scroll = scrollY * p.parallax. Bigger papers + front-layer get
       * higher parallax (appear closer, move faster). This is computed
       * per particle inside drawParticle, so there's no global ctx
       * translate. The visibility check also uses the per-particle
       * effective scroll. */
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        updateParticle(p, dt, docH);
        var pScrollY = scrollY * p.parallax;
        if (p.y >= pScrollY - 300 && p.y <= pScrollY + vh + 300) {
          drawParticle(p.inFront ? ctxFront : ctx, p, pScrollY);
        }
      }
    };
  }

  /* ─── Paper edge physics ─── */
  function initPaperFlutter() {
    if (_reducedMotion) return null;
    var host   = document.getElementById('paper-host');
    var canvas = document.getElementById('paper-canvas');
    if (!host || !canvas) return null;

    var ctx = canvas.getContext('2d');
    var BLEED = 28;
    var K     = 14.0;
    var C_d   = 4.2;
    var DT    = 1 / 60;
    var MAX_D = 22;

    var corners = [
      { rx: 0, ry: 0, x: 0, y: 0, vx: 0, vy: 0, wx: 0, wy: 0 },
      { rx: 0, ry: 0, x: 0, y: 0, vx: 0, vy: 0, wx: 0, wy: 0 },
      { rx: 0, ry: 0, x: 0, y: 0, vx: 0, vy: 0, wx: 0, wy: 0 },
      { rx: 0, ry: 0, x: 0, y: 0, vx: 0, vy: 0, wx: 0, wy: 0 },
    ];

    var W = 0, H = 0;

    function resetRest() {
      W = host.offsetWidth;
      H = host.offsetHeight;
      corners[0].rx = BLEED;     corners[0].ry = BLEED;
      corners[1].rx = BLEED + W; corners[1].ry = BLEED;
      corners[2].rx = BLEED + W; corners[2].ry = BLEED + H;
      corners[3].rx = BLEED;     corners[3].ry = BLEED + H;
    }

    function resizeCanvas() {
      W = host.offsetWidth;
      H = host.offsetHeight;
      var dpr = window.devicePixelRatio || 1;
      canvas.width  = (W + BLEED * 2) * dpr;
      canvas.height = (H + BLEED * 2) * dpr;
      canvas.style.width  = (W + BLEED * 2) + 'px';
      canvas.style.height = (H + BLEED * 2) + 'px';
      canvas.style.left   = -BLEED + 'px';
      canvas.style.top    = -BLEED + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      resetRest();
      corners.forEach(function (c) { c.x = c.rx; c.y = c.ry; });
    }

    function stepParticle(c) {
      var ax = -K * (c.x - c.rx) - C_d * c.vx + c.wx;
      var ay = -K * (c.y - c.ry) - C_d * c.vy + c.wy;
      c.vx += ax * DT;
      c.vy += ay * DT;
      c.x  += c.vx * DT;
      c.y  += c.vy * DT;
      var dx = c.x - c.rx, dy = c.y - c.ry;
      if (Math.abs(dx) > MAX_D) { c.x = c.rx + Math.sign(dx) * MAX_D; c.vx *= -0.3; }
      if (Math.abs(dy) > MAX_D) { c.y = c.ry + Math.sign(dy) * MAX_D; c.vy *= -0.3; }
      c.wx = 0; c.wy = 0;
    }

    var ambientT = 0;
    function applyAmbient() {
      ambientT += DT;
      var t = ambientT;
      var fx = 0.9 * Math.sin(2 * Math.PI * 0.08 * t)
             + 0.4 * Math.sin(2 * Math.PI * 0.13 * t + 1.3);
      var fy = 0.7 * Math.sin(2 * Math.PI * 0.11 * t + 0.7)
             + 0.35 * Math.sin(2 * Math.PI * 0.07 * t + 2.1);
      var weights = [0.5, 0.5, 1.4, 1.4];
      corners.forEach(function (c, i) {
        c.wx += fx * weights[i];
        c.wy += fy * weights[i];
      });
    }

    var activeGusts = [];
    var flutterGustTimerId = null;
    function scheduleGust() {
      var delay = 4000 + Math.random() * 8000;
      flutterGustTimerId = setTimeout(function () {
        var factors = [
          0.3 + Math.random() * 0.5,
          0.3 + Math.random() * 0.5,
          0.6 + Math.random() * 0.4,
          0.6 + Math.random() * 0.4,
        ];
        var angle = (Math.random() * 60 - 30) * Math.PI / 180;
        activeGusts.push({
          start:     performance.now(),
          duration:  400 + Math.random() * 800,
          magnitude: 3 + Math.random() * 6,
          angle:     angle,
          factors:   factors,
        });
        scheduleGust();
      }, delay);
    }

    function applyGusts(now) {
      activeGusts = activeGusts.filter(function (g) {
        var elapsed = (now - g.start) / 1000;
        var total   = g.duration / 1000;
        if (elapsed >= total) return false;
        var t = elapsed / total;
        var env = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1.0;
        var fx = Math.cos(g.angle) * g.magnitude * env;
        var fy = -Math.abs(Math.sin(g.angle)) * g.magnitude * env;
        corners.forEach(function (c, i) {
          c.wx += fx * g.factors[i];
          c.wy += fy * g.factors[i];
        });
        return true;
      });
    }

    function edgeMids() {
      var c = corners;
      function mid(a, b, axis, sign) {
        var mx = (a.x + b.x) / 2;
        var my = (a.y + b.y) / 2;
        var aDisp = (a[axis] - a['r' + axis]);
        var bDisp = (b[axis] - b['r' + axis]);
        var bow   = (aDisp + bDisp) / 2 * 0.3 * sign;
        return axis === 'x'
          ? { x: mx + bow, y: my }
          : { x: mx,       y: my + bow };
      }
      return [
        mid(c[0], c[1], 'y', -1),
        mid(c[1], c[2], 'x', +1),
        mid(c[2], c[3], 'y', +1),
        mid(c[3], c[0], 'x', -1),
      ];
    }

    function tracePath(c, m) {
      ctx.beginPath();
      ctx.moveTo(m[3].x, m[3].y);
      ctx.quadraticCurveTo(c[0].x, c[0].y, m[0].x, m[0].y);
      ctx.quadraticCurveTo(c[1].x, c[1].y, m[1].x, m[1].y);
      ctx.quadraticCurveTo(c[2].x, c[2].y, m[2].x, m[2].y);
      ctx.quadraticCurveTo(c[3].x, c[3].y, m[3].x, m[3].y);
      ctx.closePath();
    }

    /* 2 shadow passes — removes the heaviest 40px blur */
    function drawShadow(c, m) {
      var avgLift = (c[2].ry - c[2].y + c[3].ry - c[3].y) / 2;
      var bias    = Math.max(0, avgLift * 0.5);

      function shadowLayer(blur, ox, oy, alpha) {
        ctx.save();
        ctx.filter = 'blur(' + blur + 'px)';
        ctx.translate(ox, oy);
        ctx.fillStyle = 'rgba(0,0,0,' + alpha + ')';
        tracePath(c, m);
        ctx.fill();
        ctx.restore();
      }

      shadowLayer(8,  2, 5  + bias * 0.4, 0.13);
      shadowLayer(22, 0, 14 + bias * 0.7, 0.10);
    }

    function drawCurl(corner, idx) {
      var dx = corner.x - corner.rx;
      var dy = corner.y - corner.ry;
      var disp = Math.sqrt(dx * dx + dy * dy);
      if (disp < 1.5) return;
      var size = Math.min(disp * 3.8, 56);
      ctx.save();
      ctx.translate(corner.x, corner.y);
      var rots = [Math.PI, -Math.PI / 2, 0, Math.PI / 2];
      ctx.rotate(rots[idx]);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-size, 0);
      ctx.lineTo(0, -size);
      ctx.closePath();
      var grad = ctx.createLinearGradient(0, 0, -size * 0.65, -size * 0.65);
      grad.addColorStop(0,    'rgba(130, 65, 18, 0.30)');
      grad.addColorStop(0.55, 'rgba(155, 75, 22, 0.13)');
      grad.addColorStop(1,    'rgba(165, 85, 28, 0.00)');
      ctx.fillStyle = grad;
      ctx.globalAlpha = idx < 2 ? 0.55 : 1.0;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        clearTimeout(flutterGustTimerId);
        flutterGustTimerId = null;
      } else {
        // Cancel any in-flight chain before rescheduling.
        clearTimeout(flutterGustTimerId);
        corners.forEach(function (c) { c.vx = 0; c.vy = 0; });
        scheduleGust();
      }
    });

    /* rAF-throttled ResizeObserver */
    if (window.ResizeObserver) {
      var flutterRoPending = false;
      var ro = new ResizeObserver(function () {
        if (!flutterRoPending) {
          flutterRoPending = true;
          requestAnimationFrame(function () {
            flutterRoPending = false;
            var prevW = W, prevH = H;
            resizeCanvas();
            if (W !== prevW || H !== prevH) {
              corners.forEach(function (c) { c.x = c.rx; c.y = c.ry; c.vx = 0; c.vy = 0; });
            }
          });
        }
      });
      ro.observe(host);
    }

    resizeCanvas();
    scheduleGust();

    /* Skip flutter redraws while the user is actively scrolling — the
     * paper is rapidly moving through the viewport anyway and the subtle
     * flutter is imperceptible. Flag clears 200ms after the last scroll. */
    var _isScrolling = false;
    var _scrollIdleTimer = null;
    window.addEventListener('scroll', function () {
      _isScrolling = true;
      clearTimeout(_scrollIdleTimer);
      _scrollIdleTimer = setTimeout(function () { _isScrolling = false; }, 200);
    }, { passive: true });

    var _hasDrawnOnce = false;
    return function flutterTick(now) {
      if (_isScrolling) return;

      // Early-out when all corners are effectively at rest and no gusts
      // are pushing them — skip the full redraw. EXCEPT on the very first
      // tick: we must draw the static paper shadow at least once,
      // otherwise on a fresh page load the paper has no shadow until the
      // first gust fires (4–12s later).
      if (_hasDrawnOnce && activeGusts.length === 0) {
        var still = true;
        for (var si = 0; si < corners.length; si++) {
          var cs = corners[si];
          if ((Math.abs(cs.vx) + Math.abs(cs.vy) + Math.abs(cs.x - cs.rx) + Math.abs(cs.y - cs.ry)) >= 0.3) {
            still = false;
            break;
          }
        }
        if (still) return;
      }

      applyAmbient();
      applyGusts(now);
      corners.forEach(stepParticle);
      var m = edgeMids();

      ctx.clearRect(0, 0, (W + BLEED * 2), (H + BLEED * 2));
      drawShadow(corners, m);
      corners.forEach(drawCurl);
      _hasDrawnOnce = true;
    };
  }

  /* ─── Torn paper SVG generator ─── */

  /* Generate the jagged tear points shared by both the sweep animation and the
   * top tear SVG, so they are literally the same profile. */
  function generateTearPts() {
    /* Tear geometry is tightly constrained around the vertical center of a
     * 26px SVG so that the tear line reliably lands near the panel's top edge
     * (the paragraph boundary) in both open and closed states.
     *   baseY = 13   (center of 26px)
     *   rough = ±2.5 (small x-jitter per point)
     *   wave  = ±1.5 (smooth sine variation)
     * Total y range: 9 to 17 → ±4 from center. With top:-13 offset, the
     * visual tear line stays within 4px of the panel top — no hugging next
     * paragraph, no gap above panel cream background. */
    var W = 600, H = 26, baseY = 13;
    var phase = Math.random() * Math.PI * 2;
    var numPts = 52;
    var pts = [];
    for (var i = 0; i <= numPts; i++) {
      var t = i / numPts;
      var x = t * W;
      var rough = (Math.random() - 0.5) * 5;
      var wave  = Math.sin(t * Math.PI * 9 + phase) * 1.5;
      var y = baseY + rough + wave;
      y = Math.max(2, Math.min(H - 2, y));
      pts.push([x, y]);
    }
    var ptsStr = pts.map(function(p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
    return { pts: pts, ptsStr: ptsStr };
  }

  function makeTearSvg(pos, sharedPts) {
    var W = 600, H = 26;
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.cssText = 'display:block;width:100%;height:' + H + 'px;overflow:visible;';

    var pts, ptsStr;
    if (pos === 'top' && sharedPts) {
      pts = sharedPts.pts;
      ptsStr = sharedPts.ptsStr;
    } else {
      // Bottom tear generates its own independent points
      var baseY = 8;
      var phase = Math.random() * Math.PI * 2;
      pts = [];
      for (var i = 0; i <= 52; i++) {
        var t = i / 52;
        var x = t * W;
        var rough = (Math.random() - 0.5) * 11;
        var wave  = Math.sin(t * Math.PI * 9 + phase) * 2.5;
        var y = baseY + rough + wave;
        y = Math.max(2, Math.min(H - 2, y));
        pts.push([x, y]);
      }
      ptsStr = pts.map(function(p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
    }

    var d;
    if (pos === 'top') {
      d = 'M 0,0 L 0,' + pts[0][1].toFixed(1);
      pts.forEach(function(p) { d += ' L ' + p[0].toFixed(1) + ',' + p[1].toFixed(1); });
      d += ' L ' + W + ',0 Z';
    } else {
      d = 'M 0,' + H + ' L 0,' + pts[0][1].toFixed(1);
      pts.forEach(function(p) { d += ' L ' + p[0].toFixed(1) + ',' + p[1].toFixed(1); });
      d += ' L ' + W + ',' + H + ' Z';
    }

    var fill = document.createElementNS(ns, 'path');
    fill.setAttribute('d', d);
    fill.setAttribute('fill', '#fdfaf4');
    svg.appendChild(fill);

    /* Diffuse drop shadow along the tear — a single polyline run through
     * the global #tear-shadow-soft Gaussian blur filter. Both top and
     * bottom tears cast their shadow DOWNWARD (positive Y), the way real
     * paper edges do under overhead light. For the top tear this puts the
     * shadow onto the cream panel content beneath. For the bottom tear it
     * puts the shadow onto the page background BELOW the panel — never
     * back into the panel content area where text lives. */
    var shadow = document.createElementNS(ns, 'polyline');
    shadow.setAttribute('points', ptsStr);
    shadow.setAttribute('stroke', 'rgba(10,4,0,0.55)');
    shadow.setAttribute('stroke-width', '2');
    shadow.setAttribute('stroke-linecap', 'round');
    shadow.setAttribute('stroke-linejoin', 'round');
    shadow.setAttribute('fill', 'none');
    shadow.setAttribute('filter', 'url(#tear-shadow-soft)');
    shadow.setAttribute('transform', 'translate(0,4)');
    svg.appendChild(shadow);

    var line = document.createElementNS(ns, 'polyline');
    line.setAttribute('points', ptsStr);
    line.setAttribute('stroke', 'rgba(80,40,15,0.20)');
    line.setAttribute('stroke-width', '0.9');
    line.setAttribute('fill', 'none');
    svg.appendChild(line);

    return svg;
  }

  /* ─── Tear sweep SVG — clip-rect reveal, visually identical to makeTearSvg('top') ─── */

  function makeSweepSvg(sharedPts) {
    var W = 600, H = 26;
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.cssText = 'display:block;width:100%;height:' + H + 'px;overflow:visible;';

    // Clip rect that animates from width=0 to W+2, revealing content left-to-right
    var clipId = 'rip-sc-' + (Math.random() * 0xffffff | 0).toString(36);
    var defs = document.createElementNS(ns, 'defs');
    var clipPath = document.createElementNS(ns, 'clipPath');
    clipPath.setAttribute('id', clipId);
    var clipRect = document.createElementNS(ns, 'rect');
    clipRect.setAttribute('x', '-2');
    clipRect.setAttribute('y', '-50');
    clipRect.setAttribute('width', '0');
    clipRect.setAttribute('height', '200');
    clipPath.appendChild(clipRect);
    defs.appendChild(clipPath);
    svg.appendChild(defs);

    var g = document.createElementNS(ns, 'g');
    g.setAttribute('clip-path', 'url(#' + clipId + ')');

    var pts = sharedPts.pts;
    var ptsStr = sharedPts.ptsStr;

    // Paper fill above the jagged line — same path as makeTearSvg('top')
    var d = 'M 0,0 L 0,' + pts[0][1].toFixed(1);
    pts.forEach(function(p) { d += ' L ' + p[0].toFixed(1) + ',' + p[1].toFixed(1); });
    d += ' L ' + W + ',0 Z';
    var fill = document.createElementNS(ns, 'path');
    fill.setAttribute('d', d);
    fill.setAttribute('fill', '#fdfaf4');
    g.appendChild(fill);

    // Diffuse drop shadow — same Gaussian blur filter as makeTearSvg('top')
    var shadow = document.createElementNS(ns, 'polyline');
    shadow.setAttribute('points', ptsStr);
    shadow.setAttribute('stroke', 'rgba(10,4,0,0.55)');
    shadow.setAttribute('stroke-width', '2');
    shadow.setAttribute('stroke-linecap', 'round');
    shadow.setAttribute('stroke-linejoin', 'round');
    shadow.setAttribute('fill', 'none');
    shadow.setAttribute('filter', 'url(#tear-shadow-soft)');
    shadow.setAttribute('transform', 'translate(0,4)');
    g.appendChild(shadow);

    // Faint tear line — identical to makeTearSvg('top')
    var line = document.createElementNS(ns, 'polyline');
    line.setAttribute('points', ptsStr);
    line.setAttribute('stroke', 'rgba(80,40,15,0.20)');
    line.setAttribute('stroke-width', '0.9');
    line.setAttribute('fill', 'none');
    g.appendChild(line);

    svg.appendChild(g);

    return { svg: svg, clipRect: clipRect, W: W };
  }

  /* ─── Rip panels ─── */

  /*
   * Hand-crafted rip animation keyframes: [time_fraction 0..1, draw_fraction 0..1]
   *
   * Designed to model real paper rip physics:
   *   - Pre-tear silence while tension builds
   *   - A first crack: quick initial tear
   *   - A fiber catch that stalls and reverses slightly
   *   - Three distinct burst events separated by stalls
   *   - A final snap at the end
   *
   * Interpolation between keyframes is linear — the jerkiness is entirely in
   * the keyframe values, not a smoothing function.
   */
  var RIP_KF = [
    [0.000, 0.000],  // ── dead stop ────────────────────────────────────────
    [0.058, 0.000],  // silence: ~28ms of pure tension, nothing moves yet
    [0.092, 0.004],  // the very edge of the paper starts to separate
    [0.130, 0.088],  // first crack — sudden jump, paper splits fast
    [0.172, 0.138],  // momentum carrying through the initial tear
    [0.205, 0.132],  // pullback: a fiber catches and snaps back slightly
    [0.238, 0.128],  // paper is stuck — no progress
    [0.274, 0.131],  // barely creeping forward
    // ── BURST 1 (~150ms into rip) ─────────────────────────────────────────
    [0.312, 0.398],  // sudden: ~27% traveled in 38ms — fast tear
    [0.362, 0.460],  // burst momentum carries it slightly further
    [0.400, 0.444],  // hard stop: dense fiber cluster
    [0.438, 0.446],  // stalled — barely perceptible creep
    [0.480, 0.448],  // still fighting the fiber
    // ── BURST 2 (~230ms into rip) ─────────────────────────────────────────
    [0.524, 0.688],  // fiber gives: 24% in 44ms — the page leaps
    [0.568, 0.728],  // slowing as fiber thickens again
    [0.600, 0.719],  // micro-stall
    [0.638, 0.722],  // slight struggle, barely holding
    // ── BURST 3 (~310ms into rip) ─────────────────────────────────────────
    [0.685, 0.895],  // clean: 17% in 47ms — near the edge now
    [0.732, 0.936],  // momentum still carrying
    [0.768, 0.927],  // last tough spot — final resistance
    [0.808, 0.933],  // just barely moving
    // ── Final snap ────────────────────────────────────────────────────────
    [0.860, 0.974],  // the last fibers give way, all at once
    [0.920, 0.995],  // near-complete
    [0.965, 0.999],  // last fraction
    [1.000, 1.000],  // ── done ──────────────────────────────────────────────
  ];

  function ripProgress(t) {
    t = Math.max(0, Math.min(1, t));
    var kf = RIP_KF;
    for (var i = 0; i < kf.length - 1; i++) {
      if (t <= kf[i + 1][0]) {
        var u = (t - kf[i][0]) / (kf[i + 1][0] - kf[i][0]);
        return kf[i][1] + (kf[i + 1][1] - kf[i][1]) * u;
      }
    }
    return 1;
  }

  /* ─── Toast notification ─── */
  var _toastEl = null;
  var _toastTimer = null;
  function showRipToast(msg) {
    if (!_toastEl) {
      _toastEl = document.createElement('div');
      _toastEl.className = 'rip-toast';
      document.body.appendChild(_toastEl);
    }
    _toastEl.textContent = msg;
    _toastEl.classList.add('visible');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(function() { _toastEl.classList.remove('visible'); }, 1800);
  }

  /* ─── Persistent tear (sibling before panel, height:0, SVG overflows) ───
   * Once a panel has been ripped, it is "always torn". The persistent tear
   * lives as a sibling before the panel regardless of open/closed state.
   * - 'tear' state: bold tear SVG (active rip)
   * - 'scar'  state: faint glued scar SVG (after wax seal) */
  function upsertPersistentTear(panel, state) {
    if (!panel._tearPts) return;
    // Remove any existing persistent tear
    if (panel._persistentTear && panel._persistentTear.parentNode) {
      panel._persistentTear.parentNode.removeChild(panel._persistentTear);
    }
    var div = document.createElement('div');
    div.className = 'rip-persistent-tear';
    div.dataset.state = state;
    var svg = (state === 'scar')
      ? makeGluedLineSvg(panel._tearPts)
      : makeTearSvg('top', panel._tearPts);
    div.appendChild(svg);
    panel.parentNode.insertBefore(div, panel);
    panel._persistentTear = div;
  }

  function openRipPanel(panel, btn) {
    if (panel.dataset.tearing || panel.dataset.gluing) return;
    _animating = true;
    panel.dataset.tearing = '1';
    btn.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');

    /* Guarantee the tear appears between the trigger paragraph and the panel.
     * Move the panel to be the very first element after its trigger <p> —
     * before any glue-wraps, scars, or other open panels that may have
     * accumulated there. This ensures the sweep always lands exactly at the
     * paragraph boundary, regardless of how many panels are already open. */
    var triggerP = btn.closest('p');
    if (triggerP) {
      var afterP = triggerP.nextElementSibling;
      if (afterP && afterP !== panel) {
        panel.parentNode.insertBefore(panel, afterP);
      }
    }

    // Generate tear points on first open. The top tear is rendered as a
    // persistent sibling BEFORE the panel (not inside it), so we skip
    // appending to .rip-edge-top. The bottom edge still uses its inner div.
    if (!panel.dataset.ripReady) {
      panel._tearPts = generateTearPts();
      var botEl = panel.querySelector('.rip-edge-bottom');
      if (botEl) botEl.appendChild(makeTearSvg('bottom'));
      panel.dataset.ripReady = '1';

      var loadKey = panel.dataset.ripLoad;
      if (loadKey && ripLoaders[loadKey]) {
        ripLoaders[loadKey](panel);
        delete ripLoaders[loadKey];
      }
    }

    // Clean up any existing sweep div
    if (panel._sweepDiv && panel._sweepDiv.parentNode) {
      panel._sweepDiv.parentNode.removeChild(panel._sweepDiv);
      panel._sweepDiv = null;
    }

    // Insert sweep SVG before panel (height:0, overflows visually onto panel's top edge)
    var sweepData = makeSweepSvg(panel._tearPts);
    var sweepDiv = document.createElement('div');
    sweepDiv.className = 'rip-sweep-line';
    sweepDiv.appendChild(sweepData.svg);
    panel.parentNode.insertBefore(sweepDiv, panel);
    panel._sweepDiv = sweepDiv;

    /* RAF-driven animation — expands clipRect width via ripProgress().
     * When done, panel opens immediately while sweep fades out over 100ms,
     * bridging the gap between sweep and panel's own top tear edge. */
    var RIP_DURATION = 490; // ms total
    var startTime = null;
    var ripDone = false;

    function onRipComplete() {
      if (ripDone) return;
      ripDone = true;
      _animating = false;

      delete panel.dataset.tearing;

      // Create (or replace) the persistent tear as a sibling before the panel.
      // This is what stays visible whether the panel is open or closed — the
      // physical "once torn, always torn" metaphor. It sits in the natural
      // paragraph gap (height:0 + overflow:visible SVG) with zero layout impact.
      upsertPersistentTear(panel, 'tear');

      // Remove the sweep div on the next frame — the persistent tear is now
      // in place at the same Y, rendering the same SVG, so the transition is
      // seamless (pixel-identical overlap).
      requestAnimationFrame(function() {
        if (panel._sweepDiv && panel._sweepDiv.parentNode) {
          panel._sweepDiv.parentNode.removeChild(panel._sweepDiv);
          panel._sweepDiv = null;
        }
      });

      // Open panel — CSS grid transition starts
      panel.classList.add('open');
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-label', btn.textContent.trim());

      var content = panel.querySelector('.rip-panel-content');
      if (content) { content.setAttribute('tabindex', '-1'); content.focus({ preventScroll: true }); }

      // Inject glue button above the panel's top tear line
      if (!panel._glueWrap) {
        var glueWrap = document.createElement('div');
        glueWrap.className = 'rip-glue-wrap';
        var glueBtn = document.createElement('button');
        glueBtn.className = 'rip-glue-btn';
        /* Wax-drop seal: a teardrop shape with a subtle highlight, evoking a
         * letter sealed with wax — more on-theme than a glue bottle icon. */
        glueBtn.innerHTML =
          '<svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="M9 1 C9 1 2 8 2 13.5 A7 7 0 0 0 16 13.5 C16 8 9 1 9 1Z"' +
          ' fill="#e8d4b0" stroke="#b08040" stroke-width="0.7" stroke-linejoin="round"/>' +
          '<path d="M9 5 C9 5 5 10 5 13 A4 4 0 0 0 8 16.8"' +
          ' stroke="rgba(255,255,255,0.55)" stroke-width="1.1" stroke-linecap="round" fill="none"/>' +
          '</svg>';
        glueBtn.title = 'Seal this panel shut';
        glueWrap.appendChild(glueBtn);

        // Link-copy button sits next to the wax-drop seal icon
        var ripId = btn._ripId || btn.dataset.rip || '';
        if (ripId) {
          glueWrap.appendChild(makeLinkBtn(ripId, showRipToast));
        }

        // Insert the glue wrap as a direct child of `.rip-panel` (NOT
        // inside `.rip-panel-content`). The wrap is `position: absolute`
        // relative to the panel, which has `position: relative` and no
        // overflow clip — so the wrap can sit at the panel's actual right
        // edge (= paper edge) and stays visually fixed as the user scrolls
        // inside `.rip-panel-content` (because `.rip-panel` itself doesn't
        // scroll). When the page scrolls, the panel moves with it, taking
        // the wrap along automatically.
        panel.appendChild(glueWrap);
        panel._glueWrap = glueWrap;
        glueBtn.addEventListener('click', function() {
          panel._glueWrap = null;
          gluePanel(panel, btn, glueWrap);
        });
      }

    }

    function animateRip(now) {
      if (startTime === null) startTime = now;
      var elapsed = now - startTime;
      var t = Math.min(elapsed / RIP_DURATION, 1);

      // Expand clip rect left-to-right, revealing the tear profile
      sweepData.clipRect.setAttribute('width', String(ripProgress(t) * (sweepData.W + 2)));

      if (t < 1) {
        requestAnimationFrame(animateRip);
      } else {
        onRipComplete();
      }
    }

    if (_reducedMotion) {
      onRipComplete();
    } else {
      requestAnimationFrame(animateRip);
    }
  }

  function closeRipPanel(panel, btn) {
    if (panel.dataset.tearing || panel.dataset.gluing) return;
    panel.classList.add('closing');
    panel.classList.remove('open');
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
    btn.focus({ preventScroll: true });
    if (panel._glueWrap && panel._glueWrap.parentNode) {
      panel._glueWrap.parentNode.removeChild(panel._glueWrap);
      panel._glueWrap = null;
    }
    // Keep the cream strip (via .closing class) visible during the 520ms
    // grid collapse, so the cream follows the tear shape until the very end.
    setTimeout(function() { panel.classList.remove('closing'); }, 560);
    // The persistent tear stays — once torn, always torn.
  }

  /* ─── Glue: close panel and leave a faint tear scar ─── */

  function makeGluedLineSvg(pts) {
    /* The glued/scar state — just a hair-thin dashed line. NO shadow:
     * once the paper is sealed shut, there's nothing physically casting a
     * shadow. The line itself is the only mark left. */
    var W = 600, H = 26;
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.cssText = 'display:block;width:100%;height:' + H + 'px;overflow:visible;';
    var ptsStr = pts.ptsStr;
    var line = document.createElementNS(ns, 'polyline');
    line.setAttribute('points', ptsStr);
    line.setAttribute('stroke', 'rgba(90,50,20,0.20)');
    line.setAttribute('stroke-width', '1.1');
    line.setAttribute('stroke-dasharray', '6 3 2 4 8 2');
    line.setAttribute('fill', 'none');
    svg.appendChild(line);
    return svg;
  }

  function makeBoldTearSvg(pts) {
    /* A bold version of the tear line — same profile but with a thicker, darker
     * stroke — used as the top layer during the glue animation before it's
     * wiped away left-to-right to reveal the faint scar beneath. */
    var W = 600, H = 26;
    var ns = 'http://www.w3.org/2000/svg';
    var clipId = 'seal-clip-' + Math.random().toString(36).slice(2);
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.cssText = 'display:block;width:100%;height:' + H + 'px;overflow:visible;position:absolute;top:0;left:0;';

    var defs = document.createElementNS(ns, 'defs');
    var clipPath = document.createElementNS(ns, 'clipPath');
    clipPath.setAttribute('id', clipId);
    var clipRect = document.createElementNS(ns, 'rect');
    clipRect.setAttribute('x', '0');
    clipRect.setAttribute('y', '-4');
    clipRect.setAttribute('width', String(W + 2));
    clipRect.setAttribute('height', String(H + 8));
    clipPath.appendChild(clipRect);
    defs.appendChild(clipPath);
    svg.appendChild(defs);

    var ptsStr = pts.ptsStr;
    var g = document.createElementNS(ns, 'g');
    g.setAttribute('clip-path', 'url(#' + clipId + ')');
    // Shadow line
    var shadow = document.createElementNS(ns, 'polyline');
    shadow.setAttribute('points', ptsStr);
    shadow.setAttribute('stroke', 'rgba(30,10,2,0.18)');
    shadow.setAttribute('stroke-width', '3');
    shadow.setAttribute('fill', 'none');
    shadow.setAttribute('transform', 'translate(0,1.5)');
    g.appendChild(shadow);
    // Bold tear line
    var line = document.createElementNS(ns, 'polyline');
    line.setAttribute('points', ptsStr);
    line.setAttribute('stroke', 'rgba(80,40,10,0.55)');
    line.setAttribute('stroke-width', '1.4');
    line.setAttribute('fill', 'none');
    g.appendChild(line);
    svg.appendChild(g);
    return { svg: svg, clipRect: clipRect, W: W };
  }

  function gluePanel(panel, btn, glueWrap) {
    if (panel.dataset.gluing) return;
    _animating = true;
    panel.dataset.gluing = '1';

    // Remove glue button immediately
    if (glueWrap && glueWrap.parentNode) glueWrap.parentNode.removeChild(glueWrap);

    /* Gluing animation (two-phase):
     *  Phase 1 — panel closes via CSS grid transition (~520ms).
     *  Phase 2 — a left-to-right wipe transforms the existing persistent
     *  tear (bold) into a faint scar, then updates panel._persistentTear
     *  to the scar state. Both states live at the same Y as height:0
     *  siblings before the panel — zero layout impact. */

    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
    panel.classList.add('closing');
    panel.classList.remove('open');

    function finishGlue() {
      upsertPersistentTear(panel, 'scar');
      delete panel.dataset.gluing;
      _animating = false;
      btn.focus({ preventScroll: true });
    }

    if (_reducedMotion) {
      finishGlue();
      return;
    }

    var CSS_CLOSE_MS = 540; // matches the CSS grid transition duration
    var WIPE_DURATION = 840; // 2× slower — more ceremonial sealing feel

    setTimeout(function() {
      // The panel has now fully collapsed — the two torn edges have come
      // together. Remove the cream strip immediately, BEFORE the wipe
      // animation runs. This avoids the cream lingering for a full extra
      // second while the wipe plays on a collapsed panel.
      panel.classList.remove('closing');

      if (!panel._tearPts) {
        finishGlue();
        return;
      }

      // Replace the bold persistent tear with a two-layer wipe element
      // (scar beneath, bold on top). The bold clips away left-to-right,
      // revealing the scar — both at the same Y as the persistent tear.
      if (panel._persistentTear && panel._persistentTear.parentNode) {
        panel._persistentTear.parentNode.removeChild(panel._persistentTear);
        panel._persistentTear = null;
      }

      var wipeWrap = document.createElement('div');
      wipeWrap.className = 'rip-persistent-tear';
      wipeWrap.style.height = '0';
      wipeWrap.style.overflow = 'visible';
      wipeWrap.style.pointerEvents = 'none';
      wipeWrap.style.position = 'relative';

      // Bottom layer: faint scar (visible from the start)
      wipeWrap.appendChild(makeGluedLineSvg(panel._tearPts));

      // Top layer: bold tear (wipes away left-to-right)
      var boldData = makeBoldTearSvg(panel._tearPts);
      wipeWrap.appendChild(boldData.svg);

      panel.parentNode.insertBefore(wipeWrap, panel);

      var wipeStart = null;
      function animateWipe(now) {
        if (wipeStart === null) wipeStart = now;
        var t = Math.min((now - wipeStart) / WIPE_DURATION, 1);
        var ease = 1 - (1 - t) * (1 - t);
        var x = ease * (boldData.W + 2);
        var w = Math.max(0, (boldData.W + 2) - x);
        boldData.clipRect.setAttribute('x', String(x));
        boldData.clipRect.setAttribute('width', String(w));

        if (t < 1) {
          requestAnimationFrame(animateWipe);
        } else {
          if (wipeWrap.parentNode) wipeWrap.parentNode.removeChild(wipeWrap);
          finishGlue();
        }
      }
      requestAnimationFrame(animateWipe);
    }, CSS_CLOSE_MS);
  }

  /* ─── Rip lazy loaders ─── */

  function loadRipQuotes(panel) {
    var container = panel.querySelector('#rip-quotes-list');
    if (!container) return;
    fetch('/assets/json/me-like-quotes.json')
      .then(function(r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(data) {
        var categories = data.categories || [];
        container.innerHTML = '';
        container.style.position = 'relative';

        // Build categorized quote list
        categories.forEach(function(cat, i) {
          var slug = 'rip-q-cat-' + i;
          var catEl = document.createElement('div');
          catEl.className = 'quotes-category';
          catEl.id = slug;
          var titleEl = document.createElement('div');
          titleEl.className = 'quotes-category-title';
          titleEl.textContent = cat.title;
          catEl.appendChild(titleEl);
          if (cat.description) {
            var descEl = document.createElement('div');
            descEl.className = 'quotes-category-desc';
            descEl.textContent = cat.description;
            catEl.appendChild(descEl);
          }
          var qul = document.createElement('ul');
          qul.className = 'quotes-category-list';
          (cat.quotes || []).forEach(function(q) {
            var li = document.createElement('li');
            li.className = 'quote-item';
            li.innerHTML = '<div class="quote-text">\u201c' + q.text + '\u201d</div>' +
                           '<div class="quote-author">\u2014 ' + q.author + '</div>';
            qul.appendChild(li);
          });
          catEl.appendChild(qul);
          container.appendChild(catEl);
        });
      })
      .catch(function() {
        container.innerHTML = '<li class="loading-text">Could not load quotes.</li>';
      });
  }

  function loadRipArticles(panel) {
    var container = panel.querySelector('#rip-articles-list');
    if (!container) return;
    fetch('/assets/json/me-like-articles.json')
      .then(function(r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(data) {
        var categories = (data.categories || []).filter(function(c) { return c.papers && c.papers.length; });
        container.innerHTML = '';

        categories.forEach(function(cat, i) {
          var slug = 'rip-a-cat-' + i;
          var sec = document.createElement('div');
          sec.className = 'articles-category';
          sec.id = slug;
          var title = document.createElement('div');
          title.className = 'articles-category-title';
          title.textContent = cat.title;
          sec.appendChild(title);
          cat.papers.forEach(function(item) {
            var el = document.createElement('div');
            el.className = 'article-item';
            var meta = [item.authors, item.year].filter(Boolean).join(', ');
            el.innerHTML =
              '<div class="article-item-title"><a href="' + item.link + '" target="_blank" rel="noopener noreferrer">' + item.title + '</a></div>' +
              (meta ? '<div class="article-item-meta">' + meta + '</div>' : '');
            sec.appendChild(el);
          });
          container.appendChild(sec);
        });
      })
      .catch(function() {
        container.innerHTML = '<div class="loading-text">Could not load articles.</div>';
      });
  }

  function loadRipFullWork(panel) {
    var csContainer   = panel.querySelector('#rip-cs-papers');
    var philContainer = panel.querySelector('#rip-phil-papers');
    var csLoading     = panel.querySelector('#rip-cs-loading');

    function renderPapers(papers, container) {
      container.innerHTML = '';
      papers.forEach(function(p) {
        var authors = (p.authors || []).map(function(a) {
          return a.includes('Andre Ye') ? '<strong>' + a + '</strong>' : a;
        }).join(', ');
        var links = '';
        if (p.paper_link) links += '<a href="' + p.paper_link + '" target="_blank" rel="noopener noreferrer">paper</a>';
        if (p.slides_link) links += '<a href="' + p.slides_link + '" target="_blank" rel="noopener noreferrer">slides</a>';
        var award = p.award ? '<div class="paper-item-award">' + p.award + '</div>' : '';
        var li = document.createElement('li');
        li.innerHTML =
          '<div class="paper-item-title"><a href="' + (p.paper_link || '#') + '" target="_blank" rel="noopener noreferrer">' + p.title + '</a></div>' +
          '<div class="paper-item-authors">' + authors + '</div>' +
          '<div class="paper-item-venue">' + (p.conference_full || '') + (p.conference_abbrev ? ' (' + p.conference_abbrev + ')' : '') + (p.conference_year ? ' ' + p.conference_year : '') + '</div>' +
          award +
          (links ? '<div class="paper-item-links">' + links + '</div>' : '');
        container.appendChild(li);
      });
    }

    if (csContainer) {
      fetch('/assets/json/cs_papers.json')
        .then(function(r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function(papers) {
          if (csLoading) csLoading.style.display = 'none';
          renderPapers(papers, csContainer);
        })
        .catch(function() {
          if (csLoading) csLoading.textContent = 'Could not load papers.';
        });
    }

    if (philContainer) {
      fetch('/assets/json/philosophy_papers.json')
        .then(function(r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function(papers) { renderPapers(papers, philContainer); })
        .catch(function() {
          philContainer.innerHTML = '<li class="loading-text">Could not load papers.</li>';
        });
    }
  }

  function loadRipHistory(panel) {
    var container = panel.querySelector('#rip-history-list');
    if (!container) return;
    fetch('/assets/json/history.json')
      .then(function(r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(events) {
        var sorted = events.slice().sort(function(a, b) { return a.start - b.start; });
        container.innerHTML = '';
        var intro = document.createElement('p');
        intro.style.cssText = 'font-size:0.88rem;color:#7a5a30;font-style:italic;margin-bottom:1rem;';
        intro.textContent = 'A flat list of historical events, stripped of grouping—to force unexpected juxtapositions.';
        container.appendChild(intro);
        // Use CSS grid so the year and description live in their own columns:
        // year column is fixed-width, description column flexes and wraps
        // independently (no bleeding into the year column).
        var ul = document.createElement('ul');
        ul.style.cssText = 'list-style:none;padding:0;margin:0;font-size:0.88rem;line-height:1.7;color:#2d1e0e;';
        sorted.forEach(function(ev) {
          var li = document.createElement('li');
          li.style.cssText = 'display:grid;grid-template-columns:7rem 1fr;column-gap:0.6rem;align-items:start;padding:0.28rem 0;border-bottom:1px solid rgba(120,70,20,0.08);';
          var yr = ev.start === ev.end
            ? (ev.start < 0 ? Math.abs(ev.start) + ' BCE' : ev.start + ' CE')
            : (ev.start < 0 ? Math.abs(ev.start) + '\u2013' + (ev.end < 0 ? Math.abs(ev.end) + ' BCE' : ev.end + ' CE') : ev.start + '\u2013' + ev.end + ' CE');
          li.innerHTML =
            '<span style="font-variant-numeric:tabular-nums;color:#7a5a30;font-size:0.82rem;">' + yr + '</span>' +
            '<span>' + ev.event + '</span>';
          ul.appendChild(li);
        });
        container.appendChild(ul);
      })
      .catch(function() {
        container.innerHTML = '<div class="loading-text">Could not load history.</div>';
      });
  }

  /* Lazy-load MathJax once. Returns a promise that resolves when MathJax is
   * ready (or immediately if already loaded). Used by loadRipMath to render
   * LaTeX inside the math panel without bloating the initial page load. */
  var _mathjaxPromise = null;
  function ensureMathJax() {
    if (_mathjaxPromise) return _mathjaxPromise;
    _mathjaxPromise = new Promise(function(resolve) {
      if (window.MathJax && window.MathJax.typesetPromise) { resolve(); return; }
      window.MathJax = window.MathJax || {
        tex: {
          inlineMath: [['$$', '$$']],
          displayMath: [['\\[', '\\]']],
          processEscapes: true
        },
        startup: { typeset: false }
      };
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      script.async = true;
      script.onload = function() {
        // Wait until MathJax has finished initialising
        var check = function() {
          if (window.MathJax && window.MathJax.typesetPromise) resolve();
          else setTimeout(check, 50);
        };
        check();
      };
      document.head.appendChild(script);
    });
    return _mathjaxPromise;
  }

  function loadRipMath(panel) {
    var container = panel.querySelector('#rip-math-list');
    if (!container) return;
    fetch('/assets/json/math-theorems.json')
      .then(function(r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(data) {
        container.innerHTML = '';

        var intro = document.createElement('p');
        intro.style.cssText = 'font-size:0.88rem;color:#7a5a30;font-style:italic;margin-bottom:1rem;line-height:1.55;';
        intro.innerHTML = data.intro || '';
        container.appendChild(intro);

        (data.items || []).forEach(function(item) {
          var div = document.createElement('div');
          div.style.cssText = 'margin-bottom:1.1rem;padding-bottom:0.9rem;border-bottom:1px solid rgba(120,70,20,0.10);';
          div.innerHTML =
            '<div style="font-weight:600;color:#2a1a08;margin-bottom:0.3rem;font-size:0.95rem;">' + item.name + '</div>' +
            '<div style="font-size:0.88rem;color:#3a2210;line-height:1.65;">' + item.body + '</div>';
          container.appendChild(div);
        });

        if (data.quotes && data.quotes.length) {
          var qHeader = document.createElement('div');
          qHeader.style.cssText = 'margin-top:1.5rem;margin-bottom:0.6rem;font-weight:600;color:#5a3a18;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.04em;';
          qHeader.textContent = 'Quotes';
          container.appendChild(qHeader);
          data.quotes.forEach(function(q) {
            var qDiv = document.createElement('div');
            qDiv.style.cssText = 'margin-bottom:0.9rem;font-size:0.86rem;color:#3a2210;line-height:1.6;';
            qDiv.innerHTML = '<div style="font-style:italic;">\u201c' + q.text + '\u201d</div>' +
                             '<div style="color:#7a5a30;font-size:0.8rem;margin-top:0.2rem;">\u2014 ' + q.author + '</div>';
            container.appendChild(qDiv);
          });
        }

        // Lazy-load MathJax and typeset the panel content
        ensureMathJax().then(function() {
          if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise([container]).catch(function() {});
          }
        });
      })
      .catch(function() {
        container.innerHTML = '<div class="loading-text">Could not load math content.</div>';
      });
  }

  var ripLoaders = {
    'quotes':    loadRipQuotes,
    'articles':  loadRipArticles,
    'full-work': loadRipFullWork,
    'history':   loadRipHistory,
    'math':      loadRipMath,
  };

  // Very muted orange-to-purple palette — low saturation watercolor washes
  var BRUSH_PALETTE = [
    '#d4c8ae', // barely-amber
    '#c8b8c2', // barely-rose
    '#bcbacb', // barely-lavender
    '#cec0b8', // barely-terracotta
    '#c4bdd0', // barely-violet
    '#d0c5a8', // barely-gold
    '#c8b8c5', // barely-mauve
    '#b8bece', // barely-periwinkle
    '#cec2b8', // barely-sandy
    '#c2bccb', // barely-purple
    '#d0c0b4', // barely-peach
    '#b8bcd0', // barely-indigo
  ];

  function darkenHex(hex, amt) {
    var r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    r = Math.max(0, Math.round(r*(1-amt))); g = Math.max(0, Math.round(g*(1-amt))); b = Math.max(0, Math.round(b*(1-amt)));
    return '#' + [r,g,b].map(function(v){return v.toString(16).padStart(2,'0');}).join('');
  }

  /* Three genuinely distinct brush strokes per link highlight.
   * Each has its own SVG filter, horizontal extent, border-radius, and skew
   * so they look like separate physical brush marks rather than the same
   * rectangle shifted around.
   *
   * Fields: { top, bottom, left, right, opacity, skew, filter, radius }
   *
   *  main  — #brush-main  — tight mid-weight centre band, moderate displacement
   *  wide  — #brush-wide  — low-frequency wide smear, bleeds out asymmetrically
   *  dry   — #brush-dry   — high-frequency dry/scratchy upper ghost, hairier edges
   */
  /* Layered brush strokes — each stroke is a horizontally-offset, vertically-
   * shifted band over the text. The combination of distinct opacities,
   * filters, skews, and offsets gives the highlight visible texture as if
   * three separate brushstrokes were laid down at slightly different angles.
   *
   * Two schemas coexist:
   *   - Legacy em-based (top/bottom/left/right) used by injectBrushStrokes
   *     for .brushed-text and .paper-hero-name (children of inline elements)
   *   - Pixel-based (dxLeft/dxRight/dyTop/dyBottom) used by applyRipBrushes
   *     for .rip-btn (paragraph-anchored, multi-line capable)
   * Both fields are present so the same stroke definition feeds both paths.
   */
  var LINK_BRUSH_STROKES = [
    // main: thin centre band — visible but doesn't drown out the other layers
    { top: '0.62em', bottom: '0.56em', left: '-0.08em', right: '-0.10em',
      dxLeft: -3, dxRight: -2, dyTop: 8, dyBottom: 1,
      opacity: 0.40, skew:  0,   filter: 'url(#brush-main)',  radius: '2px 3px' },
    // wide smear: wider, lower, very faint — sweeping ghost layer
    { top: '0.28em', bottom: '0.02em', left: '-0.22em', right: '-0.28em',
      dxLeft: -5, dxRight: -6, dyTop: 1, dyBottom: 1,
      opacity: 0.20, skew:  2.4, filter: 'url(#brush-wide)',  radius: '4px 2px' },
    // dry ghost: tighter, sits higher, very faint texture
    { top: '0.05em', bottom: '0.22em', left: '-0.16em', right: '-0.06em',
      dxLeft: -2, dxRight: -1, dyTop: -2, dyBottom: 7,
      opacity: 0.10, skew: -2.0, filter: 'url(#brush-dry)',   radius: '1px 4px' },
  ];

  /* Legacy: inject brush strokes directly into an inline container as
   * absolutely-positioned children using em offsets. Only used for
   * non-.rip-btn elements (e.g. .brushed-text, .paper-hero-name). */
  function injectBrushStrokes(container, color, hoverColor) {
    LINK_BRUSH_STROKES.forEach(function(s) {
      var brush = document.createElement('span');
      brush.className = 'rip-brush';
      brush.style.top          = s.top;
      brush.style.bottom       = s.bottom;
      brush.style.left         = s.left;
      brush.style.right        = s.right;
      brush.style.opacity      = String(s.opacity);
      brush.style.filter       = s.filter;
      brush.style.borderRadius = s.radius;
      if (s.skew) brush.style.transform = 'skewX(' + s.skew + 'deg)';
      container.insertBefore(brush, container.firstChild);
    });
    container.style.setProperty('--brush-col',       color);
    container.style.setProperty('--brush-hover-col', hoverColor);
  }

  /* Apply brush highlights to all .rip-btn elements.
   *
   * Strategy: for each rip-btn, use a Range over its text content to get
   * per-line client rects, then create brush spans as absolutely-positioned
   * children of the button's parent paragraph (a block-level positioned
   * element with predictable absolute-positioning semantics). This way:
   *   - Multi-line buttons get per-line brush strokes (each line rect gets
   *     its own set of brushes).
   *   - No weird inline-element containing-block quirks.
   *   - Brush width matches the text exactly (no full-word overshoot).
   *
   * Called initially via requestAnimationFrame after initRipButtons, and
   * again on window resize (debounced). Hover state is tracked in JS since
   * brushes no longer live inside the button. */
  function applyRipBrushes() {
    document.querySelectorAll('.rip-btn').forEach(function(btn) {
      // Remove any existing brushes owned by this button
      if (btn._brushes) {
        btn._brushes.forEach(function(b) {
          if (b.parentNode) b.parentNode.removeChild(b);
        });
      }
      btn._brushes = [];

      var p = btn.closest('p');
      if (!p) return; // need a paragraph as positioning root

      var color = btn._brushColor;
      if (!color) return;
      var hoverColor = darkenHex(color, 0.22);

      // Use a Range over the button's text to get per-line rects
      var range = document.createRange();
      range.selectNodeContents(btn);
      var rects = range.getClientRects();

      // Merge rects with the same top coordinate into line groups
      var lines = [];
      for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        if (r.height < 2 || r.width < 1) continue;
        var merged = false;
        for (var j = 0; j < lines.length; j++) {
          if (Math.abs(r.top - lines[j].top) < 4) {
            lines[j].left  = Math.min(lines[j].left,  r.left);
            lines[j].right = Math.max(lines[j].right, r.right);
            lines[j].width = lines[j].right - lines[j].left;
            merged = true;
            break;
          }
        }
        if (!merged) {
          lines.push({ top: r.top, left: r.left, right: r.right, width: r.width, height: r.height });
        }
      }
      if (lines.length === 0) return;

      var pRect = p.getBoundingClientRect();

      // For each line of the button's text, create a set of brush spans.
      // Each stroke has its own offset so the layers are visibly distinct
      // (different vertical bands, slightly different widths) — restoring
      // the layered hand-drawn brush look.
      lines.forEach(function(line) {
        LINK_BRUSH_STROKES.forEach(function(s) {
          var brush = document.createElement('span');
          brush.className = 'rip-brush rip-brush-anchored';
          brush.style.position     = 'absolute';
          brush.style.left         = (line.left - pRect.left + s.dxLeft) + 'px';
          brush.style.top          = (line.top  - pRect.top  + s.dyTop) + 'px';
          brush.style.width        = (line.width - s.dxLeft - s.dxRight) + 'px';
          brush.style.height       = Math.max(4, line.height - s.dyTop - s.dyBottom) + 'px';
          brush.style.opacity      = String(s.opacity);
          brush.style.filter       = s.filter;
          brush.style.borderRadius = s.radius;
          brush.style.setProperty('--brush-col',       color);
          brush.style.setProperty('--brush-hover-col', hoverColor);
          if (s.skew) brush.style.transform = 'skewX(' + s.skew + 'deg)';
          p.appendChild(brush);
          btn._brushes.push(brush);
        });
      });
    });
  }

  /* Back-compat alias used by the bootstrap code */
  function fixMultiLineBrushes() { applyRipBrushes(); }

  function makeLinkBtn(ripId, showToastFn) {
    var linkBtn = document.createElement('button');
    linkBtn.className = 'rip-link-btn';
    linkBtn.title = 'Copy link to this section';
    linkBtn.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M9 13 L13 9" stroke="#5a2a0a" stroke-width="1.6" stroke-linecap="round"/>' +
      '<path d="M6 9.5 L3.6 11.8 A4.2 4.2 0 0 0 9.6 17.8 L12 15.4" stroke="#5a2a0a" stroke-width="1.6" stroke-linecap="round" fill="none"/>' +
      '<path d="M10.6 6 L13 3.6 A4.2 4.2 0 0 1 19 9.6 L16.6 12" stroke="#5a2a0a" stroke-width="1.6" stroke-linecap="round" fill="none"/>' +
      '</svg>';
    linkBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var url = window.location.origin + window.location.pathname + '#rip-' + ripId;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function() { showToastFn('Link copied'); });
      } else {
        var ta = document.createElement('textarea');
        ta.value = url;
        ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); showToastFn('Link copied'); } catch(ex) {}
        document.body.removeChild(ta);
      }
    });
    return linkBtn;
  }

  function initRipButtons() {
    var _canHover = window.matchMedia('(hover: hover)').matches;
    document.querySelectorAll('.rip-btn').forEach(function(btn, i) {
      var color = BRUSH_PALETTE[i % BRUSH_PALETTE.length];
      btn._brushColor = color;
      btn._ripId = btn.dataset.rip;
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', 'rip-' + btn.dataset.rip);

      // Hover handling: brushes live in the parent paragraph (applied via
      // applyRipBrushes), so toggle hover state in JS rather than CSS.
      if (_canHover) {
        btn.addEventListener('mouseenter', function() {
          if (btn._brushes) btn._brushes.forEach(function(b) { b.classList.add('hover'); });
        });
        btn.addEventListener('mouseleave', function() {
          if (btn._brushes) btn._brushes.forEach(function(b) { b.classList.remove('hover'); });
        });
      }

      btn.addEventListener('click', function() {
        if (_animating) return;
        var ripId = btn.dataset.rip;
        if (!ripId) return;
        var panel = document.getElementById('rip-' + ripId);
        if (!panel) return;
        if (panel.classList.contains('open')) {
          // Clicking the trigger again seals the panel shut (same as the
          // wax-seal button). Once torn, you can either keep reading or
          // glue it back — there's no "just close without sealing".
          var existingGlueWrap = panel._glueWrap;
          panel._glueWrap = null;
          gluePanel(panel, btn, existingGlueWrap);
        } else {
          openRipPanel(panel, btn);
        }
      });
    });


    // Auto-open panel if URL hash matches a rip panel id
    var hash = window.location.hash;
    if (hash && hash.length > 1) {
      var targetPanel = document.getElementById(hash.slice(1));
      if (targetPanel && targetPanel.classList.contains('rip-panel')) {
        var triggerBtn = document.querySelector('[data-rip="' + hash.slice(5) + '"]');
        if (triggerBtn) {
          setTimeout(function() {
            triggerBtn.click();
            setTimeout(function() { targetPanel.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300);
          }, 200);
        }
      }
    }

    // Inject multi-stroke brush highlight on static brushed-text spans
    document.querySelectorAll('.brushed-text').forEach(function(el, i) {
      var color = BRUSH_PALETTE[(document.querySelectorAll('.rip-btn').length + i) % BRUSH_PALETTE.length];
      injectBrushStrokes(el, color, darkenHex(color, 0.18));
    });

    // Inject three distinct brush strokes over the name — same filter system as links
    var nameEl = document.querySelector('.paper-hero-name');
    if (nameEl) {
      var nameStrokes = [
        // main: bold centre band, brush-main filter
        { top: '0.12em', bottom: '0.08em', left: '-0.22em', right: '-0.22em',
          opacity: '0.88', filter: 'url(#brush-main)', baseTransform: 'skewX(-1.2deg) scaleX(1.01)', radius: '2px 3px' },
        // wide smear: low-freq sweeping distortion, bleeds further
        { top: '0.30em', bottom: '-0.04em', left: '-0.38em', right: '-0.35em',
          opacity: '0.32', filter: 'url(#brush-wide)', baseTransform: 'skewX(1.8deg) scaleX(0.98)', radius: '5px 3px' },
        // dry ghost: high-freq hairy edges, narrower, sits higher
        { top: '0.02em', bottom: '0.26em', left: '-0.28em', right: '-0.18em',
          opacity: '0.22', filter: 'url(#brush-dry)', baseTransform: 'skewX(-2.5deg) scaleX(1.02)', radius: '1px 4px' },
      ];
      var nameBrushes = [];
      nameStrokes.forEach(function(s, idx) {
        var brush = document.createElement('span');
        brush.className = 'name-brush';
        brush.style.background = '#c87878';
        brush.style.top    = s.top;
        brush.style.bottom = s.bottom;
        brush.style.left   = s.left;
        brush.style.right  = s.right;
        brush.style.opacity = s.opacity;
        brush.style.filter  = s.filter;
        brush.style.borderRadius = s.radius;
        brush.style.transform = s.baseTransform;
        brush._baseTransform = s.baseTransform;
        brush._phase = idx * 2.3; // stagger the jitter across brushes
        nameEl.insertBefore(brush, nameEl.firstChild);
        nameBrushes.push(brush);
      });

      /* Nervous-energy jitter: each brush wiggles independently with
       * sub-pixel translation and a tiny rotation. Z-index rotates
       * through permutations so the stacking order subtly swaps over
       * time. Motion is intentionally tiny (<1.5px) so it reads as
       * creative tension, not seasickness. Respects reduced-motion.
       *
       * The jitter tick is folded into the main throttled RAF loop
       * (see startMainLoop) running at ~30fps. A reference to the
       * tick is exposed via _nameJitterTick for the init code to pick
       * up and push into the ticks array. */
      if (!_reducedMotion && nameBrushes.length && window.innerWidth >= 740) {
        var jitterStart = null;
        // Precompute z-index permutations the brushes cycle through
        var zPerms = [[1, 2, 3], [2, 3, 1], [3, 1, 2], [1, 3, 2], [2, 1, 3], [3, 2, 1]];
        var lastPermIdx = -1;
        window._nameJitterTick = function jitter(now) {
          if (jitterStart === null) jitterStart = now;
          var t = (now - jitterStart) / 1000; // seconds
          nameBrushes.forEach(function(b, i) {
            var ph = b._phase;
            // Two overlaid sine waves at incommensurate frequencies → organic motion
            var tx = Math.sin(t * 3.1 + ph) * 0.9 + Math.sin(t * 7.3 + ph * 1.7) * 0.4;
            var ty = Math.cos(t * 2.7 + ph * 1.3) * 0.7 + Math.cos(t * 5.9 + ph) * 0.3;
            var tr = Math.sin(t * 1.9 + ph) * 0.35; // small rotation in degrees
            b.style.transform = b._baseTransform + ' translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px) rotate(' + tr.toFixed(2) + 'deg)';
          });
          // Swap z-indices every ~2.2s (step through permutations)
          var permIdx = Math.floor(t / 2.2) % zPerms.length;
          if (permIdx !== lastPermIdx) {
            lastPermIdx = permIdx;
            var perm = zPerms[permIdx];
            nameBrushes.forEach(function(b, i) { b.style.zIndex = String(perm[i] || 1); });
          }
        };
      }
    }
  }

  /* ─── Photo toggle ─── */

  function initPhotoToggle() {
    var btn   = document.getElementById('photo-toggle');
    var panel = document.getElementById('photo-panel');
    if (!btn || !panel) return;
    btn.addEventListener('click', function() {
      var open = panel.classList.toggle('open');
      btn.classList.toggle('active', open);
      btn.setAttribute('title', open ? 'Hide photo' : 'Show photo');
    });
  }

  /* ─── Better Images of AI: deterministic daily picker (EST) ─── */
  function initBetterAIofTheDay() {
    var img = document.getElementById('better-ai-of-the-day-img');
    if (!img) return;
    fetch('/assets/json/better-ai-imgs.json')
      .then(function(r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(list) {
        if (!list || !list.length) return;
        // Today's date in America/New_York — same image for the whole EST day.
        var dateStr;
        try {
          var fmt = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/New_York',
            year: 'numeric', month: '2-digit', day: '2-digit'
          });
          dateStr = fmt.format(new Date());
        } catch (e) {
          dateStr = new Date().toISOString().slice(0, 10);
        }
        // Deterministic hash → index.
        var hash = 0;
        for (var i = 0; i < dateStr.length; i++) {
          hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
        }
        var pick = list[hash % list.length];
        img.src = '/assets/better-ai-imgs/' + encodeURIComponent(pick);
        img.alt = 'Better Image of AI: ' + pick.replace(/\.(png|jpe?g)$/i, '');
      })
      .catch(function() { /* silent fail */ });
  }

  /* ─── Single merged RAF loop (with per-tick throttling) ─── */
  function startMainLoop(ticks) {
    if (!ticks.length) return;
    var t0 = performance.now();

    // Accept either raw functions (back-compat) or {fn, interval} objects.
    // Each tick tracks its own lastNow so dt is measured between its own
    // invocations rather than between frames.
    var scheduledTicks = ticks.map(function (t) {
      if (typeof t === 'function') {
        return { fn: t, interval: 16.7, last: 0, lastNow: 0 };
      }
      return { fn: t.fn, interval: t.interval || 16.7, last: 0, lastNow: 0 };
    });

    // rafId guards against duplicate RAF chains. The visibilitychange
    // handler can fire spuriously (e.g. on bfcache restore), and without
    // a guard each fire would start a new concurrent frame loop.
    var rafId = null;

    function frame(now) {
      if (document.hidden) { rafId = null; return; }
      var tSec = (now - t0) / 1000;
      for (var i = 0; i < scheduledTicks.length; i++) {
        var s = scheduledTicks[i];
        if (now - s.last >= s.interval) {
          // Clamp dt to 0.1s — generous enough for the slowest tick
          // (flutter @ 55ms = 0.055s) without amplifying long pauses.
          var dt = s.lastNow ? Math.min((now - s.lastNow) / 1000, 0.1) : 0.016;
          s.lastNow = now;
          s.last = now;
          s.fn(now, dt, tSec);
        }
      }
      rafId = requestAnimationFrame(frame);
    }

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && rafId === null) {
        for (var i = 0; i < scheduledTicks.length; i++) {
          scheduledTicks[i].lastNow = 0;
        }
        rafId = requestAnimationFrame(frame);
      }
    });

    rafId = requestAnimationFrame(frame);
  }

  /* ─── Init ─── */
  document.addEventListener('DOMContentLoaded', function () {
    var ticks = [];

    var bgTick = initStickyNoteBg();
    if (bgTick) ticks.push({ fn: bgTick, interval: 33 });

    initFolds();
    initLazyLoaders();
    initRipButtons();
    /* Brush positioning depends on the actual rendered text metrics.
     * EB Garamond loads asynchronously: if we compute brush rects before
     * the font has loaded, they'll be measured against the fallback font
     * and end up misaligned once it kicks in.
     *
     * We rely on document.fonts.ready (the real "fonts loaded" signal)
     * and a debounced resize listener. Fallback: if document.fonts is
     * unavailable, a single rAF pass. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function() {
        fixMultiLineBrushes();
      });
    } else {
      requestAnimationFrame(fixMultiLineBrushes);
    }
    var _resizeTimer = null;
    window.addEventListener('resize', function() {
      clearTimeout(_resizeTimer);
      _resizeTimer = setTimeout(fixMultiLineBrushes, 400);
    });
    initPhotoToggle();
    initBetterAIofTheDay();

    if (window.innerWidth > 740) {
      var flutterTick = initPaperFlutter();
      if (flutterTick) ticks.push({ fn: flutterTick, interval: 55 });
    }

    var scrapsTick = initFallingPapers();
    if (scrapsTick) ticks.push({ fn: scrapsTick, interval: 33 });

    // Name-brush jitter tick — exposed by initRipButtons as _nameJitterTick.
    if (window._nameJitterTick) {
      ticks.push({ fn: window._nameJitterTick, interval: 33 });
    }

    startMainLoop(ticks);
  });

})();
