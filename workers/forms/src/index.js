// Start in Dubai : relais entre le site et Brevo (www.startindubai.com/api/*).
// Secrets Cloudflare : BREVO_KEY (clé Brevo), OTP_SECRET (signature des codes). Rien de secret dans le code du site.
//   POST /api/otp/send    { email, lang, website }             -> envoie un code à 6 chiffres, renvoie un jeton signé
//   POST /api/otp/verify  { email, code, token }               -> renvoie une preuve signée « e-mail vérifié » (1 h)
//   POST /api/newsletter  { email, lang, source, page, proof } -> liste Newsletter <LANGUE> (e-mail vérifié obligatoire)
//   POST /api/lead        { name, email, phone, lang, project, when, source, page, news, proof }
//                                                              -> liste Leads <LANGUE> (+ Newsletter si news), e-mail vérifié obligatoire
// Le code n'est jamais stocké : le jeton contient HMAC(e-mail, code, expiration). Les essais et envois sont limités (cache Cloudflare).

const LANGS = ["fr", "en", "ar", "es", "nl", "it"];
const NEWS = { fr: 4, en: 5, ar: 6, es: 7, nl: 8, it: 9 };
const LEADS = { fr: 10, en: 11, ar: 12, es: 13, nl: 14, it: 15 };
const SITE = "https://www.startindubai.com";
const ORIGINS = new Set(["https://www.startindubai.com", "https://startindubai.com", "http://127.0.0.1:4330", "http://localhost:4330"]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ROUTES = ["/api/newsletter", "/api/lead", "/api/otp/send", "/api/otp/verify"];
const CODE_TTL = 600, PROOF_TTL = 3600, MAX_TRIES = 5, MAX_SENDS_EMAIL = 5, MAX_SENDS_IP = 20, WINDOW = 900;

const clip = (v, n) => String(v ?? "").trim().slice(0, n);
const now = () => Math.floor(Date.now() / 1000);

function cors(origin) {
  const h = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", vary: "Origin" };
  if (ORIGINS.has(origin)) Object.assign(h, { "access-control-allow-origin": origin, "access-control-allow-methods": "POST, OPTIONS", "access-control-allow-headers": "content-type", "access-control-max-age": "86400" });
  return h;
}
const json = (body, status, origin) => new Response(JSON.stringify(body), { status, headers: cors(origin) });

/* ---------------- signature */
const enc = new TextEncoder();
const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
async function sign(env, msg) {
  const k = await crypto.subtle.importKey("raw", enc.encode(env.OTP_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64u(await crypto.subtle.sign("HMAC", k, enc.encode(msg)));
}
function same(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
async function sha(s) { return b64u(await crypto.subtle.digest("SHA-256", enc.encode(s))); }
async function proofOk(env, email, proof) {
  const [exp, sig] = String(proof || "").split(".");
  if (!sig || !(Number(exp) >= now())) return false;
  return same(sig, await sign(env, `ok|${email}|${exp}`));
}

/* ---------------- compteurs (cache Cloudflare du site, par centre de données) */
async function bump(key, ttl) {
  const c = caches.default;
  const req = new Request(`${SITE}/__rl/${await sha(key)}`);
  const hit = await c.match(req);
  const n = (hit ? Number(await hit.text()) || 0 : 0) + 1;
  await c.put(req, new Response(String(n), { headers: { "cache-control": `max-age=${ttl}` } }));
  return n;
}

/* ---------------- Brevo */
async function brevo(env, path, body) {
  const r = await fetch("https://api.brevo.com/v3" + path, {
    method: "POST",
    headers: { "api-key": env.BREVO_KEY, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (r.status >= 400) {
    const t = await r.text();
    if (r.status === 400 && /duplicate|already/i.test(t)) return true; // déjà inscrit : pas une erreur
    throw new Error(`brevo ${path} ${r.status} ${t.slice(0, 300)}`);
  }
  return true;
}

const OTP = {
  fr: { s: "Votre code Start in Dubai : {c}", h: "Votre code de vérification", p: "Saisissez ce code sur startindubai.com pour confirmer votre adresse e-mail.", v: "Il est valable 10 minutes.", i: "Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet e-mail." },
  en: { s: "Your Start in Dubai code: {c}", h: "Your verification code", p: "Enter this code on startindubai.com to confirm your email address.", v: "It is valid for 10 minutes.", i: "If you did not request this, simply ignore this email." },
  ar: { s: "رمز Start in Dubai الخاص بكم: {c}", h: "رمز التحقق", p: "أدخلوا هذا الرمز في موقع startindubai.com لتأكيد بريدكم الإلكتروني.", v: "الرمز صالح لمدة 10 دقائق.", i: "إذا لم تطلبوا هذا الرمز، يمكنكم تجاهل هذه الرسالة." },
  es: { s: "Su código de Start in Dubai: {c}", h: "Su código de verificación", p: "Introduzca este código en startindubai.com para confirmar su dirección de email.", v: "Es válido durante 10 minutos.", i: "Si no ha solicitado este código, ignore este email." },
  nl: { s: "Uw code van Start in Dubai: {c}", h: "Uw verificatiecode", p: "Voer deze code in op startindubai.com om uw e-mailadres te bevestigen.", v: "De code is 10 minuten geldig.", i: "Hebt u dit niet aangevraagd? Dan kunt u deze e-mail negeren." },
  it: { s: "Il Suo codice Start in Dubai: {c}", h: "Il Suo codice di verifica", p: "Inserisca questo codice su startindubai.com per confermare il Suo indirizzo email.", v: "È valido per 10 minuti.", i: "Se non ha richiesto questo codice, ignori pure questa email." },
};
const ADDRESS = "1104 Goldcrest Executive, Al Thanyah Fifth, Jumeirah Lakes Towers (JLT), Dubai";

function otpHtml(lang, code) {
  const t = OTP[lang], rtl = lang === "ar", d = rtl ? "rtl" : "ltr", al = rtl ? "right" : "left";
  const stripe = "background:linear-gradient(90deg,#E10600 0 25%,#00732F 25% 50%,#ffffff 50% 75%,#000000 75%);background-color:#E10600";
  return `<!doctype html><html lang="${lang}" dir="${d}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F6F3EE"><div style="display:none;max-height:0;overflow:hidden">${code}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F3EE"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:14px;overflow:hidden" dir="${d}">
<tr><td style="height:5px;${stripe};font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td align="center" style="padding:26px 28px 6px"><img src="${SITE}/assets/img/logo-email.png" width="150" alt="Start in Dubai" style="display:block;width:150px;height:auto;border:0"></td></tr>
<tr><td style="padding:16px 30px 6px;font-family:Arial,Helvetica,sans-serif;text-align:${al}">
<h1 style="margin:0 0 10px;font-size:22px;font-weight:800;color:#111111">${t.h}</h1>
<p style="margin:0 0 18px;font-size:15.5px;line-height:1.55;color:#333333">${t.p}</p></td></tr>
<tr><td align="center" style="padding:4px 30px 8px"><div dir="ltr" style="display:inline-block;padding:16px 26px;border-radius:12px;background:#0B0B0B;color:#ffffff;font-family:'Courier New',Courier,monospace;font-size:34px;font-weight:700;letter-spacing:10px">${code}</div></td></tr>
<tr><td style="padding:14px 30px 26px;font-family:Arial,Helvetica,sans-serif;text-align:${al}">
<p style="margin:0 0 8px;font-size:14px;line-height:1.5;color:#333333;font-weight:700">${t.v}</p>
<p style="margin:0;font-size:13px;line-height:1.5;color:#666666">${t.i}</p></td></tr>
<tr><td style="padding:14px 30px 22px;border-top:1px solid #eeeeee;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#888888;text-align:${al}">Start in Dubai · ${ADDRESS}</td></tr>
</table></td></tr></table></body></html>`;
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const origin = req.headers.get("origin") || "";
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    if (req.method !== "POST" || !ROUTES.includes(url.pathname)) return json({ ok: false, error: "not_found" }, 404, origin);
    if (!ORIGINS.has(origin)) return json({ ok: false, error: "origin" }, 403, origin);
    if (Number(req.headers.get("content-length") || 0) > 6000) return json({ ok: false, error: "too_large" }, 413, origin);

    let d;
    try { d = await req.json(); } catch { return json({ ok: false, error: "bad_json" }, 400, origin); }
    if (d.website) return json({ ok: true }, 200, origin); // piège à robots
    const lang = LANGS.includes(d.lang) ? d.lang : "en";
    const email = clip(d.email, 120).toLowerCase();
    const base = { LANGUE: lang, SOURCE: clip(d.source, 60) || "site", PAGE: clip(d.page, 200) };

    try {
      if (url.pathname === "/api/otp/send") {
        if (!EMAIL.test(email) || email.endsWith(".invalid")) return json({ ok: false, error: "email" }, 400, origin);
        const ip = req.headers.get("cf-connecting-ip") || "0";
        if ((await bump(`ip|${ip}`, WINDOW)) > MAX_SENDS_IP || (await bump(`send|${email}`, WINDOW)) > MAX_SENDS_EMAIL)
          return json({ ok: false, error: "rate" }, 429, origin);
        const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, "0");
        const exp = now() + CODE_TTL;
        const token = `${exp}.${await sign(env, `otp|${email}|${code}|${exp}`)}`;
        await brevo(env, "/smtp/email", {
          sender: { name: "Start in Dubai", email: "hello@startindubai.com" }, to: [{ email }],
          subject: OTP[lang].s.replace("{c}", code), htmlContent: otpHtml(lang, code), tags: ["otp"],
        });
        return json({ ok: true, token }, 200, origin);
      }

      if (url.pathname === "/api/otp/verify") {
        const code = clip(d.code, 6).replace(/\D/g, "");
        const [exp, sig] = clip(d.token, 200).split(".");
        if (!sig || code.length !== 6 || !EMAIL.test(email)) return json({ ok: false, error: "bad" }, 400, origin);
        if (!(Number(exp) >= now())) return json({ ok: false, error: "expired" }, 400, origin);
        if ((await bump(`try|${sig}`, CODE_TTL + 60)) > MAX_TRIES) return json({ ok: false, error: "tries" }, 429, origin);
        if (!same(sig, await sign(env, `otp|${email}|${code}|${exp}`))) return json({ ok: false, error: "code" }, 400, origin);
        const pexp = now() + PROOF_TTL;
        return json({ ok: true, proof: `${pexp}.${await sign(env, `ok|${email}|${pexp}`)}` }, 200, origin);
      }

      if (url.pathname === "/api/newsletter") {
        if (!EMAIL.test(email)) return json({ ok: false, error: "email" }, 400, origin);
        if (!(await proofOk(env, email, d.proof))) return json({ ok: false, error: "unverified" }, 403, origin);
        await brevo(env, "/contacts", { email, attributes: base, listIds: [NEWS[lang]], updateEnabled: true });
        return json({ ok: true }, 200, origin);
      }

      // lead : sans e-mail, rien à faire côté Brevo (le lead part déjà dans Oleadoo) ; avec e-mail, il doit être vérifié
      if (!EMAIL.test(email) || email.endsWith(".invalid")) return json({ ok: true, skipped: "no_email" }, 200, origin);
      if (!(await proofOk(env, email, d.proof))) return json({ ok: false, error: "unverified" }, 403, origin);
      const attrs = { ...base, FIRSTNAME: clip(d.name, 60), TELEPHONE: clip(d.phone, 24), PROJET: clip(d.project, 120), ECHEANCE: clip(d.when, 60) };
      const lists = d.news === true ? [LEADS[lang], NEWS[lang]] : [LEADS[lang]];
      await brevo(env, "/contacts", { email, attributes: attrs, listIds: lists, updateEnabled: true });
      return json({ ok: true }, 200, origin);
    } catch (e) {
      console.error(String(e));
      return json({ ok: false, error: "upstream" }, 502, origin);
    }
  },
};
