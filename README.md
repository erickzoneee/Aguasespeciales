# Aguas Especiales — Sitio web

Sitio estático (HTML/CSS/JS, sin compilación) de **Aguas Especiales**: agua purificada de grado científico, médico e industrial, reactivos, kits y servicios de análisis.

> **La versión buena es `final.html`.** Las otras portadas (`index.html`,
> `version-real.html`, `version-combinada.html`) siguen ahí como comparación y
> se borran cuando se dé el visto bueno. Ver «La versión final».

## 🚀 Cómo verlo

Abre **`index.html`** en tu navegador. No requiere instalación ni servidor.

> Para desarrollo con recarga automática puedes usar cualquier servidor estático:
> ```bash
> npx serve .
> ```

## 📁 Estructura

```
Pagina AguasEspeciales/
├── final.html                          # ⭐ VERSIÓN FINAL — portada
├── final-productos.html                # ⭐ VERSIÓN FINAL — productos y servicios
├── index.html                          # Portada — VERSIÓN A (la maqueta)
├── version-real.html                   # Portada — VERSIÓN B (recreación de aguasespeciales.com.mx)
├── version-combinada.html              # Portada — VERSIÓN C (la mezcla, con el tote en 3D)
├── catalogo.html                       # Catálogo en cuadros — solo VERSIÓN C
├── tote-preview.html                   # Banco de pruebas del tote 3D (no forma parte del sitio)
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
│   ├── real-logo.jpg                   # Logo tal cual lo usa aguasespeciales.com.mx
│   ├── real-hero.jpg                   # Foto del hero de la web real
│   ├── real-tote.jpg                   # Foto del tote: respaldo del modelo 3D
│   └── banner/                         # Banners de portada, completos (webp + jpg)
│   └── cat/                            # Imágenes de categoría (webp + jpg)
│   └── producto/                       # Envases de 1 L, recortados (webp + png)
│   └── render-agua-*.webp/.png         # Imágenes de respaldo, sacadas del propio 3D
│   └── tote-bidestilada-1000l*          # Foto fija del tote en «Nuestra historia» (1x, 2x y PNG)
├── css/
│   ├── styles.css                      # Sistema de diseño + tema claro/oscuro
│   ├── pages.css                       # Catálogo, servicios y páginas de producto
│   ├── ficha.css                       # Hojas imprimibles (siempre en claro)
│   ├── version-real.css                # Versión B y base de la final
│   ├── final.css                       # ⭐ Solo la versión final
│   └── version-combinada.css           # Solo versión C
└── js/
    ├── catalog.js                      # ⭐ Datos del catálogo y especificaciones
    ├── site.js                         # Tema, menú, scroll, reveal (todas las páginas)
    ├── main.js                         # Interactividad de la portada
    ├── pages.js                        # Catálogo y servicios
    ├── specs.js                        # Tablas de especificaciones y descargas
    ├── product.js                      # Páginas de producto
    ├── viewer3d.js                     # Arranque diferido de los visores 3D
    ├── bottle3d.js                     # Envases en 3D (módulo ES)
    ├── tote3d.js                       # Tote IBC de 1000 L en 3D (módulo ES)
    ├── catalogo.js                     # Catálogo en cuadros
    ├── catalogo-datos.js               # Categorías + servicios + sus imágenes
    ├── menu-productos.js               # Desplegable de «Productos» en el menú
    ├── logo3d.js                       # Isotipo en 3D (módulo ES)
    └── vendor/three.module.js          # Three.js, servido desde el propio sitio
```

## ⭐ La versión final

Es la que queda. Son dos páginas:

| Archivo | Qué es |
|---|---|
| `final.html` | Portada: héroe, «Calidad controlada», Nuestra historia con la foto del tote, los cuatro diferenciadores y contacto |
| `final-productos.html` | Las categorías en cuadro; al abrir una, lo que hay dentro también en cuadro |

**Cómo se armó.** Se tomó la portada de la versión B (la recreación de
`aguasespeciales.com.mx`, que es la cara que se eligió) y se cortó en los
testimonios: fuera testimonios, fuera el botón de cotización y fuera el
formulario de WPForms. En su lugar quedó una sección de contacto de **tres
botones y nada más** —WhatsApp, llamar y correo— sin un solo campo que llenar.

**Servicios ya no es una página aparte.** Los cuatro análisis son la **categoría
10** del mismo catálogo, con la lista de lo que determina cada uno. Se navegan
igual que todo lo demás.

**El menú «Productos» abre un desplegable** con todas las categorías y su
número de productos, y al pasar el cursor por cualquiera se despliegan sus
productos en un submenú (hasta diez, y un enlace para ver el resto). El
submenú abre hacia la izquierda porque el menú vive en la mitad derecha de la
cabecera y hacia la derecha se saldría de la pantalla. En teléfono no existe
«pasar el cursor», así que ahí no hay submenús: queda el listado plano. Se arma solo desde `js/catalogo-datos.js`: si mañana se
añade una categoría, aparece sola en el menú, en el índice lateral y en los
cuadros. No hay tres listas que mantener. En teléfono el desplegable se abre
dentro del propio menú, no flotando.

**El tote va en «Nuestra historia»**, que es justo donde el sitio real pone la
foto del tote, y va en **imagen fija**: se quitó el visor 3D que se giraba con
el ratón. La imagen sale del propio modelo —se renderizó a 4512 px, se recortó
al contenido y se bajó a 940 px (1x) y 1880 px (2x)—, así que se ve igual de
nítida en pantallas normales y de retina. Con eso `final.html` ya no carga
`js/viewer3d.js` ni los 687 KB de Three.js: se ve lo mismo en cualquier
teléfono, sin WebGL y sin esperar a que descargue nada.

El visor que se puede girar sigue vivo en la versión C y en `tote-preview.html`.

## 🔀 Tres versiones para comparar

No se borró nada: las tres portadas están vivas y se enlazan entre sí con una
banda oscura arriba de todo (`.comparar`), que es andamio y se quita en cuanto
se decida cuál queda.

| Archivo | Qué es | De dónde sale |
|---|---|---|
| `index.html` | **Versión A** — la maqueta | Lo que ya estaba, más los arreglos de usabilidad de abajo |
| `version-real.html` | **Versión B** — recreación de `aguasespeciales.com.mx` | El sitio real (WordPress + Astra + Elementor), reconstruido en estático |
| `version-combinada.html` | **Versión C** — la mezcla | Estructura corta de B + sistema de diseño de A + el tote en 3D |
| `catalogo.html` | Catálogo de la versión C | Las nueve categorías en cuadro; al abrir una, sus productos también en cuadro |

**Qué se corrigió al recrear la versión B.** El original tenía tres sistemas de
botón distintos, dos anchos de contenedor que no coincidían (1200 px del tema y
1140 px de Elementor), dos juegos de puntos de quiebre solapados (921/922 de
Astra contra 767/1024 de Elementor), una cabecera `position:absolute` que no
reservaba altura —por eso el hero llevaba un margen de 149 px para esquivarla— y
una docena de valores de espaciado inválidos (`padding:-3px`, `padding:01px`)
que el navegador descarta. O sea: el espaciado que se veía no era el que estaba
escrito. La versión B tiene un botón, un ancho, dos quiebres y un ritmo único.

**Qué NO se copió, a propósito.** «Inocuidad garantizada», «cumpliendo
normativas internacionales», «los más altos estándares» y el mercado médico
(diálisis, hospitales, laboratorio clínico) siguen fuera, también en la
recreación. Los dos testimonios del sitio real son de sector médico y además
están rotos —comillas sin cerrar, nombre pegado—, así que la sección quedó
armada pero vacía: reescribirlos sería inventarlos.

## 🔳 El catálogo en cuadros (versión C)

`catalogo.html` presenta el mismo catálogo de `js/catalog.js` en dos niveles: al
entrar se ven las **nueve categorías en cuadro**, y al abrir una salen **sus
productos también en cuadro**. El índice lateral hace lo mismo, para quien ya
sabe lo que busca; en teléfono se oculta, porque los cuadros ya cumplen esa
función y si no había que pasar nueve enlaces antes de ver nada.

**Qué cuadros llevan foto.** Las **trece aguas de envase de 1 L** —las tres de
«agua purificada» y las diez de «aguas especiales»— llevan el render de su
etiqueta, que entregó el cliente en PDF. El resto no lleva foto, sino un bloque
con el icono de su categoría, y no es por pereza: la tienda del sitio real tiene
30 productos con foto pero solo **11 imágenes distintas** —una misma foto de
banco se repite en nueve reactivos seguidos, otra en los tres análisis, otra en
los tres envases—. Repetir eso se ve peor que no poner nada. Con el icono todos
los cuadros miden lo mismo y ninguno queda hueco.

Para sumar una foto: deja `img/producto/<lo-que-sea>.webp` y `.png`, y ponle al
producto `foto: "img/producto/<lo-que-sea>"` en `js/catalog.js`. El catálogo le
pone las extensiones. Si el producto además tiene modelo 3D, la foto manda en el
cuadro y el render se queda en su página, girando.

Tampoco se copió lo que su tienda muestra hoy: **29 de sus 30 productos dicen
«AGOTADO»** y **todos los precios son $0.00**. Eso no es diseño, es
configuración que nadie terminó, y le dice a cada visitante que no hay nada que
vender.

## 📄 Las hojas mandan sobre la web

Las páginas de producto ya **no llevan tablas de especificaciones**. Se muestra
la hoja tal cual la emite control de calidad, y se puede ver en la página, abrir
aparte o descargar. El motivo es simple: mientras hubo tabla en HTML *y* hoja en
PDF, había dos sitios donde podía estar la misma cifra, y ya pasó — el sitio
publicaba **conductividad ≤ 10 µS/cm** cuando la hoja HT-AE-01 dice **≤ 2.5**, y
**TDS ≤ 10 mg/L** cuando la hoja dice **≤ 1.25**. Ahora solo hay un sitio.

**No se incrusta el PDF.** Se probó con `<object>`, pero un PDF dentro de la
página no pinta en varios navegadores —en teléfono casi ninguno— y encima se
traga el scroll: al pasar el dedo por encima se mueve el documento y no la
página. Cada hoja se rasteriza a 150 dpi y se sirve en WebP; el visor de la hoja
principal pasó de 2.3 MB a 158 KB. Los botones abren y descargan el PDF real.

Para añadir una hoja: deja el PDF en `fichas/pdf/`, genera sus páginas en
`fichas/pdf/vista/<nombre>-pN.webp`, apunta el número de páginas en el objeto
`PAGINAS` de `js/hojas.js` y súmala al arreglo `sheets` del agua en
`js/catalog.js`.

**Ojo con dos cosas de la hoja oficial:** en «Aplicaciones» aparece *hospitales y
esterilización de equipos*, y la sección 8 se titula *Calidad garantizada*. Las
dos cosas se habían retirado del texto del sitio a propósito. Publicar el
documento tal cual las devuelve, pero ahí son palabras del cliente en su propio
documento, no copy nuestro. Conviene que lo sepa.

## 🧊 Por qué la etiqueta del tote no se veía

Se veía lavada y sin texto, y la causa no estaba en el material ni en la luz:
**estaba diez milésimas de unidad por dentro de la pared del tanque.**

El tanque se extruye con `bevelSize: 0.09`, y un bisel de extrusión **ensancha
la planta**: la cara del tanque no está en `SEMIFONDO - HOLGURA` (0.798) sino
0.09 más afuera, en **0.888**. La etiqueta se colocaba en `SEMIFONDO + 0.045`
= 0.878. Diez milésimas por dentro. El tanque translúcido se dibujaba encima y
se la comía entera: medido, **cero píxeles de texto en los ocho ángulos**.

Se arregló atando la posición a la geometría real (`FRENTE_TANQUE`) en vez de a
un número escrito a mano, así que si mañana cambia la holgura o el bisel la
etiqueta sigue por delante sola. Y el bisel dejó de ser una variable local
dentro de `construyeTanque`, que es lo que permitió que las dos cifras se
desincronizaran sin que nadie lo notara.

De paso, tres ajustes para que la pieza funcione sobre fondo blanco —estaba
afinada para el héroe azul oscuro—:

| Qué | Antes | Ahora |
|---|---|---|
| Contraste del texto de la etiqueta | 1.79:1 | **12.5:1** |
| Jaula contra el fondo blanco | casi invisible | 175 contra 255 |
| Sombra de contacto | no había | 155 contra 255 |

La etiqueta pasó a `MeshBasicMaterial` con `toneMapped: false`: es papel
impreso mirado de frente, y el ACES del renderizador le comía el contraste.

## 🎞️ El carrusel de la portada

Arriba del todo, cinco banners que van cambiando solos cada 5.5 s. Son los que
entregó el cliente, **completos y sin recortar**: el título es parte del diseño.
Se muestran con `object-fit: contain` y no `cover` porque el texto vive a la
izquierda y el producto a la derecha — cualquier recorte a lo ancho se come uno
de los dos. El alto se fija por escalón (520 / 400 px, y 3:2 en teléfono) y el
ancho lo sigue, que es lo que mantiene el marco quieto entre diapositivas.

Se para solo en cuatro situaciones, y las cuatro importan:

| Cuándo | Por qué |
|---|---|
| Al pasar el ratón por encima | Si no, se lleva la diapositiva justo cuando ibas a hacer clic |
| Al enfocar con el teclado | Lo mismo, para quien navega con Tab |
| Con la pestaña en segundo plano | Vuelves y estás en una imagen que nunca elegiste, y encima gastó batería |
| Con «reducir movimiento» activado | A quien marca esa preferencia, algo que se mueve sin permiso puede marearle |

También se pasa con las flechas, los puntos, las teclas ← → y arrastrando el
dedo. El gesto solo cuenta si es claramente horizontal: si no, intentar bajar
por la página cambiaría de banner.

**Un detalle que costó encontrar:** las láminas que no se ven están desplazadas
con `transform`, no ocultas, y el navegador no considera que «entren en
pantalla». Con `loading="lazy"` dos de las cinco no se descargaban nunca y el
carrusel pasaba a un hueco blanco. Ahora se les quita el diferido a la lámina
actual y a la siguiente, justo antes de que hagan falta.

Sin JavaScript se ve el primer banner y ya: ni carrusel roto ni hueco.

## 🖼️ Imágenes de categoría

Siete categorías tienen imagen propia. Cinco —**aguas para laboratorio**,
**soluciones acuosas especiales**, **agua acondicionada para chillers**,
**reactivos** y **kits**— salen de los banners que entregó el cliente en PDF,
extraídos con PyMuPDF y **recortados para dejar fuera el título**: el cuadro ya
escribe el nombre de la categoría, y a 215 px de ancho ese texto no se leería de
todas formas. Las otras dos —**agua purificada** y **aguas especiales**— llevan
su envase sobre un degradado, porque de esas dos familias lo que hay es el
envase y no un banner. Todas a 4:3, en WebP (~40 KB) con JPG de reserva.

Las cuatro restantes llevan su icono sobre un fondo tintado, así que todos los
cuadros miden lo mismo y ninguno queda hueco. Para añadir una imagen nueva:
deja `img/cat/<id-de-categoria>.webp` y `.jpg`, y suma el id al arreglo
`IMAGENES` de `js/catalogo-datos.js`. Nada más.

**El banner de reactivos se cambió** por la versión fotográfica que mandó el
cliente el 3 de septiembre de 2026. La ilustración anterior no se borró: quedó
en `img/banner/reactivos-ilustracion.*` y `img/cat/reactivos-ilustracion.*`.

**Ojo:** el isotipo que aparece dentro de las imágenes de banner no es
exactamente el del sitio —la «A» y la gota están dibujadas distinto—. Conviene
revisarlo antes de darlas por buenas.

## 🧯 Arreglos de usabilidad aplicados

Salieron de una auditoría que midió, tarea por tarea, cuántos toques cuesta hoy
hacer cada cosa. Todos verificados contra el código antes de tocarlo.

- **El teléfono ya no descarga 687 KB de Three.js para nada.** El README anterior
  decía que en móvil el 3D «ni se descarga» y era falso: `.hero__visual` va con
  `display:none`, un elemento oculto mide 0, y esa medida pasaba la prueba de
  visibilidad de `js/viewer3d.js`. Ahora se exige caja real. Además hay un
  `data-min3d="1024"` para pedir explícitamente «3D solo de este ancho en
  adelante».
- **El cotizador cabe en una pantalla.** Iba en tres pasos con dos botones
  «Continuar» que no pedían, no validaban y no filtraban nada. De 6 gestos a 2.
  Solo el nombre es obligatorio: por WhatsApp el número del cliente viaja con el
  mensaje y, por correo, su dirección la pone su propio programa.
- **Las hojas técnicas ya se pueden contestar.** Eran las únicas páginas sin
  ninguna forma de contactar; los teléfonos y el correo eran texto muerto. Ahora
  son enlaces y hay un «Cotizar por WhatsApp» en la barra. La impresión no cambia.
- **El aviso del cotizador ya no miente.** Decía «Añadimos «X» a tu solicitud»
  aunque no se hubiera marcado ninguna casilla, que era el caso en 56 de los 58
  productos, porque casaba por nombre exacto. Ahora casa por familia y, si no
  encuentra ninguna, dice la verdad: que lo anotó en los detalles.
- **Se quitó lo repetido.** El párrafo de descripción estaba impreso dos veces en
  las tres páginas de producto y empujaba la tabla de especificaciones unos
  200 px hacia abajo. El botón «Contraer todo» solo servía para esconder los 58
  productos. El aviso de servicios se leía tres veces en la misma pantalla.
- **Los botones dicen lo que hacen.** «Ver ficha técnica» abría una página de
  producto (ahora «Ver producto»); «Descargar ficha técnica» solo bajaba la
  pantalla (ahora enlaza la hoja); y en agua purificada «Solicitar
  especificaciones» llevaba a un panel que anunciaba que no había ninguna (ahora
  abre un correo ya redactado).

## 🐞 Dos defectos que llevaban tiempo publicados

Salieron al revisar la versión C en teléfono y estaban también en `index.html`,
o sea en el sitio que está en línea. Los dos se arreglaron en `css/styles.css`,
así que se corrigen en todas las páginas a la vez.

**La barra de navegación no se quedaba pegada.** El CSS pedía
`position: sticky` desde siempre, pero nunca funcionó: `overflow-x: hidden` en
`html` convierte al elemento en contenedor de scroll y eso anula el sticky. Se
cambió por `overflow-x: clip`, que recorta igual pero no crea contenedor (la
línea de `hidden` se deja delante como reserva). Ahora el menú y «Cotizar ahora»
siguen a la vista durante los 7,000 px de recorrido de la portada.

**El menú de teléfono abría como una cajita de 130 px.** El CSS pedía un cajón
lateral de pantalla completa (`position: fixed; inset: 0 0 0 auto`), pero el
`backdrop-filter: blur(14px)` de `.nav` la convierte en bloque contenedor, así
que el cajón se medía contra la barra —70 px de alto— en lugar de contra la
pantalla. Los siete enlaces salían encimados sobre el título del héroe, y el
panel tapaba la propia hamburguesa, así que tampoco se podía cerrar. En teléfono
ese menú es la única vía a Productos, Servicios y Cotizar. Se quita el vidrio
esmerilado por debajo de 860 px y la hamburguesa sube de capa.

Otros de la misma ronda: el anillo de foco pasó de `rgba(…,.35)` —1.34:1 de
contraste, invisible— a color sólido; las áreas táctiles del teléfono, el correo
y el botón de tema pasaron de 20–34 px a 44; los enlaces de la barra superior
llevaban `aria-label="Llamar"`, que tapaba el número visible y rompía el control
por voz; y la descarga de Three.js espera ahora a que el navegador tenga un hueco
(`requestIdleCallback` con tope de 2 s) en vez de competir con la imagen del
héroe.

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

## 🅰️ El isotipo

El logo es una **«A» triangular cerrada —las dos patas, el travesaño y la línea
de la base— con una gota de agua tallada en facetas**, tipo cristal, montada
sobre la pata izquierda, que queda casi toda oculta detrás.
Está reconstruido en vector y vive en un solo sitio:

- Cada página lleva, justo después de `<body>`, un sprite `.ae-defs` con un
  `<symbol id="ae-logo">`. Cada uso es una línea: `<svg><use href="#ae-logo"/></svg>`.
- La gota son **diez caras planas**, con vértices que caen sobre el mismo contorno
  de la gota, así que ninguna se sale del perfil por mucho que se amplíe. La luz
  entra por arriba a la izquierda y el tono más profundo queda en el fondo.
- Solo el azul de la «A» cambia por contexto, con la variable `--ae-a`: las facetas
  ya son claras y se leen igual sobre blanco que sobre el azul marino del pie. Un
  selector de fuera no entra en el símbolo de `<use>`, pero las variables heredadas
  sí lo atraviesan. Si el CSS no llega a cargar, queda el azul de reserva en línea.

**Para cambiar la forma** hay que tocarla en tres sitios, porque los tres salen de
la misma geometría: el `<symbol>` de cada HTML, `img/logo-aguas-especiales.svg` y
`img/favicon.svg`. El favicon lleva la gota resuelta en tres caras y el trazo de la
«A» más grueso: a 16 px las facetas finas se emborronan.

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

**La foto fija del tote de `final.html`** (`img/tote-bidestilada-1000l*`) salió de
ahí mismo: `instantanea(4512, 4354, 0.30)` en `tote-preview.html`, recorte al
contenido con un 2 % de aire y reescalado a 940 y 1880 px. El reescalado se hace
en **alfa premultiplicado**; hecho en RGBA normal, los píxeles transparentes
—que vienen en negro— tiñen los bordes y el tote queda con un halo sucio.

### El tote IBC de 1000 L (`js/tote3d.js`)

Es lo que se ve en el héroe de la **versión C**, en lugar del isotipo: el
visitante entra y ve el producto, no el logo. En `final.html` este visor ya no
se usa: ahí va una imagen fija sacada de este mismo modelo.

Tampoco es una caja genérica. Las proporciones se midieron sobre la fotografía
del producto y coinciden con un IBC real: 1200 × 1000 mm de huella y 1160 mm de
alto con tarima. Son cinco piezas, como en el envase de verdad: tarima de
plástico negro con sus nueve pies y sus travesaños, tanque de HDPE translúcido de
esquinas redondeadas, jaula de acero con nueve aros y dieciséis verticales —los
cuatro postes de esquina más gruesos, como en el original—, tapa de llenado y
válvula de descarga con su palanca azul.

| Aspecto | Cómo funciona |
|---|---|
| **La etiqueta** | Se dibuja en un lienzo, no es una imagen: el texto queda nítido a cualquier tamaño. El isotipo sale de los mismos trazos del `<symbol>` del sitio, con `Path2D`, así que no hay una segunda versión del logo que se pueda desincronizar |
| **Las cifras** | Viven en la constante `DATOS` de `js/tote3d.js` y son las mismas que publica `js/catalog.js`. Si cambian en la hoja técnica, se cambian en los dos sitios |
| **Tipografías** | El lienzo se repinta cuando terminan de cargar las fuentes de Google; si no, la etiqueta se quedaría con la de reserva |
| **Móvil** | `data-min3d="1024"`: por debajo de ese ancho ni se descarga Three.js. Se ve `img/real-tote.jpg`, que es la foto del mismo tote |
| **Sin WebGL** | Igual: se queda la foto, nunca un hueco |
| **Transparencia** | El tanque va muy translúcido a propósito. Con el plástico lechoso «realista» tapaba la jaula y, sobre el azul marino del héroe, el tote entero quedaba como una mancha blanca |
| **Etiqueta por delante** | Va delante de la jaula, no detrás. En la foto del producto se lee entera, sin varillas cruzándola, y en una portada eso importa más que el rigor de dónde está pegada |

Para verlo aislado y girarlo: `tote-preview.html`.

### El isotipo en 3D de la portada

El hero muestra el mismo logo con volumen (`js/logo3d.js`). Tampoco es una forma
inventada: la «A» se extruye desde el contorno de su trazo, calculado con
desplazamiento de inglete para que el grosor se mantenga también en el vértice
(escalar el contorno no serviría, adelgazaría justo las esquinas). La gota se
revoluciona con `LatheGeometry` usando **pocos segmentos y sombreado plano**: cada
tramo del perfil se convierte en una faceta, que es justo la talla de cristal del
logo plano.

Ahí la «A» va en un azul acero más claro que en el logo impreso, porque el 3D solo
aparece sobre el azul marino del hero y el navy original se apagaría.

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
| Etiqueta del tote 3D | Constante `DATOS` en `js/tote3d.js` |
| Medidas del tote 3D | Constantes del inicio de `js/tote3d.js` |

## 🧭 Posicionamiento

El sitio **no se dirige al mercado médico**: se retiraron hemodiálisis, hospitales y
laboratorio clínico de portada, franja de industrias, asistente, FAQ, testimonios,
formulario, pies de página y hojas. La industria farmacéutica sí se conserva.

Dos clasificaciones de pureza que **no son equivalentes** y no deben mezclarse:
**ASTM D1193** → Tipo I, II, III y IV · **ISO 3696** → Grado 1, 2 y 3. La escala de
la portada y el objeto `PURITY` de `js/main.js` etiquetan explícitamente cuál usan.

Evitar las garantías absolutas: nada de «inocuidad garantizada», «calidad
garantizada» ni «cumpliendo normativas internacionales». La fórmula acordada es
«de acuerdo con parámetros técnicos, estándares de referencia o especificaciones
particulares del cliente».

## ⚠️ Pendientes por confirmar

- **Cuál de las tres portadas queda.** Mientras haya tres, hay tres sitios donde
  cambiar cualquier texto. En cuanto se decida, se borran las otras dos y la
  banda `.comparar`.
- **Cifras de la etiqueta del tote.** La foto del tote que mandó Erick dice
  **pH 7.0** y **conductividad 0.6 – 1 µS/cm a 25 °C**. El sitio publica, para
  agua bidestilada, **pH 7.5 – 8.5** y **conductividad máximo 15 µS**, que es lo
  que dice la hoja técnica. Se dejaron las de la hoja para que no queden dos
  cifras del mismo producto peleadas. Falta decidir si la etiqueta impresa está
  desactualizada o si la hoja lo está.
- **Los datos de contacto no coinciden entre los dos sitios.** El pie de
  `aguasespeciales.com.mx` publica **Xochicalco 10, Cerro Grande, 52920 Cdad.
  López Mateos**, teléfono **55 5305 3590** y correo **ventas@tensos.com** —otro
  dominio—, mientras que su propia página de contacto y toda esta maqueta usan
  Francisco Chilpan, Tultitlán, 55 5899 0125 y ventas@aguasespeciales.com.mx. Su
  chip de WhatsApp además apunta a un tercer número, **56 3830 7538**. En la
  versión B se usaron los datos de esta maqueta; hay que confirmar cuáles mandan.
- **Páginas de la web real que no se reconstruyeron.** Quedaron fuera
  «Responsabilidad Social» (`/plan/`) y «Blog de noticias». El contenido de las
  dos está descargado y extraído; solo falta decidir si entran.
- **Testimonios de la versión B.** La sección está armada y vacía, esperando
  testimonios reales de clientes industriales.

- **Subtítulo de la etiqueta de agua purificada.** Las dos fotos originales tenían impreso «AGUA DESMINERALIZADA». En la botella PET se rehízo el nombre de producto para que diga **AGUA PURIFICADA**, pero se dejó intacto el resto de la etiqueta: sigue diciendo *«ALTA PUREZA · BAJA CONDUCTIVIDAD»*, que es una afirmación propia del agua desmineralizada. Si el agua purificada necesita otro descriptor, indícalo y se cambia. La tipografía es Montserrat Bold, muy parecida a la original pero no idéntica: conviene revisarla antes de darla por buena.
- **Domicilio completo.** En las hojas que sirvieron de base, la calle y el número quedan tapados por un botón de la imagen. El sitio dice *«Francisco Chilpan, Tultitlán, Estado de México, C.P. 54940»*; falta completar calle y número, y ajustar el mapa.
- **Número de WhatsApp.** Los botones apuntan a **55 5899 0125**. Confirma que ese número (y no el 55 5899 6566) tenga WhatsApp activo.
- **Códigos de las hojas de agua bidestilada.** HT-AE-01 y HE-AE-04 vienen de los documentos originales. Para bidestilada se asignaron **HT-AE-02** y **HE-AE-05**; confirma que correspondan a tu control de documentos.
- **Microbiológicos de agua bidestilada.** No se proporcionaron; las hojas dicen «disponibles bajo solicitud».
- **Agua purificada.** Su página no lleva tabla de especificaciones ni descarga hasta que se definan los parámetros.
- **Testimonios.** Los dos que había eran del sector médico (una clínica de diálisis
  y un laboratorio clínico). Se retiró el de diálisis y quedó uno solo, así que el
  carrusel oculta sus controles automáticamente. Hacen falta testimonios reales de
  clientes industriales para volver a tener carrusel; no se inventan.
- **Aplicaciones de agua desmineralizada.** Se quitó «Hospitales y esterilización de
  equipos» y se suavizaron dos afirmaciones («libre de sales» → «bajo contenido de
  sales»; «reduce incrustaciones y corrosión» → «ayuda a reducir incrustaciones»).
  La lista definitiva debe salir de la hoja técnica cuando la cierres.
- **Almacenamiento y control de calidad.** La redacción nueva (15–25 °C, evitar más
  de 30 °C; verificación fisicoquímica y microbiológica por lote) se aplicó a las
  tres páginas de producto y a las cuatro hojas, no solo a desmineralizada: el
  motivo es no dejar publicada una garantía absoluta en unas páginas y no en otras.
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

### Opción C — Vercel *(la que se está usando)*
```bash
npx vercel --prod
```
La carpeta ya está enlazada al proyecto `aguas-especiales`, así que ese comando
publica sin preguntar nada. Queda en **https://aguas-especiales.vercel.app**
(`/` redirige a `/final`, como dice `vercel.json`).

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
