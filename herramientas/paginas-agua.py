"""Escribe las páginas de cada agua con el diseño de la versión final.

Uso, desde la raíz del sitio:
    python herramientas/paginas-agua.py

Deja agua-<slug>.html en la raíz, una por agua de la lista AGUAS. Las ocho
comparten cabecera, menú, contacto y pie con final.html, y cargan
css/final.css más css/agua.css.

Qué sale de dónde:
  * El nombre, la categoría, el renglón de abajo del nombre y el párrafo
    están aquí. El párrafo sale de la sección 1 de la hoja del cliente, sin
    nombrar el proceso: en destilada, bidestilada y tridestilada su hoja
    describe ósmosis inversa e intercambio iónico, y se acordó que la web no
    lo repita ni lo contradiga (ver el README).
  * La hoja se ve, se abre y se descarga desde js/hojas.js, que lee la lista
    de documentos de WATERS en js/catalog.js. Aquí no hay ni una cifra: si
    cambia una hoja, no hay que regenerar nada.
  * La foto es el envase de 1 L de img/producto/, el mismo del catálogo.

Si se cambia el texto de una página a mano, se pierde al regenerar:
cámbialo aquí.
"""
import html
import os
from urllib.parse import quote

from PIL import Image

ALTA = "Agua de alta pureza y baja conductividad"
# El párrafo no repite el renglón de arriba, que ya dice «alta pureza y baja
# conductividad»: sigue desde ahí.
GENERAL = ("Con un contenido mínimo de iones, sales disueltas y partículas. Apta para "
           "aplicaciones industriales, procesos, laboratorios y usos que requieran agua "
           "de alta calidad.")

ESPECIALES = ("Aguas especiales", "aguas-especiales")
PURIFICADA = ("Agua purificada", "agua-purificada")

# slug, nombre, categoría, renglón bajo el título, párrafo, nota (opcional)
AGUAS = [
    ("agua-purificada", "Agua purificada", PURIFICADA, ALTA, GENERAL,
     "La hoja publicada es la de agua purificada Nivel 1."),
    ("agua-suave", "Agua suave", ESPECIALES, "Agua tratada para reducir la dureza",
     "Se le retiran el calcio y el magnesio, que son los que causan la dureza. Ayuda a "
     "prevenir incrustaciones en equipos y sistemas que requieren agua suavizada.", None),
    ("agua-desmineralizada", "Agua desmineralizada", ESPECIALES, ALTA,
     "Se le han removido los iones y las sales disueltas. Apta para aplicaciones "
     "industriales, procesos, laboratorios y usos que requieran agua de alta calidad.", None),
    ("agua-destilada", "Agua destilada", ESPECIALES, ALTA, GENERAL, None),
    ("agua-bidestilada", "Agua bidestilada", ESPECIALES, ALTA, GENERAL, None),
    ("agua-tridestilada", "Agua tridestilada", ESPECIALES, ALTA, GENERAL, None),
    ("agua-desionizada", "Agua desionizada", ESPECIALES, ALTA, GENERAL, None),
    ("agua-libre-de-silice", "Agua libre de sílice", ESPECIALES, ALTA, GENERAL, None),
]

WA = "525587908943"
WA_ICONO = ('<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 14.4c-.3-.15-1.8-.9-2.1-1-.28-.1-.48-.15-.68.15-.2.3-.78 1-.96 1.2-.18.2-.36.22-.66.08-.3-.15-1.28-.47-2.44-1.5-.9-.8-1.5-1.8-1.68-2.1-.18-.3-.02-.46.13-.6.14-.14.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.24-.24-.58-.5-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.55.72.3 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.08 1.8-.73 2.05-1.44.25-.7.25-1.3.18-1.44-.07-.13-.27-.2-.57-.35Z"/>'
            '<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.16l-.3-.18-3 .78.8-2.92-.2-.3A8.2 8.2 0 1 1 12 20.2Z"/></svg>')
WA_CONTACTO = ('<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.5 12.4c-.3-.15-1.8-.9-2.1-1-.28-.1-.48-.15-.68.15-.2.3-.78 1-.96 1.2-.18.2-.36.22-.66.08-.3-.15-1.28-.47-2.44-1.5-.9-.8-1.5-1.8-1.68-2.1-.18-.3-.02-.46.13-.6.14-.14.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.24-.24-.58-.5-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.55.72.3 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.08 1.8-.73 2.05-1.44.25-.7.25-1.3.18-1.44-.07-.13-.27-.2-.57-.35Z"/></svg>')
TEL_ICONO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11 11 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11 11 0 0 0 .56 3.5 1 1 0 0 1-.24 1Z"/></svg>'
MAIL_ICONO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 4 8 5 8-5"/></svg>'
BAJA_ICONO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M4 20h16"/></svg>'
FLECHA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'

# El PDF de la hoja de cada agua, para el enlace de «Descargar» de arriba y
# para quien no tenga JavaScript. Tiene que coincidir con WATERS.
PDF = {
    "agua-purificada": "fichas/pdf/hoja-tecnica-agua-purificada-nivel-1.pdf",
    "agua-desmineralizada": "fichas/pdf/ht-ae-01-agua-desmineralizada.pdf",
}


def pdf_de(slug):
    return PDF.get(slug, f"fichas/pdf/hoja-tecnica-{slug}.pdf")


def wa(texto):
    return f"https://wa.me/{WA}?text={quote(texto, safe='')}"


def pagina(slug, nombre, cat, sub, parrafo, nota):
    e = html.escape
    cat_nombre, cat_id = cat
    foto = f"img/producto/{slug}"
    ancho, alto = Image.open(foto + ".png").size
    pdf = pdf_de(slug)
    assert os.path.exists(pdf), pdf
    minus = nombre[0].lower() + nombre[1:]
    desc = f"{nombre}: {sub[0].lower() + sub[1:]}. Hoja técnica para ver y descargar, y cotización por WhatsApp."
    cotiza = wa(f"Hola, quiero cotizar {minus}.")
    nota_html = f'\n            <p class="agua-cab__nota">{e(nota)}</p>' if nota else ""
    return f"""<!DOCTYPE html>
<!-- Página generada por herramientas/paginas-agua.py: los cambios se hacen
     allí y se vuelve a generar. Ver «Las páginas de cada agua» en el README. -->
<html lang="es-MX">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{e(nombre)} · Aguas Especiales</title>
  <meta name="description" content="{e(desc)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="{e(nombre)} · Aguas Especiales" />
  <meta property="og:description" content="{e(desc)}" />
  <meta property="og:locale" content="es_MX" />
  <link rel="icon" href="img/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&family=Inter:wght@600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/final.css" />
  <link rel="stylesheet" href="css/marca.css" />
  <link rel="stylesheet" href="css/agua.css" />
</head>
<body>
  <a class="saltar" href="#contenido">Ir al contenido</a>

  <header class="cab">
    <div class="cab__inner">
      <a class="cab__logo marca marca--cab" href="final.html">
        <picture class="marca__pic marca__pic--color">
          <source srcset="img/logo-aguas-especiales-compacto.webp" type="image/webp" />
          <img src="img/logo-aguas-especiales-compacto.png" alt="Aguas Especiales — Inicio" width="600" height="227" />
        </picture>
        <picture class="marca__pic marca__pic--claro">
          <source srcset="img/logo-aguas-especiales-compacto-claro.webp" type="image/webp" />
          <img src="img/logo-aguas-especiales-compacto-claro.png" alt="Aguas Especiales — Inicio" width="600" height="227" />
        </picture>
      </a>
      <button class="cab__abrir" type="button" id="abrirMenu" aria-expanded="false" aria-controls="menu" aria-label="Abrir menú">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
      </button>
      <nav class="cab__nav" id="menu" aria-label="Principal">
        <ul>
          <li><a href="final.html">Página principal</a></li>
          <li id="menuProductos" data-destino="final-productos.html">
            <a href="final-productos.html">Productos</a>
          </li>
          <li><a href="final.html#nosotros">Quiénes somos</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main id="contenido">
    <section class="cat-cabecera agua-cab">
      <div class="contenedor">
        <nav class="crumbs" aria-label="Ruta">
          <a href="final.html">Inicio</a> / <a href="final-productos.html">Productos</a> /
          <a href="final-productos.html#{cat_id}">{e(cat_nombre)}</a> / <span aria-current="page">{e(nombre)}</span>
        </nav>
        <div class="agua-cab__grid">
          <div>
            <span class="agua-cab__ojo">{e(cat_nombre)}</span>
            <h1>{e(nombre)}</h1>
            <p class="agua-cab__sub">{e(sub)}</p>
            <p>{e(parrafo)}</p>{nota_html}
            <div class="agua-cab__acciones">
              <a class="btn" href="{e(cotiza)}" target="_blank" rel="noopener">
                Cotizar por WhatsApp
                {FLECHA}
              </a>
              <a class="btn btn--claro" href="{e(pdf)}" download>
                {BAJA_ICONO}
                Descargar hoja técnica
              </a>
            </div>
          </div>
          <figure class="agua-foto">
            <picture>
              <source srcset="{foto}.webp" type="image/webp" />
              <img src="{foto}.png" alt="Envase de 1 L de {e(minus)}" width="{ancho}" height="{alto}" decoding="async" fetchpriority="high" />
            </picture>
          </figure>
        </div>
      </div>
    </section>

    <!-- La hoja tal cual la emite control de calidad: se ve aquí, se abre
         aparte o se descarga. Lo arma js/hojas.js desde WATERS. -->
    <section class="agua-hoja" id="hoja">
      <div class="contenedor">
        <header class="agua-hoja__cab">
          <span class="agua-hoja__ojo">Especificaciones</span>
          <h2>La hoja técnica de {e(minus)}</h2>
          <p>Todos los parámetros fisicoquímicos y microbiológicos están en la hoja. Puedes verla aquí abajo, abrirla aparte o descargarla.</p>
        </header>
        <div class="agua-hoja__visor" data-hojas="{slug}">
          <noscript>
            <p class="agua-hoja__sinjs"><a href="{e(pdf)}" target="_blank" rel="noopener">Abrir la hoja técnica</a> · <a href="{e(pdf)}" download>Descargarla en PDF</a></p>
          </noscript>
        </div>
      </div>
    </section>

    <section class="seccion contacto" id="contacto">
      <div class="contenedor contacto__caja">
        <span class="contacto__ojo">💧 Contacto</span>
        <h2>¿Necesitas <span class="grad-txt">{e(minus)}</span>?</h2>
        <p>Dinos volumen, frecuencia y presentación, y te preparamos la cotización.</p>

        <div class="contacto__vias">
          <a class="contacto__via contacto__via--wa" href="{e(cotiza)}" target="_blank" rel="noopener">
            {WA_CONTACTO}
            Escribir por WhatsApp
          </a>

          <a class="contacto__via" href="tel:+525553053590">
            {TEL_ICONO}
            Llamar 55 5305 3590
          </a>

          <a class="contacto__via" href="mailto:ventas@tensos.com?subject={quote('Cotización de ' + minus)}">
            {MAIL_ICONO}
            Escribir por correo
          </a>
        </div>

        <p class="contacto__donde">
          <strong>Xochicalco 10, Col. Cerro Grande, Atizapán de Zaragoza, Estado de México, C.P. 52920</strong><br />
          También al <a href="tel:+525587908943">55 8790 8943</a>
        </p>
      </div>
    </section>
  </main>

  <footer class="pie">
    <div class="pie__inner">
      <a class="marca marca--pie marca--clara" href="final.html">
        <picture class="marca__pic marca__pic--color">
          <source srcset="img/logo-aguas-especiales.webp" type="image/webp" />
          <img src="img/logo-aguas-especiales.png" alt="Aguas Especiales" width="600" height="227" loading="lazy" />
        </picture>
        <picture class="marca__pic marca__pic--claro">
          <source srcset="img/logo-aguas-especiales-claro.webp" type="image/webp" />
          <img src="img/logo-aguas-especiales-claro.png" alt="Aguas Especiales" width="600" height="227" loading="lazy" />
        </picture>
      </a>
      <p>© 2026 Aguas Especiales. Todos los derechos reservados.</p>
      <p>Xochicalco 10, Atizapán de Zaragoza, Edo. de México · <a href="tel:+525553053590">55 5305 3590</a> · <a href="mailto:ventas@tensos.com">ventas@tensos.com</a></p>
    </div>
  </footer>

  <a class="fab-wa" href="{e(wa(f'Hola, me interesa {minus}.'))}" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">
    {WA_ICONO}
  </a>

  <script>
    /* Menú de teléfono */
    (function () {{
      var b = document.getElementById("abrirMenu");
      var m = document.getElementById("menu");
      if (!b || !m) return;
      b.addEventListener("click", function () {{
        var abierto = m.classList.toggle("abierto");
        b.setAttribute("aria-expanded", abierto ? "true" : "false");
      }});
      document.addEventListener("keydown", function (e) {{
        if (e.key === "Escape" && m.classList.contains("abierto")) {{
          m.classList.remove("abierto");
          b.setAttribute("aria-expanded", "false");
          b.focus();
        }}
      }});
    }})();
  </script>
  <script src="js/catalog.js"></script>
  <script src="js/catalogo-datos.js"></script>
  <script src="js/menu-productos.js"></script>
  <script src="js/hojas.js"></script>
</body>
</html>
"""


def main():
    for slug, nombre, cat, sub, parrafo, nota in AGUAS:
        destino = f"{slug}.html"
        with open(destino, "w", encoding="utf-8", newline="\n") as f:
            f.write(pagina(slug, nombre, cat, sub, parrafo, nota))
        print(destino)


if __name__ == "__main__":
    main()
