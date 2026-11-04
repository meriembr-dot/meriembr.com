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


if __name__ == "__main__":
    for nom, f in list(globals().items()):
        if nom.startswith("test_"):
            f()
            print("ok", nom)
