(function () {
  "use strict";

  /* ДЕМО-РЕЖИМ: форма никуда не отправляет данные.
     В боевой версии здесь отправка заявки в CRM или Telegram. */

  var NAMES = {
    "1": "NOVA START — от 89 990 ₽",
    "2": "NEBULA PRO — от 129 990 ₽",
    "3": "ORBIT X — от 159 990 ₽",
    "4": "STARFORGE X — от 199 990 ₽",
    "5": "SUPERNOVA LEGEND — от 299 990 ₽",
    "6": "COSMOS TITAN — от 389 990 ₽"
  };

  function toast(msg) {
    var t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(function () { t.classList.remove("show"); }, 3600);
  }

  var btn = document.getElementById("order-btn");
  var status = document.getElementById("order-status");
  var original = btn ? btn.textContent : "";

  if (btn) {
    btn.addEventListener("click", function () {
      var sel = document.getElementById("rig-select");
      var val = sel ? sel.value : "1";
      var rigName = NAMES[val] || "сборка";
      var nameIn = document.getElementById("order-name");
      var phoneIn = document.getElementById("order-phone");
      var name = nameIn ? nameIn.value.trim() : "";
      var phone = phoneIn ? phoneIn.value.trim() : "";

      if (!name) { toast("Введите имя"); nameIn && nameIn.focus(); return; }
      if (phone.replace(/\D/g, "").length < 10) { toast("Введите телефон: 10—11 цифр"); phoneIn && phoneIn.focus(); return; }

      btn.disabled = true;
      btn.textContent = "Заявка принята (демо)";
      if (status) status.textContent = "Заявка на «" + rigName + "» обработана. В демо-режиме данные не сохраняются и никуда не отправляются.";

      toast("Демо: данные остались на этой странице");

      setTimeout(function () {
        btn.disabled = false;
        btn.textContent = original;
        if (nameIn) nameIn.value = "";
        if (phoneIn) phoneIn.value = "";
      }, 3200);
    });
  }
})();