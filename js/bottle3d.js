/* =========================================================
   AGUAS ESPECIALES — Modelos 3D de producto
   ---------------------------------------------------------
   La botella PET no es una forma inventada: su perfil se midió
   píxel a píxel sobre la fotografía del producto y se revoluciona
   con LatheGeometry, así que la silueta coincide con la real desde
   cualquier ángulo. La etiqueta es la misma de la foto, desenvuelta
   cilíndricamente para que el texto quede recto al envolverla.
   ========================================================= */
import * as THREE from "./vendor/three.module.js";

/* Perfil medido: [radio, altura] con radio 1 = radio del cuerpo,
   altura 0 = base y 1 = tapa. Ordenado de arriba abajo. */
const PET_PERFIL = [
  [0.4167, 0.9988], [0.45, 0.9913], [0.4667, 0.9838], [0.4667, 0.9763],
  [0.4667, 0.9688], [0.4667, 0.9613], [0.4667, 0.9538], [0.4667, 0.9463],
  [0.4667, 0.9388], [0.4667, 0.9313], [0.4667, 0.9238], [0.5, 0.9164],
  [0.475, 0.9089], [0.4083, 0.9014], [0.4083, 0.8939], [0.4083, 0.8864],
  [0.4583, 0.8789], [0.4917, 0.8714], [0.5417, 0.8639], [0.5917, 0.8564],
  [0.6333, 0.8489], [0.6833, 0.8414], [0.7167, 0.834], [0.7583, 0.8265],
  [0.7917, 0.819], [0.8333, 0.8115], [0.8583, 0.804], [0.8917, 0.7965],
  [0.9167, 0.789], [0.9417, 0.7815], [0.9583, 0.774], [0.975, 0.7665],
  [0.9917, 0.7591], [1, 0.7516], [1, 0.7441], [1, 0.7366], [1, 0.6866],
  [1, 0.6367], [1, 0.5868], [1, 0.5368], [1, 0.4869], [1, 0.437],
  [1, 0.387], [1, 0.3371], [1, 0.2871], [0.9833, 0.2372], [1, 0.1873],
  [1, 0.1373], [1, 0.1248], [1, 0.1174], [1, 0.1099], [1, 0.1024],
  [1, 0.0949], [1, 0.0874], [1, 0.0799], [1, 0.0724], [0.975, 0.0649],
  [0.9667, 0.0574], [0.9667, 0.0499], [0.9417, 0.0424], [0.9667, 0.035],
  [1, 0.0275], [1, 0.02], [0.9917, 0.0125], [0.8583, 0.005],
];
const PET_ASPECTO = 6.675;      // alto / radio del cuerpo, medido en la foto
const PET_CORTE_TAPA = 0.92;    // por encima de esta altura empieza la tapa azul
const PET_ETIQUETA = [0.2347, 0.683];   // alto de la etiqueta sobre el cuerpo

const AZUL_TAPA = 0x0f4c9b;
const AGUA = new THREE.Color(0x8ed3e8);   // tinte del agua al atravesar el envase

/* ---------- Entorno procedural para los reflejos del vidrio ---------- */
function entorno(renderer) {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 256;
  const g = c.getContext("2d");
  // más oscuro por debajo del horizonte: da contraste al vidrio sobre el
  // encabezado azul marino en vez de dejarlo blanquecino
  const cielo = g.createLinearGradient(0, 0, 0, 256);
  cielo.addColorStop(0, "#ffffff");
  cielo.addColorStop(0.40, "#cfdde8");
  cielo.addColorStop(0.50, "#5d7688");
  cielo.addColorStop(0.62, "#20323e");
  cielo.addColorStop(1, "#0b171f");
  g.fillStyle = cielo;
  g.fillRect(0, 0, 512, 256);
  // dos focos suaves: dan los brillos alargados típicos del plástico
  const foco = (x, y, r, a) => {
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, `rgba(255,255,255,${a})`);
    rg.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = rg;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  };
  foco(120, 70, 90, 1);
  foco(380, 95, 70, 0.85);
  foco(256, 20, 160, 0.5);

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
function matVidrio(env, alto) {
  if (alto) {
    return new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 0, roughness: 0.05,
      transmission: 1, thickness: 1.6, ior: 1.42,
      attenuationColor: AGUA, attenuationDistance: 2.1,
      clearcoat: 0.7, clearcoatRoughness: 0.09,
      envMap: env, envMapIntensity: 0.9,
      side: THREE.DoubleSide, transparent: true, opacity: 0.9,
    });
  }
  // equipos modestos: reflejo + transparencia, sin refracción (mucho más barato)
  return new THREE.MeshPhysicalMaterial({
    color: 0xeaf7fd, metalness: 0, roughness: 0.12,
    transparent: true, opacity: 0.42,
    clearcoat: 1, clearcoatRoughness: 0.06,
    envMap: env, envMapIntensity: 1.5,
    side: THREE.DoubleSide, depthWrite: false,
  });
}

function matTapa(env) {
  return new THREE.MeshPhysicalMaterial({
    color: AZUL_TAPA, metalness: 0, roughness: 0.34,
    clearcoat: 0.7, clearcoatRoughness: 0.25,
    envMap: env, envMapIntensity: 0.9,
  });
}

function matEtiqueta(env, mapa) {
  return new THREE.MeshStandardMaterial({
    map: mapa, roughness: 0.62, metalness: 0,
    envMap: env, envMapIntensity: 0.35,
  });
}

/* ---------- Botella PET (cuerpo de revolución) ---------- */
function construyePET(env, mapa, alto) {
  const grupo = new THREE.Group();
  const pts = PET_PERFIL.slice().reverse();   // de la base hacia arriba

  const cuerpo = [];
  const tapa = [];
  for (const [r, h] of pts) (h >= PET_CORTE_TAPA ? tapa : cuerpo).push([r, h]);

  // cierre inferior cóncavo, como la base pétala de una PET real
  cuerpo.unshift([0, 0.014], [0.28, 0.006], [0.62, 0.001]);
  // la tapa venía recortada en la foto: se remata con un canto redondeado
  const rTapa = tapa[tapa.length - 1][0];
  tapa.push([rTapa * 0.96, 1.003], [rTapa * 0.72, 1.010], [rTapa * 0.36, 1.014], [0, 1.0155]);
  // el cuerpo sube hasta donde arranca la tapa para que no quede hueco
  cuerpo.push([tapa[0][0], tapa[0][1]]);

  const aVec = (arr) => arr.map(([r, h]) => new THREE.Vector2(
    Math.max(r, 0.0001) * 1, h * PET_ASPECTO));

  const gCuerpo = new THREE.LatheGeometry(aVec(cuerpo), alto ? 128 : 72);
  const gTapa = new THREE.LatheGeometry(aVec(tapa), alto ? 128 : 72);
  grupo.add(new THREE.Mesh(gCuerpo, matVidrio(env, alto)));
  grupo.add(new THREE.Mesh(gTapa, matTapa(env)));

  // etiqueta envuelta
  const [h0, h1] = PET_ETIQUETA;
  const altoEtq = (h1 - h0) * PET_ASPECTO;
  const gEtq = new THREE.CylinderGeometry(1.006, 1.006, altoEtq, alto ? 128 : 72, 1, true);
  const mEtq = new THREE.Mesh(gEtq, matEtiqueta(env, mapa));
  mEtq.position.y = (h0 + (h1 - h0) / 2) * PET_ASPECTO;
  grupo.add(mEtq);

  grupo.userData.alturaTotal = PET_ASPECTO * 1.0155;
  grupo.userData.radioMax = 1.01;   // cuerpo de revolución: gira sin ensancharse
  return grupo;
}

/* ---------- Frasco cuadrado de laboratorio ---------- */
function rectRedondeado(medio, radio) {
  const s = new THREE.Shape();
  s.moveTo(-medio + radio, -medio);
  s.lineTo(medio - radio, -medio);
  s.quadraticCurveTo(medio, -medio, medio, -medio + radio);
  s.lineTo(medio, medio - radio);
  s.quadraticCurveTo(medio, medio, medio - radio, medio);
  s.lineTo(-medio + radio, medio);
  s.quadraticCurveTo(-medio, medio, -medio, medio - radio);
  s.lineTo(-medio, -medio + radio);
  s.quadraticCurveTo(-medio, -medio, -medio + radio, -medio);
  return s;
}

/* Medidas tomadas sobre la foto, con el semiancho del cuerpo = 1.
   En la foto la base queda fuera de encuadre, así que el alto del cuerpo se
   completa con la proporción real de un frasco cuadrado de 1 L (95 × 95 × 225 mm). */
const LAB = { alto: 3.62, hombro: 0.43, cuello: 0.19, rCuello: 0.45, rTapa: 0.58, hTapa: 0.86 };

function construyeLab(env, mapa, alto) {
  const grupo = new THREE.Group();
  const vidrio = matVidrio(env, alto);

  const forma = rectRedondeado(1, 0.17);
  const gCuerpo = new THREE.ExtrudeGeometry(forma, {
    depth: LAB.alto - 0.16, bevelEnabled: true,
    bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: alto ? 4 : 2,
    curveSegments: alto ? 16 : 8,
  });
  gCuerpo.rotateX(-Math.PI / 2);
  gCuerpo.translate(0, 0.08, 0);
  grupo.add(new THREE.Mesh(gCuerpo, vidrio));

  let y = LAB.alto;
  const gHombro = new THREE.CylinderGeometry(LAB.rCuello, 0.92, LAB.hombro, alto ? 64 : 32, 1, true);
  const mHombro = new THREE.Mesh(gHombro, vidrio);
  mHombro.position.y = y + LAB.hombro / 2;
  grupo.add(mHombro);
  y += LAB.hombro;

  const gCuello = new THREE.CylinderGeometry(LAB.rCuello, LAB.rCuello, LAB.cuello, alto ? 64 : 32, 1, true);
  const mCuello = new THREE.Mesh(gCuello, vidrio);
  mCuello.position.y = y + LAB.cuello / 2;
  grupo.add(mCuello);
  y += LAB.cuello;

  const gTapa = new THREE.CylinderGeometry(LAB.rTapa, LAB.rTapa, LAB.hTapa, alto ? 64 : 32);
  const mTapa = new THREE.Mesh(gTapa, matTapa(env));
  mTapa.position.y = y + LAB.hTapa / 2 - 0.06;
  grupo.add(mTapa);

  // Etiqueta pegada sobre la cara frontal. Va por fuera del vidrio (1.09 > 1.08,
  // el semiancho con bisel): dentro se vería flotando y duplicada por refracción.
  const anchoEtq = 1.60, altoEtq = 2.45;
  const gEtq = new THREE.PlaneGeometry(anchoEtq, altoEtq);
  const mEtq = new THREE.Mesh(gEtq, matEtiqueta(env, mapa));
  mEtq.position.set(0, LAB.alto - 0.40 - altoEtq / 2, 1.092);
  grupo.add(mEtq);

  grupo.userData.alturaTotal = y + LAB.hTapa - 0.06;
  grupo.userData.radioMax = Math.SQRT2;   // al girar, las esquinas sobresalen
  return grupo;
}

/* ---------- Visor ---------- */
export function crearVisor(el, opciones) {
  const { modelo = "pet", etiqueta, calidadAlta = true, autogiro = true } = opciones;

  const renderer = new THREE.WebGLRenderer({
    antialias: true, alpha: true, powerPreference: "high-performance",
  });
  renderer.setClearAlpha(0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const env = entorno(renderer);
  escena.environment = env;

  escena.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(4, 7, 6);
  escena.add(key);
  const rim = new THREE.DirectionalLight(0xcfeaf7, 1.1);
  rim.position.set(-5, 3, -4);
  escena.add(rim);

  const cargador = new THREE.TextureLoader();
  const mapa = cargador.load(etiqueta);
  mapa.colorSpace = THREE.SRGBColorSpace;
  mapa.wrapS = THREE.RepeatWrapping;
  mapa.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  if (modelo === "pet") mapa.offset.x = 0.5;   // centra el diseño hacia la cámara

  const pieza = modelo === "lab"
    ? construyeLab(env, mapa, calidadAlta)
    : construyePET(env, mapa, calidadAlta);

  /* Encuadre calculado sobre los vértices reales.
     Con cámara en perspectiva no basta con medir la caja: la pieza gira sobre
     su eje Y, así que cada vértice puede acercarse hasta rho = hypot(x,z) y
     ahí se magnifica. Para cada vértice se exige que quepa en su peor posición
     (la más cercana), y nos quedamos con la distancia más exigente. */
  pieza.updateMatrixWorld(true);
  const caja = new THREE.Box3().setFromObject(pieza);
  const alturaTotal = caja.max.y - caja.min.y;
  const centroY = (caja.min.y + caja.max.y) / 2;

  const MARGEN = 1.06;
  const TAN = Math.tan((camara.fov / 2) * Math.PI / 180);

  let expY = 0, radioMax = 0;
  const p = new THREE.Vector3();
  pieza.traverse((o) => {
    const pos = o.geometry && o.geometry.attributes && o.geometry.attributes.position;
    if (!pos) return;
    for (let i = 0; i < pos.count; i++) {
      // cada malla tiene su propia posición (tapa, cuello, etiqueta): hay que
      // llevar el vértice al espacio de la pieza antes de medir
      p.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld);
      const rho = Math.hypot(p.x, p.z);
      if (rho > radioMax) radioMax = rho;
      const necesario = (Math.abs(p.y - centroY) * MARGEN) / TAN + rho;
      if (necesario > expY) expY = necesario;
    }
  });

  pieza.position.y = -centroY;

  const distancia = (aspecto) => Math.max(
    expY,
    radioMax * (MARGEN / (TAN * aspecto) + 1)
  );

  const pivote = new THREE.Group();
  pivote.add(pieza);
  escena.add(pivote);

  camara.position.set(0, 0, distancia(1));
  camara.lookAt(0, 0, 0);

  const lienzo = renderer.domElement;
  lienzo.className = "visor3d__canvas";
  lienzo.setAttribute("aria-hidden", "true");
  el.appendChild(lienzo);

  /* ---- control por arrastre + autogiro ---- */
  let objetivoY = 0, actualY = 0, objetivoX = 0, actualX = 0;
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
    objetivoX = Math.max(-0.32, Math.min(0.32, objetivoX + dy * 0.005));
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
        if (ocioso > 45) objetivoY += 0.0032;
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
    medidas: { alturaTotal, radioMax, caja: caja.clone() },
    destruir() {
      cancelAnimationFrame(raf);
      io.disconnect();
      escena.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          for (const k of ["map"]) if (o.material[k]) o.material[k].dispose();
          o.material.dispose();
        }
      });
      env.dispose();
      renderer.dispose();
      lienzo.remove();
    },
    /* Devuelve el fotograma actual como PNG. Se usa para generar las
       imágenes de respaldo que ven quienes no tienen WebGL. */
    async instantanea(anchoPx, altoPx2, giroY = 0) {
      renderer.setPixelRatio(1);
      renderer.setSize(anchoPx, altoPx2, false);
      camara.aspect = anchoPx / altoPx2;
      camara.position.z = distancia(camara.aspect);
      camara.updateProjectionMatrix();
      pivote.rotation.set(0, giroY, 0);
      renderer.render(escena, camara);
      const url = lienzo.toDataURL("image/png");
      ancho = 0; altoPx = 0;   // fuerza recolocar en el siguiente cuadro
      return url;
    },
  };
}
