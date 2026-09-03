/* =========================================================
   AGUAS ESPECIALES — Carrusel de la portada
   ---------------------------------------------------------
   Las imágenes van cambiando solas. Además se puede pasar a mano con
   las flechas, con los puntos, con el teclado o arrastrando el dedo.

   Tres cosas que un carrusel tiene que hacer bien y casi ninguno hace:

   · Se detiene al pasar el ratón por encima y al enfocar con el
     teclado. Si no, se lleva la diapositiva justo cuando la persona
     iba a hacer clic.
   · Se detiene cuando la pestaña no está a la vista. Si no, el
     visitante vuelve al cabo de un rato y está en una imagen que nunca
     eligió, además de gastar batería girando en vacío.
   · Con «reducir movimiento» activado no gira solo. Para quien marca
     esa preferencia, algo que se mueve sin permiso puede llegar a
     marear; las flechas y los puntos siguen ahí.

   El primer banner va en el HTML y se carga de inmediato; los demás
   entran con carga diferida. Así lo primero que se ve no espera a que
   bajen cinco imágenes.
   ========================================================= */
(function () {
  "use strict";

  const raiz = document.querySelector("[data-carrusel]");
  if (!raiz) return;

  const pista = raiz.querySelector(".carrusel__pista");
  const laminas = Array.from(raiz.querySelectorAll(".carrusel__lamina"));
  if (laminas.length < 2) return;

  const PAUSA = 5500;
  const reducido = window.matchMedia("(prefers-reduced-motion: reduce)");

  let actual = 0;
  let reloj = 0;
  let detenidoPor = new Set();

  /* ---------- Puntos ---------- */
  const puntos = raiz.querySelector(".carrusel__puntos");
  laminas.forEach((lam, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "carrusel__punto";
    b.setAttribute("aria-label", `Ir al banner ${i + 1} de ${laminas.length}`);
    b.addEventListener("click", () => { ve(i); reinicia(); });
    puntos.appendChild(b);
  });
  const bolitas = Array.from(puntos.children);

  /* Las láminas que no se ven están desplazadas con transform, no ocultas,
     y el navegador no considera que «entren en pantalla»: con loading="lazy"
     dos de las cinco no llegaban a descargarse nunca y el carrusel pasaba a
     un hueco blanco. Se les quita el diferido a la actual y a la siguiente,
     justo antes de que hagan falta. */
  function precarga(i) {
    [i, (i + 1) % laminas.length].forEach((n) => {
      laminas[n].querySelectorAll("img[loading='lazy']").forEach((img) => {
        img.loading = "eager";
      });
    });
  }

  /* ---------- Movimiento ---------- */
  function ve(i) {
    actual = (i + laminas.length) % laminas.length;
    precarga(actual);
    pista.style.transform = `translate3d(${-actual * 100}%, 0, 0)`;
    laminas.forEach((lam, n) => {
      const activa = n === actual;
      lam.classList.toggle("is-activa", activa);
      // Lo que no se ve no debe poder enfocarse con el tabulador
      lam.querySelectorAll("a").forEach((a) => {
        a.tabIndex = activa ? 0 : -1;
      });
      lam.setAttribute("aria-hidden", activa ? "false" : "true");
    });
    bolitas.forEach((b, n) => {
      b.classList.toggle("is-activa", n === actual);
      b.setAttribute("aria-current", n === actual ? "true" : "false");
    });
  }

  const siguiente = () => ve(actual + 1);
  const anterior = () => ve(actual - 1);

  /* ---------- Giro automático ---------- */
  function arranca() {
    if (reducido.matches || detenidoPor.size) return;
    clearInterval(reloj);
    reloj = setInterval(siguiente, PAUSA);
  }
  function para(motivo) {
    detenidoPor.add(motivo);
    clearInterval(reloj);
    reloj = 0;
  }
  function sigue(motivo) {
    detenidoPor.delete(motivo);
    if (!detenidoPor.size) arranca();
  }
  function reinicia() {
    if (reloj) { clearInterval(reloj); arranca(); }
  }

  raiz.addEventListener("mouseenter", () => para("raton"));
  raiz.addEventListener("mouseleave", () => sigue("raton"));
  raiz.addEventListener("focusin", () => para("foco"));
  raiz.addEventListener("focusout", (e) => {
    if (!raiz.contains(e.relatedTarget)) sigue("foco");
  });
  document.addEventListener("visibilitychange", () => {
    document.hidden ? para("pestana") : sigue("pestana");
  });
  reducido.addEventListener("change", () => {
    reducido.matches ? para("preferencia") : sigue("preferencia");
  });

  /* ---------- Flechas y teclado ---------- */
  raiz.querySelector(".carrusel__flecha--prev").addEventListener("click", () => { anterior(); reinicia(); });
  raiz.querySelector(".carrusel__flecha--next").addEventListener("click", () => { siguiente(); reinicia(); });

  raiz.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { anterior(); reinicia(); }
    else if (e.key === "ArrowRight") { siguiente(); reinicia(); }
  });

  /* ---------- Arrastre con el dedo ----------
     Solo se toma como gesto si el movimiento es claramente horizontal:
     si no, un intento de bajar por la página cambiaría de banner. */
  let x0 = null, y0 = null;
  raiz.addEventListener("touchstart", (e) => {
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    para("dedo");
  }, { passive: true });
  raiz.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    const dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      dx < 0 ? siguiente() : anterior();
    }
    x0 = y0 = null;
    sigue("dedo");
  }, { passive: true });

  ve(0);
  arranca();
  raiz.classList.add("is-listo");
})();
