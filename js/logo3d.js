/* =========================================================
   AGUAS ESPECIALES — Isotipo en 3D
   ---------------------------------------------------------
   No es un logo distinto: es el mismo. La «A» se extruye desde el
   contorno de su trazo (calculado con desplazamiento de inglete,
   para que el grosor se mantenga también en el vértice) y la gota
   se revoluciona con pocos segmentos y sombreado plano, así que
   sale tallada en caras, como el cristal del logo plano.

   Si no hay WebGL este módulo ni se descarga: js/viewer3d.js deja
   la animación de respaldo que ya estaba en el HTML.
   ========================================================= */
import * as THREE from "./vendor/three.module.js";

/* ---------- Medidas, en coordenadas del SVG (viewBox 0 0 64 64) ---------- */
const A_IZQ = [12, 58], A_VERTICE = [38, 8], A_DER = [62, 58];
const A_TRAZO = 4.5;
const TRAVE_Y = 44, TRAVE_X1 = 19.3, TRAVE_X2 = 55.3;

const GOTA_PUNTA = 14;                        // altura de la punta
const GOTA_CENTRO = 42, GOTA_RADIO = 12.5;    // casquete inferior
const GOTA_EJE = 21;                          // eje de revolución, en X

const AGUA = new THREE.Color(0x67c8e8);

/* SVG (Y hacia abajo) → escena centrada en el origen con Y hacia arriba */
const v2 = (x, y) => new THREE.Vector2((x - 32) / 32, (32 - y) / 32);

/* ---------- Contorno de la «A» ----------
   Dos patas que se juntan en el vértice. Para que el trazo conserve el
   grosor en la punta hace falta el desplazamiento de inglete: escalar el
   contorno no serviría, adelgazaría justo las esquinas. */
function contornoA() {
  const [lx, ly] = A_IZQ, [vx, vy] = A_VERTICE, [rx, ry] = A_DER;
  const h = A_TRAZO / 2;
  const unidad = (ax, ay, bx, by) => {
    const d = Math.hypot(bx - ax, by - ay);
    return [(bx - ax) / d, (by - ay) / d];
  };
  const [u1x, u1y] = unidad(lx, ly, vx, vy);
  const [u2x, u2y] = unidad(vx, vy, rx, ry);
  // normal de cada pata, la que apunta al hueco interior de la «A»
  const n1 = [-u1y, u1x], n2 = [-u2y, u2x];

  const inglete = (a, b) => {
    let mx = a[0] + b[0], my = a[1] + b[1];
    const l = Math.hypot(mx, my) || 1;
    mx /= l; my /= l;
    const cos = Math.max(0.25, mx * a[0] + my * a[1]);
    return [vx + (mx * h) / cos, vy + (my * h) / cos];
  };
  const fuera = inglete([-n1[0], -n1[1]], [-n2[0], -n2[1]]);
  const dentro = inglete(n1, n2);

  return [
    v2(lx - n1[0] * h, ly - n1[1] * h),   // pie izquierdo, lado exterior
    v2(fuera[0], fuera[1]),               // vértice exterior
    v2(rx - n2[0] * h, ry - n2[1] * h),   // pie derecho, lado exterior
    v2(rx + n2[0] * h, ry + n2[1] * h),   // pie derecho, lado interior
    v2(dentro[0], dentro[1]),             // vértice interior
    v2(lx + n1[0] * h, ly + n1[1] * h),   // pie izquierdo, lado interior
  ];
}

/* El travesaño es un rectángulo. Sus extremos quedan enterrados dentro de
   las patas, así que las tres piezas se leen como una sola. */
function contornoTravesano() {
  const h = A_TRAZO / 2;
  return [
    v2(TRAVE_X1, TRAVE_Y - h), v2(TRAVE_X2, TRAVE_Y - h),
    v2(TRAVE_X2, TRAVE_Y + h), v2(TRAVE_X1, TRAVE_Y + h),
  ];
}

/* ---------- Perfil de la gota ----------
   Pocos puntos a propósito: con sombreado plano cada tramo se convierte en
   una faceta, que es justo la talla de cristal del logo. */
function perfilGota() {
  const pts = [];
  const punto = (x, y) => pts.push(new THREE.Vector2(Math.max(0, (GOTA_EJE - x) / 32), (32 - y) / 32));
  const px = GOTA_EJE, py = GOTA_PUNTA;
  const c2x = GOTA_EJE - GOTA_RADIO, c2y = 29;
  const p3x = GOTA_EJE - GOTA_RADIO, p3y = GOTA_CENTRO;
  for (let i = 0; i <= 3; i++) {
    const t = i / 3, u = 1 - t;
    punto(
      u * u * u * px + 3 * u * u * t * px + 3 * u * t * t * c2x + t * t * t * p3x,
      u * u * u * py + 3 * u * u * t * py + 3 * u * t * t * c2y + t * t * t * p3y
    );
  }
  for (let i = 1; i <= 3; i++) {
    const a = (Math.PI / 2) * (i / 3);
    punto(GOTA_EJE - GOTA_RADIO * Math.cos(a), GOTA_CENTRO + GOTA_RADIO * Math.sin(a));
  }
  return pts;
}

/* ---------- Entorno procedural para los reflejos ---------- */
function entorno(renderer) {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 256;
  const g = c.getContext("2d");
  const cielo = g.createLinearGradient(0, 0, 0, 256);
  cielo.addColorStop(0, "#ffffff");
  cielo.addColorStop(0.42, "#d6eaf5");
  cielo.addColorStop(0.52, "#54738a");
  cielo.addColorStop(0.66, "#16323f");
  cielo.addColorStop(1, "#09171f");
  g.fillStyle = cielo;
  g.fillRect(0, 0, 512, 256);
  const foco = (x, y, r, a) => {
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, `rgba(255,255,255,${a})`);
    rg.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = rg;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  };
  foco(130, 62, 95, 1);
  foco(372, 90, 72, 0.8);
  foco(256, 16, 170, 0.45);

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
function matA(env) {
  return new THREE.MeshPhysicalMaterial({
    color: 0x5c93cf, metalness: 0.55, roughness: 0.2,
    clearcoat: 1, clearcoatRoughness: 0.08,
    envMap: env, envMapIntensity: 1.4,
  });
}

/* Cristal, no burbuja: caras planas, mucho especular y tinte de agua.
   El sombreado plano es lo que hace que se lean las facetas. */
function matGota(env, alto) {
  if (alto) {
    return new THREE.MeshPhysicalMaterial({
      flatShading: true, side: THREE.DoubleSide, transparent: true, envMap: env,
      color: 0x4ec5e6, metalness: 0.1, roughness: 0.07,
      transmission: 0.32, thickness: 0.3, ior: 1.55,
      attenuationColor: AGUA, attenuationDistance: 0.4,
      clearcoat: 1, clearcoatRoughness: 0.02,
      envMapIntensity: 1.65, opacity: 0.95,
    });
  }
  // Equipos modestos: brillo y transparencia, sin refracción
  return new THREE.MeshPhysicalMaterial({
    flatShading: true, side: THREE.DoubleSide, transparent: true, envMap: env,
    color: 0x8ed5ec, metalness: 0, roughness: 0.09,
    clearcoat: 1, clearcoatRoughness: 0.04,
    envMapIntensity: 1.9, opacity: 0.8,
  });
}

/* ---------- Pieza completa ---------- */
function construyeLogo(env, alto) {
  const grupo = new THREE.Group();
  const opciones = {
    depth: 0.14,
    bevelEnabled: true, bevelThickness: 0.018, bevelSize: 0.018,
    bevelSegments: alto ? 3 : 1,
  };

  const material = matA(env);
  for (const contorno of [contornoA(), contornoTravesano()]) {
    const g = new THREE.ExtrudeGeometry(new THREE.Shape(contorno), opciones);
    g.translate(0, 0, -opciones.depth / 2);   // repartida a los dos lados
    grupo.add(new THREE.Mesh(g, material));
  }

  // Ocho segmentos: la gota queda tallada en ocho caras, como en el logo
  const gGota = new THREE.LatheGeometry(perfilGota(), 8);
  const gota = new THREE.Mesh(gGota, matGota(env, alto));
  gota.position.x = (GOTA_EJE - 32) / 32;     // el torno revoluciona sobre Y
  gota.rotation.y = Math.PI / 8;              // una cara mirando al frente
  gota.scale.z = 0.72;
  gota.position.z = 0.06;                     // por delante de la «A»
  grupo.add(gota);

  return grupo;
}

/* ---------- Visor ---------- */
export function crearLogo3D(el, opciones) {
  const { calidadAlta = true, autogiro = true } = opciones || {};

  const renderer = new THREE.WebGLRenderer({
    antialias: true, alpha: true, powerPreference: "high-performance",
  });
  renderer.setClearAlpha(0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const env = entorno(renderer);
  escena.environment = env;

  escena.add(new THREE.AmbientLight(0xffffff, 0.42));
  const key = new THREE.DirectionalLight(0xffffff, 1.7);
  key.position.set(3, 6, 7);
  escena.add(key);
  const rim = new THREE.DirectionalLight(0x9fe6f7, 1.2);
  rim.position.set(-5, 2, -4);
  escena.add(rim);

  const pieza = construyeLogo(env, calidadAlta);

  /* Encuadre sobre los vértices reales: la pieza gira sobre su eje Y, así que
     cada vértice puede acercarse a la cámara hasta rho = hypot(x,z). Se exige
     que quepa en su peor posición y se toma la distancia más exigente.
     La «A» con la gota no es simétrica, así que primero se centra en X: si no,
     al girar se saldría por un lado. */
  pieza.updateMatrixWorld(true);
  const caja = new THREE.Box3().setFromObject(pieza);
  const centroY = (caja.min.y + caja.max.y) / 2;
  pieza.position.x = -(caja.min.x + caja.max.x) / 2;
  pieza.position.y = -centroY;
  pieza.updateMatrixWorld(true);

  const MARGEN = 1.1;
  const TAN = Math.tan(((camara.fov / 2) * Math.PI) / 180);
  let expY = 0, radioMax = 0;
  const p = new THREE.Vector3();
  pieza.traverse((o) => {
    const pos = o.geometry && o.geometry.attributes && o.geometry.attributes.position;
    if (!pos) return;
    for (let i = 0; i < pos.count; i++) {
      p.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld);
      const rho = Math.hypot(p.x, p.z);
      if (rho > radioMax) radioMax = rho;
      const necesario = (Math.abs(p.y) * MARGEN) / TAN + rho;
      if (necesario > expY) expY = necesario;
    }
  });

  const distancia = (aspecto) =>
    Math.max(expY, radioMax * (MARGEN / (TAN * aspecto) + 1));

  const pivote = new THREE.Group();
  pivote.add(pieza);
  const flotador = new THREE.Group();     // el vaivén va aparte para no tocar el giro
  flotador.add(pivote);
  escena.add(flotador);

  camara.position.set(0, 0, distancia(1));
  camara.lookAt(0, 0, 0);

  const lienzo = renderer.domElement;
  lienzo.className = "logo3d__canvas";
  lienzo.setAttribute("aria-hidden", "true");
  el.appendChild(lienzo);

  /* ---- arrastre + giro automático ---- */
  let objetivoY = 0, actualY = 0, objetivoX = -0.06, actualX = -0.06;
  let arrastrando = false, ultimoX = 0, ultimoY = 0, inercia = 0, ocioso = 0, reloj = 0;

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
    objetivoX = Math.max(-0.45, Math.min(0.45, objetivoX + dy * 0.005));
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
        if (ocioso > 40) objetivoY += 0.0042;
      }
      objetivoX += (-0.06 - objetivoX) * 0.03;
    }
    actualY += (objetivoY - actualY) * 0.11;
    actualX += (objetivoX - actualX) * 0.11;
    pivote.rotation.y = actualY;
    pivote.rotation.x = actualX;
    if (autogiro) {
      reloj += 0.012;
      flotador.position.y = Math.sin(reloj) * 0.055;   // el mismo vaivén de la portada
    }
    renderer.render(escena, camara);
  };

  const io = new IntersectionObserver((ents) => { visible = ents[0].isIntersecting; },
    { rootMargin: "120px" });
  io.observe(el);

  ajusta();
  raf = requestAnimationFrame(cuadro);
  el.classList.add("is-ready");

  return {
    destruir() {
      cancelAnimationFrame(raf);
      io.disconnect();
      escena.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose();
      });
      env.dispose();
      renderer.dispose();
      lienzo.remove();
    },
  };
}
