import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Un guide = un fichier Markdown dans src/content/guides/. Le nom du fichier donne l'URL : /<nom>/
export const CLUSTERS = {
  installer: "S'installer à Dubaï",
  societe: "Créer sa société",
  visas: "Visas et résidence",
  famille: "Famille et écoles",
  etudes: "Études",
  travail: "Travailler",
  vie: "Vivre à Dubaï",
  argent: "Banque et fiscalité",
  investir: "Investir",
  pays: "Selon votre pays",
} as const;

const guides = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/guides" }),
  schema: z.object({
    title: z.string().max(65),            // balise <title>, sans la marque
    description: z.string().min(110).max(165),
    h1: z.string(),
    keyword: z.string(),                  // mot-clé principal (une seule page par mot-clé)
    secondary: z.array(z.string()).default([]),
    cluster: z.enum(Object.keys(CLUSTERS) as [keyof typeof CLUSTERS, ...(keyof typeof CLUSTERS)[]]),
    country: z.string().optional(),       // pages par nationalité
    updated: z.coerce.date(),
    intro: z.string(),                    // chapeau affiché sous le H1 (réponse directe)
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    sources: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    related: z.array(z.string()).default([]),
    order: z.number().default(100),
    draft: z.boolean().default(false),
  }),
});

export const collections = { guides };
