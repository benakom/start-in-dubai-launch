/* Start in Dubai : inscription à la newsletter (bandeau au-dessus du pied de page, toutes les pages).
   Envoi vers /api/newsletter (relais Cloudflare -> Brevo, double confirmation dans la langue de la page).
   Chargé par site.js après le chargement de la page. */
(() => {
  "use strict";
  if (window.__sidNl) return;
  window.__sidNl = true;
  const LANG = (document.documentElement.lang || "fr").slice(0, 2);
  const T = {
    fr: { t: "Les guides Start in Dubai dans votre boîte mail", s: "Nos nouveaux guides et les changements de règles importants, vérifiés sur les sources officielles. Pas de spam, désinscription en un clic.",
      ph: "Votre adresse e-mail", b: "Je m'inscris", ok: "Merci ! Un e-mail de confirmation vient de partir : cliquez sur le lien qu'il contient pour valider votre inscription.",
      e: "Cette adresse e-mail n'est pas valide.", f: "L'inscription n'a pas abouti. Réessayez dans un instant.", c: "Inscription confirmée : bienvenue chez Start in Dubai !",
      l: "Vos données servent uniquement à vous envoyer nos e-mails.", sending: "Envoi…" },
    en: { t: "Start in Dubai guides in your inbox", s: "Our new guides and important rule changes, checked against official sources. No spam, unsubscribe in one click.",
      ph: "Your email address", b: "Subscribe", ok: "Thank you! A confirmation email is on its way: click the link inside to confirm your subscription.",
      e: "This email address is not valid.", f: "The subscription failed. Please try again in a moment.", c: "Subscription confirmed: welcome to Start in Dubai!",
      l: "Your data is used only to send you our emails.", sending: "Sending…" },
    ar: { t: "أدلة Start in Dubai في بريدك الإلكتروني", s: "أدلتنا الجديدة وتغييرات القواعد المهمة، مراجَعة وفق المصادر الرسمية. بدون رسائل مزعجة، وإلغاء الاشتراك بنقرة واحدة.",
      ph: "بريدك الإلكتروني", b: "اشترك", ok: "شكرًا! أرسلنا إليك رسالة تأكيد: انقر على الرابط الموجود فيها لتأكيد اشتراكك.",
      e: "عنوان البريد الإلكتروني غير صالح.", f: "تعذّر الاشتراك. حاول مرة أخرى بعد قليل.", c: "تم تأكيد اشتراكك: مرحبًا بك في Start in Dubai!",
      l: "تُستخدم بياناتك فقط لإرسال رسائلنا إليك.", sending: "جارٍ الإرسال…" },
    es: { t: "Las guías de Start in Dubai en su bandeja de entrada", s: "Nuestras nuevas guías y los cambios de normas importantes, verificados en fuentes oficiales. Sin spam, baja con un clic.",
      ph: "Su dirección de email", b: "Suscribirme", ok: "¡Gracias! Le hemos enviado un email de confirmación: haga clic en el enlace para validar su suscripción.",
      e: "Este email no es válido.", f: "La suscripción no se ha completado. Inténtelo de nuevo en un momento.", c: "Suscripción confirmada: ¡bienvenido a Start in Dubai!",
      l: "Sus datos solo se usan para enviarle nuestros emails.", sending: "Enviando…" },
    nl: { t: "De gidsen van Start in Dubai in uw mailbox", s: "Onze nieuwe gidsen en belangrijke regelwijzigingen, gecontroleerd aan de hand van officiële bronnen. Geen spam, uitschrijven met één klik.",
      ph: "Uw e-mailadres", b: "Inschrijven", ok: "Bedankt! Er is een bevestigingsmail onderweg: klik op de link erin om uw inschrijving te bevestigen.",
      e: "Dit e-mailadres is ongeldig.", f: "De inschrijving is mislukt. Probeer het zo opnieuw.", c: "Inschrijving bevestigd: welkom bij Start in Dubai!",
      l: "Uw gegevens worden alleen gebruikt om u onze e-mails te sturen.", sending: "Verzenden…" },
    it: { t: "Le guide di Start in Dubai nella Sua casella email", s: "Le nostre nuove guide e i cambiamenti importanti delle regole, verificati sulle fonti ufficiali. Niente spam, disiscrizione con un clic.",
      ph: "Il Suo indirizzo email", b: "Mi iscrivo", ok: "Grazie! Le abbiamo inviato un'email di conferma: clicchi sul link per confermare l'iscrizione.",
      e: "Questa email non è valida.", f: "L'iscrizione non è andata a buon fine. Riprovi tra un attimo.", c: "Iscrizione confermata: benvenuto in Start in Dubai!",
      l: "I Suoi dati servono solo a inviarLe le nostre email.", sending: "Invio…" },
  };
  const t = T[LANG] || T.en;

  const css = `
.snl{background:#0B0B0B;color:#fff;padding:44px 0 40px;position:relative}
.snl::before{content:"";position:absolute;left:0;right:0;top:0;height:4px;background:linear-gradient(90deg,#E10600 0 25%,#00732F 25% 50%,#fff 50% 75%,#000 75%)}
.snl-in{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:28px;align-items:center}
.snl h2{margin:0 0 8px;font-family:var(--head,Montserrat,Arial,sans-serif);font-weight:900;font-size:clamp(22px,2.6vw,30px);line-height:1.15;color:#fff}
.snl p{margin:0;color:rgba(255,255,255,.75);font-size:15.5px;line-height:1.5}
.snl form{display:flex;gap:10px;flex-wrap:wrap}
.snl input[type=email]{flex:1 1 220px;min-height:54px;padding:0 16px;border:1.5px solid rgba(255,255,255,.25);border-radius:10px;background:#161616;color:#fff;font:inherit;font-size:16px}
.snl input[type=email]::placeholder{color:rgba(255,255,255,.5)}
.snl input[type=email]:focus{outline:none;border-color:#fff}
.snl button{min-height:54px;padding:0 24px;border:0;border-radius:10px;background:#E10600;color:#fff;font:inherit;font-size:16px;font-weight:800;cursor:pointer;box-shadow:0 14px 28px -14px rgba(225,6,0,.8)}
.snl button:disabled{opacity:.6;cursor:wait}
.snl .snl-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.snl .snl-msg{flex-basis:100%;margin:4px 0 0;font-size:14px;font-weight:600}
.snl .snl-msg.ok{color:#3DD26B}.snl .snl-msg.err{color:#FF8A80}
.snl .snl-legal{flex-basis:100%;margin:2px 0 0;font-size:12.5px;color:rgba(255,255,255,.55)}
.snl-toast{position:fixed;z-index:60;left:50%;top:20px;transform:translateX(-50%);max-width:calc(100vw - 32px);padding:14px 20px;border-radius:12px;background:#0B0B0B;color:#fff;font-weight:700;box-shadow:0 20px 40px -16px rgba(0,0,0,.6);border-left:5px solid #00732F}
@media (max-width:820px){.snl-in{grid-template-columns:1fr}.snl button{flex:1 1 100%}}`;
  const st = document.createElement("style"); st.textContent = css; document.head.append(st);

  const foot = document.querySelector("footer.foot");
  if (foot && !document.querySelector(".snl")) {
    const sec = document.createElement("section"); sec.className = "snl"; sec.setAttribute("aria-labelledby", "snl-t");
    sec.innerHTML = `<div class="wrap snl-in"><div><h2 id="snl-t"></h2><p class="snl-s"></p></div>
      <form novalidate><label class="snl-hp" aria-hidden="true">website<input name="website" tabindex="-1" autocomplete="off"></label>
      <input type="email" name="email" required autocomplete="email" inputmode="email">
      <button type="submit"></button><p class="snl-msg" role="status"></p><p class="snl-legal"></p></form></div>`;
    sec.querySelector("h2").textContent = t.t;
    sec.querySelector(".snl-s").textContent = t.s;
    const f = sec.querySelector("form"), inp = f.querySelector("input[type=email]"), btn = f.querySelector("button"), msg = f.querySelector(".snl-msg");
    inp.placeholder = t.ph; inp.setAttribute("aria-label", t.ph); btn.textContent = t.b; f.querySelector(".snl-legal").textContent = t.l;
    foot.before(sec);
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      msg.className = "snl-msg"; msg.textContent = "";
      const email = inp.value.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.classList.add("err"); msg.textContent = t.e; inp.focus(); return; }
      btn.disabled = true; btn.textContent = t.sending;
      try {
        const r = await fetch("/api/newsletter", { method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, lang: LANG, source: "newsletter-site", page: location.pathname, website: f.website.value }) });
        if (!r.ok) throw new Error("HTTP " + r.status);
        msg.classList.add("ok"); msg.textContent = t.ok; inp.value = "";
        window.gtag?.("event", "sign_up", { method: "newsletter" });
        window.fbq?.("track", "Subscribe");
      } catch (ex) {
        msg.classList.add("err"); msg.textContent = t.f;
      } finally { btn.disabled = false; btn.textContent = t.b; }
    });
  }

  // retour du lien de confirmation (?newsletter=ok)
  const q = new URLSearchParams(location.search);
  if (q.get("newsletter") === "ok") {
    const toast = document.createElement("div"); toast.className = "snl-toast"; toast.setAttribute("role", "status"); toast.textContent = t.c;
    document.body.append(toast); setTimeout(() => toast.remove(), 7000);
    q.delete("newsletter"); history.replaceState(null, "", location.pathname + (q.toString() ? "?" + q : "") + location.hash);
  }
})();
