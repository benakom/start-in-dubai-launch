/* Start in Dubai : bandeau de consentement aux cookies de mesure (pixel Meta, GA4 si configuré).
   Rien n'est chargé avant « Accepter ». Le choix est gardé (sid_consent = yes | no). Chargé par site.js après la page. */
(() => {
  "use strict";
  if (window.__sidConsent) return;
  window.__sidConsent = true;
  const C = window.SID_CONFIG || {};
  if (!C.metaPixelId && !C.ga4Id) return;
  let saved = null;
  try { saved = localStorage.getItem("sid_consent"); } catch { /* navigation privée */ }
  if (saved === "yes" || saved === "no") return;

  const LANG = (document.documentElement.lang || "fr").slice(0, 2);
  const T = {
    fr: ["Nous utilisons des cookies de mesure (Meta) pour savoir quelles annonces vous ont mené ici et améliorer nos campagnes. Vous pouvez refuser : le site fonctionne exactement de la même façon.", "Accepter", "Refuser", "Confidentialité"],
    en: ["We use measurement cookies (Meta) to know which ads brought you here and to improve our campaigns. You can decline: the site works exactly the same way.", "Accept", "Decline", "Privacy"],
    ar: ["نستخدم ملفات تعريف الارتباط الخاصة بالقياس (Meta) لمعرفة الإعلانات التي أوصلتك إلينا وتحسين حملاتنا. يمكنك الرفض: سيعمل الموقع بالطريقة نفسها تمامًا.", "قبول", "رفض", "الخصوصية"],
    es: ["Usamos cookies de medición (Meta) para saber qué anuncios le han traído hasta aquí y mejorar nuestras campañas. Puede rechazarlas: la web funciona exactamente igual.", "Aceptar", "Rechazar", "Privacidad"],
    nl: ["We gebruiken meetcookies (Meta) om te weten via welke advertenties u hier bent gekomen en om onze campagnes te verbeteren. U kunt weigeren: de website werkt dan precies hetzelfde.", "Accepteren", "Weigeren", "Privacy"],
    it: ["Usiamo cookie di misurazione (Meta) per sapere quali annunci L'hanno portata qui e migliorare le nostre campagne. Può rifiutarli: il sito funziona esattamente allo stesso modo.", "Accetta", "Rifiuta", "Privacy"],
  };
  const [txt, yes, no, priv] = T[LANG] || T.en;

  const css = `
.sck{position:fixed;z-index:48;left:20px;bottom:20px;max-width:420px;padding:16px 18px;border-radius:14px;background:#0B0B0B;color:#fff;font-family:var(--sans,Inter,Arial,sans-serif);box-shadow:0 24px 50px -18px rgba(0,0,0,.6);animation:sckIn .3s ease both}
.sck p{margin:0 0 12px;font-size:13.5px;line-height:1.5;color:rgba(255,255,255,.85)}
.sck .sck-b{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.sck button{min-height:42px;padding:0 18px;border-radius:9px;font:inherit;font-size:14px;font-weight:800;cursor:pointer}
.sck .sck-y{border:0;background:#E10600;color:#fff}
.sck .sck-n{border:1.5px solid rgba(255,255,255,.4);background:transparent;color:#fff}
.sck .sck-p{margin-inline-start:auto;border:0;background:none;color:rgba(255,255,255,.7);font-weight:600;font-size:13px;text-decoration:underline;min-height:auto;padding:0}
@keyframes sckIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@media (max-width:640px){.sck{left:10px;right:10px;bottom:10px;max-width:none}
body.sck-open .sticky{display:none}body.sck-open .sb{bottom:180px!important}}
[dir=rtl] .sck{left:auto;right:20px}@media (max-width:640px){[dir=rtl] .sck{right:10px}}`;
  const st = document.createElement("style"); st.textContent = css; document.head.append(st);

  const box = document.createElement("div"); box.className = "sck"; box.setAttribute("role", "dialog"); box.setAttribute("aria-live", "polite");
  const p = document.createElement("p"); p.textContent = txt;
  const b = document.createElement("div"); b.className = "sck-b";
  const by = document.createElement("button"); by.type = "button"; by.className = "sck-y"; by.textContent = yes;
  const bn = document.createElement("button"); bn.type = "button"; bn.className = "sck-n"; bn.textContent = no;
  b.append(by, bn);
  const pv = document.getElementById("privacy");
  if (pv && pv.showModal) { const bp = document.createElement("button"); bp.type = "button"; bp.className = "sck-p"; bp.textContent = priv; bp.addEventListener("click", () => pv.showModal()); b.append(bp); }
  box.append(p, b);
  document.body.append(box); document.body.classList.add("sck-open");

  const done = (v) => {
    try { localStorage.setItem("sid_consent", v); } catch { /* navigation privée */ }
    box.remove(); document.body.classList.remove("sck-open");
    if (v === "yes") window.sidStartTracking?.();
  };
  by.addEventListener("click", () => done("yes"));
  bn.addEventListener("click", () => done("no"));
})();
