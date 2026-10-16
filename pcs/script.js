// Mobile menu
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
}

// Configurator
const configItems = {
  gpu: { rtX4060: 28000, rtX4070s: 52000, rtX4080s: 85000, rtX4090: 155000 },
  cpu: { r55600: 15000, r77700: 25000, r7800x3d: 35000, r97950x3d: 55000 },
  ram: { '16ddr4': 4000, '32ddr5': 10000, '64ddr5': 22000 },
  ssd: { '1tb': 6000, '2tb': 12000, '2tb+4tb': 36000 },
  cool: { air: 3000, aio240: 7000, aio360: 12000 }
};

// Base price for case, motherboard, PSU
const BASE = 25000;

function updateTotal() {
  let total = BASE;
  document.querySelectorAll('.config-option input:checked').forEach(input => {
    const price = parseInt(input.dataset.price) || 0;
    total += price;
  });
  const el = document.getElementById('configTotal');
  if (el) {
    el.textContent = total.toLocaleString('ru-RU') + ' ₽';
  }
}

document.querySelectorAll('.config-option input').forEach(input => {
  input.addEventListener('change', updateTotal);
});

updateTotal();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile menu
      if (mobileMenu) mobileMenu.classList.remove('open');
      if (burger) burger.classList.remove('open');
    }
  });
});
