/* =========================================================
   AGUAS ESPECIALES — Catálogo maestro
   ---------------------------------------------------------
   Fuente única de datos. Editar aquí actualiza el índice de
   productos del inicio, la página de catálogo, la de servicios
   y las páginas de detalle de cada agua.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Datos de contacto (usados por enlaces generados) ---------- */
  const CONTACT = {
    email: "ventas@tensos.com",
    tel1: "55 5305 3590",
    tel1Href: "tel:+525553053590",
    tel2: "55 8790 8943",
    tel2Href: "tel:+525587908943",
    whatsapp: "525587908943",
    address: "Xochicalco 10, Col. Cerro Grande, Atizapán de Zaragoza, Estado de México, C.P. 52920",
  };

  /* ---------- Categorías de producto ----------
     group: sirve para los filtros de la maqueta A ("aguas" | "reactivos").
            Hubo un tercero, "equipo", que se fue con su única categoría.
     items: lista simple  ·  groups: subcategorías con su propia lista
     href:  cuando el producto tiene página de detalle propia en el diseño de
            la maqueta (versión A). Solo la llevan las tres aguas de siempre.
     pagina: la página del producto en el diseño de la versión final
            (agua-*.html). La usan el catálogo final, el de la versión C y el
            menú «Productos»; la maqueta A sigue con href y, si no hay,
            también va a esta. Ver «Las páginas de cada agua» en el README.
     foto:  ruta sin extensión de la foto de producto; el catálogo le pone
            .webp y .png. La llevan las trece aguas y los doce reactivos.
     alt:   texto alternativo de la foto, cuando «Envase de 1 L de …» no
            describe lo que se ve (los frascos de reactivo).
     escena: ruta sin extensión de una fotografía que llena el recuadro del
            cuadro (.webp y .jpg), en vez de un envase flotando. La llevan
            los tres de soluciones acuosas, con la foto de su categoría.

     «Envases plásticos» y «Presentaciones de agua» se quitaron del sitio el
     13 de octubre de 2026 a petición del cliente, y «Material y equipo de
     laboratorio» el 16 de noviembre. Lo que traían está en el README, en
     «Categorías retiradas».
  -------------------------------------------------------- */
  const ESCENA_SOLUCIONES = "img/cat/soluciones-acuosas";

  /* Los doce reactivos llevan la foto de su frasco, que mandó el cliente el
     14 de noviembre de 2026 (un PDF con una imagen por reactivo). Van sin
     fondo, como las aguas. La etiqueta del frasco dice menos que el nombre
     del catálogo («Solución tituladora para dureza total» y no «…, EDTA»):
     manda el nombre de aquí, que es el que se cotiza. */
  const reactivo = (name, archivo, alt) =>
    ({ name, foto: "img/producto/reactivo-" + archivo, alt });

  const CATEGORIES = [
    {
      id: "agua-purificada",
      num: "01",
      group: "aguas",
      icon: "💧",
      name: "Agua purificada",
      lead: "Agua de uso general para procesos, limpieza de equipos y formulación, en los grados de mineralización que cada proceso necesita.",
      items: [
        { name: "Agua purificada", href: "producto-agua-purificada.html", pagina: "agua-purificada.html", foto: "img/producto/agua-purificada" },
        { name: "Agua baja en sales", foto: "img/producto/agua-baja-en-sales" },
        { name: "Agua equilibrada", foto: "img/producto/agua-equilibrada" },
      ],
    },
    {
      id: "aguas-especiales",
      num: "01",
      group: "aguas",
      icon: "💧",
      name: "Aguas especiales",
      lead: "Aguas producidas bajo especificación, desde purificada hasta tridestilada, con el perfil iónico que tu proceso necesita.",
      items: [
        { name: "Agua suave", pagina: "agua-suave.html", foto: "img/producto/agua-suave" },
        { name: "Agua desmineralizada", href: "producto-agua-desmineralizada.html", pagina: "agua-desmineralizada.html", foto: "img/producto/agua-desmineralizada" },
        { name: "Agua destilada", pagina: "agua-destilada.html", foto: "img/producto/agua-destilada" },
        { name: "Agua bidestilada", href: "producto-agua-bidestilada.html", pagina: "agua-bidestilada.html", foto: "img/producto/agua-bidestilada" },
        { name: "Agua tridestilada", pagina: "agua-tridestilada.html", foto: "img/producto/agua-tridestilada" },
        { name: "Agua desionizada", pagina: "agua-desionizada.html", foto: "img/producto/agua-desionizada" },
        { name: "Agua libre de sílice", pagina: "agua-libre-de-silice.html", foto: "img/producto/agua-libre-de-silice" },
        { name: "Agua ácida", foto: "img/producto/agua-acida" },
        { name: "Agua básica", foto: "img/producto/agua-basica" },
        { name: "Agua preparada bajo especificación del cliente", foto: "img/producto/agua-bajo-especificacion" },
      ],
    },
    {
      id: "aguas-laboratorio",
      num: "02",
      group: "aguas",
      icon: "🔬",
      name: "Aguas para laboratorio",
      lead: "Agua de laboratorio conforme a las clasificaciones internacionales de referencia.",
      groups: [
        {
          title: "Clasificación ASTM",
          items: [
            { name: "Agua Tipo I" },
            { name: "Agua Tipo II" },
            { name: "Agua Tipo III" },
            { name: "Agua Tipo IV" },
          ],
        },
        {
          title: "Clasificación ISO",
          items: [
            { name: "Agua Grado 1" },
            { name: "Agua Grado 2" },
            { name: "Agua Grado 3" },
          ],
        },
      ],
    },
    {
      id: "soluciones-acuosas",
      num: "03",
      group: "aguas",
      icon: "🧫",
      name: "Soluciones acuosas especiales",
      lead: "Soluciones preparadas a la concentración que tú indiques.",
      items: [
        { name: "Salmuera al 2%", escena: ESCENA_SOLUCIONES },
        { name: "Salmuera en concentración solicitada por el cliente", escena: ESCENA_SOLUCIONES },
        { name: "Soluciones acuosas preparadas bajo especificación", escena: ESCENA_SOLUCIONES },
      ],
    },
    {
      id: "aguas-acondicionadas",
      num: "04",
      group: "aguas",
      icon: "❄️",
      name: "Aguas acondicionadas",
      lead: "Agua tratada para chillers y sistemas cerrados, formulada según los materiales de tu instalación.",
      items: [
        {
          name: "Agua acondicionada con TENSOS 40",
          note: "Para chillers y sistemas cerrados. Compatible con aluminio.",
        },
        {
          name: "Agua acondicionada con TENSOS 38",
          note: "Para chillers y sistemas cerrados sin aluminio.",
        },
      ],
    },
    {
      id: "reactivos",
      num: "05",
      group: "reactivos",
      icon: "🧪",
      name: "Reactivos para análisis de agua",
      lead: "Reactivos de fabricación propia para las determinaciones más frecuentes en control de agua. Todos se venden por separado.",
      groups: [
        {
          title: "Soluciones buffer de pH",
          note: "Fabricación propia, presentación de 1 litro. Se venden por separado.",
          items: [
            reactivo("Solución buffer pH 4", "buffer-ph-4", "Frasco ámbar de solución buffer pH 4"),
            reactivo("Solución buffer pH 7", "buffer-ph-7", "Frasco ámbar de solución buffer pH 7"),
            reactivo("Solución buffer pH 10", "buffer-ph-10", "Frasco ámbar de solución buffer pH 10"),
          ],
        },
        {
          title: "Reactivos para análisis de dureza",
          items: [
            reactivo("Polvo indicador de dureza total, Eriocromo Negro T", "polvo-dureza-total", "Frasco ámbar de boca ancha de polvo indicador para dureza total"),
            reactivo("Solución buffer para dureza total", "buffer-dureza-total", "Frasco ámbar de solución buffer para dureza total"),
            reactivo("Polvo indicador de dureza de calcio", "polvo-dureza-calcio", "Frasco ámbar de boca ancha de polvo indicador de dureza de calcio"),
            reactivo("Solución tituladora de dureza, EDTA", "titulador-dureza", "Frasco ámbar de solución tituladora para dureza total"),
          ],
        },
        {
          title: "Reactivos para análisis de alcalinidad",
          items: [
            reactivo("Solución indicadora de fenolftaleína", "indicador-fenolftaleina", "Frasco ámbar de solución indicadora de alcalinidad, fenolftaleína"),
            reactivo("Solución indicadora de anaranjado de metilo", "indicador-anaranjado-metilo", "Frasco ámbar de solución indicadora de alcalinidad, anaranjado de metilo"),
            reactivo("Solución tituladora de alcalinidad, ácido sulfúrico 0.02 N", "titulador-alcalinidad", "Frasco ámbar de solución tituladora de alcalinidad"),
          ],
        },
        {
          title: "Reactivos para análisis de cloruros",
          items: [
            reactivo("Solución tituladora de cloruros, nitrato de plata 0.0171 N", "titulador-cloruros", "Frasco ámbar de solución tituladora de cloruros"),
            reactivo("Solución indicadora de cloruros, cromato de potasio al 10% m/v", "indicador-cloruros", "Frasco ámbar de solución indicadora de cloruros"),
          ],
        },
      ],
    },
    {
      id: "kits",
      num: "06",
      group: "reactivos",
      icon: "🧰",
      name: "Kits para análisis de agua",
      lead: "Kits completos para titular en sitio. Todos los reactivos también pueden comprarse por separado.",
      groups: [
        {
          title: "Dureza total, calcio y magnesio",
          items: [
            { name: "Kit económico" },
            { name: "Kit con bureta automática" },
          ],
        },
        {
          title: "Alcalinidad",
          items: [
            { name: "Kit económico" },
            { name: "Kit con bureta automática" },
          ],
        },
        {
          title: "Cloruros",
          items: [
            { name: "Kit económico" },
            { name: "Kit con bureta automática ámbar" },
          ],
        },
      ],
      footnote: "Todos los reactivos también pueden comprarse por separado.",
    },
  ];

  /* ---------- Servicios ----------
     escena: la foto del servicio que mandó el cliente el 14 de noviembre de
     2026, recortada a 4:3 sin el título que trae impreso (el cuadro ya lo
     escribe). Son tres fotos para cuatro servicios: los dos fisicoquímicos
     comparten la suya. Solo la pinta el catálogo de la versión final. */
  const SERVICES = [
    {
      id: "analisis-basico",
      num: "01",
      icon: "🧾",
      name: "Análisis fisicoquímico básico de agua",
      escena: "img/servicio/analisis-fisicoquimicos",
      lead: "El panorama completo del agua que entra a tu proceso, con balance iónico incluido.",
      groups: [
        {
          title: "Parámetros",
          items: [
            { name: "Dureza total" },
            { name: "Dureza de calcio" },
            { name: "Dureza de magnesio" },
            { name: "Alcalinidad F" },
            { name: "Alcalinidad M" },
            { name: "Cloruros" },
            { name: "Sílice" },
            { name: "pH" },
            { name: "Conductividad" },
            { name: "Sólidos totales disueltos (STD/TDS)" },
            { name: "Balance iónico" },
          ],
        },
        {
          title: "Cationes",
          items: [{ name: "Calcio" }, { name: "Magnesio" }, { name: "Sodio" }],
        },
        {
          title: "Aniones",
          items: [
            { name: "Bicarbonatos" },
            { name: "Carbonatos" },
            { name: "Hidróxidos" },
            { name: "Sulfatos" },
            { name: "Cloruros" },
          ],
        },
      ],
    },
    {
      id: "analisis-ampliado",
      num: "02",
      icon: "📈",
      name: "Análisis fisicoquímico ampliado de agua",
      escena: "img/servicio/analisis-fisicoquimicos",
      lead: "Incluye todo el análisis básico y suma cuatro determinaciones adicionales.",
      groups: [
        {
          title: "Incluye",
          items: [{ name: "Todos los parámetros del análisis fisicoquímico básico" }],
        },
        {
          title: "Además determina",
          items: [
            { name: "Hierro" },
            { name: "Manganeso" },
            { name: "Potasio" },
            { name: "Nitratos" },
          ],
        },
      ],
    },
    {
      id: "analisis-microbiologico",
      num: "03",
      icon: "🦠",
      name: "Análisis microbiológicos de agua",
      escena: "img/servicio/analisis-microbiologicos",
      lead: "Se ofrecen individualmente o como paquete completo.",
      items: [
        { name: "Hongos y levaduras" },
        { name: "Mesófilos aerobios" },
        { name: "Pseudomonas aeruginosa" },
        { name: "Escherichia coli" },
      ],
    },
    {
      id: "toma-muestra",
      num: "04",
      icon: "🚚",
      name: "Toma de muestra en sitio",
      escena: "img/servicio/muestreo-en-sitio",
      lead: "Vamos por la muestra para que el resultado represente de verdad tu agua. Servicio con costo adicional.",
      items: [
        { name: "Recipiente adecuado" },
        { name: "Toma de muestra" },
        { name: "Identificación y etiquetado" },
        { name: "Conservación o enfriamiento cuando corresponda" },
        { name: "Registro y traslado al laboratorio" },
      ],
      footnote: "Servicio con costo adicional. El alcance se define según el tipo de análisis solicitado.",
    },
  ];

  /* ---------- Especificaciones de las aguas con página propia ----------
     ÚNICA fuente de los valores numéricos en la web. Las hojas imprimibles de
     fichas/ (HT y HE) pintan sus tablas desde aquí, y las páginas de cada
     agua enseñan la hoja oficial del cliente en imagen (js/hojas.js).

     Las cifras se transcribieron de las hojas que mandó el cliente y se
     verificaron con una segunda transcripción a ciegas, celda por celda
     (280 celdas, 0 diferencias de cifra). Si llega una hoja nueva, se compara
     contra esto antes de publicarla: mismo nombre no garantiza mismas cifras.

     Lo que traen las hojas tal cual, aunque parezca raro, está anotado en el
     README («Las hojas del 14 de noviembre»): la sílice «0 mg/L» sin «≤», la
     conductividad del agua suave sin «≤», y el proceso de ósmosis inversa e
     intercambio iónico en destilada, bidestilada y tridestilada.

     specs: null  → la hoja imprimible no muestra tabla (solo specsNote)
     micro:  null → sin tabla microbiológica (se muestra microNote si existe)
     sheets: []   → la página dice que no hay hoja publicada y ofrece pedirla
     page:   la página de la maqueta (versión A), si la hay
     pagina: la página de la versión final
  -------------------------------------------------------- */

  /* La tabla microbiológica es idéntica en las ocho hojas. */
  const MICRO_HOJAS = [
    ["Mesófilos aerobios", "< 100 UFC/mL"],
    ["Hongos y levaduras", "< 1 UFC/100 mL"],
    ["Pseudomonas aeruginosa", "No detectada en 100 mL"],
    ["Coliformes totales", "No detectados en 100 mL"],
  ];

  const WATERS = {
    "agua-desmineralizada": {
      slug: "agua-desmineralizada",
      name: "Agua desmineralizada",
      tagline: "Alta pureza y baja conductividad",
      page: "producto-agua-desmineralizada.html",
      pagina: "agua-desmineralizada.html",
      /* Hoja técnica HT-AE-01 v01 (05/06/2025). La del 14 de noviembre de 2026 es
         el mismo archivo, byte a byte. Ese día salieron de la lista tres PDF
         que decían pH 5.5–7.5 y TDS 1.4 ppm (parámetros FQ, hoja extendida y
         certificado); siguen en fichas/pdf/ pero ya no se enlazan. */
      specs: [
        ["Apariencia", "Líquido transparente, incoloro, inodoro y libre de partículas visibles"],
        ["pH (a 25 °C)", "5.0 – 7.0"],
        ["Conductividad (a 25 °C)", "≤ 2.5 µS/cm"],
        ["Sólidos totales disueltos (TDS)", "≤ 1.25 mg/L"],
        ["Dureza total (como CaCO₃)", "≤ 1 mg/L"],
        ["Cloruros (Cl⁻)", "≤ 1 mg/L"],
        ["Sulfatos (SO₄²⁻)", "≤ 1 mg/L"],
        ["Sodio (Na⁺)", "≤ 1 mg/L"],
        ["Sílice (SiO₂)", "≤ 0.5 mg/L"],
        ["Hierro (Fe)", "≤ 0.1 mg/L"],
        ["Color", "≤ 5 UC (Unidades de Color)"],
        ["Olor", "Inodoro"],
        ["Turbidez", "≤ 1 NTU"],
      ],
      micro: MICRO_HOJAS,
      sheets: [
        {
          type: "Hoja técnica",
          code: "HT-AE-01",
          href: "fichas/ht-agua-desmineralizada.html",
          desc: "Descripción, beneficios, aplicaciones, presentación, almacenamiento, especificaciones y proceso de producción.",
        },
        {
          type: "Hoja de especificaciones",
          code: "HE-AE-04",
          href: "fichas/he-agua-desmineralizada.html",
          desc: "Tablas fisicoquímica y microbiológica con presentación, almacenamiento y firmas de revisión y autorización.",
        },
        {
          type: "Hoja técnica (PDF)",
          code: "HT-AE-01",
          href: "fichas/pdf/ht-ae-01-agua-desmineralizada.pdf",
          desc: "La hoja técnica oficial, tal como la emite control de calidad.",
        },
      ],
    },

    "agua-bidestilada": {
      slug: "agua-bidestilada",
      name: "Agua bidestilada",
      tagline: "Alta pureza y baja conductividad",
      page: "producto-agua-bidestilada.html",
      pagina: "agua-bidestilada.html",
      /* Hoja del 14 de noviembre de 2026, sin código ni versión impresos. Sustituye a la de
         pH 7.5–8.5 y máximo 15 µS: sus dos PDF (parámetros FQ y hoja extendida
         Tensos) siguen en fichas/pdf/ pero ya no se enlazan. */
      specs: [
        ["Apariencia", "Líquido transparente, incoloro, inodoro y libre de partículas visibles"],
        ["pH (a 25 °C)", "5.0 – 7.0"],
        ["Conductividad (a 25 °C)", "≤ 1.5 µS/cm"],
        ["Sólidos totales disueltos (TDS)", "≤ 1.25 mg/L"],
        ["Dureza total (como CaCO₃)", "≤ 1 mg/L"],
        ["Cloruros (Cl⁻)", "≤ 1 mg/L"],
        ["Sulfatos (SO₄²⁻)", "≤ 1 mg/L"],
        ["Sodio (Na⁺)", "≤ 1 mg/L"],
        ["Sílice (SiO₂)", "≤ 0.5 mg/L"],
        ["Hierro (Fe)", "≤ 0.1 mg/L"],
        ["Color", "≤ 5 UC (Unidades de Color)"],
        ["Olor", "Inodoro"],
        ["Turbidez", "≤ 1 NTU"],
      ],
      micro: MICRO_HOJAS,
      sheets: [
        {
          type: "Hoja técnica (PDF)",
          code: "—",
          href: "fichas/pdf/hoja-tecnica-agua-bidestilada.pdf",
          desc: "Descripción, características, aplicaciones, presentación, almacenamiento, especificaciones fisicoquímicas y microbiológicas, y proceso de producción.",
        },
        {
          type: "Hoja técnica",
          code: "HT-AE-02",
          href: "fichas/ht-agua-bidestilada.html",
          desc: "Versión imprimible, con las mismas cifras que la hoja técnica.",
        },
        {
          type: "Hoja de especificaciones",
          code: "HE-AE-05",
          href: "fichas/he-agua-bidestilada.html",
          desc: "Tablas fisicoquímica y microbiológica con presentación, almacenamiento y firmas de revisión y autorización.",
        },
      ],
    },

    "agua-purificada": {
      slug: "agua-purificada",
      name: "Agua purificada",
      tagline: "Alta pureza y baja conductividad",
      page: "producto-agua-purificada.html",
      pagina: "agua-purificada.html",
      /* Hoja «Agua purificada Nivel 1». Hoja del 14 de noviembre de 2026, sin código ni versión impresos.
         El producto conserva el nombre «Agua purificada», a petición del cliente. */
      specs: [
        ["Apariencia", "Líquido transparente, incoloro, inodoro y libre de partículas visibles"],
        ["pH (a 25 °C)", "5.0 – 7.0"],
        ["Conductividad (a 25 °C)", "≤ 1.5 µS/cm"],
        ["Sólidos totales disueltos (TDS)", "≤ 1.25 mg/L"],
        ["Dureza total (como CaCO₃)", "≤ 1 mg/L"],
        ["Cloruros (Cl⁻)", "≤ 1 mg/L"],
        ["Sulfatos (SO₄²⁻)", "≤ 1 mg/L"],
        ["Sodio (Na⁺)", "≤ 1 mg/L"],
        ["Sílice (SiO₂)", "≤ 0.5 mg/L"],
        ["Hierro (Fe)", "≤ 0.1 mg/L"],
        ["Color", "≤ 5 UC (Unidades de Color)"],
        ["Olor", "Inodoro"],
        ["Turbidez", "≤ 1 NTU"],
      ],
      micro: MICRO_HOJAS,
      sheets: [
        {
          type: "Hoja técnica (PDF)",
          code: "—",
          href: "fichas/pdf/hoja-tecnica-agua-purificada-nivel-1.pdf",
          desc: "Hoja de agua purificada Nivel 1. Descripción, características, aplicaciones, presentación, almacenamiento, especificaciones fisicoquímicas y microbiológicas, y proceso de producción.",
        },
      ],
    },

    "agua-suave": {
      slug: "agua-suave",
      name: "Agua suave",
      tagline: "Agua tratada para reducir la dureza",
      pagina: "agua-suave.html",
      /* Hoja del 14 de noviembre de 2026, sin código ni versión impresos. Trae menos filas que las
         demás: no especifica cloruros, sulfatos, sodio ni sílice. */
      specs: [
        ["Apariencia", "Líquido transparente, incoloro, inodoro y libre de partículas visibles"],
        ["pH (a 25 °C)", "6.8 - 7.8"],
        ["Conductividad (a 25 °C)", "150 µS/cm"],
        ["Sólidos totales disueltos (TDS)", "No especificado"],
        ["Dureza total (como CaCO₃)", "0 mg/L"],
        ["Hierro (Fe)", "≤ 0.1 mg/L"],
        ["Color", "≤ 5 UC (Unidades de Color)"],
        ["Olor", "Inodoro"],
        ["Turbidez", "≤ 1 NTU"],
      ],
      micro: MICRO_HOJAS,
      sheets: [
        {
          type: "Hoja técnica (PDF)",
          code: "—",
          href: "fichas/pdf/hoja-tecnica-agua-suave.pdf",
          desc: "Descripción, características, aplicaciones, presentación, almacenamiento, especificaciones fisicoquímicas y microbiológicas, y proceso de producción.",
        },
      ],
    },

    "agua-destilada": {
      slug: "agua-destilada",
      name: "Agua destilada",
      tagline: "Alta pureza y baja conductividad",
      pagina: "agua-destilada.html",
      /* Hoja del 14 de noviembre de 2026, sin código ni versión impresos. */
      specs: [
        ["Apariencia", "Líquido transparente, incoloro, inodoro y libre de partículas visibles"],
        ["pH (a 25 °C)", "5.0 – 7.0"],
        ["Conductividad (a 25 °C)", "≤ 2.0 µS/cm"],
        ["Sólidos totales disueltos (TDS)", "≤ 1.25 mg/L"],
        ["Dureza total (como CaCO₃)", "≤ 1 mg/L"],
        ["Cloruros (Cl⁻)", "≤ 1 mg/L"],
        ["Sulfatos (SO₄²⁻)", "≤ 1 mg/L"],
        ["Sodio (Na⁺)", "≤ 1 mg/L"],
        ["Sílice (SiO₂)", "≤ 0.5 mg/L"],
        ["Hierro (Fe)", "≤ 0.1 mg/L"],
        ["Color", "≤ 5 UC (Unidades de Color)"],
        ["Olor", "Inodoro"],
        ["Turbidez", "≤ 1 NTU"],
      ],
      micro: MICRO_HOJAS,
      sheets: [
        {
          type: "Hoja técnica (PDF)",
          code: "—",
          href: "fichas/pdf/hoja-tecnica-agua-destilada.pdf",
          desc: "Descripción, características, aplicaciones, presentación, almacenamiento, especificaciones fisicoquímicas y microbiológicas, y proceso de producción.",
        },
      ],
    },

    "agua-tridestilada": {
      slug: "agua-tridestilada",
      name: "Agua tridestilada",
      tagline: "Alta pureza y baja conductividad",
      pagina: "agua-tridestilada.html",
      /* Hoja del 14 de noviembre de 2026, sin código ni versión impresos. */
      specs: [
        ["Apariencia", "Líquido transparente, incoloro, inodoro y libre de partículas visibles"],
        ["pH (a 25 °C)", "5.0 – 7.0"],
        ["Conductividad (a 25 °C)", "≤ 1.0 µS/cm"],
        ["Sólidos totales disueltos (TDS)", "≤ 1.25 mg/L"],
        ["Dureza total (como CaCO₃)", "≤ 1 mg/L"],
        ["Cloruros (Cl⁻)", "≤ 1 mg/L"],
        ["Sulfatos (SO₄²⁻)", "≤ 1 mg/L"],
        ["Sodio (Na⁺)", "≤ 1 mg/L"],
        ["Sílice (SiO₂)", "≤ 0.5 mg/L"],
        ["Hierro (Fe)", "≤ 0.1 mg/L"],
        ["Color", "≤ 5 UC (Unidades de Color)"],
        ["Olor", "Inodoro"],
        ["Turbidez", "≤ 1 NTU"],
      ],
      micro: MICRO_HOJAS,
      sheets: [
        {
          type: "Hoja técnica (PDF)",
          code: "—",
          href: "fichas/pdf/hoja-tecnica-agua-tridestilada.pdf",
          desc: "Descripción, características, aplicaciones, presentación, almacenamiento, especificaciones fisicoquímicas y microbiológicas, y proceso de producción.",
        },
      ],
    },

    "agua-desionizada": {
      slug: "agua-desionizada",
      name: "Agua desionizada",
      tagline: "Alta pureza y baja conductividad",
      pagina: "agua-desionizada.html",
      /* Hoja del 14 de noviembre de 2026, sin código ni versión impresos. */
      specs: [
        ["Apariencia", "Líquido transparente, incoloro, inodoro y libre de partículas visibles"],
        ["pH (a 25 °C)", "5.0 – 7.0"],
        ["Conductividad (a 25 °C)", "≤ 1.0 µS/cm"],
        ["Sólidos totales disueltos (TDS)", "≤ 1.25 mg/L"],
        ["Dureza total (como CaCO₃)", "≤ 1 mg/L"],
        ["Cloruros (Cl⁻)", "≤ 1 mg/L"],
        ["Sulfatos (SO₄²⁻)", "≤ 1 mg/L"],
        ["Sodio (Na⁺)", "≤ 1 mg/L"],
        ["Sílice (SiO₂)", "≤ 0.5 mg/L"],
        ["Hierro (Fe)", "≤ 0.1 mg/L"],
        ["Color", "≤ 5 UC (Unidades de Color)"],
        ["Olor", "Inodoro"],
        ["Turbidez", "≤ 1 NTU"],
      ],
      micro: MICRO_HOJAS,
      sheets: [
        {
          type: "Hoja técnica (PDF)",
          code: "—",
          href: "fichas/pdf/hoja-tecnica-agua-desionizada.pdf",
          desc: "Descripción, características, aplicaciones, presentación, almacenamiento, especificaciones fisicoquímicas y microbiológicas, y proceso de producción.",
        },
      ],
    },

    "agua-libre-de-silice": {
      slug: "agua-libre-de-silice",
      name: "Agua libre de sílice",
      tagline: "Alta pureza y baja conductividad",
      pagina: "agua-libre-de-silice.html",
      /* Hoja del 14 de noviembre de 2026, sin código ni versión impresos. */
      specs: [
        ["Apariencia", "Líquido transparente, incoloro, inodoro y libre de partículas visibles"],
        ["pH (a 25 °C)", "5.0 – 7.0"],
        ["Conductividad (a 25 °C)", "≤ 1.0 µS/cm"],
        ["Sólidos totales disueltos (TDS)", "≤ 1.25 mg/L"],
        ["Dureza total (como CaCO₃)", "≤ 1 mg/L"],
        ["Cloruros (Cl⁻)", "≤ 1 mg/L"],
        ["Sulfatos (SO₄²⁻)", "≤ 1 mg/L"],
        ["Sodio (Na⁺)", "≤ 1 mg/L"],
        ["Sílice (SiO₂)", "0 mg/L"],
        ["Hierro (Fe)", "≤ 0.1 mg/L"],
        ["Color", "≤ 5 UC (Unidades de Color)"],
        ["Olor", "Inodoro"],
        ["Turbidez", "≤ 1 NTU"],
      ],
      micro: MICRO_HOJAS,
      sheets: [
        {
          type: "Hoja técnica (PDF)",
          code: "—",
          href: "fichas/pdf/hoja-tecnica-agua-libre-de-silice.pdf",
          desc: "Descripción, características, aplicaciones, presentación, almacenamiento, especificaciones fisicoquímicas y microbiológicas, y proceso de producción.",
        },
      ],
    },
  };

  window.AE_CATALOG = {
    contact: CONTACT,
    categories: CATEGORIES,
    services: SERVICES,
    waters: WATERS,
  };
})();
