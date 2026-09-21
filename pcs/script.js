(function () {
  "use strict";

  var RIGS = document.querySelectorAll(".rig");

  function setOpen(rig, open) {
    rig.classList.toggle("open", open);
    var g = rig.querySelector(".rig-gpu");
    if (g) g.classList.toggle("lit", open);
  }

  RIGS.forEach(function (rig) {
    var openBtn = rig.querySelector(".detail-btn");
    var hideBtn = rig.querySelector(".hide-btn");
    var front = rig.querySelector(".rig-front");

    if (openBtn) {
      openBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(rig, true);
      });
    }
    if (hideBtn) {
      hideBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(rig, false);
      });
    }
    if (front) {
      front.addEventListener("click", function (e) {
        if (e.target.closest("a,button")) return;
        setOpen(rig, !rig.classList.contains("open"));
      });
    }
  });

  // Параллакс видеокарты в открытой карточке
  document.addEventListener("mousemove", function (e) {
    RIGS.forEach(function (rig) {
      var gpu = rig.querySelector(".rig-gpu");
      if (!gpu || !rig.classList.contains("open")) return;
      var rect = rig.getBoundingClientRect();
      var dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      var dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      gpu.style.transform = "translate3d(" + (dx * 26) + "px," + (dy * 20) + "px,0) rotateY(" + (dx * 16) + "deg) rotateX(" + (-dy * 12) + "deg)";
    });
  });

  // Тосты
  var toast = document.getElementById("toast");
  var toastTimer = null;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 3000);
  }

  var orderBtn = document.querySelector(".order-btn");
  if (orderBtn) {
    orderBtn.addEventListener("click", function () {
      var sel = document.getElementById("rig-select");
      var name = sel && sel.selectedIndex >= 0 ? sel.options[sel.selectedIndex].textContent : "выбранная сборка";
      showToast("Заявка отправлена: " + name + " (демо).");
    });
  }

  // Якорная навигация без прыжка
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href").slice(1);
      var el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();
