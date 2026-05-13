// === Custom Cursor ===
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
let cursorX = 0, cursorY = 0, outlineX = 0, outlineY = 0;

window.addEventListener('mousemove', e => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  cursorDot.style.left = cursorX + 'px';
  cursorDot.style.top = cursorY + 'px';
});

function animateOutline() {
  outlineX += (cursorX - outlineX) * 0.15;
  outlineY += (cursorY - outlineY) * 0.15;
  cursorOutline.style.left = outlineX + 'px';
  cursorOutline.style.top = outlineY + 'px';
  requestAnimationFrame(animateOutline);
}
animateOutline();

// Hover detection for interactive elements
document.querySelectorAll('a, button, .skill-tag, .project-card, .cert-card, .stat-box, .contact-btn, .nav-resume, .glitch-name').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.classList.add('hovering');
    cursorOutline.classList.add('hovering');
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('hovering');
    cursorOutline.classList.remove('hovering');
  });
});

// === Particle Background ===
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    if (mouse.x !== null) {
      const dx = mouse.x - this.x, dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        this.x -= dx * 0.01;
        this.y -= dy * 0.01;
      }
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(100, 255, 218, ${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
  for (let i = 0; i < count; i++) particles.push(new Particle());
}
initParticles();
window.addEventListener('resize', initParticles);

function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(100, 255, 218, ${0.06 * (1 - dist / 150)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// === Navbar ===
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));

// === Scroll Reveal ===
const revealEls = document.querySelectorAll('.reveal');
const onScroll = () => {
  revealEls.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 80) el.classList.add('active');
  });
};
window.addEventListener('scroll', onScroll);
window.addEventListener('load', onScroll);

// === Stat Counter Animation ===
const statNums = document.querySelectorAll('.stat-num');
let counted = false;
const animateCounters = () => {
  if (counted) return;
  const statsEl = document.querySelector('.about-stats');
  if (!statsEl) return;
  if (statsEl.getBoundingClientRect().top < window.innerHeight - 50) {
    counted = true;
    statNums.forEach(el => {
      const target = el.dataset.target;
      const isFloat = target.includes('.');
      const num = parseFloat(target);
      const start = performance.now();
      const dur = 1800;
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = isFloat ? (ease * num).toFixed(2) : Math.floor(ease * num);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target + (el.dataset.suffix || '');
      };
      requestAnimationFrame(tick);
    });
  }
};
window.addEventListener('scroll', animateCounters);
window.addEventListener('load', animateCounters);

// === Active Nav Highlighting ===
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });
});

// === Typed Effect ===
const typed = document.querySelector('.typed-text');
if (typed) {
  const words = JSON.parse(typed.dataset.words);
  let wi = 0, ci = 0, deleting = false;
  const typeSpeed = 100, deleteSpeed = 50, pause = 2000;
  function typeLoop() {
    const word = words[wi];
    typed.textContent = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
    if (!deleting && ci > word.length) { setTimeout(() => { deleting = true; typeLoop(); }, pause); return; }
    if (deleting && ci < 0) { deleting = false; wi = (wi + 1) % words.length; }
    setTimeout(typeLoop, deleting ? deleteSpeed : typeSpeed);
  }
  typeLoop();
}
