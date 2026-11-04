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
| Direction | Travaux en vedette (Studio Feixen, Gatzara) + touche personnelle (abiemaxey, Shristi, Ria) |
| Présentation des travaux | Grille + filtres par catégorie + visionneuse, sans texte par projet |
| Touche personnelle | Dessin ou avatar fourni par Meriem |
| Couleurs | Issues du logo ; les travaux apportent la couleur |
| Nom affiché | **Meriem Ben Rejeb** partout (le logo actuel porte « Myriame » : à mettre à jour par elle) |
| Contenu gardé | FR + EN, logos clients, téléphone, WhatsApp, Instagram, e-mail |
| Technique | HTML, CSS, JS sans framework (option 1) |

Références analysées le 2026-11-04 : abiemaxey.com/hello2, builtbyshristi.com, riamehta.co.in, studiofeixen.ch, gatzara.studio. buzzworthystudio.com non capturé (écran de chargement bloquant en navigateur automatisé).

## 3. Structure de page

Une page par langue : `index.html` (FR), `en/index.html` (EN). Navigation par ancres.

1. **Menu flottant** : pilule fixe en haut. Monogramme M, Travaux, Parcours, Contact, bascule FR/EN. Mobile : monogramme + bouton « Menu » ouvrant un panneau plein écran.
2. **Accueil** : titre très gros « Meriem *Ben Rejeb* », sous-titre « Graphic designer », une phrase d'accroche. Le haut de la grille des travaux est visible sous la ligne de flottaison.
3. **Travaux** : filtres, grille, visionneuse (section 5).
4. **Bandeau défilant** : logo, identité visuelle, packaging, édition, PLV, web, gaming.
5. **À propos et parcours** : dessin de Meriem, texte de présentation actuel raccourci, frise 2005 à aujourd'hui en HTML (remplace `img/timeline-fr.png` et `img/timeline-en.png`).
6. **Ils m'ont fait confiance** : 34 logos clients en grille, niveaux de gris, couleur au survol.
7. **Contact** : section sombre. E-mail en grand (`mailto:contact@meriembr.com`), téléphone (`tel:`), WhatsApp (`https://wa.me/33695368115`), Instagram (`@mbr.graphic.designer`), Sèvres.

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

| Rôle | Valeur | Contraste sur `#F6F2EC` | Usage |
|---|---|---|---|
| `--fond` | `#F6F2EC` | | Fond général |
| `--texte` | `#1F1B18` | 15,33 | Titres, texte |
| `--taupe` | `#8F7C70` | 3,56 | Décor uniquement (filets, pictos, grandes typos décoratives), jamais du texte courant |
| `--taupe-fonce` | `#6E5D52` | 5,62 | Liens, sous-titres, filtre actif |
| `--bleu` | `#5E6B85` | 4,81 | Touches de couleur, texte possible |
| `--bleu-aplat` | `#DCE3EF` | texte `#1F1B18` : 13,25 | Fond de la section Parcours |
| `--tuile` | `#ECE7E0` | | Fond derrière chaque vignette |
| Section Contact | fond `#1F1B18`, texte `#F6F2EC` | 15,33 | |

Le monogramme M et sa tache d'aquarelle (extraits de `img/mbr-logo.png`) servent de motif derrière le titre d'accueil et d'icône de site.

### Typographie

- **Archivo** (titres et texte), axes graisse et largeur, graisse Black pour le titre d'accueil.
- **Playfair Display Italique**, un mot accent par titre (« Meriem *Ben Rejeb* », « Ils m'ont fait *confiance* »).
- Polices auto-hébergées en woff2 dans `fonts/`, aucun appel à Google Fonts.
- Texte courant 17 px, interligne 1,6. Titre d'accueil `clamp()` d'environ 56 px (mobile) à 160 px (grand écran).

### Animations

Fondu à l'apparition au scroll (`IntersectionObserver`), bandeau défilant en CSS, léger agrandissement des vignettes au survol. Tout est désactivé sous `prefers-reduced-motion: reduce`. Pas de GSAP ni de three.js.

## 5. Travaux : grille, filtres, visionneuse

### Constat sur les images (mesuré le 2026-11-04)

- 179 fichiers, 19,1 Mo ; 178 carrés, 1 paysage ; largeur médiane 500 px, maximum 1000 px.
- 19 GIF animés ; 14 fichiers de plus de 300 Ko.
- 4 PDF, 48 Mo au total.

### Grille

- Carrés : 2 colonnes (mobile), 3 (tablette), 5 (grand écran).
- 1 à 2 images par catégorie en double taille (2 × 2), choisies par le champ `"grand": true` de `data/travaux.json`.
- Fond `--tuile` derrière chaque vignette.
- Survol : légende (catégorie, client si connu), léger agrandissement.
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
fonts/                 Archivo, Playfair Display (woff2)
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

1. Dessin ou avatar pour « À propos » (emplacement provisoire marqué en attendant).
2. Frise : situation après 2020 (« Freelance, aujourd'hui » est-il toujours vrai ?).
3. Numéro au format international pour WhatsApp (`+33 6 95 36 81 15` supposé).
4. Noms des clients par travail (`travaux.json`).
5. Fichiers HD des travaux, si disponibles.
6. Logo mis à jour au nom de Meriem.

## 10. Hors périmètre

Pages projet détaillées, blog, formulaire de contact, statistiques de visite, mode sombre.
