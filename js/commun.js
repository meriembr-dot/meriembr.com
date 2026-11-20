// Partagé par l'accueil et les pages projet : visionneuse, menu mobile, curseur.
import { voisin } from "./galerie.js";

export const calme = matchMedia("(prefers-reduced-motion: reduce)").matches;
export const modifie = (e) => e.ctrlKey || e.metaKey || e.shiftKey;

/* Visionneuse : parcourt la liste de liens donnée à ouvrir(), rend le focus au lien d'origine */
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

export function ouvrir(liens, lien) {
  liste = liens;
  pos = liens.indexOf(lien);
  origine = lien;
  afficher();
  vis.showModal();
}

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

/* Galeries simples (pages projet) : chaque lien d'un [data-galerie] s'ouvre parmi ses voisins */
for (const g of document.querySelectorAll("[data-galerie]")) {
  const liens = [...g.querySelectorAll("a")];
  g.addEventListener("click", (e) => {
    const lien = e.target.closest("a");
    if (!lien || modifie(e)) return;
    e.preventDefault();
    ouvrir(liens, lien);
  });
}

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
    const grand = !!e.target.closest(".projet-confiance, .vignette a, [data-galerie] a");
    curseur.classList.toggle("grand", grand);
    curseur.textContent = grand ? voir : "";
  });
}
