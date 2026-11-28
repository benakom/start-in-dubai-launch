"""Pose une vraie photo (banque Magnific / Freepik, sous licence) sur une page du site.

  ~/.local/video-tools/env/bin/python3 -I scripts/photos/place.py \
      --url "<URL signée de stock_download>" --coll guides --slug vivre-a-dubai \
      --alt "Texte alternatif en français, qui décrit la scène" [--credit "Photo : Freepik"] [--n 1] [--focus 0.5]

- --n 1 = photo de couverture : écrit public/assets/photos/<slug>.webp, renseigne image / imageAlt / imageCredit
  dans la page française et `image` dans toutes ses traductions (même clé).
- --n 2, 3… = photo dans le texte : écrit public/assets/photos/<slug>-<n>.webp et remplace la ligne
  `<!-- PHOTO <n> -->` de la page française par une <figure> (texte alternatif + crédit).
- Recadrage 3:2, 1200 x 800, WebP qualité 80. --focus = position verticale du recadrage (0 haut, 1 bas).
"""
import argparse, glob, io, os, re, sys, urllib.request
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()

def to_webp(data, out, focus):
    im = Image.open(io.BytesIO(data)).convert("RGB")
    w, h = im.size
    if w / h > 1.5:
        nw = int(h * 1.5); x = (w - nw) // 2; im = im.crop((x, 0, x + nw, h))
    else:
        nh = int(w / 1.5); y = int((h - nh) * focus); im = im.crop((0, y, w, y + nh))
    im = im.resize((1200, 800), Image.LANCZOS)
    im.save(out, "WEBP", quality=80, method=6)
    return os.path.getsize(out)

def yq(s):
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'

def set_fm(path, fields):
    t = open(path, encoding="utf-8").read()
    m = re.match(r"---\n(.*?)\n---\n", t, re.S)
    fm = m.group(1)
    for k, v in fields.items():
        line = f"{k}: {yq(v)}"
        if re.search(rf"^{k}:.*$", fm, re.M):
            fm = re.sub(rf"^{k}:.*$", lambda _: line, fm, count=1, flags=re.M)
        else:
            fm = fm + "\n" + line
    open(path, "w", encoding="utf-8").write("---\n" + fm + "\n---\n" + t[m.end():])

def main():
    a = argparse.ArgumentParser()
    a.add_argument("--url", required=True); a.add_argument("--coll", required=True, choices=["guides", "blog", "services"])
    a.add_argument("--slug", required=True); a.add_argument("--alt", required=True)
    a.add_argument("--credit", default="Photo : Freepik"); a.add_argument("--n", type=int, default=1)
    a.add_argument("--focus", type=float, default=0.5)
    o = a.parse_args()
    fr = os.path.join(ROOT, "src/content", o.coll, "fr", o.slug + ".md")
    if not os.path.exists(fr): sys.exit(f"page introuvable : {fr}")
    name = o.slug if o.n == 1 else f"{o.slug}-{o.n}"
    out = os.path.join(ROOT, "public/assets/photos", name + ".webp")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    size = to_webp(fetch(o.url), out, o.focus)
    web = f"/assets/photos/{name}.webp"
    if o.n == 1:
        set_fm(fr, {"image": web, "imageAlt": o.alt, "imageCredit": o.credit})
        tr = 0
        for p in glob.glob(os.path.join(ROOT, "src/content", o.coll, "*", "*.md")):
            if "/fr/" in p: continue
            if re.search(rf'^key:\s*"?{re.escape(o.slug)}"?\s*$', open(p, encoding="utf-8").read(), re.M):
                set_fm(p, {"image": web}); tr += 1
        print(f"OK couverture {web} ({size // 1024} Ko), page fr + {tr} traductions")
    else:
        t = open(fr, encoding="utf-8").read()
        mark = f"<!-- PHOTO {o.n} -->"
        if mark not in t: sys.exit(f"repère {mark} absent de {fr}")
        fig = (f'<figure><img src="{web}" alt="{o.alt.replace(chr(34), "&quot;")}" width="1200" height="800" loading="lazy" decoding="async" />'
               f"<figcaption>{o.alt} · {o.credit}</figcaption></figure>")
        open(fr, "w", encoding="utf-8").write(t.replace(mark, fig, 1))
        print(f"OK photo {o.n} {web} ({size // 1024} Ko) dans {o.slug}")

if __name__ == "__main__":
    main()
