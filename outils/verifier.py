"""Liste les liens locaux cassés (src, href, url()) des pages et CSS donnés.
Lancer : python3 -I outils/verifier.py index.html en/index.html css/site.css
Code de sortie 1 si un lien est cassé."""
import re
import sys
import urllib.parse
from pathlib import Path

casses = []
for f in map(Path, sys.argv[1:]):
    texte = f.read_text(encoding="utf-8")
    for m in re.finditer(r'(?:src|href)="([^"]+)"|url\(["\']?([^"\')]+)', texte):
        u = m.group(1) or m.group(2)
        if re.match(r"(https?:|mailto:|tel:|data:|#)", u):
            continue
        chemin = urllib.parse.unquote(u.split("#")[0].split("?")[0])
        if chemin and not (f.parent / chemin).exists():
            casses.append(f"{f}: {u}")
print("\n".join(casses) or "0 lien cassé")
sys.exit(1 if casses else 0)
