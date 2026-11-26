# START IN DUBAI : page de lancement

Page d'attente avant l'ouverture du **15 décembre 2026** (heure de Dubaï). Elle contient le logo, un compte à rebours et un formulaire d'inscription en avant-première. Le formulaire pose une question à la fois, comme Typeform.

Il s'agit d'un site statique (HTML, CSS, JS), sans dépendance ni build, publié par GitHub Pages depuis la branche `main`.

## Fichiers

| Fichier | Rôle |
|---|---|
| `config.js` | **Le seul fichier à modifier** : date d'ouverture, URL du webhook des leads, GA4 et pixel Meta |
| `index.html` | Page : logo, accroche, compte à rebours, bouton, images |
| `assets/app.js` | Compte à rebours, rotation des images, formulaire (questions, validation, envoi) |
| `assets/style.css` | Style : fond crème, Bodoni Moda, or `#D9B46A`, version mobile |
| `assets/img/` | Logo, 3 visuels (investisseur, entrepreneur, famille), favicon, image de partage `og.jpg` |

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

## Où vont les inscriptions

Chaque inscription est envoyée en `POST` JSON à `leadWebhookUrl` (dans `config.js`) :

```json
{
  "firstName": "Karim", "phone": "+212 612345678", "email": "karim@exemple.com",
  "profile": "investir", "profileLabel": "Investisseur",
  "needs": ["immobilier", "portefeuille"], "needsLabels": ["Investir dans l'immobilier", "Gérer mon portefeuille immobilier"],
  "country": "Maroc", "horizon": "Dans 3 à 6 mois", "message": "", "consent": true,
  "source": "countdown-lancement", "page": "https://…", "referrer": "", "utm": { "utm_source": "instagram" },
  "language": "fr-FR", "launchDate": "2026-12-15T00:00:00+04:00", "submittedAt": "2026-11-26T18:14:37.490Z"
}
```

Les champs `firstName`, `phone`, `email`, `country`, `horizon`, `message`, `profile`, `source`, `page` et `utm` sont les mêmes que ceux du formulaire du site startindubai.

Si le webhook refuse les requêtes venant d'un autre site (CORS), la page renvoie la même chose en requête simple, avec `Content-Type: text/plain`. Le corps reste du JSON. Testé : l'inscription arrive bien. Il faut seulement que le webhook accepte de lire ce corps.

**Tant que `leadWebhookUrl` est vide, les inscriptions ne sont envoyées nulle part.** Ne partagez pas le lien avant de l'avoir renseigné.

## Modifier et publier

1. Modifiez `config.js` (ou un autre fichier).
2. Lancez les commandes suivantes :

   ```bash
   git commit -am "Webhook Oleadoo" && git push
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

- Le darija (« قريب بزاف. » et le message de remerciement) est à relire par un natif.
- La promesse « réponse sur WhatsApp, en français ou en darija » est-elle tenable dès le jour 1 ?
- Les visuels sont générés par IA, à titre d'illustration.
