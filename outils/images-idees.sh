#!/bin/sh
# Convertit en WebP les images envoyées par Meriem le 8 novembre 2026.
# Lancer : sh outils/images-idees.sh <dossier des pièces jointes> [racine du dépôt]
# Le dossier doit contenir « portfolio hero BG.jpg » et « portfolio M_compressed.pdf ».
set -eu
src=$1
racine=${2:-.}
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
mkdir -p "$racine/img/hero" "$racine/img/domaines" "$racine/img/confiance"

# Hero : grand format, format moyen, et recadrage portrait pour mobile (Meriem est à droite).
h="$src/portfolio hero BG.jpg"
convert "$h" -strip -quality 72 "$racine/img/hero/hero-1876.webp"
convert "$h" -strip -resize 1200x -quality 72 "$racine/img/hero/hero-1200.webp"
convert "$h" -strip -crop 640x750+1236+0 +repage -quality 74 "$racine/img/hero/hero-mobile.webp"

# Page 1 du PDF : 4 images de domaines puis 4 projets (ordre de pdfimages -list).
pdfimages -j -f 1 -l 1 "$src/portfolio M_compressed.pdf" "$tmp/p"
d() { convert "$tmp/p-00$1.jpg" -strip -quality 78 "$racine/img/domaines/$2.webp"; }
d 0 identite
d 4 packaging
d 2 edition
d 3 digital
c() {
  convert "$tmp/p-00$1.jpg" -strip -resize '1600x>' -quality 78 "$racine/img/confiance/$2.webp"
  convert "$tmp/p-00$1.jpg" -strip -resize '1040x>' -quality 74 "$racine/img/confiance/$2-1040.webp"
}
c 1 huiles-et-sens
c 5 algovital
c 6 kais-et-lorine
c 7 graines-et-saveurs
identify -format '%f %wx%h %b\n' "$racine"/img/hero/*.webp "$racine"/img/domaines/*.webp "$racine"/img/confiance/*.webp
