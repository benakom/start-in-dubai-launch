/* Start in Dubai : formulaire de demande d'accompagnement, une question à la fois. Réglages dans config.js. */
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

  /* ---------------------------------------------------------------- langue */
  // Textes du formulaire dans la langue de la page (window.SID_I18N, écrit par tools/i18n.py). Le CRM reçoit toujours le français.
  const LANG = document.documentElement.lang || "fr";
  const I18N = window.SID_I18N || {};
  const tr = (k, vars) => { let x = I18N[k] != null ? I18N[k] : k; for (const [a, b] of Object.entries(vars || {})) x = x.split("{" + a + "}").join(b); return x; };

  /* ---------------------------------------------------------------- pays et numéros mobiles */
  // [indicatif, longueurs possibles du numéro mobile national (sans le 0 initial), début d'un numéro mobile, exemple]
  const PHONE = {
    MA: ["+212", [9], /^[67]/, "6 12 34 56 78"], FR: ["+33", [9], /^[67]/, "6 12 34 56 78"], BE: ["+32", [9], /^4/, "470 12 34 56"],
    NL: ["+31", [9], /^6/, "6 12345678"], ES: ["+34", [9], /^[67]/, "612 34 56 78"], IT: ["+39", [9, 10], /^3/, "312 345 6789"],
    DE: ["+49", [10, 11], /^1[5-7]/, "151 23456789"], GB: ["+44", [10], /^7/, "7400 123456"], CH: ["+41", [9], /^7/, "78 123 45 67"],
    LU: ["+352", [9], /^6/, "621 123 456"], CA: ["+1", [10], /^[2-9]/, "514 555 0123"], US: ["+1", [10], /^[2-9]/, "212 555 0123"],
    AE: ["+971", [9], /^5/, "50 123 4567"], SA: ["+966", [9], /^5/, "50 123 4567"], QA: ["+974", [8], /^[3567]/, "3312 3456"],
    DZ: ["+213", [9], /^[567]/, "551 23 45 67"], TN: ["+216", [8], /^[2459]/, "20 123 456"], SN: ["+221", [9], /^7/, "77 123 45 67"],
    CI: ["+225", [10], /^0[157]/, "07 12 34 56 78"],
  };
  const TZ_ISO = { "Africa/Casablanca": "MA", "Africa/El_Aaiun": "MA", "Europe/Paris": "FR", "Europe/Brussels": "BE", "Europe/Amsterdam": "NL",
    "Europe/Madrid": "ES", "Atlantic/Canary": "ES", "Africa/Ceuta": "ES", "Europe/Rome": "IT", "Europe/Berlin": "DE", "Europe/London": "GB",
    "Europe/Zurich": "CH", "Europe/Luxembourg": "LU", "Asia/Dubai": "AE", "Asia/Riyadh": "SA", "Asia/Qatar": "QA", "Africa/Algiers": "DZ",
    "Africa/Tunis": "TN", "Africa/Dakar": "SN", "Africa/Abidjan": "CI" };
  const guessIso = () => {
    let tz = ""; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch { /* */ }
    if (TZ_ISO[tz]) return TZ_ISO[tz];
    if (/^America\/(Toronto|Montreal|Vancouver|Edmonton|Winnipeg|Halifax|Regina|St_Johns|Moncton)/.test(tz)) return "CA";
    if (/^America\//.test(tz)) return "US";
    return { nl: "NL", es: "ES", it: "IT", ar: "AE", en: "GB" }[LANG] || "MA";
  };
  const regionName = (iso, lang) => { try { return new Intl.DisplayNames([lang], { type: "region" }).of(iso); } catch { return iso; } };
  const flag = (iso) => iso.replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
  /** Vérifie le numéro pour le pays choisi. Renvoie { ok, phone, err }. */
  function checkPhone(iso, raw) {
    const v = (raw || "").trim();
    if (iso === "OTHER") {
      const d = v.replace(/\D/g, "");
      return v.startsWith("+") && d.length >= 8 && d.length <= 15 ? { ok: true, phone: "+" + d } : { ok: false, err: tr("err_phone_other") };
    }
    const [dial, lens, start, ex] = PHONE[iso];
    let d = v.replace(/\D/g, "");
    if (v.startsWith("+") || v.startsWith("00")) {            // indicatif retapé dans le champ
      d = d.replace(/^00/, "");
      if (d.startsWith(dial.slice(1))) d = d.slice(dial.length - 1);
    }
    if (iso !== "CI" && d.startsWith("0")) d = d.slice(1);   // 06…, 07…, 015… : le 0 national ne s'écrit pas après l'indicatif
    const n = lens.length > 1 ? lens[0] + "–" + lens[lens.length - 1] : String(lens[0]);
    if (!lens.includes(d.length)) return { ok: false, err: tr("err_phone_len", { dial, n, ex: dial + " " + ex }) };
    if (!start.test(d)) return { ok: false, err: tr("err_phone_start", { ex: dial + " " + ex }) };
    return { ok: true, phone: dial + " " + d };
  }

  // Profil déduit du projet, ou choisi sur une carte « Vous êtes… » de la page (on ne repose alors pas la question).
  const PROFILE_LABEL = { investir: "Investisseur", societe: "Entrepreneur", famille: "Famille", etudes: "Étudiant / parents" };   // CRM (français)
  const NEED_PROFILE = { business: "societe", immobilier: "investir", portefeuille: "investir", residence: "investir", famille: "famille", etudes: "etudes" };
  const PRESET_NEEDS = { investir: ["immobilier", "residence"], societe: ["business"], famille: ["famille"], etudes: ["etudes"] };
  // libellés envoyés au CRM : toujours en français, quelle que soit la langue de la page
  const FR = { business: "Créer ou développer mon business", immobilier: "Acheter un bien immobilier", portefeuille: "Faire louer et gérer mon bien",
    residence: "Visa, résidence, Golden Visa", famille: "Installer ma famille (logement, santé, démarches)",
    etudes: "Études supérieures de mon fils ou ma fille : université, visa, logement", banque: "Ouvrir un compte bancaire",
    hz_1: "Dans les 3 prochains mois", hz_2: "Dans 3 à 6 mois", hz_3: "Dans 6 à 12 mois", hz_4: "Je me renseigne pour plus tard" };
  const STEPS = [
    { id: "needs", type: "multi", q: tr("q_needs"), help: tr("h_needs"),
      options: ["business", "immobilier", "portefeuille", "residence", "famille", "etudes", "banque"].map((v) => ({ v, l: tr("o_" + v) })) },
    { id: "horizon", type: "single", q: tr("q_horizon"), options: ["hz_1", "hz_2", "hz_3", "hz_4"].map((v) => ({ v, l: tr(v) })) },
    { id: "firstName", type: "text", q: tr("q_first"), ph: tr("ph_first"), ac: "given-name", max: 60 },
    { id: "phone", type: "tel", q: [tr("q_phone_name"), tr("q_phone")], help: tr("h_phone"), ac: "tel-national", max: 30 },
    { id: "email", type: "email", final: true, q: [tr("q_email_name"), tr("q_email")], help: tr("h_email"), ph: tr("ph_email"), ac: "email", max: 120 },
  ];
  const NEEDS_I = STEPS.findIndex((s) => s.id === "needs");

  const data = { needs: [], horizon: "", firstName: "", phone: "", email: "", message: "", iso: guessIso() };
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
        if (s.type === "tel") {   // pays (drapeau + indicatif) devant le numéro
          f.classList.add("tel");
          const cc = el("label", "cc"); const shown = el("span", "cc-show");
          const sel = el("select"); sel.setAttribute("aria-label", tr("lbl_country"));
          const isos = Object.keys(PHONE).sort((a, b) => (a === data.iso ? -1 : b === data.iso ? 1 : 0) || regionName(a, LANG).localeCompare(regionName(b, LANG), LANG));
          isos.forEach((iso) => { const o = el("option", "", flag(iso) + " " + regionName(iso, LANG) + " (" + PHONE[iso][0] + ")"); o.value = iso; sel.append(o); });
          const oo = el("option", "", "🌐 " + tr("other_country")); oo.value = "OTHER"; sel.append(oo);
          const sync = () => {
            const iso = sel.value; data.iso = iso;
            shown.textContent = iso === "OTHER" ? "🌐 +" : flag(iso) + " " + PHONE[iso][0];
            inp.placeholder = iso === "OTHER" ? tr("ph_other") : PHONE[iso][3];
            hideErr();
          };
          sel.value = data.iso; sel.addEventListener("change", () => { sync(); inp.focus(); });
          cc.append(shown, sel); f.append(cc); sync();
        }
        f.append(inp); inner.append(f);
        if (s.final) { // dernière question : mention de recontact (envoyer = accepter) + piège à robots
          const note = el("p", "consent-note", tr("consent") + " ");
          const priv = el("button", "link", tr("privacy")); priv.type = "button";
          priv.addEventListener("click", () => $("#privacy").showModal());
          note.append(priv); inner.append(note);
          honeypot = el("input"); honeypot.type = "text"; honeypot.name = "website"; honeypot.tabIndex = -1; honeypot.autocomplete = "off";
          honeypot.setAttribute("aria-hidden", "true"); honeypot.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;opacity:0";
          inner.append(honeypot);
        }
      }

      const act = el("div", "actions");
      const ok = el("button", "ok", s.final ? tr("send") : tr("ok")); ok.type = "button";
      if (!s.final) ok.insertAdjacentHTML("beforeend", CHECK.replace('class="check" ', 'width="18" height="18" '));
      ok.addEventListener("click", () => (s.final ? submit() : next()));
      const hint = el("span", "hint"); hint.innerHTML = tr("hint_enter");
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
      <h2 class="q">${tr("thanks_1")}<span data-thanks-name></span>. <em>${tr("thanks_2")}</em></h2>
      <p class="q-help">${tr("thanks_text")}</p>
      <div class="actions">
        <button type="button" class="ok" data-share>${tr("share")}</button>
        <button type="button" class="ok ghost" data-close-form>${tr("close")}</button>
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
    if (old && old !== nw) { clearVerify(old); old.classList.remove("is-on"); old.classList.toggle("is-up", fwd); }
    nw.style.transition = "none"; nw.classList.toggle("is-up", !fwd && !instant); void nw.offsetWidth; nw.style.transition = "";
    nw.classList.remove("is-up"); nw.classList.add("is-on");
    idx = n;
    const s = STEPS[n], F = flow(), pos = F.indexOf(n);
    if (s) {
      $(".q", nw).textContent = qText(s);
      $(".q-num span", nw).textContent = pos + 1;
      // profil choisi sur la page : on le confirme au lieu de reposer la question
      if (pos === 0 && preset) $(".q-help", nw).textContent = tr("noted", { profile: tr("p_" + preset) });
      else $(".q-help", nw).textContent = s.help || "";
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
      case "single": if (!v) return err(tr("err_choose")), false; break;
      case "multi": if (!data.needs.length) return err(tr("err_multi")), false; break;
      case "text": if (v.length < 2) return err(tr("err_first")), false; break;
      case "tel": { const r = checkPhone(data.iso, v); if (!r.ok) return err(r.err), false; data.phoneIntl = r.phone; break; }
      case "email": if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return err(tr("err_email")), false; break;
    }
    return true;
  }

  /* ---------------------------------------------------------------- vérification de l'e-mail (code à 6 chiffres) */
  const getVerify = () => window.sidVerify ? Promise.resolve(window.sidVerify) : (window.__sidVerifyP ||= new Promise((res, rej) => {
    const sc = document.createElement("script"); sc.src = "/assets/verify.js?v=3"; sc.onload = () => res(window.sidVerify); sc.onerror = rej; document.head.append(sc);
  }));
  function clearVerify(step) { if (!step) return; step.classList.remove("verifying"); $(".sv-host", step)?.remove(); }
  async function startVerify(email) {
    const step = els[idx], inner = $(".step-in", step);
    clearVerify(step);
    const host = el("div", "sv-host"); inner.append(host);
    step.classList.add("verifying");
    try {
      const v = await getVerify();
      v.mount(host, { email, lang: LANG, theme: "light",
        onVerified: (proof) => { clearVerify(step); if (data.payload) sendBrevo({ ...data.payload, email, emailProof: proof }); finish(); },
        onSkip: () => { clearVerify(step); finish(); },
        onBack: () => { clearVerify(step); $("input[name=email]", step)?.focus(); } });
    } catch { clearVerify(step); err(tr("err_send")); }
  }

  /* ---------------------------------------------------------------- envoi */
  // Ligne de la table « leads » de Cevitas : Cevitas la pousse ensuite dans Oleadoo (canal = source, tag en tête des notes).
  function crmRow(p) {
    const crm = C.crm || {};
    const tag = crm.tag || "Start in Dubai";
    const notes = [
      `Tag : ${tag}`,
      "Demande d'accompagnement (site startindubai.com)",
      p.emailVerified ? "E-mail vérifié par code" : "E-mail non vérifié au moment de la demande (code envoyé ensuite)",
      p.country ? `Pays : ${p.country}` : null,
      p.siteLang && p.siteLang !== "fr" ? `Langue du site : ${p.siteLang}` : null,
      p.horizon ? `Horizon : ${p.horizon}` : null,
      p.message ? `Message : ${p.message}` : null,
    ].filter(Boolean).join(" · ");
    return {
      name: p.firstName, email: p.email, phone: p.phone,
      interest: [tag, p.profileLabel, p.needsLabels.join(", ")].filter(Boolean).join(" · ").slice(0, 500),
      notes: notes.slice(0, 2000),
      source: crm.source || "start-in-dubai",
      language: p.siteLang || "fr",
      country: p.country || null,
      utm_source: p.utm.utm_source || null, utm_medium: p.utm.utm_medium || null, utm_campaign: p.utm.utm_campaign || null,
      referrer: p.referrer || null, landing_page: p.page, page_path: location.pathname,
      device: matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop",
      user_agent: navigator.userAgent.slice(0, 500),
    };
  }

  async function sendCrm(payload) {
    const crm = C.crm || {};
    if (!crm.supabaseUrl || !crm.publishableKey) { console.warn("[Start in Dubai] crm non configuré dans config.js : inscription non enregistrée.", payload); return false; }
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

  // Copie du lead dans Brevo (relais /api/lead, liste Leads de la langue) : séquence d'e-mails de suivi.
  // Ne bloque jamais l'inscription : Oleadoo reste la destination principale.
  function sendBrevo(p) {
    try {
      fetch("/api/lead", { method: "POST", headers: { "content-type": "application/json" }, keepalive: true,
        body: JSON.stringify({ name: p.firstName, email: p.email, phone: p.phone, lang: p.siteLang, project: [p.profileLabel, (p.needsLabels || []).join(", ")].filter(Boolean).join(" · "),
          when: p.horizon || "", source: p.source || "start-in-dubai", page: location.pathname, proof: p.emailProof || "" }) }).catch(() => {});
    } catch { /* jamais bloquant */ }
  }

  async function send(payload) {
    if (payload.emailProof) sendBrevo(payload);
    const [crm, hook] = await Promise.allSettled([sendCrm(payload), sendWebhook(payload)]);
    if (crm.status === "rejected") console.error("[Start in Dubai] CRM :", crm.reason);
    if (hook.status === "rejected") console.error("[Start in Dubai] webhook :", hook.reason);
    // l'inscription est perdue seulement si aucun des deux envois n'a réussi
    const crmOk = crm.status === "fulfilled" && crm.value === true;
    const hookOk = hook.status === "fulfilled" && (C.leadWebhookUrl || "").trim();
    if (!crmOk && !hookOk) throw new Error("aucun envoi");
  }

  async function submit() {
    if (!validate()) return;
    const ok = $(".ok", els[idx]);
    if (honeypot && honeypot.value) { finish(); return; }
    const mail = data.email.trim().toLowerCase();
    // lead déjà envoyé pour cette adresse : on repasse seulement par le code
    if (data.leadSentFor === mail) { startVerify(mail); return; }
    const q = new URLSearchParams(location.search);
    const { profile, profileLabel } = profileOf();
    const payload = {
      firstName: data.firstName.trim(), phone: data.phoneIntl || data.phone.trim(), email: data.email.trim().toLowerCase(),
      profile, profileLabel, profileFromPage: !!preset,
      needs: data.needs, needsLabels: data.needs.map((n) => FR[n]), siteLang: LANG,
      country: data.iso === "OTHER" ? "Autre pays (" + (data.phoneIntl || "").slice(0, 4) + ")" : regionName(data.iso, "fr"),
      horizon: FR[data.horizon] || data.horizon, message: data.message.trim(), consent: true, emailVerified: false,
      source: (C.crm && C.crm.source) || "start-in-dubai", tag: (C.crm && C.crm.tag) || "Start in Dubai", page: location.href.split("#")[0], referrer: document.referrer || "",
      utm: Object.fromEntries([...q.entries()].filter(([k]) => k.startsWith("utm_"))),
      language: navigator.language || "", launchDate: LAUNCH_ISO, submittedAt: new Date().toISOString(),
    };
    ok.disabled = true; ok.textContent = tr("sending");
    try {
      await send(payload);
      window.gtag?.("event", "generate_lead", { lead_source: "countdown", profile });
      window.fbq?.("track", "Lead");
      store.set("sid_lead_v1", { firstName: payload.firstName, at: payload.submittedAt });
      data.leadSentFor = mail; data.payload = payload;
      // numéro d'abord : la demande est enregistrée ; le code confirme ensuite l'e-mail (séquences Brevo)
      startVerify(mail);
    } catch (e) {
      err(tr("err_send"));
    } finally { ok.disabled = false; ok.textContent = tr("send"); }
  }

  function finish() {
    done = true;
    const n = data.firstName.trim().split(/\s+/)[0];
    $("[data-thanks-name]").textContent = n ? (LANG === "ar" ? "، " : ", ") + n : "";
    show(STEPS.length);
    markDone();
  }
  function markDone() {
    $$("[data-open-form]").forEach((b) => {
      b.classList.add("is-done");
      const t = $(".btn-txt", b);
      if (t) t.textContent = b.classList.contains("topbar-btn") ? tr("done_top") : tr("done_btn");
    });
  }

  async function share() {
    const url = location.href.split(/[?#]/)[0];
    const text = tr("share_text");
    const btn = $("[data-share]");
    if (navigator.share) { try { await navigator.share({ title: "Start in Dubai", text, url }); } catch { /* annulé */ } return; }
    try { await navigator.clipboard.writeText(url); btn.textContent = tr("copied"); } catch { prompt(tr("copy_prompt"), url); }
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
    if (els[idx] && els[idx].classList.contains("verifying")) return;
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
    if (e.target.closest("[data-open-form]") && done) { const n = data.firstName.trim().split(/\s+/)[0]; const t = $("[data-thanks-name]"); if (t) t.textContent = n ? (LANG === "ar" ? "، " : ", ") + n : ""; }
  });

  $("[data-open-privacy]").addEventListener("click", () => $("#privacy").showModal());

  // choix de langue : mémorisé (la page française ne redirige plus ensuite)
  const remember = (l) => { try { localStorage.setItem("sid_lang", l); } catch { /* */ } };
  $$("[data-lang]").forEach((sel) => sel.addEventListener("change", () => {
    remember(sel.value); location.href = (sel.value === "fr" ? "/" : "/" + sel.value + "/") + location.search + location.hash;
  }));
  $$("[data-lang-link]").forEach((a) => a.addEventListener("click", () => remember(a.dataset.langLink)));

  /* ---------------------------------------------------------------- suivi facultatif, seulement après accord (consent.js) */
  function startTracking() {
  if (window.__sidTracking) return;
  window.__sidTracking = true;
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
  }
  window.sidStartTracking = startTracking;
  let consent = null;
  try { consent = localStorage.getItem("sid_consent"); } catch { /* navigation privée */ }
  if (consent === "yes") startTracking();
})();
