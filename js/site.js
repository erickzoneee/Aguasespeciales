/* =========================================================
   AGUAS ESPECIALES — Comportamiento común a todas las páginas
   (tema, navegación, progreso de scroll, reveal, toast)
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
  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Tema claro / oscuro ----------
     El tema inicial ya lo aplica un script en <head> para evitar el parpadeo;
     aquí solo se conecta el botón. */
  const html = document.documentElement;
  if (!html.getAttribute("data-theme")) {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    html.setAttribute("data-theme", safeGet("ae-theme") || (prefersDark ? "dark" : "light"));
  }
  $$(".theme-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
      safeSet("ae-theme", next);
    });
  });

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
  if (backTop) {
    backTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" })
    );
  }

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

  /* ---------- Reveal on scroll ----------
     Se expone para que el contenido generado por JS también pueda animarse. */
  let revealObserver = null;
  if ("IntersectionObserver" in window && !prefersReduced) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); revealObserver.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  }
  const observeReveals = (root = document) => {
    const els = $$("[data-reveal]", root).filter((el) => !el.classList.contains("is-in"));
    if (revealObserver) els.forEach((el) => revealObserver.observe(el));
    else els.forEach((el) => el.classList.add("is-in"));
  };
  observeReveals();

  /* ---------- Nav activa según sección (solo anclas de la misma página) ---------- */
  const sections = $$("main section[id]");
  const navAnchors = $$('#navLinks a[href^="#"]');
  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
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

  /* ---------- Toast ---------- */
  let toastTimer;
  const toast = (msg) => {
    const t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-visible"), 3600);
  };

  /* ---------- API interna para el resto de scripts ---------- */
  window.AE = { $, $$, prefersReduced, toast, observeReveals };
})();
