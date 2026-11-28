// START IN DUBAI : relais entre le site et Brevo (www.startindubai.com/api/*).
// La clé Brevo est un secret Cloudflare (BREVO_KEY), jamais dans le code du site.
//   POST /api/newsletter  { email, lang, source, page, website }          -> double confirmation, liste Newsletter <LANGUE>
//   POST /api/lead        { name, email, phone, lang, project, when, source, page, news, website }
//                                                                         -> contact dans la liste Leads <LANGUE> (+ newsletter si news)

const LANGS = ["fr", "en", "ar", "es", "nl", "it"];
const NEWS = { fr: 4, en: 5, ar: 6, es: 7, nl: 8, it: 9 };
const LEADS = { fr: 10, en: 11, ar: 12, es: 13, nl: 14, it: 15 };
const DOI = { fr: 1, en: 9, ar: 17, es: 25, nl: 33, it: 41 };
const SITE = "https://www.startindubai.com";
const ORIGINS = new Set(["https://www.startindubai.com", "https://startindubai.com", "http://127.0.0.1:4330", "http://localhost:4330"]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const clip = (v, n) => String(v ?? "").trim().slice(0, n);

function cors(origin) {
  const h = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", vary: "Origin" };
  if (ORIGINS.has(origin)) Object.assign(h, { "access-control-allow-origin": origin, "access-control-allow-methods": "POST, OPTIONS", "access-control-allow-headers": "content-type", "access-control-max-age": "86400" });
  return h;
}
const json = (body, status, origin) => new Response(JSON.stringify(body), { status, headers: cors(origin) });

async function brevo(env, path, body) {
  const r = await fetch("https://api.brevo.com/v3" + path, {
    method: "POST",
    headers: { "api-key": env.BREVO_KEY, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (r.status >= 400) {
    const t = await r.text();
    // un contact déjà inscrit n'est pas une erreur pour le visiteur
    if (r.status === 400 && /duplicate|already/i.test(t)) return true;
    throw new Error(`brevo ${path} ${r.status} ${t.slice(0, 300)}`);
  }
  return true;
}

function doi(env, email, lang, attrs) {
  const home = lang === "fr" ? "/" : `/${lang}/`;
  return brevo(env, "/contacts/doubleOptinConfirmation", {
    email, attributes: attrs, includeListIds: [NEWS[lang]], templateId: DOI[lang],
    redirectionUrl: `${SITE}${home}?newsletter=ok`,
  });
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const origin = req.headers.get("origin") || "";
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    if (req.method !== "POST" || !["/api/newsletter", "/api/lead"].includes(url.pathname)) return json({ ok: false, error: "not_found" }, 404, origin);
    if (!ORIGINS.has(origin)) return json({ ok: false, error: "origin" }, 403, origin);
    if (Number(req.headers.get("content-length") || 0) > 6000) return json({ ok: false, error: "too_large" }, 413, origin);

    let d;
    try { d = await req.json(); } catch { return json({ ok: false, error: "bad_json" }, 400, origin); }
    if (d.website) return json({ ok: true }, 200, origin); // piège à robots
    const lang = LANGS.includes(d.lang) ? d.lang : "en";
    const email = clip(d.email, 120).toLowerCase();
    const base = { LANGUE: lang, SOURCE: clip(d.source, 60) || "site", PAGE: clip(d.page, 200) };

    try {
      if (url.pathname === "/api/newsletter") {
        if (!EMAIL.test(email)) return json({ ok: false, error: "email" }, 400, origin);
        await doi(env, email, lang, base);
        return json({ ok: true }, 200, origin);
      }
      // lead : sans e-mail réel, rien à faire côté Brevo (le lead part déjà dans Oleadoo)
      if (!EMAIL.test(email) || email.endsWith(".invalid")) return json({ ok: true, skipped: "no_email" }, 200, origin);
      const attrs = { ...base, FIRSTNAME: clip(d.name, 60), TELEPHONE: clip(d.phone, 24), PROJET: clip(d.project, 120), ECHEANCE: clip(d.when, 60) };
      await brevo(env, "/contacts", { email, attributes: attrs, listIds: [LEADS[lang]], updateEnabled: true });
      if (d.news === true) await doi(env, email, lang, base);
      return json({ ok: true }, 200, origin);
    } catch (e) {
      console.error(String(e));
      return json({ ok: false, error: "upstream" }, 502, origin);
    }
  },
};
