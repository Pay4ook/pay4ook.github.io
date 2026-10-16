// Mobile menu
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

// Booking form
const form = document.getElementById('bookingForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    showToast('Заявка отправлена! Мы свяжемся с вами в течение 15 минут.');
    form.reset();
  });
}

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
