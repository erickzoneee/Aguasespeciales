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
    email: "ventas@aguasespeciales.com.mx",
    tel1: "55 5899 0125",
    tel1Href: "tel:+525558990125",
    tel2: "55 5899 6566",
    tel2Href: "tel:+525558996566",
    whatsapp: "525558990125",
    address: "Francisco Chilpan, Tultitlán, Estado de México, C.P. 54940",
  };

  /* ---------- Categorías de producto ----------
     group: sirve para los filtros ("aguas" | "reactivos" | "equipo")
     items: lista simple  ·  groups: subcategorías con su propia lista
     href:  cuando el producto tiene página de detalle propia
  -------------------------------------------------------- */
  const CATEGORIES = [
    {
      id: "aguas-especiales",
      num: "01",
      group: "aguas",
      icon: "💧",
      name: "Aguas especiales",
      lead: "Aguas producidas bajo especificación, desde purificada hasta tridestilada, con el perfil iónico que tu proceso necesita.",
      items: [
        { name: "Agua purificada", href: "producto-agua-purificada.html" },
        { name: "Agua suave" },
        { name: "Agua baja en sales" },
        { name: "Agua equilibrada" },
        { name: "Agua desmineralizada", href: "producto-agua-desmineralizada.html" },
        { name: "Agua destilada" },
        { name: "Agua bidestilada", href: "producto-agua-bidestilada.html" },
        { name: "Agua tridestilada" },
        { name: "Agua desionizada" },
        { name: "Agua libre de sílice" },
        { name: "Agua ácida" },
        { name: "Agua básica" },
        { name: "Agua preparada bajo especificación del cliente" },
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
        { name: "Salmuera al 2%" },
        { name: "Salmuera en concentración solicitada por el cliente" },
        { name: "Soluciones acuosas preparadas bajo especificación" },
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
            { name: "Solución buffer pH 4" },
            { name: "Solución buffer pH 7" },
            { name: "Solución buffer pH 10" },
          ],
        },
        {
          title: "Reactivos para análisis de dureza",
          items: [
            { name: "Polvo indicador de dureza total, Eriocromo Negro T" },
            { name: "Solución buffer para dureza total" },
            { name: "Polvo indicador de dureza de calcio" },
            { name: "Solución tituladora de dureza, EDTA" },
          ],
        },
        {
          title: "Reactivos para análisis de alcalinidad",
          items: [
            { name: "Solución indicadora de fenolftaleína" },
            { name: "Solución indicadora de anaranjado de metilo" },
            { name: "Solución tituladora de alcalinidad, ácido sulfúrico 0.02 N" },
          ],
        },
        {
          title: "Reactivos para análisis de cloruros",
          items: [
            { name: "Solución tituladora de cloruros, nitrato de plata 0.0171 N" },
            { name: "Solución indicadora de cloruros, cromato de potasio al 10% m/v" },
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
    {
      id: "material-equipo",
      num: "07",
      group: "equipo",
      icon: "⚗️",
      name: "Material y equipo de laboratorio",
      lead: "Material volumétrico e instrumentación para acompañar tus análisis.",
      items: [
        { name: "Pipeta de 10 mL" },
        { name: "Pera de succión automática" },
        { name: "Bureta automática" },
        { name: "Bureta automática ámbar" },
        { name: "Matraz Erlenmeyer de 250 mL" },
        { name: "Probeta de 50 mL" },
        {
          name: "Medidor multiparamétrico portátil",
          note: "Mide pH, conductividad, STD/TDS y temperatura.",
        },
      ],
    },
    {
      id: "envases",
      num: "08",
      group: "equipo",
      icon: "🧴",
      name: "Envases plásticos",
      lead: "Disponibles en existencia y vendidos por unidad.",
      items: [
        { name: "Frasco gotero plástico de 40 mL" },
        { name: "Envase plástico de 250 mL con tapa" },
        { name: "Envase plástico de 500 mL con tapa" },
      ],
    },
    {
      id: "presentaciones",
      num: "09",
      group: "aguas",
      icon: "📦",
      name: "Presentaciones de agua",
      lead: "Del garrafón al tote de mil litros, con la opción de llenar tus propios recipientes.",
      items: [
        { name: "Garrafón de 19 litros" },
        { name: "Porrón de 20 litros" },
        { name: "Porrón de 50 litros" },
        { name: "Contenedor IBC o tote de 1,000 litros" },
        {
          name: "Llenado de recipientes propiedad del cliente",
        },
      ],
    },
  ];

  /* ---------- Servicios ---------- */
  const SERVICES = [
    {
      id: "analisis-basico",
      num: "01",
      icon: "🧾",
      name: "Análisis fisicoquímico básico de agua",
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
     ÚNICA fuente de los valores numéricos. La página del producto y sus dos
     hojas descargables leen de aquí, así que un cambio en esta tabla se
     refleja en los tres documentos y nunca quedan cifras contradictorias.
     specs: null  → la página no muestra tabla (solo el texto de specsNote)
     micro:  null → sin tabla microbiológica (se muestra microNote si existe)
  -------------------------------------------------------- */
  const WATERS = {
    "agua-desmineralizada": {
      slug: "agua-desmineralizada",
      name: "Agua desmineralizada",
      tagline: "Alta pureza y baja conductividad",
      page: "producto-agua-desmineralizada.html",
      /* Valores de la hoja técnica HT-AE-01 v01 (05/06/2025). Al editarlos aquí
         se actualizan a la vez la página de producto, la hoja técnica y la de
         especificaciones: nunca pueden quedar cifras contradictorias. */
      specs: [
        ["Apariencia", "Líquido transparente, incoloro, libre de partículas visibles"],
        ["pH (a 25 °C)", "5.0 – 7.0"],
        ["Conductividad (a 25 °C)", "≤ 10 µS/cm"],
        ["Sólidos totales disueltos (TDS)", "≤ 10 mg/L"],
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
      micro: [
        ["Mesófilos aerobios", "< 100 UFC/mL"],
        ["Hongos y levaduras", "< 1 UFC/100 mL"],
        ["Pseudomonas aeruginosa", "No detectada en 100 mL"],
        ["Coliformes totales", "No detectados en 100 mL"],
      ],
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
      ],
    },

    "agua-bidestilada": {
      slug: "agua-bidestilada",
      name: "Agua bidestilada",
      tagline: "Doble destilación para uso analítico",
      page: "producto-agua-bidestilada.html",
      specs: [
        ["Apariencia", "Líquido transparente"],
        ["pH", "7.5 – 8.5"],
        ["Conductividad", "Máximo 15 µS"],
        ["Sólidos totales disueltos", "Máximo 1.05 ppm"],
        ["Dureza", "Ausente"],
        ["Calcio", "Ausente"],
        ["Magnesio", "Ausente"],
        ["Sílice", "Ausente"],
        ["Sulfatos", "Ausente"],
        ["Cloruros", "Ausente"],
        ["Color", "Ausente"],
        ["Olor", "Ausente"],
        ["Sedimentos", "Ausente"],
        ["Amonio", "Ausente"],
        ["Anhídrido carbónico libre", "Ausente"],
      ],
      micro: null,
      microNote: "Especificaciones microbiológicas disponibles bajo solicitud.",
      sheets: [
        {
          type: "Hoja técnica",
          code: "HT-AE-02",
          href: "fichas/ht-agua-bidestilada.html",
          desc: "Descripción, beneficios, aplicaciones, presentación, almacenamiento, especificaciones y proceso de producción.",
        },
        {
          type: "Hoja de especificaciones",
          code: "HE-AE-05",
          href: "fichas/he-agua-bidestilada.html",
          desc: "Tabla fisicoquímica con presentación, almacenamiento y firmas de revisión y autorización.",
        },
      ],
    },

    "agua-purificada": {
      slug: "agua-purificada",
      name: "Agua purificada",
      tagline: "Base confiable para procesos e higiene",
      page: "producto-agua-purificada.html",
      specs: null,
      specsNote:
        "Las especificaciones de agua purificada se definen según la aplicación. Solicítanos la hoja de especificaciones correspondiente a tu proceso y te la enviamos con los parámetros que apliquen.",
      micro: null,
      sheets: [],
    },
  };

  window.AE_CATALOG = {
    contact: CONTACT,
    categories: CATEGORIES,
    services: SERVICES,
    waters: WATERS,
  };
})();
