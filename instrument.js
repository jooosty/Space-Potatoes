// ── Satellite hotspot interaction ──
const components = {
  1:  { name: 'X-ray Instrument',             desc: '10 Wolter type 1 concentrators with gold-coated mirrors focus X-rays onto Silicon Drift Detectors for spectral timing science.' },
  2:  { name: '2× Battery Packs',             desc: 'Li-ion battery packs store energy for operations during eclipse when the solar panels are not illuminated.' },
  3:  { name: 'Star Tracker Module',          desc: 'Provides precise 3-axis attitude knowledge by imaging star fields — essential for accurate telescope pointing.' },
  4:  { name: 'Bus Subsystem Rack',           desc: 'Houses the PDU, ACU, PMU, and 2× S-band transceivers managing satellite power distribution and communications.' },
  5:  { name: 'Dawn 4U Cubedrive',            desc: 'Propulsion module for orbit maintenance and active deorbit at end of mission to prevent space debris.' },
  6:  { name: 'S-band Antenna',              desc: 'Primary RF link for telemetry downlink and command uplink, communicating with ground stations globally.' },
  7:  { name: 'GNSS Receiver',               desc: 'GPS/Galileo receiver for precise real-time orbit determination and time synchronisation of science events.' },
  8:  { name: 'Sun Sensor',                  desc: 'Coarse attitude sensor used during safe-mode recovery and initial acquisition to orient solar panels toward the Sun.' },
  9:  { name: 'Instrument Electronics',       desc: 'Hot-redundant Instrument Readout Units (IRU) that process and time-stamp photon events from all 12 SDDs simultaneously.' },
  10: { name: '2× Magnetometers',            desc: 'Measure the local magnetic field vector for attitude determination and to command the magnetic torquer rods.' },
  11: { name: 'SADM',                        desc: 'Solar Array Drive Mechanism — continuously rotates the solar panels to track the Sun regardless of spacecraft attitude.' },
  12: { name: 'Reaction Wheel Module',        desc: '3-axis momentum wheel assembly for precise, propellant-free attitude control and slewing between science targets.' },
  13: { name: 'OBC, TCM & IMU',             desc: 'On-Board Computer, Thermal Control Module, and Inertial Measurement Unit — the central brain, thermal regulation, and motion sensing.' },
};

const panel      = document.getElementById('sat-panel');
const panelDef   = document.getElementById('sat-panel-default');
const panelInfo  = document.getElementById('sat-panel-info');
const panelNum   = document.getElementById('sat-panel-num');
const panelName  = document.getElementById('sat-panel-name');
const panelDesc  = document.getElementById('sat-panel-desc');

let activeHs = null;

if (panel) {
  document.querySelectorAll('.hs').forEach(hs => {
    hs.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(hs.dataset.id);
      const c  = components[id];

      // Update active hotspot styling
      if (activeHs) activeHs.classList.remove('active');
      hs.classList.add('active');
      activeHs = hs;

      // Fill panel
      panelNum.textContent  = `Component ${id < 10 ? '0'+id : id}`;
      panelName.textContent = c.name;
      panelDesc.textContent = c.desc;

      panelDef.style.display  = 'none';
      panelInfo.style.display = 'block';
      panel.classList.add('active');
    });
  });
}

// ── Scroll reveal ──
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => io.observe(el));