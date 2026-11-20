#!/bin/sh
# Convertit en WebP les visuels du projet Kais & Lorine (pièces jointes de Meriem, 20 novembre 2026).
# Lancer : sh outils/images-kais-lorine.sh <dossier des pièces jointes> <composition K&L.jpg> [racine du dépôt]
# Le menu cocktail et la bougie n'existent que dans la composition : ils y sont découpés (moindre résolution).
# Les logos SVG sont copiés après passage dans svgo (npx -y svgo@3.3.2), le rendu restant identique.
set -eu
src=$1
compo=$2
racine=${3:-.}
srgb=${SRGB_ICC:-/usr/share/color/icc/colord/sRGB.icc}
dst="$racine/img/projets/kais-et-lorine"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
mkdir -p "$dst"

# Une image en plusieurs largeurs : 640, 1200 et sa propre largeur (bornée à 2000), sans agrandir.
tailles() {
  entree=$1 nom=$2
  larg=$(identify -format '%w' "$entree")
  for t in 640 1200 2000; do
    [ "$t" -lt "$larg" ] && convert "$entree" -strip -resize "${t}x" -quality 78 "$dst/$nom-$t.webp"
  done
  [ "$larg" -le 2000 ] && convert "$entree" -strip -quality 80 "$dst/$nom-$larg.webp"
  return 0
}

# Image d'ouverture
tailles "$src/Ouverture du projet.jpg" ouverture

# Save The Date : CMYK (profil SWOP intégré) converti en sRGB par profil ICC, pas par simple changement d'espace.
convert "$src/SaveTheDate.jpg" -profile "$srgb" -colorspace sRGB "$tmp/save-the-date.png"
tailles "$tmp/save-the-date.png" save-the-date

tailles "$src/Faire-part de mariage.png" faire-part
tailles "$src/Panneau de bienvenue.png" panneau-bienvenue
tailles "$src/Plan de table de mariage.png" plan-de-table
tailles "$src/Cartons nom.jpg" carton-nom
tailles "$src/Livre d'or - Urne.png" livre-or-urne
tailles "$src/Nom de table.jpg" nom-de-table

# Découpes dans la composition 1944 x 5513 : photo seule, sans coins arrondis ni marge blanche.
convert "$compo" -crop 677x724+12+4001 +repage "$tmp/menu-cocktail.png"
convert "$compo" -crop 928x695+12+4789 +repage "$tmp/bougie.png"
tailles "$tmp/menu-cocktail.png" menu-cocktail
tailles "$tmp/bougie.png" bougie

# Logos. Monogramme : svgo (13 Ko vers 10 Ko, rendu identique pixel pour pixel).
# Logo « Save the date » : svgo ne le ramène qu'à 653 Ko (4443 tracés), d'où un rendu WebP de 1000 px (16 Ko).
npx -y svgo@3.3.2 -q "$src/logo-KL.svg" -o "$dst/monogramme.svg"
inkscape "$src/save-the-dtae-logo.svg" --export-type=png --export-filename="$tmp/logo-save-the-date.png" -w 1000 2>/dev/null
convert "$tmp/logo-save-the-date.png" -strip -quality 82 "$dst/logo-save-the-date.webp"
convert "$tmp/logo-save-the-date.png" -strip -resize 640x -quality 82 "$dst/logo-save-the-date-640.webp"

identify -format '%f %wx%h %b\n' "$dst"/*.webp
ls -l "$dst"/*.svg
