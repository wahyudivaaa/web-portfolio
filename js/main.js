/**
 * iOS 28 Minimalist Bubble UI / UX Interactions
 * Main JavaScript Engine for Wahyu Diva Portfolio
 */

// Register GSAP plugins if available
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ---------------------------------------------------------------------------
// 1. Theme Controller (Dual Theme: Dark / Light with Persistence)
// ---------------------------------------------------------------------------
const initTheme = () => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  // Determine starting theme
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', currentTheme);

  const updateToggleAria = (theme) => {
    if (!themeToggle) return;
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    themeToggle.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  };

  updateToggleAria(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const activeTheme = root.getAttribute('data-theme') || 'dark';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      
      root.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateToggleAria(newTheme);
    });
  }

  // React to OS preference changes if user hasn't overridden
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        const autoTheme = e.matches ? 'dark' : 'light';
        root.setAttribute('data-theme', autoTheme);
        updateToggleAria(autoTheme);
      }
    });
  }
};

// ---------------------------------------------------------------------------
// 2. Navigation & Dynamic Island Controller
// ---------------------------------------------------------------------------
const initNavigation = () => {
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileSheet = document.getElementById('mobileMenuSheet');
  const island = document.querySelector('.dynamic-island');
  const navLinks = document.querySelectorAll('.island-link, .sheet-link');
  const sections = document.querySelectorAll('section[id]');
  const chatTrigger = document.querySelector('.chat-trigger-btn');

  // Scrollspy, Island Elevation & Compact-on-scroll (iOS tab bar behavior)
  let lastScrollY = window.scrollY;
  const onScroll = () => {
    const scrollPos = window.scrollY + 200;
    const y = window.scrollY;

    if (island) {
      if (y > 30) {
        island.classList.add('island-scrolled');
      } else {
        island.classList.remove('island-scrolled');
      }

      // Compact while scrolling down past the hero, expand on scroll up
      if (y > 160 && y > lastScrollY + 4) {
        island.classList.add('island-compact');
      } else if (y < lastScrollY - 4 || y <= 160) {
        island.classList.remove('island-compact');
      }
    }
    lastScrollY = y;

    // Active Section Tracking
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Liquid Glass tab lens (iOS 26): a glass capsule that glides to the
  // active tab instead of a solid fill swapping between links.
  const linksTrack = document.querySelector('.island-links');
  const lens = document.querySelector('.island-lens');
  const islandLinks = document.querySelectorAll('.island-link');

  if (linksTrack && lens && islandLinks.length) {
    const moveLens = (target, animate = true) => {
      if (!target || linksTrack.offsetParent === null) {
        lens.style.opacity = '0';
        return;
      }
      if (!animate) lens.style.transition = 'none';
      lens.style.width = `${target.offsetWidth}px`;
      lens.style.transform = `translateX(${target.offsetLeft}px)`;
      lens.style.opacity = '1';
      trackHole();
      if (!animate) {
        void lens.offsetWidth;
        lens.style.transition = '';
      }
    };

    const lensToActive = (animate = true) =>
      moveLens(linksTrack.querySelector('.island-link.active'), animate);

    // Real Glass (v13): keep the frost hole under the lens in sync
    const trackHole = () => {
      if (window.__glassTrackHole) window.__glassTrackHole();
    };

    // Follow scrollspy / click changes of the active class
    const lensObserver = new MutationObserver(() => lensToActive());
    islandLinks.forEach((link) => {
      lensObserver.observe(link, { attributes: true, attributeFilter: ['class'] });
      // Preview on hover, settle back to the active tab on leave
      link.addEventListener('mouseenter', () => moveLens(link));
      link.addEventListener('click', () => moveLens(link));
    });
    linksTrack.addEventListener('mouseleave', () => lensToActive());

    window.addEventListener('resize', () => lensToActive(false));
    window.addEventListener('load', () => lensToActive(false));
    requestAnimationFrame(() => lensToActive(false));
    setTimeout(() => lensToActive(false), 350);
  }

  // Mobile Menu Sheet Toggle
  if (mobileToggle && mobileSheet) {
    const toggleMenu = () => {
      const isOpen = mobileSheet.classList.contains('open');
      if (isOpen) {
        mobileSheet.classList.remove('open');
        mobileSheet.setAttribute('aria-hidden', 'true');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileSheet.classList.add('open');
        mobileSheet.setAttribute('aria-hidden', 'false');
        mobileToggle.classList.add('active');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close when clicking mobile links
    mobileSheet.querySelectorAll('.sheet-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileSheet.classList.remove('open');
        mobileSheet.setAttribute('aria-hidden', 'true');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileSheet.contains(e.target) && !mobileToggle.contains(e.target)) {
        if (mobileSheet.classList.contains('open')) {
          mobileSheet.classList.remove('open');
          mobileSheet.setAttribute('aria-hidden', 'true');
          mobileToggle.classList.remove('active');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileSheet.classList.contains('open')) {
        mobileSheet.classList.remove('open');
        mobileSheet.setAttribute('aria-hidden', 'true');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Header Chat Trigger Button
  if (chatTrigger) {
    chatTrigger.addEventListener('click', () => {
      const chatbotToggle = document.querySelector('.chatbot-toggle');
      if (chatbotToggle) {
        chatbotToggle.click();
      }
    });
  }
};

// ---------------------------------------------------------------------------
// 4. Dynamic Age & Experience Calculation
// ---------------------------------------------------------------------------
const calculateAge = () => {
  const ageEl = document.getElementById('age');
  if (!ageEl) return;

  const birthDate = new Date('2004-06-15');
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  ageEl.textContent = `${age} years old`;
};

const calculateExperience = () => {
  const startDate = new Date('2022-06-01');
  const currentDate = new Date();

  let years = currentDate.getFullYear() - startDate.getFullYear();
  const months = currentDate.getMonth() - startDate.getMonth();

  if (months < 0) {
    years -= 1;
  }

  const expElements = document.querySelectorAll('.stat-item');
  expElements.forEach((element) => {
    const label = element.querySelector('.stat-label');
    if (label && label.textContent.includes('Years Experience')) {
      const numberElement = element.querySelector('.stat-number');
      if (numberElement) {
        numberElement.textContent = `${years}+`;
      }
    }
  });
};

const initFooterYear = () => {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
};

// ---------------------------------------------------------------------------
// 5. Project Image Carousel with Touch & Swipe Support
// ---------------------------------------------------------------------------
const initProjectCarousels = () => {
  const carousels = document.querySelectorAll('.project-carousel');

  carousels.forEach((carousel) => {
    const items = carousel.querySelectorAll('.carousel-item');
    const prevBtn = carousel.querySelector('.carousel-nav.prev');
    const nextBtn = carousel.querySelector('.carousel-nav.next');
    const dots = carousel.querySelectorAll('.carousel-dot');

    if (items.length === 0) return;

    let currentIndex = 0;
    let autoSlideInterval = null;

    const updateCarousel = (index) => {
      items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      currentIndex = index;
    };

    const nextSlide = () => {
      const next = (currentIndex + 1) % items.length;
      updateCarousel(next);
    };

    const prevSlide = () => {
      const prev = (currentIndex - 1 + items.length) % items.length;
      updateCarousel(prev);
    };

    const startTimer = () => {
      stopTimer();
      autoSlideInterval = setInterval(nextSlide, 4000);
    };

    const stopTimer = () => {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextSlide();
        startTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevSlide();
        startTimer();
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        updateCarousel(index);
        startTimer();
      });
    });

    // Touch Swipe Support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopTimer();
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startTimer();
    }, { passive: true });

    const handleSwipe = () => {
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
      }
    };

    // Pause on hover
    carousel.addEventListener('mouseenter', stopTimer);
    carousel.addEventListener('mouseleave', startTimer);

    // Initial state
    updateCarousel(0);
    startTimer();
  });
};

// ---------------------------------------------------------------------------
// 6. GSAP Smooth Entry Animations
// ---------------------------------------------------------------------------
const initAnimations = () => {
  if (typeof gsap === 'undefined') return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Hero Entrance (copy children stagger, visual as one unit)
  gsap.from('.hero-copy > *, .hero-visual', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    stagger: 0.08,
    ease: 'power3.out'
  });
  // Section Headers
  gsap.utils.toArray('.section-header').forEach((header) => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out'
    });
  });

  // About Cards
  gsap.from('.about-grid > *', {
    scrollTrigger: {
      trigger: '.about-grid',
      start: 'top 82%',
      toggleActions: 'play none none none'
    },
    y: 30,
    opacity: 0,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // Skills Group Cards
  gsap.from('.skill-group-card', {
    scrollTrigger: {
      trigger: '.skills-grid',
      start: 'top 82%',
      toggleActions: 'play none none none'
    },
    y: 30,
    opacity: 0,
    duration: 0.7,
    stagger: 0.12,
    ease: 'power3.out'
  });

  // Projects Cards
  gsap.from('.projects-grid .project-card', {
    scrollTrigger: {
      trigger: '.projects-grid',
      start: 'top 82%',
      toggleActions: 'play none none none'
    },
    y: 35,
    opacity: 0,
    duration: 0.8,
    stagger: 0.18,
    ease: 'power3.out'
  });

  // Experience & Education Timeline Items (Redesign v9)
  gsap.utils.toArray('.timeline-item').forEach((item) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      y: 26,
      opacity: 0,
      duration: 0.65,
      ease: 'power3.out'
    });
  });
};
// ---------------------------------------------------------------------------
// 9. Initialize Everything on DOMContentLoaded
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  calculateAge();
  calculateExperience();
  initFooterYear();
  initProjectCarousels();
  initAnimations();
  initPointerSpecular();
  initRealGlass();
});

// ---------------------------------------------------------------------------
// 10. Pointer-reactive specular (all browsers, fine pointers only)
// A soft light follows the cursor along the island via the --light-x var.
// ---------------------------------------------------------------------------
const initPointerSpecular = () => {
  const island = document.querySelector('.dynamic-island');
  if (!island) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let current = 50;
  let target = 50;
  let rafId = null;
  const tick = () => {
    current += (target - current) * 0.12;
    island.style.setProperty('--light-x', `${current.toFixed(2)}%`);
    if (Math.abs(target - current) > 0.05) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  };
  island.addEventListener('pointermove', (e) => {
    const r = island.getBoundingClientRect();
    target = Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100));
    if (!rafId) rafId = requestAnimationFrame(tick);
  });
};

// ---------------------------------------------------------------------------
// 11. Real Glass — true refraction (Chromium only, progressive enhancement)
// Per-element displacement maps (canvas, exact size): flat neutral centre,
// bent rim following the rounded-rect SDF normal. Applied through
// backdrop-filter: url(#svg-filter). Safari/Firefox never get .has-refract
// and keep the frost. Research: liquid-glass-real-refraction-web (2026-11-11)
// ---------------------------------------------------------------------------
const initRealGlass = () => {
  const ua = navigator.userAgentData;
  const isChromium = !!(
    ua &&
    ua.brands &&
    ua.brands.some((b) => /Chromium|Google Chrome|Microsoft Edge/i.test(b.brand))
  );
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const desktop = window.matchMedia('(min-width: 769px)').matches;
  const reducedTransparency = window.matchMedia('(prefers-reduced-transparency: reduce)').matches;
  if (!isChromium || !finePointer || !desktop || reducedTransparency) return;

  const island = document.querySelector('.dynamic-island');
  const lens = document.querySelector('.island-lens');
  if (!island || !lens) return;

  document.documentElement.classList.add('has-refract');

  // Frost becomes a sibling layer so the lens backdrop is not trapped
  const frost = document.createElement('div');
  frost.className = 'island-frost';
  frost.setAttribute('aria-hidden', 'true');
  island.prepend(frost);

  // Clear-lens window: a lens-shaped hole is cut out of the frost so the
  // lens refracts the RAW page backdrop (Apple's clear tab thumb), while
  // the rest of the island stays frosted. The hole tracks the lens rect.
  const svgNS0 = 'http://www.w3.org/2000/svg';
  const clipSvg = document.createElementNS(svgNS0, 'svg');
  clipSvg.setAttribute('width', '0');
  clipSvg.setAttribute('height', '0');
  clipSvg.setAttribute('aria-hidden', 'true');
  clipSvg.style.position = 'absolute';
  const clipPath = document.createElementNS(svgNS0, 'clipPath');
  clipPath.setAttribute('id', 'frost-clip');
  const clipPathPath = document.createElementNS(svgNS0, 'path');
  clipPathPath.setAttribute('clip-rule', 'evenodd');
  clipPath.appendChild(clipPathPath);
  clipSvg.appendChild(clipPath);
  document.body.appendChild(clipSvg);
  frost.style.clipPath = 'url(#frost-clip)';

  const roundedRectPath = (x, y, w, h, r) =>
    `M ${x + r} ${y} H ${x + w - r} A ${r} ${r} 0 0 1 ${x + w} ${y + r} V ${y + h - r} ` +
    `A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} H ${x + r} A ${r} ${r} 0 0 1 ${x} ${y + h - r} ` +
    `V ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y} Z`;

  const updateHole = () => {
    const ir = island.getBoundingClientRect();
    const lr = lens.getBoundingClientRect();
    const x = lr.left - ir.left;
    const y = lr.top - ir.top;
    const outer = `M -2 -2 H ${ir.width + 2} V ${ir.height + 2} H -2 Z`;
    clipPathPath.setAttribute('d', `${outer} ${roundedRectPath(x, y, lr.width, lr.height, lr.height / 2)}`);
  };
  updateHole();

  // Track the hole per-frame while the lens slides (called from moveLens)
  let holeRaf = null;
  let holeUntil = 0;
  window.__glassTrackHole = () => {
    holeUntil = performance.now() + 700;
    if (holeRaf) return;
    const step = () => {
      updateHole();
      if (performance.now() < holeUntil) {
        holeRaf = requestAnimationFrame(step);
      } else {
        holeRaf = null;
        updateHole();
      }
    };
    holeRaf = requestAnimationFrame(step);
  };
  new ResizeObserver(() => updateHole()).observe(island);

  // SVG filter defs (one filter per refractive element)
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.position = 'absolute';
  const defs = document.createElementNS(svgNS, 'defs');
  svg.appendChild(defs);
  document.body.appendChild(svg);

  const makeFilter = (id) => {
    const f = document.createElementNS(svgNS, 'filter');
    f.setAttribute('id', id);
    f.setAttribute('color-interpolation-filters', 'sRGB');
    f.setAttribute('x', '-8%');
    f.setAttribute('y', '-8%');
    f.setAttribute('width', '116%');
    f.setAttribute('height', '116%');
    const img = document.createElementNS(svgNS, 'feImage');
    img.setAttribute('preserveAspectRatio', 'none');
    img.setAttribute('result', 'map');
    const dm = document.createElementNS(svgNS, 'feDisplacementMap');
    dm.setAttribute('in', 'SourceGraphic');
    dm.setAttribute('in2', 'map');
    dm.setAttribute('xChannelSelector', 'R');
    dm.setAttribute('yChannelSelector', 'G');
    f.appendChild(img);
    f.appendChild(dm);
    defs.appendChild(f);
    return { id, img, dm };
  };

  // Displacement map: R/G encode the sampling offset along the edge normal.
  // Centre (beyond the bezel) stays neutral (128,128) = zero displacement.
  const buildMap = (W, H, radius, bezel) => {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(W, H);
    const d = imgData.data;
    const cx = W / 2;
    const cy = H / 2;
    const hx = W / 2;
    const hy = H / 2;
    const r = Math.min(radius, hx, hy);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const px = x + 0.5 - cx;
        const py = y + 0.5 - cy;
        const qx = Math.abs(px) - (hx - r);
        const qy = Math.abs(py) - (hy - r);
        const ax = Math.max(qx, 0);
        const ay = Math.max(qy, 0);
        const distIn = -(Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - r);
        let R = 128;
        let G = 128;
        if (distIn < bezel) {
          let nx;
          let ny;
          if (qx > 0 && qy > 0) {
            const l = Math.hypot(ax, ay) || 1;
            nx = (Math.sign(px) * ax) / l;
            ny = (Math.sign(py) * ay) / l;
          } else if (qx > qy) {
            nx = Math.sign(px);
            ny = 0;
          } else {
            nx = 0;
            ny = Math.sign(py);
          }
          const t = 1 - distIn / bezel;
          const m = 1 - Math.pow(1 - t, 3);
          R = 128 + nx * m * 127;
          G = 128 + ny * m * 127;
        }
        const i = (y * W + x) * 4;
        d[i] = R;
        d[i + 1] = G;
        d[i + 2] = 128;
        d[i + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL();
  };

  const attach = (el, filter, scale, bezelRatio) => {
    let lastKey = '';
    let timer = null;
    const apply = () => {
      const rect = el.getBoundingClientRect();
      const W = Math.max(2, Math.round(rect.width));
      const H = Math.max(2, Math.round(rect.height));
      const key = `${W}x${H}`;
      if (key === lastKey) return;
      lastKey = key;
      const bezel = Math.max(6, Math.min(18, H * bezelRatio));
      filter.img.setAttribute('href', buildMap(W, H, H / 2, bezel));
      filter.img.setAttribute('x', '0');
      filter.img.setAttribute('y', '0');
      filter.img.setAttribute('width', String(W));
      filter.img.setAttribute('height', String(H));
      filter.dm.setAttribute('scale', String(scale));
      el.style.backdropFilter = `url("#${filter.id}") saturate(1.6)`;
    };
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(apply, 80);
    };
    apply();
    new ResizeObserver(schedule).observe(el);
  };

  attach(lens, makeFilter('glass-lens'), 26, 0.42);
  const themeBtn = document.querySelector('#themeToggle');
  if (themeBtn) attach(themeBtn, makeFilter('glass-btn-theme'), 12, 0.45);
  const chatBtn = document.querySelector('.chat-trigger-btn');
  if (chatBtn) attach(chatBtn, makeFilter('glass-btn-chat'), 14, 0.4);
  // v14: the chatbot FAB is the one extra refractive surface beyond the
  // nav lens (research rule: refraction stays rare = small chrome only)
  const fab = document.querySelector('.chatbot-toggle');
  if (fab) attach(fab, makeFilter('glass-fab'), 16, 0.45);
};

/* ===== REDESIGN v15: live local-time clock in the footer (WITA) ===== */
(function initFooterClock() {
  var el = document.getElementById('footerClock');
  if (!el) return;
  var fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Makassar',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
  function tick() { el.textContent = fmt.format(new Date()); }
  tick();
  setInterval(tick, 1000);
})();
