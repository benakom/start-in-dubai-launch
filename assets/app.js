/* START IN DUBAI : compte à rebours + formulaire une question à la fois. Réglages dans config.js. */
(() => {
  "use strict";
  const C = window.SID_CONFIG || {};
  const LAUNCH_ISO = C.launchDate || "2026-12-15T00:00:00+04:00";
  const LAUNCH = new Date(LAUNCH_ISO).getTime();
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* navigation privée */ } },
  };

  /* ---------------------------------------------------------------- compte à rebours */
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    const left = Math.max(0, LAUNCH - Date.now());
    const s = Math.floor(left / 1000);
    const v = { d: pad(Math.floor(s / 86400)), h: pad(Math.floor((s % 86400) / 3600)), m: pad(Math.floor((s % 3600) / 60)), s: pad(s % 60) };
    $$("[data-cd] [data-u]").forEach((el) => {
      const nv = v[el.dataset.u];
      if (el.textContent === nv) return;
      el.textContent = nv;
      if (!reduce) { el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); }
    });
    document.documentElement.classList.toggle("launched", left === 0);
  }
  tick();
  setTimeout(() => { tick(); setInterval(tick, 1000); }, 1000 - (Date.now() % 1000));

  /* ---------------------------------------------------------------- bouton fixe (mobile) : visible une fois le bouton du haut dépassé */
  const sticky = $("[data-sticky]"), heroCta = $(".hero .btn");
  if (sticky && heroCta && "IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => sticky.classList.toggle("is-on", !e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 }).observe(heroCta);
  }

  /* ---------------------------------------------------------------- questions */
  const COUNTRIES = ["Maroc", "France", "Belgique", "Suisse", "Canada", "Tunisie", "Algérie", "Sénégal",
    "Côte d'Ivoire", "Luxembourg", "Émirats arabes unis", "Autre pays"];
  const DIAL = { "Maroc": "+212", "France": "+33", "Belgique": "+32", "Suisse": "+41", "Canada": "+1", "Tunisie": "+216",
    "Algérie": "+213", "Sénégal": "+221", "Côte d'Ivoire": "+225", "Luxembourg": "+352", "Émirats arabes unis": "+971" };
  const STEPS = [
    { id: "profile", type: "single", q: "Vous êtes…", options: [
      { v: "investir", l: "Investisseur", s: "Immobilier, Golden Visa, résidence" },
      { v: "societe", l: "Entrepreneur", s: "Créer ou développer ma société" },
      { v: "famille", l: "Une famille qui veut s'installer", s: "Visas, logement, écoles" },
      { v: "plusieurs", l: "Un peu de tout", s: "Je ne sais pas encore par où commencer" } ] },
    { id: "needs", type: "multi", q: "Qu'est-ce que vous voulez faire à Dubaï ?", help: "Plusieurs réponses possibles.", options: [
      { v: "business", l: "Créer ou développer mon business" },
      { v: "immobilier", l: "Investir dans l'immobilier" },
      { v: "portefeuille", l: "Gérer mon portefeuille immobilier" },
      { v: "residence", l: "Visa, résidence, Golden Visa" },
      { v: "famille", l: "Logement et écoles pour la famille" },
      { v: "banque", l: "Ouvrir un compte bancaire" } ] },
    { id: "country", type: "single", compact: true, q: "Vous vivez actuellement…", options: COUNTRIES.map((c) => ({ v: c, l: c })) },
    { id: "horizon", type: "single", q: "Quand pensez-vous vous lancer ?", options: [
      "Dans les 3 prochains mois", "Dans 3 à 6 mois", "Dans 6 à 12 mois", "Je me renseigne pour plus tard"].map((h) => ({ v: h, l: h })) },
    { id: "firstName", type: "text", q: "Votre prénom ?", ph: "Tapez votre prénom…", ac: "given-name", max: 60 },
    { id: "phone", type: "tel", q: ["Enchanté, {firstName}. Votre numéro WhatsApp ?", "Votre numéro WhatsApp ?"],
      help: "Nous vous écrirons ici avant l'ouverture.", ph: "+212 6 12 34 56 78", ac: "tel", max: 30 },
    { id: "email", type: "email", q: "Et votre e-mail ?", help: "Pour recevoir l'invitation au lancement.", ph: "nom@exemple.com", ac: "email", max: 120 },
    { id: "message", type: "textarea", optional: true, q: "Un mot sur votre projet ?",
      help: "Facultatif. Ex. : nous sommes 4, je veux ouvrir une société de conseil et inscrire les enfants à la rentrée.", ph: "Écrivez ici…", max: 1500 },
    { id: "consent", type: "consent", q: ["Tout est bon, {firstName} ?", "Tout est bon ?"], help: "Vérifiez vos réponses, puis envoyez." },
  ];
  const LABEL = {}; STEPS.forEach((s) => (s.options || []).forEach((o) => (LABEL[s.id + ":" + o.v] = o.l)));

  const data = { profile: "", needs: [], country: "", horizon: "", firstName: "", phone: "", email: "", message: "", consent: false };
  const tf = $("#tf"), stage = $(".tf-stage", tf), bar = $(".tf-progress span", tf);
  const btnPrev = $("[data-prev]", tf), btnNext = $("[data-next]", tf);
  let els = [], idx = 0, built = false, done = false, opener = null, honeypot;

  const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const CHECK = '<svg class="check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const qText = (s) => {
    const [withName, without] = Array.isArray(s.q) ? s.q : [s.q, s.q];
    const n = data.firstName.trim().split(/\s+/)[0];
    return n ? withName.replace("{firstName}", n) : without;
  };

  function build() {
    STEPS.forEach((s, i) => {
      const sec = el("section", "step"); sec.dataset.i = i;
      const inner = el("div", "step-in"); sec.append(inner);
      const num = el("div", "q-num"); num.innerHTML = `<span>${i + 1}</span>${ARROW}`;
      const h = el("h2", "q"); h.id = "q-" + s.id;
      inner.append(num, h, el("p", "q-help", s.help || ""));

      if (s.type === "single" || s.type === "multi") {
        const box = el("div", "choices" + (s.compact ? " is-compact" : ""));
        box.setAttribute("role", s.type === "single" ? "radiogroup" : "group");
        box.setAttribute("aria-labelledby", h.id);
        s.options.forEach((o, k) => {
          const b = el("button", "choice"); b.type = "button"; b.dataset.v = o.v;
          b.setAttribute("role", s.type === "single" ? "radio" : "checkbox"); b.setAttribute("aria-checked", "false");
          const key = el("span", "key", String.fromCharCode(65 + k));
          const lbl = el("span", "lbl", o.l); if (o.s) lbl.append(el("small", "", o.s));
          b.append(key, lbl); b.insertAdjacentHTML("beforeend", CHECK);
          b.addEventListener("click", () => pick(s, b));
          box.append(b);
        });
        inner.append(box);
      } else if (s.type === "consent") {
        inner.append(el("ul", "recap"));
        const lab = el("label", "consent");
        const cb = el("input"); cb.type = "checkbox"; cb.name = "consent";
        cb.addEventListener("change", () => { data.consent = cb.checked; hideErr(); });
        lab.append(cb, el("span", "", "J'accepte d'être recontacté(e) par START IN DUBAI et son partenaire Cevitas Real Estate au sujet de mon projet, par WhatsApp, téléphone ou e-mail."));
        inner.append(lab);
        honeypot = el("input"); honeypot.type = "text"; honeypot.name = "website"; honeypot.tabIndex = -1; honeypot.autocomplete = "off";
        honeypot.setAttribute("aria-hidden", "true"); honeypot.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;opacity:0";
        inner.append(honeypot);
      } else {
        const f = el("div", "field");
        const inp = s.type === "textarea" ? el("textarea") : el("input");
        if (s.type !== "textarea") inp.type = s.type === "text" ? "text" : s.type;
        inp.name = s.id; inp.placeholder = s.ph || ""; inp.maxLength = s.max || 200;
        if (s.ac) inp.autocomplete = s.ac;
        if (s.type === "tel") inp.inputMode = "tel";
        if (s.type === "email") { inp.inputMode = "email"; inp.autocapitalize = "off"; inp.spellcheck = false; }
        if (s.type === "text") inp.autocapitalize = "words";
        if (s.type === "textarea") inp.rows = 1;
        inp.setAttribute("aria-labelledby", h.id);
        inp.addEventListener("input", () => {
          data[s.id] = inp.value; hideErr();
          if (s.type === "textarea") { inp.style.height = "auto"; inp.style.height = inp.scrollHeight + "px"; }
        });
        f.append(inp); inner.append(f);
      }

      const act = el("div", "actions");
      const ok = el("button", "ok", s.type === "consent" ? "Envoyer" : "OK"); ok.type = "button";
      if (s.type !== "consent") ok.insertAdjacentHTML("beforeend", CHECK.replace('class="check" ', 'width="18" height="18" '));
      ok.addEventListener("click", () => (s.type === "consent" ? submit() : next()));
      const hint = el("span", "hint"); hint.innerHTML = s.type === "textarea" ? "<b>Maj + Entrée</b> pour aller à la ligne" : "appuyez sur <b>Entrée ↵</b>";
      act.append(ok, hint);
      inner.append(act, el("p", "err"));
      inner.lastChild.setAttribute("role", "alert");
      stage.append(sec); els.push(sec);
    });
    els.push(buildThanks());
    built = true;
  }

  function buildThanks() {
    const sec = el("section", "step thanks");
    const inner = el("div", "step-in"); sec.append(inner);
    inner.innerHTML = `
      <h2 class="q">Merci<span data-thanks-name></span>. <em>Vous êtes sur la liste.</em></h2>
      <p class="q-help">Vous serez rappelé(e) en priorité. Nous vous écrirons sur WhatsApp avant l'ouverture du 15 décembre, pour vous présenter l'accompagnement et répondre à vos questions.</p>
      <div class="countdown" data-cd aria-hidden="true">
        <div class="cd-cell"><span class="cd-num" data-u="d">00</span><span class="cd-unit">jours</span></div>
        <div class="cd-cell"><span class="cd-num" data-u="h">00</span><span class="cd-unit">heures</span></div>
        <div class="cd-cell"><span class="cd-num" data-u="m">00</span><span class="cd-unit">minutes</span></div>
        <div class="cd-cell"><span class="cd-num" data-u="s">00</span><span class="cd-unit">secondes</span></div>
      </div>
      <div class="actions">
        <button type="button" class="ok" data-share>Partager avec un proche</button>
        <button type="button" class="ok ghost" data-close-form>Fermer</button>
      </div>`;
    $("[data-share]", inner).addEventListener("click", share);
    $("[data-close-form]", inner).addEventListener("click", close);
    stage.append(sec);
    tick();
    return sec;
  }

  /* ---------------------------------------------------------------- navigation */
  function show(n, instant) {
    const old = els[idx], nw = els[n], fwd = n >= idx;
    if (old && old !== nw) { old.classList.remove("is-on"); old.classList.toggle("is-up", fwd); }
    nw.style.transition = "none"; nw.classList.toggle("is-up", !fwd && !instant); void nw.offsetWidth; nw.style.transition = "";
    nw.classList.remove("is-up"); nw.classList.add("is-on");
    idx = n;
    const s = STEPS[n];
    if (s) {
      $(".q", nw).textContent = qText(s);
      if (s.type === "tel") { const i = $("input", nw); if (!data.phone && DIAL[data.country]) { i.value = data.phone = DIAL[data.country] + " "; } }
      if (s.type === "consent") renderRecap(nw);
    }
    bar.style.width = (done ? 100 : (n / STEPS.length) * 100) + "%";
    btnPrev.disabled = n === 0; btnNext.disabled = n >= STEPS.length - 1;
    tf.classList.toggle("is-done", n >= STEPS.length);
    hideErr();
    setTimeout(() => focusStep(nw, s), instant ? 30 : 380);
  }
  function focusStep(nw, s) {
    if (!nw.classList.contains("is-on")) return;
    const target = s && (s.type === "single" || s.type === "multi")
      ? ($('.choice[aria-checked="true"]', nw) || $(".choice", nw))
      : $("input:not([name=website]), textarea, .ok", nw);
    if (!target) return;
    // sur mobile, ne pas ouvrir le clavier sur une liste de choix
    if (s && (s.type === "single" || s.type === "multi") && matchMedia("(hover: none)").matches) return;
    target.focus({ preventScroll: true });
    if (target.setSelectionRange && target.type !== "email") { const L = target.value.length; try { target.setSelectionRange(L, L); } catch { /* */ } }
  }
  function next() { if (!validate()) return; if (idx < STEPS.length - 1) show(idx + 1); }
  function prev() { if (idx > 0 && idx < STEPS.length) show(idx - 1); }

  function pick(s, b) {
    hideErr();
    if (s.type === "multi") {
      const on = b.getAttribute("aria-checked") !== "true";
      b.setAttribute("aria-checked", String(on));
      data.needs = $$(".choice", b.parentNode).filter((x) => x.getAttribute("aria-checked") === "true").map((x) => x.dataset.v);
      return;
    }
    $$(".choice", b.parentNode).forEach((x) => x.setAttribute("aria-checked", String(x === b)));
    data[s.id] = b.dataset.v;
    if (s.id === "country" && data.phone.trim() && /^\+\d{1,3}\s?$/.test(data.phone)) data.phone = ""; // indicatif seul : on le remplace
    b.classList.remove("blink"); void b.offsetWidth; b.classList.add("blink");
    const at = idx;
    setTimeout(() => { if (idx === at) next(); }, reduce ? 150 : 420);
  }

  /* ---------------------------------------------------------------- validation */
  function err(msg) { const e = $(".err", els[idx]); e.textContent = msg; e.classList.add("show"); }
  function hideErr() { const e = els[idx] && $(".err", els[idx]); if (e) e.classList.remove("show"); }
  function validate() {
    const s = STEPS[idx]; if (!s) return true;
    const v = typeof data[s.id] === "string" ? data[s.id].trim() : data[s.id];
    switch (s.type) {
      case "single": if (!v) return err("Choisissez une réponse."), false; break;
      case "multi": if (!data.needs.length) return err("Choisissez au moins une réponse."), false; break;
      case "text": if (v.length < 2) return err("Indiquez votre prénom."), false; break;
      case "tel": { const d = v.replace(/\D/g, ""); if (d.length < 8 || d.length > 15) return err("Ce numéro semble incomplet. Ajoutez l'indicatif, par exemple +212 6 12 34 56 78."), false; break; }
      case "email": if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return err("Cette adresse e-mail ne semble pas correcte."), false; break;
      case "consent": if (!data.consent) return err("Cochez la case pour que nous puissions vous recontacter."), false; break;
    }
    return true;
  }

  function renderRecap(sec) {
    const ul = $(".recap", sec); ul.textContent = "";
    const rows = [
      ["Profil", LABEL["profile:" + data.profile]],
      ["Projet", data.needs.map((n) => LABEL["needs:" + n]).join(", ")],
      ["Pays", data.country], ["Horizon", data.horizon],
      ["Prénom", data.firstName.trim()], ["WhatsApp", data.phone.trim()], ["E-mail", data.email.trim()],
    ];
    rows.forEach(([k, v]) => { const li = el("li"); li.append(el("span", "", k), el("span", "", v || "—")); ul.append(li); });
  }

  /* ---------------------------------------------------------------- envoi */
  // Ligne de la table « leads » de Cevitas : Cevitas la pousse ensuite dans Oleadoo (canal = source, tag en tête des notes).
  function crmRow(p) {
    const crm = C.crm || {};
    const tag = crm.tag || "Start in Dubai";
    const notes = [
      `Tag : ${tag}`,
      "Avant-première (ouverture le 15/12/2026)",
      p.country ? `Pays : ${p.country}` : null,
      p.horizon ? `Horizon : ${p.horizon}` : null,
      p.message ? `Message : ${p.message}` : null,
    ].filter(Boolean).join(" · ");
    return {
      name: p.firstName, email: p.email, phone: p.phone,
      interest: [tag, p.profileLabel, p.needsLabels.join(", ")].filter(Boolean).join(" · ").slice(0, 500),
      notes: notes.slice(0, 2000),
      source: crm.source || "start-in-dubai",
      language: "fr",
      country: p.country || null,
      utm_source: p.utm.utm_source || null, utm_medium: p.utm.utm_medium || null, utm_campaign: p.utm.utm_campaign || null,
      referrer: p.referrer || null, landing_page: p.page, page_path: location.pathname,
      device: matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop",
      user_agent: navigator.userAgent.slice(0, 500),
    };
  }

  async function sendCrm(payload) {
    const crm = C.crm || {};
    if (!crm.supabaseUrl || !crm.publishableKey) { console.warn("[START IN DUBAI] crm non configuré dans config.js : inscription non enregistrée.", payload); return false; }
    const base = crm.supabaseUrl.replace(/\/$/, "");
    const auth = { apikey: crm.publishableKey, Authorization: "Bearer " + crm.publishableKey, "Content-Type": "application/json" };
    const row = crmRow(payload);
    const r = await fetch(base + "/rest/v1/leads", { method: "POST", headers: { ...auth, Prefer: "return=minimal" }, body: JSON.stringify(row), keepalive: true });
    if (!r.ok) throw new Error("CRM HTTP " + r.status + " " + (await r.text().catch(() => "")));
    if (crm.notifyEmail) { // e-mail à l'équipe : ne bloque jamais l'inscription
      fetch(base + "/functions/v1/send-lead-email", { method: "POST", headers: auth, body: JSON.stringify(row), keepalive: true }).catch(() => {});
    }
    return true;
  }

  async function sendWebhook(payload) {
    const url = (C.leadWebhookUrl || "").trim();
    if (!url) return;
    const body = JSON.stringify(payload);
    let r;
    try {
      r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
    } catch (e) {
      // le webhook n'accepte pas les requêtes d'un autre site (CORS) : on renvoie en requête simple, sans lire la réponse
      await fetch(url, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body, keepalive: true });
      return;
    }
    if (!r.ok) throw new Error("HTTP " + r.status);
  }

  async function send(payload) {
    const [crm, hook] = await Promise.allSettled([sendCrm(payload), sendWebhook(payload)]);
    if (crm.status === "rejected") console.error("[START IN DUBAI] CRM :", crm.reason);
    if (hook.status === "rejected") console.error("[START IN DUBAI] webhook :", hook.reason);
    // l'inscription est perdue seulement si aucun des deux envois n'a réussi
    const crmOk = crm.status === "fulfilled" && crm.value === true;
    const hookOk = hook.status === "fulfilled" && (C.leadWebhookUrl || "").trim();
    if (!crmOk && !hookOk) throw new Error("aucun envoi");
  }

  async function submit() {
    if (!validate()) return;
    const ok = $(".ok", els[idx]);
    if (honeypot && honeypot.value) { finish(); return; }
    const q = new URLSearchParams(location.search);
    const payload = {
      firstName: data.firstName.trim(), phone: data.phone.trim(), email: data.email.trim().toLowerCase(),
      profile: data.profile, profileLabel: LABEL["profile:" + data.profile],
      needs: data.needs, needsLabels: data.needs.map((n) => LABEL["needs:" + n]),
      country: data.country, horizon: data.horizon, message: data.message.trim(), consent: true,
      source: (C.crm && C.crm.source) || "start-in-dubai", tag: (C.crm && C.crm.tag) || "Start in Dubai", page: location.href.split("#")[0], referrer: document.referrer || "",
      utm: Object.fromEntries([...q.entries()].filter(([k]) => k.startsWith("utm_"))),
      language: navigator.language || "", launchDate: LAUNCH_ISO, submittedAt: new Date().toISOString(),
    };
    ok.disabled = true; ok.textContent = "Envoi…";
    try {
      await send(payload);
      window.gtag?.("event", "generate_lead", { lead_source: "countdown", profile: data.profile });
      window.fbq?.("track", "Lead");
      store.set("sid_lead_v1", { firstName: payload.firstName, at: payload.submittedAt });
      finish();
    } catch (e) {
      err("L'envoi n'a pas abouti. Vérifiez votre connexion, puis réessayez.");
    } finally { ok.disabled = false; ok.textContent = "Envoyer"; }
  }

  function finish() {
    done = true;
    const n = data.firstName.trim().split(/\s+/)[0];
    $("[data-thanks-name]").textContent = n ? ", " + n : "";
    show(STEPS.length);
    markDone();
  }
  function markDone() {
    $$("[data-open-form]").forEach((b) => {
      b.classList.add("is-done");
      const t = $(".btn-txt", b);
      if (t) t.textContent = b.classList.contains("topbar-btn") ? "Inscrit ✓" : "Vous êtes sur la liste ✓";
    });
  }

  async function share() {
    const url = location.href.split(/[?#]/)[0];
    const text = "START IN DUBAI ouvre le 15 décembre : investir, entreprendre, s'installer à Dubaï, de A à Z.";
    const btn = $("[data-share]");
    if (navigator.share) { try { await navigator.share({ title: "START IN DUBAI", text, url }); } catch { /* annulé */ } return; }
    try { await navigator.clipboard.writeText(url); btn.textContent = "Lien copié ✓"; } catch { prompt("Copiez le lien :", url); }
  }

  /* ---------------------------------------------------------------- ouverture / fermeture */
  function open(e) {
    opener = e && e.currentTarget;
    if (!built) build();
    tf.hidden = false; document.body.style.overflow = "hidden";
    // carte « Vous êtes… » : le profil est déjà choisi, on commence à la question suivante
    const preset = opener && opener.dataset && opener.dataset.profile;
    if (preset && !done) {
      data.profile = preset;
      $$(".choice", els[0]).forEach((x) => x.setAttribute("aria-checked", String(x.dataset.v === preset)));
      if (idx === 0) idx = 1;
    }
    show(done ? STEPS.length : idx, true);
  }
  function close() {
    tf.hidden = true; document.body.style.overflow = "";
    if (opener) opener.focus({ preventScroll: true });
  }
  $$("[data-open-form]").forEach((b) => b.addEventListener("click", open));
  $$("[data-close-form]").forEach((b) => b.addEventListener("click", close));
  btnPrev.addEventListener("click", prev);
  btnNext.addEventListener("click", next);
  stage.addEventListener("submit", (e) => e.preventDefault());
  // le focus d'un champ hors écran ne doit jamais décaler le formulaire
  [tf, stage].forEach((n) => n.addEventListener("scroll", () => { n.scrollTop = 0; n.scrollLeft = 0; }));

  document.addEventListener("keydown", (e) => {
    if (tf.hidden) return;
    const t = e.target, s = STEPS[idx];
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key === "Enter") {
      if (t.tagName === "TEXTAREA" && e.shiftKey) return;
      if (t.classList && (t.classList.contains("ok") || t.classList.contains("tf-close") || t.closest(".tf-nav") || t.dataset.share != null)) return; // le bouton gère lui-même
      e.preventDefault();
      // Entrée sur un choix : on le sélectionne s'il s'agit d'un choix unique pas encore coché, sinon on passe à la suite
      if (t.classList && t.classList.contains("choice") && s && s.type === "single" && t.getAttribute("aria-checked") !== "true") { t.click(); return; }
      if (!s) return;
      if (t.type === "checkbox" && !t.checked) { t.click(); return; }   // 1re Entrée : coche ; 2e Entrée : envoie
      s.type === "consent" ? submit() : next();
      return;
    }
    if (!s || e.metaKey || e.ctrlKey || e.altKey) return;
    if ((s.type === "single" || s.type === "multi") && /^[a-z]$/i.test(e.key) && !/INPUT|TEXTAREA/.test(t.tagName)) {
      const b = $$(".choice", els[idx])[e.key.toUpperCase().charCodeAt(0) - 65];
      if (b) { e.preventDefault(); b.click(); b.focus({ preventScroll: true }); }
    }
  });

  // retour sur la page après inscription
  const saved = store.get("sid_lead_v1");
  if (saved) { done = true; data.firstName = saved.firstName || ""; markDone(); }
  // ouvre directement le formulaire avec #inscription (lien en bio, story…)
  if (location.hash === "#inscription") open();
  // finit de remplir le nom dans l'écran de remerciement quand on rouvre après une visite précédente
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-open-form]") && done) { const n = data.firstName.trim().split(/\s+/)[0]; const t = $("[data-thanks-name]"); if (t) t.textContent = n ? ", " + n : ""; }
  });

  $("[data-open-privacy]").addEventListener("click", () => $("#privacy").showModal());

  /* ---------------------------------------------------------------- suivi facultatif */
  if (C.ga4Id) {
    const sc = document.createElement("script"); sc.async = true; sc.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(C.ga4Id); document.head.append(sc);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date()); gtag("config", C.ga4Id);
  }
  if (C.metaPixelId) {
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", C.metaPixelId); fbq("track", "PageView");
  }
})();
