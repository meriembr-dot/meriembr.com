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
  history.pushState(null, "", cat === "tout" ? "#toutes" : `#travaux/${cat}`);
  filtrer(cat);
}));
addEventListener("popstate", () => filtrer(lireHash(location.hash)));
filtrer(lireHash(location.hash));
if (location.hash.startsWith("#travaux/")) document.getElementById("toutes").scrollIntoView();

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

function ouvrir(vignette, depuis) {
  liste = visibles(items, courant);
  pos = liste.indexOf(vignettes.indexOf(vignette));
  origine = depuis;
  afficher();
  vis.showModal();
}

const modifie = (e) => e.ctrlKey || e.metaKey || e.shiftKey;
grille.addEventListener("click", (e) => {
  const lien = e.target.closest(".vignette a");
  if (!lien || modifie(e)) return;
  e.preventDefault();
  ouvrir(lien.parentElement, lien);
});
document.getElementById("selection").addEventListener("click", (e) => {
  const projet = e.target.closest(".projet");
  if (!projet || modifie(e)) return;
  const cible = vignettes.find((v) => v.querySelector("a").getAttribute("href") === projet.getAttribute("href"));
  if (!cible) return;
  e.preventDefault();
  filtrer("tout");
  ouvrir(cible, projet);
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

/* Apparitions */
const obs = new IntersectionObserver((entrees) => entrees.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("vu"); obs.unobserve(e.target); }
}), { threshold: 0.15 });
document.querySelectorAll(".visible-au-scroll").forEach((el) => obs.observe(el));

/* Yeux et curseur : souris seulement, coupés si mouvement réduit */
const calme = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!calme && !matchMedia("(hover: none)").matches) {
  const pupilles = [...document.querySelectorAll(".pupille")];
  const svg = document.querySelector(".avatar svg");
  const curseur = document.querySelector(".curseur");
  const voir = document.documentElement.lang === "en" ? "View" : "Voir";
  addEventListener("pointermove", (e) => {
    curseur.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    curseur.classList.add("actif");
    const m = svg.getScreenCTM();
    if (!m) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    // Une seule direction pour les deux yeux, depuis le milieu des yeux : regard parallèle, jamais convergent.
    const a = Math.atan2(p.y - 379, p.x - 647);
    const d = Math.min(1, Math.hypot(p.x - 647, p.y - 379) / 400);
    const t = `translate(${Math.cos(a) * d * 16} ${Math.sin(a) * d * 5})`;
    for (const o of pupilles) o.setAttribute("transform", t);
  });
  document.documentElement.addEventListener("pointerleave", () => curseur.classList.remove("actif"));
  addEventListener("pointerover", (e) => {
    const grand = !!e.target.closest(".projet, .vignette a");
    curseur.classList.toggle("grand", grand);
    curseur.textContent = grand ? voir : "";
  });
}
