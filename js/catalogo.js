/* =========================================================
   AGUAS ESPECIALES — Catálogo en cuadros (versión C)
   ---------------------------------------------------------
   Dos niveles, como pidió el cliente: al entrar se ven las nueve
   categorías en cuadro, y al abrir una salen sus productos también en
   cuadro. El índice lateral hace lo mismo que los cuadros, para quien
   ya sabe lo que busca.

   Los datos salen de js/catalog.js, que es la fuente única: aquí no hay
   ni un nombre de producto escrito a mano.

   Sin foto no se inventa una. Las trece aguas de envase de 1 L llevan el
   render de su etiqueta (campo «foto» en js/catalog.js), y los tres con
   modelo 3D tienen además el suyo. Los demás van con el icono de su
   categoría: antes compartían fotos de banco repetidas hasta nueve veces,
   y una tienda donde la misma foto sale nueve veces seguidas se ve peor
   sin fotos que con ellas.
   ========================================================= */
(function () {
  "use strict";

  const CAT = window.AE_CATALOG;
  const raiz = document.getElementById("catalogoRoot");
  if (!CAT || !raiz) return;

  const $ = (s, c) => (c || document).querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));

  /* Los únicos productos con imagen propia. Se identifican por su página
     de detalle, no por el nombre, para que no se rompa si el nombre cambia. */
  const RENDERS = {
    "producto-agua-purificada.html": {
      webp: "img/render-agua-purificada.webp",
      png: "img/render-agua-purificada.png",
      alt: "Botella de 1 L de agua purificada",
    },
    "producto-agua-desmineralizada.html": {
      webp: "img/render-agua-desmineralizada.webp",
      png: "img/render-agua-desmineralizada.png",
      alt: "Frasco de laboratorio de 1 L de agua desmineralizada",
    },
    "producto-agua-bidestilada.html": {
      webp: "img/render-tote-bidestilada.webp",
      png: "img/render-tote-bidestilada.png",
      alt: "Tote de 1000 L de agua bidestilada",
    },
  };

  const TOPE_LISTA = 8;
  const CATEGORIAS = window.AE_CATEGORIAS || CAT.categories;

  const WA = CAT.contact.whatsapp;
  const FLECHA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* Una categoría puede traer items sueltos o agrupados en subcategorías.
     Esto devuelve siempre la misma forma: [{titulo, items}]. */
  const bloques = (c) => (c.groups && c.groups.length)
    ? c.groups.map((g) => ({ titulo: g.title, items: g.items }))
    : [{ titulo: "", items: c.items || [] }];

  const cuenta = (c) => bloques(c).reduce((n, b) => n + b.items.length, 0);

  // Buscar «bidestilada» tiene que encontrar «Agua bidestilada», y buscar
  // «solucion» tiene que encontrar «Solución»: se quitan los acentos de los dos lados.
  const sinAcentos = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  /* ---------- Pintado ---------- */

  /* Todos los cuadros llevan cabecera. Los que tienen foto de producto la
     llevan; el resto, un bloque con el icono de su categoría. Sin eso las
     tarjetas sin foto quedaban altas y huecas al lado de las que sí la
     tienen, que es peor que no tener foto ninguna.

     La foto de la etiqueta manda sobre el render del 3D: es la que enseña
     el envase que llega al cliente, y las trece aguas se ven iguales entre
     sí. El render sigue en su página de producto, girando.

     Sin width ni height: el hueco lo fija el CSS (4:3 y la imagen al 82%),
     y cada envase tiene su propio ancho —la botella redonda es más angosta
     que el frasco cuadrado—, así que un tamaño escrito valdría para uno. */
  function cuadroProducto(item, cat) {
    const render = item.href && RENDERS[item.href];
    const foto = item.foto
      ? { webp: item.foto + ".webp", png: item.foto + ".png",
          alt: "Envase de 1 L de " + item.name.toLowerCase() }
      : render;
    const cabecera = foto
      ? `<div class="prod-tile__foto">
           <picture>
             <source srcset="${esc(foto.webp)}" type="image/webp" />
             <img src="${esc(foto.png)}" alt="${esc(foto.alt)}" loading="lazy" decoding="async" />
           </picture>
         </div>`
      : `<div class="prod-tile__foto prod-tile__foto--icono" aria-hidden="true">
           <span>${cat.icon}</span>
         </div>`;
    const ver = item.href
      ? `<a class="prod-tile__ver" href="${esc(item.href)}">Ver producto ${FLECHA}</a>`
      : "";
    const nota = item.note ? `<p>${esc(item.note)}</p>` : "";
    /* Los servicios traen la lista de lo que determinan. Se muestran los
       primeros y se dice cuántos faltan: la lista entera son casi veinte
       renglones y convertiría el cuadro en una columna. */
    const lista = item.lista && item.lista.length
      ? `<ul class="prod-tile__lista">${item.lista.slice(0, TOPE_LISTA).map((x) => `<li>${esc(x)}</li>`).join("")}` +
        (item.lista.length > TOPE_LISTA
          ? `<li class="prod-tile__mas">y ${item.lista.length - TOPE_LISTA} determinaciones más</li>` : "") +
        `</ul>`
      : "";
    const texto = "Hola, quiero cotizar " + item.name + " (" + cat.name + ").";
    return `
      <article class="prod-tile">
        ${cabecera}
        <div class="prod-tile__cuerpo">
          <h3>${esc(item.name)}</h3>
          ${nota}
          ${lista}
        </div>
        <div class="prod-tile__pie">
          ${ver}
          <a class="prod-tile__cot" href="https://wa.me/${WA}?text=${encodeURIComponent(texto)}"
             target="_blank" rel="noopener">Cotizar</a>
        </div>
      </article>`;
  }

  /* Cada cuadro de categoría lleva cabecera: la imagen de la categoría si la
     tiene, y si no, su icono sobre un fondo tintado. El título va en un <span>
     y no en un <h3> porque el cuadro entero es un <button>, y un botón no
     puede contener encabezados. */
  function cabeceraCategoria(c) {
    if (c.imagen) {
      return `<span class="cat-tile__foto">
        <picture>
          <source srcset="${esc(c.imagen)}.webp" type="image/webp" />
          <img src="${esc(c.imagen)}.jpg" alt="" loading="lazy" decoding="async" width="720" height="540" />
        </picture>
      </span>`;
    }
    return `<span class="cat-tile__foto cat-tile__foto--icono" aria-hidden="true"><span>${c.icon}</span></span>`;
  }

  function pintaCategorias(activa) {
    return `<div class="cat-tiles">${CATEGORIAS.map((c) => `
      <button class="cat-tile${c.id === activa ? " is-active" : ""}" type="button"
              data-cat="${esc(c.id)}" aria-pressed="${c.id === activa}">
        ${cabeceraCategoria(c)}
        <span class="cat-tile__cuerpo">
          <span class="cat-tile__num">${esc(c.num)}</span>
          <span class="cat-tile__titulo">${esc(c.name)}</span>
          <span class="cat-tile__n">${cuenta(c)} productos</span>
        </span>
      </button>`).join("")}</div>`;
  }

  function pintaProductos(c) {
    const partes = bloques(c).map((b) => `
      ${b.titulo ? `<h3 class="prod-sub">${esc(b.titulo)}</h3>` : ""}
      <div class="prod-tiles">${b.items.map((i) => cuadroProducto(i, c)).join("")}</div>`).join("");
    return `
      <div class="prod-head">
        <h2 id="tituloCategoria" tabindex="-1">${c.icon} ${esc(c.name)}</h2>
        <span>${cuenta(c)} productos</span>
      </div>
      <p class="prod-lead">${esc(c.lead)}</p>
      ${partes}`;
  }

  function pintaBusqueda(termino) {
    const t = sinAcentos(termino);
    const hallados = [];
    CATEGORIAS.forEach((c) => {
      bloques(c).forEach((b) => b.items.forEach((i) => {
        if (sinAcentos(i.name + " " + (i.note || "") + " " + c.name).includes(t)) {
          hallados.push({ item: i, cat: c });
        }
      }));
    });
    if (!hallados.length) {
      return `<p class="cat-vacio">Nada coincide con «${esc(termino)}».
        Escríbenos a <a href="mailto:${CAT.contact.email}">${CAT.contact.email}</a> y te decimos si lo manejamos.</p>`;
    }
    return `
      <div class="prod-head">
        <h2 id="tituloCategoria" tabindex="-1">Resultados</h2>
        <span>${hallados.length} producto${hallados.length === 1 ? "" : "s"}</span>
      </div>
      <div class="prod-tiles">${hallados.map((h) => cuadroProducto(h.item, h.cat)).join("")}</div>`;
  }

  /* ---------- Estado ---------- */
  const zonaCat = $("#zonaCategorias", raiz);
  const zonaProd = $("#zonaProductos", raiz);
  const lateral = document.getElementById("catalogoIndice");
  const buscador = document.getElementById("catalogoBuscar");

  function indice(activa) {
    lateral.innerHTML = `<h2>Categorías</h2><ol>${CATEGORIAS.map((c) => `
      <li><button type="button" data-cat="${esc(c.id)}" class="${c.id === activa ? "is-active" : ""}">
        <em>${esc(c.num)}</em> ${esc(c.name)}
      </button></li>`).join("")}</ol>`;
  }

  function abre(id, mueve) {
    const c = CATEGORIAS.find((x) => x.id === id);
    if (!c) return;
    if (buscador) buscador.value = "";
    zonaCat.innerHTML = pintaCategorias(id);
    zonaProd.innerHTML = pintaProductos(c);
    indice(id);
    if (history.replaceState) history.replaceState(null, "", "#" + id);
    if (mueve) {
      const t = document.getElementById("tituloCategoria");
      if (t) { t.scrollIntoView({ behavior: "smooth", block: "start" }); t.focus({ preventScroll: true }); }
    }
  }

  function busca(termino) {
    if (!termino.trim()) { zonaProd.innerHTML = ""; zonaCat.innerHTML = pintaCategorias(null); indice(null); return; }
    zonaCat.innerHTML = pintaCategorias(null);
    zonaProd.innerHTML = pintaBusqueda(termino.trim());
    indice(null);
  }

  raiz.addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (b) abre(b.dataset.cat, true);
  });
  lateral.addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (b) abre(b.dataset.cat, true);
  });

  if (buscador) {
    let t = 0;
    buscador.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => busca(buscador.value), 160);
    });
  }

  /* Arranque: si la URL trae una categoría se abre; si no, se ven los
     nueve cuadros, que es el mapa de lo que se vende. */
  const desdeUrl = decodeURIComponent(location.hash.slice(1));
  if (desdeUrl && CATEGORIAS.some((c) => c.id === desdeUrl)) {
    abre(desdeUrl, false);
  } else {
    zonaCat.innerHTML = pintaCategorias(null);
    indice(null);
  }
})();
