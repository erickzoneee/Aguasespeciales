/* =========================================================
   AGUAS ESPECIALES — Interactividad
   ========================================================= */
(function () {
  "use strict";
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Acceso seguro a localStorage (evita que un SecurityError rompa todo el script) */
  const safeGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const safeSet = (k, v) => { try { localStorage.setItem(k, v); } catch { /* almacenamiento no disponible */ } };

  /* ---------- Año en el footer ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Tema claro / oscuro ---------- */
  const html = document.documentElement;
  const themeToggle = $("#themeToggle");
  const stored = safeGet("ae-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  html.setAttribute("data-theme", stored || (prefersDark ? "dark" : "light"));
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
      safeSet("ae-theme", next);
    });
  }

  /* ---------- Barra de progreso + nav sticky + back to top ---------- */
  const progress = $("#scrollProgress");
  const nav = $("#nav");
  const backTop = $("#backTop");
  const onScroll = () => {
    const st = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? (st / h) * 100 : 0) + "%";
    if (nav) nav.classList.toggle("is-stuck", st > 10);
    if (backTop) backTop.classList.toggle("is-visible", st > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (backTop) backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" }));

  /* ---------- Menú móvil ---------- */
  const burger = $("#navBurger");
  const navLinks = $("#navLinks");
  const setMenu = (open, returnFocus) => {
    if (!burger || !navLinks) return;
    navLinks.classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    if (open) {
      const first = $("a", navLinks);
      if (first) first.focus();
    } else if (returnFocus) {
      burger.focus();
    }
  };
  if (burger && navLinks) {
    burger.addEventListener("click", () => setMenu(!navLinks.classList.contains("is-open")));
    $$("a", navLinks).forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("is-open")) setMenu(false, true);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Nav activa según sección ---------- */
  const sections = $$("main section[id]");
  const navAnchors = $$('#navLinks a[href^="#"]');
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = e.target.id;
          navAnchors.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + id));
        }
      });
    }, { threshold: 0.5 });
    sections.forEach((s) => spy.observe(s));
  }

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
    dialisis: {
      tag: "Uso médico crítico",
      title: "Agua ultrapura para hemodiálisis",
      desc: "Agua con estricto control microbiológico y de endotoxinas, con la puntualidad y calidad que la diálisis exige.",
      specs: [
        ["🧪", "Pureza tipo I", "≈ 18.2 MΩ·cm de resistividad"],
        ["🦠", "Control microbiológico", "Baja carga bacteriana y endotoxinas"],
        ["📋", "Trazabilidad", "Respaldo documental por lote"],
      ],
    },
    lab: {
      tag: "Laboratorio y análisis",
      title: "Agua Tipo I y Tipo II",
      desc: "Para técnicas críticas (biología molecular, HPLC) y preparación de reactivos y soluciones de uso general.",
      specs: [
        ["💧", "Agua Tipo I", "Ultrapura, ≈ 18.2 MΩ·cm"],
        ["⚗️", "Agua Tipo II", "Pura, para reactivos y uso general"],
        ["🔬", "Kits y análisis", "Diagnóstico de inicio a fin"],
      ],
    },
    farma: {
      tag: "Industria farmacéutica",
      title: "Agua purificada para procesos",
      desc: "Soluciones hídricas ajustadas a especificaciones químicas y microbiológicas, bajo condiciones controladas.",
      specs: [
        ["🏭", "A tu especificación", "Parámetros a la medida del proceso"],
        ["🛡️", "Inocuidad", "Producción controlada y segura"],
        ["📋", "Cumplimiento", "Normativas internacionales o propias"],
      ],
    },
    cosmetica: {
      tag: "Cosméticos",
      title: "Agua desmineralizada y purificada",
      desc: "Base ideal para formulación cosmética, con baja concentración de iones y calidad constante.",
      specs: [
        ["🧴", "Desmineralizada", "Baja concentración de iones"],
        ["✨", "Calidad constante", "Lote a lote uniforme"],
        ["🧫", "Análisis disponibles", "Fisicoquímicos y microbiológicos"],
      ],
    },
    alimentos: {
      tag: "Alimentos y bebidas",
      title: "Agua purificada e inocua",
      desc: "Agua elaborada bajo condiciones controladas de higiene, calidad y seguridad para uso alimentario.",
      specs: [
        ["🍶", "Inocuidad garantizada", "Higiene y seguridad controladas"],
        ["✅", "A la medida", "Ajustada a tu proceso"],
        ["📦", "Envases", "Presentaciones según necesidad"],
      ],
    },
    industrial: {
      tag: "Industrial",
      title: "Agua desmineralizada y destilada",
      desc: "Para baterías, calderas, enjuagues y procesos industriales que requieren agua libre de minerales.",
      specs: [
        ["⚙️", "Desmineralizada", "Libre de sales minerales"],
        ["🔥", "Destilada", "Para procesos y equipos sensibles"],
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
        <a href="#cotizar" class="btn btn--primary">Cotizar esta solución
          <svg viewBox="0 0 24 24" class="ico"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
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
  renderWater("dialisis");

  /* ---------- Escala de pureza (unidad unificada: resistividad MΩ·cm) ---------- */
  const PURITY = [
    ["Agua Tipo I", "Ultrapura", 100, "18.2 MΩ·cm"],
    ["Agua Tipo II", "Pura", 78, "1–15 MΩ·cm"],
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

  /* ---------- Productos ---------- */
  const PRODUCTS = [
    { cat: "agua", emoji: "💧", badge: "Ultrapura", name: "Agua Tipo I", desc: "Agua de máxima pureza para técnicas críticas de laboratorio e investigación.", tags: ["Biología molecular", "HPLC", "Diálisis"] },
    { cat: "agua", emoji: "⚗️", badge: "Pura", name: "Agua Tipo II", desc: "Agua pura para preparación de reactivos, buffers y uso general de laboratorio.", tags: ["Reactivos", "Buffers", "Uso general"] },
    { cat: "agua", emoji: "🔥", badge: "Destilada", name: "Agua destilada", desc: "Agua tratada por destilación para procesos y equipos que requieren baja mineralización.", tags: ["Equipos", "Enjuagues", "Procesos"] },
    { cat: "agua", emoji: "🧊", badge: "Desmineralizada", name: "Agua desmineralizada", desc: "Libre de sales minerales, ideal para baterías, calderas, cosméticos e industria.", tags: ["Baterías", "Cosméticos", "Industria"] },
    { cat: "reactivos", emoji: "🧪", badge: "Reactivos", name: "Reactivos químicos", desc: "Reactivos para análisis y procesos, con la calidad y trazabilidad que tu operación necesita.", tags: ["Análisis", "Procesos", "Calidad"] },
    { cat: "analisis", emoji: "🔬", badge: "Servicio", name: "Análisis de agua", desc: "Análisis químicos, microbiológicos y fisicoquímicos para diagnosticar y resolver.", tags: ["Químico", "Microbiológico", "Fisicoquímico"] },
    { cat: "analisis", emoji: "🧫", badge: "Kit rápido", name: "Kits de análisis", desc: "Kits rápidos para que diagnostiques parámetros clave por tu cuenta, con respaldo técnico.", tags: ["Rápido", "In situ", "Fácil"] },
    { cat: "insumos", emoji: "🧴", badge: "Insumo", name: "Desinfectantes", desc: "Desinfectantes para mantener condiciones controladas de higiene y seguridad.", tags: ["Higiene", "Sanitización", "Seguridad"] },
    { cat: "insumos", emoji: "📦", badge: "Insumo", name: "Envases", desc: "Envases y presentaciones adecuadas para el transporte y conservación de cada producto.", tags: ["Transporte", "Conservación", "Presentaciones"] },
  ];
  const grid = $("#productGrid");
  const renderProducts = (filter = "all") => {
    if (!grid) return;
    const list = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === filter);
    grid.innerHTML = list.map((p, i) => `
      <article class="product" style="animation-delay:${i * 60}ms">
        <div class="product__top">
          <span class="product__badge">${p.badge}</span>
          <div class="product__emoji" aria-hidden="true">${p.emoji}</div>
          <h3>${p.name}</h3>
          <p class="product__desc">${p.desc}</p>
        </div>
        <div class="product__apps">
          <span>Aplicaciones</span>
          <ul class="product__tags">${p.tags.map((t) => `<li>${t}</li>`).join("")}</ul>
        </div>
      </article>`).join("");
  };
  renderProducts();
  $$("#productFilters .filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$("#productFilters .filter").forEach((b) => { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
      btn.classList.add("is-active"); btn.setAttribute("aria-pressed", "true");
      renderProducts(btn.dataset.filter);
    });
  });

  /* ---------- Carrusel de testimonios ---------- */
  const track = $("#quotesTrack");
  const dotsWrap = $("#quotesDots");
  if (track && dotsWrap) {
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

    const FIELDS = [
      { id: "q-nombre", err: "err-nombre", msg: "Escribe tu nombre." },
      { id: "q-correo", err: "err-correo", msg: "Escribe un correo válido." },
      { id: "q-telefono", err: "err-telefono", msg: "Escribe tu teléfono." },
    ];
    const setError = (f, show) => {
      const el = $("#" + f.id);
      const errEl = $("#" + f.err);
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
        window.location.href = `mailto:ventas@tensos.com?subject=${subject}&body=${body}`;
      } else {
        window.open(`https://wa.me/525553053590?text=${encodeURIComponent(message)}`, "_blank", "noopener");
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

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-visible"), 3600);
  }
})();
