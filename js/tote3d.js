/* =========================================================
   AGUAS ESPECIALES — Tote IBC de 1000 L en 3D
   ---------------------------------------------------------
   No es una caja genérica: las proporciones se midieron sobre la
   fotografía del producto y coinciden con un IBC real de 1000 L
   (1200 × 1000 mm de huella, 1160 mm de alto con tarima).

   La pieza son cinco partes, como en el envase de verdad:
     · tarima de plástico negro, con sus nueve pies y sus travesaños
     · tanque de HDPE translúcido, esquinas redondeadas
     · jaula de acero galvanizado: nueve aros y dieciséis verticales
     · tapa de llenado negra sobre su cuello
     · válvula de descarga con la palanca azul

   La etiqueta se dibuja en un lienzo, no es una imagen: así el texto
   queda nítido a cualquier tamaño y las cifras salen de un solo sitio
   (la constante DATOS), que es la misma regla que siguen la página de
   producto y las hojas técnicas. Nunca puede haber dos cifras distintas.

   Si no hay WebGL este módulo ni se descarga: js/viewer3d.js deja lo
   que ya estaba en el HTML.
   ========================================================= */
import * as THREE from "./vendor/three.module.js";

/* ---------- Medidas, tomadas sobre la foto ----------
   Unidad: el semiancho del frente vale 1, así que el frente mide 2.
   Con eso, 1 unidad = 600 mm y todo lo demás sale de la proporción real. */
const SEMIANCHO = 1.0;        // frente: 1200 mm
const SEMIFONDO = 0.8333;     // costado: 1000 mm
const H_TARIMA = 0.395;       // tarima de plástico
const H_JAULA = 1.615;        // jaula y tanque
const R_PLANTA = 0.15;        // radio de las esquinas, en planta

/* Jaula */
const AROS = 9;               // contados en la foto: 9 aros, uno cada ~40 px
const R_ARO = 0.0155;
const R_VERTICAL = 0.014;
const R_POSTE = 0.022;        // los cuatro postes de esquina son más gruesos

/* Tanque: va por dentro de la jaula, los aros sobresalen */
const HOLGURA = 0.035;
const R_TANQUE = 0.17;
/* El bisel del extrusionado ensancha la planta: la cara del tanque no está
   en SEMIFONDO - HOLGURA, sino 0.09 más afuera. Vivía suelto dentro de
   construyeTanque y por eso la etiqueta acabó diez milésimas por dentro de
   la pared, donde el tanque translúcido se la comía entera. */
const BISEL_TANQUE = 0.09;
const FRENTE_TANQUE = SEMIFONDO - HOLGURA + BISEL_TANQUE;

/* Tapa de llenado (DN150, centrada) */
const R_TAPA = 0.158, H_TAPA = 0.088;
const R_CUELLO = 0.192, H_CUELLO = 0.055;

/* Válvula de descarga, abajo al frente */
const VAL = { radio: 0.088, largo: 0.2, y: 0.17, salida: 0.145 };

/* Etiqueta: medida sobre la foto (250 × 170 px sobre 390 px de ancho) */
/* La etiqueta se agrandó: en la foto ocupa el 64 % del frente, pero a
   tamaño de portada ese 64 % dejaba los datos ilegibles. Al 74 % sigue
   siendo una proporción creíble para un IBC y ya se lee. */
/* La salida se mide desde la cara real del tanque, no desde SEMIFONDO: si
   mañana cambia la holgura o el bisel, la etiqueta sigue por delante sola. */
const ETQ = {
  ancho: 1.48, alto: 0.925, centroY: 1.16,
  salida: FRENTE_TANQUE - SEMIFONDO + 0.022,
};

const ALTO_TOTAL = H_TARIMA + H_JAULA + H_CUELLO + H_TAPA;
const RADIO_MAX = Math.max(
  Math.hypot(SEMIANCHO, SEMIFONDO),
  SEMIFONDO + VAL.largo + 0.06
);

/* ---------- Colores ---------- */
const NEGRO_PLASTICO = 0x23282d;   // tarima, tapa y cuerpo de la válvula
/* La jaula se oscureció. Con 0xd7dde3 y metalness .95 quedaba blanco sobre
   blanco: el tote salía como un alambre fantasma. Este gris es el que tiene
   el acero galvanizado a contraluz, y le devuelve el contorno. */
const ACERO = 0x8d9aa8;            // jaula galvanizada
const AZUL_PALANCA = 0x2f7fd6;
/* Sin tinte: el agua del tote va transparente, como la de verdad. */
const AGUA = new THREE.Color(0xffffff);

/* ---------- La etiqueta ----------
   Los datos viven aquí y en ningún otro lado. Si cambian en la hoja
   técnica, se cambian aquí y se cambian en js/catalog.js: son los dos
   únicos sitios donde hay cifras de este producto. */
const DATOS = {
  producto: "Agua Bidestilada",
  lineas: [
    ["Conductividad", "Máximo 15 µS/cm a 25 °C"],
    ["pH", "7.5 – 8.5"],
    ["Uso", "Laboratorio, farmacéutica, industrial"],
  ],
  pie: ["Lote", "Fecha"],
};

/* Trazos del isotipo, tal cual están en el <symbol id="ae-logo"> de cada
   página: la «A» a trazo y la gota en once facetas. Se dibujan con Path2D,
   que entiende la misma sintaxis del SVG, así que no hay una segunda versión
   del logo que pueda quedar desincronizada. */
const A_TRAZOS = ["M12 58 38 8 62 58Z", "M19.3 44h36"];
const A_COLOR = "#2f5789";
const GOTA = [
  ["M21 14C21 14 8.5 29 8.5 42a12.5 12.5 0 0 0 25 0C33.5 29 21 14 21 14Z", "#a5dcef"],
  ["M21 14L15.7 21.6L10.9 31L21 38Z", "#cdeef9"],
  ["M21 14L21 38L31.1 31L26.3 21.6Z", "#8ed3ec"],
  ["M10.9 31L9 37.3L21 38Z", "#b6e4f4"],
  ["M9 37.3L8.5 42L21 38Z", "#a3dcf0"],
  ["M8.5 42L12.16 50.84L21 38Z", "#5cb9de"],
  ["M12.16 50.84L21 54.5L21 38Z", "#2a7fb4"],
  ["M21 54.5L29.84 50.84L21 38Z", "#3f9dc9"],
  ["M29.84 50.84L33.5 42L21 38Z", "#62c0e0"],
  ["M33.5 42L33 37.3L21 38Z", "#7dcbe6"],
  ["M33 37.3L31.1 31L21 38Z", "#9bd9ef"],
];

function dibujaIsotipo(g, x, y, lado) {
  g.save();
  g.translate(x, y);
  g.scale(lado / 64, lado / 64);
  // Primero la «A» y encima la gota, igual que en el SVG: la gota tapa
  // casi toda la pata izquierda y por eso el logo se lee como una pieza.
  g.strokeStyle = A_COLOR;
  g.lineWidth = 4.5;
  g.lineJoin = "miter";
  g.miterLimit = 6;
  for (const d of A_TRAZOS) g.stroke(new Path2D(d));
  for (const [d, color] of GOTA) {
    g.fillStyle = color;
    g.fill(new Path2D(d));
  }
  g.restore();
}

/* La etiqueta va a sangre y opaca, sin margen ni sombra. Se probó con una
   sombra en una orla transparente para despegarla del tanque, pero entonces
   el material no puede escribir profundidad y el tanque translúcido se
   dibuja encima y se la come. Con el tanque tan transparente como está, el
   blanco macizo ya contrasta de sobra; el relieve lo dan el filete gris del
   borde y el degradado de los cantos. */
function pintaEtiqueta(lienzo, datos) {
  const CW = lienzo.width, CH = lienzo.height;
  const g = lienzo.getContext("2d");
  const SANS = '"Sora", "Inter", "Segoe UI", system-ui, sans-serif';

  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, CW, CH);

  // Cantos apenas sombreados: dan el grosor del papel pegado
  const canto = g.createLinearGradient(0, 0, 0, CH);
  canto.addColorStop(0, "rgba(12,59,92,.10)");
  canto.addColorStop(0.06, "rgba(12,59,92,0)");
  canto.addColorStop(0.94, "rgba(12,59,92,0)");
  canto.addColorStop(1, "rgba(12,59,92,.12)");
  g.fillStyle = canto;
  g.fillRect(0, 0, CW, CH);

  g.strokeStyle = "#b9d3e4";
  g.lineWidth = 8;
  g.strokeRect(4, 4, CW - 8, CH - 8);

  g.save();
  g.textBaseline = "alphabetic";

  /* --- Marca --- */
  const LADO = 186;
  g.font = `700 86px ${SANS}`;
  const w1 = g.measureText("AGUAS").width;
  g.font = `600 62px ${SANS}`;
  const w2 = g.measureText("ESPECIALES").width;
  const hueco = 30;
  const x0 = (CW - (LADO + hueco + Math.max(w1, w2))) / 2;

  dibujaIsotipo(g, x0, 52, LADO);
  g.fillStyle = "#0d3b5c";
  g.font = `700 86px ${SANS}`;
  g.fillText("AGUAS", x0 + LADO + hueco, 138);
  g.font = `600 62px ${SANS}`;
  g.fillText("ESPECIALES", x0 + LADO + hueco, 214);

  /* --- Nombre del producto: es lo que tiene que leerse de lejos --- */
  const MARGEN = 96;
  g.fillStyle = "#0d3b5c";
  g.font = `700 106px ${SANS}`;
  g.fillText(datos.producto, MARGEN, 400);

  const raya = (y) => {
    g.strokeStyle = "#c2d9e8";
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(MARGEN, y);
    g.lineTo(CW - MARGEN, y);
    g.stroke();
  };
  raya(444);

  /* --- Datos. Se subió el tamaño y se oscureció el gris: a lo lejos, el gris
         claro de antes desaparecía y la etiqueta parecía tener solo el título. --- */
  let y = 550;
  for (const [etiqueta, valor] of datos.lineas) {
    g.fillStyle = "#2c5f80";
    g.font = `700 52px ${SANS}`;
    const ancho = g.measureText(etiqueta + "  ").width;
    g.fillText(etiqueta, MARGEN, y);
    g.fillStyle = "#48789a";
    g.font = `400 52px ${SANS}`;
    g.fillText(valor, MARGEN + ancho, y);
    raya(y + 26);
    y += 116;
  }

  g.restore();
}

function texturaEtiqueta(datos, renderer) {
  const lienzo = document.createElement("canvas");
  lienzo.width = 1600;
  lienzo.height = 1000;
  pintaEtiqueta(lienzo, datos);

  const tex = new THREE.CanvasTexture(lienzo);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  /* Las tipografías de Google llegan después que el JavaScript. Si pintamos
     una sola vez, la etiqueta se queda con la fuente de reserva. Se vuelve a
     pintar cuando ya están cargadas: es un repintado de lienzo, no una
     descarga, así que no cuesta nada. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      pintaEtiqueta(lienzo, datos);
      tex.needsUpdate = true;
    });
  }
  return tex;
}

/* ---------- Entorno procedural para los reflejos ----------
   Mismo criterio que en los envases: más oscuro por debajo del horizonte,
   para que el acero y el plástico translúcido tengan contraste sobre el
   azul marino del hero en vez de quedar blanquecinos. */
function entorno(renderer) {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 256;
  const g = c.getContext("2d");
  const cielo = g.createLinearGradient(0, 0, 0, 256);
  cielo.addColorStop(0, "#ffffff");
  cielo.addColorStop(0.40, "#d2e2ed");
  cielo.addColorStop(0.50, "#5b7488");
  cielo.addColorStop(0.63, "#1d2f3b");
  cielo.addColorStop(1, "#0a161e");
  g.fillStyle = cielo;
  g.fillRect(0, 0, 512, 256);
  const foco = (x, y, r, a) => {
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, `rgba(255,255,255,${a})`);
    rg.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = rg;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  };
  foco(120, 66, 95, 1);
  foco(384, 92, 74, 0.85);
  foco(256, 18, 165, 0.5);

  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(tex).texture;
  pmrem.dispose();
  tex.dispose();
  return env;
}

/* ---------- Materiales ---------- */
function matTanque(env, alto) {
  if (alto) {
    /* HDPE natural: translúcido, no lechoso. La tentación es subir la
       rugosidad para que parezca plástico, pero entonces el tanque se vuelve
       una masa blanca que tapa la jaula y, sobre el azul marino del hero, el
       tote entero queda como una mancha. Se ve mucho mejor dejándolo pasar
       la luz: la jaula del fondo se transparenta, igual que en la foto. */
    return new THREE.MeshPhysicalMaterial({
      color: 0xf4f9fc, metalness: 0, roughness: 0.26,
      transmission: 0.86, thickness: 0.6, ior: 1.34,
      attenuationColor: AGUA, attenuationDistance: 30,
      clearcoat: 0.85, clearcoatRoughness: 0.14,
      envMap: env, envMapIntensity: 1.05,
      side: THREE.DoubleSide, transparent: true, opacity: 1,
    });
  }
  // Equipos modestos: sin refracción, que es lo caro
  return new THREE.MeshStandardMaterial({
    color: 0xf4f9fc, metalness: 0, roughness: 0.3,
    transparent: true, opacity: 0.4,
    envMap: env, envMapIntensity: 1.1,
    side: THREE.DoubleSide, depthWrite: false,
  });
}

const matAcero = (env) => new THREE.MeshStandardMaterial({
  color: ACERO, metalness: 0.72, roughness: 0.38,
  envMap: env, envMapIntensity: 0.85,
});

const matPlastico = (env, color, rug) => new THREE.MeshStandardMaterial({
  color, metalness: 0, roughness: rug,
  envMap: env, envMapIntensity: 0.55,
});

/* Sombra de contacto. Va pintada en un lienzo, no calculada: una sombra de
   verdad exige encender el mapa de sombras y una luz que la proyecte, y para
   una mancha bajo una tarima que apenas se mueve no compensa el coste. Sin
   ella el tote flota sobre el blanco de la página, que es justo lo que se
   veía mal. */
function construyeSombra() {
  const l = document.createElement("canvas");
  l.width = l.height = 256;
  const g = l.getContext("2d");
  const rad = g.createRadialGradient(128, 128, 8, 128, 128, 124);
  rad.addColorStop(0, "rgba(14,45,66,.42)");
  rad.addColorStop(0.45, "rgba(14,45,66,.20)");
  rad.addColorStop(1, "rgba(14,45,66,0)");
  g.fillStyle = rad;
  g.fillRect(0, 0, 256, 256);

  const tex = new THREE.CanvasTexture(l);
  tex.colorSpace = THREE.SRGBColorSpace;
  const malla = new THREE.Mesh(
    new THREE.PlaneGeometry(SEMIANCHO * 3.1, SEMIFONDO * 3.4),
    new THREE.MeshBasicMaterial({
      map: tex, transparent: true, depthWrite: false, toneMapped: false,
    })
  );
  malla.rotation.x = -Math.PI / 2;
  malla.position.y = 0.004;   // pelín por encima del suelo, para no pelearse en profundidad
  malla.renderOrder = -1;
  return malla;
}

/* ---------- Piezas ---------- */

/* Rectángulo redondeado en planta, a una altura dada. Se usa como recorrido
   de los aros: la jaula real es una varilla doblada, no cuatro tramos sueltos. */
function anillo(sx, sz, r, y, pasos) {
  const p = [];
  const arco = (cx, cz, a0, a1) => {
    for (let i = 0; i <= pasos; i++) {
      const a = a0 + (a1 - a0) * (i / pasos);
      p.push(new THREE.Vector3(cx + Math.cos(a) * r, y, cz + Math.sin(a) * r));
    }
  };
  const T = Math.PI / 2;
  arco(sx - r, sz - r, 0, T);
  arco(-sx + r, sz - r, T, 2 * T);
  arco(-sx + r, -sz + r, 2 * T, 3 * T);
  arco(sx - r, -sz + r, 3 * T, 4 * T);
  return p;
}

/* Forma en planta del tanque, para extruirla en altura */
function plantaTanque(sx, sz, r) {
  const s = new THREE.Shape();
  s.moveTo(-sx + r, -sz);
  s.lineTo(sx - r, -sz);
  s.quadraticCurveTo(sx, -sz, sx, -sz + r);
  s.lineTo(sx, sz - r);
  s.quadraticCurveTo(sx, sz, sx - r, sz);
  s.lineTo(-sx + r, sz);
  s.quadraticCurveTo(-sx, sz, -sx, sz - r);
  s.lineTo(-sx, -sz + r);
  s.quadraticCurveTo(-sx, -sz, -sx + r, -sz);
  return s;
}

function construyeTarima(env) {
  const g = new THREE.Group();
  const negro = matPlastico(env, NEGRO_PLASTICO, 0.62);

  const H_PIE = 0.19, H_LARGUERO = 0.062;
  const H_CUBIERTA = H_TARIMA - H_PIE - H_LARGUERO;

  // Cubierta: la plancha sobre la que se apoya el tanque
  const cubierta = new THREE.Mesh(
    new THREE.BoxGeometry(SEMIANCHO * 2, H_CUBIERTA, SEMIFONDO * 2),
    negro
  );
  cubierta.position.y = H_TARIMA - H_CUBIERTA / 2;
  g.add(cubierta);

  // Nueve pies (3 × 3) en una sola llamada de dibujo
  const XS = [-SEMIANCHO + 0.17, 0, SEMIANCHO - 0.17];
  const ZS = [-SEMIFONDO + 0.15, 0, SEMIFONDO - 0.15];
  const pies = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.36, H_PIE, 0.34), negro, 9
  );
  const m = new THREE.Matrix4();
  let i = 0;
  for (const x of XS) for (const z of ZS) {
    m.makeTranslation(x, H_LARGUERO + H_PIE / 2, z);
    pies.setMatrixAt(i++, m);
  }
  pies.instanceMatrix.needsUpdate = true;
  g.add(pies);

  // Tres largueros que unen los pies por abajo
  const largueros = new THREE.InstancedMesh(
    new THREE.BoxGeometry(SEMIANCHO * 2, H_LARGUERO, 0.32), negro, 3
  );
  ZS.forEach((z, k) => {
    m.makeTranslation(0, H_LARGUERO / 2, z);
    largueros.setMatrixAt(k, m);
  });
  largueros.instanceMatrix.needsUpdate = true;
  g.add(largueros);

  return g;
}

function construyeTanque(env, alto) {
  const sx = SEMIANCHO - HOLGURA;
  const sz = SEMIFONDO - HOLGURA;
  const bisel = BISEL_TANQUE;
  const geo = new THREE.ExtrudeGeometry(plantaTanque(sx, sz, R_TANQUE), {
    depth: H_JAULA - 0.04 - bisel * 2,
    bevelEnabled: true,
    bevelThickness: bisel, bevelSize: bisel,
    bevelSegments: alto ? 4 : 2,
    curveSegments: alto ? 14 : 7,
  });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, H_TARIMA + bisel, 0);
  return new THREE.Mesh(geo, matTanque(env, alto));
}

function construyeJaula(env, alto) {
  const g = new THREE.Group();
  const acero = matAcero(env);
  const pasos = alto ? 7 : 4;
  const segmentos = alto ? 130 : 78;
  const radiales = alto ? 8 : 6;

  // Aros horizontales: una varilla doblada por aro
  for (let i = 0; i < AROS; i++) {
    const y = H_TARIMA + (H_JAULA * i) / (AROS - 1);
    const curva = new THREE.CatmullRomCurve3(
      anillo(SEMIANCHO, SEMIFONDO, R_PLANTA, y, pasos), true, "centripetal"
    );
    g.add(new THREE.Mesh(
      new THREE.TubeGeometry(curva, segmentos, R_ARO, radiales, true), acero
    ));
  }

  /* Verticales. Van todas en una sola malla instanciada: la misma varilla
     repetida, con los cuatro postes de esquina escalados algo más gruesos. */
  const rectoX = SEMIANCHO - R_PLANTA;
  const rectoZ = SEMIFONDO - R_PLANTA;
  const d = R_PLANTA * Math.SQRT1_2;
  const sitios = [];
  // esquinas
  for (const sx of [1, -1]) for (const sz of [1, -1]) {
    sitios.push([sx * (rectoX + d), sz * (rectoZ + d), R_POSTE]);
  }
  // tres intermedias por cara
  for (let i = 1; i <= 3; i++) {
    const x = -rectoX + 2 * rectoX * (i / 4);
    sitios.push([x, SEMIFONDO, R_VERTICAL], [x, -SEMIFONDO, R_VERTICAL]);
    const z = -rectoZ + 2 * rectoZ * (i / 4);
    sitios.push([SEMIANCHO, z, R_VERTICAL], [-SEMIANCHO, z, R_VERTICAL]);
  }

  const verticales = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(1, 1, 1, alto ? 10 : 6), acero, sitios.length
  );
  const m = new THREE.Matrix4();
  sitios.forEach(([x, z, r], k) => {
    m.compose(
      new THREE.Vector3(x, H_TARIMA + H_JAULA / 2, z),
      new THREE.Quaternion(),
      new THREE.Vector3(r, H_JAULA, r)
    );
    verticales.setMatrixAt(k, m);
  });
  verticales.instanceMatrix.needsUpdate = true;
  g.add(verticales);

  return g;
}

function construyeTapa(env, alto) {
  const g = new THREE.Group();
  const seg = alto ? 40 : 20;
  const yTanque = H_TARIMA + H_JAULA - 0.04;

  const cuello = new THREE.Mesh(
    new THREE.CylinderGeometry(R_CUELLO, R_CUELLO + 0.012, H_CUELLO, seg),
    matPlastico(env, 0xe8f4fa, 0.4)
  );
  cuello.position.y = yTanque + H_CUELLO / 2;
  g.add(cuello);

  const tapa = new THREE.Mesh(
    new THREE.CylinderGeometry(R_TAPA, R_TAPA, H_TAPA, seg),
    matPlastico(env, NEGRO_PLASTICO, 0.5)
  );
  tapa.position.y = yTanque + H_CUELLO + H_TAPA / 2;
  g.add(tapa);

  // Reborde superior: el canto que se agarra para abrirla
  const canto = new THREE.Mesh(
    new THREE.TorusGeometry(R_TAPA - 0.012, 0.014, alto ? 8 : 5, seg),
    matPlastico(env, NEGRO_PLASTICO, 0.5)
  );
  canto.rotation.x = Math.PI / 2;
  canto.position.y = yTanque + H_CUELLO + H_TAPA;
  g.add(canto);

  return g;
}

function construyeValvula(env, alto) {
  const g = new THREE.Group();
  const seg = alto ? 28 : 14;
  const negro = matPlastico(env, NEGRO_PLASTICO, 0.45);
  const z0 = SEMIFONDO;

  // Cuerpo: sale del frente, en horizontal
  const cuerpo = new THREE.Mesh(
    new THREE.CylinderGeometry(VAL.radio, VAL.radio, VAL.largo, seg), negro
  );
  cuerpo.rotation.x = Math.PI / 2;
  cuerpo.position.set(0, VAL.y, z0 + VAL.largo / 2 - 0.03);
  g.add(cuerpo);

  // Brida contra el tanque
  const brida = new THREE.Mesh(
    new THREE.CylinderGeometry(VAL.radio + 0.035, VAL.radio + 0.035, 0.04, seg), negro
  );
  brida.rotation.x = Math.PI / 2;
  brida.position.set(0, VAL.y, z0 - 0.01);
  g.add(brida);

  // Salida, hacia abajo
  const salida = new THREE.Mesh(
    new THREE.CylinderGeometry(VAL.radio * 0.72, VAL.radio * 0.78, VAL.salida, seg), negro
  );
  salida.position.set(0, VAL.y - VAL.salida / 2, z0 + VAL.largo - 0.09);
  g.add(salida);

  /* Palanca azul: es lo único de color del envase y es lo que hace que se
     reconozca de lejos como un tote, así que va con su inclinación real. */
  const palanca = new THREE.Group();
  const brazo = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.05, 0.075),
    matPlastico(env, AZUL_PALANCA, 0.35)
  );
  brazo.position.x = 0.13;
  palanca.add(brazo);
  const eje = new THREE.Mesh(
    new THREE.CylinderGeometry(0.042, 0.042, 0.07, seg),
    matPlastico(env, AZUL_PALANCA, 0.35)
  );
  palanca.add(eje);
  palanca.position.set(0, VAL.y + VAL.radio + 0.02, z0 + 0.05);
  palanca.rotation.z = -0.3;
  g.add(palanca);

  return g;
}

function construyeEtiqueta(env, tex) {
  const g = new THREE.Group();
  /* Material iluminado, pero con la propia textura también como emisiva. Sin
     iluminar quedaba perfectamente legible y perfectamente muerta: un
     rectángulo pegado, sin un reflejo. Con emisiva al 0.45 el texto conserva
     el contraste pase lo que pase con la luz, y el clearcoat le da el brillo
     del plastificado que llevan las etiquetas de verdad.

     Ojo: lo que la hacía ilegible no era el material, era que estaba metida
     por dentro de la pared del tanque. Eso se arregló en ETQ.salida. */
  const mat = new THREE.MeshPhysicalMaterial({
    map: tex,
    emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.45,
    metalness: 0, roughness: 0.34,
    clearcoat: 0.7, clearcoatRoughness: 0.22,
    envMap: env, envMapIntensity: 0.5,
  });
  const geo = new THREE.PlaneGeometry(ETQ.ancho, ETQ.alto);

  /* Va por delante de la jaula, no por detrás. En la foto del producto la
     etiqueta se lee entera, sin varillas cruzándola, y en una portada eso
     importa más que el rigor de dónde está pegada de verdad. */
  const frente = new THREE.Mesh(geo, mat);
  frente.position.set(0, ETQ.centroY, SEMIFONDO + ETQ.salida);
  g.add(frente);

  // La de atrás, para que siempre haya etiqueta a la vista al girar
  const atras = new THREE.Mesh(geo, mat);
  atras.position.set(0, ETQ.centroY, -(SEMIFONDO + ETQ.salida));
  atras.rotation.y = Math.PI;
  g.add(atras);

  return g;
}

/* ---------- Visor ---------- */
export function crearTote3D(el, opciones) {
  const { calidadAlta = true, autogiro = true, datos = DATOS } = opciones || {};

  const renderer = new THREE.WebGLRenderer({
    antialias: true, alpha: true, powerPreference: "high-performance",
  });
  renderer.setClearAlpha(0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const env = entorno(renderer);
  escena.environment = env;

  escena.add(new THREE.AmbientLight(0xffffff, 0.42));
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(4, 7, 6);
  escena.add(key);
  const rim = new THREE.DirectionalLight(0xcfeaf7, 1.05);
  rim.position.set(-5, 3, -4);
  escena.add(rim);

  const tex = texturaEtiqueta(datos, renderer);

  const pieza = new THREE.Group();
  pieza.add(construyeSombra());
  pieza.add(construyeTarima(env));
  pieza.add(construyeTanque(env, calidadAlta));
  pieza.add(construyeJaula(env, calidadAlta));
  pieza.add(construyeTapa(env, calidadAlta));
  pieza.add(construyeValvula(env, calidadAlta));
  pieza.add(construyeEtiqueta(env, tex));

  // Se centra en altura para que gire sobre su propio eje
  pieza.position.y = -ALTO_TOTAL / 2;

  const pivote = new THREE.Group();
  pivote.add(pieza);
  escena.add(pivote);

  /* Encuadre. Aquí las medidas se saben de antemano —las define este mismo
     archivo—, así que no hace falta recorrer los vértices como en los
     envases; además parte de la jaula va en mallas instanciadas y un
     recorrido de vértices las mediría mal. */
  const MARGEN = 1.08;
  const TAN = Math.tan((camara.fov / 2) * Math.PI / 180);
  const expY = ((ALTO_TOTAL / 2) * MARGEN) / TAN + RADIO_MAX;
  const distancia = (aspecto) => Math.max(
    expY, RADIO_MAX * (MARGEN / (TAN * aspecto) + 1)
  );

  camara.position.set(0, 0, distancia(1));
  camara.lookAt(0, 0, 0);

  const lienzo = renderer.domElement;
  lienzo.className = "tote3d__canvas";
  lienzo.setAttribute("aria-hidden", "true");
  el.appendChild(lienzo);

  /* ---- arrastre + autogiro ---- */
  let objetivoY = 0.42, actualY = 0.42, objetivoX = 0, actualX = 0;
  let arrastrando = false, ultimoX = 0, ultimoY = 0, inercia = 0, ocioso = 0;

  const abajo = (e) => {
    arrastrando = true; inercia = 0; ocioso = 0;
    ultimoX = e.clientX; ultimoY = e.clientY;
    lienzo.setPointerCapture(e.pointerId);
    el.classList.add("is-dragging");
  };
  const mover = (e) => {
    if (!arrastrando) return;
    const dx = e.clientX - ultimoX, dy = e.clientY - ultimoY;
    ultimoX = e.clientX; ultimoY = e.clientY;
    objetivoY += dx * 0.009;
    objetivoX = Math.max(-0.3, Math.min(0.3, objetivoX + dy * 0.005));
    inercia = dx * 0.0016;
  };
  const arriba = (e) => {
    if (!arrastrando) return;
    arrastrando = false; ocioso = 0;
    try { lienzo.releasePointerCapture(e.pointerId); } catch { /* ya liberado */ }
    el.classList.remove("is-dragging");
  };
  lienzo.addEventListener("pointerdown", abajo);
  lienzo.addEventListener("pointermove", mover);
  lienzo.addEventListener("pointerup", arriba);
  lienzo.addEventListener("pointercancel", arriba);
  lienzo.addEventListener("lostpointercapture", arriba);

  /* ---- bucle ---- */
  let raf = 0, visible = true, ancho = 0, altoPx = 0;
  const dprMax = calidadAlta ? 2 : 1.5;

  const ajusta = () => {
    const r = el.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width));
    const h = Math.max(1, Math.round(r.height));
    if (w === ancho && h === altoPx) return;
    ancho = w; altoPx = h;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprMax));
    renderer.setSize(w, h, false);
    camara.aspect = w / h;
    camara.position.z = distancia(camara.aspect);
    camara.updateProjectionMatrix();
  };

  const cuadro = () => {
    raf = requestAnimationFrame(cuadro);
    if (!visible) return;
    ajusta();
    if (!arrastrando) {
      if (Math.abs(inercia) > 0.00005) {
        objetivoY += inercia;
        inercia *= 0.94;
      } else if (autogiro) {
        ocioso += 1;
        if (ocioso > 45) objetivoY += 0.0028;
      }
      objetivoX += (0 - objetivoX) * 0.03;
    }
    actualY += (objetivoY - actualY) * 0.11;
    actualX += (objetivoX - actualX) * 0.11;
    pivote.rotation.y = actualY;
    pivote.rotation.x = actualX;
    renderer.render(escena, camara);
  };

  const io = new IntersectionObserver((ents) => {
    visible = ents[0].isIntersecting;
  }, { rootMargin: "120px" });
  io.observe(el);

  ajusta();
  raf = requestAnimationFrame(cuadro);
  el.classList.add("is-ready");

  return {
    medidas: { alturaTotal: ALTO_TOTAL, radioMax: RADIO_MAX },
    destruir() {
      cancelAnimationFrame(raf);
      io.disconnect();
      escena.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (o.material.map) o.material.map.dispose();
          o.material.dispose();
        }
      });
      env.dispose();
      renderer.dispose();
      lienzo.remove();
    },
    /* Fotograma actual en PNG: de aquí salen las imágenes de respaldo,
       así siempre coinciden con el modelo. */
    async instantanea(anchoPx, altoPx2, giroY = 0.42) {
      renderer.setPixelRatio(1);
      renderer.setSize(anchoPx, altoPx2, false);
      camara.aspect = anchoPx / altoPx2;
      camara.position.z = distancia(camara.aspect);
      camara.updateProjectionMatrix();
      pivote.rotation.set(0, giroY, 0);
      renderer.render(escena, camara);
      const url = lienzo.toDataURL("image/png");
      ancho = 0; altoPx = 0;
      return url;
    },
  };
}
