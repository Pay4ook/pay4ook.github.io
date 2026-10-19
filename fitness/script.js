﻿// Mobile menu
const burger = document.getElementById('burger');
const mnav = document.getElementById('mnav');
const mnavOverlay = document.getElementById('mnavOverlay');

function toggleMenu() {
  burger.classList.toggle('open');
  mnav.classList.toggle('open');
  mnavOverlay.classList.toggle('open');
}

if (burger) burger.addEventListener('click', toggleMenu);
if (mnavOverlay) mnavOverlay.addEventListener('click', toggleMenu);

// Close menu on link click
mnav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    if (mnav.classList.contains('open')) toggleMenu();
  });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (mnav.classList.contains('open')) toggleMenu();
    }
  });
});

// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.style.background = 'rgba(10,10,11,0.95)';
  } else {
    header.style.background = 'rgba(10,10,11,0.9)';
  }
});

// Pricing card selection
document.querySelectorAll('.price-card .btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const card = this.closest('.price-card');
    
    // Remove selected from all
    document.querySelectorAll('.price-card').forEach(c => c.classList.remove('selected'));
    
    // Add selected to clicked
    card.classList.add('selected');
    
    // Smooth scroll to booking
    setTimeout(() => {
      const booking = document.getElementById('booking');
      if (booking) {
        booking.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  });
});

// Booking form
const form = document.getElementById('bookingForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Заявка отправлена! Мы свяжемся с вами в течение 15 минут.');
    form.reset();
    document.querySelectorAll('.price-card').forEach(c => c.classList.remove('selected'));
  });
}

// ========================
// THREE.JS 3D DUMBBELL
// ========================
(function() {
  const canvas = document.getElementById('dumbbell-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Свет
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  const dirLight1 = new THREE.DirectionalLight(0xC6FF00, 1.5);
  dirLight1.position.set(5, 5, 5);
  scene.add(dirLight1);
  const dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
  dirLight2.position.set(-5, 3, -5);
  scene.add(dirLight2);

  // Материалы
  const handleMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,
    metalness: 0.8,
    roughness: 0.3
  });
  const weightMaterial = new THREE.MeshStandardMaterial({
    color: 0xC6FF00,
    metalness: 0.6,
    roughness: 0.4
  });
  const gripMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.5,
    roughness: 0.7
  });

  // Гантеля
  const dumbbellGroup = new THREE.Group();

  // Ручка
  const handleGeo = new THREE.CylinderGeometry(0.15, 0.15, 3, 32);
  const handle = new THREE.Mesh(handleGeo, handleMaterial);
  handle.rotation.z = Math.PI / 2;
  dumbbellGroup.add(handle);

  // Ручка - текстура
  for (let i = -1; i <= 1; i += 0.3) {
    const gripGeo = new THREE.CylinderGeometry(0.17, 0.17, 0.2, 32);
    const grip = new THREE.Mesh(gripGeo, gripMaterial);
    grip.rotation.z = Math.PI / 2;
    grip.position.x = i;
    dumbbellGroup.add(grip);
  }

  // Диски с обеих сторон
  function addWeightPlate(x) {
    const plateGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.15, 32);
    const plate1 = new THREE.Mesh(plateGeo, weightMaterial);
    plate1.rotation.z = Math.PI / 2;
    plate1.position.x = x;
    dumbbellGroup.add(plate1);

    // Второй диск
    const plate2 = new THREE.Mesh(plateGeo, weightMaterial);
    plate2.rotation.z = Math.PI / 2;
    plate2.position.x = x + (x > 0 ? -0.2 : 0.2);
    dumbbellGroup.add(plate2);

    // Третий диск
    const plate3 = new THREE.Mesh(plateGeo, weightMaterial);
    plate3.rotation.z = Math.PI / 2;
    plate3.position.x = x + (x > 0 ? -0.4 : 0.4);
    dumbbellGroup.add(plate3);
  }

  addWeightPlate(1.7);
  addWeightPlate(-1.7);

  // Крепления
  const capGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 32);
  const cap1 = new THREE.Mesh(capGeo, handleMaterial);
  cap1.rotation.z = Math.PI / 2;
  cap1.position.x = 2.5;
  dumbbellGroup.add(cap1);
  
  const cap2 = new THREE.Mesh(capGeo, handleMaterial);
  cap2.rotation.z = Math.PI / 2;
  cap2.position.x = -2.5;
  dumbbellGroup.add(cap2);

  scene.add(dumbbellGroup);

  camera.position.z = 8;

  // Мышь
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Анимация
  function animate() {
    requestAnimationFrame(animate);
    dumbbellGroup.rotation.y += 0.01;
    dumbbellGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
    
    camera.position.x += (mouseX * 1 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 1 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
  }
  animate();

  // Ресайз
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

// ========================
// FIX STARS
// ========================
document.querySelectorAll('.star').forEach(star => {
  const style = star.getAttribute('style') || '';
  // Remove invalid --o property
  const cleaned = style.replace(/;?--o:[^;"]*/, '').replace(/^;/, '');
  if (cleaned) star.setAttribute('style', cleaned);
  // Set random animation-delay
  star.style.animationDelay = (Math.random() * 5).toFixed(2) + 's';
});

// ========================
// GSAP ANIMATIONS
// ========================
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  
  // ===== HERO ANIMATIONS =====
  gsap.from('.hero-line', {
    opacity: 0, height: 0, duration: 0.8, ease: 'power3.out'
  });
  
  gsap.from('h1', {
    opacity: 0, y: 60, duration: 1, delay: 0.3, ease: 'power3.out'
  });
  
  gsap.from('.hero p', {
    opacity: 0, y: 40, duration: 0.8, delay: 0.6, ease: 'power3.out'
  });
  
  gsap.from('.hero-actions', {
    opacity: 0, y: 40, duration: 0.8, delay: 0.8, ease: 'power3.out'
  });
  
  gsap.from('.hero-metrics', {
    opacity: 0, y: 40, duration: 0.8, delay: 1, ease: 'power3.out'
  });
  
  gsap.from('.hero-visual', {
    opacity: 0, x: 100, duration: 1.2, delay: 0.5, ease: 'power3.out'
  });

  // ===== PROGRAMS =====
  gsap.utils.toArray('.program-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 60,
      duration: 0.8,
      delay: i * 0.15,
      ease: 'power3.out'
    });
  });

  // ===== TRAINERS =====
  gsap.utils.toArray('.trainer-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 60,
      duration: 0.8,
      delay: i * 0.2,
      ease: 'power3.out'
    });
  });

  // ===== PRICING =====
  gsap.utils.toArray('.price-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 60,
      duration: 0.8,
      delay: i * 0.2,
      ease: 'power3.out'
    });
  });

  // ===== 3D DUMBBELL =====
  gsap.from('.dumbbell-3d-section', {
    scrollTrigger: {
      trigger: '.dumbbell-3d-section',
      start: 'top 80%',
    },
    opacity: 0,
    scale: 0.5,
    duration: 1.5,
    ease: 'power3.out'
  });

  // ===== ABOUT =====
  gsap.from('.about-text', {
    scrollTrigger: {
      trigger: '.about',
      start: 'top 70%',
    },
    opacity: 0,
    x: -60,
    duration: 1,
    ease: 'power3.out'
  });
  
  gsap.from('.about-visual', {
    scrollTrigger: {
      trigger: '.about',
      start: 'top 70%',
    },
    opacity: 0,
    x: 60,
    duration: 1,
    delay: 0.3,
    ease: 'power3.out'
  });

  // ===== BOOKING =====
  gsap.from('.booking-content', {
    scrollTrigger: {
      trigger: '.booking',
      start: 'top 70%',
    },
    opacity: 0,
    x: -60,
    duration: 1,
    ease: 'power3.out'
  });
  
  gsap.from('.booking-form', {
    scrollTrigger: {
      trigger: '.booking',
      start: 'top 70%',
    },
    opacity: 0,
    x: 60,
    duration: 1,
    delay: 0.3,
    ease: 'power3.out'
  });

  // ===== FOOTER =====
  gsap.from('.footer', {
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 95%',
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out'
  });
});

// Form notification
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(30px);
      background: #C6FF00; color: #0A0A0B; font-weight: 700; padding: 14px 28px;
      border-radius: 10px; font-size: 14px; z-index: 200;
      opacity: 0; transition: all 0.3s;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(30px)';
  }, 3000);
}
