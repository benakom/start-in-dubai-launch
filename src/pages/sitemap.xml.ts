import { getCollection } from "astro:content";
import { SITE } from "../data/site";

export async function GET() {
  const guides = await getCollection("guides", (g) => !g.data.draft);
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: `${SITE.url}/`, lastmod: today },
    { loc: `${SITE.url}/guides/`, lastmod: today },
    ...guides.map((g) => ({ loc: `${SITE.url}/${g.id}/`, lastmod: g.data.updated.toISOString().slice(0, 10) })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`)
    .join("\n")}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
