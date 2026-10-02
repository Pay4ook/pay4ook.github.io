const SCHEDULE = {
  mon: [
    { time: "07:00", name: "Силовая тренировка", coach: "Алексей Волков" },
    { time: "09:00", name: "HIIT", coach: "Дмитрий Орлов" },
    { time: "12:00", name: "Йога и стретчинг", coach: "Мария Соколова" },
    { time: "18:00", name: "Бокс и ММА", coach: "Дмитрий Орлов" },
    { time: "20:00", name: "Функциональная тренировка", coach: "Алексей Волков" }
  ],
  tue: [
    { time: "08:00", name: "Йога и стретчинг", coach: "Мария Соколова" },
    { time: "10:00", name: "Силовая тренировка", coach: "Алексей Волков" },
    { time: "17:00", name: "HIIT", coach: "Дмитрий Орлов" },
    { time: "19:00", name: "Спарринг-класс", coach: "Дмитрий Орлов" }
  ],
  wed: [
    { time: "07:00", name: "HIIT", coach: "Дмитрий Орлов" },
    { time: "11:00", name: "Силовая тренировка", coach: "Алексей Волков" },
    { time: "14:00", name: "Функциональная тренировка", coach: "Алексей Волков" },
    { time: "18:30", name: "Бокс и ММА", coach: "Дмитрий Орлов" },
    { time: "20:30", name: "Йога и стретчинг", coach: "Мария Соколова" }
  ],
  thu: [
    { time: "08:30", name: "Функциональная тренировка", coach: "Алексей Волков" },
    { time: "11:00", name: "Йога и стретчинг", coach: "Мария Соколова" },
    { time: "17:00", name: "Силовая тренировка", coach: "Алексей Волков" },
    { time: "19:00", name: "Спарринг-класс", coach: "Дмитрий Орлов" }
  ],
  fri: [
    { time: "07:30", name: "Силовая тренировка", coach: "Алексей Волков" },
    { time: "10:00", name: "HIIT", coach: "Дмитрий Орлов" },
    { time: "13:00", name: "Йога и стретчинг", coach: "Мария Соколова" },
    { time: "18:00", name: "Функциональная тренировка", coach: "Алексей Волков" },
    { time: "20:00", name: "Бокс и ММА", coach: "Дмитрий Орлов" }
  ],
  sat: [
    { time: "09:00", name: "Функциональная тренировка", coach: "Алексей Волков" },
    { time: "11:00", name: "Силовая тренировка", coach: "Алексей Волков" },
    { time: "13:00", name: "HIIT", coach: "Дмитрий Орлов" },
    { time: "15:00", name: "Йога и стретчинг", coach: "Мария Соколова" }
  ],
  sun: [
    { time: "10:00", name: "Йога и стретчинг", coach: "Мария Соколова" },
    { time: "12:00", name: "HIIT", coach: "Дмитрий Орлов" },
    { time: "14:00", name: "Спарринг-класс", coach: "Дмитрий Орлов" }
  ]
};

const DAY_NAMES = {
  mon: "Понедельник", tue: "Вторник", wed: "Среда",
  thu: "Четверг", fri: "Пятница", sat: "Суббота", sun: "Воскресенье"
};

const BOT = "https://t.me/Pay4o0k333";

const schedList = document.getElementById("schedList");
const toast = document.getElementById("toast");
let currentDay = "mon";

/* Появление блоков при скролле */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* Расписание */
function renderSchedule(day) {
  const items = SCHEDULE[day] || [];
  const head = '<div class="sched-head"><h3>' + DAY_NAMES[day] + '</h3><span>' + items.length + ' ' + plural(items.length, "занятие", "занятия", "занятий") + '</span></div>';

  const rows = items.map((it) =>
    '<div class="sched-item">' +
      '<span class="time">' + it.time + '</span>' +
      '<div class="name"><h4>' + it.name + '</h4><p>' + it.coach + '</p></div>' +
      '<button class="btn btn-line btn-sm" data-name="' + it.name + '" data-day="' + DAY_NAMES[day] + '">Записаться</button>' +
    '</div>'
  ).join("");

  schedList.innerHTML = head + '<div class="sched-rows">' + rows + '</div>';

  schedList.querySelectorAll("button[data-name]").forEach((b) => {
    b.addEventListener("click", () => bookFromSchedule(b.dataset.name, b.dataset.day));
  });
}

function plural(n, one, few, many) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

document.querySelectorAll(".sched-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".sched-tab").forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    currentDay = tab.dataset.day;
    renderSchedule(currentDay);
  });
});

function bookFromSchedule(name, day) {
  document.getElementById("bf-program").value = name;
  document.getElementById("bf-day").value = day;
  document.getElementById("booking").scrollIntoView({ behavior: "smooth", block: "start" });
  showToast(name + " подставлено в форму. Осталось ввести имя и телефон.");
}

/* Уведомления */
let toastTimer = null;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 4000);
}

/* Заявка на пробную тренировку */
document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const hpField = document.getElementById("bf-website");
  if (hpField && hpField.value) return;

  const name = document.getElementById("bf-name").value.trim();
  const phone = document.getElementById("bf-phone").value.trim();
  const program = document.getElementById("bf-program").value;
  const day = document.getElementById("bf-day").value;

  if (!name) return showToast("Напиши, как к тебе обращаться");
  if (phone.replace(/\D/g, "").length < 10) return showToast("Проверь телефон: нужно 10—11 цифр");
  if (!program) return showToast("Выбери направление");
  if (!day) return showToast("Выбери удобный день");

  const msg =
    "Заявка с сайта IronFit\n\n" +
    "Имя: " + name + "\n" +
    "Телефон: " + phone + "\n" +
    "Направление: " + program + "\n" +
    "Когда удобно: " + day;

  this.reset();
  showToast("Открываем Telegram — нажми «Отправить»");
  window.open(BOT + "?text=" + encodeURIComponent(msg), "_blank");
});

/* Оформление абонемента */
function openPayment(btn) {
  const card = btn.closest(".price-card");
  const plan = card.dataset.plan;
  const price = Number(card.dataset.price);

  document.getElementById("payPlan").textContent = "Тариф: " + plan;
  document.getElementById("payAmount").textContent = price.toLocaleString("ru-RU");

  document.querySelectorAll("#payModal input").forEach((i) => { i.value = ""; });
  document.getElementById("payModal").classList.add("open");
  document.body.classList.add("no-scroll");
}

function closePayment() {
  document.getElementById("payModal").classList.remove("open");
  document.body.classList.remove("no-scroll");
}

function doPayment() {
  const name = document.getElementById("pm-name").value.trim();
  const phone = document.getElementById("pm-card").value.trim();

  if (!name) return showToast("Напиши, как к тебе обращаться");
  if (phone.replace(/\D/g, "").length < 10) return showToast("Проверь телефон: нужно 10—11 цифр");

  const plan = document.getElementById("payPlan").textContent.replace("Тариф: ", "");
  const amount = document.getElementById("payAmount").textContent;

  const msg =
    "Заявка на абонемент IronFit\n\n" +
    "Тариф: " + plan + "\n" +
    "Стоимость: " + amount + " ₽\n" +
    "Имя: " + name + "\n" +
    "Телефон: " + phone;

  document.getElementById("payModal").classList.remove("open");
  document.body.classList.remove("no-scroll");
  setTimeout(() => {
    document.getElementById("paySuccess").classList.add("open");
    document.body.classList.add("no-scroll");
  }, 200);
  window.open(BOT + "?text=" + encodeURIComponent(msg), "_blank");
}

function closeSuccess() {
  document.getElementById("paySuccess").classList.remove("open");
  document.body.classList.remove("no-scroll");
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") { closePayment(); closeSuccess(); }
});

document.querySelectorAll(".modal").forEach((m) => {
  m.addEventListener("click", (e) => { if (e.target === m) m.classList.remove("open"); });
});

/* Мобильное меню */
(function () {
  var btn = document.getElementById("burgerBtn");
  var nav = document.getElementById("mNav");
  var ov = document.getElementById("mOverlay");
  if (!btn || !nav || !ov) return;

  function close() {
    btn.classList.remove("active");
    nav.classList.remove("open");
    ov.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }

  btn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    btn.classList.toggle("active", open);
    ov.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("no-scroll", open);
  });

  ov.addEventListener("click", close);
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") close(); });
})();

renderSchedule("mon");