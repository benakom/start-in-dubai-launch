"""Construit inventaire.csv et keywords.csv (marché FR) à partir de Semrush FR + autocomplétion."""
import csv, re, sys, unicodedata
from collections import OrderedDict

SEM = "/Users/ahmedbenjas/code/seo-data/semrush-2026-11-15/fr/"
import os; OUT = os.environ.get("OUT", "/Users/ahmedbenjas/code/.worktrees/sid-site/docs/seo-study/fr/")
AC = None
SITE = "https://www.startindubai.com"
CEV = "https://www.cevitas.ae (immobilier)"

def norm(s):
    s = s.lower().replace("’", "'").replace("dubaï", "dubai").replace("dubaî", "dubai")
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", s).strip()

def vol(x):
    x = (x or "").strip()
    if x.endswith("K"): return int(float(x[:-1]) * 1000)
    try: return int(x)
    except: return None

# ---------- bruit : tourisme, lieux, marques, autres langues ----------
NOISE = re.compile(r"\bpib\b|armee|^dubai eau$|^dubai emirats? arabes? unis$|maritime|creation of dubai|^creation dubai$|^dubai creation$|gestion de patrimoine|^sharjah and dubai$|^dubai sharjah$|burj|burg |bourj|buge |khalifa|kalifa|palm|palmier|atlantis|hotel|hôtel|resort|vol |vols |billet|aeroport|airport|maktoum airport|mall|centre commercial|shopping|meteo|météo|temperature|climat en|marina|jumeirah beach|jbr|musee|museum|frame|desert safari|safari|plage|beach|parc|aquarium|ski dubai|expo|exposition|disney|ferrari world|casino|restaurant|brunch|nightclub|boite de nuit|monnaie|monaie|monnais|devise|dirham|aed |aed$|symbol|logo|population|habitant|inhabitant|superficie|capital|capitale|quel pays|pays ou ville|ville ou pays|ou se trouve|dans quel pays|dubai pays|le pays|dubai arabia|dubai the city|dhubay|duabi|dubua|dubzi|dubaii|dibai|bubai|du ai|dubai\$|dubaiote|sheikh|cheikh|prince|emir |maktoum|guerre|iran|missile|attaque|rs6|mansory|grovy|ginco|beyondest|mitbah|romain perez|mama shelter|tiger tower|sky dubai|tour de dubai|gratte|ile artificiel|ile dubai|iles |majid|futtaim|etihad|emirates airline|compagnie aerienne|fly ?dubai|tourisme|touriste|touristique|que faire|quoi faire|visiter|activite|excursion|croisiere|lune de miel|vacances|sejour|voyage organise|all inclusive|club med|tenue|maillot|fete|nouvel an|f1|formule 1|golf|tennis|football|psg|real madrid|al nasr|uae pro|chocolat|dubai chocolate|kunafa|pistache|parfum|or dubai|gold souk|souk|prix de l'or|bijou|iphone|telephone moins cher|montre|voiture moins chere|lamborghini|police dubai voiture|serie|film|netflix|influenceu|instagram|tiktok|youtube|danse|chanteu|concert|eau de|crypto|bitcoin|binance|uber|careem|taxi|metro dubai|tram|creek|downtown|business bay|silicon|oasis|jlt|jvc|jumeirah|arabian ranches|dubai hills|damac|emaar|sobha|binghatti|azizi|nakheel|ellington|danube|samana|imtiaz|meraas|dubai islands|saadiyat|reem|yas|dubailand|motor city|town square|district one|al barari|mina rashid|jebel ali|al quoz|deira|bur dubai|karama|al barsha|mirdif|sports city|international city|discovery gardens|al furjan|dubai south|arjan|al wasl|city walk|la mer|bluewaters|sharjah airport|heure|decalage horaire|fuseau|distance|km|kilometre|carte de dubai|plan de dubai|drapeau|langue parlee|religion|histoire de dubai|fondateur|wikipedia|^dubai$|^dubai [a-z]$")
OTHER_LANG = re.compile(r"\b(in|the|for|how|what|living|cost of|work|company setup|business setup|bank account|visa for|apply|requirements|price|best|schools?|university of|jobs?|salary|tax(es)?|goldenes|visum|wonen|werken|vivir|trabajar|estudiar|vivere|lavorare|studiare)\b")

IMMO = re.compile(r"cheter|via (une )?societe|immobili|immo\b|appartement|apt |villa|maison|studio|penthouse|logement|loyer|louer|location|a vendre|achat|acheter|achet|vendre|bien|propriete|proprietaire|promoteur|sur plan|off plan|offplan|projet|rendement|airbnb|gestion locative|ejari|oqood|dld|land department|escrow|snagging|handover|payment plan|form f|holiday home|courte duree|m2|prix m|copropriete|charges|flip|bulle|credit immobilier|pret immobilier|hypotheque|mortgage|real estate|agence immobiliere|agent immobilier|investissement locatif|quartier|ou habiter|ou vivre a dubai|meilleur quartier|dubai islands|district cooling|retard livraison|malfacons|real estate")

# ---------- règles : (motif, cluster, intention, page, slug à créer, priorité) ----------
G = lambda s: SITE + s
R = [
 # société — pages à créer d'abord (plus spécifiques)
 (r"mainland|droit local|\bllc\b|continentale", "societe", "info", None, "/societe-mainland-dubai/", 1),
 (r"impot (sur les )?societe|impot sur les benefices|corporate tax|9 ?%", "argent", "info", None, "/impot-sur-les-societes-dubai/", 1),
 (r"\btva\b|vat", "argent", "info", None, "/tva-dubai/", 2),
 (r"licence commerciale|trade licen|licence d'activite|renouvellement (de la )?licence|licence dubai", "societe", "info", None, "/licence-commerciale-dubai/", 2),
 (r"holding", "societe", "info", None, "/holding-dubai/", 2),
 (r"(societe|creation|creer|free ?zone|freezone|licence|entreprise|company).*(ajman|ras al khaimah|\brak\b|rakez|sharjah|shams|fujairah|umm al quwain)|(ajman|ras al khaimah|\brak\b|rakez|sharjah|shams|fujairah|umm al quwain).*(societe|creation|free ?zone|freezone|licence|entreprise)|rakez|shams free", "societe", "info", None, "/creer-sa-societe-hors-dubai/", 2),
 (r"\bifza\b|(dmcc|meydan|dafza|jafza|difc|dso|spc).*(free ?zone|freezone|licence|societe|company|prix|cout)|(free ?zone|freezone|licence|societe).*(ifza|dmcc|meydan|dafza|jafza|difc|dso|spc)|free ?zone (la )?moins chere|meilleure(s)? free ?zone|freezone pas cher|liste (des )?free ?zone", "societe", "commerciale", None, "/meilleures-free-zones-dubai/", 2),
 (r"expert.?comptable|comptable|comptabilite|audit", "societe", "commerciale", None, "/services/comptabilite-fiscalite-dubai/", 3),
 (r"accompagnement|cabinet|aide (a la )?creation|domiciliation|business center|bureau virtuel|flexi ?desk|pro services", "societe", "commerciale", G("/services/creation-de-societe-dubai/"), None, 1),
 (r"(cout|prix|tarif|combien|frais).*(societe|entreprise|licence|free ?zone|freezone)|(societe|entreprise|licence|free ?zone|freezone).*(cout|prix|tarif|combien|frais)", "societe", "commerciale", G("/blog/cout-creation-societe-dubai/"), None, 1),
 (r"offshore", "societe", "info", G("/societe-offshore-dubai/"), None, 1),
 (r"free ?zone|freezone|zone franche|zone libre", "societe", "info", G("/zone-franche-dubai/"), None, 1),
 (r"freelance|independant|auto ?entrepreneur|micro ?entreprise|go ?freelance", "societe", "info", G("/freelance-dubai/"), None, 1),
 (r"teletravail|remote work|virtual work|nomade digital|digital nomad", "visas", "info", G("/blog/visa-teletravail-dubai/"), None, 2),
 (r"societe|entreprise|business|start ?up|creer (sa|une|son)|creation|monter|ouvrir (une|sa|son) (societe|boite|entreprise)", "societe", "info", G("/creer-sa-societe-a-dubai/"), None, 1),
 # argent
 (r"residence fiscale|certificat de residence|domicile fiscal|tax residency|exil fiscal|non resident fiscal", "argent", "info", None, "/residence-fiscale-dubai/", 1),
 (r"convention fiscale|double imposition", "argent", "info", G("/blog/convention-fiscale-france-emirats/"), None, 1),
 (r"transfer|envoyer de l'argent|virement|western union|change maroc|office des changes|wise", "argent", "info", None, "/transferer-de-l-argent-a-dubai/", 2),
 (r"impot|impots|fiscal|fisc|taxe|imposition|cfe\b", "argent", "info", G("/impots-dubai/"), None, 1),
 (r"compte offshore|comptes offshore", "argent", "info", G("/societe-offshore-dubai/"), None, 3),
 (r"banque|bancaire|compte en banque|ouvrir un compte|emirates nbd|mashreq|wio|adcb|fab\b|rakbank|carte bancaire", "argent", "info", G("/ouvrir-un-compte-bancaire-a-dubai/"), None, 1),
 (r"salaire|smic|remuneration|package|fin de service|gratuity", "travail", "info", G("/blog/salaire-a-dubai/"), None, 1),
 (r"cout de la vie|cout vie|prix de la vie|budget|combien (faut|coute la vie|pour vivre)|cher a dubai|vie chere|prix a dubai|prix des courses|prix essence", "vie", "info", G("/cout-de-la-vie-dubai/"), None, 1),
 # visas
 (r"golden ?visa|visa (en )?or|visa doree|visa de 10 ans|visa 10 ans", "visas", "info", G("/golden-visa-dubai/"), None, 1),
 (r"green visa|visa vert", "visas", "info", None, "/green-visa-dubai/", 2),
 (r"visa investisseur|investor visa|visa partenaire|partner visa", "visas", "info", None, "/visa-investisseur-dubai/", 1),
 (r"visa (de )?retraite|retraite|retraite|retraité|pension", "visas", "info", G("/blog/retraite-a-dubai/"), None, 2),
 (r"visa etudiant|student visa|visa etude", "etudes", "info", G("/visa-etudiant-dubai/"), None, 1),
 (r"visa famille|family visa|parrainer|sponsor (ma|sa|mon)|regroupement familial|visa (pour )?(ma |mon |sa |son )?(femme|epouse|mari|enfant|parents|mere|pere)|faire venir (ma|sa|mes|son)", "famille", "info", None, "/visa-famille-dubai/", 1),
 (r"visa (de )?travail|permis de travail|work permit|work visa|visa employ|contrat de travail|droit du travail|code du travail|preavis|periode d'essai|licenciement|demission", "travail", "info", None, "/contrat-de-travail-dubai/", 2),
 (r"recherche d'emploi|job seeker|chercheur d'emploi", "visas", "info", None, "/visa-recherche-emploi-dubai/", 2),
 (r"emirates id|carte d'identite|carte de resident|id card|identity card|\bid ae\b|id in uae|emirates identification", "visas", "navigationnelle", G("/blog/emirates-id/"), None, 2),
 (r"(visa|entree|entrer|passeport).*(maroc|marocain)|(maroc|marocain).*(visa|passeport)", "pays", "info", None, "/visa-dubai-marocains/", 1),
 (r"(visa|entree|entrer|passeport).*(alger|algerien)|(alger|algerien).*(visa|passeport)", "pays", "info", G("/s-installer-a-dubai-depuis-l-algerie/"), None, 1),
 (r"(visa|entree|entrer|passeport).*(tunisi)|(tunisi).*(visa|passeport)", "pays", "info", G("/s-installer-a-dubai-depuis-la-tunisie/"), None, 1),
 (r"(visa|entree).*(senegal)|senegal.*visa", "pays", "info", G("/s-installer-a-dubai-depuis-le-senegal/"), None, 1),
 (r"(visa|entree).*(cote d'ivoire|ivoirien|cameroun|camerounais|mali|malien|guinee|guineen|burkina|congo|rdc|gabon|benin|togo|niger|mauritanie|madagascar|liban|libanais|haiti|haitien|luxembourg)|(cote d'ivoire|ivoirien|cameroun|mali|guinee|burkina|congo|rdc|gabon|benin|togo|mauritanie|madagascar|liban|haiti|luxembourg).*(visa|dubai)", "pays", "info", None, "/s-installer-a-dubai-depuis-{pays}/", 2),
 (r"(visa|entree).*(belg)|belg.*(visa|dubai)", "pays", "info", G("/s-installer-a-dubai-depuis-la-belgique/"), None, 2),
 (r"(visa|entree).*(suisse)|suisse.*(visa|dubai)", "pays", "info", G("/s-installer-a-dubai-depuis-la-suisse/"), None, 2),
 (r"(visa|entree).*(canad|quebec)|(canad|quebec).*(visa|dubai)", "pays", "info", G("/s-installer-a-dubai-depuis-le-canada/"), None, 2),
 (r"(visa|entree).*(francais|france)|(francais|france).*visa", "pays", "info", G("/s-installer-a-dubai-depuis-la-france/"), None, 2),
 (r"visa de 5 ans|visa 5 ans|multiple entr|entrees multiples", "visas", "info", None, "/visa-dubai/", 2),
 (r"residence|resident|titre de sejour|carte de sejour|visa (de )?residen|renouvel|visa dubai|visa emirats|visa uae|visa eau|visa abu dhabi", "visas", "info", G("/visa-residence-dubai/"), None, 1),
 (r"visa", "visas", "info", None, "/visa-dubai/", 2),
 # famille / études
 (r"lycee|ecole francaise|ecoles francaises|jean mermoz|pompidou|aflec|lfi|lycee francais|cned|ecole en francais", "famille", "commerciale", G("/ecoles-francaises-dubai/"), None, 1),
 (r"ecole|scolarite|creche|maternelle|college|khda|frais de scolarite|british school|ib school", "famille", "commerciale", None, "/ecoles-internationales-dubai/", 2),
 (r"universite|universites|sorbonne|campus|etudier|etude|etudes|etudiant|bachelor|master|mba|licence (en|universitaire)|ecole de commerce|business school|bourse|apres le bac", "etudes", "info", G("/etudier-a-dubai/"), None, 1),
 (r"famille|enfant|enfants|bebe|couple|\bmari\b|femme enceinte|accouch|naissance|grossesse|maternite", "famille", "info", G("/s-installer-a-dubai-en-famille/"), None, 1),
 (r"assurance|mutuelle|sante|hopital|medecin|soins|cfe sante|clinique", "vie", "info", G("/blog/assurance-sante-dubai/"), None, 2),
 # travail
 (r"emploi|travail|travailler|job|recrutement|recrute|offre d'emploi|cv\b|metier|interim|stage|civiweb|volontariat", "travail", "info", G("/travailler-a-dubai/"), None, 1),
 # pays (installation)
 (r"investir.*depuis|investir.*(pour les|pour un) (marocain|francais|belge|algerien|tunisien)", "investir", "commerciale", "https://www.ahmedbenjas.com (guides investir depuis X)", None, 3),
 (r"il ne faut pas aller|pourquoi ne pas|pourquoi quitter|deconseill", "vie", "info", G("/vivre-a-dubai/"), None, 2),
 (r"dangereux|securite|sur a dubai|criminalite", "vie", "info", None, "/lois-et-regles-a-dubai/", 2),
 (r"maroc|marocain|mre", "pays", "info", G("/s-installer-a-dubai-depuis-le-maroc/"), None, 1),
 (r"algerie|algerien", "pays", "info", G("/s-installer-a-dubai-depuis-l-algerie/"), None, 1),
 (r"tunisie|tunisien", "pays", "info", G("/s-installer-a-dubai-depuis-la-tunisie/"), None, 1),
 (r"senegal|senegalais", "pays", "info", G("/s-installer-a-dubai-depuis-le-senegal/"), None, 1),
 (r"belgique|belge", "pays", "info", G("/s-installer-a-dubai-depuis-la-belgique/"), None, 2),
 (r"suisse", "pays", "info", G("/s-installer-a-dubai-depuis-la-suisse/"), None, 2),
 (r"canada|canadien|quebec|quebecois", "pays", "info", G("/s-installer-a-dubai-depuis-le-canada/"), None, 2),
 (r"cote d'ivoire|ivoirien|cameroun|mali\b|malien|guinee|burkina|congo|rdc|gabon|benin|togo|mauritanie|madagascar|liban|luxembourg|haiti", "pays", "info", None, "/s-installer-a-dubai-depuis-{pays}/", 2),
 (r"francais a dubai|francais de dubai|francais vivant|communaute francaise|combien de francais|french (in )?dubai|consulat de france|ambassade de france", "vie", "info", None, "/francais-a-dubai/", 1),
 (r"france|francais", "pays", "info", G("/s-installer-a-dubai-depuis-la-france/"), None, 2),
 # vie
 (r"permis|conduire|conduite|rta\b|voiture|amende|salik", "vie", "info", G("/blog/permis-de-conduire-dubai/"), None, 2),
 (r"abu dhabi|abou dabi|abudhabi", "vie", "info", G("/blog/dubai-ou-abu-dhabi/"), None, 2),
 (r"demenag|conteneur|container|transitaire|effets personnels", "installer", "commerciale", None, "/demenagement-dubai/", 1),
 (r"chien|chat|animal|animaux", "installer", "info", None, "/animaux-dubai/", 3),
 (r"alcool|loi|lois|interdit|ramadan|regle|police|prison|drogue|medicament|tenue vestimentaire|couple non marie|concubinage|homosexu|securite|dangereux|danger|sur a dubai|il ne faut pas aller", "vie", "info", None, "/lois-et-regles-a-dubai/", 2),
 (r"telephone|\bsim\b|esim|internet|etisalat|whatsapp|voip|facetime", "vie", "info", None, "/telephone-internet-dubai/", 3),
 (r"legalis|apostille|traduction|attestation|equivalence|diplome", "installer", "info", None, "/legalisation-documents-dubai/", 2),
 (r"investir|investissement|investisseur|placement|placer", "investir", "info", G("/investir-a-dubai/"), None, 1),
 (r"s'installer|installer|installation|expatri|expat|partir|demenager|immigr|emigr|quitter la france", "installer", "info", G("/s-installer-a-dubai/"), None, 1),
 (r"vivre|vie a dubai|vie dubai|la vie|habiter|avantages|inconvenients|qualite de vie|pourquoi", "vie", "info", G("/vivre-a-dubai/"), None, 1),

]
R = [(re.compile(p), *rest) for p, *rest in R]

def classify(k):
    n = norm(k)
    if "dubai" not in n and "emirat" not in n and "abu dhabi" not in n and "uae" not in n and "eau" not in n.split() and "golden visa" not in n and "emirates id" not in n and "offshore" not in n:
        # hors marché sauf termes génériques forts
        if not re.search(r"golden visa|emirates id|freezone|free zone|zone franche|offshore", n):
            return ("hors-sujet", "info", None, None, 3)
    if OTHER_LANG.search(n): return ("hors-sujet", "info", None, None, 3)
    if IMMO.search(n) and not re.search(r"golden visa|visa|impot|fiscal|creation|creer|ouvrir", n):
        return ("immobilier-cevitas", "commerciale", CEV, None, 3)
    for rx, cl, it, page, slug, pr in R:
        if rx.search(n):
            return (cl, it, page, slug, pr)
    if NOISE.search(n): return ("hors-sujet", "info", None, None, 3)
    return ("hors-sujet", "info", None, None, 3)

def noise(k):
    n = norm(k)
    return bool(NOISE.search(n)) and not re.search(r"visa|societe|travail|emploi|vivre|etudier|ecole|impot|banque|golden|installer|expatri", n)

PAYS = [("cote d'ivoire|ivoirien","la-cote-d-ivoire"),("cameroun","le-cameroun"),("mali\\b|malien","le-mali"),("guinee","la-guinee"),("burkina","le-burkina-faso"),("rdc|congo","la-rdc"),("gabon","le-gabon"),("benin","le-benin"),("togo","le-togo"),("mauritanie","la-mauritanie"),("madagascar","madagascar"),("liban","le-liban"),("luxembourg","le-luxembourg"),("haiti","haiti"),("niger\\b","le-niger")]
def pays_slug(n):
    for rx, sl in PAYS:
        if re.search(rx, n): return sl
    return "autre-pays"

INT_NAV = re.compile(r"indeed|jooble|linkedin|bayt|gdrfa|icp|amer|tasheel|smartservices|login|site officiel|numero|telephone du|adresse|horaires|rendez-vous|tasheel|mohre\b")
INT_TRANS = re.compile(r"accompagnement|agence|cabinet|aide|prix|tarif|cout|combien|devis|meilleur|meilleure|comparatif|demande en ligne|en ligne|acheter|souscrire")


import glob, json
SITE_DIR = "/Users/ahmedbenjas/code/.worktrees/sid-site/src/content/"
def site_keywords():
    out = []
    for f in sorted(glob.glob(SITE_DIR + "*/fr/*.md")):
        t = open(f, encoding="utf-8").read().split("---")[1]
        k = re.search(r'^keyword:\s*"(.*)"', t, re.M).group(1)
        m = re.search(r'^secondary:\s*(\[.*\])', t, re.M)
        coll = f.split("/")[-3]; slug = f.split("/")[-1][:-3]
        url = SITE + ("/" if coll == "guides" else f"/{coll}/") + slug + "/"
        out.append((k, url, True))
        for x in (json.loads(m.group(1)) if m else []): out.append((x, url, False))
    return out

# mots-clés cibles sans volume Semrush (recherche web, plan SEO, autocomplétion du 27/11 citée dans SEO-PLAN.md)
EXTRA = [
 ("visa famille dubai", "famille", "info", None, "/visa-famille-dubai/", 1),
 ("parrainer sa famille à dubai", "famille", "info", None, "/visa-famille-dubai/", 1),
 ("visa dubai maroc", "pays", "info", None, "/visa-dubai-marocains/", 1),
 ("visa dubai maroc prix", "pays", "commerciale", None, "/visa-dubai-marocains/", 1),
 ("visa dubai 5 ans marocain", "pays", "info", None, "/visa-dubai-marocains/", 1),
 ("visa dubai marocain résidant en france", "pays", "info", None, "/visa-dubai-marocains/", 1),
 ("meilleure free zone dubai", "societe", "commerciale", None, "/meilleures-free-zones-dubai/", 1),
 ("free zone la moins chère dubai", "societe", "commerciale", None, "/meilleures-free-zones-dubai/", 1),
 ("ifza dubai", "societe", "commerciale", None, "/meilleures-free-zones-dubai/", 1),
 ("licence commerciale dubai", "societe", "info", None, "/licence-commerciale-dubai/", 1),
 ("renouvellement licence dubai", "societe", "info", None, "/licence-commerciale-dubai/", 1),
 ("impôt sur les sociétés dubai", "argent", "info", None, "/impot-sur-les-societes-dubai/", 1),
 ("corporate tax dubai free zone", "argent", "info", None, "/impot-sur-les-societes-dubai/", 1),
 ("lois dubai", "vie", "info", None, "/lois-et-regles-a-dubai/", 1),
 ("ce qui est interdit à dubai", "vie", "info", None, "/lois-et-regles-a-dubai/", 1),
 ("contrat de travail dubai", "travail", "info", None, "/contrat-de-travail-dubai/", 2),
 ("droit du travail dubai", "travail", "info", None, "/contrat-de-travail-dubai/", 2),
 ("indemnité de fin de contrat dubai", "travail", "info", None, "/contrat-de-travail-dubai/", 2),
 ("école internationale dubai", "famille", "commerciale", None, "/ecoles-internationales-dubai/", 2),
 ("école dubai prix", "famille", "commerciale", None, "/ecoles-internationales-dubai/", 2),
 ("transférer de l'argent à dubai", "argent", "info", None, "/transferer-de-l-argent-a-dubai/", 2),
 ("légalisation documents dubai", "installer", "info", None, "/legalisation-documents-dubai/", 2),
 ("légalisation diplôme dubai", "installer", "info", None, "/legalisation-documents-dubai/", 2),
 ("green visa dubai", "visas", "info", None, "/green-visa-dubai/", 2),
 ("holding dubai", "societe", "info", None, "/holding-dubai/", 2),
 ("visa recherche d'emploi dubai", "visas", "info", None, "/visa-recherche-emploi-dubai/", 2),
 ("job seeker visa dubai", "visas", "info", None, "/visa-recherche-emploi-dubai/", 2),
 ("création société rak", "societe", "info", None, "/creer-sa-societe-hors-dubai/", 2),
 ("création société sharjah", "societe", "info", None, "/creer-sa-societe-hors-dubai/", 2),
 ("s'installer à dubai depuis la côte d'ivoire", "pays", "info", None, "/s-installer-a-dubai-depuis-la-cote-d-ivoire/", 2),
 ("visa dubai côte d'ivoire", "pays", "info", None, "/s-installer-a-dubai-depuis-la-cote-d-ivoire/", 2),
 ("s'installer à dubai depuis le cameroun", "pays", "info", None, "/s-installer-a-dubai-depuis-le-cameroun/", 2),
 ("visa dubai cameroun", "pays", "info", None, "/s-installer-a-dubai-depuis-le-cameroun/", 2),
 ("visa dubai mali", "pays", "info", None, "/s-installer-a-dubai-depuis-le-mali/", 3),
 ("visa dubai guinée", "pays", "info", None, "/s-installer-a-dubai-depuis-la-guinee/", 3),
 ("s'installer à dubai depuis le luxembourg", "pays", "info", None, "/s-installer-a-dubai-depuis-le-luxembourg/", 3),
 ("s'installer à dubai depuis le liban", "pays", "info", None, "/s-installer-a-dubai-depuis-le-liban/", 3),
 ("visa dubai", "visas", "info", None, "/visa-dubai/", 3),
 ("visa dubai 5 ans", "visas", "info", None, "/visa-dubai/", 3),
 ("animaux dubai", "installer", "info", None, "/blog/animaux-dubai/", 3),
 ("chien dubai importer", "installer", "info", None, "/blog/animaux-dubai/", 3),
 ("carte sim dubai résident", "vie", "info", None, "/blog/telephone-internet-dubai/", 3),
 ("marocains à dubai", "pays", "info", SITE + "/s-installer-a-dubai-depuis-le-maroc/", None, 1),
 ("consulat du maroc à dubai", "pays", "navigationnelle", SITE + "/s-installer-a-dubai-depuis-le-maroc/", None, 2),
 ("université française dubai", "etudes", "info", SITE + "/etudier-a-dubai/", None, 2),
 ("sorbonne abu dhabi", "etudes", "navigationnelle", SITE + "/etudier-a-dubai/", None, 2),
 ("trouver un emploi à dubai", "travail", "info", SITE + "/travailler-a-dubai/", None, 1),
 ("visa travail dubai", "travail", "info", SITE + "/travailler-a-dubai/", None, 1),
]

def rows_semrush():
    out = OrderedDict()
    for r in csv.DictReader(open(SEM + "gap-cevitas-vs-fr-competitors.csv", encoding="utf-8"), delimiter=";"):
        if "-" in r["keyword"] and " " not in r["keyword"].strip(): continue
        d = dict(kw=r["keyword"].strip(), vol=vol(r["volume"]), kd=r["kd"], cpc=r["cpc"], it=r["intent"], di=r["pos_dubai-immo.com"], dif=r["pos_dubaiimmobilier.fr"], dinv=r["pos_dubai-investissement.com"], f="gap-cevitas-vs-fr-competitors.csv")
        k = norm(r["keyword"])
        if k not in out or (d["vol"] or 0) > (out[k]["vol"] or 0): out[k] = d
    for f in ("volumes-mre-maroc.csv", "volumes-backlog-cevitas.csv"):
        for r in csv.DictReader(open(SEM + f, encoding="utf-8"), delimiter=";"):
            k = norm(r["keyword"])
            if k not in out or (vol(r["volume"]) or 0) > (out[k]["vol"] or 0):
                out[k] = dict(kw=r["keyword"].strip(), vol=vol(r["volume"]), kd=r["kd"], cpc=r["cpc"], it=r.get("intent", ""), di="", dif="", dinv="", f=f)
    return out

def main():
    sem = rows_semrush()
    with open(OUT + "keywords.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh, delimiter=";")
        w.writerow(["keyword", "volume_fr", "kd", "cpc_eur", "intent_semrush", "pos_dubai-immo.com", "pos_dubaiimmobilier.fr", "pos_dubai-investissement.com", "source"])
        for k, s in sorted(sem.items(), key=lambda kv: -(kv[1]["vol"] or 0)):
            w.writerow([s["kw"], s["vol"] if s["vol"] is not None else "n.c.", s["kd"], s["cpc"], s["it"], s["di"], s["dif"], s["dinv"], "semrush 15/11/2026 " + s["f"]])
    inv = OrderedDict(); dropped = 0
    def add(kw, cl, it, page, slug, pr):
        k = norm(kw)
        if k in inv: return
        s = sem.get(k)
        v = s["vol"] if s and s["vol"] is not None else None
        n = k
        if slug and "{pays}" in slug: slug = slug.replace("{pays}", pays_slug(n))
        if cl != "immobilier-cevitas":
            if INT_NAV.search(n): it = "navigationnelle"
            elif INT_TRANS.search(n) and it == "info": it = "commerciale"
        inv[k] = [kw, cl, it, str(v) if v is not None else "n.c.", s["kd"] if s else "", s["cpc"] if s else "", page if page else "À CRÉER", "" if cl == "immobilier-cevitas" else (slug or ""), pr, v or 0]
    # 1) mots-clés des pages existantes (principal = priorité 1 ou 2)
    PAGECL = {"creation-de-societe": "societe", "golden-visa-visas": "visas", "ouverture-compte": "argent", "installation-famille": "famille", "etudes-superieures": "etudes", "services/immobilier": "investir", "teletravail": "visas", "freelance": "societe", "compte-bancaire": "argent", "visa-residence": "visas", "emirates-id": "visas", "retraite": "visas", "permis": "vie", "assurance": "vie", "salaire": "travail", "dubai-ou-abu": "vie", "etudier": "etudes", "visa-etudiant": "etudes", "depuis-": "pays", "ecoles": "famille", "famille": "famille", "impots": "argent", "convention": "argent", "cout-creation": "societe", "mainland": "societe", "zone-franche": "societe", "offshore": "societe", "creer-sa-societe": "societe", "travailler": "travail", "vivre": "vie", "cout-de-la-vie": "vie", "investir": "investir", "s-installer-a-dubai/": "installer"}
    MOVE = {"impot societe dubai": "/impot-sur-les-societes-dubai/", "tva dubai": "/tva-dubai/", "visa investisseur dubai": "/visa-investisseur-dubai/", "visa dubai pour les marocains": "/visa-dubai-marocains/", "licence commerciale dubai": "/licence-commerciale-dubai/", "emirates id": None, "salaire dubai": None}
    for kw, url, is_main in site_keywords():
        cl, it, page, slug, pr = classify(kw)
        for frag, c in PAGECL.items():
            if frag in url: cl = c; break
        k = norm(kw)
        if not is_main and k in MOVE and MOVE[k]:
            add(kw, cl, it, url + " (secondaire, à transférer)", MOVE[k], 1); continue
        if not is_main and k in MOVE and MOVE[k] is None: continue
        add(kw, cl, it, url, None, 1 if is_main else min(pr, 2))
    # 2) Semrush
    for k, s in sem.items():
        kw = s["kw"]
        if noise(kw): dropped += 1; continue
        cl, it, page, slug, pr = classify(kw)
        if cl == "hors-sujet": dropped += 1; continue
        add(kw, cl, it, page, slug, pr)
    # 3) cibles sans volume
    for kw, cl, it, page, slug, pr in EXTRA: add(kw, cl, it, page, slug, pr)
    rows = sorted(inv.values(), key=lambda r: (r[1] == "immobilier-cevitas", r[1], r[8], -r[9]))
    with open(OUT + "inventaire.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh, delimiter=";")
        w.writerow(["keyword", "cluster", "intention", "demande", "kd", "cpc_eur", "page_existante", "slug_propose", "priorite"])
        for r in rows: w.writerow(r[:9])
    print("inventaire", len(rows), "retirés", dropped, "semrush", len(sem), file=sys.stderr)

if __name__ == "__main__":
    main()
