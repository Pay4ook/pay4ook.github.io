/* Демо-режим: любое действие заказа показывает notice вместо отправки.
   Работает на /pcs/ и /fitness/. Подключать: <script src="/demo.js" defer></script> */
(function () {
  "use strict";

  if (window.__demoNotice) return;

  var STYLE =
    "#__demo{position:fixed;inset:0;z-index:2147483000;display:none;" +
    "place-items:center;padding:24px;background:rgba(12,10,9,.62);" +
    "-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);" +
    "font-family:'Inter','Segoe UI',system-ui,-apple-system,Helvetica,Arial,sans-serif}" +
    "#__demo.on{display:grid}" +
    "#__demo .card{background:#fffdf9;color:#22201d;border-radius:22px;" +
    "max-width:400px;width:100%;padding:34px 32px;text-align:center;" +
    "box-shadow:0 40px 80px -40px rgba(0,0,0,.7);animation:__demoIn .22s cubic-bezier(.2,.9,.3,1)}" +
    "#__demo .badge{display:inline-block;background:rgba(184,84,47,.13);color:#a9542f;" +
    "border-radius:999px;padding:6px 13px;font-size:11px;font-weight:600;" +
    "letter-spacing:.14em;text-transform:uppercase}" +
    "#__demo h3{font-size:23px;font-weight:500;letter-spacing:-.02em;margin:17px 0 0;line-height:1.2}" +
    "#__demo p{font-size:15px;line-height:1.6;color:#6f6a62;margin:11px 0 0}" +
    "#__demo .close{display:block;width:100%;margin-top:24px;padding:14px 22px;border:0;" +
    "border-radius:999px;background:#22201d;color:#f6f4ee;font:inherit;font-size:14.5px;" +
    "font-weight:500;cursor:pointer;" +
    "transition:transform .16s cubic-bezier(.2,.8,.3,1),background .16s ease}" +
    "#__demo .close:hover{transform:translateY(-2px);background:#38352f}" +
    "#__demo .close:active{transform:translateY(1px) scale(.975);transition-duration:.07s}" +
    "@keyframes __demoIn{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}";

  function build() {
    var st = document.createElement("style");
    st.textContent = STYLE;
    document.head.appendChild(st);

    var box = document.createElement("div");
    box.id = "__demo";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.innerHTML =
      '<div class="card">' +
        '<span class="badge">Демо-версия</span>' +
        '<h3>Это демонстрационный заказ</h3>' +
        '<p>Сайт собран для портфолио. Заказ не отправляется, ' +
        'ничего не оплачивается и данные никуда не передаются.</p>' +
        '<button class="close" type="button">Понятно</button>' +
      "</div>";
    document.body.appendChild(box);

    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.classList.contains("close")) hide();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") hide();
    });
  }

  var shown = false;
  function show() {
    if (!document.getElementById("__demo")) build();
    document.getElementById("__demo").classList.add("on");
    shown = true;
  }
  function hide() {
    var el = document.getElementById("__demo");
    if (el) el.classList.remove("on");
    shown = false;
  }

  window.__demoNotice = { show: show, hide: hide };
  window.showDemoNotice = show;

  // 1) клик по любой ссылке на Telegram
  document.addEventListener(
    "click",
    function (e) {
      var a = e.target.closest ? e.target.closest('a[href*="t.me"]') : null;
      if (a) {
        e.preventDefault();
        show();
      }
    },
    true
  );

  // 2) window.open("https://t.me/...") из скриптов форм
  var rawOpen = window.open;
  window.open = function (url) {
    if (typeof url === "string" && url.indexOf("t.me") !== -1) {
      show();
      return null;
    }
    return rawOpen.apply(window, arguments);
  };
})();