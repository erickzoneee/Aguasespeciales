/* =========================================================
   AGUAS ESPECIALES — Isotipo en 3D
   ---------------------------------------------------------
   No es un logo distinto: es el mismo. El contorno del escudo se
   muestrea sobre la curva exacta del SVG (viewBox 0 0 64 64) y se
   extruye; la gota se revoluciona con LatheGeometry sobre su propio
   perfil. Visto de frente, la silueta calca la del logo plano.

   Si no hay WebGL este módulo ni se descarga: js/viewer3d.js deja
   la animación de respaldo que ya estaba en el HTML.
   ========================================================= */
import * as THREE from "./vendor/three.module.js";

/* ---------- Geometría del logo, en coordenadas del SVG ---------- */
const GROSOR = 3.2;          // ancho del trazo del escudo, igual que en el SVG
const AGUA = new THREE.Color(0x7fd4ea);

/* SVG (0..64, Y hacia abajo) → escena centrada en el origen con Y hacia arriba */
const aEscena = (x, y) => new THREE.Vector2((x - 32) / 32, (32 - y) / 32);

/* Recorre el contorno del escudo en el mismo orden que el atributo d */
function contornoEscudo() {
  const p = [];
  const punto = (x, y) => p.push(aEscena(x, y));
  // Los tramos empiezan en i = 1: el punto inicial ya lo dejó el tramo anterior
  // y repetirlo crearía un lado de longitud cero.
  const arco = (cx, cy, r, a0, a1, n) => {
    for (let i = 1; i <= n; i++) {
      const a = a0 + (a1 - a0) * (i / n);
      punto(cx + r * Math.cos(a), cy + r * Math.sin(a));
    }
  };
  const cubica = (p0, c1, c2, p3, n) => {
    for (let i = 1; i <= n; i++) {
      const t = i / n, u = 1 - t;
      punto(
        u * u * u * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p3[0],
        u * u * u * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p3[1]
      );
    }
  };
  const G = Math.PI / 180;

  punto(48.1, 4.6);                                 // extremo derecho del borde superior
  arco(48.1, 12.1, 7.5, -90 * G, 0, 10);            // esquina superior derecha
  punto(55.6, 31.7);
  cubica([55.6, 31.7], [55.6, 44.1], [47.3, 53.3], [32, 59.4], 24);   // baja hasta la punta
  cubica([32, 59.4], [16.7, 53.3], [8.4, 44.1], [8.4, 31.7], 24);     // y sube por la izquierda
  punto(8.4, 12.1);
  arco(15.9, 12.1, 7.5, 180 * G, 270 * G, 10);      // esquina superior izquierda

  // Red de seguridad: sin puntos repetidos, porque un lado de longitud cero
  // deja la normal indefinida y dispara el desplazamiento en esa esquina.
  const limpio = p.filter((q, i) => i === 0 || q.distanceTo(p[i - 1]) > 1e-4);
  if (limpio.length > 1 && limpio[0].distanceTo(limpio[limpio.length - 1]) < 1e-4) limpio.pop();
  return limpio;                                    // el cierre traza el borde superior
}

/* Perfil de la gota: mitad derecha del dibujo, lista para revolucionar.
   Vector2(x = radio desde el eje, y = altura). */
function perfilGota() {
  const pts = [];
  const punto = (x, y) => pts.push(new THREE.Vector2(Math.max(0, (32 - x) / 32), (32 - y) / 32));
  // Tramo superior: la misma cúbica del SVG, de la punta al ancho máximo
  const p0 = [32, 14.5], c1 = [32, 14.5], c2 = [19.8, 28.8], p3 = [19.8, 35];
  for (let i = 0; i <= 28; i++) {
    const t = i / 28, u = 1 - t;
    punto(
      u * u * u * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p3[1]
    );
  }
  // Tramo inferior: el casquete esférico, centro (32,35) y radio 12.2
  for (let i = 1; i <= 22; i++) {
    const a = (Math.PI / 2) * (i / 22);
    punto(32 - 12.2 * Math.cos(a), 35 + 12.2 * Math.sin(a));
  }
  return pts;
}

/* Área con signo: sirve para saber hacia qué lado cae la normal interior */
function areaConSigno(pts) {
  let a = 0;
  for (let i = 0, n = pts.length; i < n; i++) {
    const p = pts[i], q = pts[(i + 1) % n];
    a += p.x * q.y - q.x * p.y;
  }
  return a / 2;
}

/* Copia del contorno desplazada hacia dentro una distancia constante.
   Con esto el escudo queda como un marco de grosor uniforme, igual que
   el trazo del SVG, en vez de una silueta maciza. */
function haciaDentro(pts, d) {
  const n = pts.length;
  if (areaConSigno(pts) < 0) pts = pts.slice().reverse();   // normaliza a antihorario
  const fuera = [];
  for (let i = 0; i < n; i++) {
    const a = pts[(i - 1 + n) % n], b = pts[i], c = pts[(i + 1) % n];
    let n1x = -(b.y - a.y), n1y = b.x - a.x;
    let n2x = -(c.y - b.y), n2y = c.x - b.x;
    const l1 = Math.hypot(n1x, n1y) || 1, l2 = Math.hypot(n2x, n2y) || 1;
    n1x /= l1; n1y /= l1; n2x /= l2; n2y /= l2;
    let mx = n1x + n2x, my = n1y + n2y;
    const lm = Math.hypot(mx, my) || 1;
    mx /= lm; my /= lm;
    // El factor de inglete mantiene el grosor también en las esquinas;
    // se acota para que un vértice muy cerrado no dispare la punta.
    const cos = Math.max(0.4, mx * n1x + my * n1y);
    fuera.push(new THREE.Vector2(b.x + (mx * d) / cos, b.y + (my * d) / cos));
  }
  return fuera;
}

/* ---------- Entorno procedural para los reflejos ---------- */
function entorno(renderer) {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 256;
  const g = c.getContext("2d");
  const cielo = g.createLinearGradient(0, 0, 0, 256);
  cielo.addColorStop(0, "#ffffff");
  cielo.addColorStop(0.42, "#cfe6f2");
  cielo.addColorStop(0.52, "#4d6c80");
  cielo.addColorStop(0.66, "#12303f");
  cielo.addColorStop(1, "#08161f");
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
function matEscudo(env) {
  return new THREE.MeshPhysicalMaterial({
    color: 0x1594bb, metalness: 0.55, roughness: 0.14,
    clearcoat: 1, clearcoatRoughness: 0.05,
    envMap: env, envMapIntensity: 1.35,
  });
}

function matGota(env, alto) {
  if (alto) {
    return new THREE.MeshPhysicalMaterial({
      color: 0x3fd0ea, metalness: 0, roughness: 0.05,
      transmission: 0.88, thickness: 0.6, ior: 1.36,
      attenuationColor: AGUA, attenuationDistance: 0.6,
      clearcoat: 1, clearcoatRoughness: 0.04,
      envMap: env, envMapIntensity: 1.7,
      side: THREE.DoubleSide, transparent: true, opacity: 0.96,
    });
  }
  // Equipos modestos: reflejo y transparencia, sin refracción
  return new THREE.MeshPhysicalMaterial({
    color: 0x4fd3ea, metalness: 0, roughness: 0.1,
    transparent: true, opacity: 0.72,
    clearcoat: 1, clearcoatRoughness: 0.05,
    envMap: env, envMapIntensity: 1.3,
    side: THREE.DoubleSide,
  });
}

/* ---------- Pieza completa ---------- */
function construyeLogo(env, alto) {
  const grupo = new THREE.Group();

  const fuera = contornoEscudo();
  const forma = new THREE.Shape(fuera);
  forma.holes.push(new THREE.Path(haciaDentro(fuera, GROSOR / 32)));

  const gEscudo = new THREE.ExtrudeGeometry(forma, {
    depth: 0.12,
    bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02,
    bevelSegments: alto ? 3 : 1,
    curveSegments: alto ? 8 : 4,
  });
  gEscudo.center();   // la extrusión crece hacia +Z; así queda repartida a los dos lados
  const escudo = new THREE.Mesh(gEscudo, matEscudo(env));
  grupo.add(escudo);

  // La gota sale de revolucionar su propio perfil, así que ya nace centrada
  // en el eje y a la altura que le toca dentro del marco. Solo se achata en
  // profundidad para que no atraviese el escudo de lado a lado.
  const gGota = new THREE.LatheGeometry(perfilGota(), alto ? 64 : 32);
  const gota = new THREE.Mesh(gGota, matGota(env, alto));
  gota.scale.z = 0.58;
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

  escena.add(new THREE.AmbientLight(0xffffff, 0.4));
  const key = new THREE.DirectionalLight(0xffffff, 1.7);
  key.position.set(3, 6, 7);
  escena.add(key);
  const rim = new THREE.DirectionalLight(0x9fe6f7, 1.2);
  rim.position.set(-5, 2, -4);
  escena.add(rim);

  const pieza = construyeLogo(env, calidadAlta);

  /* Encuadre sobre los vértices reales: la pieza gira sobre su eje Y, así que
     cada vértice puede acercarse a la cámara hasta rho = hypot(x,z). Se exige
     que quepa en su peor posición y se toma la distancia más exigente. */
  pieza.updateMatrixWorld(true);
  const caja = new THREE.Box3().setFromObject(pieza);
  const centroY = (caja.min.y + caja.max.y) / 2;

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
      const necesario = (Math.abs(p.y - centroY) * MARGEN) / TAN + rho;
      if (necesario > expY) expY = necesario;
    }
  });
  pieza.position.y = -centroY;

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
