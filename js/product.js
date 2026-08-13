/* =========================================================
   AGUAS ESPECIALES — Página de producto
   Lleva el producto elegido hasta el cotizador del inicio.
   ========================================================= */
(function () {
  "use strict";
  document.querySelectorAll("[data-interes]").forEach((el) => {
    el.addEventListener("click", () => {
      try { sessionStorage.setItem("ae-interes", el.dataset.interes); } catch { /* no disponible */ }
    });
  });
})();
