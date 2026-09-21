(function () {
  "use strict";

  function openRig(r, o) {
    r.classList.toggle("open", o);
    var g = r.querySelector(".gpu-3d");
    if (g) g.classList.toggle("lit", o);
  }

  document.querySelectorAll(".rig").forEach(function (rig) {
    var ob = rig.querySelector(".detail-btn");
    var hb = rig.querySelector(".hide-btn");
    if (ob) ob.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); openRig(rig, true); });
    if (hb) hb.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); openRig(rig, false); });
  });

  // плавный параллакс объёмных блоков внутри раскрытой карточки
  document.addEventListener("mousemove", function (e) {
    document.querySelectorAll(".rig.open .gpu-3d").forEach(function (g) {
      var re = g.getBoundingClientRect();
      if (!re.width || !re.height) { g.style.transform = "none"; return; }
      var dx = (e.clientX - (re.left + re.width / 2)) / (re.width / 2);
      var dy = (e.clientY - (re.top + re.height / 2)) / (re.height / 2);
      dx = Math.max(-1, Math.min(1, dx));
      dy = Math.max(-1, Math.min(1, dy));
      g.style.transform = "translate3d(" + (dx * 10) + "px," + (dy * 8) + "px,0) rotateY(" + (dx * 10) + "deg) rotateX(" + (-dy * 7) + "deg)";
    });
  });

  // мини-анимация перехода между страницами: штора
  var veil = document.createElement("div");
  veil.className = "veil";
  document.body.appendChild(veil);

  var leaving = false;
  document.addEventListener("click", function (e) {
    if (leaving) return;
    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    var href = a.getAttribute("href");
    if (!href) return;
    if (a.getAttribute("target")) return;
    if (href.charAt(0) === "#" || href.indexOf("mailto:") === 0) return;
    try {
      var u = new URL(href, location.href);
      if (u.origin !== location.origin) return;
    } catch (err) { return; }
    e.preventDefault();
    leaving = true;
    veil.classList.add("show");
    setTimeout(function () { location.href = u.href; }, 340);
  });

  window.addEventListener("pageshow", function () {
    veil.classList.remove("show");
    leaving = false;
  });
})();