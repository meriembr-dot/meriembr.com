# Refonte de meriembr.com : spec de design

Date : 2026-11-04. Branche : `refonte`. État : direction validée sur maquette le 2026-11-04 (version 3).

Historique des directions :

1. Éditorial crème et taupe : jugée trop sage (avant code).
2. Ludique illustré (vagues, étoiles, Caveat) : codée puis rejetée, « site de coloriage, de crèche, pas digne d'une graphiste pro ».
3. **Sombre premium + éditorial suisse** : validée sur la maquette `docs/maquette/index.html`, avec avatar dont les yeux suivent la souris. C'est la référence visuelle de cette spec.

## 1. Objectif et contexte

Remplacer l'ancien site (template Bootstrap/jQuery de 2021, encore en ligne sur `main`) par un portfolio professionnel pour Meriem Ben Rejeb, graphiste depuis 2005.

Contraintes :

- GitHub Pages, fichiers statiques, dépôt public `meriembr-dot/meriembr.com`, domaine `meriembr.com`. Pages sert `main` ; la refonte vit sur `refonte`.
- Aucun outil de build, aucune dépendance JS ou CSS externe, aucun appel à Google Fonts.
- Contenu repris de `main` : 179 travaux, 4 PDF, 34 logos clients, textes FR et EN.

## 2. Décisions validées

| Sujet | Décision |
|---|---|
| Direction | Sombre premium, touches d'éditorial suisse (grille décalée, filets fins, numérotation) |
| Référence visuelle | `docs/maquette/index.html` (maquette validée, avec `docs/maquette/avatar.webp`) |
| Avatar | Illustration de Meriem générée par Nano Banana à partir de sa photo, version sans pupilles ; iris SVG qui suivent la souris |
| Travaux | Sélection de 6 projets en grille décalée, puis grille complète filtrable avec visionneuse |
| Nom affiché | **Meriem Ben Rejeb** |
| Contenu gardé | FR + EN, logos clients, téléphone, WhatsApp, Instagram, e-mail |
| Technique | HTML, CSS, JS sans framework ; générateur Python existant (`outils/generer.py`) |

## 3. Structure de page

Une page par langue : `index.html` (FR), `en/index.html` (EN).

1. **En-tête fixe** : fond `rgb(14 14 16 / .72)` flouté (`backdrop-filter: blur(14px)`), filet bas. Gauche : « Meriem *Ben Rejeb* » (demandé par l'utilisateur, remplace « MBR studio » de la maquette). Droite : Travaux, Expertise, Parcours, Contact, EN/FR. Mobile : bouton « Menu » ouvrant un panneau plein écran.
2. **Accueil** (hauteur d'écran) : pastille accent + « Disponible pour de nouveaux projets » ; nom en très gros « Meriem / Ben Rejeb, / *graphiste* » (le dernier mot en serif italique accent) ; à droite l'avatar portrait 4:5, 460 px de large max (colonne de 460 px dès 960 px), coins 10 px, yeux qui suivent la souris ; en bas, 3 colonnes : « Identité visuelle, packaging, édition / PLV, web et interfaces de jeu », « Depuis 2005 / Agences, groupes et freelance », « Sèvres, Paris / Projets en France et à l'étranger ».
3. **Bandeau clients** : noms des clients en serif italique gris qui défilent, séparés par un astérisque accent.
4. **Travaux choisis** : titre « Travaux *choisis* » + « 179 réalisations, 9 disciplines » ; 6 projets en grille décalée (12 colonnes, spans 7/5, 5/7, 6/6 avec décalages verticaux), numéro « 01 » et légende sous chaque image ; lien « Voir les 179 réalisations ».
5. **Toutes les réalisations** : filtres en pilules fines (filet, actif = fond accent), grille carrée 2/3/4 colonnes, visionneuse.
6. **Expertise** : 3 chiffres (« 2005 / premier projet en agence », « 34 *clients* / marques, groupes, institutions », « 179 / réalisations publiées ») ; liste numérotée des 4 services (Identité visuelle, Packaging, Édition, PLV et web).
7. **Parcours** : texte de présentation raccourci ; frise en liste fine à filets (période, poste, structure), 7 lignes (section 3.1).
8. **Ils m'ont fait confiance** : 34 logos en tuiles claires (fond `#F2EFEA`), désaturés, couleur au survol.
9. **Contact** : « Un projet, une marque, un lancement ? », e-mail en très grand (« contact@*meriembr*.com »), puis téléphone, WhatsApp, Instagram, Sèvres.

### 3.1 Frise

| Période | Poste | Structure |
|---|---|---|
| 2005-2006 | Stagiaire graphiste | Agence Zazacrea |
| 2006-2007 | Stagiaire graphiste | Agence Ballooons |
| 2007-2008 | Graphiste | Agence Scoop Organisation |
| 2008-2014 | Graphiste, webmaster | Groupe Materna, M&M Santé |
| 2014-2018 | Graphiste, webmaster | Groupe Huiles & Sens, Macosmetoperso |
| 2018-2020 | Lead graphiste | Agence Atheris Communication |
| 2020-aujourd'hui | Graphiste, webmaster | Freelance |

## 4. Couleurs, typographie, effets

### Couleurs (contrastes calculés le 2026-11-04)

| Variable | Valeur | Contraste sur `--fond` | Usage |
|---|---|---|---|
| `--fond` | `#0E0E10` | | Fond général |
| `--surface` | `#17171A` | | Fond des images, cartes |
| `--ligne` | `#2A2A2E` | | Filets |
| `--texte` | `#F2EFEA` | 16,81 | Texte principal |
| `--doux` | `#9A968F` | 6,55 | Texte secondaire |
| `--accent` | `#E4FF5A` | 17,22 | Mot en italique, pastille, curseur, focus, filtre actif (texte `#0E0E10` dessus : 17,22) |

### Typographie

- **Inter Tight** (variable, 100 à 900) : titres et texte. Titres en 500-600, interlettrage négatif (-0,03 à -0,045 em).
- **Instrument Serif** (normal et italique) : un mot accent par titre, en italique.
- Versions fontsource 5.3.0 (`@fontsource-variable/inter-tight`, `@fontsource/instrument-serif`), woff2 auto-hébergés dans `fonts/`, licence OFL jointe.
- Texte courant 17 px, interligne 1,55. Nom d'accueil `clamp(3.5rem, 11vw, 11rem)`, interligne 0,86.

### Avatar et yeux

- Image de base : version sans pupilles, 1254 × 1254, convertie en WebP 900 px (`img/avatar.webp`).
- SVG `viewBox="150 40 954 1192"` (cadrage 4:5) contenant l'image, puis pour chaque œil un groupe d'iris (cercle r 16 en dégradé `#9A9470` / `#77714F` / `#3E3A2A`, pupille r 7 `#141210`, reflet r 3 blanc) découpé par l'ellipse du blanc de l'œil : gauche `cx 546 cy 380 rx 40 ry 13`, droit `cx 749 cy 378 rx 41 ry 13`.
- Une seule direction, calculée depuis le milieu des yeux (647, 379) vers le pointeur, appliquée aux deux iris (regard parallèle, jamais convergent). Déplacement max 16 unités en x, 5 en y, proportionnel à la distance (plein à 400 unités).
- Coordonnées propres à cette image : à remesurer si l'avatar change.
- `prefers-reduced-motion` ou écran tactile : iris fixes au centre.
- Avatar décoratif (`aria-hidden`), le nom est porté par le titre.

### Curseur

Point accent de 10 px qui suit le pointeur ; sur un projet, il grandit à 84 px et affiche « Voir » (« View » en EN). Masqué sur écran tactile (`hover: none`) et le curseur système reste visible.

### Animations

Bandeau clients défilant (60 s), zoom léger des images au survol, apparition en fondu au scroll. Tout est coupé sous `prefers-reduced-motion: reduce`.

## 5. Travaux : sélection, grille, filtres, visionneuse

### Constat sur les images (mesuré le 2026-11-04)

179 fichiers, 19,1 Mo ; 178 carrés ; largeur médiane 500 px, max 1000 px ; 19 GIF animés ; 4 PDF (48 Mo). Miniatures WebP déjà générées : `img/min/` (5,9 Mo).

### Sélection

6 projets choisis dans `data/selection.json` (liste de chemins `fichier` de `data/travaux.json`, avec légende FR et EN). Valeurs initiales (celles de la maquette) : `books_magazines/5-jac2015.jpg` (Édition, JAC 2015), `visual_identity/1-Zahrat-Zanbaq.jpg` (Identité, Zahrat Zanbaq), `packaging_labels/1-Hangtags.gif` (Packaging, étiquettes), `pos_panels_dressing/1-defacto.jpg` (PLV, DeFacto), `flyers_leaflets/1-weekend-aroma.jpg` (Flyers, Weekend Aroma), `web/1-duo-visuel.jpg` (Web, Duo visuel). Images recadrées en 4:3 (`object-fit: cover`), source = original (pas la miniature carrée). Clic = visionneuse.

### Grille complète

- Carrés, 2 colonnes (mobile), 3 (tablette), 4 (grand écran), écart 12 px, coins 6 px, fond `--surface`.
- Le champ `grand` de `travaux.json` n'est plus utilisé (toutes les vignettes à taille égale).
- Ordre : catégories dans l'ordre global, puis numéro en tête de nom.
- Survol : zoom 1,045, légende (catégorie, client) en surimpression bas.

### Filtres, visionneuse

Inchangés par rapport au code existant (`js/galerie.js`, `js/site.js`) : pilules `aria-pressed`, filtre dans l'URL `#travaux/<cat>`, `<dialog>` avec précédent/suivant limités au filtre, compteur, Échap, glissement, retour du focus, bouton PDF pour les 4 magazines. Seul l'habillage change (fond `--fond` à 96 %, boutons à filet `--ligne`, focus accent).

## 6. Mobile, accessibilité, référencement

- Mobile d'abord, paliers 768, 1024, 1440 px, aucun défilement horizontal.
- Cibles tactiles 44 × 44 px minimum ; focus visible accent ; lien d'évitement ; `lang` ; contrastes section 4.
- `<title>` « Meriem Ben Rejeb, graphiste » / « graphic designer », meta description, Open Graph avec `img/og.png` 1200 × 630 (capture du haut de l'accueil), `hreflang`, `sitemap.xml`, `robots.txt` (exclut `/docs/`, `/outils/`, `/data/`), JSON-LD `Person`.

## 7. Fichiers

```
index.html, en/index.html
css/site.css                 réécrit pour la direction 3
js/galerie.js (+ test)       inchangé
js/site.js                   + yeux, curseur ; filtres et visionneuse conservés
js/package.json              inchangé
data/travaux.json            inchangé
data/selection.json          nouveau
data/clients.json            inchangé
img/avatar.webp              nouveau
img/min/                     inchangé
fonts/                       Inter Tight, Instrument Serif (remplacent Caveat, Quicksand)
outils/generer.py            + rendu de la sélection et du bandeau clients
outils/verifier.py, outils/captures.py   conservés
docs/maquette/               maquette validée (référence)
```

Supprimés : `img/dessins.svg`, `img/avatar-provisoire.svg`, `fonts/caveat.woff2`, `fonts/quicksand.woff2`.

## 8. Vérification avant livraison

- Tests Python et JS existants verts.
- Captures en 375, 768, 1440 px, FR et EN, en viewport pendant le défilement (les captures pleine page masquent le contenu révélé au scroll).
- Yeux : captures zoomées souris à gauche, près du visage, à droite, en bas ; regard parallèle, iris jamais hors du blanc.
- Visionneuse au clavier ; 0 lien cassé ; Lighthouse performance et accessibilité mesurés et rapportés tels quels.
- Relecture locale avant toute fusion dans `main`.

## 9. À fournir ou valider par Meriem

1. Accord pour publier l'avatar généré à partir de sa photo.
2. Frise : situation après 2020.
3. Numéro au format international pour WhatsApp (`+33 6 95 36 81 15` supposé).
4. Noms des clients par travail (`travaux.json`, 8 vides) et choix des 6 projets de la sélection.
5. Fichiers HD des travaux, si disponibles.
6. « Disponible pour de nouveaux projets » : à confirmer.

## 10. Hors périmètre

Pages projet détaillées, blog, formulaire de contact, statistiques de visite, mode clair.
