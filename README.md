# Aguas Especiales — Sitio web rediseñado

Rediseño moderno, interactivo e intuitivo del sitio de **Aguas Especiales** (agua purificada de grado científico, médico e industrial), basado en el contenido de [aguasespeciales.com.mx](https://aguasespeciales.com.mx/).

## 🚀 Cómo verlo

No requiere instalación ni servidor. Solo abre **`index.html`** en tu navegador.

> Para desarrollo con recarga automática puedes usar cualquier servidor estático, por ejemplo:
> ```bash
> npx serve .
> ```

## 📁 Estructura

```
Pagina AguasEspeciales/
├── index.html        # Estructura y contenido
├── css/styles.css    # Sistema de diseño + tema claro/oscuro
├── js/main.js        # Toda la interactividad
└── README.md
```

## ✨ Novedades frente al sitio original

**Más interactivo**
- **Asistente "Encuentra tu agua"**: eliges tu industria y te recomienda el tipo de agua con sus valores de referencia.
- **Escala de pureza animada** (ISO 3696 / ASTM D1193) que compara los tipos de agua.
- **Catálogo con filtros** por categoría (Aguas · Análisis · Reactivos · Insumos).
- **Cotizador de 3 pasos** que arma tu solicitud y la envía por **WhatsApp** o **correo** ya prellenada.
- **Carrusel de testimonios**, **FAQ desplegable**, contadores animados y botón flotante de WhatsApp.

**Más innovador**
- Hero con **animación de gotas en canvas**, olas SVG y una **molécula de H₂O** orbitando.
- **Tema claro/oscuro** con preferencia guardada.
- Micro-animaciones al hacer scroll y efectos "glass".

**Más intuitivo**
- Navegación fija con indicador de sección activa y barra de progreso.
- Menú móvil accesible, diseño 100% responsive y foco visible por accesibilidad.
- Respeta `prefers-reduced-motion` para quien prefiere menos animación.

**Accesibilidad y robustez** (tras una revisión de calidad automatizada)
- Enlace "Saltar al contenido", contraste AA en tema claro y encabezados sin saltos de nivel.
- Carrusel con controles de anterior/siguiente y pausa (WCAG 2.2.2); puntos expuestos a lectores de pantalla.
- Formulario con mensajes de error por campo (no solo color), `aria-invalid` y foco gestionado entre pasos.
- Menú móvil que cierra con `Esc` y no deja enlaces enfocables cuando está cerrado.
- Degradación elegante: el contenido principal se ve aunque el JavaScript no cargue; acceso a `localStorage` protegido.

## 🌐 Poner el sitio en línea

Es un sitio **estático** (HTML/CSS/JS), así que funciona en cualquier hosting sin compilación. Elige la vía que prefieras:

### Opción A — Netlify (la más rápida, sin cuenta técnica)
1. Entra a **[app.netlify.com/drop](https://app.netlify.com/drop)**.
2. Arrastra **toda la carpeta** `Pagina AguasEspeciales` a la zona de subida.
3. En segundos te da una URL pública (ej. `aguas-especiales.netlify.app`). Ya incluye `netlify.toml`.
4. Opcional: en *Site settings → Domain* conecta tu dominio `aguasespeciales.com.mx`.

### Opción B — GitHub + despliegue automático (Netlify / Vercel / GitHub Pages)
Ya dejé el proyecto como repositorio Git con un primer commit. Solo falta enviarlo a GitHub:
```bash
# 1) Crea un repo vacío en github.com (sin README) y copia su URL
git remote add origin https://github.com/TU-USUARIO/aguas-especiales.git
git branch -M main
git push -u origin main
```
Luego:
- **Netlify/Vercel:** *Add new site → Import from Git →* elige el repo. Sin build; publica la carpeta raíz. Cada `git push` vuelve a desplegar solo.
- **GitHub Pages:** *Settings → Pages → Source: Deploy from a branch → main / (root)*. Incluye `.nojekyll`. URL: `tu-usuario.github.io/aguas-especiales`.

### Opción C — Vercel (CLI)
```bash
npm i -g vercel
vercel        # sigue el asistente; detecta sitio estático (incluye vercel.json)
vercel --prod # publica en producción
```

### Opción D — Tu propio hosting (cPanel / FTP)
Sube el contenido de la carpeta (`index.html`, `css/`, `js/`) a la raíz pública de tu servidor (normalmente `public_html/`). Nada más.

> **Tu dominio:** para que quede en `aguasespeciales.com.mx`, apunta el DNS de tu dominio al proveedor elegido (Netlify/Vercel dan las instrucciones exactas al añadir el dominio).

## 🔧 Personalización rápida

| Qué | Dónde |
|-----|-------|
| Teléfono / WhatsApp | Busca `525553053590` en `index.html` y `js/main.js` |
| Correo | Busca `ventas@tensos.com` |
| Colores de marca | Variables `--c-*` al inicio de `css/styles.css` |
| Productos | Arreglo `PRODUCTS` en `js/main.js` |
| Recomendaciones del asistente | Objeto `WATER` en `js/main.js` |

## ⚠️ Notas

- Los valores de pureza (18.2 MΩ·cm, µS/cm, etc.) son **valores de referencia** de los estándares de agua de laboratorio; ajústalos a tus especificaciones reales.
- Confirma que el número **55 5305 3590** tenga WhatsApp activo para el botón y el cotizador.
- Las fuentes se cargan desde Google Fonts; si no hay conexión, el sitio usa fuentes de sistema automáticamente.
