// ── CURSOR MODES ──
// Keybinds: A = astronaut, G = gravity trail, B = black hole, L = laser, S = supernova, ESC = normal

(function () {
  // ── Setup: canvas + cursor element ──
  const canvas = document.createElement('canvas');
  canvas.id = 'cursor-canvas';
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9998;';
  document.body.appendChild(canvas);

  const cursorEl = document.createElement('div');
  cursorEl.id = 'cursor-el';
  cursorEl.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;top:0;left:0;will-change:transform;';
  document.body.appendChild(cursorEl);

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── State ──
  let mode = 'normal';
  let mx = -999, my = -999;
  let particles = [];
  let laserPoints = [];
  let astro = { x: -999, y: -999 };

  // ── Cursor SVG shapes ──
  const CURSORS = {
    normal: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
      <path d="M4 2 L4 16 L8 12 L11 18 L13 17 L10 11 L16 11 Z" fill="white" stroke="black" stroke-width="1"/>
    </svg>`,

    astronaut: `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <!-- helmet -->
      <ellipse cx="18" cy="15" rx="11" ry="13" fill="#dde5f9"/>
      <!-- visor -->
      <ellipse cx="18" cy="14" rx="8" ry="9" fill="#1a1a2e"/>
      <ellipse cx="18" cy="14" rx="8" ry="9" fill="rgba(110,200,255,0.15)"/>
      <!-- visor shine -->
      <ellipse cx="14" cy="11" rx="2.5" ry="2" fill="rgba(255,255,255,0.35)" transform="rotate(-15,14,11)"/>
      <!-- suit body -->
      <rect x="10" y="26" width="16" height="12" rx="5" fill="#dde5f9"/>
      <!-- arms -->
      <rect x="3" y="27" width="7" height="5" rx="2.5" fill="#dde5f9"/>
      <rect x="26" y="27" width="7" height="5" rx="2.5" fill="#dde5f9"/>
      <!-- legs -->
      <rect x="12" y="37" width="5" height="6" rx="2.5" fill="#dde5f9"/>
      <rect x="19" y="37" width="5" height="6" rx="2.5" fill="#dde5f9"/>
      <!-- chest light -->
      <circle cx="18" cy="31" r="2" fill="#eb5d34" opacity="0.8"/>
    </svg>`,

    comet: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
      <circle cx="11" cy="11" r="6" fill="#eb5d34"/>
      <circle cx="11" cy="11" r="3.5" fill="#ffb07a"/>
      <circle cx="9.5" cy="9.5" r="1.2" fill="rgba(255,255,255,0.6)"/>
    </svg>`,

    blackhole: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="11" fill="black"/>
      <ellipse cx="20" cy="20" rx="18" ry="7" fill="none" stroke="rgba(235,93,52,0.6)" stroke-width="2"/>
      <ellipse cx="20" cy="20" rx="15" ry="5" fill="none" stroke="rgba(235,93,52,0.4)" stroke-width="1.5"/>
      <ellipse cx="20" cy="20" rx="12" ry="3.5" fill="none" stroke="rgba(235,93,52,0.25)" stroke-width="1"/>
      <circle cx="20" cy="20" r="11" fill="black"/>
    </svg>`,

    laser: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
      <path d="M4 2 L4 16 L8 12 L11 18 L13 17 L10 11 L16 11 Z" fill="#6ee7ff" stroke="rgba(0,200,255,0.8)" stroke-width="0.8"/>
    </svg>`,

    supernova: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="5" fill="#ffb07a"/>
      <circle cx="14" cy="14" r="3" fill="white" opacity="0.9"/>
      <line x1="14" y1="1" x2="14" y2="8"  stroke="#eb5d34" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="14" y1="20" x2="14" y2="27" stroke="#eb5d34" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="1"  y1="14" x2="8"  y2="14" stroke="#eb5d34" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="20" y1="14" x2="27" y2="14" stroke="#eb5d34" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="4"  y1="4"  x2="9"  y2="9"  stroke="#eb5d34" stroke-width="2" stroke-linecap="round"/>
      <line x1="19" y1="19" x2="24" y2="24" stroke="#eb5d34" stroke-width="2" stroke-linecap="round"/>
      <line x1="24" y1="4"  x2="19" y2="9"  stroke="#eb5d34" stroke-width="2" stroke-linecap="round"/>
      <line x1="9"  y1="19" x2="4"  y2="24" stroke="#eb5d34" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  };

  // Cursor anchor offsets (centers the shape on the pointer tip)
  const OFFSETS = {
    normal:    { x: -2,  y: -2  },
    astronaut: { x: -18, y: -22 },
    comet:     { x: -11, y: -11 },
    blackhole: { x: -20, y: -20 },
    laser:     { x: -2,  y: -2  },
    supernova: { x: -14, y: -14 },
  };

  const TOAST_LABELS = {
    normal:    'NORMAL MODE',
    astronaut: 'ASTRONAUT — drifting in the void',
    comet:     'GRAVITY TRAIL — leaving stardust',
    blackhole: 'BLACK HOLE — consuming everything',
    laser:     'LASER — cutting through space',
    supernova: 'SUPERNOVA — click to explode',
  };

  // ── Toast notification ──
  let toastTimeout;
  function showToast(text) {
    let toast = document.getElementById('cursor-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cursor-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 32px;
        left: 50%;
        transform: translateX(-50%) translateY(10px);
        background: rgba(10,10,20,0.85);
        border: 0.5px solid rgba(235,93,52,0.5);
        color: rgba(255,255,255,0.85);
        font-family: 'Orbitron', 'Rajdhani', monospace;
        font-size: 0.65rem;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        padding: 8px 20px;
        border-radius: 4px;
        z-index: 99999;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        backdrop-filter: blur(8px);
        white-space: nowrap;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
    }, 2000);
  }

  // ── Set mode ──
  function setMode(m) {
    mode = m;
    particles = [];
    laserPoints = [];
    cursorEl.innerHTML = CURSORS[m];
    const off = OFFSETS[m];
    cursorEl.style.transform = `translate(${off.x}px, ${off.y}px)`;
    showToast(TOAST_LABELS[m]);
    document.body.style.cursor = 'none';
  }
  setMode('normal');

  // ── Hide default cursor globally ──
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    *, *::before, *::after { cursor: none !important; }
    #cursor-canvas { cursor: none !important; }
  `;
  document.head.appendChild(styleTag);

  // ── Mouse tracking ──
  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;

    if (mode !== 'astronaut') {
      cursorEl.style.left = mx + 'px';
      cursorEl.style.top  = my + 'px';
    }

    // Comet: particle trail
    if (mode === 'comet') {
      for (let i = 0; i < 4; i++) {
        particles.push({
          x:    mx,
          y:    my,
          vx:   (Math.random() - 0.5) * 2.5,
          vy:   (Math.random() - 0.5) * 2.5 - 0.5,
          life: 1,
          size: Math.random() * 3 + 1,
          col:  Math.random() > 0.5 ? '#eb5d34' : '#6ee7ff',
        });
      }
    }

    // Laser: trail points
    if (mode === 'laser') {
      laserPoints.push({ x: mx, y: my, life: 1 });
      if (laserPoints.length > 35) laserPoints.shift();
    }

    // Black hole: inward-sucking particles
    if (mode === 'blackhole') {
      if (Math.random() < 0.6) {
        const angle = Math.random() * Math.PI * 2;
        const dist  = 40 + Math.random() * 80;
        particles.push({
          x:    mx + Math.cos(angle) * dist,
          y:    my + Math.sin(angle) * dist,
          tx:   mx,
          ty:   my,
          life: 1,
          size: Math.random() * 2 + 0.5,
          col:  Math.random() > 0.5 ? '#eb5d34' : 'rgba(235,93,52,0.5)',
        });
      }
    }
  });

  // ── Click: supernova burst ──
  window.addEventListener('click', e => {
    if (mode === 'supernova') {
      for (let i = 0; i < 50; i++) {
        const angle = (i / 50) * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        const cols  = ['#ffffff', '#eb5d34', '#ffb07a', '#6ee7ff', '#ffd700'];
        particles.push({
          x:    e.clientX,
          y:    e.clientY,
          vx:   Math.cos(angle) * speed,
          vy:   Math.sin(angle) * speed,
          life: 1,
          size: Math.random() * 5 + 1,
          col:  cols[Math.floor(Math.random() * cols.length)],
        });
      }
    }
  });

  // ── Keybinds ──
  const KEY_MAP = {
    '1': 'astronaut',
    '2': 'comet',
    '3': 'blackhole',
    '4': 'laser',
    '5': 'supernova',
    'Escape': 'normal',
  };
  window.addEventListener('keydown', e => {
    const m = KEY_MAP[e.key] || KEY_MAP[e.key.toLowerCase()];
    if (m) setMode(m);
  });

  // ── Draw loop ──
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Comet trail
    if (mode === 'comet') {
      particles.forEach(p => {
        p.x    += p.vx;
        p.y    += p.vy;
        p.life -= 0.035;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.col;
        ctx.fill();
      });
      particles = particles.filter(p => p.life > 0);
    }

    // Laser beam
    if (mode === 'laser') {
      laserPoints.forEach(p => p.life -= 0.05);
      laserPoints = laserPoints.filter(p => p.life > 0);
      if (laserPoints.length > 2) {
        // Outer glow
        ctx.save();
        ctx.shadowColor = '#6ee7ff';
        ctx.shadowBlur  = 12;
        ctx.beginPath();
        ctx.moveTo(laserPoints[0].x, laserPoints[0].y);
        laserPoints.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = 'rgba(110,231,255,0.25)';
        ctx.lineWidth   = 6;
        ctx.globalAlpha = 1;
        ctx.stroke();
        // Core beam
        ctx.beginPath();
        ctx.moveTo(laserPoints[0].x, laserPoints[0].y);
        laserPoints.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = '#6ee7ff';
        ctx.lineWidth   = 1.5;
        ctx.stroke();
        ctx.restore();
      }
    }

    // Black hole: particles sucked inward
    if (mode === 'blackhole') {
      particles.forEach(p => {
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        p.x    += dx * 0.1;
        p.y    += dy * 0.1;
        p.life -= 0.025;
        ctx.globalAlpha = Math.max(0, p.life * 0.8);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.col;
        ctx.fill();
      });
      particles = particles.filter(p => p.life > 0);
    }

    // Supernova explosion
    if (mode === 'supernova') {
    particles.forEach(p => {
        // update physics
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.08;   // gravity
        p.vx *= 0.99;   // drag

        // clamp life so it never goes negative
        p.life = Math.max(0, p.life - 0.02);

        // skip dead particles
        if (p.life === 0) return;

        // draw
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.col;
        ctx.fill();
    });

    // remove dead particles
    particles = particles.filter(p => p.life > 0);

    // reset alpha (important!)
    ctx.globalAlpha = 1;
    }


    // Astronaut: smooth lag follow
    if (mode === 'astronaut') {
      if (astro.x === -999) { astro.x = mx; astro.y = my; }
      astro.x += (mx - astro.x) * 0.07;
      astro.y += (my - astro.y) * 0.07;
      const off = OFFSETS.astronaut;
      cursorEl.style.left = (astro.x) + 'px';
      cursorEl.style.top  = (astro.y) + 'px';
      cursorEl.style.transform = `translate(${off.x}px, ${off.y}px)`;
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
})();