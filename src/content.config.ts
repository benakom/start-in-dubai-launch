import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Un guide = src/content/guides/<langue>/<slug>.md. URL : /<slug>/ en français, /<langue>/<slug>/ sinon.
// Les traductions portent `key` = slug du guide français (sert aux hreflang et aux liens « related »).
export const LANGS = ["fr", "ar", "en", "es", "nl", "it"] as const;
export type Lang = (typeof LANGS)[number];

export const CLUSTER_KEYS = ["installer", "societe", "visas", "famille", "etudes", "travail", "vie", "argent", "investir", "pays"] as const;

const guides = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/guides" }),
  schema: z.object({
    title: z.string().max(70),            // balise <title>, sans la marque (cible ≤ 65)
    description: z.string().min(90).max(170),
    h1: z.string(),
    keyword: z.string(),                  // mot-clé principal dans la langue de la page
    secondary: z.array(z.string()).default([]),
    cluster: z.enum(CLUSTER_KEYS),
    country: z.string().optional(),       // pages par nationalité
    updated: z.coerce.date(),
    intro: z.string(),                    // chapeau sous le H1 (réponse directe)
    essentials: z.array(z.string()).default([]), // « L'essentiel en 30 secondes » : 3 à 6 faits courts
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    sources: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    related: z.array(z.string()).default([]), // slugs FRANÇAIS (clés), quelle que soit la langue
    order: z.number().default(100),
    key: z.string().optional(),           // slug du guide français (obligatoire pour les traductions)
    image: z.string().optional(),         // illustration propre au guide (sinon celle du thème)
    draft: z.boolean().default(false),
  }),
});

export const collections = { guides };
