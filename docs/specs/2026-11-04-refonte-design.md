# Refonte de meriembr.com : spec de design

Date : 2026-11-04. Branche : `refonte`. État : design validé section par section, spec à relire.

## 1. Objectif et contexte

Remplacer le site actuel (template Bootstrap/jQuery de 2021, migré de PHP vers HTML statique sur `main`) par un nouveau portfolio pour Meriem Ben Rejeb, graphiste.

Contraintes :

- Hébergement GitHub Pages, fichiers statiques uniquement, dépôt public `meriembr-dot/meriembr.com`, domaine `meriembr.com`.
- Pages sert `main` ; la refonte vit sur `refonte` et ne sera publiée qu'après fusion.
- Aucun outil de build, aucune dépendance JS ou CSS externe.
- Contenu repris de `main` : 179 travaux, 4 PDF, 34 logos clients, textes FR et EN.

## 2. Décisions validées

| Sujet | Décision |
|---|---|
| Direction | **Ludique illustré** (riamehta.co.in), travaux en grille (Studio Feixen). Révisée le 2026-11-04 : la direction éditoriale crème/taupe a été jugée trop sage |
| Présentation des travaux | Grille + filtres par catégorie + visionneuse, sans texte par projet |
| Éléments dessinés | SVG simples dessinés par Claude (vagues, étoiles, spirales, nuage, chemin, icônes) ; Meriem fournit seulement son avatar |
| Couleurs | Crème + orange, indigo, teal (section 4) |
| Polices | Caveat (titres manuscrits) + Quicksand (texte) |
| Nom affiché | **Meriem Ben Rejeb** partout (le logo actuel porte « Myriame » : à mettre à jour par elle) |
| Contenu gardé | FR + EN, logos clients, téléphone, WhatsApp, Instagram, e-mail |
| Technique | HTML, CSS, JS sans framework (option 1) |

Références analysées le 2026-11-04 : abiemaxey.com/hello2, builtbyshristi.com, riamehta.co.in, studiofeixen.ch, gatzara.studio. buzzworthystudio.com non capturé (écran de chargement bloquant en navigateur automatisé).

## 3. Structure de page

Une page par langue : `index.html` (FR), `en/index.html` (EN). Navigation par ancres.

1. **Menu flottant** : pilule crème fixe en haut, bordure épaisse indigo. Monogramme M, Travaux, Parcours, Contact, bascule FR/EN. Élément actif souligné par un gribouillis orange SVG. Mobile : monogramme + bouton « Menu » ouvrant un panneau plein écran.
2. **Accueil** : « *hello!* » en Caveat orange, « Je suis Meriem Ben Rejeb, graphiste » en gros, avatar de Meriem détouré à droite entouré d'étoiles et d'une spirale. Vague orange en bas de section. Le haut de la grille des travaux est visible sous la ligne de flottaison.
3. **Travaux** : titre « *Travaux* » avec spirale indigo ; filtres, grille, visionneuse (section 5).
4. **Ce que je fais** : fond teal, 4 cartes avec icône SVG dessinée (Identité visuelle, Packaging, Édition, PLV et Web). Inspiration : « How do I do that? » de Ria.
5. **À propos et parcours** : avatar, texte de présentation actuel raccourci, puis **chemin sinueux SVG** (trait indigo épais) portant les 7 étapes de la frise en bulles (remplace `img/timeline-fr.png` et `img/timeline-en.png`). Mobile : chemin vertical.
6. **Ils m'ont fait confiance** : 34 logos clients dans des pastilles rondes, petites étoiles autour du titre.
7. **Contact** : fond teal, vague orange au-dessus, grand nuage SVG crème contenant : e-mail en grand (`mailto:contact@meriembr.com`), téléphone (`tel:`), WhatsApp (`https://wa.me/33695368115`), Instagram (`@mbr.graphic.designer`), Sèvres.

Retirés : blocs « Content Writing / Web Development / Business Consultancy » (texte Lorem ipsum en commentaire), compteurs, carrousel.

### Frise (contenu repris de `img/timeline-fr.png`)

| Période | Poste | Structure |
|---|---|---|
| 2005-2006 | Stagiaire graphic designer | Agence Zazacrea |
| 2006-2007 | Stagiaire graphic designer | Agence Ballooons |
| 2007-2008 | Graphic designer | Agence Scoop Organisation |
| 2008-2014 | Graphic designer, webmaster | Groupe Materna, M&M Santé |
| 2014-2018 | Graphic designer, webmaster | Groupe Huiles & Sens, Macosmetoperso |
| 2018-2020 | Lead graphic designer | Agence Atheris Communication |
| 2020-aujourd'hui | Graphic designer, webmaster | Freelance |

## 4. Couleurs et typographie

### Couleurs (contrastes calculés, WCAG AA = 4,5:1 pour le texte courant)

| Rôle | Valeur | Contraste sur `#FFF8EE` | Usage |
|---|---|---|---|
| `--fond` | `#FFF8EE` | | Fond général |
| `--texte` | `#2A2440` | 13,98 | Titres, texte |
| `--orange` | `#F26A1B` | 2,91 | Décor uniquement (vagues, « hello! », soulignements), jamais du texte courant |
| `--indigo` | `#4B4FD8` | 5,84 | Liens, bordures, filtre actif, chemin du parcours |
| `--teal` | `#1F6F7A` | crème dessus : 5,51 | Fond des sections Ce que je fais et Contact |
| `--tuile` | `#F3EBDD` (à vérifier au rendu) | | Fond derrière chaque vignette |

### Typographie

- **Caveat** Bold pour les titres et accroches manuscrites.
- **Quicksand** pour le texte courant, 17 px, interligne 1,6.
- Combinaison « Handwritten Charm » proposée par UI UX Pro Max.
- Polices auto-hébergées en woff2 dans `fonts/`, aucun appel à Google Fonts.
- Titre d'accueil `clamp()` d'environ 48 px (mobile) à 120 px (grand écran).

### Éléments SVG dessinés

Vague, étoile 5 branches, spirale, soulignement gribouillé, nuage, chemin sinueux, 4 icônes de métier. Trait volontairement irrégulier, effet « dessiné main ». SVG en ligne, couleurs par `currentColor` ou variables CSS.

### Formes et effets

Cartes à coins arrondis (16 px), bordure fine, badge de catégorie façon autocollant, rotation ±2° au survol.

### Animations

Vague qui ondule, étoiles en rotation lente, chemin du parcours qui se dessine au scroll (`stroke-dashoffset` + `IntersectionObserver`), fondu à l'apparition. Tout est désactivé sous `prefers-reduced-motion: reduce`. Pas de GSAP ni de three.js.

## 5. Travaux : grille, filtres, visionneuse

### Constat sur les images (mesuré le 2026-11-04)

- 179 fichiers, 19,1 Mo ; 178 carrés, 1 paysage ; largeur médiane 500 px, maximum 1000 px.
- 19 GIF animés ; 14 fichiers de plus de 300 Ko.
- 4 PDF, 48 Mo au total.

### Grille

- Carrés : 2 colonnes (mobile), 3 (tablette), 5 (grand écran).
- 1 à 2 images par catégorie en double taille (2 × 2), choisies par le champ `"grand": true` de `data/travaux.json`.
- Cartes arrondies, fond `--tuile` derrière chaque vignette.
- Survol : légende (catégorie, client si connu), rotation ±2°.
- Ordre : catégories dans l'ordre de l'ancien site (`logos`, `visual_identity`, `flyers_leaflets`, `books_magazines`, `packaging_labels`, `various`, `web`, `pos_panels_dressing`, `gaming`), puis numéro en tête de nom de fichier.

### Filtres

- Pilules « Tout (179) » + 9 catégories avec leur nombre, `<button aria-pressed>`.
- Filtre actif dans l'URL (`#travaux/packaging`) : lien partageable, bouton Retour fonctionnel.
- Sans JS : toutes les vignettes visibles, liens directs vers les images.

### Visionneuse

- `<dialog>` natif, fond sombre, image centrée, précédent/suivant limités à la catégorie filtrée, compteur « 3 / 28 ».
- Fermeture : Échap, bouton ✕, clic sur le fond. Clavier : flèches. Mobile : glissement.
- Focus piégé dans la visionneuse, rendu à la vignette d'origine à la fermeture.
- Magazines avec PDF : bouton « Feuilleter le PDF » (nouvel onglet) dans la visionneuse.

### Images

- Miniatures WebP 600 px dans `img/min/`, `loading="lazy"`, `width` et `height` déclarés.
- Visionneuse : fichier original.
- GIF animés convertis en WebP animé pour les miniatures.
- `alt` = « catégorie, client », client déduit du nom de fichier quand il existe (`28-klinika` → Klinika), modifiable dans `travaux.json`.
- Limite connue : originaux à 500 px, flous en grand écran. Remplaçables par des fichiers HD sans changer le code.

### Format de `data/travaux.json`

```json
[
  {"fichier": "img/portfolio/logos/9-galya.jpg", "min": "img/min/logos/9-galya.webp",
   "categorie": "logos", "client": "Galya", "grand": false, "pdf": null}
]
```

Généré par `outils/miniatures.py`, puis modifiable à la main. Le script ne réécrit pas les champs `client` et `grand` déjà présents.

## 6. Mobile, accessibilité, référencement

- Mobile d'abord, paliers 768, 1024, 1440 px, aucun défilement horizontal.
- Cibles tactiles 44 × 44 px minimum.
- Focus clavier visible partout, lien d'évitement « Aller aux travaux », `lang="fr"` / `lang="en"`.
- `<title>` « Meriem Ben Rejeb, graphic designer », meta description, Open Graph avec image 1200 × 630, `hreflang` FR/EN, `sitemap.xml`, `robots.txt`, données structurées `Person` (schema.org) avec le lien Instagram.

## 7. Fichiers

```
index.html
en/index.html
css/site.css
js/site.js
data/travaux.json
img/portfolio/...      originaux repris de main
img/min/...            miniatures WebP générées
img/testimonial/...    logos clients repris de main
pdf/...                repris de main
fonts/                 Caveat, Quicksand (woff2)
outils/miniatures.py   génère img/min/ et data/travaux.json
CNAME, .nojekyll
```

Supprimés : `css/` et `js/` de l'ancien template (Bootstrap, jQuery, 15 plugins), `fonts/` FontAwesome et Linearicons, `img/timeline*.png`, images de fond inutilisées. Les icônes (Instagram, WhatsApp, flèches) sont des SVG en ligne.

## 8. Vérification avant livraison

- Captures automatiques (Playwright) en 375, 768, 1440 px, FR et EN.
- Contrôle des liens locaux : 0 lien cassé.
- Visionneuse testée au clavier (ouverture, flèches, Échap, retour du focus).
- Lighthouse performance et accessibilité sur la version locale, chiffres rapportés tels quels.
- Relecture locale par `python3 -m http.server` avant toute fusion dans `main`.

## 9. À fournir ou valider par Meriem

1. Avatar détouré (PNG transparent ou SVG) pour l'accueil et « À propos » (emplacement provisoire marqué en attendant).
2. Frise : situation après 2020 (« Freelance, aujourd'hui » est-il toujours vrai ?).
3. Numéro au format international pour WhatsApp (`+33 6 95 36 81 15` supposé).
4. Noms des clients par travail (`travaux.json`).
5. Fichiers HD des travaux, si disponibles.
6. Logo mis à jour au nom de Meriem.

## 10. Hors périmètre

Pages projet détaillées, blog, formulaire de contact, statistiques de visite, mode sombre.
