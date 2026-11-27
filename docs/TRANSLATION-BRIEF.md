# Traduire un guide START IN DUBAI (ar, en, es, nl, it)

Lire d'abord `docs/WRITING-BRIEF.md` (règles de fond et de forme : elles s'appliquent aussi aux traductions).

## Le principe

On ne fait pas du mot à mot : on écrit la page qu'un lecteur natif de la langue cherche sur Google, à partir du guide français, **avec exactement les mêmes faits** (chiffres, règles, délais, sources, nuances de prudence). On ne rajoute aucun fait qui n'est pas dans le guide français ; on n'en retire aucun.

Public : START IN DUBAI accompagne tous ceux qui veulent s'installer, investir (au sens large), créer leur société, étudier ou vivre en famille à Dubaï et aux Émirats. L'équipe parle **arabe, français, anglais, espagnol, néerlandais et italien**. Partout où le français dit « en français et en darija » ou « francophone », écrire « dans votre langue (arabe, français, anglais, espagnol, néerlandais, italien) » ou simplement « in your language ». Ne jamais exclure ni stigmatiser une nationalité.

Registre :
- **en** : anglais international clair (orthographe britannique), « you ».
- **es** : espagnol neutre compréhensible en Espagne et en Amérique latine, « usted » évité : tutoiement de marque courant (« tú ») ; vocabulaire « empresa », « visado ».
- **nl** : néerlandais standard compréhensible aux Pays-Bas et en Flandre, « u ».
- **it** : italien standard, « tu » de marque (ton chaleureux) ou « Lei » cohérent sur tout le texte : utiliser « tu ».
- **ar** : arabe standard moderne (fusha) simple, lisible par un Marocain, un Algérien, un Tunisien, un Égyptien ou un Émirien. Chiffres occidentaux (0-9). Noms officiels des autorités en arabe quand ils existent (الهيئة الاتحادية للهوية والجنسية…), sinon le sigle latin entre parenthèses.

## Le fichier

`src/content/guides/<langue>/<slug>.md`, où `<slug>` est **exactement** celui de `src/data/slugs.json` pour ce guide et cette langue.

Frontmatter (même schéma que le français, plus `key`) :

```yaml
---
title: "…"          # ≤ 65 caractères. Commence par la requête que les natifs tapent vraiment (ex. en : "Company formation in Dubai", es : "Crear empresa en Dubái"), pas une traduction littérale du titre français.
description: "…"    # 110 à 165 caractères, avec la requête principale.
h1: "…"
keyword: "…"        # requête principale dans la langue (celle qu'un natif tape sur Google)
secondary: ["…"]    # 4 à 6 variantes réelles dans la langue
cluster: societe    # identique au français
country: "…"        # seulement si le français en a un : nom du pays dans la langue
updated: 2026-11-27 # identique au français
intro: "…"          # réponse directe en 2 à 4 phrases
essentials:         # 4 à 6 faits clés, une phrase courte chacun, tirés du guide (chiffres, délais, conditions). C'est l'encadré « L'essentiel en 30 secondes ».
  - "…"
faq:                # toutes les questions du français, traduites ; on peut reformuler la question comme un natif la poserait
  - q: "…"
    a: "…"
sources:            # mêmes URL que le français ; libellés traduits
  - label: "…"
    url: "https://…"
related: ["slug-francais-1", "slug-francais-2"]   # INCHANGÉ : on garde les slugs français
order: 1            # identique
key: "slug-du-guide-francais"
---
```

Texte : tout le guide (même plan, mêmes tableaux, mêmes listes), `##` et `###` seulement, pas de HTML.

**Liens internes** : chaque lien `[ancre](/slug-francais/)` devient `[ancre traduite](/<langue>/<slug-de-la-langue>/)` en prenant le slug dans `src/data/slugs.json`. Un lien vers l'accueil `/` devient `/<langue>/`, `/guides/` devient `/<langue>/guides/`. Liens externes : inchangés.

Apostrophes et guillemets : mettre chaque valeur YAML entre guillemets doubles ; un guillemet double à l'intérieur s'écrit `\"` ou se remplace par « » ou “ ”. Pas de tiret cadratin (—).

## Vérifier

```bash
export PATH=~/.local/node-v22.12.0-darwin-arm64/bin:$PATH
node scripts/check-content.mjs <langue> <slug>
```

Corriger jusqu'à « OK ». **Ne pas lancer `astro build` ni `npm`**, ne toucher à aucun autre fichier que les siens : plusieurs traducteurs et un développeur travaillent dans ce dossier en même temps.
