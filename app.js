/**
 * Sundarji S - Portfolio Interactive Logic
 * Features:
 * 1. Three.js Interactive 3D Cyber Core in Hero Section
 * 2. Dynamic Ambient Particle Canvas
 * 3. Typewriter Effect for Roles
 * 4. Animated Stats Counter (Scroll-triggered)
 * 5. Interactive 3D Card Tilt Effect
 * 6. Mobile Navigation & Scroll Spy
 * 7. Interactive Certificate Modal Viewer
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initAmbientCanvas();
  initHeroThreeJS();
  initStatsCounter();
  initTiltEffect();
  initNavigation();
  initModalListeners();
});

/* ==========================================================================
   1. Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const element = document.getElementById('typed-role');
  if (!element) return;

  const roles = [
    'Cyber Security & Full-Stack Developer',
    'Defensive Security Specialist',
    'System Architect & Team Leader',
    'Hackathon Competitor & Finalist',
    'Singer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      element.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      element.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 105;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2200; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   2. Ambient Particle Canvas
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(width > 768 ? 65 : 35, 75);
  const particles = [];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 2 + 1;
      this.isOrange = Math.random() > 0.65; // 35% vibrant racing orange, 65% powder blue
      this.alpha = Math.random() * 0.6 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.isOrange
        ? `rgba(255, 85, 0, ${this.alpha})`
        : `rgba(147, 197, 253, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Connect particles with subtle lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 125) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const opacity = (1 - dist / 125) * 0.16;
          ctx.strokeStyle = `rgba(147, 197, 253, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   3. Three.js 3D Cyber Core (Hero Section)
   ========================================================================== */
function initHeroThreeJS() {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const container = canvas.parentElement;
  let width = container.clientWidth || 400;
  let height = container.clientHeight || 400;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.z = 4.2;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Outer Geometric Cage (Icosahedron Wireframe)
  const outerGeometry = new THREE.IcosahedronGeometry(1.65, 1);
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x93C5FD, // Powder blue
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const outerMesh = new THREE.Mesh(outerGeometry, wireframeMaterial);
  scene.add(outerMesh);

  // Outer Vertices Glow Points
  const pointsMaterial = new THREE.PointsMaterial({
    color: 0xFF5500, // Vibrant Racing Orange
    size: 0.08,
    transparent: true,
    opacity: 0.95
  });
  const pointsMesh = new THREE.Points(outerGeometry, pointsMaterial);
  scene.add(pointsMesh);

  // Inner Solid Glowing Core (Torus Knot)
  const innerGeometry = new THREE.TorusKnotGeometry(0.75, 0.22, 100, 16);
  const innerMaterial = new THREE.MeshPhongMaterial({
    color: 0x0E1526,
    emissive: 0xFF5500,
    emissiveIntensity: 0.45,
    specular: 0x93C5FD,
    shininess: 90,
    wireframe: true
  });
  const innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
  scene.add(innerCore);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const orangePointLight = new THREE.PointLight(0xFF5500, 2.5, 10);
  orangePointLight.position.set(3, 3, 3);
  scene.add(orangePointLight);

  const bluePointLight = new THREE.PointLight(0x93C5FD, 2, 10);
  bluePointLight.position.set(-3, -3, 3);
  scene.add(bluePointLight);

  // Mouse Interactivity
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;
    targetX = x * 0.0015;
    targetY = y * 0.0015;
  });

  // Window Resize
  window.addEventListener('resize', () => {
    width = container.clientWidth || 400;
    height = container.clientHeight || 400;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });

  // Render Loop
  function animate() {
    requestAnimationFrame(animate);

    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    outerMesh.rotation.x += 0.003;
    outerMesh.rotation.y += 0.005;
    pointsMesh.rotation.x = outerMesh.rotation.x;
    pointsMesh.rotation.y = outerMesh.rotation.y;

    innerCore.rotation.x -= 0.006;
    innerCore.rotation.y += 0.008;

    scene.rotation.y = mouseX;
    scene.rotation.x = mouseY;

    renderer.render(scene, camera);
  }

  animate();
}

/* ==========================================================================
   4. Animated Stats Counter
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let triggered = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          statNumbers.forEach((el) => {
            const target = parseInt(el.getAttribute('data-target'), 10) || 0;
            animateCount(el, target);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  const statsSection = document.getElementById('stats');
  if (statsSection) observer.observe(statsSection);

  function animateCount(el, target) {
    let current = 0;
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, stepTime);
  }
}

/* ==========================================================================
   5. Card 3D Tilt Effect
   ========================================================================== */
function initTiltEffect() {
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* ==========================================================================
   6. Navigation & Scroll Spy
   ========================================================================== */
function initNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const navItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });

    navItems.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
      });
    });
  }

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach((item) => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. Interactive Certificate Modal
   ========================================================================== */
window.openCertModal = function(imageSrc, title, description, pdfSrc = null) {
  const modal = document.getElementById('cert-modal');
  const modalImg = document.getElementById('cert-modal-img');
  const modalTitle = document.getElementById('cert-modal-title');
  const modalDesc = document.getElementById('cert-modal-desc');
  const modalLink = document.getElementById('cert-modal-open-link');
  const modalPdfLink = document.getElementById('cert-modal-pdf-link');

  if (!modal || !modalImg) return;

  modalImg.src = imageSrc;
  modalTitle.textContent = title;
  modalDesc.textContent = description;
  modalLink.href = imageSrc;

  if (modalPdfLink) {
    if (pdfSrc) {
      modalPdfLink.href = pdfSrc;
      modalPdfLink.style.display = 'inline-flex';
    } else {
      modalPdfLink.style.display = 'none';
    }
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeCertModal = function() {
  const modal = document.getElementById('cert-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
};

/* ==========================================================================
   8. Books Modal & Accordion
   ========================================================================== */
window.openBooksModal = function() {
  const modal = document.getElementById('books-modal') || document.getElementById('book-modal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeBooksModal = function() {
  const modal = document.getElementById('books-modal') || document.getElementById('book-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
};

window.toggleBookDescription = function(bookId) {
  const item = document.getElementById(bookId);
  if (!item) return;
  item.classList.toggle('active');
};

// Convenient aliases
window.openBookModal = window.openBooksModal;
window.closeBookModal = window.closeBooksModal;
window.toggleBookAccordion = window.toggleBookDescription;

function initModalListeners() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeCertModal();
      window.closeBooksModal();
    }
  });
}
