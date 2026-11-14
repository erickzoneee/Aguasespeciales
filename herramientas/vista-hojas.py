"""Rasteriza las hojas de fichas/pdf/ a WebP para el visor de las páginas.

Las páginas de producto no incrustan el PDF (no pinta en teléfono y se traga
el scroll): enseñan cada página de la hoja como imagen y los botones abren o
descargan el PDF de verdad. Ver «Las hojas mandan sobre la web» en el README.

Uso, desde la raíz del sitio:
    python herramientas/vista-hojas.py fichas/pdf/hoja-tecnica-agua-suave.pdf [...]

Por cada PDF deja fichas/pdf/vista/<nombre>-pN.webp a 150 ppp y apunta sus
medidas en fichas/pdf/vista/indice.json. Si la hoja tiene más de una página,
hay que anotar cuántas en el objeto PAGINAS de js/hojas.js.
"""
import json
import os
import sys

import fitz  # PyMuPDF
from PIL import Image

PPP = 150
CALIDAD = 82
VISTA = os.path.join("fichas", "pdf", "vista")
INDICE = os.path.join(VISTA, "indice.json")


def rasteriza(pdf):
    base = os.path.splitext(os.path.basename(pdf))[0]
    doc = fitz.open(pdf)
    paginas = []
    for i, pag in enumerate(doc):
        pix = pag.get_pixmap(dpi=PPP, alpha=False)
        img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        destino = os.path.join(VISTA, f"{base}-p{i + 1}.webp")
        img.save(destino, "WEBP", quality=CALIDAD, method=6)
        paginas.append({
            "src": destino.replace(os.sep, "/"),
            "w": img.width,
            "h": img.height,
            "kb": round(os.path.getsize(destino) / 1024),
        })
    return base, paginas


def main(pdfs):
    indice = {}
    if os.path.exists(INDICE):
        with open(INDICE, encoding="utf-8") as f:
            indice = json.load(f)
    for pdf in pdfs:
        base, paginas = rasteriza(pdf)
        indice[base] = paginas
        for p in paginas:
            print(f"{p['src']}  {p['w']}x{p['h']}  {p['kb']} KB")
    with open(INDICE, "w", encoding="utf-8") as f:
        json.dump(dict(sorted(indice.items())), f, ensure_ascii=False, indent=1)
        f.write("\n")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(sys.argv[1:])
