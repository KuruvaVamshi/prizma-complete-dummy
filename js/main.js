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
  const rawPath = window.location.pathname.toLowerCase();
  const currentPath = rawPath.replace(/\/$/, "");

  // Determine current page name (e.g. "index", "about", "contact", "portfolio-page")
  let currentBase = currentPath.split('/').filter(Boolean).pop() || 'index';
  currentBase = currentBase.replace(/\.html$/, '');

  const isHomeCurrent = currentBase === 'index' || currentBase === 'prizma-main';

  document.querySelectorAll('.nav-menu a.nav-link').forEach(link => {
    link.classList.remove('active');
    
    try {
      const linkUrl = new URL(link.href, window.location.origin);
      let linkPath = linkUrl.pathname.toLowerCase().replace(/\/$/, "");
      let linkBase = linkPath.split('/').filter(Boolean).pop() || 'index';
      linkBase = linkBase.replace(/\.html$/, '');

      const isHomeLink = linkBase === 'index' || linkBase === 'prizma-main';

      if (isHomeCurrent && isHomeLink) {
        link.classList.add('active');
      } else if (!isHomeCurrent && !isHomeLink && (currentBase === linkBase || currentPath.endsWith(linkBase))) {
        link.classList.add('active');
      }
    } catch (e) {
      console.error(e);
    }
  });

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
