"""Page d'avant-première START IN DUBAI en 6 langues (fr, ar, en, es, nl, it).

  python3 tools/i18n.py extract   # une seule fois : index.html (fr) -> i18n/template.html + i18n/fr.json
  python3 tools/i18n.py build     # i18n/template.html + i18n/<lang>.json -> index.html, en/, ar/, es/, nl/, it/ + sitemap.xml

Le français reste la source : on modifie i18n/fr.json (ou template.html pour la structure), puis on reporte
la même clé dans les autres langues et on relance build. Ne jamais éditer les index.html générés."""
import json, os, re, sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
I18N = os.path.join(ROOT, "i18n")
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
        html = re.sub(r"\{\{(t\d{3})\}\}", lambda m: tr[m.group(1)], tpl)
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
        out = os.path.join(ROOT, "index.html") if lang == "fr" else os.path.join(ROOT, lang, "index.html")
        os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, "w", encoding="utf-8").write(html)
        print("écrit", os.path.relpath(out, ROOT))
    alts = "".join(f'\n    <xhtml:link rel="alternate" hreflang="{l}" href="{url(l)}"/>' for l in LANGS) + f'\n    <xhtml:link rel="alternate" hreflang="x-default" href="{url("fr")}"/>'
    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
    for l in LANGS:
        sm += f"  <url>\n    <loc>{url(l)}</loc>{alts}\n  </url>\n"
    open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8").write(sm + "</urlset>\n")
    print("écrit sitemap.xml")

if __name__ == "__main__":
    {"extract": extract, "build": build}[sys.argv[1]]()
