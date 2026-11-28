/* Start in Dubai : comportements propres aux pages du site (le formulaire et le compte à rebours sont dans app.js). */
(() => {
  "use strict";
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Langue : on va sur la même page dans l'autre langue et on mémorise le choix
  $$("[data-lang-nav]").forEach((sel) => sel.addEventListener("change", () => {
    const o = sel.selectedOptions[0];
    try { localStorage.setItem("sid_lang", JSON.stringify(o.dataset.l)); } catch { /* navigation privée */ }
    location.href = o.value;
  }));

  // Menu mobile
  const nav = document.querySelector("[data-nav]"), burger = document.querySelector("[data-burger]");
  if (nav && burger) burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
  });
  $$("[data-nav] .nav-links a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("is-open")));

  // Bloc « on s'en occupe » : placé avant le 3e intertitre du guide (avant le 2e s'il y en a peu)
  const mid = document.querySelector("[data-mid]"), prose = document.querySelector(".prose");
  if (mid && prose) {
    const h2 = $$(":scope > h2", prose);
    const at = h2[h2.length >= 5 ? 2 : 1];
    if (at) { at.before(mid); mid.hidden = false; }
  }

  // Apparition douce des blocs au défilement
  const rv = $$(".rv");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    rv.forEach((el) => io.observe(el));
  } else rv.forEach((el) => el.classList.add("in"));

  // Assistant en bas à droite (bot.js) : chargé après la page, pour ne rien retarder à l'affichage
  const loadBot = () => {
    if (document.querySelector("script[data-bot]")) return;
    ["/assets/consent.js?v=2", "/assets/bot.js?v=3", "/assets/newsletter.js?v=3"].forEach((src) => {
      const s = document.createElement("script"); s.src = src; s.async = true; s.dataset.bot = "";
      document.body.append(s);
    });
  };
  if (document.readyState === "complete") setTimeout(loadBot, 1200);
  else addEventListener("load", () => setTimeout(loadBot, 1200), { once: true });
})();
