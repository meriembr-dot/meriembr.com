"""Tests de generer.py. Lancer : python3 -I outils/test_generer.py"""
import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from PIL import Image
import generer as g


def test_numero():
    assert g.numero("28-klinika") == 28
    assert g.numero("1") == 1
    assert g.numero("sans") == 0


def test_deviner_client():
    assert g.deviner_client("28-klinika") == "Klinika"
    assert g.deviner_client("14-strategie-de-com") == "Strategie De Com"
    assert g.deviner_client("2-") == ""
    assert g.deviner_client("1") == ""


def test_injecter():
    html = "a<!-- x:debut -->vieux<!-- x:fin -->b"
    assert g.injecter(html, "x", "neuf") == "a<!-- x:debut -->neuf<!-- x:fin -->b"
    try:
        g.injecter("rien", "x", "neuf")
    except ValueError:
        pass
    else:
        raise AssertionError("marqueur absent non détecté")


def test_charger_travaux_tri_pdf_et_conservation():
    with tempfile.TemporaryDirectory() as d:
        r = Path(d)
        cat = r / "img/portfolio/books_magazines"
        cat.mkdir(parents=True)
        for nom in ("10-b.jpg", "2-a.jpg"):
            Image.new("RGB", (500, 500), "red").save(cat / nom)
        (r / "pdf/books_magazines").mkdir(parents=True)
        (r / "pdf/books_magazines/10-b.pdf").write_bytes(b"%PDF")
        t = g.charger_travaux(r)
        assert [x["fichier"] for x in t] == [
            "img/portfolio/books_magazines/2-a.jpg",
            "img/portfolio/books_magazines/10-b.jpg",
        ]
        assert t[0]["grand"] is True and t[1]["grand"] is False
        assert t[1]["pdf"] == "pdf/books_magazines/10-b.pdf" and t[0]["pdf"] is None
        assert t[0]["min"] == "img/min/books_magazines/2-a.webp"
        (r / "data").mkdir()
        t[0]["client"] = "Corrigé"
        t[0]["grand"] = False
        (r / "data/travaux.json").write_text(json.dumps(t), encoding="utf-8")
        t2 = g.charger_travaux(r)
        assert t2[0]["client"] == "Corrigé" and t2[0]["grand"] is False


def test_miniature_gif_anime():
    with tempfile.TemporaryDirectory() as d:
        r = Path(d)
        src = r / "a.gif"
        imgs = [Image.new("RGB", (500, 500), c) for c in ("red", "blue")]
        imgs[0].save(src, save_all=True, append_images=imgs[1:], duration=100, loop=0)
        dst = r / "min/a.webp"
        g.miniature(src, dst)
        out = Image.open(dst)
        assert out.format == "WEBP" and getattr(out, "n_frames", 1) == 2
        assert max(out.size) <= 600


def _travaux_exemple():
    return [
        {"fichier": "img/portfolio/logos/1-a.jpg", "min": "img/min/logos/1-a.webp",
         "categorie": "logos", "client": "A & B", "grand": True, "pdf": None},
        {"fichier": "img/portfolio/books_magazines/3-c.jpg", "min": "img/min/books_magazines/3-c.webp",
         "categorie": "books_magazines", "client": "", "grand": False, "pdf": "pdf/books_magazines/3-c.pdf"},
    ]


def test_domaine():
    assert g.domaine("logos") == g.domaine("visual_identity") == "identite"
    assert g.domaine("packaging_labels") == "packaging"
    assert {g.domaine(c) for c in ("books_magazines", "flyers_leaflets", "various")} == {"edition"}
    assert {g.domaine(c) for c in ("web", "gaming", "pos_panels_dressing")} == {"digital"}
    # Chaque catégorie d'origine appartient à exactement un domaine.
    toutes = [c for _, _, _, cats in g.DOMAINES for c in cats]
    assert sorted(toutes) == sorted(c for c, _, _ in g.CATEGORIES)


def test_repartition_reelle():
    racine = Path(__file__).parent.parent
    travaux = json.loads((racine / "data/travaux.json").read_text(encoding="utf-8"))
    compte = {}
    for t in travaux:
        compte[g.domaine(t["categorie"])] = compte.get(g.domaine(t["categorie"]), 0) + 1
    assert compte == {"identite": 44, "packaging": 28, "edition": 48, "digital": 59}


def test_rendu_travaux():
    with tempfile.TemporaryDirectory() as d:
        r = Path(d)
        for t in _travaux_exemple():
            (r / t["min"]).parent.mkdir(parents=True, exist_ok=True)
            Image.new("RGB", (500, 400)).save(r / t["min"], "WEBP")
        h = g.rendu_travaux(_travaux_exemple(), "en", "../", r)
    assert '<li class="vignette" data-cat="logos">' in h and "grand" not in h
    assert 'src="../img/min/logos/1-a.webp" width="500" height="400"' in h
    assert 'alt="Logos, A &amp; B"' in h
    assert '<span class="vignette-legende">Logos, A &amp; B</span>' in h
    assert 'data-pdf="../pdf/books_magazines/3-c.pdf"' in h
    # 4 galeries, dans l'ordre, avec leur compte ; un domaine vide reste présent avec (0).
    assert h.count('<section class="galerie"') == 4
    assert h.index('id="galerie-identite"') < h.index('id="galerie-packaging"') < h.index('id="galerie-edition"')
    assert 'Visual identity <span>(1)</span>' in h and 'Publishing &amp; Print <span>(1)</span>' in h
    assert 'Packaging &amp; product design <span>(0)</span>' in h
    edition = h[h.index('id="galerie-edition"'):h.index('id="galerie-digital"')]
    assert "3-c.webp" in edition and "1-a.webp" not in edition


def test_rendu_bandeau():
    h = g.rendu_bandeau([{"logo": "x", "nom": "L'île"}, {"logo": "y", "nom": "DeFacto"}])
    assert h.count("<span>L&#x27;île</span>") == 2 and h.count("<span>DeFacto</span>") == 2
    assert '<span aria-hidden="true">' in h


def test_rendu_clients():
    h = g.rendu_clients([{"logo": "img/testimonial/l'ile.jpg", "nom": "L'île"}], "")
    assert "src=\"img/testimonial/l&#x27;ile.jpg\"" in h and 'alt="L&#x27;île"' in h


if __name__ == "__main__":
    for nom, f in list(globals().items()):
        if nom.startswith("test_"):
            f()
            print("ok", nom)
