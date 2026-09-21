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

  // ===== Параллакс видеокарты в открытой карточке =====
  document.addEventListener("mousemove", function (e) {
    RIGS.forEach(function (rig) {
      var gpu = rig.querySelector(".rig-gpu");
      if (!gpu || !rig.classList.contains("open")) return;
      var rect = rig.getBoundingClientRect();
      var dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      var dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      gpu.style.transform = "translate3d(" + (dx * 22) + "px," + (dy * 18) + "px,0) rotateY(" + (dx * 16) + "deg) rotateX(" + (-dy * 12) + "deg)";
    });
  });

  // ===== Штрих-переход между страницами (дёмп сквозь штору) =====
  var veil = document.createElement("div");
  veil.className = "veil";
  document.body.appendChild(veil.version);
  var leaving = false;

  function forceLeave(href, e) {
    if (leaving) return;
    leaving = true;
    e.preventDefault();
    veil.classList.add("show");
    setTimeout(function () {
      window.location.href = href;
    }, 380);
  }

  document.addEventListener("click", function (e) {
    if (leaving) return;
    var a = e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href");
    if (!href) return;
    if (a.getAttribute("target")) return;
    if (href.charAt(0) === "#") return;
    try {
      var u = new URL(href, location.href);
      if (u.origin !== location.origin) return;
      forceLeave(u.href, e);
    } catch (err) {}
  });

  window.addEventListener("pageshow", function () {
    veil.classList.remove("show");
    leaving = false;
  });
})();
