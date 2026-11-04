export function lireHash(hash) {
  const m = /^#travaux\/([a-z_]+)$/.exec(hash);
  return m ? m[1] : "tout";
}

export function visibles(items, cat) {
  return items.flatMap((it, i) => (cat === "tout" || it.cat === cat ? [i] : []));
}

export function voisin(position, total, pas) {
  return (position + pas + total) % total;
}
