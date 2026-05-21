/* ============================================================
   SAAD BENAISSA — PORTFOLIO SCRIPTS
   Structure:
   1. Cursor
   2. Hero orb parallax
   3. Text scramble
   4. Scroll reveal
   5. Card 3D tilt
   6. Nav active link
   7. Init (runs everything)
   ============================================================ */


/* ── 1. Cursor ────────────────────────────────────────────── */

function initCursor() {
  const cursor = document.getElementById('cursor');
  const glow   = document.getElementById('glow');

  if (!cursor) return;

  let mouseX = window.innerWidth  / 2;
  let mouseY = window.innerHeight / 2;
  let glowX  = mouseX;
  let glowY  = mouseY;

  // Snap the dot to the exact mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smoothly lerp the glow toward the mouse
  function animateGlow() {
    glowX += (mouseX - glowX) * 0.07;
    glowY += (mouseY - glowY) * 0.07;

    const glowEl = document.getElementById('cursor-glow');
    if (glowEl) {
      glowEl.style.left = glowX + 'px';
      glowEl.style.top  = glowY + 'px';
    }

    requestAnimationFrame(animateGlow);
  }

  animateGlow();

  // Grow cursor when hovering interactive elements
  const hoverTargets = document.querySelectorAll(
    'a, button, .skill-tag, .project-card'
  );

  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width   = '28px';
      cursor.style.height  = '28px';
      cursor.style.opacity = '0.5';
    });

    el.addEventListener('mouseleave', () => {
      cursor.style.width   = '12px';
      cursor.style.height  = '12px';
      cursor.style.opacity = '1';
    });
  });
}


/* ── 2. Hero orb parallax ─────────────────────────────────── */

function initOrbParallax() {
  const orb1 = document.querySelector('.hero-orb-1');
  const orb2 = document.querySelector('.hero-orb-2');

  if (!orb1 || !orb2) return;

  document.addEventListener('mousemove', (e) => {
    const xRatio = (e.clientX / window.innerWidth)  - 0.5;
    const yRatio = (e.clientY / window.innerHeight) - 0.5;

    orb1.style.transform = `translate(${xRatio * -30}px, ${yRatio * -20}px)`;
    orb2.style.transform = `translate(${xRatio *  20}px, ${yRatio *  15}px)`;
  });
}


/* ── 3. Text scramble ─────────────────────────────────────── */

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function scrambleText(element, finalText, duration = 1200) {
  const totalFrames = Math.floor(duration / 40);
  let frame = 0;

  const interval = setInterval(() => {
    const progress = frame / totalFrames;
    const revealed = Math.floor(progress * finalText.length);
    let result = '';

    for (let i = 0; i < finalText.length; i++) {
      if (finalText[i] === ' ') {
        result += ' ';
        continue;
      }
      if (i < revealed) {
        result += finalText[i];
      } else {
        result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
    }

    element.textContent = result;
    frame++;

    if (frame > totalFrames) {
      element.textContent = finalText;
      clearInterval(interval);
    }
  }, 40);
}

function initScramble() {
  const target    = document.getElementById('scramble-target');
  const finalText = target ? target.textContent.trim() : '';

  if (!target) return;

  // Play once on load after the hero animates in
  setTimeout(() => scrambleText(target, finalText, 1200), 900);

  // Replay on hover
  target.addEventListener('mouseenter', () => {
    scrambleText(target, finalText, 700);
  });
}


/* ── 4. Scroll reveal ─────────────────────────────────────── */

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach((el) => observer.observe(el));
}


/* ── 5. Card 3D tilt ──────────────────────────────────────── */

function initCardTilt() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const x       = e.clientX - rect.left;
      const y       = e.clientY - rect.top;
      const centerX = rect.width  / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) *  6;

      card.style.transition = 'box-shadow 0.3s';
      card.style.transform  =
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease, box-shadow 0.3s';
      card.style.transform  = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}


/* ── 6. Nav active link highlight ─────────────────────────── */

function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener(
    'scroll',
    () => {
      let currentId = '';

      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 120) {
          currentId = section.id;
        }
      });

      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === '#' + currentId;
        link.classList.toggle('active', isActive);
      });
    },
    { passive: true }
  );
}


/* ── 7. Init ──────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initOrbParallax();
  initScramble();
  initScrollReveal();
  initCardTilt();
  initNavHighlight();
});