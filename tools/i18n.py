"""Page d'avant-première START IN DUBAI en 6 langues (fr, ar, en, es, nl, it).

  python3 tools/i18n.py extract   # une seule fois : index.html (fr) -> i18n/template.html + i18n/fr.json
  python3 tools/i18n.py build     # i18n/template.html + i18n/<lang>.json -> index.html, en/, ar/, es/, nl/, it/ + sitemap.xml

Le français reste la source : on modifie i18n/fr.json (ou template.html pour la structure), puis on reporte
la même clé dans les autres langues et on relance build. Ne jamais éditer les index.html générés."""
import json, os, re, sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
I18N = os.path.join(ROOT, "i18n")
PUB = os.path.join(ROOT, "public")   # site Astro : la page de lancement est servie telle quelle depuis public/
SITE = "https://www.startindubai.com"
LANGS = ["fr", "ar", "en", "es", "nl", "it"]
LOCALE = {"fr": "fr_FR", "ar": "ar_AE", "en": "en_GB", "es": "es_ES", "nl": "nl_NL", "it": "it_IT"}
CD_LETTERS = {"fr": "jhms", "ar": ["ي", "س", "د", "ث"], "en": "dhms", "es": "dhms", "nl": "dums", "it": "ghms"}
NAMES = {"fr": "Français", "ar": "العربية", "en": "English", "es": "Español", "nl": "Nederlands", "it": "Italiano"}
UNIT_TAGS = {"title", "p", "h1", "h2", "h3", "li", "summary"}
UNIT_CLASSES = {"btn-txt", "cd-unit", "p-t", "p-d", "p-go"}

def url(lang): return SITE + "/" if lang == "fr" else f"{SITE}/{lang}/"

class Finder(HTMLParser):
    """Repère les blocs de texte à traduire (contenu brut entre la balise ouvrante et la balise fermante)."""
    VOID = {"meta", "link", "img", "br", "input", "source", "hr", "path"}
    def __init__(self, src):
        super().__init__(convert_charrefs=False)
        self.src = src; self.lines = [0]
        for m in re.finditer("\n", src): self.lines.append(m.end())
        self.stack = []; self.units = []; self.skip = 0
    def off(self): l, c = self.getpos(); return self.lines[l - 1] + c
    def is_unit(self, tag, attrs):
        cls = set((dict(attrs).get("class") or "").split())
        if tag == "script" or tag == "style": return False
        if tag in UNIT_TAGS: return True
        if tag == "span" and (cls & UNIT_CLASSES or dict(attrs).get("role") in ("cell", "columnheader")): return True
        if tag == "button" and "btn-sm" in cls: return True
        return False
    def handle_starttag(self, tag, attrs):
        if tag in self.VOID: return
        start = self.off(); inner = start + len(self.get_starttag_text())
        unit = self.is_unit(tag, attrs) and not any(u for _, _, u in self.stack)
        self.stack.append((tag, inner, unit))
    def handle_startendtag(self, tag, attrs): pass
    def handle_endtag(self, tag):
        if tag in self.VOID: return
        while self.stack:
            t, inner, unit = self.stack.pop()
            if t == tag:
                if unit:
                    raw = self.src[inner:self.off()]
                    if raw.strip() and re.search(r"[A-Za-zÀ-ÿ]", re.sub(r"<[^>]+>", "", raw)): self.units.append((inner, self.off(), raw))
                break

ATTR_RE = re.compile(r'(aria-label|content)="([^"]*[A-Za-zÀ-ÿ][^"]*)"')

def extract():
    src = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
    f = Finder(src); f.feed(src)
    keys, fr = {}, {}
    def key_for(text):
        if text not in keys:
            keys[text] = f"t{len(keys) + 1:03d}"; fr[keys[text]] = text
        return keys[text]
    out = src
    for a, b, raw in sorted(f.units, key=lambda u: -u[0]):
        out = out[:a] + "{{" + key_for(raw) + "}}" + out[b:]
    # attributs : aria-label, et meta description / og:title / og:description
    def attr(m):
        name, val = m.group(1), m.group(2)
        if name == "content" and not re.search(r'(name="description"|property="og:(title|description)")', out[max(0, m.start() - 60):m.start()]):
            return m.group(0)
        return f'{name}="{{{{{key_for(val)}}}}}"'
    out = ATTR_RE.sub(attr, out)
    # données structurées
    m = re.search(r'"description":"([^"]+)"', out); out = out.replace(m.group(0), '"description":"{{' + key_for(m.group(1)) + '}}"')
    # renumérote dans l'ordre du document
    order = re.findall(r"\{\{(t\d{3})\}\}", out); ren = {}
    for k in order:
        if k not in ren: ren[k] = f"t{len(ren) + 1:03d}"
    out = re.sub(r"\{\{(t\d{3})\}\}", lambda m: "{{" + ren[m.group(1)] + "}}", out)
    fr = {ren[k]: v for k, v in fr.items()}
    fr = dict(sorted(fr.items()))
    os.makedirs(I18N, exist_ok=True)
    open(os.path.join(I18N, "template.html"), "w", encoding="utf-8").write(out)
    json.dump(fr, open(os.path.join(I18N, "fr.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(len(fr), "textes ->", os.path.join(I18N, "fr.json"))

def head_block(lang):
    alts = "\n".join(f'  <link rel="alternate" hreflang="{l}" href="{url(l)}">' for l in LANGS)
    return (f'  <link rel="canonical" href="{url(lang)}">\n{alts}\n  <link rel="alternate" hreflang="x-default" href="{url("fr")}">\n'
            f'  <meta property="og:url" content="{url(lang)}">')

DETECT = """  <script>/* langue : choix mémorisé, sinon langue du navigateur, sinon pays (fuseau horaire). Jamais pour les robots. */
  (function(){try{var u=navigator.userAgent;if(/bot|crawl|spider|slurp|lighthouse|facebookexternalhit|whatsapp|preview|headless/i.test(u))return;
  var q=new URLSearchParams(location.search);if(q.has('lang'))return;var L=['fr','ar','en','es','nl','it'],p=null;
  try{p=localStorage.getItem('sid_lang')}catch(e){}
  if(!p){var n=navigator.languages||[navigator.language||''];for(var i=0;i<n.length&&!p;i++){var c=(n[i]||'').slice(0,2).toLowerCase();if(L.indexOf(c)>=0)p=c}}
  if(!p){var z='';try{z=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){}
  var Z={'Europe/Madrid':'es','Atlantic/Canary':'es','Europe/Rome':'it','Europe/Amsterdam':'nl','Asia/Dubai':'ar','Asia/Riyadh':'ar','Asia/Qatar':'ar','Asia/Kuwait':'ar','Asia/Bahrain':'ar','Asia/Muscat':'ar'};
  p=Z[z]||(/^(Africa\\/(Casablanca|Algiers|Tunis|Dakar|Abidjan)|Europe\\/(Paris|Brussels|Luxembourg))/.test(z)?'fr':'en')}
  if(p&&p!=='fr'&&L.indexOf(p)>0)location.replace('/'+p+'/'+location.search+location.hash)}catch(e){}})();</script>"""

def switcher(lang):
    opts = "".join(f'<option value="{l}"{" selected" if l == lang else ""}>{NAMES[l]}</option>' for l in LANGS)
    return (f'<label class="lang-sw"><span class="sr">Langue</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/>'
            f'<path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'
            f'<select data-lang aria-label="Langue / Language">{opts}</select></label>')


# ------------------------------------------------------------------ guides mis en avant sur la page de lancement
GUIDE_DIR = os.path.join(ROOT, "src", "content", "guides")
FEATURED = ["creer-sa-societe-a-dubai", "golden-visa-dubai", "s-installer-a-dubai", "etudier-a-dubai", "s-installer-a-dubai-en-famille", "ouvrir-un-compte-bancaire-a-dubai"]
CLUSTER_IMG = {"installer": "/assets/photos/s-installer-a-dubai.webp", "societe": "/assets/photos/creer-sa-societe-a-dubai.webp", "visas": "/assets/photos/visa-dubai.webp", "famille": "/assets/photos/s-installer-a-dubai-en-famille.webp", "etudes": "/assets/photos/etudier-a-dubai.webp", "travail": "/assets/photos/travailler-a-dubai.webp", "vie": "/assets/photos/vivre-a-dubai.webp", "argent": "/assets/photos/transferer-de-l-argent-a-dubai.webp", "investir": "/assets/photos/investir-a-dubai.webp", "pays": "/assets/photos/s-installer-a-dubai-depuis-l-algerie.webp"}
GUIDES_TXT = {
    "fr": ("Guides gratuits", "Préparez votre projet avec nos guides", "Vérifiés sur les sources officielles, mis à jour régulièrement.", "Lire le guide", "Tous les guides"),
    "en": ("Free guides", "Plan your move with our guides", "Checked against official sources and kept up to date.", "Read the guide", "All guides"),
    "ar": ("أدلة مجانية", "حضّروا مشروعكم مع أدلتنا", "تم التحقق منها من المصادر الرسمية وتحدَّث بانتظام.", "اقرأ الدليل", "جميع الأدلة"),
    "es": ("Guías gratuitas", "Prepara tu proyecto con nuestras guías", "Verificadas con fuentes oficiales y actualizadas con regularidad.", "Leer la guía", "Todas las guías"),
    "nl": ("Gratis gidsen", "Bereid uw project voor met onze gidsen", "Gecontroleerd met officiële bronnen en regelmatig bijgewerkt.", "Lees de gids", "Alle gidsen"),
    "it": ("Guide gratuite", "Prepara il tuo progetto con le nostre guide", "Verificate sulle fonti ufficiali e aggiornate regolarmente.", "Leggi la guida", "Tutte le guide"),
}

def _fm(path):
    txt = open(path, encoding="utf-8").read()
    m = re.match(r"---\n(.*?)\n---\n", txt, re.S)
    out = {}
    for k in ("h1", "description", "cluster", "key", "image"):
        mm = re.search(r'^' + k + r':\s*"?(.*?)"?\s*$', m.group(1), re.M) if m else None
        if mm: out[k] = mm.group(1).replace('\\"', '"')
    return out

def srcset_attr(src):
    """Variante 800 px des photos (générée à côté de chaque photo de /assets/photos/)."""
    if not src or not src.startswith("/assets/photos/"): return ""
    return f' srcset="{src[:-5]}-800.webp 800w, {src} 1200w" sizes="(max-width: 700px) 100vw, 380px"'

def guides_block(lang):
    d = os.path.join(GUIDE_DIR, lang)
    if not os.path.isdir(d): return ""
    by_key = {}
    for f in sorted(os.listdir(d)):
        if not f.endswith(".md"): continue
        fm = _fm(os.path.join(d, f)); slug = f[:-3]
        key = slug if lang == "fr" else fm.get("key", slug)
        by_key[key] = (("/" if lang == "fr" else f"/{lang}/") + slug + "/", fm)
    items = [by_key[k] for k in FEATURED if k in by_key]
    if not items: return ""
    eb, title, sub, go, allg = GUIDES_TXT[lang]
    esc = lambda x: x.replace("&", "&amp;").replace("<", "&lt;").replace('"', "&quot;")
    cards = "".join(
        f'<li><a class="card" href="{href}"><span class="card-img"><img src="{fm.get("image") or CLUSTER_IMG.get(fm.get("cluster"), "/assets/img/og.jpg")}"{srcset_attr(fm.get("image") or CLUSTER_IMG.get(fm.get("cluster")))} alt="" width="640" height="360" loading="lazy"></span>'
        f'<span class="card-body"><span class="card-t">{esc(fm.get("h1", ""))}</span><span class="card-d">{esc(fm.get("description", ""))}</span><span class="card-go">{go} →</span></span></a></li>'
        for href, fm in items)
    hub = "/guides/" if lang == "fr" else f"/{lang}/guides/"
    return (f'    <section class="sec sec-gray" aria-labelledby="guides-t">\n      <div class="wrap">\n        <p class="eyebrow center">{eb}</p>\n'
            f'        <h2 id="guides-t" class="center">{title}</h2>\n        <p class="center" style="margin:0 auto;max-width:40em;color:var(--muted)">{sub}</p>\n'
            f'        <ul class="cards">{cards}</ul>\n        <p class="center" style="margin-top:28px"><a class="btn btn-sm" href="{hub}">{allg} →</a></p>\n      </div>\n    </section>\n')

# ------------------------------------------------------------------ menu du site (même menu que les pages Astro)
NAV_TXT = {
    "fr": ("Services", "Guides", "Blog", "Créer sa société", "Visas et résidence", "Études", "Menu"),
    "en": ("Services", "Guides", "Blog", "Company formation", "Visas and residence", "Studies", "Menu"),
    "ar": ("الخدمات", "الأدلة", "المدونة", "تأسيس شركة", "التأشيرات والإقامة", "الدراسة", "القائمة"),
    "es": ("Servicios", "Guías", "Blog", "Crear empresa", "Visados y residencia", "Estudios", "Menú"),
    "nl": ("Diensten", "Gidsen", "Blog", "Bedrijf oprichten", "Visa en verblijf", "Studeren", "Menu"),
    "it": ("Servizi", "Guide", "Blog", "Aprire una società", "Visti e residenza", "Studi", "Menu"),
}

def nav_block(lang, signup):
    pre = "/" if lang == "fr" else f"/{lang}/"
    has = lambda c: os.path.isdir(os.path.join(ROOT, "src", "content", c, lang)) and any(f.endswith(".md") for f in os.listdir(os.path.join(ROOT, "src", "content", c, lang)))
    sv, gd, bl, so, vi, et, menu = NAV_TXT[lang]
    items = ([(pre + "services/", sv)] if has("services") else []) + [(pre + "guides/", gd)] + ([(pre + "blog/", bl)] if has("blog") else []) + \
            [(pre + "guides/#societe", so), (pre + "guides/#visas", vi), (pre + "guides/#etudes", et)]
    lis = "".join(f'<li><a href="{h}">{t}</a></li>' for h, t in items)
    return (f'    <nav class="nav" aria-label="{menu}" data-nav>\n      <div class="wrap nav-in">\n'
            f'        <a class="nav-logo" href="{pre}" aria-label="START IN DUBAI"><img src="/assets/img/logo-256.webp" alt="START IN DUBAI" width="256" height="165"></a>\n'
            f'        <ul class="nav-links" id="nav-links">{lis}</ul>\n'
            f'        <button class="btn btn-sm nav-cta" type="button" data-open-form><span class="btn-txt">{signup}</span></button>\n'
            f'        <button class="nav-burger" type="button" aria-expanded="false" aria-controls="nav-links" data-burger><span></span><b class="sr">{menu}</b></button>\n'
            f'      </div>\n    </nav>')

SERVICES_TXT = {
    "fr": ("Nos services", "Tout ce que nous prenons en charge à Dubaï", "Voir le service", "Tous nos services"),
    "en": ("Our services", "Everything we handle for you in Dubai", "See the service", "All our services"),
    "ar": ("خدماتنا", "كل ما نتولاه من أجلكم في دبي", "اكتشف الخدمة", "جميع خدماتنا"),
    "es": ("Nuestros servicios", "Todo lo que gestionamos por ti en Dubái", "Ver el servicio", "Todos nuestros servicios"),
    "nl": ("Onze diensten", "Alles wat wij voor u regelen in Dubai", "Bekijk de dienst", "Al onze diensten"),
    "it": ("I nostri servizi", "Tutto ciò di cui ci occupiamo per te a Dubai", "Scopri il servizio", "Tutti i nostri servizi"),
}

def services_block(lang):
    d = os.path.join(ROOT, "src", "content", "services", lang)
    if not os.path.isdir(d): return ""
    items = []
    for f in sorted(os.listdir(d)):
        if not f.endswith(".md"): continue
        fm = _fm(os.path.join(d, f))
        o = re.search(r"^order:\s*(\d+)", open(os.path.join(d, f), encoding="utf-8").read(), re.M)
        items.append((int(o.group(1)) if o else 99, ("/" if lang == "fr" else f"/{lang}/") + "services/" + f[:-3] + "/", fm))
    if not items: return ""
    items.sort(key=lambda x: x[0])
    eb, title, go, allg = SERVICES_TXT[lang]
    esc = lambda x: x.replace("&", "&amp;").replace("<", "&lt;").replace('"', "&quot;")
    cards = "".join(
        f'<li><a class="card" href="{href}"><span class="card-img"><img src="{fm.get("image") or CLUSTER_IMG.get(fm.get("cluster"), "/assets/img/og.jpg")}"{srcset_attr(fm.get("image") or CLUSTER_IMG.get(fm.get("cluster")))} alt="" width="640" height="360" loading="lazy"></span>'
        f'<span class="card-body"><span class="card-t">{esc(fm.get("h1", ""))}</span><span class="card-d">{esc(fm.get("description", ""))}</span><span class="card-go">{go} →</span></span></a></li>'
        for _, href, fm in items)
    hub = ("/" if lang == "fr" else f"/{lang}/") + "services/"
    return (f'    <section class="sec sec-gray" aria-labelledby="svc-t">\n      <div class="wrap">\n        <p class="eyebrow center">{eb}</p>\n'
            f'        <h2 id="svc-t" class="center">{title}</h2>\n        <ul class="cards">{cards}</ul>\n'
            f'        <p class="center" style="margin-top:28px"><a class="btn btn-sm" href="{hub}">{allg} →</a></p>\n      </div>\n    </section>\n')

def build():
    tpl = open(os.path.join(I18N, "template.html"), encoding="utf-8").read()
    fr = json.load(open(os.path.join(I18N, "fr.json"), encoding="utf-8"))
    form_fr = json.load(open(os.path.join(I18N, "form-fr.json"), encoding="utf-8"))
    for lang in LANGS:
        path = os.path.join(I18N, f"{lang}.json")
        if not os.path.exists(path): print("manque", path); continue
        tr = json.load(open(path, encoding="utf-8"))
        fpath = os.path.join(I18N, f"form-{lang}.json")
        form = json.load(open(fpath, encoding="utf-8")) if os.path.exists(fpath) else form_fr
        fm = [k for k in form_fr if k not in form]
        if fm: sys.exit(f"form-{lang}: clés manquantes {fm[:10]}")
        missing = [k for k in fr if k not in tr]
        if missing: sys.exit(f"{lang}: clés manquantes {missing[:10]}")
        for k, v in fr.items():   # mêmes balises dans la traduction que dans le français
            if re.findall(r"<(\w+)", v) != re.findall(r"<(\w+)", tr[k]): sys.exit(f"{lang} {k}: balises différentes\nFR {v}\n{lang} {tr[k]}")
        html = re.sub(r"\{\{(t\d{3}|c\d{2})\}\}", lambda m: tr[m.group(1)], tpl)
        html = html.replace("<!--INLINE_CSS-->", "<style>" + "\n".join(open(os.path.join(ROOT, "public", "assets", f), encoding="utf-8").read() for f in ("style.css", "site.css", "home.css")) + "</style>")
        rtl = lang == "ar"
        html = html.replace('<html lang="fr">', f'<html lang="{lang}"' + (' dir="rtl"' if rtl else "") + ">")
        html = re.sub(r'  <link rel="canonical".*?<meta property="og:url" content="[^"]*">', head_block(lang), html, flags=re.S)
        html = html.replace('content="fr_FR"', f'content="{LOCALE[lang]}"').replace('"inLanguage":"fr"', f'"inLanguage":"{lang}"')
        html = html.replace('"knowsLanguage":["fr","ar"]', '"knowsLanguage":["ar","fr","en","es","nl","it"]')
        # chemins absolus (les pages traduites sont dans un sous-dossier)
        html = re.sub(r'(src|href)="(assets/|config\.js)', r'\1="/\2', html)
        if rtl:
            html = html.replace("family=Montserrat", "family=Noto+Kufi+Arabic:wght@500;700;800&family=Montserrat")
        html = html.replace("<!--LANG_SWITCH-->", switcher(lang))
        html = html.replace("<!--LANG_DETECT-->", DETECT if lang == "fr" else "")
        html = html.replace("<!--FORM_I18N-->", "<script>window.SID_I18N=" + json.dumps(form, ensure_ascii=False) + ";</script>")
        u = CD_LETTERS[lang]
        html = html.replace("<!--CD_MINI-->", "".join(f'<span><b data-u="{k}">00</b>{u[i]}</span>' for i, k in enumerate("dhms")))
        links = " · ".join(f'<a href="{"/" if l == "fr" else "/" + l + "/"}" hreflang="{l}" lang="{l}" data-lang-link="{l}"' + (' aria-current="page"' if l == lang else "") + f">{NAMES[l]}</a>" for l in LANGS)
        html = html.replace("<!--LANG_LINKS-->", f'<p class="langs">{links}</p>')
        html = html.replace("<!--GUIDES-->", guides_block(lang))
        html = html.replace("<!--SERVICES-->", services_block(lang))
        html = html.replace("<!--NAV-->", nav_block(lang, tr["t007"]))
        out = os.path.join(PUB, "index.html") if lang == "fr" else os.path.join(PUB, lang, "index.html")
        os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, "w", encoding="utf-8").write(html)
        print("écrit", os.path.relpath(out, ROOT))
    # le sitemap (page de lancement + guides) est produit par Astro : src/pages/sitemap.xml.ts

if __name__ == "__main__":
    {"extract": extract, "build": build}[sys.argv[1]]()
