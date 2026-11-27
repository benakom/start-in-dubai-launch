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
  // Marocains du monde et francophones de partout : indicatifs des pays où vivent le plus de nos visiteurs.
  const DIAL = { "Maroc": "+212", "France": "+33", "Espagne": "+34", "Italie": "+39", "Belgique": "+32", "Pays-Bas": "+31",
    "Allemagne": "+49", "Royaume-Uni": "+44", "Suisse": "+41", "Canada": "+1", "États-Unis": "+1",
    "Émirats arabes unis": "+971", "Arabie saoudite": "+966", "Qatar": "+974", "Tunisie": "+216", "Algérie": "+213",
    "Sénégal": "+221", "Côte d'Ivoire": "+225", "Luxembourg": "+352" };
  // Pays devinés depuis le fuseau horaire du téléphone : sert à pré-remplir l'indicatif WhatsApp (on ne pose plus la question du pays).
  const TZ_COUNTRY = { "Africa/Casablanca": "Maroc", "Africa/El_Aaiun": "Maroc", "Europe/Paris": "France", "Europe/Madrid": "Espagne",
    "Atlantic/Canary": "Espagne", "Africa/Ceuta": "Espagne", "Europe/Rome": "Italie", "Europe/Brussels": "Belgique", "Europe/Amsterdam": "Pays-Bas",
    "Europe/Berlin": "Allemagne", "Europe/London": "Royaume-Uni", "Europe/Zurich": "Suisse", "Asia/Dubai": "Émirats arabes unis",
    "Asia/Riyadh": "Arabie saoudite", "Asia/Qatar": "Qatar", "Africa/Tunis": "Tunisie", "Africa/Algiers": "Algérie", "Africa/Dakar": "Sénégal",
    "Africa/Abidjan": "Côte d'Ivoire", "Europe/Luxembourg": "Luxembourg" };
  const guessCountry = () => {
    let tz = ""; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch { /* */ }
    if (TZ_COUNTRY[tz]) return TZ_COUNTRY[tz];
    if (/^America\/(Toronto|Montreal|Vancouver|Edmonton|Winnipeg|Halifax|Regina|St_Johns|Moncton)/.test(tz)) return "Canada";
    if (/^America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Detroit|Anchorage|Indiana)/.test(tz)) return "États-Unis";
    return "";
  };
  // Pays de résidence déduit de l'indicatif saisi (le plus long qui correspond).
  const countryFromPhone = (phone) => {
    const d = phone.replace(/[^\d+]/g, "");
    if (!d.startsWith("+")) return guessCountry() || "Non précisé";
    for (const len of [3, 2, 1]) {
      const code = d.slice(0, len + 1);
      if (code === "+1") { const g = guessCountry(); return g === "Canada" || g === "États-Unis" ? g : "Canada / États-Unis"; }
      const hit = Object.keys(DIAL).find((c) => DIAL[c] === code);
      if (hit) return hit;
    }
    return "Autre pays (" + d.slice(0, 4) + ")";
  };
  // Profil déduit du projet, ou choisi sur une carte « Vous êtes… » de la page (on ne repose alors pas la question).
  const PROFILE_LABEL = { investir: "Investisseur", societe: "Entrepreneur", famille: "Famille", etudes: "Étudiant / parents" };
  const NEED_PROFILE = { business: "societe", immobilier: "investir", portefeuille: "investir", residence: "investir", famille: "famille", etudes: "etudes" };
  const PRESET_NEEDS = { investir: ["immobilier", "residence"], societe: ["business"], famille: ["famille"], etudes: ["etudes"] };
  const STEPS = [
    { id: "needs", type: "multi", q: "Votre projet à Dubaï ?", help: "Plusieurs réponses possibles.", options: [
      { v: "business", l: "Créer ou développer mon business" },
      { v: "immobilier", l: "Acheter un bien immobilier" },
      { v: "portefeuille", l: "Faire louer et gérer mon bien" },
      { v: "residence", l: "Visa, résidence, Golden Visa" },
      { v: "famille", l: "Installer ma famille (logement, santé, démarches)" },
      { v: "etudes", l: "Études supérieures de mon fils ou ma fille : université, visa, logement" },
      { v: "banque", l: "Ouvrir un compte bancaire" } ] },
    { id: "horizon", type: "single", q: "Quand voulez-vous vous lancer ?", options: [
      "Dans les 3 prochains mois", "Dans 3 à 6 mois", "Dans 6 à 12 mois", "Je me renseigne pour plus tard"].map((h) => ({ v: h, l: h })) },
    { id: "firstName", type: "text", q: "Votre prénom ?", ph: "Tapez votre prénom…", ac: "given-name", max: 60 },
    { id: "phone", type: "tel", q: ["Enchanté, {firstName}. Votre WhatsApp ?", "Votre WhatsApp ?"],
      help: "Nous vous écrirons ici avant l'ouverture. Vérifiez l'indicatif de votre pays.", ph: "+212 6 12 34 56 78", ac: "tel", max: 30 },
    { id: "email", type: "email", final: true, q: ["Dernière étape, {firstName} : votre e-mail ?", "Dernière étape : votre e-mail ?"],
      help: "Pour recevoir l'invitation au lancement.", ph: "nom@exemple.com", ac: "email", max: 120 },
  ];
  const LABEL = {}; STEPS.forEach((s) => (s.options || []).forEach((o) => (LABEL[s.id + ":" + o.v] = o.l)));
  const NEEDS_I = STEPS.findIndex((s) => s.id === "needs");

  const data = { needs: [], horizon: "", firstName: "", phone: "", email: "", message: "" };
  const tf = $("#tf"), stage = $(".tf-stage", tf), bar = $(".tf-progress span", tf);
  const btnPrev = $("[data-prev]", tf), btnNext = $("[data-next]", tf);
  let els = [], idx = 0, built = false, done = false, opener = null, honeypot, preset = "";
  // questions réellement posées : le projet est sauté quand le visiteur a déjà choisi son profil sur la page
  const flow = () => STEPS.map((_, i) => i).filter((i) => !(i === NEEDS_I && preset));
  const profileOf = () => {
    const cats = preset ? [preset] : [...new Set(data.needs.map((n) => NEED_PROFILE[n]).filter(Boolean))];
    return { profile: cats.length === 1 ? cats[0] : "plusieurs", profileLabel: cats.map((c) => PROFILE_LABEL[c]).join(" + ") || "À préciser" };
  };

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
        if (s.final) { // dernière question : mention de recontact (envoyer = accepter) + piège à robots
          const note = el("p", "consent-note", "En envoyant, vous acceptez d'être recontacté(e) par START IN DUBAI et son partenaire Cevitas Real Estate au sujet de votre projet (WhatsApp, téléphone ou e-mail). ");
          const priv = el("button", "link", "Confidentialité"); priv.type = "button";
          priv.addEventListener("click", () => $("#privacy").showModal());
          note.append(priv); inner.append(note);
          honeypot = el("input"); honeypot.type = "text"; honeypot.name = "website"; honeypot.tabIndex = -1; honeypot.autocomplete = "off";
          honeypot.setAttribute("aria-hidden", "true"); honeypot.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;opacity:0";
          inner.append(honeypot);
        }
      }

      const act = el("div", "actions");
      const ok = el("button", "ok", s.final ? "Envoyer" : "OK"); ok.type = "button";
      if (!s.final) ok.insertAdjacentHTML("beforeend", CHECK.replace('class="check" ', 'width="18" height="18" '));
      ok.addEventListener("click", () => (s.final ? submit() : next()));
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
    const s = STEPS[n], F = flow(), pos = F.indexOf(n);
    if (s) {
      $(".q", nw).textContent = qText(s);
      $(".q-num span", nw).textContent = pos + 1;
      // profil choisi sur la page : on le confirme au lieu de reposer la question
      if (pos === 0 && preset) $(".q-help", nw).textContent = PROFILE_LABEL[preset] + " : c'est noté ✓";
      else $(".q-help", nw).textContent = s.help || "";
      if (s.type === "tel") { const i = $("input", nw), c = guessCountry(); if (!data.phone && DIAL[c]) { i.value = data.phone = DIAL[c] + " "; } }
    }
    bar.style.width = (done ? 100 : (Math.max(pos, 0) / F.length) * 100) + "%";
    btnPrev.disabled = pos <= 0; btnNext.disabled = pos < 0 || pos >= F.length - 1;
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
  function next() { if (!validate()) return; const F = flow(), p = F.indexOf(idx); if (p >= 0 && p < F.length - 1) show(F[p + 1]); }
  function prev() { const F = flow(), p = F.indexOf(idx); if (p > 0) show(F[p - 1]); }

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
    }
    return true;
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
    const { profile, profileLabel } = profileOf();
    const payload = {
      firstName: data.firstName.trim(), phone: data.phone.trim(), email: data.email.trim().toLowerCase(),
      profile, profileLabel, profileFromPage: !!preset,
      needs: data.needs, needsLabels: data.needs.map((n) => LABEL["needs:" + n]),
      country: countryFromPhone(data.phone), horizon: data.horizon, message: data.message.trim(), consent: true,
      source: (C.crm && C.crm.source) || "start-in-dubai", tag: (C.crm && C.crm.tag) || "Start in Dubai", page: location.href.split("#")[0], referrer: document.referrer || "",
      utm: Object.fromEntries([...q.entries()].filter(([k]) => k.startsWith("utm_"))),
      language: navigator.language || "", launchDate: LAUNCH_ISO, submittedAt: new Date().toISOString(),
    };
    ok.disabled = true; ok.textContent = "Envoi…";
    try {
      await send(payload);
      window.gtag?.("event", "generate_lead", { lead_source: "countdown", profile });
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
    // carte « Vous êtes… » : le profil est choisi, on ne repose pas la question du projet
    const p = opener && opener.dataset && opener.dataset.profile;
    let start = idx;
    if (p && PRESET_NEEDS[p] && !done) {
      preset = p; data.needs = [...PRESET_NEEDS[p]];
      $$(".choice", els[NEEDS_I]).forEach((x) => x.setAttribute("aria-checked", String(data.needs.includes(x.dataset.v))));
      if (idx === NEEDS_I) start = flow()[0];   // show() éteint proprement l'écran précédent
    }
    show(done ? STEPS.length : start, true);
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
      s.final ? submit() : next();
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
