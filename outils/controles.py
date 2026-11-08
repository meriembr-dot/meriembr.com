# /// script
# dependencies = ["playwright"]
# ///
"""Contrôles du site (demandes du 8 novembre 2026) et captures.
Lancer : uv run -q outils/controles.py http://127.0.0.1:8765 <dossier_captures>
Code de sortie 1 si un contrôle échoue."""
import sys
from playwright.sync_api import sync_playwright

base, out = sys.argv[1].rstrip("/"), sys.argv[2]
ATTENDU = {"identite": 44, "packaging": 28, "edition": 48, "digital": 59}
echecs = []


def ok(cond, msg):
    print(("ok   " if cond else "ÉCHEC ") + msg)
    if not cond:
        echecs.append(msg)


def une_ligne(pg):
    # Hauteur du nœud texte « Bonjour, je suis Meriem » comparée à sa hauteur de ligne.
    return pg.evaluate("""() => {
      const h = document.querySelector('.nom'); const r = document.createRange();
      r.setStart(h.firstChild, 0); r.setEnd(h.firstChild, h.firstChild.length);
      const lignes = new Set([...r.getClientRects()].map(x => Math.round(x.top)));
      return lignes.size === 1 && h.scrollWidth <= h.clientWidth + 1;
    }""")


with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome")
    for chemin, lg in (("/", "fr"), ("/en/", "en")):
        url = base + chemin
        erreurs = []
        for larg, haut in ((1440, 900), (390, 844)):
            pg = b.new_page(viewport={"width": larg, "height": haut})
            pg.on("pageerror", lambda e: erreurs.append(str(e)))
            pg.on("console", lambda m: m.type == "error" and erreurs.append(m.text))
            pg.goto(url, wait_until="networkidle")
            ok(une_ligne(pg), f"{lg} {larg} : titre du hero sur une ligne")
            ok(pg.evaluate("document.documentElement.scrollWidth") <= larg, f"{lg} {larg} : pas de défilement horizontal")
            pg.screenshot(path=f"{out}/{lg}-{larg}-hero.png")
            for nom, sel in (("confiance", "#confiance"), ("parcours", "#parcours"),
                             ("collaborations", "#collaborations"), ("contact", "#contact")):
                pg.locator(sel).scroll_into_view_if_needed()
                pg.wait_for_timeout(300)
                if nom == "parcours":
                    pg.locator(".chrono .date").last.click()
                pg.locator(sel).screenshot(path=f"{out}/{lg}-{larg}-{nom}.png")
            pg.locator(".domaine-lien").first.click()
            pg.wait_for_timeout(600)
            pg.screenshot(path=f"{out}/{lg}-{larg}-expertise.png", full_page=False)
            pg.locator("#expertise").screenshot(path=f"{out}/{lg}-{larg}-expertise-complete.png")
            pg.close()

        pg = b.new_page(viewport={"width": 1440, "height": 900})
        pg.on("pageerror", lambda e: erreurs.append(str(e)))
        pg.goto(url, wait_until="networkidle")
        ok(pg.locator(".galerie.ouverte").count() == 0, f"{lg} : aucune galerie ouverte au départ")
        for dom, n in ATTENDU.items():
            lien = pg.locator(f'.domaine-lien[data-domaine="{dom}"]')
            lien.click()
            pg.wait_for_timeout(200)
            ouverte = pg.locator(".galerie.ouverte")
            total = pg.evaluate(f"document.querySelectorAll('#galerie-{dom} .vignette').length")
            ok(ouverte.count() == 1 and ouverte.get_attribute("data-domaine") == dom and total == n,
               f"{lg} : carte {dom} ouvre sa galerie ({total}/{n})")
            ok(lien.get_attribute("aria-expanded") == "true", f"{lg} : {dom} aria-expanded")
            ok(pg.evaluate("location.hash") == f"#expertise/{dom}", f"{lg} : lien profond #expertise/{dom}")
            while pg.locator("#plus").is_visible():
                pg.locator("#plus").click()
            vis = pg.locator(".galerie.ouverte .vignette:not([hidden])").count()
            ok(vis == n, f"{lg} : {dom} affiche {vis} réalisations après Voir plus")
        pg.go_back()
        pg.wait_for_timeout(200)
        ok(pg.evaluate("location.hash") == "#expertise/edition" and
           pg.locator(".galerie.ouverte").get_attribute("data-domaine") == "edition", f"{lg} : bouton Retour")
        pg.goto(url + "#expertise/packaging", wait_until="networkidle")
        ok(pg.locator(".galerie.ouverte").get_attribute("data-domaine") == "packaging", f"{lg} : lien profond au chargement")

        # Visionneuse
        premier = pg.locator(".galerie.ouverte .vignette a").first
        premier.focus()
        pg.keyboard.press("Enter")
        ok(pg.locator("#visionneuse[open]").count() == 1, f"{lg} : visionneuse ouverte")
        pg.keyboard.press("ArrowRight")
        ok(pg.locator(".vis-compteur").inner_text() == "2 / 28", f"{lg} : flèche droite (2 / 28)")
        pg.keyboard.press("ArrowLeft")
        pg.keyboard.press("ArrowLeft")
        ok(pg.locator(".vis-compteur").inner_text() == "28 / 28", f"{lg} : flèche gauche boucle")
        pg.keyboard.press("Escape")
        ok(pg.locator("#visionneuse[open]").count() == 0, f"{lg} : Échap ferme")
        ok(pg.evaluate("document.activeElement === document.querySelector('.galerie.ouverte .vignette a')"), f"{lg} : focus rendu")

        # Projets de confiance
        liens = pg.locator(".projet-confiance")
        ok(liens.count() == 4, f"{lg} : 4 projets de confiance")
        for i in range(4):
            liens.nth(i).click()
            nom = pg.locator(".vis-legende").inner_text()
            pg.wait_for_function("document.querySelector('.vis-image').complete && document.querySelector('.vis-image').naturalWidth > 0")
            ok(pg.locator("#visionneuse[open]").count() == 1 and pg.locator(".vis-compteur").inner_text() == f"{i + 1} / 4",
               f"{lg} : projet {nom} s'ouvre")
            pg.keyboard.press("Escape")

        ok(pg.locator("#collaborations h2").inner_text() in ("Mes collaborations", "My collaborations"), f"{lg} : section collaborations")
        ok(pg.locator("#temoignages").count() == 0, f"{lg} : témoignages absents du rendu")
        dates = pg.locator(".chrono .date").last
        ok(dates.locator(".debut").inner_text() == "2020", f"{lg} : frise, dernière étape 2020")
        ok(pg.locator(".avatar, .pupille").count() == 0, f"{lg} : avatar retiré")
        ok(not erreurs, f"{lg} : aucune erreur JS {erreurs[:3]}")
        pg.close()

        # Mouvement réduit : pas de défilement des logos, transitions coupées
        ctx = b.new_context(reduced_motion="reduce", viewport={"width": 1440, "height": 900})
        pg = ctx.new_page()
        pg.goto(url, wait_until="networkidle")
        ok(pg.locator(".clients-defile").count() == 0, f"{lg} : mouvement réduit, logos fixes")
        anim = pg.evaluate("getComputedStyle(document.querySelector('.piste')).animationName")
        ok(anim == "none", f"{lg} : mouvement réduit, bandeau arrêté ({anim})")
        ctx.close()

        # Sans JS : toutes les réalisations visibles, groupées par domaine
        ctx = b.new_context(java_script_enabled=False, viewport={"width": 1440, "height": 900})
        pg = ctx.new_page()
        pg.goto(url, wait_until="load")
        vis = pg.evaluate("[...document.querySelectorAll('.galerie')].map(g => g.offsetParent !== null ? g.querySelectorAll('.vignette').length : 0)")
        ok(vis == list(ATTENDU.values()), f"{lg} : sans JS, galeries visibles {vis}")
        ctx.close()
    b.close()

print(f"{len(echecs)} échec(s)")
sys.exit(1 if echecs else 0)
