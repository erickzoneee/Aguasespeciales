"""Recorta los frascos de reactivo sobre fondo transparente.

El cliente mandó los doce frascos en un PDF, una imagen de 1254x1254 por
página, sobre fondo blanco o gris muy claro. En el catálogo van como las
aguas: el envase solo, sin fondo y sin la sombra del suelo, para que todos
los cuadros se vean iguales.

Uso (las imágenes se sacan antes del PDF con PyMuPDF, una por página, con el
nombre <base>-p1.png ... <base>-p12.png):
    python herramientas/recorte-frascos.py <carpeta-con-las-png> <base>

Cómo recorta, y por qué así:
  * El fondo es casi liso (248 a 254 en los tres canales), así que se mide en
    los bordes y se marca como frasco todo lo que se aparte más de 12.
  * La etiqueta es blanca y toca el fondo por los costados; aun así su borde
    trae un sombreado gris (~234) que pasa ese umbral. Por eso basta, en
    cada renglón, con rellenar del primer al último píxel marcado: la
    silueta de un frasco no tiene huecos a lo ancho.
  * Pero no siempre: con los fondos más grises (239-241) el borde de la
    etiqueta queda a 5 o 6 del fondo en algunos renglones, y el relleno sale
    más angosto que el frasco (una raya de fondo cruzando la etiqueta). La
    etiqueta va sobre el cuerpo recto, así que en su franja la silueta se
    fija a la mediana de sus renglones. Y fuera de ella, un renglón más
    angosto que los de arriba Y que los de abajo no puede ser la silueta de
    un frasco —en el hombro crece, en el pie se cierra—: se interpola.
  * El pie del frasco es vidrio grueso casi negro y sin color, del mismo
    ancho que el cuerpo y con las esquinas redondeadas: es frasco, no sombra.
    La sombra del suelo, en cambio, es gris claro y más ancha. Así que del
    último renglón con ámbar hacia abajo solo cuenta lo oscuro, y ningún
    renglón puede ser más ancho que el cuerpo del frasco.
  * Se suaviza el borde medio píxel, se recorta a la caja con 10 px de margen
    y se reduce a 840 px de alto, la altura de los envases de las aguas.
    WebP a calidad 86 y PNG de reserva con paleta, como las aguas.
"""
import os
import sys

import numpy as np
from PIL import Image, ImageFilter

# Página del PDF -> nombre del archivo (img/producto/reactivo-<nombre>.*)
NOMBRES = {
    1: "buffer-ph-10",
    2: "buffer-ph-7",
    3: "buffer-ph-4",
    4: "buffer-dureza-total",
    5: "titulador-dureza",
    6: "titulador-cloruros",
    7: "indicador-cloruros",
    8: "polvo-dureza-total",
    9: "polvo-dureza-calcio",
    10: "indicador-fenolftaleina",
    11: "indicador-anaranjado-metilo",
    12: "titulador-alcalinidad",
}
UMBRAL = 12
ALTO = 840
MARGEN = 10
DESTINO = os.path.join("img", "producto")


def recorta(ruta):
    rgb = np.asarray(Image.open(ruta).convert("RGB")).astype(int)
    alto, ancho, _ = rgb.shape
    borde = np.concatenate([rgb[:8].reshape(-1, 3), rgb[-8:].reshape(-1, 3),
                            rgb[:, :8].reshape(-1, 3), rgb[:, -8:].reshape(-1, 3)])
    fondo = np.median(borde, axis=0)
    dif = np.abs(rgb - fondo).max(axis=2)
    marcado = dif > UMBRAL

    mx, mn = rgb.max(axis=2), rgb.min(axis=2)
    saturacion = (mx - mn) / np.maximum(mx, 1)
    ambar = (rgb[..., 0] - rgb[..., 2]) > 50
    fin_ambar = int(np.nonzero(ambar.sum(axis=1) > 15)[0].max())
    tope = int(np.nonzero(marcado.sum(axis=1) > 0)[0].min())

    # Ancho del cuerpo: el renglón más ancho entre el 30 y el 90 % del alto.
    izq = np.full(alto, -1)
    der = np.full(alto, -1)
    for y in range(tope, fin_ambar + 1):
        xs = np.nonzero(marcado[y])[0]
        if len(xs):
            izq[y], der[y] = xs.min(), xs.max()
    tramo = range(tope + int((fin_ambar - tope) * .3), tope + int((fin_ambar - tope) * .9))
    cuerpo_izq = min(izq[y] for y in tramo if izq[y] >= 0)
    cuerpo_der = max(der[y] for y in tramo)

    # El pie oscuro: hacia abajo mientras lo oscuro ocupe un cuarto del cuerpo.
    oscuro = (mx < 100) | ((saturacion > 0.15) & (mx < 200))
    pie = fin_ambar
    while pie + 1 < alto and oscuro[pie + 1, cuerpo_izq:cuerpo_der + 1].sum() > (cuerpo_der - cuerpo_izq) * .25:
        pie += 1
    # En el pie, cada lado sigue el filo del vidrio (el umbral general) mientras
    # se vaya cerrando hacia dentro; en cuanto se abre hacia fuera es que llegó
    # la sombra del suelo, y desde ahí ese lado solo cuenta lo oscuro o ámbar.
    # Si se usara solo lo oscuro desde el principio, se comería el filo claro
    # del vidrio y la silueta haría un escalón.
    zona_pie = fin_ambar - int((fin_ambar - tope) * 0.06)
    prev_i, prev_d = izq[zona_pie - 1], der[zona_pie - 1]
    sombra_i = sombra_d = False
    for y in range(zona_pie, pie + 1):
        xo = np.nonzero(oscuro[y, cuerpo_izq:cuerpo_der + 1] | ambar[y, cuerpo_izq:cuerpo_der + 1])[0]
        xm = np.nonzero(marcado[y, cuerpo_izq:cuerpo_der + 1])[0]
        if not len(xo):
            izq[y], der[y] = -1, -1
            continue
        oi, od = cuerpo_izq + xo.min(), cuerpo_izq + xo.max()
        mi, md = (cuerpo_izq + xm.min(), cuerpo_izq + xm.max()) if len(xm) else (oi, od)
        sombra_i = sombra_i or mi < prev_i
        sombra_d = sombra_d or md > prev_d
        izq[y] = oi if sombra_i else mi
        der[y] = od if sombra_d else md
        prev_i, prev_d = izq[y], der[y]

    # La etiqueta va sobre el cuerpo recto del frasco: en toda su franja (más
    # las dos bandas azules) la silueta mide lo mismo. Ahí se usa la mediana
    # de sus renglones, que es inmune a los pocos que salgan rotos aunque
    # sean muchos seguidos (en p7 son 24).
    #
    # Dónde está la etiqueta: entre la primera y la última banda azul de ancho
    # completo que hay por debajo del vidrio ámbar. No sirve buscar «mucho
    # blanco»: por encima de la tapa también hay mucho blanco, y es fondo.
    span = slice(cuerpo_izq, cuerpo_der + 1)
    azul = (rgb[..., 2] - rgb[..., 0]) > 60
    frac_ambar = ambar[:, span].mean(axis=1)
    frac_azul = azul[:, span].mean(axis=1)
    inicio_vidrio = int(np.nonzero(frac_ambar > .5)[0].min())
    bandas = [y for y in range(inicio_vidrio, fin_ambar + 1) if frac_azul[y] > .7]
    if bandas:
        e0, e1 = min(bandas) - 2, max(bandas) + 2
        validos = [y for y in range(e0, e1 + 1) if izq[y] >= 0]
        m_izq = int(np.median([izq[y] for y in validos]))
        m_der = int(np.median([der[y] for y in validos]))
        for y in range(e0, e1 + 1):
            izq[y], der[y] = m_izq, m_der
    print(f"    etiqueta y={min(bandas)}-{max(bandas)}", end="")

    # Renglones más angostos que sus vecinos de arriba y de abajo: se interpolan.
    # Solo del vidrio para abajo: entre la tapa y el cuello el estrechamiento es
    # la forma real del frasco, y rellenarlo metía fondo blanco en el hueco.
    ancho_f = np.where(izq >= 0, der - izq, 0)
    malos = []
    for y in range(inicio_vidrio, pie + 1):
        arriba = ancho_f[max(tope, y - 10):y]
        abajo = ancho_f[y + 1:min(pie, y + 10) + 1]
        if len(arriba) and len(abajo) and ancho_f[y] < min(arriba.max(), abajo.max()) - 4:
            malos.append(y)
    buenos = [y for y in range(tope, pie + 1) if y not in set(malos) and izq[y] >= 0]
    for y in malos:
        a = max((b for b in buenos if b < y), default=None)
        b = min((b for b in buenos if b > y), default=None)
        if a is None or b is None:
            continue
        t = (y - a) / (b - a)
        izq[y] = round(izq[a] + (izq[b] - izq[a]) * t)
        der[y] = round(der[a] + (der[b] - der[a]) * t)

    mascara = np.zeros((alto, ancho), bool)
    for y in range(tope, pie + 1):
        if izq[y] >= 0:
            mascara[y, max(izq[y], cuerpo_izq):min(der[y], cuerpo_der) + 1] = True
    print(f"    renglones rehechos: {len(malos)}", end="")

    alfa = Image.fromarray((mascara * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
    img = Image.fromarray(rgb.astype(np.uint8)).convert("RGBA")
    img.putalpha(alfa)
    ys, xs = np.nonzero(mascara)
    caja = (max(xs.min() - MARGEN, 0), max(ys.min() - MARGEN, 0),
            min(xs.max() + 1 + MARGEN, ancho), min(ys.max() + 1 + MARGEN, alto))
    img = img.crop(caja)
    escala = ALTO / img.height
    return img.resize((round(img.width * escala), ALTO), Image.LANCZOS), fondo, pie


def main(carpeta, base):
    for pagina, nombre in NOMBRES.items():
        img, fondo, pie = recorta(os.path.join(carpeta, f"{base}-p{pagina}.png"))
        destino = os.path.join(DESTINO, f"reactivo-{nombre}")
        img.save(destino + ".webp", "WEBP", quality=86, method=6)
        # El PNG es solo la reserva para navegadores sin WebP: va con paleta de
        # 256 colores, como los de las aguas (de ~330 KB a ~60 KB).
        img.quantize(256, method=Image.Quantize.FASTOCTREE).save(destino + ".png", optimize=True)
        kb = [round(os.path.getsize(destino + e) / 1024) for e in (".webp", ".png")]
        print(f"p{pagina:>2} {nombre:<28} {img.width}x{img.height}  fondo {fondo.astype(int).tolist()}  "
              f"pie y={pie}  webp {kb[0]} KB  png {kb[1]} KB")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
