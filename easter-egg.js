// ── EASTER EGG — click black hole 10x → big black hole, 20x → sanne reveal ──
const blackHole = document.querySelector('.black-hole');
const overlay   = document.getElementById('egg-overlay');
const eggCanvas = document.getElementById('egg-canvas');
const eggCtx    = eggCanvas.getContext('2d');
let clicks     = 0;
let eggT       = 0;
let eggRunning = false;

// ── Sanne image state ──
let sanneImg       = null;
let sanneLoaded    = false;
let sanneRevealed  = false;   // true once 20-click threshold is hit
let sanneAlpha     = 0;       // fades in from 0 → 1

// Pre-load the image so it's ready when needed
const _img = new Image();
_img.src = 'images/sanne.png';
_img.onload = () => { sanneImg = _img; sanneLoaded = true; };

blackHole.addEventListener('click', () => {
  clicks++;
  blackHole.classList.add('clicked');
  setTimeout(() => blackHole.classList.remove('clicked'), 150);

  if (clicks === 10) {
    openEgg();
  } else if (clicks >= 20) {
    clicks = 0;          // reset counter so it can be triggered again
    revealSanne();
  }
});

function openEgg() {
  overlay.classList.add('visible');
  if (!eggRunning) { eggRunning = true; resizeEgg(); drawEgg(); }
}

function revealSanne() {
  sanneRevealed = true;
  // make sure the overlay / animation is running
  if (!overlay.classList.contains('visible')) openEgg();
}

function resizeEgg() {
  eggCanvas.width  = window.innerWidth;
  eggCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeEgg);

// Get exact centre and radius from the CSS black hole element
function getBHMetrics() {
  const el   = document.querySelector('.black-hole');
  const rect = el.getBoundingClientRect();
  return {
    cx: rect.left + rect.width  / 2,
    cy: rect.top  + rect.height / 2,
    R:  rect.width / 2,
  };
}

// ── Canvas helpers ──
const PI2 = Math.PI * 2;

function arc(ctx, x, y, r, a0, a1, color, lw) {
  ctx.beginPath(); ctx.arc(x, y, r, a0, a1);
  ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.stroke();
}
function radialFill(ctx, x, y, r0, r1, stops) {
  const g = ctx.createRadialGradient(x, y, r0, x, y, r1);
  stops.forEach(([pos, col]) => g.addColorStop(pos, col));
  ctx.beginPath(); ctx.arc(x, y, r1, 0, PI2);
  ctx.fillStyle = g; ctx.fill();
}

// ── Draw sanne.png clipped to a circle in the event horizon ──
function drawSanne(cx, cy, R) {
  if (!sanneLoaded) return;

  // Fade in
  if (sanneAlpha < 1) sanneAlpha = Math.min(1, sanneAlpha + 0.012);

  const r = R * 0.92;   // slightly smaller than the black hole radius

  eggCtx.save();
  eggCtx.globalAlpha = sanneAlpha;

  // Clip to circle
  eggCtx.beginPath();
  eggCtx.arc(cx, cy, r, 0, PI2);
  eggCtx.clip();

  // Draw image centred
  eggCtx.drawImage(sanneImg, cx - r, cy - r, r * 2, r * 2);

  // Subtle vignette so the edges blend into the black hole ring
  const vignette = eggCtx.createRadialGradient(cx, cy, r * 0.55, cx, cy, r);
  vignette.addColorStop(0,   'rgba(0,0,0,0)');
  vignette.addColorStop(0.7, 'rgba(0,0,0,0)');
  vignette.addColorStop(1,   'rgba(0,0,0,0.85)');
  eggCtx.fillStyle = vignette;
  eggCtx.beginPath();
  eggCtx.arc(cx, cy, r, 0, PI2);
  eggCtx.fill();

  eggCtx.restore();
}

// ── Black hole draw loop ──
function drawEgg() {
  const W = eggCanvas.width, H = eggCanvas.height;
  const { cx, cy, R } = getBHMetrics();
  const TILT = -0.18, SY = 0.22;

  eggCtx.clearRect(0, 0, W, H);

  // Accretion disk — dark orange outer → bright orange-white inner
  eggCtx.save();
  eggCtx.translate(cx, cy);
  eggCtx.rotate(TILT);
  [
    [3.8,.04,'80,25,5',   .35],[3.2,.07,'100,35,8',  .40],[2.7,.10,'120,45,10', .38],
    [2.3,.13,'145,55,15', .36],[2.0,.16,'165,65,18',  .34],[1.75,.20,'185,72,22', .32],
    [1.55,.25,'205,80,28',.30],[1.40,.32,'220,85,32', .28],[1.28,.40,'235,93,52', .26],
    [1.18,.50,'240,110,60',.25],[1.10,.60,'245,130,75',.22],
    [1.05,.75,'250,160,110',.20],[1.02,.90,'255,200,170',.18],
  ].forEach(([rm, a, col, lw]) => {
    const f = 0.85 + 0.15 * Math.sin(eggT * 0.04 + rm * 2.1);
    eggCtx.beginPath();
    eggCtx.ellipse(0, 0, R*rm, R*rm*SY, 0, 0, PI2);
    eggCtx.strokeStyle = `rgba(${col},${(a*f).toFixed(3)})`;
    eggCtx.lineWidth   = R * lw;
    eggCtx.stroke();
  });
  eggCtx.restore();

  // Dust streaks — orange tones
  eggCtx.save();
  eggCtx.translate(cx, cy);
  eggCtx.rotate(TILT);
  [[R*.18,R*.22,.18,'120,45,10'],[R*.06,R*.12,.25,'185,72,22'],
   [-R*.04,R*.10,.28,'220,85,32'],[-R*.15,R*.18,.16,'100,35,8']
  ].forEach(([y, h, ma, col]) => {
    const gw = W * 1.2;
    const g  = eggCtx.createLinearGradient(-gw*.5, 0, gw*.4, 0);
    g.addColorStop(0,    `rgba(${col},0)`);
    g.addColorStop(0.3,  `rgba(${col},${(ma*.4).toFixed(3)})`);
    g.addColorStop(0.62, `rgba(${col},${ma})`);
    g.addColorStop(0.85, `rgba(${col},${(ma*.6).toFixed(3)})`);
    g.addColorStop(1,    `rgba(${col},0)`);
    eggCtx.fillStyle = g;
    eggCtx.fillRect(-gw*.5, y - h*.5, gw, h);
  });
  eggCtx.restore();

  // Lensing rings — EB5D34 orange
  const p = 0.8 + 0.2 * Math.sin(eggT * 0.045);
  [[1.08,.018,.55],[1.14,.012,.35],[1.22,.008,.20],[1.32,.005,.12]]
    .forEach(([rm, lw, a]) =>
      arc(eggCtx, cx, cy, R*rm, 0, PI2, `rgba(235,93,52,${(a*p).toFixed(3)})`, R*lw));

  // Hot spot — bright orange-white
  const hf = 0.7 + 0.3 * Math.sin(eggT * 0.07);
  radialFill(eggCtx, cx+R*1.08, cy+R*0.08, 0, R*0.28, [
    [0,    `rgba(255,210,190,${(0.75*hf).toFixed(3)})`],
    [0.25, `rgba(245,150,100,${(0.55*hf).toFixed(3)})`],
    [0.55, `rgba(235,93,52,${(0.30*hf).toFixed(3)})`],
    [1,    'rgba(180,50,10,0)'],
  ]);

  // Ambient glow — deep orange
  radialFill(eggCtx, cx+R*.3, cy+R*.15, R*.9, R*4.5, [
    [0,    'rgba(60,20,5,0)'],
    [0.18, 'rgba(80,28,8,0.18)'],
    [0.45, 'rgba(50,15,4,0.12)'],
    [1,    'rgba(0,0,0,0)'],
  ]);

  // Event horizon (solid black — drawn before sanne so image paints on top)
  eggCtx.beginPath(); eggCtx.arc(cx, cy, R, 0, PI2);
  eggCtx.fillStyle = '#000'; eggCtx.fill();
  arc(eggCtx, cx, cy, R, 0, PI2, 'rgba(80,20,5,0.5)', R*0.015);

  // ── Sanne reveal (only after 20 clicks) ──
  if (sanneRevealed) drawSanne(cx, cy, R);

  // Photon ring drawn last so it sits on top of everything
  const pr = 0.8 + 0.2 * Math.sin(eggT * 0.055);
  eggCtx.save();
  eggCtx.translate(cx, cy); eggCtx.rotate(TILT); eggCtx.scale(1, SY*1.4);
  arc(eggCtx, 0, 0, R*1.035, Math.PI, PI2, `rgba(180,60,20,${(0.15*pr).toFixed(3)})`, R*0.018);
  [[.08,.18,'180,60,20'],[.04,.45,'220,85,40'],[.018,.85,'235,93,52'],[.008,1,'255,180,140']]
    .forEach(([lw, a, col]) =>
      arc(eggCtx, 0, 0, R*1.035, 0, Math.PI, `rgba(${col},${(a*pr).toFixed(3)})`, R*lw));
  eggCtx.restore();

  eggT++;
  if (eggRunning) requestAnimationFrame(drawEgg);
}