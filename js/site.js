import { lireHash, visibles, voisin } from "./galerie.js";

const grille = document.getElementById("grille");
const vignettes = [...grille.querySelectorAll(".vignette")];
const items = vignettes.map((v) => ({ cat: v.dataset.cat }));
const boutons = [...document.querySelectorAll("#filtres [data-cat]")];
let courant = "tout";

function filtrer(cat) {
  courant = boutons.some((b) => b.dataset.cat === cat) ? cat : "tout";
  const ok = new Set(visibles(items, courant));
  vignettes.forEach((v, i) => { v.hidden = !ok.has(i); });
  boutons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cat === courant)));
}

boutons.forEach((b) => b.addEventListener("click", () => {
  const cat = b.dataset.cat;
  history.pushState(null, "", cat === "tout" ? "#travaux" : `#travaux/${cat}`);
  filtrer(cat);
}));
addEventListener("popstate", () => filtrer(lireHash(location.hash)));
filtrer(lireHash(location.hash));
if (location.hash.startsWith("#travaux/")) document.getElementById("travaux").scrollIntoView();

/* Visionneuse */
const vis = document.getElementById("visionneuse");
const visImg = vis.querySelector(".vis-image");
const visLegende = vis.querySelector(".vis-legende");
const visCompteur = vis.querySelector(".vis-compteur");
const visPdf = vis.querySelector(".vis-pdf");
let liste = [];
let pos = 0;
let origine = null;

function afficher() {
  const lien = vignettes[liste[pos]].querySelector("a");
  const alt = lien.querySelector("img").alt;
  visImg.src = lien.href;
  visImg.alt = alt;
  visLegende.textContent = alt;
  visCompteur.textContent = `${pos + 1} / ${liste.length}`;
  visPdf.hidden = !lien.dataset.pdf;
  if (lien.dataset.pdf) visPdf.href = lien.dataset.pdf;
}

grille.addEventListener("click", (e) => {
  const lien = e.target.closest(".vignette a");
  if (!lien || e.ctrlKey || e.metaKey || e.shiftKey) return;
  e.preventDefault();
  liste = visibles(items, courant);
  pos = liste.indexOf(vignettes.indexOf(lien.parentElement));
  origine = lien;
  afficher();
  vis.showModal();
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
vis.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
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

/* Apparitions et tracé du chemin */
const calme = matchMedia("(prefers-reduced-motion: reduce)").matches;
const trait = document.getElementById("chemin-trait");
if (!calme && trait) {
  const long = trait.getTotalLength();
  trait.style.strokeDasharray = long;
  trait.style.strokeDashoffset = long;
  const dessiner = () => {
    const r = trait.closest(".chemin").getBoundingClientRect();
    const avance = Math.min(1, Math.max(0, (innerHeight * 0.8 - r.top) / r.height));
    trait.style.strokeDashoffset = long * (1 - avance);
  };
  addEventListener("scroll", dessiner, { passive: true });
  dessiner();
}
const obs = new IntersectionObserver((entrees) => entrees.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("vu"); obs.unobserve(e.target); }
}), { threshold: 0.15 });
document.querySelectorAll(".visible-au-scroll").forEach((el) => obs.observe(el));
