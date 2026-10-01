/* =========================================================
   AGUAS ESPECIALES — Desplegable de «Productos» en el menú
   ---------------------------------------------------------
   Al pasar el ratón o pulsar «Productos» se abre la lista completa de
   categorías, para llegar a cualquiera desde cualquier página sin pasar
   antes por el catálogo.

   Las categorías salen de js/catalogo-datos.js: si mañana se añade una,
   aparece aquí sola. No hay una segunda lista escrita a mano.

   Sin JavaScript el enlace «Productos» sigue llevando al catálogo, así
   que nadie se queda sin poder llegar.
   ========================================================= */
(function () {
  "use strict";

  const cats = window.AE_CATEGORIAS;
  const hueco = document.getElementById("menuProductos");
  if (!cats || !hueco) return;

  const DESTINO = hueco.dataset.destino || "productos.html";
  const esc = (s) => String(s).replace(/[&<>"]/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));

  const cuenta = window.AE_CUENTA || (() => 0);

  const items = window.AE_ITEMS_PLANOS || ((c) => c.items || []);
  const TOPE = 10;   // más de diez y el submenú se vuelve una columna infinita

  const CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';

  /* Al pasar el cursor por una categoría se despliegan sus productos. Los que
     tienen página propia van a su página; el resto, a su categoría dentro del
     catálogo, que es donde se pueden cotizar. */
  function submenu(c) {
    const lista = items(c);
    const visibles = lista.slice(0, TOPE);
    const resto = lista.length - visibles.length;
    return `
      <div class="menu-sub">
        <span class="menu-sub__tit">${esc(c.name)}</span>
        ${visibles.map((i) => `
          <a href="${esc(i.href || (DESTINO + "#" + c.id))}">${esc(i.name)}</a>`).join("")}
        ${resto > 0
          ? `<a class="menu-sub__mas" href="${esc(DESTINO)}#${esc(c.id)}">Ver los ${lista.length} ${CHEVRON}</a>`
          : `<a class="menu-sub__mas" href="${esc(DESTINO)}#${esc(c.id)}">Ver la categoría ${CHEVRON}</a>`}
      </div>`;
  }

  hueco.innerHTML = `
    <button class="menu-prod" type="button" id="menuProdBtn" aria-expanded="false" aria-controls="menuProdPanel">
      Productos
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
    </button>
    <div class="menu-panel" id="menuProdPanel" role="group" aria-labelledby="menuProdBtn">
      <a class="menu-panel__todas" href="${esc(DESTINO)}">Ver todas las categorías</a>
      <div class="menu-panel__sep" aria-hidden="true"></div>
      ${cats.map((c) => `
        <div class="menu-cat">
          <a href="${esc(DESTINO)}#${esc(c.id)}">
            <span class="menu-cat__nom">${c.icon} ${esc(c.name)}</span>
            <span class="menu-cat__der"><span class="cuenta">${cuenta(c)}</span>${CHEVRON}</span>
          </a>
          ${submenu(c)}
        </div>`).join("")}
    </div>`;

  const btn = document.getElementById("menuProdBtn");
  const panel = document.getElementById("menuProdPanel");
  let cerrarLento = 0;

  /* ---------- Qué submenú está abierto ----------
     Antes lo decidía el :hover del CSS y el submenú se cerraba solo, «luego
     luego»: al cruzar el hueco entre la categoría y su lista se perdía el
     :hover, y con él el pointer-events de la lista, que ya no recibía el
     cursor cuando llegaba. Y si el cursor iba en diagonal hacia un producto
     de abajo, pasaba por encima de las categorías siguientes y la lista
     cambiaba a otra.

     Ahora lo decide esto, con la clase .is-abierta. La regla es la de los
     menús de las tiendas grandes: si el cursor va hacia la lista abierta, se
     espera un momento antes de cambiar de categoría; si baja en vertical por
     las categorías, cambia al instante. «Va hacia la lista» quiere decir que
     está dentro del triángulo que forman su posición de hace un instante y
     las dos esquinas del borde cercano de la lista. */
  const catsMenu = Array.from(panel.querySelectorAll(".menu-cat"));
  const ESPERA = 320;      // ms que se aguanta la lista si el cursor va hacia ella
  const HOLGURA = 24;      // px de más arriba y abajo del triángulo
  let abierta = null;      // categoría con la lista desplegada
  let sobre = null;        // categoría bajo el cursor ahora mismo
  let esperaCambio = 0;
  let rastro = [];         // últimas posiciones del cursor dentro del panel

  const despliega = (cat) => {
    if (abierta === cat) return;
    if (abierta) abierta.classList.remove("is-abierta");
    abierta = cat;
    if (cat) cat.classList.add("is-abierta");
  };

  function vaHaciaLaLista() {
    if (!abierta || rastro.length < 2) return false;
    const lista = abierta.querySelector(".menu-sub");
    if (!lista) return false;
    const r = lista.getBoundingClientRect();
    if (!r.width) return false;
    const p = rastro[rastro.length - 1];
    const a = rastro[0];
    // La lista abre a la izquierda: su borde cercano es el derecho.
    const b = { x: r.right, y: r.top - HOLGURA };
    const c = { x: r.right, y: r.bottom + HOLGURA };
    const lado = (p1, p2, p3) => (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    const d1 = lado(p, a, b), d2 = lado(p, b, c), d3 = lado(p, c, a);
    const neg = d1 < 0 || d2 < 0 || d3 < 0;
    const pos = d1 > 0 || d2 > 0 || d3 > 0;
    return !(neg && pos);
  }

  function entraEnCategoria(cat) {
    sobre = cat;
    clearTimeout(esperaCambio);
    if (!abierta || cat === abierta) { despliega(cat); return; }
    if (vaHaciaLaLista()) {
      // Si al acabar la espera el cursor sigue en esta categoría (y no llegó
      // a la lista, que es hija de la abierta), es que de verdad la quería.
      esperaCambio = setTimeout(() => { if (sobre === cat) despliega(cat); }, ESPERA);
    } else {
      despliega(cat);
    }
  }

  const abre = () => {
    clearTimeout(cerrarLento);
    panel.classList.add("abierto");
    btn.setAttribute("aria-expanded", "true");
  };
  const cierra = () => {
    clearTimeout(cerrarLento);
    clearTimeout(esperaCambio);
    panel.classList.remove("abierto");
    btn.setAttribute("aria-expanded", "false");
    despliega(null);
    sobre = null;
    rastro = [];
  };

  btn.addEventListener("click", () => {
    panel.classList.contains("abierto") ? cierra() : abre();
  });

  /* Con el ratón se abre solo, pero se cierra con retraso: si no, basta
     rozar el hueco entre el botón y el panel para que se cierre en la cara. */
  const conRaton = window.matchMedia("(hover: hover)").matches;
  if (conRaton) {
    hueco.addEventListener("mouseenter", abre);
    hueco.addEventListener("mouseleave", () => {
      cerrarLento = setTimeout(cierra, 220);
    });

    panel.addEventListener("mousemove", (e) => {
      rastro.push({ x: e.clientX, y: e.clientY });
      if (rastro.length > 4) rastro.shift();
    });
    catsMenu.forEach((cat) => {
      cat.addEventListener("mouseenter", () => entraEnCategoria(cat));
      // Al salir de una categoría hacia una zona del panel que no es otra
      // categoría («Ver todas», la raya), la lista se recoge, con el mismo
      // margen por si el cursor solo estaba de paso.
      cat.addEventListener("mouseleave", () => {
        if (sobre === cat) sobre = null;
        clearTimeout(esperaCambio);
        esperaCambio = setTimeout(() => { if (!sobre) despliega(null); }, ESPERA);
      });
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("abierto")) {
      cierra();
      btn.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (!hueco.contains(e.target)) cierra();
  });

  // Al salir del último enlace con el tabulador, el panel se cierra
  panel.addEventListener("focusout", (e) => {
    if (!hueco.contains(e.relatedTarget)) cierra();
  });
})();
