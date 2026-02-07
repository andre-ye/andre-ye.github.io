// Cats at bottom with paper bubbles
// Three cats standing on the bottom bar, each with a clickable paper bubble

(function bottomCats() {
  // Don't show on mobile
  if (window.innerWidth < 768) return;

  const isReducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

  if (isReducedMotion) return;

  const NUM_CATS = 3;
  const FOOTER_HEIGHT = 53; // Fixed footer height
  const FRAME_INTERVAL = 50; // Faster animation speed
  const CAT_LIFESPAN = 60000; // Each cat stays for 1 minute
  const ROTATION_INTERVAL = 20000; // Rotate one cat every 20 seconds
  const CAT_STATE_VERSION = 3; // Increment when styles change to reset cached state

  // Different cat styles - uniform size (36px), varied vivid colors
  const CAT_SIZE = 36;
  const CAT_STYLES = [
    { filter: 'brightness(0.2) contrast(1.3)', name: 'black' },  // Very dark/black cat
    { filter: 'hue-rotate(200deg) saturate(4) brightness(1.2)', name: 'blue' },  // Vivid blue
    { filter: 'hue-rotate(100deg) saturate(4) brightness(1.1)', name: 'green' },  // Vivid green
    { filter: 'hue-rotate(280deg) saturate(4) brightness(1.2)', name: 'purple' },  // Vivid purple
    { filter: 'hue-rotate(20deg) saturate(5) brightness(1.2)', name: 'orange' },  // Vivid orange
    { filter: 'hue-rotate(330deg) saturate(4) brightness(1.1)', name: 'pink' },  // Vivid pink
    { filter: 'sepia(1) saturate(4) brightness(1.0)', name: 'golden' },  // Golden/sepia
    { filter: 'hue-rotate(180deg) saturate(4) brightness(1.3)', name: 'cyan' },  // Vivid cyan
    { filter: 'hue-rotate(0deg) saturate(5) brightness(1.0)', name: 'red' },  // Red cat
    { filter: 'hue-rotate(60deg) saturate(4) brightness(1.1)', name: 'yellow' },  // Yellow cat
  ];

  let cats = [];
  let papers = [];
  let usedStyleIndices = new Set();
  let catsEnabled = localStorage.getItem('catsEnabled') !== 'false';
  let lastFrameTime = 0;
  let rotationTimer = null;

  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [
      [-5, 0],
      [-6, 0],
      [-7, 0],
    ],
    E: [
      [-3, 0],
      [-3, -1],
    ],
    W: [
      [-4, -2],
      [-4, -3],
    ],
  };

  async function loadPapers() {
    try {
      const response = await fetch('/assets/json/me-like-articles.json');
      const data = await response.json();
      papers = data.categories.flatMap(category =>
        category.papers.map(paper => ({
          title: paper.title,
          authors: Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors,
          year: paper.year,
          link: paper.link,
          category: category.title
        }))
      );
    } catch (error) {
      console.error('Failed to load papers:', error);
      papers = [{ title: "Sample Paper", authors: "Author", year: 2025, link: "#", category: "Research" }];
    }
  }

  function getUnusedStyle() {
    let styleIndex;
    if (usedStyleIndices.size >= CAT_STYLES.length) {
      styleIndex = Math.floor(Math.random() * CAT_STYLES.length);
    } else {
      do {
        styleIndex = Math.floor(Math.random() * CAT_STYLES.length);
      } while (usedStyleIndices.has(styleIndex));
    }
    usedStyleIndices.add(styleIndex);
    const style = CAT_STYLES[styleIndex];
    return { filter: style.filter, size: CAT_SIZE, index: styleIndex, name: style.name };
  }

  function createBubble(cat, paper) {
    const bubble = document.createElement('div');
    bubble.className = 'cat-paper-bubble';

    // Style the bubble - more transparent
    bubble.style.position = 'fixed';
    bubble.style.padding = '6px 10px';
    bubble.style.background = 'rgba(204, 51, 51, 0.5)'; // More transparent
    bubble.style.border = '1px solid rgba(204, 51, 51, 0.6)';
    bubble.style.borderRadius = '12px';
    bubble.style.color = 'var(--global-text-color)';
    bubble.style.fontSize = '10px';
    bubble.style.lineHeight = '1.3';
    bubble.style.maxWidth = '180px';
    bubble.style.pointerEvents = 'auto';
    bubble.style.cursor = 'pointer';
    bubble.style.zIndex = '1001';
    bubble.style.backdropFilter = 'blur(4px)';
    bubble.style.whiteSpace = 'nowrap';
    bubble.style.overflow = 'visible'; // Allow bubble to show even at edge
    bubble.style.textOverflow = 'ellipsis';
    bubble.style.opacity = '1';
    bubble.style.visibility = 'visible';

    // Truncate long titles and add link icon
    const displayTitle = paper.title.length > 30 ? paper.title.substring(0, 30) + '...' : paper.title;
    bubble.innerHTML = `<span style="margin-right: 4px;">🔗</span>${displayTitle}`;
    bubble.title = `Click to read: ${paper.title}`;

    // Hover effect with smooth transition
    bubble.style.transition = 'transform 0.2s ease, background 0.2s ease';

    bubble.addEventListener('mouseenter', () => {
      bubble.style.transform = 'scale(1.05)';
      bubble.style.background = 'rgba(204, 51, 51, 0.75)';
    });

    bubble.addEventListener('mouseleave', () => {
      bubble.style.transform = 'scale(1)';
      bubble.style.background = 'rgba(204, 51, 51, 0.5)';
    });

    // Click handler
    bubble.addEventListener('click', (e) => {
      e.stopPropagation();
      handleBubbleClick(cat, bubble, paper);
    });

    document.body.appendChild(bubble);
    return bubble;
  }

  function handleBubbleClick(cat, bubble, paper) {
    if (paper.link && paper.link !== "#") {
      window.open(paper.link, '_blank');
    }

    // Pop animation
    bubble.style.transform = 'scale(1.3)';
    bubble.style.opacity = '0';

    setTimeout(() => {
      bubble.remove();
    }, 200);

    // Mark cat for removal
    cat.removing = true;
    cat.fullyExited = false;
    cat.bubble = null;

    // Scamper away
    const scamperDirection = Math.random() > 0.5 ? 1 : -1;
    cat.targetX = scamperDirection > 0 ? window.innerWidth + 50 : -50;
    cat.speed = 8; // Moderately fast scamper

    // Poll until cat has fully exited, then remove and replace
    const checkExited = setInterval(() => {
      if (cat.fullyExited) {
        clearInterval(checkExited);
        removeCat(cat);
        spawnCat();
      }
    }, 100);

    // Safety timeout
    setTimeout(() => {
      clearInterval(checkExited);
      if (cats.includes(cat)) {
        removeCat(cat);
        spawnCat();
      }
    }, 5000);
  }

  function updateBubblePosition(cat) {
    if (!cat.bubble) return;

    // Position bubble above the cat, centered on cat position
    const bubbleX = cat.posX - 90;
    const bubbleY = window.innerHeight - FOOTER_HEIGHT - 70; // Above cats, fixed to viewport

    cat.bubble.style.left = `${bubbleX}px`;
    cat.bubble.style.top = `${bubbleY}px`;

    // Ensure bubble stays visible
    cat.bubble.style.opacity = '1';
    cat.bubble.style.visibility = 'visible';
  }

  function createCat() {
    if (papers.length === 0) return null;

    const paper = papers[Math.floor(Math.random() * papers.length)];
    const styleData = getUnusedStyle();

    const cat = {
      el: document.createElement("div"),
      posX: Math.random() * (window.innerWidth - 100) + 50,
      targetX: Math.random() * (window.innerWidth - 100) + 50,
      speed: 1.5 + Math.random() * 1.0, // Faster: 1.5-2.5
      frameCount: 0,
      idleTime: 0,
      idleAnimation: null,
      idleAnimationFrame: 0,
      bubble: null,
      paper: paper,
      styleFilter: styleData.filter,
      styleIndex: styleData.index,
      size: styleData.size,
      styleName: styleData.name,
      spawnTime: Date.now(),
      removing: false,
    };

    cat.el.className = "bottom-cat";
    cat.el.style.width = `${cat.size}px`;
    cat.el.style.height = `${cat.size}px`;
    cat.el.style.position = "fixed";
    cat.el.style.bottom = `${FOOTER_HEIGHT}px`; // Feet on top of footer
    cat.el.style.pointerEvents = "none";
    cat.el.style.imageRendering = "pixelated";
    cat.el.style.backgroundImage = 'url(/assets/img/oneko.gif)';
    cat.el.style.backgroundSize = `${cat.size * 8}px ${cat.size * 4}px`; // Scale sprite sheet
    cat.el.style.filter = cat.styleFilter;
    cat.el.style.zIndex = 1000;
    cat.el.style.left = `${cat.posX - cat.size/2}px`;

    document.body.appendChild(cat.el);

    // Create bubble
    cat.bubble = createBubble(cat, paper);
    updateBubblePosition(cat);

    return cat;
  }

  function spawnCat() {
    if (!catsEnabled) return;
    const cat = createCat();
    if (cat) {
      cats.push(cat);
    }
  }

  function removeCat(cat) {
    const index = cats.indexOf(cat);
    if (index > -1) {
      cats.splice(index, 1);
    }
    if (cat.el && cat.el.parentElement) {
      cat.el.remove();
    }
    if (cat.bubble && cat.bubble.parentElement) {
      cat.bubble.remove();
    }
    if (cat.styleIndex !== undefined) {
      usedStyleIndices.delete(cat.styleIndex);
    }
  }

  function setSprite(cat, name, frame) {
    // Animation cycling - switch states every 1.75 frames
    const adjustedFrame = Math.floor(frame / 1.75);
    const sprite = spriteSets[name][adjustedFrame % spriteSets[name].length];
    // Scale sprite position based on cat size
    cat.el.style.backgroundPosition = `${sprite[0] * cat.size}px ${sprite[1] * cat.size}px`;
  }

  function updateCat(cat) {
    const halfSize = cat.size / 2;

    if (cat.removing) {
      const diffX = cat.posX - cat.targetX;
      const distance = Math.abs(diffX);

      if (distance > 5) {
        const direction = diffX > 0 ? "W" : "E";
        setSprite(cat, direction, cat.frameCount);
        cat.posX -= (diffX / distance) * cat.speed;
        cat.el.style.left = `${cat.posX - halfSize}px`;
        // Keep bubble following while scampering off
        updateBubblePosition(cat);
      }
      cat.frameCount += 1;

      // Check if cat has fully exited the screen
      if (cat.posX < -cat.size || cat.posX > window.innerWidth + cat.size) {
        cat.fullyExited = true;
      }
      return;
    }

    // Handle entering cats - running in from edge
    if (cat.entering) {
      cat.frameCount += 1;
      const diffX = cat.posX - cat.targetX;
      const distance = Math.abs(diffX);

      if (distance > cat.speed) {
        const direction = diffX > 0 ? "W" : "E";
        setSprite(cat, direction, cat.frameCount);
        cat.posX -= (diffX / distance) * cat.speed;
        cat.el.style.left = `${cat.posX - halfSize}px`;
        // Keep bubble following while entering
        updateBubblePosition(cat);
      } else {
        // Arrived at destination - switch to normal behavior
        cat.entering = false;
        cat.el.style.left = `${cat.posX - halfSize}px`;
        updateBubblePosition(cat);
      }
      return;
    }

    cat.frameCount += 1;
    const diffX = cat.posX - cat.targetX;
    const distance = Math.abs(diffX);

    // Safeguard: ensure cat has a bubble
    if (!cat.bubble && cat.paper) {
      cat.bubble = createBubble(cat, cat.paper);
      updateBubblePosition(cat);
    }

    // If reached target, pause and maybe pick new target
    if (distance < cat.speed || distance < 20) {
      cat.idleTime += 1;

      // Frequently scratch - it's cute!
      if (cat.idleTime > 10 && Math.floor(Math.random() * 30) == 0 && cat.idleAnimation == null) {
        cat.idleAnimation = "scratchSelf";
      }

      if (cat.idleAnimation === "scratchSelf") {
        setSprite(cat, "scratchSelf", cat.idleAnimationFrame);
        cat.idleAnimationFrame += 1;
        if (cat.idleAnimationFrame > 20) { // Longer scratch animation
          cat.idleAnimation = null;
          cat.idleAnimationFrame = 0;
        }
      } else {
        setSprite(cat, "idle", 0);
      }

      // Pick new target - less frequent, cats sit more
      if (cat.idleTime > 80 && Math.random() < 0.02) {
        const currentX = cat.posX;
        const moveDistance = 60 + Math.random() * 120; // Shorter distances: 60-180px
        const direction = Math.random() > 0.5 ? 1 : -1;
        cat.targetX = currentX + (moveDistance * direction);
        cat.targetX = Math.min(Math.max(50, cat.targetX), window.innerWidth - 50);
        cat.idleTime = 0;
      }
    } else {
      // Move towards target
      cat.idleAnimation = null;
      cat.idleAnimationFrame = 0;
      cat.idleTime = 0;

      const direction = diffX > 0 ? "W" : "E";
      setSprite(cat, direction, cat.frameCount);

      cat.posX -= (diffX / distance) * cat.speed;
      cat.posX = Math.min(Math.max(halfSize, cat.posX), window.innerWidth - halfSize);

      cat.el.style.left = `${cat.posX - halfSize}px`;
    }

    updateBubblePosition(cat);
  }

  function animate(timestamp) {
    // Throttle to FRAME_INTERVAL for smoother, slower animation
    if (timestamp - lastFrameTime >= FRAME_INTERVAL) {
      lastFrameTime = timestamp;
      cats.forEach(updateCat);
    }
    requestAnimationFrame(animate);
  }

  function removeAllCats() {
    cats.forEach(cat => {
      if (cat.el) cat.el.remove();
      if (cat.bubble) cat.bubble.remove();
    });
    cats = [];
    usedStyleIndices.clear();
  }

  function rotateOldestCat() {
    if (!catsEnabled || cats.length === 0) return;

    // Find the oldest cat that's been on screen long enough
    const now = Date.now();
    let oldestCat = null;
    let oldestTime = Infinity;

    for (const cat of cats) {
      if (!cat.removing && !cat.entering && cat.spawnTime < oldestTime) {
        oldestTime = cat.spawnTime;
        oldestCat = cat;
      }
    }

    // Only rotate if the oldest cat has been on for at least 20 seconds
    if (oldestCat && (now - oldestCat.spawnTime) >= ROTATION_INTERVAL) {
      // Make the old cat scamper off - keep bubble visible until off screen
      const distToLeft = oldestCat.posX;
      const distToRight = window.innerWidth - oldestCat.posX;
      oldestCat.targetX = distToLeft < distToRight ? -50 : window.innerWidth + 50;
      oldestCat.speed = 4 + Math.random() * 2;
      oldestCat.removing = true;
      oldestCat.fullyExited = false;

      // Poll until cat has fully exited, then remove and spawn new
      const checkExited = setInterval(() => {
        if (oldestCat.fullyExited) {
          clearInterval(checkExited);
          removeCat(oldestCat);
          if (catsEnabled && cats.length < NUM_CATS) {
            spawnCatFromEdge();
          }
        }
      }, 100);

      // Safety timeout
      setTimeout(() => {
        clearInterval(checkExited);
        if (cats.includes(oldestCat)) {
          removeCat(oldestCat);
          if (catsEnabled && cats.length < NUM_CATS) {
            spawnCatFromEdge();
          }
        }
      }, 5000);
    }
  }

  function startRotationTimer() {
    if (rotationTimer) clearInterval(rotationTimer);
    rotationTimer = setInterval(rotateOldestCat, ROTATION_INTERVAL);
  }

  function stopRotationTimer() {
    if (rotationTimer) {
      clearInterval(rotationTimer);
      rotationTimer = null;
    }
  }

  function scamperAllCatsOff() {
    // Make each cat scamper to the nearest edge - keep bubbles visible
    cats.forEach(cat => {
      if (cat.removing) return; // Already leaving

      // Determine nearest edge
      const distToLeft = cat.posX;
      const distToRight = window.innerWidth - cat.posX;
      cat.targetX = distToLeft < distToRight ? -50 : window.innerWidth + 50;
      cat.speed = 4 + Math.random() * 2; // Fast scamper
      cat.removing = true;
      cat.fullyExited = false;
    });

    // Poll until all cats have fully exited, then remove them
    const checkAllExited = setInterval(() => {
      const allExited = cats.every(cat => cat.fullyExited);
      if (allExited || cats.length === 0) {
        clearInterval(checkAllExited);
        removeAllCats();
      }
    }, 100);

    // Safety timeout - remove after 5 seconds max
    setTimeout(() => {
      clearInterval(checkAllExited);
      removeAllCats();
    }, 5000);
  }

  function spawnCatFromEdge() {
    if (!catsEnabled || papers.length === 0) return null;

    const paper = papers[Math.floor(Math.random() * papers.length)];
    const styleData = getUnusedStyle();

    // Start from a random edge
    const fromLeft = Math.random() > 0.5;
    const startX = fromLeft ? -40 : window.innerWidth + 40;
    const targetX = Math.random() * (window.innerWidth - 200) + 100; // Target somewhere in middle

    const cat = {
      el: document.createElement("div"),
      posX: startX,
      targetX: targetX,
      speed: 3 + Math.random() * 1.5, // Moderate entry speed
      frameCount: 0,
      idleTime: 0,
      idleAnimation: null,
      idleAnimationFrame: 0,
      bubble: null,
      paper: paper,
      styleFilter: styleData.filter,
      styleIndex: styleData.index,
      size: styleData.size,
      styleName: styleData.name,
      spawnTime: Date.now(),
      removing: false,
      entering: true, // Flag for entry animation
    };

    cat.el.className = "bottom-cat";
    cat.el.style.width = `${cat.size}px`;
    cat.el.style.height = `${cat.size}px`;
    cat.el.style.position = "fixed";
    cat.el.style.bottom = `${FOOTER_HEIGHT}px`;
    cat.el.style.pointerEvents = "none";
    cat.el.style.imageRendering = "pixelated";
    cat.el.style.backgroundImage = 'url(/assets/img/oneko.gif)';
    cat.el.style.backgroundSize = `${cat.size * 8}px ${cat.size * 4}px`; // Scale sprite sheet
    cat.el.style.filter = cat.styleFilter;
    cat.el.style.zIndex = 1000;
    cat.el.style.left = `${cat.posX - cat.size/2}px`;

    document.body.appendChild(cat.el);

    // Create bubble immediately so cat enters WITH paper visible
    cat.bubble = createBubble(cat, cat.paper);
    updateBubblePosition(cat);

    cats.push(cat);

    return cat;
  }

  function toggleCats() {
    catsEnabled = !catsEnabled;
    localStorage.setItem('catsEnabled', catsEnabled);

    if (catsEnabled) {
      // Spawn cats from edges with staggered timing
      for (let i = 0; i < NUM_CATS; i++) {
        setTimeout(() => {
          if (catsEnabled) spawnCatFromEdge();
        }, i * 300); // Stagger by 300ms
      }
      // Start the rotation timer after all cats have entered
      setTimeout(() => {
        if (catsEnabled) startRotationTimer();
      }, NUM_CATS * 300 + 2000);
    } else {
      stopRotationTimer();
      scamperAllCatsOff();
    }

    updateToggleButton();
  }

  function updateToggleButton() {
    const btn = document.getElementById('cats-toggle-btn');
    if (btn) {
      btn.textContent = catsEnabled ? '🐱' : '🚫';
      btn.title = catsEnabled ? 'Hide cats' : 'Show cats';
      btn.style.opacity = catsEnabled ? '1' : '0.5';
    }
  }

  function createToggleButton() {
    const btn = document.createElement('div');
    btn.id = 'cats-toggle-btn';
    btn.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 20px;
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #4a0000 0%, #800000 100%);
      border: 2px solid #ff4444;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 20px;
      font-weight: bold;
      color: #ff4444;
      cursor: pointer;
      z-index: 10000;
      box-shadow:
        0 0 20px rgba(255, 68, 68, 0.5),
        0 0 40px rgba(255, 68, 68, 0.3),
        0 0 60px rgba(255, 68, 68, 0.1),
        inset 0 0 20px rgba(255, 68, 68, 0.1);
      transition: all 0.3s ease;
      text-shadow: 0 0 10px #ff4444;
    `;

    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.15)';
      btn.style.boxShadow = `
        0 0 30px rgba(255, 68, 68, 0.8),
        0 0 60px rgba(255, 68, 68, 0.5),
        0 0 90px rgba(255, 68, 68, 0.3),
        inset 0 0 30px rgba(255, 68, 68, 0.2)
      `;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = `
        0 0 20px rgba(255, 68, 68, 0.5),
        0 0 40px rgba(255, 68, 68, 0.3),
        0 0 60px rgba(255, 68, 68, 0.1),
        inset 0 0 20px rgba(255, 68, 68, 0.1)
      `;
    });
    btn.addEventListener('click', toggleCats);

    document.body.appendChild(btn);
    updateToggleButton();
  }

  async function init() {
    await loadPapers();

    createToggleButton();

    // Try to restore cats from localStorage
    const savedCats = loadCatsFromStorage();

    if (catsEnabled) {
      if (savedCats && savedCats.length > 0) {
        // Restore saved cats
        restoreCats(savedCats);
      } else {
        // Spawn new cats
        for (let i = 0; i < NUM_CATS; i++) {
          spawnCat();
        }
      }
      startRotationTimer();
    }

    // Save cat state before page unload
    window.addEventListener('beforeunload', saveCatsToStorage);

    requestAnimationFrame(animate);
  }

  function saveCatsToStorage() {
    if (!catsEnabled || cats.length === 0) {
      localStorage.removeItem('catState');
      return;
    }

    const catState = {
      version: CAT_STATE_VERSION,
      cats: cats
        .filter(cat => !cat.removing && !cat.entering)
        .map(cat => ({
          posX: cat.posX,
          styleIndex: cat.styleIndex,
          paperTitle: cat.paper.title,
          spawnTime: cat.spawnTime,
        }))
    };

    localStorage.setItem('catState', JSON.stringify(catState));
  }

  function loadCatsFromStorage() {
    try {
      const saved = localStorage.getItem('catState');
      if (saved) {
        const data = JSON.parse(saved);
        // Check version - if outdated, clear and return null
        if (!data.version || data.version < CAT_STATE_VERSION) {
          localStorage.removeItem('catState');
          return null;
        }
        return data.cats;
      }
    } catch (e) {
      console.error('Failed to load cat state:', e);
      localStorage.removeItem('catState');
    }
    return null;
  }

  function restoreCats(savedCats) {
    savedCats.forEach(savedCat => {
      // Find the matching paper
      let paper = papers.find(p => p.title === savedCat.paperTitle);
      if (!paper) {
        paper = papers[Math.floor(Math.random() * papers.length)];
      }

      // Use saved style or get a new one
      let styleData;
      if (savedCat.styleIndex !== undefined && savedCat.styleIndex < CAT_STYLES.length) {
        usedStyleIndices.add(savedCat.styleIndex);
        const style = CAT_STYLES[savedCat.styleIndex];
        styleData = { filter: style.filter, size: CAT_SIZE, index: savedCat.styleIndex, name: style.name };
      } else {
        styleData = getUnusedStyle();
      }

      const cat = {
        el: document.createElement("div"),
        posX: savedCat.posX,
        targetX: savedCat.posX,
        speed: 1.5 + Math.random() * 1.0,
        frameCount: 0,
        idleTime: 0,
        idleAnimation: null,
        idleAnimationFrame: 0,
        bubble: null,
        paper: paper,
        styleFilter: styleData.filter,
        styleIndex: styleData.index,
        size: styleData.size,
        styleName: styleData.name,
        spawnTime: savedCat.spawnTime || Date.now(),
        removing: false,
        entering: false,
      };

      cat.el.className = "bottom-cat";
      cat.el.style.width = `${cat.size}px`;
      cat.el.style.height = `${cat.size}px`;
      cat.el.style.position = "fixed";
      cat.el.style.bottom = `${FOOTER_HEIGHT}px`;
      cat.el.style.pointerEvents = "none";
      cat.el.style.imageRendering = "pixelated";
      cat.el.style.backgroundImage = 'url(/assets/img/oneko.gif)';
      cat.el.style.backgroundSize = `${cat.size * 8}px ${cat.size * 4}px`;
      cat.el.style.filter = cat.styleFilter;
      cat.el.style.zIndex = 1000;
      cat.el.style.left = `${cat.posX - cat.size/2}px`;

      document.body.appendChild(cat.el);

      // Create bubble
      cat.bubble = createBubble(cat, paper);
      updateBubblePosition(cat);

      cats.push(cat);
    });
  }

  // Expose for global access
  window.toggleCats = toggleCats;

  init();
})();
