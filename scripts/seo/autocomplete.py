"""Inventaire de mots-clés par l'autocomplétion Google (gratuit, sans clé).

  python3 -I scripts/seo/autocomplete.py --hl fr --gl fr,ma --seeds seeds.txt --out keywords.csv [--deep] [--sleep 1.0]

Pour chaque mot-clé de départ (un par ligne dans seeds.txt) et chaque pays :
  - la requête telle quelle ; requête + « a » … « z » ; mots interrogatifs propres à la langue placés devant.
Sortie CSV : keyword ; nb_pays ; pays ; nb_apparitions ; graines (indicateur de demande quand on n'a pas de volumes).

Robustesse (Google bloque si on l'interroge trop vite, réponse 403 « Sorry ») :
  - chaque réponse est ajoutée au cache <out>.cache.jsonl : une reprise ne refait pas les requêtes déjà faites ;
  - après 5 échecs de suite, le script s'arrête proprement et écrit le CSV avec ce qu'il a déjà ;
  - UNE seule exécution à la fois sur la machine, --sleep 1.0 conseillé.
"""
import argparse, csv, json, os, string, sys, time, urllib.parse, urllib.request
from collections import defaultdict

Q = {
    "fr": ["comment", "combien", "prix", "pourquoi", "quel", "est-ce que", "avis", "conditions"],
    "en": ["how to", "how much", "cost", "best", "can", "requirements", "what is", "is it"],
    "ar": ["كيف", "كم", "تكلفة", "شروط", "ما هي", "أفضل", "هل", "طريقة"],
    "es": ["cómo", "cuánto", "precio", "requisitos", "qué", "mejor", "es", "cuesta"],
    "nl": ["hoe", "wat kost", "kosten", "voorwaarden", "wat is", "beste", "kan", "is"],
    "it": ["come", "quanto", "costo", "requisiti", "cosa", "migliore", "conviene", "si può"],
}

class Blocked(Exception):
    pass

def suggest(q, hl, gl):
    url = "https://suggestqueries.google.com/complete/search?" + urllib.parse.urlencode({"client": "firefox", "hl": hl, "gl": gl, "q": q})
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read().decode("utf-8", "replace"))[1]

def write_csv(cache, out):
    found = defaultdict(lambda: {"gl": set(), "n": 0, "seeds": set()})
    for (seed, gl, _q), sugg in cache.items():
        for k in sugg:
            k = k.strip().lower(); f = found[k]; f["gl"].add(gl); f["n"] += 1; f["seeds"].add(seed)
    rows = sorted(found.items(), key=lambda kv: (-len(kv[1]["gl"]), -kv[1]["n"], kv[0]))
    with open(out, "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh, delimiter=";")
        w.writerow(["keyword", "nb_pays", "pays", "nb_apparitions", "graines"])
        for k, f in rows: w.writerow([k, len(f["gl"]), ",".join(sorted(f["gl"])), f["n"], " | ".join(sorted(f["seeds"]))])
    return len(rows)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--hl", required=True); ap.add_argument("--gl", required=True)
    ap.add_argument("--seeds", required=True); ap.add_argument("--out", required=True)
    ap.add_argument("--deep", action="store_true"); ap.add_argument("--sleep", type=float, default=1.0)
    a = ap.parse_args()
    seeds = [s.strip() for s in open(a.seeds, encoding="utf-8") if s.strip() and not s.startswith("#")]
    countries = a.gl.split(",")
    suffixes = [""] + [" " + c for c in string.ascii_lowercase] + ([" " + d for d in "0123456789"] if a.deep else [])
    if a.hl == "ar": suffixes = [""] + [" " + c for c in "ابتثجحخدذرزسشصضطظعغفقكلمنهوي"]
    cache_path = a.out + ".cache.jsonl"
    cache = {}
    if os.path.exists(cache_path):
        for line in open(cache_path, encoding="utf-8"):
            try: d = json.loads(line); cache[(d["seed"], d["gl"], d["q"])] = d["s"]
            except Exception: pass
    todo = [(s, gl, q) for s in seeds for gl in countries for q in [s + x for x in suffixes] + [p + " " + s for p in Q.get(a.hl, [])] if (s, gl, q) not in cache]
    print(f"{len(cache)} requêtes déjà en cache, {len(todo)} à faire", file=sys.stderr)
    fails = 0
    with open(cache_path, "a", encoding="utf-8") as ch:
        for i, (s, gl, q) in enumerate(todo, 1):
            try:
                sugg = suggest(q, a.hl, gl); fails = 0
            except Exception as e:
                fails += 1
                print(f"échec {fails} ({e})", file=sys.stderr)
                if fails >= 5:
                    print("Google bloque (5 échecs de suite) : arrêt, CSV écrit avec les données déjà récoltées. Relancer plus tard reprend le cache.", file=sys.stderr)
                    break
                time.sleep(5 * fails); continue
            cache[(s, gl, q)] = sugg
            ch.write(json.dumps({"seed": s, "gl": gl, "q": q, "s": sugg}, ensure_ascii=False) + "\n"); ch.flush()
            if i % 100 == 0: print(f"{i}/{len(todo)}", file=sys.stderr)
            time.sleep(a.sleep)
    n = write_csv(cache, a.out)
    print(f"{n} mots-clés -> {a.out}", file=sys.stderr)

if __name__ == "__main__":
    main()
