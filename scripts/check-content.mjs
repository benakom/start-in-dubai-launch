// Contrôle des guides sans lancer Astro : node scripts/check-content.mjs [langue] [fichier…]
// Vérifie le YAML, les longueurs (title ≤ 65, description 110–165), les champs obligatoires,
// la clé `key` des traductions, le nom du fichier (= slug prévu dans src/data/slugs.json)
// et les liens internes du texte (ils doivent pointer vers un guide existant de la même langue).
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
// COLL=guides (défaut), blog ou services
const COLL = process.env.COLL || "guides";
const DIR = path.join(ROOT, "src/content", COLL);
const PREFIX = { guides: "", blog: "blog/", services: "services/" };
const SLUGS = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/slugs.json"), "utf8"));
delete SLUGS._doc;
const LANGS = ["fr", "ar", "en", "es", "nl", "it"];
const CLUSTERS = ["installer", "societe", "visas", "famille", "etudes", "travail", "vie", "argent", "investir", "pays"];

// URL prévue de chaque guide, par langue (y compris les guides français ajoutés hors de slugs.json)
const urls = new Set(["/", "/guides/", "/blog/", "/services/", ...LANGS.filter((l) => l !== "fr").flatMap((l) => [`/${l}/`, `/${l}/guides/`, `/${l}/blog/`, `/${l}/services/`])]);
// pages des autres collections (blog, services) déjà écrites
for (const [c, pre] of Object.entries(PREFIX)) {
  for (const l of LANGS) {
    const d = path.join(ROOT, "src/content", c, l);
    if (fs.existsSync(d)) for (const f of fs.readdirSync(d)) if (f.endsWith(".md")) urls.add(l === "fr" ? `/${pre}${f.slice(0, -3)}/` : `/${l}/${pre}${f.slice(0, -3)}/`);
  }
}
for (const extra of ["blog-slugs.json", "services-slugs.json"]) {
  const f = path.join(ROOT, "src/data", extra);
  if (!fs.existsSync(f)) continue;
  const pre = extra.startsWith("blog") ? "blog/" : "services/";
  const m = JSON.parse(fs.readFileSync(f, "utf8")); delete m._doc;
  for (const [fr, tr] of Object.entries(m)) { urls.add(`/${pre}${fr}/`); for (const [l, s2] of Object.entries(tr)) urls.add(`/${l}/${pre}${s2}/`); }
}
for (const [fr, tr] of Object.entries(SLUGS)) {
  urls.add(`/${fr}/`);
  for (const [l, s] of Object.entries(tr)) urls.add(`/${l}/${s}/`);
}
for (const l of LANGS) {
  const d = path.join(DIR, l);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d)) if (f.endsWith(".md") && COLL === "guides") urls.add(l === "fr" ? `/${f.slice(0, -3)}/` : `/${l}/${f.slice(0, -3)}/`);
}

const [onlyLang, ...onlyFiles] = process.argv.slice(2);
let errors = 0, files = 0;
const err = (f, m) => { errors++; console.log(`✗ ${f} : ${m}`); };

for (const l of onlyLang ? [onlyLang] : LANGS) {
  const d = path.join(DIR, l);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d).filter((x) => x.endsWith(".md"))) {
    if (onlyFiles.length && !onlyFiles.some((o) => f.includes(o))) continue;
    files++;
    const rel = `${l}/${f}`;
    const src = fs.readFileSync(path.join(d, f), "utf8");
    const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!m) { err(rel, "frontmatter absent ou mal fermé"); continue; }
    let fm;
    try { fm = yaml.load(m[1]); } catch (e) { err(rel, "YAML invalide : " + e.message.split("\n")[0]); continue; }
    const body = m[2];
    for (const k of ["title", "description", "h1", "keyword", "cluster", "updated", "intro"]) if (!fm[k]) err(rel, `champ manquant : ${k}`);
    if (COLL === "services" && (!Array.isArray(fm.steps) || fm.steps.length < 3)) err(rel, "steps : 3 à 6 étapes { t, d } attendues");
    if (fm.title && [...fm.title].length > 65) err(rel, `title trop long (${[...fm.title].length} > 65)`);
    const dl = fm.description ? [...fm.description].length : 0;
    if (fm.description && (dl < 110 || dl > 165)) err(rel, `description : ${dl} caractères (110 à 165)`);
    if (fm.cluster && !CLUSTERS.includes(fm.cluster)) err(rel, `cluster inconnu : ${fm.cluster}`);
    if (!Array.isArray(fm.essentials) || fm.essentials.length < 3) err(rel, "essentials : 3 à 6 faits attendus");
    if (!Array.isArray(fm.faq) || fm.faq.length < 3) err(rel, "faq : au moins 3 questions");
    for (const r of fm.related || []) if (!SLUGS[r] && !fs.existsSync(path.join(DIR, "fr", r + ".md"))) err(rel, `related inconnu (doit être un slug français) : ${r}`);
    if (l !== "fr") {
      const MAP = COLL === "guides" ? SLUGS : (() => { try { const m = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data", COLL + "-slugs.json"), "utf8")); delete m._doc; return m; } catch { return {}; } })();
      if (!fm.key) err(rel, "key manquant (slug de la page française)");
      else if (MAP[fm.key] && MAP[fm.key][l] && MAP[fm.key][l] !== f.slice(0, -3)) err(rel, `nom de fichier attendu : ${MAP[fm.key][l]}.md`);
    }
    if (/15 d[ée]cembre 2026|avant-premi|en primeur/i.test(src)) err(rel, "mention de teasing (15 décembre, avant-première, liste d'attente) : le service est ouvert");
    if (/^#\s/m.test(body)) err(rel, "un H1 (# ) dans le texte : utiliser ## et ###");
    for (const [, href] of body.matchAll(/\]\((\/[^)\s#]*)(?:#[^)]*)?\)/g)) {
      const u = decodeURI(href.endsWith("/") ? href : href + "/");
      if (!urls.has(u)) err(rel, `lien interne vers une page inconnue : ${href}`);
      else if (l === "fr" ? /^\/(ar|en|es|nl|it)\//.test(u) : !u.startsWith(`/${l}/`)) err(rel, `lien vers une autre langue : ${href}`);
    }
    if (/—/.test(src)) err(rel, "tiret cadratin (—) : le remplacer par deux-points, virgule ou parenthèses");
  }
}
console.log(errors ? `\n${errors} problème(s) sur ${files} fichier(s)` : `OK : ${files} fichier(s) sans problème`);
process.exit(errors ? 1 : 0);
