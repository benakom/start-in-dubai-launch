import { getCollection, type CollectionEntry } from "astro:content";
import { LANGS, type Lang } from "../content.config";
import fr from "../../i18n/fr.json";
import ar from "../../i18n/ar.json";
import en from "../../i18n/en.json";
import es from "../../i18n/es.json";
import nl from "../../i18n/nl.json";
import it from "../../i18n/it.json";
import ffr from "../../i18n/form-fr.json";
import far from "../../i18n/form-ar.json";
import fen from "../../i18n/form-en.json";
import fes from "../../i18n/form-es.json";
import fnl from "../../i18n/form-nl.json";
import fit from "../../i18n/form-it.json";

export const SITE_URL = "https://www.startindubai.com";
export const PREVIEW = process.env.SID_PREVIEW === "1";

// Textes de la page de lancement (mêmes blocs, mêmes traductions)
export const LANDING: Record<Lang, Record<string, string>> = { fr, ar, en, es, nl, it };
export const FORM: Record<Lang, Record<string, string>> = { fr: ffr, ar: far, en: fen, es: fes, nl: fnl, it: fit };

export type Guide = CollectionEntry<"guides">;
export const langOf = (g: Guide) => g.id.split("/")[0] as Lang;
export const slugOf = (g: Guide) => g.id.split("/").slice(1).join("/");
export const keyOf = (g: Guide) => (langOf(g) === "fr" ? slugOf(g) : g.data.key || slugOf(g));
export const guidePath = (g: Guide) => (langOf(g) === "fr" ? `/${slugOf(g)}/` : `/${langOf(g)}/${slugOf(g)}/`);
export const homePath = (l: Lang) => (l === "fr" ? "/" : `/${l}/`);
export const guidesPath = (l: Lang) => (l === "fr" ? "/guides/" : `/${l}/guides/`);
export const abs = (p: string) => SITE_URL + encodeURI(decodeURI(p));

let cache: Guide[] | null = null;
export async function allGuides() {
  cache ??= (await getCollection("guides", (g) => !g.data.draft)).sort((a, b) => a.data.order - b.data.order);
  return cache;
}

// Versions d'un même guide dans les autres langues : { fr: "/…/", en: "/en/…/" }
export async function translations(key: string) {
  const out: Partial<Record<Lang, string>> = {};
  for (const g of await allGuides()) if (keyOf(g) === key) out[langOf(g)] = guidePath(g);
  return out;
}

// Les 6 langues dans l'ordre, avec l'URL de la page dans chaque langue (repli : guides de la langue)
export function alternates(map: Partial<Record<Lang, string>>, fallback: (l: Lang) => string) {
  return LANGS.map((l) => ({ lang: l, href: map[l] || fallback(l), exists: !!map[l] }));
}

export const readingMinutes = (body: string) => Math.max(3, Math.round(body.split(/\s+/).length / 220));
