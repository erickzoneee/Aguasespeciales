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

  const abre = () => {
    clearTimeout(cerrarLento);
    panel.classList.add("abierto");
    btn.setAttribute("aria-expanded", "true");
  };
  const cierra = () => {
    clearTimeout(cerrarLento);
    panel.classList.remove("abierto");
    btn.setAttribute("aria-expanded", "false");
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
