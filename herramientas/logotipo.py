# -*- coding: utf-8 -*-
"""Genera los cuatro archivos del logotipo a partir del JPG del cliente.

    python herramientas/logotipo.py

Lee  img/real-logo.jpg  (el original tal cual lo entregó el cliente) y escribe:

    img/logo-aguas-especiales.png / .webp                  completo, a color
    img/logo-aguas-especiales-claro.png / .webp            completo, en blanco
    img/logo-aguas-especiales-compacto.png / .webp         sin lema, a color
    img/logo-aguas-especiales-compacto-claro.png / .webp   sin lema, en blanco

Por eso img/real-logo.jpg sigue en el repositorio aunque ninguna página lo
enlace ya: es la fuente. Si el cliente manda un logotipo nuevo, se sustituye
ese archivo y se vuelve a correr esto.

Hacen falta Pillow, NumPy y SciPy.


CÓMO SE QUITA EL FONDO BLANCO

El JPG trae el logotipo sobre blanco macizo, y el formato JPEG no admite
transparencia. Recortarlo tiene tres trampas, y cada paso resuelve una:

1. El fondo NO se reconoce solo por ser claro. La faceta más pálida de la gota
   está a 231 de luminancia, así que un umbral a secas se la comería. Se
   reconoce por claro Y sin color a la vez: el blanco del papel no separa nada
   entre sus canales; esa faceta, 44 niveles entre el rojo y el azul.

2. El JPEG deja anillos de colorines pegados a cada letra —casi blancos, pero
   con algo de color— que un filtro de color daría por tinta. Por eso la tinta
   se decide primero en grueso, se le quitan las manchas sueltas de menos de
   24 píxeles y solo se permite alfa dentro de esa mancha limpia más dos
   píxeles de contorno.

3. Los píxeles del contorno son mezcla de tinta y papel y se llevan el blanco
   dentro; si solo se les baja el alfa, sobre fondo oscuro se ve una orla clara
   alrededor de cada letra. A cada uno se le da el color de la tinta sólida más
   cercana y el alfa sale de cuánto papel le quedaba: la cobertura va en el
   alfa y el color va limpio.


LAS DOS VERSIONES CLARAS

No se invierte la imagen entera: eso apagaría la gota, que es lo único que ya
se lee sobre oscuro. Solo cambian las palabras y la «A» —el azul marino pasa a
blanco— y el lema, que sube al azul claro de la marca. El color se pone macizo,
sin degradar: el suavizado del borde ya lo lleva el canal alfa, y mezclar
también en el RGB dejaba las letras grises.


LAS DOS VERSIONES COMPACTAS

El lema mide 4 px de alto cuando el logotipo baja a los 54 px de una cabecera:
se ve un manchón. Las compactas lo quitan y centran las palabras contra la gota.
Ojo con los cortes: el logotipo encaja las palabras contra la «A», así que un
solo corte vertical parte letras. En las filas de las palabras la separación
está en x=228, pero la base de la «A» baja hasta x=248 en las filas del lema.
"""
import os
import pathlib

import numpy as np
from PIL import Image
from scipy import ndimage

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / "img" / "real-logo.jpg"
DESTINO = RAIZ / "img"

ANCHO = 600                       # de sobra para retina y para imprimir a 300 dpi
BLANCO = np.array([255.0, 255.0, 255.0])
AZUL_CLARO = np.array([165.0, 220.0, 239.0])   # #a5dcef, el azul claro de la marca


def recorta_fondo(rgb):
    """Devuelve (color, alfa) sin el papel blanco y sin orla en los bordes."""
    lum = rgb.mean(axis=2)
    croma = rgb.max(axis=2) - rgb.min(axis=2)

    nucleo = (lum < 238) | (croma > 38)

    etiquetas, cuantas = ndimage.label(nucleo)
    if cuantas:
        tam = np.bincount(etiquetas.ravel())
        tam[0] = 0
        nucleo = np.isin(etiquetas, np.flatnonzero(tam >= 24))

    banda = ndimage.binary_dilation(
        nucleo, ndimage.generate_binary_structure(2, 2), iterations=2)

    _, idx = ndimage.distance_transform_edt(~nucleo, return_indices=True)
    vecina = rgb[idx[0], idx[1]]

    alfa = np.clip((255.0 - lum) / np.maximum(255.0 - vecina.mean(axis=2), 1.0), 0.0, 1.0)
    alfa[nucleo] = 1.0
    alfa[~banda] = 0.0

    color = rgb.copy()
    contorno = banda & ~nucleo
    color[contorno] = vecina[contorno]
    return color, alfa, banda


def version_clara(color, banda, ancho, alto):
    """Palabras y «A» en blanco, lema en azul claro; la gota no se toca."""
    frontera = int(ancho * 0.41)
    base_lema = int(alto * 0.57)
    lum = color.mean(axis=2)

    derecha = np.zeros(color.shape[:2], bool)
    derecha[:, frontera:] = True
    abajo = np.zeros(color.shape[:2], bool)
    abajo[base_lema:, :] = True

    claro = color.copy()
    claro[banda & derecha & ~abajo] = BLANCO          # AGUAS ESPECIALES
    claro[banda & ~derecha & (lum < 118)] = BLANCO    # solo el azul marino de la «A»
    claro[banda & derecha & abajo] = AZUL_CLARO       # SOLUCIONES DISEÑADAS…
    return claro


def compacta(imagen, x_palabras=228, x_lema=250, y_lema=154):
    """Quita el lema y centra las palabras contra la gota."""
    d = np.asarray(imagen)
    palabras = np.zeros(d.shape[:2], bool)
    palabras[:y_lema, x_palabras:] = True
    lema = np.zeros(d.shape[:2], bool)
    lema[y_lema:, x_lema:] = True

    quedan = d.copy()
    quedan[palabras | lema] = 0          # la gota, la «A» y su base
    texto = d.copy()
    texto[~palabras] = 0                 # solo AGUAS ESPECIALES

    yt = np.nonzero((texto[:, :, 3] > 8).any(axis=1))[0]
    yq = np.nonzero((quedan[:, :, 3] > 8).any(axis=1))[0]
    baja = int(round((yq.min() + yq.max()) / 2 - (yt.min() + yt.max()) / 2))

    base = Image.fromarray(quedan, "RGBA")
    base.alpha_composite(Image.fromarray(texto, "RGBA"), (0, max(0, baja)))
    return base


def guarda(imagen, nombre):
    imagen.save(DESTINO / f"{nombre}.png", optimize=True)
    imagen.save(DESTINO / f"{nombre}.webp", quality=90, method=6)
    peso = os.path.getsize(DESTINO / f"{nombre}.webp") / 1024
    print(f"  {nombre:<38} {imagen.width}x{imagen.height}  webp {peso:.0f} KB")


def main():
    rgb = np.asarray(Image.open(ORIGEN).convert("RGB")).astype(np.float64)
    alto, ancho, _ = rgb.shape

    color, alfa, banda = recorta_fondo(rgb)
    claro = version_clara(color, banda, ancho, alto)

    completas = {}
    for datos, nombre in ((color, "logo-aguas-especiales"),
                          (claro, "logo-aguas-especiales-claro")):
        completas[nombre] = Image.fromarray(
            np.dstack([datos, alfa * 255.0]).astype(np.uint8), "RGBA")

    # El recuadro se calcula UNA vez y se aplica a todas: si cada una se
    # recortara por su cuenta quedarían encuadres distintos y el logotipo daría
    # un salto al cambiar de tema.
    a = np.asarray(completas["logo-aguas-especiales"])[:, :, 3]
    ys, xs = np.nonzero(a > 8)
    caja = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)

    print("completas:")
    escaladas = {}
    for nombre, im in completas.items():
        r = im.crop(caja)
        r = r.resize((ANCHO, round(r.height * ANCHO / r.width)), Image.LANCZOS)
        escaladas[nombre] = r
        guarda(r, nombre)

    print("compactas (sin lema, para las cabeceras):")
    for nombre, im in escaladas.items():
        guarda(compacta(im), nombre.replace("logo-aguas-especiales",
                                            "logo-aguas-especiales-compacto"))


if __name__ == "__main__":
    main()
