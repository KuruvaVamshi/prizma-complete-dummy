/**
 * PRIZMABRIXX — Main JavaScript
 * Navbar, scroll animations, mobile menu, counters
 */

document.addEventListener('DOMContentLoaded', () => {

  // =====================
  // DARK / LIGHT THEME SWITCHER
  // =====================
  // DARK / LIGHT THEME SWITCHER INIT
  // =====================
  (() => {
    const savedTheme = localStorage.getItem('theme-preference') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-mode');
      if (document.body) document.body.classList.add('dark-mode');
    }
  })();

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
  const allNavLinks = document.querySelectorAll('.nav-menu a.nav-link');
  allNavLinks.forEach(link => link.classList.remove('active'));

  if (rawPath.includes('portfolio')) {
    const pLink = document.getElementById('nav-portfolio');
    if (pLink) pLink.classList.add('active');
  } else if (rawPath.includes('about')) {
    const aLink = document.getElementById('nav-about');
    if (aLink) aLink.classList.add('active');
  } else if (rawPath.includes('contact')) {
    const cLink = document.getElementById('nav-contact');
    if (cLink) cLink.classList.add('active');
  } else {
    const hLink = document.getElementById('nav-home');
    if (hLink) hLink.classList.add('active');
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
  // ANIMATED COUNTERS
  // =====================
  const counters = [
    { id: 'stat-years', target: 8, suffix: '+', duration: 1500 },
    { id: 'stat-projects', target: 500, suffix: '+', duration: 2000 },
    { id: 'stat-clients', target: 50, suffix: '+', duration: 1800 },
    { id: 'stat-services', target: 9, suffix: '', duration: 1200 },
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

  // =====================
  // HERO DYNAMIC TYPING EFFECT
  // =====================
  const dynamicText = document.querySelector('.dynamic-type-text');
  const typeCursor = document.querySelector('.type-cursor');
  if (dynamicText) {
    const words = [
      { text: "Walkthrough", class: "color-orange", cursor: "#E07820" },
      { text: "AR Experiences", class: "color-orange", cursor: "#E07820" },
      { text: "3D Reality", class: "color-orange", cursor: "#E07820" },
      { text: "Metaverse", class: "color-orange", cursor: "#E07820" }
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    // Set initial class
    dynamicText.classList.add(words[0].class);

    function typeEffect() {
      const currentWordObj = words[wordIndex];
      const currentWord = currentWordObj.text;

      if (isDeleting) {
        dynamicText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        dynamicText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;

        // Remove old class
        dynamicText.classList.remove(words[wordIndex].class);

        // Move to next word
        wordIndex = (wordIndex + 1) % words.length;

        // Add new class and cursor color
        dynamicText.classList.add(words[wordIndex].class);
        if (typeCursor) {
          typeCursor.style.color = words[wordIndex].cursor;
        }

        typeSpeed = 500; // Pause before typing new word
      }

      setTimeout(typeEffect, typeSpeed);
    }

    // Start typing effect slightly delayed
    setTimeout(typeEffect, 1000);
  }

  // =====================
  // HERO MOUSE SPOTLIGHT
  // =====================
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const spotlight = document.createElement('div');
    spotlight.classList.add('hero-spotlight');
    heroSection.appendChild(spotlight);

    heroSection.addEventListener('mousemove', (e) => {
      spotlight.style.opacity = '1';
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlight.style.left = `${x}px`;
      spotlight.style.top = `${y}px`;
    });

    heroSection.addEventListener('mouseleave', () => {
      spotlight.style.opacity = '0';
    });
  }

  console.log('%c✨ Prizmabrixx', 'color: #0EA5E9; font-size: 20px; font-weight: 900;');
  console.log('%cBuilt with passion for immersive experiences.', 'color: #8B5CF6; font-size: 12px;');
});
