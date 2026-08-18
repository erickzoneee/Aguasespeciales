/* =========================================================
   AGUAS ESPECIALES — Arranque del visor 3D
   ---------------------------------------------------------
   Three.js pesa, así que no se descarga hasta que el visor está
   a punto de entrar en pantalla. Si no hay WebGL, si el navegador
   es antiguo o si algo falla, se queda la imagen de respaldo que
   ya estaba en el HTML: nunca se ve un hueco.
   ========================================================= */
(function () {
  "use strict";
  var BASE = (function () {
    var s = document.currentScript;
    return s ? new URL(".", s.src).href : new URL("js/", document.baseURI).href;
  })();

  function haySoporte() {
    if (typeof WebGLRenderingContext === "undefined") return false;
    try {
      var c = document.createElement("canvas");
      return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch (e) { return false; }
  }

  function calidadAlta() {
    var estrecho = Math.min(window.innerWidth, window.innerHeight) < 700;
    var pocosNucleos = (navigator.hardwareConcurrency || 8) <= 4;
    var memoriaBaja = (navigator.deviceMemory || 8) <= 4;
    return !(estrecho || pocosNucleos || memoriaBaja);
  }

  var visores = [];
  window.AE_VISORES = visores;

  var nodos = Array.prototype.slice.call(document.querySelectorAll("[data-visor3d], [data-logo3d]"));
  if (!nodos.length) return;

  if (!haySoporte()) {
    nodos.forEach(function (el) { el.classList.add("sin-3d"); });
    return;
  }

  var reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function arranca(el) {
    if (el.dataset.iniciado) return;
    el.dataset.iniciado = "1";
    el.classList.add("is-loading");
    // El isotipo y los envases son piezas distintas y viven en módulos
    // distintos: cada página se descarga solo el que necesita.
    var esLogo = el.hasAttribute("data-logo3d");
    import(BASE + (esLogo ? "logo3d.js" : "bottle3d.js"))
      .then(function (mod) {
        var v = esLogo
          ? mod.crearLogo3D(el, { calidadAlta: calidadAlta(), autogiro: !reducido })
          : mod.crearVisor(el, {
              modelo: el.dataset.visor3d,
              etiqueta: el.dataset.etiqueta,
              calidadAlta: calidadAlta(),
              autogiro: !reducido,
            });
        v.nodo = el;
        visores.push(v);
        el.classList.remove("is-loading");
      })
      .catch(function (err) {
        // Sin 3D se queda lo que ya había en el HTML (foto o animación)
        el.classList.remove("is-loading");
        el.classList.add("sin-3d");
        if (window.console) console.warn("Visor 3D no disponible:", err);
      });
  }

  function yaVisible(el) {
    var r = el.getBoundingClientRect();
    return r.bottom > -300 && r.top < (window.innerHeight || 0) + 300;
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (e.isIntersecting) { arranca(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: "300px" });
    nodos.forEach(function (el) { io.observe(el); });
    // Red de seguridad: si el visor ya está a la vista al cargar, no esperamos
    // al observador (en algunos navegadores la primera notificación tarda).
    setTimeout(function () {
      nodos.forEach(function (el) {
        if (!el.dataset.iniciado && yaVisible(el)) { arranca(el); io.unobserve(el); }
      });
    }, 60);
  } else {
    nodos.forEach(arranca);
  }
})();
