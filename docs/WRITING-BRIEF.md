# Consignes de rédaction des guides START IN DUBAI

Lire d'abord `docs/SEO-PLAN.md` (carte des pages, règles de partage avec cevitas.ae).

## Le fichier

Un guide = `src/content/guides/<slug>.md` (le slug donne l'URL `/<slug>/`). Frontmatter YAML exact (schéma dans `src/content.config.ts`, la construction échoue sinon) :

```yaml
---
title: "…"            # ≤ 65 caractères, mot-clé principal en tête, sans « START IN DUBAI » (ajouté automatiquement)
description: "…"      # 110 à 165 caractères, donne envie de cliquer, contient le mot-clé
h1: "…"               # titre visible, naturel, contient le mot-clé
keyword: "…"          # mot-clé principal de la carte
secondary: ["…", "…"] # mots-clés secondaires de la carte
cluster: societe      # installer | societe | visas | famille | etudes | travail | vie | argent | investir | pays
country: "Maroc"      # seulement pour les pages par nationalité
updated: 2026-11-27
intro: "…"            # 2 à 4 phrases qui répondent directement à la question (cible du featured snippet)
faq:                  # 4 à 6 questions réelles (« Autres questions posées » de Google), réponses de 2 à 4 phrases
  - q: "…"
    a: "…"
sources:              # 2 à 6 sources officielles réellement consultées
  - label: "…"
    url: "https://…"
related: ["slug-1", "slug-2", "slug-3"]   # 3 à 5 slugs de la carte
order: 10             # ordre d'affichage dans le cluster (le guide principal du cluster = 1)
---
```

Corps en Markdown : uniquement des `##` et `###` (le H1 vient du frontmatter), paragraphes courts, listes, un ou deux tableaux quand ils aident (comparaison, étapes, documents). Pas de HTML.

## Le fond (YMYL : visas, argent, fiscalité)

- **Exactitude avant tout.** Vérifier chaque fait réglementaire sur une source officielle (u.ae, icp.gov.ae, gdrfad.gov.ae, mohre.gov.ae, tax.gov.ae, khda.gov.ae, aefe.fr, ambassades, sites officiels des zones franches, diplomatie.gouv.fr, consulats). Mettre ces sources dans `sources`.
- Quand un montant ou un délai varie ou n'est pas sûr, donner un ordre de grandeur prudent (« à partir de… », « en général… ») ou dire qu'il varie, **jamais** un chiffre inventé. Si une règle dépend de la nationalité ou change souvent, le dire et renvoyer à la source officielle.
- Pas de statistiques, de témoignages, de clients ou de résultats inventés. Ne rien affirmer sur START IN DUBAI au-delà de : accompagnement de A à Z (société, compte bancaire, visas et Golden Visa, logement, installation de la famille, études supérieures), un seul interlocuteur, dans votre langue (arabe, français, anglais, espagnol, néerlandais, italien), immobilier avec Cevitas Real Estate (agence agréée RERA, ORN 49294), premier échange gratuit et sans engagement via le formulaire (lien `/#inscription` qui ouvre le formulaire, ou `/<langue>/#inscription`). **Le service est ouvert** : ne jamais parler d'avant-première, de liste d'attente, d'ouverture le 15 décembre ni de compte à rebours. Aucun prix, délai garanti ou résultat garanti pour le service.
- Immobilier : ne pas écrire de page ou de section sur des projets, prix, quartiers à acheter. Une phrase et un lien vers https://www.cevitas.ae suffisent.

## La forme

- Français clair, vouvoiement, phrases courtes, ton expert et chaleureux, sans jargon inutile. Écrire pour les Marocains du monde et les francophones du monde entier : jamais de formulation qui exclut une nationalité.
- 1 500 à 2 500 mots pour un guide principal, 1 200 à 2 000 pour les autres. Répondre aux vraies questions des gens (autocomplete et « Autres questions posées »), dans l'ordre où ils se les posent.
- Mot-clé principal dans le title, le H1, l'intro et un H2, naturellement. Mots-clés secondaires répartis dans les H2/H3 et le texte. Pas de bourrage.
- 3 à 6 liens internes dans le corps, vers d'autres guides de la carte : `[texte d'ancre descriptif](/slug/)`. Ancres variées et naturelles.
- Éviter les tics d'IA : pas de « Dans un monde où… », « Plongeons », « En conclusion », pas de tirets cadratins (—) : utiliser deux-points, virgules ou parenthèses. Pas d'emojis.
- Terminer par une section utile (checklist, étapes, erreurs à éviter), pas par une conclusion creuse. Le bloc d'appel à l'action est ajouté automatiquement par la mise en page.

## Vérifier avant de rendre

Plusieurs rédacteurs travaillent en même temps dans ce dossier : **ne pas lancer `astro build`** ni toucher à d'autres fichiers que les siens. Vérifier soi-même les longueurs (title ≤ 65, description 110–165) et la validité YAML (guillemets doubles autour des textes, apostrophes typographiques ou échappées). Relire chaque chiffre et chaque règle contre sa source.
