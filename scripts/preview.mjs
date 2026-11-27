// Après `SID_PREVIEW=1 astro build` : la version d'aperçu ne doit jamais être indexée.
// Ajoute noindex aux pages de lancement (copiées telles quelles depuis public/) et bloque tous les robots.
import fs from "node:fs";
import path from "node:path";
const DIST = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../dist");
let n = 0;
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
  const p = path.join(d, e.name);
  if (e.isDirectory()) return walk(p);
  if (!e.name.endsWith(".html")) return;
  let h = fs.readFileSync(p, "utf8");
  if (!/name="robots"/.test(h)) { h = h.replace(/<head>/, '<head>\n  <meta name="robots" content="noindex, nofollow">'); fs.writeFileSync(p, h); n++; }
});
walk(DIST);
fs.writeFileSync(path.join(DIST, "robots.txt"), "User-agent: *\nDisallow: /\n");
fs.rmSync(path.join(DIST, "CNAME"), { force: true });
fs.writeFileSync(path.join(DIST, "CNAME"), "preview.startindubai.com\n");
console.log(`aperçu : noindex ajouté à ${n} page(s), robots.txt bloque tout, CNAME = preview.startindubai.com`);
