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

  // Scrollspy & Island Elevation
  const onScroll = () => {
    const scrollPos = window.scrollY + 200;

    // Island elevation style
    if (island) {
      if (window.scrollY > 30) {
        island.classList.add('island-scrolled');
      } else {
        island.classList.remove('island-scrolled');
      }
    }

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
// 3. Dynamic Typed.js Roles
// ---------------------------------------------------------------------------
const initTypedText = () => {
  const element = document.querySelector('#typing-text');
  if (!element || typeof Typed === 'undefined') return;

  new Typed('#typing-text', {
    strings: [
      'Junior Fullstack Developer',
      'Modern Web Developer',
      'UI/UX Enthusiast',
      'Problem Solver'
    ],
    typeSpeed: 45,
    backSpeed: 25,
    backDelay: 1800,
    startDelay: 600,
    loop: true,
    showCursor: true,
    cursorChar: '|',
    autoInsertCss: true,
    smartBackspace: true
  });
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

  // Hero Text Stagger
  gsap.from('.hero-text-card > *', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out'
  });

  // Hero Avatar
  gsap.from('.hero-avatar-card', {
    scale: 0.92,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: 'power3.out'
  });

  // Section Headers Reveal
  gsap.utils.toArray('.section-header-bubble').forEach((header) => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  // About Widgets
  gsap.from('.about-widget-grid > *', {
    scrollTrigger: {
      trigger: '.about-widget-grid',
      start: 'top 82%',
      toggleActions: 'play none none none'
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // Skills Cards
  gsap.from('.skill-pod-card', {
    scrollTrigger: {
      trigger: '.skills-bubble-grid',
      start: 'top 82%',
      toggleActions: 'play none none none'
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // Projects Cards
  gsap.from('.projects-bubble-grid .project-card', {
    scrollTrigger: {
      trigger: '.projects-bubble-grid',
      start: 'top 82%',
      toggleActions: 'play none none none'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
  });
};

// ---------------------------------------------------------------------------
// 7. Initialize Everything on DOMContentLoaded
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initTypedText();
  calculateAge();
  calculateExperience();
  initFooterYear();
  initProjectCarousels();
  initAnimations();
});
