const starsContainer = document.querySelector('.stars');
if (starsContainer) {
  for (let i = 0; i < 200; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top  = Math.random() * 100 + 'vh';
    star.style.animationDelay = Math.random() * 5 + 's';
    starsContainer.appendChild(star);
  }
}

// ── Burger menu ──
const burger   = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  })
);

// ── Active nav on scroll ──
const navIds = ['mission', 'instrument', 'science', 'crew', 'contact'];
const navAnchors = document.querySelectorAll('.nav-links a');

function setActive() {
  let current = '';
  navIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.scrollY >= el.offsetTop - window.innerHeight / 2) {
      current = id;
    }
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', setActive, { passive: true });
setActive(); // run once on load