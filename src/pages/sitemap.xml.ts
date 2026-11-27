// Sitemap multilingue : accueil (6 langues), services, guides, blog, avec leurs versions dans les autres langues.
import { LANGS, type Lang } from "../content.config";
import { allGuides, entries, entryPath, hubPath, keyOf, langOf, guidePath, homePath, guidesPath, abs } from "../lib/site";

type Url = { loc: string; lastmod: string; alts: { lang: string; href: string }[] };
const alt = (m: Partial<Record<Lang, string>>) => {
  const a = LANGS.filter((l) => m[l]).map((l) => ({ lang: l, href: abs(m[l]!) }));
  const x = m.fr ? abs(m.fr) : a[0]?.href;
  return x ? [...a, { lang: "x-default", href: x }] : a;
};

export async function GET() {
  const today = new Date().toISOString().slice(0, 10);
  const guides = await allGuides();
  const homes = Object.fromEntries(LANGS.map((l) => [l, homePath(l)]));
  const hubs = Object.fromEntries(LANGS.map((l) => [l, guidesPath(l)]));
  const urls: Url[] = [
    ...LANGS.map((l) => ({ loc: abs(homePath(l)), lastmod: today, alts: alt(homes) })),
    ...LANGS.map((l) => ({ loc: abs(guidesPath(l)), lastmod: today, alts: alt(hubs) })),
  ];
  const byKey = new Map<string, Partial<Record<Lang, string>>>();
  for (const g of guides) {
    const m = byKey.get(keyOf(g)) || {};
    m[langOf(g)] = guidePath(g);
    byKey.set(keyOf(g), m);
  }
  for (const g of guides) urls.push({ loc: abs(guidePath(g)), lastmod: g.data.updated.toISOString().slice(0, 10), alts: alt(byKey.get(keyOf(g))!) });

  // services et blog : pages de rubrique + pages, avec leurs traductions
  for (const c of ["services", "blog"] as const) {
    const list = await entries(c);
    const langs = LANGS.filter((l) => list.some((e: any) => langOf(e) === l));
    const hm = Object.fromEntries(langs.map((l) => [l, hubPath(c, l)]));
    for (const l of langs) urls.push({ loc: abs(hubPath(c, l)), lastmod: today, alts: alt(hm) });
    const km = new Map<string, Partial<Record<Lang, string>>>();
    for (const e of list) { const m = km.get(keyOf(e)) || {}; m[langOf(e)] = entryPath(c, e); km.set(keyOf(e), m); }
    for (const e of list) urls.push({ loc: abs(entryPath(c, e)), lastmod: e.data.updated.toISOString().slice(0, 10), alts: alt(km.get(keyOf(e))!) });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n${u.alts.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.href}"/>`).join("\n")}\n  </url>`).join("\n")}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
