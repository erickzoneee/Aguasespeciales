/* =========================================================
   AGUAS ESPECIALES — Categorías del catálogo
   ---------------------------------------------------------
   Las nueve categorías de producto más los servicios de análisis, que
   ahora viven dentro de Productos y no en una página aparte.

   Vive en su propio archivo porque lo leen dos: el catálogo en cuadros
   (js/catalogo.js) y el desplegable del menú (js/menu-productos.js). Si
   estuviera dentro de uno de los dos, el otro tendría una copia y
   tarde o temprano dirían cosas distintas.

   Los datos siguen saliendo de js/catalog.js: aquí no hay ni un nombre
   de producto escrito a mano.
   ========================================================= */
(function () {
  "use strict";

  const CAT = window.AE_CATALOG;
  if (!CAT) return;

  /* Una categoría puede traer items sueltos o agrupados en subcategorías;
     los servicios siempre traen grupos. Esto los aplana igual. */
  function itemsPlanos(x) {
    if (x.groups && x.groups.length) return x.groups.flatMap((g) => g.items);
    return x.items || [];
  }

  const SERVICIOS = {
    id: "servicios-analisis",
    num: "10",
    icon: "🔬",
    name: "Servicios de análisis",
    lead: "Analizamos el agua que entra a tu proceso y la que sale. Se cotizan por separado o como paquete.",
    items: CAT.services.map((s) => ({
      name: s.name,
      note: s.lead,
      lista: itemsPlanos(s).map((i) => i.name),
    })),
  };

  /* Categorías con imagen propia. Casi todas salen de los banners que
     entregó el cliente, recortados para dejar fuera el título —que el cuadro
     ya escribe— y quedarse con la parte de producto; «agua purificada» y
     «aguas especiales» llevan su envase sobre el mismo degradado. Las que no
     tienen imagen llevan su icono sobre un fondo tintado: así todos los
     cuadros miden lo mismo y ninguno queda hueco. */
  const IMAGENES = ["agua-purificada", "aguas-especiales", "aguas-laboratorio",
                    "soluciones-acuosas", "aguas-acondicionadas", "reactivos", "kits"];

  /* El número se calcula por posición y no se escribe a mano. Antes venía de
     js/catalog.js, y al añadir una categoría había que renumerar las nueve
     siguientes a mano: bastaba olvidar una para que la lista saltara del 04
     al 06. */
  window.AE_CATEGORIAS = CAT.categories.concat([SERVICIOS]).map((c, i) => {
    const extra = { num: String(i + 1).padStart(2, "0") };
    if (IMAGENES.indexOf(c.id) !== -1) extra.imagen = "img/cat/" + c.id;
    return Object.assign({}, c, extra);
  });
  window.AE_ITEMS_PLANOS = itemsPlanos;
  window.AE_CUENTA = (c) => itemsPlanos(c).length;
})();
