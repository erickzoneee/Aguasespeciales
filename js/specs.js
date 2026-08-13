/* =========================================================
   AGUAS ESPECIALES — Tablas de especificaciones
   ---------------------------------------------------------
   Rellena, desde js/catalog.js, los contenedores marcados con:
     data-spectable="slug"   → tabla fisicoquímica
     data-microtable="slug"  → tabla microbiológica
     data-sheets="slug"      → enlaces a las hojas descargables
   Lo usan tanto las páginas de producto como las hojas imprimibles,
   así que las cifras salen siempre del mismo sitio.
   ========================================================= */
(function () {
  "use strict";
  const CATALOG = window.AE_CATALOG;
  if (!CATALOG || !CATALOG.waters) return;

  const esc = (s) => String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  const tableHTML = (rows, headParam, caption) => `
    <div class="tablewrap">
      <table class="spectable">
        ${caption ? `<caption>${esc(caption)}</caption>` : ""}
        <thead><tr><th scope="col">${esc(headParam)}</th><th scope="col">Especificación</th></tr></thead>
        <tbody>
          ${rows.map((r) => `<tr><th scope="row">${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>`;

  const noteHTML = (text) => `<p class="panel__note">${esc(text)}</p>`;

  /* ---------- Tabla fisicoquímica ---------- */
  document.querySelectorAll("[data-spectable]").forEach((el) => {
    const w = CATALOG.waters[el.dataset.spectable];
    if (!w) return;
    el.innerHTML = w.specs
      ? tableHTML(w.specs, "Parámetro", el.dataset.caption)
      : noteHTML(w.specsNote || "Especificaciones disponibles bajo solicitud.");
  });

  /* ---------- Tabla microbiológica ---------- */
  document.querySelectorAll("[data-microtable]").forEach((el) => {
    const w = CATALOG.waters[el.dataset.microtable];
    if (!w) return;
    el.innerHTML = w.micro
      ? tableHTML(w.micro, "Parámetro microbiológico", el.dataset.caption)
      : noteHTML(w.microNote || "Especificaciones microbiológicas disponibles bajo solicitud.");
  });

  /* ---------- Hojas descargables ---------- */
  const DOC_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg>';
  const ARROW =
    '<svg viewBox="0 0 24 24" class="ico" aria-hidden="true"><path d="M12 3v12M7 11l5 5 5-5"/><path d="M4 20h16"/></svg>';

  document.querySelectorAll("[data-sheets]").forEach((el) => {
    const w = CATALOG.waters[el.dataset.sheets];
    if (!w) return;
    if (!w.sheets || !w.sheets.length) {
      el.innerHTML = `
        <div class="notice">
          <span class="notice__ico" aria-hidden="true">📄</span>
          <p>Todavía no publicamos la ficha descargable de este producto. Escríbenos a
          <a href="mailto:ventas@aguasespeciales.com.mx">ventas@aguasespeciales.com.mx</a>
          y te la enviamos con los parámetros de tu aplicación.</p>
        </div>`;
      return;
    }
    el.innerHTML = `<div class="sheets">${w.sheets.map((s) => `
      <a class="sheet" href="${esc(s.href)}" target="_blank" rel="noopener">
        <span class="sheet__ico" aria-hidden="true">${DOC_ICON}</span>
        <span class="sheet__main">
          <span class="sheet__code">${esc(s.code)}</span>
          <strong>${esc(s.type)} — ${esc(w.name)}</strong>
          <span>${esc(s.desc)}</span>
        </span>
        <span class="sheet__go">Descargar ${ARROW}</span>
      </a>`).join("")}</div>`;
  });
})();
