/**
 * PRIZMABRIXX — Main JavaScript
 * Navbar, scroll animations, mobile menu, counters
 */

document.addEventListener('DOMContentLoaded', () => {

  // =====================
  // NAVBAR SCROLL EFFECT
  // =====================
  const navbar = document.getElementById('navbar');

  if (navbar) {
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      // Smart header: hide on scroll down, show on up
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        navbar.classList.add('nav-hidden');
      } else {
        navbar.classList.remove('nav-hidden');
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run on load
  }

  // =====================
  // DYNAMIC ACTIVE LINK
  // =====================
  const currentPath = window.location.pathname;
  let activeFound = false;
  document.querySelectorAll('.nav-menu a.nav-link').forEach(link => {
      // Remove any pre-existing active class
      link.classList.remove('active');
      
      const linkPath = new URL(link.href).pathname;
      // Compare paths, handling index.html and root
      if (currentPath === linkPath || (currentPath.endsWith('/') && linkPath.endsWith('index.html'))) {
          link.classList.add('active');
          activeFound = true;
      }
  });
  
  // fallback for home if nothing matches
  if (!activeFound) {
      const homeLink = document.getElementById('nav-home');
      if (homeLink) homeLink.classList.add('active');
  }

  // =====================
  // MOBILE MENU
  // =====================
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    const toggleMenu = (open) => {
      menuToggle.classList.toggle('active', open);
      navMenu.classList.toggle('active', open);
      menuToggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('active');
      toggleMenu(!isOpen);
    });

    // Close on link click
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (navbar && !navbar.contains(e.target)) {
        if (navMenu.classList.contains('active')) toggleMenu(false);
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) toggleMenu(false);
    });
  }

  // =====================
  // SCROLL REVEAL (REMOVED)
  // =====================
  // Old CSS-based IntersectionObserver logic removed in favor of GSAP ScrollTrigger
  // =====================
  // ANIMATED COUNTERS
  // =====================
  const counters = [
    { id: 'stat-years',    target: 8,   suffix: '+', duration: 1500 },
    { id: 'stat-projects', target: 500, suffix: '+', duration: 2000 },
    { id: 'stat-clients',  target: 50,  suffix: '+', duration: 1800 },
    { id: 'stat-services', target: 9,   suffix: '',  duration: 1200 },
  ];

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function animateCounter(el, target, suffix, duration) {
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOut(progress) * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const statsSection = document.getElementById('hero-stats');
  if (statsSection && 'IntersectionObserver' in window) {
    let counted = false;
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        counters.forEach(({ id, target, suffix, duration }) => {
          const el = document.getElementById(id);
          if (el) animateCounter(el, target, suffix, duration);
        });
        statsObserver.disconnect();
      }
    }, { threshold: 0.1 });
    statsObserver.observe(statsSection);
  }

  // =====================
  // ACTIVE NAV LINK
  // =====================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar-nav a, .mobile-nav a');
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // =====================
  // SMOOTH PARALLAX (hero) (REMOVED)
  // =====================
  // Replaced by GSAP in animations.js
  // =====================
  // CURSOR GLOW EFFECT (REMOVED FOR PERFORMANCE)
  // =====================

  // =====================
  // SERVICE CARD TILT
  // =====================
  const cards = document.querySelectorAll('.service-card, .glass-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // =====================
  // WORK CARD HOVER
  // =====================
  const workCards = document.querySelectorAll('.work-card');
  workCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.querySelector('.work-card-bg').style.backgroundPosition = `${x}% ${y}%`;
    });
  });

  console.log('%c✨ Prizmabrixx', 'color: #0EA5E9; font-size: 20px; font-weight: 900;');
  console.log('%cBuilt with passion for immersive experiences.', 'color: #8B5CF6; font-size: 12px;');
});
