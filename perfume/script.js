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

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !expanded);
    const answer = btn.nextElementSibling;
    answer.style.maxHeight = expanded ? '0' : answer.scrollHeight + 'px';
  });
});

// Header scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (header) {
    header.style.background = window.scrollY > 50
      ? 'rgba(26,20,16,0.97)'
      : 'rgba(26,20,16,0.92)';
  }
});

function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(30px);
      background: #d4af37; color: #1a1410; font-weight: 600; padding: 14px 28px;
      border-radius: 10px; font-size: 14px; z-index: 200; opacity: 0;
      transition: all 0.3s;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(30px)';
  }, 2500);
}
