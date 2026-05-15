// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Performance optimization: Batch animations using GSAP timeline
const createMainTimeline = () => {
    const tl = gsap.timeline();
    return tl;
};

// Navbar Animation with mobile check
const initNavbarAnimation = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        // Skip animation if mobile menu is open
        const collapse = document.querySelector('.navbar-collapse');
        if (collapse && collapse.classList.contains('show')) return;

        // Match Bootstrap's navbar-expand-lg breakpoint.
        if (window.innerWidth <= 991.98) return;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                if (currentScroll > lastScroll && currentScroll > 100) {
                    navbar.classList.add('navbar-hidden');
                } else {
                    navbar.classList.remove('navbar-hidden');
                }
                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    });
};

// Optimized Glitch Effect
const initGlitchEffect = () => {
    const glitchTexts = document.querySelectorAll('.cyber-glitch');
    glitchTexts.forEach(text => {
        if (text.hasAttribute('data-text')) return;
        text.setAttribute('data-text', text.textContent);
    });
};

// Optimized Skill Bars Animation using GSAP batching
const initSkillBars = () => {
    const skillBars = document.querySelectorAll('.skill-progress');
    if (skillBars.length === 0) return;

    // Batch all skill bar animations
    gsap.from(skillBars, {
        width: 0,
        duration: 1.5,
        ease: "power2.out",
        stagger: 0.2,
        scrollTrigger: {
            trigger: ".skills-section",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });
};

// Optimized Project Cards Animation
const initProjectCards = () => {
    const cards = document.querySelectorAll('.project-card');
    if (cards.length === 0) return;

    // Create a single ScrollTrigger for all cards
    gsap.set(cards, { opacity: 0, y: 50 }); // Set initial state

    ScrollTrigger.batch(cards, {
        start: "top 85%",
        onEnter: batch => {
            gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out"
            });
        },
        once: true // Only animate once
    });
};

// Optimized Cyber Grid with reduced updates
const initCyberGrid = () => {
    const grid = document.querySelector('.cyber-grid');
    if (!grid) return;

    const gridSize = 20;
    const rows = Math.ceil(window.innerHeight / gridSize);
    const cols = Math.ceil(window.innerWidth / gridSize);
    
    // Create grid cells only once
    grid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        fragment.appendChild(cell);
    }
    
    grid.appendChild(fragment);
    grid.style.gridTemplateColumns = `repeat(${cols}, ${gridSize}px)`;
    
    // Optimize grid animation
    const cells = Array.from(grid.children);
    let lastAnimatedCell = null;
    
    const animateGrid = () => {
        if (lastAnimatedCell) {
            lastAnimatedCell.classList.remove('grid-cell-active');
        }
        
        const randomCell = cells[Math.floor(Math.random() * cells.length)];
        if (randomCell) {
            randomCell.classList.add('grid-cell-active');
            lastAnimatedCell = randomCell;
        }
    };

    // Reduce animation frequency
    setInterval(animateGrid, 200);

    // Debounce resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newRows = Math.ceil(window.innerHeight / gridSize);
            const newCols = Math.ceil(window.innerWidth / gridSize);
            if (newRows !== rows || newCols !== cols) {
                initCyberGrid();
            }
        }, 250);
    });
};

// Optimized Section Titles Animation
const initSectionTitles = () => {
    const titles = document.querySelectorAll('.section-title');
    if (titles.length === 0) return;

    titles.forEach(title => {
        if (!title.hasAttribute('data-text')) {
            title.setAttribute('data-text', title.textContent);
        }
    });

    // Batch all title animations
    gsap.from(titles, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
            trigger: "body",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });
};

// Optimized Hero Animation using a single timeline
const initHeroAnimation = () => {
    const heroElements = {
        title: '.hero-content h1',
        subtitle: '.typing-wrapper',
        text: '.hero-content .cyber-text',
        buttons: '.hero-buttons',
        image: '.hero-image'
    };

    // Check if elements exist
    if (!document.querySelector(heroElements.title)) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    tl.from(heroElements.title, { y: 100, opacity: 0, duration: 1 })
      .from(heroElements.subtitle, { y: 50, opacity: 0, duration: 0.8 }, "-=0.5")
      .from(heroElements.text, { y: 50, opacity: 0, duration: 0.8 }, "-=0.5")
      .from(heroElements.buttons, { y: 50, opacity: 0, duration: 0.8 }, "-=0.5")
      .from(heroElements.image, { x: 100, opacity: 0, duration: 1 }, "-=1");
};

// Initialize Typed.js with optimized settings
const initTypedText = () => {
    const element = document.querySelector('#typing-text');
    if (!element) return;

    new Typed('#typing-text', {
        strings: [
            'Junior Full Stack Developer',
            'Web Designer',
            'UI/UX Designer',
            'Software Engineer',
            'Problem Solver'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 1500,
        startDelay: 1000,
        loop: true,
        showCursor: true,
        cursorChar: '|',
        autoInsertCss: true,
        smartBackspace: true
    });
};

// Optimized Mobile Menu
const initMobileMenu = () => {
    const navbar = document.querySelector('.navbar');
    const collapse = document.querySelector('.navbar-collapse');

    if (!navbar || !collapse) return;

    // Handle scroll lock
    collapse.addEventListener('show.bs.collapse', () => {
        document.body.style.overflow = 'hidden';
        navbar.classList.remove('navbar-hidden');
    });

    collapse.addEventListener('hidden.bs.collapse', () => {
        document.body.style.overflow = '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const isNavbar = navbar.contains(e.target);
        const isCollapsed = !collapse.classList.contains('show');
        
        if (!isNavbar && !isCollapsed) {
            bootstrap.Collapse.getInstance(collapse).hide();
        }
    });
};

// Project Image Carousel with Glitch Effect and Manual Controls
function initProjectCarousels() {
    const carousels = document.querySelectorAll('.project-carousel');
    
    carousels.forEach(carousel => {
        const items = carousel.querySelectorAll('.carousel-item');
        const prevBtn = carousel.querySelector('.carousel-nav.prev');
        const nextBtn = carousel.querySelector('.carousel-nav.next');
        const dots = carousel.querySelectorAll('.carousel-dot');
        let currentIndex = 0;
        let isTransitioning = false;
        let intervalId = null;
        
        function updateDots() {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        function goToSlide(index) {
            if (isTransitioning || index === currentIndex) return;
            isTransitioning = true;

            const currentImage = items[currentIndex];
            const nextImage = items[index];

            // Reset interval
            if (intervalId) {
                clearInterval(intervalId);
            }

            // Glitch transition
            currentImage.classList.add('glitch-transition');
            
            currentImage.addEventListener('animationend', function onEnd() {
                currentImage.removeEventListener('animationend', onEnd);
                currentImage.classList.remove('glitch-transition', 'active');
                nextImage.classList.add('active');
                currentIndex = index;
                updateDots();
                isTransitioning = false;

                // Restart auto-slide
                intervalId = setInterval(() => goToSlide((currentIndex + 1) % items.length), 3500);
            }, { once: true });
        }
        
        function switchImage() {
            goToSlide((currentIndex + 1) % items.length);
        }
        
        // Manual navigation - Previous
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const prevIndex = (currentIndex - 1 + items.length) % items.length;
                goToSlide(prevIndex);
            });
        }
        
        // Manual navigation - Next
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const nextIndex = (currentIndex + 1) % items.length;
                goToSlide(nextIndex);
            });
        }
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                goToSlide(index);
            });
        });
        
        // Initialize first slide and dots
        items[0].classList.add('active');
        updateDots();
        
        // Start auto-slide
        intervalId = setInterval(switchImage, 3500);
    });
}

// Dynamic copyright year
const initFooterYear = () => {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
};

// Calculate age
function calculateAge() {
    const birthDate = new Date('2004-06-15');
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    document.getElementById('age').textContent = age + ' years old';
}

// Calculate experience duration
const calculateExperience = () => {
    const startDate = new Date('2022-06-01');
    const currentDate = new Date();
    
    const years = currentDate.getFullYear() - startDate.getFullYear();
    const months = currentDate.getMonth() - startDate.getMonth();
    let duration = years;
    
    if (months < 0) {
        duration = years - 1;
    }
    
    // Only update the experience duration stat
    const expElements = document.querySelectorAll('.stat-item');
    expElements.forEach(element => {
        const label = element.querySelector('.stat-label');
        if (label && label.textContent === 'Years Experience') {
            const numberElement = element.querySelector('.stat-number');
            if (numberElement) {
                numberElement.textContent = duration + '+';
            }
        }
    });
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavbarAnimation();
    initGlitchEffect();
    initSkillBars();
    initProjectCards();
    initCyberGrid();
    initSectionTitles();
    initHeroAnimation();
    initTypedText();
    initMobileMenu();
    initProjectCarousels();
    initFooterYear();
    calculateAge();
    calculateExperience();
});

const initLoader = () => {
    document.body.classList.add('loading');
    
    // Simulate loading time for smoother transition
    setTimeout(() => {
        const loader = document.querySelector('.cyber-loader');
        document.body.classList.remove('loading');
        if (loader) {
            loader.classList.add('hidden');
            // Remove loader from DOM after transition
            loader.addEventListener('transitionend', () => {
                loader.remove();
            });
        }
    }, 2500); // Show loader for 2.5 seconds
};
