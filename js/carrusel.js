/* =========================================================
   AGUAS ESPECIALES — Carrusel de la portada
   ---------------------------------------------------------
   Las imágenes van cambiando solas. Además se puede pasar a mano con
   las flechas, con los puntos, con el teclado o arrastrando el dedo.

   El encargo es «banner en automático», así que la regla de la casa es
   que ninguna pausa se quede pegada. Las pausas se apuntan por motivo en
   un Set, y todo motivo que entra tiene que tener su salida garantizada:
   si uno se queda dentro, el carrusel no vuelve a girar nunca y el
   visitante se queda mirando una sola imagen para siempre.

   Cuatro cosas que un carrusel tiene que hacer bien y casi ninguno hace:

   · Se detiene al pasar el ratón por encima. Si no, se lleva la
     diapositiva justo cuando la persona iba a hacer clic. Eso solo se
     engancha donde hay puntero de verdad: en el móvil un toque dispara
     un mouseenter fingido al que nunca le sigue el mouseleave que lo
     soltaría, y el giro se quedaba muerto hasta recargar la página.
   · Se detiene al enfocar con el TECLADO, no al hacer clic. Un clic del
     ratón también deja el botón enfocado, y nadie va a quitar ese foco
     mientras sigue leyendo: la pausa no se levantaba jamás. Se mira
     :focus-visible, que el tabulador enciende y el ratón no.
   · Se detiene cuando la pestaña no está a la vista. Si no, el
     visitante vuelve al cabo de un rato y está en una imagen que nunca
     eligió, además de gastar batería girando en vacío.
   · Con «reducir movimiento» activado no gira solo. Para quien marca
     esa preferencia, algo que se mueve sin permiso puede llegar a
     marear; las flechas y los puntos siguen ahí.

   Como gira solo, hace falta además un botón de pausa de verdad: quien
   lee despacio tiene que poder pararlo sin depender de dejar el ratón
   encima. Ese botón lo crea este archivo, igual que los puntos.

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
  if (!pista || laminas.length < 2) return;

  const PAUSA = 5500;
  const reducido = window.matchMedia("(prefers-reduced-motion: reduce)");

  let actual = 0;
  let reloj = 0;
  let detenidoPor = new Set();

  /* ---------- Puntos ----------
     El carrusel es lo primero que se ve de la portada: si mañana alguien
     toca el HTML y se lleva por delante los puntos o una flecha, esto tiene
     que seguir girando con lo que quede, no desaparecer entero por un
     descuido en otro archivo. De ahí que todo lo de fuera se compruebe. */
  const puntos = raiz.querySelector(".carrusel__puntos");
  if (puntos) {
    laminas.forEach((lam, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "carrusel__punto";
      b.setAttribute("aria-label", `Ir al banner ${i + 1} de ${laminas.length}`);
      b.addEventListener("click", () => { ve(i, true); reinicia(); });
      puntos.appendChild(b);
    });
  }
  const bolitas = puntos ? Array.from(puntos.children) : [];

  /* ---------- Botón de pausa ----------
     Va en la misma fila que los puntos, que es donde se busca el mando del
     carrusel. El nombre accesible cambia con el estado: es la única forma de
     que quien no ve el icono sepa si al pulsar va a parar o a reanudar. */
  const TRAZO_PAUSA = "M9 5v14M15 5v14";
  const TRAZO_SIGUE = "M9 5l10 7-10 7z";

  function icono(trazo) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    const linea = document.createElementNS(ns, "path");
    linea.setAttribute("d", trazo);
    svg.appendChild(linea);
    return svg;
  }

  const pausa = document.createElement("button");
  pausa.type = "button";
  pausa.className = "carrusel__pausa";
  pausa.addEventListener("click", () => {
    detenidoPor.has("persona") ? sigue("persona") : para("persona");
    pintaPausa();
  });
  (puntos || raiz).appendChild(pausa);
  /* El grupo se llamaba «Ir a un banner», que describía los puntos. Ahora
     también cuelga de él el botón de pausa, que no va a ningún banner, así
     que el nombre del grupo pasa a describir lo que de verdad contiene. */
  if (puntos) puntos.setAttribute("aria-label", "Mando del carrusel");

  /* El botón habla de lo que hace ÉL, no de si el carrusel está quieto en
     este instante. Si mirase a detenidoPor entero diría «Reanudar» con solo
     pasar el ratón por encima, y al pulsarlo pausaría: justo lo contrario de
     lo que promete. Lo que el botón gobierna es el motivo «persona». */
  function pintaPausa() {
    const enMarcha = !detenidoPor.has("persona");
    pausa.replaceChildren(icono(enMarcha ? TRAZO_PAUSA : TRAZO_SIGUE));
    pausa.setAttribute(
      "aria-label",
      enMarcha ? "Pausar el cambio automático de banners" : "Reanudar el cambio automático de banners"
    );
    pausa.classList.toggle("is-pausado", !enMarcha);
    // Con «reducir movimiento» no gira solo: un botón de pausa que no pausa
    // nada solo confunde, así que ahí sobra.
    pausa.hidden = reducido.matches;
  }

  /* Las láminas que no se ven están desplazadas con transform, no ocultas,
     y el navegador no considera que «entren en pantalla»: con loading="lazy"
     dos de las cinco no llegaban a descargarse nunca y el carrusel pasaba a
     un hueco blanco. Se les quita el diferido a la actual, a la siguiente y
     a la anterior: con la flecha izquierda se retrocede tanto como se avanza
     con la derecha, y por ese lado la lámina llegaba en blanco. */
  function precarga(i) {
    const total = laminas.length;
    [(i - 1 + total) % total, i, (i + 1) % total].forEach((n) => {
      laminas[n].querySelectorAll("img[loading='lazy']").forEach((img) => {
        img.loading = "eager";
      });
    });
  }

  /* ---------- Aviso para lector de pantalla ----------
     Una región viva solo se anuncia si el navegador ya la tenía fichada como
     viva ANTES de que cambiara su contenido. Poner aria-live sobre la pista
     justo antes de moverla, en el mismo bloque, no anunciaba nada: llegaba
     tarde. Así que la región se crea aquí, al arrancar, y ya está registrada
     cuando toca hablar.

     Se esconde a la vista pero NO con display:none, que la borraría también
     del árbol de accesibilidad y la dejaría muda. */
  const aviso = document.createElement("p");
  aviso.className = "carrusel__aviso";
  aviso.setAttribute("aria-live", "polite");
  Object.assign(aviso.style, {
    position: "absolute", width: "1px", height: "1px", margin: "-1px",
    padding: "0", border: "0", overflow: "hidden",
    clipPath: "inset(50%)", whiteSpace: "nowrap",
  });
  raiz.appendChild(aviso);

  /* Anunciar el cambio cada 5,5 segundos sería puro ruido: solo habla cuando
     el cambio lo pidió la persona. */
  function anuncia(manual) {
    if (!manual) return;
    const img = laminas[actual].querySelector("img");
    const que = img && img.alt ? `: ${img.alt}` : "";
    aviso.textContent = `Banner ${actual + 1} de ${laminas.length}${que}`;
  }

  /* ---------- Movimiento ---------- */
  function ve(i, manual) {
    actual = (i + laminas.length) % laminas.length;
    precarga(actual);
    anuncia(manual);
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

  const siguiente = (manual) => ve(actual + 1, manual);
  const anterior = (manual) => ve(actual - 1, manual);

  /* ---------- Giro automático ---------- */
  function arranca() {
    if (reducido.matches || detenidoPor.size) return;
    clearInterval(reloj);
    reloj = setInterval(() => siguiente(false), PAUSA);
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
  /* Tras un cambio a mano la cuenta vuelve a empezar de cero: si no, la
     lámina que la persona acaba de elegir podía durarle medio segundo.
     Antes esto preguntaba «if (reloj)» y no reiniciaba nunca nada, porque al
     llegar aquí el reloj ya valía 0: el ratón o el foco lo habían parado un
     instante antes del clic. */
  function reinicia() {
    clearInterval(reloj);
    reloj = 0;
    arranca();
  }

  /* Safari antiguo no entiende :focus-visible y matches() lanza. Si no hay
     manera de distinguir el foco del teclado del que deja un clic,
     preferimos no pausar por foco: mejor perder esa comodidad que volver a
     congelar el giro, que es justo el fallo que se veía en el sitio. */
  function focoDeTeclado(el) {
    if (!el || typeof el.matches !== "function") return false;
    try { return el.matches(":focus-visible"); } catch (e) { return false; }
  }

  if (window.matchMedia("(hover: hover)").matches) {
    raiz.addEventListener("mouseenter", () => para("raton"));
    raiz.addEventListener("mouseleave", () => sigue("raton"));
  }
  /* El focusin manda sobre el motivo «foco»: lo pone Y lo quita. Antes solo
     sabía ponerlo, y el focusout que debía soltarlo tenía un guardia que no
     se cumple cuando el foco se mueve entre elementos de dentro del propio
     carrusel. Bastaba con ir del punto a la flecha para dejar el motivo
     encerrado y el banner quieto para el resto de la visita.

     El botón de pausa se excluye a propósito: llegar a él con el tabulador no
     debe pausar. Si lo hiciera, pulsarlo para reanudar quitaría el motivo
     «persona» pero dejaría dentro el «foco», y el carrusel seguiría parado
     mientras el botón asegura que va en marcha. */
  raiz.addEventListener("focusin", (e) => {
    e.target !== pausa && focoDeTeclado(e.target) ? para("foco") : sigue("foco");
  });
  raiz.addEventListener("focusout", (e) => {
    if (!raiz.contains(e.relatedTarget)) sigue("foco");
  });
  document.addEventListener("visibilitychange", () => {
    document.hidden ? para("pestana") : sigue("pestana");
  });
  reducido.addEventListener("change", () => {
    reducido.matches ? para("preferencia") : sigue("preferencia");
    pintaPausa();
  });

  /* ---------- Flechas y teclado ---------- */
  const flechaPrev = raiz.querySelector(".carrusel__flecha--prev");
  const flechaNext = raiz.querySelector(".carrusel__flecha--next");
  if (flechaPrev) flechaPrev.addEventListener("click", () => { anterior(true); reinicia(); });
  if (flechaNext) flechaNext.addEventListener("click", () => { siguiente(true); reinicia(); });

  raiz.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { anterior(true); reinicia(); }
    else if (e.key === "ArrowRight") { siguiente(true); reinicia(); }
  });

  /* ---------- Arrastre con el dedo ----------
     Solo se toma como gesto si el movimiento es claramente horizontal:
     si no, un intento de bajar por la página cambiaría de banner. */
  let x0 = null, y0 = null;
  raiz.addEventListener("touchstart", (e) => {
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    para("dedo");
    /* Con el dedo encima manda el motivo «dedo», que sí tiene salida
       garantizada por touchend y touchcancel. El «raton» se suelta aquí
       porque en un portátil o una tableta con pantalla táctil el navegador
       declara «hover: hover» —y por tanto se engancharon mouseenter y
       mouseleave—, pero luego un toque dispara el mouseenter simulado sin
       que llegue jamás el mouseleave que lo soltaría. Ese motivo huérfano
       dejaba el banner congelado en la mitad de los equipos híbridos. */
    sigue("raton");
  }, { passive: true });
  raiz.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    const dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      dx < 0 ? siguiente(true) : anterior(true);
    }
    x0 = y0 = null;
    sigue("dedo");
  }, { passive: true });
  /* Un gesto se puede interrumpir sin llegar nunca a touchend: entra una
     llamada, el navegador se queda con el desplazamiento, el dedo sale por
     el borde de la pantalla... Sin esto, el motivo «dedo» se quedaba dentro
     y el banner ya no volvía a girar. */
  raiz.addEventListener("touchcancel", () => {
    x0 = y0 = null;
    sigue("dedo");
  }, { passive: true });

  pintaPausa();
  ve(0, false);
  arranca();
  raiz.classList.add("is-listo");
})();
