const SCHEDULE = {

  mon: [

    { time: "07:00", name: "Силовая тренировка", coach: "Алексей Исаев" },

    { time: "09:00", name: "Интервальная (HIIT)", coach: "Дмитрий Орлов" },

    { time: "12:00", name: "Йога и стретчинг", coach: "Мария Соколова" },

    { time: "18:00", name: "Бокс и ММА", coach: "Дмитрий Орлов" },

    { time: "20:00", name: "Функциональная тренировка", coach: "Алексей Волков" }

  ],

  tue: [

    { time: "08:00", name: "Йога и стретчинг", coach: "Мария Соколова" },

    { time: "10:00", name: "Силовая тренировка", coach: "Алексей Волков" },

    { time: "17:00", name: "Интервальная (HIIT)", coach: "Дмитрий Орлов" },

    { time: "19:00", name: "Кроссфит", coach: "Алексей Волков" }

  ],

  wed: [

    { time: "07:00", name: "Интервальная (HIIT)", coach: "Дмитрий Орлов" },

    { time: "11:00", name: "Силовая тренировка", coach: "Алексей Волков" },

    { time: "14:00", name: "Зумба", coach: "Мария Соколова" },

    { time: "18:30", name: "Бокс и ММА", coach: "Дмитрий Орлов" },

    { time: "20:30", name: "Стретчинг | Расслабление", coach: "Мария Соколова" }

  ],

  thu: [

    { time: "08:30", name: "Функциональная тренировка", coach: "Алексей Волков" },

    { time: "11:00", name: "Йога и стретчинг", coach: "Мария Соколова" },

    { time: "17:00", name: "Силовая тренировка", coach: "Алексей Волков" },

    { time: "19:00", name: "Спарринг-класс (ММА)", coach: "Дмитрий Орлов" }

  ],

  fri: [

    { time: "07:30", name: "Силовая тренировка", coach: "Алексей Волков" },

    { time: "10:00", name: "Интервальная (HIIT)", coach: "Дмитрий Орлов" },

    { time: "13:00", name: "Йога и стретчинг", coach: "Мария Соколова" },

    { time: "18:00", name: "Кроссфит", coach: "Алексей Волков" },

    { time: "20:00", name: "Бокс и ММА", coach: "Дмитрий Орлов" }

  ],

  sat: [

    { time: "09:00", name: "Зумба", coach: "Мария Соколова" },

    { time: "11:00", name: "Силовая тренировка", coach: "Алексей Волков" },

    { time: "13:00", name: "Интервальная (HIIT)", coach: "Дмитрий Орлов" },

    { time: "15:00", name: "Йога и стретчинг", coach: "Мария Соколова" }

  ],

  sun: [

    { time: "10:00", name: "Йога и стретчинг", coach: "Мария Соколова" },

    { time: "12:00", name: "Функциональная тренировка", coach: "Алексей Волков" },

    { time: "14:00", name: "Стретчинг | Расслабление", coach: "Мария Соколова" }

  ]

};



const DAY_NAMES = {

  mon: "Понедельник", tue: "Вторник", wed: "Среда",

  thu: "Четверг", fri: "Пятница", sat: "Суббота", sun: "Воскресенье"

};



const schedList = document.getElementById("schedList");

const toast = document.getElementById("toast");

let currentDay = "mon";



document.querySelectorAll(".btn").forEach((btn) => {

  btn.addEventListener("click", function (e) {

    const rect = this.getBoundingClientRect();

    const size = Math.max(rect.width, rect.height);

    const ripple = document.createElement("span");

    ripple.className = "btn-ripple";

    ripple.style.width = ripple.style.height = size + "px";

    ripple.style.left = (e.clientX - rect.left - size / 2) + "px";

    ripple.style.top = (e.clientY - rect.top - size / 2) + "px";

    this.appendChild(ripple);

    ripple.addEventListener("animationend", () => ripple.remove());

  });

});



const revealObserver = new IntersectionObserver((entries) => {

  entries.forEach((entry) => {

    if (entry.isIntersecting) {

      entry.target.classList.add("visible");

      revealObserver.unobserve(entry.target);

    }

  });

}, { threshold: 0.12 });



document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));



function renderSchedule(day) {

  const items = SCHEDULE[day] || [];

  schedList.innerHTML = `<h3 class="sched-day-title">${DAY_NAMES[day]}</h3>` +

    items.map((it) =>

      `<div class="sched-item">

         <span class="time">${it.time}</span>

         <div class="name"><h4>${it.name}</h4><p>${DAY_NAMES[day]}, ${it.time}</p></div>

         <span class="coach">🏆 ${it.coach}</span>

         <button class="btn btn-accent" onclick="bookFromSchedule('${it.name}', '${DAY_NAMES[day]}', '${it.time}')">Записаться</button>

       </div>`

    ).join("");

}



document.querySelectorAll(".sched-tab").forEach((tab) => {

  tab.addEventListener("click", () => {

    document.querySelectorAll(".sched-tab").forEach((t) => t.classList.remove("active"));

    tab.classList.add("active");

    currentDay = tab.dataset.day;

    renderSchedule(currentDay);

  });

});



function bookFromSchedule(name, day, time) {

  const program = document.getElementById("bf-program");

  program.value = name;

  const bfDay = document.getElementById("bf-day");

  bfDay.value = day;

  document.getElementById("booking").scrollIntoView({ behavior: "smooth" });

  showToast("Занятие подставлено в форму! Осталось ввести имя и телефон.");

}



function showToast(message) {

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 4000);

}



document.getElementById("bookingForm").addEventListener("submit", function (e) {

  e.preventDefault();

  const name = document.getElementById("bf-name").value.trim();

  const phone = document.getElementById("bf-phone").value.trim();

  const program = document.getElementById("bf-program").value;

  const day = document.getElementById("bf-day").value;



  var hpField = document.getElementById("bf-website");
  if (hpField && hpField.value) return;

  if (!name || !phone || !program || !day) {

    showToast("Заполни все поля формы!");

    return;

  }



  var msg =
    "Заявка с сайта IronFit\n\n" +
    "Имя: " + name + "\n" +
    "Телефон: " + phone + "\n" +
    "Программа: " + program + "\n" +
    "День: " + day;

  if (phone.replace(/\D/g, "").length < 10) {
    showToast("Введите корректный телефон");
    return;
  }

  this.reset();
  showToast("Открываем Telegram — отправь запроку боту");
  window.open("https://t.me/Teller12p_bot?text=" + encodeURIComponent(msg), "_blank");
});



renderSchedule("mon");



/* ---------- Запись через Telegram ---------- */

function openPayment(btn) {

  const card = btn.closest(".price-card");

  const plan = card.dataset.plan;

  const price = card.dataset.price;

  document.getElementById("payPlan").textContent = "Абонемент: " + plan;

  document.getElementById("payAmount").textContent = Number(price).toLocaleString("ru-RU");

  const inputs = document.querySelectorAll("#payModal input");

  inputs.forEach((i) => { i.value = ""; i.classList.remove("fake"); });

  document.getElementById("payModal").classList.add("open");

}



function closePayment() {

  document.getElementById("payModal").classList.remove("open");

}



function doPayment() {
  const name = document.getElementById("pm-name").value.trim();
  const phone = document.getElementById("pm-card").value.trim();

  if (!name || phone.replace(/\D/g, "").length < 10) {
    showToast("Введите имя и телефон");
    return;
  }

  const plan = document.getElementById("payPlan").textContent.replace("Абонемент: ", "");
  const amount = document.getElementById("payAmount").textContent;

  const msg =
    "Оплата абонемента IronFit\n\n" +
    "Тариф: " + plan + "\n" +
    "Стоимость: " + amount + " ₽\n" +
    "Имя: " + name + "\n" +
    "Телефон: " + phone;

  document.getElementById("payModal").classList.remove("open");
  setTimeout(() => document.getElementById("paySuccess").classList.add("open"), 200);
  window.open("https://t.me/Teller12p_bot?text=" + encodeURIComponent(msg), "_blank");
}


function closeSuccess() {
  document.getElementById("paySuccess").classList.remove("open");
}






document.addEventListener("keydown", function (e) {

  if (e.key === "Escape") { closePayment(); closeSuccess(); }

});





/* Mobile burger */

(function () {

  var btn = document.getElementById("burgerBtn");

  var nav = document.getElementById("mNav");

  var ov = document.getElementById("mOverlay");

  if (!btn || !nav) return;

  function close() {

    btn.classList.remove("active");

    nav.classList.remove("open");

    ov.classList.remove("open");

    btn.setAttribute("aria-expanded", "false");

  }

  btn.addEventListener("click", function () {

    var open = nav.classList.toggle("open");

    btn.classList.toggle("active", open);

    ov.classList.toggle("open", open);

    btn.setAttribute("aria-expanded", open ? "true" : "false");

  });

  ov.addEventListener("click", close);

  nav.addEventListener("click", function (e) {

    if (e.target.tagName === "A") close();

  });

})();

