// ── ROCKET SCROLLBAR ──────────────────────────────────────────────────────
// Injects a rocket SVG that rides the right edge of the viewport,
// tracking scroll progress. Pairs with rocket-scrollbar.css.
// ─────────────────────────────────────────────────────────────────────────

(function () {
  // ── 1. Inject track element ──
  const track = document.createElement('div');
  track.id = 'rocket-track';
  document.body.appendChild(track);

  // ── 2. Inject rocket SVG ──
  // Pointing UP (nose cone at top), flame at bottom.
  // Colours match the site palette: #eb5d34 body, #dde5f9 hull, #6ee7ff window.
  const rocket = document.createElement('div');
  rocket.id = 'rocket-thumb';
  rocket.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 18 32"
         width="28" height="50"
         aria-hidden="true">

      <!-- Exhaust flame (bottom, always visible) -->
      <ellipse cx="9" cy="30" rx="3.5" ry="3"
               fill="#eb5d34" opacity="0.85"/>
      <ellipse cx="9" cy="29" rx="2" ry="1.8"
               fill="#ffb07a" opacity="0.9"/>

      <!-- Body -->
      <path d="M4 22 Q4 8 9 2 Q14 8 14 22 Z"
            fill="#dde5f9"/>

      <!-- Side fins -->
      <path d="M4 22 L1 28 L5 24 Z"  fill="#eb5d34"/>
      <path d="M14 22 L17 28 L13 24 Z" fill="#eb5d34"/>

      <!-- Cockpit window -->
      <ellipse cx="9" cy="14" rx="2.8" ry="3"
               fill="#6ee7ff" opacity="0.75"/>
      <ellipse cx="8.2" cy="13" rx="1" ry="1.2"
               fill="rgba(255,255,255,0.45)"/>

      <!-- Centre stripe -->
      <line x1="9" y1="18" x2="9" y2="22"
            stroke="#eb5d34" stroke-width="1" stroke-linecap="round"/>
    </svg>`;
  document.body.appendChild(rocket);

  // ── 3. Scroll handler ──
  let scrollTimer;

  function onScroll() {
    const scrollTop  = window.scrollY;
    const maxScroll  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = maxScroll > 0 ? scrollTop / maxScroll : 0;

    // Position rocket — moves top to bottom as you scroll
    const minY = 16;                            // top of viewport
    const maxY = window.innerHeight - 16;       // bottom of viewport
    const rocketY = minY + pct * (maxY - minY);
    rocket.style.top = rocketY + 'px';

    // Update the CSS custom property that drives the track fill
    track.style.setProperty('--scroll-pct', (pct * 100).toFixed(2) + '%');

    // Throb effect while scrolling
    rocket.classList.add('burning');
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => rocket.classList.remove('burning'), 200);
  }

  // Run once on load to set initial position (top of page = rocket at top)
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
})();