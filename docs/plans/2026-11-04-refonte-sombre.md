# Refonte meriembr.com, direction sombre : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Remplacer l'habillage ludique de la branche `refonte` par la direction sombre premium validée sur maquette, avec l'avatar dont les yeux suivent la souris.

**Architecture:** On garde le socle déjà construit et testé : `outils/generer.py` (miniatures, injection entre marqueurs), `js/galerie.js` (fonctions pures), le comportement filtres et visionneuse de `js/site.js`, `outils/verifier.py`, `outils/captures.py`. On remplace polices, CSS, HTML des deux pages, et on ajoute au générateur la sélection de 6 projets et le bandeau des noms clients. La maquette `docs/maquette/index.html` est la référence visuelle : son CSS et son JS (yeux, curseur) se reprennent tels quels, adaptés aux chemins du site.

**Tech Stack:** HTML, CSS, JS ES modules, Python 3 + Pillow, Node 22 (`node --test`), Playwright via `uv run`.

**Spec:** `docs/specs/2026-11-04-refonte-design.md` (version 3, lire en entier). Référence visuelle : `docs/maquette/index.html`.

## Global Constraints

- Dépôt `/home/aziz/workspace/meriembr.com`, branche `refonte`. Ne jamais toucher `main`. Commits en chemins explicites. Pas de push.
- Le shell revient à `/home/aziz/homelab` après chaque commande et `cd X &&` est proscrit : chemins absolus, `git -C`, racine passée aux scripts.
- Un hook de sécurité peut bloquer des commandes sur ce dépôt (suppressions, exécution du générateur) : ne pas contourner, signaler la commande exacte.
- Aucune dépendance JS/CSS externe, aucun CDN ni Google Fonts au chargement.
- Aucun tiret cadratin ni demi-cadratin dans les fichiers.
- Couleurs : `--fond #0E0E10`, `--surface #17171A`, `--ligne #2A2A2E`, `--texte #F2EFEA`, `--doux #9A968F`, `--accent #E4FF5A`.
- Polices : Inter Tight (variable) et Instrument Serif (normal, italique), fontsource 5.3.0, woff2 dans `fonts/`.
- En-tête : « Meriem *Ben Rejeb* » (pas « MBR studio »).
- Contact : `contact@meriembr.com`, `tel:+33695368115` (affiché 06 95 36 81 15), `https://wa.me/33695368115`, `https://www.instagram.com/mbr.graphic.designer`, Sèvres.
- Accessibilité : contrastes de la spec, cibles 44 px, focus visible accent, `prefers-reduced-motion` coupe animations, yeux et curseur.
- Tests : `python3 -I /home/aziz/workspace/meriembr.com/outils/test_generer.py`, `node --test /home/aziz/workspace/meriembr.com/js/*.test.mjs`.
- Serveur local déjà lancé : `http://127.0.0.1:8765` sert le dépôt. Sorties de captures : `/tmp/claude-1000/-home-aziz-homelab/5757e408-73c6-44c2-9c9e-9d15295fbc1d/scratchpad/captures-refonte`.

---

### Task A: Polices, avatar, nettoyage de la direction ludique

**Files:**
- Delete: `fonts/caveat.woff2`, `fonts/quicksand.woff2`, `img/dessins.svg`, `img/avatar-provisoire.svg`
- Restore: `css/site.css` (modification non commitée d'une tâche abandonnée : `git -C … checkout -- css/site.css`) ; supprimer les fichiers non suivis `sitemap.xml`, `robots.txt`, `img/og.png` (refaits en tâche D)
- Create: `fonts/inter-tight.woff2`, `fonts/instrument-serif.woff2`, `fonts/instrument-serif-italic.woff2`, `fonts/OFL.txt` (réécrit), `img/avatar.webp`

**Interfaces:** Produces : fichiers de polices et `img/avatar.webp` utilisés par la tâche C.

- [ ] **Step 1: Remettre l'arbre propre**

```bash
git -C /home/aziz/workspace/meriembr.com checkout -- css/site.css
rm /home/aziz/workspace/meriembr.com/sitemap.xml /home/aziz/workspace/meriembr.com/robots.txt /home/aziz/workspace/meriembr.com/img/og.png
git -C /home/aziz/workspace/meriembr.com rm -q fonts/caveat.woff2 fonts/quicksand.woff2 img/dessins.svg img/avatar-provisoire.svg
git -C /home/aziz/workspace/meriembr.com status --short
```

Expected : 4 suppressions indexées (`D`), plus aucun fichier non suivi hors `.superpowers/` (ignoré).

- [ ] **Step 2: Télécharger les polices**

```bash
F=/home/aziz/workspace/meriembr.com/fonts
curl -fsSL -o $F/inter-tight.woff2 https://cdn.jsdelivr.net/npm/@fontsource-variable/inter-tight@5.3.0/files/inter-tight-latin-wght-normal.woff2
curl -fsSL -o $F/instrument-serif.woff2 https://cdn.jsdelivr.net/npm/@fontsource/instrument-serif@5.3.0/files/instrument-serif-latin-400-normal.woff2
curl -fsSL -o $F/instrument-serif-italic.woff2 https://cdn.jsdelivr.net/npm/@fontsource/instrument-serif@5.3.0/files/instrument-serif-latin-400-italic.woff2
curl -fsSL -o $F/OFL-inter-tight.txt https://raw.githubusercontent.com/google/fonts/main/ofl/intertight/OFL.txt
curl -fsSL -o $F/OFL-instrument-serif.txt https://raw.githubusercontent.com/google/fonts/main/ofl/instrumentserif/OFL.txt
file $F/*.woff2
```

Expected : 3 lignes `Web Open Font Format (Version 2)`. Remplacer `fonts/OFL.txt` par la concaténation des deux licences, précédée de la ligne `Inter Tight et Instrument Serif : SIL Open Font License 1.1`, puis supprimer les deux fichiers `OFL-*.txt`. Si une URL de licence répond 404, lister `https://github.com/google/fonts/tree/main/ofl` pour trouver le bon dossier et le signaler dans le rapport.

- [ ] **Step 3: Avatar**

```bash
cp /home/aziz/workspace/meriembr.com/docs/maquette/avatar.webp /home/aziz/workspace/meriembr.com/img/avatar.webp
python3 -I -c "from PIL import Image; im=Image.open('/home/aziz/workspace/meriembr.com/img/avatar.webp'); print(im.size, im.format)"
```

Expected : `(900, 900) WEBP`.

- [ ] **Step 4: Commit**

```bash
git -C /home/aziz/workspace/meriembr.com add fonts/inter-tight.woff2 fonts/instrument-serif.woff2 fonts/instrument-serif-italic.woff2 fonts/OFL.txt img/avatar.webp
git -C /home/aziz/workspace/meriembr.com commit -m "feat: dark direction fonts and avatar; remove playful assets"
```

(Les suppressions indexées partent dans ce commit.) Les pages référencent encore les fichiers supprimés jusqu'à la tâche C : c'est attendu.

---

### Task B: Générateur, sélection et noms clients

**Files:**
- Create: `data/selection.json`
- Modify: `outils/generer.py`, `outils/test_generer.py`

**Interfaces:**
- Consumes : `CATEGORIES`, `libelle`, `injecter`, `rendu_filtres`, `rendu_travaux`, `rendu_clients`, `PAGES`, `main` (existants).
- Produces :
  - `rendu_selection(selection: list[dict], langue, prefixe) -> str` : un `<a class="projet" href="<prefixe><fichier>" data-fichier="<fichier>">` par entrée, contenant `<div class="cadre"><img src="<prefixe><fichier>" alt="<legende>" loading="lazy" decoding="async"></div><div class="legende"><span>01</span><span><legende></span></div>`, numéros sur 2 chiffres.
  - `rendu_bandeau(clients) -> str` : noms des clients en `<span>`, la liste écrite deux fois (défilement continu), le second passage dans un `<span aria-hidden="true">` englobant.
  - `rendu_travaux` : n'ajoute plus la classe `grand` (toutes les vignettes `class="vignette"`), et chaque vignette porte en plus une légende `<span class="vignette-legende">` (même texte que l'alt).
  - Nouveaux marqueurs injectés dans les deux pages : `selection`, `bandeau` (en plus de `filtres`, `travaux`, `clients`).
  - `data/selection.json` : liste de `{"fichier": str, "fr": str, "en": str}`.

- [ ] **Step 1: Créer `data/selection.json`**

```json
[
 {"fichier": "img/portfolio/books_magazines/5-jac2015.jpg", "fr": "Édition, JAC 2015", "en": "Publishing, JAC 2015"},
 {"fichier": "img/portfolio/visual_identity/1-Zahrat-Zanbaq.jpg", "fr": "Identité, Zahrat Zanbaq", "en": "Identity, Zahrat Zanbaq"},
 {"fichier": "img/portfolio/packaging_labels/1-Hangtags.gif", "fr": "Packaging, étiquettes", "en": "Packaging, labels"},
 {"fichier": "img/portfolio/pos_panels_dressing/1-defacto.jpg", "fr": "PLV, DeFacto", "en": "POS, DeFacto"},
 {"fichier": "img/portfolio/flyers_leaflets/1-weekend-aroma.jpg", "fr": "Flyers, Weekend Aroma", "en": "Flyers, Weekend Aroma"},
 {"fichier": "img/portfolio/web/1-duo-visuel.jpg", "fr": "Web, Duo visuel", "en": "Web, Duo visuel"}
]
```

- [ ] **Step 2: Tests (remplacent `test_rendu_travaux`, ajoutent sélection et bandeau)**

Dans `outils/test_generer.py`, remplacer `test_rendu_travaux` par :

```python
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
```

Ajouter :

```python
def test_rendu_selection():
    sel = [{"fichier": "img/portfolio/web/1-a.jpg", "fr": "Web, A & B", "en": "Web, A and B"}] * 2
    h = g.rendu_selection(sel, "fr", "../")
    assert h.count('<a class="projet"') == 2
    assert 'href="../img/portfolio/web/1-a.jpg" data-fichier="img/portfolio/web/1-a.jpg"' in h
    assert '<span>01</span><span>Web, A &amp; B</span>' in h and '<span>02</span>' in h
    assert 'alt="Web, A &amp; B"' in h


def test_rendu_bandeau():
    h = g.rendu_bandeau([{"logo": "x", "nom": "L'île"}, {"logo": "y", "nom": "DeFacto"}])
    assert h.count("<span>L&#x27;île</span>") == 2 and h.count("<span>DeFacto</span>") == 2
    assert '<span aria-hidden="true">' in h
```

- [ ] **Step 3: Lancer, constater l'échec**

Run: `python3 -I /home/aziz/workspace/meriembr.com/outils/test_generer.py`
Expected : échec sur `test_rendu_travaux` (classe `grand` encore présente).

- [ ] **Step 4: Implémenter dans `outils/generer.py`**

Dans `rendu_travaux`, remplacer la construction de la ligne par :

```python
        lignes.append(
            f'<li class="vignette" data-cat="{t["categorie"]}"><a href="{e(prefixe + t["fichier"])}"{pdf}>'
            f'<img src="{e(prefixe + t["min"])}" width="{larg}" height="{haut}" alt="{e(alt)}" loading="lazy" decoding="async">'
            f'<span class="vignette-legende">{e(alt)}</span></a></li>')
```

(et supprimer la variable `classe`). Ajouter :

```python
def rendu_selection(selection, langue, prefixe):
    e = lambda s: html.escape(s, quote=True)
    return "\n" + "\n".join(
        f'<a class="projet" href="{e(prefixe + s["fichier"])}" data-fichier="{e(s["fichier"])}">'
        f'<div class="cadre"><img src="{e(prefixe + s["fichier"])}" alt="{e(s[langue])}" loading="lazy" decoding="async"></div>'
        f'<div class="legende"><span>{i:02d}</span><span>{e(s[langue])}</span></div></a>'
        for i, s in enumerate(selection, 1)) + "\n"


def rendu_bandeau(clients):
    noms = "".join(f"<span>{html.escape(c['nom'], quote=True)}</span>" for c in clients)
    return f'{noms}<span aria-hidden="true">{noms}</span>'
```

Dans `main`, charger `data/selection.json` à côté de `clients.json` et ajouter dans la boucle des pages :

```python
        h = injecter(h, "selection", rendu_selection(selection, langue, prefixe))
        h = injecter(h, "bandeau", rendu_bandeau(clients))
```

- [ ] **Step 5: Tests verts**

Run: `python3 -I /home/aziz/workspace/meriembr.com/outils/test_generer.py`
Expected : 10 lignes `ok test_...`.

Ne pas lancer le générateur sur les pages ici : leurs nouveaux marqueurs arrivent en tâche C.

- [ ] **Step 6: Commit**

```bash
git -C /home/aziz/workspace/meriembr.com add data/selection.json outils/generer.py outils/test_generer.py
git -C /home/aziz/workspace/meriembr.com commit -m "feat: generator renders selection and client marquee"
```

---

### Task C: Pages, CSS et JS de la direction sombre

**Files:**
- Rewrite: `index.html`, `en/index.html`, `css/site.css`
- Modify: `js/site.js`

**Interfaces:**
- Consumes : polices et `img/avatar.webp` (tâche A) ; marqueurs `selection`, `bandeau`, `filtres`, `travaux`, `clients` et leur HTML généré (tâche B) ; `lireHash`, `visibles`, `voisin` (`js/galerie.js`, inchangé).
- Produces : site complet. Identifiants conservés : `#travaux`, `#filtres`, `#grille`, `#visionneuse`, `#menu-bouton`, `#menu`. Nouveaux : `#selection`, `.avatar`, `.curseur`.

- [ ] **Step 1: Lire les références**

Lire en entier : la spec (sections 2 à 6), `docs/maquette/index.html`, l'actuel `index.html`, `en/index.html`, `css/site.css`, `js/site.js`.

- [ ] **Step 2: Réécrire `index.html`**

Partir du `<head>` actuel (titre, meta, Open Graph, hreflang, JSON-LD, `class="no-js"` et le script qui la remplace, `js/site.js` en module) en remplaçant le préchargement de police par `fonts/inter-tight.woff2`. Puis le `<body>` dans cet ordre, avec la structure HTML et les classes de la maquette :

1. Lien d'évitement « Aller aux travaux » vers `#toutes`.
2. `header.top` : logo « Meriem <em>Ben Rejeb</em> » (lien `#accueil`) ; `nav` avec `#menu-bouton` (« Menu », `aria-expanded`, `aria-controls="menu"`) et `ul#menu` : Travaux (`#travaux`), Expertise (`#expertise`), Parcours (`#parcours`), Contact (`#contact`), EN (`en/`, `hreflang="en" lang="en"`).
3. `section#accueil.hero` : identique à la maquette (dispo, h1 nom, `.avatar` avec le SVG des yeux, `.hero-bas`), avec l'image `img/avatar.webp` et `aria-hidden="true"` sur `.avatar`.
4. `div.bandeau` (`aria-label="Clients"`) contenant `div.piste` avec `<!-- bandeau:debut --><!-- bandeau:fin -->`.
5. `section#travaux.section` : en-tête « Travaux <em>choisis</em> » + « 179 réalisations, 9 disciplines » ; `div#selection.grille` avec `<!-- selection:debut --><!-- selection:fin -->` ; lien `.tout-voir` « Voir les 179 réalisations » vers `#toutes`.
6. `section#toutes.section` : `h2` « Toutes les <em>réalisations</em> » ; `div#filtres.filtres` (`role="group"`, `aria-label="Filtrer par catégorie"`) avec marqueurs `filtres` ; `ul#grille.grille-carres` avec marqueurs `travaux`.
7. `section#expertise.section` : `.chiffres` et `.services` de la maquette.
8. `section#parcours.section` : `h2` « Mon <em>parcours</em> », les 3 paragraphes de présentation actuels, puis `ol.frise` : 7 `li` contenant `<span class="periode">`, `<strong>` (poste), `<span>` (structure), valeurs de la spec section 3.1.
9. `section.clients.section` : `h2` « Ils m'ont fait <em>confiance</em> », `ul.clients-grille` avec marqueurs `clients`.
10. `section#contact.contact` : identique à la maquette.
11. `footer.pied` : « © Meriem Ben Rejeb ».
12. `dialog#visionneuse` : structure actuelle (fermer, précédent, figure, suivant, compteur, lien PDF), icônes remplacées par du texte ou des caractères (`&#8592;`, `&#8594;`, `&#215;`) puisque `img/dessins.svg` n'existe plus, `aria-label` conservés.
13. `div.curseur` (`aria-hidden="true"`).

- [ ] **Step 3: Réécrire `css/site.css`**

- `@font-face` des 3 fichiers de `fonts/`, variables de la spec section 4, base (reset, `:focus-visible` accent, `.c`, `.sr-only`, `.lien-evitement`, `[hidden] { display: none !important; }`).
- Reprendre tel quel le CSS de la maquette pour : en-tête, dispo, hero, nom, avatar, bandeau, section, entête-section, grille de sélection (`.grille`, `.projet`, `.cadre`, `.legende`, `.tout-voir`), chiffres, services, contact, liens, curseur, `prefers-reduced-motion`.
- Ajouter : menu mobile (sous 768 px, `#menu` caché, ouvert en panneau plein écran sombre par la classe `ouvert`, `#menu-bouton` visible ; au-dessus, bouton caché) ; `.filtres` (pilules fines filet `--ligne`, 44 px, `[aria-pressed="true"]` fond accent texte `--fond`) ; `.grille-carres` (2/3/4 colonnes à 0, 768, 1200 px, écart 12 px) ; `.vignette a` (carré, coins 6 px, fond `--surface`, `overflow: hidden`, position relative), image `object-fit: cover` avec zoom 1,045 au survol, `.vignette-legende` en surimpression bas (dégradé sombre, texte `--texte` 0,85 rem, visible au survol et au focus, toujours visible sous `hover: none`) ; `.frise` (lignes à filet, grille période / poste / structure sur grand écran, empilée sur mobile) ; `.clients-grille` (tuiles fond `#F2EFEA`, coins 6 px, logos `filter: grayscale(1)` puis couleur au survol) ; visionneuse (plein écran, fond `rgb(14 14 16 / .96)`, boutons ronds 48 px à filet `--ligne`, texte `--texte`, compteur `--doux`) ; `.pied` ; `.visible-au-scroll` (fondu) et sa neutralisation `.no-js` et `prefers-reduced-motion`.

- [ ] **Step 4: Adapter `js/site.js`**

Garder filtres, visionneuse, menu mobile, apparitions. Retirer le tracé du chemin (`#chemin-trait` n'existe plus). Ajouter :

1. Sélection : un clic (sans Ctrl, Meta, Shift) sur `.projet` appelle `filtrer("tout")`, trouve la vignette dont le lien `a` a `getAttribute("href")` égal à celui du projet, et ouvre la visionneuse sur elle (même code que le clic dans la grille, factorisé dans une fonction `ouvrir(vignette)` utilisée par les deux).
2. Yeux : code de la maquette (direction unique depuis (647, 379), 16 en x, 5 en y, plein à 400). Désactivé si `prefers-reduced-motion` ou `matchMedia("(hover: none)")`.
3. Curseur : code de la maquette ; texte « Voir » (FR) ou « View » (EN) selon `document.documentElement.lang` ; grossit sur `.projet` et `.vignette a` ; désactivé sous `hover: none`.

- [ ] **Step 5: Page anglaise**

Écrire `en/index.html` en miroir exact de `index.html` : chemins préfixés `../`, `lang="en"`, et les textes anglais existants de l'actuel `en/index.html` (titre, meta, JSON-LD, menu, à propos, frise, contact, visionneuse). Textes nouveaux : « Available for new projects », « Meriem / Ben Rejeb, / <em>graphic designer</em> », colonnes « Visual identity, packaging, publishing / POS, web and game interfaces », « Since 2005 / Agencies, groups and freelance », « Sèvres, Paris / Projects in France and abroad », « Selected <em>work</em> », « 179 projects, 9 disciplines », « See all 179 projects », « All <em>projects</em> », « Filter by category », chiffres « first agency project », « 34 <em>clients</em> / brands, groups, institutions », « published projects », services « Visual identity / Logos, brand guidelines, stationery. », « Packaging / Packaging and labels, from concept to print-ready files. », « Publishing / Books, magazines, catalogues, brochures. », « POS and web / Posters, venue dressing, web visuals, game interfaces. », « My <em>journey</em> », « They <em>trusted</em> me », « A project, a brand, a launch? », lien d'évitement « Skip to work », menu « Work, Expertise, Journey, Contact, FR ».

- [ ] **Step 6: Générer et vérifier**

```bash
python3 -I /home/aziz/workspace/meriembr.com/outils/generer.py /home/aziz/workspace/meriembr.com
python3 -I /home/aziz/workspace/meriembr.com/outils/verifier.py /home/aziz/workspace/meriembr.com/index.html /home/aziz/workspace/meriembr.com/en/index.html /home/aziz/workspace/meriembr.com/css/site.css
grep -c 'class="vignette"' /home/aziz/workspace/meriembr.com/index.html /home/aziz/workspace/meriembr.com/en/index.html
grep -c 'class="projet"' /home/aziz/workspace/meriembr.com/index.html /home/aziz/workspace/meriembr.com/en/index.html
grep -nP '[\x{2013}\x{2014}]' /home/aziz/workspace/meriembr.com/index.html /home/aziz/workspace/meriembr.com/en/index.html /home/aziz/workspace/meriembr.com/css/site.css /home/aziz/workspace/meriembr.com/js/*.js || echo "aucun tiret long"
node --test /home/aziz/workspace/meriembr.com/js/*.test.mjs
```

Expected : `179 travaux, 34 clients` ; `0 lien cassé` ; 179 vignettes et 6 projets par page ; `aucun tiret long` ; tests JS verts. Si le hook bloque le générateur, s'arrêter et le signaler.

- [ ] **Step 7: Contrôle visuel**

Lancer `uv run -q /home/aziz/workspace/meriembr.com/outils/captures.py http://127.0.0.1:8765 <sorties>` (largeurs, filtre, visionneuse au clavier). Puis, avec un script jetable hors dépôt, des captures viewport 1440 et 390 pendant le défilement (accueil, sélection, toutes, expertise, parcours, clients, contact) et des captures zoomées des yeux souris à gauche, près du visage, à droite, en bas. Les ouvrir avec Read, comparer à la maquette, corriger les défauts réels.

Expected : `ok largeur` partout, `28 vignettes visibles`, visionneuse ouverte, `2 / 28`, fermée avec focus rendu ; regard parallèle, iris dans le blanc.

- [ ] **Step 8: Commit**

```bash
git -C /home/aziz/workspace/meriembr.com add index.html en/index.html css/site.css js/site.js data/travaux.json
git -C /home/aziz/workspace/meriembr.com commit -m "feat: dark premium redesign with eye-tracking avatar"
```

---

### Task D: Partage, référencement, vérification finale

**Files:**
- Create: `img/og.png`, `sitemap.xml`, `robots.txt`

- [ ] **Step 1: `sitemap.xml` et `robots.txt`**

`sitemap.xml` : deux `<url>` (`https://meriembr.com/` et `https://meriembr.com/en/`), chacune avec les deux `xhtml:link rel="alternate"` `hreflang` fr et en.

`robots.txt` :

```
User-agent: *
Allow: /
Disallow: /docs/
Disallow: /outils/
Disallow: /data/
Sitemap: https://meriembr.com/sitemap.xml
```

- [ ] **Step 2: `img/og.png`**

Capture Playwright 1200 × 630 du haut de `http://127.0.0.1:8765/`, souris placée sur l'avatar (regard centré), enregistrée dans `/home/aziz/workspace/meriembr.com/img/og.png`. Vérifier `PNG image data, 1200 x 630`.

- [ ] **Step 3: Vérification complète**

Tests Python et JS, vérificateur de liens, `captures.py`. Lighthouse :

```bash
npx --yes lighthouse http://127.0.0.1:8765/ --only-categories=performance,accessibility --chrome-flags="--headless=new" --output=json --output-path=<sorties>/lh-fr.json --quiet
```

Rapporter les scores tels quels ; si l'accessibilité est sous 100, corriger les audits en échec dans le périmètre et remesurer. Si Lighthouse ne peut pas être téléchargé ou est bloqué, le dire.

- [ ] **Step 4: Commit**

```bash
git -C /home/aziz/workspace/meriembr.com add img/og.png sitemap.xml robots.txt
git -C /home/aziz/workspace/meriembr.com commit -m "feat: sharing image, sitemap, robots"
```

(Plus `css/site.css` ou les pages si des corrections Lighthouse ont été faites.)
