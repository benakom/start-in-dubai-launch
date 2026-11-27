# START IN DUBAI : page de lancement

Page de lancement avant l'ouverture du **15 décembre 2026** (heure de Dubaï), construite comme une page de vente : logo en grand, compte à rebours, problème, bénéfices, différence, profils, étapes, offre d'avant-première, fondateur, FAQ, dernier appel. Chaque bouton ouvre un formulaire qui pose une question à la fois, comme Typeform. Les inscriptions arrivent dans **Oleadoo**, le CRM de Cevitas.

Il s'agit d'un site statique (HTML, CSS, JS), sans dépendance ni build, publié par GitHub Pages depuis la branche `main`.

## Fichiers

| Fichier | Rôle |
|---|---|
| `config.js` | **Le seul fichier à modifier** : date d'ouverture, envoi vers le CRM (source, tag), webhook facultatif, GA4 et pixel Meta |
| `index.html` | Page : barre du haut avec compte à rebours, hero, 9 sections, bouton fixe sur mobile |
| `assets/app.js` | Compte à rebours, bouton fixe, formulaire (questions, validation, envoi vers le CRM) |
| `assets/style.css` | Style : blanc et noir, rouge du logo `#E10600`, vert du drapeau `#066A20`, Montserrat + Inter, version mobile |
| `assets/img/` | Logo, 3 visuels (investisseur, entrepreneur, famille), photo d'Ahmed Benjas, favicon, image de partage `og.jpg` |

## Questions du formulaire

1. Vous êtes… (investisseur / entrepreneur / famille / un peu de tout)
2. Ce que vous voulez faire à Dubaï (plusieurs choix : business, immobilier, gestion de portefeuille, résidence, logement et écoles, banque)
3. Pays de résidence. L'indicatif WhatsApp est pré-rempli d'après le pays choisi.
4. Horizon
5. Prénom
6. WhatsApp
7. E-mail
8. Message (facultatif)
9. Récapitulatif et consentement, puis envoi

Raccourcis clavier : lettres A, B, C… pour choisir, Entrée pour valider, Maj + Entrée pour aller à la ligne, Échap pour fermer.

Le lien `…/#inscription` ouvre directement le formulaire. Utilisez-le en bio Instagram ou en story.

Les cartes « Investisseur / Entrepreneur / Une famille » ouvrent le formulaire avec le profil déjà choisi : il commence à la question 2.

## Où vont les inscriptions : Oleadoo (CRM de Cevitas)

La page n'a pas de serveur. Elle enregistre chaque inscription dans la table `leads` de Cevitas (Supabase), exactement comme les formulaires de cevitas.ae, avec la clé publique du site (elle permet d'ajouter un lead, pas de les lire). Ensuite, tout se fait côté Cevitas :

1. un déclencheur met le lead dans la file `crm_outbox` ;
2. la tâche `crm-dispatch` l'envoie à Oleadoo toutes les 5 minutes (webhook partenaire signé) ;
3. la fonction `send-lead-email` envoie un e-mail « New Lead Cevitas.ae — start-in-dubai » à ahmed@cevitas.ae.

Ce que reçoit Oleadoo pour chaque inscription :

| Champ du lead | Contenu |
|---|---|
| Canal (`intake.channel`) | `start-in-dubai` |
| Notes | commence par **`Tag : Start in Dubai`**, puis avant-première, pays, horizon, message |
| Intérêt | `Start in Dubai · <profil> · <besoins>` |
| Prénom, téléphone, e-mail, pays, langue `fr` | depuis le formulaire |
| Attribution | `utm_*`, page d'arrivée, référent, appareil |

Pour que le tag apparaisse comme un vrai **tag** dans Oleadoo (et pas seulement dans les notes), il faut une règle côté Oleadoo : « canal = start-in-dubai → tag Start in Dubai ».

Vérifier la file d'envoi :

```bash
curl -s -X POST https://rrpwdkjrmhtroarfzzsk.supabase.co/functions/v1/crm-dispatch -H "apikey: <clé publique>" -H "Authorization: Bearer <clé publique>" -H "Content-Type: application/json" -d '{"action":"health"}'
```

`leadWebhookUrl` (facultatif) envoie en plus le JSON complet du formulaire à un autre webhook (Make, n8n…). L'inscription est considérée comme perdue seulement si aucun des deux envois ne réussit : la personne voit alors un message d'erreur et peut réessayer.

## Modifier et publier

1. Modifiez `config.js` (ou un autre fichier).
2. Lancez les commandes suivantes :

   ```bash
   git commit -am "Mise à jour de la page" && git push
   ```

3. GitHub Pages met le site à jour en 1 à 2 minutes.

Pour tester en local :

```bash
python3 -m http.server 8765
```

Ouvrez ensuite http://localhost:8765.

## Nom de domaine

La page est servie sur **www.startindubai.com** : le fichier `CNAME` contient ce domaine, et `startindubai.com` redirige vers `www`.

DNS chez GoDaddy (avec les serveurs de noms GoDaddy) :

| Type | Nom | Valeur |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | benakom.github.io |

Quand le site complet (projet `startindubai`) sera prêt, il prendra le domaine. Il faudra alors retirer `CNAME` de ce dépôt.

## À vérifier

- Promesses de la page à confirmer : « rappel en priorité dès l'ouverture », « premier échange sans engagement », « en français et en darija ».
- La note Google de Cevitas (5,0, 15 avis au 24/11/2026) est à mettre à jour si elle change.
- Les visuels des profils sont générés par IA, à titre d'illustration (mentionné en pied de page).
- L'image de partage `og.jpg` reprend encore l'ancien style (crème et or).

## Langues (fr, ar, en, es, nl, it)
La page existe en 6 langues : `/` (français), `/ar/`, `/en/`, `/es/`, `/nl/`, `/it/`, avec hreflang et sitemap.
- Source unique : `i18n/template.html` (structure) + `i18n/<langue>.json` (textes de la page) + `i18n/form-<langue>.json` (textes du formulaire).
- Après toute modification : `python3 tools/i18n.py build` régénère `index.html`, les 5 dossiers et `sitemap.xml`. Ne pas éditer les `index.html` à la main.
- Langue affichée sur `/` : choix mémorisé du visiteur, sinon langue du navigateur, sinon pays (fuseau horaire). Les robots ne sont jamais redirigés.
- Formulaire : le visiteur choisit son pays (indicatif) et le numéro mobile est vérifié (longueur et premier chiffre) ; Oleadoo reçoit toujours des libellés en français, avec la langue du site dans les notes.
