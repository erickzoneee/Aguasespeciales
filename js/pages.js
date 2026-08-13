/* =========================================================
   AGUAS ESPECIALES — Catálogo de productos y servicios
   Renderiza js/catalog.js en productos.html y servicios.html
   ========================================================= */
(function () {
  "use strict";
  const AE = window.AE || {};
  const $ = AE.$ || ((s, ctx = document) => ctx.querySelector(s));
  const $$ = AE.$$ || ((s, ctx = document) => Array.from(ctx.querySelectorAll(s)));
  const toast = AE.toast || function () {};
  const observeReveals = AE.observeReveals || function () {};

  const root = $("#catalogRoot");
  if (!root) return;

  const CATALOG = window.AE_CATALOG;
  if (!CATALOG) {
    root.innerHTML = '<p class="empty-msg">No se pudo cargar el catálogo. Recarga la página.</p>';
    return;
  }

  const mode = root.dataset.mode === "services" ? "services" : "products";
  const DATA = mode === "services" ? CATALOG.services : CATALOG.categories;

  /* ---------- Utilidades ---------- */
  const esc = (s) => String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  // Búsqueda insensible a acentos: "silice" encuentra "sílice"
  const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const countItems = (c) =>
    (c.items ? c.items.length : 0) +
    (c.groups ? c.groups.reduce((n, g) => n + g.items.length, 0) : 0);

  const ARROW = '<svg viewBox="0 0 24 24" class="ico"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ---------- Plantillas ----------
     En productos cada renglón se puede cotizar por separado; en servicios no
     tiene sentido cotizar un parámetro suelto («Bicarbonatos»), así que el
     botón va una sola vez por servicio. */
  const perItemQuote = mode === "products";

  const itemHTML = (item, catName) => {
    const search = norm([item.name, item.note || "", catName].join(" "));
    const link = item.href
      ? `<a class="item__link" href="${esc(item.href)}">Ver ficha técnica ${ARROW}</a>`
      : "";
    const note = item.note ? `<span class="item__note">${esc(item.note)}</span>` : "";
    const actions = (link || perItemQuote)
      ? `<div class="item__actions">
          ${link}
          ${perItemQuote ? `<button class="item__quote" type="button" data-quote="${esc(item.name)}">Cotizar</button>` : ""}
        </div>`
      : "";
    return `
      <li class="item" data-item data-search="${esc(search)}">
        <span class="item__dot" aria-hidden="true"></span>
        <div class="item__main">
          <strong>${esc(item.name)}</strong>
          ${note}
        </div>
        ${actions}
      </li>`;
  };

  const listHTML = (items, catName) =>
    `<ul class="itemlist">${items.map((i) => itemHTML(i, catName)).join("")}</ul>`;

  const bodyHTML = (c) => {
    let out = "";
    if (c.groups) {
      out += c.groups.map((g) => `
        <div class="cat__group" data-group>
          <h3 class="cat__grouptitle">${esc(g.title)}</h3>
          ${g.note ? `<p class="cat__groupnote">${esc(g.note)}</p>` : ""}
          ${listHTML(g.items, c.name + " " + g.title)}
        </div>`).join("");
    }
    if (c.items) out += `<div class="cat__group" data-group>${listHTML(c.items, c.name)}</div>`;
    if (c.footnote) out += `<p class="cat__footnote">${esc(c.footnote)}</p>`;
    if (!perItemQuote) {
      out += `<div class="cat__action">
        <button class="btn btn--primary" type="button" data-quote="${esc(c.name)}">
          Solicitar este análisis ${ARROW}
        </button>
      </div>`;
    }
    return out;
  };

  const catHTML = (c) => `
    <details class="cat reveal" data-reveal data-cat id="${esc(c.id)}" open>
      <summary class="cat__head">
        <span class="cat__num">${esc(c.num)}</span>
        <span class="cat__emoji" aria-hidden="true">${c.icon}</span>
        <span class="cat__title">
          <strong>${esc(c.name)}</strong>
          <span>${esc(c.lead)}</span>
        </span>
        <span class="cat__count">${countItems(c)}</span>
        <span class="cat__chev" aria-hidden="true"></span>
      </summary>
      <div class="cat__body">${bodyHTML(c)}</div>
    </details>`;

  /* ---------- Render ---------- */
  root.innerHTML = DATA.map(catHTML).join("");

  const sideNav = $("#catalogNav");
  if (sideNav) {
    sideNav.innerHTML = DATA.map((c) => `
      <a href="#${esc(c.id)}" data-navlink="${esc(c.id)}">
        <span class="catnav__num">${esc(c.num)}</span>
        <span>${esc(c.name)}</span>
      </a>`).join("");
  }

  observeReveals(root);

  /* ---------- Buscador ---------- */
  const search = $("#catalogSearch");
  const status = $("#catalogStatus");
  const clearBtn = $("#catalogClear");
  const cats = $$("[data-cat]", root);
  const emptyMsg = document.createElement("p");
  emptyMsg.className = "empty-msg";
  emptyMsg.hidden = true;
  emptyMsg.textContent = "Sin resultados. Prueba con otra palabra o escríbenos y lo buscamos por ti.";
  root.appendChild(emptyMsg);

  // Al empezar a buscar guardamos qué categorías estaban abiertas para
  // devolverlas a su sitio cuando se limpie el campo.
  let openBeforeSearch = null;

  const applySearch = (raw) => {
    const q = norm(raw.trim());
    let visible = 0;
    if (q && !openBeforeSearch) openBeforeSearch = cats.map((c) => c.open);

    cats.forEach((cat) => {
      let catHits = 0;
      $$("[data-group]", cat).forEach((group) => {
        let groupHits = 0;
        $$("[data-item]", group).forEach((item) => {
          const hit = !q || item.dataset.search.includes(q);
          item.hidden = !hit;
          if (hit) groupHits++;
        });
        group.hidden = groupHits === 0;
        catHits += groupHits;
      });
      cat.hidden = catHits === 0;
      if (q) cat.open = catHits > 0;
      visible += catHits;
    });

    if (!q && openBeforeSearch) {
      cats.forEach((c, i) => { c.open = openBeforeSearch[i]; });
      openBeforeSearch = null;
    }

    emptyMsg.hidden = visible > 0;
    if (status) {
      status.textContent = q
        ? `${visible} ${visible === 1 ? "resultado" : "resultados"} para «${raw.trim()}»`
        : "";
    }
    if (clearBtn) clearBtn.hidden = !raw.trim();
    if (sideNav) {
      $$("a", sideNav).forEach((a) => {
        const cat = document.getElementById(a.dataset.navlink);
        a.hidden = !!(cat && cat.hidden);
      });
    }
  };

  if (search) {
    search.addEventListener("input", () => applySearch(search.value));
    search.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && search.value) { search.value = ""; applySearch(""); }
    });
  }
  if (clearBtn) {
    clearBtn.hidden = true;
    clearBtn.addEventListener("click", () => {
      if (search) { search.value = ""; search.focus(); }
      applySearch("");
    });
  }

  /* ---------- Abrir / cerrar todo ---------- */
  const toggleAll = $("#catalogToggle");
  if (toggleAll) {
    toggleAll.addEventListener("click", () => {
      const anyClosed = cats.some((c) => !c.open && !c.hidden);
      cats.forEach((c) => { if (!c.hidden) c.open = anyClosed; });
      toggleAll.textContent = anyClosed ? "Contraer todo" : "Expandir todo";
    });
  }

  /* ---------- Índice lateral activo según scroll ---------- */
  if (sideNav && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          $$("a", sideNav).forEach((a) =>
            a.classList.toggle("is-active", a.dataset.navlink === e.target.id));
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    cats.forEach((c) => spy.observe(c));
  }

  /* ---------- Botones «Cotizar» ---------- */
  root.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-quote]");
    if (!btn) return;
    const name = btn.dataset.quote;
    try { sessionStorage.setItem("ae-interes", name); } catch { /* no disponible */ }
    toast("Te llevamos al cotizador con «" + name + "» 💧");
    window.location.href = "index.html#cotizar";
  });

  /* ---------- Si la URL trae un ancla, abre esa categoría ---------- */
  const openFromHash = () => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const target = document.getElementById(id);
    if (target && target.hasAttribute("data-cat")) {
      target.open = true;
      target.scrollIntoView({ behavior: AE.prefersReduced ? "auto" : "smooth", block: "start" });
    }
  };
  openFromHash();
  window.addEventListener("hashchange", openFromHash);
})();
