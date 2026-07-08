/* =========================================================
   ORMVAO — SCRIPT.JS
   Handles: mobile navigation, active link highlighting,
   scroll-reveal animations, animated counters, Leaflet map,
   contact form, back-to-top button.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Set current year in footer ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* =========================================================
     1) MOBILE NAVIGATION TOGGLE
     ========================================================= */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu when a link is clicked
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });

  /* =========================================================
     2) ACTIVE NAV LINK ON SCROLL
     ========================================================= */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  function highlightActiveLink() {
    let currentId = sections[0].id;
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navItems.forEach(link => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${currentId}`);
    });
  }

  window.addEventListener('scroll', highlightActiveLink);
  highlightActiveLink();

  /* =========================================================
     3) SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     ========================================================= */
  const revealItems = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach(item => revealObserver.observe(item));

  /* =========================================================
     4) ANIMATED STAT COUNTERS (About section)
     ========================================================= */
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1600; // ms
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target).toLocaleString('fr-FR');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('fr-FR');
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  /* =========================================================
     5) SUBTLE PARALLAX EFFECT IN THE HERO SECTION
     ========================================================= */
  const heroTree = document.getElementById('heroTree');
  const heroBg = document.getElementById('heroBg');

  // Mouse-move parallax (desktop)
  document.querySelector('.hero').addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 14; // range -7 to 7
    const y = (e.clientY / innerHeight - 0.5) * 10;
    heroTree.style.transform = `translate(${x * 0.6}px, ${y * 0.6}px)`;
  });

  // Scroll-based parallax
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrollY * 0.25}px)`;
    }
  });

  /* =========================================================
     6) BACK TO TOP BUTTON
     ========================================================= */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =========================================================
     7) CONTACT FORM (front-end only demo submission)
     ========================================================= */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // In production, this would send data to a server/API.
    formSuccess.classList.add('visible');
    contactForm.reset();
    setTimeout(() => formSuccess.classList.remove('visible'), 5000);
  });

  /* =========================================================
     8) LEAFLET MAP — Areas of Intervention
     ========================================================= */
  if (document.getElementById('interventionMap')) {
    // Centered on the Ouarzazate / Drâa-Tafilalet region
    const map = L.map('interventionMap', {
      scrollWheelZoom: false
    }).setView([30.95, -6.2], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map);

    // Re-enable scroll zoom only when the user clicks into the map
    map.on('focus', () => map.scrollWheelZoom.enable());
    map.on('blur', () => map.scrollWheelZoom.disable());

    // Custom green marker icon matching the palette
    const greenIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background:#0F4C35;
        width:16px;height:16px;
        border-radius:50%;
        border:3px solid #B8F2B0;
        box-shadow:0 2px 6px rgba(0,0,0,0.35);
      "></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    // Intervention zones managed by ORMVAO (approximate coordinates)
    const zones = [
      { name: 'Ouarzazate',        desc: "Siège de l'ORMVAO — Périmètre central", coords: [30.9189, -6.8934] },
      { name: 'Skoura',            desc: 'Périmètre oasien — palmeraies',          coords: [31.0667, -6.5667] },
      { name: "Kelaât M'Gouna",    desc: 'Vallée des roses — cultures de rente',   coords: [31.2500, -6.0167] },
      { name: 'Boumalne Dadès',    desc: 'Périmètre agricole du Dadès',            coords: [31.3667, -5.9833] },
      { name: 'Tinghir',           desc: 'Gorges du Todgha — irrigation traditionnelle', coords: [31.5147, -5.5325] },
      { name: 'Zagora',            desc: 'Vallée du Drâa — palmeraies et cultures', coords: [30.3314, -5.8378] }
    ];

    zones.forEach(zone => {
      L.marker(zone.coords, { icon: greenIcon })
        .addTo(map)
        .bindPopup(`<strong>${zone.name}</strong><br>${zone.desc}`);
    });
  }

});