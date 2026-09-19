const SCHEDULE = {
  mon: [
    { time: "07:00", name: "Силовая тренировка", coach: "Алексей Волков" },
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

  if (!name || !phone || !program || !day) {
    showToast("Заполни все поля формы!");
    return;
  }

  let msg = encodeURIComponent(
    "Новая заявка с сайта IronFit!\n\n" +
    "Имя: " + name + "\n" +
    "Телефон: " + phone + "\n" +
    "Программа: " + program + "\n" +
    "День: " + day
  );

  this.reset();
  showToast("Заявка отправлена! Отвечаем в течение 15 минут");

  setTimeout(() => {
    window.open("https://t.me/Pay4o0k333?text=" + msg, "_blank");
  }, 600);
});

renderSchedule("mon");