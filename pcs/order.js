(function () {
  "use strict";

  var NAMES = {
    "1": "NOVA START — от 89 990 ₽",
    "2": "ORBIT X — от 159 990 ₽",
    "3": "NEBULA PRO — от 129 990 ₽",
    "4": "STARFORGE X — от 199 990 ₽",
    "5": "SUPERNOVA LEGEND — от 299 990 ₽",
    "6": "COSMOS TITAN — от 389 990 ₽"
  };

  function toast(msg) {
    var t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(function () { t.classList.remove("show"); }, 3200);
  }

  var btn = document.getElementById("order-btn");
  if (btn) {
    btn.addEventListener("click", function () {
      var sel = document.getElementById("rig-select");
      var val = sel ? sel.value : "1";
      var rigName = NAMES[val] || "сборка";
      var nameIn = document.getElementById("order-name");
      var phoneIn = document.getElementById("order-phone");
      var name = nameIn ? nameIn.value.trim() : "";
      var phone = phoneIn ? phoneIn.value.trim() : "";

      if (!name || phone.replace(/\D/g, "").length < 10) {
        toast("Введите имя и телефон");
        return;
      }

      var msg =
        "Заказ сборки ПК с сайта PCMASTER\n\n" +
        "Сборка: " + rigName + "\n" +
        "Имя: " + name + "\n" +
        "Телефон: " + phone;

      window.open("https://t.me/Teller12p_bot?text=" + encodeURIComponent(msg), "_blank");
    });
  }
})();
