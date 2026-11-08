import { lireHash, visibles, voisin } from "./galerie.js";

const calme = matchMedia("(prefers-reduced-motion: reduce)").matches;
const modifie = (e) => e.ctrlKey || e.metaKey || e.shiftKey;

/* Domaines d'expertise : un clic sur une carte ouvre sa galerie sous les cartes (lien profond #expertise/<domaine>) */
const galeries = [...document.querySelectorAll(".galerie")];
const DOMAINES = galeries.map((g) => g.dataset.domaine);
const liensDomaine = [...document.querySelectorAll(".domaine-lien")];
const vignettes = [...document.querySelectorAll(".galerie .vignette")];
const items = vignettes.map((v) => ({ domaine: v.closest(".galerie").dataset.domaine }));
let courant = null;

/* Voir plus : la galerie montre PAS vignettes de plus à chaque clic, remis à zéro à chaque domaine */
const PAS = 16;
let montres = PAS;
const plus = document.getElementById("plus");
const plusReste = plus.querySelector(".plus-reste");

function afficherGrille() {
  galeries.forEach((g) => g.classList.toggle("ouverte", g.dataset.domaine === courant));
  const liste = visibles(items, courant);
  const ok = new Set(liste.slice(0, montres));
  vignettes.forEach((v, i) => { v.hidden = !ok.has(i); });
  const reste = liste.length - montres;
  plus.hidden = reste <= 0;
  plusReste.textContent = `(${reste})`;
}

function choisir(domaine, defiler) {
  courant = domaine;
  montres = PAS;
  afficherGrille();
  liensDomaine.forEach((l) => l.setAttribute("aria-expanded", String(l.dataset.domaine === courant)));
  if (courant && defiler) document.getElementById(`galerie-${courant}`).scrollIntoView({ behavior: calme ? "auto" : "smooth" });
}

liensDomaine.forEach((l) => {
  l.setAttribute("aria-controls", `galerie-${l.dataset.domaine}`);
  l.addEventListener("click", (e) => {
    if (modifie(e)) return;
    e.preventDefault();
    const domaine = l.dataset.domaine === courant ? null : l.dataset.domaine;
    history.pushState(null, "", domaine ? `#expertise/${domaine}` : "#expertise");
    choisir(domaine, true);
  });
});
plus.addEventListener("click", () => {
  const premier = visibles(items, courant)[montres];
  montres += PAS;
  afficherGrille();
  vignettes[premier]?.querySelector("a").focus({ preventScroll: true });
});
addEventListener("popstate", () => choisir(lireHash(location.hash, DOMAINES), true));
choisir(lireHash(location.hash, DOMAINES), true);

/* Visionneuse : parcourt la galerie ouverte, ou les projets « Ils m'ont fait confiance » */
const vis = document.getElementById("visionneuse");
const visImg = vis.querySelector(".vis-image");
const visLegende = vis.querySelector(".vis-legende");
const visCompteur = vis.querySelector(".vis-compteur");
const visPdf = vis.querySelector(".vis-pdf");
let liste = [];
let pos = 0;
let origine = null;

function afficher() {
  const lien = liste[pos];
  const alt = lien.querySelector("img").alt;
  visImg.src = lien.href;
  visImg.alt = alt;
  visLegende.textContent = alt;
  visCompteur.textContent = `${pos + 1} / ${liste.length}`;
  visPdf.hidden = !lien.dataset.pdf;
  if (lien.dataset.pdf) visPdf.href = lien.dataset.pdf;
}

function ouvrir(liens, lien) {
  liste = liens;
  pos = liens.indexOf(lien);
  origine = lien;
  afficher();
  vis.showModal();
}

document.getElementById("galeries").addEventListener("click", (e) => {
  const lien = e.target.closest(".vignette a");
  if (!lien || modifie(e)) return;
  e.preventDefault();
  ouvrir(visibles(items, courant).map((i) => vignettes[i].querySelector("a")), lien);
});
const liensConfiance = [...document.querySelectorAll(".projet-confiance")];
document.getElementById("confiance").addEventListener("click", (e) => {
  const lien = e.target.closest(".projet-confiance");
  if (!lien || modifie(e)) return;
  e.preventDefault();
  ouvrir(liensConfiance, lien);
});
const pas = (n) => { pos = voisin(pos, liste.length, n); afficher(); };
vis.querySelector(".vis-prec").addEventListener("click", () => pas(-1));
vis.querySelector(".vis-suiv").addEventListener("click", () => pas(1));
vis.querySelector(".vis-fermer").addEventListener("click", () => vis.close());
vis.addEventListener("click", (e) => { if (e.target === vis) vis.close(); });
vis.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") pas(-1);
  if (e.key === "ArrowRight") pas(1);
});
vis.addEventListener("close", () => origine?.focus());
let x0 = null;
vis.addEventListener("touchstart", (e) => { x0 = e.touches.length === 1 ? e.touches[0].clientX : null; }, { passive: true });
vis.addEventListener("touchend", (e) => {
  if (x0 === null) return;
  const dx = e.changedTouches[0].clientX - x0;
  if (Math.abs(dx) > 50) pas(dx < 0 ? 1 : -1);
  x0 = null;
});

/* Menu mobile */
const menuBouton = document.getElementById("menu-bouton");
const menu = document.getElementById("menu");
menuBouton.addEventListener("click", () => {
  const ouvert = menu.classList.toggle("ouvert");
  menuBouton.setAttribute("aria-expanded", String(ouvert));
});
menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) { menu.classList.remove("ouvert"); menuBouton.setAttribute("aria-expanded", "false"); }
});

/* Apparitions */
const obs = new IntersectionObserver((entrees) => entrees.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("vu"); obs.unobserve(e.target); }
}), { threshold: 0.15 });
document.querySelectorAll(".visible-au-scroll").forEach((el) => obs.observe(el));

/* Chronologie : un clic sur une date ouvre sa fiche (une seule à la fois), Échap ou clic ailleurs la ferme */
const dates = [...document.querySelectorAll(".chrono .date")];
function fermerFiches(saufBouton) {
  for (const b of dates) {
    if (b === saufBouton) continue;
    b.setAttribute("aria-expanded", "false");
    document.getElementById(b.getAttribute("aria-controls")).hidden = true;
  }
}
for (const b of dates) {
  const fiche = document.getElementById(b.getAttribute("aria-controls"));
  b.addEventListener("click", () => {
    const ouvrir = b.getAttribute("aria-expanded") !== "true";
    fermerFiches(b);
    b.setAttribute("aria-expanded", String(ouvrir));
    fiche.hidden = !ouvrir;
  });
  fiche.querySelector(".carte-fermer").addEventListener("click", () => { fermerFiches(); b.focus(); });
}
addEventListener("keydown", (e) => {
  const ouvert = dates.find((b) => b.getAttribute("aria-expanded") === "true");
  if (e.key === "Escape" && ouvert && !vis.open) { fermerFiches(); ouvert.focus(); }
});
addEventListener("click", (e) => { if (!e.target.closest(".etape")) fermerFiches(); });

/* Clients : deux rangées défilantes construites depuis la liste (qui reste lue par les lecteurs d'écran) */
const listeClients = document.querySelector(".clients-grille");
if (!calme) {
  const logos = [...listeClients.querySelectorAll("img")];
  const defile = document.createElement("div");
  defile.className = "clients-defile";
  defile.setAttribute("aria-hidden", "true");
  const moitie = Math.ceil(logos.length / 2);
  for (const groupe of [logos.slice(0, moitie), logos.slice(moitie)]) {
    const rang = document.createElement("div");
    rang.className = "rang";
    // Deux passages identiques : la translation de -50 % boucle sans à-coup.
    for (const img of [...groupe, ...groupe]) {
      const carte = document.createElement("div");
      carte.className = "logo-client";
      const cadre = document.createElement("span");
      const copie = document.createElement("img");
      copie.src = img.getAttribute("src");
      copie.alt = "";
      copie.loading = "lazy";
      cadre.append(copie);
      const nom = document.createElement("em");
      nom.textContent = img.alt;
      carte.append(cadre, nom);
      rang.append(carte);
    }
    defile.append(rang);
  }
  listeClients.classList.add("sr-only");
  listeClients.after(defile);
}

/* Curseur : souris seulement, coupé si mouvement réduit */
if (!calme && !matchMedia("(hover: none)").matches) {
  const curseur = document.querySelector(".curseur");
  const voir = document.documentElement.lang === "en" ? "View" : "Voir";
  addEventListener("pointermove", (e) => {
    curseur.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    curseur.classList.add("actif");
  });
  document.documentElement.addEventListener("pointerleave", () => curseur.classList.remove("actif"));
  addEventListener("pointerover", (e) => {
    const grand = !!e.target.closest(".projet-confiance, .vignette a");
    curseur.classList.toggle("grand", grand);
    curseur.textContent = grand ? voir : "";
  });
}
