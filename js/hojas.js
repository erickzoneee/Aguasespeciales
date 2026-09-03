/* =========================================================
   AGUAS ESPECIALES — Hojas técnicas: verlas y descargarlas
   ---------------------------------------------------------
   Las especificaciones ya no se copian a una tabla de HTML: se muestra
   la hoja tal cual la emite control de calidad. Así no puede haber una
   cifra en la web que no coincida con la del documento firmado, que era
   el riesgo de tener las dos cosas.

   La hoja se ve como imagen y además se puede abrir aparte o descargar.
   Se probó incrustando el PDF con <object>, pero un PDF dentro de la
   página no pinta en varios navegadores —en teléfono casi ninguno— y
   encima se traga el scroll: al pasar el dedo por encima se mueve el
   documento y no la página. Cada hoja se rasteriza a 150 dpi y se sirve
   en WebP: el visor pasó de 2.3 MB a 158 KB, siempre se ve, y los
   botones siguen abriendo y descargando el PDF de verdad.

   Los datos salen de WATERS, en js/catalog.js.
   ========================================================= */
(function () {
  "use strict";

  const CATALOG = window.AE_CATALOG;
  if (!CATALOG || !CATALOG.waters) return;

  const esc = (s) => String(s).replace(/[&<>"]/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));

  const esPdf = (h) => /\.pdf($|[?#])/i.test(h.href);

  const OJO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
  const BAJA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M4 20h16"/></svg>';

  /* La principal es la hoja técnica con código propio; si no hay, el primer
     PDF; y si tampoco, la primera hoja de la lista. */
  function principal(hojas) {
    const pdfs = hojas.filter(esPdf);
    return pdfs.find((h) => /^HT-AE/i.test(h.code || "")) || pdfs[0] || hojas[0];
  }

  /* Cuántas páginas tiene cada hoja rasterizada. Se escribe aquí y no se
     descubre sola porque el sitio es estático: no hay a quién preguntarle. */
  const PAGINAS = {
    "ht-ae-01-agua-desmineralizada": 1,
    "hoja-tecnica-agua-desmineralizada-tensos": 2,
    "parametros-fq-agua-desmineralizada": 2,
    "certificado-calidad-agua-desmineralizada": 1,
    "hoja-tecnica-agua-bidestilada-tensos": 2,
    "parametros-fq-agua-bidestilada": 2,
  };

  function paginas(h) {
    if (!esPdf(h)) return [];
    const base = h.href.split("/").pop().replace(/\.pdf$/i, "");
    const n = PAGINAS[base] || 1;
    return Array.from({ length: n }, (_, i) => `fichas/pdf/vista/${base}-p${i + 1}.webp`);
  }

  function acciones(h) {
    const nombre = h.href.split("/").pop();
    return `
      <a class="hoja__btn" href="${esc(h.href)}" target="_blank" rel="noopener">${OJO} Ver</a>
      <a class="hoja__btn hoja__btn--baja" href="${esc(h.href)}" download="${esc(nombre)}">${BAJA} Descargar</a>`;
  }

  function pinta(el, slug) {
    const w = CATALOG.waters[slug];
    if (!w) return;
    const hojas = w.sheets || [];

    if (!hojas.length) {
      el.innerHTML = `
        <div class="hoja-vacia">
          <p>Todavía no publicamos la hoja de este producto. Escríbenos a
            <a href="mailto:${esc(CATALOG.contact.email)}">${esc(CATALOG.contact.email)}</a>
            o por WhatsApp y te la enviamos con los parámetros de tu aplicación.</p>
          <a class="btn btn--primary" href="https://wa.me/${esc(CATALOG.contact.whatsapp)}?text=${encodeURIComponent("Hola, necesito la hoja de especificaciones de " + w.name + ".")}" target="_blank" rel="noopener">Pedirla por WhatsApp</a>
        </div>`;
      return;
    }

    const jefa = principal(hojas);
    const resto = hojas.filter((h) => h !== jefa);

    const visor = paginas(jefa)
      .map((src, i) => `<img class="hoja__pag" src="${esc(src)}" alt="${esc(jefa.type)} de ${esc(w.name)}, página ${i + 1}" loading="lazy" decoding="async" />`)
      .join("");

    el.innerHTML = `
      <div class="hoja">
        <div class="hoja__cab">
          <div>
            <strong>${esc(jefa.type)}</strong>
            ${jefa.code && jefa.code !== "—" ? `<span class="hoja__cod">${esc(jefa.code)}</span>` : ""}
            <p>${esc(jefa.desc || "")}</p>
          </div>
          <div class="hoja__acciones">${acciones(jefa)}</div>
        </div>
        ${visor}
      </div>

      ${resto.length ? `
        <h3 class="hoja__otras">Otros documentos de ${esc(w.name.toLowerCase())}</h3>
        <ul class="hoja-lista">
          ${resto.map((h) => `
            <li>
              <div>
                <strong>${esc(h.type)}</strong>
                ${h.code && h.code !== "—" ? `<span class="hoja__cod">${esc(h.code)}</span>` : ""}
                <p>${esc(h.desc || "")}</p>
              </div>
              <div class="hoja__acciones">${acciones(h)}</div>
            </li>`).join("")}
        </ul>` : ""}`;
  }

  document.querySelectorAll("[data-hojas]").forEach((el) => pinta(el, el.dataset.hojas));
})();
