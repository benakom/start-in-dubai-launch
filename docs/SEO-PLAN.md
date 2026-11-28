# Plan SEO startindubai.com — 27/11/2026

Objectif : être n° 1 sur Google, dans tous les pays francophones (Maroc, Algérie, Tunisie, France, Belgique, Suisse, Québec, Afrique de l'Ouest…), sur tout ce qui touche à s'installer, investir, créer sa société, étudier et vivre en famille à Dubaï et aux Émirats.

## 1. Point de départ mesuré (27/11/2026)

| Constat | Mesure | Conséquence |
|---|---|---|
| Historique du domaine | startindubai.com existe depuis 2001 mais n'a jamais hébergé de vrai site (pages « under construction », hébergeur par défaut, parking). Réenregistré le 31/10/2023. | **Aucune autorité héritée.** Le mot « Dubai » dans le domaine aide le taux de clic et la mémorisation, pas le classement : Google a neutralisé l'avantage des domaines à mots-clés en 2012. Le classement viendra du contenu et des liens. |
| Backlinks | Non mesurables aujourd'hui (Semrush à 0 unité API). Vu l'historique, probablement quasi nuls. | Netlinking = chantier n° 1 hors site. |
| startindubai.ae | Redirige en 301 vers www.startindubai.com (HTTP). | Pas de contenu dupliqué. À vérifier en HTTPS une fois le certificat .com émis. |
| Site en ligne | Une seule page (lancement + inscription), sans robots.txt ni sitemap. HTTPS en cours d'activation (DNS corrigé le 27/11). | Décision : **seule cette page reste en ligne** jusqu'à nouvel ordre. Les guides se préparent sur la branche `seo/astro-guides`. |
| Demande (Google France, Semrush 15/11) | ≈ 20 000 recherches/mois sur nos thèmes hors immobilier, location et tourisme ; KD 6 à 26 ; concurrents classés 20e à 70e. | Terrain **gagnable**. Belgique, Suisse, Québec, Maghreb s'ajoutent (non mesurés, confirmés par l'autocomplete Google dans les 7 pays). |
| Valeur commerciale | CPC 5 à 9 € sur les requêtes société (« ouvrir une société à Dubaï » 7,32 €, « ouvrir société dubai » 9,78 €). | Les pages société sont les plus rentables : priorité n° 1. |

Ce qui ne marchera pas, franchement :
- Être n° 1 partout en quelques semaines. Sur la longue traîne peu concurrencée (société, visas par nationalité, études), viser le top 3 en 3 à 6 mois. Sur les têtes (« s'installer à Dubaï », « golden visa dubai »), 6 à 12 mois **avec** des liens.
- Garder le contenu hors ligne retarde d'autant le classement : Google met des semaines à indexer et à faire confiance à un domaine neuf. Chaque semaine de mise en ligne gagnée avant le 15/12 compte.
- Les requêtes touristiques (monnaie, vols, hôtels, Burj Khalifa, « dirham euro » 9 900) font du volume sans clients : on ne les chasse pas, sauf un outil utile (convertisseur) plus tard.

## 2. Règles de partage avec les autres sites du réseau

- **cevitas.ae** garde tout l'immobilier : « investir dans l'immobilier à Dubaï », « immobilier dubai investir », projets, promoteurs, prix, quartiers, location. startindubai.com ne crée aucune page projet, prix ou quartier ; il renvoie vers cevitas.ae.
- **startindubai.com** prend « investir à Dubaï » au sens large (business, résidence, Golden Visa, s'installer en investisseur), et tout le reste : s'installer, société, visas, banque, fiscalité, études, famille, travail, vie quotidienne, pages par nationalité.
- **Site personnel du fondateur** : jamais de lien ni de mention (décision du 28/11).; les pages pays de startindubai.com portent sur **l'installation** (visa, documents, transferts, vie sur place).
- Une seule page par mot-clé sur l'ensemble des trois sites. Les sites se relient entre eux.

## 3. Carte des pages (une page = un mot-clé principal)

Volumes : Google France, Semrush 15/11/2026 (`~/code/seo-data`). « AC » = confirmé par l'autocomplete Google (FR, BE, CA, CH, MA, DZ, TN) mais non mesuré.

### Vague 1 (en préparation)

| URL | Mot-clé principal | Volume FR / KD | Mots-clés secondaires |
|---|---|---|---|
| /creer-sa-societe-a-dubai/ | création société dubai | 390 / 24 | créer société dubai 320, ouvrir societe a dubai 210, societe dubai 210, ouvrir une société à dubai 140, monter une société à dubai 90, créer une entreprise à dubai (AC) |
| /zone-franche-dubai/ | freezone dubai | 260 / 19 | zone franche dubai 170, société free zone dubaï 90, free zone dubai 110, mainland ou free zone |
| /societe-offshore-dubai/ | société offshore dubai | 260 / 10 | societe offshore dubai 210, offshore société 140, comptes offshore 260 |
| /freelance-dubai/ | freelance dubai | AC | freelance visa dubai, freelance permit, licence freelance |
| /golden-visa-dubai/ | golden visa dubai | 590 / 21 | golden visa 480, dubai golden visa 390, golden visa dubai conditions 50, golden visa dubai prix (AC) |
| /visa-residence-dubai/ | visa résidence dubai | AC | visa investisseur dubai 110, résidence dubai 110, emirates id, carte de résident |
| /ouvrir-un-compte-bancaire-a-dubai/ | ouvrir un compte bancaire à dubai | 110+110+90+70 / 8-12 | banque dubai 210, banque à dubai 140, compte bancaire non résident (AC) |
| /impots-dubai/ | impot dubai | 320 / 14 | impot societe dubai 210, tva dubai 170, fiscalité dubai 140, imposition dubai (AC) |
| /s-installer-a-dubai/ | s'installer à dubai | AC (tête) | comment s'installer à dubai, expatriation dubai 210, déménager à dubai 170, partir vivre à dubai 140, s'installer aux émirats |
| /vivre-a-dubai/ | vivre à dubai | 320 / 19 | vivre à dubaï avantages et inconvénients 140, vivre dubai 140, vivre en couple à dubai 140 |
| /cout-de-la-vie-dubai/ | coût de la vie dubai | 70 / 21 + AC | coût de la vie dubai par mois, vs france, en euros |
| /travailler-a-dubai/ | travailler à dubai | 110 / 13 | emploi à dubaï 320, travail dubai 260, emploi sur dubai 320, salaire dubai (AC) |
| /investir-a-dubai/ | investir à dubai (sens large) | AC | comment investir à dubai, investir aux émirats arabes unis, investir à dubaï avis |
| /s-installer-a-dubai-en-famille/ | s'installer à dubai en famille | AC | vivre à dubai avec sa famille, expatriation dubai famille, vivre à dubaï avec des enfants |
| /ecoles-francaises-dubai/ | lycée français dubai | 480 / 26 | école française dubai 480, lycée français international dubai 390, lycée jean mermoz dubai 110, écoles françaises dubai 110 |
| /etudier-a-dubai/ | étudier à dubai | AC | études à dubai, université dubai, université dubaï française, étudier à dubaï après le bac, en français, prix |
| /visa-etudiant-dubai/ | visa étudiant dubai | AC | visa étudiant uae, visa étudiant dubai prix, student visa dubai |
| /s-installer-a-dubai-depuis-le-maroc/ | s'installer à dubai depuis le maroc | AC | visa dubai pour les marocains, travailler à dubai pour les marocains, contrat de travail dubai marocains |
| /s-installer-a-dubai-depuis-l-algerie/ | s'installer à dubai pour un algérien | AC | visa dubai pour les algériens, travailler à dubaï pour les algériens, étudier à dubaï pour algérien |
| /s-installer-a-dubai-depuis-la-tunisie/ | s'installer à dubai depuis la tunisie | AC | visa dubai pour les tunisiens, contrat de travail dubai tunisiens |
| /s-installer-a-dubai-depuis-le-senegal/ | s'installer à dubai depuis le sénégal | AC | visa dubai sénégal, voyager à dubai depuis le sénégal |
| /s-installer-a-dubai-depuis-la-france/ | s'installer à dubai depuis la france | AC | expatriation dubai france, s'installer à dubai français, impôts dubaï expatriés français 90 |
| /s-installer-a-dubai-depuis-la-belgique/ | s'installer à dubai depuis la belgique | AC | visa dubai belgique |
| /s-installer-a-dubai-depuis-la-suisse/ | s'installer à dubai depuis la suisse | AC | visa dubai suisse, fiscalité dubai suisse |
| /s-installer-a-dubai-depuis-le-canada/ | s'installer à dubai depuis le québec | AC | visa dubai pour canadien, coût de la vie dubai vs canada |

### Vague 2 (après mesure des premiers résultats)

convention fiscale France–Émirats (140+110), mainland ou free zone, coût de création d'une société (avec grille de prix sourcée), Dubaï ou Abu Dhabi (70 + « dubai et abu dhabi » 390), retraite à Dubaï, universités françaises aux Émirats, permis de conduire, emirates id, salaire à Dubaï, assurance santé, pages pays Côte d'Ivoire, Luxembourg, Liban, Cameroun, RDC ; outils (coût de la vie, éligibilité Golden Visa, coût de création de société, convertisseur dirham–euro).

## 4. Technique

- Astro (site statique) dans ce dépôt, publié par GitHub Pages via GitHub Actions. La page de lancement (`public/index.html`) reste l'accueil.
- Chaque guide : title ≤ 65 caractères avec le mot-clé en tête, meta description 110–165, H1 unique, chapeau qui répond directement, sommaire, FAQ (schema FAQPage), sources officielles, encadré « la rédaction START IN DUBAI » (Organization), Article + BreadcrumbList en JSON-LD, liens internes vers 3 à 6 guides proches.
- `sitemap.xml` et `robots.txt` générés ; hreflang `fr` + `x-default` (une seule version française pour toute la francophonie : pas de pages dupliquées par pays).
- À faire : vérifier le domaine dans **Google Search Console** et **Bing Webmaster Tools** (enregistrement TXT chez GoDaddy), puis soumettre le sitemap.

## 5. Autorité (le vrai levier)

1. Liens depuis l'écosystème : cevitas.ae vers les guides pertinents (pas de lien en pied de page sur toutes les pages : des liens éditoriaux).
2. Profils et annuaires sérieux : Google Business Profile si START IN DUBAI a une adresse, LinkedIn, Instagram, annuaires Dubaï (dubaidirectory.com, dubaicompanieslist.com), CCI France EAU, lepetitjournal.com Dubaï. Liste : `~/code/seo-data/semrush-2026-11-15/backlinks/prospects.csv`.
3. Relations presse et contenus de référence : données originales (coût de la vie réel par profil, coût de création d'une société par zone franche), interviews de l'équipe dans la presse marocaine, maghrébine, belge et québécoise.
4. Audience du réseau (Instagram, YouTube) : chaque guide devient un post, un reel ou une story avec le lien.
5. Interdits : réseaux de blogs privés, liens achetés en masse, contenus générés sans vérification.

## 6. Indicateurs

Search Console (impressions, clics, position) par page et par pays ; inscriptions issues des guides (source du formulaire) ; nombre de domaines référents. Point mensuel.
