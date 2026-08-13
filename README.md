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
    └── product.js                      # Páginas de producto
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

- **Domicilio completo.** En las hojas que sirvieron de base, la calle y el número quedan tapados por un botón de la imagen. El sitio dice *«Francisco Chilpan, Tultitlán, Estado de México, C.P. 54940»*; falta completar calle y número, y ajustar el mapa.
- **Número de WhatsApp.** Los botones apuntan a **55 5899 0125**. Confirma que ese número (y no el 55 5899 6566) tenga WhatsApp activo.
- **Códigos de las hojas de agua bidestilada.** HT-AE-01 y HE-AE-04 vienen de los documentos originales. Para bidestilada se asignaron **HT-AE-02** y **HE-AE-05**; confirma que correspondan a tu control de documentos.
- **Microbiológicos de agua bidestilada.** No se proporcionaron; las hojas dicen «disponibles bajo solicitud».
- **Agua purificada.** Su página no lleva tabla de especificaciones ni descarga hasta que se definan los parámetros.

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
