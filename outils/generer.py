"""Génère les miniatures WebP et data/travaux.json.

Lancer depuis la racine du dépôt : python3 -I outils/generer.py [racine]
Source éditable : data/travaux.json (client, grand).
"""
import json
import re
import sys
from pathlib import Path

from PIL import Image

CATEGORIES = [
    ("logos", "Logos", "Logos"),
    ("visual_identity", "Identité visuelle", "Visual identity"),
    ("flyers_leaflets", "Flyers et dépliants", "Flyers and leaflets"),
    ("books_magazines", "Livres et magazines", "Books and magazines"),
    ("packaging_labels", "Packaging et étiquettes", "Packaging and labels"),
    ("various", "Divers", "Various"),
    ("web", "Web", "Web"),
    ("pos_panels_dressing", "PLV et habillage", "POS and dressing"),
    ("gaming", "Gaming", "Gaming"),
]
TAILLE_MIN = 600


def numero(nom):
    m = re.match(r"(\d+)", nom)
    return int(m.group(1)) if m else 0


def deviner_client(nom):
    reste = re.sub(r"^\d+-?", "", nom)
    return " ".join(m.capitalize() for m in re.split(r"[-_]+", reste) if m)


def miniature(src, dst):
    dst.parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(src)
    if getattr(im, "n_frames", 1) > 1:
        images = []
        for i in range(im.n_frames):
            im.seek(i)
            f = im.convert("RGBA")
            f.thumbnail((TAILLE_MIN, TAILLE_MIN))
            images.append(f)
        images[0].save(dst, "WEBP", save_all=True, append_images=images[1:],
                       duration=im.info.get("duration", 100), loop=0, quality=80)
    else:
        im = im.convert("RGB")
        im.thumbnail((TAILLE_MIN, TAILLE_MIN))
        im.save(dst, "WEBP", quality=80)


def charger_travaux(racine):
    existant = {}
    fj = racine / "data/travaux.json"
    if fj.exists():
        existant = {t["fichier"]: t for t in json.loads(fj.read_text(encoding="utf-8"))}
    travaux = []
    for cle, _, _ in CATEGORIES:
        dossier = racine / "img/portfolio" / cle
        fichiers = [p for p in dossier.glob("*") if p.suffix in (".jpg", ".gif")] if dossier.exists() else []
        for i, p in enumerate(sorted(fichiers, key=lambda p: (numero(p.stem), p.name))):
            rel = p.relative_to(racine).as_posix()
            pdf = f"pdf/{cle}/{p.stem}.pdf"
            ancien = existant.get(rel, {})
            travaux.append({
                "fichier": rel,
                "min": f"img/min/{cle}/{p.stem}.webp",
                "categorie": cle,
                "client": ancien.get("client", deviner_client(p.stem)),
                "grand": ancien.get("grand", i == 0),
                "pdf": pdf if (racine / pdf).exists() else None,
            })
    return travaux


def injecter(texte, nom, contenu):
    debut, fin = f"<!-- {nom}:debut -->", f"<!-- {nom}:fin -->"
    if debut not in texte or fin not in texte:
        raise ValueError(f"marqueur {nom} absent")
    a = texte.index(debut) + len(debut)
    b = texte.index(fin)
    return texte[:a] + contenu + texte[b:]


def main(racine=Path(".")):
    travaux = charger_travaux(racine)
    for t in travaux:
        src, dst = racine / t["fichier"], racine / t["min"]
        if not dst.exists() or dst.stat().st_mtime < src.stat().st_mtime:
            miniature(src, dst)
    (racine / "data").mkdir(exist_ok=True)
    (racine / "data/travaux.json").write_text(
        json.dumps(travaux, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(len(travaux), "travaux")
    return travaux


if __name__ == "__main__":
    main(Path(sys.argv[1]) if len(sys.argv) > 1 else Path("."))
