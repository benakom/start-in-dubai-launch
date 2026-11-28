/* Start in Dubai : assistant en bas à droite. Deux questions (projet, échéance), un petit formulaire
   (prénom, WhatsApp, e-mail facultatif), puis le lead part dans la table « leads » de Cevitas,
   que crm-dispatch pousse dans Oleadoo (canal « bot-start-in-dubai », tag « Bot Start in Dubai »).
   Chargé par site.js après le chargement de la page : aucun effet sur la vitesse d'affichage. */
(() => {
  "use strict";
  if (window.__sidBot) return;
  window.__sidBot = true;

  const C = window.SID_CONFIG || {};
  const TAG = "Bot Start in Dubai", SOURCE = "bot-start-in-dubai";
  const LANG = (document.documentElement.lang || "fr").slice(0, 2);
  const RTL = document.documentElement.dir === "rtl";

  const T = {
    fr: { open: "Ouvrir l'assistant Start in Dubai", close: "Fermer", teaser: "Un projet à Dubaï ? Parlons-en 👋", sub: "Assistant · l'équipe vous recontacte",
      hello: "Bonjour 👋 Je suis l'assistant Start in Dubai.", q1: "Quel est votre projet à Dubaï ?",
      p: ["Créer ma société", "Visa et résidence", "M'installer en famille", "Études", "Compte bancaire", "Autre projet"],
      q2: "C'est pour quand ?", w: ["Dans le mois", "D'ici 3 mois", "Dans 3 à 6 mois", "Je me renseigne"],
      q3: "Parfait. Laissez vos coordonnées : un conseiller de l'équipe vous contacte.",
      name: "Prénom", phone: "WhatsApp ou téléphone, avec l'indicatif", php: "+33 6 12 34 56 78", email: "E-mail (facultatif)", send: "Être contacté",
      consent: "En envoyant, vous acceptez d'être recontacté au sujet de votre projet.", privacy: "Confidentialité",
      eName: "Indiquez votre prénom.", ePhone: "Indiquez le numéro avec l'indicatif du pays, par exemple +33 6 12 34 56 78.", eEmail: "Cette adresse e-mail n'est pas valide.", eSend: "L'envoi n'a pas abouti. Réessayez dans un instant.",
      sending: "Envoi…", done: "Merci {n} ! C'est bien reçu. Un membre de l'équipe Start in Dubai va vous contacter très prochainement, sur WhatsApp ou par téléphone.",
      again: "Votre demande est bien enregistrée : l'équipe Start in Dubai va vous contacter.", restart: "Nouvelle demande", news: "Recevoir aussi nos guides par e-mail (facultatif)" },
    en: { open: "Open the Start in Dubai assistant", close: "Close", teaser: "A project in Dubai? Let's talk 👋", sub: "Assistant · our team gets back to you",
      hello: "Hello 👋 I'm the Start in Dubai assistant.", q1: "What is your Dubai project?",
      p: ["Set up my company", "Visa and residency", "Move with my family", "Studies", "Bank account", "Something else"],
      q2: "When are you planning it?", w: ["Within a month", "Within 3 months", "In 3 to 6 months", "Just exploring"],
      q3: "Great. Leave your details and an adviser from our team will contact you.",
      name: "First name", phone: "WhatsApp or phone, with country code", php: "+44 7700 900123", email: "Email (optional)", send: "Get contacted",
      consent: "By sending, you agree to be contacted about your project.", privacy: "Privacy",
      eName: "Please enter your first name.", ePhone: "Please enter the number with its country code, e.g. +44 7700 900123.", eEmail: "This email address is not valid.", eSend: "Sending failed. Please try again in a moment.",
      sending: "Sending…", done: "Thank you {n}! We've got it. A member of the Start in Dubai team will contact you very soon, on WhatsApp or by phone.",
      again: "Your request is registered: the Start in Dubai team will contact you.", restart: "New request", news: "Also receive our guides by email (optional)" },
    ar: { open: "فتح مساعد Start in Dubai", close: "إغلاق", teaser: "لديك مشروع في دبي؟ لنتحدث 👋", sub: "المساعد · فريقنا يتواصل معك",
      hello: "مرحبًا 👋 أنا مساعد Start in Dubai.", q1: "ما هو مشروعك في دبي؟",
      p: ["تأسيس شركتي", "التأشيرة والإقامة", "الانتقال مع عائلتي", "الدراسة", "حساب بنكي", "مشروع آخر"],
      q2: "متى تخطط لذلك؟", w: ["خلال شهر", "خلال 3 أشهر", "بعد 3 إلى 6 أشهر", "أجمع المعلومات فقط"],
      q3: "ممتاز. اترك بياناتك وسيتواصل معك أحد مستشاري فريقنا.",
      name: "الاسم الأول", phone: "واتساب أو هاتف، مع رمز الدولة", php: "+971 50 123 4567", email: "البريد الإلكتروني (اختياري)", send: "تواصلوا معي",
      consent: "بالإرسال، توافق على أن نتواصل معك بشأن مشروعك.", privacy: "الخصوصية",
      eName: "يرجى كتابة اسمك الأول.", ePhone: "يرجى كتابة الرقم مع رمز الدولة، مثل ‎+971 50 123 4567.", eEmail: "عنوان البريد الإلكتروني غير صالح.", eSend: "تعذّر الإرسال. حاول مرة أخرى بعد قليل.",
      sending: "جارٍ الإرسال…", done: "شكرًا {n}! وصلنا طلبك. سيتواصل معك أحد أعضاء فريق Start in Dubai قريبًا جدًا عبر واتساب أو الهاتف.",
      again: "تم تسجيل طلبك: سيتواصل معك فريق Start in Dubai.", restart: "طلب جديد", news: "أرغب أيضًا في تلقي أدلتكم عبر البريد الإلكتروني (اختياري)" },
    es: { open: "Abrir el asistente de Start in Dubai", close: "Cerrar", teaser: "¿Un proyecto en Dubái? Hablemos 👋", sub: "Asistente · nuestro equipo le contacta",
      hello: "Hola 👋 Soy el asistente de Start in Dubai.", q1: "¿Cuál es su proyecto en Dubái?",
      p: ["Crear mi empresa", "Visado y residencia", "Mudarme con mi familia", "Estudios", "Cuenta bancaria", "Otro proyecto"],
      q2: "¿Para cuándo?", w: ["En el próximo mes", "En los próximos 3 meses", "En 3 a 6 meses", "Solo me informo"],
      q3: "Perfecto. Déjenos sus datos y un asesor del equipo le contactará.",
      name: "Nombre", phone: "WhatsApp o teléfono, con prefijo", php: "+34 612 34 56 78", email: "Email (opcional)", send: "Quiero que me contacten",
      consent: "Al enviar, acepta que le contactemos sobre su proyecto.", privacy: "Privacidad",
      eName: "Indique su nombre.", ePhone: "Indique el número con el prefijo del país, por ejemplo +34 612 34 56 78.", eEmail: "Este email no es válido.", eSend: "No se pudo enviar. Inténtelo de nuevo en un momento.",
      sending: "Enviando…", done: "¡Gracias, {n}! Lo hemos recibido. Un miembro del equipo Start in Dubai le contactará muy pronto por WhatsApp o por teléfono.",
      again: "Su solicitud está registrada: el equipo Start in Dubai le contactará.", restart: "Nueva solicitud", news: "Recibir también nuestras guías por email (opcional)" },
    nl: { open: "De assistent van Start in Dubai openen", close: "Sluiten", teaser: "Een project in Dubai? Laten we praten 👋", sub: "Assistent · ons team neemt contact op",
      hello: "Hallo 👋 Ik ben de assistent van Start in Dubai.", q1: "Wat is uw project in Dubai?",
      p: ["Mijn bedrijf oprichten", "Visum en verblijf", "Verhuizen met mijn gezin", "Studeren", "Bankrekening", "Iets anders"],
      q2: "Wanneer wilt u starten?", w: ["Binnen een maand", "Binnen 3 maanden", "Over 3 tot 6 maanden", "Ik oriënteer me"],
      q3: "Prima. Laat uw gegevens achter, dan neemt een adviseur van ons team contact met u op.",
      name: "Voornaam", phone: "WhatsApp of telefoon, met landcode", php: "+31 6 12345678", email: "E-mail (optioneel)", send: "Neem contact met mij op",
      consent: "Door te verzenden gaat u ermee akkoord dat wij contact met u opnemen over uw project.", privacy: "Privacy",
      eName: "Vul uw voornaam in.", ePhone: "Vul het nummer in met de landcode, bijvoorbeeld +31 6 12345678.", eEmail: "Dit e-mailadres is ongeldig.", eSend: "Verzenden is mislukt. Probeer het zo opnieuw.",
      sending: "Verzenden…", done: "Bedankt, {n}! We hebben het ontvangen. Iemand van het Start in Dubai-team neemt heel snel contact met u op via WhatsApp of telefoon.",
      again: "Uw aanvraag is geregistreerd: het Start in Dubai-team neemt contact met u op.", restart: "Nieuwe aanvraag", news: "Ook onze gidsen per e-mail ontvangen (optioneel)" },
    it: { open: "Apri l'assistente di Start in Dubai", close: "Chiudi", teaser: "Un progetto a Dubai? Parliamone 👋", sub: "Assistente · il team La ricontatta",
      hello: "Buongiorno 👋 Sono l'assistente di Start in Dubai.", q1: "Qual è il Suo progetto a Dubai?",
      p: ["Aprire la mia società", "Visto e residenza", "Trasferirmi con la famiglia", "Studi", "Conto bancario", "Altro progetto"],
      q2: "Per quando?", w: ["Entro un mese", "Entro 3 mesi", "Tra 3 e 6 mesi", "Mi sto informando"],
      q3: "Perfetto. Lasci i Suoi dati e un consulente del team La contatterà.",
      name: "Nome", phone: "WhatsApp o telefono, con prefisso", php: "+39 312 345 6789", email: "Email (facoltativa)", send: "Voglio essere contattato",
      consent: "Inviando, accetta di essere ricontattato per il Suo progetto.", privacy: "Privacy",
      eName: "Inserisca il Suo nome.", ePhone: "Inserisca il numero con il prefisso internazionale, ad esempio +39 312 345 6789.", eEmail: "Questa email non è valida.", eSend: "Invio non riuscito. Riprovi tra un attimo.",
      sending: "Invio…", done: "Grazie, {n}! Abbiamo ricevuto la Sua richiesta. Un membro del team Start in Dubai La contatterà molto presto su WhatsApp o per telefono.",
      again: "La Sua richiesta è registrata: il team Start in Dubai La contatterà.", restart: "Nuova richiesta", news: "Ricevere anche le nostre guide via email (facoltativo)" },
  };
  const t = T[LANG] || T.en, FR = T.fr;

  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* navigation privée */ } },
    sget(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    sset(k) { try { sessionStorage.setItem(k, "1"); } catch { /* navigation privée */ } },
  };

  /* ---------------------------------------------------------------- styles */
  const css = `
.sb{--sb-red:#E10600;--sb-green:#00732F;--sb-ink:#0B0B0B;--sb-line:#E6E6E6;position:fixed;z-index:45;right:20px;bottom:20px;font-family:var(--sans,Inter,Arial,sans-serif);transition:bottom .3s ease}
body:has(.sticky.is-on) .sb{bottom:calc(92px + env(safe-area-inset-bottom))}
.sb *{box-sizing:border-box}
.sb-launch{position:relative;display:grid;place-items:center;width:66px;height:66px;padding:0;border:0;border-radius:50%;background:#fff;cursor:pointer;box-shadow:0 0 0 3px #fff,0 0 0 6px var(--sb-red),0 16px 34px -10px rgba(0,0,0,.55);transition:transform .25s ease}
.sb-launch:hover{transform:scale(1.06)}
.sb-launch:focus-visible{outline:3px solid var(--sb-green);outline-offset:6px}
.sb-launch img{width:50px;height:50px;object-fit:contain;border-radius:50%}
.sb-launch::after{content:"";position:absolute;inset:-6px;border-radius:50%;border:2px solid var(--sb-red);opacity:0;animation:sbPulse 2.6s ease-out 1.2s 3}
.sb-dot{position:absolute;right:1px;bottom:3px;width:15px;height:15px;border-radius:50%;background:#22C55E;border:3px solid #fff}
@keyframes sbPulse{0%{opacity:.7;transform:scale(1)}100%{opacity:0;transform:scale(1.45)}}
.sb-teaser{position:absolute;right:80px;bottom:10px;width:max-content;max-width:230px;padding:12px 34px 12px 14px;border-radius:14px 14px 4px 14px;background:#fff;color:var(--sb-ink);font-size:14px;font-weight:600;line-height:1.35;box-shadow:0 14px 34px -12px rgba(0,0,0,.45);cursor:pointer;animation:sbIn .35s ease both}
.sb-teaser button{position:absolute;top:6px;right:6px;width:22px;height:22px;border:0;border-radius:50%;background:#F2F2F2;color:#555;font-size:14px;line-height:1;cursor:pointer}
.sb-panel{position:absolute;right:0;bottom:84px;display:flex;flex-direction:column;width:min(370px,calc(100vw - 32px));height:min(590px,calc(100vh - 130px));border-radius:18px;background:#fff;color:var(--sb-ink);overflow:hidden;box-shadow:0 30px 70px -20px rgba(0,0,0,.55);animation:sbIn .3s ease both}
.sb-panel[hidden],.sb-teaser[hidden]{display:none}
@keyframes sbIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.sb-head{position:relative;display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--sb-ink);color:#fff}
.sb-head::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:linear-gradient(90deg,var(--sb-red) 0 25%,var(--sb-green) 25% 50%,#fff 50% 75%,#000 75%)}
.sb-head img{width:42px;height:42px;padding:3px;border-radius:50%;background:#fff;object-fit:contain;box-shadow:0 0 0 2px var(--sb-red)}
.sb-head b{display:block;font-family:var(--head,Montserrat,Arial,sans-serif);font-weight:900;font-size:15px;letter-spacing:.02em}
.sb-head small{display:flex;align-items:center;gap:6px;font-size:12px;color:rgba(255,255,255,.75)}
.sb-head small::before{content:"";width:8px;height:8px;border-radius:50%;background:#22C55E}
.sb-x{margin-left:auto;width:34px;height:34px;border:0;border-radius:50%;background:rgba(255,255,255,.12);color:#fff;font-size:20px;line-height:1;cursor:pointer}
.sb-body{flex:1;overflow-y:auto;padding:16px 14px 18px;background:#F6F6F4;overscroll-behavior:contain}
.sb-msg{max-width:86%;margin:0 0 10px;padding:10px 13px;border-radius:4px 14px 14px 14px;background:#fff;font-size:14.5px;line-height:1.45;box-shadow:0 1px 2px rgba(0,0,0,.06);animation:sbIn .25s ease both}
.sb-me{margin-left:auto;border-radius:14px 4px 14px 14px;background:var(--sb-red);color:#fff;font-weight:600}
.sb-typing{display:inline-flex;gap:4px;padding:12px 14px}
.sb-typing i{width:6px;height:6px;border-radius:50%;background:#999;animation:sbDot 1s infinite}
.sb-typing i:nth-child(2){animation-delay:.15s}.sb-typing i:nth-child(3){animation-delay:.3s}
@keyframes sbDot{0%,60%,100%{opacity:.3}30%{opacity:1}}
.sb-chips{display:flex;flex-wrap:wrap;gap:8px;margin:2px 0 12px}
.sb-chips button{padding:9px 13px;border:1.5px solid var(--sb-red);border-radius:999px;background:#fff;color:var(--sb-red);font:inherit;font-size:14px;font-weight:700;cursor:pointer;transition:background .15s,color .15s}
.sb-chips button:hover,.sb-chips button:focus-visible{background:var(--sb-red);color:#fff;outline:none}
.sb .sv-host{margin:2px 0 6px;padding:14px;border-radius:14px;background:#fff;color:#111;box-shadow:0 1px 2px rgba(0,0,0,.06)}
.sb-form{margin:2px 0 6px;padding:14px;border-radius:14px;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.06);animation:sbIn .25s ease both}
.sb-form label{display:block;margin:0 0 10px;font-size:12.5px;font-weight:700;color:#333}
.sb-form input{display:block;width:100%;margin-top:5px;padding:11px 12px;border:1.5px solid var(--sb-line);border-radius:10px;font:inherit;font-size:16px;color:var(--sb-ink);background:#fff}
.sb-form input:focus{border-color:var(--sb-ink);outline:none}
.sb-form input[type=tel]{direction:ltr;text-align:left}
.sb-news{display:flex!important;align-items:flex-start;gap:8px;font-weight:600!important;font-size:12.5px!important;color:#444!important;line-height:1.4}.sb-news input{width:auto!important;margin:2px 0 0!important;flex:none}
.sb-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.sb-send{display:block;width:100%;min-height:48px;margin-top:4px;border:0;border-radius:10px;background:var(--sb-red);color:#fff;font:inherit;font-size:15.5px;font-weight:800;cursor:pointer;box-shadow:0 10px 22px -12px rgba(225,6,0,.8)}
.sb-send:disabled{opacity:.6;cursor:wait}
.sb-err{margin:0 0 8px;font-size:13px;font-weight:600;color:#B00020}
.sb-err:empty{display:none}
.sb-legal{margin:10px 0 0;font-size:11.5px;line-height:1.4;color:#666}
.sb-legal button{padding:0;border:0;background:none;color:inherit;font:inherit;text-decoration:underline;cursor:pointer}
.sb-done{border-left:4px solid var(--sb-green)}
.sb-link{padding:0;border:0;background:none;color:var(--sb-red);font:inherit;font-size:13px;font-weight:700;text-decoration:underline;cursor:pointer}
[dir=rtl] .sb-msg{border-radius:14px 4px 14px 14px}
[dir=rtl] .sb-me{margin-left:0;margin-right:auto;border-radius:4px 14px 14px 14px}
[dir=rtl] .sb-x{margin-left:0;margin-right:auto}
[dir=rtl] .sb-teaser{padding:12px 14px 12px 34px}
[dir=rtl] .sb-teaser button{right:auto;left:6px}
@media (max-width:640px){
.sb{right:14px;bottom:14px}
.sb-launch{width:58px;height:58px}.sb-launch img{width:44px;height:44px}
.sb-teaser{right:70px;max-width:200px;font-size:13.5px}
.sb.is-open{right:0;left:0;bottom:0}
.sb.is-open .sb-launch,.sb.is-open .sb-teaser{display:none}
.sb-panel{position:fixed;left:0;right:0;bottom:0;width:100%;height:min(88vh,640px);height:min(88dvh,640px);border-radius:18px 18px 0 0;padding-bottom:env(safe-area-inset-bottom)}
}
@media (prefers-reduced-motion:reduce){.sb *{animation:none!important;transition:none!important}}`;

  /* ---------------------------------------------------------------- DOM */
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const logo = "/assets/img/logo-256.webp";
  const style = el("style"); style.textContent = css; document.head.append(style);

  const root = el("div", "sb"); root.dir = RTL ? "rtl" : "ltr"; root.setAttribute("lang", LANG);
  const launch = el("button", "sb-launch"); launch.type = "button"; launch.setAttribute("aria-label", t.open); launch.setAttribute("aria-expanded", "false");
  const lImg = el("img"); lImg.src = logo; lImg.alt = ""; lImg.width = 50; lImg.height = 50; lImg.decoding = "async";
  launch.append(lImg, el("span", "sb-dot"));

  const teaser = el("div", "sb-teaser"); teaser.hidden = true; teaser.setAttribute("role", "status");
  const tx = el("button", null, "×"); tx.type = "button"; tx.setAttribute("aria-label", t.close);
  teaser.append(document.createTextNode(t.teaser), tx);

  const panel = el("section", "sb-panel"); panel.hidden = true; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Start in Dubai");
  const head = el("header", "sb-head");
  const hImg = el("img"); hImg.src = logo; hImg.alt = ""; hImg.width = 42; hImg.height = 42;
  const hTxt = el("div"); hTxt.append(el("b", null, "Start in Dubai"), el("small", null, t.sub));
  const x = el("button", "sb-x", "×"); x.type = "button"; x.setAttribute("aria-label", t.close);
  head.append(hImg, hTxt, x);
  const body = el("div", "sb-body"); body.setAttribute("aria-live", "polite");
  panel.append(head, body);
  root.append(panel, teaser, launch);
  document.body.append(root);

  /* ---------------------------------------------------------------- conversation */
  const state = { project: null, when: null, started: false };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const down = () => { body.scrollTop = body.scrollHeight; };

  async function say(text, cls) {
    const ty = el("div", "sb-msg sb-typing"); ty.append(el("i"), el("i"), el("i")); body.append(ty); down();
    await sleep(Math.min(900, 350 + text.length * 8));
    ty.remove();
    const m = el("div", "sb-msg" + (cls ? " " + cls : ""), text); body.append(m); down();
    return m;
  }
  const me = (text) => { body.append(el("div", "sb-msg sb-me", text)); down(); };

  function chips(list, onPick) {
    const box = el("div", "sb-chips");
    list.forEach((label, i) => {
      const b = el("button", null, label); b.type = "button";
      b.addEventListener("click", () => { box.remove(); me(label); onPick(i); });
      box.append(b);
    });
    body.append(box); down();
    box.querySelector("button")?.focus({ preventScroll: true });
  }

  async function start() {
    if (state.started) return;
    state.started = true;
    const prev = store.get("sid_bot_lead");
    if (prev && prev.at) {
      await say(t.again, "sb-done");
      const again = el("button", "sb-link", t.restart); again.type = "button";
      again.addEventListener("click", () => { again.remove(); ask(); });
      body.append(again); down();
      return;
    }
    ask();
  }

  async function ask() {
    await say(t.hello);
    await say(t.q1);
    chips(t.p, async (i) => {
      state.project = i;
      await say(t.q2);
      chips(t.w, async (j) => { state.when = j; await say(t.q3); form(); });
    });
  }

  function field(label, type, name, extra) {
    const l = el("label", null, label);
    const i = el("input"); i.type = type; i.name = name; Object.assign(i, extra || {});
    l.append(i); return [l, i];
  }

  function form() {
    const f = el("form", "sb-form"); f.noValidate = true;
    const [l1, iName] = field(t.name, "text", "given-name", { autocomplete: "given-name", maxLength: 60, required: true });
    const [l2, iPhone] = field(t.phone, "tel", "tel", { autocomplete: "tel", inputMode: "tel", placeholder: t.php, maxLength: 24, required: true });
    const [l3, iMail] = field(t.email, "email", "email", { autocomplete: "email", maxLength: 120 });
    const hp = el("input", "sb-hp"); hp.name = "website"; hp.tabIndex = -1; hp.autocomplete = "off"; hp.setAttribute("aria-hidden", "true");
    const nl = el("label", "sb-news"); const cb = el("input"); cb.type = "checkbox"; cb.name = "news"; nl.append(cb, document.createTextNode(" " + t.news));
    const err = el("p", "sb-err"); err.setAttribute("role", "alert");
    const send = el("button", "sb-send", t.send); send.type = "submit";
    const legal = el("p", "sb-legal", t.consent + " ");
    const pv = document.getElementById("privacy");
    if (pv && pv.showModal) { const pb = el("button", null, t.privacy); pb.type = "button"; pb.addEventListener("click", () => pv.showModal()); legal.append(pb); }
    f.append(l1, l2, l3, nl, hp, err, send, legal);
    body.append(f); down();
    setTimeout(() => iName.focus({ preventScroll: true }), 50);

    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      err.textContent = "";
      const name = iName.value.trim(), mail = iMail.value.trim().toLowerCase();
      const raw = iPhone.value.trim();
      let d = raw.replace(/\D/g, "");
      if (raw.startsWith("00")) d = d.slice(2);
      const intl = raw.startsWith("+") || raw.startsWith("00");
      if (name.length < 2) { err.textContent = t.eName; iName.focus(); return; }
      if (!intl || d.length < 8 || d.length > 15) { err.textContent = t.ePhone; iPhone.focus(); return; }
      if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) { err.textContent = t.eEmail; iMail.focus(); return; }
      if (hp.value) { done(name, f); return; }
      const go = async (proof) => {
      send.disabled = true; send.textContent = t.sending;
      try {
        await sendLead({ name, phone: "+" + d, email: mail, news: cb.checked, proof });
        window.gtag?.("event", "generate_lead", { lead_source: "bot", project: FR.p[state.project] });
        window.fbq?.("track", "Lead", { content_name: TAG });
        store.set("sid_bot_lead", { name, at: new Date().toISOString() });
        done(name, f);
      } catch (ex) {
        console.error("[Start in Dubai] bot :", ex);
        err.textContent = t.eSend;
        send.disabled = false; send.textContent = t.send;
      }
      };
      if (!mail) { go(null); return; }
      // e-mail renseigné : il est vérifié par un code avant l'envoi
      f.hidden = true;
      const host = el("div", "sv-host"); body.append(host); down();
      try {
        const v = await getVerify();
        v.mount(host, { email: mail, lang: LANG, theme: "compact",
          onVerified: (proof) => { host.remove(); f.hidden = false; go(proof); },
          onBack: () => { host.remove(); f.hidden = false; iMail.focus(); down(); } });
        setTimeout(down, 80);
      } catch (ex) { host.remove(); f.hidden = false; err.textContent = t.eSend; }
    });
  }

  const getVerify = () => window.sidVerify ? Promise.resolve(window.sidVerify) : (window.__sidVerifyP ||= new Promise((res, rej) => {
    const sc = document.createElement("script"); sc.src = "/assets/verify.js?v=1"; sc.onload = () => res(window.sidVerify); sc.onerror = rej; document.head.append(sc);
  }));

  async function done(name, f) {
    f.remove();
    await say(t.done.replace("{n}", name), "sb-done");
  }

  /* ---------------------------------------------------------------- envoi vers Oleadoo (via la table leads de Cevitas) */
  async function sendLead(p) {
    const crm = C.crm || {};
    if (!crm.supabaseUrl || !crm.publishableKey) throw new Error("crm non configuré");
    const q = new URLSearchParams(location.search);
    const project = FR.p[state.project] || "", when = FR.w[state.when] || "";
    const row = {
      name: p.name,
      // la table exige un e-mail : une adresse en .invalid veut dire « pas d'e-mail » (Oleadoo passe alors en WhatsApp)
      email: p.email || "sans-email@bot.startindubai.invalid",
      phone: p.phone,
      interest: [TAG, project, when].filter(Boolean).join(" · ").slice(0, 500),
      notes: [`Tag : ${TAG}`, "Assistant du site startindubai.com", project && `Projet : ${project}`, when && `Échéance : ${when}`,
        `Langue du site : ${LANG}`, `Page : ${location.pathname}`, p.proof ? "E-mail vérifié par code" : null].filter(Boolean).join(" · ").slice(0, 2000),
      source: SOURCE,
      language: LANG,
      utm_source: q.get("utm_source"), utm_medium: q.get("utm_medium"), utm_campaign: q.get("utm_campaign"),
      referrer: document.referrer || null, landing_page: location.href.split("#")[0], page_path: location.pathname,
      device: matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop",
      user_agent: navigator.userAgent.slice(0, 500),
    };
    const base = crm.supabaseUrl.replace(/\/$/, "");
    const auth = { apikey: crm.publishableKey, Authorization: "Bearer " + crm.publishableKey, "Content-Type": "application/json" };
    const r = await fetch(base + "/rest/v1/leads", { method: "POST", headers: { ...auth, Prefer: "return=minimal" }, body: JSON.stringify(row), keepalive: true });
    if (!r.ok) throw new Error("CRM HTTP " + r.status + " " + (await r.text().catch(() => "")));
    if (p.email && p.proof) fetch("/api/lead", { method: "POST", headers: { "content-type": "application/json" }, keepalive: true,
      body: JSON.stringify({ name: p.name, email: p.email, phone: p.phone, lang: LANG, project: [FR.p[state.project], t.p[state.project]].filter(Boolean)[0] || "",
        when: FR.w[state.when] || "", source: SOURCE, page: location.pathname, news: !!p.news, proof: p.proof || "" }) }).catch(() => {});
    if (crm.notifyEmail) fetch(base + "/functions/v1/send-lead-email", { method: "POST", headers: auth, body: JSON.stringify(row), keepalive: true }).catch(() => {});
    const hook = (C.leadWebhookUrl || "").trim();
    if (hook) fetch(hook, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: JSON.stringify({ ...row, tag: TAG }), keepalive: true }).catch(() => {});
  }

  /* ---------------------------------------------------------------- ouverture / fermeture */
  function open() {
    teaser.hidden = true; store.sset("sid_bot_teased");
    panel.hidden = false; root.classList.add("is-open"); launch.setAttribute("aria-expanded", "true");
    window.gtag?.("event", "bot_open");
    start();
  }
  function close() {
    panel.hidden = true; root.classList.remove("is-open"); launch.setAttribute("aria-expanded", "false");
    launch.focus({ preventScroll: true });
  }
  launch.addEventListener("click", () => (panel.hidden ? open() : close()));
  x.addEventListener("click", close);
  teaser.addEventListener("click", (e) => { if (e.target === tx) { teaser.hidden = true; store.sset("sid_bot_teased"); } else open(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) close(); });
  // lien « parler à l'assistant » possible n'importe où : <a href="#assistant"> ou data-open-bot
  document.addEventListener("click", (e) => { const a = e.target.closest?.("[data-open-bot], a[href='#assistant']"); if (a) { e.preventDefault(); open(); } });
  if (location.hash === "#assistant") open();

  // petite bulle d'accroche, une fois par visite, si l'assistant n'a pas été ouvert
  if (!store.sget("sid_bot_teased") && !store.get("sid_bot_lead")) setTimeout(() => { if (panel.hidden) teaser.hidden = false; }, 7000);
})();
