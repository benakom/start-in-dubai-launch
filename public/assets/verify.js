/* Start in Dubai : vérification de l'adresse e-mail par code à 6 chiffres (formulaire, assistant, newsletter).
   window.sidVerify.mount(conteneur, { email, lang, theme: "light" | "dark" | "compact", onVerified(proof), onBack() })
   envoie le code (relais /api/otp/send) puis affiche la saisie ; le code est contrôlé par /api/otp/verify. */
(() => {
  "use strict";
  if (window.sidVerify) return;
  const T = {
    fr: { title: "Vérifiez votre adresse e-mail", sent: "Nous venons d'envoyer un code à 6 chiffres à {e}. Saisissez-le ci-dessous pour valider.", label: "Code à 6 chiffres",
      ok: "Valider", checking: "Vérification…", sending: "Envoi du code…", resend: "Renvoyer le code", wait: "Renvoyer le code dans {s} s", resent: "Nouveau code envoyé.",
      change: "Modifier l'adresse e-mail", spam: "Rien reçu ? Regardez dans les spams ou l'onglet Promotions.",
      e_code: "Code incorrect. Vérifiez les 6 chiffres.", e_expired: "Ce code a expiré. Demandez-en un nouveau.", e_tries: "Trop d'essais. Demandez un nouveau code.",
      e_send: "L'envoi du code n'a pas abouti. Réessayez dans un instant.", e_rate: "Trop de demandes. Patientez quelques minutes.", e_email: "Cette adresse e-mail n'est pas valide." },
    en: { title: "Verify your email address", sent: "We have just sent a 6-digit code to {e}. Enter it below to confirm.", label: "6-digit code",
      ok: "Confirm", checking: "Checking…", sending: "Sending the code…", resend: "Resend the code", wait: "Resend the code in {s}s", resent: "New code sent.",
      change: "Change email address", spam: "Nothing yet? Check your spam or Promotions tab.",
      e_code: "Incorrect code. Check the 6 digits.", e_expired: "This code has expired. Request a new one.", e_tries: "Too many attempts. Request a new code.",
      e_send: "We could not send the code. Please try again in a moment.", e_rate: "Too many requests. Please wait a few minutes.", e_email: "This email address is not valid." },
    ar: { title: "تحقّقوا من بريدكم الإلكتروني", sent: "أرسلنا للتو رمزًا من 6 أرقام إلى {e}. أدخلوه أدناه للتأكيد.", label: "رمز من 6 أرقام",
      ok: "تأكيد", checking: "جارٍ التحقق…", sending: "جارٍ إرسال الرمز…", resend: "إعادة إرسال الرمز", wait: "إعادة الإرسال بعد {s} ث", resent: "تم إرسال رمز جديد.",
      change: "تعديل البريد الإلكتروني", spam: "لم يصلكم شيء؟ تحقّقوا من مجلد الرسائل غير المرغوب فيها.",
      e_code: "الرمز غير صحيح. تحقّقوا من الأرقام الستة.", e_expired: "انتهت صلاحية هذا الرمز. اطلبوا رمزًا جديدًا.", e_tries: "محاولات كثيرة. اطلبوا رمزًا جديدًا.",
      e_send: "تعذّر إرسال الرمز. حاولوا مرة أخرى بعد قليل.", e_rate: "طلبات كثيرة. انتظروا بضع دقائق.", e_email: "عنوان البريد الإلكتروني غير صالح." },
    es: { title: "Verifique su dirección de email", sent: "Acabamos de enviar un código de 6 cifras a {e}. Introdúzcalo abajo para confirmar.", label: "Código de 6 cifras",
      ok: "Validar", checking: "Verificando…", sending: "Enviando el código…", resend: "Reenviar el código", wait: "Reenviar el código en {s} s", resent: "Nuevo código enviado.",
      change: "Cambiar la dirección de email", spam: "¿No ha recibido nada? Mire en spam o en Promociones.",
      e_code: "Código incorrecto. Revise las 6 cifras.", e_expired: "Este código ha caducado. Solicite uno nuevo.", e_tries: "Demasiados intentos. Solicite un nuevo código.",
      e_send: "No se ha podido enviar el código. Inténtelo de nuevo en un momento.", e_rate: "Demasiadas solicitudes. Espere unos minutos.", e_email: "Este email no es válido." },
    nl: { title: "Bevestig uw e-mailadres", sent: "We hebben zojuist een code van 6 cijfers naar {e} gestuurd. Vul die hieronder in om te bevestigen.", label: "Code van 6 cijfers",
      ok: "Bevestigen", checking: "Controleren…", sending: "Code wordt verstuurd…", resend: "Code opnieuw sturen", wait: "Opnieuw sturen over {s} s", resent: "Nieuwe code verstuurd.",
      change: "E-mailadres wijzigen", spam: "Niets ontvangen? Kijk in uw spam of het tabblad Promoties.",
      e_code: "Onjuiste code. Controleer de 6 cijfers.", e_expired: "Deze code is verlopen. Vraag een nieuwe aan.", e_tries: "Te veel pogingen. Vraag een nieuwe code aan.",
      e_send: "De code kon niet worden verstuurd. Probeer het zo opnieuw.", e_rate: "Te veel aanvragen. Wacht een paar minuten.", e_email: "Dit e-mailadres is ongeldig." },
    it: { title: "Verifichi il Suo indirizzo email", sent: "Abbiamo appena inviato un codice di 6 cifre a {e}. Lo inserisca qui sotto per confermare.", label: "Codice di 6 cifre",
      ok: "Conferma", checking: "Verifica…", sending: "Invio del codice…", resend: "Invia di nuovo il codice", wait: "Nuovo invio tra {s} s", resent: "Nuovo codice inviato.",
      change: "Modifica l'indirizzo email", spam: "Non ha ricevuto nulla? Controlli lo spam o la scheda Promozioni.",
      e_code: "Codice errato. Controlli le 6 cifre.", e_expired: "Questo codice è scaduto. Ne richieda uno nuovo.", e_tries: "Troppi tentativi. Richieda un nuovo codice.",
      e_send: "Non siamo riusciti a inviare il codice. Riprovi tra un attimo.", e_rate: "Troppe richieste. Attenda qualche minuto.", e_email: "Questa email non è valida." },
  };

  const css = `
.sv{font-family:var(--sans,Inter,Arial,sans-serif);max-width:520px}
.sv h3{margin:0 0 8px;font-family:var(--head,Montserrat,Arial,sans-serif);font-size:clamp(20px,2.4vw,26px);font-weight:900;line-height:1.2;color:inherit}
.sv p{margin:0 0 14px;font-size:15.5px;line-height:1.55}
.sv p b{word-break:break-all}
.sv form{display:flex;gap:10px;flex-wrap:wrap;align-items:stretch;margin:0 0 10px}
.sv input{flex:1 1 200px;min-width:0;min-height:56px;padding:0 16px;border:2px solid #d9d4cc;border-radius:12px;background:#fff;color:#111;
  font:700 26px/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.42em;text-align:center;direction:ltr}
.sv input:focus{outline:none;border-color:#E10600;box-shadow:0 0 0 4px rgba(225,6,0,.12)}
.sv .sv-ok{min-height:56px;padding:0 24px;border:0;border-radius:12px;background:#E10600;color:#fff;font:inherit;font-size:16px;font-weight:800;cursor:pointer}
.sv .sv-ok:disabled{opacity:.6;cursor:wait}
.sv .sv-msg{display:block;background:none;min-height:1.2em;margin:0 0 10px;font-size:14px;font-weight:700}
.sv .sv-msg.is-err{color:#C40500}.sv .sv-msg.is-ok{color:#00732F}
.sv .sv-links{display:flex;flex-wrap:wrap;gap:6px 18px;font-size:14px}
.sv .sv-links button{padding:0;border:0;background:none;color:inherit;font:inherit;font-weight:700;text-decoration:underline;cursor:pointer;opacity:.85}
.sv .sv-links button:disabled{text-decoration:none;opacity:.5;cursor:default}
.sv .sv-spam{margin:10px 0 0;font-size:13px;opacity:.7}
.sv-dark{color:#fff}.sv-dark p{color:rgba(255,255,255,.8)}
.sv-dark input{background:#161616;color:#fff;border-color:rgba(255,255,255,.25)}
.sv-dark .sv-msg.is-err{color:#FF8A80}.sv-dark .sv-msg.is-ok{color:#3DD26B}
.sv-compact h3{font-size:16px;margin:0 0 6px}.sv-compact p{font-size:13.5px;margin:0 0 10px}
.sv-compact input{min-height:48px;font-size:22px;flex-basis:100%}.sv-compact .sv-ok{min-height:46px;flex:1 1 100%}
.sv-compact .sv-links{font-size:13px}
.step.verifying .q,.step.verifying .q-help,.step.verifying .field,.step.verifying .actions,.step.verifying .consent-note{display:none!important}
@media (max-width:640px){.sv .sv-ok{flex:1 1 100%}}`;

  async function post(path, body) {
    const r = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    let j = {}; try { j = await r.json(); } catch { /* réponse vide */ }
    if (!r.ok || !j.ok) { const e = new Error(j.error || "http_" + r.status); e.code = j.error || "send"; throw e; }
    return j;
  }
  const send = (email, lang) => post("/api/otp/send", { email, lang }).then((j) => j.token);
  const check = (email, code, token) => post("/api/otp/verify", { email, code, token }).then((j) => j.proof);

  let styled = false;
  function mount(host, o) {
    if (!styled) { const s = document.createElement("style"); s.textContent = css; document.head.append(s); styled = true; }
    const lang = T[o.lang] ? o.lang : "en", t = T[lang];
    const email = String(o.email || "").trim().toLowerCase();
    const box = document.createElement("div");
    box.className = "sv" + (o.theme === "dark" ? " sv-dark" : o.theme === "compact" ? " sv-compact" : "");
    box.innerHTML = `<h3></h3><p class="sv-sent"></p><form novalidate><input name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]*" maxlength="6"><button class="sv-ok" type="submit"></button></form>
      <p class="sv-msg" role="status" aria-live="polite"></p><div class="sv-links"><button type="button" class="sv-re"></button><button type="button" class="sv-ch"></button></div><p class="sv-spam"></p>`;
    const q = (s) => box.querySelector(s);
    q("h3").textContent = t.title;
    const sent = q(".sv-sent"); sent.textContent = t.sent.split("{e}")[0]; const b = document.createElement("b"); b.textContent = email; b.dir = "ltr"; sent.append(b, document.createTextNode(t.sent.split("{e}")[1] || ""));
    const inp = q("input"), ok = q(".sv-ok"), msg = q(".sv-msg"), re = q(".sv-re"), ch = q(".sv-ch");
    inp.setAttribute("aria-label", t.label); inp.placeholder = "••••••"; ok.textContent = t.ok; ch.textContent = t.change; q(".sv-spam").textContent = t.spam;
    host.append(box);

    let token = null, timer = null, busy = false;
    const say = (text, cls) => { msg.textContent = text || ""; msg.className = "sv-msg" + (cls ? " is-" + cls : ""); };
    const errText = (c) => t["e_" + c] || t.e_send;
    function cooldown(sec) {
      clearInterval(timer); re.disabled = true;
      let s = sec; re.textContent = t.wait.replace("{s}", s);
      timer = setInterval(() => { s--; if (s <= 0) { clearInterval(timer); re.disabled = false; re.textContent = t.resend; } else re.textContent = t.wait.replace("{s}", s); }, 1000);
    }
    async function doSend(first) {
      say(t.sending); re.disabled = true; ok.disabled = true;
      try {
        token = await send(email, lang);
        say(first ? "" : t.resent, first ? "" : "ok"); cooldown(45);
        setTimeout(() => inp.focus({ preventScroll: true }), 60);
      } catch (e) {
        say(errText(e.code === "email" ? "email" : e.code === "rate" ? "rate" : "send"), "err");
        re.disabled = false; re.textContent = t.resend;
      } finally { ok.disabled = false; }
    }
    async function doCheck() {
      const code = inp.value.replace(/\D/g, "");
      if (code.length !== 6) { say(t.e_code, "err"); inp.focus(); return; }
      if (!token || busy) return;
      busy = true; ok.disabled = true; ok.textContent = t.checking; say("");
      try {
        const proof = await check(email, code, token);
        clearInterval(timer);
        box.remove();
        o.onVerified && o.onVerified(proof, email);
      } catch (e) {
        say(errText(["code", "expired", "tries"].includes(e.code) ? e.code : "send"), "err");
        if (e.code === "code") { inp.select(); }
      } finally { busy = false; ok.disabled = false; ok.textContent = t.ok; }
    }
    inp.addEventListener("input", () => {
      const v = inp.value.replace(/\D/g, "").slice(0, 6);
      if (inp.value !== v) inp.value = v;
      if (msg.classList.contains("is-err")) say("");
      if (v.length === 6) doCheck();
    });
    q("form").addEventListener("submit", (e) => { e.preventDefault(); doCheck(); });
    re.addEventListener("click", () => doSend(false));
    ch.addEventListener("click", () => { clearInterval(timer); box.remove(); o.onBack && o.onBack(); });
    doSend(true);
    return { destroy() { clearInterval(timer); box.remove(); } };
  }

  window.sidVerify = { mount, send, check, T };
})();
