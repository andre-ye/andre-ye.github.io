# Codebase improvements (no visual change)

**Audience:** Professional web design / front-end review  
**Scope:** Jekyll site (al-folio–style). Improvements are semantic, accessibility, performance, security, and maintainability only — no intentional change to appearance.

---

## 1. Accessibility (a11y)

### 1.1 External links: `rel="noopener noreferrer"`

**Where:** All links with `target="_blank"` across `_layouts/`, `_includes/`, `_pages/`, `misc/`, `404.html`.

**Why:**  
- **Security:** Without `rel="noopener"`, the new tab can access `window.opener` and can redirect the opener (tab-napping).  
- **Best practice:** `noreferrer` also avoids sending Referer and is recommended for external links.

**Change:** Add `rel="noopener noreferrer"` (or `rel="noopener"` minimum) to every `target="_blank"` link.  
Example: footer “oneko.js” link, default layout “Better Images of AI” link, CV/about/agenda/articles/quotes/philosophy/cs/reading_list/math-theorems, 404, etc.

**Suggestion:** Add a Jekyll include or default in the theme so all external links get this (e.g. a custom `external_link.html` include used wherever you open in a new tab).

---

### 1.2 Landmarks and main content

**Where:** `_layouts/default.html`.

**Current:** Main content is a `<div class="container mt-5">` with no landmark or main ID.

**Proposal (no visual change):**  
- Wrap the primary content in `<main id="main-content">` so screen readers have an explicit main landmark.  
- Optionally add a “Skip to main content” link at the very start of `<body>` that targets `#main-content` (hidden until focused). Improves keyboard and screen-reader UX.

---

### 1.3 Fixed quote and image boxes (semantics)

**Where:** Fixed quote box and fixed image box in `_layouts/default.html`.

**Proposal:**  
- Wrap each in `<aside aria-label="...">` (e.g. “Random quote” and “AI image from Better Images of AI”) so they are complementary landmarks.  
- Improves navigation by landmarks without changing layout or look.

---

### 1.4 Navbar dropdown IDs

**Where:** `_includes/header.html` — dropdown toggles and menus.

**Issue:** Every dropdown uses the same `id="navbarDropdown"` and `aria-labelledby="navbarDropdown"`. With multiple dropdowns this is invalid (duplicate IDs) and hurts a11y.

**Fix:** Use a unique ID per dropdown, e.g. `id="navbarDropdown-{{ forloop.index }}"` and `aria-labelledby="navbarDropdown-{{ forloop.index }}"` (and ensure the menu’s `aria-labelledby` points to the same id).

---

### 1.5 Progress bar (decorative)

**Where:** `_includes/header.html` progress element.

**Proposal:** If the bar is purely decorative, add `aria-hidden="true"` so assistive tech ignores it. If it’s meaningful (e.g. “reading progress”), add `role="progressbar"` and `aria-label="Page reading progress"` (and keep `aria-hidden="false"` or omit it). Choose one and implement consistently.

---

### 1.6 Image `alt` and empty `src`

**Where:** Fixed AI image in default layout: `<img id="fixed-ai-image" ... src="" alt="...">`.

**Current:** `hourly_ai_image.js` sets `src` and `alt` after load. Empty `src` can cause an extra request (e.g. to current URL) in some browsers.

**Proposal:** Either leave as-is and accept the brief moment before JS runs, or set `src` to a data URI placeholder (e.g. `data:image/gif;base64,R0lGO...`) or a tiny transparent pixel so the element never requests the page URL. No visual change once JS has run.

---

## 2. HTML / template correctness

### 2.1 Figure include: `max-height` vs `height`

**Where:** `_includes/figure.html` line 24.

**Bug:** The template outputs the `include.max-height` value into the **`height`** attribute:

```liquid
{% if include.max-height %}height="{{ include.max-height }}"{% endif %}
```

So when `max-height` is set, it incorrectly overrides `height` instead of setting `max-height`.

**Fix:** Output a `max-height` attribute (or a `style="max-height: ..."` if you need to support older HTML). For strictness, use the correct attribute name, e.g. in a style block or as a CSS variable so the figure can use `max-height` correctly.

**Note:** HTML `img` does not have a `max-height` attribute; max-height is typically applied via CSS. So the intended fix is: remove this line from the `<img>` and, if needed, add a class or inline style that sets `max-height` from the include (e.g. `style="max-height: {{ include.max-height }};"` when present). That way the include behaves as intended without changing appearance.

---

### 2.2 Invalid `defer` on `<link>`

**Where:** `_includes/head.html` — Bootstrap Table stylesheet.

**Current:** `<link defer rel="stylesheet" href="...">`

**Issue:** `defer` is defined only for `<script>`. On `<link>` it is invalid and has no effect.

**Fix:** Remove the `defer` attribute from that `<link>`. If you want to non-block loading, use `media="print" onload="this.media='all'"` or load the table CSS asynchronously via a small script; otherwise a normal `<link rel="stylesheet">` is correct.

---

## 3. Performance and loading

### 3.1 Script placement and defer

**Where:** `_includes/head.html` — `random_quote.js`, `nav_panel.js`, `quotes_nav.js`; and theme/dark_mode scripts.

**Observation:** Scripts in `<head>` without `defer`/`async` block parsing. Moving them to the end of `<body>` (like the other scripts in default.html) or adding `defer` where order is not critical can improve first paint.

**Proposal:** Move non-critical scripts to the bottom of the page (in default.html with the rest), or add `defer` and ensure they don’t depend on document write or immediate execution. Keep any that must run before DOM (e.g. theme flash prevention) in head as needed. No visual change, only load order.

---

### 3.2 Console logging in production

**Where:**  
- `assets/js/hourly_ai_image.js` — logs selected image.  
- `assets/js/random_ai_image.js` — logs when images are set.  
- `assets/js/custom_cursor.js` — logs daily word.

**Proposal:** Remove `console.log` in production or guard with a flag (e.g. `if (window.DEBUG) console.log(...)`). Reduces noise and slight overhead; no visual impact.

---

### 3.3 Asset paths and baseurl

**Where:** Multiple JS files that use hardcoded `/assets/` paths, e.g.:  
- `random_quote.js`: `fetch('/assets/json/quotes.json')`  
- `custom_cursor.js`: `fetch('/assets/json/words.json')`  
- `cats_at_bottom.js`: `/assets/json/me-like-articles.json`, `/assets/img/oneko.gif`  
- `hourly_ai_image.js`: `/assets/better-ai-imgs/...`  
- `quotes_nav.js`, `articles_nav.js`, `papers_carousel.js`, `history_timeline.js`, `weather_widget.js`, `ai_page_transitions.js`

**Issue:** With `baseurl: /` the site works. If you ever set `baseurl` to a subpath (e.g. `/blog/`), those requests will fail.

**Proposal:** Introduce a single base URL for the site, e.g.  
- In default layout: `<body data-baseurl="{{ site.baseurl }}">`  
- In JS: `const base = document.documentElement.getAttribute('data-baseurl') || '';` then `fetch(base + '/assets/json/quotes.json')` (or use a small config object).  
Apply consistently to all asset fetches and image paths. No visual change; improves portability.

---

## 4. Security

- **External links:** Covered in 1.1 — add `rel="noopener noreferrer"` to all `target="_blank"` links.  
- No other critical security issues identified in the reviewed templates and scripts.

---

## 5. Code quality and maintainability

### 5.1 Progress bar script selector

**Where:** `_includes/scripts/progressBar.html` line 55.

**Bug:** `$("progress-container")` selects an element named `progress-container` (tag selector). The actual element is `<div class="progress-container">`.

**Fix:** Use `$(".progress-container")` so the progress bar logic applies to the correct element. Behavior and appearance stay the same; script works as intended.

---

### 5.2 Cats at bottom: reduced-motion check

**Where:** `assets/js/cats_at_bottom.js`:

```javascript
const isReducedMotion =
  window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
  window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
```

**Issue:** `matchMedia(...)` returns a `MediaQueryList` object, not a boolean, so the first part is always false. Only the second part (`.matches`) is meaningful.

**Fix:** Use a single call and `.matches`, e.g.  
`const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;`  
No visual change; respects reduced motion correctly.

---

### 5.3 Bootstrap comment typo

**Where:** `_includes/scripts/bootstrap.html`: “Bootsrap” in the comment.

**Fix:** Change to “Bootstrap”. Cosmetic only.

---

### 5.4 Schema.org JSON-LD order

**Where:** `_includes/metadata.html` — Schema.org script.

**Recommendation:** Put `@context` and `@type` at the top of the JSON object. Some validators and consumers expect that order. Reorder keys only; output remains valid; no visual or SEO change required but improves consistency.

---

### 5.5 About page inline styles

**Where:** `_layouts/about.html` — “news” heading and link wrapper use inline `style="display: flex; ..."` etc.

**Proposal:** Move those rules into your SCSS (e.g. a class like `.about-news-header`) and use the class in the layout. Same look; easier to maintain and theme.

---

### 5.6 SCSS structure

**Where:** `assets/css/main.scss` — large block of papers carousel, bubble links, compact CV, news, education styles.

**Proposal:** Extract those into partials (e.g. `_papers.scss`, `_news.scss`, `_cv-compact.scss`) and `@import` them in `main.scss`. Same compiled CSS; clearer structure and easier edits.

---

### 5.7 Duplicate logic (seeded random, etc.)

**Where:** `custom_cursor.js` and `hourly_ai_image.js` each define a seeded random helper.

**Proposal:** Add a small shared utility (e.g. `assets/js/utils.js` or a minimal `seededRandom.js`) and use it from both. Reduces duplication and keeps behavior consistent; no visual change.

---

## 6. Summary checklist

| Area            | Item                                      | Impact              | Effort |
|-----------------|-------------------------------------------|---------------------|--------|
| Security        | `rel="noopener noreferrer"` on _blank links | Security + a11y     | Low    |
| Correctness     | Figure `max-height` → correct attr/style  | Correct behavior    | Low    |
| Correctness     | Remove `defer` from Bootstrap Table link  | Valid HTML          | Trivial|
| Correctness     | Progress bar `.progress-container`        | Script works        | Trivial|
| A11y            | Unique dropdown IDs in header             | Valid + a11y        | Low    |
| A11y            | `<main>`, optional skip link              | Navigation          | Low    |
| A11y            | `<aside>` + aria-label for quote/image    | Landmarks           | Low    |
| Logic           | Cats reduced-motion check                 | Respects preference | Trivial|
| Maintainability | Bootstrap typo, Schema order, SCSS split   | Cleaner code        | Low    |
| Performance     | Script defer/placement, console.log       | Load + cleanliness  | Low    |
| Portability     | Base URL for asset paths in JS            | Works with baseurl  | Medium |

Implementing the “Trivial” and “Low” items above will improve correctness, accessibility, and maintainability without changing the site’s appearance.
