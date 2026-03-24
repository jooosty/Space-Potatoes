// ── Satellite hotspot interaction ──
const components = {
  1:  { name: 'X-ray Instrument',
        desc: '10 Wolter type 1 concentrators (10 cm dia., 30 nested gold-coated mirrors on Al substrate). Effective area: 200 cm² at 1 keV, 180 cm² at 6 keV. Focal length 800 mm, L=200 mm, radius 50 mm. The OBA houses concentrators in a 3-2-3-2 hexagonal layout (30 mm thick Al 6061-T6). The FPA houses 10 Amptek FastSDD detectors + 2 calibration modules. Instrument mass: ≤41.9 kg. Mounted to the Payload Module via three titanium bipod isostatic mounts onto a 22 mm composite honeycomb panel, minimising thermal conduction and isolating mechanical loads. Extends along the spacecraft Z-axis to use the full vertical height envelope of the Falcon 9 half-plate rideshare fairing.' },
  2:  { name: '2× Battery Packs',
        desc: 'Li-ion battery packs positioned at the top of the bus module, mounted to the aluminium frame to allow efficient thermal conduction toward the external radiator panels. Active during Sun Acquisition Mode (post-separation) and Safe Mode. The bus module CoG is kept near the CoP through mass-optimised subsystem placement to balance the spacecraft MMOI for efficient AOCS performance. Stowed CoG: x=453.9 mm, y=−1.0 mm, z=43.1 mm.' },
  3:  { name: 'Star Tracker Module',
        desc: 'Two ST-16RT2 star trackers on a milled Al 6061-T6 hub coated with SurTec 650. One bay is boresight-aligned with the instrument; the other is tilted 30° for continuous attitude confirmation. Hub closed by a formed coversheet; ST baffles installed after coversheet. Mounted via four M5 connections to the CFRP endplate with harness cutouts connecting to the AOCS system. External mounting required — internal cut-outs would create stress concentrations violating minimum insert spacing in the thin panelling.' },
  4:  { name: 'Bus Subsystem Rack',
        desc: 'Houses the PDU, ACU, PMU, and 2× S-band transceivers. The Bus Module hosts all operational and support subsystems (power, avionics, propulsion). Subsystem placement is mass-optimised to keep CoG near CoP for efficient AOCS. A reinforced sandwich panel mid-plane separates the instrument bay from the bus and serves as interface platform for subsystems, mechanically joined to the main structure via L-brackets with stiffening ribs for proper load transfer and joint rigidity.' },
  5:  { name: 'Dawn 4U Cubedrive',
        desc: 'Al 6061-T6 propulsion module with SurTec 650 coating and stiffened ribs (300×300×94 mm). Mounted externally aligned with the spacecraft CoG to prevent induced tumbling. Bolted to the side of the bus directly onto the CFRP sandwich panel using specialised inserts. A central cutout accommodates the nozzle. Internal accommodation would have required significantly widening the bus, causing mass and volume penalties.' },
  6:  { name: '2× S-band Antennas',
        desc: 'Mounted in Z- and X+ directions, Earth-facing during nominal pointing to maximise TT&C and science downlink. Max data rate: 76.4 kbps. RS485 used for internal data transmission; SpaceWire interface also supported. Spacing between components reserved to accommodate harness routing and thermal interfaces per ECSS-E-HB-32-22 guidelines.' },
  7:  { name: 'GNSS Receiver',
        desc: 'GPS/Galileo receiver for real-time orbit determination and absolute timestamp reference for the IRUs. Ensures photon timing accuracy (1 µs resolution) does not drift over time. Provides position data used to verify orbit maintenance manoeuvres performed by the Cubedrive propulsion module.' },
  8:  { name: '4× Coarse Sun Sensors',
        desc: '4 units on orthogonal faces for near 360° sun vector coverage. Critical during Sun Acquisition Mode (post-separation, no solar power yet) and Safe Mode (only essential systems active for failure recovery). Structural inserts spaced per ECSS-E-HB-32-22 guidelines to avoid concentrated stress zones in the composite panels.' },
  9:  { name: 'Instrument Electronics',
        desc: '2 hot-redundant Instrument Readout Units (IRUs). Each contains: Amptek PA-210 preamplifier, TI ADC3683-SP (18-bit, 65 MSPS), Microchip RT PolarFire FPGA (RTPF5000, radiation-hardened), SAM3X8ERT MCU, and Cockroft-Walton 130V bias generator. IRU enclosure: 13.91×13.91×5.9 cm, 0.952 kg, 35.72 W peak, ~$249,708 for both units. Clearance beneath instrument structure ensures readout electronics and cable routing remain accessible without impacting structural integrity.' },
  10: { name: '3× Magnetotorquers',
        desc: 'Three rods placed externally along x, y, z axes to maximise distance from battery packs, which would interfere with the magnetic dipole. Used for attitude control and reaction wheel momentum dumping. Dry film lubricant (MoS₂) applied to mating surfaces to mitigate cold welding in vacuum. All aluminium components treated with SurTec 650 chromate conversion coating for corrosion resistance and electrical conductivity.' },
  11: { name: 'SADM',
        desc: 'Solar Array Drive Mechanism located on the bus side, mounted via a dedicated interface panel. Final SADM selection pending; sufficient interface volume, mass margins, and mounting brackets reserved. Reaction wheels are placed as close as possible to the CoG to improve manoeuvrability. SADM connection plate ties into the triangulated network so loads flow through multiple paths.' },
  12: { name: 'Reaction Wheel Module',
        desc: 'Al 6061-T6 hub (5 mm thick baseplate) with SurTec 650 coating. Tetrahedral (pyramid) configuration with each wheel spin axis at ~54.7° elevation from the S/C principal axis — derived from regular tetrahedron geometry for symmetrically distributed torque vectors across all three axes. 4× M4 connections to S/C structure. Configuration modified to fit within bus dimensional constraints. Reaction wheels placed as close as possible to CoG.' },
  13: { name: 'OBC, TCM & IMU',
        desc: 'On-Board Computer, Thermal Control Module, and Inertial Measurement Unit. MLI (multi-layer insulation) across the S/C external structure reduces temperature gradients during orbital operations, dampening thermal cycling expansion/contraction loads. Highly conductive aluminium frame members combined with insulating CFRP panels allow targeted thermal management. Active in all modes except Launch Mode.' },
};

// ── Additional diagram component data ──
const diagComponents = {
  ext: {
    1: { name: 'Star Tracker',                     desc: 'Two ST-16RT2 star trackers mounted externally on a milled Al 6061-T6 hub (SurTec 650 coated). External mounting required because internal cut-outs would create stress concentrations violating minimum insert spacing in the thin CFRP panelling.' },
    2: { name: 'Dawn 4U Cubedrive (Propulsion)',    desc: 'Al 6061-T6 propulsion module (300×300×94 mm) with stiffened ribs, mounted externally aligned with the S/C CoG. Central cutout accommodates the nozzle. Bolted to CFRP sandwich panel using specialised inserts. External mounting avoids widening the bus.' },
    3: { name: '2× S-band Antennas',               desc: 'Mounted in Z- and X+ directions for Earth-facing TT&C and science downlink. Max data rate: 76.4 kbps. RS485 internal data bus; SpaceWire interface also supported.' },
    4: { name: '4× Coarse Sun Sensors',             desc: '4 units on orthogonal faces providing near 360° sun vector coverage. Critical during Sun Acquisition and Safe modes. Structural inserts spaced per ECSS-E-HB-32-22 guidelines.' },
    5: { name: '3× Magnetotorquers',                desc: 'Three external rods along x, y, z axes — placed far from battery packs to prevent magnetic dipole interference. Used for attitude control and reaction wheel momentum dumping. Dry film MoS₂ lubricant on mating surfaces.' },
  },
  str: {
    1: { name: 'X-direction X-braced Panel',          desc: 'Full-height cross-braced CFRP composite sandwich panel carrying primary structural loads. Connected at junctions with M6 bolts through fully potted protruding Helicoil® inserts. Truss topology (X-brace, diagonal ribs) chosen for maximum stiffness-to-mass ratio. CFRP skins: 4-ply quasi-isotropic [0°/+45°/−45°/90°] M46J fibre on 20 mm Al 5056 honeycomb core.' },
    2: { name: 'X-direction X-braced Panel (bus side)', desc: 'Right-face X-braced panel visible in isometric view. Carries loads from bus subsystem mounting brackets. Connected to L-brackets at top and bottom. Composite sandwich construction matches instrument-side panel for symmetric stiffness distribution.' },
    3: { name: 'Launch Vehicle Adapter Ring',         desc: 'Rocket Lab MkII MLB 15-inch motorised lightband (28 threaded holes, ring thickness 25 mm). DB-9 electrical interface. SoftRide isolation system provides 3–25% additional damping. 15" diameter: ~6.6× stiffer than 8" MLB. Heritage: Sentinel 2. SurTec 650 coated.' },
    4: { name: 'Central Mounting Sandwich Panel',      desc: 'Reinforced sandwich panel mid-plane separating instrument bay from bus module. Mechanically joined via L-brackets with stiffening ribs ensuring joint rigidity. Serves as interface platform for bus subsystems. FPA accessible through side-panel cut-outs after assembly. Floating interfaces and proud (protruding) Helicoil® inserts mitigate CTE mismatch between Al (23.6 µm/m·K) and CFRP (~0 in-plane expansion).' },
    5: { name: 'Stiffened T-joint L-brackets',         desc: '5-rib L-brackets at all panel junctions. MJ bolt fasteners with preloads calculated per ECSS-E-HB-32-23. Honeycomb panel inserts: Al 6061-T6 with SurTec 650, stainless steel Helicoil® coils. Through-thickness fully potted inserts for high-load M6 connections use protruding flanges to improve pull-out and shear capacity. Flange diameters: M4=12 mm, M5=14 mm, M6=16 mm.' },
    6: { name: 'SADM Connection Plate',                desc: 'Horizontal bracket between bus X-braced bays, reserved with sufficient interface volume and mass margins for final SADM selection. Tied into the triangulated network distributing SADM loads across multiple paths. Total S/C mass: 59.5 kg (including ESA margin philosophy). Stowed MMOI: Ixx=16.00, Iyy=21.65, Izz=12.51 kg·m².' },
    7: { name: 'Y-direction X-braced Panel',           desc: 'Two shorter bus-side X-braced panels completing the six-sided enclosure. Six-sided design enables flexible concentrator layout while minimising volume. Composite sandwich skins bolt to truss perimeter and to dedicated brackets on top and bottom side-frames, completing the lightweight enclosure and carrying lower-level subsystem loads.' },
  },
  lv: {
    1: { name: 'M6 Interface Holes',              desc: 'Connect top and bottom CRFP skins to the solid Al 6061-T6 core. CFRP panels clamped with 0.5 mm thermal expansion gap. Al 6061-T6 inserts with SurTec 650 coating eliminate galvanic corrosion at the CFRP/Al interface. Flange thickness increased at M6 connections for enhanced bearing area under dynamic launch loads per ECSS, 2011, §10.3.5.' },
    2: { name: 'M6 Countersunk Clearance Holes',  desc: 'Transfer LV interface loads to the skeletal frame in the x-direction. Web/edge thickness: 20 mm; milled web: 4 mm. Solid Al 6061-T6 used (not CFRP) because CRFP is prone to delamination and stress concentrations at closely spaced bolted interfaces subjected to severe vibrational loads from the launch vehicle.' },
    3: { name: 'LV Separation Adapter Ring',      desc: 'Rocket Lab MkII MLB 15-inch motorised lightband with 28 threaded holes. Ring thickness: 25 mm. DB-9 electrical interface connects spacecraft to LV electrical channel. SoftRide isolation system provides 3–25% additional damping. 15" diameter chosen: ~6.6× stiffer than 8" MLB for ~2× mass. Heritage: Sentinel 2. SurTec 650 coating for corrosion resistance.' },
  },
  sun: {
    1: { name: 'CRFP Sunshade',                           desc: '0.5 mm-thick CFRP 8-ply quasi-isotropic [0°/+45°/−45°/90°]s at 0.07 mm/ply (M46J fibres), ~0.56 mm total. Black-anodized interiors minimise stray light reflectance. NASA NICER heritage. >50% weight saving vs monolithic titanium. Out-bake process conducted on all CFRP parts to prevent outgassing in the S/C operational environment.' },
    2: { name: 'Ti Co-cured Mounting Bracket (M3 bolts)', desc: 'Titanium brackets co-cured between plies 4 and 5. High CFRP specific stiffness combined with titanium damping attenuates low-frequency vibrations. M3 Ti-6Al-4V bolts connect each sunshade to the baseplate. Ti selected for structural/thermally critical interfaces — high specific strength, excellent dimensional stability, low thermal conductivity.' },
    3: { name: 'Titanium Baseplate',                      desc: '5 mm Ti-6Al-4V baseplate. Low CTE and moderate thermal conductivity stabilise alignment under thermal cycling. Titanium used over CRFP because bolted connections into CRFP create stress concentrations; aluminium is isotropic and allows efficient load distribution via the spiderweb ribs.' },
    4: { name: 'M5 Mounting Points',                      desc: 'M5 interface points on angled OBA surfaces allow the instrument to expand in the bipod-compliant direction without stressing sunshade fasteners. A2-70 stainless steel fasteners at high-tensile joints. Helicoil® inserts used in aluminium tapped holes per ECSS-E-HB-32-22 insert spacing rules.' },
  },
  rw: {
    1: { name: 'Rocket Lab 60mNms Reaction Wheels', desc: 'Three wheels in tetrahedral (pyramid) configuration. Each spin axis at ~54.7° elevation from S/C principal axis — from regular tetrahedron geometry — ensuring symmetrically distributed torque vectors for balanced control across all three axes. Configuration modified to fit within bus dimensional constraints. Placed as close as possible to CoG for improved manoeuvrability.' },
    2: { name: 'Micro-D Connector',                  desc: 'Miniature-D sub connector for power and signal to each wheel. Vibration-resistant locking mechanism. Dry film lubricant (MoS₂) applied to all threaded mating surfaces to prevent cold welding in vacuum. Thermally and electrically conductive bolted connections allow passive thermal conduction and prevent ESD.' },
    3: { name: 'Tilted Reaction Wheel Mounting Hub',  desc: 'Al 6061-T6 hub, 5 mm thick baseplate, SurTec 650 coated. Four M4 connections to S/C structure. Tilted mounting at ~54.7° elevation derived from tetrahedral geometry. Al chosen for high specific stiffness; SurTec 650 for corrosion resistance and bonding compatibility in the orbital environment.' },
    4: { name: 'M3 Bolts (wheel to hub)',             desc: 'M3 Ti-6Al-4V or A2-70 fasteners connecting wheels to mounting hubs. MJ bolt profile (ISO 5855) enhances fatigue resistance with smaller root radius and shallower thread depths. Helicoil® inserts in aluminium tapped holes. Preloads calculated per ECSS-E-HB-32-23; EC2216 epoxy stake-bond on bolt head confirms full torque.' },
    5: { name: 'M4 Clearance Mounting Interface',    desc: 'M4 clearance holes interface the hub to the spacecraft CFRP sandwich panel. Through-thickness fully potted inserts with Al 6061-T6 + SurTec 650. Flange Ø 12 mm for M4 per ECSS-compliant Airborne Composites tooling. Insulating washers isolate dissimilar metals (Al/SS) to mitigate galvanic corrosion in the LEO conductive environment.' },
    6: { name: 'Reaction Wheel Hub Baseplate',       desc: 'Al 6061-T6 baseplate (5 mm), SurTec 650 coated. Mounted to interior CFRP sandwich panel via M6 bolts with fully potted protruding inserts (flange Ø 16 mm). High-load M6 joints employ protruding flanges with adhesive bond to CFRP face sheet per ECSS 2011 §10.3.5 to improve pull-out, torque, and bending performance. Total S/C mass including margins: 59.5 kg.' },
  },
};


// ══════════════════════════════════════
//  POPUP SYSTEM
// ══════════════════════════════════════

// Create single reusable popup element
const popup = document.createElement('div');
popup.className = 'hs-popup';
popup.innerHTML = `
  <button class="hs-popup-close" aria-label="Close">&times;</button>
  <div class="hs-popup-header">
    <span class="hs-popup-num"></span>
    <span class="hs-popup-name"></span>
  </div>
  <p class="hs-popup-desc"></p>
`;
document.body.appendChild(popup);

const popupNum   = popup.querySelector('.hs-popup-num');
const popupName  = popup.querySelector('.hs-popup-name');
const popupDesc  = popup.querySelector('.hs-popup-desc');
const popupCloseBtn = popup.querySelector('.hs-popup-close');

let activeHs = null;

function clearActive() {
  if (activeHs) {
    activeHs.classList.remove('active');
    activeHs = null;
  }
  popup.classList.remove('visible');
}

// Get hotspot position in page coordinates (for position:absolute)
function getHotspotPagePos(hsEl) {
  const svg  = hsEl.closest('svg');
  const ring = hsEl.querySelector('.hs-ring');
  const cx   = parseFloat(ring.getAttribute('cx'));
  const cy   = parseFloat(ring.getAttribute('cy'));

  const pt = svg.createSVGPoint();
  pt.x = cx;
  pt.y = cy;
  const screenPt = pt.matrixTransform(svg.getScreenCTM());

  return {
    x: screenPt.x + window.scrollX,
    y: screenPt.y + window.scrollY
  };
}

// Check if hotspot is visible in the viewport
function isHotspotVisible(hsEl) {
  const svg  = hsEl.closest('svg');
  const ring = hsEl.querySelector('.hs-ring');
  const cx   = parseFloat(ring.getAttribute('cx'));
  const cy   = parseFloat(ring.getAttribute('cy'));

  const pt = svg.createSVGPoint();
  pt.x = cx;
  pt.y = cy;
  const screenPt = pt.matrixTransform(svg.getScreenCTM());

  // screenPt gives viewport-relative coords
  return (
    screenPt.x > -40 && screenPt.x < window.innerWidth + 40 &&
    screenPt.y > -40 && screenPt.y < window.innerHeight + 40
  );
}

function positionPopup() {
  if (!activeHs) return;

  const pos  = getHotspotPagePos(activeHs);
  const popW = popup.offsetWidth;
  const popH = popup.offsetHeight;
  const vpW  = window.innerWidth;
  const vpH  = window.innerHeight;
  const gap  = 18;

  // Default: place to the right of hotspot
  let left = pos.x + gap;
  let top  = pos.y - popH / 2;

  // Overflow right → place left
  if (left + popW > vpW + window.scrollX - 20) {
    left = pos.x - popW - gap;
  }

  // Overflow left → centre below
  if (left < window.scrollX + 20) {
    left = pos.x - popW / 2;
    top  = pos.y + gap + 14;
  }

  // Clamp to visible area
  if (top < window.scrollY + 10) top = window.scrollY + 10;
  if (top + popH > window.scrollY + vpH - 10) top = window.scrollY + vpH - popH - 10;
  if (left < window.scrollX + 10) left = window.scrollX + 10;
  if (left + popW > vpW + window.scrollX - 10) left = vpW + window.scrollX - popW - 10;

  popup.style.left = left + 'px';
  popup.style.top  = top + 'px';
}

function showPopup(hsEl, id, comp) {
  // Fill content
  popupNum.textContent  = `Component ${id < 10 ? '0' + id : id}`;
  popupName.textContent = comp.name;
  popupDesc.textContent = comp.desc;

  // Mark active
  if (activeHs) activeHs.classList.remove('active');
  hsEl.classList.add('active');
  activeHs = hsEl;

  // Off-screen first to measure
  popup.style.left = '-9999px';
  popup.style.top  = '-9999px';
  popup.classList.add('visible');

  // Position after a frame
  requestAnimationFrame(positionPopup);
}


// ── Main satellite diagram hotspots (no data-panel) ──
document.querySelectorAll('.hs:not([data-panel])').forEach(hs => {
  hs.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = parseInt(hs.dataset.id);
    const c  = components[id];
    if (!c) return;
    showPopup(hs, id, c);
  });
});


// ── Additional diagram hotspots (with data-panel) ──
document.querySelectorAll('.hs[data-panel]').forEach(hs => {
  hs.addEventListener('click', (e) => {
    e.stopPropagation();
    const panelId = hs.dataset.panel;
    const compId  = parseInt(hs.dataset.id);
    const data    = diagComponents[panelId];
    if (!data || !data[compId]) return;

    // Clear active in same panel group
    document.querySelectorAll(`.hs[data-panel="${panelId}"]`).forEach(h => h.classList.remove('active'));

    showPopup(hs, compId, data[compId]);
  });
});


// ── Close popup ──
popupCloseBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  clearActive();
});

document.addEventListener('click', (e) => {
  if (!popup.contains(e.target) && !e.target.closest('.hs')) {
    clearActive();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') clearActive();
});

// Track hotspot on scroll/resize — auto-close when hotspot leaves viewport
let reposTick = false;
function handleReposition() {
  if (reposTick) return;
  reposTick = true;
  requestAnimationFrame(() => {
    reposTick = false;
    if (!activeHs || !popup.classList.contains('visible')) return;

    // If hotspot scrolled off screen, close the popup
    if (!isHotspotVisible(activeHs)) {
      clearActive();
      return;
    }

    positionPopup();
  });
}
window.addEventListener('scroll',  handleReposition, { passive: true });
window.addEventListener('resize',  handleReposition, { passive: true });


// ── Scroll reveal ──
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => io.observe(el));
// ══════════════════════════════════════════════
// INSTRUMENT EASTER EGGS
// ══════════════════════════════════════════════

const toast      = document.getElementById('egg-toast');
const toastIcon  = document.getElementById('egg-toast-icon');
const toastTitle = document.getElementById('egg-toast-title');
const toastText  = document.getElementById('egg-toast-text');
const xrayFlash  = document.getElementById('xray-flash');
const scanline   = document.getElementById('egg-scanline');
let toastTimer   = null;

function showToast(icon, title, text, duration = 4000) {
  if (!toast) return;
  toastIcon.textContent  = icon;
  toastTitle.textContent = title;
  toastText.textContent  = text;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ── EGG 1: Type "NEBULA" anywhere on the instrument page ──
// Triggers an X-ray flash and a message
let nebulaBuffer = '';
document.addEventListener('keydown', (e) => {
  const inInstrument = !!document.getElementById('instrument');
  if (!inInstrument) return;
  nebulaBuffer = (nebulaBuffer + e.key.toUpperCase()).slice(-6);
  if (nebulaBuffer === 'NEBULA') {
    nebulaBuffer = '';
    // X-ray flash
    if (xrayFlash) {
      xrayFlash.classList.add('active');
      setTimeout(() => xrayFlash.classList.remove('active'), 300);
      setTimeout(() => { xrayFlash.classList.add('active'); setTimeout(() => xrayFlash.classList.remove('active'), 200); }, 500);
    }
    showToast('☢️', 'X-ray Burst Detected',
      'Incoming photon flux from Cygnus X-1. NEBULA-Xplorer is already on it — concentrators aligned, SDDs cooling to −35°C.', 5000);
  }
});

// ── EGG 2: Click all 13 hotspots on the main satellite diagram ──
// Full mission readiness check
const visitedComponents = new Set();
document.querySelectorAll('.hs:not([data-panel])').forEach(hs => {
  hs.addEventListener('click', () => {
    const id = parseInt(hs.dataset.id);
    visitedComponents.add(id);
    if (visitedComponents.size === 13) {
      // Scan line sweep
      if (scanline) {
        scanline.classList.add('scanning');
        setTimeout(() => scanline.classList.remove('scanning'), 1400);
      }
      setTimeout(() => {
        showToast('✅', 'Mission Readiness Check: PASSED',
          'All 13 subsystems inspected. OBC nominal. IRUs hot-standby. Concentrators aligned. NEBULA-Xplorer is go for launch. 🚀', 6000);
      }, 1200);
    }
  });
});

// ── EGG 3: Triple-click the reaction wheel hotspot (component 12) ──
// Spins the wheel SVG visually
let rwClicks = 0;
let rwTimer  = null;
document.querySelectorAll('.hs:not([data-panel])').forEach(hs => {
  if (parseInt(hs.dataset.id) !== 12) return;
  hs.addEventListener('click', () => {
    rwClicks++;
    clearTimeout(rwTimer);
    rwTimer = setTimeout(() => { rwClicks = 0; }, 600);
    if (rwClicks >= 3) {
      rwClicks = 0;
      // Find wheel circles in the main sat SVG and spin them
      const satSvg = document.getElementById('sat-svg');
      if (satSvg) {
        // The reaction wheel is represented by circles at cx=122, cy=400
        // Wrap them in an animated group briefly
        const circles = [...satSvg.querySelectorAll('circle')].filter(c =>
          Math.abs(parseFloat(c.getAttribute('cx')) - 122) < 5 &&
          Math.abs(parseFloat(c.getAttribute('cy')) - 400) < 5
        );
        circles.forEach(c => c.classList.add('rw-spin'));
        setTimeout(() => circles.forEach(c => c.classList.remove('rw-spin')), 1100);
      }
      showToast('⚙️', 'Reaction Wheel Spinning Up',
        'Momentum wheels at 3,000 RPM. Angular momentum nominal. Attitude control engaged — pointing to Cygnus X-1.', 4000);
    }
  });
});

// ── EGG 4: Type "SRON" ── secret message from the team
let sronBuffer = '';
document.addEventListener('keydown', (e) => {
  sronBuffer = (sronBuffer + e.key.toUpperCase()).slice(-4);
  if (sronBuffer === 'SRON') {
    sronBuffer = '';
    showToast('🔭', 'SRON Netherlands Institute for Space Research',
      '"Building the next generation of X-ray astronomers, one concentrator at a time." — The NEBULA team, TU Delft & Leiden', 5500);
  }
});