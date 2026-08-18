# Aguas Especiales — Sitio web

Sitio estático (HTML/CSS/JS, sin compilación) de **Aguas Especiales**: agua purificada de grado científico, médico e industrial, reactivos, kits y servicios de análisis.

## 🚀 Cómo verlo

Abre **`index.html`** en tu navegador. No requiere instalación ni servidor.

> Para desarrollo con recarga automática puedes usar cualquier servidor estático:
> ```bash
> npx serve .
> ```

## 📁 Estructura

```
Pagina AguasEspeciales/
├── index.html                          # Portada
├── productos.html                      # Catálogo completo (9 categorías, 58 productos)
├── servicios.html                      # 4 servicios de análisis
├── producto-agua-purificada.html       # Ficha de producto
├── producto-agua-desmineralizada.html  # Ficha de producto
├── producto-agua-bidestilada.html      # Ficha de producto
├── fichas/                             # Hojas imprimibles (tamaño carta)
│   ├── ht-agua-desmineralizada.html    # Hoja técnica          HT-AE-01
│   ├── he-agua-desmineralizada.html    # Hoja de especificac.  HE-AE-04
│   ├── ht-agua-bidestilada.html        # Hoja técnica          HT-AE-02
│   └── he-agua-bidestilada.html        # Hoja de especificac.  HE-AE-05
├── img/
│   ├── logo-aguas-especiales.svg       # Isotipo a todo color (imprenta, proveedores)
│   ├── favicon.svg                     # Isotipo macizo, legible a 16 px
│   ├── etiqueta-*.jpg                  # Texturas de etiqueta para los modelos 3D
│   └── render-agua-*.webp/.png         # Imágenes de respaldo, sacadas del propio 3D
├── css/
│   ├── styles.css                      # Sistema de diseño + tema claro/oscuro
│   ├── pages.css                       # Catálogo, servicios y páginas de producto
│   └── ficha.css                       # Hojas imprimibles (siempre en claro)
└── js/
    ├── catalog.js                      # ⭐ Datos del catálogo y especificaciones
    ├── site.js                         # Tema, menú, scroll, reveal (todas las páginas)
    ├── main.js                         # Interactividad de la portada
    ├── pages.js                        # Catálogo y servicios
    ├── specs.js                        # Tablas de especificaciones y descargas
    ├── product.js                      # Páginas de producto
    ├── viewer3d.js                     # Arranque diferido de los visores 3D
    ├── bottle3d.js                     # Envases en 3D (módulo ES)
    ├── logo3d.js                       # Isotipo en 3D (módulo ES)
    └── vendor/three.module.js          # Three.js, servido desde el propio sitio
```

## ✏️ Cómo editar el contenido

### Productos y servicios → `js/catalog.js`

Todo el catálogo vive en un solo archivo. Añadir un producto es agregar una línea:

```js
{ name: "Agua tridestilada" },                                  // producto simple
{ name: "Agua purificada", href: "producto-agua-purificada.html" }, // con página propia
{ name: "Bureta automática", note: "Con llave de teflón" },     // con aclaración
```

Los cambios se reflejan a la vez en el índice de la portada, en `productos.html` y en el índice lateral. El contador de cada categoría se calcula solo.

### Especificaciones de las aguas → `js/catalog.js`, objeto `WATERS`

Los valores numéricos están **una sola vez**. La página del producto, su hoja técnica y su hoja de especificaciones leen de ahí, así que **nunca pueden quedar cifras contradictorias entre la web y el PDF**.

```js
"agua-desmineralizada": {
  specs: [ ["pH", "5.5 – 7.5"], ["Conductividad", "Máximo 2.5 µS"], … ],
  micro: [ ["Mesófilos aerobios", "< 100 UFC/mL"], … ],
  sheets: [ { type, code, href, desc }, … ],
}
```

- `specs: null` → la página no muestra tabla, solo el texto de `specsNote` (así está agua purificada).
- `micro: null` → sin tabla microbiológica; se muestra `microNote`.
- `sheets: []` → sin botones de descarga; aparece un aviso para pedirlas por correo.

### Textos descriptivos

La descripción, beneficios, aplicaciones, presentación, almacenamiento y proceso están escritos directamente en cada `producto-*.html` y en cada hoja de `fichas/`.

## 📄 Hojas técnicas y de especificaciones

Son páginas HTML con formato carta. El botón **«Descargar / imprimir PDF»** abre el diálogo de impresión del navegador; con *Guardar como PDF* queda un archivo idéntico al que se ve en pantalla.

- Las cuatro hojas están verificadas para **caber en una sola página** carta.
- No se imprimen la barra superior de acciones ni ningún elemento del sitio.
- La hoja siempre sale en claro, aunque el visitante tenga el sitio en tema oscuro.
- Para cambiar código, versión o fecha: edita el encabezado de cada archivo en `fichas/`.

## 🛡️ El isotipo

El logo es un **escudo con una gota dentro**, reconstruido en vector desde la hoja
técnica. Vive en un solo sitio y se reutiliza en los 20 puntos donde aparece:

- Cada página lleva, justo después de `<body>`, un sprite `.ae-defs` con los degradados
  y un `<symbol id="ae-logo">`. Cada uso es una línea: `<svg><use href="#ae-logo"/></svg>`.
  Así el isotipo se define **una vez por página** y no se repiten los `id` de los degradados.
- Los colores se cambian por contexto con variables CSS (`--ae-escudo`, `--ae-gota`),
  porque un selector de fuera no puede entrar en el símbolo de `<use>` pero las
  variables heredadas sí lo atraviesan. Sobre fondo oscuro (pie de página y tema
  oscuro) se usa la versión clara; el azul profundo se apagaría.
- Si el CSS no llega a cargar, los atributos en línea dejan colores planos de marca:
  nunca se ve un logo sin color.

**Para cambiar la forma del isotipo** hay que tocarla en tres sitios, porque los tres
salen de la misma geometría: el `<symbol>` de cada HTML, `img/logo-aguas-especiales.svg`
y `img/favicon.svg`. El favicon lleva el escudo macizo a propósito: a 16 px un contorno
de 3 px se pierde.

## 🧊 Modelos 3D de producto

Las páginas de **agua purificada** y **agua desmineralizada** muestran el envase como modelo 3D que gira solo y se puede arrastrar.

**No son formas inventadas.** El perfil de la botella PET se midió píxel a píxel sobre la fotografía del producto y se revoluciona con `LatheGeometry`, así que la silueta coincide con la real desde cualquier ángulo. La etiqueta es la de la foto, desenvuelta cilíndricamente para que el texto quede recto al envolverla en el modelo. El frasco de laboratorio, al ser cuadrado, se modela como prisma de esquinas redondeadas con la etiqueta pegada en la cara frontal.

| Aspecto | Cómo funciona |
|---|---|
| **Carga** | Three.js no se descarga hasta que el visor está a punto de entrar en pantalla |
| **Calidad** | En equipos modestos se baja la resolución y se sustituye la refracción por reflejo + transparencia, mucho más barato |
| **Sin WebGL** | Se queda la imagen de `img/render-agua-*.webp`; nunca aparece un hueco ni un error |
| **Impresión** | El canvas se oculta y se imprime la imagen |
| **Menos animación** | Con `prefers-reduced-motion` no hay autogiro, pero se sigue pudiendo arrastrar |
| **Táctil** | El canvas usa `touch-action: pan-y`: arrastrar en horizontal gira, en vertical desplaza la página |

**Para cambiar una etiqueta**: sustituye el JPG correspondiente en `img/` manteniendo la proporción (la textura envuelve 360°, con el diseño centrado). El atributo `data-etiqueta` de cada `producto-*.html` apunta al archivo.

**Para regenerar las imágenes de respaldo**: salen del propio modelo, así que siempre coinciden con el 3D. Se obtienen llamando a `instantanea(ancho, alto, giro)` sobre el visor y guardando el PNG resultante.

### El isotipo en 3D de la portada

El hero muestra el mismo escudo con volumen (`js/logo3d.js`). Tampoco es una forma
inventada: el contorno del escudo se muestrea sobre la curva exacta del SVG y se
extruye, y la gota se revoluciona con `LatheGeometry` sobre su propio perfil, así que
de frente la silueta calca la del logo plano. El marco se obtiene desplazando el
contorno hacia dentro una distancia constante, no escalándolo: solo así el grosor
del trazo queda uniforme también en las esquinas.

La animación de la molécula H₂O **sigue ahí, debajo**, como respaldo. Sin WebGL, en
equipos antiguos o si falla la descarga, se ve exactamente lo de siempre. En móvil
(`.hero__visual` está oculto por debajo de 1024 px) el 3D ni se descarga.

## 🔧 Personalización rápida

| Qué | Dónde |
|-----|-------|
| Productos y categorías | Arreglo `CATEGORIES` en `js/catalog.js` |
| Servicios | Arreglo `SERVICES` en `js/catalog.js` |
| Especificaciones de las aguas | Objeto `WATERS` en `js/catalog.js` |
| Teléfonos / WhatsApp | Busca `525558990125` y `525558996566` en los `.html` y en `js/catalog.js` |
| Correo | Busca `ventas@aguasespeciales.com.mx` |
| Dirección y mapa | Sección `#contacto` de `index.html` y el pie de todas las páginas |
| Colores de marca | Variables `--c-*` al inicio de `css/styles.css` |
| Recomendaciones del asistente | Objeto `WATER` en `js/main.js` |

## ⚠️ Pendientes por confirmar

- **Subtítulo de la etiqueta de agua purificada.** Las dos fotos originales tenían impreso «AGUA DESMINERALIZADA». En la botella PET se rehízo el nombre de producto para que diga **AGUA PURIFICADA**, pero se dejó intacto el resto de la etiqueta: sigue diciendo *«ALTA PUREZA · BAJA CONDUCTIVIDAD»*, que es una afirmación propia del agua desmineralizada. Si el agua purificada necesita otro descriptor, indícalo y se cambia. La tipografía es Montserrat Bold, muy parecida a la original pero no idéntica: conviene revisarla antes de darla por buena.
- **Domicilio completo.** En las hojas que sirvieron de base, la calle y el número quedan tapados por un botón de la imagen. El sitio dice *«Francisco Chilpan, Tultitlán, Estado de México, C.P. 54940»*; falta completar calle y número, y ajustar el mapa.
- **Número de WhatsApp.** Los botones apuntan a **55 5899 0125**. Confirma que ese número (y no el 55 5899 6566) tenga WhatsApp activo.
- **Códigos de las hojas de agua bidestilada.** HT-AE-01 y HE-AE-04 vienen de los documentos originales. Para bidestilada se asignaron **HT-AE-02** y **HE-AE-05**; confirma que correspondan a tu control de documentos.
- **Microbiológicos de agua bidestilada.** No se proporcionaron; las hojas dicen «disponibles bajo solicitud».
- **Agua purificada.** Su página no lleva tabla de especificaciones ni descarga hasta que se definan los parámetros.
- **Especificaciones de agua desmineralizada.** Se actualizaron el 18/08/2026 con los
  valores de la hoja técnica HT-AE-01 v01 que envió Erick (pH 5.0–7.0, conductividad
  ≤ 10 µS/cm, TDS ≤ 10 mg/L, y los parámetros nuevos de sodio, hierro y turbidez).
  Sustituyen a las cifras anteriores, que venían de un documento previo con el mismo
  código y versión. Si el control de documentos exige subir la versión a 02 o poner
  fecha de revisión, dilo y se cambia el encabezado de las hojas.

## 🌐 Poner el sitio en línea

Sitio **estático**: funciona en cualquier hosting sin compilación.

### Opción A — GitHub Pages (el que está en uso)
Cada `git push` a `main` vuelve a publicar. Incluye `.nojekyll`.

```bash
git push
```

### Opción B — Netlify
1. Entra a **[app.netlify.com/drop](https://app.netlify.com/drop)** y arrastra toda la carpeta, o
2. *Add new site → Import from Git* y elige el repo. Sin build; publica la carpeta raíz (ya incluye `netlify.toml`).

### Opción C — Vercel
```bash
npx vercel --prod
```

### Opción D — Tu propio hosting (cPanel / FTP)
Sube el contenido de la carpeta a la raíz pública del servidor (normalmente `public_html/`).

> **Dominio propio:** apunta el DNS de `aguasespeciales.com.mx` al proveedor elegido; Netlify y Vercel dan las instrucciones exactas al añadir el dominio.

## ♿ Accesibilidad y robustez

- Enlace «Saltar al contenido», foco visible, contraste AA verificado en tema claro y oscuro.
- Carrusel con controles de anterior/siguiente y pausa (WCAG 2.2.2).
- Formulario con mensajes de error por campo, `aria-invalid` y foco gestionado entre pasos.
- Menú móvil que cierra con `Esc` y no deja enlaces enfocables cuando está cerrado.
- Respeta `prefers-reduced-motion`.
- Sin JavaScript: la portada y los textos de las páginas de producto se leen igual; el catálogo muestra un aviso con el correo de contacto.
- Sin desbordamiento horizontal de 320 px a 1440 px en las 10 páginas.
