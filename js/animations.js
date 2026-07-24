/**
 * PRIZMABRIXX — Advanced GSAP & Lenis Animations
 * Extreme smooth scrolling, magnetic elements, horizontal scroll, text reveals,
 * image parallax, and ScrollTrigger powered reveals
 */

// ——— PRELOADER DRIFTING PARTICLES CANVAS ———
(function() {
    const loaderCanvas = document.getElementById('preloader-canvas');
    const preloaderElement = document.getElementById('preloader');
    if (!loaderCanvas || !preloaderElement) return;

    // Check if user has already seen the preloader this session
    if (sessionStorage.getItem('prizmabrixx_preloader_shown') === 'true') {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
        preloaderElement.style.display = 'none';
        return;
    }

    const loaderCtx = loaderCanvas.getContext('2d');
    let loaderParticles = [];

    function resizeLoaderCanvas() {
        loaderCanvas.width = window.innerWidth;
        loaderCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeLoaderCanvas);
    resizeLoaderCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * loaderCanvas.width;
            this.y = Math.random() * loaderCanvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
            this.alpha = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > loaderCanvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > loaderCanvas.height) this.speedY *= -1;
        }
        draw() {
            loaderCtx.save();
            loaderCtx.globalAlpha = this.alpha;
            loaderCtx.fillStyle = '#f59128';
            loaderCtx.beginPath();
            loaderCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            loaderCtx.fill();
            loaderCtx.restore();
        }
    }

    for (let i = 0; i < 60; i++) {
        loaderParticles.push(new Particle());
    }

    function animateLoaderParticles() {
        loaderCtx.clearRect(0, 0, loaderCanvas.width, loaderCanvas.height);
        loaderParticles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateLoaderParticles);
    }
    animateLoaderParticles();

    if (typeof gsap === 'undefined') return;

    gsap.to('.preloader-logo-img', { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1.0, delay: 0.1 });
    gsap.to('.preloader-tagline', { opacity: 1, y: 0, duration: 0.8, delay: 0.3 });
    gsap.to('.preloader-counter', { opacity: 1, duration: 0.5, delay: 0.2 });

    let percentageCount = { val: 0 };
    let isWindowLoaded = document.readyState === 'complete';
    window.addEventListener('load', () => { isWindowLoaded = true; });

    const preloaderTL = gsap.timeline();

    preloaderTL.to(percentageCount, {
        val: 85,
        duration: 1.5,
        ease: 'power1.inOut',
        onUpdate: () => {
            document.querySelector('.preloader-counter').innerText = Math.floor(percentageCount.val) + '%';
            document.querySelector('.preloader-progress-fill').style.width = percentageCount.val + '%';
        }
    });

    preloaderTL.to({}, {
        duration: 0.1,
        repeat: -1,
        onRepeat: function () {
            if (isWindowLoaded) {
                this.pause(); 
                gsap.to(percentageCount, {
                    val: 100,
                    duration: 0.5,
                    ease: 'power2.out',
                    onUpdate: () => {
                        document.querySelector('.preloader-counter').innerText = Math.floor(percentageCount.val) + '%';
                        document.querySelector('.preloader-progress-fill').style.width = percentageCount.val + '%';
                    },
                    onComplete: () => {
                        sessionStorage.setItem('prizmabrixx_preloader_shown', 'true');
                        gsap.to('#preloader', {
                            opacity: 0,
                            duration: 0.8,
                            ease: 'power2.inOut',
                            onComplete: () => {
                                document.getElementById('preloader').style.display = 'none';
                                document.body.classList.remove('loading');
                                document.body.classList.add('loaded');
                                ScrollTrigger.refresh();
                            }
                        });
                    }
                });
            }
        }
    });
})();

// ——— GSAP & LENIS SETUP ———
document.addEventListener('DOMContentLoaded', () => {
  // ---- TEXT SPLIT FOR REVEAL ANIMATIONS ----
  function splitTextForReveal(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (el.dataset.wordSplit) return;
      el.dataset.wordSplit = 'true';

      const originalNodes = Array.from(el.childNodes);
      el.innerHTML = '';

      function processNode(node, container, isGradient = false) {
        const hasGradient = isGradient || (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('gradient-text'));
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          const words = text.split(/(\s+)/);
          words.forEach(part => {
            if (!part || /^\s+$/.test(part)) return;
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.overflow = 'hidden';
            wordSpan.style.verticalAlign = 'top';

            const innerSpan = document.createElement('span');
            innerSpan.style.display = 'inline-block';
            innerSpan.style.transform = 'translateY(100%)';
            innerSpan.innerText = part + '\u00A0';
            innerSpan.classList.add('reveal-word');
            if (hasGradient) {
              innerSpan.classList.add('gradient-text');
            }

            wordSpan.appendChild(innerSpan);
            container.appendChild(wordSpan);
          });
        } else if (node.nodeName === 'BR') {
          container.appendChild(document.createElement('br'));
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const clone = node.cloneNode(false);
          Array.from(node.childNodes).forEach(child => processNode(child, clone, hasGradient));
          container.appendChild(clone);
        }
      }

      originalNodes.forEach(node => processNode(node, el));
    });
  }

  // Prepare Headings
  splitTextForReveal('.display-heading');
  splitTextForReveal('.section-heading');

  // ---- HERO SECTION ----
  const heroContent = document.querySelector('.hero-content, .page-hero-content');
  if (heroContent) {
    // 3D Parallax on scroll
    gsap.to(heroContent, {
      y: 200, rotateX: -15, scale: 0.9, opacity: 0,
      ease: "none",
      scrollTrigger: { trigger: heroContent.parentElement, start: "top top", end: "bottom top", scrub: true }
    });

    // Dramatic load animation
    const tl = gsap.timeline();
    tl.fromTo('.reveal-word', {
      y: '120%', rotateZ: 8, scale: 1.3, opacity: 0
    }, {
      y: '0%', rotateZ: 0, scale: 1, opacity: 1,
      duration: 1.5, stagger: 0.06, ease: "elastic.out(1, 0.6)", delay: 0.3
    });
    tl.fromTo('.hero-content p, .hero-content .hero-actions, .page-hero-content p, .page-hero-content .breadcrumb', {
      y: 60, opacity: 0, scale: 0.9
    }, {
      y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power4.out", stagger: 0.12
    }, "-=1");

    // Stats count-up with spring
    tl.fromTo('.hero-stats', {
      y: 80, opacity: 0, scale: 0.85
    }, {
      y: 0, opacity: 1, scale: 1, duration: 1.4, ease: "elastic.out(1, 0.6)"
    }, "-=0.8");
  }

  // ---- AWARD SHOWCASE FRAME ----
  const awardFrame = document.getElementById('award-frame');
  if (awardFrame) {
    const awardTl = gsap.timeline({
      scrollTrigger: { trigger: awardFrame, start: "top 85%", toggleActions: "play none none reverse" }
    });

    // 1. Photo emerges FIRST with a cinematic unblur and scale
    awardTl.fromTo('.award-img-container', {
      scale: 0.4, opacity: 0, rotateZ: -5, filter: "blur(20px)"
    }, {
      scale: 1, opacity: 1, rotateZ: 0, filter: "blur(0px)",
      duration: 1.4, ease: "power4.out"
    });

    // 2. Card body builds around it and rotates into place
    awardTl.fromTo('#awardCard3D', {
      backgroundColor: "rgba(30, 27, 24, 0)",
      borderColor: "rgba(245, 145, 40, 0)",
      boxShadow: "none",
      rotateY: 45, rotateX: -20, y: 60
    }, {
      backgroundColor: "rgba(30, 27, 24, 0.85)",
      borderColor: "rgba(245, 145, 40, 0.35)",
      boxShadow: "0 30px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(245, 145, 40, 0.2)",
      rotateY: 0, rotateX: 0, y: 0,
      duration: 1.2, ease: "power3.out"
    }, "-=1.0");

    // 3. Caption and badge pop with elastic bounce
    awardTl.fromTo(['.award-card-caption', '.award-card-badge'], {
      opacity: 0, scale: 0.5, y: 30
    }, {
      opacity: 1, scale: 1, y: 0,
      duration: 0.8, stagger: 0.15, ease: "back.out(2)"
    }, "-=0.6");

    gsap.fromTo('.award-chip', {
      y: 30, opacity: 0
    }, {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out",
      scrollTrigger: { trigger: '.award-highlights-grid', start: "top 85%" }
    });
  }

  // ---- SECTION HEADINGS ----
  const sectionHeadings = document.querySelectorAll('.section-heading');
  sectionHeadings.forEach(heading => {
    if (heading.closest('.hero-section') || heading.closest('.page-hero')) return;
    gsap.fromTo(heading.querySelectorAll('.reveal-word'), {
      y: '150%', rotateX: 45, opacity: 0
    }, {
      y: '0%', rotateX: 0, opacity: 1,
      duration: 1.2, stagger: 0.05, ease: "back.out(1.7)",
      scrollTrigger: { trigger: heading, start: "top 85%", toggleActions: "play none none reverse" }
    });
  });

  // ---- CARD REVEALS ----
  const staggerGroups = document.querySelectorAll('.services-grid, .work-grid, .mvv-grid, .grid-3, .grid-4, .portfolio-grid, .blog-grid, .testimonials-masonry, .bento-grid');
  staggerGroups.forEach(group => {
    const cards = group.querySelectorAll('.service-card, .work-card, .mvv-card, .testimonial-card, .why-card, .portfolio-card, .blog-card, .bento-card');
    if (cards.length > 0) {
      gsap.fromTo(cards, {
        y: 100, rotateY: 12, rotateX: -8, scale: 0.8, opacity: 0
      }, {
        y: 0, rotateY: 0, rotateX: 0, scale: 1, opacity: 1,
        duration: 1.4, stagger: 0.12, ease: "elastic.out(1, 0.75)",
        scrollTrigger: { trigger: group, start: "top 80%", toggleActions: "play none none reverse" }
      });
    }
  });

  // ---- SIMPLE REVEALS ----
  const simpleReveals = document.querySelectorAll('.reveal:not(.service-card):not(.work-card):not(.mvv-card):not(.testimonial-card):not(.why-card):not(.portfolio-card):not(.blog-card):not(.section-heading):not(.bento-card)');
  simpleReveals.forEach(el => {
    gsap.fromTo(el, { y: 50, scale: 0.9, opacity: 0 }, {
      y: 0, scale: 1, opacity: 1, duration: 1.2, ease: "power4.out",
      scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
    });
  });

  // ==========================================
  // 4. HORIZONTAL SCROLL SHOWCASE
  // ==========================================
  const horizSection = document.querySelector('.horizontal-showcase');
  if (horizSection) {
    const horizTrack = horizSection.querySelector('.horizontal-track');
    const horizItems = horizTrack.querySelectorAll('.horizontal-item');
    const totalWidth = (horizItems.length * (window.innerWidth > 768 ? 500 : 300)) + 100;

    gsap.to(horizTrack, {
      x: -(totalWidth - window.innerWidth + 100),
      ease: "none",
      scrollTrigger: {
        trigger: horizSection,
        start: "top top",
        end: () => "+=" + totalWidth,
        scrub: 1,
        pin: true,
        anticipatePin: 1
      }
    });

    // Each item scales up as it enters center
    horizItems.forEach((item, i) => {
      gsap.fromTo(item, { scale: 0.85, opacity: 0.5 }, {
        scale: 1, opacity: 1, duration: 1,
        scrollTrigger: {
          trigger: item, containerAnimation: undefined,
          start: "left 80%", end: "left 30%",
          scrub: true
        }
      });
    });
  }

  // ==========================================
  // 5. IMAGE PARALLAX WITHIN FRAMES
  // ==========================================
  const parallaxImages = document.querySelectorAll('.parallax-img-wrap');
  parallaxImages.forEach(wrap => {
    const img = wrap.querySelector('img');
    if (img) {
      gsap.fromTo(img, { yPercent: -15, scale: 1.2 }, {
        yPercent: 15, scale: 1.2, ease: "none",
        scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true }
      });
    }
  });

  // ==========================================
  // 6. PARALLAX BACKGROUNDS
  // ==========================================
  const parallaxBgs = document.querySelectorAll('.cta-banner-bg, .work-card-bg, .portfolio-card-bg');
  parallaxBgs.forEach(bg => {
    gsap.to(bg, {
      yPercent: 20, ease: "none",
      scrollTrigger: { trigger: bg.parentElement, start: "top bottom", end: "bottom top", scrub: true }
    });
  });

  // ==========================================
  // 7. COUNTER ANIMATION (if not handled by main.js)
  // ==========================================
  // (Handled by main.js IntersectionObserver)

  // ==========================================
  // 8. PROCESS / TIMELINE STAGGER
  // ==========================================
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length > 0) {
    timelineItems.forEach((item, i) => {
      const dir = item.classList.contains('timeline-item--right') ? 80 : -80;
      gsap.fromTo(item, { x: dir, opacity: 0, scale: 0.9 }, {
        x: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power4.out",
        scrollTrigger: { trigger: item, start: "top 85%", toggleActions: "play none none reverse" }
      });
    });
  }

  // ==========================================
  // 9. 3D CUBE SCROLL
  // ==========================================
  const cube = document.querySelector('.cube');
  if (cube) {
    gsap.to(cube, {
      rotateY: "+=180", rotateX: "+=90", ease: "none",
      scrollTrigger: { trigger: '.about-visual', start: "top bottom", end: "bottom top", scrub: 1 }
    });
  }

  // ==========================================
  // 10. MARQUEE SPEED BOOST ON SCROLL
  // ==========================================
  const marquees = document.querySelectorAll('.marquee-track');
  marquees.forEach(track => {
    gsap.to(track, {
      x: -200, ease: "none",
      scrollTrigger: { trigger: track.parentElement, start: "top bottom", end: "bottom top", scrub: 1 }
    });
  });

  // ==========================================
  // 11. IMAGE REVEAL WIPE
  // ==========================================
  const imageReveals = document.querySelectorAll('.img-reveal');
  imageReveals.forEach(el => {
    const overlay = el.querySelector('.img-reveal-overlay');
    if (overlay) {
      gsap.fromTo(overlay, { scaleX: 1 }, {
        scaleX: 0, duration: 1.5, ease: "power4.inOut",
        scrollTrigger: { trigger: el, start: "top 75%", toggleActions: "play none none reverse" }
      });
    }
  });

  // ==========================================
  // 12. FLOATING ELEMENTS (continuous)
  // ==========================================
  const floaters = document.querySelectorAll('.float-element');
  floaters.forEach((el, i) => {
    gsap.to(el, {
      y: "random(-20, 20)", x: "random(-10, 10)", rotation: "random(-5, 5)",
      duration: "random(3, 5)", repeat: -1, yoyo: true, ease: "sine.inOut",
      delay: i * 0.3
    });
  });

  // ==========================================
  // 13. STAGGERED LINE DRAWS (dividers)
  // ==========================================
  const dividers = document.querySelectorAll('.divider');
  dividers.forEach(div => {
    gsap.fromTo(div, { scaleX: 0, transformOrigin: "left center" }, {
      scaleX: 1, duration: 1.5, ease: "power4.inOut",
      scrollTrigger: { trigger: div, start: "top 85%", toggleActions: "play none none reverse" }
    });
  });

  // ==========================================
  // 14. PROGRESS RING DRAW
  // ==========================================
  const progressCircles = document.querySelectorAll('.progress-ring-circle');
  progressCircles.forEach(circle => {
    const target = circle.style.strokeDashoffset;
    const total = circle.style.strokeDasharray.split(',')[0] || '314';
    circle.style.strokeDashoffset = total; // start hidden
    gsap.to(circle, {
      strokeDashoffset: target, duration: 2, ease: "power3.out",
      scrollTrigger: { trigger: circle.closest('.progress-ring-container') || circle, start: "top 80%", toggleActions: "play none none reverse" }
    });
  });

});
