# /// script
# dependencies = ["playwright"]
# ///
"""Captures et test clavier. Lancer : uv run -q outils/captures.py http://127.0.0.1:8765 <dossier_sortie>"""
import sys
from playwright.sync_api import sync_playwright

base, out = sys.argv[1], sys.argv[2]
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome")
    for page_url, nom in ((base + "/", "fr"), (base + "/en/", "en")):
        for larg in (375, 768, 1440):
            pg = b.new_page(viewport={"width": larg, "height": 900})
            pg.goto(page_url, wait_until="networkidle")
            largeur_doc = pg.evaluate("document.documentElement.scrollWidth")
            print(nom, larg, "défilement horizontal" if largeur_doc > larg else "ok largeur")
            pg.screenshot(path=f"{out}/{nom}-{larg}.png", full_page=True)
            pg.close()
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    pg.goto(base + "/#travaux/packaging_labels", wait_until="networkidle")
    vis = pg.locator(".vignette:not([hidden])").count()
    print("filtre packaging_labels :", vis, "vignettes visibles")
    pg.locator(".vignette:not([hidden]) a").first.focus()
    pg.keyboard.press("Enter")
    print("visionneuse ouverte :", pg.locator("#visionneuse[open]").count() == 1)
    pg.keyboard.press("ArrowRight")
    print("compteur :", pg.locator(".vis-compteur").inner_text())
    pg.keyboard.press("Escape")
    focus = pg.evaluate("document.activeElement.closest('.vignette') !== null")
    print("visionneuse fermée :", pg.locator("#visionneuse[open]").count() == 0, "| focus rendu :", focus)
    b.close()
