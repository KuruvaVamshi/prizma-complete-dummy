/**
 * PRIZMABRIXX — Particle System
 * Floating glowing particles for the hero background
 */

(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;
  let W, H;

  // Config
  const CONFIG = {
    count: 90,
    minSize: 1,
    maxSize: 3,
    speed: 0.4,
    connectDist: 130,
    colors: ['#0EA5E9', '#8B5CF6', '#38BDF8', '#A78BFA', '#7DD3FC'],
    opacity: 0.6,
  };

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createParticle() {
    return {
      x: random(0, W),
      y: random(0, H),
      vx: random(-CONFIG.speed, CONFIG.speed),
      vy: random(-CONFIG.speed, CONFIG.speed),
      size: random(CONFIG.minSize, CONFIG.maxSize),
      color: CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)],
      opacity: random(0.2, CONFIG.opacity),
      pulse: random(0, Math.PI * 2),
      pulseSpeed: random(0.01, 0.03),
    };
  }

  function init() {
    particles = [];
    for (let i = 0; i < CONFIG.count; i++) {
      particles.push(createParticle());
    }
  }

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }

  // Scroll and mouse state
  let scrollY = window.scrollY;
  let scrollVelocity = 0;
  
  window.addEventListener('scroll', () => {
    let newScrollY = window.scrollY;
    scrollVelocity = newScrollY - scrollY;
    scrollY = newScrollY;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Apply scroll velocity friction
    scrollVelocity *= 0.95;

    // Update and draw particles
    particles.forEach((p, i) => {
      // Base movement
      p.x += p.vx;
      p.y += p.vy - (scrollVelocity * 0.05 * p.size); // Parallax scroll effect
      p.pulse += p.pulseSpeed;

      // Mouse interaction (Repulsion / Attraction)
      if (mouse.x !== -999 && mouse.y !== -999) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          // Repel slightly and move towards edge of radius
          const angle = Math.atan2(dy, dx);
          const force = (150 - dist) / 150;
          p.x -= Math.cos(angle) * force * 1.5;
          p.y -= Math.sin(angle) * force * 1.5;
        }
      }

      // Wrap edges
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;

      // Pulsing opacity
      const pulseOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));

      // Draw particle (glow effect)
      const rgb = hexToRgb(p.color);
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
      glow.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${pulseOpacity})`);
      glow.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${pulseOpacity})`;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.connectDist) {
          const lineOpacity = (1 - dist / CONFIG.connectDist) * 0.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${lineOpacity})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
      
      // Connect to mouse
      if (mouse.x !== -999 && mouse.y !== -999) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const lineOpacity = (1 - dist / 150) * 0.3;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${lineOpacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });

    animId = requestAnimationFrame(draw);
  }

  // Mouse interaction
  let mouse = { x: -999, y: -999 };
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = -999;
    mouse.y = -999;
  });

  // Init
  resize();
  init();
  draw();

  // Handle resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      init();
    }, 200);
  });

  // Pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      draw();
    }
  });
})();
