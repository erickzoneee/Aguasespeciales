/* =========================================================
   AGUAS ESPECIALES — Interactividad de la página de inicio
   (lo común a todas las páginas vive en js/site.js)
   ========================================================= */
(function () {
  "use strict";
  const AE = window.AE || {};
  const $ = AE.$ || ((s, ctx = document) => ctx.querySelector(s));
  const $$ = AE.$$ || ((s, ctx = document) => Array.from(ctx.querySelectorAll(s)));
  const prefersReduced = AE.prefersReduced !== undefined
    ? AE.prefersReduced
    : window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const toast = AE.toast || function () {};
  const CATALOG = window.AE_CATALOG || { categories: [], services: [], waters: {} };
  const WA = (CATALOG.contact && CATALOG.contact.whatsapp) || "525558990125";
  const MAIL = (CATALOG.contact && CATALOG.contact.email) || "ventas@aguasespeciales.com.mx";

  /* ---------- Contadores animados ---------- */
  const counters = $$("[data-count]");
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const decimals = (el.dataset.count.split(".")[1] || "").length;
    if (prefersReduced) { el.textContent = target.toFixed(decimals) + suffix; return; }
    const dur = 1400; const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));
  } else counters.forEach(animateCount);

  /* ---------- Canvas de gotas en el hero ---------- */
  const canvas = $("#dropletCanvas");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let w, h, drops, raf;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const rnd = (a, b) => a + Math.random() * (b - a);
    const newDrop = (init) => ({
      x: rnd(0, w), y: init ? rnd(0, h) : -10,
      r: rnd(1, 3.4), s: rnd(0.3, 1.1), o: rnd(0.15, 0.5)
    });
    const resize = () => {
      const r = canvas.parentElement.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * DPR; canvas.height = h * DPR;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.round((w * h) / 26000);
      drops = Array.from({ length: count }, () => newDrop(true));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of drops) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,240,250,${d.o})`;
        ctx.fill();
        d.y += d.s; d.x += Math.sin(d.y / 40) * 0.3;
        if (d.y > h + 10) Object.assign(d, newDrop(false));
      }
      raf = requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener("resize", () => { cancelAnimationFrame(raf); resize(); draw(); });
  }

  /* ---------- Datos: selector de agua ---------- */
  const WATER = {
    lab: {
      tag: "Laboratorio y análisis",
      title: "Agua Tipo I y Tipo II (ASTM D1193)",
      desc: "Para técnicas críticas (biología molecular, HPLC) y preparación de reactivos y soluciones de uso general.",
      href: "productos.html#aguas-laboratorio",
      specs: [
        ["💧", "Tipo I (ASTM)", "Ultrapura, ≈ 18.2 MΩ·cm"],
        ["⚗️", "Tipo II (ASTM)", "Pura, para reactivos y uso general"],
        ["🔬", "Kits y análisis", "Diagnóstico de inicio a fin"],
      ],
    },
    farma: {
      tag: "Industria farmacéutica",
      title: "Agua purificada para procesos",
      desc: "Soluciones hídricas ajustadas a especificaciones químicas y microbiológicas, bajo condiciones controladas.",
      href: "producto-agua-purificada.html",
      specs: [
        ["🏭", "A tu especificación", "Parámetros a la medida del proceso"],
        ["🛡️", "Procesos controlados", "Higiene, limpieza y control de calidad"],
        ["📋", "Referencia", "Parámetros técnicos o especificaciones propias"],
      ],
    },
    cosmetica: {
      tag: "Cosméticos",
      title: "Agua desmineralizada y purificada",
      desc: "Base ideal para formulación cosmética, con baja concentración de iones y calidad constante.",
      href: "producto-agua-desmineralizada.html",
      specs: [
        ["🧴", "Desmineralizada", "Baja concentración de iones"],
        ["✨", "Calidad constante", "Lote a lote uniforme"],
        ["🧫", "Análisis disponibles", "Fisicoquímicos y microbiológicos"],
      ],
    },
    alimentos: {
      tag: "Alimentos y bebidas",
      title: "Agua purificada para uso alimentario",
      desc: "Agua elaborada bajo condiciones controladas de higiene, limpieza y control de calidad.",
      href: "producto-agua-purificada.html",
      specs: [
        ["🍶", "Procesos controlados", "Higiene y limpieza controladas"],
        ["✅", "A la medida", "Ajustada a tu proceso"],
        ["📦", "Envases", "Presentaciones según necesidad"],
      ],
    },
    industrial: {
      tag: "Industrial",
      title: "Agua desmineralizada y acondicionada",
      desc: "Para baterías, calderas, chillers y procesos industriales que requieren agua libre de minerales.",
      href: "producto-agua-desmineralizada.html",
      specs: [
        ["⚙️", "Desmineralizada", "Libre de sales minerales"],
        ["❄️", "Acondicionada", "TENSOS 40 y 38 para sistemas cerrados"],
        ["🚚", "Suministro puntual", "Volumen según demanda"],
      ],
    },
  };

  const selResult = $("#selectorResult");
  const renderWater = (key) => {
    const d = WATER[key];
    if (!d || !selResult) return;
    selResult.innerHTML = `
      <div class="result-card">
        <span class="result-card__tag">${d.tag}</span>
        <h3>${d.title}</h3>
        <p>${d.desc}</p>
        <div class="result-card__actions">
          <a href="#cotizar" class="btn btn--primary">Cotizar esta solución
            <svg viewBox="0 0 24 24" class="ico"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <a href="${d.href}" class="btn btn--ghost">Ver detalle</a>
        </div>
      </div>
      <div class="result-specs">
        ${d.specs.map((s) => `
          <div class="spec">
            <span class="spec__ico" aria-hidden="true">${s[0]}</span>
            <div><strong>${s[1]}</strong><span>${s[2]}</span></div>
          </div>`).join("")}
      </div>`;
  };
  $$(".selector__options .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      $$(".selector__options .chip").forEach((c) => { c.classList.remove("is-active"); c.setAttribute("aria-pressed", "false"); });
      chip.classList.add("is-active"); chip.setAttribute("aria-pressed", "true");
      renderWater(chip.dataset.key);
    });
  });
  if (selResult) renderWater("lab");

  /* ---------- Escala de pureza (unidad unificada: resistividad MΩ·cm) ---------- */
  /* Los tipos son de la clasificación ASTM D1193. ISO 3696 usa Grado 1, 2 y 3,
     que es una clasificación distinta y no equivalente: no se mezclan aquí. */
  const PURITY = [
    ["Agua Tipo I", "Ultrapura · ASTM D1193", 100, "18.2 MΩ·cm"],
    ["Agua Tipo II", "Pura · ASTM D1193", 78, "1–15 MΩ·cm"],
    ["Agua desmineralizada", "Baja en iones", 60, "0.1–1 MΩ·cm"],
    ["Agua destilada", "Uso general", 52, "0.1–1 MΩ·cm"],
  ];
  const purityGrid = $("#purityGrid");
  if (purityGrid) {
    purityGrid.innerHTML = PURITY.map((p) => `
      <div class="purity-row">
        <div class="purity-row__name">${p[0]}<small>${p[1]}</small></div>
        <div class="purity-bar"><div class="purity-bar__fill" data-fill="${p[2]}"></div></div>
        <div class="purity-row__val">${p[3]}</div>
      </div>`).join("");
    const fills = $$(".purity-bar__fill", purityGrid);
    const paint = () => fills.forEach((f, i) => setTimeout(() => { f.style.width = f.dataset.fill + "%"; }, prefersReduced ? 0 : i * 140));
    if ("IntersectionObserver" in window) {
      const pio = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { paint(); pio.disconnect(); } });
      }, { threshold: 0.4 });
      pio.observe(purityGrid);
    } else paint();
  }

  /* ---------- Índice de categorías del catálogo ---------- */
  const countItems = (cat) =>
    (cat.items ? cat.items.length : 0) +
    (cat.groups ? cat.groups.reduce((n, g) => n + g.items.length, 0) : 0);

  const grid = $("#productGrid");
  const renderCategories = (filter = "all") => {
    if (!grid) return;
    const list = filter === "all"
      ? CATALOG.categories
      : CATALOG.categories.filter((c) => c.group === filter);
    if (!list.length) {
      grid.innerHTML = `<p class="empty-msg">No hay categorías en este filtro.</p>`;
      return;
    }
    grid.innerHTML = list.map((c, i) => {
      const n = countItems(c);
      return `
      <a class="catcard" href="productos.html#${c.id}" style="animation-delay:${i * 60}ms">
        <span class="catcard__num">${c.num}</span>
        <span class="catcard__emoji" aria-hidden="true">${c.icon}</span>
        <h3>${c.name}</h3>
        <p>${c.lead}</p>
        <span class="catcard__meta">
          ${n} ${n === 1 ? "producto" : "productos"}
          <svg viewBox="0 0 24 24" class="ico"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </span>
      </a>`;
    }).join("");
  };
  renderCategories();
  $$("#productFilters .filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$("#productFilters .filter").forEach((b) => { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
      btn.classList.add("is-active"); btn.setAttribute("aria-pressed", "true");
      renderCategories(btn.dataset.filter);
    });
  });

  /* ---------- Carrusel de testimonios ---------- */
  const track = $("#quotesTrack");
  const dotsWrap = $("#quotesDots");
  const soloUnTestimonio = track && $$(".quote", track).length < 2;
  if (soloUnTestimonio) {
    /* Con un testimonio no hay recorrido posible: las flechas, los puntos y la
       pausa no llevan a ninguna parte, y el autoavance solo desplazaría la
       diapositiva sobre sí misma cada seis segundos. Se ocultan los controles. */
    const caja = track.closest(".quotes");
    const controles = caja && caja.querySelector(".quotes__controls");
    if (controles) controles.style.display = "none";
  } else if (track && dotsWrap) {
    const slides = $$(".quote", track);
    const prevBtn = $("#quotesPrev");
    const nextBtn = $("#quotesNext");
    const pauseBtn = $("#quotesPause");
    let idx = 0, timer = null, userPaused = false, hovering = false;

    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Ir al testimonio " + (i + 1));
      if (i === 0) { b.classList.add("is-active"); b.setAttribute("aria-current", "true"); }
      b.addEventListener("click", () => go(i, true));
      dotsWrap.appendChild(b);
    });
    const dots = $$("button", dotsWrap);

    const go = (n, manual) => {
      idx = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, i) => {
        const on = i === idx;
        d.classList.toggle("is-active", on);
        if (on) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
      });
      if (manual) restart();
    };
    const tick = () => { if (!userPaused && !hovering) go(idx + 1); };
    const start = () => { if (!prefersReduced && !timer) timer = setInterval(tick, 6000); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const restart = () => { stop(); start(); };

    if (prevBtn) prevBtn.addEventListener("click", () => go(idx - 1, true));
    if (nextBtn) nextBtn.addEventListener("click", () => go(idx + 1, true));
    if (pauseBtn) {
      // Sin autoavance (reduced-motion), el botón no aplica
      if (prefersReduced) pauseBtn.style.display = "none";
      pauseBtn.addEventListener("click", () => {
        userPaused = !userPaused;
        pauseBtn.classList.toggle("is-paused", userPaused);
        pauseBtn.setAttribute("aria-pressed", String(userPaused));
        pauseBtn.setAttribute("aria-label", userPaused ? "Reanudar avance automático" : "Pausar avance automático");
      });
    }
    // Pausa al pasar el cursor o al enfocar dentro del carrusel
    const wrap = track.closest(".quotes");
    if (wrap) {
      wrap.addEventListener("mouseenter", () => { hovering = true; });
      wrap.addEventListener("mouseleave", () => { hovering = false; });
      wrap.addEventListener("focusin", () => { hovering = true; });
      wrap.addEventListener("focusout", () => { hovering = false; });
    }
    start();
  }

  /* ---------- Cotizador multi-paso ---------- */
  const form = $("#quoteForm");
  if (form) {
    const steps = $$(".quote__step", form);
    const bar = $("#quoteBar");
    const activeStep = () => steps.find((s) => s.classList.contains("is-active"));
    const showStep = (n, focus) => {
      steps.forEach((s) => s.classList.toggle("is-active", Number(s.dataset.step) === n));
      if (bar) bar.style.width = (n / steps.length) * 100 + "%";
      if (focus !== false) {
        const label = $(`.quote__step[data-step="${n}"] .quote__steplabel`, form);
        if (label) label.focus();
      }
    };
    form.addEventListener("click", (e) => {
      const next = e.target.closest("[data-next]");
      const prev = e.target.closest("[data-prev]");
      if (next) showStep(Number(next.dataset.next));
      if (prev) showStep(Number(prev.dataset.prev));
    });

    /* Preselección desde otra página: productos.html?/producto-*.html envían
       ?interes=Nombre del producto → llega como #cotizar con el dato guardado. */
    try {
      const pending = sessionStorage.getItem("ae-interes");
      if (pending) {
        sessionStorage.removeItem("ae-interes");
        const extra = $("#q-mensaje");
        if (extra) extra.value = "Me interesa: " + pending + (extra.value ? "\n" + extra.value : "");
        const match = $$('input[name="producto"]', form)
          .find((i) => i.value.toLowerCase() === pending.toLowerCase());
        if (match) match.checked = true;
        toast("Añadimos «" + pending + "» a tu solicitud 💧");
      }
    } catch { /* sessionStorage no disponible */ }

    const FIELDS = [
      { id: "q-nombre", err: "err-nombre", msg: "Escribe tu nombre." },
      { id: "q-correo", err: "err-correo", msg: "Escribe un correo válido." },
      { id: "q-telefono", err: "err-telefono", msg: "Escribe tu teléfono." },
    ];
    const setError = (f, show) => {
      const el = $("#" + f.id);
      const errEl = $("#" + f.err);
      if (!el) return;
      el.classList.toggle("is-invalid", show);
      el.setAttribute("aria-invalid", show ? "true" : "false");
      if (errEl) {
        errEl.textContent = show ? f.msg : "";
        errEl.classList.toggle("is-shown", show);
      }
    };
    // Limpia el error al escribir
    FIELDS.forEach((f) => {
      const el = $("#" + f.id);
      if (el) el.addEventListener("input", () => { if (el.classList.contains("is-invalid")) setError(f, false); });
    });

    const validateStep3 = () => {
      let firstInvalid = null;
      FIELDS.forEach((f) => {
        const el = $("#" + f.id);
        if (!el) return;
        const valid = el.value.trim() !== "" && (el.type !== "email" || /.+@.+\..+/.test(el.value));
        setError(f, !valid);
        if (!valid && !firstInvalid) firstInvalid = el;
      });
      if (firstInvalid) firstInvalid.focus();
      return !firstInvalid;
    };

    const buildMessage = () => {
      const fd = new FormData(form);
      const productos = fd.getAll("producto");
      const nombre = [fd.get("nombre"), fd.get("apellidos")].filter(Boolean).join(" ").trim();
      const bloques = [
        ["*Nueva solicitud de cotización — Aguas Especiales*"],
        [
          productos.length ? "🧪 Productos/servicios: " + productos.join(", ") : "",
          fd.get("industria") ? "🏭 Industria: " + fd.get("industria") : "",
          fd.get("volumen") ? "📦 Volumen: " + fd.get("volumen") : "",
          fd.get("mensaje") ? "📝 Detalles: " + fd.get("mensaje") : "",
        ],
        [
          nombre ? "👤 Nombre: " + nombre : "",
          fd.get("correo") ? "✉️ Correo: " + fd.get("correo") : "",
          fd.get("telefono") ? "📞 Teléfono: " + fd.get("telefono") : "",
          fd.get("news") ? "🔔 Desea suscribirse al boletín." : "",
        ],
      ];
      return bloques
        .map((b) => b.filter(Boolean).join("\n"))
        .filter(Boolean)
        .join("\n\n");
    };

    const finalize = (channel) => {
      // Asegura que el paso 3 esté visible para que los errores sean perceptibles
      if (activeStep() !== steps.find((s) => s.dataset.step === "3")) showStep(3, false);
      if (!validateStep3()) { toast("Revisa los campos marcados 🙏"); return; }
      const message = buildMessage();
      if (channel === "mail") {
        const subject = encodeURIComponent("Solicitud de cotización — Aguas Especiales");
        const body = encodeURIComponent(message.replace(/\*/g, ""));
        window.location.href = `mailto:${MAIL}?subject=${subject}&body=${body}`;
      } else {
        window.open(`https://wa.me/${WA}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
        toast("Abriendo WhatsApp con tu cotización 💧");
      }
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // Enter desde un paso anterior: avanza al paso final en vez de enviar incompleto
      const current = activeStep();
      if (current && current.dataset.step !== "3") { showStep(3); return; }
      finalize("whatsapp");
    });

    const mailBtn = $("#sendMail");
    if (mailBtn) mailBtn.addEventListener("click", () => finalize("mail"));
  }
})();
