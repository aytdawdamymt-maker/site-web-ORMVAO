/* =========================================================
   ORMVAO — SCRIPT.JS
   Handles: navbar scroll state, mobile menu, ambient leaf
   background animation, scroll-reveal, animated counters,
   the Leaflet intervention-areas map, and the contact form.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1) NAVBAR — transparent at top, solid once scrolled
  --------------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  function updateNavbarState() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  updateNavbarState();
  window.addEventListener('scroll', updateNavbarState, { passive: true });

  /* ---------------------------------------------------------
     2) MOBILE MENU TOGGLE
  --------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu whenever a link is clicked
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------------------------------------------------
     3) HIGHLIGHT ACTIVE NAV LINK WHILE SCROLLING
  --------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    let currentId = sections[0]?.id;
    const scrollPos = window.scrollY + 140; // offset for fixed navbar

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navAnchors.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }
  updateActiveLink();
  window.addEventListener('scroll', updateActiveLink, { passive: true });

  /* ---------------------------------------------------------
     4) SCROLL-REVEAL ANIMATIONS
     Elements with the .reveal class fade + slide into view
     the first time they enter the viewport.
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------
     5) ANIMATED STAT COUNTERS (About section)
  --------------------------------------------------------- */
  const counters = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1600; // ms
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // ease-out for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString('fr-FR');
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  /* ---------------------------------------------------------
     6) BACK-TO-TOP BUTTON
  --------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------------
     7) FOOTER YEAR
  --------------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     8) CONTACT FORM (front-end only — no backend attached)
  --------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.textContent = 'Merci ! Votre message a bien été envoyé. Nous vous répondrons rapidement.';
    contactForm.reset();
    setTimeout(() => { formNote.textContent = ''; }, 6000);
  });

  /* ---------------------------------------------------------
     9) INTERACTIVE MAP (Leaflet.js) — intervention areas
  --------------------------------------------------------- */
  initMap();

  /* ---------------------------------------------------------
     10) AMBIENT LEAF BACKGROUND ANIMATION (canvas)
  --------------------------------------------------------- */
  initLeafCanvas();

});


/* =========================================================
   MAP INITIALISATION
   Builds a Leaflet map centred on Ouarzazate and drops a
   marker for every zone listed in the "Areas" sidebar.
   Clicking a sidebar item flies the map to that marker.
   ========================================================= */
function initMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl || typeof L === 'undefined') return;

  const map = L.map('map', {
    scrollWheelZoom: false, // avoid hijacking page scroll
  }).setView([30.55, -6.6], 8);

  // Light, clean basemap that matches the site's soft palette
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 17,
  }).addTo(map);

  // Re-enable scroll zoom only once the user clicks into the map
  map.on('click', () => map.scrollWheelZoom.enable());

  // Custom leaf-shaped marker icon built from the same green as the logo
  const leafIcon = L.divIcon({
    className: 'leaf-marker',
    html: `<svg viewBox="0 0 24 24" width="30" height="30">
             <path d="M12 2 C6 2 2 7 2 13 C2 18 6 22 12 22 C12 14 12 8 12 2 Z" fill="#2E9E5B" stroke="#ffffff" stroke-width="1.5"/>
           </svg>`,
    iconSize: [30, 30],
    iconAnchor: [15, 28],
    popupAnchor: [0, -26],
  });

  const areaItems = document.querySelectorAll('.area-item');
  const markers = {};

  areaItems.forEach(item => {
    const lat = parseFloat(item.dataset.lat);
    const lng = parseFloat(item.dataset.lng);
    const title = item.querySelector('h4').textContent;
    const desc = item.querySelector('p').textContent;

    const marker = L.marker([lat, lng], { icon: leafIcon })
      .addTo(map)
      .bindPopup(`<strong>${title}</strong><br>${desc}`);

    markers[title] = marker;

    // Clicking a sidebar entry pans/zooms the map to that marker
    item.addEventListener('click', () => {
      areaItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      map.flyTo([lat, lng], 11, { duration: 1.1 });
      marker.openPopup();
    });
  });
}


/* =========================================================
   AMBIENT BACKGROUND — floating leaves on a canvas
   Purely decorative: a handful of small leaf shapes drift
   slowly downward and sideways, looping endlessly, to evoke
   a gentle breeze over the fields.
   ========================================================= */
function initLeafCanvas() {
  const canvas = document.getElementById('leaf-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, leaves;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createLeaves(count) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 8 + Math.random() * 14,
        speedY: 0.25 + Math.random() * 0.5,
        speedX: (Math.random() - 0.5) * 0.6,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.015,
        sway: Math.random() * Math.PI * 2,
        color: Math.random() > 0.5 ? 'rgba(46,158,91,0.35)' : 'rgba(63,170,217,0.28)',
      });
    }
    return arr;
  }

  // Draw a simple leaf shape (two curved petals) at the leaf's position/angle
  function drawLeaf(leaf) {
    ctx.save();
    ctx.translate(leaf.x, leaf.y);
    ctx.rotate(leaf.angle);
    ctx.fillStyle = leaf.color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(leaf.size * 0.6, -leaf.size * 0.6, 0, -leaf.size);
    ctx.quadraticCurveTo(-leaf.size * 0.6, -leaf.size * 0.6, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    frame += 1;

    leaves.forEach(leaf => {
      leaf.y += leaf.speedY;
      leaf.x += leaf.speedX + Math.sin(frame * 0.01 + leaf.sway) * 0.3;
      leaf.angle += leaf.spin;

      // Loop back to the top once a leaf drifts past the bottom
      if (leaf.y > height + 20) {
        leaf.y = -20;
        leaf.x = Math.random() * width;
      }
      if (leaf.x > width + 20) leaf.x = -20;
      if (leaf.x < -20) leaf.x = width + 20;

      drawLeaf(leaf);
    });

    requestAnimationFrame(animate);
  }

  resize();
  leaves = createLeaves(window.innerWidth < 700 ? 14 : 26);

  window.addEventListener('resize', () => {
    resize();
  });

  // Respect users who prefer reduced motion: draw a single static frame
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    leaves.forEach(drawLeaf);
  } else {
    animate();
  }
}