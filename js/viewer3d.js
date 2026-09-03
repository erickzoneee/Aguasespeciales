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

  var nodos = Array.prototype.slice.call(document.querySelectorAll("[data-visor3d], [data-logo3d], [data-tote3d]"));
  if (!nodos.length) return;

  if (!haySoporte()) {
    nodos.forEach(function (el) { el.classList.add("sin-3d"); });
    return;
  }

  var reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function arranca(el) {
    if (el.dataset.iniciado) return;
    // data-min3d="1024": por debajo de ese ancho no se descarga nada y se
    // queda la imagen del HTML. Sirve para piezas que en el teléfono se ven
    // igual de bien en foto y no justifican 687 KB de Three.js.
    var minimo = Number(el.dataset.min3d || 0);
    if (minimo && (window.innerWidth || 0) < minimo) {
      el.classList.add("sin-3d");
      return;
    }
    el.dataset.iniciado = "1";
    el.classList.add("is-loading");
    // El isotipo, el tote y los envases son piezas distintas y viven en
    // módulos distintos: cada página se descarga solo el que necesita.
    var tipo = el.hasAttribute("data-logo3d") ? "logo"
      : el.hasAttribute("data-tote3d") ? "tote"
        : "envase";
    var archivo = { logo: "logo3d.js", tote: "tote3d.js", envase: "bottle3d.js" }[tipo];
    import(BASE + archivo)
      .then(function (mod) {
        var comun = { calidadAlta: calidadAlta(), autogiro: !reducido };
        var v = tipo === "logo" ? mod.crearLogo3D(el, comun)
          : tipo === "tote" ? mod.crearTote3D(el, comun)
            : mod.crearVisor(el, {
              modelo: el.dataset.visor3d,
              etiqueta: el.dataset.etiqueta,
              calidadAlta: comun.calidadAlta,
              autogiro: comun.autogiro,
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

  /* El visor no arranca en cuanto se ve: espera a que el navegador tenga un
     hueco libre. Three.js son 687 KB y compiten con la imagen del héroe y con
     las tipografías, que es lo que el visitante está mirando de verdad. El
     timeout de 2 s es el tope: si el navegador nunca queda ocioso, arranca
     igual. Mientras tanto se ve la imagen que ya estaba en el HTML. */
  function programa(el) {
    if (el.dataset.programado) return;
    el.dataset.programado = "1";
    if (window.requestIdleCallback) {
      window.requestIdleCallback(function () { arranca(el); }, { timeout: 2000 });
    } else {
      setTimeout(function () { arranca(el); }, 300);
    }
  }

  function yaVisible(el) {
    var r = el.getBoundingClientRect();
    // Se exige caja real. En movil .hero__visual va con display:none, y un
    // elemento oculto mide 0: pasaba la prueba y disparaba la descarga de los
    // 687 KB de Three.js para un modelo que nadie iba a ver.
    return r.width > 0 && r.height > 0 &&
      r.bottom > -300 && r.top < (window.innerHeight || 0) + 300;
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (e.isIntersecting) { programa(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: "300px" });
    nodos.forEach(function (el) { io.observe(el); });
    // Red de seguridad: si el visor ya está a la vista al cargar, no esperamos
    // al observador (en algunos navegadores la primera notificación tarda).
    setTimeout(function () {
      nodos.forEach(function (el) {
        if (!el.dataset.programado && yaVisible(el)) { programa(el); io.unobserve(el); }
      });
    }, 60);
  } else {
    nodos.forEach(programa);
  }
})();
