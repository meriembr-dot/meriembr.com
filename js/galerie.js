// Lien profond d'un domaine : #expertise/identite, ou #galerie-identite (lien sans JS).
export function lireHash(hash, domaines) {
  const m = /^#(?:expertise\/|galerie-)([a-z]+)$/.exec(hash);
  return m && domaines.includes(m[1]) ? m[1] : null;
}

export function visibles(items, domaine) {
  return items.flatMap((it, i) => (it.domaine === domaine ? [i] : []));
}

export function voisin(position, total, pas) {
  return (position + pas + total) % total;
}
